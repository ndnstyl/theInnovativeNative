---
name: gemini-image
description: |
  Gemini API reference for image generation and visual AI tasks.
  Covers multimodal image generation (Gemini 2.0 Flash Exp), consistency
  scoring pipeline, prompt anchoring, and character sheet integration.
  Used in Haven OOTD, BowTie Bullies, and scene generation pipelines.
triggers:
  - "gemini image"
  - "gemini vision"
  - "image generation"
  - "consistency scoring"
  - "character sheet"
  - "gemini imagen"
---

# Gemini Image Generation — API Reference

## Overview

Google Gemini is the primary image generation and vision scoring engine across projects. Used for:
- **Image generation** — Scene images, character poses, outfit composites
- **Consistency scoring** — Vision model rates generated vs reference images
- **Outfit analysis** — Multimodal fashion description from Pinterest pins
- **Batch QA** — Multi-image quality assessment in a single call

---

## Authentication

### n8n Credential
| Credential | ID | Type |
|------------|----|------|
| Google Gemini API | `JbBNLCe83ER3tCwD` | `googlePalmApi` (Gemini billing connected) |

### HTTP Request Pattern (for features not in native node)
```json
{
  "authentication": "predefinedCredentialType",
  "nodeCredentialType": "googlePalmApi",
  "method": "POST",
  "url": "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
}
```

---

## Model Selection

| Model | Use Case | Notes |
|-------|----------|-------|
| `gemini-2.0-flash-exp` | Image generation (n8n native node) | Primary for scene/character images |
| `gemini-2.5-flash-image` | Cel-shaded/2D style (Nano Banana) | Correct for BowTie animated characters |
| `gemini-2.0-flash-exp-image-generation` | Photorealistic 3D | Wrong for animated characters, correct for Haven |
| `gemini-2.0-flash` | Vision scoring, text analysis | Fast, cheap, used for consistency checks |
| `gemini-2.5-flash` | Batch QA scoring | Best for multi-image analysis with JSON output |

**Key distinction:** `gemini-2.5-flash-image` produces cel-shaded/2D results (correct for BowTie). `gemini-2.0-flash-exp-image-generation` produces photorealistic 3D (wrong for animated characters).

---

## Image Generation

### n8n Native Node
```json
{
  "resource": "image",
  "modelId": "gemini-2.0-flash-exp",
  "text": "={{ $json.scene.image_prompt }}",
  "options": {
    "systemMessage": "Generate images matching facial features...",
    "temperature": 0.8
  }
}
```

### HTTP Request (with aspect ratio control)

The native n8n node doesn't expose `imageConfig.aspectRatio`. Use HTTP Request instead:

```json
{
  "contents": [{
    "role": "user",
    "parts": [
      { "text": "Generate a 9:16 portrait image of..." }
    ]
  }],
  "generationConfig": {
    "imageConfig": {
      "aspectRatio": "9:16"
    }
  }
}
```

**Supported aspect ratios:** `"1:1"`, `"2:3"`, `"3:2"`, `"3:4"`, `"4:3"`, `"9:16"`, `"16:9"`, `"21:9"`

---

## Multimodal Input (Image-to-Image / img2img)

Pass reference images as `inline_data` in the `parts` array alongside the text prompt:

```json
{
  "contents": [{
    "role": "user",
    "parts": [
      {
        "inlineData": {
          "mimeType": "image/jpeg",
          "data": "<base64-encoded-image>"
        }
      },
      {
        "text": "Edit this outfit to change the top to a cream blazer..."
      }
    ]
  }]
}
```

**For img2img editing:** Describe what to CHANGE, not what the character looks like (the reference image already IS the character).

---

## Consistency Scoring Pipeline

Used in WF-V03 Haven Scene Generator (Nodes 9-11).

### Flow
```
Generate Image (Gemini)
  → Vision Scoring (Gemini Flash, temp 0.2)
  → Parse Score (Code node)
  → IF score < 7 AND attempt < 3 → Refine prompt → Retry
  → IF score >= 7 OR attempt = 3 → Continue to upload
```

### Vision Scoring Prompt
```
Compare this generated image to the reference image. Rate consistency 1-10:
- Face features (shape, proportions, expression): 40%
- Hair (color, style, highlights): 30%
- Skin tone: 20%
- Outfit/accessories match: 10%
Return JSON: { "score": N, "issues": ["list of mismatches"] }
```

