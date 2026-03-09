import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { EventWithOccurrence, AttendeeData, RsvpStatus } from '@/types/calendar';

interface UseEventDetailReturn {
  event: EventWithOccurrence | null;
  attendees: AttendeeData[];
  rsvpCount: number;
  userRsvp: RsvpStatus | null;
  isLoading: boolean;
  error: string | null;
}

export function useEventDetail(occurrenceId: string | undefined): UseEventDetailReturn {
  const { supabaseClient, session } = useAuth();
  const [event, setEvent] = useState<EventWithOccurrence | null>(null);
  const [attendees, setAttendees] = useState<AttendeeData[]>([]);
  const [rsvpCount, setRsvpCount] = useState(0);
  const [userRsvp, setUserRsvp] = useState<RsvpStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!occurrenceId || !supabaseClient) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchDetail() {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch occurrence with event
        const { data: occRaw, error: occErr } = await supabaseClient
          .from('event_occurrences')
          .select(`
            *,
            events!inner (
              *,
              event_categories ( name, color ),
              profiles!events_creator_id_fkey ( id, display_name, avatar_url )
            )
          ` as any)
          .eq('id', occurrenceId!)
          .single();

        if (occErr) throw occErr;
        if (cancelled) return;

        const occ = occRaw as any;
        const evt = occ?.events;
        const host = evt?.profiles;
        const cat = evt?.event_categories;

        setEvent({
          event_id: evt?.id || occ.event_id,
          community_id: occ.community_id,
          title: evt?.title || '',
          description: evt?.description,
          location_url: evt?.location_url,
          cover_image_url: evt?.cover_image_url,
          host_id: evt?.creator_id,
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
        });
        setRsvpCount(occ.rsvp_count);

        // Fetch attendees
        const { data: rsvps } = await supabaseClient
          .from('event_rsvps')
          .select(`
            user_id,
            status,
            created_at,
            profiles!event_rsvps_user_id_fkey (
              display_name,
              avatar_url,
              username
            )
          ` as any)
          .eq('occurrence_id', occurrenceId!)
          .in('status', ['confirmed', 'attended'])
          .order('created_at', { ascending: true })
          .limit(20);

        if (cancelled) return;

        const attendeeList: AttendeeData[] = (rsvps || []).map((r: any) => ({
          user_id: r.user_id,
          display_name: r.profiles?.display_name || 'Unknown',
          avatar_url: r.profiles?.avatar_url,
          username: r.profiles?.username,
          rsvp_status: r.status,
          rsvp_timestamp: r.created_at,
        }));
        setAttendees(attendeeList);

        // Check current user's RSVP
        if (session?.user?.id) {
          const { data: myRsvp } = await supabaseClient
            .from('event_rsvps')
            .select('status')
            .eq('occurrence_id', occurrenceId!)
            .eq('user_id', session.user.id)
            .single();

          if (!cancelled) {
            setUserRsvp(myRsvp?.status as RsvpStatus || null);
          }
        }
      } catch (err: any) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchDetail();

    // Realtime subscription for RSVP changes
    const channel = supabaseClient
      .channel(`event_rsvps_${occurrenceId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_rsvps',
          filter: `occurrence_id=eq.${occurrenceId}`,
        },
        () => { fetchDetail(); }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabaseClient.removeChannel(channel);
    };
  }, [occurrenceId, supabaseClient, session?.user?.id]);

  return { event, attendees, rsvpCount, userRsvp, isLoading, error };
}
