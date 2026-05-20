import React from 'react';

interface UnreadBadgeProps {
  count: number;
}

const UnreadBadge: React.FC<UnreadBadgeProps> = ({ count }) => {
  if (count <= 0) return null;

  return (
    <span className="unread-badge">
      {count > 99 ? '99+' : count}
    </span>
  );
};

export default UnreadBadge;
