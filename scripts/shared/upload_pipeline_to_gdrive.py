#!/usr/bin/env python3
"""
RETIRED 2026-02-16 — Replaced by scripts/004-bowtie-bullies/bowtie_scene_compiler.py
which writes directly to Airtable, eliminating the Google Drive intermediary.

Original purpose:
Upload EP-001 pipeline JSON to Google Drive via temporary n8n proxy workflow.
Uses the native Google Drive node (update operation) instead of HTTP Request.
"""

import json
import time
import urllib.request
import urllib.error
import ssl
import sys
import base64

N8N_BASE = "https://n8n.srv948776.hstgr.cloud"
N8N_API_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJzdWIiOiI0Y2FiNDRlOC1hZTUxLTQ5YzctOWUwMC1kZDBiYWYxYTQ5ZTMiLCJpc3Mi"
    "OiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzcwMjI2MTM4fQ."
    "GAkhEjfeNWeTnRcwgK1MqGaphWjZGbjKaZ3zMfFE1SQ"
)
GDRIVE_FILE_ID = "1yfbkV_bvmcnPk486flWS1XqYk5d8eggt"
GDRIVE_CRED_ID = "53ssDoT9mG1Dtejj"
WEBHOOK_PATH = "upload-pipeline-temp-20260216e"
LOCAL_FILE = (
    "/Users/makwa/theinnovativenative/projects/004-bowtie-bullies/"
    "episodes/EP-001/EP-001-marathon-continues-pipeline.json"
)

ctx = ssl.create_default_context()


