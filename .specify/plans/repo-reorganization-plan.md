# Repo Reorganization Plan

**Status:** Draft — awaiting approval
**Branch:** 006-ai-assisted-editing-pp2026
**Created:** 2026-02-14

---

## Problem

The second brain repo has grown organically without a consistent folder convention. Project assets are scattered across root-level folders, scripts are a flat junk drawer mixing 3+ projects, and binary media is committed directly to git.

---

## Target Structure

```
projects/
├── 002-lawfirm-funnel/
│   └── (consolidate law_firm_RAG/ + deliverables/002-stan-store-lawfirm-funnel/)
├── 003-haven-ugc/
│   └── (move deliverables/003-haven-ugc-broll/)
├── 004-bowtie-bullies/
│   ├── brand/                 # brand-blueprint, style guide, channel art, logo spec
│   ├── episodes/
│   │   └── EP-001/            # script, pipeline JSON, timeline JSON, vo-direction, vo-text/, vo audio
│   ├── assets/                # canonical characters, logos, thumbnails, redNosePitBull.jpg
│   ├── media/                 # b-roll, SFX, music (.gitignore'd, GDrive-referenced)
│   ├── workflows/             # ComfyUI JSONs, n8n workflow JSONs
│   ├── audits/
│   └── plans/
├── 006-ai-editing/
│   ├── premiere/              # vidEdit/ contents (prproj, prin, MOGRTs, Premiere Composer)
│   ├── remotion/              # remotion-videos/ contents
│   └── references/            # cinema_knowledge/ contents
└── website/
    └── (websiteStuff/ contents)
```

### Stays at root
- `.claude/` — skills, commands (unchanged)
- `.specify/` — memory, features, templates, SOPs (unchanged)
- `scripts/` — restructured (see below)
- `CLAUDE.md`, `README.md`

### Scripts restructure
```
scripts/
├── 004-bowtie/                # bowtie_*, upload_*, queue_*, generate_sfx, etc.
├── 003-haven/                 # haven_phase1_setup.py
├── 002-lawfirm/               # fix-contacts.py, create-interactions.py, seed-*.py
├── shared/                    # extract_shorts.sh, batch_upscale.py, timeline_to_ffmpeg.py
└── n8n-workflows/             # stays (already grouped)
```

---

## Migration Steps

### Phase 1: Create new directory skeleton
1. `mkdir -p projects/{002-lawfirm-funnel,003-haven-ugc,006-ai-editing/{premiere,remotion,references},website}`
2. `mkdir -p projects/004-bowtie-bullies/{brand,episodes/EP-001,assets,media,workflows,audits,plans}`
3. `mkdir -p scripts/{004-bowtie,003-haven,002-lawfirm,shared}`

### Phase 2: Move project folders into projects/
1. `git mv law_firm_RAG/* projects/002-lawfirm-funnel/`
2. `git mv deliverables/002-stan-store-lawfirm-funnel/* projects/002-lawfirm-funnel/`
3. `git mv deliverables/003-haven-ugc-broll/* projects/003-haven-ugc/`
4. `git mv websiteStuff/* projects/website/`

### Phase 3: Restructure 004 (largest move)
1. **Brand docs** → `projects/004-bowtie-bullies/brand/`
   - brand-blueprint.md, visual-style-guide.md, channel-art-specs.md, logo-system-spec.md, intro-outro-spec.md, platform-strategy.md, content-pillar-matrix.md, red-nose-character-bible.md, youtube-ai-policy-reference.md, hook-playbook.md
2. **Episode content** → `projects/004-bowtie-bullies/episodes/EP-001/`
   - scripts/EP-001-*, scripts/EP01-*, scripts/vo-text/EP-001/, scripts/bowtie-bullies-dialogue.json
3. **Assets** → `projects/004-bowtie-bullies/assets/`
   - canonicalCharacter/, redNosePitBull.jpg, youtube-banner-2560x1440.png, pose-variants.md, episode-quote-assets.md
