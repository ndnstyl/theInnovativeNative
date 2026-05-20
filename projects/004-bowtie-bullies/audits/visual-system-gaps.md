# BOWTIE BULLIES — THE AFTERMATH | Visual Design System Audit

## Gap Analysis Report
**Auditor:** Visual Design System Auditor
**Date:** 2026-02-10
**Documents Reviewed:**
- `visual-style-guide.md` (707 lines)
- `brand-blueprint.md` (1645 lines)
- `tyrone-voice-guide.md` (346 lines)
- `episodes.md` (385 lines)
- `cinema_knowledge/` (3 reference docs + 4 generated images)

---

## EXECUTIVE SUMMARY

The BowTie Bullies visual design system is substantially built out for a pre-launch brand. The color palette, typography hierarchy, thumbnail system, Red Nose character specs, and on-screen graphics are all documented with unusual depth. However, the system has **23 identified gaps** across 20 audit domains that will create friction during a 30-day production sprint. The most critical gaps center on: (1) no validated reference images for Red Nose exist yet, (2) the FFMPEG color grade pipeline has an internal color inconsistency, (3) the B-roll prompt library is insufficient for 30 days of content, (4) there are no intro/outro frame-by-frame specs, and (5) zero template files exist for any design tool.

**Gap Severity Distribution:**
| Severity | Count | Percentage |
|----------|-------|------------|
| CRITICAL | 5 | 22% |
| HIGH | 8 | 35% |
| MEDIUM | 7 | 30% |
| LOW | 3 | 13% |
| **TOTAL** | **23** | 100% |

---

## SUMMARY TABLE — ALL GAPS

