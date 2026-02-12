# Pattern: BodyCam Video Processing Pipeline

**Category**: ffmpeg
**Source Workflow**: BodyCam Bandits FFmpeg Pipeline - Production
**Source Workflow ID**: fkQsVHSXf6ueTQ2y
**Extracted**: 2026-02-05
**Extracted By**: Neo

---

## Use Case

Multi-stage video processing pipeline that:
1. Downloads videos from various sources using yt-dlp
2. Performs face detection analysis
3. Applies FFmpeg transformations (talking head removal, quality enhancement, silence detection)
4. Generates educational content with AI (Gemini PRO)
5. Adds voice-over with ElevenLabs
6. Integrates all components into final video

Best for: Content repurposing, educational video creation, automated video editing workflows.

---

## Key Nodes

| Node Name | Node Type | Purpose |
|-----------|-----------|---------|
| Webhook Trigger | n8n-nodes-base.webhook | Receives video URLs for processing |
| Download Video with yt-dlp | n8n-nodes-base.executeCommand | Downloads video from URL using yt-dlp |
| Face Detection Analysis | n8n-nodes-base.httpRequest | Analyzes video for face detection |
| FFmpeg Stage 1 - Talking Head Removal | n8n-nodes-base.executeCommand | Removes talking head segments |
| FFmpeg Stage 2 - Quality Enhancement | n8n-nodes-base.executeCommand | Enhances video quality |
| FFmpeg Stage 3a - Silence Detection | n8n-nodes-base.executeCommand | Detects silent segments |
| FFmpeg Stage 3b - Create Educational Pauses | n8n-nodes-base.executeCommand | Creates pause points for content |
| Generate Educational Script with Gemini PRO | n8n-nodes-base.httpRequest | AI generates educational narration |
| Generate Voice-over with ElevenLabs | n8n-nodes-base.httpRequest | Text-to-speech conversion |
| FFmpeg Stage 4 - Voice-over Integration | n8n-nodes-base.executeCommand | Merges voice-over with video |
| Final Video Validation | n8n-nodes-base.executeCommand | Validates final output |
| Cleanup Temporary Files | n8n-nodes-base.executeCommand | Removes temp files |

---

## Configuration

### Required Credentials
- **Supabase**: For video asset tracking and status updates
- **ElevenLabs API**: For voice-over generation
- **Google Gemini API**: For educational script generation

### Environment Variables
- `FFMPEG_PATH`: Path to FFmpeg binary (if not in PATH)
- `YT_DLP_PATH`: Path to yt-dlp binary
- `TEMP_DIR`: Temporary file storage location

### Key Parameters
```json
{
  "ffmpegStage1": {
    "command": "ffmpeg -i input.mp4 -vf \"select='not(gt(scene,0.4))'\" -af aselect -y output_stage1.mp4",
    "description": "Scene detection to remove talking head segments"
  },
  "ffmpegStage2": {
    "command": "ffmpeg -i input.mp4 -vf \"scale=1920:1080,unsharp=5:5:1.0:5:5:0.0\" -c:v libx264 -preset slow -crf 18 output_stage2.mp4",
    "description": "Upscale and sharpen video"
  },
  "silenceDetection": {
    "command": "ffmpeg -i input.mp4 -af silencedetect=n=-50dB:d=0.5 -f null -",
    "description": "Detect silent segments for educational pause insertion"
  }
}
```

---

## Reusable JSON

Copy this JSON snippet to import the core FFmpeg processing nodes:

```json
{
  "nodes": [
    {
      "parameters": {
        "command": "yt-dlp -f 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best' -o '{{ $json.outputPath }}' '{{ $json.videoUrl }}'"
      },
      "name": "Download Video with yt-dlp",
      "type": "n8n-nodes-base.executeCommand",
      "typeVersion": 1
    },
    {
      "parameters": {
        "command": "ffmpeg -i '{{ $json.inputPath }}' -vf \"scale=1920:1080\" -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k '{{ $json.outputPath }}'"
      },
      "name": "FFmpeg Quality Enhancement",
      "type": "n8n-nodes-base.executeCommand",
      "typeVersion": 1
    },
    {
      "parameters": {
        "command": "ffmpeg -i '{{ $json.videoPath }}' -i '{{ $json.audioPath }}' -c:v copy -c:a aac -map 0:v:0 -map 1:a:0 '{{ $json.outputPath }}'"
      },
      "name": "FFmpeg Voice-over Integration",
      "type": "n8n-nodes-base.executeCommand",
      "typeVersion": 1
    }
  ]
}
```

---

## Gotchas

- **FFmpeg must be installed on n8n server**: Use Docker container with FFmpeg or install via package manager
- **yt-dlp cookies**: Some sites require cookies for download - use `--cookies-from-browser chrome`
- **Temporary file cleanup**: Always clean up temp files to avoid disk space issues
- **Video format compatibility**: Ensure input/output formats are compatible across stages
- **Memory usage**: Large videos require significant RAM - process in chunks if needed
- **Rate limits**: ElevenLabs and Gemini have API rate limits - implement backoff

---

## Related Patterns

- [Viral Clipping FFmpeg](./viral-clipping.md) - Shorter clip extraction
- [Instagram Reels Video Editor](../social/instagram-reels-editor.md) - Social media formatting

---

## Changelog

| Date | Change | By |
|------|--------|-----|
| 2026-02-05 | Initial extraction from BodyCam Bandits pipeline | Neo |
