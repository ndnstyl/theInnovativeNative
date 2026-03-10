import React, { useState } from 'react';
import { ReportWithReporter } from '@/hooks/useModeration';
import { timeAgo } from '@/lib/utils';

interface ModerationQueueProps {
  reports: ReportWithReporter[];
  loading: boolean;
  filter: 'pending' | 'all';
  onFilterChange: (f: 'pending' | 'all') => void;
  onDismiss: (reportId: string) => void;
  onRemove: (reportId: string, contentType: string, contentId: string) => void;
}

const ModerationQueue: React.FC<ModerationQueueProps> = ({
  reports, loading, filter, onFilterChange, onDismiss, onRemove
}) => {
  const [confirmId, setConfirmId] = useState<string | null>(null);

  if (loading) {
    return <div className="admin-loading"><div className="admin-loading__spinner" /></div>;
  }

  return (
    <div className="moderation-queue">
      <div className="moderation-queue__filters">
        <button
          className={`moderation-queue__filter ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => onFilterChange('pending')}
        >
          Pending
        </button>
        <button
          className={`moderation-queue__filter ${filter === 'all' ? 'active' : ''}`}
          onClick={() => onFilterChange('all')}
        >
          All Reports
        </button>
      </div>

      {reports.length === 0 ? (
        <div className="moderation-queue__empty">
          <i className="fa-solid fa-check-circle"></i>
          <p>No {filter === 'pending' ? 'pending ' : ''}reports</p>
        </div>
      ) : (
        <div className="moderation-queue__list">
          {reports.map(report => (
            <div key={report.id} className={`moderation-item moderation-item--${report.status}`}>
              <div className="moderation-item__header">
                <span className="moderation-item__type">
                  <i className={`fa-solid ${report.content_type === 'post' ? 'fa-file-alt' : 'fa-comment'}`}></i>
                  {report.content_type}
                </span>
                <span className={`moderation-item__status moderation-item__status--${report.status}`}>
                  {report.status}
                </span>
                <span className="moderation-item__time">{timeAgo(report.created_at)}</span>
              </div>
              <div className="moderation-item__body">
                <p className="moderation-item__reason">{report.reason}</p>
                {report.reporter && (
                  <span className="moderation-item__reporter">
                    Reported by {report.reporter.display_name}
                  </span>
                )}
              </div>
              {report.status === 'pending' && (
                <div className="moderation-item__actions">
                  <button
                    className="btn btn--sm btn--outline"
                    onClick={() => onDismiss(report.id)}
                  >
                    Dismiss
                  </button>
                  {confirmId === report.id ? (
                    <div className="moderation-item__confirm">
                      <span>Remove content?</span>
                      <button
                        className="btn btn--sm btn--danger"
                        onClick={() => { onRemove(report.id, report.content_type, report.content_id); setConfirmId(null); }}
                      >
                        Yes, Remove
                      </button>
                      <button
                        className="btn btn--sm btn--ghost"
                        onClick={() => setConfirmId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn--sm btn--danger"
                      onClick={() => setConfirmId(report.id)}
                    >
                      Remove Content
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModerationQueue;
