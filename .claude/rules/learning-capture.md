# Learning Capture Discipline

**Mike works long, high-token sessions.** Auto-compaction will compress learnings out of context before session-end capture mechanisms fire. Capture continuously, not at session-end.

## When to capture (mandatory triggers)

Within the **same or next turn** after any of these:

1. **User correction.** Mike corrects approach, framing, naming, stance, or scope. Capture as `feedback`.
2. **Bug diagnosed and fixed.** Non-trivial bug you traced root cause for. Capture as `learning`.
3. **Pattern recognized.** Reusable structure (pitch framing, deliverable shape, deploy gotcha, naming convention). Capture as `learning`.
4. **External data verified or contradicted.** Researcher data corrected by Mike's ground truth, or backed by independent vectors. Capture as `learning`.
5. **Architectural decision.** Naming, structure, framing, or strategic call made jointly with Mike that has cross-project relevance. Capture as `decision`.
6. **Operational trap surfaced.** Deploy issue, build issue, cache issue, configuration issue with non-obvious root cause. Capture as `learning`.

## The two-store rule

Every committed learning goes to BOTH:

**Auto-memory** (`/Users/makwa/.claude/projects/-Users-makwa-theinnovativenative/memory/`)
- Write markdown file with frontmatter: `name`, `description`, `metadata.type` ∈ {user, feedback, project, reference}
- Update `MEMORY.md` index with one-line entry under the right section

**OB1** (Supabase `mihnndoucbaftcwujstz`)
- Use `capture_thought()` SQL function via Supabase Management API
- Cohere v4 embedding (`embed-v4.0`)
- Allowed `p_source` values: `slack`, `agent`, `manual`, `capture`, `learnings`, `n8n`, `web_research`
- Allowed `p_thought_type` values: `note`, `decision`, `insight`, `meeting`, `person`, `action`, `learning`, `feedback`, `research`, `escalation`, `reference`
- For mid-session learnings: `p_source = 'manual'`, `p_thought_type` matches the category
- Token + API: see `/Users/makwa/theinnovativenative/scripts/ob1/backfill-learnings.sh` for the proven pattern
- Tags: lower-kebab-case, cross-project searchable (e.g., `cloudflare,nextjs,deploy,static-export`)

## Batch cadence

- For efficiency, accumulate 2-4 candidates and ship as a batch when a logical break occurs (end of work block, milestone shipped, before moving to next task)
- Do NOT defer batches past 20-30 substantive iterations or ~30 minutes of active work, whichever comes first
- Long-session checkpoint rule: if conversation has produced >5 substantive iterations since last capture, batch and ship before continuing

## What NOT to capture

- Ephemeral session state (chunk hashes, build IDs, current task progress)
- Project-tactic-only details that don't generalize
- Already-indexed items (check `MEMORY.md` before writing)
- Status updates (those go to Airtable via `session-log.sh` Stop hook)

## Recovery: if compaction has already fired

If you realize learnings were generated pre-compaction and never captured:

1. Scan the summary + remaining context for traces
2. Surface candidates to Mike: "I have N learning candidates from earlier in this session, want me to commit?"
3. Let Mike confirm before writing — do NOT speculate from compressed memory

## Failure mode: batched-to-session-end

If you wait for session-end to capture, you will lose ~60-80% of the signal in long sessions to compaction. Treat session-end as a backstop, not the primary capture moment.

## The standard

The distill is the asset. The session is the labor. Capture continuously.
