import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { RsvpStatus } from '@/types/calendar';

interface UseRsvpReturn {
  rsvp: () => Promise<void>;
  cancelRsvp: () => Promise<void>;
  isRsvped: boolean;
  rsvpStatus: RsvpStatus | null;
  isLoading: boolean;
  error: string | null;
}

export function useRsvp(
  occurrenceId: string,
  initialStatus: RsvpStatus | null
): UseRsvpReturn {
  const { supabaseClient, session } = useAuth();
  const [rsvpStatus, setRsvpStatus] = useState<RsvpStatus | null>(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rsvp = useCallback(async () => {
    if (!supabaseClient || !session?.user?.id) return;
    setIsLoading(true);
    setError(null);

    // Optimistic
    const prev = rsvpStatus;
    setRsvpStatus('confirmed');

    try {
      const { data, error: rpcErr } = await supabaseClient.rpc('rsvp_to_event', {
        p_occurrence_id: occurrenceId,
        p_user_id: session.user.id,
      });

      if (rpcErr) throw rpcErr;

      const result = data as any;
      if (!result?.success) {
        setRsvpStatus(prev);
        setError(result?.status === 'full' ? 'Event is full' : 'RSVP failed');
      }
    } catch (err: any) {
      setRsvpStatus(prev);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [supabaseClient, session?.user?.id, occurrenceId, rsvpStatus]);

  const cancelRsvp = useCallback(async () => {
    if (!supabaseClient || !session?.user?.id) return;
    setIsLoading(true);
    setError(null);

    const prev = rsvpStatus;
    setRsvpStatus('cancelled');

    try {
      const { data, error: rpcErr } = await supabaseClient.rpc('cancel_rsvp', {
        p_occurrence_id: occurrenceId,
        p_user_id: session.user.id,
      });

      if (rpcErr) throw rpcErr;
      const result = data as any;
      if (!result?.success) {
        setRsvpStatus(prev);
        setError('Cancel failed');
      }
    } catch (err: any) {
      setRsvpStatus(prev);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [supabaseClient, session?.user?.id, occurrenceId, rsvpStatus]);

  return {
    rsvp,
    cancelRsvp,
    isRsvped: rsvpStatus === 'confirmed',
    rsvpStatus,
    isLoading,
    error,
  };
}
