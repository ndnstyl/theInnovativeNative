# BOWTIE BULLIES — SSML Cheat Sheet

## Gap 1.1.4 | Full Vocabulary Expansion for ElevenLabs Pipeline

---

## Current State vs. Target State

**Before (3 pause types only):**
```xml
<break time="2000ms"/>   <!-- 2 second pause -->
<break time="1500ms"/>   <!-- 1.5 second pause -->
<break time="800ms"/>    <!-- beat -->
```

**After (15+ markup patterns across 5 categories):**
Pauses, Prosody, Emphasis, Say-As, Sub — all mapped to Tyrone's delivery styles and tested against ElevenLabs `eleven_multilingual_v2` compatibility.

---

## ElevenLabs Compatibility Notes

```
Model: eleven_multilingual_v2
Voice Settings: Stability 0.62 / Similarity 0.78 / Style 0.15 / Speaker Boost ON

Supported SSML Tags:
  <speak>           ✅ Full support (required wrapper)
  <break>           ✅ Full support (time attribute in ms or s)
  <prosody>         ✅ Supported (rate, pitch, volume)
  <emphasis>        ✅ Supported (strong, moderate, reduced)
  <say-as>          ⚠️ Partial support (interpret-as: cardinal, ordinal, date)
  <sub>             ✅ Full support (alias attribute)
  <p> / <s>         ✅ Supported (paragraph/sentence boundaries)
  <phoneme>         ⚠️ Limited (IPA support varies)

Not Supported / Unreliable:
  <voice>           ❌ Not supported (single voice per request)
  <audio>           ❌ Not supported
  <mark>            ❌ Not supported
  <w>               ❌ Not supported
  <lang>            ⚠️ Unreliable — avoid

CRITICAL: All SSML must be wrapped in <speak> tags.
CRITICAL: Time values use "ms" (milliseconds) or "s" (seconds).
CRITICAL: Attribute values must be in double quotes.
```

---

## CATEGORY 1: PAUSE TYPES (break)

Six calibrated pause lengths, each with a specific emotional function in Tyrone's delivery.

---

### 1.1 MICRO — 200ms

**SSML:**
```xml
<break time="200ms"/>
```

**When Tyrone uses it:** Between short phrases in the same thought. A breath-length gap. Not dramatic — structural. It's the comma in spoken language.

**Delivery Context:** The Rhythm — when Tyrone lists things in quick succession but each word earns its own beat.

**Example:**
```xml
<speak>
<prosody rate="95%">
Same shift. <break time="200ms"/> Same machine. <break time="200ms"/> Same lunch spot.
</prosody>
</speak>
```

**ElevenLabs Note:** Fully supported. At 200ms, the voice engine inserts a natural micro-pause. Below 150ms the break may be imperceptible.

---

### 1.2 BEAT — 400ms

**SSML:**
```xml
<break time="400ms"/>
```

**When Tyrone uses it:** Between related sentences. A thought has landed and the next one is loading. Not heavy. Just clean separation.

**Delivery Context:** List transitions, cause-and-effect pairs, the breath between setup and point.

**Example:**
```xml
<speak>
<prosody rate="95%">
They built a machine that can write a symphony.
</prosody>
<break time="400ms"/>
<prosody rate="95%">
Same week they laid off the entire customer service floor.
</prosody>
</speak>
```

**ElevenLabs Note:** Fully supported. The natural sweet spot for sentence separation without dramatic weight.

---

### 1.3 BREATH — 600ms

**SSML:**
```xml
<break time="600ms"/>
```

**When Tyrone uses it:** After a statement that needs a moment to settle. Not a dramatic pause — the sound of a man taking a breath before continuing. It says "I'm not done, but sit with that for a second."

**Delivery Context:** After a reframe, after a stat lands, between a setup and its payoff.

