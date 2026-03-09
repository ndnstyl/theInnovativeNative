import React from 'react';
import ClassroomLayout from '@/components/layout/ClassroomLayout';
import CourseGrid from '@/components/classroom/CourseGrid';
import { useCourses } from '@/hooks/useCourses';

const ClassroomPage: React.FC = () => {
  const { courses, loading, error } = useCourses();

  return (
    <ClassroomLayout title="My Courses">
      <div className="classroom-dashboard">
        <div className="classroom-dashboard__header">
          <h1>Classroom</h1>
          <p>Your courses and learning progress</p>
        </div>

        {loading ? (
          <div className="classroom-dashboard__loading">
            <div className="classroom-loading__spinner" />
            <p>Loading courses...</p>
          </div>
        ) : error ? (
          <div className="classroom-dashboard__error">
            <i className="fa-solid fa-exclamation-triangle"></i>
            <p>{error}</p>
          </div>
        ) : (
          <CourseGrid courses={courses} />
        )}
      </div>
    </ClassroomLayout>
  );
};

export default ClassroomPage;
