import { useState, useEffect, useCallback } from 'react';
import { getValidToken } from '@/lib/auth-token';
import { logger } from '@/lib/logger';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

interface CourseProgress {
  courseId: string;
  totalLessons: number;
  completedLessons: number;
  percentage: number;
  isComplete: boolean;
}

/** Fetch all lesson progress for a user, calculate per-course progress */
export function useCourseProgress(userId: string | null) {
  const [progressMap, setProgressMap] = useState<Record<string, CourseProgress>>({});
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    const token = getValidToken();
    if (!token) { setLoading(false); return; }

    try {
      // Fetch all completed lesson IDs for this user
      const progressRes = await fetch(
        `${SUPABASE_URL}/rest/v1/lesson_progress?user_id=eq.${userId}&completed=eq.true&select=lesson_id`,
        { headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${token}` } }
      );
      const completedRows: { lesson_id: string }[] = progressRes.ok ? await progressRes.json() : [];
      const completedSet = new Set(completedRows.map(r => r.lesson_id));

      // Fetch enrolled courses with lessons
      const enrollRes = await fetch(
        `${SUPABASE_URL}/rest/v1/enrollments?user_id=eq.${userId}&status=eq.active&select=course_id,courses(id,modules(lessons(id)))`,
        { headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${token}` } }
      );
      const enrollments: { course_id: string; courses: { id: string; modules: { lessons: { id: string }[] }[] } }[] =
        enrollRes.ok ? await enrollRes.json() : [];

      const map: Record<string, CourseProgress> = {};
      for (const enrollment of enrollments) {
        const course = enrollment.courses;
        if (!course) continue;
        const allLessonIds: string[] = [];
        for (const mod of course.modules || []) {
          for (const lesson of mod.lessons || []) {
            allLessonIds.push(lesson.id);
          }
        }
        const total = allLessonIds.length;
        const completed = allLessonIds.filter(id => completedSet.has(id)).length;
        const percentage = total > 0 ? Math.floor((completed / total) * 100) : 0;

        map[course.id] = {
          courseId: course.id,
          totalLessons: total,
          completedLessons: completed,
          percentage,
          isComplete: total > 0 && completed >= total,
        };
      }
      setProgressMap(map);
    } catch (err) {
      logger.error('useCourseProgress', 'fetchProgress', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchProgress(); }, [fetchProgress]);

  return { progressMap, loading, refetch: fetchProgress };
}

/** Calculate progress for a single course given lesson IDs and completed set */
export function calculateProgress(lessonIds: string[], completedSet: Set<string>): CourseProgress {
  const total = lessonIds.length;
  const completed = lessonIds.filter(id => completedSet.has(id)).length;
  const percentage = total > 0 ? Math.floor((completed / total) * 100) : 0;
  return {
    courseId: '',
    totalLessons: total,
    completedLessons: completed,
    percentage,
    isComplete: total > 0 && completed >= total,
  };
}
