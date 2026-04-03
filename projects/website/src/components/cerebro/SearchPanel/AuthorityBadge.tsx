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

const AUTHORITY_STYLES: Record<AuthorityLevel, { bg: string; text: string; label: string }> = {
  scotus: { bg: 'rgba(214, 158, 46, 0.2)', text: '#d69e2e', label: 'SCOTUS' },
  circuit: { bg: 'rgba(43, 108, 176, 0.2)', text: '#2b6cb0', label: 'Circuit' },
  district: { bg: 'rgba(56, 161, 105, 0.2)', text: '#38a169', label: 'District' },
  agency: { bg: 'rgba(128, 90, 213, 0.2)', text: '#805ad5', label: 'Agency' },
  statute: { bg: 'rgba(221, 107, 32, 0.2)', text: '#dd6b20', label: 'Statute' },
};

export const AuthorityBadge: React.FC<AuthorityBadgeProps> = ({ level }) => {
  const styles = AUTHORITY_STYLES[level];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 10px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        backgroundColor: styles.bg,
        color: styles.text,
      }}
      role="status"
      aria-label={`Authority level: ${styles.label}`}
    >
      {styles.label}
    </span>
  );
};

export default AuthorityBadge;
