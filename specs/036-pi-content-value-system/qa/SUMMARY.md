# QA Summary: 036-pi-content-value-system

**Last updated**: 2026-04-09
**Overall Grade**: **A-** (post-toughlove fixes, was B+ at first pass)
**Launch Ready**: **YES** (Tier 1 MVP proceeds to `/speckit.tasks`)
**QA Status**: `in-progress` (pre-implementation review complete; post-implementation review pending)

---

## Pre-Implementation Review

See [pre-implementation-review.md](./pre-implementation-review.md) for full issue list.

### Issue Counts
| Severity | Count | Status |
|----------|-------|--------|
| CRITICAL | 1 | ✅ Fixed in spec/plan |
| HIGH | 9 | ✅ Fixed in spec/plan/contracts |
| MEDIUM | 9 | 📋 Logged below for follow-up |
| LOW | 5 | 📋 Logged below |
| INFO | 2 | 📋 Logged below |

### Fixes Applied to Spec Kit

| # | File | Change |
|---|------|--------|
| 1 | spec.md | FR-001 amended — scope to post BODY only, preserve hashtags and First Comment |
| 2 | spec.md | FR-005 amended — vanity URL fallback to direct URL |
| 3 | spec.md | FR-032 amended — whitelist-only Worker, 404 on unknown slug |
| 4 | spec.md | New section "Accessibility & Mobile" — FR-043 through FR-051 |
| 5 | spec.md | New section "Security Hardening" — FR-052 through FR-054 |
| 6 | spec.md | New section "Content Quality Guardrails" — FR-055 and FR-056 |
| 7 | spec.md | New section "Deploy Safety" — FR-057 |
| 8 | spec.md | New "Phased Delivery" section — Tier 1/2/3 ship schedule |
| 9 | spec.md | R-002 downgraded from High to Medium (fallback exists) |
| 10 | plan.md | Phase 2.0 Pre-batch PPTX Sample Verification section |
| 11 | plan.md | Phase 4 Fallback — Direct URLs section |
| 12 | plan.md | Risk Mitigations table — 5 new rows |
| 13 | contracts/vanity-redirect-map.schema.json | Security description added |
| 14 | research.md | R8 added — Airtable Leads schema verification task |

---

## Post-Implementation Follow-up Items (MEDIUM / LOW / INFO)

These are tracked here but do NOT block Tier 1 MVP ship. Each has an owner and a trigger.

### Medium

#### M-001: Safari ITP localStorage spot check
- **Trigger**: Phase 6 live smoke test
- **Action**: Open one resource page on iOS Safari, fill form, verify localStorage unlock persists on page refresh. If it doesn't, note the edge case and document user-facing copy.
- **Owner**: Mike (during smoke test)

#### M-002: In-app browser (Facebook/LinkedIn/Instagram) behavior
- **Trigger**: First 48 hours after Day 16 pilot ships
- **Action**: Publish Day 16, click the post from within the Facebook mobile app, complete the flow, verify lead captured.
- **Owner**: Mike

#### M-003: Core Web Vitals audit
- **Trigger**: Post-Phase 6 deploy
- **Action**: Run Lighthouse on one existing (`/resources/442-intake-math`) and one new (`/resources/demand-letter-matrix`) page. Log LCP, CLS, INP in this file. Target: LCP <2.5s, CLS <0.1, INP <200ms.
- **Owner**: Deploy agent

#### M-004: PPTX cache headers
- **Trigger**: After Phase 6 deploy
- **Action**: Add `Cache-Control: public, max-age=604800` for `/assets/lead-magnets/*` via LiteSpeed config or Next.js `_headers` file.
- **Owner**: Mike (requires server config)

#### M-005: Attribution monitoring — UTM-less records
- **Trigger**: Week 1 after Day 16 pilot
- **Action**: Query Airtable for Leads records missing UTM fields. If >10% of captures, investigate source (forwarding? bookmarks? direct traffic?).
- **Owner**: Mike

