import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { SceneFrame } from '../components/SceneFrame';
import { colors, fonts, clamp, progress, easeOut } from '../theme';

// Scene 12 - The CFO Monday View
// Drawing order: header row -> each question row -> health bars -> annotation

const COLS = ['Question', 'Number', 'Source', 'Health'];
const ROWS = [
  {
    q: 'What did one customer cost?',
    num: 'CAC',
    source: 'fct_ad_spend + fct_customer',
    healthGreen: true,
    healthLabel: '< LTV x 0.33',
  },
  {
    q: 'How long to make it back?',
    num: 'Payback',
    source: 'CAC / gross profit/mo',
    healthGreen: false,
    healthLabel: '< 12 months',
  },
  {
    q: 'How much per $1 spent?',
    num: 'MER',
    source: 'Stripe / all spend',
    healthGreen: true,
    healthLabel: '> 3.0 trailing 28d',
  },
  {
    q: 'Which channel actually pays?',
    num: 'Contrib/channel',
    source: 'fct_order x COGS by channel',
    healthGreen: true,
    healthLabel: 'positive at week 4',
  },
];

const HEADER_START = 5;
const ROW_START = 25;
const ROW_GAP = 18;
const HEALTH_START = 110;
const ANNOTATION_START = 150;

export const S12CfoMondayView: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const isVertical = height > width;
  const vw = width;
  const vh = height;

  const pad = Math.round(vw * 0.04);
  const tableX = pad;
  const tableY = isVertical ? Math.round(vh * 0.14) : Math.round(vh * 0.13);
  const tableW = vw - pad * 2;
  const rowH = isVertical ? Math.round(vh * 0.095) : Math.round(vh * 0.10);
  const headerH = isVertical ? Math.round(vh * 0.060) : Math.round(vh * 0.060);
  const totalH = headerH + ROWS.length * rowH;

  // Column widths as fractions
  const colWidths = [0.38, 0.16, 0.30, 0.16];
  const colXs = colWidths.reduce((acc, w, i) => {
    acc.push(i === 0 ? tableX : acc[i - 1] + colWidths[i - 1] * tableW);
    return acc;
  }, [] as number[]);

  const headerFontSize = isVertical ? Math.round(vw * 0.024) : Math.round(vh * 0.022);
  const cellFontSize = isVertical ? Math.round(vw * 0.020) : Math.round(vh * 0.018);
  const sourceFontSize = isVertical ? Math.round(vw * 0.016) : Math.round(vh * 0.014);
  const annotFontSize = isVertical ? Math.round(vw * 0.032) : Math.round(vh * 0.026);
  const barW = isVertical ? Math.round(vw * 0.10) : Math.round(vw * 0.08);
  const barH = isVertical ? 8 : 7;

  const headerSp = spring({ frame: frame - HEADER_START, fps, config: { damping: 20, stiffness: 180 }, from: 0, to: 1 });
  const headerOpacity = clamp(headerSp, 0, 1);

  const healthT = easeOut(progress(frame, HEALTH_START, HEALTH_START + 20));
  const annotT = easeOut(progress(frame, ANNOTATION_START, ANNOTATION_START + 18));

  return (
    <SceneFrame title="CFO MONDAY VIEW">
      <svg
        style={{ position: 'absolute', inset: 0 }}
        width={vw}
        height={vh}
        viewBox={`0 0 ${vw} ${vh}`}
      >
        {/* Table border */}
        <rect
          x={tableX}
          y={tableY}
          width={tableW}
          height={totalH}
          rx={4}
          stroke={colors.cyanStroke}
          strokeWidth={1}
          fill="none"
          opacity={0.4}
        />

        {/* Header */}
        <rect
          x={tableX}
          y={tableY}
          width={tableW}
          height={headerH}
          rx={4}
          fill={colors.cyan}
          fillOpacity={0.15}
          opacity={headerOpacity}
        />
        <g opacity={headerOpacity}>
          {COLS.map((col, i) => (
            <text
              key={i}
              x={colXs[i] + colWidths[i] * tableW * 0.5}
              y={tableY + headerH * 0.65}
              textAnchor="middle"
              fontFamily={fonts.mono}
              fontSize={headerFontSize}
              fontWeight={700}
              fill={colors.cyan}
            >
              {col}
            </text>
          ))}
          {/* Col dividers */}
          {colXs.slice(1).map((x, i) => (
            <line key={i} x1={x} y1={tableY} x2={x} y2={tableY + totalH} stroke="rgba(0,255,255,0.2)" strokeWidth={0.5} />
          ))}
        </g>

        {/* Rows */}
        {ROWS.map((row, ri) => {
          const ry = tableY + headerH + ri * rowH;
          const rowSp = spring({ frame: frame - (ROW_START + ri * ROW_GAP), fps, config: { damping: 18, stiffness: 200 }, from: 0, to: 1 });
          const rowOpacity = clamp(rowSp, 0, 1);
          const midY = ry + rowH / 2;

          return (
            <g key={ri} opacity={rowOpacity}>
              <line x1={tableX} y1={ry} x2={tableX + tableW} y2={ry} stroke="rgba(255,255,255,0.10)" strokeWidth={0.5} />

              {/* Question */}
              <text x={colXs[0] + 8} y={midY + cellFontSize * 0.35} fontFamily={fonts.mono} fontSize={cellFontSize} fill={colors.offWhite}>
                {row.q}
              </text>
              {/* Number */}
              <text x={colXs[1] + colWidths[1] * tableW * 0.5} y={midY + cellFontSize * 0.35} textAnchor="middle" fontFamily={fonts.mono} fontSize={cellFontSize} fontWeight={700} fill={colors.white}>
                {row.num}
              </text>
              {/* Source */}
              <text x={colXs[2] + 6} y={midY + sourceFontSize * 0.35} fontFamily={fonts.mono} fontSize={sourceFontSize} fill={colors.dimWhite}>
                {row.source}
              </text>
              {/* Health bar */}
              {healthT > 0 && (
                <g opacity={healthT}>
                  <rect
                    x={colXs[3] + 6}
                    y={midY - barH / 2 - 8}
                    width={barW * (row.healthGreen ? 1 : 0.45)}
                    height={barH}
                    rx={2}
                    fill={row.healthGreen ? '#00C853' : '#FF4444'}
                    fillOpacity={0.85}
                  />
                  <text
                    x={colXs[3] + 6}
                    y={midY + sourceFontSize * 0.5 + 2}
                    fontFamily={fonts.mono}
                    fontSize={sourceFontSize}
                    fill={colors.dimWhite}
                  >
                    {row.healthLabel}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Annotation */}
        <text
          x={vw / 2}
          y={tableY + totalH + annotFontSize + 12}
          textAnchor="middle"
          fontFamily={fonts.handwritten}
          fontSize={annotFontSize}
          fontWeight={700}
          fill={colors.cyan}
          opacity={annotT}
        >
          In the CFO's inbox before Monday standup.
        </text>
      </svg>
    </SceneFrame>
  );
};
