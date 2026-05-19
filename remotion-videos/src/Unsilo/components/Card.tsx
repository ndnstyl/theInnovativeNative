import React from 'react';
import { useCurrentFrame, spring, useVideoConfig } from 'remotion';
import { colors, fonts } from '../theme';

interface CardProps {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  sublabel?: string;
  startFrame: number;
  strokeColor?: string;
  fillColor?: string;
  labelColor?: string;
  sublabelColor?: string;
  fontSize?: number;
  sublabelFontSize?: number;
}

/**
 * Card - labeled rectangle that scales from 0.95 -> 1.0 with fade-in.
 * Coordinates relative to the SVG's viewBox.
 */
export const Card: React.FC<CardProps> = ({
  x,
  y,
  width,
  height,
  label,
  sublabel,
  startFrame,
  strokeColor = colors.cyan,
  fillColor = 'none',
  labelColor = colors.offWhite,
  sublabelColor = 'rgba(255,255,255,0.55)',
  fontSize = 15,
  sublabelFontSize = 11,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sp = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 20, stiffness: 180, mass: 0.7 },
    from: 0,
    to: 1,
  });

  const scale = 0.95 + sp * 0.05;
  const opacity = Math.min(sp, 1);
  const cx = x + width / 2;
  const cy = y + height / 2;

  return (
    <g
      opacity={opacity}
      transform={`translate(${cx},${cy}) scale(${scale}) translate(${-cx},${-cy})`}
    >
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={4}
        stroke={strokeColor}
        strokeWidth={1.5}
        fill={fillColor === 'none' ? 'none' : fillColor}
        fillOpacity={fillColor === 'none' ? 0 : 0.12}
      />
      <text
        x={cx}
        y={sublabel ? cy - sublabelFontSize * 0.6 : cy + fontSize * 0.35}
        textAnchor="middle"
        fontFamily={fonts.mono}
        fontSize={fontSize}
        fontWeight={600}
        fill={labelColor}
        style={{ textTransform: 'uppercase' }}
      >
        {label}
      </text>
      {sublabel && (
        <text
          x={cx}
          y={cy + fontSize * 0.7}
          textAnchor="middle"
          fontFamily={fonts.handwritten}
          fontSize={sublabelFontSize}
          fill={sublabelColor}
        >
          {sublabel}
        </text>
      )}
    </g>
  );
};
