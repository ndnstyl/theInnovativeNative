# Pixel (Visual Graphic Artist) Learnings

## Agent Profile
- **Role**: Visual Graphic Artist
- **Level**: 2 (Worker)
- **Reports To**: Drew (Project Manager)
- **Team**: Marketing

---

## Creative Design Learnings

### Ad Creative Principles

1. **Pattern Interrupt Images**
   - Unusual, unexpected visuals stop the scroll
   - Faces with strong emotions work best
   - Red circles and arrows highlight key elements
   - Primary + secondary images increase intrigue
   - Source: Sabri Suby Tutorial

2. **Don't Look Like Ads**
   - Native, user-generated feel
   - Avoid stock photo aesthetic
   - iPhone photos often outperform professional shots
   - Source: Sabri Suby Tutorial

3. **Dual Image Format**
   - Large primary image + smaller secondary
   - Used by Lad Bible, E-News, TMZ
   - Forces brain to comprehend two things = stops scroll
   - Source: FB Ads analysis

### Thumbnail Design

1. **YouTube Thumbnails**
   - Faces with emotion (10-20% CTR lift)
   - High contrast colors
   - 3-5 words maximum
   - Bright colors (yellow, red, orange)
   - Create curiosity gap

2. **Video Ad Thumbnails**
   - Same principles as YouTube
   - Test multiple variants
   - Avoid text clutter

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

### Google Display
- Provide multiple sizes (300x250, 728x90, etc.)
- Responsive display ads need both square and landscape
- Less than 20% text recommended

---

## Color & Design Learnings

*Add learnings about color combinations, fonts, etc.*

---

## Tool & Workflow Learnings

*Add learnings about design tools, templates, etc.*

---

## A/B Test Results

### Test Template

**Test Name**: [Name]
**Date**: [Date]
**Platform**: [Platform]
**Variable Tested**: [Color/layout/style]
**Winner**: [A or B]
**CTR Lift**: [% improvement]
**Learning**: [What this teaches us]

---

## Mistakes to Avoid

1. **Don't use tiny text** - 80%+ on mobile can't read small text
2. **Don't clutter** - Simple designs win
3. **Don't ignore safe zones** - UI covers content on Stories
4. **Don't forget brand consistency** - Maintain recognizable style
5. **Don't skip mobile preview** - Always check mobile view
6. **Don't overdo glow effects** - Keep `stdDeviation` at 4-6 max. NEVER double the blur by merging two `coloredBlur` nodes. Text should always be readable. (See 2026-02-06 carousel fix)

---

## Asset Templates Created

*Track reusable templates here*

| Template Name | Platform | Dimensions | Use Case |
|---------------|----------|-----------|----------|
| fb-ad-cerebro-problem | Facebook | 1080x1080 | Problem angle ad |
| fb-ad-cerebro-roi | Facebook | 1080x1080 | ROI/math angle ad |
| fb-ad-cerebro-authority | Facebook | 1080x1080 | Authority hierarchy ad |
| fb-ad-cerebro-scarcity | Facebook | 1080x1080 | Scarcity/CTA ad |

### Session Log (2026-02-05)

**Task**: T006 - Create Facebook Ad Images (4 Variants)
**Campaign**: Cerebro February 2026 (Law Firm RAG)

**Files Created**:
1. `fb-ad-cerebro-problem-v1-20260205.svg` - Warning icon + "Stop Verifying AI Hallucinations"
2. `fb-ad-cerebro-roi-v1-20260205.svg` - $40K math breakdown
3. `fb-ad-cerebro-authority-v1-20260205.svg` - Legal hierarchy pyramid (SCOTUS > Circuit > District)
4. `fb-ad-cerebro-scarcity-v1-20260205.svg` - "3 Pilot Slots Left" with progress bar

**Design Decisions**:
- Used 1080x1080 square format (primary for Facebook feed)
- Maintained TIN brand system: dark (#0A0A14), cyan (#00FFFF), Playfair + Inter fonts
- Each variant has distinct visual hook matching ad copy angle
- Consistent CTA button placement at bottom
- Grid texture + neon glow effects for retro-futurist aesthetic

**Learnings**:
- SVG filters (feGaussianBlur, feMerge) create effective glow effects
- Authority pyramid visualization effectively communicates legal hierarchy concept
- Progress bar (7/10 filled) creates visual scarcity signal

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

## References

- Platform Specs: `.claude/skills/marketing/platforms/`
- Brand System: `.claude/skills/pptx-generator/brands/innovative-native/brand-system.md`
- FB Ads Playbook: `.claude/skills/marketing/learnings.md`
- Creative SOP: `.claude/skills/marketing/sops/creative-production.md`
