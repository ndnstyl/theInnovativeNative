-- Migration: AI Community Engagement Agents
-- Feature: 032-ai-community-agents
-- Date: 2026-04-02

-- ============================================================================
-- Step 1: Add is_agent column to profiles
-- ============================================================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_agent boolean NOT NULL DEFAULT false;

-- ============================================================================
-- Step 2: agent_config — Agent personas, schedules, operational settings
-- ============================================================================

CREATE TABLE IF NOT EXISTS agent_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  agent_key text UNIQUE NOT NULL CHECK (agent_key IN ('jenna', 'patrice', 'chris')),
  display_name text NOT NULL,
  persona_prompt text NOT NULL,
  posting_schedule jsonb NOT NULL DEFAULT '{}',
  post_types text[] NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  review_mode boolean NOT NULL DEFAULT true,
  max_posts_per_week integer NOT NULL DEFAULT 4,
  max_replies_per_hour integer NOT NULL DEFAULT 3,
  llm_model text NOT NULL DEFAULT 'gemini-2.0-flash',
  llm_temperature numeric(3,2) NOT NULL DEFAULT 0.8,
  knowledge_scope text[] NOT NULL DEFAULT '{}',
  last_posted_at timestamptz,
  error_count_1h integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agent_config_agent_key ON agent_config(agent_key);

-- ============================================================================
-- Step 3: agent_topic_history — Tracks posted topics for deduplication
-- ============================================================================

CREATE TABLE IF NOT EXISTS agent_topic_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_config_id uuid NOT NULL REFERENCES agent_config(id) ON DELETE CASCADE,
  post_id uuid REFERENCES posts(id) ON DELETE SET NULL,
  topic_summary text NOT NULL,
  topic_embedding vector(1536) NOT NULL,
  post_type text NOT NULL,
  module_slug text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agent_topic_history_agent_date
  ON agent_topic_history(agent_config_id, created_at DESC);

-- HNSW index for semantic similarity search
CREATE INDEX IF NOT EXISTS idx_agent_topic_embedding_hnsw
  ON agent_topic_history USING hnsw (topic_embedding vector_cosine_ops);

-- ============================================================================
-- Step 4: agent_activity_log — Full audit trail
-- ============================================================================

CREATE TABLE IF NOT EXISTS agent_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_config_id uuid NOT NULL REFERENCES agent_config(id) ON DELETE CASCADE,
  action_type text NOT NULL CHECK (action_type IN (
    'post_created', 'comment_created', 'draft_queued',
    'draft_approved', 'draft_rejected', 'error', 'skipped'
  )),
  target_type text CHECK (target_type IN ('post', 'comment')),
  target_id uuid,
  prompt_used text,
  llm_response text,
  rag_chunks_used jsonb DEFAULT '[]',
  tokens_used integer DEFAULT 0,
  cost_usd numeric(8,4) DEFAULT 0,
  duration_ms integer DEFAULT 0,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agent_activity_agent_date
  ON agent_activity_log(agent_config_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_activity_action_type
  ON agent_activity_log(action_type);

-- ============================================================================
-- Step 5: agent_draft_queue — Pending content for admin review
-- ============================================================================

CREATE TABLE IF NOT EXISTS agent_draft_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_config_id uuid NOT NULL REFERENCES agent_config(id) ON DELETE CASCADE,
  content_type text NOT NULL CHECK (content_type IN ('post', 'comment')),
  title text,
  body text NOT NULL,
  body_html text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  parent_post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  parent_comment_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  reviewed_by uuid REFERENCES profiles(id),
  reviewed_at timestamptz,
  rejection_reason text,
  scheduled_for timestamptz,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '48 hours'),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agent_draft_queue_status
  ON agent_draft_queue(agent_config_id, status);
CREATE INDEX IF NOT EXISTS idx_agent_draft_queue_expires
  ON agent_draft_queue(expires_at) WHERE status = 'pending';

-- ============================================================================
-- Step 6: RLS Policies
-- ============================================================================

-- agent_config
ALTER TABLE agent_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_read_agent_config" ON agent_config
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM community_members cm
    WHERE cm.member_id = auth.uid()
    AND cm.role IN ('owner', 'admin')
    AND cm.status = 'active'
  ));

CREATE POLICY "admin_update_agent_config" ON agent_config
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM community_members cm
    WHERE cm.member_id = auth.uid()
    AND cm.role IN ('owner', 'admin')
    AND cm.status = 'active'
  ));

CREATE POLICY "member_read_active_agents" ON agent_config
  FOR SELECT TO authenticated
  USING (is_active = true);

-- agent_draft_queue
ALTER TABLE agent_draft_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_manage_drafts" ON agent_draft_queue
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM community_members cm
    WHERE cm.member_id = auth.uid()
    AND cm.role IN ('owner', 'admin')
    AND cm.status = 'active'
  ));

-- agent_activity_log
ALTER TABLE agent_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_read_activity_log" ON agent_activity_log
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM community_members cm
    WHERE cm.member_id = auth.uid()
    AND cm.role IN ('owner', 'admin')
    AND cm.status = 'active'
  ));

-- agent_topic_history
ALTER TABLE agent_topic_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_read_topic_history" ON agent_topic_history
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM community_members cm
    WHERE cm.member_id = auth.uid()
    AND cm.role IN ('owner', 'admin')
    AND cm.status = 'active'
  ));

-- ============================================================================
-- Step 7: Updated_at trigger for agent_config
-- ============================================================================

CREATE OR REPLACE FUNCTION update_agent_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER agent_config_updated_at
  BEFORE UPDATE ON agent_config
  FOR EACH ROW
  EXECUTE FUNCTION update_agent_config_updated_at();
