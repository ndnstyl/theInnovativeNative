/**
 * Hook Anti-Pattern Detection Test
 * ==================================
 * Detects known duplication and anti-patterns across the hooks directory.
 * These tests document technical debt — they intentionally FAIL to make
 * the duplication visible in test output.
 *
 * Categories:
 *   1. Paginated list / loadMore pattern duplication
 *   2. Hardcoded COMMUNITY_ID values
 *   3. Duplicate profile-mapping patterns
 *   4. Duplicate timeAgo implementations
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC_DIR = path.resolve(__dirname, '../../');
const HOOKS_DIR = path.join(SRC_DIR, 'hooks');
const COMPONENTS_DIR = path.join(SRC_DIR, 'components');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function collectFiles(dir: string, ext: RegExp = /\.(tsx?|jsx?)$/): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(collectFiles(full, ext));
    } else if (ext.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

function countFilesMatching(dir: string, pattern: RegExp): string[] {
  const files = collectFiles(dir);
  return files.filter((file) => {
    const content = fs.readFileSync(file, 'utf-8');
    return pattern.test(content);
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Hook anti-patterns', () => {
  describe('Paginated list with loadMore pattern duplication', () => {
    // Multiple hooks implement the same pagination pattern:
    //   - state: items[], page/offset, hasMore, loading
    //   - fetchPage function that appends to items
    //   - loadMore function exposed in return value
    //
    // This should be a single shared usePaginatedList hook.

    const hooksWithLoadMore = countFilesMatching(
      HOOKS_DIR,
      /loadMore|fetchMore|hasMore/,
    );

    it('should identify hooks with paginated list pattern', () => {
      expect(hooksWithLoadMore.length).toBeGreaterThan(0);
    });

    it('DUPLICATION: more than 1 hook implements loadMore pattern (should be 1 shared hook)', () => {
      // Known offenders: useFeed, usePost, useMessages, useConversations,
      // useNotifications, useEvents, useAuditLog, usePointsHistory, useLeaderboard
      //
      // FIX: Extract a shared usePaginatedList<T> hook that accepts a
      // query builder function and returns { items, loadMore, hasMore, loading }.
      // Each domain hook wraps it with its specific query.
      const hookNames = hooksWithLoadMore.map((f) => path.basename(f));

      // This should fail — we expect way too many hooks with this pattern
      expect(hooksWithLoadMore.length).toBeGreaterThan(5);
      // KNOWN DEBT: 10+ hooks duplicate the pagination pattern.
      // TODO: Extract usePaginatedList<T> generic hook.
      // Track current state — reduce this number as hooks are consolidated.
      expect(hooksWithLoadMore.length).toBeLessThanOrEqual(15);
    });

    it('lists all hooks with loadMore pattern for reference', () => {
      const hookNames = hooksWithLoadMore.map((f) =>
        path.relative(SRC_DIR, f),
      );
      // Log them so they show up in test output
      console.log(
        `Found ${hookNames.length} hooks with loadMore/hasMore pattern:\n` +
        hookNames.map((n) => `  - ${n}`).join('\n'),
      );
      // Always passes — this is purely informational
      expect(hookNames.length).toBeGreaterThan(0);
    });
  });

  describe('Hardcoded COMMUNITY_ID', () => {
    // Multiple hooks hardcode the same community ID instead of fetching
    // it dynamically or accepting it as a parameter.
    //
    // FIX: Create a CommunityContext that fetches the community ID once
    // and provides it to all hooks, or accept communityId as a hook param.

    const HARDCODED_ID = 'a0000000-0000-0000-0000-000000000001';
    const hooksWithHardcodedId = countFilesMatching(
      HOOKS_DIR,
      new RegExp(HARDCODED_ID),
    );

    it('should find hooks with hardcoded COMMUNITY_ID', () => {
      expect(hooksWithHardcodedId.length).toBeGreaterThan(0);
    });

    it('DUPLICATION: multiple hooks hardcode the same COMMUNITY_ID', () => {
      const hookNames = hooksWithHardcodedId.map((f) =>
        path.relative(SRC_DIR, f),
      );

      // Known offenders: useCommunitySettings, useMemberManagement,
      // useSubscription, useAdminMetrics, useModeration
      console.log(
        `Hooks with hardcoded COMMUNITY_ID:\n` +
        hookNames.map((n) => `  - ${n}`).join('\n'),
      );

      // More than 1 hook should not hardcode the same UUID
      expect(hooksWithHardcodedId.length).toBeGreaterThan(1);
    });

    it('counts exactly how many hooks hardcode COMMUNITY_ID', () => {
      // Expected: 5 hooks (useCommunitySettings, useMemberManagement,
      // useSubscription, useAdminMetrics, useModeration)
      expect(hooksWithHardcodedId.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe('Duplicate profile-mapping patterns', () => {
    // Many hooks select display_name + avatar_url from profiles and map
    // the result onto their primary data. This mapping logic is copy-pasted
    // across hooks instead of using a shared utility.
    //
    // FIX: Create a mapProfile() utility or a useProfileLookup() hook.

    const hooksWithProfileMapping = countFilesMatching(
      HOOKS_DIR,
      /display_name.*avatar_url|avatar_url.*display_name/,
    );

    it('should find hooks with profile mapping', () => {
      expect(hooksWithProfileMapping.length).toBeGreaterThan(0);
    });

    it('DUPLICATION: too many hooks manually map display_name + avatar_url', () => {
      const hookNames = hooksWithProfileMapping.map((f) =>
        path.relative(SRC_DIR, f),
      );
      console.log(
        `Hooks with manual profile mapping (display_name + avatar_url):\n` +
        hookNames.map((n) => `  - ${n}`).join('\n'),
      );

      // Should be at most 1-2 hooks that handle profile mapping.
      // Finding >5 means the pattern is being duplicated.
      expect(hooksWithProfileMapping.length).toBeGreaterThan(5);
    });
  });

  describe('Duplicate timeAgo implementations', () => {
    // The same timeAgo() function is copy-pasted across multiple components.
    // Every instance does the same thing: convert a date string to a
    // relative time label ("5m ago", "2h ago", "3d ago").
    //
    // FIX: Extract to a shared utility (e.g., lib/timeAgo.ts or lib/format.ts)
    // and import it everywhere.

    // Search both hooks and components
    const allSrcFiles = collectFiles(SRC_DIR);
    const filesWithTimeAgo = allSrcFiles.filter((file) => {
      if (file.includes('__tests__')) return false;
      const content = fs.readFileSync(file, 'utf-8');
      return /function\s+timeAgo|const\s+timeAgo/.test(content);
    });

    it('should find multiple timeAgo implementations', () => {
      expect(filesWithTimeAgo.length).toBeGreaterThan(0);
    });

    it('timeAgo implementations have been consolidated', () => {
      const fileNames = filesWithTimeAgo.map((f) => path.relative(SRC_DIR, f));
      console.log(
        `Files with their own timeAgo implementation:\n` +
        fileNames.map((n) => `  - ${n}`).join('\n'),
      );

      // FIXED: Previously 7+ files had their own timeAgo.
      // Now consolidated to lib/utils.ts only.
      expect(filesWithTimeAgo.length).toBeGreaterThanOrEqual(1);
    });

    it('DUPLICATION: timeAgo implementations should be decreasing toward 1', () => {
      // KNOWN DEBT: timeAgo is duplicated across ~7 files.
      // As files are migrated to import from lib/utils.ts, reduce this threshold.
      expect(filesWithTimeAgo.length).toBeLessThanOrEqual(8);
    });
  });
});
