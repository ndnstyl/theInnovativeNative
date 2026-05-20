# Pattern: Crypto Social Distribution (Nano/Banano)

**Category**: social
**Source Workflow**: combine images nanaoBanana
**Source Workflow ID**: YhHMBUnYixL2gce9
**Extracted**: 2026-02-05
**Extracted By**: Neo

---

## Use Case

Social media image creation and distribution pipeline that:
1. Receives image generation request from parent workflow
2. Downloads template/background from Google Drive
3. Generates combined image via AI service
4. Polls for completion and downloads result
5. Uploads final image back to Google Drive

Best for: Social media content automation, batch image generation, branded content creation.

---

## Key Nodes

| Node Name | Node Type | Purpose |
|-----------|-----------|---------|
| When Executed by Another Workflow | n8n-nodes-base.executeWorkflowTrigger | Subflow trigger |
| Get URL | n8n-nodes-base.httpRequest | Fetches image generation endpoint |
| Download file | n8n-nodes-base.googleDrive | Downloads template from Drive |
| Create Image | n8n-nodes-base.httpRequest | Sends image generation request |
| 10 Seconds | n8n-nodes-base.wait | Waits for processing |
| Get Result | n8n-nodes-base.httpRequest | Polls for completion |
| Download Image | n8n-nodes-base.httpRequest | Downloads generated image |
| Upload file | n8n-nodes-base.googleDrive | Uploads to Drive |

---

## Configuration

### Required Credentials
- **Google Drive**: For template download and result upload
- **Image Generation API**: (varies - FAL.ai, Replicate, etc.)

### Environment Variables
- `GOOGLE_DRIVE_FOLDER_ID`: Target folder for uploads
- `IMAGE_API_KEY`: API key for image generation service

### Key Parameters
```json
{
  "waitTime": {
    "value": 10,
    "unit": "seconds",
    "description": "Polling interval for image generation completion"
  },
  "driveFolder": {
    "value": "Social Media Assets",
    "description": "Google Drive folder for final images"
  }
}
```

---

## Reusable JSON

Copy this JSON snippet for the core social image distribution pattern:

```json
{
  "nodes": [
    {
      "parameters": {},
      "name": "When Executed by Another Workflow",
      "type": "n8n-nodes-base.executeWorkflowTrigger",
      "typeVersion": 1
    },
    {
      "parameters": {
        "operation": "download",
        "fileId": "={{ $json.templateFileId }}",
        "options": {}
      },
      "name": "Download Template",
      "type": "n8n-nodes-base.googleDrive",
      "typeVersion": 3
    },
    {
      "parameters": {
        "unit": "seconds",
        "amount": 10
      },
      "name": "Wait for Processing",
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1.1
    },
    {
      "parameters": {
        "operation": "upload",
        "name": "={{ $json.fileName }}",
        "parents": ["={{ $json.outputFolderId }}"],
        "binaryPropertyName": "data"
      },
      "name": "Upload to Drive",
      "type": "n8n-nodes-base.googleDrive",
      "typeVersion": 3
    }
  ]
}
```

---

## Gotchas

- **Polling timeout**: Image generation can take 30-60 seconds - adjust wait times accordingly
- **File naming**: Use consistent naming convention with timestamps to avoid overwrites
- **Google Drive quotas**: API has daily quotas - batch operations when possible
- **Binary data handling**: Ensure binary data passes correctly between HTTP and Drive nodes
- **Error handling**: Add error paths for failed image generation or upload failures

---

## Related Patterns

- [edit images nano](./nano-image-editing.md) - Image editing variant
- [Create Image Tool](../graphics/create-image-tool.md) - Generic image creation

---

## Changelog

| Date | Change | By |
|------|--------|-----|
| 2026-02-05 | Initial extraction from Nano/Banano pipeline | Neo |
