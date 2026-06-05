# Transparency Pipeline — Gemini → PNG-32 Alpha

## Why this exists
Gemini image models **do not** output transparent PNGs. Alpha channel is ignored; output is always RGB with a baked background. To get transparent assets for Remotion, we:

1. Prompt Gemini with a **flat chroma-key green (#00FF00)** background
2. Strip the green with `rembg` (runs locally, free, fast)
3. Crop to content bounding box + pad to square
4. Save as PNG-32 with clean alpha

## Requirements
- `rembg==2.0.61` (confirmed installed)
- `Pillow` (standard lib dependency of rembg)
- `requests` (for Gemini HTTP call)

## Pipeline implementation
See `scripts/icon-forge/bake.py` for the full implementation. Key steps:

```python
# 1. Generate with Gemini
image_bytes = gemini_generate(prompt)  # returns raw PNG bytes with green bg

# 2. Strip bg
from rembg import remove
from PIL import Image
import io

raw = Image.open(io.BytesIO(image_bytes))
stripped = remove(raw, alpha_matting=True, alpha_matting_foreground_threshold=240,
                  alpha_matting_background_threshold=10, alpha_matting_erode_size=10)

# 3. Crop to content bbox
bbox = stripped.getbbox()  # (left, upper, right, lower)
cropped = stripped.crop(bbox)

# 4. Pad to square (preserves aspect for Remotion scaling)
side = max(cropped.size)
padded = Image.new('RGBA', (side, side), (0, 0, 0, 0))
padded.paste(cropped, ((side - cropped.width) // 2, (side - cropped.height) // 2))

# 5. Resize to target (2048 for hero, 1024 supporting, 512 micro)
padded.thumbnail((target_size, target_size), Image.LANCZOS)
padded.save(out_path, 'PNG', optimize=True)
```

## rembg model selection
`rembg` defaults to `u2net` which works well for 3D icon shapes. For extra-clean edges on glass surfaces, use `isnet-general-use` model (slower but sharper):

```python
from rembg import new_session, remove
session = new_session('isnet-general-use')
stripped = remove(raw, session=session, alpha_matting=True)
```

First run downloads ~175MB model. Cached afterwards in `~/.u2net/`.

## Edge quality for glass
Glass/translucent surfaces are hard for bg removal because the bg shows THROUGH the subject. Strategies:

1. **Prompt for opacity bump:** ask for "semi-translucent, ~70% opacity glass" rather than "clear glass" — gives rembg enough contrast
2. **Alpha matting tuned:** `foreground_threshold=240, background_threshold=10, erode_size=10` preserves glass edges without carving into them
3. **Manual review:** inspect a sample before batch baking. If glass edges look chewed, tune thresholds.

## Failure cases + auto-retry
The bake script checks post-strip:
- If content bbox is <20% of frame → regeneration likely failed, retry
- If pixel variance inside bbox is <10 → mostly-empty result, retry
- If detected green pixels >5% post-strip → rembg failed to find edges, retry with tighter thresholds

## Verification
After every bake, the script prints:
```
[bake] a-brain-cyan-hero.png — 1847×1891 content, 2048² canvas, 341KB
```
Check that the content dimensions are reasonable (not 50×50, not 2000×50). Bad aspect ratios indicate a failed bake.
