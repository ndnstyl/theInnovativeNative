# Feature Spec: tinn.me — Branded URL Shortener + Link Intelligence

**Feature ID**: tinn-me-shortener
**Created**: 2026-04-20
**Status**: Spec Complete
**Owner**: Mike
**Domain**: `tinn.me` (purchased)

---

## 1. Purpose

Build a zero-friction branded URL shortener on `tinn.me` that:
- Creates trackable short links in **2 clicks or less** from anywhere
- Captures **full marketing analytics** on every click (device, geo, referrer, UTM, timestamp)
- Is **built into the TIN website** as an admin tool (not a separate service)
- Feeds data into the existing Airtable + n8n pipeline for attribution
- Works as a **bookmarklet** (one click from any page), **admin dashboard** (on the website), and **n8n API** (automated link creation in workflows)

**This replaces**: Bitly, Google URL builder, manual UTM tagging, untracked raw links.

---

## 2. Architecture

```
                          ┌─────────────────────────────┐
                          │     LINK CREATION            │
                          │  (choose your weapon)        │
                          ├─────────────────────────────┤
                          │ 1. Website admin panel       │
                          │ 2. Browser bookmarklet       │
                          │ 3. n8n HTTP Request node      │
                          │ 4. Direct API call            │
                          └──────────┬──────────────────┘
                                     │ POST tinn.me/api/create
                                     │ { url, slug?, tags?, campaign? }
                                     ▼
                    ┌────────────────────────────────┐
                    │    CLOUDFLARE WORKER (tinn.me)  │
                    │    ~80 lines of JS              │
                    ├────────────────────────────────┤
                    │ KV Store: slug → destination    │
                    │ + metadata (created, tags, etc) │
                    └──────┬─────────────────────────┘
                           │
            ┌──────────────┴──────────────────┐
            │ ON EVERY CLICK (tinn.me/{slug})  │
            │                                  │
            │ 1. Look up slug in KV            │
            │ 2. Log click data:               │
            │    - timestamp                   │
            │    - IP (hashed, not stored raw) │
            │    - user-agent → device/browser │
            │    - referer header              │
            │    - geo (Cloudflare cf- headers) │
            │    - UTM params if present       │
            │ 3. Fire webhook to n8n           │
            │    (async, non-blocking)         │
            │ 4. 302 redirect to destination   │
            │                                  │
            │ Total latency: <15ms             │
            └──────────────────────────────────┘
                           │
                           ▼ (async webhook)
                    ┌──────────────────┐
                    │   n8n WORKFLOW    │
                    │  "Link Click Log" │
                    ├──────────────────┤
                    │ → Airtable row    │
                    │   (Link Clicks)   │
                    │ → GA4 Measurement │
                    │   Protocol (opt)  │
                    │ → Slack alert     │
                    │   (hot links)     │
                    └──────────────────┘
```

### Why Cloudflare Workers (Not the Website Server)

- Your site is **static export** (`output: 'export'`). No server to run redirects.
- Cloudflare Workers run at 300+ edge locations. **Sub-15ms** redirect latency. Zero cold starts.
- Your Cloudflare account already exists (zone `b643f4d3f01f9358cd310e5eafddaaba`).
- Free tier: 100K requests/day (3M/month). You won't touch this for years.
- KV free tier: 100K reads/day, 1K writes/day. More than enough.

### Why the Admin Panel Lives on Your Website (Not on tinn.me)

- The Worker on `tinn.me` handles only redirects + click logging. It's fast and dumb.
- The admin panel lives at `theinnovativenative.com/admin/links` — behind your existing auth.
- Creating links, viewing analytics, managing slugs — all on your site, talking to the Worker API.
- Separation of concerns: redirect plane (fast, edge) vs management plane (rich UI, authenticated).

---

## 3. Link Creation — The 3 Methods

### Method 1: Website Admin Panel (`/admin/links`)

**Location**: `theinnovativenative.com/admin/links` (behind existing site auth or a simple password gate)

**UI**: Single-page dashboard with two zones:

**Zone A — Create Link (top)**
```
┌──────────────────────────────────────────────────────┐
│  Paste any URL                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ https://theinnovativenative.com/quiz/ai-readiness │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  Slug: [  AIquiz  ] (auto-generated, editable)        │
│  Tags: [ quiz, ai, outreach ]  (comma-separated)     │
│  Campaign: [ april-linkedin ]  (optional)             │
│                                                        │
│  [ 🔗 Create tinn.me/AIquiz ]                        │
│                                                        │
│  ✓ Created! tinn.me/AIquiz  [ 📋 Copy ]              │
└──────────────────────────────────────────────────────┘
```

