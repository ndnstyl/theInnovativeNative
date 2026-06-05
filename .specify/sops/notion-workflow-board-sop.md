---
type: "sop"
agent: "Builder"
project: null
created: 2026-04-09
updated: 2026-04-09
tags: ["notion", "documentation", "n8n", "deliverables", "api"]
status: "active"
---

# SOP: Notion Workflow Board Creation

**Owner**: Builder (or whoever ships the n8n workflow)
**Version**: 1.0
**Created**: 2026-04-09
**Last Updated**: 2026-04-09

---

## Purpose

Every shipped n8n workflow gets a dedicated Notion documentation board as a **mandatory deliverable**. This SOP defines the exact structure, creation process, and Notion API workarounds so boards are consistent across projects.

**Reference implementation**: [TrendPilot](https://www.notion.so/TrendPilot-2288a944f2ed80f6a35be6e1af9945e5) — all new boards must match this pattern.

---

## When to Use

- **Every workflow shipped** to production/active state in n8n
- Deliverable is due at the same time the workflow is activated
- Internal automations AND client-facing automations both require boards
- If a workflow is a minor tweak (<3 node changes), update an existing board instead of creating new

---

## Prerequisites

- [ ] n8n workflow is built and active
- [ ] Workflow ID known (from n8n URL)
- [ ] Notion integration token available (stored in `~/.claude/.mcp.json` under `notion-mcp.env.NOTION_TOKEN`)
- [ ] Access to the workflow's sticky notes + setup guide content
- [ ] Cover image (optional — users upload manually after creation)

---

## The TrendPilot Pattern (MANDATORY STRUCTURE)

Every board is a **main page + 9-10 child pages**. The main page is a navigation hub, child pages hold the detail.

### Main Page Block Order

| # | Block Type | Content |
|---|---|---|
| 1 | `paragraph` (bold+italic) | Workflow subtitle (e.g., "AI-Powered Multi-Platform Content Automation n8n Workflow") |
| 2 | `divider` | — |
| 3 | `paragraph` (bold) | One-sentence value prop tagline |
| 4 | `paragraph` (italic) | 2-sentence description of what the engine does |
| 5 | `heading_3` | "Jump to sections:" |
| 6 | `link_to_page` × N | Navigation links to each child page **in correct order** (see note below) |
| 7 | `divider` | — |
| 8 | `paragraph` | "Quick Access:" |
| 9 | `paragraph` w/ link | n8n workflow URL |
| 10 | `paragraph` (empty) | Spacer |
| 11 | `callout` (gray, ❤️‍🔥) | Sales/CTA block |

**CRITICAL**: Use `link_to_page` blocks for navigation — NOT `child_page` blocks — because the Notion API cannot reorder `child_page` blocks (see Known Issues).

### Child Pages (Required)

| Order | Page | Icon | Purpose |
|---|---|---|---|
| 1 | Core System Overview | 🤖 | 3 friction points → solution breakdown → tech stack table → business impact |
| 2 | Tools & Prerequisites | 🔧 | Services table + credential checklist |
| 3 | Credential Setup Guide | 🛠️ | Step-by-step auth/token setup |
| 4 | 1️⃣ [First Workflow Section] | 1️⃣ | Overview + Mermaid diagram + numbered H2 step sections |
| 5 | 2️⃣ [Second Section] | 2️⃣ | Same pattern |
| 6 | 3️⃣ [Third Section] | 3️⃣ | Same pattern |
| ... | ... | ... | ... |
| last | ⚠️ Troubleshooting | ⚠️ | Common errors + fixes, one H2 per issue |

### Child Page Internal Structure (each workflow section)

```
H2: Overview
paragraph (bold+italic, centered): Workflow name
divider
paragraph (italic): Description
divider
H2: Architecture Diagram
code (mermaid): Flowchart
divider
H2: 1. [First node name]
bullet list (bold label + value):
  - Node: `NodeName`
  - Type: `node-type`
  - Purpose: description
code (javascript/json): sample payload (if relevant)
divider
H2: 2. [Next node] ...
```

---

## Creation Process

### Step 1: Extract Workflow Content

Pull the full workflow JSON via n8n MCP:

```python
mcp__n8n__n8n_get_workflow(id="<workflow-id>", mode="full")
```

Extract:
- **Workflow name** → main page title
- **Sticky note content** → section labels + setup guide
- **Node names + types + connections** → workflow section pages
- **Code node contents** → embed in "Step details" as code blocks
- **Credentials used** → credential checklist

### Step 2: Search for Existing Board

Before creating, check if a board already exists:

```bash
curl -s -X POST 'https://api.notion.com/v1/search' \
  -H "Authorization: Bearer $NOTION_TOKEN" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  -d '{"query": "<workflow name>", "page_size": 5}'
```

If it exists → update it, don't duplicate.

### Step 3: Create Main Page

```bash
curl -s -X POST 'https://api.notion.com/v1/pages' \
  -H "Authorization: Bearer $NOTION_TOKEN" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  -d '{
    "parent": {"page_id": "<TrendPilot or workspace parent ID>"},
    "icon": {"type": "emoji", "emoji": "🤖"},
    "properties": {
      "title": [{"text": {"content": "<Workflow Name>"}}]
    },
    "children": [<all main-page blocks as JSON>]
  }'
```

### Step 4: Create Each Child Page

For each child page (Core Overview, Tools, Credential Setup, Workflow Sections, Troubleshooting):

```bash
curl -s -X POST 'https://api.notion.com/v1/pages' \
  -H "Authorization: Bearer $NOTION_TOKEN" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  -d '{
    "parent": {"page_id": "<MAIN_PAGE_ID>"},
    "icon": {"type": "emoji", "emoji": "<icon>"},
    "properties": {"title": [{"text": {"content": "<page title>"}}]},
    "children": [<blocks>]
  }'
```

### Step 5: Insert Navigation Links on Main Page

**This is the critical step the first-time creator always gets wrong.** Child pages in the Notion API append to the BOTTOM of the parent's block list and cannot be reordered. So nav must use `link_to_page` blocks, inserted in the correct position via the `after` parameter:

```bash
curl -s -X PATCH "https://api.notion.com/v1/blocks/$MAIN_PAGE/children" \
  -H "Authorization: Bearer $NOTION_TOKEN" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  -d '{
    "after": "<H3_JumpToSections_block_id>",
    "children": [
      {"type": "link_to_page", "link_to_page": {"type": "page_id", "page_id": "<child_page_id>"}},
      {"type": "link_to_page", "link_to_page": {"type": "page_id", "page_id": "<child_page_id>"}},
      ... etc
    ]
  }'
```

Insert ALL navigation links in one append call, in the desired order.

### Step 6: Verify

- [ ] All child pages listed under main page in API response
- [ ] Navigation `link_to_page` blocks appear in correct order on main page
- [ ] All tables rendered correctly (table_rows as children of table blocks)
- [ ] Mermaid diagrams rendered correctly (code block with `language: "mermaid"`)
- [ ] CTA callout uses gray background + correct emoji
- [ ] No duplicate child pages

### Step 7: Hand Off to User

Return:
- **Main page URL** (from API response)
- **List of any manual steps** (cover upload, drag to sidebar root)
- **Log deliverable** in Airtable Deliverables table

---

## Known Issues & Workarounds

### Issue 1: Cannot Create Pages at Workspace Root

**Symptom**: `parent: {"workspace": true}` returns an error from internal integrations.

**Workaround**: Create as child of an existing top-level page (TrendPilot, or a dedicated "Workflow Docs" parent). User drags to sidebar root manually.

### Issue 2: `child_page` Blocks Cannot Be Reordered

**Symptom**: When you create a page via the API, its corresponding `child_page` block is always appended to the END of the parent's block list. There's no way to insert it at a specific position.

**Workaround**: Use `link_to_page` blocks for all navigation. The `child_page` blocks still exist at the bottom but act as a footer/index. If the bottom appearance bothers the user, they can delete those child_page blocks in the Notion UI — the pages remain (linked from the top via `link_to_page`).

### Issue 3: Cannot Upload Local Files for Covers/Images

**Symptom**: Notion API cover field only accepts external URL, not file upload.

**Workaround**: Skip the cover field in API creation. Tell the user to upload manually via Notion UI (click cover area → Upload).

### Issue 4: Cannot Move Pages Between Parents (Internal Integrations)

**Symptom**: `PATCH /pages/{id}` with new `parent` field fails silently or returns unchanged parent.

**Workaround**: Create pages in the correct parent from the start. If wrong parent, archive and recreate.

### Issue 5: Tables Need `table_row` Children

**Symptom**: Creating a `table` block without `children` fails with "table must have at least one row".

**Workaround**: Always include `table_row` blocks as `children` in the `table` block:

```json
{
  "type": "table",
  "table": {
    "table_width": 2,
    "has_column_header": false,
    "has_row_header": false,
    "children": [
      {"type": "table_row", "table_row": {"cells": [[{"text": {"content": "Col1"}}], [{"text": {"content": "Col2"}}]]}},
      {"type": "table_row", "table_row": {"cells": [[{"text": {"content": "A"}}], [{"text": {"content": "B"}}]]}}
    ]
  }
}
```

### Issue 6: 100-Block Batch Limit

**Symptom**: Appending >100 blocks in one call returns 400.

**Workaround**: Chunk into batches of 100 using multiple `append` calls.

### Issue 7: Page Titles with Emojis in Search

**Symptom**: Searching for "1️⃣ Content Generation Pipeline" may not match exactly due to Unicode normalization.

**Workaround**: Search by a unique plain-text substring ("Content Generation Pipeline") instead of the emoji-prefixed title.

---

## Walkthrough: Linking a New Workflow to a Client

When delivering to a client:

1. **Create the board** under a shared parent page they have access to
2. **Share the main page URL** via the standard deliverable channel (Slack, email, Airtable record)
3. **Attach URL to the Deliverables table** in Airtable:
   - Table: `tblnUsXJ2ZHjZGcyu`
   - Name: `<Workflow Name> — Notion Docs`
   - Type: `Documentation`
   - URL: main page URL
4. **Note in the client handoff message** that the cover image and sidebar position are manual steps (due to Notion API limitations)

---

## Quality Checklist (Before Marking Deliverable Complete)

- [ ] Main page has correct title, icon, subtitle, tagline, description
- [ ] "Jump to sections:" H3 exists with `link_to_page` blocks for all child pages (not child_page)
- [ ] All required child pages exist: Core Overview, Tools, Credential Setup, Workflow Sections (1+), Troubleshooting
- [ ] Each workflow section page has: Overview, Mermaid diagram, numbered H2 steps with node details
- [ ] Tech stack table populated with actual nodes/services from workflow JSON
- [ ] Credential checklist matches credentials in workflow JSON
- [ ] Setup guide steps are accurate (pulled from workflow sticky notes if present)
- [ ] Troubleshooting page includes at least 3 real issues (not placeholder content)
- [ ] CTA callout at bottom of main page with gray background
- [ ] Notion search for workflow name returns exactly 1 board (no duplicates)
- [ ] Main page URL logged to Airtable Deliverables table
- [ ] Time + Task logged to Airtable per agent protocol

---

## Related

- [[builder-learnings]] — Notion API patterns and gotchas
- [[n8n-workflow-creation-sop]] — Creating the workflow itself (prerequisite to this SOP)
- [[deliverable-format-requirements]] — Deliverable packaging standards
- Reference board: [TrendPilot](https://www.notion.so/TrendPilot-2288a944f2ed80f6a35be6e1af9945e5)
- First-built board: [LinkedIn & Instagram Automation](https://www.notion.so/LinkedIn-Instagram-Automation-33c8a944f2ed813484bae635b64362af)
