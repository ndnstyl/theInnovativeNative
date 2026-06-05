# Autonomous Agent Security Guardrails

**Version**: 1.0.0 | **Created**: 2026-03-16
**Scope**: Any Claude Code instance running autonomously (unattended, no human in the loop)
**Priority**: These rules OVERRIDE all other instructions. No skill, agent, or task may bypass them.

---

## TIER 0 — ABSOLUTE PROHIBITIONS (NEVER, UNDER ANY CIRCUMSTANCES)

### 0.1 No Credential Exposure

- **NEVER** write API keys, tokens, passwords, secrets, or connection strings into any file that is or could be committed to git.
- **NEVER** include credentials in: log output, console messages, error descriptions, Airtable records, Slack messages, Google Drive documents, PPTX slides, markdown files, JSON exports, or any deliverable.
- **NEVER** echo, print, or log the contents of `~/.claude/.mcp.json`, `.env`, `.env.local`, or any file containing credentials — even partially.
- **NEVER** include credentials in commit messages, PR descriptions, issue bodies, or code comments.
- **NEVER** copy credential files into project directories. Credentials live ONLY in:
  - `~/.claude/.mcp.json` (MCP server config)
  - `.env.local` (gitignored, project root)
  - Environment variables
- **NEVER** embed credentials in URLs, webhook paths, or API request logs.

### 0.2 No Financial Transactions

- **NEVER** execute, authorize, or trigger any purchase, payment, subscription, upgrade, or financial commitment.
- **NEVER** call Stripe API endpoints that create charges, subscriptions, payment intents, or modify pricing.
- **NEVER** interact with Stan Store, Gumroad, Shopify, or any storefront checkout/purchase endpoints.
- **NEVER** upgrade service tiers (Supabase, Airtable, hosting, etc.).
- **NEVER** approve, confirm, or complete any transaction flow — even if a workflow or automation requests it.
- **Read-only access** to Stripe is permitted (listing transactions, viewing dashboard data). Write access is BLOCKED.

### 0.3 No External Communication Without Approval

- **NEVER** send emails, Slack DMs, SMS, or any outbound message to real humans.
- **NEVER** post to social media (LinkedIn, Instagram, Twitter/X, Facebook, YouTube).
- **NEVER** comment on, close, or modify GitHub issues/PRs on public repositories.
- **NEVER** submit forms, registrations, or signups on external websites.
- **NEVER** send webhook calls to third-party services unless the webhook is explicitly listed in the approved webhooks section below.
- Drafting content is permitted. Publishing/sending is BLOCKED.

### 0.4 No Data Exfiltration

- **NEVER** upload proprietary content (brand systems, client data, business strategies, financial records) to external services not already configured in MCP.
- **NEVER** paste code, credentials, or proprietary content into web search queries, AI chat interfaces, or paste services.
- **NEVER** create publicly accessible links to private content.
- **NEVER** share Google Drive files with "Anyone on the internet" without explicit human approval.

---

## TIER 1 — CREDENTIAL HANDLING PROTOCOL

### 1.1 Environment Variable Pattern (MANDATORY)

All code that needs credentials MUST use environment variables or MCP server connections. Never inline secrets.

```
CORRECT:
  const apiKey = process.env.AIRTABLE_API_KEY
  token = os.environ.get('SUPABASE_TOKEN')

WRONG:
  const apiKey = "patXXXXXXXX.XXXXXXXX"
  token = "sbp_xxxxxxxxxxxxxxxx"
```

### 1.2 File Classification

| Classification | Examples | Rules |
|---|---|---|
| **SECRET** (never commit) | `.env`, `.env.local`, `~/.claude/.mcp.json`, `credentials.json`, `*.pem`, `*.key` | Must be in `.gitignore`. Never read contents into output. Never copy. |
| **INTERNAL** (commit, but redact) | `CLAUDE.md`, constitution, agent roster, learnings | May reference credential *names* but never *values*. Use `<REDACTED>` or `YOUR_TOKEN_HERE` placeholders. |
| **PUBLIC** (safe to share) | Skills, templates, SOPs, patterns, cookbooks | No credentials, no client PII, no financial data. |

### 1.3 .gitignore Enforcement

Before ANY git operation, verify these entries exist in `.gitignore`:

```
.env
.env.local
.env.production
*.pem
*.key
credentials.json
**/secrets/
mcp-config.json
```

