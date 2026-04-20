# Tasks — /generational-wealth Phase 1

**Generated from**: plan.md
**Total tasks**: 58
**Estimated hours**: ~29

---

## P0 — Scaffolding

- [ ] **T001** Create branch `generational-wealth` off main
- [ ] **T002** Create directory structure (`src/pages/generational-wealth/`, `src/components/generational-wealth/`, `src/data/`, `public/images/generational-wealth/`, `public/images/generational-wealth/icons/`)
- [ ] **T003** Create `gw-glossary.json` — 40+ terms with plain-English definitions (source: all foreverHome docs, extract every acronym + technical term)
- [ ] **T004** Create `gw-contacts.json` — structured contact data (source: `14-NRCS-CostShare-Playbook.md` §Contact Directory + `13-LoanAcquisition-Playbook.md` §Lenders)
- [ ] **T005** Create `gw-checklist.json` — due diligence items by phase (source: `11-DueDiligenceQuestions.md` + `01-LandAcquisition.md` §Due Diligence + `99-Checklist.md` Phase 1)
- [ ] **T006** Create `gw-timeline.json` — milestones by quarter with cashflow data (source: `07-PhasedRollout.md` + `02-CostRollup.md` §Phased Cashflow)
- [ ] **T007** Create `_generational-wealth.scss` — CSS custom properties, component base styles, dark theme variables, callout colors, card styles
- [ ] **T008** Create `_generational-wealth-print.scss` — light theme inversion, hide nav/sidebar, format checklists for print
- [ ] **T009** Import both SCSS files into `main.scss`
- [ ] **T010** Precompute SHA-256 hash of `gw-tribe-2026:onlyMyTribe2026!` and store as constant string for PasswordGate
- [ ] **T011** Run `npm run build` — verify zero new errors
- [ ] **T012** Commit: "scaffold: generational-wealth directory structure + data files"

---

## P1 — Core Components

- [ ] **T013** Build `PasswordGate.tsx` — full-screen password wall, SHA-256 + salt check, localStorage with 30-day expiry, GSAP shake on error, "This is for the tribe" heading, keyboard submit (Enter key)
- [ ] **T014** Build `GWLayout.tsx` — wrapper component: PasswordGate wrap, `<Head>` with noindex/nofollow, sidebar (desktop) / bottom nav (mobile), content area (max-width 800px), footer disclaimer, reading time prop, last-verified date prop
- [ ] **T015** Build `GWSidebar.tsx` — fixed left 240px, all 15 pages listed (Phase 2 items dimmed with "Coming Soon"), current page cyan highlight, "Back to Dashboard" top link, hide below 768px
- [ ] **T016** Build `GWBottomNav.tsx` — mobile-only sticky bottom bar, 5 items (EQIP | Money | Checklist | Contacts | More), "More" triggers slide-up sheet with remaining pages, active state cyan, hide above 768px
- [ ] **T017** Build `CalloutBox.tsx` — 4 variants via `type` prop: `family-note` (cyan), `pro-tip` (cyan darker), `heads-up` (magenta), `the-law` (gold). Icon + title + children content. Left border + tinted bg.
- [ ] **T018** Build `TooltipTerm.tsx` (`<T>` component) — accepts children (term text), looks up definition from imported `gw-glossary.json`, renders dotted underline, hover popover (desktop, 200ms delay), tap popover (mobile), "See full glossary" link in popover
- [ ] **T019** Run `npm run build` — verify all components compile
- [ ] **T020** Commit: "feat: generational-wealth core components (PasswordGate, Layout, Sidebar, BottomNav, CalloutBox, TooltipTerm)"

---

## P2 — Interactive Components

- [ ] **T021** Build `InteractiveChecklist.tsx` — props: `pageKey` + items array (or reads from `gw-checklist.json` by key). Each item: checkbox + label + optional description. localStorage key: `gw_checklist_{pageKey}_{itemId}`. Cyan fill animation (GSAP, motion-safe). Shows "X of Y completed" count.
- [ ] **T022** Build `StepProcess.tsx` — props: steps array (number, title, description, estimatedTime, link?). Vertical layout with connecting line. Expandable detail per step. Numbered circles with cyan active state.
- [ ] **T023** Build `ExpandableSection.tsx` — props: title, children, defaultOpen?. GSAP slide-down + chevron rotation. `aria-expanded` attribute. Respects `prefers-reduced-motion`.
- [ ] **T024** Build `StatCard.tsx` — props: value, label, icon?. Cyan value text, white label, dark card bg. Responsive (flex in row on desktop, stack on mobile).
- [ ] **T025** Build `ComparisonTable.tsx` — props: headers, rows, expandableRows?. Responsive horizontal scroll wrapper. Alternating row bg. Cyan header row. Optional expandable detail rows.
- [ ] **T026** Build `ContactCard.tsx` — props: name, agency, phone, address?, website?, description, category. Click-to-call `tel:` link. "Copy Info" button (copies formatted text to clipboard). Category badge. "Visit Website" external link.
- [ ] **T027** Run `npm run build`
- [ ] **T028** Commit: "feat: generational-wealth interactive components (Checklist, StepProcess, Expandable, StatCard, ComparisonTable, ContactCard)"

