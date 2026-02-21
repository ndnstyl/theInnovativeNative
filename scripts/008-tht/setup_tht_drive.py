#!/usr/bin/env python3
"""
Create Google Drive folder structure for THT pipeline.
Creates: TIN Marketing / TinyHomeTimelapse / {Images, Videos, Reels}

Usage: python scripts/008-tht/setup_tht_drive.py
"""

import json
import os

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build


def get_credentials():
    """Load credentials from MCP config."""
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


def get_or_create_folder(service, folder_name, parent_id=None):
    """Get or create a folder in Google Drive."""
    query = f"name='{folder_name}' and mimeType='application/vnd.google-apps.folder' and trashed=false"
    if parent_id:
        query += f" and '{parent_id}' in parents"
    results = service.files().list(q=query, fields="files(id, name)").execute()
    files = results.get("files", [])
    if files:
        print(f"  Found existing: {folder_name} → {files[0]['id']}")
        return files[0]["id"]

    file_metadata = {
        "name": folder_name,
        "mimeType": "application/vnd.google-apps.folder",
    }
    if parent_id:
        file_metadata["parents"] = [parent_id]
    folder = service.files().create(body=file_metadata, fields="id").execute()
    folder_id = folder["id"]

    # Share folder publicly
    service.permissions().create(
        fileId=folder_id,
        body={"type": "anyone", "role": "reader"},
    ).execute()

    print(f"  Created: {folder_name} → {folder_id}")
    return folder_id


def main():
    print("=" * 60)
    print("THT Pipeline — Google Drive Folder Setup")
    print("=" * 60)

    creds = get_credentials()
    creds.refresh(Request())
    service = build("drive", "v3", credentials=creds)

    # Create folder tree: TIN Marketing / TinyHomeTimelapse / {Images, Videos, Reels}
    print("\nCreating folder structure...")

    tin_marketing_id = get_or_create_folder(service, "TIN Marketing")
    tht_root_id = get_or_create_folder(service, "TinyHomeTimelapse", tin_marketing_id)
    images_id = get_or_create_folder(service, "Images", tht_root_id)
    videos_id = get_or_create_folder(service, "Videos", tht_root_id)
    reels_id = get_or_create_folder(service, "Reels", tht_root_id)

    print("\n" + "=" * 60)
    print("DRIVE FOLDER SETUP COMPLETE")
    print("=" * 60)
    print(f"TIN Marketing:              {tin_marketing_id}")
    print(f"TinyHomeTimelapse:          {tht_root_id}")
    print(f"TinyHomeTimelapse/Images:   {images_id}")
    print(f"TinyHomeTimelapse/Videos:   {videos_id}")
    print(f"TinyHomeTimelapse/Reels:    {reels_id}")
    print()
    print("Workflow JSON replacements:")
    print(f"  REPLACE_WITH_IMAGES_FOLDER_ID → {images_id}")
    print(f"  REPLACE_WITH_VIDEOS_FOLDER_ID → {videos_id}")
    print(f"  REPLACE_WITH_REELS_FOLDER_ID  → {reels_id}")


if __name__ == "__main__":
    main()
