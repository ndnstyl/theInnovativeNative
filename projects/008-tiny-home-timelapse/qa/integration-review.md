# Integration Review: THT Iconic Brand Timelapse Pipeline

**Reviewer**: Agent C (Integration & Specs QA)
**Date**: 2026-02-21
**Scope**: Cross-artifact consistency across 9 spec files and 4 workflow JSON implementations
**Verdict**: CONDITIONAL PASS with 6 Critical and 8 Major issues

---

## 1. Field Name Consistency (Airtable fields in workflows vs. actual schema)

**Grade: B+**

All workflow JSON files reference Airtable field names that match the data-model.md definitions and the verified Airtable schema provided in the review request. Checked every Airtable node and every Code node that constructs payloads:

| Field Name | data-model.md | Workflow JSON Usage | Match? |
|---|---|---|---|
| Brand Name | text | `project['Brand Name']` in prompt-gen Code node | YES |
| Brand Concept | long text | `project['Brand Concept']` in prompt-gen Code node | YES |
| Status | enum | Used in all 4 workflows (filter + update) | YES |
| Created At | datetime | Used in sort across all project fetch nodes | YES |
| Phase Number | integer | Used in fetch sort + Code node reads | YES |
| Asset Type | enum | Used in filter formulas (image/video) | YES |
| Phase Label | text | Read in Code nodes, passed through | YES |
| Prompt Text | long text | Read in Code nodes for API payloads | YES |
| Generation Status | enum | Used in filter + update across IMAGE/VIDEO | YES |
| Drive File ID | text | Written on success in IMAGE/VIDEO workflows | YES |
| Drive URL | url | Written on success in IMAGE/VIDEO workflows | YES |
| Preview | attachment | Written as array of URL objects | YES |
| Kie Job ID | text | Written after createTask | YES |
| Error | long text | Written on failure | YES |
| Reel Status | enum | Updated in REEL workflow | YES |
| Music Track | enum | Read in REEL pre-flight Code node | YES |
| Reel Drive ID | text | Written in REEL update | YES |
| Reel URL | url | Written in REEL update | YES |
| Duration (s) | number | Written in REEL update | YES |
| Project | reference | Written as array `[recordId]` in prompt-gen | YES |

**ISSUE #1 (MAJOR)**: The `Duration (s)` field name used in `tht-reel-assembler.json` line 362 is `"Duration (s)"` which includes parentheses. The verified Airtable schema lists the field as `Duration` without the `(s)` suffix. The data-model.md says `Duration (s)`. **If the actual Airtable field name is just "Duration", this write will silently fail (Airtable ignores unknown fields).** Must verify the actual field name in Airtable matches exactly.

**ISSUE #2 (MINOR)**: The `Project` linked record field in the prompt generator writes `"Project": ["={{ $json.projectRecordId }}"]` which is correct array syntax for Airtable linked records. Verified consistent across workflows.

---

## 2. Status State Machine Consistency

**Grade: B**

### Spec defines 13 states:
```
structure_selected -> prompts_generating -> prompts_generated -> prompts_approved
-> images_generating -> images_generated -> images_approved
-> videos_generating -> videos_generated -> videos_approved
-> reel_assembling -> reel_assembled -> published
```

### Workflow status transitions implemented:

| Transition | Workflow | Implemented? |
|---|---|---|
| structure_selected -> prompts_generating | WF-THT-PROMPT | YES (Mark Generating node) |
| prompts_generating -> prompts_generated | WF-THT-PROMPT | YES (Update Project Status node) |
| prompts_generated -> prompts_approved | Manual (user) | N/A |
| prompts_approved -> images_generating | WF-THT-IMAGE | YES (Mark Project Generating) |
| images_generating -> images_generated | WF-THT-IMAGE | YES (Update Project Status) |
| images_generated -> images_approved | Manual (user) | N/A |
| images_approved -> videos_generating | WF-THT-VIDEO | YES (Mark Project Generating) |
| videos_generating -> videos_generated | WF-THT-VIDEO | YES (Update Project Status) |
| videos_generated -> videos_approved | Manual (user) | N/A |
| videos_approved -> reel_assembling | WF-THT-REEL | YES (Mark Assembling) |
| reel_assembling -> reel_assembled | WF-THT-REEL | YES (Update Project Status) |
| reel_assembled -> published | Manual (user) | N/A |

