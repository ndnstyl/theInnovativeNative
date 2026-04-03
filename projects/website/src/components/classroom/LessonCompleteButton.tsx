import React, { useCallback, useState } from 'react';
import { getValidToken, getStoredUserId } from '@/lib/auth-token';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

interface LessonCompleteButtonProps {
  lessonId: string;
  courseId: string;
  isCompleted: boolean;
  onToggle: () => void;
}

/**
 * Toggle lesson completion via direct REST calls.
 * POST /lesson_progress (upsert) to mark complete.
 * PATCH /lesson_progress to mark incomplete.
 * 44px minimum touch target. ARIA-compliant toggle button.
 */
const LessonCompleteButton: React.FC<LessonCompleteButtonProps> = ({
  lessonId,
  courseId,
  isCompleted,
  onToggle,
}) => {
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(async () => {
    const token = getValidToken();
    const userId = getStoredUserId();
    if (!token || !userId) return;

    setLoading(true);
    try {
      if (isCompleted) {
        // Mark incomplete: PATCH existing row
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/lesson_progress?lesson_id=eq.${lessonId}&user_id=eq.${userId}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${token}`,
              Prefer: 'return=minimal',
            },
            body: JSON.stringify({
              completed: false,
              completed_at: null,
            }),
          }
        );
        if (!res.ok) throw new Error(`PATCH failed: ${res.status}`);
      } else {
        // Mark complete: POST with upsert
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/lesson_progress`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${token}`,
              Prefer: 'resolution=merge-duplicates,return=minimal',
            },
            body: JSON.stringify({
              user_id: userId,
              lesson_id: lessonId,
              completed: true,
              completed_at: new Date().toISOString(),
            }),
          }
        );
        if (!res.ok) throw new Error(`POST failed: ${res.status}`);
      }
      onToggle();
    } catch (err) {
      console.error('[LessonCompleteButton]', err);
    } finally {
      setLoading(false);
    }
  }, [isCompleted, lessonId, onToggle]);

  return (
    <button
      className={`classroom-complete-btn ${isCompleted ? 'classroom-complete-btn--completed' : ''}`}
      onClick={handleClick}
      disabled={loading}
      aria-pressed={isCompleted}
      aria-label={isCompleted ? 'Mark lesson as incomplete' : 'Mark lesson as complete'}
      style={{ minHeight: 44, minWidth: 44 }}
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
