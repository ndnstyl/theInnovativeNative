# Implementation Plan: AI-Assisted Editing Pipeline + Premiere Pro Integration

**Branch**: `006-ai-assisted-editing-pp2026` | **Date**: 2026-02-14 | **Spec**: `spec.md`
**Input**: Feature specification from `.specify/features/006-ai-assisted-editing/spec.md`

## Summary

Two-tier implementation: (1) Python CLI tools converting Timeline EDL JSON → Premiere Pro XML + asset prep + LUT + SOP, enabling the human editor to open a fully-assembled rough cut in Premiere Pro and polish it in ~20 minutes; (2) a React/Next.js local app wrapping these tools with AI-powered analysis (PySceneDetect, Whisper), a visual timeline builder, and one-click Premiere export.

## Technical Context

**Language/Version**: Python 3.9+ (Tier 1 CLI), Node.js 20+ / Next.js 14+ / React 18+ (Tier 2 App)
**Primary Dependencies**: Python stdlib only (Tier 1); Next.js, Zustand, PySceneDetect, openai-whisper (Tier 2)
**Storage**: Filesystem (Tier 1); Local FS + IndexedDB (Tier 2)
**Testing**: Manual import into Premiere Pro 2026 (Tier 1); pytest + Playwright (Tier 2)
**Target Platform**: macOS (primary), Linux (n8n server for orchestration)
**Project Type**: Single project (Tier 1 — scripts only), Web app (Tier 2)
**Performance Goals**: XML generation < 2 seconds for 50 clips; AI analysis < 3 min for 10-min video
**Constraints**: Tier 1 MUST have zero pip dependencies (Python 3.9+ stdlib); Premiere XML must be xmeml v4
**Scale/Scope**: 1 user (editor), 1-2 episodes/week, 40-50 clips per episode

## Constitution Check

- [x] Spec kit exists (spec.md, plan.md, tasks.md) — this file
- [x] No new Airtable tables needed (reuse existing Episodes/Scenes/Shorts tables)
- [x] No n8n workflow testing by agents (user-only per constitution)
- [x] Airtable logging required per session (agents must log)
- [x] Google Drive upload for all deliverables
- [x] Drew has visibility through Airtable Tasks table

---

## Existing Infrastructure to REUSE (NOT Recreate)

### Python Scripts (keep as-is, import from)
| Script | What to Reuse | How |
|--------|--------------|-----|
| `scripts/shared/timeline_to_ffmpeg.py` | `load_timeline()` function (lines 22-32) | `from timeline_to_ffmpeg import load_timeline` |
| `scripts/shared/timeline_to_ffmpeg.py` | dB-to-linear pattern (line 125): `10 ** (level / 20)` | Copy pattern into XML builder |
| `scripts/004-bowtie/pipeline_to_timeline.py` | Constants (lines 31-39): `INTRO_DURATION=3.5`, `VO_LEVEL_DB=-13`, etc. | Import or duplicate |
| `scripts/004-bowtie/pipeline_to_timeline.py` | `validate_assets()` (lines 508-537) | Reference pattern for prep script |

### n8n Workflows (extend, don't rebuild)
| Workflow | ID | Reuse Plan |
|----------|-----|-----------|
| BowTie Master Orchestrator (Timeline Assembly branch) | — | Extend with parallel branch: after Timeline EDL JSON generation, add Code node that calls `timeline_to_premiere_xml.py` + `prep_premiere_assets.py` and uploads XML to Google Drive. Same trigger, same input, new output path. |
| WF-BT-MASTER (Orchestrator) | per `bowtie-master-orchestrator.json` | No changes — it already calls the Timeline Assembly branch |
| WF-IMG-* (Image Generation) | Various | No changes — assets are generated upstream |

### Airtable Tables (already exist — extend, don't create)
| Table | ID | Extension Needed |
|-------|-----|-----------------|
| Episodes | `tblh3Mrp7HhQ4wPQ5` | Add fields: `Premiere XML URL` (URL), `Premiere Prep Path` (Text) — **2 fields only, within 3-field budget** |
| Scenes | `tblHsBzmt8Skvq2jX` | No changes |
| Shorts | `tbluPmeXdA4by2Utz` | No changes |
| Tasks | existing | Standard task tracking per constitution |
| Time Entries | existing | Standard per constitution |

### Google Drive Structure (already exists)
| Folder | Drive ID | Notes |
|--------|----------|-------|
| BowTie Bullies Root | `1JVHhmZLK3Rv2pK3W4ZlfYkF6xdeW1a2p` | Parent for all episode folders |
| EP01-EP22 subfolders | Created 2026-02-11 | Each has: scripts, audio, images, overlays, video, shorts |

