import React from 'react';
import type { Role } from '@/types/members';

interface RoleBadgeProps {
  role: Role;
  isAgent?: boolean;
}

const BADGE_COLORS: Record<string, string> = {
  owner: '#FFD700',
  admin: '#00FFFF',
  moderator: '#00FF88',
  ai_team: '#00FFFF',
};

const RoleBadge: React.FC<RoleBadgeProps> = ({ role, isAgent = false }) => {
  if (isAgent) {
    return (
      <span
        className="role-badge role-badge--ai"
        aria-label="AI Team Member"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '2px 8px',
          fontSize: 10,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          borderRadius: 999,
          backgroundColor: BADGE_COLORS.ai_team,
          color: '#000',
          lineHeight: '16px',
        }}
      >
        <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M8 0a1 1 0 011 1v1.07A6.002 6.002 0 0113.93 7H15a1 1 0 110 2h-1.07A6.002 6.002 0 019 13.93V15a1 1 0 11-2 0v-1.07A6.002 6.002 0 012.07 9H1a1 1 0 010-2h1.07A6.002 6.002 0 017 2.07V1a1 1 0 011-1zm0 4a4 4 0 100 8 4 4 0 000-8zm0 2a2 2 0 110 4 2 2 0 010-4z"/>
        </svg>
        AI Team
      </span>
    );
  }

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