**Example:**
```xml
<speak>
<prosody rate="95%">
Facial recognition misidentifies Black faces thirty-four times more often than white faces.
</prosody>
<break time="600ms"/>
<prosody rate="90%" volume="soft">
And they're putting it in every police department in the country.
</prosody>
</speak>
```

**ElevenLabs Note:** Fully supported. This is the default "paragraph break" feel.

---

### 1.4 WEIGHT — 1000ms (1 second)

**SSML:**
```xml
<break time="1000ms"/>
```

**When Tyrone uses it:** After a heavy line. The silence IS the punctuation. Tyrone said something that matters and he's letting it exist in the room. No rush to the next point.

**Delivery Context:** After a declaration, after the "reframe" line, after an emotional peak that doesn't need a follow-up.

**Example:**
```xml
<speak>
<prosody rate="90%">
The algorithm said no.
</prosody>
<break time="1000ms"/>
<prosody rate="85%" volume="soft">
And it doesn't have to tell you why.
</prosody>
</speak>
```

**ElevenLabs Note:** Fully supported. At 1 second, the engine produces clean silence. This is the workhorse dramatic pause.

---

### 1.5 HEAVY — 1500ms (1.5 seconds)

**SSML:**
```xml
<break time="1500ms"/>
```

**When Tyrone uses it:** At section transitions. Between a landing and a new topic. At the end of a hook before the content begins. The viewer feels the shift in energy.

**Delivery Context:** The Turn (section transition), post-hook silence, before the final line of a segment.

**Example:**
```xml
<speak>
<emphasis level="strong">
The intelligence is artificial. The consequences are real.
</emphasis>
<break time="1500ms"/>
<prosody rate="95%">
Let me show you what I mean.
</prosody>
</speak>
```

**ElevenLabs Note:** Fully supported. Beyond 1500ms, verify the engine doesn't clip or restart vocal quality. Test each script.

---

### 1.6 SILENCE — 2000ms+ (2+ seconds)

**SSML:**
```xml
<break time="2000ms"/>
```

**When Tyrone uses it:** Sparingly. Two to three times per video maximum. This is the silence that makes people check if their headphones disconnected. It's intentional. It's the end of something.

**Delivery Context:** The Landing (episode close), after the most important line in the video, the pause before "Pay attention."

**Example:**
```xml
<speak>
<prosody rate="85%" volume="soft">
Twenty-two years. Nine minutes.
</prosody>
<break time="2000ms"/>
<prosody rate="85%" volume="soft">
Pay attention.
</prosody>
</speak>
```

**ElevenLabs Note:** Supported up to 5000ms. Beyond 3000ms, consider splitting the TTS request into segments and inserting silence in post-production (FFMPEG) for more reliable results. At 2000ms the engine is reliable.

---

### Pause Quick Reference Table

| Name | Duration | Feel | Max Per Short | Max Per Long-Form |
|------|----------|------|---------------|-------------------|
| Micro | 200ms | Comma | Unlimited | Unlimited |
| Beat | 400ms | Period | Unlimited | Unlimited |
| Breath | 600ms | Paragraph | 8-10 | 20-30 |
| Weight | 1000ms | Gravity | 3-4 | 8-12 |
| Heavy | 1500ms | Shift | 2-3 | 5-7 |
| Silence | 2000ms+ | End | 1 | 2-3 |

---

## CATEGORY 2: PROSODY (rate, volume, pitch)

Prosody controls the speed, volume, and pitch of delivery. Tyrone's voice lives in a narrow band — never loud, never fast, never high. The variation is subtle. Drops, not spikes.

---

### 2.1 RATE — Speed of Delivery

**SSML:**
```xml
<prosody rate="90%">Slower delivery. Weight in each word.</prosody>
<prosody rate="95%">Slightly below normal. Tyrone's default narration speed.</prosody>
<prosody rate="100%">Normal speed. Rare — only for matter-of-fact context.</prosody>
<prosody rate="85%">Deliberate. The final line. The landing.</prosody>
```

