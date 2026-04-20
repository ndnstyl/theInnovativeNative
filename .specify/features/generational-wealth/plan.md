# Implementation Plan — /generational-wealth Phase 1

**Created**: 2026-04-20
**Spec**: `spec.md` v2 (ToughLove-fixed, MVP-phased)
**Scope**: Phase 1 only — 7 pages, core components, 2 Remotion videos, 2 YouTube scripts

---

## Build Order (Dependency-Driven)

Everything flows from the foundation layer up. No page gets built before its components exist. No content gets written before the voice guide is internalized.

```
Layer 0: Branch + scaffolding + data files
    │
Layer 1: Core components (PasswordGate, GWLayout, GWSidebar, GWBottomNav, CalloutBox, TooltipTerm)
    │
Layer 2: Interactive components (Checklist, StepProcess, Expandable, StatCard, ComparisonTable, ContactCard)
    │
Layer 3: Specialized components (CostCalculator, EligibilityChecker, YouTubeEmbed, PrintButton, JourneyProgress)
    │
Layer 4: Data files (glossary, contacts, checklists, timeline)
    │
Layer 5: Pages (landing → glossary → contacts → eqip → financing → due-diligence → timeline)
    │
Layer 6: Styles (responsive, print, animations)
    │
Layer 7: Graphics (Pexels stock, 3D icons, SVG diagrams)
    │
Layer 8: Videos (Remotion compositions, YouTube scripts)
    │
Layer 9: QA + deploy
```

---

## Phase Breakdown

### P0 — Scaffolding (Est: 1 hour)

**Goal**: Branch, folder structure, data files, env setup. Nothing renders yet.

1. Create branch `generational-wealth` off main
2. Create directory structure:
   - `src/pages/generational-wealth/`
   - `src/components/generational-wealth/`
   - `src/styles/sections/`
   - `src/data/`
   - `public/images/generational-wealth/`
3. Create data files with initial content:
   - `gw-glossary.json` — 40+ terms with definitions in kitchen-table voice
   - `gw-contacts.json` — all contacts from `14-NRCS-CostShare-Playbook.md` + `13-LoanAcquisition-Playbook.md`
   - `gw-checklist.json` — due diligence items from `11-DueDiligenceQuestions.md` + `99-Checklist.md`
   - `gw-timeline.json` — milestones from `07-PhasedRollout.md` with cashflow data from `02-CostRollup.md`
4. Create `_generational-wealth.scss` with CSS variables, component base styles
5. Create `_generational-wealth-print.scss` with light-theme inversion
6. Import both into `main.scss`
7. Precompute password hash: `sha256("gw-tribe-2026:onlyMyTribe2026!")` → store as constant
8. `npm run build` — verify zero errors introduced

**Exit**: Folder structure exists. Data files populated. Styles imported. Build passes.

---

### P1 — Core Components (Est: 3 hours)

**Goal**: The 6 components that every page depends on. No pages yet — just components with basic Storybook-style test renders.

1. **PasswordGate.tsx** — password wall with SHA-256 check, localStorage, 30-day expiry, GSAP shake on error
2. **GWLayout.tsx** — wrapper: noindex meta, sidebar (desktop), bottom nav (mobile), content area, footer disclaimer, reading time, last-verified date
3. **GWSidebar.tsx** — fixed left sidebar (240px), page list with active highlight, "Back to Dashboard" link, Phase 2 items dimmed
4. **GWBottomNav.tsx** — mobile sticky bottom bar (5 items: EQIP | Money | Checklist | Contacts | More), "More" opens slide-up sheet
5. **CalloutBox.tsx** — 4 variants (family-note, pro-tip, heads-up, the-law), each with icon + colored left border + background tint
6. **TooltipTerm.tsx** (`<T>` component) — reads from `gw-glossary.json`, dotted underline, hover popover (desktop), tap popover (mobile), "See full glossary" link

**Dependencies**: `_generational-wealth.scss` must exist (P0).
**Exit**: All 6 components render correctly in isolation. `npm run build` passes.

---

### P2 — Interactive Components (Est: 3 hours)

**Goal**: The reusable interactive elements that content pages compose.

1. **InteractiveChecklist.tsx** — renders from `gw-checklist.json` by page key, localStorage persist (`gw_checklist_{page}_{id}`), cyan fill animation, progress count
2. **StepProcess.tsx** — numbered vertical steps with connecting line, expandable detail per step, estimated time badge
3. **ExpandableSection.tsx** — accordion with GSAP slide + chevron rotate, `aria-expanded`, respects `prefers-reduced-motion`
4. **StatCard.tsx** — cyan number, white label, dark card bg, optional icon
5. **ComparisonTable.tsx** — responsive wrapper (horizontal scroll on mobile), alternating rows, cyan header, optional expandable rows
6. **ContactCard.tsx** — name, agency, phone (`tel:` link), address, website, "what they do" line, "Copy Info" button, category badge

