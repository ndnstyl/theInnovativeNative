/**
 * Security Test: Row Level Security (RLS) Exposure Surface Audit
 *
 * Audits all hook files to catalog:
 * 1. Which Supabase tables they query
 * 2. Whether they use .select('*') on sensitive tables
 * 3. Whether admin hooks verify role before making queries
 * 4. Whether write operations check session first
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC_DIR = path.resolve(__dirname, '../../');
const HOOKS_DIR = path.resolve(SRC_DIR, 'hooks');

// ─── Helpers ───────────────────────────────────────────────────────────────────

function readFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8');
}

function getAllHookFiles(): { name: string; path: string; content: string }[] {
  if (!fs.existsSync(HOOKS_DIR)) return [];
  return fs
    .readdirSync(HOOKS_DIR)
    .filter((f) => f.endsWith('.ts') || f.endsWith('.tsx'))
    .map((name) => ({
      name,
      path: path.join(HOOKS_DIR, name),
      content: readFile(path.join(HOOKS_DIR, name)),
    }));
}

// ─── Sensitive tables ──────────────────────────────────────────────────────────

const SENSITIVE_TABLES = [
  'profiles',
  'auth.users',
  'community_members',
  'content_reports',
  'dashboard_metrics',
  'audit_log',
];

const ADMIN_HOOKS = [
  'useAdminCourses',
  'useAdminMetrics',
  'useMemberManagement',
  'useModeration',
  'useAuditLog',
  'useCommunitySettings',
  'useLevelConfig',
];

const WRITE_OPERATIONS = ['.insert(', '.update(', '.delete(', '.upsert('];

// ─── Types ─────────────────────────────────────────────────────────────────────

interface TableUsage {
  hook: string;
  table: string;
  operation: 'select' | 'insert' | 'update' | 'delete' | 'rpc' | 'storage';
  selectsStar: boolean;
  line: number;
}

interface WriteWithoutSessionCheck {
  hook: string;
  operation: string;
  table: string;
  line: number;
}

// ─── Analysis ──────────────────────────────────────────────────────────────────

function analyzeTableUsage(
  hookName: string,
  content: string
): TableUsage[] {
  const usages: TableUsage[] = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Match .from('table_name')
    const fromMatch = line.match(/\.from\(['"]([^'"]+)['"]\)/);
    if (fromMatch) {
      const table = fromMatch[1];

      // Look ahead for the operation
      const context = lines.slice(i, Math.min(i + 5, lines.length)).join('\n');
      let operation: TableUsage['operation'] = 'select';
      if (context.includes('.insert(')) operation = 'insert';
      else if (context.includes('.update(')) operation = 'update';
      else if (context.includes('.delete()')) operation = 'delete';

      // Check for .select('*')
      const selectsStar =
        context.includes(".select('*')") || context.includes('.select("*")');

      usages.push({
        hook: hookName,
        table,
        operation,
        selectsStar,
        line: i + 1,
      });
    }

    // Match .rpc('function_name')
    const rpcMatch = line.match(/\.rpc\(['"]([^'"]+)['"]/);
    if (rpcMatch) {
      usages.push({
        hook: hookName,
        table: `rpc:${rpcMatch[1]}`,
        operation: 'rpc',
        selectsStar: false,
        line: i + 1,
      });
    }

    // Match .storage.from('bucket')
    const storageMatch = line.match(/\.storage[\s\n]*\.from\(['"]([^'"]+)['"]\)/);
    if (storageMatch) {
      usages.push({
        hook: hookName,
        table: `storage:${storageMatch[1]}`,
        operation: 'storage',
        selectsStar: false,
        line: i + 1,
      });
    }
  }

  return usages;
}

function findWritesWithoutSessionCheck(
  hookName: string,
  content: string
): WriteWithoutSessionCheck[] {
  const issues: WriteWithoutSessionCheck[] = [];
  const lines = content.split('\n');

  // Does the hook destructure session from useAuth?
  const checksSessionGlobal =
    content.includes('session') &&
    (content.includes('if (!session') ||
      content.includes('if(!session') ||
      content.includes('session?.user?.id') ||
      content.includes('session?.user'));

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    for (const op of WRITE_OPERATIONS) {
      if (line.includes(op)) {
        // Check the surrounding function context for session guard
        // Look back up to 15 lines for a session check
        const precedingLines = lines
          .slice(Math.max(0, i - 15), i)
          .join('\n');
        const hasLocalSessionCheck =
          precedingLines.includes('!session') ||
          precedingLines.includes('session?.user') ||
          precedingLines.includes('if (!supabaseClient') ||
          precedingLines.includes('if(!supabaseClient');

        // Match table name from surrounding context
        const contextBefore = lines
          .slice(Math.max(0, i - 5), i + 1)
          .join('\n');
        const tableMatch = contextBefore.match(
          /\.from\(['"]([^'"]+)['"]\)/
        );
        const table = tableMatch ? tableMatch[1] : 'unknown';

        if (!hasLocalSessionCheck && !checksSessionGlobal) {
          issues.push({
            hook: hookName,
            operation: op.replace(/[()]/g, ''),
            table,
            line: i + 1,
          });
        }
      }
    }
  }

  return issues;
}

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe('RLS Exposure Surface Audit', () => {
  const hookFiles = getAllHookFiles();
  let allUsages: TableUsage[] = [];
  let allWriteIssues: WriteWithoutSessionCheck[] = [];

  beforeAll(() => {
    for (const hook of hookFiles) {
      allUsages.push(...analyzeTableUsage(hook.name, hook.content));
      allWriteIssues.push(
        ...findWritesWithoutSessionCheck(hook.name, hook.content)
      );
    }
  });

  // ── Table catalog ─────────────────────────────────────────────────────────
  describe('Table usage catalog', () => {
    it('should find hooks with table queries', () => {
      expect(hookFiles.length).toBeGreaterThan(0);
      expect(allUsages.length).toBeGreaterThan(0);

      // Print full catalog
      const tableMap = new Map<string, string[]>();
      for (const u of allUsages) {
        const existing = tableMap.get(u.table) || [];
        if (!existing.includes(u.hook)) {
          existing.push(u.hook);
          tableMap.set(u.table, existing);
        }
      }

      console.warn('\n[RLS CATALOG] Tables accessed by hooks:');
      for (const [table, hooks] of Array.from(tableMap.entries()).sort()) {
        console.warn(`  ${table}: ${hooks.join(', ')}`);
      }
    });
  });

  // ── select('*') on sensitive tables ───────────────────────────────────────
  describe('select("*") on sensitive tables', () => {
    it('should flag select("*") usage on sensitive tables', () => {
      const starSelects = allUsages.filter(
        (u) => u.selectsStar && SENSITIVE_TABLES.includes(u.table)
      );

      if (starSelects.length > 0) {
        console.warn(
          `\n[RLS WARNING] .select('*') on sensitive tables (${starSelects.length} occurrences):`
        );
        for (const s of starSelects) {
          console.warn(
            `  ${s.hook}:${s.line} - ${s.table}.select('*')`
          );
        }
        console.warn(
          '  Recommendation: Select only needed columns to minimize data exposure ' +
            'even if RLS policies are in place. This follows the principle of least privilege.'
        );
      }

      // We expect some star selects (e.g., useAdminCourses selects * on courses)
      // but flag any on truly sensitive tables
      for (const s of starSelects) {
        console.warn(
          `[ACTION] ${s.hook} selects all columns from ${s.table} -- narrow the select clause`
        );
      }
    });

    it('should flag any select("*") on profiles table', () => {
      const profileStarSelects = allUsages.filter(
        (u) => u.selectsStar && u.table === 'profiles'
      );

      if (profileStarSelects.length > 0) {
        console.warn(
          `[RLS WARNING] ${profileStarSelects.length} hook(s) select all columns from profiles:`
        );
        profileStarSelects.forEach((s) =>
          console.warn(`  ${s.hook}:${s.line}`)
        );
        console.warn(
          '  profiles may contain email, phone, or other PII. ' +
            'Hooks should select only needed fields (display_name, avatar_url, username).'
        );
      }
    });

    it('should report all select("*") usage across all tables', () => {
      const allStarSelects = allUsages.filter((u) => u.selectsStar);

      console.warn(
        `\n[RLS INFO] Total .select('*') usage: ${allStarSelects.length}`
      );
      for (const s of allStarSelects) {
        console.warn(`  ${s.hook}:${s.line} - ${s.table}`);
      }
    });
  });

  // ── Admin hooks role verification ─────────────────────────────────────────
  describe('Admin hooks role verification', () => {
    it('should verify admin hooks check role or rely on documented RLS', () => {
      const adminFindings: {
        hook: string;
        hasRoleCheck: boolean;
        hasSessionCheck: boolean;
        reliesOnRlsOnly: boolean;
      }[] = [];

      for (const hook of hookFiles) {
        const isAdmin = ADMIN_HOOKS.some((ah) => hook.name.includes(ah));
        if (!isAdmin) continue;

        const hasRoleCheck =
          hook.content.includes('role') &&
          (hook.content.includes("role === 'admin'") ||
            hook.content.includes("role === 'owner'") ||
            hook.content.includes('requiredRole'));
        const hasSessionCheck =
          hook.content.includes('!session') ||
          hook.content.includes('session?.user');

        adminFindings.push({
          hook: hook.name,
          hasRoleCheck,
          hasSessionCheck,
          reliesOnRlsOnly: !hasRoleCheck,
        });
      }

      if (adminFindings.length > 0) {
        console.warn('\n[RLS ADMIN AUDIT]');
        for (const f of adminFindings) {
          if (f.reliesOnRlsOnly) {
            console.warn(
              `  [RELIES ON RLS ONLY] ${f.hook} - No client-side role check. ` +
                `Session check: ${f.hasSessionCheck}. ` +
                'This hook relies entirely on Supabase RLS policies to restrict access. ' +
                'If RLS policies are misconfigured, any authenticated user could access admin data.'
            );
          } else {
            console.warn(
              `  [OK] ${f.hook} - Has role check: ${f.hasRoleCheck}, session check: ${f.hasSessionCheck}`
            );
          }
        }
      }

      // Most admin hooks rely on RLS -- document this pattern
      const rlsOnlyHooks = adminFindings.filter((f) => f.reliesOnRlsOnly);
      if (rlsOnlyHooks.length > 0) {
        console.warn(
          `\n[RECOMMENDATION] ${rlsOnlyHooks.length} admin hook(s) have no client-side role check. ` +
            'While RLS provides server-side enforcement, adding client-side checks provides defense-in-depth ' +
            'and better error messages.'
        );
      }
    });
  });

  // ── Write operations without session check ────────────────────────────────
  describe('Write operations without session check', () => {
    it('should flag hooks that write data without checking session', () => {
      if (allWriteIssues.length > 0) {
        console.warn(
          `\n[RLS WARNING] Write operations without explicit session check (${allWriteIssues.length}):`
        );
        for (const issue of allWriteIssues) {
          console.warn(
            `  ${issue.hook}:${issue.line} - ${issue.operation} on ${issue.table}`
          );
        }
        console.warn(
          '  These operations rely entirely on RLS policies to prevent unauthorized writes. ' +
            'If a hook is called with an unauthenticated supabase client, the write will ' +
            'be rejected by RLS (which is correct), but the error handling may not be graceful.'
        );
      }

      // Informational -- we log but do not fail, since RLS is the primary guard
      // and many hooks check supabaseClient existence which is a form of guard
    });

    it('should verify usePostActions checks session for report and follow', () => {
      const postActions = hookFiles.find((h) =>
        h.name.includes('usePostActions')
      );
      if (!postActions) {
        console.warn('[SKIP] usePostActions.ts not found');
        return;
      }

      // reportPost and followPost should check session
      expect(postActions.content).toContain("!session?.user?.id");
    });

    it('should verify useProfile checks session before writes', () => {
      const profile = hookFiles.find((h) => h.name.includes('useProfile'));
      if (!profile) {
        console.warn('[SKIP] useProfile.ts not found');
        return;
      }

      // updateProfile should check session
      expect(profile.content).toContain("!session?.user?.id");
    });

    it('should verify useMediaUpload checks supabaseClient', () => {
      const upload = hookFiles.find((h) =>
        h.name.includes('useMediaUpload')
      );
      if (!upload) {
        console.warn('[SKIP] useMediaUpload.ts not found');
        return;
      }

      expect(upload.content).toContain('!supabaseClient');
    });
  });

  // ── Storage bucket access ─────────────────────────────────────────────────
  describe('Storage bucket access', () => {
    it('should catalog storage bucket usage', () => {
      const storageUsages = allUsages.filter((u) => u.operation === 'storage');

      if (storageUsages.length > 0) {
        console.warn('\n[STORAGE AUDIT] Storage buckets accessed by hooks:');
        for (const u of storageUsages) {
          console.warn(`  ${u.hook}:${u.line} - ${u.table}`);
        }
        console.warn(
          '  Verify that storage bucket RLS policies restrict upload/download to authenticated users.'
        );
      }
    });
  });

  // ── RPC function calls ────────────────────────────────────────────────────
  describe('RPC function calls', () => {
    it('should catalog all RPC function usage', () => {
      const rpcUsages = allUsages.filter((u) => u.operation === 'rpc');

      if (rpcUsages.length > 0) {
        console.warn('\n[RPC AUDIT] Server-side functions called by hooks:');
        for (const u of rpcUsages) {
          console.warn(`  ${u.hook}:${u.line} - ${u.table}`);
        }
        console.warn(
          '  RPC functions execute with SECURITY DEFINER or INVOKER permissions. ' +
            'Verify that SECURITY DEFINER functions have proper authorization checks ' +
            'built into the function body.'
        );
      }

      // Specifically flag admin RPCs
      const adminRpcs = rpcUsages.filter(
        (u) =>
          u.table.includes('change_member_role') ||
          u.table.includes('ban_member') ||
          u.table.includes('unban_member') ||
          u.table.includes('remove_content') ||
          u.table.includes('log_admin_action')
      );

      if (adminRpcs.length > 0) {
        console.warn(
          '\n[RPC CRITICAL] Admin-level RPC functions called from client:'
        );
        for (const u of adminRpcs) {
          console.warn(`  ${u.hook}:${u.line} - ${u.table}`);
        }
        console.warn(
          '  These functions MUST have SECURITY DEFINER with internal role checks. ' +
            'If they use SECURITY INVOKER, any authenticated user could call them.'
        );
      }
    });
  });

  // ── Summary ───────────────────────────────────────────────────────────────
  describe('Summary', () => {
    it('should produce a complete RLS audit summary', () => {
      const uniqueTables = new Set(allUsages.map((u) => u.table));
      const writeOps = allUsages.filter(
        (u) =>
          u.operation === 'insert' ||
          u.operation === 'update' ||
          u.operation === 'delete'
      );
      const starSelects = allUsages.filter((u) => u.selectsStar);

      console.warn('\n[RLS AUDIT SUMMARY]');
      console.warn(`  Hooks analyzed: ${hookFiles.length}`);
      console.warn(`  Unique tables/RPCs accessed: ${uniqueTables.size}`);
      console.warn(`  Total query operations: ${allUsages.length}`);
      console.warn(`  Write operations: ${writeOps.length}`);
      console.warn(`  select('*') usage: ${starSelects.length}`);
      console.warn(
        `  Writes without session check: ${allWriteIssues.length}`
      );
    });
  });
});
