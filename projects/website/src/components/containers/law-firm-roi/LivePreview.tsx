import React from 'react';
import type { RoiResults } from '@/types/roi-calculator';
import AnimatedCounter from './AnimatedCounter';

interface LivePreviewProps {
  results: RoiResults;
  isComplete: boolean;
}

const LivePreview = ({ results, isComplete }: LivePreviewProps) => {
  const maxPhase = Math.max(...results.phases.map((p) => p.annualRoi), 1);

  return (
    <div className={`roi-live-preview${isComplete ? ' roi-live-preview--complete' : ''}`}>
      <div className="roi-live-preview__header">
        <span className="roi-live-preview__label">Running ROI Total</span>
        <span className="roi-live-preview__total">
          <AnimatedCounter value={results.totalAnnualRoi} prefix="$" />
          <span className="roi-live-preview__per-year">/year</span>
        </span>
      </div>
      <div className="roi-live-preview__phases">
        {results.phases.map((phase, i) => (
          <div key={i} className="roi-live-preview__phase">
            <div className="roi-live-preview__phase-header">
              <span className="roi-live-preview__phase-name">{phase.shortName}</span>
              <span className="roi-live-preview__phase-value">
                ${Math.round(phase.annualRoi).toLocaleString()}
              </span>
            </div>
            <div className="roi-live-preview__bar">
              <div
                className="roi-live-preview__bar-fill"
                style={{ width: `${(phase.annualRoi / maxPhase) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <div className="roi-live-preview__monthly">
        <span>Monthly:</span>
        <span><AnimatedCounter value={results.totalMonthlyRoi} prefix="$" /></span>
      </div>
    </div>
  );
};

export default LivePreview;
