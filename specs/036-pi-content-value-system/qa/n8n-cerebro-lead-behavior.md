# n8n cerebro-lead Workflow — Behavior Audit

**Task**: T001 (Phase 1 investigation)
**Date**: 2026-04-09
**Workflow ID**: `76ZmsMqUYMsr397j`
**Workflow name**: "Cerebro — Lead Capture"
**Status**: Active, v49
**Nodes**: 5 (Webhook → Validate Request → Spam Branch → Capture Lead → Respond)
**Webhook path**: `cerebro-lead`
**Constraint**: Read-only audit. No modifications. Mike tests all n8n changes.

---

## Topology

```
Webhook (POST /cerebro-lead)
  └─> Validate Request (Code node)
        └─> Spam Branch (IF node)
              ├─[spam=true]─> Respond (silent success)
              └─[spam=false]─> Capture Lead (Code node) ──> Respond
```

## Node-by-Node Findings

### 1. Webhook Node

- Path: `/cerebro-lead`
- Method: POST only
- Response mode: `responseNode`
- **CORS allowlist**: `https://theinnovativenative.com`, `https://www.theinnovativenative.com` ONLY

### 2. Validate Request (Code node)

- **Origin allowlist check**: POSTs from any other origin are REJECTED with 500 error. buildmytribe.ai redirects to theinnovativenative.com first, so the form submission origin is always theinnovativenative.com — this is fine.
- **Server-side honeypot check**: fields `body.website_extra`, `body.url_field`, `body.website` are checked. Any non-empty value = silent success (returns fake `lead_id: 'queued'`) without writing to Airtable. **Frontend must use one of these three field names for the honeypot.**
- **Rate limiting**: 8 requests/minute burst, 60 requests/hour (per IP, via n8n staticData ring buffer). Note: Hostinger's reverse proxy may mask real client IPs, so rate limits may apply globally in some cases.
- **Payload stripping**: honeypot fields are stripped before passing downstream.

### 3. Spam Branch (IF node)

- Checks `_spam === true` from validate output
- Spam path → Respond (silent success)
- Clean path → Capture Lead

### 4. Capture Lead (Code node) — **CRITICAL FINDING**

The capture code reads specific snake_case fields from the POST body:

```javascript
const body = $input.first().json.body;
const name = body.name || '';                    // ⚠️ NOT firstName
const email = body.email || '';                  // ✓ matches
const firmName = body.firm_name || '';           // ⚠️ NOT firmName
const phone = body.phone || '';                  // not sent by ResourceGate
const practiceArea = body.practice_area || '';   // ⚠️ NOT practiceArea
const firmSize = body.firm_size || '';           // not sent
const location = body.location || '';            // not sent
const currentTools = body.current_tools || '';   // not sent
const painPoint = body.pain_point || '';         // not sent
const ctaSource = body.cta_source || 'unknown';  // ⚠️ NOT leadMagnet
```

**🔴 MAJOR INTEGRATION BUG (pre-existing, discovered during audit)**:

The existing `ResourceGate` component sends these fields with camelCase names:
- `firstName` → workflow expects `name` → **DROPPED**, saved as empty string
- `firmName` → workflow expects `firm_name` → **DROPPED**
- `practiceArea` → workflow expects `practice_area` → **DROPPED**
- `leadMagnet` → workflow expects `cta_source` → **DROPPED**
- `email` → matches → ✓ captured
- `timestamp` → not read → ignored (non-blocking)
- `utm_*` → not read → ignored (non-blocking, can live in Notes if needed)

**Impact**: Every form submission from the existing 6 resource pages creates an Airtable Leads record with:
- `Name` = empty
- `Email` = correct
- `Company` = empty
- `Notes` = "CTA: unknown" (because `cta_source` is empty, falls back to default)

The form submits. The webhook returns 200. The user unlocks the download. But the lead data stored is garbage. Mike has been capturing emails but losing all attribution.

**Airtable write target**:
- Base: `appTO7OCRB2XbAlak`
- Table ID: `tblOKWsV4GXq5sWjE` (**not the `tbliXF3imV0uFxJSB` Tasks table** documented in the constitution — this is a different Leads-specific table not documented in `airtable-schema.md`)
- Fields written: `Name`, `Email`, `Company`, `Source`, `Status`, `Score`, `First Touch Date`, `Last Touch Date`, `Notes`
- Hardcoded values:
  - `Source` = `'Cold Outreach'` ⚠️ (misleading for resource downloads and newsletter signups)
  - `Status` = `'New'`
  - `Score` = `8`

