# Feature Spec: TIN Command Center -- Unified Marketing Analytics Dashboard

**Feature ID**: analytics-dashboard
**Created**: 2026-04-22
**Status**: Spec Complete
**Owner**: Mike
**Location**: `theinnovativenative.com/admin/analytics`
**Auth**: Password-gated (same pattern as generational-wealth, or session-based admin auth)

---

## 1. Purpose

Build a single-page executive marketing analytics dashboard that consolidates ALL data sources into one view. No more switching between GA4, Meta Ads Manager, Search Console, Sink, and Airtable. One URL. One screen. Every metric.

**This is the dashboard Mike opens every morning** to answer: "What's working, what's not, and where should I spend my next hour?"

**This is also a portfolio piece** -- when selling analytics/automation services to clients, this dashboard IS the demo of what's possible.

---

## 2. Data Sources -- 6 Pipelines

### Source 1: GA4 (Website Traffic + Behavior)
**API**: GA4 Data API v1 (`runReport`, `runRealtimeReport`)
**Auth**: Google Service Account (JSON key) with Viewer role on GA4 property
**Property ID**: 339062891
**Measurement ID**: G-61FWZG47NJ

**Data we pull**:
| Metric | Dimension | Purpose |
|--------|-----------|---------|
| `activeUsers` | `date` | Daily active users (trend line) |
| `sessions` | `date` | Session volume over time |
| `screenPageViews` | `pagePath` | Top pages by views |
| `bounceRate` | `pagePath` | Page quality indicator |
| `averageSessionDuration` | `sessionSource` | Engagement by source |
| `conversions` | `eventName` | Goal completions |
| `newUsers` vs `totalUsers` | `date` | New vs returning |
| `activeUsers` | `deviceCategory` | Desktop vs mobile vs tablet |
| `activeUsers` | `country` | Geographic distribution |
| `activeUsers` | `sessionSourceMedium` | Traffic source breakdown |
| `eventCount` | `eventName` | Button clicks, form submissions, quiz completions |
| `activeUsers` | (realtime) | Current users on site |

### Source 2: Google Search Console (SEO / Organic)
**API**: Search Console API v1 (`searchanalytics.query`)
**Auth**: Same Google Service Account (add to Search Console property)
**Property**: `sc-domain:theinnovativenative.com`

**Data we pull**:
| Metric | Dimension | Purpose |
|--------|-----------|---------|
| `clicks` | `query` | Top search queries driving traffic |
| `impressions` | `query` | Search visibility |
| `ctr` | `query` | Click-through rate per keyword |
| `position` | `query` | Average ranking position |
| `clicks` | `page` | Top landing pages from search |
| `clicks` | `date` | Organic traffic trend |
| `clicks` | `device` | Mobile vs desktop search |
| `clicks` | `country` | Organic traffic by country |

### Source 3: Sink / tinn.me (Link Intelligence)
**API**: Sink REST API (already deployed)
**Auth**: Bearer token (`TinnMe2026!Secure`)
**Base URL**: `https://tinn.me`

**Data we pull**:
| Metric | Dimension | Purpose |
|--------|-----------|---------|
| Click count | Per slug | Which links get clicked most |
| Clicks over time | Per slug + date | Link performance trends |
| Device breakdown | Per slug | Mobile vs desktop per link |
| Browser | Per slug | Chrome/Safari/Firefox split |
| Country | Per slug | Geographic reach per link |
| Referrer | Per slug | Where clicks come from (LinkedIn, email, DM) |
| Top slugs | Ranked by clicks | Leaderboard of best-performing links |

### Source 4: Meta Ads (Paid Social)
**API**: Meta Marketing API / Insights API
**Auth**: System User access token with `ads_read` permission
**Ad Account ID**: TBD (Mike provides)