Upload targets for new deliverables:
- `BowTie-Grade.cube` → `TIN Marketing > BowTie Bullies > Assets > Grade/`
- Premiere XMLs → `TIN Marketing > BowTie Bullies > EP-XXX > video/`
- SOP → `TIN Marketing > BowTie Bullies > docs/`

### n8n Credentials (verified, do not recreate)
| Credential | ID | Used For |
|-----------|-----|----------|
| Google Gemini API | `JbBNLCe83ER3tCwD` | Image generation, AI analysis |
| Google Drive OAuth | `53ssDoT9mG1Dtejj` | File upload/download |
| Airtable PAT | `YCWFwTIXwnTpVy2y` | Record CRUD |

### Patterns to Apply (from shared-learnings.md)
| Pattern | Source | Application |
|---------|--------|-------------|
| Binary data preservation through Code/IF nodes | 2026-02-10 learnings | Tier 2 backend when processing video through n8n |
| Merge v3.2 for parallel sync | 2026-02-09 learnings | Master Orchestrator extension (parallel FFMPEG + Premiere branches) |
| Drive share `uc?export=download` for Airtable previews | 2026-02-12 learnings | Episode Premiere XML preview link |
| n8n workflow update via API — NEVER overwrite | 2026-02-12 learnings | When extending Master Orchestrator |
| FFMPEG audio optimization (128k MP3) | 2026-02-07 learnings | Already applied in existing pipeline |

---

## Project Structure

### Documentation (this feature)

```text
.specify/features/006-ai-assisted-editing/
├── spec.md              # Feature specification (done)
├── plan.md              # This file (done)
└── tasks.md             # Task breakdown (next)
```

### Source Code — Tier 1 (CLI Tools)

```text
scripts/
├── shared/
│   ├── timeline_to_ffmpeg.py          # EXISTING — no changes
│   ├── timeline_to_premiere_xml.py    # NEW — core XML exporter (~350 lines)
│   ├── prep_premiere_assets.py        # NEW — asset folder organizer (~120 lines)
│   └── hald_to_cube.py                # NEW — HALD→cube LUT converter (~60 lines)
├── 004-bowtie/
│   └── pipeline_to_timeline.py        # EXISTING — no changes

projects/004-bowtie-bullies/
├── media/grade/
│   └── BowTie-Grade.cube             # NEW — 33x33x33 3D LUT
└── brand/
    └── premiere-editing-sop.md        # NEW — step-by-step editing checklist
```

### Source Code — Tier 2 (App, future)

```text
roughcut-app/                       # NEW — AI Rough Cut Builder app
├── package.json
├── next.config.js
├── src/
│   ├── app/                        # Next.js App Router pages
│   │   ├── page.tsx                # Project Dashboard
│   │   ├── project/[id]/
│   │   │   ├── page.tsx            # Media Library + Analysis
│   │   │   ├── timeline/page.tsx   # Timeline Builder
│   │   │   └── export/page.tsx     # Export screen
│   │   └── layout.tsx
│   ├── components/
│   │   ├── MediaLibrary.tsx
│   │   ├── AnalysisDashboard.tsx
│   │   ├── TimelineView.tsx
│   │   ├── PacingHistogram.tsx
│   │   ├── TranscriptEditor.tsx
│   │   ├── WorkflowPresets.tsx
│   │   └── ExportPanel.tsx
│   ├── store/
│   │   └── project.ts              # Zustand store
│   └── services/
│       ├── analysis.ts             # API client for backend
│       ├── timeline.ts             # Timeline manipulation
│       └── export.ts               # XML/EDL/JSON export
├── backend/
│   ├── server.ts                   # Express/Fastify API server
│   ├── routes/
│   │   ├── analysis.ts             # /api/analysis/* endpoints
│   │   └── export.ts               # /api/sequence/export
│   ├── workers/
│   │   ├── sceneDetect.ts          # PySceneDetect wrapper
│   │   ├── transcribe.ts           # Whisper wrapper
│   │   └── pacing.ts               # Pacing analysis
│   └── queue/
│       └── jobQueue.ts             # In-memory job queue
└── tests/
    ├── export.test.ts
    └── analysis.test.ts
```

**Structure Decision**: Tier 1 scripts live in `scripts/shared/`. Tier 2 uses `roughcut-app/` (created when Tier 2 begins). Active Premiere project files are in `projects/006-ai-editing/premiere/`.

