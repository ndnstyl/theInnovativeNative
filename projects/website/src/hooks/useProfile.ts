import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';
import { getValidToken } from '@/lib/auth-token';
import type { ProfileUpdate } from '@/types/supabase';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/** Direct REST call with timeout — never hangs. Bypasses Supabase client's auth module. */
async function restUpdate(path: string, data: Record<string, unknown>, timeoutMs = 10000): Promise<{ ok: boolean; error?: string }> {
  const token = getValidToken();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${token || SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!res.ok) {
      const body = await res.text().catch(() => 'Unknown error');
      return { ok: false, error: `Update failed (${res.status}): ${body}` };
    }
    return { ok: true };
  } catch (err) {
    clearTimeout(timer);
    if (err instanceof DOMException && err.name === 'AbortError') {
      return { ok: false, error: 'Request timed out. Please check your connection and try again.' };
    }
    return { ok: false, error: err instanceof Error ? err.message : 'Network error' };
  }
}

export function useProfile() {
  const { supabaseClient, session, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Update profile via direct REST with timeout. Throws on failure. */
  const updateProfile = useCallback(async (data: ProfileUpdate) => {
    const userId = session?.user?.id;
    if (!userId) throw new Error('Not authenticated');

    setIsLoading(true);
    setError(null);

    try {
      const result = await restUpdate(`profiles?id=eq.${userId}`, data as Record<string, unknown>);

      if (!result.ok) {
        setError(result.error || 'Profile update failed');
        throw new Error(result.error || 'Profile update failed');
      }

      // Refresh profile — race against 3s timeout so UI never freezes
      await Promise.race([
        refreshProfile().catch(() => {}),
        new Promise(resolve => setTimeout(resolve, 3000)),
      ]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to update profile';
      logger.error('useProfile', 'updateProfile', e);
      if (!error) setError(msg);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [session, refreshProfile, error]);

  /** Upload avatar to Supabase Storage with timeout. */
  const uploadAvatar = useCallback(async (file: File): Promise<string | null> => {
    const userId = session?.user?.id;
    if (!userId) return null;

    setIsLoading(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${Date.now()}.${fileExt}`;

      // Upload with the Supabase client (storage API uses custom fetch with token)
      const uploadPromise = supabaseClient.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      // 15-second timeout for upload
      const result = await Promise.race([
        uploadPromise,
        new Promise<{ error: { message: string } }>((resolve) =>
          setTimeout(() => resolve({ error: { message: 'Upload timed out. Try a smaller image.' } }), 15000)
        ),
      ]) as { data?: { path: string } | null; error?: { message: string } | null };

      if (result.error) {
        setError(result.error.message);
        return null;
      }

      const { data: { publicUrl } } = supabaseClient.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL via direct REST
      const updateResult = await restUpdate(`profiles?id=eq.${userId}`, { avatar_url: publicUrl });
      if (!updateResult.ok) {
        setError(updateResult.error || 'Failed to save avatar');
        return null;
      }

      return publicUrl;
    } catch (e) {
      logger.error('useProfile', 'uploadAvatar', e);
      setError(e instanceof Error ? e.message : 'Failed to upload avatar');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [supabaseClient, session]);

  const deleteAvatar = useCallback(async () => {
    const userId = session?.user?.id;
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data: files } = await supabaseClient.storage
        .from('avatars')
        .list(userId);

      if (files?.length) {
        const filePaths = files.map(f => `${userId}/${f.name}`);
        await supabaseClient.storage.from('avatars').remove(filePaths);
      }

      await restUpdate(`profiles?id=eq.${userId}`, { avatar_url: null });
    } catch (e) {
      logger.error('useProfile', 'deleteAvatar', e);
      setError(e instanceof Error ? e.message : 'Failed to delete avatar');
    } finally {
      setIsLoading(false);
    }
  }, [supabaseClient, session]);

  const generateUsername = useCallback(async (displayName: string): Promise<string> => {
    try {
      const { data, error: rpcError } = await supabaseClient
        .rpc('generate_username_slug', { p_display_name: displayName });

      if (rpcError) {
        return displayName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30);
      }
      return data as string;
    } catch {
      return displayName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30);
    }
  }, [supabaseClient]);

  return { updateProfile, uploadAvatar, deleteAvatar, generateUsername, isLoading, error };
}
