# BOWTIE BULLIES -- THE AFTERMATH | Brand Identity & Consistency Audit

**Audit Date:** 2026-02-10
**Auditor:** Brand Identity & Consistency Auditor
**Documents Reviewed:**
1. `brand-blueprint.md` (1645 lines)
2. `visual-style-guide.md` (707 lines)
3. `tyrone-voice-guide.md` (346 lines)
4. `episodes.md` (385 lines)

**Comparison Baseline:** Haven brand system (`brands/haven/brand-system.md`) -- mature, production-tested brand with character governance, room systems, outfit mapping, product guardrails, CTA rules, and platform-specific adjustments.

---

## SEVERITY RATING SYSTEM

| Severity | Meaning | Impact |
|----------|---------|--------|
| **CRITICAL** | Will cause brand inconsistency in production immediately | Blocks content pipeline launch |
| **HIGH** | Will cause drift within 30 days of content production | Degrades brand recognition over time |
| **MEDIUM** | Missing governance that becomes important at scale | Creates ambiguity for collaborators or AI agents |
| **LOW** | Nice-to-have polish that improves professional posture | Minor optimization |

---

## SECTION 1: CROSS-DOCUMENT CONSISTENCY

### 1.1 Brand Name Consistency

**Status: PASS with minor note**

All four documents consistently use "BowTie Bullies -- The Aftermath" as the full brand name and "BowTie Bullies" as the shorthand. The YouTube description template (blueprint Appendix C) correctly uses both forms. The episodes guide uses "BowTie Bullies" consistently.

**Minor note:** The capitalization pattern "BowTie" (camel case with capital T) is used consistently, but this is unconventional. No document explicitly states that "Bowtie," "BOWTIE," "Bow Tie," or "bow tie" are incorrect. This will become a governance issue when third parties or AI agents create content.

| Item | Severity | Impact |
|------|----------|--------|
| No explicit capitalization rule documented | MEDIUM | Third-party/AI content will drift on spelling |

---

### 1.2 Color Hex Code Consistency

**Status: PASS**

All five core palette colors are identical across `brand-blueprint.md` and `visual-style-guide.md`:

| Color Name | Blueprint | Visual Guide | Match |
|------------|-----------|--------------|-------|
| Dark Steel | `#1E1E20` | `#1E1E20` | YES |
| Rust Orange | `#9A4C22` | `#9A4C22` | YES |
| Earth Clay | `#7E6551` | `#7E6551` | YES |
| Ash Gray | `#4A4A4A` | `#4A4A4A` | YES |
| Bone White | `#E7E7E1` | `#E7E7E1` | YES |

The visual style guide also provides an extended palette (Burnt Umber, Copper, Gunmetal, Deep Red, Moss) that the blueprint does not reference. This is acceptable -- the visual guide is the source of truth for extended colors.

**CONFLICT FOUND -- Amber vs. Rust Orange:**

The blueprint's FFMPEG Assembler section (WF-05, line 1028) references `Amber (#D4A03C)` as a text background accent color. This hex code does not appear in either the core palette or the extended palette in the visual style guide. Amber `#D4A03C` is a distinctly different color from Rust Orange `#9A4C22` -- it is a warm yellow-gold rather than a deep burnt orange.

| Item | Severity | Impact |
|------|----------|--------|
| Amber `#D4A03C` referenced in FFMPEG spec but absent from any palette definition | HIGH | FFMPEG pipeline will apply an off-brand color to every long-form video |

---

### 1.3 Typography Consistency

**Status: PASS with discrepancy**

Both documents agree on the three-tier typography system:

| Tier | Blueprint | Visual Guide | Match |
|------|-----------|--------------|-------|
| Headlines | Anton / Condensed Sans | Condensed Sans-Serif (Anton, Impact, Knockout, Oswald Condensed) | YES (visual guide provides alternatives) |
| Body/Captions | Space Mono / Raw Grotesk | Space Mono, IBM Plex Mono, Roboto Mono | YES (visual guide provides alternatives) |
| Data/Stats | JetBrains Mono | JetBrains Mono or Fira Code | YES |

**CONFLICT FOUND -- FFMPEG Pre-flight fonts:**

The blueprint's WF-05 FFMPEG Assembler pre-flight validation (line 1012) checks for "Inter Bold" and "Bebas Neue" fonts. Neither of these fonts appears in the typography system of either the blueprint or the visual style guide.

- **Inter Bold** is the body font from the Haven brand system, not BowTie Bullies
- **Bebas Neue** is a condensed sans-serif that could substitute for Anton, but is never named as an approved alternative

This appears to be a copy-paste artifact from the Haven pipeline adaptation.

| Item | Severity | Impact |
|------|----------|--------|
| FFMPEG pre-flight checks for Inter Bold and Bebas Neue instead of Anton and Space Mono | CRITICAL | Pipeline will fail validation or use wrong fonts in production |

