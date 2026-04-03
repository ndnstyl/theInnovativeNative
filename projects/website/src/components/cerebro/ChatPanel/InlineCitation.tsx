/**
 * InlineCitation - Clickable citation in chat that highlights source
 *
 * Behavior:
 * - Renders as underlined link
 * - Hover: Tooltip with full citation + court
 * - Click: Scrolls results panel, highlights card
 */

import React, { useState } from 'react';
import type { InlineCitationProps } from '../types/cerebro.types';

export const InlineCitation: React.FC<InlineCitationProps> = ({
  citation,
  documentId,
  onHover,
  onHoverEnd,
  onClick,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
    onHover();
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    onHoverEnd();
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <a
        href={`#result-${documentId}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        style={{
          fontFamily: "'JetBrains Mono', 'Courier New', monospace",
          fontSize: '14px',
          color: '#d4a853',
          textDecoration: 'underline',
          textDecorationStyle: 'dotted',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        aria-describedby={`tooltip-${documentId}`}
      >
        {citation}
      </a>

      {/* Tooltip */}
      {showTooltip && (
        <div
          id={`tooltip-${documentId}`}
          role="tooltip"
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '8px',
            padding: '8px 12px',
            backgroundColor: '#1a2438',
            color: '#e8e8e8',
            fontSize: '12px',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            maxWidth: '300px',
            whiteSpace: 'normal',
            zIndex: 50,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: '4px' }}>Click to view source</div>
          <div style={{ opacity: 0.8 }}>{citation}</div>
          {/* Arrow */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              top: '100%',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid #1a365d',
            }}
          />
        </div>
      )}
    </span>
  );
};

export default InlineCitation;
