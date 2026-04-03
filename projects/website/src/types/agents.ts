/**
 * AI Community Engagement Agents — Type Definitions
 * Feature: 032-ai-community-agents
 */

export type AgentKey = 'jenna' | 'patrice' | 'chris';

export type AgentActionType =
  | 'post_created'
  | 'comment_created'
  | 'draft_queued'
  | 'draft_approved'
  | 'draft_rejected'
  | 'error'
  | 'skipped';

export type DraftStatus = 'pending' | 'approved' | 'rejected' | 'expired';
export type DraftContentType = 'post' | 'comment';

export interface AgentConfig {
  id: string;
  profile_id: string;
  agent_key: AgentKey;
  display_name: string;
  persona_prompt: string;
  posting_schedule: Record<string, string>;
  post_types: string[];
  is_active: boolean;
  review_mode: boolean;
  max_posts_per_week: number;
  max_replies_per_hour: number;
  llm_model: string;
  llm_temperature: number;
  knowledge_scope: string[];
  last_posted_at: string | null;
  error_count_1h: number;
  created_at: string;
  updated_at: string;
}

export interface AgentDraft {
  id: string;
  agent_config_id: string;
  content_type: DraftContentType;
  title: string | null;
  body: string;
  body_html: string | null;
  category_id: string | null;
  parent_post_id: string | null;
  parent_comment_id: string | null;
  status: DraftStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  scheduled_for: string | null;
  expires_at: string;
  created_at: string;
  agent_config?: Pick<AgentConfig, 'display_name' | 'agent_key'>;
}

export interface AgentActivity {
  id: string;
  agent_config_id: string;
  action_type: AgentActionType;
  target_type: 'post' | 'comment' | null;
  target_id: string | null;
  prompt_used: string | null;
  llm_response: string | null;
  rag_chunks_used: string[];
  tokens_used: number;
  cost_usd: number;
  duration_ms: number;
  metadata: Record<string, unknown>;
  created_at: string;
  agent_config?: Pick<AgentConfig, 'display_name' | 'agent_key'>;
}

export interface AgentTopicHistory {
  id: string;
  agent_config_id: string;
  post_id: string | null;
  topic_summary: string;
  post_type: string;
  module_slug: string | null;
  created_at: string;
}

export interface AgentStats {
  agent_key: AgentKey;
  display_name: string;
  posts_this_week: number;
  replies_this_week: number;
  drafts_pending: number;
  errors_this_week: number;
  tokens_this_week: number;
  cost_this_week: number;
  avg_response_time_ms: number;
  escalations_this_week: number;
}

export interface AgentCardData {
  config: AgentConfig;
  stats: AgentStats;
  avatar_url: string;
  next_scheduled: string | null;
}
