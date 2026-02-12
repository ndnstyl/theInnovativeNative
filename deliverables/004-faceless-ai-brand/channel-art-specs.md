# BOWTIE BULLIES — THE AFTERMATH | Channel Art Specifications

## Export Specs for All Platform Assets

### Reference Document — Addresses Gap 1.2.5

---

## ASSET 1: YOUTUBE BANNER

### Dimensions & Technical Specs

| Property | Value |
|----------|-------|
| Canvas size | 2560 x 1440 px |
| Safe zone (all devices) | 1546 x 423 px (centered) |
| Safe zone (desktop) | 2560 x 423 px (centered) |
| Safe zone (tablet) | 1855 x 423 px (centered) |
| DPI | 72 (web display) |
| File format | PNG |
| Max file size | 6 MB |
| Color space | sRGB |

### Safe Zone Diagram

```
┌──────────────────────────────────────────────────────────┐
│  TV DISPLAY AREA (2560 x 1440)                           │
│                                                          │
│    ┌──────────────────────────────────────────────┐      │
│    │  TABLET SAFE (1855 x 423)                    │      │
│    │                                              │      │
│    │    ┌──────────────────────────────────┐      │      │
│    │    │  ALL DEVICES SAFE (1546 x 423)   │      │      │
│    │    │                                  │      │      │
│    │    │  *** ALL CRITICAL TEXT AND ***    │      │      │
│    │    │  *** LOGO ELEMENTS GO HERE ***   │      │      │
│    │    │                                  │      │      │
│    │    └──────────────────────────────────┘      │      │
│    │                                              │      │
│    └──────────────────────────────────────────────┘      │
│                                                          │
└──────────────────────────────────────────────────────────┘

Pixel coordinates for safe zones (from top-left origin):
  All devices: x=507, y=508, w=1546, h=423
  Tablet:      x=352, y=508, w=1855, h=423
  Desktop:     x=0,   y=508, w=2560, h=423
  TV:          x=0,   y=0,   w=2560, h=1440
```

### Brand Elements

```
COMPOSITION:
  Background: Full 2560x1440 canvas — Dark Steel (#1E1E20) base with
  a generated urban skyline environment extending to edges. The
  environment fills the TV-visible area. Dark, moody, desaturated.

  Center (all-device safe zone):
    Left side: Red Nose P4 silhouette (sitting at rooftop edge)
               Position: Left-center of safe zone
               Scale: Silhouette fills ~70% of safe zone height
               The bowtie silhouette is clearly readable

    Right side: "BOWTIE BULLIES" wordmark
                Font: Anton, UPPERCASE, Bone White (#E7E7E1)
                Size: 80-96px
                Below: "THE AFTERMATH" in Space Mono, lowercase
                Size: 24-28px, Rust Orange (#9A4C22)
                Letter-spacing: +6%

  Extended canvas (tablet/desktop/TV):
    City lights below the rooftop line, extending left and right.
    Heavy vignette at all edges.
    Film grain 15%.

  DO NOT place any text or critical elements outside the
  1546x423 all-device safe zone.
```

### AI Generation Prompt (Banner Background)

```
Wide panoramic urban skyline at night viewed from a rooftop. City lights
below creating a warm rust-orange glow against dark steel sky. Fog and
atmospheric haze between buildings. Industrial rooftop in foreground with
gravel and tar surface. Water towers and antennas visible. Desaturated
earth tones. High contrast. Film grain. Cinematic. No humans. No text.
Photorealistic. Extremely wide aspect ratio (16:7 approximately).
Dark steel (#1E1E20) dominates the upper half. Rust-orange city glow
in the lower half. Heavy vignette at all edges. Roger Deakins lighting.
2560x1440 pixels.
```

**Negative prompt:** human face, cartoon, anime, bright colors, neon, saturated, cheerful, suburban, clean corporate, stock photo, illustration, 3D render, watermark, text, logo, signature, blurry, low quality

**Post-processing:** Composite P4 silhouette and wordmark in image editor or FFMPEG after background generation.

---

## ASSET 2: YOUTUBE PROFILE PICTURE

### Dimensions & Technical Specs

| Property | Value |
|----------|-------|
| Canvas size | 800 x 800 px |
| Display size | 98 x 98 px (typical) |
| Visible area | Circular crop (800px diameter) |
| DPI | 72 (web display) |
| File format | PNG (or JPG) |
| Max file size | 4 MB |
| Color space | sRGB |

### Safe Zone Diagram

```
┌────────────────────┐
│                    │
│    ┌──────────┐    │
│   /            \   │
│  │              │  │
│  │   CIRCULAR   │  │  ← YouTube crops to circle
│  │   VISIBLE    │  │
│  │    AREA      │  │
│  │              │  │
│   \            /   │
│    └──────────┘    │
│                    │
└────────────────────┘

Critical content must be within the center 600x600px
(75% of canvas) to avoid circular crop cutting elements.
The bowtie MUST be visible within the circle.
```

