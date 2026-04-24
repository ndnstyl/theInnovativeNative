# Generational Wealth — Polish Backlog

**Created**: 2026-04-20
**Status**: Parked — all functional, these are refinements
**Priority**: Pick up after current sprint or when Mike reviews with family

---

## Visual Polish

- [ ] **Stock photos for page covers** — Fetch from Pexels API for all 16 content pages. Currently showing gradient fallbacks. Search queries defined in spec.md Section 10. Save to `public/images/generational-wealth/cover-{pagename}.jpg` (WebP + JPEG, max 200KB each).
- [ ] **3D Techsy icons on dashboard cards** — Check `remotion-videos/iconSet/techsy/` for matches. Generate missing via `3d-icon-forge` skill. 15 icons needed (one per section card).
- [ ] **Glossary full-name text opacity** — Bump `.gw-glossary__full` from `rgba(255,255,255,0.5)` to `0.6` for WCAG small-text contrast.
- [ ] **"Last updated" on dashboard** — Add "Last updated: April 2026" to the landing page (content pages already have it).
- [ ] **EQIP page table of contents** — Page is ~2000 words. Add jump-link TOC at top for mobile users.

## Video Content

- [ ] **Remotion explainer #1**: "What is EQIP?" (75s) — Script exists in spec. Needs: composition build, ElevenLabs VO (Kal Jones), Techsy icons, render to MP4, upload to YouTube unlisted, embed on /eqip page.
- [ ] **Remotion explainer #2**: "The 4-Year Plan" (90s) — Timeline fly-through with milestones and budget markers. Same pipeline.
- [ ] **Remotion explainer #3**: "The Timber-to-Pasture Play" (60s) — Money flow animation. For /eqip page.
- [ ] **Remotion explainer #4**: "Barndominium 101" (90s) — Envelope assembly animation. For /building page.
- [ ] **Remotion explainer #5**: "Water First: The Homestead Sequence" (60s) — Dependency chain. For /systems page.
- [ ] **YouTube script #1**: "We're Buying Land — Here's the Full Plan" (12-15 min) — Talking head + B-roll. VSL for landing page.
- [ ] **YouTube script #2**: "How the Government Pays You to Clear Your Land" (8-10 min) — Screen share + talking head. Links to /eqip.
- [ ] **YouTube script #3**: "Everything I Wish I Knew Before Buying Rural Land" (10-12 min) — Due diligence content.
- [ ] **YouTube script #4**: "Why a Barndominium (and What It Actually Costs)" (8-10 min) — Building education.
- [x] **Per-page intro scripts (17 videos, 60-90s each)** — Conversational 10k-ft scripts for every GW page. Written 2026-04-24. See `video-scripts.md`. Next: record with Kal Jones, B-roll page scroll, embed at top of each page.

## Interactive Enhancements

- [ ] **Parcel evaluation scorecard** (find-land page) — Interactive: 10 factors, 1-5 scale, traffic-light output. Save results to localStorage. Full 19-factor advanced version in expandable section.
- [ ] **JourneyProgress upgrade** — Track checklist completion aggregate (not just page visits). Show "X of Y checklist items completed" on dashboard.
- [ ] **Glossary tooltip debounce** — Currently instant filter per keystroke. Add 150ms debounce if glossary grows past 100 terms.
- [ ] **Export/import progress** — Let users export their checklist state as JSON and import on another device. Power-user feature.

## Content Gaps

- [ ] **Barndominium TBP PDFs** — Make the 14 PDFs from `projects/foreverHome/barndominium/` downloadable from the /building page behind the password wall. Don't duplicate content, just link as supplementary material.
- [ ] **Sasakwa-specific evaluation** — NOT published (private deal), but if Mike closes on Sasakwa, update relevant pages with property-specific data.
- [ ] **Trust/LLC page — TX-specific CPA contacts** — Found firms but no east-TX-specific phone numbers. Research Tyler/Jacksonville/Lufkin area ag CPAs with direct numbers.

## Accessibility

- [ ] **Print stylesheet verification** — Manually test printing Due Diligence + Contacts pages to PDF. Verify light theme, hidden nav, clean checklist formatting.
- [ ] **Skip-to-content link** — Add inside GWLayout for screen reader users (main site has one but GW content hydrates separately).
- [ ] **Touch target audit** — Verify all interactive elements meet 44x44px minimum on mobile. Spot-check glossary alpha links and bottom nav items.

## Deployment

- [ ] **PR to main** — When ready, merge `generational-wealth` branch to main via PR.
- [ ] **Directory index script** — Verify `generational-wealth` and all subdirectories have correct index.html copies after deploy.

---

## What's NOT in this backlog (already done)

- All 16 pages built with full kitchen-table content
- 18 components (PasswordGate, GWLayout, Sidebar, BottomNav, CalloutBox, TooltipTerm, Checklist, StepProcess, Expandable, StatCard, ComparisonTable, ContactCard, CostCalculator, EligibilityChecker, YouTubeEmbed, PrintButton, JourneyProgress, PageCover)
- 3 data files (glossary 41 terms, contacts 44 entries, timeline 10 phases)
- 2 SCSS files (main + print)
- Password wall with rich preview landing
- prefers-reduced-motion WCAG compliance
- noindex/nofollow on all pages
- 2 foreverHome playbooks (14-NRCS-CostShare, 15-Trust-LLC-Tax)
- Full spec kit (spec.md, plan.md, tasks.md, 2 toughlove reports)
