# BOWTIE BULLIES — THE AFTERMATH | Intro & Outro Specification

## Frame-by-Frame Breakdown for Video Intro and Outro Sequences

### Reference Document — Addresses Gap 1.2.4

---

## INTRO SEQUENCE

### Overview

| Property | Value |
|----------|-------|
| Duration | 3.5 seconds (84 frames at 24fps) |
| Resolution | 1920x1080 (16:9) long-form / 1080x1920 (9:16) shorts variant |
| Frame Rate | 24fps (long-form) / 30fps (shorts) |
| Color Grade | Brand standard — desaturated, high contrast, rust midtones |
| Audio | Custom stinger (spec below) |

### Frame-by-Frame Breakdown (24fps)

#### Phase 1: Black Rise (Frames 1-18 / 0.00s - 0.75s)

```
FRAMES 1-6 (0.00s - 0.25s):
  Visual: Pure black (#000000). Nothing.
  Audio: Silence. Then at frame 4, a sub-bass rumble begins (30Hz,
         -40dB, slow fade in).

FRAMES 7-12 (0.25s - 0.50s):
  Visual: Black begins to lift to Dark Steel (#1E1E20). Subtle.
          Like eyes adjusting to a dark room.
  Audio: Sub-bass rumble building to -30dB. A distant low
         metallic scrape sound (-28dB) begins.

FRAMES 13-18 (0.50s - 0.75s):
  Visual: Dark Steel established as background. Very faint film
          grain begins (8% opacity, building to 20%).
          Center of frame: a barely perceptible warm glow starts.
          Rust-orange (#9A4C22) light source fading in from the
          center-left, suggesting a sodium vapor light turning on.
  Audio: Sub-bass at -26dB. Metallic scrape fades. A single low
         piano note hits (C2, -22dB, long decay, 4-second tail).
```

#### Phase 2: Red Nose Reveal (Frames 19-48 / 0.75s - 2.00s)

```
FRAMES 19-30 (0.75s - 1.25s):
  Visual: Red Nose P5 (The Close) fades in from the darkness.
          Opacity ramp: 0% at frame 19 to 80% at frame 30.
          Only one eye, ear, scar, and bowtie edge visible.
          Extreme close-up. Shallow DOF. The amber eye catches
          the rust-orange light — a single bright catchlight.
          Film grain at 20%.
          Vignette: 40% edge darkening, heavier at corners.
  Audio: Piano note sustaining and decaying. Sub-bass sustains
         at -28dB. Silence otherwise.

FRAMES 31-36 (1.25s - 1.50s):
  Visual: Red Nose at full opacity (100%).
          SUBTLE HEAD TURN begins — the eye shifts slightly
          toward camera. Not a full turn. A micro-movement.
          1-2 degree rotation. The catchlight in the eye moves.
          This is the moment: Red Nose acknowledges you.
          Film grain steady at 20%.
  Audio: A second low note hits (E2, -24dB). Creates a minor
         interval with the decaying C2. Tension. Weight.

FRAMES 37-42 (1.50s - 1.75s):
  Visual: Head turn completes. Red Nose is looking at you.
          Hold. Let the image breathe. The amber eye fills 15%
          of the frame. The bowtie edge is a rust-orange shape
          in the lower portion. The scar is visible in the light.
  Audio: Both piano notes decaying. Sub-bass fading to -34dB.
         Near silence.

FRAMES 43-48 (1.75s - 2.00s):
  Visual: QUICK FADE — Red Nose image fades to black over
          6 frames (0.25s). Not slow. Deliberate. He was there.
          Now he is gone.
  Audio: Silence for 0.15s. Then—
```

#### Phase 3: Wordmark Slam (Frames 49-72 / 2.00s - 3.00s)

