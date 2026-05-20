/**
 * useEvents Test Suite
 *
 * Tests for /src/hooks/useEvents.ts
 *
 * Key areas:
 * 1. BUG: categoryId filter is listed as a dependency but NEVER applied to the query
 * 2. View switching (upcoming vs past)
 * 3. Pagination behavior
 * 4. Event data mapping
 */

import { renderHook, act, waitFor } from '@testing-library/react';

const { createSupabaseMock } = require('../../../__mocks__/supabaseMock');

const mockContainer = {
  supabase: createSupabaseMock() as ReturnType<typeof createSupabaseMock>,
};

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    supabaseClient: mockContainer.supabase,
  }),
}));

import { useEvents } from '@/hooks/useEvents';

let mockSupabase: ReturnType<typeof createSupabaseMock>;

beforeEach(() => {
  mockContainer.supabase = createSupabaseMock();
  mockSupabase = mockContainer.supabase;
});

// ---------------------------------------------------------------------------
// Helper: set up event_occurrences query
// ---------------------------------------------------------------------------
function setupEventsBuilder(data: any[] = []) {
  const builder = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    range: jest.fn().mockResolvedValue({ data, error: null }),
  };
  mockSupabase.from.mockImplementation((table: string) => {
    if (table === 'event_occurrences') return builder;
    return createSupabaseMock().from();
  });
  return builder;
}

