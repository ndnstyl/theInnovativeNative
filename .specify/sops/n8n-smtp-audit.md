---
type: SOP
created: 2026-02-27
updated: 2026-02-27
tags: [n8n, SMTP, email, security, audit]
status: active
---

# n8n SMTP Credentials & Email Configuration Audit

## Executive Summary

**Audit Date:** February 27, 2026
**Target Instance:** https://n8n.srv948776.hstgr.cloud/
**Finding:** No dedicated SMTP credential is stored in n8n's credential vault. The DEA System Health Monitor workflow relies on instance-level SMTP configuration.

---

## Detailed Findings

### 1. Credentials API Limitation

The n8n public API does NOT expose credential listing:

```bash
# This returns "GET method not allowed"
curl -H "X-N8N-API-KEY: ..." \
  "https://n8n.srv948776.hstgr.cloud/api/v1/credentials"
```

**Implication:** Credential audit must be performed via n8n Web UI or by inspecting environment variables directly.

---

### 2. Email Configuration in DEA System Health Monitor

**Workflow ID:** `8bCZWoQMLonX0fQ4`
**Email Node:** `send-email`
**Node Type:** `n8n-nodes-base.emailSend` (v2.1)

#### Node Configuration:
```json
{
  "parameters": {
    "fromEmail": "alerts@dataengineeracademy.com",
    "toEmail": "jenna@dataengineeracademy.com",
    "subject": "=⚠️ DEA Data Silo Alert — {{ $json.issuesSummary }}",
    "emailType": "text",
    "message": "...",
    "options": {}
  }
}
```

#### Critical Observation:
- **No `credentialId` field** → Does not reference a stored credential
- **No credential reference in node config** → Uses default/instance-level SMTP
- **Hardcoded email addresses** → Not parameterized or externalized
- **Workflow is ACTIVE** → Suggests SMTP is configured somewhere

---

### 3. How n8n Email Works

The `emailSend` node supports two architectures:

#### Mode A: Credential-Based (RECOMMENDED)
- Email node references a stored credential (OAuth2, SendGrid API key, etc.)
- `credentialId` parameter specifies which credential to use
- Security: Credentials stored encrypted in n8n database
- Auditability: Can track credential usage per workflow
- Rotation: Credentials can be updated without modifying workflows

#### Mode B: Instance-Level SMTP (CURRENT)
- n8n admin configures SMTP at instance level (environment or UI)
- All workflows share the same email credentials
- Security: Single point of failure, shared secrets across all workflows
- Auditability: Cannot track per-workflow credential usage
- Rotation: Requires restarting n8n or updating all references

---

### 4. Instance-Level SMTP Configuration

For the workflow to work (it has executed multiple times), SMTP must be configured via:

#### Via Environment Variables:
```bash
N8N_SMTP_HOST=smtp.server.com
N8N_SMTP_PORT=587
N8N_SMTP_USER=alerts@dataengineeracademy.com
N8N_SMTP_PASS=<password>
N8N_SMTP_FROM=alerts@dataengineeracademy.com
N8N_SMTP_TLS=true
```

#### Via n8n Web UI:
1. Login as admin
2. Go to **Settings** → **Email Configuration**
3. Check SMTP Server section

---

## Security Issues

### Current Risks:
1. **No credential isolation** - SMTP credentials shared across all workflows
2. **No audit trail** - Cannot see which workflows use email
3. **No per-workflow rotation** - Changing SMTP breaks all email workflows
4. **Hardcoded emails** - Recipient addresses in workflow code, not in credentials

### Example Risk Scenario:
- Attacker gains access to one workflow execution log
- Attacker sees email content and can infer SMTP host/port
- Attacker could potentially credential-stuff the SMTP account
- All workflows lose email capability

---

## Recommendations

### Option 1: Keep Current Setup (Minimal Changes)
**When to use:** If SMTP is already working and you want minimal disruption

