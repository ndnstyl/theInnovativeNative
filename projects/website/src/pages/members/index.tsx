import React from 'react';
import Head from 'next/head';
import ClassroomLayout from '@/components/layout/ClassroomLayout';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import MemberSearch from '@/components/members/MemberSearch';
import MemberGrid from '@/components/members/MemberGrid';
import { useMembers } from '@/hooks/useMembers';
import { useLastActive } from '@/hooks/useLastActive';

const MembersPage = () => {
  useLastActive();
  const {
    members,
    totalCount,
    isLoading,
    error,
    search,
    filterByRole,
    page,
    setPage,
    totalPages,
  } = useMembers();

  return (
    <ClassroomLayout title="Members">
      <ProtectedRoute>
        <Head>
          <title>Members | The Innovative Native</title>
        </Head>
        <div className="members-page">
          <div className="members-page__header">
            <h1>Members</h1>
            <span className="members-page__count">{totalCount} members</span>
          </div>

          <MemberSearch onSearch={search} onFilterRole={filterByRole} />

          {error && (
            <div className="members-page__error">
              <p>{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="members-page__loading">
              <div className="members-page__spinner" />
              <p>Loading members...</p>
            </div>
          ) : (
            <MemberGrid
              members={members}
              totalCount={totalCount}
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      </ProtectedRoute>
    </ClassroomLayout>
  );
};

export default MembersPage;
