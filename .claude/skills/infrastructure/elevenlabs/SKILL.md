---
name: elevenlabs
description: ElevenLabs TTS API — voice synthesis, brand voices, and Remotion audio pipeline.
triggers:
  - "elevenlabs"
  - "eleven labs"
  - "voiceover"
  - "tts"
  - "text to speech"
  - "voice synthesis"
  - "kal jones"
---

# ElevenLabs — Voice Synthesis & Remotion Audio Pipeline

## Overview

ElevenLabs is our primary TTS provider for Remotion videos, Cerebro explainer VO, BowTie Bullies narration, and any automated voiceover content. Used across **IG Content Factory (20–60 reels/day)**, Cerebro product explainers, and the Bullies faceless YouTube channel.

**Do not use ElevenLabs for:**
- Real-time voice chat (use realtime voice APIs)
- Non-narrated music beds (use library tracks)
- Any content where legal requires a human-verified voice (legal explainers requiring named attorney voice)

---

## Pinned Brand Voices

Voice IDs are stable — do NOT re-clone or re-generate unless explicitly approved. Re-cloning changes the sound subtly and breaks series consistency.

| Brand / Use | Voice Name | Voice ID | Model |
|---|---|---|---|
| BowTie Bullies narrator | Kal Jones | `68RUZBDjLe2YBQvv8zFx` | `eleven_turbo_v2_5` |
| Cerebro explainer | _TBD — add when cloned_ | _TBD_ | `eleven_multilingual_v2` |
| Haven OOTD | _TBD_ | _TBD_ | `eleven_turbo_v2_5` |
| IG Content Factory (default) | Kal Jones | `68RUZBDjLe2YBQvv8zFx` | `eleven_turbo_v2_5` |

**When to add a new voice:** Only for a new brand/series. Document the voice ID here in the same commit.

---

## Authentication

- **API key location:** `~/.claude/.mcp.json` (do NOT print; ref only)
- **Header:** `xi-api-key: <key>`
- **n8n credential:** `ElevenLabs httpHeaderAuth` (check n8n credential store)

**CRITICAL:** API keys are sensitive. Never echo to console, never paste in Airtable, never commit to git. Reference only via env var or n8n credential.

---

## Core Endpoints

### Text → Speech (File)

```
POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}
Headers:
  xi-api-key: <key>
  Content-Type: application/json
  Accept: audio/mpeg

Body:
{
  "text": "The narration goes here.",
  "model_id": "eleven_turbo_v2_5",
  "voice_settings": {
    "stability": 0.5,
    "similarity_boost": 0.8,
    "style": 0.0,
    "use_speaker_boost": true
  }
}
```

Response: binary MP3 stream. Save directly to `.mp3` file.

### Text → Speech (Streaming — for long form)

```
POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/stream
```

Same body. Use for any VO >30 seconds to avoid timeouts. Chunks arrive as they're generated.

### Voice Cloning (Instant — one shot)

```
POST https://api.elevenlabs.io/v1/voices/add
Headers: xi-api-key, Content-Type: multipart/form-data

Form fields:
  name: "New Voice Name"
  description: "Use case / brand"
  files: (audio sample, 1-3 minutes, clean, no music)
  labels: {"accent": "american", "gender": "male"}
```

**Sample requirements:**
- 1–3 minutes of clean speech
- Mono, 22kHz or higher
- No background music, no noise, no lip smacks/clicks
- Natural prosody (not monotone, not shouting)

---

## Model Selection

| Model | Speed | Quality | Languages | Use When |
|---|---|---|---|---|
| `eleven_turbo_v2_5` | Fast (~300ms TTFB) | Good | 32 | **Default** — reels, shorts, high volume |
| `eleven_multilingual_v2` | Slow (~800ms TTFB) | Best | 29 | Long-form explainers, YouTube uploads |
| `eleven_flash_v2_5` | Fastest (~75ms TTFB) | Lower | 32 | Real-time use cases (rare) |
| `eleven_monolingual_v1` | Slow | Best English | 1 | Legacy — avoid for new work |

**Rule:** Use `eleven_turbo_v2_5` unless quality is audibly lacking. The 0.5s latency difference on multilingual v2 adds up across 20–60 reels/day.

---

## Voice Settings Tuning

| Setting | Range | Low | High | Default |
|---|---|---|---|---|
| `stability` | 0–1 | More expressive, variable emotion | Monotone, consistent | 0.5 |
| `similarity_boost` | 0–1 | Looser interpretation | Closer to original clone | 0.8 |
| `style` | 0–1 | Neutral delivery | Amplified style/accent | 0.0 for narration, 0.3 for hype |
| `use_speaker_boost` | bool | — | Sharper clarity | `true` |

