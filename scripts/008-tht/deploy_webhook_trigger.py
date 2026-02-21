#!/usr/bin/env python3
"""
Deploy THT Webhook Trigger System

Creates WF-THT-ROUTER workflow, updates 4 stage workflows to use webhook
triggers instead of manual triggers, and deploys all to n8n.

Architecture:
  Airtable "Run Next Stage" checkbox → Airtable Automation → POST /webhook/tht-router
  → Router reads Status → dispatches to correct stage workflow webhook
  → Stage workflow processes that specific record
"""

import json
import os
import sys
import tempfile
import subprocess

# === Configuration ===
def _get_n8n_key():
    config_path = os.path.expanduser("~/.claude/.mcp.json")
    with open(config_path) as f:
        config = json.load(f)
    return config["mcpServers"]["n8n"]["env"]["N8N_API_KEY"]

N8N_URL = "https://n8n.srv948776.hstgr.cloud"
N8N_API_KEY = _get_n8n_key()
AIRTABLE_BASE = "appCOlvJdsSeh0QPe"
AIRTABLE_PROJECTS_TABLE = "tbl4JgciFENe184jo"
AIRTABLE_CRED_ID = "YCWFwTIXwnTpVy2y"

WORKFLOW_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'n8n-workflows')

STAGE_WORKFLOWS = {
    "prompt": {
        "id": "WvF8lWezmwO7yODa",
        "file": "tht-prompt-generator.json",
        "webhook_path": "tht-prompt",
        "trigger_node_id": "tht-prompt-manual",
        "status_trigger": "structure_selected",
        "status_transitional": "prompts_generating"
    },
    "image": {
        "id": "wjF3eJbpbfYXZZbT",
        "file": "tht-image-generator.json",
        "webhook_path": "tht-image",
        "trigger_node_id": "tht-img-manual",
        "status_trigger": "prompts_approved",
        "status_transitional": "images_generating"
    },
    "video": {
        "id": "BefCfx7WAzEfXT2v",
        "file": "tht-video-generator.json",
        "webhook_path": "tht-video",
        "trigger_node_id": "tht-vid-manual",
        "status_trigger": "images_approved",
        "status_transitional": "videos_generating"
    },
    "reel": {
        "id": "5yEPYq626Kv6lDt6",
        "file": "tht-reel-assembler.json",
        "webhook_path": "tht-reel",
        "trigger_node_id": "tht-reel-manual",
        "status_trigger": "videos_approved",
        "status_transitional": "reel_assembling"
    }
}

READ_ONLY_FIELDS = ['tags', 'id', 'createdAt', 'updatedAt', 'versionId', 'meta']


def curl_n8n(method, endpoint, data=None):
    """Make a request to n8n API using curl via temp file."""
    url = f"{N8N_URL}/api/v1{endpoint}"
    cmd = ["curl", "-s", "-X", method, url,
           "-H", f"X-N8N-API-KEY: {N8N_API_KEY}",
           "-H", "Content-Type: application/json"]

    if data:
        tmp = tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False)
        json.dump(data, tmp)
        tmp.close()
        cmd.extend(["-d", f"@{tmp.name}"])

    result = subprocess.run(cmd, capture_output=True, text=True)

    if data:
        os.unlink(tmp.name)

    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError:
        print(f"  ERROR: Non-JSON response: {result.stdout[:200]}")
        return None


def load_workflow(filename):
    path = os.path.join(WORKFLOW_DIR, filename)
    with open(path, 'r') as f:
        return json.load(f)


def save_workflow(data, filename):
    path = os.path.join(WORKFLOW_DIR, filename)
    with open(path, 'w') as f:
        json.dump(data, f, indent=2)
    print(f"  Saved: {path}")


def strip_readonly(data):
    """Remove read-only fields before PUT."""
    for field in READ_ONLY_FIELDS:
        data.pop(field, None)
    return data


