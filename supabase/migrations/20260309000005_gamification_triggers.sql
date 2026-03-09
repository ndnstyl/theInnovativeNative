-- ============================================================================
-- 014 GAMIFICATION — Triggers, Functions, Supplements
-- Adds missing columns, trigger functions, and RPC functions
-- Adapts to actual deployed schema (community_member_id FK pattern)
-- ============================================================================

-- ============================================================================
-- 1. ALTER TABLES — Add missing columns
-- ============================================================================

-- member_stats: add rolling point windows + last_point_at
ALTER TABLE member_stats ADD COLUMN IF NOT EXISTS points_7d integer NOT NULL DEFAULT 0;
ALTER TABLE member_stats ADD COLUMN IF NOT EXISTS points_30d integer NOT NULL DEFAULT 0;
ALTER TABLE member_stats ADD COLUMN IF NOT EXISTS last_point_at timestamptz;

-- points_log: add reason for admin awards
ALTER TABLE points_log ADD COLUMN IF NOT EXISTS reason text;

-- communities: add gamification settings
ALTER TABLE communities ADD COLUMN IF NOT EXISTS min_level_to_post integer DEFAULT NULL;
ALTER TABLE communities ADD COLUMN IF NOT EXISTS min_level_to_chat integer DEFAULT NULL;
ALTER TABLE communities ADD COLUMN IF NOT EXISTS exclude_admins_from_leaderboard boolean DEFAULT false;

-- Add leaderboard indexes on member_stats
CREATE INDEX IF NOT EXISTS idx_member_stats_total_points ON member_stats (total_points DESC);
CREATE INDEX IF NOT EXISTS idx_member_stats_points_7d ON member_stats (points_7d DESC);
CREATE INDEX IF NOT EXISTS idx_member_stats_points_30d ON member_stats (points_30d DESC);

-- ============================================================================
-- 2. HELPER FUNCTION — Calculate level from points
-- ============================================================================

CREATE OR REPLACE FUNCTION calculate_level_from_points(p_community_id uuid, p_total_points integer)
RETURNS integer
LANGUAGE plpgsql STABLE
AS $$
DECLARE
  v_level integer;
BEGIN
  SELECT level_number INTO v_level
  FROM levels
  WHERE community_id = p_community_id
    AND min_points <= p_total_points
  ORDER BY min_points DESC
  LIMIT 1;

  RETURN COALESCE(v_level, 1);
END;
$$;

-- ============================================================================
-- 3. TRIGGER — Update member_stats when points_log gets a new row
-- ============================================================================

CREATE OR REPLACE FUNCTION update_member_stats_on_points()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_community_id uuid;
BEGIN
  -- Get community_id through community_members
  SELECT cm.community_id INTO v_community_id
  FROM community_members cm
  WHERE cm.id = NEW.community_member_id;

  -- Upsert member_stats
  INSERT INTO member_stats (community_member_id, total_points, current_level, points_7d, points_30d, last_point_at, updated_at)
  VALUES (
    NEW.community_member_id,
    NEW.points,
    calculate_level_from_points(v_community_id, NEW.points),
    CASE WHEN NEW.created_at >= now() - interval '7 days' THEN NEW.points ELSE 0 END,
    CASE WHEN NEW.created_at >= now() - interval '30 days' THEN NEW.points ELSE 0 END,
    NEW.created_at,
    now()
  )
  ON CONFLICT (community_member_id) DO UPDATE SET
    total_points = member_stats.total_points + NEW.points,
    current_level = calculate_level_from_points(v_community_id, member_stats.total_points + NEW.points),
    points_7d = member_stats.points_7d + CASE WHEN NEW.created_at >= now() - interval '7 days' THEN NEW.points ELSE 0 END,
    points_30d = member_stats.points_30d + CASE WHEN NEW.created_at >= now() - interval '30 days' THEN NEW.points ELSE 0 END,
    last_point_at = GREATEST(member_stats.last_point_at, NEW.created_at),
    updated_at = now();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_points_log_stats ON points_log;
