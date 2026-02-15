#!/usr/bin/env python3
"""
Upload the revised EP-001 pipeline JSON to Google Drive.

Updates the existing file (1yfbkV_bvmcnPk486flWS1XqYk5d8eggt) in-place
so WF-1 Scene Prep reads the revised 22 narrative prompts.
"""

import os
import json
import warnings
warnings.filterwarnings("ignore", category=FutureWarning)

from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

GDRIVE_FILE_ID = "1yfbkV_bvmcnPk486flWS1XqYk5d8eggt"
LOCAL_PATH = os.path.join(
    os.path.dirname(__file__), "..",
    "projects/004-bowtie-bullies/episodes/EP-001/EP-001-marathon-continues-pipeline.json",
)


def get_credentials():
    """Load credentials from MCP config (same pattern as upload_canonical_images.py)."""
    config_path = os.path.expanduser("~/.claude/.mcp.json")
    with open(config_path) as f:
        config = json.load(f)
    gdrive_config = config["mcpServers"]["google-drive-mcp"]["env"]
    return Credentials(
        token=None,
        refresh_token=gdrive_config["GOOGLE_REFRESH_TOKEN"],
        token_uri="https://oauth2.googleapis.com/token",
        client_id=gdrive_config["GOOGLE_CLIENT_ID"],
        client_secret=gdrive_config["GOOGLE_CLIENT_SECRET"],
    )


def main():
    local_path = os.path.abspath(LOCAL_PATH)
    if not os.path.exists(local_path):
        print(f"ERROR: Local file not found: {local_path}")
        return

    size_kb = os.path.getsize(local_path) / 1024
    print(f"Source: {local_path} ({size_kb:.0f} KB)")
    print(f"Target: Google Drive file {GDRIVE_FILE_ID}")

    print("\n[1/2] Authenticating...")
    creds = get_credentials()
    service = build("drive", "v3", credentials=creds)
    print("  OK")

    print("\n[2/2] Uploading (update in-place)...")
    media = MediaFileUpload(local_path, mimetype="application/json", resumable=True)
    updated = service.files().update(
        fileId=GDRIVE_FILE_ID,
        media_body=media,
        fields="id, name, modifiedTime",
    ).execute()

    print(f"  Updated: {updated.get('name')} (id={updated['id']})")
    print(f"  Modified: {updated.get('modifiedTime')}")
    print("\nDone. WF-1 will now read the revised prompts.")


if __name__ == "__main__":
    main()
