# Facebook Platform Specifications

## Overview

Meta's flagship platform with 3B+ monthly active users. Best for B2C, local businesses, and broad awareness campaigns. Integrated with Instagram for cross-platform campaigns.

---

## Image Specifications

### Profile & Page Assets

| Asset | Dimensions | Ratio | Max Size | Format |
|-------|-----------|-------|----------|--------|
| Profile Picture | 180 x 180px | 1:1 | 100KB | JPG, PNG |
| Cover Photo | 820 x 312px | 2.63:1 | 100KB | JPG, PNG |
| Cover Photo (Mobile) | 640 x 360px | 16:9 | Safe area |
| Event Cover | 1200 x 628px | 1.91:1 | - |
| Group Cover | 1640 x 856px | 1.91:1 | - |

### Organic Posts

| Asset | Dimensions | Ratio | Notes |
|-------|-----------|-------|-------|
| Square Image | 1080 x 1080px | 1:1 | Best engagement |
| Landscape Image | 1200 x 630px | 1.91:1 | Link previews |
| Portrait Image | 1080 x 1350px | 4:5 | Takes more feed space |
| Stories | 1080 x 1920px | 9:16 | Full screen mobile |

### Facebook Ads

| Ad Type | Dimensions | Ratio | Max Size |
|---------|-----------|-------|----------|
| Feed Image | 1080 x 1080px | 1:1 | 30MB |
| Feed Image (Alt) | 1200 x 628px | 1.91:1 | 30MB |
| Story Ad | 1080 x 1920px | 9:16 | 30MB |
| Carousel Card | 1080 x 1080px | 1:1 | 30MB/card |
| Right Column | 1200 x 1200px | 1:1 | 30MB |
| Marketplace | 1200 x 1200px | 1:1 | 30MB |
| Search Results | 1200 x 628px | 1.91:1 | 30MB |

### Ad Image Guidelines

- **Text Overlay**: Less than 20% text recommended (not enforced but affects delivery)
- **Safe Zone**: Keep important content away from edges (14% on each side)
- **File Types**: JPG or PNG (PNG for text-heavy, JPG for photos)

---

## Character Limits

### Organic Posts

| Element | Limit | Best Practice |
|---------|-------|---------------|
| Post Text | 63,206 chars | 40-80 chars optimal for engagement |
| Link Description | Unlimited | First 100 chars visible |
| Comment | 8,000 chars | Keep concise |

### Facebook Ads

| Element | Limit | Best Practice |
|---------|-------|---------------|
| Primary Text | 125 chars | Before "See More" truncation |
| Headline | 40 chars | 27 chars recommended |
| Description | 30 chars | 27 chars recommended |
| Link URL | Unlimited | Use UTM parameters |

### By Placement

| Placement | Primary Text Visible | Headline |
|-----------|---------------------|----------|
| Feed | 125 chars | 40 chars |
| Stories | 125 chars | 40 chars |
| Right Column | 125 chars | 40 chars |
| Marketplace | 125 chars | 40 chars |
| Search | 125 chars | 40 chars |

---

## Video Specifications

### Feed Video

| Spec | Requirement |
|------|-------------|
| Duration | 1 second - 241 minutes |
| File Size | Up to 4GB |
| Resolution | 1080p minimum (1920x1080) |
| Aspect Ratio | 16:9 (landscape), 1:1 (square), 4:5 (portrait) |
| Frame Rate | 30 fps |
| Format | MP4, MOV (H.264 codec) |
| Audio | AAC, 128kbps+, stereo |

### Story Video

| Spec | Requirement |
|------|-------------|
| Duration | 1-15 seconds (auto-splits longer) |
| Resolution | 1080 x 1920px |
| Aspect Ratio | 9:16 |
| Safe Zone | Keep text/logos 14% from edges |

### Video Ad Specs

| Spec | Requirement |
|------|-------------|
| Duration | 1 second - 241 minutes (15s or less optimal) |
| Thumbnail | Auto-generated or custom (1200x675px) |
| Captions | Required (85% watch without sound) |

---

## Best Practices

### Content Strategy (Hyper-Dopamine Approach)

1. **Pattern Interrupt Images**
   - Unusual, eye-catching visuals
   - Faces with strong emotions
   - Red circles/arrows for highlights
   - Dual images (primary + secondary)

2. **Headlines That Hook**
   - Lead with curiosity
   - Use numbers and specifics
   - Promise a benefit
   - Swipe from news/gossip sites

3. **Copy Rules**
   - Write at 5th grade level (Hemingway App)
   - Short sentences, short paragraphs
   - Lots of line breaks for mobile
   - Sell the click, not the product

### Ad Best Practices

1. **Creative**
   - Don't look like an ad
   - Native, user-generated feel
   - Test multiple variants (4-6)
   - Refresh every 2 weeks

2. **Targeting**
   - Start broad, let algorithm optimize
   - Use Advantage+ audiences
   - Lookalike audiences 1-3%
   - Exclude recent converters

3. **Optimization**
   - Optimize for conversions, not clicks
   - Use Conversions API + Pixel
   - Minimum 50 conversions/week for learning
   - Don't edit ads during learning phase

### Posting Times

| Day | Best Times |
|-----|-----------|
| Monday-Friday | 9am-1pm |
| Wednesday | Highest engagement |
| Weekend | Lower but more leisure browsing |

---

## Audience Targeting Options

### Demographics
- Location (country, region, city, zip)
- Age (13-65+)
- Gender
- Language

### Interests
- Activities
- Entertainment
- Family & relationships
- Fitness & wellness
- Food & drink
- Hobbies
- Shopping
- Sports
- Technology

### Behaviors
- Purchase behavior
- Device usage
- Travel
- Digital activities
- Expats

### Custom Audiences
- Website visitors (Pixel)
- Customer list (email/phone)
- App activity
- Engagement (video views, page engagement)
- Shopping (catalog interaction)

### Lookalike Audiences
- 1% (most similar)
- 1-3% (broader reach)
- 3-10% (scale)

---

## Ad Objectives (Advantage+ Era)

| Objective | Best For | Optimization |
|-----------|----------|--------------|
| Awareness | Brand reach | Impressions, reach |
| Traffic | Website visits | Link clicks, landing page views |
| Engagement | Social proof | Post engagement, page likes |
| Leads | Lead gen forms | On-Facebook leads |
| App Promotion | App installs | Installs, events |
| Sales | E-commerce | Purchases, add to cart |

---

## Conversion Tracking

### Pixel Events (Standard)

| Event | When to Use |
|-------|------------|
| PageView | Every page load |
| ViewContent | Product/content page |
| AddToCart | Cart addition |
| InitiateCheckout | Checkout start |
| AddPaymentInfo | Payment entry |
| Purchase | Transaction complete |
| Lead | Form submission |
| CompleteRegistration | Signup complete |
| Search | Site search |

### Conversions API (CAPI)

- Server-side tracking
- Bypasses ad blockers
- Required for iOS 14.5+ attribution
- Deduplicate with Pixel

---

## Compliance Notes

1. **Special Ad Categories**
   - Credit
   - Employment
   - Housing
   - Social issues/elections/politics
   - (Limited targeting options)

2. **Prohibited Content**
   - Misleading claims
   - Before/after images (health)
   - Personal attributes callouts
   - Sensational content

3. **Restricted Content**
   - Alcohol (age-gated)
   - Dating (approval needed)
   - Gambling (regional)
   - Supplements (disclaimers)
