---
description: Display agent workload queue and capacity for task planning and rebalancing
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty). The user may specify:
- A specific agent name (e.g., `Neo`) to see detailed queue
- `--stale` flag to show only stale handoffs
- `--all` flag to show all agents including those with empty queues

---

## Agent Queue Command

This command provides visibility into agent workload for:
- Pre-handoff capacity planning
- Identifying overloaded agents
- Finding stale handoffs that need attention
- Rebalancing work across the team

---

## Execution Steps

### 1. Query Airtable for Active Tasks

For each agent in `.specify/memory/agents/roster.json`, query:

**Table**: Tasks (`tbliXF3imV0uFxJSB`)

**Filter**:
```
Assignee = [Agent Record ID]
AND Status IN ("Assigned", "Acknowledged", "In Progress", "Blocked")
```

**Fields to retrieve**:
- Title
- Status
- Estimated Hours
- Created Time (for age calculation)
- Blocked By

### 2. Calculate Queue Metrics

For each agent, calculate:

| Metric | Calculation |
|--------|-------------|
| Queued Hours | SUM(Estimated Hours) for active tasks |
| Task Count | COUNT of active tasks |
| Oldest Task Age | MAX(NOW - Created Time) for tasks in "Assigned" status |
| Blocked Count | COUNT of tasks in "Blocked" status |

### 3. Determine Status

| Queued Hours | Status | Emoji |
|--------------|--------|-------|
| 0 | Idle | ⚪ |
| 0.1-4 | Green | 🟢 |
| 4.1-8 | Yellow | 🟡 |
| >8 | Red | 🔴 |

### 4. Identify Stale Handoffs

A handoff is **stale** when:
- Status = "Assigned" AND age > 4 hours
- Status = "Acknowledged" AND age > 24 hours
- Status = "In Progress" AND age > (Estimated Hours × 2)

### 5. Output Queue Summary

**Standard Output**:
```
## Agent Queue Summary

| Agent | Role | Status | Tasks | Hours | Oldest | Blocked |
|-------|------|--------|-------|-------|--------|---------|
| Neo   | n8n  | 🟡     | 5     | 6.5   | 2h     | 1       |
| Tab   | Airtable | 🟢 | 2     | 2.0   | 30m    | 0       |
| Pixel | Graphics | 🟢 | 3     | 3.5   | 1h     | 0       |
| Spike | Video | ⚪     | 0     | 0     | -      | 0       |
| Adler | Ads  | 🔴     | 8     | 12.0  | 6h     | 2       |

### Capacity Summary
- Total queued hours: 24.0
- Overloaded agents: 1 (Adler)
- Idle agents: 1 (Spike)
- Stale handoffs: 2

### Stale Handoffs (Needs Attention)

| Task | Agent | Status | Age | Expected | Action |
|------|-------|--------|-----|----------|--------|
| T012 | Adler | Assigned | 6h | <4h | Ping or reassign |
| T015 | Neo | In Progress | 8h | 4h | Check for blockers |

### Recommendations
1. Adler is overloaded - consider reassigning 2 tasks to available agents
2. Spike is idle - can take on new work
3. 2 stale handoffs need attention
```

**Agent-Specific Output** (when agent name provided):
```
## Neo's Queue

**Status**: 🟡 Yellow (6.5 hours queued)
**Capacity**: 8 hours max recommended

### Active Tasks

| Task | Title | Status | Est. Hours | Age | Blocked By |
|------|-------|--------|------------|-----|------------|
| T006 | Import workflow | In Progress | 2.0 | 3h | - |
| T007 | Configure creds | Blocked | 1.0 | 3h | T006 |
| T008 | Test execution | Assigned | 1.5 | 2h | - |
| T010 | Error handling | Assigned | 1.0 | 1h | - |
| T012 | Documentation | Acknowledged | 1.0 | 30m | - |

### Summary
- In Progress: 1 task (2.0h)
- Assigned/Acknowledged: 3 tasks (3.5h)
- Blocked: 1 task (1.0h)

### Recommendations
- T007 will auto-unblock when T006 completes
- Can accept 1-2 more small tasks before hitting yellow threshold
```

**Stale-Only Output** (with `--stale` flag):
```
## Stale Handoffs Report

### Critical (Action Required Now)

| Task | Agent | Status | Age | Issue |
|------|-------|--------|-----|-------|
| T012 | Adler | Assigned | 6h | Not acknowledged in 4h |

### Warning (Monitor Closely)

| Task | Agent | Status | Age | Issue |
|------|-------|--------|-----|-------|
| T015 | Neo | In Progress | 8h | Exceeds estimate by 2x |
| T018 | Tab | Acknowledged | 20h | Approaching 24h threshold |

### Resolution Options
1. `/handoff T012 --reassign Pixel` - Reassign to available agent
2. Ping agent directly to start work
3. Escalate to Drew for resolution
```

---

## Error Handling

### No Tasks in Queue
```
All agents have empty queues.

Ready to accept new work:
- Neo (n8n workflows)
- Tab (Airtable operations)
- Pixel (Graphics)
- ... [all workers]

Run /handoff to assign tasks.
```

### Airtable MCP Not Available
```
Warning: Airtable MCP not available. Cannot query task queue.

Manual check required:
1. Open Airtable Tasks table
2. Filter by Status IN ("Assigned", "Acknowledged", "In Progress")
3. Group by Assignee to see per-agent queues
```

---

## Integration with Handoff

The `/queue` command should be run:
1. **Before `/handoff`**: Verify capacity before assigning new work
2. **Daily by Drew**: Monitor for stale handoffs
3. **When agent seems slow**: Check if blocked or overloaded

**Pre-handoff workflow**:
```
/queue              # Check current capacity
/handoff            # Assign new tasks (will warn if capacity exceeded)
/queue --stale      # Monitor for issues
```

---

## Examples

### Check all agent queues
```
/queue
```

### Check specific agent
```
/queue Neo
```

### Show only stale handoffs
```
/queue --stale
```

### Show all agents including idle
```
/queue --all
```
