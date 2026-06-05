# Repository Structure Guide

> Last restructured: 2026-04-24 (consolidation: merged `/specs/` and `/projects/*/specs/` into `.specify/features/`; resolved 4 duplicate-number collisions). Previous restructure: 2026-04-06.
> This file documents where things live, what each top-level folder does, and the conventions all agents MUST follow.

## The Spec Location Rule (read this first)

**All feature specifications live in `.specify/features/NNN-slug/`. No exceptions.**

- `/specs/` at the root: DOES NOT EXIST. If you see one appear, delete it.
- `/projects/NNN-slug/specs/`: DOES NOT EXIST. Specs for a project live in `.specify/features/NNN-slug/`, not inside the project dir. The project dir holds code only.
- New feature numbers: use the next unused integer in `.specify/features/`. Before picking a number, run `ls .specify/features/ | grep -E "^0[0-9]{2}-" | sort` and take the next one.
- Collisions (two dirs sharing a number) are bugs. If you find one, rename the newer entry to the next unused number.

## Root directory

```
theinnovativenative/
├── .claude/                 # Agent skills, settings, IDE config
│   ├── skills/              # Hierarchical agent skill definitions
│   │   ├── staff/           # Level 4 — senior staff agents
│   │   ├── leads/           # Level 3 — project leads
│   │   ├── workers/         # Level 2 — task workers
│   │   ├── knowledge/       # Domain knowledge (3D, frontend, trading, etc.)
│   │   ├── infrastructure/  # System skills (Airtable, ElevenLabs, Remotion, etc.)
│   │   └── marketing/       # Marketing SOPs and platform skills
│   ├── commands/            # CLI commands
│   └── worktrees/           # Git worktree configs
│
├── .specify/                # Spec kit system + organizational memory
│   ├── features/            # ⭐ SINGLE SOURCE OF TRUTH for all feature specs
│   │   ├── 001-045, 060, 070   # Numbered features (NNN-slug/)
│   │   └── named-*             # Named features (cerebro-*, brevo-*, generational-wealth, etc.)
│   ├── archive/             # Retired/superseded specs (preserved with original numbers)
│   ├── memory/              # Constitution, learnings, safe zones, agent roster
│   ├── sops/                # Standard operating procedures
│   ├── templates/           # Spec kit templates
│   ├── plans/               # Implementation plans
│   ├── patterns/            # Reusable patterns
│   └── scripts/             # Spec kit utility scripts
│
├── projects/                # All project work (one folder per project)
│   ├── 002-stan-store-lawfirm-funnel/
│   ├── 003-haven-ugc-broll/
│   ├── 004-bowtie-bullies/
│   ├── 007-haven-blueprint/
│   ├── 008-tiny-home-timelapse/
│   ├── 009-dea-data-silo/
│   ├── 009-re-ai-marketing/
│   ├── 033-ai-trading-system/
│   ├── inn-content-calendar/    # 60-day reel content plan
│   ├── n8n-community-demo/
│   ├── ob1-brain/
│   ├── productions/
│   ├── silverado-electrical/
│   ├── the-brand-script/
│   └── website/                 # ⭐ The Innovative Native website (Next.js)
│       ├── content/blog/posts/  # 21 blog posts (canonical content)
│       ├── content/             # Case studies, background, systems architecture
│       ├── src/                 # Next.js source
│       ├── out/                 # Static build output
│       ├── .next/               # Website's own build cache (NOT the root orphan)
│       └── CLAUDE.md            # Website-specific agent instructions
│
├── remotion-videos/         # ⭐ Remotion video production project
│   ├── src/                 # React components + compositions
│   │   ├── lib/             # Shared libraries (brand, safe-zones, motion graphics)
│   │   │   └── inn-motion/  # Innovative Native motion graphics primitives
│   │   │       ├── lawbook/ # Law firm reel components
│   │   │       ├── vectors/ # SVG icons, VectorStage motion, geometric shapes
│   │   │       └── canvas/  # CanvasBoard whiteboard-style scene
│   │   ├── templates/       # Reusable composition templates (VOReel, HookReel, etc.)
│   │   │   └── inn-reels/scenes/  # Per-reel scene compositions
│   │   ├── Cerebro/         # Cerebro explainer compositions
│   │   ├── BowTie/          # BowTie Bullies compositions
│   │   ├── Ads/             # Ad creatives (TrendPilot)
│   │   └── Reels/           # Instagram reels compositions
│   ├── brands/              # Brand config JSON files (colors, fonts, overlay rules)
│   ├── public/              # Static assets loaded via staticFile()
│   │   ├── br/              # B-roll video + images
│   │   │   ├── inn-native/  # Innovative Native (headshots, reels, signoff)
│   │   │   ├── law-firm-rag/ # Law library images
│   │   │   └── pexels/      # Stock b-roll from Pexels API
│   │   ├── vo/              # Voiceover audio + word timestamps
│   │   │   └── inn-native/  # Per-reel VO bundles (vo.mp3 + words.json)
│   │   └── sfx/             # Sound effects bank
│   │       └── inn-native/  # Synthesized SFX (whoosh, impact, pop, etc.)
│   ├── out/                 # Rendered MP4s (see out/README.md for current versions)
│   └── package.json         # Remotion 4.0 + React 18
│
├── scripts/                 # Automation scripts (organized by domain)
│   ├── 002-stan-store-lawfirm-funnel/
│   ├── 003-haven-ugc-broll/
│   ├── 004-bowtie-bullies/
│   ├── 008-tiny-home-timelapse/
│   ├── 009-dea-data-silo/
│   ├── 009-re-ai-marketing/
│   ├── 032-ai-community-agents/
│   ├── 033-ai-trading-system/
│   ├── cerebro-marketing/       # Outreach, publishing calendar, marketing automation
│   ├── n8n-workflows/           # n8n workflow exports + utilities
│   ├── shared/                  # Cross-project utilities (timeline XML, Premiere prep)
│   ├── skool/                   # Skool scraper + content import
│   ├── vo-pipeline/             # VO slicing, Pexels fetch, SFX generation
│   ├── website-audits/          # Site audit, deep audit, blog check, toughlove audit
│   └── twingen/                 # TwinGen automation scripts
│
├── supabase/                # ⭐ Community platform database (DO NOT DELETE)
│   ├── config.toml          # Project config
│   ├── functions/           # Edge functions
│   └── migrations/          # 18 SQL migration files (schema, seed, features)
│
├── output/                  # Deliverables (voiceover recordings, proposal decks)
│   ├── voiceover/           # Master VO recordings + Whisper transcripts
│   └── dea-proposal/        # DEA proposal PPTX
│
├── venv/                    # ⭐ Shared Python 3.9 virtualenv (DO NOT DELETE)
│                            # Used by: playwright (site audits), ddgs (contact sourcing),
│                            # google-oauthlib (Gmail/Calendar auth), numpy, fonttools
│
├── CLAUDE.md                # Root orchestrator rules (all agents read this)
├── README.md                # Project overview
├── SECURITY-GUARDRAILS.md   # Security rules and guardrails
├── REPO_STRUCTURE.md        # This file
├── .gitignore               # Git ignore rules
├── .gitleaks.toml           # Secret scanning config
├── package.json             # Minimal root deps (56 bytes)
└── package-lock.json        # Root lock file
```

