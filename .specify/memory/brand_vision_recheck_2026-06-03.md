---
name: brand-vision-recheck-2026-06-03
description: "Planning doc for post-Friday brand vision review. Reads the current state of the marketingExpansion deck and proposes options across typography, palette, foundation, and density rhythm. Mike edits in-place. Not a recommendation, a menu."
metadata:
  type: project
  status: draft-for-review
  primary_artifact: theinnovativenative.com/marketingExpansion
  triggered_by: "Mike 2026-06-03 — 'this still feels off brand. I may need to circle back and recheck the brand vision, design, colors and fonts.'"
---

# Brand Vision Recheck — Marketing Expansion Deck

**Read this AFTER Friday's interview lands.** The deck is shipped, WCAG-readable, viewport-fluid, and operator-grade for Lee Brown. What follows is a separate question: does the visual brand the deck is BUILT ON still reflect how you want clients to feel when they see your work?

Mike's quote that triggered this: *"This still feels off brand. I may need to circle back and recheck the brand vision, design, colors and fonts."*

The deck's job is to win Friday. The brand's job is to win the next 12-24 months of client work and the next hire conversation and the next inbound and the next pitch. Different timescale. Different question.

---

## What you currently have (objective audit)

### Typography
- **Font family:** `-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif` — system default stack. No custom font, no brand identity in the type itself.
- **Weight ladder:** 100 (arrow icons) / 600 (link labels) / 700 (eyebrows) / 800 (titles/stats) / 900 (hero h1, big numbers).
- **Type scale post-a11y:** Hero h1 clamp(28-44px) / Section title 32-44px / Body lede 16-18px / Body 14-15px / Eyebrow 11-12px letterspaced uppercase.
- **Line-height:** 1.5-1.55 baseline, 0.96-1.04 on display.
- **Letter-spacing:** -2px on hero h1 (tight), -0.5px on titles, +3px on eyebrows (tracked).

### Color palette
- `#00d8e8` — cyan primary (system lift / good / master)
- `#ffb84d` — amber secondary (warning / Shark / splinter)
- `#a85858` — muted maroon (severity / fragment / leak)
- `#3ddc97` — green (used sparingly for "win" callouts per viz-designer.md)
- `#ff6b6b` — red-coral (only in Riley-pattern leak headlines)
- `#fff` / `#d8e2e4` / `#b8c8cc` / `#a8b8bc` — text grays
- `#0a1a1f` / `#0c1418` / `#112024` / `#1a2a2f` — dark foundation tones

### Foundation
- **Dark mode default.** `#0a1a1f` background everywhere. No light-mode alternative.
- Borders / dividers in `#1a2a2f` (very subtle).
- Backdrop blur + 96% opacity on sticky nav.

### Density
- 1180-1480px max-width with `clamp(1180px, 92vw, 1480px)` (just shipped).
- 28-32px container side padding.
- 14-16px card padding.
- 12-14px grid gap.
- Generous vertical breathing room in heros (90px top / 60px bottom).

### Vibe
- "Operator with a software background" — feels closer to a YC startup deck or a fintech product page than to a contractor / construction services pitch.
- Reads as: precise, technical, dark-mode-fluent, calm.
- Does NOT read as: warm, hands-on, blue-collar adjacent, customer-facing-trade.

---

## The actual question Lee Brown's reaction surfaces

Your existing clients are NOT software companies. Ox Floors is concrete coating. Visionspark is RE. DEA is data silo. Baloo is auto parts. The pattern: **operators who run physical or operational businesses**. The deck's current visual language was built for tech-fluent operators who already speak in dashboards.

Two open questions:

1. **Should the brand match the OPERATOR'S world** (warmer, more tactile, more "blue-collar fluent")?
2. **Or should the brand stay deliberately ABOVE** the operator's world (a calm software-grade lens they buy ACCESS to)?

Both are defensible. The current brand commits to door #2 without explicitly choosing it. Worth deciding on purpose.

---

## Typography options

### Option A: Stay on system stack (current)
- **Pro:** Zero font load. Renders identically across macOS / iOS / Windows. Operator-feel, no "design vibe."
- **Con:** No type-level brand identity. Forgettable. Could be any AI startup.
- **When this wins:** If your wedge is "I am the operator inside the room, not the agency selling glossy" — type that disappears is the right move.

### Option B: Add a single display font, keep system for body
- **Suggested:** **Söhne** (commercial), **Inter** (free), **Geist** (free, Vercel's choice), **General Sans** (free, Indian Type Foundry).
- **Pro:** Hero h1 + section titles get character. Body stays fast.
- **Con:** One more thing to load. Slight brand cost.
- **When this wins:** If you want one "you'll know it's mine" signal without committing to full custom type.

### Option C: Pair a serif display with a sans body
- **Suggested:** **Editorial New** + **GT America**, **Recoleta** + **Inter**, **Tiempos** + **Söhne**.
- **Pro:** Most distinctive option. Suggests "operator with editorial polish" (newspaper-y, considered).
- **Con:** Highest design-investment cost. Harder to apply consistently across video / decks / docs / web.
- **When this wins:** If you're positioning as a writer-operator (think: a16z's editorial brand for an operator-writer angle).

### Option D: Mono accent + sans body
- **Suggested:** **JetBrains Mono** or **IBM Plex Mono** for code-feel labels (eyebrows, stat callouts, axis labels) paired with **Inter** or **Söhne** for the rest.
- **Pro:** Doubles down on the "AI operator who codes" identity. Makes ledger / measurement / spec-kit work feel like a native artifact.
- **Con:** Easy to lean too hard into "developer aesthetic" if you ever need to pitch a non-technical audience.
- **When this wins:** If you commit to a builder/operator/automation positioning forever.

