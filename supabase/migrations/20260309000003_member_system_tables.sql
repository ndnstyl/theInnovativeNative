-- ============================================================================
-- 013 MEMBER SYSTEM — SUPPLEMENTAL TABLES
-- Tables not included in unified schema: follows, member_bans,
-- membership_questions, membership_requests, invitations
-- ============================================================================

-- membership_questions — Admin-configured questions for joining
CREATE TABLE IF NOT EXISTS membership_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  question_text text NOT NULL CHECK (char_length(question_text) <= 200),
  is_required boolean NOT NULL DEFAULT true,
  sort_order smallint NOT NULL CHECK (sort_order BETWEEN 1 AND 3),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- membership_requests — Applicant answers + approval status
CREATE TABLE IF NOT EXISTS membership_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  answers jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined')),
  reviewed_by uuid REFERENCES profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_membership_requests_status ON membership_requests (status, created_at DESC);

-- invitations — Email invitations to join community
CREATE TABLE IF NOT EXISTS invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  email text NOT NULL,
  invited_by uuid NOT NULL REFERENCES profiles(id),
  token uuid UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  personal_message text CHECK (char_length(personal_message) <= 500),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'revoked')),
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_invitations_token ON invitations (token);

-- follows — Member follow relationships
CREATE TABLE IF NOT EXISTS follows (
  follower_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (follower_id, following_id),
  CONSTRAINT follows_no_self CHECK (follower_id != following_id)
);
CREATE INDEX IF NOT EXISTS idx_follows_following ON follows (following_id);

-- member_bans — Ban records
CREATE TABLE IF NOT EXISTS member_bans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  banned_by uuid NOT NULL REFERENCES profiles(id),
  reason text CHECK (char_length(reason) <= 500),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (community_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_member_bans_user ON member_bans (user_id);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

ALTER TABLE membership_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_bans ENABLE ROW LEVEL SECURITY;

-- membership_questions: all authenticated can read, admin/owner can write
CREATE POLICY "membership_questions_select" ON membership_questions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "membership_questions_admin_insert" ON membership_questions
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM community_members
      WHERE community_members.community_id = membership_questions.community_id
        AND community_members.member_id = auth.uid()
        AND community_members.role IN ('owner', 'admin')
        AND community_members.deleted_at IS NULL
    )
  );

CREATE POLICY "membership_questions_admin_update" ON membership_questions
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM community_members
      WHERE community_members.community_id = membership_questions.community_id
        AND community_members.member_id = auth.uid()
        AND community_members.role IN ('owner', 'admin')
        AND community_members.deleted_at IS NULL
    )
  );

CREATE POLICY "membership_questions_admin_delete" ON membership_questions
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM community_members
      WHERE community_members.community_id = membership_questions.community_id
        AND community_members.member_id = auth.uid()
        AND community_members.role IN ('owner', 'admin')
        AND community_members.deleted_at IS NULL
    )
  );

-- membership_requests: own user reads own, admin reads all, admin updates
CREATE POLICY "membership_requests_own_select" ON membership_requests
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "membership_requests_admin_select" ON membership_requests
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM community_members
      WHERE community_members.community_id = membership_requests.community_id
        AND community_members.member_id = auth.uid()
        AND community_members.role IN ('owner', 'admin')
        AND community_members.deleted_at IS NULL
    )
  );

CREATE POLICY "membership_requests_insert" ON membership_requests
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "membership_requests_admin_update" ON membership_requests
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM community_members
      WHERE community_members.community_id = membership_requests.community_id
        AND community_members.member_id = auth.uid()
        AND community_members.role IN ('owner', 'admin')
        AND community_members.deleted_at IS NULL
    )
  );

-- invitations: admin/owner insert + read
CREATE POLICY "invitations_admin_select" ON invitations
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM community_members
      WHERE community_members.community_id = invitations.community_id
        AND community_members.member_id = auth.uid()
        AND community_members.role IN ('owner', 'admin')
        AND community_members.deleted_at IS NULL
    )
  );

CREATE POLICY "invitations_admin_insert" ON invitations
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM community_members
      WHERE community_members.community_id = invitations.community_id
        AND community_members.member_id = auth.uid()
        AND community_members.role IN ('owner', 'admin')
        AND community_members.deleted_at IS NULL
    )
  );

CREATE POLICY "invitations_admin_update" ON invitations
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM community_members
      WHERE community_members.community_id = invitations.community_id
        AND community_members.member_id = auth.uid()
        AND community_members.role IN ('owner', 'admin')
        AND community_members.deleted_at IS NULL
    )
  );

-- follows: authenticated insert/delete own, all authenticated read
CREATE POLICY "follows_select" ON follows
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "follows_insert" ON follows
  FOR INSERT TO authenticated
  WITH CHECK (follower_id = auth.uid());

CREATE POLICY "follows_delete" ON follows
  FOR DELETE TO authenticated
  USING (follower_id = auth.uid());

-- member_bans: admin/owner insert/delete, no member read
CREATE POLICY "member_bans_admin_select" ON member_bans
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM community_members
      WHERE community_members.community_id = member_bans.community_id
        AND community_members.member_id = auth.uid()
        AND community_members.role IN ('owner', 'admin')
        AND community_members.deleted_at IS NULL
    )
  );

