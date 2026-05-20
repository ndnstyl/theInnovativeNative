-- ============================================================================
-- 017 NOTIFICATIONS — Supplements, notification_preferences, thread_subscriptions,
-- trigger functions, batch grouping
-- ============================================================================

-- ============================================================================
-- 1. Alter existing notifications table (already exists from unified schema)
-- ============================================================================

ALTER TABLE notifications ADD COLUMN IF NOT EXISTS source_user_id uuid REFERENCES profiles(id) ON DELETE SET NULL;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'generic';
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS content_type text;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS content_id uuid;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS group_id uuid REFERENCES notifications(id) ON DELETE SET NULL;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS group_count integer NOT NULL DEFAULT 1;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS group_members jsonb DEFAULT '[]'::jsonb;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS is_read boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON notifications (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications (user_id) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_group ON notifications (group_id) WHERE group_id IS NOT NULL;

-- ============================================================================
-- 2. New Tables
-- ============================================================================

CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  notification_type text NOT NULL,
  channel text NOT NULL CHECK (channel IN ('in_app', 'email')),
  enabled boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, notification_type, channel)
);

CREATE TABLE IF NOT EXISTS thread_subscriptions (
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  subscribed boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, post_id)
);

-- ============================================================================
-- 3. RLS
-- ============================================================================

ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE thread_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notification_preferences_own" ON notification_preferences FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "thread_subscriptions_own" ON thread_subscriptions FOR ALL
  USING (user_id = auth.uid());

-- ============================================================================
-- 4. Core notification creation function with batch grouping
-- ============================================================================

CREATE OR REPLACE FUNCTION create_notification(
  p_target_user_id uuid,
  p_source_user_id uuid,
  p_type text,
  p_content_type text,
  p_content_id uuid,
  p_description text
)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_existing_id uuid;
  v_community_id uuid := 'a0000000-0000-0000-0000-000000000001'::uuid;
  v_pref_enabled boolean;
  v_source_name text;
BEGIN
  -- Skip self-notifications
  IF p_target_user_id = p_source_user_id THEN RETURN; END IF;

  -- Check if blocked
  IF EXISTS (SELECT 1 FROM member_blocks WHERE blocker_id = p_target_user_id AND blocked_id = p_source_user_id) THEN
    RETURN;
  END IF;

  -- Check in_app preference (no row = enabled by default)
  SELECT enabled INTO v_pref_enabled
  FROM notification_preferences
  WHERE user_id = p_target_user_id AND notification_type = p_type AND channel = 'in_app';

  IF v_pref_enabled IS NOT NULL AND NOT v_pref_enabled THEN RETURN; END IF;

  -- Get source user name for group_members
  SELECT display_name INTO v_source_name FROM profiles WHERE id = p_source_user_id;

  -- Batch grouping: check for existing notification of same type+content within 10 minutes
  SELECT id INTO v_existing_id
  FROM notifications
  WHERE user_id = p_target_user_id
    AND type = p_type
    AND content_id = p_content_id
    AND created_at > now() - interval '10 minutes'
    AND group_id IS NULL
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_existing_id IS NOT NULL THEN
    -- Update existing notification as group parent
    UPDATE notifications
    SET group_count = group_count + 1,
        group_members = group_members || jsonb_build_object('id', p_source_user_id, 'name', v_source_name),
        is_read = false,
        created_at = now()
    WHERE id = v_existing_id;
    RETURN;
  END IF;

  -- Create new notification
  INSERT INTO notifications (community_id, user_id, source_user_id, type, content_type, content_id, description, group_members)
  VALUES (
    v_community_id,
    p_target_user_id,
    p_source_user_id,
    p_type,
    p_content_type,
    p_content_id,
    p_description,
    jsonb_build_array(jsonb_build_object('id', p_source_user_id, 'name', v_source_name))
  );
END;
$$;

-- ============================================================================
-- 5. Helper functions
-- ============================================================================

CREATE OR REPLACE FUNCTION get_unread_notification_count()
RETURNS integer
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT COUNT(*)::integer FROM notifications WHERE user_id = auth.uid() AND is_read = false;
$$;

CREATE OR REPLACE FUNCTION mark_all_notifications_read()
RETURNS void
LANGUAGE sql SECURITY DEFINER
AS $$
  UPDATE notifications SET is_read = true WHERE user_id = auth.uid() AND is_read = false;
$$;

-- ============================================================================
-- 6. Notification triggers for existing tables
-- ============================================================================

-- Like on post → notify post author
CREATE OR REPLACE FUNCTION notify_on_like()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_author_id uuid;
  v_post_title text;
BEGIN
  -- Get post author
  SELECT author_id, LEFT(title, 50) INTO v_author_id, v_post_title
  FROM posts WHERE id = NEW.post_id;

  IF v_author_id IS NOT NULL THEN
    PERFORM create_notification(
      v_author_id,
      NEW.user_id,
      'like_post',
      'post',
      NEW.post_id,
      'liked your post'
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_on_like ON reactions;
CREATE TRIGGER trg_notify_on_like
  AFTER INSERT ON reactions
  FOR EACH ROW
  WHEN (NEW.reaction_type = 'like')
  EXECUTE FUNCTION notify_on_like();

-- Comment on post → notify post author + thread subscribers
CREATE OR REPLACE FUNCTION notify_on_comment()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_author_id uuid;
  v_subscriber RECORD;
BEGIN
  -- Notify post author
  SELECT author_id INTO v_author_id FROM posts WHERE id = NEW.post_id;
  IF v_author_id IS NOT NULL AND v_author_id != NEW.author_id THEN
    PERFORM create_notification(
      v_author_id,
      NEW.author_id,
      'comment_post',
      'post',
      NEW.post_id,
      'commented on your post'
    );
  END IF;

  -- Notify thread subscribers (excluding author and commenter)
  FOR v_subscriber IN
    SELECT user_id FROM thread_subscriptions
    WHERE post_id = NEW.post_id
      AND subscribed = true
      AND user_id != NEW.author_id
      AND user_id != v_author_id
  LOOP
    PERFORM create_notification(
      v_subscriber.user_id,
      NEW.author_id,
      'reply_comment',
      'post',
      NEW.post_id,
      'replied in a thread you follow'
    );
  END LOOP;

  -- Auto-subscribe commenter to thread
  INSERT INTO thread_subscriptions (user_id, post_id)
  VALUES (NEW.author_id, NEW.post_id)
  ON CONFLICT (user_id, post_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_on_comment ON comments;
CREATE TRIGGER trg_notify_on_comment
  AFTER INSERT ON comments
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_comment();

-- DM received → notify recipient
CREATE OR REPLACE FUNCTION notify_on_dm()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_recipient_id uuid;
BEGIN
  SELECT user_id INTO v_recipient_id
  FROM conversation_participants
  WHERE conversation_id = NEW.conversation_id
    AND user_id != NEW.sender_id
  LIMIT 1;

  IF v_recipient_id IS NOT NULL THEN
    PERFORM create_notification(
      v_recipient_id,
      NEW.sender_id,
      'dm_received',
      'conversation',
      NEW.conversation_id,
      'sent you a message'
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_on_dm ON messages;
CREATE TRIGGER trg_notify_on_dm
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_dm();

-- ============================================================================
-- MIGRATION COMPLETE
-- Altered: notifications table (added 8 columns, 3 indexes)
-- Created: notification_preferences, thread_subscriptions tables
-- Functions: create_notification, get_unread_notification_count,
--            mark_all_notifications_read, notify_on_like, notify_on_comment,
--            notify_on_dm
-- ============================================================================
