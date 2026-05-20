# QA Summary: THT Iconic Brand Timelapse Pipeline

**Date**: 2026-02-21
**Overall Grade**: D- (worst grade from any deliverable: WF-THT-REEL = F)
**Reviewers**: Agent A (Workflow Logic), Agent B (Content & Docs), Agent C (Integration & Specs)

---

## Grades

| Deliverable | Grade | Critical Issues |
|-------------|-------|-----------------|
| spec.md | A | 0 |
| plan.md | A- | 0 |
| research.md | A | 0 |
| data-model.md | A- | 0 |
| quickstart.md | A | 0 |
| tasks.md | A- | 1 (enum count) |
| checklists/requirements.md | A | 0 |
| README.md | C+ | 1 (wrong path) |
| brand/iconic-brands.md | A- | 0 |
| brand/source-doc.md | B- | 0 |
| brand/reference-video-notes.md | A | 0 |
| setup_tht_airtable.py | B+ | 0 |
| setup_tht_drive.py | A- | 0 |
| deploy_tht_workflows.py | B+ | 0 |
| upload_music.py | B | 1 (no file check) |
| **tht-prompt-generator.json** | **C+** | **1** (filterByFormula) |
| **tht-image-generator.json** | **D** | **3** (formula + infinite poll + no project scope) |
| **tht-video-generator.json** | **D-** | **4** (formula + infinite poll + race condition + no scope) |
| **tht-reel-assembler.json** | **F** | **5** (formula + race + no binary upload + curl fail + invalid formula) |

---

## Critical Bugs (MUST FIX — Pipeline Will Not Function)

### BUG-1: filterByFormula leading `=` in ALL Airtable search nodes [ALL 4 WORKFLOWS]
- **Impact**: Every Airtable search returns INVALID_FILTER_BY_FORMULA error. No workflow can fetch data.
- **Scope**: 9 Airtable search nodes across 4 workflows
- **Fix**: Remove the leading `=` from every `filterByFormula` value
- **Effort**: 15 min

### BUG-2: `RECORD_ID(Project)` is invalid Airtable formula [IMAGE, VIDEO, REEL]
- **Impact**: Formula error on prompt/record fetch. `RECORD_ID()` takes zero arguments.
- **Fix**: Replace with `{Project}!=BLANK()` or `LEN(ARRAYJOIN({Project}))>0`
- **Effort**: 10 min

### BUG-3: Polling counter never increments — infinite loop [IMAGE, VIDEO]
- **Impact**: `Code -- Check Poll Status` always reads `pollCount` from `$('Code -- Store Task ID').first().json` which is always 0. Counter stuck at 1 forever. Workflows poll Kie.AI indefinitely.
- **Fix**: Use `$input.first().json.pollCount` on retry path, or use n8n static data to persist counter
- **Effort**: 30 min

### BUG-4: Race condition on parallel Airtable fetches [VIDEO, REEL]
- **Impact**: Two Airtable nodes feed same Code node at input 0. Code fires when EITHER arrives (not both). First firing crashes because other dataset is empty.
- **Fix**: Add a Merge node (mode: "wait for both") between the two Airtable fetches and the Code node
- **Effort**: 20 min per workflow

### BUG-5: No binary data for reel upload [REEL]
- **Impact**: Google Drive Upload node expects binary data. Execute Command nodes produce text. The `reel_final.mp4` file on disk is never loaded into n8n's data pipeline. Upload fails or uploads garbage.
- **Fix**: Add `n8n-nodes-base.readBinaryFile` node between validation check and Drive upload
- **Effort**: 15 min

### BUG-6: Google Drive curl download fails for files >25MB [REEL]
- **Impact**: `curl -L` on `uc?export=download` gets HTML confirmation page instead of file. FFMPEG crashes on HTML input.
- **Fix**: Use Google Drive API node for download (already have credentials), or use `gdown`, or add file-type validation after download
- **Effort**: 30 min

### BUG-7: No project scoping on prompt/record fetches [IMAGE, VIDEO, REEL]
- **Impact**: If multiple projects exist, workflows process records from ALL projects indiscriminately.
- **Fix**: After fetching the project, inject its record ID into downstream Airtable filters
- **Effort**: 30 min

### BUG-8: Completion check doesn't verify success [IMAGE, VIDEO]
- **Impact**: `images_generated` / `videos_generated` status set even if items failed. User reviews incomplete data.
- **Fix**: Check All Complete node must query Airtable for actual success count before advancing status
- **Effort**: 20 min per workflow

### BUG-9: Gemini failure leaves project stuck at `prompts_generating` [PROMPT]
- **Impact**: No error handler to revert status. Project permanently stuck, can't re-trigger.
- **Fix**: Add try/catch in Code node or n8n error trigger to revert to `structure_selected`
- **Effort**: 15 min