- Paste URL → auto-generates a slug (from the page path or random 5-char)
- Editable slug (custom vanity names)
- Optional tags + campaign name (for filtering analytics later)
- One click to create → short link appears with copy button
- **Total friction: paste URL + click Create + click Copy = 3 actions**

**Zone B — Link Table (below)**
```
┌────────────┬──────────────────────────────┬────────┬──────────┬────────┐
│ Short Link │ Destination                  │ Clicks │ Created  │ Tags   │
├────────────┼──────────────────────────────┼────────┼──────────┼────────┤
│ /AIquiz    │ .../quiz/ai-readiness        │ 142    │ Apr 20   │ quiz   │
│ /law-quiz  │ .../quiz/law-firm-audit      │ 87     │ Apr 20   │ quiz   │
│ /call      │ calendly.com/...             │ 23     │ Apr 18   │ cta    │
│ /cerebro   │ .../law-firm-rag             │ 56     │ Apr 15   │ legal  │
└────────────┴──────────────────────────────┴────────┴──────────┴────────┘
```

- Sortable by clicks, date, tags
- Search/filter by slug or tag
- Click any row to see click detail (device breakdown, geo, referrers, timeline)
- Edit slug, delete link
- Inline click count updates (fetched from KV metadata or Airtable)

**Click Detail View (expandable row or modal)**
```
tinn.me/AIquiz — 142 clicks

Devices:    Mobile 68% | Desktop 29% | Tablet 3%
Browsers:   Chrome 52% | Safari 31% | Firefox 8% | Other 9%
Top Geo:    US 78% | UK 8% | CA 5% | Other 9%
Top Referrer: linkedin.com 45% | direct 32% | facebook.com 12%
By Day:     [sparkline chart or simple bar]
```

### Method 2: Browser Bookmarklet (ONE CLICK)

**How it works**: Drag a link to your bookmarks bar. When you're on ANY page, click the bookmarklet → it creates a short link for that page and copies it to your clipboard. Done.

**The bookmarklet code** (JavaScript that runs on click):
```javascript
javascript:void(function(){
  var u=encodeURIComponent(location.href);
  var t=encodeURIComponent(document.title);
  var w=window.open(
    'https://theinnovativenative.com/admin/links?url='+u+'&title='+t+'&bookmarklet=1',
    'tinn_me','width=480,height=400,toolbar=0,menubar=0'
  );
})()
```

- Opens a small popup window with the URL pre-filled
- Auto-generates slug from the page title
- One click: "Create" → link is created + copied to clipboard
- Close the popup. Done.
- **Total friction: 1 click (bookmarklet) + 1 click (Create) = 2 actions**

**Popup UI** (compact version of the admin panel):
```
┌─────────────────────────────────┐
│ 🔗 Shorten with tinn.me        │
│                                 │
│ URL: quiz/ai-readiness          │
│ Slug: [ AIquiz ]               │
│ Tags: [ quiz ]                  │
│                                 │
│ [ Create & Copy ]               │
│                                 │
│ ✓ tinn.me/AIquiz copied!       │
└─────────────────────────────────┘
```

### Method 3: n8n API (Automated, Zero Friction)

**Use case**: When the outreach engine builds email sequences, it auto-generates short links for every URL in the email body.

**n8n HTTP Request node**:
```
POST https://tinn.me/api/create
Headers:
  Authorization: Bearer {TINN_API_KEY}
  Content-Type: application/json
Body:
  {
    "url": "https://theinnovativenative.com/quiz/ai-readiness?utm_source=cerebro&utm_medium=email&utm_campaign=law-firm-45day&utm_content=touch-3",
    "slug": "lf-t3-quiz",
    "tags": ["outreach", "law-firm", "touch-3"],
    "campaign": "law-firm-45day"
  }
Response:
  {
    "shortUrl": "https://tinn.me/lf-t3-quiz",
    "slug": "lf-t3-quiz",
    "created": "2026-04-20T18:30:00Z"
  }
```

- Outreach engine calls this for every link in every email
- Each link gets a unique slug encoding the campaign/touch/recipient
- Click data flows back through the webhook → Airtable → attribution
- **Total friction: 0 (fully automated)**

### Method 4: Direct API (for developers/integrations)

