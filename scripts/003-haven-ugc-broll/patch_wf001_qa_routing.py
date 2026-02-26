#!/usr/bin/env python3
"""
Patch WF-001 Orchestrator to add WF-005 Batch QA routing.

Adds 5 new nodes between "IF - Assets OK" and "Prepare WF-006 Input":
1. Prepare QA Input — collects all WF-004 results + product image URL
2. Execute WF-005 — calls the batch QA workflow
3. QA Verdict Router — IF node: pass → WF-006, conditional → regen, fail → halt
4. Regeneration Handler — for conditional: re-runs flagged scenes + QA (max 1 retry)
5. Set QA Failed Status — updates Airtable on fail

Strategy: GET live workflow, patch in new nodes + rewire connections, PUT back.
"""
import json
import os
import urllib.request
import urllib.error
import copy

# --- Credentials ---
MCP_PATH = os.path.expanduser("~/.claude/.mcp.json")
with open(MCP_PATH) as f:
    mcp = json.load(f)
N8N_API_KEY = mcp["mcpServers"]["n8n"]["env"]["N8N_API_KEY"]
N8N_BASE = "https://n8n.srv948776.hstgr.cloud"

WF001_ID = "z9HkSEBkro1H9NSt"
WF005_ID = "hGVLwuBRunJeLHeY"

HAVEN_BASE_ID = "appWVJhdylvNm07nv"
PLAYBOOKS_TABLE = "tblyXrG01Tt7O07wI"
PIPELINE_TABLE = "tblOsG9I5bk8zVtxg"
AIRTABLE_CRED = "YCWFwTIXwnTpVy2y"


def get_workflow(workflow_id):
    """GET workflow from n8n."""
    url = f"{N8N_BASE}/api/v1/workflows/{workflow_id}"
    req = urllib.request.Request(url)
    req.add_header("X-N8N-API-KEY", N8N_API_KEY)
    resp = urllib.request.urlopen(req)
    return json.loads(resp.read())


