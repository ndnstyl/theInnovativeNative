# Second Brain Skills - Claude Code Instructions

## Overview

This is a multi-agent skill system for Claude Code, implementing a "second brain" architecture with hierarchical agents, feedback loops, and persistent learning.

## MANDATORY: Agent Protocol (Constitution Compliance)

### Startup Checklist (BEFORE ANY WORK)
1. Read `.specify/memory/constitution.md` - understand rules
2. Read `.specify/memory/learnings/shared-learnings.md` - learn from others' mistakes
3. Verify your integration connections (Airtable, Slack, etc.)
4. Identify which Project this work belongs to (or create one if new)

### Shutdown Checklist (BEFORE ENDING SESSION)
- [ ] Log Time Entry to your tracking system (Entry Date, Agent, Project, Hours, Description, Tokens)
- [ ] Log Task if work >5 min or produced deliverable
- [ ] Update `.specify/memory/learnings/shared-learnings.md` if lesson learned
- [ ] Verify PM (Drew) has visibility on completed work

### Critical Rule
**Local .md files are for planning. Your tracking system is for visibility.**
Drew only sees the tracking system. If it's not logged there, it doesn't exist to Drew.

---

## Airtable Quick Reference (CONFIGURE YOUR OWN)

```
Base: YOUR_BASE_NAME (YOUR_BASE_ID)
API Token: YOUR_API_TOKEN (store securely, never commit)

Key Tables (create these in your base):
- Projects: YOUR_PROJECTS_TABLE_ID
- Tasks: YOUR_TASKS_TABLE_ID
- Time Entries: YOUR_TIME_ENTRIES_TABLE_ID
- Agents: YOUR_AGENTS_TABLE_ID
- Deliverables: YOUR_DELIVERABLES_TABLE_ID

Key Agent Record IDs (populate after creating agents):
- Drew (PM): YOUR_DREW_RECORD_ID
- Tab (Airtable): YOUR_TAB_RECORD_ID
- CEO: YOUR_CEO_RECORD_ID
```

---

## Project Structure

```
.specify/
├── memory/
│   ├── constitution.md      # Source of truth for all rules
│   ├── escalation-matrix.json # Escalation triggers and routing
│   ├── agents/
│   │   └── roster.json      # Agent definitions
│   ├── learnings/           # Cross-agent lessons
│   │   ├── shared-learnings.md
│   │   └── <agent>-learnings.md
│   └── projects/
│       └── registry.json    # Project definitions
├── features/                # Feature spec kits (spec.md, plan.md, tasks.md)
├── templates/               # Spec kit templates
└── sops/                    # Standard operating procedures

.claude/
└── skills/                  # Agent skill definitions
    ├── staff/               # Senior staff (Level 4)
    ├── leads/               # Project leads (Level 3)
    ├── workers/             # Workers (Level 2)
    └── infrastructure/      # System skills
```

---

## Quick Setup for Your Deployment

1. **Clone this repo**
2. **Configure your Airtable base** (or other tracking system)
3. **Update this CLAUDE.md** with your real IDs (keep this file in .gitignore or use env vars)
4. **Customize agent names** in `.claude/skills/` to match your team
5. **Update constitution** with your specific rules
6. **Create your project registry** in `.specify/memory/projects/registry.json`

---

## Integration Notes

- n8n: Never test workflows with Apify HTTP nodes (user tests manually)
- Airtable: Always check existing data before schema changes
- Database migrations: Check existing data first
- MCP servers: Configure in your Claude Code settings

---

## Key Principles

1. **Constitution First** - Load on every startup
2. **Slower is Faster** - Quality over speed
3. **No Spec Kit = No Work** - Document before executing
4. **Feedback Loops** - Log learnings after every session
5. **Visibility** - If it's not logged, it doesn't exist
