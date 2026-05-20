---
description: Hand off tasks from spec kit to domain agents with Airtable tracking and explicit invocation commands
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty). The user may specify:
- A specific feature directory (e.g., `001-neo-workflow-management`)
- Specific task IDs to hand off (e.g., `T006 T007`)
- A specific agent name (e.g., `Neo`)

---

## Handoff Protocol

This command bridges the **Planning Layer** (CEO + Base Claude Code) to the **Execution Layer** (Domain Agents).

### Prerequisites

1. A spec kit exists with `tasks.md` containing agent assignments
2. Agents are registered in `.specify/memory/agents/roster.json`
3. Airtable MCP is configured for task tracking

---

## Execution Steps

### 0. Pre-Handoff Review (Drew's Gate)

Before running `/handoff`, Drew (or CEO) should verify:
- [ ] All tasks have agent assignments `(AgentName)`
- [ ] Estimated hours added to complex tasks
- [ ] Dependencies identified (which tasks block others)
- [ ] Agent capacity checked (no agent >8 hours queued)

**Skip this step only for CEO direct assignments or emergencies.**

### 1. Locate the Active Spec Kit

If no feature directory specified in user input:
- Run `.specify/scripts/bash/check-prerequisites.sh --json --require-tasks` to find active feature
- If multiple features exist, list them and ask user to specify

Extract `FEATURE_DIR` from the script output.

### 2. Parse tasks.md for Agent Assignments

Read `{FEATURE_DIR}/tasks.md` and extract tasks with agent assignments.

**Agent Assignment Format**: Look for `(AgentName)` at the end of task descriptions:
```markdown
- [ ] T001 [US1] Set up n8n workflow (Neo)
- [ ] T002 [US1] Create Airtable schema (Tab)
- [ ] T003 [P] [US1] Design graphics for campaign (Pixel)
```

For each task, extract:
- **Task ID**: `T001`, `T002`, etc.
- **Story**: `[US1]`, `[US2]`, etc. (if present)
- **Description**: The task description text
- **Agent**: The name in parentheses at the end
- **Parallel**: Whether marked with `[P]`
- **Status**: `[ ]` = pending, `[x]` = complete

### 3. Resolve Agents from Roster

Load `.specify/memory/agents/roster.json` and resolve each agent name:

**Resolution Algorithm** (priority order):
1. **Exact Match**: Agent name matches `id` or `name` in roster (case-insensitive)
2. **Role Match**: Task keywords match agent's `capabilities` array
3. **Trigger Match**: Load agent's SKILL.md and check `triggers` in frontmatter
4. **Project Match**: Check if agent is authorized for current project in registry
5. **Drew Fallback**: If no match, route to Drew for manual assignment

For each resolved agent, extract:
- `skillPath`: Path to agent's SKILL.md
- `learningsPath`: Path to agent's learnings.md
- `mcpIntegration`: MCP server the agent uses (if any)
- `reportsTo`: Agent's supervisor

### 4. Check Agent Capacity (NEW)

Before assigning tasks, query Airtable for each agent's current workload:

```
Query: Tasks WHERE Assignee = [Agent] AND Status IN ("Assigned", "Acknowledged", "In Progress")
Sum: estimatedHours field
```

**Capacity Thresholds**:
| Queue Hours | Status | Action |
|-------------|--------|--------|
| 0-4 | Green | Assign freely |
| 4-8 | Yellow | Assign with note |
| >8 | Red | Warning: Agent overloaded |

**Output if overloaded**:
```
⚠️  CAPACITY WARNING

| Agent | Queued Hours | Queued Tasks | Status |
|-------|--------------|--------------|--------|
| Neo   | 12.5         | 8            | 🔴 OVERLOADED |
| Tab   | 3.0          | 4            | 🟢 OK |

Neo is overloaded. Options:
1. Proceed anyway (not recommended)
2. Reassign some tasks to another agent
3. Wait for Neo to complete current work

Continue with handoff? [y/N]
```

