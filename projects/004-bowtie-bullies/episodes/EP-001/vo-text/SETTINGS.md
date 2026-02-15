# EP-001 ElevenLabs Voice Settings — SSML Edition

## Constants (every scene)
- Voice ID: rWyjfFeMZ6PxkHqD3wGC
- Model: eleven_multilingual_v2
- Similarity Boost: 0.75
- Speaker Boost: ON

## What SSML Controls vs What Sliders Control
- **SSML handles:** rate, volume, pitch, breaks, emphasis (baked into each .txt file)
- **Sliders handle:** Stability, Similarity, Style, Speaker Boost (set manually per scene from table below)

## Per-Scene Slider Settings
| File | Scene | Act | Stability | Style | Delivery |
|------|-------|-----|-----------|-------|----------|
| scene-001.txt | 1 | ACT 1 | 0.42 | 0.28 | Near-whisper, weight |
| scene-002.txt | 2 | ACT 1 | 0.42 | 0.30 | Isolation, "I stayed" |
| scene-003.txt | 3 | ACT 1 | 0.44 | 0.30 | Specific memory |
| scene-004.txt | 4 | ACT 1 | 0.44 | 0.32 | Listing > turn |
| scene-005.txt | 5 | ACT 1 | 0.45 | 0.34 | Acceleration, learning |
| scene-006.txt | 6 | ACT 1 | 0.45 | 0.35 | Discovery, wondrous |
| scene-007.txt | 7 | ACT 1 | 0.44 | 0.34 | Pride > violence, flat |
| scene-008.txt | 8 | ACT 1 | 0.40 | 0.35 | Tender, most vulnerable |
| scene-009.txt | 9 | ACT 1 | 0.45 | 0.30 | Declarative, rhythmic |
| scene-010.txt | 10 | ACT 1 | 0.40 | 0.30 | Volume drops, emotional thesis |
| scene-011.txt | 11 | ACT 1 | 0.40 | 0.25 | Near whisper, title drop |
| scene-013.txt | 13 | ACT 2A | 0.50 | 0.36 | Conversational, geography |
| scene-014.txt | 14 | ACT 2A | 0.50 | 0.36 | Wry, dismissive |
| scene-015.txt | 15 | ACT 2A | 0.50 | 0.38 | Self-aware, teaching enters |
| scene-016.txt | 16 | ACT 2A | 0.50 | 0.36 | Direct, definitive |
| scene-018.txt | 18 | ACT 2B | 0.50 | 0.38 | Reflective, grounded |
| scene-019.txt | 19 | ACT 2B | 0.50 | 0.40 | Warmest so far |
| scene-020.txt | 20 | ACT 2B | 0.50 | 0.38 | Confidence building |
| scene-021.txt | 21 | ACT 2B | 0.48 | 0.40 | Tender, not sentimental |
| scene-023.txt | 23 | ACT 2C | 0.50 | 0.40 | Conviction, thesis |
| scene-025.txt | 25 | ACT 2C | 0.50 | 0.42 | Near-reverent, grounded |
| scene-026.txt | 26 | ACT 2C | 0.50 | 0.40 | Patient, generational |
| scene-028.txt | 28 | ACT 2C | 0.50 | 0.42 | Warmest, peak 2C |
| scene-031.txt | 31 | ACT 3A | 0.52 | 0.35 | Voice drops, historical |
| scene-032.txt | 32 | ACT 3A | 0.55 | 0.38 | Quietest, reverent |
| scene-034.txt | 34 | ACT 3A | 0.50 | 0.40 | Confidence returns |
| scene-035.txt | 35 | ACT 3A | 0.52 | 0.38 | Staccato, direct |
| scene-037.txt | 37 | ACT 3B | 0.50 | 0.38 | Confident, opening up |
| scene-038.txt | 38 | ACT 3B | 0.48 | 0.38 | Conversational |
| scene-039.txt | 39 | ACT 3B | 0.48 | 0.38 | Warm, success story |
| scene-040.txt | 40 | ACT 3B | 0.50 | 0.36 | Breaking it down |
| scene-041.txt | 41 | ACT 3B | 0.50 | 0.36 | Practical, no-nonsense |
| scene-042.txt | 42 | ACT 3B | 0.42 | 0.45 | Warmest, believes in this |
| scene-043.txt | 43 | ACT 3B | 0.60 | 0.25 | Clinical, let number land |
| scene-046a.txt | 46a | ACT 3B | 0.40 | 0.45 | Building, survival callback |
| scene-046b.txt | 46b | ACT 3B | 0.40 | 0.45 | Certain, final, reverent |

## Workflow
1. Open ElevenLabs web UI → select Voice ID above
2. For each scene file: set Stability + Style from table, then copy-paste everything from `<speak>` onward
3. Similarity Boost (0.75) and Speaker Boost (ON) stay constant for all scenes

## Recording Order Suggestion
Record in act order for emotional continuity. Take a breath between acts.

## Notes
- Scene 46 is split into two files (46a, 46b) — the 2-second pause between them is added in FFMPEG assembly, NOT in TTS
- Quote card scenes (24, 27, 29, 33, 44, 47) have NO voiceover — text on screen only
- AAVE orthography IS the text — do not convert to standard English
- Act 1 volume drops are CRITICAL — scenes 10-11 use volume="soft"/"x-soft" in SSML
- SSML tags used: `<prosody>` (rate, volume, pitch), `<break>`, `<emphasis>` — no others
