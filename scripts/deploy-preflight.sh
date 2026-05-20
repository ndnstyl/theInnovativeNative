#!/usr/bin/env bash
# =============================================================================
# DEPLOY PREFLIGHT — manifest check that prevents "rsync --delete wipes pages"
# =============================================================================
#
# Built after the 2026-05-02 incident where deploying from a branch missing
# generational-wealth/ and quiz/ wiped them off production via rsync --delete.
#
# This script runs BEFORE any rsync deploy and:
#   1. Verifies the local out/ directory exists and is fresh
#   2. Loads the canonical page manifest (pages-manifest.json)
#   3. Confirms every page in the manifest exists in out/
#   4. Aborts with a clear error if anything is missing
#   5. Logs the verified state to .deploy-history/
#
# Usage:
#   ./scripts/deploy-preflight.sh
#   # exit 0 = safe to deploy
#   # exit 1 = manifest mismatch, DO NOT deploy
#
# Update the manifest:
#   ./scripts/deploy-preflight.sh --update-manifest
#
# =============================================================================

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$REPO_ROOT/projects/website/out"
MANIFEST="$REPO_ROOT/scripts/pages-manifest.json"
DEPLOY_HISTORY="$REPO_ROOT/.deploy-history"

# Color helpers
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
NC='\033[0m'

err()  { echo -e "${RED}✗${NC} $*" >&2; }
ok()   { echo -e "${GREEN}✓${NC} $*"; }
warn() { echo -e "${YELLOW}!${NC} $*"; }
info() { echo -e "${CYAN}→${NC} $*"; }

# --- Argument handling -----------------------------------------------------

UPDATE_MANIFEST=false
if [[ "${1:-}" == "--update-manifest" ]]; then
  UPDATE_MANIFEST=true
fi

# --- Sanity: out/ exists ---------------------------------------------------

if [[ ! -d "$OUT_DIR" ]]; then
  err "out/ directory does not exist at $OUT_DIR"
  err "Run 'npm run build' first."
  exit 1
fi

# Reject stale builds (older than 30 minutes)
if [[ "$UPDATE_MANIFEST" == "false" ]]; then
  if [[ -f "$OUT_DIR/index.html" ]]; then
    # macOS stat
    LAST_MOD=$(stat -f %m "$OUT_DIR/index.html" 2>/dev/null || stat -c %Y "$OUT_DIR/index.html")
    NOW=$(date +%s)
    AGE_MIN=$(( (NOW - LAST_MOD) / 60 ))
    if (( AGE_MIN > 30 )); then
      err "out/ is $AGE_MIN minutes old. Stale build. Run 'npm run build' fresh."
      exit 1
    fi
    ok "Build age: $AGE_MIN min (fresh)"
  fi
fi

# --- Build the actual page list --------------------------------------------

ACTUAL_PAGES=$(find "$OUT_DIR" -name "*.html" -type f 2>/dev/null \
  | sed "s|$OUT_DIR/||" \
  | sort)

ACTUAL_COUNT=$(echo "$ACTUAL_PAGES" | wc -l | tr -d ' ')

# --- Update-manifest mode --------------------------------------------------

if [[ "$UPDATE_MANIFEST" == "true" ]]; then
  info "Updating manifest with $ACTUAL_COUNT pages from current out/"
  mkdir -p "$(dirname "$MANIFEST")"
  python3 - <<PY
import json, os
pages = """$ACTUAL_PAGES""".strip().split("\n")
pages = [p for p in pages if p]
data = {
    "version": 1,
    "generated_at": "$(date -u +%FT%TZ)",
    "page_count": len(pages),
    "pages": pages,
    "description": "Canonical page manifest. Updated only when ALL pages are intentionally present in out/. Run scripts/deploy-preflight.sh --update-manifest to refresh.",
}
with open("$MANIFEST", "w") as f:
    json.dump(data, f, indent=2)
PY
  ok "Manifest written: $MANIFEST ($ACTUAL_COUNT pages)"
  exit 0
fi

# --- Compare against manifest ----------------------------------------------

if [[ ! -f "$MANIFEST" ]]; then
  warn "No manifest yet. Run with --update-manifest to seed one."
  warn "Skipping comparison this run."
  info "Captured current build: $ACTUAL_COUNT pages"
  ok "Preflight PASSED (no manifest baseline yet)"
  exit 0
fi

# Compare
MISSING=$(python3 - <<PY
import json, sys
manifest = json.load(open("$MANIFEST"))
actual = set("""$ACTUAL_PAGES""".strip().split("\n"))
actual = {p for p in actual if p}
expected = set(manifest["pages"])
missing = expected - actual
new = actual - expected
if missing:
    print("MISSING:")
    for p in sorted(missing):
        print(f"  {p}")
if new:
    print("NEW (not yet in manifest):")
    for p in sorted(new):
        print(f"  {p}")
if not missing and not new:
    print("OK")
PY
)

if [[ "$MISSING" == "OK" ]]; then
  ok "Preflight PASSED: $ACTUAL_COUNT pages match manifest exactly"

  # Log the verified deploy
  mkdir -p "$DEPLOY_HISTORY"
  STAMP=$(date -u +%Y%m%dT%H%M%SZ)
  echo "{\"timestamp\":\"$STAMP\",\"pages\":$ACTUAL_COUNT,\"sha\":\"$(git -C "$REPO_ROOT" rev-parse HEAD)\"}" > "$DEPLOY_HISTORY/$STAMP.json"
  info "Logged to .deploy-history/$STAMP.json"

  exit 0
fi

# Pages missing — block deploy
err "Preflight FAILED. out/ does not match canonical manifest."
echo "$MISSING" | sed 's/^/  /'
echo ""
err "Refusing to deploy. If the changes are intentional:"
err "  1. Verify the missing pages should genuinely be gone"
err "  2. Run: ./scripts/deploy-preflight.sh --update-manifest"
err "  3. Commit the updated manifest"
err "  4. Re-run deploy"
exit 1
