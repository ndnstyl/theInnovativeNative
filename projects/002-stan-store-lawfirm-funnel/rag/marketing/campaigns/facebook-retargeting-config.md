# Facebook Retargeting Campaign Configuration

**Task ID:** T009
**Agent:** Adler (Paid Ads)
**Created:** 2026-02-05
**Campaign:** Cerebro February 2026

---

## Campaign Overview

| Setting | Value |
|---------|-------|
| Campaign Name | `lfr-feb-retarget-2026` |
| Objective | Conversions (Lead Generation) |
| Budget | $600 (portion of $1,200 Facebook total) |
| Duration | Feb 5-28, 2026 |
| Pixel | TIN Facebook Pixel (ensure installed on law-firm-rag landing page) |

---

## Step-by-Step Setup Instructions

### Step 1: Create Custom Audiences

Navigate to **Ads Manager > Audiences > Create Audience > Custom Audience**

#### Audience 1: Website Visitors (Last 30 Days)
```
Source: Website
Include people who: Visited specific web pages
URL contains: theinnovativenative.com
Time range: 30 days
Audience name: LFR - Website Visitors 30d
```

#### Audience 2: Landing Page Visitors
```
Source: Website
Include people who: Visited specific web pages
URL contains: law-firm-rag
Time range: 30 days
Audience name: LFR - Landing Page Visitors 30d
```

#### Audience 3: Video Viewers (50%+ Completion)
```
Source: Video
Include people who: Watched 50% of video
Select videos: Cerebro explainer videos (all versions)
Time range: 365 days
Audience name: LFR - Video Viewers 50%+
```

### Step 2: Create Exclusion Audiences

#### Exclusion 1: Converters (Calendly Bookings)
```
Source: Website
Include people who: Completed a standard event
Event: Lead or Purchase (from Calendly thank-you page)
Time range: 180 days
Audience name: LFR - Converters (Exclude)
```

#### Exclusion 2: Existing Email List
```
Source: Customer List
Upload: Export from email provider (CSV)
Audience name: LFR - Email List (Exclude)
```

### Step 3: Create Campaign

Navigate to **Ads Manager > Create Campaign**

```
Campaign objective: Leads
Campaign name: LFR Feb Retarget
Special ad categories: None
A/B Test: Off (for now)
Campaign budget optimization: On
Daily budget: $25 (adjustable based on performance)
Campaign bid strategy: Lowest cost
```

### Step 4: Create Ad Sets

#### Ad Set 1: Website Visitors
```
Ad set name: LFR Retarget - Website Visitors
Conversion location: Website
Conversion event: Lead
Budget & schedule: Use campaign budget
Audience:
  - Custom Audience: LFR - Website Visitors 30d
  - Exclude: LFR - Converters (Exclude)
  - Exclude: LFR - Email List (Exclude)
Placements: Automatic (recommended) OR Manual:
  - Facebook Feed
  - Facebook Right Column
  - Instagram Feed
  - Instagram Stories
  - Audience Network
Optimization: Conversions
```

#### Ad Set 2: Landing Page Visitors
```
Ad set name: LFR Retarget - Landing Page
Conversion location: Website
Conversion event: Lead
Budget & schedule: Use campaign budget
Audience:
  - Custom Audience: LFR - Landing Page Visitors 30d
  - Exclude: LFR - Converters (Exclude)
  - Exclude: LFR - Email List (Exclude)
Placements: Same as above
Optimization: Conversions
```

#### Ad Set 3: Video Viewers
```
Ad set name: LFR Retarget - Video Viewers
Conversion location: Website
Conversion event: Lead
Budget & schedule: Use campaign budget
Audience:
  - Custom Audience: LFR - Video Viewers 50%+
  - Exclude: LFR - Converters (Exclude)
  - Exclude: LFR - Email List (Exclude)
Placements: Same as above
Optimization: Conversions
```

### Step 5: Create Ads

Create 4 ad variants per ad set (matching copy from `/law_firm_RAG/marketing/facebook-ad-copy.md`):

#### Ad Variant 1: Problem Angle
```
Ad name: Problem - Hallucination v1
Format: Single image or video
Media: Use 1080x1080 creative (from Pixel - T006)
Primary text:
  Law firms are spending hours verifying AI research.

  Because generic AI makes up citations.

  An associate at a mid-size firm found 3 fake cases in a single ChatGPT response.

  We built Cerebro specifically for law firms:
  → Your documents indexed first
  → Every citation verified
  → Full audit trail

  10 pilot slots for February. No commitment.

Headline: Stop Verifying AI Hallucinations
Description: Your docs first. Verified only.
CTA: Learn More
Destination URL: https://theinnovativenative.com/law-firm-rag?utm_source=facebook&utm_medium=paid&utm_campaign=lfr-feb-retarget&utm_content=problem-v1
```

