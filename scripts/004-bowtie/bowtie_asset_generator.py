#!/usr/bin/env python3
"""
BowTie Bullies — Batch Asset Generator

Reads prompts from the B-roll prompt library and pose variants,
then dispatches them to n8n webhook endpoints for Gemini image generation.

This script is a batch orchestrator/dispatcher. It does NOT call Gemini directly.
It sends payloads to n8n webhook endpoints which handle the actual generation.

Usage:
    python bowtie_asset_generator.py broll --ids BR-01 BR-05
    python bowtie_asset_generator.py broll --category character
    python bowtie_asset_generator.py broll --episode "EP 03"
    python bowtie_asset_generator.py broll --mood surveillance
    python bowtie_asset_generator.py poses --ids P1 P3-A P6-V
    python bowtie_asset_generator.py poses --all
    python bowtie_asset_generator.py thumbnail --episode EP-001 --title "The Blacklist" --types hook authority
    python bowtie_asset_generator.py broll --category character --dry-run
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
from pathlib import Path
from typing import Dict, List, Optional

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

N8N_BASE_URL = os.environ.get("N8N_WEBHOOK_BASE_URL", "http://localhost:5678")

WEBHOOK_ENDPOINTS = {
    "broll": f"{N8N_BASE_URL}/webhook/bowtie-broll-generator",
    "pose": f"{N8N_BASE_URL}/webhook/bowtie-pose-generator",
    "thumbnail": f"{N8N_BASE_URL}/webhook/bowtie-thumbnail-generator",
}

DEFAULT_DELAY = 3  # seconds between webhook calls

# Project root is one level up from scripts/
PROJECT_ROOT = Path(__file__).resolve().parent.parent

BROLL_LIBRARY_PATH = PROJECT_ROOT / "deliverables" / "004-faceless-ai-brand" / "broll-prompt-library.md"
POSE_VARIANTS_PATH = PROJECT_ROOT / "deliverables" / "004-faceless-ai-brand" / "pose-variants.md"

# Category ranges (BR-XX inclusive)
CATEGORIES = {
    "character": (1, 12),
    "urban": (13, 27),
    "tech": (28, 39),
    "pov": (40, 47),
    "weather": (48, 55),
    "survival": (56, 63),
}

# Standard negative prompt used as fallback for [Standard negative] markers
STANDARD_NEGATIVE = (
    "human face, cartoon, anime, bright colors, neon, saturated, cheerful, "
    "suburban, clean corporate, stock photo, illustration, 3D render, "
    "watermark, text, logo, signature, blurry, low quality"
)


# ---------------------------------------------------------------------------
# Parsing helpers
# ---------------------------------------------------------------------------

def parse_broll_library(filepath: Path) -> list[dict]:
    """Parse the B-roll prompt library markdown and return a list of prompt dicts."""
    text = filepath.read_text(encoding="utf-8")

    # Split on BR-XX headings
    # Pattern: ### BR-XX — Title
    prompt_blocks = re.split(r"(?=^### BR-\d{2}\s*—)", text, flags=re.MULTILINE)

    prompts = []
    for block in prompt_blocks:
        # Extract prompt ID
        id_match = re.match(r"### (BR-\d{2})\s*—\s*(.+)", block.strip())
        if not id_match:
            continue

        prompt_id = id_match.group(1)
        prompt_title = id_match.group(2).strip()

        # Extract the generation prompt from the first code block
        code_blocks = re.findall(r"```\n(.*?)```", block, re.DOTALL)
        if not code_blocks:
            continue
        prompt_text = code_blocks[0].strip()

        # Extract negative prompt
        neg_match = re.search(
            r"\*\*Negative prompt:\*\*\s*(.+?)(?=\n\*\*|\n---|\Z)",
            block, re.DOTALL
        )
        if neg_match:
            neg_text = neg_match.group(1).strip()
            if neg_text == "[Standard negative]":
                neg_text = STANDARD_NEGATIVE
        else:
            neg_text = STANDARD_NEGATIVE

        # Extract episode tags
        ep_match = re.search(r"\*\*Episode tags:\*\*\s*(.+)", block)
        episode_tags = ep_match.group(1).strip() if ep_match else ""

        # Extract content pillar
        pillar_match = re.search(r"\*\*Content pillar:\*\*\s*(.+)", block)
        content_pillar = pillar_match.group(1).strip() if pillar_match else ""

        # Extract mood
        mood_match = re.search(r"\*\*Mood:\*\*\s*(.+)", block)
        mood = mood_match.group(1).strip() if mood_match else ""

        # Extract aspect ratio
        ar_match = re.search(r"\*\*Aspect ratio:\*\*\s*(.+)", block)
        aspect_ratios_raw = ar_match.group(1).strip() if ar_match else "16:9"
        aspect_ratios = [a.strip() for a in aspect_ratios_raw.split(",")]

        # Extract recommended platform
        plat_match = re.search(r"\*\*Recommended platform:\*\*\s*(.+)", block)
        recommended_platform = plat_match.group(1).strip() if plat_match else ""

        prompts.append({
            "prompt_id": prompt_id,
            "title": prompt_title,
            "prompt_text": prompt_text,
            "negative_prompt": neg_text,
            "episode_tags": episode_tags,
            "content_pillar": content_pillar,
            "mood": mood,
            "aspect_ratios": aspect_ratios,
            "recommended_platform": recommended_platform,
        })

    return prompts


def parse_pose_variants(filepath: Path) -> list[dict]:
    """Parse the pose variants markdown and return a list of pose dicts.

    The file has two structural patterns:
    - Section headings: ### P3 — The Companion (16:9 Landscape)
      with sub-variant headings: #### P3-A: Title
    - Standalone headings: ### P1-V — The Watch (9:16 Vertical)
      with code block directly following

    We want to capture each individual prompt (sub-variants and standalone).
    """
    text = filepath.read_text(encoding="utf-8")
    poses = []

    # Strategy: find all #### sub-headings first (these are the P3-A, P3-B, P6-A style),
    # then find ### headings that directly contain a code block (P1-V, P2-V style).
    # We avoid matching ### section headings like "### P3 — ..." that are just containers.

    # Pattern for #### sub-variant headings (P3-A, P3-B, P3-C, P6-A, P6-B, P6-C)
    subvariant_pattern = re.compile(
        r"####\s+(P\d[A-Z0-9\-]*)\s*:\s*(.+?)\n"        # #### P3-A: Title
        r".*?"                                              # stuff between
        r"```\n(.*?)```"                                    # code block
        r".*?"                                              # stuff between
        r"\*\*Negative prompt:\*\*\s*(.+?)(?=\n(?:#{3,4}|\n---|\Z))",
        re.DOTALL
    )

    for match in subvariant_pattern.finditer(text):
        pose_id = match.group(1).strip()
        pose_title = match.group(2).strip()
        prompt_text = match.group(3).strip()
        neg_text = match.group(4).strip()

        orientation = "9:16" if ("9:16" in pose_title or pose_id.endswith("-V")) else "16:9"

        poses.append({
            "pose_id": pose_id,
            "title": pose_title,
            "prompt_text": prompt_text,
            "negative_prompt": neg_text,
            "orientation": orientation,
        })

    # Track which spans are already covered by sub-variants
    covered_spans = {(m.start(), m.end()) for m in subvariant_pattern.finditer(text)}

    # Pattern for ### standalone headings (P1-V, P2-V, P3-V, P4-V, P5-V, P6-V)
    standalone_pattern = re.compile(
        r"###\s+(P\d[A-Z0-9\-]*)\s*—\s*(.+?)\n"         # ### P1-V — Title
        r".*?"                                              # stuff between
        r"```\n(.*?)```"                                    # code block
        r".*?"                                              # stuff between
        r"\*\*Negative prompt:\*\*\s*(.+?)(?=\n(?:#{3,4}|\n---|\Z))",
        re.DOTALL
    )

    for match in standalone_pattern.finditer(text):
        # Skip if this match's code block overlaps with a sub-variant match
        # (i.e. this is a container heading like ### P3 — whose code block
        # belongs to #### P3-A)
        pose_id = match.group(1).strip()

        # Container headings like "P3" or "P6" (without suffix) that have
        # #### sub-headings should be skipped
        has_subvariants = any(
            p["pose_id"].startswith(pose_id + "-") and not p["pose_id"].endswith("-V")
            for p in poses
        )
        if has_subvariants:
            continue

        pose_title = match.group(2).strip()
        prompt_text = match.group(3).strip()
        neg_text = match.group(4).strip()

        orientation = "9:16" if ("9:16" in pose_title or pose_id.endswith("-V")) else "16:9"

        poses.append({
            "pose_id": pose_id,
            "title": pose_title,
            "prompt_text": prompt_text,
            "negative_prompt": neg_text,
            "orientation": orientation,
        })

    # Sort by pose ID for consistent ordering
    def pose_sort_key(p):
        pid = p["pose_id"]
        # Extract numeric part and suffix for sorting
        m = re.match(r"P(\d)(-.*)?", pid)
        if m:
            return (int(m.group(1)), m.group(2) or "")
        return (99, pid)

    poses.sort(key=pose_sort_key)
    return poses


# ---------------------------------------------------------------------------
# Filtering
# ---------------------------------------------------------------------------

def filter_broll_by_ids(prompts: list[dict], ids: list[str]) -> list[dict]:
    """Filter B-roll prompts by specific IDs."""
    id_set = {i.upper() for i in ids}
    return [p for p in prompts if p["prompt_id"] in id_set]


def filter_broll_by_category(prompts: list[dict], category: str) -> list[dict]:
    """Filter B-roll prompts by category name."""
    cat = category.lower()
    if cat not in CATEGORIES:
        print(f"Error: Unknown category '{category}'.")
        print(f"Available categories: {', '.join(CATEGORIES.keys())}")
        sys.exit(1)
    start, end = CATEGORIES[cat]
    return [
        p for p in prompts
        if start <= int(p["prompt_id"].replace("BR-", "")) <= end
    ]


def filter_broll_by_episode(prompts: list[dict], episode: str) -> list[dict]:
    """Filter B-roll prompts by episode tag substring match."""
    ep = episode.upper().strip()
    return [p for p in prompts if ep in p["episode_tags"].upper()]


def filter_broll_by_mood(prompts: list[dict], mood: str) -> list[dict]:
    """Filter B-roll prompts by mood substring match (case-insensitive)."""
    m = mood.lower().strip()
    return [p for p in prompts if m in p["mood"].lower()]


def filter_broll_by_aspect(prompts: list[dict], aspect: str) -> list[dict]:
    """Filter B-roll prompts to only those supporting a given aspect ratio."""
    return [p for p in prompts if aspect in p["aspect_ratios"]]


def filter_poses_by_ids(poses: list[dict], ids: list[str]) -> list[dict]:
    """Filter poses by ID. Accepts base IDs like P3 (matches P3-A, P3-B, P3-C, P3-V)."""
    result = []
    id_set = {i.upper() for i in ids}
    for pose in poses:
        pid = pose["pose_id"].upper()
        if pid in id_set:
            result.append(pose)
            continue
        # Check if a base ID matches (e.g. P3 matches P3-A, P3-V, etc.)
        for requested in id_set:
            if pid.startswith(requested) and (len(pid) == len(requested) or pid[len(requested)] == "-"):
                result.append(pose)
                break
    return result


def filter_poses_by_orientation(poses: list[dict], orientation: str) -> list[dict]:
    """Filter poses by orientation."""
    return [p for p in poses if p["orientation"] == orientation]


# ---------------------------------------------------------------------------
# Webhook dispatch
# ---------------------------------------------------------------------------

def send_to_webhook(endpoint: str, payload: dict, dry_run: bool = False) -> bool:
    """Send a payload to an n8n webhook endpoint. Returns True on success."""
    if dry_run:
        return True

    try:
        import requests
    except ImportError:
        print("Error: 'requests' library is required. Install with: pip install requests")
        sys.exit(1)

    try:
        resp = requests.post(
            endpoint,
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30,
        )
        return resp.status_code in (200, 201, 202)
    except requests.exceptions.ConnectionError:
        print(f"  Connection error: Could not reach {endpoint}")
        return False
    except requests.exceptions.Timeout:
        print(f"  Timeout: Request to {endpoint} timed out")
        return False
    except Exception as e:
        print(f"  Error: {e}")
        return False


def dispatch_broll(prompts: list[dict], aspect: str | None, delay: int, dry_run: bool):
    """Dispatch B-roll prompts to the webhook."""
    endpoint = WEBHOOK_ENDPOINTS["broll"]
    total = len(prompts)

    if total == 0:
        print("No B-roll prompts matched your filters.")
        return

    success_count = 0
    fail_count = 0

    for i, prompt in enumerate(prompts, 1):
        # If aspect filter, only send for that ratio; otherwise send for each supported ratio
        ratios = [aspect] if aspect else prompt["aspect_ratios"]

        for ratio in ratios:
            payload = {
                "prompt_id": prompt["prompt_id"],
                "title": prompt["title"],
                "prompt_text": prompt["prompt_text"],
                "negative_prompt": prompt["negative_prompt"],
                "episode_tags": prompt["episode_tags"],
                "content_pillar": prompt["content_pillar"],
                "mood": prompt["mood"],
                "aspect_ratio": ratio,
                "recommended_platform": prompt["recommended_platform"],
                "asset_type": "broll",
            }

            label = f"[{i}/{total}] Generating {prompt['prompt_id']} ({ratio})..."

            if dry_run:
                print(f"{label} [DRY RUN]")
                print(f"  Endpoint: {endpoint}")
                print(f"  Payload:")
                print(f"    prompt_id: {payload['prompt_id']}")
                print(f"    title: {payload['title']}")
                print(f"    prompt_text: {payload['prompt_text'][:80]}...")
                print(f"    negative_prompt: {payload['negative_prompt'][:60]}...")
                print(f"    aspect_ratio: {ratio}")
                print(f"    mood: {payload['mood']}")
                print(f"    episode_tags: {payload['episode_tags']}")
                print()
                success_count += 1
            else:
                ok = send_to_webhook(endpoint, payload)
                if ok:
                    print(f"{label} sent to webhook")
                    success_count += 1
                else:
                    print(f"{label} FAILED")
                    fail_count += 1

            # Rate limit delay (skip after last item)
            if not dry_run and (i < total or ratio != ratios[-1]):
                time.sleep(delay)

    print()
    print(f"Generated {success_count} assets.{f' {fail_count} failed.' if fail_count else ''} Check Slack/Airtable for results.")


def dispatch_poses(poses: list[dict], delay: int, dry_run: bool):
    """Dispatch pose prompts to the webhook."""
    endpoint = WEBHOOK_ENDPOINTS["pose"]
    total = len(poses)

    if total == 0:
        print("No pose prompts matched your filters.")
        return

    success_count = 0
    fail_count = 0

    for i, pose in enumerate(poses, 1):
        payload = {
            "pose_id": pose["pose_id"],
            "title": pose["title"],
            "prompt_text": pose["prompt_text"],
            "negative_prompt": pose["negative_prompt"],
            "orientation": pose["orientation"],
            "asset_type": "pose",
        }

        label = f"[{i}/{total}] Generating {pose['pose_id']} ({pose['orientation']})..."

        if dry_run:
            print(f"{label} [DRY RUN]")
            print(f"  Endpoint: {endpoint}")
            print(f"  Payload:")
            print(f"    pose_id: {payload['pose_id']}")
            print(f"    title: {payload['title']}")
            print(f"    prompt_text: {payload['prompt_text'][:80]}...")
            print(f"    negative_prompt: {payload['negative_prompt'][:60]}...")
            print(f"    orientation: {pose['orientation']}")
            print()
            success_count += 1
        else:
            ok = send_to_webhook(endpoint, payload)
            if ok:
                print(f"{label} sent to webhook")
                success_count += 1
            else:
                print(f"{label} FAILED")
                fail_count += 1

        if not dry_run and i < total:
            time.sleep(delay)

    print()
    print(f"Generated {success_count} assets.{f' {fail_count} failed.' if fail_count else ''} Check Slack/Airtable for results.")


def dispatch_thumbnails(episode: str, title: str, types: list[str], delay: int, dry_run: bool):
    """Dispatch thumbnail generation requests to the webhook."""
    endpoint = WEBHOOK_ENDPOINTS["thumbnail"]
    total = len(types)

    if total == 0:
        print("No thumbnail types specified.")
        return

    success_count = 0
    fail_count = 0

    for i, thumb_type in enumerate(types, 1):
        payload = {
            "episode": episode,
            "title": title,
            "thumbnail_type": thumb_type,
            "asset_type": "thumbnail",
        }

        label = f"[{i}/{total}] Generating thumbnail '{thumb_type}' for {episode}..."

        if dry_run:
            print(f"{label} [DRY RUN]")
            print(f"  Endpoint: {endpoint}")
            print(f"  Payload: {json.dumps(payload, indent=4)}")
            print()
            success_count += 1
        else:
            ok = send_to_webhook(endpoint, payload)
            if ok:
                print(f"{label} sent to webhook")
                success_count += 1
            else:
                print(f"{label} FAILED")
                fail_count += 1

        if not dry_run and i < total:
            time.sleep(delay)

    print()
    print(f"Generated {success_count} assets.{f' {fail_count} failed.' if fail_count else ''} Check Slack/Airtable for results.")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="BowTie Bullies batch asset generator. Dispatches prompts to n8n webhooks.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s broll --ids BR-01 BR-05 BR-13
  %(prog)s broll --category character
  %(prog)s broll --category urban --dry-run
  %(prog)s broll --episode "EP 03"
  %(prog)s broll --mood surveillance
  %(prog)s broll --ids BR-01 --aspect "9:16"
  %(prog)s poses --ids P1 P2 P5
  %(prog)s poses --all
  %(prog)s poses --all --orientation "9:16"
  %(prog)s thumbnail --episode EP-001 --title "The Blacklist" --types hook authority
        """,
    )

    subparsers = parser.add_subparsers(dest="command", help="Asset type to generate")

    # --- broll subcommand ---
    broll_parser = subparsers.add_parser("broll", help="Generate B-roll assets")
    broll_filter = broll_parser.add_mutually_exclusive_group(required=True)
    broll_filter.add_argument("--ids", nargs="+", metavar="ID", help="Specific prompt IDs (e.g. BR-01 BR-05)")
    broll_filter.add_argument("--category", type=str, choices=list(CATEGORIES.keys()),
                              help="Category name: character, urban, tech, pov, weather, survival")
    broll_filter.add_argument("--episode", type=str, help="Episode tag to match (e.g. 'EP 03')")
    broll_filter.add_argument("--mood", type=str, help="Mood to match (e.g. 'surveillance')")
    broll_filter.add_argument("--all", action="store_true", help="Generate all B-roll prompts")
    broll_parser.add_argument("--aspect", type=str, choices=["16:9", "9:16"],
                              help="Filter/force a specific aspect ratio")
    broll_parser.add_argument("--delay", type=int, default=DEFAULT_DELAY,
                              help=f"Seconds between webhook calls (default: {DEFAULT_DELAY})")
    broll_parser.add_argument("--dry-run", action="store_true",
                              help="Show what would be generated without calling webhooks")

    # --- poses subcommand ---
    poses_parser = subparsers.add_parser("poses", help="Generate pose assets")
    poses_filter = poses_parser.add_mutually_exclusive_group(required=True)
    poses_filter.add_argument("--ids", nargs="+", metavar="ID", help="Specific pose IDs (e.g. P1 P3-A P6-V)")
    poses_filter.add_argument("--all", action="store_true", help="Generate all pose prompts")
    poses_parser.add_argument("--orientation", type=str, choices=["16:9", "9:16"],
                              help="Filter by orientation")
    poses_parser.add_argument("--delay", type=int, default=DEFAULT_DELAY,
                              help=f"Seconds between webhook calls (default: {DEFAULT_DELAY})")
    poses_parser.add_argument("--dry-run", action="store_true",
                              help="Show what would be generated without calling webhooks")

    # --- thumbnail subcommand ---
    thumb_parser = subparsers.add_parser("thumbnail", help="Generate thumbnail assets")
    thumb_parser.add_argument("--episode", type=str, required=True, help="Episode ID (e.g. EP-001)")
    thumb_parser.add_argument("--title", type=str, required=True, help="Episode title (e.g. 'The Blacklist')")
    thumb_parser.add_argument("--types", nargs="+", required=True, metavar="TYPE",
                              help="Thumbnail types to generate (e.g. hook authority mystery)")
    thumb_parser.add_argument("--delay", type=int, default=DEFAULT_DELAY,
                              help=f"Seconds between webhook calls (default: {DEFAULT_DELAY})")
    thumb_parser.add_argument("--dry-run", action="store_true",
                              help="Show what would be generated without calling webhooks")

    return parser


