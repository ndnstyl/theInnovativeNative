import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function usePostActions(postId: string) {
  const { supabaseClient, session } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  const pinPost = useCallback(async (position: number): Promise<boolean> => {
    if (!supabaseClient) return false;
    setLoading(true);
    try {
      // Check count of pinned posts
      const { count } = await supabaseClient
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .not('pinned_position', 'is', null);

      if ((count || 0) >= 3) {
        return false;
      }

      const { error } = await supabaseClient
        .from('posts')
        .update({ pinned_position: position })
        .eq('id', postId);

      return !error;
    } finally {
      setLoading(false);
    }
  }, [supabaseClient, postId]);

  const unpinPost = useCallback(async (): Promise<boolean> => {
    if (!supabaseClient) return false;
    setLoading(true);
    try {
      const { error } = await supabaseClient
        .from('posts')
        .update({ pinned_position: null })
        .eq('id', postId);
      return !error;
    } finally {
      setLoading(false);
    }
  }, [supabaseClient, postId]);

  const deletePost = useCallback(async (): Promise<boolean> => {
    if (!supabaseClient) return false;
    setLoading(true);
    try {
      const { error } = await supabaseClient
        .from('posts')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', postId);
      return !error;
    } finally {
      setLoading(false);
    }
  }, [supabaseClient, postId]);

  const reportPost = useCallback(async (
    reason: string,
    description?: string
  ): Promise<boolean> => {
    if (!supabaseClient || !session?.user?.id) return false;
    setLoading(true);
    try {
      const { data: community } = await supabaseClient
        .from('communities')
        .select('id')
        .limit(1)
        .single();

      if (!community) return false;

      const { error } = await supabaseClient
        .from('reports')
        .insert({
          community_id: community.id,
          reporter_id: session.user.id,
          target_type: 'post',
          target_id: postId,
          reason,
          description: description || null,
        });

      return !error;
    } finally {
      setLoading(false);
    }
  }, [supabaseClient, session, postId]);

  const followPost = useCallback(async (): Promise<boolean> => {
    if (!supabaseClient || !session?.user?.id) return false;
    try {
      const { error } = await supabaseClient
        .from('post_follows')
        .insert({ user_id: session.user.id, post_id: postId });
      if (!error) setIsFollowing(true);
      return !error;
    } catch {
      return false;
    }
  }, [supabaseClient, session, postId]);

  const unfollowPost = useCallback(async (): Promise<boolean> => {
    if (!supabaseClient || !session?.user?.id) return false;
    try {
      const { error } = await supabaseClient
        .from('post_follows')
        .delete()
        .eq('user_id', session.user.id)
        .eq('post_id', postId);
      if (!error) setIsFollowing(false);
      return !error;
    } catch {
      return false;
    }
  }, [supabaseClient, session, postId]);

  const copyLink = useCallback(() => {
    const url = `${window.location.origin}/community/posts/${postId}`;
    navigator.clipboard.writeText(url);
  }, [postId]);

  return {
    pinPost, unpinPost, deletePost, reportPost,
    followPost, unfollowPost, isFollowing, copyLink, loading,
  };
}
