---
name: kie-ai
description: |
  Kie.ai API reference for image-to-image editing and video generation.
  Covers Veo3 video generation, Nano Banana Pro image editing, callback patterns,
  and n8n integration. Used across Haven OOTD, Faceless Reels, and BowTie Bullies.
triggers:
  - "kie.ai"
  - "kie ai"
  - "veo3"
  - "video generation"
  - "image to video"
  - "nano banana"
---

# Kie.ai — Image & Video Generation API

## Overview

Kie.ai is a unified API gateway for AI image editing (Nano Banana Pro) and video generation (Google Veo3 / Veo3 Fast). It provides a single authentication layer and callback system across multiple underlying models.

**Used in:**
- Haven OOTD pipeline (image-to-image outfit editing)
- Faceless Generator Reels (text-to-video scene clips)
- Haven Scene Generator WF-V03 (image-to-video with callback)
- BowTie Bullies visual pipeline (B-roll video clips)

---

## Authentication

**Method:** Bearer token via `Authorization` header.

### n8n Credential Patterns

| Credential Type | Credential ID | Token | Used In |
|----------------|--------------|-------|---------|
| httpHeaderAuth | `EFETRZwIsMkjex1c` | (stored in n8n) | WF-V03 Haven Scene Generator |
| Inline header | (see n8n credential store) | (stored in n8n) | Faceless Generator Reels |

**n8n httpHeaderAuth setup:**
```json
{
  "authentication": "predefinedCredentialType",
  "nodeCredentialType": "httpHeaderAuth"
}
```

**Inline header setup (alternative):**
```json
{
  "sendHeaders": true,
  "headerParameters": {
    "parameters": [
      { "name": "Authorization", "value": "Bearer <TOKEN>" }
    ]
  }
}
```

---

## API Reference

### Video Generation — `POST /api/v1/veo/generate`

Generates video clips from text prompts (text-to-video) or from image + prompt (image-to-video).

**Endpoint:** `https://api.kie.ai/api/v1/veo/generate`

#### Text-to-Video Request
```json
{
  "prompt": "A slow push through a dimly lit urban alley, rain on concrete...",
  "model": "veo3_fast",
  "aspectRatio": "9:16",
  "enableFallback": false,
  "enableTranslation": true,
  "generationType": "TEXT_2_VIDEO"
}
```

#### Image-to-Video Request (single image, with callback)
```json
{
  "prompt": "Gentle hair movement, soft breathing, natural blink...",
  "imageUrls": ["https://drive.google.com/uc?export=download&id=FILE_ID"],
  "model": "veo3_fast",
  "callBackUrl": "https://n8n.srv948776.hstgr.cloud/webhook/kie-callback?type=...",
  "aspect_ratio": "9:16",
  "seeds": "42781",
  "enableFallback": false
}
```

#### First + Last Frame Video (FIRST_AND_LAST_FRAMES_2_VIDEO)

Generates a video that interpolates between a start frame and an end frame. The prompt describes the motion/activity that connects the two frames.

```json
{
  "prompt": "Construction workers place steel beams, crane arm swings slowly...",
  "imageUrls": ["https://drive.google.com/.../start_frame", "https://drive.google.com/.../end_frame"],
  "model": "veo3",
  "generationType": "FIRST_AND_LAST_FRAMES_2_VIDEO",
  "aspect_ratio": "9:16",
  "callBackUrl": "https://n8n.srv948776.hstgr.cloud/webhook/kie-callback?type=tht_video&record=..."
}
```

**Response:**
```json
{
  "code": 200,
  "data": {
    "taskId": "abc123",
    "jobId": "abc123"
  }
}
```

**Notes:**
- `imageUrls` accepts Google Drive direct download URLs (`uc?export=download` format)
- `callbackUrl` is optional — if omitted, use polling instead
- `seeds` accepts a numeric string for reproducibility
- `enableTranslation: true` translates non-English prompts
- Batch interval recommended: 30 seconds between requests

---

### Video Polling — `GET /api/v1/veo/record-info`

Poll for video generation status and result URLs.

**Endpoint:** `https://api.kie.ai/api/v1/veo/record-info`

```
GET /api/v1/veo/record-info?taskId=abc123
Authorization: Bearer <TOKEN>
```

**Response (completed):**
```json
{
  "code": 200,
  "data": {
    "status": "completed",
    "info": {
      "resultUrls": ["https://storage.googleapis.com/..."]
    }
  }
}
```

---

### Image Generation — `POST /api/v1/jobs/createTask`

Image-to-image editing using the Nano Banana Pro model.

**Endpoint:** `https://api.kie.ai/api/v1/jobs/createTask`

```json
{
  "model": "nano-banana-pro",
  "prompt": "Edit description of changes to make...",
  "image_urls": ["https://..."],
  "num_images": 1,
  "output_format": "jpeg"
}
```

---

### Image Polling — `GET /api/v1/jobs/recordInfo`

Poll for image generation status.

**Endpoint:** `https://api.kie.ai/api/v1/jobs/recordInfo`

```
GET /api/v1/jobs/recordInfo?jobId=xyz789
Authorization: Bearer <TOKEN>
```

---

## Models Reference

| Model | Type | Use Case | Aspect Ratios | Approx Cost |
|-------|------|----------|---------------|-------------|
| `veo3_fast` | Video | Quick video clips, iteration | 9:16, 16:9 | ~$0.10/clip |
| `veo3` | Video | High-quality final renders | 9:16, 16:9 | ~$0.25-0.50/clip |
| `nano-banana-pro` | Image | Image-to-image editing, outfit swap, text-to-image | Various | ~$0.05/image |

## Generation Types (Veo3)

