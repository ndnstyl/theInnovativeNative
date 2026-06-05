#!/bin/bash
# banlist-strip.sh — Thin wrapper around banlist-strip.py
# Usage: ./banlist-strip.sh <input-file>   (writes cleaned text to stdout)
#        cat draft.md | ./banlist-strip.sh
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
exec python3 "$DIR/banlist-strip.py" "$@"