#### Ad Variant 2: ROI Angle
```
Ad name: ROI - $40K Math v1
Format: Single image
Primary text:
  $40,000 per attorney per year.

  That's what AI saves when it actually works.

  Most legal AI doesn't.

  The math from a managing partner:
  • 2 hours saved per week
  • $400 billable rate
  • 50 weeks

  But only if the research is right.

  One hallucinated citation wipes out the ROI.

  Cerebro checks your firm's documents first. Every citation verified.

  10 pilot slots for February.

Headline: The $40K/Attorney Math
Description: Legal AI that actually works.
CTA: Learn More
Destination URL: https://theinnovativenative.com/law-firm-rag?utm_source=facebook&utm_medium=paid&utm_campaign=lfr-feb-roi&utm_content=math-v1
```

#### Ad Variant 3: Authority Angle
```
Ad name: Authority - Hierarchy v1
Format: Single image
Primary text:
  Your AI doesn't know that Supreme Court precedent matters more than a district court opinion.

  Ours does.

  We built authority-aware ranking into Cerebro:
  • SCOTUS surfaces first
  • Then circuit court
  • Then district court

  A litigation partner told us: "I don't need more cases. I need the right cases, in the right order."

  That's exactly what we built.

  10 pilot slots for February. Free evaluation.

Headline: AI That Understands Legal Hierarchy
Description: SCOTUS first. Always.
CTA: Learn More
Destination URL: https://theinnovativenative.com/law-firm-rag?utm_source=facebook&utm_medium=paid&utm_campaign=lfr-feb-authority&utm_content=hierarchy-v1
```

#### Ad Variant 4: Scarcity/Pilot CTA
```
Ad name: Pilot - Scarcity v1
Format: Single image
Primary text:
  3 pilot slots left for February.

  Full system access. No commitment.

  What you get:
  ✓ Your documents indexed (briefs, memos, agreements)
  ✓ Verified case law retrieval
  ✓ Authority-aware ranking
  ✓ Complete audit trail

  2-week evaluation. Real matters. Real research.

  7 firms already in. 3 spots left.

  We're builders who built what lawyers asked for.

  Now we need to prove it at scale.

Headline: 3 Pilot Slots Left
Description: Free evaluation. Real results.
CTA: Sign Up
Destination URL: https://theinnovativenative.com/law-firm-rag?utm_source=facebook&utm_medium=paid&utm_campaign=lfr-feb-pilot&utm_content=scarcity-v1
```

### Step 6: Publish and Monitor

1. **Review all settings** - Double-check audiences, exclusions, and URLs
2. **Submit for review** - Facebook typically approves within 24 hours
3. **Set up automated rules** (optional):
   - Pause ad if CPA > $150
   - Increase budget 20% if CPA < $75

---

## Tracking Setup Verification

Before launching, verify:

- [ ] Facebook Pixel installed on `theinnovativenative.com/law-firm-rag`
- [ ] Lead event fires on Calendly booking completion
- [ ] UTM parameters configured correctly
- [ ] Landing page loads properly with tracking

---

## Budget Allocation

| Ad Set | Daily Budget (Initial) |
|--------|----------------------|
| Website Visitors | $10 |
| Landing Page Visitors | $10 |
| Video Viewers | $5 |
| **Total** | **$25/day** |

**Week 1 Budget:** ~$175
**Total Campaign:** ~$600

Reallocate budget based on Week 1 performance (T029).

---

## Performance Benchmarks

| Metric | Target | Action Trigger |
|--------|--------|----------------|
| CTR | >1.5% | Pause if <0.5% for 3 days |
| CPC | <$3.00 | Optimize if >$5.00 |
| CPL | <$100 | Pause if >$150 |
| Frequency | <4.0 | Refresh creative if >5.0 |
| ROAS | >2x | Scale winning variants |

---

## Optimization Notes

- Test dynamic creative after initial learning phase
- Consider carousel format for Video Viewers audience
- A/B test landing page variations if CPL is high
- Refresh creative every 2 weeks to combat fatigue

---

## Related Tasks

- **T006**: Facebook ad images (Pixel) - NEEDED FOR ADS
- **T007**: Facebook ad copy (Chris) - COMPLETE (in facebook-ad-copy.md)
- **T010**: Lookalike audience creation
- **T011**: Ad sets with creative

---

*Configuration created by Adler (Paid Ads Agent)*
*Last updated: 2026-02-05*
