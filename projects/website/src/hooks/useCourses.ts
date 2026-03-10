import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type {
  Course,
  CourseWithModules,
  CourseWithProgress,
  ModuleWithLessons,
} from '@/types/supabase';

// ============================================
// useCourses — fetch all published courses with enrollment/progress
// ============================================
export function useCourses() {
  const { supabaseClient, session } = useAuth();
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      setError(null);

      try {
        // Fetch published courses
        const { data: coursesData, error: coursesError } = await supabaseClient
          .from('courses')
          .select('*')
          .eq('published', true)
          .order('display_order', { ascending: true });

        if (coursesError) throw coursesError;
        if (!coursesData) {
          setCourses([]);
          return;
        }

        // If user is logged in, fetch enrollments and progress
        let enrolledCourseIds: string[] = [];
        const progressMap: Record<string, { total: number; completed: number }> = {};

        if (session?.user) {
          const { data: enrollments } = await supabaseClient
            .from('enrollments')
            .select('course_id')
            .eq('user_id', session.user.id);

          if (enrollments) {
            enrolledCourseIds = enrollments.map((e) => e.course_id);
          }

          // Fetch lesson counts and progress for enrolled courses
          for (const courseId of enrolledCourseIds) {
            const { data: lessons } = await supabaseClient
              .from('lessons')
              .select('id')
              .eq('course_id', courseId);

            const lessonIds = (lessons || []).map((l) => l.id);
            let completedCount = 0;
            if (lessonIds.length > 0) {
              const { data: progress } = await supabaseClient
                .from('lesson_progress')
                .select('id')
                .in('lesson_id', lessonIds)
                .eq('user_id', session.user.id)
                .eq('completed', true);
              completedCount = progress?.length ?? 0;
            }

            progressMap[courseId] = {
              total: lessons?.length ?? 0,
              completed: completedCount,
            };
          }

          // Also count lessons for free courses
          for (const course of coursesData) {
            if (course.is_free && !progressMap[course.id]) {
              const { data: lessons } = await supabaseClient
                .from('lessons')
                .select('id')
                .eq('course_id', course.id);

              const lessonIds = (lessons || []).map((l) => l.id);
              let completedCount = 0;
              if (lessonIds.length > 0) {
                const { data: progress } = await supabaseClient
                  .from('lesson_progress')
                  .select('id')
                  .in('lesson_id', lessonIds)
                  .eq('user_id', session.user.id)
                  .eq('completed', true);
                completedCount = progress?.length ?? 0;
              }

              progressMap[course.id] = {
                total: lessons?.length ?? 0,
                completed: completedCount,
              };
            }
          }
        }

        const enrichedCourses: CourseWithProgress[] = coursesData.map((course) => {
          const prog = progressMap[course.id];
          const totalLessons = prog?.total ?? 0;
          const completedLessons = prog?.completed ?? 0;
          return {
            ...course,
            is_enrolled: enrolledCourseIds.indexOf(course.id) >= 0 || course.is_free,
            progress: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
            total_lessons: totalLessons,
            completed_lessons: completedLessons,
          };
        });

        setCourses(enrichedCourses);
      } catch {
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, [supabaseClient, session?.user?.id]);

  return { courses, loading, error };
}

