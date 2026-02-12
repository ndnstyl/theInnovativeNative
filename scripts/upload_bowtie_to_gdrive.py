#!/usr/bin/env python3
"""
Upload all 21 BowTie Bullies deliverables to Google Drive.
Creates folder structure, uploads files, sets sharing permissions, returns JSON results.
"""

import os
import json
import sys
import warnings
warnings.filterwarnings("ignore", category=FutureWarning)

from pathlib import Path
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

BASE_DIR = "/Users/makwa/theinnovativenative"

# Mapping: (airtable_record_id, relative_file_path, drive_subfolder)
FILE_MAPPING = [
    ("receD5omtwY6pZv5A", "deliverables/004-faceless-ai-brand/legal-compliance.md", "Documents"),
    ("recIvJx64ImtiQ0pC", "deliverables/004-faceless-ai-brand/target-audience.md", "Documents"),
    ("recqREN0OR7FzqT6e", "deliverables/004-faceless-ai-brand/episodes-expanded.md", "Documents"),
    ("recwYZPYo9MXCmFhV", "deliverables/004-faceless-ai-brand/shorts-script-templates.md", "Documents"),
    ("recANRn9VgomYmZYE", "deliverables/004-faceless-ai-brand/hook-playbook.md", "Documents"),
    ("rec035rIk5VspVwjn", "deliverables/004-faceless-ai-brand/ssml-cheat-sheet.md", "Documents"),
    ("recMSezAbvylNUb2z", "deliverables/004-faceless-ai-brand/broll-prompt-library.md", "Documents"),
    ("recSikEHxQYAyuFo4", "deliverables/004-faceless-ai-brand/pose-variants.md", "Documents"),
    ("recb75LzrtFViLC2q", "deliverables/004-faceless-ai-brand/intro-outro-spec.md", "Documents"),
    ("recWQs6BK3LNLkOM7", "deliverables/004-faceless-ai-brand/channel-art-specs.md", "Documents"),
    ("recHZyxmfPg2GIg79", "deliverables/004-faceless-ai-brand/haven-artifact-audit.md", "Documents"),
    ("reccXzuAcX95S0jtj", "deliverables/004-faceless-ai-brand/drive-folder-structure.md", "Documents"),
    ("recEyGFkqpcbokS1D", "deliverables/004-faceless-ai-brand/launch-plan.md", "Documents"),
    ("recs5za5SEBE1psSX", "deliverables/004-faceless-ai-brand/youtube-optimization.md", "Documents"),
    ("recfOtwN4PfNYERBZ", "deliverables/004-faceless-ai-brand/platform-strategy.md", "Documents"),
    ("recIVwCZ4vpf0RZlr", "deliverables/004-faceless-ai-brand/red-nose-character-bible.md", "Documents"),
    ("recPDYYUr3Hraybc9", "deliverables/004-faceless-ai-brand/logo-system-spec.md", "Documents"),
    ("rechGOOidWcPHO3oV", ".claude/skills/pptx-generator/brands/bowtie-bullies/brand-system.md", "Brand Config"),
    ("recJYO4yLgbgLoag8", ".claude/skills/pptx-generator/brands/bowtie-bullies/brand.json", "Brand Config"),
    ("reclFmlnLvbzf7V77", ".claude/skills/pptx-generator/brands/bowtie-bullies/config.json", "Brand Config"),
    ("recCD0udmYCCt7qwr", ".claude/skills/pptx-generator/brands/bowtie-bullies/tone-of-voice.md", "Brand Config"),
]


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
        client_secret=gdrive_config["GOOGLE_CLIENT_SECRET"]
    )