---

### 1.4 Red Nose Character Description Consistency

**Status: PASS**

The canonical character description in the blueprint's Character System section is the authoritative source. The visual style guide correctly defers to it with cross-references ("Full Pose Library and Character Sheet specs in: `brand-blueprint.md`"). The AI generation prompts in the visual guide replicate the consistency markers accurately.

The voice guide references Red Nose consistently as a narrative device (line 277-288) with behavioral rules that align with the visual guide's "What You See / What You Don't" table.

**Minor discrepancy:** The visual guide's negative prompt (line 580-585) includes "human face" which the blueprint's negative prompt (line 104-110) does not. The visual guide version is more complete. The blueprint should be updated to match.

| Item | Severity | Impact |
|------|----------|--------|
| Blueprint negative prompt missing "human face" | LOW | Minor -- both prompts would likely work, but consistency matters |

---

### 1.5 ElevenLabs Settings Consistency

**Status: PASS**

All three documents that reference ElevenLabs settings agree:

| Setting | Blueprint (Part 1) | Blueprint (Part 10) | Voice Guide | Match |
|---------|-------------------|--------------------|----|-------|
| Model | eleven_multilingual_v2 | eleven_multilingual_v2 | eleven_multilingual_v2 | YES |
| Stability | 0.60-0.65 (range) | 0.62 (specific) | 0.62 | YES (specific value falls within range) |
| Similarity Boost | 0.75-0.80 (range) | 0.78 (specific) | 0.78 | YES |
| Style | 0.15 | 0.15 | 0.15 | YES |
| Speaker Boost | ON | ON | ON | YES |
| WPM | 110-125 | -- | 110-125 | YES |

The blueprint Part 1 gives acceptable ranges; Part 10 and the voice guide give specific values within those ranges. This is well-aligned.

**Minor note:** The WF-03 VO Generator workflow (blueprint line 909) hardcodes Stability as 0.62 and Similarity Boost as 0.78, which are the specific values. Consistent.

---

### 1.6 Voice-to-Visual Mapping Alignment

**Status: PASS**

The voice guide's "Voice-to-Visual Mapping" table (line 266-275) aligns correctly with the visual guide's pose library, transition rules, and on-screen graphic specifications. Each voice moment maps to a visual response that is specified in the visual guide. The "Red Nose as Narrative Device" section (voice guide line 278-288) maps content topics to Red Nose behaviors that are achievable with the 6-pose library defined in the blueprint.

---

### 1.7 Thumbnail Specs Consistency

**Status: PASS**

Both the blueprint (Appendix B and main Visual Identity section) and the visual style guide specify identical thumbnail specs:

| Spec | Blueprint | Visual Guide | Match |
|------|-----------|--------------|-------|
| Canvas | 1280x720px | 1280x720px | YES |
| Background | #1E1E20 | #1E1E20 | YES |
| Text Font | Anton/Condensed, 72-96px | Anton/Condensed, 72-96px | YES |
| Text Color | #E7E7E1 | #E7E7E1 | YES |
| Accent | ONE word in #9A4C22 | ONE word in #9A4C22 | YES |
| Number Size | 120-160px | 120-160px | YES |
| Vignette | 30-50% | 30-50% | YES |
| Grain | 10-15% | 10-15% | YES |
| Export | PNG, <2MB | PNG, <2MB | YES |

The four thumbnail type templates (A-D) are identical in both documents. Well-maintained.

---

### 1.8 Blueprint-to-Episodes Alignment

**Status: PASS with gap**

The blueprint defines two content pillars (AI & The System at 70%, The Bigger Picture -- AGI/ASI at 30%). The episodes guide distributes content as follows:

- Season 1 (8 episodes): 6 System + 1 AGI + 1 Both = 75% System / 12.5% AGI / 12.5% Both
- Season 2 (8 episodes): 6 System + 2 AGI = 75% System / 25% AGI
- Season 3 (6 episodes): 5 System + 1 AGI = 83% System / 17% AGI

The actual content split across 22 episodes skews closer to 77% System / 18% AGI / 5% Both, which exceeds the 70/30 target. This is not a hard inconsistency but suggests the AGI pillar is underrepresented in episode planning.

| Item | Severity | Impact |
|------|----------|--------|
| AGI/philosophical content underrepresented vs. stated 30% target | LOW | Self-correcting as seasons progress; Seasons 4-5 may rebalance |

---

## SECTION 2: BRAND ARCHITECTURE

### 2.1 Brand Hierarchy

**Status: PARTIALLY DEFINED**

The implied hierarchy is:
```
BowTie Bullies (Master Brand)
  |-- The Aftermath (Series/Channel Subtitle)
  |-- Red Nose (Visual Mascot / Brand Face)
  |-- Tyrone (Voice / Narrator Identity)
  |-- Seasons (The Marathon, 2001, Mailbox Money, Compton, Slauson Boy)
  |-- Content Pillars (AI & The System, The Bigger Picture)
```

