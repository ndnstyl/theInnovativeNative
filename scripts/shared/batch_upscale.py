#!/usr/bin/env python3
"""
Batch upscale scene images using Real-ESRGAN.

Downloads from GDrive (or reads local files), upscales with Real-ESRGAN 4x,
resizes to target long edge, and optionally re-uploads + updates Airtable.

Usage:
  # Local files
  python scripts/batch_upscale.py --source local --input-dir ./test_imgs --long-edge 2048

  # From GDrive folder
  python scripts/batch_upscale.py --source gdrive --update-airtable

  # Dry run
  python scripts/batch_upscale.py --source gdrive --dry-run
"""

import argparse
import io
import json
import os
import sys
import warnings

warnings.filterwarnings("ignore", category=FutureWarning)

from pathlib import Path

import numpy as np
import torch
from PIL import Image

# Patch torchvision compatibility for basicsr (removed in torchvision >= 0.18)
try:
    from torchvision.transforms import functional_tensor  # noqa: F401
except ImportError:
    import torchvision.transforms.functional as _F

    sys.modules["torchvision.transforms.functional_tensor"] = _F

from basicsr.archs.rrdbnet_arch import RRDBNet
from realesrgan import RealESRGANer

GDRIVE_FOLDER_DEFAULT = "1HeTmehM2FwYL2FKQ_uaCBCEjo3YRzCXA"
IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}


# ── Google Drive helpers ──────────────────────────────────────────────


def get_gdrive_credentials():
    """Load credentials from MCP config (same pattern as upload_pipeline_json.py)."""
    config_path = os.path.expanduser("~/.claude/.mcp.json")
    from google.oauth2.credentials import Credentials

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


def get_gdrive_service():
    from googleapiclient.discovery import build

    creds = get_gdrive_credentials()
    return build("drive", "v3", credentials=creds)


def list_gdrive_images(service, folder_id):
    """List image files in a GDrive folder. Returns list of {id, name, mimeType}."""
    results = []
    page_token = None
    query = f"'{folder_id}' in parents and trashed = false"
    while True:
        resp = (
            service.files()
            .list(
                q=query,
                fields="nextPageToken, files(id, name, mimeType)",
                pageSize=100,
                pageToken=page_token,
            )
            .execute()
        )
        for f in resp.get("files", []):
            ext = Path(f["name"]).suffix.lower()
            if ext in IMAGE_EXTENSIONS or f["mimeType"].startswith("image/"):
                results.append(f)
        page_token = resp.get("nextPageToken")
        if not page_token:
            break
    return results


def download_gdrive_file(service, file_id):
    """Download a file from GDrive, return bytes."""
    from googleapiclient.http import MediaIoBaseDownload

    request = service.files().get_media(fileId=file_id)
    buf = io.BytesIO()
    downloader = MediaIoBaseDownload(buf, request)
    done = False
    while not done:
        _, done = downloader.next_chunk()
    buf.seek(0)
    return buf.read()


def upload_gdrive_overwrite(service, file_id, local_path, mime_type="image/png"):
    """Overwrite an existing GDrive file with new content (same file ID)."""
    from googleapiclient.http import MediaFileUpload

    media = MediaFileUpload(local_path, mimetype=mime_type, resumable=True)
    updated = (
        service.files()
        .update(fileId=file_id, media_body=media, fields="id, name, modifiedTime")
        .execute()
    )
    return updated


# ── Airtable helper ──────────────────────────────────────────────────


def get_airtable_config():
    """Load Airtable config from environment or MCP config."""
    token = os.environ.get("AIRTABLE_API_TOKEN")
    base_id = os.environ.get("AIRTABLE_BASE_ID")
    if token and base_id:
        return token, base_id

    config_path = os.path.expanduser("~/.claude/.mcp.json")
    with open(config_path) as f:
        config = json.load(f)
    at_config = config["mcpServers"].get("airtable", {}).get("env", {})
    token = token or at_config.get("AIRTABLE_API_TOKEN")
    base_id = base_id or at_config.get("AIRTABLE_BASE_ID")
    if not token or not base_id:
        raise RuntimeError(
            "Airtable credentials not found. Set AIRTABLE_API_TOKEN and AIRTABLE_BASE_ID env vars."
        )
    return token, base_id