```
FRAMES 49-51 (2.00s - 2.125s):
  Visual: Dark Steel (#1E1E20) background. Empty. 3 frames of
          nothing after the fade.
  Audio: Dead silence. The gap before impact.

FRAME 52 (2.125s):
  Visual: WORDMARK SLAM — "BOWTIE BULLIES" appears INSTANTLY.
          No fade. No animation. Frame 51 = empty. Frame 52 = text.
          Font: Anton (or Condensed Sans), UPPERCASE
          Size: 120px equivalent (fills 50% of frame width)
          Color: Bone White (#E7E7E1)
          Position: Center frame, slightly above vertical center
          Letter-spacing: +4%
          A very subtle screen shake effect (2px random offset
          for frames 52-54, then settles).
  Audio: BASS HIT — Deep sub-bass impact (40Hz + 80Hz, -8dB,
         extremely short attack <10ms). Followed immediately by
         a short reverb tail (0.8s decay, dark plate reverb).
         This is THE sound of the brand.

FRAMES 53-56 (2.125s - 2.33s):
  Visual: Wordmark holds. Screen shake settles by frame 54.
          Film grain 20%. Very faint horizontal scan line
          artifact (like old CRT) passes over the text once,
          top to bottom, 4 frames.
  Audio: Bass hit reverb tail decaying. Sub-bass rumble returns
         at -36dB.

FRAMES 57-66 (2.33s - 2.75s):
  Visual: Subtitle fades in below the wordmark over 6 frames.
          Text: "THE AFTERMATH"
          Font: Space Mono (monospaced), lowercase
          Size: 28px equivalent
          Color: Rust Orange (#9A4C22)
          Position: Centered below main wordmark, 20px gap
          Letter-spacing: +8% (breathing room, like a field report)
          Opacity ramp: 0% at frame 57 to 100% at frame 63.
          Hold from frame 63 to 66.
  Audio: Sub-bass at -36dB. Faint high-frequency shimmer
         (-32dB, metallic, like a distant alarm fading).

FRAMES 67-72 (2.75s - 3.00s):
  Visual: Both text elements hold. Full composition:
          - Dark Steel background
          - "BOWTIE BULLIES" in Bone White, centered, large
          - "THE AFTERMATH" in Rust Orange below, small, mono
          - Film grain 20%
          - Heavy vignette
          - Scan line artifact done — clean hold
  Audio: Everything fading. Near silence by frame 72.
```

#### Phase 4: Hold and Exit (Frames 73-84 / 3.00s - 3.50s)

```
FRAMES 73-78 (3.00s - 3.25s):
  Visual: Full composition holds. Breathing room.
          The viewer reads. The brand imprints.
  Audio: Silence except sub-bass at -40dB (felt, not heard).

FRAMES 79-84 (3.25s - 3.50s):
  Visual: Entire composition fades to Dark Steel over 6 frames.
          Not to black — to Dark Steel (#1E1E20). The video
          content begins on the next frame from this base color.
  Audio: Sub-bass fades to silence. Content audio (VO, music)
         begins at frame 85.
```

### Intro Text Specifications

```
MAIN WORDMARK:
  Text: "BOWTIE BULLIES"
  Font: Anton (Google Fonts) or Impact/Knockout fallback
  Weight: 700 (Bold)
  Size: 120px at 1920x1080 (scales proportionally)
  Color: #E7E7E1 (Bone White)
  Letter-spacing: +4%
  Text-transform: UPPERCASE
  Text-shadow: 4px 4px 20px rgba(0,0,0,0.9)
  Position: center-x, 42% from top (slightly above center)

SUBTITLE:
  Text: "THE AFTERMATH"
  Font: Space Mono (Google Fonts) or IBM Plex Mono fallback
  Weight: 400 (Regular)
  Size: 28px at 1920x1080
  Color: #9A4C22 (Rust Orange)
  Letter-spacing: +8%
  Text-transform: lowercase
  Position: center-x, 56% from top (below wordmark, 20px gap)
```

### Intro Audio Stinger Specification

