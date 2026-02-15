# Integration QA Review: Stan Store Law Firm Funnel

**Review Date**: 2026-02-06
**Reviewer**: Claude Code QA Agent
**Scope**: Cross-document consistency and integration validation
**Documents Reviewed**: 6

---

## EXECUTIVE SUMMARY

This integration has **CRITICAL MISMATCHES** in three areas that MUST be resolved before implementation:

1. **Airtable Field Names**: The workflow spec and Airtable spec use DIFFERENT field naming conventions
2. **Webhook Payload Fields**: The contract doesn't specify how `product_type` derives from Stan Store data
3. **Deduplication Strategy**: Conflicting approaches across specs create duplicate risk

**Overall Grade**: **C-** (Multiple critical integration gaps detected)

---

## DETAILED FINDINGS

### 1. AIRTABLE FIELD NAME INCONSISTENCY (CRITICAL)

**Status**: FAIL
**Severity**: BLOCKING

#### Issue
The n8n workflow spec (Node 6) attempts to write to Airtable field names that DON'T match the Airtable table spec.

**n8n Workflow Spec (Node 5a/5b Set nodes) writes these fields:**
```javascript
"name": "{{ $json.customer_name }}",
"email": "{{ $json.customer_email }}",
"lead_type": "Buyer",
"product": "Blueprint",
"product_name": "{{ $json.product_name }}",
"amount": "{{ $json.amount }}",
"currency": "{{ $json.currency || 'USD' }}",
"source": "Stan Store",
"status": "New",
"timestamp": "{{ $json.timestamp || $now }}",
"zapier_event_id": "{{ $json.zapier_event_id }}"
```

**Airtable Table Spec defines these fields:**
```
Name (Single line text)
Email (Email)
Lead Type (Single select: "Lead", "Buyer")
Product (Single select: "Scorecard", "Blueprint", "Both", "Unknown")
Product Name (Single line text)
Amount (Currency)
Currency (Single line text)
Source (Single select)
Status (Single select)
Timestamp (Date and time)
Zapier Event ID (Single line text)
```

**The Mismatch:**
- n8n writes: `"name"`, `"email"`, `"lead_type"`, `"product"`, etc. (lowercase with underscores)
- Airtable expects: `Name`, `Email`, `Lead Type`, `Product`, etc. (capitalized with spaces)

**Why It Fails:**
Airtable is case-sensitive. When n8n tries to write to field `name`, Airtable won't find a field called `name` (it's called `Name`). The record creation will fail with a field mismatch error.

**Evidence from n8n spec (line 217-227):**
```
**Field Mappings**:
- **Name**: `{{ $json.name }}`
- **Email**: `{{ $json.email }}`
- **Lead Type**: `{{ $json.lead_type }}`
```

**Evidence from Airtable spec (lines 18-27):**
```
| Field Name | Field Type |
|-----------|-----------|
| **Name** | Single line text |
| **Email** | Email |
| **Lead Type** | Single select |
```

**Required Fix:**
Either:
- **Option A** (Recommended): Update n8n Set nodes (5a, 5b) to use Airtable's EXACT field names with capitalization
- **Option B**: Update Airtable table to use lowercase field names (not recommended for user-facing tool)

---

### 2. PRODUCT TYPE CLASSIFICATION INCONSISTENCY (CRITICAL)

**Status**: FAIL
**Severity**: BLOCKING

#### Issue
The webhook contract says `product_type` will be in the payload, but doesn't explain how Stan Store provides it. The Zapier guide shows it requires special logic, but the n8n spec treats it as a direct field.

**Contract spec (line 19):**
```json
"product_type": "free",
```
(No explanation of where this comes from)

**n8n Workflow spec (Node 4, lines 139-141):**
```
- **Rule 1**:
  - Field: `{{ $json.product_type }}`
  - Operation: `equals`
  - Value: `paid`
```
(Assumes `product_type` is directly in the JSON payload)

**Zapier Setup Guide (lines 182-216):**
```
##### **Special Case: product_type Field**

Stan Store does not provide a direct "product_type" field. You need to use
Zapier's **Formatter** to derive this.

**Option A: Use Amount to Determine Type** (Recommended)
...
**Option B: Use Product Name to Determine Type** (Fallback)
```

