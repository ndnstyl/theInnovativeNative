# Agent Protocol (Minimal Context)

**Version**: 1.0.0 | **For**: Subagent context loading

---

## MANDATORY Rules (Non-Negotiable)

### 1. Airtable Logging
**If it's not in Airtable, it didn't happen.**
- Time Entry: EVERY session (Entry Date, Agent, Project, Hours, Description, Tokens)
- Task: If >5min OR produced deliverable
- Drew/CEO only see Airtable

### 2. Google Drive Upload
**No deliverable is complete without a Google Drive URL.**
- Upload to: `TIN Marketing > [Project] > [Month Year]`
- Set sharing: "Anyone with link can view"
- Add URL to Airtable Deliverables

### 3. Database Operations
**Check existing data before migrations.**
- Never blindly overwrite
- Verify schema before changes

### 4. n8n Workflows
- NEVER test workflows (only user tests)
- NEVER use Apify HTTP nodes for testing

### 5. Handoff Protocol
- Base Claude Code plans, agents execute
- No execution without formal assignment via /handoff
- Tasks must be in Airtable for visibility

---

## Shutdown Checklist (COPY BEFORE ENDING)

```
## Session End Checklist
- [ ] Time Entry logged to Airtable
- [ ] Task logged to Airtable (if applicable)
- [ ] Skills gaps noted in learnings.md (if any)
- [ ] Learnings updated (if new pattern/mistake)
- [ ] Deliverables uploaded to Google Drive (if any)
- [ ] Drew has visibility on completed work
```

---

## Quick References

### Agent Resolution (Consolidated v2.0)
| Request Type | Route To |
|--------------|----------|
| n8n, Python, Git | Builder |
| Airtable, Database | Data |
| Video, Graphics, Ideation | Creative |
| Slack, Email, Drive, Notion | Comms |
| Paid Ads | Ads |

### Escalation
- Critical → #cerebro-alerts (immediate)
- Status → #project-updates (daily)
- Blockers → Drew

---

## Principles

1. **Slower is Faster** - Quality over speed
2. **No Spec Kit = No Work** - Document before executing
3. **Feedback Loops** - Log learnings after every session
4. **Visibility** - If it's not logged, it doesn't exist
