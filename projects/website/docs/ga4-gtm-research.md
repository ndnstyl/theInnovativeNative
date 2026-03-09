# GA4 + GTM Implementation Research for theinnovativenative.com

**Date:** 2026-03-09
**Site:** theinnovativenative.com
**Stack:** Next.js 13.4.19, Pages Router, SCSS + Bootstrap 5.3.1, Hosted on Hostinger
**Business:** AI systems consulting — community, courses, consulting services
**Payment:** Stripe (checkout redirects to success pages)
**Scheduling:** Calendly (embedded widget, popup mode)

---

## Table of Contents

1. [Google Analytics 4 (GA4)](#1-google-analytics-4-ga4)
2. [Google Tag Manager (GTM)](#2-google-tag-manager-gtm)
3. [Next.js Specific Implementation](#3-nextjs-specific-implementation)
4. [Events to Track for This Business](#4-events-to-track-for-this-business)
5. [Attribution and Conversion Tracking](#5-attribution-and-conversion-tracking)
6. [Testing](#6-testing)
7. [Prerequisites Checklist](#7-prerequisites-checklist)
8. [Implementation Priority Order](#8-implementation-priority-order)

---

## 1. Google Analytics 4 (GA4)

### 1.1 Prerequisites

1. **Google Account** — You need a Google account (personal or Google Workspace). Recommendation: use a shared workspace account (e.g., analytics@theinnovativenative.com) so access survives personnel changes.
2. **GA4 Property** — Created at analytics.google.com > Admin > Create Property. Provide: property name, country (US), timezone (your timezone), currency (USD).
3. **Web Data Stream** — Created under Admin > Data Streams > Add Stream > Web. Provide: website URL (`https://theinnovativenative.com`), stream name.
4. **Measurement ID** — Auto-generated after data stream creation. Format: `G-XXXXXXXXXX`. This is your unique identifier. Do NOT confuse with your Property ID (numeric only).
5. **Enhanced Measurement** — Enabled by default on data stream creation. Toggle individual events on/off via the gear icon.

### 1.2 Automatically Collected Events (Web)

These fire without any code. You cannot disable some of them (session_start, first_visit).

| Event Name | When It Fires | Key Parameters |
|---|---|---|
| `first_visit` | First time a user visits the site | — |
| `session_start` | When a new session begins (30 min inactivity timeout) | — |
| `user_engagement` | User has site in foreground for 10+ seconds | `engagement_time_msec` |
| `page_view` | Page loads or browser history state changes | `page_location`, `page_referrer`, `page_title` |

### 1.3 Enhanced Measurement Events

These are auto-collected when Enhanced Measurement is ON. Each can be toggled individually in Admin > Data Streams > [stream] > Enhanced Measurement (gear icon).

| Event Name | When It Fires | Parameters | Notes |
|---|---|---|---|
| `page_view` | Page loads or history state changes | `page_location`, `page_referrer`, `page_title` | On by default, cannot be disabled separately |
| `scroll` | User scrolls to 90% of page height | `percent_scrolled` (always 90) | Only fires at 90%. For 25/50/75%, use GTM Scroll Depth trigger |
| `click` (outbound) | User clicks a link to a different domain | `link_url`, `link_domain`, `link_text`, `outbound` (true) | Only outbound clicks. Internal clicks require custom setup |
| `view_search_results` | User performs site search (URL contains query param) | `search_term` | Triggered by URL params: q, s, search, query, keyword. Configure custom params in settings |
| `video_start` | YouTube embedded video starts playing | `video_title`, `video_url`, `video_provider`, `visible` | Only works with YouTube JS API embeds |
| `video_progress` | YouTube video passes 10%, 25%, 50%, 75% | `video_title`, `video_percent`, `video_current_time` | Only YouTube |
| `video_complete` | YouTube video reaches end | `video_title`, `video_url` | Only YouTube |
| `file_download` | User clicks a link to download a file | `file_name`, `file_extension`, `link_url`, `link_text` | Extensions: pdf, xls, xlsx, doc, docx, txt, rtf, csv, exe, key, pps, ppt, pptx, 7z, pkg, rar, gz, zip, avi, mov, mp4, mpeg, wmv, midi, mp3, wav, wma |
| `form_start` | User first interacts with a form | `form_id`, `form_name`, `form_destination` | Tracks when user begins filling out a form |
| `form_submit` | User submits a form | `form_id`, `form_name`, `form_destination`, `form_submit_text` | Tracks successful form submissions |

### 1.4 Recommended Events for This Business

GA4 defines recommended events by business type. For theinnovativenative.com (consulting + courses + community + ecommerce), the relevant categories are **Lead Generation**, **Online Sales**, and **Content/Education**.

#### Lead Generation Events

| Event | Required Parameters | Optional Parameters | Use Case |
|---|---|---|---|
| `generate_lead` | `currency`, `value` | `lead_source` | Discovery call booked, contact form submitted |
| `qualify_lead` | `currency`, `value` | — | Lead moves to qualified stage |
| `close_convert_lead` | `currency`, `value` | — | Lead converts to paying client |
| `close_unconvert_lead` | `currency`, `value` | `unconvert_lead_reason` | Lead lost |
| `disqualify_lead` | `currency`, `value` | `disqualified_lead_reason` | Lead disqualified |

#### E-Commerce Events (Stripe Purchases: Courses, Consulting Packages)

| Event | Required Parameters | Optional Parameters | Use Case |
|---|---|---|---|
| `view_item` | `currency`, `value`, `items[]` | — | User views a product/service page |
| `view_item_list` | `items[]` | `item_list_id`, `item_list_name` | User views service listing or course catalog |
| `add_to_cart` | `currency`, `value`, `items[]` | — | User adds item (if applicable) |
| `begin_checkout` | `currency`, `value`, `items[]` | `coupon` | User clicks "Buy" / initiates Stripe checkout |
| `add_payment_info` | `currency`, `value`, `items[]` | `coupon`, `payment_type` | Payment method provided (Stripe handles this) |
| `purchase` | `currency`, `value`, `transaction_id`, `items[]` | `coupon`, `shipping`, `tax`, `customer_type` | Stripe checkout success — fire on success page |
| `refund` | `currency`, `transaction_id`, `value` | `items[]` | If refund tracking needed |

#### User Engagement Events

| Event | Required Parameters | Optional Parameters | Use Case |
|---|---|---|---|
| `login` | — | `method` | User logs in (Supabase auth) |
| `sign_up` | — | `method` | User creates account |
| `join_group` | — | `group_id` | User joins community |
| `search` | `search_term` | — | Site search |
| `select_content` | — | `content_type`, `content_id` | User selects a portfolio item, blog post, etc. |
| `share` | — | `method`, `content_type`, `item_id` | User shares content |

#### Education/Course Events (Custom but following recommended patterns)

| Event | Parameters | Use Case |
|---|---|---|
| `tutorial_begin` | `course_name`, `lesson_name` | User starts a course/lesson |
| `tutorial_complete` | `course_name`, `lesson_name` | User completes a course/lesson |

### 1.5 Custom Events

Custom events are for tracking interactions not covered by automatic or recommended events.

**Naming Conventions:**
- Use snake_case (lowercase + underscores): `cta_click`, `calendly_booking`
- Must start with a letter (not a number or underscore)
- Max 40 characters for event name
- Max 500 distinct event names per property
- Cannot use reserved prefixes: `_`, `firebase_`, `ga_`, `google_`, `gtag.`
- Cannot use reserved event names: `ad_activeview`, `ad_click`, `ad_exposure`, `ad_impression`, `ad_query`, `adunit_exposure`, `app_clear_data`, `app_install`, `app_update`, `app_remove`, `error`, `first_open`, `first_visit`, `in_app_purchase`, `notification_dismiss`, `notification_foreground`, `notification_open`, `notification_receive`, `os_update`, `session_start`, `screen_view`, `user_engagement`

**Parameter Limits:**
- Max 25 custom parameters per event
- Parameter names: max 40 characters
- Parameter string values: max 100 characters
- Max 50 custom text event-scoped dimensions
- Max 50 custom numeric event-scoped metrics
- Max 25 custom user-scoped dimensions

### 1.6 User Properties and User ID Tracking

**User Properties** are attributes about the user (not the event). Examples:
- `user_type`: "free", "subscriber", "consulting_client"
- `membership_tier`: "community", "course", "enterprise"
- `acquisition_source`: "organic", "referral", "paid"

Set via:
```javascript
gtag('set', 'user_properties', {
  user_type: 'subscriber',
  membership_tier: 'course'
});
```

**User ID Tracking** — When a user authenticates via Supabase:
```javascript
gtag('config', 'G-XXXXXXXXXX', {
  'user_id': 'SUPABASE_USER_ID'
});
```

This enables cross-device tracking: GA4 stitches sessions from phone, tablet, and desktop into one user when they log in on each device.

**Reporting Identity** (Admin > Data Display > Reporting Identity):
- **Blended** (recommended): Uses User ID > Google Signals > Device ID > Modeling, in that priority order
- **Observed**: User ID > Google Signals > Device ID (no modeling)
- **Device-based**: Device ID only

### 1.7 Google Signals

Google Signals allows cross-device tracking for users logged into Google accounts who have enabled ad personalization.

**Important 2024+ change:** Google Signals is no longer part of reporting identity. It still feeds Audiences and remarketing but does not affect user counting in reports.

**How to enable:** Admin > Data Settings > Data Collection > Toggle "Google signals data collection" ON.

**Limitations:** Only works for Google-logged-in users with ad personalization enabled. Not a replacement for User ID.

### 1.8 Data Retention Settings

Configure at Admin > Data Settings > Data Retention.

| Setting | Options | Recommendation |
|---|---|---|
| Event data retention | 2 months or 14 months | **14 months** — choose the max for meaningful YoY analysis |
| Reset user data on new activity | On/Off | **ON** — extends retention window for active users |

Note: Aggregated data in standard reports is NOT affected by retention. Retention only affects data accessible in Explorations and the Data API.

### 1.9 Consent Mode v2

**Who needs it:** Mandatory for sites serving users in the EEA and UK who use Google advertising products. For US-only sites, it is not strictly required as of March 2026, but implementing it is still a best practice.

**What it does:** Controls how Google tags behave based on user consent for cookies and data collection.

**Two modes:**

| Mode | Behavior When User Rejects | Data Recovery |
|---|---|---|
| **Basic** | All tags blocked, zero data | None |
| **Advanced** | Tags fire but send anonymous cookieless pings | Google models ~70% of missing conversions |

**Four consent parameters:**
- `ad_storage` — Controls cookies for advertising
- `analytics_storage` — Controls cookies for analytics
- `ad_user_data` — Controls sending user data to Google for ads
- `ad_personalization` — Controls personalized advertising (remarketing)

**Implementation requires:**
1. A Google-certified Consent Management Platform (CMP): CookieScript, Cookiebot, OneTrust, Termly, CookieYes
2. Default consent state set to "denied" for EEA/UK visitors
3. Consent update commands fire when user makes a choice
4. GTM or gtag.js configured to respect consent signals

**For theinnovativenative.com:** If your audience is primarily US-based, Consent Mode v2 is optional but recommended. If you ever run Google Ads targeting EU users, it becomes mandatory.

### 1.10 Debug Mode and DebugView

**DebugView location:** Admin > DebugView

**Three ways to activate:**
1. **Google Analytics Debugger Chrome extension** — Install, toggle on, browse site
2. **GTM Preview Mode** — Automatically enables debug_mode on GA4 events
3. **Manual parameter** — Add `debug_mode: true` to your GA4 config tag

**What DebugView shows:**
- Real-time event timeline (events appear within seconds)
- Click any event to inspect all parameters
- User properties shown in a separate panel
- Events appear as colored bubbles on a timeline — conversion events highlighted differently

---

## 2. Google Tag Manager (GTM)

### 2.1 Prerequisites

1. **Google Account** — Same account or separate; GTM access is managed independently
2. **GTM Account** — Created at tagmanager.google.com. One account per company.
3. **GTM Container** — Created within the account. Choose "Web" container type. You get a Container ID: `GTM-XXXXXXX`
4. **Container Snippet** — Two code snippets provided after container creation:
   - **Head snippet** (`<script>`) — Goes as high in `<head>` as possible
   - **Body snippet** (`<noscript>`) — Goes immediately after opening `<body>` tag
5. **GA4 Measurement ID** — Needed to create the GA4 Configuration tag inside GTM

### 2.2 Why GTM vs Direct GA4 (gtag.js)

| Factor | Direct GA4 (gtag.js) | GTM |
|---|---|---|
| Setup complexity | Simple — one script tag | Moderate — container + tags |
| Adding new tracking | Requires code changes + deploy | No-code via GTM UI |
| Non-developer management | Cannot | Can — marketers add/edit tags |
| Version control | Git only | Built-in versioning + workspaces |
| Multiple vendor tags | Separate scripts each | All managed in one container |
| Preview/debug | Limited | Full preview mode + Tag Assistant |
| Consent management | Manual per tag | Centralized via consent triggers |
| Performance | One script per vendor | One container loads all |
| Server-side option | No | Yes (sGTM) |

**Recommendation for this site: Use GTM.** It future-proofs the setup. When you add Facebook Pixel, Google Ads, or any other tracking, it all goes through GTM without touching code.

### 2.3 Container Types

| Type | Use Case |
|---|---|
| **Web** | Standard website tracking (this is what you need) |
| **Server** | Server-side tagging — processes data on a server before forwarding to vendors. Improves performance, ad-blocker resilience, and data control. Requires hosting (GCP, AWS, or managed services like Stape.io starting at ~$5/month). |
| **iOS / Android** | Mobile app tracking via Firebase |
| **AMP** | Accelerated Mobile Pages |

For theinnovativenative.com: Start with **Web container**. Consider adding **Server container** later if you run paid ads and need ad-blocker resilience.

### 2.4 Tag Types Relevant to This Site

| Tag Type | Purpose | When to Add |
|---|---|---|
| **Google Tag** (GA4 Configuration) | Initializes GA4 on every page. Sends page_view, session_start, etc. | Day 1 — required |
| **GA4 Event** | Sends custom events (cta_click, calendly_booking, purchase, etc.) | Day 1 — as needed per event |
| **Conversion Linker** | Sets first-party cookies for Google Ads conversion tracking | When running Google Ads |
| **Google Ads Conversion Tracking** | Fires on conversion pages (e.g., checkout success) | When running Google Ads |
| **Google Ads Remarketing** | Builds remarketing audiences | When running Google Ads |
| **Facebook/Meta Pixel** | Tracks events for Meta ads | When running Meta ads |
| **Custom HTML** | For any vendor script (Calendly listener, Hotjar, etc.) | As needed |

### 2.5 Trigger Types

Triggers determine WHEN a tag fires.

#### Page Load Triggers

| Trigger | When It Fires | Use Case |
|---|---|---|
| **Consent Initialization** | Before all other triggers | Consent management tags (CMP) |
| **Initialization** | After consent, before all other triggers | GA4 Configuration tag |
| **Page View** | When browser starts loading page | Basic pageview tracking |
| **DOM Ready** | When HTML DOM is fully parsed (before images/scripts finish) | Tags that need DOM elements |
| **Window Loaded** | When page fully loads (all resources) | Tags dependent on full page load |

#### User Interaction Triggers

| Trigger | When It Fires | Use Case |
|---|---|---|
| **Click — All Elements** | Any click on the page | Track CTA button clicks, nav clicks |
| **Click — Just Links** | Click on `<a>` elements only | Outbound link tracking |
| **Form Submission** | Form `submit` event fires | Contact form submissions |
| **Scroll Depth** | User scrolls to specified percentages (25/50/75/100) | Engagement depth tracking |
| **Element Visibility** | Specified element enters viewport | Track if user sees pricing section, CTA |
| **YouTube Video** | YouTube iframe video events (start, progress, complete) | Video engagement |
| **Timer** | After specified interval | Time-on-page tracking |

#### Other Triggers

| Trigger | When It Fires | Use Case |
|---|---|---|
| **Custom Event** | When matching event is pushed to dataLayer | Calendly events, Stripe events, any custom interaction |
| **History Change** | Browser history state changes (SPA navigation) | Track client-side route changes in Next.js |
| **JavaScript Error** | When a JS error occurs | Error monitoring |
| **Trigger Group** | When multiple specified triggers have all fired | Complex conditional firing |

#### Built-In Click Variables (auto-populated on click triggers)

| Variable | Value |
|---|---|
| `Click Element` | The DOM element clicked |
| `Click Classes` | CSS classes of clicked element |
| `Click ID` | ID attribute of clicked element |
| `Click Target` | Target attribute of clicked element |
| `Click URL` | href of clicked link |
| `Click Text` | Text content of clicked element |

### 2.6 Variable Types

Variables provide dynamic values to tags and triggers.

#### Built-In Variables (enable in GTM > Variables)

| Category | Variables |
|---|---|
| **Pages** | Page URL, Page Hostname, Page Path, Referrer |
| **Clicks** | Click Element, Click Classes, Click ID, Click Target, Click URL, Click Text |
| **Forms** | Form Element, Form Classes, Form ID, Form Target, Form URL, Form Text |
| **History** | New History Fragment, Old History Fragment, New History State, Old History State |
| **Visibility** | Percent Visible, On-Screen Duration |
| **Videos** | Video Provider, Video Status, Video URL, Video Title, Video Duration, Video Current Time, Video Percent, Video Visible |
| **Scroll** | Scroll Depth Threshold, Scroll Depth Units, Scroll Direction |
| **Utilities** | Container ID, Container Version, Debug Mode, Environment Name, HTML ID, Random Number |

#### User-Defined Variable Types

| Variable Type | What It Does | Use Case |
|---|---|---|
| **Data Layer Variable** | Reads a value pushed to `window.dataLayer` | Read `calendly_event`, `purchase_value`, `user_id` |
| **DOM Element** | Reads text or attribute from a DOM element | Read form field values, button text |
| **JavaScript Variable** | Reads a global JS variable | Read `window.user.email` |
| **Custom JavaScript** | Runs a JS function, returns the result | Compute values, format data |
| **1st Party Cookie** | Reads a cookie value | Read session cookies, auth tokens |
| **URL** | Parses parts of current URL (host, path, query, fragment) | Extract UTM params from URL |
| **Constant** | Stores a fixed string value | GA4 Measurement ID, API keys |
| **Lookup Table** | Maps input values to output values | Map page paths to page categories |
| **RegEx Table** | Like Lookup Table but uses regex matching | Flexible pattern-based mappings |
| **Google Analytics Settings** | Shared GA settings for multiple tags | Reusable GA4 config |

### 2.7 Data Layer

The Data Layer is a JavaScript object (`window.dataLayer`) that acts as the communication bridge between your website code and GTM.

**How it works:**
1. Your website pushes data to `window.dataLayer`
2. GTM reads the data layer on every push
3. Triggers can fire based on dataLayer events
4. Tags can use dataLayer variables as parameters

**Initialize before GTM container loads:**
```javascript
window.dataLayer = window.dataLayer || [];
```

**Push events:**
```javascript
// Simple event
window.dataLayer.push({ event: 'cta_click' });

// Event with data
window.dataLayer.push({
  event: 'calendly_booking',
  calendly_event_type: 'ai-discovery-call',
  calendly_event_name: 'scheduled'
});

// Ecommerce purchase
window.dataLayer.push({
  event: 'purchase',
  ecommerce: {
    transaction_id: 'T_12345',
    value: 2500.00,
    currency: 'USD',
    items: [{
      item_id: 'law-firm-rag-pilot',
      item_name: 'Law Firm RAG Pilot Access',
      price: 2500.00,
      quantity: 1
    }]
  }
});
```

**Key rules:**
- Always use `dataLayer.push()` — never overwrite `window.dataLayer = [...]` after GTM loads
- Variable names are case-sensitive — `dataLayer` not `datalayer`
- Data persists within the current page. On SPA navigation, data from previous pushes remains
- Always push `event` key to trigger GTM Custom Event triggers

### 2.8 Server-Side GTM (sGTM)

**What it is:** An extension of GTM that moves tag execution from the browser to a server you control.

**Architecture:**
```
Browser → Your Server (sGTM container) → GA4 / Google Ads / Meta / etc.
```

**Benefits:**
- **Performance:** Fewer scripts in browser, faster page loads
- **Ad-blocker resilience:** Requests come from your domain (first-party), bypassing ad blockers. Recovers 90-95% of tracking data.
- **Cookie longevity:** Server-set cookies last longer, especially on Safari (where browser-set cookies expire in 7 days)
- **Data control:** Filter, enrich, or redact data before it reaches vendors
- **Privacy compliance:** Better control over what data leaves your infrastructure

**When to implement sGTM:**
- Running paid ads ($10K+/month) where tracking accuracy is critical
- Safari-heavy audience (iOS users)
- Losing data to ad blockers
- Need to comply with strict privacy regulations

**Cost:** Managed services like Stape.io: free tier to ~$100/month depending on traffic. Self-hosted on GCP: ~$20-150/month.

**For theinnovativenative.com:** Not needed on Day 1. Add when you start running paid Google Ads or Meta Ads and need maximum conversion tracking accuracy.

### 2.9 GTM Preview/Debug Mode

**How to use:**
1. Click "Preview" in top right of GTM workspace
2. Enter your site URL
3. A new tab opens with your site + a Tag Assistant panel at the bottom
4. Browse your site — Tag Assistant shows which tags fired/didn't fire on each interaction
5. Click any tag to see trigger details, variables used, and data sent

**What you can inspect:**
- Tags Fired / Tags Not Fired on each event
- Trigger conditions that matched or failed
- All variable values at the time of each event
- Data Layer state after each push
- Console errors

---

## 3. Next.js Specific Implementation

### 3.1 Current Site Architecture

Your site uses Next.js 13.4.19 with the **Pages Router** (not App Router). Key files:

- `src/pages/_document.tsx` — HTML shell (renders once on server)
- `src/pages/_app.tsx` — App wrapper (wraps every page, handles global state)
- `src/pages/index.tsx` — Home page
- `src/pages/law-firm-rag.tsx`, `haven-blueprint.tsx`, `visionspark-re.tsx` — Product landing pages
- `src/pages/checkout/success.tsx`, `haven-success.tsx`, `visionspark-re-success.tsx` — Stripe success pages
- `src/pages/classroom/` — Course pages
- `src/pages/blog/` — Blog pages
- `src/pages/portfolio.tsx` — Portfolio
- `src/pages/dashboard.tsx` — User dashboard

### 3.2 GTM Snippet Placement

**Option A: `_document.tsx` (Recommended for GTM)**

Place the GTM snippets in `_document.tsx` because this file renders the raw HTML shell. The GTM snippet must load as early as possible.

```tsx
// src/pages/_document.tsx
import { Html, Head, Main, NextScript } from "next/document";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID; // e.g., 'GTM-XXXXXXX'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* GTM Head Snippet */}
        {GTM_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');`,
            }}
          />
        )}
      </Head>
      <body>
        {/* GTM NoScript Fallback */}
        {GTM_ID && (
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
              height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          />
        )}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

**Option B: `_app.tsx` with Next.js Script Component**

Use this if you want `afterInteractive` loading strategy (slightly better performance, but GTM loads slightly later):

```tsx
// In _app.tsx
import Script from 'next/script';

// Inside the App component return:
<Script
  id="gtm-script"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');`,
  }}
/>
```

**Recommendation:** Use Option A (`_document.tsx`) for GTM. GTM needs to load as early as possible to catch all events, including the initial page_view.

### 3.3 Route Change Tracking for SPA Navigation

Next.js Pages Router uses client-side navigation for internal links. Without additional code, GTM only sees the initial page load. You must push `page_view` events on route changes.

**Create a custom hook:**

```tsx
// src/hooks/useGTMPageView.ts
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export const useGTMPageView = () => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'page_view',
        page_location: window.location.origin + url,
        page_path: url,
        page_title: document.title,
      });
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);
};
```

**Use in `_app.tsx`:**

```tsx
export default function App({ Component, pageProps }: AppProps) {
  useGTMPageView(); // Track SPA navigations

  return (
    <AuthProvider>
      {/* ... existing code */}
    </AuthProvider>
  );
}
```

**GTM Configuration:** Create a trigger in GTM:
- Trigger type: **Custom Event**
- Event name: `page_view`
- This triggers the GA4 Event tag with page_view data

Alternatively, use the built-in **History Change** trigger in GTM which automatically detects `pushState` / `replaceState` changes. However, the custom dataLayer push approach gives you more control over the data sent.

### 3.4 Data Layer Pushes for Specific Interactions

**Calendly Booking (embed is already in `_app.tsx`):**

Add a Calendly event listener via GTM Custom HTML tag (fires on All Pages):

```html
<script>
window.addEventListener('message', function(e) {
  if (e.data.event && e.data.event.indexOf('calendly') === 0) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'calendly',
      'calendly_action': e.data.event.split('.')[1]
    });
  }
});
</script>
```

This captures four Calendly events:
- `profile_page_viewed` — Calendar widget loaded
- `event_type_viewed` — User clicked an event type
- `date_and_time_selected` — User picked a slot
- `event_scheduled` — Booking confirmed

**Limitation:** Only works with embedded Calendly widgets (which you use via popup), NOT hosted Calendly pages.

**Stripe Purchase (on success pages):**

On checkout success pages (`/checkout/success`, `/checkout/haven-success`, `/checkout/visionspark-re-success`), push purchase data:

```tsx
// In the success page component
useEffect(() => {
  if (session_id && !isLoading) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'purchase',
      ecommerce: {
        transaction_id: session_id,
        value: 2500.00,  // from Stripe session or props
        currency: 'USD',
        items: [{
          item_id: 'law-firm-rag-pilot',
          item_name: 'Law Firm RAG Pilot Access',
          item_category: 'Consulting',
          price: 2500.00,
          quantity: 1
        }]
      }
    });
  }
}, [session_id, isLoading]);
```

**CTA Button Clicks:**

For important CTAs, either:
1. Use GTM Click triggers with CSS selectors (no code changes), OR
2. Push from React components:

```tsx
const handleCTAClick = (ctaName: string, ctaLocation: string) => {
  window.dataLayer?.push({
    event: 'cta_click',
    cta_name: ctaName,
    cta_location: ctaLocation,
    page_path: window.location.pathname
  });
};

