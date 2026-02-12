# BOWTIE BULLIES — Standalone Shorts Script Templates

## Gap 1.1.1 | Production-Ready Templates for Wednesday, Friday, Saturday Cadence

---

## How to Use This File

Each template below is a complete script skeleton. Fill in the bracketed fields, apply SSML markup for ElevenLabs, and hand off to the VO pipeline (WF-03). Visual direction markers `[VISUAL: ...]` map directly to the FFMPEG assembler (WF-05) shot list. Caption markers `[CAPTION: ...]` feed the 9:16 word-pop caption system.

**Global Rules:**
- All shorts are 9:16 (1080x1920)
- Captions are MANDATORY (80% of viewers watch muted)
- No intros. No "hey guys." First word is the hook.
- Target WPM: 110-120 (Tyrone is measured, not rushed)
- ElevenLabs model: `eleven_multilingual_v2`
- Voice settings: Stability 0.62 / Similarity 0.78 / Style 0.15 / Speaker Boost ON
- Loop logic: The last line should create a reason to replay or sit with it

---

## TEMPLATE 1: NEWS REACTION SHORT

**Cadence:** Wednesday
**Total Duration:** 50-58 seconds
**Purpose:** React to the week's AI/tech headline in Tyrone's voice. Not commentary. A verdict.

---

### Structure

```
┌──────────────────────────────────────────────────┐
│  HOOK HEADLINE          0:00 - 0:10  (10 sec)   │
│  CONTEXT                0:10 - 0:25  (15 sec)   │
│  TYRONE'S TAKE          0:25 - 0:45  (20 sec)   │
│  LANDING                0:45 - 0:50  ( 5 sec)   │
│  CLOSE                  0:50 - 0:55  ( 5 sec)   │
└──────────────────────────────────────────────────┘
```

### Full Script Skeleton

```
=== HOOK HEADLINE (0:00 - 0:10) ===

[ON-SCREEN TEXT: First 3 seconds]
  Font: Anton Condensed, 72px, #E7E7E1
  Accent word: #9A4C22
  Position: Center frame, upper third
  Example: "THEY JUST REPLACED 4,000 WORKERS"
  Animation: Scale 0 → 1.0, hard slam, hold

[VISUAL: News headline screenshot — desaturated, telemetry overlay border,
rust-orange timestamp in corner. Slow 1.02x push. Dark steel vignette.]

[CAPTION: Word-by-word pop, Bone White, current word Rust Orange]

<speak>
<prosody rate="95%" volume="medium">
[Headline reframed in Tyrone's language. One sentence. Declarative.]
</prosody>
<break time="600ms"/>
<prosody rate="90%">
[Second sentence. The part they buried in the article.]
</prosody>
<break time="400ms"/>
</speak>

---

=== CONTEXT (0:10 - 0:25) ===

[VISUAL: Cut to urban texture — chain-link shadow, concrete wall, sodium
vapor light. Red Nose in P1 Watch pose, looking off-frame. Slow push.]

[CAPTION: Continues word-by-word pop]

<speak>
<prosody rate="95%">
[What happened. Two sentences. Plain language. Name the company, the
number, the date. No jargon.]
</prosody>
<break time="400ms"/>
<prosody rate="90%" volume="soft">
[One sentence connecting it to lived reality. "That's [X neighborhood
equivalent]." or "That's [Y number] families."]
</prosody>
<break time="1000ms"/>
</speak>

---

=== TYRONE'S TAKE (0:25 - 0:45) ===

[VISUAL: Hard cut to Red Nose P5 Close — one eye, scar visible, shallow
DOF. Hold 4 seconds. Then cut to dark steel background with single
rust-orange stat overlay (giant number, monospaced label).]

[CAPTION: Continues, emphasis word highlighted Rust Orange]

<speak>
<prosody rate="95%">
[Tyrone's analysis. Three to four sentences. This is the substance.]
</prosody>
<break time="600ms"/>
<emphasis level="moderate">
[The line that reframes everything. The one people screenshot.]
</emphasis>
<break time="1500ms"/>
<prosody rate="90%" volume="soft">
[Subtext sentence. What he's really saying underneath.]
</prosody>
<break time="1000ms"/>
</speak>

---

=== LANDING (0:45 - 0:50) ===

[VISUAL: Red Nose P4 Silhouette or P1 Watch. Single light source. Hold.]

[CAPTION: Final statement, all caps, centered]

<speak>
<break time="400ms"/>
<prosody rate="85%" volume="soft">
[One sentence. Heavy. The verdict. Declarative. Period.]
</prosody>
<break time="1500ms"/>
</speak>

---

=== CLOSE (0:50 - 0:55) ===

[VISUAL: Slow fade to Dark Steel (#1E1E20). Red Nose silhouette dissolves.
Hold black for 1.5 seconds.]

[ON-SCREEN TEXT: "Pay attention." — small, monospaced, center frame,
fade in at 0.5s, hold]

[CAPTION: OFF — let the silence work]

<speak>
<break time="2000ms"/>
</speak>

[END CARD: Red Nose silhouette + "BOWTIE BULLIES" condensed type +
"Follow for more" in Earth Clay]
```

