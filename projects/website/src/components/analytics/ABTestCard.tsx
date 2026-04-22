import React from 'react';

interface VariantStats {
  starts: number;
  completes: number;
  leads: number;
  completionRate: number;
  leadRate: number;
}

interface ABTestCardProps {
  testName: string;
  variantA: VariantStats;
  variantB: VariantStats;
  lift: number;
  confidence: number;
  status: string;
  daysRunning: number;
}

function statusLabel(status: string): { text: string; cls: string } {
  if (status === 'variant_b_winning') return { text: 'Variant B Winning', cls: 'analytics__badge--success' };
  if (status === 'variant_a_winning') return { text: 'Variant A Winning', cls: 'analytics__badge--success' };
  if (status === 'no_significance') return { text: 'No Significant Difference', cls: 'analytics__badge--neutral' };
  return { text: 'Needs More Data', cls: 'analytics__badge--warning' };
}

function confidenceColor(confidence: number): string {
  if (confidence >= 95) return '#22c55e';
  if (confidence >= 80) return '#eab308';
  return 'rgba(255,255,255,0.25)';
}

const VariantCard: React.FC<{ label: string; stats: VariantStats; isWinner: boolean }> = ({ label, stats, isWinner }) => (
  <div className={`analytics__ab-card-variant${isWinner ? ' analytics__ab-card-variant--winner' : ''}`}>
    <h4>{label}{isWinner ? ' 🏆' : ''}</h4>
    <div className="analytics__ab-card-stat"><span>Starts</span><span>{stats.starts}</span></div>
    <div className="analytics__ab-card-stat"><span>Completes</span><span>{stats.completes}</span></div>
    <div className="analytics__ab-card-stat"><span>Leads</span><span>{stats.leads}</span></div>
    <div className="analytics__ab-card-stat"><span>Completion Rate</span><span>{stats.completionRate}%</span></div>
    <div className="analytics__ab-card-stat"><span>Lead Rate</span><span style={{ color: '#00FFFF' }}>{stats.leadRate}%</span></div>
  </div>
);

const ABTestCard: React.FC<ABTestCardProps> = ({
  testName,
  variantA,
  variantB,
  lift,
  confidence,
  status,
  daysRunning,
}) => {
  const { text, cls } = statusLabel(status);
  const bIsWinner = status === 'variant_b_winning';
  const aIsWinner = status === 'variant_a_winning';

  return (
    <div className="analytics__ab-card">
      <div className="analytics__ab-card-header">
        <div>
          <h3>{testName}</h3>
          <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>
            Running {daysRunning} day{daysRunning !== 1 ? 's' : ''}
            &nbsp;·&nbsp;
            <span style={{ color: '#00FFFF' }}>+{lift}% lift</span>
          </span>
        </div>
        <span className={`analytics__scorecard-badge analytics__badge ${cls}`}>{text}</span>
      </div>
      <div className="analytics__ab-card-variants">
        <VariantCard label="Variant A (Control)" stats={variantA} isWinner={aIsWinner} />
        <VariantCard label="Variant B (Test)" stats={variantB} isWinner={bIsWinner} />
      </div>
      <div className="analytics__ab-card-confidence">
        <label>
          <span>Statistical Confidence</span>
          <span style={{ color: confidenceColor(confidence), fontWeight: 600 }}>{confidence}%</span>
        </label>
        <div className="analytics__ab-card-meter">
          <div
            style={{
              width: `${confidence}%`,
              background: confidenceColor(confidence),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ABTestCard;
