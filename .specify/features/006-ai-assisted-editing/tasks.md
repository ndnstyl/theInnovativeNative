# Tasks: AI-Assisted Editing Pipeline + Premiere Pro Integration

**Input**: Design documents from `.specify/features/006-ai-assisted-editing/`
**Prerequisites**: plan.md (required), spec.md (required)

## Format: `[ID] [P?] [Story] Description (Agent)`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story (US1-US8)
- **(Agent)**: Assigned agent from roster

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project structure, dependencies, environment validation

- [ ] T001 [P] Verify Python 3.9+ available on editor workstation; verify `xml.etree.ElementTree` import works (Builder)
- [ ] T002 [P] Create `projects/004-bowtie-bullies/media/grade/` directory (Builder)
- [ ] T002.5 [P] Run `prep_premiere_assets.py --dry-run` against EP-001 to audit asset availability on disk (Editor)
  - Non-blocking — script handles missing files gracefully with warnings
- [ ] T003 [P] Verify existing Timeline EDL JSON fixture is valid: `projects/004-bowtie-bullies/episodes/EP-001/EP-001-marathon-continues-timeline.json` — confirm `episode_id`, `fps`, `tracks`, `master_output` keys present (Editor)
- [ ] T004 [P] Verify `scripts/timeline_to_ffmpeg.py` `load_timeline()` is importable from sibling script (test `from timeline_to_ffmpeg import load_timeline`) (Builder) (scripts are now in scripts/shared/)

**Checkpoint**: Environment validated, ready for implementation

---

## Phase 2: Tier 1 MVP — CLI Pipeline Tools

### User Story 3 — Color Grade LUT (P1) — FIRST because other scripts reference it

**Goal**: Generate BowTie-Grade.cube matching FFMPEG color grade
**Independent Test**: Load .cube in Premiere Lumetri, compare against FFMPEG reference frame
**Agent**: Editor (post-production domain)

- [ ] T005 [US3] Create `scripts/shared/hald_to_cube.py` — mathematical LUT generator (~60 lines) (Editor)
  - Pure Python stdlib (no PIL, no FFMPEG dependency)
  - Compute `eq=saturation=0.75:contrast=1.15:brightness=-0.03` mathematically:
    - For each (r,g,b) in normalized 0-1 range on a 33³ grid:
    - Compute luma: `Y = 0.299*r + 0.587*g + 0.114*b`
    - Apply saturation: `r' = Y + sat*(r-Y)`, same for g,b (sat=0.75)
    - Apply contrast: `r'' = 0.5 + contrast*(r'-0.5)` (contrast=1.15)
    - Apply brightness: `r''' = r'' + brightness` (brightness=-0.03)
    - Clamp to [0,1]
  - Output format: standard `.cube` with `TITLE`, `LUT_3D_SIZE 33`, RGB triplets
  - CLI: `python scripts/shared/hald_to_cube.py --output BowTie-Grade.cube --size 33 --saturation 0.75 --contrast 1.15 --brightness -0.03`
- [ ] T006 [US3] Generate `projects/004-bowtie-bullies/media/grade/BowTie-Grade.cube` using `hald_to_cube.py` (Editor)
  - Run the script with BowTie parameters
  - Validate: file loads in any .cube viewer, 33³ = 35,937 RGB lines + header
- [ ] T005.5 [US3] Compare HALD pipeline output against pure-math output — both vs FFMPEG reference frame (Editor)
  - Generate .cube via Approach A (HALD + FFMPEG) and Approach B (pure math)
  - Compare both against FFMPEG-rendered reference frame
  - If Approach A matches better, use it as primary; keep Approach B as fallback

### User Story 2 — Asset Folder Preparation (P1)

**Goal**: Organize timeline-referenced assets into Premiere-ready folder structure
**Independent Test**: Run against EP-001 timeline, verify folder tree + manifest
**Agent**: Builder (Python/automation domain) + Editor (track mapping knowledge)

