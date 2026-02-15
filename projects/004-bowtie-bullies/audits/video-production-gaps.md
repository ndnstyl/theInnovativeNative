# BowTie Bullies -- The Aftermath | Video Production Pipeline Gap Analysis

## Audit Date: 2026-02-10
## Auditor: Video Production Pipeline Auditor
## Brand: BowTie Bullies -- The Aftermath (004-faceless-ai-brand)

---

## Documents Reviewed

| Document | Path | Status |
|----------|------|--------|
| Brand Blueprint | `deliverables/004-faceless-ai-brand/brand-blueprint.md` | Complete, thorough |
| Visual Style Guide | `deliverables/004-faceless-ai-brand/visual-style-guide.md` | Complete, thorough |
| Tyrone Voice Guide | `deliverables/004-faceless-ai-brand/tyrone-voice-guide.md` | Complete, thorough |
| Episodes Guide | `deliverables/004-faceless-ai-brand/episodes.md` | Complete, 22 episodes planned |
| Haven Learnings | `.specify/memory/learnings/haven-learnings.md` | Active, production patterns validated |
| FFMPEG Audio Optimization Pattern | `.specify/patterns/ffmpeg/audio-optimization.md` | Proven pattern from Haven |
| BodyCam Video Processing Pattern | `.specify/patterns/ffmpeg/bodycam-video-processing.md` | Proven pattern from BodyCam Bandits |
| Create Image Tool Pattern | `.specify/patterns/graphics/create-image-tool.md` | Proven Gemini image gen pattern |
| Creative Worker SKILL | `.claude/skills/workers/creative/SKILL.md` | Consolidated from Spike |
| Cinema Knowledge Library | `cinema_knowledge/` | Reference docs + Haven reference images |
| Shared Learnings | `.specify/memory/learnings/shared-learnings.md` | Cross-agent patterns |
| Creative Learnings | `.specify/memory/learnings/creative-learnings.md` | Video/graphics patterns |
| Spike (Remotion) Learnings | `.specify/memory/learnings/spike-learnings.md` | Remotion patterns |

---

## Severity Scale

| Rating | Definition |
|--------|-----------|
| **CRITICAL** | Blocks production. Cannot ship video without resolving. |
| **HIGH** | Will cause visible quality issues or workflow failures. Must resolve before first publish. |
| **MEDIUM** | Causes friction, inconsistency, or manual overhead. Resolve within first 2 weeks. |
| **LOW** | Nice to have. Improves efficiency or polish. Resolve within first month. |

---

## 1. FFMPEG PIPELINE GAPS

### GAP-FF-001: Assembly Command Template Is Illustrative, Not Executable
**Severity: CRITICAL** | **Impact: Blocks automated production**

The FFMPEG command template in `brand-blueprint.md` (lines 1452-1477) uses `...` ellipsis placeholders for variable-length clip inputs and xfade chains. This means:

- The template cannot be copy-pasted into n8n and run. A Code node must dynamically build the command based on the number of input clips.
- The xfade offset calculation chain (`offset=5` in the example) needs to be computed dynamically: each offset = sum of all previous clip durations minus cumulative transition durations.
- No template exists for computing these offsets from a shot list JSON.

**What exists from Haven:** Haven's WF-006 (FFMPEG Assembler) uses Code nodes with `execSync()` and the `run()` logging wrapper pattern. The Ken Burns, crossfade chain, text overlay, and music mix are separate Code nodes processing scenes sequentially via `SplitInBatches`. This is the proven architecture -- but no equivalent BowTie Bullies WF-005 has been built.

**What's missing:**
- A Code node template that takes a shot list array and builds the complete FFMPEG filter_complex dynamically
- Xfade offset calculator function
- Handling for mixed input types (static images with Ken Burns vs. video clips with direct passthrough)
- The template assumes all clips are video (`clip1.mp4`) but 40% of content is AI-generated static images requiring Ken Burns treatment

**Resolution:** Build a `generate-ffmpeg-command.js` utility function that accepts `{scenes: [{type: 'image'|'video', path, duration, transition}]}` and outputs the complete FFMPEG command string. Port the proven Haven WF-006 node architecture (pre-flight validation, Ken Burns per scene, crossfade chain, text overlays, music mix, cleanup) to a BowTie Bullies WF-005 equivalent.

---

### GAP-FF-002: Color Grade Filter Not Validated for Edge Cases
**Severity: HIGH** | **Impact: Inconsistent visual quality across content types**

The color grade filter is defined consistently across both `brand-blueprint.md` and `visual-style-guide.md`:

```bash
eq=contrast=1.15:brightness=-0.03:saturation=0.75,
unsharp=5:5:0.5,
noise=alls=20:allf=t+u,
vignette=PI/4:1.2
```

However, this single filter is applied universally. Known edge cases not addressed:

1. **Dark scenes (urban night textures, silhouettes):** The `brightness=-0.03` + `contrast=1.15` combination will crush shadows further. Already-dark AI-generated images of urban night scenes could become illegible.
2. **Bright screens / tech content:** Screen recordings and news headline screenshots (10% of visual mix) at natural brightness will get desaturated and darkened. Text on screens may become unreadable.
3. **AI-generated images with existing grain:** Gemini/Kie.AI outputs may already have noise artifacts. Adding `noise=alls=20` doubles the grain and degrades readability of overlaid text.
4. **Stock footage with different dynamic range:** Pexels footage comes at various exposures. The fixed filter doesn't adapt. A bright stock clip will look different from a dark AI-generated clip even after grading.

**What exists from Haven:** Haven uses the same filter pattern but with a warm palette (cream/terracotta) at shorter durations (25-35s). Edge case tolerance is higher at short form than at 10+ minutes.

**What's missing:**
- A decision matrix for when to reduce or skip specific filter components (e.g., skip `brightness=-0.03` for clips already below a luminance threshold)
- `ffprobe` luminance analysis step before grading to detect dark/bright outliers
- A "screen capture" grade variant with higher brightness and less desaturation
- Guidelines for grain intensity on clips that already contain noise

**Resolution:** Define three grade variants:
1. **Standard** -- current filter (60% of clips: AI images, stock footage at normal exposure)
2. **Dark Scene** -- same contrast, brightness=0.0 or +0.01, grain reduced to `alls=12` (20% of clips: urban night, silhouettes)
3. **Screen Capture** -- contrast=1.05, saturation=0.85, no grain, no vignette (10% of clips: screen recordings, news headlines)

Add a `classify-clip` step in the assembly workflow that uses `ffprobe` to measure average luminance and assigns the appropriate grade variant.

---

### GAP-FF-003: Ken Burns Effect -- Insufficient Variation
**Severity: MEDIUM** | **Impact: Visual monotony across 10+ minute videos**

Ken Burns parameters are defined:
- Zoom range: 1.0x to 1.08x
- Duration: 5-8 seconds per image
- Direction: "Alternate zoom-in and slow pan"
- Ease: ease-in-out

For a 10-minute long-form video with ~40% static images = approximately 25-30 images at 5-8s each. With only one zoom range value (1.0 to 1.08), every image movement will look identical.

