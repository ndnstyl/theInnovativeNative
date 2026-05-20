# Implementation Plan: PI Law Firm Content Engine v2 — Value-First Lead System

**Branch**: `036-pi-content-value-system` | **Date**: 2026-04-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/036-pi-content-value-system/spec.md`

## Summary

Transform the PI/mass tort content campaign's weeks 3 and 4 (Apr 15-28) from pain-point-only posts into value-first posts by introducing a 5-section structure (Hook → Why → Play → Proof → Upgrade) that delivers an in-body "PLAY" section readers can act on without ever clicking a link. Simultaneously stand up the delivery infrastructure behind those posts: fix 6 undeliverable PPTX files by copying them into the website's public folder, build 7 new lead magnets (markdown source + PPTX + landing page) covering the topics where deliverables don't yet exist, wire a newsletter opt-in checkbox into the existing `ResourceGate` success state, and set up buildmytribe.ai as a branded short-URL domain via a Cloudflare Worker so every post's Upgrade CTA resolves through a memorable, on-brand vanity slug.

**Technical approach**: Static-export Next.js site (no new runtime deps). All lead magnet assets live in the project content folder with copies deployed to `public/assets/lead-magnets/`. Resource landing pages are thin wrappers around the existing `ResourceGate` component — reused, not forked. Newsletter opt-in is a localized ResourceGate modification (one checkbox, one conditional POST). Branded URL redirects run on a single Cloudflare Worker with a static slug→destination map. Post rewrites overwrite the existing week-03 and week-04 markdown files in place. Deployment goes through the existing rsync-to-A2-Hosting pipeline documented in `projects/website/CLAUDE.md`. All n8n work is read-only investigation; Mike tests any workflow changes manually per the hard rule.

## Technical Context

**Language/Version**: TypeScript 5.2.2, React 18.2.0, Node 18+ (build tooling only)
**Primary Dependencies**: Next.js 13.4.19 (Pages Router, `output: 'export'`), SCSS 1.66.1, Bootstrap 5.3.1, GSAP 3.12.2. NO new runtime dependencies introduced.
**Storage**: Static HTML output → A2 Hosting (LiteSpeed). Lead capture persists to Airtable base `appTO7OCRB2XbAlak` via n8n webhook (`NEXT_PUBLIC_LEAD_WEBHOOK_URL`). Unlock state persists in browser localStorage. No new databases, no schema changes.
**Testing**: Existing Playwright E2E suite at `projects/website/e2e/` (37 tests passing per latest commit). Manual smoke test on live domain per FR-042. `npm run build` enforces TypeScript and lint cleanliness at every phase boundary.
**Target Platform**: Modern evergreen browsers on desktop and mobile. Mobile-first because lawyers read LinkedIn on phones.
**Project Type**: Web (static export only — no API, no SSR, no ISR).
**Performance Goals**: Resource page first contentful paint < 2s on 3G. Form submit → success state < 3s end-to-end. No cumulative layout shift after unlock transition. PPTX download starts within 500ms of button tap.
**Constraints**: Static export only (`output: 'export'`). No server-side code. No new dependencies that require server runtime. ResourceGate component must NOT be forked (FR-014). All n8n changes are read-only from our side. No Airtable schema changes. Brand palette locked to dark (#0a0f1a) + gold (#d4a853).
**Scale/Scope**: 13 resource pages (6 existing + 7 new), ~126 posts rewritten (14 days × 9 posts/day), 7 new PPTX files, 1 hub index page (`/resources`), 1 Cloudflare Worker with 14 redirect entries, 1 ResourceGate component modification (newsletter opt-in checkbox). Total net new TSX pages: 8. Total net new markdown files: 7. Total edited files: 2 (week-03, week-04). Total modified component files: 1 (ResourceGate).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| **Airtable Logging** (Time Entry, Task, Deliverable per session) | ✅ PASS | Execution phase will log all per-session activity. Plan itself generates a Deliverable record (the spec kit). |
| **Cloud Asset Upload** (Google Drive for every deliverable) | ⚠️ FOLLOW-UP | The 7 new PPTX files plus the spec kit documents must be uploaded to `TIN Marketing > 002-stan-store-lawfirm-funnel > April 2026` at end of implementation. Recorded as a tasks.md item, not a blocker. |
| **Database Safety** (check before migrate) | ✅ PASS | No schema changes. Airtable Leads table accepts arbitrary `leadMagnet` string values — verified via existing NewsletterSignup and ResourceGate code paths. |
| **Airtable Schema Governance** (no new tables without approval) | ✅ PASS | Reuses existing Leads table. Only new `leadMagnet` tag values are introduced, which is free-text field content, not schema change. |
| **n8n Workflow Rules** (user tests; no agent changes without approval) | ✅ PASS | Phase 1 is read-only investigation of cerebro-lead workflow. Any recommended changes go to Mike as a follow-up task; we do not modify n8n workflows in this feature. |
| **Handoff Protocol / Two-Phase Gate** (Drew authorization) | ✅ EXEMPT | CEO (Mike) is executing directly under P1 authority. P1 override applies. Per constitution §CEO Direct Execution, CEO must notify Drew within 1 hour and log time/tasks to Airtable — noted as an execution responsibility, not a blocker. |
| **File-Scope Locking** (owned_paths declared) | ✅ PASS | Added to spec.md frontmatter. Paths: 6 directories/files listed. No conflict check needed because no other spec claims these paths (verified: 034-community-feed-ux owns classroom/community paths; no overlap). |
| **Unified Feature Ownership** (one owner, one project_lead) | ✅ PASS | owner = Mike (CEO, P1). project_lead = Mike. Single spec kit, single feature surface. |
| **Coordinated QA** (single qa/SUMMARY.md) | ✅ PASS | Feature dir will use `qa/SUMMARY.md` as the single source of truth. Toughlove pre- and post-implementation findings land there. |
| **Principle: Skill-First Architecture** | ✅ PASS | pptx-generator skill drives Phase 2 PPTX generation. No new custom tooling invented; uses existing skill infrastructure. |
| **Principle: Progressive Disclosure** | ✅ PASS | Resource landing pages are minimal wrappers around existing ResourceGate. New lead magnets are 4-8 pages each, matching existing magnet length. Hub index page is one scannable list, not a navigation tree. |
| **Principle: Brand Consistency** | ✅ PASS | All new artifacts follow brand.json, tone-of-voice.md, brand-system.md conventions already applied in weeks 1-2 and the existing 6 lead magnets. |
| **Principle: Content Framing** (builders not experts) | ✅ PASS | The in-body PLAY sections are framed as "here's what the firms that figured this out are doing" — builder framing, not domain authority. |

**Violations**: None.
**Complexity Tracking**: N/A (no violations).

## Project Structure

### Documentation (this feature)

```text
specs/036-pi-content-value-system/
├── spec.md                          # feature specification (completed in /speckit.specify)
├── plan.md                          # THIS FILE
├── research.md                      # Phase 0 output — technical unknowns resolved
├── data-model.md                    # Phase 1 output — entities and data shapes
├── quickstart.md                    # Phase 1 output — developer onboarding
├── contracts/                       # Phase 1 output — interface contracts
│   ├── lead-form-submission.schema.json
│   ├── resource-gate-props.md
│   ├── vanity-redirect-map.schema.json
│   └── lead-magnet-frontmatter.schema.json
├── checklists/
│   └── requirements.md              # spec quality checklist (completed)
├── qa/
│   └── SUMMARY.md                   # single source of truth for QA findings (created in toughlove step)
└── tasks.md                         # created by /speckit.tasks — NOT in this plan
```

### Source Code (repository root)

```text
projects/website/                                # Next.js static export root
├── src/
│   ├── components/
│   │   └── containers/
│   │       ├── resources/
│   │       │   └── ResourceGate.tsx             # MODIFIED: add newsletter opt-in checkbox
│   │       └── newsletter/
│   │           └── NewsletterSignup.tsx         # UNCHANGED (reference only)
│   ├── pages/
│   │   ├── resources/
│   │   │   ├── index.tsx                        # NEW: hub index listing all 13 resources
│   │   │   ├── 442-intake-math.tsx              # EXISTING
│   │   │   ├── 5-ai-tools-pi.tsx                # EXISTING
│   │   │   ├── ai-governance-template-pi.tsx    # EXISTING
│   │   │   ├── ai-tool-risk-chart.tsx           # EXISTING
│   │   │   ├── heppner-one-pager.tsx            # EXISTING
│   │   │   ├── insurance-ai-colossus.tsx        # EXISTING
│   │   │   ├── demand-letter-matrix.tsx         # NEW
│   │   │   ├── rag-vs-wrapper-checklist.tsx     # NEW
│   │   │   ├── 5-pi-automations-guide.tsx       # NEW
│   │   │   ├── cms-dashboard-guide.tsx          # NEW
│   │   │   ├── discovery-ai-overview.tsx        # NEW
│   │   │   ├── governance-audit-framework.tsx   # NEW
│   │   │   └── 5-pattern-audit-workbook.tsx     # NEW
│   │   └── newsletter.tsx                        # UNCHANGED (reference only)
│   └── data/
│       └── navigation.ts                         # MODIFIED: add Resources nav entry
├── public/
│   └── assets/
│       └── lead-magnets/                         # NEW DIRECTORY
│           ├── 442-intake-math-pi.pptx           # NEW (copied from project folder)
│           ├── 5-ai-tools-pi-firms.pptx          # NEW (copied from project folder)
│           ├── ai-governance-template-pi.pptx    # NEW (copied from project folder)
│           ├── heppner-executive-one-pager.pptx  # NEW (copied from project folder)
│           ├── heppner-tool-comparison-chart.pptx # NEW (copied from project folder)
│           ├── insurance-ai-colossus-breakdown.pptx # NEW (copied from project folder)
│           ├── demand-letter-matrix.pptx         # NEW (generated by pptx-generator)
│           ├── rag-vs-wrapper-checklist.pptx     # NEW (generated by pptx-generator)
│           ├── 5-pi-automations-guide.pptx       # NEW (generated by pptx-generator)
│           ├── cms-dashboard-guide.pptx          # NEW (generated by pptx-generator)
│           ├── discovery-ai-overview.pptx        # NEW (generated by pptx-generator)
│           ├── governance-audit-framework.pptx   # NEW (generated by pptx-generator)
│           └── 5-pattern-audit-workbook.pptx     # NEW (generated by pptx-generator)
└── e2e/                                          # Existing Playwright suite (reference only)

