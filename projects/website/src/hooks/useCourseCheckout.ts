import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { trackBeginCheckout } from '@/lib/analytics';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

export function useCourseCheckout() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);

  const startCheckout = useCallback(async (
    courseId: string,
    courseName: string,
    stripePriceId: string,
    price: number
  ) => {
    if (!session) return;
    setLoading(true);

    trackBeginCheckout(courseId, courseName, price);

    // For static export, we use Stripe's client-side checkout via Payment Links
    // or redirect to a Supabase Edge Function that creates a checkout session
    const checkoutUrl = `${SUPABASE_URL}/functions/v1/create-checkout?` +
      `price_id=${encodeURIComponent(stripePriceId)}` +
      `&user_id=${encodeURIComponent(session.user.id)}` +
      `&course_id=${encodeURIComponent(courseId)}` +
      `&success_url=${encodeURIComponent(window.location.origin + '/checkout/success?session_id={CHECKOUT_SESSION_ID}')}` +
      `&cancel_url=${encodeURIComponent(window.location.origin + '/checkout/cancel')}`;

    window.location.href = checkoutUrl;
    // setLoading(false) not needed since we're redirecting
  }, [session]);

  return { startCheckout, loading };
}
