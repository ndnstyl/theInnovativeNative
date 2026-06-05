# Style A — Glass Tile

## When to use
Utility icons, bullet points, feature grids, list items. The "UI icon library" style. Repeatable, consistent, grid-friendly.

**Reference look:** rounded-square glass slab + matte white icon, centered, 1:1.

## Visual signature
- Rounded-square glass tile, 20% corner radius
- Tile depth ~15-20% of width (substantial, not flat)
- Tile material: cyan-tinted clear glass, IOR ~1.5, chromatic dispersion on corner edges
- Icon: matte white plastic, embedded into or floating on front face, ~65-70% of tile area
- Icon edges: ~2-3mm fillet, soft not sharp
- Lighting: soft area key from top-left, rim from back-right, bright specular hotspot on upper-left corner of tile
- Perspective: near-orthographic front view with ~5° tilt for dimensional read

## Prompt template

```
[STYLE_BLOCK]
Ultra high quality 3D render of a single glass UI icon asset. Isometric product photography
style, clean and premium, suitable for a modern app icon library.
THE PRIMARY OBJECT IN THIS RENDER IS A GLASS TILE — a thick, chunky, rounded-square slab
of translucent glass. The tile fills roughly 85% of the frame. The subject icon is a SMALL
DECORATION ON the tile's front face, not the primary object.

[SUBJECT_BLOCK]
A single chunky rounded-square glass tile (20% corner radius, ~18% depth relative to width),
floating alone in space. The tile is THE HERO object filling most of the frame.
On the front face of this tile, a smaller matte white 3D icon shape representing {subject}
is embedded/centered — the icon occupies roughly 60% of the tile's face area (so it reads
as "an app icon on a tile", NOT as "a large {subject}"). The {subject} shape is rendered as
soft matte white plastic with 2mm rounded edges.
CRITICAL: The tile container MUST be visible in the output. Without the rounded-square glass
tile, this render is a failure. The glass tile is more important than the {subject} icon.

[MATERIAL_BLOCK]
The tile is made of translucent glass tinted {accent_hex}, slightly deeper {accent_deep_hex}
toward the back edge, with crisp {accent_light_hex} specular highlights on the upper-left
corner. Visible subsurface light transmission. Subtle chromatic dispersion at the tile's
corner bevels. The white icon has no texture, purely matte white #F5F5F5 plastic,
slightly shiny under the key light.

[LIGHTING_BLOCK]
Soft area key light from upper-left (45° elevation), soft fill from front, subtle rim from
upper-right-back. One clear specular hotspot on the tile's upper-left corner. The icon
casts a soft ambient occlusion shadow onto the tile face (not a baked drop shadow, just
natural contact shadow from being embedded).

[CAMERA_BLOCK]
NEARLY ORTHOGRAPHIC FRONT VIEW — the camera is almost perfectly head-on to the tile. No
more than 3° downward tilt and no more than 3° left-right rotation COMBINED. The tile's
front face must read as nearly square in the frame, NOT as a skewed parallelogram. Think
"straight-on product shot" with just a whisper of angle to hint at depth. The icon on the
tile face should appear symmetric and un-skewed. 50mm equivalent lens, zero perspective
distortion. Subject centered. Frame fills 90% of canvas.
FORBIDDEN: dramatic isometric angles, strong Z-axis twist, any rotation that makes the
tile face appear as a clear parallelogram or diamond shape.

[BACKGROUND_BLOCK]
Solid flat chroma-key green (#00FF00), pure uniform color, no gradient, no scene elements,
filling 100% of the area behind the tile.

[NEGATIVE_BLOCK]
NEGATIVE: no text, no numbers, no letters, no logos, no watermarks, no UI labels,
no drop shadow on the background, no gradient background, no purple, no violet,
no multiple tiles, no icon grid, no scene, no photograph style, no hand, no people.
```

## Variant adjustments

### cyan (default)
- `{accent_hex}` = `#00BCD4`
- `{accent_deep_hex}` = `#0097A7`
- `{accent_light_hex}` = `#4DD0E1`

### magenta-rare
- `{accent_hex}` = `#E91E63`
- `{accent_deep_hex}` = `#AD1457`
- `{accent_light_hex}` = `#F48FB1`

### neutral-white
- Tile is frosted translucent white glass (`#F5F5F5` tint, subtle)
- `{accent_deep_hex}` = `#CFD8DC`
- `{accent_light_hex}` = `#FFFFFF`

## Temperature
`0.4` — want consistency across a set of Style A icons

## Seed icon list (core 10)
1. `brain` — cognition / AI
2. `lightbulb` — idea / insight
3. `lock` — security / privacy
4. `gear` — settings / config
5. `chart-bar` — analytics / growth
6. `calendar` — scheduling / time
7. `chat-bubble` — communication / messaging
8. `document` — content / files
9. `shield-check` — trust / verification
10. `rocket` — launch / growth

## Known issues
- If Gemini renders a DROP shadow behind the tile, regenerate with "no shadow on background" moved to start of NEGATIVE
- If the white icon appears translucent (glass-like), push "matte opaque white plastic, not glass" earlier in MATERIAL_BLOCK
- If multiple tiles appear, add "single isolated tile, one object only" to STYLE_BLOCK
