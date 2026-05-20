import React from 'react';

interface Props { size?: number; }

const LevelBadge9: React.FC<Props> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="level-badge--glow">
    <defs>
      <filter id="glow9">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <circle cx="24" cy="24" r="22" fill="#00FFFF" stroke="#fff" strokeWidth="2" filter="url(#glow9)" />
    <circle cx="24" cy="24" r="17" fill="none" stroke="#fff" strokeWidth="2" />
    <circle cx="24" cy="24" r="13" fill="none" stroke="#66FFFF" strokeWidth="1" />
    {/* Radiating lines */}
    <line x1="24" y1="0" x2="24" y2="5" stroke="#fff" strokeWidth="2" />
    <line x1="24" y1="43" x2="24" y2="48" stroke="#fff" strokeWidth="2" />
    <line x1="0" y1="24" x2="5" y2="24" stroke="#fff" strokeWidth="2" />
    <line x1="43" y1="24" x2="48" y2="24" stroke="#fff" strokeWidth="2" />
    <line x1="7" y1="7" x2="10" y2="10" stroke="#66FFFF" strokeWidth="1.5" />
    <line x1="38" y1="7" x2="41" y2="10" stroke="#66FFFF" strokeWidth="1.5" />
    <line x1="7" y1="41" x2="10" y2="38" stroke="#66FFFF" strokeWidth="1.5" />
    <line x1="38" y1="41" x2="41" y2="38" stroke="#66FFFF" strokeWidth="1.5" />
    <text x="24" y="29" textAnchor="middle" fill="#003333" fontSize="18" fontWeight="700" fontFamily="Inter, sans-serif">9</text>
  </svg>
);

export default LevelBadge9;
