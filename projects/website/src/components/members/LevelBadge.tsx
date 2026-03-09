import React from 'react';
import { getBadgeComponent } from '@/components/gamification/badges';

interface LevelBadgeProps {
  level: number;
  name?: string;
  size?: number;
}

const LevelBadge: React.FC<LevelBadgeProps> = ({ level, name, size = 24 }) => {
  const BadgeIcon = getBadgeComponent(level);

  return (
    <span
      className="level-badge"
      title={`Level ${level}${name ? `: ${name}` : ''}`}
      aria-label={`Level ${level}${name ? `: ${name}` : ''}`}
    >
      <BadgeIcon size={size} />
    </span>
  );
};

export default LevelBadge;
