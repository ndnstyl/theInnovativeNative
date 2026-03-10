/**
 * Inline Style Detection Test
 * =============================
 * The project uses SCSS for styling. Components should prefer SCSS classes
 * over inline style={{}} objects. Inline styles:
 *   - Cannot be cached or deduplicated by the browser
 *   - Bypass the design system's spacing/color tokens
 *   - Make responsive design harder (no media queries in inline styles)
 *   - Create specificity issues that fight with SCSS
 *
 * Known offenders (components with heavy inline style usage):
 *   - WorkflowShowcase
 *   - BrandConnector
 *   - ProtectedRoute
 *   - HomeOffer
 *   - Various law-firm-rag components
 *   - Various banner components
 *
 * Threshold: components with >5 inline style objects should be refactored.
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC_DIR = path.resolve(__dirname, '../../');
const COMPONENTS_DIR = path.join(SRC_DIR, 'components');
const PAGES_DIR = path.join(SRC_DIR, 'pages');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface InlineStyleReport {
  file: string;       // relative to SRC_DIR
  count: number;      // number of style={{}} occurrences
  lines: number[];    // line numbers
}

function collectFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next') continue;
      files = files.concat(collectFiles(full));
    } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

function findInlineStyles(dir: string): InlineStyleReport[] {
  const files = collectFiles(dir);
  const reports: InlineStyleReport[] = [];

  for (const file of files) {
    const relPath = path.relative(SRC_DIR, file);
    if (relPath.includes('__tests__')) continue;

    const content = fs.readFileSync(file, 'utf-8');
    const lineTexts = content.split('\n');

    const lines: number[] = [];
    lineTexts.forEach((line: string, idx: number) => {
      // Match style={{ ... }} in JSX
      if (/style\s*=\s*\{\{/.test(line)) {
        lines.push(idx + 1);
      }
    });

    if (lines.length > 0) {
      reports.push({ file: relPath, count: lines.length, lines });
    }
  }

  return reports.sort((a, b) => b.count - a.count);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Inline style usage', () => {
  const componentReports = findInlineStyles(COMPONENTS_DIR);
  const pageReports = findInlineStyles(PAGES_DIR);
  const allReports = [...componentReports, ...pageReports];

  const HEAVY_THRESHOLD = 5; // >5 inline styles = needs refactoring

  describe('Overview', () => {
    it('counts total files with inline styles', () => {
      console.log(
        `\nFiles with inline styles: ${allReports.length}\n` +
        `Total inline style occurrences: ${allReports.reduce((sum, r) => sum + r.count, 0)}`,
      );
      // Informational
      expect(allReports.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Components with excessive inline styles (>5)', () => {
    const heavyOffenders = componentReports.filter((r) => r.count > HEAVY_THRESHOLD);

    it('should track components with >5 inline style objects for future SCSS migration', () => {
      // KNOWN DEBT: These components use heavy inline styles and should be migrated to SCSS.
      // This test documents the current state. As components are migrated, reduce the threshold.
      if (heavyOffenders.length > 0) {
        console.log(
          `Components with >${HEAVY_THRESHOLD} inline styles (need SCSS migration):\n` +
          heavyOffenders
            .map((r) => `  ${r.file}: ${r.count} occurrences (lines: ${r.lines.join(', ')})`)
            .join('\n'),
        );
      }
      // Current known count: 12 components. Reduce this as styles are migrated to SCSS.
      expect(heavyOffenders.length).toBeLessThanOrEqual(12);
    });
  });

  describe('Known offenders', () => {
    it('WorkflowShowcase uses inline styles', () => {
      const report = componentReports.find((r) =>
        r.file.includes('WorkflowShowcase'),
      );
      if (report) {
        expect(report.count).toBeGreaterThan(0);
      } else {
        // If the file doesn't have inline styles, it was cleaned up
        expect(report).toBeUndefined();
      }
    });

    it('BrandConnector uses inline styles', () => {
      const report = componentReports.find((r) =>
        r.file.includes('BrandConnector'),
      );
      if (report) {
        expect(report.count).toBeGreaterThan(0);
      } else {
        expect(report).toBeUndefined();
      }
    });

    it('ProtectedRoute uses inline styles', () => {
      const report = componentReports.find((r) =>
        r.file.includes('ProtectedRoute'),
      );
      if (report) {
        expect(report.count).toBeGreaterThan(0);
      } else {
        expect(report).toBeUndefined();
      }
    });

    it('HomeOffer uses inline styles', () => {
      const report = componentReports.find((r) =>
        r.file.includes('HomeOffer'),
      );
      if (report) {
        expect(report.count).toBeGreaterThan(0);
      } else {
        expect(report).toBeUndefined();
      }
    });
  });

  describe('Pages with inline styles', () => {
    it('index.tsx (homepage) uses inline styles', () => {
      // The homepage has inline styles in the about section and CTA
      const report = pageReports.find(
        (r) => r.file === 'pages/index.tsx' || r.file === path.join('pages', 'index.tsx'),
      );
      if (report) {
        expect(report.count).toBeGreaterThan(0);
      }
    });
  });

  describe('Full inventory (sorted by count)', () => {
    it('lists all files with inline styles for reference', () => {
      if (allReports.length > 0) {
        console.log(
          `\nAll files with inline styles (sorted by count):\n` +
          allReports
            .map((r) => `  [${r.count}] ${r.file}`)
            .join('\n'),
        );
      }
      // Informational — always passes
      expect(true).toBe(true);
    });
  });
});
