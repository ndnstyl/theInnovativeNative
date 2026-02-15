# Feature Specification: AI-Assisted Editing Pipeline + Premiere Pro Integration

**Feature Branch**: `006-ai-assisted-editing-pp2026`
**Created**: 2026-02-14
**Status**: Draft
**Input**: PRD — AI Video Rough Cut Builder UI + PRD — AI Video Editing Assistant UI + Premiere Pro XML export plan
**Upstream Dependency**: `005-bowtie-video-pipeline` (spec, Timeline EDL JSON format, FFMPEG pipeline)

---

## Scope Summary

This feature adds a **Premiere Pro editing surface** to the BowTie Bullies video pipeline. It is composed of two tiers:

1. **Tier 1 — CLI Pipeline Tools (MVP)**: Python scripts that convert the existing Timeline EDL JSON into Premiere Pro XML, organize assets into NLE-ready folders, generate a color grade LUT, and provide a step-by-step editing SOP. This enables the human editor to open a fully-assembled rough cut directly in Premiere Pro and apply a quick 20% polish pass.

2. **Tier 2 — AI Rough Cut Builder App**: A local/Electron React + Next.js application that wraps the CLI tools in a visual UI with drag-and-drop media import, AI analysis (scene detection, transcription, pacing), a timeline preview, workflow presets, and one-click export to Premiere Pro XML/EDL/JSON. This is the PRD vision for a reusable tool beyond BowTie.

**Design Philosophy**: Automation handles the 80% rough assembly; the human does the 20% creative polish. Target editing style: Fallout Raccoon (fast b-roll cycling every 3-5s, continuous music bed, text callout overlays).

---

## User Scenarios & Testing

### User Story 1 — Premiere XML Export from Timeline JSON (Priority: P1)

As a video editor, I want to run a single command that converts my timeline EDL JSON into a Premiere Pro XML file so I can open it in Premiere and see all clips on the correct tracks at the correct times.

**Why this priority**: This is the core value proposition — without XML export, there is no Premiere integration. Everything else builds on this.

**Independent Test**: Run `python scripts/shared/timeline_to_premiere_xml.py EP-001-timeline.json -o test.xml --base-path /path/to/assets` and import the resulting XML into Premiere Pro 2026. Verify clips appear on V1, A1-A5 at correct timecodes.

**Acceptance Scenarios**:

1. **Given** a valid timeline EDL JSON (EP-001-marathon-continues-timeline.json), **When** the user runs `timeline_to_premiere_xml.py` with `--base-path`, **Then** a well-formed `<xmeml version="4">` XML file is produced that Premiere Pro imports without errors.
2. **Given** a timeline with negative intro time (-3.5s), **When** the XML is generated, **Then** the intro clip starts at frame 0 and all subsequent clips are shifted by `INTRO_DURATION * fps` frames.
3. **Given** a timeline with ken_burns clips, **When** the XML is generated, **Then** clip names include zoom hint labels like `scene-001 [KB→108%]` (XML cannot encode Motion keyframes).
4. **Given** a timeline with volume levels in dB, **When** the XML is generated, **Then** each clip has a `<parameter>` element with linear gain = `10^(dB/20)`.
5. **Given** the `--dry-run` flag, **When** the user runs the script, **Then** a track summary is printed to stdout and no file is written.
6. **Given** the `--validate` flag, **When** the user runs the script, **Then** the XML is parsed by `xml.etree.ElementTree` and any structural issues are reported.

---

### User Story 2 — Asset Folder Preparation (Priority: P1)

As a video editor, I want all assets referenced in my timeline organized into a clean Premiere-ready folder structure before I import, so I never see "Media Offline" errors.

**Why this priority**: Without organized assets, the XML import will have broken links. This is a prerequisite for US1 to work end-to-end.

**Independent Test**: Run `python scripts/shared/prep_premiere_assets.py EP-001-timeline.json --output premiere-prep/EP-001` and verify the folder structure is created with all referenced files linked/copied.

**Acceptance Scenarios**:

