import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function useLastActive() {
  const { supabaseClient, session } = useAuth();
  const lastCalledRef = useRef<number>(0);

  useEffect(() => {
    if (!session?.user?.id) return;

    const update = () => {
      const now = Date.now();
      // Debounce: max once per 5 minutes
      if (now - lastCalledRef.current < 5 * 60 * 1000) return;
      lastCalledRef.current = now;

      supabaseClient.rpc('update_last_active', { p_user_id: session.user.id });
    };

    // Fire on mount
    update();

    // Fire on window focus
    const handleFocus = () => update();
    window.addEventListener('focus', handleFocus);

    return () => window.removeEventListener('focus', handleFocus);
  }, [supabaseClient, session]);
}
