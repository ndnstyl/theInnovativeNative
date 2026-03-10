/**
 * useNotifications + useNotificationCount Test Suite
 *
 * Tests for:
 *   /src/hooks/useNotifications.ts
 *   /src/hooks/useNotificationCount.ts
 *
 * Key areas:
 * 1. Both hooks create SEPARATE realtime subscriptions (documented duplication)
 * 2. Notification fetching works correctly
 * 3. markAsRead / markAllRead optimistic updates
 * 4. Pagination (loadMore)
 * 5. Realtime subscription setup and cleanup
 */

import { renderHook, act, waitFor } from '@testing-library/react';

const { createSupabaseMock } = require('../../../__mocks__/supabaseMock');

const mockContainer = {
  supabase: createSupabaseMock(),
  session: { user: { id: 'user-123' } } as any,
};

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    supabaseClient: mockContainer.supabase,
    session: mockContainer.session,
  }),
}));

import { useNotifications } from '@/hooks/useNotifications';
import { useNotificationCount } from '@/hooks/useNotificationCount';

let mockSupabase: ReturnType<typeof createSupabaseMock>;

beforeEach(() => {
  mockContainer.supabase = createSupabaseMock();
  mockContainer.session = { user: { id: 'user-123' } };
  mockSupabase = mockContainer.supabase;
});

// ---------------------------------------------------------------------------
// Helper: set up notifications query
// ---------------------------------------------------------------------------
function setupNotificationsBuilder(data: any[] = []) {
  const builder = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    range: jest.fn().mockResolvedValue({ data, error: null }),
    update: jest.fn().mockReturnThis(),
  };
  mockSupabase.from.mockImplementation((table: string) => {
    if (table === 'notifications') return builder;
    return createSupabaseMock().from();
  });
  return builder;
}

// ---------------------------------------------------------------------------
// 1. DUPLICATION: Separate realtime subscriptions
// ---------------------------------------------------------------------------
describe('BUG: duplicate realtime subscriptions for notifications', () => {
  it('useNotifications and useNotificationCount create two separate channels', () => {
    /**
     * BUG DOCUMENTATION:
     *
     * Both useNotifications (line 92-112) and useNotificationCount (line 20-40)
     * independently create realtime subscriptions on the same table:
     *
     *   useNotifications:     channel('notifications_realtime')
     *   useNotificationCount: channel('notification_count_updates')
     *
     * Both listen for:
     *   event: 'INSERT'
     *   table: 'notifications'
     *   filter: `user_id=eq.${session.user.id}`
     *
     * This means every new notification triggers TWO separate subscription
     * callbacks, TWO separate fetch calls, and maintains TWO separate
     * WebSocket channels.
     *
     * Impact:
     * - Double the Supabase realtime connections
     * - Double the network traffic for notification events
     * - Potential race conditions if both update UI simultaneously
     *
     * Recommended fix: Consolidate into a single NotificationContext that
     * manages one realtime subscription and exposes both the notification
     * list and unread count.
     */

    setupNotificationsBuilder();

    // Render both hooks (as they would be in a typical layout)
    renderHook(() => useNotifications());
    renderHook(() => useNotificationCount());

    // Both hooks should have called channel() with different names
    const channelCalls = mockSupabase.channel.mock.calls;
    const channelNames = channelCalls.map((call: any[]) => call[0]);

    expect(channelNames).toContain('notifications_realtime');
    expect(channelNames).toContain('notification_count_updates');
    expect(channelNames.length).toBeGreaterThanOrEqual(2);
  });

  it('both subscriptions listen to the same table and event', () => {
    setupNotificationsBuilder();

    renderHook(() => useNotifications());
    renderHook(() => useNotificationCount());

    // Each channel().on() call receives the same postgres_changes config
    const onCalls = mockSupabase.channel().on.mock.calls;

    // All .on() calls should target postgres_changes on notifications table
    onCalls.forEach((call: any[]) => {
      expect(call[0]).toBe('postgres_changes');
      expect(call[1]).toMatchObject({
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
      });
    });
  });
});

