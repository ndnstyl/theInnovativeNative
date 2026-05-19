import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { SceneFrame } from '../components/SceneFrame';
import { Card } from '../components/Card';
import { Arrow } from '../components/Arrow';
import { colors, fonts, progress, easeOut, clamp } from '../theme';

// Scene 2 - The Stack Map
// Drawing order: customer circle -> 6 rectangles (clockwise) -> arrows -> magenta fence

const ZONES = [
  { label: 'PAID MEDIA', sublabel: 'Meta, Google, LinkedIn, TikTok, X, Pinterest, Reddit', angle: 90 },
  { label: 'WEB ANALYTICS', sublabel: 'GA4, Mixpanel, Amplitude, Heap, PostHog', angle: 30 },
  { label: 'CRM + AUTOMATION', sublabel: 'HubSpot, Salesforce, Marketo, ActiveCampaign', angle: -30 },
  { label: 'EMAIL + SMS', sublabel: 'Klaviyo, Mailchimp, Postmark, Attentive', angle: -90 },
  { label: 'ATTRIBUTION', sublabel: 'Triple Whale, Northbeam, Rockerbox', angle: -150 },
  { label: 'REVENUE LAYER', sublabel: 'Stripe, Shopify, Recurly', angle: 150 },
];

const ZONE_START = 20;
const ZONE_GAP = 12;
const ARROW_START = 95;
const FENCE_START = 125;

export const S02StackMap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const isVertical = height > width;
  const cx = width / 2;
  const cy = height / 2;
  const orbitR = isVertical ? Math.round(width * 0.31) : Math.round(height * 0.30);
  const boxW = isVertical ? Math.round(width * 0.30) : Math.round(width * 0.18);
  const boxH = isVertical ? Math.round(height * 0.075) : Math.round(height * 0.11);
  const customerR = isVertical ? Math.round(width * 0.07) : Math.round(height * 0.07);

  // Customer circle spring
  const custSp = spring({ frame: frame - 5, fps, config: { damping: 18, stiffness: 200 }, from: 0, to: 1 });
  const custOpacity = clamp(custSp, 0, 1);
  const custScale = 0.85 + custSp * 0.15;

  // Fence reveal
  const fenceT = easeOut(progress(frame, FENCE_START, FENCE_START + 22));
  const fencePerim = (orbitR + boxW * 0.6) * 2 * Math.PI;

  return (
    <SceneFrame title="THE STACK MAP">
      <svg
        style={{ position: 'absolute', inset: 0 }}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        overflow="visible"
      >
        {/* Magenta fence - dashed circle wrapping all 6 zones */}
        <circle
          cx={cx}
          cy={cy}
          r={orbitR + boxW * 0.62}
          stroke={colors.magenta}
          strokeWidth={1.5}
          strokeDasharray={`${fencePerim * 0.05} ${fencePerim * 0.025}`}
          fill="none"
          opacity={fenceT}
        />

        {/* Fence label */}
        {fenceT > 0.6 && (
          <text
            x={cx}
            y={cy - orbitR - boxW * 0.7}
            textAnchor="middle"
            fontFamily={fonts.handwritten}
            fontSize={isVertical ? 20 : 16}
            fill={colors.magenta}
            opacity={Math.min((fenceT - 0.6) / 0.4, 1)}
          >
            24+ silos. None talk to each other by default.
          </text>
        )}

        {/* Zone cards + arrows */}
        {ZONES.map((zone, i) => {
          const rad = (zone.angle * Math.PI) / 180;
          const bx = cx + Math.cos(rad) * orbitR - boxW / 2;
          const by = cy - Math.sin(rad) * orbitR - boxH / 2;
          const cardStart = ZONE_START + i * ZONE_GAP;

          // Arrow from box edge toward customer
          const edgeFactor = 0.5;
          const ax1 = bx + boxW / 2 + Math.cos(rad + Math.PI) * boxW * edgeFactor;
          const ay1 = by + boxH / 2 - Math.sin(rad + Math.PI) * boxH * edgeFactor;
          const ax2 = cx + Math.cos(rad + Math.PI) * (customerR + 4);
          const ay2 = cy - Math.sin(rad + Math.PI) * (customerR + 4);

          return (
            <g key={i}>
              <Card
                x={bx}
                y={by}
                width={boxW}
                height={boxH}
                label={zone.label}
                sublabel={zone.sublabel}
                startFrame={cardStart}
                strokeColor={colors.white}
                fontSize={isVertical ? 12 : 11}
                sublabelFontSize={isVertical ? 9 : 8}
                sublabelColor={colors.dimWhite}
              />
              <Arrow
                x1={ax1}
                y1={ay1}
                x2={ax2}
                y2={ay2}
                startFrame={ARROW_START + i * 4}
                durationFrames={10}
                stroke={colors.cyanStroke}
                strokeWidth={1.2}
                curved
              />
            </g>
          );
        })}

        {/* Customer circle */}
        <g
          opacity={custOpacity}
          transform={`translate(${cx},${cy}) scale(${custScale}) translate(${-cx},${-cy})`}
        >
          <circle
            cx={cx}
            cy={cy}
            r={customerR}
            stroke={colors.cyan}
            strokeWidth={2}
            strokeDasharray="6 4"
            fill="none"
          />
          <text
            x={cx}
            y={cy + 5}
            textAnchor="middle"
            fontFamily={fonts.mono}
            fontSize={isVertical ? 11 : 10}
            fontWeight={700}
            fill={colors.cyan}
          >
            ONE
          </text>
          <text
            x={cx}
            y={cy + 18}
            textAnchor="middle"
            fontFamily={fonts.mono}
            fontSize={isVertical ? 11 : 10}
            fontWeight={700}
            fill={colors.cyan}
          >
            CUSTOMER
          </text>
        </g>
      </svg>
    </SceneFrame>
  );
};
