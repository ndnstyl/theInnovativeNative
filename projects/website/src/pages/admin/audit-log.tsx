import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AuditLogList from '@/components/admin/AuditLogList';
import { useAuditLog } from '@/hooks/useAuditLog';

export default function AdminAuditLog() {
  const { entries, loading, hasMore, loadMore } = useAuditLog();

  return (
    <AdminLayout title="Audit Log">
      <AuditLogList
        entries={entries}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={loadMore}
      />
    </AdminLayout>
  );
}