**Data we pull**:
| Metric | Dimension | Purpose |
|--------|-----------|---------|
| `spend` | `date_start` | Daily ad spend |
| `impressions` | `date_start` | Ad impressions over time |
| `clicks` | `date_start` | Ad clicks |
| `ctr` | `date_start` | Click-through rate |
| `cpc` | `date_start` | Cost per click |
| `cpm` | `date_start` | Cost per 1K impressions |
| `reach` | `date_start` | Unique people reached |
| `frequency` | `date_start` | Average times shown per person |
| `actions` (leads) | `date_start` | Lead form submissions |
| `cost_per_action_type` | `date_start` | Cost per lead |
| `spend` | `campaign_name` | Spend by campaign |
| `clicks` | `campaign_name` | Clicks by campaign |
| `spend` | `age`, `gender` | Demographic breakdown |
| `spend` | `publisher_platform` | Facebook vs Instagram vs Audience Network |
| ROAS | Calculated | Return on ad spend |

### Source 5: Facebook Pixel / CAPI (Conversion Events)
**Source**: Flows through GA4 + Meta Ads reporting
**Events tracked**: PageView, Lead, Purchase, ViewContent, InitiateCheckout
**No separate API needed** -- pixel fires to Meta, CAPI fires server-side, both show in Meta Ads Insights

### Source 6: Airtable (CRM / Lead Pipeline)
**API**: Airtable REST API (existing)
**Base**: appTO7OCRB2XbAlak
**Tables**: Contacts (tblg49y1OCUhyFmlH), Tasks, Deliverables

**Data we pull**:
| Metric | Source | Purpose |
|--------|--------|---------|
| Total leads | Contacts count | Pipeline size |
| Leads by funnel stage | Contacts grouped by `Funnel Stage` | Pipeline health |
| Leads by source | Contacts grouped by `Source` | Channel attribution |
| Hot leads count | Contacts where heat = hot | Immediate opportunity |
| Conversion rate | Leads → Meetings → Won | Funnel efficiency |
| Recent leads | Last 7 days | Activity pulse |

---

## 3. Dashboard Layout -- 7 Tabs

The dashboard is a single page with a **tab navigation** at the top. Each tab is a different analytical view. The page loads the Executive Summary by default.

### Global Controls (persistent across all tabs)
- **Date range picker** (top right): Today, Last 7 days, Last 30 days, Last 90 days, Custom range
- **Refresh button**: Force data refresh (cached data has 5-min TTL)
- **Last updated** timestamp
- **Export**: Download current view as CSV or PDF

### Tab 1: Executive Summary (Default View)
**Purpose**: Answer "How are we doing?" in 10 seconds.

**Row 1 -- Hero Scorecards** (5 cards, full width):
| Card | Metric | Comparison | Source |
|------|--------|------------|--------|
| Visitors | Total users | vs previous period (% change, up/down arrow) | GA4 |
| Leads | New leads captured | vs previous period | Airtable |
| Ad Spend | Total Meta spend | vs previous period | Meta Ads |
| Revenue | Stripe revenue | vs previous period | Stripe (if available) or manual |
| ROAS | Revenue / Ad Spend | vs previous period | Calculated |

**Row 2 -- Trend Charts** (2 charts, half width each):
- **Left**: Sessions + Users over time (dual-axis line chart, 30 days)
- **Right**: Ad Spend vs Leads over time (dual-axis, spend = bars, leads = line)

**Row 3 -- Channel Attribution** (full width):
- Stacked bar chart: leads by source (Organic, Paid Social, Email, Direct, Referral)
- Shows which channels are actually producing leads, not just traffic

**Row 4 -- Quick Wins** (3 cards):
- Top performing link (tinn.me slug with most clicks this period)
- Top performing page (most views)
- Top search query (most clicks from GSC)

### Tab 2: Traffic & Behavior (GA4 Deep Dive)
**Purpose**: Understand WHO is visiting, WHERE they come from, and WHAT they do.

**Section A -- Traffic Overview**:
- Line chart: Sessions by day (30 days)
- Donut chart: Traffic sources (Organic, Direct, Referral, Social, Paid, Email)
- Donut chart: Device split (Desktop, Mobile, Tablet)
- Bar chart: Top 10 countries

**Section B -- Page Performance**:
- Table: Top 20 pages by views (columns: Page, Views, Unique Users, Avg Time, Bounce Rate)
- Sortable by any column
- Highlight pages with high bounce rate (>70%) in red
- Highlight pages with high engagement (avg time >3 min) in green

