import React, { useState } from 'react';
import type { AgentDraft } from '../../types/agents';

interface AgentDraftQueueProps {
  drafts: AgentDraft[];
  loading: boolean;
  onApprove: (draft: AgentDraft) => void;
  onReject: (draftId: string, reason: string) => void;
}

export default function AgentDraftQueue({ drafts, loading, onApprove, onReject }: AgentDraftQueueProps) {
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  if (loading) {
    return <div className="agent-drafts__loading">Loading drafts...</div>;
  }

  if (drafts.length === 0) {
    return (
      <div className="agent-drafts__empty">
        <p>No pending drafts. Agents are either posting directly or haven't generated content yet.</p>
      </div>
    );
  }

  const handleReject = (draftId: string) => {
    if (rejectReason.trim()) {
      onReject(draftId, rejectReason);
      setRejectingId(null);
      setRejectReason('');
    }
  };

  return (
    <div className="agent-drafts">
      <div className="agent-drafts__count">
        {drafts.length} pending draft{drafts.length !== 1 ? 's' : ''}
      </div>

      {drafts.map(draft => (
        <div key={draft.id} className="agent-draft-item">
          <div className="agent-draft-item__header">
            <div className="agent-draft-item__agent">
              <img
                src={`/avatars/agents/${draft.agent_config?.agent_key || 'jenna'}.jpg`}
                alt=""
                width={32}
                height={32}
                className="agent-draft-item__avatar"
              />
              <span className="agent-draft-item__name">
                {draft.agent_config?.display_name || 'Agent'}
              </span>
            </div>
            <span className="agent-draft-item__type">
              {draft.content_type === 'post' ? 'New Post' : 'Comment Reply'}
            </span>
            <time className="agent-draft-item__date">
              {new Date(draft.created_at).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
              })}
            </time>
          </div>

          {draft.title && (
            <h4 className="agent-draft-item__title">{draft.title}</h4>
          )}

          <div
            className="agent-draft-item__body"
            dangerouslySetInnerHTML={{ __html: draft.body_html || draft.body }}
          />

          <div className="agent-draft-item__actions">
            <button
              className="btn btn-sm btn-success"
              onClick={() => onApprove(draft)}
              aria-label={`Approve draft from ${draft.agent_config?.display_name}`}
            >
              Approve
            </button>

            {rejectingId === draft.id ? (
              <div className="agent-draft-item__reject-form">
                <input
                  type="text"
                  placeholder="Reason for rejection..."
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleReject(draft.id)}
                  autoFocus
                />
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleReject(draft.id)}
                  disabled={!rejectReason.trim()}
                >
                  Confirm Reject
                </button>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => { setRejectingId(null); setRejectReason(''); }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                className="btn btn-sm btn-danger"
                onClick={() => setRejectingId(draft.id)}
                aria-label={`Reject draft from ${draft.agent_config?.display_name}`}
              >
                Reject
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