**Dependencies**: P1 components for layout consistency.
**Exit**: All 6 render, interactive states work, localStorage persists. Build passes.

---

### P3 — Specialized Components (Est: 2 hours)

**Goal**: Page-specific interactive widgets.

1. **CostCalculator.tsx** — EQIP savings calc: input dollar amount → shows 75% and 90% reimbursement + out-of-pocket. Also used for budget calculator on financing page (input acreage × price/acre).
2. **EligibilityChecker.tsx** — 4 yes/no questions (beginning farmer? socially disadvantaged? veteran? AGI under $900K?) → result card with rate and advance payment eligibility
3. **YouTubeEmbed.tsx** — responsive 16:9 container, YouTube iframe with privacy params (`?rel=0&modestbranding=1`), thumbnail fallback image with play button overlay (loads iframe on click for performance)
4. **PrintButton.tsx** — triggers `window.print()`, styled as secondary button, only shown on designated pages
5. **JourneyProgress.tsx** — reads all `gw_progress_*` from localStorage, renders horizontal stepper with cyan checkmarks, pulse animation on suggested next step

**Dependencies**: P2 for shared patterns.
**Exit**: All 5 render, calculators produce correct output, YouTube embeds load. Build passes.

---

### P4 — Graphics (Est: 2 hours)

**Goal**: All visual assets for Phase 1 pages.

1. **Pexels stock photos** — fetch via API for 6 Phase 1 pages + landing hero. Download, optimize to WebP + JPEG fallback, max 200KB each, save to `public/images/generational-wealth/`
2. **3D icons** — check `remotion-videos/iconSet/techsy/` for existing matches. Generate new via `3d-icon-forge` for any gaps (expect 2-3 new icons needed). Save as transparent PNG to `public/images/generational-wealth/icons/`
3. **SVG diagrams** (Phase 1):
   - EQIP 10-step application process (vertical timeline SVG)
   - Budget breakdown bar/treemap (can be GSAP-animated div-based instead of SVG)
   - Cashflow depletion chart (timeline page — GSAP-animated bars)

**Dependencies**: None (can parallelize with P1-P3).
**Exit**: All images in place, optimized, referenced in code.

---

### P5 — Pages (Est: 8-10 hours — this is the bulk)

**Goal**: All 7 Phase 1 pages built with full content in kitchen-table voice.

Build order matters — each page tests more components:

#### 5.1 Glossary (`/glossary`) — build first
- Simplest page, validates TooltipTerm + search + data loading
- Content: render `gw-glossary.json` with search bar + alphabet links
- Tests: GWLayout, GWSidebar, GWBottomNav, search filtering

#### 5.2 Contacts (`/contacts`) — build second
- Reference page, validates ContactCard + tabs + search
- Content: render `gw-contacts.json` with category tabs
- Tests: ContactCard, tab switching, click-to-call, "Copy Info", PrintButton

#### 5.3 EQIP (`/eqip`) — build third (most complex content page)
- Longest page, validates all component types
- Content: full kitchen-table rewrite of `14-NRCS-CostShare-Playbook.md`
- Components used: CalloutBox (all 4 types), TooltipTerm, StepProcess, ExpandableSection, ComparisonTable, CostCalculator, EligibilityChecker, YouTubeEmbed, StatCard
- This is the integration test for the entire component library

#### 5.4 Financing (`/financing`) — build fourth
- Content: kitchen-table rewrite of budget + loan paths
- Components: ComparisonTable (loan comparison), StatCard (budget numbers), CostCalculator (budget calc), ContactCard (lenders), ExpandableSection

#### 5.5 Due Diligence (`/due-diligence`) — build fifth
- Content: kitchen-table rewrite of checklists + call scripts
- Components: InteractiveChecklist (3-phase), ExpandableSection (call script), CalloutBox (red flags), PrintButton
- Test: localStorage persistence, print stylesheet

#### 5.6 Timeline (`/timeline`) — build sixth
- Content: kitchen-table rewrite of phased rollout
- Components: StepProcess (vertical timeline), StatCard (cashflow), InteractiveChecklist (milestones), YouTubeEmbed ("The 4-Year Plan")
- Test: GSAP scroll-reveal, milestone persistence

#### 5.7 Landing Page (`/index`) — build last
- Dashboard that links to everything else
- Components: PasswordGate, JourneyProgress, StatCard (quick stats), section cards grid
- Phase 2 cards: dimmed with "Coming Soon" badge, not clickable
- Hero section with Pexels bg + overlay
- Tests: password flow end-to-end, progress tracking, responsive card grid

**Content authoring workflow per page**:
1. Claude reads the source doc(s)
2. Claude writes full page content in kitchen-table voice
3. Content embedded directly in TSX as JSX
4. Callouts, tooltips, checklists, expandables woven into the content
5. Quality checks from spec Section 13 applied

