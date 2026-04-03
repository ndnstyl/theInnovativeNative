/**
 * ResultCard - Display individual search results
 *
 * Visual States:
 * - Default: White background
 * - Highlighted: Light blue border (when cited in chat)
 * - Hover: Slight shadow
 */

import React from 'react';
import type { ResultCardProps } from '../types/cerebro.types';
import { AuthorityBadge } from './AuthorityBadge';
import { sanitizeHtml } from '@/lib/sanitize';

export const ResultCard: React.FC<ResultCardProps> = ({
  citation,
  title,
  court,
  authorityLevel,
  datePublished,
  snippet,
  relevanceScore,
  authorityScore,
  isHighlighted,
  onClick,
}) => {
  // Format date for display
  const formattedDate = new Date(datePublished).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Calculate combined score for display (0-100)
  const combinedScore = Math.round(((relevanceScore + authorityScore) / 2) * 100);

  return (
    <article
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View ${title}`}
      style={{
        padding: '16px',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        backgroundColor: isHighlighted ? 'rgba(212, 168, 83, 0.08)' : '#131b2e',
        border: isHighlighted ? '2px solid #d4a853' : '1px solid #2a3a50',
        boxShadow: isHighlighted ? '0 0 0 2px rgba(212, 168, 83, 0.15)' : undefined,
      }}
    >
      {/* Header row: Badge + Score */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <AuthorityBadge level={authorityLevel} />
        <span
          style={{ fontSize: '12px', fontWeight: 500, color: '#8899aa' }}
          title={`Relevance: ${Math.round(relevanceScore * 100)}% | Authority: ${Math.round(authorityScore * 100)}%`}
        >
          {combinedScore}% match
        </span>
      </div>

      {/* Citation - Clickable link style */}
      <h3
        style={{
          fontFamily: "'JetBrains Mono', 'Courier New', monospace",
          fontSize: '14px',
          fontWeight: 600,
          color: '#d4a853',
          marginBottom: '4px',
        }}
      >
        {citation}
      </h3>

      {/* Title */}
      <h4
        style={{
          fontFamily: "'Source Serif Pro', Georgia, serif",
          fontSize: '16px',
          fontWeight: 500,
          color: '#e8e8e8',
          marginBottom: '8px',
        }}
      >
        {title}
      </h4>

      {/* Snippet with potential highlighting */}
      <p
        style={{
          fontSize: '14px',
          color: '#8899aa',
          marginBottom: '12px',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(
            snippet.replace(
              /<mark>/g,
              '<mark style="background-color: rgba(214, 158, 46, 0.3); padding: 0 2px; border-radius: 2px;">'
            )
          ),
        }}
      />

      {/* Meta info footer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#8899aa' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          {court}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formattedDate}
        </span>
      </div>
    </article>
  );
};

export default ResultCard;
