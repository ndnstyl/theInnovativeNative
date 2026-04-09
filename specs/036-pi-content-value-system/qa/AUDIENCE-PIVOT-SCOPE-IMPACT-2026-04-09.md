# Audience Pivot — Scope Impact Assessment

**Date**: 2026-04-09
**Trigger**: Mike caught the practice area dropdown showing PI-only options after deploy. Real audience target is **Criminal Defense, Bankruptcy, Administrative Law** (primary), not Personal Injury.
**Severity**: 🚨 **HIGH** — feature 036 was built on the wrong audience assumption
**Status**: Hotfixes shipped (n8n v51 + practice area dropdown). Larger scope decision needed.

---

## What I Just Fixed (hotfixes, already deployed)

### Fix #1: Form submission 422 error
- **Symptom**: `Something went wrong. Please try again.` after submit
- **Root cause**: n8n cerebro-lead v50 was sending `Source: "Resource Download"` to Airtable, but the Leads table `Source` column is a single-select with only 5 fixed options: `Organic`, `Paid`, `Referral`, `Event`, `Cold Outreach`. Airtable returned `INVALID_MULTIPLE_CHOICE_OPTIONS — Insufficient permissions to create new select option "Resource Download"`. The PAT lacks `schema.bases:write` scope.
- **Fix**: n8n workflow updated to **v51**. Now maps inbound resource downloads + newsletter signups to the existing `Organic` value (semantically correct — they came from organic inbound content). Specific CTA attribution still preserved in the Notes field.
- **Verified**: Test POST to live webhook returned `{"success":true,"lead_id":"recTHPZL66NJCaFeb"}`. Airtable record has `Name: "QA v51 Test"`, `Email: qa-036-v51@theinnovativenative.com`, `Company: "Test Firm v51"`, `Source: "Organic"`, `Notes: "CTA: demand-letter-matrix\nPractice: Personal Injury\nUTM: src=qa-test"`.

### Fix #2: Practice area dropdown
- **Symptom**: Dropdown only showed PI subtypes (Personal Injury, Medical Malpractice, Auto Accident, Workers Comp, Wrongful Death, Product Liability, Premises Liability, Other). None of Mike's primary target practice areas (Criminal, Bankruptcy, Admin) appeared.
- **Root cause**: I built feature 036 against the existing 002-stan-store-lawfirm-funnel project which is PI/mass tort focused. The dropdown copied that scope without question.
- **Fix**: Updated `PRACTICE_AREAS` in [ResourceGate.tsx](../../../projects/website/src/components/containers/resources/ResourceGate.tsx) to a broader 11-item list led by the primary targets:
  - Criminal Defense ⬅ primary target
  - Bankruptcy ⬅ primary target
  - Administrative Law ⬅ primary target
  - Personal Injury (kept — still a secondary audience)
  - Family Law
  - Estate Planning
  - Business Law
  - Immigration
  - Real Estate
  - Tax Law
  - Other
- Contract schema [lead-form-submission.schema.json](../contracts/lead-form-submission.schema.json) updated to match.
- **Verified**: All 5 sampled options confirmed live in `/resources/demand-letter-matrix` HTML.

---

## 🚨 The Bigger Problem (decision needed)

**Feature 036 was built on the wrong audience assumption end-to-end.** The dropdown was the smallest visible symptom. The real impact:

| Surface | PI references | Status |
|---------|---------------|--------|
| **week-03-apr-15-21.md** (Days 15-21) | **130 references** | Needs full audience refactor |
| **week-04-apr-22-28.md** (Days 22-28) | **89 references** | Needs full audience refactor |
| **6 of 7 lead magnets** PI/mass tort flavored | ~50+ references each | Need rewrite OR repurpose for new audience |
| **/resources hub index TSX** | 11 references | Quick fix |
| **demand-letter-matrix landing page** | 0 references | OK as-is |
| **demand-letter-matrix.md magnet source** | 1 reference | OK as-is (generic enough) |
| **Spec.md** | 6 references | Spec frame is "PI Law Firm Content Engine v2" |
| **Spec kit titles** | "036-pi-content-value-system" | Branch + folder name |