**Section C -- User Flow**:
- Funnel visualization: Landing Page → Page 2 → Conversion Event
- Conversion events: quiz_complete, calendly_click, purchase, lead_form_submit

**Section D -- Real-Time**:
- Current active users (big number)
- Active pages right now (list)
- Active countries (mini map or list)

### Tab 3: SEO & Organic (Search Console)
**Purpose**: Track organic search performance and keyword rankings.

**Section A -- Organic Overview**:
- Line chart: Organic clicks by day (30/90 days)
- Line chart: Impressions by day (shows visibility)
- Scorecard: Average CTR, Average Position

**Section B -- Keyword Rankings**:
- Table: Top 50 queries (columns: Query, Clicks, Impressions, CTR, Avg Position)
- Sortable, searchable
- Color code position: green (1-3), yellow (4-10), orange (11-20), red (20+)
- Filter: show only queries with position change (up/down movement)

**Section C -- Page Performance (Organic)**:
- Table: Top 20 pages by organic clicks
- Columns: URL, Clicks, Impressions, CTR, Position
- Link each URL to the actual page

**Section D -- Trends**:
- Position tracking for top 10 keywords over time (sparkline per keyword)
- Month-over-month comparison cards: clicks, impressions, CTR, position

### Tab 4: Paid Advertising (Meta Ads)
**Purpose**: Track ad spend efficiency and campaign performance.

**Section A -- Spend Overview**:
- Scorecards: Total Spend, Impressions, Clicks, CTR, CPC, CPM, Reach, Frequency
- Each with vs-previous-period comparison

**Section B -- Spend Over Time**:
- Dual-axis chart: Spend (bars) + CPC (line) by day
- Shows if cost efficiency is improving or degrading

**Section C -- Campaign Performance**:
- Table: All campaigns (columns: Name, Status, Spend, Impressions, Clicks, CTR, CPC, Leads, Cost/Lead, ROAS)
- Sortable by any column
- Highlight best-performing campaign in green, worst in red

**Section D -- Audience Breakdown**:
- Bar chart: Spend by age group
- Bar chart: Spend by gender
- Bar chart: Spend by platform (Facebook vs Instagram vs Audience Network)
- Bar chart: Spend by placement (Feed vs Stories vs Reels)

**Section E -- Creative Performance** (if available):
- Table: Ad-level performance (Name, Spend, Clicks, CTR, Leads)
- Identifies which creative is winning

### Tab 5: Link Intelligence (Sink / tinn.me)
**Purpose**: Track every shortened link's performance.

**Section A -- Link Overview**:
- Scorecard: Total links, Total clicks (all time), Clicks today, Avg clicks/link
- Top 5 links by clicks (leaderboard with mini bar chart)

**Section B -- Link Table**:
- Full table: Slug, Destination, Clicks, Last Click, Created, Tags
- Sortable, searchable, filterable by tag

**Section C -- Click Analytics** (per selected link):
- Click-to-expand on any row shows:
  - Clicks over time (line chart)
  - Device breakdown (donut)
  - Country breakdown (bar)
  - Referrer breakdown (bar)
  - Browser breakdown (donut)

**Section D -- UTM Performance**:
- Table: Group clicks by UTM source + medium + campaign
- Shows which outreach campaigns drive the most link clicks
- Ties directly to email outreach tracking

### Tab 6: Conversion & Funnel
**Purpose**: Track the full journey from visitor to customer.

**Section A -- Conversion Funnel**:
- Visual funnel (horizontal or vertical):
  ```
  Visitors (GA4) → Link Clicks (Sink) → Quiz Starts → Quiz Completes → 
  Lead Captured (Airtable) → Meeting Booked (Calendly) → Deal Won
  ```
- Each stage shows: count, conversion rate to next stage, drop-off %

**Section B -- Quiz Funnel A/B Test**:
- Table per quiz: Variant A vs Variant B
- Columns: Variant, Starts, Completes, Completion Rate, Leads Captured, Lead Rate
- Statistical significance indicator (green = significant, gray = need more data)
- Calculated using chi-squared test or simple proportion z-test

