import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface AuditEntry {
  id: string;
  admin_user_id: string;
  action_type: string;
  target_type: string | null;
  target_id: string | null;
  description: string | null;
  metadata: any;
  created_at: string;
  admin?: { display_name: string; avatar_url: string | null };
}

export function useAuditLog() {
  const { supabaseClient } = useAuth();
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 25;

  const fetchEntries = useCallback(async (pageNum: number, append = false) => {
    if (!supabaseClient) return;
    setLoading(true);

    const { data } = await supabaseClient
      .from('admin_audit_log')
      .select('*, admin:profiles!admin_audit_log_admin_user_id_fkey(display_name, avatar_url)')
      .order('created_at', { ascending: false })
      .range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1);

    const mapped = (data as any[] || []).map((e: any) => ({
      ...e,
      admin: e.admin || undefined,
    }));

    if (append) {
      setEntries(prev => [...prev, ...mapped]);
    } else {
      setEntries(mapped);
    }
    setHasMore(mapped.length === PAGE_SIZE);
    setLoading(false);
  }, [supabaseClient]);

  useEffect(() => { fetchEntries(0); }, [fetchEntries]);

  const loadMore = useCallback(() => {
    const next = page + 1;
    setPage(next);
    fetchEntries(next, true);
  }, [page, fetchEntries]);

  return { entries, loading, hasMore, loadMore };
}
