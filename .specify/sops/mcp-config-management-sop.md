# SOP: MCP Configuration Management

**Owner**: All Agents (MCP Users)
**Version**: 1.0
**Created**: 2026-02-05
**Last Updated**: 2026-02-05

---

## Purpose
Prevent MCP configuration drift that causes "unauthorized" or connection errors.

---

## The Problem

MCP configurations exist in **THREE locations** that must stay synchronized:

| Location | Purpose | Who Uses It |
|----------|---------|-------------|
| `~/.mcp.json` | User's master config | User updates here |
| `~/.claude/.mcp.json` | Claude Code active config | Claude Code reads this |
| `.claude/skills/mcp-client/references/mcp-config.json` | Skill reference | MCP client skill |

**If these diverge, API calls fail with "unauthorized" even though keys look correct.**

---

## When Updating API Keys

### Step 1: Update User Master
Edit `~/.mcp.json` with new credentials

### Step 2: Sync to Claude Code Config
```bash
cp ~/.mcp.json ~/.claude/.mcp.json
```

### Step 3: Sync to Skill Config
```bash
cp ~/.mcp.json /path/to/project/.claude/skills/mcp-client/references/mcp-config.json
```

### Step 4: Verify All Match
```bash
# Check n8n key endings (should all match)
for f in ~/.mcp.json ~/.claude/.mcp.json .claude/skills/mcp-client/references/mcp-config.json; do
  echo "=== $f ==="
  cat "$f" 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('mcpServers',{}).get('n8n',{}).get('env',{}).get('N8N_API_KEY','N/A')[-10:])"
done
```

---

## Troubleshooting "Unauthorized" Errors

### 1. Check Which Config Is Active
```bash
# Claude Code uses this one:
cat ~/.claude/.mcp.json | python3 -c "import sys,json; print(json.load(sys.stdin)['mcpServers']['n8n']['env']['N8N_API_KEY'][-10:])"
```

### 2. Compare to User Master
```bash
cat ~/.mcp.json | python3 -c "import sys,json; print(json.load(sys.stdin)['mcpServers']['n8n']['env']['N8N_API_KEY'][-10:])"
```

### 3. If They Differ
The user updated `~/.mcp.json` but Claude Code is reading `~/.claude/.mcp.json`. Sync them.

### 4. Verify Key in Service
For n8n, check Settings → API and compare key endings to what's in config.

---

## Current Valid Keys (Reference)

| Service | Key Identifier | Ends With |
|---------|----------------|-----------|
| n8n | tinLLC | `E1SQ` |
| Airtable | - | `81d3` |
| Notion | - | `d6Kf` |

---

## Add to Shared Learnings

If you discover MCP config issues, add to `.specify/memory/learnings/shared-learnings.md`:

```markdown
## Integration Gotchas
- **MCP Config Sync - THREE locations**: `~/.mcp.json` (user's master),
  `~/.claude/.mcp.json` (Claude Code active), and
  `.claude/skills/mcp-client/references/mcp-config.json` (skill).
  When updating keys, update ALL THREE!
```

---

## Automation Opportunity

Consider creating an n8n workflow or script that:
1. Detects config drift
2. Alerts when keys are about to expire
3. Auto-syncs configs (with approval)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-05 | Initial SOP after discovering 3-config desync issue |
