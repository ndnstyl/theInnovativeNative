import React from 'react';
import Link from 'next/link';
import type { CourseWithModules } from '@/types/supabase';

interface CourseSidebarProps {
  course: CourseWithModules;
  currentLessonSlug: string;
  progress: Record<string, boolean>;
  isEnrolled: boolean;
  onClose?: () => void;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({
  course,
  currentLessonSlug,
  progress,
  isEnrolled,
  onClose,
}) => {
  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedLessons = course.modules.reduce(
    (sum, m) => sum + m.lessons.filter((l) => progress[l.id]).length,
    0
  );
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <aside className="classroom-sidebar">
      <div className="classroom-sidebar__header">
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

      <div className="classroom-sidebar__course-info">
        <h2 className="classroom-sidebar__title">{course.title}</h2>
        {isEnrolled && (
          <div className="classroom-sidebar__progress">
            <div className="classroom-sidebar__progress-track">
              <div
                className="classroom-sidebar__progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="classroom-sidebar__progress-text">
              {completedLessons}/{totalLessons} lessons
            </span>
          </div>
        )}
      </div>

      <nav className="classroom-sidebar__nav">
        {course.modules.map((module) => (
          <div key={module.id} className="classroom-sidebar__module">
            <h4 className="classroom-sidebar__module-title">{module.title}</h4>
            <ul className="classroom-sidebar__lessons">
              {module.lessons.map((lesson) => {
                const isActive = lesson.slug === currentLessonSlug;
                const isCompleted = progress[lesson.id] === true;
                const isLocked = !isEnrolled && !lesson.is_free_preview;

                return (
                  <li key={lesson.id} className="classroom-sidebar__lesson-item">
                    {isLocked ? (
                      <span className="classroom-sidebar__lesson classroom-sidebar__lesson--locked">
                        <span className="classroom-sidebar__lesson-icon">
                          <i className="fa-solid fa-lock"></i>
                        </span>
                        <span className="classroom-sidebar__lesson-title">{lesson.title}</span>
                      </span>
                    ) : (
                      <Link
                        href={`/classroom/${course.slug}/${lesson.slug}`}
                        className={`classroom-sidebar__lesson ${isActive ? 'classroom-sidebar__lesson--active' : ''}`}
                        onClick={onClose}
                      >
                        <span className="classroom-sidebar__lesson-icon">
                          {isCompleted ? (
                            <i className="fa-solid fa-circle-check"></i>
                          ) : isActive ? (
                            <i className="fa-solid fa-circle-play"></i>
                          ) : (
                            <i className="fa-regular fa-circle"></i>
                          )}
                        </span>
                        <span className="classroom-sidebar__lesson-title">{lesson.title}</span>
                        {lesson.is_free_preview && !isEnrolled && (
                          <span className="classroom-sidebar__preview-badge">Preview</span>
                        )}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default CourseSidebar;
