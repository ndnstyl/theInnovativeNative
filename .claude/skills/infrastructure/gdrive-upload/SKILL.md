# Google Drive Upload Skill

## Overview

This skill enables agents to upload file deliverables (graphics, videos, documents, configs, etc.) to Google Drive with proper folder organization and shareable links.

---

## When to Use

Use this skill whenever:
- An agent creates a file deliverable (graphic, video, document, config, etc.)
- A deliverable needs to be shared with stakeholders
- Files need to be organized in the TIN Marketing folder structure
- Airtable Deliverables records need a File URL

**Trigger phrases:**
- "Upload to Drive"
- "Create shareable link"
- "Store deliverable"
- "Share this file"

---

## Upload Methods

### Method 1: Python Script (Preferred for Automation)

**Script Location:** `law_firm_RAG/marketing/scripts/upload_to_gdrive.py`

**Usage:**
```bash
cd /Users/makwa/theinnovativenative
python law_firm_RAG/marketing/scripts/upload_to_gdrive.py
```

**What the script does:**
1. Authenticates using credentials from `~/.claude/.mcp.json`
2. Creates folder structure if it doesn't exist
3. Uploads files to appropriate folders
4. Sets permissions to "Anyone with link" (Viewer)
5. Returns JSON with file IDs and shareable links

**Customizing the script:**
- Modify `graphics_dir` and `campaigns_dir` paths for different source locations
- Add new file extensions to the `mime_types` dictionary as needed
- Use `get_or_create_folder()` to create new folder hierarchies

**Python Dependencies:**
```bash
pip install google-api-python-client google-auth google-auth-oauthlib
```

---

### Method 2: Manual Upload

When automation isn't available or for one-off uploads:

1. **Navigate to Google Drive** at https://drive.google.com

2. **Navigate to the correct folder:**
   ```
   TIN Marketing > [Project] > [Month Year] > [Asset Type]
   ```
   Example: `TIN Marketing > Cerebro > February 2026 > Graphics`

3. **Upload the file:**
   - Click "+ New" > "File upload"
   - Or drag and drop the file

4. **Set sharing permissions:**
   - Right-click the uploaded file
   - Select "Share"
   - Click "General access" dropdown
   - Change to "Anyone with the link"
   - Set role to "Viewer"
   - Click "Copy link"

5. **Record the link** for Airtable update

---

### Method 3: Google Drive MCP

**Config Location:** `~/.claude/.mcp.json`

The MCP server configuration contains:
```json
{
  "mcpServers": {
    "google-drive-mcp": {
      "env": {
        "GOOGLE_CLIENT_ID": "...",
        "GOOGLE_CLIENT_SECRET": "...",
        "GOOGLE_REFRESH_TOKEN": "..."
      }
    }
  }
}
```

Use MCP commands when available through Claude's tool interface.

---

## Folder Structure

```
TIN Marketing/
├── Cerebro/
│   └── [Month Year]/
│       ├── Graphics/
│       │   ├── carousel-slide-1.svg
│       │   ├── carousel-slide-2.svg
│       │   └── ...
│       ├── Videos/
│       │   ├── promo-video.mp4
│       │   └── ...
│       ├── Campaign Configs/
│       │   ├── campaign-week-1.md
│       │   └── ...
│       └── Documents/
│           ├── report.pdf
│           └── ...
├── [Other Project]/
│   └── [Month Year]/
│       └── ...
```

**Naming Conventions:**
- **Projects:** Use the project name from `.specify/memory/projects/registry.json`
- **Month folders:** Format as `[Month] [Year]` (e.g., "February 2026")
- **Asset types:** Graphics, Videos, Campaign Configs, Documents
- **Files:** Use lowercase with hyphens (e.g., `carousel-slide-1.svg`)

---

## Airtable Integration

After uploading, update the **Deliverables** table:

| Field | Value |
|-------|-------|
| Name | Descriptive name of the deliverable |
| Project | Link to Project record |
| Task | Link to Task record (if applicable) |
| File URL | Shareable Google Drive link |
| File Type | Graphics / Video / Document / Config |
| Status | Uploaded |
| Upload Date | Today's date |

