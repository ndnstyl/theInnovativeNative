# Haven - aSliceOfHaven Lead Learnings

## Last Updated: 2026-02-09

## Critical Mistakes (NEVER REPEAT)
- [2026-02-07] **Table ID from audit was stale/wrong**: Initial Airtable audit returned `tblnSJ5OUGKLNuSRj` for Character Sheets but this table didn't actually exist (INVALID_PERMISSIONS error). Always verify table IDs by listing all tables BEFORE attempting reads/writes.
- [2026-02-07] **Airtable linked record field options**: Creating linked record fields with `prefersSingleRecordLink` and/or `isReversed` options causes contradictory API errors. Use minimal options (`linkedTableId` only) — the API auto-fills the rest.
- [2026-02-07] **MCP client requires Python 3.10+**: The `mcp` pip package won't install on older Python. Direct curl to Airtable REST API is more reliable — confirmed in shared-learnings.

## Domain Patterns

### UGC Content Engine Architecture
- **Three-base Airtable architecture**: Haven Main (mission control) + n8n-connected (webhooks) + Viral Trends (research). Separation of concerns prevents mutation of shared resources.
- **Character Sheet system for visual consistency**: Canonical prompts + negative prompts + reference images stored in Airtable. Every Gemini call includes Character Sheet + reference images as multimodal input.
- **Pipeline state in Airtable, not local files**: Drew needs visibility. CEO needs mobile access. Pipeline automation needs API access.

