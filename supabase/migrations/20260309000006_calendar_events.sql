-- ============================================================================
-- 015 CALENDAR & EVENTS — Schema supplements, RPC functions, triggers
-- Adapts deployed events/event_rsvps tables; adds event_categories,
-- event_occurrences, and recurring event support
-- ============================================================================

-- ============================================================================
-- 1. New Tables
-- ============================================================================

CREATE TABLE IF NOT EXISTS event_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  name text NOT NULL,
  color text NOT NULL DEFAULT '#00FFFF',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(community_id, name)
);

CREATE TABLE IF NOT EXISTS event_occurrences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  title_override text,
  description_override text,
  location_override text,
  status text NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'cancelled', 'completed')),
  rsvp_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_occ_upcoming ON event_occurrences (community_id, start_time ASC) WHERE status = 'upcoming';
CREATE INDEX IF NOT EXISTS idx_occ_completed ON event_occurrences (community_id, start_time DESC) WHERE status = 'completed';
CREATE INDEX IF NOT EXISTS idx_occ_event ON event_occurrences (event_id);

-- ============================================================================
-- 2. Alter existing tables
-- ============================================================================

-- events: add missing columns
ALTER TABLE events ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES event_categories(id) ON DELETE SET NULL;
ALTER TABLE events ADD COLUMN IF NOT EXISTS timezone text NOT NULL DEFAULT 'UTC';
ALTER TABLE events ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';
ALTER TABLE events ADD COLUMN IF NOT EXISTS capacity integer NOT NULL DEFAULT 0;
ALTER TABLE events ADD COLUMN IF NOT EXISTS cover_image_url text;
ALTER TABLE events ADD COLUMN IF NOT EXISTS location_url text;

-- event_rsvps: add occurrence_id and reminder_sent
ALTER TABLE event_rsvps ADD COLUMN IF NOT EXISTS occurrence_id uuid REFERENCES event_occurrences(id) ON DELETE CASCADE;
ALTER TABLE event_rsvps ADD COLUMN IF NOT EXISTS reminder_sent boolean NOT NULL DEFAULT false;

-- community_members: add event_reminders_enabled
ALTER TABLE community_members ADD COLUMN IF NOT EXISTS event_reminders_enabled boolean NOT NULL DEFAULT true;

-- Add index for reminder queries
CREATE INDEX IF NOT EXISTS idx_rsvps_reminder ON event_rsvps (reminder_sent) WHERE status = 'confirmed' AND reminder_sent = false;

-- ============================================================================
-- 3. RLS on new tables
-- ============================================================================

ALTER TABLE event_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_occurrences ENABLE ROW LEVEL SECURITY;

-- event_categories: all authenticated can read, admin can manage
CREATE POLICY "event_categories_select" ON event_categories FOR SELECT
  USING (true);
CREATE POLICY "event_categories_manage" ON event_categories FOR ALL
  USING (is_community_admin(community_id));

-- event_occurrences: community members can read, admin can update
CREATE POLICY "event_occurrences_select" ON event_occurrences FOR SELECT
  USING (is_active_member(community_id));
CREATE POLICY "event_occurrences_manage" ON event_occurrences FOR ALL
  USING (is_community_admin(community_id));

-- ============================================================================
-- 4. RPC — RSVP to event (capacity-aware, race-condition safe)
-- ============================================================================

