import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate, Img, staticFile } from 'remotion';
import { SceneFrame } from '../components/SceneFrame';
import { TextReveal } from '../components/TextReveal';
import { colors, fonts, progress, easeOut, clamp } from '../theme';

// Scene 1 - The 5 Questions
// Drawing order: title -> questions 1 by 1 -> clock icon last
// 180 frames total: subtitle at 0, Q1-Q5 stagger at ~15f each, clock at frame 100+

const QUESTIONS = [
  'What was last week\'s blended MER?',
  'What did one customer cost last quarter?',
  'Which channel has the best contribution margin?',
  'What\'s CAC payback in months, by source?',
  'What % of MQLs actually closed?',
];

const Q_START = 20;
const Q_GAP = 18;

export const S01FiveQuestions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const isVertical = height > width;
  const vw = width;
  const vh = height;

  // Subtitle reveal
  const subtitleStart = 5;

  // Clock reveal
  const clockStart = 105;
  const clockT = easeOut(progress(frame, clockStart, clockStart + 20));

  // Clock hand animation
  const minHandAngle = interpolate(frame, [clockStart + 5, clockStart + 25], [0, 180], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const clockRadius = isVertical ? 50 : 40;
  const clockX = isVertical ? vw * 0.78 : vw * 0.88;
  const clockY = isVertical ? vh * 0.82 : vh * 0.78;

  const titleFontSize = isVertical ? Math.round(vw * 0.10) : Math.round(vh * 0.07);
  const subtitleSize = isVertical ? Math.round(vw * 0.034) : Math.round(vh * 0.026);
  const qFontSize = isVertical ? Math.round(vw * 0.038) : Math.round(vh * 0.030);
  const numberFontSize = isVertical ? Math.round(vw * 0.042) : Math.round(vh * 0.032);

  const leftPad = Math.round(vw * 0.04);
  const topStart = isVertical ? Math.round(vh * 0.18) : Math.round(vh * 0.19);
  const qLineHeight = isVertical ? Math.round(vh * 0.072) : Math.round(vh * 0.072);

  return (
    <SceneFrame title="5 QUESTIONS">
      {/* Subtitle */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
        }}
      >
        <TextReveal
          text="If you can't answer these in 60 seconds, you're flying blind."
          startFrame={subtitleStart}
          framesPerWord={4}
          style={{
            fontFamily: fonts.mono,
            fontSize: subtitleSize,
            color: colors.offWhite,
            lineHeight: 1.4,
            display: 'block',
          }}
        />
      </div>

      {/* Questions */}
      <div
        style={{
          position: 'absolute',
          top: isVertical ? Math.round(vh * 0.08) : Math.round(vh * 0.09),
          left: 0,
          right: isVertical ? Math.round(vw * 0.12) : Math.round(vw * 0.15),
        }}
      >
        {QUESTIONS.map((q, i) => {
          const qFrame = Q_START + i * Q_GAP;
          const sp = spring({
            frame: frame - qFrame,
            fps,
            config: { damping: 18, stiffness: 200, mass: 0.6 },
            from: 0,
            to: 1,
          });
          const opacity = clamp(sp, 0, 1);
          const ty = (1 - sp) * 10;

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                marginBottom: isVertical ? Math.round(vh * 0.022) : Math.round(vh * 0.020),
                opacity,
                transform: `translateY(${ty}px)`,
              }}
            >
              <span
                style={{
                  fontFamily: fonts.mono,
                  fontSize: numberFontSize,
                  fontWeight: 700,
                  color: colors.cyan,
                  minWidth: isVertical ? 34 : 28,
                  lineHeight: 1.3,
                  flexShrink: 0,
                }}
              >
                {i + 1}.
              </span>
              <span
                style={{
                  fontFamily: fonts.mono,
                  fontSize: qFontSize,
                  color: colors.offWhite,
                  lineHeight: 1.35,
                }}
              >
                {q}
              </span>
            </div>
          );
        })}
      </div>

      {/* Clock icon - bottom right */}
      <svg
        style={{
          position: 'absolute',
          right: isVertical ? Math.round(vw * 0.04) : Math.round(vw * 0.02),
          bottom: isVertical ? Math.round(vh * 0.04) : Math.round(vh * 0.05),
          opacity: clockT,
          transform: `scale(${0.8 + clockT * 0.2})`,
        }}
        width={clockRadius * 2 + 20}
        height={clockRadius * 2 + 36}
        viewBox={`0 0 ${clockRadius * 2 + 20} ${clockRadius * 2 + 36}`}
      >
        {/* Clock circle */}
        <circle
          cx={clockRadius + 10}
          cy={clockRadius + 4}
          r={clockRadius}
          stroke={colors.magenta}
          strokeWidth={2}
          fill="none"
        />
        {/* Hour hand - pointing up */}
        <line
          x1={clockRadius + 10}
          y1={clockRadius + 4}
          x2={clockRadius + 10}
          y2={8}
          stroke={colors.magenta}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        {/* Minute hand - sweeping */}
        <line
          x1={clockRadius + 10}
          y1={clockRadius + 4}
          x2={clockRadius + 10 + Math.sin((minHandAngle * Math.PI) / 180) * (clockRadius - 6)}
          y2={clockRadius + 4 - Math.cos((minHandAngle * Math.PI) / 180) * (clockRadius - 6)}
          stroke={colors.magenta}
          strokeWidth={2}
          strokeLinecap="round"
        />
        {/* "60 sec" label */}
        <text
          x={clockRadius + 10}
          y={clockRadius * 2 + 28}
          textAnchor="middle"
          fontFamily={fonts.handwritten}
          fontSize={16}
          fontWeight={600}
          fill={colors.magenta}
        >
          60 sec
        </text>
      </svg>
    </SceneFrame>
  );
};
