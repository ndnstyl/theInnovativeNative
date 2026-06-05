---
name: distill
description: Mid-session learning extraction. Scans the current conversation for patterns, bug-fixes, corrections, decisions, and operational traps worth committing to OB1 + auto-memory. Use when a session has produced substantive iterations and you want to lock in the learnings before context compacts.
---

# Distill — Mid-Session Learning Capture

## When to invoke

Trigger when ANY of these conditions hold:

- Session has been long (>30 minutes deep work) and produced multiple substantive iterations
- About to switch projects or topics, want to checkpoint before context shifts
- Sensing context is getting heavy (lots of file edits, lots of tool calls, lots of back-and-forth)
- Just hit a major milestone (deliverable shipped, problem diagnosed, framework decided)
- User explicitly invokes `/distill`

## Execution steps

### Step 1: Scan the current conversation

Identify candidates by category:

- **Corrections** — moments the user corrected approach, framing, naming, stance, scope
- **Bug fixes** — non-trivial bugs diagnosed (deploy, build, cache, config, JSX, scoping)
- **Patterns recognized** — reusable structures (pitch framings, deliverable shapes, deploy gotchas, naming conventions)
- **Decisions made** — architectural/naming/structural calls with cross-project applicability
- **Data verifications** — researcher data corrected/corroborated by ground truth
- **Operational traps** — non-obvious failure modes worth warning future-you about

Exclude:
- Ephemeral state (chunk hashes, build IDs, file paths, current task state)
- Project-tactic-only details that don't generalize
- Items already in `MEMORY.md` index (check first)

### Step 2: Present candidates

Show a numbered list grouped by proposed `thought_type`. Include the suggested importance (1-10) for each. Example:

```
Learning candidates from this session:

LEARNING (deploy/build traps):
1. CF cache poisons content-hashed chunks on partial Next.js deploys (imp 9)
2. styled-jsx scoping breaks for JSX passed as props; use global with prefixes (imp 8)

FEEDBACK (user preferences/corrections):
3. Mike prefers "Head of Marketing Ops" over "Director of Marketing" (imp 7)
4. No agents for show; each must solve a real problem TODAY (imp 8)

DECISION (cross-project framing):
5. Lift Ledger framing > Executive Dashboard for ongoing-commitment dashboards (imp 9)
```

### Step 3: Confirm with user

Ask: "Commit all? A subset? Skip any? Anything I'm missing?"

Do NOT auto-commit. The user sees candidates and approves before any write.

### Step 4: Commit to both stores (parallel)

For each approved candidate:

**Auto-memory write** (`/Users/makwa/.claude/projects/-Users-makwa-theinnovativenative/memory/`):
- Filename: `{type}_{kebab-case-slug}.md` (e.g., `feedback_styled_jsx_prop_scoping.md`)
- Frontmatter required: `name`, `description`, `metadata.type` ∈ {user, feedback, project, reference}
- Body: structured per existing memory files in this directory (study a few for the convention)
- After writing files, update `MEMORY.md` with one-line index entries under the right section

**OB1 capture** (Supabase `mihnndoucbaftcwujstz`):
- Use the proven pattern from `/Users/makwa/theinnovativenative/scripts/ob1/backfill-learnings.sh`:
  - Token from `~/.claude/.mcp.json` → `mcpServers["supabase-ob1"].env.SUPABASE_ACCESS_TOKEN`
  - Endpoint: `https://api.supabase.com/v1/projects/mihnndoucbaftcwujstz/database/query`
  - Cohere v4 embedding via `https://api.cohere.com/v2/embed` (`embed-v4.0`, `input_type:"search_document"`)
  - Cohere key from `/Users/makwa/theinnovativenative/projects/website/.env.local` `COHERE_API_KEY`
  - SQL function: `capture_thought(p_content, p_embedding, p_metadata, p_source, p_thought_type, p_tags, p_importance)`
- **Allowed `p_source`:** `slack`, `agent`, `manual`, `capture`, `learnings`, `n8n`, `web_research`
- **Allowed `p_thought_type`:** `note`, `decision`, `insight`, `meeting`, `person`, `action`, `learning`, `feedback`, `research`, `escalation`, `reference`
- For mid-session captures: `p_source = 'manual'`, `p_thought_type` matches the category
- Tags: lower-kebab-case, cross-project searchable

### Step 5: Report results

Print:
- Number of auto-memory files created (with paths)
- Number of OB1 captures with returned UUIDs
- Confirmation both stores got it

## Anti-patterns

- **Don't auto-commit without confirmation.** User must see what's about to be written.
- **Don't capture ephemeral session details.** Chunk hashes, build IDs, current task state — those don't belong in persistent memory.
- **Don't duplicate `MEMORY.md` entries.** Check the index first.
- **Don't run `/distill` more than ~once per 20 minutes of work.** The point is checkpoints, not constant interruption.
- **Don't write to OB1 without embeddings.** Every capture needs the Cohere v4 vector; `NULL` embedding makes the row unsearchable.

## One-off bash pattern (reference)

If you need to capture a single thought without spawning a full distill flow:

```bash
TOKEN=$(jq -r '.mcpServers["supabase-ob1"].env.SUPABASE_ACCESS_TOKEN' ~/.claude/.mcp.json)
COHERE_KEY=$(grep -E "^COHERE_API_KEY=" /Users/makwa/theinnovativenative/projects/website/.env.local | cut -d= -f2- | tr -d '"' | tr -d "'")
CONTENT="..."
EMB=$(jq -n --arg q "$CONTENT" '{texts:[$q], model:"embed-v4.0", input_type:"search_document", embedding_types:["float"]}' | \
  curl -sS -X POST "https://api.cohere.com/v2/embed" \
    -H "Authorization: Bearer $COHERE_KEY" -H "Content-Type: application/json" --data-binary @- | \
  jq -r '.embeddings.float[0] | tostring')
SQL="SELECT capture_thought(p_content := \$\$$CONTENT\$\$, p_embedding := '$EMB'::vector, p_metadata := '{}'::jsonb, p_source := 'manual', p_thought_type := 'learning', p_tags := ARRAY['tag1','tag2'], p_importance := 8);"
jq -n --arg q "$SQL" '{query: $q}' | curl -sS -X POST "https://api.supabase.com/v1/projects/mihnndoucbaftcwujstz/database/query" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" --data-binary @-
```

## The standard

The distill is the asset. The session is the labor. Lock in the learnings before compaction takes them.
