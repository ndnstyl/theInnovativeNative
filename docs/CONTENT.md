# Portfolio Content Inventory

A complete catalog of assets available for the portfolio, organized by category.

---

## Portfolio Categories

The portfolio will feature a filterable grid with these categories:
1. **n8n Workflows** - Automation templates and systems
2. **Videos** - Walkthroughs, tutorials, demos
3. **Code Projects** - GitHub repositories
4. **Case Studies** - Results-driven project narratives
5. **Databases/Airtable** - Template bases and structures
6. **Templates** - Downloadable resources

---

## Ready-to-Showcase Assets

### n8n Workflows

| Asset | Description | File Location | Status |
|-------|-------------|---------------|--------|
| Job Hunter Workflow | Automated job discovery with AI scoring, persona classification, and Airtable integration | `/jobHunt/n8nWorkflow/Job Hunter.json` (45KB) | Ready |
| Hyper-Personalized Email Enrichment | Complex 292KB automation for finding decision makers and personalized outreach | `/jobHunt/n8nWorkflow/hyperPersonalizedEmailEnrichment.json` | Ready |
| Job Hunter Backup | Original workflow before modifications | `/jobHunt/n8nWorkflow/Job Hunter_backup_20260126.json` | Reference only |

**Portfolio Display Needs:**
- [ ] Screenshot of each workflow canvas
- [ ] Video walkthrough (Loom/YouTube)
- [ ] Sanitized template version (remove API keys, personal data)
- [ ] Written description of problem solved and results

---

### Resumes (For Recruiters Page)

| Asset | Description | File Location | Format |
|-------|-------------|---------------|--------|
| Fractional CMO | Strategic leadership persona | `/jobHunt/Resume/personas/docx/Michael_Soto_Fractional_CMO.docx` | DOCX |
| Sr. Digital Marketing | Performance marketing persona | `/jobHunt/Resume/personas/docx/Michael_Soto_Sr_Digital_Marketing.docx` | DOCX |
| Sr. Growth Marketing | Full-funnel growth persona | `/jobHunt/Resume/personas/docx/Michael_Soto_Sr_Growth_Marketing.docx` | DOCX |
| AI Automation Engineer | Technical automation persona | `/jobHunt/Resume/personas/docx/Michael_Soto_AI_Automation_Engineer.docx` | DOCX |

**PDF Versions Available:**
- `/jobHunt/Resume/personas/pdf/Michael_Soto_Fractional_CMO.pdf`
- `/jobHunt/Resume/personas/pdf/Michael_Soto_Sr_Digital_Marketing.pdf`
- `/jobHunt/Resume/personas/pdf/Michael_Soto_Sr_Growth_Marketing.pdf`
- `/jobHunt/Resume/personas/pdf/Michael_Soto_AI_Automation_Engineer.pdf`

---

### Cover Letter Templates

| Asset | Description | File Location |
|-------|-------------|---------------|
| CMO Template | Executive consulting tone | `/jobHunt/Resume/templates/docx/Cover_Letter_Template_Fractional_CMO.docx` |
| Digital Marketing Template | Performance-focused tone | `/jobHunt/Resume/templates/docx/Cover_Letter_Template_Sr_Digital_Marketing.docx` |
| Growth Marketing Template | Data-driven growth tone | `/jobHunt/Resume/templates/docx/Cover_Letter_Template_Sr_Growth_Marketing.docx` |
| ATS Simple Classic | Base template | `/jobHunt/Resume/templates/docx/ATS_Simple_Classic_Cover_Letter_Template.docx` |
| ATS Resume Template | Base resume format | `/jobHunt/Resume/templates/docx/ATS_Simple_Classic_Resume_Template.docx` |

---

### Letters of Recommendation

| Asset | File Location |
|-------|---------------|
| CREC Recommendation | `/jobHunt/LOR/crec_recommendation_meltch.pdf` |
| Michael Soto LOR | `/jobHunt/LOR/Michael Soto LOR.pdf` |
| Reference Letter | `/jobHunt/LOR/Michael Soto Reference Letter.pdf` |

---

### Brand Voice Documentation

| Asset | Description | File Location |
|-------|-------------|---------------|
| Brand Vibe Report | BuildMyTribe.AI voice guidelines, tone, avatar | `/jobHunt/brandVoice.md` |

**Key Brand Elements:**
- Core message: "Freedom is built by systems, not sacrifice"
- Tone: Conversational, friendly, practical
- Attitude: Confident without arrogance, honest, helpful
- Energy: Grounded operator with builder energy

---

### Professional Narrative Content ✅ READY

Located in `/content/` folder:

| Asset | Description | File |
|-------|-------------|------|
| **Background** | Professional narrative - 20 years of pattern recognition in growth systems | `myBackground.md` |
| **Case Studies** | 4 anonymized case studies with metrics (NDA-compliant) | `Case Studies.md` |
| **Systems Architecture** | n8n orchestration philosophy and approach | `Systems Architecture and n8n Orchestrati.md` |

**Case Study Summaries:**

1. **Paid Acquisition Plateau** (PI Law, $450-600k/mo spend)
   - Diagnosed structural saturation masked by platform optics
   - Reduced spend ~20-25%, improved cost per qualified case 25-30%

2. **System Noise vs Signal** (Multi-channel, $180-320k/mo)
   - Cut tracked KPIs by 60-65%, eliminated 20-25% low-value initiatives
   - Marketing efficiency improved 18-22%

3. **Disguised Winners** (Paid Search, $90-150k/mo)
   - Protected high-variance segments from fear-based optimization
   - Recovered 30-35% incremental qualified volume

4. **Organizational Fear as Constraint** ($3M+ annual spend)
   - Named fear as limiting variable, modeled cost of inaction
   - Acquisition efficiency improved 18-22% within two quarters

---

### Technical Specifications

| Asset | Description | File Location |
|-------|-------------|---------------|
| Job Hunter Spec | Full feature specification | `/jobHunt/.specify/specs/001-job-hunter-automation/spec.md` |
| Implementation Plan | Technical architecture | `/jobHunt/.specify/specs/001-job-hunter-automation/plan.md` |
| Task Breakdown | Ordered implementation tasks | `/jobHunt/.specify/specs/001-job-hunter-automation/tasks.md` |
| Constitution | Project governing principles | `/jobHunt/.specify/memory/constitution.md` |

---

### WordPress Backup ✅ READY

Located in `/backups/` folder (2026-01-29):
- `backup_*-db.gz` - Database
- `backup_*-themes.zip` - Themes (includes Pro theme)
- `backup_*-plugins.zip` - Plugins
- `backup_*-uploads.zip` - Media uploads
- `backup_*-others.zip` - Other files

**Ready to import into LocalWP.**

---

## Content To Create

### Videos (High Priority)

- [ ] **Job Hunter Walkthrough** - 5-10 min Loom/YouTube video explaining the workflow
- [ ] **n8n + AI Integration Demo** - Showing how AI nodes work in workflows
- [ ] **Airtable Automation Demo** - Database structure and automation triggers

### Additional Case Studies (Optional)

- [ ] **Job Hunter Automation Case Study**
  - Problem: Manual job hunting is time-consuming
  - Solution: AI-powered discovery, scoring, and tracking
  - Results: [to be documented after testing]
  - Tech stack: n8n, OpenAI GPT-4o, Airtable, JSearch API

- [ ] **Email Enrichment Case Study**
  - Problem: Finding decision makers for outreach
  - Solution: Automated contact discovery and personalization
  - Results: [to be documented]
  - Tech stack: n8n, Airtable, enrichment APIs

### Portfolio Screenshots

- [ ] Job Hunter workflow canvas (full view)
- [ ] Email Enrichment workflow canvas
- [ ] Airtable base structure
- [ ] AI agent configuration examples

### Downloadable Templates

- [ ] Sanitized n8n workflow templates (JSON)
- [ ] Airtable base template (CSV/Airtable share link)
- [ ] Brand voice framework template

---

## Categorization for Portfolio Filter

### Filter: n8n Workflows
- Job Hunter Workflow
- Hyper-Personalized Email Enrichment
- (future workflows)

### Filter: Videos
- Job Hunter Walkthrough (to create)
- n8n + AI Demo (to create)
- (YouTube channel content)

### Filter: Code Projects
- GitHub repositories (to link)
- Technical specifications as examples

### Filter: Case Studies
- Paid Acquisition Plateau (PI Law) ✅
- System Noise vs Signal (Multi-channel) ✅
- Disguised Winners (Paid Search) ✅
- Organizational Fear as Constraint ✅
- Job Hunter Automation (to write)
- Email Enrichment System (to write)

### Filter: Databases
- Airtable Job Pipeline Template
- Contact Management Base

### Filter: Templates
- Resume persona templates
- Brand voice framework
- Cover letter templates

---

## File Sync Strategy

Assets from `/Users/makwa/jobHunt/` should be:
1. **Copied** to this project's `/assets/` folder for portfolio use
2. **Sanitized** to remove personal data, API keys
3. **Documented** with descriptions for portfolio display

**Do NOT sync:**
- Files with credentials or API keys
- Personal contact information
- Unfinished work

---

## Next Steps

1. Create video walkthroughs of key workflows
2. Take screenshots of workflow canvases
3. Write case study narratives with metrics
4. Sanitize workflow JSONs for download
5. Build portfolio grid in WordPress
