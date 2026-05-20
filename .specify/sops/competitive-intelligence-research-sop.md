# Competitive Intelligence Research SOP

**Owner**: Maya (Ideation)
**Last Updated**: 2026-02-06
**Project**: Cerebro Legal RAG

## Purpose

Standardize methodology for gathering competitive intelligence from organic sources for the Cerebro legal AI product. Focuses on mid-market law firms (50-500 attorneys) and bankruptcy/federal criminal practice areas.

## Scope

- **Competitors**: Harvey AI, Lexis+ AI, Westlaw Precision, Casetext CoCounsel, Spellbook, Luminance, Paxton AI
- **Practice Areas**: Bankruptcy and Federal Criminal only
- **Data Sources**: Organic only (no paid databases)

## Research Methodology

### Step 1: Define Search Terms

For each competitor, create search term matrix:

| Competitor | Primary Terms | Pain Point Modifiers |
|------------|--------------|---------------------|
| Harvey AI | "Harvey AI", "Harvey legal", "Harvey hallucinations" | frustrated, disappointed, switched, hate, love, problems, issues, inaccurate |
| Lexis+ AI | "Lexis+ AI", "Lexis AI", "Lexis artificial intelligence" | expensive, lock-in, learning curve, clunky, slow |
| Casetext | "Casetext", "CoCounsel", "Casetext AI" | limited, narrow, integration, accuracy |

### Step 2: Mine Review Sites (G2, Capterra)

**Target**: 1-3 star reviews (pain points live here)

**Process**:
1. Navigate to G2.com and search competitor name
2. Filter to 1-3 star reviews
3. For each review, extract:
   - Reviewer role (if available)
   - Company size
   - Verbatim quote (copy exactly)
   - Pain point category (see categories below)
   - Review date
   - URL

**Pain Point Categories**:
- ACCURACY: Hallucinations, wrong citations, incorrect legal analysis
- COST: Too expensive, hidden fees, ROI concerns
- INTEGRATION: Doesn't work with existing tools, data silos
- USABILITY: Hard to learn, confusing UI, poor UX
- SUPPORT: Bad customer service, slow response
- FEATURES: Missing capabilities, limited use cases
- SECURITY: Data privacy concerns, confidentiality
- PERFORMANCE: Slow, unreliable, downtime

### Step 3: Search Industry Publications

**Priority Sources** (in order):

1. **Above the Law** (comments) - abovethelaw.com
   - Search: `site:abovethelaw.com "[competitor name]"`
   - Mine article comments (often more candid than articles)
   - Focus on threads about AI adoption, tool complaints

2. **Law.com / ALM** - law.com
   - Search for competitor reviews and comparisons
   - Note analyst perspectives on weaknesses

3. **Legal IT Insider** - legaltechnology.com
   - UK/global perspective
   - Trend coverage and adoption stories

4. **Artificial Lawyer** - artificiallawyer.com
   - Deep dives on legal AI
   - Competitor feature comparisons

### Step 4: Search Reddit

**Target Subreddits**:
- r/lawyers
- r/biglaw
- r/lawfirm
- r/paralegal
- r/Bankruptcy (yes, it exists)

**Search Pattern**:
`[competitor name] + [pain modifier]`

Example searches:
- "Harvey AI frustrated"
- "Lexis+ expensive"
- "CoCounsel inaccurate"
- "legal AI hallucination"

**Extraction**:
- Copy post/comment verbatim
- Note upvote count (signal of agreement)
- Capture thread URL
- Note user flair if shows role/firm size

### Step 5: Practice Area Filtering

For bankruptcy and federal criminal focus:

**Bankruptcy-specific searches**:
- "[competitor] bankruptcy"
- "[competitor] chapter 11"
- "[competitor] 363 sale"
- "[competitor] proof of claim"
- "bankruptcy AI research"

**Federal Criminal-specific searches**:
- "[competitor] criminal defense"
- "[competitor] AUSA"
- "[competitor] federal court"
- "[competitor] 4th amendment" / "5th amendment" / "6th amendment"
- "criminal law AI research"

### Step 6: Document in Airtable

**Table**: Competitor Pain Points

**Required Fields**:
| Field | Type | Description |
|-------|------|-------------|
| Competitor | Single Select | Harvey AI, Lexis+ AI, Casetext, etc. |
| Pain Point | Long Text | One-sentence summary |
| Category | Single Select | ACCURACY, COST, INTEGRATION, etc. |
| Verbatim Quote | Long Text | Exact words from source |
| Source | Single Select | G2, Capterra, ATL, Reddit, Law.com |
| Source URL | URL | Direct link to source |
| Source Date | Date | When review/post was created |
| Practice Area | Single Select | Bankruptcy, Criminal, General |
| Reviewer Role | Single Select | Partner, Associate, Paralegal, Unknown |
| Firm Size | Single Select | Solo, Small (2-10), Mid (50-500), BigLaw (500+), Unknown |
| Evidence Quality | Single Select | High, Medium, Low |
| Usable for Copy | Checkbox | Is quote clean enough for ad copy? |

**Evidence Quality Criteria**:
- **High**: Verified user (G2/Capterra), specific detail, recent (< 6 months)
- **Medium**: Anonymous but detailed, older than 6 months, from known lawyer
- **Low**: Vague, old, unverified source

### Step 7: Quality Validation

Before marking research complete:

- [ ] Minimum 10-15 pain points per competitor (Week 1 scope)
- [ ] At least 3 HIGH quality evidence items per competitor
- [ ] At least 2 bankruptcy-specific items per competitor
- [ ] At least 2 criminal-specific items per competitor
- [ ] All quotes have valid source URLs
- [ ] Categories distributed (not all same type)

## Output Format

### Pain Point Snapshot (Week 1 Deliverable)

```markdown
## Competitor: [Name]

### Top Pain Points

1. **[Category]**: [One-sentence summary]
   > "[Verbatim quote]"
   - Source: [G2/Capterra/ATL/Reddit]
   - Role: [Partner/Associate/Paralegal]
   - Relevance: [Bankruptcy/Criminal/General]

2. ...

### Cerebro Differentiation Opportunity
[Based on these pain points, how can Cerebro position against this competitor?]
```

## Gotchas

1. **LinkedIn is low value** - Lawyers curate their posts, candid feedback lives elsewhere
2. **Some competitors have sparse reviews** - Supplement with news coverage
3. **Bankruptcy-specific feedback is rare** - May need to extrapolate from general legal AI complaints
4. **Don't conflate competitors** - Harvey problems ≠ Lexis problems, research separately
5. **Check review dates** - AI landscape changes fast, prioritize recent feedback

## Ethical Boundaries

- Only use publicly available information
- No scraping that violates TOS
- No impersonation or fake accounts
- Frame as "market research" not "scraping"
- Cerebro is a legal product - optics matter

## Related Documents

- `.specify/sops/persona-validation-sop.md` - For validating personas from this research
- `.claude/skills/workers/maya-ideation/SKILL.md` - Maya's capabilities
- `.specify/memory/learnings/maya-learnings.md` - Post-research learnings

## Version History

| Date | Change | Author |
|------|--------|--------|
| 2026-02-06 | Initial creation for Cerebro project | Drew (from plan) |