// Usage:
<button onClick={() => { handleCTAClick('book_discovery_call', 'home_hero'); openCalendly(); }}>
  Book a Discovery Call
</button>
```

### 3.5 Consent Management Integration

If implementing consent (for EU compliance or best practice):

1. Install a CMP (e.g., CookieScript, Cookiebot) — most provide a GTM template
2. In GTM, set default consent state via a tag on the **Consent Initialization** trigger:

```javascript
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied'  // or 'granted' for US users
});
```

3. The CMP updates consent when user makes a choice:

```javascript
gtag('consent', 'update', {
  'ad_storage': 'granted',
  'analytics_storage': 'granted'
  // etc.
});
```

4. Configure each GTM tag's "Consent Settings" to require appropriate consent types (e.g., GA4 tags require `analytics_storage`).

### 3.6 Environment Variable

Add to `.env.local`:
```
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
```

The `NEXT_PUBLIC_` prefix makes them available in browser-side code.

---

## 4. Events to Track for This Business

### 4.1 Complete Event Tracking Plan

#### Tier 1: Automatically Tracked (GA4 Enhanced Measurement)

| What | Event | How | Notes |
|---|---|---|---|
| Page views | `page_view` | Automatic + SPA hook | All pages with title, path, referrer |
| Scroll depth (90%) | `scroll` | Automatic (Enhanced Measurement) | Only fires at 90% |
| Outbound link clicks | `click` | Automatic (Enhanced Measurement) | Links to external domains |
| File downloads | `file_download` | Automatic (Enhanced Measurement) | PDF, DOCX, etc. |
| Site search | `view_search_results` | Automatic (Enhanced Measurement) | If search is implemented |
| YouTube video engagement | `video_start`, `video_progress`, `video_complete` | Automatic (Enhanced Measurement) | YouTube embeds only |
| Form interactions | `form_start`, `form_submit` | Automatic (Enhanced Measurement) | HTML form elements |

#### Tier 2: GTM Trigger-Based (No Code Changes)

| What | Event | GTM Trigger | Configuration |
|---|---|---|---|
| Scroll depth (25/50/75/100%) | `scroll_depth` | Scroll Depth trigger | Percentages: 25, 50, 75, 100 |
| CTA clicks — "Book Discovery Call" | `cta_click` | Click — All Elements | Match CSS class or Click Text |
| CTA clicks — "See What We Build" | `cta_click` | Click — All Elements | Match CSS class or Click Text |
| CTA clicks — "See the Full Background" | `cta_click` | Click — All Elements | Match CSS class or Click Text |
| CTA clicks — all `.btn` elements | `cta_click` | Click — All Elements | Click Classes contains "btn" |
| Pricing section viewed | `section_viewed` | Element Visibility | CSS selector for pricing section |
| Testimonials section viewed | `section_viewed` | Element Visibility | CSS selector for testimonials section |
| Time on page | `user_engagement` | Timer trigger | Fire at 30s, 60s, 120s, 300s |
| Outbound link clicks (detailed) | `outbound_click` | Click — Just Links | Click URL does not contain theinnovativenative.com |

#### Tier 3: DataLayer Push (Requires Code Changes)

| What | Event | Where to Push | Parameters |
|---|---|---|---|
| Calendly widget opened | `calendly.profile_page_viewed` | Custom HTML tag (listener) | `calendly_action` |
| Calendly booking completed | `calendly.event_scheduled` | Custom HTML tag (listener) | `calendly_action` |
| Stripe checkout initiated | `begin_checkout` | Product page "Buy" button onClick | `currency`, `value`, `items[]` |
| Stripe purchase completed | `purchase` | `/checkout/success` pages | `transaction_id`, `value`, `currency`, `items[]` |
| User sign up | `sign_up` | Supabase auth callback | `method` (email, google, etc.) |
| User login | `login` | Supabase auth callback | `method` |
| Community join | `join_group` | Community signup action | `group_id` |
| Course enrollment | `begin_checkout` + `purchase` | Course purchase flow | `items[]` with course details |
| Lesson started | `tutorial_begin` | Classroom lesson page load | `course_name`, `lesson_name` |
| Lesson completed | `tutorial_complete` | Lesson completion action | `course_name`, `lesson_name` |
| Course completed | `tutorial_complete` | All lessons done | `course_name`, `completion_percentage` |

### 4.2 Conversion Events (Mark as Conversions in GA4)

Mark these events as conversions in GA4 (Admin > Events > toggle "Mark as conversion"):

| Event | Type | Estimated Value |
|---|---|---|
| `purchase` | Hard conversion | Actual transaction value |
| `generate_lead` (Calendly booking) | Hard conversion | Estimated lead value ($500-2500) |
| `sign_up` | Soft conversion | — |
| `begin_checkout` | Soft conversion | — |
| `tutorial_complete` | Soft conversion | — |

### 4.3 Site Pages and Their Tracking

| Page | Path | Key Events to Track |
|---|---|---|
| Home | `/` | page_view, scroll_depth, cta_clicks (Book Discovery Call, See What We Build), calendly interactions, section_viewed (testimonials, pricing) |
| Law Firm RAG | `/law-firm-rag` | page_view, view_item, begin_checkout, scroll_depth, cta_clicks |
| Haven Blueprint | `/haven-blueprint` | page_view, view_item, begin_checkout, scroll_depth |
| VisionSpark RE | `/visionspark-re` | page_view, view_item, begin_checkout, scroll_depth |
| Checkout Success | `/checkout/success` | purchase |
| Haven Success | `/checkout/haven-success` | purchase |
| VisionSpark Success | `/checkout/visionspark-re-success` | purchase |
| Portfolio | `/portfolio` | page_view, select_content (portfolio item clicks) |
| Blog | `/blog`, `/blog/[slug]` | page_view, scroll_depth, share |
| Classroom | `/classroom`, `/classroom/[course]/[lesson]` | page_view, tutorial_begin, tutorial_complete |
| Dashboard | `/dashboard` | page_view, login (if redirected from auth) |
| Professional Experience | `/professionalExperience` | page_view, scroll_depth, file_download (resume) |
| Templates | `/templates`, `/templates/[slug]` | page_view, view_item, begin_checkout |

---

## 5. Attribution and Conversion Tracking

### 5.1 Google Ads Conversion Tracking via GTM

**Setup steps:**
1. **Link GA4 to Google Ads:** GA4 Admin > Product Links > Google Ads Linking
2. **Import GA4 conversions to Google Ads:** Google Ads > Goals > Conversions > Import > GA4
3. **Or use native Google Ads conversion tag in GTM:**
   - Create a "Google Ads Conversion Tracking" tag
   - Set Conversion ID and Conversion Label (from Google Ads)
   - Trigger: Custom Event matching your conversion event (e.g., `purchase`)
4. **Add Conversion Linker tag:** Required for Google Ads. Create a "Conversion Linker" tag, trigger on All Pages.

**Enhanced Conversions:**
- Captures first-party data (email, phone), hashes it (SHA-256), and matches against Google's logged-in users
- Recovers 5-15% more conversions
- Setup in GTM: Enable in the Google Ads conversion tag settings, configure data source (auto-detect or data layer)
- Target: 50%+ of conversions should be "enhanced" — below 30% means data capture issues

### 5.2 UTM Parameter Tracking

GA4 automatically reads UTM parameters from URLs. No additional configuration needed.

**Required UTM parameters for all campaign links:**

| Parameter | Purpose | Example |
|---|---|---|
| `utm_source` | Traffic source | `google`, `facebook`, `linkedin`, `newsletter` |
| `utm_medium` | Marketing medium | `cpc`, `social`, `email`, `referral` |
| `utm_campaign` | Campaign name | `spring_2026_consulting`, `law_firm_rag_launch` |

**Optional but recommended:**

| Parameter | Purpose | Example |
|---|---|---|
| `utm_term` | Paid keyword | `ai_consulting` |
| `utm_content` | Ad variant / CTA identifier | `hero_cta`, `sidebar_banner` |

**Naming conventions (critical for clean data):**
- All lowercase: `utm_source=google` not `utm_source=Google`
- Use underscores, not spaces: `utm_campaign=spring_2026` not `spring 2026`
- Be consistent: pick one name per source and stick to it
- Document in a shared spreadsheet

**Example tagged URL:**
```
https://theinnovativenative.com/law-firm-rag?utm_source=linkedin&utm_medium=social&utm_campaign=law_firm_rag_launch&utm_content=hero_post
```

### 5.3 Cross-Domain Tracking

**When needed:** When users navigate between different domains during a session and you need to maintain their identity.

**Your cross-domain scenarios:**

| Scenario | Domains | Need Cross-Domain? | Solution |
|---|---|---|---|
| Calendly booking (popup) | theinnovativenative.com → Calendly iframe | No | Popup is an iframe on your domain. The Calendly listener captures events. Calendly also supports direct GA4 integration (Calendly > Admin > Integrations > Google Analytics — enter your GA4 Measurement ID). |
| Stripe Checkout (redirect) | theinnovativenative.com → checkout.stripe.com → theinnovativenative.com/checkout/success | Partial | Stripe checkout is a hosted page on stripe.com. You cannot install GA4 on Stripe. Instead: fire `begin_checkout` before redirecting to Stripe, fire `purchase` on the success page callback. The session breaks at Stripe but picks back up on success page return. |
| Blog / subdomains | Same domain | No | Same GA4 property handles it |

**If you ever need cross-domain tracking (e.g., a separate checkout domain):**
1. GA4 Admin > Data Streams > [stream] > Configure Tag Settings > Configure your domains
2. Add all domains that should share the same client ID
3. GA4 automatically appends `_gl` linker parameter to URLs between domains

### 5.4 Attribution Models in GA4 (2026)

**Data-Driven Attribution (DDA)** is the default and recommended model. It uses machine learning to distribute conversion credit across all touchpoints based on your actual data.

| Model | How It Works | Best For |
|---|---|---|
| **Data-Driven** (default) | ML-based credit distribution across all touchpoints | Most businesses (recommended) |
| **Last Click** | 100% credit to last touchpoint | Simple reporting, Google Ads comparison |
| **First Click** | 100% credit to first touchpoint | Understanding acquisition channels |

**Configure at:** GA4 Admin > Attribution Settings

**New in 2026:** GA4 Conversion Attribution Analysis Report (beta, Feb 2026):
- Assisted Conversions view: Shows upper-funnel touchpoints that assisted conversions
- Refined Funnel Analysis: Categorizes touchpoints into Early, Mid, Late stages

**Lookback windows:**
- Acquisition events: 30 days (default)
- All other events: 90 days (default)
- Can be adjusted in Attribution Settings

---

## 6. Testing

### 6.1 GA4 DebugView

**Access:** GA4 > Admin > DebugView

**How to activate:**
1. Enable GTM Preview mode (automatically activates DebugView), OR
2. Install "Google Analytics Debugger" Chrome extension, OR
3. Add `debug_mode: true` to your GA4 Configuration tag in GTM

**What to check:**
- Events appear in real-time on the timeline
- Click each event to verify parameters are correct
- Verify `page_view` fires on every navigation (including SPA route changes)
- Verify `purchase` fires on checkout success with correct `transaction_id` and `value`
- Verify custom events (`cta_click`, `calendly`) fire with correct parameters
- Check user properties are set correctly

### 6.2 GTM Preview Mode

**Access:** GTM > Preview (top right)

**Workflow:**
1. Click Preview
2. Enter your site URL
3. Browse your site — Tag Assistant panel shows at bottom
4. For each interaction, check:
   - Tags Fired vs. Tags Not Fired
   - Which trigger activated the tag
   - What variables resolved to
   - Data Layer state

**Test scenarios to run:**
- [ ] Initial page load — GA4 Configuration tag fires
- [ ] Navigate to another page (SPA) — page_view event pushes to dataLayer
- [ ] Click "Book a Discovery Call" — cta_click event fires
- [ ] Open Calendly popup — calendly event fires
- [ ] Complete Calendly booking — calendly.event_scheduled fires
- [ ] Click outbound link — outbound click event fires
- [ ] Scroll to bottom of long page — scroll_depth events fire at 25/50/75/100%
- [ ] Download a file — file_download fires
- [ ] Visit product page — view_item fires
- [ ] Click "Buy" / checkout button — begin_checkout fires
- [ ] Complete purchase (test mode) — purchase fires on success page
- [ ] Sign up / log in — sign_up / login fires

### 6.3 Google Tag Assistant

**Access:** Install "Tag Assistant Companion" Chrome extension or use the legacy Tag Assistant at tagassistant.google.com

**What it does:**
- Validates that GTM container is properly installed
- Shows all Google tags on the page and their status
- Flags errors (missing tags, misconfigured consent, etc.)

### 6.4 GA4 Real-Time Reports

**Access:** GA4 > Reports > Realtime

**What to check after publishing:**
- Users count increases when you visit the site
- Events appear in the event stream
- Conversions show up in the conversions card
- User properties are populated
- Geographic data is correct

**Note:** Real-time data has a ~30 second delay. DebugView is faster for testing.

### 6.5 Testing Checklist

Before publishing GTM changes to production:

- [ ] **GTM Preview:** All expected tags fire on all expected triggers
- [ ] **GTM Preview:** No unexpected tags fire
- [ ] **GTM Preview:** All variables resolve to correct values
- [ ] **DebugView:** All events appear with correct parameters
- [ ] **DebugView:** No duplicate events
- [ ] **DebugView:** User properties set correctly
- [ ] **Real-time:** Data flows into GA4 after publishing
- [ ] **Cross-browser:** Test in Chrome, Safari, Firefox
- [ ] **Mobile:** Test on mobile device
- [ ] **Ad blocker:** Test with and without ad blocker to understand data loss
- [ ] **Consent:** If CMP is active, test accepted and rejected states

---

## 7. Prerequisites Checklist

### Accounts and Access

- [ ] Google account created (or existing one designated for analytics)
- [ ] GA4 property created at analytics.google.com
- [ ] Web data stream configured with `https://theinnovativenative.com`
- [ ] Measurement ID noted: `G-__________`
- [ ] Enhanced Measurement enabled (all toggles reviewed)
- [ ] Data retention set to 14 months (Admin > Data Settings > Data Retention)
- [ ] Google Signals toggled ON (Admin > Data Settings > Data Collection)
- [ ] Reporting Identity set to "Blended" (Admin > Data Display > Reporting Identity)
- [ ] GTM account created at tagmanager.google.com
- [ ] GTM Web container created
- [ ] Container ID noted: `GTM-__________`

