import { test, expect, Page } from "@playwright/test";

/**
 * Generational Wealth section — full QA against the LIVE site.
 *
 * Bypasses PasswordGate by seeding localStorage with the unlocked flag
 * (PasswordGate reads `gw_unlocked` + `gw_unlocked_at` per
 * `src/components/generational-wealth/PasswordGate.tsx`).
 */

const PAGES = [
  { slug: "", label: "Dashboard" },
  { slug: "vision", label: "Vision" },
  { slug: "find-land", label: "Finding Land" },
  { slug: "timber", label: "Timber as Asset" },
  { slug: "search", label: "Search" },
  { slug: "oklahoma-vs-texas", label: "OK vs TX" },
  { slug: "systems", label: "Systems" },
  { slug: "building", label: "Building" },
  { slug: "food", label: "Food" },
  { slug: "cooling", label: "Cooling" },
  { slug: "compound", label: "Compound" },
  { slug: "eqip", label: "EQIP" },
  { slug: "financing", label: "Financing" },
  { slug: "due-diligence", label: "Due Diligence" },
  { slug: "contacts", label: "Contacts" },
  { slug: "timeline", label: "Timeline" },
  { slug: "risks", label: "Risks" },
  { slug: "glossary", label: "Glossary" },
  { slug: "legal-structure", label: "Legal Structure" },
];

async function unlock(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem("gw_unlocked", "true");
    window.localStorage.setItem("gw_unlocked_at", String(Date.now()));
  });
}