// ---------------------------------------------------------------------------
// 2. Notification fetching
// ---------------------------------------------------------------------------
describe('useNotifications: fetching', () => {
  it('fetches notifications on mount and maps them correctly', async () => {
    const mockData = [
      {
        id: 'n1',
        type: 'like',
        content_type: 'post',
        content_id: 'post-1',
        description: 'liked your post',
        group_count: 1,
        group_members: [],
        is_read: false,
        created_at: '2026-01-01T00:00:00Z',
        source_user_id: 'user-456',
        profiles: {
          id: 'user-456',
          display_name: 'Alice',
          avatar_url: 'https://example.com/alice.jpg',
        },
      },
    ];

    setupNotificationsBuilder(mockData);

    const { result } = renderHook(() => useNotifications());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0]).toMatchObject({
      id: 'n1',
      type: 'like',
      content_type: 'post',
      is_read: false,
      source_user: {
        id: 'user-456',
        display_name: 'Alice',
        avatar_url: 'https://example.com/alice.jpg',
      },
    });
  });

  it('sets error state when fetch fails', async () => {
    const builder = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      range: jest.fn().mockRejectedValue(new Error('Network error')),
    };
    mockSupabase.from.mockImplementation(() => builder);

    const { result } = renderHook(() => useNotifications());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
  });

  it('handles null profiles gracefully (source_user is null)', async () => {
    const mockData = [
      {
        id: 'n2',
        type: 'system',
        content_type: null,
        content_id: null,
        description: 'Welcome!',
        group_count: 1,
        group_members: [],
        is_read: false,
        created_at: '2026-01-01T00:00:00Z',
        source_user_id: null,
        profiles: null,
      },
    ];

    setupNotificationsBuilder(mockData);

    const { result } = renderHook(() => useNotifications());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.notifications[0].source_user).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 3. markAsRead / markAllRead
// ---------------------------------------------------------------------------
describe('useNotifications: mark as read', () => {
  it('markAsRead optimistically updates the notification', async () => {
    const mockData = [
      {
        id: 'n1',
        type: 'like',
        content_type: 'post',
        content_id: 'post-1',
        description: 'liked your post',
        group_count: 1,
        group_members: [],
        is_read: false,
        created_at: '2026-01-01T00:00:00Z',
        source_user_id: null,
        profiles: null,
      },
    ];

    const builder = setupNotificationsBuilder(mockData);

    const { result } = renderHook(() => useNotifications());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.notifications[0].is_read).toBe(false);

    act(() => {
      result.current.markAsRead('n1');
    });

    // Optimistic: immediately marked as read
    expect(result.current.notifications[0].is_read).toBe(true);

    // Also calls supabase to persist
    expect(mockSupabase.from).toHaveBeenCalledWith('notifications');
  });

  it('markAllRead optimistically marks all notifications as read and calls rpc', async () => {
    const mockData = [
      { id: 'n1', type: 'like', content_type: 'post', content_id: 'p1', description: '', group_count: 1, group_members: [], is_read: false, created_at: '2026-01-01', source_user_id: null, profiles: null },
      { id: 'n2', type: 'comment', content_type: 'post', content_id: 'p2', description: '', group_count: 1, group_members: [], is_read: false, created_at: '2026-01-02', source_user_id: null, profiles: null },
    ];

    setupNotificationsBuilder(mockData);

    const { result } = renderHook(() => useNotifications());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.markAllRead();
    });

    // All should be marked read optimistically
    result.current.notifications.forEach((n) => {
      expect(n.is_read).toBe(true);
    });

    expect(mockSupabase.rpc).toHaveBeenCalledWith('mark_all_notifications_read');
  });
});

// ---------------------------------------------------------------------------
// 4. Pagination
// ---------------------------------------------------------------------------
describe('useNotifications: pagination', () => {
  it('hasMore is true when page returns exactly PAGE_SIZE items', async () => {
    // PAGE_SIZE is 20 in the hook
    const mockData = Array.from({ length: 20 }, (_, i) => ({
      id: `n${i}`,
      type: 'like',
      content_type: 'post',
      content_id: `p${i}`,
      description: '',
      group_count: 1,
      group_members: [],
      is_read: false,
      created_at: `2026-01-${String(i + 1).padStart(2, '0')}`,
      source_user_id: null,
      profiles: null,
    }));

    setupNotificationsBuilder(mockData);

    const { result } = renderHook(() => useNotifications());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasMore).toBe(true);
  });

  it('hasMore is false when page returns fewer than PAGE_SIZE items', async () => {
    const mockData = [
      { id: 'n1', type: 'like', content_type: 'post', content_id: 'p1', description: '', group_count: 1, group_members: [], is_read: false, created_at: '2026-01-01', source_user_id: null, profiles: null },
    ];

    setupNotificationsBuilder(mockData);

    const { result } = renderHook(() => useNotifications());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasMore).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 5. useNotificationCount
// ---------------------------------------------------------------------------
describe('useNotificationCount', () => {
  it('returns 0 by default', () => {
    const { result } = renderHook(() => useNotificationCount());
    expect(result.current).toBe(0);
  });

  it('calls rpc to get unread count', async () => {
    mockSupabase.rpc.mockResolvedValue({ data: 7, error: null });

    const { result } = renderHook(() => useNotificationCount());

    await waitFor(() => {
      expect(result.current).toBe(7);
    });

    expect(mockSupabase.rpc).toHaveBeenCalledWith('get_unread_notification_count');
  });

  it('stays at 0 when rpc returns an error', async () => {
    mockSupabase.rpc.mockResolvedValue({ data: null, error: { message: 'RPC failed' } });

    const { result } = renderHook(() => useNotificationCount());

    // Wait for the effect to settle
    await waitFor(() => {
      expect(mockSupabase.rpc).toHaveBeenCalled();
    });

    expect(result.current).toBe(0);
  });

  it('stays at 0 when rpc returns non-number data', async () => {
    mockSupabase.rpc.mockResolvedValue({ data: 'not-a-number', error: null });

    const { result } = renderHook(() => useNotificationCount());

    await waitFor(() => {
      expect(mockSupabase.rpc).toHaveBeenCalled();
    });

    expect(result.current).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// 6. Realtime cleanup
// ---------------------------------------------------------------------------
describe('realtime cleanup on unmount', () => {
  it('useNotifications removes channel on unmount', () => {
    setupNotificationsBuilder();

    const { unmount } = renderHook(() => useNotifications());
    unmount();

    expect(mockSupabase.removeChannel).toHaveBeenCalled();
  });

  it('useNotificationCount removes channel on unmount', () => {
    const { unmount } = renderHook(() => useNotificationCount());
    unmount();

    expect(mockSupabase.removeChannel).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// 7. No session — hooks do nothing
// ---------------------------------------------------------------------------
describe('no session', () => {
  beforeEach(() => {
    mockContainer.session = null;
  });

  it('useNotifications returns empty state without fetching', async () => {
    const { result } = renderHook(() => useNotifications());

    // Should remain in loading state but not crash
    expect(result.current.notifications).toEqual([]);
  });

  it('useNotificationCount returns 0 without fetching', () => {
    const { result } = renderHook(() => useNotificationCount());
    expect(result.current).toBe(0);
  });
});
