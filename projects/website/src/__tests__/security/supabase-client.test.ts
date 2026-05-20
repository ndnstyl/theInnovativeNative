/**
 * Security Test: Supabase Client Configuration
 *
 * Tests the Supabase browser client initialization patterns,
 * singleton behavior, error handling for missing env vars,
 * and the proxy getter pattern.
 */

// ─── Mocks ─────────────────────────────────────────────────────────────────────

const mockCreateBrowserClient = jest.fn(() => ({
  _isMockClient: true,
  auth: { getSession: jest.fn() },
}));

jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createBrowserClient: (...args: any[]) => mockCreateBrowserClient(...args),
}));

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe('Supabase Client Security', () => {
  // Reset modules between tests so singleton state is fresh
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    // Re-mock after reset
    jest.doMock('@supabase/auth-helpers-nextjs', () => ({
      createBrowserClient: (...args: any[]) => mockCreateBrowserClient(...args),
    }));
  });

  // ── Missing env vars ──────────────────────────────────────────────────────
  describe('Missing environment variables', () => {
    it('should throw descriptive error when NEXT_PUBLIC_SUPABASE_URL is missing', async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';

      const { getSupabaseBrowserClient } = await import('@/lib/supabase');

      expect(() => getSupabaseBrowserClient()).toThrow(
        'Missing NEXT_PUBLIC_SUPABASE_URL environment variable'
      );
    });

    it('should throw descriptive error when NEXT_PUBLIC_SUPABASE_ANON_KEY is missing', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const { getSupabaseBrowserClient } = await import('@/lib/supabase');

      expect(() => getSupabaseBrowserClient()).toThrow(
        'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable'
      );
    });

    it('should throw descriptive error when both env vars are missing', async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const { getSupabaseBrowserClient } = await import('@/lib/supabase');

      // Should throw for URL first (it's checked first)
      expect(() => getSupabaseBrowserClient()).toThrow(
        'Missing NEXT_PUBLIC_SUPABASE_URL environment variable'
      );
    });

    it('should throw on createBrowserClient when env vars are missing', async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const { createBrowserClient } = await import('@/lib/supabase');

      expect(() => createBrowserClient()).toThrow();
    });
  });

  // ── Singleton behavior ────────────────────────────────────────────────────
  describe('Singleton pattern (getSupabaseBrowserClient)', () => {
    it('should return the same instance on multiple calls', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

      const { getSupabaseBrowserClient } = await import('@/lib/supabase');

      const client1 = getSupabaseBrowserClient();
      const client2 = getSupabaseBrowserClient();

      expect(client1).toBe(client2);
      // createBrowserClient should only be called once
      expect(mockCreateBrowserClient).toHaveBeenCalledTimes(1);
    });

    it('should call createBrowserClient with correct URL and key', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://myproject.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'my-anon-key-123';

      const { getSupabaseBrowserClient } = await import('@/lib/supabase');
      getSupabaseBrowserClient();

      expect(mockCreateBrowserClient).toHaveBeenCalledWith(
        'https://myproject.supabase.co',
        'my-anon-key-123'
      );
    });
  });

  // ── createBrowserClient (non-singleton) ───────────────────────────────────
  describe('createBrowserClient (non-singleton)', () => {
    it('should create new instances on each call', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

      // Make the mock return different objects
      let callCount = 0;
      mockCreateBrowserClient.mockImplementation(() => ({
        _instance: ++callCount,
        auth: { getSession: jest.fn() },
      }));

      const { createBrowserClient } = await import('@/lib/supabase');

      const client1 = createBrowserClient();
      const client2 = createBrowserClient();

      // Each call creates a new instance
      expect(mockCreateBrowserClient).toHaveBeenCalledTimes(2);
      expect((client1 as any)._instance).not.toBe((client2 as any)._instance);
    });
  });

  // ── Proxy getter (supabase.client) ────────────────────────────────────────
  describe('Proxy getter (supabase.client)', () => {
    it('should lazily initialize the client via getter', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

      const mod = await import('@/lib/supabase');

      // Accessing .client should trigger initialization
      expect(mockCreateBrowserClient).not.toHaveBeenCalled();
      const client = mod.supabase.client;
      expect(mockCreateBrowserClient).toHaveBeenCalledTimes(1);
      expect(client).toBeDefined();
    });

    it('should return same singleton instance as getSupabaseBrowserClient', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

      const { supabase, getSupabaseBrowserClient } = await import(
        '@/lib/supabase'
      );

      const fromGetter = supabase.client;
      const fromFunction = getSupabaseBrowserClient();

      expect(fromGetter).toBe(fromFunction);
      expect(mockCreateBrowserClient).toHaveBeenCalledTimes(1);
    });

    it('should throw when accessed without env vars', async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const { supabase } = await import('@/lib/supabase');

      expect(() => supabase.client).toThrow();
    });
  });

  // ── Security properties ───────────────────────────────────────────────────
  describe('Security properties', () => {
    it('should use anon key (not service role key)', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test';

      const { getSupabaseBrowserClient } = await import('@/lib/supabase');
      getSupabaseBrowserClient();

      const passedKey = mockCreateBrowserClient.mock.calls[0][1];
      // Browser client should NEVER use service_role key
      expect(passedKey).not.toContain('service_role');
      // Should use the NEXT_PUBLIC_ prefixed key (anon key)
      expect(passedKey).toBe(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    });

    it('should flag if SUPABASE_SERVICE_ROLE_KEY is accidentally used', async () => {
      // This tests that the code references the correct env var
      const supabaseModule = require('fs').readFileSync(
        require('path').resolve(__dirname, '../../lib/supabase.ts'),
        'utf-8'
      );

      expect(supabaseModule).not.toContain('SUPABASE_SERVICE_ROLE_KEY');
      expect(supabaseModule).toContain('NEXT_PUBLIC_SUPABASE_URL');
      expect(supabaseModule).toContain('NEXT_PUBLIC_SUPABASE_ANON_KEY');
    });
  });
});
