# 005 — BowTie Bullies Video Pipeline Tasks

**Project**: BowTie Bullies — The Aftermath
**Created**: 2026-02-11
**Spec**: `spec.md` (this directory)

---

## Status Key

- [x] Complete
- [ ] Pending
- [~] In Progress
- [!] Blocked

---

## Infrastructure

- [x] **T001**: Fix render.ts ProRes config — ProRes 4444 LT, `yuva444p` 8-bit pixel format
- [x] **T002**: Register QuestionMarks composition in Root.tsx — 16:9 + 9:16 variants. Also registered StatCallout, QuoteCard, CaptionTrack (12 total BowTie compositions).
- [x] **T003** (P0): Investigate Gemini/Nano Banana aspect ratio control — documented in `gemini-aspect-ratio-findings.md`. API supports `imageConfig.aspectRatio`; n8n workaround: use HTTP Request node.

## Asset Generation

- [x] **T004**: Create ComfyUI batch workflows — `comfyUI/workflows/boondocks_stills.json` + `comfyUI/workflows/boondocks_ipadapter.json`
- [x] **T005**: Create model verification script — `scripts/check_models.py` validates Animagine XL 4.0, IP-Adapter Plus, ControlNet Canny, CLIP Vision
- [ ] **T006**: Generate Red Nose reference set — P1-P6 canonical stills via Gemini (primary) or ComfyUI. Requires running generation pipeline (human action).
- [ ] **T007**: Build SFX library — source/catalog urban ambient beds + triggered events. Requires sourcing actual audio files (human action).
- [x] **T008**: Document SFX sourcing strategy — `sfx-sourcing-strategy.md` with source priority, Airtable schema, normalization standards

## Scripting & Voice

- [x] **T009**: Create episode script template — `episode-script-template.json` with mandatory fields: AAVE narration, visual prompts, sfx_bed, sfx_events, music_mood, pause_after
- [x] **T010**: Create AAVE writing checklist — `aave-writing-checklist.md` with orthography patterns, code-switching rules, quality checks
- [x] **T011**: Create ElevenLabs SSML template — `ssml-template.xml` with standardized pause marks, prosody rates, volume directives

## Remotion Compositions

- [x] **T012**: Build Remotion CaptionTrack composition — already existed in `BowTie/components/CaptionTrack.tsx`, registered in Root.tsx (16:9 + 9:16)
- [x] **T013**: Build Remotion StatCallout + QuoteCard — `StatCallout.tsx` (animated count-up) + `QuoteCard.tsx` (typewriter animation), registered in Root.tsx

## Post-Production Editor (CRITICAL PATH)

- [x] **T014**: Create Editor agent/skill — `.claude/skills/workers/editor/SKILL.md`
- [x] **T015**: Define Timeline EDL JSON schema — `timeline-edl-schema.json` with formal JSON Schema validation
- [x] **T016**: Create Timeline-to-FFMPEG compiler — `scripts/timeline_to_ffmpeg.py` reads Timeline JSON, generates FFMPEG command with Ken Burns, multi-layer audio, color grade, loudnorm
- [x] **T017**: Create FFMPEG sidechaincompress integration — implemented within `timeline_to_ffmpeg.py` and documented in `sfx-mixing-spec.md`
- [x] **T018**: Create SFX mixing spec — `sfx-mixing-spec.md` with layering order, ducking rules, dB-to-linear conversion, FFMPEG filter patterns
- [x] **T019**: Create FFMPEG shorts extraction script — `scripts/extract_shorts.sh` chops long-form at timestamps, center-crops to 9:16, concatenates intro+clip+outro

## Orchestration

- [x] **T020**: Create episode planning template — `episode-planning-template.md` with episode brief, research sources, structure, shorts extraction, asset requirements
- [x] **T021**: Create n8n workflow skeleton — `n8n-workflow-skeleton.md` with 5 workflows (WF-BT-001 to WF-BT-005), Airtable schema for Episodes/Scenes/Shorts

---

## Dependency Graph

```
T003 (Gemini AR investigation) ✓
 └── T006 (Red Nose reference set) — awaits human execution

T009 (Script template) ✓
 └── T015 (Timeline EDL schema) ✓
      └── T016 (Timeline-to-FFMPEG compiler) ✓
           ├── T017 (Sidechaincompress) ✓
           └── T019 (Shorts extraction) ✓

T014 (Editor skill) ✓ — informs T015-T019

T012 (CaptionTrack) ✓ → used by T019 (Shorts extraction) ✓
T013 (StatCallout/QuoteCard) ✓ → used by T016 (FFMPEG compiler) ✓
```

---

## Remaining Human Actions

These tasks require human execution (running generation tools, sourcing files):

1. **T006**: Run Gemini or ComfyUI to generate Red Nose P1-P6 canonical stills
2. **T007**: Source and catalog 25+ SFX files per `sfx-sourcing-strategy.md`
3. **Airtable setup**: Create Episodes/Scenes/Shorts tables per `n8n-workflow-skeleton.md`
4. **n8n workflows**: Build actual n8n workflows from skeleton spec

---

## Bugs Fixed

- **IntroSequence.tsx render bug**: `interpolate()` inputRange `[18,30,30,42,43,48]` had duplicate 30 — fixed to `[18,29,30,42,43,48]`. Verified: 84/84 frames render successfully.

---

## Priority Order

1. ~~**P0**: T003 (Gemini AR)~~ ✓
2. ~~**P1**: T009 (Script template), T014 (Editor skill), T015 (Timeline schema)~~ ✓
3. ~~**P1**: T012 (CaptionTrack), T013 (StatCallout/QuoteCard)~~ ✓
4. ~~**P2**: T016 (FFMPEG compiler), T017 (Sidechaincompress), T018 (SFX spec)~~ ✓
5. ~~**P2**: T004-T005 (ComfyUI workflows)~~ ✓
6. ~~**P3**: T007-T008 (SFX library strategy), T010-T011 (AAVE linting, SSML template)~~ ✓ (T007 awaits human sourcing)
7. ~~**P3**: T019-T021 (Shorts extraction, orchestration)~~ ✓
