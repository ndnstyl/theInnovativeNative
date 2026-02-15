# 05 — Sound Design & Music

## Production: "The Man Who Never Raised His Voice"
## Runtime: 5:00 | Format: 16:9 YouTube | Style: Hybrid Cinematic-Brand

---

## Sound Philosophy

This film is about a man who never raised his voice. The sound design must honor that.

The loudest moment in this film is **not** the confrontation. It's the silence that follows "He was wrong." The sound design is built on the principle of **controlled absence** — what you don't hear defines what you feel.

Sound has three layers in this production:
1. **Voiceover** — the spine (see [01-screenplay-voiceover.md](01-screenplay-voiceover.md))
2. **Ambient/Foley** — the world Elias inhabits
3. **Score** — the emotional undercurrent

These three layers are never equally loud at the same time. The mix constantly trades dominance between them.

---

## ElevenLabs Voiceover Specifications

### Voice Selection

| Parameter | Primary Recommendation | Notes |
|-----------|----------------------|-------|
| Voice | **Adam** | Deep male baritone, 40s-50s quality, measured and contemplative |
| Model | Eleven Multilingual v2 (or Turbo v2.5 for faster iteration) | Best emotional nuance |
| Alternative Voice | **Daniel** | British, literary, more formal — test both |
| Backup Voice | **Marcus** | Warmer, more accessible — if Adam feels too distant |

### Generation Settings

| Setting | Value | Rationale |
|---------|-------|-----------|
| Stability | 0.65 | Low enough for natural variation, high enough for consistency |
| Similarity Boost | 0.78 | True to selected voice timbre |
| Style Exaggeration | 0.30 | Subtle emotional shifts without theatricality |
| Speaker Boost | ON | Clarity and presence in final mix |

### Recording Approach

**Do NOT generate the entire script as one pass.** Break into segments aligned with acts:

| Segment | Content | Emotional Register | Stability Override |
|---------|---------|-------------------|-------------------|
| Segment 1 | Cold Open + Act I (0:00–1:15) | Observational, measured, documentary | 0.65 |
| Segment 2 | Act II (1:15–2:15) | Weight increasing, confession-like | 0.62 |
| Segment 3 | Act III (2:15–3:15) | Heaviest, most deliberate, near-whisper moments | 0.60 |
| Segment 4 | Act IV (3:15–4:30) | Sharpened, controlled intensity, clinical | 0.68 |
| Segment 5 | Act V (4:30–5:00) | Slowest, most spacious, philosophical | 0.63 |

### Post-VO Processing

| Process | Tool | Settings |
|---------|------|----------|
| Noise reduction | Audacity/iZotope RX | Light — preserve natural character |
| De-essing | Any standard de-esser | Threshold at -35dB, gentle |
| Compression | Light compression, 2:1 ratio | Even out dynamics without squashing emotion |
| EQ | High-pass at 80Hz, gentle presence boost 2-4kHz | Remove rumble, add clarity |
| Reverb | Small room, 0.8s decay, 15% wet | Suggests intimacy — like Elias is telling you this in a room |

### VO Mix Level
- VO sits at **-12dB to -14dB** in the final mix
- All other elements duck beneath VO
- During VO pauses/silences, ambient and score can rise to -18dB
- VO should feel **close** — like headphones, not a theater PA

---

## Ambient Sound Design

### Act-by-Act Ambient Beds

#### Act I — The Quiet Man

**Pre-Dawn Hardware Store:**
| Sound | Description | Level | Pan |
|-------|-------------|-------|-----|
| Broom sweeping | Bristles on concrete, rhythmic, meditative | -24dB | Center-left |
| Keys jingling | Metal on metal, brief | -28dB | Center |
| Fluorescent hum | Constant low buzz from store lights | -32dB | Wide stereo |
| Distant bird | Single early bird, not a chorus | -36dB | Right |
| Door mechanism | Store door opening, pneumatic closer | -26dB | Center |

**Town Scenes (Day):**
| Sound | Description | Level | Pan |
|-------|-------------|-------|-----|
| Distant traffic | Very low, small town — occasional car | -34dB | Wide |
| Footsteps (others) | Various shoes on sidewalk | -28dB | L/R movement |
| Ambient chatter | Unintelligible townspeople | -32dB | Wide |
| Shopping cart | Metal wheels on asphalt | -26dB | Center |

