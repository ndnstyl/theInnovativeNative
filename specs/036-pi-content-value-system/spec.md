---
owner: Mike (CEO, P1)
project_lead: Mike (CEO)
parent_project: rec1NqwMMWvv2PpVD  # theinnovativenative
owned_paths:
  - projects/website/src/pages/resources/*.tsx
  - projects/website/src/components/containers/resources/*.tsx
  - projects/website/public/assets/lead-magnets/*
  - projects/002-stan-store-lawfirm-funnel/content/lead-magnets/*.md
  - projects/002-stan-store-lawfirm-funnel/content/weekly-content/week-03-apr-15-21.md
  - projects/002-stan-store-lawfirm-funnel/content/weekly-content/week-04-apr-22-28.md
  - specs/036-pi-content-value-system/*
status: draft
priority: P1
depends_on: [020-branded-url-shortener]
---

# Feature Specification: PI Law Firm Content Engine v2 — Value-First Lead System

**Feature Branch**: `036-pi-content-value-system`
**Created**: 2026-04-09
**Status**: Draft
**Input**: User description: "Transform weeks 3-4 of the PI/mass tort content calendar from pain-point-only posts into value-first posts with in-body solutions, build 7 new lead magnet deliverables to fill content gaps, fix the broken PPTX deployment for 6 existing resources, repair 27 broken buildmytribe.ai links, wire newsletter opt-in into the resource download success flow, and stand up buildmytribe.ai as a branded short-URL domain for the lawyer funnel."

---

## Background & Motivation

Mike is running a 28-day content campaign targeting Personal Injury and Mass Tort law firm owners. Weeks 1 and 2 (Apr 1-14) are already voiced and shipping. Weeks 3 and 4 (Apr 15-28) are drafted but have a critical structural problem: every post agitates a pain point and names a tool, but never teaches the reader anything actionable inside the post itself. The reader closes the app no smarter than when they opened it. At the same time, the delivery system behind those posts is broken in six distinct ways: PPTX files exist on disk but were never deployed to the website's public folder, 27 Facebook "Link Share" posts point to a defunct domain, post copy references resource slugs that have no matching landing page, 7 promised deliverables don't exist, the newsletter signup isn't wired into the gated download success flow, and an old brand domain (buildmytribe.ai) sits stranded when it could be a memorable short-URL front door.

This feature fixes all of it in one coordinated effort before week 3 publishing begins.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — PI Lawyer Learns Something From a Post Without Clicking (Priority: P1)

A managing partner at a 12-attorney PI firm scrolls LinkedIn on a Tuesday morning. She stops on a post about demand letter bottlenecks. The hook cites "5-15 hours per demand letter." She keeps reading. The post gives her three specific steps she can take this afternoon — email her paralegal to start timing their current process, pull the last 10 demand letters to get a baseline, and book 30 minutes on Friday to review two named AI tools. She takes a screenshot for her office manager. She may or may not click the upgrade link at the bottom. Either way, she walked away with a plan.

**Why this priority**: This is the core problem Mike identified. Every downstream metric (engagement, conversions, trust) depends on the post body delivering value before any click happens. If posts continue to hook without teaching, the rest of the system — lead magnets, capture flow, newsletter — never gets a chance to work because readers bounce before interacting.

**Independent Test**: Publish a single rewritten post (Day 16, demand letters) on LinkedIn and measure dwell time, saves, and comments. The rewritten post can be judged purely on whether the PLAY section is present and actionable, independent of whether any other system component is complete.

**Acceptance Scenarios**:

1. **Given** a published post in the new format, **When** a reader finishes reading without clicking any link, **Then** they can name at least one specific action they could take today based on the post body alone.
2. **Given** a LinkedIn text post in the new format, **When** measured, **Then** the body contains five distinct sections (Hook, Why, Play, Proof, Upgrade) and falls between 250 and 350 words.
3. **Given** a carousel post in the new format, **When** reviewed, **Then** it contains 7-8 slides including at least 2 dedicated to the PLAY (the actions the reader can take).

---

### User Story 2 — PI Lawyer Downloads a Resource and Joins the Newsletter in One Flow (Priority: P1)

A PI attorney clicks a short URL in a Facebook post (buildmytribe.ai/demand). The URL redirects instantly to a landing page on theinnovativenative.com. The page hero explains what the deliverable is and who it's for. He fills in his first name and email (firm name and practice area are optional). He clicks "Get Free Access." Within one second, the success state appears, showing a prominent "Download Now" button that delivers a real PPTX file. Below the download button, a single checkbox invites him to subscribe to the "Legal AI Briefing" newsletter. He checks it and closes the tab. Two Airtable records exist: one for the resource download, one for the newsletter opt-in, both tagged with the correct source post via UTM.

**Why this priority**: This is the lead capture engine. Without it working end-to-end, every post and every deliverable is wasted effort. This must be fully functional before any post publishes.

**Independent Test**: On the live domain, fill the form on one resource page with a test email. Verify (a) the Airtable record is created with the correct `leadMagnet` tag, (b) the PPTX download works and opens in PowerPoint/Keynote, (c) checking the newsletter box creates a second Airtable record tagged `newsletter-signup`, and (d) the UTM parameters from the source URL are preserved.

**Acceptance Scenarios**:

1. **Given** a valid submission on a resource landing page, **When** the form is submitted, **Then** an Airtable Leads record is created within 3 seconds with all form fields and UTM parameters.
2. **Given** a successful form submission, **When** the success state renders, **Then** a Download button is visible that initiates download of a non-empty PPTX file when clicked.
3. **Given** the success state is visible, **When** the user checks the newsletter opt-in box, **Then** a second Airtable record is created with `leadMagnet: newsletter-signup` and the same email.
4. **Given** a returning visitor who previously downloaded the same resource, **When** they revisit the landing page, **Then** the form is skipped and the download button is shown immediately (localStorage remembers the unlock).
5. **Given** a form submission failure (network error, webhook down), **When** the user sees the result, **Then** a clear error message is displayed, the form state is preserved, and a retry is possible without losing input.

---

### User Story 3 — Every Post Has a Working Upgrade CTA (Priority: P1)

A reader finishes any post in weeks 3 or 4 and wants to grab the deliverable referenced in the upgrade line. They tap the vanity URL (e.g., `buildmytribe.ai/audit`). The URL resolves to the correct resource landing page on theinnovativenative.com. No 404. No "coming soon" page. No dead link. Regardless of which post they saw, which platform, or which day of the week, the upgrade path works.

**Why this priority**: Broken links destroy trust instantly and permanently. A reader who clicks a broken link does not click a second time. This must be 100% reliable before any post publishes.

**Independent Test**: Run an automated link checker against every URL referenced in weeks 3 and 4 of the content calendar. Zero 404s, zero redirects to wrong destinations, zero placeholder pages. Also confirm every vanity URL on buildmytribe.ai resolves to a live theinnovativenative.com page.

**Acceptance Scenarios**:

1. **Given** every "Link Share" post in weeks 3 and 4, **When** the referenced URL is visited, **Then** it resolves to a working resource landing page (no 404, no redirect loop).
2. **Given** every post body upgrade CTA in weeks 3 and 4, **When** the referenced URL is visited, **Then** it resolves to a matching resource landing page for the topic of the post.
3. **Given** every vanity short URL (buildmytribe.ai/<slug>), **When** visited, **Then** it redirects (301 or 302) to a valid theinnovativenative.com/resources/<slug> page.
4. **Given** the root of buildmytribe.ai, **When** visited, **Then** it redirects to theinnovativenative.com/resources (the hub index page).

---

### User Story 4 — The 7 Missing Lead Magnets Exist as Real Downloads (Priority: P2)

Mike asks a week 3 post to link to a "Demand Letter Tool Comparison Matrix." A reader clicks. A real, useful document downloads. Not a placeholder. Not a coming-soon page. A full deliverable with a cover slide, a comparison matrix, an ROI calculator, tool links, and an action list.

**Why this priority**: Without the missing 7 deliverables, half of weeks 3 and 4 has nothing to offer readers who click through. This is blocking content but is independent of post rewriting — the work can proceed in parallel.

**Independent Test**: For each of the 7 new magnets, verify three artifacts exist: (1) source markdown at `projects/002-stan-store-lawfirm-funnel/content/lead-magnets/<slug>.md`, (2) PPTX file at `projects/website/public/assets/lead-magnets/<slug>.pptx`, (3) landing page at `projects/website/src/pages/resources/<slug>.tsx`. All three render, match in voice/brand, and form a complete user journey.

**Acceptance Scenarios**:

1. **Given** a week 3 post day (e.g., Day 16), **When** the reader clicks its upgrade CTA, **Then** they reach a resource page for that day's topic (demand letters → demand letter matrix).
2. **Given** each of the 7 new magnets, **When** downloaded, **Then** the PPTX opens and contains at minimum: title slide, context slide(s), one specific framework or matrix, one ROI/value calculator or checklist, and an action step.
3. **Given** all 13 resource pages (6 existing + 7 new), **When** the /resources hub page is visited, **Then** all 13 are listed with title, one-line description, and working link.

---

### User Story 5 — Mike Can Ship the Whole System Without Manual Firefighting (Priority: P2)

Mike runs `npm run build`, sees zero TypeScript errors, runs the rsync deploy command, and verifies one resource page end-to-end on the live domain. He picks Day 16 to hand-publish as a pilot. Within 24 hours, the system captures at least one test lead in Airtable. He does not have to debug broken paths, missing files, or unconfigured redirects mid-campaign.

**Why this priority**: Reliability of the shipped system is the second-order metric. If it works the first time, Mike can focus on metrics and iteration. If it breaks, all cycles go to firefighting.

**Independent Test**: Full end-to-end smoke test on live domain — one page per resource type, one form submission, one download, one newsletter opt-in, one vanity URL redirect. Zero manual interventions.

**Acceptance Scenarios**:

1. **Given** a clean build of the website, **When** deployed, **Then** all 13 resource pages are accessible at their expected URLs.
2. **Given** the deployed system, **When** the day 16 pilot post is published across LinkedIn, Facebook, and Instagram, **Then** zero broken links are reported within 24 hours.
3. **Given** the n8n cerebro-lead workflow, **When** a form submission arrives from a resource page, **Then** it is routed correctly (documented behavior verified) before any post publishes.

---

### User Story 6 — Returning Readers Opt Into the Newsletter for Recurring Value (Priority: P3)

A reader who has downloaded 2-3 resources over a week realizes they want the recurring "Legal AI Briefing" email. They either check the newsletter box at their next download OR visit /newsletter directly. Their email is captured once; Mike's Brevo/Airtable pipeline handles deduplication. They receive a confirmation and the first issue.

**Why this priority**: Newsletter is the durable, recurring asset. One-time downloads are transactional. The real compounding value comes from a growing newsletter list.

**Independent Test**: Submit the newsletter signup form twice with the same email. Verify no duplicate records and that the user is flagged as a newsletter subscriber in Airtable.

**Acceptance Scenarios**:

1. **Given** the resource download success state, **When** the reader checks the newsletter opt-in, **Then** an Airtable record is created with `leadMagnet: newsletter-signup`.
2. **Given** a new direct visit to /newsletter, **When** the form is submitted, **Then** the same webhook receives the payload and tags it appropriately.
3. **Given** a returning subscriber who submits the newsletter form again, **When** the record is processed, **Then** no duplicate is created (dedupe by email is handled downstream).

---

### Edge Cases

- **Webhook down during form submit**: Show clear error, preserve all form input, allow retry. Never silently lose a lead.
- **PPTX file missing at download time**: The ResourceGate success screen must verify the file exists or show a clear "we hit an issue — email hello@... for the file" fallback. Never serve a 404 after a successful form submit.
- **Reader already unlocked a resource**: Skip the form entirely and show the download button immediately (current `ResourceGate` behavior via localStorage).
- **Reader submits with same email twice**: Form should succeed; downstream Airtable/Brevo handles dedupe. Do not block legitimate re-downloads.
- **Vanity URL visited before DNS propagates**: The shortener service must be idempotent — if not configured, a clear "This link is being set up" page, never a blank or random page.
- **Post published referencing a resource that doesn't exist yet**: Pre-publish validation must flag this. Content pipeline MUST NOT publish if any referenced slug has no matching landing page.
- **Form submitted with missing UTM parameters**: Still capture the lead, tag it `utm_missing: true` in Airtable for attribution debugging. Never reject on missing UTMs.
- **Newsletter opt-in checkbox checked but second POST fails**: The primary download is not affected. Retry the opt-in POST once. If it still fails, log a warning and continue — the download is the priority contract.
- **Reader uses browser extensions that block localStorage**: The form should still work on second visit (they'll just fill the form twice). Do not block on localStorage being available.
- **LinkedIn post exceeds 350 words after rewrite**: Trim the WHY or PROOF section, never the PLAY. The PLAY is the load-bearing value.
- **Stale localStorage unlock from an earlier redeploy**: Old unlocks remain valid. Do not version-gate localStorage keys.
- **Reader on mobile with slow connection**: Form state, validation, and success state must work without layout jank. Download button must be finger-sized.
- **PPTX file opens but is corrupt**: Out of scope for the system — Mike QAs PPTX files manually before Phase 2 sign-off.
- **Reader clicks download before JavaScript loads**: Not applicable — the download button only appears in the unlocked success state which is JS-rendered.
- **Airtable base rate limit hit during launch spike**: n8n workflow must implement retry with exponential backoff. User tests this before deploy.

---

## Requirements *(mandatory)*

### Functional Requirements

**Post Content Structure (weeks 3 & 4 rewrite)**

- **FR-001**: Every post in weeks 3 and 4 across LinkedIn, Facebook, and Instagram MUST follow the 5-section structure: Hook, Why, Play, Proof, Upgrade. The structure applies to the post BODY only. Existing hashtags, First Comment blocks, and platform-specific metadata remain unchanged unless explicitly broken (e.g., a First Comment containing a dead URL).
- **FR-002**: Every post's Play section MUST contain 3-5 specific, actionable steps the reader can take without clicking any link.
- **FR-003**: LinkedIn text posts (Post 1 variant) MUST be 250-350 words in body length.
- **FR-004**: LinkedIn carousels MUST contain 7-8 slides, with at least 2 slides dedicated to the Play.
- **FR-005**: Every Upgrade CTA MUST point to either (a) a buildmytribe.ai vanity short URL if the Cloudflare Worker is deployed and verified working, or (b) a direct `theinnovativenative.com/resources/<slug>` URL as a fallback. The vanity URL is the preferred form; the direct URL is the escape hatch if the Worker deployment is delayed. A post-launch sweep converts direct URLs to vanity URLs once the Worker is live.
- **FR-006**: Weeks 3 and 4 post files MUST be overwritten in place (`projects/002-stan-store-lawfirm-funnel/content/weekly-content/week-03-apr-15-21.md` and `week-04-apr-22-28.md`).
- **FR-007**: The voice and brand tone of rewritten posts MUST match weeks 1 and 2 (already voiced): direct, practical, no-fluff, "systems that survive contact with reality."
- **FR-008**: No post may reference a resource slug that does not resolve to a working landing page (pre-publish validation required).

**Lead Magnet Deliverables**

- **FR-009**: System MUST produce 7 new lead magnets as markdown source files at `projects/002-stan-store-lawfirm-funnel/content/lead-magnets/<slug>.md` matching the structure of existing 6.
- **FR-010**: Each new lead magnet MUST have a corresponding PPTX file generated via the pptx-generator skill.
- **FR-011**: Each new lead magnet MUST match brand voice, design, and length expectations of existing 6 (4-8 pages/slides, dark + gold #d4a853 styling).
- **FR-012**: The 7 new lead magnet slugs MUST be: `demand-letter-matrix`, `rag-vs-wrapper-checklist`, `5-pi-automations-guide`, `cms-dashboard-guide`, `discovery-ai-overview`, `governance-audit-framework`, `5-pattern-audit-workbook`.

**Resource Landing Pages**

- **FR-013**: System MUST produce 7 new resource landing pages at `projects/website/src/pages/resources/<slug>.tsx`, each reusing the existing `ResourceGate` component without forking.
- **FR-014**: System MUST produce one `/resources` hub index page listing all 13 resources (6 existing + 7 new).
- **FR-015**: Every resource landing page MUST include SEO meta tags (title, description, og:title, og:description, og:url, og:type, canonical).
- **FR-016**: Every resource landing page MUST display at least 4 value bullets describing what the reader gets, matching the style of existing pages.
- **FR-017**: Header navigation MUST include a Resources link (dropdown or single link) pointing to the /resources hub.

**PPTX Deployment Fix**

- **FR-018**: The 6 existing PPTX files MUST be copied from `projects/002-stan-store-lawfirm-funnel/assets/cerebro/lead-magnets/` to `projects/website/public/assets/lead-magnets/` so the static export picks them up.
- **FR-019**: The 7 new PPTX files MUST be saved to `projects/website/public/assets/lead-magnets/` directly (not only in the project folder).
- **FR-020**: After deployment, every resource page's `downloadUrl` MUST resolve to a live PPTX file (200 OK, non-zero size).

**Lead Capture Flow**

- **FR-021**: Resource download forms MUST require `firstName` and `email`. `firmName` and `practiceArea` remain optional.
- **FR-022**: Valid form submissions MUST POST to `NEXT_PUBLIC_LEAD_WEBHOOK_URL` with the documented payload (firstName, email, firmName, practiceArea, leadMagnet, source, UTM params, timestamp).
- **FR-023**: The `NEXT_PUBLIC_LEAD_WEBHOOK_URL` environment variable MUST be verified set in production before deploy.
- **FR-024**: After successful form submission, the success state MUST render a prominent Download button linking to the correct PPTX file.
- **FR-025**: After successful download, the success state MUST display an optional newsletter opt-in checkbox, unchecked by default.
- **FR-026**: When the newsletter opt-in checkbox is checked, the system MUST POST a second payload to the same webhook with `leadMagnet: newsletter-signup` and the same email.
- **FR-027**: The `ResourceGate` component MUST persist the unlock state in localStorage so returning visitors skip the form.
- **FR-028**: The `ResourceGate` component MUST capture UTM parameters from localStorage (set on first landing) and include them in the submission payload.

**n8n Workflow Verification**

- **FR-029**: Before deploy, the n8n cerebro-lead workflow MUST be inspected to determine whether it differentiates `newsletter-signup` submissions from resource downloads.
- **FR-030**: If the n8n workflow does not currently handle `newsletter-signup` distinctly (welcome email, Brevo list add, etc.), this MUST be documented in the feature qa/ folder as a follow-up task, but MUST NOT block Phase 1 deploy.
- **FR-031**: Any n8n workflow changes MUST be tested manually by Mike per the n8n rules (user is the only one who tests n8n workflows).

**Branded Short URLs (buildmytribe.ai)**

- **FR-032**: The domain buildmytribe.ai MUST be configured to host a redirect layer (Cloudflare Worker recommended, per research.md R1) implementing **strict whitelist-only slug lookup**. Unknown slugs MUST return HTTP 404, not a redirect, not a fallback destination, not a pass-through. Destinations MUST be sourced from a static, version-controlled map at `infrastructure/buildmytribe-shortener/redirect-map.json`. The Worker MUST NOT accept any user-supplied URL as a destination under any circumstance (open redirect prevention).
- **FR-033**: The root domain `buildmytribe.ai/` MUST 301 redirect to `https://theinnovativenative.com/resources`.
- **FR-034**: Each resource MUST have a short, memorable vanity slug mapped 1:1 to its full resource URL. Minimum slug set:
  - `/math` → `/resources/442-intake-math`
  - `/tools` → `/resources/5-ai-tools-pi`
  - `/policy` → `/resources/ai-governance-template-pi`
  - `/heppner` → `/resources/heppner-one-pager`
  - `/risk` → `/resources/ai-tool-risk-chart`
  - `/colossus` → `/resources/insurance-ai-colossus`
  - `/demand` → `/resources/demand-letter-matrix`
  - `/wrapper` → `/resources/rag-vs-wrapper-checklist`
  - `/automate` → `/resources/5-pi-automations-guide`
  - `/cms` → `/resources/cms-dashboard-guide`
  - `/discovery` → `/resources/discovery-ai-overview`
  - `/cost` → `/resources/governance-audit-framework`
  - `/audit` → `/resources/5-pattern-audit-workbook`
- **FR-035**: The slug-to-resource mapping MUST be documented in a canonical location (spec file + implementation artifact) to prevent drift.

**Content/Link Remediation**

- **FR-036**: All 27 references to `buildmytribe.ai/resources/...` in weeks 3 and 4 post files MUST be replaced with vanity short URLs from FR-034.
- **FR-037**: Any remaining "link in bio" or vague CTA language MUST be replaced with a specific, functional URL.
- **FR-038**: Post files MUST NOT contain any reference to a non-existent URL, slug, or page after rewrite.

**Deployment**

- **FR-039**: System MUST build without TypeScript errors (`npm run build` clean).
- **FR-040**: System MUST deploy to A2 Hosting via the existing rsync workflow documented in `projects/website/CLAUDE.md`.
- **FR-041**: After deploy, the directory index fix script MUST be run (per deployment rules).
- **FR-042**: After deploy, at least one end-to-end smoke test MUST be performed on the live domain (one resource page: form → Airtable → download → newsletter opt-in).

**Accessibility & Mobile (WCAG 2.1 AA)**

- **FR-043**: All form inputs MUST use appropriate HTML5 input types (`type="email"` for email, `type="text"` for names). Existing ResourceGate component already complies; new pages MUST NOT regress this.
- **FR-044**: All interactive elements (buttons, checkboxes, links, form fields) MUST have a minimum touch target of 44×44 CSS pixels on mobile viewports.
- **FR-045**: Every new resource landing page MUST declare a mobile viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`.
- **FR-046**: Form error messages MUST be displayed without requiring the user to scroll on a 375px-wide mobile screen (the iPhone SE baseline).
- **FR-047**: Mobile PPTX download copy MUST set reader expectation (e.g., "Download the PowerPoint file to your device"); iOS Files app and Android direct download are both acceptable behaviors.
- **FR-048**: New resource landing pages and the `/resources` hub page MUST meet WCAG 2.1 AA: color contrast ≥4.5:1 for normal text, ≥3:1 for large text, full keyboard navigation support, and screen-reader-accessible labels on all interactive elements.
- **FR-049**: The newsletter opt-in checkbox MUST have a visible `<label>` element, keyboard activation via Space key, and an accessible name readable by screen readers (via the `<label>` association, not just `aria-label`).
- **FR-050**: Form field errors MUST be associated with their input via `aria-describedby` and announced via an `aria-live="polite"` region so screen readers pick up validation failures.
- **FR-051**: After successful form submission and the unlock transition, keyboard focus MUST move to the Download button so keyboard users can immediately proceed.

**Security Hardening**

- **FR-052**: The resource form MUST include a honeypot field (hidden from users, populated by bots). Submissions with a non-empty honeypot MUST be silently dropped (return 200 to the bot but do NOT POST to the webhook).
- **FR-053**: The resource form MUST track the time between page load and form submit. Submissions made in <2 seconds after page load MUST be silently dropped.
- **FR-054**: Silent-dropped submissions MUST be logged to a local counter (for monitoring if attacks occur) but MUST NOT create Airtable records and MUST NOT surface errors to legitimate users.

**Content Quality Guardrails**

- **FR-055**: Post rewrites MUST NOT contain any of the following AI-tell phrases (case-insensitive match): "here's the thing", "in today's world", "in the ever-evolving", "game-changer", "unlock" (when used metaphorically), "elevate" (metaphorical), "leverage" (as a verb), "holistic approach", "navigate the landscape", "it's no secret", "at the end of the day", "truth be told", "needless to say", "last but not least", "dive in", "dive into", "in this digital age".
- **FR-056**: Post rewrites MUST use the specific voice markers documented in research.md R4: sentence length 8-18 words average, occasional 3-5 word punches, imperative voice in the PLAY section, specific sourced numbers with attribution, operator vocabulary ("bottleneck," "math problem," "fix," "play"), and second-person pronouns ("you," "your firm").

**Deploy Safety**

- **FR-057**: Before running the rsync deploy command (which uses `--delete`), the deployer MUST verify the server's existing file list against the local `out/` build output. Any files present on the server but absent from the build MUST be flagged. Deploy only proceeds after confirmation that no unexpected files will be destroyed. This prevents accidental loss of manual uploads or one-off server-side fixes.

### Key Entities

- **Post**: A content unit published to LinkedIn, Facebook, or Instagram. Contains sections Hook, Why, Play, Proof, Upgrade. Has a word count range, a platform, a day, a format (text/carousel/video/image/reel), and a mapped lead magnet slug. Generated from Mike's source markdown files.

- **Lead Magnet**: A downloadable asset (typically PPTX). Has a slug, a title, a source markdown file, a deployed PPTX file, a resource landing page, a vanity short URL. Matches brand voice and style. Covers a specific topic addressed by one or more posts.

- **Resource Landing Page**: A single static HTML page at `/resources/<slug>` that renders the `ResourceGate` component. Has bullets, a `leadMagnetId`, and a `downloadUrl`. Displays the form until unlocked, then the download + newsletter opt-in.

- **Lead**: An Airtable record created from a form submission. Fields: firstName, email, firmName (optional), practiceArea (optional), leadMagnet (source slug or `newsletter-signup`), source (page identifier), UTM parameters (if present), timestamp.

- **Newsletter Subscriber**: A Lead entity with `leadMagnet: newsletter-signup`. May also have other Lead records with the same email (same person downloaded resources). Downstream dedupe is handled by the n8n workflow / Brevo integration.

- **Vanity Short URL**: A short, memorable path on buildmytribe.ai (e.g., `/audit`) that 301-redirects to a full resource URL on theinnovativenative.com. Used in every post upgrade CTA.

- **Airtable Base**: `appTO7OCRB2XbAlak`. Leads are stored in a Leads table. Project `rec1NqwMMWvv2PpVD` (theinnovativenative) is the owning project for this feature's leads.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: **Every post in weeks 3 and 4 (all 126 posts) contains a Play section with 3-5 specific actions** that can be verified by a reader who never leaves the post.
- **SC-002**: **Zero broken links** in weeks 3 and 4. Every URL referenced in the post files resolves to a live page with a 200 OK status.
- **SC-003**: **PI lawyers can go from post to resource download in under 60 seconds**, measured by: tap short URL → redirect → landing page loads → form submit → download starts.
- **SC-004**: **Every valid form submission creates exactly one Airtable Leads record** with the correct `leadMagnet` tag and captured UTM parameters.
- **SC-005**: **Newsletter opt-in creates a separate tagged record** when the checkbox is selected, verifiable in Airtable.
- **SC-006**: **All 13 resource pages (6 existing + 7 new) return a real, non-empty PPTX file** on download.
- **SC-007**: **All 27 previously-broken buildmytribe.ai/resources/... links are replaced** with working vanity short URLs.
- **SC-008**: **All 7 new lead magnets exist in 3 forms**: markdown source, deployed PPTX, live landing page. Verified by file existence + HTTP HEAD check.
- **SC-009**: **The `/resources` hub index page renders** and lists all 13 resources with working links.
- **SC-010**: **Day 16 pilot post publishes successfully** across all 3 platforms with at least one captured test lead in Airtable within 24 hours.
- **SC-011**: **Toughlove review grades the shipped system A- or better** (per speckit-fullloop exit criteria).
- **SC-012**: **Deploy cycle completes green**: `npm run build` passes, rsync deploy succeeds, Playwright E2E tests pass, directory index fix runs.
- **SC-013**: **n8n cerebro-lead workflow behavior is documented** in the feature qa/ folder before deploy, covering: does it differentiate newsletter signups? Does it send welcome emails? Does it add to Brevo?
- **SC-014**: **Weeks 3 and 4 rewrite completes before April 15** (publishing deadline for Day 15).
- **SC-015**: **Form submission failures are recoverable** — a network error does not lose the user's input, and retry works without a page reload.

---

## Assumptions

- The n8n cerebro-lead webhook endpoint remains stable and accepts the documented payload shape throughout this work.
- The `NEXT_PUBLIC_LEAD_WEBHOOK_URL` environment variable, once set in production, will not rotate during the campaign.
- Mike can access DNS/Cloudflare configuration for buildmytribe.ai to set up the short-URL redirect layer.
- The Airtable Leads table accepts arbitrary string values in the `leadMagnet` field without schema changes required.
- The existing `ResourceGate` component is stable enough that adding a newsletter opt-in checkbox is a localized change (no refactor required).
- The A2 Hosting rsync deployment pipeline is operational per the instructions in `projects/website/CLAUDE.md`.
- The existing PPTX files in `projects/002-stan-store-lawfirm-funnel/assets/cerebro/lead-magnets/` are up to date and production-quality (no regeneration required).
- The pptx-generator skill is functional and can produce PPTX files matching the existing 6 magnets in style and layout.
- Static export (`output: 'export'`) is the only supported rendering mode — no server-side features required.
- Mike will manually test all n8n workflow changes per the hard rule "user is the only one who tests n8n workflows."
- Brevo integration (if any) is already configured and does not need to be built as part of this feature.
- The `/newsletter` page at theinnovativenative.com/newsletter remains the canonical standalone newsletter signup page.
- Newsletter opt-in is GDPR-friendly by default: checkbox unchecked, explicit opt-in only, with visible "No spam. Unsubscribe anytime." microcopy.
- The brand voice in rewritten posts and new lead magnets matches the voice in existing 6 magnets and weeks 1-2 posts (direct, practical, operator tone).
- All new UI copy uses the dark + gold (#d4a853) palette consistent with existing pages.
- Day 20 "Discovery-Phase AI Tools 1-Pager" is gated like the rest despite being short; consistency trumps friction minimization.
- ManyChat DM-triggered delivery (Path C in the capture flow) is deferred to a later feature and does not need to be implemented here.

---

## Out of Scope

- **ManyChat DM automation**: Noted in the brief but explicitly deferred. Will be a separate feature with its own spec.
- **Brevo workflow tuning**: Any new Brevo sequences, segmentation, or list management. This feature assumes existing Brevo config is sufficient.
- **Image generation for new resource page heroes**: New resource pages reuse existing hero imagery or use the dark gradient fallback.
- **Editing weeks 1 and 2 posts**: Already voiced and shipping. Left as-is per Mike's explicit instruction.
- **Repointing buildmytribe.ai away from its current state**: Only the redirect/short-URL layer is added; no full-site replacement or parking page change beyond the 301.
- **New Airtable schema changes**: Leads table accepts existing fields without modification.
- **Playwright E2E test creation beyond existing suite**: Deploy step runs existing tests; no new test authoring required as part of this spec (though implementation phase may add smoke tests where critical).
- **Rebuilding the existing 6 resource pages**: They already work; only the PPTX deployment fix is in scope for them.
- **Content production for weeks 5+**: This feature stops at Apr 28. Future weeks are separate scope.
- **SEO optimization beyond basic meta tags**: No structured data, no schema.org, no canonical audit of other pages.
- **Custom domain email for buildmytribe.ai**: Only web redirects; no email routing.

---

## Dependencies

- **n8n cerebro-lead workflow**: Must be operational. Status verification is a Phase 1 task.
- **Airtable Leads table**: Must accept submissions. Verified via one live test submission in Phase 1.
- **Existing `ResourceGate` component**: Must remain stable throughout Phase 2/3.
- **Existing `pptx-generator` skill**: Required for generating new PPTX files.
- **A2 Hosting SSH deploy pipeline**: Required for Phase 6 deployment.
- **Cloudflare / DNS access for buildmytribe.ai**: Required for Phase 4 short-URL setup.
- **Environment variable `NEXT_PUBLIC_LEAD_WEBHOOK_URL`**: Must be set in production environment.
- **Constitution at `.specify/memory/constitution.md`**: Governs all implementation decisions.
- **Existing spec 020-branded-url-shortener**: Provides foundation and patterns for the buildmytribe.ai work in Phase 4.

---

## Implementation Phases (informational — binding details in plan.md)

1. **Phase 1 — Unblock existing system** (small, mechanical, do first): Copy 6 PPTX files, verify env var, test one resource page end-to-end, investigate n8n cerebro-lead workflow behavior, add newsletter opt-in checkbox to ResourceGate success state.
2. **Phase 2 — Build 7 new lead magnets**: markdown source → PPTX via pptx-generator skill (Phase 2.0 sample verification first).
3. **Phase 3 — Build 7 new resource landing pages + /resources hub index**: reuse ResourceGate component.
4. **Phase 4 — buildmytribe.ai short-URL system**: DNS, redirect map, slug-to-resource doc. Fallback: direct URLs if Worker deployment is delayed (FR-005).
5. **Phase 5 — Rewrite weeks 3 & 4 posts**: Apply 5-section structure to all 126 posts rolling in calendar order (not batched), fix all 27 broken links.
6. **Phase 6 — Deploy + verify**: Build, rsync, test live.
7. **Phase 7 — Pilot test on Day 16**: Hand-publish, watch metrics 24h.

---

## Phased Delivery (resolves C-001 timeline realism)

The full scope cannot ship by April 15. Work is tiered by publishing deadline. Each tier has an explicit ship criterion.

### Tier 1 — MUST SHIP BY APRIL 15 (MVP)

**Deadline**: April 15, 2026 (Day 15 publishing slot)

**Includes**:
- Phase 1 (Unblock): 6 PPTX files copied, newsletter opt-in checkbox added to ResourceGate, env var verified, smoke test passing on one existing resource page.
- Day 15 post rewrite (reuses existing `5-ai-tools-pi` resource — NO new magnet needed).
- Day 16 post rewrite (pilot) + 1 new magnet (`demand-letter-matrix`) + 1 new landing page + vanity slug `/demand`.
- Cloudflare Worker deployed with minimum slug set: 6 existing + `/demand`. Fallback to direct URLs if Worker deploy is delayed.
- `/resources` hub index page (listing existing 6 + demand-letter-matrix).
- Smoke test on live domain (1 form submission → Airtable → download → newsletter opt-in).
- Security hardening per FR-052-054 (honeypot + time check).
- Accessibility per FR-043-051 (all new surfaces).

**Ship criterion**: Day 15 and Day 16 can publish with working CTAs, working downloads, working lead capture.

### Tier 2 — ROLLING DURING WEEK 3 (April 15-21)

**Deadline**: Each day's content ships the day before its publishing slot.

**Includes**:
- Day 17 (Apr 17) rewrite + `rag-vs-wrapper-checklist` magnet + landing page + vanity slug `/wrapper`
- Day 18 (Apr 18) rewrite + `5-pi-automations-guide` magnet + landing page + vanity slug `/automate`
- Day 19 (Apr 19) rewrite + `cms-dashboard-guide` magnet + landing page + vanity slug `/cms`
- Day 20 (Apr 20) rewrite + `discovery-ai-overview` magnet + landing page + vanity slug `/discovery`
- Day 21 (Apr 21) rewrite (Week 3 digest — no new magnet; points to multiple existing resources)

**Ship criterion**: Each day's posts have working CTAs at least 24 hours before the publishing slot.

### Tier 3 — SHIP BEFORE WEEK 4 (by April 21)

**Deadline**: April 21 (so Week 4 content is ready before Day 22 publishing on April 22)

**Includes**:
- Days 22-28 rewrites (7 days × 9 posts = 63 posts) in calendar order, one day at a time
- `governance-audit-framework` magnet + landing page + vanity slug `/cost`
- `5-pattern-audit-workbook` magnet + landing page + vanity slug `/audit`
- Post-launch sweep: convert any fallback direct URLs to vanity URLs (if Worker was deployed after Tier 1)
- Final toughlove pass on the full implementation

**Ship criterion**: All 126 posts rewritten, all 13 magnets delivering real PPTX files, vanity URL coverage at 100%, at least 5 captured test leads in Airtable.

### Out of Tiers (deferred)

- Voice drift audit for the full post set (do one random sample per 3 days during Tier 2-3)
- Core Web Vitals audit (Lighthouse run post-deploy, results logged to qa/SUMMARY.md)
- Follow-up for any n8n workflow gaps discovered in Phase 1 investigation

---

## Risks

- **R-001 (High)**: The n8n cerebro-lead workflow may not currently handle `newsletter-signup` tags correctly, meaning checkbox opt-ins may create records but never trigger welcome emails. Mitigation: Phase 1 investigation documents current behavior; if broken, follow-up task is logged but does not block Phase 6 deploy.
- **R-002 (Medium, reduced from High)**: If any vanity short URL is published in a post before the buildmytribe.ai redirect layer is configured, readers see a broken link. Mitigation: **FR-005 fallback path** — if the Cloudflare Worker is not deployed in time for a given day's publishing slot, that day's posts use direct `theinnovativenative.com/resources/<slug>` URLs as a fallback. A post-launch sweep converts fallback URLs to vanity URLs once the Worker is live. The pre-publish linter reports which format each post uses so Mike can verify.
- **R-003 (Medium)**: PPTX files in the existing lead-magnets folder may be out of date or contain placeholder content. Mitigation: Mike QAs all 6 before the PPTX deploy step; any regeneration is a separate task.
- **R-004 (Medium)**: The April 15 publishing deadline for Day 15 leaves a narrow window. Mitigation: Day 15 reuses existing `5-ai-tools-pi` resource (no new magnet needed), so Day 15 can publish even if later magnets aren't ready.
- **R-005 (Medium)**: Brand voice drift in the 7 new magnets or rewritten posts could break reader trust. Mitigation: Every new artifact is reviewed against weeks 1-2 voice before shipping.
- **R-006 (Low)**: Uncommitted work on branch 034-community-feed-ux could conflict if merged before this feature ships. Mitigation: No merge of 034 will occur during this feature's lifecycle; this feature works from its own 036 branch.
- **R-007 (Low)**: Rate limits on Airtable API during test spikes. Mitigation: tests use a dedicated test email; production traffic is low-volume (one campaign, gradual pilot rollout).
