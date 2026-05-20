import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function useNotificationCount(): number {
  const { supabaseClient, session } = useAuth();
  const [count, setCount] = useState(0);

  const fetchCount = useCallback(async () => {
    if (!supabaseClient || !session?.user?.id) return;
    const { data, error } = await supabaseClient.rpc('get_unread_notification_count');
    if (!error && typeof data === 'number') {
      setCount(data);
    }
  }, [supabaseClient, session?.user?.id]);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  useEffect(() => {
    if (!supabaseClient || !session?.user?.id) return;

    const channel = supabaseClient
      .channel('notification_count_updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${session.user.id}`,
        },
        () => { fetchCount(); }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [supabaseClient, session?.user?.id, fetchCount]);

  return count;
}
