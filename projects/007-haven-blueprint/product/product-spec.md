# Haven AI Influencer Blueprint — Product Specification

## Product Overview

**Name**: The AI Influencer Blueprint
**Tagline**: Build Your Own AI Influencer From Scratch
**Price**: $57 (launch pricing, marked down from $127)
**Format**: Hybrid — Notion workspace + downloadable assets + video walkthroughs
**Delivery**: Instant access via email after Stripe checkout

---

## Main Product ($57)

### Module 1: Brand Foundation
*Maps to Haven Phase 0A-0C*

| Deliverable | Format | Description |
|-------------|--------|-------------|
| Brand System Template | Notion + MD | Full brand-system.md template with all sections (philosophy, color system, typography, photography direction, signature elements) |
| Character Sheet Generator | Notion + Prompts | Step-by-step system for creating consistent AI characters: physical description, wardrobe system, consistency markers, room sheets |
| 60+ Gemini Prompt Templates | Notion DB + TXT | Organized by category: Face Close-Ups, Poses, Expressions, Outfits, Settings, Angles |
| Tone of Voice Builder | Notion + MD | Template for creating brand voice: core attributes, vocabulary patterns, writing guidelines, platform adjustments |
| Visual Identity Lockdown Checklist | Notion | Step-by-step checklist ensuring character consistency across all generations |

### Module 2: Mission Control (Airtable)
*Maps to Haven Airtable Architecture*

| Deliverable | Format | Description |
|-------------|--------|-------------|
| Airtable Base Template | Airtable Link | Duplicatable base with 9 pre-configured, linked tables |
| Field-by-Field Setup Guide | Notion + Video | Every field, formula, and linked record explained |
| Pipeline State Machine Doc | Notion | Status flows: Playbook → Content Pipeline → Video → Publishing |
| Table Schema Reference | Notion | Products, Playbooks, Content Pipeline, Assets, Videos, QA Reviews, Character Sheets, Publishing, Analytics |

**Airtable Tables Included:**
1. Products — Product catalog with Amazon links, pricing, ratings
2. Playbooks — Video concepts linking product to trend/hook
3. Content Pipeline — Scripts with scene JSON, production status tracking
4. Assets — Generated images/video clips with Drive URLs and quality scores
5. Videos — Final assembled videos with QA tracking
6. QA Reviews — Audit trail for every review
7. Character Sheets — Avatar + room prompts for consistency
8. Publishing — Cross-platform posting schedule
9. Analytics — Engagement metrics tracking

### Module 3: AI Image Generation Pipeline
*Maps to WF-003 (Script Generator) + WF-004 (Asset Generator)*

| Deliverable | Format | Description |
|-------------|--------|-------------|
| WF-003 Script Generator | JSON | n8n workflow: Playbook + Product + Character Sheet → Gemini → 6-8 scene JSON |
| WF-004 Asset Generator | JSON | n8n workflow: Per-scene image prompt → Gemini → quality scoring → Drive upload |
| Gemini API Setup Guide | Notion + Video | API key setup, model selection, parameter tuning |
| Quality Scoring Rubric | Notion | 7/10 threshold system with 3-retry logic, scoring criteria |
| Character Consistency Guide | Notion | How to maintain character identity across hundreds of generations |
| Google Drive Asset Structure | Notion | Folder organization for generated assets, videos, music, references |

### Module 4: Automation Engine (n8n)
*Maps to WF-001 (Master Orchestrator)*

| Deliverable | Format | Description |
|-------------|--------|-------------|
| WF-001 Master Orchestrator | JSON | n8n workflow: chains WF-003 → WF-004 (per scene) → WF-006 |
| n8n Setup Guide (Self-Hosted) | Notion + Video | Docker/npm install, credential setup, webhook configuration |
| n8n Setup Guide (Cloud) | Notion + Video | n8n cloud account, workflow import, credential mapping |
| Webhook Integration Guide | Notion | Connecting Airtable status changes to n8n triggers |
| Error Handling Patterns | Notion | Retry logic, fallback flows, error notification setup |
| Credential Reference | Notion | Which API keys go where (Gemini, Google Drive, Airtable) |

### Module 5: Video Assembly (FFMPEG)
*Maps to WF-006 + FFMPEG Assembly Spec*

| Deliverable | Format | Description |
|-------------|--------|-------------|
| WF-006 FFMPEG Assembler | JSON | n8n workflow: scene images + music → Ken Burns + crossfade + overlays → MP4 |
| FFMPEG Command Recipe Library | Notion + MD | Every command explained: Ken Burns zoom, crossfade transitions, text overlays, music mixing |
| Output Spec Reference | Notion | 1080x1920, H.264, CRF 18, AAC 128kbps, 30fps — with fallback cascade |
| Text Overlay System | Notion | Hook text, caption bars, CTA bars, feature callouts — with exact positioning and styling |
| Music Integration Guide | Notion | Volume levels, fade-in/out, ducking for voiceover |
| Platform Export Presets | Notion | Instagram Reels, TikTok, YouTube Shorts — resolution, codec, file size limits |

### Module 6: Content Strategy & Scaling

| Deliverable | Format | Description |
|-------------|--------|-------------|
| Content Strategy Playbook | Notion + PDF | Complete posting strategy, content pillars, audience growth |
| 20+ Hook Formulas | Notion DB | Problem-agitate, reveal, POV, social proof, curiosity gap — with examples |
| Video Structure Templates | Notion | B-Roll (30s), Talking Head (30s), Cinematic (30s) — beat-by-beat breakdowns |
| Content Framing Rules | Notion | Discovery voice, emotional storytelling arc, soft CTA patterns |
| Niche Adaptation Guide | Notion | How to adapt the kitchen/lifestyle system to any niche |
| Trend Automation Roadmap | Notion | Phase 4 concepts: automated trend scraping → playbook generation |

---

## Order Bump: Advanced Prompt Engineering Pack ($17)

| Deliverable | Format | Description |
|-------------|--------|-------------|
| 100+ Additional Prompt Templates | Notion DB + TXT | Prompts for 5 additional niches: Fashion, Fitness, Tech, Travel, Food |
| Prompt Engineering Masterclass | Notion | Advanced techniques: negative prompts, style mixing, consistency tricks |
| Niche-Specific Character Sheets | Notion | Pre-built character sheet templates for each niche |
| Prompt Debugging Guide | Notion | Common failures and how to fix them |

---

## Upsell 1: Haven Inner Circle ($47/month)

| Deliverable | Format | Description |
|-------------|--------|-------------|
| Private Community Access | Skool/Discord | Direct access to other AI influencer builders |
| Monthly Live Workshops | Video | Live build sessions, Q&A, new techniques |
| Pipeline Updates | Notion | First access to system updates and new workflows |
| 1-on-1 Setup Review | Video Call | Monthly office hours for pipeline troubleshooting |

---

## Downsell: 3-Month Community Trial ($27 one-time)

| Deliverable | Format | Description |
|-------------|--------|-------------|
| 3-Month Community Access | Skool/Discord | Trial period of Inner Circle community |
| Recorded Workshop Archive | Video | Access to past workshop recordings |
| Community Resource Library | Notion | Shared templates, prompts, and workflows from members |
