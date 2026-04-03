/**
 * AuthContext Test Suite
 *
 * Tests for /src/contexts/AuthContext.tsx
 *
 * Key areas:
 * 1. useAuth outside provider returns safe defaults (but documents a bug)
 * 2. AuthProvider initializes supabaseClient and session
 * 3. Auth state change triggers profile/role fetch
 * 4. Cleanup: subscription.unsubscribe called on unmount
 */

import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';

const { createSupabaseMock } = require('../../../__mocks__/supabaseMock');

// Mutable container so jest.mock factory can reference the current mock
const mockContainer = { supabase: createSupabaseMock() };

jest.mock('@/lib/supabase', () => ({
  getSupabaseBrowserClient: () => mockContainer.supabase,
}));

import { AuthProvider, useAuth } from '@/contexts/AuthContext';

beforeEach(() => {
  mockContainer.supabase = createSupabaseMock();
});

function createWrapper() {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <AuthProvider>{children}</AuthProvider>;
  };
}

// ---------------------------------------------------------------------------
// 1. useAuth OUTSIDE AuthProvider
// ---------------------------------------------------------------------------
describe('useAuth() outside AuthProvider', () => {
  it('throws an error when called outside AuthProvider', () => {
    // useAuth now correctly throws when used outside its provider,
    // following the standard React context pattern.
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');
  });
});

// ---------------------------------------------------------------------------
// 2. AuthProvider initialization
// ---------------------------------------------------------------------------
describe('AuthProvider initialization', () => {
  it('calls getSession on mount', async () => {
    renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(mockContainer.supabase.auth.getSession).toHaveBeenCalled();
    });
  });

  it('sets isLoading to false after initial session fetch', async () => {
    mockContainer.supabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('subscribes to auth state changes via onAuthStateChange', async () => {
    renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(mockContainer.supabase.auth.onAuthStateChange).toHaveBeenCalled();
    });
  });
});

// ---------------------------------------------------------------------------
// 3. Auth state change triggers profile fetch
// ---------------------------------------------------------------------------
describe('AuthProvider profile fetching', () => {
  it('fetches profile and role when session has a user', async () => {
    const fakeSession = {
      user: { id: 'user-123', email: 'test@example.com' },
      access_token: 'token-abc',
    };

    mockContainer.supabase.auth.getSession.mockResolvedValue({
      data: { session: fakeSession },
      error: null,
    });

    const profileBuilder = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: {
          id: 'user-123',
          display_name: 'Test User',
          membership_status: 'approved',
          onboarding_complete: true,
        },
        error: null,
      }),
    };

    const memberBuilder = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      is: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { role: 'admin' },
        error: null,
      }),
    };

    mockContainer.supabase.from.mockImplementation((table: string) => {
      if (table === 'profiles') return profileBuilder;
      if (table === 'community_members') return memberBuilder;
      return createSupabaseMock().from();
    });

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.profile).toBeTruthy();
    expect(result.current.profile?.display_name).toBe('Test User');
    expect(result.current.role).toBe('admin');
    expect(result.current.membershipStatus).toBe('approved');
    expect(result.current.isOnboarded).toBe(true);
  });

  it('auto-creates community_members row for new users without one', async () => {
    const fakeSession = {
      user: { id: 'new-user-456', email: 'new@example.com' },
      access_token: 'token-def',
    };

    mockContainer.supabase.auth.getSession.mockResolvedValue({
      data: { session: fakeSession },
      error: null,
    });

    const profileBuilder = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: {
          id: 'new-user-456',
          display_name: 'New User',
          membership_status: 'pending',
          onboarding_complete: false,
        },
        error: null,
      }),
    };

    const communityBuilder = {
      select: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { id: 'community-1' },
        error: null,
      }),
    };

    let memberCallCount = 0;
    mockContainer.supabase.from.mockImplementation((table: string) => {
      if (table === 'profiles') return profileBuilder;
      if (table === 'community_members') {
        memberCallCount++;
        if (memberCallCount === 1) {
          // First call: the select query returns no member
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            is: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
          };
        }
        // Second call: the insert
        return {
          insert: jest.fn().mockResolvedValue({ error: null }),
        };
      }
      if (table === 'communities') return communityBuilder;
      return createSupabaseMock().from();
    });

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.role).toBe('member');
  });

  it('clears profile state when auth state changes to signed out', async () => {
    let authCallback: (event: string, session: any) => void;

    mockContainer.supabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    mockContainer.supabase.auth.onAuthStateChange.mockImplementation((cb: any) => {
      authCallback = cb;
      return { data: { subscription: { unsubscribe: jest.fn() } } };
    });

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Simulate sign-out event
    act(() => {
      authCallback('SIGNED_OUT', null);
    });

    await waitFor(() => {
      expect(result.current.session).toBeNull();
      expect(result.current.profile).toBeNull();
      expect(result.current.role).toBeNull();
      expect(result.current.membershipStatus).toBeNull();
      expect(result.current.isOnboarded).toBe(false);
    });
  });
});

// ---------------------------------------------------------------------------
// 4. Cleanup
// ---------------------------------------------------------------------------
describe('AuthProvider cleanup', () => {
  it('calls subscription.unsubscribe on unmount', async () => {
    const unsubscribeMock = jest.fn();
    mockContainer.supabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: unsubscribeMock } },
    });

    const { unmount } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    unmount();

    expect(unsubscribeMock).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// 5. refreshProfile
// ---------------------------------------------------------------------------
describe('refreshProfile', () => {
  it('re-fetches profile and role when called with active session', async () => {
    const fakeSession = {
      user: { id: 'user-123', email: 'test@example.com' },
      access_token: 'token-abc',
    };

    mockContainer.supabase.auth.getSession.mockResolvedValue({
      data: { session: fakeSession },
      error: null,
    });

    const profileBuilder = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: {
          id: 'user-123',
          display_name: 'Test User',
          membership_status: 'approved',
          onboarding_complete: true,
        },
        error: null,
      }),
    };

    const memberBuilder = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      is: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { role: 'member' },
        error: null,
      }),
    };

    mockContainer.supabase.from.mockImplementation((table: string) => {
      if (table === 'profiles') return profileBuilder;
      if (table === 'community_members') return memberBuilder;
      return createSupabaseMock().from();
    });

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Clear call counts
    profileBuilder.select.mockClear();

    // Trigger refreshProfile
    await act(async () => {
      await result.current.refreshProfile();
    });

    // Should have re-queried profiles
    expect(profileBuilder.select).toHaveBeenCalled();
  });
});
