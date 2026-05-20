-- ============================================================================
-- 011-community-feed: Supplemental Migration
-- Adds: post_follows table, counter triggers, auto-follow trigger
-- Tables posts, comments, reactions, post_attachments, polls, poll_options,
-- poll_votes, reports already exist in unified schema.
-- ============================================================================

-- post_follows (thread subscription)
CREATE TABLE IF NOT EXISTS post_follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, post_id)
);

ALTER TABLE post_follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "post_follows_select_own" ON post_follows
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "post_follows_insert_own" ON post_follows
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "post_follows_delete_own" ON post_follows
  FOR DELETE USING (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_post_follows_user ON post_follows (user_id);
CREATE INDEX IF NOT EXISTS idx_post_follows_post ON post_follows (post_id);

-- ============================================================================
-- COUNTER TRIGGERS
-- ============================================================================

-- Reaction counter: increment/decrement like_count on posts and comments
CREATE OR REPLACE FUNCTION trigger_update_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.target_type = 'post' THEN
      UPDATE posts SET like_count = like_count + 1 WHERE id = NEW.target_id;
    ELSIF NEW.target_type = 'comment' THEN
      UPDATE comments SET like_count = like_count + 1 WHERE id = NEW.target_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.target_type = 'post' THEN
      UPDATE posts SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.target_id;
    ELSIF OLD.target_type = 'comment' THEN
      UPDATE comments SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.target_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_reactions_like_count
  AFTER INSERT OR DELETE ON reactions
  FOR EACH ROW EXECUTE FUNCTION trigger_update_like_count();

-- Comment counter: increment/decrement comment_count on posts
CREATE OR REPLACE FUNCTION trigger_update_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_comments_count
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION trigger_update_comment_count();

-- Category post_count: update when posts change category or are created/deleted
CREATE OR REPLACE FUNCTION trigger_update_category_post_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.category_id IS NOT NULL THEN
      UPDATE categories SET post_count = post_count + 1 WHERE id = NEW.category_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.category_id IS NOT NULL THEN
      UPDATE categories SET post_count = GREATEST(post_count - 1, 0) WHERE id = OLD.category_id;
    END IF;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.category_id IS DISTINCT FROM NEW.category_id THEN
      IF OLD.category_id IS NOT NULL THEN
        UPDATE categories SET post_count = GREATEST(post_count - 1, 0) WHERE id = OLD.category_id;
      END IF;
      IF NEW.category_id IS NOT NULL THEN
        UPDATE categories SET post_count = post_count + 1 WHERE id = NEW.category_id;
      END IF;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_posts_category_count
  AFTER INSERT OR DELETE OR UPDATE OF category_id ON posts
  FOR EACH ROW EXECUTE FUNCTION trigger_update_category_post_count();

-- Auto-follow post when commenting
CREATE OR REPLACE FUNCTION trigger_auto_follow_on_comment()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO post_follows (user_id, post_id)
  VALUES (NEW.author_id, NEW.post_id)
  ON CONFLICT (user_id, post_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_comments_auto_follow
  AFTER INSERT ON comments
  FOR EACH ROW EXECUTE FUNCTION trigger_auto_follow_on_comment();

-- ============================================================================
-- MIGRATION COMPLETE
-- Tables: 1 (post_follows) | Triggers: 4 | Functions: 4
-- ============================================================================
