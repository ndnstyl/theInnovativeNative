import React from 'react';

interface Props { size?: number; }

const LevelBadge5: React.FC<Props> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="22" fill="#009999" stroke="#00BBBB" strokeWidth="2" />
    <circle cx="24" cy="24" r="17" fill="none" stroke="#00BBBB" strokeWidth="1.5" />
    <circle cx="24" cy="24" r="13" fill="none" stroke="#007777" strokeWidth="1" strokeDasharray="4 2" />
    <text x="24" y="29" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="700" fontFamily="Inter, sans-serif">5</text>
  </svg>
);

export default LevelBadge5;
