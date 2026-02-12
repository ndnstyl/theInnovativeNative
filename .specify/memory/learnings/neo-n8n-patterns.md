# Neo's n8n Pattern Library

> Extracted from 140+ workflows on n8n.srv948776.hstgr.cloud
> Last Updated: 2026-02-09

---

## Pattern Categories

1. [Data Enrichment](#1-data-enrichment)
2. [Media Processing (FFmpeg)](#2-media-processing-ffmpeg)
3. [Social Publishing](#3-social-publishing)
4. [RAG/AI Integration](#4-ragai-integration)
5. [CRM/Pipeline Automation](#5-crmpipeline-automation)
6. [Sync/ETL Operations](#6-syncetl-operations)
7. [Agent Tools (Subworkflows)](#7-agent-tools-subworkflows)
8. [Scraping & Data Collection](#8-scraping--data-collection)

---

## 1. Data Enrichment

### 1.1 UK Local Services - Premium Enrichment Pattern
**Source Workflows:** `UK Local Services - Premium Enrichment`, `UK Local Services - Validation`, `UK Local Services - Discovery (NEW)`
**Reuse Potential:** HIGH

**Pattern Description:**
Multi-stage enrichment pipeline with Apify integration for contact scraping.

**Key Nodes:**
- `Webhook Trigger` - Entry point
- `Airtable` (Get Batch Config) - Centralized configuration
- `Airtable` (Get Businesses for Enrichment) - Query by status
- `@apify/n8n-nodes-apify.apify` (Contact Details Scraper) - External enrichment
- `Code` (Merge and Prepare Updates) - Data normalization
- `Airtable` (Create Enrichment Record) - Audit trail
- `Airtable` (Update Business) - Write enriched data back
- `executeWorkflow` (Trigger Data Quality) - Chain to next workflow

**Architecture:**
```
Webhook -> Get Config -> Get Pending Records -> Apify Scraper -> Merge Data -> Update Records -> Trigger Next Stage
```

**Learnings:**
- Always log workflow start/completion for debugging
- Use batch limiting (`Limit Records` node) to control costs
- Create separate enrichment records for audit trail
- Chain workflows with `executeWorkflow` for modular design

---

### 1.2 Discovery with Deduplication Pattern
**Source Workflow:** `UK Local Services - Discovery (NEW)`
**Reuse Potential:** HIGH

**Pattern Description:**
Discover new records via Apify Google Maps Scraper, dedupe against existing database.

**Key Nodes:**
- `Airtable` (Get Seed Record) - Input configuration
- `Code` (Construct Apify Input) - Dynamic query building
- `@apify/n8n-nodes-apify.apify` (Run Google Maps Scraper) - Data collection
- `Airtable` (Get Existing Place IDs) - Load existing records
- `Code` (Filter & Map New Businesses) - Deduplication logic
- `splitInBatches` + `Airtable` (Create Business Records) - Batch insert

**Deduplication Logic:**
```javascript
// Filter out records that already exist
const existingIds = new Set($('Get Existing Place IDs').all().map(r => r.json.placeId));
return items.filter(item => !existingIds.has(item.json.placeId));
```

---

### 1.3 Scoring/Validation Pattern
**Source Workflows:** `UK Local Services - Scoring`, `UK Local Services - Validation`
**Reuse Potential:** MEDIUM

**Pattern Description:**
Validate and score records based on data completeness and external checks.

**Key Nodes:**
- `splitInBatches` (Loop Over Businesses) - Process one at a time
- `httpRequest` (Check Website) - Validate URLs
- `Code` (Validate Contact Info) - Regex/pattern matching
- `Code` (Calculate Completeness Score) - Weighted scoring
- `Airtable` (Create Scorecard) - Store results
- `Airtable` (Update Business Score) - Update source record

**Scoring Formula Example:**
```javascript
let score = 0;
if (item.phone) score += 20;
if (item.email) score += 20;
if (item.website && websiteValid) score += 25;
if (item.address) score += 15;
if (item.description) score += 20;
return { ...item, completenessScore: score };
```

---

## 2. Media Processing (FFmpeg)

### 2.1 Viral Clipping Pipeline
**Source Workflows:** `Viral Clipping FFmpeg`, `BodyCam Bandits FFmpeg Pipeline - Production`
**Reuse Potential:** HIGH

**Pattern Description:**
Download video, extract transcripts, identify viral clips with AI, process with FFmpeg.

**Key Nodes:**
- `executeCommand` (video download with yt-dlp) - Video acquisition
- `executeCommand` (get transcript from yt-dlp) - Subtitle extraction
- `readWriteFile` (read srt from disk) - Load transcript
- `@n8n/n8n-nodes-langchain.googleGemini` (viral clips identification) - AI analysis
- `Code` (filter out top clips according to score) - Selection logic
- `executeCommand` (simple clipping) - FFmpeg cut
- `executeCommand` (find height & width) - Video metadata
- `executeCommand` (burn subtitles) - Caption overlay
- `wait` - Processing delay for system resources

**FFmpeg Commands Used:**
```bash
# Basic clip extraction
ffmpeg -i input.mp4 -ss START -to END -c copy output.mp4

# Subtitle burn-in
ffmpeg -i input.mp4 -vf "subtitles=subs.srt:force_style='FontSize=SIZE'" output.mp4

# Video metadata
ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 input.mp4
```

---

### 2.2 3-Part Video Assembly Pattern
**Source Workflow:** `Instagram Reels - 3-Part Video Editor`
**Reuse Potential:** HIGH

**Pattern Description:**
Assemble multi-part video with voiceovers, b-roll, and music.

**Key Nodes:**
- `executeCommand` (Create Temp Dir) - Working directory
- `Code` (Restore Binaries) - Base64 decode media files
- `splitInBatches` (Loop B-Roll Chunks) - Handle large files
- `executeCommand` (Decode B-Roll) - Process chunks
- `executeCommand` (Process Part 1/2/3) - Individual segments
- `merge` - Synchronize parallel processing
- `executeCommand` (Write Concat List) - FFmpeg concat demuxer
- `executeCommand` (Concatenate Parts) - Join segments
- `executeCommand` (Mix Music) - Audio overlay
- `executeCommand` (Burn Subtitles) - Caption overlay
- `executeCommand` (Cleanup Temp Files) - Cleanup

**Concat List Format:**
```
file 'part1.mp4'
file 'part2.mp4'
file 'part3.mp4'
```

**FFmpeg Concat:**
```bash
ffmpeg -f concat -safe 0 -i list.txt -c copy output.mp4
```

---

### 2.3 Face Detection + Removal Pipeline
**Source Workflow:** `BodyCam Bandits FFmpeg Pipeline - Production`
**Reuse Potential:** MEDIUM

**Pattern Description:**
Detect faces in video, remove talking heads, add educational voiceover.

**Key Nodes:**
- `httpRequest` (Face Detection Analysis) - External face detection API
- `executeCommand` (FFmpeg Stage 1 - Talking Head Removal) - Crop/blur
- `executeCommand` (FFmpeg Stage 2 - Quality Enhancement) - Filters
- `executeCommand` (FFmpeg Stage 3a - Silence Detection) - Audio analysis
- `executeCommand` (FFmpeg Stage 3b - Create Educational Pauses) - Insert pauses
- `httpRequest` (Generate Educational Script with Gemini PRO) - Script generation
- `httpRequest` (Generate Voice-over with ElevenLabs) - TTS
- `executeCommand` (FFmpeg Stage 4 - Voice-over Integration) - Audio mix

---

## 3. Social Publishing

### 3.1 Blotato Multi-Platform Publishing
**Source Workflows:** `X Post Tool`, `post to instagram tool`, `Tik Tok Post Tool`
**Reuse Potential:** HIGH

**Pattern Description:**
Unified subworkflow pattern for posting to X, Instagram, TikTok via Blotato.

**Key Nodes:**
- `executeWorkflowTrigger` - Entry point
- `@blotato/n8n-nodes-blotato.blotato` (Upload media) - Media upload
- `@blotato/n8n-nodes-blotato.blotato` (X/Instagram/TikTok) - Platform post

**Usage as Tool:**
These workflows are designed to be called by an AI agent via `executeWorkflow`.

**Input Schema:**
```json
{
  "text": "Post content",
  "mediaUrl": "https://...",
  "platform": "x|instagram|tiktok"
}
```

---

### 3.2 LinkedIn + Instagram Automation
**Source Workflow:** `Linkedin & Instagram Automation`
**Reuse Potential:** MEDIUM

**Pattern Description:**
Scheduled content generation with AI, image generation, multi-platform posting.

**Key Nodes:**
- `scheduleTrigger` - Daily/weekly trigger
- `@n8n/n8n-nodes-langchain.agent` (LinkedIn Post Agent) - Content generation
- `@n8n/n8n-nodes-langchain.agent` (Image Prompt Agent) - Visual prompt
- `@n8n/n8n-nodes-langchain.googleGemini` (Generate an image) - Image creation
- `linkedIn` - LinkedIn posting
- `facebookGraphApi` - Instagram via Graph API
- `gmail` (Send Post) - Email notification
- `googleDriveTrigger` (Get IG Reel) - Watch for new reels
- `slack` (Send a message) - Slack notification

**Instagram Posting via Graph API:**
1. Upload media to Facebook (create container)
2. Wait for processing
3. Publish container to Instagram

---

## 4. RAG/AI Integration

### 4.1 Agentic RAG with PGVector
**Source Workflows:** `Agentic RAG Template`, `GovCon RAG Agent`
**Reuse Potential:** HIGH

**Pattern Description:**
Document ingestion, embedding storage in Postgres/PGVector, agentic retrieval.

**Key Nodes (Ingestion):**
- `googleDriveTrigger` (File Created) - Watch for new docs
- `googleDrive` (Download File) - Fetch document
- `extractFromFile` - Extract text (PDF, DOCX, CSV, Excel)
- `@n8n/n8n-nodes-langchain.textSplitterRecursiveCharacterTextSplitter` - Chunking
- `@n8n/n8n-nodes-langchain.embeddingsGoogleGemini` - Create embeddings
- `@n8n/n8n-nodes-langchain.vectorStorePGVector` - Store in PGVector
- `postgres` (Insert Document Metadata) - Track source files

**Key Nodes (Query):**
- `@n8n/n8n-nodes-langchain.chatTrigger` - User input
- `@n8n/n8n-nodes-langchain.agent` (RAG AI Agent) - Agent orchestration
- `@n8n/n8n-nodes-langchain.memoryPostgresChat` - Conversation memory
- `postgresTool` (List Documents/Get File Contents/Query Rows) - Structured data access
- `@n8n/n8n-nodes-langchain.vectorStorePGVector` - Vector search
- `@n8n/n8n-nodes-langchain.rerankerCohere` - Result reranking

**Sync Pattern (Orphan Cleanup):**
- `scheduleTrigger` - Periodic check
- `googleDrive` (Get File IDs) - Current files
- `postgres` (Execute SQL) - DB records
- `Code` (ID Table Orphans/ID Doc Orphans) - Find mismatches
- `postgres` (Delete) - Remove orphans

---

### 4.2 AI Agent with Tool Workflows
**Source Workflows:** `Content Agent`, `Email Agent`, `Calendar Agent`
**Reuse Potential:** HIGH

**Pattern Description:**
Modular AI agents using n8n tool nodes that call subworkflows.

**Email Agent Tools:**
- `gmailTool` (Send Email/Get Emails/Create Draft/Reply/Label)

**Calendar Agent Tools:**
- `googleCalendarTool` (Create Event/Get Events/Delete/Update)

**Content Agent Tools:**
- `@n8n/n8n-nodes-langchain.toolHttpRequest` (Tavily) - Web search
- Calls X Post Tool, Instagram Tool, TikTok Tool as subworkflows

**Agent Configuration:**
```json
{
  "model": "Google Gemini",
  "systemPrompt": "You are a helpful assistant...",
  "tools": ["Send Email", "Get Emails", "Create Draft"]
}
```

---

### 4.3 Structured Output Parsing
**Source Workflows:** Multiple
**Reuse Potential:** HIGH

**Pattern Description:**
Use structured output parser to get consistent JSON from LLMs.

**Key Nodes:**
- `@n8n/n8n-nodes-langchain.outputParserStructured` - Define schema

**Example Schema:**
```json
{
  "type": "object",
  "properties": {
    "score": { "type": "number" },
    "recommendation": { "type": "string" },
    "reasons": { "type": "array", "items": { "type": "string" } }
  }
}
```

---

## 5. CRM/Pipeline Automation

### 5.1 GovCon Pipeline with Stage Transitions
**Source Workflows:** `GovCon Pipeline CRM v2.0`, `GovCon - Stage Transition Handler`
**Reuse Potential:** HIGH

**Pattern Description:**
Multi-stage pipeline with AI-powered stage-specific processing.

**Pipeline Stages:**
1. Discovery -> Initial Screening
2. Screening -> Deep Analysis
3. Analysis -> Pursuing/No-Bid
4. Pursuing -> Submitted
5. Submitted -> Awarded/Lost

**Key Nodes (Pipeline):**
- `scheduleTrigger` (Daily 5AM) - Automated scan
- `webhook` (Airtable Button) - Manual trigger
- `airtable` (Read Config) - NAICS codes, keywords
- `httpRequest` (SAM.gov API Request) - Data fetch
- `@n8n/n8n-nodes-langchain.agent` (AI Agent) - Scoring
- `@n8n/n8n-nodes-langchain.outputParserStructured` - Structured scoring
- `airtable` (Create Opportunity) - Record creation
- `slack` (Send Notification) - Team alerts

**Key Nodes (Stage Handler):**
- `webhook` (Stage Change Webhook) - Airtable automation trigger
- `switch` (Route by Stage) - Stage-specific routing
- `@n8n/n8n-nodes-langchain.googleGemini` (Initial Screening Agent) - Stage 1
- `@n8n/n8n-nodes-langchain.googleGemini` (Deep Analysis Agent) - Stage 2
- `@n8n/n8n-nodes-langchain.googleGemini` (Deal Challenger Agent) - Go/No-Go
- `airtable` (Log Activity) - Activity tracking

---

### 5.2 HubSpot Onboarding Automation
**Source Workflow:** `Hubspot Onboarding Automation`
**Reuse Potential:** HIGH

**Pattern Description:**
New contact triggers personalized outreach and calendar booking.

**Key Nodes:**
- `hubspotTrigger` - Contact created
- `hubspot` (Get all info about the contact) - Full profile
- `@n8n/n8n-nodes-langchain.agent` (Write a personalized message) - AI content
- `markdown` (Transforms to HTML) - Email formatting
- `gmail` (Send the message) - Outreach
- `hubspot` (Set owner to contact) - Assignment
- `@n8n/n8n-nodes-langchain.agent` (Calendar Agent) - Booking

---

## 6. Sync/ETL Operations

### 6.1 Airtable to Google Drive Sync
**Source Workflow:** `GovCon - Airtable to Google Drive Sync`
**Reuse Potential:** HIGH

**Pattern Description:**
Sync attachments from Airtable to Google Drive for RAG ingestion.

**Key Nodes:**
- `scheduleTrigger` (Every 5 Minutes) - Polling
- `airtable` (List Opportunities with Attachments) - Query
- `splitInBatches` (Loop Opportunities) - Process records
- `Code` (Extract Attachments) - Parse attachment array
- `splitInBatches` (Loop Attachments) - Process files
- `httpRequest` (Download from Airtable) - Fetch binary
- `googleDrive` (Upload to Google Drive) - Store
- `postgres` (Log to Supabase) - Track synced files
- `airtable` (Set Ingested Status) - Update source

**Status Flow:**
```
Pending -> Processing -> Ingested
```

---

### 6.2 Webhook to Airtable Logging
**Source Workflow:** `Rize Session Logger`
**Reuse Potential:** HIGH

**Pattern Description:**
Simple webhook receiver that maps fields and creates Airtable records.

**Key Nodes:**
- `webhook` - Receive data
- `set` (Map Fields) - Transform/rename fields
- `airtable` (Create Record) - Insert

**Field Mapping Example:**
```javascript
return {
  "Entry Date": $json.timestamp,
  "Agent": $json.source,
  "Project": $json.project_name,
  "Hours": $json.duration / 3600,
  "Description": $json.summary
};
```

---

### 6.3 SAM.gov Document Fetcher
**Source Workflow:** `GovCon - SAM.gov Document Fetcher`
**Reuse Potential:** MEDIUM

**Pattern Description:**
Fetch document links from API, download files, upload to Google Drive.

**Key Nodes:**
- `scheduleTrigger` (Hourly) - Regular check
- `webhook` (Trigger) - Manual/button trigger
- `airtable` (Get Pending Records) - Query by status
- `airtable` (Get SAM API Key) - Secure key storage
- `httpRequest` (Fetch SAM.gov) - API call
- `Code` (Extract Links) - Parse document URLs
- `Code` (Split URLs) - Prepare for download
- `httpRequest` (Download Doc) - Binary fetch
- `googleDrive` (Upload to Drive) - Store
- `airtable` (Set Status) - Update progress

---

## 7. Agent Tools (Subworkflows)

### 7.1 Create Image Tool
**Source Workflow:** `Create Image Tool`
**Reuse Potential:** HIGH

**Key Nodes:**
- `executeWorkflowTrigger` - Subworkflow entry
- `@n8n/n8n-nodes-langchain.googleGemini` (Generate an image) - Gemini Imagen
- `convertToFile` - Binary conversion
- `googleDrive` (Upload file) - Storage
- `telegram` (Send Photo) - Notification

**Input Schema:**
```json
{
  "prompt": "A sunset over mountains",
  "style": "photorealistic"
}
```

---

### 7.2 Create Video Tool
**Source Workflow:** `Create Video Tool`
**Reuse Potential:** HIGH

**Key Nodes:**
- `executeWorkflowTrigger` - Entry
- `@n8n/n8n-nodes-langchain.googleGemini` (Generate a video) - Video generation
- `httpRequest` (Generate Video) - Alternative: fal.ai/Runway
- `wait` (30 Seconds) - Processing time
- `httpRequest` (Get Result) - Poll for completion
- `httpRequest` (Download File) - Fetch binary
- `googleDrive` (Upload Video) - Storage
- `telegram` (Send Video) - Notification

---

### 7.3 Image Editing Tool (Nano/Banano)
**Source Workflow:** `combine images nanaoBanana`, `edit images nano`
**Reuse Potential:** HIGH

**Pattern Description:**
AI image editing using fal.ai nano-banana model.

**Key Nodes:**
- `executeWorkflowTrigger` - Entry
- `googleDrive` (Download file) - Source image
- `httpRequest` (Get URL) - Upload to imgBB for URL
- `httpRequest` (Create Image) - fal.ai queue request
- `wait` (10 Seconds) - Processing
- `httpRequest` (Get Result) - Poll queue
- `httpRequest` (Download Image) - Fetch result
- `googleDrive` (Upload file) - Store

**fal.ai Request Format:**
```json
{
  "prompt": "Edit description",
  "image_urls": ["https://..."],
  "num_images": 1,
  "output_format": "jpeg"
}
```

---

## 8. Scraping & Data Collection

### 8.1 Ultimate Viral Scraper Pattern
**Source Workflow:** `Ultimate Viral Scraper - Airtable`
**Reuse Potential:** HIGH

**Pattern Description:**
Multi-platform social media scraping with sentiment analysis.

**Supported Platforms:**
- TikTok (via RapidAPI/Apify)
- Instagram (hashtags + profiles)
- YouTube
- Twitter/X
- LinkedIn
- Facebook

**Key Nodes:**
- `webhook` - Trigger
- `switch` - Platform routing
- `airtable` (Search Inputs) - Get hashtags/profiles
- `httpRequest` (Running Scraper) - Platform-specific API
- `removeDuplicates` - Dedupe against previous runs
- `filter` (Filters Posts based on Metrics) - Quality filter
- `summarize` (Concatenates Comments) - Aggregate by post
- `httpRequest` (Scraping Comments) - Fetch comments
- `@n8n/n8n-nodes-langchain.googleGemini` (Perform sentiment analysis) - AI analysis
- `airtable` (Creates New Record) - Store results
- `@n8n/n8n-nodes-langchain.googleGemini` (Creating the viral playbook) - Summary

**Metrics Filter Example:**
```javascript
return $input.all().filter(item =>
  item.json.likes > 1000 ||
  item.json.views > 10000
);
```

---

### 8.2 Faceless Video Generator
**Source Workflow:** `Faceless Generator Reels Youtube`
**Reuse Potential:** HIGH

**Pattern Description:**
Generate faceless short-form video content with AI.

**Key Nodes:**
- `googleSheets` (Youtube shorts) - Content queue
- `@n8n/n8n-nodes-langchain.agent` (Write Video Script) - Script generation
- `@n8n/n8n-nodes-langchain.agent` (Image Prompt Generator) - Visual prompts
- `@n8n/n8n-nodes-langchain.googleGemini` (Generate an image) - Scene images
- `httpRequest` (Generate Videos) - Image-to-video API
- `httpRequest` (Text to Speech) - Voiceover
- `httpRequest` (Add Captions - replicate) - Caption overlay
- `httpRequest` (Generate Audio - Background sound) - Music
- `googleDrive` (Upload to Drive) - Storage
- `youTube` (Upload Video) - Publishing
- `googleSheets` (Update Video Status) - Track progress

---

## Quick Reference: Node Types by Use Case

| Use Case | Recommended Nodes |
|----------|-------------------|
| API Calls | `httpRequest`, Apify, platform-specific |
| Data Storage | `airtable`, `postgres`, `googleSheets` |
| File Handling | `googleDrive`, `readWriteFile`, `extractFromFile` |
| AI/LLM | `@n8n/n8n-nodes-langchain.agent`, `googleGemini` |
| Media | `executeCommand` (FFmpeg), `httpRequest` (fal.ai) |
| Social | `@blotato/n8n-nodes-blotato.blotato`, `linkedIn`, `facebookGraphApi` |
| Flow Control | `splitInBatches`, `switch`, `if`, `merge`, `wait` |
| Triggers | `webhook`, `scheduleTrigger`, `googleDriveTrigger` |

---

## Integration Credentials Inventory

| Service | Node Type | Usage |
|---------|-----------|-------|
| Airtable | `airtable`, `airtableTool` | Primary data store |
| Google Drive | `googleDrive`, `googleDriveTrigger` | File storage |
| Google Gemini | `@n8n/n8n-nodes-langchain` | LLM, Vision, Embeddings |
| Postgres/Supabase | `postgres`, `postgresTool` | RAG, logging |
| Slack | `slack` | Notifications |
| Gmail | `gmail`, `gmailTool` | Email automation |
| Blotato | `@blotato/n8n-nodes-blotato` | Social posting |
| Apify | `@apify/n8n-nodes-apify` | Web scraping |
| ElevenLabs | `httpRequest` | TTS |
| fal.ai | `httpRequest` | Image/video generation |
| Cohere | `rerankerCohere` | RAG reranking |
| Perplexity | `perplexityTool`, `httpRequest` | Research |
| SAM.gov | `httpRequest` | Government contracts |
| HubSpot | `hubspot`, `hubspotTrigger` | CRM |

---

## Learnings & Best Practices

1. **Batch Processing**: Always use `splitInBatches` with reasonable batch sizes (10-50) to avoid timeouts
2. **Error Handling**: Add `try/catch` in Code nodes; use webhook `respondToWebhook` for error responses
3. **Status Tracking**: Use status fields (Pending/Processing/Completed/Failed) for long-running jobs
4. **Deduplication**: Query existing IDs before insert to avoid duplicates
5. **Subworkflows**: Extract reusable logic into subworkflows called via `executeWorkflow`
6. **Wait Nodes**: Add appropriate delays for rate-limited APIs and heavy processing
7. **Logging**: Log workflow start/complete to Airtable for debugging
8. **Configuration**: Store API keys and settings in Airtable config tables, not hardcoded
9. **Cleanup**: Always cleanup temp files in FFmpeg workflows
10. **Memory**: Use `memoryPostgresChat` for agent conversation history
11. **Parallel Synchronization**: When fan-out creates N parallel branches that must ALL complete before a downstream node, use `n8n-nodes-base.merge` v3.2 with `mode: "append"` and `numberInputs: N`. Connect each branch to a separate input index. NEVER connect multiple parallel branches to the same input index — n8n fires on first arrival.
12. **executeWorkflow v1.3 Implicit Data Passing**: Empty `workflowInputs.value: {}` passes upstream data through implicitly to sub-workflow triggers. Only add explicit mappings to rename or filter fields.
13. **Sub-Workflow Error Taxonomy**: (1) Pre-flight validation = node config issues (typeVersion, parameters). (2) Runtime execution = connection topology issues (parallel sync, missing nodes). Pre-flight doesn't catch connection logic.

---

*This pattern library is a living document. Update as new patterns emerge.*