### Environment Variables

- [ ] `.env.local` updated with `NEXT_PUBLIC_GTM_ID`
- [ ] `.env.local` updated with `NEXT_PUBLIC_GA4_ID`
- [ ] Both added to Hostinger environment config (production)
- [ ] Both added to `.env.example` for documentation (no actual values)
- [ ] Both added to `.gitignore` check (`.env.local` should already be gitignored)

### Code Changes

- [ ] `_document.tsx` updated with GTM head and body snippets
- [ ] `useGTMPageView` hook created for SPA route tracking
- [ ] `_app.tsx` updated to use the pageview hook
- [ ] TypeScript declaration for `window.dataLayer` added (global.d.ts or similar)
- [ ] Checkout success pages push `purchase` event to dataLayer
- [ ] Product/service pages push `view_item` event to dataLayer
- [ ] CTA buttons push `cta_click` events (or handled via GTM Click triggers)

### GTM Container Configuration

- [ ] **Google Tag** (GA4 Configuration) created with Measurement ID
- [ ] Trigger: Initialization — All Pages
- [ ] **GA4 Event tags** created for each custom event
- [ ] **Calendly Listener** Custom HTML tag created
- [ ] **Scroll Depth** trigger configured (25/50/75/100%)
- [ ] **CTA Click** triggers configured
- [ ] **History Change** trigger configured (for SPA backup tracking)
- [ ] Data Layer Variables created for all custom data
- [ ] All tags tested in Preview mode
- [ ] Container published

