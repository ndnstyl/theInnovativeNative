# THT Pipeline Workflow Logic QA Review

**Reviewer**: Agent A (Workflow Logic QA)
**Date**: 2026-02-21
**Scope**: Adversarial review of 4 n8n workflow JSON files

---

## Workflow 1: WF-THT-PROMPT — Prompt Generator

**File**: `scripts/n8n-workflows/tht-prompt-generator.json`

### Node Connection Graph
- Manual Trigger -> Fetch Project -> IF Empty -> (true) NoOp Exit | (false) Mark Generating -> Build Gemini Prompt -> Gemini HTTP -> Parse JSON -> SplitInBatches -> (done) Update Project Status | (next) Create Prompt Record -> Wait Rate Limit -> SplitInBatches
- **All nodes connected. No orphans. Loop closes properly.**

### Issues Found

#### ISSUE P1-01: Airtable filterByFormula syntax is wrong (CRITICAL)
- **Node**: `Airtable -- Fetch Project`
- **Problem**: `filterByFormula` value is `={Status}='structure_selected'`. The leading `=` is an Airtable formula convention but the curly braces should work. However, the correct Airtable filterByFormula syntax is `{Status}='structure_selected'` (no leading `=`). The leading `=` will cause Airtable to return an `INVALID_FILTER_BY_FORMULA` error.
- **Impact**: Workflow will fail on first node after trigger. Complete runtime failure.

#### ISSUE P1-02: IF node logic inverted — "empty" check routes TRUE to exit, but Airtable returns 0 items as empty array, not `$json.id` being empty
- **Node**: `IF -- No Project Found`
- **Problem**: When Airtable `search` returns 0 records, n8n passes an empty array downstream. The `$json.id` expression won't be "empty" — it will be `undefined`. The IF node checks `string.empty` on `$json.id`, but when 0 records return, the entire node may not fire at all (no items to evaluate). When Airtable returns 1 record, `$json.id` will be a non-empty string like `recXYZ`, so it will route to FALSE (the processing branch). **This actually works as intended** — when there IS a project, id is not empty, routes to false branch (processing). When Airtable returns nothing, n8n may still pass through with undefined. However, the `string.empty` operator with `strict` typeValidation on `undefined` may throw a type error instead of evaluating cleanly.
- **Impact**: Potential runtime error when no project found, instead of graceful NoOp exit. Medium severity.

#### ISSUE P1-03: Gemini API URL uses preview model version
- **Node**: `HTTP Request -- Gemini 2.5 Flash`
- **Problem**: URL uses `gemini-2.5-flash-preview-05-20` which is a dated preview model. Preview models get deprecated. Should use stable model identifier.
- **Impact**: Will break when Google deprecates the preview endpoint. Warning.

#### ISSUE P1-04: No error handling on Gemini HTTP request
- **Node**: `HTTP Request -- Gemini 2.5 Flash`
- **Problem**: If Gemini returns a 429 (rate limit), 500 (server error), or any non-200, the workflow will throw an unhandled error. No retry logic, no error branch.
- **Impact**: Single Gemini failure kills entire workflow with no status cleanup. Project stays stuck in `prompts_generating` forever.

#### ISSUE P1-05: Code -- Parse Prompt JSON does not handle Gemini's `responseMimeType: application/json` correctly
- **Node**: `Code -- Parse Prompt JSON`
- **Problem**: When `responseMimeType` is set to `application/json`, Gemini may return the JSON directly in the response structure rather than as a text string needing `JSON.parse()`. The code does `JSON.parse(text)` which could double-parse and throw. Need to check if `text` is already an object.
- **Impact**: Potential runtime failure on parse. Medium severity.

#### ISSUE P1-06: `$('Airtable -- Fetch Project').first().json.id` used in later nodes after SplitInBatches
- **Node**: `Airtable -- Update Project Status`
- **Problem**: After SplitInBatches processes items, referencing `$('Airtable -- Fetch Project').first().json.id` should still work since n8n keeps the data from earlier nodes in the execution context. This is fine.
- **Impact**: None. False alarm.

#### ISSUE P1-07: SplitInBatches output mapping correct
- Output 0 (done) -> Update Project Status. Correct.
- Output 1 (next item) -> Create Prompt Record. Correct.
- Loop: Create Prompt Record -> Wait -> back to SplitInBatches. Correct.

#### ISSUE P1-08: Wait node uses 0.5 seconds
- **Node**: `Wait -- Rate Limit`
- **Problem**: 0.5 seconds between Airtable writes is fine. Airtable rate limit is 5 requests/sec. No issue.

