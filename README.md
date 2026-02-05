# Second Brain Skills for Claude Code

A modular multi-agent skill system for Claude Code, implementing a "second brain" architecture with hierarchical agents, feedback loops, and persistent learning.

Inspired by [second-brain-skills](https://github.com/coleam00/second-brain-skills).

## What This Is

This is a **template** for building a team of AI agents that:
- Follow a constitution (rules and principles)
- Learn from mistakes and share knowledge
- Route tasks through a hierarchy
- Log their work for visibility
- Maintain persistent memory across sessions

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      CEO (Level 5)                          │
│                    Strategic Oversight                       │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                  Senior Staff (Level 4)                      │
│   Drew (PM) │ Jenna (Ops) │ Patricia (QA) │ Chris (Content) │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                  Project Leads (Level 3)                     │
│       Haven │ Trinity │ Aurora │ Muse │ Scales │ etc.       │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                     Workers (Level 2)                        │
│  Tab (Airtable) │ Neo (n8n) │ Spike (Video) │ Rex (Git)    │
│  Sage (Notion) │ Ada (Python) │ Echo (Slack) │ etc.        │
└─────────────────────────────────────────────────────────────┘
```

## Key Features

### 1. Constitution-Driven
Every agent follows a single source of truth (`.specify/memory/constitution.md`) that defines:
- Non-negotiable principles
- Task routing rules
- Performance standards
- Learning requirements

### 2. Feedback Loops
```
Startup → Load Constitution → Load Learnings → Do Work → Update Learnings → Log Time → Shutdown
```

Every agent must:
- Read the constitution on startup
- Check shared learnings before starting
- Document new patterns discovered
- Log all work to the tracking system

### 3. Persistent Learning
```
.specify/memory/learnings/
├── shared-learnings.md      # Cross-agent discoveries
├── drew-learnings.md        # Drew's personal learnings
├── tab-learnings.md         # Tab's personal learnings
└── ...                      # Each agent has their own file
```

### 4. Spec Kit Model
Every feature/project requires documentation:
- `spec.md` - Requirements and success criteria
- `plan.md` - Implementation approach
- `tasks.md` - Task breakdown with status

**No spec kit = No work starts**

## Quick Start

### 1. Clone and Configure

```bash
git clone https://github.com/YOUR_USERNAME/second-brain-skills.git
cd second-brain-skills
```

### 2. Set Up Your Tracking System

Create an Airtable base (or use another system) with these tables:
- **Agents** - Your agent roster
- **Projects** - Active projects
- **Tasks** - Work items
- **Time Entries** - Time tracking
- **Deliverables** - Outputs

### 3. Configure CLAUDE.md

Update `CLAUDE.md` with your:
- Airtable Base ID
- Table IDs
- API Token (keep secure!)
- Agent Record IDs

### 4. Customize Your Agents

Edit the skill files in `.claude/skills/` to match your needs:
- Rename agents
- Adjust responsibilities
- Add/remove workers

### 5. Update the Constitution

Modify `.specify/memory/constitution.md` with your:
- Specific principles
- Channel ownership
- Performance standards
- Learning requirements

## Directory Structure

```
.
├── CLAUDE.md                    # Claude Code instructions (your config)
├── .gitignore                   # Excludes sensitive/personal data
│
├── .claude/
│   └── skills/                  # Agent skill definitions
│       ├── staff/               # Senior staff (Level 4)
│       │   ├── drew-project-manager/
│       │   ├── patricia-dea-lead/
│       │   └── ...
│       ├── leads/               # Project leads (Level 3)
│       │   ├── haven-asliceofhaven/
│       │   └── ...
│       ├── workers/             # Workers (Level 2)
│       │   ├── tab-airtable/
│       │   ├── neo-n8n/
│       │   └── ...
│       └── infrastructure/      # System skills
│
└── .specify/
    ├── memory/
    │   ├── constitution.md      # Source of truth
    │   ├── escalation-matrix.json
    │   ├── agents/
    │   │   └── roster.json
    │   ├── learnings/           # Agent learning files
    │   └── projects/
    │       └── registry.json
    ├── features/                # Your project specs
    ├── templates/               # Spec kit templates
    └── sops/                    # Standard operating procedures
```

## Agent Types

### Staff (Level 4)
| Agent | Role | Responsibilities |
|-------|------|------------------|
| Drew | Project Manager | Task routing, QA, health checks, weekly reports |
| Patricia | QA Lead | Quality assurance, reviews all worker completions |
| Jenna | Office Manager | File organization, git hygiene, scheduling |
| Chris | Storyteller | Content creation, brand voice enforcement |
| Risa | Finance | Invoicing, financial tracking |

### Workers (Level 2)
| Agent | Domain | Integration |
|-------|--------|-------------|
| Tab | Airtable | airtable-mcp |
| Neo | n8n Workflows | n8n-mcp |
| Spike | Video (Remotion) | Remotion framework |
| Rex | Git Operations | GitHub CLI |
| Sage | Documentation | notion-mcp |
| Ada | Python Scripts | Python runtime |
| Echo | Slack | slack-mcp |
| Iris | Google Workspace | google-drive-mcp |
| Maya | Content Ideation | - |
| Cash | Stripe/Billing | stripe-mcp |
| Cal | Calendar | google-calendar-mcp |

## Usage Examples

### Invoke an Agent
```
@drew check project health
@tab create a new record in the Projects table
@neo build a webhook workflow
@patricia review the last completed task
```

### Routing Rules
- All task requests flow through Drew (PM)
- Exceptions: Jenna→Rex (git), Jenna→Sage (docs), Risa→Cash (billing)
- CEO can assign directly to anyone

## Contributing

PRs welcome! Please:
1. Follow the skill structure conventions
2. Include learnings documentation
3. Update the constitution if adding new principles
4. Test your changes

## License

MIT

## Credits

- Inspired by [coleam00/second-brain-skills](https://github.com/coleam00/second-brain-skills)
- Built for [Claude Code](https://claude.ai/claude-code)
