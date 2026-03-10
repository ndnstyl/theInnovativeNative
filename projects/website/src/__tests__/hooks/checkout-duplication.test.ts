/**
 * Checkout Duplication Test Suite
 *
 * This test documents that TWO separate checkout paths exist in the codebase:
 *
 *   1. useCourseCheckout (src/hooks/useCourseCheckout.ts)
 *      - Manually builds a URL with query params to a Supabase Edge Function
 *      - Uses window.location.href redirect
 *      - Requires: courseId, courseName, stripePriceId, price
 *      - Calls trackBeginCheckout analytics
 *
 *   2. useEnroll from useCourses (src/hooks/useCourses.ts, line 288-328)
 *      - Uses supabaseClient.functions.invoke('create-checkout')
 *      - Uses window.location.href redirect from response data.url
 *      - Requires: a Course object with stripe_price_id
 *      - Does NOT call analytics tracking
 *
 * Both paths target the same Supabase Edge Function ('create-checkout') but
 * with different invocation methods and parameter shapes.
 *
 * This duplication is a maintenance risk:
 * - Bug fixes to one path may not be applied to the other
 * - Analytics tracking is inconsistent (only useCourseCheckout tracks)
 * - Different error handling strategies
 * - The success/cancel redirect URLs may diverge
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
// 1. Both hooks exist and export a checkout function
// ---------------------------------------------------------------------------
describe('checkout path duplication', () => {
  it('useCourseCheckout exports startCheckout', () => {
    const { result } = renderHook(() => useCourseCheckout());
    expect(typeof result.current.startCheckout).toBe('function');
    expect(typeof result.current.loading).toBe('boolean');
  });

  it('useEnroll exports enroll', () => {
    const { result } = renderHook(() => useEnroll());
    expect(typeof result.current.enroll).toBe('function');
    expect(typeof result.current.loading).toBe('boolean');
  });

  it('DUPLICATION: both source files reference "create-checkout" endpoint', () => {
    /**
     * This test proves both paths target the same backend endpoint
     * by reading the source files directly.
     *
     * useCourseCheckout: Builds a URL string manually
     *   `${SUPABASE_URL}/functions/v1/create-checkout?price_id=...&user_id=...`
     *
     * useEnroll: Uses the Supabase SDK
     *   `supabaseClient.functions.invoke('create-checkout', { body: {...} })`
     *
     * This is a code smell -- there should be ONE checkout path.
     */
    const hooksDir = path.resolve(__dirname, '../../hooks');

    const checkoutSource = fs.readFileSync(
      path.join(hooksDir, 'useCourseCheckout.ts'),
      'utf-8'
    );
    const coursesSource = fs.readFileSync(
      path.join(hooksDir, 'useCourses.ts'),
      'utf-8'
    );

    // Both files reference 'create-checkout'
    expect(checkoutSource).toContain('create-checkout');
    expect(coursesSource).toContain('create-checkout');

    // useCourseCheckout builds URL manually
    expect(checkoutSource).toContain('functions/v1/create-checkout');

    // useEnroll uses SDK invoke
    expect(coursesSource).toContain("functions.invoke('create-checkout'");
  });
});

// ---------------------------------------------------------------------------
// 2. Analytics tracking inconsistency
// ---------------------------------------------------------------------------
describe('analytics tracking inconsistency', () => {
  it('useCourseCheckout calls trackBeginCheckout', () => {
    /**
     * We verify the import and call exist in the source, since actually
     * calling startCheckout would trigger window.location.href navigation.
     */
    const hooksDir = path.resolve(__dirname, '../../hooks');
    const source = fs.readFileSync(
      path.join(hooksDir, 'useCourseCheckout.ts'),
      'utf-8'
    );

    expect(source).toContain('trackBeginCheckout');
    expect(source).toContain("import { trackBeginCheckout }");
  });

  it('useEnroll does NOT call trackBeginCheckout -- analytics gap', () => {
    /**
     * BUG DOCUMENTATION:
     *
     * useEnroll (useCourses.ts line 288-328) redirects users to Stripe
     * checkout but does NOT fire any analytics event. This means:
     * - Checkout funnels tracked via analytics will undercount conversions
     * - Any component using useEnroll instead of useCourseCheckout
     *   will have invisible checkout starts
     *
     * useCourseCheckout correctly calls `trackBeginCheckout(courseId, courseName, price)`.
     */
    const hooksDir = path.resolve(__dirname, '../../hooks');
    const source = fs.readFileSync(
      path.join(hooksDir, 'useCourses.ts'),
      'utf-8'
    );

    // useCourses does NOT import or call trackBeginCheckout
    expect(source).not.toContain('trackBeginCheckout');
  });

  it('useEnroll via SDK invoke does not trigger analytics when called', async () => {
    mockSupabase.functions.invoke.mockResolvedValue({
      data: { url: 'https://checkout.stripe.com/session/def' },
      error: null,
    });

    const { result } = renderHook(() => useEnroll());

    await act(async () => {
      await result.current.enroll({
        id: 'course-2',
        stripe_price_id: 'price_def',
        is_free: false,
      } as any);
    });

    // trackBeginCheckout was NOT called by useEnroll
    expect(trackBeginCheckout).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// 3. Free course handling differences
// ---------------------------------------------------------------------------
describe('free course handling', () => {
  it('useCourseCheckout source has no is_free guard', () => {
    /**
     * useCourseCheckout has no check for course.is_free.
     * If called with a free course, it will still build a Stripe checkout URL
     * and redirect the user, potentially causing confusion or errors.
     */
    const hooksDir = path.resolve(__dirname, '../../hooks');
    const source = fs.readFileSync(
      path.join(hooksDir, 'useCourseCheckout.ts'),
      'utf-8'
    );

    // No reference to is_free anywhere in the file
    expect(source).not.toContain('is_free');
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
// 4. Error handling differences
// ---------------------------------------------------------------------------
describe('error handling differences', () => {
  it('useCourseCheckout has no try/catch or error state', () => {
    /**
     * useCourseCheckout builds a URL and sets window.location.href.
     * If the Edge Function returns an error, the user sees a browser error page
     * or a blank page -- there is no try/catch or error state.
     */
    const hooksDir = path.resolve(__dirname, '../../hooks');
    const source = fs.readFileSync(
      path.join(hooksDir, 'useCourseCheckout.ts'),
      'utf-8'
    );

    // No try/catch block in the startCheckout function
    expect(source).not.toContain('try {');
    expect(source).not.toContain('catch');

    // No error state
    const { result } = renderHook(() => useCourseCheckout());
    expect(result.current).not.toHaveProperty('error');
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
