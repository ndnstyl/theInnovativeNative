# Style C — Cripsy Orbit

## When to use
Single-concept hero shots. When one idea = one asset = one moment in the video. Most "brandable" of the 4 styles because the subject is front-and-center, no device to distract.

**Reference look:** white matte subject + cyan glass halo/containment + small accent pops + floating geometric debris orbiting the subject.

## Visual signature
- Single subject dominates (70-80% of frame)
- **Core:** matte white 3D shape (the main metaphor)
- **Halo/frame:** cyan translucent glass element surrounding or behind the core (ring, hexagon, coin-shape, cloud, etc.)
- **Accent pops:** small magenta-rare OR mint-green elements — buttons, arrows, checkmarks (1-2 per composition)
- **Orbiting debris:** 3-5 small geometric shapes floating around (spheres, cubes, crosses, plus signs) in cyan glass material
- Slightly dynamic angle — not straight-on, ~15° rotation for energy
- Soft contact shadow under subject (not dropped onto bg, just subtle occlusion)

## Prompt template

```
[STYLE_BLOCK]
Premium 3D render of a single hero concept object. Clean, bold, slightly whimsical,
product-photo aesthetic. One subject only, dominant in frame.

[SUBJECT_BLOCK]
A matte white {subject}, rendered as smooth friendly plastic with gently rounded 3mm edges,
framed by a translucent cyan glass halo element that surrounds or backs the subject
(ring, hexagonal frame, coin-shape, or cloud form — pick whichever suits {subject}).
Around the composition, 4 small floating geometric shapes orbit the subject: 2 translucent
cyan spheres, 1 translucent cyan cube, 1 small checkmark or plus sign in mint green #4DE3B3.
The shapes float weightlessly at varying depths.

[MATERIAL_BLOCK]
Subject: matte white #F5F5F5 opaque plastic, subtle shiny highlight, no texture.
Halo element: translucent cyan glass tinted {accent_hex}, ~65% opacity, with deeper
{accent_deep_hex} in recesses, crisp {accent_light_hex} specular highlights on upper edge.
Orbiting cyan debris: same glass material, smaller highlights.
Accent pop (mint checkmark / plus): opaque mint green #4DE3B3, slight gloss.

[LIGHTING_BLOCK]
Soft key light from upper-left-front, gentle fill from opposite side, subtle rim behind
the subject to separate it from background. Glass halo catches the light dramatically.
Very soft ambient occlusion under the subject, no hard cast shadow.

[CAMERA_BLOCK]
3/4 view with ~15° yaw and ~10° tilt for dynamism. 50mm equivalent lens, minimal
perspective distortion. Subject fills 75% of canvas, centered, with orbital debris
extending slightly into the surrounding area. Composition feels balanced, not crowded.

[BACKGROUND_BLOCK]
Solid flat chroma-key green (#00FF00), pure uniform color, no gradient, no elements,
filling 100% of the area.

[NEGATIVE_BLOCK]
NEGATIVE: no text, no numbers, no letters, no logos, no watermarks,
no background gradient, no drop shadow on background, no purple, no violet,
no photograph style, no hand, no people, no multiple main subjects,
no crowded composition, no realistic organic textures.
```

## Variant adjustments

### cyan (default)
- `{accent_hex}` = `#00BCD4`
- `{accent_deep_hex}` = `#0097A7`
- `{accent_light_hex}` = `#4DD0E1`
- Accent pop color: mint green `#4DE3B3`

### magenta-rare (**hero CTA only**)
- Subject stays matte white
- Halo: magenta glass `#E91E63` / deep `#AD1457` / light `#F48FB1`
- Orbital debris: cyan (contrast with magenta halo)
- Accent pop: mint green

### neutral-white
- Halo is frosted translucent white
- Orbital debris small cyan glass spheres (minimal color presence)
- Accent pop: magenta-rare pinpoint

## Temperature
`0.7` — each Cripsy piece is typically unique

## Seed icon list (core 10)
1. `bitcoin` — crypto / payment (reference image used this)
2. `diamond` — value / premium
3. `rocket-with-coin` — launch / product-market-fit
4. `brain-coin` — AI monetization
5. `heart-with-ring` — community / care
6. `mailbox-glow` — inbox / opt-in
7. `medal-badge` — achievement
8. `clock-ring` — time / deadline
9. `key-with-halo` — access / unlock
10. `flame-ring` — trend / hot

## Known issues
- Gemini sometimes makes the halo too small — explicitly request "halo element at least 1.3x larger than the subject diameter"
- If mint-green accent reads as teal, specify "mint green closer to yellow-green than blue-green"
- Orbital debris tends to cluster on one side — add "balanced distribution around the subject, not clustered"
- When halo is a hexagon, Gemini may make it too geometric — soften with "hexagon with gentle rounded corners"
