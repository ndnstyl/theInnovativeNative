---
name: agent-handoff
description: |
  Infrastructure skill documenting the Agent Handoff Protocol. This skill defines how tasks
  transition from the Planning Layer (CEO + Base Claude Code) to the Execution Layer (Domain Agents).
  Use when understanding handoff mechanics, agent resolution, or gap identification.
triggers:
  - "handoff protocol"
  - "agent handoff"
  - "delegate to agent"
  - "assign to agent"
  - "agent resolution"
  - "domain gaps"
---

# Agent Handoff Protocol

## Overview

The Handoff Protocol bridges two layers:

1. **Planning Layer** (CEO + Base Claude Code): Requirements clarification, spec kit creation, task assignment
2. **Execution Layer** (Domain Agents): Task execution, deliverable creation, time/token logging

**Key Principle**: Base Claude Code plans. Domain Agents execute. The handoff is the explicit boundary.

---

## The Development Loop

```
┌─────────────────────────────────────────────────────────────┐
│  PLANNING LAYER (You + Base Claude Code)                    │
│                                                             │
│  1. Clarify requirements                                    │
│  2. Create spec kit (/speckit.specify → plan → tasks)       │
│  3. Assign tasks to agents in tasks.md                      │
│  4. Invoke /handoff                                         │
└─────────────────────────────────┬───────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────┐
│  HANDOFF PROTOCOL                                           │
│                                                             │
│  - Resolve agent from roster.json                           │
│  - Create Airtable task with Assignee                       │
│  - Generate agent invocation command                        │
│  - Log handoff for Drew visibility                          │
└─────────────────────────────────┬───────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────┐
│  EXECUTION LAYER (Domain Agents)                            │
│                                                             │
│  @neo (n8n) │ @tab (Airtable) │ @pixel (Graphics) │ ...    │
│                                                             │
│  - Execute assigned tasks                                   │
│  - Log time/tokens/deliverables to Airtable                 │
│  - Update tasks.md with [x] completion                      │
│  - Report back via Airtable                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Agent Resolution Algorithm

When `/handoff` encounters a task with `(AgentName)`, it resolves the agent using this priority order:

### Priority 1: Explicit ID Match
```
Task: "Set up workflow (Neo)"
→ Look for agent with id: "neo" in roster.json
→ Found: Neo (n8n Workflows)
```

### Priority 2: Name Match
```
Task: "Set up workflow (n8n guy)"
→ Look for agent with name containing "n8n" (case-insensitive)
→ Found: Neo (role: "n8n Workflows")
```

### Priority 3: Trigger Match
```
Task: "Build automation workflow"
→ No explicit agent, scan task for trigger keywords
→ Load each agent's SKILL.md, check triggers[]
→ Neo's triggers include "workflow", "automation", "n8n"
→ Match: Neo
```

### Priority 4: Capability Match
```
Task: "Create Airtable schema"
→ Scan roster.json capabilities arrays
→ Tab has capability: "Schema management"
→ Match: Tab
```

### Priority 5: Project Registry
```
Task in project: "lawfirm-rag"
→ Check .specify/memory/projects/registry.json
→ Project workers: ["scales", "neo", "tab"]
→ Filter matches to authorized workers
```

### Priority 6: Drew Fallback
```
Task: "Do something ambiguous"
→ No match found
→ Route to Drew (PM) for manual resolution
→ Log gap to domain-gaps.json
```

---

## Handoff Manifest Schema

When a handoff is executed, this manifest is generated:

```json
{
  "handoff": {
    "id": "HO-2026-02-05-001",
    "timestamp": "2026-02-05T10:30:00Z",
    "feature": "001-neo-workflow-management",
    "featurePath": ".specify/features/001-neo-workflow-management/",
    "initiatedBy": "base-claude"
  },
  "assignments": [
    {
      "taskId": "T006",
      "taskDescription": "Import workflow to n8n",
      "agent": {
        "id": "neo",
        "name": "Neo",
        "skillPath": ".claude/skills/workers/neo-n8n/SKILL.md",
        "airtableRecordId": "recXXXXXXXX"
      },
      "airtableTaskId": "recYYYYYYYY",
      "status": "assigned"
    }
  ],
  "gaps": [],
  "summary": {
    "totalTasks": 3,
    "assignedTasks": 3,
    "gappedTasks": 0,
    "uniqueAgents": 2
  }
}
```

---

## Gap Identification

When a task references an unrecognized agent or domain:

### Gap Record Schema
```json
{
  "id": "GAP-2026-02-05-001",
  "date": "2026-02-05",
  "feature": "001-feature-name",
  "task": {
    "id": "T015",
    "description": "Create TikTok ad campaign",
    "requestedAgent": "TikTokExpert"
  },
  "resolution": {
    "status": "unresolved",
    "suggestedAgents": ["Adler", "Haven"],
    "drewNotified": true,
    "resolvedBy": null,
    "resolvedAgent": null,
    "resolvedDate": null
  },
  "metadata": {
    "domain": "paid-advertising",
    "capabilities_needed": ["TikTok Ads", "Social Advertising"]
  }
}
```

### Gap Resolution Flow
1. Gap logged to `.specify/memory/gaps/domain-gaps.json`
2. Drew notified via Airtable escalation
3. Drew reviews and either:
   - Assigns to existing agent with closest match
   - Creates new agent capability request
   - Flags for CEO review
4. Gap marked resolved with chosen agent

---

## Task Status Lifecycle

Tasks progress through these statuses:

```
                                    ┌──────────────┐
                                    │   Rejected   │
                                    │ (with reason)│
                                    └──────┬───────┘
                                           │ reassign
           ┌─────────┐    ┌─────────────┐  │  ┌────────────┐    ┌───────────┐
