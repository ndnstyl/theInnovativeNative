import React from 'react';
import { AuditEntry } from '@/hooks/useAuditLog';

interface AuditLogListProps {
  entries: AuditEntry[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

const ACTION_ICONS: Record<string, string> = {
  ban_member: 'fa-solid fa-ban',
  unban_member: 'fa-solid fa-unlock',
  remove_content: 'fa-solid fa-trash',
  change_role: 'fa-solid fa-user-shield',
  dismiss_report: 'fa-solid fa-check',
  update_settings: 'fa-solid fa-gear',
  update_categories: 'fa-solid fa-tags',
};

function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    + ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

const AuditLogList: React.FC<AuditLogListProps> = ({ entries, loading, hasMore, onLoadMore }) => {
  if (loading && entries.length === 0) {
    return <div className="admin-loading"><div className="admin-loading__spinner" /></div>;
  }

  if (entries.length === 0) {
    return (
      <div className="audit-log__empty">
        <i className="fa-solid fa-clipboard-list"></i>
        <p>No audit log entries yet</p>
      </div>
    );
  }

  return (
    <div className="audit-log">
      <div className="audit-log__list">
        {entries.map(entry => (
          <div key={entry.id} className="audit-log__item">
            <div className="audit-log__icon">
              <i className={ACTION_ICONS[entry.action_type] || 'fa-solid fa-circle-info'}></i>
            </div>
            <div className="audit-log__content">
              <div className="audit-log__header">
                <span className="audit-log__admin">
                  {entry.admin?.display_name || 'System'}
                </span>
                <span className="audit-log__action">{entry.action_type.replace(/_/g, ' ')}</span>
              </div>
              {entry.description && (
                <p className="audit-log__description">{entry.description}</p>
              )}
              {entry.target_type && (
                <span className="audit-log__target">
                  {entry.target_type}: {entry.target_id?.substring(0, 8)}...
                </span>
              )}
            </div>
            <div className="audit-log__time">{formatDate(entry.created_at)}</div>
          </div>
        ))}
      </div>
      {hasMore && (
        <button className="audit-log__load-more" onClick={onLoadMore} disabled={loading}>
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
};

export default AuditLogList;
