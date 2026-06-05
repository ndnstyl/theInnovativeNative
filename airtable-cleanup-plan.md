# Airtable Cleanup Plan

**Created**: 2026-05-24
**Goal**: Reduce Airtable spend by getting TIN base under its plan's record limit + auditing 22 bases for deletion candidates.

## TL;DR

- TIN base over record limit → forces higher plan tier → ~$25/mo unnecessary spend
- 22 total bases on account, ~15 likely dormant
- Real savings lever = TIN base record cleanup (could drop plan tier)
- Dormant base cleanup = housekeeping/risk reduction, not direct cost savings

---

## Phase 1: TIN base table-by-table decision matrix

Base: `appTO7OCRB2XbAlak`

| Table | Records (est) | Code refs | Status | Recommendation | Action |
|-------|--------------|-----------|--------|----------------|--------|
| Agents | ~30 | 2 files | ACTIVE — reference table | KEEP | None |
| Projects | small | 2 files | ACTIVE — reference table | KEEP | None |
| **Time Entries** | **1000+** | 5 files | ACTIVE — grows forever | **PURGE OLD** | Delete records older than 2026-03-01 (keep last ~3 months) |
| **Tasks** | **500+** | 5 files | ACTIVE — grows | **PURGE COMPLETED** | Delete records where Status=Complete AND >60 days old |
| Deliverables | medium | 1 file | ACTIVE | KEEP | None |
| **KPI Tracking** | small | **0 refs** | All `Actual=0`, never populated. KPI framework that wasn't used. | **DELETE TABLE** | Delete via Airtable UI |
| **Time Sessions** | tiny | **0 refs** | Only 2 manual test records from Feb 2026 | **DELETE TABLE** | Delete via Airtable UI |
| **Workflows** | 1 record | **0 refs** | Single draft entry for "Cerebro Daily Research Ingestion" — superseded workflow | **DELETE TABLE** | Delete via Airtable UI |
| Publishing Calendar | medium | 31 files | ACTIVE — heavy use | KEEP | None |
| Subscriptions | small | 1 file | Stripe linked | KEEP | None |
| Payments | medium | 1 file | Stripe linked, append-only | KEEP, monitor | Review in 3 months for archive |
| **Leads** | medium | 4 files | ACTIVE | KEEP, but **DEDUPE** | Run dedup against Email |
| **Contacts** | LARGE | 32 files | Cerebro — heavy use, grows | KEEP, **PURGE STALE** | Delete contacts where Status=Unresponsive AND last_interaction > 90 days |
| Interactions | LARGE | 11 files | Cerebro outreach log — grows fast | **PURGE OLD** | Delete records >90 days old (Cerebro Reply Monitor inactive anyway) |
| Daily Research Items | medium | 1 file | Cerebro daily research — grows daily | **PURGE OLD** | Delete records >30 days old (research is ephemeral signal, not archival) |
| **Competitor Pain Points** | small | **0 refs** | Lexis+ AI competitive research for Cerebro | KEEP IF Cerebro still active, else **EXPORT + DELETE TABLE** | Confirm with Mike |
| **Cerebro Personas** | 6 records | **0 refs** | "NOT VALIDATED" personas P004-P006 | **EXPORT + DELETE TABLE** if abandoned | Confirm with Mike |
| **Character Sheets** | medium | **0 refs** | BowTie character prompts (Red Nose Pitbull) | KEEP IF BowTie continues, else **EXPORT + DELETE TABLE** | Confirm BowTie status |
| **Generated Poses** | medium | **0 refs** | BowTie pose outputs to GDrive | Same as Character Sheets | Confirm BowTie status |
| Episodes | small | 1 file | BowTie episode tracking | Same | Confirm |
| Scenes | medium | 10 files | BowTie production | Same | Confirm — heavy ref but BowTie status unknown |
| **Digest Analytics** | **0 records** | **0 refs** | Empty | **DELETE TABLE** | Delete via Airtable UI |
| **Content Insights** | active, 5 weeks data | **0 refs** in jobHunt/scripts | Has data populated weekly (Top/Bottom posts analysis) — workflow likely lives in live n8n not local files | KEEP, verify which workflow writes to it | Don't delete |
| Health Snapshots | medium | 1 file | Cerebro Daily Health Check writes here | KEEP, **PURGE OLD** | Delete records >30 days old |
| **Heartbeats** | LARGE | 3 files | Fleet Monitor heartbeats — append every workflow ping | **PURGE OLD** | Delete records >7 days old (heartbeats are real-time signal only) |
| **Agent Actions** | LARGE | 1 file | Per-action logging | **PURGE OLD** | Delete records >30 days old |