### Loop-Closing Guidance

The close should create a "wait, what?" or a "let me hear that again" effect. Methods:

1. **The Echo** — Last line mirrors or inverts the hook headline. Viewer connects beginning to end and replays to catch the full arc.
2. **The Weight** — Last line is so heavy the viewer needs to sit with it. Silence after the line is the loop trigger.
3. **The Unfinished** — End mid-thought or with an implication. "And nobody said a word." The viewer replays to find the full context.

### Completed Example: News Reaction

```
[ON-SCREEN TEXT: "4,000 JOBS. ONE EMAIL."]

[VISUAL: Screenshot of layoff headline, desaturated, telemetry border]

<speak>
<prosody rate="95%" volume="medium">
Four thousand people got an email Tuesday morning.
</prosody>
<break time="600ms"/>
<prosody rate="90%">
Not a meeting. Not a handshake. An email.
</prosody>
<break time="400ms"/>
</speak>

[VISUAL: Red Nose P1, watching, sodium vapor light]

<speak>
<prosody rate="95%">
The company said it was "streamlining operations."
What they meant was they found a program that does it cheaper.
</prosody>
<break time="400ms"/>
<prosody rate="90%" volume="soft">
That's four thousand families finding out over breakfast
that the machine got the promotion.
</prosody>
<break time="1000ms"/>
</speak>

[VISUAL: Hard cut. Red Nose P5 Close. Hold.]

<speak>
<prosody rate="95%">
Nobody's protesting. Nobody's on the news.
Because when it happens slow enough, they call it progress.
</prosody>
<break time="600ms"/>
<emphasis level="moderate">
They didn't fire those people. They just stopped needing them.
</emphasis>
<break time="1500ms"/>
<prosody rate="90%" volume="soft">
There's a difference. And it's worse.
</prosody>
<break time="1000ms"/>
</speak>

[VISUAL: Red Nose P4 Silhouette. Hold.]

<speak>
<break time="400ms"/>
<prosody rate="85%" volume="soft">
Four thousand emails. Zero apologies.
</prosody>
<break time="2000ms"/>
</speak>

[VISUAL: Fade to black. "Pay attention." fades in.]
```

---

## TEMPLATE 2: DEEP DIVE SHORT

**Cadence:** Friday
**Total Duration:** 50-55 seconds
**Purpose:** Pillar 2 content — AGI/ASI philosophical territory. The kind of short that stops the scroll because it asks a question nobody else is asking.

---

### Structure

```
┌──────────────────────────────────────────────────┐
│  COLD OPEN QUESTION     0:00 - 0:08  ( 8 sec)   │
│  SETUP                  0:08 - 0:20  (12 sec)   │
│  THE REVEAL             0:20 - 0:40  (20 sec)   │
│  THE MOVE               0:40 - 0:50  (10 sec)   │
│  SILENCE CLOSE          0:50 - 0:55  ( 5 sec)   │
└──────────────────────────────────────────────────┘
```

### Full Script Skeleton

