import React from 'react';
import Link from 'next/link';
import ProgressBar from './ProgressBar';
import type { CourseWithModules } from '@/types/supabase';

interface CourseOverviewProps {
  course: CourseWithModules;
  isEnrolled: boolean;
  progress: Record<string, boolean>;
  onEnroll?: () => void;
}

/**
 * Course landing/overview page — shows modules, lesson count, and enrollment CTA.
 */
const CourseOverview: React.FC<CourseOverviewProps> = ({
  course,
  isEnrolled,
  progress,
  onEnroll,
}) => {
  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedLessons = course.modules.reduce(
    (sum, m) => sum + m.lessons.filter((l) => progress[l.id]).length,
    0
  );
  const progressPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Find the first incomplete or first lesson to resume
  let resumeSlug: string | null = null;
  for (const mod of course.modules) {
    for (const lesson of mod.lessons) {
      if (!progress[lesson.id]) {
        resumeSlug = lesson.slug;
        break;
      }
    }
    if (resumeSlug) break;
  }
  if (!resumeSlug && course.modules[0]?.lessons[0]) {
    resumeSlug = course.modules[0].lessons[0].slug;
  }

  return (
    <div className="classroom-overview">
      <div className="classroom-overview__hero">
        {course.thumbnail_url && (
          <div className="classroom-overview__thumbnail">
            <img src={course.thumbnail_url} alt={course.title} />
          </div>
        )}
        <div className="classroom-overview__info">
          <h1 className="classroom-overview__title">{course.title}</h1>
          {course.description && (
            <p className="classroom-overview__description">{course.description}</p>
          )}
          <div className="classroom-overview__stats">
            <span>
              <i className="fa-solid fa-book"></i>
              {totalLessons} lesson{totalLessons !== 1 ? 's' : ''}
            </span>
            <span>
              <i className="fa-solid fa-layer-group"></i>
              {course.modules.length} module{course.modules.length !== 1 ? 's' : ''}
            </span>
          </div>

          {isEnrolled ? (
            <div className="classroom-overview__enrolled">
              <ProgressBar progress={progressPct} />
              {resumeSlug && (
                <Link
                  href={`/classroom/${course.slug}/${resumeSlug}`}
                  className="classroom-overview__resume-btn"
                >
                  {completedLessons > 0 ? 'Continue Learning' : 'Start Course'}
                  <i className="fa-solid fa-arrow-right"></i>
                </Link>
              )}
            </div>
          ) : (
            <button
              className="classroom-overview__enroll-btn"
              onClick={onEnroll}
            >
              {course.is_free ? 'Start Free Course' : 'Enroll Now'}
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          )}
        </div>
      </div>

      <div className="classroom-overview__curriculum">
        <h2>Curriculum</h2>
        {course.modules.map((mod) => (
          <div key={mod.id} className="classroom-overview__module">
            <h3 className="classroom-overview__module-title">
              {mod.title}
              <span className="classroom-overview__module-count">
                {mod.lessons.length} lesson{mod.lessons.length !== 1 ? 's' : ''}
              </span>
            </h3>
            <ul className="classroom-overview__lessons">
              {mod.lessons.map((lesson) => {
                const isComplete = progress[lesson.id];
                const canAccess = isEnrolled || lesson.is_free_preview;

                return (
                  <li key={lesson.id} className="classroom-overview__lesson-item">
                    {canAccess ? (
                      <Link href={`/classroom/${course.slug}/${lesson.slug}`} className="classroom-overview__lesson">
                        <span className="classroom-overview__lesson-icon">
                          {isComplete ? (
                            <i className="fa-solid fa-circle-check"></i>
                          ) : (
                            <i className="fa-regular fa-circle-play"></i>
                          )}
                        </span>
                        <span>{lesson.title}</span>
                        {lesson.is_free_preview && !isEnrolled && (
                          <span className="classroom-overview__preview-badge">Preview</span>
                        )}
                      </Link>
                    ) : (
                      <span className="classroom-overview__lesson classroom-overview__lesson--locked">
                        <span className="classroom-overview__lesson-icon">
                          <i className="fa-solid fa-lock"></i>
                        </span>
                        <span>{lesson.title}</span>
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseOverview;