- [ ] T007 [US2] Create `scripts/shared/prep_premiere_assets.py` (~120 lines) (Builder)
  - Import `load_timeline()` from `timeline_to_ffmpeg.py`
  - argparse CLI: `prep_premiere_assets.py timeline.json --output dir [--symlink] [--base-path dir]`
  - Create 6-folder bin structure per plan.md
  - Walk video track: sort into Intro/, Outro/, Stills/, Overlays/ based on clip type
  - Walk voiceover track → 02-VO/
  - Walk sfx track → 03-SFX/Beds/ or 03-SFX/Events/ based on `type` field
  - Walk music track → 04-Music/
  - Copy `BowTie-Grade.cube` into 05-Grade/ (from `projects/004-bowtie-bullies/media/grade/`)
  - Default: `shutil.copy2()` (physical copy); `--symlink`: `os.symlink()` (relative, opt-in)
  - Generate `manifest.txt` with columns: `Track | Subfolder | Filename | Source Path`
  - Handle missing source files: print WARNING, continue (non-fatal)
- [ ] T008 [US2] Test `prep_premiere_assets.py` against EP-001 timeline fixture (Editor)
  - Run: `python scripts/shared/prep_premiere_assets.py projects/004-bowtie-bullies/episodes/EP-001/EP-001-marathon-continues-timeline.json --output premiere-prep/EP-001`
  - Verify: folder structure created, manifest.txt has all entries, warnings for missing source files are clear

### User Story 1 — Premiere XML Export (P1) — CORE DELIVERABLE

**Goal**: Convert Timeline EDL JSON to Premiere Pro xmeml v4 XML
**Independent Test**: Import XML into Premiere Pro 2026, verify clip placement
**Agent**: Editor (Premiere XML domain) + Builder (Python implementation)

- [ ] T009 [US1] Create `scripts/shared/timeline_to_premiere_xml.py` (~350 lines) (Editor)
  - Import `load_timeline()` from `timeline_to_ffmpeg.py`
  - Functions per plan.md: `seconds_to_frames()`, `build_video_track_xml()`, `build_audio_track_xml()`, `make_clip_element()`, `make_file_element()`, `apply_volume()`, `compile_xmeml()`, `main()`
  - **Timecode shift**: `INTRO_DURATION = 3.5` seconds. All clip `in`/`out` shifted by `+INTRO_DURATION` so intro starts at frame 0
  - **Track mapping**: V1 (video), A1 (voiceover), A2 (SFX beds), A3 (SFX events), A4 (music), A5 (empty/reserved)
  - **Audio duration inference**: For each audio track, compute `clip_end = next_clip.in` (or `computed_duration_seconds` for last clip). Log WARNING if inferred duration < 0.5s.
  - **Volume**: Premiere-native gain via `<effectid>{61756678, 4761696e, 4b657947}</effectid>`, `<parameterid>Gain(dB)</parameterid>`, raw dB `<value>`. Omit `<filter>` block at 0 dB.
  - **Ken Burns labels**: `f"scene-{sid} [KB→{int(zoom_end*100)}%]"` for clips with `zoom_end > 1.0`
  - **File paths**: `<pathurl>file:///{base_path}/{subfolder}/{filename}</pathurl>` using `--base-path` arg
  - **Sequence metadata**: `<name>`, `<duration>`, `<rate>` from timeline JSON
  - **XML output**: `xml.etree.ElementTree` with `xml_declaration=True`, `encoding='UTF-8'`
  - argparse CLI:
    - `timeline_to_premiere_xml.py timeline.json -o output.xml --base-path /path`
    - `timeline_to_premiere_xml.py timeline.json --dry-run` (print track summary)
    - `timeline_to_premiere_xml.py timeline.json --validate` (parse + structural check)
- [ ] T010 [US1] Test XML generation against EP-001 timeline (Editor)
  - `--dry-run`: verify track summary matches expected clip counts (48 video, 35 VO, 45 SFX, 12 music)
  - `--validate`: verify XML parses without errors
  - Generate actual XML, verify with `python -c "import xml.etree.ElementTree as ET; ET.parse('test.xml')"`
  - Spot-check: intro at frame 0, first scene at frame 84 (3.5s * 24fps), outro near end
- [ ] T010.5 [US1] **HUMAN**: Generate reference xmeml from Premiere Pro (Human)
  - Create 3-clip test sequence in Premiere Pro 2026: 1 video clip, 1 audio clip with custom gain, 1 audio clip with default gain
  - File → Export → Final Cut Pro XML
  - Commit as `tests/fixtures/reference-3clip.xml`
  - **BLOCKS T009 implementation** — need correct `<effectid>` values before writing XML builder
