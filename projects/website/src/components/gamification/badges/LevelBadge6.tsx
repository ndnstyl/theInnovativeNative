import React from 'react';

interface Props { size?: number; }

const LevelBadge6: React.FC<Props> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="22" fill="#00BBBB" stroke="#00DDDD" strokeWidth="2" />
    <circle cx="24" cy="24" r="17" fill="none" stroke="#00DDDD" strokeWidth="1.5" />
    <circle cx="24" cy="24" r="13" fill="none" stroke="#009999" strokeWidth="1" />
    <text x="24" y="29" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="700" fontFamily="Inter, sans-serif">6</text>
  </svg>
);

export default LevelBadge6;
