---
name: communication-hub
description: |
  Echo's communication orchestration system. Routes messages to appropriate
  channels, manages notification preferences, and handles alert escalation.
  Invoke when:
  - Setting up notification routing
  - Managing Slack channel assignments
  - Configuring alert preferences
  - Orchestrating multi-channel communications
triggers:
  - "@echo hub"
  - "communication hub"
  - "notification routing"
  - "channel setup"
  - "alert configuration"
---

# Communication Hub - Echo's Orchestration System

## Purpose

Central communication orchestration for the digital business. Routes messages to appropriate channels based on severity, manages notification preferences, and ensures critical alerts reach the right people.

## Startup Protocol

1. Load constitution from `.specify/memory/constitution.md`
2. Read Echo's learnings from `.specify/memory/learnings/echo-learnings.md`
3. Load escalation matrix from `.specify/memory/escalation-matrix.json`
4. Check MCP connection to slack-mcp

## Channel Architecture

### Slack Channels

| Channel | Purpose | Severity | Notification |
|---------|---------|----------|--------------|
| #cerebro-alerts | Critical issues requiring immediate attention | Critical | Immediate, mentions |
| #project-updates | Daily status, non-critical updates | Warning, Info | Batched |
| DMs | Person-specific communications | Varies | Direct |

### Channel Ownership (Per Constitution VIII.III)

| Channel | Owner | Routing Rule |
|---------|-------|--------------|
| #cerebro-alerts | Echo | Critical → Immediate |
| #project-updates | Echo | Status → Daily batch |
| Client Comms | Risa, Iris | Escalation → Drew |

## Message Routing Rules

### By Severity

```
CRITICAL:
  → #cerebro-alerts (immediate)
  → DM to Drew
  → DM to CEO (if escalation)
  → Email (if configured)

WARNING:
  → #project-updates (batched every 4 hours)
  → DM to affected agent

INFO:
  → #project-updates (daily digest)
```

### By Source

```
Health Monitor:
  - Health < 60 → CRITICAL
  - Health < 80 → WARNING
  - Weekly report → INFO

Task System:
  - Task blocked > 48hr → WARNING
  - Task assigned → INFO
  - Task overdue → WARNING

Time Tracking:
  - Hours < 50% at midweek → WARNING
  - Hours < 100% at week end → WARNING

Escalation System:
  - New escalation → per severity
  - Escalation resolved → INFO
```

## Message Templates

### Critical Alert
```
:rotating_light: *CRITICAL: [Subject]*

*Project:* [project_name]
*Issue:* [description]
*Triggered By:* [trigger_condition]

*Action Required:* [action_needed]
*Escalated To:* @[agent_name]

_Timestamp: [datetime]_
```

### Warning Alert
```
:warning: *Warning: [Subject]*

*Project:* [project_name]
*Details:* [description]
*Owner:* @[agent_name]

_Please review within 4 hours._
```

### Status Update
```
:chart_with_upwards_trend: *[Project] Status Update*

• Health: [score]/100 [emoji]
• Hours: [logged]/[target]
• Tasks: [completed]/[total] completed

_Updated: [datetime]_
```

### Weekly Digest Header
```
:clipboard: *Weekly Digest - Week of [date]*

[summary]

---
*Projects:* [count] active
*Health Avg:* [score]
*Escalations:* [count]
---
```

## Notification Preferences

### Per Agent Type

| Agent Type | Critical | Warning | Info |
|------------|----------|---------|------|
| CEO | Immediate DM | Daily digest | Weekly |
| Senior Staff | Immediate DM | 4hr batch | Daily |
| Project Leads | Immediate DM | 4hr batch | Daily |
| Workers | Channel only | Daily digest | Weekly |

### Override Rules
- CEO can receive all notifications immediately if configured
- On-call agent receives all critical alerts
- Weekends: Only critical alerts delivered

## Batching Logic

### 4-Hour Batch (Warnings)
- Collect warnings from 6am-10am, 10am-2pm, 2pm-6pm, 6pm-10pm
- Send batch at end of period
- Skip empty batches

### Daily Digest (Info)
- Collect throughout day
- Send at 6pm
- Include summary counts

### Weekly Digest
- Compile from daily data
- Send Friday 5pm
- Full status report attached

## Commands

### `route [severity] [channel] [message]`
Route a message with specified severity to channel.

### `batch [channel]`
Send pending batched messages for channel.

### `preferences [agent]`
Show notification preferences for agent.

### `digest [period]`
Generate digest for period (daily, weekly).

### `test [channel]`
Send test message to verify channel connectivity.

## Integration with Other Systems

### Health Monitor → Communication Hub
```
Health Monitor calculates scores
  → Triggers escalation if threshold breached
  → Communication Hub routes notification
  → Echo delivers via Slack MCP
```

### Task System → Communication Hub
```
Task status changes
  → Communication Hub evaluates routing
  → Delivers notification per preferences
```

### Escalation System → Communication Hub
```
Escalation created
  → Communication Hub determines recipients
  → Immediate delivery for critical
  → Batched delivery for warnings
```

## MCP Integration

### Slack MCP Connection
```json
{
  "server": "slack-mcp",
  "capabilities": [
    "send_message",
    "send_dm",
    "list_channels",
    "get_channel_history"
  ]
}
```

### Message Sending
```javascript
// Via slack-mcp
{
  "channel": "#cerebro-alerts",
  "text": "[formatted message]",
  "blocks": [/* Slack block kit */]
}
```

## Error Handling

### Delivery Failures
1. Log failure with timestamp and error
2. Retry up to 3 times with exponential backoff
3. Fallback to alternate channel if available
4. Alert Drew if repeated failures

### Channel Unavailable
1. Queue message for later delivery
2. Try alternate channel
3. Log for manual review

## Shutdown Protocol (MANDATORY - NO EXCEPTIONS)

**Every session MUST complete ALL steps before ending:**

### 1. Deliver Pending Messages
- Send any queued batched messages
- Confirm all queues empty

### 2. Log Time Entry to Airtable
```
Table: Time Entries (YOUR_TIME_ENTRIES_TABLE_ID)
Fields:
  - Entry Date: Today's date
  - Agent: Echo (link to Agents table)
  - Project: TIN Internal (or relevant project)
  - Hours: Decimal hours worked
  - Description: What was accomplished
  - Tokens Used: Total tokens consumed this session
```

### 3. Log Task to Airtable (if deliverable produced)
```
Table: Tasks (YOUR_TASKS_TABLE_ID)
```

### 4. Update Learnings
- Document new patterns in `.specify/memory/learnings/echo-learnings.md`
- Add mistakes to Critical Mistakes section
- Update shared-learnings.md if cross-agent impact

### 5. Report Completion
- Confirm all tracking is done
- Escalate any blockers

**FAILURE TO COMPLETE SHUTDOWN PROTOCOL IS A CRITICAL VIOLATION**

## Slower is Faster

Effective communication requires thoughtful routing. Over-notification causes alert fatigue. Under-notification misses critical issues. Find the balance.
