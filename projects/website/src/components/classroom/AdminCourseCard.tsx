import React from 'react';
import Link from 'next/link';
import type { Course } from '@/types/supabase';

interface AdminCourseCardProps {
  course?: Course;
  onCreateNew?: () => void;
}

/**
 * Admin course card — shows course info or "+ New Course" placeholder.
 */
const AdminCourseCard: React.FC<AdminCourseCardProps> = ({ course, onCreateNew }) => {
  if (!course) {
    return (
      <button className="classroom-admin-card classroom-admin-card--new" onClick={onCreateNew}>
        <i className="fa-solid fa-plus"></i>
        <span>New Course</span>
      </button>
    );
  }

  return (
    <Link
      href={`/classroom/admin/${course.slug}/edit`}
      className="classroom-admin-card"
    >
      <div className="classroom-admin-card__thumbnail">
        {course.thumbnail_url ? (
          <img src={course.thumbnail_url} alt={course.title} />
        ) : (
          <div className="classroom-admin-card__thumbnail-placeholder">
            <i className="fa-solid fa-graduation-cap"></i>
          </div>
        )}
      </div>
      <div className="classroom-admin-card__body">
        <h3 className="classroom-admin-card__title">{course.title}</h3>
        <div className="classroom-admin-card__meta">
          <span className={`classroom-admin-card__status ${course.is_published ? 'classroom-admin-card__status--published' : ''}`}>
            {course.is_published ? 'Published' : 'Draft'}
          </span>
          {course.is_free && <span className="classroom-admin-card__free">Free</span>}
        </div>
      </div>
    </Link>
  );
};

export default AdminCourseCard;
