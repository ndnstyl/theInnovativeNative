#!/usr/bin/env bash
# repo-hygiene.sh — weekly repo cleanliness sweep + drift alert
# -----------------------------------------------------------------------------
# Runs OUTSIDE Claude Code (launchd/cron) so it has normal rm permissions.
# Claude's block-destructive hook only applies inside interactive sessions.
#
#   AUTO-FIX  : regenerable caches, .DS_Store, __pycache__, old daily-logs,
#               known deprecated skill stubs.
#   ALERT-ONLY: buried specs, large non-ignored files, merge-conflict markers,
#               broken registry specPaths.
#
# Manual run (instant cleanup):  bash scripts/repo-hygiene.sh
# Slack: set SLACK_WEBHOOK_SYSTEM in the environment to receive a summary.
# -----------------------------------------------------------------------------
set -uo pipefail
REPO="${REPO:-/Users/makwa/theinnovativenative}"
cd "$REPO" || { echo "repo not found: $REPO"; exit 1; }

TS="$(date +%Y-%m-%d)"
REPORT_DIR="$REPO/.specify/memory/reports"
mkdir -p "$REPORT_DIR"
REPORT="$REPORT_DIR/hygiene-$TS.md"
ALERT_COUNT=0

log(){ echo "$@" >> "$REPORT"; }

{ echo "# Repo Hygiene Report — $TS"; echo; } > "$REPORT"

# ----------------------------------------------------------------------------
log "## Auto-fixed"
# 1. Regenerable caches
for d in ".playwright-mcp" "Adobe Premiere Pro Auto-Save" "Adobe Premiere Pro Audio Previews"; do
  if [ -e "$d" ]; then
    sz="$(du -sh "$d" 2>/dev/null | cut -f1)"
    rm -rf "$d" && log "- removed cache: \`$d\` ($sz)"
  fi
done
# 2. .DS_Store sweep
DSN="$(find . -name .DS_Store -not -path './.git/*' -not -path '*/node_modules/*' 2>/dev/null | wc -l | tr -d ' ')"
if [ "$DSN" -gt 0 ]; then
  find . -name .DS_Store -not -path './.git/*' -not -path '*/node_modules/*' -delete 2>/dev/null
  log "- swept $DSN .DS_Store file(s)"
fi
# 3. __pycache__ sweep (skip deps/venvs)
find . -type d -name __pycache__ -not -path '*/node_modules/*' -not -path '*/.venv/*' -not -path '*/venv/*' -exec rm -rf {} + 2>/dev/null && true
# 4. Idempotent removal of known-deprecated skill stubs
for stub in \
  ".claude/skills/career/resume-ats-optimizer" \
  ".claude/skills/career/resume-tailor" \
  ".claude/skills/career/tech-resume-optimizer"; do
  [ -d "$stub" ] && rm -rf "$stub" && log "- removed deprecated stub: \`$stub\`"
done
# 5. Archive daily-logs older than 14 days
ARCH="$REPO/.specify/memory/_logs-archive"
mkdir -p "$ARCH"
MOVED=0
while IFS= read -r f; do
  mv "$f" "$ARCH/" 2>/dev/null && MOVED=$((MOVED+1))
done < <(find .specify/memory -maxdepth 1 -type f \
            \( -name 'ob1-hygiene-*.md' -o -name 'prompt-mutation-*.md' -o -name 'rework-scan-*.md' \) \
            -mtime +14 2>/dev/null)
[ "$MOVED" -gt 0 ] && log "- archived $MOVED daily-log(s) older than 14d to \`_logs-archive/\`"
log ""

# ----------------------------------------------------------------------------
log "## Drift alerts (need your attention)"

# A. Buried specs — work created in .specify/features/ instead of specs/
BURIED="$(find .specify/features -mindepth 1 -maxdepth 1 -type d 2>/dev/null | wc -l | tr -d ' ')"
if [ "$BURIED" -gt 0 ]; then
  log "- ⚠️ $BURIED spec dir(s) in \`.specify/features/\` — should live in \`specs/\`:"
  find .specify/features -mindepth 1 -maxdepth 1 -type d 2>/dev/null | sed 's/^/    - /' >> "$REPORT"
  ALERT_COUNT=$((ALERT_COUNT+1))
fi

# B. Large (>50MB) files that are neither ignored nor inside .git
while IFS= read -r f; do
  if ! git check-ignore -q "$f" 2>/dev/null; then
    sz="$(du -h "$f" 2>/dev/null | cut -f1)"
    log "- ⚠️ large non-ignored file: \`$f\` ($sz)"
    ALERT_COUNT=$((ALERT_COUNT+1))
  fi
done < <(find . -type f -size +50M -not -path './.git/*' -not -path '*/node_modules/*' 2>/dev/null)

# C. Merge-conflict markers in tracked files.
# Real markers always carry a trailing "<space><label>" (e.g. "<<<<<<< HEAD",
# ">>>>>>> branch", "||||||| base") — this avoids false positives on decorative
# "=======" / "----" separators in comments and markdown.
CONFLICTS="$(git grep -lE '^(<<<<<<< |>>>>>>> |\|\|\|\|\|\|\| )' -- . 2>/dev/null || true)"
if [ -n "$CONFLICTS" ]; then
  log "- ⚠️ merge-conflict markers in tracked files:"
  echo "$CONFLICTS" | sed 's/^/    - /' >> "$REPORT"
  ALERT_COUNT=$((ALERT_COUNT+1))
fi

# D. Registry specPaths that point to missing dirs
if [ -f .specify/memory/projects/registry.json ]; then
  MISSING="$(python3 - <<'PY' 2>/dev/null
import json, os
try:
    r = json.load(open('.specify/memory/projects/registry.json'))
except Exception:
    raise SystemExit
for p in r.get('projects', []):
    sp = p.get('specPath')
    if sp and not os.path.isdir(sp):
        print(f"    - {p.get('id')} -> {sp}")
PY
)"
  if [ -n "$MISSING" ]; then
    log "- ⚠️ registry specPaths missing on disk:"
    echo "$MISSING" >> "$REPORT"
    ALERT_COUNT=$((ALERT_COUNT+1))
  fi
fi

[ "$ALERT_COUNT" -eq 0 ] && log "- ✅ no drift detected"

# ----------------------------------------------------------------------------
# Slack summary (optional)
SUMMARY="🧹 Repo hygiene $TS — auto-fixed clutter, $ALERT_COUNT drift alert(s). Report: .specify/memory/reports/hygiene-$TS.md"
if [ -n "${SLACK_WEBHOOK_SYSTEM:-}" ]; then
  curl -s -X POST -H 'Content-type: application/json' \
    --data "{\"text\":$(python3 -c 'import json,sys;print(json.dumps(sys.argv[1]))' "$SUMMARY")}" \
    "$SLACK_WEBHOOK_SYSTEM" >/dev/null 2>&1 || true
fi
echo "$SUMMARY"