**River Trail (Night) — RECURRING AMBIENT BED:**
| Sound | Description | Level | Pan |
|-------|-------------|-------|-----|
| River flow | Constant, steady, the heartbeat of the film | -22dB | Wide stereo, slightly right |
| Footsteps (gravel) | Elias's steps — measured, rhythmic | -24dB | Center |
| Crickets/insects | Sparse, not a wall — individual insects | -30dB | Surround |
| Wind (light) | Gentle movement through trees | -32dB | Wide |
| Distant owl | Single call, once per trail scene | -36dB | Far right |

---

#### Act II — The Walking Man

**Night Trail (Revelation):**
- Same river bed as Act I but **slightly louder** — the world is pressing in
- River flow rises to -20dB
- Wind increases slightly
- Crickets thin out — the night is getting colder/later

**Flashback — The Past:**
| Sound | Description | Level | Pan |
|-------|-------------|-------|-----|
| Room tone | Empty room, slightly reverberant | -28dB | Wide |
| Breathing | Elias's breathing — controlled, audible | -22dB | Close center |
| Fist closing | Tendon and knuckle sound, subtle | -26dB | Center |
| Heartbeat | NOT literal — low sub-bass pulse at 40Hz | -30dB | Subwoofer/center |

**"The Night He Lost Control" (Shots 029–031):**
| Sound | Description | Level | Pan |
|-------|-------------|-------|-----|
| Door | Hard open — the first aggressive sound in the film | -18dB | Center |
| Movement | Rapid, unclear — bodies in space | -20dB | Chaotic pan |
| Impact | One. Single. Muffled. Not graphic. | -16dB | Center |
| Breathing (heavy) | Aftermath breathing — ragged then controlling | -20dB | Close |
| Silence | **Hard cut to silence after impact** — 1.5s of nothing | -∞ | — |

**"He was wrong" moment:**
- ALL sound cuts to absolute silence for 2 seconds
- Then river fades back in at -26dB (quieter than before)
- The silence is the loudest thing in the film

---

#### Act III — The Dangerous Man

**Elias's Home:**
| Sound | Description | Level | Pan |
|-------|-------------|-------|-----|
| Clock ticking | Wall clock, barely audible, marking time | -34dB | Right |
| Room tone | Very quiet domestic space | -32dB | Wide |
| Paper | Newspaper page, single turn | -28dB | Center |
| Chair creak | Wood settling, once | -30dB | Center |

**The Reconstruction:**
- Ambient returns to Act I hardware store sounds (callback)
- Slightly warmer in quality — an echo, not a repeat

**The Pivot — Shouting:**
| Sound | Description | Level | Pan |
|-------|-------------|-------|-----|
| Trail ambient | Normal river trail bed | -22dB | Wide |
| Distant shouting | Male voices, aggressive, unintelligible at first | -30dB → -22dB | Far right, approaching |
| Elias's footsteps | Stop mid-stride. The rhythm breaks. | Cut to silence | — |
| Woman's voice | Distressed, single syllable/cry | -24dB | Right |

---

#### Act IV — The Confrontation

**Bridge Scene — Full Soundscape:**
| Sound | Description | Level | Pan |
|-------|-------------|-------|-----|
| River (under bridge) | Louder here, echoing off concrete | -18dB | Wide, with reverb |
| Bridge light | Electrical buzz from overhead fixture | -28dB | Center-up |
| Drunk men | Aggressive speech, slurred, overlapping | -20dB | Left |
| Woman (distressed) | Frightened, trapped | -22dB | Right |
| Elias's breathing | Returns — controlled, deliberate | -24dB → -20dB | Close center |
| Footsteps (Elias) | Single steps forward, deliberate, on wet concrete | -18dB | Center |
| Water drip | Condensation from bridge structure | -30dB | Spatial |

