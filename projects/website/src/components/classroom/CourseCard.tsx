import React from 'react';
import Link from 'next/link';
import ProgressBar from './ProgressBar';
import type { CourseWithProgress } from '@/types/supabase';

interface CourseCardProps {
  course: CourseWithProgress;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Link href={`/classroom/${course.id}`} className="classroom-card">
      <div className="classroom-card__thumbnail">
        {course.thumbnail_url ? (
          <img src={course.thumbnail_url} alt={course.title} />
        ) : (
          <div className="classroom-card__thumbnail-placeholder">
            <i className="fa-solid fa-graduation-cap"></i>
          </div>
        )}
        {course.is_free && <span className="classroom-card__badge">Free</span>}
      </div>
      <div className="classroom-card__body">
        <h3 className="classroom-card__title">{course.title}</h3>
        {course.description && (
          <p className="classroom-card__description">{course.description}</p>
        )}
        <div className="classroom-card__footer">
          {course.is_enrolled ? (
            <ProgressBar progress={course.progress} size="sm" />
          ) : (
            <span className="classroom-card__cta">
              {course.is_free ? 'Start Course' : 'Enroll Now'}
              <i className="fa-solid fa-arrow-right"></i>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