**The Problem:**
1. The contract promises a `product_type` field in the payload
2. The n8n spec assumes this field exists
3. The Zapier guide explicitly states Stan Store does NOT provide this field
4. The Zapier guide requires custom logic (Formatter step) to CREATE this field

**Result**: Zapier WILL create the field, but ONLY if the CEO sets up the custom Formatter logic. If the CEO skips this step (likely, given the complexity), the field will be missing from the payload, and n8n's classification logic will fail.

**Evidence of Confusion:**
- Zapier guide line 215: "Ask Builder if you need help with this step — product_type is critical for lead classification in n8n."
- This indicates uncertainty about whether the mapping will actually work

**Required Fix:**
1. **Update Contract spec** to explicitly state:
   ```
   "product_type" is NOT a native Stan Store field.
   It MUST be derived in Zapier using a Formatter step.
   Classification logic in n8n depends on this field being present.
   ```
2. **Update n8n spec** to include fallback logic:
   - If `product_type` is missing, classify based on `amount > 0` instead
   - Document the fallback clearly
3. **Simplify Zapier setup** OR include a pre-built Zap template that handles this

---

### 3. LEAD TYPE PRODUCT MAPPING (CRITICAL)

**Status**: FAIL
**Severity**: HIGH

#### Issue
The n8n spec hardcodes specific product names during classification, but doesn't match data model assumptions.

**n8n Workflow spec (Node 5a, line 167):**
```javascript
"product": "Blueprint",
```
(If paid → Always maps to "Blueprint")

**n8n Workflow spec (Node 5b, line 194):**
```javascript
"product": "Scorecard",
```
(If free → Always maps to "Scorecard")

**Problem:**
What if:
- A customer buys a paid product called "Premium Audit" (not "Blueprint")?
- A customer downloads a free product called "Quick Start Guide" (not "Scorecard")?
- A customer buys TWO products (one paid, one free)?

The hardcoded mapping assumes only two products exist:
- Free = Always "Scorecard"
- Paid = Always "Blueprint"

**Data Model spec (line 16-17):**
```
| Product | Single select | "Scorecard" or "Blueprint" | Yes |
```
(Only two options, confirming the assumption)

**Airtable Table spec (line 23):**
```
Options: "Scorecard", "Blueprint", "Both", "Unknown"
```
(Four options, but "Both" and "Unknown" are never set by the workflow)

**Evidence of Design Assumption:**
- Zapier guide line 69: "This event fires when someone downloads a free product OR purchases a paid product"
- n8n spec line 167: "Hardcode: 'Blueprint'" for all paid products

**Risk:**
- If Stan Store adds new products, the workflow breaks
- The Airtable spec allows "Both" and "Unknown" but workflow never creates these records
- Mismatch between Airtable schema and what n8n actually writes

**Required Fix:**
1. **In n8n spec**: Change Node 5a/5b logic to:
   - `"product": "{{ $json.product_name }}"` (use actual product name)
   - OR add conditional logic to map product names to "Scorecard"/"Blueprint"/"Both"/"Unknown"
2. **Update Airtable spec** to match actual workflow behavior, OR
3. **Update workflow** to support new products via configuration (not hardcoding)

---

### 4. DUPLICATE DETECTION STRATEGY MISMATCH (HIGH)

**Status**: FAIL
**Severity**: HIGH

#### Inconsistency #1: Deduplication Field

**n8n Workflow spec (Node 3, lines 98-100):**
```
**Filter Configuration**:
- **Field**: `Zapier Event ID`
- **Operator**: `=`
- **Value**: `{{ $json.zapier_event_id }}`
```

**Airtable Table spec (line 130):**
```
### Deduplication Strategy
- Use Zapier's "Find record" step before creating
- Search by Email + Zapier Event ID
```

**The Mismatch:**
- n8n searches ONLY by `Zapier Event ID`
- Airtable spec recommends searching by `Email + Zapier Event ID`

**Why It Matters:**
If Zapier retries with a different event ID (e.g., during failure recovery), n8n's single-field search might miss the duplicate. Searching by both Email AND Event ID is safer.

**Inconsistency #2: Duplicate Handling**

