import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { trackBeginCheckout } from '@/lib/analytics';
import type { Course } from '@/types/supabase';

export function useCourseCheckout() {
  const { supabaseClient, session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = useCallback(async (
    course: Course
  ) => {
    if (!session?.user) return;

    // Free courses don't need checkout
    if (course.is_free) return;

    if (!course.stripe_price_id) {
      setError('No price configured for this course');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      trackBeginCheckout(course.id, course.title, 0);

      const { data, error: invokeErr } = await supabaseClient.functions.invoke('create-checkout', {
        body: {
          courseId: course.id,
          priceId: course.stripe_price_id,
        },
      });

      if (invokeErr) throw invokeErr;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Checkout failed';
      setError(message);
      setLoading(false);
    }
  }, [supabaseClient, session]);

  return { startCheckout, loading, error };
}
