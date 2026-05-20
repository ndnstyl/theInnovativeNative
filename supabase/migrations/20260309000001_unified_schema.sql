-- ============================================================================
-- UNIFIED SCHEMA MIGRATION — The Innovative Native Community Platform
-- Spec: 024-database-schema | Date: 2026-03-09
-- ~45 tables, ~60 RLS policies, ~30 indexes, ~10 triggers
-- Single atomic transaction — rolls back entirely on any failure
-- ============================================================================

-- ============================================================================
-- PHASE 0: CLEANUP — Drop old schema from 001_classroom_schema.sql if present
-- ============================================================================
DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
DROP TRIGGER IF EXISTS update_lessons_updated_at ON lessons;
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS get_course_progress(uuid, uuid);

DROP TABLE IF EXISTS lesson_progress CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS modules CASCADE;
DROP TABLE IF EXISTS courses CASCADE;

-- Remove old profiles columns if they exist (role column is WRONG — must not exist)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
    ALTER TABLE profiles DROP COLUMN role;
  END IF;
END $$;

-- ============================================================================
-- PHASE 1: CORE TABLES (Platform + Profiles)
-- ============================================================================

-- profiles — extends Supabase auth.users
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  username text UNIQUE,
  avatar_url text,
  bio text CHECK (char_length(bio) <= 500),
  location text,
  website text,
  social_links jsonb DEFAULT '[]'::jsonb,
  membership_status text NOT NULL DEFAULT 'approved',
  onboarding_complete boolean NOT NULL DEFAULT false,
  last_active_at timestamptz,
  username_changed_at timestamptz,
  level integer NOT NULL DEFAULT 1,
  xp_total integer NOT NULL DEFAULT 0,
  search_vector tsvector,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT username_format CHECK (
    username IS NULL OR (
      char_length(username) BETWEEN 3 AND 30
      AND username ~ '^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$'
    )
  )
);
-- NOTE: NO role column on profiles. community_members.role is the ONLY role authority.

-- communities
CREATE TABLE IF NOT EXISTS communities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  logo_url text,
  cover_image_url text,
  privacy text NOT NULL DEFAULT 'public' CHECK (privacy IN ('public', 'private')),
  pricing_model text NOT NULL DEFAULT 'free' CHECK (pricing_model IN ('free', 'monthly', 'annual', 'freemium')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- community_members — THE SINGLE ROLE AUTHORITY
CREATE TABLE IF NOT EXISTS community_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'moderator', 'member')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'banned', 'pending')),
  deleted_at timestamptz, -- soft delete for account deletion
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (community_id, member_id)
);

-- ============================================================================
-- PHASE 2: FEED TABLES
-- ============================================================================

-- categories
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  display_order integer NOT NULL DEFAULT 0,
  post_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- posts
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  title text,
  body text NOT NULL,
  body_html text NOT NULL,
  pinned_position integer CHECK (pinned_position BETWEEN 1 AND 3),
  search_vector tsvector,
  like_count integer NOT NULL DEFAULT 0,
  comment_count integer NOT NULL DEFAULT 0,
  edited_at timestamptz,
  deleted_at timestamptz, -- soft delete
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- comments
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_comment_id uuid REFERENCES comments(id) ON DELETE CASCADE, -- single-level threading
  body text NOT NULL,
  body_html text NOT NULL,
  like_count integer NOT NULL DEFAULT 0,
  deleted_at timestamptz, -- soft delete
  created_at timestamptz NOT NULL DEFAULT now()
);

-- reactions (polymorphic: post or comment)
CREATE TABLE IF NOT EXISTS reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_type text NOT NULL CHECK (target_type IN ('post', 'comment')),
  target_id uuid NOT NULL,
  reaction_type text NOT NULL DEFAULT 'like',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, target_type, target_id)
);

-- post_attachments
CREATE TABLE IF NOT EXISTS post_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  file_path text NOT NULL,
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_size bigint NOT NULL,
  display_mode text NOT NULL DEFAULT 'inline' CHECK (display_mode IN ('inline', 'download')),
  optimized_path text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- polls
CREATE TABLE IF NOT EXISTS polls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL UNIQUE REFERENCES posts(id) ON DELETE CASCADE,
  question text NOT NULL,
  total_votes integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- poll_options
CREATE TABLE IF NOT EXISTS poll_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id uuid NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  option_text text NOT NULL CHECK (char_length(option_text) <= 120),
  vote_count integer NOT NULL DEFAULT 0,
  display_order integer NOT NULL DEFAULT 0
);

-- poll_votes
CREATE TABLE IF NOT EXISTS poll_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id uuid NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  option_id uuid NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (poll_id, user_id)
);

-- reports
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  reporter_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_type text NOT NULL CHECK (target_type IN ('post', 'comment')),
  target_id uuid NOT NULL,
  reason text NOT NULL CHECK (reason IN ('spam', 'harassment', 'off_topic', 'misinformation', 'other')),
  description text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed')),
  reviewed_by uuid REFERENCES profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (reporter_id, target_type, target_id)
);

