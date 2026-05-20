# Airtable Automation Setup — Run Next Stage

## What This Does

Click the "Run Next Stage" checkbox on any THT project row. Airtable fires a webhook to n8n. The router reads the project's current Status and dispatches to the correct stage workflow. The checkbox auto-unchecks.

## Setup Steps

### 1. Open Automations

In Airtable, go to your **Iconic Brand Timelapse** base → **THT Projects** table → click **Automations** (top-right).

### 2. Create New Automation

- Name: `THT — Run Next Stage`
- Trigger: **When a record matches conditions**
  - Table: `THT Projects`
  - Condition: `Run Next Stage` is `checked`

### 3. Add Action: Run a Script

Choose **Run a script** as the action.

**Input configuration** (click "Add an input variable" for each):

| Variable Name | Value |
|---------------|-------|
| `recordId` | Record ID (from trigger) |
| `projectName` | Project Name (from trigger) |
| `brandName` | Brand Name (from trigger) |
| `brandConcept` | Brand Concept (from trigger) |
| `status` | Status (from trigger) |

**Script:**

```javascript
let config = input.config();

let response = await fetch('https://n8n.srv948776.hstgr.cloud/webhook/tht-router', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        recordId: config.recordId,
        projectName: config.projectName,
        brandName: config.brandName,
        brandConcept: config.brandConcept,
        status: config.status
    })
});

let result = await response.text();
console.log('Webhook response:', result);
```

### 4. Test

1. Pick any project with Status = `structure_selected`
2. Check the "Run Next Stage" checkbox
3. Watch: checkbox should auto-uncheck within seconds
4. Check n8n execution log — should see WF-THT-ROUTER dispatch to WF-THT-PROMPT

### 5. Enable Automation

Toggle the automation ON (top-right switch).

## Status → Workflow Routing

| Current Status | Dispatches To | Next Status |
|----------------|---------------|-------------|
| `structure_selected` | WF-THT-PROMPT | `prompts_generating` → `prompts_generated` |
| `prompts_approved` | WF-THT-IMAGE | `images_generating` → `images_generated` |
| `images_approved` | WF-THT-VIDEO | `videos_generating` → `videos_generated` |
| `videos_approved` | WF-THT-REEL | `reel_assembling` → `reel_assembled` |

## Workflow IDs

| Workflow | ID | Webhook Path |
|----------|----|-------------|
| WF-THT-ROUTER | `6pvw5BJ2zXSwnFBh` | `/webhook/tht-router` |
| WF-THT-PROMPT | `WvF8lWezmwO7yODa` | `/webhook/tht-prompt` |
| WF-THT-IMAGE | `wjF3eJbpbfYXZZbT` | `/webhook/tht-image` |
| WF-THT-VIDEO | `BefCfx7WAzEfXT2v` | `/webhook/tht-video` |
| WF-THT-REEL | `5yEPYq626Kv6lDt6` | `/webhook/tht-reel` |
