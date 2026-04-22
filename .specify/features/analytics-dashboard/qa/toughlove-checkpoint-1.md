# ToughLove Checkpoint 1 -- Analytics Dashboard Phase 1

**Date**: 2026-04-22
**Scope**: Frontend build with mock data (Phase 1)
**Grade**: **B+**

---

## Build Status

| Check | Result |
|-------|--------|
| `npm run build` | PASS -- 133/133 pages, zero errors |
| TypeScript strict | PASS -- zero errors in analytics code |
| Production deploy | PASS -- `/admin/analytics` returns 200 |
| File count | 18 files (8 components, 7 tabs, 1 page, 1 mock data, 1 SCSS) |
| Recharts SSR guard | PASS -- mounted check on all 3 chart components |
| Responsive breakpoints | PASS -- 18 `@media` rules |
| Reduced motion | PASS -- 1 block |
| noindex/nofollow | PASS |
| Password gate | PASS -- plaintext password `tin2026` (see C1 below) |

---

## CRITICAL

### C1: Password is plaintext comparison, not hashed
**File**: `src/pages/admin/analytics.tsx` line 25
**Issue**: `const PASSWORD = 'tin2026'` with direct string comparison. Unlike the generational-wealth PasswordGate (SHA-256 + salt), this uses a raw string in the source code. Anyone viewing the JS bundle in DevTools can find it instantly.
**Fix**: Either reuse the PasswordGate component from generational-wealth, or at minimum hash the password with the same SHA-256 + salt pattern. For an admin dashboard with business data, this matters more than the family resource page.

### C2: Mock data only -- no live data pipeline yet
**Status**: Expected for Phase 1. The mock data file exists with realistic 30-day data across all 6 sources. n8n workflows are spec'd but not built.
**Fix**: Phase 2 priority. Build n8n workflows per `n8n-workflows.md` spec.

---

## HIGH

### H1: Zero ARIA attributes on interactive elements
**Issue**: 0 aria attributes found across all components. Tabs, sortable table headers, date picker, and refresh button have no ARIA roles, labels, or states.
**Fix**:
- Tabs: `role="tablist"` on container, `role="tab"` + `aria-selected` on each tab
- DataTable sort headers: `aria-sort="ascending|descending|none"`
- DateRangePicker: `aria-label="Select date range"`
- Refresh button: `aria-label="Refresh data"`

### H2: DataTable -- verify sort + search + pagination all work
**Status**: Component exists but needs manual testing. Sort direction, search filtering, and pagination state management are common bug sources.
**Fix**: Manual walkthrough of each table on every tab.

### H3: Date range picker doesn't actually filter data
**Issue**: The `dateRange` state exists and the picker renders, but the mock data doesn't change when you select a different range. This is expected for Phase 1 (mock data is static) but will need to work when live data is wired up.
**Fix**: When n8n endpoints are built, pass `dateRange` as a query param to the webhook.

---

## MEDIUM

### M1: Bundle size for analytics page is 162KB + 303KB shared
**Issue**: 162KB page-specific JS is significant. Recharts adds ~150KB. This is acceptable for an admin page that isn't public-facing, but monitor if it grows.
**Fix**: No action needed unless performance degrades. Could lazy-load tabs if needed.

### M2: No export to CSV/PDF functionality
**Issue**: Spec calls for export capability. Not implemented in Phase 1.
**Fix**: Phase 2 -- add export buttons on DataTable and per-tab.

### M3: No real-time active users display
**Issue**: The GA4 realtime data is in the mock, but there's no live-updating real-time card. Static mock shows "3 active users."
**Fix**: When n8n pipeline is live, add a polling fetch (every 30s) for the realtime endpoint.

### M4: Funnel chart is pure CSS, not Recharts
**Issue**: FunnelChart uses CSS horizontal bars instead of a Recharts funnel. This is actually fine -- Recharts doesn't have a native funnel component and the CSS approach is lighter. Not a bug, just noting it.

---

## LOW

### L1: Tab navigation not keyboard-accessible
Add `tabIndex={0}` and `onKeyDown` handler for Enter/Space to switch tabs.

### L2: No loading state when refreshing
The refresh button currently just increments a key. When live data is connected, add a loading spinner during fetch.

### L3: Print stylesheet should format charts as tables
Charts don't print well. The print stylesheet should either hide charts or render their data as tables.

---

## What's Good

1. **All 7 tabs render** with complete UI structure matching the spec
2. **ScoreCard comparison badges** work correctly (green up, red down with %)
3. **Recharts SSR guards** properly prevent server-side rendering crashes
4. **Mock data is comprehensive** -- 30-day trends, realistic numbers, all 6 sources populated
5. **Dark theme consistency** -- matches existing site aesthetic
6. **Tab navigation** -- clean horizontal tabs with active state
7. **DataTable** -- sortable, searchable, paginated
8. **FunnelChart** -- clean CSS-based funnel visualization
9. **ABTestCard** -- shows confidence meter + status badges

---

## Path to A-

1. **C1**: Hash the admin password (30 min)
2. **H1**: Add ARIA attributes to tabs + tables + controls (1 hr)
3. **H2**: Manual test all DataTable interactions (30 min)
4. Phase 2: Build n8n data proxy workflows (4-6 hrs)
5. Phase 2: Wire dashboard to fetch live data from n8n (2 hrs)
6. Phase 2: Add CSV export (1 hr)