1. **Given** a timeline JSON with video, VO, SFX, and music references, **When** `prep_premiere_assets.py` runs, **Then** the following folder structure is created:
   ```
   premiere-prep/EP-001/
   ├── 01-Video/
   │   ├── Intro/
   │   ├── Outro/
   │   ├── Stills/
   │   └── Overlays/
   ├── 02-VO/
   ├── 03-SFX/
   │   ├── Beds/
   │   └── Events/
   ├── 04-Music/
   ├── 05-Grade/
   └── 06-Export/
   ```
2. **Given** default mode, **When** the script runs, **Then** files are physically copied via `shutil.copy2()`.
3. **Given** the `--symlink` flag, **When** the script runs, **Then** files are symlinked (relative) to save disk space.
4. **Given** the script completes, **When** the user checks the output, **Then** a `manifest.txt` file lists all files with their track assignments.
5. **Given** a referenced asset file does not exist on disk, **When** the script runs, **Then** a warning is printed listing missing files (non-fatal — continues with available files).

---

### User Story 3 — Color Grade LUT (Priority: P1)

As a video editor, I want a .cube LUT file that matches the existing FFMPEG color grade so I can apply the same look in Premiere's Lumetri Color panel.

**Why this priority**: Without the LUT, the Premiere render won't match the FFMPEG reference render. Visual consistency is non-negotiable for the brand.

**Independent Test**: Load `BowTie-Grade.cube` in Premiere's Lumetri → Creative → Browse. Compare a frame against the FFMPEG-rendered reference. Saturation, contrast, and brightness should visually match.

**Acceptance Scenarios**:

1. **Given** the FFMPEG color grade filter `eq=saturation=0.75:contrast=1.15:brightness=-0.03`, **When** `hald_to_cube.py` processes a HALD identity image graded with this filter, **Then** the output .cube file produces the same color transform when loaded in Lumetri.
2. **Given** the .cube file, **When** loaded in Premiere, **Then** Lumetri accepts it without errors (standard 33x33x33 3D LUT format).
3. **Given** non-color effects from the FFMPEG grade (unsharp, noise, vignette), **When** the LUT is generated, **Then** these are NOT baked into the LUT (documented separately in the SOP as manual Premiere effects).

---

### User Story 4 — Premiere Editing SOP (Priority: P1)

As a self-described mediocre editor who prioritizes speed, I want a step-by-step editing checklist with exact Premiere keyboard shortcuts so I can complete a polish pass in under 20 minutes.

**Why this priority**: The SOP is the human interface to the automation. Without it, the editor won't know what to do after importing the XML.

**Independent Test**: Follow the SOP from Phase 0 through Phase 6 on EP-001. The entire process (automation + manual polish) should complete in under 20 minutes for a 10-minute episode.

**Acceptance Scenarios**:

1. **Given** the SOP document, **When** the editor reads Phase 0, **Then** they have exact CLI commands to generate the timeline, prep assets, and generate XML.
2. **Given** the SOP, **When** the editor reaches Phase 2 (Ken Burns), **Then** they have a batch workflow using Paste Attributes (`Cmd+Alt+V`) to apply Ken Burns to all stills in under 8 minutes.
3. **Given** the SOP, **When** the editor reaches Phase 3 (Color Grade), **Then** they have exact Lumetri, Add Noise, Unsharp Mask, and Vignette settings that match the FFMPEG render.
4. **Given** the SOP, **When** the editor reaches Phase 4 (Audio), **Then** they use Essential Sound panel ducking (not manual keyframes) for VO-triggered music ducks.
5. **Given** the SOP, **When** the editor reaches Phase 6 (Export), **Then** export settings match: H.264, 16 Mbps target, AAC 320 kbps, -14 LUFS normalization.
6. **Given** the SOP, **When** the editor finishes, **Then** a "Don't Forget Checklist" catches any missed items before export.

---

### User Story 5 — AI Analysis Backend API (Priority: P2)

As a power user, I want to run AI analysis workflows (scene detection, transcription, pacing) on uploaded footage via a local API server so the results feed into rough cut generation.

**Why this priority**: This is the foundation for the Rough Cut Builder UI. The backend must exist before the frontend can display anything.

**Independent Test**: POST a video file to `/api/analysis/upload`, then GET `/api/analysis/result` and verify scene cuts, transcript, and pacing metrics are returned as structured JSON.

**Acceptance Scenarios**:

