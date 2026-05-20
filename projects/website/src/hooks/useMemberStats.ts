import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { MemberStats, Level } from '@/types/supabase';

interface UseMemberStatsReturn {
  stats: MemberStats | null;
  level: Level | null;
  nextLevel: Level | null;
  isLoading: boolean;
  error: string | null;
}

export function useMemberStats(memberId: string | undefined): UseMemberStatsReturn {
  const { supabaseClient } = useAuth();
  const [stats, setStats] = useState<MemberStats | null>(null);
  const [level, setLevel] = useState<Level | null>(null);
  const [nextLevel, setNextLevel] = useState<Level | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!memberId || !supabaseClient) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchStats() {
      setIsLoading(true);
      setError(null);

      try {
        // Get the community_member record for this user
        const { data: cm } = await supabaseClient
          .from('community_members')
          .select('id')
          .eq('member_id', memberId!)
          .single();

        if (!cm) {
          setIsLoading(false);
          return;
        }

        // Fetch member_stats
        const { data: statsData, error: statsErr } = await supabaseClient
          .from('member_stats')
          .select('*')
          .eq('community_member_id', cm.id)
          .single();

        if (statsErr && statsErr.code !== 'PGRST116') {
          throw statsErr;
        }

        if (cancelled) return;
        setStats(statsData);

        // Fetch all levels to find current and next
        const { data: levels } = await supabaseClient
          .from('levels')
          .select('*')
          .order('level_number', { ascending: true });

        if (cancelled) return;

        if (levels && statsData) {
          const currentLevel = levels.find(
            (l) => l.level_number === statsData.current_level
          );
          const next = levels.find(
            (l) => l.level_number === statsData.current_level + 1
          );
          setLevel(currentLevel || null);
          setNextLevel(next || null);
        }
      } catch (err: any) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchStats();

    // Subscribe to realtime updates on member_stats
    const channel = supabaseClient
      .channel(`member_stats_${memberId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'member_stats',
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabaseClient.removeChannel(channel);
    };
  }, [memberId, supabaseClient]);

  return { stats, level, nextLevel, isLoading, error };
}