```
STINGER ARCHITECTURE:
  Total duration: 3.5 seconds
  Sample rate: 48000Hz
  Bit depth: 24-bit
  Format: WAV (master), MP3 128kbps (delivery)

LAYERS:
  1. Sub-bass rumble
     - Frequency: 30-40Hz sine wave
     - Envelope: Fade in 0.0-0.75s, sustain 0.75-2.0s, fade 2.0-3.5s
     - Level: -40dB to -26dB to -40dB
     - Purpose: Creates physical weight, felt in speakers/headphones

  2. Piano notes
     - Note 1: C2 at 0.50s, velocity 60, decay 4.0s
     - Note 2: E2 at 1.25s, velocity 55, decay 3.0s
     - Reverb: Dark plate, 2.0s decay, 30% wet
     - EQ: Roll off above 2kHz (keep it dark)
     - Purpose: The minor third interval creates unresolved tension

  3. Bass impact hit
     - Trigger: 2.125s (frame 52, wordmark slam)
     - Frequency: 40Hz fundamental + 80Hz harmonic
     - Attack: <10ms
     - Decay: 0.3s
     - Reverb: Dark plate, 0.8s decay, 40% wet
     - Level: -8dB (loudest element in the stinger)
     - Purpose: The "slam" — anchors the brand name in the body

  4. Metallic scrape (texture)
     - Trigger: 0.25s
     - Duration: 0.5s
     - Source: Metal-on-concrete foley or synthesized
     - Level: -28dB
     - EQ: Bandpass 200Hz-1.5kHz
     - Purpose: Urban texture, establishing environment

  5. High shimmer
     - Trigger: 2.33s
     - Duration: 0.5s
     - Source: Metallic harmonic or filtered noise sweep
     - Level: -32dB
     - Purpose: Subconscious tension, surveillance aesthetic

MASTER:
  Normalization: -14 LUFS
  Limiter: -1dB true peak
  No compression on the bass hit (preserve transient)
```

### Intro Generation Notes

The Red Nose P5 image should be pre-generated using the P5 prompt from `brand-blueprint.md` or the P5-V prompt from `pose-variants.md` (for 9:16 variant). The head turn can be achieved via:

1. **Static approach:** Generate two P5 images with slightly different eye direction. Cross-dissolve between them over frames 31-36.
2. **Video approach:** Use Kie.AI/Veo to generate a 2-second video clip of Red Nose P5 with subtle head turn. Extract frames 19-48.
3. **Post-production:** Apply a subtle 2D transform (1-2 degree rotation + slight scale) to a single P5 image over frames 31-36.

---

## INTRO VARIANT: 9:16 SHORTS/REELS

### Shortened Intro (1.5 seconds / 45 frames at 30fps)

For Shorts and Reels, the intro is compressed. Viewers drop off in the first 2 seconds — the intro cannot delay the hook.

```
FRAMES 1-6 (0.00s - 0.20s):
  Visual: Dark Steel background. Film grain begins.
  Audio: Single sub-bass pulse (-20dB, 0.2s).

FRAMES 7-18 (0.20s - 0.60s):
  Visual: Red Nose P5-V (vertical close-up) fades in.
          Opacity: 0% to 100% over 12 frames.
          Upper 40% of vertical frame. One eye. Bowtie edge.
  Audio: Single piano note C2 (-24dB, short decay 1.5s).

FRAMES 19-24 (0.60s - 0.80s):
  Visual: Hold Red Nose. Micro head turn (2 frames).
  Audio: Piano decaying.

FRAMES 25-30 (0.80s - 1.00s):
  Visual: Quick fade to Dark Steel (6 frames).
  Audio: Silence.

FRAMES 31-36 (1.00s - 1.20s):
  Visual: "BOWTIE BULLIES" wordmark slam (instant appear).
          Smaller than long-form (80px). Centered.
          "THE AFTERMATH" appears simultaneously below.
  Audio: Bass hit (-10dB, short, tight reverb 0.4s).

FRAMES 37-45 (1.20s - 1.50s):
  Visual: Hold 6 frames. Then fade to content over 3 frames.
  Audio: Silence. Content audio begins.
```

