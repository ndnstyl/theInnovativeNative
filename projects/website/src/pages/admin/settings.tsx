import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import CommunitySettingsForm from '@/components/admin/CommunitySettingsForm';
import { useCommunitySettings } from '@/hooks/useCommunitySettings';

export default function AdminSettings() {
  const { settings, loading, saving, updateSettings } = useCommunitySettings();

  return (
    <AdminLayout title="Settings" requireOwner>
      <CommunitySettingsForm
        settings={settings}
        loading={loading}
        saving={saving}
        onSave={updateSettings}
      />
    </AdminLayout>
  );
}
