# tinn.me Deployment Plan — Sink on Cloudflare

**Created**: 2026-04-20
**Status**: Ready to execute next session
**Estimated time**: 1-2 hours
**Prerequisites**: Cloudflare account access, tinn.me domain registered

---

## Step 1: Point tinn.me to Cloudflare (10 min)

1. Log into your domain registrar where you bought `tinn.me`
2. Change nameservers to Cloudflare:
   - `ada.ns.cloudflare.com`
   - `lee.ns.cloudflare.com`
   (Get exact nameservers from Cloudflare dashboard → Add Site → `tinn.me`)
3. In Cloudflare dashboard: Add site `tinn.me` → Free plan → Confirm
4. Wait for nameserver propagation (usually 5-30 min, can take up to 24 hrs)
5. Verify: Cloudflare shows `tinn.me` as Active

**Can do this NOW even before deploying Sink — propagation happens in background.**

---

## Step 2: Clone + Configure Sink (15 min)

```bash
# Clone Sink repo
cd /Users/makwa/theinnovativenative/projects
git clone https://github.com/miantiao-me/Sink.git tinn-me-shortener
cd tinn-me-shortener

# Install dependencies
npm install
```

### Configure `wrangler.toml`

Edit `wrangler.toml` to set:
```toml
name = "tinn-me"
compatibility_date = "2024-09-23"

[vars]
NUXT_SITE_TOKEN = "<generate-a-random-secret-for-admin-login>"
NUXT_HOME_URL = "https://theinnovativenative.com"
NUXT_CF_ACCOUNT_ID = "<your-cloudflare-account-id>"
NUXT_CF_API_TOKEN = "<cloudflare-api-token-with-analytics-read>"

[[kv_namespaces]]
binding = "KV"
id = "<create-kv-namespace-id>"
```

### Create KV Namespace

```bash
npx wrangler kv:namespace create "SINK_LINKS"
# Copy the ID into wrangler.toml
```

### Create Analytics Engine Dataset (for click tracking)

In Cloudflare dashboard:
1. Go to Workers & Pages → Analytics Engine
2. Create dataset named `tinn_me_clicks`
3. Copy the dataset binding into wrangler.toml if required

### Set the Site Token (admin password)

```bash
npx wrangler secret put NUXT_SITE_TOKEN
# Enter a strong random string — this is your admin login password
```

---

## Step 3: Deploy to Cloudflare Workers (5 min)

```bash
# Build + deploy
npm run build
npx wrangler deploy

# Verify it's running
npx wrangler tail  # Watch live logs
```

Test: `curl https://tinn-me.<your-workers-subdomain>.workers.dev`
Should show the Sink dashboard login page.

---

## Step 4: Connect Custom Domain (5 min)

In Cloudflare dashboard:
1. Go to Workers & Pages → `tinn-me` worker
2. Settings → Triggers → Custom Domains
3. Add `tinn.me`
4. Cloudflare auto-provisions SSL and routes all traffic to the Worker

Test: `https://tinn.me` should show the Sink login page.

---

## Step 5: First Links (5 min)

1. Go to `https://tinn.me`
2. Login with your site token
3. Create your first links:

| Slug | Destination | Purpose |
|------|------------|---------|
| `AIquiz` | `https://theinnovativenative.com/quiz/ai-readiness` | AI Readiness quiz |
| `AIquiz-b` | `https://theinnovativenative.com/quiz/ai-readiness?v=b` | Quiz variant B |
| `law-quiz` | `https://theinnovativenative.com/quiz/law-firm-audit` | Law firm quiz |
| `law-quiz-b` | `https://theinnovativenative.com/quiz/law-firm-audit?v=b` | Quiz variant B |
| `call` | `https://calendly.com/theinnovativenative/discovery` | Calendly booking |
| `cerebro` | `https://theinnovativenative.com/law-firm-rag` | Cerebro product page |
| `classroom` | `https://theinnovativenative.com/classroom` | Classroom/courses |
| `linkedin` | `https://www.linkedin.com/in/michael-soto-7134ba158/` | LinkedIn profile |

