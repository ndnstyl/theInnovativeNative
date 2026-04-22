import React from 'react';

interface FunnelStage {
  name: string;
  count: number;
  rate: number;
}

interface FunnelChartProps {
  stages: FunnelStage[];
}

const FunnelChart: React.FC<FunnelChartProps> = ({ stages }) => {
  const maxCount = stages[0]?.count || 1;

  return (
    <div className="analytics__funnel">
      {stages.map((stage, i) => {
        const pct = (stage.count / maxCount) * 100;
        return (
          <div key={i} className="analytics__funnel-stage">
            <div className="analytics__funnel-label">{stage.name}</div>
            <div className="analytics__funnel-bar-wrapper">
              <div
                className="analytics__funnel-bar"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="analytics__funnel-meta">
              <span>{stage.count.toLocaleString()}</span>{' '}
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem' }}>
                ({stage.rate}%)
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FunnelChart;
