# Feedback Loop Setup Guide

**Purpose**: Enable frictionless human review and revision cycles for marketing deliverables
**Created**: 2026-02-06

---

## 1. Manual Status Options (Required)

Add these to the **Deliverables → Status** field:

| Status | Color | Description |
|--------|-------|-------------|
| Revision Needed | Yellow | Flagged for fixes |
| In Review | Purple | Resubmitted, awaiting approval |

---

## 2. Airtable Automation Setup

### Automation 1: Flag → Status Change

**Name**: "Set Revision Needed when flagged"
**Trigger**: When record matches conditions
- Table: Deliverables
- Condition: `Needs Revision` is checked

**Action**: Update record
- Status → "Revision Needed"
- Revision Count → `{Revision Count} + 1` (formula: IF(Revision Count, Revision Count + 1, 1))

---

### Automation 2: Unflag → Ready for Review

**Name**: "Set In Review when unflagged"
**Trigger**: When record updated
- Table: Deliverables
- Field: `Needs Revision`

**Condition**: `Needs Revision` is unchecked AND `Status` = "Revision Needed"

**Action**: Update record
- Status → "In Review"

---

## 3. View Specifications

Create these views in the Deliverables table:

### "Pixel - My Revisions"
**Filter**:
- `Needs Revision` = checked
- `Created By` contains "Pixel" (or linked to Pixel record)

**Sort**: Created Date (newest first)

**Fields shown**: Name, Type, Project, Revision Notes, Revision Count, File URL

---

### "Spike - My Revisions"
**Filter**:
- `Needs Revision` = checked
- `Created By` contains "Spike"

**Sort**: Created Date (newest first)

---

### "Chris - My Revisions"
**Filter**:
- `Needs Revision` = checked
- `Created By` contains "Chris"

**Sort**: Created Date (newest first)

---

### "Drew - All Revisions"
**Filter**:
- `Status` = "Revision Needed" OR `Status` = "In Review"

**Sort**: Status, then Created Date

**Use**: PM oversight of all pending revisions

---

## 4. Workflow

```
You spot issue → Check "Needs Revision" → Write clear instructions in "Revision Notes"
                                                    ↓
                              Automation sets Status = "Revision Needed"
                              Revision Count increments
                                                    ↓
                         Domain owner sees it in their "My Revisions" view
                                                    ↓
                              Owner fixes → Unchecks "Needs Revision"
                                                    ↓
                              Automation sets Status = "In Review"
                                                    ↓
                              You review in Drew's view
                                     ↓
                     Approved? → Set Status = "Ready"
                         ↓ No
                     Re-flag with new notes (loop continues)
```

---

## 5. Writing Good Revision Notes

**Bad**: "Fix the glow"
**Good**: "Slides 2, 4, 7: Text glow effect is too strong - reduce opacity from 100% to 30% or remove entirely. Text should be readable without squinting."

Include:
- Which specific items (slide numbers, elements)
- What exactly is wrong
- What the fix should look like