- [ ] T011 [US1] Manual Premiere Pro import test (Human/Editor)
  - Import generated XML into Premiere Pro 2026
  - Verify: V1 populated with video clips, A1-A4 populated with audio, A5 empty
  - Verify: clip names show KB hints for stills
  - Verify: no "Media Offline" errors (requires assets in place from T008)
  - Verify: total sequence duration approximately matches `computed_duration_seconds` (635.5s)

### User Story 4 — Premiere Editing SOP (P1)

**Goal**: Step-by-step editing checklist with Premiere shortcuts
**Independent Test**: Follow SOP end-to-end on EP-001, complete in <20 min
**Agent**: Chris (documentation/storytelling) + Editor (technical accuracy)

- [ ] T012 [P] [US4] Create `projects/004-bowtie-bullies/brand/premiere-editing-sop.md` (Chris)
  - Phase 0: Automation — exact CLI commands for pipeline → timeline → asset prep → XML
  - Phase 0 one-liner variant for experienced users
  - Phase 1: Import & Verify (2 min) — Cmd+I, check offline media, verify duration
  - Phase 2: Ken Burns Pass (5-8 min) — batch workflow using Paste Attributes (Cmd+Alt+V)
  - Phase 3: Color Grade (2 min) — Adjustment Layer on V2, Lumetri load BowTie-Grade.cube, Add Noise (20% Uniform), Unsharp Mask (50/5.0/0), Vignette (-1.2/39)
  - Phase 4: Audio Mix (3 min) — Essential Sound panel, tag A1 as Dialogue, A4 as Music, enable ducking (-8dB, 500ms fade)
  - Phase 5: Flow Pass (3-5 min) — 2x playback scan for problems
  - Phase 6: Export (1 min) — H.264, 16 Mbps, AAC 320 kbps, -14 LUFS
  - Don't Forget Checklist — all quality gates
  - Effects NOT in LUT (must apply manually): Unsharp Mask, Add Noise, Vignette — document exact Premiere values
- [ ] T013 [US4] Technical review of SOP (Editor)
  - Verify all keyboard shortcuts are correct for Premiere Pro 2024/2025/2026
  - Verify Lumetri settings match FFMPEG grade filter exactly
  - Verify Essential Sound ducking settings produce acceptable results
  - Verify export settings match `master_output` from timeline JSON
  - Verify "Don't Forget Checklist" catches all critical items from spec

**Checkpoint**: Tier 1 MVP complete — CLI tools + LUT + SOP all functional

---

## Phase 3: Integration & Orchestration

**Purpose**: Connect CLI tools to existing n8n pipeline, upload deliverables

- [ ] T014 [US1] Design n8n BowTie Master Orchestrator extension spec (parallel branch for Premiere XML) (Builder)
  - Spec document: describe parallel branch after Timeline EDL JSON Code node
  - New nodes: Execute Command (prep_premiere_assets.py), Execute Command (timeline_to_premiere_xml.py), Google Drive Upload (XML), Airtable Update (Premiere XML URL)
  - Use Merge v3.2 pattern to sync FFMPEG and Premiere branches before final status update
  - Include exact node configs, credential references (Drive: `53ssDoT9mG1Dtejj`, Airtable: `YCWFwTIXwnTpVy2y`)
  - **NOTE**: Builder writes SPEC ONLY. User deploys to live n8n instance. User tests.
- [ ] T015 [P] Add 2 fields to Airtable Episodes table (Data)
  - Table ID: `tblh3Mrp7HhQ4wPQ5`
  - Fields: `Premiere XML URL` (URL type), `Premiere Prep Path` (Single line text)
  - Use Airtable API: `POST /meta/bases/appTO7OCRB2XbAlak/tables/tblh3Mrp7HhQ4wPQ5/fields`
  - Verify existing fields first (per constitution: check before migration)
- [ ] T016 Upload deliverables to Google Drive (Comms)
  - Upload `BowTie-Grade.cube` to `TIN Marketing > BowTie Bullies > Assets > Grade/`
  - Upload `premiere-editing-sop.md` to `TIN Marketing > BowTie Bullies > docs/`
  - Get shareable links, update Airtable Deliverables table
  - Per constitution: "No deliverable complete without Google Drive URL"
