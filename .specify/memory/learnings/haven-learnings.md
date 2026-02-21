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
- **4 reference images established**: Front face, 3/4 profile, full body front, styled outfit. Stored in Google Drive Reference Images folder (`1aURPY12WofNfKH2LK2ykqS7sVVcj0-UZ`) and linked in Airtable Character Sheets (`tbl8pQ9WlCikdesYf`).
- **Consistency markers for every prompt**: "young woman, mid-20s, warm medium-brown skin, curly/coily sandy blonde hair with golden highlights shoulder-length, piercing green eyes, very faint cleft chin, full lips, natural makeup, warm confident expression"
- **Negative prompts critical**: "straight hair, pale skin, brown eyes, dark eyes, amber eyes, heavy makeup, exaggerated expressions, cartoonish, anime style, different person"

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
| 0D | Infrastructure Validation | EFFECTIVELY COMPLETE (see 2026-02-18 audit below) |
| 0E | Project Files | COMPLETE |
| 1 | MVP B-Roll Pipeline | COMPLETE (4 workflows deployed, runtime fixes applied 2026-02-09) — **4 CRITICAL BUGS in WF-006** (see audit report) |
| 1.5 | WF-006 Bug Fixes | NOT STARTED — FFMPEG assembly spec written 2026-02-18, waiting for Builder handoff |
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

## Session Learnings (2026-02-18) — Progress Check & Spec Kit Reconciliation

### Spec Kit Reconciliation Decision

**Three competing spec kits existed:**
1. `.specify/features/asliceofhaven/` — Phase 0 Foundation (93% done, ARCHIVED)
2. `.specify/features/haven-video-pipeline/` — Kie.AI Evolution (0/40 tasks, CANONICAL going forward)
3. `projects/003-haven-ugc-broll/specs/` — Original Ken Burns B-Roll (0/70 tasks, DEPRECATED)

