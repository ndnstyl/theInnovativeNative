-- ============================================================================
-- 027 PRIVACY & GDPR — Data export, deletion, consent tracking
-- ============================================================================

-- Consent records
CREATE TABLE IF NOT EXISTS consent_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  consent_type text NOT NULL,
  granted boolean NOT NULL DEFAULT true,
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_consent_user ON consent_records (user_id, consent_type);

ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "consent_own_select" ON consent_records FOR SELECT
  USING (user_id = auth.uid());
CREATE POLICY "consent_own_insert" ON consent_records FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Data deletion requests
CREATE TABLE IF NOT EXISTS deletion_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  reason text,
  requested_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  processed_by text -- 'auto' or admin user_id
);

ALTER TABLE deletion_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "deletion_own" ON deletion_requests FOR SELECT
  USING (user_id = auth.uid());
CREATE POLICY "deletion_request" ON deletion_requests FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Data export function (returns user's data as JSON)
CREATE OR REPLACE FUNCTION export_user_data(p_user_id uuid DEFAULT auth.uid())
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_result jsonb;
BEGIN
  -- Only allow users to export their own data
  IF p_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Can only export your own data';
  END IF;

  SELECT jsonb_build_object(
    'profile', (SELECT row_to_json(p.*) FROM profiles p WHERE p.id = p_user_id),
    'posts', (SELECT coalesce(json_agg(row_to_json(p.*)), '[]'::json) FROM posts p WHERE p.author_id = p_user_id AND p.deleted_at IS NULL),
    'comments', (SELECT coalesce(json_agg(row_to_json(c.*)), '[]'::json) FROM comments c WHERE c.author_id = p_user_id AND c.deleted_at IS NULL),
    'enrollments', (SELECT coalesce(json_agg(row_to_json(e.*)), '[]'::json) FROM enrollments e WHERE e.user_id = p_user_id),
    'lesson_progress', (SELECT coalesce(json_agg(row_to_json(lp.*)), '[]'::json) FROM lesson_progress lp WHERE lp.user_id = p_user_id),
    'exported_at', now()
  ) INTO v_result;

  RETURN v_result;
END;
$$;

-- Anonymize user data (for deletion requests)
CREATE OR REPLACE FUNCTION anonymize_user(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  -- Only service role should call this
  UPDATE profiles SET
    display_name = 'Deleted User',
    username = 'deleted-' || substr(p_user_id::text, 1, 8),
    avatar_url = NULL,
    bio = NULL,
    location = NULL,
    website = NULL,
    social_links = '{}'::jsonb,
    search_vector = NULL,
    membership_status = 'deleted'
  WHERE id = p_user_id;

  -- Soft-delete posts
  UPDATE posts SET deleted_at = now() WHERE author_id = p_user_id AND deleted_at IS NULL;

  -- Soft-delete comments
  UPDATE comments SET deleted_at = now() WHERE author_id = p_user_id AND deleted_at IS NULL;

  -- Remove from conversations
  DELETE FROM conversation_participants WHERE user_id = p_user_id;

  -- Delete messages
  DELETE FROM messages WHERE sender_id = p_user_id;

  -- Mark deletion request as completed
  UPDATE deletion_requests SET status = 'completed', completed_at = now(), processed_by = 'auto'
  WHERE user_id = p_user_id AND status = 'pending';
END;
$$;

-- ============================================================================
-- MIGRATION COMPLETE
-- Created: consent_records, deletion_requests
-- Functions: export_user_data, anonymize_user
-- ============================================================================