**For maximum retention:** Some Shorts may skip the intro entirely and use a text-only watermark in the first 0.5 seconds. The full intro is reserved for series-establishing Shorts and Reels.

---

## OUTRO SEQUENCE

### Overview

| Property | Value |
|----------|-------|
| Duration | 7.0 seconds (168 frames at 24fps) |
| Resolution | 1920x1080 (16:9) long-form / 1080x1920 (9:16) shorts variant |
| Frame Rate | 24fps (long-form) / 30fps (shorts) |
| Color Grade | Brand standard |
| Audio | Outro stinger (spec below) |

### Frame-by-Frame Breakdown (24fps)

#### Phase 1: Content Fade (Frames 1-36 / 0.00s - 1.50s)

```
FRAMES 1-12 (0.00s - 0.50s):
  Visual: Last frame of content is visible.
          Tyrone's final words have landed.
          Intentional silence in the content.
  Audio: Content audio ending. Music at -32dB fading
         to -40dB. VO has stopped. Silence breathing.

FRAMES 13-36 (0.50s - 1.50s):
  Visual: SLOW FADE TO BLACK over 24 frames (1.0 second).
          Not Dark Steel — actual black (#000000).
          The deepest dark in the entire video.
          Film grain continues through the fade (visible
          against the darkness as subtle texture).
  Audio: Complete silence from frame 24 onward.
         1.0 second of true black silence.
         This is the weight of what was said.
```

#### Phase 2: Silhouette Rise (Frames 37-72 / 1.50s - 3.00s)

```
FRAMES 37-48 (1.50s - 2.00s):
  Visual: From black, a faint rust-orange glow begins in the
          lower third. Like a distant city seen from a rooftop.
          The glow is soft, diffused, barely perceptible at first.
          Opacity: 0% at frame 37 to 40% at frame 48.
  Audio: Sub-bass drone begins (35Hz, -38dB, slow fade in).
         A faint city ambience layer starts (-36dB): distant
         traffic, a far-off siren echo, wind.

FRAMES 49-60 (2.00s - 2.50s):
  Visual: Red Nose P4 SILHOUETTE fades in from the darkness.
          He is sitting at the edge of a rooftop, back to camera.
          Pure silhouette — no detail, just the shape. The bowtie
          silhouette at his collar is the key recognizable element.
          City lights below him provide the glow.
          Opacity: 0% at frame 49 to 100% at frame 60.
          The silhouette is positioned in the upper 40% of frame.
          City lights fill the lower 40%.
          Middle 20% is the rooftop edge — the dividing line.
  Audio: Sub-bass at -32dB. Ambient city at -30dB.
         A single sustained string note (cello, A2, -26dB)
         begins with slow attack. Melancholy but not sad.
         Dignified.

FRAMES 61-72 (2.50s - 3.00s):
  Visual: Full silhouette composition holds. Red Nose is still.
          The city lights below have subtle animated shimmer
          (1-2% brightness variation, random, like real city
          lights at night). Film grain 20%.
  Audio: Cello sustaining. Sub-bass steady. Ambient at -32dB.
```

#### Phase 3: Typewriter Wordmark (Frames 73-108 / 3.00s - 4.50s)

