# SOP: Campaign Deployment

## Purpose
Standard operating procedure for deploying paid advertising campaigns across Meta, Google, LinkedIn, and YouTube platforms.

## Scope
- New campaign launches
- Campaign relaunches
- Major campaign updates

## Responsible Agents
- **Owner**: Adler (Paid Ads Specialist)
- **Approver**: Drew (Project Manager)
- **Creative**: Pixel (Graphic Artist), Chris (Storyteller)
- **Oversight**: Mike (CMO)

---

## Pre-Launch Checklist

### 1. Campaign Brief Review

- [ ] Campaign objective defined (Awareness/Traffic/Leads/Sales)
- [ ] Target audience documented
- [ ] Budget confirmed and approved
- [ ] Timeline/flight dates set
- [ ] Success metrics defined (ROAS, CPA, CPL targets)
- [ ] Landing page URL ready and tested

### 2. Creative Assets

- [ ] Ad copy written and approved (Chris)
- [ ] Visual assets created to spec (Pixel)
- [ ] Video assets rendered (if applicable - Spike)
- [ ] All assets match platform specifications
- [ ] Asset naming convention followed

### 3. Tracking Setup

- [ ] Pixel/Tag installed on landing page
- [ ] Conversion events configured
- [ ] UTM parameters defined
- [ ] Conversions API connected (Meta)
- [ ] Test conversions fired successfully

---

## Launch Workflow

### Phase 1: Campaign Build (Day -3)

**Adler Actions:**

1. **Create Campaign**
   - Select objective
   - Set campaign budget (if CBO)
   - Name following convention: `[Brand]-[Objective]-[Audience]-[Date]`

2. **Build Ad Sets**
   - Configure targeting (audiences, locations, demographics)
   - Set budget and schedule
   - Select placements
   - Configure optimization event

3. **Upload Ads**
   - Add creative assets
   - Input copy (Primary text, Headline, Description)
   - Set destination URL with UTMs
   - Select CTA button

4. **Quality Check**
   - Preview all placements
   - Verify mobile appearance
   - Check links work
   - Confirm tracking fires

### Phase 2: Review (Day -2)

**Drew Actions:**
- [ ] Review campaign structure
- [ ] Verify targeting makes sense
- [ ] Check budget allocation
- [ ] Approve for launch

**Mike Actions (if budget >$1,000):**
- [ ] Strategic alignment review
- [ ] Final approval

### Phase 3: Launch (Day 0)

**Adler Actions:**
1. Submit campaign for review (if required)
2. Publish/activate campaign
3. Monitor for rejection within 2 hours
4. Document launch in tracking system

---

## Post-Launch Protocol

### Day 1-3: Learning Phase

**DO:**
- Monitor for delivery issues
- Check for policy rejections
- Verify conversions tracking
- Watch for overspend

**DO NOT:**
- Edit ad sets or ads
- Change budgets
- Add/remove targeting
- Pause and restart

### Day 4-7: Early Optimization

- Review initial performance
- Identify winning/losing ad sets
- Note creative performance differences
- Document early learnings

### Week 2+: Optimization Cycle

1. **Daily (5 min)**
   - Check spend pacing
   - Flag anomalies

2. **Weekly (30 min)**
   - Performance review
   - Bid adjustments
   - Negative keywords (Search)
   - Audience exclusions

3. **Bi-Weekly (1 hour)**
   - Creative refresh assessment
   - Audience refresh
   - A/B test planning

4. **Monthly (2 hours)**
   - Full performance audit
   - Strategy review with Mike
   - Budget reallocation recommendations
   - New test planning

---

## Naming Conventions

### Campaigns
```
[Brand]-[Objective]-[Target]-[YYYYMM]
```
Example: `TIN-Sales-Retargeting-202602`

### Ad Sets
```
[Audience]-[Placement]-[Bid Strategy]
```
Example: `LAL1%-AllPlacements-MaxConv`

### Ads
```
[Creative Type]-[Angle]-[Version]
```
Example: `Video-Testimonial-V1`

### UTM Parameters
```
?utm_source=[platform]&utm_medium=paid&utm_campaign=[campaign]&utm_content=[ad]
```
Example: `?utm_source=facebook&utm_medium=paid&utm_campaign=spring-sale&utm_content=video-testimonial-v1`

---

## Budget Guidelines

| Daily Budget | Approval Level |
|-------------|----------------|
| <$50 | Drew |
| $50-$200 | Drew + Mike notification |
| $200-$500 | Mike approval |
| >$500 | Mike + CEO approval |

### Budget Changes
- Increase max 20% every 3-4 days
- Document reason for changes
- Never increase during learning phase

---

## Escalation Triggers

### Immediate Escalation to Drew
- Campaign rejected
- Spend >20% over daily budget
- ROAS <100% after 3 days
- Tracking issues detected
- Account warnings/suspensions

### Escalation to Mike
- Multiple campaign failures
- Strategic pivots needed
- Budget overruns >$500
- Policy violations
- Competitive threats detected

---

## Documentation Requirements

### Launch Documentation
- Campaign brief
- Target audience definition
- Creative assets (stored in asset library)
- Approval records

### Performance Documentation
- Weekly performance snapshots
- Optimization changes log
- A/B test results
- Learnings captured in agent learnings file

---

## Platform-Specific Notes

### Meta Ads
- Use Advantage+ audiences for prospecting
- Connect Conversions API
- Allow 7 days for learning phase
- Spec reference: `.claude/skills/marketing/platforms/meta-ads.md`

### Google Ads
- Use responsive search ads
- Enable auto-apply recommendations (selective)
- Allow learning phase before bid changes
- Spec reference: `.claude/skills/marketing/platforms/google-ads.md`

### LinkedIn Ads
- Minimum audience 50,000 for learning
- Lead gen forms outperform website conversions
- Higher CPCs expected (3-10x Meta)
- Spec reference: `.claude/skills/marketing/platforms/linkedin.md`

### YouTube Ads
- First 5 seconds critical for skippable
- Use custom thumbnails
- Target based on intent signals
- Spec reference: `.claude/skills/marketing/platforms/youtube.md`

---

## Revision History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2026-02-05 | 1.0 | Initial creation | System |
