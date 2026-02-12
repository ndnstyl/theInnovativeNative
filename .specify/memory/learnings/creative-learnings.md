# Creative - Visual & Content Production Learnings

## Last Updated: 2026-02-06

*Consolidated from Spike (Remotion), Pixel (Graphics), and Maya (Ideation)*

---

## Critical Mistakes (NEVER REPEAT)

### Graphics
- Don't use tiny text - 80%+ on mobile can't read small text
- Don't clutter - Simple designs win
- Don't ignore safe zones - UI covers content on Stories
- Don't forget brand consistency - Maintain recognizable style
- Don't skip mobile preview - Always check mobile view
- Don't overdo glow effects - Keep `stdDeviation` at 4-6 max. NEVER double the blur. Text should always be readable.

### Video
- No mistakes recorded yet

---

## Domain Patterns

### Video (Remotion)
- **Compositions**: Plan duration and transitions before coding
- **Assets**: Verify all assets load before full render
- **Exports**: Test with short segments before full export

### Graphics
- **Ad Creative Principles**:
  1. Pattern Interrupt - unusual, unexpected visuals
  2. Don't Look Like Ads - native, user-generated feel
  3. Dual Image Format - large primary + smaller secondary

- **Thumbnail Design**:
  1. Faces with emotion (10-20% CTR lift)
  2. High contrast colors
  3. 3-5 words maximum
  4. Bright colors (yellow, red, orange)
  5. Create curiosity gap

### Ideation
- **Ideation**: Generate quantity first, filter for quality second
- **Research**: Verify trending topics with multiple sources
- **Content Calendar**: Balance content types across the week
- **Competitive Research**: Prioritize verified review sites over social media

---

## Quick Reference

### Video
- KPIs: 3+ videos/week, 100% export success
- Exports: H.264 codec (REQUIRED), AAC audio, yuv420p pixel format

### Graphics
- KPIs: 15+ assets/week, 95%+ brand compliance

### Ideation
- KPIs: 10+ ideas/week, 30% ideas approved

---

## Platform-Specific Learnings

### Facebook/Instagram
- Square (1080x1080) works well for feed
- Portrait (1080x1350) takes more screen space
- Stories/Reels require 1080x1920 (9:16)
- Keep important content away from edges (14% safe zone)

### LinkedIn
- Professional but not boring
- Faces still work
- 1200x627 for single image ads
- 1080x1080 for carousel cards

### YouTube
- Thumbnails must be 1280x720 minimum
- Consistent branding across videos
- Bright backgrounds stand out

### Video Export Settings
| Platform | Resolution | Max Size | Aspect | Codec |
|----------|-----------|----------|--------|-------|
| YouTube | 1920x1080 | 128GB | 16:9 | H.264 |
| LinkedIn | 1920x1080 | 200MB | 16:9/1:1 | H.264 |
| Instagram | 1080x1920 | 100MB | 9:16 | H.264 |
| TikTok | 1080x1920 | 287MB | 9:16 | H.264 |

---

## Competitive Intelligence (Legal Tech)

### Source Priority
1. **Above the Law** (comments) - Candid attorney opinions, highest value
2. **G2/Capterra** - Verified user reviews, structured feedback
3. **Legal IT Insider / Artificial Lawyer** - Industry analysis
4. **Reddit** (r/lawyers, r/biglaw) - Anonymous but mixed quality
5. **LinkedIn** - LOW VALUE for candid feedback, avoid over-reliance

### Pain Point Categories
- ACCURACY: Hallucinations, wrong citations
- COST: Too expensive, hidden fees
- INTEGRATION: Doesn't work with existing tools
- USABILITY: Hard to learn, confusing UI
- SUPPORT: Bad customer service

### Legal Tech Competitor Differentiation
- **Harvey AI**: ChatGPT wrapper, issues = hallucinations, generic outputs
- **Lexis+ AI**: Ecosystem lock-in, cost, predatory contracts
- **Westlaw Precision**: Higher hallucination rate (33% vs Lexis 17%)

---

