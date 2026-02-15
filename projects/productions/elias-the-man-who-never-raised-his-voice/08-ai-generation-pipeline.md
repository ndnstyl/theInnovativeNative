# 08 — AI Generation Pipeline

## Production: "The Man Who Never Raised His Voice"
## Runtime: 5:00 | Format: 16:9 YouTube | Style: Hybrid Cinematic-Brand

---

## Pipeline Overview

This is a fully generative AI production. No traditional filming. Every frame is AI-generated through a multi-stage pipeline:

```
Story Script
    ↓
Character Sheet (AI Image Gen)
    ↓
Shot-by-Shot Base Images (AI Image Gen)
    ↓
Image-to-Video Clips (AI Video Gen)
    ↓
Voiceover (ElevenLabs)
    ↓
Score & Sound Design (AI Music Gen + SFX Libraries)
    ↓
Assembly & Color Grade (Video Editor/DAW)
    ↓
Final Export (YouTube 16:9)
```

---

## Stage 1: Character Reference Generation

### Tool: Midjourney v6+ / Flux Pro / DALL-E 3

**Goal:** Generate a consistent character sheet for Elias that serves as the visual anchor for every subsequent image.

### Master Character Prompt

```
Photorealistic character reference sheet of a Caucasian man, age 45,
dark brown hair with gray at temples, short practical haircut,
light stubble on jaw, dark brown eyes, weathered handsome face,
visible laugh lines, strong jaw, tired but alert expression,
medium-large build kept lean, 6 feet tall, broad shoulders,
wearing dark navy canvas work jacket over slate gray henley shirt,
dark indigo work jeans, dark brown leather work boots,
four views in a row: front facing, three-quarter left, profile left, back view,
neutral expression, solid neutral gray background,
soft even studio lighting, no dramatic shadows,
photorealistic, 8K detail, subsurface scattering on skin,
character design reference sheet, cinematic quality
--ar 16:9 --style raw --v 6.1
```

**Generate 4 variations. Select best. This is ELIAS for the entire production.**

### Secondary Character Prompts

**The Woman:**
```
Photorealistic portrait of a woman, age 35,
brown hair slightly below shoulders, natural appearance,
wearing a dark jacket over light blouse,
two views: front and three-quarter,
soft studio lighting, neutral background,
photorealistic, natural, not stylized
--ar 16:9 --style raw
```

**The Drunk Men:**
```
Two men standing side by side, ages 28-33,
one stocky in untucked flannel shirt over t-shirt,
one lean in dark hoodie and jeans,
confrontational body language, slightly drunk posture,
two views: front facing and three-quarter,
soft studio lighting, neutral background,
photorealistic, not menacing as much as reckless
--ar 16:9 --style raw
```

---

## Stage 2: Shot-by-Shot Image Generation

### Tool: Midjourney v6+ (primary) / Flux Pro 1.1 (alternative)

**Process:** Generate one base image per shot in the shot list. Some shots share compositions and can be generated together; others are unique.

### Image Generation Settings

**Midjourney Settings:**
| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Version | v6.1+ | Best photorealism |
| Style | `--style raw` | Reduces Midjourney's artistic interpretation |
| Aspect Ratio | `--ar 21:9` or `--ar 16:9` | Matches 2.39:1 letterbox or 16:9 frame |
| Quality | `--q 2` | Maximum detail |
| Stylize | `--s 50-100` | Low stylization for realism |
| Character Reference | `--cref [elias_ref_url]` | Consistency |
| Character Weight | `--cw 80-100` | Strong character consistency |

**Flux Pro Settings:**
| Parameter | Value |
|-----------|-------|
| Model | Flux Pro 1.1 |
| Steps | 50 |
| Guidance | 3.5-4.0 |
| Resolution | 1920x816 (2.39:1) or 1920x1080 (16:9) |
| Seed | Lock per character for consistency |

### Prompt Architecture

Every shot prompt follows this structure:

```
[SHOT TYPE], [FRAMING], [LENS],
[CHARACTER anchoring block],
[ACTION/POSE],
[ENVIRONMENT from 06-production-design],
[LIGHTING from 04-lighting-design],
[MOOD/REFERENCE],
[TECHNICAL QUALITY modifiers]
```

### Example Prompts — Key Shots

**Shot 002 — Hardware Store Dawn (Establishing)**
```
Extreme wide shot, establishing, 35mm anamorphic lens,
a solitary man in his mid-40s in dark navy work jacket sweeping
a concrete sidewalk outside a small-town hardware store at 5:45 AM,
pre-dawn blue hour light from sky, warm fluorescent light spilling
from the open glass door of the store,
wet concrete sidewalk reflecting both light sources,
small-town American main street, brick building facade,
hand-painted store sign, morning mist in the air,
Roger Deakins available light cinematography,
photorealistic, ARRI Alexa Mini LF quality, film grain,
anamorphic horizontal lens flare from the store light,
contemplative, quiet, establishing
--ar 21:9 --style raw --s 75 --q 2
--cref [elias_reference_url] --cw 60
```