```
FRAMES 73-96 (3.00s - 4.00s):
  Visual: Below the silhouette, in the lower third:
          "BOWTIE BULLIES" types on character by character.
          TYPEWRITER EFFECT — each character appears one at a time.
          Rate: 2 frames per character (12 characters + space = 28 frames)
          Font: Anton, UPPERCASE
          Size: 72px
          Color: Bone White (#E7E7E1)
          Position: Center-x, 72% from top
          A faint cursor blink after each character (1 frame on, 1 off)
          Text-shadow: 4px 4px 16px rgba(0,0,0,0.9)

          Typing sequence:
          Frame 73: B
          Frame 75: O
          Frame 77: W
          Frame 79: T
          Frame 81: I
          Frame 83: E
          Frame 85: (space)
          Frame 87: B
          Frame 89: U
          Frame 91: L
          Frame 93: L
          Frame 95: I
          Frame 97: E (cursor holds 2 frames)
          Frame 99: S
  Audio: Each character gets a faint typewriter key sound
         (-28dB, dry, mechanical). Not loud — texture.
         Cello sustaining underneath. Sub-bass holding.

FRAMES 97-108 (4.00s - 4.50s):
  Visual: "THE AFTERMATH" appears below — but NOT typewriter.
          Fade in over 6 frames (97-103), then hold.
          Font: Space Mono, lowercase
          Size: 24px
          Color: Rust Orange (#9A4C22)
          Letter-spacing: +8%
          Position: Center-x, 78% from top

          Full text composition holds from frame 103-108.
          Red Nose silhouette above. Wordmark below.
          City lights glowing in the background.
  Audio: Typewriter sounds end. Cello begins to fade.
         Sub-bass sustaining at -34dB.
```

#### Phase 4: Subscribe Element (Frames 109-144 / 4.50s - 6.00s)

```
FRAMES 109-120 (4.50s - 5.00s):
  Visual: Subscribe button element fades in below the wordmark.
          Design: Rounded rectangle outline (2px border)
          Border color: Rust Orange (#9A4C22)
          Fill: Dark Steel (#1E1E20) at 80% opacity
          Text inside: "SUBSCRIBE" in Space Mono, 18px, Bone White
          Size: 180px wide x 40px tall
          Position: Center-x, 85% from top
          Opacity: 0% at frame 109 to 100% at frame 120.

          Simultaneously, a subtle pulse animation begins on the
          subscribe button — border opacity oscillates between
          100% and 60% on a 1.5-second cycle.
  Audio: Sub-bass fading. Ambient city fading.

FRAMES 121-144 (5.00s - 6.00s):
  Visual: Full end card composition holds:
          - Red Nose P4 silhouette (upper 40%)
          - City lights below silhouette
          - "BOWTIE BULLIES" in Bone White (72%)
          - "THE AFTERMATH" in Rust Orange (78%)
          - Subscribe button pulsing (85%)
          - Film grain 20%
          - Heavy vignette

          YouTube end screen overlay zones are clear:
          - LEFT zone (for "next video" card): 15-48% x, 25-65% y
          - RIGHT zone (for "subscribe" card): 52-85% x, 25-65% y
          The silhouette and text are designed to NOT conflict
          with these zones.
  Audio: Near silence. Faintest sub-bass hum (-42dB).
```

#### Phase 5: Final Fade (Frames 145-168 / 6.00s - 7.00s)

```
FRAMES 145-156 (6.00s - 6.50s):
  Visual: Hold composition. YouTube end screen elements (cards)
          are active during this window.
  Audio: Silence.

FRAMES 157-168 (6.50s - 7.00s):
  Visual: Everything fades to pure black (#000000) over 12 frames.
          The last thing visible is the rust-orange glow of the
          city lights, which fades last.
  Audio: Silence. End.
```

### Outro Text Specifications

