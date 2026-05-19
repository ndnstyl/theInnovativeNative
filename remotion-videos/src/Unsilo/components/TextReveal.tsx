import React from 'react';
import { useCurrentFrame, spring, useVideoConfig } from 'remotion';
import { clamp, progress } from '../theme';

interface TextRevealProps {
  text: string;
  startFrame: number;
  framesPerWord?: number;
  style?: React.CSSProperties;
  wordStyle?: React.CSSProperties;
}

/**
 * TextReveal - word-by-word fade-in with a small Y spring offset.
 * Each word springs in independently based on startFrame + index * framesPerWord.
 */
export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  startFrame,
  framesPerWord = 6,
  style,
  wordStyle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(' ');

  return (
    <span style={{ display: 'inline', ...style }}>
      {words.map((word, i) => {
        const wordStart = startFrame + i * framesPerWord;
        const sp = spring({
          frame: frame - wordStart,
          fps,
          config: { damping: 18, stiffness: 200, mass: 0.6 },
          from: 0,
          to: 1,
        });
        const opacity = clamp(sp, 0, 1);
        const translateY = (1 - sp) * 8;

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity,
              transform: `translateY(${translateY}px)`,
              marginRight: '0.28em',
              ...wordStyle,
            }}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
};