Pending ──▶│ Assigned │──▶│ Acknowledged │──┼─▶│ In Progress│──▶│ Completed │
           └─────────┘    └─────────────┘  │  └─────┬──────┘    └───────────┘
            by /handoff    by agent        │        │
              (4h SLA)     (24h SLA)       │        ▼
                                           │  ┌─────────┐
                                           └──│ Blocked │
                                              │(auto-set)│
                                              └─────────┘
```

### Status Definitions

| Status | Set By | Meaning | SLA |
|--------|--------|---------|-----|
| Pending | Manual | Task created, not assigned | - |
| Assigned | /handoff | Task assigned to agent | 4h to acknowledge |
| Acknowledged | Agent startup | Agent confirms receipt | 24h to start |
| In Progress | Agent | Work has begun | Est. hours × 2 |
| Blocked | Auto | Dependency not met | Unblocks automatically |
| Completed | Agent | Work finished | - |
| Rejected | Agent | Cannot execute (with reason) | Drew resolves |
| Cancelled | Drew/CEO | Task no longer needed | - |

## Agent Startup Protocol Extension

When an agent is invoked via handoff, they must follow this extended startup:

### Standard Startup (from Constitution VII.V)
1. Load constitution from `.specify/memory/constitution.md`
2. Read own learnings.md file
3. Check shared-learnings.md for cross-agent updates

### Handoff Extension
4. **Update Status to "Acknowledged"** in Airtable (IMMEDIATELY)
5. **Load Assigned Tasks**: Read the spec kit's tasks.md (filter to YOUR tasks only)
6. **Verify Assignment**: Confirm task IDs match Airtable records
7. **Check Dependencies**: If blockers incomplete, note and skip blocked tasks
8. **Load Context**: Read spec.md and plan.md for full context
9. **Evaluate Feasibility**: Can you execute? If not, REJECT with reason

### Rejection Protocol (NEW)
If agent cannot execute a task:
1. Update task Status to "Rejected" in Airtable
2. Fill "Rejection Reason" field with specific blocker
3. Do NOT attempt partial execution
4. Drew will be notified to resolve and reassign

**Valid rejection reasons**:
- Missing credentials/access
- Spec is incomplete or ambiguous
- Task requires capability agent doesn't have
- Dependency on external system that's down
- Estimated hours significantly underestimated

### Execution
10. Update Status to "In Progress" in Airtable
11. Execute tasks following the plan
12. If blocked mid-task: Update status to "Blocked", note blocker
13. Update tasks.md: `- [x] T006 ✓ 2026-02-05`
14. Log deliverables to Airtable
15. Update Status to "Completed" in Airtable

### Shutdown (from Constitution VII.VI)
16. Log time entry to Airtable
17. Log tokens used
18. Update learnings if needed
19. Report completion

## Capacity Planning

### Agent Capacity Thresholds

| Queued Hours | Status | Can Accept More? |
|--------------|--------|------------------|
| 0-4 | Green | Yes, freely |
| 4-8 | Yellow | Yes, with monitoring |
| >8 | Red | No, rebalance first |

### Pre-Handoff Capacity Check

Before `/handoff`, Drew should run `/queue` to verify:
- No agent will exceed 8 hours after assignment
- Work is balanced across available agents
- No agent is idle while others are overloaded

### Rebalancing

When an agent is overloaded (>8h):
1. Identify lower-priority tasks
2. Find available agents with matching capabilities
3. Reassign via Airtable (update Assignee field)
4. Notify original agent of reassignment

## Dependency Management

### Defining Dependencies

In tasks.md, use the `(depends: TXXX)` annotation:

```markdown
- [ ] T006 [US1] Import workflow to n8n (Neo)
- [ ] T007 [US1] Configure credentials (Neo) (depends: T006)
- [ ] T008 [US1] Test execution (Neo) (depends: T006, T007)
```

### Dependency Enforcement

When `/handoff` runs:
1. Parse dependency annotations
2. Check if blocking tasks are "Completed" in Airtable
3. If blockers incomplete:
   - Set task Status = "Blocked"
   - Set "Blocked By" linked field
   - Exclude from agent invocation commands

### Auto-Unblocking

When a blocking task completes:
1. Query for tasks where "Blocked By" includes completed task
2. Remove completed task from "Blocked By"
3. If "Blocked By" is now empty, set Status = "Assigned"
4. Notify Drew that task is now available

**Note**: Auto-unblocking requires either:
- Manual check after each completion
- n8n workflow triggered by Airtable webhook
- Drew's daily queue review

---

## Task Assignment Format

In tasks.md, agents are assigned using parentheses at the end:

```markdown
## Phase 3: Core Implementation