def api(method, path, body=None):
    url = f"{N8N_BASE}{path}"
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(
        url, data=data, method=method,
        headers={
            "X-N8N-API-KEY": N8N_API_KEY,
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
            raw = resp.read()
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        body_text = e.read().decode(errors="replace")
        print(f"HTTP {e.code} on {method} {path}: {body_text[:500]}", file=sys.stderr)
        raise


def raw_post_text(url, data_bytes, content_type):
    req = urllib.request.Request(
        url, data=data_bytes, method="POST",
        headers={"Content-Type": content_type},
    )
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=120) as resp:
            return resp.status, resp.read().decode(errors="replace")
    except urllib.error.HTTPError as e:
        body_text = e.read().decode(errors="replace")
        return e.code, body_text


def main():
    workflow_id = None
    try:
        # 1. Read local file
        print(f"Reading {LOCAL_FILE} ...")
        with open(LOCAL_FILE, "r") as f:
            pipeline_data = json.load(f)
        pipeline_json = json.dumps(pipeline_data)
        print(f"  File size: {len(pipeline_json)} bytes")

        # 2. Create workflow using native Google Drive node
        # Webhook receives JSON -> Code node converts to binary -> Google Drive Update
        print("Creating temporary n8n workflow ...")
        
        code_js = """
// Convert incoming JSON to binary for Google Drive upload
const body = $input.first().json.body;
const jsonStr = JSON.stringify(body);
const buffer = Buffer.from(jsonStr, 'utf-8');

return [{
  json: {},
  binary: {
    file: await this.helpers.prepareBinaryData(buffer, 'EP-001-marathon-continues-pipeline.json', 'application/json')
  }
}];
"""

        create_body = {
            "name": "[TEMP] Upload Pipeline to GDrive",
            "nodes": [
                {
                    "parameters": {
                        "path": WEBHOOK_PATH,
                        "httpMethod": "POST",
                        "responseMode": "responseNode",
                        "options": {},
                    },
                    "id": "webhook-1",
                    "name": "Webhook",
                    "type": "n8n-nodes-base.webhook",
                    "typeVersion": 2,
                    "position": [250, 300],
                    "webhookId": WEBHOOK_PATH,
                },
                {
                    "parameters": {
                        "jsCode": code_js,
                    },
                    "id": "code-1",
                    "name": "To Binary",
                    "type": "n8n-nodes-base.code",
                    "typeVersion": 2,
                    "position": [450, 300],
                },
                {
                    "parameters": {
                        "operation": "update",
                        "fileId": {"__rl": True, "value": GDRIVE_FILE_ID, "mode": "id"},
                        "inputDataFieldName": "file",
                        "options": {},
                    },
                    "id": "gdrive-1",
                    "name": "Google Drive Update",
                    "type": "n8n-nodes-base.googleDrive",
                    "typeVersion": 3,
                    "position": [650, 300],
                    "credentials": {
                        "googleDriveOAuth2Api": {
                            "id": GDRIVE_CRED_ID,
                            "name": "newGoogleDriveAPI",
                        },
                    },
                },
                {
                    "parameters": {
                        "respondWith": "allIncomingItems",
                        "options": {},
                    },
                    "id": "respond-1",
                    "name": "Respond to Webhook",
                    "type": "n8n-nodes-base.respondToWebhook",
                    "typeVersion": 1.1,
                    "position": [850, 300],
                },
            ],
            "connections": {
                "Webhook": {"main": [[{"node": "To Binary", "type": "main", "index": 0}]]},
                "To Binary": {"main": [[{"node": "Google Drive Update", "type": "main", "index": 0}]]},
                "Google Drive Update": {"main": [[{"node": "Respond to Webhook", "type": "main", "index": 0}]]},
            },
            "settings": {"executionOrder": "v1"},
        }
        created_wf = api("POST", "/api/v1/workflows", create_body)
        workflow_id = created_wf["id"]
        print(f"  Workflow created: id={workflow_id}")

        # 3. Activate
        print("Activating workflow ...")
        api("POST", f"/api/v1/workflows/{workflow_id}/activate")
        print("  Activated.")

        time.sleep(3)

        # 4. POST pipeline JSON to webhook
        webhook_url = f"{N8N_BASE}/webhook/{WEBHOOK_PATH}"
        print(f"POSTing pipeline JSON to {webhook_url} ...")
        status, resp_text = raw_post_text(webhook_url, pipeline_json.encode("utf-8"), "application/json")
        print(f"  HTTP Status: {status}")
        print(f"  Response: {resp_text[:1500]}")

        if status == 200:
            try:
                resp = json.loads(resp_text)
                if isinstance(resp, list) and len(resp) > 0:
                    drive_resp = resp[0]
                elif isinstance(resp, dict):
                    drive_resp = resp
                else:
                    drive_resp = {}
                print(f"\n  Google Drive file updated successfully.")
                print(f"    File ID:   {drive_resp.get('id', 'N/A')}")
                print(f"    Name:      {drive_resp.get('name', 'N/A')}")
                print(f"    MIME Type:  {drive_resp.get('mimeType', 'N/A')}")
            except json.JSONDecodeError:
                print(f"  Non-JSON response (may still be OK)")
        else:
            print(f"\n  Upload failed with status {status}.")
            time.sleep(2)
            try:
                execs = api("GET", f"/api/v1/executions?workflowId={workflow_id}&limit=1&includeData=true")
                for ex in execs.get("data", []):
                    print(f"  Execution {ex['id']}: status={ex.get('status')}")
                    rd = ex.get('data', {}).get('resultData', {})
                    if 'error' in rd:
                        print(f"  Error: {rd['error'].get('message', 'N/A')}")
                    for node_name, runs in rd.get('runData', {}).items():
                        for run in runs:
                            if run.get('error'):
                                print(f"  Node '{node_name}': {run['error'].get('message', json.dumps(run['error'])[:300])}")
            except Exception as e2:
                print(f"  Could not fetch logs: {e2}")

    except Exception as e:
        print(f"\nERROR: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()

    finally:
        if workflow_id:
            print(f"\nCleaning up workflow {workflow_id} ...")
            try:
                api("DELETE", f"/api/v1/workflows/{workflow_id}")
                print("  Deleted.")
            except Exception as e:
                print(f"  Delete failed: {e}", file=sys.stderr)

    print("\nDone.")


if __name__ == "__main__":
    main()
