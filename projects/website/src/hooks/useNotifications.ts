import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { NotificationWithSource, NotificationType } from '@/types/notifications';

const PAGE_SIZE = 20;

interface UseNotificationsReturn {
  notifications: NotificationWithSource[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  markAsRead: (id: string) => void;
  markAllRead: () => void;
}

export function useNotifications(): UseNotificationsReturn {
  const { supabaseClient, session } = useAuth();
  const [notifications, setNotifications] = useState<NotificationWithSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);

  const fetchNotifications = useCallback(async (pageNum: number) => {
    if (!supabaseClient || !session?.user?.id) return;
    if (pageNum === 0) setIsLoading(true);
    setError(null);

    try {
      const start = pageNum * PAGE_SIZE;
      const { data, error: fetchErr } = await supabaseClient
        .from('notifications')
        .select(`
          id,
          type,
          content_type,
          content_id,
          description,
          group_count,
          group_members,
          is_read,
          created_at,
          source_user_id,
          profiles!notifications_source_user_id_fkey (
            id,
            display_name,
            avatar_url
          )
        ` as any)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .range(start, start + PAGE_SIZE - 1);

      if (fetchErr) throw fetchErr;

      const mapped: NotificationWithSource[] = (data || []).map((n: any) => ({
        id: n.id,
        type: n.type as NotificationType,
        content_type: n.content_type,
        content_id: n.content_id,
        description: n.description,
        group_count: n.group_count || 1,
        group_members: n.group_members || [],
        is_read: n.is_read,
        created_at: n.created_at,
        source_user: n.profiles ? {
          id: n.profiles.id,
          display_name: n.profiles.display_name,
          avatar_url: n.profiles.avatar_url,
        } : null,
      }));

      if (pageNum === 0) {
        setNotifications(mapped);
      } else {
        setNotifications((prev) => [...prev, ...mapped]);
      }
      setHasMore(mapped.length === PAGE_SIZE);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [supabaseClient, session?.user?.id]);

  useEffect(() => {
    fetchNotifications(0);
  }, [fetchNotifications]);

  // Realtime subscription
  useEffect(() => {
    if (!supabaseClient || !session?.user?.id) return;

    const channel = supabaseClient
      .channel('notifications_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${session.user.id}`,
        },
        () => { fetchNotifications(0); }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [supabaseClient, session?.user?.id, fetchNotifications]);

  const loadMore = useCallback(() => {
    const next = page + 1;
    setPage(next);
    fetchNotifications(next);
  }, [page, fetchNotifications]);

  const markAsRead = useCallback(async (id: string) => {
    if (!supabaseClient) return;
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n));
    await supabaseClient
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);
  }, [supabaseClient]);

  const markAllRead = useCallback(async () => {
    if (!supabaseClient) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    await supabaseClient.rpc('mark_all_notifications_read');
  }, [supabaseClient]);

  return { notifications, isLoading, error, hasMore, loadMore, markAsRead, markAllRead };
}
