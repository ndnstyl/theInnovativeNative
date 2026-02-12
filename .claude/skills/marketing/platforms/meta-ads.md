# Meta Ads Platform Specifications

## Overview

Meta's unified ad platform for Facebook, Instagram, Messenger, and Audience Network. 3B+ users across platforms. Best for awareness, engagement, and conversion campaigns with powerful audience targeting.

---

## Campaign Structure

```
Campaign (Objective)
└── Ad Set (Targeting, Budget, Schedule)
    └── Ads (Creative, Copy)
```

---

## Campaign Objectives (Simplified)

| Objective | Goal | Optimization Options |
|-----------|------|---------------------|
| Awareness | Reach & brand recall | Reach, Brand Awareness |
| Traffic | Website/app visits | Link clicks, Landing page views |
| Engagement | Social interactions | Post engagement, Page likes, Event responses |
| Leads | Lead generation | On-Facebook leads, Conversions |
| App Promotion | App installs | Installs, App events |
| Sales | Purchases | Conversions, Catalog sales, Value |

---

## Ad Placements

### Facebook
- Feed
- Stories
- In-stream videos
- Search results
- Marketplace
- Right column
- Reels

### Instagram
- Feed
- Stories
- Explore
- Reels
- Shop

### Messenger
- Inbox
- Stories
- Sponsored messages

### Audience Network
- Native, banner, interstitial
- Rewarded video
- In-stream video

### Placement Recommendations
- Start with Advantage+ Placements (all)
- Optimize over time based on performance
- Create placement-specific creative for best results

---

## Ad Formats & Specifications

### Single Image Ads

| Placement | Dimensions | Ratio | Max Size |
|-----------|-----------|-------|----------|
| Feed | 1080 x 1080px | 1:1 | 30MB |
| Feed (landscape) | 1200 x 628px | 1.91:1 | 30MB |
| Stories | 1080 x 1920px | 9:16 | 30MB |
| Right Column | 1200 x 1200px | 1:1 | 30MB |
| Marketplace | 1200 x 1200px | 1:1 | 30MB |

### Carousel Ads

| Spec | Requirement |
|------|-------------|
| Cards | 2-10 |
| Image size | 1080 x 1080px |
| Ratio | 1:1 |
| Video per card | Up to 240 minutes |
| Link | One per card |

### Video Ads

| Placement | Ratio | Duration | Max Size |
|-----------|-------|----------|----------|
| Feed | 1:1, 4:5, 16:9 | 1s-241m | 4GB |
| Stories | 9:16 | 1s-120s | 4GB |
| Reels | 9:16 | 1s-90s | 4GB |
| In-stream | 16:9, 1:1 | 5s-600s | 4GB |

### Video Specifications

| Spec | Requirement |
|------|-------------|
| Resolution | 1080p minimum |
| Frame rate | 30 fps |
| Format | MP4, MOV |
| Codec | H.264 |
| Audio | AAC, 128kbps+ |
| Captions | Required (85% watch muted) |

### Collection Ads

| Element | Spec |
|---------|------|
| Cover image/video | Standard specs |
| Product images | From catalog |
| Instant Experience | Required |

### Instant Experience

| Element | Spec |
|---------|------|
| Width | Full screen |
| Buttons | Up to 2 |
| Text blocks | Unlimited |
| Images | Up to 20 |
| Videos | Up to 2 minutes each |

---

## Character Limits

### All Ad Formats

| Element | Limit | Best Practice |
|---------|-------|---------------|
| Primary Text | 125 chars visible | Hook in first 40 chars |
| Headline | 40 chars | 27 chars recommended |
| Description | 30 chars | 27 chars recommended |
| Link URL | Unlimited | Use UTMs |

### By Placement

| Placement | Primary Text | Headline |
|-----------|-------------|----------|
| Facebook Feed | 125 (truncated) | 40 |
| Instagram Feed | 125 (truncated) | 40 |
| Stories | 125 | 40 |
| Marketplace | 125 | 40 |
| Right Column | 125 | 40 |

### Lead Ads

| Element | Limit |
|---------|-------|
| Form headline | 60 chars |
| Description | 160 chars |
| Custom questions | 3 per form |
| Privacy policy link | Required |

---

## Audience Targeting

### Core Audiences (Demographics)

| Category | Options |
|----------|---------|
| Location | Country, region, city, zip, radius |
| Age | 13-65+ |
| Gender | All, Men, Women |
| Language | Any |

### Detailed Targeting