### Grade: C+

The filterByFormula syntax bug is a show-stopper. The empty-check IF logic is fragile. No error handling on external API calls.

---

## Workflow 2: WF-THT-IMAGE — Image Generator

**File**: `scripts/n8n-workflows/tht-image-generator.json`

### Node Connection Graph
- Manual Trigger -> Fetch Project -> IF Empty -> (true) NoOp | (false) Mark Generating -> Fetch Image Prompts -> SplitInBatches -> (done) Check All Complete -> Update Project Status | (next) Build NBP Payload -> Mark Generating -> Kie.AI CreateTask -> Store Task ID -> Update Job ID -> Wait 30s -> Poll Status -> Check Poll Status -> IF Success -> (true) Download Image -> Drive Upload -> Share File -> Update Generated -> Wait Rate -> SplitInBatches | (false) IF Still Polling -> (true) Wait Retry -> Poll Retry -> Check Poll Status | (false) Mark Failed -> Wait Rate -> SplitInBatches
- **All nodes connected. Polling loop closes. Batch loop closes.**

### Issues Found

#### ISSUE P2-01: Same filterByFormula leading `=` bug (CRITICAL)
- **Node**: `Airtable -- Fetch Project`
- **Problem**: `={Status}='prompts_approved'` — same leading `=` issue as Workflow 1.
- **Impact**: Complete runtime failure.

#### ISSUE P2-02: Same filterByFormula bug on Fetch Image Prompts
- **Node**: `Airtable -- Fetch Image Prompts`
- **Problem**: `=AND({Asset Type}='image', {Generation Status}='pending', RECORD_ID(Project)!='')` — leading `=` again. Also, `RECORD_ID(Project)` is not valid Airtable formula syntax. `RECORD_ID()` takes no arguments — it returns the current record's ID. To check if a linked record field is not empty, use `{Project}!=''` or `LEN({Project})>0`.
- **Impact**: INVALID_FILTER_BY_FORMULA error. Critical.

#### ISSUE P2-03: Polling retry counter never actually increments (CRITICAL)
- **Node**: `Code -- Check Poll Status`
- **Problem**: The code reads `prevData.pollCount` from `$('Code -- Store Task ID').first().json`. On the FIRST poll, this is `0`, so `pollCount` becomes `1`. On the SECOND poll (after retry loop), the code STILL reads from `$('Code -- Store Task ID').first().json` — which is the ORIGINAL data with `pollCount: 0`. So `pollCount` will be `1` every single time. **The retry counter never increments past 1.** The `maxPolls: 5` check is useless.
- **Impact**: Infinite polling loop. If Kie.AI never completes, this workflow polls forever (every 30 seconds) until the n8n execution timeout kills it. Critical.

#### ISSUE P2-04: `$json.taskId` in Poll Retry URL resolves incorrectly after Wait node
- **Node**: `HTTP Request -- Poll Retry`
- **Problem**: The URL uses `{{ $json.taskId }}`. After the Wait node, `$json` refers to the Wait node's output, which does not carry `taskId`. The Wait node in n8n passes through input data, so this *might* work, but it depends on the Wait node's passthrough behavior. The initial Poll Status node uses `$('Code -- Store Task ID').first().json.taskId` which is safer.
- **Impact**: Possible undefined taskId in retry URL. Medium severity — depends on n8n version behavior.

#### ISSUE P2-05: `Code -- Build NBP Payload` reads `item.fields['Prompt Text']` but Airtable v2.1 node flattens fields
- **Node**: `Code -- Build NBP Payload`
- **Problem**: Airtable node typeVersion 2.1 returns data with `fields` as a nested object (e.g., `$json.fields['Prompt Text']`). However, depending on the Airtable node version, it may flatten fields to the top level (`$json['Prompt Text']`). Need to verify which format v2.1 uses. If it flattens, all `item.fields[...]` references will return `undefined`.
- **Impact**: If fields are flattened, `promptText` will be `undefined` and Kie.AI will receive an empty prompt. Critical if wrong.

#### ISSUE P2-06: Google Drive Upload node has no input binary reference
- **Node**: `Google Drive -- Upload Image`
- **Problem**: The Download Image HTTP Request should produce binary data. The Google Drive node needs to know which binary property to upload. The node doesn't specify `inputDataFieldName` or a binary property reference. It relies on default behavior (upload whatever binary data is passed). This usually works but is fragile.
- **Impact**: Low risk, but worth verifying.

