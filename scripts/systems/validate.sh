#!/usr/bin/env bash
# validate.sh — Integrity check for System Packs. Run after editing any manifest or adding a domain.
# Verifies: every n8n_workflows ID exists in the fleet (and flags non-active), every brand_rules +
# memory_anchors slug has a vault page, every skill resolves (recursive across skill roots + plugins),
# and agents are mechanical-only. Also prints a routing demo. Exit 1 on hard errors.
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PY="${REPO_ROOT}/venv/bin/python3"; [ -x "$PY" ] || PY="$(command -v python3)"

SYS="${REPO_ROOT}/.claude/systems" \
VAULT="${HOME}/.claude/projects/-Users-makwa-theinnovativenative/memory" \
SKILL_ROOTS="${REPO_ROOT}/.claude/skills:${HOME}/.claude/skills:${HOME}/.claude/plugins" \
"$PY" - <<'PY'
import os, json, yaml, re, glob
SYS=os.environ['SYS']; VAULT=os.environ['VAULT']
roots=[r for r in os.environ['SKILL_ROOTS'].split(':') if r]
fleet=json.load(open(f"{SYS}/n8n-fleet.json")); ids={w['id']:w for w in fleet['workflows']}
reg=yaml.safe_load(open(f"{SYS}/registry.yaml"))
MECH={'orchestrator','researcher','implementer','reviewer','deployer','logger','viz-designer'}
# index every skill dir (recursive) once
skill_dirs=set()
for root in roots:
    for p in glob.glob(f"{root}/**/", recursive=True):
        skill_dirs.add(os.path.basename(p.rstrip('/')))
def have_page(s): return os.path.exists(f"{VAULT}/{s}.md")
errors=0; warns=0
for key,meta in reg['domains'].items():
    mp=f"{SYS}/{meta['manifest']}"
    if not os.path.exists(mp):
        print(f"• {key}: STUB"); continue
    m=yaml.safe_load(open(mp)); print(f"\n=== {m['title']} ({key}) ===")
    miss=[w for w in m.get('n8n_workflows',[]) if w not in ids]
    nonact=[ids[w]['name'] for w in m.get('n8n_workflows',[]) if w in ids and ids[w]['status']!='active']
    print(f"  workflows {len(m.get('n8n_workflows',[]))} | missing {miss or '-'} | non-active {nonact or '-'}")
    errors+=len(miss)
    sk=(m.get('skills',{}).get('primary',[]) or [])+(m.get('skills',{}).get('support',[]) or [])
    badsk=[s for s in sk if s not in skill_dirs]
    if badsk: print(f"  skills missing-as-dir {badsk} (ok if plugin-invocable)"); warns+=len(badsk)
    else: print(f"  skills {len(sk)} | all resolve")
    pg=(m.get('brand_rules',[]) or [])+(m.get('memory_anchors',[]) or [])
    badp=[p for p in pg if not have_page(p)]
    print(f"  memory pages {len(pg)} | missing {badp or '-'}"); errors+=len(badp)
    bada=[a for a in m.get('agents',[]) if a not in MECH]
    if bada: print(f"  AGENTS non-mechanical {bada}"); errors+=len(bada)
print(f"\nResult: {errors} error(s), {warns} warning(s)")
raise SystemExit(1 if errors else 0)
PY
