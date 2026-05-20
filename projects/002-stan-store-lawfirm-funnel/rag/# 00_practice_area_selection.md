# 00_practice_area_selection.md

## Selected Practice Areas (Final)

We will build the RAG system for:

1. **Federal Bankruptcy Law**
2. **Federal Criminal Procedure & Constitutional Criminal Law**
3. **Federal Administrative Law (Immigration + SSA + Agency Adjudication)**

These are selected because:

- Judicial opinions are overwhelmingly public domain
- High volume of written rulings
- Issues repeat across cases
- Law is rule-driven, not fact-driven
- Outcomes depend on doctrinal tests, not jury sympathy
- Corpus can be made comprehensive without licensing Westlaw/Lexis

---

## Bankruptcy Law (Primary Target)

Includes:
- Title 11 (U.S. Bankruptcy Code)
- Federal Rules of Bankruptcy Procedure
- Bankruptcy court opinions
- District court appeals
- Circuit court opinions

Dominant legal questions:
- Dischargeability
- Automatic stay
- Preferences and fraudulent transfers
- Plan confirmation
- Exemptions
- Jurisdiction and venue
- Sanctions and contempt

Why it is ideal:
- Highly procedural
- High opinion density
- Repetitive issue structure
- Strong citation chains
- Federalized and standardized

This will be the anchor corpus.

---

## Criminal Law (Procedural & Constitutional Only)

Includes:
- Fourth Amendment (search/seizure)
- Fifth Amendment (self-incrimination, Miranda)
- Sixth Amendment (counsel, confrontation)
- Sentencing
- Suppression motions
- Habeas corpus (procedural rulings)

Excludes:
- Trial fact analysis
- Jury verdict patterns
- Evidence narratives

Why it is ideal:
- Huge volume of appellate opinions
- Heavy doctrinal analysis
- Repeatable legal tests
- Public availability
- High practical value for motion practice

---

## Administrative Law (Agency Adjudication)

Includes:
- Immigration (BIA, Circuit review)
- Social Security disability
- NLRB
- Veterans appeals
- EPA and regulatory adjudication

Includes:
- Agency opinions
- Federal appellate review
- APA doctrine

Why it is ideal:
- Massive decision volume
- Highly formulaic legal tests
- Repetitive eligibility and procedural rules
- Public availability
- Structured reasoning

---

## Excluded Areas (Explicit)

We will not build for:

- Personal injury
- Tort damages
- Employment
- Contract drafting
- Corporate law
- Family law

Reason:
These require:
- Discovery
- Medical evidence
- Settlement data
- Proprietary treatises
- Jury verdict analysis

Public law alone is insufficient.

---

## Objective

Build a RAG system that can:

- Retrieve controlling law
- Surface doctrinal tests
- Cite binding authority
- Distinguish jurisdiction
- Provide structured legal reasoning

Not:
- Predict verdicts
- Replace counsel
- Draft final pleadings
- Simulate judgment

This is a legal research engine, not a lawyer.