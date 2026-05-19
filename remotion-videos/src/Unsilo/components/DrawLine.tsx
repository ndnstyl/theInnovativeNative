import React from 'react';
import { useCurrentFrame } from 'remotion';
import { progress, easeOut } from '../theme';

interface DrawLineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  startFrame: number;
  durationFrames?: number;
  stroke?: string;
  strokeWidth?: number;
  dashed?: boolean;
}

/**
 * DrawLine - SVG line that draws itself via stroke-dashoffset animation.
 * Coordinates are in the parent SVG's coordinate space.
 */
export const DrawLine: React.FC<DrawLineProps> = ({
  x1,
  y1,
  x2,
  y2,
  startFrame,
  durationFrames = 12,
  stroke = '#00FFFF',
  strokeWidth = 2,
  dashed = false,
}) => {
  const frame = useCurrentFrame();
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const t = easeOut(progress(frame, startFrame, startFrame + durationFrames));
  const drawn = t * len;

  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeDasharray={dashed ? `${len * 0.06} ${len * 0.04}` : `${len}`}
      strokeDashoffset={dashed ? 0 : len - drawn}
      opacity={t > 0 ? 1 : 0}
    />
  );
};
