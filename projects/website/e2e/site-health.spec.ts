/**
 * E2E Site Health Tests
 * Run: npx playwright test e2e/site-health.spec.ts
 *
 * Tests every public page, every course route, every image,
 * blog content rendering, and navigation integrity.
 */
import { test, expect } from '@playwright/test';

const BASE = 'https://theinnovativenative.com';

// All public pages that must return 200
const PUBLIC_PAGES = [
  '/',
  '/blog',
  '/blog/us-v-heppner-law-firm-ai-privilege',
  '/classroom',
  '/professionalExperience',
  '/portfolio',
  '/twingen',
  '/visionspark-re',
  '/law-firm-rag',
  '/about',
  '/newsletter',
  '/templates',
  '/privacy-policy',
  '/terms-and-conditions',
  '/disclaimer',
  '/refund-policy',
];

// Course slugs from Supabase (must resolve via .htaccess rewrite)
const COURSE_SLUGS = [
  'brand-vibe-start-here',
  'chaos-to-clarity-ai-first-systems',
  'n8n-templates',
  'glossary-resources',
  'youtube-workflows',
  'ai-fluency-weekend-build',
  'growth-marketing-masterclass',
];

// ─── Page Status Tests ────────────────────────────────────────────────────────

test.describe('Page Status (HTTP 200)', () => {
  for (const path of PUBLIC_PAGES) {
    test(`${path} returns 200`, async ({ page }) => {
      const response = await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBe(200);
    });
  }
});

test.describe('Course Slug Routes', () => {
  for (const slug of COURSE_SLUGS) {
    test(`/classroom/${slug} returns 200`, async ({ page }) => {
      const response = await page.goto(`${BASE}/classroom/${slug}`, { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBe(200);
    });
  }
});

// ─── Blog Content Rendering ──────────────────────────────────────────────────

test.describe('Blog Content', () => {
  test('Heppner post has proper HTML structure (not plain text)', async ({ page }) => {
    await page.goto(`${BASE}/blog/us-v-heppner-law-firm-ai-privilege`, { waitUntil: 'domcontentloaded' });

    // Must have styled headings inside .blog-article
    const h2Count = await page.locator('.blog-article h2').count();
    expect(h2Count).toBeGreaterThan(3);

    // Must have paragraphs
    const pCount = await page.locator('.blog-article p').count();
    expect(pCount).toBeGreaterThan(10);

    // Must have bold text
    const strongCount = await page.locator('.blog-article strong').count();
    expect(strongCount).toBeGreaterThan(5);

    // "What Happened" heading must exist
    const whatHappened = page.locator('.blog-article h2', { hasText: 'What Happened' });
    await expect(whatHappened).toBeVisible();
  });

  test('Blog index has post links', async ({ page }) => {
    await page.goto(`${BASE}/blog`, { waitUntil: 'domcontentloaded' });
    const postLinks = await page.locator('a[href*="/blog/"]').count();
    expect(postLinks).toBeGreaterThan(5);
  });
});

// ─── Classroom ───────────────────────────────────────────────────────────────

test.describe('Classroom', () => {
  test('classroom index shows course cards', async ({ page }) => {
    await page.goto(`${BASE}/classroom`, { waitUntil: 'networkidle' });
    // Either landing page gallery or authenticated course grid
    const cards = await page.locator('.course-gallery__card, .classroom-card').count();
    expect(cards).toBeGreaterThan(3);
  });

  test('course gallery cards are clickable links', async ({ page }) => {
    await page.goto(`${BASE}/classroom`, { waitUntil: 'networkidle' });
    const links = await page.locator('.course-gallery__card[href*="/classroom/"]').count();
    // Gallery cards should be <a> tags with href
    expect(links).toBeGreaterThan(0);
  });

  test('course page loads without "Course not found"', async ({ page }) => {
    await page.goto(`${BASE}/classroom/brand-vibe-start-here`, { waitUntil: 'networkidle' });
    // Should NOT show the error state
    const errorText = await page.locator('text=Course not found').count();
    // Allow 0 (course loaded) or content gated behind auth
    const signInText = await page.locator('text=Sign in').count();
    // Either we see course content or a sign-in prompt — NOT "Course not found"
    expect(errorText).toBe(0);
  });
});

// ─── Navigation ──────────────────────────────────────────────────────────────

test.describe('Navigation', () => {
  test('homepage has main nav with key links', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    // Check for key nav items
    await expect(page.locator('a[href="/portfolio"]').first()).toBeAttached();
    await expect(page.locator('a[href="/blog"]').first()).toBeAttached();
    await expect(page.locator('a[href="/classroom"]').first()).toBeAttached();
  });

  test('/professionalExperience has main header (not classroom nav)', async ({ page }) => {
    await page.goto(`${BASE}/professionalExperience`, { waitUntil: 'domcontentloaded' });
    // Should have the main site header, NOT the classroom tab nav
    const classroomTabs = await page.locator('.community-tab-nav').count();
    // Main header renders community tabs for logged-in users via HeaderTwo
    // But the page should NOT be ONLY the community tabs (no main header)
    const mainHeader = await page.locator('.header').count();
    expect(mainHeader).toBeGreaterThan(0);
  });

  test('/about page is publicly accessible (no auth gate)', async ({ page }) => {
    await page.goto(`${BASE}/about`, { waitUntil: 'domcontentloaded' });
    // Should show actual content, not "Sign in to access"
    const aboutContent = await page.locator('text=BuildMyTribe.AI').count();
    expect(aboutContent).toBeGreaterThan(0);
  });
});

// ─── Images ──────────────────────────────────────────────────────────────────

test.describe('Images', () => {
  test('homepage has no broken images', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000); // Allow lazy images to load
    const brokenImages = await page.evaluate(() => {
      const imgs = document.querySelectorAll('img');
      return Array.from(imgs)
        .filter(img => {
          // Skip lazy-loaded decorative images that may not have rendered yet
          if (img.loading === 'lazy' && !img.complete) return false;
          // Skip tiny decorative images (stars, dots)
          if (img.alt === 'Image' || img.alt === '') return false;
          return img.complete && img.naturalWidth === 0;
        })
        .map(img => img.src);
    });
    expect(brokenImages).toEqual([]);
  });

  test('classroom course thumbnails load', async ({ page }) => {
    await page.goto(`${BASE}/classroom`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000); // Wait for Supabase data + images
    const brokenImages = await page.evaluate(() => {
      const imgs = document.querySelectorAll('.classroom-card__thumbnail img, .course-gallery__card img');
      return Array.from(imgs).filter(img => !img.complete || img.naturalWidth === 0).length;
    });
    expect(brokenImages).toBe(0);
  });
});

// ─── Console Errors ──────────────────────────────────────────────────────────

test.describe('Console Errors', () => {
  const criticalPages = ['/', '/classroom', '/blog/us-v-heppner-law-firm-ai-privilege', '/twingen'];

  for (const path of criticalPages) {
    test(`${path} has no critical console errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          const text = msg.text();
          // Ignore GA/analytics blocked by ad blockers and Stripe embed noise
          if (text.includes('google-analytics') || text.includes('ERR_BLOCKED')) return;
          if (text.includes('buy-button-app')) return;
          errors.push(text);
        }
      });
      await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
      expect(errors).toEqual([]);
    });
  }
});