| Type | Description | Required Fields |
|------|-------------|-----------------|
| `TEXT_2_VIDEO` | Text prompt → video | `prompt` |
| `IMAGE_2_VIDEO` | Single image + prompt → video | `prompt`, `imageUrls: [1 url]` |
| `FIRST_AND_LAST_FRAMES_2_VIDEO` | Start frame + end frame → interpolated video | `prompt`, `imageUrls: [start, end]` |

---

## Callback Patterns

### Pattern 1: Fire-and-Forget with callBackUrl (PREFERRED)

Submit the job with a `callBackUrl` query parameter. Workflow exits immediately. Kie.ai POSTs the result back when done. A central callback handler (WF-KIE-CALLBACK) processes all responses.

**Key:** The field name is `callBackUrl` (camelCase with capital B).

```
callBackUrl: https://n8n.srv948776.hstgr.cloud/webhook/kie-callback
  ?type=tht_image
  &table=tblWExmILcFYnW9ze
  &record={prompt_record_id}
  &project={project_record_id}
  &phase={phase_number}
```

**Flow:**
1. Build payload with `callBackUrl` including query params that identify the record
2. POST to Kie.ai endpoint → get taskId back immediately
3. Workflow EXITS (no polling, no waiting)
4. Kie.ai POSTs result to callBackUrl when done
5. Callback handler: download → Drive upload → share → update Airtable → increment counter

**NBP callback body:**
```json
{
  "code": 200,
  "data": {
    "taskId": "...",
    "state": "success",
    "resultJson": "{\"resultUrls\":[\"https://...\"]}"
  }
}
```
Image URL: `JSON.parse(body.data.resultJson).resultUrls[0]`

**Veo3 callback body:**
```json
{
  "code": 200,
  "data": {
    "taskId": "...",
    "info": {
      "resultUrls": "https://...",
      "resolution": "1080P"
    }
  }
}
```
Video URL: `body.data.info.resultUrls` (string, NOT array)

### Pattern 2: n8n resumeUrl Callback (Legacy)

Uses n8n's `$execution.resumeUrl` with a Wait node. Keeps execution alive. Less efficient — use Pattern 1 instead.

### Pattern 3: Polling (Avoid)

Repeated GET calls to check status. Each poll is an API request. **Risk: rate limiting, account lockout.** Only use if callback is unavailable.

### Central Callback Handler: WF-KIE-CALLBACK

**Workflow ID:** `5FfmHlsRPi8qfEH8`
**Webhook:** `POST /webhook/kie-callback`

Routes by `type` query parameter:
| Type | Action |
|------|--------|
| `ootd` | Update Haven OOTD Looks table, increment Categories Done |
| `tht_image` | Update THT Prompts table, Drive folder `1d4IF1dLR31I7RGjkQ4YDWya36_0OwsBd`, increment Images Done (threshold: 8 → `images_generated`) |
| `tht_video` | Update THT Prompts table, Drive folder `1RwU-yudHIC79yRgSoqnkxYFBEp48mrWp`, increment Videos Done (threshold: 4 → `videos_generated`) |
| default (cs) | Update CS Variations table |

---

## Google Drive URL Pattern

Kie.ai accepts Google Drive images as input via the direct download URL format:

```
https://drive.google.com/uc?export=download&id=FILE_ID
```

**Important:** Standard Drive view URLs (`/file/d/ID/view`) do NOT work as image inputs. The file must also have public sharing enabled ("Anyone with the link" = Viewer).

---

## n8n Integration Patterns

### Typical Video Generation Flow
```
HTTP Request (POST /veo/generate)
  → Store Job ID (Code node)
  → Wait for Callback (Wait node, 10 min timeout)
  → Extract Video URL (Code node)
  → Check if Polling Needed (IF node)
    ├── YES → Fallback Poll (GET /jobs/recordInfo) → Extract URL
    └── NO → Download Video (HTTP Request, responseFormat: file)
```

### Batch Video Generation
```
SplitInBatches (batchSize: 1, batchInterval: 30000ms)
  → Generate Videos (POST /veo/generate)
  → Wait (15 seconds)
  → Get Generated Videos (GET /veo/record-info)
```

---

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| Callback not received | n8n URL unreachable, Kie.ai timeout | Use polling fallback |
| `status: "failed"` in poll | Model error, invalid image URL | Retry with different seed |
| Empty `resultUrls` | Generation still processing | Wait and re-poll |
| 401 Unauthorized | Expired or wrong token | Check bearer token |
| Image URL rejected | Non-public Drive file or wrong URL format | Use `uc?export=download` format + public sharing |

**Timeout guidance:**
- Video generation typically takes 1-5 minutes
- Set Wait node to 10 minutes (600s) for safety
- If polling, check every 30-60 seconds

---

## AI Disclosure Requirements

Per YouTube policy (`youtube-ai-policy-reference.md`):
- All Kie.ai/Veo-generated video clips require **"Altered or synthetic content"** disclosure on YouTube
- SynthID (Google's watermark) does NOT detect Kie.ai output — disclose manually
- Include in video description: `AI-generated video clips (Kie.AI)`

---

## Cost Reference

| Usage | Estimated Cost |
|-------|---------------|
| Single veo3_fast clip | ~$0.10 |
| Single veo3 quality clip | ~$0.25-0.50 |
| Nano Banana Pro image edit | ~$0.05 |
| Monthly budget (80-160 clips) | ~$20-40 |

---

## Related Skills

- **Gemini Image** (`infrastructure/gemini-image`) — Image generation (upstream of Kie.ai video)
- **Google Drive API** (`infrastructure/gdrive-api`) — File sharing for image inputs
- **Builder** (`workers/builder`) — n8n workflow deployment
