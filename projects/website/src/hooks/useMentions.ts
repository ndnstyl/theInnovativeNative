import { useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { MentionItem } from '@/types/feed';

export function useMentions() {
  const { supabaseClient } = useAuth();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchMembers = useCallback(async (query: string): Promise<MentionItem[]> => {
    if (!supabaseClient || !query || query.length < 1) return [];

    // Clear previous debounce
    if (timerRef.current) clearTimeout(timerRef.current);

    return new Promise((resolve) => {
      timerRef.current = setTimeout(async () => {
        try {
          const { data } = await supabaseClient
            .from('profiles')
            .select('id, display_name, avatar_url')
            .ilike('display_name', `%${query}%`)
            .limit(10);

          if (!data) {
            resolve([]);
            return;
          }

          resolve(data.map(p => ({
            id: p.id,
            label: p.display_name,
            avatar_url: p.avatar_url,
          })));
        } catch {
          resolve([]);
        }
      }, 300);
    });
  }, [supabaseClient]);

  return { searchMembers };
}