CREATE TRIGGER trg_points_log_stats
  AFTER INSERT ON points_log
  FOR EACH ROW
  EXECUTE FUNCTION update_member_stats_on_points();

-- ============================================================================
-- 4. TRIGGER — Award points when someone likes content (reactions INSERT)
-- ============================================================================

CREATE OR REPLACE FUNCTION award_points_on_like()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_author_id uuid;
  v_author_cm_id uuid;
  v_points_value integer;
BEGIN
  -- Find the author of the liked content
  IF NEW.target_type = 'post' THEN
    SELECT author_id INTO v_author_id FROM posts WHERE id = NEW.target_id;
  ELSIF NEW.target_type = 'comment' THEN
    SELECT author_id INTO v_author_id FROM comments WHERE id = NEW.target_id;
  END IF;

  -- No self-likes
  IF v_author_id IS NULL OR v_author_id = NEW.user_id THEN
    RETURN NEW;
  END IF;

  -- Find the author's community_member_id
  SELECT id INTO v_author_cm_id
  FROM community_members
  WHERE member_id = v_author_id AND community_id = NEW.community_id;

  IF v_author_cm_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Look up point value
  SELECT points INTO v_points_value
  FROM point_config
  WHERE community_id = NEW.community_id AND action = 'like_received';

  IF v_points_value IS NULL OR v_points_value <= 0 THEN
    RETURN NEW;
  END IF;

  -- Award points to the content author
  INSERT INTO points_log (community_member_id, action, points, source_type, source_id)
  VALUES (v_author_cm_id, 'like_received', v_points_value, 'like_received', NEW.target_id);

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_reaction_points ON reactions;
CREATE TRIGGER trg_reaction_points
  AFTER INSERT ON reactions
  FOR EACH ROW
  EXECUTE FUNCTION award_points_on_like();

-- ============================================================================
-- 5. TRIGGER — Reverse points when someone unlikes (reactions DELETE)
-- ============================================================================

CREATE OR REPLACE FUNCTION reverse_points_on_unlike()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_author_id uuid;
  v_author_cm_id uuid;
  v_points_value integer;
BEGIN
  -- Find the author of the unliked content
  IF OLD.target_type = 'post' THEN
    SELECT author_id INTO v_author_id FROM posts WHERE id = OLD.target_id;
  ELSIF OLD.target_type = 'comment' THEN
    SELECT author_id INTO v_author_id FROM comments WHERE id = OLD.target_id;
  END IF;

  IF v_author_id IS NULL OR v_author_id = OLD.user_id THEN
    RETURN OLD;
  END IF;

  SELECT id INTO v_author_cm_id
  FROM community_members
  WHERE member_id = v_author_id AND community_id = OLD.community_id;

  IF v_author_cm_id IS NULL THEN
    RETURN OLD;
  END IF;

  SELECT points INTO v_points_value
  FROM point_config
  WHERE community_id = OLD.community_id AND action = 'like_received';

  IF v_points_value IS NULL OR v_points_value <= 0 THEN
    RETURN OLD;
  END IF;

  -- Insert reversal (negative points)
  INSERT INTO points_log (community_member_id, action, points, source_type, source_id)
  VALUES (v_author_cm_id, 'reversal', -v_points_value, 'reversal', OLD.target_id);

  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_reaction_reversal ON reactions;
CREATE TRIGGER trg_reaction_reversal
  AFTER DELETE ON reactions
  FOR EACH ROW
  EXECUTE FUNCTION reverse_points_on_unlike();

-- ============================================================================
-- 6. TRIGGER — Award points on lesson completion
-- ============================================================================

CREATE OR REPLACE FUNCTION award_points_on_lesson_completion()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_community_id uuid;
  v_cm_id uuid;
  v_lesson_points integer;
  v_course_points integer;
  v_all_done boolean;
  v_total_lessons integer;
  v_completed_lessons integer;
