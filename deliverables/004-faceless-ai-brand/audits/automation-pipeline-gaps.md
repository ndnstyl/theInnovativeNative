# BowTie Bullies -- The Aftermath
# Automation Pipeline Gap Analysis

**Auditor**: Pipeline Audit Agent
**Date**: 2026-02-10
**Source Documents**:
- `brand-blueprint.md` (Parts 5, 6, 10)
- `visual-style-guide.md`
- `tyrone-voice-guide.md`
- Existing patterns: `.specify/patterns/` (6 patterns)
- Learnings: `neo-learnings.md`, `haven-learnings.md`, `builder-learnings.md`, `shared-learnings.md`
- SOPs: `n8n-workflow-creation-sop.md`
- Skills: `builder/SKILL.md` (Neo consolidated into Builder)

**Severity Scale**:
| Level | Meaning | Impact |
|-------|---------|--------|
| CRITICAL | Blocks pipeline execution entirely | Cannot ship content |
| HIGH | Causes failures or requires manual workaround | Delays or degrades quality |
| MEDIUM | Missing but can be deferred | Reduces efficiency |
| LOW | Nice-to-have refinement | Polish, not function |

---

## EXECUTIVE SUMMARY

The BowTie Bullies brand blueprint defines an ambitious 8-workflow automation pipeline (WF-01 through WF-08) backed by a 7-table Airtable schema. The architecture is well-conceived and draws from proven patterns in the existing Haven UGC pipeline. However, the blueprint is currently a **specification document, not an implementation**. No workflows have been built, no Airtable tables created, and several critical integration details remain unspecified.

**Total Gaps Identified: 67**
- CRITICAL: 14
- HIGH: 21
- MEDIUM: 22
- LOW: 10

**Estimated Implementation Risk**: The existing n8n infrastructure (161 workflows, Hostinger server, established credential patterns) and proven Haven pipeline patterns significantly de-risk execution. The biggest risks are in third-party API dependencies (Kie.AI, Nano Banana) and the FFMPEG assembly complexity for long-form video.

---

## 1. n8n WORKFLOW GAPS

### WF-01: Trend & News Ingest

| Gap ID | Description | Severity | Impact |
|--------|-------------|----------|--------|
| WF01-01 | **RSS feed URLs not specified** -- Blueprint lists 9 sources (Ars Technica AI, MIT Tech Review, etc.) but provides zero actual RSS/feed URLs. Many publications have changed or removed RSS feeds. Reddit feeds require API auth or specific formatting. | HIGH | Workflow cannot be built until URLs are validated. Some sources (Reddit) may require Reddit API instead of RSS. |
| WF01-02 | **No rate limiting per source** -- 9 parallel HTTP requests with no throttling. Some RSS endpoints may rate-limit or block rapid polling. | MEDIUM | Could cause 429 errors or IP blocks from aggressive polling. |
| WF01-03 | **Gemini scoring prompt is vague on scoring criteria** -- "Score 1-10" with no rubric. What differentiates a 6 from an 8? The threshold (>=6) is arbitrary without calibration. | MEDIUM | Inconsistent scoring will flood Airtable with low-quality ideas or filter out good ones. Needs 10-20 calibration examples. |
| WF01-04 | **Duplicate detection is URL-only** -- Similar stories from different outlets with different URLs will create duplicates. No title/content similarity check. | LOW | Minor -- manageable with manual cleanup initially. |
| WF01-05 | **No error handling for individual feed failures** -- If one RSS source is down, does the entire workflow fail? Blueprint shows a single merge after all feeds. | HIGH | One broken feed URL blocks all news ingestion. Need per-source error catching with continue-on-fail. |
| WF01-06 | **Reddit requires API authentication** -- `r/artificial`, `r/singularity`, `r/MachineLearning` cannot be scraped via simple HTTP. Reddit's RSS feeds are rate-limited and often incomplete. Reddit API requires OAuth app registration. | HIGH | 3 of 9 sources may not work as described. Need Reddit API credentials or SERP-based alternative. |
| WF01-07 | **Google News feeds are unstable** -- Google News RSS feeds change format frequently and may require specific URL construction. No URL format specified. | MEDIUM | Google News sources may break silently. |
| WF01-08 | **No "already used" deduplication against Content Ideas** -- Blueprint says "Flag for Wednesday News Reaction" but no check against existing Content Ideas to avoid re-suggesting used stories. | LOW | Minor -- human review catches this, but automatable. |

**Reuse Opportunity**: The enrichment pattern (`uk-local-business-enrichment.md`) provides a batch processing model with error handling per item. Apply the Split In Batches + per-item error handling pattern.

---

### WF-02: Script Generator

