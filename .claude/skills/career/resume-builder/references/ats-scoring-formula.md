# ATS Match Scoring Formula

Transparent. No black-box. Adapted from olegvg/resume-tailor-plugin.

## Formula

```
score = 0.40 × required_match_rate
      + 0.20 × nice_to_have_match_rate
      + 0.20 × quantification_rate
      + 0.10 × section_completeness
      + 0.10 × keyword_distribution
```

Range: 0.00 to 1.00.

## Component definitions

### required_match_rate (weight 0.40)
```
required_matched / required_total
```
Where `required_total` = count of must-have skills/keywords/qualifications extracted from the JD. `required_matched` = count present in the tailored resume (exact match OR documented synonym).

Synonyms count only if the master CV has explicit evidence (e.g., "Django" matches a JD's "Python web framework" requirement only because master CV proves Django experience).

### nice_to_have_match_rate (weight 0.20)
```
nice_matched / nice_total
```
Nice-to-haves are skills the JD mentions as "preferred," "bonus," or "plus." Not required for score floor.

### quantification_rate (weight 0.20)
```
bullets_with_metric / total_relevant_bullets
```
A bullet "has a metric" if it includes any of: a number (5+, $2M, 50K users, 99.9%), a duration (Q2 2024, in 6 weeks), or a scale (team of 12, across 3 regions). "Improved performance" without a number doesn't count.

Target: ≥ 0.70.

### section_completeness (weight 0.10)
```
sections_present / sections_expected
```
Expected sections (US default): Contact, Summary, Skills, Experience, Education. Tech roles add Projects (for early career) or GitHub link (in Contact).

Missing any one = 0.80. Missing two = 0.60. Etc.

### keyword_distribution (weight 0.10)
```
1.0 - (max_keyword_concentration_in_any_section - 0.40)
```
Penalty if any single section holds more than 40% of all critical keyword mentions. This catches "Skills section dump" cases where the resume technically has the keywords but only in one place.

Floor: 0.00 (clipped at zero).

## Thresholds

| Score | Action |
|-------|--------|
| ≥ 0.85 | Submit. Strong match. |
| 0.75 – 0.84 | Submit. Standard tailoring done. |
| 0.60 – 0.74 | Submit only if other signals strong (referral, brand fit). Consider one more pass. |
| 0.40 – 0.59 | Don't submit as-is. Either find more applicable CARs in master, OR walk away. |
| < 0.40 | Don't submit. Role is not a match. |

## What the score does NOT measure
- Cultural fit
- Compensation alignment
- Likelihood of getting interviewed (depends on volume of applicants, referrals, network)
- Quality of writing (use the 5-persona critique for that)

The score is a necessary-not-sufficient check. A 0.95 with a terrible cover letter still loses.
