import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const COMMUNITY_ID = 'a0000000-0000-0000-0000-000000000001';

export interface ReportWithReporter {
  id: string;
  reporter_id: string;
  content_type: 'post' | 'comment';
  content_id: string;
  reason: string;
  status: 'pending' | 'dismissed' | 'actioned';
  admin_action: string | null;
  actioned_by: string | null;
  actioned_at: string | null;
  created_at: string;
  reporter?: { display_name: string; avatar_url: string | null };
}

export function useModeration() {
  const { supabaseClient, session } = useAuth();
  const [reports, setReports] = useState<ReportWithReporter[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');

  const fetchReports = useCallback(async () => {
    if (!supabaseClient) return;
    setLoading(true);

    let query = supabaseClient
      .from('content_reports')
      .select('*, reporter:profiles!content_reports_reporter_id_fkey(display_name, avatar_url)')
      .eq('community_id', COMMUNITY_ID)
      .order('created_at', { ascending: false })
      .limit(50);

    if (filter === 'pending') {
      query = query.eq('status', 'pending');
    }

    const { data } = await query;
    setReports((data as any[] || []).map(r => ({
      ...r,
      reporter: r.reporter || undefined,
    })));
    setLoading(false);
  }, [supabaseClient, filter]);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  const dismissReport = useCallback(async (reportId: string) => {
    if (!supabaseClient || !session) return;
    await supabaseClient
      .from('content_reports')
      .update({
        status: 'dismissed',
        admin_action: 'dismissed',
        actioned_by: session.user.id,
        actioned_at: new Date().toISOString(),
      })
      .eq('id', reportId);

    await supabaseClient.rpc('log_admin_action', {
      p_action_type: 'dismiss_report',
      p_target_type: 'report',
      p_target_id: reportId,
      p_description: 'Report dismissed',
    });

    fetchReports();
  }, [supabaseClient, session, fetchReports]);

  const removeContent = useCallback(async (reportId: string, contentType: string, contentId: string) => {
    if (!supabaseClient) return;
    await supabaseClient.rpc('remove_content', {
      p_content_type: contentType,
      p_content_id: contentId,
      p_report_id: reportId,
    });
    fetchReports();
  }, [supabaseClient, fetchReports]);

  return { reports, loading, filter, setFilter, dismissReport, removeContent, refetch: fetchReports };
}
