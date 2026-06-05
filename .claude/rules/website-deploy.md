---
paths:
  - "projects/website/**"
  - "src/pages/**"
  - "**/CLAUDE.md"
description: theinnovativenative.com deploy policy (user-commanded only)
---

# Deploy Rule — theinnovativenative.com

**Updated 2026-05-05:** Deploys are allowed when Mike explicitly tells Claude to deploy. No autonomous, automated, hook-triggered, cron, n8n, or CI deploys.

## What is blocked
- **Autonomous deploys**: No agent, hook, cron, or CI may push to production without Mike's explicit command in the conversation
- `rsync --delete` without Mike explicitly requesting it (to prevent wiping pages from other branches)
- `ssh` to `delikate@75.98.175.76` running destructive commands (`rm`, etc.)

## What is allowed
- Deploys when Mike explicitly says "deploy", "push to production", or equivalent in the conversation
- Local builds (`npm run build` in `projects/website/`)
- Reading from production via `ssh ... ls`, `ssh ... cat`, etc. (diagnostics only)
- Post-deploy `ssh` commands for index file fixes (cp for directory index.html files)
- Editing source files in this repo
- Git commits and branch operations

## Deploy safety checklist (before every deploy)
1. Fresh build (`npm run build`)
2. Verify critical pages exist in `out/` (generational-wealth, quiz, core pages)
3. Use NO `--delete` flag by default (additive deploy)
4. Only use `--delete` if Mike explicitly requests cleanup

## Why this rule exists
On 2026-05-02, an automated `rsync --delete` from a branch missing `generational-wealth/` and `quiz/` wiped both directories from production. The distinction: automated deploys are blocked, user-commanded deploys are allowed.
