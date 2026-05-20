import React from 'react';
import { formatDripCountdown } from '@/hooks/useDripAccess';

interface DrippedModuleIndicatorProps {
  unlockDate: Date;
}

/**
 * Displays "Unlocks in X days" indicator for drip-scheduled modules.
 */
const DrippedModuleIndicator: React.FC<DrippedModuleIndicatorProps> = ({ unlockDate }) => {
  const label = formatDripCountdown(unlockDate);

  return (
    <span className="classroom-drip-indicator">
      <i className="fa-solid fa-clock"></i>
      {label}
    </span>
  );
};

export default DrippedModuleIndicator;
