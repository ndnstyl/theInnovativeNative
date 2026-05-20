# Airtable Leads Table Schema — Documented From n8n Workflow

**Task**: T002 (Phase 1 investigation)
**Date**: 2026-04-09
**Source**: Derived from the Capture Lead Code node in workflow `76ZmsMqUYMsr397j` (n8n cerebro-lead)
**Status**: Partial — full schema verification would require Airtable MCP access, which was not attempted in this run. The fields listed below are the ones the n8n workflow writes; the table may have additional fields we don't touch.

---

## Base & Table

- **Base**: `appTO7OCRB2XbAlak` (theinnovativenative main base)
- **Table ID**: `tblOKWsV4GXq5sWjE`
- **Table name**: Not documented in the n8n code, likely "Leads" or similar

⚠️ **Note**: This table is NOT documented in `.claude/rules/airtable-schema.md`. The constitution's schema doc lists Agents, Projects, Time Entries, Tasks, Deliverables, and Escalations — but not a Leads table. This is a documentation gap, not a schema problem. Mike should add it.

## Fields Written by n8n cerebro-lead Workflow

| Field Name | Type (inferred) | Value Written | Notes |
|------------|-----------------|---------------|-------|
| `Name` | Single line text | `body.name` (from POST payload) | Empty in current submissions because ResourceGate sends `firstName` not `name` |
| `Email` | Email | `body.email` | Correctly captured |
| `Company` | Single line text | `body.firm_name` | Empty because ResourceGate sends `firmName` (camelCase) |
| `Source` | Single select (presumed) | Hardcoded string `'Cold Outreach'` | Misleading — every lead gets this value regardless of actual source |
| `Status` | Single select (presumed) | Hardcoded string `'New'` | |
| `Score` | Number | Hardcoded `8` | |
| `First Touch Date` | Date | Today's date (ISO YYYY-MM-DD) | |
| `Last Touch Date` | Date | Today's date (ISO YYYY-MM-DD) | |
| `Notes` | Long text | Composed from CTA + optional fields | Currently mostly empty because practice_area, firm_size, location etc. are not sent |

## Fields the Workflow READS from Payload but Doesn't Write Directly

These are read from `body.*` but only populate the `Notes` field:

- `body.phone` → Notes (if present)
- `body.practice_area` → Notes (if present) — ResourceGate sends as `practiceArea`, so not captured
- `body.firm_size` → Notes (if present) — never sent
- `body.location` → Notes (if present) — never sent
- `body.current_tools` → Notes (if present) — never sent
- `body.pain_point` → Notes (if present) — never sent
- `body.cta_source` → Notes ("CTA: <value>") — ResourceGate sends as `leadMagnet`, so this shows as "CTA: unknown"

## Fields the Workflow Does NOT Handle

- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` — silently ignored (could be added to Notes in a future workflow update)
- `fbclid`, `gclid`, `li_fat_id` — silently ignored
- `timestamp` — silently ignored (Airtable First Touch Date is set server-side)
- `source` — ResourceGate's distinguishing field — silently ignored

## Impact Summary (also captured in n8n-cerebro-lead-behavior.md)

Current production state (pre-feature-036): Every lead captured from the 6 existing resource pages has:
- `Name` = `""` (empty)
- `Email` = correct
- `Company` = `""` (empty)
- `Source` = `"Cold Outreach"` (misleading)
- `Notes` = `"CTA: unknown"` (useless — no attribution)

Feature 036 fixes this by aligning the frontend payload field names with the workflow's expected names (`firstName` → `name`, etc.). After feature 036 deploys, ALL 13 resource pages (existing 6 + new 7) begin writing correct data.

## Required Frontend Fix

Update `ResourceGate.tsx` submit handler to map React state (camelCase) to wire format (snake_case) matching the n8n contract. The full mapping is in `n8n-cerebro-lead-behavior.md` under "Updated Payload Contract."

## Out-of-Scope Follow-ups for Mike

1. **Update `.claude/rules/airtable-schema.md`** to document table `tblOKWsV4GXq5sWjE` with its field list.
2. **Update n8n workflow to derive `Source` from `cta_source`** (e.g., "resource-download" vs "newsletter-signup" vs "cold-outreach"). Would give real attribution in the Source column instead of everything being "Cold Outreach."
3. **Update n8n workflow to dedupe by email** — currently every submit creates a new record. For a subscriber who downloads 3 resources, Mike gets 3 Airtable rows instead of 1 enriched row.
4. **Consider extending the workflow** to:
   - Route `cta_source: 'newsletter-signup'` to a separate Brevo list
   - Capture UTM parameters into Notes or dedicated fields
   - Add welcome email on first-time lead capture
5. **Rotate hardcoded API tokens** in the Code node (Airtable PAT and Slack bot token) — currently plain-text pasted into the workflow. Violates security best practice, though tokens are still scoped.