**Tyrone's Range:** 85%-100%. Never above 100%. Tyrone does not speed up. If something is urgent, he slows down. That's how the viewer knows it matters.

**When to use each:**

| Rate | Delivery Feel | Use For |
|------|--------------|---------|
| 85% | Deliberate, final | Landings, declarations, last line of a section |
| 90% | Measured, heavy | Emotional moments, subtext, the quiet truth |
| 95% | Tyrone's default | Narration, context, setup |
| 100% | Matter-of-fact | Stats, dates, factual statements only |

**ElevenLabs Note:** Rate percentages are relative to the voice's natural speaking rate. The `eleven_multilingual_v2` model handles rate between 50%-200%, but for Tyrone's voice, stay within 85%-100% to maintain character integrity. Values like "slow" or "x-slow" are also accepted but less precise.

---

### 2.2 VOLUME — Loudness

**SSML:**
```xml
<prosody volume="soft">Drops below the normal line. Intimacy. Gravity.</prosody>
<prosody volume="medium">Standard delivery. Clear, present.</prosody>
<prosody volume="default">Engine default. Equivalent to medium.</prosody>
```

**Tyrone's Rule:** Volume drops = emphasis. He never raises his voice. When something matters, he gets quieter. The viewer leans in.

| Volume | Delivery Feel | Use For |
|--------|--------------|---------|
| soft | Intimate, heavy, subtext | Emotional lines, the truth underneath, closings |
| medium | Present, clear, grounded | Default narration, setup, context |

**NEVER USE:** `loud`, `x-loud`. Tyrone does not raise his voice.

**ElevenLabs Note:** Fully supported. The `soft` setting produces a noticeable but natural dip. Combine with slower rate for maximum weight: `<prosody rate="85%" volume="soft">`.

---

### 2.3 PITCH — Vocal Register

**SSML:**
```xml
<prosody pitch="low">Deepens the register slightly. Authority.</prosody>
<prosody pitch="medium">Natural register. Default.</prosody>
<prosody pitch="-5%">Fine-tuned percentage drop. Subtle authority.</prosody>
```

**Tyrone's Rule:** Low or default. No uptalk. No pitch rises at the end of sentences. Every sentence ends level or drops. A question still sounds like a statement with a question mark implied.

| Pitch | Delivery Feel | Use For |
|-------|--------------|---------|
| low | Authority, gravity, declaration | Key statements, "The Declaration" moments |
| medium | Natural, conversational | Default narration |

**NEVER USE:** `high`, `x-high`, or positive percentage values. Tyrone's voice lives in the lower register.

**ElevenLabs Note:** Pitch adjustment is supported but subtle on `eleven_multilingual_v2`. The Stability setting (0.62) already allows natural pitch variation. Use pitch sparingly — the voice model handles most of this organically.

---

### Prosody Combination Patterns

These are the most common prosody stacks for Tyrone's delivery:

**The Default (narration):**
```xml
<prosody rate="95%" volume="medium">
[Standard narration text here]
</prosody>
```

**The Weight (emotional moment):**
```xml
<prosody rate="90%" volume="soft">
[Heavy statement here]
</prosody>
```

**The Landing (final line):**
```xml
<prosody rate="85%" volume="soft" pitch="low">
[Last line of section or episode here]
</prosody>
```

**The Stat (data delivery):**
```xml
<prosody rate="90%" volume="medium">
[Number or stat here]
</prosody>
```

---

## CATEGORY 3: EMPHASIS

Emphasis controls how much stress the engine places on specific words or phrases. Tyrone's emphasis is surgical — one word, maybe two, per key sentence.

---

### 3.1 STRONG EMPHASIS

**SSML:**
```xml
<emphasis level="strong">This is the word that matters.</emphasis>
```

**When Tyrone uses it:** The single line in a section that the viewer will remember. The screenshot line. The one that gets clipped for a short. Use once or twice per script, not more.

**Delivery Context:** The Declaration — a statement of fact delivered with total conviction. No hedge.

