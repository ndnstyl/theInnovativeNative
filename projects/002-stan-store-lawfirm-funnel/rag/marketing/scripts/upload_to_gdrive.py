#!/usr/bin/env python3
"""
Upload marketing assets to Google Drive and return shareable links.
Uses credentials from ~/.claude/.mcp.json
"""

import os
import json
import sys
from pathlib import Path

# Google API imports
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

def get_credentials():
    """Load credentials from MCP config."""
    config_path = os.path.expanduser("~/.claude/.mcp.json")
    with open(config_path) as f:
        config = json.load(f)

    gdrive_config = config["mcpServers"]["google-drive-mcp"]["env"]

    creds = Credentials(
        token=None,
        refresh_token=gdrive_config["GOOGLE_REFRESH_TOKEN"],
        token_uri="https://oauth2.googleapis.com/token",
        client_id=gdrive_config["GOOGLE_CLIENT_ID"],
        client_secret=gdrive_config["GOOGLE_CLIENT_SECRET"]
    )
    return creds

def get_or_create_folder(service, folder_name, parent_id=None):
    """Get or create a folder in Google Drive."""
    query = f"name='{folder_name}' and mimeType='application/vnd.google-apps.folder' and trashed=false"
    if parent_id:
        query += f" and '{parent_id}' in parents"

    results = service.files().list(q=query, fields="files(id, name)").execute()
    files = results.get("files", [])

    if files:
        return files[0]["id"]

    # Create folder
    file_metadata = {
        "name": folder_name,
        "mimeType": "application/vnd.google-apps.folder"
    }
    if parent_id:
        file_metadata["parents"] = [parent_id]

    folder = service.files().create(body=file_metadata, fields="id").execute()
    return folder["id"]

def upload_file(service, file_path, folder_id):
    """Upload a file to Google Drive and return shareable link."""
    file_path = Path(file_path)
    file_name = file_path.name

    # Determine MIME type
    mime_types = {
        ".svg": "image/svg+xml",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".md": "text/markdown",
        ".pdf": "application/pdf",
        ".mp4": "video/mp4"
    }
    mime_type = mime_types.get(file_path.suffix.lower(), "application/octet-stream")

    file_metadata = {
        "name": file_name,
        "parents": [folder_id]
    }

    media = MediaFileUpload(str(file_path), mimetype=mime_type, resumable=True)

    file = service.files().create(
        body=file_metadata,
        media_body=media,
        fields="id, webViewLink, webContentLink"
    ).execute()

    # Make file publicly viewable
    service.permissions().create(
        fileId=file["id"],
        body={"type": "anyone", "role": "reader"}
    ).execute()

    return {
        "file_id": file["id"],
        "name": file_name,
        "view_link": file.get("webViewLink"),
        "download_link": file.get("webContentLink")
    }

def main():
    print("Connecting to Google Drive...")
    creds = get_credentials()
    service = build("drive", "v3", credentials=creds)

    # Create folder structure: TIN Marketing > Cerebro > February 2026
    print("Creating folder structure...")
    tin_folder = get_or_create_folder(service, "TIN Marketing")
    cerebro_folder = get_or_create_folder(service, "Cerebro", tin_folder)
    feb_folder = get_or_create_folder(service, "February 2026", cerebro_folder)
    graphics_folder = get_or_create_folder(service, "Graphics", feb_folder)
    campaigns_folder = get_or_create_folder(service, "Campaign Configs", feb_folder)

    results = {"graphics": [], "campaigns": []}

    # Upload carousel graphics (PNG preferred, SVG as backup)
    graphics_dir = Path("/Users/makwa/theinnovativenative/law_firm_RAG/marketing/graphics/february-2026")
    if graphics_dir.exists():
        print(f"\nUploading graphics from {graphics_dir}...")
        # Prefer PNG files (deployable to social platforms)
        for f in sorted(graphics_dir.glob("*.png")):
            print(f"  Uploading {f.name}...")
            result = upload_file(service, f, graphics_folder)
            results["graphics"].append(result)
            print(f"    ✓ {result['view_link']}")
        # Also upload SVG as source files (for backup/editing)
        for f in sorted(graphics_dir.glob("*.svg")):
            print(f"  Uploading source {f.name}...")
            result = upload_file(service, f, graphics_folder)
            results["graphics"].append(result)
            print(f"    ✓ {result['view_link']}")

    # Upload root graphics folder PNG files (case studies)
    root_graphics = Path("/Users/makwa/theinnovativenative/law_firm_RAG/marketing/graphics")
    if root_graphics.exists():
        print(f"\nUploading case study graphics from {root_graphics}...")
        for f in sorted(root_graphics.glob("*.png")):
            print(f"  Uploading {f.name}...")
            result = upload_file(service, f, graphics_folder)
            results["graphics"].append(result)
            print(f"    ✓ {result['view_link']}")

    # Upload campaign configs
    campaigns_dir = Path("/Users/makwa/theinnovativenative/law_firm_RAG/marketing/campaigns")
    if campaigns_dir.exists():
        print(f"\nUploading campaign configs from {campaigns_dir}...")
        for f in sorted(campaigns_dir.glob("*.md")):
            print(f"  Uploading {f.name}...")
            result = upload_file(service, f, campaigns_folder)
            results["campaigns"].append(result)
            print(f"    ✓ {result['view_link']}")

    # Output JSON for downstream processing
    print("\n" + "="*60)
    print("UPLOAD COMPLETE")
    print("="*60)
    print(json.dumps(results, indent=2))

    return results

if __name__ == "__main__":
    main()