#### ISSUE P2-07: Project status set to `images_generated` even if some images failed
- **Node**: `Airtable -- Update Project Status`
- **Problem**: The SplitInBatches output 0 (done) fires when ALL items are processed, regardless of success or failure. If 3 images succeed and 3 fail, the project still gets marked `images_generated`. No check for individual prompt statuses.
- **Impact**: False positive status — downstream workflow will try to use failed images. Significant logic error.

#### ISSUE P2-08: `maxPolls: 5` with 30s delays = 150 seconds max polling time
- **Problem**: Image generation via Kie.AI/Nano Banana Pro typically takes 30-90 seconds. 5 polls at 30-second intervals = 150 seconds of polling (plus initial 30s wait = 180s total). This is borderline adequate but tight for complex images. However, the counter bug (P2-03) makes this moot.

### Grade: D

The infinite polling loop (P2-03) is a severe bug. The filterByFormula issues will prevent the workflow from even starting. Status update logic doesn't account for partial failures.

---

## Workflow 3: WF-THT-VIDEO — Video Generator

**File**: `scripts/n8n-workflows/tht-video-generator.json`

### Node Connection Graph
- Manual Trigger -> Fetch Project -> IF Empty -> (true) NoOp | (false) Mark Generating -> [Fetch Image Records + Fetch Video Prompts] (parallel) -> Build Video Jobs -> SplitInBatches -> (done) Check All Complete -> Update Project Status | (next) Build Kling Payload -> Mark Generating -> Kie.AI CreateTask -> Store Task ID -> Update Job ID -> Wait 60s -> Poll Status -> Check Poll Status -> IF Success -> (true) Download Video -> Drive Upload -> Share File -> Update Generated -> Wait Rate -> SplitInBatches | (false) IF Still Polling -> (true) Wait Retry -> Poll Retry -> Check Poll Status | (false) Mark Failed -> Wait Rate -> SplitInBatches
- **All nodes connected. Both parallel branches feed into Build Video Jobs.**

### Issues Found

#### ISSUE P3-01: Same filterByFormula leading `=` bug (CRITICAL)
- **Nodes**: `Airtable -- Fetch Project`, `Airtable -- Fetch Image Records`, `Airtable -- Fetch Video Prompts`
- **Impact**: Complete runtime failure on all three Airtable search nodes.

#### ISSUE P3-02: Same polling counter bug as Image Generator (CRITICAL)
- **Node**: `Code -- Check Poll Status`
- **Problem**: Identical to P2-03. Reads `prevData.pollCount` from `$('Code -- Store Task ID').first().json` which never changes. Counter stuck at 1 forever.
- **Impact**: Infinite polling loop.

#### ISSUE P3-03: `Code -- Build Video Jobs` runs when EITHER Airtable fetch completes, not when BOTH complete (CRITICAL)
- **Node**: `Code -- Build Video Jobs`
- **Problem**: Both `Airtable -- Fetch Image Records` and `Airtable -- Fetch Video Prompts` connect to `Code -- Build Video Jobs` at input index 0. In n8n, when two nodes connect to the same input of a Code node, the Code node fires TWICE — once when each input arrives. On the first firing, `$('Airtable -- Fetch Video Prompts').all()` or `$('Airtable -- Fetch Image Records').all()` will return empty because that branch hasn't completed yet. The code will throw `Expected 6 image records, found 0` or `Expected 5 video prompts, found 0`.
- **Impact**: Race condition. The Code node will throw on whichever branch finishes first. Complete runtime failure.

#### ISSUE P3-04: Google Drive `uc?export=download` URL won't work for large files
- **Node**: `Code -- Build Video Jobs` (line building `directUrl`)
- **Problem**: `https://drive.google.com/uc?export=download&id=${driveFileId}` does NOT work for files >100MB and requires cookie confirmation for files >25MB. Kie.AI's API needs a publicly accessible direct URL. For Google Drive, the correct approach is to use the Drive API download endpoint or ensure the file is shared with "anyone" link (which it is, from the image workflow). But even with sharing, the `uc?export=download` redirect chain can fail for AI model APIs.
- **Impact**: Kie.AI may fail to fetch the start image. Medium-high severity.

#### ISSUE P3-05: Same project status false-positive as Image Generator
- **Node**: `Airtable -- Update Project Status`
- **Problem**: Sets `videos_generated` even if individual videos failed.

