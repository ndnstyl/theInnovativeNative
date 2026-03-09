import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import ClassroomLayout from '@/components/layout/ClassroomLayout';
import { useCourse } from '@/hooks/useCourses';

const CourseRedirectPage: React.FC = () => {
  const router = useRouter();
  const { courseSlug } = router.query;
  const { course, isEnrolled, loading } = useCourse(courseSlug as string);

  useEffect(() => {
    if (!course || loading) return;

    // Find the first lesson to redirect to
    const firstModule = course.modules[0];
    const firstLesson = firstModule?.lessons[0];

    if (firstLesson) {
      // If enrolled or lesson is free preview, go to lesson
      if (isEnrolled || firstLesson.is_free_preview) {
        router.replace(`/classroom/${courseSlug}/${firstLesson.slug}`);
      } else {
        // Go to first lesson anyway — it will show enrollment gate
        router.replace(`/classroom/${courseSlug}/${firstLesson.slug}`);
      }
    }
  }, [course, isEnrolled, loading, courseSlug, router]);

  return (
    <ClassroomLayout>
      <div className="classroom-dashboard__loading">
        <div className="classroom-loading__spinner" />
        <p>Loading course...</p>
      </div>
    </ClassroomLayout>
  );
};

export default CourseRedirectPage;
