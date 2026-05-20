import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { CourseWithModules, Lesson } from '@/types/supabase';

interface CourseSidebarProps {
  course: CourseWithModules;
  currentLessonSlug: string; // lesson ID
  progress: Record<string, boolean>;
  isEnrolled: boolean;
  onLessonSelect?: (lessonId: string) => void;
  onClose?: () => void;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({
  course,
  currentLessonSlug,
  progress,
  isEnrolled,
  onLessonSelect,
  onClose,
}) => {
  const router = useRouter();
  const navRef = useRef<HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Flatten all lessons for keyboard navigation
  const allLessons: Lesson[] = course.modules.flatMap((m) => m.lessons);

  const totalLessons = allLessons.length;
  const completedLessons = allLessons.filter((l) => progress[l.id]).length;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Find current lesson title for mobile accordion header
  const currentLesson = allLessons.find((l) => l.id === currentLessonSlug);
  const currentIndex = allLessons.findIndex((l) => l.id === currentLessonSlug);

  const selectLesson = useCallback(
    (lessonId: string) => {
      if (onLessonSelect) {
        onLessonSelect(lessonId);
      } else {
        router.push(`/classroom/${course.id}/${lessonId}`, undefined, { shallow: true });
      }
      setMobileOpen(false);
      if (onClose) onClose();
    },
    [onLessonSelect, onClose, router, course.id]
  );

  // Keyboard navigation: Arrow Up/Down between lessons, Enter/Space to select
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (!isEnrolled) return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const direction = e.key === 'ArrowDown' ? 1 : -1;
        const nextIdx = currentIndex + direction;
        if (nextIdx >= 0 && nextIdx < allLessons.length) {
          const nextLesson = allLessons[nextIdx];
          selectLesson(nextLesson.id);
          // Focus the next lesson item
          const nextEl = navRef.current?.querySelector(
            `[data-lesson-id="${nextLesson.id}"]`
          ) as HTMLElement | null;
          nextEl?.focus();
        }
      }

      if (e.key === 'Enter' || e.key === ' ') {
        const target = e.target as HTMLElement;
        const lessonId = target.getAttribute('data-lesson-id');
        if (lessonId) {
          e.preventDefault();
          selectLesson(lessonId);
        }
      }
    },
    [allLessons, currentIndex, isEnrolled, selectLesson]
  );

  // Scroll active lesson into view on mount/change
  useEffect(() => {
    if (!navRef.current) return;
    const activeEl = navRef.current.querySelector('.classroom-sidebar__lesson--active');
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [currentLessonSlug]);

  const lessonList = (
    <nav
      ref={navRef}
      className="classroom-sidebar__nav"
      role="listbox"
      aria-label="Course lessons"
      onKeyDown={handleKeyDown}
    >
      {course.modules.map((module) => (
        <div key={module.id} className="classroom-sidebar__module">
          <h4 className="classroom-sidebar__module-title">{module.title}</h4>
          <ul className="classroom-sidebar__lessons" role="group" aria-label={module.title}>
            {module.lessons.map((lesson) => {
              const isActive = lesson.id === currentLessonSlug;
              const isCompleted = progress[lesson.id] === true;
              const isLocked = !isEnrolled;

              return (
                <li key={lesson.id} className="classroom-sidebar__lesson-item" role="option" aria-selected={isActive}>
                  {isLocked ? (
                    <span className="classroom-sidebar__lesson classroom-sidebar__lesson--locked">
                      <span className="classroom-sidebar__lesson-icon">
                        <i className="fa-solid fa-lock"></i>
                      </span>
                      <span className="classroom-sidebar__lesson-title">{lesson.title}</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      data-lesson-id={lesson.id}
                      className={`classroom-sidebar__lesson ${isActive ? 'classroom-sidebar__lesson--active' : ''}`}
                      onClick={() => selectLesson(lesson.id)}
                      tabIndex={isActive ? 0 : -1}
                      aria-current={isActive ? 'true' : undefined}
                    >
                      <span className="classroom-sidebar__lesson-icon">
                        {isCompleted ? (
                          <i className="fa-solid fa-circle-check"></i>
                        ) : (
                          <i className="fa-regular fa-circle"></i>
                        )}
                      </span>
                      <span className="classroom-sidebar__lesson-title">{lesson.title}</span>
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <aside className="classroom-sidebar" aria-label="Course navigation">
      {/* Desktop header */}
      <div className="classroom-sidebar__header classroom-sidebar__header--desktop">
        <Link href="/classroom" className="classroom-sidebar__back">
          <i className="fa-solid fa-arrow-left"></i>
          <span>All Courses</span>
        </Link>
        {onClose && (
          <button className="classroom-sidebar__close" onClick={onClose} aria-label="Close sidebar">
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}
      </div>

      {/* Mobile accordion header */}
      <div className="classroom-sidebar__mobile-header">
        <button
          className="classroom-sidebar__mobile-toggle"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-expanded={mobileOpen}
          aria-controls="course-sidebar-lessons"
        >
          <div className="classroom-sidebar__mobile-info">
            <span className="classroom-sidebar__mobile-lesson-title">
              {currentLesson?.title || 'Select a lesson'}
            </span>
            <span className="classroom-sidebar__mobile-progress">
              {completedLessons}/{totalLessons} complete
            </span>
          </div>
          <i className={`fa-solid fa-chevron-${mobileOpen ? 'up' : 'down'}`}></i>
        </button>
      </div>

      {/* Course info + progress */}
      <div className="classroom-sidebar__course-info">
        <h2 className="classroom-sidebar__title">{course.title}</h2>
        {isEnrolled && (
          <div className="classroom-sidebar__progress">
            <div className="classroom-sidebar__progress-track">
              <div
                className="classroom-sidebar__progress-fill"
                style={{ width: `${progressPercent}%` }}
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Course progress: ${progressPercent}%`}
              />
            </div>
            <span className="classroom-sidebar__progress-text">
              {completedLessons}/{totalLessons} lessons ({progressPercent}%)
            </span>
          </div>
        )}
      </div>

      {/* Lesson list — mobile: accordion panel */}
      <div
        id="course-sidebar-lessons"
        className={`classroom-sidebar__lessons-panel ${mobileOpen ? 'classroom-sidebar__lessons-panel--open' : ''}`}
      >
        {lessonList}
      </div>
    </aside>
  );
};

export default CourseSidebar;
