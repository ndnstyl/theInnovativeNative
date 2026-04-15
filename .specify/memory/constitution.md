---
type: "constitution"
agent: "shared"
project: null
created: 2026-02-04
updated: 2026-04-03
tags: [process, governance, critical]
status: "active"
---

# Content Creation Second Brain Constitution

**Version**: 3.0.0 | **Ratified**: 2026-04-03

A modular Claude Code skill system for knowledge management and content creation.

---

## MANDATORY: Airtable Logging

**If it's not in Airtable, it didn't happen.**

| What | Table | When |
|------|-------|------|
| Time Entry | Time Entries | EVERY session |
| Task | Tasks | If >5min OR deliverable |
| Deliverable | Deliverables | Every file/content created |

Every session MUST log: Entry Date, Agent, Project, Hours, Description, Tokens Used.

---

## MANDATORY: Cloud Asset Upload

**Every file deliverable MUST be uploaded to Google Drive.**

1. Upload to: `TIN Marketing > [Project] > [Month Year]`
2. Set sharing: "Anyone with link can view"
3. Add URL to Airtable Deliverables table

No deliverable is complete without a Google Drive URL.

---

## MANDATORY: Database Safety

**Check existing data before migrations.**
- Never blindly overwrite schemas
- Verify before modifying

---

## MANDATORY: Airtable Schema Governance

**No new tables without CEO approval.**

1. **Agents MUST NOT create new Airtable tables.** Propose additions via Drew for CEO sign-off.
2. **Extend before creating.** Before proposing a new table, identify which existing table can be extended with 1-3 fields.
3. **Field budgets.** Adding more than 3 fields to an existing table also requires approval.
4. **One-off tracking does NOT need Airtable.** Single events or short-term metrics go in Notes fields on existing records or local markdown — not new tables.

---

## MANDATORY: n8n Workflow Rules

- NEVER test workflows with Apify HTTP nodes
- ONLY user tests n8n workflows
- Verify webhook URLs before deployment
- **NEVER commit raw n8n workflow JSON exports to git.** n8n exports often contain credential VALUES as literal strings inside `parameters.queryParameters`, `headerParameters`, hardcoded token literals in Code nodes, or inline URL query params. The n8n `credentials` object field references the cred by ID (safe) — but the parameter body often has the raw token anyway. Before ANY workflow JSON lands in a tracked path:
  1. Run the pre-commit scanner (`scripts/hooks/pre-commit-secret-scan.sh` — installed)
  2. If a backup/snapshot is needed, write to `/tmp/` or a `.gitignored` directory
  3. If shipping to a tracked path, explicitly scrub every `value`, `apiKey`, `accessToken`, `password`, `Bearer …` literal via regex replace → `__REDACTED_TOKEN__` before staging
- **Rotate tokens when surfaced.** If a token appears in any git log (even orphaned commits), assume it's compromised. Revoke + regenerate — no exceptions. GitGuardian and equivalent bots index within minutes.

---

## MANDATORY: MCP-First Credential Resolution

**Before triggering ANY system auth prompt (keychain, browser OAuth, shell login, password dialog), Claude MUST first check `~/.claude/.mcp.json` for existing credentials.** OB1, skills, and learnings are built around MCP — bypassing it produces noise (keychain popups) and fragments credential storage.

### Procedure (run BEFORE any credentialed API call):
1. **Enumerate** — `python3` dump all `mcpServers[*].env` key names in `~/.claude/.mcp.json`
2. **Match** — look for a token whose name contains the target service (`GITHUB`, `AIRTABLE`, `SLACK`, `NOTION`, `SUPABASE`, `HOSTINGER`, etc.)
3. **If present** — use it; cache the VALUE in a session tmpfile with `umask 077` so subsequent calls skip the lookup
4. **If absent** — THEN and only then check alternative stores (keychain, `.netrc`, `.env` files, `~/.config/gh`), and flag the gap in a skills-gap memory so it gets wired into MCP next session

### Violations
- Triggering >1 identical keychain prompt in one session → cache it after first hit
- Hardcoding secrets in files checked into git → immediate rollback
- Calling a credentialed API without checking MCP first → back up, check MCP, redo

### When MCP is missing a credential
Add a follow-up task to:
1. Install the relevant MCP server (e.g., `github-mcp`, `stripe-mcp`) and restart session, OR
2. Add the env var to an existing server's config in `.mcp.json` if no server exists yet