-- ============================================================================
-- PHASE 3: CLASSROOM TABLES
-- ============================================================================

-- courses
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  thumbnail_url text,
  access_level integer NOT NULL DEFAULT 0, -- minimum member level required (0 = no restriction)
  is_free boolean NOT NULL DEFAULT false,
  stripe_price_id text, -- for paid courses, references Stripe Price
  published boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  search_vector tsvector,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- modules
CREATE TABLE IF NOT EXISTS modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- lessons
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE, -- denormalized
  title text NOT NULL,
  content text,
  content_html text,
  video_url text, -- YouTube embed URL
  display_order integer NOT NULL DEFAULT 0,
  search_vector tsvector,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- enrollments
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  UNIQUE (course_id, user_id)
);

-- lesson_progress
CREATE TABLE IF NOT EXISTS lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (lesson_id, user_id)
);

-- lesson_attachments
CREATE TABLE IF NOT EXISTS lesson_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  file_path text NOT NULL,
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_size bigint NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- PHASE 4: GAMIFICATION TABLES
-- ============================================================================

-- levels
CREATE TABLE IF NOT EXISTS levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid REFERENCES communities(id) ON DELETE CASCADE,
  level_number integer NOT NULL,
  name text NOT NULL,
  min_points integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (community_id, level_number)
);

-- member_stats
CREATE TABLE IF NOT EXISTS member_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_member_id uuid NOT NULL UNIQUE REFERENCES community_members(id) ON DELETE CASCADE,
  total_points integer NOT NULL DEFAULT 0,
  current_level integer NOT NULL DEFAULT 1,
  posts_count integer NOT NULL DEFAULT 0,
  comments_count integer NOT NULL DEFAULT 0,
  likes_received integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- points_log
CREATE TABLE IF NOT EXISTS points_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_member_id uuid NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  action text NOT NULL,
  points integer NOT NULL,
  source_type text, -- 'like_received', 'lesson_completed', 'event_attended', 'admin_adjustment'
  source_id uuid, -- polymorphic reference to the triggering entity
  created_at timestamptz NOT NULL DEFAULT now()
);

-- point_config
CREATE TABLE IF NOT EXISTS point_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  action text NOT NULL,
  points integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (community_id, action)
);

-- ============================================================================
-- PHASE 5: CALENDAR & MESSAGING TABLES
-- ============================================================================

-- events
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  location_type text NOT NULL DEFAULT 'online' CHECK (location_type IN ('online', 'in_person', 'hybrid')),
  location_url text,
  location_address text,
  max_attendees integer,
  rsvp_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- event_rsvps
CREATE TABLE IF NOT EXISTS event_rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'going' CHECK (status IN ('going', 'maybe', 'not_going')),
  attended boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id)
);

-- conversations
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  last_message_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- conversation_participants
CREATE TABLE IF NOT EXISTS conversation_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  last_read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (conversation_id, user_id)
);

-- messages
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- PHASE 6: NOTIFICATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL, -- 'like', 'comment', 'mention', 'dm', 'event_reminder', 'level_up'
  title text NOT NULL,
  body text,
  action_url text,
  actor_id uuid REFERENCES profiles(id),
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- PHASE 7: PAYMENT, EMAIL, STORAGE TABLES
-- ============================================================================

-- subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_customer_id text,
  stripe_subscription_id text UNIQUE,
  plan text NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'monthly', 'annual', 'lifetime')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'trialing', 'past_due', 'canceled', 'unpaid', 'paused')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  trial_start timestamptz,
  trial_end timestamptz,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  grace_period_end timestamptz,
  lifetime_access boolean NOT NULL DEFAULT false, -- true for $3,400 lifetime pass
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- payments
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_payment_intent_id text,
  stripe_invoice_id text,
  amount integer NOT NULL, -- cents
  currency text NOT NULL DEFAULT 'usd',
  status text NOT NULL CHECK (status IN ('succeeded', 'failed', 'refunded', 'pending')),
  refund_amount integer DEFAULT 0,
  failure_reason text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- webhook_events (idempotency log)
CREATE TABLE IF NOT EXISTS webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id text NOT NULL UNIQUE,
  event_type text NOT NULL,
  processed_at timestamptz NOT NULL DEFAULT now(),
  payload jsonb
);

-- email_preferences
CREATE TABLE IF NOT EXISTS email_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  digest boolean NOT NULL DEFAULT true,
  event_reminders boolean NOT NULL DEFAULT true,
  dm_notifications boolean NOT NULL DEFAULT true,
  community_highlights boolean NOT NULL DEFAULT true,
  unsubscribe_token uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- email_log
