---
description: "Task breakdown for feature 036-pi-content-value-system"
---

# Tasks: PI Law Firm Content Engine v2 — Value-First Lead System

**Input**: Design documents from `/specs/036-pi-content-value-system/`
**Prerequisites**: spec.md, plan.md, research.md, data-model.md, contracts/, qa/SUMMARY.md
**Tests**: One minimal Playwright smoke test authored (R5). No broader test authoring.
**Organization**: By **Phase** (per plan.md) with **Tier** labels (per spec.md phased delivery) and **[USx]** user story mappings.

## Format: `- [ ] [ID] [P?] [USx] Description (refs)`

- **[P]**: Parallel-safe — different files, no dependencies on incomplete tasks
- **[USx]**: Which user story this task serves (US1-US6 from spec.md)
- **(refs)**: FR numbers the task satisfies, and tier
- File paths in each task are absolute (relative to repo root)

## Legend — Tier labels

- **Tier 1**: MUST SHIP BY APRIL 15 (MVP — Day 15 publishing deadline)
- **Tier 2**: Rolling during Week 3 (April 15-21), one day at a time
- **Tier 3**: Ship before Week 4 (by April 21)
- **Polish**: Post-Tier-3 cross-cutting work

## Legend — Size estimates

- **S**: <30 min
- **M**: 30 min - 2 hours
- **L**: 2-4 hours
- **XL**: 4+ hours

---

## Critical Path Summary

**Tier 1 critical path (sequential, cannot parallelize):**

T005 → T006 → T015-T022 (ResourceGate modification) → T017-T022 (demand-letter-matrix magnet + page) → T029-T031 (post rewrites Day 15 + 16) → T034 (pre-publish lint) → STOP (Mike approval gate before deploy)

**Everything else in Phase 1 (T001-T004) runs in parallel as investigation.**
**Phase 4 Worker scripting (T025-T027) runs in parallel with magnet/page work.**

---

## Phase 1: Investigation & Unblock (Tier 1 — critical)

**Purpose**: Validate assumptions, unblock the existing system, add newsletter opt-in to ResourceGate. This is the foundation that makes Tier 1 shippable.

### Investigation tasks (parallel-safe — run first)

- [ ] T001 [P] [US5] Read n8n cerebro-lead workflow via n8n MCP; document trigger node, field mapping, routing logic, and whether it handles `leadMagnet: newsletter-signup` distinctly — output to `/Users/makwa/theinnovativenative/specs/036-pi-content-value-system/qa/n8n-cerebro-lead-behavior.md` (refs: FR-029, R2, Tier 1, S)
- [ ] T002 [P] [US5] Read Airtable Leads table schema via Airtable MCP (base `appTO7OCRB2XbAlak`); document field names, types, and whether `leadMagnet` accepts arbitrary strings — output to `/Users/makwa/theinnovativenative/specs/036-pi-content-value-system/qa/airtable-leads-schema.md` (refs: H-003, R8, Tier 1, S)
- [ ] T003 [P] [US2] Verify `captureUTMParams()` is invoked from a global layout or `_app.tsx` hook in `/Users/makwa/theinnovativenative/projects/website/src/`; if not, add a 1-line `useEffect` invocation in the layout — output: verification note in `qa/SUMMARY.md` (refs: R7, Tier 1, S)
- [ ] T004 [P] [US2] Verify `NEXT_PUBLIC_LEAD_WEBHOOK_URL` env var is set in the production environment (check `.env.production` or hosting config); if missing, flag as blocker — output: verification note in `qa/SUMMARY.md` (refs: FR-023, Tier 1, S)

### PPTX deployment unblock

- [ ] T005 [US2] Create directory `/Users/makwa/theinnovativenative/projects/website/public/assets/lead-magnets/` (refs: FR-018, Tier 1, S)
- [ ] T006 [US2] Copy 6 existing PPTX files from `/Users/makwa/theinnovativenative/projects/002-stan-store-lawfirm-funnel/assets/cerebro/lead-magnets/` to `/Users/makwa/theinnovativenative/projects/website/public/assets/lead-magnets/` — files: `442-intake-math-pi.pptx`, `5-ai-tools-pi-firms.pptx`, `ai-governance-template-pi.pptx`, `heppner-executive-one-pager.pptx`, `heppner-tool-comparison-chart.pptx`, `insurance-ai-colossus-breakdown.pptx` (refs: FR-018, Tier 1, S) **[CRITICAL PATH]**
- [ ] T007 [US2] Spot-check one copied PPTX (442-intake-math-pi.pptx) by opening in LibreOffice or Mike's Keynote — verify slides render, no corruption, cover slide loads — output: one-line confirmation in `qa/SUMMARY.md` (refs: R3, Tier 1, S)

### ResourceGate component modification (critical path — sequential)

