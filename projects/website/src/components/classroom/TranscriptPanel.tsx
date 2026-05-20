import React, { useState } from 'react';

interface TranscriptPanelProps {
  transcript: string;
}

/**
 * Collapsible transcript panel for video lessons.
 */
const TranscriptPanel: React.FC<TranscriptPanelProps> = ({ transcript }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!transcript) return null;

  return (
    <div className="classroom-transcript">
      <button
        className="classroom-transcript__toggle"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
        <span>Transcript</span>
      </button>
      {isOpen && (
        <div className="classroom-transcript__content">
          <p>{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default TranscriptPanel;
