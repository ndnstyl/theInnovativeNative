---
type: reference
agent: shared
project: all
created: 2026-04-05
updated: 2026-04-05
tags: [safe-zones, video, image, captions, remotion, design, social-media]
status: active
---

# Social Media Safe Zones — Master Reference

**Single source of truth** for where content can live without being obscured by platform UI chrome (like buttons, captions, user info bars). Used by:

- [[../../remotion-videos/src/lib/safe-zones.ts]] — TypeScript loader for Remotion compositions
- PPTX Generator — carousel slide safe areas
- Gemini / Kie.ai image prompts — subject placement rules
- `remotion-check` validation — pre-render safe-zone audit

**Machine-readable version:** [[social-media-safe-zones.json]] (consumed programmatically)

---

## Why this exists

Every time critical content (face, CTA, hook text) gets buried under a platform's UI overlay, you lose that post. Platforms don't show you safe zones — they move the goalposts silently. This doc pins the current boundaries for every major platform we ship to.

**Rule:** Nothing important lives in `ui_occlusions`. Everything important lives inside `content_safe`. Text lives inside the tighter `caption_safe`.

---

## Zone taxonomy

| Zone | Purpose | Rule |
|---|---|---|
| `ui_occlusions` | Rectangles **covered** by platform UI chrome | NEVER place critical content here |
| `content_safe` | Inner rectangle for important visual subject | Face, product, hero element goes here |
| `caption_safe` | Narrower inner rectangle for text | All burned-in captions go here |
| `hook_zone` | Upper portion for first-3-sec text | Hook headline only |
| `cta_zone` | Lower portion above bottom UI | End-of-video CTA |
| `title_safe` | Broadcast 90% for 16:9 | Standard TV title-safe area |
| `action_safe` | Broadcast 95% for 16:9 | Standard TV action-safe area |

---

## Canonical resolutions

All coordinates in the JSON are given at these canonical resolutions:

| Aspect | Resolution | Used for |
|---|---|---|
| 9:16 | 1080×1920 | IG Reels/Stories, TikTok, YT Shorts, FB Reels, LinkedIn vertical |
| 16:9 | 1920×1080 | YouTube, LinkedIn horizontal, X/Twitter |
| 1:1 | 1080×1080 | IG square feed, LinkedIn square |
| 4:5 | 1080×1350 | IG portrait feed, FB feed |

If you render at a different resolution, scale the zone values proportionally. The TypeScript loader handles this automatically.

---

## Platform cheat sheet — 9:16 (1080×1920)

This is the most-used format (IG Reels, TikTok, YT Shorts). Here's the **intersection** of all three platforms' safe zones, which gives you a universal-safe rectangle for a single master render:

```
Universal 9:16 safe zone:
  x: 100px
  y: 320px
  width: 820px
  height: 1190px
```

**Interpretation:** Text placed inside this 820×1190 rectangle will be visible on IG, TikTok, YT Shorts, and FB Reels simultaneously. Use this for any caption you want to survive cross-posting without repositioning.

### Per-platform differences on 9:16

| Platform | Top UI height | Bottom UI height | Right rail | Notes |
|---|---|---|---|---|
| IG Reels | 220px | 310px | 960-1080 × 900-1610 | Largest bottom UI (caption+CTA) |
| TikTok | 150px | 280px | 940-1080 × 900-1640 | Tallest right rail |
| YT Shorts | 180px | 370px | 950-1080 × 900-1550 | Largest bottom UI after endscreen |
| FB Reels | 220px | 310px | 960-1080 × 900-1610 | Same as IG |