### Brand Elements

```
COMPOSITION:
  Background: Dark Steel (#1E1E20), solid
  Subject: Red Nose P5 (The Close) — extreme close-up
           One eye, ear, scar, and bowtie edge visible
           Positioned so the eye is in the upper-center of
           the circular crop and the bowtie edge is visible
           in the lower portion
  Lighting: Single rust-orange light from the right
            Catchlight in the eye
  Vignette: 30% edge darkening (helps with circular crop)
  Film grain: 15% (subtle at small display size)

  The profile picture at small sizes should read as:
  - An amber eye
  - A rust-orange accent (the bowtie)
  - Dark background
  - Instantly recognizable in the YouTube sidebar
```

### AI Generation Prompt

```
Extreme close-up of American Red Nose Pitbull face. Adult male,
muscular, rich reddish-brown copper coat, distinctive red/liver nose,
amber/honey eyes, natural uncropped rose ears, small healed scar across
left brow. Wearing a slightly weathered rust-orange canvas butterfly
bowtie, edge visible at bottom of frame. Only one eye, ear, and scar
visible. Shallow depth of field f/1.4. Dark steel (#1E1E20) background.
Rust-orange light catches the eye and bowtie. Film grain 15%. Dramatic.
Intimate. Square composition 1:1. Photorealistic. No text.
```

**Negative prompt:** Blue nose, black nose, gray coat, brindle, white coat, cropped ears, aggressive snarling, teeth showing, cartoonish, anime, cute puppy, playful, tongue out, bright colors, clean/new bowtie, silk bowtie, suburban setting, grass yard, dog park, stock photo, cheerful, multiple dogs, human face, neon, saturated, 3D render, watermark, text, logo

---

## ASSET 3: YOUTUBE WATERMARK

### Dimensions & Technical Specs

| Property | Value |
|----------|-------|
| Canvas size | 150 x 150 px |
| Display size | ~50 x 50 px (bottom-right of video) |
| Background | Transparent (PNG with alpha) |
| DPI | 72 |
| File format | PNG (with transparency) |
| Max file size | 1 MB |
| Color space | sRGB |

### Design

```
COMPOSITION:
  Background: Fully transparent

  Element: Simplified bowtie icon only
           The rust-orange (#9A4C22) butterfly bowtie shape
           Rendered as a clean vector-style icon
           No dog, no text — just the bowtie
           Fill: Rust Orange (#9A4C22) at 80% opacity
           Outline: None
           The bowtie shape should be recognizable at 50px

  WHY just the bowtie:
  At 50px display size, a full dog image becomes unreadable.
  The bowtie is the single most distinctive brand element.
  It reads at any size. Viewers learn: bowtie = BowTie Bullies.

  Alternative: If the bowtie alone is too abstract, use:
  Red Nose silhouette (head + bowtie only, no body) in
  Bone White (#E7E7E1) at 70% opacity on transparent background.
```

### Generation/Creation

This asset should be created manually in a vector editor (Figma, Illustrator, Canva) rather than AI-generated, due to the small size and need for clean edges.

```
CREATION STEPS:
1. Draw butterfly bowtie shape (two triangles meeting at center)
2. Fill: #9A4C22 at 80% opacity
3. Export: 150x150 PNG with transparent background
4. Test: View at 50x50 — must still read as a bowtie
5. Upload to YouTube Studio > Customization > Branding > Video watermark
```

---

## ASSET 4: INSTAGRAM PROFILE PICTURE

### Dimensions & Technical Specs

| Property | Value |
|----------|-------|
| Canvas size | 1080 x 1080 px |
| Display size | 110 x 110 px (profile), 40 x 40 px (comments) |
| Visible area | Circular crop |
| DPI | 72 |
| File format | JPG or PNG |
| Max file size | 5 MB |
| Color space | sRGB |

### Safe Zone Diagram

```
┌────────────────────┐
│                    │
│    ┌──────────┐    │
│   /            \   │
│  │  CIRCULAR   │  │  ← IG crops to circle
│  │  VISIBLE    │  │
│  │             │  │
│   \            /   │
│    └──────────┘    │
│                    │
└────────────────────┘

Keep critical content within center 810x810px (75%).
At 40px display size in comments, only the strongest
shape/color contrast will read. The amber eye and
rust-orange bowtie must be visible even at this scale.
```

### Brand Elements

```
COMPOSITION:
  Same as YouTube Profile Picture but exported at 1080x1080.
  Red Nose P5 close-up. One eye, scar, bowtie edge.
  Dark Steel background. Rust-orange accent light.

  IMPORTANT: Test the image at 40x40 pixels before finalizing.
  If the eye and bowtie do not read at that size, increase
  contrast or zoom in further on the eye.
```