projects/002-stan-store-lawfirm-funnel/
├── content/
│   ├── lead-magnets/
│   │   ├── 442-intake-math-pi.md                # EXISTING
│   │   ├── 5-ai-tools-pi-firms.md               # EXISTING
│   │   ├── ai-governance-template-pi.md         # EXISTING
│   │   ├── heppner-executive-one-pager.md       # EXISTING
│   │   ├── heppner-tool-comparison-chart.md     # EXISTING
│   │   ├── insurance-ai-colossus-breakdown.md   # EXISTING
│   │   ├── demand-letter-matrix.md              # NEW
│   │   ├── rag-vs-wrapper-checklist.md          # NEW
│   │   ├── 5-pi-automations-guide.md            # NEW
│   │   ├── cms-dashboard-guide.md               # NEW
│   │   ├── discovery-ai-overview.md             # NEW
│   │   ├── governance-audit-framework.md        # NEW
│   │   └── 5-pattern-audit-workbook.md          # NEW
│   └── weekly-content/
│       ├── week-03-apr-15-21.md                 # MODIFIED (full rewrite)
│       └── week-04-apr-22-28.md                 # MODIFIED (full rewrite)
└── assets/
    └── cerebro/
        └── lead-magnets/                          # Source PPTX location (existing)

infrastructure/                                    # New directory for the Cloudflare Worker
└── buildmytribe-shortener/
    ├── worker.js                                  # NEW: Cloudflare Worker redirect handler
    ├── redirect-map.json                          # NEW: slug → destination map
    └── DEPLOY.md                                  # NEW: step-by-step Mike deploys it
