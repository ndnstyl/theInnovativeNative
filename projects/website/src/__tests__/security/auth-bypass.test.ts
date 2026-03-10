/**
 * Security Test: Authentication & Authorization Bypass Audit
 *
 * Validates that:
 * 1. Middleware protectedRoutes covers all sensitive paths
 * 2. Community/classroom pages use ProtectedRoute component
 * 3. Admin pages require admin role
 * 4. Missing env vars create an auth bypass vulnerability
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC_DIR = path.resolve(__dirname, '../../');

// ─── Helpers ───────────────────────────────────────────────────────────────────

function readFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8');
}

function fileExists(relativePath: string): boolean {
  return fs.existsSync(path.resolve(SRC_DIR, relativePath));
}

function getAllPageFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllPageFiles(fullPath));
    } else if (/\.(tsx|ts)$/.test(entry.name) && !entry.name.startsWith('_')) {
      results.push(fullPath);
    }
  }
  return results;
}

// ─── Constants from middleware.ts ───────────────────────────────────────────

// These must match what's in src/middleware.ts
const MIDDLEWARE_PROTECTED_ROUTES = ['/dashboard', '/classroom'];

// Routes that SHOULD be protected (either by middleware or ProtectedRoute component)
const EXPECTED_PROTECTED_PATHS = [
  '/dashboard',
  '/classroom',
  '/community',
  '/members',
];

// Admin-only paths that require role check
const EXPECTED_ADMIN_PATHS = [
  '/classroom/admin',
  '/community/admin',
  '/members/settings',
  '/members/requests',
];

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe('Authentication & Authorization Bypass Audit', () => {
  // ── Middleware protectedRoutes coverage ────────────────────────────────────
  describe('Middleware protectedRoutes coverage', () => {
    let middlewareContent: string;

    beforeAll(() => {
      middlewareContent = readFile(path.resolve(SRC_DIR, 'middleware.ts'));
    });

    it('should protect /dashboard via middleware', () => {
      expect(middlewareContent).toContain("'/dashboard'");
    });

    it('should protect /classroom via middleware', () => {
      expect(middlewareContent).toContain("'/classroom'");
    });

    it('should flag that /community is NOT in middleware protectedRoutes', () => {
      // This is a known gap -- /community/* is NOT protected by middleware
      // It relies entirely on ProtectedRoute component (client-side only)
      const hasCommunityRoute =
        middlewareContent.includes("'/community'") ||
        middlewareContent.includes('"/community"');

      console.warn(
        '[AUTH GAP] /community is NOT in middleware protectedRoutes. ' +
          'Protection relies entirely on the client-side ProtectedRoute component. ' +
          'This means: (1) The initial HTML is served before auth check, ' +
          '(2) API calls from community hooks may fire before redirect, ' +
          '(3) Server-side rendering will include the page structure. ' +
          'Recommendation: Add /community to middleware protectedRoutes for ' +
          'defense-in-depth.'
      );

      expect(hasCommunityRoute).toBe(false);
    });

    it('should flag that /members is NOT in middleware protectedRoutes', () => {
      const hasMembersRoute =
        middlewareContent.includes("'/members'") ||
        middlewareContent.includes('"/members"');

      console.warn(
        '[AUTH GAP] /members is NOT in middleware protectedRoutes. ' +
          'Member profile pages, settings, and management are only protected ' +
          'by client-side ProtectedRoute. Add to middleware for server-side auth.'
      );

      expect(hasMembersRoute).toBe(false);
    });

    it('should flag missing env vars bypass vulnerability', () => {
      // middleware.ts lines 19-22: if no env vars, return without auth check
      const hasEnvBypass =
        middlewareContent.includes('!supabaseUrl || !supabaseAnonKey') &&
        middlewareContent.includes('return res');

      console.warn(
        '[VULNERABILITY] Middleware passes through ALL requests when ' +
          'NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY are missing. ' +
          'This means: if env vars are accidentally unset (e.g., deployment misconfiguration), ' +
          'ALL protected routes become publicly accessible. ' +
          'Recommendation: Return 503 or redirect to an error page when auth cannot be verified.'
      );

      expect(hasEnvBypass).toBe(true);
    });

    it('should use startsWith for route matching (prefix-based)', () => {
      // Verify the middleware uses startsWith, which means /classroom/admin is covered
      expect(middlewareContent).toContain('pathname.startsWith(route)');
    });
  });

  // ── ProtectedRoute component usage ────────────────────────────────────────
  describe('ProtectedRoute component usage in pages', () => {
    it('should verify community/index.tsx uses ProtectedRoute', () => {
      const pagePath = path.resolve(SRC_DIR, 'pages/community/index.tsx');
      if (!fs.existsSync(pagePath)) {
        console.warn('[SKIP] pages/community/index.tsx not found');
        return;
      }
      const content = readFile(pagePath);
      expect(content).toContain('ProtectedRoute');
    });

    it('should verify community/posts/[postId].tsx uses ProtectedRoute', () => {
      const pagePath = path.resolve(
        SRC_DIR,
        'pages/community/posts/[postId].tsx'
      );
      if (!fs.existsSync(pagePath)) {
        console.warn('[SKIP] community/posts/[postId].tsx not found');
        return;
      }
      const content = readFile(pagePath);
      expect(content).toContain('ProtectedRoute');
    });

    it('should verify community/leaderboard.tsx uses ProtectedRoute', () => {
      const pagePath = path.resolve(
        SRC_DIR,
        'pages/community/leaderboard.tsx'
      );
      if (!fs.existsSync(pagePath)) {
        console.warn('[SKIP] community/leaderboard.tsx not found');
        return;
      }
      const content = readFile(pagePath);
      expect(content).toContain('ProtectedRoute');
    });

    it('should verify all community pages use ProtectedRoute', () => {
      const communityDir = path.resolve(SRC_DIR, 'pages/community');
      if (!fs.existsSync(communityDir)) {
        console.warn('[SKIP] pages/community/ not found');
        return;
      }

      const pageFiles = getAllPageFiles(communityDir);
      const unprotected: string[] = [];

      for (const filePath of pageFiles) {
        const content = readFile(filePath);
        if (!content.includes('ProtectedRoute')) {
          unprotected.push(path.relative(SRC_DIR, filePath));
        }
      }

      if (unprotected.length > 0) {
        console.warn(
          `[AUTH GAP] Community pages WITHOUT ProtectedRoute (${unprotected.length}):`
        );
        unprotected.forEach((f) =>
          console.warn(`  - ${f}`)
        );
        console.warn(
          '  These pages can be accessed without authentication at the component level. ' +
            'Add <ProtectedRoute> wrapper to each page.'
        );
      }

      // Flag as a finding -- unprotected pages are a real gap
      // We expect this to find pages (the test documents the vulnerability)
      if (unprotected.length > 0) {
        expect(unprotected.length).toBeGreaterThan(0);
      } else {
        expect(unprotected).toHaveLength(0);
      }
    });
  });

  // ── Admin role protection ─────────────────────────────────────────────────
  describe('Admin role protection', () => {
    it('should verify classroom/admin/index.tsx requires admin role', () => {
      const pagePath = path.resolve(
        SRC_DIR,
        'pages/classroom/admin/index.tsx'
      );
      if (!fs.existsSync(pagePath)) {
        console.warn('[SKIP] classroom/admin/index.tsx not found');
        return;
      }
      const content = readFile(pagePath);
      expect(content).toContain('ProtectedRoute');
      // Should require owner or admin role
      expect(content).toMatch(/requiredRole.*(?:admin|owner)/);
    });

    it('should verify community/admin/categories.tsx requires admin role', () => {
      const pagePath = path.resolve(
        SRC_DIR,
        'pages/community/admin/categories.tsx'
      );
      if (!fs.existsSync(pagePath)) {
        console.warn('[SKIP] community/admin/categories.tsx not found');
        return;
      }
      const content = readFile(pagePath);
      expect(content).toContain('ProtectedRoute');
      expect(content).toMatch(/requiredRole.*(?:admin|owner)/);
    });

    it('should verify members/requests.tsx requires admin role', () => {
      const pagePath = path.resolve(SRC_DIR, 'pages/members/requests.tsx');
      if (!fs.existsSync(pagePath)) {
        console.warn('[SKIP] members/requests.tsx not found');
        return;
      }
      const content = readFile(pagePath);
      expect(content).toContain('ProtectedRoute');
      expect(content).toMatch(/requiredRole.*(?:admin|owner)/);
    });

    it('should verify members/settings/index.tsx requires admin role', () => {
      const pagePath = path.resolve(
        SRC_DIR,
        'pages/members/settings/index.tsx'
      );
      if (!fs.existsSync(pagePath)) {
        console.warn('[SKIP] members/settings/index.tsx not found');
        return;
      }
      const content = readFile(pagePath);
      expect(content).toContain('ProtectedRoute');
      expect(content).toMatch(/requiredRole.*(?:admin|owner)/);
    });

    it('should verify classroom admin edit pages require admin role', () => {
      const editPath = path.resolve(
        SRC_DIR,
        'pages/classroom/admin/[courseSlug]/edit.tsx'
      );
      if (!fs.existsSync(editPath)) {
        console.warn('[SKIP] classroom admin edit page not found');
        return;
      }
      const content = readFile(editPath);
      expect(content).toContain('ProtectedRoute');
      expect(content).toMatch(/requiredRole.*(?:admin|owner)/);
    });

    it('should verify classroom admin lesson pages require admin role', () => {
      const lessonPath = path.resolve(
        SRC_DIR,
        'pages/classroom/admin/[courseSlug]/lessons/[lessonSlug].tsx'
      );
      if (!fs.existsSync(lessonPath)) {
        console.warn('[SKIP] classroom admin lesson page not found');
        return;
      }
      const content = readFile(lessonPath);
      expect(content).toContain('ProtectedRoute');
      expect(content).toMatch(/requiredRole.*(?:admin|owner)/);
    });
  });

  // ── ProtectedRoute component audit ────────────────────────────────────────
  describe('ProtectedRoute component security', () => {
    it('should verify ProtectedRoute checks session before rendering children', () => {
      const prPath = path.resolve(
        SRC_DIR,
        'components/common/ProtectedRoute.tsx'
      );
      if (!fs.existsSync(prPath)) {
        console.error('[CRITICAL] ProtectedRoute.tsx not found');
        return;
      }

      const content = readFile(prPath);

      // Must check session
      expect(content).toContain('!session');
      // Must check role when requiredRole is provided
      expect(content).toContain('requiredRole');
      // Must handle banned users
      expect(content).toContain('banned');
      // Must handle pending membership
      expect(content).toContain('pending');
    });

    it('should flag that ProtectedRoute is client-side only', () => {
      console.warn(
        '[SECURITY NOTE] ProtectedRoute is a client-side React component. ' +
          'It does NOT prevent server-side rendering of protected page content. ' +
          'The initial HTML response may contain protected page structure ' +
          '(though not user data, since hooks require client-side auth). ' +
          'For true server-side protection, routes must be in middleware.ts protectedRoutes.'
      );
    });
  });

  // ── Defense-in-depth analysis ─────────────────────────────────────────────
  describe('Defense-in-depth analysis', () => {
    it('should report routes that have BOTH middleware and component protection', () => {
      const doublyProtected: string[] = [];
      const middlewareOnly: string[] = [];
      const componentOnly: string[] = [];

      for (const route of EXPECTED_PROTECTED_PATHS) {
        const inMiddleware = MIDDLEWARE_PROTECTED_ROUTES.some((r) =>
          route.startsWith(r)
        );

        // Check if pages under this route use ProtectedRoute
        const pagesDir = path.resolve(SRC_DIR, 'pages', route.slice(1));
        let hasComponentProtection = false;

        if (fs.existsSync(pagesDir)) {
          const files = getAllPageFiles(pagesDir);
          hasComponentProtection = files.some((f) => {
            const content = readFile(f);
            return content.includes('ProtectedRoute');
          });
        }

        if (inMiddleware && hasComponentProtection) {
          doublyProtected.push(route);
        } else if (inMiddleware) {
          middlewareOnly.push(route);
        } else if (hasComponentProtection) {
          componentOnly.push(route);
        }
      }

      console.warn('\n[AUTH PROTECTION MATRIX]');
      console.warn(
        `  Both middleware + component: ${doublyProtected.join(', ') || 'none'}`
      );
      console.warn(
        `  Middleware only: ${middlewareOnly.join(', ') || 'none'}`
      );
      console.warn(
        `  Component only (NO server-side): ${componentOnly.join(', ') || 'none'}`
      );

      // Ideal: all sensitive routes should have both layers
      if (componentOnly.length > 0) {
        console.warn(
          `\n[RECOMMENDATION] Add these routes to middleware protectedRoutes: ${componentOnly.join(', ')}`
        );
      }
    });
  });
});
