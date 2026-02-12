# Standard Operating Procedures (SOPs)

**Location**: `.specify/sops/`
**Last Updated**: 2026-02-05

## Purpose

This directory contains standard operating procedures for agent operations, integrations, and recurring tasks.

## SOP Index

| SOP | Owner | Purpose |
|-----|-------|---------|
| [agent-logging-sop.md](./agent-logging-sop.md) | All Agents | Mandatory Airtable logging protocol |
| [n8n-workflow-creation-sop.md](./n8n-workflow-creation-sop.md) | Neo | Workflow creation best practices |
| [mcp-config-management-sop.md](./mcp-config-management-sop.md) | All Agents | MCP config sync across 3 locations |
| [drew-oversight-sop.md](./drew-oversight-sop.md) | Drew | Daily/weekly oversight for Neo workflows |
| [workflow-categorization-sop.md](./workflow-categorization-sop.md) | Neo | Priority tier and category criteria |
| [competitive-intelligence-research-sop.md](./competitive-intelligence-research-sop.md) | Maya | Organic competitive research methodology |
| [persona-validation-sop.md](./persona-validation-sop.md) | Maya + Mike | Validate personas with evidence |

## Creating New SOPs

1. Use imperative titles (e.g., "Create X", "Handle Y")
2. Include: Purpose, Steps, Gotchas, Related Docs
3. Add entry to this README
4. Reference in agent skill files if recurring task

## Related Locations

- **Agent Skills**: `.claude/skills/<category>/<agent>/SKILL.md`
- **Learnings**: `.specify/memory/learnings/`
- **Patterns**: `.specify/patterns/`
- **Feature Specs**: `.specify/features/` or `specs/`
