#!/usr/bin/env python3
"""
Deploy all 5 THT pipeline workflows to n8n via API (idempotent PUT).

Usage: python scripts/008-tiny-home-timelapse/deploy_tht_workflows.py
"""

import json
import os
import sys
import urllib.request
import urllib.error


def get_n8n_config():
    config_path = os.path.expanduser("~/.claude/.mcp.json")
    with open(config_path) as f:
        config = json.load(f)
    return config["mcpServers"]["n8n"]["env"]["N8N_API_KEY"]


N8N_BASE = "https://n8n.srv948776.hstgr.cloud"
N8N_API_KEY = get_n8n_config()

# Workflow ID → (local JSON path, label)
WORKFLOWS = {
    "6pvw5BJ2zXSwnFBh": ("scripts/n8n-workflows/tht-router.json", "WF-THT-ROUTER"),
    "WvF8lWezmwO7yODa": ("scripts/n8n-workflows/tht-prompt-generator.json", "WF-THT-PROMPT"),
    "wjF3eJbpbfYXZZbT": ("scripts/n8n-workflows/tht-image-generator.json", "WF-THT-IMAGE"),
    "BefCfx7WAzEfXT2v": ("scripts/n8n-workflows/tht-video-generator.json", "WF-THT-VIDEO"),
    "5yEPYq626Kv6lDt6": ("scripts/n8n-workflows/tht-reel-assembler.json", "WF-THT-REEL"),
}

# Read-only fields to strip before PUT
STRIP_FIELDS = ["id", "createdAt", "updatedAt", "versionId", "meta", "tags",
                "shared", "activeVersion", "activeVersionId", "versionCounter",
                "triggerCount", "isArchived", "description", "pinData",
                "staticData", "active"]


def n8n_request(method, path, data=None):
    url = f"{N8N_BASE}{path}"
    headers = {
        "X-N8N-API-KEY": N8N_API_KEY,
        "Content-Type": "application/json",
    }
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        print(f"  HTTP {e.code}: {error_body[:500]}")
        raise


def deploy_workflow(wf_id, json_path, label):
    print(f"\n── Deploying {label} ({wf_id}) ──")
    print(f"  Source: {json_path}")

    with open(json_path) as f:
        workflow = json.load(f)

    # Strip read-only fields before PUT
    for field in STRIP_FIELDS:
        workflow.pop(field, None)

    # Strip extra settings fields the API doesn't accept
    if "settings" in workflow:
        allowed_settings = {"executionOrder", "callerPolicy"}
        workflow["settings"] = {
            k: v for k, v in workflow["settings"].items()
            if k in allowed_settings
        }

    # PUT to update existing workflow (idempotent)
    result = n8n_request("PUT", f"/api/v1/workflows/{wf_id}", workflow)
    print(f"  Updated: {result.get('name', wf_id)}")

    # Activate webhook-based workflows
    has_webhook = any(
        n.get("type", "").endswith(".webhook")
        for n in workflow.get("nodes", [])
    )
    if has_webhook:
        try:
            n8n_request("POST", f"/api/v1/workflows/{wf_id}/activate")
            print(f"  Activated")
        except Exception as e:
            print(f"  WARN: activation failed — {e}")
    else:
        print(f"  Skipped activation (no webhook trigger)")

    return True


def main():
    print("=" * 60)
    print("THT Pipeline — Deploy Workflows to n8n (idempotent PUT)")
    print(f"Server: {N8N_BASE}")
    print("=" * 60)

    results = {}
    for wf_id, (json_path, label) in WORKFLOWS.items():
        try:
            deploy_workflow(wf_id, json_path, label)
            results[label] = "OK"
        except Exception as e:
            print(f"  FAILED: {e}")
            results[label] = "FAILED"

    print("\n" + "=" * 60)
    print("DEPLOYMENT SUMMARY")
    print("=" * 60)
    for label, status in results.items():
        print(f"  {label:20s}: {status}")

    total_ok = sum(1 for v in results.values() if v == "OK")
    print(f"\n  {total_ok}/{len(results)} workflows deployed")

    if all(v == "OK" for v in results.values()):
        print("  All workflows deployed successfully.")
    else:
        print("  Some deployments failed. Check errors above.")
        sys.exit(1)


if __name__ == "__main__":
    main()
