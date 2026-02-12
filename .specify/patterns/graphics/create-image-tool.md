# Pattern: Create Image Tool (Gemini)

**Category**: graphics
**Source Workflow**: Create Image Tool
**Source Workflow ID**: MzyeDU9oh8AG0mUI
**Extracted**: 2026-02-05
**Extracted By**: Neo

---

## Use Case

AI image generation tool that:
1. Receives image generation request from parent workflow
2. Generates image using Google Gemini
3. Converts result to file format
4. Sends preview to Telegram
5. Uploads final image to Google Drive

Best for: On-demand image generation, AI art creation, content creation tools.

---

## Key Nodes

| Node Name | Node Type | Purpose |
|-----------|-----------|---------|
| When Executed by Another Workflow | n8n-nodes-base.executeWorkflowTrigger | Subflow trigger |
| Generate an image | @n8n/n8n-nodes-langchain.googleGemini | AI image generation |
| Convert to File | n8n-nodes-base.convertToFile | Converts to binary file |
| Send Photo | n8n-nodes-base.telegram | Sends preview to Telegram |
| Upload file | n8n-nodes-base.googleDrive | Uploads to Google Drive |

---

## Configuration

### Required Credentials
- **Google Gemini API**: For image generation
- **Telegram Bot**: For preview notifications
- **Google Drive**: For file storage

### Environment Variables
- `TELEGRAM_CHAT_ID`: Chat ID for preview notifications
- `GOOGLE_DRIVE_FOLDER_ID`: Target folder for uploads

### Key Parameters
```json
{
  "geminiModel": {
    "value": "gemini-pro-vision",
    "description": "Gemini model for image generation"
  },
  "outputFormat": {
    "value": "png",
    "description": "Output image format"
  }
}
```

---

## Reusable JSON

Copy this JSON snippet for the core image generation pattern:

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
        "modelId": "gemini-pro-vision",
        "prompt": "={{ $json.prompt }}",
        "options": {}
      },
      "name": "Generate Image",
      "type": "@n8n/n8n-nodes-langchain.googleGemini",
      "typeVersion": 1
    },
    {
      "parameters": {
        "operation": "toFile",
        "sourceProperty": "data",
        "options": {
          "fileName": "={{ $json.fileName || 'generated-image.png' }}",
          "mimeType": "image/png"
        }
      },
      "name": "Convert to File",
      "type": "n8n-nodes-base.convertToFile",
      "typeVersion": 1.1
    },
    {
      "parameters": {
        "operation": "sendPhoto",
        "chatId": "={{ $env.TELEGRAM_CHAT_ID }}",
        "binaryPropertyName": "data",
        "additionalFields": {
          "caption": "Generated: {{ $json.prompt }}"
        }
      },
      "name": "Send Preview",
      "type": "n8n-nodes-base.telegram",
      "typeVersion": 1.2
    },
    {
      "parameters": {
        "operation": "upload",
        "name": "={{ $json.fileName }}",
        "parents": ["={{ $env.GOOGLE_DRIVE_FOLDER_ID }}"],
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

- **Gemini rate limits**: Free tier has limited requests per minute
- **Image quality**: Gemini image generation varies - may need multiple attempts
- **Binary data flow**: Ensure binary property name is consistent across nodes
- **Telegram file size**: Telegram has 50MB limit for photos
- **Google Drive permissions**: Ensure service account has write access to target folder

---

## Related Patterns

- [Edit Image Tool](./edit-image-tool.md) - Image editing variant
- [Crypto Social Distribution](../social/crypto-social-distribution.md) - Social media integration

---

## Changelog

| Date | Change | By |
|------|--------|-----|
| 2026-02-05 | Initial extraction from Create Image Tool | Neo |
