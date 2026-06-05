# TIN Brand Palette for 3D Icon Generation

## Primary (use in 99% of assets)
| Role | Hex | Use |
|------|-----|-----|
| Cyan Primary | `#00BCD4` | Glass tints, feature highlights, primary accent |
| Cyan Deep | `#0097A7` | Shadow-side of cyan glass, depth |
| Cyan Light | `#4DD0E1` | Specular highlights on cyan surfaces |

## Neutrals (structure + base materials)
| Role | Hex | Use |
|------|-----|-----|
| Matte White | `#F5F5F5` | Icon bodies, UI panels, soft plastic surfaces |
| Chrome Silver | `#B0BEC5` | Metallic bases (Style B), knobs, vents |
| Dark Chrome | `#455A64` | Deep metallic shadows, tech detailing |
| Soft Gray Bg | `#E0E7EB` | Reference background in mock-ups (stripped before use) |

## RARE accent — magenta (use sparingly)
| Role | Hex | Use |
|------|-----|-----|
| Magenta Rare | `#E91E63` | ONLY in `magenta-rare` variant. Hero/CTA moments. |

**Magenta rule:** Max 1 magenta-rare asset per explainer video. If you're generating more than one, you're violating the brand rule ("magenta RARE accent").

## Status accents (supporting, not primary)
| Role | Hex | Use |
|------|-----|-----|
| Mint Green | `#4DE3B3` | "Success/active" indicators only (replaces Cripsy's green) |
| Warning Amber | `#FFB74D` | "Attention" states only — rare |

## Chroma-key background (for bake pipeline)
- `#00FF00` — pure green, not present in any TIN asset. Used as Gemini bg so rembg/chroma-key reliably strips it.

## Never use
- ❌ Pure purple/violet (that's the reference aesthetic — **explicitly swap to cyan**)
- ❌ Cripsy green `#4CAF50` (too loud — use Mint Green `#4DE3B3` if green accent needed)
- ❌ Any gradient bg colors other than the chroma-key green during generation

## How to inject into prompts
Always specify exact hex codes in the prompt. Gemini follows hex references well for 3D material tinting. Example:
```
translucent glass material tinted cyan #00BCD4, slightly darker #0097A7 where it curves into shadow, crisp #4DD0E1 specular highlights on upper-left edge
```
