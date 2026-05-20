/**
 * InputBar - Unified input for search and chat queries
 *
 * Mode Behaviors:
 * - Search: Returns ranked results only
 * - Chat: Returns conversational answer with citations
 * - Hybrid (default): Both results and answer
 */

import React, { useState, useRef, useEffect } from 'react';
import type { QueryMode, InputBarProps } from '../types/cerebro.types';

const MODE_CONFIG: Record<QueryMode, { label: string; icon: React.ReactNode; description: string }> = {
  search: {
    label: 'Search',
    description: 'Returns ranked legal documents',
    icon: (
      <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  chat: {
    label: 'Chat',
    description: 'Conversational answer with citations',
    icon: (
      <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  hybrid: {
    label: 'Hybrid',
    description: 'Documents + AI analysis',
    icon: (
      <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
  },
};

export const InputBar: React.FC<InputBarProps> = ({
  mode,
  onSubmit,
  onModeChange,
  isLoading,
  placeholder = 'Ask a legal question...',
}) => {
  const [query, setQuery] = useState('');
  const [showModeMenu, setShowModeMenu] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [query]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowModeMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim() && !isLoading) {
      onSubmit(query.trim());
      setQuery('');
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleModeSelect = (newMode: QueryMode) => {
    onModeChange(newMode);
    setShowModeMenu(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        position: 'relative',
        backgroundColor: '#131b2e',
        borderTop: '1px solid #2a3a50',
        padding: '16px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '12px',
          padding: '12px',
          borderRadius: '12px',
          backgroundColor: '#0d1117',
          border: '2px solid #2a3a50',
        }}
      >
        {/* Mode Toggle Button */}
        <div ref={menuRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowModeMenu(!showModeMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: '#131b2e',
              border: '1px solid #2a3a50',
              color: '#1a365d',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            aria-haspopup="menu"
            aria-expanded={showModeMenu}
            aria-label={`Query mode: ${MODE_CONFIG[mode].label}. Click to change.`}
          >
            {MODE_CONFIG[mode].icon}
            <span style={{ fontSize: '14px', fontWeight: 500 }}>
              {MODE_CONFIG[mode].label}
            </span>
            <svg
              style={{
                width: '12px',
                height: '12px',
                transition: 'transform 0.2s',
                transform: showModeMenu ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Mode Dropdown Menu */}
          {showModeMenu && (
            <div
              style={{
                position: 'absolute',
                bottom: '100%',
                left: 0,
                marginBottom: '8px',
                width: '224px',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                overflow: 'hidden',
                backgroundColor: '#131b2e',
                border: '1px solid #2a3a50',
              }}
              role="menu"
            >
              {(Object.keys(MODE_CONFIG) as QueryMode[]).map((modeOption) => (
                <button
                  key={modeOption}
                  type="button"
                  onClick={() => handleModeSelect(modeOption)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    textAlign: 'left',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: mode === modeOption ? 'rgba(43, 108, 176, 0.1)' : 'transparent',
                    transition: 'background-color 0.2s',
                  }}
                  role="menuitem"
                >
                  <span style={{ color: '#2b6cb0' }}>{MODE_CONFIG[modeOption].icon}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#e8e8e8' }}>
                      {MODE_CONFIG[modeOption].label}
                    </div>
                    <div style={{ fontSize: '12px', color: '#8899aa' }}>
                      {MODE_CONFIG[modeOption].description}
                    </div>
                  </div>
                  {mode === modeOption && (
                    <svg
                      style={{ width: '16px', height: '16px', marginLeft: 'auto', color: '#2b6cb0' }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Text Input */}
        <textarea
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          rows={1}
          style={{
            flex: 1,
            resize: 'none',
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: '14px',
            fontFamily: "'Inter', system-ui, sans-serif",
            color: '#e8e8e8',
            minHeight: '24px',
            maxHeight: '120px',
          }}
          aria-label="Enter your legal question"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!query.trim() || isLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            border: 'none',
            transition: 'all 0.2s',
            backgroundColor: query.trim() && !isLoading ? '#d4a853' : '#2a3a50',
            color: query.trim() && !isLoading ? '#0a0f1a' : '#5a6a7d',
            cursor: query.trim() && !isLoading ? 'pointer' : 'not-allowed',
          }}
          aria-label={isLoading ? 'Query in progress' : 'Submit query'}
        >
          {isLoading ? (
            <svg
              style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }}
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                style={{ opacity: 0.25 }}
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                style={{ opacity: 0.75 }}
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg
              style={{ width: '20px', height: '20px' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Keyboard hint */}
      <div style={{ fontSize: '12px', marginTop: '8px', textAlign: 'center', color: '#a0aec0' }}>
        Press <kbd style={{ padding: '2px 4px', borderRadius: '4px', backgroundColor: '#1a2438' }}>Enter</kbd> to send,{' '}
        <kbd style={{ padding: '2px 4px', borderRadius: '4px', backgroundColor: '#1a2438' }}>Shift+Enter</kbd> for new line
      </div>
    </form>
  );
};

export default InputBar;
