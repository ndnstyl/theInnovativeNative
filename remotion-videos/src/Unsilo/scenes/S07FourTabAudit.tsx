import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { SceneFrame } from '../components/SceneFrame';
import { colors, fonts, clamp, progress, easeOut } from '../theme';

// Scene 7 - The 4-Tab Audit
// Drawing order: annotation -> tabs -> header row -> data rows

const TABS = ['TOOLS', 'FLOWS', 'IDENTIFIERS', 'DEFINITIONS'];
const HEADERS = ['Name', 'Owner', 'Cost/mo', 'Has API?', 'In Warehouse?'];
const ROWS = [
  ['HubSpot', 'Sarah K', '$1,200', 'Yes', 'No'],
  ['GA4', 'Marcus T', '$0', 'Yes (BQ)', 'Yes'],
  ['Klaviyo', 'Sarah K', '$300', 'Yes', 'No'],
  ['...', '', '', '', ''],
];

const ANNOTATION_START = 5;
const TABS_START = 25;
const HEADER_START = 50;
const ROW_START = 68;
const ROW_GAP = 14;

export const S07FourTabAudit: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const isVertical = height > width;
  const vw = width;
  const vh = height;

  const pad = Math.round(vw * 0.04);
  const sheetX = pad;
  const sheetY = isVertical ? Math.round(vh * 0.20) : Math.round(vh * 0.18);
  const sheetW = vw - pad * 2;
  const tabH = isVertical ? Math.round(vh * 0.052) : Math.round(vh * 0.055);
  const rowH = isVertical ? Math.round(vh * 0.060) : Math.round(vh * 0.062);
  const colW = Math.round(sheetW / HEADERS.length);

  // Annotation spring
  const annotSp = spring({ frame: frame - ANNOTATION_START, fps, config: { damping: 20, stiffness: 160 }, from: 0, to: 1 });
  const annotOpacity = clamp(annotSp, 0, 1);
  const annotTy = (1 - annotSp) * 10;

  // Header spring
  const headerSp = spring({ frame: frame - HEADER_START, fps, config: { damping: 18, stiffness: 200 }, from: 0, to: 1 });
  const headerOpacity = clamp(headerSp, 0, 1);

  const annotFontSize = isVertical ? Math.round(vw * 0.036) : Math.round(vh * 0.030);
  const tabFontSize = isVertical ? Math.round(vw * 0.026) : Math.round(vh * 0.022);
  const headerFontSize = isVertical ? Math.round(vw * 0.022) : Math.round(vh * 0.020);
  const cellFontSize = isVertical ? Math.round(vw * 0.020) : Math.round(vh * 0.018);

  return (
    <SceneFrame title="THE 4-TAB AUDIT">
      <svg
        style={{ position: 'absolute', inset: 0 }}
        width={vw}
        height={vh}
        viewBox={`0 0 ${vw} ${vh}`}
      >
        {/* Annotation */}
        <text
          x={vw / 2}
          y={isVertical ? vh * 0.14 : vh * 0.13}
          textAnchor="middle"
          fontFamily={fonts.handwritten}
          fontSize={annotFontSize}
          fontWeight={700}
          fill={colors.white}
          opacity={annotOpacity}
          transform={`translate(0, ${annotTy})`}
        >
          If it's not on one of these tabs, it isn't real.
        </text>

        {/* Tabs */}
        {TABS.map((tab, i) => {
          const isActive = i === 0;
          const tabSp = spring({ frame: frame - (TABS_START + i * 8), fps, config: { damping: 20, stiffness: 180 }, from: 0, to: 1 });
          const tabOpacity = clamp(tabSp, 0, 1);
          const tabW = Math.round(sheetW / TABS.length);
          const tx = sheetX + i * tabW;
          const ty = sheetY - tabH;

          return (
            <g key={i} opacity={tabOpacity}>
              <rect
                x={tx + 1}
                y={ty}
                width={tabW - 2}
                height={tabH}
                rx={isActive ? 0 : 3}
                fill={isActive ? colors.cyan : 'none'}
                fillOpacity={isActive ? 0.18 : 0}
                stroke={colors.cyan}
                strokeWidth={1.2}
                strokeDasharray={isActive ? 'none' : '5 3'}
              />
              <text
                x={tx + tabW / 2}
                y={ty + tabH * 0.65}
                textAnchor="middle"
                fontFamily={fonts.mono}
                fontSize={tabFontSize}
                fontWeight={isActive ? 700 : 400}
                fill={isActive ? colors.cyan : colors.offWhite}
              >
                {tab}
              </text>
            </g>
          );
        })}

        {/* Sheet border */}
        <rect
          x={sheetX}
          y={sheetY}
          width={sheetW}
          height={rowH * (ROWS.length + 1)}
          rx={0}
          stroke={colors.cyanStroke}
          strokeWidth={1.2}
          fill="none"
          opacity={0.5}
        />

        {/* Header row */}
        <g opacity={headerOpacity}>
          <rect x={sheetX} y={sheetY} width={sheetW} height={rowH} fill={colors.cyan} fillOpacity={0.10} />
          {HEADERS.map((h, i) => (
            <text
              key={i}
              x={sheetX + i * colW + colW * 0.5}
              y={sheetY + rowH * 0.62}
              textAnchor="middle"
              fontFamily={fonts.mono}
              fontSize={headerFontSize}
              fontWeight={700}
              fill={colors.cyan}
            >
              {h}
            </text>
          ))}
        </g>

        {/* Data rows */}
        {ROWS.map((row, ri) => {
          const rowSp = spring({ frame: frame - (ROW_START + ri * ROW_GAP), fps, config: { damping: 18, stiffness: 200 }, from: 0, to: 1 });
          const rowOpacity = clamp(rowSp, 0, 1);
          const ry = sheetY + (ri + 1) * rowH;
          const isEllipsis = ri === ROWS.length - 1;

          return (
            <g key={ri} opacity={rowOpacity}>
              <line x1={sheetX} y1={ry} x2={sheetX + sheetW} y2={ry} stroke="rgba(255,255,255,0.12)" strokeWidth={0.5} />
              {row.map((cell, ci) => (
                <text
                  key={ci}
                  x={sheetX + ci * colW + colW * 0.5}
                  y={ry + rowH * 0.62}
                  textAnchor="middle"
                  fontFamily={isEllipsis ? fonts.handwritten : fonts.mono}
                  fontSize={isEllipsis ? cellFontSize * 1.4 : cellFontSize}
                  fill={colors.offWhite}
                >
                  {cell}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
    </SceneFrame>
  );
};
