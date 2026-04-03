/**
 * WCAG Accessibility: Form Label Association Tests
 * ==================================================
 * Verifies that all form inputs have associated labels via
 * htmlFor/id pairing, aria-label, or aria-labelledby.
 *
 * WCAG 2.1 SC 1.3.1 — Info and Relationships
 * WCAG 2.1 SC 4.1.2 — Name, Role, Value
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

/**
 * Extracts the full JSX opening tag (from `<tag` to the closing `>` or `/>`)
 * starting at the given line index. Handles multi-line JSX attributes.
 * Uses brace-depth tracking to avoid matching `>` inside JSX expressions like
 * arrow functions or ternaries.
 */
function extractElementBlock(lines: string[], startIdx: number): string {
  let block = '';
  let braceDepth = 0;

  for (let i = startIdx; i < Math.min(lines.length, startIdx + 20); i++) {
    const line = lines[i];
    block += line + '\n';

    // Track curly braces to know if we're inside a JSX expression
    for (const ch of line) {
      if (ch === '{') braceDepth++;
      else if (ch === '}') braceDepth--;
    }

    // Only consider > or /> as the tag end when not inside a JSX expression
    if (braceDepth === 0 && /^\s*(\/?>|.*[^=]>)\s*$/.test(line)) break;
  }
  return block;
}

/**
 * Checks that every <input, <textarea, and <select in a component source
 * has at least one of: aria-label, aria-labelledby, id with matching htmlFor,
 * or is wrapped inside a <label> element.
 *
 * Returns an array of line numbers with unlabeled inputs.
 */
function findUnlabeledInputs(src: string): { line: number; text: string }[] {
  const lines = src.split('\n');
  const unlabeled: { line: number; text: string }[] = [];

  // Collect all htmlFor values
  const htmlForIds = new Set<string>();

  lines.forEach((line) => {
    const htmlForMatch = line.match(/htmlFor=["']([^"']+)["']/);
    if (htmlForMatch) htmlForIds.add(htmlForMatch[1]);
  });

  lines.forEach((line, idx) => {
    // Match input, textarea, select elements (but not type="hidden" or type="submit")
    const isFormElement = /<(?:input|textarea|select)\b/.test(line);
    if (!isFormElement) return;

    // Get the full multi-line element block
    const block = extractElementBlock(lines, idx);

    // Skip hidden inputs and submit buttons
    if (/type=["']hidden["']/.test(block) || /type=["']submit["']/.test(block)) return;

    // Check for aria-label in the block
    if (/aria-label=/.test(block)) return;

    // Check for aria-labelledby in the block
    if (/aria-labelledby=/.test(block)) return;

    // Check for id with matching htmlFor in the block
    const idMatch = block.match(/\bid=["']([^"']+)["']/);
    if (idMatch && htmlForIds.has(idMatch[1])) return;

    // Check if the input has a wrapping <label> on the same or adjacent lines
    let hasWrappingLabel = false;
    for (let i = Math.max(0, idx - 3); i <= idx; i++) {
      if (/<label[\s>]/.test(lines[i]) && !/<\/label>/.test(lines[i])) {
        for (let j = idx; j < Math.min(lines.length, idx + 5); j++) {
          if (/<\/label>/.test(lines[j])) {
            hasWrappingLabel = true;
            break;
          }
        }
      }
    }
    if (hasWrappingLabel) return;

    unlabeled.push({ line: idx + 1, text: line.trim() });
  });

  return unlabeled;
}

// ---------------------------------------------------------------------------
// PostComposer
// ---------------------------------------------------------------------------
describe('PostComposer form labels', () => {
  const src = readComponent('components/community/feed/PostComposer.tsx');

  it('category select has an accessible label', () => {
    const unlabeled = findUnlabeledInputs(src);
    const selectIssues = unlabeled.filter(u => u.text.includes('<select'));
    expect(selectIssues).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// InvitationForm
// ---------------------------------------------------------------------------
describe('InvitationForm form labels', () => {
  const src = readComponent('components/members/InvitationForm.tsx');

  it('email input has an associated label', () => {
    const unlabeled = findUnlabeledInputs(src);
    const emailIssues = unlabeled.filter(u =>
      u.text.includes('type="email"') || u.text.includes('invite-email'),
    );
    expect(emailIssues).toHaveLength(0);
  });

  it('message textarea has an associated label', () => {
    const unlabeled = findUnlabeledInputs(src);
    const textareaIssues = unlabeled.filter(u => u.text.includes('<textarea'));
    expect(textareaIssues).toHaveLength(0);
  });

  it('has no unlabeled form controls', () => {
    const unlabeled = findUnlabeledInputs(src);
    if (unlabeled.length > 0) {
      console.warn(
        'Unlabeled inputs in InvitationForm:\n' +
        unlabeled.map(u => `  Line ${u.line}: ${u.text}`).join('\n'),
      );
    }
    expect(unlabeled).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// MembershipQuestions
// ---------------------------------------------------------------------------
describe('MembershipQuestions form labels', () => {
  const src = readComponent('components/members/MembershipQuestions.tsx');

  it('edit text input has an accessible label', () => {
    const unlabeled = findUnlabeledInputs(src);
    // The editing text input should have aria-label
    const textInputIssues = unlabeled.filter(u =>
      u.text.includes('type="text"') && !u.text.includes('type="checkbox"'),
    );
    expect(textInputIssues).toHaveLength(0);
  });

  it('new question input has an accessible label', () => {
    const unlabeled = findUnlabeledInputs(src);
    const newInputIssues = unlabeled.filter(u =>
      u.text.includes('New question'),
    );
    expect(newInputIssues).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// CommunitySettings
// ---------------------------------------------------------------------------
describe('CommunitySettings form labels', () => {
  const src = readComponent('components/members/CommunitySettings.tsx');

  it('toggle button has an aria-label', () => {
    // The toggle button already has aria-label — verify it
    expect(src).toContain('aria-label=');
  });
});
