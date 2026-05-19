import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { SceneFrame } from '../components/SceneFrame';
import { Arrow } from '../components/Arrow';
import { colors, fonts, clamp, progress, easeOut } from '../theme';

// Scene 4 - ROAS Over-attribution
// Drawing order: bottom box (truth) -> three platform boxes -> arrows -> labels -> magenta $300 punch

const BOX_START = 5;
const PLATFORMS_START = 25;
const ARROWS_START = 75;
const LABELS_START = 95;
const PUNCH_START = 130;

const PLATFORMS = ['META', 'GOOGLE', 'YOUTUBE'];

export const S04RoasOverAttr: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const isVertical = height > width;
  const vw = width;
  const vh = height;

  const boxW = isVertical ? Math.round(vw * 0.22) : Math.round(vw * 0.16);
  const boxH = isVertical ? Math.round(vh * 0.10) : Math.round(vh * 0.14);
  const topY = isVertical ? Math.round(vh * 0.22) : Math.round(vh * 0.18);
  const bottomY = isVertical ? Math.round(vh * 0.62) : Math.round(vh * 0.58);
  const platformGap = isVertical ? Math.round(vw * 0.26) : Math.round(vw * 0.19);
  const platformStart = vw / 2 - platformGap;

  // Bottom (truth) box spring
  const bottomSp = spring({ frame: frame - BOX_START, fps, config: { damping: 20, stiffness: 160 }, from: 0, to: 1 });
  const bottomOpacity = clamp(bottomSp, 0, 1);
  const bottomScale = 0.92 + bottomSp * 0.08;
  const bottomCX = vw / 2;
  const bottomCY = bottomY + boxH / 2;

  // Punch spring
  const punchSp = spring({ frame: frame - PUNCH_START, fps, config: { damping: 16, stiffness: 200 }, from: 0, to: 1 });
  const punchOpacity = clamp(punchSp, 0, 1);

  const labelFontSize = isVertical ? Math.round(vw * 0.032) : Math.round(vh * 0.028);
  const subFontSize = isVertical ? Math.round(vw * 0.024) : Math.round(vh * 0.022);
  const punchFontSize = isVertical ? Math.round(vw * 0.048) : Math.round(vh * 0.042);
  const realFontSize = isVertical ? Math.round(vw * 0.042) : Math.round(vh * 0.036);

  return (
    <SceneFrame title="ROAS OVER-ATTRIBUTION">
      <svg
        style={{ position: 'absolute', inset: 0 }}
        width={vw}
        height={vh}
        viewBox={`0 0 ${vw} ${vh}`}
      >
        {/* Bottom box - ACTUAL SALE (truth) */}
        <g
          opacity={bottomOpacity}
          transform={`translate(${bottomCX},${bottomCY}) scale(${bottomScale}) translate(${-bottomCX},${-bottomCY})`}
        >
          <rect
            x={bottomCX - boxW / 2}
            y={bottomY}
            width={boxW}
            height={boxH}
            rx={4}
            stroke={colors.cyan}
            strokeWidth={2}
            fill="none"
          />
          <text x={bottomCX} y={bottomY + boxH * 0.42} textAnchor="middle" fontFamily={fonts.mono} fontSize={labelFontSize} fontWeight={700} fill={colors.cyan}>
            ACTUAL SALE
          </text>
          <text x={bottomCX} y={bottomY + boxH * 0.72} textAnchor="middle" fontFamily={fonts.mono} fontSize={subFontSize} fill={colors.offWhite}>
            $100
          </text>
        </g>

        {/* Platform boxes */}
        {PLATFORMS.map((plat, i) => {
          const px = platformStart + i * platformGap;
          const platSp = spring({ frame: frame - (PLATFORMS_START + i * 12), fps, config: { damping: 20, stiffness: 160 }, from: 0, to: 1 });
          const platOpacity = clamp(platSp, 0, 1);
          const platScale = 0.92 + platSp * 0.08;
          const pcx = px;
          const pcy = topY + boxH / 2;

          return (
            <g key={i} opacity={platOpacity} transform={`translate(${pcx},${pcy}) scale(${platScale}) translate(${-pcx},${-pcy})`}>
              <rect
                x={px - boxW / 2}
                y={topY}
                width={boxW}
                height={boxH}
                rx={4}
                stroke={colors.magentaStroke}
                strokeWidth={1.5}
                fill={colors.magenta}
                fillOpacity={0.08}
              />
              <text x={px} y={topY + boxH * 0.42} textAnchor="middle" fontFamily={fonts.mono} fontSize={labelFontSize} fontWeight={700} fill={colors.offWhite}>
                {plat}
              </text>
              <text x={px} y={topY + boxH * 0.72} textAnchor="middle" fontFamily={fonts.mono} fontSize={subFontSize} fill={colors.dimWhite}>
                claims $100
              </text>
            </g>
          );
        })}

        {/* Arrows from each platform to actual sale */}
        {PLATFORMS.map((_, i) => {
          const px = platformStart + i * platformGap;
          return (
            <Arrow
              key={i}
              x1={px}
              y1={topY + boxH}
              x2={bottomCX + (px - bottomCX) * 0.15}
              y2={bottomY - 4}
              startFrame={ARROWS_START + i * 8}
              durationFrames={12}
              stroke={colors.magentaStroke}
              strokeWidth={1.5}
              curved
            />
          );
        })}

        {/* "$300 reported" label */}
        {punchOpacity > 0 && (
          <g opacity={punchOpacity}>
            <text
              x={vw * 0.78}
              y={topY + boxH * 0.6}
              textAnchor="start"
              fontFamily={fonts.handwritten}
              fontSize={punchFontSize}
              fontWeight={700}
              fill={colors.magenta}
              style={{ filter: 'drop-shadow(0 0 12px rgba(255,0,255,0.5))' }}
            >
              = $300 reported
            </text>
          </g>
        )}

        {/* "$100 real" label */}
        {frame > LABELS_START && (
          <g opacity={clamp(easeOut(progress(frame, LABELS_START, LABELS_START + 12)), 0, 1)}>
            <text
              x={vw * 0.64}
              y={bottomY + boxH * 0.6}
              textAnchor="start"
              fontFamily={fonts.handwritten}
              fontSize={realFontSize}
              fontWeight={700}
              fill={colors.cyan}
            >
              = $100 real
            </text>
          </g>
        )}
      </svg>
    </SceneFrame>
  );
};
