# Facebook Ad Sets Configuration

**Task ID:** T011
**Agent:** Adler (Paid Ads)
**Created:** 2026-02-05
**Due:** 2026-02-08
**Campaign:** Cerebro February 2026

---

## Overview

This document provides the complete ad set configuration for the Law Firm RAG (Cerebro) Facebook campaign. It combines the retargeting audiences (T009) and lookalike audiences (T010) with the creative assets (T006) and ad copy (T007) into deployable ad sets.

**Prerequisites:**
- [x] T009: Retargeting campaign setup - COMPLETE
- [x] T010: Lookalike audience creation - COMPLETE
- [ ] T006: Facebook ad images (4 variants) - PENDING (Pixel)
- [x] T007: Facebook ad copy (4 variants) - COMPLETE (see `facebook-ad-copy.md`)

**Status:** READY TO CONFIGURE (awaiting T006 creative assets)

---

## Campaign Structure

```
LFR Feb 2026 Campaign Portfolio
├── Campaign 1: LFR Feb Retarget (Conversions)
│   ├── Ad Set: Website Visitors
│   ├── Ad Set: Landing Page Visitors
│   └── Ad Set: Video Viewers
│
├── Campaign 2: LFR Feb Lookalike (Conversions)
│   ├── Ad Set: LAL 1% Email
│   ├── Ad Set: LAL 1% Website
│   ├── Ad Set: LAL 2% Email (Test)
│   └── Ad Set: LAL 2% Website (Test)
│
└── Campaign 3: LFR Feb Lead Gen (Lead Form)
    ├── Ad Set: Interest Stack Legal Tech
    └── Ad Set: LAL 1% Combined
```

---

## Part 1: Retargeting Ad Sets

### Ad Set 1.1: Website Visitors

| Setting | Value |
|---------|-------|
| **Ad Set Name** | LFR Retarget - Website Visitors |
| **Status** | Paused (until launch) |
| **Conversion Event** | Lead |
| **Budget** | Campaign Budget (CBO) |
| **Schedule** | Feb 5-28, 2026 |

**Audience Configuration:**
```
Custom Audience: LFR - Website Visitors 30d
Exclude:
  - LFR - Converters (Exclude)
  - LFR - Email List (Exclude)
Age: 25-65
Location: United States
```

**Placements:**
- Facebook Feed
- Facebook Right Column
- Instagram Feed
- Instagram Stories
- Audience Network (optional)

**Ads (4 variants):**

| Ad # | Name | Creative | Copy Variant |
|------|------|----------|--------------|
| 1 | Problem - Hallucination v1 | `fb-ad-problem-1080x1080.png` | Ad Variant 1 |
| 2 | ROI - $40K Math v1 | `fb-ad-roi-1080x1080.png` | Ad Variant 2 |
| 3 | Authority - Hierarchy v1 | `fb-ad-authority-1080x1080.png` | Ad Variant 3 |
| 4 | Pilot - Scarcity v1 | `fb-ad-pilot-1080x1080.png` | Ad Variant 4 |

---

### Ad Set 1.2: Landing Page Visitors

| Setting | Value |
|---------|-------|
| **Ad Set Name** | LFR Retarget - Landing Page |
| **Status** | Paused (until launch) |
| **Conversion Event** | Lead |
| **Budget** | Campaign Budget (CBO) |
| **Schedule** | Feb 5-28, 2026 |

**Audience Configuration:**
```
Custom Audience: LFR - Landing Page Visitors 30d
Exclude:
  - LFR - Converters (Exclude)
  - LFR - Email List (Exclude)
Age: 25-65
Location: United States
```

**Placements:** Same as 1.1

**Ads:** Same 4 variants as 1.1 (duplicate)

---

### Ad Set 1.3: Video Viewers

| Setting | Value |
|---------|-------|
| **Ad Set Name** | LFR Retarget - Video Viewers |
| **Status** | Paused (until launch) |
| **Conversion Event** | Lead |
| **Budget** | Campaign Budget (CBO) |
| **Schedule** | Feb 5-28, 2026 |

**Audience Configuration:**
```
Custom Audience: LFR - Video Viewers 50%+
Exclude:
  - LFR - Converters (Exclude)
  - LFR - Email List (Exclude)
  - LFR - Website Visitors 30d (to avoid overlap)
Age: 25-65
Location: United States
```

**Placements:** Same as 1.1

**Ads:** Same 4 variants as 1.1 (duplicate)

---

## Part 2: Lookalike Ad Sets

### Ad Set 2.1: LAL 1% Email List

