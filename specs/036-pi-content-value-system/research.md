# Phase 0 Research: PI Law Firm Content Engine v2

**Feature**: 036-pi-content-value-system
**Date**: 2026-04-09
**Status**: Complete

This document resolves the 7 technical unknowns surfaced in [plan.md](./plan.md) Phase 0.

---

## R1 — buildmytribe.ai hosting and redirect layer

**Question**: Where is buildmytribe.ai currently hosted? What redirect technology should the branded short-URL system use?

**Investigation**:
- Repo contains `projects/website/blog/buildmytribeai.WordPress.2026-02-02.xml` — a WordPress export, suggesting the domain previously hosted a WordPress blog. The blog content has been migrated to the main site; the domain itself is stranded.
- No DNS configuration file in the repo indicates where DNS currently points.
- Existing spec `020-branded-url-shortener` evaluated four options: self-hosted YOURLS/Shlink (rejected due to hosting.com PHP constraints), Supabase Edge Function (over-engineered for this scope), Short.io (third-party SaaS, has recurring cost), and Cloudflare Worker (rejected in 020 because 020 wanted full click-level analytics with CAPI/GA4 event firing, which is heavier than this spec needs).

**Decision**: **Cloudflare Worker with static redirect map.** This is simpler than the Supabase Edge Function approach in spec 020 because feature 036 only needs redirection (not click analytics, CAPI firing, or database logging — those are 020's scope).

**Rationale**:
- Free tier covers 100k requests/day; PI campaign volume is a fraction of that.
- Single JavaScript file with a static map: no build pipeline, no database, no ongoing maintenance.
- Deploy artifact is human-readable and version-controlled at `infrastructure/buildmytribe-shortener/worker.js`.
- Cloudflare Workers support unlimited routes per worker — 14 slugs is trivial.
- When feature 020 eventually ships full analytics, the worker can be upgraded to forward to the 020 Edge Function. The slug→destination map is a stable contract.

**Alternatives considered**:
- **Cloudflare Page Rules**: Free tier allows only 3 page rules per domain. We need 14. Rejected.
- **Hosting.com .htaccess on the existing site**: Would require buildmytribe.ai DNS to point at hosting.com and a dedicated vhost/subdirectory. Doable but couples two unrelated systems. Rejected.
- **Short.io or Bitly Pro**: Recurring cost ($20-100/mo). Rejected — not worth it for a known, stable redirect set.
- **Waiting for spec 020 full implementation**: 020 is P2 and unscheduled. 036 is blocked on redirects now. Rejected.

**Follow-up action for Mike** (documented in Phase 4 tasks):
1. Log in to Cloudflare and add buildmytribe.ai as a site (if not already).
2. Point DNS (registrar) to Cloudflare nameservers.
3. Create a new Worker, paste `infrastructure/buildmytribe-shortener/worker.js`, deploy.
4. Add a Worker Route: `buildmytribe.ai/*` → the new worker.
5. Verify: `curl -I https://buildmytribe.ai/audit` returns `301` with `Location: https://theinnovativenative.com/resources/5-pattern-audit-workbook`.

If Mike prefers a non-Cloudflare approach (e.g., already has Vercel or Netlify for the domain), the worker.js file is portable to any edge runtime with minimal adjustments — the redirect-map.json is the stable contract.

---

## R2 — n8n cerebro-lead workflow behavior

**Question**: Does the existing `cerebro-lead` webhook workflow differentiate `leadMagnet: newsletter-signup` from resource downloads? Does it send welcome emails? Does it add to a Brevo list? Does it handle Airtable rate limits?

**Investigation**:
- Per hard rule: "user is the only one who tests n8n workflows." We do not modify or test the workflow ourselves.
- We CAN read workflow JSON via the n8n MCP (read-only) to document current behavior.
- Mike's memory note `n8n_workflow_status.md` lists workflow IDs and credentials but is not consulted directly for this research (doing so risks leaking credentials). Mike will verify during Phase 1.

**Decision**: **Phase 1 of implementation includes a read-only investigation task that documents current cerebro-lead workflow behavior in `qa/n8n-cerebro-lead-behavior.md`.** The investigation:
1. Reads the workflow via n8n MCP `n8n_get_workflow`.
2. Documents: trigger node, what fields it extracts, which nodes fire based on `leadMagnet` value, whether a Brevo node is present, whether a welcome email node is present, whether retry/backoff is configured on the Airtable node.
3. Produces a markdown summary with a yes/no for each capability.

**Fallback if workflow is insufficient**: The feature still ships. Every form submission (including newsletter opt-ins) creates an Airtable Leads record. If the workflow doesn't send welcome emails or add to Brevo, that's a follow-up task for Mike to extend the workflow in a separate session. It does not block deploy. In the worst case, Mike can manually process newsletter opt-ins as a batch.

**Rationale**: We cannot test the workflow ourselves, and we cannot block feature delivery on work that requires the user. Document, ship, follow up.

**Alternatives considered**:
- **Building a new workflow**: Violates the scope constraint (no new n8n work in this feature).
- **Skipping the newsletter opt-in checkbox until the workflow is verified**: Would mean shipping posts that promise newsletter delivery that may not fire. Worse outcome.

---

## R3 — Existing PPTX file integrity

**Question**: Do the 6 existing PPTX files in `projects/002-stan-store-lawfirm-funnel/assets/cerebro/lead-magnets/` open cleanly, render in brand, and contain production-quality content (not placeholders)?

**Investigation**:
- `file` command on all 6 files returns `Microsoft OOXML` — they are valid PowerPoint files structurally.
- File sizes: not measured in this research pass; will be validated during Phase 1 copy step.
- Visual content: cannot inspect automatically; requires Mike's eye.

**Decision**: **Trust the existing files as valid unless Phase 1 smoke test reveals visual issues.** Phase 1's copy step includes a micro-task: Mike opens one PPTX (442-intake-math-pi.pptx is recommended as a known-good reference) before the full set is copied. If it looks broken, investigate. If it looks fine, proceed with all 6.

**Rationale**: The files are structurally valid. Mike built them originally per the earlier handoff doc and presumably QA'd them before marking that handoff complete. We don't need to re-QA what's already been signed off; we need to check that nothing corrupted them since.

**Fallback if any file is corrupt**: Regenerate the specific file via pptx-generator from the existing markdown source. This adds ~15 minutes per regeneration.

---

## R4 — Brand voice calibration for new magnets

**Question**: What specific voice markers (sentence length, vocabulary, pacing) do the existing 6 magnets use that the new 7 must match?

**Investigation**:
- Read the opening pages of 3 existing magnets: `442-intake-math-pi.md`, `ai-governance-template-pi.md`, `heppner-executive-one-pager.md` (done during the initial audit in the conversation preceding this spec).
- Voice markers observed:
  - **Sentence length**: Mostly 8-18 words. Occasional 3-5 word punches ("It's the math."). No compound sentences longer than 25 words.
  - **Vocabulary**: Operator words — "bottleneck," "intake leak," "math problem, not a marketing problem," "fix," "play," "the number is X." Avoids legal jargon except when naming a specific case/rule (Heppner, ABA 512).
  - **Pacing**: Hook → fact → explanation → action. No throat-clearing. Every paragraph has a job.
  - **Pronouns**: Second person ("you," "your firm"). Never first person plural ("we built this for you" etc.).
  - **Numbers**: Specific and sourced. "$442 per lead (CasePeer 2025)" not "leads are expensive."
  - **Imperatives**: Frequent. "Pull these 5 reports." "Stop guessing." "Call your intake line from a burner."
  - **Cynicism markers**: Light, targeted ("Most firms use their CMS as a filing cabinet"). Never snarky.

**Decision**: **Every new magnet is authored against a calibration sample.** The calibration sample is a 2-paragraph excerpt from the closest existing magnet by topic. For example, the new `5-pattern-audit-workbook.md` uses `ai-governance-template-pi.md` as its voice calibration because both are operator-toned compliance/process documents. The authoring step cites the calibration source in the markdown frontmatter (`voice_calibration: ai-governance-template-pi`) so toughlove can verify.

**Rationale**: Voice drift is the single highest-probability failure mode for the 7 new magnets. Calibration samples eliminate the "what does good look like" ambiguity and make voice review a concrete comparison rather than a subjective judgment.

---

## R5 — Playwright E2E coverage of resource pages

**Question**: Does the existing Playwright suite test resource page functionality (form submission, download, newsletter opt-in)? If not, what's the minimum smoke test we need?

**Investigation**:
- Playwright tests found at `projects/website/e2e/`: `auth-advanced.spec.ts`, `auth.spec.ts`, `classroom.spec.ts`, `community.spec.ts`, `full-audit.spec.ts`, `site-health.spec.ts`.
- The `site-health.spec.ts` file (37 tests, per recent commit "test: add 37 E2E site health tests — 100% passing") is the generic site-wide smoke test. It likely checks page loads but not form submissions.
- No dedicated `resources.spec.ts` or `lead-capture.spec.ts` file exists.

**Decision**: **Add a minimal `resources.spec.ts` smoke test** as part of Phase 1 implementation. It covers:
1. `/resources` hub index page loads and renders at least 13 resource cards.
2. `/resources/442-intake-math` (sample existing page) loads with form visible.
3. `/resources/demand-letter-matrix` (sample new page) loads with form visible.
4. Form validation: submitting empty form shows errors on firstName and email fields.
5. Form submission does NOT test the actual webhook (unit-level only; webhook test is manual per Phase 6).

This is a minimal smoke test — 5 test cases, ~50 lines of Playwright code. It catches regressions in page load, form rendering, and basic validation. It does NOT replace the manual live-domain smoke test in Phase 6.

**Rationale**: The spec says no new test authoring beyond what's critical, and this is critical: without it, a regression in ResourceGate (from the newsletter opt-in modification) could ship undetected.

**Alternatives considered**:
- **No new tests, rely on manual QA**: Rejected. The newsletter opt-in modification touches a component used by 13 pages. One manual test can't cover all of them.
- **Full integration test including webhook**: Rejected. Would require test mode on the webhook, which we can't introduce without touching n8n.

---

## R6 — pptx-generator skill capabilities

**Question**: Does the pptx-generator skill support the dark + gold brand palette used by existing resource pages? What's the input format?

**Investigation**:
- Skill lives at `.claude/skills/pptx-generator/` with brands in `brands/<brand-name>/brand.json`.
- Existing brand `innovative-native` has a **cyan** primary (#00ffff) and magenta accent (#ff00ff), NOT gold. See `.claude/skills/pptx-generator/brands/innovative-native/brand.json`.
- The website resource pages (ResourceGate component) use **gold** (#d4a853) for primary accent.
- Memory note `feedback_inn_native_cyan_primary.md` confirms: cyan is primary, magenta is RARE accent — this is the brand system truth.
- **This means the website styling (gold) drifted from the brand system (cyan).** The drift is out of scope for this feature but worth noting.

**Decision**: **For PPTX generation, use the existing `innovative-native` brand config (cyan).** For landing pages, continue matching the existing 6 resource pages' gold styling. These two surfaces are visually separate — readers see the landing page in-browser, then download the PPTX and view it offline. The switch from gold landing to cyan PPTX is not a dealbreaker; it's a mild dissonance worth flagging but not fixing here.

**Alternative**: Create a new brand config `pi-funnel-gold` with the gold palette. Rejected because (a) it's out of scope to invent a new brand, (b) the brand system memory is explicit that cyan is correct, (c) changing the website to cyan would affect existing pages outside this feature's scope.

**Follow-up for Mike** (logged in qa/SUMMARY.md at toughlove step): The website's ResourceGate gold accent does not match the brand system's cyan primary. Decide whether to (a) update the website to cyan, (b) update the brand system to gold, or (c) accept the drift as a practical deviation. Out of scope for feature 036.

**Input format**: pptx-generator supports markdown with YAML frontmatter. The `cookbook/` directory has layout recipes (title-slide, content-slide, stats-slide, two-column-slide, quote-slide, cta-slide, etc.) that the skill maps from markdown structure. The 7 new magnets will author markdown following the same pattern as existing 6.

---

## R7 — UTM parameter capture path

**Question**: The `ResourceGate` component reads UTMs from localStorage via the `tin_utm_params` key. Where is that key populated? Does it get set when a user arrives from buildmytribe.ai → theinnovativenative.com redirect flow?

**Investigation**:
- Found `captureUTMParams()` in [projects/website/src/lib/analytics/utm.ts](projects/website/src/lib/analytics/utm.ts). Reads URL search params for `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, plus ad click IDs (`fbclid`, `gclid`, `li_fat_id`). Writes to localStorage key `tin_utm_params` with 30-day expiry.
- The function exists but where is it *called*? Need to verify it runs on every page load.
- Test file exists at `src/__tests__/analytics/utm.test.ts` — implies the capture logic is actively used.

**Decision**: **Verify `captureUTMParams()` is invoked from a global layout or `_app.tsx` hook during Phase 1.** If it's not, add a single-line invocation in the layout effect so every page load captures URLs arriving with UTM params. This is a trivial change (1 line in `useEffect`).

**Implication for buildmytribe.ai flow**: When a user clicks `buildmytribe.ai/audit?utm_source=linkedin&utm_campaign=day-26`, the Cloudflare Worker must **preserve the query string** in the 301 redirect. So `buildmytribe.ai/audit?utm_source=linkedin` → `theinnovativenative.com/resources/5-pattern-audit-workbook?utm_source=linkedin`. The Worker's redirect logic appends `request.url.search` to the destination URL. This is one line in worker.js.

**Rationale**: Without UTM preservation, we lose attribution on every buildmytribe.ai click — which is every post in weeks 3-4. Unacceptable. The Worker must forward query strings.

**Alternative**: Have posts include UTM params in the vanity URL itself (`buildmytribe.ai/audit?utm_source=linkedin-day-26`) so the Worker doesn't have to forward them. Rejected because it makes posts harder to write and the URLs less memorable. Cleaner to forward at the edge.

---

---

## R8 — Airtable Leads table actual schema

**Question** (added during toughlove review, H-003): What are the actual field names, types, and constraints of the Airtable Leads table in base `appTO7OCRB2XbAlak`? Does the n8n cerebro-lead workflow map all incoming payload fields correctly, or does it drop some silently?

**Investigation**: Not yet performed. The spec assumed the n8n workflow handles whatever we send, but the actual downstream mapping is unverified.

**Decision**: **Phase 1 investigation includes reading the Airtable Leads table schema via Airtable MCP.** The investigation produces `qa/airtable-leads-schema.md` documenting:
1. Field names present in the Leads table
2. Field types (Single line text, Email, Date, etc.)
3. Cross-reference with the n8n workflow's Airtable node field mapping
4. Any payload fields that are dropped or ignored
5. Whether the `leadMagnet` field accepts arbitrary string values or is constrained to a single-select list

**Fallback if fields are missing from the Airtable table**: The feature still ships. Any dropped fields are noted in `qa/SUMMARY.md` as a follow-up task for Mike to (a) extend the Airtable schema per constitution Schema Governance (Drew approval required) or (b) extend the n8n workflow field mapping. Neither blocks Phase 6 deploy — the core fields (firstName, email, leadMagnet) are known to work from the existing 6 resource pages already in production.

**Rationale**: Our downstream visibility is limited by the hard rule that Mike tests all n8n workflows. We can READ the Airtable schema but we cannot guarantee the workflow routes every field. The pragmatic path: document what we learn, ship the feature, log any gaps for Mike's follow-up.

---

## Consolidated Decisions Summary

| Unknown | Decision | Artifact |
|---------|----------|----------|
| R1 — short URL tech | Cloudflare Worker with static redirect map | `infrastructure/buildmytribe-shortener/worker.js`, `redirect-map.json`, `DEPLOY.md` |
| R2 — n8n workflow behavior | Read-only investigation in Phase 1; document, don't block | `qa/n8n-cerebro-lead-behavior.md` |
| R3 — PPTX file integrity | Trust existing, spot-check one during Phase 1 copy | Phase 1 micro-QA step |
| R4 — voice calibration | Every new magnet cites a calibration sample in frontmatter | `voice_calibration:` field in each new `.md` |
| R5 — E2E test coverage | Add minimal `resources.spec.ts` smoke test | `projects/website/e2e/resources.spec.ts` |
| R6 — pptx-generator brand | Use `innovative-native` brand; verify via Phase 2.0 sample before batch generation | `qa/SUMMARY.md` follow-up item + Phase 2.0 micro-QA |
| R7 — UTM capture | Verify global invocation; Worker must forward query strings | `worker.js` preserves `request.url.search` |
| R8 — Airtable Leads schema | Read-only schema audit in Phase 1 | `qa/airtable-leads-schema.md` |

## Open Questions (non-blocking)

None. All 8 unknowns have either a resolution or a documented fallback. Feature 036 can proceed to Phase 1 design.