**What's missing:**
- Pan direction variations (left-to-right, right-to-left, top-to-bottom, diagonal)
- Zoom-out option (1.08x to 1.0x) as counterpoint
- Slight rotation (+/- 0.5 degrees) for tension moments
- Variation tied to content section (slower zoom for philosophical segments, slightly faster for list items)
- FFMPEG `zoompan` filter parameter templates for each variation

Haven learnings confirm: "Ken Burns zoom range: 1.0x to 1.15x (subtle). Larger zooms look nauseating." This is validated -- but BowTie Bullies specs 1.08x which is even more conservative. At 1.08x over 8 seconds, movement may be imperceptible on many images, creating a slideshow feeling.

**Resolution:** Define a Ken Burns variation library:

| Variation | Zoom | Pan | Use For |
|-----------|------|-----|---------|
| Standard Zoom In | 1.0x to 1.08x | None | Default |
| Standard Zoom Out | 1.08x to 1.0x | None | Alternate |
| Slow Pan Left | 1.0x to 1.04x | +30px horizontal | Urban textures |
| Slow Pan Right | 1.0x to 1.04x | -30px horizontal | Alternate |
| Push In (Hero) | 1.0x to 1.12x | None | Red Nose close-up, key moments |
| Hold (Contemplate) | 1.0x static | None | Philosophical holds |

Implement as a rotation array in the Code node -- each scene cycles through the next variation.

---

### GAP-FF-004: Transition Timing Partially Spec'd
**Severity: MEDIUM** | **Impact: Manual decision-making slows automation**

Transition rules are defined in both brand docs:

| Transition | Duration |
|-----------|----------|
| Hard Cut | Instant |
| Fade to Black | 1.0-1.5s |
| Dissolve | 0.5-0.8s |
| Slow Push | 3-6s (Ken Burns) |

Gaps:
1. **No default value within ranges.** Should "Fade to Black" be 1.0s or 1.5s by default? The automation needs a single value unless a scene-specific override is provided.
2. **No mapping from script markers to transitions.** The script template has `[Visual: Slow fade to Dark Steel black]` -- but how does the assembly workflow parse this? No regex or JSON key spec'd for transition type extraction.
3. **Missing: transition between long-form sections.** The visual rhythm section defines shot durations per section (Hook: 8-15s per shot, List: 3-5s per shot) but not the transitions between sections. Is Hook-to-Context a dissolve or fade-to-black?
4. **Shorts transitions not spec'd.** The shorts assembly instructions mention "faster cuts (2-4s per visual)" but no transition types for the 9:16 format.

**Resolution:** Define defaults: Fade to Black = 1.2s, Dissolve = 0.6s. Create a section-transition map (Hook to Context = dissolve, Context to List = hard cut, List item to List item = hard cut, List to Deep = fade to black, Deep to Close = fade to black). For shorts: hard cuts only (no transitions waste time in 15-60s format).

---

### GAP-FF-005: Audio Mixing -- No Ducking/Sidechain Specification
**Severity: HIGH** | **Impact: Music will compete with VO during pauses**

Audio levels are defined:
- VO: -12 to -14 dB
- Music: -26 to -32 dB
- Silence: music dips to -40dB
- Ambient SFX: -22 to -28 dB

However:
1. **No ducking automation.** How does the music know when VO is present vs. silent? The brand calls for music to dip to -40dB during intentional silences (1.5-3s), but no mechanism is spec'd for detecting VO presence.
2. **FFMPEG `sidechaincompress` is the correct tool** but is not documented anywhere. This filter uses the VO track as a sidechain to compress the music track automatically.
3. **Alternative approach: segment-based volume automation.** Using the script's pause markers, generate volume keyframes for the music track. This is more deterministic than sidechain compression but requires parsing the script.
4. **The `amix` filter in the template** (line 1460) simply mixes VO and music at fixed volumes. No dynamics processing.
5. **SFX layer not in the command template at all.** The audio mix defines 3 layers (VO, music, ambient SFX) but the FFMPEG template only handles 2.

**What exists from Haven:** Haven uses `volume=0.4` for B-Roll and `volume=0.15` ducked under voice for Talking Head. This is a fixed-volume approach -- no dynamic ducking.

**Resolution:** Implement one of two approaches:

**Option A (Simpler -- Segment-Based):** Parse script `[pause]` markers to generate a music volume automation envelope. During VO segments: -28dB. During pauses: -22dB (slightly louder, felt). During silence markers: -40dB. Build this as an `afade` keyframe chain in the FFMPEG filter.

**Option B (Better -- Sidechain):**
```bash
[0:a]volume=1.0[vo];
[1:a]sidechaincompress=threshold=0.02:ratio=8:attack=200:release=1000:level_sc=1[music_ducked];
```
This automatically ducks music when VO is present. Test whether FFMPEG's `sidechaincompress` is available in the n8n Docker container.

Also: Add the SFX layer as a third audio input with its own volume control.

---

### GAP-FF-006: Film Grain Overlay -- Implementation Is Additive Noise, Not Film Grain
**Severity: MEDIUM** | **Impact: Visual authenticity gap**

The current implementation uses FFMPEG's `noise` filter:
```
noise=alls=20:allf=t+u
```

This adds random noise (uniform + temporal). While functional, it is NOT true film grain:
- `noise` adds pixel-level random noise evenly across the frame
- Real 35mm film grain has luminance-dependent behavior (more visible in midtones, less in deep shadows and highlights)
- Real grain has a specific frequency/size characteristic that `noise` doesn't replicate

**What's missing:**
- No film grain overlay file referenced (a clean grain scan would be more authentic than noise filter)
- An `overlay.png` and `overlay.jpg` exist in the repo root -- but they are not referenced in any production doc
- No spec for grain consistency across clips (does the grain pattern reset per clip or flow continuously?)

**Resolution:** Two options:
1. **Keep `noise` filter** (acceptable for YouTube content). Document that `alls=20` is the canonical value. Add note that grain resets per clip at cuts (inherent to the filter being applied per-clip).
2. **Use overlay approach** (higher quality). Create a 1920x1080 film grain loop (10s, seamless) and overlay it using `blend=all_mode=overlay:all_opacity=0.15`. This gives consistent grain across the entire video. Check if the existing `overlay.png` in the repo root is intended for this purpose.

---

### GAP-FF-007: Vignette -- Not Adjusted Per Scene Type
**Severity: LOW** | **Impact: Minor visual inconsistency**

Current vignette: `vignette=PI/4:1.2` applied uniformly.

The visual style guide calls for:
- Thumbnails: "30-50% edge darkening"
- Video: "15-25% edge darkening" (under Color Grading Specs)
- The FFMPEG filter uses `PI/4:1.2` which is ~20% -- within the video range

**Missing:**
- Letterboxed 2.39:1 segments (philosophical content) should potentially skip vignette since letterbox bars already create visual framing
- Screen recordings should skip vignette -- it obscures UI elements at screen edges
- The difference between video vignette (15-25%) and thumbnail vignette (30-50%) is documented but the FFMPEG implementation is a single value

**Resolution:** Vignette at `PI/4:1.2` is acceptable as the universal video value. Add exception: skip vignette for screen capture clips (append to the screen capture grade variant from GAP-FF-002). Low priority.

---

### GAP-FF-008: Subtitle/Caption Burn-in for Shorts -- Not Automated
**Severity: HIGH** | **Impact: 80% of short-form viewers watch muted -- captions are mandatory**

