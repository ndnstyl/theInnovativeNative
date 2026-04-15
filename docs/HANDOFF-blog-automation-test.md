# Handoff — Blog Automation Test (2026-04-15)

**Goal**: Verify the full autonomous pipeline ships one blog post to production without human intervention past this one test.

Every step has an **expected result**. If it doesn't match, STOP and read the "If it fails" line.

---

## Resources created this session

| Resource | ID / Location | State |
|----------|---------------|-------|
| Airtable Heartbeats table | `tbl2yOITasZ1XBCzD` in `appTO7OCRB2XbAlak` | Live, 1 seed row |
| n8n workflow — new SEO v2 | `35okkSwMNRTfOkkL` "SEO - Blog to GitHub (v2)" | **Inactive** (awaiting your test) |
| n8n workflow — fleet monitor | `fr2FYITxEnrBT2Oo` "Fleet Monitor - Heartbeats" | **Inactive** |
| GitHub Actions | `.github/workflows/blog-deploy.yml` | Committed but secrets needed |
| Spec | `.specify/features/001-n8n-nextjs-blog-migration/tasks.md` | Un-archived, ready |
| Old SEO workflow (v1) | `brKB4Eu4nY1Fz4KT` "SEO - Cluster & Trend Blog Post" | **Still active** — disable when v2 passes |

Direct links:
- n8n base: `https://n8n.srv948776.hstgr.cloud`
- SEO v2: `https://n8n.srv948776.hstgr.cloud/workflow/35okkSwMNRTfOkkL`
- Fleet Monitor: `https://n8n.srv948776.hstgr.cloud/workflow/fr2FYITxEnrBT2Oo`

---

## Step 1 — Add GitHub credential to n8n (one-time setup)

**Why**: The "Commit Markdown to GitHub" node in SEO v2 needs a PAT to push commits.

1. Create GitHub PAT at <https://github.com/settings/tokens/new>
   - Name: `n8n-seo-blog-poster`
   - Expiration: 1 year
   - Scope: `repo` (private repos) — full repo scope is needed for Contents API write.
2. In n8n UI → Credentials → New → "GitHub API" → paste PAT → save as name `GitHub (ndnstyl)`.
3. Open workflow `35okkSwMNRTfOkkL` → click "Commit Markdown to GitHub" node → select the credential → Save.

**Expected**: Node shows green check, no red warning.
**If it fails**: Wrong PAT scope. Regenerate with `repo` scope explicitly.

---

## Step 2 — Add GitHub repo secrets (one-time setup)

In `https://github.com/ndnstyl/theInnovativeNative/settings/secrets/actions`, add:

| Secret | Value |
|--------|-------|
| `A2_SSH_KEY` | Full contents of `~/.ssh/a2hosting_tin` (private key, multiline, include BEGIN/END lines) |
| `AIRTABLE_PAT` | Same token `~/.claude/.mcp.json` → `airtable-mcp.env.AIRTABLE_API_KEY` |

**Expected**: Both secrets show in the list.
**If it fails**: You likely pasted the public key (`.pub`). Use the private key (no `.pub`).

---

## Step 3 — Manual test of SEO v2 workflow (end-to-end, no cron)

1. Open `35okkSwMNRTfOkkL` in n8n.
2. Make sure **v1 is still running its scheduled cycle** — no conflict since v1 and v2 target the same Google Sheet. To avoid double-pulling a cluster row during this test, either:
   - (A) Temporarily deactivate v1, OR
   - (B) Accept that v2 may consume a cluster row; v1 will skip-or-duplicate it next cycle.
3. Click **Execute Workflow** (top right).

**Expected** in order:
- Schedule Trigger: success (manual trigger bypasses cron)
- Grab New Cluster: 1 row from sheet
- Preliminary Plan → AI Agent → Create plan → Write blog: each passes through with Gemini/Perplexity output
- Previous Posts → Aggregate → Add internal links → **Markdown version** (new): this is the critical new node. Inspect output — should be valid markdown starting with `---` frontmatter.
- Slug → Title → Meta Description → Image Covers → Edit Fields → **Prep for GitHub** (new)
- **Commit Markdown to GitHub** (new): should return a commit SHA. Verify on GitHub that `projects/website/content/blog/posts/<new-slug>.md` now exists.
- **Write Heartbeat (Airtable)** (new): should return the new record ID. Check Airtable Heartbeats table — new row with `workflow_name = "SEO - Blog to GitHub (v2)"`, `status = "success"`.
- Check as completed on Sheets → Log Completed URL: Google Sheets updated.

