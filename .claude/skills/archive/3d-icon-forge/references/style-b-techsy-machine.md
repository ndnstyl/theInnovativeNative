# Style B — Techsy Machine

## When to use
Hero "here's the system" shots, feature deep-dives, product explainers where you want to emphasize "this is a sophisticated machine." Most visually rich style — use sparingly as centerpiece shots.

**Reference look:** chrome isometric base device + translucent cyan glass feature protruding from top + floating cube/sphere debris around composition.

## Visual signature
- Isometric 3/4 angle (~30° elevation, ~45° yaw)
- **Base:** chrome/dark-chrome metallic block-shaped device, ~45% of composition height. Has visible tech details: LED indicator dots, vents, knobs, small screens, buttons. Two-tone: light silver top face, darker silver/charcoal sides.
- **Feature:** translucent cyan glass object rising from top of base. This is the actual subject/metaphor (funnel, shield, rocket, etc.). Has internal structure visible through the glass.
- **Accents:** 5-8 small floating translucent cyan cubes + spheres + geometric shapes surrounding the composition at various distances. Creates a "data particles" feel.
- **Base details:** small green LED, small red LED, venting grille pattern, text-less button pads
- Overall composition is taller than wide when measured object-only

## Prompt template

```
[STYLE_BLOCK]
Premium 3D product render, isometric 3/4 view, glossy chrome + translucent glass combo,
ultra high detail, tech-gadget aesthetic, single centered composition.

[SUBJECT_BLOCK]
An isometric tech-device with two parts:
(1) A chrome metallic base: rectangular block-shaped machine (roughly 1.2:1 width:height),
two-tone brushed silver top with darker charcoal sides, featuring 2 small glowing LED dots
(one green, one red), one circular knob dial, a ventilation grille pattern, and a blank
button pad. No text, no numbers, no labels anywhere.
(2) A translucent cyan glass {subject} rising from the top of the base as the main feature,
with visible internal structure and semi-transparent material.

Around the composition, 6 floating translucent cyan geometric shapes drift: 3 cubes (small,
medium), 2 spheres, 1 smaller cube. They appear weightless, arranged organically.

[MATERIAL_BLOCK]
Base: polished chrome metal, silver #B0BEC5 top face, darker #455A64 side faces, realistic
metallic reflections, subtle ambient occlusion in corners. LED dots: bright self-emissive
#4DE3B3 (green) and #FF6B6B (red), small and tasteful.
Glass feature: translucent glass tinted {accent_hex}, semi-opaque (~70% opacity), with
deeper {accent_deep_hex} in recesses and bright {accent_light_hex} specular highlights.
Subsurface scattering visible. Internal structure slightly visible through the glass.
Floating debris: same {accent_hex} translucent glass, smaller highlights, consistent material.

[LIGHTING_BLOCK]
Soft area key light from upper-left, gentle fill from front-right, strong rim light from
upper-back to define glass edges. The glass feature catches light dramatically with multiple
specular hotspots. Soft contact shadow under the base. No floor — the composition floats.

[CAMERA_BLOCK]
Isometric-leaning 3/4 view: camera 30° above horizontal, 45° yaw to the right. 50mm
equivalent lens with minimal perspective distortion. The subject fills 75% of the canvas
vertically, centered. Floating debris can extend slightly past the base's footprint but
not past frame edges.

[BACKGROUND_BLOCK]
Solid flat chroma-key green (#00FF00), pure uniform color, no gradient, no scene elements,
no floor, no horizon, filling 100% of the area.

[NEGATIVE_BLOCK]
NEGATIVE: no text, no numbers, no letters, no brand logos, no screen content,
no drop shadow on background, no gradient background, no purple, no violet,
no photograph of real hardware, no hand, no people, no floor, no horizon line,
no multiple machines, no busy scene, no motion blur.
```

## Variant adjustments

### cyan (default) — **this is the canonical Techsy look**
- `{accent_hex}` = `#00BCD4`
- `{accent_deep_hex}` = `#0097A7`
- `{accent_light_hex}` = `#4DD0E1`

### magenta-rare
- `{accent_hex}` = `#E91E63`
- `{accent_deep_hex}` = `#AD1457`
- `{accent_light_hex}` = `#F48FB1`
- Use for hero CTA machine only — extremely rare

### neutral-white
- Glass feature is frosted translucent white instead of tinted
- Good when the scene has a heavy cyan treatment already and you want contrast

## Temperature
`0.7` — each Techsy Machine is typically unique; variety per asset is fine

## Seed icon list (core 10)
1. `funnel` — lead generation / conversion (reference image used this!)
2. `shield` — security / trust
3. `rocket-launch` — growth / launch
4. `brain-network` — AI / neural network
5. `workflow-engine` — automation / n8n
6. `trophy` — success / outcome
7. `chart-tower` — analytics / reporting
8. `database-cylinder` — data / storage
9. `globe-network` — distribution / scale
10. `gear-complex` — engine / system

## Known issues
- Gemini sometimes renders text/numbers on buttons — keep "no text on buttons" explicit in NEGATIVE
- LED dots sometimes get too large (looks like buttons) — specify "tiny pinpoint LED dots, 3mm diameter"
- Floating debris can crowd the subject — if that happens, reduce from 6 to 4 shapes in SUBJECT_BLOCK
- Avoid letting the glass go full-clear — 70% opacity is the sweet spot for rembg to strip it cleanly