**Example:**
```xml
<speak>
<prosody rate="95%">
They didn't fire those people.
</prosody>
<break time="400ms"/>
<emphasis level="strong">
They just stopped needing them.
</emphasis>
<break time="1500ms"/>
</speak>
```

**ElevenLabs Note:** Supported. Strong emphasis produces a noticeable stress on the wrapped text — slightly louder, slightly slower. Do not overuse or it sounds performative, which breaks Tyrone's character.

---

### 3.2 MODERATE EMPHASIS

**SSML:**
```xml
<emphasis level="moderate">The computer learned who to ignore.</emphasis>
```

**When Tyrone uses it:** When a line needs to stand out from the surrounding narration but isn't the peak of the section. Think: the second most important line. The setup for the declaration.

**Delivery Context:** Reframes, revelations, the moment before the landing.

**Example:**
```xml
<speak>
<prosody rate="95%">
Nobody's protesting. Nobody's on the news.
</prosody>
<break time="400ms"/>
<emphasis level="moderate">
Because when it happens slow enough, they call it progress.
</emphasis>
</speak>
```

**ElevenLabs Note:** Supported. More subtle than strong — a slight lift in stress. This is the safer default for emphasis in Tyrone's voice.

---

### 3.3 REDUCED EMPHASIS

**SSML:**
```xml
<emphasis level="reduced">just a tool they said</emphasis>
```

**When Tyrone uses it:** When quoting someone else's dismissive language. When repeating a talking point he's about to dismantle. The de-emphasis IS the commentary — he's showing you how hollow the words are by saying them flat.

**Delivery Context:** Quoting authority figures, corporate language, PR statements — anything Tyrone doesn't believe but is citing before tearing apart.

**Example:**
```xml
<speak>
<prosody rate="95%">
The company said it was
</prosody>
<emphasis level="reduced">
streamlining operations.
</emphasis>
<break time="600ms"/>
<prosody rate="90%" volume="soft">
What they meant was they found a program that does it cheaper.
</prosody>
</speak>
```

**ElevenLabs Note:** Supported. Produces a flatter, less stressed delivery. Effective for contrast — the flat delivery of someone else's words makes Tyrone's own words hit harder by comparison.

---

### Emphasis Frequency Guide

| Content Length | Strong | Moderate | Reduced |
|---------------|--------|----------|---------|
| Short (35-58s) | 1 | 2-3 | 0-1 |
| Long-Form (10-20 min) | 3-5 | 8-12 | 3-5 |

**Rule:** If every sentence is emphasized, nothing is emphasized. Tyrone's default delivery carries enough weight on its own. Emphasis markup is for the peaks.

---

## CATEGORY 4: SAY-AS (Number and Format Interpretation)

Say-As tells the engine how to pronounce specific types of content — numbers, dates, times. Without it, the engine guesses, and guessing breaks Tyrone's rhythm.

---

### 4.1 CARDINAL — Numbers as Values

**SSML:**
```xml
<say-as interpret-as="cardinal">4000</say-as>
```
Produces: "four thousand" (not "four zero zero zero")

**When Tyrone uses it:** Stats, job numbers, dollar amounts, population counts. Any time a raw number appears in the script.

**Example:**
```xml
<speak>
<prosody rate="90%">
<say-as interpret-as="cardinal">300000000</say-as> jobs.
</prosody>
<break time="800ms"/>
<prosody rate="95%">
That's not a projection.
</prosody>
</speak>
```
Produces: "Three hundred million jobs."

**ElevenLabs Note:** Supported. Use for any number over 3 digits to ensure correct verbalization. Without this tag, "4000" may render as "four thousand" or "forty hundred" depending on context.

---

### 4.2 ORDINAL — Numbers as Positions

**SSML:**
```xml
<say-as interpret-as="ordinal">3</say-as>
```
Produces: "third"

