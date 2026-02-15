#!/usr/bin/env python3
"""
prep_premiere_assets.py — Organize timeline-referenced assets into Premiere-ready folder structure.

Creates a 6-folder bin structure with all assets copied (or symlinked) from their
source locations, plus a manifest.txt listing all files with track assignments.

Usage:
  python scripts/shared/prep_premiere_assets.py timeline.json --output premiere-prep/EP-001
  python scripts/shared/prep_premiere_assets.py timeline.json --output dir --symlink
  python scripts/shared/prep_premiere_assets.py timeline.json --output dir --base-path /absolute/path
  python scripts/shared/prep_premiere_assets.py timeline.json --dry-run
"""

import argparse
import os
import shutil
import sys
from pathlib import Path

# Import from sibling module
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from timeline_to_ffmpeg import load_timeline


FOLDER_STRUCTURE = [
    "01-Video/Intro",
    "01-Video/Outro",
    "01-Video/Stills",
    "01-Video/Overlays",
    "02-VO",
    "03-SFX/Beds",
    "03-SFX/Events",
    "04-Music",
    "05-Grade",
    "06-Export",
]


def classify_video_clip(clip):
    """Determine subfolder for a video track clip."""
    clip_id = clip.get("id", "")
    clip_type = clip.get("type", "video")

    if "intro" in clip_id.lower():
        return "01-Video/Intro"
    elif "outro" in clip_id.lower():
        return "01-Video/Outro"
    elif clip_type == "remotion_overlay":
        return "01-Video/Overlays"
    else:
        return "01-Video/Stills"


def copy_or_link(src, dst, use_symlink=False):
    """Copy a file or create a relative symlink."""
    if use_symlink:
        rel = os.path.relpath(src, os.path.dirname(dst))
        os.symlink(rel, dst)
    else:
        shutil.copy2(src, dst)


def resolve_source(source, base_path):
    """Resolve a source path against the base path."""
    p = Path(source)
    if p.is_absolute():
        return p
    return Path(base_path) / p


def process_track(clips, track_name, subfolder_fn, output_dir, base_path,
                  use_symlink, dry_run, manifest):
    """Process clips from a track, copying/linking files to the output structure."""
    for clip in clips:
        source = clip.get("source", "")
        if not source:
            continue

        clip_id = clip.get("id", "unknown")

        if callable(subfolder_fn):
            subfolder = subfolder_fn(clip)
        else:
            subfolder = subfolder_fn

        src_path = resolve_source(source, base_path)
        filename = os.path.basename(source)
        dst_dir = os.path.join(output_dir, subfolder)
        dst_path = os.path.join(dst_dir, filename)

        if dry_run:
            exists = src_path.exists()
            status = "OK" if exists else "MISSING"
            manifest.append((track_name, subfolder, filename, str(src_path), status))
            if not exists:
                print("WARNING: %s - source not found: %s" % (clip_id, src_path), file=sys.stderr)
            continue

        if not src_path.exists():
            print("WARNING: %s - source not found: %s (skipping)" % (clip_id, src_path), file=sys.stderr)
            manifest.append((track_name, subfolder, filename, str(src_path), "MISSING"))
            continue

        # Handle duplicate filenames
        if os.path.exists(dst_path):
            name, ext = os.path.splitext(filename)
            counter = 1
            while os.path.exists(dst_path):
                filename = "%s_%d%s" % (name, counter, ext)
                dst_path = os.path.join(dst_dir, filename)
                counter += 1

        try:
            copy_or_link(str(src_path), dst_path, use_symlink)
            manifest.append((track_name, subfolder, filename, str(src_path), "OK"))
        except OSError as e:
            print("WARNING: %s - copy failed: %s" % (clip_id, e), file=sys.stderr)
            manifest.append((track_name, subfolder, filename, str(src_path), "ERROR"))


