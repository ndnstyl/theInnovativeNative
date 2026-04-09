# The Innovative Native — Claude Code Instructions

## Principles
1. **Hooks > Instructions** — Anything that MUST happen is in hooks, not here
2. **Fork > Inline** — Complex work runs in isolated subagent context
3. **Scalar Metrics > Subjective Judgment** — Agents need numbers, not vibes
4. **Constitution First** — Load `.specify/memory/constitution.md` on startup
5. **No Spec Kit = No Work** — Document before executing
6. **If it's not in Airtable, it didn't happen** — Visibility is accountability

## Rules (auto-loaded by file path)
@.claude/rules/hard-rules.md
@.claude/rules/agent-protocol.md
@.claude/rules/security.md
@.claude/rules/n8n-rules.md
@.claude/rules/tech-stack.md
@.claude/rules/airtable-schema.md
@.claude/rules/supabase-rules.md
@.claude/rules/prompt-engineering.md

## Project Structure
```
.specify/features/     — Feature spec kits (spec.md, plan.md, tasks.md)
.specify/memory/       — Constitution, learnings, agent roster
.claude/agents/        — Subagent definitions (researcher, implementer, reviewer, deployer, logger)
.claude/rules/         — Modular rules (loaded by file path match)
.claude/skills/        — User-invocable skills (speckit, toughlove, remotion, pptx, etc.)
scripts/hooks/         — Deterministic lifecycle hooks
scripts/autoresearch/  — Autonomous iteration loop (Karpathy pattern)
```

## Memory Conventions
- `.specify/memory/` files use YAML frontmatter + `[[wikilinks]]`
- New learnings follow `.specify/templates/learnings-template.md`

## Quick Reference
- **Airtable Base**: appTO7OCRB2XbAlak (see `.claude/rules/airtable-schema.md` for tables)
- **Supabase Community**: etglkowtxfhrszxnkrcq (us-east-1)
- **Website**: Next.js 13.4.19, static export, SCSS + Bootstrap + GSAP

## Active Technologies
- TypeScript 5.2.2, React 18.2.0, Node 18+ (build tooling only) + Next.js 13.4.19 (Pages Router, `output: 'export'`), SCSS 1.66.1, Bootstrap 5.3.1, GSAP 3.12.2. NO new runtime dependencies introduced. (036-pi-content-value-system)
- Static HTML output → A2 Hosting (LiteSpeed). Lead capture persists to Airtable base `appTO7OCRB2XbAlak` via n8n webhook (`NEXT_PUBLIC_LEAD_WEBHOOK_URL`). Unlock state persists in browser localStorage. No new databases, no schema changes. (036-pi-content-value-system)

## Recent Changes
- 036-pi-content-value-system: Added TypeScript 5.2.2, React 18.2.0, Node 18+ (build tooling only) + Next.js 13.4.19 (Pages Router, `output: 'export'`), SCSS 1.66.1, Bootstrap 5.3.1, GSAP 3.12.2. NO new runtime dependencies introduced.
