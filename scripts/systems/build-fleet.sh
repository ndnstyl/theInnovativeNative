#!/usr/bin/env bash
# build-fleet.sh — Snapshot the entire n8n fleet into a machine-readable registry.
#
# Pulls every workflow from the live n8n REST API (paginated), classifies each into
# a System-Pack domain by name heuristic, derives a lifecycle status, and writes
# .claude/systems/n8n-fleet.json — the recall layer /goal reads to resolve workflow IDs.
#
# Canonical source of truth for workflow id->name->status->domain. Re-run after fleet
# changes (or on the weekly com.tin.systemsync cron). Idempotent.
#
# Reads creds from ~/.claude/.mcp.json (n8n MCP server env). No secrets printed.
set -euo pipefail

MCP_JSON="${HOME}/.claude/.mcp.json"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
OUT="${REPO_ROOT}/.claude/systems/n8n-fleet.json"

command -v jq >/dev/null || { echo "FATAL: jq required" >&2; exit 1; }
[ -f "$MCP_JSON" ] || { echo "FATAL: $MCP_JSON not found" >&2; exit 1; }

API_URL="$(jq -r '.mcpServers.n8n.env.N8N_API_URL' "$MCP_JSON" | sed 's:/*$::')"
API_KEY="$(jq -r '.mcpServers.n8n.env.N8N_API_KEY' "$MCP_JSON")"
[ -n "$API_URL" ] && [ "$API_URL" != "null" ] || { echo "FATAL: N8N_API_URL missing" >&2; exit 1; }
[ -n "$API_KEY" ] && [ "$API_KEY" != "null" ] || { echo "FATAL: N8N_API_KEY missing" >&2; exit 1; }

echo "Pulling fleet from ${API_URL} ..." >&2

TMP="$(mktemp)"; trap 'rm -f "$TMP" "$TMP".page' EXIT
echo '[]' > "$TMP"
cursor=""
page=0
while :; do
  page=$((page+1))
  url="${API_URL}/api/v1/workflows?limit=100&excludePinnedData=true"
  [ -n "$cursor" ] && url="${url}&cursor=${cursor}"
  curl -fsS -m 60 -H "X-N8N-API-KEY: ${API_KEY}" -H "Accept: application/json" "$url" > "$TMP".page \
    || { echo "FATAL: API call failed on page $page" >&2; exit 1; }
  n=$(jq '.data | length' "$TMP".page)
  echo "  page $page: $n workflows" >&2
  jq -s '.[0] + (.[1].data // [])' "$TMP" "$TMP".page > "$TMP".merged && mv "$TMP".merged "$TMP"
  cursor="$(jq -r '.nextCursor // empty' "$TMP".page)"
  [ -n "$cursor" ] || break
done

TOTAL=$(jq 'length' "$TMP")
echo "Fetched $TOTAL workflows. Classifying ..." >&2

# Transform: classify domain + status. `domain` is a best-effort heuristic for recall;
# the authoritative per-domain list lives in each <domain>.yaml manifest.
jq --arg generated "$(date -u +%Y-%m-%dT%H:%M:%SZ)" '
  def domain($name):
    ($name | ascii_downcase) as $l |
    if   ($l|test("bowtie|ootd|\\bugc\\b|faceless|\\breel|shorts|thumbnail|b-roll|scene |scene$|ffmpeg|\\bvideo|substack|newsletter|\\bblog|\\bseo\\b|repurpos|content engine|content auto|content spotlight|ig publisher|ig media|ig insights|linkedin post publisher|linkedin & instagram|instagram automation|comment responder|engagement post|instagram reels|funnel posts|\\bvo generator|podcast|quotes over|prompt generator|script generator"))
         then "content-creation"
    elif ($l|test("cerebro|outreach|\\blead\\b|lead scor|lead sourc|lead captur|\\bsdr\\b|cold email|phantombuster|enrich|\\bppc\\b|hubspot|\\bdrip\\b|funnel|warmth|ads agency|nano ads|google scraper|maps business|directory|uk local|govcon|hyper-personalized|lawyer|negotiation"))
         then "growth-marketing"
    elif ($l|test("stripe|payment|billing|subscription|invoice|close crm|\\bkeap\\b|brevo|cash flow|\\bdea -|\\bdea-|airtable to|to supabase sync|to airtable sync|to google drive"))
         then "revenue-operations"
    elif ($l|test("research|\\btrend|competitor|sam.gov|digest|\\brag\\b|viral scraper|market research|socialscraper|deep research"))
         then "market-research"
    elif ($l|test("nano|\\bimage|photoshop|glaze|combine image|edit image|create image"))
         then "visual-design"
    elif ($l|test("trading|warrior|alpaca|kill switch"))
         then "trading"
    elif ($l|test("fleet|health check|heartbeat|verify pipeline|\\brize\\b|inbox|\\bob1\\b|\\bkie\\b|router|error handler|system check|geocod|backfill|dedupe|classroom|job hunter|land monitor"))
         then "ops"
    else "uncategorized" end;
  def status:
    (.name | ascii_downcase) as $l |
    if (.isArchived == true) then "archived"
    elif ($l|test("\\[superseded\\]|deprecated|\\(obsolete\\)")) then "superseded"
    elif ($l|test("\\[archive\\]")) then "archived"
    elif ($l|test("\\[paused")) then "paused"
    elif (.active == true) then "active"
    else "inactive" end;
  map({
    id, name,
    active: (.active // false),
    archived: (.isArchived // false),
    status: status,
    domain: domain(.name),
    tags: [(.tags // [])[].name],
    updatedAt: .updatedAt
  }) as $wf
  | {
      generated: $generated,
      source: "n8n REST /api/v1/workflows",
      count: ($wf|length),
      active_count: ([$wf[]|select(.status=="active")]|length),
      by_domain: ($wf | group_by(.domain) | map({(.[0].domain): length}) | add),
      workflows: ($wf | sort_by(.domain, (.active|not), .name))
    }
' "$TMP" > "$OUT"

echo "Wrote $OUT" >&2
jq -r '"  total=\(.count) active=\(.active_count)\n  by_domain: \(.by_domain)"' "$OUT" >&2
