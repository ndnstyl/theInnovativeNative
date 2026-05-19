import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { SceneFrame } from '../components/SceneFrame';
import { colors, fonts, clamp, progress, easeOut } from '../theme';

// Scene 9 - The 5-Layer Spine
// Drawing order: CAPTURE (bottom) -> stack up -> arrows between -> annotation last

const LAYERS = [
  { name: 'CAPTURE', tools: 'Segment / Rudderstack / sGTM', accent: false },
  { name: 'WAREHOUSE', tools: 'BigQuery / Snowflake / Postgres', accent: true },
  { name: 'INGEST', tools: 'Fivetran / Airbyte / n8n', accent: false },
  { name: 'MODEL', tools: 'dbt / SQLMesh / SQL views', accent: false },
  { name: 'ACTIVATE', tools: 'Hightouch / Census / n8n', accent: false },
];

const LAYER_START = 8;
const LAYER_GAP = 16;
const ARROW_START = 100;
const ANNOTATION_START = 140;

export const S09FiveLayerSpine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const isVertical = height > width;
  const vw = width;
  const vh = height;

  const pad = Math.round(vw * 0.05);
  const layerW = isVertical ? vw - pad * 2 : Math.round(vw * 0.60);
  const layerH = isVertical ? Math.round(vh * 0.085) : Math.round(vh * 0.088);
  const layerGap = isVertical ? Math.round(vh * 0.010) : Math.round(vh * 0.008);
  const totalH = LAYERS.length * layerH + (LAYERS.length - 1) * layerGap;
  const startX = pad;
  const startY = isVertical ? Math.round(vh * 0.5 - totalH / 2 + vh * 0.08) : Math.round(vh * 0.5 - totalH / 2 + vh * 0.05);

  const nameFontSize = isVertical ? Math.round(vw * 0.032) : Math.round(vh * 0.030);
  const toolsFontSize = isVertical ? Math.round(vw * 0.022) : Math.round(vh * 0.020);
  const annotFontSize = isVertical ? Math.round(vw * 0.030) : Math.round(vh * 0.026);
  const arrowSize = isVertical ? 10 : 8;

  const annotT = easeOut(progress(frame, ANNOTATION_START, ANNOTATION_START + 18));

  // Layers draw from bottom (index 0) to top (index 4)
  return (
    <SceneFrame title="THE 5-LAYER SPINE">
      <svg
        style={{ position: 'absolute', inset: 0 }}
        width={vw}
        height={vh}
        viewBox={`0 0 ${vw} ${vh}`}
      >
        {LAYERS.map((layer, i) => {
          // Draw bottom-first: layer 0 is CAPTURE (bottom), layer 4 is ACTIVATE (top)
          // Display order: ACTIVATE at top, so flip vertically for render
          const displayIndex = LAYERS.length - 1 - i;
          const ly = startY + displayIndex * (layerH + layerGap);
          const lx = startX;
          const cx = lx + layerW / 2;
          const cy = ly + layerH / 2;

          const layerSp = spring({ frame: frame - (LAYER_START + i * LAYER_GAP), fps, config: { damping: 20, stiffness: 160 }, from: 0, to: 1 });
          const layerOpacity = clamp(layerSp, 0, 1);
          const layerScale = 0.93 + layerSp * 0.07;

          // Arrow between layers (upward between displayIndex and displayIndex-1)
          const showArrow = displayIndex > 0;
          const arrowStartFrame = ARROW_START + (LAYERS.length - 2 - i) * 6;
          const arrowT = easeOut(progress(frame, arrowStartFrame, arrowStartFrame + 10));

          return (
            <g key={i}>
              {/* Layer rectangle */}
              <g
                opacity={layerOpacity}
                transform={`translate(${cx},${cy}) scale(${layerScale}) translate(${-cx},${-cy})`}
              >
                <rect
                  x={lx}
                  y={ly}
                  width={layerW}
                  height={layerH}
                  rx={4}
                  stroke={colors.cyan}
                  strokeWidth={layer.accent ? 2.5 : 1.5}
                  fill={layer.accent ? colors.cyan : 'none'}
                  fillOpacity={layer.accent ? 0.12 : 0}
                />
                <text
                  x={cx}
                  y={cy - toolsFontSize * 0.5}
                  textAnchor="middle"
                  fontFamily={fonts.mono}
                  fontSize={nameFontSize}
                  fontWeight={700}
                  fill={colors.cyan}
                >
                  {layer.name}
                </text>
                <text
                  x={cx}
                  y={cy + nameFontSize * 0.7}
                  textAnchor="middle"
                  fontFamily={fonts.mono}
                  fontSize={toolsFontSize}
                  fill={colors.dimWhite}
                >
                  {layer.tools}
                </text>
              </g>

              {/* Upward arrow between layers */}
              {showArrow && arrowT > 0 && (
                <g opacity={arrowT}>
                  {/* Arrow shaft */}
                  <line
                    x1={cx}
                    y1={ly - layerGap}
                    x2={cx}
                    y2={ly}
                    stroke={colors.cyan}
                    strokeWidth={1.5}
                    strokeDasharray={`${layerGap}`}
                    strokeDashoffset={layerGap * (1 - arrowT)}
                  />
                  {/* Arrowhead pointing up */}
                  {arrowT > 0.8 && (
                    <polygon
                      points={`${cx},${ly - layerGap - arrowSize} ${cx - arrowSize * 0.5},${ly - layerGap} ${cx + arrowSize * 0.5},${ly - layerGap}`}
                      fill={colors.cyan}
                      opacity={Math.min((arrowT - 0.8) / 0.2, 1)}
                    />
                  )}
                </g>
              )}
            </g>
          );
        })}

        {/* Annotation - magenta, right side, aligned to WAREHOUSE */}
        {annotT > 0 && (
          <text
            x={startX + layerW + 16}
            y={startY + (LAYERS.length - 2) * (layerH + layerGap) + layerH / 2 + annotFontSize * 0.35}
            fontFamily={fonts.handwritten}
            fontSize={annotFontSize}
            fontWeight={700}
            fill={colors.magenta}
            opacity={annotT}
          >
            The one place everyone reads from.
          </text>
        )}
      </svg>
    </SceneFrame>
  );
};
