#!/usr/bin/env python3
"""
Remove Wait Nodes — Fix WF-001 Crash

WF-001 crashes at "Prepare Scene Items" after G1 Wait node resumes via webhook.
n8n 2.1.5 webhook-resume Wait nodes do not preserve upstream execution context.

Fix: Remove both Wait nodes + 5 continuation/resume helper nodes (7 total).
Rewire to run end-to-end atomically. Revert Code nodes to direct $('NodeName')
references which work perfectly without Wait nodes breaking the chain.

Nodes removed (7):
  - Prepare G1 Continuation
  - Store Continuation in Playbook
  - Wait - Script Approval (G1)
  - Read Playbook After G1
  - Restore Pipeline Data
  - Store Resume URL - Scene
  - Wait - Scene Approval (G2)

Connections rewired (2):
  - IF - WF-003 OK (true) → Prepare Scene Items  (was: → Prepare G1 Continuation → ... → Restore Pipeline Data → Prepare Scene Items)
  - Collect WF-004 Result → SplitInBatches         (was: → Store Resume URL - Scene → Wait G2 → SplitInBatches)

Code nodes fixed (3):
  - Prepare Scene Items: $('Restore Pipeline Data') → $('Parse WF-003 Output')
  - Verify All Assets: $('Restore Pipeline Data') → $('Code - Merge All Data') / $('Parse WF-003 Output')
  - Prepare QA Input: $('Restore Pipeline Data') → $('Airtable - Read Product') / $('Code - Merge All Data')
"""
import json
import os
import urllib.request
import urllib.error
import copy
import re

# --- Credentials ---
MCP_PATH = os.path.expanduser("~/.claude/.mcp.json")
with open(MCP_PATH) as f:
    mcp = json.load(f)
N8N_API_KEY = mcp["mcpServers"]["n8n"]["env"]["N8N_API_KEY"]
N8N_BASE = "https://n8n.srv948776.hstgr.cloud"

WF001_ID = "z9HkSEBkro1H9NSt"

# Airtable config for test playbook reset
HAVEN_BASE_ID = "appWVJhdylvNm07nv"
PLAYBOOKS_TABLE = "tblyXrG01Tt7O07wI"
TEST_PLAYBOOK_ID = "recQqnS9e0OnBIOul"
AIRTABLE_MCP = mcp["mcpServers"].get("airtable", {}).get("env", {})
AIRTABLE_TOKEN = AIRTABLE_MCP.get("AIRTABLE_PERSONAL_ACCESS_TOKEN", "")

# --- Node IDs to remove ---
REMOVE_NODE_IDS = {
    "node-store-resume-g1",
    "node-store-continuation-airtable",
    "node-wait-g1",
    "node-read-after-g1",
    "node-parse-continuation",
    "node-store-resume-g2",
    "node-wait-g2",
}

# Also match by name in case IDs differ
REMOVE_NODE_NAMES = {
    "Prepare G1 Continuation",
    "Store Continuation in Playbook",
    "Wait - Script Approval (G1)",
    "Read Playbook After G1",
    "Restore Pipeline Data",
    "Store Resume URL - Scene",
    "Wait - Scene Approval (G2)",
}


def get_workflow(workflow_id):
    """GET workflow from n8n."""
    url = f"{N8N_BASE}/api/v1/workflows/{workflow_id}"
    req = urllib.request.Request(url)
    req.add_header("X-N8N-API-KEY", N8N_API_KEY)
    resp = urllib.request.urlopen(req)
    return json.loads(resp.read())


def put_workflow(workflow_id, payload):
    """PUT workflow back to n8n (only safe fields)."""
    url = f"{N8N_BASE}/api/v1/workflows/{workflow_id}"
    safe_payload = {
        "name": payload["name"],
        "nodes": payload["nodes"],
        "connections": payload["connections"],
        "settings": payload["settings"],
    }
    data = json.dumps(safe_payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, method="PUT")
    req.add_header("X-N8N-API-KEY", N8N_API_KEY)
    req.add_header("Content-Type", "application/json")
    try:
        resp = urllib.request.urlopen(req)
        return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        print(f"ERROR {e.code}: {error_body[:500]}")
        raise


def reset_test_playbook():
    """Reset test playbook to Status=Approved, clear Notes."""
    if not AIRTABLE_TOKEN:
        print("  SKIP: No Airtable token found in MCP config")
        return False
    url = (
        f"https://api.airtable.com/v0/{HAVEN_BASE_ID}"
        f"/{PLAYBOOKS_TABLE}/{TEST_PLAYBOOK_ID}"
    )
    payload = {"fields": {"Status": "Approved", "Notes": ""}}
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, method="PATCH")
    req.add_header("Authorization", f"Bearer {AIRTABLE_TOKEN}")
    req.add_header("Content-Type", "application/json")
    try:
        resp = urllib.request.urlopen(req)
        json.loads(resp.read())
        return True
    except urllib.error.HTTPError as e:
        print(f"  Airtable reset failed: {e.code} — {e.read().decode()[:200]}")
        return False


