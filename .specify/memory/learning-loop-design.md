---
name: Autonomous Learning Loop — Design Doc
status: design (Mike review pending before Component 1 build)
created: 2026-04-15
owner: orchestrator + logger
---

# Autonomous Learning Loop — Design

## Purpose
Subagents (orchestrator, implementer, researcher, reviewer, deployer, logger)
self-improve over time without Mike's manual intervention by reading their own
prior outcomes before acting.

## Validation Sprint Results (2026-04-15)

| Check | Result |
|---|---|
| OB1 reachable + queryable from bash | ✓ 541 thoughts (memory said 10 — stale) |
| OB1 capture_thought() works via REST | ✓ returns UUID |
| OB1 retrieve by tag works via REST | ✓ |
| `TaskCompleted` hook fires on Agent completion | ✗ never fires (event is for Airtable tasks) |
| `SubagentStop` hook fires on Agent completion | ✓ confirmed |
| SubagentStop stdin includes agent name | ✓ as `agent_type` field |
| SubagentStop stdin includes transcript | ✓ as `agent_transcript_path` |
| SubagentStop stdin includes final reply | ✓ as `last_assistant_message` |

**Side-effect discovery:** `verify-task.sh` was wired to `TaskCompleted` and
**never fired** since its creation. Moved to `SubagentStop` as part of this
sprint — first time TS gating actually runs after subagent code edits.

## SubagentStop Payload (canonical)

The hook receives this JSON via stdin (sample):

```json
{
  "session_id": "3765e31a-dca0-4cd1-8d70-c765b91ed98f",
  "agent_id": "aaffc11a394c3781a",
  "agent_type": "researcher",
  "agent_transcript_path": "/Users/.../subagents/agent-{id}.jsonl",
  "transcript_path": "/Users/.../{session}.jsonl",
  "cwd": "/Users/makwa/theinnovativenative",
  "permission_mode": "acceptEdits",
  "hook_event_name": "SubagentStop",
  "stop_hook_active": false,
  "last_assistant_message": "OK3"
}
```

Env vars: `CLAUDE_PROJECT_DIR`, `CLAUDE_CODE_ENTRYPOINT` only. Everything
agent-specific is in the JSON payload.

## task_type Enum (controlled vocabulary)

The orchestrator MUST tag every Agent invocation with one of these values
in the prompt prelude (e.g. `[task_type=react_component_create] ...`).
The hook parses it from the user message in `agent_transcript_path`.

| task_type | Used by | Example |
|---|---|---|
| `n8n_workflow_build` | implementer | Create new n8n workflow |
| `n8n_workflow_fix` | implementer | Fix broken n8n workflow |
| `n8n_workflow_audit` | researcher, reviewer | Inspect workflow node-by-node |
| `react_component_create` | implementer | New React component |
| `react_component_edit` | implementer | Modify existing component |
| `ts_bug_fix` | implementer | TypeScript error / runtime bug |
| `scss_styling` | implementer | SCSS / responsive layout |
| `airtable_schema_change` | implementer | Add/modify Airtable field |
| `airtable_data_query` | researcher | Read data from Airtable |
| `supabase_query` | researcher, implementer | Read/write Supabase |
| `supabase_schema_change` | implementer | Migration / DDL |
| `git_commit` | deployer | Stage + commit |
| `git_deploy` | deployer | Push + rsync to A2 |
| `code_review` | reviewer | Pre-merge / pre-deploy QA |
| `security_audit` | reviewer | Credential / RLS / OWASP scan |
| `content_research` | researcher | Read codebase or external for facts |
| `content_write` | implementer | Write copy / spec / doc |
| `airtable_log_write` | logger | Time entry / task / deliverable record |
| `ob1_capture` | logger | Capture thought to OB1 |
| `meta` | orchestrator | Decompose / delegate (no direct work product) |

**Rule:** if a task doesn't fit, propose adding a new enum value via PR
(don't invent strings ad-hoc — that's the noise problem).

## Per-Agent Outcome Metric