**Gaps:**

| Item | Severity | Impact |
|------|----------|--------|
| No explicit statement of hierarchy or relationship between elements | MEDIUM | Confusion about what "BowTie Bullies" means vs. "The Aftermath" -- is "The Aftermath" a show name, a series, a subtitle, or a sub-brand? |
| No clarity on whether seasons are sub-brands or just organizational containers | LOW | Matters for branding consistency if seasons get their own visual identity |
| No relationship rules between Tyrone and Red Nose (can one exist without the other?) | MEDIUM | Matters for derivative content, merch, community posts |

---

### 2.2 Logo System

**Status: NOT DEFINED**

No document defines a logo. The closest element is the Red Nose silhouette used in the outro card ("Red Nose silhouette + 'BOWTIE BULLIES' in condensed type"). This is referenced multiple times but never formally defined as the logo.

| Item | Severity | Impact |
|------|----------|--------|
| No logo defined or spec'd | HIGH | Cannot create channel banner, profile pic, watermarks, merch, or partnership materials without a formal logo |
| No logo lockup rules (minimum size, clear space, mono version, dark/light versions) | HIGH | Logo will be inconsistently applied across platforms |
| No favicon/icon spec (profile picture crop rules) | MEDIUM | Profile picture across YouTube, IG, and other platforms will be inconsistent |

---

### 2.3 Watermark Specs

**Status: NOT DEFINED**

No document specifies a video watermark (the persistent brand mark that appears in YouTube videos). YouTube allows a custom branding watermark that appears in the bottom-right corner.

| Item | Severity | Impact |
|------|----------|--------|
| No watermark spec (position, size, opacity, design) | MEDIUM | Missing low-cost subscriber conversion opportunity; brand protection gap |

---

### 2.4 Brand Audio Assets

**Status: PARTIALLY DEFINED**

The blueprint mentions creating a "branded intro stinger" via Udio/Suno ($10/mo) in the music sources section (line 1268). The visual guide and voice guide reference intro/outro cards. But no formal audio brand assets are defined.

| Item | Severity | Impact |
|------|----------|--------|
| No intro stinger spec (duration, instruments, mood, key, how it ends) | HIGH | Audio brand recognition is critical for faceless channels; this is the "sonic logo" |
| No notification/alert sound spec | LOW | Relevant for community posts, streams, or app notifications later |
| No outro audio spec | MEDIUM | Outro card references exist visually but no audio treatment is defined |
| No music licensing tracking system defined | MEDIUM | Risk of copyright claims if music sources are not tracked per video |

---

## SECTION 3: CHARACTER GOVERNANCE

### 3.1 Red Nose Behavioral Rules

**Status: PARTIALLY DEFINED -- significant gaps**

The voice guide (line 278-288) defines what Red Nose does in response to specific content topics, and the visual guide's "What You See / What You Don't" table (line 542-551) defines visual boundaries. The blueprint defines the pose library.

**Missing governance:**

| Item | Severity | Impact |
|------|----------|--------|
| No rule for Red Nose in community posts (text posts, polls, story slides) | MEDIUM | AI agents or collaborators will use Red Nose inconsistently in non-video contexts |
| No rule for Red Nose in promotional/collab contexts (sponsor integration, guest features) | MEDIUM | As brand grows, partners will want to use Red Nose; no usage rules exist |
| No rule for Red Nose interacting with other animals or characters | LOW | Prevents scope creep (e.g., Red Nose with other dogs, cats, or mascots) |
| No rule for Red Nose interacting with humans (even silhouetted/faceless humans) | MEDIUM | Some visual prompts reference silhouette figures -- can Red Nose be in the same frame? |
| Red Nose behavioral rules are split across 3 documents with no single canonical source | HIGH | Voice guide, visual guide, and blueprint each contain partial character rules; no single "Red Nose Character Bible" |

---

### 3.2 Tyrone Personality Boundaries

**Status: PARTIALLY DEFINED -- critical gaps**

The voice guide defines Tyrone's tone, language rules, emotional range, and AI-specific voice adaptations. The "I Avoid" section (line 133-140) covers language patterns to avoid. But there are no content boundaries defined.

