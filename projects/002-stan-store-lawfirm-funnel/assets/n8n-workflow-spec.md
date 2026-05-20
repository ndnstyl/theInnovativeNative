# n8n Workflow Specification: Stan Store Lead Capture

**Version**: 1.0
**Date**: 2026-02-06
**Author**: Builder (The Innovative Native LLC)
**Status**: Ready for Implementation

---

## Overview

This workflow receives lead capture events from Stan Store via Zapier webhook, categorizes leads as "Leads" (free product) or "Buyers" (paid product), stores them in Airtable, and sends Slack notifications for new buyers.

**Data Flow**:
```
Stan Store (new customer)
  → Zapier Trigger (New Customer)
  → Zapier Webhooks Action (POST to n8n)
  → n8n Webhook Node
  → Lead Classification
  → Airtable Record Creation
  → Slack Notification (buyers only)
  → Webhook Response
```

---

## Workflow Configuration

**Workflow Name**: `Stan Store Lead Capture`
**Webhook Path**: `/webhook/stan-store-lead`
**HTTP Method**: POST
**Response Mode**: "Last Node" (Respond to Webhook node at end)

---

## Node-by-Node Specification

### Node 1: Webhook (Trigger)

**Node Name**: `Webhook - Stan Store`
**Type**: Webhook (n8n.nodes.base.Webhook)
**HTTP Method**: POST
**Path**: `stan-store-lead`
**Authentication**: None
**Response Mode**: "Last Node Called" (will respond after all processing)
**Response Code**: 200

**Expected Input Payload** (from Zapier):
```json
{
  "customer_name": "Jane Smith",
  "customer_email": "jane@lawfirm.com",
  "product_name": "Automation Readiness Scorecard",
  "product_type": "free",
  "amount": 0,
  "currency": "USD",
  "timestamp": "2026-02-08T14:30:00Z",
  "zapier_event_id": "zap_abc123"
}
```

**Output**: Webhook body passes to next node.

---

### Node 2: IF - Check for Duplicate Event

**Node Name**: `IF - Duplicate Check`
**Type**: IF (n8n.nodes.base.If)
**Purpose**: Prevent duplicate records if Zapier retries the webhook

**Condition**:
- **Mode**: Rules-based
- **Rule 1**:
  - Field: `{{ $json.zapier_event_id }}`
  - Operation: `is not empty`
  - Value: (leave blank)

**Output Branches**:
- **True**: Event ID exists → Continue to Airtable lookup
- **False**: No event ID (should never happen, but failsafe) → Skip duplicate check, proceed to classification

**Next Nodes**:
- True → Node 3 (Airtable Search)
- False → Node 4 (Lead Classification)

---

### Node 3: Airtable - Search for Duplicate Event ID

**Node Name**: `Airtable - Check Duplicate`
**Type**: Airtable (n8n.nodes.Airtable.AirtableV2)
**Operation**: Search Records
**Table**: `Stan Store Leads`

**Filter Configuration**:
- **Field**: `Zapier Event ID`
- **Operator**: `=`
- **Value**: `{{ $json.zapier_event_id }}`

**Options**:
- **Return All**: false
- **Limit**: 1

**Output**: If record found, array with 1 item. If not found, empty array.

**Next Node**: Node 3b (IF - Duplicate Found?)

---

### Node 3b: IF - Duplicate Found?

**Node Name**: `IF - Duplicate Found?`
**Type**: IF (n8n.nodes.base.If)

**Condition**:
- **Mode**: Rules-based
- **Rule 1**:
  - Field: `{{ $json.length }}`
  - Operation: `larger than`
  - Value: `0`

**Output Branches**:
- **True**: Duplicate found → Skip to Node 8 (Respond with existing record)
- **False**: Not a duplicate → Continue to Node 4 (Lead Classification)

---

### Node 4: IF - Lead Classification

**Node Name**: `IF - Check Product Type`
**Type**: IF (n8n.nodes.base.If)
**Purpose**: Classify as "Buyer" (paid product) or "Lead" (free product)