**This rule applies to EVERY skill and agent that touches external systems.** Skills authored after 2026-04-15 MUST open with an "MCP access check" step.

---

## MANDATORY: Handoff Protocol (Two-Phase Gate)

Base Claude Code plans, agents execute. **No work starts without Drew's acknowledgment.**

### Phase 1: Handoff Request
1. Spec kit completion → `/handoff` → Airtable Tasks created → Drew notified

### Phase 2: Work Authorization (NEW — Prevents Misalignment)
2. **Drew reviews the handoff** and checks:
   - No file-scope conflicts with other active specs (see File-Scope Locking)
   - No overlapping spec kits for the same feature (see Unified Feature Ownership)
   - Agent capacity (via `/queue`)
   - All dependencies resolved
3. **Drew marks the task as "Authorized"** in Airtable
4. **Only then may the assigned agent begin work**

### Violations
- Agent starts work before Drew authorizes → **STOP immediately, log violation to Airtable Tasks with status "Violation"**
- Two agents working on overlapping files → **Both STOP, Drew resolves priority**
- Handoff without spec kit → **BLOCKED by Drew**

### CEO Direct Execution (P1 Override)
CEO is EXEMPT from the two-phase gate — P1 authority means pre-authorization is not required. However:
- CEO MUST notify Drew **within 1 hour** of starting work (not after completion)
- CEO MUST log time entry and task to Airtable same as any agent
- If CEO work overlaps an active spec's owned_paths, Drew is responsible for notifying the affected project lead
- Repeated CEO direct execution on the same feature signals a staffing gap → Drew escalates

---

## Shutdown Checklist

```
- [ ] Time Entry logged to Airtable
- [ ] Task logged (if >5min OR deliverable)
- [ ] Skills gaps noted in learnings.md
- [ ] Learnings updated (if new pattern/mistake)
- [ ] Deliverables uploaded to Google Drive
- [ ] Drew has visibility
```

**Failure to complete = critical violation.**

---

## MANDATORY: Enforcement Mechanism

**Compliance is structurally enforced, not honor-system.**

### Self-Check Before Session End

Every agent MUST run this verification before ending a session:

```bash
python3 -c "
import urllib.request, json, urllib.parse
from datetime import datetime

token = '<AIRTABLE_TOKEN>'
base = 'appTO7OCRB2XbAlak'
agent_id = '<YOUR_AGENT_RECORD_ID>'  # e.g. recANUnwKYsknrokD for Drew
today = datetime.now().strftime('%Y-%m-%d')

# Check: Do I have a time entry for today?
formula = f'AND({{Entry Date}} = \"{today}\", FIND(\"{agent_id}\", ARRAYJOIN(RECORD_ID(Agent))))'
url = f'https://api.airtable.com/v0/{base}/tbl4FrwRqV02j2TSK?filterByFormula={urllib.parse.quote(formula)}'
req = urllib.request.Request(url)
req.add_header('Authorization', f'Bearer {token}')
entries = json.loads(urllib.request.urlopen(req).read()).get('records', [])

if entries:
    print(f'OK: Time entry found for today ({len(entries)} entries)')
else:
    print('VIOLATION: No time entry for today. Log before ending session.')
"
```

### Handoff Compliance Gate

No `/handoff` executes without:
1. Time entry logged for the current session
2. All deliverables recorded in Airtable
3. Drew visibility confirmed

### Drew's Enforcement Authority

Drew (PM) can:
- **BLOCK** handoffs that fail compliance checks
- **FLAG** agents with zero time entries for > 3 consecutive days
- **ESCALATE** repeated violations to CEO
- **AUDIT** any agent's Airtable records at any time

---

## Core Principles

### Skill-First Architecture
Every capability as a self-contained Claude Code skill in `.claude/skills/`.

### Progressive Disclosure
Load only what's needed, when needed. Target <2000 tokens per skill.

### Brand Consistency
Brand identity defined in `brand.json`, `tone-of-voice.md`, `brand-system.md`.

### Content Framing
- We are **builders**, not domain experts
- Attribution over assertion
- Show the work, not the diploma

---

## Agent Hierarchy & Permission Tiers (v3.0)

Based on Anthropic's 6-mode permission model, each agent level maps to a specific permission tier that controls what they can read, modify, execute, and approve.

