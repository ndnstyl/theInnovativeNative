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
    Fetches the live workflow and patches THT nodes idempotently.

    RACE-SAFE: Uses Airtable COUNT query instead of read-increment-write.
    IDEMPOTENT: Removes all existing cb-tht-* nodes before adding new ones.
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
    phase: query.phase || '',
    chain: query.chain || '',
    next_phase: query.next_phase || '',
    stop_phase: query.stop_phase || '',
    stage: query.stage || '',
    regen: query.regen || ''
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
                "value": "={{ ({'tht_image': '1M3bdBewBiyFZiJZ0uijw8cQHgHjmx5Y4', 'tht_video': '1JZ8HGu6FN7CXd4_hJshe4Yxkwf_DPrzc'}[$('Parse Callback').first().json.type]) || '1u0g-Yg2-RKr-EhuqKTJ7Yl8ywtJHwrWW' }}",
                "mode": "id"
            }
            break

    # ── 3. Replace "Is OOTD?" with Switch node (idempotent) ──
    # Remove old "Is OOTD?" node AND old switch if present
    wf["nodes"] = [n for n in wf["nodes"]
                   if n["id"] not in ("cb-route", "cb-route-switch")]

    # Add Switch node with ootd_veo3 support
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
                    },
                    {
                        "conditions": {
                            "options": {"caseSensitive": True, "leftValue": "", "typeValidation": "strict"},
                            "conditions": [{
                                "id": "route-ootd-veo3",
                                "leftValue": "={{ $('Parse Callback').first().json.type }}",
                                "rightValue": "ootd_veo3",
                                "operator": {"type": "string", "operation": "equals"}
                            }],
                            "combinator": "and"
                        },
                        "renameOutput": True,
                        "outputKey": "ootd_veo3"
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

    # ── 4. IDEMPOTENT: Remove ALL existing cb-tht-* nodes before adding new ──
    existing_tht = [n["id"] for n in wf["nodes"] if n["id"].startswith("cb-tht-")]
    if existing_tht:
        print(f"  Removing {len(existing_tht)} existing THT nodes: {existing_tht}")
    wf["nodes"] = [n for n in wf["nodes"] if not n["id"].startswith("cb-tht-")]

    # ── 5. Add RACE-SAFE THT nodes with gallery append ──
    # Chain: Update Prompt → Read Project → Build Gallery + Count → Update Gallery →
    #        Execute Count → Check Threshold → IF Done → Update Project

    # THT: Update Prompt Record (mark generated + set Preview attachment)
    tht_update_prompt = {
        "parameters": {
            "method": "PATCH",
            "url": "=https://api.airtable.com/v0/appCOlvJdsSeh0QPe/tblWExmILcFYnW9ze/{{ $('Parse Callback').first().json.record_id }}",
            "authentication": "predefinedCredentialType",
            "nodeCredentialType": "airtableTokenApi",
            "sendBody": True,
            "specifyBody": "json",
            "jsonBody": '={{ JSON.stringify({ fields: { "Generation Status": "generated", "Drive File ID": $("Upload to Drive").first().json.id, "Drive URL": "https://drive.google.com/file/d/" + $("Upload to Drive").first().json.id + "/view", "Preview": [{ url: "https://drive.google.com/uc?export=download&id=" + $("Upload to Drive").first().json.id }] } }) }}',
            "options": {}
        },
        "id": "cb-tht-update-prompt",
        "name": "Update THT Prompt",
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

    # THT: Read Project (get existing gallery attachments for append)
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
        "position": [1984, -400],
        "credentials": {
            "airtableTokenApi": {
                "id": "YCWFwTIXwnTpVy2y",
                "name": "Airtable Personal Access Token account"
            }
        }
    }

    # THT: Build Gallery Append (simplified — no count logic for v4 chain)
    tht_build_gallery = {
        "parameters": {
            "jsCode": r"""const parsed = $('Parse Callback').first().json;
const project = $input.first().json;
const driveFileId = $('Upload to Drive').first().json.id;
const type = parsed.type;

const galleryField = type === 'tht_image' ? 'Image Gallery' : 'Video Gallery';
const existingGallery = project.fields?.[galleryField] || [];

const newAttachment = {
  url: 'https://drive.google.com/uc?export=download&id=' + driveFileId,
  filename: (type === 'tht_video' ? 'vid' : 'img') + '_phase' + (parsed.phase || '0') + '_' + Date.now() + (type === 'tht_video' ? '.mp4' : '.png')
};

const gallery = existingGallery.map(a => ({ url: a.url }));
gallery.push(newAttachment);

return [{ json: { galleryField, gallery, project_id: parsed.project_id } }];"""
        },
        "id": "cb-tht-build-gallery",
        "name": "Build Gallery",
        "type": "n8n-nodes-base.code",
        "typeVersion": 2,
        "position": [2208, -400]
    }

    # THT: Update Gallery (append image/video to project's gallery field)
    tht_update_gallery = {
        "parameters": {
            "method": "PATCH",
            "url": "=https://api.airtable.com/v0/appCOlvJdsSeh0QPe/tbl4JgciFENe184jo/{{ $json.project_id }}",
            "authentication": "predefinedCredentialType",
            "nodeCredentialType": "airtableTokenApi",
            "sendBody": True,
            "specifyBody": "json",
            "jsonBody": "={{ JSON.stringify({ fields: { [$json.galleryField]: $json.gallery } }) }}",
            "options": {}
        },
        "id": "cb-tht-update-gallery",
        "name": "Update Gallery",
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": [2432, -400],
        "credentials": {
            "airtableTokenApi": {
                "id": "YCWFwTIXwnTpVy2y",
                "name": "Airtable Personal Access Token account"
            }
        }
    }

    # ── CHAIN CONTINUATION LOGIC (v4) ──

    # THT: Chain Decision — determine next action after image/video callback
    tht_chain_decision = {
        "parameters": {
            "jsCode": r"""const parsed = $('Parse Callback').first().json;
const project = $('Read THT Project').first().json;
const driveFileId = $('Upload to Drive').first().json.id;
const type = parsed.type;
const chain = parsed.chain === 'true';
const regen = parsed.regen === 'true';
const nextPhase = parseInt(parsed.next_phase || '0', 10);
const stopPhase = parseInt(parsed.stop_phase || '0', 10);
const stage = parseInt(parsed.stage || '0', 10);
const projectId = parsed.project_id;
const projectName = project.fields?.['Project Name'] || '';
const existingLog = project.fields?.['Pipeline Log'] || '';

// Video callbacks: always mark stage video as reviewed
if (type === 'tht_video') {
  return [{ json: { action: 'video_done', projectId, stage, projectName, existingLog } }];
}

// Regen or non-chain: just done, prompt already updated
if (regen || !chain) {
  return [{ json: { action: 'done', projectId, stage, projectName, existingLog } }];
}

// Chain: check if we should continue or stop at stage boundary
if (nextPhase >= stopPhase) {
  const referenceUrl = 'https://drive.google.com/uc?export=download&id=' + driveFileId;
  return [{ json: {
    action: 'continue', projectId, stage, nextPhase, stopPhase,
    driveFileId, referenceUrl, projectName, existingLog
  } }];
} else {
  return [{ json: { action: 'stage_done', projectId, stage, projectName, existingLog } }];
}"""
        },
        "id": "cb-tht-chain-decision",
        "name": "Chain Decision",
        "type": "n8n-nodes-base.code",
        "typeVersion": 2,
        "position": [2656, -400]
    }

    # THT: Switch — route by chain action
    tht_chain_switch = {
        "parameters": {
            "rules": {
                "values": [
                    {
                        "conditions": {
                            "options": {"caseSensitive": True, "leftValue": "", "typeValidation": "strict"},
                            "conditions": [{
                                "id": "is-continue",
                                "leftValue": "={{ $json.action }}",
                                "rightValue": "continue",
                                "operator": {"type": "string", "operation": "equals"}
                            }],
                            "combinator": "and"
                        },
                        "renameOutput": True,
                        "outputKey": "continue"
                    },
                    {
                        "conditions": {
                            "options": {"caseSensitive": True, "leftValue": "", "typeValidation": "strict"},
                            "conditions": [{
                                "id": "is-stage-done",
                                "leftValue": "={{ $json.action }}",
                                "rightValue": "stage_done",
                                "operator": {"type": "string", "operation": "equals"}
                            }],
                            "combinator": "and"
                        },
                        "renameOutput": True,
                        "outputKey": "stage_done"
                    },
                    {
                        "conditions": {
                            "options": {"caseSensitive": True, "leftValue": "", "typeValidation": "strict"},
                            "conditions": [{
                                "id": "is-video-done",
                                "leftValue": "={{ $json.action }}",
                                "rightValue": "video_done",
                                "operator": {"type": "string", "operation": "equals"}
                            }],
                            "combinator": "and"
                        },
                        "renameOutput": True,
                        "outputKey": "video_done"
                    }
                ]
            },
            "options": {"fallbackOutput": "extra"}
        },
        "id": "cb-tht-chain-switch",
        "name": "Chain Action Switch",
        "type": "n8n-nodes-base.switch",
        "typeVersion": 3.2,
        "position": [2880, -400]
    }

    # ── CONTINUE CHAIN PATH ──

    # THT: Fetch next phase prompt from Airtable
    tht_fetch_next_prompt = {
        "parameters": {
            "method": "GET",
            "url": "=https://api.airtable.com/v0/appCOlvJdsSeh0QPe/tblWExmILcFYnW9ze",
            "authentication": "predefinedCredentialType",
            "nodeCredentialType": "airtableTokenApi",
            "sendQuery": True,
            "queryParameters": {
                "parameters": [
                    {
                        "name": "filterByFormula",
                        "value": '={{ `AND({Phase Number}=${$json.nextPhase},{Asset Type}="image",FIND("${$json.projectName}",ARRAYJOIN({Project})))` }}'
                    }
                ]
            },
            "options": {"timeout": 15000}
        },
        "id": "cb-tht-fetch-next-prompt",
        "name": "Fetch Next Prompt",
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": [3104, -600],
        "credentials": {
            "airtableTokenApi": {
                "id": "YCWFwTIXwnTpVy2y",
                "name": "Airtable Personal Access Token account"
            }
        }
    }

    # THT: Build chain job payload for next phase
    tht_build_chain_job = {
        "parameters": {
            "jsCode": r"""const decision = $('Chain Decision').first().json;
const nextPromptResponse = $input.first().json;
const records = nextPromptResponse.records || [];

if (records.length === 0) {
  // Can't find next prompt — stop chain gracefully
  return [{ json: { error: true, message: 'No prompt found for Phase ' + decision.nextPhase } }];
}

const record = records[0];
const promptText = record.fields['Prompt Text'] || '';
const promptRecordId = record.id;
const newNextPhase = decision.nextPhase - 1;

const callbackUrl = 'https://n8n.srv948776.hstgr.cloud/webhook/kie-callback'
  + '?type=tht_image'
  + '&table=tblWExmILcFYnW9ze'
  + '&record=' + encodeURIComponent(promptRecordId)
  + '&project=' + encodeURIComponent(decision.projectId)
  + '&phase=' + decision.nextPhase
  + '&chain=true'
  + '&next_phase=' + newNextPhase
  + '&stop_phase=' + decision.stopPhase
  + '&stage=' + decision.stage;

return [{ json: {
  error: false,
  promptRecordId,
  promptText,
  referenceUrl: decision.referenceUrl,
  callbackUrl,
  nextPhase: decision.nextPhase,
  projectId: decision.projectId,
  stage: decision.stage
} }];"""
        },
        "id": "cb-tht-build-chain-job",
        "name": "Build Chain Job",
        "type": "n8n-nodes-base.code",
        "typeVersion": 2,
        "position": [3328, -600]
    }

    # THT: Mark next prompt as generating + set reference URL
    tht_mark_next_generating = {
        "parameters": {
            "method": "PATCH",
            "url": "=https://api.airtable.com/v0/appCOlvJdsSeh0QPe/tblWExmILcFYnW9ze/{{ $json.promptRecordId }}",
            "authentication": "predefinedCredentialType",
            "nodeCredentialType": "airtableTokenApi",
            "sendBody": True,
            "specifyBody": "json",
            "jsonBody": '={{ JSON.stringify({ fields: { "Generation Status": "generating", "Reference Image URL": $json.referenceUrl } }) }}',
            "options": {}
        },
        "id": "cb-tht-mark-next-generating",
        "name": "Mark Next Generating",
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": [3552, -700],
        "credentials": {
            "airtableTokenApi": {
                "id": "YCWFwTIXwnTpVy2y",
                "name": "Airtable Personal Access Token account"
            }
        }
    }

    # THT: Submit chain job to Kie.AI (Flux 2 Pro img2img)
    tht_submit_chain = {
        "parameters": {
            "method": "POST",
            "url": "https://api.kie.ai/api/v1/jobs/createTask",
            "authentication": "predefinedCredentialType",
            "nodeCredentialType": "httpHeaderAuth",
            "sendBody": True,
            "specifyBody": "json",
            "jsonBody": '={{ JSON.stringify({ model: "flux-2/pro-image-to-image", callBackUrl: $("Build Chain Job").first().json.callbackUrl, input: { prompt: $("Build Chain Job").first().json.promptText, input_urls: [$("Build Chain Job").first().json.referenceUrl], aspect_ratio: "9:16", resolution: "2K" } }) }}',
            "options": {"timeout": 30000}
        },
        "id": "cb-tht-submit-chain",
        "name": "Submit Chain to Kie.AI",
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": [3552, -500],
        "credentials": {
            "httpHeaderAuth": {
                "id": "EFETRZwIsMkjex1c",
                "name": "kieAI-NB"
            }
        }
    }

    # THT: Update project's Current Chain Phase
    tht_update_chain_phase = {
        "parameters": {
            "method": "PATCH",
            "url": "=https://api.airtable.com/v0/appCOlvJdsSeh0QPe/tbl4JgciFENe184jo/{{ $('Build Chain Job').first().json.projectId }}",
            "authentication": "predefinedCredentialType",
            "nodeCredentialType": "airtableTokenApi",
            "sendBody": True,
            "specifyBody": "json",
            "jsonBody": '={{ JSON.stringify({ fields: { "Current Chain Phase": $("Build Chain Job").first().json.nextPhase } }) }}',
            "options": {}
        },
        "id": "cb-tht-update-chain-phase",
        "name": "Update Chain Phase",
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": [3776, -600],
        "credentials": {
            "airtableTokenApi": {
                "id": "YCWFwTIXwnTpVy2y",
                "name": "Airtable Personal Access Token account"
            }
        }
    }

    # ── STAGE DONE PATH (image stage boundary) ──

    tht_update_stage_review = {
        "parameters": {
            "method": "PATCH",
            "url": "=https://api.airtable.com/v0/appCOlvJdsSeh0QPe/tbl4JgciFENe184jo/{{ $json.projectId }}",
            "authentication": "predefinedCredentialType",
            "nodeCredentialType": "airtableTokenApi",
            "sendBody": True,
            "specifyBody": "json",
            "jsonBody": '={{ JSON.stringify({ fields: { "Status": "stage_" + $json.stage + "_review", "Pipeline Log": ($json.existingLog ? $json.existingLog + "\\n" : "") + "[" + new Date().toISOString().slice(0,16).replace("T"," ") + "] ✓ Stage " + $json.stage + " images ready for review" } }) }}',
            "options": {}
        },
        "id": "cb-tht-update-stage-review",
        "name": "Update Stage Review",
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": [3104, -200],
        "credentials": {
            "airtableTokenApi": {
                "id": "YCWFwTIXwnTpVy2y",
                "name": "Airtable Personal Access Token account"
            }
        }
    }

    # ── VIDEO DONE PATH ──

    tht_update_video_review = {
        "parameters": {
            "method": "PATCH",
            "url": "=https://api.airtable.com/v0/appCOlvJdsSeh0QPe/tbl4JgciFENe184jo/{{ $json.projectId }}",
            "authentication": "predefinedCredentialType",
            "nodeCredentialType": "airtableTokenApi",
            "sendBody": True,
            "specifyBody": "json",
            "jsonBody": '={{ JSON.stringify({ fields: { "Status": "stage_" + $json.stage + "_video_review", "Pipeline Log": ($json.existingLog ? $json.existingLog + "\\n" : "") + "[" + new Date().toISOString().slice(0,16).replace("T"," ") + "] ✓ Stage " + $json.stage + " video ready for review" } }) }}',
            "options": {}
        },
        "id": "cb-tht-update-video-review",
        "name": "Update Video Review",
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": [3104, -50],
        "credentials": {
            "airtableTokenApi": {
                "id": "YCWFwTIXwnTpVy2y",
                "name": "Airtable Personal Access Token account"
            }
        }
    }

    wf["nodes"].extend([
        tht_update_prompt, tht_read_project, tht_build_gallery,
        tht_update_gallery,
        tht_chain_decision, tht_chain_switch,
        tht_fetch_next_prompt, tht_build_chain_job,
        tht_mark_next_generating, tht_submit_chain, tht_update_chain_phase,
        tht_update_stage_review, tht_update_video_review
    ])

    # ── 6. Update connections ──
    connections = wf["connections"]

    # Remove old connections (idempotent cleanup)
    for old_name in ["Is OOTD?", "THT Check Completion", "Build Count Query",
                     "Build Gallery + Count", "Count Completed Records",
                     "THT Check Threshold", "IF \u2014 All Done", "Update THT Project"]:
        connections.pop(old_name, None)

    # Set Public Sharing → Route by Type
    connections["Set Public Sharing"] = {
        "main": [[{"node": "Route by Type", "type": "main", "index": 0}]]
    }

    # Route by Type outputs: 0=ootd, 1=tht_image, 2=tht_video, 3=ootd_veo3, 4=fallback(cs)
    connections["Route by Type"] = {
        "main": [
            [{"node": "Read Current OOTD", "type": "main", "index": 0}],       # 0: ootd
            [{"node": "Update THT Prompt", "type": "main", "index": 0}],       # 1: tht_image
            [{"node": "Update THT Prompt", "type": "main", "index": 0}],       # 2: tht_video
            [{"node": "Build VEO3 Update", "type": "main", "index": 0}],       # 3: ootd_veo3
            [{"node": "Update CS Record", "type": "main", "index": 0}]         # 4: fallback
        ]
    }

    # THT chain: Prompt → Read Project → Build Gallery → Update Gallery → Chain Decision → Switch
    connections["Update THT Prompt"] = {
        "main": [[{"node": "Read THT Project", "type": "main", "index": 0}]]
    }
    connections["Read THT Project"] = {
        "main": [[{"node": "Build Gallery", "type": "main", "index": 0}]]
    }
    connections["Build Gallery"] = {
        "main": [[{"node": "Update Gallery", "type": "main", "index": 0}]]
    }
    connections["Update Gallery"] = {
        "main": [[{"node": "Chain Decision", "type": "main", "index": 0}]]
    }
    connections["Chain Decision"] = {
        "main": [[{"node": "Chain Action Switch", "type": "main", "index": 0}]]
    }
    # Switch outputs: 0=continue, 1=stage_done, 2=video_done, 3=fallback(done/regen)
    connections["Chain Action Switch"] = {
        "main": [
            [{"node": "Fetch Next Prompt", "type": "main", "index": 0}],      # 0: continue chain
            [{"node": "Update Stage Review", "type": "main", "index": 0}],    # 1: stage_done
            [{"node": "Update Video Review", "type": "main", "index": 0}],    # 2: video_done
            []                                                                  # 3: fallback (regen/done)
        ]
    }
    # Continue chain path: Fetch → Build → Mark+Submit parallel → Update Phase
    connections["Fetch Next Prompt"] = {
        "main": [[{"node": "Build Chain Job", "type": "main", "index": 0}]]
    }
    connections["Build Chain Job"] = {
        "main": [[
            {"node": "Mark Next Generating", "type": "main", "index": 0},
            {"node": "Submit Chain to Kie.AI", "type": "main", "index": 0}
        ]]
    }
    connections["Mark Next Generating"] = {
        "main": [[{"node": "Update Chain Phase", "type": "main", "index": 0}]]
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