CREATE TABLE IF NOT EXISTS email_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  email_type text NOT NULL,
  subject text NOT NULL,
  recipient_email text NOT NULL,
  status text NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'bounced', 'complained')),
  resend_message_id text,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- member_storage
CREATE TABLE IF NOT EXISTS member_storage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  total_bytes bigint NOT NULL DEFAULT 0,
  quota_bytes bigint NOT NULL DEFAULT 52428800, -- 50 MB default
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- PHASE 8: CROSS-CUTTING TABLES (Privacy, Rate Limiting, Tracking, Engagement, Search)
-- ============================================================================

-- rate_limits
CREATE TABLE IF NOT EXISTS rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  ip_address text,
  action_type text NOT NULL,
  window_start timestamptz NOT NULL,
  count integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- consent_records
CREATE TABLE IF NOT EXISTS consent_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  session_id text,
  consent_type text NOT NULL,
  granted boolean NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now(),
  ip_address text,
  user_agent text
);

-- data_export_requests
CREATE TABLE IF NOT EXISTS data_export_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'ready', 'expired', 'failed')),
  requested_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  download_url text,
  expires_at timestamptz
);

-- audit_log
CREATE TABLE IF NOT EXISTS audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_type text,
  target_id uuid,
  metadata jsonb,
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- deletion_requests
CREATE TABLE IF NOT EXISTS deletion_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  requested_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  error_message text
);

-- tracking_events
CREATE TABLE IF NOT EXISTS tracking_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text NOT NULL, -- UUID v4 for deduplication
  event_name text NOT NULL,
  platform text NOT NULL, -- 'facebook' or 'google'
  source text NOT NULL, -- 'client' or 'server'
  status text NOT NULL, -- 'sent', 'failed', 'retrying'
  response_code integer,
  response_body text,
  payload jsonb,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- tracking_retry_queue
CREATE TABLE IF NOT EXISTS tracking_retry_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_event_id uuid NOT NULL REFERENCES tracking_events(id) ON DELETE CASCADE,
  retry_count integer NOT NULL DEFAULT 0,
  next_retry_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- lesson_comments (classroom engagement)
CREATE TABLE IF NOT EXISTS lesson_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  parent_id uuid REFERENCES lesson_comments(id) ON DELETE CASCADE, -- threading
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- content_engagement_log — IMMUTABLE audit trail for chargeback defense
-- INSERT ONLY — no UPDATE or DELETE policies
CREATE TABLE IF NOT EXISTS content_engagement_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  event_type text NOT NULL CHECK (event_type IN (
    'lesson_view', 'video_play', 'video_pause', 'video_complete',
    'attachment_download', 'lesson_complete'
  )),
  metadata jsonb DEFAULT '{}'::jsonb, -- watch_seconds, video_duration, etc.
  created_at timestamptz NOT NULL DEFAULT now()
);

