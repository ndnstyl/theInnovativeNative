# Transcribe YouTube Skill

Use this skill to transcribe YouTube videos with timestamps for marketing content extraction, competitor analysis, and skill documentation.

## When to Use

- Extracting knowledge from marketing tutorials/courses
- Analyzing competitor content strategies
- Creating skill documentation from expert videos
- Building swipe files from successful ad examples
- Documenting frameworks and methodologies

## Prerequisites

- `yt-dlp` installed (`pip install yt-dlp`)
- Chrome browser with YouTube access (for cookie authentication)

## Workflow

### Step 1: Extract Subtitles

```bash
yt-dlp --cookies-from-browser chrome \
  --write-auto-sub \
  --skip-download \
  --sub-format vtt \
  --sub-lang en \
  -o "/tmp/youtube_transcript" \
  "YOUTUBE_URL"
```

### Step 2: Get Video Metadata

```bash
yt-dlp --cookies-from-browser chrome \
  --get-title \
  --get-duration \
  --get-description \
  "YOUTUBE_URL" 2>/dev/null
```

### Step 3: Clean VTT to Readable Transcript

Use this Python script to convert the raw VTT file to a clean, timestamped transcript:

```python
import re
from collections import OrderedDict

# Read VTT
with open('/tmp/youtube_transcript.en.vtt', 'r') as f:
    content = f.read()

# Split into cue blocks
blocks = re.split(r'\n\n+', content)

# Extract text from each block
texts = []
current_time = "0:00"

for block in blocks:
    lines = block.strip().split('\n')
    for line in lines:
        match = re.match(r'^(\d{2}):(\d{2}):(\d{2})\.\d+\s*-->', line)
        if match:
            h, m, s = int(match.group(1)), int(match.group(2)), int(match.group(3))
            current_time = f"{h}:{m:02d}:{s:02d}" if h > 0 else f"{m}:{s:02d}"

    for line in lines:
        if '-->' in line or line.startswith(('WEBVTT', 'Kind:', 'Language:')):
            continue
        clean = re.sub(r'<[^>]+>', '', line).strip()
        if clean and 'align:' not in clean:
            texts.append((current_time, clean))

# Deduplicate
seen = set()
unique = []
for time, text in texts:
    if text not in seen and len(text) > 3:
        seen.add(text)
        unique.append((time, text))

# Group by minute
minutes = OrderedDict()
for time, text in unique:
    parts = time.split(':')
    minute_key = f"{parts[0]}:{parts[1]}" if len(parts) == 3 else parts[0]

    if minute_key not in minutes:
        minutes[minute_key] = {"time": time, "texts": []}
    minutes[minute_key]["texts"].append(text)

# Output
output_lines = []
for minute_key, data in minutes.items():
    combined = ' '.join(data["texts"])
    combined = re.sub(r'\s+', ' ', combined).strip()
    output_lines.append(f"[{data['time']}] {combined}")

with open('/tmp/transcript_clean.txt', 'w') as f:
    f.write('\n\n'.join(output_lines))

print(f"Created {len(output_lines)} minute-blocks")
```

### Step 4: Create Visual Timestamps Document

After cleaning the transcript, create a visual timestamps guide with:

1. **Section headers** - Major topic breaks
2. **Timestamp tables** - Time, visual description, topic
3. **Key frameworks** - Diagrams/concepts to screenshot
4. **Swipe file notes** - Headlines, hooks, CTAs to capture

## Output Files

For each transcription, create:

1. `{topic}-transcript.txt` - Full cleaned transcript with timestamps
2. `{topic}-visual-timestamps.md` - Guide for grabbing screenshots
3. `{topic}-learnings.md` - Key takeaways and frameworks extracted

## Storage Location

Save all marketing transcriptions to:
```
.claude/skills/marketing/transcriptions/
```

## Troubleshooting

### Bot Detection Error
If you see "Sign in to confirm you're not a bot", use browser cookies:
```bash
yt-dlp --cookies-from-browser chrome ...
```

### No Subtitles Available
Some videos don't have auto-generated captions. Check:
```bash
yt-dlp --list-subs "YOUTUBE_URL"
```

### Large File Size
For long videos, the VTT file may exceed 256KB. Use the Python cleaning script which consolidates by minute.

## Example Output Structure

```
.claude/skills/marketing/
├── transcribe-youtube.md (this file)
├── learnings.md (marketing skill learnings)
└── transcriptions/
    └── fb-ads-sabri-suby/
        ├── transcript.txt
        ├── visual-timestamps.md
        └── learnings.md
```

## Integration with Other Skills

- **pptx-generator**: Use visual timestamps to create presentation decks
- **brand-voice-generator**: Extract tone/voice patterns from expert content
- **skill-creator**: Build new skills from transcribed expertise
