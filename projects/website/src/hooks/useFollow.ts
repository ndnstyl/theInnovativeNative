import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function useFollow(targetUserId: string) {
  const { supabaseClient, session } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!targetUserId) return;

    const fetchData = async () => {
      // Check if current user follows target
      if (session?.user?.id && session.user.id !== targetUserId) {
        const { data } = await supabaseClient
          .from('follows')
          .select('follower_id')
          .eq('follower_id', session.user.id)
          .eq('following_id', targetUserId)
          .limit(1);

        setIsFollowing(!!data?.length);
      }

      // Get follower count
      const { count: followers } = await supabaseClient
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', targetUserId);

      setFollowerCount(followers || 0);

      // Get following count
      const { count: following } = await supabaseClient
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', targetUserId);

      setFollowingCount(following || 0);
    };

    fetchData();
  }, [supabaseClient, session, targetUserId]);

  const toggleFollow = useCallback(async () => {
    if (!session?.user?.id || session.user.id === targetUserId) return;
    setIsLoading(true);

    if (isFollowing) {
      // Optimistic update
      setIsFollowing(false);
      setFollowerCount(c => c - 1);

      const { error } = await supabaseClient
        .from('follows')
        .delete()
        .eq('follower_id', session.user.id)
        .eq('following_id', targetUserId);

      if (error) {
        // Rollback
        setIsFollowing(true);
        setFollowerCount(c => c + 1);
      }
    } else {
      // Optimistic update
      setIsFollowing(true);
      setFollowerCount(c => c + 1);

      const { error } = await supabaseClient
        .from('follows')
        .insert({
          follower_id: session.user.id,
          following_id: targetUserId,
        });

      if (error) {
        // Rollback
        setIsFollowing(false);
        setFollowerCount(c => c - 1);
      }
    }

    setIsLoading(false);
  }, [supabaseClient, session, targetUserId, isFollowing]);

  return { isFollowing, followerCount, followingCount, toggleFollow, isLoading };
}
