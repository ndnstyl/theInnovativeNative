import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ProgressBar from './ProgressBar';
import type { StudentProgressSummary } from '@/types/supabase';

/**
 * Personal learning dashboard — shows enrolled courses with progress.
 */
const StudentDashboard: React.FC = () => {
  const { supabaseClient, session, profile } = useAuth();
  const [courses, setCourses] = useState<StudentProgressSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProgress() {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      try {
        // Fetch enrollments
        const { data: enrollments } = await supabaseClient
          .from('enrollments')
          .select('course_id, enrolled_at')
          .eq('user_id', session.user.id);

        if (!enrollments || enrollments.length === 0) {
          setCourses([]);
          return;
        }

        const courseIds = enrollments.map((e) => e.course_id);
        const enrollmentMap = new Map(enrollments.map((e) => [e.course_id, e.enrolled_at]));

        // Fetch course data
        const { data: coursesData } = await supabaseClient
          .from('courses')
          .select('id, title, slug, thumbnail_url')
          .in('id', courseIds);

        // Fetch lesson counts
        const { data: lessons } = await supabaseClient
          .from('lessons')
          .select('id, course_id')
          .in('course_id', courseIds);

        // Fetch progress
        const { data: progressData } = await supabaseClient
          .from('lesson_progress')
          .select('lesson_id, course_id, completed, completed_at')
          .eq('user_id', session.user.id)
          .eq('completed', true)
          .in('course_id', courseIds);

        // Build summaries
        const lessonsByConurse = new Map<string, number>();
        (lessons ?? []).forEach((l) => {
          lessonsByConurse.set(l.course_id, (lessonsByConurse.get(l.course_id) ?? 0) + 1);
        });

        const completedByCourse = new Map<string, { count: number; lastAt: string | null }>();
        (progressData ?? []).forEach((p) => {
          const cur = completedByCourse.get(p.course_id);
          const newCount = (cur?.count ?? 0) + 1;
          const lastAt = !cur?.lastAt || (p.completed_at && p.completed_at > (cur.lastAt ?? ''))
            ? p.completed_at
            : cur?.lastAt ?? null;
          completedByCourse.set(p.course_id, { count: newCount, lastAt });
        });

        const summaries: StudentProgressSummary[] = (coursesData ?? []).map((c) => {
          const total = lessonsByConurse.get(c.id) ?? 0;
          const completed = completedByCourse.get(c.id)?.count ?? 0;
          return {
            course_id: c.id,
            course_title: c.title,
            course_slug: c.slug,
            thumbnail_url: c.thumbnail_url,
            total_lessons: total,
            completed_lessons: completed,
            progress_pct: total > 0 ? Math.round((completed / total) * 100) : 0,
            last_accessed_at: completedByCourse.get(c.id)?.lastAt ?? null,
            enrolled_at: enrollmentMap.get(c.id) ?? '',
          };
        });

        // Sort: in-progress first, then by progress desc
        summaries.sort((a, b) => {
          if (a.progress_pct === 100 && b.progress_pct < 100) return 1;
          if (a.progress_pct < 100 && b.progress_pct === 100) return -1;
          return b.progress_pct - a.progress_pct;
        });

        setCourses(summaries);
      } catch (err) {
        console.error('Error fetching student progress:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProgress();
  }, [supabaseClient, session?.user?.id]);

  if (loading) {
    return (
      <div className="classroom-student-dash">
        <div className="classroom-student-dash__loading">
          <div className="classroom-loading__spinner" />
          <p>Loading your progress...</p>
        </div>
      </div>
    );
  }

  const totalCompleted = courses.filter((c) => c.progress_pct === 100).length;
  const totalLessonsCompleted = courses.reduce((sum, c) => sum + c.completed_lessons, 0);

  return (
    <div className="classroom-student-dash">
      <div className="classroom-student-dash__greeting">
        <h1>My Progress</h1>
        <p>Welcome back{profile?.display_name ? `, ${profile.display_name}` : ''}</p>
      </div>

      <div className="classroom-student-dash__stats">
        <div className="classroom-student-dash__stat">
          <span className="classroom-student-dash__stat-value">{courses.length}</span>
          <span className="classroom-student-dash__stat-label">Enrolled</span>
        </div>
        <div className="classroom-student-dash__stat">
          <span className="classroom-student-dash__stat-value">{totalCompleted}</span>
          <span className="classroom-student-dash__stat-label">Completed</span>
        </div>
        <div className="classroom-student-dash__stat">
          <span className="classroom-student-dash__stat-value">{totalLessonsCompleted}</span>
          <span className="classroom-student-dash__stat-label">Lessons Done</span>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="classroom-student-dash__empty">
          <i className="fa-solid fa-book-open"></i>
          <h3>No courses yet</h3>
          <p>Browse the classroom to find your first course.</p>
          <Link href="/classroom" className="classroom-student-dash__browse-btn">
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="classroom-student-dash__courses">
          {courses.map((c) => (
            <Link
              key={c.course_id}
              href={`/classroom/${c.course_slug}`}
              className="classroom-student-dash__course"
            >
              <div className="classroom-student-dash__course-thumb">
                {c.thumbnail_url ? (
                  <img src={c.thumbnail_url} alt={c.course_title} />
                ) : (
                  <div className="classroom-student-dash__thumb-placeholder">
                    <i className="fa-solid fa-graduation-cap"></i>
                  </div>
                )}
              </div>
              <div className="classroom-student-dash__course-info">
                <h3>{c.course_title}</h3>
                <ProgressBar progress={c.progress_pct} size="sm" />
                <span className="classroom-student-dash__course-meta">
                  {c.completed_lessons}/{c.total_lessons} lessons
                  {c.progress_pct === 100 && (
                    <span className="classroom-student-dash__complete-badge">
                      <i className="fa-solid fa-circle-check"></i> Complete
                    </span>
                  )}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