| Setting | Value |
|---------|-------|
| **Ad Set Name** | LFR Lookalike - 1% Email |
| **Status** | Paused (until launch) |
| **Conversion Event** | Lead |
| **Budget** | Campaign Budget (CBO) - 40% weight |
| **Schedule** | Feb 5-28, 2026 |

**Audience Configuration:**
```
Lookalike: LFR - LAL 1% Email List
Exclude:
  - LFR - Converters (Exclude)
  - LFR - Email List (Exclude)
  - LFR - Website Visitors 30d
Age: 28-60
Location: United States
```

**Placements:**
- Facebook Feed (primary)
- Instagram Feed

**Ads:** Same 4 variants with updated UTM:
```
utm_campaign=lfr-feb-lookalike&utm_content=[variant-name]
```

---

### Ad Set 2.2: LAL 1% Website Visitors

| Setting | Value |
|---------|-------|
| **Ad Set Name** | LFR Lookalike - 1% Website |
| **Status** | Paused (until launch) |
| **Conversion Event** | Lead |
| **Budget** | Campaign Budget (CBO) - 40% weight |
| **Schedule** | Feb 5-28, 2026 |

**Audience Configuration:**
```
Lookalike: LFR - LAL 1% Website Visitors
Exclude:
  - LFR - Converters (Exclude)
  - LFR - Email List (Exclude)
  - LFR - Website Visitors 30d
Age: 28-60
Location: United States
```

**Placements:** Same as 2.1

**Ads:** Same 4 variants

---

### Ad Set 2.3: LAL 2% Email (Scale Test)

| Setting | Value |
|---------|-------|
| **Ad Set Name** | LFR Lookalike - 2% Email (Test) |
| **Status** | Paused (until Week 2) |
| **Conversion Event** | Lead |
| **Budget** | Campaign Budget (CBO) - 10% weight |
| **Schedule** | Feb 12-28, 2026 |

**Audience Configuration:**
```
Lookalike: LFR - LAL 2% Email List
Exclude:
  - All exclusions from 2.1
  - LFR - LAL 1% Email List (avoid overlap)
Age: 28-60
Location: United States
```

**Note:** Only activate after Week 1 performance review (T029)

---

### Ad Set 2.4: LAL 2% Website (Scale Test)

| Setting | Value |
|---------|-------|
| **Ad Set Name** | LFR Lookalike - 2% Website (Test) |
| **Status** | Paused (until Week 2) |
| **Conversion Event** | Lead |
| **Budget** | Campaign Budget (CBO) - 10% weight |
| **Schedule** | Feb 12-28, 2026 |

**Audience Configuration:**
```
Lookalike: LFR - LAL 2% Website Visitors
Exclude:
  - All exclusions from 2.2
  - LFR - LAL 1% Website Visitors (avoid overlap)
Age: 28-60
Location: United States
```

---

## Part 3: Lead Gen Ad Sets (T028 - Future)

*To be configured Feb 14 per T028*

### Ad Set 3.1: Interest Stack Legal Tech

| Setting | Value |
|---------|-------|
| **Ad Set Name** | LFR Lead Gen - Legal Tech Interest |
| **Status** | Draft (launch Feb 14) |
| **Objective** | Lead Generation |
| **Form** | In-app Facebook Lead Form |

**Audience Configuration:**
```
Location: United States
Age: 30-60
Interests:
  - Legal technology
  - Law firm management
  - Westlaw
  - LexisNexis
  - American Bar Association
Job Titles:
  - Managing Partner
  - Legal Operations
  - Chief Operating Officer
  - Law Firm Administrator
Behaviors:
  - Business Decision Makers
Exclude:
  - LFR - Converters (Exclude)
  - LFR - Email List (Exclude)
Audience name: LFR - Interest Stack Legal Tech
```

**Lead Form Configuration:**
```
Form Name: Cerebro Pilot Application
Headline: Free 2-Week Pilot
Description: Join 7 firms already testing Cerebro. 3 spots left.
Questions:
  1. Firm name (Short answer)
  2. Number of attorneys (Single choice: 1-10, 11-50, 51-200, 200+)
  3. Primary practice area (Dropdown: Litigation, Corporate, IP, Employment, Other)
  4. Work email (Email - auto-filled)
  5. Phone (Optional - Phone number)
Privacy Policy: https://theinnovativenative.com/privacy
Thank You Screen:
  Headline: Thanks! We'll be in touch within 24 hours.
  CTA: View Our Website
  Link: https://theinnovativenative.com/law-firm-rag
```

---

## Creative Asset Mapping