1. **Given** a video file (mp4/mov), **When** uploaded to `/api/analysis/upload`, **Then** the server queues PySceneDetect scene analysis, Whisper transcription, and pacing computation.
2. **Given** an analysis job ID, **When** the user polls `/api/analysis/status`, **Then** the server returns `queued`, `processing`, or `complete` with progress percentage.
3. **Given** a completed analysis, **When** the user GETs `/api/analysis/result`, **Then** JSON is returned containing: `scene_cuts[]` (timecodes), `transcript[]` (text + timestamps), `pacing_metrics` (average shot duration, histogram data).
4. **Given** an invalid video format, **When** uploaded, **Then** the server returns 400 with a descriptive error message.
5. **Given** PySceneDetect or Whisper is not installed, **When** analysis is requested, **Then** the server returns 503 with installation instructions.

---

### User Story 6 — Rough Cut Builder Frontend UI (Priority: P2)

As a video creator, I want a visual interface where I can import footage, see AI analysis results on a timeline, adjust cuts, and export to Premiere Pro XML.

**Why this priority**: The UI makes the CLI tools accessible to non-technical editors. Depends on US5 backend.

**Independent Test**: Open the app in browser, import a sample video, see analysis dashboard populate, drag clips on timeline, click Export → Premiere XML, and verify the output opens in Premiere.

**Acceptance Scenarios**:

1. **Given** the app is running, **When** the user opens the Project Dashboard, **Then** they see a project list with "New Project" and "Import" buttons.
2. **Given** a new project, **When** the user drags video files into the Media Library, **Then** thumbnails appear with metadata badges (duration, resolution, codec).
3. **Given** uploaded media, **When** analysis completes, **Then** the Analysis Dashboard shows: cuts table with timecodes, searchable transcript with timestamp links, pacing histogram chart.
4. **Given** analysis results, **When** the user opens Timeline Builder, **Then** clips appear on tracks with thumbnail + waveform views, trim handles, and AI suggestion overlays.
5. **Given** a built timeline, **When** the user selects Export → Premiere Pro XML, **Then** a valid xmeml v4 XML is generated using the same logic as `timeline_to_premiere_xml.py`.
6. **Given** the Timeline Builder, **When** the user hovers over an AI-suggested cut point, **Then** a tooltip shows the rationale (e.g., "detected key phrase here", "scene change detected").

---

### User Story 7 — Workflow Presets (Priority: P3)

As a video creator, I want to select preset editing styles (Quick Rough, Fast Cut Montage, Interview, Custom) so I can generate different rough cut variants without manual parameter tuning.

**Why this priority**: Presets improve UX but are not required for core functionality. Nice-to-have after the core UI works.

**Independent Test**: Select "Fast Cut Montage" preset, generate rough cut, verify average shot duration is ~1.2s. Select "Interview" preset, verify longer takes with speaker focus.

**Acceptance Scenarios**:

1. **Given** the Workflow Presets panel, **When** the user selects "Quick Rough", **Then** the system removes silence, keeps dialogue, and generates a timeline.
2. **Given** "Fast Cut Montage" preset, **When** applied, **Then** average shot duration targets ~1.2 seconds with rhythmic cut patterns.
3. **Given** "Interview" preset, **When** applied, **Then** longer takes are preserved with focus on speaker content segments.
4. **Given** "Custom" preset, **When** selected, **Then** the user can adjust: cut frequency, silence removal threshold, pacing intensity, and scoring rules.

---

### User Story 8 — Direct Adobe Integration (Priority: P3)

As a power user, I want to send my sequence directly to Premiere Pro via Adobe APIs without manually importing XML.

**Why this priority**: Quality-of-life improvement. XML import works fine; this just removes one manual step.

**Independent Test**: Click "Send to Premiere" in the app. Premiere opens with the sequence loaded.

**Acceptance Scenarios**:

1. **Given** a generated timeline, **When** the user clicks "Send to Premiere", **Then** Premiere Pro opens (or activates if already open) with the sequence imported.
2. **Given** Premiere Pro is not installed, **When** the user clicks "Send to Premiere", **Then** a fallback dialog offers XML file download instead.

---

### Edge Cases

