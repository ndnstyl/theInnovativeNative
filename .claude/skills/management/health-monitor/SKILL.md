---
name: health-monitor
description: |
  Drew's health monitoring system for all projects. Runs automated health checks,
  generates status reports, and triggers escalations when thresholds are breached.
  Invoke when:
  - Running project health checks
  - Generating weekly status reports
  - Checking escalation conditions
  - Monitoring project metrics
triggers:
  - "@drew health-check"
  - "project health"
  - "health monitor"
  - "weekly status"
  - "check all projects"
---

# Health Monitor - Drew's Project Monitoring System

## Purpose

Automated health monitoring for all projects in the digital business. Calculates health scores, identifies at-risk projects, and triggers escalations per the constitution.

## Startup Protocol

1. Load constitution from `.specify/memory/constitution.md`
2. Read Drew's learnings from `.specify/memory/learnings/drew-learnings.md`
3. Load project registry from `.specify/memory/projects/registry.json`
4. Load time log from `.specify/memory/projects/time-log.json`
5. Load escalation matrix from `.specify/memory/escalation-matrix.json`

## Health Score Calculation

### Inputs
- **Hours Logged**: From time-log.json for current week
- **Hours Target**: From registry.json (default 4/week)
- **Task Completion**: % of tasks marked complete
- **Blockers**: Count of blocked tasks
- **Escalations**: Open escalation count

### Formula
```
Base Score = 100

Deductions:
- Hours below target: -5 per hour under target (max -25)
- Low task completion (<80%): -10
- Each blocker: -5 (max -15)
- Each open escalation: -10 (max -20)
- No activity in 3+ days: -15

Bonuses:
- Hours exceed target: +5
- 100% task completion: +5
- Zero blockers for week: +5

Final Score = max(0, min(100, Base + Adjustments))
```

### Thresholds (Per Constitution IX.II)
| Score | Status | Action |
|-------|--------|--------|
| 80-100 | Green | Continue normal operations |
| 60-79 | Yellow | Monitor closely, address blockers |
| 0-59 | Red | Escalate to CEO, immediate action |

## Commands

### `health-check all`
Run health check on all active projects.

**Output Format**:
```markdown
# Health Check - [DATE]

## Summary
- Projects Checked: X
- Green: X | Yellow: X | Red: X
- Total Hours This Week: X / X target

## Project Status
| Project | Lead | Health | Hours | Status | Notes |
|---------|------|--------|-------|--------|-------|
| [name] | [lead] | [score] | [x/4] | [emoji] | [notes] |

## Escalations Triggered
- [List any new escalations]

## Recommendations
- [Action items]
```

### `health-check [project-id]`
Run health check on specific project.

### `weekly-report`
Generate full weekly status report using template at `.specify/memory/reports/weekly-report-template.md`.

### `escalation-check`
Check all escalation conditions without generating full report.

## Escalation Triggers

### From escalation-matrix.json

**Project Health**:
- Health < 60: Critical → Drew → #cerebro-alerts
- Health < 80: Warning → Project Lead → #project-updates

**Time Allocation**:
- Hours < 2 at 50% week: Warning → Drew → #project-updates
- Hours < 4 at 80% week: Critical → Drew → #cerebro-alerts

**Blockers**:
- Blocked > 24 hours: Warning → Project Lead
- Blocked > 48 hours: Critical → Drew

## Data Sources

### Primary (JSON Files)
```
.specify/memory/projects/registry.json    # Project definitions
.specify/memory/projects/time-log.json    # Time entries
.specify/memory/agents/roster.json        # Agent assignments
.specify/memory/agents/performance.json   # KPI tracking
.specify/memory/escalation-matrix.json    # Trigger thresholds
```

### Future (Airtable)
When TIN Internal Airtable is set up, switch to:
- Projects table with Health Score formula
- Time Entries table with rollups
- Escalations table for automated creation

## Notification Routing

### Critical (Immediate)
- Slack: #cerebro-alerts
- Method: Direct message with @mention
- Recipients: Drew, CEO

### Warning (Batched)
- Slack: #project-updates
- Method: Daily digest
- Recipients: Affected project leads

### Info (Weekly)
- Slack: #project-updates
- Method: Weekly report
- Recipients: All agents

## Integration with Echo (Slack Worker)

Health Monitor uses Echo for all Slack notifications:
```
@echo send #cerebro-alerts "[message]"
@echo send #project-updates "[message]"
```

## Weekly Rhythm

| Day | Task |
|-----|------|
| Monday | Review previous week, set priorities |
| Tuesday-Thursday | Monitor health, address issues |
| Thursday 2pm | Mid-week check, time allocation warnings |
| Friday 2pm | Generate weekly report |
| Friday EOD | Compile and send status |

## Output Files

### Generated Reports
```
.specify/memory/reports/
├── weekly-report-YYYY-MM-DD.md    # Weekly status reports
├── health-check-YYYY-MM-DD.json   # Health check snapshots
└── escalation-log-YYYY-MM.json    # Monthly escalation history
```

## Shutdown Protocol

1. Save health check results to `.specify/memory/reports/`
2. Update Drew's learnings if patterns discovered
3. Log any new escalations
4. Confirm monitoring session complete

## Slower is Faster

Accurate health monitoring prevents bigger problems. Take time to verify data before triggering escalations. False alarms erode trust in the system.