### GA4 Configuration

- [ ] Conversion events marked (purchase, generate_lead, sign_up, begin_checkout)
- [ ] Custom dimensions registered for custom event parameters
- [ ] User properties configured (user_type, membership_tier)
- [ ] Audiences created (purchasers, leads, course students, etc.)
- [ ] GA4 linked to Google Ads (when running ads)
- [ ] GA4 linked to Google Search Console

### Consent (If Applicable)

- [ ] CMP selected and account created
- [ ] CMP JavaScript installed (via GTM Custom HTML or script)
- [ ] Default consent state configured (denied for EEA, granted for US)
- [ ] Consent update mechanism verified
- [ ] GTM tags configured with consent requirements
- [ ] Tested: accepted state sends full data
- [ ] Tested: rejected state sends anonymized pings (Advanced) or nothing (Basic)

### Google Ads Integration (When Running Ads)

- [ ] Google Ads account linked to GA4
- [ ] GA4 conversions imported into Google Ads
- [ ] Conversion Linker tag added in GTM (All Pages trigger)
- [ ] Enhanced Conversions enabled
- [ ] Attribution model reviewed (DDA recommended)
- [ ] UTM naming convention documented

---

## 8. Implementation Priority Order

### Phase 1: Foundation (Day 1)
1. Create GA4 property + data stream
2. Create GTM account + Web container
3. Add GTM snippet to `_document.tsx`
4. Create GA4 Configuration tag in GTM (Initialization trigger)
5. Create `useGTMPageView` hook for SPA navigation
6. Test with GTM Preview + DebugView
7. Publish GTM container
8. Verify data in GA4 Real-time reports

