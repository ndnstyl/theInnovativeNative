# Google Ads Platform Specifications

## Overview

Google's advertising platform covering Search, Display, YouTube, Shopping, and more. Best for intent-based marketing (Search), broad reach (Display), and video advertising (YouTube). Highly measurable with robust conversion tracking.

---

## Campaign Types

### Search Campaigns

| Spec | Details |
|------|---------|
| Ad Format | Text ads (headlines + descriptions) |
| Targeting | Keywords, audiences, location |
| Bidding | CPC, Target CPA, Target ROAS, Maximize conversions |
| Best For | High-intent buyers actively searching |

### Display Campaigns

| Spec | Details |
|------|---------|
| Ad Formats | Responsive display, image, HTML5 |
| Targeting | Audiences, placements, topics, keywords |
| Bidding | CPM, CPC, Target CPA |
| Best For | Brand awareness, retargeting |

### Performance Max

| Spec | Details |
|------|---------|
| Ad Formats | All formats (auto-generated) |
| Targeting | Automated across all Google properties |
| Bidding | Automated, conversion-focused |
| Best For | Cross-channel optimization |

### Shopping Campaigns

| Spec | Details |
|------|---------|
| Ad Format | Product listings |
| Requirements | Merchant Center feed |
| Bidding | CPC, Target ROAS |
| Best For | E-commerce |

---

## Search Ad Specifications

### Responsive Search Ads (RSA)

| Element | Limit | Best Practice |
|---------|-------|---------------|
| Headlines | Up to 15 | Provide all 15 |
| Headline Length | 30 chars each | Use full space |
| Descriptions | Up to 4 | Provide all 4 |
| Description Length | 90 chars each | Use full space |
| Final URL | Unlimited | Deep link to relevant page |
| Display Path | 15 chars x 2 | Use keywords |

### Headlines Displayed
- 3 headlines shown (up to 90 chars total)
- May show 2 headlines on smaller devices

### Descriptions Displayed
- 2 descriptions shown (up to 180 chars total)
- May show 1 on smaller devices

### Ad Extensions (Assets)

| Extension | Character Limits |
|-----------|-----------------|
| Sitelinks | 25 char headline, 35 char description (x2) |
| Callouts | 25 chars each |
| Structured Snippets | 25 chars per value |
| Call | Phone number |
| Location | From Google Business |
| Price | 25 char header, 25 char description |
| Promotion | 20 char occasion, standard text |
| Image | 1200x1200px or 1200x628px |

---

## Display Ad Specifications

### Responsive Display Ads

| Asset | Specs | Limit |
|-------|-------|-------|
| Landscape Image | 1200 x 628px (1.91:1) | 15 images |
| Square Image | 1200 x 1200px (1:1) | 15 images |
| Logo (landscape) | 1200 x 300px (4:1) | 5 logos |
| Logo (square) | 1200 x 1200px (1:1) | 5 logos |
| Short Headline | 30 chars | 5 headlines |
| Long Headline | 90 chars | 5 headlines |
| Description | 90 chars | 5 descriptions |
| Business Name | 25 chars | 1 |
| Video | YouTube URL | 5 videos |

### Image Requirements
- File size: 5.12MB max
- Formats: JPG, PNG, GIF (no animation)
- Minimum: 600x314 (landscape), 300x300 (square)
- No text overlay >20% of image

### Standard Image Ads (Legacy)

| Size | Dimensions | Notes |
|------|-----------|-------|
| Medium Rectangle | 300 x 250px | Most common |
| Large Rectangle | 336 x 280px | High visibility |
| Leaderboard | 728 x 90px | Above fold |
| Half Page | 300 x 600px | High engagement |
| Large Mobile Banner | 320 x 100px | Mobile |
| Billboard | 970 x 250px | Premium |
| Large Leaderboard | 970 x 90px | Desktop |

---

## YouTube Ad Specifications

(See youtube.md for detailed specs)

### Quick Reference

| Format | Duration | Skip |
|--------|----------|------|
| TrueView In-Stream | 12s+ | After 5s |
| Non-Skippable | 15-20s | No |
| Bumper | 6s | No |
| Discovery | N/A | Thumbnail + text |

---

## Performance Max Assets

### Required Assets