**When Tyrone uses it:** List items. "The third thing." "The first time." Episode numbering if referenced aloud.

**Example:**
```xml
<speak>
<prosody rate="95%">
Number <say-as interpret-as="ordinal">3</say-as>.
</prosody>
<break time="600ms"/>
</speak>
```
Produces: "Number third." (Context: start of list item 3)

**ElevenLabs Note:** Supported. Straightforward interpretation.

---

### 4.3 DATE — Calendar References

**SSML:**
```xml
<say-as interpret-as="date" format="mdy">03/15/2026</say-as>
```
Produces: "March fifteenth, twenty twenty-six"

**When Tyrone uses it:** News references. "Last Tuesday" is better for Tyrone's voice, but when a specific date matters (legislation dates, model release dates, incident dates), use this.

**Example:**
```xml
<speak>
<prosody rate="95%">
On <say-as interpret-as="date" format="mdy">01/28/2026</say-as>,
they deployed it in three cities without telling anyone.
</prosody>
</speak>
```

**ElevenLabs Note:** Supported with `format` attribute. Common formats: `mdy`, `dmy`, `ymd`, `md`, `dm`, `y`, `m`, `d`.

---

### 4.4 TIME — Clock References

**SSML:**
```xml
<say-as interpret-as="time" format="hms12">6:14 AM</say-as>
```
Produces: "six fourteen A M"

**When Tyrone uses it:** Timestamp hooks. The precision of a clock reading creates immediacy. See Archetype 6 (Timestamp) in hook-playbook.md.

**Example:**
```xml
<speak>
<prosody rate="90%">
<say-as interpret-as="time" format="hms12">2:43 AM</say-as>.
</prosody>
<break time="600ms"/>
<prosody rate="95%">
A server in Virginia ran your insurance claim through eleven different models.
</prosody>
</speak>
```

**ElevenLabs Note:** Partial support. The engine generally handles common time formats correctly without the tag, but the tag prevents misinterpretation (e.g., "2:43" being read as "two forty-three" vs. "two point four three").

---

### 4.5 TELEPHONE — Phone Number Format

**SSML:**
```xml
<say-as interpret-as="telephone">8005551234</say-as>
```
Produces: "eight hundred, five five five, one two three four"

**When Tyrone uses it:** Rarely. If a specific phone number (hotline, FTC complaint line, resource number) appears in a script. Tyrone doesn't give phone numbers often — but when he does, clarity matters.

**ElevenLabs Note:** Partial support. Test before production. The engine may handle phone numbers correctly from context alone, but the tag ensures digit-by-digit delivery.

---

## CATEGORY 5: SUB (Abbreviation Expansion)

Sub replaces displayed text with spoken text. Critical for abbreviations that Tyrone pronounces as words or expands differently than the engine's default.

---

### 5.1 AI — Artificial Intelligence

**SSML:**
```xml
<sub alias="A.I.">AI</sub>
```
Produces: "A.I." (letter by letter, not "ay" as a word)

**When Tyrone uses it:** Every time. "AI" should be spoken as two distinct letters, not as a word. This is non-negotiable for clarity.

**ElevenLabs Note:** The engine usually handles "AI" correctly as "A.I." in context, but the sub tag guarantees it. Include in scripts where "AI" appears in isolation or at the start of a sentence.

---

### 5.2 LLM — Large Language Model

**SSML:**
```xml
<sub alias="L.L.M.">LLM</sub>
```

**When Tyrone uses it:** Rarely — he prefers "the machine" or "a machine that reads everything and says what sounds right." But in scripts referencing specific technical discourse, the abbreviation may appear.

**Note:** Per voice guide, Tyrone avoids jargon. Use the translation table in `tyrone-voice-guide.md` to convert technical terms to Tyrone's language first. Only use the abbreviation if quoting someone else.

---

### 5.3 AGI — Artificial General Intelligence

**SSML:**
```xml
<sub alias="A.G.I.">AGI</sub>
```

