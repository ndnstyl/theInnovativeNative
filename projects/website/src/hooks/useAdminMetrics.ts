import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { COMMUNITY_ID } from '@/lib/constants';

export interface AdminMetric {
  metric_name: string;
  current_value: number;
  previous_value: number;
  trend_percentage: number;
  trend_direction: 'up' | 'down' | 'flat';
  computed_at: string;
}

export function useAdminMetrics() {
  const { supabaseClient, session, role } = useAuth();
  const [metrics, setMetrics] = useState<AdminMetric[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = role === 'admin' || role === 'moderator' || role === 'owner';

  useEffect(() => {
    if (!supabaseClient || !session || !isAdmin) {
      setMetrics([]);
      setLoading(false);
      return;
    }

    async function fetch() {
      setLoading(true);
      const { data } = await supabaseClient
        .from('dashboard_metrics')
        .select('*')
        .eq('community_id', COMMUNITY_ID)
        .order('metric_name');

      setMetrics((data as any[] || []).map(d => ({
        metric_name: d.metric_name,
        current_value: Number(d.current_value),
        previous_value: Number(d.previous_value),
        trend_percentage: Number(d.trend_percentage),
        trend_direction: d.trend_direction as 'up' | 'down' | 'flat',
        computed_at: d.computed_at,
      })));
      setLoading(false);
    }

    fetch();
  }, [supabaseClient, session, isAdmin]);

  return { metrics, loading };
}
