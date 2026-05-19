import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { SceneFrame } from '../components/SceneFrame';
import { colors, fonts, clamp, progress, easeOut } from '../theme';

// Scene 11 - The 8 KPIs
// Drawing order: top row left-to-right -> bottom row left-to-right -> annotation last

const KPIS = [
  { num: '01', name: 'Blended MER', formula: 'Rev / Spend' },
  { num: '02', name: 'Blended CAC', formula: '(Mktg + Sales) / New' },
  { num: '03', name: 'CAC Payback', formula: 'Months to breakeven' },
  { num: '04', name: '90d LTV', formula: 'Cohort revenue, 90 days' },
  { num: '05', name: 'MQL to SQL', formula: 'Stage conv. %' },
  { num: '06', name: 'SQL to Won', formula: 'Stage conv. %' },
  { num: '07', name: 'Pipeline / $1 Spent', formula: 'Top-funnel efficiency' },
  { num: '08', name: 'Contribution / Channel', formula: 'Rev - COGS - VarMkt' },
];

const CARD_START = 8;
const CARD_GAP = 12;
const ANNOTATION_START = 145;

export const S11EightKpis: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const isVertical = height > width;
  const vw = width;
  const vh = height;

  const cols = isVertical ? 2 : 4;
  const rows = 2;
  const pad = Math.round(vw * 0.04);
  const gridW = vw - pad * 2;
  const gridStartY = isVertical ? Math.round(vh * 0.13) : Math.round(vh * 0.12);
  const gridH = isVertical ? Math.round(vh * 0.68) : Math.round(vh * 0.68);
  const cardW = Math.round(gridW / cols) - 8;
  const cardH = Math.round(gridH / rows) - 8;

  const numFontSize = isVertical ? Math.round(vw * 0.024) : Math.round(vh * 0.022);
  const nameFontSize = isVertical ? Math.round(vw * 0.030) : Math.round(vh * 0.028);
  const formulaFontSize = isVertical ? Math.round(vw * 0.022) : Math.round(vh * 0.020);
  const annotFontSize = isVertical ? Math.round(vw * 0.036) : Math.round(vh * 0.030);

  const annotT = easeOut(progress(frame, ANNOTATION_START, ANNOTATION_START + 18));

  return (
    <SceneFrame title="THE 8 KPIs">
      <svg
        style={{ position: 'absolute', inset: 0 }}
        width={vw}
        height={vh}
        viewBox={`0 0 ${vw} ${vh}`}
      >
        {KPIS.map((kpi, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const cx_card = pad + col * (cardW + 8) + cardW / 2;
          const cy_card = gridStartY + row * (cardH + 8) + cardH / 2;
          const cardX = pad + col * (cardW + 8);
          const cardY = gridStartY + row * (cardH + 8);

          const cardSp = spring({ frame: frame - (CARD_START + i * CARD_GAP), fps, config: { damping: 20, stiffness: 170 }, from: 0, to: 1 });
          const cardOpacity = clamp(cardSp, 0, 1);
          const cardScale = 0.95 + cardSp * 0.05;

          return (
            <g
              key={i}
              opacity={cardOpacity}
              transform={`translate(${cx_card},${cy_card}) scale(${cardScale}) translate(${-cx_card},${-cy_card})`}
            >
              {/* Card border */}
              <rect
                x={cardX}
                y={cardY}
                width={cardW}
                height={cardH}
                rx={4}
                stroke={colors.cyan}
                strokeWidth={1.2}
                fill={colors.cyanDim}
              />
              {/* Number badge */}
              <text
                x={cardX + 8}
                y={cardY + numFontSize + 6}
                fontFamily={fonts.mono}
                fontSize={numFontSize}
                fontWeight={700}
                fill={colors.cyanStroke}
              >
                {kpi.num}
              </text>
              {/* KPI name */}
              <text
                x={cx_card}
                y={cy_card - formulaFontSize * 0.8}
                textAnchor="middle"
                fontFamily={fonts.mono}
                fontSize={nameFontSize}
                fontWeight={700}
                fill={colors.white}
              >
                {kpi.name}
              </text>
              {/* Formula */}
              <text
                x={cx_card}
                y={cy_card + formulaFontSize * 1.2}
                textAnchor="middle"
                fontFamily={fonts.handwritten}
                fontSize={formulaFontSize}
                fill={colors.offWhite}
              >
                {kpi.formula}
              </text>
            </g>
          );
        })}

        {/* Annotation */}
        <text
          x={vw / 2}
          y={gridStartY + gridH + 32}
          textAnchor="middle"
          fontFamily={fonts.handwritten}
          fontSize={annotFontSize}
          fontWeight={700}
          fill={colors.magenta}
          opacity={annotT}
        >
          Same number, every team, every Monday.
        </text>
      </svg>
    </SceneFrame>
  );
};
