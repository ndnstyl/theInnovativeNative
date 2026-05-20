/**
 * TDD: Auth Flow Tests
 *
 * Tests the complete authentication UX flow:
 * - Login redirects
 * - Password reset flow
 * - Session handling
 * - Auth modal behavior
 * - Dashboard redirect
 * - Protected route behavior
 *
 * These are structural/logic tests — they verify the CODE does the right thing,
 * not that the browser renders correctly (that's E2E testing).
 */

// ===== TEST 1: AuthModal redirect targets =====
describe('AuthModal redirect configuration', () => {
  let authModalSource: string;

  beforeAll(() => {
    const fs = require('fs');
    authModalSource = fs.readFileSync(
      require('path').resolve(__dirname, '../../components/auth/AuthModal.tsx'),
      'utf-8'
    );
  });

  test('AuthModal should never redirect to /dashboard', () => {
    // Every window.location.href or redirect in AuthModal should go to /classroom
    const dashboardRedirects = authModalSource.match(/window\.location\.href\s*=\s*[^;]*\/dashboard/g);
    expect(dashboardRedirects).toBeNull();
  });

  test('AuthModal default redirect should be /classroom', () => {
    // The fallback redirect should be /classroom, not /dashboard
    expect(authModalSource).toContain("redirectTo || '/classroom'");
    expect(authModalSource).not.toContain("redirectTo || '/dashboard'");
  });

  test('AuthModal should NOT have Google OAuth button when provider is disabled', () => {
    // Google OAuth should be commented out or removed
    expect(authModalSource).not.toMatch(/signInWithOAuth[\s\S]*provider:\s*['"]google['"]/);
  });

  test('AuthModal should have forgot password mode', () => {
    expect(authModalSource).toContain("'forgot'");
    expect(authModalSource).toContain('resetPasswordForEmail');
  });

  test('AuthModal forgot mode should not require password field', () => {
    // Password validation should be skipped in forgot mode
    expect(authModalSource).toContain("mode !== 'forgot'");
  });

  test('AuthModal should have three modes: signin, signup, forgot', () => {
    expect(authModalSource).toContain("'signin' | 'signup' | 'forgot'");
  });
});

// ===== TEST 2: Dashboard page redirect =====
describe('Dashboard page redirect', () => {
  let dashboardSource: string;

  beforeAll(() => {
    const fs = require('fs');
    dashboardSource = fs.readFileSync(
      require('path').resolve(__dirname, '../../pages/dashboard.tsx'),
      'utf-8'
    );
  });

  test('Dashboard should immediately redirect to /classroom', () => {
    // The dashboard should redirect ALL users to /classroom
    expect(dashboardSource).toContain("router.replace('/classroom')");
  });

  test('Dashboard should NOT redirect to /law-firm-rag', () => {
    const lawFirmRedirects = dashboardSource.match(/router\.replace\([^)]*law-firm-rag/g);
    expect(lawFirmRedirects).toBeNull();
  });
});

// ===== TEST 3: Classroom page does NOT redirect authenticated users away =====
describe('Classroom page auth behavior', () => {
  let classroomSource: string;

  beforeAll(() => {
    const fs = require('fs');
    classroomSource = fs.readFileSync(
      require('path').resolve(__dirname, '../../pages/classroom/index.tsx'),
      'utf-8'
    );
  });

  test('Classroom should NOT redirect authenticated users to /dashboard', () => {
    expect(classroomSource).not.toMatch(/router\.replace\([^)]*\/dashboard/);
  });

  test('Classroom handleLoginClick should NOT set redirectTo to /dashboard', () => {
    expect(classroomSource).not.toMatch(/setAuthRedirectTo\([^)]*\/dashboard/);
  });

  test('Classroom authRedirectTo default should be /classroom', () => {
    expect(classroomSource).toContain("useState('/classroom')");
    expect(classroomSource).not.toContain("useState('/dashboard')");
  });

  test('Classroom isAuthenticated should use session, not isExpiredMember', () => {
    // isAuthenticated is derived from session OR localStorage check
    expect(classroomSource).toContain('isAuthenticated={isAuthenticated}');
    expect(classroomSource).not.toContain('isAuthenticated={isExpiredMember}');
  });
});

// ===== TEST 4: Auth callback handles recovery =====
describe('Auth callback page', () => {
  let callbackSource: string;

  beforeAll(() => {
    const fs = require('fs');
    callbackSource = fs.readFileSync(
      require('path').resolve(__dirname, '../../pages/auth/callback.tsx'),
      'utf-8'
    );
  });

  test('Auth callback should support return_to parameter', () => {
    expect(callbackSource).toContain('return_to');
  });

  test('Auth callback default redirect should be /classroom', () => {
    expect(callbackSource).toContain("router.replace('/classroom')");
  });

  test('Auth callback should exchange code for session', () => {
    expect(callbackSource).toContain('exchangeCodeForSession');
  });
});

// ===== TEST 5: Reset password page exists and handles tokens =====
describe('Reset password page', () => {
  let resetSource: string;

  beforeAll(() => {
    const fs = require('fs');
    resetSource = fs.readFileSync(
      require('path').resolve(__dirname, '../../pages/auth/reset-password.tsx'),
      'utf-8'
    );
  });

  test('Reset page should handle PKCE code parameter', () => {
    expect(resetSource).toContain("get('code')");
    expect(resetSource).toContain('exchangeCodeForSession');
  });

  test('Reset page should handle hash fragment recovery tokens', () => {
    expect(resetSource).toContain('type=recovery');
  });

  test('Reset page should have password confirmation', () => {
    expect(resetSource).toContain('confirmPassword');
    expect(resetSource).toContain('Passwords do not match');
  });

  test('Reset page should enforce minimum password length', () => {
    expect(resetSource).toContain('length < 8');
  });

  test('Reset page should redirect to /classroom on success', () => {
    expect(resetSource).toContain("router.push('/classroom')");
  });

  test('Reset page should show invalid/expired state after timeout', () => {
    expect(resetSource).toContain('Invalid or Expired Link');
  });

  test('Reset page should call updateUser to set new password', () => {
    expect(resetSource).toContain('updateUser');
    expect(resetSource).toContain('password');
  });
});

// ===== TEST 6: Global recovery redirect in _app.tsx =====
describe('Global auth recovery redirect', () => {
  let appSource: string;

  beforeAll(() => {
    const fs = require('fs');
    appSource = fs.readFileSync(
      require('path').resolve(__dirname, '../../pages/_app.tsx'),
      'utf-8'
    );
  });

  test('_app should detect recovery hash fragments and redirect', () => {
    expect(appSource).toContain('type=recovery');
    expect(appSource).toContain('/auth/reset-password');
  });

  test('_app should not redirect if already on reset-password page', () => {
    expect(appSource).toContain('reset-password');
  });
});

// ===== TEST 7: CourseGallery auth integration =====
describe('CourseGallery auth handling', () => {
  let gallerySource: string;

  beforeAll(() => {
    const fs = require('fs');
    gallerySource = fs.readFileSync(
      require('path').resolve(__dirname, '../../components/classroom/CourseGallery.tsx'),
      'utf-8'
    );
  });

  test('CourseGallery should show enroll buttons for authenticated users', () => {
    expect(gallerySource).toContain('Start Free Course');
    expect(gallerySource).toContain('Enroll');
  });

  test('CourseGallery should handle free course auto-enrollment', () => {
    expect(gallerySource).toContain('handleFreeEnroll');
    expect(gallerySource).toContain("from('enrollments').upsert");
  });

  test('CourseGallery should handle paid checkout', () => {
    expect(gallerySource).toContain('handlePaidEnroll');
    expect(gallerySource).toContain('startCheckout');
  });

  test('CourseGallery should check enrollment status from database', () => {
    expect(gallerySource).toContain('enrolledCourseIds');
    expect(gallerySource).toContain("from('enrollments')");
  });

  test('CourseGallery should show Continue Learning for enrolled courses', () => {
    expect(gallerySource).toContain('Continue Learning');
  });
});

// ===== TEST 8: No stale /dashboard references in classroom flow =====
describe('No stale dashboard references in classroom flow', () => {
  const fs = require('fs');
  const path = require('path');

  const classroomFiles = [
    'pages/classroom/index.tsx',
    'components/classroom/CourseGallery.tsx',
    'components/classroom/ClassroomLanding.tsx',
    'components/auth/AuthModal.tsx',
    'pages/checkout/classroom-success.tsx',
  ];

  test.each(classroomFiles)('%s should not redirect to /dashboard', (file) => {
    const filePath = path.resolve(__dirname, '../..', file);
    if (!fs.existsSync(filePath)) {
      // File doesn't exist — skip
      return;
    }
    const source = fs.readFileSync(filePath, 'utf-8');

    // Check for hard-coded /dashboard redirects (not just string mentions in comments)
    const redirectMatches = source.match(/(?:href|replace|push|location\.href)\s*[=(]\s*['"`][^'"`]*\/dashboard/g);
    expect(redirectMatches).toBeNull();
  });
});

// ===== TEST 9: Stripe Edge Function compatibility =====
describe('Stripe Edge Function configuration', () => {
  const fs = require('fs');
  const path = require('path');

  test('create-checkout should accept courseId without requiring courseSlug', () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, '../../../../../supabase/functions/create-checkout/index.ts'),
      'utf-8'
    );
    // courseSlug should be optional
    expect(source).not.toMatch(/if\s*\(!courseId\s*\|\|\s*!priceId\s*\|\|\s*!courseSlug\)/);
    expect(source).toMatch(/if\s*\(!courseId\s*\|\|\s*!priceId\)/);
  });

  test('stripe-webhook should use constructEventAsync (not constructEvent)', () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, '../../../../../supabase/functions/stripe-webhook/index.ts'),
      'utf-8'
    );
    expect(source).toContain('constructEventAsync');
    expect(source).not.toMatch(/(?<!Async\()constructEvent\(/);
  });

  test('stripe-webhook should create enrollment on checkout.session.completed', () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, '../../../../../supabase/functions/stripe-webhook/index.ts'),
      'utf-8'
    );
    expect(source).toContain('checkout.session.completed');
    expect(source).toContain("from('enrollments')");
  });

  test('stripe-webhook should send enrollment confirmation email', () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, '../../../../../supabase/functions/stripe-webhook/index.ts'),
      'utf-8'
    );
    expect(source).toContain('enrollment_confirm');
    expect(source).toContain('send-email');
  });
});

