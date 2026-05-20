import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function useRealtimeFeed() {
  const { supabaseClient, session } = useAuth();
  const [newPostCount, setNewPostCount] = useState(0);
  const refreshCallbackRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!supabaseClient) return;

    const channel = supabaseClient
      .channel('feed-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'posts' },
        (payload) => {
          // Don't count own posts
          if (payload.new && (payload.new as any).author_id !== session?.user?.id) {
            setNewPostCount(prev => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [supabaseClient, session]);

  const clearNewPosts = useCallback(() => {
    setNewPostCount(0);
    if (refreshCallbackRef.current) {
      refreshCallbackRef.current();
    }
  }, []);

  const setRefreshCallback = useCallback((cb: () => void) => {
    refreshCallbackRef.current = cb;
  }, []);

  return { newPostCount, clearNewPosts, setRefreshCallback };
}