test.describe("Generational Wealth — live site QA", () => {
  test.beforeEach(async ({ page }) => {
    await unlock(page);
  });

  test("every page returns 200 and renders without auth gate", async ({ page }) => {
    const failures: string[] = [];
    for (const p of PAGES) {
      const url = `/generational-wealth${p.slug ? "/" + p.slug : ""}`;
      const response = await page.goto(url, { waitUntil: "domcontentloaded" });
      const status = response?.status();
      if (status !== 200) {
        failures.push(`${url} returned ${status}`);
        continue;
      }
      // Confirm the password gate UI is NOT visible
      const passwordGateVisible = await page
        .locator('input[type="password"]')
        .first()
        .isVisible()
        .catch(() => false);
      if (passwordGateVisible) {
        failures.push(`${url} still shows password gate after unlock seed`);
      }
    }
    expect(failures, `Page failures:\n${failures.join("\n")}`).toEqual([]);
  });

  test("search bar loads pagefind and returns results for 'post frame'", async ({ page }) => {
    await page.goto("/generational-wealth/eqip", { waitUntil: "domcontentloaded" });

    // Capture network requests to /gw-search/* for diagnostics
    const pagefindRequests: { url: string; status: number }[] = [];
    page.on("response", (response) => {
      const u = response.url();
      if (u.includes("/gw-search/")) {
        pagefindRequests.push({ url: u, status: response.status() });
      }
    });

    const searchInput = page.locator(".gw-search__input").first();
    await expect(searchInput).toBeVisible();
    await searchInput.click();
    await searchInput.fill("post frame");

    // Wait for either real results OR the "isn't built" banner OR the searching state to settle
    const dropdown = page.locator(".gw-search__dropdown");
    await expect(dropdown).toBeVisible({ timeout: 10000 });

    // Give pagefind time to actually fetch indexes + return results
    await page.waitForTimeout(2000);

    const dropdownText = (await dropdown.innerText()).toLowerCase();
    const hasResults = await page.locator(".gw-search__result").count();

    // The bug we are fighting:
    expect(
      dropdownText.includes("isn't built") || dropdownText.includes("isn’t built"),
      `Search dropdown shows the "index not built" banner. Network log:\n${pagefindRequests
        .map((r) => `  ${r.status} ${r.url}`)
        .join("\n")}`
    ).toBe(false);

    // The result we want:
    expect(
      hasResults,
      `Expected at least one search result. Dropdown said:\n"${dropdownText}"\nNetwork log:\n${pagefindRequests
        .map((r) => `  ${r.status} ${r.url}`)
        .join("\n")}`
    ).toBeGreaterThan(0);
  });

  test("search returns results for several real queries", async ({ page }) => {
    await page.goto("/generational-wealth/eqip", { waitUntil: "domcontentloaded" });
    const searchInput = page.locator(".gw-search__input").first();

    const queries = ["aquaponics", "barndominium", "EQIP", "well", "trust"];
    const failures: string[] = [];

    for (const q of queries) {
      await searchInput.fill("");
      await searchInput.fill(q);
      await page.waitForTimeout(1500);
      const count = await page.locator(".gw-search__result").count();
      if (count === 0) failures.push(`'${q}' returned 0 results`);
    }

    expect(failures, `Queries with no results:\n${failures.join("\n")}`).toEqual([]);
  });

  test("welcome video embed renders on dashboard", async ({ page }) => {
    await page.goto("/generational-wealth/", { waitUntil: "domcontentloaded" });
    const ytWrapper = page.locator(".gw-youtube").first();
    await expect(ytWrapper).toBeVisible();
    // Title text appears in the placeholder
    await expect(page.getByText("Watch This First")).toBeVisible();
  });

  test("vision video embed renders inside the PageCover slot", async ({ page }) => {
    await page.goto("/generational-wealth/vision", { waitUntil: "domcontentloaded" });
    const liveSlot = page.locator(".gw-page-cover__video-holder--live").first();
    await expect(liveSlot).toBeVisible();
    // Should NOT show the "coming soon" placeholder
    const comingSoon = page.getByText("Section video coming soon");
    await expect(comingSoon).toHaveCount(0);
  });

  test("timber page references the new cover image and renders the dual-lens table", async ({
    page,
  }) => {
    const response = await page.goto("/generational-wealth/find-land", {
      waitUntil: "domcontentloaded",
    });
    expect(response?.status()).toBe(200);

    // Dual-lens table headers
    await expect(page.getByText("Homestead-first").first()).toBeVisible();
    await expect(page.getByText("Timber-first").first()).toBeVisible();

    // Link to the timber page exists
    const timberLink = page.locator('a[href="/generational-wealth/timber"]').first();
    await expect(timberLink).toBeVisible();

    // Timber page itself loads + cover image returns 200
    await page.goto("/generational-wealth/timber", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Timber as Asset");

    const coverResponse = await page.request.get(
      "/images/generational-wealth/cover-timber.jpg"
    );
    expect(coverResponse.status()).toBe(200);
  });

  test("sidebar nav links match the actual routes", async ({ page }) => {
    await page.goto("/generational-wealth/eqip", { waitUntil: "domcontentloaded" });

    // Click Timber as Asset entry, confirm we land on /timber
    const timberLink = page
      .locator(".gw-sidebar__link", { hasText: "Timber as Asset" })
      .first();
    await expect(timberLink).toBeVisible();
    await timberLink.click();
    await page.waitForURL("**/generational-wealth/timber");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Timber as Asset");
  });

  test("dashboard 'Timber as Asset' card links to the timber page", async ({ page }) => {
    await page.goto("/generational-wealth/", { waitUntil: "domcontentloaded" });
    const card = page
      .locator(".gw-dashboard__card", {
        hasText: "Timber as Asset",
      })
      .first();
    await expect(card).toBeVisible();
    expect(await card.getAttribute("href")).toBe("/generational-wealth/timber");
  });

  test("no console errors on representative pages", async ({ page }) => {
    const errorPages = ["", "vision", "find-land", "timber", "eqip"];
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(`console.error: ${msg.text()}`);
    });

    for (const slug of errorPages) {
      const url = `/generational-wealth${slug ? "/" + slug : ""}`;
      await page.goto(url, { waitUntil: "domcontentloaded" });
    }

    // Filter out third-party / extension noise we don't control
    const meaningful = errors.filter(
      (e) =>
        !e.includes("favicon") &&
        !e.includes("googletagmanager") &&
        !e.includes("Failed to load resource: the server responded with a status of 404")
    );
    expect(meaningful, `Console errors:\n${meaningful.join("\n")}`).toEqual([]);
  });

  test("cover-timber.jpg, cover-vision.jpg, cover-find-land.jpg all serve 200", async ({
    request,
  }) => {
    const images = [
      "/images/generational-wealth/cover-timber.jpg",
      "/images/generational-wealth/cover-vision.jpg",
      "/images/generational-wealth/cover-find-land.jpg",
    ];
    const failures: string[] = [];
    for (const img of images) {
      const r = await request.get(img);
      if (r.status() !== 200) failures.push(`${img} → ${r.status()}`);
    }
    expect(failures, failures.join("\n")).toEqual([]);
  });

  test("pagefind asset URLs are reachable (entry.json + the versioned URL the component actually fetches)", async ({
    page,
    request,
  }) => {
    // Entry JSON is dynamic and not CDN-cached
    const entryRes = await request.get("/gw-search/pagefind-entry.json");
    expect(entryRes.status()).toBe(200);

    // The component appends ?v=<buildId> to bypass CDN cache. Pull the page
    // and extract the actual URL it's calling, then verify that URL serves 200.
    await page.goto("/generational-wealth/eqip", { waitUntil: "domcontentloaded" });
    const seen: string[] = [];
    page.on("response", (r) => {
      if (r.url().includes("/gw-search/pagefind.js")) seen.push(`${r.status()} ${r.url()}`);
    });
    await page.locator(".gw-search__input").first().click();
    await page.locator(".gw-search__input").first().fill("eq");
    await page.waitForTimeout(2000);
    expect(
      seen.find((s) => s.startsWith("200")),
      `Expected the versioned pagefind.js fetch to return 200. Saw:\n${seen.join("\n")}`
    ).toBeTruthy();
  });

  test("Building page has Critical Decisions cross-link block to 5 subpages", async ({ page }) => {
    await page.goto("/generational-wealth/building", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("heading", { name: /Critical Decisions Before We Frame/i })
    ).toBeVisible();
    const subpageHrefs = [
      "/generational-wealth/foundation",
      "/generational-wealth/storm-shelter",
      "/generational-wealth/insurance",
      "/generational-wealth/general-contracting",
      "/generational-wealth/permits",
    ];
    for (const href of subpageHrefs) {
      await expect(page.locator(`a[href="${href}"]`).first()).toBeVisible();
    }
  });

  test("Foundation subpage renders with Perma-Column + soil testing content", async ({ page }) => {
    const r = await page.goto("/generational-wealth/foundation", { waitUntil: "domcontentloaded" });
    expect(r?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1, name: /Foundation: What Goes Under the Columns/i })).toBeVisible();
    await expect(page.getByText("Perma-Column").first()).toBeVisible();
    await expect(page.getByText("Sturdi-Wall Plus").first()).toBeVisible();
    await expect(page.getByText("Soil Testing").first()).toBeVisible();
    await expect(page.getByText("SSURGO", { exact: false }).first()).toBeVisible();
    await expect(page.getByText("ESR-4239", { exact: false }).first()).toBeVisible();
  });

  test("Storm Shelter subpage renders with FEMA P-320 specs", async ({ page }) => {
    const r = await page.goto("/generational-wealth/storm-shelter", { waitUntil: "domcontentloaded" });
    expect(r?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1, name: /Storm Shelter/i })).toBeVisible();
    await expect(page.getByText("FEMA P-320").first()).toBeVisible();
    await expect(page.getByText("250 mph", { exact: false }).first()).toBeVisible();
  });

  test("Insurance subpage renders with builder's risk + COI requirements", async ({ page }) => {
    const r = await page.goto("/generational-wealth/insurance", { waitUntil: "domcontentloaded" });
    expect(r?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1, name: /Insurance/i })).toBeVisible();
    await expect(page.getByText("Builder", { exact: false }).first()).toBeVisible();
    await expect(page.getByText("$1,000,000 per occurrence", { exact: false })).toBeVisible();
    await expect(page.getByText("Vacant Land", { exact: false }).first()).toBeVisible();
  });

  test("General Contracting subpage renders with build order + GC duties", async ({ page }) => {
    const r = await page.goto("/generational-wealth/general-contracting", { waitUntil: "domcontentloaded" });
    expect(r?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1, name: /Being Our Own General Contractor/i })).toBeVisible();
    await expect(page.getByText("10 to 25 percent", { exact: false })).toBeVisible();
    await expect(page.getByText("Build Journal", { exact: false }).first()).toBeVisible();
  });

  test("Permits subpage renders with AHJ questions + timeline", async ({ page }) => {
    const r = await page.goto("/generational-wealth/permits", { waitUntil: "domcontentloaded" });
    expect(r?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1, name: /Permits and the Building Department/i })).toBeVisible();
    await expect(page.getByText("Haskell County").first()).toBeVisible();
    await expect(page.getByText("AHJ", { exact: false }).first()).toBeVisible();
    await expect(page.getByText("60 days", { exact: false })).toBeVisible();
  });

  test("Sidebar includes the 5 new subpage entries", async ({ page }) => {
    await page.goto("/generational-wealth/building", { waitUntil: "domcontentloaded" });
    const expected = [
      "Foundation",
      "Storm Shelter",
      "Insurance",
      "Being Our Own GC",
      "Permits",
    ];
    for (const label of expected) {
      await expect(page.locator(".gw-sidebar__link", { hasText: label }).first()).toBeVisible();
    }
  });

  test("OK vs TX page has the new section video in the cover slot", async ({ page }) => {
    await page.goto("/generational-wealth/oklahoma-vs-texas", { waitUntil: "domcontentloaded" });
    const liveSlot = page.locator(".gw-page-cover__video-holder--live").first();
    await expect(liveSlot).toBeVisible();
    // No coming-soon placeholder
    await expect(page.getByText("Section video coming soon")).toHaveCount(0);
    // Title text from YouTubeEmbed placeholder visible
    await expect(page.getByText("Which State Fits Better").last()).toBeVisible();
  });
});