**Shot 013 — River Trail Wide (Night)**
```
Extreme wide shot, deep focus, 24mm anamorphic lens,
a solitary man walking toward camera from 100 feet away on a
packed gravel river trail at blue hour night,
dark slow-moving river to the left reflecting moonlight with
subtle cyan highlights in the water surface,
bare deciduous trees forming a natural corridor overhead,
low fog rising from the river at ankle level,
moonlight from upper right creating silver rim on the figure,
late autumn, damp, contemplative atmosphere,
Janusz Kamiński night photography, Schindler's List quality,
photorealistic, 8K detail, atmospheric haze,
16:9 cinematic letterboxed to 2.39:1
--ar 21:9 --style raw --s 50 --q 2
--cref [elias_reference_url] --cw 50
```

**Shot 024 — Elias's Eyes, Past (Dangerous)**
```
Extreme close-up of a man's eyes and upper face,
dark brown eyes with sharp calculating gaze, assessing expression,
lit by single amber tungsten light source from upper left,
split lighting — one side of face in warm amber light,
other side in deep true shadow,
subtle neon magenta rim light barely visible on shadow side,
dark background, dramatic contrast,
the eyes of a man mapping every exit in a room,
Denis Villeneuve character photography, Sicario color palette,
photorealistic, 135mm lens equivalent, f/1.2 shallow depth,
hyperdetailed iris and skin texture, cinematic
--ar 21:9 --style raw --s 50 --q 2
--cref [elias_reference_url] --cw 100
```

**Shot 048 — Elias Stops Walking (Confrontation)**
```
Medium shot of a man stopped mid-stride on a dark river trail at night,
wearing dark navy work jacket and gray henley, dark jeans, work boots,
body frozen, weight balanced, shoulders beginning to rise,
a concrete bridge visible 30 feet ahead with harsh cold overhead light
illuminating two aggressive figures and one woman,
the man is in shadow with only cyan-tinted rim light from the bridge,
wet ground reflecting distant cold light,
extreme tension, controlled stillness,
Prisoners (2013) visual reference, Roger Deakins night exterior,
photorealistic, ARRI Alexa quality, anamorphic bokeh,
the moment before action, loaded stillness
--ar 21:9 --style raw --s 50 --q 2
--cref [elias_reference_url] --cw 90
```

**Shot 060 — "He Could Choose" (The Point)**
```
Close-up of a man's face, 135mm equivalent, f/1.2,
dark brown eyes with absolute clarity and calm focus,
strong Rembrandt lighting from cold cyan-tinted overhead bridge light,
triangle of light on shadow side of face,
not angry, not aggressive — present, certain, at peace with capability,
dark navy work jacket collar visible,
background completely out of focus dark bokeh,
the face of a man who has chosen what he is,
cinematographic portrait, Roger Deakins close-up quality,
photorealistic, hyperdetailed skin, subsurface scattering,
the most important frame in the film
--ar 21:9 --style raw --s 50 --q 2
--cref [elias_reference_url] --cw 100
```

**Shot 078 — Final Walk (Dawn)**
```
Extreme wide shot of a man walking away from camera on a river trail,
pre-dawn golden light breaking over the horizon behind him,
warm golden backlight creating a silhouette with golden rim,
river to his left with mist rising, subtle cyan tint in the mist,
bare trees, deep sky transitioning from blue to gold,
the man walks slowly, shoulders relaxed, at peace,
Emmanuel Lubezki golden hour natural light,
Terrence Malick The Tree of Life quality,
photorealistic, ethereal, resolved, the end of a journey,
anamorphic lens, deep focus, 24mm,
the first warm light in the entire film
--ar 21:9 --style raw --s 75 --q 2
--cref [elias_reference_url] --cw 50
```

---

## Stage 3: Image-to-Video Generation

### Primary Tool: Kling AI 1.6 / MiniMax (Hailuo) / Runway Gen-3

### Tool Comparison for This Production

| Feature | Kling 1.6 | MiniMax (Hailuo) | Runway Gen-3 Alpha |
|---------|-----------|-------------------|-------------------|
| Motion Quality | Excellent for subtle movement | Best for cinematic slow motion | Good overall, fast |
| Duration | 5s or 10s clips | 6s clips | 4s clips |
| Character Consistency | Good with reference image | Good with reference | Moderate |
| Camera Movement | Supports camera control | Limited direct control | Basic control |
| Best For | Walking shots, slow dolly, static | Atmospheric shots, emotional | Quick iterations |
| Resolution | 1080p | 1080p | Up to 4K |

### Recommended Tool Assignment by Shot Type

