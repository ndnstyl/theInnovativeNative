import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { RealtimeChannel } from '@supabase/supabase-js';

export function usePresence() {
  const { supabaseClient, session } = useAuth();
  const [onlineCount, setOnlineCount] = useState<number>(0);
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!supabaseClient) return;

    // Only open presence channel for authenticated users
    if (!session?.user?.id) {
      setOnlineCount(0);
      setIsConnected(false);
      return;
    }

    const channel = supabaseClient.channel('classroom-presence', {
      config: { presence: { key: session.user.id } },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setOnlineCount(Object.keys(state).length);
      })
      .subscribe(async (status: string) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          await channel.track({
            user_id: session.user.id,
            online_at: new Date().toISOString(),
          });
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabaseClient.removeChannel(channelRef.current);
      }
      setOnlineCount(0);
      setIsConnected(false);
    };
  }, [supabaseClient, session?.user?.id]);

  return { onlineCount, isConnected };
}
