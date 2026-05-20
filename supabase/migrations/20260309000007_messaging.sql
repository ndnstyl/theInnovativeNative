-- ============================================================================
-- 016 DIRECT MESSAGING — Schema supplements, RPC functions, triggers
-- Adapts deployed conversations/messages/conversation_participants tables
-- Adds member_blocks, conversation_mutes, autodm_config, FTS, functions
-- ============================================================================

-- ============================================================================
-- 1. New Tables
-- ============================================================================

CREATE TABLE IF NOT EXISTS member_blocks (
  blocker_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  blocked_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (blocker_id, blocked_id),
  CHECK (blocker_id != blocked_id)
);

CREATE TABLE IF NOT EXISTS conversation_mutes (
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, conversation_id)
);

CREATE TABLE IF NOT EXISTS autodm_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  admin_user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message_content text NOT NULL CHECK (char_length(message_content) <= 2000),
  is_enabled boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(community_id)
);

-- ============================================================================
-- 2. Alter existing tables
-- ============================================================================

-- conversations: add preview text
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS last_message_preview text;

-- messages: add FTS column and content length check
ALTER TABLE messages ADD COLUMN IF NOT EXISTS content_tsv tsvector
  GENERATED ALWAYS AS (to_tsvector('english', body)) STORED;

-- conversation_participants: add last_read_message_id for precise unread tracking
ALTER TABLE conversation_participants ADD COLUMN IF NOT EXISTS last_read_message_id uuid REFERENCES messages(id) ON DELETE SET NULL;

