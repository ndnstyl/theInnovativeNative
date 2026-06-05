# Judgment Calls — locked decisions so we don't re-debate

These defaults apply to every explainer unless a brief overrides. Purpose: autonomous production — no asking.

## Content decisions

| Decision | Default | Why |
|----------|---------|-----|
| Heppner ruling in Cerebro marketing | Named explicitly ("US v. Heppner, SDNY Feb 2026") | Per memory directive; attorneys respect case citations |
| Competitor naming (Harvey, ChatGPT, Westlaw) | DO NOT name | Defensive lawyer response; Heppner is enough sword |
| Proof element (no testimonials yet) | Compensate with architecture clarity + explicit "100% citation integrity" claim | Don't fake social proof |
| Practice area in Cerebro explainer | General but with ONE concrete scenario (associate pasting affidavit into ChatGPT) | Anchors abstract concepts without narrowing ICP |
| Price disclosure | Yes, state it plainly ($2,500 + $500/mo) | Filters out non-serious buyers; differentiates from Harvey's opaque enterprise pricing |

## Structural decisions

| Decision | Default |
|----------|---------|
| Video length | 60-90s (sweet spot: 85s) |
| VO pacing | ~2.2 words/sec at Kal Jones natural cadence |
| Aspect ratio primary | 1:1 (IG reels/Instagram feed) |
| Aspect ratio derivative | 16:9 rendered from same storyboard (site/LinkedIn) |
| Caption overlay | ALWAYS on (accessibility + silent autoplay) |
| Caption font | TIN cyan keyword highlight, otherwise white |
| Intro card | 2s — TIN logo + problem/hook text |
| Outro card | 3s — CTA URL + "the innovative native" lockup |

## Audio decisions

| Decision | Default |
|----------|---------|
| VO voice | ElevenLabs Kal Jones `68RUZBDjLe2YBQvv8zFx` |
| Music selection | Pixabay "corporate/tech subtle" tagged, 60-100 BPM, no vocals |
| Music level | -18 dB under VO (ducked) |
| SFX | Subtle whoosh on icon swaps, one success ding at CTA card |

## Visual decisions

| Decision | Default |
|----------|---------|
| Icon source priority | 1) `remotion-videos/iconSet/techsy/` 2) `3d-icon-forge/library/` 3) bake new |
| Animation on icon swap | Scale-in with spring (200ms), slight Y-wobble on settle |
| Background | Dark gradient (#0A1628 → #05080F), matches TIN web aesthetic |
| Magenta accent | ONCE per video max, on CTA moment only |

## Publishing decisions

| Decision | Default |
|----------|---------|
| First-publish channel | LinkedIn (attorneys live there) for Cerebro; IG for courses |
| Always-publish channels | Site embed + Airtable Publishing Calendar row |
| Cross-post | 1h stagger to avoid dup-spam flagging |
| Post caption | Auto-generated from script first 2 beats + CTA URL |
| CTA link | Landing page (not direct Calendly) for buffer + retargeting |

## When to override

Override in `output/<slug>/brief.md` under a `## Overrides` section. Document WHY so future content inherits the pattern if it works.
