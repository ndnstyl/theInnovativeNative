-- ============================================================================
-- 018 ADMIN DASHBOARD & ANALYTICS — Tables, RPC functions, RLS
-- ============================================================================

-- ============================================================================
-- 1. New Tables
-- ============================================================================

CREATE TABLE IF NOT EXISTS community_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  community_name text NOT NULL DEFAULT 'My Community',
  description text,
  banner_url text,
  logo_url text,
  privacy_mode text NOT NULL DEFAULT 'public' CHECK (privacy_mode IN ('public', 'private', 'approval_required')),
  post_categories jsonb DEFAULT '[]'::jsonb,
  timezone text NOT NULL DEFAULT 'UTC',
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES profiles(id),
  UNIQUE(community_id)
);

CREATE TABLE IF NOT EXISTS content_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  reporter_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content_type text NOT NULL CHECK (content_type IN ('post', 'comment')),
  content_id uuid NOT NULL,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'dismissed', 'actioned')),
  admin_action text,
  actioned_by uuid REFERENCES profiles(id),
  actioned_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON content_reports (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_content ON content_reports (content_type, content_id);

CREATE TABLE IF NOT EXISTS admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  target_type text,
  target_id text,
  description text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_admin ON admin_audit_log (admin_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_action ON admin_audit_log (action_type, created_at DESC);

CREATE TABLE IF NOT EXISTS dashboard_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  metric_name text NOT NULL,
  current_value numeric NOT NULL DEFAULT 0,
  previous_value numeric DEFAULT 0,
  trend_percentage numeric DEFAULT 0,
  trend_direction text DEFAULT 'flat' CHECK (trend_direction IN ('up', 'down', 'flat')),
  computed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(community_id, metric_name)
);

CREATE TABLE IF NOT EXISTS analytics_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  snapshot_date date NOT NULL,
  metric_name text NOT NULL,
  value numeric NOT NULL DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(community_id, snapshot_date, metric_name)
);

CREATE INDEX IF NOT EXISTS idx_snapshots_metric ON analytics_snapshots (metric_name, snapshot_date DESC);

-- ============================================================================
-- 2. RLS
-- ============================================================================

ALTER TABLE community_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_snapshots ENABLE ROW LEVEL SECURITY;

-- community_settings: all read, admin update
CREATE POLICY "community_settings_select" ON community_settings FOR SELECT USING (true);
CREATE POLICY "community_settings_update" ON community_settings FOR UPDATE USING (is_community_admin(community_id));

-- content_reports: member insert, admin/mod select+update
CREATE POLICY "content_reports_insert" ON content_reports FOR INSERT
  WITH CHECK (is_active_member(community_id));
CREATE POLICY "content_reports_admin" ON content_reports FOR SELECT
  USING (is_community_admin(community_id) OR is_community_moderator(community_id));
CREATE POLICY "content_reports_action" ON content_reports FOR UPDATE
  USING (is_community_admin(community_id) OR is_community_moderator(community_id));

-- admin_audit_log: admin read only
CREATE POLICY "audit_log_select" ON admin_audit_log FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM community_members
    WHERE member_id = auth.uid() AND role IN ('admin', 'owner')
  ));

-- dashboard_metrics: admin read
CREATE POLICY "dashboard_metrics_select" ON dashboard_metrics FOR SELECT
  USING (is_community_admin(community_id));

-- analytics_snapshots: admin read
CREATE POLICY "analytics_snapshots_select" ON analytics_snapshots FOR SELECT
  USING (is_community_admin(community_id));

-- ============================================================================
-- 3. Functions
-- ============================================================================

-- Log admin action
CREATE OR REPLACE FUNCTION log_admin_action(
  p_action_type text,
  p_target_type text,
  p_target_id text,
  p_description text,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO admin_audit_log (admin_user_id, action_type, target_type, target_id, description, metadata)
  VALUES (auth.uid(), p_action_type, p_target_type, p_target_id, p_description, p_metadata);
END;
$$;

-- Ban member
CREATE OR REPLACE FUNCTION ban_member(p_member_id uuid, p_reason text DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_target_role text;
  v_admin_role text;
BEGIN
  -- Prevent self-ban
  IF p_member_id = auth.uid() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Cannot ban yourself');
  END IF;

  -- Check admin role
  SELECT role INTO v_admin_role FROM community_members WHERE member_id = auth.uid() LIMIT 1;
  IF v_admin_role NOT IN ('admin', 'owner') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authorized');
  END IF;

  -- Check target role
  SELECT role INTO v_target_role FROM community_members WHERE member_id = p_member_id LIMIT 1;
  IF v_target_role IN ('admin', 'owner') AND v_admin_role != 'owner' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only owner can ban admins');
  END IF;

  -- Ban
  UPDATE community_members SET status = 'banned' WHERE member_id = p_member_id;

  -- Log
  PERFORM log_admin_action('ban_member', 'member', p_member_id::text, COALESCE(p_reason, 'Banned by admin'));

  RETURN jsonb_build_object('success', true);
END;
$$;

-- Unban member
CREATE OR REPLACE FUNCTION unban_member(p_member_id uuid)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  UPDATE community_members SET status = 'active' WHERE member_id = p_member_id AND status = 'banned';
  PERFORM log_admin_action('unban_member', 'member', p_member_id::text, 'Unbanned by admin');
  RETURN jsonb_build_object('success', true);
END;
$$;

-- Remove content (soft delete)
CREATE OR REPLACE FUNCTION remove_content(p_content_type text, p_content_id uuid, p_report_id uuid DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  IF p_content_type = 'post' THEN
    UPDATE posts SET deleted_at = now() WHERE id = p_content_id;
  ELSIF p_content_type = 'comment' THEN
    UPDATE comments SET deleted_at = now() WHERE id = p_content_id;
  END IF;

  -- Update report if provided
  IF p_report_id IS NOT NULL THEN
    UPDATE content_reports SET status = 'actioned', admin_action = 'removed', actioned_by = auth.uid(), actioned_at = now()
    WHERE id = p_report_id;
  END IF;

  PERFORM log_admin_action('remove_content', p_content_type, p_content_id::text, 'Content removed by admin');
  RETURN jsonb_build_object('success', true);
END;
$$;

-- Insert default community settings
INSERT INTO community_settings (community_id, community_name, description)
VALUES ('a0000000-0000-0000-0000-000000000001', 'The Innovative Native', 'AI-powered entrepreneurship community')
ON CONFLICT (community_id) DO NOTHING;

-- ============================================================================
-- MIGRATION COMPLETE
-- Created: community_settings, content_reports, admin_audit_log,
--          dashboard_metrics, analytics_snapshots
-- Functions: log_admin_action, ban_member, unban_member, remove_content
-- ============================================================================
