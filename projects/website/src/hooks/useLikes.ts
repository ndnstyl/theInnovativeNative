import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface UseLikesOptions {
  targetType: 'post' | 'comment';
  targetId: string;
  initialCount?: number;
  initialLiked?: boolean;
}

export function useLikes({ targetType, targetId, initialCount = 0, initialLiked = false }: UseLikesOptions) {
  const { supabaseClient, session } = useAuth();
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  // Sync with initial values when they change
  useEffect(() => {
    setIsLiked(initialLiked);
    setLikeCount(initialCount);
  }, [initialLiked, initialCount]);

  // Check if current user has liked this target
  useEffect(() => {
    if (!supabaseClient || !session?.user?.id || !targetId) return;

    supabaseClient
      .from('reactions')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('target_type', targetType)
      .eq('target_id', targetId)
      .limit(1)
      .then(({ data }) => {
        setIsLiked(data !== null && data.length > 0);
      });
  }, [supabaseClient, session, targetType, targetId]);

  const toggleLike = useCallback(async () => {
    if (!supabaseClient || !session?.user?.id || loading) return;
    setLoading(true);

    // Optimistic update
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setLikeCount(prev => wasLiked ? Math.max(prev - 1, 0) : prev + 1);

    try {
      if (wasLiked) {
        // Remove reaction
        const { error } = await supabaseClient
          .from('reactions')
          .delete()
          .eq('user_id', session.user.id)
          .eq('target_type', targetType)
          .eq('target_id', targetId);

        if (error) throw error;
      } else {
        // Get community_id
        const { data: community } = await supabaseClient
          .from('communities')
          .select('id')
          .limit(1)
          .single();

        if (!community) throw new Error('Community not found');

        // Add reaction
        const { error } = await supabaseClient
          .from('reactions')
          .insert({
            community_id: community.id,
            user_id: session.user.id,
            target_type: targetType,
            target_id: targetId,
            reaction_type: 'like',
          });

        if (error) throw error;
      }
    } catch {
      // Revert on error
      setIsLiked(wasLiked);
      setLikeCount(prev => wasLiked ? prev + 1 : Math.max(prev - 1, 0));
    } finally {
      setLoading(false);
    }
  }, [supabaseClient, session, targetType, targetId, isLiked, loading]);

  return { isLiked, likeCount, toggleLike, loading };
}