- What happens when timeline JSON has 0 video clips? → XML should still generate with empty video track, audio-only sequence.
- What happens when a clip's `in` time is negative (intro)? → Shift all timecodes so intro starts at frame 0.
- What happens when two clips overlap on the same track? → Log warning, place second clip immediately after first (no gap, no overlap).
- What happens when `--base-path` points to a non-existent directory? → Error with clear message before generating XML.
- What happens when a music clip has no `level_db`? → Default to -28 dB (matches `pipeline_to_timeline.py` constant `SFX_BED_LEVEL_DB`).
- What happens when the HALD identity image is corrupted? → `hald_to_cube.py` should validate dimensions before processing.
- What happens when a .cube LUT exceeds Premiere's 64^3 limit? → Use 33^3 (standard, widely compatible).
- What happens when the Whisper model isn't available locally? → Fall back to smaller model or return clear error.
- What happens when PySceneDetect produces 0 cuts? → Return empty scene_cuts array, don't crash.
- What happens when an audio clip has no `out` field? → Infer duration: `clip_end = next_clip.in` for all clips except last; last clip: `clip_end = computed_duration_seconds`. Log WARNING if inferred duration < 0.5s.
- What happens when `<effectid>audiolevels</effectid>` is wrong for the user's Premiere version? → T010.5 requires a human-generated reference XML from Premiere Pro to verify the correct effectid. Implementation BLOCKS on this reference file.

---

## Requirements

### Functional Requirements

#### Tier 1 — CLI Pipeline Tools (P1)

- **FR-001**: `timeline_to_premiere_xml.py` MUST read Timeline EDL JSON and output valid `<xmeml version="4">` XML importable by Premiere Pro 2024/2025/2026.
- **FR-002**: XML MUST map tracks as: V1 (video), A1 (voiceover), A2 (SFX beds), A3 (SFX events), A4 (music), A5 (empty/reserved).
- **FR-003**: XML MUST use frame-based timecodes (`start_frame = int(seconds * fps)`).
- **FR-004**: XML MUST shift negative intro times so intro starts at frame 0; all subsequent clips shift by `INTRO_DURATION * fps` frames.
- **FR-005**: XML MUST encode clip volume as Premiere-native gain: `<effectid>{61756678, 4761696e, 4b657947}</effectid>` with `<parameterid>Gain(dB)</parameterid>` and raw dB `<value>`. Omit `<filter>` block entirely for clips at 0 dB (default gain).
- **FR-006**: Ken Burns clips MUST include zoom hint in clip name: `"scene-001 [KB→108%]"`.
- **FR-007**: XML `<pathurl>` MUST use `file://localhost/` URI scheme with absolute paths from `--base-path`.
- **FR-008**: `prep_premiere_assets.py` MUST create the 6-folder bin structure with physical copies (default) or symlinks (`--symlink`).
- **FR-009**: `prep_premiere_assets.py` MUST generate `manifest.txt` listing all files with track assignments.
- **FR-010**: `hald_to_cube.py` MUST convert a graded HALD identity image to a 33x33x33 .cube LUT file.
- **FR-011**: `BowTie-Grade.cube` MUST match the FFMPEG grade `eq=saturation=0.75:contrast=1.15:brightness=-0.03`.
- **FR-012**: The SOP MUST cover 7 phases: Automation, Import, Ken Burns, Color Grade, Audio Mix, Flow Pass, Export.
- **FR-013**: The SOP MUST include exact Premiere keyboard shortcuts for every action.
- **FR-014**: The SOP MUST include a "Don't Forget Checklist" with all quality gates.
- **FR-015**: All Python scripts MUST use stdlib only — no external dependencies (xml.etree, json, argparse, pathlib, os, shutil).

#### Tier 2 — AI Rough Cut Builder App (P2-P3)

