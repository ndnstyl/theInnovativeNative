import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ClassroomLayout from '@/components/layout/ClassroomLayout';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import LessonEditor from '@/components/classroom/LessonEditor';
import AttachmentList from '@/components/classroom/AttachmentList';
import { useAdminCourses } from '@/hooks/useAdminCourses';
import { useAuth } from '@/contexts/AuthContext';
import type { Lesson, LessonUpdate } from '@/types/supabase';

const LessonEditorPage: React.FC = () => {
  const router = useRouter();
  const { courseSlug, lessonSlug } = router.query;
  const { supabaseClient } = useAuth();
  const { updateLesson } = useAdminCourses();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [courseId, setCourseId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLesson = useCallback(async () => {
    if (!courseSlug || !lessonSlug) return;
    setLoading(true);
    setError(null);

    try {
      // Get course by ID (slug column was removed from schema)
      const { data: courseData } = await supabaseClient
        .from('courses')
        .select('id')
        .eq('id', courseSlug as string)
        .single();

      if (!courseData) return;
      setCourseId(courseData.id);

      // Get lesson by ID (slug column was removed from schema)
      const { data: lessonData } = await supabaseClient
        .from('lessons')
        .select('*')
        .eq('course_id', courseData.id)
        .eq('id', lessonSlug as string)
        .single();

      setLesson(lessonData);
    } catch {
      setError('Failed to load lesson');
    } finally {
      setLoading(false);
    }
  }, [courseSlug, lessonSlug, supabaseClient]);

  useEffect(() => {
    loadLesson();
  }, [loadLesson]);

  const handleSave = async (lessonId: string, updates: LessonUpdate): Promise<boolean> => {
    const ok = await updateLesson(lessonId, updates);
    if (ok) {
      // Refresh lesson data
      const { data } = await supabaseClient
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();
      if (data) setLesson(data);
    }
    return ok;
  };

  if (loading) {
    return (
      <ClassroomLayout title="Edit Lesson">
        <ProtectedRoute requiredRole={['owner', 'admin']}>
          <div className="classroom-dashboard__loading">
            <div className="classroom-loading__spinner" />
            <p>Loading lesson...</p>
          </div>
        </ProtectedRoute>
      </ClassroomLayout>
    );
  }

  if (!lesson) {
    return (
      <ClassroomLayout title="Lesson Not Found">
        <ProtectedRoute requiredRole={['owner', 'admin']}>
          <div className="classroom-dashboard__error">
            <i className="fa-solid fa-exclamation-triangle"></i>
            <p>Lesson not found</p>
          </div>
        </ProtectedRoute>
      </ClassroomLayout>
    );
  }

  return (
    <ClassroomLayout title={`Edit: ${lesson.title}`}>
      <ProtectedRoute requiredRole={['owner', 'admin']}>
        <div className="classroom-admin-lesson">
          <div className="classroom-admin-lesson__header">
            <Link
              href={`/classroom/admin/${courseSlug}/edit`}
              className="classroom-admin-edit__back"
            >
              <i className="fa-solid fa-arrow-left"></i>
              Back to Course
            </Link>
          </div>

          <LessonEditor lesson={lesson} onSave={handleSave} />

          <div className="classroom-admin-lesson__attachments">
            <AttachmentList lessonId={lesson.id} courseId={courseId} isAdmin />
          </div>
        </div>
      </ProtectedRoute>
    </ClassroomLayout>
  );
};

export default LessonEditorPage;
