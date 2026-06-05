# SOP: Done-For-You AI Listing Video Production

**Created**: 2026-02-22
**Owner**: Drew (PM)
**Feature**: re-ai-marketing
**Task**: T021

---

## Overview

- **Service**: Done-For-You AI Listing Video Production
- **Tiers**:
  - Single Listing: $497/listing
  - 3-Pack: $997 (3 listings, priority turnaround)
  - Development Project: $1,997/project
- **SLA**: 5 business days standard, 2 business days rush (+$99)
- **Output**: 8 AI-staged photos + property walkthrough video + branded social-ready reel
- **Formats Delivered**: Instagram 9:16, YouTube 16:9, MLS-ready, TikTok, Facebook 1:1

---

## Intake Process (Steps 1-3)

### Step 1: Customer Purchases DFY Package via Stripe

- Customer reaches DFY offer via the success page upsell (after Blueprint purchase) or direct Stripe Payment Link
- Stripe processes payment for the selected tier ($497 single, $997 3-pack, $1,997 development)
- Stripe Payment Link IDs are configured in `VISIONSPARK_RE.upsells` data object

### Step 2: Redirect to Intake Form

- After successful payment, customer is redirected to an intake form (Tally.so or custom form)
- **Required intake fields**:
  - Property address
  - Property type (single-family, condo, commercial, land)
  - Bedroom count, bathroom count, square footage
  - Architectural style (modern, traditional, transitional, coastal, farmhouse, industrial, luxury, contemporary)
  - Room types to stage (select from: living, kitchen, bedroom, bath, dining, office, nursery, outdoor)
  - Agent name, brokerage name, MLS number
  - Agent logo file (PNG, minimum 500x500px, transparent background preferred)
  - Disclosure state (for state-specific compliance overlay)
  - Target buyer persona (optional but helpful for staging direction)
  - Property photos (minimum 5, recommended 8-12, minimum 1024px wide)
  - Music preference (ambient showcase / modern upbeat / cinematic luxury)
  - Rush order flag (yes/no, +$99)

### Step 3: Webhook Triggers Record Creation

- Form submission fires webhook to n8n
- n8n workflow creates Airtable record in Projects table with:
  - `industry`: "real-estate"
  - `propertyType`, `clientName`, `agentBranding`, `mlsNumber`, `disclosureState` fields populated
  - `status`: "intake-received"
  - `orderTier`: single / 3-pack / development
  - `rushOrder`: true/false
  - `intakeDate`: timestamp
- Uploads agent logo and property photos to Google Drive folder: `/listings/{address}/intake/`

---

## Production Pipeline (Steps 4-8)

### Step 4: Review Intake (30 min)

- Verify all required fields are present and populated
- Verify property photos meet minimum quality:
  - Resolution: minimum 1024px wide
  - Lighting: not excessively dark or blown out
  - Content: shows the actual room (not blurry, not cropped wrong)
- Verify agent logo file is usable (not pixelated, has transparency or clean background)
- If any issues: contact client for replacements, update Airtable status to "intake-needs-revision"
- If all clear: update Airtable status to "in-production"

### Step 5: AI Staging (1 hour)

- Run property photos through Gemini staging pipeline with RE-specific prompts
- Use architectural style from intake to select appropriate prompt template
- Generate staged versions for each room type submitted
- Run quality scoring on all outputs:
  - Floating furniture check
  - Scale validation
  - Reflection consistency
  - Object merging detection
- Select best 8 outputs from scored results
- Upload staged images to Google Drive: `/listings/{address}/images/`
- Update Airtable: `stagingStatus` -> "complete", attach quality scores

### Step 6: Video Generation (2-4 hours processing, 15 min setup)

- Submit staged images to Veo 3.1 via Kie.AI for property walkthrough generation
- Configure camera movement prompts: dolly forward, pan reveal, walkthrough sequence
- Use fire-and-forget callback pattern: submit generation, receive webhook when complete
- For Development tier: also generate construction timelapse sequence (foundation-to-completion)
- Upload generated video to Google Drive: `/listings/{address}/video/`
- Update Airtable: `videoStatus` -> "complete"

### Step 7: Reel Assembly (30 min)

- FFMPEG assembly pipeline combines:
  - Staged photos (8 selected from Step 5)
  - Walkthrough video (from Step 6)
  - Agent branding overlay:
    - Agent logo: top-right position
    - Brokerage name: lower-third
    - MLS number: bottom-left
    - "AI Generated" disclosure: top-left
  - Music track (per client preference: ambient / upbeat / cinematic)
  - Transition effects between photo and video segments
- Export to all platform formats:
  - Instagram Reels: 9:16 (1080x1920)
  - TikTok: 9:16 (1080x1920)
  - YouTube Shorts: 9:16 (1080x1920)
  - MLS-compliant: 16:9 (1920x1080)
  - Facebook: 1:1 (1080x1080)
- Upload all exports to Google Drive: `/listings/{address}/reels/`
- Update Airtable: `reelStatus` -> "complete"

### Step 8: Quality Review (30 min)

- Manual review of ALL outputs:
  - **Staged photos**: No floating furniture, no merged/distorted objects, staging looks realistic
  - **Video**: No obvious AI artifacts, smooth camera motion, no frame glitches
  - **Branding**: Agent logo clearly visible but not obtrusive, brokerage and MLS number readable
  - **Disclosure**: "AI Generated" text visible on all video content
  - **Audio**: Levels normalized, music ducked under any voiceover, no clipping
  - **Resolution**: 1080p minimum for all video, 2048px minimum for photos
