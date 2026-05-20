/**
 * E2E Tests — Resource Pages (Feature 036)
 * Run: npx playwright test e2e/resources.spec.ts
 *
 * Covers:
 *   - /resources hub index renders and lists all resource cards
 *   - Each resource landing page renders with ResourceGate form
 *   - Form validation fires on empty submit
 *   - Returning visitor (localStorage flag set) skips form
 *   - Newsletter opt-in checkbox present in success state
 */
import { test, expect } from '@playwright/test';

const BASE = 'https://theinnovativenative.com';

// All 7 Tier-1 resource pages (6 existing + 1 new)
const RESOURCE_SLUGS = [
  '442-intake-math',
  '5-ai-tools-pi',
  'ai-governance-template-pi',
  'ai-tool-risk-chart',
  'heppner-one-pager',
  'insurance-ai-colossus',
  'demand-letter-matrix', // NEW in feature 036
];

// ─── Hub Index ────────────────────────────────────────────────────────────────

test.describe('/resources hub index', () => {
  test('loads with 200 status', async ({ page }) => {
    const response = await page.goto(`${BASE}/resources`, {
      waitUntil: 'domcontentloaded',
    });
    expect(response?.status()).toBe(200);
  });

  test('has hero heading and newsletter CTA', async ({ page }) => {
    await page.goto(`${BASE}/resources`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1')).toContainText(/Resources for PI Firm Owners/i);
    // Newsletter CTA banner links to /newsletter
    const newsletterLink = page.getByRole('link', { name: /Subscribe free/i });
    await expect(newsletterLink).toBeVisible();
    await expect(newsletterLink).toHaveAttribute('href', '/newsletter');
  });

  test('lists at least 7 resource cards with links', async ({ page }) => {
    await page.goto(`${BASE}/resources`, { waitUntil: 'domcontentloaded' });
    // Each resource is wrapped in an <a> linking to /resources/<slug>
    for (const slug of RESOURCE_SLUGS) {
      const link = page.locator(`a[href="/resources/${slug}"]`);
      await expect(link).toHaveCount(1);
    }
  });
});

// ─── Resource Landing Pages ───────────────────────────────────────────────────

test.describe('Resource landing pages', () => {
  for (const slug of RESOURCE_SLUGS) {
    test(`/resources/${slug} returns 200 and shows form`, async ({ page }) => {
      const response = await page.goto(`${BASE}/resources/${slug}`, {
        waitUntil: 'domcontentloaded',
      });
      expect(response?.status()).toBe(200);

      // Form fields must be visible
      await expect(page.locator('#rg-firstName')).toBeVisible();
      await expect(page.locator('#rg-email')).toBeVisible();

      // Submit button present with correct label
      await expect(
        page.getByRole('button', { name: /Get Free Access/i })
      ).toBeVisible();
    });
  }
});

// ─── Form Validation ──────────────────────────────────────────────────────────

test.describe('ResourceGate form validation', () => {
  test('empty submit shows field errors on required fields', async ({ page }) => {
    await page.goto(`${BASE}/resources/demand-letter-matrix`, {
      waitUntil: 'domcontentloaded',
    });

    // Click submit without filling anything
    await page.getByRole('button', { name: /Get Free Access/i }).click();

    // Both required fields should show errors (aria-invalid="true")
    await expect(page.locator('#rg-firstName')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
    await expect(page.locator('#rg-email')).toHaveAttribute(
      'aria-invalid',
      'true'
    );

    // Error text should be visible and associated via aria-describedby
    await expect(page.locator('#rg-firstName-error')).toBeVisible();
    await expect(page.locator('#rg-email-error')).toBeVisible();
  });

  test('invalid email format shows error', async ({ page }) => {
    await page.goto(`${BASE}/resources/demand-letter-matrix`, {
      waitUntil: 'domcontentloaded',
    });

    await page.locator('#rg-firstName').fill('Jane');
    await page.locator('#rg-email').fill('not-an-email');
    await page.getByRole('button', { name: /Get Free Access/i }).click();

    await expect(page.locator('#rg-email')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });

  test('honeypot field is present and hidden', async ({ page }) => {
    await page.goto(`${BASE}/resources/demand-letter-matrix`, {
      waitUntil: 'domcontentloaded',
    });

    // Honeypot has name="website", is aria-hidden, and has tabIndex -1
    const honeypot = page.locator('input[name="website"]');
    await expect(honeypot).toHaveCount(1);
    await expect(honeypot).toHaveAttribute('aria-hidden', 'true');
    await expect(honeypot).toHaveAttribute('tabindex', '-1');
  });
});

// ─── Returning Visitor Flow (localStorage) ────────────────────────────────────

test.describe('Returning visitor unlock flow', () => {
  test('localStorage flag skips form and shows download', async ({ page, context }) => {
    // Pre-seed localStorage to simulate a returning visitor
    await context.addInitScript(() => {
      window.localStorage.setItem(
        'tin_resource_downloaded_demand-letter-matrix',
        'true'
      );
    });

    await page.goto(`${BASE}/resources/demand-letter-matrix`, {
      waitUntil: 'domcontentloaded',
    });

    // Form should be skipped
    await expect(page.locator('#rg-firstName')).toHaveCount(0);

    // Download button should be immediately visible
    await expect(
      page.getByRole('link', { name: /Download Now/i })
    ).toBeVisible();
  });
});

// ─── Newsletter Opt-In UI Presence ────────────────────────────────────────────

test.describe('Newsletter opt-in in unlocked state', () => {
  test('checkbox visible after unlock with correct default', async ({
    page,
    context,
  }) => {
    await context.addInitScript(() => {
      window.localStorage.setItem(
        'tin_resource_downloaded_demand-letter-matrix',
        'true'
      );
    });

    await page.goto(`${BASE}/resources/demand-letter-matrix`, {
      waitUntil: 'domcontentloaded',
    });

    const checkbox = page.locator('#rg-newsletter-optin');
    await expect(checkbox).toBeVisible();
    await expect(checkbox).not.toBeChecked(); // unchecked by default per FR
  });
});

// ─── PPTX Download URLs Resolve ───────────────────────────────────────────────

test.describe('Lead magnet PPTX files are served', () => {
  for (const slug of RESOURCE_SLUGS) {
    test(`${slug} PPTX returns 200`, async ({ request }) => {
      // File names per data-model.md mapping
      const filenameMap: Record<string, string> = {
        '442-intake-math': '442-intake-math-pi.pptx',
        '5-ai-tools-pi': '5-ai-tools-pi-firms.pptx',
        'ai-governance-template-pi': 'ai-governance-template-pi.pptx',
        'ai-tool-risk-chart': 'heppner-tool-comparison-chart.pptx',
        'heppner-one-pager': 'heppner-executive-one-pager.pptx',
        'insurance-ai-colossus': 'insurance-ai-colossus-breakdown.pptx',
        'demand-letter-matrix': 'demand-letter-matrix.pptx',
      };

      const filename = filenameMap[slug];
      const response = await request.head(
        `${BASE}/assets/lead-magnets/${filename}`
      );
      // Allow 200 or 304 (cached). Must NOT be 404.
      expect([200, 304]).toContain(response.status());
    });
  }
});