### AI Generation Prompt

Same as YouTube Profile Picture prompt but with output size adjusted:

```
[Same as YouTube Profile Picture prompt above]
Square composition 1:1. Output resolution 1080x1080.
```

---

## ASSET 5: INSTAGRAM HIGHLIGHT COVERS

### Dimensions & Technical Specs

| Property | Value |
|----------|-------|
| Canvas size | 1080 x 1920 px (9:16, full story size) |
| Visible area (cover) | Circular crop, ~600px diameter centered |
| DPI | 72 |
| File format | JPG or PNG |
| Max file size | 5 MB |
| Color space | sRGB |

### Safe Zone Diagram

```
┌─────────────────────────┐
│                         │
│                         │
│                         │
│       ┌─────────┐       │
│      /           \      │
│     │  VISIBLE    │     │  ← Circular crop ~600px diameter
│     │  AS COVER   │     │     centered on canvas
│      \           /      │
│       └─────────┘       │
│                         │
│                         │
│                         │
└─────────────────────────┘

Design the center 600x600px area of the 1080x1920 canvas.
Everything outside this area is cropped in the highlight cover view
but visible if a user opens the highlight story itself.
```

### Highlight Categories & Designs

Each highlight cover follows the same visual template but with a different icon/symbol.

```
TEMPLATE:
  Background: Dark Steel (#1E1E20), solid
  Center icon: Simple line-art or silhouette icon
  Icon color: Rust Orange (#9A4C22)
  Icon size: ~200px within the 600px visible circle
  Below icon: Category name in Space Mono, 20px, Bone White (#E7E7E1)
  Film grain: 10% (subtle)
  Vignette: Light, 15%

HIGHLIGHT COVERS TO CREATE:

1. "THE SYSTEM"
   Icon: Surveillance camera silhouette
   For: AI & The System content clips

2. "THE FUTURE"
   Icon: Simple neural network node pattern (3 nodes, 2 connections)
   For: AGI/ASI philosophical content

3. "THE GEAR"
   Icon: Simple wrench or tool silhouette
   For: Product/affiliate content

4. "THE MARATHON"
   Icon: Red Nose bowtie shape (brand icon)
   For: Channel updates, behind-the-scenes

5. "THE TAKES"
   Icon: Speech bubble outline
   For: Hot takes, news reactions, audience responses

6. "THE RAW"
   Icon: Data bracket/terminal cursor ( > _ )
   For: Data deep dives, stats, raw information
```

### AI Generation Prompt (Background Only)

The highlight covers should be created in a design tool (Canva, Figma) rather than fully AI-generated, because the icons need to be clean, simple, and readable at small sizes. However, if you want to generate the Dark Steel textured backgrounds:

```
Dark steel textured background with subtle metallic grain. Color
#1E1E20. Very subtle variation in tone — not perfectly flat, slight
industrial texture. No objects. No patterns. No text. Just dark metal
surface. Film grain 10%. Square composition 1:1. Photorealistic.
```

---

## ASSET 6: FAVICON

### Dimensions & Technical Specs