### Permission Tiers

| Tier | Anthropic Mode | Who | Can Do | Cannot Do |
|------|---------------|-----|--------|-----------|
| **P1 — Full Authority** | `bypassPermissions` | CEO (Michael) | Everything. Override any decision. Direct assign. | — |
| **P2 — Management** | `default` | Staff (Mike, Drew, Jenna, Chris, Patricia) | Assign workers, audit, approve within scope, modify files in their domain. Must confirm destructive ops. | Approve budget (Drew). Override CEO. Cross-domain file edits without coordination. |
| **P3 — Project Scope** | `acceptEdits` | Leads (Scales, Haven, Aurora, Trinity, Nigel, Ozhi, Muse) | Modify files ONLY within their project directory. Delegate to workers via Drew. | Cross-project file edits. Direct worker assignment (must go through Drew). Schema changes. |
| **P4 — Task Scope** | `dontAsk` | Workers (Builder, Data, Creative, Comms, Ads, Editor) | Execute ONLY pre-approved tools on assigned files/directories. Builder=n8n+scripts+git. Data=Airtable. Creative=media. Comms=docs+messaging. | Anything outside their tool scope. Unassigned files. Schema changes. Cross-worker file edits. |
| **P5 — Read Only** | `plan` | QA/Review role (any agent in review mode) | Read, analyze, report. Cannot modify any file or execute any command. | Edit, write, execute, deploy. |
| **P6 — Automated** | `auto` | Cron/scheduled agents | AI classifier decides per-action safety. In-project edits auto-approved. External/destructive actions blocked. | Force push, schema changes, production deploys, cross-project writes. |

### Permission Rules (Deny Always Wins)

Evaluation order for every agent action:
1. **Hooks** — Pre-action hooks run first (can allow/deny/pass)
2. **Deny rules** — If denied at any level, blocked regardless of other permissions
3. **Permission tier** — Apply the agent's tier from table above
4. **Allow rules** — Check explicit allowances
5. **Escalation** — If unresolved, escalate to Drew (workers) or CEO (staff)

### Delegated Execution (Resolves P3/P4 Gap)

Project leads (P3) own file paths but are lightweight context agents — they cannot execute complex code changes. Workers (P4) have the skills but are denied those paths by default. **Resolution:**

1. **Project lead requests worker via Drew.** Lead identifies what needs to change in their owned paths.
2. **Drew authorizes a scoped override.** Drew explicitly grants the worker temporary access to specific paths for a specific task. This is logged in the Airtable task description as: `"Scope override: Builder granted access to src/pages/classroom/* for task T-XXX"`
3. **Worker executes within the scoped override.** Only the authorized paths, only for that task.
4. **Override expires when task is marked complete.** Worker's access returns to default denied.

This prevents the P3/P4 dead zone where nobody can execute. The project lead maintains ownership, Drew maintains visibility, and the worker gets the access they need.

### Drew Absence Protocol

If Drew is unavailable for >4 hours:
1. **Mike (CMO)** acts as deputy PM for task routing
2. **Jenna** acts as deputy for compliance audits
3. If both unavailable → CEO direct authority applies
4. All deputy decisions are logged and reviewed by Drew on return

### Task Routing

All task requests flow through Drew except:
- Jenna → Builder (git cleanup ONLY — not feature work)
- Jenna → Comms (documentation ONLY — not feature work)
- CEO direct assignments
- Emergency escalations (must be logged retroactively)

**Jenna's direct delegation is LIMITED to maintenance tasks.** Any feature work, bug fixes, or spec kit execution MUST route through Drew to prevent parallel authority conflicts.

---

## MANDATORY: File-Scope Locking (Prevent Concurrent Modification)

**Two agents MUST NOT modify the same file or directory simultaneously.**

### How It Works

1. **Every spec kit MUST declare `owned_paths`** in its `spec.md` frontmatter:
   ```yaml
   owned_paths:
     - src/pages/classroom/*
     - src/components/classroom/*
     - src/styles/classroom/*
   ```

2. **Before an agent modifies a file**, check if another ACTIVE spec kit owns it:
   - Search all `spec.md` files in `.specify/features/` for `owned_paths`
   - If the file is claimed by another active spec → **STOP. Escalate to Drew.**
   - If unclaimed → proceed

