# Content & Documentation QA Review

**Reviewer**: Agent B (Content & Documentation QA)
**Date**: 2026-02-21
**Scope**: All project docs, spec kit, setup scripts for 008-tiny-home-timelapse / 007-brand-timelapse

---

## Document Grades

### PROJECT DOCS

#### README.md — Grade: C+

**File**: `/Users/makwa/theinnovativenative/projects/008-tiny-home-timelapse/README.md`

Strengths:
- Concise pipeline overview. Four workflows clearly numbered and labeled.
- Tech stack is accurate and complete.

Defects:
1. **WRONG SPEC KIT PATH**: Line 27 says `See .specify/features/tiny-home-timelapse/` but the actual spec kit lives at `specs/007-brand-timelapse/`. The `.specify/features/tiny-home-timelapse/` directory exists as a duplicate copy, but the canonical version with all supporting files (research.md, data-model.md, quickstart.md, contracts/, checklists/) is in `specs/007-brand-timelapse/`. This will send a newcomer to the wrong (incomplete) location.
2. **No link to quickstart.md**: The README does not mention the quickstart guide, which is the document someone new would actually need.
3. **No mention of Airtable base name or how to create a project**: The README describes the pipeline stages but not how to USE the pipeline. A newcomer reading only the README cannot start producing content.
4. **No folder structure or file inventory**: Doesn't orient the reader to what's in the `brand/` subdirectory or why `source-doc.md` is 742KB.

---

#### brand/source-doc.md — Grade: B-

**File**: `/Users/makwa/theinnovativenative/projects/008-tiny-home-timelapse/brand/source-doc.md`

Strengths:
- Comprehensive capture of the reference prompt system from the YouTube source.
- Well-structured state machine (IDLE, SELECTION, EXECUTION).

Defects:
1. **742KB file size**: This file is enormous. It appears to be a raw dump (possibly including embedded image data or base64 content). It cannot be read in a single pass by tooling. Should be split or trimmed.
2. **No editorial summary at the top**: The file jumps straight into the master prompt. A 2-3 sentence summary of what this document IS and how it relates to our adaptation would help.
3. **Contains a Skool.com promotional link** (line 5) that is irrelevant to this project.

---

#### brand/iconic-brands.md — Grade: A-

**File**: `/Users/makwa/theinnovativenative/projects/008-tiny-home-timelapse/brand/iconic-brands.md`

