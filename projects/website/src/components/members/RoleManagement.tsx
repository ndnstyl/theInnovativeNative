import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/hooks/useRole';
import type { Role } from '@/types/members';

interface RoleManagementProps {
  targetMemberId: string;
  currentRole: Role;
  memberStatus: string;
}

const ROLES: Role[] = ['owner', 'admin', 'moderator', 'member'];

const RoleManagement: React.FC<RoleManagementProps> = ({
  targetMemberId,
  currentRole,
  memberStatus,
}) => {
  const { supabaseClient } = useAuth();
  const { canPromoteTo, canRemoveMember, role: myRole } = useRole();
  const [selectedRole, setSelectedRole] = useState(currentRole);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleRoleChange = async (newRole: Role) => {
    if (newRole === currentRole) return;
    setIsUpdating(true);
    setMessage(null);

    const { data, error } = await supabaseClient
      .rpc('change_member_role', {
        p_target_member_id: targetMemberId,
        p_new_role: newRole,
      });

    if (error) {
      setMessage({ type: 'error', text: error.message });
      setSelectedRole(currentRole);
    } else if (data && !(data as any).success) {
      setMessage({ type: 'error', text: (data as any).error || 'Failed to change role' });
      setSelectedRole(currentRole);
    } else {
      setMessage({ type: 'success', text: `Role changed to ${newRole}` });
      setSelectedRole(newRole);
    }
    setIsUpdating(false);
  };

  const handleRemove = async () => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    setIsUpdating(true);

    const { error } = await supabaseClient
      .from('profiles')
      .update({ membership_status: 'removed' })
      .eq('id', targetMemberId);

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Member removed' });
    }
    setIsUpdating(false);
  };

  const handleBan = async () => {
    setIsUpdating(true);
    setShowBanModal(false);

    // Get community ID
    const { data: cmData } = await supabaseClient
      .from('community_members')
      .select('community_id')
      .eq('member_id', targetMemberId)
      .is('deleted_at', null)
      .single();

    if (!cmData) {
      setMessage({ type: 'error', text: 'Member not found' });
      setIsUpdating(false);
      return;
    }

    // Insert ban record
    const { error: banError } = await supabaseClient
      .from('member_bans')
      .insert({
        community_id: cmData.community_id,
        user_id: targetMemberId,
        banned_by: (await supabaseClient.auth.getUser()).data.user?.id || '',
        reason: banReason || null,
      });

    if (banError) {
      setMessage({ type: 'error', text: banError.message });
    } else {
      // Update profile status
      await supabaseClient
        .from('profiles')
        .update({ membership_status: 'banned' })
        .eq('id', targetMemberId);

      setMessage({ type: 'success', text: 'Member banned' });
    }

    setBanReason('');
    setIsUpdating(false);
  };

  const handleUnban = async () => {
    setIsUpdating(true);

    // Delete ban record
    await supabaseClient
      .from('member_bans')
      .delete()
      .eq('user_id', targetMemberId);

    // Restore profile status
    const { error } = await supabaseClient
      .from('profiles')
      .update({ membership_status: 'approved' })
      .eq('id', targetMemberId);

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Member unbanned' });
    }
    setIsUpdating(false);
  };

  const availableRoles = ROLES.filter(r => canPromoteTo(r) || r === currentRole);

  return (
    <div className="role-management">
      <h3 className="role-management__title">Manage Member</h3>

      {message && (
        <div className={`role-management__message role-management__message--${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="role-management__controls">
        <div className="role-management__role-select">
          <label>Role</label>
          <select
            value={selectedRole}
            onChange={(e) => handleRoleChange(e.target.value as Role)}
            disabled={isUpdating || availableRoles.length <= 1}
          >
            {availableRoles.map(r => (
              <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
            ))}
          </select>
        </div>

        <div className="role-management__actions">
          {memberStatus === 'banned' ? (
            <button
              className="role-management__btn role-management__btn--unban"
              onClick={handleUnban}
              disabled={isUpdating}
            >
              <i className="fa-solid fa-unlock"></i> Unban
            </button>
          ) : (
            <>
              {canRemoveMember(currentRole) && (
                <button
                  className="role-management__btn role-management__btn--remove"
                  onClick={handleRemove}
                  disabled={isUpdating}
                  aria-label="Remove member"
                >
                  <i className="fa-solid fa-user-minus"></i> Remove
                </button>
              )}
              {canRemoveMember(currentRole) && (
                <button
                  className="role-management__btn role-management__btn--ban"
                  onClick={() => setShowBanModal(true)}
                  disabled={isUpdating}
                  aria-label="Ban member"
                >
                  <i className="fa-solid fa-ban"></i> Ban
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {showBanModal && (
        <div className="role-management__modal-overlay" onClick={() => setShowBanModal(false)}>
          <div className="role-management__modal" onClick={e => e.stopPropagation()}>
            <h4>Ban Member</h4>
            <textarea
              placeholder="Reason for ban (optional)"
              value={banReason}
              onChange={(e) => setBanReason(e.target.value.slice(0, 500))}
              maxLength={500}
              rows={3}
            />
            <div className="role-management__modal-actions">
              <button className="btn btn--outline" onClick={() => setShowBanModal(false)}>Cancel</button>
              <button className="btn btn--danger" onClick={handleBan}>Confirm Ban</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .role-management {
          padding: 20px;
          background: #0e0e0e;
          border: 1px solid #1a1a1a;
          border-radius: 12px;
          margin: 24px 0;
        }
        .role-management__title {
          color: #fff;
          font-size: 16px;
          margin: 0 0 16px;
        }
        .role-management__message {
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 13px;
          margin-bottom: 12px;
        }
        .role-management__message--success {
          background: rgba(0, 255, 255, 0.1);
          color: #00FFFF;
          border: 1px solid rgba(0, 255, 255, 0.2);
        }
        .role-management__message--error {
          background: rgba(255, 68, 68, 0.1);
          color: #ff4444;
          border: 1px solid rgba(255, 68, 68, 0.2);
        }
        .role-management__controls {
          display: flex;
          align-items: flex-end;
          gap: 16px;
          flex-wrap: wrap;
        }
        .role-management__role-select {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .role-management__role-select label {
          font-size: 12px;
          color: #757575;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .role-management__role-select select {
          background: #0a0a0a;
          border: 1px solid #1a1a1a;
          color: #fff;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 13px;
        }
        .role-management__actions {
          display: flex;
          gap: 8px;
        }
        .role-management__btn {
          padding: 8px 12px;
          font-size: 12px;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          border: 1px solid #333;
          background: transparent;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        .role-management__btn--remove:hover { border-color: #ff8800; color: #ff8800; }
        .role-management__btn--ban:hover { border-color: #ff4444; color: #ff4444; }
        .role-management__btn--unban { border-color: #00FF88; color: #00FF88; }
        .role-management__btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .role-management__modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
        }
        .role-management__modal {
          background: #0a0a0a;
          border: 1px solid #1a1a1a;
          border-radius: 12px;
          padding: 24px;
          width: 100%;
          max-width: 400px;
        }
        .role-management__modal h4 {
          color: #fff;
          margin: 0 0 16px;
        }
        .role-management__modal textarea {
          width: 100%;
          background: #0e0e0e;
          border: 1px solid #1a1a1a;
          border-radius: 6px;
          padding: 10px;
          color: #fff;
          font-size: 14px;
          resize: vertical;
        }
        .role-management__modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          margin-top: 16px;
        }
      `}</style>
    </div>
  );
};

export default RoleManagement;
