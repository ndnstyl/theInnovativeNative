# n8n Cerebro Lead Capture — v49 Pre-Update Backup Reference

**Date**: 2026-04-09
**Workflow ID**: `76ZmsMqUYMsr397j`
**Version backed up**: v49 (`eb149839-7156-409b-9e2c-67f98ee8eb50`)
**Updated by**: feature 036-pi-content-value-system (CEO direct execution)

---

## Why this file exists

Per constitution hard rule "NEVER print API keys, tokens, or passwords in console output," the full workflow JSON containing hardcoded tokens is NOT saved here. Instead, this file documents:

1. **What was changed** (before/after summary of the Capture Lead node logic)
2. **How to roll back** if needed (restoring v49)

The full v49 snapshot lives in n8n's own version history (`activeVersion.versionId: eb149839-7156-409b-9e2c-67f98ee8eb50`) and can be retrieved via the n8n MCP `n8n_workflow_versions` tool or the n8n UI version history panel.

---

## Rollback Procedure

If the v50 update misbehaves in production:

1. Open n8n UI, navigate to workflow `76ZmsMqUYMsr397j` ("Cerebro — Lead Capture")
2. Click Version History → select v49 (versionId `eb149839-7156-409b-9e2c-67f98ee8eb50`, activated 2026-04-05)
3. Click "Restore this version"
4. Verify workflow is active and deploy a test POST from a known resource page

OR via MCP:

- Use `n8n_workflow_versions` to list versions
- Use the v49 versionId to identify the rollback target
- Manual restoration via the n8n UI is the safest route — do not script rollback

---

## What Was in v49 (behavior summary only — no tokens)

**Nodes**: 5 (Webhook → Validate Request → Spam Branch → Capture Lead → Respond)

**Capture Lead node** (the one being updated):
- Read these snake_case fields from `body`: `name`, `email`, `firm_name`, `phone`, `practice_area`, `firm_size`, `location`, `current_tools`, `pain_point`, `cta_source`
- Wrote to Airtable (base `appTO7OCRB2XbAlak`, table `tblOKWsV4GXq5sWjE`) with hardcoded:
  - `Source = "Cold Outreach"` (always)
  - `Status = "New"` (always)
  - `Score = 8` (always)
- Posted to Slack channel `C0ANB69HEUT` with structured message
- No retry on Airtable failure
- No UTM capture
- No dedup
- Tokens hardcoded inline (Airtable PAT, Slack bot token) — left unchanged by v50 update, since we can't rotate them in this session

**Validate Request node**: UNCHANGED in v50
- Origin allowlist (theinnovativenative.com + www)
- Honeypot check (`body.website_extra`, `body.url_field`, `body.website`)
- Rate limit (8/min burst, 60/hour per IP)

**Webhook, Spam Branch, Respond**: UNCHANGED in v50

---

## v50 Diff Summary (Capture Lead node only)

| Behavior | v49 | v50 |
|----------|-----|-----|
| Source column | Hardcoded "Cold Outreach" | Derived from `cta_source`: "Newsletter Signup" / "Newsletter Optin from Resource" / "Resource Download" / "Cold Outreach" (fallback) |
| UTM params in Notes | Not captured | Captured as "UTM: src=... med=... camp=... cont=... term=..." |
| Airtable retries | None (single attempt) | 3 attempts with exponential backoff (1s, 2s, 4s) |
| Token handling | Hardcoded, unchanged | Hardcoded, unchanged (follow-up: move to credentials) |
| Dedupe by email | None | None (tabled for follow-up) |
| Brevo list routing | None | None (tabled — blocked on Mike providing Brevo list ID + API key) |
| Welcome email | None | None (tabled — depends on Brevo or separate email send) |
| Field names read | snake_case (unchanged) | snake_case (unchanged) |
| Backward compatibility | — | v50 is backward compatible with old camelCase frontends (they still fall back to default values, same as v49 behavior) |

---

## Rollback Trigger Conditions

Restore v49 if, after v50 deploys:

1. Airtable record creation fails for >5% of submissions within 1 hour
2. Slack notifications stop arriving
3. The `Source` column shows unexpected values that break downstream automations
4. The retry logic causes duplicate records (shouldn't happen with this code, but monitor)
5. Rate limit false-positives spike

Monitoring:
- Slack channel `C0ANB69HEUT` (#agent-alerts) — lead notifications
- Airtable base `appTO7OCRB2XbAlak` table `tblOKWsV4GXq5sWjE` — new record count
- n8n execution history for workflow `76ZmsMqUYMsr397j`

---

## Post-Deploy Verification Checklist (Mike to run)

- [ ] Submit a test POST via a resource page (use the live `/resources/442-intake-math` once frontend is also deployed)
- [ ] Verify Airtable record created with `Source = "Resource Download"` (not "Cold Outreach")
- [ ] Verify `Name`, `Email`, `Company` fields populated (not empty)
- [ ] Verify Slack notification arrives with CTA source labeled
- [ ] Submit a test newsletter-only POST (via `/newsletter` page) — verify `Source = "Newsletter Signup"`
- [ ] Check a submission with UTM params in the URL — verify `Notes` contains "UTM: src=... camp=..."
- [ ] Intentionally trigger an Airtable failure (e.g., temporarily invalid field) — verify retry logs in n8n execution history
- [ ] Hit the webhook 10x in 10s from curl — verify rate limit fires at 8th request (unchanged from v49)
- [ ] Submit with honeypot `website` field populated — verify silent drop (no Airtable record, returns success JSON)
