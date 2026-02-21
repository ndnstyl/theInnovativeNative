# Second Brain Skills - Claude Code Instructions

## ⛔ HARD RULES — NEVER VIOLATE ⛔

### BowTie Bullies / EP-001 Image Generation

1. **NEVER include "Red Nose Pitbull", "Pitbull", "Tyrone", or ANY character reference in text-to-image prompts.** The main character is ALWAYS composited from pre-made canonical PNG assets. Text-to-image (Gemini) NEVER generates the character. Every prompt function MUST strip character references. This has been violated 3+ times — it is the #1 priority rule.

2. **NEVER include "vignette" in any text-to-image prompt.** Vignette is trivial to add in Premiere Pro but extremely hard to remove when it detracts. All vignette must be post-production only.

3. **NEVER include style directives (cel-shaded, film grain, palette) in pipeline visual_prompt fields.** Style is assembled from structured slots in the scene-prep workflow. Pipeline prompts describe STORY CONTENT only.

---

## Overview

This is a multi-agent skill system for Claude Code, implementing a "second brain" architecture with hierarchical agents, feedback loops, and persistent learning.

## ⛔ MANDATORY: Agent Protocol (Constitution Compliance) ⛔

### THIS IS NON-NEGOTIABLE - EVERY AGENT, EVERY SESSION

### Startup Checklist (BEFORE ANY WORK)
1. Read `.specify/memory/constitution.md` - understand rules
2. Read `.specify/memory/learnings/shared-learnings.md` - learn from others' mistakes
3. Verify your integration connections (Airtable, Slack, etc.)
4. Identify which Project this work belongs to (or create one if new)

### Shutdown Checklist (BEFORE ENDING SESSION) - ALL ITEMS REQUIRED
- [ ] **Time Entry** → Airtable Time Entries table (Entry Date, Agent, Project, Hours, Description, Tokens)
- [ ] **Task** → Airtable Tasks table (if work >5 min OR produced deliverable)
- [ ] **Skills Gaps** → Your learnings.md (if any capability was missing)
- [ ] **Learnings** → Update if new pattern/mistake/gotcha discovered
- [ ] **Shared Learnings** → Update if cross-agent impact
- [ ] **Drew Visibility** → Verify PM can see your completed work in Airtable

### Critical Rules
1. **If it's not in Airtable, it didn't happen.** Drew only sees Airtable. CEO only sees Airtable.
2. **Local .md files are for planning.** Airtable is for visibility and accountability.
3. **Even 5-minute sessions get logged.** No work is too small to track.
4. **Skills gaps feed training priorities.** If you lacked a capability, log it.

### Historical Failure (2026-02-04)
A session created 9 Airtable tables but logged NOTHING to tracking. Drew had zero visibility. This caused downstream planning failures. **This must NEVER happen again.**

### Enforcement
Agents who skip logging are broken agents. The shutdown checklist is not optional.

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
    ├── knowledge/           # Domain knowledge skills
    │   ├── 3d-web-experience/   # Spline, Three.js, R3F, WebGL, Spell AI
    │   └── frontend-design/     # Anti-slop UI/UX, GSAP, typography, layout
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

- **⛔ n8n: Local workflow JSON is USELESS. If it's not deployed to the live n8n instance, it doesn't exist.** Always deploy via n8n API after any workflow change. n8n work MUST be handed off to Builder agent (the n8n domain expert), not done inline by the orchestrator.
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

## Active Technologies
- N/A (content products + no-code integrations) + Stan Store (storefront), PPTX Generator skill (PDF creation), n8n (webhook pipeline), Airtable (lead tracking) (002-stan-store-lawfirm-funnel)
- Airtable (lead records), Google Drive (deliverable PDFs), Stan Store (product hosting) (002-stan-store-lawfirm-funnel)
- Gemini API (image generation + scoring), Google Drive API (storage), Airtable API (mission control), FFMPEG (video assembly) (003-haven-ugc-broll)
- Airtable (pipeline state) + Google Drive (media files) (003-haven-ugc-broll)
- JavaScript (n8n Code nodes) + FFMPEG (CLI on n8n server) + n8n workflow engine, Kie.AI API (NBP + Veo 3.1), n8n Basic LLM Chain (Groq), Google Drive API, Airtable API (008-tiny-home-timelapse)
- Airtable (state management), Google Drive (asset storage) (008-tiny-home-timelapse)

## Knowledge Skills
- **3d-web-experience**: Spline (variables, webhooks, real-time API, Spell AI, MCP server), Three.js, React Three Fiber, R3F+Spline hybrid, shaders, physics (Rapier), Remotion+Spline, multi-platform export (iOS/Android/Web/AR)
- **frontend-design**: Anti-slop UI/UX rules, GSAP motion choreography, typography (anti-generic font pairing), color strategy, asymmetric layouts, background atmosphere, responsive patterns

## Recent Changes
- Knowledge skills: Added 3d-web-experience (Spline + Three.js + R3F) and frontend-design (anti-slop UI/UX) knowledge skills
- 002-stan-store-lawfirm-funnel: Added N/A (content products + no-code integrations) + Stan Store (storefront), PPTX Generator skill (PDF creation), n8n (webhook pipeline), Airtable (lead tracking)
