/**
 * WCAG Accessibility: Contrast Audit for #00FFFF (Cyan)
 * =======================================================
 * Audits all uses of the brand accent color #00FFFF against
 * dark backgrounds to ensure WCAG AA/AAA compliance.
 *
 * WCAG 2.1 SC 1.4.3 — Contrast (Minimum, AA: 4.5:1 normal text, 3:1 large text)
 * WCAG 2.1 SC 1.4.6 — Contrast (Enhanced, AAA: 7:1 normal text, 4.5:1 large text)
 *
 * Contrast ratios computed via the WCAG relative luminance formula.
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC_DIR = path.resolve(__dirname, '../../');

// ---------------------------------------------------------------------------
// WCAG contrast calculation helpers
// ---------------------------------------------------------------------------

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  return [
    parseInt(clean.substring(0, 2), 16) / 255,
    parseInt(clean.substring(2, 4), 16) / 255,
    parseInt(clean.substring(4, 6), 16) / 255,
  ];
}

function sRgbToLinear(c: number): number {
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map(sRgbToLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ---------------------------------------------------------------------------
// Background colors used in the project's dark theme
// ---------------------------------------------------------------------------

const CYAN = '#00FFFF';
const DARK_BACKGROUNDS: Record<string, string> = {
  '#000000': 'Pure black',
  '#0a0a0a': 'Near-black (common card bg)',
  '#0e0e0e': 'Slightly lighter dark',
  '#111111': 'Dark gray',
  '#1a1a1a': 'Border/surface dark',
  '#222222': 'Mid-dark surface',
  '#333333': 'Toggle track / muted bg',
};

const LIGHT_BACKGROUNDS: Record<string, string> = {
  '#FFFFFF': 'White',
  '#F5F5F5': 'Off-white',
  '#EEEEEE': 'Light gray',
  '#E0E0E0': 'Medium light gray',
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Cyan (#00FFFF) contrast on dark backgrounds', () => {
  for (const [bg, label] of Object.entries(DARK_BACKGROUNDS)) {
    const ratio = contrastRatio(CYAN, bg);

    it(`${CYAN} on ${bg} (${label}) — ratio ${ratio.toFixed(1)}:1 passes WCAG AA (4.5:1)`, () => {
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it(`${CYAN} on ${bg} (${label}) — ratio ${ratio.toFixed(1)}:1 passes WCAG AAA (7:1)`, () => {
      expect(ratio).toBeGreaterThanOrEqual(7);
    });
  }
});

describe('Cyan (#00FFFF) must not appear as text on light backgrounds', () => {
  function collectTsxFiles(dir: string): string[] {
    if (!fs.existsSync(dir)) return [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let files: string[] = [];
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '__tests__') continue;
        files = files.concat(collectTsxFiles(full));
      } else if (/\.tsx?$/.test(entry.name)) {
        files.push(full);
      }
    }
    return files;
  }

  const allFiles = collectTsxFiles(SRC_DIR);

  it('does not use #00FFFF as text color with an explicit light background in the same element', () => {
    const violations: string[] = [];

    for (const file of allFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, idx) => {
        // Check for inline styles combining cyan text with a light bg
        const hasCyanColor = /color:\s*['"]?#00FFFF/i.test(line);
        const hasLightBg = /background(?:-color)?:\s*['"]?(?:#fff|#ffffff|#f5f5f5|#eee|#eeeeee|white)/i.test(line);

        if (hasCyanColor && hasLightBg) {
          const rel = path.relative(SRC_DIR, file);
          violations.push(`${rel}:${idx + 1}`);
        }
      });
    }

    if (violations.length > 0) {
      console.warn('Cyan on light background violations:', violations);
    }
    expect(violations).toHaveLength(0);
  });

  it('documents that all dark-background contrast ratios exceed AAA (7:1)', () => {
    const results: string[] = [];
    for (const [bg, label] of Object.entries(DARK_BACKGROUNDS)) {
      const ratio = contrastRatio(CYAN, bg);
      results.push(`  ${CYAN} on ${bg} (${label}): ${ratio.toFixed(1)}:1 — ${ratio >= 7 ? 'AAA PASS' : 'FAIL'}`);
    }
    console.log('\nContrast Audit Summary:\n' + results.join('\n'));
    // All should pass
    expect(results.every(r => r.includes('AAA PASS'))).toBe(true);
  });
});
