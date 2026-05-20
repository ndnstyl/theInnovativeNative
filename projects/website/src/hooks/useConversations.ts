import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { ConversationWithParticipant } from '@/types/messaging';

const PAGE_SIZE = 30;

interface UseConversationsReturn {
  conversations: ConversationWithParticipant[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
}

export function useConversations(): UseConversationsReturn {
  const { supabaseClient, session } = useAuth();
  const [conversations, setConversations] = useState<ConversationWithParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);

  const fetchConversations = useCallback(async (afterCursor?: string | null) => {
    if (!supabaseClient || !session?.user?.id) return;
    setIsLoading(true);
    setError(null);

    try {
      // Get conversations where current user is a participant
      let query = supabaseClient
        .from('conversation_participants')
        .select(`
          conversation_id,
          last_read_message_id,
          conversations!inner (
            id,
            last_message_at,
            last_message_preview
          )
        ` as any)
        .eq('user_id', session.user.id)
        .not('conversations.last_message_at', 'is', null)
        .order('conversations(last_message_at)', { ascending: false } as any)
        .limit(PAGE_SIZE);

      if (afterCursor) {
        query = query.lt('conversations.last_message_at', afterCursor);
      }

      const { data: myConvs, error: convErr } = await query;
      if (convErr) throw convErr;

      const convIds = (myConvs || []).map((c: any) => c.conversation_id);
      if (convIds.length === 0) {
        if (!afterCursor) setConversations([]);
        setHasMore(false);
        setIsLoading(false);
        return;
      }

      // Get other participants for these conversations
      const { data: otherParticipants } = await supabaseClient
        .from('conversation_participants')
        .select(`
          conversation_id,
          user_id,
          profiles!conversation_participants_user_id_fkey (
            id,
            display_name,
            avatar_url,
            username
          )
        ` as any)
        .in('conversation_id', convIds)
        .neq('user_id', session.user.id);

      // Check muted conversations
      const { data: muted } = await supabaseClient
        .from('conversation_mutes')
        .select('conversation_id')
        .eq('user_id', session.user.id);

      const mutedSet = new Set((muted || []).map((m: any) => m.conversation_id));
      const participantMap = new Map<string, any>();
      (otherParticipants || []).forEach((p: any) => {
        participantMap.set(p.conversation_id, p.profiles);
      });

      const mapped: ConversationWithParticipant[] = (myConvs || []).map((c: any) => {
        const conv = c.conversations;
        const other = participantMap.get(c.conversation_id);
        return {
          conversation_id: c.conversation_id,
          last_message_at: conv?.last_message_at,
          last_message_preview: conv?.last_message_preview,
          other_user: {
            id: other?.id || '',
            display_name: other?.display_name || 'Unknown',
            avatar_url: other?.avatar_url,
            username: other?.username,
          },
          is_muted: mutedSet.has(c.conversation_id),
          has_unread: c.last_read_message_id === null && conv?.last_message_at !== null,
        };
      });

      if (afterCursor) {
        setConversations((prev) => [...prev, ...mapped]);
      } else {
        setConversations(mapped);
      }

      setHasMore(mapped.length === PAGE_SIZE);
      if (mapped.length > 0) {
        setCursor(mapped[mapped.length - 1].last_message_at);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [supabaseClient, session?.user?.id]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Realtime subscription for conversation updates
  useEffect(() => {
    if (!supabaseClient || !session?.user?.id) return;

    const channel = supabaseClient
      .channel('conversations_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
        },
        () => { fetchConversations(); }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [supabaseClient, session?.user?.id, fetchConversations]);

  const loadMore = useCallback(() => {
    if (hasMore && cursor) {
      fetchConversations(cursor);
    }
  }, [hasMore, cursor, fetchConversations]);

  return { conversations, isLoading, error, hasMore, loadMore, refresh: () => fetchConversations() };
}
