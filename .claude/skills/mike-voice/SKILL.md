---
name: mike-voice
description: |
  Voice-transfer skill that rewrites any draft to sound like Mike — by retrieving from a corpus of his actual writing/speaking, enforcing his car-analogy cornerstone (90% of analogies must map to automotive), stripping LLM tells, and scoring output against his voice fingerprint.

  TRIGGERS - Use this skill when:
  - User says "humanize this", "make this sound like me", "rewrite in my voice", "Mike-ify this"
  - User invokes /mike-voice or /humanize
  - Any agent in this repo finishes a draft >300 words that will be published under Mike's name
  - User asks for a car analogy for a concept (use the analogize sub-command)
  - User wants to score a piece against the voice fingerprint (use the fingerprint sub-command)

  Sub-commands: humanize | analogize | fingerprint | transcribe-skool
  Corpus location: .claude/skills/mike-voice/corpus/
---

# Mike Voice — Voice Transfer Skill

## What This Skill Does

This is a second-pass voice transfer system. It does NOT replace your first-pass content generation. It takes a correct-content / wrong-voice draft and rewrites it to sound like Mike, using his actual writing and speaking as the reference corpus rather than abstract rules.

**Core insight**: Brand documents are descriptive. Corpora are generative. The LLM can't infer "what Mike sounds like" from rules. It CAN match patterns against examples.

## Sub-Commands

| Command | Input | Output | When to use |
|---|---|---|---|
| `humanize` | Draft text | Rewritten in Mike voice | Every long-form piece, every published draft |
| `analogize` | A concept | 2-3 ranked car analogies | While drafting from scratch, or when humanize needs to insert one |
| `fingerprint` | Any text | Voice score (0-1) + breakdown | Regression test on humanize outputs; baseline check |
| `transcribe-skool` | (none) | New transcripts in corpus/spoken/skool/ | Run after adding new Skool videos to /Users/makwa/Movies/skool/ |

---

## `humanize` — The Main Pass

### Inputs
- `draft` — the text to rewrite (file path or stdin)
- (optional) `register` — `kitchen-table` (warm, family-to-family — gen wealth voice) or `operator` (default — direct, no-fluff, "systems that survive contact with reality")
- (optional) `format` — `linkedin` | `email` | `blog` | `talk` (affects which corpus segments get prioritized)

### Process