```
MAIN WORDMARK (TYPEWRITER):
  Text: "BOWTIE BULLIES"
  Font: Anton
  Weight: 700
  Size: 72px at 1920x1080
  Color: #E7E7E1
  Letter-spacing: +4%
  Text-transform: UPPERCASE
  Text-shadow: 4px 4px 16px rgba(0,0,0,0.9)
  Position: center-x, 72% from top
  Animation: Typewriter (2 frames per character)

SUBTITLE:
  Text: "THE AFTERMATH"
  Font: Space Mono
  Weight: 400
  Size: 24px at 1920x1080
  Color: #9A4C22
  Letter-spacing: +8%
  Text-transform: lowercase
  Position: center-x, 78% from top
  Animation: Fade in 0.25s after typewriter completes

SUBSCRIBE BUTTON:
  Text: "SUBSCRIBE"
  Font: Space Mono
  Weight: 400
  Size: 18px
  Color: #E7E7E1
  Border: 2px solid #9A4C22, border-radius 6px
  Fill: #1E1E20 at 80% opacity
  Size: 180x40px
  Position: center-x, 85% from top
  Animation: Fade in 0.5s, then border pulse (1.5s cycle)
```

### Outro Audio Stinger Specification

```
STINGER ARCHITECTURE:
  Total duration: 7.0 seconds
  Sample rate: 48000Hz
  Bit depth: 24-bit
  Format: WAV (master), MP3 128kbps (delivery)

LAYERS:
  1. Sub-bass drone
     - Frequency: 35Hz sine wave
     - Envelope: Fade in 1.5-2.0s, sustain 2.0-5.5s, fade 5.5-7.0s
     - Level: -38dB to -32dB to -42dB
     - Purpose: Weight. Gravity. The world is still turning.

  2. City ambience
     - Source: Field recording or high-quality sample pack
     - Content: Distant traffic, far-off siren (single, fading),
       wind through urban canyon, faint horn honk
     - Level: -36dB to -30dB to -36dB
     - Duration: 1.5s to 6.0s
     - EQ: Bandpass 100Hz-3kHz, gentle rolloff both ends
     - Purpose: Place you back in the city. The world Red Nose
       is watching over.

  3. Cello sustained note
     - Note: A2, slow attack (0.3s), sustain 3.0s, slow release
     - Trigger: 2.0s
     - Level: -26dB
     - Reverb: Hall, 3.0s decay, 25% wet
     - EQ: Gentle presence boost at 2-3kHz
     - Purpose: Emotional anchor. Melancholy dignity.

  4. Typewriter key sounds
     - Trigger: 3.0s to 4.0s (each character)
     - Source: Mechanical typewriter key strike (foley or sample)
     - Level: -28dB per strike
     - Variation: Slight random pitch shift per key (+/- 3%)
     - Reverb: Tight room, 0.3s decay, 20% wet
     - Purpose: Establishes the "field report" aesthetic.
       Data being recorded. Someone is keeping track.

MASTER:
  Normalization: -14 LUFS
  Limiter: -1dB true peak
  Overall character: Sparse. Empty. The stinger should feel
  like standing on a rooftop at 3 AM.
```

### YouTube End Screen Placement

```
┌──────────────────────────────────────────────┐
│                                              │
│    [Red Nose P4 Silhouette — Top 35%]        │
│                                              │
│  ┌─────────────┐     ┌─────────────┐         │
│  │             │     │             │         │
│  │  NEXT VIDEO │     │  SUBSCRIBE  │         │
│  │   (card)    │     │   (card)    │         │
│  │             │     │             │         │
│  └─────────────┘     └─────────────┘         │
│                                              │
│          BOWTIE BULLIES                      │
│          the aftermath                       │
│          [SUBSCRIBE]                         │
│                                              │
└──────────────────────────────────────────────┘

End screen card zones (YouTube standard):
  Left card:  15-48% x, 25-65% y (300x220px area)
  Right card: 52-85% x, 25-65% y (300x220px area)

Duration: End screen active for last 5-20 seconds of video.
Our outro is 7 seconds — end screen should activate at the
start of Phase 2 (1.5s mark) for ~5.5 seconds of visibility.
```

---

## OUTRO VARIANT: 9:16 SHORTS/REELS

### Shortened Outro (3.0 seconds / 90 frames at 30fps)

