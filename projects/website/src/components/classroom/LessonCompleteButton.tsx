import React, { useState } from 'react';
import { useMarkComplete } from '@/hooks/useCourses';

interface LessonCompleteButtonProps {
  lessonId: string;
  courseId: string;
  isCompleted: boolean;
  onToggle: () => void;
}

const LessonCompleteButton: React.FC<LessonCompleteButtonProps> = ({
  lessonId,
  courseId,
  isCompleted,
  onToggle,
}) => {
  const { toggleComplete, loading } = useMarkComplete();
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setError(null);
    const success = await toggleComplete(lessonId, courseId, isCompleted);
    if (success) {
      onToggle();
    } else {
      setError('Failed to update lesson progress. Please try again.');
    }
  };

  return (
    <div>
      <button
        className={`classroom-complete-btn ${isCompleted ? 'classroom-complete-btn--completed' : ''}`}
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? (
          <span className="classroom-complete-btn__spinner" />
        ) : isCompleted ? (
          <>
            <i className="fa-solid fa-circle-check"></i>
            <span>Completed</span>
          </>
        ) : (
          <>
            <i className="fa-regular fa-circle"></i>
            <span>Mark as Complete</span>
          </>
        )}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {error || ''}
      </span>
    </div>
  );
};

export default LessonCompleteButton;