**Condition (Buyer Detection)**:
- **Mode**: Rules-based (Combined with OR)
- **Rule 1**:
  - Field: `{{ $json.product_type }}`
  - Operation: `equals`
  - Value: `paid`
- **Rule 2**:
  - Field: `{{ $json.amount }}`
  - Operation: `larger than`
  - Value: `0`

**Combine Rules**: OR (if either condition is true, it's a buyer)

**Output Branches**:
- **True**: Buyer (paid product) → Node 5a
- **False**: Lead (free product) → Node 5b

---

### Node 5a: Set - Buyer Fields

**Node Name**: `Set - Buyer Fields`
**Type**: Set (n8n.nodes.base.Set)
**Mode**: Manual Mapping

**Fields to Set**:
```javascript
{
  "Name": "{{ $json.customer_name }}",
  "Email": "{{ $json.customer_email }}",
  "Lead Type": "Buyer",
  "Product": "{{ $json.product_name || 'Blueprint' }}",
  "Amount": "{{ $json.amount }}",
  "Source": "Stan Store",
  "Status": "New",
  "Timestamp": "{{ $json.timestamp || $now }}",
  "Zapier Event ID": "{{ $json.zapier_event_id }}"
}
```

**Notes**:
- Field names MUST match Airtable column names exactly (Title Case with spaces)
- Product uses actual product name from Stan Store with "Blueprint" fallback
- Currency removed (Amount field in Airtable is already formatted as USD)

**Next Node**: Node 6 (Airtable Create)

---

### Node 5b: Set - Lead Fields

**Node Name**: `Set - Lead Fields`
**Type**: Set (n8n.nodes.base.Set)
**Mode**: Manual Mapping

**Fields to Set**:
```javascript
{
  "Name": "{{ $json.customer_name }}",
  "Email": "{{ $json.customer_email }}",
  "Lead Type": "Lead",
  "Product": "{{ $json.product_name || 'Scorecard' }}",
  "Amount": 0,
  "Source": "Stan Store",
  "Status": "New",
  "Timestamp": "{{ $json.timestamp || $now }}",
  "Zapier Event ID": "{{ $json.zapier_event_id }}"
}
```

**Next Node**: Node 6 (Airtable Create)

---

### Node 6: Airtable - Create Record

**Node Name**: `Airtable - Create Lead Record`
**Type**: Airtable (n8n.nodes.Airtable.AirtableV2)
**Operation**: Create
**Table**: `Stan Store Leads`

**Field Mappings**:
- **Name**: `{{ $json.name }}`
- **Email**: `{{ $json.email }}`
- **Lead Type**: `{{ $json.lead_type }}`
- **Product**: `{{ $json.product }}`
- **Product Name**: `{{ $json.product_name }}`
- **Amount**: `{{ $json.amount }}`
- **Currency**: `{{ $json.currency }}`
- **Source**: `{{ $json.source }}`
- **Status**: `{{ $json.status }}`
- **Timestamp**: `{{ $json.timestamp }}`
- **Zapier Event ID**: `{{ $json.zapier_event_id }}`

**Error Handling**: If this node fails, the workflow will continue to error output and log to n8n error table. Webhook will still return 200 to prevent Zapier retry storm.

**Output**: Airtable record object with `id` field.

**Next Node**: Node 7 (IF - Is Buyer?)

---

### Node 7: IF - Is Buyer? (Slack Notification Branch)

**Node Name**: `IF - Is Buyer?`
**Type**: IF (n8n.nodes.base.If)
**Purpose**: Only send Slack notification for buyers, not free leads

**Condition**:
- **Mode**: Rules-based
- **Rule 1**:
  - Field: `{{ $json.lead_type }}`
  - Operation: `equals`
  - Value: `Buyer`

**Output Branches**:
- **True**: Buyer → Node 7a (Slack Notification)
- **False**: Lead → Skip to Node 8 (Respond to Webhook)

---

### Node 7a: Slack - Send Buyer Notification

**Node Name**: `Slack - New Buyer Alert`
**Type**: Slack (n8n.nodes.Slack.SlackV2)
**Operation**: Send Message
**Channel**: `#project-updates` (or configure in credentials)

**Message Template**:
```
🎯 New Blueprint Buyer from Stan Store!

Name: {{ $json.name }}
Email: {{ $json.email }}
Product: {{ $json.product_name }}
Amount: ${{ $json.amount }}
Timestamp: {{ $json.timestamp }}

Airtable Record: {{ $json.id }}
```

**Options**:
- **Link Names**: true
- **Send as User**: false (use bot)

**Next Node**: Node 8 (Respond to Webhook)

---

### Node 8: Respond to Webhook

**Node Name**: `Respond to Webhook`
**Type**: Respond to Webhook (n8n.nodes.base.RespondToWebhook)
**Response Code**: 200
**Response Body Type**: JSON

**Response Payload**:
```json
{
  "success": true,
  "record_id": "{{ $json.id }}",
  "lead_type": "{{ $json.lead_type }}",
  "timestamp": "{{ $now }}"
}
```

**Note**: This node will execute even if Airtable or Slack fails (due to error handling), ensuring Zapier always gets a 200 response to prevent retry loops.

---

## Error Handling Strategy

### 1. Airtable Failure
- **Behavior**: If Node 6 (Airtable Create) fails, the error is caught by n8n's error workflow (if configured) or logged to error output.
- **Webhook Response**: Node 8 still executes, returning `{"success": false, "error": "Database write failed"}` with 200 status code.
- **Why**: Prevents Zapier from retrying the same event 20+ times, which would create duplicate records if Airtable recovers mid-retry.

### 2. Slack Failure
- **Behavior**: If Node 7a (Slack) fails, it does not block the webhook response.
- **Fallback**: Manual check of #project-updates channel. Can also set up n8n error workflow to retry Slack notifications.

### 3. Duplicate Events
- **Prevention**: Nodes 2, 3, and 3b check Zapier Event ID against existing records before creating new ones.
- **Behavior**: If duplicate found, skip to Node 8 and return existing record ID.

### 4. Missing Required Fields
- **Behavior**: If `customer_name` or `customer_email` is missing, Airtable Create will fail. Error is logged but webhook still returns 200.
- **Monitoring**: Set up n8n error workflow to alert on missing fields.

---

## Connection Diagram (ASCII)

```
┌─────────────────────┐
│ Webhook - Stan Store│ (Node 1: Receives POST from Zapier)
└──────────┬──────────┘
           │
           v
┌─────────────────────┐
│IF - Duplicate Check │ (Node 2: Event ID exists?)
└──────┬──────────────┘
       │
       ├── TRUE ──────> ┌──────────────────────┐
       │                │Airtable - Check Dup  │ (Node 3: Search for event ID)
       │                └──────┬───────────────┘
       │                       │
       │                       v
       │                ┌──────────────────────┐
       │                │IF - Duplicate Found? │ (Node 3b: Record exists?)
       │                └──────┬───────────────┘
       │                       │
       │                       ├── TRUE ──────> (Skip to Node 8)
       │                       │
       │                       └── FALSE ─────┐
       │                                      │
       └── FALSE ───────────────────────────> │
                                              │
                                              v
                                    ┌─────────────────────┐
                                    │IF - Check Product   │ (Node 4: Paid or Free?)
                                    │     Type            │
                                    └──────┬──────────────┘
                                           │
                       ┌───────────────────┼───────────────────┐
                       │                   │                   │
                   TRUE│                   │FALSE              │
                       v                   v                   │
            ┌──────────────────┐  ┌──────────────────┐        │
            │Set - Buyer Fields│  │Set - Lead Fields │        │
            │(Product=Blueprint│  │(Product=Scorecard│        │
            │ Lead Type=Buyer) │  │ Lead Type=Lead)  │        │
            └────────┬─────────┘  └────────┬─────────┘        │
                     │                     │                   │
                     └──────────┬──────────┘                   │
                                │                              │
                                v                              │
                     ┌─────────────────────┐                   │
                     │Airtable - Create    │ (Node 6: Write to Airtable)
                     │  Lead Record        │                   │
                     └──────────┬──────────┘                   │
                                │                              │
                                v                              │
                     ┌─────────────────────┐                   │
                     │IF - Is Buyer?       │ (Node 7: Check lead type)
                     └──────────┬──────────┘                   │
                                │                              │
                 ┌──────────────┼──────────────┐               │
                 │              │              │               │
             TRUE│              │FALSE         │               │
                 v              v              │               │
      ┌──────────────────┐     │              │               │
      │Slack - New Buyer │     │              │               │
      │     Alert        │     │              │               │
      └────────┬─────────┘     │              │               │
               │               │              │               │
               └───────────────┼──────────────┘               │
                               │                              │
                               v                              │
                    ┌─────────────────────┐                   │
                    │Respond to Webhook   │ <─────────────────┘
                    │  (200 OK + JSON)    │
                    └─────────────────────┘
```

---

## Testing Checklist (For CEO)

**DO NOT test this workflow in n8n directly.** Only the CEO tests workflows.

Once the workflow is built:

1. **Activate the workflow** in n8n and copy the webhook URL
2. **Configure Zapier** using the Zapier Setup Guide (separate deliverable)
3. **Test with Stan Store**:
   - Create a test free product (Scorecard)
   - Create a test paid product (Blueprint, $97)
   - Purchase each product (or use Zapier test mode)
4. **Verify in Airtable**:
   - Free product → `Lead Type = Lead`, `Product = Scorecard`
   - Paid product → `Lead Type = Buyer`, `Product = Blueprint`
   - No duplicate records for same `Zapier Event ID`
5. **Verify in Slack**:
   - Only paid products trigger #project-updates notification
   - Free products do NOT trigger Slack
6. **Test error handling**:
   - Temporarily disable Airtable connection → Webhook should still return 200
   - Check n8n error logs for failed record creation

---

## Airtable Schema Requirements

The workflow expects the following table structure in Airtable:

**Table Name**: `Stan Store Leads`

**Fields**:
| Field Name         | Field Type       | Notes                                    |
|--------------------|------------------|------------------------------------------|
| Name               | Single line text | Customer name from Stan Store            |
| Email              | Email            | Customer email                           |
| Lead Type          | Single select    | Options: "Lead", "Buyer"                 |
| Product            | Single select    | Options: "Scorecard", "Blueprint"        |
| Product Name       | Single line text | Original product name from Stan Store    |
| Amount             | Number           | Purchase amount (0 for free products)    |
| Currency           | Single line text | Default: "USD"                           |
| Source             | Single line text | Always "Stan Store"                      |
| Status             | Single select    | Options: "New", "Contacted", "Converted" |
| Timestamp          | Date & time      | Event timestamp from Zapier              |
| Zapier Event ID    | Single line text | For deduplication                        |

**Note**: Create this table before activating the workflow. The workflow will fail if the table or fields don't exist.

---

## Maintenance Notes

### When to Update This Workflow

1. **Stan Store adds new product types** → Update Node 4 classification logic
2. **Airtable schema changes** → Update Node 6 field mappings
3. **Slack channel changes** → Update Node 7a channel configuration
4. **Zapier payload changes** → Update Node 1 expected input and all downstream references

### Monitoring Recommendations

- **Set up n8n error workflow** to catch Airtable write failures
- **Weekly check**: Review Airtable for records with Status = "New" older than 7 days
- **Monthly audit**: Compare Stan Store customer count vs. Airtable record count for discrepancies

---

## Version History

| Version | Date       | Changes                                      |
|---------|------------|----------------------------------------------|
| 1.0     | 2026-02-06 | Initial specification (Builder)              |

---

**End of Specification**
