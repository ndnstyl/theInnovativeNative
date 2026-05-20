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

// Mock NextResponse as a class with constructor (for `new NextResponse(null, { status: 403 })`)
// and static methods (for NextResponse.next() and NextResponse.redirect())
function createMockNextResponse() {
  class MockNextResponse {
    status: number;
    cookies = { set: jest.fn() };
    headers = new Map();
    constructor(body: any, init?: any) {
      this.status = init?.status ?? 200;
    }
    static next(opts?: any) {
      _nextCalled = true;
      const resp = new MockNextResponse(null);
      return resp;
    }
    static redirect(url: any) {
      _redirectCalled = true;
      _redirectArg = url;
      const resp = new MockNextResponse(null);
      return resp;
    }
  }
  return MockNextResponse;
}

// Mock the entire next/server import chain to avoid Edge Runtime API issues
jest.mock('next/server', () => ({
  __esModule: true,
  NextResponse: createMockNextResponse(),
}));

// Also mock the internal next module that next/server re-exports from
jest.mock('next/dist/server/web/exports/next-response', () => ({
  __esModule: true,
  default: createMockNextResponse(),
}));

// ─── Helpers ───────────────────────────────────────────────────────────────────

function createMockRequest(pathname: string, origin = 'https://example.com') {
  const url = new URL(pathname, origin);
  const headersMap = new Map<string, string>();
  return {
    cookies: {
      getAll: jest.fn(() => []),
      set: jest.fn(),
    },
    headers: {
      ...headersMap,
      get: (key: string) => headersMap.get(key) ?? null,
      set: (key: string, value: string) => headersMap.set(key, value),
      has: (key: string) => headersMap.has(key),
      forEach: (cb: Function) => headersMap.forEach((v, k) => cb(v, k)),
      [Symbol.iterator]: () => headersMap[Symbol.iterator](),
    },
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

    it('should pass through on /twingen', async () => {
      mockGetSession.mockResolvedValueOnce({
        data: { session: null },
      });

      const req = createMockRequest('/twingen');
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

  // ── Missing env vars (FIXED — returns 503) ─────────────────────────────────
  describe('Missing environment variables (returns 503)', () => {
    let _503Called = false;
    let _503Status: number | null = null;

    it('should return 503 for protected routes when NEXT_PUBLIC_SUPABASE_URL is missing', async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;

      jest.resetModules();
      jest.doMock('@supabase/auth-helpers-nextjs', () => ({
        createServerClient: mockCreateServerClient,
      }));
      jest.doMock('next/server', () => ({
        __esModule: true,
        NextResponse: class {
          status: number;
          cookies = { set: jest.fn() };
          headers = new Map();
          constructor(body: any, init?: any) {
            this.status = init?.status ?? 200;
            _503Status = this.status;
            if (this.status === 503) _503Called = true;
          }
          static next(opts?: any) {
            _nextCalled = true;
            return { cookies: { set: jest.fn() }, headers: new Map() };
          }
          static redirect(url: any) {
            _redirectCalled = true;
            _redirectArg = url;
            return { cookies: { set: jest.fn() }, headers: new Map() };
          }
        },
      }));
      const MockNextResponse = class {
        status: number;
        cookies = { set: jest.fn() };
        headers = new Map();
        constructor(body: any, init?: any) {
          this.status = init?.status ?? 200;
          _503Status = this.status;
          if (this.status === 503) _503Called = true;
        }
        static next(opts?: any) {
          _nextCalled = true;
          return { cookies: { set: jest.fn() }, headers: new Map() };
        }
        static redirect(url: any) {
          _redirectCalled = true;
          _redirectArg = url;
          return { cookies: { set: jest.fn() }, headers: new Map() };
        }
      };
      jest.doMock('next/dist/server/web/exports/next-response', () => ({
        __esModule: true,
        default: MockNextResponse,
      }));

      const { middleware: freshMiddleware } = await import('@/middleware');
      resetTrackers();
      _503Called = false;
      _503Status = null;

      const req = createMockRequest('/dashboard');
      const result = await freshMiddleware(req);

      // FIXED: protected routes get 503 when env vars are missing
      expect(result?.status ?? _503Status).toBe(503);
      expect(mockCreateServerClient).not.toHaveBeenCalled();
    });

    it('should return 503 for protected routes when NEXT_PUBLIC_SUPABASE_ANON_KEY is missing', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      jest.resetModules();
      jest.doMock('@supabase/auth-helpers-nextjs', () => ({
        createServerClient: mockCreateServerClient,
      }));
      jest.doMock('next/server', () => ({
        __esModule: true,
        NextResponse: class {
          status: number;
          cookies = { set: jest.fn() };
          headers = new Map();
          constructor(body: any, init?: any) {
            this.status = init?.status ?? 200;
            _503Status = this.status;
            if (this.status === 503) _503Called = true;
          }
          static next(opts?: any) {
            _nextCalled = true;
            return { cookies: { set: jest.fn() }, headers: new Map() };
          }
          static redirect(url: any) {
            _redirectCalled = true;
            _redirectArg = url;
            return { cookies: { set: jest.fn() }, headers: new Map() };
          }
        },
      }));
      const MockNextResponse2 = class {
        status: number;
        cookies = { set: jest.fn() };
        headers = new Map();
        constructor(body: any, init?: any) {
          this.status = init?.status ?? 200;
          _503Status = this.status;
          if (this.status === 503) _503Called = true;
        }
        static next(opts?: any) {
          _nextCalled = true;
          return { cookies: { set: jest.fn() }, headers: new Map() };
        }
        static redirect(url: any) {
          _redirectCalled = true;
          _redirectArg = url;
          return { cookies: { set: jest.fn() }, headers: new Map() };
        }
      };
      jest.doMock('next/dist/server/web/exports/next-response', () => ({
        __esModule: true,
        default: MockNextResponse2,
      }));

      const { middleware: freshMiddleware } = await import('@/middleware');
      resetTrackers();
      _503Called = false;
      _503Status = null;

      const req = createMockRequest('/classroom/admin');
      const result = await freshMiddleware(req);

      // FIXED: protected routes get 503 when env vars are missing
      expect(result?.status ?? _503Status).toBe(503);
      expect(mockCreateServerClient).not.toHaveBeenCalled();
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
    it('should redirect unauthenticated user from /community (regression guard)', async () => {
      mockGetSession.mockResolvedValueOnce({
        data: { session: null },
      });

      const req = createMockRequest('/community');
      await middleware(req);

      // FIXED: /community is now in protectedRoutes
      expect(_redirectCalled).toBe(true);
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

  // ── CVE-2025-29927 mitigation ──────────────────────────────────────────────
  describe('CVE-2025-29927 mitigation', () => {
    it('blocks requests with x-middleware-subrequest header (CVE-2025-29927)', async () => {
      const req = createMockRequest('/dashboard');
      // Inject the attack header
      const origGet = req.headers.get;
      req.headers.get = (key: string) => {
        if (key === 'x-middleware-subrequest') return 'middleware:middleware';
        return origGet(key);
      };

      const result = await middleware(req);

      // Middleware should block this request with 403
      expect(result).toBeDefined();
      expect(result.status).toBe(403);
      // Should NOT have proceeded to auth check
      expect(mockCreateServerClient).not.toHaveBeenCalled();
    });
  });
});