BEGIN
  -- Get community_id from the course
  SELECT c.community_id INTO v_community_id
  FROM courses c
  WHERE c.id = NEW.course_id;

  IF v_community_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Get the user's community_member_id
  SELECT id INTO v_cm_id
  FROM community_members
  WHERE member_id = NEW.user_id AND community_id = v_community_id;

  IF v_cm_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Prevent duplicate lesson completion points
  IF EXISTS (
    SELECT 1 FROM points_log
    WHERE community_member_id = v_cm_id
      AND source_type = 'lesson_completed'
      AND source_id = NEW.lesson_id
  ) THEN
    RETURN NEW;
  END IF;

  -- Look up lesson completion points
  SELECT points INTO v_lesson_points
  FROM point_config
  WHERE community_id = v_community_id AND action = 'lesson_completed';

  IF v_lesson_points IS NOT NULL AND v_lesson_points > 0 THEN
    INSERT INTO points_log (community_member_id, action, points, source_type, source_id)
    VALUES (v_cm_id, 'lesson_completed', v_lesson_points, 'lesson_completed', NEW.lesson_id);
  END IF;

  -- Check if all lessons in the course are now complete
  SELECT COUNT(*) INTO v_total_lessons FROM lessons WHERE course_id = NEW.course_id;
  SELECT COUNT(*) INTO v_completed_lessons FROM lesson_progress
  WHERE course_id = NEW.course_id AND user_id = NEW.user_id AND completed = true;

  IF v_completed_lessons >= v_total_lessons THEN
    -- Prevent duplicate course completion points
    IF NOT EXISTS (
      SELECT 1 FROM points_log
      WHERE community_member_id = v_cm_id
        AND source_type = 'course_completed'
        AND source_id = NEW.course_id
    ) THEN
      SELECT points INTO v_course_points
      FROM point_config
      WHERE community_id = v_community_id AND action = 'course_completed';

      IF v_course_points IS NOT NULL AND v_course_points > 0 THEN
        INSERT INTO points_log (community_member_id, action, points, source_type, source_id)
        VALUES (v_cm_id, 'course_completed', v_course_points, 'course_completed', NEW.course_id);
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_lesson_points ON lesson_progress;
CREATE TRIGGER trg_lesson_points
  AFTER INSERT OR UPDATE ON lesson_progress
  FOR EACH ROW
  WHEN (NEW.completed = true)
  EXECUTE FUNCTION award_points_on_lesson_completion();

-- ============================================================================
-- 7. TRIGGER — Recalculate all levels when thresholds change
-- ============================================================================