#### ISSUE P3-06: `maxPolls: 5` with 30s retry + 60s initial = 210s max for video generation
- **Problem**: Video generation (Kling 2.6 image-to-video) typically takes 2-5 minutes. 210 seconds (3.5 min) may not be enough. And the counter bug (P3-02) makes this timeout unreachable anyway.
- **Impact**: Even if counter worked, videos would likely timeout.

#### ISSUE P3-07: Same `$json.taskId` after Wait node risk as Image Generator
- **Node**: `HTTP Request -- Poll Retry`

### Grade: D-

Has all the same bugs as Image Generator PLUS the race condition on parallel Airtable fetches feeding into the Code node. The race condition alone is a guaranteed crash.

---

## Workflow 4: WF-THT-REEL — Reel Assembly

**File**: `scripts/n8n-workflows/tht-reel-assembler.json`

### Node Connection Graph
- Manual Trigger -> Fetch Project -> IF Empty -> (true) NoOp | (false) Mark Assembling -> [Fetch Video Records + Fetch Reel Record] (parallel) -> Pre-flight Check -> Create Work Dir -> Build Download Commands -> Download Assets -> Build Normalize Commands -> Normalize Clips -> Build Stitch Command -> Stitch Reel -> Build Validate Command -> Validate Output -> Check Validation -> Drive Upload -> Share File -> Update Reel Record -> Update Project Status -> Cleanup
- **All nodes connected. Linear chain after pre-flight. No orphans.**

### Issues Found

#### ISSUE P4-01: Same filterByFormula leading `=` bug (CRITICAL)
- **Nodes**: `Airtable -- Fetch Project`, `Airtable -- Fetch Video Records`, `Airtable -- Fetch Reel Record`
- **Impact**: Complete runtime failure.

#### ISSUE P4-02: Same race condition as Video Generator — two parallel fetches into one Code node (CRITICAL)
- **Nodes**: `Airtable -- Fetch Video Records` + `Airtable -- Fetch Reel Record` both connect to `Code -- Pre-flight Check`
- **Problem**: Identical to P3-03. The Code node will fire twice. First firing will fail because one dataset is missing.
- **Impact**: Runtime crash.

#### ISSUE P4-03: `Code -- Pre-flight Check` accesses `project.fields['Brand Name']` but the project variable is `$('Airtable -- Fetch Project').first().json`
- **Node**: `Code -- Pre-flight Check`
- **Problem**: `const project = $('Airtable -- Fetch Project').first().json;` then `project.fields['Brand Name']`. Again depends on whether Airtable v2.1 nests under `fields` or flattens. Same risk as P2-05.
- **Impact**: `brandName` could be `undefined`.

#### ISSUE P4-04: Google Drive download via curl won't work for large video files
- **Node**: `Code -- Build Download Commands`
- **Problem**: Using `curl -L -o ... 'https://drive.google.com/uc?export=download&id=...'` to download video files. Google Drive serves a virus scan confirmation page for files >25MB. The `curl -L` will download the HTML confirmation page, not the video file. Video files at 1080x1920 and 10 seconds will be 20-50MB each.
- **Impact**: The downloaded "video" files will actually be HTML pages. FFMPEG will fail with "invalid data found when processing input". Critical.

#### ISSUE P4-05: FFMPEG crossfade offset calculations assume exactly 10-second clips
- **Node**: `Code -- Build Stitch Command`
- **Problem**: Offsets are hardcoded: 9.5, 19.0, 28.5, 38.0. This assumes each clip is exactly 10 seconds. If Kling 2.6 returns videos that are 9.8s or 10.2s, the crossfade will either have black frames or cut off the end. No dynamic duration calculation.
- **Impact**: Visual artifacts in final reel. Medium severity.

#### ISSUE P4-06: FFMPEG filter_complex has embedded quotes that will break shell execution
- **Node**: `Code -- Build Stitch Command`
- **Problem**: The command string includes `'-filter_complex "'` and `'"'` as separate array elements. When joined with spaces and passed to `executeCommand`, the quoting will be: `ffmpeg ... -filter_complex " [0:v]... " -map "[vfinal]" ...`. The embedded double quotes within the n8n expression evaluation context may not survive correctly. Shell escaping through n8n expression evaluation is notoriously fragile.
- **Impact**: FFMPEG command may fail due to bad quoting. Medium-high severity.

#### ISSUE P4-07: `Execute Command` nodes use `executeCommand` v1 which doesn't support `timeout` parameter as shown
- **Node**: All `Execute Command` nodes
- **Problem**: `executeCommand` typeVersion 1 takes `timeout` as a parameter, but the timeout value `300` is interpreted as seconds in v1. This is actually fine — 300 seconds (5 minutes) is reasonable for FFMPEG operations.
- **Impact**: None. Working as intended.