def update_airtable_image_url(token, base_id, table_name, record_id, new_url):
    """Patch an Airtable record's Image Preview field with a new attachment URL."""
    import requests

    url = f"https://api.airtable.com/v0/{base_id}/{table_name}/{record_id}"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    data = {"fields": {"Image Preview": [{"url": new_url}]}}
    resp = requests.patch(url, headers=headers, json=data)
    resp.raise_for_status()
    return resp.json()


# ── Real-ESRGAN upscaler ─────────────────────────────────────────────


def create_upscaler(device=None):
    """Initialize Real-ESRGAN 4x upscaler. Auto-downloads weights on first run."""
    if device is None:
        if torch.cuda.is_available():
            device = "cuda"
        elif hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
            device = "mps"
        else:
            device = "cpu"

    print(f"  Device: {device}")

    model = RRDBNet(
        num_in_ch=3, num_out_ch=3, num_feat=64, num_block=23, num_grow_ch=32, scale=4
    )

    upsampler = RealESRGANer(
        scale=4,
        model_path="https://github.com/xinntao/Real-ESRGAN/releases/download/v0.1.0/RealESRGAN_x4plus.pth",
        model=model,
        tile=512,
        tile_pad=10,
        pre_pad=0,
        half=False,
        device=device,
    )
    return upsampler


def upscale_image(upsampler, img_pil, long_edge):
    """
    Upscale a PIL image with Real-ESRGAN 4x, then resize to target long edge.
    Returns a PIL Image.
    """
    # Convert PIL → numpy BGR (Real-ESRGAN expects BGR)
    img_np = np.array(img_pil)
    if img_np.shape[2] == 4:  # RGBA → RGB
        img_np = img_np[:, :, :3]
    img_bgr = img_np[:, :, ::-1]  # RGB → BGR

    # 4x upscale
    output_bgr, _ = upsampler.enhance(img_bgr, outscale=4)

    # BGR → RGB → PIL
    output_rgb = output_bgr[:, :, ::-1]
    img_upscaled = Image.fromarray(output_rgb)

    # Resize to target long edge (bicubic)
    w, h = img_upscaled.size
    if max(w, h) != long_edge:
        if w >= h:
            new_w = long_edge
            new_h = int(h * (long_edge / w))
        else:
            new_h = long_edge
            new_w = int(w * (long_edge / h))
        img_upscaled = img_upscaled.resize((new_w, new_h), Image.BICUBIC)

    return img_upscaled


# ── Main ──────────────────────────────────────────────────────────────


def process_local(input_dir, output_dir, long_edge, upsampler, dry_run):
    """Process local image files."""
    input_path = Path(input_dir)
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    files = sorted(
        f for f in input_path.iterdir() if f.suffix.lower() in IMAGE_EXTENSIONS
    )
    if not files:
        print(f"No image files found in {input_dir}")
        return []

    print(f"Found {len(files)} image(s) in {input_dir}")
    results = []

    for i, f in enumerate(files, 1):
        img = Image.open(f).convert("RGB")
        w, h = img.size
        print(f"\n[{i}/{len(files)}] {f.name} ({w}x{h})")

        if dry_run:
            if w >= h:
                new_h = int(h * (long_edge / w))
                print(f"  Would upscale to {long_edge}x{new_h}")
            else:
                new_w = int(w * (long_edge / h))
                print(f"  Would upscale to {new_w}x{long_edge}")
            continue

        upscaled = upscale_image(upsampler, img, long_edge)
        out_file = output_path / f.name
        # Save as PNG for lossless quality
        out_stem = out_file.with_suffix(".png")
        upscaled.save(str(out_stem), "PNG")
        uw, uh = upscaled.size
        print(f"  Saved: {out_stem.name} ({uw}x{uh})")
        results.append({"name": f.name, "output": str(out_stem), "size": (uw, uh)})

    return results