CREATE POLICY "member_bans_admin_insert" ON member_bans
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM community_members
      WHERE community_members.community_id = member_bans.community_id
        AND community_members.member_id = auth.uid()
        AND community_members.role IN ('owner', 'admin')
        AND community_members.deleted_at IS NULL
    )
  );

CREATE POLICY "member_bans_admin_delete" ON member_bans
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM community_members
      WHERE community_members.community_id = member_bans.community_id
        AND community_members.member_id = auth.uid()
        AND community_members.role IN ('owner', 'admin')
        AND community_members.deleted_at IS NULL
    )
  );

-- ============================================================================
-- DATABASE FUNCTIONS
-- ============================================================================

-- update_last_active: debounced to 5 min
CREATE OR REPLACE FUNCTION update_last_active(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET last_active_at = now()
  WHERE id = p_user_id
    AND (last_active_at IS NULL OR last_active_at < now() - interval '5 minutes');
END;
$$;

-- generate_username_slug: creates unique URL-safe slug from display name
CREATE OR REPLACE FUNCTION generate_username_slug(p_display_name text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_slug text;
  v_exists boolean;
BEGIN
  -- Slugify: lowercase, replace spaces/special chars with hyphens, strip non-alphanumeric except hyphens
  v_slug := lower(trim(p_display_name));
  v_slug := regexp_replace(v_slug, '[^a-z0-9]+', '-', 'g');
  v_slug := regexp_replace(v_slug, '^-+|-+$', '', 'g');
  v_slug := left(v_slug, 30);

  -- Ensure minimum length
  IF char_length(v_slug) < 3 THEN
    v_slug := v_slug || '-' || floor(random() * 9000 + 1000)::text;
  END IF;

  -- Check uniqueness
  SELECT EXISTS(SELECT 1 FROM profiles WHERE username = v_slug) INTO v_exists;

  IF v_exists THEN
    v_slug := left(v_slug, 25) || '-' || floor(random() * 9000 + 1000)::text;
  END IF;

  RETURN v_slug;
END;
$$;

-- get_activity_heatmap: 90-day activity data for profile
CREATE OR REPLACE FUNCTION get_activity_heatmap(p_user_id uuid)
RETURNS TABLE(activity_date date, activity_count integer)
LANGUAGE sql
STABLE
AS $$
  SELECT
    completed_at::date AS activity_date,
    count(*)::integer AS activity_count
  FROM lesson_progress
  WHERE user_id = p_user_id
    AND completed = true
    AND completed_at >= now() - interval '90 days'
  GROUP BY completed_at::date
  ORDER BY activity_date;
$$;

-- change_member_role: enforces hierarchy
CREATE OR REPLACE FUNCTION change_member_role(p_target_member_id uuid, p_new_role text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_caller_role text;
  v_target_role text;
  v_community_id uuid;
  v_owner_count integer;
BEGIN
  -- Get caller's role
  SELECT cm.role, cm.community_id INTO v_caller_role, v_community_id
  FROM community_members cm
  WHERE cm.member_id = auth.uid()
    AND cm.deleted_at IS NULL
  LIMIT 1;

  IF v_caller_role IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not a community member');
  END IF;

  -- Get target's current role
  SELECT cm.role INTO v_target_role
  FROM community_members cm
  WHERE cm.member_id = p_target_member_id
    AND cm.community_id = v_community_id
    AND cm.deleted_at IS NULL;

  IF v_target_role IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Target not found');
  END IF;

  -- Validate new role
  IF p_new_role NOT IN ('owner', 'admin', 'moderator', 'member') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid role');
  END IF;

  -- Hierarchy enforcement
  IF v_caller_role = 'owner' THEN
    -- Owner can set any role, but check last owner demotion
    IF v_target_role = 'owner' AND p_new_role != 'owner' THEN
      SELECT count(*) INTO v_owner_count
      FROM community_members
      WHERE community_id = v_community_id AND role = 'owner' AND deleted_at IS NULL;
      IF v_owner_count <= 1 THEN
        RETURN jsonb_build_object('success', false, 'error', 'Cannot demote the last owner');
      END IF;
    END IF;
  ELSIF v_caller_role = 'admin' THEN
    -- Admin can only set moderator or member, cannot touch owners or other admins
    IF v_target_role IN ('owner', 'admin') THEN
      RETURN jsonb_build_object('success', false, 'error', 'Cannot modify owner or admin');
    END IF;
    IF p_new_role IN ('owner', 'admin') THEN
      RETURN jsonb_build_object('success', false, 'error', 'Cannot promote to owner or admin');
    END IF;
  ELSE
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient permissions');
  END IF;

  -- Apply change
  UPDATE community_members
  SET role = p_new_role
  WHERE member_id = p_target_member_id
    AND community_id = v_community_id
    AND deleted_at IS NULL;

  RETURN jsonb_build_object('success', true, 'new_role', p_new_role);
END;
$$;

-- updated_at triggers for new tables
CREATE TRIGGER set_membership_questions_updated_at
  BEFORE UPDATE ON membership_questions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
