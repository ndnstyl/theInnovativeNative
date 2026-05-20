# 008 — Iconic Brand Timelapse

Automated pipeline for generating hyper-realistic architectural construction timelapse videos featuring iconic brand buildings reimagined.

## Concept

Take recognizable brand buildings (Hard Rock Cafe, Chevrolet HQ, Nike campus, etc.) and generate construction timelapse content showing them being built from raw land to completion — all from a fixed drone viewpoint, 9:16 vertical format.

## Pipeline

1. **WF-THT-PROMPT** — Groq LLM generates 8 image + 4 video prompts for a selected brand
2. **WF-THT-IMAGE** — Kie.AI Nano Banana Pro generates 8 keyframe images
3. **WF-THT-VIDEO** — Kie.AI Veo 3.1 generates 4 transition videos (first+last frame interpolation)
4. **WF-THT-REEL** — FFMPEG stitches 4 clips + music into a final reel

## Tech Stack

- **n8n** — Workflow orchestration (self-hosted on Hostinger)
- **Airtable** — State management (dedicated base: "Iconic Brand Timelapse")
- **Kie.AI** — Image generation (Nano Banana Pro) + Video generation (Veo 3.1, FIRST_AND_LAST_FRAMES_2_VIDEO)
- **n8n Basic LLM Chain (Groq)** — Prompt text generation (expands brand concept into 12 phase-specific prompts)
- **Google Drive** — Asset storage (Images/, Videos/, Reels/ folders)
- **FFMPEG** — Reel assembly (normalize + stitch + music)

> **Note**: "THT" is the project code name (Tiny Home Timelapse). The actual content is iconic brand headquarters — the name stuck from the original reference video inspiration.

## Spec Kit

See `.specify/features/tiny-home-timelapse/` for spec.md, plan.md, tasks.md.

See [quickstart.md](../../.specify/features/tiny-home-timelapse/quickstart.md) for setup instructions.
