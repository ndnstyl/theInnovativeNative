# Persona Validation SOP

**Owner**: Maya (Ideation) + Mike (CMO)
**Last Updated**: 2026-02-06
**Project**: Cerebro Legal RAG

## Purpose

Validate persona hypotheses with real-world evidence before using them for campaign targeting and content creation. Ensures marketing investments target actual market segments, not assumptions.

## Validation Threshold

**Each persona requires 3+ independent evidence points to be considered validated.**

Evidence must come from at least 2 different source types (e.g., review site + forum post).

## Cerebro Target Personas

| Persona ID | Name | Profile | AI Stage | Practice Area |
|------------|------|---------|----------|---------------|
| P1 | The Burned Bankruptcy Associate | Tried Harvey for 363 sale research, cited non-existent case | Burned | Bankruptcy |
| P2 | The Chapter 7 Mill Partner | High volume, needs speed, skeptical of AI cost | Skeptical | Bankruptcy |
| P3 | The Federal Criminal PD | Public defender, resource-constrained | Interested | Criminal |
| P4 | The AUSA (Prosecutor) | Needs reliable precedent, can't afford hallucinations | Cautious | Criminal |
| P5 | The Bankruptcy Paralegal Power User | Does 80% of research, wants tools that work | Experienced | Bankruptcy |
| P6 | The Criminal Defense Solo | One-person shop, wears all hats | Overwhelmed | Criminal |

## Evidence Types

### Primary Evidence (Weighted 1.0)
- Direct quotes from verified review sites (G2, Capterra)
- Detailed forum posts describing the persona's exact situation
- Industry survey data with demographic breakdown
- Quotes from legal publications with role identification

### Secondary Evidence (Weighted 0.5)
- Anonymous Reddit posts matching persona profile
- LinkedIn posts from verified attorneys
- Conference presentation mentions
- General industry commentary

### Tertiary Evidence (Weighted 0.25)
- Implied pain points from competitor marketing
- General market research without legal focus
- Old data (> 12 months)

**Validation threshold**: 3.0 points minimum (e.g., 3 primary, or 2 primary + 2 secondary)

## Validation Checklist Per Persona

### Required Validations

- [ ] **Pain Point Confirmation** (3+ evidence points)
  - The core pain point actually exists in the market
  - Evidence shows real people experiencing this pain

- [ ] **Demographic Consistency**
  - Role matches (Partner/Associate/Paralegal)
  - Firm size matches (Solo/Small/Mid/BigLaw)
  - Practice area matches (Bankruptcy/Criminal)

- [ ] **AI Adoption Stage Confirmation**
  - Evidence supports the described stage (Burned/Skeptical/Interested/Cautious/Experienced/Overwhelmed)
  - Quotes reflect the emotional state

- [ ] **Practice Area Alignment**
  - Pain points are specific to bankruptcy or criminal work
  - Not just generic legal AI complaints

- [ ] **Reachability Confirmation** (from Mike)
  - Can we target this persona via our channels?
  - Campaign data supports engagement

## Validation Process

### Step 1: Gather Evidence from Research

Pull relevant pain points from Airtable "Competitor Pain Points" table:

```
Filter: Practice Area = [persona's practice area]
        AND Reviewer Role = [persona's role]
        AND Category = [relevant categories]
```

### Step 2: Map Evidence to Persona

For each evidence item:
1. Does it match the persona's profile?
2. Does it confirm the stated pain point?
3. Is the source credible?
4. Weight the evidence (1.0 / 0.5 / 0.25)

### Step 3: Calculate Validation Score

Sum weighted evidence points:
- 3.0+ = VALIDATED
- 2.0-2.9 = PARTIALLY VALIDATED (needs more evidence)
- < 2.0 = NOT VALIDATED (reconsider persona)

### Step 4: Document in Airtable

**Table**: Cerebro Personas

