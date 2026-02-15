# SOP: BowTie Scene QA/QC Feedback Loop

**Project**: BowTie Bullies — The Aftermath
**Pipeline Phase**: Between Phase 2 (Asset Generation) and Phase 3 (Motion Conversion)
**Owner**: Builder (automation) + Human (final approval)

---

## Overview

Every generated scene image passes through a quality gate before entering the video timeline. The QA/QC loop scores images automatically via Gemini, routes failures, and enables human-driven prompt revisions for rejected images.

---

## 1. Automated QC (Gemini Scoring)

### Trigger

Run QC workflow after WF-2 (Scene Generator) completes a batch. Two trigger methods:

- **Manual**: Open n8n → "BowTie Scene QC" workflow → click "Test Workflow"
- **Webhook**: `POST https://n8n.srv948776.hstgr.cloud/webhook/bowtie-scene-qc` with body `{"episode_id": "EP-001"}`

### What It Does

1. Fetches all Airtable records where `generation_status = "image_generated"` AND `qc_status` is empty
2. Downloads each image from Google Drive
3. Sends to Gemini for scoring on 5 criteria (character consistency, mood, art style, composition, banned elements)
4. Calculates weighted score (max 10.0)
5. Routes:
   - **Score >= 7.0** → `qc_status = passed`
   - **Score < 7.0, attempts < 3** → `generation_status = ready_for_generation` (auto-retry)
   - **Score < 7.0, attempts >= 3** → `qc_status = manual_review`

### After Running

Check the webhook response or Airtable for results:
- **passed**: N images — ready for timeline
- **sent_for_retry**: N images — will re-generate on next WF-2 run
- **flagged_manual_review**: N images — need human eyes

---

## 2. Human Review in Airtable

### Views

| View Name | Filter | Purpose |
|-----------|--------|---------|
| **Needs Review** | `qc_status = manual_review` | Your review queue |
| **All Passed** | `qc_status = passed` | Ready for next phase |
| **Rejected** | `qc_status = rejected` | Awaiting prompt revision |

### Review Process

1. Open the **Needs Review** view in Airtable
2. For each record:
   - Click the image attachment or open `image_drive_id` in Google Drive
   - Compare to the `visual_prompt_full` field — does the image match the prompt intent?
   - Compare to the narration context (check `scene_number` against pipeline JSON)
3. Decision:
   - **Pass**: Change `qc_status` to `passed`
   - **Reject**: Change `qc_status` to `rejected` AND fill in `user_rejection_notes`

### Writing Good Rejection Notes

Be specific. The revision script uses your notes to modify the prompt.

| Bad | Good |
|-----|------|
| "Looks wrong" | "Barbershop looks too modern — needs vintage 1980s feel, worn leather, faded photos" |
| "Not right mood" | "Too bright and cheerful — needs darker lighting, heavier shadows, somber tone" |
| "Missing stuff" | "Missing the folding chairs and whiteboard from workshop description" |
| "Redo" | "Setting is a restaurant not a barbershop — wrong scene entirely" |

---

## 3. Prompt Revision Cycle

### Step 1: Draft Revisions

```bash
python scripts/004-bowtie/bowtie_prompt_reviser.py draft
```

This reads all `rejected` records with `user_rejection_notes`, drafts a revised prompt, and writes it to `visual_prompt_revised` in Airtable.

### Step 2: Review Revisions

Open Airtable → check each record's `visual_prompt_revised` field.
- If the revision looks good: set `prompt_quality` to `good`
- If it needs more work: edit `visual_prompt_revised` directly in Airtable, then set `prompt_quality` to `good`
- If the auto-revision missed the point: rewrite `visual_prompt_revised` manually, then set `prompt_quality` to `good`

### Step 3: Apply Approved Revisions

```bash
python scripts/004-bowtie/bowtie_prompt_reviser.py approve
```

This does:
1. Copies `visual_prompt_revised` → `visual_prompt_full`
2. Clears `visual_prompt_revised`
3. Resets `generation_status` to `ready_for_generation`
4. Increments `batch` (e.g., 1 → 2)
5. Resets `qc_status` and `generation_attempts`

### Step 4: Re-Generate

Run WF-2 (Scene Generator) — it picks up records where `generation_status = ready_for_generation`.

### Step 5: Re-QC

Run the QC workflow again. The revised images go through the same scoring pipeline.

---

## 4. Status Check

```bash
python scripts/004-bowtie/bowtie_prompt_reviser.py status
```

Shows counts by QC status, generation status, batch, and variant ID.

---

## 5. Character Compositing (After QC Pass)

Once bg plates pass QC, composite canonical Tyrone PNGs onto them:

```bash
# Single image
python scripts/004-bowtie/bowtie_compositor.py single \
  --bg scenes/scene-007-bg-a.png \
  --character canonicalCharacter/tyroneStanding_armsBySide_transparent.png \
  --angle primary --pose P1 \
  --output composites/scene-007-bg-a-composite.png

# Batch (all bg plates in a directory)
python scripts/004-bowtie/bowtie_compositor.py batch \
  --bg-dir scenes/ \
  --character-dir projects/004-bowtie-bullies/assets/canonical-characters/ \
  --output-dir composites/

# Test mode (9 composites: 3 poses x 3 angles)
python scripts/004-bowtie/bowtie_compositor.py test \
  --bg scenes/scene-007-bg-a.png \
  --character-dir projects/004-bowtie-bullies/assets/canonical-characters/ \
  --output-dir output/compositor-test/
```

---

## 6. Batch Management

| Batch | Meaning |
|-------|---------|
| 1 | Original generation (pre-prompt-revision) |
| 2 | First revision cycle |
| 3+ | Subsequent revision cycles |

Records from different batches coexist. The pipeline uses the highest-batch passed image for each scene/variant.

---

## 7. Emergency: Bulk Re-Process

If a large number of images fail:

1. Run `python scripts/004-bowtie/bowtie_prompt_reviser.py status` to assess scope
2. If >50% failed: consider revising the base prompt template in WF-1's Expand Variants node rather than individual prompts
3. Pre-delete failed records (filter `qc_status = rejected OR manual_review`, delete in Airtable)
4. Re-run WF-1 Scene Prep to regenerate scene records with new prompts
5. Re-run WF-2 Scene Generator
6. Re-run QC

---

## Quick Reference

| Action | Command / Location |
|--------|-------------------|
| Run QC scoring | n8n → BowTie Scene QC → Test Workflow |
| Review images | Airtable → Scenes → "Needs Review" view |
| Reject with notes | Set `qc_status=rejected`, fill `user_rejection_notes` |
| Draft revisions | `python scripts/004-bowtie/bowtie_prompt_reviser.py draft` |
| Approve revisions | Set `prompt_quality=good` in Airtable |
| Apply revisions | `python scripts/004-bowtie/bowtie_prompt_reviser.py approve` |
| Check status | `python scripts/004-bowtie/bowtie_prompt_reviser.py status` |
| Composite character | `python scripts/004-bowtie/bowtie_compositor.py single --bg ... --character ... --angle ...` |
