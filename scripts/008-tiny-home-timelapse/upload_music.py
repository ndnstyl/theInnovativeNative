#!/usr/bin/env python3
"""Upload 3 music tracks to Google Drive TinyHomeTimelapse folder."""

import json
import os

from google.auth.transport.requests import Request
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
        client_secret=gdrive_config["GOOGLE_CLIENT_SECRET"],
    )


THT_ROOT_FOLDER = "1sMyyj4EdLAtO2q03dYngvjvmDTQxZBUF"

TRACKS = [
    ("swing_pop", "/tmp/tht-music/swing_pop/MP3___audiopizza_-_corporate_ambient.mp3", "tht_music_swing_pop.mp3"),
    ("ambient_build", "/tmp/tht-music/ambient_build/afternoon-coffee_main-full.mp3", "tht_music_ambient_build.mp3"),
    ("cinematic_progress", "/tmp/tht-music/cinematic_progress/raspberrymusic - LoFi.mp3", "tht_music_cinematic_progress.mp3"),
]


def main():
    creds = get_credentials()
    creds.refresh(Request())
    service = build("drive", "v3", credentials=creds)

    # Get or create Music subfolder
    query = f"name='Music' and mimeType='application/vnd.google-apps.folder' and '{THT_ROOT_FOLDER}' in parents and trashed=false"
    results = service.files().list(q=query, fields="files(id)").execute()
    if results.get("files"):
        music_folder_id = results["files"][0]["id"]
    else:
        folder = service.files().create(
            body={"name": "Music", "mimeType": "application/vnd.google-apps.folder", "parents": [THT_ROOT_FOLDER]},
            fields="id"
        ).execute()
        music_folder_id = folder["id"]
        service.permissions().create(fileId=music_folder_id, body={"type": "anyone", "role": "reader"}).execute()

    print(f"Music folder: {music_folder_id}")

    drive_ids = {}
    for mood, local_path, upload_name in TRACKS:
        print(f"\nUploading {mood}: {upload_name}")
        media = MediaFileUpload(local_path, mimetype="audio/mpeg", resumable=True)
        file = service.files().create(
            body={"name": upload_name, "parents": [music_folder_id]},
            media_body=media,
            fields="id, webViewLink"
        ).execute()
        file_id = file["id"]
        service.permissions().create(fileId=file_id, body={"type": "anyone", "role": "reader"}).execute()
        print(f"  Uploaded: {file_id}")
        drive_ids[mood] = file_id

    print("\n" + "=" * 60)
    print("MUSIC UPLOAD COMPLETE")
    print("=" * 60)
    for mood, file_id in drive_ids.items():
        print(f"  {mood}: {file_id}")
    print("\nWorkflow replacements for tht-reel-assembler.json:")
    print(f"  REPLACE_WITH_SWING_POP_DRIVE_ID         → {drive_ids['swing_pop']}")
    print(f"  REPLACE_WITH_AMBIENT_BUILD_DRIVE_ID     → {drive_ids['ambient_build']}")
    print(f"  REPLACE_WITH_CINEMATIC_PROGRESS_DRIVE_ID → {drive_ids['cinematic_progress']}")


if __name__ == "__main__":
    main()
