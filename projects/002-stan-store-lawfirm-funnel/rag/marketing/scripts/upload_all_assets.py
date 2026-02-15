#!/usr/bin/env python3
"""
Upload ALL marketing assets to Google Drive.
"""

import os
import json
from pathlib import Path
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

def get_credentials():
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
    query = f"name='{folder_name}' and mimeType='application/vnd.google-apps.folder' and trashed=false"
    if parent_id:
        query += f" and '{parent_id}' in parents"
    results = service.files().list(q=query, fields="files(id, name)").execute()
    files = results.get("files", [])
    if files:
        return files[0]["id"]
    file_metadata = {"name": folder_name, "mimeType": "application/vnd.google-apps.folder"}
    if parent_id:
        file_metadata["parents"] = [parent_id]
    folder = service.files().create(body=file_metadata, fields="id").execute()
    return folder["id"]

def upload_file(service, file_path, folder_id):
    file_path = Path(file_path)
    mime_types = {
        ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
        ".md": "text/markdown", ".pdf": "application/pdf", ".mp4": "video/mp4",
        ".json": "application/json"
    }
    mime_type = mime_types.get(file_path.suffix.lower(), "application/octet-stream")

    # Check if file already exists
    query = f"name='{file_path.name}' and '{folder_id}' in parents and trashed=false"
    existing = service.files().list(q=query, fields="files(id, webViewLink)").execute().get("files", [])
    if existing:
        return {"file_id": existing[0]["id"], "name": file_path.name,
                "view_link": existing[0].get("webViewLink"), "skipped": True}

    file_metadata = {"name": file_path.name, "parents": [folder_id]}
    media = MediaFileUpload(str(file_path), mimetype=mime_type, resumable=True)
    file = service.files().create(body=file_metadata, media_body=media,
                                   fields="id, webViewLink, webContentLink").execute()
    service.permissions().create(fileId=file["id"], body={"type": "anyone", "role": "reader"}).execute()
    return {"file_id": file["id"], "name": file_path.name, "view_link": file.get("webViewLink")}

def main():
    print("Connecting to Google Drive...")
    creds = get_credentials()
    service = build("drive", "v3", credentials=creds)

    # Folder structure
    tin_folder = get_or_create_folder(service, "TIN Marketing")
    cerebro_folder = get_or_create_folder(service, "Cerebro", tin_folder)
    feb_folder = get_or_create_folder(service, "February 2026", cerebro_folder)

    videos_folder = get_or_create_folder(service, "Videos", feb_folder)
    graphics_folder = get_or_create_folder(service, "Graphics", feb_folder)
    docs_folder = get_or_create_folder(service, "Documents", feb_folder)

    results = {"videos": [], "graphics": [], "documents": []}
    base_path = Path("/Users/makwa/theinnovativenative/law_firm_RAG/marketing")

    # Upload videos
    print("\n=== Uploading Videos ===")
    videos_dir = base_path / "videos"
    if videos_dir.exists():
        for f in videos_dir.glob("*.mp4"):
            print(f"  {f.name}...", end=" ")
            r = upload_file(service, f, videos_folder)
            print("(exists)" if r.get("skipped") else "✓")
            results["videos"].append(r)

    # Upload existing graphics
    print("\n=== Uploading Graphics ===")
    graphics_dir = base_path / "graphics"
    if graphics_dir.exists():
        for f in list(graphics_dir.glob("*.svg")) + list(graphics_dir.glob("*.png")):
            if "february-2026" not in str(f):  # Skip already uploaded
                print(f"  {f.name}...", end=" ")
                r = upload_file(service, f, graphics_folder)
                print("(exists)" if r.get("skipped") else "✓")
                results["graphics"].append(r)

    # Upload key documents
    print("\n=== Uploading Documents ===")
    docs_to_upload = [
        "UTM_TRACKING.md", "facebook-ad-copy.md", "creative-brief-pixel.md",
        "graphics-specs.md", "linkedin-posts-final.md", "linkedin-posts-4-6.md"
    ]
    for doc_name in docs_to_upload:
        doc_path = base_path / doc_name
        if doc_path.exists():
            print(f"  {doc_name}...", end=" ")
            r = upload_file(service, doc_path, docs_folder)
            print("(exists)" if r.get("skipped") else "✓")
            results["documents"].append(r)

    print("\n" + "="*60)
    print("UPLOAD COMPLETE - URLs for Airtable update:")
    print("="*60)

    for category, items in results.items():
        if items:
            print(f"\n{category.upper()}:")
            for item in items:
                print(f"  {item['name']}: {item.get('view_link', 'N/A')}")

if __name__ == "__main__":
    main()