-- course_analytics_cache — refreshed daily by Edge Function
CREATE TABLE IF NOT EXISTS course_analytics_cache (
  course_id uuid PRIMARY KEY REFERENCES courses(id) ON DELETE CASCADE,
  total_enrolled integer NOT NULL DEFAULT 0,
  active_7d integer NOT NULL DEFAULT 0,
  completion_rate numeric(5,2) NOT NULL DEFAULT 0,
  avg_time_seconds integer NOT NULL DEFAULT 0,
  funnel_data jsonb DEFAULT '[]'::jsonb,
  heatmap_data jsonb DEFAULT '[]'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- search_log
CREATE TABLE IF NOT EXISTS search_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  query text NOT NULL,
  result_count integer NOT NULL,
  filters jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- PHASE 9: ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_storage ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_export_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE deletion_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_retry_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_engagement_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_analytics_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_log ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- HELPER FUNCTIONS (used by RLS policies)
-- ============================================================================

-- Check if user is an active member of a community
CREATE OR REPLACE FUNCTION is_active_member(p_community_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM community_members
    WHERE community_id = p_community_id
    AND member_id = auth.uid()
    AND status = 'active'
    AND deleted_at IS NULL
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Check if user has admin+ role in a community
CREATE OR REPLACE FUNCTION is_community_admin(p_community_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM community_members
    WHERE community_id = p_community_id
    AND member_id = auth.uid()
    AND role IN ('owner', 'admin')
    AND status = 'active'
    AND deleted_at IS NULL
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Check if user has moderator+ role
CREATE OR REPLACE FUNCTION is_community_moderator(p_community_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM community_members
    WHERE community_id = p_community_id
    AND member_id = auth.uid()
    AND role IN ('owner', 'admin', 'moderator')
    AND status = 'active'
    AND deleted_at IS NULL
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ============================================================================
-- PHASE 10: RLS POLICIES
-- ============================================================================

-- ---------- PROFILES ----------
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "profiles_select_community" ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM community_members cm1
      JOIN community_members cm2 ON cm1.community_id = cm2.community_id
      WHERE cm1.member_id = auth.uid() AND cm1.status = 'active' AND cm1.deleted_at IS NULL
      AND cm2.member_id = profiles.id AND cm2.deleted_at IS NULL
    )
  );

CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ---------- COMMUNITIES ----------
CREATE POLICY "communities_select_public" ON communities FOR SELECT
  USING (privacy = 'public');

CREATE POLICY "communities_select_member" ON communities FOR SELECT
  USING (is_active_member(id));

CREATE POLICY "communities_manage_admin" ON communities FOR UPDATE
  USING (is_community_admin(id));

-- ---------- COMMUNITY_MEMBERS ----------
CREATE POLICY "cm_select_member" ON community_members FOR SELECT
  USING (is_active_member(community_id));

CREATE POLICY "cm_insert_self" ON community_members FOR INSERT
  WITH CHECK (member_id = auth.uid());

CREATE POLICY "cm_update_admin" ON community_members FOR UPDATE
  USING (is_community_admin(community_id));

CREATE POLICY "cm_delete_admin" ON community_members FOR DELETE
  USING (is_community_admin(community_id));

-- ---------- CATEGORIES ----------
CREATE POLICY "categories_select" ON categories FOR SELECT
  USING (is_active_member(community_id));

CREATE POLICY "categories_manage_admin" ON categories FOR ALL
  USING (is_community_admin(community_id));

-- ---------- POSTS ----------
CREATE POLICY "posts_select" ON posts FOR SELECT
  USING (deleted_at IS NULL AND is_active_member(community_id));

CREATE POLICY "posts_select_admin" ON posts FOR SELECT
  USING (is_community_admin(community_id)); -- admins see soft-deleted posts

CREATE POLICY "posts_insert" ON posts FOR INSERT
  WITH CHECK (author_id = auth.uid() AND is_active_member(community_id));

CREATE POLICY "posts_update_own" ON posts FOR UPDATE
  USING (author_id = auth.uid() AND is_active_member(community_id));

CREATE POLICY "posts_update_admin" ON posts FOR UPDATE
  USING (is_community_moderator(community_id));

CREATE POLICY "posts_delete_admin" ON posts FOR DELETE
  USING (is_community_admin(community_id));

-- ---------- COMMENTS ----------
CREATE POLICY "comments_select" ON comments FOR SELECT
  USING (
    deleted_at IS NULL
    AND EXISTS (
      SELECT 1 FROM posts p
      WHERE p.id = comments.post_id
      AND p.deleted_at IS NULL
      AND is_active_member(p.community_id)
    )
  );

CREATE POLICY "comments_insert" ON comments FOR INSERT
  WITH CHECK (
    author_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM posts p
      WHERE p.id = comments.post_id
      AND is_active_member(p.community_id)
    )
  );

CREATE POLICY "comments_update_own" ON comments FOR UPDATE
  USING (author_id = auth.uid());

CREATE POLICY "comments_delete_mod" ON comments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM posts p
      WHERE p.id = comments.post_id
      AND is_community_moderator(p.community_id)
    )
  );

-- ---------- REACTIONS ----------
CREATE POLICY "reactions_select" ON reactions FOR SELECT
  USING (is_active_member(community_id));

CREATE POLICY "reactions_insert" ON reactions FOR INSERT
  WITH CHECK (user_id = auth.uid() AND is_active_member(community_id));

CREATE POLICY "reactions_delete_own" ON reactions FOR DELETE
  USING (user_id = auth.uid());

-- ---------- POST_ATTACHMENTS ----------
CREATE POLICY "post_attachments_select" ON post_attachments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM posts p
      WHERE p.id = post_attachments.post_id
      AND p.deleted_at IS NULL
      AND is_active_member(p.community_id)
    )
  );

CREATE POLICY "post_attachments_insert" ON post_attachments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM posts p
      WHERE p.id = post_attachments.post_id
      AND p.author_id = auth.uid()
    )
  );

-- ---------- POLLS ----------
CREATE POLICY "polls_select" ON polls FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM posts p
      WHERE p.id = polls.post_id
      AND p.deleted_at IS NULL
      AND is_active_member(p.community_id)
    )
  );

CREATE POLICY "polls_insert" ON polls FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM posts p
      WHERE p.id = polls.post_id
      AND p.author_id = auth.uid()
    )
  );

-- ---------- POLL_OPTIONS ----------
CREATE POLICY "poll_options_select" ON poll_options FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM polls pl
      JOIN posts p ON p.id = pl.post_id
      WHERE pl.id = poll_options.poll_id
      AND p.deleted_at IS NULL
      AND is_active_member(p.community_id)
    )
  );

-- ---------- POLL_VOTES ----------
CREATE POLICY "poll_votes_select" ON poll_votes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM polls pl
      JOIN posts p ON p.id = pl.post_id
      WHERE pl.id = poll_votes.poll_id
      AND is_active_member(p.community_id)
    )
  );