-- ============================================================================
-- 3. Indexes
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON messages (conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_fts ON messages USING GIN (content_tsv);
CREATE INDEX IF NOT EXISTS idx_conv_participants_user ON conversation_participants (user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON conversations (last_message_at DESC);

-- ============================================================================
-- 4. RLS on new tables
-- ============================================================================

ALTER TABLE member_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_mutes ENABLE ROW LEVEL SECURITY;
ALTER TABLE autodm_config ENABLE ROW LEVEL SECURITY;

-- member_blocks: only own blocks
CREATE POLICY "member_blocks_own" ON member_blocks FOR ALL
  USING (blocker_id = auth.uid());

-- conversation_mutes: only own mutes
CREATE POLICY "conversation_mutes_own" ON conversation_mutes FOR ALL
  USING (user_id = auth.uid());

-- autodm_config: read for admin, manage for admin
CREATE POLICY "autodm_config_select" ON autodm_config FOR SELECT
  USING (is_community_admin(community_id));
CREATE POLICY "autodm_config_manage" ON autodm_config FOR ALL
  USING (is_community_admin(community_id));

-- ============================================================================
-- 5. RPC — Get or create 1:1 conversation
-- ============================================================================

CREATE OR REPLACE FUNCTION get_or_create_conversation(p_other_user_id uuid)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_my_id uuid := auth.uid();
  v_conv_id uuid;
  v_community_id uuid := 'a0000000-0000-0000-0000-000000000001'::uuid;
BEGIN
  -- Check if blocked
  IF EXISTS (SELECT 1 FROM member_blocks WHERE blocker_id = p_other_user_id AND blocked_id = v_my_id) THEN
    RAISE EXCEPTION 'Cannot message this member';
  END IF;

  -- Find existing conversation between these two users
  SELECT cp1.conversation_id INTO v_conv_id
  FROM conversation_participants cp1
  JOIN conversation_participants cp2 ON cp1.conversation_id = cp2.conversation_id
  WHERE cp1.user_id = v_my_id AND cp2.user_id = p_other_user_id;

  IF v_conv_id IS NOT NULL THEN
    RETURN v_conv_id;
  END IF;

  -- Create new conversation
  INSERT INTO conversations (community_id) VALUES (v_community_id) RETURNING id INTO v_conv_id;
  INSERT INTO conversation_participants (conversation_id, user_id) VALUES (v_conv_id, v_my_id);
  INSERT INTO conversation_participants (conversation_id, user_id) VALUES (v_conv_id, p_other_user_id);

  RETURN v_conv_id;
END;
$$;

-- ============================================================================
-- 6. RPC — Get unread conversation count
-- ============================================================================

CREATE OR REPLACE FUNCTION get_unread_conversation_count()
RETURNS integer
LANGUAGE plpgsql SECURITY DEFINER STABLE
AS $$
DECLARE
  v_count integer;
BEGIN
  SELECT COUNT(DISTINCT cp.conversation_id) INTO v_count
  FROM conversation_participants cp
  JOIN conversations c ON c.id = cp.conversation_id
  WHERE cp.user_id = auth.uid()
    AND c.last_message_at IS NOT NULL
    AND (
      cp.last_read_message_id IS NULL
      OR EXISTS (
        SELECT 1 FROM messages m
        WHERE m.conversation_id = cp.conversation_id
          AND m.sender_id != auth.uid()
          AND m.created_at > (
            SELECT m2.created_at FROM messages m2 WHERE m2.id = cp.last_read_message_id
          )
      )
    )
    -- Exclude muted conversations
    AND NOT EXISTS (
      SELECT 1 FROM conversation_mutes cm
      WHERE cm.user_id = auth.uid() AND cm.conversation_id = cp.conversation_id
    );

  RETURN COALESCE(v_count, 0);
END;
$$;

-- ============================================================================
-- 7. Trigger — Update conversation on new message
-- ============================================================================

CREATE OR REPLACE FUNCTION update_conversation_on_message()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  UPDATE conversations
  SET last_message_at = NEW.created_at,
      last_message_preview = LEFT(NEW.body, 80)
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_conversation_on_message ON messages;
CREATE TRIGGER trg_update_conversation_on_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_on_message();

-- ============================================================================
-- 8. Trigger — Block check before message insert
-- ============================================================================

CREATE OR REPLACE FUNCTION check_block_before_message()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_recipient_id uuid;
BEGIN
  -- Find the other participant
  SELECT user_id INTO v_recipient_id
  FROM conversation_participants
  WHERE conversation_id = NEW.conversation_id
    AND user_id != NEW.sender_id
  LIMIT 1;

  -- If blocked, silently reject
  IF EXISTS (SELECT 1 FROM member_blocks WHERE blocker_id = v_recipient_id AND blocked_id = NEW.sender_id) THEN
    RETURN NULL; -- Prevent insert
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_check_block_before_message ON messages;
CREATE TRIGGER trg_check_block_before_message
  BEFORE INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION check_block_before_message();

-- ============================================================================
-- 9. RPC — Search messages in conversation
-- ============================================================================

CREATE OR REPLACE FUNCTION search_messages(p_conversation_id uuid, p_query text, p_limit integer DEFAULT 20)
RETURNS TABLE(id uuid, body text, sender_id uuid, created_at timestamptz, rank real)
LANGUAGE plpgsql SECURITY DEFINER STABLE
AS $$
BEGIN
  -- Verify caller is participant
  IF NOT EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = p_conversation_id AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Not a participant';
  END IF;

  RETURN QUERY
  SELECT m.id, m.body, m.sender_id, m.created_at,
         ts_rank(m.content_tsv, plainto_tsquery('english', p_query)) AS rank
  FROM messages m
  WHERE m.conversation_id = p_conversation_id
    AND m.content_tsv @@ plainto_tsquery('english', p_query)
  ORDER BY rank DESC, m.created_at DESC
  LIMIT p_limit;
END;
$$;

-- ============================================================================
-- MIGRATION COMPLETE
-- Created: member_blocks, conversation_mutes, autodm_config tables
-- Added: last_message_preview to conversations, content_tsv to messages,
--        last_read_message_id to conversation_participants
-- Functions: get_or_create_conversation, get_unread_conversation_count,
--            search_messages, update_conversation_on_message, check_block_before_message
-- ============================================================================
