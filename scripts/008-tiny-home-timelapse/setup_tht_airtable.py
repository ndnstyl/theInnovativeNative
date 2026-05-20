#!/usr/bin/env python3
"""
Set up Airtable schema for the Iconic Brand Timelapse (THT) pipeline.
Repurposes existing Table 1 → THT Projects, creates THT Prompts and THT Reels.

Usage: python scripts/008-tiny-home-timelapse/setup_tht_airtable.py
"""

import json
import os
import sys
import time
import urllib.request
import urllib.error

BASE_ID = "appCOlvJdsSeh0QPe"

def _get_airtable_token():
    config_path = os.path.expanduser("~/.claude/.mcp.json")
    with open(config_path) as f:
        config = json.load(f)
    return config["mcpServers"]["airtable"]["env"].get("AIRTABLE_API_KEY",
           config["mcpServers"]["airtable"]["env"].get("AIRTABLE_TOKEN", ""))

API_TOKEN = _get_airtable_token()
META_URL = f"https://api.airtable.com/v0/meta/bases/{BASE_ID}/tables"
EXISTING_TABLE_ID = "tbl4JgciFENe184jo"


def api_request(url, data=None, method="GET"):
    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json",
    }
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        print(f"  HTTP {e.code}: {error_body}")
        raise


def update_field(table_id, field_id, data):
    url = f"{META_URL}/{table_id}/fields/{field_id}"
    return api_request(url, data=data, method="PATCH")


def add_field(table_id, field_config):
    url = f"{META_URL}/{table_id}/fields"
    name = field_config['name']
    print(f"  Adding field: {name} ({field_config['type']})")
    try:
        result = api_request(url, data=field_config, method="POST")
        print(f"    → {result['id']}")
        return result
    except urllib.error.HTTPError as e:
        if e.code == 422:
            print(f"    → Skipped (already exists)")
            return None
        raise


def create_table(name, fields, description=""):
    payload = {"name": name, "description": description, "fields": fields}
    print(f"\nCreating table: {name}...")
    try:
        result = api_request(META_URL, data=payload, method="POST")
        table_id = result["id"]
        print(f"  Created: {table_id}")
        return table_id
    except urllib.error.HTTPError as e:
        if e.code == 422:
            print(f"  Table may already exist, checking...")
            # Fetch all tables to find it
            tables = api_request(META_URL)
            for t in tables.get("tables", []):
                if t["name"] == name:
                    print(f"  Found existing: {t['id']}")
                    return t["id"]
        raise