### Required Assets (T006 - Pixel)

| Asset Name | Dimensions | Ad Angle | Status |
|------------|-----------|----------|--------|
| `fb-ad-problem-1080x1080.png` | 1080x1080 | Problem (Hallucination) | PENDING |
| `fb-ad-roi-1080x1080.png` | 1080x1080 | ROI ($40K Math) | PENDING |
| `fb-ad-authority-1080x1080.png` | 1080x1080 | Authority (Hierarchy) | PENDING |
| `fb-ad-pilot-1080x1080.png` | 1080x1080 | Pilot (Scarcity) | PENDING |

### Landscape Variants (Optional)

| Asset Name | Dimensions | Use Case |
|------------|-----------|----------|
| `fb-ad-problem-1200x628.png` | 1200x628 | Right column, Marketplace |
| `fb-ad-roi-1200x628.png` | 1200x628 | Right column, Marketplace |
| `fb-ad-authority-1200x628.png` | 1200x628 | Right column, Marketplace |
| `fb-ad-pilot-1200x628.png` | 1200x628 | Right column, Marketplace |

### Creative Specifications

All creatives must follow:
- **Brand Colors:** Dark background (#0A0A14), Cyan accent (#00FFFF)
- **Style:** Pattern interrupt, native feel (not stock-looking)
- **Text Limit:** <20% text on image (Facebook policy)
- **Safe Zone:** Keep key elements away from edges (for cropping)

---

## Ad Copy Reference

Full copy in: `/law_firm_RAG/marketing/facebook-ad-copy.md`

### Quick Reference

| Variant | Headline | CTA | UTM Content |
|---------|----------|-----|-------------|
| 1. Problem | Stop Verifying AI Hallucinations | Learn More | problem-v1 |
| 2. ROI | The $40K/Attorney Math | Learn More | math-v1 |
| 3. Authority | AI That Understands Legal Hierarchy | Learn More | hierarchy-v1 |
| 4. Pilot | 3 Pilot Slots Left | Sign Up | scarcity-v1 |

### Destination URLs

**Retargeting Campaign:**
```
https://theinnovativenative.com/law-firm-rag?utm_source=facebook&utm_medium=paid&utm_campaign=lfr-feb-retarget&utm_content=[variant]
```

**Lookalike Campaign:**
```
https://theinnovativenative.com/law-firm-rag?utm_source=facebook&utm_medium=paid&utm_campaign=lfr-feb-lookalike&utm_content=[variant]
```

**Lead Gen Campaign:**
```
https://theinnovativenative.com/law-firm-rag?utm_source=facebook&utm_medium=paid&utm_campaign=lfr-feb-leadgen&utm_content=form-v1
```

---

## Budget Allocation

### Total Facebook Budget: $1,200 (Feb 5-28)

| Campaign | Daily Budget | Total | Share |
|----------|-------------|-------|-------|
| Retargeting | $25/day | $600 | 50% |
| Lookalike | $20/day | $480 | 40% |
| Lead Gen (Week 2+) | $10/day | $120 | 10% |

### Week-by-Week Budget Plan

| Week | Retargeting | Lookalike | Lead Gen | Total |
|------|-------------|-----------|----------|-------|
| Week 1 (Feb 5-11) | $25/day | $20/day | $0 | $315 |
| Week 2 (Feb 12-18) | $25/day | $25/day | $10/day | $420 |
| Week 3+ (Feb 19-28) | $30/day | $20/day | $10/day | $465+ |

*Adjust based on performance at each weekly review (T029, T042)*

---

## Performance Benchmarks

### Retargeting Targets

| Metric | Target | Warning | Action |
|--------|--------|---------|--------|
| CTR | >1.5% | <1.0% | Refresh creative |
| CPC | <$3.00 | >$5.00 | Optimize targeting |
| CPL | <$100 | >$150 | Pause, investigate |
| Frequency | <4.0 | >5.0 | Refresh creative |

### Lookalike Targets

| Metric | Target | Warning | Action |
|--------|--------|---------|--------|
| CTR | >0.8% | <0.5% | Test new angles |
| CPC | <$4.00 | >$6.00 | Narrow targeting |
| CPL | <$120 | >$175 | Pause ad set |
| Reach | Track | Low | Expand % |

### Lead Gen Targets

| Metric | Target | Warning | Action |
|--------|--------|---------|--------|
| Form completion rate | >20% | <10% | Simplify form |
| Cost per lead | <$80 | >$120 | Optimize questions |
| Lead quality | Track | Low | Add qualifier questions |

---

## Optimization Rules (Automated)

Set up in Ads Manager > Rules:

### Rule 1: Pause High-CPA Ads
```
IF Cost per Lead > $150
AND Impressions > 1,000
THEN Pause ad
NOTIFY Adler
```

### Rule 2: Scale Winners
```
IF Cost per Lead < $75
AND Conversions > 3
THEN Increase budget by 20%
MAX budget increase: $50/day
NOTIFY Adler
```

### Rule 3: Frequency Cap Alert
```
IF Frequency > 4.5
THEN Send notification
MESSAGE: "Creative fatigue alert - consider refresh"
```

### Rule 4: Spend Pacing Alert
```
IF Spend > 120% of daily budget
THEN Send notification
MESSAGE: "Overspend alert on [campaign name]"
```

---

## Launch Checklist

### Pre-Launch (Before Publishing)

- [ ] Facebook Pixel verified on landing page
- [ ] Lead event fires on Calendly booking
- [ ] All custom audiences created and populated (>100 users)
- [ ] All lookalike audiences created
- [ ] Creative assets received from Pixel (T006)
- [ ] All UTM parameters verified
- [ ] Landing page loads correctly on mobile
- [ ] Exclusion audiences properly configured

### Ad Configuration

- [ ] Ad Set 1.1 configured (Website Visitors)
- [ ] Ad Set 1.2 configured (Landing Page Visitors)
- [ ] Ad Set 1.3 configured (Video Viewers)
- [ ] Ad Set 2.1 configured (LAL 1% Email)
- [ ] Ad Set 2.2 configured (LAL 1% Website)
- [ ] All 4 ad variants created per ad set
- [ ] Headlines within 40 character limit
- [ ] Primary text formatted with line breaks
- [ ] CTAs appropriate per variant
- [ ] URLs correct with UTMs

### Post-Launch (First 24 Hours)

- [ ] Ads submitted for review
- [ ] Verify ads approved (check for policy violations)
- [ ] First impressions/clicks registering
- [ ] Pixel events firing correctly
- [ ] No delivery issues flagged
- [ ] T051 daily monitoring begins

---

## Troubleshooting Guide

### Ad Rejected

**Common reasons:**
1. Text >20% of image - Reduce text overlay
2. Personal attributes claim - Remove "Are you..." language
3. Misleading claims - Verify all claims are accurate
4. Landing page mismatch - Ensure LP matches ad promise

**Action:** Review rejection reason in Ads Manager, edit, resubmit

### Low Delivery

**Possible causes:**
1. Bid too low - Switch to lowest cost bidding
2. Audience too small - Expand % or add interests
3. Learning phase - Wait 3-5 days
4. Policy issue - Check for warnings

**Action:** Review delivery insights, adjust as needed

### High CPA

**Possible causes:**
1. Wrong audience - Review audience composition
2. Creative fatigue - Refresh images
3. Weak landing page - Improve LP conversion
4. Competitive period - Adjust expectations

**Action:** A/B test elements systematically

### Tracking Issues

**Symptoms:**
- Conversions not recording
- Attribution gaps
- Data discrepancies

**Action:** Verify Pixel installation, check Events Manager, enable CAPI if not already

---

## Related Documents

| Document | Path | Purpose |
|----------|------|---------|
| Retargeting Setup | `facebook-retargeting-config.md` | Audience definitions |
| Lookalike Setup | `facebook-lookalike-config.md` | LAL configurations |
| Ad Copy | `facebook-ad-copy.md` | Copy for all variants |
| Meta Specs | `.claude/skills/marketing/platforms/meta-ads.md` | Platform specifications |
| Campaign Tasks | `.specify/features/cerebro-feb-2026-campaign/tasks.md` | Full task list |

---

## Related Tasks

| Task ID | Description | Owner | Status |
|---------|-------------|-------|--------|
| T006 | Facebook ad images (4 variants) | Pixel | PENDING |
| T007 | Facebook ad copy (4 variants) | Chris | COMPLETE |
| T009 | Retargeting campaign setup | Adler | DONE |
| T010 | Lookalike audience creation | Adler | DONE |
| T027 | Launch Facebook video ad campaign | Adler | PENDING (Feb 12) |
| T028 | Set up Facebook lead gen ads | Adler | PENDING (Feb 14) |
| T029 | Week 1 performance review | Adler | PENDING (Feb 12) |

---

## Change Log

| Date | Change | By |
|------|--------|-----|
| 2026-02-05 | Initial configuration created | Adler |

---

*Configuration created by Adler (Paid Ads Agent)*
*Last updated: 2026-02-05*
