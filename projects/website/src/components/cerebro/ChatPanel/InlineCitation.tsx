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
    <span className="relative inline-block">
      <a
        href={`#result-${documentId}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        className="
          font-mono text-sm
          text-cerebro-secondary
          underline decoration-dotted
          hover:decoration-solid
          cursor-pointer
          transition-all
        "
        style={{
          fontFamily: "'JetBrains Mono', 'Courier New', monospace",
          color: '#2b6cb0',
          textDecorationStyle: 'dotted',
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
          className="
            absolute bottom-full left-1/2 -translate-x-1/2 mb-2
            px-3 py-2
            bg-cerebro-primary text-white
            text-xs rounded-lg shadow-lg
            whitespace-nowrap
            z-50
          "
          style={{
            backgroundColor: '#1a365d',
            maxWidth: '300px',
            whiteSpace: 'normal',
          }}
        >
          <div className="font-semibold mb-1">Click to view source</div>
          <div className="opacity-80">{citation}</div>
          {/* Arrow */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-full"
            style={{
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
