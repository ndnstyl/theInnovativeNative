import React from 'react';
import { getBadgeComponent } from './badges';
import type { Level } from '@/types/supabase';

interface Props {
  currentPoints: number;
  currentLevel: Level;
  nextLevel: Level | null;
}

const ProgressionDisplay: React.FC<Props> = ({ currentPoints, currentLevel, nextLevel }) => {
  const BadgeIcon = getBadgeComponent(currentLevel.level_number);

  let progressPct = 100;
  let progressText = 'Max Level Reached';

  if (nextLevel) {
    const rangeTotal = nextLevel.min_points - currentLevel.min_points;
    const rangeCurrent = currentPoints - currentLevel.min_points;
    progressPct = rangeTotal > 0 ? Math.min(100, Math.max(0, (rangeCurrent / rangeTotal) * 100)) : 0;
    progressText = `${currentPoints.toLocaleString()} / ${nextLevel.min_points.toLocaleString()} points`;
  }

  return (
    <div className="progression">
      <div className="progression__info">
        <span className="progression__badge">
          <BadgeIcon size={24} />
        </span>
        <span className="progression__level-text">
          Level {currentLevel.level_number} — {currentLevel.name}
        </span>
      </div>
      <div
        className="progression__bar"
        role="progressbar"
        aria-valuenow={currentPoints}
        aria-valuemin={currentLevel.min_points}
        aria-valuemax={nextLevel?.min_points || currentPoints}
      >
        <div
          className="progression__fill"
          style={{ width: `${progressPct}%` }}
        />
      </div>
      <span className="progression__text">{progressText}</span>
    </div>
  );
};

export default ProgressionDisplay;