### Likely record-budget eaters (in priority order)

1. **Heartbeats** — fleet monitor pings every workflow every interval. Could be 10K+ records. Purging >7 days old likely frees 90% of records.
2. **Time Entries** — agent activity logging. 1000+ records and growing. Purging >3 months frees ~70%.
3. **Agent Actions** — per-action logs. Append-only. Purging >30 days frees most.
4. **Interactions** — Cerebro outreach attempts. Cerebro is inactive but old data lingers.
5. **Daily Research Items** — daily appends. >30 day cutoff frees nearly everything.

---

## Phase 2: 22-base audit

Bases on account (`mcp__airtable-mcp__list_bases` result):

| Base | ID | Likely status | Recommendation |
|------|-----|---------------|----------------|
| The Innovative Native LLC | `appTO7OCRB2XbAlak` | **ACTIVE — primary** | KEEP |
| OzhiCRMv1.0(JobHunt) | `app1l9UIq9DhpW0KT` | **ACTIVE — primary job hunt base** | KEEP |
| Sales CRM | `appB1e1awi8xD9rk9` | Unknown — could be active | INSPECT FIRST |
| GovCon CRM | `app0G4lF8YWV0pFkv` | Old GovCon project per memory (workflows superseded) | EXPORT + DELETE |
| **OzhiCRM v1.0 (Demo)** | `appgbBZVQeFpTakxH` | Demo | DELETE |
| **OzhiCRMv1.0(Template) (Download)** | `appCVw2UCIdTAN31C` | Template download copy | DELETE |
| **OzhiCRMv1.0(Template) (jobhunter)** | `appVh4yqhT4G51SbG` | Template copy | DELETE |
| **VSL Meta Ad Agency in a Box** | `appN95cdKLjSRoXvw` | Template | DELETE unless original source |
| **VSL Meta Ad Agency in a Box (Copy)** | `appvusRP3LueIQ1Q9` | Explicit "Copy" | DELETE |
| **Linkedin Content Agency (Demo)** | `appiksdLCv8hm0fe9` | Demo | DELETE |
| **Linkedin Competitor Analytics (Demo)** | `app7eTf2IjCijK1Ov` | Demo | DELETE |
| **AI Sales CRM (Demo)** | `app5Pfck6cBMhBWmW` | Demo | DELETE |
| AI Viral Content OS | `appBg98AyxhX6m3wz` | Unknown — possibly active for TIN content engine | INSPECT FIRST |
| **TrendPilot AI™ (Template)** | `appvg6I8Z9XaDsFgE` | Template | DELETE |
| **TrendPilot AI™ (Template) (December 5, 2025)** | `appiR5yWGTSjzysuN` | Dated template copy | DELETE |
| AI Newsletter | `app0TYqQoAuUdhe3g` | Unknown | INSPECT |
| **Nano Ad Machine** | `apph1w0jH6cIQxB6v` | Workflow marked SUPERSEDED in memory | EXPORT + DELETE |
| IG Reels Pipeline | `app4W8Rd1jyfFImtR` | Could be active or stale | INSPECT |
| **HavenlySent** | `appWVJhdylvNm07nv` | Workflows archived in memory | EXPORT + DELETE |
| **Tiny Home Timelapse** | `appCOlvJdsSeh0QPe` | Old personal project | DELETE if abandoned |
| Haven | `appJ3LifWy0j6v9PR` | aSliceOfHaven (Haven agent still active in TIN base) | INSPECT — keep if Haven project continues |
| LeadGen OS | `appjPTosnIsD5mICY` | Unknown | INSPECT |

**Hard deletes (clear cut)**: 8 demo/template/copy bases — `OzhiCRM v1.0 (Demo)`, `OzhiCRMv1.0(Template) (Download)`, `OzhiCRMv1.0(Template) (jobhunter)`, `VSL Meta Ad Agency in a Box (Copy)`, `Linkedin Content Agency (Demo)`, `Linkedin Competitor Analytics (Demo)`, `AI Sales CRM (Demo)`, `TrendPilot AI™ (Template) (December 5, 2025)`