```

**Structure Decision**: Single-project web application using the existing `projects/website/` layout with Next.js Pages Router and static export. No new project, no new package, no new build tooling. The Cloudflare Worker lives in a new `infrastructure/buildmytribe-shortener/` directory at repo root because it's deployed separately from the website and is logically an infrastructure artifact, not website source code. Lead magnet markdown source files stay in the campaign project folder (`projects/002-stan-store-lawfirm-funnel/content/lead-magnets/`) as the canonical authoring location; PPTX files are deployed to the website's public folder as built artifacts.

## Phase 0: Research (see research.md)

**Unknowns identified**:

1. **buildmytribe.ai hosting / redirect layer** — Where is the domain currently hosted? Which redirect technology (Cloudflare Worker, Cloudflare Page Rules, hosting.com .htaccess, Vercel edge config)? What's DNS currently pointing to?
2. **n8n cerebro-lead workflow behavior** — Does it differentiate `leadMagnet: newsletter-signup` from resource downloads? Does it send welcome emails? Does it add to Brevo list? Is retry/backoff configured for Airtable rate limits?
3. **Existing PPTX file integrity** — Do the 6 files in `projects/002-stan-store-lawfirm-funnel/assets/cerebro/lead-magnets/` open cleanly and render matching the brand?
4. **Brand voice calibration for new magnets** — What are the specific voice markers (sentence length, vocabulary, pacing) of the existing 6 magnets that the new 7 must match?
5. **Playwright E2E coverage of resource pages** — Do existing tests cover form submission, download, newsletter opt-in? If not, what's the minimum smoke test we need?
6. **pptx-generator skill capabilities** — Does it support the dark + gold brand palette out of the box, or do we pass a brand config? What's the input format (markdown, YAML, JSON)?
7. **UTM parameter capture path** — `ResourceGate` reads UTMs from localStorage via `tin_utm_params` key. Where is that key set? (Likely a separate landing hook.) Is it set for buildmytribe.ai → theinnovativenative.com redirect flow?

**Output**: [research.md](./research.md) — resolves every unknown or documents the fallback.

## Phase 1: Design & Contracts (see data-model.md, contracts/, quickstart.md)

### Data Model

See [data-model.md](./data-model.md). Key entities:
- **LeadMagnet** — authoring entity (markdown + PPTX + landing page triple)
- **ResourceLandingPage** — UI entity (TSX page + ResourceGate props)
- **LeadSubmission** — wire format (payload POSTed to n8n webhook)
- **VanityRedirect** — infrastructure entity (slug + destination + Cloudflare Worker route)
- **PostRewrite** — content entity (5-section structure applied to existing post markdown)
- **NavigationEntry** — UI entity (header dropdown / link addition for /resources hub)

### Contracts

- [contracts/lead-form-submission.schema.json](./contracts/lead-form-submission.schema.json) — JSON Schema for the ResourceGate → n8n webhook payload
- [contracts/resource-gate-props.md](./contracts/resource-gate-props.md) — TypeScript prop signature for ResourceGate consumers (stable contract)
- [contracts/vanity-redirect-map.schema.json](./contracts/vanity-redirect-map.schema.json) — JSON Schema for the Cloudflare Worker redirect-map.json
- [contracts/lead-magnet-frontmatter.schema.json](./contracts/lead-magnet-frontmatter.schema.json) — frontmatter fields required on every lead magnet markdown file

### Quickstart

[quickstart.md](./quickstart.md) — developer guide: "If you're dropped into this feature cold, here's how to add a new resource page in under 10 minutes."

### Agent Context Update

Runs `.specify/scripts/bash/update-agent-context.sh claude` after design artifacts are written. This refreshes the agent-facing context file with any new technology decisions (there are none — all reused), keeping the roster honest.

## Complexity Tracking

> No Constitution Check violations. Section left intentionally empty.

## Parallel vs Sequential Work Analysis

Identifying what can run in parallel during implementation to compress the critical path:

### Can parallelize (agent-friendly)

- **7 new lead magnet markdown sources** — each is independent authoring work. 7 parallel drafts.
- **7 new resource landing pages (TSX)** — each is a thin ResourceGate wrapper. 7 parallel creations. Depends only on slug naming (decided in spec).
- **Week 3 post rewrites vs Week 4 post rewrites** — two independent files, two parallel rewrite passes.
- **Research tasks (R1-R7)** — all 7 unknowns can be investigated in parallel (different sources).
- **PPTX copy (6 files) vs PPTX generation (7 files)** — copy step is instant; generation step is the bottleneck. Run concurrently.

### Must be sequential

- **Phase 1 (Unblock)** must complete **before** Phase 6 (Deploy) because the deploy smoke test depends on the newsletter opt-in flow being wired and the PPTX files being in place.
- **Phase 2 (Build magnets)** must complete **before** Phase 3 (Build pages) for a given resource, because the landing page's `downloadUrl` points to the PPTX location. However, magnet 1's page can be built as soon as magnet 1's PPTX exists, independent of magnets 2-7.
- **Phase 3 (Build pages)** must complete **before** Phase 5 (Rewrite posts) because post UPGRADE CTAs reference the vanity URLs, and the vanity URLs reference the landing pages. A post cannot be rewritten to point at a non-existent page.
- **Phase 4 (Short URLs)** must complete **before** Phase 5 (Rewrite posts) for the same reason — posts use vanity URLs.
- **Phase 5 (Rewrite posts)** must complete **before** Phase 6 (Deploy) only in the sense that the post files are content, not code. The deploy is for the website code and PPTX assets. Post files can be rewritten concurrently with the deploy since they're in a separate project folder.
- **ResourceGate modification (newsletter opt-in)** must happen **before** the deploy but can happen **in parallel** with lead magnet authoring.

### Critical path

The critical path is: **Phase 1 ResourceGate modification → Phase 3 last landing page → Phase 4 Cloudflare Worker config → Phase 5 post rewrite finalization → Phase 6 Deploy → Phase 7 Pilot**. The PPTX generation (Phase 2) runs in parallel with the landing page authoring (Phase 3) once the first magnet is ready.

## Phase 2.0 — Pre-batch PPTX Sample Verification

**Added in toughlove review (H-007)**.

Before generating all 7 magnets in batch, generate ONE sample magnet first: `demand-letter-matrix` (the highest-priority Tier 1 deliverable). Invoke `pptx-generator` with `--brand innovative-native`. Mike (or reviewer) visually inspects the generated PPTX for:
- Background consistency (no mixed slide backgrounds)
- Font rendering (Playfair Display for headings, Inter for body)
- Brand color application (cyan accent or gold? — flag if wrong)
- Text overflow on long bullet lines
- Slide layout quality and variety

**Ship criterion for Phase 2.0**: One PPTX that Mike signs off on visually.

**If acceptable**: Proceed to batch-generate the remaining 6 magnets.
**If not acceptable**: Pause. Evaluate fixes:
- Option A: Update the `innovative-native` brand config in `.claude/skills/pptx-generator/brands/innovative-native/brand.json`
- Option B: Write a custom cookbook script for this feature's slide layouts
- Option C: Fallback to manual PPTX authoring from a template (adds ~1 hour per magnet but ships)

Phase 2.0 must complete before Phase 2.1-2.7 (the remaining 6 magnet generations) can begin.

## Phase 4 Fallback — Direct URLs

**Added in toughlove review (H-004)**.

The Cloudflare Worker deployment is a Mike-blocking step (he has DNS/Cloudflare access, we don't). If the Worker is not deployed by T-24 hours before a given day's publishing slot, that day's posts MUST use direct `https://theinnovativenative.com/resources/<full-slug>` URLs as a fallback instead of `buildmytribe.ai/<vanity-slug>`.

