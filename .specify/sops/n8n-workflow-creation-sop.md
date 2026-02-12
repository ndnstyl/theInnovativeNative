# SOP: n8n Workflow Creation

**Owner**: Neo (n8n Workflows)
**Version**: 1.0
**Created**: 2026-02-05
**Last Updated**: 2026-02-05

---

## Purpose
Standard operating procedure for creating, documenting, and deploying n8n workflows.

---

## Pre-Creation Checklist

### 1. Requirements Gathering
- [ ] Clear description of what the workflow should do
- [ ] Identify trigger type: Cron, Webhook, Manual, Event
- [ ] List required integrations (Airtable, Slack, APIs, etc.)
- [ ] Define success criteria and expected outputs
- [ ] Identify error handling requirements

### 2. Check for Existing Patterns
- [ ] Review `.specify/patterns/` for reusable components
- [ ] Check existing workflows for similar logic (don't reinvent)
- [ ] Reference `neo-learnings.md` for gotchas

### 3. Verify Credentials
Required credentials must exist in n8n before building:
- [ ] n8n API (for self-referencing workflows)
- [ ] Airtable API Token
- [ ] Slack API (if alerting)
- [ ] Any other required service credentials

---

## Workflow Creation Process

### Step 1: Create Feature Spec
Location: `.specify/features/<workflow-name>/`

```
.specify/features/<workflow-name>/
├── spec.md      # Requirements and success criteria
├── plan.md      # Implementation approach
├── tasks.md     # Task breakdown
└── <name>.json  # Workflow JSON (exportable)
```

### Step 2: Build Workflow JSON Structure
Start with this template:

```json
{
  "name": "workflow-name",
  "nodes": [],
  "connections": {},
  "settings": {
    "executionOrder": "v1",
    "saveManualExecutions": true
  },
  "tags": ["category", "project"],
  "triggerCount": 1
}
```

### Step 3: Add Nodes in Order

1. **Trigger Node** (always first)
   - Schedule Trigger for cron jobs
   - Webhook for external triggers
   - Manual Trigger for on-demand

2. **Data Retrieval Nodes**
   - API calls, database queries
   - Always set timeouts on HTTP requests

3. **Processing Nodes**
   - Code nodes for complex logic
   - Set nodes for simple transforms
   - IF nodes for branching

4. **Output Nodes**
   - Airtable create/update
   - Slack notifications
   - Email, webhooks, etc.

5. **Error Handling**
   - Add Error Trigger node
   - Route errors to monitoring

### Step 4: Airtable Integration Patterns

**Search for existing record:**
```json
{
  "operation": "search",
  "application": "appTO7OCRB2XbAlak",
  "table": "tblXXXXXXX",
  "filterByFormula": "{Field Name}='{{ $json.value }}'"
}
```
⚠️ No leading `=` in filterByFormula!

**Upsert Pattern:**
```
Search → IF (exists) → Update / Create
```

**Field Mappings:**
- Use table ID (`tblXXX`) not table name
- Select fields must match exact options
- Percent fields: divide by 100 (0.95 not 95)
- DateTime: ISO format

### Step 5: Slack Alert Pattern

**Red Alerts (Critical):** → `#cerebro-alerts`
**Yellow Alerts (Warning):** → `#project-updates`
**Green (Success):** → No alert needed

```json
{
  "select": "channel",
  "channelId": {
    "__rl": true,
    "value": "#cerebro-alerts",
    "mode": "name"
  },
  "text": "={{ $json.message }}"
}
```

---

## Deployment Checklist

### Before Import
- [ ] JSON syntax validated
- [ ] All credential IDs are placeholders (will set in UI)
- [ ] Node positions don't overlap
- [ ] Connections are complete

### Import Process
1. Open n8n: https://n8n.srv948776.hstgr.cloud
2. Workflows → Import from File
3. Select JSON file
4. Review imported workflow

### After Import
- [ ] Update all credential references to actual credentials
- [ ] Verify Airtable table IDs are correct
- [ ] Verify Slack channel names exist
- [ ] Test with Manual Trigger first
- [ ] Check output at each node

### Activation
- [ ] All tests pass
- [ ] Error handling verified
- [ ] Activate workflow
- [ ] Verify trigger (cron timing, webhook URL)

---

## Documentation Requirements

### 1. Update Airtable Workflows Table
After creating any workflow, add record to Workflows table (`tblYm6SNOu8lcyNTV`):
- n8n Workflow ID
- Workflow Name
- Status (Active/Inactive/Draft)
- Trigger Type
- Description

### 2. Extract Reusable Patterns
If the workflow contains reusable logic:
1. Document in `.specify/patterns/<category>/`
2. Include exportable JSON snippet
3. Note any dependencies

### 3. Update Neo Learnings
Add to `.specify/memory/learnings/neo-learnings.md`:
- New gotchas discovered
- Successful approaches
- Integration quirks

---

## Common Gotchas

| Issue | Solution |
|-------|----------|
| Airtable "field not found" | Use exact field name, check case |
| Airtable "invalid option" | Select field values must match exactly |
| filterByFormula fails | Remove leading `=`, use `{Field}='value'` |
| n8n API unauthorized | Check credential, regenerate if needed |
| Slack channel not found | Use `#channel-name` format with mode: "name" |
| Loop not working | Use Split In Batches with correct batch size |
| Code node errors | Check $input.all() vs $input.first() |

---

## Health Monitoring Pattern

For self-monitoring workflows (Neo's specialty):

```
Schedule (6am)
  → Get All Workflows (n8n API)
  → Loop Over Each
    → Get Executions
    → Calculate Health Score
    → Upsert to Airtable
  → Aggregate Results
  → IF Red → Slack #cerebro-alerts
  → IF Yellow → Slack #project-updates
```

Health Score Formula:
```
Health = (Success_Rate * 0.6) + (Recency * 0.2) + (Error_Severity * 0.2)
```

---

## References

- Neo SKILL: `.claude/skills/workers/neo-n8n/SKILL.md`
- Neo Learnings: `.specify/memory/learnings/neo-learnings.md`
- Pattern Library: `.specify/patterns/`
- n8n API Docs: https://docs.n8n.io/api/
- Airtable API: https://airtable.com/developers/web/api

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-05 | Initial SOP created |