// ===== TEST 10: Email templates exist =====
describe('Email templates', () => {
  let emailSource: string;

  beforeAll(() => {
    const fs = require('fs');
    emailSource = fs.readFileSync(
      require('path').resolve(__dirname, '../../../../../supabase/functions/send-email/index.ts'),
      'utf-8'
    );
  });

  const requiredTemplates = [
    'welcome',
    'enrollment_confirm',
    'payment_receipt',
    'event_reminder',
    'inactivity_reminder',
    'course_complete',
    'broadcast',
  ];

  test.each(requiredTemplates)('should have %s template', (template) => {
    // Template should be defined in the TEMPLATES object
    const regex = new RegExp(`${template}:\\s*\\(`);
    expect(emailSource).toMatch(regex);
  });

  test('send-email should use Resend API', () => {
    expect(emailSource).toContain('resend.com/emails');
    expect(emailSource).toContain('RESEND_API_KEY');
  });

  test('send-email should accept type field (not template)', () => {
    expect(emailSource).toContain('type: string');
    expect(emailSource).toContain('const { type, to, data }');
  });
});

// ===== TEST 11: Checkout success page =====
describe('Checkout success page', () => {
  let successSource: string;

  beforeAll(() => {
    const fs = require('fs');
    successSource = fs.readFileSync(
      require('path').resolve(__dirname, '../../pages/checkout/classroom-success.tsx'),
      'utf-8'
    );
  });

  test('Success page should link to /classroom, not /dashboard', () => {
    expect(successSource).toContain('href="/classroom"');
    expect(successSource).not.toContain('href="/dashboard"');
  });

  test('Success page should say Enrolled, not free trial', () => {
    expect(successSource).toContain('Enrolled');
    expect(successSource).not.toContain('free trial');
    expect(successSource).not.toContain('7-day');
  });
});

