/**
 * useMentions Test Suite
 *
 * Tests for /src/hooks/useMentions.ts
 *
 * Key areas:
 * 1. Debounce behavior: searchMembers delays 300ms before querying
 * 2. BUG: Timer cleanup on unmount — timerRef is never cleared on unmount
 * 3. Empty/short query returns empty array
 * 4. Successful member search returns mapped MentionItem[]
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

// ---------------------------------------------------------------------------
// Helper: set up profiles query mock
// ---------------------------------------------------------------------------
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
// 1. Debounce behavior
// ---------------------------------------------------------------------------
describe('debounce', () => {
  it('delays the supabase query by 300ms', async () => {
    const builder = setupProfilesBuilder([
      { id: 'u1', display_name: 'Alice', avatar_url: null },
    ]);

    const { result } = renderHook(() => useMentions());

    let resultPromise: Promise<any>;
    act(() => {
      resultPromise = result.current.searchMembers('ali');
    });

    // Before 300ms: supabase should NOT have been called
    expect(builder.select).not.toHaveBeenCalled();

    // Advance past debounce
    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    const items = await resultPromise!;
    expect(builder.select).toHaveBeenCalled();
    expect(items).toEqual([
      { id: 'u1', label: 'Alice', avatar_url: null },
    ]);
  });

  it('cancels previous debounce when a new search is issued', async () => {
    const builder = setupProfilesBuilder([
      { id: 'u2', display_name: 'Bob', avatar_url: 'url' },
    ]);

    const { result } = renderHook(() => useMentions());

    // Issue first search
    act(() => {
      result.current.searchMembers('al');
    });

    // After 100ms, issue second search (cancels first)
    act(() => {
      jest.advanceTimersByTime(100);
    });

    let secondResult: Promise<any>;
    act(() => {
      secondResult = result.current.searchMembers('bob');
    });

    // Advance past second debounce
    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    const items = await secondResult!;

    // ilike should have only been called once (the second query, not the first)
    expect(builder.ilike).toHaveBeenCalledTimes(1);
    expect(builder.ilike).toHaveBeenCalledWith('display_name', '%bob%');
  });
});

// ---------------------------------------------------------------------------
// 2. BUG: Missing timer cleanup on unmount
// ---------------------------------------------------------------------------
describe('BUG: timer cleanup on unmount', () => {
  it('documents that timerRef is NOT cleared on component unmount', () => {
    /**
     * BUG DOCUMENTATION:
     *
     * useMentions.ts stores a setTimeout ID in `timerRef` (line 7) but
     * never clears it on unmount. There is no cleanup return in the hook.
     *
     * If the component unmounts while a debounced search is pending:
     * 1. The timeout fires after 300ms
     * 2. The async callback runs and calls supabase
     * 3. It attempts to resolve the Promise, but since the component
     *    is unmounted, React will warn about state updates on unmounted
     *    components (or silently leak if resolve is just a Promise callback)
     *
     * The fix is simple — add a cleanup effect:
     *
     *   useEffect(() => {
     *     return () => {
     *       if (timerRef.current) clearTimeout(timerRef.current);
     *     };
     *   }, []);
     *
     * Impact: Memory leak potential + React warnings in dev mode.
     * Severity: Low — the Promise just resolves to nowhere.
     */

    const builder = setupProfilesBuilder([]);
    const { result, unmount } = renderHook(() => useMentions());

    // Start a search
    act(() => {
      result.current.searchMembers('test');
    });

    // Unmount before debounce completes
    unmount();

    // The timer is still pending — advance to prove it fires
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // The timer fired and called supabase even after unmount
    // In a real app this would produce a React warning
    // This test documents the leak — it should NOT call supabase after unmount
    expect(builder.select).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// 3. Empty/short query
// ---------------------------------------------------------------------------
describe('empty or short query', () => {
  it('returns empty array for empty string', async () => {
    const { result } = renderHook(() => useMentions());

    let items: any[];
    await act(async () => {
      items = await result.current.searchMembers('');
    });

    expect(items!).toEqual([]);
    expect(mockSupabase.from).not.toHaveBeenCalled();
  });

  it('returns empty array when supabaseClient is null', async () => {
    mockContainer.supabase = null as any;

    const { result } = renderHook(() => useMentions());

    let items: any[];
    await act(async () => {
      items = await result.current.searchMembers('alice');
    });

    expect(items!).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// 4. Successful search returns mapped MentionItem[]
// ---------------------------------------------------------------------------
describe('successful search', () => {
  it('maps profiles to MentionItem format', async () => {
    setupProfilesBuilder([
      { id: 'u1', display_name: 'Alice Smith', avatar_url: 'https://example.com/alice.jpg' },
      { id: 'u2', display_name: 'Alicia Keys', avatar_url: null },
    ]);

    const { result } = renderHook(() => useMentions());

    let resultPromise: Promise<any>;
    act(() => {
      resultPromise = result.current.searchMembers('ali');
    });

    // Advance past debounce and flush microtasks
    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    const items = await resultPromise!;

    expect(items).toEqual([
      { id: 'u1', label: 'Alice Smith', avatar_url: 'https://example.com/alice.jpg' },
      { id: 'u2', label: 'Alicia Keys', avatar_url: null },
    ]);
  });

  it('returns empty array when supabase returns no data', async () => {
    setupProfilesBuilder(null as any);

    // Override the limit mock to return null data
    const builder = {
      select: jest.fn().mockReturnThis(),
      ilike: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: null, error: null }),
    };
    mockSupabase.from.mockImplementation(() => builder);

    const { result } = renderHook(() => useMentions());

    let items: any[];
    const promise = result.current.searchMembers('xyz');

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    items = await promise;
    expect(items).toEqual([]);
  });

  it('returns empty array when supabase throws', async () => {
    const builder = {
      select: jest.fn().mockReturnThis(),
      ilike: jest.fn().mockReturnThis(),
      limit: jest.fn().mockRejectedValue(new Error('Network error')),
    };
    mockSupabase.from.mockImplementation(() => builder);

    const { result } = renderHook(() => useMentions());

    const promise = result.current.searchMembers('test');

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    const items = await promise;
    expect(items).toEqual([]);
  });
});
