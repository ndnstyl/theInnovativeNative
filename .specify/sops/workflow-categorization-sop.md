# SOP: Workflow Categorization and Prioritization

**Created**: 2026-02-05
**Owner**: Neo (n8n specialist)
**Related Feature**: `specs/001-neo-workflow-management/`

---

## Purpose

Define criteria for categorizing n8n workflows by Priority Tier and Category to focus maintenance effort on high-value workflows.

---

## Priority Tiers

### Tier 1 - Critical (Immediate Attention)
**Criteria**: Active operations, revenue-impacting, or daily/hourly automation
**Alert Routing**: Red alerts go to #cerebro-alerts immediately
**Health Target**: Maintain 80+ average

**Examples**:
- Rize time tracking workflows (daily operational)
- Active marketing/social workflows (Nano/Banano)
- Email and calendar agents
- Active client-facing workflows

### Tier 2 - Important (Same-Day Response)
**Criteria**: Supporting operations, internal tools, or pattern sources
**Alert Routing**: Red alerts go to daily batch in #project-updates
**Health Target**: Maintain 60+ average

**Examples**:
- GovCon internal workflows
- Completed client projects (UK Local Services)
- BodyCam Bandits (FFmpeg patterns)
- Supporting subflows and utilities

### Tier 3 - Low Priority (Weekly Review)
**Criteria**: Experimental, templates, deprecated without pattern value
**Alert Routing**: Included in weekly summary only
**Health Target**: Monitor only

**Examples**:
- "My workflow X" unnamed experiments
- Template workflows not in active use
- Deprecated workflows without reusable patterns

---

## Categories

### Universal
**Definition**: Workflows that support core operations across multiple projects
**Examples**: Email Agent, Calendar Agent, Rize workflows, X Post Tool

### Project
**Definition**: Workflows tied to a specific client or internal project
**Examples**: GovCon workflows, UK Local Services workflows

### Experimental
**Definition**: Prototypes, tests, or workflows under development
**Examples**: "My workflow" series, template tests

### Deprecated
**Definition**: No longer active but may contain valuable patterns
**Sub-tag**: Add "Pattern Source" notation if reusable components exist
**Examples**: UK Local Services (obsolete) workflows, BodyCam V1-V3 versions

---

## Workflow Inventory (161 Total)

Based on CEO guidance, categorize as follows:

### Tier 1 / Universal (Immediate Priority)
| Workflow Name | ID | Notes |
|---------------|-----|-------|
| combine images nanaoBanana | YhHMBUnYixL2gce9 | Active marketing |
| edit with nanoBanana | uNlGjRPCtL47ilfA | Active marketing |
| X Post Tool | nrvR6PcGZbLzz1bP | Core social |
| Content Agent | F2erzYlrB39L4JuW | Core tool |
| combine images nano | qBGC2vYWsLQQTapj | Active marketing |
| edit images nano | uSO6UPpsnhNdLoMC | Active marketing |
| Create Doc Tool | xu6nX4LSUIxE4gxR | Core tool |
| Create Image Tool | MzyeDU9oh8AG0mUI | Core tool |
| Create Video Tool | 4lr35gZ6AsWlkqIJ | Core tool |
| Edit Image Tool | 0eJWKHVKKQ3jAC2s | Core tool |
| Image to Video tool | LNbk2qXzcuZH4JvR | Core tool |
| post to instagram tool | FX9wIpWziRfQVsGP | Core social |
| Tik Tok Post Tool | KtvVzEHr4SSt2Idi | Core social |
| Email Agent | EtyXJtjKxAJervYn | Core operations |
| Calendar Agent | lMW4wCHb7pu1n9jA | Core operations |
| Contacts Agent | 8Q9akdqaeWMuIp8N | Core operations |
| Rize Daily Time Report | URwEBMpHfXuCoU3i | Daily operational |
| Rize Weekly Time Report | AgHgjEaeCoVjXRS9 | Weekly operational |
| Rize Session Logger | iLxScC9EAcEfh0HP | Session tracking |
| Linkedin & Instagram Automation | 9WJvczLs1npwcKdr | Active social |

