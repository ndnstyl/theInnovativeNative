#!/usr/bin/env python3
"""
WF-005 Batch QA Gate — Deploy to n8n via API

Creates a 12-node workflow that reviews ALL scene images together
in a single Gemini Vision call, catching cross-scene quality issues
before WF-006 FFMPEG assembly.

Usage: python3 scripts/003-haven-ugc-broll/deploy_wf005_batch_qa.py
"""
import json
import os
import urllib.request
import urllib.error

# --- Credentials ---
MCP_PATH = os.path.expanduser("~/.claude/.mcp.json")
with open(MCP_PATH) as f:
    mcp = json.load(f)
N8N_API_KEY = mcp["mcpServers"]["n8n"]["env"]["N8N_API_KEY"]
N8N_BASE = "https://n8n.srv948776.hstgr.cloud"

# --- Haven Airtable IDs ---
HAVEN_BASE_ID = "appWVJhdylvNm07nv"
ASSETS_TABLE = "tblJq7QP7OPFKYzzR"
QA_REVIEWS_TABLE = "tblQ4xl6Gd0jYs6vN"
AIRTABLE_CRED = "YCWFwTIXwnTpVy2y"
DRIVE_CRED = "53ssDoT9mG1Dtejj"
GEMINI_CRED = "JbBNLCe83ER3tCwD"

# --- Scoring Prompt ---
SCORING_PROMPT = """You are a professional video QA reviewer for UGC product showcase videos.

You will receive:
1. A product reference photo (the REAL product from Amazon)
2. Multiple scene images (6-8) that will be assembled into a 25-35 second video

Score each dimension 1-8. Return ONLY valid JSON, no markdown.

## Scoring Dimensions

### 1. Cross-Scene Diversity (1-8)
Do the scenes look visually distinct from each other? Different angles, compositions, lighting?
- 1-2: 3+ scenes are nearly identical
- 3-4: Some repetition but majority distinct
- 5-6: Good variety with minor similarities
- 7-8: Every scene is visually unique

### 2. Product Accuracy (1-8)
Does the product in the scenes match the reference photo? Correct shape, color, details?
- 1-2: Wrong product entirely or unrecognizable
- 3-4: Vaguely similar but key details wrong
- 5-6: Recognizable but minor inaccuracies
- 7-8: Exact match to reference photo

### 3. Physics & Realism (1-8)
Are objects placed naturally? Correct scale, shadows, interactions?
- 1-2: Multiple floating objects, wrong scale, impossible physics
- 3-4: Some unnatural placements
- 5-6: Mostly realistic with minor issues
- 7-8: Photorealistic, natural object interactions

### 4. Setting Consistency (1-8)
Do the scenes feel like they're in the same home/room?
- 1-2: Completely different environments across scenes
- 3-4: Mostly consistent with some jarring changes
- 5-6: Good consistency, minor differences acceptable
- 7-8: Coherent environment throughout

### 5. Visual Storytelling (1-8)
Do the scenes flow as a video? Hook→detail→context→CTA progression?
- 1-2: Random unrelated shots
- 3-4: Some logical order but weak flow
- 5-6: Reasonable progression
- 7-8: Clear narrative arc from hook to CTA

## Output Format
{
  "scores": {
    "cross_scene_diversity": <int 1-8>,
    "product_accuracy": <int 1-8>,
    "physics_realism": <int 1-8>,
    "setting_consistency": <int 1-8>,
    "visual_storytelling": <int 1-8>
  },
  "overall_score": <int sum of all 5>,
  "max_score": 40,
  "flagged_scenes": [
    {
      "scene_number": <int>,
      "issues": ["description of issue"],
      "suggestion": "how to fix"
    }
  ],
  "summary": "1-2 sentence overall assessment"
}"""


