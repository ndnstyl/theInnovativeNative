#!/usr/bin/env python3
"""
BowTie Compositor — Overlay canonical Tyrone PNGs onto background plates.

Usage:
    python bowtie_compositor.py --bg plate.png --character tyrone.png --angle wide --output composite.png
    python bowtie_compositor.py --batch-dir ./scenes --character-dir ./canonicalCharacter --output-dir ./composites

Angles:
    wide     (bg-c): Tyrone at 25-30% frame height, lower-third, rule-of-thirds
    primary  (bg-a): Tyrone at 55-65% frame height, center or rule-of-thirds offset
    close-up (bg-b): Tyrone at 80-90% frame height, upper body crop, center frame

Output: 1920x1080 PNG
"""

import argparse
import os
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("ERROR: Pillow required. Install with: pip install Pillow", file=sys.stderr)
    sys.exit(1)


# ── Output dimensions ──
FRAME_W = 1920
FRAME_H = 1080

# ── Pose profiles: per-pose adjustments for aspect ratio / visual weight ──
# scale_factor: multiplier on base angle scale (1.0 = use angle default)
# x_offset_pct: horizontal offset from default position (-1.0 to 1.0, fraction of frame)
# crop_top_pct: for close-up, how much to crop from top of character (0.0 = no crop)
# anchor: 'center', 'left_third', 'right_third' — horizontal anchor point
POSE_PROFILES = {
    "P1": {  # Standing, arms by side — tall, narrow
        "scale_factor": 1.0,
        "x_offset_pct": 0.0,
        "crop_top_pct": 0.0,
        "anchor": "right_third",
        "file": "tyroneStanding_armsBySide_transparent.png",
    },
    "P2": {  # Standing, arms crossed — slightly wider
        "scale_factor": 0.95,
        "x_offset_pct": 0.0,
        "crop_top_pct": 0.0,
        "anchor": "center",
        "file": "tyrone_Standing_armsCrossed_transparent.png",
    },
    "P3": {  # Full body, frontal
        "scale_factor": 1.0,
        "x_offset_pct": 0.0,
        "crop_top_pct": 0.0,
        "anchor": "center",
        "file": "tyroneFullBody_frontal_transparent.png",
    },
    "P4": {  # Quarter turn — good for silhouette/rooftop
        "scale_factor": 1.0,
        "x_offset_pct": 0.05,
        "crop_top_pct": 0.0,
        "anchor": "left_third",
        "file": "tyroneFullBody_quarterTurn_transparent.png",
    },
    "P5": {  # Flexing biceps — wider pose
        "scale_factor": 0.90,
        "x_offset_pct": 0.0,
        "crop_top_pct": 0.0,
        "anchor": "center",
        "file": "tyrone_flexing_biceps_transparent.png",
    },
    "P6": {  # Crouching — shorter, wider
        "scale_factor": 1.1,
        "x_offset_pct": 0.0,
        "crop_top_pct": 0.0,
        "anchor": "right_third",
        "file": "tyrone_crouching_transparent.png",
    },
}

# ── Angle configs ──
ANGLE_CONFIGS = {
    "wide": {
        "target_height_pct": 0.27,   # 25-30% of frame height
        "vertical_anchor": "bottom",  # Feet near bottom
        "bottom_margin_pct": 0.03,    # 3% margin from bottom
    },
    "primary": {
        "target_height_pct": 0.60,   # 55-65% of frame height
        "vertical_anchor": "bottom",
        "bottom_margin_pct": 0.02,
    },
    "close-up": {
        "target_height_pct": 0.85,   # 80-90% of frame height
        "vertical_anchor": "center",  # Center vertically
        "crop_to_upper_body": True,   # Crop to head + shoulders
        "upper_body_pct": 0.45,       # Top 45% of character = head + shoulders
    },
}

# ── Variant ID to angle mapping ──
VARIANT_TO_ANGLE = {
    "bg-a": "primary",
    "bg-b": "close-up",
    "bg-c": "wide",
    "bg": "primary",  # Legacy single-variant fallback
}


