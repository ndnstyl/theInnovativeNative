import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { LevelConfig } from '@/types/gamification';

interface UseLevelConfigReturn {
  levels: LevelConfig[];
  isLoading: boolean;
}

export function useLevelConfig(): UseLevelConfigReturn {
  const { supabaseClient } = useAuth();
  const [levels, setLevels] = useState<LevelConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!supabaseClient) return;

    async function fetch() {
      const { data } = await supabaseClient
        .from('levels')
        .select('id, level_number, min_points, name, badge_url')
        .order('level_number', { ascending: true });

      if (data) {
        setLevels(
          data.map((row) => ({
            id: row.id,
            level_number: row.level_number,
            min_points: row.min_points,
            name: row.name,
            badge_url: row.badge_url,
          }))
        );
      }
      setIsLoading(false);
    }

    fetch();
  }, [supabaseClient]);

  return { levels, isLoading };
}
