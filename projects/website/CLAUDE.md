# The Innovative Native - AI Assistant Context

> This file provides context for AI assistants working on this project.

## Project Overview

A dual-purpose consultant portfolio website for Michael Soto:
1. **Home Page** - Attracts consulting clients (AI automation, n8n, growth)
2. **Careers Page** - Engages recruiters with downloadable resumes
3. **Portfolio Page** - Filterable grid showcasing work

**Domain:** theinnovativenative.com
**Framework:** WordPress + Pro Theme (Cornerstone builder)
**Hosting:** hosting.com (cPanel access)
**Repo:** https://github.com/ndnstyl/theInnovativeNative.git

---

## Site Architecture

```
theinnovativenative.com
├── / (Home - Consulting Focus)
├── /careers (Recruiter Focus)
└── /portfolio (Filterable Grid)
```

---

## Key Files

| File | Purpose |
|------|---------|
| `/docs/SETUP.md` | LocalWP installation and backup import |
| `/docs/DEPLOYMENT.md` | How to deploy to production |
| `/docs/CONTENT.md` | Portfolio content inventory |
| `/docs/PAGES.md` | Page content specifications |
| `/content/myBackground.md` | Professional narrative (20 years pattern recognition) |
| `/content/Case Studies.md` | 4 anonymized case studies with metrics |
| `/content/Systems Architecture*.md` | n8n orchestration philosophy |
| `/wp-content/themes/` | Theme customizations (track in git) |
| `/assets/` | Screenshots, thumbnails, videos |
| `/backups/` | UpdraftPlus backup (2026-01-29) - ready to import |

---

## Content Assets (In This Repo)

| Asset Type | Location |
|------------|----------|
| Professional Background | `/content/myBackground.md` |
| Case Studies (4) | `/content/Case Studies.md` |
| Systems Architecture | `/content/Systems Architecture*.md` |
| WordPress Backup | `/backups/` (db, themes, plugins, uploads) |

## Related Project Assets

Content assets from the jobHunt project:

| Asset Type | Location |
|------------|----------|
| n8n Workflows | `/Users/makwa/jobHunt/n8nWorkflow/` |
| Resumes | `/Users/makwa/jobHunt/Resume/personas/docx/` |
| Brand Voice | `/Users/makwa/jobHunt/brandVoice.md` |
| Recommendations | `/Users/makwa/jobHunt/LOR/` |

---

## Deployment (SSH — ALL AGENTS USE THIS)

```bash
# 1. Build (always fresh — never deploy a stale out/)
cd /Users/makwa/theinnovativenative/projects/website && npm run build

# 2. Deploy via rsync — DEFAULT IS NO --delete to avoid wiping pages from other branches
rsync -avz --chmod=D755,F644 \
  -e "ssh -i ~/.ssh/a2hosting_tin -p 7822 -o IdentitiesOnly=yes" \
  --exclude='theinnovativenative-site.zip' \
  --exclude='resumes/' --exclude='videos/' --exclude='n8n-templates/' \
  /Users/makwa/theinnovativenative/projects/website/out/ \
  delikate@75.98.175.76:~/theinnovativenative.com/

# 3. Fix directory index files (REQUIRED after every deploy — covers all multi-page sections)
ssh -i ~/.ssh/a2hosting_tin -p 7822 -o IdentitiesOnly=yes delikate@75.98.175.76 \
  "cd ~/theinnovativenative.com && for name in blog classroom community members messages templates admin checklist checkout auth generational-wealth quiz resources settings; do [ -f \${name}.html ] && [ -d \${name} ] && cp \${name}.html \${name}/index.html 2>/dev/null; done"
```

### When to use --delete (rare)

Only when you intentionally want to clean up stale files on the server (e.g., after deleting a page from source). Run as a SEPARATE step, only after confirming the build is fresh and complete:

```bash
# DANGEROUS: wipes anything on server not in local out/
# Confirm `out/` has all expected pages BEFORE running this
rsync -avz --delete \
  -e "ssh -i ~/.ssh/a2hosting_tin -p 7822 -o IdentitiesOnly=yes" \
  --exclude='theinnovativenative-site.zip' \
  --exclude='resumes/' --exclude='videos/' --exclude='n8n-templates/' \
  /Users/makwa/theinnovativenative/projects/website/out/ \
  delikate@75.98.175.76:~/theinnovativenative.com/
```

**Why no `--delete` by default:** if you deploy from a branch (e.g. `main`) that doesn't include pages built only on another branch (e.g. `generational-wealth`), `--delete` will wipe those pages off the server. Default behavior should be additive. Use `--delete` only when you've consciously chosen to prune.

**SSH Details**: Host `75.98.175.76` | Port `7822` | User `delikate` | Key `~/.ssh/a2hosting_tin` (no passphrase)
**Document root**: `~/theinnovativenative.com/`

## Development Workflow (Legacy — WordPress)

1. **Local Development:** Use LocalWP at `theinnovativenative.local`
2. **Version Control:** Track theme changes in `/wp-content/themes/`
3. **Deployment:** See SSH deployment above (WordPress is deprecated)

---

## Current Status

### Phase 1: Setup ✅
- [x] Git repository initialized
- [x] Project documentation created
- [x] Content inventory completed
- [x] WordPress backup downloaded (in `/backups/`)
- [x] Professional content added (background, case studies, systems architecture)

### Phase 2: Local Environment (Manual Steps)
- [ ] Install LocalWP (https://localwp.com/)
- [x] ~~Create backup from live site~~ (backup files in `/backups/`)
- [ ] Import backup to LocalWP
- [ ] Copy theme files to this repo

### Phase 3: Portfolio Page (Build First)
- [ ] Create portfolio page in Cornerstone
- [ ] Set up filter categories
- [ ] Add portfolio items
- [ ] Create screenshots/thumbnails

### Phase 4: Home Page
- [ ] Update hero section
- [ ] Add services section
- [ ] Add featured work section
- [ ] Keep Calendly integration

### Phase 5: Careers Page
- [ ] Create new page
- [ ] Add resume download section
- [ ] Add career highlights
- [ ] Link to portfolio

---

## Brand Voice

From `/content/myBackground.md` and `/Users/makwa/jobHunt/brandVoice.md`:

| Attribute | Guideline |
|-----------|-----------|
| Tone | Direct, practical, no-fluff |
| Attitude | Confident without arrogance, comfortable saying no |
| Style | Plain language, short sentences, economically justified |
| Energy | Grounded operator with pattern recognition expertise |

**Core Messaging:**
- "I build systems that survive contact with reality"
- "Most teams don't need more effort. They need less guessing."
- "I diagnose where systems are lying"
- "If a system requires constant narrative defense, it is already broken"

**What Mike Optimizes For:**
- Economic durability
- Decision clarity under uncertainty
- Systems that don't collapse when attention moves elsewhere

---

## Technical Notes

### WordPress/Cornerstone
- Pro Theme uses Cornerstone page builder
- Edit pages via WP Admin → Pages → Edit with Cornerstone
- Theme files in `wp-content/themes/pro-child/` (or similar)

### Portfolio Implementation Options
1. Cornerstone native grid elements
2. Essential Grid plugin
3. Custom post type with taxonomy filters

### SEO Targets
- Home: "AI automation consultant", "n8n developer"
- Portfolio: Project-specific keywords
- Careers: Consider `noindex` for privacy

---

## Contact & Hosting

- **Hosting Provider:** hosting.com
- **cPanel Access:** Via hosting.com login
- **Domain Registrar:** (check hosting.com or separate)
