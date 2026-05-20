---
name: performance-tracker
description: |
  KPI tracking and performance management system. Monitors agent performance
  against targets, generates performance reports, and identifies trends.
  Invoke when:
  - Tracking agent KPIs
  - Generating performance reports
  - Reviewing targets vs actuals
  - Identifying performance trends
triggers:
  - "@drew performance"
  - "kpi tracking"
  - "performance report"
  - "agent performance"
  - "track metrics"
---

# Performance Tracker - Agent KPI Management

## Purpose

Track, measure, and report on agent performance against defined KPIs. Supports the Performance Standards defined in Constitution Section IX.

## Startup Protocol

1. Load constitution from `.specify/memory/constitution.md`
2. Read Drew's learnings from `.specify/memory/learnings/drew-learnings.md`
3. Load agent roster from `.specify/memory/agents/roster.json`
4. Load performance data from `.specify/memory/agents/performance.json`

## KPI Definitions (Per Constitution IX.V)

### Senior Staff KPIs

| Agent | Metric | Target | Unit | Direction |
|-------|--------|--------|------|-----------|
| **Jenna** | File Organization Score | 95% | Percent | Higher |
| **Jenna** | Git Hygiene Score | 95% | Percent | Higher |
| **Jenna** | Scheduling Accuracy | 95% | Percent | Higher |
| **Drew** | Projects at Target | 90% | Percent | Higher |
| **Drew** | Health Scores Avg | 80 | Score | Higher |
| **Drew** | Escalations Resolved | 95% | Percent | Higher |
| **Patricia** | Deliverables on Time | 95% | Percent | Higher |
| **Patricia** | Data Quality Score | 95% | Percent | Higher |
| **Risa** | Invoice Accuracy | 99% | Percent | Higher |
| **Risa** | Reports on Time | 100% | Percent | Higher |
| **Chris** | Content Pieces/Week | 3 | Count | Higher |
| **Chris** | Brand Voice Compliance | 95% | Percent | Higher |
| **Chris** | Engagement Lift | 10% | Percent | Higher |

### Worker KPIs

| Agent | Metric | Target | Unit | Direction |
|-------|--------|--------|------|-----------|
| **Neo** | Workflows Built | 5/week | Count | Higher |
| **Neo** | Error Rate | 5% | Percent | Lower |
| **Neo** | Execution Success | 95% | Percent | Higher |
| **Tab** | Records Processed | 100/week | Count | Higher |
| **Tab** | Sync Freshness | 1 hour | Hours | Lower |
| **Echo** | Messages Sent | 50/day | Count | Higher |
| **Echo** | Response Time | 5 min | Minutes | Lower |
| **Echo** | Delivery Rate | 99% | Percent | Higher |
| **Iris** | Emails Processed | 100/week | Count | Higher |
| **Iris** | Inbox Zero Days | 5/week | Days | Higher |
| **Sage** | Pages Updated | 20/week | Count | Higher |
| **Sage** | Link Health | 95% | Percent | Higher |
| **Maya** | Ideas Generated | 10/week | Count | Higher |
| **Maya** | Ideas Approved | 30% | Percent | Higher |
| **Spike** | Videos Rendered | 3/week | Count | Higher |
| **Spike** | Export Success | 100% | Percent | Higher |
| **Ada** | Scripts Written | 5/week | Count | Higher |
| **Ada** | Test Coverage | 80% | Percent | Higher |
| **Rex** | PRs Managed | 10/week | Count | Higher |
| **Rex** | CI Passes | 95% | Percent | Higher |

## Commands

### `performance-report [agent]`
Generate performance report for specific agent or all agents.

**Output Format**:
```markdown
# Performance Report - [Agent Name]
## Period: [Start] - [End]

### KPI Summary
| Metric | Target | Actual | Status | Trend |
|--------|--------|--------|--------|-------|
| [metric] | [target] | [actual] | [emoji] | [arrow] |

### Achievement Rate: [X]%

### Observations
- [Notable patterns or issues]

### Recommendations
- [Action items]
```

### `kpi-update [agent] [metric] [value]`
Update actual value for a specific KPI.

### `performance-trends [period]`
Show performance trends over specified period (week, month, quarter).

### `top-performers`
List agents exceeding targets across all KPIs.

### `needs-attention`
List agents below target thresholds.

## Achievement Calculation

### Individual KPI
```
If Direction = "Higher":
  Achievement = (Actual / Target) * 100

If Direction = "Lower":
  Achievement = (Target / Actual) * 100 if Actual > 0
               = 100 if Actual <= Target
```

### Status Thresholds
| Achievement | Status | Color |
|-------------|--------|-------|
| >= 100% | Exceeding | Green |
| 80-99% | On Track | Yellow |
| < 80% | Below Target | Red |

### Agent Overall Score
```
Overall = Average of all KPI achievements (weighted equally)
```

## Data Storage

### performance.json Structure
```json
{
  "version": "1.0.0",
  "lastUpdated": "YYYY-MM-DD",
  "reportingPeriod": {
    "weekStart": "YYYY-MM-DD",
    "weekEnd": "YYYY-MM-DD"
  },
  "agents": {
    "[agentId]": {
      "name": "Agent Name",
      "role": "Role",
      "kpis": {
        "[metricName]": {
          "target": 95,
          "actual": null,
          "unit": "percent",
          "direction": "higher-is-better"
        }
      },
      "status": "active"
    }
  }
}
```

## Reporting Cadence

| Period | Report Type | Audience |
|--------|-------------|----------|
| Weekly | KPI Summary | Drew, CEO |
| Monthly | Trend Analysis | All Staff |
| Quarterly | Performance Review | CEO |

## Integration Points

### With Health Monitor
- Performance data feeds into project health calculations
- Low performer patterns may indicate project issues

### With Time Log
- Hours logged contributes to productivity KPIs
- Time allocation affects project-level metrics

### Future: Airtable Integration
- KPI Tracking table as source of truth
- Automated rollups and calculations
- Dashboard views for monitoring

## Shutdown Protocol

1. Save updated performance data to `.specify/memory/agents/performance.json`
2. Update Drew's learnings if patterns discovered
3. Flag any agents needing attention
4. Confirm tracking session complete

## Slower is Faster

Accurate performance tracking requires careful measurement. Verify data quality before drawing conclusions. Premature judgments on performance erode team trust.
