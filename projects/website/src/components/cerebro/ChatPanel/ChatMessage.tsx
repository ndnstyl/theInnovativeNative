/**
 * ChatMessage - Display AI responses with citations or user queries
 *
 * AI Message Structure:
 * 1. Rule/Test Statement (bold)
 * 2. Supporting Analysis
 * 3. Inline Citations (clickable links)
 * 4. Sources Section (collapsible)
 * 5. Verification Notice (italic, muted)
 */

import React, { useState } from 'react';
import type { ChatMessageProps, Citation } from '../types/cerebro.types';
import { InlineCitation } from './InlineCitation';

export const ChatMessage: React.FC<ChatMessageProps> = ({
  type,
  content,
  citations,
  timestamp,
  verificationRequired = false,
  onCitationClick,
  onCitationHover,
}) => {
  const [sourcesExpanded, setSourcesExpanded] = useState(false);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Parse content to insert inline citations
  const renderContentWithCitations = (text: string, citationList: Citation[]) => {
    if (!citationList.length) {
      return <p className="whitespace-pre-wrap">{text}</p>;
    }

    // Find citation patterns in text and replace with clickable components
    let processedContent = text;
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    citationList.forEach((cite, index) => {
      const citationIndex = processedContent.indexOf(cite.text, lastIndex);
      if (citationIndex !== -1) {
        // Add text before citation
        if (citationIndex > lastIndex) {
          elements.push(
            <span key={`text-${index}`}>
              {processedContent.slice(lastIndex, citationIndex)}
            </span>
          );
        }
        // Add citation component
        elements.push(
          <InlineCitation
            key={`cite-${index}`}
            citation={cite.text}
            documentId={cite.documentId}
            onHover={() => onCitationHover?.(cite.documentId)}
            onHoverEnd={() => onCitationHover?.(null)}
            onClick={() => onCitationClick?.(cite.documentId)}
          />
        );
        lastIndex = citationIndex + cite.text.length;
      }
    });

    // Add remaining text
    if (lastIndex < processedContent.length) {
      elements.push(
        <span key="text-end">{processedContent.slice(lastIndex)}</span>
      );
    }

    return <p className="whitespace-pre-wrap">{elements.length > 0 ? elements : text}</p>;
  };

  if (type === 'user') {
    return (
      <div
        className="flex justify-end mb-4"
        role="article"
        aria-label={`Your message at ${formatTime(timestamp)}`}
      >
        <div
          className="max-w-[80%] p-4 rounded-lg rounded-br-none"
          style={{
            backgroundColor: '#1a365d',
            color: '#ffffff',
          }}
        >
          <p className="text-sm whitespace-pre-wrap">{content}</p>
          <div className="text-xs opacity-60 mt-2 text-right">
            {formatTime(timestamp)}
          </div>
        </div>
      </div>
    );
  }

  // AI Message
  return (
    <div
      className="flex justify-start mb-4"
      role="article"
      aria-label={`AI response at ${formatTime(timestamp)}`}
    >
      <div
        className="max-w-[85%] p-4 rounded-lg rounded-bl-none"
        style={{
          backgroundColor: '#f7fafc',
          color: '#1a202c',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* AI Label */}
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: '#2b6cb0', color: '#ffffff' }}
            aria-hidden="true"
          >
            C
          </div>
          <span className="text-xs font-medium" style={{ color: '#718096' }}>
            Cerebro
          </span>
        </div>

        {/* Content with citations */}
        <div
          className="text-sm leading-relaxed"
          style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
        >
          {renderContentWithCitations(content, citations)}
        </div>

        {/* Sources Section (collapsible) */}
        {citations.length > 0 && (
          <div className="mt-4 pt-3 border-t" style={{ borderColor: '#e2e8f0' }}>
            <button
              onClick={() => setSourcesExpanded(!sourcesExpanded)}
              className="flex items-center gap-2 text-xs font-medium w-full text-left"
              style={{ color: '#718096' }}
              aria-expanded={sourcesExpanded}
            >
              <svg
                className={`w-3 h-3 transition-transform ${sourcesExpanded ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Sources ({citations.length})
            </button>

            {sourcesExpanded && (
              <ul className="mt-2 space-y-1" role="list">
                {citations.map((cite, index) => (
                  <li key={index} className="text-xs" style={{ color: '#718096' }}>
                    <button
                      onClick={() => onCitationClick?.(cite.documentId)}
                      className="text-left hover:underline"
                      style={{ color: '#2b6cb0' }}
                    >
                      {cite.text} ({cite.court}, {cite.year})
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Verification Notice */}
        {verificationRequired && (
          <div
            className="mt-3 pt-2 text-xs italic"
            style={{ color: '#718096', borderTop: '1px dashed #e2e8f0' }}
            role="alert"
          >
            <svg
              className="w-3 h-3 inline mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Verification required. Always confirm citations with primary sources.
          </div>
        )}

        {/* Timestamp */}
        <div className="text-xs mt-2" style={{ color: '#a0aec0' }}>
          {formatTime(timestamp)}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
