import React from 'react';
import { useEnroll } from '@/hooks/useCourses';
import type { Course } from '@/types/supabase';

interface EnrollButtonProps {
  course: Course;
}

const EnrollButton: React.FC<EnrollButtonProps> = ({ course }) => {
  const { enroll, loading } = useEnroll();

  if (course.is_free) return null;

  return (
    <div className="classroom-enroll">
      <div className="classroom-enroll__overlay">
        <div className="classroom-enroll__content">
          <i className="fa-solid fa-lock"></i>
          <h3>Enroll to Access This Course</h3>
          <p>{course.description}</p>
          <button
            className="classroom-enroll__btn"
            onClick={() => enroll(course)}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="classroom-enroll__spinner" />
                Redirecting to checkout...
              </>
            ) : (
              <>
                Enroll Now
                <i className="fa-solid fa-arrow-right"></i>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnrollButton;