| Item | Severity | Impact |
|------|----------|--------|
| No "off-limits topics" list for Tyrone | HIGH | What topics does Tyrone never touch? Partisan politics? Specific individuals? Religion? Conspiracy theories? Without this, content will inevitably drift into territory that damages the brand |
| No crisis/emergency content protocol | HIGH | When a real-world tragedy involves AI (e.g., autonomous vehicle death, AI-enabled crime, deepfake political crisis), how does Tyrone respond? Timing rules? Sensitivity guidelines? |
| No "Tyrone would never say" examples | MEDIUM | Voice guide has "I Avoid" but only covers language style, not content/opinion boundaries |
| No stance on specific tech companies (does Tyrone name companies? Criticize specific CEOs?) | MEDIUM | Naming companies creates legal/partnership risk; not naming them reduces credibility. This needs a rule. |
| No rule on profanity/language intensity | MEDIUM | The voice guide says "raw" but never defines the profanity boundary. Mild? None? Bleeped? Episodes reference Nipsey Hussle and Dr. Dre whose catalogs include explicit content -- does this energy carry into the channel? |
| No guidance on how Tyrone discusses violence, police, or incarceration | HIGH | Core to the brand thesis ("navigating broken systems -- policing, housing, education") but no guardrails on specificity, political positioning, or how deep into systemic criticism the voice goes |

---

### 3.3 Red Nose Aging/Evolution

**Status: NOT DEFINED**

The character sheet specifies "Age Appearance: Adult, prime (3-5 years equivalent)" but no rules govern whether Red Nose ever changes.

| Item | Severity | Impact |
|------|----------|--------|
| No evolution/aging rules (does the scar grow? Does the bowtie change? Can seasonal elements be added?) | LOW | Not urgent for launch, but matters at scale when the audience asks for merch variants, seasonal content, or special episodes |
| No variant rules (can Red Nose wear anything besides the bowtie? Holiday variants? Anniversary editions?) | LOW | Prevents brand dilution from well-intentioned but off-brand variations |

---

## SECTION 4: AUDIENCE DEFINITION

### 4.1 Target Audience Demographics

**Status: NOT DEFINED**

No document contains any audience demographic definition. The brand thesis implies an African American male audience, but this is never stated explicitly with age ranges, income levels, education, geography, or platform behavior data.

| Item | Severity | Impact |
|------|----------|--------|
| No target audience demographics defined | CRITICAL | Cannot optimize content, thumbnails, posting times, or ad strategy without knowing WHO the audience is |
| No primary vs. secondary audience distinction | HIGH | Is the primary audience African American men 25-44? Does it extend to broader audiences interested in AI impact? Without this, content tone will oscillate |
| No audience persona(s) | MEDIUM | Haven has a clear viewer persona implied through product price points and CTA style; BowTie Bullies has nothing equivalent |

---

### 4.2 Audience Psychographics

**Status: NOT DEFINED**

No document describes audience motivations, fears, aspirations, information consumption patterns, or media habits.

| Item | Severity | Impact |
|------|----------|--------|
| No audience motivations/fears/aspirations documented | HIGH | Script generator (WF-02) cannot optimize for audience emotional hooks without psychographic data |
| No content-audience fit mapping per pillar | MEDIUM | Which audience segment prefers System content vs. AGI content? Without this, analytics interpretation is guesswork |

---

### 4.3 Audience Journey

**Status: NOT DEFINED**

No document maps the viewer journey from discovery to subscriber to community member to customer.

| Item | Severity | Impact |
|------|----------|--------|
| No audience journey/funnel defined | HIGH | The blueprint lists revenue streams (AdSense, affiliates, digital products, membership, sponsorships, consulting) but no journey from "first impression" to "paying community member" |
| No subscriber milestone strategy (what changes at 1K, 10K, 50K, 100K?) | MEDIUM | Revenue projections exist but no corresponding content/community strategy per tier |

---

## SECTION 5: BRAND POSITIONING

### 5.1 Competitive Positioning

**Status: DEFINED but incomplete**

The blueprint (Part 8) contains a competitive positioning table comparing 6 channels and identifying the market gap. This is solid foundational work.

| Item | Severity | Impact |
|------|----------|--------|
| Competitive matrix does not include faceless AI channels (Liam Ottley, AI Foundations, The AI Grid) | MEDIUM | These are closer competitors in format (faceless + AI) than the channels listed |
| No positioning against Black tech/culture channels (MKBHD, Terrence K. Williams, BlackInTech) | MEDIUM | Same cultural lens but different content angle -- important to differentiate |
| No refresher cadence for competitive analysis | LOW | Competitive landscape in AI YouTube changes monthly |

---

### 5.2 Unique Value Proposition

**Status: DEFINED but not formalized**

The brand thesis and competitive positioning sections both articulate the UVP implicitly: "AI impact through the lens of someone who has already survived broken systems." But there is no single, formalized UVP statement.

| Item | Severity | Impact |
|------|----------|--------|
| No single-sentence UVP statement | MEDIUM | Makes elevator pitches, sponsorship decks, and collaborator briefs harder |

---

### 5.3 Brand Promise

**Status: NOT DEFINED**

No document states what BowTie Bullies guarantees the viewer. The tagline ("We're already in the aftermath") is a positioning statement, not a promise.