```
=== COLD OPEN QUESTION (0:00 - 0:08) ===

[ON-SCREEN TEXT: First 3 seconds]
  Font: Anton Condensed, 72px, #E7E7E1
  The question — short, punchy, existential
  Example: "WHAT HAPPENS WHEN IT'S SMARTER THAN ALL OF US?"
  Animation: Typewriter reveal, 0.08s per character, monospaced

[VISUAL: Slow push into abstract dark texture — server corridor in
rust tones, or Red Nose P4 Silhouette on rooftop, city below.
Atmospheric fog. Single distant light.]

[CAPTION: Question text, word-by-word pop]

<speak>
<prosody rate="90%" volume="medium">
[The question. One sentence. Rhetorical. Existential but grounded.]
</prosody>
<break time="1000ms"/>
</speak>

---

=== SETUP (0:08 - 0:20) ===

[VISUAL: Cut to urban landscape at night — overhead power lines, empty
intersection, traffic light cycling with no one around. Slow, eerie.
Then cut to telemetry overlay: timeline graphic showing AI capability
milestones in monospaced text, rust orange accent lines.]

[CAPTION: Continues word-by-word]

<speak>
<prosody rate="95%">
[Ground the question in reality. Two to three sentences.
Reference a real timeline, a real capability, a real number.
This is not sci-fi. This is trajectory.]
</prosody>
<break time="600ms"/>
<prosody rate="90%">
[One sentence that makes the abstract feel local.
"That's not a movie. That's a Tuesday."]
</prosody>
<break time="800ms"/>
</speak>

---

=== THE REVEAL (0:20 - 0:40) ===

[VISUAL: Hard cut to Red Nose P2 Guard — facing camera, low angle,
powerful. Hold 3 seconds. Then cut to sequence: hands on a table,
close-up of a screen showing AI output, back to Red Nose P5 Close
with shallow DOF. Each cut 3-4 seconds.]

[CAPTION: Continues, emphasis word highlighted]

<speak>
<prosody rate="95%">
[The part nobody's talking about. Four to five sentences.
This is the substance. The systemic angle. The historical parallel.
Connect AI trajectory to something Tyrone has already survived.]
</prosody>
<break time="600ms"/>
<emphasis level="strong">
[THE line. The one that reframes the entire short.
Declarative. No hedge. No "maybe." A statement of fact
that the viewer will carry with them.]
</emphasis>
<break time="1500ms"/>
</speak>

---

=== THE MOVE (0:40 - 0:50) ===

[VISUAL: Red Nose P3 Companion — lying beside a journal or tool.
Single dramatic light. Grounded, calm energy. The storm passed.
Now here's what you do.]

[CAPTION: Continues]

<speak>
<prosody rate="95%">
[Practical. One to two sentences. Not a pitch. A move.
What the viewer can actually do. A mindset shift, a skill to learn,
a question to start asking.]
</prosody>
<break time="400ms"/>
<prosody rate="90%" volume="soft">
[One sentence of earned authority. "I've been through systems
that break. This is how you don't break with them."]
</prosody>
<break time="1000ms"/>
</speak>

---

=== SILENCE CLOSE (0:50 - 0:55) ===

[VISUAL: Red Nose P1 Watch. Sitting still. Bowtie visible.
Rust light fading to dark. Hold for full duration.]

[ON-SCREEN TEXT: None. Or single word: "Pay attention." in
monospaced, lower third, barely visible.]

[CAPTION: OFF]

<speak>
<break time="2000ms"/>
</speak>

[Music dips to -40dB. Ambient hum only. Let the silence close it.]
```

### Visual Direction Notes

The Deep Dive Short should feel like a late-night thought that won't let you sleep. The pacing is slower than the News Reaction. More holds. More silence. The visuals lean P4 Silhouette and abstract — server corridors, rooftop edges, empty streets at 3 AM. This is Pillar 2 content: the bigger picture.

### Completed Example: Deep Dive

