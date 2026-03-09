import React, { useState } from 'react';
import { ManagedMember } from '@/hooks/useMemberManagement';

interface MemberTableProps {
  members: ManagedMember[];
  loading: boolean;
  search: string;
  onSearchChange: (s: string) => void;
  roleFilter: string;
  onRoleFilterChange: (r: string) => void;
  onChangeRole: (memberId: string, newRole: string) => void;
  onBan: (memberId: string, reason?: string) => void;
  onUnban: (memberId: string) => void;
}

function timeAgo(date: string | null): string {
  if (!date) return 'Never';
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

const ROLES = ['member', 'moderator', 'admin', 'owner'];

const MemberTable: React.FC<MemberTableProps> = ({
  members, loading, search, onSearchChange, roleFilter, onRoleFilterChange,
  onChangeRole, onBan, onUnban
}) => {
  const [banTarget, setBanTarget] = useState<string | null>(null);
  const [banReason, setBanReason] = useState('');

  return (
    <div className="member-table">
      <div className="member-table__controls">
        <div className="member-table__search">
          <i className="fa-solid fa-search"></i>
          <input
            type="text"
            placeholder="Search members..."
            value={search}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>
        <select
          className="member-table__role-filter"
          value={roleFilter}
          onChange={e => onRoleFilterChange(e.target.value)}
        >
          <option value="all">All Roles</option>
          {ROLES.map(r => (
            <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="admin-loading"><div className="admin-loading__spinner" /></div>
      ) : members.length === 0 ? (
        <div className="member-table__empty">
          <p>No members found</p>
        </div>
      ) : (
        <div className="member-table__grid">
          <div className="member-table__header-row">
            <span>Member</span>
            <span>Role</span>
            <span>Status</span>
            <span>Last Active</span>
            <span>Actions</span>
          </div>
          {members.map(member => (
            <div key={member.user_id} className={`member-table__row ${member.status === 'banned' ? 'member-table__row--banned' : ''}`}>
              <div className="member-table__member">
                {member.avatar_url ? (
                  <img src={member.avatar_url} alt="" className="member-table__avatar" />
                ) : (
                  <span className="member-table__avatar-placeholder">
                    {member.display_name.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="member-table__name">{member.display_name}</span>
              </div>
              <div className="member-table__role">
                <select
                  value={member.role}
                  onChange={e => onChangeRole(member.user_id, e.target.value)}
                  disabled={member.role === 'owner'}
                >
                  {ROLES.map(r => (
                    <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="member-table__status">
                <span className={`member-table__status-badge member-table__status-badge--${member.status}`}>
                  {member.status}
                </span>
              </div>
              <div className="member-table__last-active">
                {timeAgo(member.last_active_at)}
              </div>
              <div className="member-table__actions">
                {member.status === 'banned' ? (
                  <button className="btn btn--sm btn--outline" onClick={() => onUnban(member.user_id)}>
                    Unban
                  </button>
                ) : member.role !== 'owner' ? (
                  banTarget === member.user_id ? (
                    <div className="member-table__ban-confirm">
                      <input
                        type="text"
                        placeholder="Reason (optional)"
                        value={banReason}
                        onChange={e => setBanReason(e.target.value)}
                      />
                      <button
                        className="btn btn--sm btn--danger"
                        onClick={() => { onBan(member.user_id, banReason); setBanTarget(null); setBanReason(''); }}
                      >
                        Confirm
                      </button>
                      <button
                        className="btn btn--sm btn--ghost"
                        onClick={() => { setBanTarget(null); setBanReason(''); }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button className="btn btn--sm btn--danger-outline" onClick={() => setBanTarget(member.user_id)}>
                      Ban
                    </button>
                  )
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemberTable;
