import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { LeaderboardEntry, TimeFilter } from '@/types/gamification';

const PAGE_SIZE = 50;

interface UseLeaderboardReturn {
  entries: LeaderboardEntry[];
  isLoading: boolean;
  error: string | null;
  timeFilter: TimeFilter;
  setTimeFilter: (f: TimeFilter) => void;
  loadMore: () => void;
  hasMore: boolean;
}

export function useLeaderboard(): UseLeaderboardReturn {
  const { supabaseClient, session } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);

  const getPointsColumn = (filter: TimeFilter) => {
    switch (filter) {
      case '7d': return 'points_7d';
      case '30d': return 'points_30d';
      default: return 'total_points';
    }
  };

  const fetchLeaderboard = useCallback(async (filter: TimeFilter, appendOffset: number) => {
    if (!supabaseClient) return;
    if (appendOffset === 0) setIsLoading(true);
    setError(null);

    try {
      const pointsCol = getPointsColumn(filter);

      // Query member_stats joined with community_members and profiles
      const { data, error: fetchErr } = await supabaseClient
        .from('member_stats')
        .select(`
          community_member_id,
          total_points,
          current_level,
          points_7d,
          points_30d,
          community_members!inner (
            member_id,
            role,
            status,
            profiles!inner (
              id,
              display_name,
              avatar_url,
              username,
              membership_status
            )
          )
        ` as any)
        .order(pointsCol, { ascending: false })
        .range(appendOffset, appendOffset + PAGE_SIZE - 1);

      if (fetchErr) throw fetchErr;

      // Fetch levels for name lookup
      const { data: levels } = await supabaseClient
        .from('levels')
        .select('level_number, name')
        .order('level_number', { ascending: true });

      const levelMap = new Map<number, string>();
      levels?.forEach((l) => levelMap.set(l.level_number, l.name));

      const mapped: LeaderboardEntry[] = (data || [])
        .filter((row: any) => {
          const cm = row.community_members;
          const profile = cm?.profiles;
          // Exclude AI agents from leaderboard
          if (profile?.is_agent) return false;
          return cm?.status === 'active' && profile?.membership_status === 'approved';
        })
        .map((row: any, index: number) => {
          const cm = row.community_members;
          const profile = cm.profiles;
          const points = filter === '7d' ? row.points_7d : filter === '30d' ? row.points_30d : row.total_points;
          return {
            rank: appendOffset + index + 1,
            member_id: profile.id,
            display_name: profile.display_name,
            avatar_url: profile.avatar_url,
            username: profile.username,
            level_number: row.current_level,
            level_name: levelMap.get(row.current_level) || 'Newcomer',
            points,
            is_current_user: profile.id === session?.user?.id,
          };
        });

      if (appendOffset === 0) {
        setEntries(mapped);
      } else {
        setEntries((prev) => [...prev, ...mapped]);
      }
      setHasMore(mapped.length === PAGE_SIZE);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [supabaseClient, session?.user?.id]);

  useEffect(() => {
    setOffset(0);
    fetchLeaderboard(timeFilter, 0);
  }, [timeFilter, fetchLeaderboard]);

  const loadMore = useCallback(() => {
    const nextOffset = offset + PAGE_SIZE;
    setOffset(nextOffset);
    fetchLeaderboard(timeFilter, nextOffset);
  }, [offset, timeFilter, fetchLeaderboard]);

  const handleSetTimeFilter = useCallback((f: TimeFilter) => {
    setOffset(0);
    setTimeFilter(f);
  }, []);

  return { entries, isLoading, error, timeFilter, setTimeFilter: handleSetTimeFilter, loadMore, hasMore };
}
