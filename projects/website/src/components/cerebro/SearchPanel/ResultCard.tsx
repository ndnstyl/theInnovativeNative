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
      className={`
        p-4 rounded-lg cursor-pointer
        transition-all duration-200 ease-in-out
        ${
          isHighlighted
            ? 'bg-cerebro-secondary/5 border-2 border-cerebro-secondary ring-2 ring-cerebro-secondary/20'
            : 'bg-white border border-cerebro-border hover:shadow-md'
        }
      `}
      style={{
        backgroundColor: isHighlighted ? 'rgba(43, 108, 176, 0.05)' : '#ffffff',
        border: isHighlighted ? '2px solid #2b6cb0' : '1px solid #e2e8f0',
      }}
    >
      {/* Header row: Badge + Score */}
      <div className="flex items-center justify-between mb-2">
        <AuthorityBadge level={authorityLevel} />
        <span
          className="text-xs font-medium text-cerebro-text-muted"
          title={`Relevance: ${Math.round(relevanceScore * 100)}% | Authority: ${Math.round(authorityScore * 100)}%`}
          style={{ color: '#718096' }}
        >
          {combinedScore}% match
        </span>
      </div>

      {/* Citation - Clickable link style */}
      <h3
        className="font-mono text-sm font-semibold text-cerebro-secondary mb-1 hover:underline"
        style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace", color: '#2b6cb0' }}
      >
        {citation}
      </h3>

      {/* Title */}
      <h4
        className="text-base font-medium text-cerebro-text-primary mb-2"
        style={{ fontFamily: "'Source Serif Pro', Georgia, serif", color: '#1a202c' }}
      >
        {title}
      </h4>

      {/* Snippet with potential highlighting */}
      <p
        className="text-sm text-cerebro-text-muted mb-3 line-clamp-3"
        style={{ color: '#718096' }}
        dangerouslySetInnerHTML={{
          __html: snippet.replace(
            /<mark>/g,
            '<mark style="background-color: rgba(214, 158, 46, 0.3); padding: 0 2px; border-radius: 2px;">'
          ),
        }}
      />

      {/* Meta info footer */}
      <div className="flex items-center gap-3 text-xs text-cerebro-text-muted" style={{ color: '#718096' }}>
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          {court}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formattedDate}
        </span>
      </div>
    </article>
  );
};

export default ResultCard;