CREATE POLICY "poll_votes_insert" ON poll_votes FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM polls pl
      JOIN posts p ON p.id = pl.post_id
      WHERE pl.id = poll_votes.poll_id
      AND is_active_member(p.community_id)
    )
  );

CREATE POLICY "poll_votes_delete_own" ON poll_votes FOR DELETE
  USING (user_id = auth.uid());

-- ---------- REPORTS ----------
CREATE POLICY "reports_select_admin" ON reports FOR SELECT
  USING (is_community_admin(community_id));

CREATE POLICY "reports_insert" ON reports FOR INSERT
  WITH CHECK (reporter_id = auth.uid() AND is_active_member(community_id));

CREATE POLICY "reports_update_admin" ON reports FOR UPDATE
  USING (is_community_admin(community_id));

-- ---------- COURSES ----------
CREATE POLICY "courses_select_published" ON courses FOR SELECT
  USING (published = true AND is_active_member(community_id));

CREATE POLICY "courses_select_admin" ON courses FOR SELECT
  USING (is_community_admin(community_id));

CREATE POLICY "courses_manage_admin" ON courses FOR ALL
  USING (is_community_admin(community_id));

-- ---------- MODULES ----------
CREATE POLICY "modules_select" ON modules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = modules.course_id
      AND c.published = true
      AND is_active_member(c.community_id)
    )
  );

CREATE POLICY "modules_select_admin" ON modules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = modules.course_id
      AND is_community_admin(c.community_id)
    )
  );

CREATE POLICY "modules_manage_admin" ON modules FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = modules.course_id
      AND is_community_admin(c.community_id)
    )
  );

-- ---------- LESSONS ----------
CREATE POLICY "lessons_select_enrolled" ON lessons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = lessons.course_id
      AND c.published = true
      AND is_active_member(c.community_id)
      AND (
        c.is_free = true
        OR EXISTS (SELECT 1 FROM enrollments e WHERE e.course_id = c.id AND e.user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM subscriptions s WHERE s.user_id = auth.uid() AND s.lifetime_access = true AND s.status = 'active')
      )
    )
  );

CREATE POLICY "lessons_select_admin" ON lessons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = lessons.course_id
      AND is_community_admin(c.community_id)
    )
  );

CREATE POLICY "lessons_manage_admin" ON lessons FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = lessons.course_id
      AND is_community_admin(c.community_id)
    )
  );

-- ---------- ENROLLMENTS ----------
CREATE POLICY "enrollments_select_own" ON enrollments FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "enrollments_insert_own" ON enrollments FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "enrollments_select_admin" ON enrollments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = enrollments.course_id
      AND is_community_admin(c.community_id)
    )
  );

-- ---------- LESSON_PROGRESS ----------
CREATE POLICY "lesson_progress_select_own" ON lesson_progress FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "lesson_progress_insert_own" ON lesson_progress FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "lesson_progress_update_own" ON lesson_progress FOR UPDATE
  USING (user_id = auth.uid());

-- ---------- LESSON_ATTACHMENTS ----------
CREATE POLICY "lesson_attachments_select" ON lesson_attachments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM lessons l
      JOIN courses c ON c.id = l.course_id
      WHERE l.id = lesson_attachments.lesson_id
      AND c.published = true
      AND is_active_member(c.community_id)
      AND (
        c.is_free = true
        OR EXISTS (SELECT 1 FROM enrollments e WHERE e.course_id = c.id AND e.user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM subscriptions s WHERE s.user_id = auth.uid() AND s.lifetime_access = true AND s.status = 'active')
      )
    )
  );

-- ---------- LEVELS ----------
CREATE POLICY "levels_select" ON levels FOR SELECT
  USING (true); -- all authenticated can read levels

CREATE POLICY "levels_manage_admin" ON levels FOR ALL
  USING (is_community_admin(community_id));

-- ---------- MEMBER_STATS ----------
CREATE POLICY "member_stats_select" ON member_stats FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM community_members cm
      WHERE cm.id = member_stats.community_member_id
      AND is_active_member(cm.community_id)
    )
  );
-- No client INSERT/UPDATE/DELETE — managed by triggers/functions

-- ---------- POINTS_LOG ----------
CREATE POLICY "points_log_select_own" ON points_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM community_members cm
      WHERE cm.id = points_log.community_member_id
      AND cm.member_id = auth.uid()
    )
  );
-- No client INSERT/UPDATE/DELETE — managed by server-side functions

-- ---------- POINT_CONFIG ----------
CREATE POLICY "point_config_select" ON point_config FOR SELECT
  USING (is_active_member(community_id));

CREATE POLICY "point_config_manage_admin" ON point_config FOR ALL
  USING (is_community_admin(community_id));

-- ---------- EVENTS ----------
CREATE POLICY "events_select" ON events FOR SELECT
  USING (is_active_member(community_id));