The brand blueprint and visual style guide define detailed caption specs for shorts:
- Font: Bangers, 56-72px
- Color: #E7E7E1 with #9A4C22 highlight on current word
- Shadow: 3px 3px 12px rgba(0,0,0,0.9)
- Animation: word-by-word pop (scale 0.8 to 1.0)
- Max 2-3 words visible at a time
- Background pill optional

**What's missing:**
1. **No word-level timestamp generation workflow.** To do word-by-word captions, you need word-level timing from the VO audio. ElevenLabs does not return word timestamps in its API response. A separate speech-to-text step (e.g., Whisper) would be needed to generate word-level SRT/VTT.
2. **No FFMPEG `drawtext` template for animated captions.** The `drawtext` filter can render text but cannot do scale animations (0.8 to 1.0 pop). This requires either:
   - ASS subtitle format with animation keyframes
   - Remotion for programmatic caption rendering
   - A workaround using multiple overlapping `drawtext` calls with `enable` expressions
3. **Font availability on n8n server.** The spec calls for Bangers font. Haven learned (WF-006) that the n8n Docker container only has DejaVuSans. Bangers would need to be installed in the container or baked into a custom Docker image.
4. **No word-highlight color switching automation.** Highlighting the current word in Rust Orange while other words stay Bone White requires per-word `drawtext` calls with precise timing -- very complex in FFMPEG alone.

**This is a major automation gap.** Caption burn-in for shorts is arguably the highest-impact visual element for short-form engagement, and the spec describes a feature set that FFMPEG cannot easily deliver.

**Resolution:** Two approaches:

**Option A (FFMPEG -- Simplified):** Drop word-by-word animation. Use sentence-level captions from ElevenLabs SSML break markers. Burn in 2-3 lines of text using `drawtext` with fade in/out. No word highlighting. Simpler but less engaging.

**Option B (Remotion -- Full Spec):** Use Remotion (see Remotion section below) to render the caption overlay as a transparent video, then composite with FFMPEG. Remotion can handle word-level timing, scale animations, color highlighting natively in React. This matches the spec exactly but adds a render step.

**Option C (Third-Party):** Use CapCut API, Submagic, or similar caption service via n8n HTTP node. Outsources the hardest part but adds cost and dependency.

---

### GAP-FF-009: Batch Processing for Shorts Splice -- Spec'd But Not Detailed
**Severity: MEDIUM** | **Impact: Manual effort for 5-8 shorts per video**

WF-06 (Splice Engine) is architecturally spec'd in `brand-blueprint.md`:
- Trigger on long-form approval
- Read shorts breakdown JSON from script
- Loop per short: calculate trim points, scale to 9:16, add captions + music + hook text
- Upload and create Airtable records

**What's missing:**
1. **16:9 to 9:16 conversion strategy.** The spec says "crop center" but many scenes have Red Nose positioned off-center (3/4 angle poses). Center crop may cut off the subject. A "smart crop" or per-scene crop position would be needed.
2. **No trim point calculation from script markers.** The shorts breakdown JSON uses `start_marker` and `end_marker` as text strings, not timestamps. Converting script text markers to timestamps requires matching against the VO audio transcript with timestamps. No workflow for this exists.
3. **Hook text overlay for first 3 seconds of each short.** Spec'd in visual style guide (Anton 64-80px, slam animation). But the FFMPEG `drawtext` filter cannot do scale 1.2 to 1.0 slam animations. Same problem as GAP-FF-008.
4. **Batch execution performance.** 5-8 shorts per video, each requiring: trim + scale + crop + caption + music + overlay + render. At ~2-3 minutes per short render, this is 10-24 minutes of processing. Is this acceptable for the n8n server?

**Resolution:** Break WF-06 into phases:
1. Timestamp extraction (Whisper or ElevenLabs timing data)
2. Trim point calculation
3. 9:16 crop with configurable crop position per scene (default center, override for Red Nose poses)
4. Caption overlay (simplified or Remotion, per GAP-FF-008 resolution)
5. Sequential render via SplitInBatches (proven pattern from Haven)

---

### GAP-FF-010: Output Quality Settings -- CRF and YouTube Optimization
**Severity: MEDIUM** | **Impact: Upload file size and processing time**

Current spec: `-crf 18 -preset medium`

Analysis:
- CRF 18 is high quality but produces large files. For a 10-minute video at 1080p/24fps, expect ~800MB-1.5GB output.
- YouTube re-encodes everything. CRF 18 gives YouTube more data to work with, which is good for quality but increases upload time.
- `-preset medium` is a reasonable balance. `-preset slow` would give better compression at the same CRF but doubles encode time.
- `-movflags +faststart` is present (good -- enables progressive download/streaming).
- No two-pass encoding mentioned. Single-pass CRF is fine for variable bitrate but two-pass with a target bitrate gives more predictable file sizes.

**What's missing:**
- No target file size or bitrate range defined. YouTube recommends 8 Mbps for 1080p SDR. CRF 18 typically exceeds this.
- No shorts-specific quality setting. Shorts at 1080x1920/30fps can use CRF 20-22 (lower quality is less noticeable at short durations).
- No render time estimate. With `-preset medium`, expect ~1.5-2x realtime on a modern server. A 10-minute video renders in 15-20 minutes.
- No maximum file size constraint for Instagram (100MB limit per creative-learnings.md).

**Resolution:** Define output profiles:

| Profile | Resolution | CRF | Preset | Target Use | Est. File Size (10min) |
|---------|-----------|-----|--------|-----------|----------------------|
| YouTube Long-Form | 1920x1080/24fps | 18 | medium | YouTube upload | 800MB-1.2GB |
| YouTube Short | 1080x1920/30fps | 21 | fast | YouTube Shorts | 15-40MB |
| Instagram Reel | 1080x1920/30fps | 23 | fast | IG Reels (<100MB) | 10-30MB |
| Preview/QA | 1280x720/24fps | 28 | ultrafast | Internal review | 50-100MB |

---

## 2. AUDIO PRODUCTION GAPS

### GAP-AU-001: ElevenLabs SSML Markup -- Limited Scope
**Severity: MEDIUM** | **Impact: Reduced vocal expressiveness**

Current SSML spec (from `tyrone-voice-guide.md`):
```
[2 second pause] -> <break time="2000ms"/>
[1.5 second pause] -> <break time="1500ms"/>
[beat] -> <break time="800ms"/>
```

ElevenLabs supports additional SSML that could enhance Tyrone's delivery but is not spec'd:
1. **`<prosody>` for volume drops.** The voice guide says "drops in volume = emphasis." SSML can control this: `<prosody volume="-6dB">I have.</prosody>` -- but no prosody markup is spec'd.
2. **`<emphasis>` tags.** For words that need weight without volume change.
3. **`<phoneme>` for pronunciation control.** Technical terms like "CBDC" or "AGI" may need explicit pronunciation guidance.
4. **`<say-as>` for numbers and dates.** Stats like "34x" should be spoken as "thirty-four times" not "thirty-four x."

**Resolution:** Expand SSML coverage in the script processing Code node (WF-03):