| Property | Value |
|----------|-------|
| Canvas size | 192 x 192 px (primary) |
| Additional sizes | 32x32, 48x48, 96x96, 180x180 (Apple Touch) |
| Background | Dark Steel (#1E1E20) or transparent |
| DPI | 72 |
| File format | PNG (primary), ICO (multi-size bundle) |
| Max file size | 100 KB |
| Color space | sRGB |

### Design

```
COMPOSITION:
  Background: Dark Steel (#1E1E20) solid
  Element: Rust-orange (#9A4C22) butterfly bowtie shape, centered
  The bowtie fills 60-70% of the canvas
  Clean, simple, high-contrast

  At 32x32, the bowtie must still be recognizable.
  At 16x16 (browser tab), it should read as a warm-colored
  shape on dark background.

  DO NOT attempt to put the full dog image in a favicon.
  The bowtie icon IS the brand at small sizes.
```

### Creation

```
CREATION STEPS:
1. Start with 192x192 canvas
2. Fill background: #1E1E20
3. Draw centered butterfly bowtie: #9A4C22
   - Two triangular lobes meeting at a narrow center
   - Slightly imperfect edges (not perfectly geometric — canvas feel)
   - The shape should echo the actual bowtie Red Nose wears
4. Export at 192x192 (primary), then scale down:
   - 180x180 (Apple Touch Icon)
   - 96x96
   - 48x48
   - 32x32
5. Bundle into .ico file for browser compatibility
6. Test in browser tab at 16x16 — must still read
```

### Multi-Size Export Table

| Size | Use | File Name |
|------|-----|-----------|
| 192x192 | Android Chrome, general | favicon-192.png |
| 180x180 | Apple Touch Icon | apple-touch-icon.png |
| 96x96 | Windows shortcut | favicon-96.png |
| 48x48 | Windows taskbar | favicon-48.png |
| 32x32 | Browser tab (standard) | favicon-32.png |
| 16x16 | Browser tab (minimum) | favicon-16.png |
| Multi-size | IE/legacy browser bundle | favicon.ico |

---

## MASTER ASSET CHECKLIST

| Asset | Dimensions | Format | Safe Zone | Brand Elements | Priority |
|-------|-----------|--------|-----------|----------------|----------|
| YT Banner | 2560x1440 | PNG <6MB | 1546x423 center | P4 silhouette + wordmark + skyline | HIGH |
| YT Profile Pic | 800x800 | PNG <4MB | 600x600 circle | P5 close-up (eye + bowtie) | HIGH |
| YT Watermark | 150x150 | PNG transparent <1MB | Full canvas | Bowtie icon only | MEDIUM |
| IG Profile Pic | 1080x1080 | PNG <5MB | 810x810 circle | P5 close-up (eye + bowtie) | HIGH |
| IG Highlight Covers | 1080x1920 | PNG <5MB | 600x600 center circle | Icon + category label | MEDIUM |
| Favicon | 192x192 + sizes | PNG + ICO <100KB | Full canvas | Bowtie icon | LOW |

---

## COLOR REFERENCE (Quick Access)

| Color | Hex | Usage in Channel Art |
|-------|-----|---------------------|
| Dark Steel | #1E1E20 | All backgrounds |
| Rust Orange | #9A4C22 | Bowtie, subtitle, icons, accents |
| Earth Clay | #7E6551 | Secondary text if needed |
| Ash Gray | #4A4A4A | Borders, dividers |
| Bone White | #E7E7E1 | Primary text, wordmark |
| Burnt Umber | #3A1A0A | Deep shadow tones |
| Copper | #C4713B | Hover states (digital only) |

---

## FONT REFERENCE (Quick Access)

| Font | Weight | Use | Source |
|------|--------|-----|--------|
| Anton | Regular (400) | Wordmark, headlines | Google Fonts |
| Space Mono | Regular (400) | Subtitles, labels, data | Google Fonts |
| JetBrains Mono | Regular (400) | Data overlays (video only) | JetBrains |

---

## FILE ORGANIZATION

```
cinema_knowledge/bowtie-bullies/
├── channel-art/
│   ├── yt-banner-2560x1440.png
│   ├── yt-banner-source.psd (or .fig)
│   ├── yt-profile-800x800.png
│   ├── yt-watermark-150x150.png
│   ├── ig-profile-1080x1080.png
│   ├── ig-highlight-the-system.png
│   ├── ig-highlight-the-future.png
│   ├── ig-highlight-the-gear.png
│   ├── ig-highlight-the-marathon.png
│   ├── ig-highlight-the-takes.png
│   ├── ig-highlight-the-raw.png
│   ├── favicon-192.png
│   ├── favicon-96.png
│   ├── favicon-48.png
│   ├── favicon-32.png
│   ├── apple-touch-icon.png
│   └── favicon.ico
└── source-files/
    ├── bowtie-icon.svg (vector bowtie for watermark/favicon)
    ├── banner-skyline-bg.png (AI-generated background)
    ├── rednose-p5-profile.png (AI-generated character)
    └── rednose-p4-silhouette.png (AI-generated silhouette)
```

---

## NAMING CONVENTION

```
[platform]-[asset-type]-[dimensions]-[version].[ext]

Examples:
  yt-banner-2560x1440-v1.png
  yt-profile-800x800-v1.png
  yt-watermark-150x150-v1.png
  ig-profile-1080x1080-v1.png
  ig-highlight-the-system-1080x1920-v1.png
  all-favicon-192x192-v1.png
```

---

## GENERATION PIPELINE ORDER

1. **Generate Red Nose P5 image** (used for YT Profile + IG Profile)
2. **Generate Red Nose P4 silhouette** (used for YT Banner + Outro)
3. **Generate banner skyline background** (used for YT Banner)
4. **Composite YT Banner** (background + P4 silhouette + wordmark)
5. **Crop/export YT Profile** (from P5 generation)
6. **Crop/export IG Profile** (from P5 generation, upscaled)
7. **Create bowtie icon vector** (used for Watermark + Favicon + Highlights)
8. **Export YT Watermark** (from bowtie vector)
9. **Export Favicon set** (from bowtie vector)
10. **Create IG Highlight Covers** (template + icons from bowtie vector + category labels)

---

*"The bowtie is the brand at every size. From a 2560px banner to a 16px favicon, the shape reads."*