- If issues found: loop back to the relevant step (5, 6, or 7), fix, and re-review
- If all clear: update Airtable status to "ready-for-delivery"

---

## Delivery Process (Steps 9-11)

### Step 9: Upload Final Deliverables

- Organize deliverables in client's Google Drive folder:
  ```
  /listings/{address}/
  ├── images/           (8 staged photos, full resolution)
  ├── video/            (raw walkthrough video)
  └── reels/
      ├── instagram-9x16.mp4
      ├── tiktok-9x16.mp4
      ├── youtube-shorts-9x16.mp4
      ├── mls-16x9.mp4
      └── facebook-1x1.mp4
  ```
- Generate shareable Google Drive links for each folder

### Step 10: Send Delivery Email

- Email includes:
  - Download links for all formats (Instagram 9:16, YouTube 16:9, MLS-ready, TikTok, Facebook 1:1)
  - Usage guide: where and how to post each format, best practices per platform
  - Disclosure language to include in MLS listings and social media captions
  - Reminder of included revision round (1 round for Single/3-Pack, 2 rounds for Development)
  - Contact information for revision requests

### Step 11: Update Airtable

- `status` -> "delivered"
- `deliveryDate` -> timestamp
- `deliveryLinks` -> Google Drive folder URL
- `revisionsRemaining` -> 1 (Single/3-Pack) or 2 (Development)

---

## Client Revision Process

- **Included**: 1 round of revisions for Single and 3-Pack tiers; 2 rounds for Development tier
- **Timeline**: 2 business days for revisions
- **In-scope revisions**:
  - Re-staging specific rooms (different style, different furniture arrangement)
  - Branding adjustments (logo placement, font size, color tweaks)
  - Music change (swap to a different track from the available options)
  - Disclosure text wording adjustments
  - Re-export to specific platform format
- **Out-of-scope** (does NOT include):
  - Re-shooting or submitting new property photos
  - Generating entirely new video from scratch
  - Adding rooms not included in original intake
  - Complete style overhaul (e.g., switching from modern to farmhouse for all rooms)
- **Additional revision rounds**: $97/round beyond included allocation
- **Revision workflow**:
  1. Client emails revision request with specific feedback
  2. Update Airtable: `status` -> "revision-in-progress", log revision details
  3. Execute requested changes (loop back to relevant pipeline step)
  4. Quality review revised outputs
  5. Re-deliver via email with updated links
  6. Update Airtable: `revisionsRemaining` -> decrement, `status` -> "delivered"

---

## Quality Standards

| Standard | Requirement |
|----------|-------------|
| Staged photos | No floating furniture in staged images |
| Staged photos | No merged or distorted objects |
| Staged photos | Resolution minimum 2048px wide |
| Staged photos | Staging style consistent across all rooms for a property |
| Branding | Agent branding clearly visible but not obtrusive |
| Branding | Logo, brokerage, and MLS number all readable at delivery resolution |
| Compliance | "AI Generated" disclosure on ALL video content |
| Compliance | Disclosure text matches client's state requirements |
| Audio | Levels normalized across all segments |
| Audio | Music ducked under any voiceover |
| Audio | No clipping or distortion |
| Video | Resolution minimum 1080p for all video outputs |
| Video | Smooth camera motion, no frame glitches or artifacts |
| Video | No obvious AI generation artifacts (warping, morphing, flickering) |

---

## Escalation Triggers

| Trigger | Escalation Target | Action |
|---------|-------------------|--------|
| Client unhappy after revision round | Drew (PM) | Drew reviews output, determines if additional revision is warranted at no cost or if scope is beyond original agreement |
| Kie.AI generation fails 3x consecutively | Builder (n8n domain expert) | Builder investigates API issues, prompt failures, or model degradation |
| Branding assets missing or low quality | Client | Contact client directly for replacement logo/assets; pause production until received |
| Rush order with <24hr deadline | CEO | Requires CEO approval before accepting; may need to decline or charge premium |
| Property photos unusable (all below quality threshold) | Client | Contact client; cannot proceed without usable input photos |
| Disclosure state not covered in compliance guide | Drew (PM) | Research state requirements before producing; do not guess at compliance language |
| Pipeline produces content that violates Hard Rules (character refs, vignette, style in visual_prompt) | Builder | Immediate pipeline fix required; do not deliver non-compliant output |

---

## Metrics to Track (Airtable)

| Metric | Field / Calculation | Purpose |
|--------|---------------------|---------|
| Orders per week | Count of records created per week | Demand tracking |
| Average production time | `deliveryDate` minus `intakeDate` | SLA compliance monitoring |
| Revision rate | % of orders requiring revisions | Quality indicator |
| Client satisfaction | Follow-up survey score (1-5) | Service quality |
| Revenue per listing | Order amount / listings delivered | Unit economics |
| Rush order rate | % of orders flagged rush | Capacity planning |
| Pipeline failure rate | % of orders with generation failures | System reliability |
| Time per production step | Logged per step | Bottleneck identification |

---

## Tier-Specific Notes

### Single Listing ($497)
- 8 AI-staged interior photos
- 1 property walkthrough video (15-30 seconds)
- 1 branded listing reel with all platform exports
- 1 revision round
- Standard turnaround: 48 hours (2 business days)

### 3-Pack ($997)
- Full DFY package for 3 listings
- Priority turnaround: 24 hours per listing
- 1 revision round per listing
- Properties can be submitted individually or together

### Development Project ($1,997)
- 12 AI-staged unit photos (model units / floor plans)
- 1 construction timelapse video (foundation-to-completion)
- 1 development marketing reel (30-60 seconds)
- All platform exports
- 2 revision rounds
- Standard turnaround: 5 business days
