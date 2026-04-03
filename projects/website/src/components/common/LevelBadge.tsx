import React from 'react';

interface LevelBadgeProps {
  level: number;
  size?: 'sm' | 'md';
}

const LEVEL_COLORS: Record<number, string> = {
  1: '#22c55e', 2: '#22c55e', 3: '#22c55e',
  4: '#3b82f6', 5: '#3b82f6', 6: '#3b82f6',
  7: '#8b5cf6', 8: '#8b5cf6', 9: '#f59e0b',
};

const LevelBadge: React.FC<LevelBadgeProps> = ({ level, size = 'sm' }) => {
  const px = size === 'sm' ? 16 : 22;
  const fontSize = size === 'sm' ? 9 : 12;
  const color = LEVEL_COLORS[level] || '#22c55e';

  return (
    <span
      className="level-badge"
      aria-label={`Level ${level}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: px,
        height: px,
        borderRadius: '50%',
        backgroundColor: color,
        color: '#fff',
        fontSize,
        fontWeight: 700,
        lineHeight: 1,
        position: 'absolute',
        bottom: -2,
        right: -2,
        border: '2px solid #000',
        zIndex: 1,
      }}
    >
      {level}
    </span>
  );
};

export default LevelBadge;