4. Test each: click `tinn.me/AIquiz` → should redirect to quiz page
5. Check analytics: back in Sink dashboard, click counts should increment

---

## Step 6: n8n Integration (15 min)

### Create an API token for Sink

Sink uses the site token for API auth. The API endpoint for creating links:

```
POST https://tinn.me/api/link/create
Headers:
  Authorization: Bearer <NUXT_SITE_TOKEN>
  Content-Type: application/json
Body:
  {
    "url": "https://theinnovativenative.com/quiz/ai-readiness",
    "slug": "lf-t3-js"
  }
```

### n8n Workflow: "tinn.me — Auto-Shorten for Outreach"

1. Create new n8n workflow
2. Add HTTP Request node:
   - Method: POST
   - URL: `https://tinn.me/api/link/create`
   - Auth: Header Auth → `Authorization: Bearer <token>`
   - Body: JSON with `url` and `slug` fields
3. Call this from the outreach engine before sending each email
4. Insert the returned short URL into the email body

### n8n Workflow: "tinn.me — Click Webhook Logger" (optional enhancement)

If Sink doesn't natively fire webhooks on click, add a lightweight Cloudflare Worker middleware:

1. Fork Sink's redirect handler
2. After the redirect, fire an async POST to your n8n webhook with click data
3. n8n writes to Airtable `Link Clicks` table

**Note**: Check if Sink already has webhook support or an event system before building this. The Analytics Engine may be sufficient for your needs without Airtable.

---

## Step 7: Bookmarklet (5 min)

Create a bookmarklet that opens Sink's create-link page with the current URL pre-filled:

```javascript
javascript:void(window.open('https://tinn.me/dashboard?url='+encodeURIComponent(location.href),'tinn','width=500,height=400'))
```

Drag this to your bookmarks bar. Click it on any page → Sink opens with the URL ready to shorten.

**If Sink's dashboard doesn't support URL pre-fill via query param**, the alternative is:
1. Copy the current page URL to clipboard
2. Open `tinn.me` in a new tab
3. Paste + create

Still only 3 actions. The bookmarklet can be enhanced later to call the API directly and auto-copy.

---

## What You Get When Done

```
tinn.me/AIquiz     → theinnovativenative.com/quiz/ai-readiness     (14 chars)
tinn.me/law-quiz   → theinnovativenative.com/quiz/law-firm-audit   (16 chars)  
tinn.me/call       → calendly.com/discovery                         (12 chars)
tinn.me/cerebro    → theinnovativenative.com/law-firm-rag           (15 chars)
```

**Analytics per link**: clicks, devices, browsers, countries, referrers, timeline — all in the Sink dashboard at `tinn.me`.

**Cost**: $0/month (Cloudflare free tier).

**To create a link**: Log into `tinn.me` → paste URL → set slug → done. Or use the bookmarklet. Or have n8n do it automatically.

---

## Risks + Mitigations

| Risk | Mitigation |
|------|-----------|
| Sink API doesn't match what we need | Fork the repo, it's open source. Modify as needed. |
| Cloudflare Analytics Engine quota | Free tier handles 100K events/day. Not a concern. |
| Nameserver propagation delay | Start Step 1 first. Build everything else while DNS propagates. |
| Sink updates break our fork | Pin to a specific commit. Only pull upstream updates intentionally. |
| tinn.me looks spammy to email filters | Short domains can trigger spam filters. Warm the domain by sending legitimate links first. Build reputation over 2-4 weeks before heavy outreach. |

---

## Domain Warming (Important for Email Outreach)

Before using `tinn.me` links in cold email:
1. **Week 1**: Use only in personal DMs and warm conversations
2. **Week 2**: Use in LinkedIn posts and social media
3. **Week 3**: Use in emails to existing contacts (warm list)
4. **Week 4+**: Use in cold outreach

This builds domain reputation so email providers don't flag `tinn.me` links as suspicious.