All 13 states are reachable. No states are skipped. The state machine is fully consistent.

**ISSUE #3 (MAJOR)**: WF-THT-IMAGE and WF-THT-VIDEO both unconditionally update project status to `images_generated` / `videos_generated` when SplitInBatches completes (output 0 fires) -- **regardless of whether any items failed**. The contract says "Check if all 6/5 have Generation Status = 'generated' — If yes: Update Project Status". The `Code -- Check All Complete` node in both workflows does NOT actually query Airtable to verify all records succeeded. It just passes through the project record ID. If 3 of 6 images fail, the project will still transition to `images_generated`, which is wrong. The user would then approve a partially-failed set.

**ISSUE #4 (MINOR)**: tasks.md T001 says "Status (12-option enum)" but the data-model.md and spec define **13** states. Count: structure_selected, prompts_generating, prompts_generated, prompts_approved, images_generating, images_generated, images_approved, videos_generating, videos_generated, videos_approved, reel_assembling, reel_assembled, published = 13.

---

## 3. Contract vs. Implementation

### WF-THT-PROMPT Contract vs. JSON

**Grade: A-**

| Contract Requirement | Implementation | Match? |
|---|---|---|
| Manual Trigger | `n8n-nodes-base.manualTrigger` | YES |
| Fetch Project (Status=structure_selected, sort Created At ASC, limit 1) | Filter formula + sort + limit 1 | YES |
| IF empty exit | IF node checking `$json.id` empty -> NoOp | YES |
| Code node: build Gemini system prompt | Full system prompt with all 6 phases, 5 transitions, camera rules, brand context | YES |
| Gemini call with responseMimeType application/json | HTTP POST to Gemini 2.5 Flash with structured JSON config | YES |
| Parse JSON -> 11 prompt objects | Validates 6 images + 5 videos, builds 11 records | YES |
| SplitInBatches -> Create 11 Airtable records | SplitInBatches batch size 1 -> Airtable create | YES |
| Update Project Status -> prompts_generated | Final update node after loop completes | YES |

**ISSUE #5 (CRITICAL)**: The contract says "Update Project Status -> prompts_generating" should happen BEFORE Gemini is called. The workflow does implement this (`Airtable -- Mark Generating` fires before `Code -- Build Gemini Prompt`). However, **the workflow skips the `prompts_generating` -> `prompts_generated` transition if Gemini fails**. The contract says "If Gemini returns malformed JSON: log error, do not create records, leave status unchanged." But the Code -- Parse Prompt JSON node uses `throw new Error(...)` which will cause the workflow to HALT with the project stuck at `prompts_generating` forever. There is no error handler to revert the status back to `structure_selected`. The contract says "leave status unchanged" but the status has already been changed.

**ISSUE #6 (MINOR)**: Contract says "Airtable create fails: log error for the specific record, continue with remaining." The workflow has no error handling on the Airtable create node. If one record fails, the entire SplitInBatches loop will halt.

### WF-THT-IMAGE Contract vs. JSON

**Grade: B-**

