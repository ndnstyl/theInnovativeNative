---
description: Adversarial QA + shutdown logging. Reviews all deliverables for quality, brand alignment, and consistency. Logs tasks, time, tokens, learnings, and skills gaps.
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty). The user may specify:
- A specific feature directory (e.g., `specs/002-stan-store-lawfirm-funnel`)
- Specific deliverable paths to review
- `--skip-qa` to skip QA and only run shutdown logging
- `--skip-logging` to skip logging and only run QA

---

## ToughLove Protocol

This command runs two phases: **Adversarial QA** then **Shutdown Logging**. No participation trophies. If it's bad, say it's bad.

---

## Phase 1: Adversarial QA Review

### 1.1 Locate Deliverables

If user specified a feature directory, use it. Otherwise:
- Run `.specify/scripts/bash/check-prerequisites.sh --json` to find active feature
- Scan `deliverables/` for the matching directory
- If no deliverables found: ERROR "Nothing to review. Build something first."

### 1.2 Deploy QA Agents (Parallel)

Launch **3 adversarial review agents** simultaneously using the Task tool:

#### Agent A: Copy & Content QA
**What to review**: All `.md` files in `deliverables/{feature}/assets/` and `deliverables/{feature}/content/`

**Checklist** (fail any = flag it):
- [ ] **Legibility**: No walls of text. Paragraphs <4 sentences. Headers every 3-5 paragraphs.
- [ ] **Brand voice**: Direct, practical, no hype. Flag guru-speak, FOMO tactics, unsubstantiated claims, superlatives without data.
- [ ] **Compelling**: Would the target audience keep reading past paragraph 2? Flag boring or generic sections.
- [ ] **Consistency**: Numbers match across documents. CTAs point to the right things. Product names consistent.
- [ ] **Legal/Ethics**: No claims that could violate attorney advertising rules (ABA 7.1-7.3). Disclaimers present where needed.
- [ ] **Completeness**: No unfilled placeholders (`REPLACE`, `TODO`, `[YOUR_X]`). No broken references.
- [ ] **Spelling/Grammar**: Zero tolerance. Every typo is a brand hit.

**Output**: `deliverables/{feature}/qa/copy-review.md`
- Grade each file A-F
- List specific issues with quotes
- End with "Critical Fixes" (must-fix before launch)

#### Agent B: Visual/PPTX QA
**What to review**: All `.pptx` files in `deliverables/{feature}/`

Use python-pptx to programmatically inspect every slide:

```python
from pptx import Presentation
# For each PPTX: check backgrounds, fonts, colors, text sizes, overlaps
```

**Checklist** (fail any = flag it):
- [ ] **Backgrounds**: Every slide has explicit background set (not default white)
- [ ] **Colors**: All colors match brand system (check hex values programmatically)
- [ ] **Fonts**: Only brand fonts used (Playfair Display, Inter, JetBrains Mono)
- [ ] **Text size**: No text below 12pt. Headlines 28pt+. Body 14pt+.
- [ ] **Contrast**: No dark text on dark background. No light text on light.
- [ ] **Layout variety**: 7+ distinct layout types. No more than 3 consecutive same-type slides.
- [ ] **Slide count**: Matches spec requirements
- [ ] **CTA slides**: Present and have correct links/info

**Output**: `deliverables/{feature}/qa/pptx-review.md`
- Grade each presentation A-F
- List slide-by-slide issues
- End with "Critical Fixes"

#### Agent C: Integration & Specs QA
**What to review**: All technical specs, contracts, data models

**Checklist** (fail any = flag it):
- [ ] **Field name consistency**: Airtable fields match across all docs that reference them
- [ ] **Webhook payloads**: Contract matches what workflow expects. Zapier mappings align.
- [ ] **Logic consistency**: Classification rules (free/paid, lead/buyer) identical everywhere
- [ ] **Numbers alignment**: ROI claims in copy match calculator assumptions
- [ ] **Missing connections**: Any spec references something undefined elsewhere
- [ ] **Data model alignment**: Schema docs match implementation specs

**Output**: `deliverables/{feature}/qa/integration-review.md`
- Grade each spec A-F
- End with "Critical Mismatches"

### 1.3 Compile QA Summary

After all 3 agents complete, read their reports and compile:

**Output**: `deliverables/{feature}/qa/SUMMARY.md`