**Rule of thumb:** If you must use one zone for all 9:16, use `y: 320px → y: 1510px` (avoids all bottom UI including YT Shorts' 370px occlusion).

---

## 16:9 (1920×1080) broadcast rules

| Zone | Pixels (1920×1080) | % of frame |
|---|---|---|
| Title-safe (90%) | 96, 54, 1728, 972 | Inner 90% |
| Action-safe (95%) | 48, 27, 1824, 1026 | Inner 95% |

**YouTube-specific:** The **last 20 seconds** of a YouTube long-form video typically display end-screen cards at:
- Top-right: `1490, 60, 380, 220`
- Bottom band: `0, 820, 1920, 260`

If you're using end-screens, mask these regions in your final 20s or move all content to upper-left.

---

## Image alignment rules (for Gemini/Kie.ai prompts, thumbnails, carousel slides)

### Face placement by aspect ratio

| Aspect | Rule | Eye line position (px) |
|---|---|---|
| 9:16 (1080×1920) | Upper third — face 25–40% from top | y ≈ 600 |
| 16:9 (1920×1080) | Rule of thirds — face on left/right third, eye line upper third | y ≈ 360 |
| 1:1 (1080×1080) | Center horizontal, eye line 40% from top | y ≈ 432 |
| 4:5 (1080×1350) | Center horizontal, eye line 35% from top | y ≈ 472 |

### Subject padding

- **Minimum from edge:** 60px at canonical resolution
- **Recommended from edge:** 100px
- **Why:** Platform UI shifts 20–40px across device sizes; 100px absorbs this.

### Text-over-image zones

| Layer | Vertical position |
|---|---|
| Hook text | Upper third of `content_safe` (above face for talking heads, below for POV shots) |
| Body text | Center vertical of `caption_safe` |
| CTA text | Lower third of `content_safe`, with a 40px buffer **above** `ui_occlusions.bottom` |

---

## Video alignment rules

### Cross-platform master strategy

Always master at **1080×1920 (9:16)** with critical content inside the **universal 9:16 safe zone** (`x:100, y:320, w:820, h:1190`). Then:

- **For 1:1:** center-crop the master (take middle 1080×1080)
- **For 16:9:** reframe or use a dedicated 16:9 composition — do NOT letterbox a 9:16 master

### Never letterbox or pillarbox
Platforms algorithmically **penalize** letterboxed content. Ship native aspect per platform even if it means re-rendering.

### Motion in safe zones
Animated elements that pan, scale, or transition must stay inside `content_safe` **at every frame**, not just start/end keyframes. Mid-animation bounds are the most common violation.

---

## Caption-specific rules

### Font size minimums (1080p render)

| Aspect | Hook | Body | CTA |
|---|---|---|---|
| 9:16 | 90px min / 110–140px rec | 54px min / 64–80px rec | 64px min / 80–100px rec |
| 16:9 | 72px min / 88–110px rec | 42px min / 48–64px rec | 48px min / 56–72px rec |
| 1:1 | 72px min / 88–110px rec | 48px min / 54–72px rec | 54px min / 64–80px rec |

### Contrast
Always use text shadow, stroke, or semi-opaque background pill behind captions. Platform compression crushes low-contrast text.

### Line breaking
- Hook: 30 characters per line max
- Body: 40 characters per line max
- Break mid-**phrase**, not mid-**word**

### Burned-in vs dynamic captions
- **IG/TikTok/Shorts:** burn captions into video. Auto-captions are unreliable and visually inconsistent.
- **YouTube 16:9 long-form:** upload SRT separately so viewers can toggle.

---

## Maintenance

Platform UIs change. Re-verify these values **quarterly** by:

1. Opening the latest version of each platform app
2. Taking a screenshot of a test video with known dimensions
3. Measuring the UI occlusions in pixels
4. Updating the JSON if anything moved >20px

**Last verified:** 2026-04-05

---

## Related

- [[constitution]] — root rules
- [[learnings/creative-learnings]] — Creative agent's Remotion lessons
- [[../../remotion-videos/src/lib/safe-zones.ts]] — runtime loader
- [[../../remotion-videos/src/lib/SafeZoneOverlay.tsx]] — dev-mode visualization component
