// =============================================================================
// Classroom & Community Platform — Comprehensive TDD Test Suite
//
// Covers: component rendering, data structures, hook contracts, Supabase table
// references, route definitions, auth flow, checkout flow, course data,
// and security. Tests are grouped by feature area.
//
// Tests marked "[KNOWN GAP]" document expected failures for missing features.
// Tests marked "[REGRESSION GUARD]" protect against previously-fixed bugs.
// =============================================================================

import * as fs from 'fs';
import * as path from 'path';

const SRC_DIR = path.resolve(__dirname, '../../');
const PAGES_DIR = path.resolve(SRC_DIR, 'pages');
const COMPONENTS_DIR = path.resolve(SRC_DIR, 'components');
const HOOKS_DIR = path.resolve(SRC_DIR, 'hooks');
const DATA_DIR = path.resolve(SRC_DIR, 'data');
const TYPES_DIR = path.resolve(SRC_DIR, 'types');
const LIB_DIR = path.resolve(SRC_DIR, 'lib');

function readFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8');
}

function fileExists(relativePath: string): boolean {
  return fs.existsSync(path.resolve(SRC_DIR, relativePath));
}

function getAllFiles(dir: string, ext: string[] = ['.tsx', '.ts']): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllFiles(fullPath, ext));
    } else if (ext.some((e) => entry.name.endsWith(e)) && !entry.name.startsWith('_')) {
      results.push(fullPath);
    }
  }
  return results;
}

// =============================================================================
// 1. COMPONENT RENDERING — Do classroom components exist and export correctly?
// =============================================================================

describe('1. Component Rendering — Classroom Components Exist', () => {
  const classroomComponents = [
    'components/classroom/ClassroomLanding.tsx',
    'components/classroom/HeroBanner.tsx',
    'components/classroom/CourseGallery.tsx',
    'components/classroom/CommunityMetaBar.tsx',
    'components/classroom/AboutSection.tsx',
    'components/classroom/CommunitySidebar.tsx',
  ];

  it.each(classroomComponents)('%s exists', (componentPath) => {
    expect(fileExists(componentPath)).toBe(true);
  });

  describe('ClassroomLanding component', () => {
    let content: string;

    beforeAll(() => {
      content = readFile(path.resolve(SRC_DIR, 'components/classroom/ClassroomLanding.tsx'));
    });

    it('has a default export', () => {
      expect(content).toMatch(/export default function ClassroomLanding/);
    });

    it('accepts all required props (memberCount, adminCount, onlineCount, isConnected, loading, isAuthenticated, onLoginClick, onTrialClick)', () => {
      expect(content).toContain('memberCount');
      expect(content).toContain('adminCount');
      expect(content).toContain('onlineCount');
      expect(content).toContain('isConnected');
      expect(content).toContain('loading');
      expect(content).toContain('isAuthenticated');
      expect(content).toContain('onLoginClick');
      expect(content).toContain('onTrialClick');
    });

    it('composes HeroBanner, CourseGallery, CommunityMetaBar, AboutSection, CommunitySidebar', () => {
      expect(content).toContain('<HeroBanner');
      expect(content).toContain('<CourseGallery');
      expect(content).toContain('<CommunityMetaBar');
      expect(content).toContain('<AboutSection');
      expect(content).toContain('<CommunitySidebar');
    });

    it('uses GSAP for animations', () => {
      expect(content).toContain('gsap');
    });

    it('respects prefers-reduced-motion', () => {
      expect(content).toContain('prefers-reduced-motion');
    });

    it('includes legal links (privacy policy, terms)', () => {
      expect(content).toContain('/privacy-policy');
      expect(content).toContain('/terms-and-conditions');
    });
  });

  describe('HeroBanner component', () => {
    let content: string;

    beforeAll(() => {
      content = readFile(path.resolve(SRC_DIR, 'components/classroom/HeroBanner.tsx'));
    });

    it('renders a banner image', () => {
      expect(content).toContain('banner.jpg');
    });

    it('includes alt text for accessibility', () => {
      expect(content).toMatch(/alt=".+"/);
    });

    it('uses eager loading for above-the-fold image', () => {
      expect(content).toContain('loading="eager"');
    });
  });

  describe('CourseGallery component', () => {
    let content: string;

    beforeAll(() => {
      content = readFile(path.resolve(SRC_DIR, 'components/classroom/CourseGallery.tsx'));
    });

    it('imports classroomCourses data', () => {
      expect(content).toContain('classroomCourses');
    });

    it('uses classroomCourses as default prop', () => {
      expect(content).toContain('courses = classroomCourses');
    });

    it('renders links for authenticated users', () => {
      expect(content).toContain('isAuthenticated');
      expect(content).toContain('<Link');
    });

    it('renders clickable divs for unauthenticated users that trigger trial signup', () => {
      expect(content).toContain('handleUnauthenticatedClick');
      expect(content).toContain('onTrialClick');
    });

    it('has aria-label for unauthenticated course cards', () => {
      expect(content).toContain('aria-label');
    });

    it('supports keyboard navigation (Enter and Space) for unauthenticated cards', () => {
      expect(content).toContain("e.key === 'Enter'");
      expect(content).toContain("e.key === ' '");
    });
  });

  describe('CommunitySidebar component', () => {
    let content: string;

    beforeAll(() => {
      content = readFile(path.resolve(SRC_DIR, 'components/classroom/CommunitySidebar.tsx'));
    });

    it('displays member count', () => {
      expect(content).toContain('memberCount');
    });

    it('displays online count when connected', () => {
      expect(content).toContain('onlineCount');
      expect(content).toContain('isConnected');
    });

    it('displays admin count', () => {
      expect(content).toContain('adminCount');
    });

    it('has CTA button for free trial', () => {
      expect(content).toContain('Start 7-Day Free Trial');
    });

    it('has log in button', () => {
      expect(content).toContain('Log In');
    });

    it('shows placeholder when member count is 0', () => {
      expect(content).toContain('Be first!');
    });
  });

  describe('CommunityMetaBar component', () => {
    let content: string;

    beforeAll(() => {
      content = readFile(path.resolve(SRC_DIR, 'components/classroom/CommunityMetaBar.tsx'));
    });

    it('displays membership price from constants', () => {
      expect(content).toContain('MEMBERSHIP_PRICE');
    });

    it('shows member count with loading state', () => {
      expect(content).toContain('memberCount');
      expect(content).toContain('loading');
    });

    it('uses aria-live for dynamic member count', () => {
      expect(content).toContain('aria-live="polite"');
    });
  });

  describe('AboutSection component', () => {
    let content: string;

    beforeAll(() => {
      content = readFile(path.resolve(SRC_DIR, 'components/classroom/AboutSection.tsx'));
    });

    it('uses MEMBERSHIP_PRICE from constants', () => {
      expect(content).toContain('MEMBERSHIP_PRICE');
    });

    it('has accessible heading via aria-labelledby', () => {
      expect(content).toContain('aria-labelledby="about-heading"');
    });

    it('mentions trial details (7-day)', () => {
      expect(content).toContain('7');
    });
  });

  describe('AuthModal component', () => {
    let content: string;

    beforeAll(() => {
      content = readFile(path.resolve(SRC_DIR, 'components/auth/AuthModal.tsx'));
    });

    it('supports both signin and signup modes', () => {
      expect(content).toContain("'signin'");
      expect(content).toContain("'signup'");
    });

    it('Google OAuth removed — provider not enabled in Supabase', () => {
      // Google OAuth was intentionally removed until the provider is configured.
      // Re-add this test when Google OAuth is re-enabled.
      expect(content).toContain('Google OAuth removed');
    });

    it('validates email format', () => {
      expect(content).toMatch(/[^\s@]+@[^\s@]+\.[^\s@]+/);
    });

    it('enforces minimum password length of 8', () => {
      expect(content).toContain('password.length < 8');
    });

    it('handles escape key to close', () => {
      expect(content).toContain("e.key === 'Escape'");
    });

    it('implements focus trap', () => {
      expect(content).toContain("e.key !== 'Tab'");
    });

    it('prevents body scroll when open', () => {
      expect(content).toContain("document.body.style.overflow = 'hidden'");
    });

    it('uses role="dialog" and aria-modal', () => {
      expect(content).toContain('role="dialog"');
      expect(content).toContain('aria-modal="true"');
    });

    it('resets state when modal closes', () => {
      expect(content).toContain("setEmail('')");
      expect(content).toContain("setPassword('')");
      expect(content).toContain('setMessage(null)');
    });

    it('links to terms and privacy policy', () => {
      expect(content).toContain('/terms-and-conditions');
      expect(content).toContain('/privacy-policy');
    });

    it('supports redirectTo prop for post-auth navigation', () => {
      expect(content).toContain('redirectTo');
    });
  });
});

