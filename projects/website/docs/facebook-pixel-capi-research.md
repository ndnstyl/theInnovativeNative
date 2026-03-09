# Facebook Pixel & Conversions API (CAPI) — Research Document

**Site:** theinnovativenative.com (AI systems consulting, courses, community)
**Framework:** Next.js 13.4.19, Pages Router, hosted on Hostinger
**Date:** 2026-03-09

---

## Table of Contents

1. [What Is Facebook Pixel?](#1-what-is-facebook-pixel)
2. [What Is Conversions API (CAPI)?](#2-what-is-conversions-api-capi)
3. [Why You Need Both](#3-why-you-need-both)
4. [Prerequisites Checklist](#4-prerequisites-checklist)
5. [All Standard Events](#5-all-standard-events)
6. [Custom Events](#6-custom-events)
7. [CAPI Implementation Details](#7-capi-implementation-details)
8. [Next.js 13 Implementation](#8-nextjs-13-implementation-pages-router)
9. [Events to Track for This Business](#9-events-to-track-for-this-business)
10. [Testing and Debugging](#10-testing-and-debugging)
11. [Privacy and Consent](#11-privacy-and-consent)
12. [Sources](#12-sources)

---

## 1. What Is Facebook Pixel?

The Meta Pixel (formerly Facebook Pixel) is a **client-side JavaScript snippet** that loads in the visitor's browser and tracks activity on your website. It fires whenever a visitor performs a tracked action (called an "event").

### How It Works

1. A small JavaScript library (`fbevents.js`) loads on every page via a base code snippet.
2. The library initializes with your unique Pixel ID: `fbq('init', 'YOUR_PIXEL_ID')`.
3. Events fire via `fbq('track', 'EventName', {parameters})`.
4. Data is sent from the **visitor's browser** directly to Meta's servers.

### What Data the Pixel Collects Automatically

| Category | Data Collected |
|----------|---------------|
| HTTP Headers | IP address, browser info (User-Agent), page URL, referrer |
| Pixel-Specific | Pixel ID, Facebook Cookie (`_fbp`), Click ID (`_fbc`) |
| Button Clicks | Button labels, resulting page URLs |
| Form Field Names | Field names only (e.g., "email", "phone") — NOT values unless Advanced Matching is enabled |
| Optional Values | Custom data you send: conversion value, content IDs, currency |

### Base Pixel Code

```html
<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1"/>
</noscript>
<!-- End Meta Pixel Code -->
```

### What Pixel Enables

- **Conversion tracking** — measure ad effectiveness
- **Custom Audiences** — retarget visitors based on behavior
- **Lookalike Audiences** — find similar users to your converters
- **Advantage+ catalog ads** — dynamic product ads
- **Ad optimization** — Meta's algorithm optimizes delivery toward conversions

---

## 2. What Is Conversions API (CAPI)?

The Conversions API is a **server-side** tracking mechanism that sends event data directly from **your server** to Meta's servers, bypassing the visitor's browser entirely.

### How It Works

1. A conversion event occurs (form submit, purchase, etc.).
2. Your server constructs a payload with event data + hashed user information.
3. Your server sends an HTTP POST request to Meta's Graph API endpoint.
4. Meta processes the event identically to a Pixel event.

### API Endpoint

```
POST https://graph.facebook.com/{API_VERSION}/{PIXEL_ID}/events?access_token={ACCESS_TOKEN}
```

Current recommended API version: **v25.0**

### Key Differences from Pixel

| Aspect | Pixel (Client-Side) | CAPI (Server-Side) |
|--------|---------------------|---------------------|
| Where it runs | Visitor's browser | Your server |
| Blocked by ad blockers | Yes | No |
| Affected by iOS 14+ restrictions | Yes | No |
| Affected by cookie blocking | Yes | No |
| Affected by browser privacy features | Yes | No |
| Requires user_data hashing | No (Meta handles it) | Yes (you hash before sending) |
| Data quality | Degrading over time | Consistent |
| Setup complexity | Low (paste snippet) | Medium (API integration) |

---

## 3. Why You Need Both

Running Pixel + CAPI together in a **redundant setup** is Meta's official recommendation. Here's why:

1. **iOS 14.5+ App Tracking Transparency (ATT)** — Since April 2021, iOS users can opt out of cross-app tracking. ~75-85% of iOS users opt out. Pixel alone misses these conversions; CAPI catches them server-side.

2. **Browser ad blockers** — ~30-40% of desktop users run ad blockers that block `fbevents.js`. CAPI bypasses this entirely.

3. **Third-party cookie deprecation** — Browsers are phasing out third-party cookies. CAPI sends first-party data directly.

4. **ITP (Intelligent Tracking Prevention)** — Safari limits cookie lifetimes to 7 days (or 24 hours for some). CAPI is unaffected.

5. **Data quality** — CAPI allows sending richer, more reliable user data (hashed email, phone) that the Pixel may not capture.

6. **Event Match Quality** — Using both sources together with proper deduplication significantly improves your EMQ score, leading to 20-40% higher conversion accuracy.

**The combined approach:** Pixel catches fast client-side events (scroll, click). CAPI provides reliable server-confirmed events (form submit, purchase). Deduplication ensures no double-counting.

---

## 4. Prerequisites Checklist

Complete ALL of these BEFORE writing any code.

### 4.1 Facebook Business Manager Account

- [ ] **Create or access Business Manager** at [business.facebook.com](https://business.facebook.com)
- [ ] Ensure you have **Admin access** (not Analyst or Advertiser — you need Admin to generate tokens and configure pixels)
- [ ] Business Manager must be verified (may require business documentation)

### 4.2 Facebook Page

- [ ] Have a **Facebook Page** associated with the business (theinnovativenative.com)
- [ ] Page must be claimed/owned within your Business Manager
- [ ] Page should be published (not in draft)

### 4.3 Facebook Ad Account

- [ ] **Ad Account** created or assigned within Business Manager
- [ ] Payment method added to the Ad Account (required even for tracking-only setup)
- [ ] Ad Account ID noted (format: `act_XXXXXXXXXX`)

### 4.4 Meta Pixel Creation

- [ ] Navigate to **Events Manager** in Business Manager
- [ ] Click **Connect Data Sources** > **Web** > **Meta Pixel**
- [ ] Name the pixel (e.g., "The Innovative Native - Website")
- [ ] **Record the Pixel ID** (numeric string, e.g., `1234567890123456`)
- [ ] Store as environment variable: `NEXT_PUBLIC_FACEBOOK_PIXEL_ID`

### 4.5 Domain Verification

Domain verification proves you own theinnovativenative.com. This is REQUIRED for Conversions API and event configuration.

- [ ] Go to **Business Manager** > **Settings** > **Brand Safety** > **Domains**
- [ ] Add `theinnovativenative.com`
- [ ] **Verify using one of three methods:**

**Method 1: DNS TXT Record (Recommended)**
- Log into your domain registrar (Hostinger)
- Add a TXT record to DNS settings
- Value provided by Meta (e.g., `facebook-domain-verification=abcxyz123`)
- Some registrars require `@` in the host field
- Propagation takes 24-72 hours

**Method 2: HTML Meta Tag**
- Add `<meta name="facebook-domain-verification" content="abcxyz123" />` to `<head>`
- In Next.js, add this in `_document.tsx` or via the `Head` component

**Method 3: HTML File Upload**
- Upload a verification file to the root of your website
- File must be accessible at `https://theinnovativenative.com/filename.html`

- [ ] Click **Verify** in Business Manager after DNS propagation
- [ ] Note: After verification, you can remove the meta tag/DNS record — it won't affect status

### 4.6 CAPI Access Token Generation

- [ ] In **Events Manager**, select your Pixel
- [ ] Go to the **Settings** tab
- [ ] Scroll to **Conversions API** section
- [ ] Click **Generate access token** under "Set up manually"
- [ ] **Copy and securely store the token** — it will not be shown again
- [ ] Store as environment variable: `FB_ACCESS_TOKEN` (server-side only, NEVER expose to client)
- [ ] Note: This auto-creates a Conversions API system user — no App Review required

**Alternative method (own app):**
1. Go to Business Manager > Settings
2. Create a System User
3. Assign the Pixel to the System User
4. Generate a token with `ads_management` and `business_management` permissions

### 4.7 Aggregated Event Measurement (AEM)

**UPDATE (Mid-2025):** Meta has **removed the 8-event limit** and eliminated manual event prioritization. AEM now automatically aggregates all eligible events behind the scenes without manual intervention. The "Aggregated Event Measurement" tab has been removed from Events Manager.

- [x] ~~Configure 8 prioritized events per domain~~ — **No longer required**
- [x] ~~Rank events by priority~~ — **No longer required**
- [x] ~~Wait for 72-hour cool-down after changes~~ — **No longer required**

Previous limitations (for historical context):
- Was limited to 8 conversion events per domain
- Only reported the highest-ranked event from opted-out iOS users
- Changing events triggered a 72-hour cool-down period

**Current status:** Track as many standard and custom events as needed. No manual AEM configuration required.

### 4.8 Environment Variables Summary

```env
# .env.local (NEVER commit this file)

# Client-side (NEXT_PUBLIC_ prefix makes it available in browser)
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=your_pixel_id_here

# Server-side only (no NEXT_PUBLIC_ prefix — never exposed to browser)
FB_ACCESS_TOKEN=your_access_token_here

# Optional: for development/testing
FB_TEST_EVENT_CODE=TEST12345
```

### 4.9 Pre-Code Checklist Summary

| Step | Status | Notes |
|------|--------|-------|
| Business Manager Admin access | [ ] | business.facebook.com |
| Facebook Page claimed | [ ] | Must be in Business Manager |
| Ad Account created | [ ] | Payment method required |
| Meta Pixel created | [ ] | Record Pixel ID |
| Domain verified | [ ] | DNS TXT recommended; 24-72hr propagation |
| CAPI access token generated | [ ] | Store securely; never expose to client |
| Privacy policy updated | [ ] | Must disclose tracking and data sharing |
| Consent mechanism planned | [ ] | Required for GDPR/CCPA compliance |
| Environment variables set | [ ] | .env.local — Pixel ID + Access Token |

---

## 5. All Standard Events

Meta supports **17 standard events** (plus PageView). Standard events use `fbq('track', 'EventName')` syntax and are recognized by Meta's optimization algorithms.

### Complete Standard Events Reference

| # | Event Name | Description | Required Params | Optional Params |
|---|-----------|-------------|-----------------|-----------------|
| 1 | **PageView** | Page load (auto-fired by base code) | None | None |
| 2 | **ViewContent** | Visit to a page you care about (product, article, course) | `contents` or `content_ids` (for Advantage+ ads) | `content_category`, `content_type`, `currency`, `value` |
| 3 | **Search** | A search is performed | None | `content_ids`, `content_type`, `contents`, `currency`, `search_string`, `value` |
| 4 | **AddToCart** | Product added to shopping cart | `contents` (for Advantage+ ads) | `content_ids`, `content_type`, `currency`, `value` |
| 5 | **AddToWishlist** | Product added to a wishlist | None | `content_ids`, `contents`, `currency`, `value` |
| 6 | **InitiateCheckout** | Person enters checkout flow | None | `content_ids`, `contents`, `currency`, `num_items`, `value` |
| 7 | **AddPaymentInfo** | Payment info added during checkout | None | `content_ids`, `contents`, `currency`, `value` |
| 8 | **Purchase** | Purchase completed or checkout finished | **`currency`**, **`value`** | `content_ids`, `content_type`, `contents`, `num_items` |
| 9 | **Lead** | Sign-up or lead form completed | None | `currency`, `value` |
| 10 | **CompleteRegistration** | Registration form completed | None | `currency`, `value`, `status` |
| 11 | **Contact** | Contact initiated (phone, SMS, email, chat) | None | None |
| 12 | **CustomizeProduct** | Person customizes a product | None | None |
| 13 | **Donate** | Person donates funds | None | None |
| 14 | **FindLocation** | Person searches for a store location | None | None |
| 15 | **Schedule** | Person books an appointment | None | None |
| 16 | **StartTrial** | Person starts a free trial | None | `currency`, `predicted_ltv`, `value` |
| 17 | **SubmitApplication** | Person applies for a product/service | None | None |
| 18 | **Subscribe** | Person starts a paid subscription | None | `currency`, `predicted_ltv`, `value` |

### Parameter Definitions

| Parameter | Type | Description |
|-----------|------|-------------|
| `content_ids` | Array of strings | Product IDs / SKUs (e.g., `['SKU-001', 'SKU-002']`) |
| `contents` | Array of objects | Objects with required `id` and `quantity` fields (e.g., `[{id: 'SKU-001', quantity: 1}]`) |
| `content_type` | String | Either `"product"` or `"product_group"` |
| `content_name` | String | Name of the page or product |
| `content_category` | String | Category of the page or product |
| `currency` | String | ISO 4217 currency code (e.g., `"USD"`) |
| `value` | Number | Monetary value of the event (e.g., `29.99`) |
| `num_items` | Integer | Number of items in cart/checkout |
| `search_string` | String | User's search query |
| `status` | String | Registration status (e.g., `"complete"`) |
| `predicted_ltv` | Number | Predicted lifetime value of a subscriber |

### Tracking Syntax

```javascript
// Standard event with no parameters
fbq('track', 'Contact');

// Standard event with parameters
fbq('track', 'Purchase', {
  currency: 'USD',
  value: 2500.00,
  content_ids: ['pilot-access'],
  content_type: 'product',
  num_items: 1
});

// Standard event with event ID (for deduplication with CAPI)
fbq('track', 'Lead', { value: 0, currency: 'USD' }, { eventID: 'lead-abc123' });
```

**Important:** `Purchase` is the ONLY standard event that REQUIRES parameters (`currency` and `value`). All other events have optional parameters only.

---

## 6. Custom Events

Custom events track actions that don't map to any standard event. They use `fbq('trackCustom')` instead of `fbq('track')`.

### Syntax

```javascript
fbq('trackCustom', 'EventName', { optional_params });
```

### Naming Conventions

- **Max 50 characters** for event names
- **Case sensitive** — `BookDemo` and `bookdemo` are different events
- Use **PascalCase** for consistency with standard events (e.g., `BookDemo`, `WatchVideo`, `DownloadResource`)
- Names must be **strings**
- Avoid names that match standard events (use standard events when they fit)

### Examples for This Business

```javascript
// Calendly popup opened
fbq('trackCustom', 'CalendlyOpened');

// Blog article read to completion
fbq('trackCustom', 'ArticleCompleted', {
  content_name: 'How AI Automation Saves 20 Hours/Week',
  content_category: 'blog'
});

// Video watched to 75%
fbq('trackCustom', 'VideoWatched', {
  content_name: 'AI Systems Demo',
  video_percent: 75
});

// Resource downloaded
fbq('trackCustom', 'ResourceDownloaded', {
  content_name: 'n8n Workflow Template Pack',
  content_category: 'download'
});
```

### Custom Events vs Standard Events

| Use Standard Events When... | Use Custom Events When... |
|----------------------------|--------------------------|
| The action maps to a predefined event | No standard event fits your action |
| You want Meta to optimize ad delivery for that action | You need granular tracking beyond standard events |
| You want to create standard Custom Conversions | You're tracking micro-conversions or engagement |

**Preference:** Always use standard events when possible. Meta's algorithms understand them natively and can optimize for them. Custom events require creating Custom Conversions in Events Manager before they can be used for optimization.

---

## 7. CAPI Implementation Details

### 7.1 API Request Format

```
POST https://graph.facebook.com/v25.0/{PIXEL_ID}/events
```

**Request body:**

```json
{
  "data": [
    {
      "event_name": "Purchase",
      "event_time": 1762902353,
      "event_id": "event.purchase.abc123",
      "event_source_url": "https://theinnovativenative.com/checkout/success",
      "action_source": "website",
      "user_data": {
        "client_ip_address": "203.0.113.1",
        "client_user_agent": "Mozilla/5.0...",
        "em": ["309a0a5c3e86e8b1b601a670914a6a97c16c79b5f1e01819e1d1a8b0e8a6b5c3"],
        "ph": ["254aa248acb47dd654ca3ea53f48c2c26d641d23d7e2e93a1ec56258df7674c4"],
        "fbc": "fb.1.1612876261.IwAR1...",
        "fbp": "fb.1.1612876261.987654321",
        "external_id": ["customer-789"],
        "fn": ["a8cfcd74832004951b4408cdb0a5dbcd8c7e52d43f7fe244bf720582e05241da"],
        "ln": ["2c6ee24b09816a6cb7f5f82e3da0e2d20d2d7e7e0c6cce8b1eef0b73a5c7c35e"],
        "ct": ["5b2b5e0e7c3e2b7c2a4e8f3d1b5c6a9d8e7f4b3a2c1d0e9f8a7b6c5d4e3f2a1"],
        "st": ["ca"],
        "zp": ["a3f5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4"],
        "country": ["us"]
      },
      "custom_data": {
        "currency": "USD",
        "value": 2500.00,
        "content_ids": ["pilot-access"],
        "content_type": "product",
        "contents": [
          {
            "id": "pilot-access",
            "quantity": 1
          }
        ]
      }
    }
  ],
  "test_event_code": "TEST12345"
}
```

### 7.2 Required Parameters for Web Events

| Parameter | Required? | Description |
|-----------|-----------|-------------|
| `event_name` | **Yes** | Standard or custom event name |
| `event_time` | **Yes** | Unix timestamp (seconds). Can be up to 7 days in the past. |
| `action_source` | **Yes** | Where the event occurred. For web: `"website"` |
| `event_source_url` | **Yes** (for web) | Full URL where event happened |
| `client_user_agent` | **Yes** (for web) | Browser User-Agent string |
| `user_data` | **Yes** | At least one identifier (email, phone, fbp, fbc, etc.) |

### 7.3 action_source Values

| Value | Use When |
|-------|----------|
| `website` | Event from your website (most common) |
| `app` | Event from a mobile app |
| `phone_call` | Phone call conversion |
| `email` | Email-triggered conversion |
| `chat` | Chat-based conversion |
| `physical_store` | In-store event (up to 62 days old) |
| `system_generated` | CRM or backend automated event |
| `other` | None of the above |

### 7.4 User Data — Hashing Requirements

**CRITICAL:** All personally identifiable information (PII) MUST be hashed using **SHA-256** before sending. Hash the **lowercase, trimmed** value.

**Fields that MUST be SHA-256 hashed:**

| Field | Key | Input Format Before Hashing |
|-------|-----|-----------------------------|
| Email | `em` | Lowercase, trim whitespace: `john@example.com` |
| Phone | `ph` | Digits only, include country code: `12025551234` |
| First name | `fn` | Lowercase: `john` |
| Last name | `ln` | Lowercase: `doe` |
| Gender | `ge` | Single letter: `m` or `f` |
| Date of birth | `db` | Format: `YYYYMMDD` (e.g., `19900115`) |
| City | `ct` | Lowercase, no spaces: `newyork` |
| State | `st` | 2-letter code, lowercase: `ca` |
| Zip code | `zp` | First 5 digits for US: `94025` |
| Country | `country` | 2-letter ISO code, lowercase: `us` |
| External ID | `external_id` | Hashing recommended but not required |

**Fields sent in PLAINTEXT (not hashed):**

| Field | Key | Description |
|-------|-----|-------------|
| Client IP | `client_ip_address` | User's IP address |
| User Agent | `client_user_agent` | Browser UA string |
| Click ID | `fbc` | Facebook click ID cookie (`_fbc`) |
| Browser ID | `fbp` | Facebook browser ID cookie (`_fbp`) |
| Subscription ID | `subscription_id` | Subscription identifier |
| FB Login ID | `fb_login_id` | Facebook login ID |
| Lead ID | `lead_id` | CRM lead identifier |

### 7.5 SHA-256 Hashing Example (Node.js)

```typescript
import crypto from 'crypto';

function hashUserData(value: string): string {
  return crypto
    .createHash('sha256')
    .update(value.toLowerCase().trim())
    .digest('hex');
}

// Usage
const hashedEmail = hashUserData('John@Example.com');
// Result: SHA-256 of "john@example.com"
```

### 7.6 Event Deduplication

When running Pixel + CAPI together, you MUST deduplicate events to prevent double-counting.

**How it works:**
- Pixel sends: `fbq('track', 'Lead', {}, { eventID: 'lead-abc123' })`
- CAPI sends: `{ "event_name": "Lead", "event_id": "lead-abc123" }`
- Meta matches on `event_name` + `event_id` and keeps only one

**Deduplication rules:**
- Both `event_name` AND `event_id` must match exactly
- **48-hour deduplication window** — if the second event arrives more than 48 hours after the first, it won't be deduplicated
- If events match, Meta keeps whichever was received first
- Generate a **UUID** for each event and pass it to both Pixel and CAPI

**Implementation pattern:**

```typescript
import { v4 as uuidv4 } from 'uuid';

// Generate shared event ID
const eventId = uuidv4();

// Client-side (Pixel)
fbq('track', 'Lead', { value: 0, currency: 'USD' }, { eventID: eventId });

// Server-side (CAPI) — send to your API route
fetch('/api/fb-events', {
  method: 'POST',
  body: JSON.stringify({
    eventName: 'Lead',
    eventId: eventId,
    sourceUrl: window.location.href,
    // ... user data
  })
});
```

**Alternative deduplication (fallback):**
- Match on `event_name` + `fbp` and/or `external_id`
- Less reliable — only works for browser-then-server sequence
- Recommended to always use `event_id` matching

### 7.7 Event Match Quality (EMQ) Score

EMQ is a score from **0 to 10** that measures how well Meta can match your event data to a real user profile.

**Target: 8.0 or higher** (minimum acceptable: 6.0)

**How to maximize EMQ:**

| Priority | Action | Impact |
|----------|--------|--------|
| 1 | Send hashed **email** (`em`) | Highest match signal |
| 2 | Send hashed **phone** (`ph`) | High match signal |
| 3 | Send **client_ip_address** | Medium match signal |
| 4 | Send **client_user_agent** | Medium match signal |
| 5 | Send **fbp** cookie | Medium match signal (first-party) |
| 6 | Send **fbc** cookie | High signal when present (from ad click) |
| 7 | Send **external_id** | Supports cross-device matching |
| 8 | Send **fn**, **ln**, **ct**, **st**, **zp**, **country** | Incremental improvement |
| 9 | Proper deduplication | Prevents inflated/confused metrics |
| 10 | Consistent event_time accuracy | Within seconds of actual event |

**EMQ is calculated on a rolling 48-hour window of event data.**

**Minimum viable user_data for good EMQ:**
```json
{
  "em": ["hashed_email"],
  "client_ip_address": "xxx.xxx.xxx.xxx",
  "client_user_agent": "Mozilla/5.0...",
  "fbp": "fb.1.xxxxx.xxxxx",
  "fbc": "fb.1.xxxxx.xxxxx"
}
```

### 7.8 Batch Events

- Send up to **1,000 events** per API request in the `data` array
- If ANY event in a batch is invalid, **the entire batch is rejected**
- Events can be up to **7 days old** (except `physical_store` which allows 62 days)
- Recommendation: batch events in groups of 50-100 for reliability

---

## 8. Next.js 13 Implementation (Pages Router)

The site uses Next.js 13.4.19 with the **Pages Router**. This section covers the exact implementation pattern.

### 8.1 Environment Variables

```env
# .env.local
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=your_pixel_id
FB_ACCESS_TOKEN=your_capi_access_token
FB_TEST_EVENT_CODE=TEST12345
```

### 8.2 Pixel Utility Library — `src/lib/fbpixel.ts`

```typescript
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

// Declare fbq on window
declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    _fbq: (...args: any[]) => void;
  }
}

/**
 * Track a PageView event
 */
export function pageview(): void {
  window.fbq('track', 'PageView');
}

/**
 * Track a standard or custom event
 */
export function event(
  name: string,
  options: Record<string, any> = {},
  eventId?: string
): void {
  if (eventId) {
    window.fbq('track', name, options, { eventID: eventId });
  } else {
    window.fbq('track', name, options);
  }
}

/**
 * Track a custom event
 */
export function customEvent(
  name: string,
  options: Record<string, any> = {}
): void {
  window.fbq('trackCustom', name, options);
}
```

### 8.3 Pixel Loading in `_app.tsx`

The Pixel base code should load in `_app.tsx` using Next.js `Script` component. Route change tracking uses `router.events`.

```typescript
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';
import * as fbq from '@/lib/fbpixel';

// In the App component:
export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // Track initial page view
    fbq.pageview();

    // Track route changes (SPA navigation)
    const handleRouteChange = () => {
      fbq.pageview();
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      {/* Meta Pixel Base Code */}
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${fbq.FB_PIXEL_ID}');
          `,
        }}
      />
      {/* noscript fallback */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${fbq.FB_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>

      {/* ... rest of app */}
      <Component {...pageProps} />
    </>
  );
}
```

**Why `afterInteractive` and NOT `beforeInteractive`:**
- `beforeInteractive` loads in `_document` and blocks rendering
- `afterInteractive` loads after hydration — better for performance
- Pixel doesn't need to block page load — events queue automatically via `fbq.queue`

**Why `_app.tsx` and NOT `_document.tsx`:**
- `_app.tsx` has access to `useRouter` for SPA navigation tracking
- `_document.tsx` only renders on the server — cannot track client-side route changes
- The `Script` component in `_app.tsx` handles injection properly

### 8.4 CAPI Server-Side API Route — `src/pages/api/fb-events.ts`

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

const PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
const ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;
const TEST_EVENT_CODE = process.env.FB_TEST_EVENT_CODE;
const API_VERSION = 'v25.0';

function hashSHA256(value: string): string {
  return crypto
    .createHash('sha256')
    .update(value.toLowerCase().trim())
    .digest('hex');
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    eventName,
    eventId,
    sourceUrl,
    userData = {},
    customData = {},
  } = req.body;

  // Build user_data with hashing
  const user_data: Record<string, any> = {};

  // Plaintext fields (from request headers and cookies)
  user_data.client_ip_address =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
    req.socket.remoteAddress;
  user_data.client_user_agent = req.headers['user-agent'];

  // First-party cookies (forwarded from client)
  if (userData.fbc) user_data.fbc = userData.fbc;
  if (userData.fbp) user_data.fbp = userData.fbp;

  // Hashed PII fields
  if (userData.email) user_data.em = [hashSHA256(userData.email)];
  if (userData.phone) user_data.ph = [hashSHA256(userData.phone)];
  if (userData.firstName) user_data.fn = [hashSHA256(userData.firstName)];
  if (userData.lastName) user_data.ln = [hashSHA256(userData.lastName)];
  if (userData.city) user_data.ct = [hashSHA256(userData.city)];
  if (userData.state) user_data.st = [hashSHA256(userData.state)];
  if (userData.zip) user_data.zp = [hashSHA256(userData.zip)];
  if (userData.country) user_data.country = [hashSHA256(userData.country)];
  if (userData.externalId) user_data.external_id = [hashSHA256(userData.externalId)];

  const eventPayload: Record<string, any> = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_source_url: sourceUrl,
    action_source: 'website',
    user_data,
  };

  if (eventId) eventPayload.event_id = eventId;
  if (Object.keys(customData).length > 0) eventPayload.custom_data = customData;

  const body: Record<string, any> = {
    data: [eventPayload],
  };

  if (TEST_EVENT_CODE) {
    body.test_event_code = TEST_EVENT_CODE;
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('CAPI Error:', result);
      return res.status(response.status).json({ error: result });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('CAPI request failed:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

### 8.5 Client-Side Helper for CAPI Calls — `src/lib/fbcapi.ts`

```typescript
import { v4 as uuidv4 } from 'uuid';

/**
 * Get Facebook cookies (_fbp and _fbc) from browser
 */
function getFBCookies(): { fbp?: string; fbc?: string } {
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  return {
    fbp: cookies['_fbp'] || undefined,
    fbc: cookies['_fbc'] || undefined,
  };
}

interface TrackEventOptions {
  eventName: string;
  userData?: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    externalId?: string;
  };
  customData?: Record<string, any>;
  enablePixel?: boolean; // default true
}

/**
 * Track event via both Pixel and CAPI with automatic deduplication.
 * Generates a shared eventId and sends to both channels.
 */
export async function trackEvent({
  eventName,
  userData = {},
  customData = {},
  enablePixel = true,
}: TrackEventOptions): Promise<void> {
  const eventId = uuidv4();
  const { fbp, fbc } = getFBCookies();

  // 1. Fire Pixel event (client-side)
  if (enablePixel && typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, customData, { eventID: eventId });
  }

  // 2. Send CAPI event (server-side via API route)
  try {
    await fetch('/api/fb-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName,
        eventId,
        sourceUrl: window.location.href,
        userData: { ...userData, fbp, fbc },
        customData,
      }),
    });
  } catch (error) {
    console.error('CAPI tracking failed:', error);
  }
}
```

### 8.6 Usage Examples in Components

```typescript
import { trackEvent } from '@/lib/fbcapi';

// On a course page
useEffect(() => {
  trackEvent({
    eventName: 'ViewContent',
    customData: {
      content_name: 'AI Automation Masterclass',
      content_category: 'course',
      content_ids: ['course-ai-automation'],
      content_type: 'product',
      value: 497,
      currency: 'USD',
    },
  });
}, []);

// On form submission (with user data for higher EMQ)
async function handleLeadSubmit(formData: FormData) {
  await trackEvent({
    eventName: 'Lead',
    userData: {
      email: formData.get('email') as string,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
    },
    customData: {
      value: 0,
      currency: 'USD',
    },
  });
}

// On Stripe checkout success
async function handlePurchaseComplete(session: any) {
  await trackEvent({
    eventName: 'Purchase',
    userData: {
      email: session.customer_email,
    },
    customData: {
      value: session.amount_total / 100,
      currency: 'USD',
      content_ids: [session.metadata.product_id],
      content_type: 'product',
      num_items: 1,
    },
  });
}
```

### 8.7 Package Alternative

Instead of building from scratch, the **`@rivercode/facebook-conversion-api-nextjs`** npm package provides a drop-in solution:

```bash
npm install @rivercode/facebook-conversion-api-nextjs
```

**API route (`pages/api/fb-events.js`):**
```javascript
import { fbEventsHandler } from '@rivercode/facebook-conversion-api-nextjs/handlers';
export default fbEventsHandler;
```

**Client-side:**
```javascript
import { fbEvent } from '@rivercode/facebook-conversion-api-nextjs';

fbEvent({
  eventName: 'Purchase',
  eventId: 'unique-id',
  emails: ['user@example.com'],
  value: 2500,
  currency: 'USD',
  enableStandardPixel: true, // also fires Pixel event
});
```

**Pros:** Handles deduplication automatically, simpler setup.
**Cons:** Less control, potential breaking changes, additional dependency.

---

## 9. Events to Track for This Business

theinnovativenative.com is an AI systems consulting business with courses, community membership, and consulting services.

### 9.1 Event Map

| Event | Trigger | Type | Parameters |
|-------|---------|------|------------|
| **PageView** | Every page load + SPA navigation | Standard | Auto-tracked |
| **ViewContent** | Course page, product page, case study, pricing page | Standard | `content_name`, `content_category`, `content_ids`, `value`, `currency` |
| **Lead** | Calendly booking confirmation, contact form submission | Standard | `value: 0`, `currency: 'USD'` |
| **CompleteRegistration** | Community signup, account creation | Standard | `value: 0`, `currency: 'USD'`, `status: 'complete'` |
| **Subscribe** | Paid community membership start | Standard | `value`, `currency`, `predicted_ltv` |
| **Purchase** | Course purchase (Stripe success), pilot purchase ($2,500) | Standard | `value`, `currency`, `content_ids`, `content_type`, `num_items` |
| **InitiateCheckout** | Stripe checkout session created | Standard | `value`, `currency`, `content_ids`, `num_items` |
| **Search** | Community/blog search | Standard | `search_string` |
| **StartTrial** | Free trial signup (if applicable) | Standard | `value: 0`, `currency: 'USD'` |
| **Contact** | Email link click, phone click, chat initiation | Standard | None |
| **Schedule** | Calendly appointment booked | Standard | None |

### 9.2 Custom Events to Consider

| Event | Trigger | Parameters |
|-------|---------|------------|
| `CalendlyOpened` | Calendly widget opened | None |
| `CalendlyScheduled` | Calendly booking completed (if webhook available) | `meeting_type` |
| `VideoWatched` | Demo/explainer video reaches 50%/75%/100% | `content_name`, `video_percent` |
| `CaseStudyViewed` | Case study page scroll depth >75% | `content_name` |
| `PricingViewed` | Pricing section scrolled into view | `content_category: 'pricing'` |
| `CTAClicked` | Primary CTA button clicked | `cta_text`, `page` |

### 9.3 Event Priority (for ad optimization)

When creating campaigns, optimize for events in this priority order:

1. **Purchase** — highest value signal (actual revenue)
2. **InitiateCheckout** — strong intent signal
3. **Lead** — Calendly booking = high-quality lead
4. **Schedule** — appointment booked
5. **CompleteRegistration** — community/account signup
6. **Subscribe** — recurring revenue signal
7. **ViewContent** — interest signal (course/product pages)
8. **PageView** — broadest signal (awareness campaigns only)

---

## 10. Testing and Debugging

### 10.1 Facebook Pixel Helper (Chrome Extension)

- **Install:** [Chrome Web Store — Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
- **Usage:** Visit your site, click the extension icon
- **Shows:**
  - Whether the Pixel is detected
  - Which events fired
  - Event parameters sent
  - Errors or warnings
- **Limitation:** Only shows client-side (Pixel) events, NOT CAPI events

### 10.2 Test Events Tool (Events Manager)

- Navigate to **Events Manager** > Select your Pixel > **Test Events** tab
- **Test Browser Events:**
  1. Enter your website URL in the "Test Browser Events" field
  2. Click "Open Website" — a new tab opens with test mode active
  3. Perform actions on your site (navigate, submit forms, purchase)
  4. Events appear in real-time in the Test Events view
  5. Shows both Pixel AND CAPI events with source labels
- **What to verify:**
  - Events fire on the correct actions
  - Parameters are correct (value, currency, content_ids)
  - Both Pixel and CAPI sources appear for deduplicated events
  - No duplicate events (deduplication is working)

### 10.3 CAPI Test Events

For server-side testing, include `test_event_code` in your CAPI payload:

```json
{
  "data": [{ ... }],
  "test_event_code": "TEST12345"
}
```

- Get your test event code from **Events Manager** > **Test Events** tab > **Test Server Events**
- Events sent with `test_event_code`:
  - Appear in the Test Events view
  - Are processed for measurement
  - Do NOT affect production reporting or ad delivery
- **Remove `test_event_code` before going to production**

### 10.4 Event Match Quality Check

- Navigate to **Events Manager** > Select your Pixel > **Overview** tab
- Each event shows its EMQ score (0-10)
- Click on an event to see which parameters are being received and matched
- Low scores indicate missing user_data fields — add more hashed parameters

### 10.5 Diagnostics Tab

- **Events Manager** > **Diagnostics** tab
- Shows errors, warnings, and recommendations:
  - Missing parameters
  - Invalid hashing
  - Deduplication issues
  - Rate limit warnings
  - API version deprecation notices

### 10.6 Testing Checklist

| Test | Expected Result | Tool |
|------|-----------------|------|
| Load homepage | `PageView` fires | Pixel Helper |
| Navigate to course page (SPA) | `PageView` + `ViewContent` fire | Pixel Helper |
| Submit contact form | `Lead` fires (Pixel + CAPI) | Events Manager |
| Click Calendly button | `CalendlyOpened` custom event fires | Pixel Helper |
| Complete Stripe checkout | `Purchase` fires with correct value | Events Manager |
| Same event shows both sources | Pixel + Server event, deduplicated | Events Manager |
| EMQ score for Purchase | Score >= 6.0 (target 8.0+) | Events Manager |
| Test with ad blocker enabled | CAPI events still arrive | Events Manager |
| Test on iOS Safari | CAPI events arrive despite ITP | Events Manager |

---

## 11. Privacy and Consent

### 11.1 GDPR Requirements (EU Visitors)

- **Consent required BEFORE loading Meta Pixel** — opt-in, not opt-out
- Consent must be: freely given, specific, informed, unambiguous, via explicit action
- "Legitimate interest" does NOT justify marketing pixels — explicit opt-in required
- **Implementation:** Block Pixel by default; load only after user opts in via a Consent Management Platform (CMP)
- Recommended CMPs: CookieYes, OneTrust, TrustArc, Cookiebot

**Consent-gated Pixel loading pattern:**
```typescript
// Only init Pixel after consent is granted
if (hasMarketingConsent()) {
  fbq('init', PIXEL_ID);
  fbq('track', 'PageView');
}
```

### 11.2 CCPA/CPRA Requirements (California Visitors)

- Users must have the right to **opt out** (not opt in)
- Must display a visible **"Do Not Sell or Share My Personal Information"** link
- Use Meta's **Limited Data Use (LDU)** flag for California users who opt out:

```typescript
// Enable Limited Data Use for California users
fbq('dataProcessingOptions', ['LDU'], 1, 1000);
// 1 = US, 1000 = California

// For CAPI, include in the event payload:
{
  "data_processing_options": ["LDU"],
  "data_processing_options_country": 1,
  "data_processing_options_state": 1000
}
```

- When LDU is active, Meta restricts how the data is used for targeting/optimization but still processes it for measurement

### 11.3 Privacy Policy Requirements

Update theinnovativenative.com's privacy policy to disclose:
- [ ] Use of Meta Pixel for tracking website activity
- [ ] Use of Conversions API for server-side event tracking
- [ ] What data is collected (browsing behavior, hashed PII)
- [ ] That data is shared with Meta for advertising purposes
- [ ] How users can opt out (browser settings, CMP, "Do Not Sell" link)
- [ ] Cookie disclosures (specifically `_fbp` and `_fbc` cookies)

### 11.4 Consent Architecture for This Site

Since theinnovativenative.com serves both US and potential international visitors:

1. **Default:** Load Pixel for US visitors (CCPA opt-out model)
2. **EU visitors:** Block Pixel until explicit opt-in (GDPR model)
3. **California visitors who opt out:** Enable LDU flag
4. **CAPI:** Can still send events with LDU/consent flags even when Pixel is blocked — Meta respects the `data_processing_options` parameter

---

## 12. Sources

### Official Meta Documentation
- [Conversions API Overview](https://developers.facebook.com/docs/marketing-api/conversions-api/)
- [Conversions API — Get Started](https://developers.facebook.com/docs/marketing-api/conversions-api/get-started/)
- [Conversions API — Using the API](https://developers.facebook.com/docs/marketing-api/conversions-api/using-the-api/)
- [Conversions API — Parameters](https://developers.facebook.com/docs/marketing-api/conversions-api/parameters)
- [Conversions API — Deduplication](https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events)
- [Meta Pixel Overview](https://developers.facebook.com/docs/meta-pixel/)
- [Meta Pixel — Standard Events Reference](https://developers.facebook.com/docs/meta-pixel/reference)
- [Meta Pixel — Conversion Tracking](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking/)
- [Meta Pixel Helper](https://developers.facebook.com/docs/meta-pixel/support/pixel-helper)
- [About Event Match Quality](https://www.facebook.com/business/help/765081237991954)
- [Standard Event Specifications](https://www.facebook.com/business/help/402791146561655)
- [Domain Verification](https://en-gb.facebook.com/business/help/321167023127050)

### Implementation Guides
- [Next.js with Facebook Pixel (Official Example)](https://github.com/vercel/next.js/tree/canary/examples/with-facebook-pixel)
- [@rivercode/facebook-conversion-api-nextjs (npm)](https://www.npmjs.com/package/@rivercode/facebook-conversion-api-nextjs)
- [Facebook Conversion API for Next.js (GitHub)](https://github.com/RivercodeAB/facebook-conversion-api-nextjs)
- [Add Facebook Pixel in Next.js (codegenes.net)](https://www.codegenes.net/blog/how-to-add-facebook-pixel-on-next-js-react-app/)
- [Facebook Conversions API Setup Guide (stape.io)](https://stape.io/blog/how-to-set-up-facebook-conversion-api)
- [Complete 2026 CAPI Setup Guide (cometly.com)](https://www.cometly.com/post/facebook-conversion-api-setup)

### Event Match Quality
- [Improve Event Match Quality (easyinsights.ai)](https://easyinsights.ai/blog/how-to-increase-facebook-meta-event-match-quality/)
- [EMQ Score 8+ Guide (gropulse.com)](https://gropulse.com/event-match-quality/)
- [CAPI EMQ Tips (ingestlabs.com)](https://ingestlabs.com/improving-meta-event-match-quality-with-conversions-api-tips/)

### Aggregated Event Measurement
- [Meta AEM Explained (conversios.io)](https://www.conversios.io/blog/meta-aggregated-event-measurement/)
- [AEM Overview (segwise.ai)](https://segwise.ai/blog/facebook-aggregated-event-measurement)

### Privacy and Compliance
- [Meta Consent Mode (secureprivacy.ai)](https://secureprivacy.ai/blog/meta-consent-mode-explained-2025)
- [Meta Pixel GDPR Compliance (gdprlocal.com)](https://gdprlocal.com/meta-pixel-gdpr-compliance/)
- [Facebook and GDPR (usercentrics.com)](https://usercentrics.com/guides/social-media-email-marketing-compliance/facebook-gdpr/)
- [CCPA Facebook LDU (termsfeed.com)](https://www.termsfeed.com/blog/ccpa-facebook-retargeting-ldu/)

### Testing and Debugging
- [Meta Pixel Helper Guide (conversios.io)](https://www.conversios.io/blog/meta-pixel-helper-guide/)
- [Events Manager Debug Guide (conversios.io)](https://www.conversios.io/blog/pixel-firing-no-conversions-fix/)
- [How to Test Meta Pixel Events (adamigo.ai)](https://www.adamigo.ai/blog/how-to-test-meta-pixel-events)
