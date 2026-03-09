import React from 'react';
import Head from 'next/head';
import ClassroomLayout from '@/components/layout/ClassroomLayout';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import FeedPage from '@/components/community/feed/FeedPage';

const CommunityPage = () => {
  return (
    <ClassroomLayout title="Community">
      <ProtectedRoute>
        <Head>
          <title>Community | The Innovative Native</title>
        </Head>
        <FeedPage />
      </ProtectedRoute>
    </ClassroomLayout>
  );
};

export default CommunityPage;