def process_gdrive(
    folder_id, output_dir, long_edge, upsampler, update_airtable, dry_run
):
    """Download images from GDrive, upscale, optionally re-upload."""
    print("[1/4] Connecting to Google Drive...")
    service = get_gdrive_service()

    print(f"[2/4] Listing images in folder {folder_id}...")
    files = list_gdrive_images(service, folder_id)
    if not files:
        print("  No images found in folder.")
        return []

    print(f"  Found {len(files)} image(s)")
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    results = []
    total = len(files)

    for i, gfile in enumerate(files, 1):
        name = gfile["name"]
        file_id = gfile["id"]
        print(f"\n[3/4] [{i}/{total}] {name}")

        if dry_run:
            print(f"  Would download, upscale to {long_edge}px long edge, and save")
            if update_airtable:
                print(f"  Would re-upload to GDrive (file_id={file_id})")
            continue

        # Download
        print("  Downloading...")
        img_bytes = download_gdrive_file(service, file_id)
        img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        w, h = img.size
        print(f"  Downloaded: {w}x{h}")

        # Upscale
        print("  Upscaling...")
        upscaled = upscale_image(upsampler, img, long_edge)
        uw, uh = upscaled.size
        print(f"  Upscaled: {uw}x{uh}")

        # Save locally
        out_file = output_path / Path(name).with_suffix(".png")
        upscaled.save(str(out_file), "PNG")
        print(f"  Saved: {out_file}")

        # Re-upload if requested
        if update_airtable:
            print("  Re-uploading to GDrive (overwrite)...")
            updated = upload_gdrive_overwrite(service, file_id, str(out_file))
            print(f"  Updated: {updated.get('modifiedTime')}")

        results.append(
            {
                "name": name,
                "gdrive_id": file_id,
                "output": str(out_file),
                "size": (uw, uh),
            }
        )

    print(f"\n[4/4] Done. Processed {len(results)} image(s).")
    return results


def main():
    parser = argparse.ArgumentParser(
        description="Batch upscale scene images with Real-ESRGAN"
    )
    parser.add_argument(
        "--source",
        choices=["gdrive", "local"],
        default="local",
        help="Image source (default: local)",
    )
    parser.add_argument(
        "--input-dir",
        default="./input_images",
        help="Local input directory (when --source local)",
    )
    parser.add_argument(
        "--gdrive-folder",
        default=GDRIVE_FOLDER_DEFAULT,
        help="GDrive folder ID (when --source gdrive)",
    )
    parser.add_argument(
        "--long-edge",
        type=int,
        default=2048,
        help="Target long edge in pixels (default: 2048)",
    )
    parser.add_argument(
        "--output-dir",
        default="./upscaled",
        help="Output directory (default: ./upscaled/)",
    )
    parser.add_argument(
        "--update-airtable",
        action="store_true",
        help="Re-upload to GDrive (overwriting originals) after upscaling",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview what would be processed without doing it",
    )
    parser.add_argument(
        "--device",
        choices=["cpu", "cuda", "mps"],
        default=None,
        help="Torch device (auto-detected if not set)",
    )

    args = parser.parse_args()

    print("=" * 60)
    print("BowTie Batch Upscaler — Real-ESRGAN 4x")
    print("=" * 60)
    print(f"  Source:    {args.source}")
    print(f"  Long edge: {args.long_edge}px")
    print(f"  Output:    {args.output_dir}")
    if args.dry_run:
        print("  Mode:      DRY RUN")
    print()

    # Initialize upscaler (skip if dry run)
    upsampler = None
    if not args.dry_run:
        print("Initializing Real-ESRGAN model...")
        upsampler = create_upscaler(device=args.device)
        print("  Model ready.\n")

    if args.source == "local":
        results = process_local(
            args.input_dir, args.output_dir, args.long_edge, upsampler, args.dry_run
        )
    else:
        results = process_gdrive(
            args.gdrive_folder,
            args.output_dir,
            args.long_edge,
            upsampler,
            args.update_airtable,
            args.dry_run,
        )

    # Summary
    if results:
        print(f"\nSummary: {len(results)} images processed")
        for r in results:
            print(f"  {r['name']} → {r['size'][0]}x{r['size'][1]}")


if __name__ == "__main__":
    main()
