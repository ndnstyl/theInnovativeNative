/**
 * Console Statement Detection Test
 * ==================================
 * Production code should not contain console.log, console.error, or
 * console.warn statements. These leak debug information, clutter the
 * browser console, and can expose internal implementation details.
 *
 * Exceptions:
 *   - API routes (pages/api/) may use console.error for server-side
 *     logging that never reaches the browser. These are flagged
 *     separately but with a softer stance.
 *
 * Known offenders (as of last audit):
 *   - StudentDashboard.tsx — console.error in catch block
 *   - pages/classroom/admin/[courseSlug]/lessons/[lessonSlug].tsx — console.error
 *   - contexts/AuthContext.tsx — console.error (2 locations)
 *   - Multiple hooks (useLessonAttachments, useLessonComments, useCourses, etc.)
 *   - auth components (AuthModal.tsx, UserMenu.tsx)
 *   - pages/auth/callback.tsx
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC_DIR = path.resolve(__dirname, '../../');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface ConsoleHit {
  file: string;       // relative to SRC_DIR
  line: number;
  type: 'log' | 'error' | 'warn';
  text: string;
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

function findConsoleStatements(dir: string, excludePatterns: RegExp[] = []): ConsoleHit[] {
  const files = collectFiles(dir);
  const hits: ConsoleHit[] = [];

  for (const file of files) {
    const relPath = path.relative(SRC_DIR, file);

    // Skip test files
    if (relPath.includes('__tests__')) continue;

    // Skip excluded patterns
    if (excludePatterns.some((p) => p.test(relPath))) continue;

    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line: string, idx: number) => {
      // Skip commented-out lines
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;

      const logMatch = /console\.(log|error|warn)\s*\(/.exec(line);
      if (logMatch) {
        hits.push({
          file: relPath,
          line: idx + 1,
          type: logMatch[1] as 'log' | 'error' | 'warn',
          text: trimmed,
        });
      }
    });
  }

  return hits;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Console statements in production code', () => {
  // All console statements in src/, excluding test files
  const allHits = findConsoleStatements(SRC_DIR);

  // Separate API routes (server-side logging is more acceptable)
  const apiHits = allHits.filter((h) => h.file.startsWith('pages/api/') || h.file.startsWith('pages\\api\\'));
  const clientHits = allHits.filter((h) => !h.file.startsWith('pages/api/') && !h.file.startsWith('pages\\api\\'));

  // Break down by type
  const clientLogs = clientHits.filter((h) => h.type === 'log');
  const clientErrors = clientHits.filter((h) => h.type === 'error');
  const clientWarns = clientHits.filter((h) => h.type === 'warn');

  describe('Client-side code (non-API)', () => {
    it('should have ZERO console.log statements', () => {
      if (clientLogs.length > 0) {
        console.log(
          `console.log statements found:\n` +
          clientLogs.map((h) => `  ${h.file}:${h.line} — ${h.text}`).join('\n'),
        );
      }
      expect(clientLogs.length).toBe(0);
    });

    it('should have ZERO console.error statements (use error boundaries or toast)', () => {
      // These should be replaced with proper error handling:
      //   - ErrorBoundary for React component errors
      //   - Toast/notification for user-facing errors
      //   - Structured logging service for production monitoring
      if (clientErrors.length > 0) {
        console.log(
          `console.error statements found:\n` +
          clientErrors.map((h) => `  ${h.file}:${h.line} — ${h.text}`).join('\n'),
        );
      }
      expect(clientErrors.length).toBe(0);
    });

    it('should have ZERO console.warn statements', () => {
      if (clientWarns.length > 0) {
        console.log(
          `console.warn statements found:\n` +
          clientWarns.map((h) => `  ${h.file}:${h.line} — ${h.text}`).join('\n'),
        );
      }
      expect(clientWarns.length).toBe(0);
    });
  });

  describe('Previously fixed offenders (regression guards)', () => {
    it('StudentDashboard.tsx no longer contains console.error', () => {
      const hit = clientHits.find(
        (h) => h.file.includes('StudentDashboard') && h.type === 'error',
      );
      expect(hit).toBeUndefined();
    });

    it('lesson editor page no longer contains console.error', () => {
      const hit = clientHits.find(
        (h) => h.file.includes('lessonSlug') && h.type === 'error',
      );
      expect(hit).toBeUndefined();
    });

    it('AuthContext.tsx no longer contains console.error', () => {
      const hits = clientHits.filter(
        (h) => h.file.includes('AuthContext') && h.type === 'error',
      );
      expect(hits.length).toBe(0);
    });
  });

  describe('API routes (server-side)', () => {
    it('reports API route console statements (acceptable for server logging)', () => {
      if (apiHits.length > 0) {
        console.log(
          `API route console statements (${apiHits.length} total):\n` +
          apiHits.map((h) => `  ${h.file}:${h.line} [${h.type}] — ${h.text}`).join('\n'),
        );
      }
      // Informational — we don't fail on API routes
      expect(apiHits.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Summary', () => {
    it('total console statement count for tracking', () => {
      console.log(
        `\nConsole statement summary:\n` +
        `  Client-side: ${clientHits.length} total ` +
        `(${clientLogs.length} log, ${clientErrors.length} error, ${clientWarns.length} warn)\n` +
        `  API routes:  ${apiHits.length} total\n` +
        `  Grand total: ${allHits.length}`,
      );

      // Informational
      expect(allHits.length).toBeGreaterThanOrEqual(0);
    });
  });
});
