# Deploy Safety System

Built after the **2026-05-02** incident (rsync --delete wiped generational-wealth/ + quiz/ off production) and the **2026-05-19** discovery (blog subdomain has been NXDOMAIN for unknown duration; site work split across diverging branches with thousands of untracked files).

## The five-part defense

### 1. Single canonical branch: `blog-extraction`

All website + blog + content work lives here. Other branches are archived or deleted.

The `036-pi-content-value-system` branch and `blog-extraction` were merged on 2026-05-19 (commit `8882b33`). No more sprawl.

### 2. Pre-deploy manifest check (`scripts/deploy-preflight.sh`)

Records the canonical page list in `scripts/pages-manifest.json`. Before any deploy:

- Verifies `out/` exists and is fresh (built in last 30 min)
- Compares actual pages to the manifest
- **Aborts deploy if pages are missing**
- Logs every successful preflight to `.deploy-history/`

To update the manifest after intentional page additions/removals:

```bash
./scripts/deploy-preflight.sh --update-manifest
git add scripts/pages-manifest.json
git commit -m "chore: refresh deploy manifest"
```

This makes the May 2 type of wipe **structurally impossible** — the workflow refuses to deploy when pages are missing.

### 3. Safe CI/CD auto-deploy (`.github/workflows/deploy-website.yml`)

Replaces the manual-only rule with a guarded auto-deploy on push to `blog-extraction` or `main`:

```
push → npm ci → npm run build → preflight check → rsync (NO --delete) → CF cache purge → log receipt
```

If preflight fails, deploy is REFUSED and the workflow run is red. The previous deploy stays live.

**Required GitHub secrets** (set once in repo Settings → Secrets):
- `A2_SSH_KEY` — contents of `~/.ssh/a2hosting_tin`
- `A2_HOST` — `75.98.175.76`
- `A2_USER` — `delikate`
- `A2_PORT` — `7822`
- `A2_DOC_ROOT` — `~/theinnovativenative.com/`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_LEAD_WEBHOOK_URL`
- `NEXT_PUBLIC_GA4_ID`
- `CF_ZONE_ID` — `b643f4d3f01f9358cd310e5eafddaaba` (per `cloudflare_setup.md`)
- `CF_API_TOKEN` — Cloudflare API token with cache_purge permission

### 4. URL + DNS health monitor (`.github/workflows/url-health.yml`)

Runs every 2 hours. Checks:
- DNS resolution for apex + critical subdomains
- HTTP 200 for the homepage, quizzes, generational-wealth, resources, lead-magnet PDF
- Special tracking for the blog subdomain (currently NXDOMAIN)

**On any failure, auto-opens a GitHub issue** labeled `url-health`. Subsequent failures append to the same issue rather than spamming. Close the issue when fixed.

This catches the "silent breakage" failure mode (blog DNS dropped, nobody noticed for weeks).

### 5. Post-checkout guard (`scripts/git-hooks/post-checkout`)

Warns on branch switch when critical-path untracked files exist on disk but not in the new branch. Prevents the "trailing files survive branch switch" pattern.

Install:
```bash
cp scripts/git-hooks/post-checkout .git/hooks/
chmod +x .git/hooks/post-checkout
```

(Hooks are not auto-committed by git design. Install once per clone.)

## Manual deploy fallback (when CI is offline)

If GitHub Actions is down and you need to deploy by hand:

```bash
# 1. Build fresh
cd projects/website && npm run build

# 2. Preflight
cd ../.. && ./scripts/deploy-preflight.sh

# 3. ONLY IF PREFLIGHT PASSES, deploy
rsync -avz --chmod=D755,F644 \
  -e "ssh -i ~/.ssh/a2hosting_tin -p 7822 -o IdentitiesOnly=yes" \
  --exclude='theinnovativenative-site.zip' \
  --exclude='resumes/' --exclude='videos/' --exclude='n8n-templates/' \
  projects/website/out/ \
  delikate@75.98.175.76:~/theinnovativenative.com/

# 4. Fix directory index files (REQUIRED)
ssh -i ~/.ssh/a2hosting_tin -p 7822 -o IdentitiesOnly=yes delikate@75.98.175.76 \
  "cd ~/theinnovativenative.com && for name in blog classroom community members messages templates admin checklist checkout auth generational-wealth quiz resources settings; do [ -f \${name}.html ] && [ -d \${name} ] && cp \${name}.html \${name}/index.html 2>/dev/null; done"

# 5. Cloudflare cache purge (manual via dashboard, or via curl if you have CF_API_TOKEN)
```

**NEVER use `--delete` in rsync without explicit preflight + intent. That's what caused the May 2 incident.**

## What's still on Mike's plate (the one manual thing)

The blog subdomain `blog.theinnovativenative.com` returns NXDOMAIN. The redirect from `theinnovativenative.com/blog → blog.theinnovativenative.com/blog` therefore points nowhere.

**To restore the blog**: log into Cloudflare → DNS → add a CNAME record for `blog` pointing to your Cloudflare Pages project (or remove the redirect rule and serve `/blog` directly from the A2-hosted main site).

Once DNS is fixed, the URL health monitor will detect it's back and close the issue automatically.

## Recovery from a future incident

If something breaks again:

1. **Check** `.deploy-history/` for the last verified deploy
2. **Check** GitHub Actions runs for failed health checks or deploys
3. **Roll back** by re-deploying the last good SHA: `git checkout <sha> && ./scripts/deploy-preflight.sh && [manual deploy steps]`
4. **Investigate** the diff between last good and current state

The system is now designed so that this is observable, recoverable, and rare.
