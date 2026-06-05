---
name: 3d-icon-forge
description: Generate on-brand 3D translucent/glass icon assets for Remotion explainer videos. Four style families (Glass Tile, Techsy Machine, Cripsy Orbit, Destly Interface) with TIN brand palette (cyan primary, magenta RARE accent). Produces transparent PNGs via Gemini → rembg pipeline. Use when building explainer videos, adding hero icons to compositions, or expanding the asset library.
triggers:
  - "3d icon"
  - "glass icon"
  - "icon asset"
  - "explainer icon"
  - "bake icon"
  - "icon library"
  - "translucent icon"
---

# 3D Icon Forge — TIN Asset System for Remotion

## What this skill does
Generates **transparent-background 3D icons** in 4 distinct style families, all re-colored for The Innovative Native brand (cyan primary, magenta RARE accent). Assets live in `library/` as PNG-32 with clean alpha channels, ready to drop into Remotion compositions.

## 🔥 CHECK PRODUCTION LIBRARY FIRST

Before baking anything new, check the pre-existing production icon library at
**`/Users/makwa/theinnovativenative/remotion-videos/iconSet/`**.

30 Techsy-style (Style B) icons are already production-ready — 2000×2000 RGBA PNG with clean alpha. See `references/production-library.md` for the full inventory with tags. Subjects covered:

arrow, battery, bitcoin, blender, browser, card, cloud, computer, cooler, donut, ether, files, **filter** (funnel), folder, graph, heart, image, message, phone, pie, pin, **pipe** (workflow/n8n), play, **safe** (vault/db), **shield**, star, **trophy**, upload, user

All 30 are registered in `library/index.json` with `source: "techsy-production"`. Lookup by tag, subject, or id before generating.

## Pick the right style for the moment

| Style | Use when explainer needs... | Visual signature |
|-------|----------------------------|------------------|
| **A — Glass Tile** | Utility icons, bullet points, grids of features | Rounded-square glass slab + matte white icon, centered, repeatable |
| **B — Techsy Machine** | Hero "here's the system" moments, feature deep-dives | Chrome isometric base + translucent cyan glass feature + floating debris |
| **C — Cripsy Orbit** | Single big idea (one concept = one shot) | White subject + cyan halo + magenta/mint accent + orbiting geometric bits |
| **D — Destly Interface** | Dashboard/workflow/product walkthroughs | Soft matte 3D UI frames, multiple panels, muted pastel palette |

**Rule of thumb:** A for lists, B for hero product shots, C for single-concept emphasis, D for "here's the software" explainers.

## Files in this skill

### Style modules (pick one per bake)
- `references/style-a-glass-tile.md`
- `references/style-b-techsy-machine.md`
- `references/style-c-cripsy-orbit.md`
- `references/style-d-destly-interface.md`

### System references (always load)
- `references/brand-palette-tin.md` — cyan ladder, magenta accent rules, neutrals
- `references/gemini-prompt-anatomy.md` — slot system + negative prompts
- `references/transparency-pipeline.md` — Gemini → rembg → PNG-32 alpha
- `references/remotion-integration.md` — import pattern for compositions

### Library
- `library/index.json` — registry: `{id, style, subject, path, tags, variant}`
- `library/a-glass-tile/*.png` — baked Style A assets
- `library/b-techsy-machine/*.png` — baked Style B assets
- `library/c-cripsy-orbit/*.png` — baked Style C assets
- `library/d-destly-interface/*.png` — baked Style D assets

## How to use (from a Remotion composition)

```tsx
import iconIndex from '@skills/3d-icon-forge/library/index.json';
const brain = iconIndex.assets.find(a => a.id === 'c-brain-cyan-hero');
// brain.path → relative path to PNG
```

Or browse visually: open `library/a-glass-tile/` in Finder, Quick Look, pick the asset, drop into composition.

## How to bake new icons

```bash
# Single icon:
python scripts/icon-forge/bake.py --style a --subject brain --variant cyan

# Batch from seed list:
python scripts/icon-forge/bake.py --batch references/seed-lists/explainer-core.json

# Custom prompt override:
python scripts/icon-forge/bake.py --style b --subject "neural network" --prompt-extra "wired cables trailing from the base"
```

The script:
1. Loads the style module for prompt skeleton
2. Injects subject + variant into slot system
3. Calls Gemini `gemini-2.5-flash-image` (photorealistic 3D model) with chroma-key green bg
4. Runs `rembg` to strip bg → PNG-32 with alpha
5. Crops to content bbox + pads to square
6. Writes to `library/<style>/<slug>.png`
7. Updates `library/index.json`

## Variants per style

| Variant | When to use |
|---------|-------------|
| `cyan` | Default. 99% of assets. |
| `magenta-rare` | Hero/CTA moments only. Max 1 per explainer. Enforces brand's "magenta RARE accent" rule. |
| `neutral-white` | Busy scenes where color would clash. |

Scale variants: `hero` (2048×2048), `supporting` (1024×1024), `micro` (512×512).

## Brand constraints (auto-enforced by prompts)
- NO text, NO logos, NO baked-in drop shadows
- NO purple (that was the reference aesthetic — TIN uses cyan)
- Magenta `#E91E63` appears ONLY in `magenta-rare` variant
- Cyan primary `#00BCD4` dominates all default bakes

## Skills gap coverage
This skill extends `.claude/skills/infrastructure/gemini-image/` (API reference) and feeds `.claude/skills/remotion/` (video compositions) — use all three together for explainer production.
