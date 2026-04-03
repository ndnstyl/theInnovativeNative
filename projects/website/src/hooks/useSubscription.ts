import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { COMMUNITY_ID } from '@/lib/constants';

export interface UserSubscription {
  id: string;
  plan: string;
  status: string;
  lifetime_access: boolean;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  stripe_customer_id: string | null;
}

export function useSubscription() {
  const { supabaseClient, session } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabaseClient || !session) { setLoading(false); return; }

    async function fetch() {
      setLoading(true);
      const { data } = await supabaseClient
        .from('subscriptions')
        .select('*')
        .eq('community_id', COMMUNITY_ID)
        .eq('user_id', session!.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        const d = data as any;
        setSubscription({
          id: d.id,
          plan: d.plan,
          status: d.status,
          lifetime_access: d.lifetime_access,
          current_period_end: d.current_period_end,
          cancel_at_period_end: d.cancel_at_period_end,
          stripe_customer_id: d.stripe_customer_id,
        });
      }
      setLoading(false);
    }

    fetch();
  }, [supabaseClient, session]);

  const isActive = subscription?.status === 'active' || subscription?.status === 'trialing' || subscription?.lifetime_access === true;

  const openCustomerPortal = useCallback(async () => {
    if (!subscription?.stripe_customer_id) return;
    // Redirect to Stripe Customer Portal
    // This URL should be configured in Stripe Dashboard > Settings > Customer portal
    const portalUrl = `https://billing.stripe.com/p/login/${process.env.NEXT_PUBLIC_STRIPE_PORTAL_ID || ''}`;
    window.open(portalUrl, '_blank');
  }, [subscription]);

  return { subscription, loading, isActive, openCustomerPortal };
}