def build_router_workflow():
    """Build the WF-THT-ROUTER workflow JSON."""
    print("\n=== Building WF-THT-ROUTER ===")

    # Build the Switch rules for status routing
    switch_rules = []
    for stage_name, cfg in STAGE_WORKFLOWS.items():
        switch_rules.append({
            "conditions": {
                "options": {
                    "caseSensitive": True,
                    "leftValue": "",
                    "typeValidation": "strict"
                },
                "conditions": [
                    {
                        "id": f"rule-{stage_name}",
                        "leftValue": "={{ $json.status }}",
                        "rightValue": cfg["status_trigger"],
                        "operator": {
                            "type": "string",
                            "operation": "equals"
                        }
                    }
                ],
                "combinator": "and"
            },
            "renameOutput": True,
            "outputKey": stage_name
        })

    workflow = {
        "name": "WF-THT-ROUTER — Webhook Dispatcher",
        "nodes": [
            # 1. Webhook Trigger
            {
                "parameters": {
                    "httpMethod": "POST",
                    "path": "tht-router",
                    "responseMode": "lastNode",
                    "options": {}
                },
                "id": "tht-router-webhook",
                "name": "Webhook Trigger",
                "type": "n8n-nodes-base.webhook",
                "typeVersion": 2,
                "position": [200, 400],
                "webhookId": "tht-router"
            },
            # 2. Extract Payload
            {
                "parameters": {
                    "jsCode": """// Extract fields from webhook body
const body = $json.body || $json;
const recordId = body.recordId || '';
const status = body.status || '';
const brandName = body.brandName || '';
const brandConcept = body.brandConcept || '';
const projectName = body.projectName || '';

if (!recordId) {
  throw new Error('Missing recordId in webhook payload');
}
if (!status) {
  throw new Error('Missing status in webhook payload');
}

return [{
  json: {
    recordId,
    status,
    brandName,
    brandConcept,
    projectName,
    receivedAt: new Date().toISOString()
  }
}];"""
                },
                "id": "tht-router-extract",
                "name": "Code — Extract Payload",
                "type": "n8n-nodes-base.code",
                "typeVersion": 2,
                "position": [420, 400]
            },
            # 3. Uncheck Run Next Stage
            {
                "parameters": {
                    "operation": "update",
                    "base": {"__rl": True, "value": AIRTABLE_BASE, "mode": "id"},
                    "table": {"__rl": True, "value": AIRTABLE_PROJECTS_TABLE, "mode": "id"},
                    "id": "={{ $json.recordId }}",
                    "columns": {
                        "mappingMode": "defineBelow",
                        "value": {
                            "Run Next Stage": False
                        },
                        "matchingColumns": [],
                        "schema": [
                            {
                                "id": "Run Next Stage",
                                "displayName": "Run Next Stage",
                                "required": False,
                                "defaultMatch": False,
                                "canBeUsedToMatch": True,
                                "display": True,
                                "type": "boolean",
                                "readOnly": False,
                                "removed": False
                            }
                        ]
                    }
                },
                "id": "tht-router-uncheck",
                "name": "Airtable — Uncheck Box",
                "type": "n8n-nodes-base.airtable",
                "typeVersion": 2.1,
                "position": [640, 400],
                "credentials": {
                    "airtableTokenApi": {
                        "id": AIRTABLE_CRED_ID,
                        "name": "Airtable"
                    }
                }
            },
            # 4. Switch by Status
            {
                "parameters": {
                    "rules": {
                        "values": switch_rules
                    },
                    "options": {
                        "fallbackOutput": "extra"
                    }
                },
                "id": "tht-router-switch",
                "name": "Switch — Route by Status",
                "type": "n8n-nodes-base.switch",
                "typeVersion": 3.2,
                "position": [860, 400]
            },
            # 5. HTTP Call PROMPT
            {
                "parameters": {
                    "method": "POST",
                    "url": f"{N8N_URL}/webhook/tht-prompt",
                    "sendBody": True,
                    "specifyBody": "json",
                    "jsonBody": "={{ JSON.stringify({ recordId: $json.recordId, brandName: $json.brandName, brandConcept: $json.brandConcept }) }}",
                    "options": {
                        "timeout": 300000
                    }
                },
                "id": "tht-router-call-prompt",
                "name": "HTTP — Call PROMPT",
                "type": "n8n-nodes-base.httpRequest",
                "typeVersion": 4.2,
                "position": [1120, 200]
            },
            # 6. HTTP Call IMAGE
            {
                "parameters": {
                    "method": "POST",
                    "url": f"{N8N_URL}/webhook/tht-image",
                    "sendBody": True,
                    "specifyBody": "json",
                    "jsonBody": "={{ JSON.stringify({ recordId: $json.recordId }) }}",
                    "options": {
                        "timeout": 600000
                    }
                },
                "id": "tht-router-call-image",
                "name": "HTTP — Call IMAGE",
                "type": "n8n-nodes-base.httpRequest",
                "typeVersion": 4.2,
                "position": [1120, 400]
            },
            # 7. HTTP Call VIDEO
            {
                "parameters": {
                    "method": "POST",
                    "url": f"{N8N_URL}/webhook/tht-video",
                    "sendBody": True,
                    "specifyBody": "json",
                    "jsonBody": "={{ JSON.stringify({ recordId: $json.recordId }) }}",
                    "options": {
                        "timeout": 600000
                    }
                },
                "id": "tht-router-call-video",
                "name": "HTTP — Call VIDEO",
                "type": "n8n-nodes-base.httpRequest",
                "typeVersion": 4.2,
                "position": [1120, 600]
            },
            # 8. HTTP Call REEL
            {
                "parameters": {
                    "method": "POST",
                    "url": f"{N8N_URL}/webhook/tht-reel",
                    "sendBody": True,
                    "specifyBody": "json",
                    "jsonBody": "={{ JSON.stringify({ recordId: $json.recordId }) }}",
                    "options": {
                        "timeout": 600000
                    }
                },
                "id": "tht-router-call-reel",
                "name": "HTTP — Call REEL",
                "type": "n8n-nodes-base.httpRequest",
                "typeVersion": 4.2,
                "position": [1120, 800]
            },
            # 9. No-op for unrecognized status
            {
                "parameters": {
                    "jsCode": """return [{
  json: {
    status: 'no_action',
    message: `No stage workflow for status: ${$json.status}`,
    recordId: $json.recordId,
    validStatuses: ['structure_selected', 'prompts_approved', 'images_approved', 'videos_approved']
  }
}];"""
                },
                "id": "tht-router-noop",
                "name": "Code — No Action",
                "type": "n8n-nodes-base.code",
                "typeVersion": 2,
                "position": [1120, 1000]
            }
        ],
        "connections": {
            "Webhook Trigger": {
                "main": [
                    [{"node": "Code — Extract Payload", "type": "main", "index": 0}]
                ]
            },
            "Code — Extract Payload": {
                "main": [
                    [{"node": "Airtable — Uncheck Box", "type": "main", "index": 0}]
                ]
            },
            "Airtable — Uncheck Box": {
                "main": [
                    [{"node": "Switch — Route by Status", "type": "main", "index": 0}]
                ]
            },
            "Switch — Route by Status": {
                "main": [
                    [{"node": "HTTP — Call PROMPT", "type": "main", "index": 0}],
                    [{"node": "HTTP — Call IMAGE", "type": "main", "index": 0}],
                    [{"node": "HTTP — Call VIDEO", "type": "main", "index": 0}],
                    [{"node": "HTTP — Call REEL", "type": "main", "index": 0}],
                    [{"node": "Code — No Action", "type": "main", "index": 0}]
                ]
            }
        },
        "settings": {
            "executionOrder": "v1"
        }
    }

    save_workflow(workflow, "tht-router.json")
    return workflow