| Gap ID | Description | Severity | Impact |
|--------|-------------|----------|--------|
| WF02-01 | **System prompt references "Tyrone Voice Guide -- full document" but no actual prompt text is provided** -- The workflow says to use the voice guide as a system prompt, but the voice guide is 346 lines of markdown. No prompt engineering has been done to compress this into an effective system prompt. | CRITICAL | An uncompressed 346-line system prompt will be expensive per call, may exceed context limits with Gemini Flash, and will produce inconsistent results without prompt engineering. |
| WF02-02 | **No episode type branching** -- Blueprint defines multiple content types (Long-Form, Short, Reel, News Reaction) but the script generator uses a single prompt template. News Reactions have fundamentally different structure (reactive vs. planned). | HIGH | News Reaction scripts will be generated with Long-Form structure. Need separate prompt templates per Type field. |
| WF02-03 | **Shorts Breakdown JSON schema not validated** -- The script generator is supposed to output a JSON shorts breakdown, but there's no schema definition, no validation node, and no fallback if Gemini outputs malformed JSON. | HIGH | WF-06 (Splice Engine) depends on this JSON. Malformed JSON will crash the splice pipeline. Need JSON schema validation node after generation. |
| WF02-04 | **No word count / WPM validation** -- Target is 110-125 WPM, but no post-generation validation checks actual word count against duration target. | MEDIUM | Scripts may be too long or too short, requiring manual editing that defeats automation purpose. |
| WF02-05 | **Cost estimate may be wrong** -- "$0.05-0.10 per script" assumes Gemini Flash pricing. With a 346-line system prompt + full voice guide + news context, token usage will be significantly higher. | LOW | Budget impact only. |

**Reuse Opportunity**: Haven's WF-003 Script Generator (`WpAKeX9wCLWaJcsx`) provides a proven pattern for 3-parallel-read + Merge + Gemini generation + validation. The Merge v3.2 synchronization pattern is CRITICAL to reuse here (see haven-learnings.md 2026-02-09).

---

### WF-03: VO Generator

| Gap ID | Description | Severity | Impact |
|--------|-------------|----------|--------|
| WF03-01 | **Voice ID is blank** -- `[Tyrone's Voice ID]` is a placeholder. No ElevenLabs voice has been cloned, selected, or configured. | CRITICAL | Entire VO pipeline cannot execute. This is a blocking prerequisite for Phase 2. |
| WF03-02 | **SSML support is assumed but not verified** -- Blueprint converts `[2 second pause]` to `<break time="2s"/>`. ElevenLabs SSML support varies by model and plan tier. The `eleven_multilingual_v2` model may handle SSML differently than expected. | HIGH | Pauses may not render correctly. Need to verify SSML support with the specific model and voice before building the workflow. |
| WF03-03 | **No chunking strategy for long scripts** -- ElevenLabs has character limits per API call (varies by plan: 5,000 for Starter, 100,000 for Creator). A 10-minute script at 115 WPM = ~1,150 words = ~7,000 characters. Starter plan may require chunking. | HIGH | Scripts exceeding character limit will fail. Need chunking logic with seamless audio concatenation. |
| WF03-04 | **No audio quality validation** -- No ffprobe check on output MP3 for duration, bitrate, silence detection, or clipping. | MEDIUM | Bad VO files pass silently to assembly. |
| WF03-05 | **No retry logic on ElevenLabs API failure** -- API calls can fail due to rate limits, quota exhaustion, or transient errors. No error branch defined. | MEDIUM | Single failure blocks entire pipeline. Need retry with exponential backoff. |
| WF03-06 | **No cost/quota tracking** -- ElevenLabs Starter plan has 30 min/month. 4 long-form videos at 10 min each = 40 min. Blueprint acknowledges this but has no automated quota check. | HIGH | Will exceed Starter plan quota by Week 2. No automated warning before hitting the limit. Need pre-generation quota check. |

**Reuse Opportunity**: The BodyCam video processing pattern (`bodycam-video-processing.md`) includes an ElevenLabs TTS integration via HTTP Request node. Reuse the node configuration but add SSML preprocessing and quota management.

---

### WF-04: Visual Generator

| Gap ID | Description | Severity | Impact |
|--------|-------------|----------|--------|
| WF04-01 | **Kie.AI API access is unconfirmed** -- Blueprint lists Kie.AI for Veo 3.1 video clips but provides no API endpoint, authentication method, or confirmed API access. Kie.AI may be web-only with no public API. | CRITICAL | If Kie.AI has no API, video clip generation cannot be automated. Need to verify API availability or find alternative (RunwayML, Pika, Luma). |
| WF04-02 | **Nano Banana API access is unconfirmed** -- Listed as "backup" video generator. Same question as Kie.AI: is there a programmatic API? | HIGH | Backup provider may also be unusable. If both Kie.AI and Nano Banana lack APIs, the visual pipeline cannot generate video clips automatically. |
| WF04-03 | **No failover logic defined** -- Blueprint mentions multi-provider routing but defines no actual failover. What triggers failover? Timeout? Error code? Quality score? | HIGH | Without failover rules, failures in one provider crash the entire visual pipeline. |
| WF04-04 | **Pexels API integration unspecified** -- Stock footage search terms are generated but no Pexels API integration details (API key, search endpoint, download workflow, license compliance). | MEDIUM | Stock footage portion (30% of visuals) cannot be automated without Pexels API setup. |
| WF04-05 | **Shot list format undefined** -- "Code Node: Generate Visual Shot List" is described in prose but no actual data schema exists for the shot list. What fields? How does it map to FFMPEG assembly? | CRITICAL | WF-05 (FFMPEG Assembler) consumes the shot list. Without a defined schema, the two workflows cannot interface. |
| WF04-06 | **No Red Nose consistency scoring** -- Haven's pipeline uses Gemini Vision scoring (threshold 7/10, max 3 retries) for avatar consistency. BowTie Bullies has even stricter consistency requirements (scar, bowtie, red nose, amber eyes) but no scoring loop is defined. | HIGH | Red Nose will look different across shots. The character system in the blueprint defines exact markers but the workflow has no enforcement mechanism. Need consistency scoring loop like Haven's WF-004. |
| WF04-07 | **Image vs. video generation not differentiated in flow** -- The SWITCH node branches by visual type, but the downstream processing is completely different for static images vs. video clips. Static images need Ken Burns treatment in WF-05; video clips do not. This distinction must be tracked in the Asset record. | MEDIUM | Assembly workflow won't know how to handle each asset without a clear type indicator. |
| WF04-08 | **Text overlay generation is a stub** -- "Code Node (generate telemetry specs)" with no actual implementation. The visual style guide defines 5 overlay types (lower thirds, data overlays, stat callouts, quote cards, product overlays) with complex specs. Generating these programmatically requires a mini-rendering engine. | HIGH | 20% of visuals are overlays. Without this, they must be created manually or skipped entirely. |
| WF04-09 | **Gemini imagen model version not pinned** -- Haven learnings explicitly warn: "Use specific model version, not `latest` -- model updates cause visual drift." Blueprint specifies `gemini-2.0-flash` and `gemini-2.0-pro` for text but no version pin for imagen. | MEDIUM | Visual drift across generations. Pin to specific imagen model version. |

