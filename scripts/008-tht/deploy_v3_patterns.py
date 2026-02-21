#!/usr/bin/env python3
"""
Deploy THT V3 Pipeline — Fire-and-Forget with Callbacks
========================================================
Deploys:
  1. WF-THT-PROMPT (fix "Could not get parameter" error)
  2. WF-THT-IMAGE (full rewrite — fire-and-forget, ~10 nodes)
  3. WF-THT-VIDEO (full rewrite — fire-and-forget, ~10 nodes)
  4. WF-KIE-CALLBACK (extend — add tht_image + tht_video routing)

All workflows read from local JSON files except CALLBACK which is
patched in-place on the live instance.
"""

import json
import os
import requests
import sys
import time

def _get_n8n_key():
    config_path = os.path.expanduser("~/.claude/.mcp.json")
    with open(config_path) as f:
        config = json.load(f)
    return config["mcpServers"]["n8n"]["env"]["N8N_API_KEY"]

N8N_URL = "https://n8n.srv948776.hstgr.cloud"
N8N_API_KEY = _get_n8n_key()
HEADERS = {
    "X-N8N-API-KEY": N8N_API_KEY,
    "Content-Type": "application/json"
}

# Workflow IDs
WF_PROMPT = "WvF8lWezmwO7yODa"
WF_IMAGE  = "wjF3eJbpbfYXZZbT"
WF_VIDEO  = "BefCfx7WAzEfXT2v"
WF_CALLBACK = "5FfmHlsRPi8qfEH8"

# Read-only fields to strip before PUT
STRIP_FIELDS = ["id", "createdAt", "updatedAt", "versionId", "meta", "tags",
                "shared", "activeVersion", "activeVersionId", "versionCounter",
                "triggerCount", "isArchived", "description", "pinData",
                "staticData", "active"]


def deploy_workflow(wf_id: str, payload: dict, activate: bool = True) -> bool:
    """Deploy a workflow via PUT, optionally activate it."""
    # Strip read-only fields
    for field in STRIP_FIELDS:
        payload.pop(field, None)

    # Strip extra settings fields the API doesn't accept
    if "settings" in payload:
        allowed_settings = {"executionOrder", "callerPolicy"}
        payload["settings"] = {
            k: v for k, v in payload["settings"].items()
            if k in allowed_settings
        }

    url = f"{N8N_URL}/api/v1/workflows/{wf_id}"
    resp = requests.put(url, headers=HEADERS, json=payload)
    if resp.status_code != 200:
        print(f"  ERROR deploying {wf_id}: {resp.status_code} — {resp.text[:300]}")
        return False
    print(f"  Deployed {payload.get('name', wf_id)}")

    if activate:
        act_url = f"{N8N_URL}/api/v1/workflows/{wf_id}/activate"
        act_resp = requests.post(act_url, headers=HEADERS)
        if act_resp.status_code == 200:
            print(f"  Activated {wf_id}")
        else:
            print(f"  WARN: activate failed {act_resp.status_code} — {act_resp.text[:200]}")
    return True


def load_local_workflow(path: str) -> dict:
    """Load workflow JSON from local file."""
    with open(path) as f:
        return json.load(f)