### Tier 2 / Project - GovCon (Internal)
| Workflow Name | ID | Notes |
|---------------|-----|-------|
| GovCon - Airtable to Google Drive Sync | fomNYLSt0MwnAJUb | Internal |
| GovCon - USASpending Award Scan | zbnEopH6gEytKIj4 | Internal |
| GovCon - Deadline Alerts | qddvetDyG1TSHnoo | Internal |
| GovCon Pipeline CRM v2.0 | iXKfLlg8G8xTWFwR | Internal |
| GovCon - Stage Transition Handler | VLfj9VRbpD2coeaf | Internal |
| GovCon - USASpending Tools | WzbchhfqLwBfudW2 | Internal |
| GovCon RAG Agent | mh5qDsQjB5DMMGNK | Internal |
| GovCon - SAM.gov Document Fetcher | U6rXxmUM64yHfGko | Internal |

### Tier 2 / Deprecated - UK Local Services (Pattern Source)
| Workflow Name | ID | Pattern Value |
|---------------|-----|---------------|
| UK Local Services - Validation | 2SyTeN54FlLIdtFz | Data validation patterns |
| UK Local Services - GeoDirectory Export | HqRN7Zhad0sE9cY4 | Export patterns |
| UK Local Services - Scoring | jssdpuRzFs7wKGGa | Scoring algorithm |
| UK Local Services - Premium Enrichment | 4ps5viE4lArxFXas | Enrichment patterns |
| UK Local Services - Discovery (NEW) | 6rCntrDgmCvsjXfN | Discovery patterns |
| UK Local Services - Database Cleanup | XzpsCGRSYsomJfjC | Cleanup patterns |
| UK Local Services - * (obsolete) | Various | Historical reference |

### Tier 2 / Deprecated - BodyCam Bandits (FFmpeg Pattern Source)
| Workflow Name | ID | Pattern Value |
|---------------|-----|---------------|
| BodyCam Bandits FFmpeg Pipeline - Production | fkQsVHSXf6ueTQ2y | FFmpeg patterns |
| BodyCam_Bandits_PRODUCTION_MASTER | O6BFhMUDXrWQ8LcF | Master patterns |
| Viral Clipping FFmpeg | gyWCE5ZLzVpJhziU | Clipping patterns |
| ffmpeg + fal + airtable | 40iLuKRdUGMb9nvj | Integration patterns |
| Instagram Reels - 3-Part Video Editor | ZuxLeHaKp8QZYlag | Video editing |

### Tier 3 / Experimental
| Pattern | Count | Notes |
|---------|-------|-------|
| "My workflow X" | 9 | Unnamed experiments |
| Template workflows | ~15 | Not in active use |
| Single-use tests | ~20 | Historical |

---

## Categorization Process

1. **Initial Assessment**: Review workflow name and active status
2. **Check Usage**: Look at execution history (last 7 days)
3. **Identify Patterns**: Note reusable components for pattern extraction
4. **Assign Tier**: Based on operational importance
5. **Assign Category**: Based on project affiliation
6. **Update Airtable**: Set Priority Tier and Category fields

---

## Pattern Extraction Priority

**High Priority (Extract First)**:
1. BodyCam FFmpeg patterns - video processing
2. UK Local Services enrichment - data enrichment
3. Nano/Banano social - marketing automation

**Medium Priority**:
1. GovCon CRM patterns - pipeline management
2. Instagram Reels - content creation
3. RSS subflows - content aggregation

**Low Priority**:
1. Generic templates
2. Unnamed experiments

---

## Related Documents

- Feature Spec: `specs/001-neo-workflow-management/spec.md`
- Drew Oversight SOP: `.specify/sops/drew-oversight-sop.md`
- Pattern Template: `.specify/patterns/PATTERN-TEMPLATE.md`
- Pattern Library: `.specify/patterns/README.md`