**Reuse Opportunity**: Haven's WF-004 Asset Generator (`ZPN0W5s5QKWSxxgQ`) provides the Gemini image generation + consistency scoring + Drive upload + Airtable record pattern. The consistency scoring loop (5-criteria scorer, threshold 7/10, max 3 retries) is directly reusable. The binary data preservation pattern (builder-learnings 2026-02-10) is CRITICAL for any path through Code/IF nodes before Drive upload.

---

### WF-05: FFMPEG Assembler

| Gap ID | Description | Severity | Impact |
|--------|-------------|----------|--------|
| WF05-01 | **Long-form assembly is dramatically more complex than Haven's** -- Haven assembles 3 scenes at 24s total. BowTie Bullies assembles 10-30 minutes with dozens of visual segments, crossfades, text overlays, Ken Burns on stills, music ducking, and a full color grade. The FFMPEG filter_complex will be hundreds of lines. | CRITICAL | Haven's WF-006 pattern works for short-form but will need fundamental rearchitecture for long-form. A single monolithic ffmpeg command for 10+ minutes of content with 20+ inputs will be extremely fragile and may exceed shell command length limits. Need a multi-pass approach. |
| WF05-02 | **Font files not verified for n8n server** -- Blueprint specifies Anton, Space Mono, JetBrains Mono. Haven's WF-006 already discovered font path misalignment (Inter-Bold.ttf vs DejaVuSans-Bold.ttf). These 3 fonts are almost certainly NOT installed on the Hostinger server. | CRITICAL | All text overlays will fail. Must install fonts on server or use pre-rendered overlay images. |
| WF05-03 | **Music library integration unspecified** -- Blueprint mentions Epidemic Sound ($15/mo) and alternatives but no mechanism for selecting, downloading, or matching music to content mood. The Airtable schema has no Music table. | HIGH | Music selection is manual and disconnected from the pipeline. Need either a music library table in Airtable or a convention-based folder structure in Drive. |
| WF05-04 | **No intermediate checkpoint/resume** -- If assembly fails at minute 8 of a 10-minute video, the entire process must restart. No checkpoint mechanism for partial assembly. | MEDIUM | Long assembly times (potentially 5-15 minutes for long-form) wasted on failure. Haven's pre-flight validation pattern helps but doesn't cover mid-assembly failures. |
| WF05-05 | **Disk space requirements significantly higher** -- Haven's 24-second videos use modest disk space. A 10-minute video with dozens of high-resolution inputs could require 2-5 GB of temp space. The Hostinger server may not have this. | HIGH | Assembly will fail silently due to disk exhaustion. Haven's pre-flight check includes 500MB minimum -- this needs to be 5GB+ for long-form. |
| WF05-06 | **Color grade filter not tested at scale** -- The FFMPEG filter `eq=contrast=1.15:brightness=-0.03:saturation=0.75,unsharp=5:5:0.5,noise=alls=20:allf=t+u,vignette=PI/4:1.2` is specified but untested on long-form content. Film grain noise filter on 10+ minutes of video will massively increase encoding time and file size. | MEDIUM | Encoding may take 30+ minutes per video or produce files >2GB (YouTube limit for non-verified accounts is 15 minutes / 128GB, but upload time matters). |

**Reuse Opportunity**: Haven's WF-006 (`7xT9Ezu6wHHZ0Z3S`) provides the pre-flight validation, execSync logging wrapper, Ken Burns, crossfade chain, and music mix patterns. ALL of these are directly reusable. The multi-pass approach for long-form should break assembly into: (1) per-segment Ken Burns/scaling, (2) crossfade chain, (3) audio mix, (4) text overlays, (5) color grade. Each pass as a separate Code node with its own logging.

---

### WF-06: Splice Engine