#### ISSUE P4-08: No error handling on ANY Execute Command node
- **Nodes**: Download Assets, Normalize Clips, Stitch Reel, Validate Output
- **Problem**: If any FFMPEG command fails (missing codec, corrupt input, disk full), the error is unhandled. The project will be stuck in `reel_assembling` status with no cleanup of temp files.
- **Impact**: Stuck state + disk space leak on repeated failures. Significant.

#### ISSUE P4-09: Google Drive Upload node for reel — where does the binary data come from?
- **Node**: `Google Drive -- Upload Reel`
- **Problem**: The `Code -- Check Validation` node outputs JSON with `reelPath`. But the Google Drive Upload node needs binary data. There's no step that reads the file from disk into n8n's binary format. The `Execute Command` nodes don't produce binary output. The reel file sits on disk at `${workDir}/reel_final.mp4` but is never loaded into n8n's data stream.
- **Impact**: The Google Drive Upload will either upload nothing or throw an error about missing binary data. Critical.

#### ISSUE P4-10: `Airtable -- Fetch Reel Record` filter formula is wrong
- **Node**: `Airtable -- Fetch Reel Record`
- **Problem**: `filterByFormula` is `=RECORD_ID(Project)!=''`. Same issues: (1) leading `=`, (2) `RECORD_ID()` takes no arguments. To check if the linked `Project` field is populated, use `{Project}!=BLANK()` or `{Project}!=''`.
- **Impact**: Critical — no reel record returned.

#### ISSUE P4-11: Cleanup runs even if earlier steps fail (if error handling added)
- **Node**: `Execute Command -- Cleanup`
- **Problem**: Currently a non-issue because there's no error handling at all. But worth noting for when error paths are added.

#### ISSUE P4-12: Music track file download — same Google Drive curl problem
- **Node**: `Code -- Build Download Commands`
- **Problem**: Music files are also downloaded via `curl -L` from Google Drive. Music files (MP3) are typically 3-10MB so they might squeak under the 25MB limit, but it's still using the unreliable `uc?export=download` pattern.
- **Impact**: May work for small music files. Low-medium risk.

### Grade: F

The reel assembler has the most critical bugs. The binary data gap (P4-09) means it fundamentally cannot upload the finished reel. The Google Drive curl download problem (P4-04) means it can't even get the input videos. The race condition (P4-02) means the pre-flight check crashes. This workflow will not execute a single successful run in its current state.

---

## Cross-Workflow Issues

### CW-01: ALL four workflows have the filterByFormula leading `=` bug
Every single Airtable search node uses `=` prefix in the formula. This is 9 Airtable search nodes total, all broken.

### CW-02: Airtable field name case sensitivity not verified
Fields used: `Status`, `Brand Name`, `Brand Concept`, `Phase Number`, `Asset Type`, `Phase Label`, `Prompt Text`, `Generation Status`, `Kie Job ID`, `Drive File ID`, `Drive URL`, `Preview`, `Error`, `Created At`, `Music Track`, `Reel Status`, `Reel Drive ID`, `Reel URL`, `Duration (s)`, `Project`. These must match Airtable exactly. No way to verify without Airtable access, but this is a risk surface.

### CW-03: No workflow-level error handling (`onError` settings)
None of the four workflows define `onError` behavior. If any node throws, the entire workflow stops with no cleanup. Project records get stuck in intermediate states (`prompts_generating`, `images_generating`, `videos_generating`, `reel_assembling`) with no recovery mechanism.

### CW-04: `RECORD_ID(Project)` used in 3 workflows — invalid syntax everywhere
Appears in: Image Generator (P2-02), Video Generator (implied by same patterns), Reel Assembler (P4-10). `RECORD_ID()` is a zero-argument function in Airtable.

---

## Summary by Severity

### Critical Bugs (Will Cause Runtime Failure)

