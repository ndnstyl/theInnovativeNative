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
  { value: 'criminal_procedure', label: 'Criminal Procedure' },
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
    <div className="relative inline-block">
      <label htmlFor="practice-area" className="sr-only">
        Select Practice Area
      </label>
      <select
        id="practice-area"
        value={selected}
        onChange={handleChange}
        className="
          appearance-none
          bg-cerebro-secondary/10
          border border-cerebro-border
          rounded-lg
          px-4 py-2 pr-10
          text-cerebro-text-primary
          font-medium
          cursor-pointer
          hover:bg-cerebro-secondary/20
          focus:outline-none
          focus:ring-2
          focus:ring-cerebro-secondary
          focus:border-transparent
          transition-colors
        "
        aria-label="Select practice area for legal research"
      >
        {PRACTICE_AREAS.map((area) => (
          <option key={area.value} value={area.value}>
            {area.label}
          </option>
        ))}
      </select>
      {/* Custom dropdown arrow */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg
          className="w-4 h-4 text-cerebro-text-muted"
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