- [ ] T006 [US1] Import workflow JSON to n8n (Neo)
- [ ] T007 [US1] Configure API credentials in n8n (Neo)
- [ ] T008 [P] [US1] Create health audit dashboard in Airtable (Tab)
- [ ] T009 [P] [US1] Design status badges for dashboard (Pixel)
```

### Format Rules
- Agent name goes in parentheses at end: `(AgentName)`
- Use agent's name from roster.json (e.g., `Neo`, `Tab`, `Pixel`)
- Agent names are case-insensitive
- One agent per task (split complex tasks if multiple agents needed)
- Tasks without `(Agent)` remain unassigned for manual routing

---

## Airtable Integration

### Tasks Table Fields Used by Handoff
| Field | Purpose | Set By |
|-------|---------|--------|
| Title | Task description | /handoff |
| Assignee | Link to agent record | /handoff |
| Project | Link to project | /handoff |
| Status | "Assigned" → "In Progress" → "Complete" | /handoff, then agent |
| Priority | From story priority | /handoff |
| Notes | Task ID, feature, dependencies | /handoff |

### Status Progression
```
Assigned (by /handoff)
    ↓
In Progress (when agent starts)
    ↓
Complete (when agent finishes)
```

---

## Drew's Oversight Role

Drew (PM) **owns** the handoff process, not just oversight.

### Pre-Handoff (Drew's Gate)
1. Reviews tasks.md for completeness
2. Adds agent assignments `(AgentName)` to all tasks
3. Adds effort estimates `estimatedHours`
4. Marks dependencies `(depends: TXXX)`
5. Runs `/queue` to verify capacity
6. Approves handoff

### During Execution
1. Monitors `/queue --stale` daily for stuck tasks
2. Receives rejection notifications
3. Resolves gaps within 48-hour SLA
4. Rebalances overloaded agents

### Post-Execution
1. Verifies tasks.md marked complete
2. Confirms Airtable records updated
3. Reviews learnings for cross-agent impact
4. Weekly audit on Fridays

### Drew's Airtable Views
- **Pending Handoffs**: Status = "Assigned"
- **Acknowledged**: Status = "Acknowledged" (work not started)
- **Active Work**: Status = "In Progress"
- **Blocked**: Status = "Blocked" (needs resolution)
- **Rejected**: Status = "Rejected" (needs reassignment)
- **Stale**: Assigned > 4h OR Acknowledged > 24h

### Escalation Authority
Drew escalates to CEO when:
- Gap unresolved > 48 hours
- Agent overloaded and no reassignment possible
- Rejected task has no alternative agent
- Critical task blocked > 24 hours

---

## Command Reference

### Initiate Handoff
```
/handoff                    # All tasks in active feature
/handoff 001-feature        # Specific feature
/handoff T006 T007          # Specific tasks
/handoff Neo                # All tasks for specific agent
```

### Check Handoff Status
```
# Query Airtable Tasks table for:
# - Status = "Assigned" (pending execution)
# - Assignee = [agent] (agent's queue)
```

### Resolve Gap
```
# Manual: Update domain-gaps.json
# Or: Drew reassigns in Airtable
```

---

## Anti-Patterns

### DO NOT:
- Have Base Claude Code execute tasks after creating spec kit
- Skip the handoff and go straight to agent invocation
- Assign tasks without creating Airtable records
- Let agents execute without formal task assignment
- Ignore gaps - they indicate missing capabilities

### DO:
- Always use /handoff after spec kit completion
- Verify Airtable tasks exist before agent invocation
- Route ambiguous domains through Drew
- Log all gaps for future agent planning
- Track agent completion in both tasks.md and Airtable

---

## Pre-Handoff Compliance Gate

**MANDATORY: Before `/handoff` creates any Airtable tasks, run these checks.**

This gate prevents work from being delegated by agents who haven't logged their own work. If compliance fails, the handoff is BLOCKED until the source agent logs properly.

### Check 1: Source Session Time Entry

```bash
python3 -c "
import urllib.request, json, urllib.parse
from datetime import datetime

