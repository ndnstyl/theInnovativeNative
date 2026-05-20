import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { MessageWithSender } from '@/types/messaging';

const PAGE_SIZE = 50;

interface UseMessagesReturn {
  messages: MessageWithSender[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  loadOlder: () => void;
  sendMessage: (body: string) => Promise<boolean>;
  markRead: () => void;
}

export function useMessages(conversationId: string | null): UseMessagesReturn {
  const { supabaseClient, session } = useAuth();
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const oldestRef = useRef<string | null>(null);

  const fetchMessages = useCallback(async (before?: string) => {
    if (!supabaseClient || !conversationId) return;
    setIsLoading(true);
    setError(null);

    try {
      let query = supabaseClient
        .from('messages')
        .select(`
          id,
          conversation_id,
          sender_id,
          body,
          created_at,
          profiles!messages_sender_id_fkey (
            display_name,
            avatar_url
          )
        ` as any)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .limit(PAGE_SIZE);

      if (before) {
        query = query.lt('created_at', before);
      }

      const { data, error: fetchErr } = await query;
      if (fetchErr) throw fetchErr;

      const mapped: MessageWithSender[] = (data || []).reverse().map((m: any) => ({
        id: m.id,
        conversation_id: m.conversation_id,
        sender_id: m.sender_id,
        body: m.body,
        created_at: m.created_at,
        sender: {
          display_name: m.profiles?.display_name || 'Unknown',
          avatar_url: m.profiles?.avatar_url,
        },
      }));

      if (before) {
        setMessages((prev) => [...mapped, ...prev]);
      } else {
        setMessages(mapped);
      }

      setHasMore((data || []).length === PAGE_SIZE);
      if (mapped.length > 0) {
        oldestRef.current = mapped[0].created_at;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [supabaseClient, conversationId]);

  useEffect(() => {
    if (conversationId) {
      setMessages([]);
      oldestRef.current = null;
      fetchMessages();
    }
  }, [conversationId, fetchMessages]);

  // Realtime subscription for new messages
  useEffect(() => {
    if (!supabaseClient || !conversationId) return;

    const channel = supabaseClient
      .channel(`messages_${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload: any) => {
          const newMsg = payload.new;
          // Fetch sender profile
          const { data: profile } = await supabaseClient
            .from('profiles')
            .select('display_name, avatar_url')
            .eq('id', newMsg.sender_id)
            .single();

          const msg: MessageWithSender = {
            id: newMsg.id,
            conversation_id: newMsg.conversation_id,
            sender_id: newMsg.sender_id,
            body: newMsg.body,
            created_at: newMsg.created_at,
            sender: {
              display_name: (profile as any)?.display_name || 'Unknown',
              avatar_url: (profile as any)?.avatar_url,
            },
          };

          setMessages((prev) => {
            if (prev.some((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [supabaseClient, conversationId]);

  const sendMessage = useCallback(async (body: string): Promise<boolean> => {
    if (!supabaseClient || !session?.user?.id || !conversationId) return false;
    if (!body.trim() || body.length > 5000) return false;

    try {
      const { error: insertErr } = await supabaseClient
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: session.user.id,
          body: body.trim(),
        });

      if (insertErr) throw insertErr;
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  }, [supabaseClient, session?.user?.id, conversationId]);

  const markRead = useCallback(async () => {
    if (!supabaseClient || !session?.user?.id || !conversationId || messages.length === 0) return;

    const lastMsg = messages[messages.length - 1];
    await supabaseClient
      .from('conversation_participants')
      .update({ last_read_message_id: lastMsg.id, last_read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .eq('user_id', session.user.id);
  }, [supabaseClient, session?.user?.id, conversationId, messages]);

  const loadOlder = useCallback(() => {
    if (hasMore && oldestRef.current) {
      fetchMessages(oldestRef.current);
    }
  }, [hasMore, fetchMessages]);

  return { messages, isLoading, error, hasMore, loadOlder, sendMessage, markRead };
}