**Section C -- Lead Pipeline** (from Airtable):
- Horizontal bar chart: Leads by funnel stage
  - Touch 1 → Touch 2 → Touch 3 → Responded → Meeting → Pilot Discussion → Won/Lost
- Table: Recent leads (last 7 days) with name, source, stage, score
- Pie chart: Leads by heat level (cold/warm/hot)

**Section D -- Conversion Events**:
- Table: All GA4 conversion events with counts
- Events: quiz_complete, calendly_click, purchase, lead_submit, outbound_click
- Trend sparkline per event

### Tab 7: A/B Testing
**Purpose**: Track all active split tests with statistical rigor.

**Section A -- Active Tests**:
- Card per active test showing:
  - Test name, start date, days running, sample size
  - Variant A vs Variant B conversion rates
  - Lift (% improvement)
  - Confidence level (visual meter: 0-100%)
  - Status: "Needs more data" / "Variant B winning at 92% confidence" / "No significant difference"

**Section B -- Quiz A/B Results**:
- Per quiz (AI Readiness, Law Firm Audit, Content Score, Listing Score, Cost Calculator):
  - Variant A (capture-first) vs Variant B (capture-last)
  - Metrics: starts, completes, completion rate, leads, lead capture rate
  - Winner indicator with confidence
  - Sample size needed for significance (calculated)

**Section C -- Historical Tests**:
- Table: Completed tests with results, winner, lift achieved, date concluded
- Institutional memory -- what we've tested and what worked

---

## 4. Data Architecture

### How Data Gets to the Dashboard

The dashboard is a **static page** on your Next.js site. It cannot make API calls directly (static export = no server). Solution: **n8n as the data proxy**.

```
Dashboard Page (React, client-side)
    │
    │ fetch() to n8n webhook endpoints (cached JSON)
    │
    ▼
n8n Workflows (server-side, scheduled)
    │
    ├──► GA4 Data API → process → cache as JSON in Supabase/KV/static file
    ├──► Search Console API → process → cache
    ├──► Meta Ads Insights API → process → cache
    ├──► Sink API → process → cache
    ├──► Airtable API → process → cache
    └──► Stripe API → process → cache (optional)
    
Dashboard page fetches pre-computed JSON from n8n webhook endpoints.
n8n refreshes data every 15 minutes (or on-demand via refresh button).
```

### Why n8n as Proxy (Not Direct API Calls)

1. **Static export** -- your site has no server. Can't store service account keys or make server-side API calls.
2. **Rate limits** -- GA4 allows 14K tokens/hr. Direct client calls from multiple browser tabs would burn through limits fast.
3. **Auth security** -- Service account keys, Meta tokens, Airtable keys stay in n8n, never exposed to client.
4. **Caching** -- n8n computes the data once, serves the same JSON to every dashboard load. No redundant API calls.
5. **Transformation** -- n8n normalizes data from 6 different APIs into a consistent JSON format the dashboard consumes.

### n8n Workflows Needed

| Workflow | Trigger | Data Source | Output |
|----------|---------|-------------|--------|
| `Analytics - GA4 Fetch` | Cron every 15 min + webhook | GA4 Data API | JSON: traffic, pages, events, devices, sources |
| `Analytics - GSC Fetch` | Cron every 6 hrs | Search Console API | JSON: queries, pages, clicks, impressions, positions |
| `Analytics - Meta Ads Fetch` | Cron every 30 min | Meta Marketing API | JSON: campaigns, spend, clicks, leads, demographics |
| `Analytics - Sink Fetch` | Cron every 15 min | Sink API (tinn.me) | JSON: links, clicks, devices, referrers |
| `Analytics - Airtable Fetch` | Cron every 15 min | Airtable API | JSON: lead counts, pipeline stages, recent leads |
| `Analytics - Serve Dashboard` | Webhook GET | Reads cached JSON | Returns combined dashboard payload |

### Cached Data Format

Each n8n workflow writes its output to a **Supabase table** (`dashboard_cache`) or **static JSON endpoint** served by n8n. The dashboard page fetches one combined payload:

