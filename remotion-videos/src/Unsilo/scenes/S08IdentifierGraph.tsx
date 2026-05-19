import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { SceneFrame } from '../components/SceneFrame';
import { Arrow } from '../components/Arrow';
import { colors, fonts, clamp, progress, easeOut } from '../theme';

// Scene 8 - The Identifier Graph
// Drawing order: 5 nodes -> edges with labels -> magenta drop-off annotation

const NODES = [
  { id: 'ANONYMOUS_ID', label: 'ANONYMOUS_ID' },
  { id: 'EMAIL', label: 'EMAIL (hashed)' },
  { id: 'CRM_CONTACT_ID', label: 'CRM_CONTACT_ID' },
  { id: 'STRIPE_CUSTOMER_ID', label: 'STRIPE_CUSTOMER_ID' },
  { id: 'APP_USER_ID', label: 'APP_USER_ID' },
];

const EDGES = [
  { from: 0, to: 1, label: 'identify() on login', breakPoint: false },
  { from: 1, to: 2, label: 'match on lowercase email', breakPoint: false },
  { from: 2, to: 3, label: 'field on contact', breakPoint: true },
  { from: 3, to: 4, label: 'metadata field', breakPoint: false },
];

const NODE_START = 5;
const NODE_GAP = 14;
const EDGE_START = 80;
const EDGE_GAP = 10;
const DROPOUT_START = 140;

export const S08IdentifierGraph: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const isVertical = height > width;
  const vw = width;
  const vh = height;

  const nodeR = isVertical ? Math.round(vw * 0.060) : Math.round(vh * 0.065);
  const nodeSpacing = isVertical ? Math.round(vh * 0.145) : Math.round(vh * 0.145);
  const startY = isVertical ? Math.round(vh * 0.18) : Math.round(vh * 0.16);
  const chainX = isVertical ? Math.round(vw * 0.30) : Math.round(vw * 0.25);

  const nodeFontSize = isVertical ? Math.round(vw * 0.022) : Math.round(vh * 0.018);
  const edgeFontSize = isVertical ? Math.round(vw * 0.020) : Math.round(vh * 0.017);
  const dropoutFontSize = isVertical ? Math.round(vw * 0.026) : Math.round(vh * 0.022);

  const nodePositions = NODES.map((_, i) => ({
    x: chainX,
    y: startY + i * nodeSpacing,
  }));

  const dropoutT = easeOut(progress(frame, DROPOUT_START, DROPOUT_START + 18));

  return (
    <SceneFrame title="IDENTIFIER GRAPH">
      <svg
        style={{ position: 'absolute', inset: 0 }}
        width={vw}
        height={vh}
        viewBox={`0 0 ${vw} ${vh}`}
      >
        {/* Edges */}
        {EDGES.map((edge, i) => {
          const p1 = nodePositions[edge.from];
          const p2 = nodePositions[edge.to];
          const edgeSp = spring({ frame: frame - (EDGE_START + i * EDGE_GAP), fps, config: { damping: 20, stiffness: 180 }, from: 0, to: 1 });
          const edgeOpacity = clamp(edgeSp, 0, 1);
          const midX = p1.x + nodeR + 6;
          const midY = (p1.y + p2.y) / 2;

          return (
            <g key={i} opacity={edgeOpacity}>
              <line
                x1={p1.x}
                y1={p1.y + nodeR}
                x2={p2.x}
                y2={p2.y - nodeR}
                stroke={colors.white}
                strokeWidth={1.5}
              />
              <text
                x={p1.x + nodeR + 10}
                y={midY + 4}
                fontFamily={fonts.handwritten}
                fontSize={edgeFontSize}
                fill={colors.offWhite}
              >
                {edge.label}
              </text>
            </g>
          );
        })}

        {/* Nodes */}
        {NODES.map((node, i) => {
          const pos = nodePositions[i];
          const nodeSp = spring({ frame: frame - (NODE_START + i * NODE_GAP), fps, config: { damping: 20, stiffness: 180 }, from: 0, to: 1 });
          const nodeOpacity = clamp(nodeSp, 0, 1);
          const nodeScale = 0.85 + nodeSp * 0.15;

          return (
            <g
              key={i}
              opacity={nodeOpacity}
              transform={`translate(${pos.x},${pos.y}) scale(${nodeScale}) translate(${-pos.x},${-pos.y})`}
            >
              <circle
                cx={pos.x}
                cy={pos.y}
                r={nodeR}
                stroke={colors.cyan}
                strokeWidth={1.5}
                fill={colors.cyanDim}
              />
              <text
                x={pos.x}
                y={pos.y + nodeFontSize * 0.35}
                textAnchor="middle"
                fontFamily={fonts.mono}
                fontSize={nodeFontSize}
                fontWeight={600}
                fill={colors.cyan}
              >
                {node.label.length > 14 ? node.label.substring(0, 13) + '...' : node.label}
              </text>
            </g>
          );
        })}

        {/* Dropout annotation - magenta dashed arrow at the CRM->Stripe edge */}
        {dropoutT > 0 && (
          <g opacity={dropoutT}>
            <line
              x1={chainX + nodeR + 8}
              y1={nodePositions[2].y + nodeSpacing * 0.5}
              x2={chainX + nodeR + 80}
              y2={nodePositions[2].y + nodeSpacing * 0.5}
              stroke={colors.magenta}
              strokeWidth={1.5}
              strokeDasharray="5 3"
            />
            <polygon
              points={`
                ${chainX + nodeR + 80},${nodePositions[2].y + nodeSpacing * 0.5}
                ${chainX + nodeR + 70},${nodePositions[2].y + nodeSpacing * 0.5 - 5}
                ${chainX + nodeR + 70},${nodePositions[2].y + nodeSpacing * 0.5 + 5}
              `}
              fill={colors.magenta}
            />
            <text
              x={chainX + nodeR + 90}
              y={nodePositions[2].y + nodeSpacing * 0.5 + 4}
              fontFamily={fonts.handwritten}
              fontSize={dropoutFontSize}
              fill={colors.magenta}
            >
              drop-off here = no LTV by channel
            </text>
          </g>
        )}
      </svg>
    </SceneFrame>
  );
};