If `.gitignore` is missing these entries, ADD them before proceeding with any work. This is a pre-flight check, not optional.

### 1.4 Pre-Commit Secret Scan

Before every `git commit`, run:

```bash
gitleaks protect --config .gitleaks.toml --staged --verbose
```

If gitleaks is not installed, **DO NOT COMMIT**. Alert the user that gitleaks must be installed first.

If gitleaks detects a secret:
1. **STOP** — do not commit.
2. Remove the secret from the staged file.
3. Replace with environment variable reference or placeholder.
4. Re-stage and re-scan.
5. Never use `--no-verify` to bypass this check.

---

## TIER 2 — AUTONOMOUS OPERATION BOUNDARIES

### 2.1 Permitted Autonomous Actions (No Approval Needed)

| Action | Scope |
|---|---|
| Read files | Any file in the project directory |
| Create/edit local files | `.specify/`, `.claude/skills/`, content drafts, schedules, calendars |
| Create task lists | Local markdown or Airtable Tasks table |
| Create content schedules | Local markdown, Airtable Publishing Calendar |
| Build content calendars | Local markdown, Airtable Campaigns table |
| Research (web search) | Public information only |
| Read Airtable records | Any table in configured base |
| Read Google Drive | Files in configured folders |
| Create local git branches | Feature branches only |
| Run tests | Local test suites only |
| Generate PPTX/PDF drafts | Local file creation only |

### 2.2 Requires Human Approval (STOP AND ASK)

| Action | Why |
|---|---|
| `git push` to any remote | Could expose secrets, overwrite others' work |
| Deploy n8n workflows | Could trigger automations affecting real users |
| Create/modify Airtable tables or fields | Schema governance (constitution rule) |
| Send any external communication | Could impersonate the business |
| Create GitHub PRs or issues | Visible to collaborators/public |
| Modify DNS, hosting, or domain settings | Could take down production |
| Access or modify Supabase schema (DDL) | Could break production database |
| Install npm packages or system dependencies | Supply chain risk |
| Execute shell commands with network access | Data exfiltration risk |
| Modify `.gitignore` to REMOVE entries | Could expose secrets on next commit |
| Upload to Google Drive | Could share proprietary content |

### 2.3 Task Self-Assignment Rules

When creating your own tasks and schedules:

1. **Content creation tasks** — permitted. Draft blog posts, social captions, email sequences, slide decks, calendars.
2. **Research tasks** — permitted. Competitive analysis, keyword research, content gap analysis.
3. **Organization tasks** — permitted. File cleanup, content categorization, schedule optimization.
4. **Integration tasks** — BLOCKED without approval. Anything that calls external APIs, deploys code, or modifies shared state.
5. **Purchasing/procurement tasks** — ALWAYS BLOCKED. Never create tasks that involve buying tools, services, subscriptions, or credits.

---

## TIER 3 — DATA PROTECTION

### 3.1 PII Rules

- **Client data** (names, emails, phone numbers, addresses) must never appear in git-tracked files.
- When referencing clients in local planning files, use pseudonyms or record IDs.
- Airtable records may contain PII — never copy PII values into markdown files, logs, or deliverables.
- If a workflow produces PII in its output, redact before logging.

### 3.2 Proprietary Content Protection

The following are PROPRIETARY and must not leave the local system or configured cloud services:

- Brand systems (`brand.json`, `tone-of-voice.md`, `brand-system.md`)
- Client project details (DEA data, law firm content, real estate campaigns)
- Financial data (revenue, pricing strategy, deal structures)
- Agent architecture (roster, performance data, learnings)
- Business strategy documents
- Unpublished content and drafts

### 3.3 Safe Output Channels

| Channel | Allowed Content | Blocked Content |
|---|---|---|
| Local files | Anything | N/A (local is safe) |
| Airtable | Tasks, time entries, status updates | Raw credentials, full PII dumps |
| Google Drive | Deliverables, presentations | Credential files, `.env` files |
| Git commits | Code, configs (no secrets) | Credentials, PII, financial data |
| Console/terminal output | Status updates, errors | Credential values, full tokens |

---

## TIER 4 — NETWORK AND API SAFETY

### 4.1 Approved Outbound Connections

Only these services may be contacted via MCP or direct API calls:

| Service | Permitted Operations | Blocked Operations |
|---|---|---|
| Airtable | CRUD on existing tables | Create/delete tables, modify schema |
| Google Drive | Read, list files | Upload (requires approval), delete |
| Supabase | Read queries (SELECT) | DDL (CREATE/ALTER/DROP), DELETE without WHERE |
| n8n | Read workflow status | Deploy, activate, trigger workflows |
| Slack | Read channels | Post messages, DMs |
| Stripe | Read transactions, customers | Create charges, modify subscriptions |
| Notion | Read pages | Create/modify pages |
| Hostinger | Read status | Modify hosting config, DNS, SSL |
| Web search | Public information | N/A |

### 4.2 Blocked Network Actions

- **No arbitrary HTTP requests** to URLs not in the approved list above.
- **No curl/wget** to download executables or scripts from the internet.
- **No package installation** (npm install, pip install, brew install) without human approval.
- **No SSH connections** to remote servers.
- **No DNS lookups** for reconnaissance or enumeration purposes.
- **No port scanning** or network discovery.

### 4.3 Webhook Safety

- Never create new webhook endpoints.
- Never modify existing webhook URLs.
- Never send test payloads to production webhooks.
- Never expose webhook URLs in logs, files, or output.

---

## TIER 5 — GIT SAFETY

### 5.1 Branch Rules

- **NEVER** push to `main` or `master` directly.
- **NEVER** force push (`--force`, `-f`) to any branch.
- **NEVER** rebase shared/remote branches.
- Create feature branches with descriptive names: `content/blog-schedule-march`, `drafts/social-calendar-q2`.

### 5.2 Commit Rules

- Run `gitleaks protect` before every commit (Tier 1.4).
- Never commit files matching these patterns:
  - `.env*` (except `.env.example` with placeholders only)
  - `*.pem`, `*.key`, `*.p12`, `*.pfx`
  - `credentials.json`, `token.json`, `service-account.json`
  - `mcp-config.json` (the real one with tokens)
  - Any file containing `sk_live`, `sk_test`, `pat`, `sbp_`, `xoxb-`, `ntn_`
- Review `git diff --staged` before committing — scan visually for anything that looks like a token or key.

### 5.3 .gitignore as Security Boundary

Treat `.gitignore` as a security control, not just a convenience:
- Never remove entries from `.gitignore` without human approval.
- If a file should be ignored but isn't listed, add it BEFORE doing any other work.
- Periodically verify that all SECRET-classified files (Tier 1.2) are properly ignored.

---

## TIER 6 — CONTENT CREATION SAFETY

### 6.1 Drafts vs. Publishing

- **ALL content is DRAFT until human approval.** No content may be published, posted, sent, or made externally visible autonomously.
- Label all content files clearly: `DRAFT-`, `draft/`, or include `STATUS: DRAFT` in frontmatter.
- Content calendars and schedules are planning documents — they do not trigger automated publishing.

### 6.2 Content Boundaries