## Conventions

### Naming

| Scope | Convention | Examples |
|---|---|---|
| Project folders | `NNN-kebab-case` (numbered prefix for tracking) | `033-ai-trading-system` |
| Feature specs | Same as project or `named-kebab-case` | `cerebro-outreach-system`, `brevo-analytics` |
| Script folders | Match project ID or domain-kebab | `004-bowtie-bullies`, `website-audits`, `vo-pipeline` |
| React components | PascalCase `.tsx` | `WordCaption.tsx`, `LawBookPage.tsx` |
| Python scripts | snake_case `.py` | `slice_vo.py`, `fetch_pexels.py` |
| JS/TS scripts | kebab-case | `site-audit-deep.mjs`, `skool-scraper.ts` |
| Memory files | kebab-case `.md` | `social-media-safe-zones.md` |
| Brand folders | kebab-case | `innovative-native`, `bowtie-bullies` |

### Where things go

| What | Where | NOT here |
|---|---|---|
| Feature spec (spec.md, plan.md, tasks.md) | `.specify/features/{name}/` | ~~`specs/`~~ (deleted) |
| Project docs, data, artifacts | `projects/{id}/` | Root |
| Automation scripts | `scripts/{domain}/` | Root of `scripts/` as loose files |
| Agent skills | `.claude/skills/{tier}/` | `.specify/` |
| Learning + constitution | `.specify/memory/` | `.claude/` |
| SOPs (operational procedures) | `.specify/sops/` | `projects/` |
| Remotion compositions | `remotion-videos/src/` | `projects/` |
| Rendered video output | `remotion-videos/out/` | `output/` |
| Voiceover recordings | `output/voiceover/` | `remotion-videos/public/vo/` (sliced per-reel copies go here) |
| Supabase migrations | `supabase/migrations/` | `projects/website/` |
| Brand config | `remotion-videos/brands/` | `.claude/skills/pptx-generator/brands/` (PPTX has its own copy) |

