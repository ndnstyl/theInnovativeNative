---
name: airtable-api
description: |
  Airtable API cookbook for n8n workflows and Python scripts.
  Covers base/table ID registry, field type gotchas, Meta API,
  filterByFormula syntax, and common integration patterns.
triggers:
  - "airtable api"
  - "airtable schema"
  - "airtable field"
  - "filterByFormula"
  - "airtable meta"
---

# Airtable API — Integration Cookbook

## Overview

Reference for Airtable REST API patterns used across all projects. Covers the Meta API for schema operations, record CRUD, and the field-type gotchas that have caused repeated failures.

---

## Base & Table ID Registry

### Haven Content Engine — `appWVJhdylvNm07nv`

| Table | ID | Purpose |
|-------|----|---------|
| Content Pipeline | `tblOsG9I5bk8zVtxg` | Script records, scene JSON, pipeline status |
| Character Sheets | `tbl8pQ9WlCikdesYf` | Avatar canonical prompts, negative prompts |
| Assets | `tblJq7QP7OPFKYzzR` | Generated images/videos, Drive URLs |
| OOTD Looks | `tblUT12noiUZuMBfL` | Outfit-of-the-day pipeline records |
| Playbooks | (linked from Content Pipeline) | Brand/product playbook definitions |

### BowTie Bullies — `appTO7OCRB2XbAlak`

| Table | ID | Purpose |
|-------|----|---------|
| Generated Poses | `tblcqlsc7x8BkULT4` | Character pose images |
| B-Roll Assets | `tblZFXmecddrm4YGD` | Video B-roll clips |
| Thumbnails | `tbl578fcxEG7aOuyJ` | Episode thumbnail images |

### TIN Operations — `appTO7OCRB2XbAlak`

| Table | ID | Purpose |
|-------|----|---------|
| Projects | (check via Meta API) | Project registry |
| Tasks | (check via Meta API) | Task tracking |
| Time Entries | `tbl4FrwRqV02j2TSK` | Agent time logging |
| Deliverables | `tblnUsXJ2ZHjZGcyu` | All deliverables with Drive URLs |
| Agents | (check via Meta API) | Agent roster |

### n8n Credential
- **Airtable PAT (n8n):** Credential ID `YCWFwTIXwnTpVy2y`
- **Airtable PAT (local):** Read from `~/.claude/.mcp.json` → `mcpServers.airtable-mcp.env.AIRTABLE_API_KEY`

---

## Field Type Gotchas

### `multipleAttachments` — Image Preview from URLs

Airtable previews require the direct download URL format:

```json
{
  "Image": [
    { "url": "https://drive.google.com/uc?export=download&id=FILE_ID" }
  ]
}
```

**Common mistakes:**
- Standard Drive URLs (`/file/d/ID/view`) do NOT render previews
- Must be an array of `{url: "..."}` objects, even for a single attachment
- Omitting the array wrapper causes a silent field-write failure

### `singleSelect` — Options Must Exist

Select field values must match existing options exactly (case-sensitive).

**Workaround for new values:** Set `typecast: true` in the API request options. Airtable auto-creates missing select values.

```json
// n8n Airtable node
{
  "options": { "typecast": true }
}
```

**Alternative workaround:** Create a temporary record with the new value + `typecast: true`, then delete the record. The option persists.

### `linkedRecord` — Array of Record IDs

Linked record fields always expect an array, even for single links:

```json
{
  "Content Pipeline": ["recXXXXXXXXXXXXXX"]
}
```

### Formula Fields

- Cannot be written to via API — read-only
- Filter on them with `filterByFormula` but don't include in create/update payloads

---

## filterByFormula Syntax

```
// Exact match
{Status} = "Pending"

// Multiple conditions
AND({Status} = "Pending", {Project} = "Haven")

// Contains
FIND("keyword", {Description}) > 0

// Date comparison
IS_AFTER({Created Date}, "2026-02-01")

// Linked record (check if field is not empty)
{Content Pipeline} != ""

// URL encode when passing as query parameter
filterByFormula=AND(%7BStatus%7D%20%3D%20%22Pending%22)
```

**n8n Airtable node:** Use the `filterByFormula` parameter directly — the node handles URL encoding.

---

## Meta API — Schema Operations

### List All Tables
```
GET https://api.airtable.com/v0/meta/bases/{baseId}/tables
Authorization: Bearer {PAT}
```

### Create a Field
```
POST https://api.airtable.com/v0/meta/bases/{baseId}/tables/{tableId}/fields
Authorization: Bearer {PAT}
Content-Type: application/json

{
  "name": "New Field Name",
  "type": "singleLineText"
}
```

### Update Field Options (Select fields)
```
PATCH https://api.airtable.com/v0/meta/bases/{baseId}/tables/{tableId}/fields/{fieldId}
```

**Note:** May reject `options.choices` updates depending on PAT scope. Use the `typecast: true` workaround instead.

---

## n8n Airtable Node Patterns

### Search with filterByFormula
```json
{
  "operation": "search",
  "application": "appWVJhdylvNm07nv",
  "table": "tblOsG9I5bk8zVtxg",
  "filterByFormula": "{Status} = 'Pending'"
}
```

### Update with matchingColumns
When using `operation: "update"`, you must specify either a record `id` or use `matchingColumns` for upsert:

```json
{
  "operation": "update",
  "application": "appWVJhdylvNm07nv",
  "table": "tblOsG9I5bk8zVtxg",
  "id": "={{ $json.record_id }}",
  "fields": {
    "Status": "Generated"
  }
}
```

### Batch Create (Python)
```python
import requests

url = f"https://api.airtable.com/v0/{base_id}/{table_id}"
headers = {
    "Authorization": f"Bearer {pat}",
    "Content-Type": "application/json"
}

# Max 10 records per batch
records = [{"fields": {...}} for _ in range(10)]
response = requests.post(url, json={"records": records, "typecast": True}, headers=headers)
```

---

## Rate Limits & Retry

| Limit | Value |
|-------|-------|
| Requests per second per base | 5 |
| Records per batch create/update | 10 |
| Records per list request | 100 (use `offset` for pagination) |

**Retry pattern:** On 429 (rate limited), wait 30 seconds and retry. In n8n, use the built-in retry-on-failure with 3 retries and 5-second backoff.

---

## Common Mistakes (from shared-learnings.md)

1. **Field names are case-sensitive** — `"Status"` != `"status"`
2. **Tasks table uses "Title" not "Task Name"** and "Assignee" not "Agent"
3. **`createdTime`/`lastModifiedTime` fields cannot be created via API** — must add via UI
4. **Duplicate table creation** — always `GET /meta/bases/{baseId}/tables` first
5. **Linked record field creation** — use minimal options (`linkedTableId` only). Extra options like `prefersSingleRecordLink` cause API errors
6. **API cannot create Views** — Metadata API can read view metadata but cannot create views programmatically

---

## Related Skills

- **Tab** (`workers/tab-airtable`) — Airtable operations agent
- **Google Drive API** (`infrastructure/gdrive-api`) — For `uc?export=download` URLs in attachment fields
- **Builder** (`workers/builder`) — n8n workflow deployment with Airtable nodes
