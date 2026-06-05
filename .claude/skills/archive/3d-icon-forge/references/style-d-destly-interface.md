# Style D — Destly Interface

## When to use
Dashboard walkthroughs, product explainers, "here's the software" moments, workflow visualizations. Friendlier, more approachable than Styles A/B/C. Multi-panel compositions.

**Reference look:** soft matte 3D UI frames (browser, mobile, card), stacked/overlapping at slight angles, with small floating decorative elements.

## Visual signature
- Multiple 3D UI frames at slight angles, stacked/overlapping
- Frames are soft matte, not glossy (very different from A/B/C glass aesthetic)
- Palette: soft pastel — muted teals, peach, pale green, cyan-tinted white, charcoal
- Each frame has simple interior: a rounded rectangle "content area", 2-3 "pill shapes" as menu items, maybe a "button" or "chart bar"
- NO actual text — all UI elements are abstract shape placeholders
- 3-5 small floating decorative elements — plant in pot, coin, balloon, arrow, small cube
- Slight isometric feel but softer than Style B

## Prompt template

```
[STYLE_BLOCK]
3D illustration of a stylized software dashboard composition. Soft matte materials,
modern friendly UI aesthetic, multiple interface frames, Memphis-inspired decorative
elements around the edges.

[SUBJECT_BLOCK]
A composition of 2 or 3 stylized 3D UI panels overlapping at slight angles, representing
a {subject} interface. Each panel has simple abstract UI elements: a rounded content
rectangle, 2-3 pill-shaped menu items, 1 button or chart element. The panels are slightly
rotated relative to each other, creating a layered look. No actual text, letters, or numbers
anywhere — UI elements are abstract rounded shapes only.

Around the panels, 4 floating decorative objects drift: one small potted plant with 2-3
leaves, one small {accent_hex} cube, one mint green #4DE3B3 sphere, one small arrow
pointing toward the main panel. Composition feels playful and approachable.

[MATERIAL_BLOCK]
Panels: soft matte plastic in cyan-white #E8F4F7 for the main panel bodies, slightly
darker #B2DFDB for secondary panels. UI elements inside: pastel peach #FFAB91 for primary
buttons, charcoal #37474F for chart bars, cyan #00BCD4 for active pill items, soft gray
#CFD8DC for inactive pill items. Plant: matte green leaves #81C784 with terracotta pot
#D7816A. All materials have subtle ambient shading, no harsh glossiness.

[LIGHTING_BLOCK]
Soft diffuse key light from upper-left, gentle ambient fill from all sides, very soft
contact shadow under each panel. The scene feels evenly lit, no dramatic contrast.
Slight rim highlight on panel edges.

[CAMERA_BLOCK]
3/4 view with ~20° rotation to the right and ~10° tilt down. 50mm equivalent lens. The
panel composition fills 70% of the canvas, with decorative floating objects extending
into the surrounding space. Balanced, not cramped.

[BACKGROUND_BLOCK]
Solid flat chroma-key green (#00FF00), pure uniform color, no gradient, no scene elements,
filling 100% of the area.

[NEGATIVE_BLOCK]
NEGATIVE: no text, no numbers, no letters, no actual UI text, no app names,
no brand logos, no realistic screenshots, no background gradient,
no drop shadow on background, no purple, no violet, no photograph style,
no hand, no people, no glossy shiny surfaces, no glass materials,
no crowded composition, no single panel only.
```

## Variant adjustments

### cyan (default) — the canonical Destly look with TIN palette
- `{accent_hex}` = `#00BCD4` (active pill cyan)
- Secondary accent: mint green `#4DE3B3`
- Warm accent: pastel peach `#FFAB91`

### magenta-rare
- Active pill color swaps to magenta `#E91E63`
- Small magenta cube in floating decorations
- Rest of palette unchanged
- Use when showcasing a hero/CTA dashboard

### neutral-white
- All panels pure soft white #F5F5F5 with very subtle cyan tint
- Remove colored pill accents — just gray pills
- Only decorative element retains color: mint sphere
- Good when video overlays will add color

## Temperature
`0.7` — Destly compositions are always unique

## Seed icon list (core 10)
1. `dashboard-main` — generic admin
2. `shopping-checkout` — e-commerce (reference image used this)
3. `video-player` — media / content
4. `chat-interface` — messaging
5. `kanban-board` — project management / Notion/Airtable
6. `calendar-scheduler` — scheduling
7. `chart-analytics` — data dashboard
8. `workflow-builder` — automation canvas (n8n vibe)
9. `profile-settings` — user account
10. `inbox-mail` — email client

## Known issues
- Gemini may add realistic UI text to panels — emphasize "no actual text, abstract shapes only" at top of SUBJECT_BLOCK
- If panels come out as flat 2D illustrations, specify "3D extruded panels with visible depth on sides, approximately 20mm thickness"
- Decorative elements sometimes overwhelm panels — if so, reduce from 4 to 3 decorations
- Panel palette can drift to dark — if it does, state "light pastel panels, bright friendly palette" in MATERIAL_BLOCK
