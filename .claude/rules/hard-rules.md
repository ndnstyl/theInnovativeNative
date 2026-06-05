---
paths:
  - "**/004-*/**"
  - "**/reels-production/**"
  - "**/bowtie*/**"
description: BowTie Bullies image generation constraints — never violated
---

# Hard Rules — Image Generation

1. **NEVER include "Red Nose Pitbull", "Pitbull", "Tyrone", or ANY character reference in text-to-image prompts.** The main character is ALWAYS composited from pre-made canonical PNG assets. Text-to-image (Gemini) NEVER generates the character. Every prompt function MUST strip character references. Violated 3+ times — #1 priority rule.

2. **NEVER include "vignette" in any text-to-image prompt.** Vignette is trivial to add in Premiere Pro but extremely hard to remove. Post-production only.

3. **NEVER include style directives (cel-shaded, film grain, palette) in pipeline visual_prompt fields.** Style is assembled from structured slots in scene-prep. Pipeline prompts describe STORY CONTENT only.