**Example Airtable update payload:**
```json
{
  "fields": {
    "Name": "Carousel Slide 1 - Sovereignty Theme",
    "Project": ["recXXXXXXXXX"],
    "File URL": "https://drive.google.com/file/d/...",
    "File Type": "Graphics",
    "Status": "Uploaded",
    "Upload Date": "2026-02-05"
  }
}
```

---

## Supported File Types

| Extension | MIME Type | Asset Folder | Deployable to Social? |
|-----------|-----------|--------------|----------------------|
| `.png` | image/png | Graphics | YES - Preferred |
| `.jpg` / `.jpeg` | image/jpeg | Graphics | YES |
| `.svg` | image/svg+xml | Graphics | NO - Source only |
| `.mp4` | video/mp4 | Videos | YES - H.264 required |
| `.pdf` | application/pdf | Documents | N/A |
| `.md` | text/markdown | Campaign Configs / Documents | N/A |
| `.json` | application/json | Campaign Configs | N/A |

---

## Format Verification (MANDATORY BEFORE UPLOAD)

### Graphics
**MUST be PNG or JPG for social deployment. SVG will NOT work.**

| Check | Requirement |
|-------|-------------|
| Format | PNG or JPG (NOT SVG) |
| Size | < 5MB for most platforms |
| Preview | Must render in Google Drive |

**If you have SVG files, convert first:**
```bash
# Convert SVG to PNG using Inkscape CLI
inkscape input.svg --export-type=png --export-filename=output.png --export-dpi=144
```

### Videos
**MUST be MP4 with H.264 codec for social deployment.**

| Check | Requirement |
|-------|-------------|
| Container | MP4 |
| Video codec | H.264 (libx264) |
| Audio codec | AAC |
| Size | < 200MB for LinkedIn |

**If wrong format, convert:**
```bash
ffmpeg -i input.mov -c:v libx264 -c:a aac -preset medium output.mp4
```

See: `.specify/sops/deliverable-format-requirements.md` for full platform specs

---

## Troubleshooting

### Authentication Errors
- Verify `~/.claude/.mcp.json` exists and contains valid credentials
- Check that refresh token hasn't expired
- Ensure `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REFRESH_TOKEN` are set

### Permission Issues
- Verify Google Cloud project has Drive API enabled
- Check OAuth consent screen configuration
- Ensure credentials have `https://www.googleapis.com/auth/drive.file` scope

### Upload Failures
- Check file path exists
- Verify file isn't too large (Google Drive limit: 5TB per file)
- Ensure folder structure exists or script can create it

### Missing Dependencies
```bash
pip install google-api-python-client google-auth google-auth-oauthlib
```

---

## Script Output Format

The upload script returns JSON:
```json
{
  "graphics": [
    {
      "file_id": "1abc...",
      "name": "carousel-slide-1.svg",
      "view_link": "https://drive.google.com/file/d/1abc.../view",
      "download_link": "https://drive.google.com/uc?id=1abc...&export=download"
    }
  ],
  "campaigns": [
    {
      "file_id": "2def...",
      "name": "campaign-week-1.md",
      "view_link": "https://drive.google.com/file/d/2def.../view",
      "download_link": null
    }
  ]
}
```

**Use `view_link`** for sharing with stakeholders (opens in browser).
**Use `download_link`** when direct download is needed.

---

## Integration Checklist

Before uploading:
- [ ] File deliverable is complete and reviewed
- [ ] **Format is deployable**: PNG/JPG for graphics, MP4 (H.264) for video
- [ ] File is named according to conventions
- [ ] Correct project and month folder identified

After uploading:
- [ ] Shareable link generated (Anyone with link = Viewer)
- [ ] **Link tested in incognito browser** - preview must load correctly
- [ ] Airtable Deliverables table updated with File URL
- [ ] Link shared with relevant stakeholders if needed
- [ ] Time entry logged if significant effort

---

## Related Skills

- **Communication Hub** (`infrastructure/communication-hub`): For notifying stakeholders after upload
- **Airtable Integration**: For updating Deliverables table
- **Content Creation Skills**: Source of deliverables to upload
