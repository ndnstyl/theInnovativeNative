import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type {
  Course,
  CourseInsert,
  CourseUpdate,
  Module,
  ModuleInsert,
  Lesson,
  LessonInsert,
  LessonUpdate,
  CourseWithModules,
  ModuleWithLessons,
} from '@/types/supabase';

/**
 * Admin CRUD hook for course/module/lesson management.
 * All operations go through supabaseClient and require admin role.
 */
export function useAdminCourses() {
  const { supabaseClient, session } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- Fetch all courses (including unpublished) ----------
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await supabaseClient
        .from('courses')
        .select('*')
        .order('display_order', { ascending: true });

      if (fetchErr) throw fetchErr;
      setCourses(data ?? []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load courses';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [supabaseClient]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // ---------- Course CRUD ----------
  const createCourse = useCallback(
    async (input: CourseInsert): Promise<Course | null> => {
      try {
        const { data, error: insertErr } = await supabaseClient
          .from('courses')
          .insert(input)
          .select()
          .single();

        if (insertErr) throw insertErr;
        await fetchCourses();
        return data;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Create failed';
        setError(message);
        return null;
      }
    },
    [supabaseClient, fetchCourses]
  );

  const updateCourse = useCallback(
    async (id: string, updates: CourseUpdate): Promise<boolean> => {
      try {
        const { error: updateErr } = await supabaseClient
          .from('courses')
          .update(updates)
          .eq('id', id);

        if (updateErr) throw updateErr;
        await fetchCourses();
        return true;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Update failed';
        setError(message);
        return false;
      }
    },
    [supabaseClient, fetchCourses]
  );

  const deleteCourse = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const { error: delErr } = await supabaseClient
          .from('courses')
          .delete()
          .eq('id', id);

        if (delErr) throw delErr;
        await fetchCourses();
        return true;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Delete failed';
        setError(message);
        return false;
      }
    },
    [supabaseClient, fetchCourses]
  );

  // ---------- Fetch single course with modules + lessons ----------
  const fetchCourseDetail = useCallback(
    async (courseId: string): Promise<CourseWithModules | null> => {
      try {
        const { data: courseData, error: courseErr } = await supabaseClient
          .from('courses')
          .select('*')
          .eq('id', courseId)
          .single();

        if (courseErr) throw courseErr;

        const { data: modulesData } = await supabaseClient
          .from('modules')
          .select('*')
          .eq('course_id', courseId)
          .order('display_order', { ascending: true });

        const { data: lessonsData } = await supabaseClient
          .from('lessons')
          .select('*')
          .eq('course_id', courseId)
          .order('display_order', { ascending: true });

        const modules: ModuleWithLessons[] = (modulesData || []).map((mod) => ({
          ...mod,
          lessons: (lessonsData || []).filter((l) => l.module_id === mod.id),
        }));

        return { ...courseData, modules };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Fetch failed';
        setError(message);
        return null;
      }
    },
    [supabaseClient]
  );

  // ---------- Module CRUD ----------
  const createModule = useCallback(
    async (input: ModuleInsert): Promise<Module | null> => {
      try {
        const { data, error: insertErr } = await supabaseClient
          .from('modules')
          .insert(input)
          .select()
          .single();

        if (insertErr) throw insertErr;
        return data;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Create module failed';
        setError(message);
        return null;
      }
    },
    [supabaseClient]
  );

  const updateModule = useCallback(
    async (id: string, updates: { title?: string; display_order?: number }): Promise<boolean> => {
      try {
        const { error: updateErr } = await supabaseClient
          .from('modules')
          .update(updates)
          .eq('id', id);

        if (updateErr) throw updateErr;
        return true;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Update module failed';
        setError(message);
        return false;
      }
    },
    [supabaseClient]
  );

  const deleteModule = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const { error: delErr } = await supabaseClient
          .from('modules')
          .delete()
          .eq('id', id);

        if (delErr) throw delErr;
        return true;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Delete module failed';
        setError(message);
        return false;
      }
    },
    [supabaseClient]
  );

  // ---------- Lesson CRUD ----------
  const createLesson = useCallback(
    async (input: LessonInsert): Promise<Lesson | null> => {
      try {
        const { data, error: insertErr } = await supabaseClient
          .from('lessons')
          .insert(input)
          .select()
          .single();

        if (insertErr) throw insertErr;
        return data;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Create lesson failed';
        setError(message);
        return null;
      }
    },
    [supabaseClient]
  );

  const updateLesson = useCallback(
    async (id: string, updates: LessonUpdate): Promise<boolean> => {
      try {
        const { error: updateErr } = await supabaseClient
          .from('lessons')
          .update(updates)
          .eq('id', id);

        if (updateErr) throw updateErr;
        return true;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Update lesson failed';
        setError(message);
        return false;
      }
    },
    [supabaseClient]
  );

  const deleteLesson = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const { error: delErr } = await supabaseClient
          .from('lessons')
          .delete()
          .eq('id', id);

        if (delErr) throw delErr;
        return true;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Delete lesson failed';
        setError(message);
        return false;
      }
    },
    [supabaseClient]
  );

  // ---------- Reorder helpers ----------
  const reorderModules = useCallback(
    async (moduleIds: string[]): Promise<boolean> => {
      try {
        const updates = moduleIds.map((id, idx) =>
          supabaseClient.from('modules').update({ display_order: idx }).eq('id', id)
        );
        const results = await Promise.all(updates);
        const failed = results.find((r) => r.error);
        if (failed?.error) throw failed.error;
        return true;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Reorder failed';
        setError(message);
        return false;
      }
    },
    [supabaseClient]
  );

  const reorderLessons = useCallback(
    async (lessonIds: string[]): Promise<boolean> => {
      try {
        const updates = lessonIds.map((id, idx) =>
          supabaseClient.from('lessons').update({ display_order: idx }).eq('id', id)
        );
        const results = await Promise.all(updates);
        const failed = results.find((r) => r.error);
        if (failed?.error) throw failed.error;
        return true;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Reorder failed';
        setError(message);
        return false;
      }
    },
    [supabaseClient]
  );

  return {
    courses,
    loading,
    error,
    fetchCourses,
    fetchCourseDetail,
    createCourse,
    updateCourse,
    deleteCourse,
    createModule,
    updateModule,
    deleteModule,
    createLesson,
    updateLesson,
    deleteLesson,
    reorderModules,
    reorderLessons,
  };
}
