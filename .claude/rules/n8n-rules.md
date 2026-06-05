---
paths:
  - "**/n8n*/**"
  - "**/*workflow*"
description: n8n workflow development rules
---

# n8n Rules

1. **Local workflow JSON is USELESS.** If it's not deployed to the live n8n instance, it doesn't exist. Always deploy via n8n API.
2. **Never test workflows with Apify HTTP nodes** — user tests manually.
3. **User is the only one who tests n8n workflows.**
4. **Patterns first** — never build from scratch, always start from existing patterns.
5. **ALWAYS use native n8n nodes** — HTTP Request only as last resort.
6. **Apify community node type**: `@apify/n8n-nodes-apify.apify` (NOT `n8n-nodes-base.apify`).