def build_callback_update() -> dict:
    """
    Build the updated WF-KIE-CALLBACK with THT routing.
    Fetches the live workflow and adds THT nodes.
    """
    # Fetch current live workflow
    resp = requests.get(f"{N8N_URL}/api/v1/workflows/{WF_CALLBACK}", headers=HEADERS)
    if resp.status_code != 200:
        raise RuntimeError(f"Failed to fetch callback workflow: {resp.status_code}")
    wf = resp.json()

    # ── 1. Update Parse Callback to handle Veo3 format + extract project_id ──
    new_parse_code = r"""const body = $input.first().json.body;
const query = $input.first().json.query;

let imageUrl = '';
let failMsg = '';
let state = '';

try {
  state = body.data?.state || '';
  failMsg = body.data?.failMsg || body.msg || '';

  if (body.code === 200 || state === 'success') {
    // NBP format: resultJson string with resultUrls array
    try {
      const resultJson = JSON.parse(body.data.resultJson);
      imageUrl = resultJson.resultUrls[0];
    } catch (e) {
      // Veo3 format: info.resultUrls is a string URL
      if (body.data?.info?.resultUrls) {
        imageUrl = typeof body.data.info.resultUrls === 'string'
          ? body.data.info.resultUrls
          : body.data.info.resultUrls[0];
      } else {
        imageUrl = body.data?.resultUrls?.[0] || body.data?.result_url || '';
      }
    }
  }
} catch (e) {
  failMsg = 'Parse error: ' + e.message;
}

return [{
  json: {
    image_url: imageUrl,
    task_id: body.data?.taskId || body.taskId || '',
    code: body.code,
    state: state,
    fail_msg: failMsg,
    type: query.type || 'cs',
    table_id: query.table || 'tbljnCj5BVCaF887j',
    record_id: query.record,
    category: query.category || 'unknown',
    ref_id: query.ref_id || '',
    variation_id: query.variation_id || '',
    project_id: query.project || '',
    phase: query.phase || ''
  }
}];"""

    # Find and update the Parse Callback node
    for node in wf["nodes"]:
        if node["id"] == "cb-parse":
            node["parameters"]["jsCode"] = new_parse_code
            break

    # ── 2. Update Upload to Drive — dynamic folder by type ──
    for node in wf["nodes"]:
        if node["id"] == "cb-upload":
            # Dynamic file name based on type
            node["parameters"]["name"] = "={{ ({'tht_image': 'tht_img', 'tht_video': 'tht_vid', 'ootd': 'haven'}[$('Parse Callback').first().json.type] || 'gen') + '_' + ($('Parse Callback').first().json.phase || $('Parse Callback').first().json.category) + '_' + Date.now() + ($('Parse Callback').first().json.type === 'tht_video' ? '.mp4' : '.png') }}"
            # Dynamic folder based on type
            node["parameters"]["folderId"] = {
                "__rl": True,
                "value": "={{ ({'tht_image': '1d4IF1dLR31I7RGjkQ4YDWya36_0OwsBd', 'tht_video': '1RwU-yudHIC79yRgSoqnkxYFBEp48mrWp'}[$('Parse Callback').first().json.type]) || '1u0g-Yg2-RKr-EhuqKTJ7Yl8ywtJHwrWW' }}",
                "mode": "id"
            }
            break

    # ── 3. Replace "Is OOTD?" with Switch node ──
    # Remove the old "Is OOTD?" node
    wf["nodes"] = [n for n in wf["nodes"] if n["id"] != "cb-route"]

    # Add Switch node
    switch_node = {
        "parameters": {
            "rules": {
                "values": [
                    {
                        "conditions": {
                            "options": {"caseSensitive": True, "leftValue": "", "typeValidation": "strict"},
                            "conditions": [{
                                "id": "route-ootd",
                                "leftValue": "={{ $('Parse Callback').first().json.type }}",
                                "rightValue": "ootd",
                                "operator": {"type": "string", "operation": "equals"}
                            }],
                            "combinator": "and"
                        },
                        "renameOutput": True,
                        "outputKey": "ootd"
                    },
                    {
                        "conditions": {
                            "options": {"caseSensitive": True, "leftValue": "", "typeValidation": "strict"},
                            "conditions": [{
                                "id": "route-tht-image",
                                "leftValue": "={{ $('Parse Callback').first().json.type }}",
                                "rightValue": "tht_image",
                                "operator": {"type": "string", "operation": "equals"}
                            }],
                            "combinator": "and"
                        },
                        "renameOutput": True,
                        "outputKey": "tht_image"
                    },
                    {
                        "conditions": {
                            "options": {"caseSensitive": True, "leftValue": "", "typeValidation": "strict"},
                            "conditions": [{
                                "id": "route-tht-video",
                                "leftValue": "={{ $('Parse Callback').first().json.type }}",
                                "rightValue": "tht_video",
                                "operator": {"type": "string", "operation": "equals"}
                            }],
                            "combinator": "and"
                        },
                        "renameOutput": True,
                        "outputKey": "tht_video"
                    }
                ]
            },
            "options": {
                "fallbackOutput": "extra"
            }
        },
        "id": "cb-route-switch",
        "name": "Route by Type",
        "type": "n8n-nodes-base.switch",
        "typeVersion": 3.2,
        "position": [1328, -64]
    }
    wf["nodes"].append(switch_node)

    # ── 4. Add THT nodes ──

    # THT: Update Prompt Record (shared by both image and video)
    tht_update_prompt = {
        "parameters": {
            "method": "PATCH",
            "url": "=https://api.airtable.com/v0/appCOlvJdsSeh0QPe/tblWExmILcFYnW9ze/{{ $('Parse Callback').first().json.record_id }}",
            "authentication": "predefinedCredentialType",
            "nodeCredentialType": "airtableTokenApi",
            "sendBody": True,
            "specifyBody": "json",
            "jsonBody": '={{ JSON.stringify({ fields: { "Generation Status": "generated", "Drive File ID": $("Upload to Drive").first().json.id, "Drive URL": "https://drive.google.com/file/d/" + $("Upload to Drive").first().json.id + "/view" } }) }}',
            "options": {}
        },
        "id": "cb-tht-update-prompt",
        "name": "Update THT Prompt",
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": [1552, -400],
        "credentials": {
            "airtableTokenApi": {
                "id": "YCWFwTIXwnTpVy2y",
                "name": "Airtable Personal Access Token account"
            }
        }
    }

    # THT: Read Project to get current counter
    tht_read_project = {
        "parameters": {
            "url": "=https://api.airtable.com/v0/appCOlvJdsSeh0QPe/tbl4JgciFENe184jo/{{ $('Parse Callback').first().json.project_id }}",
            "authentication": "predefinedCredentialType",
            "nodeCredentialType": "airtableTokenApi",
            "options": {}
        },
        "id": "cb-tht-read-project",
        "name": "Read THT Project",
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": [1760, -400],
        "credentials": {
            "airtableTokenApi": {
                "id": "YCWFwTIXwnTpVy2y",
                "name": "Airtable Personal Access Token account"
            }
        }
    }

    # THT: Check completion + build project update
    tht_check_complete = {
        "parameters": {
            "jsCode": r"""const project = $input.first().json;
const parsed = $('Parse Callback').first().json;
const type = parsed.type;

// Determine counter field and threshold
const counterField = type === 'tht_image' ? 'Images Done' : 'Videos Done';
const threshold = type === 'tht_image' ? 8 : 4;
const doneStatus = type === 'tht_image' ? 'images_generated' : 'videos_generated';

const currentCount = (project.fields?.[counterField] || 0) + 1;
const allDone = currentCount >= threshold;

// Build the update payload
const updateFields = {};
updateFields[counterField] = currentCount;
if (allDone) {
  updateFields['Status'] = doneStatus;
}

return [{
  json: {
    project_id: parsed.project_id,
    counter_field: counterField,
    new_count: currentCount,
    threshold: threshold,
    all_done: allDone,
    update_fields: updateFields
  }
}];"""
        },
        "id": "cb-tht-check-complete",
        "name": "THT Check Completion",
        "type": "n8n-nodes-base.code",
        "typeVersion": 2,
        "position": [1984, -400]
    }

    # THT: Update project counter (and status if done)
    tht_update_project = {
        "parameters": {
            "method": "PATCH",
            "url": "=https://api.airtable.com/v0/appCOlvJdsSeh0QPe/tbl4JgciFENe184jo/{{ $json.project_id }}",
            "authentication": "predefinedCredentialType",
            "nodeCredentialType": "airtableTokenApi",
            "sendBody": True,
            "specifyBody": "json",
            "jsonBody": "={{ JSON.stringify({ fields: $json.update_fields }) }}",
            "options": {}
        },
        "id": "cb-tht-update-project",
        "name": "Update THT Project",
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": [2208, -400],
        "credentials": {
            "airtableTokenApi": {
                "id": "YCWFwTIXwnTpVy2y",
                "name": "Airtable Personal Access Token account"
            }
        }
    }

    wf["nodes"].extend([
        tht_update_prompt, tht_read_project, tht_check_complete, tht_update_project
    ])

    # ── 5. Update connections ──
    connections = wf["connections"]

    # Remove old "Is OOTD?" connections
    connections.pop("Is OOTD?", None)

    # Set Public Sharing → Route by Type (instead of Is OOTD?)
    connections["Set Public Sharing"] = {
        "main": [[{"node": "Route by Type", "type": "main", "index": 0}]]
    }

    # Route by Type outputs: 0=ootd, 1=tht_image, 2=tht_video, 3=fallback(cs)
    connections["Route by Type"] = {
        "main": [
            [{"node": "Read Current OOTD", "type": "main", "index": 0}],       # ootd
            [{"node": "Update THT Prompt", "type": "main", "index": 0}],       # tht_image
            [{"node": "Update THT Prompt", "type": "main", "index": 0}],       # tht_video
            [{"node": "Update CS Record", "type": "main", "index": 0}]         # fallback
        ]
    }

    # THT chain: Update Prompt → Read Project → Check Completion → Update Project
    connections["Update THT Prompt"] = {
        "main": [[{"node": "Read THT Project", "type": "main", "index": 0}]]
    }
    connections["Read THT Project"] = {
        "main": [[{"node": "THT Check Completion", "type": "main", "index": 0}]]
    }
    connections["THT Check Completion"] = {
        "main": [[{"node": "Update THT Project", "type": "main", "index": 0}]]
    }

    return wf


