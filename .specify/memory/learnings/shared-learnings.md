# Shared Learnings

Cross-agent discoveries and patterns that apply to multiple agents.

## Last Updated: 2026-02-04

## Critical Patterns (ALL AGENTS)
- Always load constitution on startup - it contains non-negotiable principles
- Check learnings.md before starting any task to avoid repeating mistakes
- "Slower is Faster" - methodical execution beats rushed mistakes
- **MANDATORY: Log time, tasks, and tokens to Airtable after EVERY session - no exceptions**
- Airtable is the single source of truth for all agent work tracking
- **DOCUMENTATION IS EVERYTHING**: Without .md files in `.specify/features/`, work cannot be tracked or continued across sessions

## Spec Kit Model (MANDATORY)
Every feature/project MUST have these files in `.specify/features/<project-name>/`:
- `spec.md` - User stories, requirements, success criteria
- `plan.md` - Implementation approach, timeline, dependencies
- `tasks.md` - Task breakdown with IDs, agents, status checkboxes

**No spec kit = No work starts. Drew enforces this.**

## Airtable as Cloud CRM/Dashboard (MANDATORY)
**Local files are for session continuity. Airtable is for cloud access when traveling.**

- **Deliverables table** (`tblnUsXJ2ZHjZGcyu`) - Every deliverable MUST be logged with:
  - Actual content (for text like LinkedIn posts)
  - Local Path (for file reference)
  - File URL (for cloud-hosted assets)
  - Status (Draft/Ready/Published/Archived)
  - Project link, Created By agent, UTM links

- **Why**: CEO needs access to all assets from any device, not just local machine
- **Rule**: After creating any deliverable, agent MUST add record to Deliverables table

## Cross-Agent Coordination
- Task routing flows through Drew unless specific exceptions apply
- Jenna → Rex (git) and Jenna → Sage (docs) bypass Drew
- CEO can assign directly to anyone

## Integration Gotchas
- n8n: Never test workflows with Apify HTTP nodes
- Airtable: Always check for existing data before schema changes
- Database migrations: Check existing data first (Hostinger, n8n, etc.)
- n8n webhooks: Data arrives under `$json.body.data.*` not `$json.data.*`
- n8n credentials: Verify credential ID matches between workflow versions
- Slack MCP: Requires reinstalling app after adding OAuth scopes
- Airtable Time Entries: Tokens Used field may need manual schema addition

## Session Learnings (2026-02-04)
- Constitution updated to mandate Airtable logging for all agents
- Agent Logging SOP created at `.specify/sops/agent-logging-sop.md`
- Rize webhook integration fully operational
- All 17 agent skill files updated with shutdown protocol

## Critical Mistake (2026-02-04)

### Failure: Airtable Logging Skipped

**What happened**: Created 9 Airtable tables but logged nothing to Airtable
- No Project record created
- No Tasks logged
- No Time Entry logged
- Drew had zero visibility into completed work

**Root cause**:
1. Did not load constitution before starting work
2. Treated local .md file updates as sufficient
3. Did not follow mandatory shutdown protocol

**Prevention**:
1. EVERY session must start with constitution load
2. EVERY session must end with Airtable logging
3. Local .md files are for planning, Airtable is for visibility
4. Drew only sees Airtable - if it's not there, it doesn't exist

**Fix applied**: Backfilled Project (recN2VorsuzMoQjgH), 9 Tasks, and Time Entry to Airtable

## Content Framing Standards (ALL CONTENT AGENTS)

**Added: 2026-02-04** - Critical update for content authenticity.

### Our Lane (Claim expertise)
- SaaS/software development
- AI automation systems
- Marketing content creation
- Systems integration

### NOT Our Lane (NEVER claim)
- Legal advice (build for lawyers, not lawyers)
- Financial advice (build for fintech, not analysts)
- Medical, accounting, or any licensed profession

### Voice: Builder, Not Domain Expert
Credibility comes from **building for** experts, not being them.

**Hook patterns to use:**
- "I was talking with a client in [industry]..."
- "Interesting take from a [title] I work with..."
- "While building [system] for a [client type]..."
- "After working with X clients in Y space..."
- "Everyone says X, but here's what I've seen building..."

**Red flags to reject:**
- "As experts in [domain outside our lane]..."
- "We advise clients to [domain-specific guidance]..."
- Any claims implying credentials we don't hold

**Chris and Haven enforce this on all content.**

## Communication Standards
- Slack #cerebro-alerts: Critical issues only
- Slack #project-updates: Daily status, non-critical updates
- Email escalation: Only for client-facing issues and CEO-level concerns

## File Organization
- Specs live in `.specify/features/<project-name>/`
- Skills live in `.claude/skills/<category>/<agent-name>/`
- Learnings live in `.specify/memory/learnings/`
- Reports live in `.specify/memory/reports/`

## Weekly Rhythms
- Friday: All project leads submit status reports
- Monday: Drew publishes consolidated weekly status
- Daily: Health checks run automatically