def get_anchor_x(anchor: str, char_w: int) -> int:
    """Calculate x position based on anchor point."""
    if anchor == "left_third":
        return int(FRAME_W * 0.25 - char_w / 2)
    elif anchor == "right_third":
        return int(FRAME_W * 0.70 - char_w / 2)
    else:  # center
        return int((FRAME_W - char_w) / 2)


def crop_upper_body(char_img: Image.Image, upper_body_pct: float) -> Image.Image:
    """Crop character to upper body (head + shoulders)."""
    crop_h = int(char_img.height * upper_body_pct)
    return char_img.crop((0, 0, char_img.width, crop_h))


def composite(
    bg_path: str,
    char_path: str,
    angle: str,
    pose: str = "P1",
    output_path: str = "composite.png",
) -> str:
    """
    Composite a canonical character PNG onto a background plate.

    Args:
        bg_path: Path to background plate image
        char_path: Path to character PNG (must have alpha channel)
        angle: One of 'wide', 'primary', 'close-up'
        pose: Pose variant key (P1-P6) for per-pose adjustments
        output_path: Output file path

    Returns:
        Output file path
    """
    # Load images
    bg = Image.open(bg_path).convert("RGBA")
    char_img = Image.open(char_path).convert("RGBA")

    # Resize background to frame dimensions
    bg = bg.resize((FRAME_W, FRAME_H), Image.LANCZOS)

    # Get configs
    angle_cfg = ANGLE_CONFIGS.get(angle, ANGLE_CONFIGS["primary"])
    pose_cfg = POSE_PROFILES.get(pose, POSE_PROFILES["P1"])

    # Close-up: crop to upper body before scaling
    if angle_cfg.get("crop_to_upper_body"):
        upper_pct = angle_cfg.get("upper_body_pct", 0.45)
        char_img = crop_upper_body(char_img, upper_pct)

    # Calculate target height with pose adjustment
    target_h = int(FRAME_H * angle_cfg["target_height_pct"] * pose_cfg["scale_factor"])

    # Scale character maintaining aspect ratio
    aspect = char_img.width / char_img.height
    new_h = target_h
    new_w = int(new_h * aspect)

    # Clamp width to frame
    if new_w > FRAME_W * 0.9:
        new_w = int(FRAME_W * 0.9)
        new_h = int(new_w / aspect)

    char_img = char_img.resize((new_w, new_h), Image.LANCZOS)

    # Calculate position
    anchor = pose_cfg.get("anchor", "center")
    x = get_anchor_x(anchor, new_w)

    # Apply horizontal offset
    x += int(FRAME_W * pose_cfg.get("x_offset_pct", 0.0))

    # Clamp x to frame bounds
    x = max(0, min(x, FRAME_W - new_w))

    # Vertical positioning
    if angle_cfg.get("vertical_anchor") == "center":
        y = int((FRAME_H - new_h) / 2)
    else:  # bottom
        margin = int(FRAME_H * angle_cfg.get("bottom_margin_pct", 0.02))
        y = FRAME_H - new_h - margin

    # Composite
    result = bg.copy()
    result.paste(char_img, (x, y), char_img)

    # Save
    os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)
    result.save(output_path, "PNG")
    print(f"  -> {output_path} ({FRAME_W}x{FRAME_H}, angle={angle}, pose={pose})")
    return output_path


