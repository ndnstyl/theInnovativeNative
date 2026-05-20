# Plan: ElevenLabs n8n Workflow for BowTie Bullies Voice Generation

## Context

The existing ElevenLabs n8n workflow (`https://n8n.srv948776.hstgr.cloud/workflow/EjPLQUd8DvcisOuk`) needs modification to support BowTie Bullies' Tyrone voice generation with AAVE scripts. The AAVE orthography approach is validated — ElevenLabs is the production TTS engine.

## Current State

- Existing workflow handles basic ElevenLabs TTS generation
- AAVE SSML script exists: `scripts/tyrone-origin-story-90s-AAVE-elevenlabs.ssml`
- Voice guide updated with AAVE writing rules and ElevenLabs config
- Reference audio exists: `canonicalCharacter/tyroneAAVE_originStory.mp3`

## Workflow Modifications

### Phase 1: Audit Existing Workflow

1. **Export current workflow JSON** via n8n API:
   ```
   GET /api/v1/workflows/EjPLQUd8DvcisOuk
   ```
2. Document current node topology (trigger → TTS → output)
3. Identify which ElevenLabs API endpoints are used (text-to-speech, voice cloning, etc.)
4. Check credential configuration for ElevenLabs API key

### Phase 2: Modify for AAVE Segmented Generation

The origin story uses 18 emotional segments with silence gaps between them. The workflow needs to:

1. **Input Node**: Accept SSML or segmented text input
   - Option A: Single SSML payload (ElevenLabs parses `<break>` tags natively)
   - Option B: Array of segments with per-segment parameters (more control)
   - **Recommended**: Option A for simplicity — ElevenLabs handles SSML well

2. **ElevenLabs TTS Node**: Configure with Tyrone's voice settings
   ```
   Voice ID: rWyjfFeMZ6PxkHqD3wGC
   Model: eleven_multilingual_v2
   Speed: 1.0
   Stability: 0.50
   Similarity Boost: 0.75
   Style Exaggeration: 0.36
   Speaker Boost: ON
   ```

3. **Output Node**: Save generated audio to:
   - Local path: `canonicalCharacter/` directory
   - Google Drive: BowTie Bullies project folder
   - Airtable: Update deliverable record with file URL

### Phase 3: Add Airtable Pipeline Integration

1. **Trigger Options**:
   - Manual trigger (for one-off generation)
   - Webhook trigger (for script-driven generation from Claude Code)
   - Airtable trigger (when a new script record is created with Status = "Ready for TTS")

2. **Airtable Integration**:
   - Read script text from Airtable record
   - Update record status: "Ready for TTS" → "Generating" → "Complete"
   - Attach audio file URL to record
   - Log generation metadata (duration, model, timestamp)

3. **Error Handling**:
   - ElevenLabs API rate limit handling (retry with backoff)
   - Character limit checks (ElevenLabs has per-request limits)
   - Audio quality validation (file size > 0, duration > 0)

### Phase 4: Google Drive Upload

1. Upload generated audio to Google Drive
2. Set sharing to "Anyone with link can view"
3. Return shareable URL
4. Update Airtable deliverable record with File URL

## Node Topology (Target)

```
Manual Trigger / Webhook / Airtable Trigger
    │
    ├── [IF] Input type?
    │   ├── SSML → Pass directly to ElevenLabs
    │   └── Segments array → Loop + concatenate
    │
    ├── [HTTP Request] ElevenLabs Text-to-Speech API
    │   POST /v1/text-to-speech/{voice_id}
    │   Headers: xi-api-key
    │   Body: { text, model_id, voice_settings }
    │
    ├── [Google Drive] Upload audio file
    │
    ├── [Airtable] Update deliverable record
    │   - Status: "Complete"
    │   - File URL: Drive shareable link
    │   - Audio Duration: calculated
    │
    └── [Slack] Notify #project-updates (optional)
```

## ElevenLabs API Reference

### Text-to-Speech Endpoint
```
POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}
Content-Type: application/json
xi-api-key: {api_key}

{
  "text": "<speak>...</speak>",  // SSML supported
  "model_id": "eleven_multilingual_v2",
  "voice_settings": {
    "stability": 0.50,
    "similarity_boost": 0.75,
    "style": 0.36,
    "use_speaker_boost": true
  }
}
```

Response: Binary audio (mpeg)

### Voice Cloning (if needed for new voice)
```
POST https://api.elevenlabs.io/v1/voices/add
Content-Type: multipart/form-data

files: [reference audio files]
name: "Tyrone - BowTie Bullies"
description: "AAVE-authentic, measured, stoic"
```

## Dependencies

- ElevenLabs API key (existing credential in n8n)
- Tyrone voice ID: `rWyjfFeMZ6PxkHqD3wGC`
- Google Drive folder for BowTie Bullies audio assets
- Airtable base with deliverables table

## Constraints

- **User tests all workflows** — Neo builds, user validates
- **Never test with Apify HTTP nodes**
- **n8n parallel branch sync**: If splitting to multiple nodes, use Merge node with `numberInputs` matching branch count
- **ElevenLabs character limits**: Check per-request limits for the account tier

## Estimated Effort

| Task | Agent | Hours |
|------|-------|-------|
| Audit existing workflow | Neo | 0.5 |
| Modify TTS node config | Neo | 1.0 |
| Add Airtable pipeline | Neo + Tab | 1.5 |
| Google Drive upload | Neo | 0.5 |
| Documentation | Neo | 0.5 |
| **Total** | | **4.0** |

## Next Steps

1. Assign to Neo via `/handoff`
2. Neo audits existing workflow first
3. User provides ElevenLabs Voice ID for Tyrone
4. Neo modifies workflow, user tests
5. Document final workflow in `.specify/patterns/n8n/`