### Brand System Patterns
- **Warm palette for home content**: Cream (#FFF8F0), terracotta (#D4956A), warm brown (#8B6F47). Kitchen/home UGC must feel inviting, NOT the dark neon of TIN parent brand.
- **Inter font for ALL video overlays**: Weight 700-800 for readability on mobile at 9:16.
- **Text shadow mandatory**: 2px 2px 8px rgba(0,0,0,0.6) on all video text for readability regardless of background.

### Avatar Consistency
- **4 reference images established**: Front face, 3/4 profile, full body front, styled outfit. All in `cinema_knowledge/`.
- **Consistency markers for every prompt**: "young woman, mid-20s, warm medium-brown skin, curly/coily brown hair with golden highlights shoulder-length, brown eyes, natural makeup, warm confident expression"
- **Negative prompts critical**: "straight hair, blonde hair, pale skin, blue eyes, heavy makeup, exaggerated expressions, cartoonish, anime style, different person"

### Video Production
- **Ken Burns zoom range**: 1.0x to 1.15x (subtle). Larger zooms look nauseating.
- **Scene duration**: 3-5 seconds per scene for UGC pacing.
- **Music volume**: 0.4 for B-Roll, 0.15 ducked under voice for Talking Head.
- **Caption style**: 2-3 words max per frame, TikTok pop-up style, Inter Bold 44px.

### Content Framing
- Haven is a **home organization enthusiast**, NOT a product expert
- Attribution hooks work: "So I was reorganizing my kitchen and..."
- Always mention price (transparency = trust)
- Feature → Benefit translation: Lead with what it does for the viewer, not what it is

## Quick Reference
- Primary workers: Creative (video), Builder (n8n), Data (Airtable)
- Reports to: Drew
- Project: aSliceOfHaven — UGC Content Engine
- KPIs: 3 videos/week, 80% QA pass rate, 5% engagement, 8+/10 visual consistency
- Brand system: `.claude/skills/pptx-generator/brands/haven/`
- Spec kit: `.specify/features/asliceofhaven/`

### n8n Workflow Architecture (Phase 1 Patterns)
- **Sub-workflow composition**: Use executeWorkflowTrigger + executeWorkflow for composability. Each workflow is independently testable.
- **Gemini node in n8n**: Use `@n8n/n8n-nodes-langchain.googleGemini` v1 with credential `JbBNLCe83ER3tCwD`. Image generation uses `resource: "image"`, vision/analysis uses `operation: "analyze"`.
- **Google Drive upload pattern**: `n8n-nodes-base.googleDrive` v3 with credential `53ssDoT9mG1Dtejj`. After upload, immediately set permissions with a second Drive node.
- **Airtable node pattern**: `n8n-nodes-base.airtable` v2 with credential `YCWFwTIXwnTpVy2y`. Use `__rl` mode for base/table IDs: `{"__rl": true, "value": "ID", "mode": "id"}`.
- **FFMPEG in n8n Code nodes**: Use `require('child_process').execSync(cmd, {timeout: 120000})` inside Code nodes for dynamic commands. More flexible than Execute Command nodes for variable-length pipelines. **Always use the `run()` logging wrapper** to capture commands in `commands_run` output array for execution-level debugging visibility. **Always add a pre-flight validation node** before any Code node that shells out to ffmpeg/ffprobe.
- **Audio optimization**: Pre-compress music to 128kbps MP3, trim to 40s, pre-bake 2s fade in/out before pipeline use. Pattern doc: `.specify/patterns/ffmpeg/audio-optimization.md`.
- **SplitInBatches for sequential scene processing**: Use batchSize=1 to process scenes one at a time (avoids Google API rate limits). Output 0 = done, Output 1 = loop.
- **Quality scoring retry loop**: Gemini Vision scores 1-10, threshold 7. On fail: refine prompt with "Improve consistency" + previous issues. Max 3 attempts. Use IF node to branch proceed vs retry.

## Integration Gotchas
- FFmpeg: Test encoding on sample before batch
- Gemini: Use specific model version, not `latest` — model updates cause visual drift
- ElevenLabs voice ID: `M6ic45wruJGWAxLFEMNK` — stability 0.5, similarity_boost 0.75
- Airtable: Haven Main base is `appWVJhdylvNm07nv` — always check existing schema before changes
- Video output: MP4 H.264, 1080x1920, AAC audio, max 100MB (Instagram limit)
- **NO auto-publishing**: Every video requires Drew QA + CEO human QA

## Successful Approaches
- [2026-02-07] Brand system created from scratch using TIN template structure but with completely different aesthetic (warm vs neon). Reusing file structure from innovative-native brand.
- [2026-02-07] Character Sheet approach with canonical prompts + negative prompts + reference images provides structured foundation for Gemini consistency.
- [2026-02-07] Spec kit (spec.md + plan.md + tasks.md) created for haven-ugc-foundation with 29 tasks across 5 phases.

## Phase Status
| Phase | Description | Status |
|-------|-------------|--------|
| 0A | Brand System | COMPLETE |
| 0B | Airtable Mission Control | COMPLETE (3 tables created, 5 existed, 1 product seeded) |
| 0C | Visual Identity Lock-In | COMPLETE (2 Character Sheets + 4 reference images uploaded + 4 Asset records) |
| 0D | Infrastructure Validation | PARTIAL (Drive folders done, n8n/ElevenLabs/FFMPEG → Builder handoff) |
| 0E | Project Files | COMPLETE |
| 1 | MVP B-Roll Pipeline | COMPLETE (4 workflows deployed, runtime fixes applied 2026-02-09) |
| 2 | Talking Head + Voice | NOT STARTED |
| 3 | Cinematic + QA Loop | NOT STARTED |
| 4 | Trend Automation | NOT STARTED |

## Session Learnings (2026-02-09)

### Runtime Fix: Parallel Airtable Read Synchronization (WF-003)

**Problem:** WF-003 passed n8n pre-flight validation but crashed at runtime with `Node 'Read Product' hasn't been executed` in the `Merge Input Data` Code node.

**Root Cause:** Three parallel Airtable reads (Read Playbook, Read Product, Read Kitchen Character Sheet) all connected to the **same input index 0** of the Code node. When the first read completed, n8n fired the Code node immediately — but the other two reads hadn't finished, so `$('Read Product').first().json` threw a runtime error.

**Fix:** Inserted a **Merge node** (`n8n-nodes-base.merge` v3.2, mode: `append`, `numberInputs: 3`) between the reads and the Code node as a synchronization barrier. Each read connects to a separate Merge input (0, 1, 2). The Merge waits for all three before passing to the Code node.

**Pattern (REUSABLE):** When fan-out creates parallel branches that must rejoin, ALWAYS use a Merge node as a synchronization point. Never connect multiple parallel branches to the same input index of a downstream node — n8n fires nodes as soon as ANY input arrives, not when ALL arrive.

### WF-001 Execute Workflow Data Passing (Confirmed Pattern)

**Finding:** All three Execute Workflow nodes in WF-001 (WF-003, WF-004, WF-006) have `workflowInputs: { value: {}, schema: [], mappingMode: "defineBelow" }` — empty explicit mappings.

**Conclusion:** n8n `executeWorkflow` v1.3 passes upstream data **implicitly** when `workflowInputs.value` is empty. The upstream Code node's output is forwarded directly to the sub-workflow's `Execute Workflow Trigger`. No explicit field mappings needed.

**Rule:** For sub-workflows using `executeWorkflowTrigger` v1.1 + `executeWorkflow` v1.3, empty workflowInputs is valid — data passes through implicitly. Only add explicit mappings if you need to rename or filter fields.

### Sub-Workflow Validation vs Runtime Errors (Taxonomy)

Two classes of n8n sub-workflow errors encountered across 2026-02-09 sessions:

1. **Pre-flight validation errors** ("The workflow has issues and cannot be executed") — caused by outdated node typeVersions, deprecated parameter patterns, or missing required fields. Fixed by upgrading node versions and correcting parameter shapes.

2. **Runtime execution errors** ("Node X hasn't been executed") — caused by incorrect connection topology. Pre-flight validation doesn't check connection logic, only node-level configuration. Must trace data flow manually.

### WF-006 Pre-flight Validation & execSync Logging (2026-02-09)

**Problem:** WF-006 had zero pre-flight validation — if ffmpeg was lost after a container restart, the workflow burned through downloads and API calls before failing at the first ffmpeg command. Also, Code nodes with execSync hide the actual shell commands in n8n execution logs ("Code node ran successfully" — not the actual command).

**Fix 1 — Pre-flight Validation Node ("Validate Environment"):**
Inserted a Code node between Execute Workflow Trigger and Create Temp Directory that checks 7 things in <5 seconds:
1. `ffmpeg -version` — binary exists and responds
2. `ffprobe -version` — binary exists and responds
3. ffmpeg filters: `zoompan`, `xfade`, `drawtext` — required for Ken Burns, Crossfade, Text Overlays
4. Font file: `/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf` — used by Text Overlays
5. `curl` — used for Google Drive downloads
6. Disk space: `/tmp` has >500MB free
7. If ANY check fails, throws immediately with clear error message listing all failures

**Pattern (REUSABLE):** Any sub-workflow that shells out to external binaries should have a pre-flight validation node as its first step after the trigger. Fail fast (<5s) instead of failing slow (after minutes of wasted API calls/downloads).

**Fix 2 — execSync Logging Wrapper:**
Every Code node that runs shell commands now uses a `run()` wrapper:
```javascript
const commands_run = [];
function run(cmd, opts = {}) {
    commands_run.push(cmd);
    return execSync(cmd, { timeout: 120000, stdio: 'pipe', ...opts });
}
// ... use run() instead of execSync() ...
return [{ json: { ...result, commands_run } }];
```
This logs every shell command to the node's output JSON, making n8n execution data show what actually ran. Applied to 8 nodes: Create Temp Directory, Download Scene Images, Save Music to Disk, Ken Burns Per Scene, Crossfade Chain, Text Overlays, Music Mix, Cleanup Temp Files.

**Fix 3 — Font Path Alignment:**
Font check workflow (`R4OrfgtnzmWmSGIy`) was checking `Inter-Bold.ttf` at `/home/node/fonts/`, but Text Overlays uses `DejaVuSans-Bold.ttf` at `/usr/share/fonts/truetype/dejavu/`. Pre-flight validation now checks the correct DejaVuSans path. DejaVuSans is the canonical font for WF-006.