- [ ] T008 [US2] Add new `enableNewsletterOptIn` and `newsletterOptInLabel` optional props to `ResourceGateProps` interface in `/Users/makwa/theinnovativenative/projects/website/src/components/containers/resources/ResourceGate.tsx` per `contracts/resource-gate-props.md` — default `enableNewsletterOptIn` to `true` (refs: FR-025, resource-gate-props contract, Tier 1, S) **[CRITICAL PATH]**
- [ ] T009 [US2] Add newsletter opt-in checkbox UI to the success state (unlocked branch) in `ResourceGate.tsx` — unchecked by default, visible `<label>`, Space key toggles, mobile touch target ≥44×44px (refs: FR-025, FR-044, FR-049, Tier 1, M) **[CRITICAL PATH]**
- [ ] T010 [US2] Implement secondary newsletter POST handler in `ResourceGate.tsx` — fires when checkbox is checked AND download button clicked (or on checkbox change, whichever simpler); uses `fetch` with `keepalive: true` per L-001; payload per `contracts/lead-form-submission.schema.json` with `leadMagnet: 'newsletter-signup'`, `source: 'resource-page-newsletter-optin'` (refs: FR-026, L-001, Tier 1, M) **[CRITICAL PATH]**
- [ ] T011 [US2] Add new localStorage key `tin_resource_newsletter_optin_<leadMagnetId>` to track newsletter opt-in state; hide checkbox on return visit if already opted in (refs: data-model.md section 3, Tier 1, S)
- [ ] T012 [US2] Add honeypot hidden field (e.g., `<input name="website_url" style={{display:'none'}} tabIndex={-1} autoComplete="off" />`) to ResourceGate form — silently drop submissions with non-empty value, log to console counter (refs: FR-052, FR-054, Tier 1, S) **[CRITICAL PATH]**
- [ ] T013 [US2] Add time-based bot check: store `pageLoadedAt` timestamp in component state; if form submit time < pageLoadedAt + 2000ms, silently drop (refs: FR-053, FR-054, Tier 1, S) **[CRITICAL PATH]**
- [ ] T014 [US2] Add `aria-describedby` attribute linking form fields to error messages, wrap error display in `<div role="alert" aria-live="polite">` for screen reader announcement (refs: FR-050, Tier 1, S)
- [ ] T015 [US2] Add focus management: on success state render, use `useEffect` + `ref` to move keyboard focus to the Download button (refs: FR-051, Tier 1, S)

### Playwright test authoring

- [ ] T016 [P] [US2] Create new Playwright test file `/Users/makwa/theinnovativenative/projects/website/e2e/resources.spec.ts` with 5 test cases per `contracts/resource-gate-props.md`: (1) `/resources/442-intake-math` renders form, (2) empty submit shows field errors, (3) `/resources` hub lists 13 cards (may fail initially — revisit after Phase 3), (4) newsletter opt-in checkbox visible in success state, (5) returning visitor (localStorage set) skips form (refs: R5, L-004, Tier 1, M)

### Phase 1 gate

- [ ] T017 [US2] Run `npm run build` in `/Users/makwa/theinnovativenative/projects/website/` — fix any TypeScript or lint errors introduced by ResourceGate modification; do NOT proceed to Phase 2 until build is green (refs: FR-039, Tier 1, S) **[CRITICAL PATH]**

---

## Phase 2.0: PPTX Sample Verification (Tier 1 — hard gate)

**Purpose**: Generate ONE sample PPTX and verify quality before batch-generating 6 more. This is a hard dependency per toughlove H-007.

