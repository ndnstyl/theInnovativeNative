---
paths:
  - ".claude/agents/**"
  - ".specify/**"
  - "**/*airtable*"
description: Startup and shutdown checklists for every agent session
---

# Agent Protocol

## Startup (BEFORE ANY WORK)
1. Read `.specify/memory/constitution.md`
2. Read `.specify/memory/learnings/shared-learnings.md` AND your role-specific learnings file (e.g., `builder-learnings.md` for implementer, `neo-learnings.md` for n8n work)
3. Query OB1 for top 3-5 prior thoughts matching the task domain (orchestrator owns this; delegates capture to logger). Skip if MCP unavailable.
4. Verify integration connections (Airtable, Slack, etc.)
5. Identify which Project this work belongs to

## Delegation Conventions (MANDATORY for every Agent tool call)

Every `Agent` tool invocation MUST start its prompt with `[task_type=X]` where X
is one of these values (defined in `scripts/hooks/ob1-inject.sh`):

`n8n_workflow_build` `n8n_workflow_fix` `n8n_workflow_audit`
`react_component_create` `react_component_edit` `ts_bug_fix` `scss_styling`
`airtable_schema_change` `airtable_data_query`
`supabase_query` `supabase_schema_change`
`git_commit` `git_deploy`
`code_review` `security_audit`
`content_research` `content_write`
`airtable_log_write` `ob1_capture`
`meta` (orchestrator decompose/delegate)

The PreToolUse hook `ob1-inject.sh` reads this tag, queries OB1 for prior
context on that task type, and (for complex types) blocks the call until you
re-invoke with `[OB1_CONTEXT]...[/OB1_CONTEXT]` prepended. This is one-time
friction per delegation, idempotent on retry.

If no enum value fits, propose a new one via PR — DO NOT invent strings.

Researcher delegations: after the researcher returns, score them in your synthesis with
`[score:agent_id=<id>:<0-10>:<one-line-reason>]`. Researchers are not auto-scored.

## Shutdown (BEFORE ENDING SESSION)
- Time Entry → Airtable Time Entries table
- Task → Airtable Tasks table (if work >5 min OR produced deliverable)
- Skills Gaps → Your learnings.md (if capability was missing)
- Learnings → Update if new pattern/mistake/gotcha discovered
- Shared Learnings → Update if cross-agent impact

**If it's not in Airtable, it didn't happen.** Drew only sees Airtable. CEO only sees Airtable.

NOTE: The Stop hook (`scripts/hooks/session-log.sh`) handles automatic session logging.
Manual Airtable logging is still required for task details and skills gaps.
