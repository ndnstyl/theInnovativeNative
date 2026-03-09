import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function useUnreadCount(): number {
  const { supabaseClient, session } = useAuth();
  const [count, setCount] = useState(0);

  const fetchCount = useCallback(async () => {
    if (!supabaseClient || !session?.user?.id) return;
    const { data, error } = await supabaseClient.rpc('get_unread_conversation_count');
    if (!error && typeof data === 'number') {
      setCount(data);
    }
  }, [supabaseClient, session?.user?.id]);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  // Subscribe to new messages to refresh count
  useEffect(() => {
    if (!supabaseClient || !session?.user?.id) return;

    const channel = supabaseClient
      .channel('unread_count_updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload: any) => {
          // Only refresh if the message isn't from us
          if (payload.new.sender_id !== session.user.id) {
            fetchCount();
          }
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [supabaseClient, session?.user?.id, fetchCount]);

  return count;
}