Same API as Method 3, callable from anywhere:
```bash
curl -X POST https://tinn.me/api/create \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com","slug":"demo"}'
```

---

## 4. Click Analytics — What Gets Tracked

Every click through `tinn.me/{slug}` captures:

| Data Point | Source | Stored As |
|-----------|--------|-----------|
| **Timestamp** | `Date.now()` | ISO 8601 |
| **Slug** | URL path | string |
| **Destination** | KV lookup | string |
| **Device type** | User-Agent parse | `mobile` / `desktop` / `tablet` |
| **Browser** | User-Agent parse | `chrome` / `safari` / `firefox` / `edge` / `other` |
| **OS** | User-Agent parse | `ios` / `android` / `windows` / `macos` / `linux` / `other` |
| **Country** | Cloudflare `cf-ipcountry` header | 2-letter ISO code |
| **City** | Cloudflare `cf.city` | string (approximate) |
| **Referrer** | `Referer` header | domain extracted (e.g., `linkedin.com`) |
| **UTM Source** | Query param `utm_source` on short link | string or null |
| **UTM Medium** | Query param `utm_medium` | string or null |
| **UTM Campaign** | Query param `utm_campaign` | string or null |
| **UTM Content** | Query param `utm_content` | string or null |
| **IP hash** | SHA-256 of IP + daily salt | For unique visitor approximation (not PII) |
| **Tags** | From link metadata | array |
| **Campaign** | From link metadata | string |

**Privacy**: Raw IP addresses are NEVER stored. Only a hashed version for unique-visitor approximation, rotated daily.

**UTM passthrough**: If someone clicks `tinn.me/AIquiz?utm_source=linkedin`, those UTM params are:
1. Logged in the click record
2. Appended to the destination URL before redirect (so GA4/GTM on the destination page also captures them)

---

## 5. Cloudflare Worker — Implementation

### Worker Script (`tinn-me-worker.js`)

The Worker handles 3 routes:

| Route | Method | Auth | Purpose |
|-------|--------|------|---------|
| `tinn.me/{slug}` | GET | None | Redirect + track click |
| `tinn.me/api/create` | POST | Bearer token | Create new short link |
| `tinn.me/api/links` | GET | Bearer token | List all links (for admin panel) |
| `tinn.me/api/links/{slug}` | GET | Bearer token | Get link details + click count |
| `tinn.me/api/links/{slug}` | DELETE | Bearer token | Delete a link |
| `tinn.me/api/clicks/{slug}` | GET | Bearer token | Get click log for a slug |

### KV Store Structure

**Namespace: `TINN_LINKS`**

Each key is the slug. Value is JSON:
```json
{
  "url": "https://theinnovativenative.com/quiz/ai-readiness",
  "created": "2026-04-20T18:30:00Z",
  "tags": ["quiz", "ai"],
  "campaign": "april-linkedin",
  "clicks": 142
}
```

**Namespace: `TINN_CLICKS`** (optional, for detailed logs)

Each key is `{slug}:{timestamp}`. Value is the click record JSON. TTL: 90 days (auto-expire old click data to stay within KV limits).

Alternatively, skip KV for click storage entirely — just fire the webhook to n8n and let Airtable be the click database. This is simpler and keeps KV usage minimal.

### Slug Generation

When no custom slug is provided:
1. Extract the path from the URL: `/quiz/ai-readiness` → `ai-readiness`
2. If that slug is taken, append a random 3-char suffix: `ai-readiness-x7k`
3. If the URL has no meaningful path, generate a random 5-char alphanumeric: `k8m2n`

### Auth

- API key stored as a Cloudflare Worker secret (`TINN_API_KEY`)
- All `/api/*` routes require `Authorization: Bearer {key}`
- Redirect route (`/{slug}`) requires NO auth — public by design
- Admin panel on the website stores the API key in `.env.local`

---

## 6. Website Admin Panel — Implementation

### Location

`theinnovativenative.com/admin/links`

Protected by the same password gate as other admin pages (or a separate simple auth check).

### Tech Stack

- React page in existing Next.js site (Pages Router, static export)
- Calls `tinn.me/api/*` endpoints via `fetch()` with Bearer token
- No new database — all data lives in Cloudflare KV (links) and Airtable (click logs)
- SCSS styled to match site dark theme

### New Files