def main():
    print("=" * 60)
    print("THT Pipeline — Airtable Schema Setup")
    print(f"Base: {BASE_ID}")
    print("=" * 60)

    # Check current state
    print("\nFetching current schema...")
    schema = api_request(META_URL)
    existing_tables = {t["name"]: t["id"] for t in schema["tables"]}
    print(f"  Existing tables: {list(existing_tables.keys())}")

    # ── Step 1: THT Projects table ──
    projects_table_id = EXISTING_TABLE_ID
    print(f"\n── Step 1: Configure THT Projects ({projects_table_id}) ──")

    # Rename old Status field to _old_status to free up the name
    print("  Renaming old Status → _old_status...")
    try:
        update_field(projects_table_id, "fldFFii2vtpjQLC89", {"name": "_old_status"})
        time.sleep(0.3)
    except Exception:
        print("    → Already renamed or doesn't exist")

    # Rename old fields to hide them
    for field_id, old_name, new_name in [
        ("fldoqeyHw1GsohOax", "Notes", "_old_notes"),
        ("fld3qKQIV5reNua0W", "Assignee", "_old_assignee"),
        ("fldcYGi5zwzAOi2JV", "Attachments", "_old_attachments"),
    ]:
        try:
            update_field(projects_table_id, field_id, {"name": new_name})
            print(f"  Renamed: {old_name} → {new_name}")
            time.sleep(0.2)
        except Exception:
            pass

    # Add pipeline fields
    projects_fields = [
        {"name": "Brand Name", "type": "singleLineText"},
        {"name": "Brand Concept", "type": "multilineText"},
        {
            "name": "Status",
            "type": "singleSelect",
            "options": {
                "choices": [
                    {"name": "structure_selected", "color": "blueLight2"},
                    {"name": "prompts_generating", "color": "cyanLight2"},
                    {"name": "prompts_generated", "color": "tealLight2"},
                    {"name": "prompts_approved", "color": "greenLight2"},
                    {"name": "images_generating", "color": "cyanLight2"},
                    {"name": "images_generated", "color": "tealLight2"},
                    {"name": "images_approved", "color": "greenLight2"},
                    {"name": "videos_generating", "color": "cyanLight2"},
                    {"name": "videos_generated", "color": "tealLight2"},
                    {"name": "videos_approved", "color": "greenLight2"},
                    {"name": "reel_assembling", "color": "yellowLight2"},
                    {"name": "reel_assembled", "color": "orangeLight2"},
                    {"name": "published", "color": "purpleLight2"},
                ]
            },
        },
        {
            "name": "Created At",
            "type": "dateTime",
            "options": {
                "timeZone": "America/Chicago",
                "dateFormat": {"name": "us"},
                "timeFormat": {"name": "12hour"},
            },
        },
        {"name": "Images Done", "type": "number", "options": {"precision": 0}},
        {"name": "Videos Done", "type": "number", "options": {"precision": 0}},
        {"name": "Run Next Stage", "type": "checkbox", "options": {"color": "greenBright", "icon": "check"}},
    ]

    for field in projects_fields:
        add_field(projects_table_id, field)
        time.sleep(0.3)

    # ── Step 2: THT Prompts table ──
    print("\n── Step 2: THT Prompts table ──")

    if "THT Prompts" in existing_tables:
        prompts_table_id = existing_tables["THT Prompts"]
        print(f"  Already exists: {prompts_table_id}")
    else:
        prompts_fields = [
            {"name": "Prompt Label", "type": "singleLineText"},
            {"name": "Phase Number", "type": "number", "options": {"precision": 0}},
            {
                "name": "Asset Type",
                "type": "singleSelect",
                "options": {
                    "choices": [
                        {"name": "image", "color": "blueLight2"},
                        {"name": "video", "color": "purpleLight2"},
                    ]
                },
            },
            {"name": "Phase Label", "type": "singleLineText"},
            {"name": "Prompt Text", "type": "multilineText"},
            {
                "name": "Generation Status",
                "type": "singleSelect",
                "options": {
                    "choices": [
                        {"name": "pending", "color": "grayLight2"},
                        {"name": "generating", "color": "yellowLight2"},
                        {"name": "generated", "color": "greenLight2"},
                        {"name": "failed", "color": "redLight2"},
                        {"name": "approved", "color": "purpleLight2"},
                    ]
                },
            },
            {"name": "Drive File ID", "type": "singleLineText"},
            {"name": "Drive URL", "type": "url"},
            {"name": "Preview", "type": "multipleAttachments", "options": {"isReversed": False}},
            {"name": "Kie Job ID", "type": "singleLineText"},
            {"name": "Error", "type": "multilineText"},
        ]
        prompts_table_id = create_table(
            "THT Prompts", prompts_fields,
            "Image and video generation prompts (6 images + 5 videos per project)"
        )
        time.sleep(0.5)

        # Add Project link
        print("  Adding Project link field...")
        add_field(prompts_table_id, {
            "name": "Project",
            "type": "multipleRecordLinks",
            "options": {
                "linkedTableId": projects_table_id,
                "prefersSingleRecordLink": True,
            }
        })
        time.sleep(0.3)

    # ── Step 3: THT Reels table ──
    print("\n── Step 3: THT Reels table ──")

    if "THT Reels" in existing_tables:
        reels_table_id = existing_tables["THT Reels"]
        print(f"  Already exists: {reels_table_id}")
    else:
        reels_fields = [
            {"name": "Reel Name", "type": "singleLineText"},
            {
                "name": "Reel Status",
                "type": "singleSelect",
                "options": {
                    "choices": [
                        {"name": "not_started", "color": "grayLight2"},
                        {"name": "assembling", "color": "yellowLight2"},
                        {"name": "assembled", "color": "greenLight2"},
                        {"name": "failed", "color": "redLight2"},
                        {"name": "published", "color": "purpleLight2"},
                    ]
                },
            },
            {
                "name": "Music Track",
                "type": "singleSelect",
                "options": {
                    "choices": [
                        {"name": "swing_pop", "color": "orangeLight2"},
                        {"name": "ambient_build", "color": "blueLight2"},
                        {"name": "cinematic_progress", "color": "purpleLight2"},
                    ]
                },
            },
            {"name": "Reel Drive ID", "type": "singleLineText"},
            {"name": "Reel URL", "type": "url"},
            {"name": "Duration (s)", "type": "number", "options": {"precision": 0}},
        ]
        reels_table_id = create_table(
            "THT Reels", reels_fields,
            "Final assembled timelapse reels"
        )
        time.sleep(0.5)

        # Add Project link
        print("  Adding Project link field...")
        add_field(reels_table_id, {
            "name": "Project",
            "type": "multipleRecordLinks",
            "options": {
                "linkedTableId": projects_table_id,
                "prefersSingleRecordLink": True,
            }
        })
        time.sleep(0.3)

    # ── Summary ──
    print("\n" + "=" * 60)
    print("SCHEMA SETUP COMPLETE")
    print("=" * 60)
    print(f"Base ID:           {BASE_ID}")
    print(f"THT Projects:      {projects_table_id}")
    print(f"THT Prompts:       {prompts_table_id}")
    print(f"THT Reels:         {reels_table_id}")
    print()
    print("Workflow JSON replacements:")
    print(f'  REPLACE_WITH_BASE_ID           → {BASE_ID}')
    print(f'  REPLACE_WITH_PROJECTS_TABLE_ID → {projects_table_id}')
    print(f'  REPLACE_WITH_PROMPTS_TABLE_ID  → {prompts_table_id}')
    print(f'  REPLACE_WITH_REELS_TABLE_ID    → {reels_table_id}')

    return projects_table_id, prompts_table_id, reels_table_id


if __name__ == "__main__":
    main()