Strengths:
- Clean tabular format. Well-categorized by industry vertical.
- Guidelines for adding new brands are concrete and actionable.
- Brand count (14 brands) exceeds the spec's stated minimum of 15 in SC-005 -- wait, it's actually 14 (Hard Rock, McDonald's, Starbucks, Chevrolet, Ford, Tesla, Nike, Apple, Google, Louis Vuitton, Gucci, Coca-Cola, Red Bull). SC-005 requires "at least 15." Short by 1.

Defects:
1. **Brand count is 14, not 15**: SC-005 in spec.md requires "at least 15 different iconic brands." This document lists 14. Needs 1+ more brand entries to meet the stated success criterion.

---

#### brand/reference-video-notes.md — Grade: A

**File**: `/Users/makwa/theinnovativenative/projects/008-tiny-home-timelapse/brand/reference-video-notes.md`

Strengths:
- Clean attribution. Video title, URL, creator, and linked prompt all documented.
- "Our Adaptation" section clearly states how this project diverges from the source.
- Transcript status honestly noted.

No defects found.

---

### SPEC KIT

#### spec.md — Grade: A

**File**: `/Users/makwa/theinnovativenative/specs/007-brand-timelapse/spec.md`

Strengths:
- 5 user stories with proper priority ranking (P1/P2/P3) and justification.
- Every user story has Independent Tests and Acceptance Scenarios in Given/When/Then format.
- Edge cases are practical and cover the real failure modes.
- 14 functional requirements, all testable.
- 6 measurable success criteria.
- Technology-agnostic (no tool names in the spec itself).

Defects:
- None found. This is a clean spec.

---

#### plan.md — Grade: A-

**File**: `/Users/makwa/theinnovativenative/specs/007-brand-timelapse/plan.md`

Strengths:
- Pipeline architecture diagram is clear ASCII art showing all 4 workflows + user review gates.
- Key design decisions table with 10 decisions, each with rationale and rejected alternatives.
- Credentials table with real n8n credential IDs.
- FFMPEG output spec is precise (codec, CRF, framerate, crossfade duration, music volume).
- Constitution check is present and honest (conditional pass on Airtable approval).
- Project structure is documented for both docs and source code.

Defects:
1. **Airtable base ID not recorded**: The plan says T006 will "Record Airtable base ID, table IDs, and music Drive file IDs in plan.md credentials section" but the Credentials section only lists n8n credential IDs, not the actual Airtable base/table IDs. The setup script hardcodes `appCOlvJdsSeh0QPe` and `tbl4JgciFENe184jo` but these do not appear in plan.md. After setup runs, these IDs need to be backfilled here.
2. **Source code path partially wrong**: Line 66-70 lists workflow JSON paths under `scripts/n8n-workflows/` which is correct. But the project files section says `projects/008-tiny-home-timelapse/` while the spec kit is under `specs/007-brand-timelapse/`. This naming split is documented nowhere in the plan itself.

---

#### research.md — Grade: A

**File**: `/Users/makwa/theinnovativenative/specs/007-brand-timelapse/research.md`

Strengths:
- 6 research decisions, each with rationale, alternatives considered, and why alternatives were rejected.
- API-level detail where needed (Kling 2.6 image_urls constraint, polling intervals).
- Honest about reusing existing patterns (OOTD pipeline references).

No defects found.

---

#### data-model.md — Grade: A-

**File**: `/Users/makwa/theinnovativenative/specs/007-brand-timelapse/data-model.md`

Strengths:
- Three entities clearly defined with field-level detail (type, constraints, purpose).
- State machines documented for Project, Prompt (Generation Status), and Reel.
- Phase labels enumerated for both image and video asset types.
- Validation rules are explicit and enforceable.
- Relationship cardinalities documented.

Defects:
1. **Status enum count discrepancy**: The state machine shows 13 states (structure_selected, prompts_generating, prompts_generated, prompts_approved, images_generating, images_generated, images_approved, videos_generating, videos_generated, videos_approved, reel_assembling, reel_assembled, published). The Airtable setup script also creates 13 choices. But tasks.md T001 says "12-option enum." The correct count is **13**, and tasks.md has the error.

---

#### quickstart.md — Grade: A

**File**: `/Users/makwa/theinnovativenative/specs/007-brand-timelapse/quickstart.md`

Strengths:
- 5-step walkthrough covers the entire pipeline from project creation to final reel.
- Troubleshooting table covers the real failure scenarios.
- Estimated pipeline time table is realistic and includes both automated and user time.
- Regeneration instructions are included (set Generation Status to pending, re-trigger).

No defects found. This document does what the README should be doing -- orienting a newcomer to actually USE the pipeline.

---

#### tasks.md — Grade: A-

**File**: `/Users/makwa/theinnovativenative/specs/007-brand-timelapse/tasks.md`

Strengths:
- 30 tasks across 8 phases, well-organized by user story.
- Parallel opportunities explicitly marked with [P].
- Agent assignments present (Tab, Neo).
- Dependency chain clearly documented.
- Implementation strategy section (MVP first, incremental delivery) is practical.
- Summary table matches actual task counts.

Defects:
1. **T001 says "12-option enum" for Status**: Should be 13. See data-model.md state machine.
2. **No contracts/ reference in prerequisites**: Line 4 says "contracts/" as prerequisite but there is no task to create the contract documents. They appear to already exist, but this is not explicitly confirmed.
3. **T005 references `specs/007-brand-timelapse/contracts/wf-tht-reel.md` Music Tracks section**: This is the only task referencing a contract doc. The contract files were not in the review scope, so I cannot verify this reference is valid. However, the files do exist on disk.

---

#### checklists/requirements.md — Grade: A

**File**: `/Users/makwa/theinnovativenative/specs/007-brand-timelapse/checklists/requirements.md`

Strengths:
- All items checked. Clean pass.
- Note about technology-agnostic spec is appropriate and correct.

No defects found.

---

### SETUP SCRIPTS

#### setup_tht_airtable.py — Grade: B+

**File**: `/Users/makwa/theinnovativenative/scripts/008-tht/setup_tht_airtable.py`

Strengths:
- Idempotent: checks for existing tables before creation, handles 422 (already exists) gracefully.
- Schema matches data-model.md field definitions exactly (field names, types, enum choices).
- Rate limiting via `time.sleep()` between API calls.
- Summary output includes workflow JSON replacement values.

Defects:
1. **Hardcoded Airtable API token on line 16**: Contains a full PAT token in plaintext. The review instructions note this is acceptable for this project's pattern, but it remains a factual observation. The token is `patAZhNbACN3pH4S6...`.
2. **Repurposes existing Table 1 instead of creating fresh**: Line 90 says "Configure THT Projects" using `EXISTING_TABLE_ID = "tbl4JgciFENe184jo"`. This means the script is bolting THT fields onto an existing table (likely leftover from base creation). The old fields (Notes, Assignee, Attachments, Status) are renamed to `_old_*` rather than deleted. This leaves dead fields in the table. Not blocking, but messy.
3. **No dry-run mode**: Script mutates Airtable immediately on execution. A `--dry-run` flag would be safer for a setup script.

---

#### setup_tht_drive.py — Grade: A-

**File**: `/Users/makwa/theinnovativenative/scripts/008-tht/setup_tht_drive.py`

Strengths:
- Idempotent: `get_or_create_folder` checks for existing folders first.
- Shares folders publicly on creation.
- Loads credentials from MCP config (no hardcoded Google secrets).
- Clean summary output with workflow replacement values.

Defects:
1. **Folder structure differs from plan.md**: Plan says `TinyHomeTimelapse/{Images, Videos, Reels}`. Script creates `TIN Marketing/TinyHomeTimelapse/{Images, Videos, Reels}` with an extra parent folder. This is a minor discrepancy -- the extra parent is organizational -- but it is undocumented in the plan.

---

#### deploy_tht_workflows.py — Grade: B+

**File**: `/Users/makwa/theinnovativenative/scripts/008-tht/deploy_tht_workflows.py`

Strengths:
- Loads API key from MCP config (not hardcoded).
- Strips read-only fields (tags, id, versionId, meta) before deployment.
- Handles failures gracefully per-workflow (doesn't abort on first failure).
- Summary shows DEPLOYED/FAILED status for each workflow.

Defects:
1. **No update/re-deploy logic**: If a workflow already exists, the POST will likely fail or create a duplicate. There is no "update existing" path. For iterative development, this means manual cleanup in n8n between deploys.
2. **No activation**: Comment says "activate via n8n UI if needed" but doesn't explain when activation IS needed. Manual trigger workflows may need activation depending on n8n version.
3. **Workflow JSON file paths are relative**: Line 26-29 use relative paths (`scripts/n8n-workflows/tht-*.json`). Script must be run from repo root or it will fail with FileNotFoundError. Usage docstring says `python scripts/008-tht/deploy_tht_workflows.py` which implies running from repo root, but this is fragile.

---

#### upload_music.py — Grade: B

**File**: `/Users/makwa/theinnovativenative/scripts/008-tht/upload_music.py`

Strengths:
- Loads credentials from MCP config.
- Creates Music subfolder automatically.
- Sets public sharing on uploaded files.
- Summary output includes workflow replacement values.

Defects:
1. **Hardcoded THT_ROOT_FOLDER ID**: Line 27 has `THT_ROOT_FOLDER = "1sMyyj4EdLAtO2q03dYngvjvmDTQxZBUF"`. This means `setup_tht_drive.py` must be run first AND you must manually paste the folder ID into this script. There is no automatic chaining between the two setup scripts. This is a manual error point.
2. **Hardcoded local paths for music files**: Lines 30-32 reference `/tmp/tht-music/` paths. If the music files are not already downloaded to those exact paths, the script will fail. There is no check for file existence before attempting upload, no error message explaining where to get the music files, and no documentation of what these tracks are or where they come from.
3. **No idempotency for uploads**: Unlike the folder creation, file uploads will create duplicates if run twice. No check for "does this file already exist in the Music folder?"
4. **No docstring for TRACKS data**: The track names (e.g., `audiopizza_-_corporate_ambient.mp3`) suggest royalty-free music but there is no license attribution or source documentation.

---

## Cross-Cutting Analysis

### 1. Completeness (Placeholders)

No unfilled placeholders (REPLACE_WITH, TODO, TBD, [YOUR_X]) found in spec kit or project docs. The REPLACE_WITH strings in setup scripts are output labels (print statements telling the user what to substitute in workflow JSON), not unfilled values. The workflow JSON files themselves contain zero REPLACE_WITH markers -- meaning the actual IDs have been substituted already. **PASS.**

### 2. Consistency

| Check | Status | Detail |
|-------|--------|--------|
| Status enum count | **FAIL** | data-model.md = 13 states, Airtable script = 13 choices, tasks.md T001 = "12-option enum" |
| Credential IDs | PASS | plan.md credential IDs match what scripts reference |
| Workflow names | PASS | WF-THT-PROMPT/IMAGE/VIDEO/REEL consistent across README, plan, tasks, deploy script |
| Phase labels | PASS | 6 image phases + 5 video transitions consistent across data-model, spec, iconic-brands |
| Brand terminology | PASS | "Iconic Brand Timelapse" used consistently |
| n8n server hostname | PASS | `srv948776.hstgr.cloud` consistent in plan.md and deploy script |

### 3. Accuracy (IDs Cross-Check)

| ID | Documented In | Referenced In Code | Match |
|----|--------------|-------------------|-------|
| Base ID `appCOlvJdsSeh0QPe` | setup_tht_airtable.py | Not in plan.md | **GAP** -- should be in plan.md |
| Airtable cred `YCWFwTIXwnTpVy2y` | plan.md | Not directly in scripts (scripts use MCP) | OK |
| Kie.AI cred `EFETRZwIsMkjex1c` | plan.md, research.md | Not directly in scripts (n8n credential) | OK |
| Drive cred `53ssDoT9mG1Dtejj` | plan.md | Not directly in scripts (n8n credential) | OK |
| Gemini cred `JbBNLCe83ER3tCwD` | plan.md | Not directly in scripts (n8n credential) | OK |

### 4. Readability

Can someone new understand the pipeline from README alone? **No.** The README gives a high-level overview but does not link to the quickstart, provides a wrong path to the spec kit, and does not explain how to create a project or run any workflow. A newcomer would need to discover `quickstart.md` independently.

### 5. Tasks Coverage

| Spec Requirement | Covered in tasks.md | Task IDs |
|-----------------|---------------------|----------|
| US1 - Prompt generation | Yes | T012-T015 |
| US2 - Image generation | Yes | T016-T018 |
| US3 - Video generation | Yes | T019-T021 |
| US4 - Reel assembly | Yes | T022-T024 |
| US5 - Brand library | Yes | T025-T026 |
| FR-008 - Review gates | Implicit (manual status transitions) | Not explicit task |
| FR-009 - Individual regeneration | Covered in quickstart but no dedicated task | **GAP** |
| SC-005 - 15+ brands | T025 seeds 3-5 brands | **GAP** -- no task to reach 15 |

### 6. Script Quality Summary

| Script | Idempotent | Error Handling | Docs | Secrets |
|--------|-----------|----------------|------|---------|
| setup_tht_airtable.py | Yes (partial) | Good (422 handling) | Good docstring | Hardcoded PAT (acceptable per project pattern) |
| setup_tht_drive.py | Yes | Good | Good docstring | MCP config (clean) |
| deploy_tht_workflows.py | No (creates duplicates) | Good (per-workflow) | Good docstring | MCP config (clean) |
| upload_music.py | No (creates duplicates) | Minimal | Minimal docstring | MCP config (clean) |

### 7. Spec-to-Plan Traceability

Every spec requirement (FR-001 through FR-014) can be traced to a plan section and then to specific tasks. The traceability is clean. The one gap is FR-009 (individual regeneration) which is described in quickstart.md but has no dedicated implementation or test task -- it is assumed to work via the "set status to pending, re-trigger" pattern.

### 8. Naming Confusion: 008 vs 007

**The project is `008-tiny-home-timelapse` in `projects/` but `007-brand-timelapse` in `specs/`.**

This is a real problem, not by design. Here is the evidence:
- The feature branch is named `007-brand-timelapse` (spec.md line 3).
- The scripts directory is `scripts/008-tht/`.
- The project directory is `projects/008-tiny-home-timelapse/`.
- The spec kit is at `specs/007-brand-timelapse/`.
- There is ALSO a duplicate at `.specify/features/tiny-home-timelapse/` (same content as the spec files, no number prefix).

Three different naming conventions for one project:
1. `007-brand-timelapse` (spec kit, feature branch)
2. `008-tiny-home-timelapse` (project directory)
3. `tiny-home-timelapse` (legacy .specify path)

Additionally, the name "tiny-home-timelapse" is misleading -- these are **iconic brand buildings**, not tiny homes. The "THT" abbreviation used throughout the codebase stands for "Tiny Home Timelapse" but the content is brand headquarters and commercial buildings. The name likely reflects the project's origin (the YouTube reference was about architectural construction including small structures) but has since evolved.

**Verdict**: This will confuse every agent and contributor who touches this project. The numbering mismatch (007 vs 008) is the most dangerous because it could cause someone to register the wrong project number in Airtable or the project registry.

---

## Critical Fixes (Must Fix Before Implementation)

1. **README.md spec kit path is wrong**: Line 27 points to `.specify/features/tiny-home-timelapse/` but the canonical spec kit is at `specs/007-brand-timelapse/`. Fix the path and add a link to `quickstart.md`.

2. **tasks.md T001 says "12-option enum" for Status**: The correct count is 13 (matching data-model.md and the Airtable setup script). Fix to "13-option enum."

3. **Resolve the 007/008 numbering conflict**: Either renumber the spec kit to 008 or the project to 007. Pick one and fix all references. As-is, this will cause registration errors and cross-referencing confusion.

4. **upload_music.py has no file-existence check**: Script will crash with an unhelpful error if `/tmp/tht-music/` files don't exist. Add `os.path.exists()` checks with a clear error message explaining where to place music files.

---

## Warnings (Should Fix, Not Blocking)

1. **iconic-brands.md lists 14 brands; SC-005 requires 15**: Either add 1+ more brands or lower the success criterion.

2. **deploy_tht_workflows.py creates duplicates on re-run**: Add a check-and-update pattern or at minimum warn the user that duplicate workflows will be created.

3. **upload_music.py hardcodes THT_ROOT_FOLDER ID**: Should accept this as a CLI argument or read from a config file output by `setup_tht_drive.py`.

4. **source-doc.md is 742KB**: This file is too large for standard tooling to read. Should be trimmed to essential content or split into sections.

5. **Duplicate spec kit at `.specify/features/tiny-home-timelapse/`**: This copy will drift from the canonical `specs/007-brand-timelapse/` version. Delete it or make it a symlink.

6. **No task for FR-009 (individual asset regeneration)**: The mechanism exists (reset status to pending) but there is no explicit test task to verify this works for both images and videos.

7. **plan.md missing Airtable base/table IDs**: T006 says to record them here, but they are not yet present. After `setup_tht_airtable.py` runs, backfill the IDs.

8. **"TIN Marketing" parent folder in Drive is undocumented**: `setup_tht_drive.py` creates an extra parent folder not mentioned in plan.md or quickstart.md.

9. **No music license documentation**: `upload_music.py` references specific tracks but there is no attribution file or license verification.

---

## Grade Summary

| Document | Grade |
|----------|-------|
| README.md | C+ |
| brand/source-doc.md | B- |
| brand/iconic-brands.md | A- |
| brand/reference-video-notes.md | A |
| spec.md | A |
| plan.md | A- |
| research.md | A |
| data-model.md | A- |
| quickstart.md | A |
| tasks.md | A- |
| checklists/requirements.md | A |
| setup_tht_airtable.py | B+ |
| setup_tht_drive.py | A- |
| deploy_tht_workflows.py | B+ |
| upload_music.py | B |

**Overall Assessment**: The spec kit is strong -- spec.md, research.md, and quickstart.md are production-quality. The project docs are weaker, with the README being the biggest liability (wrong path, no quickstart link, cannot standalone). The setup scripts are functional and mostly idempotent but upload_music.py is fragile. The 007/008 numbering conflict is the single most dangerous issue across the entire deliverable set and must be resolved before any agent begins implementation.
