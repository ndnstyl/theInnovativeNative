import React from 'react';
import Head from 'next/head';
import ClassroomLayout from '@/components/layout/ClassroomLayout';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import CategoryManager from '@/components/community/feed/CategoryManager';

const AdminCategoriesPage = () => {
  return (
    <ClassroomLayout title="Manage Categories">
      <ProtectedRoute requiredRole={['owner', 'admin']}>
        <Head>
          <title>Manage Categories | The Innovative Native</title>
        </Head>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px' }}>
          <CategoryManager />
        </div>
      </ProtectedRoute>
    </ClassroomLayout>
  );
};

export default AdminCategoriesPage;
