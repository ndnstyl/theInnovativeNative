import React from 'react';
import { render } from '@testing-library/react';

// -------------------------------------------------------
// Mock dependencies shared by ClassroomPage + CourseRedirectPage
// -------------------------------------------------------

const mockCourses = [
  {
    id: '1',
    title: 'Brand Vibe: Start Here',
    description: 'Introduction to the community brand and vision.',
    slug: 'brand-vibe-start-here',
    is_free: true,
    published: true,
    display_order: 1,
    is_enrolled: true,
    progress: 0,
    total_lessons: 5,
    completed_lessons: 0,
  },
  {
    id: '2',
    title: 'Chaos to Clarity: AI-First Systems That Scale',
    description: 'Build AI-first automation systems that grow with your business.',
    slug: 'chaos-to-clarity',
    is_free: false,
    published: true,
    display_order: 2,
    stripe_price_id: 'price_123',
    is_enrolled: false,
    progress: 0,
    total_lessons: 10,
    completed_lessons: 0,
  },
];

const mockCourseWithModules = {
  id: '1',
  title: 'Brand Vibe: Start Here',
  description: 'Introduction to the community brand and vision.',
  slug: 'brand-vibe-start-here',
  is_free: true,
  published: true,
  display_order: 1,
  modules: [
    {
      id: 'm1',
      title: 'Module 1',
      display_order: 1,
      course_id: '1',
      lessons: [{ id: 'l1', title: 'Lesson 1', display_order: 1, module_id: 'm1', course_id: '1' }],
    },
  ],
};

// Mock useCourses hook
jest.mock('@/hooks/useCourses', () => ({
  useCourses: () => ({
    courses: mockCourses,
    loading: false,
    error: null,
  }),
  useCourse: () => ({
    course: mockCourseWithModules,
    isEnrolled: true,
    progress: {},
    loading: false,
    error: null,
    refetch: jest.fn(),
  }),
}));

// Mock AuthContext
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    session: { user: { id: 'test-user', email: 'test@test.com' } },
    isLoading: false,
    profile: { display_name: 'Test', avatar_url: null },
    supabaseClient: {},
  }),
}));

// Mock useRole hook
jest.mock('@/hooks/useRole', () => ({
  useRole: () => ({
    role: 'member',
    isAtLeast: () => false,
  }),
}));

// Mock useUnreadCount
jest.mock('@/hooks/useUnreadCount', () => ({
  useUnreadCount: () => 0,
}));

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/classroom',
    asPath: '/classroom',
    query: { courseSlug: 'brand-vibe-start-here' },
    replace: jest.fn(),
    push: jest.fn(),
  }),
}));

// Mock next/head to render children into DOM
jest.mock('next/head', () => {
  return function MockHead({ children }: { children: React.ReactNode }) {
    return <div data-testid="head-mock">{children}</div>;
  };
});

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

// Mock notification components
jest.mock('@/components/auth/AuthModal', () => {
  return function MockAuthModal() { return null; };
});
jest.mock('@/components/messaging/UnreadBadge', () => {
  return function MockUnreadBadge() { return null; };
});
jest.mock('@/components/notifications/NotificationBell', () => {
  return function MockNotificationBell() { return null; };
});

// Mock CourseGrid to just render a simple div
jest.mock('@/components/classroom/CourseGrid', () => {
  return function MockCourseGrid() {
    return <div data-testid="course-grid">CourseGrid</div>;
  };
});

// -------------------------------------------------------
// Tests
// -------------------------------------------------------

describe('Classroom index — schema.org JSON-LD', () => {
  it('contains application/ld+json script in head', async () => {
    // Dynamic import to ensure mocks are applied
    const ClassroomPage = (await import('@/pages/classroom/index')).default;
    const { container } = render(<ClassroomPage />);

    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts.length).toBeGreaterThanOrEqual(1);
  });

  it('contains ItemList schema type', async () => {
    const ClassroomPage = (await import('@/pages/classroom/index')).default;
    const { container } = render(<ClassroomPage />);

    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    let foundItemList = false;
    scripts.forEach((script) => {
      const json = JSON.parse(script.textContent || '{}');
      if (json['@type'] === 'ItemList') {
        foundItemList = true;
      }
    });
    expect(foundItemList).toBe(true);
  });

  it('ItemList contains course entries with correct schema', async () => {
    const ClassroomPage = (await import('@/pages/classroom/index')).default;
    const { container } = render(<ClassroomPage />);

    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    let itemList: any = null;
    scripts.forEach((script) => {
      const json = JSON.parse(script.textContent || '{}');
      if (json['@type'] === 'ItemList') {
        itemList = json;
      }
    });

    expect(itemList).not.toBeNull();
    expect(itemList.itemListElement).toBeDefined();
    expect(itemList.itemListElement.length).toBeGreaterThanOrEqual(1);

    const firstItem = itemList.itemListElement[0];
    expect(firstItem['@type']).toBe('ListItem');
    expect(firstItem.item['@type']).toBe('Course');
    expect(firstItem.item.provider).toBeDefined();
    expect(firstItem.item.provider.name).toBe('The Innovative Native');
  });
});

describe('Course detail page — schema.org JSON-LD', () => {
  it('contains application/ld+json script in head', async () => {
    const CoursePage = (await import('@/pages/classroom/[courseSlug]/index')).default;
    const { container } = render(<CoursePage />);

    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts.length).toBeGreaterThanOrEqual(1);
  });

  it('contains Course schema type', async () => {
    const CoursePage = (await import('@/pages/classroom/[courseSlug]/index')).default;
    const { container } = render(<CoursePage />);

    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    let foundCourse = false;
    scripts.forEach((script) => {
      const json = JSON.parse(script.textContent || '{}');
      if (json['@type'] === 'Course') {
        foundCourse = true;
      }
    });
    expect(foundCourse).toBe(true);
  });

  it('Course schema has required fields', async () => {
    const CoursePage = (await import('@/pages/classroom/[courseSlug]/index')).default;
    const { container } = render(<CoursePage />);

    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    let courseSchema: any = null;
    scripts.forEach((script) => {
      const json = JSON.parse(script.textContent || '{}');
      if (json['@type'] === 'Course') {
        courseSchema = json;
      }
    });

    expect(courseSchema).not.toBeNull();
    expect(courseSchema.name).toBeDefined();
    expect(courseSchema.description).toBeDefined();
    expect(courseSchema.provider).toBeDefined();
    expect(courseSchema.provider.name).toBe('The Innovative Native');
    expect(courseSchema.offers).toBeDefined();
  });
});
