import React from 'react';
import LevelBadge1 from './LevelBadge1';
import LevelBadge2 from './LevelBadge2';
import LevelBadge3 from './LevelBadge3';
import LevelBadge4 from './LevelBadge4';
import LevelBadge5 from './LevelBadge5';
import LevelBadge6 from './LevelBadge6';
import LevelBadge7 from './LevelBadge7';
import LevelBadge8 from './LevelBadge8';
import LevelBadge9 from './LevelBadge9';

const badges: Record<number, React.FC<{ size?: number }>> = {
  1: LevelBadge1,
  2: LevelBadge2,
  3: LevelBadge3,
  4: LevelBadge4,
  5: LevelBadge5,
  6: LevelBadge6,
  7: LevelBadge7,
  8: LevelBadge8,
  9: LevelBadge9,
};

export function getBadgeComponent(level: number): React.FC<{ size?: number }> {
  return badges[level] || LevelBadge1;
}

export { LevelBadge1, LevelBadge2, LevelBadge3, LevelBadge4, LevelBadge5, LevelBadge6, LevelBadge7, LevelBadge8, LevelBadge9 };