```json
{
  "lastUpdated": "2026-04-22T14:30:00Z",
  "dateRange": { "start": "2026-03-23", "end": "2026-04-22" },
  "ga4": {
    "summary": { "users": 1240, "sessions": 2100, "pageViews": 5800, "bounceRate": 42.3 },
    "trend": [{ "date": "2026-04-01", "users": 45, "sessions": 72 }, ...],
    "topPages": [{ "path": "/quiz/ai-readiness", "views": 342, "avgTime": 185 }, ...],
    "sources": [{ "source": "google / organic", "sessions": 800 }, ...],
    "devices": { "desktop": 55, "mobile": 42, "tablet": 3 },
    "countries": [{ "country": "US", "users": 980 }, ...],
    "events": [{ "name": "quiz_complete", "count": 87 }, ...],
    "realtime": { "activeUsers": 3 }
  },
  "gsc": {
    "summary": { "clicks": 2400, "impressions": 45000, "ctr": 5.3, "avgPosition": 14.2 },
    "trend": [{ "date": "2026-04-01", "clicks": 82, "impressions": 1500 }, ...],
    "queries": [{ "query": "ai automation", "clicks": 120, "impressions": 2200, "ctr": 5.4, "position": 8.2 }, ...],
    "pages": [{ "page": "/blog/ai-lead-generation", "clicks": 95, "impressions": 1800 }, ...]
  },
  "meta": {
    "summary": { "spend": 1250.00, "impressions": 85000, "clicks": 2100, "ctr": 2.47, "cpc": 0.60, "leads": 34, "costPerLead": 36.76 },
    "trend": [{ "date": "2026-04-01", "spend": 42.00, "clicks": 68, "leads": 1 }, ...],
    "campaigns": [{ "name": "Law Firm Cerebro Q2", "spend": 450, "clicks": 890, "leads": 12, "cpl": 37.50 }, ...],
    "demographics": { "age": [...], "gender": [...], "platform": [...] }
  },
  "sink": {
    "summary": { "totalLinks": 25, "totalClicks": 1842, "clicksToday": 47 },
    "topLinks": [{ "slug": "AIquiz", "clicks": 342, "lastClick": "2026-04-22T13:45:00Z" }, ...],
    "links": [...]
  },
  "pipeline": {
    "summary": { "totalLeads": 156, "hotLeads": 12, "meetingsBooked": 8, "dealsWon": 2 },
    "byStage": [{ "stage": "Touch 1", "count": 45 }, { "stage": "Touch 2", "count": 32 }, ...],
    "bySource": [{ "source": "quiz", "count": 34 }, { "source": "email", "count": 28 }, ...],
    "recentLeads": [{ "name": "John Smith", "company": "Acme Corp", "source": "quiz", "stage": "Touch 1", "heat": "hot" }, ...]
  },
  "abTests": {
    "quizzes": [
      {
        "quizId": "ai-readiness",
        "variantA": { "starts": 120, "completes": 95, "leads": 82, "completionRate": 79.2, "leadRate": 68.3 },
        "variantB": { "starts": 110, "completes": 88, "leads": 85, "completionRate": 80.0, "leadRate": 77.3 },
        "lift": 13.2,
        "confidence": 87.4,
        "status": "needs_more_data",
        "sampleNeeded": 450
      },
      ...
    ]
  }
}
```

---

## 5. Frontend Implementation

### Stack
- React page within existing Next.js site (Pages Router, static export)
- **Chart.js** or **Recharts** for visualizations (both work with static export, no server needed)
- SCSS dark theme matching existing site
- Responsive (works on tablet for morning review, but desktop-primary)

### New Files

