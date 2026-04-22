import React from 'react';

interface ScoreCardProps {
  title: string;
  value: string | number;
  previousValue?: number;
  format?: 'number' | 'currency' | 'percent';
  prefix?: string;
}

function formatValue(value: string | number, format?: 'number' | 'currency' | 'percent', prefix?: string): string {
  if (typeof value === 'string') return value;
  if (format === 'currency') return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (format === 'percent') return `${value}%`;
  if (prefix) return `${prefix}${value.toLocaleString()}`;
  return value.toLocaleString();
}

const ScoreCard: React.FC<ScoreCardProps> = ({ title, value, previousValue, format, prefix }) => {
  let change: number | null = null;
  if (previousValue !== undefined && previousValue !== 0 && typeof value === 'number') {
    change = ((value - previousValue) / Math.abs(previousValue)) * 100;
  }

  const displayValue = formatValue(value, format, prefix);

  return (
    <div className="analytics__scorecard">
      <div className="analytics__scorecard-value">{displayValue}</div>
      <div className="analytics__scorecard-label">{title}</div>
      {change !== null && (
        <span className={`analytics__scorecard-badge analytics__badge analytics__badge--${change >= 0 ? 'up' : 'down'}`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
        </span>
      )}
    </div>
  );
};

export default ScoreCard;