// ============================================
// useCourse — fetch single course with modules, lessons, progress
// ============================================
export function useCourse(slug: string | undefined) {
  const { supabaseClient, session } = useAuth();
  const [course, setCourse] = useState<CourseWithModules | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourse = useCallback(async () => {
    if (!slug) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch course by id (slug column removed from schema)
      const { data: courseData, error: courseError } = await supabaseClient
        .from('courses')
        .select('*')
        .eq('id', slug)
        .eq('published', true)
        .single();

      if (courseError) throw courseError;
      if (!courseData) {
        setError('Course not found');
        return;
      }

      // Fetch modules
      const { data: modulesData } = await supabaseClient
        .from('modules')
        .select('*')
        .eq('course_id', courseData.id)
        .order('display_order', { ascending: true });

      // Fetch lessons
      const { data: lessonsData } = await supabaseClient
        .from('lessons')
        .select('*')
        .eq('course_id', courseData.id)
        .order('display_order', { ascending: true });

      // Build modules with lessons
      const modules: ModuleWithLessons[] = (modulesData || []).map((mod) => ({
        ...mod,
        lessons: (lessonsData || []).filter((l) => l.module_id === mod.id),
      }));

      setCourse({ ...courseData, modules });

      // Check enrollment
      if (session?.user) {
        if (courseData.is_free) {
          setIsEnrolled(true);
        } else {
          const { data: enrollment } = await supabaseClient
            .from('enrollments')
            .select('id')
            .eq('user_id', session.user.id)
            .eq('course_id', courseData.id)
            .single();

          setIsEnrolled(!!enrollment);
        }

        // Fetch progress (lesson_progress has no course_id; query via lesson IDs)
        const allLessonIds = (lessonsData || []).map((l) => l.id);
        const { data: progressData } = allLessonIds.length > 0
          ? await supabaseClient
              .from('lesson_progress')
              .select('lesson_id, completed')
              .eq('user_id', session.user.id)
              .in('lesson_id', allLessonIds)
          : { data: [] as any[] };

        if (progressData) {
          const progressRecord: Record<string, boolean> = {};
          progressData.forEach((p) => { progressRecord[p.lesson_id] = p.completed; });
          setProgress(progressRecord);
        }
      } else {
        setIsEnrolled(courseData.is_free);
      }
    } catch {
      setError('Failed to load course');
    } finally {
      setLoading(false);
    }
  }, [slug, supabaseClient, session?.user?.id]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  return { course, isEnrolled, progress, loading, error, refetch: fetchCourse };
}

// ============================================
// useMarkComplete — toggle lesson completion
// ============================================
export function useMarkComplete() {
  const { supabaseClient, session } = useAuth();
  const [loading, setLoading] = useState(false);

  const toggleComplete = useCallback(
    async (lessonId: string, courseId: string, currentlyCompleted: boolean) => {
      if (!session?.user) return false;

      setLoading(true);
      try {
        if (currentlyCompleted) {
          // Mark incomplete
          const { error } = await supabaseClient
            .from('lesson_progress')
            .update({ completed: false, completed_at: null })
            .eq('user_id', session.user.id)
            .eq('lesson_id', lessonId);

          if (error) throw error;
        } else {
          // Mark complete (upsert)
          const { error } = await supabaseClient.from('lesson_progress').upsert(
            {
              user_id: session.user.id,
              lesson_id: lessonId,
              completed: true,
              completed_at: new Date().toISOString(),
            },
            { onConflict: 'lesson_id,user_id' }
          );

          if (error) throw error;
        }
        return true;
      } catch {
        return false;
      } finally {
        setLoading(false);
      }
    },
    [supabaseClient, session?.user?.id]
  );

  return { toggleComplete, loading };
}

// ============================================
// useEnroll — initiate Stripe checkout for a course
// ============================================
export function useEnroll() {
  const { supabaseClient, session } = useAuth();
  const [loading, setLoading] = useState(false);

  const enroll = useCallback(
    async (course: Course) => {
      if (!session?.user) return;

      // Free courses bypass enrollment check entirely via is_free flag
      if (course.is_free) return;

      if (!course.stripe_price_id) {
        return;
      }

      setLoading(true);
      try {
        // Call Supabase Edge Function to create checkout session
        const { data, error } = await supabaseClient.functions.invoke('create-checkout', {
          body: {
            courseId: course.id,
            priceId: course.stripe_price_id,
          },
        });

        if (error) throw error;
        if (data?.url) {
          window.location.href = data.url;
        }
      } catch {
        // Checkout creation failed — user stays on current page
      } finally {
        setLoading(false);
      }
    },
    [supabaseClient, session?.user]
  );

  return { enroll, loading };
}