## Reddit JSON API Workaround (When WebSearch blocked)
```bash
curl -s "https://www.reddit.com/r/LawFirm/search.json?q=lexis&restrict_sr=1&sort=relevance&limit=25" \
  -H "User-Agent: Mozilla/5.0 (compatible; research bot)"
```

Key subreddits for legal tech:
- r/LawFirm - Solo/small firm (BEST for mid-market research)
- r/biglaw - BigLaw associates
- r/Lawyertalk - General lawyer discussion

---

## Asset Templates Created

| Template Name | Platform | Dimensions | Use Case |
|---------------|----------|-----------|----------|
| fb-ad-cerebro-problem | Facebook | 1080x1080 | Problem angle ad |
| fb-ad-cerebro-roi | Facebook | 1080x1080 | ROI/math angle ad |
| fb-ad-cerebro-authority | Facebook | 1080x1080 | Authority hierarchy ad |
| fb-ad-cerebro-scarcity | Facebook | 1080x1080 | Scarcity/CTA ad |

---

## Session: Cerebro Legal RAG Frontend (2026-02-06)

### Components Created
Full component structure for Cerebro Legal RAG interface at:
`websiteStuff/src/components/cerebro/`

### Patterns Applied
1. Inline Styles for Portability
2. No External UUID Dependency
3. Accessible Components (aria-labels, keyboard navigation)
4. Citation Highlighting (click citation -> scroll to result)

### Color System (from spec)
```css
--cerebro-primary: #1a365d;
--cerebro-secondary: #2b6cb0;
--cerebro-accent: #d69e2e;
```

---

## Style Guidelines Summary

### Ad Creatives
- Native feel over polished
- Emotion over perfection
- Curiosity over clarity
- Mobile first

### Thumbnails
- Faces + text + bright colors
- High contrast
- Consistent branding
- Curiosity gap

### Social Posts
- Platform-appropriate sizing
- Brand colors
- Readable typography
- Strong visual hierarchy

---

## Session: Tyrone Voice Authenticity — TTS + AAVE (2026-02-11)

### TTS Engine Comparison (BowTie Bullies)

| Engine | Quality | Use Case | Notes |
|--------|---------|----------|-------|
| ElevenLabs | Production-grade | Final audio | Fuller sound, better articulation |
| Qwen3-TTS (local) | Draft-grade | Prototyping | Robotic, pronunciation issues (e.g., "lien" → "lee-enn") |

**Winner**: ElevenLabs for production. Qwen3 for rapid script iteration.

### AAVE Orthography for TTS (REUSABLE — ALL VOICE PROJECTS)

- **Problem**: TTS engines over-enunciate when scripts use standard English orthography
- **Solution**: Spell words the way the character says them — make the writing do the heavy lifting
- **Impact**: Both ElevenLabs and Qwen3 improved with AAVE scripts
- **Target density**: ~65% AAVE (Tyrone is measured, not loose)
- **Full rules**: `deliverables/004-faceless-ai-brand/tyrone-voice-guide.md` → "AAVE Writing Rules" section

### Qwen3-TTS Voice Cloning Deep Dive

- **Architecture**: Two parallel paths — Speaker Encoder (ECAPA-TDNN x-vector) + ICL (In-Context Learning) codec tokens
- **Longer reference = better clone**: Never trim reference audio. Speaker encoder benefits from more statistical context
- **ICL auto-overrides repetition_penalty**: Sets minimum 1.5 regardless of what you pass
- **Full transcript matching**: Provide exact transcript of reference audio for best ICL quality
- **Model**: `Qwen3-TTS-12Hz-1.7B-Base-8bit` via mlx_audio on Apple Silicon
- **Best params**: temp=0.80, top_p=0.92, top_k=60, rep_penalty=1.35 (moderate set)

### Qwen3-TTS Parameter Reference (Archived from qwen3/ CLI)

**A/B Test Matrix** (3 segments x 3 params = 9 files):
| Set | temp | top_p | top_k | rep_penalty | Use Case |
|-----|------|-------|-------|-------------|----------|
| Conservative | 0.72 | 0.91 | 55 | 1.45 | Measured, deliberate lines |
| Moderate | 0.80 | 0.92 | 60 | 1.35 | Default / balanced |
| Expressive | 0.87 | 0.93 | 65 | 1.30 | Emotional, dynamic lines |