**If Markdown version output isn't valid markdown**: Gemini prompt may need temperature nudge. Edit node → Options → set temperature 0.1 → save.

**If GitHub commit fails with 401/403**: PAT scope is wrong. Redo Step 1.

**If Heartbeat record writes nothing**: Airtable credential isn't wired. Open the Airtable node, select `airtableTokenApi` credential (id `YCWFwTIXwnTpVy2y`).

**If Check as completed on Sheets errors about "Range is required"**: (validator flagged this) — click the node → select `Range` field → set to full sheet. Save.

---

## Step 4 — Verify GitHub Actions deployed the post

The commit from Step 3 should have triggered `.github/workflows/blog-deploy.yml`.

1. Go to <https://github.com/ndnstyl/theInnovativeNative/actions>
2. Look for a run named after the commit message `content: auto-post — <title>`.
3. Watch the run. Timeline should be ~3-5 min:
   - Checkout → Setup Node → Install deps → Build static site (~2 min) → Deploy via rsync (~30s) → Fix directory index files → Write heartbeat

**Expected**:
- Green check mark.
- A second heartbeat row in Airtable with `workflow_name = "github-actions.blog-deploy"`, `status = "success"`.
- Visiting `https://theinnovativenative.com/blog/<new-slug>` returns the post (200 OK, styled correctly).

**If build fails**: `npm ci` broke. Pull main locally, run `npm ci` in `projects/website/`, fix lockfile drift.
**If rsync fails**: `A2_SSH_KEY` secret has wrong content. Must be the PRIVATE key, multiline, unchanged.
**If post 404s**: Static export didn't pick up the new slug. Check `projects/website/src/pages/blog/[slug].tsx` `getStaticPaths`. If it reads the posts directory at build time, a fresh `npm run build` should include it.

---

## Step 5 — Activate workflows

Only after Steps 3 and 4 passed cleanly:

1. In n8n UI, **deactivate** `brKB4Eu4nY1Fz4KT` (the old WordPress-targeted v1). Otherwise it'll keep burning API calls for nothing.
2. **Activate** `35okkSwMNRTfOkkL` (SEO v2).
3. **Activate** `fr2FYITxEnrBT2Oo` (Fleet Monitor).

The next scheduled run of SEO v2 is whatever v1 was set to — currently **every 4 days at 6:07 am**. Fleet Monitor runs every 30 min.

---

## Known validator warnings (can ignore)

The n8n validator flagged these as "errors" but they're false positives — v1 uses identical node shapes and ran fine:

- **"Build Alert Payload: Cannot return primitive values directly"** — the code node returns a proper `[{json: {...}}]` array. n8n runtime accepts it. Validator heuristic is off.
- **"Check as completed on Sheets: Range is required"** — inherited from v1 where the field is implicit from the columns mapping. If the node errors at runtime, fix per Step 3 instructions.
- **typeVersion warnings** — all inherited from v1. Leave alone unless a node starts failing.

Real issues that WILL prevent execution:
- Missing GitHub credential → Step 1
- Missing GitHub repo secrets → Step 2
- Wrong channel ID in Fleet Monitor Slack node → verify `#agent-alerts` exists in TIN Slack workspace (or change to `#brain-input` which definitely exists, ID `C0ANE55T3S9`)

---

## Success criteria (binary)

By 2026-04-22, all four must be true:

1. A new `.md` file exists in `projects/website/content/blog/posts/` that was NOT in git as of 2026-04-15.
2. `https://theinnovativenative.com/blog/<that-slug>` returns 200 with a styled article.
3. Airtable Heartbeats table has at least 3 distinct `workflow_name` values with recent `last_run_at`: `SEO - Blog to GitHub (v2)`, `github-actions.blog-deploy`, `Fleet Monitor - Heartbeats`.
4. No unresolved red alerts in `#agent-alerts`.

If any criterion fails, log the failure as a comment on the Airtable row in Tasks with ID of task 18 (blocked T018 in spec tasks.md).
