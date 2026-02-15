/**
 * AuthorityBadge - Visual indicator for legal authority level
 *
 * Color coding per spec:
 * - SCOTUS: Gold (#d69e2e)
 * - Circuit: Blue (#2b6cb0)
 * - District: Green (#38a169)
 * - Agency: Purple (#805ad5)
 * - Statute: Orange (#dd6b20)
 */

import React from 'react';
import type { AuthorityLevel, AuthorityBadgeProps } from '../types/cerebro.types';

const AUTHORITY_CONFIG: Record<AuthorityLevel, { label: string; bgClass: string; textClass: string }> = {
  scotus: {
    label: 'SCOTUS',
    bgClass: 'bg-badge-scotus/20',
    textClass: 'text-badge-scotus',
  },
  circuit: {
    label: 'Circuit',
    bgClass: 'bg-badge-circuit/20',
    textClass: 'text-badge-circuit',
  },
  district: {
    label: 'District',
    bgClass: 'bg-badge-district/20',
    textClass: 'text-badge-district',
  },
  agency: {
    label: 'Agency',
    bgClass: 'bg-badge-agency/20',
    textClass: 'text-badge-agency',
  },
  statute: {
    label: 'Statute',
    bgClass: 'bg-badge-statute/20',
    textClass: 'text-badge-statute',
  },
};

// Fallback inline styles for environments without custom Tailwind config
const AUTHORITY_STYLES: Record<AuthorityLevel, { bg: string; text: string }> = {
  scotus: { bg: 'rgba(214, 158, 46, 0.2)', text: '#d69e2e' },
  circuit: { bg: 'rgba(43, 108, 176, 0.2)', text: '#2b6cb0' },
  district: { bg: 'rgba(56, 161, 105, 0.2)', text: '#38a169' },
  agency: { bg: 'rgba(128, 90, 213, 0.2)', text: '#805ad5' },
  statute: { bg: 'rgba(221, 107, 32, 0.2)', text: '#dd6b20' },
};

export const AuthorityBadge: React.FC<AuthorityBadgeProps> = ({ level }) => {
  const config = AUTHORITY_CONFIG[level];
  const styles = AUTHORITY_STYLES[level];

  return (
    <span
      className={`
        inline-flex items-center
        px-2.5 py-0.5
        rounded-full
        text-xs font-semibold
        uppercase tracking-wide
        ${config.bgClass}
        ${config.textClass}
      `}
      style={{
        backgroundColor: styles.bg,
        color: styles.text,
      }}
      role="status"
      aria-label={`Authority level: ${config.label}`}
    >
      {config.label}
    </span>
  );
};

export default AuthorityBadge;
