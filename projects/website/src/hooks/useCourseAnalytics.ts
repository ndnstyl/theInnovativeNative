import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { CourseAnalyticsCache } from '@/types/supabase';

export interface StudentEngagement {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  enrolled_at: string;
  completed_lessons: number;
  total_lessons: number;
  progress_pct: number;
  last_active: string | null;
}

/**
 * Fetch analytics cache + per-student engagement data for admin dashboards.
 */
export function useCourseAnalytics(courseId: string | undefined) {
  const { supabaseClient } = useAuth();
  const [analytics, setAnalytics] = useState<CourseAnalyticsCache | null>(null);
  const [students, setStudents] = useState<StudentEngagement[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      // Fetch analytics cache
      const { data: cacheData } = await supabaseClient
        .from('course_analytics_cache')
        .select('*')
        .eq('course_id', courseId)
        .order('computed_at', { ascending: false })
        .limit(1)
        .single();

      setAnalytics(cacheData ?? null);

      // Fetch enrolled students with progress
      const { data: enrollments } = await supabaseClient
        .from('enrollments')
        .select('user_id, enrolled_at')
        .eq('course_id', courseId);

      if (!enrollments || enrollments.length === 0) {
        setStudents([]);
        return;
      }

      // Fetch total lessons in course
      const { data: lessons } = await supabaseClient
        .from('lessons')
        .select('id')
        .eq('course_id', courseId);

      const totalLessons = lessons?.length ?? 0;

      // Fetch profiles for enrolled users
      const userIds = enrollments.map((e) => e.user_id);
      const { data: profiles } = await supabaseClient
        .from('profiles')
        .select('id, display_name, avatar_url, last_active_at')
        .in('id', userIds);

      const profileMap = new Map(
        (profiles ?? []).map((p) => [p.id, p])
      );

      // Fetch progress per student
      const { data: progressData } = await supabaseClient
        .from('lesson_progress')
        .select('user_id, lesson_id')
        .eq('course_id', courseId)
        .eq('completed', true);

      const progressByUser = new Map<string, number>();
      (progressData ?? []).forEach((p) => {
        progressByUser.set(p.user_id, (progressByUser.get(p.user_id) ?? 0) + 1);
      });

      const studentList: StudentEngagement[] = enrollments.map((e) => {
        const profile = profileMap.get(e.user_id);
        const completed = progressByUser.get(e.user_id) ?? 0;
        return {
          user_id: e.user_id,
          display_name: profile?.display_name ?? 'Unknown',
          avatar_url: profile?.avatar_url ?? null,
          enrolled_at: e.enrolled_at,
          completed_lessons: completed,
          total_lessons: totalLessons,
          progress_pct: totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0,
          last_active: profile?.last_active_at ?? null,
        };
      });

      setStudents(studentList.sort((a, b) => b.progress_pct - a.progress_pct));
    } catch (err) {
      console.error('Error fetching course analytics:', err);
    } finally {
      setLoading(false);
    }
  }, [supabaseClient, courseId]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { analytics, students, loading, refetch: fetchAnalytics };
}
