# BOWTIE BULLIES -- THE AFTERMATH
# Consolidated Strategy Spec

**Purpose:** Unified gap remediation plan synthesized from 7 domain audits. Organized by phase, de-duplicated across domains, with clear ownership and dependencies.

**Date:** 2026-02-10
**Input Audits:**
1. Narrative & Voice (25 gaps)
2. Visual Design System (23 gaps)
3. YouTube Strategy & Thumbnails (28 gaps)
4. Video Production Pipeline (30 gaps)
5. Brand Identity & Consistency (42 gaps)
6. Marketing & Monetization (extensive)
7. Automation Pipeline (67 gaps)

**Total Raw Gaps Across All Audits:** ~215+
**After De-Duplication:** ~142 unique gaps
**CRITICAL Blockers:** 18
**HIGH Priority:** ~45

---

## GAP SEVERITY SUMMARY (DE-DUPLICATED)

| Severity | Count | % of Total |
|----------|-------|------------|
| CRITICAL | 18 | 13% |
| HIGH | 45 | 32% |
| MEDIUM | 52 | 37% |
| LOW | 27 | 19% |
| **TOTAL** | **142** | 100% |

---

## PHASE 0: NON-NEGOTIABLE PREREQUISITES
**Timeline:** Before any content production begins
**Estimated Effort:** 15-20 hours

These items block EVERYTHING downstream. No workflow, no script, no visual, no video can proceed until these are resolved.

### 0.1 Legal Compliance (CRITICAL)

| # | Gap | Source Audits | Action | Est. |
|---|-----|-------------|--------|------|
| 0.1.1 | FTC affiliate disclosure rules violate federal law | Brand, Marketing, YouTube | Rewrite affiliate integration rules. Add compliant language to YouTube description template, pinned comment template, and IG bio. Remove "never say affiliate link" rule. Replace with: "Some links below are affiliate links. If you buy through them, I may earn a small commission at no extra cost to you." | 1h |
| 0.1.2 | No AI-generated content disclosure policy | Brand | Define YouTube disclosure compliance for synthetic VO and AI imagery. YouTube requires this for synthetic media. Add disclosure to video descriptions. | 1h |
| 0.1.3 | Nipsey/Dre catalog usage legal risk undocumented | Brand | Document the legal analysis: song titles are not copyrightable, but systematic usage of a discography should be acknowledged as a considered risk. Add a Legal Considerations section to episodes.md. | 30m |

### 0.2 Identity Foundation (CRITICAL)

| # | Gap | Source Audits | Action | Est. |
|---|-----|-------------|--------|------|
| 0.2.1 | No target audience demographics defined | Brand, Marketing, YouTube | Define primary audience (demographics, psychographics, platform behavior). Recommendation: African American men 25-44, urban/suburban, employed or job-seeking, tech-aware but not tech-industry, concerned about AI impact on community. Secondary audience: broader AI-ethics-interested viewers 20-50. | 2h |
| 0.2.2 | Zero validated Red Nose reference images | Visual, Automation, Video Prod | Generate 4 canonical reference images (front face, 3/4 profile, full body, silhouette) using Gemini/Midjourney/DALL-E. Select the most consistent set. Store in `cinema_knowledge/bowtie-bullies/`. | 3h |
| 0.2.3 | ElevenLabs Voice ID is placeholder | Narrative, Automation | Clone or select Tyrone's voice in ElevenLabs. Verify SSML support with the selected voice and `eleven_multilingual_v2` model. Update all docs with actual Voice ID. | 2h |

### 0.3 Pipeline Foundation (CRITICAL)

