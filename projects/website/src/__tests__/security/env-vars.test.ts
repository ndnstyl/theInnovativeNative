/**
 * Security Test: Environment Variable & Hardcoded Secret Audit
 *
 * Scans src/data/ files for hardcoded API keys, secrets, and values
 * that should live in environment variables. This is a static analysis
 * test -- it reads source files and pattern-matches against known
 * dangerous patterns.
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC_DIR = path.resolve(__dirname, '../../');
const DATA_DIR = path.resolve(SRC_DIR, 'data');

// ─── Helpers ───────────────────────────────────────────────────────────────────

function readFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8');
}

function getAllTsFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllTsFiles(fullPath));
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

// ─── Patterns ──────────────────────────────────────────────────────────────────

const STRIPE_LIVE_KEY_PATTERN = /pk_live_[A-Za-z0-9]{20,}/g;
const STRIPE_SECRET_KEY_PATTERN = /sk_live_[A-Za-z0-9]{20,}/g;
const STRIPE_TEST_PUBLISHABLE_PATTERN = /pk_test_[A-Za-z0-9]{20,}/g;
const STRIPE_TEST_SECRET_PATTERN = /sk_test_[A-Za-z0-9]{20,}/g;

/** Matches hardcoded supabase project URLs like https://xxxxx.supabase.co */
const SUPABASE_URL_PATTERN = /https:\/\/[a-z0-9]+\.supabase\.co/g;