- **FR-016**: Backend API MUST accept video uploads (mp4, mov) up to 10 GB.
- **FR-017**: Backend MUST run PySceneDetect for scene cut detection.
- **FR-018**: Backend MUST run Whisper for transcription with timestamps.
- **FR-019**: Backend MUST compute pacing metrics (average shot duration, histogram).
- **FR-020**: Backend MUST provide job queue with status polling (`queued` → `processing` → `complete`).
- **FR-021**: Frontend MUST display Project Dashboard with project list and import.
- **FR-022**: Frontend MUST display Media Library with thumbnails, metadata, transcription badges.
- **FR-023**: Frontend MUST display Analysis Dashboard with cuts table, searchable transcript, pacing histogram.
- **FR-024**: Frontend MUST display Timeline Builder with thumbnail + waveform tracks, trim handles, AI overlays.
- **FR-025**: Frontend MUST export Premiere Pro XML, EDL, and JSON formats.
- **FR-026**: Frontend MUST support 4 workflow presets: Quick Rough, Fast Cut Montage, Interview, Custom.
- **FR-027**: Frontend MUST validate video files on import (duration, resolution, codec support).
- **FR-028**: All analysis data MUST be stored locally (filesystem or IndexedDB) — no cloud dependency.

### Key Entities

- **Timeline EDL JSON**: The intermediate format between pipeline.json and all output formats (FFMPEG, Premiere XML, UI). Schema defined in `timeline-edl-schema.json`.
- **Premiere XML (xmeml v4)**: Industry-standard NLE interchange format. Structures: `<xmeml>` → `<sequence>` → `<media>` → `<video>`/`<audio>` → `<track>` → `<clipitem>`.
- **HALD Identity Image**: A neutral 3D LUT encoded as a PNG image. When color-graded and re-read, it captures the transform as a .cube LUT.
- **Analysis Job**: Backend entity tracking: job_id, status, input_file, scene_cuts[], transcript[], pacing_metrics, created_at, completed_at.
- **Project**: Frontend entity: id, name, media_files[], analysis_jobs[], timelines[], created_at.

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: `timeline_to_premiere_xml.py` generates valid XML that imports into Premiere Pro without errors for 100% of well-formed timeline JSONs.
- **SC-002**: Full automation pipeline (timeline → asset prep → XML) completes in under 10 seconds for a 50-clip episode.
- **SC-003**: Human editor completes a full polish pass on a 10-minute episode in under 20 minutes using the SOP.
- **SC-004**: BowTie-Grade.cube visually matches FFMPEG reference render (verified by human side-by-side comparison).
- **SC-005**: (Tier 2) Time from video upload to initial rough cut preview is under 3 minutes for a 10-minute video.
- **SC-006**: (Tier 2) Export reliability: 100% valid XML/JSON/EDL output from the app.
- **SC-007**: (Tier 2) 80% of users select a built-in preset rather than Custom.

---

## Technical Constraints

### Tier 1 Constraints
- Python 3.9+ stdlib only — no pip dependencies
- Must reuse `load_timeline()` from `timeline_to_ffmpeg.py`
- Premiere XML must be xmeml version 4 (not version 5/FCP X format)
- .cube LUT must be 33x33x33 (standard, Lumetri-compatible)
- All file paths in XML use `file://` URI scheme

### Tier 2 Constraints
- Frontend: Next.js 14+ with React 18+, Zustand for state
- Backend: Node.js server wrapping Python AI tools
- Storage: Local filesystem (Electron) or IndexedDB (browser)
- AI dependencies: PySceneDetect, Whisper (openai-whisper), CLIP (optional)
- Must work fully offline after initial setup — no cloud API calls required

### Existing Pipeline Integration
- Timeline EDL JSON schema is frozen — no modifications to `pipeline_to_timeline.py` or `timeline_to_ffmpeg.py`
- New scripts read the same JSON format as `timeline_to_ffmpeg.py`
- The Premiere XML path is a parallel output, not a replacement for FFMPEG

---

## Agent Domain Mapping

| Domain | Agent | User Stories | Rationale |
|--------|-------|-------------|-----------|
| Python scripts, API integrations | Builder | US1, US2, US5 | Python/n8n/API domain expert |
| Timeline EDL, FFMPEG, audio mix, Premiere XML | Editor | US1, US2, US3, US4 | Post-production domain expert |
| React/Next.js UI, Remotion, visuals | Creative | US6, US7, US8 | Frontend/visual domain expert |
| SOP writing, brand voice, narrative | Chris | US4 | Storytelling/documentation expert |
| Airtable tracking, project data | Data | Cross-cutting | Tracking and visibility |
| QA, task routing, oversight | Drew | Cross-cutting | PM enforcement |
