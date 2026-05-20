#!/usr/bin/env python3
"""
hald_to_cube.py — Generate a .cube 3D LUT from FFMPEG eq filter parameters.

Computes the BowTie Bullies color grade mathematically:
  eq=saturation=0.75:contrast=1.15:brightness=-0.03

Approach B (pure math fallback) — no external dependencies.
For Approach A (HALD pipeline), use FFMPEG to grade a HALD identity image
then pass it to this script's --from-hald mode.

Usage:
  python scripts/shared/hald_to_cube.py --output BowTie-Grade.cube
  python scripts/shared/hald_to_cube.py --output BowTie-Grade.cube --size 33 --saturation 0.75 --contrast 1.15 --brightness -0.03
"""

import argparse
import sys


def compute_lut_entry(r, g, b, saturation, contrast, brightness):
    """Apply eq filter math to a single RGB triplet (all values 0-1)."""
    # Compute luma (BT.601)
    y = 0.299 * r + 0.587 * g + 0.114 * b

    # Apply saturation (mix toward/away from luma)
    r1 = y + saturation * (r - y)
    g1 = y + saturation * (g - y)
    b1 = y + saturation * (b - y)

    # Apply contrast (pivot around 0.5)
    r2 = 0.5 + contrast * (r1 - 0.5)
    g2 = 0.5 + contrast * (g1 - 0.5)
    b2 = 0.5 + contrast * (b1 - 0.5)

    # Apply brightness (additive offset)
    r3 = r2 + brightness
    g3 = g2 + brightness
    b3 = b2 + brightness

    # Clamp to [0, 1]
    return (
        max(0.0, min(1.0, r3)),
        max(0.0, min(1.0, g3)),
        max(0.0, min(1.0, b3)),
    )


def generate_cube(size, saturation, contrast, brightness, title):
    """Generate a .cube LUT file as a string."""
    lines = []
    lines.append('TITLE "%s"' % title)
    lines.append("LUT_3D_SIZE %d" % size)
    lines.append("")

    # .cube format: B varies fastest, then G, then R
    for ri in range(size):
        for gi in range(size):
            for bi in range(size):
                r = ri / (size - 1)
                g = gi / (size - 1)
                b = bi / (size - 1)

                ro, go, bo = compute_lut_entry(r, g, b, saturation, contrast, brightness)
                lines.append("%.6f %.6f %.6f" % (ro, go, bo))

    return "\n".join(lines) + "\n"


def main():
    parser = argparse.ArgumentParser(
        description="Generate a .cube 3D LUT from FFMPEG eq filter parameters"
    )
    parser.add_argument("--output", "-o", required=True, help="Output .cube file path")
    parser.add_argument("--size", type=int, default=33, help="LUT grid size (default: 33)")
    parser.add_argument("--saturation", type=float, default=0.75, help="Saturation (default: 0.75)")
    parser.add_argument("--contrast", type=float, default=1.15, help="Contrast (default: 1.15)")
    parser.add_argument("--brightness", type=float, default=-0.03, help="Brightness (default: -0.03)")
    parser.add_argument("--title", default="BowTie Grade", help="LUT title")
    args = parser.parse_args()

    if args.size < 2 or args.size > 65:
        print("Error: LUT size must be between 2 and 65", file=sys.stderr)
        sys.exit(1)

    cube_content = generate_cube(args.size, args.saturation, args.contrast,
                                 args.brightness, args.title)

    with open(args.output, "w") as f:
        f.write(cube_content)

    expected_entries = args.size ** 3
    print("Generated %s: %dx%dx%d = %d entries" % (
        args.output, args.size, args.size, args.size, expected_entries))


if __name__ == "__main__":
    main()