**Actions:**
1. Verify SMTP is configured via n8n Admin panel
2. Document SMTP credentials in secure vault (Hostinger admin, LastPass, etc.)
3. Audit all workflows for hardcoded email addresses
4. Create runbook for SMTP credential rotation

**Limitations:** No per-workflow credential management, shared secrets across all workflows

---

### Option 2: Switch to Gmail OAuth (RECOMMENDED)
**When to use:** You have a Gmail account and want better security/auditability

**Actions:**
1. Create a Gmail account (or use existing) for `alerts@dataengineeracademy.com`
2. Generate an [App Password](https://support.google.com/accounts/answer/185833) (not the regular password)
3. In n8n Web UI:
   - Go to **Credentials** → **Create New**
   - Select **Gmail OAuth2**
   - Authenticate with the alerts Gmail account
   - Save credential (get credential ID)
4. Update DEA System Health Monitor workflow:
   - Edit `send-email` node
   - Remove hardcoded `fromEmail` and `toEmail`
   - Set `credentialId` to the Gmail credential ID
   - Use node parameters for dynamic from/to emails
5. Repeat for all other workflows that send email

**Benefits:**
- Credential stored encrypted in n8n database
- Can rotate app password without updating workflows
- Audit trail: credential access logs
- Per-workflow credential references
- OAuth2 is more secure than SMTP passwords

**Cost:** None (free Gmail accounts)

---

### Option 3: Use SendGrid (ENTERPRISE OPTION)
**When to use:** You need professional email reliability and compliance

**Actions:**
1. Create [SendGrid account](https://sendgrid.com/)
2. Generate API key
3. In n8n Web UI:
   - Go to **Credentials** → **Create New**
   - Select **SendGrid**
   - Paste API key
   - Save credential
4. Update workflows to use SendGrid credential
5. Configure sender domain in SendGrid console

**Benefits:**
- Professional SLA and delivery reliability
- Built-in bounce/complaint handling
- Detailed email analytics
- DKIM/SPF authentication
- Compliance (SOC 2, GDPR, etc.)

**Cost:** ~$20/month for professional reliability

---

## Implementation Priority

| Task | Priority | Effort | Impact |
|------|----------|--------|--------|
| Verify SMTP is configured | HIGH | 5 min | Know current state |
| Audit all email workflows | HIGH | 30 min | Document full scope |
| Document SMTP credentials | MEDIUM | 10 min | Security baseline |
| Migrate to Gmail OAuth | MEDIUM | 2 hours | Better security |
| Migrate to SendGrid | LOW | 4 hours | Enterprise reliability |

---

## Audit Checklist

- [ ] **Verify SMTP Configuration**
  - [ ] Login to n8n as admin
  - [ ] Navigate to Settings → Email
  - [ ] Document SMTP host, port, user
  - [ ] Note TLS/SSL configuration

- [ ] **Find All Email Workflows**
  - [ ] Search for `emailSend` nodes across all workflows
  - [ ] List workflows using email functionality
  - [ ] Document from/to email addresses

- [ ] **Check for Hardcoded Secrets**
  - [ ] Search workflow JSON for passwords/API keys
  - [ ] Check for embedded email addresses
  - [ ] Verify no secrets in workflow descriptions

- [ ] **Document Findings**
  - [ ] Create Airtable record for SMTP configuration
  - [ ] List all email workflows and their recipients
  - [ ] Document any hardcoded email addresses
  - [ ] Tag workflows for future credential migration

---

## Files Referenced

- **Workflow:** DEA - System Health Monitor
  - **ID:** `8bCZWoQMLonX0fQ4`
  - **Email Node:** `send-email`
  - **Type:** `n8n-nodes-base.emailSend` v2.1
  - **Status:** Active (last updated 2026-02-27)

- **n8n Instance:** https://n8n.srv948776.hstgr.cloud/
- **API Key:** (stored securely, not in this document)

---

## Related Documentation

- [[constitution]] - Security and credential governance rules
- n8n Email Send Node: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.emailsend/
- Gmail App Passwords: https://support.google.com/accounts/answer/185833

