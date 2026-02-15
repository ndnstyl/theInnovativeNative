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

## n8n Workflow Deployment

- [ ] **T022**: Deploy simplified WF-1 Scene Prep to live n8n instance (Builder) — Local JSON at `scripts/n8n-workflows/bowtie-scene-prep.json` was simplified (11→9 nodes: removed broken `Manual Defaults` + `Load Pipeline JSON` Code nodes, replaced with native Google Drive Download node). Must deploy via n8n API. If workflow already exists in n8n, GET→patch→PUT. If new, POST to create. Verify: Manual Trigger → Drive Download → Expand Variants → SplitInBatches → Airtable creates records.

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

---

## Phase 3: Foundation & Migration [US5]

- [x] **T023** [P] [US5] Audit existing Airtable records — 155 total (152 image_generated, 3 generation_failed). Variants: 10 bg (char), 22 each a/b/c (env), 47 broll. (Builder)
- [x] **T024** [P] [US5] Added 5 new fields to Scenes table (`batch`, `user_rejection_notes`, `visual_prompt_revised`, `prompt_quality`, `composite_drive_id`). All 155 records tagged `batch: 1`. (Builder)
- [x] **T025** [US4] Fix QC workflow bugs + deployed to n8n. ID: `Nsy2qgF76UvSj5Aq`. (Builder)
- [ ] **T026** [US5] Run QC workflow on batch 1 images to identify keepers. (Human action — user triggers)

## Phase 4: Prompt Rewrites [US1 — MVP]

- [x] **T027** [US1] Draft prompt revision staging doc (`EP-001-prompt-revisions.md`) with side-by-side comparison for all scenes needing narrative-enriched rewrites. (Builder)
- [ ] **T028** [US1] User review and approval of staged prompts. (Human action — approval gate)
- [x] **T029** [US1] Merge approved prompts into pipeline JSON. (Builder) — 22 prompts merged 2026-02-14. Google Drive upload pending (T031 deploy).

## Phase 5: Variant Expansion [US2]

- [x] **T030** [US2] Modify `buildVariants()` in WF-1 Expand Variants node: character scenes produce `bg-a`, `bg-b`, `bg-c` with compositional space guidance for wide variants. (Builder)
- [x] **T031** [US2] Deployed updated WF-1 to live n8n. ID: `zYEYLsFUnOsOmYqT`, 10 nodes. (Builder — user tests)
- [ ] **T032** [P] [US5] Pre-delete failed/un-QC'd batch 1 records. Preserve passed records. (Builder)
- [ ] **T033** [US1+US2] Re-run WF-1 Scene Prep with revised pipeline JSON. Verify Airtable record counts (expect ~96 scene + ~47 B-roll). (Human action — user triggers)

## Phase 6: Compositor [US3]

- [x] **T034** [US3] Build `scripts/bowtie_compositor.py` — Pillow-based, `POSE_PROFILES` dict, 3 angle modes (wide/primary/close-up). (Builder)
- [ ] **T035** [P] [US3] Test compositor: 3 poses × 3 angles = 9 test composites. Upload to Drive. Visual inspection by user. (Builder + Human)
- [ ] **T036** [US3] Integration: compositor reads from Airtable (character scenes with images), uploads composites to Drive, writes `composite_drive_id` to Airtable. (Builder)

## Phase 7: QA/QC Loop [US4]

- [ ] **T037** [P] [US4] Create 3 Airtable views on Scenes table (manual — Airtable API doesn't support filtered view creation). Filters: "Needs Review" (`qc_status=manual_review`), "All Passed" (`qc_status=passed`), "Rejected" (`qc_status=rejected`). (Human action)
- [x] **T038** [US4] Built `scripts/bowtie_prompt_reviser.py` — `draft`/`approve`/`status` commands. Reads rejected records, drafts revised prompts, applies approved revisions. (Builder)
- [x] **T039** [US4] Documented QA/QC SOP at `.specify/sops/bowtie-qaqc-sop.md`. (Builder)

## Phase 8: Integration & Polish

- [ ] **T040** [US1–5] End-to-end smoke test: 3 scenes (1 character, 1 environment, 1 barbershop) through full pipeline: revised prompt → Scene Prep → Generate → QC → Composite → Review. (Builder + Human)
- [x] **T041** [P] Update spec.md with QA/QC section, compositor spec, revised pipeline flow. (Builder)
- [x] **T042** [P] Update tasks.md with all new tasks and dependency graph. (Builder)
- [ ] **T043** Log all work to Airtable: Time Entry, Tasks, Deliverables. (Builder)

---

## Phase 3–8 Dependency Graph

```
T023 + T024 + T025 + T027 ─── can start in parallel
         │         │              │
         └─── T026 (QC batch 1)  │
                   │              │
                   └──── T032 (pre-delete failed)
                                  │
              T028 (user approves prompts)
                   │
              T029 (merge to JSON)
                   │
T030 (fix buildVariants) ─── T031 (deploy WF-1)
                                  │
                             T033 (re-run Scene Prep)
                                  │
              T034 (compositor) ──┤── T037 (Airtable views) ─── T038 (revision script)
                   │              │
              T035 (test)         └── T039 (SOP doc)
                   │
              T036 (integration)
                   │
              T040 (end-to-end smoke test)
                   │
         T041 + T042 + T043 (polish)
```