| Contract Requirement | Implementation | Match? |
|---|---|---|
| Fetch prompts where Asset Type=image, Generation Status=pending, Project Status=prompts_approved | Filter: `AND({Asset Type}='image', {Generation Status}='pending', RECORD_ID(Project)!='')` | **MISMATCH** |
| SplitInBatches batch 1 | batch size 1 | YES |
| Build NBP payload (nano-banana-pro, 9:16, png) | Correct model, aspect_ratio, output_format | YES |
| Mark generating before createTask | Airtable update -> HTTP POST sequence | YES |
| POST createTask | Correct endpoint | YES |
| Wait 30s initial | 30 seconds | YES |
| Poll 5 retries, 30s intervals | maxPolls=5, Wait 30s between retries | YES |
| On success: download, upload Drive, share, update Airtable | Full chain implemented | YES |
| Rate limit 5s | Wait 5s node at end of loop | YES |
| Check all 6 generated -> update project | Code node + update (see Issue #3) | PARTIAL |

**ISSUE #7 (CRITICAL)**: The Airtable filter in `tht-img-fetch-prompts` is `AND({Asset Type}='image', {Generation Status}='pending', RECORD_ID(Project)!='')`. The contract specifies the filter should also include "Linked Project has Status = 'prompts_approved'". The workflow instead checks project status at the PROJECT level (fetches project first with `prompts_approved` filter) but **the prompt fetch has no project scoping**. If you have TWO projects and one is at `prompts_approved` and the other has leftover `pending` image prompts from a previous failed run, THIS WORKFLOW WILL PROCESS THE WRONG PROJECT'S PROMPTS. The filter must include a project link check like `{Project}='recXXX'` to scope prompts to the specific project.

**Same issue exists in WF-THT-VIDEO** (`tht-vid-fetch-images` and `tht-vid-fetch-video-prompts`) and **WF-THT-REEL** (`tht-reel-fetch-videos`). None of them scope to the specific project record ID.

### WF-THT-VIDEO Contract vs. JSON

**Grade: B-**

| Contract Requirement | Implementation | Match? |
|---|---|---|
| Fetch Project Status=images_approved | Correct filter | YES |
| Fetch 6 image records sorted Phase ASC | Filter: image + generated, sorted | YES |
| Fetch 5 video prompts sorted Phase ASC | Filter: video + pending, sorted | YES |
| Code: pair consecutive images with video prompts | Images[i] paired with Videos[i] | YES |
| Convert Drive URLs to direct download | Uses Drive File ID -> uc?export=download format | YES |
| Kling 2.6 payload: model, image_urls, prompt, duration 10, 9:16 | Correct payload structure | YES |
| Wait 60s initial | 60 seconds | YES |
| Poll 5 retries, 30s intervals | maxPolls=5, 30s retry wait | YES |
| Rate limit 10s | Wait 10s node | YES |

**(Shares Issue #3 and #7 from above.)**

### WF-THT-REEL Contract vs. JSON

**Grade: B+**

| Contract Requirement | Implementation | Match? |
|---|---|---|
| Fetch Project Status=videos_approved | Correct | YES |
| Fetch 5 video records (Phase ASC) | Correct | YES |
| Fetch Reel record (Music Track) | Fetches from THT Reels table | YES |
| Pre-flight: verify 5 Drive File IDs | Checks each driveFileId exists | YES |
| Pre-flight: verify ffmpeg/ffprobe | **NOT CHECKED** in Code node | **NO** |
| Pre-flight: verify /tmp disk space | **NOT CHECKED** in Code node | **NO** |
| Download 5 clips + music | curl-based download command | YES |
| Normalize clips (1080x1920, 30fps, libx264, crf18, yuv420p) | Correct ffmpeg params | YES |
| Stitch: xfade 0.5s, offsets 9.5/19.0/28.5/38.0 | Correct | YES |
| Music: volume 0.4, fade in 1s, fade out st=46 d=1 | Correct | YES |
| Codec: libx264, crf 18, profile main, level 4.1 | Correct | YES |
| Audio: aac 128k | Correct | YES |
| movflags +faststart | Correct | YES |
| ffprobe validation | Implemented in separate Code node | YES |
| Upload to Reels folder | Correct folder ID | YES |
| Update Reel + Project status | Both updated | YES |
| Cleanup /tmp | rm -rf at end | YES |

**ISSUE #8 (MAJOR)**: The contract says pre-flight must "Verify ffmpeg/ffprobe available on server" and "Verify /tmp disk space (need ~500MB working space)". The Code -- Pre-flight Check node does NEITHER. It only validates Drive File IDs and music track config. If ffmpeg is missing, the workflow will fail six steps later at the normalize command with a cryptic error.

**ISSUE #9 (MAJOR)**: The reel workflow downloads files using `curl -L -o` with Google Drive direct download URLs. For files > 100MB (or files that trigger Google's virus scan warning), the `uc?export=download` URL returns an HTML page with a confirmation link, NOT the actual file. The downloaded "video" will be an HTML file, and ffmpeg will fail with an incomprehensible codec error. The contract does not address this, and the implementation has no validation that downloaded files are actual video files.

---

## 4. Data Model Alignment

**Grade: A-**

| data-model.md Entity | Airtable Table (verified) | Fields Match? |
|---|---|---|
| Project | THT Projects (tbl4JgciFENe184jo) | YES -- Brand Name, Brand Concept, Status, Created At |
| Prompt | THT Prompts (tblWExmILcFYnW9ze) | YES -- all 11 fields match |
| Reel | THT Reels (tblcvKwDfxc46QW5Y) | MOSTLY -- see Issue #1 |

**ISSUE #10 (MINOR)**: data-model.md lists `Project Name` as a field on the Project entity. The verified Airtable schema in the review request only lists `Brand Name, Brand Concept, Status, Created At`. The `Project Name` field is either missing from Airtable or was omitted from the verified schema list. The quickstart.md instructs users to fill in "Project Name" when creating records. If the field does not exist, users will be confused.

**ISSUE #11 (MINOR)**: data-model.md defines Generation Status states as: `pending -> generating -> generated -> failed -> approved`. The `approved` state is never written by any workflow -- it is implied as a manual user action. However, the Airtable enum should include it. The workflows only use `pending`, `generating`, `generated`, `failed`. The `approved` state is documented but never checked by any downstream workflow, so it is effectively unused. The image workflow checks for `pending` (not `approved`) to pick up retries, which is correct.

---

## 5. Cross-Workflow Data Flow

**Grade: B+**

### WF-PROMPT -> WF-IMAGE

| PROMPT Output | IMAGE Input | Compatible? |
|---|---|---|
| 11 records in THT Prompts (6 image, 5 video) | Fetches where Asset Type=image, Generation Status=pending | YES |
| Phase Number 1-6 for images | Sorted by Phase Number ASC | YES |
| Prompt Text populated | Reads `fields['Prompt Text']` | YES |
| Project Status = prompts_generated | IMAGE expects prompts_approved (user must set) | YES (gate) |

### WF-IMAGE -> WF-VIDEO

| IMAGE Output | VIDEO Input | Compatible? |
|---|---|---|
| 6 image records with Drive File ID, Drive URL, Generation Status=generated | Fetches image records with generated status | YES |
| Drive File ID in each image record | Video Code node reads `fields['Drive File ID']` | YES |
| Project Status = images_generated | VIDEO expects images_approved (user must set) | YES (gate) |

### WF-VIDEO -> WF-REEL

| VIDEO Output | REEL Input | Compatible? |
|---|---|---|
| 5 video records with Drive File ID, Generation Status=generated | Fetches video records with generated status | YES |
| Drive File ID in each video record | Reel pre-flight reads `fields['Drive File ID']` | YES |
| Project Status = videos_generated | REEL expects videos_approved (user must set) | YES (gate) |

**Data flows are consistent across all workflow boundaries.** The manual review gates (user sets _approved) are correctly placed.

---

## 6. Credential Consistency

**Grade: A**

| Service | Expected Credential ID | WF-PROMPT | WF-IMAGE | WF-VIDEO | WF-REEL |
|---|---|---|---|---|---|
| Airtable | YCWFwTIXwnTpVy2y | YES (all Airtable nodes) | YES | YES | YES |
| Kie.AI | EFETRZwIsMkjex1c | N/A | YES (createTask + poll nodes) | YES | N/A |
| Google Drive | 53ssDoT9mG1Dtejj | N/A | YES (upload + share) | YES | YES |
| Gemini | JbBNLCe83ER3tCwD | YES (HTTP Gemini node) | N/A | N/A | N/A |

All credential IDs match the specified values. No mismatches found.

---

## 7. Drive Folder IDs

**Grade: A**

| Folder | Expected ID | Workflow | Used In | Match? |
|---|---|---|---|---|
| Images | 1d4IF1dLR31I7RGjkQ4YDWya36_0OwsBd | WF-IMAGE | Google Drive Upload folderId | YES |
| Videos | 1RwU-yudHIC79yRgSoqnkxYFBEp48mrWp | WF-VIDEO | Google Drive Upload folderId | YES |
| Reels | 19xzIaZt5yIDMF7yBCF3Y2X6gKvokHiZB | WF-REEL | Google Drive Upload folderId | YES |

All folder IDs match specifications exactly.

---

## 8. Missing Connections / Undefined References

**Grade: B**

**ISSUE #12 (CRITICAL)**: The reel workflow Google Drive upload node (`tht-reel-drive-upload`) uses `"operation": "upload"` but does not specify a `binaryPropertyName` or any mechanism to read the local file `reel_final.mp4` from `/tmp/`. The n8n Google Drive node expects binary data from a previous node. The Execute Command nodes return stdout/stderr text, not binary data. **The reel file will NOT be uploaded.** The workflow needs an intermediate step to read the file into binary (e.g., a "Read Binary File" node or an HTTP Request to `file:///` or a Code node using `$binary`). This is a pipeline-breaking bug.

**ISSUE #13 (CRITICAL)**: Same issue applies to the download step in WF-THT-REEL. The workflow downloads files using `curl` via Execute Command, but then the ffmpeg steps reference files on disk. This part works. However, the Google Drive upload node at the end cannot access the file on disk without binary input. The Execute Command nodes do NOT produce binary output.

**ISSUE #14 (CRITICAL)**: In WF-THT-IMAGE, the `HTTP Request -- Download Image` node downloads the image from the Kie.AI result URL. This produces binary data which flows into the Google Drive Upload node. This is correct for IMAGE and VIDEO workflows. But the REEL workflow breaks this pattern by using Execute Command for everything, then trying to use the Google Drive native node which expects binary input it never receives.

**ISSUE #15 (MINOR)**: The reel workflow's `Airtable -- Fetch Reel Record` uses filter `RECORD_ID(Project)!=''` which will match ANY reel record in the table, not specifically the reel for the current project. If multiple projects exist, this could fetch the wrong reel record. Should filter by the specific project record ID.

---

## 9. FFMPEG Spec Alignment

**Grade: A**

| Spec Parameter | plan.md Value | Reel Contract Value | Workflow Implementation | Match? |
|---|---|---|---|---|
| Resolution | 1080x1920 | 1080x1920 | `scale=1080:1920` + pad | YES |
| Codec | H.264 libx264, CRF 18 | libx264, CRF 18, profile main, level 4.1 | `-c:v libx264 -crf 18 -profile:v main -level 4.1` | YES |
| Frame rate | 30fps | 30fps | `-r 30` | YES |
| Pixel format | yuv420p | yuv420p | `-pix_fmt yuv420p` | YES |
| Audio | AAC 128kbps | AAC 128k | `-c:a aac -b:a 128k` | YES |
| Container | MP4 +faststart | MP4 +faststart | `-movflags +faststart` | YES |
| Crossfade | 0.5s | 0.5s, offsets 9.5/19.0/28.5/38.0 | Matches exactly | YES |
| Music volume | 0.4 | 0.4 | `volume=0.4` | YES |
| Music fade | 1s in/out | fade in st=0 d=1, fade out st=46 d=1 | Correct | YES |
| Duration | ~48s | 5x10 - 4x0.5 = 48s | `-shortest` flag + correct offsets | YES |

FFMPEG implementation perfectly matches the spec. No discrepancies.

---

## 10. Kie.AI API Patterns

**Grade: A-**

### Image Generation (Nano Banana Pro)
| Aspect | Contract | Implementation | Match? |
|---|---|---|---|
| Endpoint | POST /api/v1/jobs/createTask | `https://api.kie.ai/api/v1/jobs/createTask` | YES |
| Model | nano-banana-pro | `'nano-banana-pro'` | YES |
| Input fields | prompt, aspect_ratio, output_format | prompt, aspect_ratio: '9:16', output_format: 'png' | YES |
| Poll endpoint | GET /api/v1/jobs/recordInfo?taskId= | Correct query param | YES |
| Response parsing | data.response.resultUrls[0] | `data?.response?.resultUrls || data?.resultUrls` | YES (defensive) |

### Video Generation (Kling 2.6)
| Aspect | Contract | Implementation | Match? |
|---|---|---|---|
| Model | kling-2.6/image-to-video | `'kling-2.6/image-to-video'` | YES |
| Input fields | prompt, image_urls, duration, aspect_ratio | All present, duration='10', aspect_ratio='9:16' | YES |
| Same API endpoints | createTask + recordInfo | Same pattern as IMAGE workflow | YES |

**ISSUE #16 (CRITICAL)**: The polling logic in both IMAGE and VIDEO workflows has a subtle bug. The `Code -- Check Poll Status` node reads `prevData` from `$('Code -- Store Task ID').first().json` which returns the ORIGINAL pollCount (0). On every retry iteration, `pollCount` is computed as `(prevData.pollCount || 0) + 1` but since `prevData` always references the Store Task ID node (which always has pollCount=0), **the pollCount will always be 1**. The polling loop will never reach maxPolls and will poll FOREVER. The retry path goes: Wait -> Poll Retry HTTP -> Check Poll Status (which reads from Store Task ID again, gets pollCount=0, increments to 1, never hits 5). The pollCount is not persisted between iterations.

---

## Spec/Contract Grades Summary

| Artifact | Grade | Notes |
|---|---|---|
| spec.md | A | Clean, thorough user stories and requirements |
| plan.md | A | Good architecture, correct credentials, FFMPEG spec |
| data-model.md | A- | Minor: Project Name field ambiguity, approved state unused |
| wf-tht-prompt.md | A- | Contract is solid; implementation has error recovery gap |
| wf-tht-image.md | B- | No project scoping on prompt fetch; completion check broken |
| wf-tht-video.md | B- | Same issues as IMAGE; inherited patterns |
| wf-tht-reel.md | B+ | Good spec; implementation missing pre-flight checks |
| quickstart.md | A | Clear step-by-step; matches pipeline flow |
| tasks.md | B+ | Minor status count error (12 vs 13); otherwise thorough |
| tht-prompt-generator.json | B+ | Works but error recovery leaves project in stuck state |
| tht-image-generator.json | C+ | Infinite poll loop + no project scoping = broken |
| tht-video-generator.json | C+ | Same structural bugs as image generator |
| tht-reel-assembler.json | D | Cannot upload reel to Drive (binary data gap) |

---

## Critical Mismatches (MUST FIX before deployment)

### CRITICAL-1: Infinite Polling Loop (IMAGE + VIDEO workflows)
**Files**: `tht-image-generator.json`, `tht-video-generator.json`
**Problem**: The `Code -- Check Poll Status` node always reads pollCount from the initial `Code -- Store Task ID` node, which is always 0. The incremented pollCount is never persisted back. The retry loop will poll Kie.AI indefinitely, never timing out, burning API calls.
**Fix**: Either (a) use `$input.first().json.pollCount` instead of reading from Store Task ID on retry iterations, ensuring the Poll Retry HTTP node passes through the pollCount from the previous Check Poll Status output, or (b) use n8n's static data / workflow variables to persist pollCount across iterations.

### CRITICAL-2: Reel Cannot Upload to Google Drive (REEL workflow)
**Files**: `tht-reel-assembler.json`
**Problem**: The Google Drive Upload node expects binary data input. The preceding nodes are Execute Command nodes that return text stdout/stderr. The reel_final.mp4 file exists on disk at `/tmp/tht-{id}/reel_final.mp4` but is never loaded into n8n's binary pipeline. The upload will fail or upload empty/garbage data.
**Fix**: Add a "Read Binary File" node (n8n-nodes-base.readBinaryFile) between the validation check and the Google Drive Upload, reading the file from the path output by the Check Validation node.

### CRITICAL-3: No Project Scoping on Prompt/Record Fetches (IMAGE, VIDEO, REEL workflows)
**Files**: `tht-image-generator.json`, `tht-video-generator.json`, `tht-reel-assembler.json`
**Problem**: The Airtable search nodes that fetch prompts/records do not filter by the specific project. If multiple projects exist in the base, workflows will process records from ALL projects, not just the one being worked on. Example: IMAGE workflow fetches ALL image prompts with `pending` status across every project.
**Fix**: Add project record ID to the filter formula. After fetching the project, include `FIND('{projectRecordId}', ARRAYJOIN({Project}))` or equivalent in the filterByFormula for all downstream Airtable searches.

### CRITICAL-4: Completion Check Does Not Verify Success (IMAGE, VIDEO workflows)
**Files**: `tht-image-generator.json`, `tht-video-generator.json`
**Problem**: When SplitInBatches completes (output 0), the `Code -- Check All Complete` node unconditionally triggers project status update to `images_generated`/`videos_generated` without verifying that all records actually succeeded. If 2 of 6 images failed, the project still advances. The user review gate then operates on incomplete data.
**Fix**: The Check All Complete Code node must query Airtable to count records with Generation Status = "generated" for this project. Only update project status if the count equals the expected total (6 for images, 5 for videos). Otherwise, log a warning and leave the project in the `_generating` state.

### CRITICAL-5: Stuck State on Gemini Failure (PROMPT workflow)
**Files**: `tht-prompt-generator.json`
**Problem**: The workflow updates project status to `prompts_generating` before calling Gemini. If Gemini fails (malformed JSON, timeout, API error), the Code node throws an error, halting the workflow. The project is now stuck at `prompts_generating` with no way to re-trigger (the workflow only picks up `structure_selected`). The user must manually reset the status.
**Fix**: Add an error handler (n8n Error Trigger or try/catch in the Code node) that reverts project status to `structure_selected` on failure.

### CRITICAL-6: Google Drive Download Size Limitation (REEL workflow)
**Files**: `tht-reel-assembler.json`
**Problem**: The curl-based download uses `uc?export=download` URLs which fail for files that trigger Google's virus scan confirmation page (typically >100MB, but can trigger on smaller files too). The downloaded file will be HTML, not video, causing ffmpeg to fail with an opaque error.
**Fix**: Use Google Drive API v3 download endpoint with OAuth token instead of public curl download, OR use the Google Drive native node to download files as binary, OR add validation after download that each file is a valid video (check file magic bytes or run ffprobe on each clip before normalization).

---

## Major Mismatches (Should fix before production use)

### MAJOR-1: Duration Field Name Mismatch Risk
`Duration (s)` in workflow vs. potentially `Duration` in Airtable. Verify and align.

### MAJOR-2: Missing Pre-flight Checks in Reel
Contract specifies ffmpeg/ffprobe and disk space validation. Implementation skips both.

### MAJOR-3: No Error Handling on Airtable Creates in Prompt Workflow
A single Airtable create failure halts the entire SplitInBatches loop, potentially creating partial prompt sets (e.g., 7 of 11 records).

### MAJOR-4: Reel Record Fetch Not Scoped to Project
`tht-reel-fetch-reel` fetches any reel record with a linked project. Multi-project scenarios will break.

### MAJOR-5: Task T001 Says 12-Option Enum, Should Be 13
Minor doc error but could cause the implementer to miss a state when creating the Airtable field.

### MAJOR-6: Image Workflow Filter Uses Invalid Airtable Formula
The filter `RECORD_ID(Project)!=''` in `tht-img-fetch-prompts` is not standard Airtable formula syntax for checking linked record existence. The correct formula would be `{Project}!=BLANK()` or `LEN(ARRAYJOIN({Project}))>0`.

### MAJOR-7: No Retry/Error Recovery in Reel Assembly
Unlike IMAGE/VIDEO workflows which mark individual items as failed and continue, the REEL workflow has no error handling. Any ffmpeg failure, download failure, or validation failure will halt the workflow with the project stuck at `reel_assembling`.

### MAJOR-8: Video Download Timeout May Be Insufficient
VIDEO workflow downloads with 120s timeout. Kie.AI video files can be large. For 10s of 1080x1920 video, files could be 50-200MB. On slow connections, 120s may not suffice. Consider increasing to 300s.

---

## Summary

The spec kit is well-designed with clean architecture, correct FFMPEG specs, proper credential management, and consistent data model definitions. The contracts accurately describe the desired behavior. However, the workflow JSON implementations have 6 critical bugs that will prevent production operation:

1. Polling loops will run forever (never timeout)
2. Reel file cannot be uploaded (binary data gap)
3. Multi-project data contamination (no project scoping)
4. Partial failures incorrectly advance pipeline state
5. Gemini failures leave projects permanently stuck
6. Google Drive downloads may silently fail for large files

**None of these workflows should be deployed until the 6 critical issues are resolved.** The issues are structural and will cause data corruption, infinite loops, or pipeline breakage on first real use.