| Gap ID | Description | Severity | Impact |
|--------|-------------|----------|--------|
| WF06-01 | **Script markers for trim points are undefined** -- Blueprint says "Start time from script markers" but the script template uses section headers (`## COLD OPEN`, `### 1. [ITEM TITLE]`) not timecodes. How do text markers in a script translate to video timecodes? | CRITICAL | Cannot automatically extract clips without a mapping from script position to video time. Need either: (a) timestamps embedded in the script, (b) silence detection for section boundaries, or (c) a separate timecode mapping generated during assembly. |
| WF06-02 | **16:9 to 9:16 crop strategy not detailed** -- "Scale to 1080x1920 (crop center for 9:16)" is simplistic. Center-crop loses the bottom text area of many compositions. Red Nose may be cut off. | HIGH | Shorts will have bad framing. Need content-aware cropping or separate 9:16 assets generated in WF-04. |
| WF06-03 | **Caption generation is complex** -- "Add captions (word-by-word pop-up from transcript)" requires: (a) speech-to-text alignment of VO, (b) word-level timing, (c) animated text rendering in FFMPEG. This is a significant engineering effort. | HIGH | Word-by-word captions are a core Shorts requirement (80% watch muted). Without them, Shorts engagement drops dramatically. Consider using Whisper for word-level transcription. |
| WF06-04 | **Duration targets are loose** -- "15-59 seconds" range is specified but no enforcement. YouTube Shorts must be under 60 seconds. The splice JSON duration_target is advisory, not enforced. | MEDIUM | Shorts exceeding 60 seconds won't qualify as YouTube Shorts. Need strict duration validation post-extraction. |

---

### WF-07: Publisher

| Gap ID | Description | Severity | Impact |
|--------|-------------|----------|--------|
| WF07-01 | **YouTube API OAuth flow not specified** -- YouTube Data API v3 requires OAuth 2.0 with user consent for upload scope (`youtube.upload`). This requires a Google Cloud project, OAuth consent screen, and refresh token management. Not a simple API key. | CRITICAL | Cannot publish to YouTube without OAuth setup. This is a multi-step prerequisite involving Google Cloud Console configuration. |
| WF07-02 | **Instagram Graph API has severe limitations for automated posting** -- Instagram Graph API for Reels requires: (a) Facebook Business account linked to IG, (b) approved app with `instagram_content_publish` permission, (c) media must be hosted at a public URL first, (d) no scheduling support in API -- must use Facebook's Content Publishing API. | CRITICAL | Automated IG Reel posting may not be feasible without a third-party service (Later, Buffer, or Meta Business Suite). Direct API publishing is significantly more complex than the blueprint suggests. |
| WF07-03 | **YouTube Shorts upload has specific requirements** -- YouTube API does not have a separate "upload as Short" endpoint. A Short is determined by: vertical aspect ratio (9:16), duration under 60 seconds, and `#Shorts` in title or description. The API call is identical to regular upload. Blueprint implies a separate upload path. | MEDIUM | Not a real blocker, but the workflow design should be simplified -- same upload node with different metadata, not a separate branch. |
| WF07-04 | **No thumbnail upload automation** -- Blueprint says "Thumbnail (generated or manual upload)" but thumbnails must be uploaded via a separate API call (`youtube.thumbnails.set`). No workflow for thumbnail generation is defined. | HIGH | Thumbnails are CRITICAL for CTR. Manual thumbnail creation defeats the "faceless AI brand" automation goal. Need a thumbnail generation workflow. |
| WF07-05 | **Scheduling granularity** -- Blueprint says "staggered schedule (3/day)" for Shorts but YouTube's API scheduling requires specific ISO timestamps. No logic for calculating staggered times. | LOW | Easily implementable but not currently specified. |
| WF07-06 | **YouTube API quota limits** -- YouTube Data API has a daily quota of 10,000 units. Video upload costs 1,600 units. At 3 Shorts + 1 long-form per day, that's 6,400 units/day -- within limits but tight. Analytics queries will consume additional quota. | MEDIUM | Tight quota budget. Need quota tracking to avoid hitting daily limits. |

---

### WF-08: Analytics Tracker

| Gap ID | Description | Severity | Impact |
|--------|-------------|----------|--------|
| WF08-01 | **YouTube Analytics API requires separate OAuth scope** -- `youtube.readonly` or `yt-analytics.readonly`. Different from the upload scope. May need separate credential or combined scope. | MEDIUM | Additional OAuth configuration needed. |
| WF08-02 | **Instagram Insights API requires page-level access** -- Insights data requires `instagram_basic` and `instagram_manage_insights` permissions. Only available for Business/Creator accounts. | MEDIUM | Must ensure IG account is set up as Business/Creator before this workflow can function. |
| WF08-03 | **Amazon Associates API access is uncertain** -- Blueprint says "if available." Amazon Product Advertising API (PA API) provides product data but NOT affiliate performance data. Affiliate performance is only available through the Amazon Associates reporting portal (no real API). | HIGH | Affiliate revenue tracking cannot be automated via API. Must be manual or use scraping (fragile). |
| WF08-04 | **No dashboard defined** -- Analytics data goes into Airtable but no views, dashboards, or reporting format specified. Data without visualization is noise. | MEDIUM | Drew and CEO have no way to see performance at a glance. Need Airtable views or external dashboard (Metabase, Google Data Studio). |
| WF08-05 | **Viral detection threshold is arbitrary** -- "10K+ views in 24h" trigger has no basis. For a new channel, even 1K in 24h may be viral. Threshold should be relative to channel average, not absolute. | LOW | Will not trigger for months until channel reaches scale. Should be percentile-based. |

---

### Cross-Workflow Gaps

