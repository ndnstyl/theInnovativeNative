# Security Hardening SOP — DEA Data Silo + Infrastructure

> **Owner:** Drew (PM) | **Last Updated:** 2026-03-10
> **Scope:** All credential management, VPS hardening, webhook security, and secret rotation

---

## 1. Credential Rotation Schedule

### Quarterly Rotation (Every 90 Days)

| Credential | Where to Rotate | Where to Update After |
|-----------|----------------|----------------------|
| Stripe Webhook Secret | Stripe Dashboard > Developers > Webhooks | n8n WF1 credential store + `.env` |
| Airtable PAT (DEA) | Airtable > Account > Tokens | n8n credential `YCWFwTIXwnTpVy2y` + `.env` |
| Airtable PAT (Internal) | Airtable > Account > Tokens | `~/.claude/.mcp.json` |
| n8n API Key | n8n > Settings > API | `~/.claude/.mcp.json` + `.env` |
| Close CRM API Key | Close CRM > Settings > API Keys | n8n credential + `.env` |
| Supabase Management Token | Supabase Dashboard > Account > Tokens | `~/.claude/.mcp.json` |
| Hostinger API Token | Hostinger > Account > API | `~/.claude/.mcp.json` |
| Slack Bot Token | Slack API > App > OAuth | `~/.claude/.mcp.json` |

### Annual Rotation

| Credential | Where to Rotate | Where to Update After |
|-----------|----------------|----------------------|
| Stripe Secret Key (sk_live) | Stripe Dashboard > Developers > API Keys | n8n credential + `.env` |
| Google OAuth Client Secret | Google Cloud Console > Credentials | `~/.claude/.mcp.json` |
| Supabase DB Password | Supabase Dashboard > Settings > Database | `.env` + n8n credential |
| Keap OAuth2 | Re-authorize in n8n | n8n credential `tk9j38qlVNMfV8Gl` |

### Rotation Procedure

1. Generate new credential in the source system
2. Update n8n credential store FIRST (if applicable)
3. Test affected n8n workflows
4. Update local `.env` files
5. Update `~/.claude/.mcp.json` (if applicable)
6. Verify MCP connections work
7. Revoke the old credential
8. Log rotation in Airtable Time Entries

---

## 2. VPS Hardening Checklist (Hostinger)

### SSH Access
- [ ] Disable root SSH login (`PermitRootLogin no` in `/etc/ssh/sshd_config`)
- [ ] Use SSH key authentication only (`PasswordAuthentication no`)
- [ ] Restrict SSH to specific IPs via firewall or `AllowUsers`
- [ ] Change default SSH port from 22
- [ ] Set SSH idle timeout (`ClientAliveInterval 300`, `ClientAliveCountMax 2`)

### Firewall (UFW / iptables)
- [ ] Default deny incoming
- [ ] Allow SSH (restricted port) from trusted IPs only
- [ ] Allow HTTPS (443) from anywhere (for n8n webhooks)
- [ ] Allow HTTP (80) for Let's Encrypt renewal only
- [ ] Block all other incoming ports
- [ ] Consider IP whitelisting for Stripe webhook IPs:
  - `3.18.12.63`, `3.130.192.202`, `13.235.14.237`, `13.235.122.149`
  - `18.211.135.69`, `35.154.171.200`, `52.15.183.38`, `54.88.130.119`, `54.88.130.237`, `54.187.174.169`, `54.187.205.235`, `54.187.216.72`

### n8n Instance
- [ ] Run n8n as non-root user
- [ ] Enable HTTPS (TLS) — verify certificate is valid
- [ ] Set strong password for n8n admin UI
- [ ] Enable 2FA on n8n admin login (if supported)
- [ ] Configure execution log retention: max 30 days
- [ ] Set `N8N_BLOCK_ENV_ACCESS_IN_NODE=true` to prevent env var leakage in Code nodes
- [ ] Set `EXECUTIONS_DATA_PRUNE=true` and `EXECUTIONS_DATA_MAX_AGE=720` (30 days in hours)
- [ ] Disable public API access if not needed, or restrict to specific IPs

### OS Security
- [ ] Enable automatic security updates (`unattended-upgrades`)
- [ ] Install and configure fail2ban
- [ ] Remove unnecessary packages and services
- [ ] Set up log rotation for n8n and system logs
- [ ] Monitor disk usage (prevent log-fill attacks)

### Monitoring
- [ ] Set up uptime monitoring (e.g., UptimeRobot, BetterStack)
- [ ] Configure email alerts for SSH login events
- [ ] Monitor n8n execution failures via WF5 health check
- [ ] Set up daily backup of n8n SQLite database

---

## 3. Webhook Security

### Stripe Webhook Hardening
- [ ] **Signature Verification:** WF1 must verify `stripe-signature` header using HMAC-SHA256
- [ ] **Raw Body:** n8n webhook node must have `rawBody: true` enabled
- [ ] **Replay Protection:** Reject events with timestamps older than 5 minutes
- [ ] **Secret Storage:** Webhook secret stored in n8n credential store (NOT hardcoded in Code nodes)
- [ ] **Error Response:** Return HTTP 5xx on internal failures so Stripe retries
- [ ] **Event Logging:** Log `event_id` + `event_type` + `timestamp` before processing
- [ ] **Idempotency:** Check `event_id` against processed events table to prevent duplicates
- [ ] **Rate Limiting:** Implement at VPS firewall level (max 10 req/sec per IP)