| Asset Type | Quantity | Specs |
|-----------|----------|-------|
| Text Headlines | 3-5 | 30 chars |
| Long Headlines | 1-5 | 90 chars |
| Descriptions | 2-5 | 90 chars |
| Images | 3+ | Landscape + square |
| Logos | 1+ | Square recommended |
| Videos | 1+ (optional) | YouTube URLs |
| Final URL | 1 | Landing page |
| Business Name | 1 | 25 chars |

### Recommended Assets
- 15 headlines
- 5 long headlines
- 4 descriptions
- 15 images (various sizes)
- 5 logos
- 5 videos

---

## Audience Targeting

### First-Party Data
- Customer Match (email, phone, address)
- Website visitors (Google tag)
- YouTube engagement
- App users

### Google Audiences
- Affinity (interests/lifestyles)
- In-market (active researchers)
- Life events (moving, graduating, etc.)
- Detailed demographics (parents, homeowners, etc.)
- Custom segments (keywords + URLs + apps)

### Remarketing
- Website visitors (all, specific pages)
- Cart abandoners
- Past converters
- YouTube viewers
- Customer list

### Lookalike/Similar
- Similar audiences (based on any list)
- Optimized targeting (expanded by Google)

---

## Bidding Strategies

### Manual Bidding
| Strategy | Use Case |
|----------|----------|
| Manual CPC | Full control, learning phase |
| Enhanced CPC | Manual with smart adjustments |

### Automated Bidding
| Strategy | Use Case |
|----------|----------|
| Maximize Clicks | Traffic focus |
| Maximize Conversions | Conversion volume |
| Maximize Conversion Value | Revenue focus |
| Target CPA | Cost per acquisition goal |
| Target ROAS | Return on ad spend goal |
| Target Impression Share | Brand visibility |

### Bidding Requirements
- Target CPA: 15+ conversions/month minimum
- Target ROAS: 15+ conversions/month minimum
- Learning phase: ~7 days after changes

---

## Conversion Tracking

### Google Tag (gtag.js)
```javascript
gtag('event', 'conversion', {
  'send_to': 'AW-XXXXXXXXX/XXXXXXXXXXX',
  'value': 100.00,
  'currency': 'USD'
});
```

### Standard Events
| Event | When to Use |
|-------|------------|
| Purchase | Transaction complete |
| Lead | Form submission |
| Sign_up | Account creation |
| Add_to_cart | Cart addition |
| Begin_checkout | Checkout start |
| Page_view | Every page (automatic) |

### Enhanced Conversions
- Server-side tracking
- First-party data matching
- Better attribution (privacy era)

---

## Character Limits Summary

| Element | Limit |
|---------|-------|
| RSA Headline | 30 chars |
| RSA Description | 90 chars |
| Display Short Headline | 30 chars |
| Display Long Headline | 90 chars |
| Display Description | 90 chars |
| Business Name | 25 chars |
| Display Path | 15 chars x 2 |
| Sitelink Title | 25 chars |
| Sitelink Description | 35 chars |
| Callout | 25 chars |

---

## Best Practices

### Search Ads
1. **Keyword match types**
   - Broad: Widest reach, use with Smart Bidding
   - Phrase: Moderate control
   - Exact: Precise targeting

2. **Ad copy**
   - Include keywords in headlines
   - Highlight unique value props
   - Include CTAs
   - Use all extensions

3. **Account structure**
   - Theme-based ad groups
   - 3-5 ads per ad group
   - Single keyword ad groups (SKAGs) for high-value terms

### Display Ads
1. **Creative**
   - Multiple sizes and formats
   - Clear branding
   - Simple messaging
   - Strong CTA

2. **Targeting**
   - Layer audiences + placements
   - Exclude irrelevant placements
   - Use managed placements for control

### Performance Max
1. **Asset variety**
   - Provide all asset types
   - Multiple variations
   - Let Google optimize

2. **Audience signals**
   - Add first-party data
   - Include competitor URLs
   - Use relevant keywords

---

## Budget & Bidding Guidelines

### Daily Budgets
- Minimum: $10-20/day for learning
- Recommended: 2x target CPA minimum
- Scale: Increase by 20% max every 3-4 days

### Learning Phase
- ~7 days after significant changes
- 50+ conversions needed for optimization
- Avoid changes during learning

### Optimization Cadence
- Daily: Check spend pacing, anomalies
- Weekly: Bid adjustments, negative keywords
- Monthly: Strategy review, new tests
