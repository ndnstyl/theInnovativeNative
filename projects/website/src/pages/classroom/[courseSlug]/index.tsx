import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import ClassroomLayout from '@/components/layout/ClassroomLayout';
import CourseSidebar from '@/components/classroom/CourseSidebar';
import LessonContent from '@/components/classroom/LessonContent';
import LessonCompleteButton from '@/components/classroom/LessonCompleteButton';
import EnrollButton from '@/components/classroom/EnrollButton';
import { getValidToken, getStoredUserId } from '@/lib/auth-token';
import type { CourseWithModules, ModuleWithLessons, Lesson } from '@/types/supabase';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

async function supabaseGet<T>(path: string, token: string | null): Promise<T | null> {
  const headers: Record<string, string> = {
    apikey: SUPABASE_ANON_KEY,
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers });
  if (!res.ok) return null;
  return res.json();
}

const CourseIndexPage: React.FC = () => {
  const router = useRouter();
  const { courseSlug } = router.query;

  const [course, setCourse] = useState<CourseWithModules | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchCourseData = useCallback(async () => {
    if (!courseSlug || typeof courseSlug !== 'string') return;

    setLoading(true);
    setError(null);

    const token = getValidToken();
    const userId = getStoredUserId();

    try {
      // Fetch course — support both UUID and slug lookups
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(courseSlug);
      const filter = isUUID
        ? `courses?id=eq.${courseSlug}&published=eq.true&limit=1`
        : `courses?or=(id.eq.${courseSlug},slug.eq.${courseSlug})&published=eq.true&limit=1`;
      const courses = await supabaseGet<any[]>(filter, token);
      if (!courses || courses.length === 0) {
        setError('Course not found');
        setLoading(false);
        return;
      }
      const courseData = courses[0];

      // Fetch modules ordered by display_order
      const modulesData = await supabaseGet<any[]>(
        `modules?course_id=eq.${courseData.id}&order=display_order.asc`,
        token
      );

      // Fetch lessons ordered by display_order
      const lessonsData = await supabaseGet<Lesson[]>(
        `lessons?course_id=eq.${courseData.id}&order=display_order.asc`,
        token
      );

      // Build modules with lessons
      const modules: ModuleWithLessons[] = (modulesData || []).map((mod: any) => ({
        ...mod,
        lessons: (lessonsData || []).filter((l: Lesson) => l.module_id === mod.id),
      }));

      const built: CourseWithModules = { ...courseData, modules };
      setCourse(built);

      // Default to first lesson
      const allLessons = modules.flatMap((m) => m.lessons);
      if (allLessons.length > 0) {
        setSelectedLessonId(allLessons[0].id);
      }

      // Check enrollment + progress
      if (userId && token) {
        if (courseData.is_free) {
          setIsEnrolled(true);
        } else {
          const enrollments = await supabaseGet<any[]>(
            `enrollments?user_id=eq.${userId}&course_id=eq.${courseData.id}&limit=1`,
            token
          );
          setIsEnrolled(!!(enrollments && enrollments.length > 0));
        }

        // Fetch progress
        const allLessonIds = (lessonsData || []).map((l: Lesson) => l.id);
        if (allLessonIds.length > 0) {
          const progressData = await supabaseGet<any[]>(
            `lesson_progress?user_id=eq.${userId}&lesson_id=in.(${allLessonIds.join(',')})&select=lesson_id,completed`,
            token
          );
          if (progressData) {
            const record: Record<string, boolean> = {};
            progressData.forEach((p: any) => { record[p.lesson_id] = p.completed; });
            setProgress(record);
          }
        }
      } else {
        setIsEnrolled(courseData.is_free);
      }
    } catch (err) {
      console.error('[CourseIndexPage] fetch error', err);
      setError('Failed to load course');
    } finally {
      setLoading(false);
    }
  }, [courseSlug]);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  // Find currently selected lesson
  const allLessons = course?.modules.flatMap((m) => m.lessons) || [];
  const currentLesson = allLessons.find((l) => l.id === selectedLessonId);

  // Find next lesson
  const currentIdx = allLessons.findIndex((l) => l.id === selectedLessonId);
  const nextLesson = currentIdx >= 0 && currentIdx < allLessons.length - 1
    ? allLessons[currentIdx + 1]
    : undefined;

  const handleLessonSelect = useCallback(
    (lessonId: string) => {
      setSelectedLessonId(lessonId);
      // Update URL without full page reload
      router.push(`/classroom/${courseSlug}/${lessonId}`, undefined, { shallow: true });
    },
    [courseSlug, router]
  );

  if (loading) {
    return (
      <ClassroomLayout>
        <div className="classroom-dashboard__loading">
          <div className="classroom-loading__spinner" />
          <p>Loading course...</p>
        </div>
      </ClassroomLayout>
    );
  }

  if (error || !course) {
    return (
      <ClassroomLayout>
        <div className="classroom-dashboard__error">
          <i className="fa-solid fa-exclamation-triangle"></i>
          <p>{error || 'Course not found'}</p>
        </div>
      </ClassroomLayout>
    );
  }

  if (allLessons.length === 0) {
    return (
      <ClassroomLayout title={course.title}>
        <div className="classroom-dashboard__loading" style={{ textAlign: 'center', padding: '80px 24px' }}>
          <h2 style={{ color: '#fff', marginBottom: '12px' }}>Course content coming soon</h2>
          <p style={{ color: '#757575' }}>
            This course is being prepared. Check back shortly for lessons and modules.
          </p>
        </div>
      </ClassroomLayout>
    );
  }

  return (
    <ClassroomLayout title={currentLesson ? `${currentLesson.title} | ${course.title}` : course.title}>
      <div className="classroom-lesson-view">
        {/* Mobile sidebar toggle */}
        <button
          className="classroom-sidebar-toggle"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open course navigation"
        >
          <i className="fa-solid fa-bars"></i>
        </button>

        {/* Sidebar */}
        <div className={`classroom-sidebar-wrapper ${sidebarOpen ? 'classroom-sidebar-wrapper--open' : ''}`}>
          {sidebarOpen && (
            <div className="classroom-sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
          )}
          <CourseSidebar
            course={course}
            currentLessonSlug={selectedLessonId || ''}
            progress={progress}
            isEnrolled={isEnrolled}
            onLessonSelect={handleLessonSelect}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        {/* Main content */}
        <div className="classroom-lesson-content">
          {currentLesson && isEnrolled ? (
            <>
              <LessonContent lesson={currentLesson} />

              <div className="classroom-lesson-actions">
                <LessonCompleteButton
                  lessonId={currentLesson.id}
                  courseId={course.id}
                  isCompleted={progress[currentLesson.id] === true}
                  onToggle={fetchCourseData}
                />

                {nextLesson && (
                  <button
                    className="classroom-next-btn"
                    onClick={() => handleLessonSelect(nextLesson.id)}
                  >
                    Next Lesson
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>
                )}
              </div>
            </>
          ) : currentLesson && !isEnrolled ? (
            <EnrollButton course={course} />
          ) : (
            <div className="classroom-lesson__empty">
              <i className="fa-regular fa-file-lines"></i>
              <p>Select a lesson from the sidebar</p>
            </div>
          )}
        </div>
      </div>
    </ClassroomLayout>
  );
};

export default CourseIndexPage;