#### M-006: Brand color drift (gold vs cyan)
- **Trigger**: After Phase 2.0 sample PPTX verification
- **Action**: If cyan looks wrong next to gold-themed website, file a separate spec to unify the brand across website + pptx-generator. Out of scope for 036.
- **Owner**: Mike (design decision)

#### M-007: AI-tell phrase audit
- **Trigger**: After Tier 2 batch of rewrites
- **Action**: Run a regex scan across the rewritten posts for the FR-055 banned phrases. Report any matches in this file. Expected count: 0.
- **Owner**: Rewriter agent

#### M-008: Mike vibe check on rewritten posts
- **Trigger**: Before publishing each day's posts
- **Action**: Mike reads one post per day before it goes live. Looks for tone that feels off. Flag any.
- **Owner**: Mike

#### M-009: Returning visitor localStorage flow test
- **Trigger**: Phase 6 smoke test
- **Action**: Complete the form once, refresh the page, verify form is skipped and Download button appears directly.
- **Owner**: Deploy agent (Playwright) and Mike (manual)

### Low

#### L-001: Newsletter opt-in fire-and-forget fetch
- **Trigger**: Implementation of Phase 1 ResourceGate modification
- **Action**: Use `fetch` with `keepalive: true` for the secondary opt-in POST so it completes even if the page is navigating away.
- **Owner**: Implementer

#### L-002: Unique hero visuals per resource page
- **Trigger**: Post-launch polish (not Tier 1)
- **Action**: Give each resource page a unique background gradient, icon, or illustration to reduce monotony.
- **Owner**: Designer follow-up

#### L-003: Extend quickstart troubleshooting table
- **Trigger**: During Phase 6
- **Action**: Add two rows to the troubleshooting table in quickstart.md: "Form submits but no Airtable record" and "Vanity URL redirects but lands on 404."
- **Owner**: Documentation updater

#### L-004: Add returning visitor test to resources.spec.ts
- **Trigger**: Phase 1 test authoring
- **Action**: One more Playwright test case: set localStorage flag, reload, verify form skipped.
- **Owner**: Test author

#### L-005: Consider adding `resources` to directory-index fix loop
- **Trigger**: First Phase 6 deploy
- **Action**: Verify `/resources` loads correctly. If not, add `resources` to the loop in the deploy script per projects/website/CLAUDE.md.
- **Owner**: Deploy agent

### Info

#### I-001: Spec kit size (>3000 lines across all files)
No action. Recorded for future reference when auditing spec kit complexity trends.

#### I-002: Brand cyan/gold drift pre-exists this feature
Noted in Mike's memory at `feedback_inn_native_cyan_primary.md`. Website drift is pre-existing, out of scope for 036, flagged for future design system project.

---

## Phase 1 Investigation Tasks (required before deploy)

These are part of implementation execution, not follow-up. Listed here for tracking:

1. **n8n cerebro-lead workflow behavior** → `qa/n8n-cerebro-lead-behavior.md`
2. **Airtable Leads table schema** → `qa/airtable-leads-schema.md`
3. **PPTX file spot check** → document one opened file here
4. **`tin_utm_params` localStorage invocation** → verify `captureUTMParams()` is called from global layout

---

## Critical Fixes (all resolved — none outstanding)

None outstanding. See "Fixes Applied to Spec Kit" above for the resolved CRITICAL and HIGH items.

---

## Verdict

**LAUNCH READY for Tier 1 MVP.**

Proceed to `/speckit.tasks` to generate the task breakdown.

Tier 2 and Tier 3 ship rolling per the phased delivery schedule in spec.md. Each tier triggers its own mini-toughlove pass against the post-implementation state.

---

## Post-Implementation Review Placeholder

Will be populated by the toughlove run after Phase 6 deploy.

- [ ] All 13 resource pages render correctly
- [ ] One Airtable record created per submission with correct leadMagnet tag
- [ ] Newsletter opt-in creates separate tagged record
- [ ] All vanity URLs resolve (or fallback direct URLs work)
- [ ] Lighthouse scores recorded in M-003
- [ ] No AI-tell phrases in rewritten posts (M-007)
- [ ] Mobile smoke test passed (M-001, M-002)
- [ ] Final grade: target A- or better