- [ ] T018 [US4] Author `/Users/makwa/theinnovativenative/projects/002-stan-store-lawfirm-funnel/content/lead-magnets/demand-letter-matrix.md` — YAML frontmatter per `contracts/lead-magnet-frontmatter.schema.json`, voice calibrated against `442-intake-math-pi.md`, 6 slides: title, problem, comparison matrix (EvenUp/Tavrn/Filevine DemandsAI/Supio), ROI calculator framework, decision tree, action step. Every sentence 8-18 words. No FR-055 banned phrases. (refs: FR-009, FR-056, voice_calibration field, Tier 1, L) **[CRITICAL PATH]**
- [ ] T019 [US4] Generate `demand-letter-matrix.pptx` by invoking the pptx-generator skill with the markdown source and `--brand innovative-native` flag — output to the skill's output directory first (refs: FR-010, Tier 1, S) **[CRITICAL PATH]**
- [ ] T020 [US4] **Phase 2.0 GATE** — Visually inspect the generated PPTX (open with `open` command or report for Mike's check): verify background consistency, font rendering, brand color application, no text overflow. If unacceptable, STOP and evaluate fallback per plan.md Phase 2.0 (brand config update, custom cookbook script, or manual PPTX). If acceptable, proceed to T021. (refs: H-007, Tier 1, S) **[CRITICAL PATH / HARD GATE]**
- [ ] T021 [US4] Move verified `demand-letter-matrix.pptx` to `/Users/makwa/theinnovativenative/projects/website/public/assets/lead-magnets/demand-letter-matrix.pptx` (refs: FR-019, Tier 1, S) **[CRITICAL PATH]**

---

## Phase 3: Resource Landing Pages & Hub (Tier 1 subset)

**Purpose**: Create the Tier 1 landing page (demand-letter-matrix), the hub index page, and navigation entry. Tier 2 and Tier 3 landing pages are in their respective sections below.

- [ ] T022 [US4] Create `/Users/makwa/theinnovativenative/projects/website/src/pages/resources/demand-letter-matrix.tsx` — copy pattern from `442-intake-math.tsx`, update title/subtitle/bullets/leadMagnetId/downloadUrl per `data-model.md` ResourceLandingPage entity, include all SEO meta tags per FR-015 (refs: FR-013, FR-015, FR-016, Tier 1, S) **[CRITICAL PATH]**
- [ ] T023 [US4] Create `/Users/makwa/theinnovativenative/projects/website/src/pages/resources/index.tsx` — hub page listing all 13 resources with ResourceCard components; include newsletter CTA banner linking to `/newsletter`; initial version includes only the 6 existing + demand-letter-matrix (7 cards); more added in Tier 2/3 (refs: FR-014, FR-048, Tier 1, M) **[CRITICAL PATH]**
- [ ] T024 [US4] Update `/Users/makwa/theinnovativenative/projects/website/src/data/navigation.ts` to add a "Resources" entry linking to `/resources` — single link, no dropdown needed for Tier 1 (refs: FR-017, Tier 1, S)
- [ ] T025 [US2] Run `npm run build` after Phase 3 Tier 1 — fix any errors (refs: FR-039, Tier 1, S) **[CRITICAL PATH]**

---

## Phase 4: buildmytribe.ai Short-URL System (Tier 1)

**Purpose**: Create the Cloudflare Worker artifacts so Mike can deploy them. Worker deploy itself is Mike's task.

- [ ] T026 [P] [US3] Create directory `/Users/makwa/theinnovativenative/infrastructure/buildmytribe-shortener/` (refs: plan.md project structure, Tier 1, S)
- [ ] T027 [P] [US3] Write `/Users/makwa/theinnovativenative/infrastructure/buildmytribe-shortener/worker.js` — Cloudflare Worker handler implementing strict whitelist-only slug lookup: load `redirect-map.json`, match exact slug, return 301 with forwarded query string OR return 404 for unknown slugs; NO fallback destinations, NO pass-through, NO user-supplied URLs. Include comment header citing FR-032 and security constraint. (refs: FR-032, FR-033, H-005, Tier 1, M) **[CRITICAL PATH]**
- [ ] T028 [P] [US3] Write `/Users/makwa/theinnovativenative/infrastructure/buildmytribe-shortener/redirect-map.json` per `contracts/vanity-redirect-map.schema.json` — Tier 1 entries: root + 6 existing (`math`, `tools`, `policy`, `heppner`, `risk`, `colossus`) + 1 new (`demand`). Tier 2 and 3 slugs added incrementally in later tasks. (refs: FR-034, Tier 1, S) **[CRITICAL PATH]**
- [ ] T029 [US3] Write `/Users/makwa/theinnovativenative/infrastructure/buildmytribe-shortener/DEPLOY.md` — step-by-step instructions for Mike: (1) log into Cloudflare, (2) add buildmytribe.ai as a site if not already, (3) point registrar DNS to Cloudflare nameservers, (4) create new Worker and paste worker.js, (5) add route `buildmytribe.ai/*`, (6) deploy, (7) verify with 3 curl commands (root, one Tier 1 slug, one unknown slug expecting 404) (refs: FR-032, H-004, Tier 1, S)
- [ ] T030 [US3] **HANDOFF TO MIKE** — Cloudflare Worker deploy. Mike follows DEPLOY.md. If deployed by T-24h before Day 15 publish, posts use vanity URLs. If not deployed, Tier 1 posts use fallback direct URLs per FR-005. Execution continues regardless of Worker status. (refs: FR-032, H-004, Tier 1, blocker-external)

---

## Phase 5: Post Rewrites (Tier 1 — Days 15 and 16 only)

**Purpose**: Rewrite Day 15 and Day 16 of `/Users/makwa/theinnovativenative/projects/002-stan-store-lawfirm-funnel/content/weekly-content/week-03-apr-15-21.md` using the 5-section structure. Preserve all hashtags and First Comment blocks per FR-001 amended.

- [ ] T031 [US1] Rewrite Day 15 (Apr 15) posts in `week-03-apr-15-21.md` — 9 posts total (3 LinkedIn, 3 Facebook, 3 Instagram). Core idea retained ("AI in legal isn't ChatGPT drafting your briefs"). Apply 5-section structure to each post body. LinkedIn text post: 250-350 words. Carousels: 7-8 slides with ≥2 PLAY slides. Upgrade CTA: `buildmytribe.ai/tools` (existing magnet, vanity URL) OR `theinnovativenative.com/resources/5-ai-tools-pi` (fallback). NO AI-tell phrases per FR-055. Voice matches weeks 1-2 per FR-056. Preserve hashtags and First Comment blocks unchanged. (refs: FR-001 through FR-008, FR-055, FR-056, Tier 1, M) **[CRITICAL PATH]**
- [ ] T032 [US1] Rewrite Day 16 (Apr 16) posts in `week-03-apr-15-21.md` — 9 posts total. Core idea retained ("Demand letters: 12 hours to 45 minutes"). Upgrade CTA: `buildmytribe.ai/demand` (new magnet, vanity URL) OR `theinnovativenative.com/resources/demand-letter-matrix` (fallback). Same constraints as T031. PLAY section should include 3-5 specific steps readers can take this week (e.g., "Time your current demand letter process", "Pull 10 recent letters and calculate baseline", "Email your paralegal about the Harvard stat", "Book 30 minutes Friday to review EvenUp and Tavrn demos"). (refs: FR-001 through FR-008, FR-055, FR-056, Tier 1, M) **[CRITICAL PATH]**
- [ ] T033 [US1] Run a regex scan across Day 15 and Day 16 post content for the 16 FR-055 banned phrases; output count per phrase; if any matches, fix and rescan (refs: FR-055, Tier 1, S)
- [ ] T034 [US1] Pre-publish lint Day 15 and Day 16: verify every post has 5 sections, every upgrade CTA resolves to a real page (check vanity URL exists in `redirect-map.json` OR direct URL exists in `src/pages/resources/`), every post body word count is in range (refs: FR-008, FR-038, Tier 1, S) **[CRITICAL PATH]**

---

## Phase 6: Deploy + Verify (STOP POINT — Mike approval gate per Option A)

**Purpose**: Prepare the build, run pre-deploy safety check, stop for Mike's approval, then deploy on his go-ahead.

- [ ] T035 [US5] Run `npm run build` in `/Users/makwa/theinnovativenative/projects/website/` one final time with all Phase 1-3 changes; resolve any TypeScript or lint errors (refs: FR-039, Tier 1, S) **[CRITICAL PATH]**
- [ ] T036 [US5] Run Playwright E2E suite `npx playwright test e2e/ --reporter=list` in `/Users/makwa/theinnovativenative/projects/website/`; all existing tests plus new `resources.spec.ts` must pass; if any fail, fix before proceeding (refs: FR-039, R5, Tier 1, M)
- [ ] T037 [US5] **Pre-deploy file diff verification**: SSH to A2 Hosting (`ssh -i ~/.ssh/a2hosting_tin -p 7822 delikate@75.98.175.76`), list files in `~/theinnovativenative.com/`, cross-check against local `projects/website/out/` build output; flag any files present on server but absent locally that would be DELETED by `rsync --delete`. Output the diff to `qa/pre-deploy-diff.md`. Do NOT proceed if unexpected files would be destroyed. (refs: FR-057, Tier 1, S) **[CRITICAL PATH]**
- [ ] T038 [US5] **HANDOFF TO MIKE** — Deploy approval gate per Option A. Present: (1) list of files changed by this deploy, (2) pre-deploy diff output from T037, (3) confirmation that T035/T036 passed, (4) Cloudflare Worker deploy status (T030 — deployed or fallback URLs?), (5) summary of what will go live. Mike approves or blocks. STOP until Mike signals go. (refs: Option A user directive, Tier 1, blocker-external) **[CRITICAL PATH / STOP POINT]**

### ---- AUTONOMOUS RUN STOPS HERE (per Option A) ----

The tasks below execute after Mike's approval at T038. They are NOT part of the autonomous implement step.

- [ ] T039 [US5] Execute rsync deploy per `projects/website/CLAUDE.md` command — from `/Users/makwa/theinnovativenative/projects/website/out/` to `delikate@75.98.175.76:~/theinnovativenative.com/` with existing excludes (refs: FR-040, Tier 1, S)
- [ ] T040 [US5] Run the directory index fix script per `projects/website/CLAUDE.md`; verify if `resources` needs to be added to the loop (test `/resources` URL after deploy) (refs: FR-041, L-005, Tier 1, S)
- [ ] T041 [US5] Live smoke test: visit `https://theinnovativenative.com/resources/demand-letter-matrix`, fill form with test email `qa-036-<timestamp>@theinnovativenative.com`, submit, verify success state renders, click Download, verify PPTX downloads and opens, check newsletter checkbox, verify second POST fires, check Airtable for 2 records (demand-letter-matrix + newsletter-signup) (refs: FR-042, SC-004, SC-005, Tier 1, S)
- [ ] T042 [US5] Verify vanity URL resolves: `curl -IL https://buildmytribe.ai/demand` — expect 301 chain to `/resources/demand-letter-matrix`; OR if fallback path used, verify direct URL works (refs: FR-005, SC-007, Tier 1, S)
- [ ] T043 [US5] Verify `/resources` hub page renders and lists 7 cards (6 existing + demand-letter-matrix) (refs: FR-014, SC-009, Tier 1, S)

---

## Phase 7: Pilot (Tier 1 — Mike's tasks)

**Purpose**: Hand-publish Day 16 across all three platforms as the pilot.

- [ ] T044 [US1] **MIKE** Hand-publish Day 16 rewritten posts across LinkedIn, Facebook, Instagram on April 16 (refs: SC-010, Tier 1, S-Mike)
- [ ] T045 [US1] **MIKE** Monitor Day 16 metrics for 24 hours: engagement, clicks through, form submissions, Airtable records (refs: SC-010, Tier 1, S-Mike)
- [ ] T046 [US1] If pilot shows broken links or zero captures, STOP propagating to remaining days; debug first. Otherwise continue to Tier 2. (refs: SC-010, Tier 1, blocker-decision)

---

## ========== TIER 2: Rolling during Week 3 (April 15-21) ==========

Tier 2 tasks ship one day at a time, each before its publishing slot. Each day is a mini-cycle: author magnet → generate PPTX → create landing page → rewrite posts → update redirect-map → incremental deploy.

### Day 17 (Apr 17) — RAG vs Wrapper

- [ ] T047 [P] [US4] Author `rag-vs-wrapper-checklist.md` in `/Users/makwa/theinnovativenative/projects/002-stan-store-lawfirm-funnel/content/lead-magnets/` — voice calibrated against `5-ai-tools-pi-firms.md`, 6 slides, 5-question vendor evaluation checklist (refs: FR-009, FR-056, Tier 2, L)
- [ ] T048 [US4] Generate `rag-vs-wrapper-checklist.pptx` via pptx-generator skill (refs: FR-010, Tier 2, S)
- [ ] T049 [US4] Deploy PPTX to `projects/website/public/assets/lead-magnets/rag-vs-wrapper-checklist.pptx` (refs: FR-019, Tier 2, S)
- [ ] T050 [US4] Create `projects/website/src/pages/resources/rag-vs-wrapper-checklist.tsx` (refs: FR-013, Tier 2, S)
- [ ] T051 [US4] Add `wrapper` slug to `redirect-map.json` → `/resources/rag-vs-wrapper-checklist` (refs: FR-034, Tier 2, S)
- [ ] T052 [US4] Add rag-vs-wrapper-checklist card to `/resources/index.tsx` hub (refs: FR-014, Tier 2, S)
- [ ] T053 [US1] Rewrite Day 17 (Apr 17) posts in `week-03-apr-15-21.md` (refs: FR-001-008, FR-055, FR-056, Tier 2, M)
- [ ] T054 [US5] Incremental Tier 2 deploy (build + rsync + dir-fix + smoke test) (refs: FR-040-042, Tier 2, S)

### Day 18 (Apr 18) — 5 No-Risk Automations

- [ ] T055 [P] [US4] Author `5-pi-automations-guide.md` — voice calibrated against `442-intake-math-pi.md`, 7 slides, setup guide for 5 automations under $200/mo (refs: FR-009, Tier 2, L)
- [ ] T056 [US4] Generate `5-pi-automations-guide.pptx` (refs: FR-010, Tier 2, S)
- [ ] T057 [US4] Deploy PPTX (refs: FR-019, Tier 2, S)
- [ ] T058 [US4] Create `5-pi-automations-guide.tsx` landing page (refs: FR-013, Tier 2, S)
- [ ] T059 [US4] Add `automate` slug to `redirect-map.json` (refs: FR-034, Tier 2, S)
- [ ] T060 [US4] Add card to hub index (refs: FR-014, Tier 2, S)
- [ ] T061 [US1] Rewrite Day 18 posts (refs: FR-001-008, Tier 2, M)
- [ ] T062 [US5] Incremental Tier 2 deploy (refs: FR-040-042, Tier 2, S)

### Day 19 (Apr 19) — CMS Dashboard Setup

- [ ] T063 [P] [US4] Author `cms-dashboard-guide.md` — voice calibrated against `ai-governance-template-pi.md`, 7 slides, 5 reports every PI firm should pull (refs: FR-009, Tier 2, L)
- [ ] T064 [US4] Generate `cms-dashboard-guide.pptx` (refs: FR-010, Tier 2, S)
- [ ] T065 [US4] Deploy PPTX (refs: FR-019, Tier 2, S)
- [ ] T066 [US4] Create `cms-dashboard-guide.tsx` landing page (refs: FR-013, Tier 2, S)
- [ ] T067 [US4] Add `cms` slug to `redirect-map.json` (refs: FR-034, Tier 2, S)
- [ ] T068 [US4] Add card to hub index (refs: FR-014, Tier 2, S)
- [ ] T069 [US1] Rewrite Day 19 posts (refs: FR-001-008, Tier 2, M)
- [ ] T070 [US5] Incremental Tier 2 deploy (refs: FR-040-042, Tier 2, S)

### Voice drift midpoint audit

- [ ] T071 [US1] After Day 19 rewrite: sample one random rewritten post from Days 15-19, compare against calibration markers (sentence length, voice, PLAY specificity); flag any drift and fix before continuing (refs: FR-055, FR-056, voice drift risk mitigation, Tier 2, S)

### Day 20 (Apr 20) — Discovery-Phase AI (1-pager)

- [ ] T072 [P] [US4] Author `discovery-ai-overview.md` — voice calibrated against `heppner-executive-one-pager.md`, 2 slides (1-pager), body-cam transcription AI overview (refs: FR-009, Tier 2, M)
- [ ] T073 [US4] Generate `discovery-ai-overview.pptx` (refs: FR-010, Tier 2, S)
- [ ] T074 [US4] Deploy PPTX (refs: FR-019, Tier 2, S)
- [ ] T075 [US4] Create `discovery-ai-overview.tsx` landing page (refs: FR-013, Tier 2, S)
- [ ] T076 [US4] Add `discovery` slug to `redirect-map.json` (refs: FR-034, Tier 2, S)
- [ ] T077 [US4] Add card to hub index (refs: FR-014, Tier 2, S)
- [ ] T078 [US1] Rewrite Day 20 posts (refs: FR-001-008, Tier 2, M)
- [ ] T079 [US5] Incremental Tier 2 deploy (refs: FR-040-042, Tier 2, S)

### Day 21 (Apr 21) — Week 3 Digest (no new magnet)

- [ ] T080 [US1] Rewrite Day 21 posts — Week 3 digest format, references multiple existing resources; upgrade CTA points to `/resources` hub index (refs: FR-001-008, Tier 2, M)
- [ ] T081 [US5] Incremental Tier 2 deploy (refs: FR-040-042, Tier 2, S)

### Tier 2 Cloudflare Worker update

- [ ] T082 [US3] **HANDOFF TO MIKE** — Update Cloudflare Worker with Tier 2 slugs (`wrapper`, `automate`, `cms`, `discovery`) per updated `redirect-map.json`; verify each with curl (refs: FR-032, FR-034, Tier 2, blocker-external)

---

## ========== TIER 3: Ship before Week 4 (by April 21) ==========

### Week 4 magnets

- [ ] T083 [P] [US4] Author `governance-audit-framework.md` — voice calibrated against `ai-governance-template-pi.md`, 6 slides, cost comparison framework + audit worksheet (refs: FR-009, Tier 3, L)
- [ ] T084 [US4] Generate `governance-audit-framework.pptx` (refs: FR-010, Tier 3, S)
- [ ] T085 [US4] Deploy PPTX (refs: FR-019, Tier 3, S)
- [ ] T086 [US4] Create `governance-audit-framework.tsx` landing page (refs: FR-013, Tier 3, S)

- [ ] T087 [P] [US4] Author `5-pattern-audit-workbook.md` — voice calibrated against `ai-governance-template-pi.md`, 8 slides, self-audit workbook based on 15-firm pattern analysis (refs: FR-009, Tier 3, XL)
- [ ] T088 [US4] Generate `5-pattern-audit-workbook.pptx` (refs: FR-010, Tier 3, S)
- [ ] T089 [US4] Deploy PPTX (refs: FR-019, Tier 3, S)
- [ ] T090 [US4] Create `5-pattern-audit-workbook.tsx` landing page (refs: FR-013, Tier 3, S)

### Week 4 post rewrites

- [ ] T091 [US1] Rewrite Day 22 (Apr 22) posts in `week-04-apr-22-28.md` — reuses `ai-governance-template-pi` (upgrade CTA: `buildmytribe.ai/policy`) (refs: FR-001-008, Tier 3, M)
- [ ] T092 [US1] Rewrite Day 23 (Apr 23) posts — reuses `ai-governance-template-pi` (refs: FR-001-008, Tier 3, M)
- [ ] T093 [US1] Rewrite Day 24 (Apr 24) posts — reuses `ai-governance-template-pi` (refs: FR-001-008, Tier 3, M)
- [ ] T094 [US1] Rewrite Day 25 (Apr 25) posts — new `governance-audit-framework` magnet; upgrade CTA: `buildmytribe.ai/cost` (refs: FR-001-008, Tier 3, M)
- [ ] T095 [US1] Rewrite Day 26 (Apr 26) posts — new `5-pattern-audit-workbook` magnet; upgrade CTA: `buildmytribe.ai/audit` (refs: FR-001-008, Tier 3, M)
- [ ] T096 [US1] Rewrite Day 27 (Apr 27) posts — "Free policy drop" reuses `ai-governance-template-pi` (refs: FR-001-008, Tier 3, M)
- [ ] T097 [US1] Rewrite Day 28 (Apr 28) posts — "April recap" references all month's resources, upgrade CTA: `/resources` hub (refs: FR-001-008, Tier 3, M)

### Tier 3 updates

- [ ] T098 [US4] Add `cost` and `audit` slugs to `redirect-map.json` (refs: FR-034, Tier 3, S)
- [ ] T099 [US4] Update `/resources/index.tsx` hub to list all 13 resources (refs: FR-014, SC-009, Tier 3, S)
- [ ] T100 [US3] **HANDOFF TO MIKE** — Final Cloudflare Worker update with Tier 3 slugs; verify full set of 14 vanity URLs (refs: FR-032, FR-034, Tier 3, blocker-external)
- [ ] T101 [US5] Tier 3 deploy: build + rsync + dir-fix + smoke test on one new Week 4 page (refs: FR-040-042, Tier 3, M)

### Post-launch sweep

- [ ] T102 [US1] Post-launch sweep: scan `week-03-apr-15-21.md` and `week-04-apr-22-28.md` for any `theinnovativenative.com/resources/<slug>` direct URLs that were used as fallback during Tier 1/2; convert to `buildmytribe.ai/<vanity-slug>` now that Worker is fully deployed (refs: R-002 mitigation, FR-005, Tier 3, S)
- [ ] T103 [US1] Full voice drift audit: regex scan for all 16 FR-055 banned phrases across both week files; count matches per day; fix any hits (refs: FR-055, M-007, Tier 3, M)

---

## ========== POLISH & CROSS-CUTTING (after Tier 3) ==========

- [ ] T104 [P] [US5] Run Lighthouse on `/resources/442-intake-math` (existing) and `/resources/demand-letter-matrix` (new) — log LCP, CLS, INP scores in `qa/SUMMARY.md`; targets per M-003 (refs: M-003, Polish, S)
- [ ] T105 [P] [US5] Add cache headers for `/assets/lead-magnets/*` via LiteSpeed config or Next.js `_headers` file — `Cache-Control: public, max-age=604800` (refs: M-004, Polish, S)
- [ ] T106 [P] [US2] Add returning visitor test case to `resources.spec.ts`: set localStorage unlock flag, reload page, verify form skipped (refs: L-004, Polish, S)
- [ ] T107 [P] Extend `quickstart.md` troubleshooting table with 2 new rows: "Form submits but no Airtable record" and "Vanity URL redirects but lands on 404" (refs: L-003, Polish, S)
- [ ] T108 [US1] Run final `/toughlove` post-implementation review — target grade A- or better per speckit-fullloop exit criteria (refs: Step 7 of full loop, Polish, M)
- [ ] T109 Log time entries, tasks, deliverables to Airtable per constitution mandatory logging — feature `036-pi-content-value-system`, project `rec1NqwMMWvv2PpVD` (refs: constitution Airtable Logging, Polish, S)
- [ ] T110 Upload 7 new PPTX files + spec kit to Google Drive folder `TIN Marketing > 002-stan-store-lawfirm-funnel > April 2026` per constitution mandatory cloud upload; set sharing to "Anyone with link" (refs: constitution Cloud Asset Upload, Polish, S)
- [ ] T111 Update `.specify/memory/learnings/shared-learnings.md` with new patterns discovered in this feature (voice-first post structure, whitelist-only Worker pattern, phased delivery with Mike handoffs) (refs: Step 8 of full loop, Polish, S)

---

## Dependencies Summary

### Critical path (Tier 1 — must complete in this order before the Mike approval gate)

```
T005 → T006 ┐
            ├─→ T017 (build check) ┐
T008→T009→T010→T011→T012→T013→T014→T015 ┘               │
                                                         │
T018 → T019 → T020 (HARD GATE) → T021 ─────────────────┐│
                                                        ├┘
                                                        │
T022 → T023 → T024 → T025 (build check) ←──────────────┘
                                                        │
T027 ↗ (parallel with T022-T025)                        │
T028 ↗                                                  │
T029 ↗                                                  │
T030 (HANDOFF Mike Worker) ─────────────────────────────┤
                                                        │
T031 → T032 → T033 → T034 ─────────────────────────────→ T035 → T036 → T037 → T038 (STOP — Mike approval)
```

### Parallel-safe clusters

- Investigation: T001, T002, T003, T004 — all independent, all Tier 1
- Worker artifacts: T027, T028, T029 — can run in parallel with T018-T022 (magnet work)
- Tier 2 magnets: T047-T076 — each day is sequential within itself, but different days can be worked in parallel if pacing allows
- Tier 3 magnets: T083-T090 — parallel between the two magnets
- Polish: T104, T105, T106, T107 — all independent

### Blocker tasks (external — waits on Mike)

| Task | Blocker | Impact |
|------|---------|--------|
| T030 | Mike deploys Cloudflare Worker | Without it, Tier 1 posts use fallback direct URLs (acceptable per FR-005) |
| T038 | Mike approves deploy | STOP POINT per Option A — autonomous implementer halts here |
| T082 | Mike updates Worker with Tier 2 slugs | Without it, Tier 2 posts use fallback direct URLs |
| T100 | Mike updates Worker with Tier 3 slugs | Without it, Tier 3 posts use fallback direct URLs |

---

## Autonomous Run Boundary (Option A)

Per user directive, the autonomous implementer (Step 5 of speckit-fullloop) executes **tasks T001 through T038 inclusive**. T038 is the Mike approval gate. The implementer STOPS at T038 and reports status. Mike reviews and authorizes deploy (T039 onward), or requests changes.

**T001-T038 covers**:
- Phase 1 investigation + unblock + ResourceGate modification (T001-T017)
- Phase 2.0 sample PPTX verification (T018-T021)
- Phase 3 Tier 1 landing page + hub + nav (T022-T025)
- Phase 4 Worker artifacts (not deployment) (T026-T029)
- Phase 4 handoff to Mike (T030 — non-blocking, continues regardless)
- Phase 5 Tier 1 post rewrites (Days 15, 16) (T031-T034)
- Phase 6 build + test + pre-deploy diff (T035-T037)
- Phase 6 STOP at Mike approval gate (T038)

**T039-T111 runs AFTER Mike approval**, either in the same session or rolled forward manually.

---

## Task Count Summary

| Phase | Task count | Tier | Approximate time |
|-------|------------|------|------------------|
| Phase 1 Investigation + Unblock | 17 (T001-T017) | 1 | 4-6 hours |
| Phase 2.0 Sample Verification | 4 (T018-T021) | 1 | 2-3 hours |
| Phase 3 Tier 1 Pages | 4 (T022-T025) | 1 | 1 hour |
| Phase 4 Worker Artifacts | 5 (T026-T030) | 1 | 1 hour |
| Phase 5 Tier 1 Post Rewrites | 4 (T031-T034) | 1 | 2-3 hours |
| Phase 6 Tier 1 Deploy | 9 (T035-T043) | 1 | 1-2 hours + Mike approval |
| Phase 7 Pilot | 3 (T044-T046) | 1 | Mike tasks |
| **Tier 1 subtotal** | **46** | **1** | **~11-16 hours + Mike time** |
| Tier 2 (Days 17-21) | 36 (T047-T082) | 2 | ~12-16 hours rolling |
| Tier 3 (Days 22-28 + Week 4 magnets + sweep) | 21 (T083-T103) | 3 | ~10-14 hours rolling |
| Polish | 8 (T104-T111) | Polish | ~2-3 hours |
| **Total** | **111** | — | **~35-50 hours** |

---

## User Story Coverage

| User Story | Tasks |
|-----------|-------|
| **US1** — PI Lawyer learns from post without clicking | T031, T032, T033, T034, T044, T045, T046, T053, T061, T069, T071, T078, T080, T091-T097, T102, T103, T108 (~20 tasks) |
| **US2** — Lawyer downloads + joins newsletter in one flow | T003-T017, T025, T036, T106 (~17 tasks) |
| **US3** — Every post has working upgrade CTA | T026-T030, T082, T100 (~7 tasks) |
| **US4** — 7 missing lead magnets exist as real downloads | T018-T024, T047-T052, T055-T060, T063-T068, T072-T077, T083-T090, T098, T099 (~35 tasks) |
| **US5** — Mike can ship without firefighting | T001, T002, T035, T037, T038-T043, T054, T062, T070, T079, T081, T101, T104, T105 (~17 tasks) |
| **US6** — Returning readers opt into newsletter | Covered by US2 tasks (newsletter opt-in is part of the capture flow) |

---

## MVP Definition (if everything else slips)

Absolute minimum viable ship: **T001-T038 + Mike's approval at T038 + T039-T046 (Phase 6 deploy + Phase 7 pilot)**.

This ships:
- Working lead capture on existing 6 resource pages (newsletter opt-in added)
- 1 new magnet (demand-letter-matrix) + 1 new landing page
- Day 15 and Day 16 rewrites in the new format
- Day 16 pilot published across all 3 platforms
- At least 1 captured test lead validating the end-to-end flow

**This is the "if we only do the absolute minimum before April 15, this is what ships."** Everything beyond is Tier 2/3 rolling work.

---

## Next

After all Tier 1 tasks complete and Mike approves the deploy at T038, the autonomous implementer proceeds with T039-T046. After pilot succeeds (T046 decision point), Tier 2 and Tier 3 continue rolling per the schedule above, with incremental toughlove passes as each tier completes.
