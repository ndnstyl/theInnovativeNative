/**
 * Admin hooks for AI Community Agents
 * Feature: 032-ai-community-agents
 *
 * Uses direct Supabase REST API calls instead of typed client
 * because the Database type definition doesn't include agent tables yet.
 */

import { useState, useEffect, useCallback } from 'react';
import type { AgentConfig, AgentDraft, AgentActivity, AgentStats, AgentKey } from '../types/agents';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

async function supabaseRest<T>(
  path: string,
  options: { method?: string; body?: unknown; token?: string } = {}
): Promise<{ data: T | null; error: string | null }> {
  const { method = 'GET', body, token } = options;

  const storedSession = typeof window !== 'undefined'
    ? localStorage.getItem('sb-session-token') || localStorage.getItem('supabase.auth.token')
    : null;

  const authToken = token || storedSession || SUPABASE_ANON_KEY;

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      method,
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Prefer': method === 'GET' ? '' : 'return=representation',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const text = await res.text();
      return { data: null, error: `${res.status}: ${text}` };
    }

    const data = await res.json();
    return { data: data as T, error: null };
  } catch (e: any) {
    return { data: null, error: e.message };
  }
}

export function useAgentConfigs() {
  const [configs, setConfigs] = useState<AgentConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfigs = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabaseRest<AgentConfig[]>(
      'agent_config?select=*&order=agent_key'
    );
    if (err) setError(err);
    else setConfigs(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchConfigs(); }, [fetchConfigs]);

  const toggleActive = async (configId: string, isActive: boolean) => {
    const { error: err } = await supabaseRest(
      `agent_config?id=eq.${configId}`,
      { method: 'PATCH', body: { is_active: isActive } }
    );
    if (!err) fetchConfigs();
    return err;
  };

  const toggleReviewMode = async (configId: string, reviewMode: boolean) => {
    const { error: err } = await supabaseRest(
      `agent_config?id=eq.${configId}`,
      { method: 'PATCH', body: { review_mode: reviewMode } }
    );
    if (!err) fetchConfigs();
    return err;
  };

  const updateConfig = async (configId: string, updates: Partial<AgentConfig>) => {
    const { error: err } = await supabaseRest(
      `agent_config?id=eq.${configId}`,
      { method: 'PATCH', body: updates }
    );
    if (!err) fetchConfigs();
    return err;
  };

  return { configs, loading, error, fetchConfigs, toggleActive, toggleReviewMode, updateConfig };
}

export function useAgentDrafts() {
  const [drafts, setDrafts] = useState<AgentDraft[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDrafts = useCallback(async () => {
    setLoading(true);
    const { data } = await supabaseRest<AgentDraft[]>(
      'agent_draft_queue?status=eq.pending&select=*,agent_config(display_name,agent_key)&order=created_at.desc'
    );
    setDrafts(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchDrafts(); }, [fetchDrafts]);

  const approveDraft = async (draft: AgentDraft, userId: string) => {
    // Step 1: Get agent profile_id
    const { data: configData } = await supabaseRest<AgentConfig[]>(
      `agent_config?id=eq.${draft.agent_config_id}&select=profile_id`
    );
    const profileId = configData?.[0]?.profile_id;
    if (!profileId) return { error: 'Agent config not found' };

    // Step 2: Insert as real post or comment
    if (draft.content_type === 'post') {
      const { error: postErr } = await supabaseRest('posts', {
        method: 'POST',
        body: {
          community_id: 'a0000000-0000-0000-0000-000000000001',
          author_id: profileId,
          category_id: draft.category_id,
          title: draft.title,
          body: draft.body,
          body_html: draft.body_html,
        }
      });
      if (postErr) return { error: postErr };
    } else {
      const { error: commentErr } = await supabaseRest('comments', {
        method: 'POST',
        body: {
          post_id: draft.parent_post_id,
          author_id: profileId,
          body: draft.body,
          body_html: draft.body_html,
        }
      });
      if (commentErr) return { error: commentErr };
    }

    // Step 3: Update draft status
    const { error: updateErr } = await supabaseRest(
      `agent_draft_queue?id=eq.${draft.id}`,
      {
        method: 'PATCH',
        body: {
          status: 'approved',
          reviewed_by: userId,
          reviewed_at: new Date().toISOString(),
        }
      }
    );

    if (!updateErr) fetchDrafts();
    return { error: updateErr };
  };

  const rejectDraft = async (draftId: string, userId: string, reason: string) => {
    const { error: err } = await supabaseRest(
      `agent_draft_queue?id=eq.${draftId}`,
      {
        method: 'PATCH',
        body: {
          status: 'rejected',
          reviewed_by: userId,
          reviewed_at: new Date().toISOString(),
          rejection_reason: reason,
        }
      }
    );
    if (!err) fetchDrafts();
    return err;
  };

  return { drafts, loading, fetchDrafts, approveDraft, rejectDraft };
}

export function useAgentActivity(agentKey?: AgentKey, limit = 50) {
  const [activities, setActivities] = useState<AgentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      setLoading(true);
      let path = `agent_activity_log?select=*,agent_config(display_name,agent_key)&order=created_at.desc&limit=${limit}`;

      if (agentKey) {
        const { data: config } = await supabaseRest<AgentConfig[]>(
          `agent_config?agent_key=eq.${agentKey}&select=id`
        );
        if (config?.[0]) {
          path += `&agent_config_id=eq.${config[0].id}`;
        }
      }

      const { data } = await supabaseRest<AgentActivity[]>(path);
      setActivities(data || []);
      setLoading(false);
    };

    fetchActivity();
  }, [agentKey, limit]);

  return { activities, loading };
}

export function useAgentStats() {
  const [stats, setStats] = useState<AgentStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      const { data: configs } = await supabaseRest<AgentConfig[]>('agent_config?select=id,agent_key,display_name');
      if (!configs) { setLoading(false); return; }

      const agentStats: AgentStats[] = [];

      for (const config of configs) {
        const { data: activities } = await supabaseRest<AgentActivity[]>(
          `agent_activity_log?agent_config_id=eq.${config.id}&created_at=gte.${weekAgo}&select=action_type,tokens_used,cost_usd,duration_ms,metadata`
        );

        const { data: draftData } = await supabaseRest<{ id: string }[]>(
          `agent_draft_queue?agent_config_id=eq.${config.id}&status=eq.pending&select=id`
        );

        const acts = activities || [];
        agentStats.push({
          agent_key: config.agent_key as AgentKey,
          display_name: config.display_name,
          posts_this_week: acts.filter(a => a.action_type === 'post_created').length,
          replies_this_week: acts.filter(a => a.action_type === 'comment_created').length,
          drafts_pending: draftData?.length || 0,
          errors_this_week: acts.filter(a => a.action_type === 'error').length,
          tokens_this_week: acts.reduce((sum, a) => sum + (a.tokens_used || 0), 0),
          cost_this_week: acts.reduce((sum, a) => sum + (a.cost_usd || 0), 0),
          avg_response_time_ms: 0,
          escalations_this_week: acts.filter(a => a.metadata && (a.metadata as Record<string, unknown>).escalated).length,
        });
      }

      setStats(agentStats);
      setLoading(false);
    };

    fetchStats();
  }, []);

  return { stats, loading };
}
