# Gemini Prompt Anatomy — Slot System for 3D Icons

## Model
- **Primary:** `gemini-2.5-flash-image` (photorealistic 3D, correct for all 4 styles)
- **Fallback:** `gemini-2.0-flash-exp-image-generation` (if 2.5 rate-limited)
- **Do NOT use:** `gemini-2.5-flash-image` in cel-shaded mode — wrong for this use case

## Endpoint
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent
```
Auth: `x-goog-api-key: $GEMINI_API_KEY`

## Universal prompt skeleton
```
[STYLE_BLOCK]
[SUBJECT_BLOCK]
[MATERIAL_BLOCK]
[LIGHTING_BLOCK]
[CAMERA_BLOCK]
[BACKGROUND_BLOCK]
[NEGATIVE_BLOCK]
```

Each style module fills these blocks differently. Keep prompts under 200 words — Gemini image models degrade with verbose prompts.

## Slot variables (injected by bake script)
| Slot | Meaning | Example |
|------|---------|---------|
| `{subject}` | The icon's main object | "brain", "rocket", "gear", "lock" |
| `{variant}` | Color treatment | `cyan`, `magenta-rare`, `neutral-white` |
| `{accent_hex}` | Primary color hex | `#00BCD4` (cyan) / `#E91E63` (magenta) / `#F5F5F5` (white) |
| `{accent_deep_hex}` | Shadow-side hex | `#0097A7` / `#AD1457` / `#CFD8DC` |
| `{accent_light_hex}` | Specular hex | `#4DD0E1` / `#F48FB1` / `#FFFFFF` |
| `{aspect}` | Aspect ratio | `1:1` (default for all 4 styles) |
| `{extra}` | Optional subject-specific detail | "with floating neurons around it" |

## Universal NEGATIVE block (append to every prompt)
```
NEGATIVE: no text, no numbers, no logos, no watermarks, no letters, no UI labels,
no baked-in drop shadow, no gradient background effects, no purple, no violet,
no multiple subjects, no photograph style, no hand, no people, no busy composition.
```

## Universal BACKGROUND block (for transparency pipeline)
```
BACKGROUND: solid flat chroma-key green (#00FF00), no gradient, no texture,
no scene elements, pure uniform color filling entire frame behind the subject.
```
This is critical. Gemini does not output clean alpha — we generate against flat `#00FF00` and strip in post. Any deviation (gradient bg, shadow bg, textured bg) breaks the rembg step.

## Aspect ratio config
```json
{
  "generationConfig": {
    "imageConfig": { "aspectRatio": "1:1" }
  }
}
```
All 4 styles render at 1:1. Remotion compositions crop/scale as needed.

## Temperature
- Style A (Glass Tile): `0.4` — want consistency across a set
- Styles B/C/D: `0.7` — variety per asset is fine, each is usually unique

## Retry logic
If Gemini returns:
- **No image:** retry once with identical prompt
- **Image with text/letters:** re-prompt with "strictly no text" pushed to front of NEGATIVE block
- **Wrong color (purple bled through):** add "DO NOT use purple or violet under any circumstances" at top of prompt
- **Background not pure green:** fail the asset, regenerate (rembg needs clean chroma)

## Cost per asset
- Generation: ~$0.02
- Vision QA (optional, 1 in 5): ~$0.005
- Budget for 40-asset bake: ~$0.85
