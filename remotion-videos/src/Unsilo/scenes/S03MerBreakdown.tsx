import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { SceneFrame } from '../components/SceneFrame';
import { colors, fonts, clamp, progress, easeOut } from '../theme';

// Scene 3 - MER Formula Breakdown
// Drawing order: formula -> revenue question marks -> spend question marks -> bottom punch line

const REV_ITEMS = ['Stripe?', 'Shopify?', 'Refunds?', 'Chargebacks?', 'Trial conversions?', 'First-paid invoice?'];
const SPEND_ITEMS = ['Just paid media?', 'Tool subs?', 'Salaries?', 'Agency fees?', 'Sales comp?'];

const FORMULA_START = 8;
const REV_START = 40;
const SPEND_START = 80;
const PUNCH_START = 130;

export const S03MerBreakdown: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = height > width;

  const formulaFontSize = isVertical ? Math.round(width * 0.065) : Math.round(height * 0.06);
  const itemFontSize = isVertical ? Math.round(width * 0.030) : Math.round(height * 0.026);
  const punchFontSize = isVertical ? Math.round(width * 0.048) : Math.round(height * 0.038);

  // Formula spring
  const formulaSp = spring({ frame: frame - FORMULA_START, fps, config: { damping: 20, stiffness: 160 }, from: 0, to: 1 });
  const formulaOpacity = clamp(formulaSp, 0, 1);
  const formulaTy = (1 - formulaSp) * 14;

  // Punch spring
  const punchSp = spring({ frame: frame - PUNCH_START, fps, config: { damping: 16, stiffness: 180 }, from: 0, to: 1 });
  const punchOpacity = clamp(punchSp, 0, 1);
  const punchTy = (1 - punchSp) * 12;

  const colW = isVertical ? width * 0.42 : width * 0.36;
  const colGap = isVertical ? width * 0.10 : width * 0.22;

  return (
    <SceneFrame title="MER BREAKDOWN">
      {/* Formula */}
      <div
        style={{
          position: 'absolute',
          top: isVertical ? '5%' : '3%',
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: formulaOpacity,
          transform: `translateY(${formulaTy}px)`,
        }}
      >
        <span
          style={{
            fontFamily: fonts.handwritten,
            fontSize: formulaFontSize,
            fontWeight: 700,
            color: colors.white,
            whiteSpace: 'nowrap',
          }}
        >
          MER = Total Revenue / Total Marketing Spend
        </span>
      </div>

      {/* Two columns of question items */}
      <div
        style={{
          position: 'absolute',
          top: isVertical ? '20%' : '22%',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-around',
        }}
      >
        {/* Revenue column */}
        <div style={{ width: colW }}>
          <div
            style={{
              fontFamily: fonts.mono,
              fontSize: itemFontSize * 1.1,
              fontWeight: 700,
              color: colors.offWhite,
              marginBottom: 6,
              textDecoration: 'underline',
              textDecorationColor: colors.cyanStroke,
            }}
          >
            Total Revenue
          </div>
          {REV_ITEMS.map((item, i) => {
            const sp = spring({ frame: frame - (REV_START + i * 8), fps, config: { damping: 18, stiffness: 200 }, from: 0, to: 1 });
            const opacity = clamp(sp, 0, 1);
            const ty = (1 - sp) * 6;
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginBottom: isVertical ? Math.round(height * 0.012) : Math.round(height * 0.010),
                  opacity,
                  transform: `translateY(${ty}px)`,
                }}
              >
                <span
                  style={{
                    fontFamily: fonts.mono,
                    fontSize: itemFontSize,
                    color: colors.offWhite,
                  }}
                >
                  {item}
                </span>
                <span
                  style={{
                    fontFamily: fonts.handwritten,
                    fontSize: itemFontSize * 1.2,
                    color: colors.magenta,
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  ?
                </span>
              </div>
            );
          })}
        </div>

        {/* Spend column */}
        <div style={{ width: colW }}>
          <div
            style={{
              fontFamily: fonts.mono,
              fontSize: itemFontSize * 1.1,
              fontWeight: 700,
              color: colors.offWhite,
              marginBottom: 6,
              textDecoration: 'underline',
              textDecorationColor: colors.cyanStroke,
            }}
          >
            Total Marketing Spend
          </div>
          {SPEND_ITEMS.map((item, i) => {
            const sp = spring({ frame: frame - (SPEND_START + i * 8), fps, config: { damping: 18, stiffness: 200 }, from: 0, to: 1 });
            const opacity = clamp(sp, 0, 1);
            const ty = (1 - sp) * 6;
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginBottom: isVertical ? Math.round(height * 0.012) : Math.round(height * 0.010),
                  opacity,
                  transform: `translateY(${ty}px)`,
                }}
              >
                <span
                  style={{
                    fontFamily: fonts.mono,
                    fontSize: itemFontSize,
                    color: colors.offWhite,
                  }}
                >
                  {item}
                </span>
                <span
                  style={{
                    fontFamily: fonts.handwritten,
                    fontSize: itemFontSize * 1.2,
                    color: colors.magenta,
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  ?
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Punch line */}
      <div
        style={{
          position: 'absolute',
          bottom: isVertical ? '5%' : '6%',
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: punchOpacity,
          transform: `translateY(${punchTy}px)`,
        }}
      >
        <span
          style={{
            fontFamily: fonts.handwritten,
            fontSize: punchFontSize,
            fontWeight: 700,
            color: colors.magenta,
            textShadow: '0 0 20px rgba(255,0,255,0.4)',
          }}
        >
          3 different MERs from same week.
        </span>
      </div>
    </SceneFrame>
  );
};
