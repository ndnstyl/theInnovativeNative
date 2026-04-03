/**
 * PracticeAreaSelector - Dropdown for routing queries to correct corpus
 *
 * Options:
 * - Bankruptcy
 * - Criminal Procedure
 * - Administrative Law
 */

import React from 'react';
import type { PracticeArea, PracticeAreaSelectorProps } from '../types/cerebro.types';

const PRACTICE_AREAS: { value: PracticeArea; label: string }[] = [
  { value: 'bankruptcy', label: 'Bankruptcy' },
  { value: 'criminal_procedure', label: 'Criminal Defense' },
  { value: 'administrative', label: 'Administrative Law' },
];

export const PracticeAreaSelector: React.FC<PracticeAreaSelectorProps> = ({
  selected,
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as PracticeArea);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <label htmlFor="practice-area" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: 0 }}>
        Select Practice Area
      </label>
      <select
        id="practice-area"
        value={selected}
        onChange={handleChange}
        style={{
          appearance: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          padding: '8px 40px 8px 16px',
          color: '#ffffff',
          fontWeight: 500,
          cursor: 'pointer',
          outline: 'none',
          transition: 'background-color 0.2s',
          fontSize: '14px',
        }}
        aria-label="Select practice area for legal research"
      >
        {PRACTICE_AREAS.map((area) => (
          <option key={area.value} value={area.value}>
            {area.label}
          </option>
        ))}
      </select>
      {/* Custom dropdown arrow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          paddingRight: '12px',
          pointerEvents: 'none',
        }}
      >
        <svg
          style={{ width: '16px', height: '16px', color: '#ffffff' }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
};

export default PracticeAreaSelector;
