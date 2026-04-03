/**
 * Checkout Consolidation Test Suite
 *
 * Verifies that the checkout path duplication has been resolved:
 *
 *   1. useCourseCheckout (src/hooks/useCourseCheckout.ts) — canonical checkout hook
 *      - Uses supabaseClient.functions.invoke('create-checkout')
 *      - Handles free course guard (is_free)
 *      - Calls trackBeginCheckout analytics
 *      - Has try/catch with error state
 *
 *   2. useEnroll from useCourses (src/hooks/useCourses.ts)
 *      - Delegates to useCourseCheckout internally
 *      - Maintains backwards-compatible API for EnrollButton
 */

import * as fs from 'fs';
import * as path from 'path';

const { createSupabaseMock } = require('../../../__mocks__/supabaseMock');

const mockContainer = {
  supabase: createSupabaseMock(),
};

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    supabaseClient: mockContainer.supabase,
    session: { user: { id: 'user-123', email: 'test@example.com' } },
    role: 'member',
  }),
}));

jest.mock('@/lib/analytics', () => ({
  trackBeginCheckout: jest.fn(),
}));

import { renderHook, act } from '@testing-library/react';
import { useCourseCheckout } from '@/hooks/useCourseCheckout';
import { useEnroll } from '@/hooks/useCourses';
import { trackBeginCheckout } from '@/lib/analytics';

let mockSupabase: ReturnType<typeof createSupabaseMock>;

beforeEach(() => {
  mockContainer.supabase = createSupabaseMock();
  mockSupabase = mockContainer.supabase;
  (trackBeginCheckout as jest.Mock).mockClear();
});

// ---------------------------------------------------------------------------
// 1. Both hooks exist and export their checkout functions
// ---------------------------------------------------------------------------
describe('checkout consolidation', () => {
  it('useCourseCheckout exports startCheckout, loading, and error', () => {
    const { result } = renderHook(() => useCourseCheckout());
    expect(typeof result.current.startCheckout).toBe('function');
    expect(typeof result.current.loading).toBe('boolean');
    expect(result.current.error).toBeNull();
  });

  it('useEnroll exports enroll and loading (backwards-compatible API)', () => {
    const { result } = renderHook(() => useEnroll());
    expect(typeof result.current.enroll).toBe('function');
    expect(typeof result.current.loading).toBe('boolean');
  });

  it('RESOLVED: both paths now use the same checkout implementation', () => {
    /**
     * useEnroll now delegates to useCourseCheckout instead of having
     * its own inline checkout logic. Verify by checking the source.
     */
    const hooksDir = path.resolve(__dirname, '../../hooks');
    const coursesSource = fs.readFileSync(
      path.join(hooksDir, 'useCourses.ts'),
      'utf-8',
    );

    // useEnroll should import and delegate to useCourseCheckout
    expect(coursesSource).toContain('useCourseCheckout');
    // useEnroll should NOT directly invoke the edge function anymore
    expect(coursesSource).not.toContain("functions.invoke('create-checkout'");
  });
});

// ---------------------------------------------------------------------------
// 2. Analytics tracking is now consistent
// ---------------------------------------------------------------------------
describe('analytics tracking', () => {
  it('useCourseCheckout source contains trackBeginCheckout', () => {
    const hooksDir = path.resolve(__dirname, '../../hooks');
    const source = fs.readFileSync(
      path.join(hooksDir, 'useCourseCheckout.ts'),
      'utf-8',
    );

    expect(source).toContain('trackBeginCheckout');
    expect(source).toContain("import { trackBeginCheckout }");
  });

  it('useEnroll inherits analytics tracking via delegation', () => {
    /**
     * Since useEnroll delegates to useCourseCheckout, all analytics
     * tracking is handled by the canonical hook. No separate tracking needed.
     */
    const hooksDir = path.resolve(__dirname, '../../hooks');
    const source = fs.readFileSync(
      path.join(hooksDir, 'useCourses.ts'),
      'utf-8',
    );

    // useCourses should import useCourseCheckout (delegation)
    expect(source).toContain('useCourseCheckout');
  });
});

// ---------------------------------------------------------------------------
// 3. Free course handling
// ---------------------------------------------------------------------------
describe('free course handling', () => {
  it('useCourseCheckout now has is_free guard', () => {
    const hooksDir = path.resolve(__dirname, '../../hooks');
    const source = fs.readFileSync(
      path.join(hooksDir, 'useCourseCheckout.ts'),
      'utf-8',
    );

    expect(source).toContain('is_free');
  });

  it('useEnroll correctly skips checkout for free courses', async () => {
    const { result } = renderHook(() => useEnroll());

    await act(async () => {
      await result.current.enroll({
        id: 'free-course',
        stripe_price_id: null,
        is_free: true,
      } as any);
    });

    // Should NOT call functions.invoke for free courses
    expect(mockSupabase.functions.invoke).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// 4. Error handling
// ---------------------------------------------------------------------------
describe('error handling', () => {
  it('useCourseCheckout has try/catch and error state', () => {
    const hooksDir = path.resolve(__dirname, '../../hooks');
    const source = fs.readFileSync(
      path.join(hooksDir, 'useCourseCheckout.ts'),
      'utf-8',
    );

    expect(source).toContain('try {');
    expect(source).toContain('catch');

    const { result } = renderHook(() => useCourseCheckout());
    expect(result.current).toHaveProperty('error');
  });

  it('useEnroll handles errors without crashing', async () => {
    mockSupabase.functions.invoke.mockResolvedValue({
      data: null,
      error: { message: 'Edge function failed' },
    });

    const { result } = renderHook(() => useEnroll());

    await act(async () => {
      await result.current.enroll({
        id: 'course-1',
        stripe_price_id: 'price_abc',
        is_free: false,
      } as any);
    });

    // useEnroll should handle the error gracefully (no crash)
    expect(result.current.loading).toBe(false);
  });
});