```
[ON-SCREEN TEXT: "WHAT HAPPENS WHEN THE MACHINE DOESN'T NEED YOU?"]

[VISUAL: Slow push into empty office building at night. Lights on. Nobody inside.]

<speak>
<prosody rate="90%" volume="medium">
What happens when the machine doesn't need you to run it?
</prosody>
<break time="1000ms"/>
</speak>

[VISUAL: Telemetry overlay — timeline: "2024: GPT-4 / 2025: Agents / 2026: Autonomy / 2027: ?"]

<speak>
<prosody rate="95%">
Every six months the model gets smarter.
Every six months it needs less input.
Every six months, the question isn't what can it do.
</prosody>
<break time="600ms"/>
<prosody rate="90%">
It's what can't it.
</prosody>
<break time="800ms"/>
</speak>

[VISUAL: Red Nose P2 Guard. Low angle. Hold.]

<speak>
<prosody rate="95%">
People talk about AGI like it's a light switch.
One day it's off, next day it's on.
That's not how it works.
It's a tide. And the water's been rising for three years.
</prosody>
<break time="600ms"/>
<emphasis level="strong">
The people building it can't even explain what it's doing anymore.
</emphasis>
<break time="1500ms"/>
</speak>

[VISUAL: Red Nose P3 Companion, lying beside a journal. Single light.]

<speak>
<prosody rate="95%">
Learn a skill a machine can't fake.
Something that requires hands, presence, trust.
</prosody>
<break time="400ms"/>
<prosody rate="90%" volume="soft">
I've watched systems collapse before. You survive by being useful
in ways they can't automate.
</prosody>
<break time="1000ms"/>
</speak>

[VISUAL: Red Nose P1 Watch. Still. Rust light fading.]

<speak>
<break time="2000ms"/>
</speak>
```

---

## TEMPLATE 3: PRODUCT / AFFILIATE SHORT

**Cadence:** Saturday
**Total Duration:** 35-40 seconds
**Purpose:** Natural product mention. Not a pitch. Not an unboxing. Tyrone shares what he uses and why. The product earns its place in the narrative.

---

### Structure

```
┌──────────────────────────────────────────────────┐
│  PROBLEM HOOK           0:00 - 0:08  ( 8 sec)   │
│  CONTEXT                0:08 - 0:18  (10 sec)   │
│  "THIS IS WHAT I USE"   0:18 - 0:28  (10 sec)   │
│  RED NOSE POV SHOT      0:28 - 0:33  ( 5 sec)   │
│  CLOSE                  0:33 - 0:38  ( 5 sec)   │
└──────────────────────────────────────────────────┘
```

### FTC Compliance

**MANDATORY:** Product/affiliate shorts require FTC disclosure.
- Video description MUST include: "This video contains affiliate links. I may earn a small commission at no extra cost to you."
- On-screen disclosure is NOT required for organic mentions under 15 seconds of product focus, but the description disclosure is non-negotiable.
- Total product-specific screen time must stay under 15 seconds.
- No false claims. No urgency tactics ("limited time!"). No income claims.

### Full Script Skeleton

```
=== PROBLEM HOOK (0:00 - 0:08) ===

[ON-SCREEN TEXT: First 3 seconds]
  Font: Anton Condensed, 64px, #E7E7E1
  Short problem statement
  Example: "YOUR PHONE IS A TRACKING DEVICE"
  Animation: Hard slam, hold

[VISUAL: Relevant problem visual — surveillance camera, phone screen
with location data, empty room with open laptop. Dark, desaturated,
sodium vapor light. Quick cut or slow push.]

[CAPTION: Word-by-word pop]

<speak>
<prosody rate="95%" volume="medium">
[The problem. One to two sentences. Not hypothetical.
Something happening right now. Make it feel personal.]
</prosody>
<break time="600ms"/>
</speak>

---

=== CONTEXT (0:08 - 0:18) ===

[VISUAL: Urban texture — hands holding a phone, street at night,
close-up of a screen. Slow, grounded. Not frantic.]

[CAPTION: Continues]

<speak>
<prosody rate="95%">
[Why this matters. Two sentences. Connect the problem to daily life.
Name the system, the company, or the mechanism.
Keep it plain.]
</prosody>
<break time="400ms"/>
<prosody rate="90%">
[One sentence bridge to the product. "Most people don't know there's
a move for this." or "I didn't wait for someone to fix it."]
</prosody>
<break time="600ms"/>
</speak>

---

=== "THIS IS WHAT I USE" (0:18 - 0:28) ===

[VISUAL: Red Nose P3 Companion — lying beside the product on a dark
surface. Single dramatic light from upper left. Product clearly visible
but not centered like an ad. It's in Red Nose's world, not a studio.
Then cut to: hands picking up the product, close-up, texture visible.]

[ON-SCREEN TEXT: Product name + price, Earth Clay (#7E6551),
monospaced, lower third. Subtle. Not a price tag — a field note.]

[CAPTION: Continues]

<speak>
<prosody rate="95%">
[Natural product mention. Tyrone's framing:
"I keep one of these [where]."
"This is what I use."
"[Price]. That's it."
Maximum three sentences about the product. No specs list.
No "amazing features." Just what it does and why he trusts it.]
</prosody>
<break time="600ms"/>
</speak>

**Product mention rules:**
- Under 15 seconds of product-specific content (FTC safe zone)
- No superlatives ("the best," "incredible," "game-changer")
- No urgency ("limited time," "selling out," "act now")
- Tyrone's language: "It works." / "I own this." / "$12. Link below."
- The product exists in Red Nose's world — it's gear, not merchandise

---

=== RED NOSE POV SHOT (0:28 - 0:33) ===

[VISUAL: Red Nose P5 Close or P1 Watch — looking at the product or
looking at the viewer. The dog's endorsement. If Red Nose is next to
it, it's trusted. Hold for full 5 seconds. No movement.]

[CAPTION: OFF — the image speaks]

<speak>
<break time="400ms"/>
<prosody rate="90%" volume="soft">
[One sentence. Optional. "Link's below." or a thematic closer
that connects the product back to the bigger picture.]
</prosody>
<break time="600ms"/>
</speak>

---

=== CLOSE (0:33 - 0:38) ===

[VISUAL: Slow fade. Product and Red Nose in frame together.
Rust light dims. Dark Steel takes over.]

[ON-SCREEN TEXT: "Link in bio" or "Link below" — Earth Clay,
monospaced, small, lower third. Not flashy.]

[CAPTION: OFF]

<speak>
<break time="1500ms"/>
</speak>

[END: No end card on product shorts. Let it breathe.
The CTA is the on-screen text, not a verbal ask.]
```

