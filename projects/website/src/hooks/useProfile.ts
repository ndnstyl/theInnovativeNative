import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { ProfileUpdate } from '@/types/supabase';

export function useProfile() {
  const { supabaseClient, session, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = useCallback(async (data: ProfileUpdate) => {
    if (!session?.user?.id) return;
    setIsLoading(true);
    setError(null);

    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update(data)
      .eq('id', session.user.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      await refreshProfile();
    }
    setIsLoading(false);
  }, [supabaseClient, session, refreshProfile]);

  const uploadAvatar = useCallback(async (file: File): Promise<string | null> => {
    if (!session?.user?.id) return null;
    setIsLoading(true);
    setError(null);

    const fileExt = file.name.split('.').pop();
    const filePath = `${session.user.id}/${Date.now()}.${fileExt}`;

    // Upload new avatar
    const { error: uploadError } = await supabaseClient.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setError(uploadError.message);
      setIsLoading(false);
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseClient.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Update profile with new avatar URL
    await updateProfile({ avatar_url: publicUrl });

    setIsLoading(false);
    return publicUrl;
  }, [supabaseClient, session, updateProfile]);

  const deleteAvatar = useCallback(async () => {
    if (!session?.user?.id) return;
    setIsLoading(true);
    setError(null);

    // List and delete user's avatar files
    const { data: files } = await supabaseClient.storage
      .from('avatars')
      .list(session.user.id);

    if (files?.length) {
      const filePaths = files.map(f => `${session.user.id}/${f.name}`);
      await supabaseClient.storage.from('avatars').remove(filePaths);
    }

    await updateProfile({ avatar_url: null });
    setIsLoading(false);
  }, [supabaseClient, session, updateProfile]);

  const generateUsername = useCallback(async (displayName: string): Promise<string> => {
    const { data, error: rpcError } = await supabaseClient
      .rpc('generate_username_slug', { p_display_name: displayName });

    if (rpcError) {
      setError(rpcError.message);
      // Fallback: simple slugify
      return displayName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30);
    }
    return data as string;
  }, [supabaseClient]);

  return { updateProfile, uploadAvatar, deleteAvatar, generateUsername, isLoading, error };
}