**Config:** `temperature: 0.2`, `maxOutputTokens: 512` (low temp for deterministic scoring)

### Score Parsing (handles malformed JSON)
```javascript
let text = response.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
let scoreResult;
try {
  scoreResult = JSON.parse(text);
} catch {
  const match = text.match(/"score"\s*:\s*(\d+\.?\d*)/);
  scoreResult = { score: match ? parseFloat(match[1]) : 5, issues: ['Parse failed'] };
}
```

### Threshold
- **Pass:** score >= 7
- **Retry:** score < 7 AND attempt < max_attempts (3)
- **Accept with warning:** score < 7 AND attempt = max_attempts

---

## Batch QA Pattern

Single Gemini Vision call with ALL scene images + product reference photo (from shared-learnings 2026-02-18):

- 6-8x cheaper than per-scene calls
- Use `gemini-2.5-flash` with `temperature: 0.1`
- Set `responseMimeType: "application/json"` for structured output
- Send images as `inline_data` base64 in `parts` array
- Works for up to ~10 images per call before token limits

### Scoring Matrix (WF-005)
5 dimensions x 8 points = 40 max:
- Cross-Scene Diversity
- Product Accuracy
- Physics & Realism
- Setting Consistency
- Visual Storytelling

**Thresholds:** >= 80% pass, 60-79% conditional (regen flagged scenes), < 60% fail. Any single dimension < 4/8 forces conditional.

---

## Character Sheet Integration

### Haven Avatar (from Character Sheets table `tbl8pQ9WlCikdesYf`)

**Canonical Prompt:**
```
Consistent character: young woman, mid-20s, warm medium-brown skin,
curly/coily sandy blonde hair with golden highlights shoulder-length,
piercing green eyes, very faint cleft chin, full lips, natural makeup,
warm confident expression.
```

**Negative Prompt:**
```
straight hair, dark hair, pale skin, brown eyes, dark eyes, amber eyes,
heavy makeup, exaggerated expressions, cartoonish, anime style,
different person, inconsistent features
```

### BowTie Red Nose (from brand-blueprint.md)

**Canonical Prompt:**
```
American Red Nose Pitbull, adult male, strong muscular realistic build,
rich reddish-brown copper coat, distinctive red/liver nose,
amber/honey eyes, natural uncropped rose ears, small healed scar
across left brow, wearing sleeveless black coveralls slightly unzipped
over bare muscular chest, black military tactical boots.
Controlled intelligence, gentleman strategist expression. NOT aggressive.
NOT playful. Watchful. Calm. 2D cel-shaded style.
```

### Prompt Anchoring Technique

For photorealistic Haven content, prefix prompts with a "photoAnchor":
```
photoAnchor: photorealistic, shot on Sony A7III, 85mm f/1.4, natural lighting
```

This steers Gemini toward photographic output vs illustration.

---

## n8n Integration Patterns

### Image Generation → Drive Upload → Airtable Record
```
Gemini (generate image)
  → Google Drive (upload, folderId: "1u0g-Yg2-RKr-EhuqKTJ7Yl8ywtJHwrWW")
  → Google Drive (share, operation: "share", role: "reader", type: "anyone")
  → Code (build URLs: uc?export=download + /file/d/ID/view)
  → Airtable (create Asset record with Drive URL)
```

### Binary Data After Code/IF Nodes
Code nodes and IF nodes don't forward binary data automatically. Restore with:
```javascript
const imageNode = $('Generate Image with Gemini').first();
return [{
  json: $input.first().json,
  binary: imageNode.binary
}];
```

---

## Cost Reference

| Operation | Approx Cost |
|-----------|-------------|
| Image generation (per image) | ~$0.01-0.03 |
| Vision scoring (per call) | ~$0.005 |
| Batch QA (10 images) | ~$0.02 |
| Monthly budget (scripts + scoring + images) | ~$5-10 |

---

## Related Skills

- **Kie.ai** (`infrastructure/kie-ai`) — Downstream: Gemini images become Kie.ai video inputs
- **Google Drive API** (`infrastructure/gdrive-api`) — Upload and share generated images
- **Airtable API** (`infrastructure/airtable-api`) — Store asset records with attachment previews
