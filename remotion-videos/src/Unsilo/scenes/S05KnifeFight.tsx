import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { SceneFrame } from '../components/SceneFrame';
import { colors, fonts, clamp, progress, easeOut } from '../theme';

// Scene 5 - The Definitions Knife Fight
// Drawing order: column headers -> each row -> jagged divider line last

const ROWS = [
  { term: 'Lead', mktg: 'Filled a form', revops: 'Known company + ICP fit' },
  { term: 'MQL', mktg: 'Score > X', revops: 'Score + fit + recency + SDR approval' },
  { term: 'SQL', mktg: 'Marketing passed it', revops: 'Sales accepted + worked it' },
  { term: 'Opportunity', mktg: 'Any deal in CRM', revops: 'Stage 2+, with BANT' },
  { term: 'Customer', mktg: 'Paid once', revops: 'Past trial + active sub' },
  { term: 'Attribution', mktg: 'Last non-direct click', revops: 'CRM "Lead Source" field' },
];

const HEADER_START = 5;
const ROW_START = 22;
const ROW_GAP = 14;
const DIVIDER_START = 120;

export const S05KnifeFight: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const isVertical = height > width;
  const vw = width;
  const vh = height;

  const pad = Math.round(vw * 0.04);
  const termW = isVertical ? Math.round(vw * 0.22) : Math.round(vw * 0.16);
  const colW = isVertical ? Math.round(vw * 0.32) : Math.round(vw * 0.36);
  const rowH = isVertical ? Math.round(vh * 0.065) : Math.round(vh * 0.072);
  const headerH = isVertical ? Math.round(vh * 0.060) : Math.round(vh * 0.065);
  const startY = isVertical ? Math.round(vh * 0.15) : Math.round(vh * 0.14);
  const termX = pad;
  const mktgX = pad + termW + 12;
  const revopsX = mktgX + colW + 8;

  const termFontSize = isVertical ? 14 : 13;
  const cellFontSize = isVertical ? 12 : 11;
  const headerFontSize = isVertical ? 16 : 15;
  const punchFontSize = isVertical ? 20 : 17;

  // Headers spring
  const headerSp = spring({ frame: frame - HEADER_START, fps, config: { damping: 20, stiffness: 180 }, from: 0, to: 1 });
  const headerOpacity = clamp(headerSp, 0, 1);

  // Divider
  const dividerT = easeOut(progress(frame, DIVIDER_START, DIVIDER_START + 18));
  const divH = rowH * ROWS.length + headerH;

  // Zigzag divider path
  const divX = mktgX + colW + 4;
  const zigSize = isVertical ? 7 : 5;
  const zigCount = Math.round(divH / (zigSize * 2));
  let zigPath = `M ${divX} ${startY}`;
  for (let z = 0; z < zigCount; z++) {
    const direction = z % 2 === 0 ? 1 : -1;
    zigPath += ` l ${direction * zigSize * 0.8} ${zigSize * 2 / zigCount * divH / (zigSize * 2)}`;
  }
  const divPathLen = Math.sqrt(Math.pow(zigSize * 0.8 * zigCount, 2) + Math.pow(divH, 2)) * 1.1;

  return (
    <SceneFrame title="DEFINITIONS KNIFE FIGHT">
      <svg
        style={{ position: 'absolute', inset: 0 }}
        width={vw}
        height={vh}
        viewBox={`0 0 ${vw} ${vh}`}
      >
        {/* Column headers */}
        <g opacity={headerOpacity}>
          <text x={termX} y={startY + headerH * 0.65} fontFamily={fonts.mono} fontSize={headerFontSize} fontWeight={700} fill={colors.offWhite}>
            TERM
          </text>
          <text x={mktgX} y={startY + headerH * 0.65} fontFamily={fonts.mono} fontSize={headerFontSize} fontWeight={700} fill={colors.cyan}>
            MARKETING
          </text>
          <text x={revopsX} y={startY + headerH * 0.65} fontFamily={fonts.mono} fontSize={headerFontSize} fontWeight={700} fill={colors.magenta}>
            REV OPS
          </text>
          {/* Header separator line */}
          <line
            x1={pad}
            y1={startY + headerH}
            x2={vw - pad}
            y2={startY + headerH}
            stroke={colors.cyanStroke}
            strokeWidth={1}
            opacity={0.5}
          />
        </g>

        {/* Rows */}
        {ROWS.map((row, i) => {
          const rowStart = ROW_START + i * ROW_GAP;
          const sp = spring({ frame: frame - rowStart, fps, config: { damping: 18, stiffness: 200 }, from: 0, to: 1 });
          const opacity = clamp(sp, 0, 1);
          const ty = (1 - sp) * 8;
          const ry = startY + headerH + i * rowH;

          return (
            <g key={i} opacity={opacity} transform={`translateY(${ty})`}>
              <text x={termX} y={ry + rowH * 0.58} fontFamily={fonts.mono} fontSize={termFontSize} fontWeight={600} fill={colors.offWhite}>
                {row.term}
              </text>
              <text x={mktgX} y={ry + rowH * 0.58} fontFamily={fonts.mono} fontSize={cellFontSize} fill={colors.offWhite}>
                {row.mktg}
              </text>
              <text x={revopsX} y={ry + rowH * 0.58} fontFamily={fonts.mono} fontSize={cellFontSize} fill={colors.offWhite}>
                {row.revops}
              </text>
              {/* Row separator */}
              <line
                x1={pad}
                y1={ry + rowH}
                x2={vw - pad}
                y2={ry + rowH}
                stroke="rgba(255,255,255,0.12)"
                strokeWidth={0.5}
              />
            </g>
          );
        })}

        {/* Jagged divider line between columns */}
        <path
          d={zigPath}
          stroke={colors.magenta}
          strokeWidth={1.5}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={divPathLen}
          strokeDashoffset={divPathLen * (1 - dividerT)}
          opacity={dividerT}
        />

        {/* "Same word. Different number." */}
        {dividerT > 0.7 && (
          <text
            x={divX}
            y={startY + divH + 28}
            textAnchor="middle"
            fontFamily={fonts.handwritten}
            fontSize={punchFontSize}
            fontWeight={700}
            fill={colors.magenta}
            opacity={Math.min((dividerT - 0.7) / 0.3, 1)}
          >
            Same word. Different number.
          </text>
        )}
      </svg>
    </SceneFrame>
  );
};