**When Tyrone uses it:** In Pillar 2 (AGI/ASI) episodes. He'll say "A.G.I." when naming the concept, then translate: "A machine that thinks for itself."

**Example:**
```xml
<speak>
<prosody rate="95%">
They keep talking about <sub alias="A.G.I.">AGI</sub>.
</prosody>
<break time="400ms"/>
<prosody rate="90%">
A machine that thinks for itself.
</prosody>
<break time="600ms"/>
<prosody rate="85%" volume="soft">
Not thinks what you tell it. Thinks on its own.
</prosody>
</speak>
```

---

### 5.4 ASI — Artificial Superintelligence

**SSML:**
```xml
<sub alias="A.S.I.">ASI</sub>
```

**When Tyrone uses it:** Sparingly. EP 05 Xxplosive, EP 16 The Chronic, EP 21 Light Speed. Always followed by his translation: "Something smarter than everyone in the room, combined."

---

### 5.5 CBDC — Central Bank Digital Currency

**SSML:**
```xml
<sub alias="C.B.D.C.">CBDC</sub>
```

**When Tyrone uses it:** Week 4 content, EP 14 Double Up. He follows with: "programmable money" or "money with conditions."

---

### 5.6 AAVE — African American Vernacular English

**SSML:**
```xml
<sub alias="A.A.V.E.">AAVE</sub>
```

**When Tyrone uses it:** If discussing how AI handles or mishandles Black speech patterns. Rare but important for accuracy.

---

### 5.7 Custom Brand Terms

```xml
<sub alias="BowTie Bullies">BTB</sub>
<sub alias="Red Nose">RN</sub>
```

**Usage:** Script shorthand only. Expand all abbreviations before sending to VO pipeline. The viewer never hears abbreviations for brand terms.

---

## DELIVERY STYLE MAPPING

These are Tyrone's five core delivery modes, mapped to the SSML patterns that produce them.

---

### THE DECLARATION

*A statement of fact. No hedge. No "maybe." He said it. It's done.*

**SSML Pattern:**
```xml
<speak>
<prosody rate="90%" pitch="low">
[Setup sentence — the context.]
</prosody>
<break time="600ms"/>
<emphasis level="strong">
<prosody rate="85%">
[The declaration. One sentence. Declarative. Period.]
</prosody>
</emphasis>
<break time="1500ms"/>
</speak>
```

**Example:**
```xml
<speak>
<prosody rate="90%" pitch="low">
They call it a tool.
</prosody>
<break time="600ms"/>
<emphasis level="strong">
<prosody rate="85%">
A tool doesn't decide who gets a job and who doesn't.
</prosody>
</emphasis>
<break time="1500ms"/>
</speak>
```

**Voice-to-Visual:** Long hold on Red Nose P2 Guard or P1 Watch. No movement. The dog is as still as the truth.

---

### THE WEIGHT

*An emotional moment held steady. Not spilled. Carried.*

**SSML Pattern:**
```xml
<speak>
<prosody rate="90%" volume="soft">
[First line — the emotional content.]
</prosody>
<break time="200ms"/>
<prosody rate="85%" volume="soft">
[Second line — the deeper cut.]
</prosody>
<break time="1000ms"/>
<prosody rate="85%" volume="soft" pitch="low">
[The line that sits in your chest. Short. Final.]
</prosody>
<break time="2000ms"/>
</speak>
```

**Example:**
```xml
<speak>
<prosody rate="90%" volume="soft">
My uncle worked the same line for twenty-two years.
</prosody>
<break time="200ms"/>
<prosody rate="85%" volume="soft">
Last March they replaced him with a system that runs in nine minutes.
</prosody>
<break time="1000ms"/>
<prosody rate="85%" volume="soft" pitch="low">
Twenty-two years. Nine minutes.
</prosody>
<break time="2000ms"/>
</speak>
```

**Voice-to-Visual:** Red Nose P5 Close — one eye, scar visible. Or hands close-up on a table. Single rust-orange light. Everything still.

