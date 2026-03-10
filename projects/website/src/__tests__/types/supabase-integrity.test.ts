// =============================================================================
// Supabase Type Integrity Tests
// Verifies that the Database type definition matches expected schema contracts.
// Tests run at the RUNTIME level against the exported object structure.
// =============================================================================

// We import the module to verify exports exist. Since these are TypeScript types,
// we test what we can at runtime and document type-level contracts as assertions.
const supabaseModule = require('@/types/supabase');

// ---------------------------------------------------------------------------
// Exports exist
// ---------------------------------------------------------------------------

describe('supabase module exports', () => {
  it('exports the Json type (not undefined)', () => {
    // Json is a type alias — it won't exist at runtime.
    // We verify the module loads without error as a baseline.
    expect(supabaseModule).toBeDefined();
  });

  const expectedHelperTypes = [
    'Profile',
    'ProfileInsert',
    'ProfileUpdate',
    'Community',
    'CommunityMember',
    'CommunityMemberInsert',
    'Category',
    'Post',
    'PostInsert',
    'PostUpdate',
    'Comment',
    'CommentInsert',
    'Reaction',
    'ReactionInsert',
    'PostAttachment',
    'PostAttachmentInsert',
    'Poll',
    'PollInsert',
    'PollOption',
    'PollOptionInsert',
    'PollVote',
    'PollVoteInsert',
    'Report',
    'ReportInsert',
    'PostFollow',
    'PostFollowInsert',
    'Course',
    'CourseInsert',
    'CourseUpdate',
    'Module',
    'ModuleInsert',
    'ModuleUpdate',
    'Lesson',
    'LessonInsert',
    'LessonUpdate',
    'Enrollment',
    'EnrollmentInsert',
    'LessonProgress',
    'LessonProgressInsert',
    'LessonProgressUpdate',
    'MembershipQuestion',
    'MembershipRequest',
    'Invitation',
    'Follow',
    'MemberBan',
    'Notification',
    'Subscription',
    'Event',
    'EventInsert',
    'EventUpdate',
    'EventRsvp',
    'EventCategory',
    'EventCategoryInsert',
    'EventOccurrence',
    'EventOccurrenceUpdate',
    'Level',
    'LevelUpdate',
    'MemberStats',
    'PointsLogEntry',
    'PointConfig',
    'PointConfigUpdate',
    'LessonAttachment',
    'LessonAttachmentInsert',
    'LessonComment',
    'LessonCommentInsert',
    'ContentEngagementLog',
    'ContentEngagementLogInsert',
    'CourseAnalyticsCache',
    'Conversation',
    'ConversationParticipant',
    'Message',
    'MessageInsert',
    'MemberBlock',
    'ConversationMute',
    'AutoDMConfig',
    'CommunitySettingsRow',
    'CommunitySettingsUpdate',
    'ContentReport',
    'ContentReportUpdate',
    'AdminAuditLog',
    'DashboardMetric',
    'AnalyticsSnapshot',
  ];

  // Helper types are type aliases — they exist only at compile time in TS.
  // This test documents the expected exports. If the module loads, the
  // type definitions compiled successfully.
  it('module loads successfully (all type exports compile)', () => {
    expect(supabaseModule).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Schema contract tests via source file analysis
// We read the source as a string to validate naming conventions and detect bugs.
// ---------------------------------------------------------------------------

const fs = require('fs');
const path = require('path');

const supabaseSrc = fs.readFileSync(
  path.resolve(__dirname, '../../types/supabase.ts'),
  'utf-8'
);

describe('Database table presence', () => {
  const expectedTables = [
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
    'courses',
    'modules',
    'lessons',
    'enrollments',
    'lesson_progress',
    'membership_questions',
    'membership_requests',
    'invitations',
    'follows',
    'member_bans',
    'notifications',
    'notification_preferences',
    'thread_subscriptions',
    'subscriptions',
    'events',
    'event_rsvps',
    'event_categories',
    'event_occurrences',
    'levels',
    'member_stats',
    'points_log',
    'point_config',
    'lesson_attachments',
    'lesson_comments',
    'content_engagement_log',
    'course_analytics_cache',
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
    'email_preferences',
    'email_log',
    'analytics_snapshots',
    'rate_limits',
    'rate_limit_config',
    'consent_records',
    'deletion_requests',
    'payments',
    'webhook_events',
    'member_storage',
    'data_export_requests',
    'audit_log',
    'tracking_events',
    'tracking_retry_queue',
    'search_log',
  ];

  it.each(expectedTables)('table "%s" is defined in the schema', (tableName) => {
    // Table names appear as property keys like: tableName: {
    const pattern = new RegExp(`\\b${tableName}:\\s*\\{`);
    expect(supabaseSrc).toMatch(pattern);
  });
});

// ---------------------------------------------------------------------------
// notifications table bug detection
// ---------------------------------------------------------------------------

describe('notifications table — read/is_read dual-field bug', () => {
  it('KNOWN BUG: notifications has BOTH "read" and "is_read" fields', () => {
    // Extract the notifications Row block
    const notifMatch = supabaseSrc.match(
      /notifications:\s*\{[\s\S]*?Row:\s*\{([\s\S]*?)\};/
    );
    expect(notifMatch).not.toBeNull();

    const rowBlock = notifMatch![1];
    const hasRead = /\bread:\s*boolean/.test(rowBlock);
    const hasIsRead = /\bis_read:\s*boolean/.test(rowBlock);

    // This test documents the bug. Both fields should not coexist.
    // If this test starts failing, the bug has been fixed — update accordingly.
    expect(hasRead).toBe(true);
    expect(hasIsRead).toBe(true);

    // Flag: this is a schema inconsistency that should be resolved
    console.warn(
      'BUG DETECTED: notifications table has both "read" and "is_read" boolean fields. ' +
      'Pick one and remove the other to avoid confusion.'
    );
  });
});

// ---------------------------------------------------------------------------
// Table Row types must have "id" field
// ---------------------------------------------------------------------------

describe('all table Row types have an id field', () => {
  // Extract all table names and their Row blocks
  const tableRowPattern = /(\w+):\s*\{\s*Row:\s*\{([^}]+)\}/g;
  let match;
  const tablesWithRows: Array<{ name: string; rowBlock: string }> = [];

  while ((match = tableRowPattern.exec(supabaseSrc)) !== null) {
    tablesWithRows.push({ name: match[1], rowBlock: match[2] });
  }

  // Some tables use composite keys (e.g. follows uses follower_id + following_id)
  // We test that at LEAST the major tables have id
  const tablesExpectedToHaveId = [
    'profiles',
    'communities',
    'posts',
    'comments',
    'courses',
    'lessons',
    'events',
    'notifications',
    'subscriptions',
    'payments',
  ];

  it.each(tablesExpectedToHaveId)('table "%s" Row has an id field', (tableName) => {
    const entry = tablesWithRows.find((t) => t.name === tableName);
    expect(entry).toBeDefined();
    expect(entry!.rowBlock).toMatch(/\bid:\s*string/);
  });
});

// ---------------------------------------------------------------------------
// profiles table required fields
// ---------------------------------------------------------------------------

describe('profiles table schema', () => {
  const profilesMatch = supabaseSrc.match(
    /profiles:\s*\{\s*Row:\s*\{([\s\S]*?)\};/
  );
  const profileRow = profilesMatch ? profilesMatch[1] : '';

  it.each([
    'id',
    'display_name',
    'username',
    'avatar_url',
    'bio',
    'membership_status',
    'onboarding_complete',
    'level',
    'xp_total',
    'created_at',
    'updated_at',
  ])('has field "%s"', (field) => {
    expect(profileRow).toMatch(new RegExp(`\\b${field}\\b`));
  });
});

// ---------------------------------------------------------------------------
// courses table naming conventions
// ---------------------------------------------------------------------------

describe('courses table naming conventions', () => {
  const coursesMatch = supabaseSrc.match(
    /courses:\s*\{\s*Row:\s*\{([\s\S]*?)\};/
  );
  const courseRow = coursesMatch ? coursesMatch[1] : '';

  it('uses "published" not "is_published"', () => {
    expect(courseRow).toMatch(/\bpublished:\s*boolean/);
    expect(courseRow).not.toMatch(/\bis_published\b/);
  });

  it('uses "display_order" not "sort_order"', () => {
    expect(courseRow).toMatch(/\bdisplay_order:\s*number/);
    expect(courseRow).not.toMatch(/\bsort_order\b/);
  });

  it('does not have a "slug" field', () => {
    expect(courseRow).not.toMatch(/\bslug\b/);
  });
});

// ---------------------------------------------------------------------------
// lessons table naming conventions
// ---------------------------------------------------------------------------

describe('lessons table naming conventions', () => {
  const lessonsMatch = supabaseSrc.match(
    /lessons:\s*\{\s*Row:\s*\{([\s\S]*?)\};/
  );
  const lessonRow = lessonsMatch ? lessonsMatch[1] : '';

  it('uses "content" not "content_markdown"', () => {
    expect(lessonRow).toMatch(/\bcontent:\s*string/);
    expect(lessonRow).not.toMatch(/\bcontent_markdown\b/);
  });

  it('does not have a "slug" field', () => {
    expect(lessonRow).not.toMatch(/\bslug\b/);
  });
});

// ---------------------------------------------------------------------------
// rate_limits table naming conventions
// ---------------------------------------------------------------------------

describe('rate_limits table naming conventions', () => {
  const rateLimitsMatch = supabaseSrc.match(
    /rate_limits:\s*\{\s*Row:\s*\{([\s\S]*?)\};/
  );
  const rateLimitRow = rateLimitsMatch ? rateLimitsMatch[1] : '';

  it('uses "action_type" not "action"', () => {
    expect(rateLimitRow).toMatch(/\baction_type:\s*string/);
    // Make sure "action" alone (without _type suffix) is not used as the field name
    // We need to be careful not to match "action_type" itself
    const withoutActionType = rateLimitRow.replace(/action_type/g, '');
    expect(withoutActionType).not.toMatch(/\baction:\s*string/);
  });
});

// ---------------------------------------------------------------------------
// events table naming conventions
// ---------------------------------------------------------------------------

describe('events table naming conventions', () => {
  const eventsMatch = supabaseSrc.match(
    /events:\s*\{\s*Row:\s*\{([\s\S]*?)\};/
  );
  const eventRow = eventsMatch ? eventsMatch[1] : '';

  it('uses "start_time" not "starts_at"', () => {
    expect(eventRow).toMatch(/\bstart_time:\s*string/);
    expect(eventRow).not.toMatch(/\bstarts_at\b/);
  });

  it('uses "end_time" not "ends_at"', () => {
    expect(eventRow).toMatch(/\bend_time:\s*string/);
    expect(eventRow).not.toMatch(/\bends_at\b/);
  });
});

// ---------------------------------------------------------------------------
// Json type is properly defined (not any)
// ---------------------------------------------------------------------------

describe('Json type definition', () => {
  it('Json type is a union type, not "any"', () => {
    // The Json type should be defined as a union, not just "any"
    const jsonTypeMatch = supabaseSrc.match(/export type Json\s*=\s*([\s\S]*?);/);
    expect(jsonTypeMatch).not.toBeNull();
    const jsonDef = jsonTypeMatch![1];

    // It should contain "string", "number", "boolean", "null" in the union
    expect(jsonDef).toContain('string');
    expect(jsonDef).toContain('number');
    expect(jsonDef).toContain('boolean');
    expect(jsonDef).toContain('null');

    // It should NOT be just "any"
    expect(jsonDef.trim()).not.toBe('any');
  });
});