```
FRAMES 1-15 (0.00s - 0.50s):
  Visual: Content fades to black over 15 frames.
  Audio: Content audio ending.

FRAMES 16-30 (0.50s - 1.00s):
  Visual: Black holds. Then Red Nose P4-V silhouette fades in.
          Vertical composition — silhouette in upper 30%.
          City lights below.
  Audio: Sub-bass pulse (-24dB, single hit). Cello note A2 (-28dB).

FRAMES 31-54 (1.00s - 1.80s):
  Visual: "BOWTIE BULLIES" typewriter effect below silhouette.
          Faster rate: 1 frame per character.
          Font: Anton, 64px, Bone White.
          "THE AFTERMATH" fades in below (Rust Orange, Space Mono, 20px).
  Audio: Faint typewriter sounds (-30dB). Cello sustaining.

FRAMES 55-72 (1.80s - 2.40s):
  Visual: Follow button element fades in:
          "@BowTieBullies" in Space Mono, 20px, Bone White
          Below that: "FOLLOW" in outline button (Rust Orange border)
          Position: Center-x, 75% from top
          Avoid bottom 14% safe zone.
  Audio: Sub-bass fading.

FRAMES 73-90 (2.40s - 3.00s):
  Visual: Hold full composition. Then fade to black over last
          6 frames.
  Audio: Silence.
```

### Social Handle Placement (9:16)

```
┌─────────────────────────┐
│                         │ ← 10% top safe zone
│  [Red Nose Silhouette]  │
│                         │
│     City lights below   │
│                         │
│    BOWTIE BULLIES       │
│    the aftermath        │
│                         │
│    @BowTieBullies       │
│    [ FOLLOW ]           │
│                         │
│                         │ ← 14% bottom safe zone
└─────────────────────────┘

Social handles centered at 72% from top.
Follow button centered at 78% from top.
All elements inside safe zones.
```

---

## IMPLEMENTATION: FFMPEG COMMAND TEMPLATES

### Intro Assembly (Simplified)

```bash
# Requires: intro_bg.png (Dark Steel), rednose_p5.png, stinger_intro.wav
# Fonts: Anton-Regular.ttf, SpaceMono-Regular.ttf

ffmpeg -y \
  -f lavfi -i "color=c=0x1E1E20:s=1920x1080:d=3.5:r=24" \
  -i rednose_p5.png \
  -i stinger_intro.wav \
  -filter_complex "
    [1:v]scale=1920:1080,format=rgba[dog];
    [0:v][dog]overlay=0:0:enable='between(t,0.75,2.0)':
      format=auto:alpha=if(between(t\,0.75\,1.25)\,
      (t-0.75)*2\,if(between(t\,1.75\,2.0)\,1-(t-1.75)*4\,1))[base];
    [base]drawtext=fontfile=Anton-Regular.ttf:
      text='BOWTIE BULLIES':fontcolor=0xE7E7E1:fontsize=120:
      x=(w-text_w)/2:y=h*0.42-text_h/2:
      enable='gte(t,2.125)':
      shadowcolor=0x000000@0.9:shadowx=4:shadowy=4,
    drawtext=fontfile=SpaceMono-Regular.ttf:
      text='the aftermath':fontcolor=0x9A4C22:fontsize=28:
      x=(w-text_w)/2:y=h*0.56-text_h/2:
      enable='gte(t,2.33)':
      alpha='if(between(t,2.33,2.58),(t-2.33)*4,1)',
    noise=alls=20:allf=t+u,
    vignette=PI/4:1.2[outv]
  " \
  -map "[outv]" -map 2:a \
  -c:v libx264 -preset medium -crf 18 \
  -c:a aac -b:a 128k \
  -r 24 -pix_fmt yuv420p \
  -t 3.5 \
  intro.mp4
```

### Outro Assembly (Simplified)