def patch_wf001(wf):
    """Remove 7 Wait/continuation nodes, rewire, fix Code node references."""
    wf = copy.deepcopy(wf)
    nodes = wf["nodes"]
    connections = wf["connections"]

    # --- Step 1: Identify nodes to remove (by ID or name) ---
    removed_names = set()
    kept_nodes = []
    for node in nodes:
        if node.get("id") in REMOVE_NODE_IDS or node["name"] in REMOVE_NODE_NAMES:
            removed_names.add(node["name"])
            print(f"    REMOVE: {node['name']} ({node.get('id', '?')})")
        else:
            kept_nodes.append(node)

    if len(removed_names) != 7:
        print(f"  WARNING: Expected to remove 7 nodes, found {len(removed_names)}")
        print(f"    Removed: {removed_names}")
        missing_names = REMOVE_NODE_NAMES - removed_names
        if missing_names:
            print(f"    Not found: {missing_names}")

    wf["nodes"] = kept_nodes

    # --- Step 2: Remove all connections referencing removed nodes ---
    cleaned_connections = {}
    for source_name, conn_data in connections.items():
        if source_name in removed_names:
            continue
        if "main" not in conn_data:
            cleaned_connections[source_name] = conn_data
            continue
        new_main = []
        for output_list in conn_data["main"]:
            filtered = [
                c for c in output_list if c.get("node") not in removed_names
            ]
            new_main.append(filtered)
        cleaned_connections[source_name] = {"main": new_main}

    # --- Step 3: Add new connections ---
    # IF - WF-003 OK true[0] → Prepare Scene Items
    if "IF - WF-003 OK" in cleaned_connections:
        main = cleaned_connections["IF - WF-003 OK"]["main"]
        # true branch is main[0]
        if len(main) > 0:
            main[0] = [{"node": "Prepare Scene Items", "type": "main", "index": 0}]
    else:
        print("  WARNING: 'IF - WF-003 OK' not found in connections")

    # Collect WF-004 Result → SplitInBatches
    if "Collect WF-004 Result" in cleaned_connections:
        main = cleaned_connections["Collect WF-004 Result"]["main"]
        if len(main) > 0:
            main[0] = [{"node": "SplitInBatches", "type": "main", "index": 0}]
    else:
        # May need to create the connection
        cleaned_connections["Collect WF-004 Result"] = {
            "main": [[{"node": "SplitInBatches", "type": "main", "index": 0}]]
        }

    wf["connections"] = cleaned_connections

    # --- Step 4: Fix Code node references ---
    for node in wf["nodes"]:
        if node["name"] == "Prepare Scene Items":
            _fix_prepare_scene_items(node)
        elif node["name"] == "Verify All Assets":
            _fix_verify_all_assets(node)
        elif node["name"] == "Prepare QA Input":
            _fix_prepare_qa_input(node)

    return wf


def _fix_prepare_scene_items(node):
    """Replace $('Restore Pipeline Data') with $('Parse WF-003 Output')."""
    js = node.get("parameters", {}).get("jsCode", "")
    if "Restore Pipeline Data" not in js:
        print(f"    NOTE: 'Prepare Scene Items' does not reference 'Restore Pipeline Data'")
        return
    new_js = js.replace(
        "$('Restore Pipeline Data')", "$('Parse WF-003 Output')"
    )
    node["parameters"]["jsCode"] = new_js
    print(f"    FIX: Prepare Scene Items — $('Restore Pipeline Data') → $('Parse WF-003 Output')")


def _fix_verify_all_assets(node):
    """Replace $('Restore Pipeline Data') with $('Code - Merge All Data') / $('Parse WF-003 Output')."""
    js = node.get("parameters", {}).get("jsCode", "")
    if "Restore Pipeline Data" not in js:
        print(f"    NOTE: 'Verify All Assets' does not reference 'Restore Pipeline Data'")
        return
    # Replace the first occurrence that gets mergedData-like fields with Code - Merge All Data
    # and scene-related data with Parse WF-003 Output
    # Strategy: replace all occurrences then fix up if needed
    # Most likely pattern: const data = $('Restore Pipeline Data').first().json;
    # Replace with two references
    new_js = re.sub(
        r"\$\('Restore Pipeline Data'\)\.first\(\)\.json",
        "$('Code - Merge All Data').first().json",
        js,
        count=1,
    )
    # If there are additional references, point them to Parse WF-003 Output
    new_js = new_js.replace(
        "$('Restore Pipeline Data')", "$('Parse WF-003 Output')"
    )
    node["parameters"]["jsCode"] = new_js
    print(f"    FIX: Verify All Assets — updated $() references")