**Step 1 — Banlist regex pass.** Run `scripts/banlist-strip.sh` on the draft. This deterministically removes/replaces:
- Em dashes (` — `, `—`, `&mdash;`) → period or comma based on context
- "it's not X, it's Y" structures (flag for rewrite, don't auto-replace)
- "delve", "moreover", "in conclusion", "in today's fast-paced world", "leverage" (as verb), "unleash", "navigate the landscape"
- Three-item parallel triplets that are decorative (flag)

**Step 2 — Car-analogy gate.** Check the draft for analogies. If the draft has a non-car analogy AND the piece is >300 words, the humanize pass MUST replace it with a car equivalent or insert one. Use `analogize` sub-command to pick the best car analogy for the concept.

Rule: if the piece is >300 words and contains zero car analogies after voice transfer, the pass FAILS and re-runs with a stronger directive.

**Step 3 — Voice transfer (fresh-context call).** This is the critical step. Make a NEW Claude call (not a continuation of the current conversation) with this exact structure:

```
SYSTEM: You are rewriting a draft to match the voice of Mike Soto. You are NOT continuing prior work. The draft below has CORRECT CONTENT but WRONG VOICE. Rewrite it completely to match the corpus examples. You may restructure paragraphs, reorder ideas, cut sections, change openers, change closes. The draft is content scaffolding — the corpus is the voice target.

CORPUS (Mike's actual writing/speaking — these are the voice target):
[load 5 corpus files matching the format and register, separated by ---]

CAR ANALOGY GLOSSARY (analogies should default to this domain ~90%):
[load corpus/car-analogies/glossary.md]

ANTI-PATTERNS (never produce these):
[load banlist.json]

NON-CAR SHIBBOLETHS (use these patterns liberally):
[load shibboleths.json]

DRAFT TO REWRITE:
[the input draft]

OUTPUT: Rewritten piece only. No preamble, no explanation, no "here is the rewrite". Just the new text.
```

Use Claude Opus 4.7 (1M context, claude-opus-4-7). Temperature: 0.85 (high — clichés live at low temp). Max tokens: enough for 1.5x the input length (allow expansion).

**Step 4 — Banlist regex pass (again).** Same as Step 1. Catches any tells the model still slipped in.

**Step 5 — Fingerprint score.** Run `fingerprint` sub-command on the output. If score < 0.7, re-run Step 3 with explicit feedback ("previous output scored X because Y — fix specifically Z"). Max 2 retries. If still failing, return the best attempt and flag.

### Output

Return the humanized text + a one-line fingerprint score for the user.

```
SCORE: 0.84 (analogy=0.91 car-ratio, sentence_avg=18.3w, shibboleth_density=0.04, banlist=0)
```

---

## `analogize` — Car Analogy Generator

### Inputs
- `concept` — a phrase describing what needs a car analogy (e.g., "explaining why agent harness > raw LLM", "different types of consulting clients", "what hooks do in a Claude Code setup")

### Process

Load `corpus/car-analogies/glossary.md` + `corpus/car-analogies/component-map.json` + `corpus/car-analogies/archetypes.json`.

Make a Claude call with:
```
You are picking car analogies for Mike Soto. Mike maps everything to cars 90% of the time. Given the concept below, return 2-3 candidate car analogies pulled from the provided glossary. Rank them by:
1. How instantly a non-car person would grasp the comparison (universality)
2. How technically accurate the car mechanics are
3. How well it lands a punchline / makes the concept stick

Return JSON: [{"analogy": "...", "explanation": "...", "rank": 1, "why_it_lands": "..."}]
```

Temperature: 0.5 (some creativity, but grounded in the glossary).

### Output

JSON list of ranked analogies. Used standalone OR called from `humanize` when it needs to insert a car analogy.

---

## `fingerprint` — Voice Scorer

### Inputs
- `text` — the piece to score (file path or stdin)

### Process

Compute deterministic metrics + one LLM judgment:

**Deterministic (regex/string):**
- `analogy_count` — count of analogies (heuristic: "like a", "is a kind of", "think of it as", "it's like", explicit metaphor markers)
- `car_analogy_count` — analogies matching car-domain keywords (engine, drivetrain, wiring, chassis, brakes, suspension, ECU, tires, fuel, octane, racing, garage, drift, race, off-road, EV, truck, Civic, F-150, BMW, etc.)
- `car_ratio` — car_analogy_count / analogy_count (target: ≥ 0.9)
- `sentence_avg` — average sentence length in words (Mike's baseline: 14-22 from corpus)
- `banlist_hits` — count of banned phrases (target: 0)
- `shibboleth_density` — count of Mike-signature phrases per 1000 words (target: 0.02-0.08)
- `em_dash_count` — count of em dashes (target: 0, ZERO TOLERANCE per memory)

**LLM judgment (Claude Haiku 4.5 for speed):**
- `voice_match` — "On a scale 0-1, how closely does this match the corpus voice samples below? Return JSON {score, reasoning}"
- Pass corpus samples + the text. Haiku-cheap regression check.

### Output

```json
{
  "score_overall": 0.84,
  "metrics": {
    "car_ratio": 0.91,
    "sentence_avg": 18.3,
    "banlist_hits": 0,
    "shibboleth_density": 0.04,
    "em_dash_count": 0,
    "voice_match": 0.87
  },
  "verdict": "PASS",
  "flags": []
}
```

Threshold: score_overall >= 0.7 = PASS. Below that = FAIL with specific metric flags.

---

## `transcribe-skool` — Corpus Expander

### Process

Run `scripts/transcribe-skool.sh`. Wraps `mlx_whisper` (model: `mlx-community/whisper-large-v3-turbo`) over `/Users/makwa/Movies/skool/*.mp4`. Outputs `.vtt` + `.txt` per video to `corpus/spoken/skool/`.

Idempotent — skips videos already transcribed.

Run this:
- Once on skill install (to seed corpus)
- Whenever Mike drops new videos into `/Users/makwa/Movies/skool/`

---

## Files

```
.claude/skills/mike-voice/
├── SKILL.md                          # This file
├── corpus/
│   ├── written/                      # Confirmed-Mike written pieces
│   │   ├── chaos-clarity-01-autonomous-ai.md
│   │   ├── chaos-clarity-02-hybrid-memory.md
│   │   └── chaos-clarity-03-pitfalls-real-costs.md
│   ├── spoken/
│   │   ├── voiceovers/               # VTTs from output/voiceover/
│   │   └── skool/                    # Whisper'd Skool videos (populated by transcribe-skool)
│   └── car-analogies/
│       ├── glossary.md               # → content/glossaries/ai-car-glossary.md
│       ├── archetypes.json           # vehicle type → business type
│       └── component-map.json        # car system → AI/biz concept
├── shibboleths.json                  # Non-car Mike patterns
├── banlist.json                      # Anti-patterns + LLM tells
├── scripts/
│   ├── banlist-strip.sh              # Step 1+4 regex pass
│   ├── transcribe-skool.sh           # mlx-whisper wrapper
│   ├── fingerprint.py                # Deterministic metrics computer
│   └── humanize.sh                   # End-to-end orchestrator
└── logs/                             # Transcription + humanize run logs
```

## Maintenance

Every time Mike approves a humanized output, append it to `corpus/written/` (or `corpus/spoken/` if it's a transcript). The corpus is the voice — growing the corpus grows the skill.

Every time the banlist gets a false positive or misses a tell, update `banlist.json`. Every time a non-car analogy works better than the car equivalent for a concept, log it in `shibboleths.json` as a known exception.

Related memory: [[user_classic_cars]] | [[user_mike_brand_voice]] | [[feedback_no_em_dashes]] | [[feedback_linkedin_viral_mechanics]]
