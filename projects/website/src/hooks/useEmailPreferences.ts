import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface EmailPrefs {
  welcome_email: boolean;
  enrollment_email: boolean;
  payment_email: boolean;
  event_reminder: boolean;
  weekly_digest: boolean;
  marketing: boolean;
  unsubscribed_all: boolean;
}

const DEFAULTS: EmailPrefs = {
  welcome_email: true,
  enrollment_email: true,
  payment_email: true,
  event_reminder: true,
  weekly_digest: true,
  marketing: false,
  unsubscribed_all: false,
};

export function useEmailPreferences() {
  const { supabaseClient, session } = useAuth();
  const [prefs, setPrefs] = useState<EmailPrefs>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!supabaseClient || !session) { setLoading(false); return; }

    async function fetch() {
      setLoading(true);
      const { data } = await supabaseClient
        .from('email_preferences')
        .select('*')
        .eq('user_id', session!.user.id)
        .maybeSingle();

      if (data) {
        const d = data as any;
        setPrefs({
          welcome_email: d.welcome_email,
          enrollment_email: d.enrollment_email,
          payment_email: d.payment_email,
          event_reminder: d.event_reminder,
          weekly_digest: d.weekly_digest,
          marketing: d.marketing,
          unsubscribed_all: d.unsubscribed_all,
        });
      }
      setLoading(false);
    }

    fetch();
  }, [supabaseClient, session]);

  const updatePref = useCallback(async (key: keyof EmailPrefs, value: boolean) => {
    if (!supabaseClient || !session) return;
    setSaving(true);

    const updates: any = { [key]: value, updated_at: new Date().toISOString() };

    // If unsubscribing all, set everything to false
    if (key === 'unsubscribed_all' && value) {
      Object.keys(DEFAULTS).forEach(k => {
        if (k !== 'unsubscribed_all') updates[k] = false;
      });
    }

    await supabaseClient
      .from('email_preferences')
      .upsert({
        user_id: session.user.id,
        ...prefs,
        ...updates,
      }, { onConflict: 'user_id' });

    setPrefs(prev => ({ ...prev, ...updates }));
    setSaving(false);
  }, [supabaseClient, session, prefs]);

  return { prefs, loading, saving, updatePref };
}
