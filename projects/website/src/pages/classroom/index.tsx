import React from 'react';
import ClassroomLayout from '@/components/layout/ClassroomLayout';
import CourseGrid from '@/components/classroom/CourseGrid';
import { useCourses } from '@/hooks/useCourses';

function buildCourseListJsonLd(courses: { title: string; description?: string | null; is_free?: boolean }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Courses | The Innovative Native',
    description: 'AI automation and growth marketing courses from The Innovative Native community.',
    itemListElement: courses.map((course, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
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
      },
    })),
  };
}

const ClassroomPage: React.FC = () => {
  const { courses, loading, error } = useCourses();

  const jsonLd = buildCourseListJsonLd(courses);

  return (
    <ClassroomLayout title="My Courses">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="classroom-dashboard">
        <div className="classroom-dashboard__header">
          <h1>Classroom</h1>
          <p>Your courses and learning progress</p>
        </div>

        {loading ? (
          <div className="classroom-dashboard__loading">
            <div className="classroom-loading__spinner" />
            <p>Loading courses...</p>
          </div>
        ) : error ? (
          <div className="classroom-dashboard__error">
            <i className="fa-solid fa-exclamation-triangle"></i>
            <p>{error}</p>
          </div>
        ) : (
          <CourseGrid courses={courses} />
        )}
      </div>
    </ClassroomLayout>
  );
};

export default ClassroomPage;
