---
name: gdrive-api
description: |
  Google Drive API patterns for n8n workflows. Covers the uc?export=download
  URL pattern, permission sharing, file search queries, and known folder IDs.
  Complements the gdrive-upload skill with API-level reference.
triggers:
  - "google drive api"
  - "drive search"
  - "drive permissions"
  - "drive url"
  - "uc export download"
---

# Google Drive API — n8n Integration Patterns

## Overview

API-level reference for Google Drive operations in n8n workflows. Covers patterns that the native Google Drive node doesn't fully expose, plus the URL formats that downstream tools (Kie.ai, Airtable) require.

---

## URL Patterns

### Direct Download URL (Critical for Kie.ai + Airtable)

```
https://drive.google.com/uc?export=download&id=FILE_ID
```

**Use this when:**
- Passing an image URL to Kie.ai `imageUrls` parameter
- Setting Airtable `multipleAttachments` field values (for thumbnail preview)
- Any tool that needs the raw file bytes, not an HTML page

**Do NOT use:**
- `https://drive.google.com/file/d/FILE_ID/view` — returns HTML wrapper
- `https://drive.google.com/open?id=FILE_ID` — redirects to viewer

### View URL (for humans)
```
https://drive.google.com/file/d/FILE_ID/view
```

### Build Both in Code Node
```javascript
const fileId = $('Upload to Drive').first().json.id;
const publicUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
const viewUrl = `https://drive.google.com/file/d/${fileId}/view`;
```

---

## Permission Sharing

### n8n Google Drive Node — `operation: "share"`

```json
{
  "operation": "share",
  "fileId": "={{ $json.id }}",
  "permissionsUi": {
    "permissionsValues": {
      "role": "reader",
      "type": "anyone"
    }
  }
}
```

**Important:** Use `operation: "share"` — NOT `resource: "permission"`. This is a documented neo-learnings fix that keeps getting rediscovered.

### HTTP Request Fallback (if native node fails)

```
POST https://www.googleapis.com/drive/v3/files/{fileId}/permissions
Authorization: Bearer {token}
Content-Type: application/json

{
  "role": "reader",
  "type": "anyone"
}
```

In n8n:
```json
{
  "authentication": "predefinedCredentialType",
  "nodeCredentialType": "googleDriveOAuth2Api",
  "method": "POST",
  "url": "=https://www.googleapis.com/drive/v3/files/{{ $json.id }}/permissions",
  "sendBody": true,
  "bodyContentType": "json",
  "jsonBody": "{\"role\": \"reader\", \"type\": \"anyone\"}"
}
```

---

## File Search Queries

### n8n Google Drive Node — Search Pattern

```json
{
  "resource": "fileFolder",
  "operation": "search",
  "queryString": "'FOLDER_ID' in parents and (mimeType contains 'image/')",
  "returnAll": true,
  "options": {
    "fields": ["id", "name", "webContentLink", "mimeType"]
  }
}
```

**Critical:** Use `resource: "fileFolder"` + `operation: "search"` — NOT `operation: "list"`. The list operation doesn't support query strings. This is documented in neo-learnings but agents keep re-learning it.

### Common Query Strings

```
// All images in a folder
'FOLDER_ID' in parents and (mimeType contains 'image/')

// All videos in a folder
'FOLDER_ID' in parents and mimeType = 'video/mp4'

// Files by name pattern
name contains 'scene_1' and 'FOLDER_ID' in parents

// Non-trashed files only
'FOLDER_ID' in parents and trashed = false
```

---

## Known Folder IDs

| Folder | ID | Project | Purpose |
|--------|----|---------|---------|
| Generated Assets | `1u0g-Yg2-RKr-EhuqKTJ7Yl8ywtJHwrWW` | Haven | Image + video clip uploads |
| Reference Images | `1aURPY12WofNfKH2LK2ykqS7sVVcj0-UZ` | Haven | Character reference images |
| BowTie Bullies Root | `1JVHhmZLK3Rv2pK3W4ZlfYkF6xdeW1a2p` | BowTie | TIN Marketing subfolder |
| Character References | `1gaXKQsJgurac7d7OhZdFzBVy-yrqPGhc` | BowTie | Red Nose reference images |
| Generated Poses | `1uZUZYqv0HKNuxRQztS80g0XWMW1nIce8` | BowTie | AI-generated character poses |

---

## n8n Credential

| Credential | ID | Type |
|------------|----|------|
| Google Drive OAuth | `53ssDoT9mG1Dtejj` | `googleDriveOAuth2Api` |

---

## Reading Drive Files as JSON (Code Node Workaround)

When you need to read a Drive file's content as JSON in a Code node, use an HTTP Request node with Drive OAuth:

```json
{
  "authentication": "predefinedCredentialType",
  "nodeCredentialType": "googleDriveOAuth2Api",
  "url": "https://www.googleapis.com/drive/v3/files/FILE_ID?alt=media"
}
```

Returns parsed JSON directly — no binary handling needed.

---

## Binary Data Gotchas in n8n

When downloading files from Drive in `binaryDataMode: "database"`:

- `$binary.data.data` is a **reference ID** (e.g., `"database:fileId"`), not base64
- Use `this.helpers.getBinaryDataBuffer(itemIndex, 'data')` in Code v2 nodes to get actual bytes
- To save to disk: `require('fs').writeFileSync('/tmp/file.png', buffer)` (requires `NODE_FUNCTION_ALLOW_BUILTIN=*`)
- `readWriteFile` node is restricted to `~/.n8n-files` — use `fs.writeFileSync()` for `/tmp`

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "File not found" on download URL | File sharing not set to "Anyone with the link" |
| Airtable attachment shows no preview | Use `uc?export=download` URL format, not view URL |
| Search returns empty | Use `resource: "fileFolder"` + `operation: "search"`, not `list` |
| Permission create fails in native node | Use `operation: "share"` not `resource: "permission"` |
| Binary data is 6 bytes | You're in database mode — use `getBinaryDataBuffer()` |

---

## Related Skills

- **Google Drive Upload** (`infrastructure/gdrive-upload`) — Upload script and folder structure
- **Kie.ai** (`infrastructure/kie-ai`) — Requires `uc?export=download` URLs for image inputs
- **Airtable API** (`infrastructure/airtable-api`) — `multipleAttachments` field needs download URLs