### 5. Validate Task Dependencies (NEW)

For each task, check if it has blocking dependencies:

1. Parse task description for dependency markers: `(depends: T001, T002)`
2. Check if blocking tasks are complete in Airtable
3. If blockers incomplete, set task Status = "Blocked" instead of "Assigned"

**Dependency Format in tasks.md**:
```markdown
- [ ] T006 [US1] Import workflow to n8n (Neo)
- [ ] T007 [US1] Configure credentials (Neo) (depends: T006)
- [ ] T008 [US1] Test workflow execution (Neo) (depends: T006, T007)
```

**Blocked Task Handling**:
- Create Airtable record with Status = "Blocked"
- Set `blockedBy` field to link to blocking tasks
- Do NOT include in agent invocation commands
- Note: "Task T007 blocked by T006 - will auto-assign when unblocked"

### 6. Identify Gaps (Unmatched Agents)

If any task references an agent not in roster:
1. Log to `.specify/memory/gaps/domain-gaps.json`:
   ```json
   {
     "date": "YYYY-MM-DD",
     "task": "T001",
     "requestedAgent": "UnknownAgent",
     "taskDescription": "Description of task",
     "feature": "feature-name",
     "status": "unresolved"
   }
   ```
2. Suggest closest matches from roster based on capabilities
3. Route to Drew for resolution

### 8. Create/Update Airtable Tasks

For each task with a resolved agent, use Airtable MCP to create or update task record:

**Table**: Tasks (`tbliXF3imV0uFxJSB`)

**Fields**:
| Field | Value |
|-------|-------|
| Title | Task description (without agent name) |
| Assignee | Link to agent record in Agents table |
| Project | Link to project record in Projects table |
| Status | "Assigned" (or "Blocked" if dependencies unmet) |
| Priority | Derived from story priority (P1/P2/P3) or "Normal" |
| Estimated Hours | From task annotation or default 1.0 |
| Blocked By | Link to blocking task records (if any) |
| Due Date | Optional - from spec if specified |
| Notes | Task ID, feature directory, dependencies |

If task already exists (match by Title + Project), update the Assignee field.

### 9. Generate Agent Invocation Commands

For each agent with assigned tasks (excluding blocked), generate the invocation command:

**Output Format**:
```
## Handoff Summary

### Capacity Check
| Agent | Queued Hours | New Tasks | New Hours | Total | Status |
|-------|--------------|-----------|-----------|-------|--------|
| Neo   | 4.0          | 2         | 3.0       | 7.0   | 🟡 OK  |
| Tab   | 1.0          | 1         | 1.0       | 2.0   | 🟢 OK  |

### Tasks Assigned

| Task | Description | Agent | Est. Hours | Status | Airtable |
|------|-------------|-------|------------|--------|----------|
| T006 | Import workflow to n8n | Neo | 2.0 | Assigned | Created |
| T007 | Configure credentials | Neo | 1.0 | Blocked (T006) | Created |
| T008 | Create dashboard schema | Tab | 1.0 | Assigned | Created |

### Agent Invocation Commands

To execute Neo's tasks:
```
@neo Execute task T006 from feature 001-neo-workflow-management

Context:
- Spec: .specify/features/001-neo-workflow-management/spec.md
- Plan: .specify/features/001-neo-workflow-management/plan.md
- Tasks: .specify/features/001-neo-workflow-management/tasks.md

Note: T007 is blocked by T006 - will be available after T006 completes.
```

To execute Tab's tasks:
```
@tab Execute task T008 from feature 001-neo-workflow-management