**"Step away from her" — Sound Design:**
1. All ambient drops to -34dB (near silence)
2. Elias speaks: clear, centered, at -12dB (same level as VO narration — his voice IS the narrator's voice for one moment)
3. Brief laughter from the men: -20dB
4. One step forward: -16dB (the loudest single footstep in the film)
5. Silence: 0.5 seconds
6. Score enters

**The Encounter Resolution:**
- Quick, efficient sounds — not drawn out
- One or two impact sounds, muffled, not gratuitous
- The woman gasps
- Then: silence expanding
- River returns

---

#### Act V — The Truth

**Police Arrival:**
| Sound | Description | Level | Pan |
|-------|-------------|-------|-----|
| Radio chatter | Police radio, low, official | -26dB | Left |
| Car doors | Opening/closing | -24dB | Left |
| The woman's voice | Calm now, telling her story (under VO narration) | -30dB | Right |
| Bridge ambient | Same as Act IV but softer | -24dB | Wide |

**The Final Walk:**
| Sound | Description | Level | Pan |
|-------|-------------|-------|-----|
| River | The definitive version — full, rich, peaceful | -20dB | Wide stereo |
| Footsteps | Slower than any previous walk. Each step deliberate, final. | -24dB | Center |
| Dawn birds | A real dawn chorus beginning — the first birdsong of the film | -28dB → -22dB | Spatial |
| Wind | Gentle. The lightest wind in the film. | -30dB | Wide |
| Silence at end | All sound fades over 3 seconds to black | → -∞ | — |

---

## Musical Score

### Score Philosophy

The score is **minimal, textural, and patient**. It is not a traditional film score with themes and melodies. It is closer to ambient composition — long tones, sparse piano, deep cello, subtle electronics. The score should feel like it grew from the river itself.

### Instrumentation

| Instrument | Role | When Used |
|------------|------|-----------|
| Solo cello | Elias's internal voice — deep, sustained, human | Acts II, III, V |
| Piano | Single notes, not chords — moments of clarity | Key transitions, Act V |
| Synthesizer (pad) | Low, warm, sustained tones — the world underneath | Throughout, very low in mix |
| Sub-bass | 30–50Hz presence — felt, not heard | Tension moments, confrontation |
| Strings (ensemble) | Reserved for one moment only: "he could choose" | Act IV climax |
| Silence | An instrument. Used intentionally. | After "He was wrong" (both times) |

### Score Map

| Timecode | Score Element | Level | Character |
|----------|-------------|-------|-----------|
| 0:00–0:08 | Nothing. Pure ambient. | -∞ | The world before the story |
| 0:08–0:50 | Very low synth pad, barely perceptible | -36dB | Warmth hiding beneath the surface |
| 0:50–1:15 | Cello enters — single sustained low note | -30dB | The river trail has its own voice |
| 1:15–1:35 | Cello melody (3 notes, descending) | -26dB | The weight of the past |
| 1:35–2:00 | Cello + sub-bass. Growing. | -24dB | "Dangerous" — the reveal |
| 2:00–2:11 | Score builds — highest tension so far | -22dB | "He told himself..." spiral |
| 2:11–2:15 | **HARD CUT TO SILENCE** | -∞ | "He was wrong" — silence is the punch |
| 2:15–2:35 | Piano — single notes, widely spaced | -28dB | Aftermath. Rebuilding. |
| 2:35–3:00 | Synth pad returns, warmer | -30dB | The reconstruction montage |
| 3:00–3:15 | Score pulls back to near-nothing | -34dB | Building space for Act IV |
| 3:15–3:35 | Sub-bass only — felt in the chest | -28dB (sub) | Confrontation establishing |
| 3:35–3:55 | Cello returns — tense, sustained | -24dB | "The calculations waking up" |
| 3:55–4:10 | Building — strings begin to layer | -22dB | "That was the test" |
| 4:10–4:14 | **FULL STRING SWELL** — the only full orchestral moment | -18dB | "Elias stayed because he could choose" |
| 4:14–4:15 | **CUT TO SILENCE** (with 1s black) | -∞ | Let the thesis land |
| 4:15–4:30 | Single piano note. Then silence. Then resolution. | -26dB | The encounter's aftermath |
| 4:30–4:42 | Warm synth pad, gentle | -28dB | Police scene — returning to order |
| 4:42–5:00 | Cello + piano together for the first time. Simple. Resolved. | -22dB | The final walk — the thesis in sound |
| 5:00–5:08 | Score resolves to a single sustained note, fading | -24dB → -∞ | End card |

### Score Reference / Style Guides

| Reference | What to Borrow |
|-----------|----------------|
| Max Richter — *The Leftovers* | Patient cello, emotional devastation in simplicity |
| Jóhann Jóhannsson — *Sicario* | Sub-bass tension, industrial undercurrent |
| Hildur Guðnadóttir — *Joker* | Solo cello as character voice |
| Trent Reznor/Atticus Ross — *The Social Network* | Electronic texture beneath organic instruments |
| Ólafur Arnalds — *Broadchurch* | Piano + strings minimalism, emotional clarity |

### Score Production Options

**Option A: AI-Generated Score**
- Tool: Udio, Suno, or AIVA
- Prompt: "Minimal cinematic score, solo cello, sparse piano, ambient synthesizer, dark and contemplative, Max Richter inspired, slow tempo 60-70 BPM, 5-minute arc from quiet to swell to resolution"
- Generate in segments matching the score map above
- Edit/layer in DAW (Logic, Ableton, DaVinci Fairlight)

**Option B: Royalty-Free Licensed**
- Artlist.io or Musicbed
- Search: "cinematic ambient minimal cello" + "dark contemplative piano"
- Layer multiple tracks, mix to match score map

**Option C: Custom Commission**
- Brief a composer with the score map and reference list above
- Budget range: $200–$800 for a 5-minute custom minimal score

---

## Mix Architecture

### Channel Layout
- Stereo (2.0) for YouTube delivery
- Mix in stereo with pseudo-surround awareness (pan extreme elements wide)

### Level Hierarchy (Priority Order)
1. **Voiceover** — -12dB to -14dB (always loudest when present)
2. **Key Foley** — -18dB to -22dB (footsteps, impacts, doors)
3. **Score** — -22dB to -28dB (supports, never competes with VO)
4. **Ambient bed** — -26dB to -34dB (constant, unnoticed until absent)
5. **Sub-bass** — -28dB to -34dB (felt, not heard)

### Ducking Rules
- When VO speaks: all other elements drop 4–6dB
- When VO pauses: ambient and score rise to fill the space over 0.5s
- When silence is intentional (marked in script): EVERYTHING drops to -∞

### Mastering
| Parameter | Target |
|-----------|--------|
| Loudness | -14 LUFS (YouTube standard) |
| True Peak | -1dBTP |
| Dynamic Range | 8–12 LU (preserve dynamics, don't over-compress) |
| High-pass | 30Hz on master (remove sub-rumble) |
| Limiter | Transparent, ceiling at -1dBTP |

---

## Sound Effects Library

### Key Sounds to Source/Create

| Sound | Source Method | Notes |
|-------|-------------|-------|
| Broom on concrete | Field recording or Freesound.org | Real, not synthesized |
| Keys/locks | Foley recording or SFX library | Metal on metal, specific |
| Footsteps (gravel trail) | Must match pace — record at different tempos | 3 variants: normal, slow, stopped |
| Footsteps (wet concrete) | Distinct from trail — harder, with splash | Confrontation scene only |
| River flow | Extended field recording or BBC Sound Effects | Needs 5+ minutes unlooped |
| Bridge overhead light hum | Synthesized or recorded fluorescent | 60Hz electrical hum |
| Single impact (muffled) | Foley — padded impact, not Hollywood punch | Understated, real, not action-movie |
| Police radio | SFX library or AI-generated | Background texture only |
| Dawn birds | Regional bird recordings | Building chorus, not instant |
| Wind through trees | Field recording | Multiple intensities for different acts |

### Sound Libraries (Recommended)
- **Freesound.org** — Free, crowd-sourced, excellent for ambients
- **BBC Sound Effects** — High quality, searchable
- **Artlist SFX** — Curated, production-ready
- **Epidemic Sound** — SFX + Music in one platform
- **Splice** — One-shots and ambient beds

---

## Audio Post-Production Workflow

### Step 1: VO Assembly
- Generate all 5 VO segments in ElevenLabs
- Trim, clean, normalize in Audacity or Adobe Audition
- Lay onto timeline with silence gaps per screenplay
- Export VO-only stem

### Step 2: Ambient Beds
- Build continuous ambient beds for each act
- Crossfade between act-specific beds
- Layer river sound as the through-line
- Export ambient stem

### Step 3: Foley & SFX
- Sync specific foley to visual cuts
- Layer footsteps to match on-screen pace
- Place impact sounds, doors, keys precisely
- Export SFX stem

### Step 4: Score
- Generate or source score segments
- Edit to match score map timecodes
- Layer instruments per the instrumentation guide
- Export score stem

### Step 5: Final Mix
- Import all 4 stems into DAW
- Apply ducking automation (VO priority)
- Master to -14 LUFS for YouTube
- Export final stereo mix (48kHz/24-bit WAV, then MP3/AAC for delivery)

### Step 6: Quality Check
- Listen on headphones (detail check)
- Listen on phone speaker (clarity check)
- Listen on studio monitors (balance check)
- Verify no clipping, no artifacts, no unintended silence