### CLAUDE.md hierarchy

| File | Scope | Priority |
|---|---|---|
| `/CLAUDE.md` | All agents, all projects | Highest (global rules) |
| `projects/{project}/CLAUDE.md` | That specific project only | Overrides root within scope |
| `.claude/skills/{skill}/SKILL.md` | That skill's context only | Supplements, doesn't override |

### Backward-compatibility symlinks

Three symlinks exist in `scripts/` to preserve external references (in CLAUDE.md, settings.local.json, and spec docs) while files live in their proper subdirectories:

```
scripts/skool-scraper.ts             → skool/skool-scraper.ts
scripts/populate_publishing_calendar.py → cerebro-marketing/populate_publishing_calendar.py
scripts/deploy_tht_workflows.py      → 008-tiny-home-timelapse/deploy_tht_workflows.py
```

These symlinks can be removed once all external references are updated to the new paths.

## What was cleaned up (2026-04-06)

| Action | Details |
|---|---|
| Deleted `secondBrain.zip` | 928 KB orphaned archive |
| Deleted `qwen3_VO/` | 1.8 GB abandoned Python project (duplicate of scripts/003-*) |
| Deleted `premiere-prep/` | 21 MB dead BowTie workspace (pipeline confirmed retired) |
| Deleted `tests/` | 16 KB single XML fixture |
| Deleted root `.next/` | 2 orphaned Next.js trace files |
| Deleted `specs/` | Moved all 29 folders → `.specify/features/` (2 merged, 27 moved) |
| Consolidated 9 loose scripts | Organized into `scripts/website-audits/`, `scripts/skool/`, `scripts/cerebro-marketing/`, `scripts/008-tiny-home-timelapse/` |
| Created 3 symlinks | Backward compatibility for relocated scripts |
| Created `remotion-videos/out/README.md` | Labels current render versions |

**Backup:** `/Users/makwa/theinnovativenative-backup-2026-04-06.tar.gz` (19 GB, excludes node_modules/.git/venv)

## Safe zones for concurrent agents

When multiple agents work simultaneously, respect these ownership boundaries:

| Agent | Primary folders | Don't touch |
|---|---|---|
| Creative (reels) | `remotion-videos/`, `scripts/vo-pipeline/`, `projects/inn-content-calendar/` | `projects/website/`, `supabase/`, `.specify/features/brevo-*` |
| Website / tech debt | `projects/website/`, `supabase/`, `scripts/website-audits/` | `remotion-videos/`, `scripts/vo-pipeline/` |
| Outreach / Brevo | `.specify/features/brevo-*`, `scripts/cerebro-marketing/`, `.specify/features/cerebro-*` | `remotion-videos/`, `projects/website/` |
| Investor package | `docs/` (new folder) | Everything else |

Before moving or deleting any file outside your primary folders, check `git status` for uncommitted changes by other agents.

## Migration Log

### 2026-04-24 — Spec consolidation

Three spec locations (`/specs/`, `/projects/*/specs/`, `.specify/features/`) merged into one.

**Renumbered to resolve collisions:**
- `011-community-feed` → `041-community-feed` (kept `011-cerebro-reply-monitor`)
- `021-seo-content-engine` → `042-seo-content-engine` (kept `021-payments-subscriptions`)
- `032-skool-migration-mvp` → `043-skool-migration-mvp` (kept `032-ai-community-agents`)
- `035-warrior-n8n-migration` → `044-warrior-n8n-migration` (kept `035-harness-autonomy`)
- `/specs/034-community-feed-ux` → `.specify/features/045-community-feed-ux` (`034` was held by `warrior-gap-and-go-sleeve`)

**Moved (new home in `.specify/features/`):**
- `/specs/070-n8n-fleet-health-monitor` → `.specify/features/070-n8n-fleet-health-monitor`
- `/projects/002-stan-store-lawfirm-funnel/specs/*` → `.specify/features/002-stan-store-lawfirm-funnel/`
- `/projects/003-haven-ugc-broll/specs/*` → `.specify/features/003-haven-ugc-broll/`
- `/projects/004-bowtie-bullies/specs/*` → `.specify/features/004-bowtie-bullies/`

Root `/specs/` directory deleted. Project `specs/` subdirs removed. Cross-references updated in ~20 files. Historical references in `.specify/archive/2026-04/*` intentionally preserved (archived snapshots should reflect what-was).