**Rules for the fallback path**:
1. The pre-publish linter (Phase 5 implementation task) detects which format each post uses: vanity URL vs direct URL.
2. Posts that use the fallback direct URL are flagged in the linter output but are NOT blocked from publishing.
3. A **post-launch sweep** task (after the Worker is eventually deployed) converts fallback URLs back to vanity URLs. This is a simple string replacement across the week-03 and week-04 files.
4. Tier 1 (Day 15, Day 16) ships with whichever format is available at T-24 hours. Tier 2 and Tier 3 benefit from the Worker being deployed by then.

**This unblocks Tier 1 ship even if Mike is busy with Cloudflare setup.**

## Risk Mitigations (implementation-level)

| Risk | Mitigation |
|------|-----------|
| Brand voice drift in 7 new magnets | Every new magnet is drafted against a calibration sample from an existing magnet (same voice markers documented in research.md §R4). Toughlove review flags voice drift explicitly. |
| ResourceGate modification breaks existing 6 pages | New checkbox is added as an opt-in UI block that renders only in the unlocked state. Existing behavior (form, validation, webhook POST, localStorage) is untouched. All 13 pages use the same component — a regression on one is a regression on all, so smoke testing one existing + one new page catches the class. |
| Cloudflare Worker misconfiguration kills all vanity URLs | Worker deploy is a Mike-executed step (Phase 4) with the worker.js + redirect-map.json as reviewable artifacts. We provide an acceptance script: `curl -I buildmytribe.ai/audit` expects 301 → theinnovativenative.com/resources/5-pattern-audit-workbook. Mike runs it against all 14 slugs before marking Phase 4 complete. |
| Post rewrites take longer than expected, missing Apr 15 | **Phased delivery per spec.md**: Tier 1 (Apr 15) includes only Days 15-16 with minimal magnets. Tiers 2-3 ship rolling. Day 15 reuses existing `5-ai-tools-pi` and needs no new magnet. |
| PPTX files don't render correctly in pptx-generator output | **Phase 2.0 sample verification** — one magnet generated first, visually QA'd, before batch generation. If unacceptable, fallback to manual PPTX authoring. |
| n8n workflow silently drops newsletter opt-in submissions | Phase 1's read-only investigation documents current behavior. If the workflow doesn't handle the tag, we log a follow-up task for Mike to extend the workflow, but the feature still ships — the newsletter opt-in creates an Airtable record regardless, and Mike can process that batch manually if needed. |
| Uncommitted work on 034-community-feed-ux taints 036 commits | Implementation uses explicit `git add <file>` (not `git add .`). Every commit is reviewed before push. If dirty 034 files sneak in, the commit is amended or reverted. |
| **Cloudflare Worker open-redirect vulnerability** | Worker MUST implement strict whitelist-only slug lookup (FR-032). Unknown slugs return HTTP 404, not a default destination. Destinations are hardcoded in the static `redirect-map.json` — never constructed from request data. Acceptance test: `curl -I buildmytribe.ai/nonexistent-slug-xyz123` expects 404. |
| **Bot attack on lead capture form** | Honeypot field + time-based check (FR-052, FR-053). Silent-drop suspicious submissions, log counter for monitoring. No legitimate user impact. |
| **Voice drift across 126-post rewrite** | Rewrites happen in calendar order, one day at a time (not batched). After every 3 days rewritten, sample one random post and compare against calibration markers. Fix drift before continuing. |
| **rsync --delete destroys unexpected server files** | FR-057: Before deploy, list server files and cross-check against local `out/`. Flag any files that would be destroyed. Confirm before proceeding. |
| **Airtable schema drops fields silently** | Phase 1 investigation reads Airtable Leads schema AND n8n workflow field mapping. Any dropped fields logged in `qa/SUMMARY.md` as Mike follow-up. |

## Success Gate

Plan is considered complete when:
- [x] Constitution gates all pass
- [ ] research.md resolves all 7 unknowns or documents acceptable fallbacks
- [ ] data-model.md enumerates all 6 entities with fields and relationships
- [ ] All 4 contract files exist and validate
- [ ] quickstart.md gives a 10-minute onboarding path
- [ ] Agent context file updated via update-agent-context.sh
- [ ] Post-design re-check of Constitution (no new violations introduced by design artifacts)

**Next**: `/toughlove` pre-implementation review, then `/speckit.tasks`.
