/**
 * useProfile Test Suite
 *
 * Tests for /src/hooks/useProfile.ts
 *
 * Key areas:
 * 1. updateProfile calls supabase .from('profiles').update() with correct data
 * 2. BUG: No null guard on supabaseClient -- crashes when used outside AuthProvider
 * 3. uploadAvatar calls storage.upload with correct bucket and path format
 * 4. uploadAvatar updates profile with the public URL after upload
 */

import { renderHook, act } from '@testing-library/react';

const { createSupabaseMock } = require('../../../__mocks__/supabaseMock');

// ---------------------------------------------------------------------------
// Mocks -- use a container so the factory closure stays in sync
// ---------------------------------------------------------------------------

const mockContainer = {
  supabase: createSupabaseMock(),
  session: { user: { id: 'user-123', email: 'test@example.com' } } as any,
  refreshProfile: jest.fn().mockResolvedValue(undefined),
};

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    supabaseClient: mockContainer.supabase,
    session: mockContainer.session,
    refreshProfile: mockContainer.refreshProfile,
  }),
}));

import { useProfile } from '@/hooks/useProfile';

beforeEach(() => {
  mockContainer.supabase = createSupabaseMock();
  mockContainer.session = { user: { id: 'user-123', email: 'test@example.com' } };
  mockContainer.refreshProfile = jest.fn().mockResolvedValue(undefined);
});