**Slack notification**:
- Every successful capture posts to Slack channel `C0ANB69HEUT` (#agent-alerts) with lead details. Good observability.

**What the workflow does NOT do**:
- Does NOT differentiate `leadMagnet: newsletter-signup` from other lead types — all records get identical treatment.
- Does NOT send a welcome email.
- Does NOT add to any Brevo list.
- Does NOT retry on Airtable failure (single POST, no backoff).
- Does NOT update an existing record if the email has been seen before (every submit is a new record).

### 5. Respond (Respond To Webhook node)

- Returns `{success, lead_id, email}` JSON
- Sets CORS headers dynamically based on `$json.origin`

---

## Implications for Feature 036

### 🔴 Must fix in this feature (R1 — blocks successful capture)

**Update ResourceGate payload to use snake_case field names matching the n8n workflow contract.**

Specifically, map:
| Frontend state (camelCase) | Wire format (snake_case to match n8n) |
|----------------------------|---------------------------------------|
| `firstName` | `name` |
| `email` | `email` |
| `firmName` | `firm_name` |
| `practiceArea` | `practice_area` |
| `leadMagnet` | `cta_source` |

Do NOT rename the React state fields — use camelCase in state and map at POST time. This is cleaner and preserves React conventions.

Update the contract file `contracts/lead-form-submission.schema.json` to reflect the corrected wire format.

### 🟡 Should flag to Mike (out of scope for feature 036)

1. **Existing 6 resource pages are already broken** — their submissions create Airtable records with empty Name/Company/Notes. The fix I apply in feature 036 will heal ALL 13 resource pages (existing 6 + new 7) because they all use the same ResourceGate component. **This is an incidental benefit.**

2. **`Source` field is hardcoded to 'Cold Outreach'** — misleading for inbound resource captures. Suggestion: update workflow to set `Source` based on `cta_source` value. Mike's call.

3. **No differentiation between newsletter signups and resource downloads** — the feature still ships (both flows create records, distinguished only by `cta_source` in Notes). Mike may want to extend the workflow to route newsletter signups to Brevo. Follow-up, not a blocker.

4. **Airtable Leads table `tblOKWsV4GXq5sWjE` is not documented** in `.claude/rules/airtable-schema.md`. Suggestion: Mike updates the schema doc.

5. **Hardcoded API tokens in the Code node** — Airtable PAT and Slack bot token are pasted in plain text. This violates best practice but is within the user's control. No action from us per security rules.

### 🟢 Already handled server-side (frontend can simplify)

1. **Honeypot**: Server checks `body.website_extra`, `body.url_field`, `body.website`. **Frontend must add a hidden input named `website` (or one of the other two) so the server-side check works.** My T012 task now just adds the HTML field, no frontend JS logic needed.

2. **Rate limiting**: Server-side, per-IP. Frontend doesn't need client-side rate limiting for security (though the time-based <2s check from T013 is still useful as a UX signal for bots).

3. **Origin check**: Only theinnovativenative.com is allowed. No cross-origin submissions possible.

---

## Updated Payload Contract (overrides contracts/lead-form-submission.schema.json)

```json
{
  "name": "Jane Smith",              // was firstName
  "email": "jane@smithlaw.com",
  "firm_name": "Smith & Associates", // was firmName
  "practice_area": "Personal Injury",// was practiceArea
  "cta_source": "demand-letter-matrix", // was leadMagnet
  "website": "",                     // honeypot; must be empty string for legit submissions
  "utm_source": "linkedin",          // optional, n8n will ignore but can be added to Notes later
  "utm_medium": "organic",
  "utm_campaign": "week3-day16",
  "timestamp": "2026-04-16T14:32:18.421Z"
}
```

---

## Verdict

**Proceed with Phase 1 ResourceGate modification using the corrected wire format.** Update `contracts/lead-form-submission.schema.json` to match. Document the pre-existing bug (T001 output — this file). Flag the `Source` hardcoding and newsletter differentiation as Mike follow-ups in `qa/SUMMARY.md`.

This finding actually raises the stakes of feature 036: we're not just adding new pages, we're fixing a silent data-loss bug that has been corrupting lead capture across all existing resource pages. Healthy side effect.