**Decision:** `haven-video-pipeline` is the canonical spec kit. It replaces Ken Burns with Kie.AI Veo3.1 video generation. The 70-task Ken Burns spec (#3) had ~55 tasks effectively completed but 0 checked off — a tracking failure from the rapid 2026-02-09 build session.

**Key insight:** The existing Ken Burns workflows (WF-001/003/004/006) should be KEPT as fallback during Kie.AI development. New workflows get new IDs (WF-V01 through WF-V06).

### Phase 0D Infrastructure — Effectively Complete

| Task | Status | Evidence |
|------|--------|----------|
| HAVEN-021 (audit n8n workflows) | EFFECTIVELY DONE | WF-001/003/004/006 were not just audited but REPLACED by new ones. Original workflow IDs `BT2CpVpzW432seZ6` and `m7m9f9Qu5nekiZke` superseded. |
| HAVEN-022 (test ElevenLabs voice) | DEFERRED | Haven pipeline uses Qwen3-TTS (local) not ElevenLabs. Voice ID `M6ic45wruJGWAxLFEMNK` exists but is BowTie-focused. Haven voice needs own reference recording. |
| HAVEN-023 (validate FFMPEG) | EFFECTIVELY DONE | WF-006 pre-flight validation confirms ffmpeg, ffprobe, zoompan, xfade, drawtext, DejaVuSans font all present on n8n server. |
| HAVEN-025 (music tracks) | DONE | 3 optimized tracks already in Drive Music folder: `afternoon-coffee-40s-128k.mp3`, `raspberrymusic-lofi-40s-128k.mp3`, `dreamy-lofi-hiphop-40s-128k.mp3`. Schema map has Drive IDs. |

### Phase 1 Setup Tasks — Partial Satisfaction

Tasks T001 (bedroom/living room prompts) and T002 (rewrite broll-script-prompt.md) are already SATISFIED — the brand-system.md has full room descriptions and the prompt template was rewritten for the 3-scene video structure. T003 (talking-head-script-prompt.md) is SUPERSEDED — T002's rewrite handles both B-Roll and Talking Head via `{{scene_type}}` variable.

**Remaining real work:**
- T004: Add Bedroom/Living Space Character Sheet Airtable records (Data agent, ~30 min)
- T033-T037: Airtable schema additions (Data agent, ~90 min, CEO approval needed for Playbooks table — 6 new fields exceeds 3-field threshold)
- T038: Font resolution — DejaVuSans-Bold.ttf is actual font on server, but spec references Inter-Bold.ttf. Decision: install Inter Bold or update spec.

### WF-006 FFMPEG Assembly Spec Written

FFMPEG assembly spec produced at `projects/003-haven-ugc-broll/specs/ffmpeg-assembly-spec.md` resolving all 4 critical bugs + 5 moderate issues:
- C1: Ken Burns zoom — dynamic formula `0.15 / (duration_seconds * fps)` replaces hardcoded 0.00375
- C2: Font — Inter Bold primary (`/usr/share/fonts/truetype/inter/Inter-Bold.ttf`), DejaVu fallback
- C3: Background box — per-type styling: Hook (shadow only), Caption (#D4956A@0.85), CTA (#2C1810@0.90)
- C4: Scene download — SplitInBatches + Google Drive API node replaces raw curl
- M2: Crossfade — single-pass filter_complex eliminates re-encoding loss
- Per-type font sizes canonized: Hook 64px, Caption 48px, CTA 56px, Subtitle 44px

### Feature 007 (Local AI) — Complements, Doesn't Compete

ComfyUI + Qwen3-TTS is a cost-saving supplement for asset creation, NOT a replacement for the cloud pipeline. No integration path exists yet between local output and n8n pipeline. Blocked on user model downloads from CivitAI.

### Critical Pattern: Task Tracking Discipline

~55 tasks were executed in the 2026-02-09 build session without checking off a single task in any spec kit. This made the progress check significantly harder and created confusion about what's done vs not done. **Rule: Check off tasks AS they're completed, not after.**

## Session Learnings (2026-02-19) — Full Cross-Workflow Audit & Fix

### Root Cause: WF-001 Never Completed End-to-End

After 10 days of incremental deployment (Feb 9-19), WF-001 had never completed a successful run. Every execution hit a different Airtable error. Root cause: **schema mismatches deployed across sessions with no comprehensive validation pass**.

### 5 Critical Mismatches Found & Fixed

| ID | Workflow | Problem | Fix |
|----|----------|---------|-----|
| C1 | WF-001 | Status "Awaiting Script Approval" not valid in Content Pipeline | Added `typecast: true` to node options (auto-creates option on write) |
| C2 | WF-004 | QA Status "Flagged" not valid in Assets table | Changed to "Revision Needed" (valid option) |
| C3 | WF-004 | Field "Generation Prompt" doesn't exist in Assets table | Removed from node mapping |
| C4 | WF-004 | Field "Scene Number" doesn't exist in Assets table | Removed from node mapping |
| C5 | WF-003 | Gemini may return music_mood values not in Airtable select options | Added mapping logic to normalize any Gemini output to valid option |

### Audit Pattern (REUSABLE — ALL PIPELINE PROJECTS)

**Script**: `scripts/003-haven/audit_fix_all_workflows.py`

Pattern for auditing n8n ↔ Airtable alignment:
1. Pull full Airtable schema via Metadata API (`GET /meta/bases/{baseId}/tables`)
2. Pull all workflow JSON via n8n API (`GET /api/v1/workflows/{id}`)
3. For every Airtable node in every workflow:
   - Verify table ID exists in schema
   - Verify every written field name exists in that table
   - Verify every static singleSelect value is in the valid options list
   - Check if `typecast: true` is set (allows auto-creating missing options)
4. Output pass/fail per node

This caught 5 bugs that 10 days of incremental deployment missed.

### Key Learnings

- **n8n Airtable node `typecast` option**: Setting `options.typecast = true` in the node parameters tells Airtable API to auto-create select options that don't exist. Useful for pipeline status values that only the orchestrator uses.
- **Field mapping drift**: When node mappings are written from Code node output (e.g., `generation_prompt`, `scene_number`), the fields may not exist in the target table. Always verify the mapping against the live schema, not just the code.
- **Gemini output → Airtable select**: Gemini may return free-text values for fields that map to Airtable select options. Always add a normalization step between Gemini output and Airtable writes.
- **Single-pass audit > incremental fixes**: A single comprehensive audit across all workflows found more bugs in 1 minute than 10 days of per-execution debugging.
