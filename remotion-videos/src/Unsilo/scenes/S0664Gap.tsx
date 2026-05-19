import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { SceneFrame } from '../components/SceneFrame';
import { colors, fonts, clamp, progress, easeOut } from '../theme';

// Scene 6 - The 64% Gap
// Drawing order: title -> cyan bar (marketing) -> magenta bar (revops) -> bracket + gap label -> cost line

const TITLE_START = 5;
const BAR1_START = 20;
const BAR2_START = 45;
const BRACKET_START = 80;
const COST_START = 130;

export const S0664Gap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const isVertical = height > width;
  const vw = width;
  const vh = height;

  const pad = Math.round(vw * 0.05);
  const barAreaLeft = pad;
  const barAreaRight = isVertical ? vw * 0.76 : vw * 0.72;
  const barMaxWidth = barAreaRight - barAreaLeft;

  const bar1Y = isVertical ? vh * 0.22 : vh * 0.22;
  const bar2Y = isVertical ? vh * 0.42 : vh * 0.40;
  const barH = isVertical ? Math.round(vh * 0.065) : Math.round(vh * 0.07);

  const bar1FullW = barMaxWidth * 0.80;
  const bar2FullW = barMaxWidth * 0.30;

  const bar1Sp = spring({ frame: frame - BAR1_START, fps, config: { damping: 22, stiffness: 120 }, from: 0, to: 1 });
  const bar2Sp = spring({ frame: frame - BAR2_START, fps, config: { damping: 22, stiffness: 120 }, from: 0, to: 1 });
  const bar1W = bar1FullW * clamp(bar1Sp, 0, 1);
  const bar2W = bar2FullW * clamp(bar2Sp, 0, 1);

  const bracketT = easeOut(progress(frame, BRACKET_START, BRACKET_START + 20));
  const costSp = spring({ frame: frame - COST_START, fps, config: { damping: 18, stiffness: 200 }, from: 0, to: 1 });
  const costOpacity = clamp(costSp, 0, 1);

  const labelFontSize = isVertical ? Math.round(vw * 0.034) : Math.round(vh * 0.030);
  const numberFontSize = isVertical ? Math.round(vw * 0.042) : Math.round(vh * 0.036);
  const gapFontSize = isVertical ? Math.round(vw * 0.048) : Math.round(vh * 0.040);
  const costFontSize = isVertical ? Math.round(vw * 0.032) : Math.round(vh * 0.026);

  const bracketX = barAreaLeft + bar2FullW + 12;
  const bracketTop = bar1Y;
  const bracketBottom = bar2Y + barH;
  const bracketMid = (bracketTop + bracketBottom) / 2;

  return (
    <SceneFrame title="THE 64% GAP">
      <svg
        style={{ position: 'absolute', inset: 0 }}
        width={vw}
        height={vh}
        viewBox={`0 0 ${vw} ${vh}`}
      >
        {/* Bar 1 - Marketing (cyan) */}
        <rect
          x={barAreaLeft}
          y={bar1Y}
          width={bar1W}
          height={barH}
          rx={3}
          fill={colors.cyan}
          fillOpacity={0.22}
          stroke={colors.cyan}
          strokeWidth={1.5}
        />
        <text x={barAreaLeft + 10} y={bar1Y + barH * 0.62} fontFamily={fonts.mono} fontSize={labelFontSize} fontWeight={600} fill={colors.cyan}>
          Marketing:
        </text>
        <text x={barAreaLeft + bar1FullW - 10} y={bar1Y + barH * 0.62} fontFamily={fonts.mono} fontSize={numberFontSize} fontWeight={700} fill={colors.cyan} textAnchor="end">
          216 MQLs
        </text>

        {/* Bar 2 - RevOps (magenta) */}
        <rect
          x={barAreaLeft}
          y={bar2Y}
          width={bar2W}
          height={barH}
          rx={3}
          fill={colors.magenta}
          fillOpacity={0.18}
          stroke={colors.magenta}
          strokeWidth={1.5}
        />
        <text x={barAreaLeft + 10} y={bar2Y + barH * 0.62} fontFamily={fonts.mono} fontSize={labelFontSize} fontWeight={600} fill={colors.magenta}>
          RevOps:
        </text>
        <text x={barAreaLeft + bar2FullW - 10} y={bar2Y + barH * 0.62} fontFamily={fonts.mono} fontSize={numberFontSize} fontWeight={700} fill={colors.magenta} textAnchor="end">
          78 accepted SQLs
        </text>

        {/* Bar labels on right side */}
        <text x={barAreaLeft + bar1FullW + 8} y={bar1Y + barH * 0.62} fontFamily={fonts.mono} fontSize={labelFontSize} fill={colors.cyan} opacity={clamp(bar1Sp, 0, 1)}>
          216 MQLs
        </text>
        <text x={barAreaLeft + bar2FullW + 8} y={bar2Y + barH * 0.62} fontFamily={fonts.mono} fontSize={labelFontSize} fill={colors.magenta} opacity={clamp(bar2Sp, 0, 1)}>
          78 SQLs
        </text>

        {/* Bracket */}
        {bracketT > 0 && (
          <g opacity={bracketT}>
            <line x1={bracketX} y1={bracketTop + barH} x2={bracketX + 12} y2={bracketTop + barH} stroke={colors.offWhite} strokeWidth={1.5} />
            <line x1={bracketX + 12} y1={bracketTop + barH} x2={bracketX + 12} y2={bracketBottom} stroke={colors.offWhite} strokeWidth={1.5} />
            <line x1={bracketX} y1={bracketBottom} x2={bracketX + 12} y2={bracketBottom} stroke={colors.offWhite} strokeWidth={1.5} />
            <text
              x={bracketX + 20}
              y={bracketMid + gapFontSize * 0.35}
              fontFamily={fonts.handwritten}
              fontSize={gapFontSize}
              fontWeight={700}
              fill={colors.magenta}
            >
              -64% gap
            </text>
          </g>
        )}

        {/* Cost line */}
        <text
          x={vw / 2}
          y={isVertical ? vh * 0.72 : vh * 0.68}
          textAnchor="middle"
          fontFamily={fonts.handwritten}
          fontSize={costFontSize}
          fill={colors.offWhite}
          opacity={costOpacity}
        >
          = six figures of misallocated spend per quarter
        </text>
      </svg>
    </SceneFrame>
  );
};