### Phase 2: Core Events (Week 1)
1. Set up Scroll Depth trigger (25/50/75/100%)
2. Set up CTA Click triggers for key buttons
3. Add Calendly listener tag
4. Push `view_item` on product/service pages
5. Push `begin_checkout` before Stripe redirect
6. Push `purchase` on checkout success pages
7. Mark conversion events in GA4
8. Test all events in DebugView

### Phase 3: User Tracking (Week 2)
1. Pass User ID from Supabase auth to GA4
2. Set user properties (user_type, membership_tier)
3. Track `sign_up` and `login` events
4. Track `tutorial_begin` and `tutorial_complete` for courses
5. Set up custom dimensions in GA4 for custom parameters
6. Configure Audiences in GA4

### Phase 4: Advertising Readiness (When Running Ads)
1. Link GA4 to Google Ads
2. Import conversions to Google Ads
3. Add Conversion Linker tag in GTM
4. Enable Enhanced Conversions
5. Implement Consent Mode v2 (if targeting EU)
6. Set up UTM naming convention
7. Consider server-side GTM if spending $10K+/month

### Phase 5: Optimization (Ongoing)
1. Review GA4 reports weekly
2. Create custom Explorations for funnel analysis
3. Set up automated alerts for anomalies
4. A/B test with GA4 Audiences
5. Refine conversion values based on actual data
6. Review attribution paths monthly