```bash
# Requires: silhouette_p4.png, city_lights_bg.png, stinger_outro.wav
# Fonts: Anton-Regular.ttf, SpaceMono-Regular.ttf

ffmpeg -y \
  -f lavfi -i "color=c=0x000000:s=1920x1080:d=7.0:r=24" \
  -i silhouette_p4.png \
  -i city_lights_bg.png \
  -i stinger_outro.wav \
  -filter_complex "
    [2:v]scale=1920:1080[city];
    [1:v]scale=1920:1080,format=rgba[sil];
    [0:v][city]overlay=0:0:enable='between(t,1.5,6.5)':
      alpha='if(between(t,1.5,2.0),(t-1.5)*2,
        if(between(t,6.5,7.0),1-(t-6.5)*2,1))'[bg_city];
    [bg_city][sil]overlay=0:0:enable='between(t,2.0,6.5)':
      alpha='if(between(t,2.0,2.5),(t-2.0)*2,
        if(between(t,6.5,7.0),1-(t-6.5)*2,1))'[composed];
    [composed]drawtext=fontfile=Anton-Regular.ttf:
      text='BOWTIE BULLIES':fontcolor=0xE7E7E1:fontsize=72:
      x=(w-text_w)/2:y=h*0.72-text_h/2:
      enable='gte(t,3.0)':
      shadowcolor=0x000000@0.9:shadowx=4:shadowy=4,
    drawtext=fontfile=SpaceMono-Regular.ttf:
      text='the aftermath':fontcolor=0x9A4C22:fontsize=24:
      x=(w-text_w)/2:y=h*0.78-text_h/2:
      enable='gte(t,4.0)':
      alpha='if(between(t,4.0,4.25),(t-4.0)*4,1)',
    noise=alls=20:allf=t+u,
    vignette=PI/4:1.2[outv]
  " \
  -map "[outv]" -map 3:a \
  -c:v libx264 -preset medium -crf 18 \
  -c:a aac -b:a 128k \
  -r 24 -pix_fmt yuv420p \
  -t 7.0 \
  outro.mp4
```

---

## ASSET REQUIREMENTS CHECKLIST

### Pre-Production Assets Needed

- [ ] **Red Nose P5 image** — Generated via Gemini Imagen or Midjourney (see `brand-blueprint.md` P5 prompt)
- [ ] **Red Nose P5-V image** — Vertical variant (see `pose-variants.md` P5-V prompt)
- [ ] **Red Nose P4 silhouette image** — Generated via Midjourney (see `brand-blueprint.md` P4 prompt)
- [ ] **Red Nose P4-V silhouette image** — Vertical variant (see `pose-variants.md` P4-V prompt)
- [ ] **City lights background** — Generated or sourced (see B-roll library BR-21 or similar)
- [ ] **Anton font file** — Download from Google Fonts (Anton-Regular.ttf)
- [ ] **Space Mono font file** — Download from Google Fonts (SpaceMono-Regular.ttf)
- [ ] **Intro audio stinger** — Produced per spec above (Udio, Suno, or custom DAW)
- [ ] **Outro audio stinger** — Produced per spec above
- [ ] **Typewriter key sound sample** — Foley or sample pack (single clean strike)

### File Organization

```
cinema_knowledge/bowtie-bullies/
├── intro/
│   ├── intro-16x9.mp4        (assembled intro, landscape)
│   ├── intro-9x16.mp4        (assembled intro, vertical)
│   ├── stinger-intro.wav      (audio master)
│   ├── rednose-p5-intro.png   (source image)
│   └── rednose-p5v-intro.png  (source image, vertical)
├── outro/
│   ├── outro-16x9.mp4        (assembled outro, landscape)
│   ├── outro-9x16.mp4        (assembled outro, vertical)
│   ├── stinger-outro.wav      (audio master)
│   ├── rednose-p4-silhouette.png
│   ├── rednose-p4v-silhouette.png
│   └── city-lights-bg.png
└── fonts/
    ├── Anton-Regular.ttf
    └── SpaceMono-Regular.ttf
```

---

*"The intro is the first promise. The outro is the last word. Both must be earned."*
