# Deploy: buildmytribe.ai Short URL Worker

**For**: Mike (CEO) — you own DNS and Cloudflare access
**Feature**: 036-pi-content-value-system
**Priority**: P1 (Tier 1 MVP blocker for April 15)

This document is the step-by-step to stand up `buildmytribe.ai` as a branded short-URL domain. Every post in weeks 3-4 of the PI lawyer campaign uses these vanity URLs. If this isn't deployed by T-24h before Day 15 publishing (April 14), the fallback is: posts temporarily use direct `theinnovativenative.com/resources/<slug>` URLs instead, and we convert back to vanity URLs after deploy (per spec.md FR-005 fallback).

---

## What You're Deploying

One Cloudflare Worker that implements a whitelist-only redirect map. Seven slugs for Tier 1. The Worker is in [worker.js](./worker.js). The slug → destination map is in [redirect-map.json](./redirect-map.json) (for reference — the Worker has the map baked in).

## Prerequisites (one-time)

1. **Domain control**: you own `buildmytribe.ai`. Verify via the registrar you bought it from.
2. **Cloudflare account**: free tier is sufficient (100k requests/day, unlimited Worker routes).
3. **DNS access**: you can change nameservers at the registrar.

## Step 1 — Add buildmytribe.ai to Cloudflare (if not already)