**Required Fields**:
| Field | Type | Description |
|-------|------|-------------|
| Persona ID | Autonumber | P1, P2, etc. |
| Persona Name | Single Line Text | e.g., "The Burned Bankruptcy Associate" |
| Profile | Long Text | Detailed description |
| AI Stage | Single Select | Burned, Skeptical, Interested, Cautious, Experienced, Overwhelmed |
| Pain Level | Single Select | HIGH, MEDIUM, LOW |
| Practice Area | Single Select | Bankruptcy, Criminal |
| Role | Single Select | Partner, Associate, Paralegal, Solo |
| Cerebro Angle | Long Text | How Cerebro solves their problem |
| Evidence Points | Number | Weighted sum |
| Validation Status | Single Select | VALIDATED, PARTIALLY VALIDATED, NOT VALIDATED |
| Evidence Summary | Long Text | Links to supporting pain points |
| Campaign Data Support | Checkbox | Mike confirmed targeting viability |

### Step 5: Mike Validation (Campaign Data Check)

For VALIDATED personas, Mike reviews:
- [ ] Do we have targeting options for this segment?
- [ ] Historical engagement data (if any)?
- [ ] Estimated audience size?
- [ ] Cost per acquisition estimate?

Mike marks `Campaign Data Support = TRUE` if viable.

## Persona Evidence Template

```markdown
## Persona: [Name]

### Hypothesis
- **Profile**: [Description]
- **AI Stage**: [Stage]
- **Core Pain Point**: [What frustrates them]
- **Cerebro Solution**: [How we help]

### Evidence Collected

#### Evidence 1 (Weight: X.X)
- **Source**: [G2/Reddit/ATL/etc.]
- **Date**: [Date]
- **Quote**: "[Verbatim quote]"
- **Match Score**: [Why this confirms the persona]

#### Evidence 2 (Weight: X.X)
...

### Validation Score
Total: X.X / 3.0 threshold
Status: [VALIDATED / PARTIALLY VALIDATED / NOT VALIDATED]

### Gaps
- [What additional evidence would strengthen validation?]

### Campaign Viability (Mike)
- Targeting: [Available/Limited/None]
- Audience Size: [Estimate]
- Recommendation: [Target/Skip/Test]
```

## Persona Refinement

If persona NOT VALIDATED:
1. Check if the pain point exists at all
2. Check if we have the wrong demographic
3. Consider merging with another persona
4. Consider splitting into sub-personas
5. Mark as "ARCHIVED" if no market signal

If PARTIALLY VALIDATED:
1. Identify specific evidence gaps
2. Create targeted research tasks
3. Set deadline for re-evaluation

## Output: Validated Persona Card

Final deliverable format for Chris (content creation):

```markdown
# [Persona Name]

**One-liner**: [Elevator pitch for who this is]

**Demographics**:
- Role: [Partner/Associate/Paralegal]
- Firm Size: [Solo/Small/Mid/BigLaw]
- Practice Area: [Bankruptcy/Criminal]

**AI Journey Stage**: [Stage]

**Core Pain Point**: [The main frustration]

**Supporting Evidence**:
1. "[Quote 1]" - [Source]
2. "[Quote 2]" - [Source]
3. "[Quote 3]" - [Source]

**Emotional State**: [How they feel about current tools]

**Cerebro Pitch**: [2-3 sentences on how Cerebro solves this]

**Message Themes**:
- [Theme 1]
- [Theme 2]
- [Theme 3]

**Content Opportunities**:
- [Blog/video/case study ideas]
```

## Related Documents

- `.specify/sops/competitive-intelligence-research-sop.md` - Source of evidence
- `.claude/skills/workers/maya-ideation/SKILL.md` - Maya's research capabilities
- `.claude/skills/staff/mike-cmo/SKILL.md` - Mike's validation role

## Version History

| Date | Change | Author |
|------|--------|--------|
| 2026-02-06 | Initial creation for Cerebro project | Drew (from plan) |
