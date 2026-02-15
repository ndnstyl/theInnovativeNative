# Rize.io → Airtable Integration Plan

Automated time tracking sync from Rize.io to Airtable with daily/weekly email reports via n8n.

---

## Overview

```
┌─────────────┐     Webhook      ┌─────────────┐     Insert      ┌─────────────┐
│   Rize.io   │ ──────────────▶  │    n8n      │ ─────────────▶  │  Airtable   │
│ (tracking)  │   session data   │ (workflow)  │    records      │  (database) │
└─────────────┘                  └─────────────┘                 └─────────────┘
                                       │
                                       │ Schedule Trigger
                                       ▼
                                 ┌─────────────┐
                                 │   Email     │
                                 │  (reports)  │
                                 └─────────────┘
```

---

## Prerequisites

- [ ] Rize.io account with API access (Settings → API)
- [ ] n8n instance (cloud or self-hosted)
- [ ] Airtable account with API key
- [ ] Email credentials (Gmail app password or SMTP)

---

## Part 1: Airtable Setup

### Base Structure

Create a new Airtable base called **"Time Tracking"** with a table named **"Sessions"**.

### Table Schema: Sessions

| Field Name        | Field Type     | Description                          |
|-------------------|----------------|--------------------------------------|
| `Session ID`      | Single line    | Unique identifier from Rize          |
| `Date`            | Date           | Session date                         |
| `Start Time`      | Date/Time      | When session started                 |
| `End Time`        | Date/Time      | When session ended                   |
| `Duration (min)`  | Number         | Total minutes                        |
| `Category`        | Single select  | Work, Meeting, Deep Work, Break, etc.|
| `App/Website`     | Single line    | Primary app or site used             |
| `Description`     | Long text      | Auto-generated or manual notes       |
| `Billable`        | Checkbox       | For client billing                   |
| `Project`         | Single select  | Optional project assignment          |

### Views to Create

1. **Daily Log** - Filter by `Date = TODAY()`
2. **Weekly Summary** - Group by `Category`, filter last 7 days
3. **Billable Hours** - Filter `Billable = TRUE`

---

## Part 2: Rize.io Webhook Configuration

### Step 1: Get n8n Webhook URL

1. In n8n, create a new workflow
2. Add a **Webhook** node as the trigger
3. Set HTTP Method to `POST`
4. Copy the **Production URL** (looks like `https://your-n8n.com/webhook/xxxxx`)

### Step 2: Configure Rize Webhook

1. Open Rize.io desktop app
2. Navigate to **Settings → API**
3. Click **Add Webhook**
4. Paste your n8n webhook URL
5. Select events to send:
   - ✅ `session.ended` - Primary event for time logging
   - ✅ `session.started` - Optional, for real-time tracking
   - ✅ `category.assigned` - Optional, for categorization updates

### Expected Webhook Payload

Rize sends JSON data like this on `session.ended`:

```json
{
  "event": "session.ended",
  "timestamp": "2026-02-04T17:30:00Z",
  "data": {
    "session_id": "abc123",
    "start_time": "2026-02-04T15:00:00Z",
    "end_time": "2026-02-04T17:30:00Z",
    "duration_seconds": 9000,
    "category": "Deep Work",
    "top_apps": [
      {"name": "VS Code", "duration_seconds": 5400},
      {"name": "Chrome", "duration_seconds": 3600}
    ]
  }
}
```

---

## Part 3: n8n Workflow - Session Logger

### Workflow 1: Real-Time Session Logging

```
[Webhook] → [Set Fields] → [Airtable: Create Record]
```

#### Node 1: Webhook (Trigger)

- **HTTP Method**: POST
- **Path**: `rize-session`
- **Authentication**: None (or Header Auth for security)

#### Node 2: Set Fields (Transform Data)

Map Rize payload to Airtable fields:

```javascript
// Expression examples for field mapping
{
  "Session ID": "{{ $json.data.session_id }}",
  "Date": "{{ $json.data.start_time.split('T')[0] }}",
  "Start Time": "{{ $json.data.start_time }}",
  "End Time": "{{ $json.data.end_time }}",
  "Duration (min)": "{{ Math.round($json.data.duration_seconds / 60) }}",
  "Category": "{{ $json.data.category }}",
  "App/Website": "{{ $json.data.top_apps[0]?.name || 'Unknown' }}"
}
```

#### Node 3: Airtable (Create Record)

