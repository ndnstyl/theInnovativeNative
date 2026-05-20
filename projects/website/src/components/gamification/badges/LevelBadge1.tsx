import React from 'react';

interface Props { size?: number; }

const LevelBadge1: React.FC<Props> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="22" fill="#1a3a3a" stroke="#2a4a4a" strokeWidth="2" />
    <text x="24" y="29" textAnchor="middle" fill="#4a6a6a" fontSize="18" fontWeight="700" fontFamily="Inter, sans-serif">1</text>
  </svg>
);

export default LevelBadge1;