- [ ] T017 Log Airtable Task records for all Tier 1 work (Data)
  - Create Task records in Airtable Tasks table for T005-T016
  - Link to Project: BowTie Bullies
  - Include: Title, Assignee, Status, Priority, Description
- [ ] T038 Per-agent Time Entry logging for all session work (All agents)
  - Each agent logs Time Entry to Airtable: Entry Date, Agent, Project, Hours, Description, Tokens
  - Per constitution shutdown checklist — mandatory
- [ ] T039 Drew verification of all logged work (Drew)
  - Verify: all tasks visible in Airtable Tasks table
  - Verify: all time entries logged
  - Verify: no orphan work (work done but not tracked)

**Checkpoint**: Tier 1 fully integrated with existing pipeline infrastructure

---

## Phase 4: Tier 2 — Backend API (US5)

**Goal**: Node.js API server wrapping PySceneDetect + Whisper + pacing analysis
**Independent Test**: POST video → GET results → verify scene cuts + transcript
**Agent**: Builder (backend/API domain)

**Prerequisites**: T006 (WhisperX installation on server, documented in builder-learnings.md 2026-02-11)

- [ ] T018 [P] [US5] Initialize `roughcut-app/` Next.js project with dependencies (Builder)
  - `npx create-next-app@latest roughcut-app --typescript --tailwind --app --src-dir`
  - Add deps: `zustand`, `express`, `cors`, `multer`, `uuid`
  - Add dev deps: `@types/express`, `@types/multer`, `concurrently`
  - Configure `package.json` scripts: `dev` (concurrent frontend + backend), `build`, `start`
- [ ] T019 [US5] Create `roughcut-app/backend/server.ts` — Express API server (Builder)
  - Port 3001 (frontend proxies to it)
  - Routes: `/api/analysis/upload` (POST, multipart), `/api/analysis/status/:id` (GET), `/api/analysis/result/:id` (GET), `/api/sequence/export` (POST)
  - File upload: `multer` to `roughcut-app/.data/uploads/`
  - In-memory job queue with UUID job IDs
  - Status progression: `queued` → `processing` → `complete` / `error`
- [ ] T020 [US5] Create `roughcut-app/backend/workers/sceneDetect.ts` — PySceneDetect wrapper (Builder)
  - Spawn: `python3 -m scenedetect -i {video} detect-content list-scenes -o {tmpdir}`
  - Parse CSV output → `scene_cuts[]` array with timecodes
  - Error handling: PySceneDetect not installed → 503 with install instructions
- [ ] T021 [US5] Create `roughcut-app/backend/workers/transcribe.ts` — Whisper wrapper (Builder)
  - Spawn: `python3 -c "import whisperx; ..."` (reuse T006 venv path: `/opt/whisperx/bin/python3`)
  - Parse JSON output → `transcript[]` array with text + timestamps
  - Fallback: if whisperx unavailable, try `whisper` base package
- [ ] T022 [US5] Create `roughcut-app/backend/workers/pacing.ts` — pacing analysis (Builder)
  - Compute from scene_cuts: average shot duration, min, max, std dev
  - Generate histogram data (bins: 0-1s, 1-2s, 2-3s, 3-5s, 5-10s, 10s+)
  - Pure TypeScript, no external deps
- [ ] T023 [US5] Test backend API with sample video file (Builder)
  - Upload a short (30s) video
  - Poll status until complete
  - Verify all three analysis results present
  - Verify error handling for missing dependencies

**Checkpoint**: Backend API functional — can analyze video and return structured results

---

## Phase 5: Tier 2 — Frontend UI (US6)

**Goal**: React/Next.js UI with media library, analysis dashboard, timeline, export
**Independent Test**: Import footage, see analysis, build timeline, export XML
**Agent**: Creative (frontend/visual domain) + Builder (integration)

- [ ] T024 [P] [US6] Create `roughcut-app/src/store/project.ts` — Zustand state management (Creative)
  - State: projects[], currentProject, mediaFiles[], analysisJobs[], timeline, exportState
  - Actions: createProject, importMedia, startAnalysis, updateTimeline, exportSequence