```
src/pages/admin/links.tsx          ← Main admin panel page
src/components/admin/
  LinkCreator.tsx                  ← URL input + slug + tags + create button
  LinkTable.tsx                    ← Sortable table of all links
  LinkDetail.tsx                   ← Click analytics for a single link
  BookmarkletInstall.tsx           ← Drag-to-install bookmarklet + instructions
src/styles/sections/
  _admin-links.scss                ← Admin panel styles
```

### Bookmarklet Popup

When the admin page detects `?bookmarklet=1&url=...` in the query string:
- Render a compact popup-optimized layout (no sidebar, no header, just the create form)
- Auto-fill the URL from the query param
- Auto-generate slug from the title param
- After creation: show "Copied!" message, auto-close after 2 seconds

---

## 7. n8n Workflows

### Workflow 1: "tinn.me — Click Logger"

**Trigger**: Webhook (receives click data from Cloudflare Worker)

**Steps**:
1. Parse click payload
2. Create Airtable record in `Link Clicks` table:
   - Fields: Slug, Destination, Timestamp, Device, Browser, OS, Country, City, Referrer, UTM Source, UTM Medium, UTM Campaign, UTM Content, Tags, Campaign
3. Increment click counter in a `Links` summary table (or use Airtable rollup)
4. **If slug matches a "hot link" pattern** (e.g., quiz results, Calendly booking):
   - Slack notification: "🔗 Hot click: {slug} from {country} via {referrer}"
5. **Optional**: Fire GA4 Measurement Protocol event for server-side conversion tracking

### Workflow 2: "tinn.me — Auto-Shorten Outreach Links"

**Trigger**: Called by the outreach engine before sending emails

**Steps**:
1. Receive: destination URL, campaign name, touch number, contact name
2. Generate slug: `{campaign-prefix}-{touch}-{contact-initials}` (e.g., `lf-t3-js`)
3. POST to `tinn.me/api/create` with slug + tags
4. Return short URL to the calling workflow
5. Outreach engine inserts `tinn.me/lf-t3-js` into the email body instead of the raw URL

### Airtable Tables

**New table: `Link Clicks`** (in base `appTO7OCRB2XbAlak`)

| Field | Type | Notes |
|-------|------|-------|
| Slug | Single line | The short link slug |
| Destination | URL | Where the click went |
| Clicked At | Date/time | UTC timestamp |
| Device | Single select | mobile / desktop / tablet |
| Browser | Single select | chrome / safari / firefox / edge / other |
| OS | Single select | ios / android / windows / macos / linux / other |
| Country | Single line | 2-letter ISO |
| City | Single line | Approximate |
| Referrer | Single line | Domain only |
| UTM Source | Single line | |
| UTM Medium | Single line | |
| UTM Campaign | Single line | |
| UTM Content | Single line | |
| Tags | Multiple select | From link metadata |
| Campaign | Single line | From link metadata |

**New table: `Short Links`** (summary/management)

| Field | Type | Notes |
|-------|------|-------|
| Slug | Single line | Primary key |
| Destination | URL | |
| Clicks | Number | Rollup or manually incremented |
| Created | Date/time | |
| Tags | Multiple select | |
| Campaign | Single line | |
| Status | Single select | active / archived |

---

## 8. DNS Setup

### Cloudflare Configuration

1. Add `tinn.me` to your Cloudflare account (change nameservers at registrar)
2. Add DNS records:
   - `A` record: `tinn.me` → `192.0.2.1` (dummy, proxied — Worker intercepts)
   - `AAAA` record: `tinn.me` → `100::` (dummy, proxied)
3. Create Worker route: `tinn.me/*` → `tinn-me-worker`
4. SSL: Full (Cloudflare handles HTTPS automatically)

---

## 9. Security

| Concern | Mitigation |
|---------|-----------|
| API key exposure | Stored as Cloudflare Worker secret + `.env.local` on website. Never in client-side code. |
| Abuse (someone creating spam links) | API is key-protected. Only Mike/automations can create links. |
| Open redirect vulnerability | Validate destination URLs: must start with `https://` and be on an allowlist of domains (or at least not be a known phishing domain). |
| Click fraud | IP hashing with daily rotation for unique visitor dedup. Rate limiting on the Worker (optional). |
| PII | No raw IPs stored. Geo data is approximate (city level). User-agent is parsed, not stored raw. |
| Link enumeration | Slugs are either custom (unpredictable) or random 5-char (1.6M combinations). No sequential IDs. |

---

## 10. Cost

