import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface SearchResult {
  result_type: 'post' | 'member' | 'course' | 'event';
  result_id: string;
  title: string;
  snippet: string;
  url: string;
  rank: number;
}

export function useGlobalSearch() {
  const { supabaseClient } = useAuth();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  const search = useCallback(async (q: string, type: string = 'all') => {
    if (!supabaseClient || !q.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setQuery(q);

    const { data } = await supabaseClient.rpc('global_search', {
      p_query: q,
      p_type: type,
      p_limit: 20,
    });

    setResults((data as any[]) || []);
    setLoading(false);
  }, [supabaseClient]);

  const clear = useCallback(() => {
    setResults([]);
    setQuery('');
  }, []);

  return { results, loading, query, search, clear };
}