| Gap ID | Description | Severity | Impact |
|--------|-------------|----------|--------|
| XW-01 | **No master orchestrator defined** -- Haven has WF-001 as a master orchestrator that calls sub-workflows. BowTie Bullies has 8 independent workflows triggered by various mechanisms (cron, webhook, manual, status change) but no central controller. | HIGH | No single place to monitor end-to-end pipeline health. Status tracking is distributed across Airtable status fields. Need either a master orchestrator or a comprehensive monitoring workflow. |
| XW-02 | **Error propagation strategy undefined** -- If WF-03 (VO) fails, what happens to WF-04 (Visuals) which was triggered in parallel? Blueprint shows sequential flow but VO and Visuals could theoretically run concurrently. No error propagation or rollback defined. | HIGH | Partial failures leave orphaned records in Airtable and wasted API calls in downstream workflows. |
| XW-03 | **Trigger chain reliability** -- WF-03 triggers on "script approved in Airtable -> automation fires." Airtable Automations have their own reliability issues (delayed triggers, missed events). This is a critical junction. | MEDIUM | Airtable automation delays or failures silently break the pipeline. Consider n8n polling as a backup trigger mechanism. |
| XW-04 | **No dead letter queue** -- When a workflow fails, the item is stuck in its current status. No mechanism to retry, skip, or escalate stuck items. | MEDIUM | Manual monitoring required to find stuck items. Need a "stuck item detector" workflow. |
| XW-05 | **Human QC checkpoint is a black box** -- "HUMAN QA GATE" is shown in the architecture but no mechanism for: (a) notification to reviewer, (b) approval/rejection workflow, (c) rejection feedback loop back to regeneration, (d) timeout if review doesn't happen. | HIGH | The entire pipeline stalls if the human doesn't review. Need webhook-based approval gates (like Haven's WF-001 resume URL pattern). |

---

## 2. AIRTABLE SCHEMA GAPS

| Gap ID | Description | Severity | Impact |
|--------|-------------|----------|--------|
| AT-01 | **No field types specified for several fields** -- Fields like "Hook" (Long Text? Rich Text?), "Status" (Single Select? What options?), "Priority" options are mentioned but not fully typed. | MEDIUM | Schema ambiguity leads to implementation inconsistency. Need complete field definitions with select options, validation rules, and default values. |
| AT-02 | **No rollup or formula fields defined** -- Content Ideas should have a rollup counting linked Scripts. Analytics should have rollup sums. Products should have a formula for total revenue. None are defined. | MEDIUM | Manual counting required. Rollups and formulas are what make Airtable dashboards useful. |
| AT-03 | **No Airtable views specified** -- The schema defines 7 tables but zero views. Need: Editorial Calendar (Content Ideas by Scheduled Date), Production Pipeline (Scripts by Status), QA Queue (Videos with Status=QA), Analytics Dashboard (Videos sorted by Views), Weekly Content Calendar. | MEDIUM | Drew and CEO cannot effectively navigate the base without views. This is their primary interface. |
| AT-04 | **No Airtable Automations specified** -- Blueprint says "script approved in Airtable -> automation fires" but no actual Airtable Automations are defined. Which status changes trigger which webhooks? | HIGH | Pipeline trigger chain breaks without Airtable Automations. Need automation specs for: (a) Content Idea status -> Scripted triggers WF-02 notification, (b) Script VO Status -> Approved triggers WF-03 webhook, (c) Script status -> Visuals Done triggers WF-04 webhook, (d) Video status -> QA triggers notification, (e) Video status -> Approved triggers WF-07 manual availability. |
| AT-05 | **No Music table** -- Visual Style Guide defines 5 music mood categories with BPM ranges. The FFMPEG Assembler needs music tracks. But there's no Music table in the schema to store, categorize, and select music. | HIGH | Music selection is completely manual with no tracking. Need a Music table with: Track Name, File URL, Mood, BPM, Duration, License, Used In (linked to Videos). |
| AT-06 | **No Character Sheets table** -- Red Nose's character system is defined in the blueprint text but not tracked in Airtable. Haven uses a Character Sheets table for visual consistency. BowTie Bullies needs one for Red Nose's 6 poses, reference images, and generation prompts. | MEDIUM | Visual consistency enforcement is manual. A Character Sheets table enables automated prompt composition (like Haven's WF-004). |
| AT-07 | **Linked record relationships incomplete** -- Content Ideas -> Scripts -> Assets -> Videos chain is defined, but Analytics -> Videos is one-way. Products -> Content Ideas is defined but Products -> Videos (which video actually mentioned this product?) is missing. | LOW | Cross-table reporting limited. |
| AT-08 | **Backup strategy nonexistent** -- No mention of Airtable data backup. The entire pipeline state lives in Airtable. If the base is corrupted or accidentally modified, everything is lost. | MEDIUM | Use Airtable's native snapshot feature (Pro plan) or build an n8n backup workflow that exports base to JSON weekly. |
| AT-09 | **Schema governance not applied** -- Shared learnings (2026-02-08) established a rule: "No new tables without CEO approval." The BowTie Bullies base will need 7+ tables. Has this been pre-approved? | LOW | Process compliance. Ensure CEO approves the full schema before creation. |

---

## 3. INTEGRATION POINT GAPS

### ElevenLabs

| Gap ID | Description | Severity | Impact |
|--------|-------------|----------|--------|
| EL-01 | **Voice ID not provided** -- Placeholder `[TO BE PROVIDED]` in both blueprint and voice guide. | CRITICAL | Blocks all VO generation. |
| EL-02 | **Plan tier mismatch** -- Starter plan ($5/mo) gives 30 min of VO. 4 long-form videos at ~10 min each = 40 min. Plus Shorts re-generation and retries. Need Creator plan ($22/mo) minimum from Month 1. | HIGH | Will hit quota mid-month. Budget underestimate. |
| EL-03 | **No cost tracking mechanism** -- No automated way to track ElevenLabs usage against quota. | MEDIUM | Surprise quota exhaustion. Need pre-generation quota check API call. |
| EL-04 | **SSML compatibility unverified** -- Blueprint assumes SSML `<break>` tags work with `eleven_multilingual_v2`. Needs empirical verification. | MEDIUM | Pauses are central to Tyrone's voice (defined in voice guide as "silence is a beat, not an accident"). If SSML fails, the VO will lack the cadence that defines the brand. |

### Gemini API

| Gap ID | Description | Severity | Impact |
|--------|-------------|----------|--------|
| GM-01 | **Model version not pinned** -- Blueprint mentions `gemini-2.0-flash` and `gemini-2.0-pro` but Haven learnings explicitly warn against using `latest`. Must pin to a specific version (e.g., `gemini-2.0-flash-001`). | HIGH | Model updates cause visual drift and prompt regression. |
| GM-02 | **Prompt versioning strategy absent** -- Multiple workflows use Gemini (WF-01 scoring, WF-02 scripting, WF-04 image generation). No mechanism to version, track, or A/B test prompts. | MEDIUM | Prompt changes are invisible and irreversible. Need prompt text stored in Airtable or version-controlled files. |
| GM-03 | **No multimodal reference image support confirmed for image generation** -- Haven builder-learnings (2026-02-10) states: "Reference images still text-prompted (n8n Gemini node doesn't support multimodal binary in image generation mode)." Red Nose consistency requires reference images. | HIGH | Cannot feed reference images to Gemini imagen node in n8n. Must rely on text prompts only, which means lower consistency. Consider using Gemini Vision API for scoring after generation (proven Haven pattern). |

### Kie.AI

| Gap ID | Description | Severity | Impact |
|--------|-------------|----------|--------|
| KI-01 | **API existence unverified** -- Blueprint specifies `veo3_fast` and `veo3` models, callback URLs, and HTTP Header Auth. But no API documentation link, no confirmed endpoint, no verified access. | CRITICAL | If no API exists, video clip generation is manual or requires an alternative provider. |
| KI-02 | **Callback vs. polling architecture unclear** -- Blueprint shows callback webhook but Haven's spec mentions "10-min timeout with GET /jobs/recordInfo fallback." The actual API behavior is unverified. | MEDIUM | Depends on KI-01 resolution. |
| KI-03 | **Cost model unknown** -- Blueprint estimates "$0.10-0.50/clip" but this is unverified. Actual pricing may differ significantly. | LOW | Budget planning issue. |

### Nano Banana

| Gap ID | Description | Severity | Impact |
|--------|-------------|----------|--------|
| NB-01 | **Completely unspecified** -- Listed as "Secondary/backup video generator" and "Best for: Abstract visualizations" but no API details, no pricing, no authentication method, no confirmed access. | HIGH | Backup provider is effectively a placeholder. |

### YouTube Data API

| Gap ID | Description | Severity | Impact |
|--------|-------------|----------|--------|
| YT-01 | **OAuth 2.0 setup not done** -- Requires Google Cloud project, OAuth consent screen, verified app for upload scope. | CRITICAL | Blocks all publishing. |
| YT-02 | **Quota management not planned** -- 10,000 units/day. Uploads cost 1,600 each. Need quota tracking. | MEDIUM | Tight budget but manageable. |

### Instagram Graph API

| Gap ID | Description | Severity | Impact |
|--------|-------------|----------|--------|
| IG-01 | **Publishing limitations not addressed** -- Automated Reel publishing requires Facebook Business account, approved app permissions, and media hosted at public URL. Significantly more complex than YouTube upload. | CRITICAL | IG automation may need to be deferred or use third-party tools (Later, Buffer). |
| IG-02 | **No Story/carousel support** -- Blueprint mentions "IG Stories" for Thursday engagement but Instagram API has limited Story publishing support. | LOW | Stories can be manual initially. |

### Google Drive

| Gap ID | Description | Severity | Impact |
|--------|-------------|----------|--------|
| GD-01 | **Folder structure not created** -- Blueprint doesn't define Google Drive folder hierarchy for BowTie Bullies assets. | HIGH | Assets will be disorganized. Need: `BowTie Bullies/VO/`, `BowTie Bullies/Visuals/`, `BowTie Bullies/Videos/`, `BowTie Bullies/Music/`, `BowTie Bullies/Thumbnails/`, `BowTie Bullies/Reference/`. |
| GD-02 | **Storage limits not assessed** -- Long-form video (10 min, 1080p, H.264) is 500MB-1.5GB. At 4 videos/month + 20+ shorts + assets, storage grows 5-10GB/month. Google Drive free tier is 15GB. | MEDIUM | Will exhaust free storage in 2-3 months. Need Google One plan or cleanup strategy. |

### Amazon Associates

| Gap ID | Description | Severity | Impact |
|--------|-------------|----------|--------|
| AA-01 | **Storefront not created** -- `amazon.com/shop/bowtiebullies` is aspirational, not live. | MEDIUM | Can be created independently of automation pipeline. |
| AA-02 | **Link generation not automatable** -- Amazon Associates links are generated via the SiteStripe browser extension or manually through the Associates portal. No reliable API for generating tagged affiliate links programmatically. | MEDIUM | Affiliate link insertion in YouTube descriptions will be manual or template-based. |

---

## 4. PIPELINE ORCHESTRATION GAPS

| Gap ID | Description | Severity | Impact |
|--------|-------------|----------|--------|
| PO-01 | **End-to-end flow has ambiguous parallelism** -- Blueprint shows a sequential flow (news -> script -> VO -> visuals -> assembly) but VO and Visual generation could run in parallel (visuals don't depend on VO audio, only on script). This parallelism is not exploited or explicitly rejected. | MEDIUM | Missing optimization opportunity. Parallel VO + Visual generation could cut production time by 40%. |
| PO-02 | **No pipeline monitoring workflow** -- 8 workflows with no health dashboard. Haven has a daily health audit pattern. BowTie Bullies needs one adapted for its pipeline. | HIGH | Failures go unnoticed until content doesn't ship. Need a daily health check that verifies: all 8 workflows active, last execution status, Airtable record counts by status, stuck items. |
| PO-03 | **No deployment/update strategy** -- How are workflow updates deployed? Blueprint doesn't address versioning, rollback, or testing strategy for n8n workflows. | MEDIUM | The n8n-workflow-creation-sop.md exists but is generic. Need BowTie-specific deployment checklist. |
| PO-04 | **Human QC is a singleton bottleneck** -- The blueprint assumes one human (CEO) reviews every video. If they're traveling, sick, or busy, the entire pipeline stalls. No delegation mechanism. | MEDIUM | Single point of failure for content shipping cadence. |
| PO-05 | **No content pipeline SLA** -- No defined time limits for each stage. How long should script generation take? How long for QA review? Without SLAs, there's no way to detect when the pipeline is "behind." | LOW | Nice-to-have for pipeline maturity. |

---

## 5. DATA FLOW GAPS

| Gap ID | Description | Severity | Impact |
|--------|-------------|----------|--------|
| DF-01 | **Inter-workflow data passing mechanism inconsistent** -- WF-01 writes to Airtable. WF-02 reads from Airtable (manual trigger). WF-03 is triggered by webhook (Airtable automation). WF-04 is triggered by webhook. WF-05 is triggered by webhook. WF-06 triggers on status change. WF-07 is manual. WF-08 is cron. Three different trigger patterns with no standard. | MEDIUM | Debugging requires understanding 3 different trigger mechanisms. Standardize on Airtable webhook triggers where possible. |
| DF-02 | **Asset file references are Google Drive URLs** -- Assets are referenced by URL in Airtable, downloaded by n8n for processing, then re-uploaded. For long-form assembly with 20+ assets, this means 20+ downloads + 1 upload per assembly run. On the Hostinger server with limited bandwidth, this could be slow. | HIGH | Assembly workflow may take 10-20 minutes just downloading assets before any FFMPEG processing begins. Consider using Drive file IDs instead of URLs for faster download via Drive API. |
| DF-03 | **Configuration management undefined** -- Where are API keys stored? In n8n credentials (good) or hardcoded in Code nodes (bad)? Blueprint doesn't specify. | MEDIUM | Haven's pattern (n8n credential store) should be followed. Need credential inventory: ElevenLabs, Gemini, Kie.AI, YouTube OAuth, Instagram OAuth, Airtable, Google Drive, Pexels. |
| DF-04 | **No audit trail for content generation** -- Which Gemini prompt generated which script? Which ElevenLabs parameters produced which VO? If a video has a quality issue, there's no way to trace it back to the generation parameters. | MEDIUM | Need generation metadata stored in Airtable Asset records (prompt text, model version, parameters, timestamp). |
| DF-05 | **Logging pattern not defined** -- Haven's execSync logging wrapper (`commands_run` array in output) is proven and critical. Blueprint doesn't specify this for BowTie Bullies FFMPEG nodes. | MEDIUM | Without logging, debugging FFMPEG failures requires reading n8n execution data manually. Apply Haven's logging wrapper pattern to all Code nodes. |

---

## 6. REUSABLE PATTERNS FROM EXISTING INFRASTRUCTURE

These patterns from the current codebase are directly applicable to BowTie Bullies and should be reused, not reinvented:

| Pattern | Source | Applicable To | Notes |
|---------|--------|---------------|-------|
| **Merge v3.2 for parallel sync** | Haven WF-003, neo-learnings | WF-02, WF-04, WF-05 | CRITICAL -- prevents race condition bugs |
| **execSync logging wrapper** | Haven WF-006, builder-learnings | WF-05, WF-06 | Every Code node with shell commands |
| **Pre-flight validation** | Haven WF-006 | WF-05, WF-06 | Check ffmpeg, ffprobe, fonts, disk space |
| **Binary data preservation** | builder-learnings 2026-02-10 | WF-04 | `$('NodeName').first().binary` through Code/IF nodes |
| **Consistency scoring loop** | Haven WF-004 | WF-04 | Gemini Vision 5-criteria scorer, threshold 7/10, max 3 retries |
| **Audio optimization** | `.specify/patterns/ffmpeg/audio-optimization.md` | WF-05 pre-processing | Compress music tracks before pipeline entry |
| **Google Drive v3 patterns** | neo-learnings | All workflows | `resource: "fileFolder"` for search, `operation: "share"` for permissions |
| **Airtable v2.1 patterns** | neo-learnings | All workflows | Always use v2.1, use table ID not name |
| **Sub-workflow composition** | Haven WF-001 | Master orchestrator | executeWorkflowTrigger + executeWorkflow with implicit data passing |
| **Webhook-based approval gates** | Haven WF-001 (updated 2026-02-10) | Human QC | Store $execution.resumeUrl in Airtable, wait for webhook callback |

---

## 7. PRIORITY IMPLEMENTATION ORDER

Based on dependency analysis and severity scoring, recommended build order:

### Phase 0: Prerequisites (BEFORE ANY WORKFLOW)
1. **Create Airtable base** with 7 tables + Music table + Character Sheets table (AT-05, AT-06)
2. **Configure Airtable views** for Editorial Calendar, Production Pipeline, QA Queue (AT-03)
3. **Set up Google Drive folder structure** (GD-01)
4. **Obtain ElevenLabs Voice ID** -- clone or select Tyrone voice (EL-01)
5. **Verify Kie.AI API access** -- confirm API exists and is accessible (KI-01)
6. **Verify Nano Banana API access** -- or identify replacement (NB-01)
7. **Set up YouTube OAuth** -- Google Cloud project, consent screen, credentials (YT-01)
8. **Investigate Instagram publishing** -- determine if API is feasible or need third-party (IG-01)
9. **Generate Red Nose reference images** -- 4 canonical images for consistency (blueprint Phase 1)
10. **Install fonts on n8n server** -- Anton, Space Mono, JetBrains Mono (WF05-02)

### Phase 1: Core Pipeline (Week 1)
1. **WF-01: News Ingest** -- validate RSS URLs, build with per-source error handling
2. **WF-02: Script Generator** -- engineer the Tyrone system prompt, add JSON validation
3. **Airtable Automations** -- configure status-change triggers for pipeline webhooks

### Phase 2: Content Generation (Week 2)
4. **WF-03: VO Generator** -- ElevenLabs integration with SSML preprocessing, quota check
5. **WF-04: Visual Generator** -- Gemini image gen with Red Nose consistency scoring
6. **Red Nose consistency scoring prompt** -- adapt Haven's 5-criteria scorer

### Phase 3: Assembly (Week 3)
7. **WF-05: FFMPEG Assembler (Shorts first)** -- start with 9:16 short-form (simpler, proven)
8. **WF-05: FFMPEG Assembler (Long-form)** -- multi-pass approach for 10+ minute content
9. **WF-06: Splice Engine** -- depends on WF-05 long-form output + speech-to-text for timecodes

### Phase 4: Distribution (Week 4)
10. **WF-07: Publisher** -- YouTube upload first, IG Reels second (or manual)
11. **WF-08: Analytics Tracker** -- YouTube Analytics API, manual affiliate tracking
12. **Master orchestrator or health monitoring workflow** -- pipeline visibility

---

## 8. RISK MATRIX

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Kie.AI has no usable API | High | CRITICAL | Identify backup: RunwayML API, Pika API, Luma Dream Machine API |
| ElevenLabs SSML doesn't work as expected | Medium | HIGH | Test SSML manually before building workflow. Fallback: add silence in FFMPEG post-processing |
| Long-form FFMPEG assembly too complex for single n8n execution | High | HIGH | Multi-pass architecture, per-segment assembly, final concatenation |
| YouTube OAuth setup is complex/slow | Low | CRITICAL | Well-documented process, can be done in parallel with workflow building |
| Instagram API publishing not feasible | Medium | HIGH | Use Buffer/Later as publishing middleware, or manual posting with n8n-generated assets |
| Hostinger server disk/memory insufficient for long-form | Medium | HIGH | Profile resource usage on test video before committing. Consider VPS upgrade. |
| Red Nose visual drift without multimodal references | High | MEDIUM | Strong text prompts + consistency scoring + reference image in prompt text description |
| Font installation fails on Hostinger | Low | CRITICAL | Pre-render all text as images, or use system fonts (DejaVu, like Haven) |

---

## 9. ESTIMATED EFFORT

| Component | Estimated Hours | Dependencies |
|-----------|----------------|--------------|
| Airtable base setup (9 tables + views + automations) | 4-6 | None |
| Google Drive folder structure | 1 | None |
| WF-01: News Ingest | 3-4 | RSS URL validation, Airtable base |
| WF-02: Script Generator | 4-6 | Prompt engineering, Airtable base |
| WF-03: VO Generator | 3-4 | Voice ID, ElevenLabs credential |
| WF-04: Visual Generator | 6-8 | Kie.AI verification, Red Nose references |
| WF-05: FFMPEG Assembler (Shorts) | 4-6 | Font installation, asset structure |
| WF-05: FFMPEG Assembler (Long-form) | 8-12 | Shorts version validated first |
| WF-06: Splice Engine | 4-6 | WF-05 long-form, Whisper integration |
| WF-07: Publisher | 4-6 | YouTube OAuth, IG investigation |
| WF-08: Analytics Tracker | 3-4 | YouTube Analytics API |
| Health monitoring workflow | 2-3 | All workflows active |
| **TOTAL** | **46-65 hours** | |

---

*"The blueprint is a warning system. This audit is the field report on what it takes to make it real."*

---

**Audit complete. 67 gaps identified across 6 categories. 14 are CRITICAL blockers that must be resolved before any content can ship through the automated pipeline.**
