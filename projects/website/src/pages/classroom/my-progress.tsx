import React from 'react';
import ClassroomLayout from '@/components/layout/ClassroomLayout';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import StudentDashboard from '@/components/classroom/StudentDashboard';

const MyProgressPage: React.FC = () => {
  return (
    <ClassroomLayout title="My Progress">
      <ProtectedRoute>
        <StudentDashboard />
      </ProtectedRoute>
    </ClassroomLayout>
  );
};

export default MyProgressPage;
