import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import MemberTable from '@/components/admin/MemberTable';
import { useMemberManagement } from '@/hooks/useMemberManagement';

export default function AdminMembers() {
  const {
    members, loading, search, setSearch, roleFilter, setRoleFilter,
    changeRole, banMember, unbanMember
  } = useMemberManagement();

  return (
    <AdminLayout title="Members">
      <MemberTable
        members={members}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        onChangeRole={changeRole}
        onBan={banMember}
        onUnban={unbanMember}
      />
    </AdminLayout>
  );
}
