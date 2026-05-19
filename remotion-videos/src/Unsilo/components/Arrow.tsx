import React from 'react';
import { useCurrentFrame } from 'remotion';
import { progress, easeOut } from '../theme';

interface ArrowProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  startFrame: number;
  durationFrames?: number;
  stroke?: string;
  strokeWidth?: number;
  headSize?: number;
  curved?: boolean;
}

/**
 * Arrow - draw-on arrow with arrowhead. Uses stroke-dashoffset for the shaft,
 * then shows the arrowhead when the line is mostly drawn.
 */
export const Arrow: React.FC<ArrowProps> = ({
  x1,
  y1,
  x2,
  y2,
  startFrame,
  durationFrames = 10,
  stroke = '#00FFFF',
  strokeWidth = 1.5,
  headSize = 8,
  curved = false,
}) => {
  const frame = useCurrentFrame();
  const t = easeOut(progress(frame, startFrame, startFrame + durationFrames));

  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return null;

  const nx = dx / len;
  const ny = dy / len;

  // Arrowhead tip
  const tipX = x2;
  const tipY = y2;
  const baseX = tipX - nx * headSize;
  const baseY = tipY - ny * headSize;
  const perpX = -ny * headSize * 0.5;
  const perpY = nx * headSize * 0.5;

  const headPoints = `${tipX},${tipY} ${baseX + perpX},${baseY + perpY} ${baseX - perpX},${baseY - perpY}`;

  // For curved arrows, use a quadratic bezier with a perpendicular control point
  const midX = (x1 + x2) / 2 + ny * len * 0.15;
  const midY = (y1 + y2) / 2 - nx * len * 0.15;
  const pathD = curved
    ? `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`
    : `M ${x1} ${y1} L ${x2} ${y2}`;

  // Approximate path length for dashoffset
  const pathLen = curved ? len * 1.08 : len;
  const drawn = t * pathLen;

  return (
    <g opacity={t > 0 ? 1 : 0}>
      <path
        d={pathD}
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={pathLen}
        strokeDashoffset={pathLen - drawn}
      />
      {t > 0.85 && (
        <polygon
          points={headPoints}
          fill={stroke}
          opacity={Math.min((t - 0.85) / 0.15, 1)}
        />
      )}
    </g>
  );
};
