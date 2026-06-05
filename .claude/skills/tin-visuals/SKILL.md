# TIN Visuals Skill

Render polished Remotion video inserts and pattern-interrupt overlays for The Innovative Native brand. Covers 12 polished templates (TIN-*-16x9 / TIN-*-9x16) and 6 pattern-interrupt templates (Pattern-*-16x9). Outputs ProRes 4444 MOV files consumed by video editors.

## TRIGGERS

Invoke this skill when the user says any of:
- "create a visual for [topic]"
- "render a stat card [with / showing …]"
- "make the [template name] visual"
- "generate pattern interrupts for [script/transcript]"
- "create a [TitleCard / WorkflowMap / BarChart / BulletReveal / etc.]"
- "re-render [scene name or composition ID]"

## MODES

### Mode 1 — Single render
1. Read the content brief (topic, key data, tone, aspect ratio needed).
2. Pick the best template from `references/template-catalog.md`.
3. Build a props JSON object matching that template's props interface.
4. Run `render.sh`:
   ```
   .claude/skills/tin-visuals/render.sh <composition-id> <output-path> '<props-json>' [duration-frames]
   ```
5. Verify the output file exists and is non-zero.

### Mode 2 — Batch pattern render (transcript → pattern interrupts)
1. Run transcript extraction:
   ```
   python3 scripts/visuals/extract-pattern-cues.py <transcript-path>
   ```
2. This produces `content/<project>/visuals/patterns/cues.json`.
3. Run batch render:
   ```
   bash scripts/visuals/render-pattern-batch.sh content/<project>/visuals/patterns/cues.json
   ```
4. Verify output count matches cues.

## OUTPUT FILENAME CONVENTIONS

- **Polished templates**: `<MM-SS>_ch<NN>_<slug>.mov`  
  Example: `07-30_ch04_s03-mer-breakdown.mov`
- **Pattern interrupts**: `<HH-MM-SS>_<template>_<slug>.mov`  
  Example: `00-01-12_numberflash_64-percent.mov`

## WORKFLOW STEPS (numbered)

1. Identify mode (single vs. batch).
2. Select template — consult `references/template-catalog.md`.
3. Build props JSON — all required fields, brand colors never hardcoded (brand tokens are injected via `getBrand()` at render time; props only carry content).
4. Set output path following naming convention above.
5. Invoke `render.sh` (single) or batch scripts (batch).
6. Confirm file size. If 0 bytes or missing, inspect Remotion stderr and retry.
7. Log deliverable in Airtable Tasks table if deliverable is part of a tracked project.

## CRITICAL RULES

- ALWAYS use brand.json colors and fonts — never hardcode hex values in props JSON.
- **TIN canonical brand**: `Playfair Display` (heading) + `Inter` (body) + `JetBrains Mono` (code). Composition IDs: `TIN-*-16x9`, `TIN-*-9x16`.
- **Unsilo brand**: `Bangers` (main/handwritten labels) + `Caveat` (sceneTitle/chapter titles) + `JetBrains Mono` (mono). Composition IDs: `Unsilo-S*-16x9`.
- **Pattern interrupts**: all use TIN brand, no Unsilo compositions.
- Never use `Pattern-*-9x16` — patterns are 16x9 only.
- `brandSlug` prop defaults to `'innovative-native'`; omit it unless using a different brand.
- Do not modify `scripts/visuals/` (owned by Phase 4 / batch pipeline).
- Do not modify `content/unfuckYourData/visuals/patterns/` (owned by Phase 4).