| Category | Examples |
|----------|----------|
| Demographics | Education, job title, income, homeownership |
| Interests | Hobbies, entertainment, sports, shopping |
| Behaviors | Purchase behavior, device usage, travel |

### Custom Audiences

| Source | Retention |
|--------|-----------|
| Website (Pixel) | Up to 180 days |
| Customer List | Upload email/phone |
| App Activity | Up to 180 days |
| Engagement | Up to 365 days |
| Video | Up to 365 days |
| Lead Form | Up to 90 days |
| Shopping | Up to 180 days |

### Lookalike Audiences

| Size | Use Case |
|------|----------|
| 1% | Most similar, highest quality |
| 1-3% | Balanced reach and quality |
| 3-5% | Broader reach |
| 5-10% | Scale (lower quality) |

### Advantage+ Audiences
- AI-powered targeting
- Uses your suggestions as signals
- Expands beyond your defined audience
- Recommended for most campaigns

---

## Bidding & Budget

### Bidding Strategies

| Strategy | Best For |
|----------|----------|
| Lowest Cost | Maximize volume |
| Cost Cap | Control CPA |
| Bid Cap | Maximum bid control |
| ROAS Goal | Revenue optimization |

### Budget Options

| Type | Minimum |
|------|---------|
| Daily Budget | $1/day |
| Lifetime Budget | $1/day equivalent |
| Campaign Budget (CBO) | $1/day per ad set |

### Learning Phase

- Requires ~50 conversions per ad set per week
- Lasts ~7 days
- Don't edit during learning
- "Learning Limited" = insufficient data

---

## Conversion Tracking

### Meta Pixel Events

| Event | Code |
|-------|------|
| Page View | `fbq('track', 'PageView');` |
| View Content | `fbq('track', 'ViewContent');` |
| Add to Cart | `fbq('track', 'AddToCart');` |
| Initiate Checkout | `fbq('track', 'InitiateCheckout');` |
| Purchase | `fbq('track', 'Purchase', {value: X, currency: 'USD'});` |
| Lead | `fbq('track', 'Lead');` |
| Complete Registration | `fbq('track', 'CompleteRegistration');` |

### Conversions API (CAPI)

- Server-side tracking
- Required for iOS 14.5+ attribution
- Deduplication with Pixel
- Better data quality

### Aggregated Event Measurement

- 8 conversion events max per domain
- Priority ranking required
- iOS 14.5+ compliance

---

## Best Practices

### Creative (Hyper-Dopamine Approach)

1. **Pattern Interrupt**
   - Unusual visuals
   - Faces with emotion
   - Bright colors
   - Movement in video

2. **Native Feel**
   - Don't look like ads
   - User-generated style
   - Raw, authentic imagery

3. **Hook Fast**
   - Grab attention in 0-3 seconds
   - Front-load the benefit
   - Create curiosity

### Copy

1. **Headlines**
   - Big benefit or curiosity
   - Numbers and specifics
   - Swipe from news/gossip

2. **Primary Text**
   - Hook in first 40 chars
   - Benefits over features
   - Social proof if possible
   - Clear CTA

3. **Structure**
   - Short sentences
   - Line breaks
   - 5th grade reading level

### Testing

1. **Creative Testing**
   - 4-6 variations per ad set
   - Test images vs video
   - Test square vs vertical

2. **Copy Testing**
   - Test headlines
   - Test hooks
   - Test CTAs

3. **Audience Testing**
   - Broad vs narrow
   - Interest vs lookalike
   - Layered vs single interest

### Account Structure

1. **Simplification**
   - Fewer campaigns
   - Campaign Budget Optimization (CBO)
   - Advantage+ targeting

2. **Consolidation**
   - Combine similar audiences
   - Merge small ad sets
   - Let algorithm learn

---

## Special Ad Categories

Requires declaration for:
- Credit
- Employment
- Housing
- Social issues/elections/politics

**Limitations:**
- No age targeting
- No gender targeting
- Limited detailed targeting
- Minimum 15-mile radius

---

## Compliance

### Prohibited
- Misleading claims
- Before/after images (health)
- Personal attributes ("Are you...?")
- Sensational content
- Discriminatory targeting

### Restricted
- Alcohol (age-gated)
- Dating (approval)
- Gambling (regional)
- Cryptocurrency (approval)
- Supplements (disclaimers)

### Required
- Ad Transparency (all ads visible)
- Landing page match
- Clear advertiser identity
- Privacy policy for lead ads
