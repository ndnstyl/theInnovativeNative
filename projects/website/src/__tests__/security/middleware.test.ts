/**
 * Security Test: Middleware Unit Tests
 *
 * Tests the Next.js middleware function that guards protected routes
 * via Supabase auth session validation.
 *
 * NOTE: Next.js middleware uses Edge Runtime APIs (Response, Headers) that
 * are not available in jsdom/Node. We use a comprehensive manual mock
 * approach and mock the entire 'next/server' module path.
 */

// ─── Track redirect/next calls ──────────────────────────────────────────────

let _nextCalled = false;
let _redirectCalled = false;
let _redirectArg: any = null;

function resetTrackers() {
  _nextCalled = false;
  _redirectCalled = false;
  _redirectArg = null;
}

// ─── Mocks (before any imports) ─────────────────────────────────────────────

const mockGetSession = jest.fn();
const mockCreateServerClient = jest.fn(() => ({
  auth: { getSession: mockGetSession },
}));

jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createServerClient: (...args: any[]) => mockCreateServerClient(...args),
}));

// Mock the entire next/server import chain to avoid Edge Runtime API issues
jest.mock('next/server', () => ({
  __esModule: true,
  NextResponse: {
    next: (opts?: any) => {
      _nextCalled = true;
      return {
        cookies: { set: jest.fn() },
        headers: new Map(),
      };
    },
    redirect: (url: any) => {
      _redirectCalled = true;
      _redirectArg = url;
      return {
        cookies: { set: jest.fn() },
        headers: new Map(),
      };
    },
  },
}));

// Also mock the internal next module that next/server re-exports from
jest.mock('next/dist/server/web/exports/next-response', () => ({
  __esModule: true,
  default: {
    next: (opts?: any) => {
      _nextCalled = true;
      return {
        cookies: { set: jest.fn() },
        headers: new Map(),
      };
    },
    redirect: (url: any) => {
      _redirectCalled = true;
      _redirectArg = url;
      return {
        cookies: { set: jest.fn() },
        headers: new Map(),
      };
    },
  },
}));

// ─── Helpers ───────────────────────────────────────────────────────────────────

