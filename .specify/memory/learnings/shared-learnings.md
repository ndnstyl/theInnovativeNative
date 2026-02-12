# Shared Learnings

Cross-agent discoveries and patterns that apply to multiple agents.

## Last Updated: 2026-02-11

---

## ⛔ ABSOLUTE REQUIREMENT - READ FIRST ⛔

**EVERY SESSION MUST LOG TO AIRTABLE. NO EXCEPTIONS.**

| What | Table | When |
|------|-------|------|
| Time Entry | Time Entries | EVERY session (even 5 min) |
| Task | Tasks | If >5min OR deliverable |
| Tokens Used | Time Entries | EVERY session |
| Skills Gap | Your learnings.md | If capability missing |

**If it's not in Airtable, it didn't happen. Drew cannot see it. CEO cannot see it.**

---

## Critical Patterns (ALL AGENTS)
- Always load constitution on startup - it contains non-negotiable principles
- Check learnings.md before starting any task to avoid repeating mistakes
- "Slower is Faster" - methodical execution beats rushed mistakes
- **MANDATORY: Log time, tasks, tokens, and skills gaps after EVERY session - no exceptions**
- Airtable is the single source of truth for all agent work tracking
- **DOCUMENTATION IS EVERYTHING**: Without .md files in `.specify/features/`, work cannot be tracked or continued across sessions
- **Skills gaps feed training priorities**: If you lacked a capability, log it so we can improve

## Spec Kit Model (MANDATORY)
Every feature/project MUST have these files in `.specify/features/<project-name>/`:
- `spec.md` - User stories, requirements, success criteria
- `plan.md` - Implementation approach, timeline, dependencies
- `tasks.md` - Task breakdown with IDs, agents, status checkboxes

**No spec kit = No work starts. Drew enforces this.**

## Airtable as Cloud CRM/Dashboard (MANDATORY)
**Local files are for session continuity. Airtable is for cloud access when traveling.**

- **Deliverables table** (`tblnUsXJ2ZHjZGcyu`) - Every deliverable MUST be logged with:
  - Actual content (for text like LinkedIn posts)
  - Local Path (for file reference)
  - **File URL (REQUIRED for all assets)** - Google Drive link
  - Status (Draft/Ready/Published/Archived)
  - Project link, Created By agent, UTM links

- **Why**: CEO needs access to all assets from any device, not just local machine
- **Rule**: After creating any deliverable, agent MUST add record to Deliverables table

## ⛔ GOOGLE DRIVE UPLOAD (MANDATORY FOR ALL ASSETS) ⛔

**Every graphic, document, video, or file asset MUST be uploaded to Google Drive.**

### Upload Script
```bash
python3 law_firm_RAG/marketing/scripts/upload_to_gdrive.py
```

### Folder Structure
```
TIN Marketing/
├── Cerebro/
│   └── February 2026/
│       ├── Graphics/
│       └── Campaign Configs/
├── [Project Name]/
│   └── [Month Year]/
```

### After Creating ANY Asset:
1. Run upload script OR manually upload to Google Drive
2. Get shareable link (set to "Anyone with link can view")
3. Update Airtable Deliverables record with File URL field
4. **NO DELIVERABLE IS COMPLETE WITHOUT A GOOGLE DRIVE URL**

### Why This Matters
- CEO travels - needs access from any device
- Drew needs to review assets without SSH access
- Clients may need to preview before approval
- Local files can be lost - Drive is backup

## Cross-Agent Coordination
- Task routing flows through Drew unless specific exceptions apply
- Jenna → Rex (git) and Jenna → Sage (docs) bypass Drew
- CEO can assign directly to anyone

## ⚠️ Airtable Schema Sprawl (2026-02-08)

**What Happened:** Data agent created a new "Community Engagement" table with 14 fields to track engagement on a single Facebook feeler post. Table deleted. One-off tracking doesn't need Airtable — it needs a mental note or a markdown file.

**Rule Added to Constitution:** No new tables without CEO approval. Extend existing tables or use markdown for one-off tracking. See constitution.md "Airtable Schema Governance" section.

**Prevention:** Before any schema change, ask: "Can this be a record in an existing table? Can this be a Notes field? Does this even need Airtable at all?"

---

