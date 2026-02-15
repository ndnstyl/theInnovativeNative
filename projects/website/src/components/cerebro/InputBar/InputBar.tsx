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
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  chat: {
    label: 'Chat',
    description: 'Conversational answer with citations',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  hybrid: {
    label: 'Hybrid',
    description: 'Documents + AI analysis',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
      className="relative"
      style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        padding: '16px',
      }}
    >
      <div
        className="flex items-end gap-3 p-3 rounded-xl"
        style={{
          backgroundColor: '#f7fafc',
          border: '2px solid #e2e8f0',
        }}
      >
        {/* Mode Toggle Button */}
        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setShowModeMenu(!showModeMenu)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              color: '#1a365d',
            }}
            aria-haspopup="menu"
            aria-expanded={showModeMenu}
            aria-label={`Query mode: ${MODE_CONFIG[mode].label}. Click to change.`}
          >
            {MODE_CONFIG[mode].icon}
            <span className="text-sm font-medium hidden sm:inline">
              {MODE_CONFIG[mode].label}
            </span>
            <svg
              className={`w-3 h-3 transition-transform ${showModeMenu ? 'rotate-180' : ''}`}
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
              className="absolute bottom-full left-0 mb-2 w-56 rounded-lg shadow-lg overflow-hidden"
              style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
              role="menu"
            >
              {(Object.keys(MODE_CONFIG) as QueryMode[]).map((modeOption) => (
                <button
                  key={modeOption}
                  type="button"
                  onClick={() => handleModeSelect(modeOption)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    mode === modeOption ? 'bg-cerebro-secondary/10' : 'hover:bg-gray-50'
                  }`}
                  style={{
                    backgroundColor: mode === modeOption ? 'rgba(43, 108, 176, 0.1)' : undefined,
                  }}
                  role="menuitem"
                >
                  <span style={{ color: '#2b6cb0' }}>{MODE_CONFIG[modeOption].icon}</span>
                  <div>
                    <div className="text-sm font-medium" style={{ color: '#1a202c' }}>
                      {MODE_CONFIG[modeOption].label}
                    </div>
                    <div className="text-xs" style={{ color: '#718096' }}>
                      {MODE_CONFIG[modeOption].description}
                    </div>
                  </div>
                  {mode === modeOption && (
                    <svg
                      className="w-4 h-4 ml-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{ color: '#2b6cb0' }}
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
          className="flex-1 resize-none bg-transparent border-none outline-none text-sm"
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            color: '#1a202c',
            minHeight: '24px',
            maxHeight: '120px',
          }}
          aria-label="Enter your legal question"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!query.trim() || isLoading}
          className="flex items-center justify-center w-10 h-10 rounded-lg transition-all"
          style={{
            backgroundColor: query.trim() && !isLoading ? '#2b6cb0' : '#e2e8f0',
            color: query.trim() && !isLoading ? '#ffffff' : '#a0aec0',
            cursor: query.trim() && !isLoading ? 'pointer' : 'not-allowed',
          }}
          aria-label={isLoading ? 'Query in progress' : 'Submit query'}
        >
          {isLoading ? (
            <svg
              className="w-5 h-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
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
      <div className="text-xs mt-2 text-center" style={{ color: '#a0aec0' }}>
        Press <kbd className="px-1 py-0.5 rounded" style={{ backgroundColor: '#e2e8f0' }}>Enter</kbd> to send,{' '}
        <kbd className="px-1 py-0.5 rounded" style={{ backgroundColor: '#e2e8f0' }}>Shift+Enter</kbd> for new line
      </div>
    </form>
  );
};

export default InputBar;
