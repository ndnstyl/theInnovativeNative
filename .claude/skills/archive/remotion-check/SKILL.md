---
name: remotion-check
description: Pre-render validation for Remotion compositions. Run before every render or Lambda deploy.
---

# Remotion Pre-Render Validator

## Quick Start

```bash
# Full validation
python3 ~/.claude/skills/remotion-check/scripts/validate_remotion.py \
  /Users/makwa/theinnovativenative/remotion-videos

# Single composition
python3 ~/.claude/skills/remotion-check/scripts/validate_remotion.py \
  /Users/makwa/theinnovativenative/remotion-videos --composition HookReel

# Skip TypeScript check (faster, for rapid iteration)
python3 ~/.claude/skills/remotion-check/scripts/validate_remotion.py \
  /Users/makwa/theinnovativenative/remotion-videos --skip-tsc
```

## Mandatory Usage

Run on every composition:
1. **Before a single render** — catches 90% of render failures before Lambda cost
2. **Before deploying a new site bundle** — ensures `npx remotion lambda sites create` doesn't ship broken code
3. **Before a batch render** (IG Content Factory 40 reels/day) — avoids $0.50+ waste per failed render

Score must be **8+/10** with **zero CRITICAL** before rendering.

## Check Categories

| # | Check | Severity | Catches |
|---|-------|----------|---------|
| 1 | Composition Registration | CRITICAL | Render script names not matching `<Composition id>` in Root.tsx |
| 2 | staticFile Asset Existence | CRITICAL | `staticFile("vo/foo.mp3")` where file doesn't exist in public/ |
| 3 | Brand Slug Validity | CRITICAL | `getBrand("typo")` — slug not in brands/ directory |
| 4 | Brand Assets (logos, watermarks) | HIGH | logo/watermark paths in brand.json that don't resolve |
| 5 | H.264 Codec Enforcement | HIGH | `--codec=prores` in social-delivery render scripts (scripts named `-prores`/`-master`/`-archive` exempt) |
| 6 | TypeScript Compile | HIGH | `tsc --noEmit` errors in src/ |
| 7 | Placeholder Text | HIGH | "Your hook here", "Lorem ipsum", "TODO" in Root.tsx defaultProps |
| 8 | Safe Zone Overlay Leakage | HIGH | `showSafeZones: true` left in production composition defaults |
| 9 | Duration Math | MEDIUM | `durationInFrames` inconsistent with scene duration sum |
| 10 | Font Availability | MEDIUM | Fonts referenced in brand.json not loaded via @remotion/fonts |
| 11 | Platform Aspect Match | LOW | Composition width/height doesn't match brand safe_zone_preference aspect |

Score is normalized to /10 regardless of check count. Ready threshold: **≥8/10 with zero CRITICAL**.

## Output Format

```
Remotion Validator — /Users/makwa/theinnovativenative/remotion-videos
========================================================================

[1/10] Composition Registration              ✅ PASS  (24 compositions registered)
[2/10] staticFile Asset Existence            ❌ FAIL  (3 missing)
         - vo/bowtie/scene-02.mp3 referenced in CaptionTrack.tsx
         - assets/logo.png referenced in brand.json "innovative-native"
         - br/placeholder.mp4 referenced in BRollTextReel default
[3/10] Brand Slug Validity                    ✅ PASS  (5 slugs valid)
[4/10] H.264 Codec Enforcement                ⚠️  WARN (1 prores render in production scripts)
         - bowtie:intro-prores targets social delivery
[5/10] TypeScript Compile                     ✅ PASS
[6/10] Placeholder Text                       ❌ FAIL  (2 placeholders in defaultProps)
         - HookReel: "Your hook headline here"
         - ListicleReel: "5 WAYS TO DO X"
[7/10] Safe Zone Overlay Leakage              ✅ PASS
[8/10] Duration Math                          ✅ PASS
[9/10] Font Availability                      ⚠️  WARN (2 fonts not explicitly loaded)
         - Playfair Display (innovative-native brand)
         - Anton (bowtie-bullies brand)
[10/10] Platform Aspect Match                 ✅ PASS

Score: 6/10 — ❌ NOT READY (fix CRITICAL + HIGH issues)
```

