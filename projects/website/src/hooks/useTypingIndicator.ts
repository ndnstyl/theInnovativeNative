import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface UseTypingIndicatorReturn {
  isPartnerTyping: boolean;
  sendTyping: () => void;
}

export function useTypingIndicator(conversationId: string | null): UseTypingIndicatorReturn {
  const { supabaseClient, session } = useAuth();
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const lastSentRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!supabaseClient || !conversationId || !session?.user?.id) return;

    const channel = supabaseClient
      .channel(`typing:${conversationId}`)
      .on('broadcast', { event: 'typing' }, (payload: any) => {
        if (payload.payload?.user_id !== session.user.id) {
          setIsPartnerTyping(true);
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => setIsPartnerTyping(false), 5000);
        }
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      supabaseClient.removeChannel(channel);
      channelRef.current = null;
    };
  }, [supabaseClient, conversationId, session?.user?.id]);

  const sendTyping = useCallback(() => {
    if (!channelRef.current || !session?.user?.id) return;
    const now = Date.now();
    if (now - lastSentRef.current < 1000) return; // throttle 1/sec
    lastSentRef.current = now;

    channelRef.current.send({
      type: 'broadcast',
      event: 'typing',
      payload: { user_id: session.user.id },
    });
  }, [session?.user?.id]);

  return { isPartnerTyping, sendTyping };
}
