import './styles/fonts.css';

// ──────────────────────────────────────────────
// COLOR PALETTE
// ──────────────────────────────────────────────

export const colors = {
  cyan: '#00FFFF',
  magenta: '#FF00FF',
  white: '#FFFFFF',
  offWhite: '#E8E8E8',
  black: '#000000',
  darkBg: '#0A0A0A',
  dimWhite: 'rgba(255,255,255,0.6)',
  cyanDim: 'rgba(0,255,255,0.15)',
  cyanStroke: 'rgba(0,255,255,0.8)',
  magentaStroke: 'rgba(255,0,255,0.8)',
  transparent: 'transparent',
} as const;

// ──────────────────────────────────────────────
// TYPOGRAPHY
// ──────────────────────────────────────────────

export const fonts = {
  handwritten: 'Bangers',
  mono: 'JetBrains Mono',
  title: 'Caveat',
  fallback: 'monospace',
} as const;

export const typography = {
  sceneTitle: {
    fontFamily: fonts.title,
    fontSize: 64,
    fontWeight: 700 as const,
    color: colors.cyan,
    letterSpacing: '0.02em',
  },
  subtitle: {
    fontFamily: fonts.mono,
    fontSize: 24,
    fontWeight: 400 as const,
    color: colors.offWhite,
    letterSpacing: '0.01em',
  },
  bodyMono: {
    fontFamily: fonts.mono,
    fontSize: 22,
    fontWeight: 400 as const,
    color: colors.offWhite,
  },
  labelMono: {
    fontFamily: fonts.mono,
    fontSize: 18,
    fontWeight: 600 as const,
    color: colors.offWhite,
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
  },
  handLabel: {
    fontFamily: fonts.handwritten,
    fontSize: 26,
    fontWeight: 600 as const,
    color: colors.offWhite,
  },
  handAccent: {
    fontFamily: fonts.handwritten,
    fontSize: 32,
    fontWeight: 700 as const,
    color: colors.magenta,
  },
  bigFormula: {
    fontFamily: fonts.handwritten,
    fontSize: 56,
    fontWeight: 700 as const,
    color: colors.white,
  },
  footerText: {
    fontFamily: fonts.mono,
    fontSize: 16,
    fontWeight: 400 as const,
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: '0.08em',
  },
  tableHeader: {
    fontFamily: fonts.mono,
    fontSize: 18,
    fontWeight: 700 as const,
    color: colors.cyan,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  tableCell: {
    fontFamily: fonts.mono,
    fontSize: 16,
    fontWeight: 400 as const,
    color: colors.offWhite,
  },
} as const;

// ──────────────────────────────────────────────
// VIDEO CONFIG
// ──────────────────────────────────────────────

export const videoConfig = {
  widescreen: { width: 1920, height: 1080, fps: 30 },
  vertical: { width: 1080, height: 1920, fps: 30 },
} as const;

export const SCENE_DURATION_FRAMES = 180; // 6 seconds @ 30fps
export const REVEAL_FRAMES = 135;         // 4.5s
export const HOLD_FRAMES = 45;            // 1.5s

// ──────────────────────────────────────────────
// ANIMATION HELPERS
// ──────────────────────────────────────────────

export const easeOut = (t: number): number => 1 - Math.pow(1 - t, 3);

export const clamp = (v: number, lo: number, hi: number): number =>
  Math.max(lo, Math.min(hi, v));

export const progress = (frame: number, start: number, end: number): number =>
  clamp((frame - start) / (end - start), 0, 1);