| ID | Workflow | Node | Issue |
|----|----------|------|-------|
| P1-01 | Prompt Generator | Airtable -- Fetch Project | Leading `=` in filterByFormula |
| P2-01 | Image Generator | Airtable -- Fetch Project | Leading `=` in filterByFormula |
| P2-02 | Image Generator | Airtable -- Fetch Image Prompts | Leading `=` + invalid `RECORD_ID(Project)` |
| P2-03 | Image Generator | Code -- Check Poll Status | Poll counter never increments — infinite loop |
| P3-01 | Video Generator | 3x Airtable nodes | Leading `=` in filterByFormula |
| P3-02 | Video Generator | Code -- Check Poll Status | Poll counter never increments — infinite loop |
| P3-03 | Video Generator | Code -- Build Video Jobs | Race condition: two parallel inputs fire node twice |
| P4-01 | Reel Assembler | 3x Airtable nodes | Leading `=` in filterByFormula |
| P4-02 | Reel Assembler | Code -- Pre-flight Check | Race condition: two parallel inputs fire node twice |
| P4-04 | Reel Assembler | Code -- Build Download Commands | Google Drive curl download fails for files >25MB |
| P4-09 | Reel Assembler | Google Drive -- Upload Reel | No binary data — file on disk never loaded into n8n |
| P4-10 | Reel Assembler | Airtable -- Fetch Reel Record | Invalid `RECORD_ID(Project)` formula |

**Total Critical: 12 bugs across 4 workflows**

### Warnings (May Cause Issues in Edge Cases)

| ID | Workflow | Node | Issue |
|----|----------|------|-------|
| P1-02 | Prompt Generator | IF -- No Project Found | Strict type validation on undefined may throw |
| P1-03 | Prompt Generator | HTTP Request -- Gemini | Preview model will be deprecated |
| P1-04 | Prompt Generator | HTTP Request -- Gemini | No error handling/retry on API call |
| P1-05 | Prompt Generator | Code -- Parse Prompt JSON | May double-parse if Gemini returns JSON directly |
| P2-04 | Image Generator | HTTP Request -- Poll Retry | `$json.taskId` may not survive Wait node passthrough |
| P2-05 | Image Generator | Code -- Build NBP Payload | `item.fields[...]` may be wrong if Airtable flattens |
| P2-07 | Image Generator | Airtable -- Update Project Status | Status set to success even if some images failed |
| P3-04 | Video Generator | Code -- Build Video Jobs | Google Drive direct URL may fail for Kie.AI fetch |
| P3-05 | Video Generator | Airtable -- Update Project Status | Status set to success even if some videos failed |
| P3-06 | Video Generator | Polling config | 210s max may not be enough for video generation |
| P4-03 | Reel Assembler | Code -- Pre-flight Check | `project.fields[...]` may be wrong if flattened |
| P4-05 | Reel Assembler | Code -- Build Stitch Command | Hardcoded crossfade offsets assume exact 10s clips |
| P4-06 | Reel Assembler | Code -- Build Stitch Command | Shell quoting may break FFMPEG filter_complex |
| P4-08 | Reel Assembler | All Execute Command nodes | No error handling — stuck states + disk leaks |
| CW-03 | All | Workflow settings | No `onError` workflow-level handling |

**Total Warnings: 15**

---

## Final Grades

| Workflow | Grade | Verdict |
|----------|-------|---------|
| WF-THT-PROMPT | **C+** | 1 critical (formula syntax), otherwise structurally sound |
| WF-THT-IMAGE | **D** | 3 criticals — formula bugs + infinite polling loop |
| WF-THT-VIDEO | **D-** | 4 criticals — formula + polling + race condition |
| WF-THT-REEL | **F** | 5 criticals — formula + race condition + no binary upload + curl failure |

**Overall Pipeline Grade: D-**

None of these workflows will execute successfully in their current state. The filterByFormula bug alone (present in all 9 Airtable search nodes) prevents any workflow from fetching data. Even after fixing that, the polling counter bug creates infinite loops in workflows 2 and 3, the race condition crashes workflows 3 and 4, and the reel assembler fundamentally cannot upload its output.

### Recommended Fix Priority
1. Fix ALL `filterByFormula` values — remove leading `=` (9 nodes, 10 minutes)
2. Fix `RECORD_ID(Project)` to `{Project}!=BLANK()` (3 nodes, 5 minutes)
3. Fix polling counter — store `pollCount` in workflow static data or pass it through the data chain instead of always reading from `Code -- Store Task ID` (2 workflows)
4. Fix parallel fetch race conditions — use a Merge node (mode: "wait for both") between the two Airtable fetches and the Code node (2 workflows)
5. Fix Reel Assembler binary data gap — add a "Read Binary File" node before Google Drive Upload (1 workflow)
6. Fix Google Drive downloads — use Google Drive API node or `gdown` instead of `curl -L` with `uc?export=download` (1 workflow)
7. Add error handling + status rollback on failure (all 4 workflows)