| Script Marker | SSML Output | Use |
|---------------|-------------|-----|
| `[2 second pause]` | `<break time="2000ms"/>` | Already spec'd |
| `[1.5 second pause]` | `<break time="1500ms"/>` | Already spec'd |
| `[beat]` | `<break time="800ms"/>` | Already spec'd |
| `[quiet]...[/quiet]` | `<prosody volume="-6dB">...</prosody>` | NEW: Volume drops |
| `[emphasis]...[/emphasis]` | `<emphasis level="strong">...</emphasis>` | NEW: Weight |
| `34x` | `<say-as interpret-as="cardinal">34</say-as> times` | NEW: Numbers |

---

### GAP-AU-002: VO Post-Processing Chain -- Partially Spec'd
**Severity: MEDIUM** | **Impact: VO quality may not match professional YouTube channels**

The visual style guide defines VO post-processing:
```
EQ: Roll off below 80Hz (remove room rumble)
Compression: Gentle (3:1 ratio, slow attack)
De-ess: Light (preserve character)
Reverb: NONE (dry)
Normalization: -14 LUFS (YouTube standard)
```

**What's missing:**
1. **No FFMPEG implementation of this chain.** The EQ, compression, and de-essing described require specific FFMPEG audio filters but none are provided:
   - EQ: `highpass=f=80`
   - Compression: `acompressor=threshold=-20dB:ratio=3:attack=20:release=200`
   - De-ess: `adeclick` or custom bandpass filter around 5-8kHz (FFMPEG de-essing is limited)
   - Normalization: `loudnorm=I=-14:TP=-1.5:LRA=11` (EBU R128 targeting -14 LUFS)
2. **Should this be applied in n8n or pre-baked?** ElevenLabs output is already processed. Adding compression and EQ on top of their processing may degrade quality rather than improve it. Need to test ElevenLabs raw output first to determine if post-processing is even needed.
3. **No A/B test protocol.** Before committing to a processing chain, compare ElevenLabs raw vs. processed. Document the result.

**Resolution:** Create the FFMPEG audio chain but make it conditional:
```bash
# VO Post-Processing (apply only if ElevenLabs output needs it)
ffmpeg -i vo_raw.mp3 \
  -af "highpass=f=80,acompressor=threshold=-20dB:ratio=3:attack=20:release=200,loudnorm=I=-14:TP=-1.5:LRA=11" \
  vo_processed.mp3
```
Add a manual QA step: listen to raw vs. processed. If ElevenLabs is already good enough, skip the chain and save processing time.

---

### GAP-AU-003: Music Sourcing Workflow -- No Integration Spec'd
**Severity: HIGH** | **Impact: Manual music selection bottleneck**

The brand blueprint lists music sources:
- Epidemic Sound ($15/mo) -- primary
- Artlist ($10/mo) -- alternative
- Pixabay Music / YouTube Audio Library -- free
- Udio/Suno for branded intro stinger

**What's missing:**
1. **No API integration for Epidemic Sound.** Epidemic Sound has a B2B API but no public creator API for automated search/download. This means music selection and download is 100% manual.
2. **No music-to-mood mapping workflow.** The brand defines 5 music moods (Dark Ambient, Sparse Drums, Melancholy Keys, Tension, Contemplative) with BPM ranges. But no workflow maps a script's content type to a music mood, searches the library, and downloads the track.
3. **No pre-curated music library.** Without API access, the pragmatic approach is to pre-download 15-20 tracks (3-4 per mood), optimize them per the audio optimization pattern, and store in Google Drive. The assembly workflow picks from this library based on script metadata.
4. **Intro/outro stinger not created.** The blueprint mentions using Udio/Suno for a branded stinger. No stinger has been generated or spec'd (duration, tone, instrumentation).

**Resolution:**
1. **Pre-curate a music library.** Download 20 tracks from Epidemic Sound covering all 5 moods. Apply the audio optimization pattern (compress, trim to 90s for long-form or 40s for shorts, pre-fade). Store in Google Drive with naming convention: `btb-music-{mood}-{number}-{duration}s-128k.mp3`.
2. **Add a `music_mood` field to the Scripts Airtable table.** WF-05 reads this field and selects a track from the pre-curated library.
3. **Generate intro/outro stinger.** Use Suno/Udio: "Dark ambient, 5 seconds, sub-bass drone, single clean guitar note, fade out. No melody. No drums. Cinematic. Film score." Optimize to 5s at 128kbps.

---

### GAP-AU-004: Music Ducking Automation Location
**Severity: HIGH** | **Impact: Music/VO balance requires manual mixing**

Cross-reference with GAP-FF-005. The question "how is ducking done?" has no answer:

- Not in FFMPEG (only fixed `amix` in the template)
- Not in n8n (no workflow node handles audio dynamics)
- Not in ElevenLabs (they output dry VO only)
- Not in post-production (no DaVinci Resolve step is in the automated pipeline)

The Haven pipeline uses fixed volume (0.15 for music under voice) which works for 25-35s B-roll content. For 10+ minute long-form with intentional silences where music should swell, fixed volume creates a flat audio experience.

**Resolution:** See GAP-FF-005 for implementation options. The music ducking MUST be resolved in the FFMPEG assembly step. Sidechain compression is the cleanest approach if available in the n8n FFMPEG build.

---

### GAP-AU-005: Sound Design / SFX Library -- Undefined
**Severity: MEDIUM** | **Impact: Audio dimension missing from production**

The audio mix spec includes "Ambient SFX: -22 to -28 dB (city sounds, rain, hum -- sparse)" but:

1. **No SFX library defined.** Where do city sounds, rain, and hum come from? Freesound.org? Epidemic Sound SFX? YouTube Audio Library?
2. **No SFX-to-scene mapping.** Which script sections get which SFX? Is rain mapped to philosophical content? Is city hum mapped to surveillance content?
3. **No SFX layer in the FFMPEG command template.** Only VO and music are mixed. Adding SFX requires a third audio input.
4. **SFX should be very sparse** per the brand -- "sparse" is the word used. But "sparse" needs quantification: 2-3 SFX moments per 10-minute video? Background texture throughout?

**Resolution:**
1. Pre-curate 10 SFX files: distant city, rain on concrete, electrical hum, distant siren, wind through chain-link, phone notification, keyboard typing, radio static, surveillance camera motor, footsteps on concrete. Store in Drive at 128kbps.
2. Define SFX as optional -- a manual selection step in QA, not automated. Keep the assembly workflow SFX-free for v1 and add SFX in a v2 polish pass.
3. When adding SFX, extend the FFMPEG filter to 3 audio inputs:
```bash
[0:a]volume=1.0[vo];
[1:a]volume=0.12[music];
[2:a]volume=0.25[sfx];
[vo][music][sfx]amix=inputs=3:duration=first[audio];
```

---

### GAP-AU-006: Audio Normalization -- Target Confirmed But Not In Pipeline
**Severity: MEDIUM** | **Impact: Videos may fail YouTube loudness standards**

The spec says "-14 LUFS (YouTube standard)" for VO normalization. However:

1. **The FFMPEG `loudnorm` filter is not in the assembly command template.** The VO is mixed at `volume=1.0` with music at `volume=0.12`, but the final output is not normalized.
2. **YouTube recommends -14 LUFS integrated for the entire program.** This should be applied as a final mastering step on the complete audio mix, not just the VO.
3. **No `ffmpeg -af loudnorm` in any workflow spec.**

