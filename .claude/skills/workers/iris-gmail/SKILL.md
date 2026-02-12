---
name: iris-gmail
description: |
  DEPRECATED: Iris has been consolidated into Comms.
  Use @comms for email, Slack, Google Drive, and Notion.
triggers:
  - "@iris"
  - "email"
  - "gmail"
redirect: comms
---

# Iris - DEPRECATED

**Iris has been consolidated into Comms (v2.0.0 consolidation).**

For email, Slack, Google Drive, and Notion, use:
- Agent: **Comms**
- Skill: `.claude/skills/workers/comms/SKILL.md`
- Learnings: `.specify/memory/learnings/comms-learnings.md`

All Iris's capabilities are now in Comms:
- Gmail/email management
- Google Drive uploads
- Slack messaging
- Notion documentation

See `.specify/memory/agents/roster.json` for the consolidated agent structure.