def build_workflow():
    """Build the 12-node WF-005 workflow JSON."""
    nodes = []
    connections = {}

    # ── Node 1: Execute Workflow Trigger ──
    nodes.append({
        "parameters": {},
        "id": "wf005-trigger",
        "name": "Execute Workflow Trigger",
        "type": "n8n-nodes-base.executeWorkflowTrigger",
        "position": [0, 300],
        "typeVersion": 1.1
    })

    # ── Node 2: Download Scene Images ──
    # Uses Google Drive Download for each scene, saves to /tmp
    nodes.append({
        "parameters": {
            "jsCode": """// Download all scene images from Google Drive to /tmp
const fs = require('fs');
const input = $input.first().json;
const scenes = input.scenes;
const ts = Date.now();
const qaDir = '/tmp/haven-qa-' + ts;

// Create temp directory
fs.mkdirSync(qaDir, { recursive: true });

// Download each scene image using Google Drive API
const results = [];
for (const scene of scenes) {
    const fileId = scene.asset_drive_file_id;
    if (!fileId) {
        results.push({ scene_number: scene.number, error: 'No drive file ID' });
        continue;
    }

    try {
        // Use n8n's built-in HTTP helper to download from Drive
        const response = await this.helpers.httpRequestWithAuthentication.call(
            this, 'googleDriveOAuth2Api', {
                method: 'GET',
                url: 'https://www.googleapis.com/drive/v3/files/' + fileId + '?alt=media',
                encoding: 'arraybuffer',
                returnFullResponse: true
            }
        );

        const filePath = qaDir + '/scene-' + scene.number + '.png';
        fs.writeFileSync(filePath, Buffer.from(response.body));

        results.push({
            scene_number: scene.number,
            label: scene.label || 'scene-' + scene.number,
            file_path: filePath,
            quality_score: scene.quality_score || 0,
            expects_haven: scene.expects_haven || false,
            image_prompt: scene.image_prompt || ''
        });
    } catch (err) {
        results.push({
            scene_number: scene.number,
            error: 'Download failed: ' + err.message
        });
    }
}

return [{json: {
    qa_dir: qaDir,
    timestamp: ts,
    scene_images: results,
    script_record_id: input.script_record_id,
    playbook_id: input.playbook_id,
    product_name: input.product_name,
    product_image_url: input.product_image_url || '',
    scene_count: scenes.length
}}];"""
        },
        "id": "wf005-download-scenes",
        "name": "Download Scene Images",
        "type": "n8n-nodes-base.code",
        "position": [260, 300],
        "typeVersion": 2,
        "credentials": {
            "googleDriveOAuth2Api": {
                "id": DRIVE_CRED,
                "name": "newGoogleDriveAPI"
            }
        }
    })

    # ── Node 3: Download Product Reference ──
    nodes.append({
        "parameters": {
            "method": "GET",
            "url": "={{ $json.product_image_url }}",
            "options": {
                "response": {
                    "response": {
                        "responseFormat": "file"
                    }
                },
                "timeout": 15000
            }
        },
        "id": "wf005-download-product",
        "name": "Download Product Reference",
        "type": "n8n-nodes-base.httpRequest",
        "position": [520, 300],
        "typeVersion": 4.2
    })

    # ── Node 4: Build QA Payload ──
    nodes.append({
        "parameters": {
            "jsCode": f"""// Base64-encode all scene images + product reference for Gemini multimodal
const fs = require('fs');
const sceneData = $('Download Scene Images').first().json;
const scenes = sceneData.scene_images.filter(s => !s.error);

// Build parts array for Gemini
const parts = [];

// Add scoring prompt as text
parts.push({{
    text: `{SCORING_PROMPT.replace(chr(96), "'")}`
}});

// Add product reference image (from HTTP Request binary)
try {{
    const productBuf = await this.helpers.getBinaryDataBuffer(0, 'data');
    if (productBuf && productBuf.length > 100) {{
        parts.push({{ text: "PRODUCT REFERENCE PHOTO (this is the real product):" }});
        parts.push({{
            inline_data: {{
                mime_type: "image/jpeg",
                data: productBuf.toString('base64')
            }}
        }});
    }}
}} catch (e) {{
    parts.push({{ text: "NOTE: Product reference image unavailable. Score product accuracy based on product name: " + sceneData.product_name }});
}}

// Add each scene image
for (const scene of scenes) {{
    parts.push({{ text: "SCENE " + scene.scene_number + " (" + scene.label + "):" }});
    const imgBuf = fs.readFileSync(scene.file_path);
    parts.push({{
        inline_data: {{
            mime_type: "image/png",
            data: imgBuf.toString('base64')
        }}
    }});
}}

parts.push({{ text: "Now score all " + scenes.length + " scenes together. Return ONLY valid JSON." }});

return [{{json: {{
    gemini_payload: {{
        contents: [{{ parts: parts }}],
        generationConfig: {{
            temperature: 0.1,
            maxOutputTokens: 2048,
            responseMimeType: "application/json"
        }}
    }},
    scene_count: scenes.length,
    qa_dir: sceneData.qa_dir,
    script_record_id: sceneData.script_record_id,
    playbook_id: sceneData.playbook_id,
    product_name: sceneData.product_name,
    scene_images: scenes
}}}}];"""
        },
        "id": "wf005-build-payload",
        "name": "Build QA Payload",
        "type": "n8n-nodes-base.code",
        "position": [780, 300],
        "typeVersion": 2
    })

    # ── Node 5: Gemini Batch QA ──
    nodes.append({
        "parameters": {
            "method": "POST",
            "url": "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
            "authentication": "predefinedCredentialType",
            "nodeCredentialType": "googlePalmApi",
            "sendBody": True,
            "specifyBody": "json",
            "jsonBody": "={{ JSON.stringify($json.gemini_payload) }}",
            "options": {
                "timeout": 60000
            }
        },
        "id": "wf005-gemini-qa",
        "name": "Gemini Batch QA",
        "type": "n8n-nodes-base.httpRequest",
        "position": [1040, 300],
        "typeVersion": 4.2,
        "credentials": {
            "googlePalmApi": {
                "id": GEMINI_CRED,
                "name": "Google Gemini(PaLM) Api account"
            }
        }
    })

    # ── Node 6: Parse QA Results ──
    nodes.append({
        "parameters": {
            "jsCode": """// Parse Gemini response and calculate verdict
const geminiResponse = $input.first().json;
const prevData = $('Build QA Payload').first().json;

let qaResult;
try {
    // Extract text from Gemini response
    const text = geminiResponse.candidates[0].content.parts[0].text;
    // Parse JSON (handle markdown code blocks if present)
    const cleaned = text.replace(/```json\\n?/g, '').replace(/```\\n?/g, '').trim();
    qaResult = JSON.parse(cleaned);
} catch (e) {
    return [{json: {
        status: 'error',
        error_message: 'Failed to parse Gemini QA response: ' + e.message,
        raw_response: JSON.stringify(geminiResponse).substring(0, 500),
        qa_dir: prevData.qa_dir,
        playbook_id: prevData.playbook_id
    }}];
}

const scores = qaResult.scores || {};
const overallScore = qaResult.overall_score ||
    (scores.cross_scene_diversity || 0) +
    (scores.product_accuracy || 0) +
    (scores.physics_realism || 0) +
    (scores.setting_consistency || 0) +
    (scores.visual_storytelling || 0);

const maxScore = 40;
const pct = (overallScore / maxScore) * 100;

// Check for any single dimension < 4 (hard rule)
const dims = Object.values(scores);
const anyBelowThreshold = dims.some(d => d < 4);

// Determine verdict
let verdict;
if (pct >= 80 && !anyBelowThreshold) {
    verdict = 'pass';
} else if (pct >= 60 && !anyBelowThreshold) {
    verdict = 'conditional';
} else if (anyBelowThreshold && pct >= 60) {
    verdict = 'conditional'; // Hard rule: any dim < 4 forces conditional
} else {
    verdict = 'fail';
}

// Build regeneration prompts for flagged scenes
const scenesToRegenerate = [];
const regenerationPrompts = {};
if (qaResult.flagged_scenes) {
    for (const flagged of qaResult.flagged_scenes) {
        scenesToRegenerate.push(flagged.scene_number);
        regenerationPrompts[String(flagged.scene_number)] = flagged.suggestion || 'Improve quality';
    }
}

return [{json: {
    status: verdict,
    overall_score: overallScore,
    max_score: maxScore,
    percentage: Math.round(pct),
    scores: scores,
    any_dimension_below_4: anyBelowThreshold,
    flagged_scenes: qaResult.flagged_scenes || [],
    scenes_to_regenerate: scenesToRegenerate,
    regeneration_prompts: regenerationPrompts,
    summary: qaResult.summary || '',
    script_record_id: prevData.script_record_id,
    playbook_id: prevData.playbook_id,
    product_name: prevData.product_name,
    scene_images: prevData.scene_images,
    qa_dir: prevData.qa_dir
}}];"""
        },
        "id": "wf005-parse-results",
        "name": "Parse QA Results",
        "type": "n8n-nodes-base.code",
        "position": [1300, 300],
        "typeVersion": 2
    })

    # ── Node 7: Create QA Review Record ──
    nodes.append({
        "parameters": {
            "operation": "create",
            "base": {"__rl": True, "value": HAVEN_BASE_ID, "mode": "id"},
            "table": {"__rl": True, "value": QA_REVIEWS_TABLE, "mode": "id"},
            "columns": {
                "mappingMode": "defineBelow",
                "value": {
                    "Review Title": "={{ 'Batch QA - ' + $json.product_name + ' - ' + new Date().toISOString().split('T')[0] }}",
                    "Review Date": "={{ new Date().toISOString() }}",
                    "Reviewer": "WF-005 Gemini Batch QA",
                    "Total Score": "={{ $json.overall_score }}",
                    "Scores Breakdown": "={{ JSON.stringify($json.scores, null, 2) }}",
                    "Verdict": "={{ $json.status === 'pass' ? 'Pass' : $json.status === 'conditional' ? 'Conditional' : 'Fail' }}",
                    "Notes": "={{ $json.summary + '\\n\\nFlagged scenes: ' + JSON.stringify($json.scenes_to_regenerate) + '\\nPercentage: ' + $json.percentage + '%' + ($json.any_dimension_below_4 ? '\\n⚠️ Hard rule triggered: dimension below 4' : '') }}",
                    "Revision Requested": "={{ $json.status === 'conditional' }}",
                    "Gate Number": "G3"
                },
                "matchingColumns": [],
                "schema": []
            },
            "options": {}
        },
        "id": "wf005-create-qa-record",
        "name": "Create QA Review Record",
        "type": "n8n-nodes-base.airtable",
        "position": [1560, 300],
        "typeVersion": 2.1,
        "credentials": {
            "airtableTokenApi": {
                "id": AIRTABLE_CRED,
                "name": "Airtable Personal Access Token account"
            }
        }
    })

    # ── Node 8: Update Asset QA Status ──
    nodes.append({
        "parameters": {
            "jsCode": """// Update each Asset record with QA status
// Note: This uses Airtable REST API via httpRequestWithAuthentication
const qaData = $('Parse QA Results').first().json;
const qaRecord = $input.first().json;
const qaRecordId = qaRecord.id || '';

const verdict = qaData.status;
const flaggedNums = new Set(qaData.scenes_to_regenerate);

// We can't do per-asset Airtable updates in one Code node efficiently,
// so we'll output items for downstream processing if needed.
// For now, return the final result with the QA record ID.

return [{json: {
    status: qaData.status,
    overall_score: qaData.overall_score,
    max_score: qaData.max_score,
    percentage: qaData.percentage,
    scores: qaData.scores,
    scenes_to_regenerate: qaData.scenes_to_regenerate,
    regeneration_prompts: qaData.regeneration_prompts,
    flagged_scenes: qaData.flagged_scenes,
    summary: qaData.summary,
    qa_review_record_id: qaRecordId,
    script_record_id: qaData.script_record_id,
    playbook_id: qaData.playbook_id,
    qa_dir: qaData.qa_dir
}}];"""
        },
        "id": "wf005-update-assets",
        "name": "Update Asset QA Status",
        "type": "n8n-nodes-base.code",
        "position": [1820, 300],
        "typeVersion": 2
    })

    # ── Node 9: Cleanup Temp Files ──
    nodes.append({
        "parameters": {
            "jsCode": """// Remove temporary QA image files
const fs = require('fs');
const data = $input.first().json;
const qaDir = data.qa_dir;

try {
    if (qaDir && qaDir.startsWith('/tmp/haven-qa-')) {
        // Remove all files in the directory
        const files = fs.readdirSync(qaDir);
        for (const file of files) {
            fs.unlinkSync(qaDir + '/' + file);
        }
        fs.rmdirSync(qaDir);
    }
} catch (e) {
    // Non-fatal — tmp files will be cleaned up by OS eventually
}

return [{json: {
    ...data,
    cleanup: 'done'
}}];"""
        },
        "id": "wf005-cleanup",
        "name": "Cleanup Temp Files",
        "type": "n8n-nodes-base.code",
        "position": [2080, 300],
        "typeVersion": 2
    })

    # ── Node 10: Return Output ──
    nodes.append({
        "parameters": {
            "jsCode": """// Return final WF-005 output to caller (WF-001)
const data = $input.first().json;

return [{json: {
    status: data.status,
    overall_score: data.overall_score,
    max_score: data.max_score,
    percentage: data.percentage,
    scores: data.scores,
    scenes_to_regenerate: data.scenes_to_regenerate,
    regeneration_prompts: data.regeneration_prompts,
    qa_review_record_id: data.qa_review_record_id,
    summary: data.summary
}}];"""
        },
        "id": "wf005-return-output",
        "name": "Return Output",
        "type": "n8n-nodes-base.code",
        "position": [2340, 300],
        "typeVersion": 2
    })

    # ── Node 11: Error Trigger ──
    nodes.append({
        "parameters": {},
        "id": "wf005-error-trigger",
        "name": "Error Trigger",
        "type": "n8n-nodes-base.errorTrigger",
        "position": [0, 600],
        "typeVersion": 1
    })

    # ── Node 12: Error Handler ──
    nodes.append({
        "parameters": {
            "jsCode": """// Cleanup and return structured error
const fs = require('fs');
const error = $input.first().json;

// Try to clean up temp files
try {
    const glob = require('child_process').execSync(
        'ls -d /tmp/haven-qa-* 2>/dev/null || true',
        {encoding: 'utf-8'}
    ).trim();
    if (glob) {
        for (const dir of glob.split('\\n')) {
            if (dir.startsWith('/tmp/haven-qa-')) {
                require('child_process').execSync('rm -rf ' + dir);
            }
        }
    }
} catch (e) {
    // Non-fatal
}

return [{json: {
    status: 'error',
    error_message: error.message || error.error_message || 'Unknown WF-005 error',
    error_node: error.node || 'unknown',
    timestamp: new Date().toISOString()
}}];"""
        },
        "id": "wf005-error-handler",
        "name": "Error Handler",
        "type": "n8n-nodes-base.code",
        "position": [260, 600],
        "typeVersion": 2
    })

    # ── Connections ──
    connections = {
        "Execute Workflow Trigger": {
            "main": [[{"node": "Download Scene Images", "type": "main", "index": 0}]]
        },
        "Download Scene Images": {
            "main": [[{"node": "Download Product Reference", "type": "main", "index": 0}]]
        },
        "Download Product Reference": {
            "main": [[{"node": "Build QA Payload", "type": "main", "index": 0}]]
        },
        "Build QA Payload": {
            "main": [[{"node": "Gemini Batch QA", "type": "main", "index": 0}]]
        },
        "Gemini Batch QA": {
            "main": [[{"node": "Parse QA Results", "type": "main", "index": 0}]]
        },
        "Parse QA Results": {
            "main": [[{"node": "Create QA Review Record", "type": "main", "index": 0}]]
        },
        "Create QA Review Record": {
            "main": [[{"node": "Update Asset QA Status", "type": "main", "index": 0}]]
        },
        "Update Asset QA Status": {
            "main": [[{"node": "Cleanup Temp Files", "type": "main", "index": 0}]]
        },
        "Cleanup Temp Files": {
            "main": [[{"node": "Return Output", "type": "main", "index": 0}]]
        },
        "Error Trigger": {
            "main": [[{"node": "Error Handler", "type": "main", "index": 0}]]
        }
    }

    return {
        "name": "WF-005 Haven Batch QA Gate",
        "nodes": nodes,
        "connections": connections,
        "settings": {
            "executionOrder": "v1",
            "callerPolicy": "workflowsFromSameOwner",
            "availableInMCP": False
        }
    }


