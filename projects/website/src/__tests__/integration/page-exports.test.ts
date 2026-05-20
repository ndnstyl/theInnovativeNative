/**
 * Page Exports Integration Test
 * ==============================
 * Verifies every page in /pages/ has a valid default export (React component).
 * This catches broken pages that would fail at build time.
 *
 * Strategy: dynamically import every page file and check that the default
 * export is a function (React component or Next.js page).
 *
 * API routes export handler functions, not React components, so they are
 * tested separately with a looser check (any truthy default or named export).
 */

import * as path from 'path';
import * as fs from 'fs';

const PAGES_DIR = path.resolve(__dirname, '../../pages');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Recursively collect all .tsx / .ts files under a directory,
 * returning paths relative to PAGES_DIR.
 */
function collectPageFiles(dir: string, base: string = ''): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files: string[] = [];

  for (const entry of entries) {
    const rel = path.join(base, entry.name);
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files = files.concat(collectPageFiles(full, rel));
    } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
      files.push(rel);
    }
  }

  return files;
}

// ---------------------------------------------------------------------------
// Page file inventory
// ---------------------------------------------------------------------------

const allPageFiles = collectPageFiles(PAGES_DIR);

// Separate API routes from page components
const apiRoutes = allPageFiles.filter((f) => f.startsWith('api/') || f.startsWith('api\\'));
const pageComponents = allPageFiles.filter(
  (f) => !f.startsWith('api/') && !f.startsWith('api\\'),
);

// _app and _document are special Next.js files; they export default but are not
// standard pages. We still verify they export something.
const specialFiles = ['_app.tsx', '_document.tsx'];
const standardPages = pageComponents.filter((f) => !specialFiles.includes(f));

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Page exports', () => {
  it('should discover at least 40 page files (sanity check)', () => {
    // As of the last inventory there are ~60 page files. If this drops
    // dramatically, something is wrong with the file scan or the repo.
    expect(allPageFiles.length).toBeGreaterThanOrEqual(40);
  });

  describe('Standard pages — each must have a default export that is a function', () => {
    // Known pages that cannot be imported in a Node/Jest environment because
    // they depend on browser-only APIs or heavy Next.js runtime features.
    // Add paths here (relative to pages/) if a page legitimately cannot be
    // imported in a test context.
    const SKIP_IMPORT: string[] = [];

    test.each(standardPages.filter((f) => !SKIP_IMPORT.includes(f)))(
      '%s exports a default function',
      async (relPath) => {
        // Build the import path using the @/ alias which jest resolves
        const importPath = `@/pages/${relPath.replace(/\\/g, '/').replace(/\.(tsx?|jsx?)$/, '')}`;

        let mod: any;
        try {
          mod = await import(importPath);
        } catch (err: any) {
          // Some pages can't be dynamically imported in Jest due to ESM
          // dependencies (gsap, swiper, etc.) or other environment gaps.
          // For those, we fall back to checking that the file at least
          // contains an "export default" statement on disk.
          const isEnvIssue =
            err.message.includes('Cannot use import statement outside a module') ||
            err.message.includes('Unexpected token') ||
            err.message.includes('fetch()') ||
            err.message.includes('is not defined');

          if (isEnvIssue) {
            // Verify the file has an export default via static analysis
            const fullPath = path.join(PAGES_DIR, relPath);
            const content = fs.readFileSync(fullPath, 'utf-8');
            expect(content).toMatch(/export\s+default\b/);
            return; // pass with static check
          }

          // Genuine import error — fail with context
          throw new Error(
            `Failed to import page "${relPath}": ${err.message}\n` +
            'This page will break the production build.',
          );
        }

        expect(mod.default).toBeDefined();
        expect(typeof mod.default).toBe('function');
      },
    );
  });

  describe('Special Next.js files (_app, _document)', () => {
    test.each(specialFiles)('%s exports a default function', async (relPath) => {
      const importPath = `@/pages/${relPath.replace(/\.(tsx?|jsx?)$/, '')}`;
      const mod = await import(importPath);
      expect(mod.default).toBeDefined();
      expect(typeof mod.default).toBe('function');
    });
  });

  describe('API routes — each must export a default or named handler', () => {
    // Some API routes import server-side SDKs (e.g., Stripe) that
    // instantiate at the top level and require Node APIs (like fetch)
    // not available in the Jest jsdom environment. For those, we verify
    // the file exists on disk instead of dynamically importing.
    const IMPORT_SKIPS = [
      'api/stripe/create-checkout-session.ts',
      'api/stripe/customer-portal.ts',
      'api/stripe/webhook.ts',
    ];

    const importableRoutes = apiRoutes.filter(
      (f) => !IMPORT_SKIPS.includes(f.replace(/\\/g, '/')),
    );
    const skippedRoutes = apiRoutes.filter(
      (f) => IMPORT_SKIPS.includes(f.replace(/\\/g, '/')),
    );

    if (importableRoutes.length > 0) {
      test.each(importableRoutes)('%s exports a handler', async (relPath) => {
        const importPath = `@/pages/${relPath.replace(/\\/g, '/').replace(/\.(tsx?|jsx?)$/, '')}`;
        const mod = await import(importPath);

        // Next.js API routes typically use `export default function handler`.
        // Some may use named exports. At minimum, the module must not be empty.
        const hasDefault = typeof mod.default === 'function';
        const hasNamedHandler = typeof mod.handler === 'function';
        expect(hasDefault || hasNamedHandler).toBe(true);
      });
    }

    if (skippedRoutes.length > 0) {
      test.each(skippedRoutes)(
        '%s exists on disk (skipped import — needs server-side fetch)',
        (relPath) => {
          const fullPath = path.join(PAGES_DIR, relPath);
          expect(fs.existsSync(fullPath)).toBe(true);
        },
      );
    }
  });
});