The Day 15-16 rewrites we just shipped are **high-quality writing for the wrong audience**. Examples:

- Day 15 talks about: medical record review, demand letters, mass tort PFS, intake $442/lead, Colossus insurance AI, EvenUp settlements, Filevine/Lawmatics intake scoring
- Day 16 talks about: demand letter drafting hours, Tavrn, EvenUp, Supio
- 6 of 7 magnets reference: PI case files, demand letters, mass tort plaintiffs, medical records, settlement valuation, insurance company AI

**None of this content speaks to Criminal Defense, Bankruptcy, or Administrative Law firms.** The pain points are different. The tools are different. The deals/clients/cycles are different. A criminal defense attorney who lands on `/resources/demand-letter-matrix` will bounce — their cases don't have demand letters in the same way.

---

## What's Still Right (don't throw away)

The **infrastructure** of feature 036 is audience-agnostic and stays:

- ✅ ResourceGate component (form, validation, P0 fix, honeypot, opt-in)
- ✅ n8n cerebro-lead workflow v51 (lead capture, retry, attribution)
- ✅ Cloudflare Worker artifacts (vanity short URL system)
- ✅ /resources hub structure
- ✅ Build pipeline + deploy flow
- ✅ Spec kit methodology (toughlove, phased delivery, branch-safe commits)
- ✅ The bug fixes that healed the 6 existing pages — those pages still work for whoever the actual audience is

The **content** is the audience-coupled part:

- ❌ 13 lead magnets (6 existing + 7 planned) all assume PI lawyer
- ❌ Days 15-28 post calendar (126 posts) all assume PI/mass tort
- ❌ Heppner-related magnets are general legal AI but framed for PI (still partially salvageable)
- ❌ Resource page bullets / hero copy / SEO meta on the new pages

---

## Three Paths Forward (Mike's call)

### Path A: Audience Refactor (recommended for the long term, expensive short term)

Rewrite all content for Criminal/Bankruptcy/Admin while keeping infrastructure.

- Rewrite 6 existing lead magnets → Criminal/Bankruptcy/Admin equivalents (e.g., "Demand Letter Matrix" → "Discovery Motion Builder Matrix" for criminal, or "Means Test Worksheet" for bankruptcy)
- Throw away the 7 planned new magnets, redesign for new audience
- Throw away the 18 Day 15-16 rewrites, write fresh ones for new audience
- Throw away Tier 2/3 (Days 17-28) plan, replan
- Update spec.md, plan.md, tasks.md
- Rename branch + spec folder from `036-pi-content-value-system` → `037-criminal-bankruptcy-admin-content`

**Effort**: ~30-50 hours of content writing + 5 hours of spec kit refactor + 2 hours of infrastructure tweaks (page bullets, hero copy)
**Risk**: April 15 publishing deadline cannot be met for the new audience. You'd publish nothing or publish PI content one more week.
**Reward**: Content that actually speaks to your real audience.

### Path B: Two-Track Content System (best of both)

Keep the PI content for the secondary PI audience. Build a parallel Criminal/Bankruptcy/Admin track.

