import React from 'react';
import type { AgentConfig, AgentStats } from '../../types/agents';

interface AgentCardProps {
  config: AgentConfig;
  stats?: AgentStats;
  onToggleActive: (configId: string, isActive: boolean) => void;
  onToggleReview: (configId: string, reviewMode: boolean) => void;
}

const STATUS_COLORS: Record<string, string> = {
  active: '#22c55e',
  paused: '#f59e0b',
  error: '#ef4444',
};

export default function AgentCard({ config, stats, onToggleActive, onToggleReview }: AgentCardProps) {
  const status = !config.is_active
    ? 'paused'
    : config.error_count_1h >= 5
      ? 'error'
      : 'active';

  const statusColor = STATUS_COLORS[status] || '#6b7280';

  const lastPosted = config.last_posted_at
    ? new Date(config.last_posted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
    : 'Never';

  return (
    <div className="agent-card">
      <div className="agent-card__header">
        <div className="agent-card__avatar">
          <img
            src={`/avatars/agents/${config.agent_key}.jpg`}
            alt={`${config.display_name} avatar`}
            width={48}
            height={48}
          />
          <span
            className="agent-card__status-dot"
            style={{ backgroundColor: statusColor }}
            aria-label={`Status: ${status}`}
          />
        </div>
        <div className="agent-card__info">
          <h3 className="agent-card__name">{config.display_name}</h3>
          <span className="agent-card__role">
            {config.agent_key === 'jenna' && 'Engagement Lead'}
            {config.agent_key === 'patrice' && 'Content Curator'}
            {config.agent_key === 'chris' && 'Community Responder'}
          </span>
        </div>
        <span
          className={`agent-card__badge agent-card__badge--${status}`}
          role="status"
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      <div className="agent-card__stats">
        <div className="agent-card__stat">
          <span className="agent-card__stat-value">{stats?.posts_this_week ?? 0}</span>
          <span className="agent-card__stat-label">Posts</span>
        </div>
        <div className="agent-card__stat">
          <span className="agent-card__stat-value">{stats?.replies_this_week ?? 0}</span>
          <span className="agent-card__stat-label">Replies</span>
        </div>
        <div className="agent-card__stat">
          <span className="agent-card__stat-value">{stats?.drafts_pending ?? 0}</span>
          <span className="agent-card__stat-label">Pending</span>
        </div>
        <div className="agent-card__stat">
          <span className="agent-card__stat-value">{stats?.errors_this_week ?? 0}</span>
          <span className="agent-card__stat-label">Errors</span>
        </div>
      </div>

      <div className="agent-card__meta">
        <span>Last post: {lastPosted}</span>
        <span>Model: {config.llm_model}</span>
      </div>

      <div className="agent-card__controls">
        <button
          className={`btn btn-sm ${config.is_active ? 'btn-warning' : 'btn-success'}`}
          onClick={() => onToggleActive(config.id, !config.is_active)}
          aria-label={config.is_active ? `Pause ${config.display_name}` : `Resume ${config.display_name}`}
        >
          {config.is_active ? 'Pause' : 'Resume'}
        </button>
        <label className="agent-card__toggle">
          <input
            type="checkbox"
            checked={config.review_mode}
            onChange={() => onToggleReview(config.id, !config.review_mode)}
            aria-label={`Review mode for ${config.display_name}`}
          />
          <span>Review Mode</span>
        </label>
      </div>
    </div>
  );
}
