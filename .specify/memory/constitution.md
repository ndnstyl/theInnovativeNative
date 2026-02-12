# Content Creation Second Brain Constitution

**Version**: 2.0.0 | **Ratified**: 2026-02-06

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

---

## MANDATORY: Handoff Protocol

Base Claude Code plans, agents execute.

1. Spec kit completion -> /handoff -> Airtable Tasks -> Agent execution
2. No execution without formal assignment
3. Drew must have visibility on all work

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

## Agent Hierarchy (Consolidated v2.0)

| Level | Role |
|-------|------|
| 5 | CEO (Michael) - Full authority |
| 4 | Senior Staff (Mike, Drew, Jenna, Chris, Patricia) |
| 3 | Project Leads - Lightweight context files |
| 2 | Workers (Builder, Data, Creative, Comms, Ads) |

All task requests flow through Drew except:
- Jenna -> Builder/Comms (direct for cleanup/docs)
- CEO direct assignments
- Emergency escalations

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

1. **Startup**: Load constitution, read learnings, check shared-learnings
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
