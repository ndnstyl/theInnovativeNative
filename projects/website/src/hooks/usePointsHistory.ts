import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { PointHistoryEntry } from '@/types/gamification';

const PAGE_SIZE = 20;

interface UsePointsHistoryReturn {
  entries: PointHistoryEntry[];
  isLoading: boolean;
  error: string | null;
  loadMore: () => void;
  hasMore: boolean;
}

export function usePointsHistory(memberId: string | undefined): UsePointsHistoryReturn {
  const { supabaseClient } = useAuth();
  const [entries, setEntries] = useState<PointHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);

  const fetchHistory = useCallback(async (currentOffset: number) => {
    if (!memberId || !supabaseClient) return;
    if (currentOffset === 0) setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchErr } = await supabaseClient.rpc('get_points_history', {
        p_member_id: memberId,
        p_limit: PAGE_SIZE,
        p_offset: currentOffset,
      });

      if (fetchErr) throw fetchErr;

      const mapped: PointHistoryEntry[] = (data || []).map((row: any) => ({
        id: row.id,
        source_type: row.source_type,
        source_description: row.source_description,
        points: row.points,
        created_at: row.created_at,
      }));

      if (currentOffset === 0) {
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
  }, [memberId, supabaseClient]);

  useEffect(() => {
    setOffset(0);
    fetchHistory(0);
  }, [fetchHistory]);

  const loadMore = useCallback(() => {
    const nextOffset = offset + PAGE_SIZE;
    setOffset(nextOffset);
    fetchHistory(nextOffset);
  }, [offset, fetchHistory]);

  return { entries, isLoading, error, loadMore, hasMore };
}
