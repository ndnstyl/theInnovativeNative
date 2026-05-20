# Deliverable Verification Checklist

**Owner**: Drew (Project Manager)
**Purpose**: Ensure all deliverables meet quality gates before approval
**Created**: 2026-02-05

---

## Pre-Approval Checklist

Before marking ANY deliverable as "Ready" or "Approved", verify:

### 1. Airtable Record Exists
- [ ] Record created in Deliverables table
- [ ] Name is descriptive
- [ ] Type is set correctly
- [ ] Project is linked
- [ ] Created By (agent) is linked
- [ ] Status is "Draft" (not Ready yet)

### 2. Local File Exists
- [ ] `Local Path` field is populated
- [ ] File actually exists at that path
- [ ] File is not empty/corrupted

### 3. ⛔ GOOGLE DRIVE URL EXISTS ⛔
**THIS IS THE MOST COMMONLY MISSED STEP**

- [ ] `File URL` field is populated
- [ ] URL is a Google Drive link (not local path)
- [ ] Link opens correctly (test in incognito)
- [ ] Sharing is set to "Anyone with link can view"

**If File URL is empty, deliverable is NOT complete. Send back to agent.**

### 4. Format Verification (MANDATORY)
**Graphics MUST be PNG or JPG - SVG is NOT deployable to social platforms**

- [ ] Format is PNG or JPG (NOT SVG) for graphics
- [ ] Format is MP4 (H.264) for video
- [ ] Dimensions match platform requirements
- [ ] File size within platform limits
- [ ] Google Drive link loads/previews correctly (test in incognito)

**If format is SVG, deliverable is NOT deployable. Send back to agent for PNG conversion.**

See: `.specify/sops/deliverable-format-requirements.md` for platform specs

### 5. Content Quality
- [ ] Content matches requirements/brief
- [ ] Brand guidelines followed (if applicable)
- [ ] No typos/errors visible

### 6. Metadata Complete
- [ ] UTM Link populated (if marketing asset)
- [ ] Notes field has relevant context
- [ ] Created Date is set

---

## Quick Verification Script

Run this to find deliverables missing URLs:

```bash
AIRTABLE_KEY=$(cat ~/.claude/.mcp.json | python3 -c "import sys,json; print(json.load(sys.stdin)['mcpServers']['airtable-mcp']['env']['AIRTABLE_API_KEY'])")

curl -s "https://api.airtable.com/v0/appTO7OCRB2XbAlak/tblnUsXJ2ZHjZGcyu" \
  -H "Authorization: Bearer $AIRTABLE_KEY" | python3 -c "
import sys, json
d = json.load(sys.stdin)
missing = []
for r in d.get('records', []):
    f = r.get('fields', {})
    if not f.get('File URL') and 'LinkedIn Post' not in f.get('Name', ''):
        missing.append(f.get('Name', 'Unknown'))
if missing:
    print('⛔ DELIVERABLES MISSING GOOGLE DRIVE URLs:')
    for m in missing:
        print(f'  - {m}')
else:
    print('✓ All asset deliverables have Google Drive URLs')
"
```

---

## Common Failures

| Issue | Cause | Fix |
|-------|-------|-----|
| Empty File URL | Agent didn't upload to Drive | Run upload script or manual upload |
| "Access Denied" on link | Sharing not set to Anyone | Update Drive sharing settings |
| Local path in File URL | Agent confused fields | Replace with Drive link |
| Broken link | File moved/deleted | Re-upload and update |

---

## Escalation

If deliverable fails verification:
1. Do NOT mark as Ready
2. Add note in Airtable: "Missing: [what's missing]"
3. Notify agent via task assignment
4. Block dependent tasks until fixed

---

*This checklist exists because the Google Drive upload gap of 2026-02-05 taught us that implicit requirements get skipped. Make it explicit, make it checkable.*