- [ ] T025 [P] [US6] Create `roughcut-app/src/app/page.tsx` — Project Dashboard (Creative)
  - Project list with cards (name, date, media count, status)
  - "New Project" button, "Import Existing Timeline JSON" button
  - Route to `/project/[id]` on click
- [ ] T026 [US6] Create `roughcut-app/src/components/MediaLibrary.tsx` — drag-and-drop media import (Creative)
  - Drop zone for video/audio files
  - Thumbnail generation (video: first frame via `<video>` element, audio: waveform icon)
  - Metadata badges: duration, resolution, codec, file size
  - Transcription status badge (pending/complete)
- [ ] T027 [US6] Create `roughcut-app/src/components/AnalysisDashboard.tsx` — results display (Creative)
  - Cuts table: scene number, start timecode, end timecode, duration
  - Clickable rows jump to position in timeline/preview
  - Searchable transcript with timestamp links
  - PacingHistogram component using chart.js
- [ ] T028 [US6] Create `roughcut-app/src/components/TimelineView.tsx` — timeline builder (Creative)
  - Multi-track view: video, VO, SFX, music tracks
  - Clip thumbnails on video track, waveforms on audio tracks
  - Trim handles (drag to adjust in/out points)
  - AI suggestion overlays (highlighted cut points, pacing annotations)
  - Zoom in/out, scroll
  - Library: wavesurfer.js for waveform rendering
- [ ] T029 [US6] Create `roughcut-app/src/components/ExportPanel.tsx` — export to Premiere (Creative)
  - Format selector: Premiere XML, EDL, JSON
  - Quality options
  - "Export" button → calls `/api/sequence/export` or runs `timeline_to_premiere_xml.py` locally
  - Download link for generated file
  - "Send to Premiere" button (US8, placeholder initially)
- [ ] T030 [US6] Create `roughcut-app/src/app/project/[id]/page.tsx` — main project view (Creative)
  - Tab layout: Media, Analysis, Timeline, Export
  - Responsive layout for different screen sizes
  - Loading states for analysis jobs

**Checkpoint**: Frontend UI functional — full workflow from import to export

---

## Phase 6: Tier 2 — Workflow Presets (US7)

**Goal**: Preset editing styles for automated rough cut generation
**Agent**: Creative (UI) + Builder (preset logic)

- [ ] T031 [P] [US7] Create `roughcut-app/src/components/WorkflowPresets.tsx` — preset selector (Creative)
  - 4 preset cards: Quick Rough, Fast Cut Montage, Interview, Custom
  - Each card shows description and parameter summary
  - Custom card shows sliders for cut frequency, silence threshold, pacing intensity
- [ ] T032 [US7] Implement preset application logic in `roughcut-app/src/services/timeline.ts` (Builder)
  - Quick Rough: remove silence gaps, keep all dialogue segments
  - Fast Cut Montage: target 1.2s average shot duration, rhythmic cuts
  - Interview: preserve longer takes, focus on speaker segments (detected from transcript)
  - Custom: expose all parameters
  - All presets output Timeline EDL JSON format (compatible with XML export)

**Checkpoint**: Presets generate different rough cut variants

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: QA, documentation, integration testing

- [ ] T033 End-to-end test: pipeline.json → timeline.json → asset prep → XML → Premiere import (Editor)
  - Full pipeline against EP-001 data
  - Verify: clips on correct tracks, correct times, correct volumes
  - Verify: Ken Burns hints in clip names
  - Verify: BowTie-Grade.cube loads in Lumetri
  - Verify: total duration within 5% of 635.5s target
- [ ] T034 [P] SOP walkthrough test — follow SOP on EP-001 XML import, time the process (Human)
  - Target: complete polish pass in under 20 minutes
  - Note any unclear steps or missing information
  - Feed corrections back to Chris for SOP update
- [ ] T035 [P] Drew QA review — verify all deliverables against spec acceptance criteria (Drew)
  - Check: spec.md user stories have all acceptance scenarios covered
  - Check: all tasks have agent assignments
  - Check: no gaps between spec requirements and task coverage
  - Check: existing infrastructure reused (no unnecessary new tables, workflows, etc.)
  - Check: constitution compliance (Airtable logging, Drive upload, Drew visibility)
  - Kick back anything out of spec or alignment