/** Matches suspicious string literals containing secret-like words */
const SECRET_LITERAL_PATTERN =
  /(?:['"`])(?:password|secret|token|api[_-]?key|auth[_-]?token|access[_-]?token|private[_-]?key)\s*[:=]\s*[^'"`\n]{4,}(?:['"`])/gi;

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe('Environment Variable Security Audit', () => {
  const dataFiles = getAllTsFiles(DATA_DIR);

  // Sanity: we should have files to scan
  it('should find data files to scan', () => {
    expect(dataFiles.length).toBeGreaterThan(0);
  });

  // ── Stripe Live Publishable Keys ──────────────────────────────────────────
  describe('Stripe Live Publishable Keys (pk_live_*)', () => {
    const findings: { file: string; matches: string[] }[] = [];

    beforeAll(() => {
      for (const filePath of dataFiles) {
        const content = readFile(filePath);
        const matches = content.match(STRIPE_LIVE_KEY_PATTERN);
        if (matches) {
          findings.push({
            file: path.relative(SRC_DIR, filePath),
            matches,
          });
        }
      }
    });

    it('should NOT contain hardcoded pk_live_ keys in templates.ts', () => {
      const templatesFindings = findings.filter((f) =>
        f.file.includes('templates.ts')
      );
      expect(templatesFindings.length).toBe(0);
    });

    it('should NOT contain hardcoded pk_live_ keys in visionspark-re.ts', () => {
      const vsFindings = findings.filter((f) =>
        f.file.includes('visionspark-re.ts')
      );
      expect(vsFindings.length).toBe(0);
    });

    it('should confirm haven-blueprint.ts uses process.env for Stripe key', () => {
      const havenContent = readFile(
        path.resolve(DATA_DIR, 'haven-blueprint.ts')
      );
      // Should NOT contain a hardcoded pk_live_ key
      const hardcodedKeys = havenContent.match(STRIPE_LIVE_KEY_PATTERN);
      expect(hardcodedKeys).toBeNull();

      // Should reference process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      expect(havenContent).toContain(
        'process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'
      );
    });

    it('should have zero hardcoded pk_live_ keys in data/', () => {
      const totalKeys = findings.reduce(
        (sum, f) => sum + f.matches.length,
        0
      );
      // All Stripe keys should now use process.env
      expect(totalKeys).toBe(0);
    });
  });

  // ── Stripe Secret Keys ────────────────────────────────────────────────────
  describe('Stripe Secret Keys (sk_live_*, sk_test_*)', () => {
    it('should NOT contain any sk_live_ secret keys in data/ files', () => {
      for (const filePath of dataFiles) {
        const content = readFile(filePath);
        const matches = content.match(STRIPE_SECRET_KEY_PATTERN);
        if (matches) {
          console.error(
            `[CRITICAL] ${path.relative(SRC_DIR, filePath)} contains Stripe SECRET key!`
          );
        }
        expect(matches).toBeNull();
      }
    });

    it('should NOT contain any sk_test_ secret keys in data/ files', () => {
      for (const filePath of dataFiles) {
        const content = readFile(filePath);
        const matches = content.match(STRIPE_TEST_SECRET_PATTERN);
        if (matches) {
          console.error(
            `[CRITICAL] ${path.relative(SRC_DIR, filePath)} contains Stripe test SECRET key!`
          );
        }
        expect(matches).toBeNull();
      }
    });
  });

  // ── Stripe Test Keys ──────────────────────────────────────────────────────
  describe('Stripe Test Publishable Keys (pk_test_*)', () => {
    it('should NOT contain pk_test_ keys in data/ files (indicates dev keys leaked to source)', () => {
      for (const filePath of dataFiles) {
        const content = readFile(filePath);
        const matches = content.match(STRIPE_TEST_PUBLISHABLE_PATTERN);
        if (matches) {
          console.warn(
            `[SECURITY] ${path.relative(SRC_DIR, filePath)} contains Stripe test publishable key(s)`
          );
        }
        // pk_test_ keys in committed source are a mild risk -- flag but don't fail hard
        // (Stripe publishable test keys are not secret, but indicate sloppy config)
        expect(matches).toBeNull();
      }
    });
  });

  // ── Hardcoded Supabase URLs ───────────────────────────────────────────────
  describe('Hardcoded Supabase URLs', () => {
    it('should NOT contain hardcoded Supabase project URLs in data/ files', () => {
      for (const filePath of dataFiles) {
        const content = readFile(filePath);
        const matches = content.match(SUPABASE_URL_PATTERN);
        if (matches) {
          console.warn(
            `[SECURITY] ${path.relative(SRC_DIR, filePath)} contains hardcoded Supabase URL(s): ${matches.join(', ')}`
          );
        }
        expect(matches).toBeNull();
      }
    });

    it('should scan all src/ .ts/.tsx files for hardcoded Supabase URLs', () => {
      const allSrcFiles = getAllTsFiles(SRC_DIR);
      const findings: { file: string; matches: string[] }[] = [];

      for (const filePath of allSrcFiles) {
        const content = readFile(filePath);
        const matches = content.match(SUPABASE_URL_PATTERN);
        if (matches) {
          findings.push({
            file: path.relative(SRC_DIR, filePath),
            matches,
          });
        }
      }

      if (findings.length > 0) {
        console.warn(
          `[SECURITY] Found hardcoded Supabase URLs in ${findings.length} file(s):`
        );
        findings.forEach((f) =>
          console.warn(`  - ${f.file}: ${f.matches.join(', ')}`)
        );
      }
      // This is informational -- hardcoded Supabase URLs should use env vars
      // but the NEXT_PUBLIC_ prefix means they are client-visible anyway.
      // Still, hardcoding makes rotation impossible without a redeploy.
    });
  });

  // ── Password / Secret / Token Literals ────────────────────────────────────
  describe('Suspicious Secret Literals', () => {
    it('should NOT contain password/secret/token string literals in data/ files', () => {
      const findings: { file: string; snippets: string[] }[] = [];

      for (const filePath of dataFiles) {
        const content = readFile(filePath);
        const matches = content.match(SECRET_LITERAL_PATTERN);
        if (matches) {
          findings.push({
            file: path.relative(SRC_DIR, filePath),
            snippets: matches.map((m) =>
              m.length > 60 ? m.slice(0, 60) + '...' : m
            ),
          });
        }
      }

      if (findings.length > 0) {
        console.warn(`[SECURITY] Suspicious secret-like literals found:`);
        findings.forEach((f) => {
          f.snippets.forEach((s) => console.warn(`  ${f.file}: ${s}`));
        });
      }
      // Data files should never contain inline secrets
      expect(findings.length).toBe(0);
    });
  });

  // ── Comprehensive Scan: All src/ ──────────────────────────────────────────
  describe('Full src/ scan for Stripe keys', () => {
    it('should report any file in src/ with hardcoded Stripe live keys', () => {
      const allSrcFiles = getAllTsFiles(SRC_DIR);
      const findings: { file: string; type: string; count: number }[] = [];

      for (const filePath of allSrcFiles) {
        const content = readFile(filePath);
        const livePublishable = content.match(STRIPE_LIVE_KEY_PATTERN);
        const liveSecret = content.match(STRIPE_SECRET_KEY_PATTERN);
        const testPublishable = content.match(STRIPE_TEST_PUBLISHABLE_PATTERN);
        const testSecret = content.match(STRIPE_TEST_SECRET_PATTERN);

        if (livePublishable) {
          findings.push({
            file: path.relative(SRC_DIR, filePath),
            type: 'pk_live_',
            count: livePublishable.length,
          });
        }
        if (liveSecret) {
          findings.push({
            file: path.relative(SRC_DIR, filePath),
            type: 'sk_live_',
            count: liveSecret.length,
          });
        }
        if (testPublishable) {
          findings.push({
            file: path.relative(SRC_DIR, filePath),
            type: 'pk_test_',
            count: testPublishable.length,
          });
        }
        if (testSecret) {
          findings.push({
            file: path.relative(SRC_DIR, filePath),
            type: 'sk_test_',
            count: testSecret.length,
          });
        }
      }

      // Report findings
      if (findings.length > 0) {
        console.warn('[SECURITY] Stripe key audit across all src/ files:');
        findings.forEach((f) =>
          console.warn(`  ${f.type} x${f.count} in ${f.file}`)
        );
      }

      // Critical: no secret keys should ever appear
      const secretKeyFindings = findings.filter(
        (f) => f.type === 'sk_live_' || f.type === 'sk_test_'
      );
      expect(secretKeyFindings).toHaveLength(0);
    });
  });
});