---

## Tier 1 — Detailed Technical Design

### `timeline_to_premiere_xml.py` — XML Structure

Premiere Pro XML (`<xmeml version="4">`) structure:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE xmeml>
<xmeml version="4">
  <sequence>
    <name>EP-001 — The Marathon Continues</name>
    <duration>{total_frames}</duration>
    <rate><timebase>{fps}</timebase><ntsc>FALSE</ntsc></rate>
    <media>
      <video>
        <track>
          <!-- V1: All video clips -->
          <clipitem id="v-001">
            <name>scene-001 [KB→108%]</name>
            <duration>{clip_frames}</duration>
            <rate><timebase>{fps}</timebase></rate>
            <start>{start_frame}</start>
            <end>{end_frame}</end>
            <in>0</in>
            <out>{clip_frames}</out>
            <file id="file-v-001">
              <name>scene-001.png</name>
              <pathurl>file:///path/to/01-Video/Stills/scene-001.png</pathurl>
              <media>
                <video>
                  <samplecharacteristics>
                    <width>1920</width>
                    <height>1080</height>
                  </samplecharacteristics>
                </video>
              </media>
            </file>
          </clipitem>
          <!-- ... more clips ... -->
        </track>
      </video>
      <audio>
        <track>
          <!-- A1: Voiceover clips with volume -->
          <clipitem id="vo-001">
            <name>scene-001 VO</name>
            <start>{start_frame}</start>
            <end>{end_frame}</end>
            <file id="file-vo-001">
              <pathurl>file:///path/to/02-VO/scene-001.wav</pathurl>
            </file>
            <filter>
              <effect>
                <name>Audio Levels</name>
                <effectid>audiolevels</effectid>
                <parameter>
                  <parameterid>level</parameterid>
                  <name>Level</name>
                  <value>{linear_gain}</value>
                </parameter>
              </effect>
            </filter>
          </clipitem>
        </track>
        <track><!-- A2: SFX Beds --></track>
        <track><!-- A3: SFX Events --></track>
        <track><!-- A4: Music --></track>
        <track><!-- A5: Empty/Reserved --></track>
      </audio>
    </media>
  </sequence>
</xmeml>
```

**Track mapping**: V1 (video), A1 (voiceover), A2 (SFX beds), A3 (SFX events), A4 (music), A5 (empty/reserved).

**Timecode math**:
- All timeline JSON `in`/`out` values are in seconds
- The intro clip has `in: -3.5` — we shift everything by `+INTRO_DURATION` so intro starts at frame 0
- `start_frame = int((clip_in + INTRO_DURATION) * fps)`
- `end_frame = int((clip_out + INTRO_DURATION) * fps)`
- Clip duration frames = `end_frame - start_frame`

**Volume encoding**:
- Each audio clip gets a `<filter>` with `<effect>` containing `<parameter>` for level
- Linear gain = `10 ** (level_db / 20)` (same as FFMPEG pipeline)
- Example: `-13 dB` → `10^(-13/20)` = `0.2239`

**Ken Burns hint**:
- XML cannot encode Motion keyframes natively
- Clip names encode the hint: `f"scene-{sid} [KB→{int(zoom_end*100)}%]"`
- Black transition beats (`zoom_end == 1.0`) get no KB label

**Audio clip duration inference**:
- Audio clips in the timeline JSON have `in` but no `out` field
- Infer end time: `clip_end = next_clip.in` for sequential clips on the same track
- Last clip on track: `clip_end = computed_duration_seconds` from timeline JSON
- Edge case: if inferred duration < 0.5s, log WARNING (possible data issue)
- This applies to all audio tracks: VO, SFX beds, SFX events, music

### `hald_to_cube.py` — LUT Generation

Process:
1. Read graded HALD PNG image (PIL or raw pixel data via stdlib)
2. The image is a `512×512` pixel HALD-8 (8³ = 512 entries per dimension, 512×512 total)
3. Each pixel maps from `(R_in, G_in, B_in)` → `(R_out, G_out, B_out)` based on HALD layout
4. Write as standard `.cube` format:

```
TITLE "BowTie Grade"
LUT_3D_SIZE 33
# Domain (optional)
0.000000 0.000000 0.000000
...
1.000000 1.000000 1.000000
```

**Dual-mode LUT generation**:
- **Approach A (preferred)**: FFMPEG HALD pipeline (exact match guaranteed)
  1. `ffmpeg -f lavfi -i "haldclutsrc=8" -frames:v 1 hald_identity.png`
  2. `ffmpeg -i hald_identity.png -vf "eq=saturation=0.75:contrast=1.15:brightness=-0.03" hald_graded.png`
  3. `python scripts/shared/hald_to_cube.py hald_graded.png --output BowTie-Grade.cube`
- **Approach B (fallback)**: Pure math in YUV space (no FFMPEG needed)
  - For each (r,g,b) in normalized 0-1 range on a 33³ grid
  - Compute luma, apply saturation/contrast/brightness mathematically
  - Less precise than HALD pipeline but zero external dependencies
- T005.5 compares both approaches against FFMPEG reference frame

### `prep_premiere_assets.py` — Folder Logic

1. Read timeline JSON via `load_timeline()`
2. Determine episode_id from JSON
3. Create folder tree:
   ```
   {output}/
   ├── 01-Video/Intro/
   ├── 01-Video/Outro/
   ├── 01-Video/Stills/
   ├── 01-Video/Overlays/
   ├── 02-VO/
   ├── 03-SFX/Beds/
   ├── 03-SFX/Events/
   ├── 04-Music/
   ├── 05-Grade/
   └── 06-Export/
   ```
4. Walk each track, resolve source path relative to CWD or `--base-path`
5. Copy via `shutil.copy2()` (default) or symlink (`--symlink`) each file into the correct subfolder
6. Copy `BowTie-Grade.cube` into `05-Grade/`
7. Write `manifest.txt` listing all files with track assignments

### n8n BowTie Master Orchestrator Extension

**Current flow**: Manual Trigger → Airtable fetch → Code Node (generate Timeline EDL) → Execute Command (FFMPEG) → Drive upload → Airtable update

**Extended flow** (parallel branch after Timeline EDL generation):
```
Code Node (generate Timeline EDL JSON)
    ├── [existing] Execute Command: timeline_to_ffmpeg.py → bash render.sh → Drive upload
    └── [NEW] Execute Command: prep_premiere_assets.py + timeline_to_premiere_xml.py → Drive upload XML
         └── Airtable: Update episode with Premiere XML URL