- [ ] T036 Update `.specify/memory/learnings/editor-learnings.md` with Premiere XML patterns (Editor)
  - Document: xmeml v4 structure, timecode math, volume encoding, KB hint pattern
  - Document: gotchas discovered during implementation
- [ ] T037 Update `.specify/memory/learnings/shared-learnings.md` with cross-agent patterns (Drew)
  - Document: Premiere XML export pipeline pattern (reusable for other projects)
  - Document: LUT generation from FFMPEG eq filter (mathematical approach)

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ─── no deps ──────────────────────────────────────── START
    │
Phase 2 (Tier 1 MVP) ─── depends on Phase 1
    │   T005→T006 (LUT script → generate .cube)
    │   T007→T008 (asset prep → test)
    │   T010.5 (human ref XML) → T009→T010→T011 (XML script → test → Premiere import)
    │   T012→T013 (SOP → technical review)
    │   Note: T005-T006 should complete first (T007 copies .cube into prep folder)
    │   Note: T007 can run in parallel with T009 (different files)
    │   Note: T012 can run in parallel with T007/T009 (documentation, no code deps)
    │
Phase 3 (Integration) ─── depends on Phase 2 completion
    │   T014, T015, T016, T017 can ALL run in parallel
    │
Phase 4 (Backend) ─── depends on Phase 1 only (can start parallel to Phase 2)
    │   T018→T019→T020/T021/T022→T023
    │
Phase 5 (Frontend) ─── depends on Phase 4 (backend API must exist)
    │   T024/T025 in parallel → T026→T027→T028→T029→T030
    │
Phase 6 (Presets) ─── depends on Phase 5
    │   T031/T032 in parallel
    │
Phase 7 (Polish) ─── depends on ALL previous phases
    │   T033→T034 (E2E test before SOP walkthrough)
    │   T035 in parallel with T033
    │   T036/T037 after all implementation complete
```

### Parallel Opportunities (Tier 1 — Maximum Parallelism)

**Wave 1** (start immediately):
- Human: T010.5 (generate reference XML from Premiere Pro — blocks T009)
- Editor: T005 (hald_to_cube.py) + T003 (validate fixture)
- Builder: T001 (env check) + T002 (create grade dir) + T004 (import test)
- Chris: T012 (SOP draft — can write from plan.md without waiting for code)

**Wave 2** (after Wave 1):
- Editor: T006 (generate .cube) + T009 (timeline_to_premiere_xml.py)
- Builder: T007 (prep_premiere_assets.py)
- Chris: continues T012

**Wave 3** (after Wave 2):
- Editor: T010 (test XML) + T008 (test asset prep) + T013 (review SOP)
- Builder: T014 (n8n extension spec)
- Data: T015 (Airtable fields) + T017 (task records)
- Comms: T016 (Drive uploads)

**Wave 4** (Tier 2, can overlap with Wave 3):
- Builder: T018-T023 (backend API)
- Creative: T024-T025 (store + dashboard, no backend dep for skeleton)

### Agent Workload Summary

| Agent | Tasks | Tier | Est. Hours |
|-------|-------|------|-----------|
| Editor | T003, T005, T006, T008, T009, T010, T011, T013, T033, T036 | 1 | 6-8h |
| Builder | T001, T002, T004, T007, T014, T018-T023, T032 | 1+2 | 8-12h |
| Creative | T024-T031 | 2 | 8-10h |
| Chris | T012 | 1 | 2-3h |
| Data | T015, T017 | 1 | 1h |
| Comms | T016 | 1 | 0.5h |
| Drew | T035, T037 | QA | 1-2h |
| Human | T010.5, T011, T034 | Manual test | 1h |

---

## Implementation Strategy

### MVP First (Tier 1 Only — Target: 1 session)

1. Complete Phase 1 (Setup) — 10 min
2. Complete Phase 2 (Tier 1 MVP) — 4-6h with parallel agents
3. Complete Phase 3 (Integration) — 1h
4. **STOP and VALIDATE**: Import XML into Premiere Pro, run SOP walkthrough
5. Tier 1 is independently valuable — editor can use it immediately

### Incremental Delivery (Tier 2 — Target: 3-4 sessions)

6. Phase 4: Backend API
7. Phase 5: Frontend UI
8. Phase 6: Presets
9. Phase 7: Polish + QA

Each tier adds value without breaking the previous tier.
