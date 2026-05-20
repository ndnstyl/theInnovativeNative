import React from 'react';
import CourseCard from './CourseCard';
import type { CourseWithProgress } from '@/types/supabase';

interface CourseGridProps {
  courses: CourseWithProgress[];
  loading?: boolean;
}

/** Skeleton placeholder shown while course data loads */
function SkeletonCard() {
  return (
    <div className="classroom-card classroom-card--skeleton" aria-hidden="true">
      <div className="classroom-card__thumbnail">
        <div className="classroom-card__thumbnail-placeholder classroom-skeleton-pulse" />
      </div>
      <div className="classroom-card__body">
        <div className="classroom-skeleton-line classroom-skeleton-line--title classroom-skeleton-pulse" />
        <div className="classroom-skeleton-line classroom-skeleton-line--desc classroom-skeleton-pulse" />
        <div className="classroom-skeleton-line classroom-skeleton-line--desc classroom-skeleton-line--short classroom-skeleton-pulse" />
        <div className="classroom-card__footer">
          <div className="classroom-skeleton-line classroom-skeleton-line--bar classroom-skeleton-pulse" />
        </div>
      </div>
    </div>
  );
}

const SKELETON_COUNT = 6;

const CourseGrid: React.FC<CourseGridProps> = ({ courses, loading = false }) => {
  if (loading) {
    return (
      <div className="classroom-grid">
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <SkeletonCard key={`skel-${i}`} />
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="classroom-empty">
        <i className="fa-solid fa-book-open" />
        <h3>No courses yet</h3>
        <p>Check back soon for new content.</p>
      </div>
    );
  }

  return (
    <div className="classroom-grid">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};

export default CourseGrid;