**Resolution:** Add a final audio normalization pass after assembly:
```bash
# Two-pass loudnorm for accurate targeting
ffmpeg -i assembled.mp4 -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1
# Parse output, apply measured correction in second pass
ffmpeg -i assembled.mp4 -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=...:measured_TP=...:measured_LRA=...:measured_thresh=..." -c:v copy final.mp4
```
Or use single-pass with dynamic mode (less accurate but simpler):
```bash
ffmpeg -i assembled.mp4 -af "loudnorm=I=-14:TP=-1.5:LRA=11" -c:v copy final.mp4
```

---

### GAP-AU-007: Silence Detection and Insertion -- Not Automated
**Severity: LOW** | **Impact: Minor -- pauses are scripted, not detected**

Silence is scripted in the content (`[2 second pause]`, `[1.5 second pause]`). These are converted to SSML `<break>` tags for ElevenLabs. The silence is therefore already present in the VO audio.

**Remaining gap:** No verification step confirms that ElevenLabs actually rendered the silence correctly. A `silencedetect` pass on the VO output would validate that pauses are present at the expected timestamps.

**Resolution:** Add optional QA step: run `ffmpeg -i vo.mp3 -af silencedetect=n=-50dB:d=1.0 -f null -` and compare detected silence timestamps against script markers. Low priority -- only needed if ElevenLabs is observed to skip breaks.

---

## 3. VISUAL ASSET PIPELINE GAPS

### GAP-VA-001: Image Generation Workflow -- No QC Loop Defined
**Severity: HIGH** | **Impact: AI-generated images may not match brand**

WF-04 (Visual Generator) is architecturally spec'd but lacks quality control:

1. **No scoring loop for generated images.** Haven's pipeline uses Gemini Vision to score images 1-10 with threshold 7, retry on fail, max 3 attempts. BowTie Bullies WF-04 mentions `Split In Batches` but no scoring/retry logic.
2. **No consistency check against Red Nose character sheet.** The brand blueprint provides detailed consistency markers and negative prompts, but the workflow doesn't spec a validation step that checks: "Does this image actually show the correct dog breed, coat color, nose color, ear shape, scar, and bowtie?"
3. **No fallback for generation failures.** What happens when Gemini/Kie.AI returns an off-brand image after 3 retries? Is there a stock footage fallback? A placeholder? A human escalation?

**What exists from Haven:**
- Quality scoring retry loop: Gemini Vision scores 1-10, threshold 7. On fail: refine prompt with "Improve consistency" + previous issues. Max 3 attempts. Use IF node to branch proceed vs retry.
- Character sheet reference images sent as multimodal input to Gemini.

**Resolution:** Port Haven's QC loop to BowTie Bullies WF-04:
1. Generate image with Gemini/Kie.AI using brand prompts
2. Score with Gemini Vision against character sheet reference
3. If score < 7: refine prompt, retry (max 3)
4. If still failing: flag for manual review, use stock footage fallback
5. Log all generations and scores to Airtable Assets table

---

### GAP-VA-002: AI Generation Failure Handling
**Severity: HIGH** | **Impact: Pipeline stops on generation failure**

**What's missing:**
1. **No error handling for API rate limits.** Gemini, Kie.AI, and Nano Banana all have rate limits. WF-04 uses `Split In Batches (3 at a time)` but no backoff/retry logic for 429 responses.
2. **No cost circuit breaker.** If the retry loop burns through attempts, there's no budget limit per video. A bad prompt could trigger 30+ API calls across 10 scenes.
3. **No "good enough" threshold.** At what point does the workflow accept a slightly off-brand image vs. continuing to retry? The Haven threshold of 7/10 is reasonable but needs calibration for BowTie Bullies specifically.
4. **No handling for Red Nose character consistency drift.** Over multiple videos, if the AI generates slightly different-looking dogs, the brand identity erodes. No longitudinal tracking of character consistency scores.

**Resolution:**
1. Add exponential backoff for API 429s: wait 2s, 4s, 8s, max 30s.
2. Set per-video budget limit: max 50 API image calls. If exceeded, flag for manual intervention.
3. Calibrate scoring threshold by generating 20 test images, having a human rate them, and establishing the threshold where human and AI scoring align.
4. Add a `consistency_score` field to Airtable Assets. Track average per-video. Alert if trending downward.

---

### GAP-VA-003: Image Resolution Requirements Per Context
**Severity: MEDIUM** | **Impact: Wrong resolution wastes compute or degrades quality**

The specs define output resolutions:
- Long-form: 1920x1080 (16:9)
- Shorts: 1080x1920 (9:16)
- Thumbnails: 1280x720

**What's missing:**
1. **AI generation resolution not spec'd.** Should Gemini/Kie.AI generate at 1920x1080 directly, or generate larger and downscale? Generating at 2x (3840x2160) and downscaling produces sharper results after the sharpening pass.
2. **Upscaling spec for stock footage.** Pexels free footage may be 720p or 1080p. If 720p, should it be AI-upscaled or is FFMPEG `scale` sufficient?
3. **Thumbnail generation resolution.** Thumbnails are 1280x720 but Red Nose images for thumbnails should be generated at higher resolution and composited. No resolution for Red Nose thumbnail assets is spec'd.

**Resolution:** Define generation targets:
- AI images for video: Generate at 1920x1080 minimum (Gemini imagen supports this natively)
- Red Nose for thumbnails: Generate at 2560x1440 and downscale to 1280x720 for compositing headroom
- Stock footage: Accept 1080p minimum. Reject 720p or lower.
- Video clips (Kie.AI): Generate at output resolution (1920x1080 for long-form, 1080x1920 for shorts)

---

### GAP-VA-004: Video Clip Generation -- Kie.AI/Nano Banana Parameters Incomplete
**Severity: HIGH** | **Impact: Video clip quality and style may not match brand**

The blueprint provides basic Kie.AI setup:
```
Model: veo3_fast or veo3
Aspect Ratio: 16:9 or 9:16
Duration: 5-8 seconds
Callback: n8n webhook URL
Auth: HTTP Header Auth
```

**What's missing:**
1. **Prompt template for video clips.** Image prompts are extensively documented (B-Roll Visual Library in visual-style-guide.md has 13 prompt templates) but no video clip prompts exist. Kie.AI (Veo 3.1) requires motion descriptions ("slow push into", "camera tracks left", "dust particles floating") that static image prompts don't include.
2. **Nano Banana as backup -- no parameters at all.** The blueprint says "Use as: Secondary/backup video generator" and "Best for: Abstract visualizations" but provides zero configuration details.
3. **No camera motion vocabulary.** The cinema_knowledge library has camera movement docs but these aren't connected to Kie.AI prompt templates. Motion terms like "dolly in", "parallax pan", "slow tilt down" need to be translated to Kie.AI-compatible prompt language.
4. **Video clip QC.** How do you score a 5-8 second AI video clip for brand consistency? Gemini Vision can analyze a still frame but temporal quality (smooth motion, no artifacts, consistent lighting) needs a different approach.
5. **Cost per clip not validated.** The blueprint estimates $0.10-0.50/clip but Veo 3.1 pricing may have changed.

