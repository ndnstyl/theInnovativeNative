# Verb Discipline — Provenance & Strength

Adapted from ARPeeketi/claude-resume-kit. Every verb in the resume implies a level of ownership and provenance. Pick the right strength; don't overclaim.

## Strength ladder

Ranked weakest to strongest. Pick the strongest verb your provenance supports.

| Strength | Verbs | Provenance required |
|----------|-------|---------------------|
| 1. Contributed | Contributed to, Supported, Assisted, Participated in | Any — you were on the project but didn't own it |
| 2. Collaborated | Collaborated on, Co-developed, Partnered with, Co-authored | You + 1-3 others, peer-level ownership |
| 3. Drove | Drove, Coordinated, Facilitated, Aligned | You were a leading contributor but reported to a decision-maker |
| 4. Led | Led, Managed, Directed, Owned | You were the decision-maker for the work |
| 5. Founded | Founded, Architected, Built (from scratch), Established, Pioneered | You created it where nothing existed |

### Rule
If the master CV's provenance tag is `estimated` or `self-reported`, cap the verb at strength 3 (Drove). Only `published` or `internal-with-receipts` evidence supports strength 4 or 5.

If unsure, downshift one level. Hiring managers see through overclaims in interview; better to underclaim and overdeliver in the conversation.

## Provenance tags (used in master CV)

| Tag | Meaning | Max verb strength |
|-----|---------|-------------------|
| `published` | Public artifact verifies the claim (GitHub repo, paper, press release, public dashboard) | 5 |
| `internal-with-receipts` | Internal artifact exists you could show (Notion doc, dashboard, email thread, deck) | 5 |
| `internal-only` | Internal but no specific artifact you'd cite in interview | 4 |
| `self-reported` | Your memory of what happened; nobody else could verify | 3 |
| `estimated` | You're inferring the number from indirect signals | 3 (and soften with "approximately" or "~") |
| `team` | A team outcome; your individual contribution was real but bounded | 1-2 max |

## Strength examples

### Same achievement, different strengths

Backend role at a SaaS startup that doubled API throughput:

- Strength 1: "Contributed to API performance work; helped reduce p99 latency."
- Strength 2: "Co-developed API optimization initiative with platform team, reducing p99 latency 50%."
- Strength 3: "Drove API performance investigation, leading rollout of connection pooling and Redis caching that reduced p99 latency from 800ms to 380ms."
- Strength 4: "Led API performance initiative end-to-end (design, implementation, rollout), reducing p99 latency from 800ms to 380ms across 12 services serving 200K MAU."
- Strength 5: "Architected and built the platform's first performance instrumentation system from scratch; subsequent optimization reduced p99 latency from 800ms to 380ms."

Don't pick strength 5 if the truth is strength 3. The interviewer will ask "tell me about how you architected that," and the gap will show.

## Banned verb-substitutions

These look like upgrades but signal LLM authorship:
- "Leveraged" → use "Used" or be specific ("Built with X")
- "Spearheaded" → use "Led" or "Drove"
- "Orchestrated" → use "Coordinated" or "Ran"
- "Facilitated" → use "Ran" or "Led" (unless you actually facilitated a workshop)
- "Empowered" → almost always vague; replace with the specific action
- "Synergized" → just no
- "Catalyzed" → use "Triggered" or "Started"

If you find yourself reaching for a thesaurus, your bullet is probably too vague. Add a number instead.