4. **Media** → `projects/004-bowtie-bullies/media/`
   - broll/, SFX/, music/, grade/
   - Add to `.gitignore` and document GDrive locations
5. **Workflows** → `projects/004-bowtie-bullies/workflows/`
   - comfyUIworkflows/, root comfyUI/
6. **Audits** → `projects/004-bowtie-bullies/audits/` (already exists, just move)
7. **Plans** → `projects/004-bowtie-bullies/plans/` (already exists, just move)
8. **Remaining docs** stay in project root: episodes.md, episodes-expanded.md, launch-plan.md, legal-compliance.md, PRDs

### Phase 4: Move editing assets into 006
1. `git mv vidEdit/* projects/006-ai-editing/premiere/`
2. `git mv remotion-videos/* projects/006-ai-editing/remotion/`
3. `git mv cinema_knowledge/* projects/006-ai-editing/references/`

### Phase 5: Reorganize scripts/
1. `git mv scripts/bowtie_*.py scripts/004-bowtie/`
2. `git mv scripts/upload_*.py scripts/004-bowtie/`
3. `git mv scripts/queue_character_sheet.py scripts/004-bowtie/`
4. `git mv scripts/generate_sfx.py scripts/004-bowtie/`
5. `git mv scripts/qwen3_vo_preview.py scripts/004-bowtie/`
6. `git mv scripts/pipeline_to_timeline.py scripts/004-bowtie/`
7. `git mv scripts/create_airtable_tables.py scripts/004-bowtie/`
8. `git mv scripts/ep01_gdrive_folder_ids.json scripts/004-bowtie/`
9. `git mv scripts/canonical_images_gdrive.json scripts/004-bowtie/`
10. `git mv scripts/haven_phase1_setup.py scripts/003-haven/`
11. `git mv scripts/fix-contacts.py scripts/002-lawfirm/`
12. `git mv scripts/create-interactions.py scripts/002-lawfirm/`
13. `git mv scripts/seed-90-day-data.py scripts/002-lawfirm/`
14. `git mv scripts/seed-okrs.py scripts/002-lawfirm/`
15. `git mv scripts/extract_shorts.sh scripts/shared/`
16. `git mv scripts/batch_upscale.py scripts/shared/`
17. `git mv scripts/timeline_to_ffmpeg.py scripts/shared/`

### Phase 6: Clean up empties and merge specs
1. Remove empty `deliverables/`, `law_firm_RAG/`, `websiteStuff/`, `vidEdit/`, `remotion-videos/`, `cinema_knowledge/`, `comfyUI/` dirs
2. Evaluate `specs/` vs `.specify/` — merge if redundant, delete `specs/` if so
3. Evaluate `output/`, `upscaled/` — add to `.gitignore` if build artifacts

### Phase 7: Update .gitignore for binary media
```gitignore
# Binary media — track via GDrive, not git
projects/004-bowtie-bullies/media/**/*.mp3
projects/004-bowtie-bullies/media/**/*.wav
projects/004-bowtie-bullies/media/**/*.zip
projects/006-ai-editing/premiere/**/*.prproj
projects/006-ai-editing/premiere/**/*.prin
projects/006-ai-editing/premiere/**/*.aegraphic
projects/006-ai-editing/premiere/**/*.zip
*.mp3
*.wav
```

### Phase 8: Update references
1. Update `CLAUDE.md` project paths
2. Update `.specify/memory/projects/registry.json` if paths are referenced
3. Grep for hardcoded paths in scripts and update

---

## Risks
- **Other agents currently working** — coordinate timing so no active work conflicts with moves
- **Git history** — `git mv` preserves history; avoid copy+delete
- **Script imports** — check for relative imports that break after moves
- **n8n/Airtable references** — any hardcoded local paths in integrations need updating

---

## Pre-Execution Checklist
- [ ] All active agent sessions completed or paused
- [ ] Current branch committed and clean
- [ ] Confirm no other branches have in-flight work touching these paths
- [ ] Back up before executing (or ensure git state is clean)
