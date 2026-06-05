---
paths:
  - "**/*airtable*"
  - "**/*tracking*"
  - ".specify/**"
description: Airtable table IDs and field names — loaded for Airtable work
---

# Airtable Schema

## Base: appTO7OCRB2XbAlak

### Core Tables
| Table | ID | Key Fields |
|-------|-----|-----------|
| Agents | tblj2uMe0M8xAW6u8 | Name, Role, Level |
| Projects | tbl6StWS4UGkX49Xs | Name, Status, Lead |
| Time Entries | tbl4FrwRqV02j2TSK | Entry Date, Agent, Project, Hours, Description, Tokens |
| Tasks | tbliXF3imV0uFxJSB | Title (not "Task Name"), Assignee (not "Agent"), Status |
| Deliverables | tblnUsXJ2ZHjZGcyu | Name, Type, Project |
| Escalations | tblwJgFjShWwG1yN4 | Type, Severity, Status |

### Key Record IDs
- theinnovativenative project: `rec1NqwMMWvv2PpVD`
- Drew (PM): `recANUnwKYsknrokD`
- lawfirm-rag: `recTCil7BdtXPDxLY`
- dea-data-silo: `rec39tpHSQQKycY22`

### Field Gotchas
- Tasks uses "Title" (not "Task Name"), "Assignee" (not "Agent")
- Always check existing data before schema changes