1. Log in to [dash.cloudflare.com](https://dash.cloudflare.com).
2. Click **Add a Site** → enter `buildmytribe.ai` → Continue.
3. Pick **Free** plan → Continue.
4. Cloudflare will scan existing DNS. Click Continue.
5. Cloudflare gives you 2 nameservers (e.g., `dara.ns.cloudflare.com` and `kurt.ns.cloudflare.com`).

## Step 2 — Point buildmytribe.ai DNS at Cloudflare

1. Go to your registrar (GoDaddy / Namecheap / wherever you bought the domain).
2. Find the DNS / Nameservers section for `buildmytribe.ai`.
3. Replace the existing nameservers with the two Cloudflare nameservers from Step 1.
4. Save.

**Propagation**: 5 minutes to 24 hours. Usually within an hour. Cloudflare will email you when active.

While you wait, continue with Step 3 — Workers can be deployed before DNS is live.

## Step 3 — Deploy the Worker

### Option A: Cloudflare dashboard (easiest, recommended)

1. Go to **Workers & Pages** → **Create application** → **Create Worker**.
2. Name the worker: `buildmytribe-shortener`.
3. Click **Deploy** (with default Hello World code).
4. After deploy, click **Edit code**.
5. Open `/Users/makwa/theinnovativenative/infrastructure/buildmytribe-shortener/worker.js` locally.
6. Select all contents, copy, paste into the Cloudflare editor — replace everything.
7. Click **Save and Deploy**.

### Option B: Wrangler CLI (if you prefer terminal)

```bash
# Install Wrangler if not already
npm install -g wrangler

# Auth
wrangler login

# From the buildmytribe-shortener directory
cd /Users/makwa/theinnovativenative/infrastructure/buildmytribe-shortener

# Create a minimal wrangler.toml if it doesn't exist:
cat > wrangler.toml <<'EOF'
name = "buildmytribe-shortener"
main = "worker.js"
compatibility_date = "2026-04-09"
EOF

# Deploy
wrangler deploy
```

## Step 4 — Bind the Worker to buildmytribe.ai

Once the Worker is deployed AND DNS has propagated:

1. In the Cloudflare dashboard, go to **Workers & Pages** → find `buildmytribe-shortener` → click the worker.
2. Click **Triggers** → **Add Custom Domain**.
3. Enter `buildmytribe.ai` → click **Add Custom Domain**.
4. Click **Add Route** (in the same Triggers page).
5. Enter route: `buildmytribe.ai/*`
6. Select the zone: `buildmytribe.ai`
7. Save.

Alternative for www: also add custom domain `www.buildmytribe.ai` if you want www to work.

## Step 5 — Verify

Run these curl commands from your terminal:

```bash
# Root → should 301 to /resources on theinnovativenative.com
curl -I https://buildmytribe.ai/
# Expected: HTTP/2 301, Location: https://theinnovativenative.com/resources

# Known slug → should 301 to correct resource
curl -I https://buildmytribe.ai/demand
# Expected: Location: https://theinnovativenative.com/resources/demand-letter-matrix

# Known slug with UTM params → should preserve query string
curl -I "https://buildmytribe.ai/demand?utm_source=linkedin&utm_campaign=test"
# Expected: Location: https://theinnovativenative.com/resources/demand-letter-matrix?utm_source=linkedin&utm_campaign=test

# Unknown slug → must return 404, NOT a redirect
curl -I https://buildmytribe.ai/nonexistent-slug-xyz123
# Expected: HTTP/2 404

# Full GET of unknown slug → should return plain text 404 body
curl https://buildmytribe.ai/nonexistent-slug-xyz123
# Expected: "Not Found\n\nThe short link 'nonexistent-slug-xyz123' does not exist..."
```

**All seven of these tests must pass before you mark the deploy complete.** The last two (unknown slug returning 404) are the security contract — if it redirects instead of 404ing, the Worker has an open-redirect vulnerability. Do not ship until fixed.

## Step 6 — Full Slug Acceptance Test

Run each Tier 1 slug:

```bash
for slug in math tools policy heppner risk colossus demand; do
  echo -n "buildmytribe.ai/$slug → "
  curl -sI "https://buildmytribe.ai/$slug" | grep -i "^location:" | tr -d '\r'
done
```

Expected output:

```
buildmytribe.ai/math → location: https://theinnovativenative.com/resources/442-intake-math
buildmytribe.ai/tools → location: https://theinnovativenative.com/resources/5-ai-tools-pi
buildmytribe.ai/policy → location: https://theinnovativenative.com/resources/ai-governance-template-pi
buildmytribe.ai/heppner → location: https://theinnovativenative.com/resources/heppner-one-pager
buildmytribe.ai/risk → location: https://theinnovativenative.com/resources/ai-tool-risk-chart
buildmytribe.ai/colossus → location: https://theinnovativenative.com/resources/insurance-ai-colossus
buildmytribe.ai/demand → location: https://theinnovativenative.com/resources/demand-letter-matrix
```

## Updating the Worker (future magnets)

When Tier 2 or Tier 3 magnets ship, add entries to `REDIRECT_MAP` in `worker.js`, redeploy via Step 3, and re-verify via Step 6.

Planned additions:
- **Tier 2 (Apr 15-21)**: `wrapper`, `automate`, `cms`, `discovery`
- **Tier 3 (Apr 21-28)**: `cost`, `audit`

## Rollback

If the Worker misbehaves:

1. Cloudflare dashboard → Workers & Pages → `buildmytribe-shortener` → **Deployments** tab
2. Click **Rollback** to the previous version
3. OR: delete the Custom Domain / Route binding to temporarily disable (buildmytribe.ai will 522 error but no harm done)

## Cost

Free tier: 100,000 requests/day, unlimited Worker routes. Campaign volume is a tiny fraction of that. No billing expected.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `buildmytribe.ai` returns Cloudflare "522 Connection timed out" | DNS not propagated yet, or Worker not bound to the domain. Wait or re-bind. |
| `buildmytribe.ai/demand` returns 404 instead of redirecting | Worker code doesn't have `demand` in `REDIRECT_MAP` — check you deployed the updated worker.js. |
| Unknown slug redirects instead of 404ing | **SECURITY BUG** — the worker has an open redirect. Do not use. Check `worker.js` REDIRECT_MAP lookup logic. |
| DNS propagation taking >24h | Check with the registrar that nameservers were saved correctly. |
| UTM params not preserved through redirect | Check `worker.js` `buildRedirect()` function — the `incomingSearch` logic must be intact. |

## Questions / Issues

- Worker source: [worker.js](./worker.js)
- Redirect map doc: [redirect-map.json](./redirect-map.json)
- Feature spec: [`specs/036-pi-content-value-system/spec.md`](../../specs/036-pi-content-value-system/spec.md) FR-032, FR-033, FR-034
- Security requirement: whitelist-only (FR-032), no open redirect
