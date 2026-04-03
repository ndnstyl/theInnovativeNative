/**
 * WCAG Accessibility: aria-live Region Tests
 * =============================================
 * Verifies that async error/success message containers include
 * aria-live="polite" and appropriate role attributes so screen
 * readers announce dynamic content changes.
 *
 * WCAG 2.1 SC 4.1.3 — Status Messages
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC_DIR = path.resolve(__dirname, '../../');

function readComponent(relativePath: string): string {
  const full = path.join(SRC_DIR, relativePath);
  if (!fs.existsSync(full)) {
    throw new Error(`Component not found: ${full}`);
  }
  return fs.readFileSync(full, 'utf-8');
}

// ---------------------------------------------------------------------------
// FeedPage — feed loading errors
// ---------------------------------------------------------------------------
describe('FeedPage aria-live', () => {
  const src = readComponent('components/community/feed/FeedPage.tsx');

  it('wraps the error container with aria-live="polite"', () => {
    expect(src).toContain('aria-live="polite"');
  });

  it('assigns role="alert" to the error container', () => {
    expect(src).toContain('role="alert"');
  });
});

// ---------------------------------------------------------------------------
// PostComposer — post submission errors
// ---------------------------------------------------------------------------
describe('PostComposer aria-live', () => {
  const src = readComponent('components/community/feed/PostComposer.tsx');

  it('wraps the error container with aria-live="polite"', () => {
    expect(src).toContain('aria-live="polite"');
  });

  it('assigns role="alert" to the error container', () => {
    expect(src).toContain('role="alert"');
  });
});

// ---------------------------------------------------------------------------
// LessonCompleteButton — completion toggle errors
// ---------------------------------------------------------------------------
describe('LessonCompleteButton aria-live', () => {
  const src = readComponent('components/classroom/LessonCompleteButton.tsx');

  it('includes an aria-live region for status changes', () => {
    expect(src).toContain('aria-live="polite"');
  });

  it('assigns role="status" to the status container', () => {
    expect(src).toContain('role="status"');
  });
});

// ---------------------------------------------------------------------------
// InvitationForm — invitation errors/success
// ---------------------------------------------------------------------------
describe('InvitationForm aria-live', () => {
  const src = readComponent('components/members/InvitationForm.tsx');

  it('wraps the feedback container with aria-live="polite"', () => {
    expect(src).toContain('aria-live="polite"');
  });

  it('assigns role="alert" to error feedback', () => {
    // Error feedback should announce immediately — the role attribute
    // may use a JSX expression that evaluates to "alert" for errors
    const hasLiteralAlert = src.includes('role="alert"');
    const hasDynamicAlert = /role=\{.*['"]alert['"]/.test(src);
    expect(hasLiteralAlert || hasDynamicAlert).toBe(true);
  });

  it('assigns role="status" to success feedback', () => {
    // Success feedback uses polite role="status" — may be dynamic
    const hasLiteralStatus = src.includes('role="status"');
    const hasDynamicStatus = /role=\{.*['"]status['"]/.test(src);
    expect(hasLiteralStatus || hasDynamicStatus).toBe(true);
  });
});