**AAVE Segment Architecture** (from tyrone_origin_story.py):
- 18 segments with custom inter-segment pauses (600-2000ms)
- Pause timing by emotional weight: anchor lines get 2000ms, transitions get 600ms
- Full reference transcript improves ICL clone quality
- Silence WAVs generated programmatically, stitched via FFMPEG concat demuxer

### Skills Gap
- No gap — both engines tested end-to-end, AAVE writing rules documented

---

## Session: ComfyUI TTS Integration for BowTie Bullies (2026-02-11)

### Dual TTS Strategy
- **ElevenLabs**: Tyrone only (production narrator voice, non-negotiable quality)
- **Qwen3-TTS via ComfyUI**: Supporting characters / multi-dialogue episodes (saves credits)
- ComfyUI spun up on-demand locally, n8n triggers via API

### ComfyUI-Qwen-TTS Node Reference
| Node | Use Case |
|------|----------|
| VoiceDesignNode | Create character voices from text descriptions |
| VoiceCloneNode | Clone from 5-15s reference audio |
| CustomVoiceNode | Preset speakers (Aiden, Serena, etc.) |
| RoleBankNode | Register up to 8 named character voices |
| DialogueInferenceNode | Multi-role dialogue from script with role tags |
| SaveVoiceNode | Persist voice profiles for reuse |
| LoadSpeakerNode | Load saved voice profiles |

### n8n Connection Architecture
- ComfyUI local (Mac M4 Pro) → cloudflared tunnel → n8n (Hostinger cloud)
- Export workflow as API JSON (Workflow > Export API)
- n8n triggers via POST /prompt with API JSON payload
- WF-B03 branching: character == "Tyrone" → ElevenLabs, else → ComfyUI

---

## Session: BowTie Bullies Remotion Module (2026-02-11)

### Architecture Pattern: Multi-Brand Remotion Project
- Existing Cerebro project uses `src/Cerebro/` folder structure
- Added `src/BowTie/` as parallel brand module — same Root.tsx, different Folder
- Use Remotion `<Folder>` to namespace compositions per brand
- Each brand gets its own: styles/, components/, compositions/, assets/
- Theme file exports `as const` for type safety on all color/animation values

### Component Design Patterns
- **FilmGrainOverlay**: SVG feTurbulence with per-frame seed changes is GPU-efficient for grain. Better than canvas noise generation.
- **ParticleField/QuestionMarks**: Use seeded PRNG for deterministic particles — same visual every render. Avoids flicker between render passes.
- **TypewriterText**: Keep as inline component in composition files (not separate) when tightly coupled to frame timing.
- **GlowTrace**: SVG path drawing with partial segment calculation handles arbitrary polyline paths.

### Composition Patterns
- IntroSequence/OutroSequence accept `variant` prop ('longform'|'shorts') — single component renders both aspect ratios
- Props for image/audio paths allow placeholder renders without assets
- Frame-accurate timing from spec: use `interpolate()` with frame numbers directly, not seconds

### Render Pipeline
- Build scripts in package.json for both H.264 delivery and ProRes 4444 compositing
- render.ts is documentation + config export, not executable script (Remotion CLI handles actual render)

### Blockers Identified
- T008 (music): Need royalty-free tracks sourced externally — cannot be generated by agent
- T009/T010 (intro/outro video): Need AI-generated Red Nose character images (P5, P4 silhouette) and audio stingers
- All compositions render without assets (dark placeholder) — no crashes on missing images

### Skills Gap
- No gap for Remotion component creation
- Gap: Cannot generate Red Nose character images or audio stingers (requires Gemini Imagen / Midjourney / DAW)

---

## References
- Platform Specs: `.claude/skills/marketing/platforms/`
- Brand System: `.claude/skills/pptx-generator/brands/innovative-native/brand-system.md`
- Deliverable Format SOP: `.specify/sops/deliverable-format-requirements.md`
- BowTie Bullies Voice Guide: `deliverables/004-faceless-ai-brand/tyrone-voice-guide.md`
- BowTie Bullies Brand System: `.claude/skills/pptx-generator/brands/bowtie-bullies/`