```markdown
# QA Summary: {Feature Name}

**Date**: {today}
**Overall Grade**: {worst grade from any file}

## Grades
| Deliverable | Grade | Critical Issues |
|-------------|-------|-----------------|
| {file}      | {A-F} | {count}         |

## Critical Fixes (Must-Fix Before Launch)
1. {issue} — {file}:{line} — {fix}

## Warnings (Should-Fix)
1. {issue} — {file} — {recommendation}

## Passed (No Issues)
- {list of clean files}

## Verdict
{LAUNCH READY / NOT READY — with specific blockers}
```

---

## Phase 2: Shutdown Logging

### 2.1 Task Inventory

Scan `specs/{feature}/tasks.md` and compare against deliverables produced:

**Output table**:
```
| Task ID | Description | Status | Deliverable | Notes |
|---------|-------------|--------|-------------|-------|
| T001    | ...         | Done   | path/to/file| ...   |
| T010    | ...         | Blocked| -           | Needs LibreOffice |
```

### 2.2 Time & Token Summary

Calculate from the current session:
- Total agents deployed
- Estimated hours (based on agent run durations)
- Total tokens consumed (from task notifications)
- Cost estimate at current rates

**Output**:
```
## Session Metrics
| Metric | Value |
|--------|-------|
| Agents deployed | {N} |
| Total tokens | {N} |
| Estimated hours | {N} |
| Deliverables produced | {N} |
| Files created/modified | {N} |
```

### 2.3 Learnings Capture

Review the session for patterns, mistakes, and discoveries. Update:

1. **Shared learnings** (`.specify/memory/learnings/shared-learnings.md`):
   - New patterns that help all agents
   - Mistakes to avoid
   - Tool/integration discoveries

2. **Agent-specific learnings** (if relevant):
   - Any agent that hit a blocker
   - Workarounds discovered
   - Capability gaps

### 2.4 Skills Gap Analysis

Identify any capability the team lacked during this sprint:

```markdown
## Skills Gaps Identified

| Gap | Impact | Recommended Fix |
|-----|--------|-----------------|
| No LibreOffice for PDF export | Can't complete T010/T013 | Install or add to agent toolchain |
| Creative can't execute Python | Had to hand off PPTX generation | Grant Bash permissions or use Builder |
```

Log gaps to `.specify/memory/gaps/` if directory exists.

### 2.5 Airtable Logging Reminder

Output the exact records that should be logged:

```markdown
## Airtable Records to Create

### Time Entries Table
| Entry Date | Agent | Project | Hours | Description | Tokens |
|------------|-------|---------|-------|-------------|--------|
| {date}     | {agent} | {project} | {hrs} | {desc} | {tokens} |

### Tasks Table
| Title | Assignee | Project | Status | Notes |
|-------|----------|---------|--------|-------|
| {title} | {agent} | {project} | {status} | {notes} |

### Deliverables Table
| Name | Local Path | Status | Notes |
|------|-----------|--------|-------|
| {name} | {path} | Ready | {notes} |
```

If Airtable MCP is available, create these records automatically.
If not, output them for manual entry.

---

## Output Summary

End with a single status block:

```
============================================
TOUGHLOVE REPORT: {Feature Name}
============================================
QA Grade:       {A-F}
Launch Ready:   {YES/NO}
Critical Fixes: {count}
Warnings:       {count}
Tasks Done:     {done}/{total}
Tasks Blocked:  {count} (with reasons)
Learnings:      {count} new entries
Gaps Found:     {count}
Airtable:       {LOGGED/NEEDS MANUAL ENTRY}
============================================
```

---

## Error Handling

### No Deliverables Found
```
Error: No deliverables found for this feature.
Nothing to review. Build something first, then come back for tough love.
```

### QA Agent Fails
If any QA agent errors out, note the failure and continue with remaining agents. Partial QA is better than none.

### Airtable Not Available
Log everything to local markdown files. Output records for manual entry. Never skip logging just because automation is down.

---

## Philosophy

This command exists because:
1. **"Done" is not "good."** Shipping garbage damages the brand more than shipping late.
2. **Adversarial review catches what optimistic builders miss.** The person who built it is the worst person to review it.
3. **Logging is accountability.** If Drew can't see it in Airtable, your work is invisible.
4. **Learnings compound.** Every session that doesn't log learnings wastes the next session's time.
5. **Gaps feed growth.** Skills you lack today should be capabilities you have tomorrow.

No participation trophies. No "looks great!" without evidence. Fix what's broken, log what was done, learn from what happened.