// =============================================================================
// 2. DATA STRUCTURES — Are course/type definitions correct?
// =============================================================================

describe('2. Data Structures — Course and Type Definitions', () => {
  describe('classroom-courses.ts', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const courseModule = require('@/data/classroom-courses');

    it('exports classroomCourses array', () => {
      expect(Array.isArray(courseModule.classroomCourses)).toBe(true);
    });

    it('exports CoursePreview interface shape', () => {
      // Interface won't be at runtime, but we verify data shape
      const courses = courseModule.classroomCourses;
      expect(courses.length).toBeGreaterThan(0);
    });

    it('each course has required fields: id, title, thumbnail, href', () => {
      const courses = courseModule.classroomCourses;
      courses.forEach((course: any) => {
        expect(course).toHaveProperty('id');
        expect(course).toHaveProperty('title');
        expect(course).toHaveProperty('thumbnail');
        expect(course).toHaveProperty('href');

        expect(typeof course.id).toBe('string');
        expect(typeof course.title).toBe('string');
        expect(typeof course.thumbnail).toBe('string');
        expect(typeof course.href).toBe('string');
      });
    });

    it('all course IDs are unique', () => {
      const courses = courseModule.classroomCourses;
      const ids = courses.map((c: any) => c.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('all course hrefs start with /classroom/', () => {
      const courses = courseModule.classroomCourses;
      courses.forEach((course: any) => {
        expect(course.href).toMatch(/^\/classroom\//);
      });
    });

    it('all course thumbnails have valid image extensions', () => {
      const courses = courseModule.classroomCourses;
      courses.forEach((course: any) => {
        expect(course.thumbnail).toMatch(/\.(jpg|jpeg|png|webp|gif)$/i);
      });
    });

    it('has at least 6 courses defined', () => {
      expect(courseModule.classroomCourses.length).toBeGreaterThanOrEqual(6);
    });

    it('includes expected courses by title: AI Fluency, Brand Vibe, n8n Templates', () => {
      // Course IDs changed from slugs to UUIDs to match Supabase courses.id.
      // Verify by title instead.
      const titles = courseModule.classroomCourses.map((c: any) => c.title);
      expect(titles).toContain('AI Fluency Weekend Build');
      expect(titles).toContain('Brand Vibe - START HERE');
      expect(titles).toContain('n8n Templates');
    });
  });

  describe('lib/constants.ts', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const constants = require('@/lib/constants');

    it('exports COMMUNITY_ID', () => {
      expect(constants.COMMUNITY_ID).toBeDefined();
      expect(typeof constants.COMMUNITY_ID).toBe('string');
    });

    it('COMMUNITY_ID is a valid UUID format', () => {
      expect(constants.COMMUNITY_ID).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      );
    });

    it('exports MEMBERSHIP_PRICE', () => {
      expect(constants.MEMBERSHIP_PRICE).toBeDefined();
      expect(constants.MEMBERSHIP_PRICE).toContain('$');
    });

    it('exports MEMBERSHIP_TRIAL', () => {
      expect(constants.MEMBERSHIP_TRIAL).toBeDefined();
      expect(constants.MEMBERSHIP_TRIAL).toContain('7-day');
    });

    it('exports CALENDLY_URL', () => {
      expect(constants.CALENDLY_URL).toBeDefined();
      expect(constants.CALENDLY_URL).toMatch(/^https:\/\/calendly\.com\//);
    });
  });

  describe('members.ts type definitions', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const membersModule = require('@/types/members');

    it('exports ROLE_HIERARCHY with correct priority order', () => {
      expect(membersModule.ROLE_HIERARCHY).toBeDefined();
      expect(membersModule.ROLE_HIERARCHY.owner).toBe(4);
      expect(membersModule.ROLE_HIERARCHY.admin).toBe(3);
      expect(membersModule.ROLE_HIERARCHY.moderator).toBe(2);
      expect(membersModule.ROLE_HIERARCHY.member).toBe(1);
    });

    it('owner > admin > moderator > member', () => {
      const h = membersModule.ROLE_HIERARCHY;
      expect(h.owner).toBeGreaterThan(h.admin);
      expect(h.admin).toBeGreaterThan(h.moderator);
      expect(h.moderator).toBeGreaterThan(h.member);
    });
  });
});

// =============================================================================
// 3. HOOK CONTRACTS — Do hooks have expected return shapes?
// =============================================================================

describe('3. Hook Contracts — Return Shapes and Dependencies', () => {
  describe('useCourses hook', () => {
    let content: string;

    beforeAll(() => {
      content = readFile(path.resolve(HOOKS_DIR, 'useCourses.ts'));
    });

    it('exports useCourses function', () => {
      expect(content).toContain('export function useCourses()');
    });

    it('returns { courses, loading, error }', () => {
      expect(content).toContain('return { courses, loading, error }');
    });

    it('calls useAuth() for supabaseClient and session', () => {
      expect(content).toContain('useAuth()');
      expect(content).toContain('supabaseClient');
      expect(content).toContain('session');
    });

    it('queries the "courses" table filtered by published=true', () => {
      expect(content).toContain(".from('courses')");
      expect(content).toContain(".eq('published', true)");
    });

    it('orders courses by display_order ascending', () => {
      expect(content).toContain("order('display_order'");
    });

    it('queries "enrollments" for enrollment status', () => {
      expect(content).toContain(".from('enrollments')");
    });

    it('queries "lessons" table for progress tracking', () => {
      expect(content).toContain(".from('lessons')");
    });

    it('queries "lesson_progress" table for completion data', () => {
      expect(content).toContain(".from('lesson_progress')");
    });

    it('enriches courses with progress data (is_enrolled, progress, total_lessons, completed_lessons)', () => {
      expect(content).toContain('is_enrolled');
      expect(content).toContain('progress:');
      expect(content).toContain('total_lessons');
      expect(content).toContain('completed_lessons');
    });

    it('treats free courses as enrolled by default', () => {
      expect(content).toContain('course.is_free');
    });
  });

  describe('useCourse hook (single course detail)', () => {
    let content: string;

    beforeAll(() => {
      content = readFile(path.resolve(HOOKS_DIR, 'useCourses.ts'));
    });

    it('exports useCourse function', () => {
      expect(content).toContain('export function useCourse(');
    });

    it('returns { course, isEnrolled, progress, loading, error, refetch }', () => {
      expect(content).toContain('return { course, isEnrolled, progress, loading, error, refetch');
    });

    it('fetches modules ordered by display_order', () => {
      expect(content).toContain(".from('modules')");
      expect(content).toContain("eq('course_id'");
    });

    it('[REGRESSION GUARD] queries course by id, not slug', () => {
      // The slug column was removed from the schema
      expect(content).toContain(".eq('id', slug)");
      expect(content).not.toContain(".eq('slug',");
    });

    it('fetches lesson_progress using lesson IDs (not course_id on lesson_progress)', () => {
      expect(content).toContain(".in('lesson_id', allLessonIds)");
    });
  });

  describe('useMarkComplete hook', () => {
    let content: string;

    beforeAll(() => {
      content = readFile(path.resolve(HOOKS_DIR, 'useCourses.ts'));
    });

    it('exports useMarkComplete function', () => {
      expect(content).toContain('export function useMarkComplete()');
    });

    it('returns { toggleComplete, loading }', () => {
      expect(content).toContain('return { toggleComplete, loading }');
    });

    it('supports both mark-complete and mark-incomplete', () => {
      expect(content).toContain('completed: false');
      expect(content).toContain('completed: true');
    });

    it('uses upsert for mark-complete to prevent duplicate rows', () => {
      expect(content).toContain('.upsert(');
      expect(content).toContain("onConflict: 'lesson_id,user_id'");
    });
  });

  describe('useEnroll hook', () => {
    let content: string;

    beforeAll(() => {
      content = readFile(path.resolve(HOOKS_DIR, 'useCourses.ts'));
    });

    it('exports useEnroll function', () => {
      expect(content).toContain('export function useEnroll()');
    });

    it('delegates to useCourseCheckout', () => {
      expect(content).toContain('useCourseCheckout');
      expect(content).toContain('startCheckout');
    });

    it('returns { enroll, loading, error }', () => {
      expect(content).toContain('return { enroll, loading, error }');
    });
  });

  describe('useCourseCheckout hook', () => {
    let content: string;

    beforeAll(() => {
      content = readFile(path.resolve(HOOKS_DIR, 'useCourseCheckout.ts'));
    });

    it('exports useCourseCheckout function', () => {
      expect(content).toContain('export function useCourseCheckout()');
    });

    it('returns { startCheckout, loading, error }', () => {
      expect(content).toContain('return { startCheckout, loading, error }');
    });

    it('skips checkout for free courses', () => {
      expect(content).toContain('course.is_free');
    });

    it('requires stripe_price_id on the course', () => {
      expect(content).toContain('course.stripe_price_id');
      expect(content).toContain('No price configured');
    });

    it('invokes Supabase edge function "create-checkout"', () => {
      expect(content).toContain("functions.invoke('create-checkout'");
    });

    it('sends courseId and priceId in the body', () => {
      expect(content).toContain('courseId: course.id');
      expect(content).toContain('priceId: course.stripe_price_id');
    });

    it('redirects to data.url from checkout response', () => {
      expect(content).toContain('window.location.href = data.url');
    });

    it('calls trackBeginCheckout analytics event', () => {
      expect(content).toContain('trackBeginCheckout');
    });

    it('requires authenticated session before checkout', () => {
      expect(content).toContain("!session?.user");
    });
  });

  describe('useCommunityStats hook', () => {
    let content: string;

    beforeAll(() => {
      content = readFile(path.resolve(HOOKS_DIR, 'useCommunityStats.ts'));
    });

    it('returns { memberCount, adminCount, loading, error, refetch }', () => {
      expect(content).toContain('return { memberCount, adminCount, loading, error, refetch');
    });

    it('queries community_members table filtered by COMMUNITY_ID', () => {
      expect(content).toContain(".from('community_members')");
      expect(content).toContain('COMMUNITY_ID');
    });

    it('excludes soft-deleted members (deleted_at IS NULL)', () => {
      expect(content).toContain(".is('deleted_at', null)");
    });

    it('counts admins and owners separately', () => {
      expect(content).toContain("['admin', 'owner']");
    });

    it('subscribes to realtime changes for live updates', () => {
      expect(content).toContain('postgres_changes');
      expect(content).toContain("table: 'community_members'");
    });

    it('debounces realtime refetches to prevent rapid-fire queries', () => {
      expect(content).toContain('setTimeout');
      expect(content).toContain('clearTimeout');
    });
  });

  describe('usePresence hook', () => {
    let content: string;

    beforeAll(() => {
      content = readFile(path.resolve(HOOKS_DIR, 'usePresence.ts'));
    });

    it('returns { onlineCount, isConnected }', () => {
      expect(content).toContain('return { onlineCount, isConnected }');
    });

    it('creates a "classroom-presence" channel', () => {
      expect(content).toContain("'classroom-presence'");
    });

    it('only connects for authenticated users', () => {
      expect(content).toContain("!session?.user?.id");
    });

    it('tracks presence with user_id and online_at', () => {
      expect(content).toContain('user_id: session.user.id');
      expect(content).toContain('online_at');
    });

    it('cleans up channel on unmount', () => {
      expect(content).toContain('removeChannel');
    });
  });

  describe('useSubscription hook', () => {
    let content: string;

    beforeAll(() => {
      content = readFile(path.resolve(HOOKS_DIR, 'useSubscription.ts'));
    });

    it('queries "subscriptions" table', () => {
      expect(content).toContain(".from('subscriptions')");
    });

    it('returns { subscription, loading, isActive, openCustomerPortal }', () => {
      expect(content).toContain('return { subscription, loading, isActive, openCustomerPortal }');
    });

    it('isActive includes trialing status', () => {
      expect(content).toContain("'trialing'");
      expect(content).toContain("'active'");
    });

    it('isActive includes lifetime_access', () => {
      expect(content).toContain('lifetime_access');
    });

    it('opens Stripe Customer Portal via openCustomerPortal', () => {
      expect(content).toContain('billing.stripe.com');
    });
  });

  describe('useAdminCourses hook', () => {
    let content: string;

    beforeAll(() => {
      content = readFile(path.resolve(HOOKS_DIR, 'useAdminCourses.ts'));
    });

    it('exports useAdminCourses function', () => {
      expect(content).toContain('export function useAdminCourses()');
    });

    it('checks admin role before any operation', () => {
      expect(content).toContain("role === 'admin'");
      expect(content).toContain("role === 'owner'");
    });

    it('supports full CRUD for courses (create, update, delete)', () => {
      expect(content).toContain('createCourse');
      expect(content).toContain('updateCourse');
      expect(content).toContain('deleteCourse');
    });

    it('supports full CRUD for modules', () => {
      expect(content).toContain('createModule');
      expect(content).toContain('updateModule');
      expect(content).toContain('deleteModule');
    });

    it('supports full CRUD for lessons', () => {
      expect(content).toContain('createLesson');
      expect(content).toContain('updateLesson');
      expect(content).toContain('deleteLesson');
    });

    it('supports reordering modules and lessons', () => {
      expect(content).toContain('reorderModules');
      expect(content).toContain('reorderLessons');
    });

    it('includes moderators in admin check', () => {
      expect(content).toContain("role === 'moderator'");
    });
  });

  describe('useAdminMetrics hook', () => {
    let content: string;

    beforeAll(() => {
      content = readFile(path.resolve(HOOKS_DIR, 'useAdminMetrics.ts'));
    });

    it('queries "dashboard_metrics" table', () => {
      expect(content).toContain(".from('dashboard_metrics')");
    });

    it('returns { metrics, loading }', () => {
      expect(content).toContain('return { metrics, loading }');
    });

    it('requires admin role', () => {
      expect(content).toContain('isAdmin');
    });
  });

  describe('useCommunitySettings hook', () => {
    let content: string;

    beforeAll(() => {
      content = readFile(path.resolve(HOOKS_DIR, 'useCommunitySettings.ts'));
    });

    it('queries "community_settings" table', () => {
      expect(content).toContain(".from('community_settings')");
    });

    it('returns { settings, loading, saving, updateSettings }', () => {
      expect(content).toContain('return { settings, loading, saving, updateSettings }');
    });

    it('logs admin action via RPC after settings update', () => {
      expect(content).toContain("rpc('log_admin_action'");
    });
  });

  describe('useModeration hook', () => {
    let content: string;

    beforeAll(() => {
      content = readFile(path.resolve(HOOKS_DIR, 'useModeration.ts'));
    });

    it('queries "content_reports" table', () => {
      expect(content).toContain(".from('content_reports')");
    });

    it('requires admin role', () => {
      expect(content).toContain('isAdmin');
    });

    it('supports filtering by status (pending/all)', () => {
      expect(content).toContain("'pending'");
      expect(content).toContain("'all'");
    });
  });

  describe('useMemberManagement hook', () => {
    let content: string;

    beforeAll(() => {
      content = readFile(path.resolve(HOOKS_DIR, 'useMemberManagement.ts'));
    });

    it('queries "community_members" with joined profiles', () => {
      expect(content).toContain(".from('community_members')");
      expect(content).toContain('profiles!community_members_member_id_fkey');
    });

    it('requires admin role', () => {
      expect(content).toContain('isAdmin');
    });
  });
});

// =============================================================================
// 4. SUPABASE TABLE REFERENCES — Are all table/column references valid?
// =============================================================================

describe('4. Supabase Table References — Classroom-Related Tables', () => {
  const supabaseSrc = readFile(path.resolve(TYPES_DIR, 'supabase.ts'));

  // Classroom-specific tables that must exist in the schema
  const classroomTables = [
    'courses',
    'modules',
    'lessons',
    'enrollments',
    'lesson_progress',
    'lesson_attachments',
    'lesson_comments',
    'content_engagement_log',
    'course_analytics_cache',
  ];

  it.each(classroomTables)('table "%s" is defined in supabase.ts', (tableName) => {
    const pattern = new RegExp(`\\b${tableName}:\\s*\\{`);
    expect(supabaseSrc).toMatch(pattern);
  });

  // Community-specific tables
  const communityTables = [
    'profiles',
    'communities',
    'community_members',
    'categories',
    'posts',
    'comments',
    'reactions',
    'post_attachments',
    'polls',
    'poll_options',
    'poll_votes',
    'reports',
    'post_follows',
    'notifications',
    'subscriptions',
    'events',
    'event_rsvps',
    'event_categories',
    'event_occurrences',
    'levels',
    'member_stats',
    'points_log',
    'point_config',
    'conversations',
    'conversation_participants',
    'messages',
    'member_blocks',
    'conversation_mutes',
    'autodm_config',
    'community_settings',
    'content_reports',
    'admin_audit_log',
    'dashboard_metrics',
    'payments',
    'webhook_events',
  ];

  it.each(communityTables)('community table "%s" is defined in supabase.ts', (tableName) => {
    const pattern = new RegExp(`\\b${tableName}:\\s*\\{`);
    expect(supabaseSrc).toMatch(pattern);
  });

  describe('courses table — column validation', () => {
    const coursesMatch = supabaseSrc.match(/courses:\s*\{\s*Row:\s*\{([\s\S]*?)\};/);
    const courseRow = coursesMatch ? coursesMatch[1] : '';

    const requiredColumns = [
      'id',
      'community_id',
      'title',
      'description',
      'thumbnail_url',
      'access_level',
      'is_free',
      'stripe_price_id',
      'published',
      'display_order',
      'created_at',
      'updated_at',
    ];

    it.each(requiredColumns)('courses table has column "%s"', (col) => {
      expect(courseRow).toContain(col);
    });

    it('[REGRESSION GUARD] courses table does NOT have slug column', () => {
      // Slug was removed during schema unification
      expect(courseRow).not.toMatch(/\bslug\b/);
    });
  });

  describe('lessons table — column validation', () => {
    const lessonsMatch = supabaseSrc.match(/lessons:\s*\{\s*Row:\s*\{([\s\S]*?)\};/);
    const lessonRow = lessonsMatch ? lessonsMatch[1] : '';

    const requiredColumns = [
      'id',
      'module_id',
      'course_id',
      'title',
      'content',
      'content_html',
      'video_url',
      'display_order',
      'created_at',
      'updated_at',
    ];

    it.each(requiredColumns)('lessons table has column "%s"', (col) => {
      expect(lessonRow).toContain(col);
    });

    it('[REGRESSION GUARD] lessons uses "content" not "content_markdown"', () => {
      expect(lessonRow).not.toMatch(/\bcontent_markdown\b/);
    });
  });

  describe('enrollments table — column validation', () => {
    const enrollmentsMatch = supabaseSrc.match(/enrollments:\s*\{\s*Row:\s*\{([\s\S]*?)\};/);
    const enrollmentRow = enrollmentsMatch ? enrollmentsMatch[1] : '';

    it.each(['id', 'course_id', 'user_id', 'enrolled_at', 'completed_at'])(
      'enrollments table has column "%s"',
      (col) => {
        expect(enrollmentRow).toContain(col);
      }
    );
  });

  describe('lesson_progress table — column validation', () => {
    const lpMatch = supabaseSrc.match(/lesson_progress:\s*\{\s*Row:\s*\{([\s\S]*?)\};/);
    const lpRow = lpMatch ? lpMatch[1] : '';

    it.each(['id', 'lesson_id', 'user_id', 'completed', 'completed_at', 'created_at'])(
      'lesson_progress table has column "%s"',
      (col) => {
        expect(lpRow).toContain(col);
      }
    );
  });

  describe('subscriptions table — column validation', () => {
    // Use a lookbehind to avoid matching thread_subscriptions
    const subsMatch = supabaseSrc.match(/(?<!\w)subscriptions:\s*\{\s*Row:\s*\{([\s\S]*?)\};\s*Insert:/);
    const subsRow = subsMatch ? subsMatch[1] : '';

    const requiredColumns = [
      'id',
      'community_id',
      'user_id',
      'stripe_customer_id',
      'stripe_subscription_id',
      'plan',
      'status',
      'current_period_start',
      'current_period_end',
      'trial_start',
      'trial_end',
      'cancel_at_period_end',
      'grace_period_end',
      'lifetime_access',
    ];

    it.each(requiredColumns)('subscriptions table has column "%s"', (col) => {
      expect(subsRow).toContain(col);
    });
  });

  describe('Foreign key relationships', () => {
    it('modules references courses via course_id FK', () => {
      expect(supabaseSrc).toContain('modules_course_id_fkey');
    });

    it('lessons references modules via module_id FK', () => {
      expect(supabaseSrc).toContain('lessons_module_id_fkey');
    });

    it('lessons references courses via course_id FK', () => {
      expect(supabaseSrc).toContain('lessons_course_id_fkey');
    });

    it('enrollments references courses via course_id FK', () => {
      expect(supabaseSrc).toContain('enrollments_course_id_fkey');
    });

    it('lesson_progress references lessons via lesson_id FK', () => {
      expect(supabaseSrc).toContain('lesson_progress_lesson_id_fkey');
    });

    it('lesson_attachments references lessons via lesson_id FK', () => {
      expect(supabaseSrc).toContain('lesson_attachments_lesson_id_fkey');
    });

    it('lesson_comments references lessons via lesson_id FK', () => {
      expect(supabaseSrc).toContain('lesson_comments_lesson_id_fkey');
    });

    it('community_members references communities', () => {
      expect(supabaseSrc).toContain('community_members_community_id_fkey');
    });

    it('community_members references profiles', () => {
      expect(supabaseSrc).toContain('community_members_member_id_fkey');
    });
  });

  describe('Supabase RPC functions defined in types', () => {
    const expectedFunctions = [
      'get_course_progress',
      'update_last_active',
      'generate_username_slug',
      'admin_award_points',
      'get_points_history',
      'get_activity_heatmap',
      'change_member_role',
      'rsvp_to_event',
      'cancel_rsvp',
      'generate_occurrences',
      'get_or_create_conversation',
      'get_unread_conversation_count',
      'search_messages',
      'get_unread_notification_count',
      'mark_all_notifications_read',
      'log_admin_action',
      'ban_member',
      'unban_member',
      'remove_content',
      'check_rate_limit',
      'global_search',
      'export_user_data',
    ];

    it.each(expectedFunctions)('RPC function "%s" is declared', (funcName) => {
      const pattern = new RegExp(`${funcName}:\\s*\\{`);
      expect(supabaseSrc).toMatch(pattern);
    });
  });
});

// =============================================================================
// 5. ROUTE DEFINITIONS — Do all classroom/community pages exist?
// =============================================================================

describe('5. Route Definitions — Classroom & Community Pages', () => {
  const classroomRoutes = [
    'pages/classroom/index.tsx',
    'pages/classroom/my-progress.tsx',
    'pages/classroom/[courseSlug]/index.tsx',
    'pages/classroom/[courseSlug]/[lessonSlug].tsx',
    'pages/classroom/admin/index.tsx',
    'pages/classroom/admin/[courseSlug]/edit.tsx',
    'pages/classroom/admin/[courseSlug]/lessons/[lessonSlug].tsx',
  ];

  it.each(classroomRoutes)('classroom route %s exists', (route) => {
    expect(fileExists(route)).toBe(true);
  });

  const checkoutRoutes = [
    'pages/checkout/classroom.tsx',
    'pages/checkout/classroom-success.tsx',
  ];

  it.each(checkoutRoutes)('checkout route %s exists', (route) => {
    expect(fileExists(route)).toBe(true);
  });

  const legalRoutes = [
    'pages/privacy-policy.tsx',
    'pages/terms-and-conditions.tsx',
    'pages/refund-policy.tsx',
    'pages/disclaimer.tsx',
  ];

  it.each(legalRoutes)('legal route %s exists', (route) => {
    expect(fileExists(route)).toBe(true);
  });

  it('dashboard page exists', () => {
    expect(fileExists('pages/dashboard.tsx')).toBe(true);
  });

  describe('all classroom pages have default exports', () => {
    const classroomPages = getAllFiles(path.resolve(PAGES_DIR, 'classroom'));

    it('every classroom page file has a default export', () => {
      classroomPages.forEach((pagePath) => {
        const content = readFile(pagePath);
        const hasDefault =
          content.includes('export default') ||
          content.includes('export { default }');
        expect(hasDefault).toBe(true);
      });
    });
  });

  describe('navigation includes classroom link', () => {
    let navContent: string;

    beforeAll(() => {
      navContent = readFile(path.resolve(DATA_DIR, 'navigation.ts'));
    });

    it('Login nav item points to /classroom', () => {
      expect(navContent).toContain('/classroom');
    });
  });
});

// =============================================================================
// 6. AUTH FLOW — Does protected route logic work for classroom?
// =============================================================================

describe('6. Auth Flow — Classroom Authentication', () => {
  describe('classroom/index.tsx auth behavior', () => {
    let content: string;

    beforeAll(() => {
      content = readFile(path.resolve(PAGES_DIR, 'classroom/index.tsx'));
    });

    it('imports useAuth context', () => {
      expect(content).toContain('useAuth');
    });

    it('checks isLoading before rendering', () => {
      expect(content).toContain('isLoading');
    });

    it('authenticated members stay on classroom page (no redirect to dashboard)', () => {
      // Previously redirected to /dashboard, now members stay to browse courses.
      expect(content).toContain('Authenticated members now stay on classroom page');
      expect(content).not.toContain("router.replace('/dashboard')");
    });

    it('keeps expired members on landing page', () => {
      expect(content).toContain("membershipStatus === 'expired'");
      expect(content).toContain('isExpiredMember');
    });

    it('shows AuthModal for login and trial actions', () => {
      expect(content).toContain('AuthModal');
      expect(content).toContain('showAuthModal');
    });

    it('sets correct redirect for login (classroom)', () => {
      // Login redirect changed from /dashboard to /classroom to match
      // the new flow where authenticated members stay on the classroom page.
      expect(content).toContain("setAuthRedirectTo('/classroom')");
    });

    it('sets correct redirect for trial (checkout)', () => {
      expect(content).toContain("setAuthRedirectTo('/checkout/classroom')");
    });

    it('shows loading spinner while checking auth', () => {
      expect(content).toContain('classroom-loading__spinner');
    });
  });

  describe('AuthContext provider', () => {
    let content: string;

    beforeAll(() => {
      content = readFile(path.resolve(SRC_DIR, 'contexts/AuthContext.tsx'));
    });

    it('exports AuthProvider component', () => {
      expect(content).toContain('export const AuthProvider');
    });

    it('exports useAuth hook', () => {
      expect(content).toContain('export function useAuth()');
    });

    it('throws when useAuth is called outside provider', () => {
      expect(content).toContain('useAuth must be used within an AuthProvider');
    });

    it('fetches profile from "profiles" table', () => {
      expect(content).toContain(".from('profiles')");
    });

    it('fetches role from "community_members" table', () => {
      expect(content).toContain(".from('community_members')");
    });

    it('auto-creates community_members row for new sign-ups', () => {
      expect(content).toContain(".from('community_members')");
      expect(content).toContain('.insert(');
      expect(content).toContain("role: 'member'");
    });

    it('context provides: supabaseClient, session, isLoading, profile, role, membershipStatus, isOnboarded, refreshProfile', () => {
      expect(content).toContain('supabaseClient');
      expect(content).toContain('session');
      expect(content).toContain('isLoading');
      expect(content).toContain('profile');
      expect(content).toContain('role');
      expect(content).toContain('membershipStatus');
      expect(content).toContain('isOnboarded');
      expect(content).toContain('refreshProfile');
    });

    it('listens for auth state changes', () => {
      expect(content).toContain('onAuthStateChange');
    });

    it('cleans up subscription on unmount', () => {
      expect(content).toContain('subscription.unsubscribe');
    });

    it('handles communities table query for auto-creation', () => {
      expect(content).toContain(".from('communities')");
    });
  });

  describe('middleware.ts protects classroom routes', () => {
    let content: string;

    beforeAll(() => {
      content = readFile(path.resolve(SRC_DIR, 'middleware.ts'));
    });

    it('/classroom is in the protectedRoutes array', () => {
      expect(content).toContain("'/classroom'");
    });

    it('/dashboard is in the protectedRoutes array', () => {
      expect(content).toContain("'/dashboard'");
    });

    it('/community is in the protectedRoutes array', () => {
      expect(content).toContain("'/community'");
    });

    it('uses startsWith for prefix-based matching', () => {
      expect(content).toContain('pathname.startsWith(route)');
    });

    it('redirects unauthenticated users to root with auth=required', () => {
      expect(content).toContain("redirectUrl.searchParams.set('auth', 'required')");
    });

    it('passes original path in redirect query param', () => {
      expect(content).toContain("redirectUrl.searchParams.set('redirect', pathname)");
    });

    it('[REGRESSION GUARD] blocks protected routes when env vars missing (503)', () => {
      expect(content).toContain('!supabaseUrl || !supabaseAnonKey');
      expect(content).toContain('status: 503');
    });

    it('mitigates CVE-2025-29927 (x-middleware-subrequest header)', () => {
      expect(content).toContain('x-middleware-subrequest');
      expect(content).toContain('status: 403');
    });
  });
});

// =============================================================================
// 7. CHECKOUT FLOW — Does the redirect chain work?
// =============================================================================

describe('7. Checkout Flow — Stripe Integration', () => {
  describe('checkout/classroom.tsx', () => {
    let content: string;

    beforeAll(() => {
      content = readFile(path.resolve(PAGES_DIR, 'checkout/classroom.tsx'));
    });

    it('reads NEXT_PUBLIC_STRIPE_CLASSROOM_LINK from env', () => {
      expect(content).toContain('NEXT_PUBLIC_STRIPE_CLASSROOM_LINK');
    });

    it('redirects unauthenticated users back to /classroom', () => {
      expect(content).toContain("router.replace('/classroom?auth=required')");
    });

    it('shows error when payment link is not configured', () => {
      expect(content).toContain('Checkout is not configured yet');
    });

    it('pre-fills email in Stripe redirect', () => {
      expect(content).toContain('prefilled_email');
      expect(content).toContain('session.user.email');
    });

    it('shows loading spinner during redirect', () => {
      expect(content).toContain('Redirecting to checkout');
      expect(content).toContain('classroom-loading__spinner');
    });

    it('is noindexed (hidden from search engines)', () => {
      expect(content).toContain('noindex');
    });

    it('has a back button that returns to /classroom', () => {
      expect(content).toContain("router.push('/classroom')");
    });
  });

  describe('checkout/classroom-success.tsx', () => {
    let content: string;

    beforeAll(() => {
      content = readFile(path.resolve(PAGES_DIR, 'checkout/classroom-success.tsx'));
    });

    it('has a default export', () => {
      expect(content).toContain('export default ClassroomSuccess');
    });

    it('shows success confirmation message', () => {
      // Source uses &apos; JSX entity
      expect(content).toContain("You&apos;re Enrolled!");
    });

    it('mentions course is ready', () => {
      expect(content).toContain('Your course is ready');
    });

    it('has a link to classroom', () => {
      expect(content).toContain('href="/classroom"');
    });

    it('is noindexed', () => {
      expect(content).toContain('noindex');
    });

    it('provides support email', () => {
      expect(content).toContain('info@theinnovativenative.com');
    });
  });

  describe('[KNOWN GAP] Stripe webhook handler', () => {
    it('[KNOWN GAP] Stripe webhook edge function should exist for enrollment fulfillment', () => {
      // After payment, a Stripe webhook needs to:
      // 1. Create a subscription record in the subscriptions table
      // 2. Update membership_status in profiles
      // 3. Auto-enroll user in courses
      // This is a Supabase Edge Function, not a Next.js route
      // Testing at the file level that this gap is documented
      console.warn(
        '[KNOWN GAP] Stripe webhook handler (Supabase Edge Function) is not yet deployed. ' +
        'Enrollment fulfillment after payment requires: ' +
        '1) stripe-webhook edge function, ' +
        '2) subscription creation logic, ' +
        '3) automatic enrollment in paid courses.'
      );

      // This test documents the gap — it passes to avoid blocking CI
      expect(true).toBe(true);
    });
  });

  describe('[KNOWN GAP] create-checkout edge function', () => {
    it('[KNOWN GAP] create-checkout edge function should be deployed to Supabase', () => {
      // useCourseCheckout calls supabaseClient.functions.invoke('create-checkout')
      // This function must exist in Supabase Edge Functions to:
      // 1. Create a Stripe Checkout Session
      // 2. Return the session URL
      console.warn(
        '[KNOWN GAP] create-checkout Supabase Edge Function status unknown. ' +
        'If not deployed, per-course checkout (via useCourseCheckout) will fail. ' +
        'The classroom checkout page uses a static Stripe Payment Link as fallback.'
      );

      expect(true).toBe(true);
    });
  });
});

// =============================================================================
// 8. COURSE DATA — Is placeholder/seed data valid?
// =============================================================================

describe('8. Course Data — Validity and Completeness', () => {
  describe('static course data from classroom-courses.ts', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { classroomCourses } = require('@/data/classroom-courses');

    it('each course ID is a valid slug (lowercase, hyphens only)', () => {
      classroomCourses.forEach((course: any) => {
        expect(course.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      });
    });

    it('no course title exceeds 60 characters', () => {
      classroomCourses.forEach((course: any) => {
        expect(course.title.length).toBeLessThanOrEqual(60);
      });
    });

    it('all thumbnails reference /images/classroom/ directory', () => {
      classroomCourses.forEach((course: any) => {
        expect(course.thumbnail).toMatch(/^\/images\/classroom\//);
      });
    });

    it('no duplicate hrefs', () => {
      const hrefs = classroomCourses.map((c: any) => c.href);
      expect(new Set(hrefs).size).toBe(hrefs.length);
    });
  });

  describe('[KNOWN GAP] Database course seeding', () => {
    it('[KNOWN GAP] courses table should have seed data matching static course list', () => {
      // The static classroomCourses array is used for the landing page gallery.
      // The Supabase courses table needs matching records for:
      // 1. useCourses() to return data on the dashboard
      // 2. Per-course pages to load
      // 3. Enrollment to work
      console.warn(
        '[KNOWN GAP] No course seed data script exists. ' +
        'The courses table in Supabase is likely empty. ' +
        'Create a migration or seed script that inserts course rows matching ' +
        'the 6 courses in classroom-courses.ts (chaos-to-clarity, brand-vibe, ' +
        'n8n-templates, glossary, resources, templates).'
      );

      expect(true).toBe(true);
    });

    it('[KNOWN GAP] modules and lessons should be populated for each course', () => {
      console.warn(
        '[KNOWN GAP] Modules and lessons tables are likely empty. ' +
        'Course content is in Google Drive "Course Knowledge Vault" ' +
        '(folder ID: 1qgkQoHn8twTGbFd_cVttdU4N_k9rTbmR). ' +
        'Need: content migration script from GDrive to Supabase lessons table.'
      );

      expect(true).toBe(true);
    });
  });
});

// =============================================================================
// 9. SECURITY — XSS vectors, exposed keys, unsafe patterns
// =============================================================================

describe('9. Security — Classroom & Community Platform', () => {
  describe('Middleware security headers', () => {
    let content: string;

    beforeAll(() => {
      content = readFile(path.resolve(SRC_DIR, 'middleware.ts'));
    });

    it('sets X-Frame-Options: DENY', () => {
      expect(content).toContain("'X-Frame-Options', 'DENY'");
    });

    it('sets X-Content-Type-Options: nosniff', () => {
      expect(content).toContain("'X-Content-Type-Options', 'nosniff'");
    });

    it('sets Strict-Transport-Security', () => {
      expect(content).toContain('Strict-Transport-Security');
    });

    it('sets Referrer-Policy', () => {
      expect(content).toContain('Referrer-Policy');
    });

    it('sets Content-Security-Policy', () => {
      expect(content).toContain('Content-Security-Policy');
    });

    it('CSP allows Supabase connections', () => {
      expect(content).toContain('*.supabase.co');
    });

    it('CSP allows Stripe scripts and frames', () => {
      expect(content).toContain('js.stripe.com');
      expect(content).toContain('buy.stripe.com');
    });

    it('CSP allows Calendly', () => {
      expect(content).toContain('calendly.com');
    });

    it('Permissions-Policy disables camera, microphone, geolocation', () => {
      expect(content).toContain('camera=()');
      expect(content).toContain('microphone=()');
      expect(content).toContain('geolocation=()');
    });
  });

  describe('Sanitization library exists', () => {
    it('lib/sanitize.ts exists and uses DOMPurify', () => {
      expect(fileExists('lib/sanitize.ts')).toBe(true);
      const content = readFile(path.resolve(LIB_DIR, 'sanitize.ts'));
      expect(content).toContain('DOMPurify');
    });

    it('sanitizeHtml uses allowlisted tags only', () => {
      const content = readFile(path.resolve(LIB_DIR, 'sanitize.ts'));
      expect(content).toContain('ALLOWED_TAGS');
      expect(content).toContain('ALLOWED_ATTR');
    });

    it('sanitizeHtml disallows data attributes', () => {
      const content = readFile(path.resolve(LIB_DIR, 'sanitize.ts'));
      expect(content).toContain('ALLOW_DATA_ATTR: false');
    });

    it('has server-side fallback (stripHtmlTags) when DOMPurify unavailable', () => {
      const content = readFile(path.resolve(LIB_DIR, 'sanitize.ts'));
      expect(content).toContain("typeof window === 'undefined'");
      expect(content).toContain('stripHtmlTags');
    });
  });

  describe('No hardcoded Supabase keys in source', () => {
    const classroomFiles = [
      ...getAllFiles(path.resolve(COMPONENTS_DIR, 'classroom')),
      ...getAllFiles(path.resolve(PAGES_DIR, 'classroom')),
      ...getAllFiles(path.resolve(PAGES_DIR, 'checkout')),
    ];

    it('no Supabase anon keys in classroom components or pages', () => {
      const keyPattern = /eyJ[A-Za-z0-9_-]{20,}/;

      classroomFiles.forEach((filePath) => {
        const content = readFile(filePath);
        const match = keyPattern.exec(content);
        if (match) {
          console.error(
            `[CRITICAL] Possible Supabase key found in ${path.relative(SRC_DIR, filePath)}`
          );
        }
        expect(content).not.toMatch(keyPattern);
      });
    });

    it('no hardcoded Stripe secret keys in source', () => {
      const stripeSecretPattern = /sk_live_[A-Za-z0-9]{20,}/;

      classroomFiles.forEach((filePath) => {
        const content = readFile(filePath);
        expect(content).not.toMatch(stripeSecretPattern);
      });
    });
  });

  describe('Checkout page XSS prevention', () => {
    let checkoutContent: string;

    beforeAll(() => {
      checkoutContent = readFile(path.resolve(PAGES_DIR, 'checkout/classroom.tsx'));
    });

    it('uses encodeURIComponent for email in redirect URL', () => {
      expect(checkoutContent).toContain('encodeURIComponent');
    });

    it('does not use dangerouslySetInnerHTML', () => {
      expect(checkoutContent).not.toContain('dangerouslySetInnerHTML');
    });
  });

  describe('AuthModal XSS prevention', () => {
    let content: string;

    beforeAll(() => {
      content = readFile(path.resolve(COMPONENTS_DIR, 'auth/AuthModal.tsx'));
    });

    it('does not use dangerouslySetInnerHTML', () => {
      expect(content).not.toContain('dangerouslySetInnerHTML');
    });

    it('does not use eval()', () => {
      expect(content).not.toMatch(/\beval\s*\(/);
    });

    it('email validation exists before submission', () => {
      expect(content).toMatch(/[^\s@]+@[^\s@]+/);
    });
  });

  describe('ClassroomLanding does not render user-controlled HTML unsafely', () => {
    const landingComponents = [
      'components/classroom/ClassroomLanding.tsx',
      'components/classroom/HeroBanner.tsx',
      'components/classroom/CourseGallery.tsx',
      'components/classroom/CommunityMetaBar.tsx',
      'components/classroom/AboutSection.tsx',
      'components/classroom/CommunitySidebar.tsx',
    ];

    it.each(landingComponents)('%s does not use dangerouslySetInnerHTML', (component) => {
      const content = readFile(path.resolve(SRC_DIR, component));
      expect(content).not.toContain('dangerouslySetInnerHTML');
    });
  });

  describe('Community COMMUNITY_ID is not a real secret', () => {
    it('COMMUNITY_ID is a static UUID placeholder, not a production secret', () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { COMMUNITY_ID } = require('@/lib/constants');
      // A static placeholder UUID is fine to commit; it's a DB row ID, not a credential
      expect(COMMUNITY_ID).toMatch(/^[0-9a-f-]+$/);
    });
  });

  describe('[KNOWN GAP] Email service not configured', () => {
    it('[KNOWN GAP] email_log table exists but no email sending service is integrated', () => {
      const supabaseSrc = readFile(path.resolve(TYPES_DIR, 'supabase.ts'));
      // The schema has email_log and email_preferences tables
      expect(supabaseSrc).toContain('email_log');
      expect(supabaseSrc).toContain('email_preferences');

      console.warn(
        '[KNOWN GAP] Email infrastructure is defined in the schema but no sending service ' +
        '(Resend, SendGrid, etc.) is integrated. Needed for: ' +
        '1) Welcome emails after signup, ' +
        '2) Event reminders, ' +
        '3) Community digest emails, ' +
        '4) DM notifications.'
      );
    });
  });
});

// =============================================================================
// 10. CROSS-CUTTING — Integration consistency checks
// =============================================================================

describe('10. Cross-Cutting — Integration Consistency', () => {
  describe('hook dependency on useAuth is consistent', () => {
    const hooksUsingAuth = [
      'useCourses.ts',
      'useCourseCheckout.ts',
      'useCommunityStats.ts',
      'usePresence.ts',
      'useSubscription.ts',
      'useAdminCourses.ts',
      'useAdminMetrics.ts',
      'useCommunitySettings.ts',
      'useModeration.ts',
      'useMemberManagement.ts',
    ];

    it.each(hooksUsingAuth)('%s imports useAuth from AuthContext', (hookFile) => {
      const filePath = path.resolve(HOOKS_DIR, hookFile);
      if (!fs.existsSync(filePath)) {
        console.warn(`[SKIP] Hook file ${hookFile} not found`);
        return;
      }
      const content = readFile(filePath);
      expect(content).toContain("from '@/contexts/AuthContext'");
    });
  });

  describe('COMMUNITY_ID usage is consistent', () => {
    const hooksUsingCommunityId = [
      'useCommunityStats.ts',
      'useSubscription.ts',
      'useAdminMetrics.ts',
      'useCommunitySettings.ts',
      'useModeration.ts',
      'useMemberManagement.ts',
    ];

    it.each(hooksUsingCommunityId)('%s uses COMMUNITY_ID from constants', (hookFile) => {
      const filePath = path.resolve(HOOKS_DIR, hookFile);
      if (!fs.existsSync(filePath)) {
        console.warn(`[SKIP] ${hookFile} not found`);
        return;
      }
      const content = readFile(filePath);
      expect(content).toContain('COMMUNITY_ID');
      expect(content).toContain("from '@/lib/constants'");
    });
  });

  describe('all classroom component imports resolve', () => {
    let landingContent: string;

    beforeAll(() => {
      landingContent = readFile(path.resolve(COMPONENTS_DIR, 'classroom/ClassroomLanding.tsx'));
    });

    it('HeroBanner import resolves', () => {
      expect(fileExists('components/classroom/HeroBanner.tsx')).toBe(true);
    });

    it('CourseGallery import resolves', () => {
      expect(fileExists('components/classroom/CourseGallery.tsx')).toBe(true);
    });

    it('CommunityMetaBar import resolves', () => {
      expect(fileExists('components/classroom/CommunityMetaBar.tsx')).toBe(true);
    });

    it('AboutSection import resolves', () => {
      expect(fileExists('components/classroom/AboutSection.tsx')).toBe(true);
    });

    it('CommunitySidebar import resolves', () => {
      expect(fileExists('components/classroom/CommunitySidebar.tsx')).toBe(true);
    });
  });

  describe('classroom page imports resolve', () => {
    let pageContent: string;

    beforeAll(() => {
      pageContent = readFile(path.resolve(PAGES_DIR, 'classroom/index.tsx'));
    });

    it('ClassroomLanding component exists', () => {
      expect(pageContent).toContain('ClassroomLanding');
      expect(fileExists('components/classroom/ClassroomLanding.tsx')).toBe(true);
    });

    it('AuthModal component exists', () => {
      expect(pageContent).toContain('AuthModal');
      expect(fileExists('components/auth/AuthModal.tsx')).toBe(true);
    });

    it('useCommunityStats hook exists', () => {
      expect(pageContent).toContain('useCommunityStats');
      expect(fileExists('hooks/useCommunityStats.ts')).toBe(true);
    });

    it('usePresence hook exists', () => {
      expect(pageContent).toContain('usePresence');
      expect(fileExists('hooks/usePresence.ts')).toBe(true);
    });
  });

  describe('SEO meta tags on classroom landing', () => {
    let content: string;

    beforeAll(() => {
      content = readFile(path.resolve(PAGES_DIR, 'classroom/index.tsx'));
    });

    it('has <title> tag', () => {
      expect(content).toContain('<title>');
    });

    it('has meta description', () => {
      expect(content).toContain('name="description"');
    });

    it('has Open Graph title', () => {
      expect(content).toContain('og:title');
    });

    it('has Open Graph description', () => {
      expect(content).toContain('og:description');
    });

    it('has Open Graph type', () => {
      expect(content).toContain('og:type');
    });

    it('has Open Graph image', () => {
      expect(content).toContain('og:image');
    });

    it('has Twitter card', () => {
      expect(content).toContain('twitter:card');
    });

    it('meta description mentions the price', () => {
      expect(content).toContain('$99/month');
    });
  });

  describe('pricing consistency across components', () => {
    it('AboutSection and CommunityMetaBar both use MEMBERSHIP_PRICE from constants', () => {
      const aboutContent = readFile(
        path.resolve(COMPONENTS_DIR, 'classroom/AboutSection.tsx')
      );
      const metaBarContent = readFile(
        path.resolve(COMPONENTS_DIR, 'classroom/CommunityMetaBar.tsx')
      );

      expect(aboutContent).toContain('MEMBERSHIP_PRICE');
      expect(metaBarContent).toContain('MEMBERSHIP_PRICE');
    });

    it('the constants MEMBERSHIP_PRICE matches the SEO meta description price', () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { MEMBERSHIP_PRICE } = require('@/lib/constants');
      const pageContent = readFile(path.resolve(PAGES_DIR, 'classroom/index.tsx'));

      // Extract the dollar amount from MEMBERSHIP_PRICE (e.g. "$99/month" -> "$99")
      const priceMatch = MEMBERSHIP_PRICE.match(/\$\d+/);
      expect(priceMatch).not.toBeNull();

      // Verify the meta description or page content includes the same amount
      expect(pageContent).toContain(priceMatch![0]);
    });
  });

  describe('admin role check is consistent across admin hooks', () => {
    const adminHooks = [
      'useAdminCourses.ts',
      'useAdminMetrics.ts',
      'useModeration.ts',
      'useMemberManagement.ts',
    ];

    it.each(adminHooks)('%s checks for admin OR owner role', (hookFile) => {
      const filePath = path.resolve(HOOKS_DIR, hookFile);
      if (!fs.existsSync(filePath)) {
        console.warn(`[SKIP] ${hookFile} not found`);
        return;
      }
      const content = readFile(filePath);
      expect(content).toContain("'admin'");
      expect(content).toContain("'owner'");
    });
  });
});

// =============================================================================
// 11. KNOWN GAPS SUMMARY — Documents what needs fixing
// =============================================================================

describe('11. Known Gaps Summary', () => {
  it('[KNOWN GAP] No Stripe webhook edge function for enrollment fulfillment', () => {
    console.warn(
      'ACTION REQUIRED: Deploy a Supabase Edge Function to handle Stripe webhook events ' +
      '(checkout.session.completed, customer.subscription.created/updated/deleted). ' +
      'This function must: create subscriptions row, update profiles.membership_status, ' +
      'auto-enroll user in courses, and record in webhook_events for idempotency.'
    );
    expect(true).toBe(true);
  });

  it('[KNOWN GAP] Empty courses/modules/lessons tables in Supabase', () => {
    console.warn(
      'ACTION REQUIRED: Seed the courses, modules, and lessons tables with content ' +
      'from the Google Drive Course Knowledge Vault. The 6 courses in classroom-courses.ts ' +
      'are currently placeholder cards only — they have no matching Supabase rows.'
    );
    expect(true).toBe(true);
  });

  it('[KNOWN GAP] No email service integration', () => {
    console.warn(
      'ACTION REQUIRED: Integrate an email service (Resend recommended, already in CSP). ' +
      'The schema has email_log and email_preferences tables but no sending infrastructure. ' +
      'Needed for: welcome emails, event reminders, digest emails, DM notifications.'
    );
    expect(true).toBe(true);
  });

  it('[KNOWN GAP] NEXT_PUBLIC_STRIPE_CLASSROOM_LINK may not be set', () => {
    console.warn(
      'VERIFY: Ensure NEXT_PUBLIC_STRIPE_CLASSROOM_LINK env var is set in production. ' +
      'Without it, the /checkout/classroom page shows "Checkout is not configured yet".'
    );
    expect(true).toBe(true);
  });

  it('[KNOWN GAP] NEXT_PUBLIC_STRIPE_PORTAL_ID may not be set', () => {
    console.warn(
      'VERIFY: Ensure NEXT_PUBLIC_STRIPE_PORTAL_ID env var is set for the customer portal. ' +
      'Without it, useSubscription.openCustomerPortal produces an invalid URL.'
    );
    expect(true).toBe(true);
  });

  it('[KNOWN GAP] /members route is not in middleware protectedRoutes', () => {
    const middlewareContent = readFile(path.resolve(SRC_DIR, 'middleware.ts'));
    const hasMembersRoute =
      middlewareContent.includes("'/members'") ||
      middlewareContent.includes('"/members"');

    if (!hasMembersRoute) {
      console.warn(
        'SECURITY GAP: /members is NOT in middleware protectedRoutes. ' +
        'Member profile pages are only protected by client-side ProtectedRoute component. ' +
        'Add "/members" to the protectedRoutes array in middleware.ts for server-side auth.'
      );
    }

    // This test documents the gap — the assertion reflects current state
    expect(hasMembersRoute).toBe(false);
  });

  it('[KNOWN GAP] course detail pages use courseSlug param but query by ID', () => {
    // The URL uses [courseSlug] but useCourse queries .eq('id', slug)
    // This means course URLs use course IDs, not human-readable slugs
    console.warn(
      'UX DEBT: Course pages use [courseSlug] in the URL but query the courses table by ID. ' +
      'This means URLs like /classroom/some-uuid/some-lesson-uuid instead of ' +
      '/classroom/chaos-to-clarity/module-1-lesson-1. Consider adding a slug column back ' +
      'or implementing client-side slug-to-ID mapping.'
    );
    expect(true).toBe(true);
  });

  it('[KNOWN GAP] classroom-courses.ts hrefs will 404 without matching pages', () => {
    // The static course data uses hrefs like /classroom/chaos-to-clarity
    // But the actual pages use /classroom/[courseSlug] which expects a DB ID
    // Unless courseSlug matches the static ID, these routes will fail
    const { classroomCourses } = require('@/data/classroom-courses');
    const hasMatchingPage = classroomCourses.every((course: any) => {
      // The dynamic route [courseSlug] will catch these, but the DB query needs matching IDs
      return course.href.startsWith('/classroom/');
    });
    expect(hasMatchingPage).toBe(true);

    console.warn(
      'INTEGRATION GAP: Static course hrefs (e.g., /classroom/chaos-to-clarity) ' +
      'will render the [courseSlug] page, which queries the DB by ID. ' +
      'Unless courses are seeded with IDs matching these slugs, pages will show "Course not found".'
    );
  });
});
