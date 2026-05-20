import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';
import { COMMUNITY_ID } from '@/lib/constants';

export function useCommunityStats() {
  const { supabaseClient } = useAuth();
  const [memberCount, setMemberCount] = useState<number>(0);
  const [adminCount, setAdminCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCounts = useCallback(async () => {
    if (!supabaseClient) return;

    // Use SECURITY DEFINER RPC function — works for unauthenticated visitors
    // without exposing raw community_members data
    const { data, error: rpcError } = await supabaseClient
      .rpc('get_community_stats', { p_community_id: COMMUNITY_ID });

    if (rpcError) {
      logger.error('useCommunityStats', 'fetchCounts', rpcError);
      setError(rpcError.message);
      setLoading(false);
      return;
    }

    if (data && data.length > 0) {
      setMemberCount(Number(data[0].member_count) || 0);
      setAdminCount(Number(data[0].admin_count) || 0);
    }
    setError(null);
    setLoading(false);
  }, [supabaseClient]);

  // Keep a stable ref to fetchCounts for the debounced callback
  const fetchCountsRef = useRef(fetchCounts);
  fetchCountsRef.current = fetchCounts;

  const debouncedFetch = useRef(
    (() => {
      let timer: NodeJS.Timeout;
      return () => {
        clearTimeout(timer);
        timer = setTimeout(() => fetchCountsRef.current(), 500);
      };
    })()
  ).current;

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  // Re-fetch when auth state changes (ensures counts work after session restore)
  useEffect(() => {
    if (!supabaseClient) return;
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(() => {
      fetchCounts();
    });
    return () => subscription.unsubscribe();
  }, [supabaseClient, fetchCounts]);

  // Realtime subscription: refetch counts on INSERT/DELETE
  useEffect(() => {
    if (!supabaseClient) return;

    const channel = supabaseClient
      .channel('community-stats')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'community_members',
        },
        () => debouncedFetch()
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'community_members',
        },
        () => debouncedFetch()
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'community_members',
        },
        () => debouncedFetch()
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [supabaseClient, debouncedFetch]);

  return { memberCount, adminCount, loading, error, refetch: fetchCounts };
}
