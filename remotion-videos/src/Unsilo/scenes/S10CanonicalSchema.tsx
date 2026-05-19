import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { SceneFrame } from '../components/SceneFrame';
import { colors, fonts, clamp, progress, easeOut } from '../theme';

// Scene 10 - Canonical Schema
// Drawing order: tables left-to-right -> annotation last

const TABLES = [
  {
    name: 'dim_customer',
    cols: ['customer_id', 'email_hash', 'first_touch_channel', 'lifetime_revenue'],
  },
  {
    name: 'fct_session',
    cols: ['session_id', 'anonymous_id', 'customer_id', 'source / medium'],
  },
  {
    name: 'fct_order',
    cols: ['order_id', 'customer_id', 'gross_revenue', 'cogs', 'channel'],
  },
  {
    name: 'fct_ad_spend',
    cols: ['date', 'platform', 'campaign_id', 'spend'],
  },
  {
    name: 'fct_touchpoint',
    cols: ['touchpoint_id', 'customer_id', 'channel / campaign', 'position_in_path'],
  },
];

const TABLE_START = 8;
const TABLE_GAP = 18;
const ANNOTATION_START = 140;

export const S10CanonicalSchema: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const isVertical = height > width;
  const vw = width;
  const vh = height;

  const pad = Math.round(vw * 0.03);
  const tableW = isVertical
    ? Math.round((vw - pad * 2) / 2 - 10)
    : Math.round((vw - pad * 2) / 5 - 8);
  const tableGapX = isVertical
    ? Math.round(vw * 0.04)
    : Math.round((vw - pad * 2 - tableW * 5) / 4);
  const headerH = isVertical ? Math.round(vh * 0.042) : Math.round(vh * 0.042);
  const colRowH = isVertical ? Math.round(vh * 0.032) : Math.round(vh * 0.030);

  const nameFontSize = isVertical ? Math.round(vw * 0.024) : Math.round(vh * 0.020);
  const colFontSize = isVertical ? Math.round(vw * 0.018) : Math.round(vh * 0.016);
  const annotFontSize = isVertical ? Math.round(vw * 0.038) : Math.round(vh * 0.030);

  const annotT = easeOut(progress(frame, ANNOTATION_START, ANNOTATION_START + 18));

  // For vertical: 2 cols of tables
  // For widescreen: 5 tables in a row
  const getTablePos = (i: number) => {
    if (isVertical) {
      const col = i % 2;
      const row = Math.floor(i / 2);
      return {
        x: pad + col * (tableW + tableGapX),
        y: Math.round(vh * 0.15) + row * (headerH + TABLES[0].cols.length * colRowH + 14),
      };
    }
    return {
      x: pad + i * (tableW + tableGapX),
      y: Math.round(vh * 0.18),
    };
  };

  return (
    <SceneFrame title="CANONICAL SCHEMA">
      <svg
        style={{ position: 'absolute', inset: 0 }}
        width={vw}
        height={vh}
        viewBox={`0 0 ${vw} ${vh}`}
      >
        {TABLES.map((table, i) => {
          const pos = getTablePos(i);
          const tableH = headerH + table.cols.length * colRowH;
          const tableSp = spring({ frame: frame - (TABLE_START + i * TABLE_GAP), fps, config: { damping: 20, stiffness: 160 }, from: 0, to: 1 });
          const tableOpacity = clamp(tableSp, 0, 1);
          const tableScale = 0.93 + tableSp * 0.07;
          const cx = pos.x + tableW / 2;
          const cy = pos.y + tableH / 2;

          return (
            <g
              key={i}
              opacity={tableOpacity}
              transform={`translate(${cx},${cy}) scale(${tableScale}) translate(${-cx},${-cy})`}
            >
              {/* Table border */}
              <rect
                x={pos.x}
                y={pos.y}
                width={tableW}
                height={tableH}
                rx={3}
                stroke={colors.cyan}
                strokeWidth={1.2}
                fill="none"
              />

              {/* Header */}
              <rect
                x={pos.x}
                y={pos.y}
                width={tableW}
                height={headerH}
                rx={3}
                fill={colors.cyan}
                fillOpacity={0.12}
              />
              <text
                x={pos.x + tableW / 2}
                y={pos.y + headerH * 0.65}
                textAnchor="middle"
                fontFamily={fonts.mono}
                fontSize={nameFontSize}
                fontWeight={700}
                fill={colors.cyan}
              >
                {table.name}
              </text>

              {/* Columns */}
              {table.cols.map((col, ci) => {
                const ry = pos.y + headerH + ci * colRowH;
                return (
                  <g key={ci}>
                    <line
                      x1={pos.x}
                      y1={ry}
                      x2={pos.x + tableW}
                      y2={ry}
                      stroke="rgba(255,255,255,0.10)"
                      strokeWidth={0.5}
                    />
                    <text
                      x={pos.x + 6}
                      y={ry + colRowH * 0.65}
                      fontFamily={fonts.mono}
                      fontSize={colFontSize}
                      fill={colors.offWhite}
                    >
                      {col}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Annotation */}
        <text
          x={vw / 2}
          y={isVertical ? vh * 0.87 : vh * 0.84}
          textAnchor="middle"
          fontFamily={fonts.handwritten}
          fontSize={annotFontSize}
          fontWeight={700}
          fill={colors.magenta}
          opacity={annotT}
          style={{ filter: `drop-shadow(0 0 12px rgba(255,0,255,0.4))` }}
        >
          5 tables. Every metric you need.
        </text>
      </svg>
    </SceneFrame>
  );
};