| # | Gap | Source Audits | Action | Est. |
|---|-----|-------------|--------|------|
| 0.3.1 | Kie.AI API existence unverified | Automation, Video Prod | Verify API access. If no API: identify alternative (RunwayML API, Pika API, Luma Dream Machine). Document findings. This decision affects the entire visual pipeline architecture. | 2h |
| 0.3.2 | YouTube OAuth not configured | Automation, YouTube | Set up Google Cloud project, OAuth consent screen, configure credentials for `youtube.upload` and `youtube.readonly` scopes. Store refresh token securely. | 2h |
| 0.3.3 | FFMPEG WF-05 has Haven copy artifacts | Visual, Brand, Automation | Fix 3 specific issues: (1) Replace Inter Bold + Bebas Neue with Anton + Space Mono + JetBrains Mono. (2) Replace Amber #D4A03C with Rust Orange #9A4C22. (3) Review full WF-05 spec for any other Haven remnants. | 1h |
| 0.3.4 | Install brand fonts on n8n server | Video Prod, Automation | Install Anton, Space Mono, JetBrains Mono on Hostinger n8n Docker container. Verify with `fc-list`. Update pre-flight validation check. | 1h |
| 0.3.5 | Google Drive folder structure undefined | Automation, Video Prod | Create: `BowTie Bullies/{Character Sheets, Music Library, SFX Library, Episodes/EP01-EP22 each with Scripts/VO/Visuals/Assembled/Shorts, Thumbnails, Templates}`. Document folder IDs. | 1h |

---

## PHASE 1: PRODUCTION-READY
**Timeline:** Days 1-7 (before first script enters pipeline)
**Estimated Effort:** 25-35 hours

### 1.1 Narrative & Script Infrastructure

| # | Gap | Source Audits | Action | Est. |
|---|-----|-------------|--------|------|
| 1.1.1 | No standalone shorts script templates | Narrative, Video Prod | Create 3 templates: (1) News Reaction Short (Wed), (2) Deep Dive Short (Fri), (3) Product Short (Sat). Each with SSML rules, caption markup, hook text spec, loop-closing guidance. | 2h |
| 1.1.2 | Episode entries lack scriptable detail | Narrative, Automation | Expand all 22 episodes with: 3-5 talking points, 1 sample cold open, deeper layer angle, recommended list count, emotional register note, key stat/source. | 6-8h |
| 1.1.3 | Only 2 cold open examples exist | Narrative | Create Hook Playbook: 6 archetypes (Second-Person Scenario, Cold Stat, Anecdote, Question, Contradiction, Timestamp) x 3 examples each = 18 hooks. | 3h |
| 1.1.4 | SSML vocabulary limited to 3 pause types | Narrative, Video Prod, Automation | Expand with prosody (volume, rate, pitch), emphasis, say-as, sub. Create SSML cheat sheet with 10+ markup patterns. Map to Tyrone's delivery styles. | 2h |

### 1.2 Visual Asset Infrastructure

| # | Gap | Source Audits | Action | Est. |
|---|-----|-------------|--------|------|
| 1.2.1 | Only 13 B-roll prompts for 80-160 visual needs | Visual, Video Prod | Expand to 50+ prompts: 12 character shots, 15 urban textures, 12 tech/AI, 6 hands/POV, 5 weather/atmosphere. Tag each by episode theme, content pillar, mood, aspect ratio. | 4h |
| 1.2.2 | P3 and P6 pose prompts missing | Visual | Write full generation prompts for P3 (The Companion) and P6 (The Aftermath). Include both 16:9 and 9:16 variants. | 1h |
| 1.2.3 | No 9:16 variant prompts for any pose | Visual | Create 9:16 composition variants for all 6 poses (P1-P6). Adjust framing, subject placement, and vertical environment elements. | 2h |
| 1.2.4 | No intro/outro frame-by-frame spec | Visual, Brand | Spec intro (3-5s): black -> Red Nose P5 fade-in -> head turn -> wordmark slam -> subtitle fade -> hold. Spec outro (5-8s): fade to black -> P4 silhouette -> typewriter wordmark -> subscribe element -> hold. Include audio stinger spec. | 2h |
| 1.2.5 | Channel art has no export specs | Visual, Brand | Define specs for: YouTube banner (2560x1440, safe zone), YouTube profile pic (800x800), YouTube watermark (150x150), IG profile pic (1080x1080), IG highlight covers (1080x1920). | 1h |

### 1.3 Production Pipeline Foundation

