# Deliverable Format Requirements SOP

**Owner**: Drew (Project Manager)
**Purpose**: Define file format requirements by platform to ensure deployability
**Created**: 2026-02-05

---

## Why This Matters

Google Drive doesn't render complex SVG files (external fonts, embedded styles).
Social platforms (LinkedIn, Facebook, Instagram) do NOT support SVG at all.

**Bottom line**: If you create an SVG, it CANNOT be deployed to social media.

---

## Platform Format Requirements

### Social Platforms

| Platform | Images | Video | SVG Support | Notes |
|----------|--------|-------|-------------|-------|
| **LinkedIn** | PNG, JPG | MP4 | NO | Max 5MB images, 200MB video |
| **Facebook** | PNG, JPG | MP4, MOV | NO | Max 8MB images |
| **Instagram** | PNG, JPG | MP4, MOV | NO | Square or 4:5 preferred |
| **TikTok** | PNG, JPG | MP4 | NO | Vertical (9:16) required |
| **YouTube** | PNG, JPG | MP4 | NO | 16:9 aspect ratio |
| **Twitter/X** | PNG, JPG, GIF | MP4 | NO | Max 5MB images |

### Google Drive Preview

| Format | Preview Support | Notes |
|--------|-----------------|-------|
| PNG | Full | Always works |
| JPG | Full | Always works |
| SVG | Partial | Complex SVGs with external fonts/styles don't render |
| MP4 | Full | May take time for large files |
| PDF | Full | Always works |

---

## Export Checklist by Content Type

### Graphics (Pixel)

**MANDATORY: Export as PNG, not SVG**

1. Create in design tool (Figma, Illustrator, etc.)
2. Export as PNG at 144 DPI minimum
3. Verify file size < 5MB for social
4. Test Google Drive preview loads correctly
5. Upload PNG to Drive and update Airtable

### Video (Spike)

**MANDATORY: Export as MP4 with H.264 codec**

1. Render using Remotion or video editor
2. Codec: H.264 (most compatible)
3. Audio: AAC
4. Max file size: 200MB for LinkedIn
5. Test playback before upload

### Documents

| Type | Format | Notes |
|------|--------|-------|
| Reports | PDF | Always converts well |
| Configs | MD or JSON | Plain text, always accessible |
| Presentations | PPTX or PDF | PDF for sharing |

---

## Dimension Quick Reference

### LinkedIn
- Single Image Ad: **1200 x 627px** (1.91:1)
- Carousel Card: **1080 x 1080px** (square)
- Profile Banner: **1128 x 191px**

### Facebook
- Feed Image: **1080 x 1080px** (square) or **1200 x 628px** (landscape)
- Story: **1080 x 1920px** (9:16)
- Carousel: **1080 x 1080px** (square)

### Instagram
- Feed Post: **1080 x 1080px** (square) or **1080 x 1350px** (portrait)
- Story/Reels: **1080 x 1920px** (9:16)
- Carousel: **1080 x 1080px** (square)

### YouTube
- Thumbnail: **1280 x 720px** (16:9)
- Channel Banner: **2560 x 1440px** (safe area: 1546 x 423px)

---

## Conversion Tools

### SVG to PNG (Inkscape CLI)

```bash
# Single file
inkscape input.svg --export-type=png --export-filename=output.png --export-dpi=144

# Batch conversion
for svg in *.svg; do
    png="${svg%.svg}.png"
    inkscape "$svg" --export-type=png --export-filename="$png" --export-dpi=144
done
```

### Alternative: ImageMagick (if Inkscape unavailable)

```bash
convert input.svg output.png
```

### Video Conversion (FFmpeg)

```bash
# Convert to H.264 MP4
ffmpeg -i input.mov -c:v libx264 -c:a aac -preset medium output.mp4
```

---

## Verification Before Marking "Ready"

Before any graphic deliverable is marked "Ready":

1. [ ] Format is PNG or JPG (NOT SVG)
2. [ ] Dimensions match platform requirements
3. [ ] File size within platform limits
4. [ ] Google Drive link loads preview correctly
5. [ ] Tested opening link in incognito browser

Before any video deliverable is marked "Ready":

1. [ ] Format is MP4 with H.264 codec
2. [ ] Audio is AAC
3. [ ] File size within platform limits (200MB max)
4. [ ] Google Drive link plays video correctly
5. [ ] Tested opening link in incognito browser

---

## Historical Context

**2026-02-05 Incident**: 14 SVG graphics created but couldn't be:
- Previewed in Google Drive (complex SVGs with external fonts)
- Deployed to LinkedIn/Facebook/Instagram (no SVG support)

**Resolution**: Converted all SVGs to PNG using Inkscape CLI, re-uploaded to Drive, updated Airtable with working URLs.

**Prevention**: This SOP now mandates PNG export for all social graphics. SVG may be kept as source files but are NOT deployable.

---

*This SOP exists because the SVG format gap of 2026-02-05 taught us that agents need explicit format requirements. Make it checkable, make it deployable.*