Context:
- Spec: .specify/features/001-neo-workflow-management/spec.md
- Plan: .specify/features/001-neo-workflow-management/plan.md
- Tasks: .specify/features/001-neo-workflow-management/tasks.md
```

### Blocked Tasks (Will Auto-Unblock)

| Task | Blocked By | Auto-Assign When |
|------|------------|------------------|
| T007 | T006       | T006 completed   |

### Gaps (Requires Resolution)

None / [List any unmatched agents]

### Next Steps

1. Copy an invocation command above
2. Invoke the agent (e.g., @neo ...)
3. Agent MUST update status to "Acknowledged" on startup
4. Agent will log time/tokens to Airtable upon completion
5. When blocked tasks unblock, run `/handoff T007` to assign
```

### 10. Log Handoff for Visibility

Create a time entry for the handoff itself:

**Table**: Time Entries (`tbl4FrwRqV02j2TSK`)

| Field | Value |
|-------|-------|
| Entry Date | Today |
| Agent | Base Claude (or logged-in agent) |
| Project | Current project |
| Hours | 0.05 (3 minutes typical) |
| Description | "Handoff: [X] tasks to [N] agents for feature [name]" |

### 11. Monitor Acknowledgment (Stale Handoff Detection)

After handoff, tasks should progress:
- **Assigned** → **Acknowledged** within 4 hours
- **Acknowledged** → **In Progress** within 24 hours

**Stale Handoff Alert** (run via `/queue` or manual check):
```
⚠️  STALE HANDOFFS DETECTED

| Task | Agent | Status | Age | Action Needed |
|------|-------|--------|-----|---------------|
| T006 | Neo   | Assigned | 6h | Agent hasn't acknowledged |
| T012 | Tab   | Acknowledged | 28h | Work hasn't started |

Options:
1. Ping agent to start work
2. Reassign to available agent
3. Escalate to Drew
```

---

## Error Handling

### No tasks.md Found
```
Error: No tasks.md found in feature directory.
Run /speckit.tasks first to generate the task list.
```

### No Agent Assignments in tasks.md
```
Warning: No agent assignments found in tasks.md.

To assign tasks to agents, add (AgentName) to task descriptions:
  - [ ] T001 Set up workflow (Neo)
  - [ ] T002 Create schema (Tab)

Available agents: Neo, Tab, Pixel, Spike, Maya, Echo, Iris, Sage, Ada, Rex, Adler
```

### Agent Not in Roster
```
Warning: Agent "[Name]" not found in roster.

Similar agents:
- Neo (n8n workflows, automation)
- Tab (Airtable, data operations)

Gap logged to .specify/memory/gaps/domain-gaps.json
Routing to Drew for resolution.
```

### Airtable MCP Not Available
```
Warning: Airtable MCP not available. Tasks will be tracked locally only.

Manual tracking required:
1. Tasks logged to {FEATURE_DIR}/tasks.md
2. Update status manually after completion
3. Log time entries manually when Airtable becomes available
```

### Agent Capacity Exceeded
```
⚠️  CAPACITY WARNING: Neo has 12 hours queued

Current queue:
- T001: Configure auth (2h) - In Progress
- T002: Build API (4h) - Assigned
- T003: Write tests (3h) - Assigned
- T004: Deploy (3h) - Assigned

Options:
1. Proceed anyway (agent may be delayed)
2. Reassign [T006, T007] to another agent
3. Wait for queue to clear

Proceed? [y/N]
```

### Task Rejected by Agent
```
Task T006 was REJECTED by Neo

Reason: "Workflow requires Apify credentials which are not configured in n8n"

Options:
1. Resolve blocker and re-assign to Neo
2. Reassign to another agent (suggested: Tab for credential setup)
3. Escalate to Drew for resolution

Task status updated to "Rejected" in Airtable.
```

---

## Examples

### Basic Handoff
```
/handoff
```
Parses active feature's tasks.md, creates Airtable tasks, outputs invocation commands.

### Specific Feature
```
/handoff 001-neo-workflow-management
```
Hands off tasks from specified feature directory.

### Specific Tasks
```
/handoff T006 T007
```
Hands off only the specified task IDs.

### Specific Agent
```
/handoff Neo
```
Hands off all tasks assigned to Neo.