def batch_composite(
    bg_dir: str,
    char_dir: str,
    output_dir: str,
):
    """
    Batch composite all bg plates in a directory.

    Expects bg plate filenames like: scene-001-bg-a.png, scene-003-bg-c.png
    Looks up pose from filename pattern or defaults to P1.
    """
    bg_path = Path(bg_dir)
    char_path = Path(char_dir)
    out_path = Path(output_dir)
    out_path.mkdir(parents=True, exist_ok=True)

    processed = 0
    errors = []

    for bg_file in sorted(bg_path.glob("scene-*-bg-*.png")):
        name = bg_file.stem  # e.g. scene-001-bg-a
        parts = name.split("-")

        # Extract variant_id (last two parts joined: bg-a, bg-b, bg-c)
        if len(parts) >= 4:
            variant_id = f"{parts[-2]}-{parts[-1]}"
        else:
            variant_id = "bg-a"

        angle = VARIANT_TO_ANGLE.get(variant_id, "primary")

        # Try to find matching pose from a manifest or default to P1
        # In production, this would read from Airtable
        pose = "P1"

        # Find character PNG for pose
        pose_cfg = POSE_PROFILES.get(pose, POSE_PROFILES["P1"])
        char_file = char_path / pose_cfg["file"]

        if not char_file.exists():
            errors.append(f"Missing character file: {char_file}")
            continue

        output_file = out_path / f"{name}-composite.png"

        try:
            composite(
                bg_path=str(bg_file),
                char_path=str(char_file),
                angle=angle,
                pose=pose,
                output_path=str(output_file),
            )
            processed += 1
        except Exception as e:
            errors.append(f"{bg_file.name}: {e}")

    print(f"\nBatch complete: {processed} composites created")
    if errors:
        print(f"Errors ({len(errors)}):")
        for err in errors:
            print(f"  - {err}")


def main():
    parser = argparse.ArgumentParser(
        description="BowTie Compositor — overlay Tyrone onto bg plates"
    )
    subparsers = parser.add_subparsers(dest="command", help="Command")

    # Single composite
    single = subparsers.add_parser("single", help="Composite a single image")
    single.add_argument("--bg", required=True, help="Background plate path")
    single.add_argument("--character", required=True, help="Character PNG path")
    single.add_argument(
        "--angle",
        required=True,
        choices=["wide", "primary", "close-up"],
        help="Camera angle",
    )
    single.add_argument("--pose", default="P1", choices=list(POSE_PROFILES.keys()))
    single.add_argument("--output", default="composite.png", help="Output path")

    # Batch composite
    batch = subparsers.add_parser("batch", help="Batch composite a directory")
    batch.add_argument("--bg-dir", required=True, help="Directory of bg plates")
    batch.add_argument(
        "--character-dir", required=True, help="Directory of character PNGs"
    )
    batch.add_argument("--output-dir", required=True, help="Output directory")

    # Test mode: generate 9 test composites (3 poses x 3 angles)
    test = subparsers.add_parser(
        "test", help="Generate 9 test composites (3 poses x 3 angles)"
    )
    test.add_argument("--bg", required=True, help="Background plate to use for all tests")
    test.add_argument(
        "--character-dir", required=True, help="Directory of character PNGs"
    )
    test.add_argument("--output-dir", default="output/compositor-test")

    args = parser.parse_args()

    if args.command == "single":
        composite(
            bg_path=args.bg,
            char_path=args.character,
            angle=args.angle,
            pose=args.pose,
            output_path=args.output,
        )

    elif args.command == "batch":
        batch_composite(
            bg_dir=args.bg_dir,
            char_dir=args.character_dir,
            output_dir=args.output_dir,
        )

    elif args.command == "test":
        test_poses = ["P1", "P4", "P6"]
        test_angles = ["wide", "primary", "close-up"]
        out_dir = Path(args.output_dir)
        out_dir.mkdir(parents=True, exist_ok=True)
        char_dir = Path(args.character_dir)

        print(f"Generating {len(test_poses) * len(test_angles)} test composites...")
        for pose in test_poses:
            pose_cfg = POSE_PROFILES[pose]
            char_file = char_dir / pose_cfg["file"]
            if not char_file.exists():
                print(f"  SKIP {pose}: {char_file} not found")
                continue
            for angle in test_angles:
                output_file = out_dir / f"test-{pose}-{angle}.png"
                composite(
                    bg_path=args.bg,
                    char_path=str(char_file),
                    angle=angle,
                    pose=pose,
                    output_path=str(output_file),
                )
        print("Test complete.")

    else:
        parser.print_help()


if __name__ == "__main__":
    main()