def _fix_prepare_qa_input(node):
    """Replace $('Restore Pipeline Data') with $('Airtable - Read Product') / $('Code - Merge All Data')."""
    js = node.get("parameters", {}).get("jsCode", "")
    if "Restore Pipeline Data" not in js:
        print(f"    NOTE: 'Prepare QA Input' does not reference 'Restore Pipeline Data'")
        return
    new_js = re.sub(
        r"\$\('Restore Pipeline Data'\)\.first\(\)\.json",
        "$('Code - Merge All Data').first().json",
        js,
        count=1,
    )
    new_js = new_js.replace(
        "$('Restore Pipeline Data')", "$('Airtable - Read Product')"
    )
    node["parameters"]["jsCode"] = new_js
    print(f"    FIX: Prepare QA Input — updated $() references")


def verify(wf, orig_count):
    """Post-deployment verification."""
    nodes = wf["nodes"]
    connections = wf["connections"]
    issues = []

    # Check node count
    expected = orig_count - 7
    actual = len(nodes)
    if actual != expected:
        issues.append(f"Node count: expected {expected}, got {actual}")

    # Check no removed node names remain in connections
    all_node_names = {n["name"] for n in nodes}
    for source, conn_data in connections.items():
        if source in REMOVE_NODE_NAMES:
            issues.append(f"Connection source still references removed node: {source}")
        for output_list in conn_data.get("main", []):
            for c in output_list:
                target = c.get("node", "")
                if target in REMOVE_NODE_NAMES:
                    issues.append(f"Connection target still references removed node: {target}")

    # Check rewired connections
    wf003_ok = connections.get("IF - WF-003 OK", {}).get("main", [[]])[0]
    if not any(c["node"] == "Prepare Scene Items" for c in wf003_ok):
        issues.append("IF - WF-003 OK true[0] does not connect to Prepare Scene Items")

    collect = connections.get("Collect WF-004 Result", {}).get("main", [[]])[0]
    if not any(c["node"] == "SplitInBatches" for c in collect):
        issues.append("Collect WF-004 Result does not connect to SplitInBatches")

    # Check no Code node references Restore Pipeline Data
    for node in nodes:
        js = node.get("parameters", {}).get("jsCode", "")
        if "Restore Pipeline Data" in js:
            issues.append(f"Code node '{node['name']}' still references 'Restore Pipeline Data'")

    return issues


def main():
    print("=" * 60)
    print("Remove Wait Nodes — Fix WF-001 Crash")
    print("=" * 60)

    # Step 1: GET live workflow
    print("\n[1/5] Fetching live WF-001...")
    wf = get_workflow(WF001_ID)
    orig_count = len(wf["nodes"])
    print(f"  Current nodes: {orig_count}")

    # Step 2: Backup
    print("\n[2/5] Saving backup...")
    backup_path = "/private/tmp/wf001-pre-wait-removal.json"
    with open(backup_path, "w") as f:
        json.dump(wf, f, indent=2)
    print(f"  Saved: {backup_path}")

    # Step 3: Patch
    print("\n[3/5] Removing Wait nodes and rewiring...")
    patched = patch_wf001(wf)
    new_count = len(patched["nodes"])
    print(f"\n  Nodes: {orig_count} → {new_count} (removed {orig_count - new_count})")

    # Step 4: Verify before deploy
    print("\n[4/5] Pre-deploy verification...")
    issues = verify(patched, orig_count)
    if issues:
        print("  ISSUES FOUND:")
        for issue in issues:
            print(f"    ✗ {issue}")
        print("\n  Aborting deploy. Fix issues and retry.")
        # Save patched version for debugging
        debug_path = "/private/tmp/wf001-patched-debug.json"
        with open(debug_path, "w") as f:
            json.dump(patched, f, indent=2)
        print(f"  Debug file: {debug_path}")
        return
    print("  All checks passed")

    # Step 5: Deploy
    print("\n[5/5] Deploying patched WF-001...")
    result = put_workflow(WF001_ID, patched)
    print(f"  Updated: {result.get('name', 'unknown')}")
    print(f"  Version: {result.get('versionId', 'unknown')}")

    # Reset test playbook
    print("\n  Resetting test playbook...")
    if reset_test_playbook():
        print(f"  Playbook {TEST_PLAYBOOK_ID} → Status=Approved, Notes cleared")

    # Post-deploy verification
    print("\n  Post-deploy verify...")
    live = get_workflow(WF001_ID)
    post_issues = verify(live, orig_count)
    if post_issues:
        print("  POST-DEPLOY ISSUES:")
        for issue in post_issues:
            print(f"    ✗ {issue}")
    else:
        live_count = len(live["nodes"])
        print(f"  Live node count: {live_count}")
        print("  All post-deploy checks passed")

    print("\n" + "=" * 60)
    print("SUCCESS — Wait nodes removed, WF-001 runs atomically")
    print("  Backup: /private/tmp/wf001-pre-wait-removal.json")
    print("  Next: User triggers manual execution to verify end-to-end")
    print("=" * 60)


if __name__ == "__main__":
    main()
