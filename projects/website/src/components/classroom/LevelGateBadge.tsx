import React from 'react';

interface LevelGateBadgeProps {
  requiredLevel: number;
  currentLevel: number;
}

/**
 * Displays "Level X Required" badge when the user's level is below the threshold.
 */
const LevelGateBadge: React.FC<LevelGateBadgeProps> = ({ requiredLevel, currentLevel }) => {
  if (currentLevel >= requiredLevel) return null;

  return (
    <span className="classroom-level-gate">
      <i className="fa-solid fa-lock"></i>
      Level {requiredLevel} Required
    </span>
  );
};

export default LevelGateBadge;