| Item | Severity | Impact |
|------|----------|--------|
| No brand promise defined | HIGH | A brand promise answers "why should I watch THIS channel over everything else?" Haven's implicit promise is "your home can look this good for under $25." BowTie Bullies needs an equivalent. |

---

### 5.4 Brand Values

**Status: PARTIALLY DEFINED -- not operationalized**

Values are embedded in the voice guide (emotional, stoic, confident, raw) and the brand thesis, but they are not listed, ranked, or operationalized as decision-making filters.

| Item | Severity | Impact |
|------|----------|--------|
| No explicit brand values list | MEDIUM | Values should be ranked and used as decision filters: "When in doubt, choose [X] over [Y]" |
| No values operationalization (how each value shows up in content decisions, partnership decisions, product decisions) | MEDIUM | Prevents values from being abstract; makes them actionable |

---

## SECTION 6: LEGAL & COMPLIANCE

### 6.1 FTC Disclosure

**Status: NON-COMPLIANT**

The blueprint's Affiliate Integration Rules (line 663) explicitly state: "Never say 'affiliate link' or 'I get a commission.'" This directly violates FTC endorsement guidelines, which require clear and conspicuous disclosure of material connections between endorsers and advertisers.

The YouTube description template (Appendix C) uses: "I don't do sponsors. If I mention it, I use it." This is not an adequate FTC disclosure.

| Item | Severity | Impact |
|------|----------|--------|
| Affiliate disclosure rules explicitly violate FTC guidelines | CRITICAL | FTC can fine content creators for undisclosed affiliate relationships. YouTube can demonetize or terminate channels. Amazon Associates can revoke the account. This MUST be fixed before any content publishes. |
| No FTC-compliant disclosure language defined | CRITICAL | Need: video verbal disclosure, description disclosure, and pinned comment disclosure |
| YouTube description template lacks "#ad" or "contains affiliate links" | CRITICAL | YouTube's own policies require disclosure in description for paid promotions |

**Required fix:** The brand rules must include FTC-compliant language. The "Tyrone doesn't say affiliate link" rule must be replaced with compliant alternatives that still feel on-brand. Example: "Some links help keep this channel running." The description must include a clear disclosure line.

---

### 6.2 AI-Generated Content Disclosure

**Status: NOT ADDRESSED**

YouTube's evolving policies on AI-generated content require disclosure when content uses synthetic media (AI-generated imagery, AI voice synthesis). BowTie Bullies uses both extensively. No document addresses this.

| Item | Severity | Impact |
|------|----------|--------|
| No AI content disclosure policy | HIGH | YouTube requires disclosure of AI-generated content; policy is evolving and enforcement is increasing |
| No ElevenLabs TOS compliance check (synthetic voice disclosure) | HIGH | ElevenLabs requires disclosure that voice is AI-generated in certain contexts |

---

### 6.3 Music Licensing

**Status: PARTIALLY DEFINED**

The blueprint lists music sources (Epidemic Sound, Artlist, Pixabay, YouTube Audio Library, Udio/Suno). But no tracking system or compliance workflow exists.

| Item | Severity | Impact |
|------|----------|--------|
| No music licensing tracking per video | MEDIUM | Copyright claims can demonetize or block videos; need per-video music source documentation |
| No Udio/Suno output licensing clarity (AI-generated music ownership is legally unsettled) | HIGH | AI-generated music copyright is legally ambiguous; using Udio/Suno-generated stingers as brand audio assets creates IP risk |
| Airtable Assets table tracks "Tool Used" but not licensing status or license type | MEDIUM | Need to track whether each music asset is royalty-free, licensed, AI-generated, or public domain |

---

### 6.4 Image/Footage Licensing

**Status: PARTIALLY DEFINED**

The Airtable Assets table tracks assets by tool (ElevenLabs, Kie.AI, Nano Banana, Gemini, Stock). The visual style guide references Pexels API for free stock footage. But no licensing compliance tracking exists.

| Item | Severity | Impact |
|------|----------|--------|
| No image/footage licensing tracking system | MEDIUM | Gemini-generated images, Kie.AI video clips, and stock footage all have different licensing terms |
| No policy on AI-generated imagery IP ownership | MEDIUM | Legally evolving area; should document current understanding and risk acceptance |

---

### 6.5 Trademark Considerations

**Status: NOT ADDRESSED**

No document mentions trademark research or protection for "BowTie Bullies," "The Aftermath," "Red Nose" (as a character brand), "Truth Tones," or any other brand-specific terminology.

| Item | Severity | Impact |
|------|----------|--------|
| No trademark research documented for "BowTie Bullies" | HIGH | Another entity may already hold this mark; establishing the brand without a search creates legal risk |
| No trademark consideration for "Red Nose" as a character | MEDIUM | "Red Nose" is a breed descriptor but also used as a proper name/character; trademark viability is questionable but worth documenting |
| No IP protection strategy | MEDIUM | As the brand grows, protecting the name, mascot, and tagline becomes important |