def write_manifest(manifest, output_dir, dry_run):
    """Write manifest.txt with all file entries."""
    path = os.path.join(output_dir, "manifest.txt") if not dry_run else None

    lines = []
    lines.append("%-12s | %-22s | %-40s | %-60s | %s" % (
        "Track", "Subfolder", "Filename", "Source Path", "Status"))
    lines.append("-" * 150)

    for track, subfolder, filename, source, status in manifest:
        lines.append("%-12s | %-22s | %-40s | %-60s | %s" % (
            track, subfolder, filename, source, status))

    content = "\n".join(lines) + "\n"

    if dry_run:
        print("\n=== Manifest (dry-run) ===")
        print(content)
    else:
        with open(path, "w") as f:
            f.write(content)
        print("Wrote %s (%d entries)" % (path, len(manifest)))


def main():
    parser = argparse.ArgumentParser(
        description="Organize timeline assets into Premiere-ready folder structure"
    )
    parser.add_argument("timeline", help="Path to Timeline EDL JSON file")
    parser.add_argument("--output", "-o", help="Output directory for organized assets")
    parser.add_argument("--symlink", action="store_true",
                        help="Create relative symlinks instead of copying files")
    parser.add_argument("--base-path", default=".",
                        help="Base path for resolving relative source paths (default: cwd)")
    parser.add_argument("--dry-run", action="store_true",
                        help="Print what would be done without copying files")
    args = parser.parse_args()

    if not args.dry_run and not args.output:
        parser.error("--output is required unless using --dry-run")

    timeline = load_timeline(args.timeline)
    tracks = timeline.get("tracks", {})
    episode_id = timeline.get("episode_id", "unknown")
    output_dir = args.output or ("dry-run-%s" % episode_id)
    base_path = os.path.abspath(args.base_path)

    print("Episode: %s" % episode_id)
    print("Base path: %s" % base_path)
    print("Output: %s" % output_dir)
    print("Mode: %s" % ("symlink" if args.symlink else "copy"))
    if args.dry_run:
        print("DRY RUN - no files will be copied\n")

    # Create folder structure
    if not args.dry_run:
        for folder in FOLDER_STRUCTURE:
            os.makedirs(os.path.join(output_dir, folder), exist_ok=True)

    manifest = []

    # Process each track
    process_track(
        tracks.get("video", []), "Video",
        classify_video_clip, output_dir, base_path,
        args.symlink, args.dry_run, manifest
    )

    process_track(
        tracks.get("voiceover", []), "VO",
        "02-VO", output_dir, base_path,
        args.symlink, args.dry_run, manifest
    )

    # SFX - split by type field
    sfx_clips = tracks.get("sfx", [])
    def sfx_subfolder(clip):
        return "03-SFX/Beds" if clip.get("type") == "bed" else "03-SFX/Events"

    process_track(
        sfx_clips, "SFX",
        sfx_subfolder, output_dir, base_path,
        args.symlink, args.dry_run, manifest
    )

    process_track(
        tracks.get("music", []), "Music",
        "04-Music", output_dir, base_path,
        args.symlink, args.dry_run, manifest
    )

    # Copy BowTie-Grade.cube into 05-Grade/
    grade_candidates = [
        os.path.join(base_path, "projects/004-bowtie-bullies/media/grade/BowTie-Grade.cube"),
        os.path.join(base_path, "BowTie-Grade.cube"),
    ]
    grade_found = False
    for grade_path in grade_candidates:
        if os.path.exists(grade_path):
            if not args.dry_run:
                dst = os.path.join(output_dir, "05-Grade", "BowTie-Grade.cube")
                copy_or_link(grade_path, dst, args.symlink)
            manifest.append(("Grade", "05-Grade", "BowTie-Grade.cube", grade_path, "OK"))
            grade_found = True
            break
    if not grade_found:
        print("WARNING: BowTie-Grade.cube not found (run hald_to_cube.py first)", file=sys.stderr)
        manifest.append(("Grade", "05-Grade", "BowTie-Grade.cube", "NOT FOUND", "MISSING"))

    # Write manifest
    write_manifest(manifest, output_dir, args.dry_run)

    # Summary
    ok_count = sum(1 for _, _, _, _, s in manifest if s == "OK")
    missing_count = sum(1 for _, _, _, _, s in manifest if s == "MISSING")
    error_count = sum(1 for _, _, _, _, s in manifest if s == "ERROR")
    print("\nSummary: %d OK, %d MISSING, %d ERRORS" % (ok_count, missing_count, error_count))


if __name__ == "__main__":
    main()
