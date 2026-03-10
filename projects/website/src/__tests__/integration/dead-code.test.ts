/**
 * Dead Code Detection Test
 * =========================
 * Identifies orphaned components, unused types, and dead exports.
 * Each test documents a specific instance of dead code with guidance
 * on what to do about it.
 *
 * These tests are designed to PASS when dead code is present (documenting
 * the problem) and FAIL when the dead code is cleaned up (signaling the
 * test should be updated).
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC_DIR = path.resolve(__dirname, '../../');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Recursively collect all .ts/.tsx files under a directory.
 */
function collectFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(collectFiles(full));
    } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

/**
 * Search all source files for a string pattern, excluding the file itself.
 * Returns files that contain the pattern.
 */
function findImporters(
  pattern: string | RegExp,
  excludeFile?: string,
): string[] {
  const allFiles = collectFiles(SRC_DIR);
  const results: string[] = [];

  for (const file of allFiles) {
    // Skip the file that defines the export
    if (excludeFile && path.resolve(file) === path.resolve(excludeFile)) continue;
    // Skip test files
    if (file.includes('__tests__')) continue;

    const content = fs.readFileSync(file, 'utf-8');
    const matches =
      typeof pattern === 'string'
        ? content.includes(pattern)
        : pattern.test(content);

    if (matches) {
      results.push(path.relative(SRC_DIR, file));
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Dead code detection', () => {
  describe('PostActions component (community/feed/PostActions.tsx)', () => {
    // PostActions is a fully-implemented dropdown menu component for post
    // actions (pin, delete, report, follow). However, it is never imported
    // by any other component. PostCard and PostDetail do not use it.
    //
    // FIX: Either integrate PostActions into PostCard/PostDetail, or delete it.

    const postActionsFile = path.join(
      SRC_DIR,
      'components/community/feed/PostActions.tsx',
    );

    it('PostActions.tsx exists', () => {
      expect(fs.existsSync(postActionsFile)).toBe(true);
    });

    it('DEAD CODE: PostActions is never imported by another component', () => {
      // Search for any import of PostActions (the component, not the hook)
      const importers = findImporters(
        /import\s+.*PostActions.*from\s+['"].*\/PostActions['"]/,
        postActionsFile,
      );

      // The PostActions COMPONENT should have zero importers.
      // Note: The usePostActions HOOK is imported by PostActions.tsx itself
      // and by ReportDialog.tsx — that's different from the component being used.
      expect(importers.length).toBe(0);
    });
  });

  describe('types/admin.ts — all types are orphaned', () => {
    // types/admin.ts defines AdminActionType, ModerationAction,
    // CommunitySettings, ContentReport, AuditLogEntry, DashboardMetric,
    // and MemberWithDetails. None of these are imported anywhere in src/.
    //
    // FIX: Either use these types in the admin components that handle
    // moderation, audit logs, and metrics, or delete the file.

    const adminTypesFile = path.join(SRC_DIR, 'types/admin.ts');

    it('types/admin.ts exists', () => {
      expect(fs.existsSync(adminTypesFile)).toBe(true);
    });

    it('DEAD CODE: no file imports from types/admin', () => {
      const importers = findImporters(
        /from\s+['"]@\/types\/admin['"]/,
        adminTypesFile,
      );
      expect(importers.length).toBe(0);
    });

    // The definitive proof that all types in admin.ts are dead is that
    // no file imports from '@/types/admin'. The types ContentReport,
    // DashboardMetric, etc. may appear in types/supabase.ts as separate
    // definitions — those are different from the admin.ts versions.
    // The per-type tests below verify that no file imports these types
    // specifically from the admin module.

    const adminTypeNames = [
      'AdminActionType',
      'ModerationAction',
      'CommunitySettings',
      'ContentReport',
      'AuditLogEntry',
      'DashboardMetric',
      'MemberWithDetails',
    ];

    it.each(adminTypeNames)(
      'DEAD CODE: %s is never imported from types/admin',
      (typeName) => {
        // Check specifically for imports from types/admin that reference this type.
        // The same type name may exist in types/supabase.ts as a separate definition;
        // that does not make the admin.ts version alive.
        const importers = findImporters(
          new RegExp(`import.*\\b${typeName}\\b.*from\\s+['"]@/types/admin['"]`),
          adminTypesFile,
        );
        expect(importers.length).toBe(0);
      },
    );
  });

  describe('types/messaging.ts — SearchResult is orphaned', () => {
    // SearchResult is defined in types/messaging.ts but never imported.
    // ConversationWithParticipant and MessageWithSender ARE imported
    // by messaging components and hooks.
    //
    // FIX: If message search is planned, keep it. Otherwise, remove it.

    const messagingTypesFile = path.join(SRC_DIR, 'types/messaging.ts');

    it('types/messaging.ts exists', () => {
      expect(fs.existsSync(messagingTypesFile)).toBe(true);
    });

    it('ConversationWithParticipant IS imported (not dead)', () => {
      const refs = findImporters('ConversationWithParticipant', messagingTypesFile);
      expect(refs.length).toBeGreaterThan(0);
    });

    it('MessageWithSender IS imported (not dead)', () => {
      const refs = findImporters('MessageWithSender', messagingTypesFile);
      expect(refs.length).toBeGreaterThan(0);
    });

    it('DEAD CODE: SearchResult from types/messaging is never imported', () => {
      // Note: SearchResult is also defined in cerebro/types and useGlobalSearch.
      // Those are separate definitions. We only care about the messaging version.
      const refs = findImporters(
        /import.*\bSearchResult\b.*from\s+['"]@\/types\/messaging['"]/,
        messagingTypesFile,
      );
      expect(refs.length).toBe(0);
    });
  });

  describe('useConsent hook vs consent_records table alignment', () => {
    // useConsent stores consent in localStorage only. The Supabase schema
    // defines a consent_records table, but the hook never writes to it.
    //
    // FIX: Either sync consent to Supabase (for GDPR compliance tracking)
    // or remove consent_records from the schema if it's unused.

    const useConsentFile = path.join(SRC_DIR, 'hooks/useConsent.ts');

    it('useConsent.ts exists', () => {
      expect(fs.existsSync(useConsentFile)).toBe(true);
    });

    it('useConsent uses localStorage, not Supabase', () => {
      const content = fs.readFileSync(useConsentFile, 'utf-8');
      expect(content).toContain('localStorage');
      expect(content).not.toContain('supabaseClient');
      expect(content).not.toContain("from('consent_records')");
    });

    it('consent_records table exists in Supabase types but is unused by useConsent', () => {
      const supabaseTypes = fs.readFileSync(
        path.join(SRC_DIR, 'types/supabase.ts'),
        'utf-8',
      );
      expect(supabaseTypes).toContain('consent_records');

      // No file in hooks/ or components/ references the consent_records table
      const refs = findImporters("from('consent_records')");
      expect(refs.length).toBe(0);
    });
  });

  describe('Orphaned component interfaces', () => {
    // Components sometimes define prop interfaces that are never used
    // externally. This is fine for internal component typing, but becomes
    // dead code if the component itself is never imported.

    it('PostActionsProps interface is only used inside PostActions.tsx (orphaned with component)', () => {
      const refs = findImporters(
        /\bPostActionsProps\b/,
        path.join(SRC_DIR, 'components/community/feed/PostActions.tsx'),
      );
      // Since the component is orphaned, its interface is also orphaned
      expect(refs.length).toBe(0);
    });
  });
});
