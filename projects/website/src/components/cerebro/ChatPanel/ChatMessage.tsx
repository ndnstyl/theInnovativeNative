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
      return <p style={{ whiteSpace: 'pre-wrap' }}>{text}</p>;
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

    return <p style={{ whiteSpace: 'pre-wrap' }}>{elements.length > 0 ? elements : text}</p>;
  };

  if (type === 'user') {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}
        role="article"
        aria-label={`Your message at ${formatTime(timestamp)}`}
      >
        <div
          style={{
            maxWidth: '80%',
            padding: '16px',
            borderRadius: '8px',
            borderBottomRightRadius: 0,
            backgroundColor: '#1a365d',
            color: '#ffffff',
          }}
        >
          <p style={{ fontSize: '14px', whiteSpace: 'pre-wrap' }}>{content}</p>
          <div style={{ fontSize: '12px', opacity: 0.6, marginTop: '8px', textAlign: 'right' }}>
            {formatTime(timestamp)}
          </div>
        </div>
      </div>
    );
  }

  // AI Message
  return (
    <div
      style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}
      role="article"
      aria-label={`AI response at ${formatTime(timestamp)}`}
    >
      <div
        style={{
          maxWidth: '85%',
          padding: '16px',
          borderRadius: '8px',
          borderBottomLeftRadius: 0,
          backgroundColor: '#0d1117',
          color: '#e8e8e8',
          border: '1px solid #2a3a50',
        }}
      >
        {/* AI Label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 700,
              backgroundColor: '#2b6cb0',
              color: '#ffffff',
            }}
            aria-hidden="true"
          >
            C
          </div>
          <span style={{ fontSize: '12px', fontWeight: 500, color: '#8899aa' }}>
            Cerebro
          </span>
        </div>

        {/* Content with citations */}
        <div
          style={{
            fontSize: '14px',
            lineHeight: 1.625,
            fontFamily: "'Source Serif Pro', Georgia, serif",
          }}
        >
          {renderContentWithCitations(content, citations)}
        </div>

        {/* Sources Section (collapsible) */}
        {citations.length > 0 && (
          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #2a3a50' }}>
            <button
              onClick={() => setSourcesExpanded(!sourcesExpanded)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                fontWeight: 500,
                width: '100%',
                textAlign: 'left',
                color: '#8899aa',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
              }}
              aria-expanded={sourcesExpanded}
            >
              <svg
                style={{
                  width: '12px',
                  height: '12px',
                  transition: 'transform 0.2s',
                  transform: sourcesExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                }}
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
              <ul style={{ marginTop: '8px', listStyle: 'none', padding: 0 }} role="list">
                {citations.map((cite, index) => (
                  <li key={index} style={{ fontSize: '12px', color: '#8899aa', marginBottom: '4px' }}>
                    <button
                      onClick={() => onCitationClick?.(cite.documentId)}
                      style={{
                        textAlign: 'left',
                        color: '#2b6cb0',
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
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
            style={{
              marginTop: '12px',
              paddingTop: '8px',
              fontSize: '12px',
              fontStyle: 'italic',
              color: '#8899aa',
              borderTop: '1px dashed #2a3a50',
            }}
            role="alert"
          >
            <svg
              style={{ width: '12px', height: '12px', display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}
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
        <div style={{ fontSize: '12px', marginTop: '8px', color: '#a0aec0' }}>
          {formatTime(timestamp)}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