## When Each Check Fires

### 1. Composition Registration (CRITICAL)
Parses `package.json` scripts for `remotion render <CompositionId>` patterns, then parses `src/Root.tsx` for `<Composition id="...">` declarations. Fails if any script references an unregistered composition.

### 2. staticFile Asset Existence (CRITICAL)
Greps all `src/**/*.{ts,tsx}` for `staticFile("...")` and `staticFile('...')` calls. Checks each path exists under `public/`. Also validates `backgroundSrc`, `logo`, `watermark` fields in brand JSON files.

### 3. Brand Slug Validity (CRITICAL)
Greps for `getBrand("...")` calls, validates each slug exists in `brands/` directory and has a valid `brand.json`.

### 4. H.264 Codec Enforcement (HIGH)
Parses `package.json` scripts. Warns on `--codec=prores` or `--codec=webm` unless the script name includes `master` or `archive` (which are allowed for archival masters).

### 5. TypeScript Compile (HIGH)
Runs `npx tsc --noEmit` in the Remotion project directory. Fails on any error in `src/`. Use `--skip-tsc` to bypass during rapid iteration.

### 6. Placeholder Text (HIGH)
Scans `defaultProps` in Root.tsx + template files for common placeholders: "Your hook", "Lorem ipsum", "TODO", "Placeholder", "Example", "Replace with". These survive into renders when agents forget to override.

### 7. Safe Zone Overlay Leakage (HIGH)
Greps for `showSafeZones: true` or `<SafeZoneOverlay enabled={true}` in files other than `lib/SafeZoneOverlay.tsx`. The dev overlay must be disabled before any production render.

### 8. Duration Math (MEDIUM)
For compositions that compute `durationInFrames` from a sum (like Cerebro's `calculateTotalDuration`), verifies the math by parsing the source. Warns if the hard-coded total doesn't match the sum.

### 9. Font Availability (MEDIUM)
Parses brand.json `fonts.heading`/`fonts.body`/`video_overlay.hook_font` values. Checks each is either:
- Loaded via `@remotion/google-fonts` in `src/**/*.tsx`
- Present in `src/fonts/` local font directory

### 10. Platform Aspect Match (LOW)
Reads `video_overlay.safe_zone_preference` from brand.json, maps to expected aspect ratio from safe-zones.json, compares with any Composition width/height that uses this brand. Warns on mismatch.

## Exit Codes

| Code | Meaning |
|---|---|
| 0 | All checks passed (score ≥ 8, zero CRITICAL) |
| 1 | One or more CRITICAL failures |
| 2 | Score below 8 but no CRITICAL |
| 3 | Project path invalid or tsconfig missing |

## Integration

### Pre-commit hook (recommended)
Add to `.git/hooks/pre-commit`:
```bash
if [ -d "remotion-videos" ]; then
  python3 ~/.claude/skills/remotion-check/scripts/validate_remotion.py \
    "$(git rev-parse --show-toplevel)/remotion-videos" --skip-tsc || exit 1
fi
```

### Before Lambda site deploy
```bash
python3 ~/.claude/skills/remotion-check/scripts/validate_remotion.py \
  remotion-videos && \
  npx remotion lambda sites create src/index.ts --site-name=main
```

### In n8n content factory workflows
Call from a Code node via child_process before triggering `renderMediaOnLambda`:
```js
const { execSync } = require('child_process');
const result = execSync(
  'python3 ~/.claude/skills/remotion-check/scripts/validate_remotion.py /path/to/remotion-videos --composition HookReel'
);
if (result.status !== 0) throw new Error('Remotion validation failed');
```

## Related Skills

- **n8n-check** — sibling skill for n8n workflow validation
- **Remotion rules** (`.claude/skills/remotion/rules/`) — composition authoring reference
- **Remotion brand system** (`remotion-videos/brands/`) — validated by this tool
- **Safe zones** (`.specify/memory/social-media-safe-zones.json`) — consumed for aspect validation
- **Remotion Lambda** (`infrastructure/remotion-lambda`) — this is the gate before Lambda deploys

## Changelog

- **2026-04-05** — Initial. 10 checks, mirrors n8n-check architecture