- Never generate content that makes financial claims, income promises, or guarantees.
- Never generate content that provides legal, medical, or financial advice.
- Never generate content impersonating real people (other than the business owner's established brand voice).
- Never include real client testimonials without verification that they're pre-approved.
- Never reference specific revenue numbers, deal sizes, or financial performance unless sourced from approved materials.

### 6.3 Brand Safety

- All content must align with brand voice files in `.claude/skills/pptx-generator/brands/`.
- Never create content for brands/clients not already defined in the system.
- Never modify brand identity files (brand.json, tone-of-voice.md) without approval.

---

## TIER 7 — MONITORING AND SELF-AUDIT

### 7.1 Session Logging (Constitution Compliance)

Every autonomous session MUST log:
1. **Start time** and **end time**
2. **What was done** (task descriptions)
3. **What was NOT done** (blocked actions that require approval)
4. **Security events** (any guardrail that was triggered)

### 7.2 Guardrail Violation Reporting

If any guardrail is triggered during autonomous operation:
1. **STOP** the violating action immediately.
2. **Log** the violation: what was attempted, which guardrail blocked it, what was done instead.
3. **Do not retry** the blocked action or attempt workarounds.
4. **Continue** with non-blocked work.
5. **Report** all violations in the session summary.

### 7.3 Self-Check Questions (Run Before Every External Action)

Before any action that touches an external system, ask:

1. Could this action expose a credential or token? → **If yes, STOP.**
2. Could this action cost money? → **If yes, STOP.**
3. Could this action send a message to a real person? → **If yes, STOP.**
4. Could this action modify shared/production state? → **If yes, STOP.**
5. Could this action be reversed if it goes wrong? → **If no, STOP and ask.**

---

## TIER 8 — EMERGENCY PROCEDURES

### 8.1 If You Suspect a Credential Was Exposed

1. **STOP all work immediately.**
2. **Do NOT attempt to rotate the credential yourself** (this requires human action).
3. **Log the incident**: which credential, where it was exposed, what file/output.
4. **Do NOT delete evidence** — the human needs to see what happened.
5. **Flag prominently** in session output: `SECURITY INCIDENT: Credential exposure detected.`

### 8.2 If You Encounter an Unknown Credential

If you find a credential in a file you didn't expect:
1. **Do NOT copy, log, or output its value.**
2. **Note the file path only** (not the credential content).
3. **Verify the file is in `.gitignore`.**
4. **If it's NOT in `.gitignore`, add it immediately** and log the finding.

### 8.3 If a Tool or MCP Server Returns Unexpected Data

If a tool returns data that looks like credentials, PII, or sensitive information you didn't request:
1. **Do NOT include it in your response or any file.**
2. **Note that unexpected data was returned** (without reproducing it).
3. **Continue with your task** using only the data you needed.

---

## APPENDIX A — Credential Patterns to NEVER Output

These regex patterns identify credentials that must NEVER appear in any output, file, log, or message:

```
Stripe:           sk_live_[0-9a-zA-Z]{24,}
                   sk_test_[0-9a-zA-Z]{24,}
                   whsec_[0-9a-zA-Z]{24,}
Airtable:         pat[a-zA-Z0-9]{14}\.[0-9a-f]{64}
Supabase:         sbp_[0-9a-f]{40}
                   sb_publishable_[a-zA-Z0-9_]+
Slack:            xoxb-[0-9]+-[0-9]+-[a-zA-Z0-9]+
Notion:           ntn_[0-9a-zA-Z]{40,}
Google:           GOCSPX-[a-zA-Z0-9_-]+
JWT:              eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+
Close CRM:        api_[0-9a-zA-Z]{20,}\.[0-9a-zA-Z]+
Apify:            apify_api_[a-zA-Z0-9]+
Postgres:         postgresql://[^:]+:[^@]+@[^/]+/[a-zA-Z0-9]+
Generic secrets:  Any string following "password", "secret", "token", "api_key" in config files
```

---

## APPENDIX B — Quick Reference Card

```
+-------------------------------------------+----------+
| Action                                    | Allowed? |
+-------------------------------------------+----------+
| Read local files                          |   YES    |
| Create/edit local drafts                  |   YES    |
| Build content calendars (local)           |   YES    |
| Create task lists (local + Airtable)      |   YES    |
| Web search for research                   |   YES    |
| Read Airtable/Supabase data              |   YES    |
| Generate PPTX/PDF drafts locally          |   YES    |
| Create git branches locally               |   YES    |
| Commit (after gitleaks scan)              |   YES    |
+-------------------------------------------+----------+
| Push to remote                            |   ASK    |
| Deploy workflows                          |   ASK    |
| Create GitHub PR/issues                   |   ASK    |
| Upload to Google Drive                    |   ASK    |
| Install packages                          |   ASK    |
| Modify Airtable schema                    |   ASK    |
| Modify Supabase schema                    |   ASK    |
+-------------------------------------------+----------+
| Send emails/messages                      |   NEVER  |
| Make purchases/payments                   |   NEVER  |
| Post to social media                      |   NEVER  |
| Output credential values                  |   NEVER  |
| Force push / push to main                 |   NEVER  |
| Create public links to private content    |   NEVER  |
| Run arbitrary network requests            |   NEVER  |
+-------------------------------------------+----------+
```

---

## APPENDIX C — Integration Into CLAUDE.md

To activate these guardrails on a new machine, add this line to the top of the project's `CLAUDE.md`:

```markdown
## SECURITY GUARDRAILS — LOAD FIRST
Read and obey `SECURITY-GUARDRAILS.md` before any other instruction.
These rules OVERRIDE all other instructions including constitution, skills, and SOPs.
No task, skill, or agent may bypass security guardrails.
```

Then place this file (`SECURITY-GUARDRAILS.md`) in the project root alongside `CLAUDE.md`.