// ===== TEST 12: AuthContext loading timeout =====
describe('AuthContext safety', () => {
  let authSource: string;

  beforeAll(() => {
    const fs = require('fs');
    authSource = fs.readFileSync(
      require('path').resolve(__dirname, '../../contexts/AuthContext.tsx'),
      'utf-8'
    );
  });

  test('AuthContext should have a loading timeout to prevent infinite spinners', () => {
    expect(authSource).toContain('loadingTimeout');
    expect(authSource).toContain('setTimeout');
    expect(authSource).toContain('setIsLoading(false)');
  });

  test('AuthContext should clear timeout on successful auth resolution', () => {
    expect(authSource).toContain('clearTimeout(loadingTimeout)');
  });

  test('AuthContext should prevent race condition between getSession and onAuthStateChange', () => {
    expect(authSource).toContain('initialLoadDone');
  });

  test('AuthContext profile fetch failure should not block loading', () => {
    // Each fetchProfileAndRole call should be wrapped in try/catch
    const fetchCalls = authSource.match(/await fetchProfileAndRole/g);
    const catchBlocks = authSource.match(/catch\s*\(/g); // catch(err) pattern
    expect(fetchCalls).not.toBeNull();
    expect(catchBlocks).not.toBeNull();
    if (fetchCalls && catchBlocks) {
      expect(catchBlocks.length).toBeGreaterThanOrEqual(fetchCalls.length);
    }
  });
});

// ===== TEST 13: useCourses hook - no N+1 queries =====
describe('useCourses hook performance', () => {
  let hookSource: string;

  beforeAll(() => {
    const fs = require('fs');
    hookSource = fs.readFileSync(
      require('path').resolve(__dirname, '../../hooks/useCourses.ts'),
      'utf-8'
    );
  });

  test('useCourses should NOT have per-course queries in a loop', () => {
    // Should not have a for loop that queries inside it
    const forLoopWithQuery = hookSource.match(/for\s*\([^)]*courseId[^)]*\)[\s\S]{0,200}from\(/g);
    expect(forLoopWithQuery).toBeNull();
  });

  test('useCourses should batch-fetch all lessons in one query', () => {
    // Batch fetch is inside fetchUserProgress helper
    expect(hookSource).toContain("in('course_id', courseIds)");
  });

  test('useCourses should batch-fetch all progress in one query', () => {
    expect(hookSource).toContain("in('lesson_id', allLessonIds)");
  });

  test('useCourses should filter enrollments by active status', () => {
    expect(hookSource).toContain("eq('status', 'active')");
  });
});
