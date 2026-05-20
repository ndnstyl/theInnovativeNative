#!/usr/bin/env python3
"""Validate and deploy THT n8n workflows."""

import json
import re
import ssl
import sys
import urllib.request
import urllib.error

N8N_BASE = "https://n8n.srv948776.hstgr.cloud"
API_KEY = "***REDACTED***"

WORKFLOWS = [
    {
        "name": "WF-THT-PROMPT",
        "file": "/Users/makwa/theinnovativenative/scripts/n8n-workflows/tht-prompt-generator.json",
        "id": "WvF8lWezmwO7yODa",
    },
    {
        "name": "WF-THT-IMAGE",
        "file": "/Users/makwa/theinnovativenative/scripts/n8n-workflows/tht-image-generator.json",
        "id": "wjF3eJbpbfYXZZbT",
    },
    {
        "name": "WF-THT-VIDEO",
        "file": "/Users/makwa/theinnovativenative/scripts/n8n-workflows/tht-video-generator.json",
        "id": "BefCfx7WAzEfXT2v",
    },
    {
        "name": "WF-THT-REEL",
        "file": "/Users/makwa/theinnovativenative/scripts/n8n-workflows/tht-reel-assembler.json",
        "id": "5yEPYq626Kv6lDt6",
    },
]

READ_ONLY_FIELDS = {"id", "tags", "versionId", "meta", "createdAt", "updatedAt"}

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE


def check_filter_formulas(obj, node_name, issues):
    """Recursively look for filterByFormula fields with bad leading =."""
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k == "filterByFormula" and isinstance(v, str):
                is_dynamic = "{{" in v and "}}" in v
                if v.startswith("=") and not is_dynamic:
                    issues.append(
                        f"Node '{node_name}': static filterByFormula starts with '=': {v[:80]}"
                    )
            else:
                check_filter_formulas(v, node_name, issues)
    elif isinstance(obj, list):
        for item in obj:
            check_filter_formulas(item, node_name, issues)


def validate(wf):
    """Validate a single workflow JSON. Returns (data_dict, issues_list)."""
    issues = []
    path = wf["file"]

    try:
        with open(path, "r") as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        return None, [f"INVALID JSON: {e}"]
    except FileNotFoundError:
        return None, [f"FILE NOT FOUND: {path}"]

    nodes = data.get("nodes", [])
    node_count = len(nodes)

    raw = json.dumps(data)
    matches = re.findall(r"REPLACE_WITH\w*", raw)
    if matches:
        issues.append(f"Found {len(matches)} REPLACE_WITH placeholder(s): {sorted(set(matches))}")

    for node in nodes:
        params = node.get("parameters", {})
        check_filter_formulas(params, node.get("name", "?"), issues)

    return data, issues


def deploy(wf, data):
    """PUT workflow to n8n. Returns (success_bool, message)."""
    payload = {k: v for k, v in data.items() if k not in READ_ONLY_FIELDS}
    body = json.dumps(payload).encode("utf-8")
    url = f"{N8N_BASE}/api/v1/workflows/{wf['id']}"

    req = urllib.request.Request(url, data=body, method="PUT")
    req.add_header("Content-Type", "application/json")
    req.add_header("X-N8N-API-KEY", API_KEY)

    try:
        resp = urllib.request.urlopen(req, context=ctx, timeout=30)
        resp_data = json.loads(resp.read().decode())
        return True, f"Updated (version: {resp_data.get('versionId', 'n/a')})"
    except urllib.error.HTTPError as e:
        err_body = e.read().decode() if e.fp else ""
        return False, f"HTTP {e.code}: {err_body[:300]}"
    except Exception as e:
        return False, f"Error: {e}"


def main():
    print("=" * 60)
    print("STEP 1: VALIDATION")
    print("=" * 60)

    all_valid = True
    parsed = {}
    validation_issues = {}

    for wf in WORKFLOWS:
        name = wf["name"]
        data, issues = validate(wf)
        validation_issues[name] = issues
        status = "PASS" if (data is not None and not issues) else "FAIL"
        if status == "FAIL":
            all_valid = False
        node_count = len(data.get("nodes", [])) if data else 0
        print(f"  [{name}] {status} | {node_count} nodes | {len(issues)} issue(s)")
        for iss in issues:
            print(f"    ISSUE: {iss}")
        if data is not None:
            parsed[name] = data

    print()
    if all_valid:
        print("VALIDATION: ALL PASS")
    else:
        print("VALIDATION: ISSUES FOUND (see above)")
    print()

    print("=" * 60)
    print("STEP 2: DEPLOYMENT (PUT to n8n)")
    print("=" * 60)

    deploy_results = {}
    for wf in WORKFLOWS:
        name = wf["name"]
        if name not in parsed:
            print(f"  [{name}] SKIP - could not parse JSON")
            deploy_results[name] = False
            continue
        ok, msg = deploy(wf, parsed[name])
        tag = "PASS" if ok else "FAIL"
        print(f"  [{name}] {tag} - {msg}")
        deploy_results[name] = ok

    print()
    print("=" * 60)
    print("FINAL REPORT")
    print("=" * 60)

    all_ok = True
    for wf in WORKFLOWS:
        name = wf["name"]
        v_ok = name in parsed and not validation_issues.get(name, [True])
        d_ok = deploy_results.get(name, False)
        v_tag = "PASS" if (name in parsed and not validation_issues[name]) else "FAIL"
        d_tag = "PASS" if d_ok else "FAIL"
        print(f"  {name:<20s}  validate={v_tag}  deploy={d_tag}  id={wf['id']}")
        if v_tag == "FAIL" or d_tag == "FAIL":
            all_ok = False

    print()
    if all_ok:
        print("ALL WORKFLOWS VALIDATED AND DEPLOYED SUCCESSFULLY.")
    else:
        print("SOME WORKFLOWS HAD ISSUES - review output above.")

    return 0 if all_ok else 1


if __name__ == "__main__":
    sys.exit(main())