### Completed Example: Product Short

```
[ON-SCREEN TEXT: "YOUR PHONE PINGS 500 TIMES A DAY"]

[VISUAL: Phone on a table, screen glowing. Dark room. Sodium vapor light through window.]

<speak>
<prosody rate="95%" volume="medium">
Your phone pings a cell tower about five hundred times a day.
Every ping is a location. Every location is stored.
</prosody>
<break time="600ms"/>
</speak>

[VISUAL: Hands scrolling through phone settings. Close-up. Gritty.]

<speak>
<prosody rate="95%">
You can turn off location services.
The pings don't stop.
</prosody>
<break time="400ms"/>
<prosody rate="90%">
I stopped asking for permission a long time ago.
</prosody>
<break time="600ms"/>
</speak>

[VISUAL: Red Nose P3, lying beside a Faraday phone pouch on dark wood surface.
Single rust-orange light. Product visible, not staged.]

[ON-SCREEN TEXT: "Faraday Pouch — $12" in Earth Clay, monospaced, lower third]

<speak>
<prosody rate="95%">
I keep one of these in my bag. Twelve dollars.
Phone goes in, signal goes dead.
No ping. No tower. No record.
</prosody>
<break time="600ms"/>
</speak>

[VISUAL: Red Nose P5 Close. One eye. Looking at the pouch. Hold.]

<speak>
<break time="400ms"/>
<prosody rate="90%" volume="soft">
Link's below.
</prosody>
<break time="600ms"/>
</speak>

[VISUAL: Fade. "Link in bio" in Earth Clay. Hold.]

<speak>
<break time="1500ms"/>
</speak>
```

**Description (YouTube/IG):**
```
Your phone is a tracking device. This is $12.

Faraday Phone Pouch — [Amazon affiliate link]

I don't do sponsors. If I mention it, I use it.

This video contains affiliate links. I may earn a small commission
at no extra cost to you.

#AI #Privacy #DigitalSurvival #BowTieBullies
```

---

## CAPTION MARKUP RULES (All Templates)

### Technical Specs

```
Format: 9:16 (1080x1920)
Font: Anton / Condensed Sans, 56-72px
Default Color: #E7E7E1 (Bone White)
Highlight Color: #9A4C22 (Rust Orange) — current word OR emphasis word
Shadow: 3px 3px 12px rgba(0,0,0,0.9)
Position: Center frame, vertical center (y: 960px)
Background Pill: #1E1E20 @ 60% opacity, 16px rounded corners, 20px padding
Max Words Visible: 2-3 at a time
Animation: Word-by-word pop — scale 0.85 → 1.0, 0.1s ease-out
```

### Caption Rules