### Recipe: BowTie Bullies narration (Kal Jones)
```json
{ "stability": 0.45, "similarity_boost": 0.85, "style": 0.0, "use_speaker_boost": true }
```
Restrained, earned, witness energy. Don't go higher on style — it over-dramatizes.

### Recipe: High-energy hook reels
```json
{ "stability": 0.3, "similarity_boost": 0.75, "style": 0.35, "use_speaker_boost": true }
```
More emotion, faster pacing, slight style amplification.

### Recipe: Cerebro product explainer
```json
{ "stability": 0.55, "similarity_boost": 0.85, "style": 0.15, "use_speaker_boost": true }
```
Calm authority, clear articulation.

---

## SSML & Pronunciation Control

ElevenLabs supports a subset of SSML. Key tags:

```xml
<break time="1.0s"/>              <!-- Pause -->
<phoneme alphabet="ipa" ph="...">word</phoneme>  <!-- Pronunciation override -->
```

For reliable pacing, use **plain punctuation instead of SSML**:
- `...` (ellipsis) = ~0.4s pause
- `—` (em dash) = ~0.3s pause
- `.` (period) = sentence beat
- Line breaks: add blank line between paragraphs for paragraph beat

Excessive SSML can produce robotic output. Less is more.

---

## Remotion Integration Pipeline

### Standard flow: Text → VO → Remotion → Captions

```
1. Script written (txt or JSON)
   ↓
2. Split into scene segments (if long form)
   ↓
3. POST each segment to ElevenLabs → save as public/vo/scene-{n}.mp3
   ↓
4. Get audio duration with Mediabunny (rules/get-audio-duration.md)
   ↓
5. Pass duration to Remotion composition via calculateMetadata (rules/calculate-metadata.md)
   ↓
6. Transcribe MP3 → SRT via infrastructure/transcription skill
   ↓
7. Import SRT into Remotion via @remotion/captions (rules/import-srt-captions.md)
   ↓
8. Render with H.264 → upload to Google Drive → deliver
```

### File organization convention

```
remotion-videos/
├── public/
│   └── vo/
│       ├── {project}/
│       │   ├── scene-01.mp3
│       │   ├── scene-01.srt
│       │   ├── scene-02.mp3
│       │   └── scene-02.srt
```

- MP3 and SRT pair **must share basename** — `scene-01.mp3` ↔ `scene-01.srt`.
- Store in `public/vo/{project}/` so Remotion `staticFile()` can load them.

### Minimal Remotion audio load

```tsx
import { Audio, staticFile } from 'remotion';

<Audio src={staticFile('vo/bowtie/scene-01.mp3')} />
```

See [rules/audio.md](../../remotion/rules/audio.md) for trimming, volume, pitch control.

---

## Cost Reference (2026)

| Tier | Monthly chars | Voice clones | Monthly cost |
|---|---|---|---|
| Starter | 30,000 | 10 | $5 |
| Creator | 100,000 | 30 | $22 |
| Pro | 500,000 | 160 | $99 |
| Scale | 2,000,000 | 660 | $330 |

**Math for IG Content Factory:** 40 reels/day × 30 sec avg × 160 chars per 30s ≈ 6,400 chars/day × 30 = ~192k chars/month. **Pro tier required.**

**Savings tip:** Use `eleven_turbo_v2_5` — no credit multiplier. `eleven_multilingual_v2` costs 2× credits for same text.

---

## Error Handling

| Error | Cause | Fix |
|---|---|---|
| 401 Unauthorized | Bad/expired API key | Rotate via dashboard |
| 402 Payment Required | Quota exhausted | Upgrade tier or wait reset |
| 422 Unprocessable Entity | Invalid voice_id or model | Verify voice ID pinned above |
| 429 Too Many Requests | Rate limit | Batch with 500ms gap between requests |
| Silence in output | Text too short (<3 chars) | Pad with `.` or expand script |
| Mispronunciation | Model quirk on brand name | Use phonetic spelling: "Cerebro" → "Sair-rey-bro" |

---

## AI Disclosure

Per YouTube policy, AI-generated voiceover requires **"Altered or synthetic content"** disclosure. Include in description: `AI voiceover by ElevenLabs`.

For Instagram/TikTok: no mandatory label yet (as of 2026-04), but platform rules are tightening — add `#AIvoice` in hashtags for safety.

---

## Related Skills

- **Transcription** (`infrastructure/transcription`) — turns ElevenLabs MP3 into SRT for Remotion captions
- **Remotion rules** (`.claude/skills/remotion/rules/audio.md`) — audio loading, trimming, volume
- **Remotion rules** (`.claude/skills/remotion/rules/display-captions.md`) — caption rendering patterns
- **Creative worker** (`.claude/skills/workers/creative/`) — production owner
- **GDrive Upload** (`.claude/skills/infrastructure/gdrive-upload`) — final delivery

---

## Changelog

- **2026-04-05** — Initial pinned voice table, Remotion pipeline, IG Content Factory math