| Shot Type | Recommended Tool | Reason |
|-----------|-----------------|--------|
| Static/locked tripod (58 shots) | **Kling** or **MiniMax** | Minimal motion, character consistency priority |
| Slow dolly in (6 shots) | **Kling** (camera controls) | Needs controlled camera push |
| Tracking/following (3 shots) | **Kling** (camera controls) | Forward tracking capability |
| Extreme wide/landscape (5 shots) | **MiniMax** | Best atmospheric rendering |
| Close-up/face (22 shots) | **Kling** | Best facial detail preservation |
| Handheld/flashback (2 shots) | **Runway** | Quick chaos generation |
| Detail/insert (6 shots) | **Kling** or **MiniMax** | Object focus |

### Image-to-Video Prompt Architecture

For each shot, combine the base image with a motion prompt:

```
INPUT: [base_image.png from Stage 2]

MOTION PROMPT:
[Camera movement from shot list],
[Character action/movement],
[Environmental motion (water, fog, wind)],
[Duration: 5s or 10s],
[Mood/quality keywords]
```

### Example Video Generation Prompts

**Shot 002 — Hardware Store Dawn (Static)**
```
Image: hardware_store_dawn.png
Prompt: Static camera, locked tripod, no camera movement,
the man sweeps the broom slowly left to right across the sidewalk,
mist drifts gently across the frame,
fluorescent light flickers subtly,
early morning stillness, photorealistic motion,
cinematic 24fps, 5 seconds
```

**Shot 014 — River Trail Tracking**
```
Image: river_trail_tracking.png
Prompt: Camera slowly tracks forward following the man from behind
at walking pace, slight bobbing motion of steady walking,
the man walks at 2.5 steps per second on gravel,
river water flows gently to the left,
trees pass on both sides creating parallax depth,
fog wisps at ankle level drift and swirl,
cinematic tracking shot, 10 seconds
```

**Shot 049 — Hands Uncurling (ECU Static)**
```
Image: hands_uncurling.png
Prompt: Static extreme close-up of a man's hands at his sides,
fingers slowly uncurl from relaxed position over 5 seconds,
subtle tendon movement visible, veins become slightly more visible,
the faintest tremor in the fingers — not fear, activation,
cold cyan light from above, photorealistic skin detail,
barely perceptible motion, surgical precision, 5 seconds
```

**Shot 065 — Boot Step Forward (Low Angle Static)**
```
Image: boot_step_forward.png
Prompt: Low angle static camera at boot level,
one boot takes a single deliberate step forward onto wet concrete,
water ripples outward from the footstep impact,
cyan light reflects in the water puddle disturbed by the step,
the step is slow and deliberate, covering more ground than expected,
the weight transfer is visible — this is not a casual step,
cinematic low angle, 5 seconds
```

---

## Stage 4: Voiceover Generation

### Tool: ElevenLabs

See [05-sound-design-music.md](05-sound-design-music.md) for complete specifications.

### Quick Reference:
- Voice: Adam (or Daniel alternative)
- Stability: 0.60–0.68 (varies by act)
- Generate in 5 segments aligned with acts
- Post-process: light de-noise, de-ess, light compression, small room reverb

---

## Stage 5: Score & Sound Design

### Music Generation Tool: Udio / Suno / AIVA

**Score Generation Approach:**
Generate score in segments matching the score map in [05-sound-design-music.md](05-sound-design-music.md).

**Udio Prompt Example (Act II Cello Theme):**
```
Minimal cinematic score, solo cello sustained low notes,
dark contemplative ambient, sparse and spacious,
Max Richter The Leftovers inspired,
60 BPM, minor key, no drums, no vocals,
building emotional weight gradually,
film score quality, 60 seconds
```

**Suno Prompt Example (Act IV Tension Build):**
```
Cinematic tension score, low sub-bass pulse,
string section building from single cello to full ensemble,
Jóhann Jóhannsson Sicario inspired,
controlled dread, building to single orchestral swell,
no percussion, no electronic beats,
film score, 90 seconds
```

### Sound Effects: See [05-sound-design-music.md](05-sound-design-music.md)
- Foley from Freesound.org, BBC Sound Effects, Artlist SFX
- River ambience: extended field recordings
- Footsteps: match to on-screen pace

---

## Stage 6: Assembly & Post-Production

### Tool: DaVinci Resolve (Recommended) / Adobe Premiere Pro

### Assembly Workflow

**Step 1: VO Timeline**
- Import VO segments
- Lay out on timeline with silence gaps per screenplay
- This becomes the master timing reference — everything else aligns to this

**Step 2: Video Clip Placement**
- Import all image-to-video clips
- Place on timeline aligned to VO and shot list timecodes
- Trim heads/tails to match exact durations
- Apply transitions (cuts, dissolves, fades) per transition map

