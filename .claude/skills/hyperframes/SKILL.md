---
name: hyperframes
description: HyperFrames is the video framework for AGENT-AUTHORED video work (ideation through render done by an AI agent with no Mike-in-the-loop fine-tuning). Use this skill whenever a task asks for "create a video about X" / "make a reel for Y" / "generate a quote card from this OB1 thought" and there is no expectation Mike will iterate on the composition. Routes to project at hyperframes-videos/. Compositions are HTML/CSS/JS, not React. If the task is Mike-directed (he is editing timing, brand, scenes), STOP and use the remotion-videos/ project instead.
---

# HyperFrames Skill

## The hard routing rule

| Situation | Tool |
|---|---|
| Agent does ideation + composition + render end-to-end, no human shaping | **HyperFrames** (`hyperframes-videos/`) |
| Mike directs scenes, edits timing, refines brand, reuses Cerebro/BowTie/TheBrand modules | **Remotion** (`remotion-videos/`) |
| ProRes 4444 output required | **Remotion only** (HyperFrames is MP4 H.264 / WebM VP9) |
| Mixed: agent drafts, Mike refines | Start in HyperFrames. At the refinement gate, decide whether to port to Remotion or stay. |

Source of truth for the rule: `memory/feedback_video_tool_routing.md`.

## Project location

`/Users/makwa/theinnovativenative/hyperframes-videos/`

Scaffolded with `npx hyperframes init hyperframes-videos --non-interactive --example blank`. Sibling to `remotion-videos/`, NOT inside the monorepo workspaces (separate dependency tree).

## Files that already exist there

```
hyperframes-videos/
├── AGENTS.md           # HeyGen's agent guidance (read this for framework rules)
├── CLAUDE.md           # auto-loaded when Claude opens the folder, has Key Rules section
├── hyperframes.json    # registry config (blocks/components/assets paths)
├── index.html          # root composition (1920x1080, GSAP timeline)
├── meta.json           # project id + name
└── package.json        # npm scripts: dev, check, render, publish
```

Telemetry is disabled.

## Commands (run from `hyperframes-videos/`)

```bash
npm run dev          # preview server (LONG-RUNNING, always run_in_background:true)
npm run check        # lint + validate + inspect — REQUIRED before render
npm run render       # render to MP4
npm run publish      # publish and get a shareable link
npx hyperframes docs <topic>   # local docs, no network (topics: data-attributes, gsap, compositions, rendering, examples, troubleshooting)
```

## Authoring a composition (the 6 framework rules)

From the project's auto-loaded CLAUDE.md, don't break these:

1. Every timed element needs `data-start`, `data-duration`, `data-track-index`.
2. Timed elements MUST have `class="clip"`. The framework uses it for visibility control.
3. Timelines must be paused and registered:
   ```js
   window.__timelines = window.__timelines || {};
   window.__timelines["composition-id"] = gsap.timeline({ paused: true });
   ```
4. Videos use `muted` plus a separate `<audio>` for sound.
5. Sub-compositions reference via `data-composition-src="compositions/file.html"`.
6. Deterministic only. No `Date.now()`, no `Math.random()`, no network fetches.

## Mike-specific patterns

**Brand palette** (apply to every composition unless brief overrides):
- Primary: cyan
- RARE accent: magenta
- Caption highlight: cyan + 1.18x scale

**Voice over**: ElevenLabs Kal Jones is the default voice. HyperFrames has a built-in TTS workflow but if the brief calls for Kal Jones specifically, generate via the `explainer-video-pipeline` skill's ElevenLabs step and embed the MP3 as an `<audio>` element with matching `data-start` / `data-duration`.

**Copy rule**: No em dashes in any on-screen text or VO script. Use commas, periods, parens, or hyphens.

**Reel critique** (from prior feedback):
- No text before VO begins
- B-roll must match content
- Music always present

## Optional: install HeyGen's official skill suite

HeyGen ships framework-specific skills (`hyperframes-cli`, `hyperframes-media`, `gsap`, `lottie`, `three`, `tailwind`, `website-to-hyperframes`, etc.). NOT installed by default to avoid bloating the skill list. To enable:

```bash
cd /Users/makwa/theinnovativenative/hyperframes-videos
npx hyperframes skills
# or: npx skills add heygen-com/hyperframes
```

Restart the Claude Code session after install.

## What HyperFrames CAN'T do (escalate to Remotion)

- ProRes 4444 output (BowTie compositing pipeline requires this)
- Reuse existing Cerebro/BowTie/TheBrand React components
- Lambda-style cloud rendering at scale (HyperFrames is local headless Chrome + FFmpeg)
- React state, hooks, typed props for shared composition logic

## n8n integration pattern

There is no native n8n node. To trigger a render from a workflow:

1. n8n HTTP Request node POSTs to a small wrapper service or fires an SSH command on the box that runs HyperFrames.
2. Wrapper does `git pull` on `hyperframes-videos/`, runs `npm run check` and `npm run render`.
3. Wrapper uploads the resulting MP4 to wherever the workflow expects (Supabase Storage, Drive, S3).
4. Wrapper returns the URL.

Same shape as Remotion's render pipeline, just swap the engine.

## Prereqs already verified on this machine

- Node.js v22.18.0 (HyperFrames requires v22+)
- FFmpeg 8.0 (requires v7+)

## Quick start prompt template (for OB1 / autonomous agent runs)

```
Using /hyperframes, create a {duration}s {format} about {topic}.
Brand: cyan primary, magenta RARE accent. No em dashes.
VO: ElevenLabs Kal Jones, embed as audio track.
Output: MP4, 1920x1080 (or 1080x1920 for vertical reel).
Run `npm run check` before `npm run render`.
```
