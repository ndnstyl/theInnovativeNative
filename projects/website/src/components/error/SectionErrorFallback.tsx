import React from 'react';

interface SectionErrorFallbackProps {
  section?: string;
  onRetry?: () => void;
}

const SectionErrorFallback: React.FC<SectionErrorFallbackProps> = ({ section, onRetry }) => (
  <div style={{
    padding: '32px 20px',
    textAlign: 'center',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '10px',
    margin: '12px 0',
  }}>
    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '12px' }}>
      {section ? `${section} couldn't load.` : "This section couldn't load."}
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        style={{
          padding: '8px 20px',
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '6px',
          color: 'rgba(255,255,255,0.6)',
          fontSize: '13px',
          cursor: 'pointer',
        }}
      >
        Try Again
      </button>
    )}
  </div>
);

export default SectionErrorFallback;
