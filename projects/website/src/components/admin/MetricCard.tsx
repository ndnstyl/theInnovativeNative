import React from 'react';

interface MetricCardProps {
  label: string;
  value: number | string;
  trend?: number;
  trendDirection?: 'up' | 'down' | 'flat';
  icon?: string;
  format?: 'number' | 'percent' | 'currency';
}

function formatValue(value: number | string, format?: string): string {
  if (typeof value === 'string') return value;
  switch (format) {
    case 'percent': return `${value.toFixed(1)}%`;
    case 'currency': return `$${value.toLocaleString()}`;
    default: return value.toLocaleString();
  }
}

const MetricCard: React.FC<MetricCardProps> = ({
  label, value, trend, trendDirection = 'flat', icon, format
}) => {
  const trendClass = trendDirection === 'up' ? 'metric-card__trend--up'
    : trendDirection === 'down' ? 'metric-card__trend--down'
    : 'metric-card__trend--flat';

  const trendIcon = trendDirection === 'up' ? 'fa-arrow-up'
    : trendDirection === 'down' ? 'fa-arrow-down'
    : 'fa-minus';

  return (
    <div className="metric-card">
      <div className="metric-card__header">
        {icon && <i className={icon}></i>}
        <span className="metric-card__label">{label}</span>
      </div>
      <div className="metric-card__value">{formatValue(value, format)}</div>
      {trend !== undefined && (
        <div className={`metric-card__trend ${trendClass}`}>
          <i className={`fa-solid ${trendIcon}`}></i>
          <span>{Math.abs(trend).toFixed(1)}%</span>
          <span className="metric-card__trend-label">vs last period</span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