---

### 6.6 Nipsey Hussle / Dr. Dre Catalog Usage

**Status: NOT ADDRESSED**

The episodes guide draws every episode title from Nipsey Hussle or Dr. Dre's discography. No document addresses the intellectual property implications of this approach.

| Item | Severity | Impact |
|------|----------|--------|
| No legal analysis of using song/album titles as episode titles | HIGH | Song titles are generally not copyrightable, but systematic use of an entire discography as episode architecture could attract attention from rights holders. This should be documented as a considered risk. |
| No fair use analysis or legal opinion referenced | MEDIUM | The "flipped" approach (using titles as inspiration, not reproducing lyrics) is likely defensible but should be formally assessed |

---

## SECTION 7: MISSING BRAND ASSETS

### 7.1 Brand Guidelines One-Pager

**Status: DOES NOT EXIST**

The Haven brand system has a comprehensive single-file brand system (413 lines covering philosophy, character identity, room system, color system, typography, video specs, content framing, and platform adjustments). BowTie Bullies has no equivalent consolidated reference.

| Item | Severity | Impact |
|------|----------|--------|
| No single-file brand system for the pptx-generator/brands/ directory | HIGH | The existing brand infrastructure expects a `brand-system.md`, `brand.json`, `config.json`, and `tone-of-voice.md` per brand. BowTie Bullies has none of these. |
| No quick-reference one-pager for collaborators | MEDIUM | Anyone joining the project must read 4 documents totaling 3,000+ lines to understand the brand |

---

### 7.2 Brand Do's and Don'ts

**Status: PARTIALLY EXISTS -- scattered**

Visual do's and don'ts exist in the visual guide's quality checklist (line 684-700) and the "What You See / What You Don't" table (line 542-551). Voice do's and don'ts exist in the voice guide's language rules. But no consolidated brand do's and don'ts document exists.

| Item | Severity | Impact |
|------|----------|--------|
| No consolidated do's and don'ts (visual + voice + content + character in one place) | MEDIUM | Increases onboarding time and inconsistency risk for collaborators |

---

### 7.3 Platform-Specific Tone Examples

**Status: PARTIALLY DEFINED**

The voice guide provides excellent examples for video scripts. The blueprint provides YouTube description templates and IG optimization notes. But tone examples for the following are missing:

| Item | Severity | Impact |
|------|----------|--------|
| No YouTube Community post voice examples | MEDIUM | Community posts are weekly (Thursday); no guidance on tone, length, or format |
| No IG caption voice examples | MEDIUM | IG captions have different constraints than video scripts; no examples provided |
| No IG Stories voice/visual examples | LOW | Stories are mentioned in content calendar but not spec'd |
| No reply/comment voice examples (how does the brand interact in comments?) | HIGH | Comment engagement is a major growth lever; the brand voice in comments is undefined |

---

### 7.4 Email/Newsletter Brand Voice

**Status: NOT DEFINED**

The blueprint mentions building an email list (line 1314: "Start building email list -- lead magnet: 'BowTie Bullies Survival Guide' PDF") but no email voice, template, frequency, or content strategy exists.

| Item | Severity | Impact |
|------|----------|--------|
| No email/newsletter voice defined | LOW | Not urgent for launch but becomes important at the email list stage (Phase 4) |

---

### 7.5 Merch Brand Application Rules

**Status: NOT DEFINED**

The blueprint mentions merch as a use case for the P6 "Aftermath" pose and references Red Nose in merch contexts. But no merch guidelines exist.

| Item | Severity | Impact |
|------|----------|--------|
| No merch color rules (which brand colors work on physical goods?) | LOW | Not urgent pre-launch |
| No merch typography rules | LOW | Not urgent pre-launch |
| No Red Nose on merch rules (minimum size, approved poses, color variants) | LOW | Not urgent pre-launch |

---

### 7.6 Brand System Files for Existing Infrastructure

**Status: NOT CREATED**

The project's pptx-generator brand infrastructure expects these files per brand:
- `brand-system.md` (comprehensive brand system)
- `brand.json` (structured color/font/asset data)
- `config.json` (generator configuration)
- `tone-of-voice.md` (voice guidelines)

BowTie Bullies has none of these files in the expected directory (`brands/bowtie-bullies/`). The brand data exists across 4 separate deliverable files but has not been ported to the standard brand infrastructure format.

| Item | Severity | Impact |
|------|----------|--------|
| No `brands/bowtie-bullies/` directory in pptx-generator | HIGH | Cannot generate branded PDFs, pitch decks, or partner materials using the existing brand infrastructure |
| No `brand.json` with structured color/font/asset data | HIGH | AI agents and automation tools expect this format |

---

## SECTION 8: CROSS-DOCUMENT STRUCTURAL ISSUES

