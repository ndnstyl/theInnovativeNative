import React from 'react';
import Link from 'next/link';
import ProgressBar from './ProgressBar';
import type { CourseWithProgress } from '@/types/supabase';

interface CourseCardProps {
  course: CourseWithProgress;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const href = `/classroom/${course.slug || course.id}`;
  const showOpenBadge = !course.is_enrolled && course.is_free;

  return (
    <Link href={href} className="classroom-card" style={{ contentVisibility: 'auto' }}>
      <div className="classroom-card__thumbnail">
        {course.thumbnail_url ? (
          <img
            src={course.thumbnail_url}
            alt={course.title}
            loading="lazy"
          />
        ) : (
          <div className="classroom-card__thumbnail-placeholder">
            <i className="fa-solid fa-graduation-cap" />
          </div>
        )}
        {showOpenBadge && (
          <span className="classroom-card__badge classroom-card__badge--open">Open</span>
        )}
      </div>
      <div className="classroom-card__body">
        <h3 className="classroom-card__title">{course.title}</h3>
        {course.description && (
          <p className="classroom-card__description">{course.description}</p>
        )}
        <div className="classroom-card__footer">
          {course.is_enrolled ? (
            <ProgressBar progress={course.progress} size="sm" />
          ) : showOpenBadge ? null : (
            <span className="classroom-card__cta">
              Enroll Now
              <i className="fa-solid fa-arrow-right" />
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