1. **Always on.** Every short has captions. No exceptions.
2. **Word-by-word pop** is the default animation. Each word scales in as it's spoken.
3. **Current spoken word** is highlighted in Rust Orange. Previous words fade to Bone White.
4. **Emphasis words** (from SSML `<emphasis>` tags) get a slightly larger scale (1.05x) and hold Rust Orange for 0.3s longer.
5. **During `<break>` tags over 1000ms**, captions clear. The screen is empty. Silence is visual too.
6. **Final line** of each section: all caps, centered, no word-by-word — appears as a complete statement. The landing hits as a block.
7. **Product names and prices** use Earth Clay (#7E6551), not Bone White. They're information, not emphasis.
8. **No emojis in captions.** Ever.

---

## HOOK TEXT SPEC (First 3 Seconds)

The first 3 seconds determine whether the viewer stays. The on-screen text IS the hook before Tyrone speaks.

### Requirements

```
Timing: Frame 1 through 3.0 seconds
Font: Anton Condensed, 64-80px, UPPERCASE
Color: #E7E7E1 (Bone White) with ONE accent word in #9A4C22 (Rust Orange)
Position: Upper third of frame (9:16), centered horizontally
Max Characters: 40 (including spaces)
Max Words: 6-8
Animation: Hard slam (scale 0 → 1.0 in 0.15s, ease-out) or
           Typewriter reveal (monospaced, 0.06s per character)
Hold: Minimum 2.0 seconds at full visibility
```

### Hook Text Formulas

| Formula | Example |
|---------|---------|
| [THEY] + [ACTION] + [NUMBER/OBJECT] | "THEY JUST REPLACED 4,000 **WORKERS**" |
| [YOUR THING] + [IS/DOES] + [TRUTH] | "YOUR PHONE IS A **TRACKING DEVICE**" |
| [NUMBER] + [SHOCKING FACT] | "**$4 BILLION** TO REPLACE YOU" |
| [QUESTION] | "WHO **DECIDES** YOUR CREDIT SCORE?" |
| [TIMESTAMP] + [FACT] | "**6:14 AM.** 47 DECISIONS ALREADY MADE." |
| [CONTRADICTION] | "ARTIFICIAL INTELLIGENCE. **REAL** CONSEQUENCES." |

### Do Not

- Use more than ONE Rust Orange accent word
- Use exclamation marks
- Use emoji
- Use "YOU WON'T BELIEVE" or any clickbait phrasing
- Put text below center frame (gets cut off in browse)

---

## PRODUCTION HANDOFF CHECKLIST

Before sending any short to the VO pipeline (WF-03):

- [ ] Script is under 120 words (for 50-58 second shorts) or under 80 words (for 35-40 second product shorts)
- [ ] SSML markup is applied to all spoken text
- [ ] Visual direction markers specify Red Nose pose (P1-P6) for every shot
- [ ] On-screen text for first 3 seconds is specified (under 40 characters)
- [ ] Caption behavior is noted (when to clear, when to hold)
- [ ] Product shorts include FTC disclosure text for description
- [ ] Loop-close strategy is identified (Echo, Weight, or Unfinished)
- [ ] Template type is tagged (News Reaction / Deep Dive / Product)
- [ ] Cadence day is confirmed (Wednesday / Friday / Saturday)
- [ ] Music mood is specified (reference Music & Audio Aesthetic in brand-blueprint.md)

---

---

## SURVIVAL PILLAR SHORT EXAMPLES (60/30/10 Matrix)

### Financial Survival Short — "THE ENVELOPE"

**Pillar:** Financial — 1B Hood Literacy
**Duration:** 45 seconds
**Cadence:** Tuesday splice or standalone Wednesday

```
=== HOOK (0:00 - 0:08) ===

[ON-SCREEN TEXT: "NOBODY TAUGHT YOU THIS"]
[VISUAL: Close-up of hands counting cash into a labeled envelope]

<speak>
<prosody rate="95%" volume="medium">
Nobody sat you down and said: this is how money works.
</prosody>
<break time="600ms"/>
</speak>

=== CONTEXT (0:08 - 0:20) ===

[VISUAL: Kitchen table, envelopes labeled "Rent" "Food" "Emergency"]

<speak>
<prosody rate="95%">
The envelope method. Your grandma knew it.
Your great-grandma used it.
</prosody>
<break time="400ms"/>
<prosody rate="90%">
Cash in your hand. Labels on envelopes. When it's gone, it's gone.
</prosody>
<break time="600ms"/>
</speak>

=== LANDING (0:20 - 0:38) ===

[VISUAL: Red Nose P3, lying beside a stack of envelopes and a pen]

<speak>
<prosody rate="90%">
No app tracks your spending like watching your own hands
put twenties into envelopes labeled with what matters.
</prosody>
<break time="800ms"/>
<prosody rate="85%" volume="soft">
Start with four envelopes. Count your money.
If you don't count it, someone else will.
</prosody>
<break time="1500ms"/>
</speak>

=== CLOSE (0:38 - 0:45) ===

[ON-SCREEN TEXT: "COUNT YOUR MONEY" in Bone White, "MONEY" in Rust Orange]
[VISUAL: Red Nose P5 close, one eye. Fade to black.]
```

---

### Food Security Short — "FOUR MILES"

**Pillar:** Food/Shelter — 2A Food Security
**Duration:** 40 seconds
**Cadence:** Friday Deep Dive

```
=== HOOK (0:00 - 0:08) ===

[ON-SCREEN TEXT: "4 MILES"]
[VISUAL: Empty lot where a grocery store used to be]

<speak>
<prosody rate="90%" volume="medium">
Four miles.
</prosody>
<break time="800ms"/>
<prosody rate="95%">
That's the distance between my block and the nearest
place to buy a vegetable.
</prosody>
<break time="600ms"/>
</speak>

=== CONTEXT (0:08 - 0:22) ===

[VISUAL: Bodega shelves — chips, soda, liquor. No produce.]

<speak>
<prosody rate="95%">
They call it a food desert.
But deserts are natural.
</prosody>
<break time="400ms"/>
<prosody rate="90%" volume="soft">
This was a decision. Somebody decided your block
wasn't worth stocking.
</prosody>
<break time="800ms"/>
</speak>

=== LANDING (0:22 - 0:35) ===

[VISUAL: Container garden on fire escape, tomato plant, herbs]

<speak>
<prosody rate="90%">
A tomato plant on your fire escape is an act of resistance.
</prosody>
<break time="600ms"/>
<prosody rate="85%">
Grow something. Feed yourself.
Nobody's coming to fix your block's grocery problem.
</prosody>
<break time="1500ms"/>
</speak>

=== CLOSE (0:35 - 0:40) ===

[ON-SCREEN TEXT: "GROW SOMETHING" in Bone White]
[VISUAL: Fade to black.]
```

---

### Shelter/Energy Short — "THE GRID"

**Pillar:** Food/Shelter — 2B Natural Resources
**Duration:** 45 seconds
**Cadence:** Friday Deep Dive

```
=== HOOK (0:00 - 0:08) ===

[ON-SCREEN TEXT: "246 PEOPLE"]
[VISUAL: Dark room, no power, single candle]

<speak>
<prosody rate="85%" volume="medium">
Two hundred and forty-six people.
</prosody>
<break time="1000ms"/>
<prosody rate="95%">
That's how many died in Texas when the power went out
for four days.
</prosody>
<break time="600ms"/>
</speak>

=== CONTEXT (0:08 - 0:22) ===

[VISUAL: Portable solar panel charging a battery bank]

<speak>
<prosody rate="95%">
Not in a war zone. Not in a disaster movie.
In America. Because the grid failed.
</prosody>
<break time="800ms"/>
<prosody rate="90%">
Your city's grid is managed by the same kind of systems.
</prosody>
<break time="600ms"/>
</speak>

=== LANDING (0:22 - 0:40) ===

[VISUAL: Red Nose P1, watching a small solar panel on a rooftop]

<speak>
<prosody rate="90%">
A fifty-dollar solar charger keeps your phone alive.
A two-hundred-dollar power station keeps your lights on.
</prosody>
<break time="400ms"/>
<prosody rate="85%" volume="soft">
The grid doesn't owe you anything.
What's your backup plan?
</prosody>
<break time="1500ms"/>
</speak>

=== CLOSE (0:40 - 0:45) ===

[ON-SCREEN TEXT: "WHAT'S YOUR PLAN?" in Bone White, "PLAN" in Rust Orange]
[VISUAL: Fade to black.]
```

---

*"I don't make content. I leave evidence."*
*— Tyrone, BowTie Bullies*
