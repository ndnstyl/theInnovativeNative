# Comms - Communications & Documentation Learnings

## Last Updated: 2026-02-06

*Consolidated from Echo (Slack), Iris (Email/Drive), and Sage (Notion)*

---

## Critical Mistakes (NEVER REPEAT)

- [Initial setup] No critical mistakes recorded yet

---

## Domain Patterns

### Slack
- **Channel Routing**: Critical → #cerebro-alerts, Status → #project-updates
- **Notifications**: Batch non-critical messages to reduce noise
- **Alerts**: Include actionable information in alert messages

### Email
- **Inbox Management**: Triage by priority, not recency
- **Templates**: Use templates for common responses
- **Filters**: Set up filters for automated categorization

### Notion
- **Documentation**: Keep pages focused and well-structured
- **Knowledge Base**: Organize by topic, not by date
- **Wiki Links**: Use bi-directional links for connections
- **SOP Structure**: Always include Purpose, When, What, How, Verification, Exceptions

---

## Quick Reference

### Slack
- MCP Integration: slack-mcp
- KPIs: 50+ messages/day, <5min response time, 99% delivery rate

### Email
- MCP Integration: gmail-mcp
- KPIs: 100+ emails/week, 5+ inbox zero days/week

### Google Drive
- MCP Integration: google-drive-mcp

### Notion
- MCP Integration: notion-mcp
- KPIs: 20+ pages updated/week, 95% link health

---

## Channel Guide (Slack)

| Channel | Purpose | Severity | Response |
|---------|---------|----------|----------|
| #cerebro-alerts | Critical issues | Critical | Immediate |
| #project-updates | Daily status | Warning, Info | Same day |
| Direct Messages | Person-specific | Sensitive | As needed |

---

## Message Formatting (Slack mrkdwn)
- Bold: `*text*`
- Italic: `_text_`
- Code: `` `code` ``
- Code block: ``` ```code``` ```
- Link: `<url|text>`
- User mention: `<@user_id>`
- Channel mention: `<#channel_id>`

---

## Email Priority Levels

| Priority | Response | Examples |
|----------|----------|----------|
| P1 | Same day | Client communications, urgent requests |
| P2 | 24 hours | Team communications, time-sensitive |
| P3 | 48 hours | Newsletters, notifications |
| P4 | Weekly batch | Marketing emails, low priority |

---

## Google Drive Structure

### Folder Naming Convention (MANDATORY)
```
TIN Digital Assets/{ProjectName}/
├── Graphics/{YYYY-MM-DD}_{AssetName}_{Dimensions}.{ext}
├── Videos/{YYYY-MM-DD}_{AssetName}_{Duration}s.{ext}
└── Documents/{YYYY-MM-DD}_{DocumentName}.{ext}
```

### Upload Protocol
1. Verify project folder exists (create if missing)
2. Use naming convention for asset
3. Upload file to appropriate subfolder
4. Update Deliverables table with:
   - Google Drive URL
   - Drive Folder path
   - Upload Status: Uploaded
   - Uploaded By: Comms
   - Upload Date: Now

### Asset Organization
- Graphics: PNG, JPG, SVG, WebP
- Videos: MP4, MOV, WebM
- Documents: PDF, DOCX, PPTX

---

## Notion Documentation Standards

### SOP Structure
Every SOP must include:
1. **Purpose**: Why this exists
2. **Steps**: Clear, numbered actions
3. **Examples**: Real-world illustrations
4. **Exceptions**: Edge cases and handling

### Playbook Structure
Every playbook must include:
1. **Context**: When to use this
2. **Procedures**: Detailed workflows
3. **Escalation**: What to do if stuck
4. **References**: Related docs

### Wiki Page Structure
Every wiki page must include:
1. **Summary**: Brief overview
2. **Details**: Comprehensive content
3. **Related Links**: Connected pages

### Documentation Hierarchy
```
Notion Workspace/
├── SOPs/                  # Standard operating procedures
├── Playbooks/             # Process playbooks
├── Projects/              # Project-specific wikis
│   ├── [Project Name]/
│   └── ...
├── Team/                  # Team documentation
└── Archive/               # Deprecated content
```

---

## Integration Gotchas

### Slack
- Message formatting uses mrkdwn (not markdown)
- Rate limits: 1 message per second per channel
- Threads: Use threads for follow-up messages

### Gmail
- OAuth tokens expire - handle refresh
- Attachments: Check size limits before sending
- Rate limits: Sending limits vary by account type

### Google Drive
- OAuth tokens managed by MCP server
- Respect quota limits (750GB/day upload)
- Check sharing permissions before operations

### Notion
- Block limits: 100 blocks per request
- Database properties have type restrictions
- Check access permissions before updates

---

## SOPs Created
- [2026-02-04] Agent Logging SOP - `.specify/sops/agent-logging-sop.md` - Documents mandatory time/task/token logging process for all agents

---

## Message Templates

### Critical Alert (Slack)
```
:rotating_light: *CRITICAL: [Subject]*
*Project:* [project]
*Issue:* [description]
*Action Needed:* [what to do]
*Escalation:* [contact]
```

### Status Update (Slack)
```
:chart_with_upwards_trend: *[Project] Status Update*
• Health: [score]
• Progress: [summary]
• Next: [upcoming]
```

### Professional Email Response
```
Subject: Re: [Original Subject]

Hi [Name],

[Response body]

Best regards,
[Signature]
```

---

## Successful Approaches
- None recorded yet - document as patterns emerge
