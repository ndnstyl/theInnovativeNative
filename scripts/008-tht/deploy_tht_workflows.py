#!/usr/bin/env python3
"""
Deploy all 4 THT pipeline workflows to n8n via API.

Usage: python scripts/008-tht/deploy_tht_workflows.py
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

WORKFLOWS = [
    ("scripts/n8n-workflows/tht-prompt-generator.json", "WF-THT-PROMPT"),
    ("scripts/n8n-workflows/tht-image-generator.json", "WF-THT-IMAGE"),
    ("scripts/n8n-workflows/tht-video-generator.json", "WF-THT-VIDEO"),
    ("scripts/n8n-workflows/tht-reel-assembler.json", "WF-THT-REEL"),
]


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


def deploy_workflow(json_path, label):
    print(f"\n── Deploying {label} ──")
    print(f"  Source: {json_path}")

    with open(json_path) as f:
        workflow = json.load(f)

    # Strip read-only fields before deployment
    workflow.pop("tags", None)
    workflow.pop("id", None)
    workflow.pop("versionId", None)
    workflow.pop("meta", None)

    # Create workflow via n8n API
    result = n8n_request("POST", "/api/v1/workflows", workflow)
    wf_id = result["id"]
    print(f"  Created: {wf_id}")

    # Workflows with manual triggers default to inactive — no activation needed
    print(f"  Deployed (manual trigger — activate via n8n UI if needed)")

    return wf_id


def main():
    print("=" * 60)
    print("THT Pipeline — Deploy Workflows to n8n")
    print(f"Server: {N8N_BASE}")
    print("=" * 60)

    deployed = {}
    for json_path, label in WORKFLOWS:
        try:
            wf_id = deploy_workflow(json_path, label)
            deployed[label] = wf_id
        except Exception as e:
            print(f"  FAILED: {e}")
            deployed[label] = "FAILED"

    print("\n" + "=" * 60)
    print("DEPLOYMENT COMPLETE")
    print("=" * 60)
    for label, wf_id in deployed.items():
        status = "DEPLOYED" if wf_id != "FAILED" else "FAILED"
        print(f"  {label}: {wf_id} [{status}]")
    print(f"\nn8n Dashboard: {N8N_BASE}")


if __name__ == "__main__":
    main()