---

### THE TURN

*The transition between sections. The energy shifts. Something new is coming.*

**SSML Pattern:**
```xml
<speak>
<prosody rate="90%" volume="soft">
[Last line of previous section — landing.]
</prosody>
<break time="1500ms"/>
<prosody rate="95%" volume="medium">
[First line of new section — reset energy, slightly more present.]
</prosody>
<break time="400ms"/>
</speak>
```

**Example:**
```xml
<speak>
<prosody rate="90%" volume="soft">
And nobody said a word.
</prosody>
<break time="1500ms"/>
<prosody rate="95%" volume="medium">
Number three.
</prosody>
<break time="400ms"/>
</speak>
```

**Voice-to-Visual:** Hard cut to black (hold 1.5 seconds during the Heavy pause). New image slams in with "Number three." New visual world for the new list item.

---

### THE LANDING

*How Tyrone ends. Quiet. Heavy. Final. The viewer carries it.*

**SSML Pattern:**
```xml
<speak>
<prosody rate="90%">
[Penultimate sentence — the setup for the final beat.]
</prosody>
<break time="600ms"/>
<prosody rate="85%" volume="soft" pitch="low">
[Final sentence. Short. Heavy. Period.]
</prosody>
<break time="2000ms"/>
</speak>
```

**Example:**
```xml
<speak>
<prosody rate="90%">
Four thousand emails. Zero apologies.
</prosody>
<break time="600ms"/>
<prosody rate="85%" volume="soft" pitch="low">
Pay attention.
</prosody>
<break time="2000ms"/>
</speak>
```