---

## Palette alternatives

### Option A: Stay on cyan / amber / maroon (current)
- **Pro:** Already built. Recognizable. Cyan as "primary good" is consistent across the whole deck.
- **Con:** Cyan-on-dark is the default vibe for ~40% of AI startups. You're not visually distinct from a competitor.
- **When this wins:** If brand recognition isn't the goal — execution is.

### Option B: Warmer earth palette (operator-trade adjacent)
- **Anchors:** Burnt orange `#d8703a`, forge red `#a83228`, slate `#3a4248`, parchment `#e8dfc8`, deep navy `#0c1a25`.
- **Pro:** Speaks to operators who work with steel, concrete, machinery. Feels like a workshop, not a SaaS.
- **Con:** Big departure from current. Doesn't extend cleanly to video work.
- **When this wins:** If your client wedge is durable-business operators (contractors, manufacturers, trades, fleet).

### Option C: Single brand color + grays
- **Anchor:** One brand hue (could keep cyan, or shift to chartreuse, or steel blue, or oxblood).
- Plus a 5-step gray ramp. NO secondary colors.
- **Pro:** Most disciplined. Maximum recognizability. Easiest to maintain.
- **Con:** Loses the ability to use color as data-signal (e.g., cyan = good, amber = warning, maroon = severity).
- **When this wins:** If you want a single-signature brand (think: Stripe purple, Notion black, Linear blue) at the cost of internal data-language clarity.

### Option D: Light-mode option for client deliverables
- Keep dark for your owned web. Add a light variant for client decks / PDFs / handouts.
- **Pro:** Solves the "client prints my deck on white paper" problem. Doubles your design system size.
- **Con:** 2x the design surface. Easy to get inconsistent.
- **When this wins:** If you're going to send a LOT of PDFs to clients who don't read in dark mode.

---

## Dark vs light foundation

### Stay dark (current)
- Differentiates from agency / consultancy default (which is white/light).
- Feels "after-hours operator," "behind-the-scenes."
- Harder for printed handouts.
- Harder for screenshots in client presentations (they paste into white-background PPTs).

### Move to light
- Looks more like a standard B2B services brand. Closer to a Bain / McKinsey / Stripe expectation.
- Easier to extend to print + screenshots.
- Loses the "operator who lives in the terminal" vibe.

### Adaptive (both)
- Build everything with CSS custom properties so dark/light swaps via a class on body.
- Costs time. Gives flexibility.
- Recommendation: only do this if you've committed to a real brand reboot.

---

## Density rhythm

The deck currently uses tight density: 14-16px card padding, 12-14px gap, 28px container padding. This reads as "every pixel earns its keep."

Alternatives:
- **Loosen 30%:** 18-20px card padding, 16-18px gap, 36px container padding. Feels more premium, less "I'm trying to cram value in." Less operator-Riley, more design-house.
- **Tighten 20%:** 12px card padding, 10px gap. Feels more like a data tool. Could fit if you commit to a builder/operator identity hard.
- **Variable rhythm:** Tight on data-dense slides (Delta table, hex flower). Loose on narrative slides (hero, executive summary). Best of both. Hardest to maintain.

---

## Recommendation framework (NOT a recommendation — pick yourself)

Answer these three questions in order:

**Q1. What's the dominant client archetype next 12 months?**
- (a) Operator running physical / operational business (concrete, RE, auto, trades) → palette/typography should match THEIR world, not yours
- (b) Operator running software / tech business → current cyan-dark vibe is correct
- (c) Mixed → adaptive system or single-signature recognition wins

**Q2. What's the wedge you sell on?**
- (a) "I am the operator inside the room" → type/visual should disappear. System fonts + tight palette = correct.
- (b) "I am the calm software-grade lens you buy access to" → current direction is correct.
- (c) "I am the writer-operator with editorial polish" → serif + earth tones / Recoleta + Editorial New direction.

**Q3. What do you commit to deliver next 12 months?**
- Mostly digital owned media (your web, your courses, your video) → dark is fine.
- Mostly client deliverables they share with their board (decks, handouts, PDFs) → light or adaptive is the right answer.
- Mostly internal ops / dashboards → dark + monospace accents win.

---

## What I'd suggest you NOT do

- Don't change typography AND palette AND foundation at the same time. Pick one axis, test it on one new project, then extend.
- Don't go on Dribbble / Behance for "inspiration." You'll end up with an off-brand version of someone else's brand. Stay in your own writing voice when you redesign — what the writing SOUNDS like is what the visual should LOOK like.
- Don't reboot before Friday. The deck is operator-grade. Lee will not say "your color palette is wrong." He will say "I have not seen anyone deliver this thinking outside-in before." Win Friday. Reboot after.

---

## Open questions for Mike

1. What 3-5 existing brands do you think you SHOULD feel like? (Not on-screen visual, the underlying vibe.)
2. Have you gotten feedback from any prior client that the brand felt OFF? Or is this an internal feeling?
3. If you were starting from a blank page TODAY with the same operator-wedge positioning, would you still build a dark-mode cyan-dominant brand?
4. How much budget (time + dollars) are you willing to put against a brand recheck?

Park the answers here when you have them. We can then move from menu to commit.

---

**Related memory:**
- [[user_mike_brand_voice]] — direct/no-fluff, "systems that survive contact with reality"
- [[feedback_brand_palette_discipline]] — 2-3 colors max per visual
- [[feedback_visual_density_over_text_density]] — visualization-first
- [[feedback_inn_native_cyan_primary]] — current cyan-primary rule
- [[user_classic_cars]] — auto analogies system
- [[jobhunt_positioning]] — Director of Marketing positioning

**Status:** Draft for Mike review post-Friday 2026-06-05.