3. **Conflict resolution** (when two specs need the same files):
   - Drew determines priority based on project deadlines
   - Lower-priority spec WAITS until higher-priority spec releases the path
   - CEO can override to allow concurrent work on same paths (explicit approval required)

4. **Path release**: When a spec kit moves to `status: complete`, its `owned_paths` are released.

### Why This Exists

On 2026-04-03, specs 031-skool-ui-overhaul and 032-skool-migration-mvp both modified `src/components/classroom/*` and `src/pages/classroom/*` simultaneously with no coordination. This caused a complete classroom refactor. **Never again.**

---

## MANDATORY: Unified Feature Ownership

**One project lead per feature surface area. No exceptions.**

### Rules

1. **One spec kit per feature.** If a feature needs multiple workstreams (UI + payments + AI agents), they are PHASES within a single spec kit — not separate spec kits.

2. **One owner per spec kit.** The designated project lead has final authority over all changes to that feature's files.

3. **No orphan specs.** Every spec kit in `.specify/features/` MUST have:
   - An `owner` field in the spec.md frontmatter (agent ID from roster)
   - A `project_lead` who is accountable for the unified deliverable
   - A link to the parent project in Airtable

4. **Spec consolidation rule.** If Drew discovers multiple spec kits covering the same feature surface:
   - STOP all work on those specs immediately
   - Merge into a single spec with phases
   - Assign one project lead
   - Resume only after consolidation is complete

5. **CEO execution rule.** When the CEO executes directly instead of delegating:
   - The work MUST still be logged to Airtable under the CEO's agent record
   - A time entry and task record are created the same as any agent
   - Drew MUST be notified so he maintains visibility
   - If ongoing CEO execution indicates a staffing gap, Drew escalates to propose a new agent or reassignment

### Why This Exists

Three separate spec kits (031-skool-ui-overhaul, 032-ai-community-agents, 032-skool-migration-mvp) all modified the classroom with no unified owner. QA was fragmented across 4 independent reviews. Critical payment bugs had no remediation owner. **This pattern is now prohibited.**

---

## MANDATORY: Coordinated QA

**One QA coordinator per feature. All findings consolidated. No independent reviews.**

### Rules

1. **Drew is the default QA coordinator** for all features unless he explicitly delegates to another agent.

2. **Before any QA review begins**, the reviewer MUST:
   - Check with Drew for existing QA assignments on that feature
   - Get assigned a QA scope (e.g., "accessibility only" or "payment flow only")
   - Know where to log findings (single consolidated file)

3. **All QA findings go into ONE file**: `qa/SUMMARY.md` within the spec kit directory. Individual review files (bugfix-review.md, wcag-review.md) are APPENDICES — the SUMMARY.md is the source of truth.

4. **Every critical/high bug MUST have**:
   - An owner (agent ID) assigned to fix it
   - A deadline
   - A status (open/in-progress/fixed/verified)

5. **No launch without QA sign-off.** Drew (or delegated coordinator) must mark the SUMMARY.md as `qa_status: approved` before any feature goes live.

6. **Post-QA gate**: After QA approval, any new changes to owned_paths require re-review.

---

## Channel Ownership

| Channel | Owner | Routing |
|---------|-------|---------|
| #cerebro-alerts | Comms | Critical -> Immediate |
| #project-updates | Comms | Status -> Daily |
| n8n Pipelines | Builder | Health audit 6am daily |
| Google Drive | Comms | Asset storage |

---

## Performance Standards

Every project MUST:
- Have assigned Project Lead
- Target 4 hours/week minimum
- Submit weekly status (Friday)

Every feature MUST have spec kit:
- `spec.md` - Requirements
- `plan.md` - Implementation approach
- `tasks.md` - Task breakdown

---

## Learning Standards

1. **Startup**: Load [[constitution]], read learnings, check [[shared-learnings]]
2. **Shutdown**: Log time, update learnings, document mistakes
3. **Weekly**: Drew reviews patterns, identifies SOP candidates
4. **Monthly**: CEO reviews, promotes SOPs to Notion

---

## Extended Documentation

For full details, see:
- Agent roster: `.specify/memory/agents/roster.json`
- Channel details: `.specify/sops/channel-ownership-sop.md`
- Content framing: Brand system files
- Handoff protocol: `.claude/skills/infrastructure/agent-handoff/SKILL.md`
