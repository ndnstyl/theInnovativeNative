/**
 * Slug Removal Integration Test — CRITICAL BUG DETECTION
 * ========================================================
 * The `slug` column was removed from the courses and lessons tables in
 * Supabase. Any code that still queries `.eq('slug', ...)` against these
 * tables is broken at runtime — Supabase returns a 400/empty result.
 *
 * This test suite:
 *   1. Scans all classroom page files for leftover `.eq('slug', ...)` queries
 *   2. Verifies CourseCard links by ID, not slug
 *   3. Verifies the admin course list page routes by ID
 *   4. Flags the known-broken lesson editor page
 *
 * KNOWN BUG: pages/classroom/admin/[courseSlug]/lessons/[lessonSlug].tsx
 *   still queries both courses and lessons by slug. This page is broken
 *   in production. The fix is to query by ID (the URL already passes IDs
 *   from the edit page's lesson links).
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC_DIR = path.resolve(__dirname, '../../');
const CLASSROOM_PAGES_DIR = path.join(SRC_DIR, 'pages/classroom');
const COMPONENTS_DIR = path.join(SRC_DIR, 'components/classroom');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function collectFiles(dir: string, ext: RegExp): string[] {
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

function getSlugQueries(filePath: string): { line: number; text: string }[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const hits: { line: number; text: string }[] = [];
  lines.forEach((line: string, idx: number) => {
    // Match Supabase-style .eq('slug', ...) queries
    if (/\.eq\(\s*['"]slug['"]\s*,/.test(line)) {
      hits.push({ line: idx + 1, text: line.trim() });
    }
  });
  return hits;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Slug column removal compliance', () => {
  const classroomPageFiles = collectFiles(CLASSROOM_PAGES_DIR, /\.(tsx?|jsx?)$/);
  const classroomComponentFiles = collectFiles(COMPONENTS_DIR, /\.(tsx?|jsx?)$/);

  it('should find classroom page files to scan', () => {
    expect(classroomPageFiles.length).toBeGreaterThan(0);
  });

  describe('Classroom pages — no file should query by slug', () => {
    // Build a map of file -> slug query hits
    const fileHits = new Map<string, { line: number; text: string }[]>();
    for (const file of classroomPageFiles) {
      const hits = getSlugQueries(file);
      if (hits.length > 0) {
        fileHits.set(path.relative(SRC_DIR, file), hits);
      }
    }

    it('should have ZERO files with .eq("slug", ...) queries', () => {
      // KNOWN BUG: this test intentionally fails to document the broken page.
      //
      // pages/classroom/admin/[courseSlug]/lessons/[lessonSlug].tsx
      // queries courses.slug AND lessons.slug — both columns no longer exist.
      //
      // FIX: replace .eq('slug', courseSlug) with .eq('id', courseSlug)
      //      replace .eq('slug', lessonSlug) with .eq('id', lessonSlug)
      //      The parent edit page already links using lesson.id in the URL.
      if (fileHits.size > 0) {
        const summary = Array.from(fileHits.entries())
          .map(([file, hits]) => {
            const lines = hits.map((h) => `  L${h.line}: ${h.text}`).join('\n');
            return `${file}\n${lines}`;
          })
          .join('\n\n');

        // We deliberately FAIL here so the bug is visible in test output.
        expect(fileHits.size).toBe(0);
        // If Jest stops at the first assertion, this message helps in the log:
        console.error(
          `SLUG BUG: ${fileHits.size} file(s) still query by slug:\n\n${summary}`,
        );
      }
    });
  });

  describe('Fixed: lesson editor page (regression guard)', () => {
    const lessonEditorPath = path.join(
      CLASSROOM_PAGES_DIR,
      'admin/[courseSlug]/lessons/[lessonSlug].tsx',
    );

    it('lesson editor page exists', () => {
      expect(fs.existsSync(lessonEditorPath)).toBe(true);
    });

    it('lesson editor no longer queries courses by slug', () => {
      const content = fs.readFileSync(lessonEditorPath, 'utf-8');
      const hasCourseSlugQuery = content.includes(".eq('slug', courseSlug");
      expect(hasCourseSlugQuery).toBe(false);
    });

    it('lesson editor no longer queries lessons by slug', () => {
      const content = fs.readFileSync(lessonEditorPath, 'utf-8');
      const hasLessonSlugQuery = content.includes(".eq('slug', lessonSlug");
      expect(hasLessonSlugQuery).toBe(false);
    });

    it('lesson editor uses id-based queries', () => {
      const content = fs.readFileSync(lessonEditorPath, 'utf-8');
      expect(content).toContain(".eq('id',");
    });
  });

  describe('CourseCard uses ID-based routing, not slug', () => {
    const courseCardPath = path.join(COMPONENTS_DIR, 'CourseCard.tsx');

    it('CourseCard.tsx exists', () => {
      expect(fs.existsSync(courseCardPath)).toBe(true);
    });

    it('links to /classroom/${course.id} not /classroom/${course.slug}', () => {
      const content = fs.readFileSync(courseCardPath, 'utf-8');
      // Should use course.id in the Link href
      expect(content).toContain('course.id');
      // Should NOT reference course.slug anywhere
      expect(content).not.toContain('course.slug');
    });
  });

  describe('Admin course edit page uses ID-based queries', () => {
    const editPagePath = path.join(
      CLASSROOM_PAGES_DIR,
      'admin/[courseSlug]/edit.tsx',
    );

    it('edit page exists', () => {
      expect(fs.existsSync(editPagePath)).toBe(true);
    });

    it('queries courses by id, not slug', () => {
      const content = fs.readFileSync(editPagePath, 'utf-8');
      // The edit page should have already been migrated to use .eq('id', ...)
      expect(content).toContain(".eq('id',");
      // It should NOT query by slug
      const slugHits = getSlugQueries(editPagePath);
      expect(slugHits.length).toBe(0);
    });

    it('links to lesson editor using lesson.id', () => {
      const content = fs.readFileSync(editPagePath, 'utf-8');
      // The edit page links should use lesson.id, not lesson.slug
      expect(content).toContain('lesson.id');
    });
  });

  describe('Admin courses index page routes by ID', () => {
    const adminIndexPath = path.join(CLASSROOM_PAGES_DIR, 'admin/index.tsx');

    it('admin index page exists', () => {
      expect(fs.existsSync(adminIndexPath)).toBe(true);
    });

    it('routes to /classroom/admin/${course.id}/edit', () => {
      const content = fs.readFileSync(adminIndexPath, 'utf-8');
      // After creation, pushes to course.id-based route
      expect(content).toContain('course.id');
    });
  });

  describe('Classroom components — no slug references in DB queries', () => {
    it('no component queries Supabase by slug column', () => {
      const allHits: { file: string; hits: { line: number; text: string }[] }[] = [];

      for (const file of classroomComponentFiles) {
        const hits = getSlugQueries(file);
        if (hits.length > 0) {
          allHits.push({ file: path.relative(SRC_DIR, file), hits });
        }
      }

      if (allHits.length > 0) {
        const summary = allHits
          .map((entry) => {
            const lines = entry.hits.map((h) => `  L${h.line}: ${h.text}`).join('\n');
            return `${entry.file}\n${lines}`;
          })
          .join('\n\n');
        console.error(`Components still querying by slug:\n${summary}`);
      }

      expect(allHits.length).toBe(0);
    });
  });
});
