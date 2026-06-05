#!/usr/bin/env bash
# Usage: render.sh <composition-id> <output-path> <props-json> [duration-frames]
# Example: render.sh TIN-StatCard-16x9 /tmp/stat.mov '{"value":"64%","label":"untracked"}' 180

set -euo pipefail

COMPOSITION="$1"
OUTPUT="$2"
PROPS="$3"
DURATION="${4:-}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REMOTION_DIR="$(cd "${SCRIPT_DIR}/../../remotion-videos" && pwd)"

cd "$REMOTION_DIR"

CMD="npx remotion render src/index.ts \"$COMPOSITION\" \"$OUTPUT\" --codec=prores --prores-profile=4444 --props='$PROPS'"

if [ -n "$DURATION" ]; then
  END_FRAME=$(( DURATION - 1 ))
  CMD="$CMD --frames=0-${END_FRAME}"
fi

eval "$CMD"
