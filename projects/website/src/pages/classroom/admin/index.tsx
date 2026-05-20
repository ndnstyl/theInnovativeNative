import React, { useState } from 'react';
import { useRouter } from 'next/router';
import ClassroomLayout from '@/components/layout/ClassroomLayout';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import AdminCourseCard from '@/components/classroom/AdminCourseCard';
import CourseSettingsPanel from '@/components/classroom/CourseSettingsPanel';
import { useAdminCourses } from '@/hooks/useAdminCourses';
import { useAuth } from '@/contexts/AuthContext';
import type { CourseInsert } from '@/types/supabase';

const AdminCoursesPage: React.FC = () => {
  const router = useRouter();
  const { supabaseClient } = useAuth();
  const { courses, loading, error, createCourse } = useAdminCourses();
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [communityId, setCommunityId] = useState<string | null>(null);

  // Fetch community ID on mount
  React.useEffect(() => {
    async function getCommunity() {
      const { data } = await supabaseClient
        .from('communities')
        .select('id')
        .limit(1)
        .single();
      if (data) setCommunityId(data.id);
    }
    getCommunity();
  }, [supabaseClient]);

  const handleCreate = async (data: CourseInsert) => {
    setSaving(true);
    const course = await createCourse(data as CourseInsert);
    setSaving(false);
    if (course) {
      setShowCreate(false);
      router.push(`/classroom/admin/${course.id}/edit`);
      return true;
    }
    return false;
  };

  return (
    <ClassroomLayout title="Admin: Courses">
      <ProtectedRoute requiredRole={['owner', 'admin']}>
        <ErrorBoundary>
          <div className="classroom-admin-page">
            <div className="classroom-admin-page__header">
              <h1>Course Management</h1>
              <p>Create and manage your courses</p>
            </div>

            {error && (
              <div className="classroom-admin-page__error">
                <i className="fa-solid fa-exclamation-triangle"></i>
                <p>{error}</p>
              </div>
            )}

            {loading ? (
              <div className="classroom-dashboard__loading">
                <div className="classroom-loading__spinner" />
                <p>Loading courses...</p>
              </div>
            ) : (
              <>
                {showCreate && communityId ? (
                  <div className="classroom-admin-page__create">
                    <CourseSettingsPanel
                      communityId={communityId}
                      onSave={(data) => handleCreate(data as CourseInsert)}
                      saving={saving}
                    />
                    <button
                      className="classroom-admin-page__cancel-btn"
                      onClick={() => setShowCreate(false)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="classroom-admin-grid">
                    <AdminCourseCard onCreateNew={() => setShowCreate(true)} />
                    {courses.map((course) => (
                      <AdminCourseCard key={course.id} course={course} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </ErrorBoundary>
      </ProtectedRoute>
    </ClassroomLayout>
  );
};

export default AdminCoursesPage;
