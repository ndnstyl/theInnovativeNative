import React from 'react';

interface Props { size?: number; }

const LevelBadge3: React.FC<Props> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="22" fill="#1a5a5a" stroke="#2a6a6a" strokeWidth="2" />
    <circle cx="24" cy="24" r="18" fill="none" stroke="#2a6a6a" strokeWidth="1" strokeDasharray="3 3" />
    <text x="24" y="29" textAnchor="middle" fill="#6a8a8a" fontSize="18" fontWeight="700" fontFamily="Inter, sans-serif">3</text>
  </svg>
);

export default LevelBadge3;
