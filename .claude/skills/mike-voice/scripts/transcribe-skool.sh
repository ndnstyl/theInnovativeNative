#!/bin/bash
# transcribe-skool.sh — Whisper Mike's Skool MP4s into corpus/spoken/skool/
# Idempotent: skips videos whose .txt output already exists.

set -uo pipefail

SKILL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SRC_DIR="/Users/makwa/Movies/skool"
OUT_DIR="$SKILL_DIR/corpus/spoken/skool"
LOG_DIR="$SKILL_DIR/logs"
LOG="$LOG_DIR/transcribe-skool.log"
MODEL="mlx-community/whisper-large-v3-turbo"
MLX_WHISPER="/Users/makwa/Library/Python/3.9/bin/mlx_whisper"

mkdir -p "$OUT_DIR" "$LOG_DIR"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] === Skool transcription batch START ===" | tee -a "$LOG"

if [ ! -x "$MLX_WHISPER" ]; then
  echo "ERROR: mlx_whisper not found at $MLX_WHISPER" | tee -a "$LOG"
  exit 1
fi

total=0
done_count=0
skipped=0
failed=0

for video in "$SRC_DIR"/*.mp4; do
  [ -f "$video" ] || continue
  total=$((total + 1))
  basename=$(basename "$video" .mp4)
  # Sanitize basename (spaces, colons) into safe slug
  slug=$(echo "$basename" | tr ' :' '__')
  out_txt="$OUT_DIR/${slug}.txt"

  if [ -s "$out_txt" ]; then
    echo "[$(date '+%H:%M:%S')] SKIP (already done): $basename" | tee -a "$LOG"
    skipped=$((skipped + 1))
    continue
  fi

  echo "[$(date '+%H:%M:%S')] TRANSCRIBE: $basename" | tee -a "$LOG"
  if "$MLX_WHISPER" "$video" \
       --model "$MODEL" \
       --output-dir "$OUT_DIR" \
       --output-name "$slug" \
       --output-format all \
       --language en \
       --verbose False </dev/null >>"$LOG" 2>&1; then
    echo "[$(date '+%H:%M:%S')] OK: $basename" | tee -a "$LOG"
    done_count=$((done_count + 1))
  else
    echo "[$(date '+%H:%M:%S')] FAIL: $basename" | tee -a "$LOG"
    failed=$((failed + 1))
  fi
done

echo "[$(date '+%Y-%m-%d %H:%M:%S')] === BATCH COMPLETE ===" | tee -a "$LOG"
echo "total=$total done=$done_count skipped=$skipped failed=$failed" | tee -a "$LOG"
