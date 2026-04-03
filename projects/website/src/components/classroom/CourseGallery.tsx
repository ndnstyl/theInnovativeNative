import React, { useCallback, useState, useEffect } from 'react';
import Link from 'next/link';
import { classroomCourses, CoursePreview } from '@/data/classroom-courses';
import { useAuth } from '@/contexts/AuthContext';
import { useCourseCheckout } from '@/hooks/useCourseCheckout';
import { createBrowserClient } from '@/lib/supabase';
import { logger } from '@/lib/logger';

interface CourseGalleryProps {
  courses?: CoursePreview[];
  isAuthenticated: boolean;
  onTrialClick?: () => void;
}

interface CourseDBInfo {
  id: string;
  is_free: boolean;
  stripe_price_id: string | null;
  published: boolean;
}

const CourseGallery: React.FC<CourseGalleryProps> = ({
  courses = classroomCourses,
  isAuthenticated,
  onTrialClick,
}) => {
  const { session } = useAuth();
  const { startCheckout, loading: checkoutLoading, error: checkoutError } = useCourseCheckout();
  const [dbCourses, setDbCourses] = useState<Record<string, CourseDBInfo>>({});
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set());
  const [enrollingFreeId, setEnrollingFreeId] = useState<string | null>(null);

  // Fetch published courses using direct fetch (bypasses Supabase client session issues)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/courses?select=id,is_free,stripe_price_id,published&published=eq.true`;
    fetch(url, {
      headers: { 'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '' },
    })
      .then(res => res.json())
      .then((data: CourseDBInfo[]) => {
        const map: Record<string, CourseDBInfo> = {};
        data.forEach(c => { map[c.id] = c; });
        setDbCourses(map);
      })
      .catch((err: unknown) => {
        logger.error('CourseGallery', 'fetchCourses', err);
      });
  }, []);

  // Fetch enrollments (requires auth — runs when session changes)
  useEffect(() => {
    if (!session?.user) return;
    const supabase = createBrowserClient();
    supabase
      .from('enrollments')
      .select('course_id')
      .eq('user_id', session.user.id)
      .eq('status', 'active')
      .then(({ data }) => {
        if (data) {
          setEnrolledCourseIds(new Set(data.map((e: { course_id: string }) => e.course_id)));
        }
      });
  }, [session]);

  const handleUnauthenticatedClick = useCallback(() => {
    onTrialClick?.();
  }, [onTrialClick]);

  const handleFreeEnroll = useCallback(async (courseId: string) => {
    if (!session?.user) {
      // Not logged in — trigger login flow
      onTrialClick?.();
      return;
    }
    setEnrollingFreeId(courseId);
    const supabase = createBrowserClient();
    await supabase.from('enrollments').upsert({
      user_id: session.user.id,
      course_id: courseId,
      status: 'active',
      enrolled_at: new Date().toISOString(),
    }, { onConflict: 'user_id,course_id' });
    setEnrolledCourseIds(prev => {
      const next = new Set(Array.from(prev));
      next.add(courseId);
      return next;
    });
    setEnrollingFreeId(null);
  }, [session]);

  const handlePaidEnroll = useCallback(async (courseId: string) => {
    if (!session?.user) {
      onTrialClick?.();
      return;
    }
    const dbCourse = dbCourses[courseId];
    if (!dbCourse) return;
    // startCheckout only reads id, is_free, stripe_price_id from the Course object
    await startCheckout({
      id: courseId,
      is_free: dbCourse.is_free,
      stripe_price_id: dbCourse.stripe_price_id,
    } as import('@/types/supabase').Course);
  }, [dbCourses, startCheckout]);

  return (
    <div className="course-gallery">
      <div className="course-gallery__track">
        {courses.map((course) => {
          const isEnrolled = enrolledCourseIds.has(course.id);

          return (
            <Link
              key={course.id}
              href={course.href}
              className={`course-gallery__card${isEnrolled ? ' course-gallery__card--enrolled' : ''}`}
            >
              <img
                src={course.thumbnail}
                alt={course.title}
                width={300}
                height={170}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="course-gallery__card-title">{course.title}</div>
              {isEnrolled && (
                <div className="course-gallery__card-badge">Continue</div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CourseGallery;
