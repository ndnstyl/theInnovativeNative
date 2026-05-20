# SOP: Drew Oversight for Neo Workflow Management

**Created**: 2026-02-05
**Owner**: Drew (PM)
**Related Feature**: `specs/001-neo-workflow-management/`

---

## Purpose

This SOP defines how Drew (PM) monitors Neo's daily workflow health audits and maintains oversight of the n8n workflow ecosystem.

---

## Daily Oversight Checklist

### Morning Check (by 9 AM)

- [ ] Open Airtable Workflows table
- [ ] Check "Neo Audit Status" view - verify Last Audit = today for all workflows
- [ ] Check "Red Alert Workflows" view - review any workflows with Health Score < 60
- [ ] Check #cerebro-alerts Slack channel for overnight alerts
- [ ] If Neo missed audit: Escalate to CEO

### Weekly Review (Friday)

- [ ] Check "Tier 1 Workflows" view - ensure all high-priority workflows have Health Score >= 80
- [ ] Review "Unlinked Workflows" view - assign orphaned workflows to projects
- [ ] Review pattern extraction progress in `.specify/patterns/`
- [ ] Log Weekly Report to Airtable

---

## Airtable Views to Create

Create these views manually in the Workflows table (tblYm6SNOu8lcyNTV):

### 1. Neo Audit Status
- **Purpose**: Verify Neo completed daily audit
- **Filter**: None (show all workflows)
- **Sort**: Last Audit (descending)
- **Fields shown**: Workflow Name, Last Audit, Health Score, Status

### 2. Tier 1 Workflows
- **Purpose**: Monitor high-priority workflows
- **Filter**: Priority Tier = "1"
- **Sort**: Health Score (ascending) - worst at top
- **Fields shown**: Workflow Name, Health Score, Last Run Status, Error Message, Project

### 3. Red Alert Workflows
- **Purpose**: Immediate attention needed
- **Filter**: Health Score < 60
- **Sort**: Health Score (ascending)
- **Fields shown**: Workflow Name, Health Score, Last Run Status, Error Message, Last Run

### 4. Yellow Warning Workflows
- **Purpose**: Degraded but not critical
- **Filter**: Health Score >= 60 AND Health Score < 80
- **Sort**: Health Score (ascending)
- **Fields shown**: Workflow Name, Health Score, Last Run Status, Last Run

### 5. Unlinked Workflows
- **Purpose**: Identify orphaned workflows for triage
- **Filter**: Project = empty
- **Sort**: Workflow Name (alphabetical)
- **Fields shown**: Workflow Name, Category, Health Score, Description

### 6. By Priority Tier
- **Purpose**: Overview grouped by importance
- **Filter**: None
- **Group by**: Priority Tier
- **Sort**: Health Score (ascending) within groups
- **Fields shown**: Workflow Name, Category, Health Score, Status

---

## Escalation Triggers

| Condition | Action | Channel |
|-----------|--------|---------|
| Neo missed daily audit | Escalate to CEO | #cerebro-alerts + email |
| Tier 1 workflow Red alert | Immediate investigation | #cerebro-alerts |
| 3+ Tier 1 workflows Yellow | Review with Neo | #project-updates |
| Pattern extraction stalled | Check with Neo | Airtable Tasks |

---

## Metrics to Track

| Metric | Target | Frequency |
|--------|--------|-----------|
| Daily audit completion | 100% | Daily |
| Tier 1 average health | >= 80 | Weekly |
| Red alert resolution time | < 24 hours | Per incident |
| Patterns documented | 20+ in first month | Weekly |
| Unlinked workflows | 0 | Weekly |

---

## Related Documents

- Feature Spec: `specs/001-neo-workflow-management/spec.md`
- Implementation Plan: `specs/001-neo-workflow-management/plan.md`
- Tasks: `specs/001-neo-workflow-management/tasks.md`
- Neo Skill: `.claude/skills/workers/neo-n8n/SKILL.md`
- Pattern Library: `.specify/patterns/README.md`