**Step 3: Speed Adjustments**
- Some AI-generated clips may need speed ramping
- Use optical flow for smooth slow-motion
- 10s clips can be used for 5s shots at 2x or slowed further

**Step 4: Color Grade**
- Apply per-act color grade (see [09-post-production-color.md](09-post-production-color.md))
- Grade in DaVinci Resolve Color page or Lumetri in Premiere
- Match shots within each act for consistency
- Apply letterbox (2.39:1 mask over 16:9)

**Step 5: Audio Mix**
- Import all audio stems (VO, ambient, SFX, score)
- Apply ducking automation
- Master to -14 LUFS

**Step 6: Export**
- Resolution: 3840x2160 (4K) or 1920x1080 (1080p)
- Codec: H.265 (HEVC) for YouTube upload
- Frame Rate: 24fps
- Audio: AAC 320kbps stereo
- Color Space: Rec. 709

---

## Production Schedule Estimate

| Stage | Tasks | Estimated Time |
|-------|-------|---------------|
| Character Reference | Generate character sheets, select finals | 2-4 hours |
| Shot Images (80 shots) | Generate base images, refine, regenerate | 8-16 hours (over 2-3 days) |
| Image-to-Video (80 clips) | Generate video clips from images | 8-16 hours (over 2-3 days) |
| Voiceover | Generate, process, assemble | 2-3 hours |
| Score | Generate, edit, layer | 3-5 hours |
| Sound Design | Source SFX, build ambient beds, foley | 3-5 hours |
| Assembly | Video edit, color grade, audio mix | 6-10 hours |
| QA & Revision | Review, fix, re-render issues | 4-8 hours |
| **Total** | **Full production** | **36-67 hours** |

### Cost Estimate (AI Tools)

| Tool | Usage | Estimated Cost |
|------|-------|---------------|
| Midjourney (Standard) | ~200-400 image generations | $30/month subscription |
| Kling AI (Pro) | ~80 video clips (5-10s each) | $30-60/month |
| MiniMax (Pro) | ~20 atmospheric clips | $10-30/month |
| ElevenLabs (Starter+) | ~5 minutes of VO generation | $5-22/month |
| Udio/Suno (Pro) | ~10-15 score segments | $10-24/month |
| DaVinci Resolve | Free version sufficient | $0 |
| SFX Libraries | Freesound (free) + Artlist ($16/mo) | $0-16/month |
| **Total Tool Cost** | One production cycle | **$85-182** |

---

## Quality Control Checkpoints

### After Stage 1 (Character Sheets)
- [ ] Elias looks consistent across all 4 views
- [ ] Age, build, hair, and clothing match spec
- [ ] Face is distinctive enough to maintain across scenes
- [ ] Reference image saved and locked

### After Stage 2 (Base Images)
- [ ] Character consistency across all 80 shots
- [ ] Lighting matches per-act specifications
- [ ] Environments match production design
- [ ] Brand colors appear ONLY where specified (light, not objects)
- [ ] No anachronisms or style breaks
- [ ] Anamorphic / cinematic quality present

### After Stage 3 (Video Clips)
- [ ] Motion is natural and not AI-artifacted
- [ ] Camera movements match shot list directions
- [ ] Character motion matches physicality notes
- [ ] No face distortion or body horror
- [ ] Clips are long enough for their timeline placement
- [ ] Atmospheric elements (fog, water, light) move convincingly

### After Stage 4-5 (Audio)
- [ ] VO timing matches screenplay silence map
- [ ] Score follows the score map timecodes
- [ ] Ambient beds are continuous with no gaps
- [ ] Key foley is synced to visual actions
- [ ] No audio artifacts or AI voice glitches

### After Stage 6 (Assembly)
- [ ] Total runtime: 5:00 (+/- 5 seconds)
- [ ] All transitions match transition map
- [ ] Color grade is consistent within acts
- [ ] Color arc progresses across acts (cold → warm)
- [ ] Audio levels hit -14 LUFS
- [ ] Letterbox is consistent
- [ ] End card appears and brand is correctly displayed
- [ ] YouTube export settings are correct

---

## Iteration Strategy

**Not everything will work on the first try.** Plan for iteration:

### Image Regeneration Budget
- Expect 30-40% of initial images to need regeneration
- Budget 1.5x the base image count in generations
- Keep ALL good outputs — unused shots can serve as B-roll

### Video Clip Regeneration
- Expect 20-30% of clips to have artifacts or inconsistencies
- Faces in motion are the hardest — budget extra attempts for close-ups
- Wide shots and atmospherics are most forgiving

### The "Good Enough" Line
- This is a 5-minute YouTube video, not a feature film
- Each shot is on screen for 2-7 seconds — minor imperfections are hidden by pace
- If a clip is 85% correct and the face is consistent, it ships
- Save perfectionism for Shots 060 (the choice) and 078 (final walk) — these are the hero shots