def main():
    parser = build_parser()
    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(1)

    # --- B-roll ---
    if args.command == "broll":
        if not BROLL_LIBRARY_PATH.exists():
            print(f"Error: B-roll library not found at {BROLL_LIBRARY_PATH}")
            sys.exit(1)

        prompts = parse_broll_library(BROLL_LIBRARY_PATH)
        print(f"Parsed {len(prompts)} B-roll prompts from library.")

        # Apply filters
        if args.ids:
            prompts = filter_broll_by_ids(prompts, args.ids)
        elif args.category:
            prompts = filter_broll_by_category(prompts, args.category)
        elif args.episode:
            prompts = filter_broll_by_episode(prompts, args.episode)
        elif args.mood:
            prompts = filter_broll_by_mood(prompts, args.mood)
        # --all keeps all prompts

        # Optional aspect ratio filter
        if args.aspect:
            prompts = filter_broll_by_aspect(prompts, args.aspect)

        print(f"Matched {len(prompts)} prompts after filtering.")
        print(f"Webhook: {WEBHOOK_ENDPOINTS['broll']}")
        print(f"Delay: {args.delay}s between calls")
        if args.dry_run:
            print("MODE: DRY RUN (no webhooks will be called)")
        print("---")
        print()

        dispatch_broll(prompts, args.aspect, args.delay, args.dry_run)

    # --- Poses ---
    elif args.command == "poses":
        if not POSE_VARIANTS_PATH.exists():
            print(f"Error: Pose variants not found at {POSE_VARIANTS_PATH}")
            sys.exit(1)

        poses = parse_pose_variants(POSE_VARIANTS_PATH)
        print(f"Parsed {len(poses)} pose prompts from library.")

        # Apply filters
        if args.ids:
            poses = filter_poses_by_ids(poses, args.ids)
        # --all keeps all poses

        if args.orientation:
            poses = filter_poses_by_orientation(poses, args.orientation)

        print(f"Matched {len(poses)} poses after filtering.")
        print(f"Webhook: {WEBHOOK_ENDPOINTS['pose']}")
        print(f"Delay: {args.delay}s between calls")
        if args.dry_run:
            print("MODE: DRY RUN (no webhooks will be called)")
        print("---")
        print()

        dispatch_poses(poses, args.delay, args.dry_run)

    # --- Thumbnails ---
    elif args.command == "thumbnail":
        print(f"Generating thumbnails for {args.episode}: {args.title}")
        print(f"Types: {', '.join(args.types)}")
        print(f"Webhook: {WEBHOOK_ENDPOINTS['thumbnail']}")
        print(f"Delay: {args.delay}s between calls")
        if args.dry_run:
            print("MODE: DRY RUN (no webhooks will be called)")
        print("---")
        print()

        dispatch_thumbnails(args.episode, args.title, args.types, args.delay, args.dry_run)


if __name__ == "__main__":
    main()
