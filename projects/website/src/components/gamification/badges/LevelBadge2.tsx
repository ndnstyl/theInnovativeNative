import React from 'react';

interface Props { size?: number; }

const LevelBadge2: React.FC<Props> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="22" fill="#1a4a4a" stroke="#2a5a5a" strokeWidth="2" />
    <text x="24" y="29" textAnchor="middle" fill="#5a7a7a" fontSize="18" fontWeight="700" fontFamily="Inter, sans-serif">2</text>
  </svg>
);

export default LevelBadge2;
