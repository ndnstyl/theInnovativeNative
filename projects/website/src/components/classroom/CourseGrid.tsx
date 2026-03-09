import React from 'react';
import CourseCard from './CourseCard';
import type { CourseWithProgress } from '@/types/supabase';

interface CourseGridProps {
  courses: CourseWithProgress[];
}

const CourseGrid: React.FC<CourseGridProps> = ({ courses }) => {
  if (courses.length === 0) {
    return (
      <div className="classroom-empty">
        <i className="fa-solid fa-book-open"></i>
        <h3>No courses available yet</h3>
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