## Integration Gotchas
- n8n: Never test workflows with Apify HTTP nodes
- Airtable: Always check for existing data before schema changes
- Database migrations: Check existing data first (Hostinger, n8n, etc.)
- n8n webhooks: Data arrives under `$json.body.data.*` not `$json.data.*`
- n8n credentials: Verify credential ID matches between workflow versions
- Slack MCP: Requires reinstalling app after adding OAuth scopes
- Airtable Time Entries: Tokens Used field may need manual schema addition
- **MCP Config Sync - THREE locations**: `~/.mcp.json` (user's master), `~/.claude/.mcp.json` (Claude Code active), and `.claude/skills/mcp-client/references/mcp-config.json` (skill). When updating keys, update ALL THREE!
- **Airtable Field Names**: Tasks table uses "Title" (not "Task Name") and "Assignee" (not "Agent"). Always verify field names before creating records.
- **Airtable Logging**: Significant work requires BOTH Time Entry AND Task record per constitution
- **Airtable Views API Limitation (2026-02-05)**: Airtable Metadata API can READ view metadata (IDs, names) but CANNOT CREATE views programmatically. Views must be created through Airtable UI or Scripting extensions. When view creation is needed, document specifications for manual UI creation instead.
- **n8n parallel branch synchronization (2026-02-09)**: When a trigger fans out to N parallel nodes that must ALL complete before a downstream node fires, insert a Merge node (`n8n-nodes-base.merge` v3.2, `mode: "append"`, `numberInputs: N`). NEVER connect multiple parallel branches to the same input index of a downstream node — n8n fires on first arrival, not when all arrive. This caused a runtime crash in the Haven B-Roll pipeline.
- **n8n executeWorkflow v1.3 implicit data passing (2026-02-09)**: Empty `workflowInputs.value: {}` in Execute Workflow nodes passes upstream data through implicitly. No explicit field mappings needed. Confirmed across 3 sub-workflow calls in WF-001.
- **n8n sub-workflow error taxonomy (2026-02-09)**: Two classes — (1) pre-flight validation errors from outdated node versions/deprecated parameters, (2) runtime execution errors from incorrect connection topology. Pre-flight doesn't catch connection logic issues.
- **AAVE orthography for TTS (2026-02-11)**: TTS engines (ElevenLabs AND Qwen3) over-enunciate when scripts use standard English. Fix: spell words how the character says them (sleepin', outta, ain't, folk). ~65% AAVE density for measured characters. Full rules in `deliverables/004-faceless-ai-brand/tyrone-voice-guide.md`.
- **TTS engine selection (2026-02-11)**: ElevenLabs wins for production quality. Qwen3-TTS (local, MLX) useful for prototyping/iteration but has robotic quality and pronunciation issues. The AAVE script rewrite benefits both engines equally — it's the real lever.
- **Qwen3-TTS voice cloning (2026-02-11)**: Never trim reference audio — longer clips give better clone quality via ECAPA-TDNN speaker encoder. ICL mode auto-overrides repetition_penalty to minimum 1.5. Provide full matching transcript for best results.

## Session Learnings (2026-02-11) — BowTie Video Pipeline

### Remotion interpolate() Gotcha (CRITICAL)
- **`inputRange` must be STRICTLY monotonically increasing** — duplicate values crash the render with a non-obvious error
- Example: `[0, 30, 30, 60]` FAILS. Must be `[0, 30, 31, 60]`
- This commonly happens when adjacent animation keyframes share a boundary frame. Always offset by +1 frame.

### Parallel Agent Deployment (5 Agents)
- Deployed 5 agents simultaneously for pipeline completion — worked well for independent workstreams
- Each agent owned a distinct slice (Remotion components, FFMPEG assembly, audio mix, ComfyUI setup, brand assets)
- Key success factor: clear task boundaries with no shared file conflicts

### ComfyUI Embedded Git Repo
- ComfyUI clones custom nodes as full git repos inside `comfyUI/custom_nodes/`
- Cannot `git add` a directory that contains its own `.git/` — parent repo silently treats it as a submodule reference
- **Options**: (1) Use `git submodule add` formally, (2) Add only specific output files, (3) Add `comfyUI/` to `.gitignore` and track separately
- We chose `.gitignore` approach — ComfyUI is local tooling, not deployable code

### ProRes Codec Selection for 2D Cel-Shaded Art
- **ProRes 4444 LT with `yuva444p` (8-bit alpha)** is sufficient for 2D cel-shaded art with flat colors and hard edges
- ProRes 4444 with 10-bit (`yuva444p10le`) is overkill — extra bitdepth only matters for photographic footage with subtle gradients
- LT profile saves ~40% file size vs standard 4444 with no visible quality loss on cel art

### Timeline EDL JSON Schema for Video Assembly
- Instead of building FFMPEG commands directly from episode data, generate an intermediate EDL (Edit Decision List) as JSON
- Schema includes: clips array (source, in/out points, track, transitions), audio mix levels, output settings
- Benefits: human-readable, versionable, replayable, decouples editorial decisions from FFMPEG implementation
- FFMPEG command builder reads EDL JSON and generates the complex filter graph

### FFMPEG Sidechain Compress for VO-Triggered Music Ducking
- Pattern: music volume automatically dips when voiceover is speaking, returns to normal during pauses
- Filter: `[music][vo]sidechaincompress=threshold=0.02:ratio=8:attack=50:release=800`
- `threshold=0.02` — triggers on any VO signal (low threshold catches quiet speech)
- `ratio=8` — aggressive ducking (music drops to ~12% during VO)
- `attack=50ms` — fast duck when VO starts
- `release=800ms` — slow return so music doesn't pump between phrases
- Apply AFTER VO normalization (`loudnorm`) so threshold is consistent

---

## Session Learnings (2026-02-05)
- MCP config desync discovered: skill config had old API key, home config had valid key
- Parallel agent deployment pattern works well for independent workstreams
- Law Firm RAG landing page Phase 1 complete: Stripe, Supabase Auth, UI components
- Airtable direct API calls more reliable than MCP client script when troubleshooting
- **TIN Database Expansion COMPLETE**: 20 tables now operational with cross-table links
- Airtable API cannot create createdTime/lastModifiedTime fields - must add via UI
- When tables already exist, API returns DUPLICATE_TABLE_NAME (check first with GET /tables)

### Neo Workflow Management Spec Kit (2026-02-05)
- **Full spec kit workflow executed**: specify → plan → tasks → implement
- **52 tasks generated** across 8 phases for workflow health monitoring
- **4 patterns extracted** from production workflows:
  - FFmpeg video processing (BodyCam Bandits)
  - Business enrichment (UK Local Services)
  - Social distribution (Nano/Banano)
  - AI image generation (Create Image Tool)
- **Airtable API field creation**: Use POST to `/meta/bases/{baseId}/tables/{tableId}/fields`
- **Tasks table Status values**: "Pending", "In Progress", "Blocked", "Completed", "Cancelled" (not "Done")
- **Pattern extraction workflow**: Get workflow JSON via API → Extract key nodes → Document in `.specify/patterns/`
- **n8n workflow inventory**: 161 total (49 active, 112 inactive)
- **Quickstart guides**: Essential for handoff - document all prerequisites and deployment steps

### Campaign Documentation (Cerebro Feb 2026)
- **Airtable Field Validation**: Always check existing field option values before creating records
  - Status field uses "Pending" not "To Do"
  - Priority uses "P1" not "High"
  - Can't create new select options without admin permissions
- **YouTube Transcription**: Use `yt-dlp --cookies-from-browser chrome` to bypass bot detection
- **VTT Cleaning**: Auto-generated subtitles need Python cleaning script (consolidate by minute, remove dupes)
- **Marketing Arm Structure**: Mike (CMO) → Drew (PM) → Adler (Paid Ads) + Pixel (Graphics)
- **Campaign Asset Organization**:
  - Plans/tasks: `.specify/features/<campaign-name>/`
  - Marketing copy: `law_firm_RAG/marketing/`
  - Platform specs: `.claude/skills/marketing/platforms/`
  - SOPs: `.claude/skills/marketing/sops/`

### ⚠️ CRITICAL FAILURE: Google Drive Upload Gap (2026-02-05)

**What Happened:**
- 15+ deliverables created (graphics, configs, videos, docs)
- All stored locally with `Local Path` in Airtable
- `File URL` field left empty - NO CLOUD ACCESS
- CEO/Drew couldn't access assets remotely

**Root Causes:**
1. **No upload script existed** - agents had to manually figure out Google Drive
2. **Skill files didn't mandate upload** - shutdown protocols only mentioned Airtable
3. **Google Drive MCP was configured but undocumented** - available but unused
4. **"File URL" field was mentioned but process was unclear** - no concrete steps

**Fixes Applied:**
1. Created `law_firm_RAG/marketing/scripts/upload_to_gdrive.py` - automated upload
2. Updated `shared-learnings.md` with explicit Google Drive section
3. Updated Pixel/Adler skill shutdown protocols
4. Created `.claude/skills/infrastructure/gdrive-upload/SKILL.md` skill
5. Updated constitution with mandatory cloud upload requirement
6. Updated ALL content-creating agent skills

**Prevention:**
- Every agent skill that creates deliverables now has Google Drive in shutdown protocol
- Constitution now explicitly mandates: "No deliverable complete without Google Drive URL"
- New skill file provides standard reference for all agents
- Upload script handles batch uploads automatically

**New Skills Created:**
- `gdrive-upload` - Infrastructure skill for Google Drive operations

### ⚠️ CRITICAL FAILURE: SVG Format Gap (2026-02-05)

**What Happened:**
- 14 SVG graphics created for social media campaigns
- Uploaded to Google Drive but wouldn't preview (complex SVGs with external fonts)
- CANNOT deploy to LinkedIn, Facebook, Instagram - SVG not supported by ANY social platform
- Deliverables marked "Ready" but were actually unusable

**Root Causes:**
1. **No format validation** - agents didn't know platform requirements
2. **SVG worked locally** - no preview testing in Drive
3. **Skill files didn't specify output formats** - only mentioned SVG for logos
4. **Platform limitations undocumented** - no SOP for format requirements

**Platform Reality:**
| Platform | SVG Support | Required Format |
|----------|-------------|-----------------|
| LinkedIn | NO | PNG, JPG |
| Facebook | NO | PNG, JPG |
| Instagram | NO | PNG, JPG |
| Google Drive Preview | PARTIAL | Complex SVGs don't render |

**Fixes Applied:**
1. Converted all 12 SVGs to PNG using Inkscape CLI
2. Created `.specify/sops/deliverable-format-requirements.md` - full platform specs
3. Updated 4 agent skills with format verification in shutdown protocol
4. Updated deliverable-verification-checklist.md with format check
5. Updated gdrive-upload skill with format guidance
6. Cleaned up Airtable Deliverables schema (consolidated URL fields)

**Prevention:**
- **PNG/JPG ONLY** for social graphics - SVG is source only
- **MP4 (H.264) ONLY** for social video
- Format verification MANDATORY before upload
- Test Drive preview in incognito browser
- See: `.specify/sops/deliverable-format-requirements.md`

**Conversion Command:**
```bash
# Convert SVG to PNG
inkscape input.svg --export-type=png --export-filename=output.png --export-dpi=144
```

## Session Learnings (2026-02-04)
- Constitution updated to mandate Airtable logging for all agents
- Agent Logging SOP created at `.specify/sops/agent-logging-sop.md`
- Rize webhook integration fully operational
- All 17 agent skill files updated with shutdown protocol

## Critical Mistake (2026-02-04)

### Failure: Airtable Logging Skipped

**What happened**: Created 9 Airtable tables but logged nothing to Airtable
- No Project record created
- No Tasks logged
- No Time Entry logged
- Drew had zero visibility into completed work

**Root cause**:
1. Did not load constitution before starting work
2. Treated local .md file updates as sufficient
3. Did not follow mandatory shutdown protocol

**Prevention**:
1. EVERY session must start with constitution load
2. EVERY session must end with Airtable logging
3. Local .md files are for planning, Airtable is for visibility
4. Drew only sees Airtable - if it's not there, it doesn't exist

**Fix applied**: Backfilled Project (recN2VorsuzMoQjgH), 9 Tasks, and Time Entry to Airtable

## Content Framing Standards (ALL CONTENT AGENTS)

**Added: 2026-02-04** - Critical update for content authenticity.

### Our Lane (Claim expertise)
- SaaS/software development
- AI automation systems
- Marketing content creation
- Systems integration

### NOT Our Lane (NEVER claim)
- Legal advice (build for lawyers, not lawyers)
- Financial advice (build for fintech, not analysts)
- Medical, accounting, or any licensed profession

### Voice: Builder, Not Domain Expert
Credibility comes from **building for** experts, not being them.

**Hook patterns to use:**
- "I was talking with a client in [industry]..."
- "Interesting take from a [title] I work with..."
- "While building [system] for a [client type]..."
- "After working with X clients in Y space..."
- "Everyone says X, but here's what I've seen building..."

**Red flags to reject:**
- "As experts in [domain outside our lane]..."
- "We advise clients to [domain-specific guidance]..."
- Any claims implying credentials we don't hold

**Chris and Haven enforce this on all content.**

## Communication Standards
- Slack #cerebro-alerts: Critical issues only
- Slack #project-updates: Daily status, non-critical updates
- Email escalation: Only for client-facing issues and CEO-level concerns

## File Organization
- Specs live in `.specify/features/<project-name>/`
- Skills live in `.claude/skills/<category>/<agent-name>/`
- Learnings live in `.specify/memory/learnings/`
- Reports live in `.specify/memory/reports/`

## Weekly Rhythms
- Friday: All project leads submit status reports
- Monday: Drew publishes consolidated weekly status
- Daily: Health checks run automatically

## Session Learnings (2026-02-07)

### Haven UGC Content Engine - Phase 0 + Phase 1 Foundation

#### Audio Optimization Pattern (REUSABLE — ALL VIDEO PROJECTS)
- **Problem**: Music tracks uploaded as WAV (26MB) or high-bitrate MP3 (320kbps, 4-5MB) bloat pipeline storage and slow n8n assembly
- **Solution**: Pre-process all music tracks before pipeline use: compress to 128kbps MP3, trim to 40s, pre-bake 2s fade in/out
- **Command**: `ffmpeg -i input.wav -t 40 -codec:a libmp3lame -b:a 128k -ar 44100 -af "afade=t=in:st=0:d=2,afade=t=out:st=38:d=2" output.mp3`
- **Results**: 26MB WAV → 626KB MP3 (97.6% reduction). 35MB total → 1.8MB total for 3 tracks
- **Why 128k is enough**: Background music mixed at 40% volume — listeners cannot distinguish 128k from 320k when ducked
- **Why 40 seconds**: Videos are 25-35s; 40s gives 5s buffer. Full-length tracks (2-5min) waste bandwidth
- **Full pattern doc**: `.specify/patterns/ffmpeg/audio-optimization.md`
- **Naming convention**: `{name}-{duration}s-{bitrate}k.mp3` (e.g., `afternoon-coffee-40s-128k.mp3`)

#### Phase 0 Foundation Build
- **Airtable table creation with linked records**: Use minimal field options (`linkedTableId` only) when creating linked record fields. Extra options like `prefersSingleRecordLink` and `isReversed` cause contradictory API errors.
- **Always verify table IDs before use**: Table IDs from initial audits may reference deleted/renamed tables. List all tables with `GET /meta/bases/{baseId}/tables` and confirm before reads/writes.
- **Character Sheet approach validated**: Canonical prompts + negative prompts + reference image paths stored in Airtable provides good structure for visual consistency across Gemini generations.
- **Brand system reuse pattern**: Copy file structure from existing brand (innovative-native) but completely change aesthetic. The 4-file structure (brand.json, config.json, brand-system.md, tone-of-voice.md) is proven.
- **Google Drive folder structure**: Create via MCP/API, set sharing to "Anyone with link can view", store folder IDs in tasks.md for future reference.

## Session Learnings (2026-02-06)

### WebSearch/WebFetch Capability Gap
- **Issue**: WebSearch and WebFetch tools may be blocked (permissions denied)
- **Impact**: Competitive research, URL validation, and live data gathering blocked
- **When Blocked**: "Permission to use WebSearch has been auto-denied (prompts unavailable)"
- **Workaround**: Create research templates with hypothesis data, request manual validation
- **Resolution Required**: User must enable web tools in Claude Code settings OR perform manual research
- **Logged**: GAP-2026-02-06-001 in `.specify/memory/gaps/domain-gaps.json`

### Legal RAG Gold Questions Validation (Scales - 2026-02-06)

**Scope**: Validated 150 gold questions across 3 practice areas for Cerebro Legal RAG evaluation harness.

#### Legal Research Patterns Discovered

1. **Citation Format Flexibility Required**
   - Case citations appear in multiple formats: "Field v. Mans", "Field v Mans", "Field vs. Mans"
   - Reporter citations (e.g., "516 U.S. 59") are most reliable for matching
   - Statute citations may use "Section" or section symbol
   - Evaluation scripts must handle format variations

2. **Legal Test Precision is Critical**
   - "Justifiable reliance" vs "reasonable reliance" is a dispositive distinction (Field v. Mans)
   - Must_not_say arrays catch common errors that would fail legal malpractice review
   - Element order doesn't matter but completeness does

3. **Authority Hierarchy for Evaluation**
   - Supreme Court cases always control and should appear first
   - For statutory questions, statute + interpreting case should both be cited
   - BIA decisions are binding on immigration courts but persuasive elsewhere

4. **Gold Question Categories**
   - `test_rule`: Core legal tests (5+ elements typically)
   - `standard_review`: Appellate standards (who has burden, what level of deference)
   - `edge_case`: Exceptions, recent changes, circuit splits

5. **BAPCPA Changes in Bankruptcy**
   - Multiple questions test BAPCPA (2005) changes
   - Common error: citing pre-BAPCPA law as current
   - Examples: ride-through doctrine eliminated, ordinary course defense changed to disjunctive

6. **Recent Precedent Critical in Admin Law**
   - Major questions doctrine (West Virginia v. EPA, 2022) is newest significant development
   - Kisor v. Wilkie (2019) limited but preserved Auer deference
   - Evaluation corpus MUST include post-2020 cases

#### Evaluation Script Patterns

- **Offline validation mode**: Always test gold question structure before live runs
- **Citation matching**: Use case-insensitive, format-flexible matching
- **Element matching**: Allow 80% threshold for pass (accounts for paraphrasing)
- **Exclusion matching**: Zero tolerance (any excluded term = fail)
- **Response time tracking**: Critical for UX metrics

#### Deliverables Created
- `law_firm_RAG/scripts/05_run_evaluation.py` - Evaluation runner script
- `law_firm_RAG/demo_scenarios.md` - 3 demo scenarios with talking points

#### Gold Question Validation Summary
| Practice Area | Questions | Validation Status |
|---------------|-----------|-------------------|
| Bankruptcy | 50 | PASS - All citations verified |
| Criminal Procedure | 50 | PASS - All citations verified |
| Administrative | 50 | PASS - All citations verified |

**No legal accuracy issues found in any gold question file.**

---

## ⛔ COMPLIANCE SELF-CHECK (RUN BEFORE EVERY SESSION END) ⛔

Every agent must verify their own logging before ending a session. Copy and run:

```bash
python3 -c "
import urllib.request, json, urllib.parse
from datetime import datetime

token = '<AIRTABLE_TOKEN>'
base = 'appTO7OCRB2XbAlak'
today = datetime.now().strftime('%Y-%m-%d')

# Replace with YOUR agent record ID from roster.json
agent_id = '<YOUR_AGENT_RECORD_ID>'

# 1. Check time entry exists for today
formula = f'AND({{Entry Date}} = \"{today}\")'
url = f'https://api.airtable.com/v0/{base}/tbl4FrwRqV02j2TSK?filterByFormula={urllib.parse.quote(formula)}'
req = urllib.request.Request(url)
req.add_header('Authorization', f'Bearer {token}')
entries = json.loads(urllib.request.urlopen(req).read()).get('records', [])
my_entries = [e for e in entries if agent_id in e.get('fields', {}).get('Agent', [])]
print(f'Time entries today: {len(my_entries)}' + (' OK' if my_entries else ' VIOLATION - LOG NOW'))

# 2. Check deliverables have Airtable records
formula2 = f'AND({{Created Date}} = \"{today}\")'
url2 = f'https://api.airtable.com/v0/{base}/tblnUsXJ2ZHjZGcyu?filterByFormula={urllib.parse.quote(formula2)}'
req2 = urllib.request.Request(url2)
req2.add_header('Authorization', f'Bearer {token}')
deliverables = json.loads(urllib.request.urlopen(req2).read()).get('records', [])
my_deliverables = [d for d in deliverables if agent_id in d.get('fields', {}).get('Created By', [])]
no_url = [d for d in my_deliverables if not d.get('fields', {}).get('File URL')]
print(f'My deliverables today: {len(my_deliverables)}')
if no_url:
    print(f'  WARNING: {len(no_url)} missing Drive URL')
print('Self-check complete.')
"
```

### Agent Record IDs (for self-check)
```
Drew (PM):      recANUnwKYsknrokD
Tab (Airtable): recMYRLG8ycqtAcEf
Neo (n8n):      recX15yRkYnxnRwmW
Chris (Story):  recsLqFvG8vajOmjD
Creative:       reczCnqUx8ki9zEB4
Adler (Ads):    reccMfGkbGD0yPTMA
Comms:          recCommsXXXXXXXXX
Builder:        recBuilderXXXXXXX
```
*(Update IDs from `.specify/memory/agents/roster.json` if these are stale)*

---

## PM Patterns (Drew)

### Added: 2026-02-06

#### Sprint Planning Patterns

1. **Task ID Convention for Sprints**
   - Use project prefix: `CEREBRO-001`, `WORKFLOW-001`, etc.
   - Sequential numbering within project
   - Task IDs in Airtable Notes field for cross-reference to local .md files

2. **Airtable Task Structure**
   - Required fields: Title, Assignee, Project, Status, Priority, Estimated Hours, Blocked By
   - Status progression: `Pending → Assigned → Acknowledged → In Progress → Completed`
   - Blocked status triggers escalation per matrix
   - Notes field contains: Task ID, spec file location, dependencies

3. **Sprint Documentation Package**
   - `airtable-tasks.md`: Full task breakdown with acceptance criteria
   - `standup-template.md`: Async standup format, blocker escalation
   - `launch-checklist.md`: Technical, business, legal gates with sign-off
   - All in `.specify/features/<project-name>/`

4. **Dependency Mapping**
   - Create visual dependency graph in tasks.md
   - Identify parallel opportunities (tasks with [P] flag)
   - Mark phase completion checkpoints

5. **Estimation Patterns**
   - Infrastructure setup: 0.5-1.5 hours per component
   - Data ingestion: 1.5-2 hours per corpus
   - API integration: 1-2 hours per endpoint
   - Frontend component: 0.5-1 hour each
   - End-to-end testing: 0.5 hours
   - Add 20% buffer for first-time work

#### Standup and Communication

1. **Async Standup Format**
   - Daily by 10 AM ET in project Slack channel
   - Yesterday/Today/Blockers/Dependencies format
   - Drew posts daily summary at 5 PM ET
   - Weekly summary Friday at 4 PM ET

2. **Blocker Escalation Matrix**
   | Severity | Response Time | Escalation Path |
   |----------|---------------|-----------------|
   | P1 Critical | Immediate | CEO via Slack DM |
   | P2 High | 4 hours | Drew via project channel |
   | P3 Medium | 24 hours | Drew in standup |
   | P4 Low | Next standup | Note only |

3. **Status Visibility Rules**
   - Agents post in Slack but LOG in Airtable
   - Drew aggregates Slack for narrative, Airtable for metrics
   - CEO checks Airtable dashboard, not Slack

#### Launch Readiness Patterns

1. **Gate Categories**
   - Technical Gates (T1-T6): Infra, data, pipeline, frontend, eval, monitoring
   - Business Gates (B1-B5): Pricing, marketing, support, onboarding, feedback
   - Legal Gates (L1-L4): ToS, privacy, disclaimer, data retention

2. **Sign-off Protocol**
   - Each gate has designated owner
   - Owner signs off with date in checklist
   - Final launch approval requires ALL gates passed

3. **Rollback Planning**
   - Always document rollback steps before launch
   - Maximum acceptable downtime defined
   - Emergency contact for critical issues

#### Cross-Functional Coordination

1. **Business-Tech Handoff**
   - Tech spec complete → Business decisions document created
   - Business decisions doc surfaces all choices needed before launch
   - Format: Options + Recommendation + Owner + Deadline

2. **Pilot Program Coordination**
   - Support volume estimates per phase
   - Onboarding checklist per participant
   - Feedback collection touchpoints mapped

3. **Decision Tracking**
   - Add checklist items for missing operational elements
   - Update business-decisions.md when gaps discovered
   - Sections: Technical, Business, Legal/Compliance, Operational, Sprint Coordination

#### Lessons Learned

1. **Visibility Gap Prevention**
   - PM creates all Airtable tasks during planning (not during execution)
   - Tasks exist before agent work begins
   - Agent acknowledges task assignment in Airtable

2. **Spec Kit Completeness**
   - Standard package: spec.md, plan.md, tasks.md
   - Sprint package adds: airtable-tasks.md, standup-template.md, launch-checklist.md
   - Business stakeholder package: business-decisions.md

3. **Assignment Clarity**
   - "TBD (Drew to assign)" for unassigned work
   - Drew resolves TBD before sprint starts
   - No ambiguous ownership
