import React from 'react';

interface LevelBadgeProps {
  level: number;
  name?: string;
}

const LevelBadge: React.FC<LevelBadgeProps> = ({ level, name }) => {
  return (
    <span
      className="level-badge"
      aria-label={`Level ${level}${name ? `: ${name}` : ''}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 8px',
        fontSize: 10,
        fontWeight: 600,
        borderRadius: 999,
        backgroundColor: 'rgba(0, 255, 255, 0.15)',
        color: '#00FFFF',
        lineHeight: '16px',
      }}
    >
      <span>Lvl {level}</span>
      {name && <span style={{ opacity: 0.7 }}>· {name}</span>}
    </span>
  );
};

export default LevelBadge;
