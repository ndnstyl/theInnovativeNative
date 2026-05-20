# Audio Optimization Pattern for UGC Video Pipeline

**Created**: 2026-02-07 | **Source**: Haven B-Roll pipeline Phase 1

## Problem

Music tracks uploaded for video backgrounds are oversized:
- WAV files: 20-50 MB (uncompressed)
- High-bitrate MP3s: 4-10 MB (320kbps)
- Full-length tracks: 2-5 minutes when videos are only 25-35 seconds

This bloats Google Drive storage, slows n8n downloads during assembly, and increases final video file size.

## Solution

Pre-process all music tracks before they enter the pipeline: compress, trim, and pre-fade.

### The Command

```bash
ffmpeg -i input.wav \
  -t 40 \
  -codec:a libmp3lame \
  -b:a 128k \
  -ar 44100 \
  -af "afade=t=in:st=0:d=2,afade=t=out:st=38:d=2" \
  output_optimized.mp3 -y
```

### Parameters Explained

| Parameter | Value | Why |
|-----------|-------|-----|
| `-t 40` | Trim to 40 seconds | Videos are 25-35s; 40s gives 5s buffer for assembly offset |
| `-codec:a libmp3lame` | MP3 encoder | Universal compatibility, small size |
| `-b:a 128k` | 128 kbps bitrate | Sufficient for background music mixed at 40% volume. Inaudible difference from 320k when ducked |
| `-ar 44100` | 44.1kHz sample rate | CD quality, no benefit going higher for background |
| `-af afade=t=in:st=0:d=2` | 2-second fade in | Smooth start, pre-baked so WF-006 doesn't need to handle it |
| `-af afade=t=out:st=38:d=2` | 2-second fade out | Smooth end, pre-baked |
| `-y` | Overwrite without asking | Non-interactive execution |

### Size Impact

| Input | Output | Reduction |
|-------|--------|-----------|
| 26 MB WAV (2:35) | 626 KB MP3 (0:40) | **97.6%** |
| 4.8 MB MP3/320k (2:06) | 626 KB MP3 (0:40) | **87%** |
| 4.3 MB MP3/320k (1:53) | 626 KB MP3 (0:40) | **85%** |

### When to Apply

- **Always** when a user uploads a new music track to the Music folder
- **Before** the track enters any n8n workflow
- Keep both originals and optimized versions (originals for other uses, optimized for pipeline)

### Naming Convention

```
{original-name}-{duration}s-{bitrate}k.mp3
```
Examples:
- `afternoon-coffee-40s-128k.mp3`
- `raspberrymusic-lofi-40s-128k.mp3`

### Integration with WF-006 (FFMPEG Assembler)

WF-006 still applies its own music mixing:
```bash
ffmpeg -i video.mp4 -i music_optimized.mp3 \
  -filter_complex "[1:a]volume=0.4[music];[0:v][music]..." \
  -c:v copy final.mp4
```

Since fade is pre-baked in the optimized file, WF-006 can skip the `afade` filters on the music track. However, keeping them is harmless (double fade just means slightly quieter edges).

### Batch Processing Script

For processing multiple files at once:

```bash
#!/bin/bash
# optimize-music.sh - Batch compress music for UGC pipeline
# Usage: ./optimize-music.sh /path/to/music/folder

INPUT_DIR="${1:-.}"
DURATION="${2:-40}"
BITRATE="${3:-128k}"

for f in "$INPUT_DIR"/*.{wav,mp3,m4a,aac,ogg,flac} 2>/dev/null; do
  [ -f "$f" ] || continue
  base=$(basename "$f" | sed 's/\.[^.]*$//')
  out="$INPUT_DIR/${base}-${DURATION}s-${BITRATE}.mp3"

  # Skip if already optimized
  [[ "$f" == *optimized* ]] && continue
  [[ "$f" == *"${DURATION}s"* ]] && continue

  echo "Processing: $(basename "$f")"
  ffmpeg -i "$f" -t "$DURATION" -codec:a libmp3lame -b:a "$BITRATE" -ar 44100 \
    -af "afade=t=in:st=0:d=2,afade=t=out:st=$((DURATION-2)):d=2" \
    "$out" -y 2>/dev/null

  orig_size=$(du -h "$f" | cut -f1)
  new_size=$(du -h "$out" | cut -f1)
  echo "  $orig_size → $new_size"
done
```

### Quality Notes

- 128kbps is the sweet spot for background music in short-form video
  - Mixed at 40% volume, listeners cannot distinguish 128k from 320k
  - Even 96kbps would work, but 128k gives safety margin
- Pre-baking fades eliminates a filter step in the pipeline
- 40-second duration covers all current video types (B-Roll 25-35s, Talking Head up to 60s would need 65s trim)
- For A-Roll / Talking Head with voice: consider 64kbps for music (voice dominates) or keep 128k for simplicity

### Future: n8n Integration

This could become an n8n workflow triggered on Google Drive folder upload:
1. Webhook: new file in Music folder
2. Download file
3. Execute Command: ffmpeg compress + trim
4. Upload optimized version
5. Delete or archive original

This would fully automate the optimization. For now, it's a manual/local step.

---

*Last updated: 2026-02-07*
