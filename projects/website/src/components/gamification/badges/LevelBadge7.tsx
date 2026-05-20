import React from 'react';

interface Props { size?: number; }

const LevelBadge7: React.FC<Props> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="22" fill="#00DDDD" stroke="#00FFFF" strokeWidth="2" />
    <circle cx="24" cy="24" r="17" fill="none" stroke="#00FFFF" strokeWidth="1.5" />
    <circle cx="24" cy="24" r="13" fill="none" stroke="#00BBBB" strokeWidth="1" />
    {/* Decorative dots */}
    <circle cx="24" cy="4" r="2" fill="#00FFFF" />
    <circle cx="24" cy="44" r="2" fill="#00FFFF" />
    <circle cx="4" cy="24" r="2" fill="#00FFFF" />
    <circle cx="44" cy="24" r="2" fill="#00FFFF" />
    <text x="24" y="29" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="700" fontFamily="Inter, sans-serif">7</text>
  </svg>
);

export default LevelBadge7;
