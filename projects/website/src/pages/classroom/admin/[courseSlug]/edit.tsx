import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ClassroomLayout from '@/components/layout/ClassroomLayout';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import CourseSettingsPanel from '@/components/classroom/CourseSettingsPanel';
import CourseAnalyticsDashboard from '@/components/classroom/CourseAnalyticsDashboard';
import { useAdminCourses } from '@/hooks/useAdminCourses';
import { useAuth } from '@/contexts/AuthContext';
import type { CourseWithModules, CourseUpdate, ModuleWithLessons } from '@/types/supabase';

const CourseEditPage: React.FC = () => {
  const router = useRouter();
  const { courseSlug } = router.query;
  const { supabaseClient } = useAuth();
  const {
    updateCourse,
    deleteCourse,
    fetchCourseDetail,
    createModule,
    updateModule,
    deleteModule,
    createLesson,
    deleteLesson,
    reorderModules,
  } = useAdminCourses();

  const [course, setCourse] = useState<CourseWithModules | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'settings' | 'analytics'>('content');
  const [communityId, setCommunityId] = useState('');
  const [newModuleTitle, setNewModuleTitle] = useState('');

  const loadCourse = useCallback(async () => {
    if (!courseSlug) return;
    setLoading(true);

    // Get course by ID (slug column was removed from schema)
    const { data: courseData } = await supabaseClient
      .from('courses')
      .select('id, community_id')
      .eq('id', courseSlug as string)
      .single();

    if (!courseData) {
      setLoading(false);
      return;
    }

    setCommunityId(courseData.community_id);
    const detail = await fetchCourseDetail(courseData.id);
    setCourse(detail);
    setLoading(false);
  }, [courseSlug, supabaseClient, fetchCourseDetail]);

  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

  const handleSaveSettings = async (updates: CourseUpdate) => {
    if (!course) return false;
    setSaving(true);
    const ok = await updateCourse(course.id, updates as CourseUpdate);
    setSaving(false);
    if (ok) await loadCourse();
    return ok;
  };

  const handleDeleteCourse = async () => {
    if (!course) return false;
    const ok = await deleteCourse(course.id);
    if (ok) router.push('/classroom/admin');
    return ok;
  };

  const handleAddModule = async () => {
    if (!course || !newModuleTitle.trim()) return;
    const maxOrder = course.modules.length;
    await createModule({
      course_id: course.id,
      title: newModuleTitle.trim(),
      display_order: maxOrder,
    });
    setNewModuleTitle('');
    await loadCourse();
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Delete this module and all its lessons?')) return;
    await deleteModule(moduleId);
    await loadCourse();
  };

  const handleAddLesson = async (moduleId: string) => {
    if (!course) return;
    const mod = course.modules.find((m) => m.id === moduleId);
    const lessonCount = mod?.lessons.length ?? 0;
    await createLesson({
      module_id: moduleId,
      course_id: course.id,
      title: 'New Lesson',
      display_order: lessonCount,
    });
    await loadCourse();
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Delete this lesson?')) return;
    await deleteLesson(lessonId);
    await loadCourse();
  };

  if (loading) {
    return (
      <ClassroomLayout title="Edit Course">
        <ProtectedRoute requiredRole={['owner', 'admin']}>
          <div className="classroom-dashboard__loading">
            <div className="classroom-loading__spinner" />
            <p>Loading course...</p>
          </div>
        </ProtectedRoute>
      </ClassroomLayout>
    );
  }

  if (!course) {
    return (
      <ClassroomLayout title="Course Not Found">
        <ProtectedRoute requiredRole={['owner', 'admin']}>
          <div className="classroom-dashboard__error">
            <i className="fa-solid fa-exclamation-triangle"></i>
            <p>Course not found</p>
          </div>
        </ProtectedRoute>
      </ClassroomLayout>
    );
  }

  return (
    <ClassroomLayout title={`Edit: ${course.title}`}>
      <ProtectedRoute requiredRole={['owner', 'admin']}>
        <div className="classroom-admin-edit">
          <div className="classroom-admin-edit__header">
            <Link href="/classroom/admin" className="classroom-admin-edit__back">
              <i className="fa-solid fa-arrow-left"></i>
              All Courses
            </Link>
            <h1>{course.title}</h1>
            <span className={`classroom-admin-card__status ${course.published ? 'classroom-admin-card__status--published' : ''}`}>
              {course.published ? 'Published' : 'Draft'}
            </span>
          </div>

          <div className="classroom-admin-edit__tabs">
            <button
              className={`classroom-admin-edit__tab ${activeTab === 'content' ? 'active' : ''}`}
              onClick={() => setActiveTab('content')}
            >
              <i className="fa-solid fa-list"></i>
              Content
            </button>
            <button
              className={`classroom-admin-edit__tab ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <i className="fa-solid fa-gear"></i>
              Settings
            </button>
            <button
              className={`classroom-admin-edit__tab ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <i className="fa-solid fa-chart-line"></i>
              Analytics
            </button>
          </div>

          <div className="classroom-admin-edit__body">
            {activeTab === 'content' && (
              <div className="classroom-admin-edit__content">
                {course.modules.map((mod) => (
                  <div key={mod.id} className="classroom-admin-edit__module">
                    <div className="classroom-admin-edit__module-header">
                      <h3>{mod.title}</h3>
                      <div className="classroom-admin-edit__module-actions">
                        <button
                          type="button"
                          className="classroom-admin-edit__btn-sm"
                          onClick={() => handleAddLesson(mod.id)}
                        >
                          <i className="fa-solid fa-plus"></i> Lesson
                        </button>
                        <button
                          type="button"
                          className="classroom-admin-edit__btn-sm classroom-admin-edit__btn-sm--danger"
                          onClick={() => handleDeleteModule(mod.id)}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    <ul className="classroom-admin-edit__lessons">
                      {mod.lessons.map((lesson) => (
                        <li key={lesson.id} className="classroom-admin-edit__lesson-row">
                          <Link
                            href={`/classroom/admin/${courseSlug}/lessons/${lesson.id}`}
                            className="classroom-admin-edit__lesson-link"
                          >
                            <i className="fa-solid fa-file-lines"></i>
                            <span>{lesson.title}</span>
                          </Link>
                          <button
                            type="button"
                            className="classroom-admin-edit__btn-sm classroom-admin-edit__btn-sm--danger"
                            onClick={() => handleDeleteLesson(lesson.id)}
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </li>
                      ))}
                      {mod.lessons.length === 0 && (
                        <li className="classroom-admin-edit__empty-mod">No lessons yet</li>
                      )}
                    </ul>
                  </div>
                ))}

                <div className="classroom-admin-edit__add-module">
                  <input
                    type="text"
                    value={newModuleTitle}
                    onChange={(e) => setNewModuleTitle(e.target.value)}
                    placeholder="New module title"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddModule()}
                  />
                  <button
                    type="button"
                    onClick={handleAddModule}
                    disabled={!newModuleTitle.trim()}
                  >
                    <i className="fa-solid fa-plus"></i> Add Module
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <CourseSettingsPanel
                course={course}
                communityId={communityId}
                onSave={(data) => handleSaveSettings(data as CourseUpdate)}
                onDelete={handleDeleteCourse}
                saving={saving}
              />
            )}

            {activeTab === 'analytics' && (
              <CourseAnalyticsDashboard
                courseId={course.id}
                courseTitle={course.title}
              />
            )}
          </div>
        </div>
      </ProtectedRoute>
    </ClassroomLayout>
  );
};

export default CourseEditPage;