### Webhook URL Security
- [ ] Use unpredictable webhook path (not `/webhook/stripe`)
- [ ] Rotate webhook path quarterly (update in Stripe Dashboard + n8n)
- [ ] Never expose webhook URL in git, logs, or documentation
- [ ] Monitor Stripe Dashboard for unexpected delivery attempts

---

## 4. Secret Scanning (Pre-Commit)

### Setup Gitleaks
```bash
# Install gitleaks
brew install gitleaks

# Test against current repo
gitleaks detect --config .gitleaks.toml --source .

# Test staged files only (pre-commit)
gitleaks protect --config .gitleaks.toml --staged

# Scan git history for past leaks
gitleaks detect --config .gitleaks.toml --source . --log-opts="--all"
```

### Pre-Commit Hook Setup
```bash
# Create pre-commit hook
cat > .git/hooks/pre-commit << 'HOOK'
#!/bin/sh
# Gitleaks pre-commit hook — block commits containing secrets
if command -v gitleaks >/dev/null 2>&1; then
  gitleaks protect --config .gitleaks.toml --staged --verbose
  if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Gitleaks detected secrets in staged files."
    echo "Remove the secrets before committing."
    echo "If this is a false positive, use: git commit --no-verify"
    exit 1
  fi
else
  echo "WARNING: gitleaks not installed. Skipping secret scan."
  echo "Install with: brew install gitleaks"
fi
HOOK
chmod +x .git/hooks/pre-commit
```

### GitHub Repository Settings
- [ ] Enable GitHub Secret Scanning (Settings > Code security > Secret scanning)
- [ ] Enable Push Protection (blocks pushes containing detected secrets)
- [ ] Review any existing secret scanning alerts

---

## 5. Data Security

### PII Handling
- [ ] Hash customer emails before storing in Supabase (`SHA-256(email + salt)`)
- [ ] Store raw customer emails only in `customer_identity_map` (single canonical location)
- [ ] Strip customer emails from error alert descriptions sent to Airtable
- [ ] Never log full customer names/emails in n8n execution data

### Data Retention
- [ ] `raw_transactions.raw_json` — retain 90 days, then purge
- [ ] n8n execution logs — retain 30 days (auto-prune)
- [ ] Airtable System Alerts — archive after 30 days
- [ ] Supabase `changelog` — retain indefinitely (immutable audit trail)

### Backup Strategy
- [ ] Daily: Supabase database backup (built-in on Pro plan)
- [ ] Weekly: Export Airtable base to JSON (via n8n scheduled workflow)
- [ ] Monthly: Full n8n workflow export + credential inventory
- [ ] Test restore procedure quarterly

---

## 6. Access Control

### n8n Instance
| Role | Users | Access Level |
|------|-------|-------------|
| Admin | Drew | Full (credentials + workflows) |
| Editor | Patricia | Workflows only (no credential editing) |
| Viewer | Jenna | View executions only |

### Supabase Project
| Role | Users | Access Level |
|------|-------|-------------|
| Owner | Drew | Full admin |
| Developer | Patricia | Schema + data |
| Read-only | Jenna | Query only (via MCP) |

### Airtable Base (DEA)
| Role | Users | Access Level |
|------|-------|-------------|
| Creator | Drew | Full admin |
| Editor | Jenna | Read/write records |
| Commenter | Patricia | Read + comment |

---

## 7. Incident Response

### If Credentials Are Leaked
1. **Immediately rotate** the compromised credential
2. **Check access logs** (Stripe Dashboard, Supabase logs, n8n executions)
3. **Scan for unauthorized activity** (new records, modified data, unexpected API calls)
4. **Update all systems** that reference the credential
5. **Notify affected parties** (Jenna, Patricia, clients if PII exposed)
6. **Document the incident** in Airtable (Escalations table)
7. **Review and fix** the root cause (how was it leaked?)
8. **Run gitleaks** against full git history to verify no other leaks

### If VPS Is Compromised
1. **Take n8n offline** immediately (stop the service)
2. **Rotate ALL credentials** stored in n8n credential store
3. **Rotate Stripe webhook secret** and disable webhooks temporarily
4. **Check n8n execution history** for unauthorized workflow runs
5. **Audit Supabase** for unauthorized data access/modification
6. **Rebuild VPS** from scratch if needed (don't trust a compromised system)
7. **Re-deploy workflows** from git-tracked exports
8. **Enable enhanced monitoring** before bringing back online

---

## 8. Token Rotation Tracker

Use this to track when credentials were last rotated:

| Credential | Last Rotated | Next Due | Owner |
|-----------|-------------|----------|-------|
| Stripe Webhook Secret | _NEVER_ | **OVERDUE** | Drew |
| Airtable PAT (DEA) | _NEVER_ | **OVERDUE** | Drew |
| n8n API Key | _NEVER_ | **OVERDUE** | Drew |
| Close CRM API Key | _NEVER_ | **OVERDUE** | Drew |
| Supabase Management Token | _NEVER_ | **OVERDUE** | Drew |
| mcp-config.json tokens (12+) | _NEVER_ | **CRITICAL** | Drew |

> **All credentials exposed in the git-tracked `mcp-config.json` must be rotated ASAP.**
> The file has been untracked from git but the credentials exist in git history.