| # | Gap | Source Audits | Action | Est. |
|---|-----|-------------|--------|------|
| 1.3.1 | Dynamic FFMPEG command builder needed | Video Prod, Automation | Build `generate-ffmpeg-command.js` utility that accepts a timeline JSON and outputs the complete FFMPEG filter_complex. Support mixed inputs (static images with Ken Burns + video clips). Port Haven WF-006 patterns. | 4h |
| 1.3.2 | Shot list to timeline conversion not automated | Video Prod | Create timeline generation workflow: Whisper timestamps on VO -> map script sections to VO timestamps -> calculate per-section duration -> assign visual type -> output timeline JSON. | 3h |
| 1.3.3 | Whisper word-level timestamps missing | Video Prod, Automation | Add Whisper (or faster-whisper) to pipeline. Run on every VO file after ElevenLabs generation. Output word-level JSON. This unblocks: captions, timeline, splicing, Remotion. **Single highest-impact infrastructure addition.** | 3h |

### 1.4 Marketing Launch Readiness

| # | Gap | Source Audits | Action | Est. |
|---|-----|-------------|--------|------|
| 1.4.1 | No Day 1 traffic source or launch plan | Marketing, YouTube | Define: (1) Pre-launch: IG teaser posts, Reddit presence in target subs. (2) Launch day SOP: community tab -> publish -> pin comment -> respond to all comments 1h -> IG story -> IG post -> shorts cascade at T+2h, T+4h, T+8h. (3) Week 1 seeding: Reddit posts, Twitter/X commentary. | 2h |
| 1.4.2 | No link-in-bio tool for IG | Marketing | Select and configure link-in-bio tool (Stan Store, Linktree, or custom). Connect to: YouTube channel, Amazon storefront, email signup, flagship PDF. | 1h |
| 1.4.3 | No pinned comment strategy | Marketing, YouTube | Create template: Tyrone-voice question that drives engagement + affiliate link (if relevant) + "Full episode" link for shorts. | 30m |

---

## PHASE 2: QUALITY-CRITICAL
**Timeline:** Days 8-21 (before Episode 3 publishes)
**Estimated Effort:** 30-40 hours

### 2.1 Voice & Script Depth

| # | Gap | Source | Action | Est. |
|---|-----|--------|--------|------|
| 2.1.1 | Emotional beat map per episode structure | Narrative | Define standard beat map: Hook=unease, Context=urgency, List=building weight, Deeper Layer=heaviest, The Move=resolve, Close=stillness. Map music moods, delivery speed, and Red Nose behavior to each section. | 3h |
| 2.1.2 | No closing variation system | Narrative | Create rotating system: Primary ("Pay attention") at 50%, Heavy ("I told you"), Question, Marathon callback, Silence-only. | 1h |
| 2.1.3 | No episode-to-episode continuity rules | Narrative | Define callback cadence (every 3-4 episodes), thread tracking (4 narrative threads across seasons), teaser convention, season arc beats. | 2h |
| 2.1.4 | No community engagement voice spec | Narrative, Brand | Define text voice rules, comment reply templates (5-6 patterns), community post templates (poll, question, hot take), platform-specific adaptation. | 3h |
| 2.1.5 | AI/tech translation table too small (10 entries) | Narrative | Expand to 40-50 entries organized by topic cluster: surveillance, economics, healthcare, AGI, digital survival, general AI. | 3h |
| 2.1.6 | No Tyrone backstory bible | Narrative, Brand | Create 1-page document: 10-15 canonical facts, 5-6 recurring people, Tyrone-Red Nose timeline, experienced vs. witnessed vs. heard about. | 2h |
| 2.1.7 | No profanity/language boundary rules | Narrative, Brand | Define: tier system (Never/Rare/Common), first-30-second YouTube rule, AAVE guidelines, title/metadata rules. | 1h |
| 2.1.8 | No off-limits topics for Tyrone | Brand | Define content boundaries: what Tyrone never touches (partisan politics, conspiracy without evidence, specific individuals by name without factual basis). Crisis/emergency response protocol. | 2h |

### 2.2 Visual System Hardening