- **Operation**: Create
- **Base ID**: Your Time Tracking base
- **Table**: Sessions
- **Fields**: Map from Set node output

---

## Part 4: n8n Workflow - Email Reports

### Workflow 2: Daily Summary Email

```
[Schedule Trigger] → [Airtable: Search] → [Aggregate] → [Send Email]
```

#### Node 1: Schedule Trigger

- **Trigger Times**: Every day at 6:00 PM (end of workday)
- **Cron Expression**: `0 18 * * *`

#### Node 2: Airtable (Search Records)

- **Operation**: Search
- **Base ID**: Your Time Tracking base
- **Table**: Sessions
- **Filter Formula**: `IS_SAME({Date}, TODAY(), 'day')`

#### Node 3: Code Node (Aggregate Stats)

```javascript
const sessions = $input.all();

const totalMinutes = sessions.reduce((sum, s) => sum + s.json['Duration (min)'], 0);
const hours = Math.floor(totalMinutes / 60);
const minutes = totalMinutes % 60;

const byCategory = {};
sessions.forEach(s => {
  const cat = s.json['Category'] || 'Uncategorized';
  byCategory[cat] = (byCategory[cat] || 0) + s.json['Duration (min)'];
});

const categoryBreakdown = Object.entries(byCategory)
  .map(([cat, mins]) => `- ${cat}: ${Math.floor(mins/60)}h ${mins%60}m`)
  .join('\n');

return [{
  json: {
    totalTime: `${hours}h ${minutes}m`,
    sessionCount: sessions.length,
    categoryBreakdown,
    date: new Date().toLocaleDateString()
  }
}];
```

#### Node 4: Send Email

- **To**: your-email@example.com
- **Subject**: `Daily Time Report - {{ $json.date }}`
- **Body** (HTML):

```html
<h2>Daily Time Report</h2>
<p><strong>Date:</strong> {{ $json.date }}</p>
<p><strong>Total Time:</strong> {{ $json.totalTime }}</p>
<p><strong>Sessions:</strong> {{ $json.sessionCount }}</p>

<h3>Breakdown by Category</h3>
<pre>{{ $json.categoryBreakdown }}</pre>
```

---

### Workflow 3: Weekly Summary Email

Same as daily, but:

- **Schedule**: Every Friday at 5:00 PM → `0 17 * * 5`
- **Filter Formula**: `DATETIME_DIFF(TODAY(), {Date}, 'days') <= 7`
- Add week-over-week comparison if desired

---

## Part 5: Optional Enhancements

### Add Project Assignment

Create a second workflow that:
1. Triggers on new Airtable record
2. Uses AI (OpenAI node) to suggest project based on app/category
3. Updates the record with suggested project

### Slack Notifications

Add a Slack node after session logging:
- Send a message when deep work session > 2 hours
- Daily summary to a `#time-tracking` channel

### Billable Hours Detection

Use a Code node to auto-check "Billable" based on:
- Specific apps (e.g., client project folders)
- Categories marked as billable
- Time of day rules

---

## Security Considerations

1. **Webhook Authentication**: Add header-based auth in n8n
   - In Webhook node: Authentication → Header Auth
   - Add custom header: `X-Rize-Secret: your-secret-key`
   - Configure same header in Rize webhook settings

2. **Airtable API Key**: Store in n8n credentials, never in workflow

3. **Data Privacy**: Rize captures app/website usage - consider filtering sensitive data before storing

---

## Testing Checklist

- [ ] Webhook receives test payload from Rize
- [ ] Session data correctly maps to Airtable fields
- [ ] Duplicate sessions are handled (check Session ID exists)
- [ ] Daily email sends at scheduled time
- [ ] Weekly email aggregates correctly
- [ ] Error handling notifies you of failures

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Webhook not receiving data | Check Rize webhook status, verify URL is production URL |
| Airtable auth fails | Regenerate API key, check base permissions |
| Duration shows 0 | Check `duration_seconds` path in payload |
| Email not sending | Verify SMTP credentials, check spam folder |
| Timezone issues | Add timezone conversion in Set node |

---

## Estimated Setup Time

| Task | Time |
|------|------|
| Airtable base setup | 15 min |
| Rize webhook config | 5 min |
| n8n session logger workflow | 30 min |
| n8n daily email workflow | 20 min |
| Testing & debugging | 30 min |
| **Total** | ~2 hours |