- Existing 6 PI magnets stay live for any PI lawyers who find them
- Days 15-28 PI content publishes as planned (it's high quality)
- Spin up a NEW spec (037 or similar) for Criminal/Bankruptcy/Admin
- New spec gets its own magnets, its own content calendar, its own publishing schedule
- Hub index `/resources` gets practice-area filtering or two sections

**Effort**: ~30-50 hours for the new track + minor hub UI changes. PI content is sunk cost — ship it.
**Risk**: Brand might feel scattered if both audiences see both tracks. Practice area filter mitigates.
**Reward**: Nothing wasted. Both audiences served. PI brings traffic; Criminal/Bankruptcy/Admin brings the actual deals.

### Path C: Fast Pivot (compromise)

Keep the infrastructure, hotfix the most visible audience-pivoting language, defer the deep rewrite.

- Update hub index landing page subtitles to be neutral ("Resources for Law Firm Owners" instead of "Resources for PI Firm Owners")
- Update SEO meta to be audience-agnostic
- Park Days 15-28 publishing — don't publish PI content as if it's for everyone
- Fast-write 1-2 NEW magnets specifically for Criminal/Bankruptcy/Admin
- Spin up a Tier 2 spec to do the proper refactor next week

**Effort**: ~4-6 hours this week + 30+ hours next week
**Risk**: PI content sits in the system without being published. Half-pivot looks awkward.
**Reward**: Buys decision time. Avoids publishing content that misfires.

---

## My Recommendation: Path B (Two-Track)

The PI content is genuinely well-written and the infrastructure changes are solid. It would be wasteful to scrap them. **But the Criminal/Bankruptcy/Admin content needs to start fresh** because the pain points and tools are fundamentally different — you can't just find-and-replace "PI" → "Criminal" and have it land.

Specifically:

1. **Today**: Don't publish Day 15 or Day 16 yet. Keep them parked.
2. **Right now**: Update hub index page subtitles to be neutral ("Resources for Law Firm Owners"). Quick fix, removes the PI-only framing.
3. **This week**: Spin up a new spec (037-criminal-bankruptcy-admin-content) with its own audience research, pain points, tool list, and content calendar.
4. **Next week**: First Criminal/Bankruptcy/Admin magnet shipped + first day's posts published.
5. **Eventually**: Decide whether the PI track also publishes (if so, on a separate cadence, not mixed with the new audience).

---

## Immediate Hotfixes Already Done (don't need approval)

| Fix | Status | Files |
|-----|--------|-------|
| n8n cerebro-lead v51 (422 error fix) | ✅ Live | n8n workflow `76ZmsMqUYMsr397j` |
| Practice area dropdown | ✅ Live | `ResourceGate.tsx`, `lead-form-submission.schema.json` |
| Test record proves end-to-end works | ✅ Confirmed | Airtable record `recTHPZL66NJCaFeb` |
| Form submit no longer errors | ✅ Confirmed via curl test | Live webhook returns success JSON |

The form on the live site **works now** for any visitor who lands on it. They just won't see content that speaks to their practice area. That's the deeper problem.

---

## Immediate Decisions Needed From Mike

1. **Path A, B, or C?** (Above. My vote: B.)
2. **Should I park Days 15-16 publishing** until you decide? (My vote: yes — don't publish PI content if your audience is Criminal/Bankruptcy/Admin.)
3. **Should I update hub index page copy now** to remove the "PI Firm Owners" framing as a stopgap? (Quick win, ~5 minutes, doesn't depend on the bigger decision.)
4. **Did I miss a P0 communication failure earlier?** Was the audience target somewhere I should have caught it before building? (Honest self-check: I worked from the existing 002-stan-store-lawfirm-funnel project files which were heavily PI-themed. I didn't ask "is this still the right audience" — that was a miss on my part.)

---

## Files Changed This Session (post-deploy hotfixes)

| File | Change |
|------|--------|
| n8n workflow `76ZmsMqUYMsr397j` v50 → v51 | Source mapped to existing single-select options |
| `projects/website/src/components/containers/resources/ResourceGate.tsx` | PRACTICE_AREAS expanded to 11 items led by Criminal/Bankruptcy/Admin |
| `specs/036-pi-content-value-system/contracts/lead-form-submission.schema.json` | practice_area enum updated to match |
| `specs/036-pi-content-value-system/qa/AUDIENCE-PIVOT-SCOPE-IMPACT-2026-04-09.md` | This file |

n8n change is live (deployed via MCP).
Frontend change is built but **not yet deployed via rsync** — pending decision on whether to redeploy now or batch with bigger refactor.

---

## Status

- **P0 form submission bug**: ✅ FIXED end-to-end (frontend payload + n8n v51 + Airtable accepting writes)
- **Practice area dropdown**: ✅ FIXED in code, ⏳ pending redeploy
- **Audience scope problem**: ⚠️ DECISION NEEDED (Path A/B/C)
