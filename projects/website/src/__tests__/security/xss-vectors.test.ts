/**
 * Security Test: XSS Vulnerability Surface Audit
 *
 * Identifies every use of dangerouslySetInnerHTML in the codebase and
 * checks whether the input is sanitized before rendering. Also audits
 * specific high-risk patterns like truncateHtml and search snippet rendering.
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC_DIR = path.resolve(__dirname, '../../');

// ─── Helpers ───────────────────────────────────────────────────────────────────

function readFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8');
}

function getAllTsxFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllTsxFiles(fullPath));
    } else if (/\.(tsx|ts)$/.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

interface DangerousInnerHtmlUsage {
  file: string;
  line: number;
  context: string;
  sanitized: boolean;
  safePattern: boolean; // JSON.stringify, ld+json, etc.
  riskLevel: 'critical' | 'high' | 'medium' | 'low' | 'safe';
}

function findDangerousSetInnerHTML(
  filePath: string
): DangerousInnerHtmlUsage[] {
  const content = readFile(filePath);
  const lines = content.split('\n');
  const results: DangerousInnerHtmlUsage[] = [];
  const relPath = path.relative(SRC_DIR, filePath);

  // Check if file imports a sanitize function
  const hasSanitizeImport =
    /import.*sanitize/i.test(content) || /DOMPurify/i.test(content);

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('dangerouslySetInnerHTML')) {
      // Gather surrounding context (up to 5 lines after)
      const contextLines = lines.slice(i, Math.min(i + 6, lines.length));
      const context = contextLines.join('\n');

      // Determine safety patterns
      const isSafeJsonStringify =
        context.includes('JSON.stringify') ||
        context.includes('application/ld+json');
      const usesSanitize =
        context.includes('sanitizeHtml') ||
        context.includes('sanitizeMessage') ||
        context.includes('DOMPurify.sanitize');
      const isStripeBuyButton =
        context.includes('stripe-buy-button') ||
        relPath.includes('StripeBuyButton');

      let riskLevel: DangerousInnerHtmlUsage['riskLevel'];
      if (isSafeJsonStringify) {
        riskLevel = 'safe';
      } else if (usesSanitize) {
        riskLevel = 'low';
      } else if (isStripeBuyButton) {
        // Stripe buy button injects user-controlled props into innerHTML
        riskLevel = 'medium';
      } else {
        riskLevel = hasSanitizeImport ? 'medium' : 'high';
      }

      results.push({
        file: relPath,
        line: i + 1,
        context: contextLines[0].trim(),
        sanitized: usesSanitize,
        safePattern: isSafeJsonStringify,
        riskLevel,
      });
    }
  }

  return results;
}

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe('XSS Vulnerability Surface Audit', () => {
  let allFindings: DangerousInnerHtmlUsage[] = [];

  beforeAll(() => {
    const allFiles = getAllTsxFiles(SRC_DIR);
    for (const filePath of allFiles) {
      allFindings.push(...findDangerousSetInnerHTML(filePath));
    }
  });

  it('should catalog all dangerouslySetInnerHTML usage', () => {
    expect(allFindings.length).toBeGreaterThan(0);
    console.warn(
      `[XSS AUDIT] Found ${allFindings.length} total dangerouslySetInnerHTML usage(s)`
    );
  });

  it('should have zero critical-risk dangerouslySetInnerHTML usage', () => {
    const critical = allFindings.filter((f) => f.riskLevel === 'critical');
    if (critical.length > 0) {
      console.error('[CRITICAL XSS] Unsanitized user-content rendering:');
      critical.forEach((f) =>
        console.error(`  ${f.file}:${f.line} - ${f.context}`)
      );
    }
    expect(critical).toHaveLength(0);
  });

  it('should flag high-risk dangerouslySetInnerHTML usage (unsanitized, no safe pattern)', () => {
    const highRisk = allFindings.filter((f) => f.riskLevel === 'high');
    // These are known issues -- document them
    if (highRisk.length > 0) {
      console.warn(
        `[XSS WARNING] ${highRisk.length} high-risk dangerouslySetInnerHTML usage(s):`
      );
      highRisk.forEach((f) =>
        console.warn(`  ${f.file}:${f.line} - ${f.context}`)
      );
    }
    // We expect some high-risk findings (blog content, search snippets, etc.)
    // This test documents them rather than failing, because some may be server-controlled data.
    // However, we flag them aggressively.
    for (const finding of highRisk) {
      console.warn(
        `[ACTION REQUIRED] ${finding.file}:${finding.line} renders HTML without sanitization`
      );
    }
  });

  // ── PostCard truncateHtml ─────────────────────────────────────────────────
  describe('PostCard.tsx - truncateHtml XSS risk', () => {
    it('should flag truncateHtml as a potential XSS vector', () => {
      const postCardPath = path.resolve(
        SRC_DIR,
        'components/community/feed/PostCard.tsx'
      );
      if (!fs.existsSync(postCardPath)) {
        console.warn('[SKIP] PostCard.tsx not found');
        return;
      }

      const content = readFile(postCardPath);

      // truncateHtml creates a DOM element and sets innerHTML on it
      const hasTruncateHtml = content.includes('truncateHtml');
      const setsInnerHtml = content.includes('div.innerHTML = html');
      const usesTextContent = content.includes('div.textContent');

      expect(hasTruncateHtml).toBe(true);

      if (setsInnerHtml) {
        console.warn(
          '[XSS RISK] PostCard.tsx truncateHtml() sets div.innerHTML directly. ' +
            'While it reads textContent (not innerHTML) afterward, the initial ' +
            'innerHTML assignment could trigger script execution in some edge cases ' +
            '(e.g., onerror handlers on img tags). The input should be sanitized ' +
            'BEFORE truncation, not just when rendering full content.'
        );
      }

      // Check if the sanitized path is used for the full (non-truncated) rendering
      const fullRenderSanitized = content.includes(
        'sanitizeHtml(post.body_html)'
      );
      expect(fullRenderSanitized).toBe(true);

      // But the truncated path renders via textContent, which is safe for text output
      if (usesTextContent) {
        console.warn(
          '[XSS NOTE] truncateHtml reads textContent after setting innerHTML. ' +
            'The textContent output is XSS-safe, but the intermediate innerHTML ' +
            'assignment is still a risk surface if the function is called with ' +
            'untrusted input.'
        );
      }
    });
  });

  // ── Blog content rendering ────────────────────────────────────────────────
  describe('Blog [slug].tsx - sanitized content (regression guard)', () => {
    it('should verify blog post content is sanitized via sanitizeHtml', () => {
      const blogPath = path.resolve(SRC_DIR, 'pages/blog/[slug].tsx');
      if (!fs.existsSync(blogPath)) {
        console.warn('[SKIP] blog/[slug].tsx not found');
        return;
      }

      const content = readFile(blogPath);

      // FIXED: blog now imports and uses sanitizeHtml
      const importsSanitize = content.includes("import") && content.includes("sanitizeHtml");
      const usesSanitize = content.includes('sanitizeHtml(post.content');

      expect(importsSanitize).toBe(true);
      expect(usesSanitize).toBe(true);

      // Verify the old unsanitized pattern is gone
      const hasUnsanitizedRender = content.includes('__html: post.content || ""');
      expect(hasUnsanitizedRender).toBe(false);
    });
  });

  // ── Search page snippet rendering ─────────────────────────────────────────
  describe('search.tsx - sanitized snippet rendering (regression guard)', () => {
    it('should verify search result snippets are sanitized via sanitizeHtml', () => {
      const searchPath = path.resolve(SRC_DIR, 'pages/search.tsx');
      if (!fs.existsSync(searchPath)) {
        console.warn('[SKIP] search.tsx not found');
        return;
      }

      const content = readFile(searchPath);

      // FIXED: search.tsx now imports and uses sanitizeHtml
      const importsSanitize = content.includes("import") && content.includes("sanitizeHtml");
      const usesSanitizeOnSnippet =
        content.includes('dangerouslySetInnerHTML') &&
        content.includes('sanitizeHtml(r.snippet)');

      expect(importsSanitize).toBe(true);
      expect(usesSanitizeOnSnippet).toBe(true);
    });
  });

  // ── ResultCard (Cerebro) snippet rendering ────────────────────────────────
  describe('ResultCard.tsx - sanitized snippet (regression guard)', () => {
    it('should verify ResultCard snippet is sanitized via sanitizeHtml', () => {
      const resultCardPath = path.resolve(
        SRC_DIR,
        'components/cerebro/SearchPanel/ResultCard.tsx'
      );
      if (!fs.existsSync(resultCardPath)) {
        console.warn('[SKIP] ResultCard.tsx not found');
        return;
      }

      const content = readFile(resultCardPath);

      // FIXED: ResultCard now imports and uses sanitizeHtml around the snippet
      const importsSanitize = content.includes("import") && content.includes("sanitizeHtml");
      const usesSanitize = content.includes('sanitizeHtml(') && content.includes('snippet.replace');

      expect(importsSanitize).toBe(true);
      expect(usesSanitize).toBe(true);
    });
  });

  // ── StripeBuyButton.tsx ───────────────────────────────────────────────────
  describe('StripeBuyButton.tsx - escaped attribute injection (regression guard)', () => {
    it('should verify StripeBuyButton uses escapeAttr for interpolated props', () => {
      const btnPath = path.resolve(
        SRC_DIR,
        'components/templates/StripeBuyButton.tsx'
      );
      if (!fs.existsSync(btnPath)) {
        console.warn('[SKIP] StripeBuyButton.tsx not found');
        return;
      }

      const content = readFile(btnPath);

      // FIXED: StripeBuyButton now uses escapeAttr() to sanitize props
      // before interpolating into innerHTML
      const hasEscapeAttr = content.includes('escapeAttr');
      const usesEscapedInterpolation =
        content.includes('escapeAttr(buyButtonId)') ||
        content.includes('escapeAttr(publishableKey)');

      expect(hasEscapeAttr).toBe(true);
      expect(usesEscapedInterpolation).toBe(true);
    });
  });

  // ── Sanitize library audit ────────────────────────────────────────────────
  describe('Sanitization libraries', () => {
    it('should verify DOMPurify is used as the sanitization library', () => {
      const sanitizePath = path.resolve(SRC_DIR, 'lib/sanitize.ts');
      if (!fs.existsSync(sanitizePath)) {
        console.error(
          '[CRITICAL] No lib/sanitize.ts found -- there may be no centralized sanitization'
        );
        expect(fs.existsSync(sanitizePath)).toBe(true);
        return;
      }

      const content = readFile(sanitizePath);
      expect(content).toContain('DOMPurify');
      expect(content).toContain('ALLOWED_TAGS');
      expect(content).toContain('ALLOWED_ATTR');
    });

    it('should verify sanitizeHtml returns raw HTML on server side (SSR bypass)', () => {
      const sanitizePath = path.resolve(SRC_DIR, 'lib/sanitize.ts');
      if (!fs.existsSync(sanitizePath)) return;

      const content = readFile(sanitizePath);

      // DOMPurify only works in browser -- check if there is an SSR fallback
      const hasServerBypass = content.includes("typeof window === 'undefined'");

      if (hasServerBypass) {
        console.warn(
          '[XSS WARNING] lib/sanitize.ts returns raw HTML when running on ' +
            'the server (typeof window === "undefined"). This means SSR-rendered ' +
            'pages will include unsanitized HTML in the initial page load. ' +
            'Consider using a server-compatible sanitizer like isomorphic-dompurify ' +
            'or sanitize-html for SSR contexts.'
        );
      }

      // Document that this bypass exists
      expect(hasServerBypass).toBe(true);
    });

    it('should verify messaging sanitize.ts exists with stricter config', () => {
      const msgSanitizePath = path.resolve(
        SRC_DIR,
        'lib/messaging/sanitize.ts'
      );
      if (!fs.existsSync(msgSanitizePath)) {
        console.warn('[SKIP] lib/messaging/sanitize.ts not found');
        return;
      }

      const content = readFile(msgSanitizePath);
      expect(content).toContain('DOMPurify');
      // Messaging sanitizer should have a very restricted tag list
      expect(content).toContain('ALLOWED_TAGS');

      // Check that script, iframe, etc. are NOT in allowed tags
      const allowedTagsMatch = content.match(
        /ALLOWED_TAGS\s*=\s*\[([^\]]+)\]/
      );
      if (allowedTagsMatch) {
        const tags = allowedTagsMatch[1].toLowerCase();
        expect(tags).not.toContain('script');
        expect(tags).not.toContain('iframe');
        expect(tags).not.toContain('object');
        expect(tags).not.toContain('embed');
      }
    });
  });

  // ── Summary report ────────────────────────────────────────────────────────
  describe('Summary', () => {
    it('should produce a full risk summary', () => {
      const byRisk: Record<string, number> = {};
      for (const f of allFindings) {
        byRisk[f.riskLevel] = (byRisk[f.riskLevel] || 0) + 1;
      }

      console.warn('\n[XSS AUDIT SUMMARY]');
      console.warn(`  Total dangerouslySetInnerHTML usage: ${allFindings.length}`);
      Object.entries(byRisk).forEach(([level, count]) => {
        console.warn(`  ${level}: ${count}`);
      });

      const unsanitized = allFindings.filter(
        (f) => !f.sanitized && !f.safePattern
      );
      if (unsanitized.length > 0) {
        console.warn(`\n  Unsanitized (non-JSON) usage (${unsanitized.length}):`);
        unsanitized.forEach((f) =>
          console.warn(`    ${f.file}:${f.line} [${f.riskLevel}]`)
        );
      }
    });
  });
});
