---
name: airtable-checkbox-webhook
description: |
  Pattern for triggering n8n workflows from Airtable checkbox fields.
  Covers: Airtable Automation script, n8n webhook router, status-based
  dispatch, auto-uncheck, and the full wiring between Airtable and n8n.
triggers:
  - "airtable checkbox webhook"
  - "airtable webhook trigger"
  - "checkbox trigger n8n"
  - "airtable automation webhook"
  - "run next stage"
---

# Airtable Checkbox → n8n Webhook Activation

## Pattern Overview

A single checkbox field in an Airtable table triggers an n8n workflow via webhook. The user clicks a checkbox, an Airtable Automation fires a POST request to an n8n webhook, and the workflow processes the record. The checkbox auto-unchecks after triggering.

This pattern is used when:
- Users want to trigger automation from within Airtable (no need to open n8n)
- A status-based pipeline needs manual gates between stages
- Multiple workflows need dispatching from a single trigger point

## Architecture

```
Airtable Table
  └─ Checkbox field: "Run Next Stage"
  └─ Status field: determines which workflow runs
        │
        ▼ (Airtable Automation: when checkbox = true)
        │
  POST /webhook/{router-path}
  Body: { recordId, status, ...fields }
        │
        ▼
[n8n Router Workflow]
  1. Extract payload from $json.body
  2. Uncheck the checkbox via Airtable API (immediate visual feedback)
  3. Switch on Status field → dispatch to correct stage workflow
  4. Stage workflows use webhook triggers (not manual triggers)
```

## Implementation Checklist

### 1. Airtable Schema

Add a checkbox field to the trigger table:

```bash
curl -X POST "https://api.airtable.com/v0/meta/bases/{BASE_ID}/tables/{TABLE_ID}/fields" \
  -H "Authorization: Bearer {AIRTABLE_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"name":"Run Next Stage","type":"checkbox","options":{"color":"greenBright","icon":"check"}}'
```

**IMPORTANT**: Checkbox fields require `options` with `color` and `icon`. Without these, the API returns `INVALID_FIELD_TYPE_OPTIONS_FOR_CREATE`.

### 2. n8n Router Workflow

Create a webhook-triggered workflow that:

**Webhook Trigger node:**
```json
{
  "type": "n8n-nodes-base.webhook",
  "parameters": {
    "httpMethod": "POST",
    "path": "{router-path}",
    "responseMode": "lastNode",
    "options": {}
  },
  "typeVersion": 2
}
```

**Extract Payload (Code node):**
```javascript
const body = $json.body || $json;
const recordId = body.recordId || '';
const status = body.status || '';
if (!recordId) throw new Error('Missing recordId');
return [{ json: { recordId, status, ...body } }];
```

**Uncheck Box (Airtable node):**
- Operation: `update`
- ID: `={{ $json.recordId }}`
- Set checkbox field to `false`

**Switch node:**
- Route by `$json.status` to different HTTP Request nodes
- Each output calls a different stage workflow's webhook

### 3. Stage Workflows — Webhook Triggers

Replace `n8n-nodes-base.manualTrigger` with `n8n-nodes-base.webhook`:

```json
{
  "type": "n8n-nodes-base.webhook",
  "parameters": {
    "httpMethod": "POST",
    "path": "{stage-path}",
    "responseMode": "lastNode",
    "options": {}
  },
  "typeVersion": 2
}
```

Update the first Airtable node to fetch by record ID from webhook payload:
- Change operation from `search` to `get`
- Set ID: `={{ $json.body ? $json.body.recordId : '' }}`

**IMPORTANT**: Workflows must be **activated** for webhook triggers to listen. Inactive workflows do not respond to webhook requests.

### 4. Airtable Automation Script

In Airtable UI → Automations → New Automation:

**Trigger**: When record matches conditions → checkbox field = `true`

**Action**: Run a script with input variables:

```javascript
let config = input.config();

let response = await fetch('https://{N8N_HOST}/webhook/{router-path}', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        recordId: config.recordId,
        projectName: config.projectName,
        status: config.status
        // ... add any other fields needed by your workflows
    })
});

let result = await response.text();
console.log('Webhook response:', result);
```

**Input variables** (configured in Airtable UI):
- `recordId` → Record ID (built-in)
- `projectName` → field value
- `status` → field value
- (add more as needed)

## Key Gotchas

| Issue | Fix |
|-------|-----|
| Checkbox field creation fails | Must include `options: {color, icon}` in API call |
| Webhook doesn't respond | Workflow must be **activated** (not just deployed) |
| `$json.body` is undefined | Data arrives under `$json.body.*` when sent via HTTP POST to webhook |
| Airtable Automation doesn't fire | Automation must be toggled ON; test with a manual checkbox click |
| Stage workflow receives empty data | Router must forward `recordId` in the POST body to stage webhook |
| Checkbox stays checked | Router must uncheck via Airtable update node BEFORE dispatching |

## Live Example: THT Pipeline

| Component | ID/Path |
|-----------|---------|
| Airtable Base | `appCOlvJdsSeh0QPe` |
| Projects Table | `tbl4JgciFENe184jo` |
| Checkbox Field | `Run Next Stage` (`fld3E3V03Bge7hQFf`) |
| Router Workflow | `6pvw5BJ2zXSwnFBh` → `/webhook/tht-router` |
| PROMPT Workflow | `WvF8lWezmwO7yODa` → `/webhook/tht-prompt` |
| IMAGE Workflow | `wjF3eJbpbfYXZZbT` → `/webhook/tht-image` |
| VIDEO Workflow | `BefCfx7WAzEfXT2v` → `/webhook/tht-video` |
| REEL Workflow | `5yEPYq626Kv6lDt6` → `/webhook/tht-reel` |

## Status Routing Map

```
structure_selected  → WF-THT-PROMPT  → prompts_generated
prompts_approved    → WF-THT-IMAGE   → images_generated
images_approved     → WF-THT-VIDEO   → videos_generated
videos_approved     → WF-THT-REEL    → reel_assembled
```