| # | Gap | Source | Action | Est. |
|---|-----|--------|--------|------|
| 2.2.1 | FFMPEG color grade not validated | Visual, Video Prod | Generate 10 test images, apply filter chain, compare against brand look. Define 3 grade variants: Standard, Dark Scene, Screen Capture. Add ffprobe luminance check. | 2h |
| 2.2.2 | No 9:16 graphic element specs | Visual | Add 9:16 position/size variants for all 5 overlay types (lower thirds, data overlays, stat callouts, quote cards, product overlays). | 2h |
| 2.2.3 | No 16:9 caption burn-in spec | Visual | Define: Space Mono 36-44px, Bone White with shadow, bottom center 80px up, 42 chars/line max, 2 lines max. | 30m |
| 2.2.4 | Negative prompts inconsistent across docs | Visual, Brand | Synchronize: visual guide version is canonical (includes "human face"). Add B-roll negative prompt block. | 30m |
| 2.2.5 | WCAG contrast failures documented | Visual | Restrict Rust Orange to large text only (48px+). Ash Gray never carries meaningful content alone. Consider Copper (#C4713B) for smaller accent text. | 1h |

### 2.3 YouTube Optimization

| # | Gap | Source | Action | Est. |
|---|-----|--------|--------|------|
| 2.3.1 | No watch time optimization strategy | YouTube | Design retention anchors at 0:30 (micro-CTA), 2:00 (first value), 3:00 (open loop), 5:00 (pattern interrupt), 7:00 (re-engagement), 8:30 (deeper layer payoff). | 2h |
| 2.3.2 | Shorts-to-long-form funnel undefined | YouTube, Marketing | Every short description starts with parent video link. Pin comment with link. Shorts thumbnails visually connect to parent. Create branded "BOWTIE MINUTE" series for original shorts. | 1h |
| 2.3.3 | No first 48-hour launch strategy | YouTube, Marketing | Create Launch Day SOP: T-24h community post, T-2h IG story, T-0 publish + pin comment, T+1h respond to all comments + first short, T+2h IG post, T+4h second short, T+24h review CTR/AVD, T+48h assessment. | 2h |
| 2.3.4 | No playlist strategy | YouTube | Create 8 launch playlists: Season 1/2/3, AI & The System, Bigger Picture, Start Here, News Reactions, The Gear. Define naming, covers, ordering. | 1h |
| 2.3.5 | Title formulas don't cover episode titles | YouTube | Create dual-title system: EPISODE TITLE (cultural reference, on-screen) + YOUTUBE TITLE (SEO-optimized, formula-driven). Add "YouTube Title" field to Airtable. | 2h |
| 2.3.6 | Description template incomplete for SEO | YouTube | Expand: 150-char hook with keyword, summary with keyword, validated chapters, affiliate links with FTC disclosure, related video links, keyword paragraph, max 3 hashtags. | 1h |
| 2.3.7 | No end screen design | YouTube | Design branded template: Dark Steel bg, Red Nose silhouette left, two video slots right, subscribe button bottom-right. 15 seconds. | 1h |

### 2.4 Production Pipeline Completion

| # | Gap | Source | Action | Est. |
|---|-----|--------|--------|------|
| 2.4.1 | Audio ducking/sidechain not spec'd | Video Prod | Implement sidechain compression in FFMPEG or segment-based volume automation from script pause markers. Test sidechaincompress filter availability on Hostinger. | 2h |
| 2.4.2 | Image QC loop not defined for WF-04 | Video Prod, Automation | Port Haven's Gemini Vision scoring loop: 5-criteria scorer, threshold 7/10, max 3 retries. Adapt criteria for Red Nose markers. | 2h |
| 2.4.3 | Music library not curated | Video Prod | Pre-download 20 tracks from Epidemic Sound (4 per mood: Dark Ambient, Sparse Drums, Melancholy Keys, Tension, Contemplative). Optimize per audio pattern. Store in Drive. | 3h |
| 2.4.4 | No audio normalization in pipeline | Video Prod | Add `loudnorm=I=-14:TP=-1.5:LRA=11` as final mastering step after FFMPEG assembly. | 30m |
| 2.4.5 | IG API publishing limitations | Automation | Evaluate: direct API (complex, requires Facebook Business account) vs. third-party (Buffer/Later) vs. manual with n8n-generated assets. Make a decision and document. | 2h |

### 2.5 Brand Infrastructure

| # | Gap | Source | Action | Est. |
|---|-----|--------|--------|------|
| 2.5.1 | No brand system files for pptx-generator | Brand | Create `brands/bowtie-bullies/` with: brand-system.md, brand.json (colors, fonts, assets), config.json, tone-of-voice.md (condensed from voice guide). | 3h |
| 2.5.2 | Red Nose character rules split across 3 docs | Brand | Create consolidated Red Nose Character Bible: physical description, behavioral vocabulary (20 scenarios, 12 actions), pose library, negative prompts, consistency markers, generation tips. Designate as single canonical source. | 2h |
| 2.5.3 | No logo system defined | Brand | Design Red Nose silhouette + "BOWTIE BULLIES" wordmark lockup. Define: horizontal, stacked, icon-only versions. Minimum size, clear space, mono version. | 2h |

---

## PHASE 3: SCALE-READY
**Timeline:** Days 22-60 (through end of Month 2)
**Estimated Effort:** 25-35 hours

### 3.1 Narrative Polish

| # | Gap | Action | Est. |
|---|-----|--------|------|
| 3.1.1 | Red Nose behavioral scripts incomplete (6 of 20+ needed) | Expand to 20 scenarios + 12 discrete actions. Create "Red Nose Shot List" for WF-04. | 2h |
| 3.1.2 | No transition dialogue patterns between sections | Write 2-3 options per section boundary (10-15 total) with SSML markup. | 2h |
| 3.1.3 | No news reaction script template | Create template: Hook headline (10s), Context (2-3 sentences), Take (2-3 sentences), Landing (1 sentence), Close. | 1h |
| 3.1.4 | No narrative arc overlay on list structure | Define: Question -> Stakes -> Evidence -> Turn -> Agency -> Resolution. | 2h |
| 3.1.5 | "The Deeper Layer" has least guidance despite being most important section | Create playbook: 5 example passages, historical pattern connections per topic, personal depth rules, SSML for this section. | 3h |
| 3.1.6 | No voice correction sheet (anti-patterns) | Write 10 before/after pairs showing off-brand vs. on-brand script lines. | 2h |

### 3.2 Marketing Expansion

| # | Gap | Action | Est. |
|---|-----|--------|------|
| 3.2.1 | No email service provider or lead magnet | Select ESP (ConvertKit/Beehiiv). Spec mini lead magnet (3-5 page free version). Design 5-7 email welcome sequence in Tyrone's voice. | 4h |
| 3.2.2 | No IG carousel strategy | Design 5-slide carousel template in brand aesthetic. Create first 4 carousels from existing episode content. | 3h |
| 3.2.3 | No Reddit presence strategy | Build Reddit account. Identify 6-8 target subreddits. Define karma-building plan and content-first approach. | 2h |
| 3.2.4 | No collaborator target list | Research 20 channels in adjacent niches (AI, privacy, urban culture, tech commentary) with 10K-500K subs. Create outreach template in brand voice. | 3h |
| 3.2.5 | No keyword research methodology | Set up TubeBuddy or vidIQ. Research long-tail keywords for first 8 episodes. Define search vs. browse content strategy. | 3h |
| 3.2.6 | TikTok/Twitter/LinkedIn not addressed | Make platform decisions: (1) TikTok: cross-post shorts (near-zero marginal cost), (2) Twitter/X: Tyrone hot takes + clip sharing, (3) LinkedIn: defer to Month 6+. Document reasoning. | 1h |
| 3.2.7 | No content repurposing matrix | Define full matrix per video: 5-8 shorts, 3-5 reels, 2-3 carousels, 1 IG story series, 4-6 community posts, 2-3 tweets, 1 email newsletter. | 1h |

### 3.3 Automation Maturity

| # | Gap | Action | Est. |
|---|-----|--------|------|
| 3.3.1 | No master orchestrator or health monitoring | Build daily health check workflow: verify all 8 workflows active, check last execution status, count Airtable records by status, detect stuck items. | 3h |
| 3.3.2 | Airtable schema missing Music table, views, automations | Add Music table (Track, File URL, Mood, BPM, Duration, License). Create views: Editorial Calendar, Production Pipeline, QA Queue. Configure status-change automations. | 2h |
| 3.3.3 | Error propagation strategy undefined | Define: per-workflow error branches with Airtable status updates. Dead letter queue for stuck items. Human escalation webhook. | 2h |
| 3.3.4 | No Remotion integration for graphics layer | Create Remotion compositions: LowerThird, TelemetryOverlay, StatCallout, QuoteCard, ProductOverlay, CaptionTrack. Render as transparent video, composite with FFMPEG. | 6h |
| 3.3.5 | WF-02 system prompt not engineered | Compress 346-line voice guide into an effective 50-100 line system prompt. Add episode-type branching (Long-Form vs. News Reaction vs. Short). Add JSON schema validation for shorts breakdown output. | 3h |

### 3.4 Monetization Infrastructure

| # | Gap | Action | Est. |
|---|-----|--------|------|
| 3.4.1 | Survival Guide PDF not spec'd | Define: table of contents, 30-40 pages, 10 chapters covering digital survival basics. Design in brand aesthetic. Price at $9.99 on Stan Store. | 4h |
| 3.4.2 | No ad-friendly content review process | Create pre-publish checklist for YouTube ad-friendliness. List words/phrases to avoid in titles/tags. Define appeal process for incorrect classifications. | 1h |
| 3.4.3 | No KPI targets per growth phase | Define Month 1/3/6/12 targets: views/video, AVD%, CTR%, sub conversion rate, affiliate CTR, RPM, comments/video. | 1h |
| 3.4.4 | No UTM parameter naming convention | Define: `?tag=btb-ep{##}-{product-slug}`. Apply to all affiliate links. | 30m |

---

## PHASE 4: OPTIMIZATION
**Timeline:** Month 3-6
**Estimated Effort:** 20-30 hours

| # | Gap | Action | Est. |
|---|-----|--------|------|
| 4.1 | No collaboration/guest voice rules | Define voice interaction rules, collab format for faceless channel, approved/off-limits categories. | 1h |
| 4.2 | No live stream voice adaptation | Define live voice mode: faster WPM, conversational structure, pre-scripted bookends, rotating Red Nose stills. | 2h |
| 4.3 | Thumbnail A/B testing strategy | Define protocol: 2 variants per video for first 12, measure after 2K impressions, log to Airtable. | 2h |
| 4.4 | YouTube Membership tiers | Design 3 tiers: Watch ($2.99), Marathon ($4.99), Aftermath ($14.99). Badge design with tier-specific bowtie color. | 2h |
| 4.5 | VPN/privacy affiliate programs | Sign up for NordVPN, ExpressVPN, or Surfshark affiliate. Higher commission than Amazon ($3-12/signup). Natural content fit. | 2h |
| 4.6 | Direct brand affiliate relationships | Identify and pitch 5-10 brands (Faraday bag manufacturers, solar charger companies, VPNs, trade schools) for direct affiliate at 15-40% vs. Amazon's 3-8%. | 3h |
| 4.7 | Merch design + platform | Select platform (Printful/Spring). Design 5 initial products: Red Nose tee, "Pay Attention" hoodie, bowtie sticker, phone case, poster. | 4h |
| 4.8 | Trademark research | Conduct basic trademark search for "BowTie Bullies." Document findings and decide on registration. | 2h |
| 4.9 | Data visualization sub-palette | Define 4-6 colors for charts/graphs: Positive=Moss, Negative=Deep Red, Neutral=Ash Gray, Primary=Rust Orange, Secondary=Copper, Grid=Gunmetal. | 1h |
| 4.10 | Seasonal thumbnail differentiation | Define accent color per season: S1=Rust Orange, S2=Copper, S3=Moss. Add subtle season badge (JetBrains Mono 18px, Ash Gray). | 1h |

---

## DEPENDENCY MAP

```
Phase 0
  |
  |-- 0.2.2 Red Nose reference images
  |     |-- 1.2.1 B-roll prompt expansion (needs reference for consistency)
  |     |-- 2.4.2 Image QC loop (scores against reference)
  |
  |-- 0.2.3 ElevenLabs Voice ID
  |     |-- 1.3.3 Whisper timestamps (needs VO to process)
  |     |     |-- 1.3.2 Timeline generation (needs timestamps)
  |     |     |-- 2.3.2 Shorts splice (needs timestamps)
  |     |     |-- 3.3.4 Remotion captions (needs timestamps)
  |     |-- 2.4.1 Audio ducking (needs VO to mix)
  |
  |-- 0.3.1 Kie.AI API verification
  |     |-- 1.3.1 FFMPEG command builder (needs to know input types)
  |     |-- 2.4.2 Image QC loop (different for video vs. image)
  |
  |-- 0.3.2 YouTube OAuth
  |     |-- 2.3.3 Launch strategy (needs publishing capability)
  |
  |-- 1.1.2 Episode scriptable detail
  |     |-- 1.1.3 Cold open examples (drawn from episodes)
  |     |-- Every script generated by WF-02
  |
  |-- 1.3.3 Whisper timestamps (CRITICAL PATH)
        |-- Captions
        |-- Timeline generation
        |-- Shorts splicing
        |-- Remotion caption rendering
```

**Critical Path:** Phase 0 prerequisites -> Episode expansion (1.1.2) + Whisper (1.3.3) -> Timeline builder (1.3.2) -> FFMPEG assembler (1.3.1) -> First video

---

## EFFORT SUMMARY

| Phase | Timeline | Estimated Hours | Items |
|-------|----------|----------------|-------|
| Phase 0: Prerequisites | Before production | 15-20h | 10 items |
| Phase 1: Production-Ready | Days 1-7 | 25-35h | 17 items |
| Phase 2: Quality-Critical | Days 8-21 | 30-40h | 24 items |
| Phase 3: Scale-Ready | Days 22-60 | 25-35h | 18 items |
| Phase 4: Optimization | Month 3-6 | 20-30h | 10 items |
| **TOTAL** | **6 months** | **115-160h** | **79 items** |

---

## TOP 10 HIGHEST-IMPACT ACTIONS (RANKED)

These are the 10 actions that unblock the most downstream work or address the highest-severity cross-domain gaps.

| Rank | Action | Why |
|------|--------|-----|
| **1** | Fix FTC affiliate disclosure (0.1.1) | Federal law compliance. Non-negotiable. |
| **2** | Generate Red Nose reference images (0.2.2) | Every visual in every format depends on character consistency |
| **3** | Obtain ElevenLabs Voice ID (0.2.3) | Blocks all VO generation, which blocks all video production |
| **4** | Implement Whisper timestamps (1.3.3) | Single addition unblocks 4 downstream gaps: captions, timeline, splicing, Remotion |
| **5** | Expand episode entries with scriptable detail (1.1.2) | 22 episodes cannot be scripted without this; blocks entire content calendar |
| **6** | Fix FFMPEG Haven artifacts (0.3.3) | Wrong fonts + wrong color = broken automation for every video |
| **7** | Define target audience (0.2.1) | Foundational to all content, marketing, and optimization decisions |
| **8** | Build timeline generation workflow (1.3.2) | Bridges the gap between "script with visual directions" and "FFMPEG command" |
| **9** | Create Day 1 launch plan (1.4.1) | Production without distribution = zero views. The machine needs an audience. |
| **10** | Expand B-roll prompt library to 50+ (1.2.1) | 13 prompts for 80-160 visuals = visual repetition by Week 2 |

---

## THE BOTTOM LINE

The BowTie Bullies brand documents are **exceptional on creative vision**. The voice is distinct, the character is compelling, the visual system is thorough, the episode architecture is ambitious, and the automation pipeline is well-conceived.

**The gaps are in three layers:**

1. **Legal/Compliance** -- FTC disclosure, AI content disclosure, trademark. These are non-negotiable and must be fixed before Day 1.

2. **Execution depth** -- The system describes WHAT to build but many specs lack the HOW detail needed for automation. Episode entries need more script-ready detail, SSML needs more markers, B-roll needs more prompts, font specs need to be correct.

3. **Go-to-market** -- The production system is over-engineered relative to the distribution system. 8 n8n workflows for building content, zero for getting it in front of people. Marketing gaps are concentrated in: launch strategy, email, multi-platform presence, and revenue diversification.

Close the 18 CRITICAL gaps and the pipeline can run. Close the 45 HIGH gaps and the brand will maintain consistency at scale. The MEDIUM and LOW gaps compound quality over time.

The brand is ready. The system needs the execution layer built.

---

*"The specs know what the video should feel like. This document tells you what to build first."*