function createMockRequest(pathname: string, origin = 'https://example.com') {
  const url = new URL(pathname, origin);
  return {
    cookies: {
      getAll: jest.fn(() => []),
      set: jest.fn(),
    },
    headers: new Map(),
    nextUrl: url,
    url: url.toString(),
  } as any;
}

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe('Middleware', () => {
  let middleware: any;
  let config: any;

  beforeAll(async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

    const mod = await import('@/middleware');
    middleware = mod.middleware;
    config = mod.config;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    resetTrackers();
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
  });

  // ── Authenticated user on protected route ─────────────────────────────────
  describe('Authenticated user on protected route', () => {
    it('should pass through when user has valid session on /dashboard', async () => {
      mockGetSession.mockResolvedValueOnce({
        data: { session: { user: { id: 'user-1' } } },
      });

      const req = createMockRequest('/dashboard');
      await middleware(req);

      expect(_redirectCalled).toBe(false);
      expect(_nextCalled).toBe(true);
    });

    it('should pass through when user has valid session on /classroom/course-1', async () => {
      mockGetSession.mockResolvedValueOnce({
        data: { session: { user: { id: 'user-1' } } },
      });

      const req = createMockRequest('/classroom/course-1');
      await middleware(req);

      expect(_redirectCalled).toBe(false);
    });

    it('should pass through when user has valid session on /classroom/admin', async () => {
      mockGetSession.mockResolvedValueOnce({
        data: { session: { user: { id: 'admin-1' } } },
      });

      const req = createMockRequest('/classroom/admin');
      await middleware(req);

      expect(_redirectCalled).toBe(false);
    });
  });

  // ── Unauthenticated user on protected route ───────────────────────────────
  describe('Unauthenticated user on protected route', () => {
    it('should redirect unauthenticated user from /dashboard', async () => {
      mockGetSession.mockResolvedValueOnce({
        data: { session: null },
      });

      const req = createMockRequest('/dashboard');
      await middleware(req);

      expect(_redirectCalled).toBe(true);
    });

    it('should redirect unauthenticated user from /classroom', async () => {
      mockGetSession.mockResolvedValueOnce({
        data: { session: null },
      });

      const req = createMockRequest('/classroom');
      await middleware(req);

      expect(_redirectCalled).toBe(true);
    });

    it('should redirect unauthenticated user from /classroom/admin/some-course', async () => {
      mockGetSession.mockResolvedValueOnce({
        data: { session: null },
      });

      const req = createMockRequest('/classroom/admin/some-course');
      await middleware(req);

      expect(_redirectCalled).toBe(true);
    });

    it('should redirect to / with auth=required query param', async () => {
      mockGetSession.mockResolvedValueOnce({
        data: { session: null },
      });

      const req = createMockRequest('/dashboard');
      await middleware(req);

      expect(_redirectCalled).toBe(true);
      expect(_redirectArg).toBeInstanceOf(URL);
      expect(_redirectArg.pathname).toBe('/');
      expect(_redirectArg.searchParams.get('auth')).toBe('required');
    });

    it('should include original path in redirect query param', async () => {
      mockGetSession.mockResolvedValueOnce({
        data: { session: null },
      });

      const req = createMockRequest('/classroom/my-progress');
      await middleware(req);

      expect(_redirectCalled).toBe(true);
      expect(_redirectArg.searchParams.get('redirect')).toBe(
        '/classroom/my-progress'
      );
    });
  });

  // ── Unauthenticated user on public route ──────────────────────────────────
  describe('Unauthenticated user on public route', () => {
    it('should pass through on / (home page)', async () => {
      mockGetSession.mockResolvedValueOnce({
        data: { session: null },
      });

      const req = createMockRequest('/');
      await middleware(req);

      expect(_redirectCalled).toBe(false);
    });

    it('should pass through on /blog/some-post', async () => {
      mockGetSession.mockResolvedValueOnce({
        data: { session: null },
      });

      const req = createMockRequest('/blog/some-post');
      await middleware(req);

      expect(_redirectCalled).toBe(false);
    });

    it('should pass through on /haven-blueprint', async () => {
      mockGetSession.mockResolvedValueOnce({
        data: { session: null },
      });

      const req = createMockRequest('/haven-blueprint');
      await middleware(req);

      expect(_redirectCalled).toBe(false);
    });

    it('should pass through on /templates/some-template', async () => {
      mockGetSession.mockResolvedValueOnce({
        data: { session: null },
      });

      const req = createMockRequest('/templates/some-template');
      await middleware(req);

      expect(_redirectCalled).toBe(false);
    });
  });

  // ── Missing env vars (VULNERABILITY) ──────────────────────────────────────
  describe('Missing environment variables (VULNERABILITY)', () => {
    it('should pass through protected routes when NEXT_PUBLIC_SUPABASE_URL is missing', async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;

      jest.resetModules();
      jest.doMock('@supabase/auth-helpers-nextjs', () => ({
        createServerClient: mockCreateServerClient,
      }));
      jest.doMock('next/server', () => ({
        __esModule: true,
        NextResponse: {
          next: () => { _nextCalled = true; return { cookies: { set: jest.fn() }, headers: new Map() }; },
          redirect: (url: any) => { _redirectCalled = true; _redirectArg = url; return { cookies: { set: jest.fn() }, headers: new Map() }; },
        },
      }));
      jest.doMock('next/dist/server/web/exports/next-response', () => ({
        __esModule: true,
        default: {
          next: () => { _nextCalled = true; return { cookies: { set: jest.fn() }, headers: new Map() }; },
          redirect: (url: any) => { _redirectCalled = true; _redirectArg = url; return { cookies: { set: jest.fn() }, headers: new Map() }; },
        },
      }));

      const { middleware: freshMiddleware } = await import('@/middleware');
      resetTrackers();

      const req = createMockRequest('/dashboard');
      await freshMiddleware(req);

      // VULNERABILITY: passes through without auth check
      expect(_redirectCalled).toBe(false);
      expect(mockCreateServerClient).not.toHaveBeenCalled();

      console.warn(
        '[VULNERABILITY CONFIRMED] Middleware passes through /dashboard ' +
          'without any auth check when NEXT_PUBLIC_SUPABASE_URL is missing. ' +
          'An attacker who can cause env var deletion gains access to all protected routes.'
      );
    });

    it('should pass through protected routes when NEXT_PUBLIC_SUPABASE_ANON_KEY is missing', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      jest.resetModules();
      jest.doMock('@supabase/auth-helpers-nextjs', () => ({
        createServerClient: mockCreateServerClient,
      }));
      jest.doMock('next/server', () => ({
        __esModule: true,
        NextResponse: {
          next: () => { _nextCalled = true; return { cookies: { set: jest.fn() }, headers: new Map() }; },
          redirect: (url: any) => { _redirectCalled = true; _redirectArg = url; return { cookies: { set: jest.fn() }, headers: new Map() }; },
        },
      }));
      jest.doMock('next/dist/server/web/exports/next-response', () => ({
        __esModule: true,
        default: {
          next: () => { _nextCalled = true; return { cookies: { set: jest.fn() }, headers: new Map() }; },
          redirect: (url: any) => { _redirectCalled = true; _redirectArg = url; return { cookies: { set: jest.fn() }, headers: new Map() }; },
        },
      }));

      const { middleware: freshMiddleware } = await import('@/middleware');
      resetTrackers();

      const req = createMockRequest('/classroom/admin');
      await freshMiddleware(req);

      expect(_redirectCalled).toBe(false);
      expect(mockCreateServerClient).not.toHaveBeenCalled();

      console.warn(
        '[VULNERABILITY CONFIRMED] Middleware passes through /classroom/admin ' +
          'without auth check when NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.'
      );
    });
  });

  // ── Matcher config ────────────────────────────────────────────────────────
  describe('Matcher configuration', () => {
    it('should have a matcher config defined', () => {
      expect(config).toBeDefined();
      expect(config.matcher).toBeDefined();
      expect(Array.isArray(config.matcher)).toBe(true);
      expect(config.matcher.length).toBeGreaterThan(0);
    });

    it('should exclude _next/static from matching', () => {
      const pattern = config.matcher[0];
      expect(pattern).toContain('_next/static');
    });

    it('should exclude _next/image from matching', () => {
      const pattern = config.matcher[0];
      expect(pattern).toContain('_next/image');
    });

    it('should exclude favicon.ico from matching', () => {
      const pattern = config.matcher[0];
      expect(pattern).toContain('favicon.ico');
    });

    it('should exclude images directory from matching', () => {
      const pattern = config.matcher[0];
      expect(pattern).toContain('images');
    });

    it('should exclude api routes from matching', () => {
      const pattern = config.matcher[0];
      expect(pattern).toContain('api');
    });

    it('should use negative lookahead pattern for exclusions', () => {
      const pattern = config.matcher[0];
      expect(pattern).toMatch(/\(\?!/);
    });
  });

  // ── Route protection completeness ─────────────────────────────────────────
  describe('Route protection completeness', () => {
    it('should document that /community is NOT protected by middleware', async () => {
      mockGetSession.mockResolvedValueOnce({
        data: { session: null },
      });

      const req = createMockRequest('/community');
      await middleware(req);

      expect(_redirectCalled).toBe(false);

      console.warn(
        '[AUTH GAP] /community passes through middleware without auth. ' +
          'Only client-side ProtectedRoute prevents unauthorized access.'
      );
    });

    it('should document that /members is NOT protected by middleware', async () => {
      mockGetSession.mockResolvedValueOnce({
        data: { session: null },
      });

      const req = createMockRequest('/members/some-user');
      await middleware(req);

      expect(_redirectCalled).toBe(false);

      console.warn(
        '[AUTH GAP] /members passes through middleware without auth. ' +
          'Member profile pages are only protected client-side.'
      );
    });
  });
});