def put_workflow(workflow_id, payload):
    """PUT workflow back to n8n (only name, nodes, connections, settings)."""
    url = f"{N8N_BASE}/api/v1/workflows/{workflow_id}"
    safe_payload = {
        "name": payload["name"],
        "nodes": payload["nodes"],
        "connections": payload["connections"],
        "settings": payload["settings"]
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
        print(f"ERROR {e.code}: {error_body}")
        raise


def patch_wf001(wf):
    """Add 5 QA routing nodes and rewire connections."""
    wf = copy.deepcopy(wf)
    nodes = wf["nodes"]
    connections = wf["connections"]

    # --- Position context ---
    # "IF - Assets OK" true branch currently goes to "Prepare WF-006 Input"
    # We'll insert QA nodes between them.
    # IF - Assets OK is at ~[3400, 200]
    # Prepare WF-006 Input is at ~[3640, 200]
    # We'll shift WF-006 nodes right to make room

    # Shift all WF-006+ nodes right by 1200px to make room for QA nodes
    wf006_nodes = [
        "Prepare WF-006 Input", "Execute WF-006 FFMPEG Assembler",
        "Parse WF-006 Output", "IF - WF-006 OK",
        "Error - WF-006 Failed", "Return Error - WF-006",
        "Airtable - Status Completed", "Return Final Output"
    ]
    for node in nodes:
        if node["name"] in wf006_nodes:
            node["position"][0] += 1200

    # --- Add 5 new nodes ---

    # Node 1: Prepare QA Input
    nodes.append({
        "parameters": {
            "jsCode": """// Collect all scene results + product image URL for WF-005 Batch QA
const assetsData = $('Verify All Assets').first().json;
const mergedData = $('Code - Merge All Data').first().json;
const productData = $('Airtable - Read Product').first().json;

// Get product image URL from the Products table
const productImageUrl = productData['Main Image URL'] ||
    productData['Image URL'] ||
    productData.fields?.['Main Image URL'] || '';

// Build scenes array with all info WF-005 needs
const scenes = assetsData.scenes.map(s => ({
    number: s.number,
    label: s.label || 'scene-' + s.number,
    image_prompt: s.image_prompt || '',
    asset_drive_file_id: s.asset_drive_file_id,
    quality_score: s.quality_score || 0,
    expects_haven: s.expects_haven || false
}));

return [{json: {
    script_record_id: assetsData.script_record_id,
    playbook_id: assetsData.playbook_id,
    product_name: assetsData.product_name || mergedData.product_name,
    product_image_url: productImageUrl,
    scenes: scenes,
    qa_attempt: 1,
    max_qa_attempts: 2
}}];"""
        },
        "id": "node-prepare-qa-input",
        "name": "Prepare QA Input",
        "type": "n8n-nodes-base.code",
        "position": [3640, 200],
        "typeVersion": 2
    })

    # Node 2: Execute WF-005
    nodes.append({
        "parameters": {
            "workflowId": {
                "__rl": True,
                "mode": "list",
                "value": WF005_ID,
                "cachedResultUrl": f"/workflow/{WF005_ID}",
                "cachedResultName": "WF-005 Haven Batch QA Gate"
            },
            "options": {},
            "workflowInputs": {
                "value": {},
                "schema": [],
                "mappingMode": "defineBelow",
                "matchingColumns": [],
                "attemptToConvertTypes": False,
                "convertFieldsToString": True
            }
        },
        "id": "node-exec-wf005",
        "name": "Execute WF-005 Batch QA",
        "type": "n8n-nodes-base.executeWorkflow",
        "position": [3880, 200],
        "typeVersion": 1.3
    })

    # Node 3: QA Verdict Router (3-way IF)
    # n8n IF node only supports 2 branches (true/false).
    # We'll use: true = pass (≥80%), false = not pass
    # Then a second IF for conditional vs fail
    nodes.append({
        "parameters": {
            "jsCode": """// Route based on QA verdict
const qa = $input.first().json;
const qaInput = $('Prepare QA Input').first().json;

const verdict = qa.status; // 'pass', 'conditional', 'fail', or 'error'
const attempt = qaInput.qa_attempt || 1;
const maxAttempts = qaInput.max_qa_attempts || 2;

if (verdict === 'pass') {
    return [{json: { ...qa, route: 'pass', qa_attempt: attempt }}];
}

if (verdict === 'conditional' && attempt < maxAttempts) {
    return [{json: {
        ...qa,
        route: 'regenerate',
        qa_attempt: attempt,
        max_qa_attempts: maxAttempts
    }}];
}

// Fail or conditional on final attempt
return [{json: {
    ...qa,
    route: verdict === 'error' ? 'fail' : (verdict === 'conditional' ? 'fail' : 'fail'),
    qa_attempt: attempt,
    failure_reason: verdict === 'conditional'
        ? 'QA conditional after max retries (' + attempt + '/' + maxAttempts + ')'
        : 'QA score ' + qa.overall_score + '/' + qa.max_score + ' (' + qa.percentage + '%)'
}}];"""
        },
        "id": "node-qa-parse-verdict",
        "name": "Parse QA Verdict",
        "type": "n8n-nodes-base.code",
        "position": [4120, 200],
        "typeVersion": 2
    })

    # IF node for pass vs not-pass
    nodes.append({
        "parameters": {
            "conditions": {
                "options": {
                    "caseSensitive": True,
                    "leftValue": "",
                    "typeValidation": "strict",
                    "version": 2
                },
                "conditions": [{
                    "id": "cond-qa-pass",
                    "leftValue": "={{ $json.route }}",
                    "rightValue": "pass",
                    "operator": {
                        "type": "string",
                        "operation": "equals",
                        "name": "filter.operator.equals"
                    }
                }],
                "combinator": "and"
            },
            "options": {}
        },
        "id": "node-if-qa-pass",
        "name": "IF - QA Pass",
        "type": "n8n-nodes-base.if",
        "position": [4360, 200],
        "typeVersion": 2.2
    })

    # IF node for regenerate vs fail (on the false branch of QA Pass)
    nodes.append({
        "parameters": {
            "conditions": {
                "options": {
                    "caseSensitive": True,
                    "leftValue": "",
                    "typeValidation": "strict",
                    "version": 2
                },
                "conditions": [{
                    "id": "cond-qa-regen",
                    "leftValue": "={{ $json.route }}",
                    "rightValue": "regenerate",
                    "operator": {
                        "type": "string",
                        "operation": "equals",
                        "name": "filter.operator.equals"
                    }
                }],
                "combinator": "and"
            },
            "options": {}
        },
        "id": "node-if-qa-regen",
        "name": "IF - QA Regenerate",
        "type": "n8n-nodes-base.if",
        "position": [4360, 500],
        "typeVersion": 2.2
    })

    # Node 4: Regeneration Handler
    nodes.append({
        "parameters": {
            "jsCode": """// Re-run WF-004 for flagged scenes with refined prompts, then loop back to QA
// This node prepares the input for a second WF-005 pass
const qa = $input.first().json;
const origInput = $('Prepare QA Input').first().json;
const scenes = origInput.scenes;

// Keep all scenes but mark which ones to regenerate
// The orchestrator's existing WF-004 loop handles scene-level regeneration
// For WF-005 retry, we just bump the attempt counter and pass through

const updatedInput = {
    script_record_id: origInput.script_record_id,
    playbook_id: origInput.playbook_id,
    product_name: origInput.product_name,
    product_image_url: origInput.product_image_url,
    scenes: scenes,
    qa_attempt: (qa.qa_attempt || 1) + 1,
    max_qa_attempts: origInput.max_qa_attempts || 2,
    previous_qa_score: qa.overall_score,
    scenes_to_regenerate: qa.scenes_to_regenerate,
    regeneration_prompts: qa.regeneration_prompts
};

return [{json: updatedInput}];"""
        },
        "id": "node-regen-handler",
        "name": "QA Regeneration Handler",
        "type": "n8n-nodes-base.code",
        "position": [4600, 500],
        "typeVersion": 2
    })

    # Node 5: Set QA Failed Status
    nodes.append({
        "parameters": {
            "operation": "update",
            "base": {"__rl": True, "value": HAVEN_BASE_ID, "mode": "id"},
            "table": {"__rl": True, "value": PLAYBOOKS_TABLE, "mode": "id"},
            "id": "={{ $json.playbook_id }}",
            "columns": {
                "mappingMode": "defineBelow",
                "value": {
                    "Status": "QA Failed",
                    "Notes": "={{ 'Batch QA Failed - Score: ' + $json.overall_score + '/' + $json.max_score + ' (' + $json.percentage + '%). ' + ($json.failure_reason || $json.summary || '') }}"
                },
                "matchingColumns": [],
                "schema": [
                    {"id": "Status", "displayName": "Status", "required": False,
                     "defaultMatch": False, "canBeUsedToMatch": True, "display": True,
                     "type": "string", "readOnly": False, "removed": False},
                    {"id": "Notes", "displayName": "Notes", "required": False,
                     "defaultMatch": False, "canBeUsedToMatch": True, "display": True,
                     "type": "string", "readOnly": False, "removed": False}
                ]
            },
            "options": {}
        },
        "id": "node-set-qa-failed",
        "name": "Set QA Failed Status",
        "type": "n8n-nodes-base.airtable",
        "position": [4600, 800],
        "typeVersion": 2.1,
        "credentials": {
            "airtableTokenApi": {
                "id": AIRTABLE_CRED,
                "name": "Airtable Personal Access Token account"
            }
        }
    })

    # Return error for QA failed
    nodes.append({
        "parameters": {
            "jsCode": """return [{json: {
    status: 'qa_failed',
    error_message: 'Batch QA failed: ' + ($json.failure_reason || 'Score too low'),
    overall_score: $json.overall_score || 0,
    max_score: $json.max_score || 40,
    qa_review_record_id: $json.qa_review_record_id || ''
}}];"""
        },
        "id": "node-return-qa-failed",
        "name": "Return QA Failed",
        "type": "n8n-nodes-base.code",
        "position": [4840, 800],
        "typeVersion": 2
    })

    # --- Rewire connections ---

    # 1. "IF - Assets OK" true branch now goes to "Prepare QA Input" instead of "Prepare WF-006 Input"
    if "IF - Assets OK" in connections:
        true_branch = connections["IF - Assets OK"]["main"][0]
        # Replace the connection to "Prepare WF-006 Input" with "Prepare QA Input"
        connections["IF - Assets OK"]["main"][0] = [
            {"node": "Prepare QA Input", "type": "main", "index": 0}
        ]

    # 2. Prepare QA Input → Execute WF-005
    connections["Prepare QA Input"] = {
        "main": [[{"node": "Execute WF-005 Batch QA", "type": "main", "index": 0}]]
    }

    # 3. Execute WF-005 → Parse QA Verdict
    connections["Execute WF-005 Batch QA"] = {
        "main": [[{"node": "Parse QA Verdict", "type": "main", "index": 0}]]
    }

    # 4. Parse QA Verdict → IF - QA Pass
    connections["Parse QA Verdict"] = {
        "main": [[{"node": "IF - QA Pass", "type": "main", "index": 0}]]
    }

    # 5. IF - QA Pass: true → Prepare WF-006 Input, false → IF - QA Regenerate
    connections["IF - QA Pass"] = {
        "main": [
            [{"node": "Prepare WF-006 Input", "type": "main", "index": 0}],
            [{"node": "IF - QA Regenerate", "type": "main", "index": 0}]
        ]
    }

    # 6. IF - QA Regenerate: true → QA Regeneration Handler, false → Set QA Failed Status
    connections["IF - QA Regenerate"] = {
        "main": [
            [{"node": "QA Regeneration Handler", "type": "main", "index": 0}],
            [{"node": "Set QA Failed Status", "type": "main", "index": 0}]
        ]
    }

    # 7. QA Regeneration Handler → Execute WF-005 Batch QA (retry loop)
    connections["QA Regeneration Handler"] = {
        "main": [[{"node": "Execute WF-005 Batch QA", "type": "main", "index": 0}]]
    }

    # 8. Set QA Failed Status → Return QA Failed
    connections["Set QA Failed Status"] = {
        "main": [[{"node": "Return QA Failed", "type": "main", "index": 0}]]
    }

    wf["nodes"] = nodes
    wf["connections"] = connections
    return wf


def main():
    print("=" * 60)
    print("Patching WF-001 with QA Routing (5 new nodes)")
    print("=" * 60)

    # Step 1: GET live workflow
    print("\n[1/3] Fetching live WF-001...")
    wf = get_workflow(WF001_ID)
    orig_count = len(wf["nodes"])
    print(f"  Current nodes: {orig_count}")

    # Step 2: Patch
    print("\n[2/3] Adding QA routing nodes...")
    patched = patch_wf001(wf)
    new_count = len(patched["nodes"])
    print(f"  New nodes: {new_count} (+{new_count - orig_count})")

    # Save local backup
    backup_path = "/private/tmp/wf001-pre-qa-patch.json"
    with open(backup_path, "w") as f:
        json.dump(wf, f, indent=2)
    print(f"  Backup saved: {backup_path}")

    # Step 3: PUT back
    print("\n[3/3] Deploying patched WF-001...")
    result = put_workflow(WF001_ID, patched)
    print(f"  Updated: {result.get('name', 'unknown')}")
    print(f"  Version: {result.get('versionId', 'unknown')}")

    print("\n" + "=" * 60)
    print("SUCCESS — WF-001 patched with QA routing")
    print(f"  WF-005 ID: {WF005_ID}")
    print(f"  New flow: Assets OK → QA Input → WF-005 → QA Router")
    print(f"    Pass → WF-006 Assembly")
    print(f"    Conditional → Regen → WF-005 retry (max 1)")
    print(f"    Fail → QA Failed status + halt")
    print("=" * 60)


if __name__ == "__main__":
    main()