CREATE OR REPLACE FUNCTION recalculate_levels_on_threshold_change()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  UPDATE member_stats ms
  SET current_level = calculate_level_from_points(
    (SELECT cm.community_id FROM community_members cm WHERE cm.id = ms.community_member_id),
    ms.total_points
  ),
  updated_at = now()
  WHERE ms.community_member_id IN (
    SELECT cm.id FROM community_members cm WHERE cm.community_id = NEW.community_id
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_levels_recalc ON levels;
CREATE TRIGGER trg_levels_recalc
  AFTER UPDATE OF min_points ON levels
  FOR EACH ROW
  EXECUTE FUNCTION recalculate_levels_on_threshold_change();

-- ============================================================================
-- 8. TRIGGER — Reverse points when post is deleted
-- ============================================================================

CREATE OR REPLACE FUNCTION reverse_points_on_post_delete()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_entry RECORD;
BEGIN
  -- Find all like_received points for this post and reverse them
  FOR v_entry IN
    SELECT community_member_id, points
    FROM points_log
    WHERE source_type = 'like_received' AND source_id = OLD.id
  LOOP
    INSERT INTO points_log (community_member_id, action, points, source_type, source_id)
    VALUES (v_entry.community_member_id, 'reversal', -v_entry.points, 'reversal', OLD.id);
  END LOOP;

  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_post_delete_points ON posts;
CREATE TRIGGER trg_post_delete_points
  BEFORE DELETE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION reverse_points_on_post_delete();

-- ============================================================================
-- 9. RPC — Admin award/adjust points
-- ============================================================================

CREATE OR REPLACE FUNCTION admin_award_points(
  p_member_id uuid,  -- profiles.id of the target member
  p_points integer,
  p_reason text
)
RETURNS integer
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_cm_id uuid;
  v_community_id uuid;
  v_caller_cm_id uuid;
  v_caller_role text;
  v_source_type text;
  v_new_total integer;
BEGIN
  -- Validate inputs
  IF p_points = 0 THEN
    RAISE EXCEPTION 'Points must be non-zero';
  END IF;
  IF p_reason IS NULL OR trim(p_reason) = '' THEN
    RAISE EXCEPTION 'Reason is required';
  END IF;

  -- Find target member's community_member_id (use default community)
  SELECT id, community_id INTO v_cm_id, v_community_id
  FROM community_members
  WHERE member_id = p_member_id
  LIMIT 1;

  IF v_cm_id IS NULL THEN
    RAISE EXCEPTION 'Member not found';
  END IF;

  -- Verify caller is admin/owner
  SELECT id, role INTO v_caller_cm_id, v_caller_role
  FROM community_members
  WHERE member_id = auth.uid() AND community_id = v_community_id;

  IF v_caller_role NOT IN ('owner', 'admin') THEN
    RAISE EXCEPTION 'Only admins can award points';
  END IF;

  -- Determine source type
  v_source_type := CASE WHEN p_points > 0 THEN 'admin_award' ELSE 'admin_adjustment' END;

  -- Insert points_log entry (trigger handles member_stats update)
  INSERT INTO points_log (community_member_id, action, points, source_type, reason)
  VALUES (v_cm_id, v_source_type, p_points, v_source_type, p_reason);

  -- Return updated total
  SELECT total_points INTO v_new_total FROM member_stats WHERE community_member_id = v_cm_id;
  RETURN COALESCE(v_new_total, 0);
END;
$$;

-- ============================================================================
-- 10. RPC — Get points history with source descriptions
-- ============================================================================

CREATE OR REPLACE FUNCTION get_points_history(
  p_member_id uuid,
  p_limit integer DEFAULT 20,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  source_type text,
  source_description text,
  points integer,
  created_at timestamptz
)
LANGUAGE plpgsql STABLE SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    pl.id,
    pl.source_type,
    CASE
      WHEN pl.source_type = 'like_received' THEN
        COALESCE('Like on: ' || (SELECT p.title FROM posts p WHERE p.id = pl.source_id), 'Like received')
      WHEN pl.source_type = 'lesson_completed' THEN
        COALESCE('Completed: ' || (SELECT l.title FROM lessons l WHERE l.id = pl.source_id), 'Lesson completed')
      WHEN pl.source_type = 'course_completed' THEN
        COALESCE('Course complete: ' || (SELECT c.title FROM courses c WHERE c.id = pl.source_id), 'Course completed')
      WHEN pl.source_type = 'event_attended' THEN
        COALESCE('Attended: ' || (SELECT e.title FROM events e WHERE e.id = pl.source_id), 'Event attended')
      WHEN pl.source_type = 'admin_award' THEN
        COALESCE('Award: ' || pl.reason, 'Admin award')
      WHEN pl.source_type = 'admin_adjustment' THEN
        COALESCE('Adjustment: ' || pl.reason, 'Admin adjustment')
      WHEN pl.source_type = 'reversal' THEN
        'Points reversed'
      ELSE pl.action
    END AS source_description,
    pl.points,
    pl.created_at
  FROM points_log pl
  JOIN community_members cm ON cm.id = pl.community_member_id
  WHERE cm.member_id = p_member_id
  ORDER BY pl.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- ============================================================================
-- 11. Initialize member_stats for existing community members
-- ============================================================================

INSERT INTO member_stats (community_member_id, total_points, current_level)
SELECT cm.id, 0, 1
FROM community_members cm
WHERE NOT EXISTS (
  SELECT 1 FROM member_stats ms WHERE ms.community_member_id = cm.id
)
ON CONFLICT (community_member_id) DO NOTHING;

-- ============================================================================
-- MIGRATION COMPLETE
-- Added: 3 columns to member_stats, 1 to points_log, 3 to communities
-- Created: 6 trigger functions, 6 triggers, 2 RPC functions
-- Initialized: member_stats for all existing members
-- ============================================================================