CREATE POLICY "events_insert_mod" ON events FOR INSERT
  WITH CHECK (created_by = auth.uid() AND is_community_moderator(community_id));

CREATE POLICY "events_update_creator" ON events FOR UPDATE
  USING (created_by = auth.uid() OR is_community_admin(community_id));

CREATE POLICY "events_delete_admin" ON events FOR DELETE
  USING (is_community_admin(community_id));

-- ---------- EVENT_RSVPS ----------
CREATE POLICY "event_rsvps_select" ON event_rsvps FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events e
      WHERE e.id = event_rsvps.event_id
      AND is_active_member(e.community_id)
    )
  );

CREATE POLICY "event_rsvps_insert_own" ON event_rsvps FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "event_rsvps_update_own" ON event_rsvps FOR UPDATE
  USING (user_id = auth.uid());

-- ---------- CONVERSATIONS ----------
CREATE POLICY "conversations_select" ON conversations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants cp
      WHERE cp.conversation_id = conversations.id
      AND cp.user_id = auth.uid()
    )
  );

CREATE POLICY "conversations_insert" ON conversations FOR INSERT
  WITH CHECK (is_active_member(community_id));

-- ---------- CONVERSATION_PARTICIPANTS ----------
CREATE POLICY "cp_select" ON conversation_participants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants cp2
      WHERE cp2.conversation_id = conversation_participants.conversation_id
      AND cp2.user_id = auth.uid()
    )
  );

CREATE POLICY "cp_update_own" ON conversation_participants FOR UPDATE
  USING (user_id = auth.uid());

-- ---------- MESSAGES ----------
CREATE POLICY "messages_select" ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants cp
      WHERE cp.conversation_id = messages.conversation_id
      AND cp.user_id = auth.uid()
    )
  );

CREATE POLICY "messages_insert" ON messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM conversation_participants cp
      WHERE cp.conversation_id = messages.conversation_id
      AND cp.user_id = auth.uid()
    )
  );

-- ---------- NOTIFICATIONS ----------
CREATE POLICY "notifications_select_own" ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "notifications_update_own" ON notifications FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "notifications_delete_own" ON notifications FOR DELETE
  USING (user_id = auth.uid());
-- No client INSERT — server-side only

-- ---------- SUBSCRIPTIONS ----------
CREATE POLICY "subscriptions_select_own" ON subscriptions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "subscriptions_select_admin" ON subscriptions FOR SELECT
  USING (is_community_admin(community_id));
-- No client INSERT/UPDATE/DELETE — managed by Edge Functions (service role)

-- ---------- PAYMENTS ----------
CREATE POLICY "payments_select_own" ON payments FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "payments_select_admin" ON payments FOR SELECT
  USING (is_community_admin(community_id));
-- No client writes — managed by Edge Functions (service role)

-- ---------- WEBHOOK_EVENTS ----------
-- No client access. Service role only.

-- ---------- EMAIL_PREFERENCES ----------
CREATE POLICY "email_prefs_select_own" ON email_preferences FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "email_prefs_update_own" ON email_preferences FOR UPDATE
  USING (user_id = auth.uid());

-- ---------- EMAIL_LOG ----------
CREATE POLICY "email_log_select_admin" ON email_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM community_members cm
      WHERE cm.member_id = auth.uid()
      AND cm.role IN ('owner', 'admin')
      AND cm.status = 'active'
      AND cm.deleted_at IS NULL
    )
  );
-- No client writes — managed by Edge Functions

-- ---------- MEMBER_STORAGE ----------
CREATE POLICY "member_storage_select_own" ON member_storage FOR SELECT
  USING (user_id = auth.uid());
-- Updates managed by server-side triggers

-- ---------- RATE_LIMITS ----------
-- No client access. Service role only.

-- ---------- CONSENT_RECORDS ----------
CREATE POLICY "consent_insert" ON consent_records FOR INSERT
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "consent_select_own" ON consent_records FOR SELECT
  USING (user_id = auth.uid());

-- ---------- DATA_EXPORT_REQUESTS ----------
CREATE POLICY "export_select_own" ON data_export_requests FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "export_insert_own" ON data_export_requests FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- ---------- DELETION_REQUESTS ----------
CREATE POLICY "deletion_select_own" ON deletion_requests FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "deletion_insert_own" ON deletion_requests FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- ---------- AUDIT_LOG ----------
-- No client access. Service role only.

-- ---------- TRACKING_EVENTS ----------
CREATE POLICY "tracking_select_admin" ON tracking_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM community_members cm
      WHERE cm.member_id = auth.uid()
      AND cm.role IN ('owner', 'admin')
      AND cm.status = 'active'
      AND cm.deleted_at IS NULL
    )
  );
-- No client writes — managed by Edge Functions

-- ---------- TRACKING_RETRY_QUEUE ----------
-- No client access. Service role only.