// ---------------------------------------------------------------------------
// 1. BUG: categoryId filter is never applied to the query
// ---------------------------------------------------------------------------
describe('BUG: categoryId filter is a no-op', () => {
  it('categoryId is in useCallback dependencies but never used in the query', async () => {
    /**
     * BUG DOCUMENTATION:
     *
     * In useEvents.ts, the fetchEvents callback (line 30-127) includes
     * `categoryId` in its dependency array (line 127):
     *
     *   }, [supabaseClient, view, categoryId, page]);
     *
     * The hook exposes a `filterByCategory` function (line 138-141) that
     * sets `categoryId` state. When categoryId changes, fetchEvents re-runs
     * because it's a dependency.
     *
     * HOWEVER: Inside fetchEvents, `categoryId` is NEVER used.
     *
     * The query builds from `event_occurrences` with a join to `events`,
     * and the events table HAS a `category_id` column (visible in the
     * select statement on line 58). But there is NO `.eq('events.category_id', categoryId)`
     * or equivalent filter anywhere in fetchEvents.
     *
     * This means:
     * - The UI will re-fetch when a user clicks a category filter
     * - But it returns the SAME unfiltered data every time
     * - The user sees no change despite the filter "working"
     *
     * Recommended fix: Add this after the view filter block:
     *
     *   if (categoryId) {
     *     query = query.eq('events.category_id', categoryId);
     *   }
     *
     * Impact: Category filtering in the events UI is completely broken.
     */

    const mockEvents = [
      {
        id: 'occ-1',
        event_id: 'evt-1',
        community_id: 'c1',
        start_time: '2026-06-01T10:00:00Z',
        end_time: '2026-06-01T12:00:00Z',
        title_override: null,
        description_override: null,
        location_override: null,
        status: 'upcoming',
        rsvp_count: 5,
        events: {
          id: 'evt-1',
          title: 'Workshop A',
          description: 'A workshop',
          location_url: null,
          cover_image_url: null,
          created_by: 'host-1',
          capacity: 50,
          timezone: 'America/Denver',
          category_id: 'cat-MUSIC', // This event is in the MUSIC category
          recurrence_rule: null,
          event_categories: { name: 'Music', color: '#ff0000' },
          profiles: { display_name: 'Host', avatar_url: null },
        },
      },
      {
        id: 'occ-2',
        event_id: 'evt-2',
        community_id: 'c1',
        start_time: '2026-06-02T10:00:00Z',
        end_time: '2026-06-02T12:00:00Z',
        title_override: null,
        description_override: null,
        location_override: null,
        status: 'upcoming',
        rsvp_count: 3,
        events: {
          id: 'evt-2',
          title: 'Workshop B',
          description: 'B workshop',
          location_url: null,
          cover_image_url: null,
          created_by: 'host-2',
          capacity: 30,
          timezone: 'America/Denver',
          category_id: 'cat-ART', // Different category
          recurrence_rule: null,
          event_categories: { name: 'Art', color: '#00ff00' },
          profiles: { display_name: 'Host 2', avatar_url: null },
        },
      },
    ];

    const builder = setupEventsBuilder(mockEvents);

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Both events returned (no filter)
    expect(result.current.events).toHaveLength(2);

    // Now apply a category filter
    builder.range.mockResolvedValue({ data: mockEvents, error: null });

    await act(async () => {
      result.current.filterByCategory('cat-MUSIC');
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // BUG: Still returns BOTH events because categoryId is never applied to the query.
    // If the filter worked, it would only return the Music event.
    expect(result.current.events).toHaveLength(2);

    // Verify that .eq was NEVER called with category_id
    // (This proves the filter is never applied)
    const eqCalls = builder.eq.mock.calls;
    const hasCategoryFilter = eqCalls.some(
      (call: any[]) => call[0] === 'events.category_id' || call[0] === 'category_id'
    );
    expect(hasCategoryFilter).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 2. View switching
// ---------------------------------------------------------------------------
describe('view switching', () => {
  it('defaults to "upcoming" view', () => {
    setupEventsBuilder();

    const { result } = renderHook(() => useEvents());

    expect(result.current.view).toBe('upcoming');
  });

  it('switches to "past" view and resets page to 0', async () => {
    const builder = setupEventsBuilder();

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setView('past');
    });

    expect(result.current.view).toBe('past');

    // The in() filter should change to include 'completed' and 'cancelled'
    await waitFor(() => {
      const inCalls = builder.in.mock.calls;
      const lastCall = inCalls[inCalls.length - 1];
      expect(lastCall[0]).toBe('status');
      expect(lastCall[1]).toContain('completed');
      expect(lastCall[1]).toContain('cancelled');
    });
  });

  it('upcoming view filters by gte(start_time, now) and orders ascending', async () => {
    const builder = setupEventsBuilder();

    renderHook(() => useEvents());

    await waitFor(() => {
      expect(builder.gte).toHaveBeenCalled();
    });

    expect(builder.gte).toHaveBeenCalledWith('start_time', expect.any(String));
    expect(builder.order).toHaveBeenCalledWith('start_time', { ascending: true });
  });
});

// ---------------------------------------------------------------------------
// 3. Event data mapping
// ---------------------------------------------------------------------------
describe('event data mapping', () => {
  it('maps event_occurrences with nested event data correctly', async () => {
    const mockEvent = {
      id: 'occ-1',
      event_id: 'evt-1',
      community_id: 'c1',
      start_time: '2026-06-01T10:00:00Z',
      end_time: '2026-06-01T12:00:00Z',
      title_override: 'Special Title',
      description_override: null,
      location_override: null,
      status: 'upcoming',
      rsvp_count: 10,
      events: {
        id: 'evt-1',
        title: 'Regular Title',
        description: 'Description here',
        location_url: 'https://zoom.us/meeting',
        cover_image_url: 'https://example.com/cover.jpg',
        created_by: 'host-1',
        capacity: 100,
        timezone: 'America/Denver',
        category_id: 'cat-1',
        recurrence_rule: 'FREQ=WEEKLY',
        event_categories: { name: 'Workshop', color: '#123456' },
        profiles: { display_name: 'Mike', avatar_url: 'https://example.com/mike.jpg' },
      },
    };

    setupEventsBuilder([mockEvent]);

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const event = result.current.events[0];
    expect(event).toMatchObject({
      event_id: 'evt-1',
      title: 'Regular Title',
      host_name: 'Mike',
      host_avatar: 'https://example.com/mike.jpg',
      category_name: 'Workshop',
      category_color: '#123456',
      occurrence_id: 'occ-1',
      start_time: '2026-06-01T10:00:00Z',
      rsvp_count: 10,
      recurrence_rule: 'FREQ=WEEKLY',
      timezone: 'America/Denver',
    });

    // title_override should take precedence in display_title
    expect(event.display_title).toBe('Special Title');
    // description_override is null, so display_description uses the event description
    expect(event.display_description).toBe('Description here');
  });

  it('uses fallback values when nested data is missing', async () => {
    const mockEvent = {
      id: 'occ-1',
      event_id: 'evt-1',
      community_id: 'c1',
      start_time: '2026-06-01T10:00:00Z',
      end_time: '2026-06-01T12:00:00Z',
      title_override: null,
      description_override: null,
      location_override: null,
      status: 'upcoming',
      rsvp_count: 0,
      events: {
        id: 'evt-1',
        title: null,
        description: null,
        location_url: null,
        cover_image_url: null,
        created_by: null,
        capacity: null,
        timezone: null,
        category_id: null,
        recurrence_rule: null,
        event_categories: null,
        profiles: null,
      },
    };

    setupEventsBuilder([mockEvent]);

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const event = result.current.events[0];
    expect(event.host_name).toBe('Unknown');
    expect(event.host_avatar).toBeUndefined();
    expect(event.category_name).toBeNull();
    expect(event.capacity).toBe(0);
    expect(event.timezone).toBe('UTC');
    expect(event.display_title).toBe('');
  });
});

// ---------------------------------------------------------------------------
// 4. Pagination
// ---------------------------------------------------------------------------
describe('pagination', () => {
  it('hasMore is true when results equal PAGE_SIZE (20)', async () => {
    const mockEvents = Array.from({ length: 20 }, (_, i) => ({
      id: `occ-${i}`,
      event_id: `evt-${i}`,
      community_id: 'c1',
      start_time: `2026-06-${String(i + 1).padStart(2, '0')}T10:00:00Z`,
      end_time: `2026-06-${String(i + 1).padStart(2, '0')}T12:00:00Z`,
      title_override: null,
      description_override: null,
      location_override: null,
      status: 'upcoming',
      rsvp_count: 0,
      events: {
        id: `evt-${i}`, title: `Event ${i}`, description: null,
        location_url: null, cover_image_url: null, created_by: null,
        capacity: 0, timezone: 'UTC', category_id: null, recurrence_rule: null,
        event_categories: null, profiles: null,
      },
    }));

    setupEventsBuilder(mockEvents);

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasMore).toBe(true);
  });

  it('hasMore is false when results are fewer than PAGE_SIZE', async () => {
    setupEventsBuilder([{
      id: 'occ-1', event_id: 'evt-1', community_id: 'c1',
      start_time: '2026-06-01T10:00:00Z', end_time: '2026-06-01T12:00:00Z',
      title_override: null, description_override: null, location_override: null,
      status: 'upcoming', rsvp_count: 0,
      events: {
        id: 'evt-1', title: 'Solo Event', description: null,
        location_url: null, cover_image_url: null, created_by: null,
        capacity: 0, timezone: 'UTC', category_id: null, recurrence_rule: null,
        event_categories: null, profiles: null,
      },
    }]);

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasMore).toBe(false);
  });

  it('setPage changes the range offset', async () => {
    const builder = setupEventsBuilder([]);

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // First call should be range(0, 19) for page 0
    expect(builder.range).toHaveBeenCalledWith(0, 19);

    act(() => {
      result.current.setPage(2);
    });

    await waitFor(() => {
      // Page 2 means range(40, 59)
      expect(builder.range).toHaveBeenCalledWith(40, 59);
    });
  });
});

// ---------------------------------------------------------------------------
// 5. Error handling
// ---------------------------------------------------------------------------
describe('error handling', () => {
  it('sets error state when fetch throws', async () => {
    const builder = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      range: jest.fn().mockRejectedValue(new Error('DB down')),
    };
    mockSupabase.from.mockImplementation(() => builder);

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('DB down');
  });

  it('does nothing when supabaseClient is null', () => {
    mockContainer.supabase = null as any;

    const { result } = renderHook(() => useEvents());

    // Should not crash, just stay in loading state
    expect(result.current.events).toEqual([]);
  });
});