---

## P3 — Specialized Components

- [ ] **T029** Build `CostCalculator.tsx` — two modes via prop: `eqip` (input cost → show 75% + 90% reimbursement + out-of-pocket) and `budget` (input acreage × price/acre → show land cost + total budget impact). Cyan accent on results. Debounced input (300ms).
- [ ] **T030** Build `EligibilityChecker.tsx` — 4 yes/no toggle questions. Result card: eligible rate (75% or 90%), advance payment eligible (yes/no), dedicated funding pool (yes/no). Cyan success styling.
- [ ] **T031** Build `YouTubeEmbed.tsx` — props: videoId, title, thumbnailUrl?. Responsive 16:9 container. Shows thumbnail + play button by default. On click: replaces with YouTube iframe (`?rel=0&modestbranding=1`). Lazy-loads iframe for performance.
- [ ] **T032** Build `PrintButton.tsx` — "Print this page" button, triggers `window.print()`. Secondary button styling. Only rendered on pages that pass `printable={true}` to GWLayout.
- [ ] **T033** Build `JourneyProgress.tsx` — reads `gw_progress_*` keys from localStorage. Horizontal stepper: 7 steps matching Phase 1 journey. Visited = cyan checkmark. Suggested next = pulse animation (GSAP). Shows "X of Y visited" text.
- [ ] **T034** Run `npm run build`
- [ ] **T035** Commit: "feat: generational-wealth specialized components (Calculator, Eligibility, YouTube, Print, JourneyProgress)"

---

## P4 — Graphics

- [ ] **T036** Fetch Pexels stock photos for Phase 1 pages (landing hero + 6 section headers). Download, convert to WebP + JPEG fallback, optimize to <200KB each. Save to `public/images/generational-wealth/`
- [ ] **T037** Audit `remotion-videos/iconSet/techsy/` for existing icons matching Phase 1 needs. List matches and gaps.
- [ ] **T038** Generate missing 3D Techsy icons via `3d-icon-forge` skill (expect 2-3 new). Save as transparent PNG to `public/images/generational-wealth/icons/`
- [ ] **T039** Create EQIP 10-step process SVG diagram (or build as GSAP-animated divs in StepProcess component — decide based on complexity)
- [ ] **T040** Commit: "assets: generational-wealth Phase 1 images, icons, diagrams"

---

## P5 — Pages

#### Glossary (build first — simplest, validates data loading)
- [ ] **T041** Build `/generational-wealth/glossary.tsx` — search bar, alphabet jump-links, render all terms from `gw-glossary.json`, each term links to relevant pages. Uses GWLayout.

#### Contacts (build second — validates ContactCard + tabs)
- [ ] **T042** Build `/generational-wealth/contacts.tsx` — category tabs (Government | Foresters | Lenders | Legal | Tools), search/filter, render from `gw-contacts.json`, PrintButton. Uses GWLayout.

#### EQIP (build third — most complex, integration test)
- [ ] **T043** Write EQIP page content in kitchen-table voice (rewrite `14-NRCS-CostShare-Playbook.md` for total beginners, grade 8 reading level, all callout types, tooltip terms, expandable details)
- [ ] **T044** Build `/generational-wealth/eqip.tsx` — full page with: StepProcess (application steps), EligibilityChecker, CostCalculator (EQIP mode), ComparisonTable (cost-share rates), ExpandableSection (practice codes), CalloutBox (legal disclaimer + pro tips + heads up), YouTubeEmbed ("What is EQIP?"), ContactCard (foresters). Uses GWLayout.

#### Financing (build fourth)
- [ ] **T045** Write Financing page content in kitchen-table voice (rewrite `02-CostRollup.md` budget + `13-LoanAcquisition-Playbook.md` loan paths for beginners)
- [ ] **T046** Build `/generational-wealth/financing.tsx` — budget visual, loan comparison table (expandable rows), CostCalculator (budget mode), lender ContactCards, decision tree section. Uses GWLayout.

#### Due Diligence (build fifth)
- [ ] **T047** Write Due Diligence page content in kitchen-table voice (rewrite `11-DueDiligenceQuestions.md` checklists + call scripts + red flags for beginners)
- [ ] **T048** Build `/generational-wealth/due-diligence.tsx` — 3-phase InteractiveChecklist, expandable call script with copy button, email template with copy button, CalloutBox red flags, PrintButton. Uses GWLayout.