```
src/pages/admin/analytics.tsx          ← Main dashboard page
src/components/analytics/
  AnalyticsDashboard.tsx              ← Tab container + global controls
  DashboardTabs.tsx                   ← Tab navigation
  DateRangePicker.tsx                 ← Date range selector
  ScoreCard.tsx                       ← KPI card with comparison
  TrendChart.tsx                      ← Line/area chart wrapper
  BarChart.tsx                        ← Bar chart wrapper
  DonutChart.tsx                      ← Pie/donut chart wrapper
  DataTable.tsx                       ← Sortable, searchable table
  FunnelChart.tsx                     ← Conversion funnel visualization
  ABTestCard.tsx                      ← A/B test result card with confidence
  GeoMap.tsx                          ← Country/region heat map (optional, or just table)
  LinkDetailModal.tsx                 ← Per-link analytics popup
  
  tabs/
    ExecutiveSummary.tsx              ← Tab 1
    TrafficBehavior.tsx              ← Tab 2
    SEOOrganic.tsx                   ← Tab 3
    PaidAdvertising.tsx              ← Tab 4
    LinkIntelligence.tsx             ← Tab 5
    ConversionFunnel.tsx             ← Tab 6
    ABTesting.tsx                    ← Tab 7

src/styles/sections/
  _analytics-dashboard.scss           ← All dashboard styles

src/data/
  analytics-mock.json                 ← Mock data for development/demo
```

### Auth
- Same pattern as admin pages -- password gate or check for admin session
- Not indexed (`noindex, nofollow`)
- Accessible only via direct URL

### Charting Library Decision

**Recharts** (recommended over Chart.js for this project):
- Built for React (Chart.js needs a wrapper)
- Declarative API (JSX components, not imperative config)
- Better dark theme support
- Responsive out of the box
- Already used in many Next.js projects
- npm: `recharts` -- single dependency

**Bundle size**: ~150KB gzipped (acceptable for an admin page)

---

## 6. Credentials Needed From Mike

| Credential | Where to Get It | What I Do With It |
|-----------|----------------|-------------------|
| **Google Service Account JSON** | Google Cloud Console → Create Service Account → Create Key (JSON) | Stored in n8n as credential. Used for GA4 + Search Console API calls. |
| **GA4 Property access** | GA4 Admin → Property Access Management → Add the service account email as Viewer | Allows the service account to read GA4 data |
| **Search Console access** | Search Console → Settings → Users → Add service account email as Full user | Allows reading organic search data |
| **Meta System User Token** | Meta Business Suite → Business Settings → System Users → Generate Token with `ads_read` | Stored in n8n. Used for Meta Ads Insights API. |
| **Meta Ad Account ID** | Meta Ads Manager → Account dropdown → the `act_XXXXXXXXXX` number | Identifies which ad account to pull data from |

None of these credentials touch the website. They all live in n8n as encrypted credentials.

---

## 7. Build Phases

### Phase 1: Scaffold + GA4 + Sink (Day 1-2)
- Dashboard page with tab navigation
- ScoreCard, TrendChart, DataTable components
- n8n workflow: GA4 data fetch + cache
- n8n workflow: Sink data fetch + cache
- n8n workflow: Serve dashboard JSON
- Tabs 1 (Executive Summary), 2 (Traffic), 5 (Links) functional
- Mock data for Meta/GSC/Airtable tabs

### Phase 2: Search Console + Airtable (Day 2-3)
- n8n workflow: GSC data fetch + cache
- n8n workflow: Airtable pipeline fetch + cache
- Tab 3 (SEO) functional
- Tab 6 (Conversion Funnel) functional with real pipeline data
- FunnelChart component

### Phase 3: Meta Ads (Day 3-4)
- n8n workflow: Meta Ads Insights fetch + cache
- Tab 4 (Paid Advertising) functional
- Campaign table, demographic breakdowns, spend charts

### Phase 4: A/B Testing + Polish (Day 4-5)
- Tab 7 (A/B Testing) with quiz variant data
- ABTestCard with statistical significance calculation
- Export to CSV/PDF
- Mobile responsive audit
- Performance optimization (lazy-load tabs)

### Phase 5: Alerting (Optional, Day 5+)
- n8n monitors for anomalies:
  - Traffic drops >30% day-over-day → Slack alert
  - Ad spend exceeds daily budget → Slack alert
  - Hot lead captured → Slack + SMS alert (already built in quiz funnel)
  - SEO position drops for top 5 keywords → Slack alert

---

## 8. Design Specs