-- ---------- LESSON_COMMENTS ----------
CREATE POLICY "lesson_comments_select" ON lesson_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM lessons l
      JOIN courses c ON c.id = l.course_id
      WHERE l.id = lesson_comments.lesson_id
      AND is_active_member(c.community_id)
      AND (
        c.is_free = true
        OR EXISTS (SELECT 1 FROM enrollments e WHERE e.course_id = c.id AND e.user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM subscriptions s WHERE s.user_id = auth.uid() AND s.lifetime_access = true AND s.status = 'active')
      )
    )
  );

CREATE POLICY "lesson_comments_insert" ON lesson_comments FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM lessons l
      JOIN courses c ON c.id = l.course_id
      WHERE l.id = lesson_comments.lesson_id
      AND (
        c.is_free = true
        OR EXISTS (SELECT 1 FROM enrollments e WHERE e.course_id = c.id AND e.user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM subscriptions s WHERE s.user_id = auth.uid() AND s.lifetime_access = true AND s.status = 'active')
      )
    )
  );

CREATE POLICY "lesson_comments_delete_own" ON lesson_comments FOR DELETE
  USING (user_id = auth.uid());

CREATE POLICY "lesson_comments_delete_admin" ON lesson_comments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM lessons l
      JOIN courses c ON c.id = l.course_id
      WHERE l.id = lesson_comments.lesson_id
      AND is_community_admin(c.community_id)
    )
  );

-- ---------- CONTENT_ENGAGEMENT_LOG ----------
-- INSERT only for own user. SELECT own or admin. NO UPDATE. NO DELETE.
CREATE POLICY "engagement_insert_own" ON content_engagement_log FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "engagement_select_own" ON content_engagement_log FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "engagement_select_admin" ON content_engagement_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = content_engagement_log.course_id
      AND is_community_admin(c.community_id)
    )
  );

-- ---------- COURSE_ANALYTICS_CACHE ----------
CREATE POLICY "analytics_cache_select_admin" ON course_analytics_cache FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = course_analytics_cache.course_id
      AND is_community_admin(c.community_id)
    )
  );
-- Writes are service role only (Edge Function)

-- ---------- SEARCH_LOG ----------
CREATE POLICY "search_log_insert" ON search_log FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "search_log_select_admin" ON search_log FOR SELECT
  USING (is_community_admin(community_id));

-- ============================================================================
-- PHASE 11: INDEXES
-- ============================================================================