```

This uses the **Merge v3.2 pattern** from shared-learnings to synchronize both branches before final Airtable status update.

**IMPORTANT**: Builder agent designs the workflow extension spec. User deploys and tests it. Per constitution: "ONLY user tests n8n workflows."

---

## Tier 2 — Technical Design Overview

### Backend Architecture

```
Node.js Express server (port 3001)
    └── /api/analysis/upload    POST  → saves to local temp, queues analysis
    └── /api/analysis/status    GET   → returns job status
    └── /api/analysis/result    GET   → returns structured JSON results
    └── /api/sequence/export    POST  → generates XML/EDL/JSON from timeline

Analysis workers (child_process.spawn):
    └── PySceneDetect: python3 -m scenedetect -i video.mp4 detect-content list-scenes
    └── Whisper: python3 -c "import whisperx; ..." (reuse T006 installation path)
    └── Pacing: computed from scene cuts (JS, no external dependency)
```

### Frontend Architecture

```
Next.js 14 App Router
    └── Zustand store: projects, media, analysis, timeline, export state
    └── Pages: Dashboard, Project (Media + Analysis + Timeline + Export)
    └── Key libraries: wavesurfer.js (waveforms), chart.js (histograms)
```

### Integration with Existing Pipeline

The Tier 2 app can consume the SAME Timeline EDL JSON format:
- Import an existing timeline.json → display on timeline → export as Premiere XML
- OR: Upload raw footage → AI analysis → generate NEW timeline.json → export

This means the app becomes a universal Premiere export tool, not just BowTie-specific.

---

## Complexity Tracking

No constitution violations. All work extends existing infrastructure.

| Decision | Rationale | Alternative Rejected |
|----------|-----------|---------------------|
| Pure stdlib for Tier 1 | Zero dependency, works on any Python 3.9+ | PIL/lxml — adds pip dependency for simple tasks |
| Dual-mode LUT (HALD preferred, math fallback) | HALD gives exact match; math fallback has zero deps | Single approach — either loses precision or gains dependencies |
| roughcut-app/ for Tier 2 | Clean separation from Premiere project files | Reusing vidEdit/ — conflicts with active Premiere project |
| Extend Master Orchestrator not new workflow | Follows constitution "extend before creating" | New WF-BT-006 — unnecessary workflow sprawl |
| Zustand not Redux | Lighter, simpler for local-only state | Redux — overkill for single-user app |
