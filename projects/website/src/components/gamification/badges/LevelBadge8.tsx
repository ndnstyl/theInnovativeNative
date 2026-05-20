import React from 'react';

interface Props { size?: number; }

const LevelBadge8: React.FC<Props> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="22" fill="#00FFFF" stroke="#66FFFF" strokeWidth="2" />
    <circle cx="24" cy="24" r="17" fill="none" stroke="#fff" strokeWidth="1.5" />
    <circle cx="24" cy="24" r="13" fill="none" stroke="#00DDDD" strokeWidth="1" />
    {/* Star points */}
    <circle cx="24" cy="3" r="2" fill="#fff" />
    <circle cx="24" cy="45" r="2" fill="#fff" />
    <circle cx="3" cy="24" r="2" fill="#fff" />
    <circle cx="45" cy="24" r="2" fill="#fff" />
    <circle cx="9" cy="9" r="1.5" fill="#66FFFF" />
    <circle cx="39" cy="9" r="1.5" fill="#66FFFF" />
    <circle cx="9" cy="39" r="1.5" fill="#66FFFF" />
    <circle cx="39" cy="39" r="1.5" fill="#66FFFF" />
    <text x="24" y="29" textAnchor="middle" fill="#003333" fontSize="18" fontWeight="700" fontFamily="Inter, sans-serif">8</text>
  </svg>
);

export default LevelBadge8;