| Component | Cost |
|-----------|------|
| `tinn.me` domain | Already purchased |
| Cloudflare Workers (free tier) | $0 (100K req/day) |
| Cloudflare KV (free tier) | $0 (100K reads/day, 1K writes/day) |
| Airtable (existing base) | $0 incremental |
| n8n (existing instance) | $0 incremental |
| **Total** | **$0/month** |

If you hit KV write limits (1K/day = 1,000 new links per day), paid KV is $5/mo for 1M writes. You won't hit this.

---

## 11. Build Sequence

### Phase 1: Core (Day 1 — ~3 hours)
1. Add `tinn.me` to Cloudflare, configure DNS
2. Create KV namespaces (`TINN_LINKS`, optionally `TINN_CLICKS`)
3. Write + deploy Cloudflare Worker (redirect + create API)
4. Test: create a link via curl, click it, verify redirect
5. Set up n8n webhook workflow for click logging
6. Create Airtable tables (`Short Links`, `Link Clicks`)

### Phase 2: Admin Panel (Day 1-2 — ~3 hours)
7. Build `/admin/links` page on website (LinkCreator + LinkTable)
8. Build bookmarklet with popup mode
9. Style to match site dark theme
10. Deploy website update

### Phase 3: Analytics + Integration (Day 2 — ~2 hours)
11. Build LinkDetail component (click analytics view)
12. Wire n8n outreach engine to auto-shorten links
13. Add Slack notifications for hot link clicks
14. Test end-to-end: create link → click it → verify Airtable record → verify analytics

### Phase 4: Polish (Day 3)
15. Bookmarklet install page with drag-to-bookmark instructions
16. QR code generation for each link (nice-to-have)
17. Bulk link creation (CSV upload or paste multiple URLs)
18. Link expiration (optional TTL on KV entries)

---

## 12. Usage Examples

### Quiz Funnel Links
```
tinn.me/AIquiz      → /quiz/ai-readiness
tinn.me/AIquiz-b    → /quiz/ai-readiness?v=b
tinn.me/law-quiz    → /quiz/law-firm-audit
tinn.me/law-quiz-b  → /quiz/law-firm-audit?v=b
```

### Product Links
```
tinn.me/cerebro     → /law-firm-rag
tinn.me/twingen     → /twingen
tinn.me/vspark      → /visionspark-re
tinn.me/trendpilot  → /trendpilot
tinn.me/classroom   → /classroom
```

### Outreach Links (auto-generated per touch)
```
tinn.me/lf-t1-js    → /resources/scorecard?utm_source=cerebro&utm_campaign=law-45day&utm_content=touch-1
tinn.me/lf-t3-js    → /quiz/law-firm-audit?utm_source=cerebro&utm_campaign=law-45day&utm_content=touch-3
```

### Social / DM Links
```
tinn.me/call        → calendly.com/...
tinn.me/linkedin    → linkedin.com/in/michael-soto-...
tinn.me/yt          → youtube.com/@theinnovativenative
```

---

## 13. Success Criteria

1. Creating a short link takes ≤3 actions (paste URL, edit slug, click Create)
2. Bookmarklet creates + copies a link in 2 clicks from any page
3. Click redirect latency <50ms (Cloudflare Workers benchmarked at <15ms)
4. Every click creates an Airtable record within 30 seconds
5. Admin panel shows click count, device breakdown, geo, and referrer per link
6. n8n outreach engine auto-creates short links for every email
7. Total monthly cost: $0
8. Mike can create 10 links in under 2 minutes from the admin panel

---

## Sources

- [HackerNoon — Low-Cost URL Shortener with Cloudflare KV](https://hackernoon.com/how-i-built-a-low-cost-url-shortener-with-cloudflare-kv)
- [Srlinks — Open Source Cloudflare URL Shortener with Analytics](https://github.com/srbing49/short)
- [LogRocket — URL Shortener with Cloudflare Workers](https://blog.logrocket.com/creating-url-shortener-cloudflare-workers/)
- [Cloudflare KV Tutorials](https://developers.cloudflare.com/kv/tutorials/)
- [Thomas Levesque — URL Shortener in 12 Lines with CF Workers](https://thomaslevesque.com/2022/11/01/building-a-url-shortener-in-12-lines-of-code-using-cloudflare-workers/)
- [GitHub — jll38/url-shortener (Next.js + Analytics Dashboard)](https://github.com/jll38/url-shortener)
- [T.LY — Bookmarklet Pattern](https://t.ly/tools/url-shortener-bookmarklet)
- [Short.io — Free Branded URL Shortener](https://short.io/)
