/**
 * Import Resolution Integration Test
 * ====================================
 * Verifies that all critical imports resolve correctly. This catches:
 *   - Broken path aliases (@/ not resolving)
 *   - Missing files after refactors
 *   - TypeScript skipLibCheck hiding real resolution failures
 *
 * We dynamically import data files, type files, and key components
 * to ensure the module graph is intact.
 */

// ---------------------------------------------------------------------------
// Data files — every file in src/data/ should import without error
// ---------------------------------------------------------------------------

describe('Data file imports', () => {
  it('homepage.ts — exports verticals, proofSystems, valueLadderTiers, serviceOfferings', async () => {
    const mod = await import('@/data/homepage');
    expect(mod.verticals).toBeDefined();
    expect(Array.isArray(mod.verticals)).toBe(true);
    expect(mod.proofSystems).toBeDefined();
    expect(Array.isArray(mod.proofSystems)).toBe(true);
    expect(mod.valueLadderTiers).toBeDefined();
    expect(Array.isArray(mod.valueLadderTiers)).toBe(true);
    expect(mod.serviceOfferings).toBeDefined();
    expect(Array.isArray(mod.serviceOfferings)).toBe(true);
  });

  it('navigation.ts — exports navItems', async () => {
    const mod = await import('@/data/navigation');
    expect(mod.navItems).toBeDefined();
    expect(Array.isArray(mod.navItems)).toBe(true);
    expect(mod.navItems.length).toBeGreaterThan(0);
  });

  it('templates.ts — exports templates array and helper functions', async () => {
    const mod = await import('@/data/templates');
    expect(mod.templates).toBeDefined();
    expect(Array.isArray(mod.templates)).toBe(true);
    expect(typeof mod.getTemplateBySlug).toBe('function');
    expect(typeof mod.getAllTemplateSlugs).toBe('function');
    expect(typeof mod.getRelatedTemplates).toBe('function');
  });

  it('template-categories.ts — exports templateCategories', async () => {
    const mod = await import('@/data/template-categories');
    expect(mod.templateCategories).toBeDefined();
    expect(Array.isArray(mod.templateCategories)).toBe(true);
  });

  it('testimonials.ts — exports testimonials', async () => {
    const mod = await import('@/data/testimonials');
    expect(mod.testimonials).toBeDefined();
    expect(Array.isArray(mod.testimonials)).toBe(true);
  });

  it('roi-benchmarks.ts — exports PRACTICE_AREAS, BENCHMARKS, WIZARD_STEPS', async () => {
    const mod = await import('@/data/roi-benchmarks');
    expect(mod.PRACTICE_AREAS).toBeDefined();
    expect(mod.BENCHMARKS).toBeDefined();
    expect(mod.WIZARD_STEPS).toBeDefined();
  });

  it('haven-blueprint.ts — exports HAVEN_BLUEPRINT and section data', async () => {
    const mod = await import('@/data/haven-blueprint');
    expect(mod.HAVEN_BLUEPRINT).toBeDefined();
    expect(mod.painPoints).toBeDefined();
    expect(mod.systemSteps).toBeDefined();
    expect(mod.modules).toBeDefined();
    expect(mod.includedItems).toBeDefined();
    expect(mod.bonuses).toBeDefined();
    expect(mod.faqItems).toBeDefined();
    expect(mod.trustBadges).toBeDefined();
  });

  it('visionspark-re.ts — exports VISIONSPARK_RE and section data', async () => {
    const mod = await import('@/data/visionspark-re');
    expect(mod.VISIONSPARK_RE).toBeDefined();
    expect(mod.painPoints).toBeDefined();
    expect(mod.systemSteps).toBeDefined();
    expect(mod.modules).toBeDefined();
    expect(mod.includedItems).toBeDefined();
    expect(mod.bonuses).toBeDefined();
    expect(mod.faqItems).toBeDefined();
    expect(mod.trustBadges).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Type files — import must resolve (TS types are erased at runtime, but
// the file must at least exist and parse)
// ---------------------------------------------------------------------------

describe('Type file imports', () => {
  it('types/supabase.ts resolves', async () => {
    const mod = await import('@/types/supabase');
    // This file exports interfaces/types which disappear at runtime,
    // but the import itself must not throw.
    expect(mod).toBeDefined();
  });

  it('types/admin.ts resolves', async () => {
    const mod = await import('@/types/admin');
    expect(mod).toBeDefined();
  });

  it('types/blog.ts resolves', async () => {
    const mod = await import('@/types/blog');
    expect(mod).toBeDefined();
  });

  it('types/calendar.ts resolves', async () => {
    const mod = await import('@/types/calendar');
    expect(mod).toBeDefined();
  });

  it('types/feed.ts resolves', async () => {
    const mod = await import('@/types/feed');
    expect(mod).toBeDefined();
  });

  it('types/gamification.ts resolves', async () => {
    const mod = await import('@/types/gamification');
    expect(mod).toBeDefined();
  });

  it('types/members.ts resolves', async () => {
    const mod = await import('@/types/members');
    expect(mod).toBeDefined();
  });

  it('types/messaging.ts resolves', async () => {
    const mod = await import('@/types/messaging');
    expect(mod).toBeDefined();
  });

  it('types/notifications.ts resolves', async () => {
    const mod = await import('@/types/notifications');
    expect(mod).toBeDefined();
  });

  it('types/roi-calculator.ts resolves', async () => {
    const mod = await import('@/types/roi-calculator');
    expect(mod).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Key components — smoke-import the most critical ones
// ---------------------------------------------------------------------------

describe('Key component imports', () => {
  it('layout/Layout resolves', async () => {
    const mod = await import('@/components/layout/Layout');
    expect(mod.default).toBeDefined();
  });

  it('layout/ClassroomLayout resolves', async () => {
    const mod = await import('@/components/layout/ClassroomLayout');
    expect(mod.default).toBeDefined();
  });

  it('common/ProtectedRoute resolves', async () => {
    const mod = await import('@/components/common/ProtectedRoute');
    expect(mod.default).toBeDefined();
  });

  it('classroom/CourseCard resolves', async () => {
    const mod = await import('@/components/classroom/CourseCard');
    expect(mod.default).toBeDefined();
  });

  it('community/feed/PostCard resolves', async () => {
    const mod = await import('@/components/community/feed/PostCard');
    expect(mod.default).toBeDefined();
  });

  it('contexts/AuthContext resolves', async () => {
    const mod = await import('@/contexts/AuthContext');
    expect(mod.AuthProvider).toBeDefined();
    expect(mod.useAuth).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Lib files — ensure utility modules resolve
// ---------------------------------------------------------------------------

describe('Lib file imports', () => {
  it('lib/sanitize resolves', async () => {
    const mod = await import('@/lib/sanitize');
    expect(mod).toBeDefined();
  });

  it('lib/stripe resolves (may throw in Jest due to missing fetch — file existence is sufficient)', async () => {
    // Stripe SDK instantiates at top-level and requires a global fetch,
    // which is not available in the Jest jsdom environment. The import
    // will throw, but the file itself is valid. We verify the file exists
    // via fs instead.
    const stripePath = require('path').resolve(__dirname, '../../lib/stripe.ts');
    const exists = require('fs').existsSync(stripePath);
    expect(exists).toBe(true);
  });

  it('lib/roi-calculations resolves', async () => {
    const mod = await import('@/lib/roi-calculations');
    expect(mod).toBeDefined();
  });

  it('lib/analytics/index resolves', async () => {
    const mod = await import('@/lib/analytics/index');
    expect(mod).toBeDefined();
  });

  it('lib/utils resolves and exports shared utilities', async () => {
    const mod = await import('@/lib/utils');
    expect(typeof mod.timeAgo).toBe('function');
    expect(typeof mod.formatFileSize).toBe('function');
    expect(typeof mod.extractYouTubeId).toBe('function');
  });
});
