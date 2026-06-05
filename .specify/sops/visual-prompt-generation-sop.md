---
type: sop
title: Visual Prompt Generation from Script
project: 004-bowtie-bullies
created: 2026-02-26
updated: 2026-02-26
tags: [visual-pipeline, prompt-engineering, gemini, whisk, image-generation]
status: active
---

# Visual Prompt Generation SOP

## Purpose
Step-by-step runbook for generating visual prompts from a script. Designed so any agent (or future n8n automation) produces a complete, non-redundant prompt set on the FIRST pass — no iterations, no a/b variants, no manual pruning.

## Prerequisites
- Finalized script (`.md` file with scene-by-scene narration text)
- Brand style guide (act-based palettes, style anchor)
- Existing visual inventory (if any images already generated for this episode)

---

## Step 1: Read the Full Script

Read the entire script end-to-end before writing any prompts. Understand:
- Total scene count
- Act structure and palette assignments
- Which scenes are character composite (Red Nose PNG overlay) vs. pure environment stills
- Which scenes have Remotion overlays (text, stats, graphs — these don't need image prompts for that content)

**Output:** Mental model of the episode's visual arc.

---

## Step 2: Calculate Coverage Math (Word-Count Method)

For each scene with `visual_backend == "gemini"` (or equivalent still-image generation):

```
words_per_scene = count words in narration_text
speaking_rate = 140  # words per minute (AAVE cadence, includes pauses)
scene_duration = words_per_scene / speaking_rate × 60  # in seconds
images_needed = ceil(scene_duration / 5)  # 5 seconds per still
```

If VO audio already exists, use audio file duration directly instead of word-count estimate.

**Output:** Table of scene numbers with `images_needed` count.

| Scene | Words | Duration (s) | Images Needed |
|-------|-------|-------------|---------------|
| S02 | 23 | 10 | 2 |
| S10 | 70 | 30 | 6 |
| S14 | 65 | 28 | 6 |
| ... | ... | ... | ... |
| **Total** | | | **~100-120** |

---

## Step 3: Line-Level Detail Extraction

For each scene, read the narration text **LINE BY LINE**. Extract every:
- Concrete noun (couch, envelope, car, phone)
- Statistic or dollar amount ($800, 22.8% APR, $4,600)
- Document or screen (credit card statement, loan contract, bank app)
- Environment or setting (furniture store, auto repair shop, kitchen counter)
- Object that tells a story (worn credit card, empty fridge, crumpled receipt)

Each distinct visual detail becomes one prompt subject.

**Rules:**
- If two lines describe the same object in different states (e.g., "buy a couch for $800" then "paid $1,400 for that couch"), those are TWO prompts — one showing the purchase, one showing the aftermath
- If a line adds a detail to the previous line (e.g., "Already saggin'"), merge it into the previous prompt rather than creating a separate one
- If a line is purely rhetorical with no visual subject, skip it — the adjacent prompts cover the visual need

**Output:** List of visual subjects per scene, one per line.

---

## Step 4: Inventory Check

Before writing prompts, catalog what already exists:
- Images from previous generation batches (list subject matter of each)
- Character assets (canonical Red Nose PNGs — these scenes need bg_environment prompts only)
- Remotion overlays planned (text, stats, graphs — if post-production handles it, don't prompt for it)

Cross-reference every extracted visual subject against the inventory. **Remove any subject already covered.**

**Output:** Deduplicated visual subject list — only subjects NOT in inventory.

---

## Step 5: Write One Prompt Per Visual Detail

For each visual subject, write a single prompt following this structure:

```
[Detailed scene description — what objects, their state, their arrangement, the specific details from the narration].
No humans, no hands, no fingers[, no silhouettes, no figures — add for wide/dawn shots].
[Act palette]. 2D cel-shaded illustration, The Boondocks art style, film grain, desaturated, 16:9.
```

**Prompt writing rules:**
1. **Story content only** — describe what the narrator is literally talking about
2. **Literal > abstract** — "flat tire on a sedan" not "visual metaphor for unexpected hardship"
3. **One subject per prompt** — don't combine multiple unrelated objects
4. **Specific details** — "$847" not "a large amount", "VISA *4421" not "a credit card"
5. **Composition cues** — "close-up of", "overhead shot of", "lying on a kitchen table"
6. **Lighting from act palette** — match the palette to the act structure
7. **No character references** — NEVER include "Red Nose Pitbull", "Pitbull", "Tyrone", or any character name
8. **No "vignette"** — post-production only
9. **No style directives in the scene description** — style goes in the suffix only

**Act Palette Reference (BowTie Bullies):**
| Act | Palette |
|-----|---------|
| Cold Open | Dark steel, sodium vapor rust-orange accent |
| Act 2A | Dark base with practical light (fluorescent, desk lamp, screen glow) |
| Act 2B | Deep sepia, amber archival light |
| Act 2C | Warm amber domestic, practical light |
| Act 3 | Dawn-expanding warmth |
| Closer | Golden hour rust-to-gold transition |

---

## Step 6: Validate Prompt Count

Compare total prompts written vs. total `images_needed` from Step 2.

- **Within ±10%:** Proceed to generation
- **More than 10% over:** Some prompts may describe overlapping subjects — review and merge
- **More than 10% under:** Go back to Step 3 and look for missed visual details in the narration

---

## Step 7: Format Output

Create a clean text file, one prompt per line, grouped by scene:

```
--- S{scene_number} ({duration}s) — "{first line of narration}" ---

[Prompt 1 for this scene]

[Prompt 2 for this scene]

--- S{next_scene} ({duration}s) — "{first line}" ---

[Prompt 1]
```

Save as `EP-XXX-whisk-final-prompts.txt` (or equivalent).

---

## Step 8: Generation

- Send **1 image per prompt** to Gemini/Whisk
- **NO a/b variants** — do not generate 2 hoping 1 is good
- Name output files: `S{scene:02d}_{seq:02d}.jpeg`
- Respect API rate limits

---

## Step 9: QA + Gap Fill

After generation:
1. **OCR scan** — flag/delete images with "BOONDOCKS" text contamination
2. **Person detection** — flag images with human figures/silhouettes
3. **Quality check** — sharpness, edge density → accept or re-queue that specific prompt
4. **Gap analysis** — compare images_surviving vs images_needed per scene
5. If gaps: write NEW prompts for uncovered narration details (not re-descriptions), loop back to Step 8

---

## Anti-Patterns (What NOT to Do)

| Anti-Pattern | Why It Fails | Correct Approach |
|---|---|---|
| Generate 2 variants per prompt | Doubles output, half get pruned | 1 image per prompt, re-queue failures |
| Scene-level prompting | Too broad, misses narrative beats | Line-level extraction from narration |
| Abstract/metaphorical prompts | Produces unusable art | Show what the narrator literally describes |
| Skip inventory check | 32% redundancy (EP-002) | Catalog existing visuals first |
| Angle variations | "Same card, different angle" adds nothing | Pull NEW details from the narration |
| Multiple iteration rounds | 4 rounds = 6+ hours wasted | Get it right on the first pass |

---

## Reference Implementation

**Canonical example of correct prompts:** `projects/004-bowtie-bullies/episodes/EP-002/EP-002-whisk-final-prompts.txt` (59 prompts, zero redundancy)

**Cautionary example of failed expansion:** `projects/004-bowtie-bullies/episodes/EP-002/EP-002-whisk-expansion-prompts.txt` (32% redundant)

**Detailed learnings:** `.specify/memory/learnings/creative-learnings.md` → "EP-002 Visual Pipeline" section