### 8.1 Single Source of Truth Violations

Multiple critical brand specifications exist in more than one document without a declared "source of truth":

| Specification | Appears In | Which Is Canonical? |
|--------------|-----------|-------------------|
| Red Nose character description | Blueprint + Visual Guide | Blueprint (visual guide cross-references) -- CORRECT |
| Color palette | Blueprint + Visual Guide | Unclear -- both have identical core palette; visual guide has extended palette |
| Thumbnail specs | Blueprint (2 locations: main + Appendix B) + Visual Guide | THREE copies with no declared canonical version |
| ElevenLabs settings | Blueprint (2 locations: Part 1 + Part 10) + Voice Guide | THREE copies; voice guide is logically canonical but not declared |
| Transition rules | Blueprint + Visual Guide | TWO copies, identical but redundant |
| Audio mix levels | Blueprint + Visual Guide | TWO copies, identical but redundant |

| Item | Severity | Impact |
|------|----------|--------|
| Multiple copies of the same specs across documents with no declared canonical source | MEDIUM | When specs need to update, multiple files must be edited. Risk of drift increases with every change. |
| Blueprint contains thumbnail specs in TWO internal locations (Visual Identity section AND Appendix B) | LOW | Internal duplication within a single file |

---

### 8.2 Haven-to-BowTie Copy Artifacts

The blueprint's FFMPEG Assembler section (WF-05) contains artifacts that appear to be copied from the Haven pipeline without full adaptation:

| Artifact | Location | Issue |
|----------|----------|-------|
| "Inter Bold, Bebas Neue" font check | Blueprint line 1012 | These are Haven/generic fonts, not BowTie Bullies fonts |
| "Amber (#D4A03C)" color reference | Blueprint line 1028 | This color is not in the BowTie Bullies palette |
| "Adapted from Haven WF-006" comment | Blueprint line 1004 | Confirms Haven origin; adaptation may be incomplete |

| Item | Severity | Impact |
|------|----------|--------|
| Haven pipeline artifacts in BowTie Bullies FFMPEG specs | CRITICAL | The n8n pipeline will use wrong fonts and colors if built from these specs as-is |

---

## SECTION 9: PRIORITY REMEDIATION MATRIX

### Must Fix Before Launch (CRITICAL)

| # | Gap | Document(s) Affected | Remediation |
|---|-----|---------------------|-------------|
| 1 | FTC affiliate disclosure rules violate federal law | Blueprint (Affiliate Rules) | Rewrite affiliate disclosure rules to be FTC-compliant while staying on-brand |
| 2 | FFMPEG pre-flight checks wrong fonts (Inter Bold, Bebas Neue) | Blueprint (WF-05) | Replace with Anton + Space Mono |
| 3 | Amber `#D4A03C` color in FFMPEG spec is off-palette | Blueprint (WF-05) | Replace with Rust Orange `#9A4C22` or remove |
| 4 | No target audience defined | All documents | Create audience definition section |

### Must Fix Within First 30 Days (HIGH)

| # | Gap | Document(s) Affected | Remediation |
|---|-----|---------------------|-------------|
| 5 | No logo system defined | New document needed | Design and spec the Red Nose silhouette + wordmark logo lockup |
| 6 | No intro stinger audio spec | Blueprint, Visual Guide | Define the sonic brand identity |
| 7 | No off-limits topics for Tyrone | Voice Guide | Define content boundaries and crisis protocol |
| 8 | No AI content disclosure policy | Blueprint | Define YouTube/platform AI disclosure compliance |
| 9 | No trademark research documented | New document needed | Conduct basic trademark search for "BowTie Bullies" |
| 10 | Red Nose character rules split across 3 docs | All docs | Consolidate into single Red Nose Character Bible |
| 11 | No comment/engagement voice defined | Voice Guide | Define how brand interacts in comments and replies |
| 12 | No brand system files in pptx-generator infrastructure | New files needed | Create brand.json, config.json, brand-system.md, tone-of-voice.md |
| 13 | Nipsey/Dre catalog usage legal risk not documented | Episodes Guide | Add legal considerations section |
| 14 | No audience journey/funnel | Blueprint | Map discovery to subscriber to customer pipeline |
| 15 | No brand promise statement | Blueprint | Define the viewer guarantee |
| 16 | AI-generated music IP risk (Udio/Suno) | Blueprint | Document risk and licensing approach |
| 17 | No crisis/emergency content protocol | Voice Guide | Define response rules for real-world AI incidents |
| 18 | No profanity/language intensity rules | Voice Guide | Define the line explicitly |
| 19 | No stance rules on naming tech companies | Voice Guide | Define whether Tyrone names companies, individuals |

### Should Fix Within 90 Days (MEDIUM)

