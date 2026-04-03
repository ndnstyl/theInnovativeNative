/**
 * useMentions Timer Cleanup Fix — Regression Test
 * =================================================
 * Verifies that the debounce timer in useMentions is properly cleaned up
 * on component unmount, preventing memory leaks and stale callbacks.
 *
 * Related bug: timerRef.current was never cleared on unmount.
 * Fix: Added useEffect cleanup that clears the pending timeout.
 */

import { renderHook, act } from '@testing-library/react';

const { createSupabaseMock } = require('../../../__mocks__/supabaseMock');

const mockContainer = {
  supabase: createSupabaseMock() as ReturnType<typeof createSupabaseMock>,
};

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    supabaseClient: mockContainer.supabase,
  }),
}));

import { useMentions } from '@/hooks/useMentions';

let mockSupabase: ReturnType<typeof createSupabaseMock>;

beforeEach(() => {
  mockContainer.supabase = createSupabaseMock();
  mockSupabase = mockContainer.supabase;
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

function setupProfilesBuilder(data: any[] = []) {
  const builder = {
    select: jest.fn().mockReturnThis(),
    ilike: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue({ data, error: null }),
  };
  mockSupabase.from.mockImplementation((table: string) => {
    if (table === 'profiles') return builder;
    return createSupabaseMock().from();
  });
  return builder;
}

// ---------------------------------------------------------------------------
// Timer cleanup on unmount (this is the FIX verification)
// ---------------------------------------------------------------------------
describe('useMentions: timer cleanup on unmount (FIX)', () => {
  it('does NOT fire the debounced query after unmount', () => {
    const builder = setupProfilesBuilder([]);
    const { result, unmount } = renderHook(() => useMentions());

    // Start a search — sets a 300ms debounce timer
    act(() => {
      result.current.searchMembers('test');
    });

    // Unmount before debounce completes
    unmount();

    // Advance past debounce
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // After the fix, the timer should have been cleared on unmount,
    // so supabase should NOT have been called
    expect(builder.select).not.toHaveBeenCalled();
  });

  it('does NOT fire multiple stale timers after unmount', () => {
    const builder = setupProfilesBuilder([]);
    const { result, unmount } = renderHook(() => useMentions());

    // Start multiple searches
    act(() => {
      result.current.searchMembers('first');
    });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    act(() => {
      result.current.searchMembers('second');
    });

    // Unmount with the second timer still pending
    unmount();

    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Neither timer should have fired
    expect(builder.select).not.toHaveBeenCalled();
  });

  it('still works normally before unmount (no regression)', async () => {
    const builder = setupProfilesBuilder([
      { id: 'u1', display_name: 'Alice', avatar_url: null },
    ]);

    const { result } = renderHook(() => useMentions());

    let resultPromise: Promise<any>;
    act(() => {
      resultPromise = result.current.searchMembers('ali');
    });

    // Before debounce: not called
    expect(builder.select).not.toHaveBeenCalled();

    // After debounce: should fire normally
    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    const items = await resultPromise!;
    expect(builder.select).toHaveBeenCalled();
    expect(items).toEqual([
      { id: 'u1', label: 'Alice', avatar_url: null },
    ]);
  });
});
