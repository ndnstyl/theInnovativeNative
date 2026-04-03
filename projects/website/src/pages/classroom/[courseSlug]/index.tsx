import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import ClassroomLayout from '@/components/layout/ClassroomLayout';
import { useCourse } from '@/hooks/useCourses';

function buildCourseJsonLd(course: { title: string; description?: string | null; is_free?: boolean }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description || '',
    provider: {
      '@type': 'Organization',
      name: 'The Innovative Native',
      url: 'https://theinnovativenative.com',
    },
    offers: {
      '@type': 'Offer',
      price: course.is_free ? '0' : '99',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  };
}

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
      // Redirect to first lesson (by ID since slug column was removed)
      router.replace(`/classroom/${courseSlug}/${firstLesson.id}`);
    }
  }, [course, isEnrolled, loading, courseSlug, router]);

  const jsonLd = course ? buildCourseJsonLd(course) : null;

  return (
    <ClassroomLayout>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <div className="classroom-dashboard__loading">
        <div className="classroom-loading__spinner" />
        <p>Loading course...</p>
      </div>
    </ClassroomLayout>
  );
};

export default CourseRedirectPage;
