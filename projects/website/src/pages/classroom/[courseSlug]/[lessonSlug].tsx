import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import ClassroomLayout from '@/components/layout/ClassroomLayout';
import CourseSidebar from '@/components/classroom/CourseSidebar';
import LessonContent from '@/components/classroom/LessonContent';
import LessonCompleteButton from '@/components/classroom/LessonCompleteButton';
import EnrollButton from '@/components/classroom/EnrollButton';
import { useCourse } from '@/hooks/useCourses';
import type { Lesson } from '@/types/supabase';

const LessonPage: React.FC = () => {
  const router = useRouter();
  const { courseSlug, lessonSlug } = router.query;
  const { course, isEnrolled, progress, loading, error, refetch } = useCourse(
    courseSlug as string
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Find current lesson
  const currentLesson: Lesson | undefined = useMemo(() => {
    if (!course) return undefined;
    for (const mod of course.modules) {
      const found = mod.lessons.find((l) => l.slug === lessonSlug);
      if (found) return found;
    }
    return undefined;
  }, [course, lessonSlug]);

  // Find next lesson for navigation
  const nextLesson: Lesson | undefined = useMemo(() => {
    if (!course || !currentLesson) return undefined;
    const allLessons = course.modules.flatMap((m) => m.lessons);
    const currentIdx = allLessons.findIndex((l) => l.id === currentLesson.id);
    return currentIdx >= 0 && currentIdx < allLessons.length - 1
      ? allLessons[currentIdx + 1]
      : undefined;
  }, [course, currentLesson]);

  // Check if content should be visible
  const canView = isEnrolled || currentLesson?.is_free_preview;

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
            currentLessonSlug={lessonSlug as string}
            progress={progress}
            isEnrolled={isEnrolled}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        {/* Main content */}
        <div className="classroom-lesson-content">
          {canView ? (
            <>
              <LessonContent lesson={currentLesson} />

              <div className="classroom-lesson-actions">
                <LessonCompleteButton
                  lessonId={currentLesson.id}
                  courseId={course.id}
                  isCompleted={progress[currentLesson.id] === true}
                  onToggle={refetch}
                />

                {nextLesson && (isEnrolled || nextLesson.is_free_preview) && (
                  <button
                    className="classroom-next-btn"
                    onClick={() => router.push(`/classroom/${courseSlug}/${nextLesson.slug}`)}
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
