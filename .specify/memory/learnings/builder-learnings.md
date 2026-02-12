# Builder - Technical Automation Learnings

## Last Updated: 2026-02-09

*Consolidated from Neo (n8n), Ada (Python), and Rex (Git)*

---

## Critical Mistakes (NEVER REPEAT)

### n8n
- [GLOBAL] Never test workflows with Apify HTTP nodes
- [GLOBAL] Only the user tests n8n workflows
- [2026-02-05] MCP config desync - THREE locations must stay in sync:
  - `~/.mcp.json` (user's master)
  - `~/.claude/.mcp.json` (Claude Code active)
  - `.claude/skills/mcp-client/references/mcp-config.json` (skill)
- [2026-02-06] **Rize webhook payload mismatch**: Workflow expected `session_id`, `duration_seconds`, `category`, `top_apps` but Rize sends `id`, `start_time`/`end_time` (calculate duration), `project_v2.name`, `description`. Always inspect actual webhook payload before building workflows.

### Python
- [GLOBAL] Always check for existing data before database migrations

### Git
- Never force push to main/master without explicit approval
- Never run destructive commands without confirmation

---

## Domain Patterns

### n8n Workflows
- **Workflow Design**: Keep workflows modular and reusable
- **Error Handling**: Always add error branches for critical nodes
- **Webhooks**: Verify webhook URLs before deployment
- **Health Monitoring**: Self-monitoring workflow pattern (n8n calls its own API)
- **Airtable Upsert**: Search by ID → IF exists → Update/Create branches
- **Health Audit Pattern**: Cron → Get Workflows → Loop → Get Executions → Calculate Score → Upsert Airtable → Alert Slack
- **Pattern Extraction**: Mine deprecated workflows for reusable node configurations before archiving

### Python
- **Scripts**: Write modular, testable code
- **Data Processing**: Validate inputs before processing
- **API Integrations**: Handle rate limits and errors gracefully

### Git
- **Branch Strategy**: Feature branches from main, PR to merge
- **PRs**: Keep PRs focused and reviewable
- **CI/CD**: Ensure all checks pass before merge

---

## Quick Reference

### n8n
- MCP Integration: n8n-mcp
- n8n API Key (tinLLC): ends in `E1SQ`
- n8n URL: https://n8n.srv948776.hstgr.cloud
- Workflows Table: `tblYm6SNOu8lcyNTV`
- Total Workflows: 160 (49 active, 111 inactive)
- KPIs: 5+ workflows/week, <5% error rate, 95%+ execution success

### Python
- KPIs: 5+ scripts/week, 80% test coverage

### Git
- KPIs: All PRs managed, 95% CI passes

---

## Integration Gotchas

### n8n
- Rate limits vary by integration
- Webhooks: Test with small payloads first
- Database nodes: Check for existing data before migrations
- **Airtable filterByFormula**: No leading `=`, use `{Field Name}='value'`
- **Airtable Select fields**: Must match exact option values (e.g., 'Success' not 'Never')
- **n8n API credentials**: Must create "n8n API" credential in n8n for self-referencing workflows
- **Table references**: Use table ID (`tblXXX`) not name for reliability

### Python
- APIs: Always implement retry logic
- Data: Validate schema before operations
- Dependencies: Pin versions in requirements.txt

### Git
- GitHub: Check permissions before operations
- CI: Wait for checks to complete before merging
- Branches: Delete merged branches promptly

---

## Common Node Patterns (n8n)
- HTTP Request: Always set timeout
- Set: Use for data transformation
- IF: Keep conditions simple
- Error Trigger: Add to all critical workflows
- **Code Node**: For complex calculations (health scores, aggregations)
- **Split In Batches**: For looping over items with API calls per item
- **Merge**: To rejoin parallel branches after IF node
- **Merge v3.2 for parallel synchronization**: When fan-out creates N parallel branches that must all complete before a downstream node, insert a Merge node with `numberInputs: N` and `mode: "append"`. Connect each branch to a separate input index (0, 1, 2...). NEVER connect multiple parallel branches to the same input index — n8n fires on first arrival, not all arrivals.
- **executeWorkflow v1.3 implicit data passing**: Empty `workflowInputs.value: {}` passes upstream data through implicitly. Only add explicit mappings to rename or filter fields.

---

## Code Standards (Python)
- Type hints for all functions
- Docstrings for public functions
- Tests for critical paths
- Error handling for external calls

---

## Git Safety Rules
- NEVER update git config without approval
- NEVER use --force without explicit request
- NEVER skip hooks without explicit request
- ALWAYS create NEW commits (don't amend unless requested)

---

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

---

## Pattern Library Location
`.specify/patterns/` - Extract reusable patterns here before archiving deprecated workflows

---

## Session Learnings (2026-02-06)

### Rize Session Logger Fix
**Problem:** Workflow was erroring with `'Duration (min)' expects a number but we got 'NaN'`
**Root Cause:** Rize webhook payload structure changed
**Key Pattern:** Always inspect actual webhook payload using execution data before debugging

### Cerebro Legal RAG Customization
- Template vs. Custom Schema Mismatch: Template uses single table, Cerebro requires 3-table design
- Authority-Aware Retrieval: Must implement deterministic reweighting: 70% vector + 20% authority + 10% recency
- Citation Validation Gate (CRITICAL): Legal RAG must NEVER hallucinate citations

## Session Learnings (2026-02-09)

### Haven B-Roll Pipeline Fixes (2 sessions)

**Session 1 — Pre-flight validation fixes:**
- WF-003: Added `resource: "text"` to Gemini node
- WF-004: Upgraded Airtable v2→v2.1, IF v2→v2.2, fixed Drive list operation
- WF-006: Fixed Drive share permissions pattern
- Key pattern: `checkForWorkflowIssues` runs before sub-workflow execution and catches outdated node versions

**Session 2 — Runtime execution fix:**
- WF-003: Added Merge node to synchronize 3 parallel Airtable reads before Code node
- Root cause: parallel branches all connected to same input index 0 — n8n fires on first arrival
- Fix: `n8n-nodes-base.merge` v3.2, mode: `append`, `numberInputs: 3`
- Confirmed: `executeWorkflow` v1.3 passes data implicitly when `workflowInputs.value` is empty

**Error taxonomy for sub-workflows:**
1. Pre-flight validation = node config issues (typeVersion, parameter shapes)
2. Runtime execution = connection topology issues (parallel sync, missing nodes)

### Haven Video Pipeline Workflow Specs (Session 3 — 2026-02-10)

**Scope:** Created 5 specification documents for the complete Haven UGC Video Pipeline:
- `WF-V01-spec.md` — Master Orchestrator (T005-T007): manual trigger, Playbook validation, pipeline recovery state, 4 sub-workflow calls, 4 approval gates (webhook-based resume), error handler with Playbook status update
- `WF-V02-spec.md` — Script Generator (T008-T011): 3 parallel Airtable reads with Merge sync, scene type branching (B-Roll vs Talking Head), Gemini text generation with full system prompt, Scene JSON validation (3 scenes, 24s total, 9:16 check, consistency markers check)
- `WF-V03-spec.md` — Scene Generator (T012-T021, T039-T040): Generic parameterized workflow (scene_number 1/2/3), Gemini image gen with multimodal references, consistency scoring loop (threshold 7/10, max 3 retries), Kie.AI Veo3.1 with callback/polling fallback, ffprobe video validation, Drive upload with public sharing
- `WF-V06-spec.md` — FFMPEG Assembler (T022-T028): 4-input Merge for parallel downloads, ffprobe-based dynamic crossfade offsets, drawtext overlays with text escaping, CRF cascade for size reduction, QA Review placeholder creation, Drew notification
- `T038-font-verification.md` — Font path check deferred to server (spec says Phase 0 confirmed Inter-Bold.ttf)

**Key design decisions:**
- WF-V03 is a SINGLE generic workflow called 3 times with different scene_number — no separate WF-V04/WF-V05
- All parallel reads use Merge v3.2 pattern (never connect multiple branches to same input)
- Approval gates use webhook-based resume ($execution.resumeUrl stored in Airtable record)
- All Airtable nodes use v2.1, all IF nodes use v2.2 with named operators
- Drive share uses `operation: "share"` with `permissionsUi` pattern (not `resource: "permission"`)
- Kie.AI callback has 10-min timeout with GET /jobs/recordInfo fallback

**Patterns reused from neo-learnings:**
- Merge v3.2 for parallel synchronization (critical in WF-V02, WF-V03, WF-V06)
- executeWorkflow v1.3 implicit data passing
- Google Drive search via `resource: "fileFolder"` + `queryString`
- Google Drive share via `operation: "share"` + `permissionsUi`

### Binary Data Preservation Through Code/IF Nodes (Session 4 — 2026-02-10)

**Problem:** Google Drive Upload node fails with `This operation expects the node's input data to contain a binary file 'data', but none was found [item 0]`

**Root Cause:** n8n Code nodes and IF nodes do NOT automatically forward binary data from upstream nodes. When binary-producing nodes (like Gemini image generation) flow through Code → IF → Drive Upload, only JSON survives — binary is silently dropped.

**Fix Pattern — "Restore Binary" Code Node:**
```javascript
// Insert a Code node before any node that needs binary data
// Use $() selector to reach the original binary-producing node
const sourceNode = $('Generate Image with Gemini').first();
if (!sourceNode.binary || !sourceNode.binary.data) {
  throw new Error('No binary data found from source node');
}
return [{
  json: $input.first().json,
  binary: sourceNode.binary
}];
```

**Key insight:** The `$('NodeName')` selector can reach ANY previously executed node in the workflow, regardless of how many nodes sit between. This is the canonical way to recover binary data that was lost through intermediate processing nodes.

**Where this applies:**
- Any flow where binary data (images, files, videos) must survive through Code or IF nodes
- Consistency scoring loops where image binary must reach Drive upload after score evaluation
- Any retry loop where binary-producing nodes feed into logic gates before upload

### Haven Pipeline Spec-to-Live Misalignment Audit & Realignment (2026-02-10)

**Problem:** All three live Haven workflows (WF-001, WF-003, WF-004) were fundamentally misaligned with their specs (WF-V01, WF-V02, WF-V03). Three parallel audits confirmed the live workflows were built with a completely different architecture.

**Critical Misalignments Found:**

| Workflow | Issue | Severity |
|----------|-------|----------|
| WF-003 | 6-8 scenes instead of 3 | CRITICAL |
| WF-003 | "NO avatar, only product shots" instead of Haven avatar | CRITICAL |
| WF-003 | 25-35s duration instead of 24s | CRITICAL |
| WF-003 | Missing consistency markers, negative prompt, 9:16 mandate | CRITICAL |
| WF-003 | Missing video_motion_prompt (needed for Kie.AI) | CRITICAL |
| WF-003 | Wrong scene labels (hook/product_details vs opener/product/close) | MEDIUM |
| WF-003 | Airtable field mapping completely different from spec | MEDIUM |
| WF-004 | Reference images downloaded but NOT connected to Gemini | CRITICAL |
| WF-004 | Generic "product photography" scorer instead of Haven avatar scorer | CRITICAL |
| WF-004 | Missing Consistency Score, QA Status, Generation Prompt fields | MEDIUM |
| WF-001 | ZERO approval gates (spec requires 4 Wait webhook nodes) | CRITICAL |
| WF-001 | Simple IF for Product check instead of full field validation | MEDIUM |
| WF-001 | No recovery state logic for partial runs | MEDIUM |

**Fixes Applied:**

1. **WF-003 Script Generator** (`WpAKeX9wCLWaJcsx`):
   - Replaced Gemini prompt: 3 scenes, Haven avatar with consistency markers, 24s total, video_motion_prompt, scene-specific lighting/camera/expressions, negative prompts, 9:16 mandate
   - Replaced validation: 3 scenes exactly, 24s total, required fields (video_motion_prompt, lighting, camera_angle, mood), 9:16 check, consistency marker check, negative prompt check, label validation
   - Fixed Merge Input Data: added room_name, room_prompt, outfit_description, scene_type, negative_prompt, product_amazon_url
   - Fixed Content Pipeline record: Playbook linked field, Scene JSON, Status "Draft", Hook Text, CTA Text, Music Mood
   - Fixed status update: Playbooks table (not Content Pipeline), "Script Generated"

2. **WF-004 Asset Generator** (`ZPN0W5s5QKWSxxgQ`):
   - Updated Compose Full Prompt: Haven consistency markers prepended, reference image folder context, explicit 9:16 + negative prompt
   - Replaced quality scoring: 5-criteria spec scorer (Product Accuracy, Setting Consistency, Lighting, Composition, Realism) instead of generic scorer
   - Added Airtable fields: Consistency Score, QA Status, Generation Prompt, Scene Number
   - Note: Reference images still text-prompted (n8n Gemini node doesn't support multimodal binary in image generation mode)

3. **WF-001 Orchestrator** (`z9HkSEBkro1H9NSt`):
   - Added G1 approval gate: Store Resume URL in Content Pipeline → Wait webhook → then proceed to scene generation
   - Added G2 approval gate: Store Resume URL per scene → Wait webhook → then loop back for next scene
   - Replaced IF - Product Linked with Validate Playbook Fields (Code node checking Product, Status)
   - Added IF - Playbook Valid with proper routing
   - Added music_mood, hook_text, cta_text passthrough from WF-003 output

**Key Pattern — Spec-Live Drift:**
- When workflows are built iteratively, they drift from spec rapidly
- The prompt is the highest-impact single node — wrong prompt = wrong everything downstream
- Always validate: scene count, duration, required fields, image prompt composition, before running
- Approval gates MUST be added early — without them, bad outputs propagate unchecked

**Still Deferred (Phase D):**
- Kie.AI video generation pipeline in WF-004 (10+ new nodes)
- Video download, ffprobe validation, video upload, Video Clip Asset record
- Airtable Assets table: delete duplicate "Content Pipeline" column (manual Airtable fix needed)

## Session Learnings (2026-02-11)

### BowTie Bullies Phase 1 Setup (T002-T007)

**T002 - Google Drive Folder Structure: COMPLETED**
- Created 155 folders via direct Google Drive REST API (MCP was broken)
- Root: `BowTie Bullies` (ID: `1zN16sMUS_lYmCPwnln9Ey74OZAhchAxn`)
- Episodes folder: `1H74BftFcDoVzY841TAaIDryoz7Kfk91Z`
- 22 episode folders (EP01-EP22) each with 6 subfolders (scripts, audio, images, overlays, video, shorts)
- Pattern: When MCP server writes INFO logs to stdout, it breaks JSON-RPC. Fallback to direct REST API with OAuth2 refresh token

**T003 - ElevenLabs Credential: PARTIALLY VERIFIED**
- Existing usage: BodyCam Bandits workflow (fkQsVHSXf6ueTQ2y) uses HTTP Request with `$vars.ELEVENLABS_API_KEY`
- BLOCKER: n8n `$vars` requires paid license (not available on this instance)
- No native `elevenlabsApi` credential exists
- ACTION: User must create Header Auth credential or embed key in HTTP Request nodes
- BowTie voice ID `rWyjfFeMZ6PxkHqD3wGC` untested (different from BodyCam default `pNInz6obpgDQGcFmaJgB`)

**T004 - Gemini API Credential: VERIFIED**
- Credential: `Google Gemini(PaLM) Api account` (ID: `JbBNLCe83ER3tCwD`)
- Imagen (image gen): Confirmed in Create Image Tool, Edit Image Tool, nano ads machine, Faceless Generator
- Vision (QC scoring): Confirmed in Edit Image Tool (analyze), Image to Video (analyze), nano ads machine (analyze)
- Billing connected (confirmed by name variant)

**T005 - Server Font Installation: DOCUMENTED (needs SSH)**
```bash
# Download from Google Fonts
curl -L "https://fonts.google.com/download?family=Anton" -o /tmp/anton.zip
curl -L "https://fonts.google.com/download?family=Space+Mono" -o /tmp/spacemono.zip
curl -L "https://fonts.google.com/download?family=JetBrains+Mono" -o /tmp/jetbrainsmono.zip

# Install
sudo mkdir -p /usr/local/share/fonts/bowtie
sudo unzip /tmp/anton.zip -d /usr/local/share/fonts/bowtie/
sudo unzip /tmp/spacemono.zip -d /usr/local/share/fonts/bowtie/
sudo unzip /tmp/jetbrainsmono.zip -d /usr/local/share/fonts/bowtie/
sudo fc-cache -fv

# Verify
fc-list | grep -i anton
fc-list | grep -i "space.mono"
fc-list | grep -i jetbrains

# FFMPEG drawtext paths:
# fontfile=/usr/local/share/fonts/bowtie/Anton-Regular.ttf
# fontfile=/usr/local/share/fonts/bowtie/SpaceMono-Regular.ttf
```

**T006 - WhisperX Installation: DOCUMENTED (needs SSH)**
```bash
# Check Python
python3 --version  # must be 3.10+

# Create isolated venv
python3 -m venv /opt/whisperx
source /opt/whisperx/bin/activate

# Install
pip install whisperx torch torchaudio

# Pre-download models (avoids first-run delay)
python3 -c "import whisperx; whisperx.load_model('large-v2', device='cpu', compute_type='int8')"
# wav2vec2 alignment model downloads automatically on first transcribe(language='en')

# Test
python3 -c "import whisperx; print('WhisperX ready')"

# n8n integration: Code node calls /opt/whisperx/bin/python3
# OR create Flask wrapper at localhost:5100
```

**T007 - YouTube OAuth2: DOCUMENTED (needs Google Cloud Console)**
1. Enable YouTube Data API v3 in Google Cloud Console
2. Create OAuth2 Web App credential
3. Redirect URI: `https://n8n.srv948776.hstgr.cloud/rest/oauth2-credential/callback`
4. Scopes: `youtube.upload`, `youtube`
5. In n8n: Create Google OAuth2 credential, paste Client ID + Secret, authorize
6. Quota: 10,000 units/day, 1,600 per upload = max 6 uploads/day

### Infrastructure Gotchas Discovered

**n8n MCP Server Broken**: The `n8n-mcp` package outputs debug/info logs to stdout, which corrupts the JSON-RPC stream. The MCP client fails to parse responses. Workaround: Use n8n REST API directly (`https://n8n.srv948776.hstgr.cloud/api/v1/`).

**n8n REST API Credential Limitation**: GET `/api/v1/credentials` returns "GET method not allowed". Cannot list or verify credentials programmatically. Must inspect workflow nodes to find credential references.

**n8n Variables License Gate**: `$vars` expressions require a paid n8n license. The BodyCam workflow's ElevenLabs integration uses `$vars.ELEVENLABS_API_KEY` which will fail on community edition. BowTie pipeline must use direct credential references or hard-coded values.

**Google Drive MCP Broken**: The `mcp-google-drive` package also writes INFO logs to stdout, breaking JSON-RPC. Direct REST API via OAuth2 refresh token works as fallback.

**Google Drive Folder Creation Rate**: No rate limiting observed when creating 155 folders sequentially via REST API. Brief 1s pauses every 5 episodes as precaution were sufficient.
