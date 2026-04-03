import React, { useState } from 'react';
import type { AgentActivity, AgentActionType, AgentKey } from '../../types/agents';

interface AgentActivityLogProps {
  activities: AgentActivity[];
  loading: boolean;
}

const ACTION_LABELS: Record<AgentActionType, string> = {
  post_created: 'Posted',
  comment_created: 'Replied',
  draft_queued: 'Drafted',
  draft_approved: 'Approved',
  draft_rejected: 'Rejected',
  error: 'Error',
  skipped: 'Skipped',
};

const ACTION_COLORS: Record<AgentActionType, string> = {
  post_created: '#22c55e',
  comment_created: '#3b82f6',
  draft_queued: '#f59e0b',
  draft_approved: '#22c55e',
  draft_rejected: '#ef4444',
  error: '#ef4444',
  skipped: '#6b7280',
};

export default function AgentActivityLog({ activities, loading }: AgentActivityLogProps) {
  const [filter, setFilter] = useState<AgentActionType | 'all'>('all');

  if (loading) {
    return <div className="agent-activity__loading">Loading activity...</div>;
  }

  const filtered = filter === 'all'
    ? activities
    : activities.filter(a => a.action_type === filter);

  return (
    <div className="agent-activity">
      <div className="agent-activity__filters" role="tablist">
        {(['all', 'post_created', 'comment_created', 'error', 'skipped'] as const).map(f => (
          <button
            key={f}
            className={`agent-activity__filter ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
            role="tab"
            aria-selected={filter === f}
          >
            {f === 'all' ? 'All' : ACTION_LABELS[f as AgentActionType] || f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="agent-activity__empty">No activity to show.</div>
      ) : (
        <div className="agent-activity__list">
          {filtered.map(activity => (
            <div key={activity.id} className="agent-activity__item">
              <div className="agent-activity__item-left">
                <img
                  src={`/avatars/agents/${activity.agent_config?.agent_key || 'jenna'}.jpg`}
                  alt=""
                  width={28}
                  height={28}
                  className="agent-activity__avatar"
                />
                <div>
                  <span className="agent-activity__agent-name">
                    {activity.agent_config?.display_name || 'Agent'}
                  </span>
                  <span
                    className="agent-activity__action"
                    style={{ color: ACTION_COLORS[activity.action_type] }}
                  >
                    {ACTION_LABELS[activity.action_type] || activity.action_type}
                  </span>
                  {activity.target_type && (
                    <span className="agent-activity__target">
                      {activity.target_type}
                    </span>
                  )}
                </div>
              </div>
              <div className="agent-activity__item-right">
                {activity.tokens_used > 0 && (
                  <span className="agent-activity__tokens" title="Tokens used">
                    {activity.tokens_used.toLocaleString()} tok
                  </span>
                )}
                {activity.cost_usd > 0 && (
                  <span className="agent-activity__cost" title="Cost">
                    ${activity.cost_usd.toFixed(4)}
                  </span>
                )}
                <time className="agent-activity__time">
                  {new Date(activity.created_at).toLocaleTimeString('en-US', {
                    hour: 'numeric', minute: '2-digit'
                  })}
                </time>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