def update_stage_workflow(stage_name, cfg):
    """Replace Manual Trigger with Webhook Trigger in a stage workflow."""
    print(f"\n=== Updating {stage_name.upper()} workflow ===")
    wf = load_workflow(cfg["file"])

    # Find and replace the Manual Trigger node
    old_trigger_name = None
    for i, node in enumerate(wf['nodes']):
        if node['type'] == 'n8n-nodes-base.manualTrigger':
            old_trigger_name = node['name']
            wf['nodes'][i] = {
                "parameters": {
                    "httpMethod": "POST",
                    "path": cfg["webhook_path"],
                    "responseMode": "lastNode",
                    "options": {}
                },
                "id": node['id'].replace('manual', 'webhook'),
                "name": "Webhook Trigger",
                "type": "n8n-nodes-base.webhook",
                "typeVersion": 2,
                "position": node['position'],
                "webhookId": cfg["webhook_path"]
            }
            print(f"  Replaced Manual Trigger → Webhook Trigger (path: {cfg['webhook_path']})")
            break

    if not old_trigger_name:
        print(f"  WARNING: No Manual Trigger found in {cfg['file']}")
        return

    # Update connections: rename old trigger name → "Webhook Trigger"
    if old_trigger_name in wf['connections']:
        wf['connections']['Webhook Trigger'] = wf['connections'].pop(old_trigger_name)
        print(f"  Updated connections: '{old_trigger_name}' → 'Webhook Trigger'")

    # Find the first Airtable Fetch Project node and update it to support recordId
    for node in wf['nodes']:
        if 'Fetch Project' in node.get('name', '') and node['type'] == 'n8n-nodes-base.airtable':
            # Change from search to getRecord if recordId provided, else keep search
            # We'll do this by inserting a Code node before the Airtable fetch
            # Actually, simpler: change the Airtable node to use "get" operation
            # with a dynamic ID from the webhook, but keep filterByFormula as fallback
            #
            # Best approach: Add a Code node that checks for recordId and sets
            # the fetch strategy. But to keep changes minimal, we'll update the
            # Airtable search node to use a filterByFormula that matches by record ID
            # when available, otherwise falls back to status filter.
            old_formula = node['parameters'].get('filterByFormula', '')
            # Use RECORD_ID() function to match specific record
            new_formula = f"={{{{ $json.body ? 'RECORD_ID()=\"' + ($json.body.recordId || '') + '\"' : \"{old_formula}\" }}}}"
            # Actually this is getting complex. Simpler: just use the Airtable "get" operation
            # and pass the record ID. The status-based search is redundant when we have a record ID.
            node['parameters']['operation'] = 'get'
            # Remove search-specific params
            node['parameters'].pop('filterByFormula', None)
            node['parameters'].pop('sort', None)
            node['parameters'].pop('limit', None)
            # Set the record ID from webhook body
            node['parameters']['id'] = "={{ $json.body ? $json.body.recordId : '' }}"
            print(f"  Updated '{node['name']}': search → get by recordId from webhook payload")
            break

    save_workflow(wf, cfg["file"])
    return wf