**Voice-to-Visual:** Red Nose P4 Silhouette or P1 Watch. Rust light fading. Slow fade to Dark Steel (#1E1E20). Hold black 2 seconds. End card.

---

### THE QUESTION

*Rhetorical. The answer is the silence that follows. Tyrone asks it and then lets the room be empty.*

**SSML Pattern:**
```xml
<speak>
<prosody rate="90%" volume="medium">
[The question. Delivered flat — not rising inflection.
Tyrone asks questions like he already knows the answer
and is testing whether you do.]
</prosody>
<break time="1000ms"/>
</speak>
```

**Example:**
```xml
<speak>
<prosody rate="90%" volume="medium">
If a machine denies your loan, who do you call?
</prosody>
<break time="1000ms"/>
<prosody rate="90%">
If a machine scores your resume and throws it out, who do you argue with?
</prosody>
<break time="1000ms"/>
<prosody rate="85%" volume="soft">
There's no face on the other side of the desk anymore.
</prosody>
<break time="1500ms"/>
</speak>
```

**Voice-to-Visual:** Red Nose P1 Watch or P5 Close. The dog stares. He's waiting for the answer too. But he already knows. The pause after the question — screen may cut to black briefly or hold on Red Nose with no visual movement.

---

## FULL MARKUP REFERENCE TABLE

| Pattern | SSML Code | Category | Delivery Style |
|---------|-----------|----------|----------------|
| Micro pause | `<break time="200ms"/>` | Pause | Any — structural |
| Beat pause | `<break time="400ms"/>` | Pause | Any — sentence separation |
| Breath pause | `<break time="600ms"/>` | Pause | Turn, Declaration setup |
| Weight pause | `<break time="1000ms"/>` | Pause | Declaration, Question |
| Heavy pause | `<break time="1500ms"/>` | Pause | Turn, Landing setup |
| Silence pause | `<break time="2000ms"/>` | Pause | Landing, Weight |
| Slow rate | `<prosody rate="85%">` | Prosody | Landing, Weight |
| Measured rate | `<prosody rate="90%">` | Prosody | Weight, Question |
| Default rate | `<prosody rate="95%">` | Prosody | Narration default |
| Soft volume | `<prosody volume="soft">` | Prosody | Weight, Landing |
| Medium volume | `<prosody volume="medium">` | Prosody | Default narration |
| Low pitch | `<prosody pitch="low">` | Prosody | Declaration, Landing |
| Strong emphasis | `<emphasis level="strong">` | Emphasis | Declaration (peak line) |
| Moderate emphasis | `<emphasis level="moderate">` | Emphasis | Reframe, revelation |
| Reduced emphasis | `<emphasis level="reduced">` | Emphasis | Quoting others |
| Cardinal number | `<say-as interpret-as="cardinal">` | Say-As | Stats, counts |
| Ordinal number | `<say-as interpret-as="ordinal">` | Say-As | List items |
| Date | `<say-as interpret-as="date">` | Say-As | News references |
| Time | `<say-as interpret-as="time">` | Say-As | Timestamp hooks |
| Phone | `<say-as interpret-as="telephone">` | Say-As | Resource numbers |
| AI expansion | `<sub alias="A.I.">AI</sub>` | Sub | Throughout |
| AGI expansion | `<sub alias="A.G.I.">AGI</sub>` | Sub | Pillar 2 episodes |
| ASI expansion | `<sub alias="A.S.I.">ASI</sub>` | Sub | Pillar 2 episodes |
| CBDC expansion | `<sub alias="C.B.D.C.">CBDC</sub>` | Sub | Financial episodes |

---

## SCRIPT PREPROCESSING RULES (WF-03 Code Node)

Before sending script text to ElevenLabs, the n8n Code Node must:

1. **Wrap everything in `<speak>` tags.** No SSML works without the wrapper.
2. **Strip all `[VISUAL: ...]` markers.** These are for the visual pipeline, not the voice engine.
3. **Strip all `[CAPTION: ...]` markers.** These are for the caption pipeline.
4. **Strip all `[ON-SCREEN TEXT: ...]` markers.** Visual only.
5. **Convert plain-text pauses:**
   - `[2 second pause]` becomes `<break time="2000ms"/>`
   - `[1.5 second pause]` becomes `<break time="1500ms"/>`
   - `[beat]` becomes `<break time="400ms"/>`
   - `[pause]` (unspecified) becomes `<break time="800ms"/>`
6. **Preserve all existing SSML tags** (prosody, emphasis, say-as, sub, break).
7. **Validate XML structure.** Every opening tag must have a closing tag. All attribute values in double quotes.
8. **Character limit:** ElevenLabs accepts up to 5000 characters per request. For long-form scripts, split at section boundaries (after `<break time="1500ms"/>` or `<break time="2000ms"/>` markers) and concatenate audio in post-production.

---

## ANTI-PATTERNS (What NOT To Do)

| Anti-Pattern | Why It Breaks Tyrone | Fix |
|-------------|---------------------|-----|
| `<prosody rate="120%">` | Tyrone never rushes. Fast = not him. | Cap at 100%. Default 95%. |
| `<prosody volume="loud">` | Tyrone never yells. Loud = performance. | Use soft or medium only. |
| `<prosody pitch="high">` | Uptalk. Breaks authority. | Use low or default only. |
| `<emphasis level="strong">` on every sentence | If everything is emphasized, nothing is. | Max 1-2 per short, 3-5 per long-form. |
| `<break time="100ms"/>` | Too short to register. Wasted markup. | Minimum useful pause: 200ms. |
| `<break time="5000ms"/>` | Engine may clip or restart awkwardly. | Cap at 2000ms in TTS. Add silence in FFMPEG for longer gaps. |
| No `<speak>` wrapper | All SSML fails silently. | Always wrap. No exceptions. |
| Nested `<prosody>` inside `<emphasis>` | Unpredictable rendering. | Use one or the other per phrase, not both nested. |
| `<say-as>` on plain words | Engine mispronounces. | Only use for numbers, dates, times, abbreviations. |

---

*"Silence isn't empty. It's full of everything I didn't have to say."*
*— Tyrone, BowTie Bullies*