**Likely deletes after Mike confirms**: GovCon CRM, Nano Ad Machine, HavenlySent, Tiny Home Timelapse, VSL Meta original, TrendPilot template original — 6 more

**Need Mike to inspect/decide**: Sales CRM, AI Viral Content OS, AI Newsletter, IG Reels Pipeline, Haven, LeadGen OS — 6 to review

**Keep no question**: TIN, OzhiCRM(JobHunt) — 2

---

## Phase 3: User seat audit

Open Airtable → Workspace settings → Members. For each editor:
- Are they actively collaborating? If not, downgrade to Viewer (free) or remove
- Each editor at Team plan = $20/mo
- Each editor at Business plan = $45/mo

This requires Mike opening the UI — I can't audit seats via MCP.

---

## What I CAN execute via MCP (with explicit OK per item)

| Action | Capable via MCP? | Notes |
|--------|------------------|-------|
| Delete records (purge old data) | YES | `delete_records` — needs record IDs |
| Delete entire table | NO | Mike does in Airtable UI |
| Delete entire base | NO | Mike does in Airtable UI |
| Export table to CSV before delete | NO directly | Mike does via "..." → Download CSV in UI |
| Re-grep workflows for table refs | YES | Already done |

---

## Recommended execution sequence

### Today (no risk — 100% reversible-from-export)
1. Mike: Open each "INSPECT FIRST" base in UI, decide keep/delete (10 min total)
2. Mike: Export-then-delete the 8 clear-cut demo/template bases in UI (15 min)
3. Mike: Audit user seats, downgrade non-active to Viewer (5 min)

### After Mike confirms scope (this Claude session, executed via MCP)
4. Purge Heartbeats records older than 7 days (likely 90% of table)
5. Purge Time Entries older than 3 months
6. Purge Agent Actions older than 30 days
7. Purge Interactions older than 90 days
8. Purge Daily Research Items older than 30 days
9. Purge Health Snapshots older than 30 days
10. Dedupe Leads on Email field
11. Purge Contacts where Status=Unresponsive AND last_interaction > 90 days

### Mike does in Airtable UI (after confirming nothing critical lives there)
12. Delete tables: KPI Tracking, Time Sessions, Workflows, Digest Analytics, plus any of (Cerebro Personas, Character Sheets, Generated Poses, Competitor Pain Points) that get confirmed unused

### Post-cleanup audit
13. Check TIN base record count — did we get under the plan ceiling?
14. If yes — downgrade to cheaper Airtable plan
15. Set up a quarterly cleanup reminder (cron job) for the append-only tables that grow forever

---

## Estimated savings

| Lever | Monthly | Annual |
|-------|---------|--------|
| Downgrade Business → Team (1 seat) | -$25 | -$300 |
| Remove 1 unused editor seat (if applicable) | -$20-45 | -$240-540 |
| Total potential | $45-70/mo | $540-840/yr |

Plus reduced clutter / cognitive load from 22 → 5-8 bases, faster Airtable UI, lower attack surface.

---

## What I need from Mike to proceed

For each section below, just give me "yes" / "no" / "skip" and I'll execute via MCP what I can. Or say "execute the safe ones" and I'll do everything in the "no risk" category without further confirmation:

**Phase 1 record purges (I can do via MCP)**:
- [ ] Purge Heartbeats >7 days old
- [ ] Purge Time Entries >3 months old (cutoff: 2026-02-24)
- [ ] Purge Agent Actions >30 days old
- [ ] Purge Interactions >90 days old
- [ ] Purge Daily Research Items >30 days old
- [ ] Purge Health Snapshots >30 days old
- [ ] Dedupe Leads on Email
- [ ] Purge Contacts (Unresponsive >90 days)

**Phase 2 base deletions (Mike does in UI, I provide list)**:
- [ ] 8 clear-cut demos/templates
- [ ] 6 likely-stale after inspection
- [ ] 6 need-inspection

**Phase 3 (Mike does in UI)**:
- [ ] User seat audit
- [ ] Plan downgrade (if record count permits)

---

## Memory updates after execution

Once cleanup is done, update `.specify/memory/airtable-cleanup-protocol.md` (new file) with:
- Quarterly purge schedule for append-only tables
- Rule: any new table needs a documented retention policy before creation
- Rule: any new base needs justification (template/demo bases stay disposable, real bases need a continuing reason)
- Cron job for automated quarterly purges of high-volume tables
