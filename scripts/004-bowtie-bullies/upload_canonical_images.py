#!/usr/bin/env python3
"""
Upload all canonical Tyrone character images to Google Drive.
Compresses PNGs to JPEG first, then uploads all 15 images to
TIN Marketing > BowTie Bullies > February 2026 > Character References/

Outputs a JSON mapping of filename -> Drive file ID for use in n8n workflow.
"""

import os
import json
import subprocess
import tempfile
import warnings
warnings.filterwarnings("ignore", category=FutureWarning)

from pathlib import Path
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

BASE_DIR = "/Users/makwa/theinnovativenative"
CHAR_DIR = Path(BASE_DIR) / "projects/004-bowtie-bullies/assets/canonical-characters"

# Images that are already JPEG (small, no compression needed)
NATIVE_JPGS = [
    "tyroneFullBody_frontal.jpg",
    "tyroneFullBody_quarterTurn.jpg",
    "tyroneFullBody_hisLeftSide.jpg",
    "tyroneFullBody_hisRightSide.jpg",
    "tyrone_redNose_headshot.jpg",
    "tyrone_FacialExpressions.jpg",
]

# PNGs that need compression to JPEG
PNGS_TO_COMPRESS = [
    "tyroneAngry_teeth.png",
    "tyroneStanding_armsBySide.png",
    "tyrone_crouching.png",
    "tyrone_flexing_biceps.png",
    "tyroneStaring_intoDistance.png",
    "tyrone_Standing_armsCrossed.png",
    "tyrone_squareShoulders_Sunglasses.png",
    "tyrone_standing_sunglasses.png",
    "tyrone_withSunglasses_pointingDirectlyToCamera.png",
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
        print(f"  Found existing folder: {folder_name} ({files[0]['id']})")
        return files[0]["id"]
    file_metadata = {
        "name": folder_name,
        "mimeType": "application/vnd.google-apps.folder",
    }
    if parent_id:
        file_metadata["parents"] = [parent_id]
    folder = service.files().create(body=file_metadata, fields="id").execute()
    print(f"  Created folder: {folder_name} ({folder['id']})")
    return folder["id"]


def compress_png_to_jpeg(png_path, output_dir):
    """Compress a PNG to JPEG using ffmpeg at quality 3 (~85%)."""
    stem = png_path.stem
    output_path = output_dir / f"{stem}_compressed.jpg"
    cmd = [
        "ffmpeg", "-y", "-i", str(png_path),
        "-q:v", "3", str(output_path)
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"ffmpeg failed for {png_path.name}: {result.stderr}")
    size_kb = output_path.stat().st_size / 1024
    print(f"  Compressed {png_path.name} ({png_path.stat().st_size/1024:.0f}KB) -> {output_path.name} ({size_kb:.0f}KB)")
    return output_path


def upload_file(service, file_path, folder_id):
    """Upload a file to Google Drive and return file info."""
    file_path = Path(file_path)
    mime_type = "image/jpeg" if file_path.suffix.lower() in (".jpg", ".jpeg") else "image/png"
    file_metadata = {"name": file_path.name, "parents": [folder_id]}
    media = MediaFileUpload(str(file_path), mimetype=mime_type, resumable=True)
    file = service.files().create(
        body=file_metadata, media_body=media,
        fields="id, webViewLink, webContentLink"
    ).execute()
    # Set sharing: anyone with link = viewer
    service.permissions().create(
        fileId=file["id"],
        body={"type": "anyone", "role": "reader"},
    ).execute()
    return {
        "file_id": file["id"],
        "name": file_path.name,
        "original_name": file_path.name,
        "view_link": file.get("webViewLink"),
        "download_link": file.get("webContentLink"),
    }


def main():
    print("=" * 60)
    print("BowTie Bullies — Canonical Character Image Upload")
    print("=" * 60)

    # Verify source directory
    if not CHAR_DIR.exists():
        print(f"ERROR: Directory not found: {CHAR_DIR}")
        return

    print("\n[1/4] Authenticating...")
    creds = get_credentials()
    service = build("drive", "v3", credentials=creds)
    print("  Authenticated OK")

    print("\n[2/4] Creating Character References folder...")
    tin_folder = get_or_create_folder(service, "TIN Marketing")
    bt_folder = get_or_create_folder(service, "BowTie Bullies", tin_folder)
    feb_folder = get_or_create_folder(service, "February 2026", bt_folder)
    char_ref_folder = get_or_create_folder(service, "Character References", feb_folder)

    print("\n[3/4] Compressing PNGs to JPEG...")
    with tempfile.TemporaryDirectory() as tmp_dir:
        tmp_path = Path(tmp_dir)
        compressed_files = []
        for png_name in PNGS_TO_COMPRESS:
            png_path = CHAR_DIR / png_name
            if not png_path.exists():
                print(f"  MISSING: {png_name}")
                continue
            try:
                compressed = compress_png_to_jpeg(png_path, tmp_path)
                compressed_files.append(compressed)
            except RuntimeError as e:
                print(f"  ERROR: {e}")

        print(f"\n[4/4] Uploading {len(NATIVE_JPGS) + len(compressed_files)} images...")
        results = []
        errors = []
        total = len(NATIVE_JPGS) + len(compressed_files)
        idx = 0

        # Upload native JPGs
        for jpg_name in NATIVE_JPGS:
            idx += 1
            jpg_path = CHAR_DIR / jpg_name
            if not jpg_path.exists():
                errors.append({"file": jpg_name, "error": "File not found"})
                print(f"  [{idx}/{total}] MISSING: {jpg_name}")
                continue
            try:
                result = upload_file(service, jpg_path, char_ref_folder)
                result["original_name"] = jpg_name
                result["type"] = "native_jpg"
                results.append(result)
                print(f"  [{idx}/{total}] OK: {jpg_name} -> {result['file_id']}")
            except Exception as e:
                errors.append({"file": jpg_name, "error": str(e)})
                print(f"  [{idx}/{total}] ERROR: {jpg_name} — {e}")

        # Upload compressed PNGs
        for comp_path in compressed_files:
            idx += 1
            # Map back to original PNG name
            original_png = comp_path.stem.replace("_compressed", "") + ".png"
            try:
                result = upload_file(service, comp_path, char_ref_folder)
                result["original_name"] = original_png
                result["type"] = "compressed_png"
                results.append(result)
                print(f"  [{idx}/{total}] OK: {comp_path.name} (from {original_png}) -> {result['file_id']}")
            except Exception as e:
                errors.append({"file": original_png, "error": str(e)})
                print(f"  [{idx}/{total}] ERROR: {original_png} — {e}")

    print("\n" + "=" * 60)
    print(f"UPLOAD COMPLETE: {len(results)} success, {len(errors)} errors")
    print("=" * 60)

    # Build reference image ID map for the n8n workflow
    ref_map = {}
    for r in results:
        ref_map[r["original_name"]] = r["file_id"]

    output = {
        "folder_id": char_ref_folder,
        "results": results,
        "errors": errors,
        "reference_map": ref_map,
    }

    output_path = Path(BASE_DIR) / "scripts" / "canonical_images_gdrive.json"
    with open(output_path, "w") as f:
        json.dump(output, f, indent=2)
    print(f"\nResults saved to: {output_path}")

    # Print the reference map for easy copy-paste into n8n
    print("\n--- REFERENCE IMAGE MAP (for n8n workflow) ---")
    for name, fid in ref_map.items():
        print(f"  {name}: {fid}")

    return output


if __name__ == "__main__":
    main()
