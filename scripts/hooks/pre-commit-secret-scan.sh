#!/usr/bin/env bash
# Pre-commit hook: block commits containing common secret patterns.
# Install: ln -sf ../../scripts/hooks/pre-commit-secret-scan.sh .git/hooks/pre-commit
# Or set: git config core.hooksPath scripts/hooks

set -euo pipefail

STAGED=$(git diff --cached --name-only --diff-filter=ACM)
if [ -z "$STAGED" ]; then
  exit 0
fi

FINDINGS=""
check() {
  local pattern="$1"
  local label="$2"
  while IFS= read -r file; do
    [ -z "$file" ] && continue
    # Skip binary, examples, templates, hooks themselves
    case "$file" in
      *.env.example|*.env.template|*/hooks/*) continue ;;
    esac
    if ! [ -f "$file" ]; then continue; fi
    # Binary check: skip
    if file "$file" 2>/dev/null | grep -q 'binary\|image\|pdf\|archive\|executable'; then
      continue
    fi
    if matches=$(grep -nE "$pattern" "$file" 2>/dev/null); then
      FINDINGS="${FINDINGS}
${label} in $file:
$matches"
    fi
  done <<< "$STAGED"
}

check 'ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{82}' 'GitHub PAT'
check 'xoxb-[0-9]{10,}-[0-9]{10,}-[A-Za-z0-9]{24,}' 'Slack bot token'
check 'xoxp-[0-9]{10,}-[0-9]{10,}-[A-Za-z0-9]{10,}' 'Slack user token'
check 'pat[A-Za-z0-9]{14}\.[a-f0-9]{64}' 'Airtable PAT'
check 'AIza[A-Za-z0-9_\-]{35}' 'Google/Gemini API key'
check 'sk-ant-[A-Za-z0-9_\-]{20,}' 'Anthropic API key'
check '\bsk-[A-Za-z0-9]{20,}' 'OpenAI API key'
check '\bsk_[a-f0-9]{48,}' 'ElevenLabs API key'
check '(sk|pk)_live_[A-Za-z0-9]{20,}' 'Stripe LIVE key'
check 'serpapi.com/search.*api_key=[a-f0-9]{32,}' 'SerpApi key (URL)'

# SerpApi keys in isolation (64 hex) — only flag if context mentions serpapi
for file in $STAGED; do
  [ -f "$file" ] || continue
  if file "$file" 2>/dev/null | grep -q 'binary\|image\|pdf\|archive\|executable'; then continue; fi
  if grep -qi 'serpapi' "$file" 2>/dev/null && grep -qE '\b[a-f0-9]{64}\b' "$file" 2>/dev/null; then
    FINDINGS="${FINDINGS}
SerpApi-context 64-hex token in $file"
  fi
done

if [ -n "$FINDINGS" ]; then
  echo "==============================================================" >&2
  echo " SECRET DETECTED IN STAGED CHANGES — commit BLOCKED" >&2
  echo "==============================================================" >&2
  echo "$FINDINGS" >&2
  echo "" >&2
  echo "Fix: move the secret to ~/.claude/.mcp.json or a .gitignored .env" >&2
  echo "     and read via env var. Then re-stage." >&2
  echo "" >&2
  echo "Override (emergency, not recommended):  git commit --no-verify" >&2
  exit 1
fi

exit 0
