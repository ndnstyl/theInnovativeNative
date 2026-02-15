# Facebook Lookalike Audience Configuration

**Task ID:** T010
**Agent:** Adler (Paid Ads)
**Created:** 2026-02-05
**Campaign:** Cerebro February 2026

---

## Overview

Lookalike audiences allow us to reach new prospects who share characteristics with our best existing audiences. This configuration creates multiple lookalike tiers for testing and scaling.

---

## Step-by-Step Setup Instructions

### Step 1: Prepare Source Audiences

Before creating lookalikes, ensure source audiences exist:

#### Source Audience 1: Email List
Navigate to **Ads Manager > Audiences > Create Audience > Custom Audience > Customer List**

```
Source: Customer list
Data source: Upload file (CSV)
Required fields: Email (primary), First Name, Last Name (if available)
File prep:
  - Export from email provider
  - Remove unsubscribes
  - Include only engaged contacts (opened in last 90 days preferred)
Audience name: LFR - Email List (Source)
Minimum size: 100 (recommended: 1,000+)
```

**CSV Format:**
```csv
email,fn,ln
john@lawfirm.com,John,Smith
jane@legal.com,Jane,Doe
```

#### Source Audience 2: Website Visitors
*(Created in retargeting setup - verify exists)*

```
Audience name: LFR - Website Visitors 30d
Verify in Audiences tab before proceeding
```

#### Source Audience 3: High-Intent Visitors (Landing Page)
```
Source: Website
Include people who: Visited specific web pages
URL contains: law-firm-rag
Time range: 180 days (longer for better signal)
Audience name: LFR - High Intent LP Visitors (Source)
```

#### Source Audience 4: Converters (Future Lookalike Seed)
```
Source: Website
Include people who: Completed Lead event
Time range: 180 days
Audience name: LFR - Converters (Source)
Note: Use once you have 100+ conversions
```

---

### Step 2: Create Lookalike Audiences

Navigate to **Ads Manager > Audiences > Create Audience > Lookalike Audience**

#### Lookalike 1: 1% from Email List
```
Source: LFR - Email List (Source)
Location: United States
Audience size: 1% (most similar)
Lookalike audience name: LFR - LAL 1% Email List
Expected reach: ~2.5M people
```

#### Lookalike 2: 1% from Website Visitors
```
Source: LFR - Website Visitors 30d
Location: United States
Audience size: 1%
Lookalike audience name: LFR - LAL 1% Website Visitors
Expected reach: ~2.5M people
```

#### Lookalike 3: 1-3% from Email List (Scale Testing)
```
Source: LFR - Email List (Source)
Location: United States
Audience size: 1-3% (tiered)
Create 3 separate audiences:
  - LFR - LAL 1% Email List (created above)
  - LFR - LAL 2% Email List
  - LFR - LAL 3% Email List
```

#### Lookalike 4: 1-3% from Website Visitors (Scale Testing)
```
Source: LFR - Website Visitors 30d
Location: United States
Create 3 separate audiences:
  - LFR - LAL 1% Website Visitors (created above)
  - LFR - LAL 2% Website Visitors
  - LFR - LAL 3% Website Visitors
```

---

### Step 3: Layer with Interest Targeting

For each lookalike, create a refined version with interest layering:

#### Lookalike + Legal Tech Interest
```
Base audience: LFR - LAL 1% Email List
AND must also match:
  Interests:
    - Legal technology
    - Law firm management
    - Westlaw
    - LexisNexis
    - American Bar Association
  OR
  Job titles:
    - Managing Partner
    - Legal Operations
    - Chief Operating Officer
    - Law Firm Administrator
    - Legal Tech
Audience name: LFR - LAL 1% Email + Legal Interests
```

---

### Step 4: Create Prospecting Campaign

Navigate to **Ads Manager > Create Campaign**

```
Campaign objective: Leads
Campaign name: LFR Feb Lookalike Prospecting
Special ad categories: None
Campaign budget optimization: On
Daily budget: $25 (initial)
Campaign bid strategy: Lowest cost
```

#### Ad Set Structure

| Ad Set Name | Audience | Daily Budget Share |
|-------------|----------|-------------------|
| LAL 1% Email | LFR - LAL 1% Email List | 40% |
| LAL 1% Website | LFR - LAL 1% Website Visitors | 40% |
| LAL 2% Email (Test) | LFR - LAL 2% Email List | 10% |
| LAL 2% Website (Test) | LFR - LAL 2% Website Visitors | 10% |

**All ad sets should exclude:**
- LFR - Converters (Exclude)
- LFR - Email List (Exclude)
- LFR - Website Visitors 30d (exclude from LAL campaigns to avoid overlap)