**Dependencies**: P1-P4 all complete.
**Exit**: All 7 pages render, navigate, and function. All interactive elements work. `npm run build` passes with zero errors.

---

### P6 — Styles & Polish (Est: 2 hours)

**Goal**: Responsive refinement, animation polish, print stylesheet verification.

1. **Mobile responsive audit** — test all 7 pages at 375px (iPhone SE), 390px (iPhone 14), 768px (iPad)
2. **Bottom nav behavior** — verify sticky positioning, "More" sheet animation, active state
3. **GSAP animations** — verify all animations: card hover, accordion, scroll-reveal, progress bar pulse, password shake. Verify `prefers-reduced-motion` disables all.
4. **Print stylesheet** — verify Due Diligence and Contacts pages print cleanly on white bg
5. **Dark theme consistency** — verify no component breaks the dark theme (white flashes, wrong bg, unreadable text)
6. **Touch targets** — verify all interactive elements meet 44x44px minimum on mobile
7. **Loading performance** — verify <3s on throttled 4G (Chrome DevTools network throttle)

**Exit**: All responsive/accessibility/performance checks pass.

---

### P7 — Videos (Est: 4 hours)

**Goal**: 2 Remotion videos rendered + 2 YouTube scripts written.

#### Remotion Videos
1. **"What is EQIP?"** (75s) — composition in Remotion project, Kal Jones VO via ElevenLabs, Techsy icons, animated step-by-step
2. **"The 4-Year Plan"** (90s) — timeline fly-through with milestone markers and budget callouts

Both: render to MP4 → upload to YouTube as unlisted → embed on respective pages

#### YouTube Scripts
1. **"We're Buying Land — Here's the Full Plan"** (12-15 min) — script + shot list + thumbnail concept + description/tags
2. **"How the Government Pays You to Clear Your Land"** (8-10 min) — script + shot list + thumbnail concept + description/tags

Scripts written in Mike's natural voice (not teleprompter-stiff). Bullet-point format with key phrases highlighted.

**Dependencies**: EQIP and Timeline pages must be built (for accurate content reference).
**Exit**: 2 MP4s uploaded to YouTube unlisted + embedded. 2 scripts delivered as .md files in `projects/foreverHome/scripts/`.

---

### P8 — QA + Deploy (Est: 2 hours)

1. **Full walkthrough** — navigate every page on desktop + mobile, click every link, check every tooltip, expand every accordion, check every checkbox
2. **Password flow** — test: correct password, incorrect password, localStorage expiry, incognito mode, clearing localStorage
3. **Build**: `npm run build` — zero errors, zero warnings
4. **Deploy**: rsync to A2 Hosting (standard pipeline)
5. **Post-deploy**: fix directory index for `generational-wealth` subdirectory
6. **Live verification**: hit all 7 pages on production URL, verify password wall, verify noindex meta
7. **Share with family**: Mike sends link + password to 2 family members
8. **Collect feedback**: 2-week window before Phase 2 starts

**Exit**: Live on production. Password wall works. Family has access. Feedback loop started.

---

## Estimated Total — Phase 1

| Phase | Hours |
|-------|-------|
| P0 Scaffolding | 1 |
| P1 Core Components | 3 |
| P2 Interactive Components | 3 |
| P3 Specialized Components | 2 |
| P4 Graphics | 2 |
| P5 Pages (content + build) | 10 |
| P6 Styles & Polish | 2 |
| P7 Videos | 4 |
| P8 QA + Deploy | 2 |
| **Total** | **~29 hours** |

P5 (pages/content) is the heaviest — that's where the kitchen-table rewrites happen. Everything else is mechanical.

---

## Risk Mitigations

| Risk | Mitigation |
|------|-----------|
| Content rewrites take longer than estimated | Start with EQIP page (most complex). If it takes >3 hours, simplify other pages. |
| 3D icon generation fails or takes too long | Fall back to Bootstrap Icons or simple SVG icons. Don't block pages on icon generation. |
| GSAP animations cause performance issues | Test on low-end device early (P6). Strip animations that don't add value. |
| YouTube unlisted embed shows "Video unavailable" | Keep thumbnail fallback with direct YouTube link as escape hatch. |
| Family finds content too dense even in kitchen-table voice | Ship, get feedback, iterate. Don't over-polish before real users see it. |

---

## What Phase 2 Looks Like (Not Planned in Detail Yet)

After Phase 1 feedback:
1. Build remaining 8 pages in priority order based on family feedback
2. Produce remaining 3 Remotion videos + 2 YouTube scripts
3. Add interactive scorecard (find-land page)
4. Add downloadable barndominium TBP PDFs (building page)
5. Add risk matrix visualization (risks page)
6. ToughLove Phase 2 before deploy