def get_or_create_folder(service, folder_name, parent_id=None):
    """Get or create a folder in Google Drive."""
    query = f"name='{folder_name}' and mimeType='application/vnd.google-apps.folder' and trashed=false"
    if parent_id:
        query += f" and '{parent_id}' in parents"
    results = service.files().list(q=query, fields="files(id, name)").execute()
    files = results.get("files", [])
    if files:
        print(f"  Found existing folder: {folder_name} ({files[0]['id']})")
        return files[0]["id"]
    file_metadata = {
        "name": folder_name,
        "mimeType": "application/vnd.google-apps.folder"
    }
    if parent_id:
        file_metadata["parents"] = [parent_id]
    folder = service.files().create(body=file_metadata, fields="id").execute()
    print(f"  Created folder: {folder_name} ({folder['id']})")
    return folder["id"]


def upload_file(service, file_path, folder_id):
    """Upload a file to Google Drive and return shareable link."""
    file_path = Path(file_path)
    mime_types = {
        ".md": "text/markdown",
        ".json": "application/json",
        ".pdf": "application/pdf",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".mp4": "video/mp4",
    }
    mime_type = mime_types.get(file_path.suffix.lower(), "application/octet-stream")
    file_metadata = {"name": file_path.name, "parents": [folder_id]}
    media = MediaFileUpload(str(file_path), mimetype=mime_type, resumable=True)
    file = service.files().create(
        body=file_metadata, media_body=media,
        fields="id, webViewLink, webContentLink"
    ).execute()
    # Set sharing: anyone with link = viewer
    service.permissions().create(
        fileId=file["id"],
        body={"type": "anyone", "role": "reader"}
    ).execute()
    return {
        "file_id": file["id"],
        "name": file_path.name,
        "view_link": file.get("webViewLink"),
        "download_link": file.get("webContentLink")
    }


def main():
    print("=" * 60)
    print("BowTie Bullies — Google Drive Upload")
    print("=" * 60)

    print("\n[1/3] Authenticating...")
    creds = get_credentials()
    service = build("drive", "v3", credentials=creds)
    print("  Authenticated OK")

    print("\n[2/3] Creating folder structure...")
    tin_folder = get_or_create_folder(service, "TIN Marketing")
    bt_folder = get_or_create_folder(service, "BowTie Bullies", tin_folder)
    feb_folder = get_or_create_folder(service, "February 2026", bt_folder)
    docs_folder = get_or_create_folder(service, "Documents", feb_folder)
    brand_folder = get_or_create_folder(service, "Brand Config", feb_folder)

    folder_map = {
        "Documents": docs_folder,
        "Brand Config": brand_folder,
    }

    print("\n[3/3] Uploading 21 files...")
    results = []
    errors = []

    for i, (record_id, rel_path, subfolder) in enumerate(FILE_MAPPING, 1):
        full_path = Path(BASE_DIR) / rel_path
        if not full_path.exists():
            err = {"record_id": record_id, "file": rel_path, "error": "File not found"}
            errors.append(err)
            print(f"  [{i}/21] MISSING: {rel_path}")
            continue

        target_folder = folder_map[subfolder]
        try:
            result = upload_file(service, full_path, target_folder)
            result["record_id"] = record_id
            result["subfolder"] = subfolder
            result["drive_folder"] = f"TIN Marketing/BowTie Bullies/February 2026/{subfolder}"
            results.append(result)
            print(f"  [{i}/21] OK: {result['name']} -> {result['view_link']}")
        except Exception as e:
            err = {"record_id": record_id, "file": rel_path, "error": str(e)}
            errors.append(err)
            print(f"  [{i}/21] ERROR: {rel_path} — {e}")

    print("\n" + "=" * 60)
    print(f"UPLOAD COMPLETE: {len(results)} success, {len(errors)} errors")
    print("=" * 60)

    output = {"results": results, "errors": errors}

    # Write JSON output for downstream processing
    output_path = Path(BASE_DIR) / "scripts" / "bowtie_gdrive_results.json"
    with open(output_path, "w") as f:
        json.dump(output, f, indent=2)
    print(f"\nResults saved to: {output_path}")

    # Also print JSON to stdout
    print("\n--- JSON OUTPUT ---")
    print(json.dumps(output, indent=2))

    return output


if __name__ == "__main__":
    main()
