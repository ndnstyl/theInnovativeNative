---
name: explainer-video-pipeline
description: End-to-end explainer video production for TIN content. Turns a content brief into a rendered MP4 via script → storyboard → VO (ElevenLabs Kal Jones) → Remotion composition → final render → publish. Reusable per content piece (courses, products, workflows, blogs, deliverables). Uses 3d-icon-forge library for visual assets.
triggers:
  - "explainer video"
  - "produce explainer"
  - "render explainer"
  - "video for [content]"
  - "cerebro explainer"
  - "remotion explainer"
---

# Explainer Video Pipeline — TIN End-to-End

## Goal
100% video coverage for every TIN content piece (courses, products, workflows, deliverables, blogs).
Current inventory: ~150 videos needed. Build once, replicate.

## Pipeline stages

```
brief.md           (per-content: what to explain, audience, CTA)
  ↓
script.md          (60-90s VO script, 5-beat structure)
  ↓
storyboard.json    (line text → icon asset → duration → animation)
  ↓
vo.mp3             (ElevenLabs Kal Jones render)
  ↓
composition.tsx    (Remotion React component reads storyboard + vo)
  ↓
final.mp4          (Remotion CLI render)
  ↓
published          (IG Publisher + LinkedIn + site embed + Airtable log)
```

Every stage is a file in `output/<content-slug>/`. Pipeline is resumable — rerun any stage without redoing earlier ones.

## Reusable assets (always pull from these)
- Icons: `.claude/skills/3d-icon-forge/library/index.json` + `remotion-videos/iconSet/`
- Brand voice: `.claude/skills/brand-voice-generator/` output
- VO voice: ElevenLabs Kal Jones `68RUZBDjLe2YBQvv8zFx`
- Music: Pixabay SFX API (from `scripts/...`) — see `references/music-selection.md`
- Colors: cyan `#00BCD4` primary, magenta `#E91E63` RARE accent

## 5-beat explainer structure (default)

| Beat | Time | Purpose |
|------|------|---------|
| 1 — Hook | 6-10s | Pattern interrupt. Name the pain. |
| 2 — Problem | 10-15s | Stakes. Why unsolved = cost. |
| 3 — Solution intro | 8-12s | Name the product. One-line claim. |
| 4 — How it works | 20-25s | 2-3 concrete mechanics. Icons carry the weight. |
| 5 — CTA | 8-12s | Direct ask + destination URL. |

Total: 60-90s. At Kal Jones pace: **~180-220 words**.

## Files in this skill

- `SKILL.md` — this file
- `references/script-template.md` — 5-beat fill-in template
- `references/storyboard-schema.json` — JSON schema for storyboard files
- `references/remotion-composition-template.tsx` — reusable React component
- `references/vo-pipeline.md` — ElevenLabs call pattern
- `references/render-pipeline.md` — Remotion CLI commands
- `references/publish-pipeline.md` — IG/LinkedIn/site/Airtable wire-up
- `references/judgment-calls.md` — decisions made so you don't re-ask (e.g., "name competitors or not", "Calendly in card or send to LP")
- `output/<slug>/` — per-content working directory
  - `brief.md` + `script.md` + `storyboard.json` + `vo.mp3` + `composition.tsx` + `final.mp4`

## How to produce one explainer

```bash
# 1. Create brief
mkdir -p .claude/skills/explainer-video-pipeline/output/<slug>
# Fill in brief.md using references/brief-template.md

# 2. Write script (Claude does this, reading brief)
# Fill in script.md

# 3. Build storyboard (Claude does this, using icon library index)
# Fill in storyboard.json

# 4. Render VO
python scripts/explainer-pipeline/render_vo.py --slug <slug>

# 5. Build composition (copy template + wire storyboard)
# Creates composition.tsx

# 6. Render MP4
cd remotion-videos && npx remotion render --config=config.mjs \
  --props=../.claude/skills/explainer-video-pipeline/output/<slug>/storyboard.json \
  out/<slug>.mp4

# 7. Publish
python scripts/explainer-pipeline/publish.py --slug <slug> --channels ig,linkedin,site
```

## Coverage tracker

Status per content piece tracked in `output/coverage.json`. Each entry: `{ slug, category, stage, status, asset_paths }`.

Current priority queue (from content inventory):
1. Cerebro RAG Pilot — PILOT BUILD (this video is the pipeline test)
2. AI Fluency Weekend Build — 10 lessons (100% content ready)
3. TwinGen — 33 lessons (100% content ready)
4. n8n Templates — 10 lessons (80% content ready)
5. TrendPilot Pro walkthrough — 1 video
6. YouTube Workflows — 6 lessons (17% content ready)
7. Growth Marketing Masterclass priority subset — ~15 lessons
8. Onboarding videos — 2
9. Workflow tutorials — 8 major systems

**Total: ~150 videos for 100% coverage.** Pipeline designed for parallel production once template is proven on Cerebro.

## Judgment calls (made so we don't re-debate)

See `references/judgment-calls.md` for full list. Key defaults:
- Name Heppner ruling explicitly in all Cerebro marketing (per directive)
- Competitor mentions: generic ("consumer AI tools") not named (avoids defensive response)
- CTA: landing page > direct Calendly (nurture buffer)
- Aspect ratio: 1:1 (IG) as primary, 16:9 (site/LinkedIn) as derivative from same storyboard
- Music: Pixabay low-energy bed, ducked -18dB under VO
- Caption overlay: ALWAYS on (accessibility + silent autoplay)
- Intro card: 2 sec, TIN cyan logo + problem-line text
- Outro card: 3 sec, CTA URL + "the innovative native"
