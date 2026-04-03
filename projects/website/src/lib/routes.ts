// =============================================================================
// Centralized Route Constants
// Single source of truth for all URL paths used across the application.
// Import from '@/lib/routes' instead of hardcoding strings.
// =============================================================================

export const ROUTES = {
  // ── Public pages ──────────────────────────────────────────────────────
  HOME: '/',
  BLOG: '/blog',
  PORTFOLIO: '/portfolio',
  PROFESSIONAL_EXPERIENCE: '/professionalExperience',
  SEARCH: '/search',

  // ── Legal ─────────────────────────────────────────────────────────────
  PRIVACY_POLICY: '/privacy-policy',
  TERMS_AND_CONDITIONS: '/terms-and-conditions',
  DISCLAIMER: '/disclaimer',
  REFUND_POLICY: '/refund-policy',

  // ── Products / landing pages ──────────────────────────────────────────
  LAW_FIRM_RAG: '/law-firm-rag',
  HAVEN_BLUEPRINT: '/haven-blueprint',
  VISIONSPARK_RE: '/visionspark-re',
  WORKFLOW_DEMO: '/workflow-demo',

  // ── Auth ──────────────────────────────────────────────────────────────
  AUTH_CALLBACK: '/auth/callback',

  // ── Protected: Dashboard ──────────────────────────────────────────────
  DASHBOARD: '/dashboard',

  // ── Protected: Classroom ──────────────────────────────────────────────
  CLASSROOM: '/classroom',
  CLASSROOM_ADMIN: '/classroom/admin',

  // ── Protected: Community ──────────────────────────────────────────────
  COMMUNITY: '/community',
  COMMUNITY_CALENDAR: '/community/calendar',
  COMMUNITY_LEADERBOARD: '/community/leaderboard',
  COMMUNITY_ADMIN_CATEGORIES: '/community/admin/categories',

  // ── Protected: Members ────────────────────────────────────────────────
  MEMBERS: '/members',
  MEMBERS_ONBOARDING: '/members/onboarding',
  MEMBERS_REQUESTS: '/members/requests',

  // ── Protected: Messaging ──────────────────────────────────────────────
  MESSAGES: '/messages',

  // ── Protected: Notifications ──────────────────────────────────────────
  NOTIFICATIONS: '/notifications',

  // ── Protected: Admin ──────────────────────────────────────────────────
  ADMIN: '/admin',

  // ── Checkout ──────────────────────────────────────────────────────────
  CHECKOUT_CLASSROOM: '/checkout/classroom',
  CHECKOUT_CLASSROOM_SUCCESS: '/checkout/classroom-success',
  CHECKOUT_VISIONSPARK_RE_SUCCESS: '/checkout/visionspark-re-success',
  CHECKOUT_CANCEL: '/checkout/cancel',

  // ── Templates (standalone store) ──────────────────────────────────────
  TEMPLATES: '/templates',
  TEMPLATES_TERMS: '/templates/terms',
  TEMPLATES_REFUND_POLICY: '/templates/refund-policy',
  TEMPLATES_DOWNLOAD: '/templates/download',
} as const;

// ── Dynamic route helpers ─────────────────────────────────────────────────
export function blogPostRoute(slug: string): string {
  return `/blog/${slug}`;
}

export function memberRoute(usernameOrId: string): string {
  return `/members/${usernameOrId}`;
}

export function communityPostRoute(postId: string): string {
  return `/community/posts/${postId}`;
}

export function communityCalendarEventRoute(eventId: string): string {
  return `/community/calendar/${eventId}`;
}

export function classroomCourseRoute(courseSlug: string): string {
  return `/classroom/${courseSlug}`;
}

export function classroomAdminEditRoute(courseSlug: string): string {
  return `/classroom/admin/${courseSlug}/edit`;
}

export function messageConversationRoute(conversationId: string): string {
  return `/messages/${conversationId}`;
}

export function templateDetailRoute(slug: string): string {
  return `/templates/${slug}`;
}

// ── Anchored routes ───────────────────────────────────────────────────────
export const LAW_FIRM_RAG_PRICING = `${ROUTES.LAW_FIRM_RAG}#pricing` as const;
export const DASHBOARD_BILLING = `${ROUTES.DASHBOARD}#billing` as const;

// ── Type for route values ─────────────────────────────────────────────────
export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
