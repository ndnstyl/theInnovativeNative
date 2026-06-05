#!/usr/bin/env bash
# n8n-cleanup-2026-06.sh — delete 47 dead/duplicate workflows from the live n8n instance.
# -----------------------------------------------------------------------------
# Source of truth: repo-cleanup-audit (2026-06-05). 35 self-labeled
# [SUPERSEDED]/[ARCHIVE]/DEPRECATED/TEST/FFmpeg one-offs + 12 inactive
# exact-duplicate drafts of confirmed-active canonicals.
#
# IRREVERSIBLE. Dry-run by default. To actually delete:
#     bash scripts/cleanup/n8n-cleanup-2026-06.sh --yes
#
# Creds are read from ~/.claude/.mcp.json (N8N_API_URL, N8N_API_KEY).
# -----------------------------------------------------------------------------
set -uo pipefail

MCP="$HOME/.claude/.mcp.json"
BASE="$(python3 -c "import json;m=json.load(open('$MCP'));print(m['mcpServers']['n8n']['env']['N8N_API_URL'])")"
KEY="$(python3 -c "import json;m=json.load(open('$MCP'));print(m['mcpServers']['n8n']['env']['N8N_API_KEY'])")"
BASE="${BASE%/}"
case "$BASE" in *"/api/v1") ;; *) BASE="$BASE/api/v1" ;; esac

DRY=1
[ "${1:-}" = "--yes" ] && DRY=0

# --- 35 safe: self-labeled SUPERSEDED / ARCHIVE / DEPRECATED / TEST / FFmpeg one-offs ---
SAFE=(
  ezv9O58xTPBNnGn4 4ssUFPS0LBNJ6zT7 BT2CpVpzW432seZ6 TT9MCqkb1niVIPu3 W8kZwHSLP86AeSCN
  BMnJM32IrZAuYU97 qs4lT8oQnQhlI0yh P6MMsozk6gNO7nyk O6BFhMUDXrWQ8LcF PHKze8rbgrD2fATU
  lQmgJAAKETo8OJbG olYaaOdKgMVed4i7 TCciVYftj6GeSzyg nJTAHO6rELKH77y6 s7l4lrHJIggkxQy6
  WLnXy8IYl0eFsNO0 XEL4bFH3SO487gnS z4DLlY8Xl3c8jXTL Vz7pNBzfpCdxG0lN xZwMqRkB8OCDiXPg
  NIldTzMxE9wauiJp 7dj54gUTKjpNhJpm 6NdafUa1YZOddU5M 1QqyrR35xGhstK2i d20JjcGf1A0YrtaA
  9FffL9HLFWLe60Z9 hGVLwuBRunJeLHeY MhRtwhtcgE3TNmIX XGLYPYRyGR5PsaiX n4HtQrTKdpF1eGx6
  T5hQS2b8vWn4HugG v705e0BGM5nomJVS AUT4pbn1X3bFqOAM MNfAxvIwRZw1me05 XE8mpEZhV2yhmpzF
)
# --- 12 inactive exact-duplicate drafts of active canonicals ---
DUPS=(
  NdsBJ3cmq0xIn08Z sBuT2jpHwlprAmW6 YybZL1nXtEldZg7Z   # Trading Monitor dup-drafts
  OmtrDX7rV2DHuq6h wgsr3Gsl6I9OEkxG Zmct4KYjS5ekCYuU xMjPoAKbYhgEaKU2  # Trading Reports dup-drafts
  K2AW84OiBr2RXp88                                       # Trading Engine dup-draft
  Nsy2qgF76UvSj5Aq VrG5wSEMt34jsa9a vlR1PwuBg3OoJkyH    # BowTie dup-drafts
  VKv2MYkrHnqjSev4                                       # Cerebro Auto-Poster 3-node stub
)

# --- 9 LEFT FOR YOUR REVIEW (NOT deleted — uncomment to include) ---
#   UOWaK2QKFNl1PpIV  # Linkedin & Instagram Automation_v2 (newer than active canonical)
#   XClcjPbg8nH8W8YL  # UK Local Services - Batch Seed Generator (obsolete)  [ACTIVE]
#   VQBBuFW8yWfrpso2  # UK Local Services - Normalize (obsolete)            [ACTIVE]
#   xM364S8JG1itgNog  # UK Local Services - Enrichment (obsolete)           [ACTIVE]
#   zoDGCR1ejuJVFPPV  # Cerebro Cold Email Drip Sequence (duplicate)
#   uNlGjRPCtL47ilfA  # edit with nanoBanana (active=true AND archived=true anomaly)
#   0LkN9awPOdmvnpPM  # FFmpeg Container Installer (may be needed for VPS rebuilds)
#   YhHMBUnYixL2gce9  # combine images nanaoBanana (dup of 'combine images nano')
#   qBGC2vYWsLQQTapj  # combine images nano

ALL=("${SAFE[@]}" "${DUPS[@]}")
echo "n8n cleanup — ${#ALL[@]} workflows targeted ($([ "$DRY" = 1 ] && echo DRY-RUN || echo LIVE-DELETE))"
echo "endpoint: $BASE/workflows/<id>"
echo

ok=0; fail=0
for id in "${ALL[@]}"; do
  if [ "$DRY" = 1 ]; then
    echo "  would delete: $id"
  else
    code="$(curl -s -o /dev/null -w '%{http_code}' -X DELETE \
             -H "X-N8N-API-KEY: $KEY" -H "accept: application/json" \
             "$BASE/workflows/$id")"
    if [ "$code" = "200" ] || [ "$code" = "204" ]; then
      echo "  ✓ deleted $id"; ok=$((ok+1))
    else
      echo "  ✗ $id -> HTTP $code"; fail=$((fail+1))
    fi
  fi
done

echo
if [ "$DRY" = 1 ]; then
  echo "Dry run complete. Re-run with --yes to delete for real."
else
  echo "Done: $ok deleted, $fail failed. 9 review-items left untouched."
fi