Outcome is a tuple: `{status, signal_source, confidence}`. Each agent has
a different success definition because each does different work.

| Agent | Success Signal | How Hook Determines It | Confidence |
|---|---|---|---|
| **implementer** | Build passes after edits | `verify-task.sh` exit code (0 = pass) + git diff non-empty | high |
| **deployer** | Final bash `git push` / `rsync` returned 0 | parse last Bash tool result in transcript | high |
| **reviewer** | No CRITICAL flags in `last_assistant_message` | regex `/CRITICAL|BLOCKER/i` absent | medium |
| **researcher** | Scored by delegating agent (lead) | hook records `outcome=pending_lead_score`; resolver pairs with later orchestrator `[score:agent_id=X:N:reason]` line | medium |
| **logger** | Airtable / OB1 write returned an ID | parse last tool result for ID pattern | high |
| **orchestrator** | Aggregate of child outcomes (computed weekly, not per-run) | offline rollup | n/a |

**Delayed-signal pass (weekly cron):** scan `git log` for files an implementer
touched. If ANY of those files were re-edited within 48 hours (regardless of who
did it), retroactively mark prior outcome `rework_needed=true`. Decay weight to
0 after 30 days.

## Component Build Order (revised)

| # | Component | Status | Build Trigger |
|---|---|---|---|
| 0 | Validation sprint | ✓ DONE 2026-04-15 | — |
| 1 | `outcome-capture.sh` (SubagentStop hook → JSONL append) | NEXT | Mike approves this doc |
| 2 | Baseline window (2 weeks, no injection) | auto after #1 | Time-based |
| 3 | `sync-outcomes-to-ob1.sh` (bash, NOT haiku) | after #2 | Cron daily |
| 4 | Pre-task injection (orchestrator queries OB1, top 3-5) | after #2 baseline | Manual ship |
| 5 | Delayed-signal rework scanner | after #4 | Cron weekly |
| 6 | Threshold-based prompt mutation (auto-PR to agent .md files) | ✓ SHIPPED 2026-04-16 | Weekly Sun 8am cron, N≥3, 30d decay, report-only until data accumulates |
| 7 | OB1 hygiene agent (orphan detection, contradiction resolver, upsert reconciler) | ✓ SHIPPED 2026-04-15 | Daily 6am cron (--report-only) |
| 1.5 | Researcher score resolver | ✓ SHIPPED 2026-04-16 | Hourly cron, pairs [score:agent_id=X:N:reason] from transcripts to pending records |
| 5 | Delayed-signal rework scanner | ✓ SHIPPED 2026-04-16 | Weekly Sun 7am cron, 14d window, 48h rework detection |
| DB | needs_embedding queue + triggers | ✓ SHIPPED 2026-04-16 | AFTER INSERT/UPDATE trigger auto-flags NULL embeddings; embed-missing.sh drains every 30min |

## Cold-Start Strategy (revised — moot)

Original plan flagged 500-thought activation threshold. **OB1 already has 541
thoughts.** Skip cold-start handling. Component 4 queries OB1 from day 1.

## Prompt Bloat Defense (capped injection)

| Agent model | Max past-attempt entries | Max chars per entry | Total ceiling |
|---|---|---|---|
| haiku (researcher, logger) | 3 | 100 | ~300 chars / ~75 tokens |
| sonnet (implementer, deployer) | 5 | 200 | ~1000 chars / ~250 tokens |
| opus (orchestrator, reviewer) | 5 | 300 | ~1500 chars / ~375 tokens |

Pre-compress in bash before injection: one line per outcome
`{date} {task_type} {status} {1-line-summary}`.

## Loop Poisoning Defenses

1. **N=3 minimum:** a pattern requires ≥3 occurrences before retrieval treats it as a rule.
2. **Decay:** outcomes >30 days drop out of retrieval entirely.
3. **Context preservation:** every captured outcome includes raw `task_type`,
   files touched, error message (if any) — enables disambiguation of
   "X failed because Y" vs "X failed because Z".
