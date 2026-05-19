import React from 'react';
import { useVideoConfig } from 'remotion';
import { colors, typography, fonts } from '../theme';

interface SceneFrameProps {
  title: string;
  children: React.ReactNode;
  footerLabel?: string;
}

/**
 * SceneFrame - shared layout shell for every Unsilo scene.
 * Transparent background (no AbsoluteFill fill color) so it composites
 * cleanly over face-cam B-roll footage.
 */
export const SceneFrame: React.FC<SceneFrameProps> = ({
  title,
  children,
  footerLabel = 'THE INNOVATIVE NATIVE',
}) => {
  const { width, height } = useVideoConfig();

  const pad = Math.round(width * 0.03);
  const titleSize = Math.round(Math.min(width, height) * 0.045);

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        overflow: 'hidden',
        background: 'transparent',
        boxSizing: 'border-box',
      }}
    >
      {/* Subtle dark panel behind content area so text stays legible over footage */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.72) 40%, rgba(0,0,0,0.45) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Scene title - top-left */}
      <div
        style={{
          position: 'absolute',
          top: pad,
          left: pad,
          fontFamily: fonts.handwritten,
          fontSize: titleSize,
          fontWeight: 700,
          color: colors.cyan,
          letterSpacing: '0.02em',
          textShadow: '0 0 24px rgba(0,255,255,0.5)',
          zIndex: 10,
        }}
      >
        {title}
      </div>

      {/* Content area */}
      <div
        style={{
          position: 'absolute',
          top: pad + titleSize + 12,
          left: pad,
          right: pad,
          bottom: pad + 28,
          zIndex: 5,
        }}
      >
        {children}
      </div>

      {/* Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: Math.round(pad * 0.5),
          left: pad,
          right: pad,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10,
        }}
      >
        <span style={{ ...typography.footerText }}>{footerLabel}</span>
        {/* Cyan accent dot */}
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: colors.magenta,
          }}
        />
      </div>
    </div>
  );
};
