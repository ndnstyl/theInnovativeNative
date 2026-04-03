import React, { useState, useCallback, useEffect, useMemo } from 'react';
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

const LessonPage: React.FC = () => {
  const router = useRouter();
  const { courseSlug, lessonSlug } = router.query;

  const [course, setCourse] = useState<CourseWithModules | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
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
      // Fetch course
      const courses = await supabaseGet<any[]>(
        `courses?id=eq.${courseSlug}&published=eq.true&limit=1`,
        token
      );
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

      // Set active lesson from URL or default to first
      const allLessons = modules.flatMap((m) => m.lessons);
      if (lessonSlug && allLessons.some((l) => l.id === lessonSlug)) {
        setActiveLessonId(lessonSlug as string);
      } else if (allLessons.length > 0) {
        setActiveLessonId(allLessons[0].id);
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
      console.error('[LessonPage] fetch error', err);
      setError('Failed to load course');
    } finally {
      setLoading(false);
    }
  }, [courseSlug, lessonSlug]);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  // Sync activeLessonId when URL changes (e.g. browser back/forward)
  useEffect(() => {
    if (lessonSlug && typeof lessonSlug === 'string' && activeLessonId !== lessonSlug) {
      setActiveLessonId(lessonSlug);
    }
  }, [lessonSlug]);

  // All lessons flat list
  const allLessons = useMemo(
    () => course?.modules.flatMap((m) => m.lessons) || [],
    [course]
  );

  // Current lesson
  const currentLesson: Lesson | undefined = useMemo(
    () => allLessons.find((l) => l.id === activeLessonId),
    [allLessons, activeLessonId]
  );

  // Next lesson
  const nextLesson: Lesson | undefined = useMemo(() => {
    const idx = allLessons.findIndex((l) => l.id === activeLessonId);
    return idx >= 0 && idx < allLessons.length - 1 ? allLessons[idx + 1] : undefined;
  }, [allLessons, activeLessonId]);

  const handleLessonSelect = useCallback(
    (lessonId: string) => {
      setActiveLessonId(lessonId);
      // Update URL without full page reload (shallow)
      router.push(`/classroom/${courseSlug}/${lessonId}`, undefined, { shallow: true });
      setSidebarOpen(false);
    },
    [courseSlug, router]
  );

  if (loading) {
    return (
      <ClassroomLayout>
        <div className="classroom-dashboard__loading">
          <div className="classroom-loading__spinner" />
          <p>Loading lesson...</p>
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

  if (!currentLesson) {
    return (
      <ClassroomLayout title={course.title}>
        <div className="classroom-dashboard__error">
          <i className="fa-solid fa-exclamation-triangle"></i>
          <p>Lesson not found</p>
        </div>
      </ClassroomLayout>
    );
  }

  return (
    <ClassroomLayout title={`${currentLesson.title} | ${course.title}`}>
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
            currentLessonSlug={activeLessonId || ''}
            progress={progress}
            isEnrolled={isEnrolled}
            onLessonSelect={handleLessonSelect}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        {/* Main content */}
        <div className="classroom-lesson-content">
          {isEnrolled ? (
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
          ) : (
            <EnrollButton course={course} />
          )}
        </div>
      </div>
    </ClassroomLayout>
  );
};

export default LessonPage;
