import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const COMMUNITY_ID = 'a0000000-0000-0000-0000-000000000001';

export interface CommunitySettingsData {
  id: string;
  community_name: string;
  description: string | null;
  banner_url: string | null;
  logo_url: string | null;
  privacy_mode: 'public' | 'private' | 'approval_required';
  post_categories: { id: string; name: string; color: string }[];
  timezone: string;
  updated_at: string;
}

export function useCommunitySettings() {
  const { supabaseClient, session } = useAuth();
  const [settings, setSettings] = useState<CommunitySettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!supabaseClient) return;

    async function fetch() {
      setLoading(true);
      const { data } = await supabaseClient
        .from('community_settings')
        .select('*')
        .eq('community_id', COMMUNITY_ID)
        .single();

      if (data) {
        const d = data as any;
        setSettings({
          id: d.id,
          community_name: d.community_name,
          description: d.description,
          banner_url: d.banner_url,
          logo_url: d.logo_url,
          privacy_mode: d.privacy_mode,
          post_categories: Array.isArray(d.post_categories) ? d.post_categories : [],
          timezone: d.timezone,
          updated_at: d.updated_at,
        });
      }
      setLoading(false);
    }

    fetch();
  }, [supabaseClient]);

  const updateSettings = useCallback(async (updates: Partial<CommunitySettingsData>) => {
    if (!supabaseClient || !settings || !session) return;
    setSaving(true);

    const { error } = await supabaseClient
      .from('community_settings')
      .update({
        ...updates,
        updated_by: session.user.id,
        updated_at: new Date().toISOString(),
      } as any)
      .eq('id', settings.id);

    if (!error) {
      setSettings(prev => prev ? { ...prev, ...updates } : prev);
      await supabaseClient.rpc('log_admin_action', {
        p_action_type: 'update_settings',
        p_target_type: 'community_settings',
        p_target_id: settings.id,
        p_description: 'Community settings updated',
      });
    }
    setSaving(false);
    return error;
  }, [supabaseClient, settings, session]);

  return { settings, loading, saving, updateSettings };
}