| # | Domain | Gap | Severity | Impacted Workflows |
|---|--------|-----|----------|--------------------|
| 1 | Color Palette | No data visualization palette (charts, graphs) | MEDIUM | Content with stats, data-heavy episodes |
| 2 | Color Palette | No dark mode / light mode variant defined | LOW | Future web presence, merch mock-ups |
| 3 | Color Palette | Amber (#D4A03C) appears in FFMPEG assembler but is NOT in the palette | CRITICAL | FFMPEG assembly, color consistency |
| 4 | Typography | No font sizes defined for IG Stories, community posts, or merch | HIGH | IG workflow, community posts, merch pipeline |
| 5 | Typography | No fallback font stack specified (web-safe alternatives) | MEDIUM | Web presence, platforms that lack Bangers/Montserrat |
| 6 | Typography | Caption font sizes only defined for shorts; no 16:9 subtitle burn-in spec | HIGH | Long-form captioned exports (accessibility) |
| 7 | AI Prompt Library | Only 13 B-roll prompts for a 30-day sprint needing 80-160 visuals | CRITICAL | Visual generation pipeline (WF-04) |
| 8 | AI Prompt Library | Prompts are not tagged by episode theme or content pillar | HIGH | Shot list generation, visual mapping |
| 9 | Red Nose Consistency | Zero validated reference images exist (checklist is unchecked) | CRITICAL | Every visual output, every thumbnail |
| 10 | Red Nose Consistency | P3 and P6 pose prompts are missing from brand-blueprint.md | HIGH | Companion/product thumbnails, Aftermath identity shots |
| 11 | Red Nose Consistency | No 9:16 variant prompts for any pose | HIGH | All shorts/reels featuring Red Nose |
| 12 | Negative Prompts | Missing "human face" from brand-blueprint.md negative prompt (present in style guide) | MEDIUM | Character generation consistency |
| 13 | Negative Prompts | No negative prompts for environment/B-roll generation | MEDIUM | Urban texture and tech visualization shots |
| 14 | Pose Library | No pose transition specs (how to animate between poses) | MEDIUM | Video clips featuring Red Nose movement |
| 15 | Thumbnail System | No series-specific thumbnail variant (season branding) | MEDIUM | Season 1/2/3 visual differentiation |
| 16 | On-Screen Graphics | No 9:16 dimensions or positions specified for lower thirds, stat callouts, or data overlays | HIGH | All shorts/reels with graphics |
| 17 | On-Screen Graphics | No animation specs beyond slide/fade (no easing curves, no keyframe data) | MEDIUM | Motion graphics implementation |
| 18 | Color Grading | FFMPEG filter is not validated against actual footage; no LUT file provided | HIGH | Post-production color consistency |
| 19 | Intro/Outro Sequence | No frame-by-frame spec, no stinger/audio cue, no duration defined | CRITICAL | Every video open and close |
| 20 | Channel Art | Banner and profile pic referenced but no export specs (dimensions, safe zones, file size) | HIGH | Channel launch (Day 1-7) |
| 21 | IG-Specific Adaptations | No highlight cover designs, no grid layout strategy, no Stories template | HIGH | IG content pipeline |
| 22 | Accessibility | No WCAG contrast ratios calculated, no minimum caption size, no colorblind consideration | MEDIUM | All published content, platform compliance |
| 23 | Template Files | Zero Canva, Photoshop, Figma, or After Effects templates exist | CRITICAL | Entire design production pipeline |

---

## DETAILED ANALYSIS

---

### 1. COLOR PALETTE COMPLETENESS

**What Exists:**
- 5 core colors (Dark Steel, Rust Orange, Earth Clay, Ash Gray, Bone White)
- 5 extended colors (Burnt Umber, Copper, Gunmetal, Deep Red, Moss)
- 6 color usage rules
- Clear "no neon, no saturation" constraint

**Gaps Identified:**

#### Gap 1.1: No Data Visualization Palette
**Severity:** MEDIUM
**Impact:** Episodes like "Count Up That Loot" (EP 18), "Xxplosive" (EP 05), and any stat-heavy content will need charts, graphs, timelines, and comparison visuals. The current 10-color palette does not define which colors map to data categories (e.g., "good vs. bad," "before vs. after," "us vs. them").

**Recommendation:** Define a 4-6 color data viz sub-palette derived from existing colors:
- Positive/survival: Moss (#5A7A5A)
- Negative/threat: Deep Red (#8B1A1A)
- Neutral/context: Ash Gray (#4A4A4A)
- Primary data: Rust Orange (#9A4C22)
- Secondary data: Copper (#C4713B)
- Background grid: Gunmetal (#2C2C30)

#### Gap 1.2: No Light Mode Variant
**Severity:** LOW
**Impact:** Minimal for video content. Becomes relevant if/when the brand extends to web, Stan Store presence, or print merch where dark backgrounds are impractical.

**Recommendation:** Define a reversed palette for print/web contexts. Bone White becomes background; Dark Steel becomes text. Document when each mode is appropriate.

#### Gap 1.3: Amber (#D4A03C) Color Inconsistency
**Severity:** CRITICAL
**Impact:** In `brand-blueprint.md` Part 6, the FFMPEG Assembler spec (WF-05) references "Amber (#D4A03C) accent on text backgrounds." This color does NOT exist anywhere in the defined palette. It contradicts the established system where Rust Orange (#9A4C22) is the sole accent. This will produce visually inconsistent content if the FFMPEG workflow uses Amber while thumbnails and graphics use Rust Orange.

**Recommendation:** Remove the Amber reference from WF-05 and replace with Rust Orange (#9A4C22) or Earth Clay (#7E6551). This is likely a holdover from an earlier draft or a different brand system. Must be corrected before the FFMPEG assembler is built.

---

### 2. TYPOGRAPHY HIERARCHY

**What Exists:**
- 3-tier font system (Primary / Secondary / Fallback)
- Specific font recommendations (Bangers, Montserrat, Anton)
- Size hierarchy table for video overlays (6 elements defined)
- Shorts/Reels caption style with sizes
- Hook text style with sizes

**Gaps Identified:**

#### Gap 2.1: No Font Sizes for IG Stories, Community Posts, or Merch
**Severity:** HIGH
**Impact:** The content calendar includes Thursday community posts (IG Stories + YouTube Community). There are no typography specs for these formats. Merch is referenced in the roadmap but has zero type specs.

**Recommendation:** Add typography rows for:
| Element | Size | Font | Platform |
|---------|------|------|----------|
| IG Story Text | 40-56px | Bangers | IG Stories (1080x1920) |
| IG Story Caption | 28-36px | Montserrat | IG Stories |
| Community Post Header | 48-64px | Bangers | YouTube Community |
| Community Post Body | 24-32px | Montserrat | YouTube Community |
| Merch Primary | Scalable vector | Bangers | T-shirts, prints |
| Merch Secondary | Scalable vector | Montserrat | Tags, secondary merch text |

#### Gap 2.2: No Fallback Font Stack
**Severity:** MEDIUM
**Impact:** If Bangers or Montserrat are unavailable in a given tool or platform, there is no documented fallback. This leads to ad-hoc substitutions that break visual consistency.

**Recommendation:** Define fallback stacks:
- Bangers -> Anton -> Impact -> Condensed sans-serif system font
- Montserrat -> Arial -> Helvetica Neue -> sans-serif system font
- Anton -> Impact -> Oswald -> Condensed sans-serif system font

#### Gap 2.3: No 16:9 Subtitle/Caption Burn-in Spec
**Severity:** HIGH
**Impact:** Long-form videos need accessible captions. The style guide defines caption specs for 9:16 shorts but not for 16:9 long-form. Since 80% of viewers watch with captions, this is a production blocker for accessible long-form content.

**Recommendation:** Add 16:9 caption spec:
| Element | Value |
|---------|-------|
| Font | Montserrat, 36-44px |
| Color | #E7E7E1 with 3px dark shadow |
| Position | Bottom center, 80px from bottom edge |
| Background | Optional #1E1E20 @ 50% pill |
| Max characters per line | 42 |
| Max lines visible | 2 |

---

### 3. AI GENERATION PROMPT LIBRARY

**What Exists:**
- 4 Red Nose in-context prompts
- 5 urban texture prompts (no Red Nose)
- 4 tech/AI visualization prompts
- Total: 13 B-roll prompts
- 1 primary character prompt (P1 The Watch)
- 3 additional pose prompts (P2, P4, P5)

**Gaps Identified:**

#### Gap 3.1: 13 B-Roll Prompts Insufficient for 30-Day Sprint
**Severity:** CRITICAL
**Impact:** The production pipeline calls for 40% AI-generated imagery per video. With 4 long-form videos per month, each needing 15-25 visual shots, that is 60-100 AI-generated images per month minimum. Additionally, shorts need unique visuals. Total estimated need: 80-160 unique AI-generated visuals for Month 1. The current library of 13 prompts will produce repetitive, recognizable content by Week 2.

**Recommendation:** Expand the prompt library to a minimum of 50 prompts, organized by:
- **Character shots** (Red Nose in context): Expand from 4 to 12 (one per episode theme from Season 1)
- **Urban textures**: Expand from 5 to 15 (add: project hallways, bodega interiors, corner store fluorescents, basketball court at night, overpass shadows, laundromat, bus stop, pawn shop window, empty parking lot, barbershop interior)
- **Tech/AI visualizations**: Expand from 4 to 12 (add: algorithm decision trees in rust, facial recognition grid overlay, data stream flowing through city streets, phone screen glow in dark room, AI model training visualization, digital redlining map, autonomous vehicle POV, social media feed cascade)
- **Hands/POV shots**: Add 6 new (currently 1 in library: hands writing in journal. Add: hands on phone screen, hands counting cash, hands adjusting radio dial, hands stripping wire, hands opening Faraday bag, hands on keyboard in dark room)
- **Weather/atmosphere**: Add 5 (rain on chain-link, fog through project courtyard, steam from manhole, condensation on window, frost on fire escape)

#### Gap 3.2: Prompts Not Tagged by Episode Theme
**Severity:** HIGH
**Impact:** The WF-04 Visual Generator workflow needs to map script sections to visual types. Without episode-level tagging, the "Code Node: Generate Visual Shot List" step has no structured way to select appropriate prompts per topic.

**Recommendation:** Add metadata to each prompt:
```
Prompt ID: BROLL-URBAN-05
Category: Urban Texture
Episode Tags: EP03-The Watcher, EP06-Crenshaw, EP15-No Pressure
Content Pillar: AI & The System
Mood: Tension, Surveillance
Aspect Ratios: 16:9, 9:16
```

---

### 4. RED NOSE CHARACTER CONSISTENCY

**What Exists:**
- Detailed canonical physical description (breed, coat, nose, eyes, build, ears, expression, age, distinguishing mark)
- Bowtie specification (style, color, material, fit, position)
- Consistency markers block for prompt inclusion
- Negative prompt
- 6-pose library with descriptions and use cases
- 4 reference image generation checklist (unchecked)
- Full prompts for P1, P2, P4, P5

**Gaps Identified:**

#### Gap 4.1: Zero Validated Reference Images Exist
**Severity:** CRITICAL
**Impact:** This is the single most critical gap. The entire brand identity depends on Red Nose being visually consistent across every thumbnail, intro, outro, short, and reel. Without validated reference images, every AI generation session starts from zero with no anchor. Cross-session consistency will be impossible. The cinema_knowledge directory contains 4 images of a woman (from a different project, likely Haven), but zero Red Nose images.

**Recommendation:** Before any content production begins:
1. Generate the 4 reference images specified in the checklist (front face, 3/4 profile, full body, silhouette)
2. Generate them using multiple tools (Gemini, Midjourney, DALL-E) and select the most consistent set
3. Store in `cinema_knowledge/bowtie-bullies/` as specified
4. Use the winning reference images as input/guidance for all subsequent generations
5. Test consistency by generating 10 additional images using the reference and verifying visual coherence
6. Document which AI tool produced the best results and make it the primary generator

#### Gap 4.2: P3 (The Companion) and P6 (The Aftermath) Prompts Missing
**Severity:** HIGH
**Impact:** P3 is used for 10% of thumbnails (product/affiliate content) and the Saturday product features. P6 is the series identity pose used for banners, merch, and season recap episodes (EP 08, EP 22). Both are referenced in the pose library table but have no generation prompts written out. The brand-blueprint.md provides prompts for P1, P2, P4, and P5 only.

**Recommendation:** Write full generation prompts for P3 and P6:

**P3 — The Companion (draft):**
```
"Photorealistic American Red Nose Pitbull, [full consistency markers].
Lying on concrete floor beside [PRODUCT/OBJECT], one paw extended
near the object. Relaxed but eyes open and alert. 3/4 angle from above.
Single dramatic light from upper right. Dark steel background.
The object and the dog share the light. Shallow depth of field.
Film grain. Cinematic. 16:9. No text."
```

**P6 — The Aftermath (draft):**
```
"Photorealistic American Red Nose Pitbull, [full consistency markers].
Walking mid-stride through empty urban street at night. Bowtie
visible. Shot from low angle, slightly behind. Sodium vapor
streetlights creating long shadows. Cracked asphalt, abandoned
storefronts. Fog. Determined, purposeful stride. Not running.
Walking. Film grain. High contrast. Cinematic. 16:9. No text."
```

#### Gap 4.3: No 9:16 Variant Prompts for Any Pose
**Severity:** HIGH
**Impact:** All 6 pose prompts specify "16:9 widescreen." Shorts and reels need 9:16 compositions. Simply cropping 16:9 images will cut off the bowtie, body, or context elements. Each pose needs a 9:16 composition variant where the subject is framed vertically.

**Recommendation:** Create a 9:16 variant block for each pose that adjusts:
- Composition (vertical framing, tighter crop)
- Subject placement (center or upper third)
- Background context (less horizontal environment, more vertical elements like buildings, lampposts, doorways)
- Aspect ratio declaration in prompt ("9:16 portrait orientation")

---

### 5. NEGATIVE PROMPT COMPLETENESS

**What Exists:**
- Character negative prompt in visual-style-guide.md (includes "human face")
- Character negative prompt in brand-blueprint.md (does NOT include "human face")
- General negative prompt for WF-04 visuals (brand-blueprint.md)

**Gaps Identified:**

#### Gap 5.1: Negative Prompt Inconsistency Between Documents
**Severity:** MEDIUM
**Impact:** The visual-style-guide.md negative prompt includes "human face" but the brand-blueprint.md character system negative prompt does not. An agent or workflow referencing the wrong document may generate images with human faces, violating the faceless brand rule.

**Recommendation:** Synchronize both negative prompts. The canonical negative prompt should be identical in both documents and should include "human face."

#### Gap 5.2: No Negative Prompts for Environment/B-Roll
**Severity:** MEDIUM
**Impact:** The B-roll prompts (urban textures, tech visualizations) have no associated negative prompts. AI generators may produce bright suburban scenes, cartoon-style illustrations, or overly clean corporate aesthetics that violate brand identity.

**Recommendation:** Create a standard B-roll negative prompt block:
```
"bright colors, neon, clean modern architecture, suburban,
corporate office, stock photo look, cartoon, illustration,
anime, digital art, 3D render, daylight, sunny, cheerful,
people faces, crowds, text, watermark, logo, oversaturated"
```

---

### 6. POSE LIBRARY (6 POSES)

**What Exists:**
- 6 core poses defined (P1-P6) with names, descriptions, and use cases
- Mapped to thumbnail types (A-D) and specific content functions
- Poses cover: sitting alert, standing authority, lying companion, silhouette, extreme close-up, walking aftermath

**Gaps Identified:**

#### Gap 6.1: No Pose Transition Specifications
**Severity:** MEDIUM
**Impact:** For video clips (Kie.AI/Nano Banana 5-8s clips), Red Nose may need to move between states (e.g., lift head in alert, turn to look at camera, stand up from lying position). There are no transition specs describing how Red Nose moves between poses, which movements are on-brand, and which are not.

**Recommendation:** Define 4-6 approved transitions:
| From | To | Movement | Duration | When Used |
|------|------|----------|----------|-----------|
| P3 (Lying) | P1 (Watch) | Lifts head, ears forward | 2-3s | Alert/warning moment in VO |
| P1 (Watch) | P5 (Close) | Camera pushes in (Red Nose stays) | 3-5s | Dramatic emphasis |
| P2 (Guard) | P4 (Silhouette) | Turns away, walks to edge | 4-6s | Transition to philosophical segment |
| Any | Still hold | Breathing, slight ear movement only | 5-8s | Default between statements |

Also define banned movements: running, jumping, barking, wagging tail, play bowing, rolling over.

**Assessment of 6 poses:** Six poses is sufficient for launch. The combination of 6 poses x 4 thumbnail types x varied backgrounds provides enough visual variety for the first 22+ episodes. Additional poses can be developed after Season 1 based on content needs.

---

### 7. THUMBNAIL DESIGN SYSTEM

**What Exists:**
- 4 thumbnail type templates (A: The Watch 60%, B: The Guard 20%, C: The Companion 10%, D: The Silhouette 10%)
- Detailed structure diagrams with ASCII wireframes
- Text examples (10 sample titles)
- Subject context list (backgrounds/environments)
- Full spec block (canvas size, colors, fonts, grain, shadow, export)
- Fallout Raccoon pattern analysis with adaptation mapping

**Gaps Identified:**

#### Gap 7.1: No Series/Season Thumbnail Variant
**Severity:** MEDIUM
**Impact:** Episodes.md defines 3 seasons with distinct themes (The Marathon, 2001, Mailbox Money). There is no visual differentiation between season thumbnails. A viewer browsing the channel page cannot visually distinguish Season 1 from Season 2 content. This also affects playlist covers.

**Recommendation:** Define a season badge or accent variation:
- Season 1 (The Marathon): Standard Rust Orange accent (default)
- Season 2 (2001): Copper (#C4713B) accent word instead of Rust Orange
- Season 3 (Mailbox Money): Moss (#5A7A5A) accent word (survival/money theme)

Or add a small season identifier element: a hairline rule above the text with the season name in 16px Montserrat, Ash Gray. Subtle but present.

**Assessment of 4 types:** Four thumbnail types is sufficient. The 60/20/10/10 distribution maps well to the content pillar split (70% System / 30% Big Picture). The episodes.md file confirms all 22 episodes fit cleanly into the four types. No additional types needed at launch.

---

### 8. ON-SCREEN GRAPHICS SYSTEM

**What Exists:**
- Lower Third Bar: Full spec (width, height, bg, accent, font, color, position, duration, animation)
- Data Overlays (Survival Telemetry): Full spec with ASCII wireframe
- Stat Callouts: Full spec with animation (count-up)
- Quote Cards: Full spec with border and attribution
- Product Overlays: Full spec with CTA

**Gaps Identified:**

#### Gap 8.1: No 9:16 Dimensions or Positions for Any Graphic Element
**Severity:** HIGH
**Impact:** All five graphic elements (lower thirds, data overlays, stat callouts, quote cards, product overlays) are specified for 16:9 only. Positions like "bottom-left, 60px from edge" and widths like "40-60% of frame" need recalculation for 1080x1920 portrait format. The shorts/reels section covers captions and hook text but not these overlay elements.

**Recommendation:** Add a 9:16 variant spec table for each graphic element:

| Element | 16:9 Position | 9:16 Position | 9:16 Width | Notes |
|---------|--------------|--------------|------------|-------|
| Lower Third | Bottom-left, 60px | Bottom, 120px up, centered | 80-90% | Above safe zone |
| Data Overlay | Top-right / bottom-right | Top-center, below safe zone | 90% | Reduce font to 18-22px |
| Stat Callout | Center frame | Center frame, upper third | Same | Number size to 96-120px |
| Quote Card | Center frame | Center frame | 90% with 20px side padding | Reduce font to 28-36px |
| Product Overlay | Bottom third, right | Bottom third, centered | 90% | Stack image above text |

#### Gap 8.2: No Animation Easing Curves or Keyframe Data
**Severity:** MEDIUM
**Impact:** Animations are described in natural language ("slide in from left, 0.3s, hold, fade out 0.5s") but not in implementation terms. An FFMPEG or After Effects workflow needs actual easing functions (linear, ease-in, ease-out, cubic-bezier) and keyframe positions.

**Recommendation:** For FFMPEG implementation, specify:
- Slide-in: `overlay=x='if(lt(t,0.3), -w+(w*t/0.3), 0)'` (linear slide)
- Fade-out: `fade=out:st=4.5:d=0.5` (for a 5s element starting at 0)
- Count-up: Frame-by-frame number increment over 1.5s
- Typewriter: Character reveal at 30ms intervals

This can be a separate technical addendum rather than embedded in the style guide.

---

### 9. COLOR GRADING PIPELINE

**What Exists:**
- DaVinci Resolve / FFMPEG grading specs (temperature, saturation, contrast, shadows, highlights, midtones, grain, vignette)
- FFMPEG filter command: `eq=contrast=1.15:brightness=-0.03:saturation=0.75, unsharp=5:5:0.5, noise=alls=20:allf=t+u, vignette=PI/4:1.2`
- Appears identically in both visual-style-guide.md and brand-blueprint.md

**Gaps Identified:**

#### Gap 9.1: FFMPEG Filter Not Validated; No LUT Alternative
**Severity:** HIGH
**Impact:** The FFMPEG filter chain has never been tested against actual footage or AI-generated imagery. Parameters like `saturation=0.75` (25% reduction) and `contrast=1.15` (15% boost) are reasonable estimates but may produce unexpected results when applied to already-desaturated AI generations. Over-applying desaturation to already-muted Gemini/Kie.AI output could produce near-grayscale images that lose the Rust Orange warmth that defines the brand.

Additionally, no `.cube` or `.3dl` LUT file is provided as an alternative for DaVinci Resolve or Premiere users who do manual QA editing.

**Recommendation:**
1. Generate 5-10 test images using the B-roll prompts
2. Apply the FFMPEG filter chain
3. Compare against the desired look (Roger Deakins reference, desaturated earth tones with visible Rust Orange warmth)
4. Adjust parameters as needed
5. Export a validated `.cube` LUT for use in DaVinci Resolve
6. Document both the FFMPEG filter (for automation) and the LUT file (for manual editing) as equivalent standards

---

### 10. B-ROLL PROMPT LIBRARY

**What Exists:**
- 4 Red Nose in-context shots
- 5 urban texture shots (no character)
- 4 tech/AI visualization shots
- Total: 13 prompts

**Gaps Identified:**

See Gap 3.1 (above) for full analysis. Summary:

**Severity:** CRITICAL
**Impact:** 13 prompts are insufficient. A 30-day sprint producing 4 long-form videos + 20-32 shorts needs an estimated 80-160 unique AI-generated visuals. At 13 prompts, visual repetition will be obvious by Week 2, destroying the cinematic quality the brand demands.

**Additional Coverage Gaps by Episode:**
| Episode | Theme | Existing Prompt Coverage | Missing |
|---------|-------|------------------------|---------|
| EP 01 Victory Lap | Silicon Valley celebration | None | Board rooms, champagne, stock tickers |
| EP 02 Bullets Ain't Got No Name | Algorithmic bias | Prompt 10 (neural net) | Loan denial screens, housing apps, court systems |
| EP 03 The Watcher | Surveillance | Prompts 8, 12 | Ring cameras, street-level CCTV, phone tracking viz |
| EP 04 Grinding All My Life | Job displacement | None | Empty office, warehouse robots, "position filled" screens |
| EP 05 Xxplosive | AI acceleration | Prompt 11 (server room) | Timeline visuals, exponential curves, model size comparisons |
| EP 06 Crenshaw | Hyperlocal AI | None | Bodega interior, barbershop, corner store, Amazon locker |
| EP 07 Forgot About Dre | Representation | None | Ethics board rooms, training data viz, deployment maps |
| EP 08 Marathon Continues | Mid-season recap | Various | News compilation style, comment screenshots |

---

### 11. MOTION GRAPHICS TEMPLATES

**What Exists:**
- Transition rules (hard cut, fade, dissolve, slow push) with durations
- Ken Burns parameters (zoom range, duration, direction, ease)
- Natural-language animation descriptions for each graphic element

**Gaps Identified:**

No reusable motion graphics templates are defined as exportable, repeatable units. Each video will require rebuilding overlays from spec descriptions. This is manageable for FFMPEG automation (code-driven) but creates significant overhead for any manual editing in DaVinci Resolve or Canva.

**Severity:** MEDIUM (because automation mitigates it)
**Impact:** Manual QA editing, emergency re-edits, one-off special episodes

**Recommendation:** Create 5 reusable motion template packages:
1. **Lower Third Reveal** (FFMPEG filter chain + After Effects preset)
2. **Stat Callout Count-Up** (FFMPEG drawtext animation + AE preset)
3. **Quote Card Fade** (FFMPEG overlay sequence)
4. **Telemetry Data Grid** (FFMPEG typewriter effect)
5. **Product Overlay Slide** (FFMPEG overlay + slide animation)

---

### 12. INTRO/OUTRO VISUAL SEQUENCE

**What Exists:**
- Brief references scattered across documents:
  - visual-style-guide.md: "Intro card: Red Nose turns head toward camera (3 seconds)"
  - visual-style-guide.md: "Outro card: Red Nose silhouette + 'BOWTIE BULLIES' condensed type"
  - brand-blueprint.md closing pattern: "Subscribe card fades in -- Red Nose silhouette + 'BOWTIE BULLIES' in condensed type"
  - tyrone-voice-guide.md: "[End card: Red Nose silhouette + 'BOWTIE BULLIES' condensed type + subscribe]"

**Gaps Identified:**

#### Gap 12.1: No Frame-by-Frame Intro/Outro Specification
**Severity:** CRITICAL
**Impact:** The intro and outro are the most-viewed visual elements (every video, every short). They establish brand recognition. Currently there is no:
- Total duration for intro or outro
- Frame-by-frame shot breakdown
- Audio stinger/sonic logo specification
- Text animation sequence
- Color/lighting progression
- Resolution/format (16:9 vs. 9:16 variants)
- Export format or file naming

**Recommendation:** Spec both sequences:

**INTRO (suggested 3-5 seconds):**
```
Frame 0-30 (0-1.25s): Black screen. Low ambient hum fades in.
Frame 30-48 (1.25-2.0s): Red Nose close-up (P5) fades in from black.
    Rust orange light catches one eye. Barely visible.
Frame 48-60 (2.0-2.5s): Red Nose turns head toward camera (subtle).
    Ears shift forward. Eye catches light fully.
Frame 60-84 (2.5-3.5s): "BOWTIE BULLIES" slams in below (Bangers,
    Bone White, centered). Subtle film grain. Vignette.
Frame 84-96 (3.5-4.0s): Subtitle "THE AFTERMATH" fades in below
    (Montserrat, Ash Gray, 60% opacity).
Frame 96-120 (4.0-5.0s): Hold. Fade to content.
Audio: Custom 3-note bass stinger (Udio/Suno). Deep. Brief.
```

**OUTRO (suggested 5-8 seconds):**
```
Frame 0-36 (0-1.5s): Content fades to Dark Steel black.
Frame 36-72 (1.5-3.0s): Red Nose P4 silhouette fades in.
    City lights below. Rust orange glow on horizon.
Frame 72-108 (3.0-4.5s): "BOWTIE BULLIES" types in (typewriter,
    Montserrat). Subscribe button element appears right.
Frame 108-168 (4.5-7.0s): Hold. "Next video" card appears left.
Frame 168-192 (7.0-8.0s): Fade to black.
Audio: Same bass stinger, reversed/decayed.
```

---

### 13. CHANNEL ART SPECIFICATIONS

**What Exists:**
- References in visual-style-guide.md:
  - "Channel banner: P4 Silhouette pose (rooftop, city below)"
  - "Profile picture: P5 Close pose (one eye + bowtie, dark bg)"
- No watermark mentioned

**Gaps Identified:**

#### Gap 13.1: No Export Specs for Channel Art
**Severity:** HIGH
**Impact:** YouTube and IG have specific dimension requirements. Without specs, the Day 1-7 setup phase will require research and improvisation.

**Recommendation:** Add channel art spec block:

| Asset | Platform | Dimensions | Safe Zone | Format | Size Limit |
|-------|----------|-----------|-----------|--------|------------|
| YouTube Banner | YouTube | 2560x1440px | Text safe: 1546x423px center | PNG/JPG | 6MB |
| YouTube Profile Pic | YouTube | 800x800px | Circular crop | PNG | 2MB |
| YouTube Watermark | YouTube | 150x150px | Transparent bg | PNG | 1MB |
| IG Profile Pic | Instagram | 320x320px (display) / 1080x1080 (upload) | Circular crop | JPG/PNG | 5MB |
| IG Highlight Covers | Instagram | 1080x1920px | Center circle 600px | PNG | -- |

---

### 14. IG-SPECIFIC VISUAL ADAPTATIONS

**What Exists:**
- Reels optimization notes (cover image, caption length, hashtags, posting time)
- Stories mentioned briefly ("Behind-the-scenes of research, article screenshots, polls")
- Cross-posting strategy from YouTube Shorts

**Gaps Identified:**

#### Gap 14.1: No IG Stories Template, Grid Strategy, or Highlight Covers
**Severity:** HIGH
**Impact:** Thursday content calendar calls for IG Stories engagement. Saturday calls for IG product features. The grid layout (how the IG profile looks as a whole) is undefined. Highlight covers (the circular icons on the IG profile) are not designed.

**Recommendation:**
- **Grid layout strategy:** Define a repeating 3-column pattern. Example: [Thumbnail] [Quote card] [Red Nose shot] repeating. Or alternate dark/light intensity for visual rhythm.
- **Stories templates:** Define 3-4 story templates:
  1. Poll template (Dark Steel bg, Rust Orange accent, question in Bangers)
  2. News reaction (Screenshot + Tyrone's take in Montserrat)
  3. Behind-the-scenes (Telemetry overlay style on process screenshots)
  4. Product feature (P3 companion shot + product name + "link" CTA)
- **Highlight covers:** Define 5-6 highlight categories with icon/label:
  - "THE SYSTEM" (surveillance camera icon, Rust Orange)
  - "THE GEAR" (tool/wrench icon, Rust Orange)
  - "RED NOSE" (paw print icon, Rust Orange)
  - "THE MOVE" (arrow icon, Rust Orange)
  - "AGI" (brain/circuit icon, Rust Orange)

All on Dark Steel background with Rust Orange line art, matching the brand's telemetry aesthetic.

---

### 15. MERCH DESIGN SYSTEM

**What Exists:**
- Merch referenced in growth timeline ("email list lead magnet: BowTie Bullies Survival Guide PDF")
- P6 "The Aftermath" pose designated for merch use
- No other merch specifications

**Gaps Identified:**

The visual identity is not yet merch-ready. This is acceptable for a pre-launch brand. Merch becomes relevant at the 10K-50K subscriber milestone (Month 6-12 per the timeline).

**Severity:** LOW
**Impact:** No immediate production impact. Future revenue stream dependency.

**Recommendation:** Defer full merch design system until Month 3-6. At that point, define:
- Logo lockups (horizontal, stacked, icon-only)
- Minimum size requirements
- Color on dark fabric, color on light fabric
- Red Nose illustration style for print (vector adaptation of photorealistic)
- Bowtie as standalone icon/mark
- Typography for apparel

---

### 16. ACCESSIBILITY

**What Exists:**
- Bone White (#E7E7E1) on Dark Steel (#1E1E20) as primary text/bg combo
- Captions marked as "MANDATORY" for shorts (80% watch muted)
- Caption styling with shadow and optional background pill

**Gaps Identified:**

#### Gap 16.1: No WCAG Contrast Ratio Validation
**Severity:** MEDIUM
**Impact:** Content accessibility and potential platform compliance issues. Viewers with visual impairments may struggle with certain color combinations.

**Analysis of current color combinations:**

| Combo | Foreground | Background | Estimated Ratio | WCAG AA (4.5:1) | WCAG AAA (7:1) |
|-------|-----------|-----------|----------------|-----------------|-----------------|
| Primary text | #E7E7E1 | #1E1E20 | ~14.5:1 | PASS | PASS |
| Rust accent | #9A4C22 | #1E1E20 | ~3.8:1 | FAIL | FAIL |
| Earth Clay text | #7E6551 | #1E1E20 | ~3.2:1 | FAIL | FAIL |
| Ash Gray text | #4A4A4A | #1E1E20 | ~2.1:1 | FAIL | FAIL |
| Source citation | #4A4A4A | #1E1E20 | ~2.1:1 | FAIL | FAIL |

**Key Finding:** Rust Orange (#9A4C22) on Dark Steel (#1E1E20) fails WCAG AA for normal text. This is used for keyword accents, data/stats, and CTA elements -- all high-importance content. Ash Gray source citations are essentially invisible to many viewers.

**Recommendation:**
- Rust Orange as accent on large text (48px+) passes the WCAG AA large-text threshold (3:1 ratio). Restrict its use to large text only.
- For smaller Rust Orange text, add a subtle lighter background or increase brightness to Copper (#C4713B) which may approach 4.5:1.
- Ash Gray should never carry meaningful content alone. Pair with adjacent Bone White text.
- Consider adding colorblind-safe redundancy (use shape/position, not just color, to convey meaning in data visualizations).
- Minimum caption size for readability: 28px at 1080p, 36px preferred.

---

### 17. FILE FORMAT / EXPORT SPECIFICATIONS

**What Exists:**
- Thumbnail: PNG, <2MB, 1280x720
- Long-form: H.264, AAC 128kbps, 24fps, yuv420p, 1920x1080
- Shorts: H.264, AAC 128kbps, 30fps, 1080x1920
- File naming convention defined with platform/type/topic/variant/date structure

**Gaps Identified:**

The export specifications are solid for the core video and thumbnail outputs. Minor gaps:

- No bitrate target for video (CRF 18 is mentioned in one FFMPEG command but not in the spec blocks)
- No maximum file size guideline for YouTube uploads (YouTube accepts up to 256GB, but upload time matters)
- No IG feed post image spec (1080x1080 or 1080x1350 for non-reel image posts)
- No YouTube Community post image spec

**Severity:** LOW
**Impact:** Minor production friction during edge-case exports.

**Recommendation:** Add to spec tables:
| Output | Resolution | Format | Bitrate/Quality | Max Size |
|--------|-----------|--------|-----------------|----------|
| YT Long-form | 1920x1080 | MP4 (H.264) | CRF 18 / ~8-12 Mbps | <4GB |
| YT Shorts | 1080x1920 | MP4 (H.264) | CRF 20 / ~6-10 Mbps | <256MB |
| YT Thumbnail | 1280x720 | PNG | Lossless | <2MB |
| IG Reel | 1080x1920 | MP4 (H.264) | CRF 20 | <650MB |
| IG Feed Post | 1080x1350 | JPG/PNG | High quality | <30MB |
| IG Story | 1080x1920 | JPG/PNG/MP4 | High quality | <30MB/250MB |
| YT Community | 1200x675 | PNG/JPG | High quality | <16MB |

---

### 18. ANIMATED TRANSITIONS BETWEEN POSES/SHOTS

**What Exists:**
- Transition rules table (hard cut, fade, dissolve, slow push)
- Ken Burns parameters for static images
- Kie.AI / Nano Banana referenced for 5-8s video clips

**Gaps Identified:**

No specification for animated transitions between Red Nose poses or between Red Nose shots and B-roll. The transition rules cover edit-level transitions (cuts, fades) but not within-shot movement or character animation.

**Severity:** MEDIUM (because most content uses static images with Ken Burns)
**Impact:** Video clips that need character animation, intro/outro sequences

**Recommendation:** Addressed partially in Gap 6.1 (Pose Transitions). Additionally, define:
- Standard Red Nose clip types for Kie.AI prompts:
  - "Head turn toward camera" (2-3s, for intro)
  - "Ear prick / alert response" (1-2s, for emphasis)
  - "Slow blink and look away" (2-3s, for contemplative moments)
  - "Stand up from lying position" (3-4s, for alert moments)
- These should be generated as 5-8s video clips, stored as reusable library assets.

---

### 19. ERROR STATES (AI GENERATION FAILURE)

**What Exists:**
- No error handling or fallback procedures documented

**Gaps Identified:**

When AI image generation fails (wrong breed, bowtie missing, aggressive expression, wrong colors, human faces appearing), there is no documented triage process.

**Severity:** MEDIUM
**Impact:** Production delays, quality inconsistency, wasted API spend

**Recommendation:** Add an "AI Generation QA & Recovery" section:

**Common Failure Modes:**
| Failure | Frequency | Recovery |
|---------|-----------|----------|
| Wrong nose color (black instead of red) | High | Re-generate with "red/liver nose" emphasized at start of prompt |
| Bowtie missing | Medium | Re-generate; check that bowtie appears in first 30 words of prompt |
| Aggressive expression | Medium | Add "gentle expression, mouth closed" to prompt |
| Wrong breed characteristics | Low-Medium | Regenerate with reference image input if tool supports it |
| Human face in frame | Low | Re-generate; verify negative prompt includes "human face" |
| Bright/saturated colors | Medium | Apply FFMPEG color grade; if still wrong, re-generate with "desaturated, muted tones" |
| Cartoonish style | Low | Re-generate with "photorealistic, photograph, 35mm film" emphasized |

**Fallback Pipeline:**
1. First attempt: Primary tool (Gemini imagen)
2. Second attempt: Same tool, modified prompt
3. Third attempt: Secondary tool (Midjourney / DALL-E)
4. Fourth attempt: Use closest acceptable image + heavy FFMPEG post-processing
5. Emergency: Use a generic urban texture B-roll shot (no Red Nose) and flag for re-generation

---

### 20. TEMPLATE FILES

**What Exists:**
- Zero template files in any design tool format
- Canva mentioned as "optional, low priority" in tool stack
- DaVinci Resolve mentioned as "optional" for manual editing

**Gaps Identified:**

#### Gap 20.1: No Design Tool Templates Exist
**Severity:** CRITICAL
**Impact:** Every visual output currently requires building from written specs. For the automated pipeline (FFMPEG), this is partially mitigated by code. For any manual work (thumbnail QA, channel art, community posts, IG stories, emergency re-edits), every piece starts from scratch.

**Recommendation:** Create starter templates in at least one tool:

**Priority 1 (Before Day 1):**
- Canva thumbnail template (4 variants matching Types A-D)
- Canva IG story template (poll, news reaction, BTS, product)
- Canva YouTube banner template (2560x1440 with safe zones marked)

**Priority 2 (Before Day 8):**
- FFMPEG overlay template scripts (lower third, stat callout, quote card, telemetry grid, product overlay)
- Canva YouTube Community post template

**Priority 3 (Before Day 15):**
- Figma component library (for design iteration and future team members)
- After Effects lower-third template (for manual polish)

---

### ADDITIONAL OBSERVATIONS

#### Cinema Knowledge Directory Misalignment
The `cinema_knowledge/` directory contains valuable reference documents (lighting techniques, camera movements, visual composition roles) but also contains 4 images of a woman from what appears to be the Haven project. These images have no relation to BowTie Bullies. The directory should have a `bowtie-bullies/` subfolder (as referenced in brand-blueprint.md) containing validated Red Nose reference images, but this folder does not exist yet.

#### Font Specification in FFMPEG Assembler
The WF-05 FFMPEG Assembler pre-flight check references "Inter Bold" and "Bebas Neue" as required font files. Neither of these fonts appears anywhere in the BowTie Bullies visual system. Inter Bold is a clean sans-serif (wrong aesthetic). Bebas Neue is a condensed sans but is not Anton. This is likely a holdover from the Haven pipeline. Must be corrected to: Bangers (headlines) + Montserrat (body/captions) + Anton (fallback/data).

**Severity of font mismatch:** HIGH
**Impact:** FFMPEG-assembled videos will use wrong fonts, breaking brand identity.

#### Missing: Watermark Specification
YouTube supports a custom branding watermark (appears bottom-right during video). No spec is defined. Suggested: Red Nose bowtie icon only, 150x150px, PNG with transparency, Rust Orange on transparent background.

---

## PRIORITIZED ACTION PLAN

### Before Day 1 (Channel Setup)
1. **[CRITICAL]** Generate and validate 4 Red Nose reference images (Gap 4.1)
2. **[CRITICAL]** Fix Amber color inconsistency in WF-05 (Gap 1.3)
3. **[CRITICAL]** Fix font references in WF-05 (Inter Bold/Bebas Neue -> Bangers/Montserrat/Anton)
4. **[HIGH]** Create channel art with proper specs (Gap 13.1)
5. **[HIGH]** Create Canva thumbnail templates (Gap 20.1)

### Before Day 8 (First Publish)
6. **[CRITICAL]** Spec and produce intro/outro sequences (Gap 12.1)
7. **[CRITICAL]** Expand B-roll prompt library to 50+ (Gap 3.1)
8. **[HIGH]** Write P3 and P6 generation prompts (Gap 4.2)
9. **[HIGH]** Create 9:16 prompt variants for all poses (Gap 4.3)
10. **[HIGH]** Validate FFMPEG color grade against test footage (Gap 9.1)
11. **[HIGH]** Add 9:16 graphic element specs (Gap 8.1)

### Before Day 15 (Full Cadence)
12. **[HIGH]** Tag all prompts by episode theme (Gap 3.2)
13. **[HIGH]** Define IG Stories templates and grid strategy (Gap 14.1)
14. **[HIGH]** Add 16:9 caption burn-in spec (Gap 2.3)
15. **[HIGH]** Add IG/community post typography specs (Gap 2.1)

### Before Day 30 (Optimization)
16. **[MEDIUM]** Synchronize negative prompts across documents (Gap 5.1)
17. **[MEDIUM]** Add B-roll negative prompts (Gap 5.2)
18. **[MEDIUM]** Define data visualization palette (Gap 1.1)
19. **[MEDIUM]** Add pose transition specs (Gap 6.1)
20. **[MEDIUM]** Validate accessibility contrast ratios (Gap 16.1)
21. **[MEDIUM]** Define series thumbnail variants (Gap 7.1)
22. **[MEDIUM]** Document AI generation error recovery (Gap 19)
23. **[LOW]** Define merch design system (deferred to Month 3-6)

---

## CONCLUSION

The BowTie Bullies visual design system is remarkably thorough for a pre-production brand, with strong foundations in color theory, typography hierarchy, character design, and thumbnail strategy. The five critical gaps -- (1) no validated Red Nose reference images, (2) the Amber color inconsistency, (3) insufficient B-roll prompts, (4) missing intro/outro specs, and (5) zero template files -- are all solvable within the Day 1-7 Foundation phase if prioritized immediately. The eight high-severity gaps should be resolved before the first video publishes on Day 8. The system's biggest structural strength is its automation-first design (FFMPEG pipeline, n8n workflows), which means many of the medium-severity gaps (animation easing, motion templates) can be addressed incrementally as the pipeline matures.

The brand has a visual language. It now needs the production infrastructure to speak it consistently at volume.

---

*Audit completed 2026-02-10*
*Documents reviewed: 4 brand files + 3 cinema reference docs + 4 cinema images*
*Total gaps identified: 23 (5 CRITICAL, 8 HIGH, 7 MEDIUM, 3 LOW)*