4. **Mike review on prompt mutation:** Component 6 PRs include the raw outcome
   data the rule was derived from + a default rollback diff.
5. **`questioned` tag:** if an injected outcome leads to failure,
   subagent flags it; auto-demoted importance per OB1 protocol.

## Rollback

| Failure mode | Rollback |
|---|---|
| Bad outcome captured | `DELETE FROM thoughts WHERE id = X` (reversible) |
| Bad pattern teaches whole agent fleet | `DELETE FROM thoughts WHERE created_at > T AND tags @> ARRAY['outcome']` |
| Component 6 PR mutates prompts wrong | `git revert <sha>` on the learning-loop branch |
| Whole loop is net negative | Disable `outcome-capture.sh` in settings.json (one line) |

## Cost Budget

- OB1 query per delegation: ~150ms median Supabase round-trip + ~250 tokens injected
- Hard ceiling: if injection adds >500ms p50 latency over 1 week, kill it
- Supabase free tier: 500MB DB. At 541 thoughts ≈ ~5MB. Headroom for ~50,000 outcomes.

## A/B Measurement (mandatory before Component 4)

Component 1 (capture only) ships first. Two-week baseline. Measure per-agent:
- Tasks/week
- Success rate (per outcome metric above)
- Median completion time
- Rework rate (delayed signal)

Component 4 (injection) ships only if Mike approves the baseline data is clean
enough to A/B against.

## Mike Decisions (2026-04-15)

1. **task_type tagging** — APPROVED. Orchestrator prefixes every subagent
   prompt with `[task_type=X]`.
2. **Researcher outcome** — SCORED BY THEIR LEAD (not Mike, not skipped).
   Lead = the agent that delegated the work. In current architecture that
   = orchestrator. Implementation: orchestrator includes
   `[score:agent_id=<id>:<0-10>:<reason>]` in its synthesis. A resolver
   script pairs orchestrator scores back to the prior researcher's
   pending outcome record. Same pattern available for any agent whose
   output isn't auto-scoreable.
3. **Component 6 (auto-mutate agent .md files)** — APPROVED. Mike does
   not want stale tech debt in agent definitions; wants updates as
   needed. Ships with safeguards: N≥3 occurrences, 30-day decay, PR
   includes raw outcome data + default rollback diff, Mike reviews diff.
4. **NEW: Component 7 — OB1 Hygiene Agent.** Daily cron. Scans OB1 for:
   - Thoughts that reference files/workflows/tables that no longer exist
     → mark `orphaned`, then delete after 7-day grace period
   - Contradictory pairs (same tags, opposite advice) → flag for resolver
   - Updated/overwritten upstream sources (e.g. workflow JSON changed
     since the thought was captured) → re-capture or delete
   - Duplicate near-content (high cosine similarity) → merge into higher
     importance
   See `scripts/ob1/hygiene.sh` for implementation.

---

**Status:** approved 2026-04-15. Components 1 + 7 SHIPPED 2026-04-15.

## Daily Cron Setup (Component 7)

To enable daily OB1 hygiene (Mike to enable when ready):

```bash
# Run dry-run daily at 6am, write report to .specify/memory/
0 6 * * * cd /Users/makwa/theinnovativenative && bash scripts/ob1/hygiene.sh --report-only >> ~/.claude/cron.log 2>&1

# OR run with --apply once a week (Sunday 6am) after reviewing prior reports
0 6 * * 0 cd /Users/makwa/theinnovativenative && bash scripts/ob1/hygiene.sh --apply >> ~/.claude/cron.log 2>&1
```

Add via `crontab -e`. Recommended: dry-run daily first for 1 week, then enable
`--apply` once Mike has reviewed reports and trusts the orphan/dup detection.

## Resolver (deferred, Component 1.5)

A nightly script will scan orchestrator transcripts for
`[score:agent_id=X:N:reason]` lines and update prior pending outcome records.
Build when researcher outcomes accumulate >20 pending. Until then, scores live
in transcripts and can be queried offline.