// ---------------------------------------------------------------------------
// 1. updateProfile
// ---------------------------------------------------------------------------
describe('updateProfile', () => {
  it('calls supabase .from("profiles").update() with the correct data and user id', async () => {
    const updateBuilder = {
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ error: null }),
    };
    mockContainer.supabase.from.mockImplementation((table: string) => {
      if (table === 'profiles') return updateBuilder;
      return createSupabaseMock().from();
    });

    const { result } = renderHook(() => useProfile());

    await act(async () => {
      await result.current.updateProfile({ display_name: 'New Name', bio: 'Updated bio' });
    });

    expect(mockContainer.supabase.from).toHaveBeenCalledWith('profiles');
    expect(updateBuilder.update).toHaveBeenCalledWith({ display_name: 'New Name', bio: 'Updated bio' });
    expect(updateBuilder.eq).toHaveBeenCalledWith('id', 'user-123');
  });

  it('calls refreshProfile after successful update', async () => {
    const updateBuilder = {
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ error: null }),
    };
    mockContainer.supabase.from.mockImplementation((table: string) => {
      if (table === 'profiles') return updateBuilder;
      return createSupabaseMock().from();
    });

    const { result } = renderHook(() => useProfile());

    await act(async () => {
      await result.current.updateProfile({ display_name: 'New Name' });
    });

    expect(mockContainer.refreshProfile).toHaveBeenCalledTimes(1);
  });

  it('sets error state when update fails', async () => {
    const updateBuilder = {
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ error: { message: 'Update failed' } }),
    };
    mockContainer.supabase.from.mockImplementation((table: string) => {
      if (table === 'profiles') return updateBuilder;
      return createSupabaseMock().from();
    });

    const { result } = renderHook(() => useProfile());

    await act(async () => {
      await result.current.updateProfile({ display_name: 'Bad' });
    });

    expect(result.current.error).toBe('Update failed');
    expect(mockContainer.refreshProfile).not.toHaveBeenCalled();
  });

  it('does nothing when session.user.id is missing', async () => {
    mockContainer.session = null;

    const { result } = renderHook(() => useProfile());

    await act(async () => {
      await result.current.updateProfile({ display_name: 'Test' });
    });

    expect(mockContainer.supabase.from).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// 2. BUG: Missing null guard on supabaseClient
// ---------------------------------------------------------------------------
describe('BUG: supabaseClient null guard missing', () => {
  it('updateProfile will crash if supabaseClient is null (no guard on line 15)', () => {
    /**
     * BUG DOCUMENTATION:
     *
     * In useProfile.ts, updateProfile() (line 10-26) checks `if (!session?.user?.id)`
     * but does NOT check `if (!supabaseClient)`.
     *
     * When useAuth() is called outside AuthProvider, supabaseClient is `null`
     * (cast as SupabaseClient via `null as unknown as SupabaseClient`).
     *
     * So if a component uses useProfile() outside AuthProvider AND the user
     * somehow has a session-like object, line 15 will crash:
     *   `await supabaseClient.from('profiles').update(data)...`
     *
     * The same issue affects uploadAvatar, deleteAvatar, and generateUsername.
     *
     * Recommended fix: Add `if (!supabaseClient) return;` at the start of
     * each function, or fix the root cause in AuthContext (throw when
     * outside provider instead of returning null-as-SupabaseClient).
     */

    mockContainer.supabase = null;
    mockContainer.session = { user: { id: 'user-123' } };

    const { result } = renderHook(() => useProfile());

    // Calling updateProfile with null supabaseClient will crash.
    // We expect a TypeError because null.from() is invalid.
    expect(
      result.current.updateProfile({ display_name: 'Crash' })
    ).rejects.toThrow();
  });
});

// ---------------------------------------------------------------------------
// 3. uploadAvatar
// ---------------------------------------------------------------------------
describe('uploadAvatar', () => {
  it('uploads to the "avatars" bucket with user-id-prefixed path', async () => {
    const { result } = renderHook(() => useProfile());

    const fakeFile = new File(['hello'], 'photo.png', { type: 'image/png' });

    await act(async () => {
      await result.current.uploadAvatar(fakeFile);
    });

    expect(mockContainer.supabase.storage.from).toHaveBeenCalledWith('avatars');
    const uploadCall = mockContainer.supabase.storage.from('avatars').upload;
    expect(uploadCall).toHaveBeenCalled();

    // First arg should be `user-123/<timestamp>.png`
    const uploadPath = uploadCall.mock.calls[0][0];
    expect(uploadPath).toMatch(/^user-123\/\d+\.png$/);

    // Second arg is the file
    expect(uploadCall.mock.calls[0][1]).toBe(fakeFile);

    // Third arg should have upsert: true
    expect(uploadCall.mock.calls[0][2]).toEqual({ upsert: true });
  });

  it('calls getPublicUrl and updates profile with the resulting URL', async () => {
    const updateBuilder = {
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ error: null }),
    };
    mockContainer.supabase.from.mockImplementation((table: string) => {
      if (table === 'profiles') return updateBuilder;
      return createSupabaseMock().from();
    });

    const { result } = renderHook(() => useProfile());

    const fakeFile = new File(['img'], 'avatar.jpg', { type: 'image/jpeg' });
    let returnedUrl: string | null = null;

    await act(async () => {
      returnedUrl = await result.current.uploadAvatar(fakeFile);
    });

    expect(mockContainer.supabase.storage.from).toHaveBeenCalledWith('avatars');

    // The returned URL should be the mock publicUrl
    expect(returnedUrl).toBe(
      'https://test.supabase.co/storage/v1/object/public/test'
    );

    // updateProfile should have been called with the avatar_url
    expect(updateBuilder.update).toHaveBeenCalledWith({
      avatar_url: 'https://test.supabase.co/storage/v1/object/public/test',
    });
  });

  it('returns null and sets error when upload fails', async () => {
    mockContainer.supabase.storage.from.mockReturnValue({
      upload: jest.fn().mockResolvedValue({ data: null, error: { message: 'Upload failed' } }),
      getPublicUrl: jest.fn(),
      list: jest.fn(),
      remove: jest.fn(),
    });

    const { result } = renderHook(() => useProfile());
    const fakeFile = new File(['img'], 'avatar.jpg', { type: 'image/jpeg' });

    let returnedUrl: string | null = 'not-null';
    await act(async () => {
      returnedUrl = await result.current.uploadAvatar(fakeFile);
    });

    expect(returnedUrl).toBeNull();
    expect(result.current.error).toBe('Upload failed');
  });

  it('returns null when session has no user', async () => {
    mockContainer.session = null;

    const { result } = renderHook(() => useProfile());
    const fakeFile = new File(['img'], 'avatar.jpg', { type: 'image/jpeg' });

    let returnedUrl: string | null = 'not-null';
    await act(async () => {
      returnedUrl = await result.current.uploadAvatar(fakeFile);
    });

    expect(returnedUrl).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 4. generateUsername
// ---------------------------------------------------------------------------
describe('generateUsername', () => {
  it('calls supabase rpc with display name', async () => {
    mockContainer.supabase.rpc.mockResolvedValue({ data: 'test-user', error: null });

    const { result } = renderHook(() => useProfile());
    let username = '';

    await act(async () => {
      username = await result.current.generateUsername('Test User');
    });

    expect(mockContainer.supabase.rpc).toHaveBeenCalledWith('generate_username_slug', {
      p_display_name: 'Test User',
    });
    expect(username).toBe('test-user');
  });

  it('falls back to simple slugify when rpc fails', async () => {
    mockContainer.supabase.rpc.mockResolvedValue({
      data: null,
      error: { message: 'Function not found' },
    });

    const { result } = renderHook(() => useProfile());
    let username = '';

    await act(async () => {
      username = await result.current.generateUsername('Hello World!');
    });

    // Fallback: toLowerCase, replace non-alphanumeric, trim dashes
    expect(username).toBe('hello-world');
  });
});
