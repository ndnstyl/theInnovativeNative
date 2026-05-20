import { useState, useCallback } from 'react';
import { getValidToken } from '@/lib/auth-token';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/** PATCH helper for post mutations — returns true on success, throws on failure */
async function patchPost(postId: string, body: Record<string, unknown>, token: string): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/posts?id=eq.${postId}`, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `HTTP ${res.status}`);
  }
}

interface UsePostActionsReturn {
  pinPost: (postId: string) => Promise<boolean>;
  unpinPost: (postId: string) => Promise<boolean>;
  deletePost: (postId: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

/**
 * Admin post actions hook.
 * Uses direct REST PATCH — no Supabase JS client.
 * Requires a valid auth token (admin/moderator role enforced by RLS).
 */
export function usePostActions(): UsePostActionsReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pinPost = useCallback(async (postId: string): Promise<boolean> => {
    const token = getValidToken();
    if (!token) {
      setError('Not authenticated');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      await patchPost(postId, { pinned_position: Date.now() }, token);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to pin post');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const unpinPost = useCallback(async (postId: string): Promise<boolean> => {
    const token = getValidToken();
    if (!token) {
      setError('Not authenticated');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      await patchPost(postId, { pinned_position: null }, token);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to unpin post');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePost = useCallback(async (postId: string): Promise<boolean> => {
    const token = getValidToken();
    if (!token) {
      setError('Not authenticated');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      await patchPost(postId, { deleted_at: new Date().toISOString() }, token);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete post');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { pinPost, unpinPost, deletePost, loading, error };
}
