import React from 'react';
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

  const handleClick = async () => {
    const success = await toggleComplete(lessonId, courseId, isCompleted);
    if (success) onToggle();
  };

  return (
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
  );
};

export default LessonCompleteButton;