-- Feed indexes
CREATE INDEX IF NOT EXISTS idx_posts_community_feed ON posts (community_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_search ON posts USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_comments_post_thread ON comments (post_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_reactions_target ON reactions (target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user_target ON reactions (user_id, target_type, target_id);

-- Community/Role indexes
CREATE INDEX IF NOT EXISTS idx_cm_community_role ON community_members (community_id, role);
-- (community_id, member_id) covered by UNIQUE constraint

-- Messaging/Notification indexes
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages (conversation_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_notifications_inbox ON notifications (user_id, read, created_at DESC);

-- Classroom indexes
CREATE INDEX IF NOT EXISTS idx_courses_search ON courses USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_lessons_search ON lessons USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_profiles_search ON profiles USING GIN (search_vector);
-- (course_id, user_id) on enrollments covered by UNIQUE
-- (lesson_id, user_id) on lesson_progress covered by UNIQUE

-- Gamification indexes
CREATE INDEX IF NOT EXISTS idx_member_stats_leaderboard ON member_stats (community_member_id);
CREATE INDEX IF NOT EXISTS idx_points_log_member ON points_log (community_member_id, created_at DESC);

-- Payment indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON subscriptions (user_id, status);

-- Event indexes
CREATE INDEX IF NOT EXISTS idx_events_community_time ON events (community_id, start_time);

-- Tracking indexes
CREATE INDEX IF NOT EXISTS idx_tracking_events_dedup ON tracking_events (event_id);
CREATE INDEX IF NOT EXISTS idx_tracking_events_status ON tracking_events (status)
  WHERE status IN ('failed', 'retrying');
CREATE INDEX IF NOT EXISTS idx_tracking_retry_next ON tracking_retry_queue (next_retry_at);

-- Engagement indexes
CREATE INDEX IF NOT EXISTS idx_engagement_user_course ON content_engagement_log (user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_engagement_lesson_type ON content_engagement_log (lesson_id, event_type);
CREATE INDEX IF NOT EXISTS idx_engagement_created ON content_engagement_log (created_at);
CREATE INDEX IF NOT EXISTS idx_lesson_comments_thread ON lesson_comments (lesson_id, created_at ASC);

-- Search log index
CREATE INDEX IF NOT EXISTS idx_search_log_community ON search_log (community_id, created_at DESC);

-- Privacy indexes
CREATE INDEX IF NOT EXISTS idx_deletion_requests_user ON deletion_requests (user_id);

-- Rate limiting indexes
CREATE INDEX IF NOT EXISTS idx_rate_limits_user ON rate_limits (user_id, action_type, window_start);
CREATE INDEX IF NOT EXISTS idx_rate_limits_ip ON rate_limits (ip_address, action_type, window_start);

-- ============================================================================
-- PHASE 12: TRIGGER FUNCTIONS
-- ============================================================================

-- Generic updated_at trigger
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-create profile from auth.users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    now(),
    now()
  );

  -- Auto-create email_preferences
  INSERT INTO email_preferences (user_id) VALUES (NEW.id);

  -- Auto-create member_storage
  INSERT INTO member_storage (user_id) VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Search vector update for posts
CREATE OR REPLACE FUNCTION update_posts_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', NEW.body), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Search vector update for courses
CREATE OR REPLACE FUNCTION update_courses_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', NEW.title), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Search vector update for lessons
CREATE OR REPLACE FUNCTION update_lessons_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', NEW.title), 'A');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Search vector update for profiles
CREATE OR REPLACE FUNCTION update_profiles_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.display_name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.bio, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Course progress function
CREATE OR REPLACE FUNCTION get_course_progress(p_user_id uuid, p_course_id uuid)
RETURNS integer AS $$
  SELECT COALESCE(
    ROUND(
      (COUNT(*) FILTER (WHERE completed))::numeric
      / NULLIF(COUNT(*), 0) * 100
    )::integer,
    0
  )
  FROM lesson_progress
  WHERE user_id = p_user_id
  AND lesson_id IN (SELECT id FROM lessons WHERE course_id = p_course_id);
$$ LANGUAGE sql STABLE;

-- User anonymization function (GDPR compliance)
CREATE OR REPLACE FUNCTION anonymize_user(p_user_id uuid)
RETURNS void AS $$
DECLARE
  v_new_username text;
BEGIN
  v_new_username := 'deleted-' || gen_random_uuid()::text;

  -- Anonymize profile
  UPDATE profiles SET
    display_name = 'Deleted Member',
    username = v_new_username,
    avatar_url = NULL,
    bio = NULL,
    website = NULL,
    location = NULL,
    social_links = NULL,
    search_vector = NULL,
    updated_at = now()
  WHERE id = p_user_id;

  -- Soft-delete community memberships
  UPDATE community_members SET
    deleted_at = now()
  WHERE member_id = p_user_id;

  -- Delete reactions (don't need to preserve)
  DELETE FROM reactions WHERE user_id = p_user_id;

  -- Delete notifications
  DELETE FROM notifications WHERE user_id = p_user_id;

  -- Delete enrollments
  DELETE FROM enrollments WHERE user_id = p_user_id;

  -- Delete poll votes
  DELETE FROM poll_votes WHERE user_id = p_user_id;

  -- Delete event RSVPs
  DELETE FROM event_rsvps WHERE user_id = p_user_id;

  -- Cancel subscriptions
  UPDATE subscriptions SET
    status = 'canceled',
    cancel_at_period_end = true,
    updated_at = now()
  WHERE user_id = p_user_id AND status IN ('active', 'trialing', 'past_due');

  -- Log the deletion
  INSERT INTO audit_log (user_id, action, target_type, target_id, metadata)
  VALUES (p_user_id, 'account_deleted', 'profile', p_user_id, '{}'::jsonb);

  -- Posts, comments, messages are RETAINED (attributed to "Deleted Member")
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- PHASE 13: TRIGGERS
-- ============================================================================

-- Auto-create profile on auth signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Search vector triggers
CREATE TRIGGER trg_posts_search_vector
  BEFORE INSERT OR UPDATE OF title, body ON posts
  FOR EACH ROW EXECUTE FUNCTION update_posts_search_vector();

CREATE TRIGGER trg_courses_search_vector
  BEFORE INSERT OR UPDATE OF title, description ON courses
  FOR EACH ROW EXECUTE FUNCTION update_courses_search_vector();

CREATE TRIGGER trg_lessons_search_vector
  BEFORE INSERT OR UPDATE OF title ON lessons
  FOR EACH ROW EXECUTE FUNCTION update_lessons_search_vector();

CREATE TRIGGER trg_profiles_search_vector
  BEFORE INSERT OR UPDATE OF display_name, bio ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_profiles_search_vector();

-- updated_at triggers
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_event_rsvps_updated_at
  BEFORE UPDATE ON event_rsvps
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_email_preferences_updated_at
  BEFORE UPDATE ON email_preferences
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_member_storage_updated_at
  BEFORE UPDATE ON member_storage
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_lesson_comments_updated_at
  BEFORE UPDATE ON lesson_comments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- MIGRATION COMPLETE
-- Tables: 45 | RLS Policies: ~65 | Indexes: ~30 | Triggers: ~15
-- ============================================================================
