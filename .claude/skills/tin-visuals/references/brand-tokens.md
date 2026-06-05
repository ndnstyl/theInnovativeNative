# Brand Tokens — Quick Reference

Source of truth: `remotion-videos/brands/innovative-native/brand.json`
This file is for fast lookup only — always defer to brand.json for render-time values.

---

## Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `background` | `#0a0a14` | Primary dark background |
| `background_alt` | `#12121f` | Alternate bg panel |
| `text` | `#f5f5f5` | Primary text |
| `text_secondary` | `#b8b8c8` | Captions, labels, subtitles |
| `accent` | `#00ffff` | Cyan — primary CTA, hooks, borders |
| `accent_secondary` | `#00d4d4` | Muted cyan — secondary bars, inactive |
| `accent_tertiary` | `#0a0a14` | (same as bg — used for contrast inversion) |
| `code_bg` | `#06060c` | Code block backgrounds |
| `card_bg` | `#1a1a2e` | Card/panel fill |
| `card_bg_alt` | `#16213e` | Alternate card fill |
| `extended.cyber_magenta` | `#ff00ff` | RARE accent — max 1 per reel |
| `extended.cyan_dim` | `#00b8b8` | Dimmed cyan |
| `extended.grid_line` | `#1a1a2e` | Chart grid lines |

---

## Fonts

| Slot | Family | Weights | Usage |
|------|--------|---------|-------|
| `heading` | Playfair Display | 600, 700 | Titles, CalloutCard text, hooks |
| `body` | Inter | 400, 500, 600, 700, 800 | Labels, body copy, CTA buttons |
| `code` | JetBrains Mono | 400, 600 | Stats, dates, code, counters |

Loaded via `loadBrandFonts()` from `src/lib/font-loader.ts`. Returns `{ heading, body, code }`.

---

## Unsilo Fonts (separate brand — Unsilo scenes only)

| Slot | Family | Weights | Usage |
|------|--------|---------|-------|
| `main` (handwritten) | Bangers | 400 | Hand labels, accent text, bigFormula |
| `title` | Caveat | 400, 600, 700 | Scene titles (chapter openers) |
| `mono` | JetBrains Mono | 400, 600 | Body mono, table cells, footer |

Loaded via `loadUnsiloFonts()` from `src/lib/font-loader.ts`. Returns `{ main, title, mono }`.
Unsilo themes defined in `src/Unsilo/theme.ts`.

---

## Video Overlay Specs (from brand.json)

| Property | Value |
|----------|-------|
| Hook font | Playfair Display, weight 900 |
| Hook size 16x9 | 96px |
| Hook size 9x16 | 128px |
| Hook color | `#00ffff` |
| Caption font | Inter, weight 700 |
| Caption size 16x9 | 48px |
| Caption size 9x16 | 64px |
| Caption bg | `#1f2128F2` (dark, 95% opaque) |
| Caption text | `#ffffff` |
| Caption active word | `#00ffff` at 1.18x scale |
| CTA font | Inter, weight 800 |
| CTA size 16x9 | 56px |
| CTA bg | `#00ffff` |
| CTA text | `#0a0a14` |
| Default CTA copy | "More at theInnovativeNative.com" |

---

## Brand Rules

- **Mode**: Dark always. No light-mode variants.
- **Magenta rule**: `#ff00ff` is RARE — max 1 use per reel, ideally zero. Never in captions.
- **Caption highlight**: active word = cyan + 1.18x scale simultaneously.
- **No vignette in prompts** — add in post only.