token = '<AIRTABLE_TOKEN>'
base = 'appTO7OCRB2XbAlak'
today = datetime.now().strftime('%Y-%m-%d')
source_agent = '<SOURCE_AGENT_RECORD_ID>'

formula = f'AND({{Entry Date}} = \"{today}\")'
url = f'https://api.airtable.com/v0/{base}/tbl4FrwRqV02j2TSK?filterByFormula={urllib.parse.quote(formula)}'
req = urllib.request.Request(url)
req.add_header('Authorization', f'Bearer {token}')
entries = json.loads(urllib.request.urlopen(req).read()).get('records', [])
my_entries = [e for e in entries if source_agent in e.get('fields', {}).get('Agent', [])]

if not my_entries:
    print('BLOCKED: No time entry logged for this session.')
    print('Action: Log your time entry BEFORE handing off work.')
    exit(1)
else:
    print(f'PASS: {len(my_entries)} time entries found for today.')
"
```

**If Check 1 fails:** STOP. Print error. Do not create handoff tasks.

### Check 2: Source Session Deliverables Logged

```bash
python3 -c "
import urllib.request, json, urllib.parse
from datetime import datetime

token = '<AIRTABLE_TOKEN>'
base = 'appTO7OCRB2XbAlak'
today = datetime.now().strftime('%Y-%m-%d')

formula = f'AND({{Created Date}} = \"{today}\", {{Status}} = \"Draft\", {{File URL}} = BLANK())'
url = f'https://api.airtable.com/v0/{base}/tblnUsXJ2ZHjZGcyu?filterByFormula={urllib.parse.quote(formula)}'
req = urllib.request.Request(url)
req.add_header('Authorization', f'Bearer {token}')
drafts = json.loads(urllib.request.urlopen(req).read()).get('records', [])

if drafts:
    print(f'WARNING: {len(drafts)} deliverables created today are still Draft with no Drive URL.')
    for d in drafts:
        print(f'  - {d[\"fields\"].get(\"Name\", \"Unknown\")}')
    print('Handoff will proceed, but these need Drive upload.')
else:
    print('PASS: All deliverables have proper status.')
"
```

**If Check 2 finds issues:** WARN but allow handoff. Print list of incomplete deliverables.

### Gate Summary

| Check | Fails → | Action |
|-------|---------|--------|
| No time entry today | BLOCK handoff | Source agent must log time first |
| Deliverables missing Drive URL | WARN only | List items, proceed with handoff |
| Tasks missing Priority/Project | WARN only | Drew fixes during review |

**This gate exists because the Feb 4 failure (9 tables created, 0 logged) happened during a handoff. If compliance had been checked at handoff time, the gap would have been caught immediately.**