**Total Critical Bugs: 9** (deduplicated across agents)
**Estimated fix effort: ~4 hours**

---

## Major Issues (Should Fix Before Production)

1. **Duration field name mismatch risk** — `Duration (s)` in workflow vs potentially `Duration` in Airtable. Must verify exact name.
2. **No pre-flight check for ffmpeg/ffprobe** — Reel contract requires this; implementation skips it.
3. **No error handling on Airtable creates** — Prompt workflow halts on single create failure, leaving partial prompt set.
4. **No workflow-level `onError` handling** — All 4 workflows leave projects in stuck intermediate states on failure.
5. **Gemini preview model `gemini-2.5-flash-preview-05-20`** — Will be deprecated. Use stable model ID.
6. **Hardcoded crossfade offsets assume exactly 10s clips** — No dynamic duration calculation.
7. **Shell quoting fragility in FFMPEG filter_complex** — May break on execution.
8. **Video generation polling timeout too short** — 210s max may not suffice for Kling 2.6.

---

## Documentation Issues (Fix Before Handoff)

1. **README.md spec kit path wrong** — Points to `.specify/features/tiny-home-timelapse/` instead of `specs/007-brand-timelapse/`
2. **tasks.md T001 says "12-option enum"** — Should be 13
3. **007/008 numbering conflict** — Spec kit is 007, project dir is 008, .specify copy has no number. Three naming conventions for one project.
4. **iconic-brands.md has 14 brands** — SC-005 requires 15+
5. **plan.md missing Airtable base/table IDs** — T006 says to record them but they're absent
6. **Duplicate spec kit at .specify/features/** — Will drift from canonical version

---

## Passed (No Issues)

- spec.md — Clean, well-structured, technology-agnostic
- research.md — 6 decisions with rationale and alternatives
- quickstart.md — Excellent newcomer orientation, covers full pipeline
- checklists/requirements.md — All items passing
- brand/reference-video-notes.md — Clean attribution and adaptation notes
- Airtable schema — All 3 tables verified correct with proper fields and types
- Google Drive — All 5 folders + 3 music files exist and are publicly shared
- Credential consistency — All 4 credential IDs used correctly across workflows
- Drive folder IDs — All 3 upload destinations correct
- FFMPEG spec — Implementation perfectly matches spec (codec, CRF, framerate, crossfade, music)
- Kie.AI API patterns — Correct endpoints, methods, and payloads (minus the polling bug)
- Cross-workflow data flow — Outputs match inputs across all 4 workflow boundaries
- No REPLACE_WITH placeholders remain in any deployed workflow

---

## Verdict

**NOT READY FOR PRODUCTION**

The spec kit is strong (A average). The infrastructure setup is complete and verified (Airtable schema, Drive folders, music files, credential wiring). But the 4 n8n workflow JSON files have **9 critical bugs** that will cause immediate runtime failures:

- Every workflow fails at step 1 (filterByFormula syntax)
- Image/Video generators enter infinite polling loops
- Video/Reel assemblers crash from race conditions
- Reel assembler cannot upload its output

**The workflows need a dedicated bug-fix pass before any end-to-end testing is possible.** Estimated fix effort: ~4 hours for critical bugs.

### Recommended Next Steps (Priority Order)
1. Fix all 9 filterByFormula + RECORD_ID formula bugs (30 min)
2. Fix polling counter persistence (30 min)
3. Add Merge nodes for parallel fetch race conditions (40 min)
4. Add ReadBinaryFile node to reel assembler (15 min)
5. Replace curl Drive downloads with API-based downloads (30 min)
6. Add project scoping to all downstream fetches (30 min)
7. Add completion verification before status advancement (40 min)
8. Add error handling / status rollback (45 min)
9. Re-deploy all 4 workflows after fixes
10. Test WF-THT-PROMPT with Hard Rock Cafe project

---

## Session Metrics

| Metric | Value |
|--------|-------|
| QA Agents deployed | 3 (Integration, Workflow Logic, Content) |
| Verification agents deployed | 4 (n8n, Airtable, Drive, Local JSON) |
| Critical bugs found | 9 |
| Major issues found | 8 |
| Documentation issues found | 6 |
| Files reviewed | 19 |
| Deliverables graded | 19 |

---

```
============================================
TOUGHLOVE REPORT: THT Iconic Brand Timelapse
============================================
QA Grade:       D- (workflow JSONs drag down A-level specs)
Launch Ready:   NO
Critical Bugs:  9
Major Issues:   8
Doc Issues:     6
Specs Grade:    A (average across spec kit)
Infra Grade:    A (Airtable + Drive + Music verified)
Workflow Grade:  D- (all 4 have critical bugs)
============================================
```