#### Timeline (build sixth)
- [ ] **T049** Write Timeline page content in kitchen-table voice (rewrite `07-PhasedRollout.md` quarter-by-quarter for beginners)
- [ ] **T050** Build `/generational-wealth/timeline.tsx` — vertical StepProcess (quarters as steps, expandable), StatCard (cashflow at each phase), InteractiveChecklist (milestones), YouTubeEmbed ("The 4-Year Plan"). Uses GWLayout.

#### Landing Page (build last — depends on all other pages)
- [ ] **T051** Build `/generational-wealth/index.tsx` — PasswordGate wrapper, hero section (Pexels bg + overlay + headline), JourneyProgress, StatCard row (4 stats), section cards grid (Phase 1 active + Phase 2 "Coming Soon"), footer disclaimer. Responsive: 3-col desktop, 1-col mobile.

- [ ] **T052** Run `npm run build` — verify all 7 pages compile with zero errors
- [ ] **T053** Commit: "feat: generational-wealth Phase 1 pages (7 pages with full content)"

---

## P6 — Styles & Polish

- [ ] **T054** Mobile responsive audit — test all 7 pages at 375px, 390px, 768px, 1024px, 1440px. Fix any layout breaks, overflow, truncation, touch target issues.
- [ ] **T055** GSAP animation audit — verify all animations work AND verify `prefers-reduced-motion` disables them. Test: card hover, accordion, scroll-reveal, progress pulse, password shake.
- [ ] **T056** Print audit — verify Due Diligence + Contacts print cleanly with light theme. Verify checklists render as empty squares. Verify nav/sidebar hidden.
- [ ] **T057** Performance audit — Chrome DevTools Lighthouse on each page. Target: Performance >80, <3s load on throttled Fast 4G. Optimize images or defer JS if needed.
- [ ] **T058** Commit: "polish: generational-wealth responsive, animations, print, performance"

---

## P7 — Videos

- [ ] **T059** Write Remotion composition: "What is EQIP?" (75s) — script, scene breakdown, icon/asset list, VO text for ElevenLabs
- [ ] **T060** Write Remotion composition: "The 4-Year Plan" (90s) — script, scene breakdown, timeline animation sequence, VO text
- [ ] **T061** Record VO via ElevenLabs (Kal Jones voice) for both compositions
- [ ] **T062** Build + render both Remotion compositions to MP4
- [ ] **T063** Upload both MP4s to YouTube as unlisted. Get embed IDs. Update YouTubeEmbed videoId props on /eqip and /timeline pages.
- [ ] **T064** Write YouTube script #1: "We're Buying Land — Here's the Full Plan" (12-15 min) — bullet-point script + shot list + thumbnail concept + description + tags. Save to `projects/foreverHome/scripts/yt-01-buying-land.md`
- [ ] **T065** Write YouTube script #2: "How the Government Pays You to Clear Your Land" (8-10 min) — bullet-point script + shot list + thumbnail concept + description + tags. Save to `projects/foreverHome/scripts/yt-02-eqip-explained.md`
- [ ] **T066** Commit: "content: generational-wealth Remotion videos + YouTube scripts"

---

## P8 — QA + Deploy

- [ ] **T067** Full manual walkthrough — every page, every link, every tooltip, every accordion, every checkbox, every calculator, every contact card on both desktop and mobile
- [ ] **T068** Password flow test — correct password, wrong password (3x), localStorage clear + re-enter, incognito mode, 30-day expiry simulation
- [ ] **T069** `npm run build` — final zero-error verification
- [ ] **T070** Deploy via rsync to A2 Hosting (standard pipeline from website CLAUDE.md)
- [ ] **T071** Post-deploy: add `generational-wealth` to directory index fix script + run it
- [ ] **T072** Live verification — hit all 7 pages on production, verify password wall, verify noindex in page source, verify YouTube embeds load
- [ ] **T073** Commit any post-deploy fixes
- [ ] **T074** Mike shares link + password with 2 family members. Feedback collection begins (2-week window).

---

## Summary

| Phase | Tasks | Est Hours |
|-------|-------|-----------|
| P0 Scaffolding | T001-T012 | 1 |
| P1 Core Components | T013-T020 | 3 |
| P2 Interactive Components | T021-T028 | 3 |
| P3 Specialized Components | T029-T035 | 2 |
| P4 Graphics | T036-T040 | 2 |
| P5 Pages | T041-T053 | 10 |
| P6 Polish | T054-T058 | 2 |
| P7 Videos | T059-T066 | 4 |
| P8 QA + Deploy | T067-T074 | 2 |
| **Total** | **74 tasks** | **~29 hours** |

---

## Parallelization Opportunities

These phases can run in parallel to compress calendar time:

- **P4 (Graphics)** can run alongside P1-P3 (components)
- **T059-T061 (Remotion scripts + VO)** can run alongside P5 (pages)
- **T064-T065 (YouTube scripts)** can run alongside P6 (polish)

With parallelization, critical path is: P0 → P1 → P2 → P3 → P5 → P6 → P8 = ~21 hours sequential.