CREATE OR REPLACE FUNCTION rsvp_to_event(p_occurrence_id uuid, p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_occ event_occurrences%ROWTYPE;
  v_capacity integer;
  v_confirmed_count integer;
  v_existing_rsvp event_rsvps%ROWTYPE;
BEGIN
  -- Lock the occurrence row
  SELECT * INTO v_occ FROM event_occurrences WHERE id = p_occurrence_id FOR UPDATE;
  IF v_occ IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Event not found');
  END IF;

  IF v_occ.status != 'upcoming' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Event is not upcoming');
  END IF;

  -- Get capacity from parent event
  SELECT capacity INTO v_capacity FROM events WHERE id = v_occ.event_id;

  -- Count current confirmed RSVPs
  SELECT COUNT(*) INTO v_confirmed_count
  FROM event_rsvps
  WHERE occurrence_id = p_occurrence_id AND status = 'confirmed';

  -- Check for existing RSVP
  SELECT * INTO v_existing_rsvp
  FROM event_rsvps
  WHERE occurrence_id = p_occurrence_id AND user_id = p_user_id;

  IF v_existing_rsvp IS NOT NULL THEN
    IF v_existing_rsvp.status = 'confirmed' THEN
      RETURN jsonb_build_object('success', true, 'status', 'already_confirmed');
    END IF;
    -- Re-confirm cancelled RSVP
    IF v_capacity = 0 OR v_confirmed_count < v_capacity THEN
      UPDATE event_rsvps SET status = 'confirmed' WHERE id = v_existing_rsvp.id;
      UPDATE event_occurrences SET rsvp_count = rsvp_count + 1 WHERE id = p_occurrence_id;
      RETURN jsonb_build_object('success', true, 'status', 'confirmed');
    ELSE
      RETURN jsonb_build_object('success', false, 'status', 'full');
    END IF;
  END IF;

  -- New RSVP
  IF v_capacity = 0 OR v_confirmed_count < v_capacity THEN
    INSERT INTO event_rsvps (event_id, occurrence_id, user_id, status)
    VALUES (v_occ.event_id, p_occurrence_id, p_user_id, 'confirmed');
    UPDATE event_occurrences SET rsvp_count = rsvp_count + 1 WHERE id = p_occurrence_id;
    RETURN jsonb_build_object('success', true, 'status', 'confirmed');
  ELSE
    RETURN jsonb_build_object('success', false, 'status', 'full');
  END IF;
END;
$$;

-- ============================================================================
-- 5. RPC — Cancel RSVP
-- ============================================================================

CREATE OR REPLACE FUNCTION cancel_rsvp(p_occurrence_id uuid, p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_found boolean;
BEGIN
  UPDATE event_rsvps
  SET status = 'cancelled'
  WHERE occurrence_id = p_occurrence_id
    AND user_id = p_user_id
    AND status = 'confirmed';

  GET DIAGNOSTICS v_found = ROW_COUNT;

  IF v_found THEN
    UPDATE event_occurrences SET rsvp_count = GREATEST(rsvp_count - 1, 0) WHERE id = p_occurrence_id;
    RETURN jsonb_build_object('success', true);
  ELSE
    RETURN jsonb_build_object('success', false, 'error', 'No active RSVP found');
  END IF;
END;
$$;

-- ============================================================================
-- 6. Function — Generate occurrences for recurring events
-- ============================================================================

CREATE OR REPLACE FUNCTION generate_occurrences(p_event_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_event events%ROWTYPE;
  v_duration interval;
  v_count integer;
  v_start timestamptz;
  v_end timestamptz;
  i integer;
BEGIN
  SELECT * INTO v_event FROM events WHERE id = p_event_id;
  IF v_event IS NULL THEN RETURN; END IF;

  v_duration := v_event.ends_at - v_event.starts_at;
  v_count := COALESCE(v_event.max_attendees, 1); -- reuse for recurrence_count if needed

  -- For recurrence, use recurrence_rule
  IF v_event.recurrence_rule IS NULL OR v_event.recurrence_rule = '' THEN
    -- Single event: create one occurrence
    INSERT INTO event_occurrences (event_id, community_id, start_time, end_time)
    VALUES (p_event_id, v_event.community_id, v_event.starts_at, v_event.ends_at)
    ON CONFLICT DO NOTHING;
    RETURN;
  END IF;

  -- Parse recurrence count from recurrence_rule (format: "weekly:12" or just "weekly")
  v_count := 12; -- default

  FOR i IN 0..v_count-1 LOOP
    CASE v_event.recurrence_rule
      WHEN 'daily' THEN
        v_start := v_event.starts_at + (i || ' days')::interval;
      WHEN 'weekly' THEN
        v_start := v_event.starts_at + (i * 7 || ' days')::interval;
      WHEN 'monthly' THEN
        v_start := v_event.starts_at + (i || ' months')::interval;
      ELSE
        v_start := v_event.starts_at;
    END CASE;

    v_end := v_start + v_duration;

    INSERT INTO event_occurrences (event_id, community_id, start_time, end_time)
    VALUES (p_event_id, v_event.community_id, v_start, v_end);
  END LOOP;
END;
$$;

-- ============================================================================
-- 7. Function — Mark past events completed (for pg_cron)
-- ============================================================================

CREATE OR REPLACE FUNCTION mark_past_events_completed()
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  UPDATE event_occurrences
  SET status = 'completed'
  WHERE status = 'upcoming' AND end_time < now();
END;
$$;

-- ============================================================================
-- 8. Trigger — Award points on attendance (gamification integration)
-- ============================================================================

CREATE OR REPLACE FUNCTION award_points_on_attendance()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_cm_id uuid;
  v_community_id uuid;
  v_points_value integer;
BEGIN
  -- Get community_id from the occurrence
  SELECT community_id INTO v_community_id
  FROM event_occurrences WHERE id = NEW.occurrence_id;

  IF v_community_id IS NULL THEN RETURN NEW; END IF;

  -- Find community_member_id
  SELECT id INTO v_cm_id
  FROM community_members
  WHERE member_id = NEW.user_id AND community_id = v_community_id;

  IF v_cm_id IS NULL THEN RETURN NEW; END IF;

  -- Look up points value (guard against missing table/config)
  BEGIN
    SELECT points INTO v_points_value
    FROM point_config
    WHERE community_id = v_community_id AND action = 'event_attended';
  EXCEPTION WHEN undefined_table THEN
    RETURN NEW;
  END;

  IF v_points_value IS NOT NULL AND v_points_value > 0 THEN
    -- Prevent duplicate
    IF NOT EXISTS (
      SELECT 1 FROM points_log
      WHERE community_member_id = v_cm_id
        AND source_type = 'event_attended'
        AND source_id = NEW.occurrence_id
    ) THEN
      INSERT INTO points_log (community_member_id, action, points, source_type, source_id)
      VALUES (v_cm_id, 'event_attended', v_points_value, 'event_attended', NEW.occurrence_id);
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_attendance_points ON event_rsvps;
CREATE TRIGGER trg_attendance_points
  AFTER UPDATE OF status ON event_rsvps
  FOR EACH ROW
  WHEN (NEW.status = 'attended' AND OLD.status != 'attended')
  EXECUTE FUNCTION award_points_on_attendance();

-- ============================================================================
-- MIGRATION COMPLETE
-- Created: event_categories, event_occurrences tables
-- Added: 6 columns to events, 2 to event_rsvps, 1 to community_members
-- Functions: rsvp_to_event, cancel_rsvp, generate_occurrences,
--            mark_past_events_completed, award_points_on_attendance
-- ============================================================================