**n8n Workflow spec (Node 3b, line 125):**
```
- **True**: Duplicate found → Skip to Node 8 (Respond with existing record)
```
(Returns existing record ID to Zapier)

**Zapier Setup Guide (line 381):**
```
- **"Duplicate record"** → n8n's duplicate check caught a retry.
  This is expected behavior (safe to ignore).
```
(Suggests duplicates might happen and are normal)

**Problem:**
If duplicates happen despite the check, should they be:
- Silently ignored (current behavior)?
- Updated with new data?
- Flagged for review?

Not specified.

**Required Fix:**
1. **Update n8n spec** to search by `Email + Zapier Event ID`, not just Event ID
2. **Document duplicate handling**: What happens if a customer buys the same product twice?
3. **Add monitoring**: Log every duplicate detection for CEO review

---

### 5. CURRENCY FIELD MISMATCH (MEDIUM)

**Status**: WARN
**Severity**: MEDIUM

#### Issue
The Airtable spec defines `Currency` as "Single line text" but n8n writes it as a simple string.

**n8n Workflow spec (Node 5a, line 170):**
```javascript
"currency": "{{ $json.currency || 'USD' }}"
```

**Airtable Table spec (line 24):**
```
| **Currency** | Single line text | Default: "USD" |
```

**Issue:**
This is technically fine (string → single line text). BUT:
- Airtable has a native `Currency` field type (different from "Single line text")
- If CEO later wants to use Airtable's currency formatting, they'll need to migrate
- The Amount field (line 24) is already defined as `Currency` type (with USD formatting)

**Why Inconsistent:**
- Why have both `Amount` (Currency type) AND `Currency` (Text type)?
- This suggests confusion about whether to store currency with amount or separately

**Evidence of Inconsistency:**
- Airtable spec line 24: "Amount | Currency | Format: USD..."
- Airtable spec line 26: "Currency | Single line text"

**Recommendation:**
If currency is always USD (which seems to be the case), consider:
- **Option A**: Remove the `Currency` field from Airtable entirely, hardcode USD in n8n
- **Option B**: Change Airtable `Currency` to a currency field type, align formatting

---

### 6. ERROR HANDLING SPECIFICATION MISMATCH (MEDIUM)

**Status**: WARN
**Severity**: MEDIUM

#### Issue
The contract and n8n spec describe different error handling approaches.

**Contract spec (lines 54-57):**
```
### Error Handling

- If Airtable write fails → n8n logs error, retries once
- Duplicate detection: Check Zapier Event ID before creating record
- Missing required fields → Log warning, create record with available data
```

**n8n Workflow spec (lines 305-322):**
```
### Error Handling Strategy

### 1. Airtable Failure
- **Behavior**: If Node 6 (Airtable Create) fails, the error is caught by
  n8n's error workflow...
- **Webhook Response**: Node 8 still executes, returning `{"success": false,
  "error": "Database write failed"}` with 200 status code.

### 2. Missing Required Fields
- **Behavior**: If `customer_name` or `customer_email` is missing, Airtable
  Create will fail. Error is logged but webhook still returns 200.
```

**The Mismatch:**
1. **Retry Logic**: Contract says "retries once" but n8n spec doesn't mention retries at all
2. **Missing Fields**: Contract says "create record with available data" but n8n spec says "will fail"
3. **Error Response**: n8n returns 200 with `success: false`, but contract doesn't specify error response format

**Which is Correct?**
- n8n spec (lines 229): "Webhook will still return 200 to prevent Zapier retry storm" (defensive approach)
- Contract (line 55): "retries once" (allows recovery)

These strategies conflict. Retrying increases reliability but risks duplicates. Returning 200 on error is safer but hides problems.

**Required Fix:**
1. Choose ONE error strategy:
   - **Option A** (Defensive): Always return 200, log errors, never retry
   - **Option B** (Retry-based): Retry once on Airtable failure, return 500 if critical
2. Update contract and workflow to match
3. Document what CEO should do if "Database write failed" happens

---

### 7. SLACK NOTIFICATION CONFIGURATION (LOW)

**Status**: WARN
**Severity**: LOW

#### Issue
The n8n spec defines Slack notification for buyers but Airtable table spec doesn't mention this automation.

