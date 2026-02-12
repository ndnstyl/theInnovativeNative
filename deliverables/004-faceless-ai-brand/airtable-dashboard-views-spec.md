# Airtable Dashboard Views Specification — BowTie Bullies

> T068 [005][US7]: Video Analytics dashboard views for manual creation in Airtable UI.
> Airtable API cannot create views programmatically (confirmed limitation).

**Table:** Video Analytics (`tblqHXoOgnx3yMiEa`)

**Available Fields:**
- Snapshot Label (singleLineText)
- Platform (singleSelect)
- Snapshot Date (date)
- Views (number)
- Watch Time Hours (number)
- Avg View Duration S (number)
- CTR Percent (number)
- Likes (number)
- Comments (number)
- Shares (number)
- Subscriber Gain (number)
- Engagement Rate (number)
- Deliverable (linked to Deliverables)
- Episode (linked record)

---

## View 1: Per-Episode Performance Comparison

**View Name:** `Episode Comparison`
**View Type:** Grid View
**Purpose:** Compare performance metrics across episodes side-by-side.

| Setting | Value |
|---------|-------|
| Group By | Episode (ascending) |
| Sort | Snapshot Date (descending) — most recent first |
| Filter | None (show all) |
| Visible Fields | Snapshot Label, Platform, Snapshot Date, Views, Watch Time Hours, Avg View Duration S, CTR Percent, Engagement Rate, Likes, Comments, Shares, Subscriber Gain |
| Hidden Fields | Deliverable |
| Row Height | Short |

**Usage:** Group by Episode shows all snapshots for each episode together. Sort by date ensures the latest metrics appear first within each group.

---

## View 2: Top-Performing Content

**View Name:** `Top Performers`
**View Type:** Grid View
**Purpose:** Surface highest-performing content by engagement and views.

| Setting | Value |
|---------|-------|
| Group By | None |
| Sort | Primary: Views (descending), Secondary: Engagement Rate (descending) |
| Filter | Views > 0 (exclude zero/empty records) |
| Visible Fields | Snapshot Label, Episode, Platform, Views, Engagement Rate, CTR Percent, Watch Time Hours, Avg View Duration S, Likes, Shares |
| Hidden Fields | Comments, Subscriber Gain, Deliverable, Snapshot Date |
| Row Height | Short |
| Row Coloring | Conditional: Engagement Rate > 10% = green, 5-10% = yellow, < 5% = red |

**Usage:** Quick scan to identify what content resonates. Sort by views first, then engagement rate as tiebreaker. Conditional coloring makes standouts visible instantly.

---

## View 3: Trend Lines Over Time

**View Name:** `Trend Timeline`
**View Type:** Grid View (with Chart extension recommended)
**Purpose:** Track metrics over time to identify growth patterns.

| Setting | Value |
|---------|-------|
| Group By | Platform |
| Sort | Snapshot Date (ascending) — chronological order |
| Filter | None |
| Visible Fields | Snapshot Label, Snapshot Date, Views, Watch Time Hours, CTR Percent, Engagement Rate, Subscriber Gain |
| Hidden Fields | Likes, Comments, Shares, Deliverable, Avg View Duration S, Episode |
| Row Height | Short |

**Chart Extension Setup (recommended):**
- Chart Type: Line chart
- X-axis: Snapshot Date
- Y-axis: Views (primary), Engagement Rate (secondary)
- Group by: Platform
- This requires the Airtable Chart extension to be installed on the base.

**Usage:** Chronological sort within platform groups reveals growth trends. Pair with Chart extension for visual trend lines.

---

## View 4: Platform Breakdown

**View Name:** `By Platform`
**View Type:** Grid View
**Purpose:** Isolate performance by distribution platform (YouTube, TikTok, Instagram, etc.).

| Setting | Value |
|---------|-------|
| Group By | Platform |
| Sort | Snapshot Date (descending) |
| Filter | None |
| Visible Fields | All fields visible |
| Hidden Fields | None |
| Row Height | Short |
| Summary Row | Enable — Sum for Views, Watch Time Hours, Likes, Comments, Shares, Subscriber Gain; Average for CTR Percent, Engagement Rate, Avg View Duration S |

**Usage:** Summary rows per platform group provide aggregate comparison. Which platform delivers the best engagement rate? Which drives the most subscriber gain?

---

## View 5: Engagement Rate Heatmap

**View Name:** `Engagement Heatmap`
**View Type:** Gallery View
**Purpose:** Visual card-based view highlighting engagement metrics per episode.

| Setting | Value |
|---------|-------|
| Cover Field | None (text-based cards) |
| Card Fields | Snapshot Label, Episode, Platform, Engagement Rate, Views, CTR Percent |
| Sort | Engagement Rate (descending) |
| Filter | Engagement Rate is not empty |

**Usage:** Gallery view provides a visual scan of engagement across all content. Highest engagement cards appear first.

---

## Manual Creation Steps

1. Open Airtable base `appTO7OCRB2XbAlak`
2. Navigate to Video Analytics table (`tblqHXoOgnx3yMiEa`)
3. Click "+" next to existing views to create each new view
4. Apply Group By, Sort, Filter, and Field visibility settings as specified above
5. For View 3 (Trend Timeline), optionally install the Chart extension from Airtable Marketplace
6. For View 2 (Top Performers), set conditional row coloring under View > Color

---

*Created: 2026-02-11 | Agent: Tab (Data) | Task: T068 [005]*
