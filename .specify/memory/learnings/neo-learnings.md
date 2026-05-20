# Neo - n8n Workflows Learnings

## Last Updated: 2026-02-09 (Haven B-Roll Pipeline Sub-Workflow Fixes)

## Critical Mistakes (NEVER REPEAT)
- [GLOBAL] Never test workflows with Apify HTTP nodes
- [GLOBAL] Only the user tests n8n workflows
- [2026-02-05] MCP config desync - THREE locations must stay in sync:
- [2026-02-06] **Rize webhook payload mismatch**: Workflow expected `session_id`, `duration_seconds`, `category`, `top_apps` but Rize sends `id`, `start_time`/`end_time` (calculate duration), `project_v2.name`, `description`. Always inspect actual webhook payload before building workflows.
  - `~/.mcp.json` (user's master)
  - `~/.claude/.mcp.json` (Claude Code active)
  - `.claude/skills/mcp-client/references/mcp-config.json` (skill)

## Domain Patterns
- **Workflow Design**: Keep workflows modular and reusable
- **Error Handling**: Always add error branches for critical nodes
- **Webhooks**: Verify webhook URLs before deployment
- **Health Monitoring**: Self-monitoring workflow pattern (n8n calls its own API)
- **Airtable Upsert**: Search by ID → IF exists → Update/Create branches

## Quick Reference
- MCP Integration: n8n-mcp
- Reports to: Drew (routed through project leads)
- KPIs: 5+ workflows/week, <5% error rate, 95%+ execution success
- n8n API Key (tinLLC): ends in `E1SQ`
- n8n URL: https://n8n.srv948776.hstgr.cloud
- Workflows Table: `tblYm6SNOu8lcyNTV`
- Total Workflows: 160 (49 active, 111 inactive)

## Integration Gotchas
- n8n: Rate limits vary by integration
- Webhooks: Test with small payloads first
- Database nodes: Check for existing data before migrations
- **Airtable filterByFormula**: No leading `=`, use `{Field Name}='value'`
- **Airtable Select fields**: Must match exact option values (e.g., 'Success' not 'Never')
- **n8n API credentials**: Must create "n8n API" credential in n8n for self-referencing workflows
- **Table references**: Use table ID (`tblXXX`) not name for reliability

## Successful Approaches
- **Health Audit Pattern**: Cron → Get Workflows → Loop → Get Executions → Calculate Score → Upsert Airtable → Alert Slack
- **Pattern Extraction**: Mine deprecated workflows for reusable node configurations before archiving

## Common Node Patterns
- HTTP Request: Always set timeout
- Set: Use for data transformation
- IF: Keep conditions simple
- Error Trigger: Add to all critical workflows
- **Code Node**: For complex calculations (health scores, aggregations)
- **Split In Batches**: For looping over items with API calls per item
- **Merge**: To rejoin parallel branches after IF node
- **Google Drive v3 List**: Use `resource: "fileFolder"` + `searchMethod: "query"` + `queryString`. NEVER use `operation: "list"` — it's broken on this server
- **Google Drive v3 Share**: Use `operation: "share"` + `permissionsUi.permissionsValues`. NEVER use `resource: "permission"` — it's non-standard
- **Google Drive v3 Upload**: No explicit operation needed (default is upload). Set `name`, `driveId`, `folderId`
- **IF v2.2**: Operator needs `name` field with pattern `filter.operator.<operation>` (e.g., `filter.operator.true`, `filter.operator.equals`)
- **Airtable v2.1**: Always use v2.1 for new workflows, v2 may cause validation failures
- **googleGemini text gen**: Default resource (no `resource` field) works for text generation. `resource: "image"` for images, `resource: "video"` for video

## Workflow Categories (160 total)
| Category | Count | Priority |
|----------|-------|----------|
| FFmpeg/Video | 31 | Tier 1-2 (patterns) |
| Enrichment | 17 | Tier 2 (patterns) |
| Social Publishing | 11 | Tier 1 |
| Graphics | 9 | Tier 1 |
| RAG/AI Agents | 27 | Tier 1 |
| CRM/Pipeline | 9 | Tier 2 |
| Sync/ETL | 4 | Tier 2 |
| Other | 50+ | Tier 3 |

## Pattern Library Location
`.specify/patterns/` - Extract reusable patterns here before archiving deprecated workflows

## Session Learnings (2026-02-05)

### Spec Kit Implementation Complete
- Full spec kit created at `specs/001-neo-workflow-management/`
- 52 tasks generated across 8 phases
- MVP scope: 24 tasks (Phases 1-4)

### Patterns Extracted (4 of 20 target)
1. `ffmpeg/bodycam-video-processing.md` - Multi-stage video pipeline
2. `enrichment/uk-local-business-enrichment.md` - Batch data enrichment
3. `social/crypto-social-distribution.md` - Image distribution
4. `graphics/create-image-tool.md` - AI image generation

### SOPs Created
1. `drew-oversight-sop.md` - Drew's daily/weekly oversight checklist
2. `workflow-categorization-sop.md` - Priority tier and category criteria

### Airtable Schema Updates
- Added `Priority Tier` field (Single Select: 1, 2, 3)
- Added `Category` field (Single Select: Project, Universal, Experimental, Deprecated)

### Workflow Inventory
- Total workflows: 161 (was 160)
- Active: 49, Inactive: 112
- Tier 1 candidates: ~20 (Rize, Nano/Banano, Core tools)
- Tier 2 candidates: ~40 (GovCon, UK Local Services, BodyCam)
- Tier 3 candidates: ~100 (Experimental, deprecated without patterns)

### Pending User Actions
1. Import `daily-workflow-health-audit.json` to n8n
2. Configure credentials (n8n API, Airtable, Slack)
3. Test manual execution
4. Create 6 Airtable views per `drew-oversight-sop.md`
5. Activate 6 AM cron trigger

## Session Learnings (2026-02-06)

### Rize Session Logger Fix
**Problem:** Workflow was erroring with `'Duration (min)' expects a number but we got 'NaN'`

**Root Cause:** Rize webhook payload structure changed:
- OLD expected: `session_id`, `duration_seconds`, `category`, `top_apps`
- NEW actual: `id`, `start_time`, `end_time`, `project_v2`, `description`, `assignee`

**Fix Applied:**
1. Updated "Map Fields" node to use correct field paths:
   - `Session ID` → `$json.body.data.id`
   - `Duration (min)` → Calculate from `(end_time - start_time) / 60000`
   - `Category` → `$json.body.data.project_v2.name`
   - `Description` → `$json.body.data.description`
   - Added `Event Type` and `Assignee` fields
2. Added safety: `ignoreConversionErrors: true` option
3. Added missing Airtable fields: `Event Type`, `Assignee`

**Key Pattern:** Always inspect actual webhook payload using execution data before debugging - the payload structure may have changed from what was originally documented.

### Rize Workflow IDs Reference
| Workflow | ID | Status |
|----------|-----|--------|
| Rize Session Logger | iLxScC9EAcEfh0HP | Active |
| Rize Weekly Time Report | AgHgjEaeCoVjXRS9 | Active |

### Cerebro Legal RAG Customization Spec

**Context:** Analyzed Cole Medin's RAG AI Agent Template V4 for legal-specific customization.

**Key Patterns Discovered:**

1. **Template vs. Custom Schema Mismatch**
   - Template uses single `documents_pg` table with JSONB metadata
   - Cerebro requires 3-table design: `documents` → `chunks` → `embeddings`
   - n8n pgvector node won't work directly; need custom Postgres queries

2. **Authority-Aware Retrieval Pattern**
   - Standard RAG reranker (Cohere) doesn't account for legal authority hierarchy
   - Must implement deterministic reweighting: 70% vector + 20% authority + 10% recency
   - Cross-encoder reranking comes AFTER authority-aware reweighting

3. **Citation Validation Gate** (CRITICAL)
   - Legal RAG must NEVER hallucinate citations
   - Every citation in response must be validated against `documents` table
   - Use `validate_citations()` Postgres function before synthesis

4. **Practice Area Classification** (Deterministic)
   - No fuzzy matching - hard-coded keyword triggers
   - Routes to partitioned vector indexes for performance
   - Unsupported queries get explicit rejection message

5. **Embedding Model Alignment**
   - Template uses Gemini (768d) → Cerebro uses OpenAI text-embedding-3-large (3072d)
   - Schema already configured for 3072d; workflow must match

**Spec Location:** `/Users/makwa/theinnovativenative/law_firm_RAG/scripts/n8n-customization-spec.md`

**Blockers:**
- Supabase project not yet created
- No demo data ingested
- Cross-encoder reranker not integrated (using adjusted_score as proxy)

## Session Learnings (2026-02-09)

### Haven B-Roll Pipeline Sub-Workflow Fixes

**Context:** WF-001 Master Orchestrator calls WF-003, WF-004, WF-006 as sub-workflows via `executeWorkflow`. All three had "The workflow has issues and cannot be executed" pre-validation errors.

**Fixes Applied:**

1. **WF-003 (Script Generator)** — `WpAKeX9wCLWaJcsx`
   - Added `resource: "text"` to `Gemini - Generate Script` node
   - Investigation: Many older workflows work WITHOUT resource field (default = text gen), but newly created workflows may need explicit resource when n8n validates at execution time

2. **WF-004 (Asset Generator)** — `ZPN0W5s5QKWSxxgQ`
   - `Airtable - Read Character Sheet`: v2 → v2.1
   - `IF Proceed or Retry`: v2 → v2.2 (added `filter.operator.true` name, version:2 in options)
   - `Airtable - Create Asset Record`: v2 → v2.1
   - `List Reference Images`: Replaced broken `operation: "list"` with `resource: "fileFolder"` + `searchMethod: "query"` + `queryString` pattern

3. **WF-006 (FFMPEG Assembler)** — `7xT9Ezu6wHHZ0Z3S`
   - `Set Public Permissions`: Replaced non-standard `resource: "permission"` with `operation: "share"` + `permissionsUi` pattern

**Key Discovery:** `checkForWorkflowIssues` runs before sub-workflow execution. It validates ALL nodes using each node type's `getIssues()` method. Common triggers:
- Outdated typeVersion (v2 for Airtable, v2 for IF)
- Non-standard parameter patterns (operation:list for Drive, resource:permission for Drive)
- Missing required fields that newer node versions expect

**Pattern:** When workflows work in the UI but fail as sub-workflows, the issue is likely node version mismatches or deprecated parameter patterns that the validator catches.

### Haven B-Roll Pipeline Runtime Fix (Session 2)

**Problem:** After validation fixes, WF-003 executed but hit runtime error: `Node 'Read Product' hasn't been executed` at line 4 of `Merge Input Data` Code node.

**Root Cause:** Parallel fan-out without synchronization. Three Airtable reads all connected to `Merge Input Data` at input index 0. n8n fires a node as soon as ANY input arrives — first read to complete triggered the Code node before the other two finished.

**Fix:** Added `Wait For All Reads` Merge node (`n8n-nodes-base.merge` v3.2, mode: `append`, `numberInputs: 3`) between reads and Code node. Each read connects to a separate Merge input (0, 1, 2). Merge waits for all three before passing to Code node.

**Pattern (CRITICAL — ADD TO COMMON NODE PATTERNS):**
- **Merge v3.2 for parallel synchronization**: When fan-out creates N parallel branches that must rejoin, insert a Merge node with `numberInputs: N` and `mode: "append"`. Connect each branch to a separate input index.
- **Never connect multiple parallel branches to the same input index** of a downstream node — n8n fires on first arrival, not all arrivals.
- The Code node's `$('Read Product').first().json` named references still work after Merge because the Merge node's execution graph records all upstream node completions.

### WF-001 Execute Workflow Implicit Data Passing

**Finding:** All three `executeWorkflow` v1.3 nodes in WF-001 have empty `workflowInputs: { value: {}, schema: [] }`. Data passes implicitly — the upstream node's output is forwarded directly to the sub-workflow's trigger.

**Rule:** Empty `workflowInputs.value` in `executeWorkflow` v1.3 = implicit passthrough. Only add explicit mappings to rename or filter fields.

### Haven Workflow IDs Reference
| Workflow | ID | Status |
|----------|-----|--------|
| WF-001 Master Orchestrator | z9HkSEBkro1H9NSt | Inactive |
| WF-003 Script Generator | WpAKeX9wCLWaJcsx | Active |
| WF-004 Asset Generator | ZPN0W5s5QKWSxxgQ | Inactive |
| WF-006 FFMPEG Assembler | 7xT9Ezu6wHHZ0Z3S | Active |