### Dark Theme (matches site)
- Background: `#000000` (page), `#0e0e0e` (cards), `#191919` (table rows alt)
- Text: `#ffffff` (primary), `rgba(255,255,255,0.6)` (secondary)
- Accent: `#00FFFF` (cyan -- primary), `#FF1493` (magenta -- negative/down)
- Charts: cyan for primary series, magenta for secondary, gold for tertiary
- Green `#00C853` for positive indicators (up arrows, good metrics)
- Red `#FF1744` for negative indicators (down arrows, bad metrics)

### ScoreCard Design
```
┌────────────────────────┐
│  1,240                 │
│  Total Users           │
│  ▲ 12.3% vs last month │  ← green arrow + text if positive
│                        │     red arrow if negative
└────────────────────────┘
```

### Tab Navigation
- Horizontal tab bar, fixed below the header
- Active tab: cyan underline
- Tabs: Summary | Traffic | SEO | Paid | Links | Funnel | A/B Tests

### Data Table Design
- Sticky header row
- Alternating row backgrounds (#0e0e0e / #191919)
- Sortable columns (click header to sort, arrow indicator)
- Search/filter bar above table
- Pagination (25 rows default)
- Hover highlight on rows

### Chart Design
- Dark background, light grid lines (rgba(255,255,255,0.05))
- Cyan line/bar for primary metric
- Tooltip on hover showing exact values
- Responsive -- charts resize with viewport
- No chart junk -- minimal labels, clean axes

---

## 9. Success Criteria

1. Dashboard loads in <3 seconds with cached data
2. All 7 tabs show real data from their respective sources
3. Date range picker filters all tabs simultaneously
4. ScoreCards show vs-previous-period comparison with directional arrows
5. Tables are sortable and searchable
6. A/B test cards show statistical confidence levels
7. Conversion funnel visualizes the full visitor → customer journey
8. Dashboard is usable on iPad (tablet) for morning standup review
9. Data refreshes automatically every 15 minutes via n8n cron
10. Manual refresh button triggers immediate data fetch
11. No credentials exposed in client-side code
12. Mike can answer "How are we doing?" in under 10 seconds from the Executive Summary tab

---

## 10. What This Is NOT

- Not a real-time monitoring tool (15-min cache is fine for decision-making)
- Not a replacement for GA4/Meta Ads Manager (those are still the source-of-truth for deep analysis)
- Not a public page (admin-only, password-gated)
- Not a SaaS product (purpose-built for TIN, but the architecture is reusable for client projects)

---

## 11. Portfolio / Sales Value

This dashboard IS a sellable product:

| Client Type | Pitch | Price Range |
|------------|-------|-------------|
| Agency | "See all your clients' metrics in one view" | $5,000-$15,000 setup |
| E-commerce | "Revenue, ad spend, and ROAS without switching tabs" | $3,000-$8,000 |
| SaaS | "MRR, churn, CAC, LTV in one dashboard" | $5,000-$12,000 |
| Law Firm | "Lead pipeline, ad performance, and case metrics unified" | $3,000-$7,000 |

The quiz funnels demonstrate lead capture. This dashboard demonstrates business intelligence. Together they're a $10K-$25K package.

---

## Sources

- [GA4 Data API Overview](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [Search Console API](https://developers.google.com/webmaster-tools/v1/how-tos/all-your-data)
- [Meta Marketing API Insights](https://developers.facebook.com/docs/marketing-api/insights/)
- [Meta Ads Breakdowns](https://developers.facebook.com/docs/marketing-api/insights/breakdowns/)
- [Improvado -- Marketing Dashboard Guide](https://improvado.io/blog/12-best-marketing-dashboard-examples-and-templates)
- [Funnel.io -- Marketing Dashboard Guide](https://funnel.io/blog/marketing-dashboard-guide)
- [CXL -- A/B Test Visualization](https://cxl.com/blog/visualize-ab-test-results/)
- [Keo Marketing -- Executive Dashboard KPIs](https://keomarketing.com/marketing-analytics-attribution-guide-150191-2)
- [GitHub -- GA4 + Next.js Dashboard](https://github.com/jabercrombia/google-dashboard-api)
