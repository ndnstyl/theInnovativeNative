#!/usr/bin/env bash
# enrich-fleet.sh — Deep-fetch active workflows and extract trigger/credentials/integrations.
#
# For every ACTIVE workflow in n8n-fleet.json, pulls the full node JSON from the n8n REST API and
# distills: trigger type(s), credential names used, top integration node types, and node count.
# Writes .claude/systems/n8n-detail.json (keyed by workflow id). sync-vault.sh renders this into
# the n8n_*.md pages, replacing the Trigger/Credentials placeholders with real data.
#
# Re-run after fleet changes. Idempotent. No secrets printed.
set -euo pipefail
MCP_JSON="${HOME}/.claude/.mcp.json"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
FLEET="${REPO_ROOT}/.claude/systems/n8n-fleet.json"
OUT="${REPO_ROOT}/.claude/systems/n8n-detail.json"

command -v jq >/dev/null || { echo "FATAL: jq required" >&2; exit 1; }
API_URL="$(jq -r '.mcpServers.n8n.env.N8N_API_URL' "$MCP_JSON" | sed 's:/*$::')"
API_KEY="$(jq -r '.mcpServers.n8n.env.N8N_API_KEY' "$MCP_JSON")"

# Which workflows to enrich: all ACTIVE (bash 3.2 — no mapfile).
IDS="$(jq -r '.workflows[] | select(.status=="active") | .id' "$FLEET" | sort -u)"
TOTAL="$(printf '%s\n' "$IDS" | grep -c .)"
echo "Enriching ${TOTAL} active workflows ..." >&2

TMP="$(mktemp)"; trap 'rm -f "$TMP" "$TMP".w' EXIT
echo '{}' > "$TMP"
i=0
while IFS= read -r id; do
  [ -n "$id" ] || continue
  i=$((i+1))
  if ! curl -fsS -m 45 -H "X-N8N-API-KEY: ${API_KEY}" -H "Accept: application/json" \
        "${API_URL}/api/v1/workflows/${id}" > "$TMP".w 2>/dev/null; then
    echo "  [$i/${TOTAL}] $id FETCH FAILED, skipping" >&2; continue
  fi
  jq --arg id "$id" '
    def strip: gsub("^@?[^.]*\\.";"") | gsub("^n8n-nodes-base\\.";"");
    {($id): {
      trigger: ([.nodes[] | select(.type|test("trigger|webhook|cron|formtrigger|chattrigger";"i")) | (.type|strip)] | unique),
      creds:   ([.nodes[] | (.credentials // {}) | to_entries[] | .value.name] | unique),
      integrations: ([.nodes[].type | strip | select(test("set|if|switch|merge|noop|stickynote|code|function|filter|splitinbatches|aggregate|itemlists|wait|stoponerror";"i")|not)] | group_by(.) | map({(.[0]): length}) | add // {} | to_entries | sort_by(-.value) | map(.key) | .[0:6]),
      node_count: (.nodes|length)
    }}
  ' "$TMP".w > "$TMP".merged.in 2>/dev/null || { echo "  [$i] $id parse err" >&2; continue; }
  jq -s '.[0] * .[1]' "$TMP" "$TMP".merged.in > "$TMP".merged && mv "$TMP".merged "$TMP"
done <<EOF
$IDS
EOF
rm -f "$TMP".merged.in 2>/dev/null || true

jq --arg generated "$(date -u +%Y-%m-%dT%H:%M:%SZ)" '{generated:$generated, detail:.}' "$TMP" > "$OUT"
echo "Wrote $OUT ($(jq '.detail|length' "$OUT") workflows enriched)" >&2
