#!/usr/bin/env python3
"""check_episode_assets.py -- Check which episode assets are missing on disk.

Usage:
  python scripts/shared/check_episode_assets.py \
    projects/004-bowtie-bullies/episodes/EP-001/EP-001-marathon-continues-timeline.json \
    --base-path /Users/makwa/theinnovativenative
"""
import argparse, os, sys
from pathlib import Path

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from timeline_to_ffmpeg import load_timeline

CATEGORY_ORDER = ["Video stills", "Intro/Outro", "Overlays", "VO audio", "SFX", "Music"]
TRACK_MAP = {"voiceover": "VO audio", "sfx": "SFX", "music": "Music"}


def classify_video(clip):
    cid = clip.get("id", "")
    if "intro" in cid.lower() or "outro" in cid.lower():
        return "Intro/Outro"
    return "Overlays" if clip.get("type") == "remotion_overlay" else "Video stills"


def collect_assets(timeline):
    """Return dict of category -> list of (clip_id, source_path)."""
    cats = {k: [] for k in CATEGORY_ORDER}
    tracks = timeline.get("tracks", {})
    for clip in tracks.get("video", []):
        src = clip.get("source", "")
        if src:
            cats[classify_video(clip)].append((clip["id"], src))
    for track, cat in TRACK_MAP.items():
        for clip in tracks.get(track, []):
            src = clip.get("source", "")
            if src:
                cats[cat].append((clip["id"], src))
    return cats


def check_files(cats, base_path):
    """Return (present, missing) dicts: category -> list of (id, abs_path)."""
    present, missing = ({k: [] for k in cats} for _ in range(2))
    for cat, items in cats.items():
        seen = set()
        for clip_id, src in items:
            full = Path(base_path) / src if not Path(src).is_absolute() else Path(src)
            key = str(full)
            if key in seen:
                continue
            seen.add(key)
            target = present if full.exists() else missing
            target[cat].append((clip_id, key))
    return present, missing


def main():
    ap = argparse.ArgumentParser(description="Check which episode assets exist on disk")
    ap.add_argument("timeline", help="Path to timeline EDL JSON file")
    ap.add_argument("--base-path", default=".",
                    help="Base path for resolving relative sources (default: cwd)")
    args = ap.parse_args()

    tl = load_timeline(args.timeline)
    base = os.path.abspath(args.base_path)
    print("Episode: %s\nBase path: %s\n" % (tl.get("episode_id", "?"), base))

    cats = collect_assets(tl)
    present, missing = check_files(cats, base)

    print("=== Asset Summary ===")
    n_miss_total = 0
    for cat in CATEGORY_ORDER:
        np, nm = len(present[cat]), len(missing[cat])
        print("  %-16s %d/%d present  [%s]" % (cat + ":", np, np + nm,
              "OK" if nm == 0 else "INCOMPLETE"))
        n_miss_total += nm

    if n_miss_total:
        print("\n=== Missing Files (%d) ===" % n_miss_total)
        for cat in CATEGORY_ORDER:
            if not missing[cat]:
                continue
            print("\n  -- %s --" % cat)
            for _, fpath in missing[cat]:
                print("    %s" % fpath)
        print("\nDownload these from Google Drive and place at the paths above.")
        sys.exit(1)
    else:
        print("\nAll assets present. Ready to build.")


if __name__ == "__main__":
    main()