def main():
    print("=" * 60)
    print("THT V3 Pipeline Deployment — Fire-and-Forget + Callbacks")
    print("=" * 60)

    base_path = "scripts/n8n-workflows"
    results = {}

    # 1. Deploy THT-PROMPT (fix)
    print("\n[1/4] Deploying WF-THT-PROMPT (fix 'Could not get parameter')...")
    prompt_wf = load_local_workflow(f"{base_path}/tht-prompt-generator.json")
    results["prompt"] = deploy_workflow(WF_PROMPT, prompt_wf, activate=True)
    time.sleep(1)

    # 2. Deploy THT-IMAGE (rewrite)
    print("\n[2/4] Deploying WF-THT-IMAGE (fire-and-forget rewrite)...")
    image_wf = load_local_workflow(f"{base_path}/tht-image-generator.json")
    results["image"] = deploy_workflow(WF_IMAGE, image_wf, activate=True)
    time.sleep(1)

    # 3. Deploy THT-VIDEO (rewrite)
    print("\n[3/4] Deploying WF-THT-VIDEO (fire-and-forget rewrite)...")
    video_wf = load_local_workflow(f"{base_path}/tht-video-generator.json")
    results["video"] = deploy_workflow(WF_VIDEO, video_wf, activate=True)
    time.sleep(1)

    # 4. Deploy WF-KIE-CALLBACK (extend)
    print("\n[4/4] Deploying WF-KIE-CALLBACK (extend with THT routing)...")
    try:
        callback_wf = build_callback_update()
        results["callback"] = deploy_workflow(WF_CALLBACK, callback_wf, activate=True)
    except Exception as e:
        print(f"  ERROR building callback update: {e}")
        results["callback"] = False

    # Summary
    print("\n" + "=" * 60)
    print("DEPLOYMENT SUMMARY")
    print("=" * 60)
    for name, success in results.items():
        status = "OK" if success else "FAILED"
        print(f"  {name:12s}: {status}")

    total = sum(1 for v in results.values() if v)
    print(f"\n  {total}/{len(results)} workflows deployed successfully")

    if all(results.values()):
        print("\n  All workflows deployed. Ready for testing.")
        print("  Test flow: Checkbox → Router → Prompt Gen → approve → Image submit → callbacks → approve → Video submit → callbacks → Reel")
    else:
        print("\n  Some deployments failed. Check errors above.")
        sys.exit(1)


if __name__ == "__main__":
    main()