def deploy_workflow_create(workflow_data):
    """Create a new workflow in n8n."""
    print(f"  Creating workflow: {workflow_data['name']}")
    result = curl_n8n("POST", "/workflows", workflow_data)
    if result and 'id' in result:
        wf_id = result['id']
        print(f"  Created: {wf_id}")
        # Activate
        activate = curl_n8n("POST", f"/workflows/{wf_id}/activate")
        if activate:
            print(f"  Activated: {wf_id}")
        return wf_id
    else:
        print(f"  ERROR creating workflow: {result}")
        return None


def deploy_workflow_update(wf_id, workflow_data):
    """Update an existing workflow in n8n."""
    print(f"  Updating workflow: {wf_id}")
    payload = strip_readonly(dict(workflow_data))
    result = curl_n8n("PUT", f"/workflows/{wf_id}", payload)
    if result and 'id' in result:
        print(f"  Updated: {wf_id}")
        # Activate (needed for webhook triggers to listen)
        activate = curl_n8n("POST", f"/workflows/{wf_id}/activate")
        if activate:
            print(f"  Activated: {wf_id}")
        return True
    else:
        print(f"  ERROR updating workflow: {result}")
        return False


def main():
    print("=" * 60)
    print("THT Webhook Trigger Deployment")
    print("=" * 60)

    # Step 1: Build and deploy router
    router_wf = build_router_workflow()
    router_id = deploy_workflow_create(router_wf)
    if not router_id:
        print("FATAL: Failed to create router workflow")
        sys.exit(1)
    print(f"\n  Router workflow ID: {router_id}")
    print(f"  Webhook URL: {N8N_URL}/webhook/tht-router")

    # Step 2: Update and deploy each stage workflow
    for stage_name, cfg in STAGE_WORKFLOWS.items():
        wf_data = update_stage_workflow(stage_name, cfg)
        if wf_data:
            deploy_workflow_update(cfg["id"], wf_data)

    # Summary
    print(f"\n{'=' * 60}")
    print("DEPLOYMENT COMPLETE")
    print(f"{'=' * 60}")
    print(f"\nRouter:  {N8N_URL}/webhook/tht-router  (ID: {router_id})")
    for stage_name, cfg in STAGE_WORKFLOWS.items():
        print(f"{stage_name.upper():8s}: {N8N_URL}/webhook/{cfg['webhook_path']}  (ID: {cfg['id']})")

    print(f"\n--- Airtable Automation Setup (MANUAL) ---")
    print(f"1. Go to Airtable → THT Projects table → Automations")
    print(f"2. Create automation: When 'Run Next Stage' = checked")
    print(f"3. Action: Run a script (see airtable-automation-script.md)")
    print(f"4. Test: check the box on any project with Status='structure_selected'")


if __name__ == '__main__':
    main()