**Resolution:**
1. Create 10 video clip prompt templates based on the existing image prompts, adding motion descriptions:
   - "Slow dolly forward into chain-link fence, shallow DOF, sodium vapor streetlight, night, dust particles, 5 seconds, 16:9"
   - "Camera slowly pushes into Red Nose Pitbull face, one eye fills frame, amber eye catches rust light, 6 seconds, 16:9"
2. Document Nano Banana API parameters when testing begins.
3. For video QC: extract first frame and last frame, score both with Gemini Vision, check for temporal artifacts by analyzing frame-to-frame consistency (average SSIM score via `ffmpeg -lavfi ssim`).
4. Validate Kie.AI pricing with a 10-clip test batch.

---

### GAP-VA-005: Stock Footage Acquisition -- No Workflow
**Severity: MEDIUM** | **Impact: Manual stock footage hunting is slow**

The blueprint mentions Pexels API (free) for stock footage (30% of visual mix). However:

1. **No Pexels API integration in any workflow.** The WF-04 node diagram shows a stock footage branch but no API call parameters.
2. **No search term mapping.** Script sections need to be mapped to Pexels search queries. "Urban streets at night" is listed but not formalized as a search query library.
3. **No license compliance tracking.** Pexels is free but requires attribution in some cases. No tracking of which videos use which stock clips.
4. **Color grading stock footage to match AI visuals.** Stock footage has natural color. AI visuals have the brand grade baked in by prompt. After applying the FFMPEG color grade filter, do they match? Untested.

**Resolution:**
1. Build Pexels API integration in WF-04 stock footage branch: `GET https://api.pexels.com/videos/search?query={term}&per_page=5&orientation=landscape`
2. Create search query library mapped to content categories (30+ terms covering urban, industrial, tech, hands, weather)
3. Log Pexels video IDs in Airtable Assets for attribution
4. Test color grade on 5 Pexels clips to verify visual consistency with AI-generated content

---

### GAP-VA-006: Asset Naming Convention -- Defined But Not Enforced
**Severity: LOW** | **Impact: Organizational friction as library grows**

The visual style guide defines naming:
```
[platform]-[type]-[topic]-[variant]-[date].[ext]
Example: yt-thumb-ai-blacklist-v1-20260215.png
```

**What's missing:**
1. No n8n node or Code logic enforces this naming. File uploads to Google Drive use whatever name the generation process outputs.
2. No renaming step in any workflow spec.

**Resolution:** Add a Code node in each workflow's upload step that renames files to the convention before Drive upload. Use script metadata (platform, content type, topic slug) to generate the filename.

---

### GAP-VA-007: Asset Storage and Retrieval -- Google Drive Structure Undefined
**Severity: MEDIUM** | **Impact: Assets become unfindable as volume grows**

Haven's learnings show Google Drive folder creation is a validated pattern. BowTie Bullies defines storage at a high level (`cinema_knowledge/bowtie-bullies/` for character sheets) but:

1. **No Google Drive folder hierarchy spec'd for production assets.** Haven created a structured folder tree. BowTie Bullies needs the same.
2. **No folder IDs documented.** Every workflow that uploads/downloads from Drive needs folder IDs. None are documented.
3. **No retention policy.** AI-generated images that fail QC -- are they deleted or archived?

**Resolution:** Define and create Drive folder structure:
```
BowTie Bullies/
  Character Sheets/     (Red Nose reference images)
  Music Library/        (Pre-curated, optimized tracks)
  SFX Library/          (Ambient sounds)
  Episodes/
    EP01-Victory-Lap/
      Scripts/
      VO/
      Visuals/
      Assembled/
      Shorts/
    EP02-Bullets/
      ...
  Thumbnails/
  Templates/            (Overlay graphics, lower third templates)
```
Document folder IDs in the spec kit or Airtable.

---

## 4. ASSEMBLY WORKFLOW GAPS

### GAP-AW-001: Shot List to Timeline Conversion -- No Automation
**Severity: CRITICAL** | **Impact: Core automation gap between script and video**

The pipeline architecture shows:
```
Script (Airtable) -> Visual Generator -> FFMPEG Assembler
```

But the critical middle step -- converting a script into a timed shot list -- is not spec'd:

1. **Script has sections with visual directions** (e.g., `[Visual: Slow push into urban texture]`) but no timestamp mapping.
2. **VO audio has implicit timing** (each section's duration is determined by the VO recording length), but the script doesn't know timestamps until VO is generated.
3. **The assembly workflow needs:** For each N-second chunk of VO, which visual asset plays? This is a **timeline** -- and no workflow generates it.

**What Haven does:** Haven's pipeline uses a simpler model -- each scene in the shot list is independent (product + avatar + text). BowTie Bullies is more complex: the VO is continuous, and visuals must be timed to match the narration.

**Resolution:** Create a timeline generation step (after VO is generated, before visual generation):
1. Run Whisper or ElevenLabs timestamps on the VO to get word-level timing
2. Map script sections to VO timestamps (section breaks align with pause markers)
3. Calculate per-section duration from VO timestamps
4. Assign visual type and duration to each section
5. Output a timeline JSON:
```json
{
  "timeline": [
    {"start": 0.0, "end": 8.5, "section": "cold_open", "visual_type": "ai_image", "prompt": "...", "ken_burns": "zoom_in", "transition_out": "dissolve"},
    {"start": 8.5, "end": 35.0, "section": "context", "visual_type": "stock", "search_query": "...", "transition_out": "hard_cut"},
    ...
  ]
}
```
This JSON feeds both WF-04 (Visual Generator -- knows what to generate) and WF-05 (FFMPEG Assembler -- knows timing and transitions).

---

### GAP-AW-002: Preview/QC Step Before Final Render
**Severity: MEDIUM** | **Impact: Wasted render time on QA failures**

The pipeline has a `HUMAN QA GATE` after assembly. But:

1. **No low-res preview render.** The full 1080p CRF 18 render takes 15-20 minutes. If QA rejects it, that time is wasted.
2. **No thumbnail-from-video extraction.** Generating a thumbnail from the actual video content (pull frame at timestamp) isn't spec'd.
3. **No audio-only preview.** Before rendering video, a VO + music mix preview would catch audio issues faster.

**Resolution:**
1. Add a Preview render profile (720p, CRF 28, ultrafast) -- renders in ~3 minutes. Use for internal QA.
2. Add `ffmpeg -ss 00:00:15 -i video.mp4 -vframes 1 -q:v 2 thumbnail_preview.jpg` to extract a frame for quick visual check.
3. Add audio-only render step: mix VO + music + SFX without video processing. Review in 30 seconds.

---

### GAP-AW-003: Multi-Format Output -- Same Assets, Multiple Formats
**Severity: MEDIUM** | **Impact: Redundant work if not planned**

The brand produces:
- 16:9 long-form (YouTube)
- 9:16 shorts (YouTube Shorts)
- 9:16 reels (Instagram)

**What's missing:**
1. **Reels vs. Shorts -- are they identical?** The blueprint suggests "best shorts repurposed" for IG Reels. If identical, no gap. But IG has different safe zones (described in visual-style-guide.md) and the caption overlay position may differ.
2. **YouTube Shorts have a 60-second limit.** Some "Story" clips in the splice strategy are 45-60s. At exactly 60s, YouTube may not classify it as a Short. Buffer to 59 seconds max.
3. **No re-encoding step for Instagram.** YouTube handles re-encoding, but Instagram is strict about file size (<100MB per creative-learnings.md) and codec. A re-encode step may be needed to hit IG size limits.

**Resolution:** Define format matrix:

| Source Format | Platform | Changes Needed |
|---------------|----------|---------------|
| 9:16 Short (from splice) | YouTube Shorts | None -- direct upload, max 59s |
| 9:16 Short (from splice) | IG Reels | Re-encode if >100MB, adjust safe zones |
| 16:9 Long-form | YouTube | None -- direct upload |

---

### GAP-AW-004: Version Control for Video Projects
**Severity: LOW** | **Impact: Cannot roll back to previous versions**

No version control system for video project files (scripts, assets, assembled videos) is defined.

**What exists:** Git for code/docs. Google Drive for media files (no versioning by default).

**Resolution:** Use Google Drive's built-in version history (automatic for files <100MB). For videos >100MB, use the naming convention with version numbers: `ep01-victory-lap-v1.mp4`, `ep01-victory-lap-v2.mp4`. Archive rejected versions in an `_archive` subfolder rather than deleting.

---

## 5. REMOTION POTENTIAL

### GAP-RM-001: Remotion for On-Screen Graphics
**Severity: MEDIUM** | **Impact: Graphics quality limited by FFMPEG drawtext**

The brand defines 5 types of on-screen graphics:
1. Lower thirds (slide in, hold, fade out)
2. Data overlays / survival telemetry (typewriter effect)
3. Stat callouts (number count-up animation)
4. Quote cards (fade in/out)
5. Product overlays (slide in/out)

**FFMPEG `drawtext` limitations:**
- Can render static text with basic animations (fade via alpha expression, position via x/y expression)
- Cannot do typewriter effect natively (character-by-character reveal)
- Cannot do number count-up animation
- Cannot do scale animations (slam/pop effects)
- Cannot render semi-transparent background pills with rounded corners
- Font rendering quality is lower than browser-based rendering

**Remotion advantages:**
- React components = full animation control (scale, opacity, position, timing)
- CSS-driven styling (rounded corners, shadows, gradients -- trivial)
- Word-by-word caption rendering with color highlighting (see GAP-FF-008)
- Consistent font rendering (uses browser engine)
- Can export transparent video (ProRes 4444 or WebM alpha) for compositing with FFMPEG

**Assessment:** Remotion is the RIGHT tool for the graphics layer of BowTie Bullies. The brand's graphic specs describe web-animation-level features that FFMPEG was not designed to deliver.

**Resolution:** Create Remotion compositions for each graphic type:

| Composition | Input | Output | Duration |
|-------------|-------|--------|----------|
| `LowerThird` | `{label, value, accent_color}` | Transparent video | 4-6s |
| `TelemetryOverlay` | `{data_lines: [{key, value}]}` | Transparent video | 5-8s |
| `StatCallout` | `{number, label}` | Transparent video | 3-4s |
| `QuoteCard` | `{quote, attribution}` | Transparent video | 4-6s |
| `ProductOverlay` | `{name, price, image_url}` | Transparent video | 4-5s |
| `CaptionTrack` | `{words: [{text, start, end}], highlight_color}` | Transparent video | Full duration |

Render each composition at the correct timestamp, then composite with FFMPEG using overlay filter. This separates graphic rendering (Remotion) from video assembly (FFMPEG).

---

### GAP-RM-002: Remotion for Dynamic Caption Generation in Shorts
**Severity: HIGH** | **Impact: Caption quality defines short-form engagement**

This is the strongest case for Remotion in the BowTie Bullies pipeline. Cross-reference GAP-FF-008.

The spec requires:
- Word-by-word pop animation (scale 0.8 to 1.0)
- Current word highlighted in Rust Orange (#9A4C22)
- 2-3 words visible at a time
- Background pill with rounded corners
- Text shadow

**FFMPEG cannot do this.** Not at the quality level described. Remotion can do ALL of it with a single React component and word-level timestamp data.

**Implementation path:**
1. Generate VO with ElevenLabs
2. Run Whisper on VO to get word-level timestamps (JSON output)
3. Feed word timestamps + transcript to Remotion `CaptionTrack` composition
4. Render at 1080x1920 with transparent background
5. Composite caption video over content video with FFMPEG overlay

**Remotion component sketch:**
```tsx
const CaptionTrack = ({words, fps}) => {
  const frame = useCurrentFrame();
  const currentTime = frame / fps;

  const visibleWords = words.filter(w =>
    w.start <= currentTime && w.end >= currentTime - 0.5
  );

  return (
    <div style={{position: 'absolute', bottom: '40%', textAlign: 'center'}}>
      {visibleWords.map(word => (
        <span style={{
          color: word.start <= currentTime && word.end >= currentTime
            ? '#9A4C22' : '#E7E7E1',
          fontSize: 64,
          fontFamily: 'Bangers',
          transform: `scale(${interpolate(
            currentTime - word.start, [0, 0.1], [0.8, 1.0], {extrapolateRight: 'clamp'}
          )})`,
          textShadow: '3px 3px 12px rgba(0,0,0,0.9)',
        }}>
          {word.text}{' '}
        </span>
      ))}
    </div>
  );
};
```

**This alone justifies adding Remotion to the pipeline.**

---

### GAP-RM-003: Remotion for Thumbnail Generation Automation
**Severity: LOW** | **Impact: Thumbnails can be done manually with Canva**

The brand defines 4 thumbnail types (Watch, Guard, Companion, Silhouette) with consistent specs. Could Remotion automate these?

**Assessment: Possible but low priority.**
- Thumbnails require a Red Nose image (AI-generated, varies per episode)
- Thumbnails require custom text (varies per episode)
- The layout is formulaic (image top 40%, text bottom 30%, vignette, grain)
- Remotion could composite AI-generated Red Nose image + text overlay + vignette + grain into a thumbnail
- But thumbnail creation is a 5-minute task in Canva. Automating saves minimal time.

**Resolution:** Park for v2. If producing 4+ episodes/month, the cumulative time savings justify automation. For now, manual thumbnail creation is acceptable.

---

## 6. CROSS-CUTTING GAPS

### GAP-CC-001: Whisper / Word-Level Timestamp Generation -- Missing Dependency
**Severity: CRITICAL** | **Impact: Blocks captions (GAP-FF-008), timeline (GAP-AW-001), shorts splice (GAP-FF-009)**

Multiple gaps converge on the same missing capability: **word-level timestamps from VO audio.**

| Gap | Needs Word Timestamps For |
|-----|--------------------------|
| GAP-FF-008 | Caption burn-in timing |
| GAP-FF-009 | Short trim point calculation from script markers |
| GAP-AW-001 | Script section to VO timing alignment |
| GAP-RM-002 | Remotion caption word highlighting |

**Resolution:** Add OpenAI Whisper (or faster alternative: `faster-whisper` or `whisper.cpp`) to the pipeline:
1. Install in n8n Docker container or run as separate service
2. Run on every VO file immediately after ElevenLabs generation
3. Output word-level JSON: `[{word: "You", start: 0.0, end: 0.3}, {word: "open", start: 0.35, end: 0.6}, ...]`
4. Store in Airtable Assets table (as JSON attachment or linked)
5. Feed downstream to timeline builder, caption renderer, and splice engine

This is the single most impactful infrastructure addition. Resolving this unblocks 4 other gaps.

---

### GAP-CC-002: n8n Docker Container -- Missing Dependencies
**Severity: HIGH** | **Impact: Workflows will fail at runtime**

Based on Haven learnings, the n8n Docker container has limited pre-installed software:
- **Has:** ffmpeg, ffprobe, curl
- **Has:** DejaVuSans font
- **Missing:** Bangers font (required for brand typography)
- **Missing:** Montserrat font (required for captions/data)
- **Missing:** Anton font (required as fallback/data)
- **Missing:** Whisper (if chosen for timestamps)
- **Missing (possible):** ffmpeg `sidechaincompress` filter (depends on build)

**Resolution:** Create a custom n8n Docker image or a font installation script:
```dockerfile
FROM n8nhq/n8n:latest
RUN apk add --no-cache fontconfig
COPY fonts/Bangers-Regular.ttf /usr/share/fonts/truetype/bangers/
COPY fonts/Montserrat-Regular.ttf /usr/share/fonts/truetype/montserrat/
COPY fonts/Montserrat-Bold.ttf /usr/share/fonts/truetype/montserrat/
COPY fonts/Anton-Regular.ttf /usr/share/fonts/truetype/anton/
RUN fc-cache -f -v
```

Validate `sidechaincompress` filter availability: `ffmpeg -filters | grep sidechain`

---

### GAP-CC-003: End-to-End Render Time -- Not Estimated
**Severity: LOW** | **Impact: Expectation management**

No estimate exists for total pipeline execution time for one episode.

**Estimated breakdown (10-minute long-form):**

| Step | Time Estimate |
|------|--------------|
| Script generation (Gemini) | 30s |
| VO generation (ElevenLabs) | 2-3 min |
| Whisper timestamps | 1-2 min |
| Visual generation (30 images/clips) | 15-30 min (rate-limited) |
| Visual QC loop | 5-10 min (retries) |
| Stock footage download | 2-5 min |
| Remotion graphics render | 5-10 min |
| FFMPEG assembly | 15-20 min |
| Shorts splice (5-8 shorts) | 15-25 min |
| Upload to Drive | 5-10 min |
| **Total** | **~60-120 min per episode** |

Plus QA review time (human): 15-30 min per episode.

**Resolution:** Document these estimates in the spec kit. Set expectation: one full episode pipeline run = ~2 hours wall clock, ~90 minutes compute.

---

## PRIORITY MATRIX

### Must Resolve Before First Video (Blocks Production)

| Gap ID | Description | Severity |
|--------|------------|----------|
| GAP-CC-001 | Whisper word-level timestamps | CRITICAL |
| GAP-AW-001 | Shot list to timeline conversion | CRITICAL |
| GAP-FF-001 | Dynamic FFMPEG command builder | CRITICAL |
| GAP-FF-005 | Audio ducking/sidechain | HIGH |
| GAP-FF-008 | Caption burn-in for shorts | HIGH |
| GAP-VA-001 | Image QC loop | HIGH |
| GAP-AU-003 | Music library curation | HIGH |

### Must Resolve Before First Publish (Quality Gates)

| Gap ID | Description | Severity |
|--------|------------|----------|
| GAP-FF-002 | Color grade edge cases | HIGH |
| GAP-AU-004 | Music ducking in FFMPEG | HIGH |
| GAP-VA-002 | AI generation failure handling | HIGH |
| GAP-VA-004 | Video clip prompt templates | HIGH |
| GAP-CC-002 | n8n Docker font dependencies | HIGH |
| GAP-AU-006 | Audio normalization (-14 LUFS) | MEDIUM |
| GAP-FF-010 | Output quality profiles | MEDIUM |

### Resolve Within First 2 Weeks (Efficiency)

| Gap ID | Description | Severity |
|--------|------------|----------|
| GAP-FF-003 | Ken Burns variation library | MEDIUM |
| GAP-FF-004 | Transition defaults and section mapping | MEDIUM |
| GAP-FF-009 | Shorts batch processing details | MEDIUM |
| GAP-AU-001 | Expanded SSML markup | MEDIUM |
| GAP-AU-002 | VO post-processing chain | MEDIUM |
| GAP-RM-001 | Remotion graphics compositions | MEDIUM |
| GAP-RM-002 | Remotion caption generation | HIGH |
| GAP-VA-005 | Pexels API integration | MEDIUM |
| GAP-VA-007 | Google Drive folder structure | MEDIUM |
| GAP-AW-002 | Preview/QA render step | MEDIUM |
| GAP-AW-003 | Multi-format output matrix | MEDIUM |

### Resolve Within First Month (Polish)

| Gap ID | Description | Severity |
|--------|------------|----------|
| GAP-FF-006 | Film grain overlay vs. noise filter | MEDIUM |
| GAP-FF-007 | Vignette per scene type | LOW |
| GAP-AU-005 | SFX library | MEDIUM |
| GAP-AU-007 | Silence detection QA | LOW |
| GAP-VA-003 | Image resolution per context | MEDIUM |
| GAP-VA-006 | Asset naming enforcement | LOW |
| GAP-AW-004 | Version control for video projects | LOW |
| GAP-RM-003 | Thumbnail automation | LOW |
| GAP-CC-003 | Render time documentation | LOW |

---

## SUMMARY

**Total Gaps Identified: 30**

| Severity | Count |
|----------|-------|
| CRITICAL | 3 |
| HIGH | 10 |
| MEDIUM | 14 |
| LOW | 6 |

**Three CRITICAL blockers** (GAP-CC-001, GAP-AW-001, GAP-FF-001) all relate to the same core problem: **converting a script + VO into a timed, assembled video automatically.** The brand documents are thorough in defining WHAT the output should look and sound like. The gap is in HOW the assembly pipeline gets from raw assets to finished video without human intervention at every step.

**Single highest-impact action:** Implement Whisper word-level timestamp generation (GAP-CC-001). This single addition unblocks captions, timeline generation, shorts splicing, and Remotion caption rendering -- four downstream gaps resolved by one infrastructure piece.

**Second highest-impact action:** Build the timeline generation workflow (GAP-AW-001). This bridges the gap between "script with visual directions" and "FFMPEG command with clip timings."

**Third highest-impact action:** Adopt Remotion for the graphics layer (GAP-RM-001 + GAP-RM-002). The brand's graphic specs describe features that FFMPEG drawtext cannot deliver at quality. Remotion is already in the agent toolset (Creative worker, formerly Spike). Using it for transparent overlay rendering and caption tracks would be a natural fit.

**The brand blueprint, visual style guide, voice guide, and episode guide are EXCELLENT creative documents.** The gap is entirely on the technical execution side -- specifically, the automation glue between AI content generation and FFMPEG assembly. Haven's Phase 1 B-Roll pipeline provides proven patterns for ~40% of the technical architecture. The remaining 60% needs BowTie Bullies-specific development, particularly around long-form video assembly, dynamic audio mixing, and caption rendering.

---

*"The specs know what the video should feel like. The pipeline doesn't know how to build it yet. That's the gap."*
