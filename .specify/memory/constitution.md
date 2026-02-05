<!--
Sync Impact Report
==================
Version change: 1.0.0 → 1.1.0
Added sections:
  - VII. Agent Hierarchy
  - VIII. Channel Ownership
  - IX. Performance Standards
  - X. Learning Standards
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ (compatible)
  - .specify/templates/spec-template.md ✅ (compatible)
  - .specify/templates/tasks-template.md ✅ (compatible)
Follow-up TODOs:
  - Create agent skills in .claude/skills/staff/, .claude/skills/leads/, .claude/skills/workers/
  - Initialize learnings files in .specify/memory/learnings/
  - Set up project registry in .specify/memory/projects/
-->

# Content Creation Second Brain Constitution

A modular Claude Code skill system for knowledge management and content creation, inspired by [second-brain-skills](https://github.com/coleam00/second-brain-skills).

## Core Principles

### I. Skill-First Architecture

Every capability MUST be implemented as a self-contained Claude Code skill.
- Skills live in `.claude/skills/<skill-name>/` with standardized structure
- Each skill has a `SKILL.md` with YAML frontmatter defining triggers and metadata
- Skills MUST be independently usable—no hidden dependencies between skills
- Resource files (scripts, templates, references) live in skill-specific `Resources/` directories
- Slash commands (e.g., `/create-post`, `/generate-carousel`) map to skill invocations

### II. Progressive Disclosure (NON-NEGOTIABLE)

Context is precious—load only what's needed, when it's needed.
- Skill metadata (triggers, description) MUST always be in context
- Detailed instructions, scripts, and resources load on-demand when skill is invoked
- Never dump entire knowledge bases into prompts
- Use file references and lazy loading patterns for large content
- Target: <2000 tokens per skill until explicitly invoked

### III. Brand Consistency

Brand identity is defined once and flows everywhere.
- `brand.json` is the single source of truth for visual identity (colors, fonts, logos)
- `tone-of-voice.md` defines voice, personality, and communication style
- `brand-system.md` provides comprehensive brand guidelines
- All content-generating skills MUST read and apply brand files
- Changes to brand files propagate automatically to all dependent skills

### IV. Knowledge Organization

Knowledge MUST be structured for retrieval and reuse.
- Content organized by type: `content/posts/`, `content/carousels/`, `content/videos/`, etc.
- Metadata files accompany content for searchability and relationships
- Use consistent naming: `YYYY-MM-DD-slug.md` for dated content
- Tag taxonomy defined in `content/taxonomy.md`
- Cross-references use wiki-style links: `[[related-topic]]`

### V. Integration-Ready

External tools connect via standard protocols.
- MCP (Model Context Protocol) is the primary integration pattern
- MCP server configs live in `.claude/mcp-servers/`
- Credentials stored in environment variables or secure config, never in code
- Document tool quirks and gotchas in skill-specific CLAUDE.md sections
- Supported integrations: Zapier, n8n, Supabase, GitHub, Notion (via MCP)

### VI. Content Pipeline

Content flows through defined stages with quality gates.
- **Ideation** → **Draft** → **Review** → **Polish** → **Publish** → **Repurpose**
- Each stage has clear entry/exit criteria
- Drafts MUST include metadata frontmatter (title, tags, status, target platform)
- Review stage requires brand voice validation
- Repurposing transforms one piece into multiple formats (blog → carousel → video script)

---

## VII. Agent Hierarchy (NON-NEGOTIABLE)

### VII.I Hierarchy Structure

The digital business operates with a clear hierarchy:

| Level | Role | Authority |
|-------|------|-----------|
| 5 | CEO (Michael) | Full authority, strategic oversight, final approvals |
| 4 | Senior Staff | Management, specialized roles, limited delegation |
| 3 | Project Leads | Project-specific ownership and accountability |
| 2 | Workers | Discipline-specific execution |

### VII.II Authority Flow

- CEO can assign directly to any agent (override authority)
- Senior Staff request workers via Drew (PM) except for defined exceptions
- Project Leads request workers via Drew (PM)
- Workers execute assigned tasks only

### VII.III Task Routing

**All task requests flow through Drew (PM)** for tracking and prioritization.

**Exceptions (no Drew routing needed)**:
- Jenna → Rex (git cleanup is immediate)
- Jenna → Sage (documentation updates)
- Emergency escalations bypass routing
- CEO direct assignments

### VII.IV Agent Files

Every agent MUST have:
- Skill file: `.claude/skills/<category>/<agent-name>/SKILL.md`
- Learnings file: `.specify/memory/learnings/<agent-name>-learnings.md`

### VII.V Startup Protocol

Every agent session MUST begin with:
1. Load this constitution
2. Read own learnings.md file
3. Check shared-learnings.md for cross-agent updates
4. Begin task with preserved context

### VII.VI Shutdown Protocol (MANDATORY - NO EXCEPTIONS)

Every agent session MUST end with **ALL** of the following:

1. **Log Time Entry to Airtable** (via Tab or direct MCP)
   - Entry Date, Agent, Project, Hours, Description, Tokens Used
   - This is NON-NEGOTIABLE - no session ends without logging

2. **Log Task to Airtable** (if applicable)
   - Any deliverable, multi-step work, or trackable outcome

3. **Update Learnings File**
   - New patterns discovered → add to learnings.md
   - Mistakes made → document in Critical Mistakes section
   - Integration gotchas → add to Integration Gotchas section

4. **Update Shared Learnings** (if cross-agent impact)
   - Discoveries that affect other agents go in shared-learnings.md

5. **Create SOP Draft** (if new repeatable process discovered)
   - Sage creates Notion SOP for any process done 3+ times
   - Tag for weekly review by Drew

6. **Report Completion**
   - Confirm task status in any tracking system
   - Escalate blockers if task incomplete

---

## VIII. Channel Ownership (NON-NEGOTIABLE)

### VIII.I Social Channels

| Channel | Primary Owner | Deployment Authority | Automation |
|---------|---------------|---------------------|------------|
| LinkedIn | Haven, Chris | Haven | n8n → LinkedIn API |
| Instagram | Trinity, Haven | Haven | n8n → Meta API |
| YouTube | Spike, Chris | Spike | Remotion → upload workflow |
| TikTok | Haven | Haven | n8n → TikTok API |

**Deployment Authority**: Agent authorized to execute posting (manual or via automation).

### VIII.II Workflow Channels

| Channel | Owner | Health Check Owner | Monitoring |
|---------|-------|-------------------|------------|
| n8n Pipelines | Neo | Neo | Daily health audit (6am) |
| Airtable Bases | Tab | Drew | Manual review |
| Notion Spaces | Sage | Drew | Manual review |
| Supabase DBs | Tab, Ada | Drew | Manual review |

**Neo owns n8n health monitoring** ("you build it, you run it").

### VIII.III Communication Channels

| Channel | Owner | Routing |
|---------|-------|---------|
| Slack #cerebro-alerts | Echo | Critical → Immediate |
| Slack #project-updates | Echo | Status → Daily |
| Gmail Inbox | Iris | Triage → Priority |
| Client Comms | Risa, Iris | Escalation → Drew |

### VIII.IV Cloud Storage

| Channel | Owner | Purpose |
|---------|-------|---------|
| Google Drive (TIN Digital Assets) | Iris | Asset storage, delivery |

Iris manages Google Workspace (Gmail + Drive) via MCP integration.

### VIII.IV Channel Escalation

- Critical issues: #cerebro-alerts (immediate notification)
- Status updates: #project-updates (daily batch)
- Client SLA breach: Escalate to Drew within 1 hour

---

## IX. Performance Standards (NON-NEGOTIABLE)

### IX.I Project Standards

Every project MUST:
- Have an assigned Project Lead
- Target minimum 4 hours/week
- Submit weekly status report (Friday)

### IX.II Spec Kit Documentation (MANDATORY - NO EXCEPTIONS)

**Documentation is the source of truth for continuity across sessions.**

Every feature/project MUST have a complete spec kit in `.specify/features/<project-name>/`:

| File | Purpose | Owner |
|------|---------|-------|
| `spec.md` | User stories, requirements, success criteria | Drew creates before work starts |
| `plan.md` | Implementation approach, timeline, dependencies | Drew creates after spec approved |
| `tasks.md` | Task breakdown with IDs, agents, status checkboxes | Drew maintains throughout project |

**Rules**:
1. **No spec kit = No work starts** - Drew MUST verify files exist before delegating
2. **Tasks must be checkable** - Use `- [ ]` format for tracking completion
3. **Status updates go in tasks.md** - Mark completed with `- [x]` and date
4. **Session continuity** - Any agent picking up work reads spec kit first
5. **Drew owns documentation** - PM is accountable for spec kit completeness

**Why This Matters**:
- Sessions crash. Context gets lost. .md files persist.
- Agents cannot work without documented tasks
- No file = no proof of work
- Handoffs require exact pickup points

### IX.III Airtable as Cloud Dashboard (MANDATORY)

**Local .md files = session continuity. Airtable = cloud access when traveling.**

Every deliverable MUST be logged to the **Deliverables table** (`YOUR_DELIVERABLES_TABLE_ID`):

| Field | Purpose |
|-------|---------|
| Name | Deliverable title |
| Type | LinkedIn Post, Video, Graphic, Document, Workflow, etc. |
| Project | Link to Projects table |
| Status | Draft / Ready / Published / Archived |
| Content | Actual content (for text deliverables) |
| Local Path | Reference to local file |
| File URL | Cloud-hosted link (when available) |
| UTM Link | Tracking URL (if applicable) |
| Created By | Link to Agents table |
| Google Drive URL | Direct link to asset in Drive |
| Drive Folder | Folder path in Drive |
| Upload Status | Pending / Uploaded / Failed |
| Uploaded By | Agent who uploaded to Drive |
| Upload Date | DateTime of upload |

#### Workflows Table (NEW)
| Field | Type | Purpose |
|-------|------|---------|
| Workflow ID | Single Line Text | n8n workflow identifier |
| Workflow Name | Single Line Text | Human-readable name |
| Project | Linked Record | Link to Projects table |
| Status | Single Select | Active, Inactive, Draft, Error, Disabled |
| Last Run | DateTime | Last execution timestamp |
| Last Run Status | Single Select | Success, Failed, Warning |
| Error Message | Long Text | Last error details |
| Blockers | Long Text | Current blockers |
| Success Rate (7d) | Percent | 7-day success rate |
| Health Score | Formula | Calculated health (0-100) |
| Last Audit | DateTime | Last health audit timestamp |

#### Publishing Calendar Table (NEW)
| Field | Type | Purpose |
|-------|------|---------|
| Deliverable | Linked Record | Link to Deliverables table |
| Platform | Single Select | LinkedIn, Instagram, TikTok, YouTube |
| Scheduled Date | DateTime | When to publish |
| Status | Single Select | Draft, Scheduled, Approved, Published, Failed |
| Post URL | URL | Live post URL after publishing |
| Owner Agent | Linked Record | Link to Agents table |

**Rules**:
1. After creating ANY deliverable, agent MUST add record to Deliverables table
2. Text content (posts, copy) goes directly in Content field
3. Binary files (video, images) get Local Path + File URL when cloud-hosted
4. CEO can access all assets from Airtable when traveling

### IX.IV Health Score Thresholds

| Score | Status | Action |
|-------|--------|--------|
| 80-100 | Green | Continue normal operations |
| 60-79 | Yellow | Monitor closely, address blockers |
| 0-59 | Red | Escalate to CEO, immediate action |

### IX.III Time & Task Tracking (MANDATORY - NO EXCEPTIONS)

**Airtable is the single source of truth for all agent work.**

Every agent MUST log to Airtable **immediately upon completing any work**:

#### Time Entries Table (YOUR_TIME_ENTRIES_TABLE_ID)
| Field | Required | Description |
|-------|----------|-------------|
| Entry Date | ✅ | Date of work (YYYY-MM-DD) |
| Agent | ✅ | Linked record to Agents table |
| Project | ✅ | Linked record to Projects table |
| Hours | ✅ | Decimal hours (e.g., 0.05 for 3 minutes) |
| Description | ✅ | What was done |
| Tokens Used | ✅ | Total tokens consumed (input + output) |
| Task | Optional | Linked record to Tasks table |

#### Tasks Table (YOUR_TASKS_TABLE_ID)
Create a task record for any work that:
- Takes more than 5 minutes
- Produces a deliverable
- Involves multiple steps
- Should be tracked for project health

#### Enforcement
- **NO agent session ends without Airtable logging**
- Tab is the designated logger - other agents request Tab to log if MCP unavailable
- If Airtable is unreachable, log to `.specify/memory/projects/time-log.json` as fallback AND create a follow-up task to sync to Airtable

#### Token Tracking
Every agent MUST track and report:
- Input tokens consumed
- Output tokens generated
- Total tokens for the session
- This data goes in the Time Entries "Tokens Used" field

#### Airtable Reference (Configure Your Own)
```
Base ID: YOUR_BASE_ID
Tables:
  - Agents: YOUR_AGENTS_TABLE_ID
  - Projects: YOUR_PROJECTS_TABLE_ID
  - Time Entries: YOUR_TIME_ENTRIES_TABLE_ID
  - Tasks: YOUR_TASKS_TABLE_ID
  - Escalations: YOUR_ESCALATIONS_TABLE_ID
  - KPI Tracking: YOUR_KPI_TABLE_ID
  - Weekly Reports: YOUR_REPORTS_TABLE_ID
```

### IX.IV Weekly Reporting

Every Friday:
1. Project Leads submit status to Drew
2. Drew compiles consolidated report
3. Report includes: health scores, time allocation, escalations, next week priorities

### IX.V KPI Accountability

**Senior Staff**:
- Jenna: 95%+ file organization, git hygiene
- Drew: 90%+ projects at target, health scores avg
- Patricia: 95%+ DEA deliverables, data quality
- Risa: 99%+ invoice accuracy
- Chris: 3+ content pieces/week, 95%+ brand compliance

**Workers**:
- All workers tracked on domain-specific KPIs
- KPIs defined in individual SKILL.md files
- Weekly review by Drew

---

## X. Learning Standards (NON-NEGOTIABLE)

### X.I Slower is Faster Principle

**Quality over speed. Methodical execution beats rushed mistakes.**

- Every task done wrong must be done again—and costs more the second time
- When uncertain, stop and verify before proceeding
- "Almost right" is wrong. Precision matters
- Take time to understand before acting

### X.II Context Preservation

- Every agent MUST read their learnings.md on startup
- Every agent MUST write new learnings before session end
- Mistakes MUST be documented with root cause and prevention
- Context-heavy information MUST be externalized to files, not kept in prompts

### X.III Knowledge Hierarchy

| Source | Purpose | Manager |
|--------|---------|---------|
| Constitution | Non-negotiable principles | CEO |
| Notion SOPs | Approved processes, playbooks | Sage |
| Local learnings.md | Agent-specific patterns, mistakes | Each agent |
| Specs | Project-specific requirements | Project Leads |

### X.IV Feedback Loops (MANDATORY)

#### After EVERY Task (No Exceptions)
1. **Time Entry** → Airtable Time Entries table
2. **Tokens Used** → Logged in Time Entry
3. **Learnings** → Update agent's learnings.md if anything new discovered
4. **Errors** → Document in Critical Mistakes section immediately

#### After Significant Work (>15 min or new process)
1. **Task Record** → Airtable Tasks table
2. **SOP Candidate** → Flag for Sage if process is repeatable
3. **Shared Learning** → Update shared-learnings.md if cross-agent impact

#### Weekly (Friday - Drew Coordinates)
1. Review all agent learnings.md files for patterns
2. Identify SOP candidates (3+ occurrences)
3. Assign Sage to create/update SOPs
4. Health check on all projects

#### Monthly (First Monday - CEO Review)
1. Promote validated SOPs to Notion
2. Archive outdated learnings
3. Review constitution for needed updates

#### Quarterly (CEO + Senior Staff)
1. Constitution amendment review
2. Agent performance review
3. Process optimization audit

### X.V Reasoning Standards

- Think step-by-step before acting
- State assumptions explicitly
- Verify before modifying
- Never guess at critical values—confirm or ask
- Prefer reading existing code over assumptions about it

### X.VI Token Efficiency

- Externalize repetitive context to files
- Load only what's needed (progressive disclosure)
- Write learnings to preserve across sessions
- Don't re-explain what's documented

### X.VII Learnings File Structure

```
.specify/memory/learnings/
├── <agent-name>-learnings.md  # Per-agent learnings
└── shared-learnings.md        # Cross-agent discoveries
```

### X.VIII Learnings File Template

```markdown
# [Agent Name] Learnings

## Last Updated: YYYY-MM-DD

## Critical Mistakes (NEVER REPEAT)
- [Date]: [What went wrong] → [What to do instead]

## Domain Patterns
- [Pattern name]: [Description and when to apply]

## Quick Reference
- [Frequently needed info that saves context tokens]

## Integration Gotchas
- [Service]: [Quirk or limitation discovered]

## Successful Approaches
- [Approach]: [Why it worked, when to use it]
```

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| AI Agent | Claude Code | Primary development and content creation agent |
| Skills | Claude Code Skills | Modular capability system |
| Presentations | python-pptx | PPTX generation for slides and carousels |
| Video | Remotion (React) | Programmatic video creation |
| Integration | MCP Protocol | External service connections |
| Storage | Local filesystem + Git | Version-controlled content repository |
| Database | Supabase (optional) | Structured data, analytics, publishing queue |

## Content Workflow Standards

### Supported Content Types

1. **Long-form** - Blog posts, articles, documentation
2. **Short-form** - Social posts, tweets, LinkedIn updates
3. **Visual** - Presentations, carousels, infographics
4. **Video** - Scripts, Remotion compositions, talking points
5. **Documentation** - SOPs, runbooks, process guides

### Quality Gates

- **Draft Exit**: Complete structure, core message defined, brand voice applied
- **Review Exit**: Fact-checked, grammar-verified, CTA present where appropriate
- **Polish Exit**: Optimized for platform, hashtags/SEO applied, visuals finalized
- **Publish Exit**: Scheduled or posted, analytics tracking configured

### Content Framing Standards (NON-NEGOTIABLE)

**Who We Are**: TIN builds SaaS/software, AI automation systems, and marketing content for clients. We are builders and integrators.

**Who We Are NOT**: We are not attorneys, financial analysts, medical professionals, or licensed experts in client domains. We do not give legal, financial, or domain-specific advice outside our expertise.

**Framing Principles**:

1. **Attribution Over Assertion**
   - GOOD: "I was talking with a client in legal tech the other day..."
   - GOOD: "Interesting take from a compliance officer I work with..."
   - BAD: "As experts in legal compliance, we recommend..."

2. **Observer Positioning**
   - We observe patterns across industries we build for
   - We share insights from conversations, not credentials
   - We translate complex problems into automation solutions

3. **Credibility Through Craft**
   - Our authority comes from building, shipping, solving
   - "We built this for a client who needed..." > "We advise clients to..."
   - Show the work, not the diploma

4. **Conversational & Contrarian Hooks**
   - Lead with human stories, not corporate speak
   - Challenge conventional thinking when earned
   - "Everyone says X, but here's what I've seen building for Y..."

5. **Vague But Specific**
   - Reference real interactions without exposing clients
   - "A fintech founder told me..." (specific person type, vague identity)
   - "While building an intake system for a law firm..." (specific work, vague client)

**Content Review Checkpoint**:
Before publishing, verify:
- [ ] No claims of expertise we don't hold
- [ ] Insights attributed to appropriate sources
- [ ] Positioned as builder/observer, not domain expert
- [ ] Human story or conversation as hook

### Platform-Specific Constraints

| Platform | Max Length | Format | Cadence |
|----------|-----------|--------|---------|
| LinkedIn Post | 3000 chars | Text + optional image/carousel | Define in brand-system |
| LinkedIn Carousel | 10 slides | PDF (1:1 ratio) | Define in brand-system |
| Twitter/X | 280 chars | Text + optional media | Define in brand-system |
| Blog | No limit | Markdown → HTML | Define in brand-system |
| YouTube | Script varies | Remotion or script | Define in brand-system |

## Governance

This constitution supersedes all other development practices for this project.

### Amendment Process

1. Propose change with rationale in a GitHub issue or spec document
2. Evaluate impact on existing skills and content
3. Update constitution with version bump
4. Propagate changes to affected templates and skills
5. Document migration steps if breaking changes

### Version Policy

- **MAJOR**: Principle removal, architectural shift, breaking skill changes
- **MINOR**: New principle added, new content type supported, skill additions
- **PATCH**: Clarifications, typo fixes, non-breaking refinements

### Compliance

- All new skills MUST pass constitution check before merge
- PRs modifying skills require verification against Principles I-X
- Content created via skills MUST include brand attribution in metadata
- Quarterly review of skill usage and constitution alignment

**Version**: 1.1.0 | **Ratified**: 2026-02-03 | **Last Amended**: 2026-02-04