#### Ad Set Configuration (each)
```
Ad set name: [As per table above]
Conversion location: Website
Conversion event: Lead
Audience: [Corresponding LAL audience]
Exclude:
  - LFR - Converters (Exclude)
  - LFR - Email List (Exclude)
Age: 25-65
Placements: Automatic (or Facebook/Instagram feeds only)
Optimization: Conversions
```

---

### Step 5: Add Ads to Each Ad Set

Use the same 4 ad variants from retargeting config:

1. **Problem Angle** - Hallucination focus
2. **ROI Angle** - $40K math
3. **Authority Angle** - Legal hierarchy
4. **Scarcity/Pilot** - Limited slots

**Update UTM for prospecting:**
```
?utm_source=facebook&utm_medium=paid&utm_campaign=lfr-feb-lookalike&utm_content=[variant-name]
```

Example URLs:
- `...&utm_campaign=lfr-feb-lookalike&utm_content=problem-v1`
- `...&utm_campaign=lfr-feb-lookalike&utm_content=math-v1`
- `...&utm_campaign=lfr-feb-lookalike&utm_content=hierarchy-v1`
- `...&utm_campaign=lfr-feb-lookalike&utm_content=scarcity-v1`

---

## Audience Sizing Reference

| Audience | Expected Size (US) | Quality |
|----------|-------------------|---------|
| 1% Lookalike | ~2.5M | Highest similarity |
| 2% Lookalike | ~5M | High similarity |
| 3% Lookalike | ~7.5M | Good similarity |
| 5% Lookalike | ~12.5M | Broad (scale only) |

**Recommendation:** Start with 1% for quality, expand to 2-3% only after validating performance.

---

## Interest Targeting Fallback

If lookalike performance is poor OR source audiences are too small (<100), use interest-based targeting:

```
Location: United States
Age: 30-60
Interests:
  - Legal technology
  - Law firm management
  - Westlaw
  - LexisNexis
  - American Bar Association
  - Legal Operations
Job titles:
  - Managing Partner
  - Partner (Law Firm)
  - Legal Operations Manager
  - Chief Operating Officer (Legal)
  - Law Firm Administrator
Behaviors:
  - Business Decision Makers
Audience name: LFR - Interest Stack Legal Tech
```

---

## Budget Allocation

**Lookalike Campaign Budget (from $1,200 Facebook total):**

| Week | Daily Budget | Focus |
|------|-------------|-------|
| Week 1 | $20/day | Test all LAL audiences |
| Week 2 | $25/day | Scale winners, pause losers |
| Week 3-4 | $30/day | Conversion push |

**Total Lookalike Spend:** ~$600 (matching retargeting allocation)

---

## Performance Benchmarks

| Metric | Target | Action |
|--------|--------|--------|
| CTR | >0.8% | Pause if <0.3% |
| CPC | <$4.00 | Optimize if >$6.00 |
| CPL | <$120 | Pause if >$175 |
| Audience Size | >100K | Expand % if needed |

**Note:** Prospecting audiences typically have higher CPA than retargeting. Factor this into expectations.

---

## Scaling Strategy

### Week 1: Testing Phase
- Run all 4 ad variants in all LAL audiences
- Let Facebook optimize for 3-4 days
- Identify top performers

### Week 2: Optimization Phase
- Pause underperforming ad sets (<0.5% CTR)
- Shift budget to winners
- Test 2% LAL expansion
- Consider interest layering on top performers

### Week 3-4: Scale Phase
- Expand winning LAL to 3%
- Create lookalike from converters (if 100+)
- Increase daily budget on proven combinations
- A/B test new creative variants

---

## Audience Refresh Schedule

| Audience Type | Refresh Frequency |
|---------------|-------------------|
| Website visitors (source) | Automatic (rolling 30d) |
| Email list (source) | Monthly upload |
| Lookalikes | Recreate monthly |
| Converters (source) | Automatic |

---

## Troubleshooting

**Audience too small (<1,000):**
- Extend time range (30d → 90d → 180d)
- Combine multiple source audiences
- Use interest targeting instead

**High CPA on lookalikes:**
- Check for audience overlap with retargeting
- Add interest targeting layer
- Test smaller % (1% only)
- Review ad relevance scores

**Low reach/delivery:**
- Bid cap may be too low
- Audience exhaustion - expand %
- Check for policy issues on ads

---

## Related Tasks

- **T009**: Retargeting setup (complete first)
- **T011**: Ad sets with creative (after T006 complete)
- **T029**: Week 1 performance review
- **T044**: Expand lookalike based on converters

---

*Configuration created by Adler (Paid Ads Agent)*
*Last updated: 2026-02-05*
