import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { EventWithOccurrence } from '@/types/calendar';

const PAGE_SIZE = 20;

interface UseEventsReturn {
  events: EventWithOccurrence[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  view: 'upcoming' | 'past';
  setView: (v: 'upcoming' | 'past') => void;
  filterByCategory: (id: string | null) => void;
  setPage: (n: number) => void;
  hasMore: boolean;
}

export function useEvents(): UseEventsReturn {
  const { supabaseClient } = useAuth();
  const [events, setEvents] = useState<EventWithOccurrence[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'upcoming' | 'past'>('upcoming');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const fetchEvents = useCallback(async () => {
    if (!supabaseClient) return;
    setIsLoading(true);
    setError(null);

    try {
      let query = supabaseClient
        .from('event_occurrences')
        .select(`
          id,
          event_id,
          community_id,
          start_time,
          end_time,
          title_override,
          description_override,
          location_override,
          status,
          rsvp_count,
          events!inner (
            id,
            title,
            description,
            location_url,
            cover_image_url,
            created_by,
            capacity,
            timezone,
            category_id,
            recurrence_rule,
            event_categories (
              name,
              color
            ),
            profiles!events_created_by_fkey (
              display_name,
              avatar_url
            )
          )
        ` as any);

      if (view === 'upcoming') {
        query = query
          .in('status', ['upcoming'])
          .gte('start_time', new Date().toISOString())
          .order('start_time', { ascending: true });
      } else {
        query = query
          .in('status', ['completed', 'cancelled'])
          .order('start_time', { ascending: false });
      }

      const start = page * PAGE_SIZE;
      query = query.range(start, start + PAGE_SIZE - 1);

      const { data, error: fetchErr } = await query;
      if (fetchErr) throw fetchErr;

      const mapped: EventWithOccurrence[] = (data || []).map((occ: any) => {
        const evt = occ.events;
        const host = evt?.profiles;
        const cat = evt?.event_categories;
        return {
          event_id: evt?.id || occ.event_id,
          community_id: occ.community_id,
          title: evt?.title || '',
          description: evt?.description,
          location_url: evt?.location_url,
          cover_image_url: evt?.cover_image_url,
          host_id: evt?.created_by,
          host_name: host?.display_name || 'Unknown',
          host_avatar: host?.avatar_url,
          capacity: evt?.capacity || 0,
          category_name: cat?.name || null,
          category_color: cat?.color || null,
          recurrence_rule: evt?.recurrence_rule,
          timezone: evt?.timezone || 'UTC',
          occurrence_id: occ.id,
          start_time: occ.start_time,
          end_time: occ.end_time,
          status: occ.status,
          rsvp_count: occ.rsvp_count,
          title_override: occ.title_override,
          description_override: occ.description_override,
          display_title: occ.title_override || evt?.title || '',
          display_description: occ.description_override || evt?.description,
        };
      });

      setEvents(mapped);
      setHasMore(mapped.length === PAGE_SIZE);
      setTotalCount(mapped.length + start);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [supabaseClient, view, categoryId, page]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSetView = useCallback((v: 'upcoming' | 'past') => {
    setPage(0);
    setView(v);
  }, []);

  const filterByCategory = useCallback((id: string | null) => {
    setPage(0);
    setCategoryId(id);
  }, []);

  return { events, totalCount, isLoading, error, view, setView: handleSetView, filterByCategory, setPage, hasMore };
}
