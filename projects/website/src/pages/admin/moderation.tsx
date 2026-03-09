import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ModerationQueue from '@/components/admin/ModerationQueue';
import { useModeration } from '@/hooks/useModeration';

export default function AdminModeration() {
  const { reports, loading, filter, setFilter, dismissReport, removeContent } = useModeration();

  return (
    <AdminLayout title="Moderation">
      <ModerationQueue
        reports={reports}
        loading={loading}
        filter={filter}
        onFilterChange={setFilter}
        onDismiss={dismissReport}
        onRemove={removeContent}
      />
    </AdminLayout>
  );
}
