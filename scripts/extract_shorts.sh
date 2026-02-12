#!/bin/bash
# extract_shorts.sh — BowTie Bullies Shorts Extraction
#
# Extracts short clips from a long-form video at specified timestamps,
# re-frames to 9:16, and prepends/appends intro/outro.
#
# Usage:
#   ./scripts/extract_shorts.sh <input_video> <timestamps_json> [output_dir]
#
# Timestamps JSON format:
#   [
#     {"start": "00:02:15", "end": "00:03:05", "title": "the-blacklist-clip1"},
#     {"start": "00:08:30", "end": "00:09:15", "title": "the-blacklist-clip2"}
#   ]

set -euo pipefail

INPUT_VIDEO="${1:?Usage: extract_shorts.sh <input_video> <timestamps_json> [output_dir]}"
TIMESTAMPS_JSON="${2:?Usage: extract_shorts.sh <input_video> <timestamps_json> [output_dir]}"
OUTPUT_DIR="${3:-out/bowtie/shorts}"

# Pre-rendered intro/outro (9:16, 30fps)
INTRO="out/bowtie/intro-9x16.mp4"
OUTRO="out/bowtie/outro-9x16.mp4"

# Color grade filter (from visual-style-guide.md)
COLOR_GRADE="eq=contrast=1.15:brightness=-0.03:saturation=0.75,unsharp=5:5:0.5,noise=alls=20:allf=t+u,vignette=PI/4:1.2"

mkdir -p "$OUTPUT_DIR"

echo "=== BowTie Bullies — Shorts Extraction ==="
echo "Input: $INPUT_VIDEO"
echo "Timestamps: $TIMESTAMPS_JSON"
echo "Output: $OUTPUT_DIR"
echo ""

# Check dependencies
if ! command -v ffmpeg &> /dev/null; then
    echo "ERROR: ffmpeg not found"
    exit 1
fi

if ! command -v jq &> /dev/null; then
    echo "ERROR: jq not found (brew install jq)"
    exit 1
fi

# Check intro/outro exist
if [[ ! -f "$INTRO" ]]; then
    echo "WARNING: Intro not found at $INTRO — shorts will skip intro"
    HAS_INTRO=false
else
    HAS_INTRO=true
fi

if [[ ! -f "$OUTRO" ]]; then
    echo "WARNING: Outro not found at $OUTRO — shorts will skip outro"
    HAS_OUTRO=false
else
    HAS_OUTRO=true
fi

# Parse timestamps and extract clips
CLIP_COUNT=$(jq length "$TIMESTAMPS_JSON")
echo "Extracting $CLIP_COUNT clips..."
echo ""

for i in $(seq 0 $((CLIP_COUNT - 1))); do
    START=$(jq -r ".[$i].start" "$TIMESTAMPS_JSON")
    END=$(jq -r ".[$i].end" "$TIMESTAMPS_JSON")
    TITLE=$(jq -r ".[$i].title" "$TIMESTAMPS_JSON")

    echo "--- Clip $((i+1))/$CLIP_COUNT: $TITLE ($START → $END) ---"

    CLIP_FILE="$OUTPUT_DIR/${TITLE}-raw.mp4"
    FINAL_FILE="$OUTPUT_DIR/${TITLE}.mp4"

    # Step 1: Extract segment and re-frame to 9:16 (center crop)
    # 1920x1080 (16:9) → 607x1080 center crop → scale to 1080x1920 (9:16)
    ffmpeg -y -i "$INPUT_VIDEO" \
        -ss "$START" -to "$END" \
        -vf "crop=ih*9/16:ih,scale=1080:1920,$COLOR_GRADE" \
        -r 30 \
        -c:v libx264 -crf 18 -preset medium \
        -c:a aac -b:a 128k \
        "$CLIP_FILE" 2>/dev/null

    echo "  Extracted: $CLIP_FILE"

    # Step 2: Concatenate intro + clip + outro
    CONCAT_LIST="$OUTPUT_DIR/${TITLE}-concat.txt"
    > "$CONCAT_LIST"

    if $HAS_INTRO; then
        echo "file '$(realpath "$INTRO")'" >> "$CONCAT_LIST"
    fi
    echo "file '$(realpath "$CLIP_FILE")'" >> "$CONCAT_LIST"
    if $HAS_OUTRO; then
        echo "file '$(realpath "$OUTRO")'" >> "$CONCAT_LIST"
    fi

    ffmpeg -y -f concat -safe 0 -i "$CONCAT_LIST" \
        -c:v libx264 -crf 18 -preset medium \
        -c:a aac -b:a 128k \
        "$FINAL_FILE" 2>/dev/null

    echo "  Final: $FINAL_FILE"

    # Cleanup temp files
    rm -f "$CLIP_FILE" "$CONCAT_LIST"

    echo ""
done

echo "=== Done. $CLIP_COUNT shorts extracted to $OUTPUT_DIR ==="
ls -lh "$OUTPUT_DIR"/*.mp4 2>/dev/null || true