---

## Sources

### Official Google Documentation
- [GA4 Measurement ID](https://support.google.com/analytics/answer/12270356?hl=en)
- [GA4 Automatically Collected Events](https://support.google.com/analytics/answer/9234069?hl=en)
- [GA4 Recommended Events](https://support.google.com/analytics/answer/9267735?hl=en)
- [GA4 Recommended Events Reference (Developers)](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)
- [GA4 Enhanced Measurement](https://support.google.com/analytics/answer/9216061?hl=en)
- [GA4 Ecommerce Implementation](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)
- [GA4 Set Up Events](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [GTM Data Layer](https://developers.google.com/tag-platform/tag-manager/datalayer)
- [GTM About Triggers](https://support.google.com/tagmanager/answer/7679316?hl=en)
- [GTM Built-in Variables](https://support.google.com/tagmanager/answer/7182738?hl=en)
- [GTM User-Defined Variables](https://support.google.com/tagmanager/answer/7683362?hl=en)
- [Consent Mode Setup](https://developers.google.com/tag-platform/security/guides/consent)
- [GA4 Google Signals](https://support.google.com/analytics/answer/9445345?hl=en)
- [GA4 Consent Settings](https://support.google.com/analytics/answer/14275483?hl=en)

### Implementation Guides
- [Add GTM to Next.js — Complete Guide (caisy.io)](https://caisy.io/blog/gtm-nextjs-guide)
- [GTM in Next.js 13 (evolvingdev.com)](https://www.evolvingdev.com/post/how-to-add-google-tag-manager-gtm-to-next-js-13)
- [GA4 Integration in Next.js 13 Using GTM (rodyvansambeek.com)](https://www.rodyvansambeek.com/blog/easiest-ga4-integration-nextjs-13-gtm-guide)
- [How to Install GA4 with GTM — 2026 (analyticsmania.com)](https://www.analyticsmania.com/post/how-to-install-google-analytics-4-with-google-tag-manager/)
- [GA4 Tutorial for Beginners 2026 (analyticsmania.com)](https://www.analyticsmania.com/post/google-analytics-4-tutorial-for-beginners/)
- [Track Calendly with GTM and GA4 (analyticsmania.com)](https://www.analyticsmania.com/post/how-to-track-calendly-with-google-tag-manager-and-google-analytics-4/)
- [Next.js Third Party Libraries (nextjs.org)](https://nextjs.org/docs/app/guides/third-party-libraries)

### Attribution and Ads
- [Google Ads Conversion Tracking Setup 2026 (groas.ai)](https://groas.ai/post/google-ads-conversion-tracking-setup-2026-the-complete-guide-ga4-enhanced-conversions-consent-mode)
- [GA4 Attribution Report 2026 (1clickreport.com)](https://www.1clickreport.com/blog/ga4-attribution-report-2026-guide)
- [UTM Parameters in GA4 (analyticsmania.com)](https://www.analyticsmania.com/post/utm-parameters-in-google-analytics-4/)
- [GA4 Cross-Domain Tracking (martech.org)](https://martech.org/how-to-set-up-ga4-cross-domain-tracking-for-global-and-multi-brand-sites/)
- [Calendly + Google Analytics (help.calendly.com)](https://help.calendly.com/hc/en-us/articles/360001575393-Getting-started-with-Google-Analytics)
- [Stripe + GA4 Ecommerce (stripe-to-ga4.com)](https://stripe-to-ga4.com/)
- [Stripe Conversion Funnel (docs.stripe.com)](https://docs.stripe.com/payments/checkout/analyze-conversion-funnel)

### Server-Side and Privacy
- [GTM Server-Side Tagging Explained 2026 (analytify.io)](https://analytify.io/gtm-server-side-tagging/)
- [Server-Side Analytics in 2026 (bounteous.com)](https://www.bounteous.com/insights/2026/03/02/server-side-analytics-2026-and-beyond/)
- [Consent Mode v2 Basic vs Advanced 2026 (unifiedinfotech.net)](https://www.unifiedinfotech.net/blog/unlock-the-power-of-google-consent-mode-with-basic-vs-advanced-for-ga4-in-2026/)
- [GA4 in 2026 — Post-Cookie Era (medium.com)](https://ankitnagarsheth.medium.com/doing-ga4-in-2026-the-definitive-guide-to-google-analytics-in-the-post-cookie-era-c717faed2033)

### Testing and Debugging
- [GTM Preview Mode Guide 2026 (analyticsmania.com)](https://www.analyticsmania.com/post/google-tag-manager-debug-mode/)
- [GA4 DebugView Guide (analyticsmania.com)](https://www.analyticsmania.com/post/debugview-in-google-analytics-4/)
- [GA4 DebugView Setup and Troubleshooting (digitalmicroenterprise.com)](https://digitalmicroenterprise.com/google-analytics-4-debugview)
- [GA4 User ID Configuration 2026 (analyticsmania.com)](https://www.analyticsmania.com/post/google-analytics-4-user-id/)