def deploy_workflow(workflow_json):
    """Deploy workflow to n8n via API."""
    url = f"{N8N_BASE}/api/v1/workflows"
    data = json.dumps(workflow_json).encode("utf-8")

    req = urllib.request.Request(url, data=data, method="POST")
    req.add_header("X-N8N-API-KEY", N8N_API_KEY)
    req.add_header("Content-Type", "application/json")

    try:
        resp = urllib.request.urlopen(req)
        result = json.loads(resp.read())
        return result
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        print(f"ERROR {e.code}: {error_body}")
        raise


def main():
    print("=" * 60)
    print("WF-005 Haven Batch QA Gate — Deploying to n8n")
    print("=" * 60)

    # Build workflow
    print("\n[1/2] Building workflow JSON (12 nodes)...")
    workflow = build_workflow()
    print(f"  Nodes: {len(workflow['nodes'])}")
    print(f"  Connections: {len(workflow['connections'])}")

    # Save local copy for reference
    local_path = os.path.join(
        os.path.dirname(__file__),
        "wf005_batch_qa_gate.json"
    )
    with open(local_path, "w") as f:
        json.dump(workflow, f, indent=2)
    print(f"  Local backup: {local_path}")

    # Deploy to n8n
    print("\n[2/2] Deploying to n8n...")
    result = deploy_workflow(workflow)
    wf_id = result.get("id", "unknown")
    print(f"  Workflow ID: {wf_id}")
    print(f"  Name: {result.get('name', 'unknown')}")
    print(f"  URL: {N8N_BASE}/workflow/{wf_id}")

    print("\n" + "=" * 60)
    print(f"SUCCESS — WF-005 deployed as workflow ID: {wf_id}")
    print(f"Next: Update WF-001 to call WF-005 between WF-004 and WF-006")
    print("=" * 60)

    return wf_id


if __name__ == "__main__":
    wf_id = main()
