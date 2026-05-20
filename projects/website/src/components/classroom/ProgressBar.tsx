import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, showLabel = true, size = 'md' }) => {
  const clampedProgress = Math.min(100, Math.max(0, Math.floor(progress)));

  return (
    <div className={`classroom-progress ${size === 'sm' ? 'classroom-progress--sm' : ''}`}>
      <div
        className="classroom-progress__track"
        role="progressbar"
        aria-valuenow={clampedProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${clampedProgress}% complete`}
      >
        <div
          className="classroom-progress__fill"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showLabel && (
        <span className="classroom-progress__label">{clampedProgress}%</span>
      )}
    </div>
  );
};

export default ProgressBar;
