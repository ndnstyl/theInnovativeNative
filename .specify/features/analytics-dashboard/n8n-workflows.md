# n8n Workflows for Analytics Dashboard

**Purpose**: Server-side data proxy. Fetches from 6 APIs, caches results, serves to dashboard.
**Pattern**: Cron trigger → API call → Transform → Cache → Webhook serves cached data

---

## Workflow 1: Analytics - GA4 Fetch

**Trigger**: Cron every 15 min + Manual webhook
**Credential**: Google Service Account (`tin-analytics@tin-analytics.iam.gserviceaccount.com`)
**API**: GA4 Data API v1

### Nodes:
1. **Cron Trigger** (every 15 min)
2. **HTTP Request** - POST `https://analyticsdata.googleapis.com/v1beta/properties/339062891:runReport`
   - Auth: OAuth2 with service account
   - Body: dateRanges, dimensions, metrics (see below)
3. **Code Node** - Transform GA4 response into dashboard JSON format
4. **HTTP Request** - POST to Supabase `dashboard_cache` table (upsert key='ga4')

### Reports to Run:
```
Report 1 - Summary: metrics=[activeUsers, sessions, screenPageViews, bounceRate, averageSessionDuration, newUsers, conversions]
Report 2 - Daily Trend: dimensions=[date], metrics=[activeUsers, sessions], dateRange=last30days
Report 3 - Top Pages: dimensions=[pagePath], metrics=[screenPageViews, totalUsers, averageSessionDuration, bounceRate], orderBy=screenPageViews desc, limit=20
Report 4 - Sources: dimensions=[sessionSourceMedium], metrics=[sessions], limit=10
Report 5 - Devices: dimensions=[deviceCategory], metrics=[activeUsers]
Report 6 - Countries: dimensions=[country], metrics=[activeUsers], limit=10
Report 7 - Events: dimensions=[eventName], metrics=[eventCount], limit=20
Report 8 - Realtime: GET /v1beta/properties/339062891:runRealtimeReport, metrics=[activeUsers]
```

---

## Workflow 2: Analytics - GSC Fetch

**Trigger**: Cron every 6 hours
**Credential**: Same Google Service Account
**API**: Search Console API v1

### Nodes:
1. **Cron Trigger** (every 6 hrs)
2. **HTTP Request** - POST `https://searchconsole.googleapis.com/webmasters/v3/sites/sc-domain:theinnovativenative.com/searchAnalytics/query`
   - Body: startDate, endDate, dimensions=['query'], rowLimit=50
3. **HTTP Request** - Same but dimensions=['page'], rowLimit=20
4. **HTTP Request** - Same but dimensions=['date'], rowLimit=30
5. **Code Node** - Transform into dashboard format
6. **Upsert** to cache (key='gsc')

---

## Workflow 3: Analytics - Meta Ads Fetch

**Trigger**: Cron every 30 min
**Credential**: Meta System User Token
**API**: Meta Marketing API / Insights

### Nodes:
1. **Cron Trigger** (every 30 min)
2. **HTTP Request** - GET `https://graph.facebook.com/v19.0/act_884871169097180/insights`
   - Params: fields=spend,impressions,clicks,ctr,cpc,cpm,reach,frequency,actions,cost_per_action_type
   - date_preset=last_30d
   - time_increment=1 (daily)
   - access_token=<system_user_token>
3. **HTTP Request** - Same but level=campaign (campaign breakdown)
4. **HTTP Request** - Same but breakdowns=age,gender (demographics)
5. **HTTP Request** - Same but breakdowns=publisher_platform (platform split)
6. **Code Node** - Transform, calculate ROAS, extract lead actions
7. **Upsert** to cache (key='meta')

---

## Workflow 4: Analytics - Sink Fetch

**Trigger**: Cron every 15 min
**Credential**: Sink API token
**API**: Sink REST API (tinn.me)

### Nodes:
1. **Cron Trigger** (every 15 min)
2. **HTTP Request** - GET `https://tinn.me/api/link/query` (list all links with click counts)
   - Headers: Authorization: Bearer <token>
3. **HTTP Request** - GET Sink analytics endpoint for click breakdown data
4. **Code Node** - Aggregate: total links, total clicks, top links, referrer breakdown
5. **Upsert** to cache (key='sink')

---

## Workflow 5: Analytics - Airtable Fetch

**Trigger**: Cron every 15 min
**Credential**: Existing Airtable API key
**API**: Airtable REST API

### Nodes:
1. **Cron Trigger** (every 15 min)
2. **Airtable Node** - List records from Contacts table (tblg49y1OCUhyFmlH)
   - Fields: First Name, Last Name, Company, Funnel Stage, Source, Heat Level, Created
3. **Code Node** - Aggregate:
   - Total leads count
   - Group by Funnel Stage → count per stage
   - Group by Source → count per source
   - Group by Heat Level → cold/warm/hot counts
   - Filter last 7 days → recent leads list
   - Calculate conversion rate (Won / Total)
4. **Upsert** to cache (key='pipeline')

---

## Workflow 6: Analytics - Serve Dashboard

**Trigger**: Webhook GET `/analytics-dashboard`
**Purpose**: Dashboard page fetches this endpoint on load

### Nodes:
1. **Webhook Trigger** - GET
2. **Read all cache entries** (ga4, gsc, meta, sink, pipeline)
3. **Merge** into single JSON payload
4. **Add** lastUpdated timestamp + dateRange
5. **Respond** with combined JSON

### Caching Strategy:
- **Option A**: Supabase table `dashboard_cache` (key TEXT, data JSONB, updated_at TIMESTAMP)
- **Option B**: n8n static data (simpler, but lost on restart)
- **Option C**: Cloudflare KV (fast, but separate system)

**Recommendation**: Option A (Supabase) -- already have the infrastructure, data persists, queryable.

---

## Supabase Cache Table

```sql
CREATE TABLE IF NOT EXISTS dashboard_cache (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Upsert pattern:
INSERT INTO dashboard_cache (key, data, updated_at)
VALUES ('ga4', '{"summary": {...}}', NOW())
ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW();
```

---

## Deployment Order:

1. Create Supabase cache table
2. Build + deploy Workflow 6 (Serve Dashboard) with mock data first
3. Build + deploy Workflow 5 (Airtable) -- simplest API, test the pattern
4. Build + deploy Workflow 4 (Sink) -- already have working API
5. Build + deploy Workflow 1 (GA4) -- most complex, most valuable
6. Build + deploy Workflow 2 (GSC) -- straightforward once GA4 works
7. Build + deploy Workflow 3 (Meta Ads) -- needs token testing
8. Update dashboard to fetch from Workflow 6 webhook instead of mock data

---

## A/B Test Data

Quiz A/B test data comes from the quiz webhook payloads. Each quiz submission includes `variant: "a"` or `"b"`. 

Add to the Airtable pipeline fetch (Workflow 5):
- Query quiz lead records
- Group by quizId + variant
- Calculate starts, completes, leads, rates per variant
- Include in the pipeline cache under `abTests` key

OR: Create a separate `Quiz Results` Airtable table populated by the quiz webhook workflow, with fields: Quiz ID, Variant, Name, Email, Score, Heat Level, Timestamp.