| # | Gap | Remediation |
|---|-----|-------------|
| 20 | Brand name capitalization rules not documented | Add to brand guidelines |
| 21 | Brand hierarchy not formally defined | Create brand architecture diagram |
| 22 | No consolidated do's and don'ts | Create single reference document |
| 23 | No community post voice examples | Add to voice guide |
| 24 | No IG caption voice examples | Add to voice guide |
| 25 | No watermark spec | Design and document |
| 26 | No single-sentence UVP statement | Formalize and add to brand system |
| 27 | No brand values list (ranked, operationalized) | Create and add to blueprint |
| 28 | No audience psychographics | Research and document |
| 29 | No music licensing tracking per video | Add field to Airtable Assets table |
| 30 | Red Nose in non-video contexts (community, promo) not governed | Add to character bible |
| 31 | No canonical source of truth declarations | Add header to each document declaring scope |
| 32 | Competitive matrix missing faceless AI channels | Update competitive positioning |
| 33 | Red Nose interacting with silhouetted humans not ruled | Add to character governance |
| 34 | Single source of truth violations (duplicated specs) | Consolidate; cross-reference instead of copy |

### Polish When Time Allows (LOW)

| # | Gap | Remediation |
|---|-----|-------------|
| 35 | Blueprint negative prompt missing "human face" | Add to negative prompt |
| 36 | AGI pillar underrepresented in episode plan | Adjust future seasons |
| 37 | No Red Nose evolution/variant rules | Define when brand matures |
| 38 | No email/newsletter voice | Define at email list stage |
| 39 | No merch brand application rules | Define pre-merch launch |
| 40 | No IG Stories voice/visual examples | Add to voice guide |
| 41 | No notification/alert sound spec | Define if needed for app/community |
| 42 | No competitive analysis refresh cadence | Add to operational SOPs |

---

## SECTION 10: COMPARISON TO HAVEN BRAND MATURITY

The Haven brand system serves as a useful maturity benchmark. Here is how BowTie Bullies compares:

| Brand System Element | Haven | BowTie Bullies | Gap |
|---------------------|-------|----------------|-----|
| Character canonical description | Full (hair, skin, eyes, build, age, expression) | Full (breed, coat, nose, eyes, build, ears, expression, age, scar) | PARITY |
| Character wardrobe/outfit system | 6 outfits with room mapping | 1 outfit (bowtie only) with consistency rules | BowTie Bullies is simpler by design (single outfit) |
| Character negative prompt | Defined | Defined (stronger in visual guide than blueprint) | PARITY |
| Character reference images | 4 images stored, paths documented | Checklist defined but images not yet generated | GAP -- images pending |
| Environment/room system | 3 rooms with full prompts | Urban textures library with prompts | PARITY (different structure, both complete) |
| Color system | Primary (3) + Theme Base (5) + Video Overlay (5) | Primary (5) + Extended (5) | PARITY |
| Typography | 3-tier with size hierarchy | 3-tier with size hierarchy | PARITY |
| Content framing/guardrails | Detailed (CTA rules, product exclusions, price positioning, voice rules, attribution hooks) | Partial (affiliate rules exist but no product exclusions, no CTA differentiation) | GAP |
| Product category guardrails | Approved/excluded categories, price sweet spot, quality threshold | Categories defined but no exclusion rules, no quality threshold | GAP |
| Camera angles by context | Defined per product size | Pose library (P1-P6) per content type | PARITY (different application, both systematic) |
| Platform-specific adjustments | IG Reels + TikTok specific rules | YouTube + IG Reels specific rules | PARITY |
| Brand system infrastructure files | brand.json + config.json + brand-system.md + tone-of-voice.md | NONE | CRITICAL GAP |
| Legal/compliance | Not defined (but lower risk for kitchen UGC) | Not defined (higher risk due to affiliates + AI disclosure) | CRITICAL GAP |
| Audience definition | Implied through product/price positioning | Not defined at all | CRITICAL GAP |

---

## SUMMARY

**Total gaps identified:** 42

| Severity | Count |
|----------|-------|
| CRITICAL | 4 |
| HIGH | 15 |
| MEDIUM | 15 |
| LOW | 8 |

**Top 3 immediate actions:**
1. Fix FTC affiliate disclosure compliance (legal exposure)
2. Fix FFMPEG pipeline specs (wrong fonts + wrong color = broken automation)
3. Define target audience demographics (foundational to all content decisions)

**Overall assessment:** The brand identity documents are exceptionally well-crafted for tone, visual identity, character design, and content strategy. The brand's unique positioning is genuinely differentiated. The primary weaknesses are in governance (legal compliance, content boundaries, character consolidation), infrastructure (no brand system files for existing tooling), and audience definition (completely absent). These gaps are normal for a pre-launch brand but must be addressed before the content pipeline goes live.

---

*"The brand is strong. The system needs rules."*
*-- Audit, BowTie Bullies -- The Aftermath*
