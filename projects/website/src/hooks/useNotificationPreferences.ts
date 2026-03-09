import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { NotificationPreference, NotificationType, NotificationChannel } from '@/types/notifications';

interface UseNotificationPreferencesReturn {
  preferences: NotificationPreference[];
  isLoading: boolean;
  toggle: (type: NotificationType, channel: NotificationChannel) => void;
  isEnabled: (type: NotificationType, channel: NotificationChannel) => boolean;
}

export function useNotificationPreferences(): UseNotificationPreferencesReturn {
  const { supabaseClient, session } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!supabaseClient || !session?.user?.id) return;

    supabaseClient
      .from('notification_preferences')
      .select('notification_type, channel, enabled')
      .eq('user_id', session.user.id)
      .then(({ data }) => {
        if (data) {
          setPreferences(data as NotificationPreference[]);
        }
        setIsLoading(false);
      });
  }, [supabaseClient, session?.user?.id]);

  const isEnabled = useCallback((type: NotificationType, channel: NotificationChannel): boolean => {
    const pref = preferences.find((p) => p.notification_type === type && p.channel === channel);
    return pref ? pref.enabled : true; // default enabled
  }, [preferences]);

  const toggle = useCallback(async (type: NotificationType, channel: NotificationChannel) => {
    if (!supabaseClient || !session?.user?.id) return;

    const current = isEnabled(type, channel);
    const newVal = !current;

    // Optimistic update
    setPreferences((prev) => {
      const existing = prev.find((p) => p.notification_type === type && p.channel === channel);
      if (existing) {
        return prev.map((p) => (p.notification_type === type && p.channel === channel) ? { ...p, enabled: newVal } : p);
      }
      return [...prev, { notification_type: type, channel, enabled: newVal }];
    });

    await supabaseClient
      .from('notification_preferences')
      .upsert({
        user_id: session.user.id,
        notification_type: type,
        channel,
        enabled: newVal,
        updated_at: new Date().toISOString(),
      });
  }, [supabaseClient, session?.user?.id, isEnabled]);

  return { preferences, isLoading, toggle, isEnabled };
}
