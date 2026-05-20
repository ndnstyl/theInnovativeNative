/**
 * Security Test: Dependency Vulnerability Audit
 *
 * Reads package.json and flags known vulnerable or outdated packages.
 * This is a static check -- it does not run npm audit (which requires
 * network access and node_modules) but instead checks known CVEs
 * against declared versions.
 */

import * as fs from 'fs';
import * as path from 'path';

const PACKAGE_JSON_PATH = path.resolve(__dirname, '../../../package.json');

// ─── Types ─────────────────────────────────────────────────────────────────────

interface PackageJson {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

interface VulnerabilityEntry {
  package: string;
  installedVersion: string;
  severity: 'critical' | 'high' | 'moderate' | 'low' | 'info';
  cve?: string;
  description: string;
  recommendation: string;
}

interface OutdatedEntry {
  package: string;
  installedVersion: string;
  latestKnown: string;
  category: 'critical' | 'major' | 'minor';
  reason: string;
}

// ─── Known Vulnerabilities Database ────────────────────────────────────────────
// Based on npm audit results and known CVEs as of early 2026

const KNOWN_VULNERABILITIES: VulnerabilityEntry[] = [
  {
    package: 'next',
    installedVersion: '13.4.19',
    severity: 'high',
    cve: 'CVE-2024-34350',
    description:
      'Next.js 13.4.x has multiple known vulnerabilities including Server-Side Request Forgery (SSRF) ' +
      'via host header validation bypass, and potential denial of service via crafted requests.',
    recommendation: 'Upgrade to Next.js 14.x or later',
  },
  {
    package: 'next',
    installedVersion: '13.4.19',
    severity: 'high',
    cve: 'CVE-2024-46982',
    description:
      'Next.js cache poisoning vulnerability allows attackers to serve cached responses to unintended users.',
    recommendation: 'Upgrade to Next.js >=14.2.10',
  },
  {
    package: 'next',
    installedVersion: '13.4.19',
    severity: 'critical',
    cve: 'CVE-2025-29927',
    description:
      'Next.js middleware authorization bypass via x-middleware-subrequest header. ' +
      'Attackers can skip middleware auth checks by setting this internal header.',
    recommendation: 'Upgrade to Next.js >=14.2.25 or >=15.2.3',
  },
  {
    package: 'sharp',
    installedVersion: '0.32.5',
    severity: 'moderate',
    description:
      'sharp 0.32.x may have memory safety issues in image processing. ' +
      'Updates include security patches for libvips dependencies.',
    recommendation: 'Upgrade to sharp >=0.33.x',
  },
];

// ─── Significantly Outdated Packages ───────────────────────────────────────────

const OUTDATED_PACKAGES: OutdatedEntry[] = [
  {
    package: 'next',
    installedVersion: '13.4.19',
    latestKnown: '15.x',
    category: 'critical',
    reason:
      'Next.js 13.4 is 2+ major versions behind, missing critical security patches, ' +
      'App Router improvements, and Turbopack. Multiple CVEs affect this version.',
  },
  {
    package: 'react',
    installedVersion: '18.2.0',
    latestKnown: '19.x',
    category: 'major',
    reason:
      'React 18.2 is stable but one major version behind. React 19 includes ' +
      'server components improvements and security hardening.',
  },
  {
    package: 'react-dom',
    installedVersion: '18.2.0',
    latestKnown: '19.x',
    category: 'major',
    reason: 'Should match React version. Upgrade alongside React.',
  },
  {
    package: 'typescript',
    installedVersion: '^5.2.2',
    latestKnown: '5.7+',
    category: 'minor',
    reason:
      'TypeScript 5.2 works fine but later versions have improved type checking ' +
      'that can catch more potential runtime errors.',
  },
  {
    package: 'eslint',
    installedVersion: '8.48.0',
    latestKnown: '9.x',
    category: 'minor',
    reason: 'ESLint 9 has a new flat config format. Not a security concern.',
  },
];

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe('Dependency Vulnerability Audit', () => {
  let packageJson: PackageJson;

  beforeAll(() => {
    const raw = fs.readFileSync(PACKAGE_JSON_PATH, 'utf-8');
    packageJson = JSON.parse(raw);
  });

  // ── Package.json validity ─────────────────────────────────────────────────
  describe('Package.json validity', () => {
    it('should have dependencies defined', () => {
      expect(packageJson.dependencies).toBeDefined();
      expect(Object.keys(packageJson.dependencies).length).toBeGreaterThan(0);
    });

    it('should have devDependencies defined', () => {
      expect(packageJson.devDependencies).toBeDefined();
    });
  });

  // ── Known Vulnerabilities ─────────────────────────────────────────────────
  describe('Known vulnerabilities', () => {
    for (const vuln of KNOWN_VULNERABILITIES) {
      it(`should flag ${vuln.package}@${vuln.installedVersion} [${vuln.severity}]${vuln.cve ? ` (${vuln.cve})` : ''}`, () => {
        const allDeps = {
          ...packageJson.dependencies,
          ...packageJson.devDependencies,
        };
        const installed = allDeps[vuln.package];

        if (!installed) {
          console.warn(
            `[SKIP] ${vuln.package} not found in package.json`
          );
          return;
        }

        // Strip version prefix characters (^, ~, >=)
        const cleanInstalled = installed.replace(/^[\^~>=]+/, '');
        const cleanVuln = vuln.installedVersion.replace(/^[\^~>=]+/, '');

        const isAffected = cleanInstalled === cleanVuln;

        if (isAffected) {
          console.warn(
            `\n[${vuln.severity.toUpperCase()}] ${vuln.package}@${cleanInstalled}`
          );
          if (vuln.cve) console.warn(`  CVE: ${vuln.cve}`);
          console.warn(`  ${vuln.description}`);
          console.warn(`  Recommendation: ${vuln.recommendation}`);
        }

        // Document the vulnerability exists
        expect(isAffected).toBe(true);
      });
    }
  });

  // ── Critical CVEs ─────────────────────────────────────────────────────────
  describe('Critical CVEs', () => {
    it('should flag Next.js middleware authorization bypass (CVE-2025-29927)', () => {
      const nextVersion = packageJson.dependencies['next'];
      expect(nextVersion).toBeDefined();

      // 13.4.19 is affected
      const cleanVersion = nextVersion.replace(/^[\^~>=]+/, '');
      const majorMinor = cleanVersion.split('.').slice(0, 2).join('.');

      const isAffected =
        majorMinor === '13.4' ||
        majorMinor === '13.5' ||
        majorMinor === '14.0' ||
        majorMinor === '14.1';

      if (isAffected) {
        console.warn(
          '\n[CRITICAL VULNERABILITY] CVE-2025-29927: Next.js middleware bypass'
        );
        console.warn(
          '  An attacker can bypass ALL middleware auth checks by setting the ' +
            'x-middleware-subrequest header. This completely defeats the middleware-based ' +
            'auth protection for /dashboard and /classroom routes.'
        );
        console.warn(
          '  Impact: All protected routes become publicly accessible'
        );
        console.warn(
          '  Mitigation: Upgrade to Next.js >=14.2.25 or add WAF rule ' +
            'to strip x-middleware-subrequest headers from external requests'
        );
      }

      // We expect this to be true (the vulnerability IS present)
      expect(isAffected).toBe(true);
    });

    it('should flag Next.js cache poisoning (CVE-2024-46982)', () => {
      const nextVersion = packageJson.dependencies['next'];
      const cleanVersion = nextVersion.replace(/^[\^~>=]+/, '');

      // Any 13.x is affected
      expect(cleanVersion.startsWith('13.')).toBe(true);

      console.warn(
        '\n[HIGH VULNERABILITY] CVE-2024-46982: Next.js cache poisoning'
      );
      console.warn(
        '  Cached responses may be served to wrong users. ' +
          'In a static export build this is less critical, but ISR/SSR modes are at risk.'
      );
    });
  });

  // ── Outdated Packages ─────────────────────────────────────────────────────
  describe('Significantly outdated packages', () => {
    for (const outdated of OUTDATED_PACKAGES) {
      it(`should flag ${outdated.package} as outdated [${outdated.category}]`, () => {
        const allDeps = {
          ...packageJson.dependencies,
          ...packageJson.devDependencies,
        };
        const installed = allDeps[outdated.package];

        if (!installed) {
          console.warn(`[SKIP] ${outdated.package} not in package.json`);
          return;
        }

        console.warn(
          `\n[OUTDATED:${outdated.category.toUpperCase()}] ${outdated.package}: ${installed} -> ${outdated.latestKnown}`
        );
        console.warn(`  ${outdated.reason}`);
      });
    }
  });

  // ── Dependency type checks ────────────────────────────────────────────────
  describe('Dependency classification', () => {
    it('should flag @types packages in dependencies (should be devDependencies)', () => {
      const typesInDeps = Object.keys(packageJson.dependencies).filter((pkg) =>
        pkg.startsWith('@types/')
      );

      if (typesInDeps.length > 0) {
        console.warn(
          `\n[PACKAGE CONFIG] @types/ packages in dependencies (should be devDependencies): ${typesInDeps.join(', ')}`
        );
        console.warn(
          '  Type definition packages should be in devDependencies to reduce production bundle size.'
        );
      }

      // Known issue: @types/dompurify, @types/node, @types/react, @types/react-dom are in deps
      expect(typesInDeps.length).toBeGreaterThan(0);
    });

    it('should flag eslint in production dependencies', () => {
      const hasEslintInDeps = 'eslint' in packageJson.dependencies;
      const hasEslintConfigInDeps =
        'eslint-config-next' in packageJson.dependencies;

      if (hasEslintInDeps || hasEslintConfigInDeps) {
        console.warn(
          '\n[PACKAGE CONFIG] eslint and eslint-config-next are in dependencies (should be devDependencies)'
        );
      }
    });
  });

  // ── Security-relevant packages ────────────────────────────────────────────
  describe('Security-relevant packages', () => {
    it('should verify dompurify is installed for XSS protection', () => {
      expect(packageJson.dependencies['dompurify']).toBeDefined();
    });

    it('should verify @supabase/auth-helpers-nextjs is installed', () => {
      expect(
        packageJson.dependencies['@supabase/auth-helpers-nextjs']
      ).toBeDefined();
    });

    it('should verify @supabase/supabase-js is installed', () => {
      expect(packageJson.dependencies['@supabase/supabase-js']).toBeDefined();
    });

    it('should check for CSP-related packages (none found = manual config needed)', () => {
      const cspPackages = Object.keys(packageJson.dependencies).filter(
        (pkg) =>
          pkg.includes('csp') ||
          pkg.includes('helmet') ||
          pkg.includes('content-security-policy')
      );

      if (cspPackages.length === 0) {
        console.warn(
          '\n[SECURITY] No Content Security Policy package found. ' +
            'Consider adding helmet or next-safe for CSP headers. ' +
            'Without CSP, XSS attacks have wider impact.'
        );
      }

      // Expected: no CSP package is installed
      expect(cspPackages).toHaveLength(0);
    });

    it('should check for rate limiting packages (none found)', () => {
      const rateLimitPackages = Object.keys(packageJson.dependencies).filter(
        (pkg) =>
          pkg.includes('rate-limit') ||
          pkg.includes('ratelimit') ||
          pkg.includes('throttle')
      );

      if (rateLimitPackages.length === 0) {
        console.warn(
          '\n[SECURITY] No rate limiting package found. ' +
            'API routes and auth endpoints should have rate limiting to prevent brute force attacks.'
        );
      }

      expect(rateLimitPackages).toHaveLength(0);
    });
  });

  // ── Summary ───────────────────────────────────────────────────────────────
  describe('Summary', () => {
    it('should produce a full dependency audit summary', () => {
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };
      const totalDeps = Object.keys(allDeps).length;
      const criticalVulns = KNOWN_VULNERABILITIES.filter(
        (v) => v.severity === 'critical'
      );
      const highVulns = KNOWN_VULNERABILITIES.filter(
        (v) => v.severity === 'high'
      );

      console.warn('\n[DEPENDENCY AUDIT SUMMARY]');
      console.warn(`  Total packages: ${totalDeps}`);
      console.warn(
        `  Production dependencies: ${Object.keys(packageJson.dependencies).length}`
      );
      console.warn(
        `  Dev dependencies: ${Object.keys(packageJson.devDependencies).length}`
      );
      console.warn(
        `  Known critical vulnerabilities: ${criticalVulns.length}`
      );
      console.warn(`  Known high vulnerabilities: ${highVulns.length}`);
      console.warn(
        `  Significantly outdated: ${OUTDATED_PACKAGES.filter((p) => p.category === 'critical').length} critical, ${OUTDATED_PACKAGES.filter((p) => p.category === 'major').length} major`
      );
      console.warn(
        '\n  TOP PRIORITY: Upgrade next@13.4.19 to patch CVE-2025-29927 (middleware bypass)'
      );
    });
  });
});
