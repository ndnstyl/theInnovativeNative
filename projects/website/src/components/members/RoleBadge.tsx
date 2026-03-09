import React from 'react';
import type { Role } from '@/types/members';

interface RoleBadgeProps {
  role: Role;
}

const BADGE_COLORS: Record<string, string> = {
  owner: '#FFD700',
  admin: '#00FFFF',
  moderator: '#00FF88',
};

const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  if (role === 'member') return null;

  const color = BADGE_COLORS[role] || '#757575';

  return (
    <span
      className="role-badge"
      aria-label={`${role} role`}
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        fontSize: 10,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        borderRadius: 999,
        backgroundColor: color,
        color: '#000',
        lineHeight: '16px',
      }}
    >
      {role}
    </span>
  );
};

export default RoleBadge;