**n8n Workflow spec (Node 7a, line 261):**
```
**Channel**: `#project-updates` (or configure in credentials)
```

**Airtable Table spec (lines 91-96):**
```
### 1. New Lead Notification
- **Trigger**: When record enters view "New Leads"
- **Action**: Send Slack notification to #leads channel
```

**The Mismatch:**
1. **Different Channels**: n8n sends to `#project-updates`, Airtable sends to `#leads`
2. **Different Triggers**:
   - n8n: Only on "Buyer" (paid products)
   - Airtable: All new leads (both free and paid)
3. **Duplication Risk**: If both are active, CEO gets TWO Slack notifications per buyer

**Required Fix:**
1. Choose ONE Slack notification approach:
   - **Option A**: Use n8n for buyer alerts (#project-updates)
   - **Option B**: Use Airtable for all lead alerts (#leads)
   - **Option C**: Use both, but different channels and triggers
2. Document which is active in production
3. Disable the unused automation to prevent duplication

---

### 8. TIMESTAMP TIMEZONE INCONSISTENCY (LOW)

**Status**: WARN
**Severity**: LOW

#### Issue
The Zapier setup guide and n8n spec use different timestamp sources.

**Zapier Setup Guide (line 171):**
```
| `timestamp` | *[Built-in] Zap Meta Human Now* |
```

**n8n Workflow spec (Node 5a, line 173):**
```
"timestamp": "{{ $json.timestamp || $now }}"
```

**Airtable Table spec (line 26):**
```
| **Timestamp** | Date and time | Include time: Yes<br>Time zone: GMT |
```

**The Issue:**
- Zapier "Zap Meta Human Now" returns timestamp in USER'S local timezone
- n8n `$now` returns current server time
- Airtable expects GMT

**Result:**
Timestamps may be stored in different timezones, causing confusion.

**Required Fix:**
1. Standardize on UTC/GMT for all timestamps
2. Document timezone conversion at each step
3. In Zapier, use "Zap Meta UTC Now" instead of "Human Now"
4. Update n8n to convert any incoming timestamp to GMT before storage

---

### 9. ROI CALCULATOR SPEC GAPS (MEDIUM)

**Status**: WARN
**Severity**: MEDIUM

#### Issue
The ROI Calculator spec is standalone and doesn't integrate with the lead capture system.

**ROI Calculator spec (lines 12-18):**
```
This ROI Calculator is a Google Sheets document that accompanies the Automated Law Firm Blueprint ($97 product).
```

**Missing Integration Points:**
1. No reference to how calculator connects to Stan Store
2. No documentation of how prospects access calculator (is it in Stan Store product?)
3. No tracking of which leads use the calculator
4. No feedback loop: "Did calculator influence purchase decision?"

**Data Model Impact:**
The Stan Store Leads table has no field to track:
- "Did this lead access the calculator?"
- "Which calculator scenario did they use?"
- "Time spent in calculator?"

**Required Fix:**
1. Add optional fields to Airtable table:
   - `Calculator Accessed` (Yes/No)
   - `Calculator Scenario Used` (text)
2. Document how prospect accesses calculator (embed in thank-you page? Email follow-up?)
3. Consider Zapier/n8n integration to set `Calculator Accessed` based on link clicks
4. OR explicitly document that calculator is manual (not tracked in this version)

---

## SPEC-BY-SPEC GRADES

### 1. n8n Workflow Spec
**Grade: C**

**Strengths:**
- Detailed node-by-node configuration
- Clear ASCII connection diagram
- Good error handling explanation

**Weaknesses:**
- Field name capitalization doesn't match Airtable spec (CRITICAL)
- Hardcoded product names instead of dynamic mapping (CRITICAL)
- Assumes `product_type` field exists without explanation (CRITICAL)
- No fallback logic for missing fields

**Action Required:** Rewrite Node 5a/5b Set nodes and Node 4 IF logic before implementation

---

### 2. Zapier Setup Guide
**Grade: B-**

**Strengths:**
- Step-by-step instructions with screenshots
- Good troubleshooting section
- Explains `product_type` derivation clearly

**Weaknesses:**
- `product_type` setup is complex and has a disclaimer asking Builder for help (indicates uncertainty)
- Doesn't specify required Formatter/Filter steps upfront
- Suggests free plan limitations but doesn't recommend paid tier
- Testing checklist assumes specific product names ("Scorecard", "Blueprint")

**Action Required:** Simplify `product_type` setup with pre-built Zap template

---

### 3. Airtable Table Spec
**Grade: B**

**Strengths:**
- Clear field definitions with types
- Good views configuration
- Deduplication strategy documented

**Weaknesses:**
- Allows "Both" and "Unknown" product options that workflow never creates (inconsistent)
- Field names don't match n8n workflow (CRITICAL)
- Slack automation duplicates n8n logic
- Sample test data uses "$297" but Blueprint is "$97" (inconsistent with product pricing)

**Action Required:** Update field names and product mapping logic

---

### 4. Webhook Contract
**Grade: D**

**Strengths:**
- Concise payload example
- Error handling briefly mentioned

**Weaknesses:**
- INCOMPLETE specification
- Doesn't explain how `product_type` is derived (CRITICAL)
- Doesn't explain how webhook handles missing fields (conflicts with n8n spec)
- No explanation of error response format
- No mention of retries or retry logic

**Action Required:** Expand contract to be truly contractual—specify everything n8n will receive

---

### 5. Data Model Spec
**Grade: B**

**Strengths:**
- Clear table structure
- Views documented
- State transitions clear

**Weaknesses:**
- Field names are generic (could cause confusion with n8n camelCase vs Airtable Title Case)
- Product field only allows "Scorecard" and "Blueprint" but "Both" and "Unknown" are in Airtable spec (inconsistent)
- No documentation of how fields get POPULATED (which system writes what)
- Deduplication strategy differs from n8n spec

**Action Required:** Clarify field population responsibility and coordinate with n8n

---

### 6. ROI Calculator Spec
**Grade: B+**

**Strengths:**
- Comprehensive formula documentation
- Practice-area benchmarks provided
- Good instructions for CEO

**Weaknesses:**
- Doesn't integrate with lead capture system
- No tracking mechanism for calculator usage
- Formula testing checklist assumes specific practice area inputs
- Formulas are not tested (expected results given as estimates, not validated)

**Action Required:** Document integration with lead funnel OR explicitly mark as standalone

---

## CRITICAL MISMATCHES (MUST FIX BEFORE LAUNCH)

### MISMATCH #1: Airtable Field Names
**Impact**: BLOCKING - Workflow will fail on record creation
**Affected Specs**: n8n Workflow Spec, Airtable Table Spec, Data Model Spec
**Fix**: Update n8n Set nodes (5a, 5b) to use exact Airtable field names with proper capitalization

**Current (WRONG):**
```javascript
"name": "{{ $json.customer_name }}", // n8n tries to write to field called "name"
```

**Required (CORRECT):**
```javascript
"Name": "{{ $json.customer_name }}", // Match Airtable field name exactly
```

**Validation**: Run test record creation in n8n before CEO activates workflow

---

### MISMATCH #2: Product Type Derivation
**Impact**: BLOCKING - Classification logic will fail if product_type missing
**Affected Specs**: Webhook Contract, n8n Workflow Spec, Zapier Setup Guide
**Fix**: Update contract to specify Zapier Formatter requirement; add fallback to n8n

**Current (RISKY):**
```
Contract says product_type will be in payload
Zapier guide says you must create it with Formatter
n8n assumes it exists with no fallback
```

**Required (SAFE):**
```
1. Contract explicitly states: "Formatter step REQUIRED in Zapier"
2. n8n Workflow Node 4: Add fallback classification based on amount if product_type missing
3. Zapier guide: Make Formatter step the first action (not optional)
```

**Validation**: Test with Zapier test mode to confirm product_type arrives in payload

---

### MISMATCH #3: Product Mapping Logic
**Impact**: HIGH - Workflow breaks if new products added; Airtable spec allows values workflow never creates
**Affected Specs**: n8n Workflow Spec, Airtable Table Spec
**Fix**: Make product mapping dynamic instead of hardcoded

**Current (BRITTLE):**
```javascript
if (product_type == "paid") { product = "Blueprint"; }
if (product_type == "free") { product = "Scorecard"; }
```
(What if customer buys both? What if new product is added?)

**Required (FLEXIBLE):**
```javascript
product = product_name; // Use actual name from Stan Store
// OR add lookup table in n8n to map product_name to category
```

**Validation**: Test with multiple product scenarios before launch

---

## MISSING SPECIFICATIONS

1. **No Integration Testing Spec**: How do Builder/CEO verify the entire flow works?
2. **No Data Validation Spec**: What fields are required vs optional? What happens if email is missing?
3. **No Monitoring/Alerting Spec**: How does CEO know if Zapier stops working?
4. **No Runbook**: What does CEO do when something breaks?
5. **No Rollback Plan**: If Zapier/n8n fails, how do we recover leads?

---

## RECOMMENDATIONS (PRIORITY ORDER)

### P0 (MUST FIX - BLOCKING)
1. **Fix Airtable field names** in n8n Set nodes
2. **Document product_type derivation** as Zapier requirement with fallback in n8n
3. **Update product mapping** to handle multiple/new products

### P1 (SHOULD FIX - HIGH PRIORITY)
4. **Align duplicate detection** across n8n and Airtable (use Email + Event ID)
5. **Clarify error handling** strategy (retry vs. defensive 200 response)
6. **Choose one Slack notification** approach (n8n buyer alerts OR Airtable lead alerts, not both)
7. **Standardize timestamps** to GMT across all systems

### P2 (NICE TO HAVE)
8. **Document ROI Calculator** integration with lead system
9. **Add calculator tracking** to Airtable (optional fields)
10. **Create integration test checklist** for CEO
11. **Write monitoring runbook** for common failure scenarios

---

## SIGN-OFF CHECKLIST

Before CEO implements, verify:

- [ ] n8n field names match Airtable spec exactly (including capitalization)
- [ ] Zapier setup includes mandatory Formatter step for product_type
- [ ] n8n has fallback classification if product_type is missing
- [ ] Product mapping handles multiple/future products (not hardcoded)
- [ ] Duplicate detection uses Email + Event ID (not Event ID alone)
- [ ] Error handling strategy is consistent across specs
- [ ] Only ONE Slack notification automation is active
- [ ] All timestamps standardized to GMT
- [ ] Test record successfully creates in Airtable with correct field values
- [ ] Zapier test sends expected JSON payload with product_type field
- [ ] CEO has access to troubleshooting guides for all failure scenarios

---

## OVERALL ASSESSMENT

**Current State**: READY FOR FIXES (Not ready for production)

**Why Not Production-Ready:**
1. Field name mismatches will cause immediate failures
2. Product type logic is unclear and will fail without Zapier setup steps
3. No fallback if required fields are missing
4. Duplicate detection is weak (single field only)

**Timeline to Fix:**
- P0 items: 2-3 hours (1 person)
- P1 items: 2-4 hours (1 person)
- P2 items: 4-6 hours (1 person)

**Total Effort**: ~8-13 hours before production launch

**Confidence After Fixes**: HIGH (estimated 95% success rate if all P0 & P1 fixed)

---

## DOCUMENT VERSION CONTROL

| Spec Document | Version | Date | Status | Issues |
|---|---|---|---|---|
| n8n-workflow-spec.md | 1.0 | 2026-02-06 | Published | CRITICAL: 3 issues |
| zapier-setup-guide.md | 1.0 | 2026-02-06 | Published | HIGH: 1 issue |
| airtable-table-spec.md | 1.0 | 2026-02-06 | Published | CRITICAL: 1 issue |
| roi-calculator-spec.md | 1.0 | 2026-02-06 | Published | MEDIUM: 2 issues |
| stan-store-zapier-webhook.md | 1.0 | 2026-02-06 | Published | CRITICAL: Incomplete |
| data-model.md | 1.0 | 2026-02-06 | Published | HIGH: 1 issue |

---

## NEXT STEPS

1. **Builder**: Review CRITICAL findings and confirm fixes
2. **CEO**: Do NOT implement until P0 issues resolved
3. **QA**: Retest after fixes applied
4. **Document**: Version bump to 1.1 once changes made

---

**Report Generated**: 2026-02-06
**Report Grade**: C- (Significant integration gaps; fixable but requires focused work)

---

**END OF REPORT**
