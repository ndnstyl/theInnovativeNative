# 02_corpus_construction_plan.md

## Corpus Types

We will ingest only primary law:

### 1. Judicial Opinions
- SCOTUS
- Circuit Courts
- District Courts
- Bankruptcy Courts
- Agency Adjudications

Format:
- raw opinion text
- stripped of:
  - headnotes
  - editorial summaries
  - proprietary formatting

---

### 2. Statutes
- U.S. Code (Title 11, Title 18, Title 8, Title 42)
- Administrative Procedure Act
- Sentencing Guidelines

---

### 3. Procedural Rules
- Federal Rules of Civil Procedure
- Federal Rules of Criminal Procedure
- Federal Rules of Evidence
- Federal Rules of Bankruptcy Procedure

---

## Normalization

Each document is transformed into:

- `document_id`
- `court`
- `date`
- `jurisdiction`
- `practice_area`
- `opinion_type`
- `text_body`

---

## Chunking Strategy

Chunks represent:
- legal tests
- holdings
- reasoning blocks
- statutory interpretations

Never:
- arbitrary token windows
- mid-sentence splits

---

## Embedding Strategy

Each chunk includes metadata:
- practice_area
- authority_level
- year
- court
- statute_reference

Used for:
- scoped retrieval
- reranking
- authority prioritization

---

## RAG Query Pattern

User asks legal question →

1. Determine practice area
2. Determine jurisdiction
3. Query relevant index
4. Retrieve top 100
5. Rerank to top 10
6. Generate answer with:
   - rule
   - test
   - citations
   - court hierarchy
   - uncertainty flag

---

## Excluded Content

We do not ingest:
- headnotes
- Westlaw key numbers
- Lexis summaries
- treatises
- law review commentary
- jury verdicts
- pleadings
- discovery
- settlements

Reason:
- copyright
- noise
- weak signal
- hallucination risk

---

## Ground Truth Policy

All answers must be:
- derived from retrieved text
- citation-anchored
- jurisdiction-scoped
- court-ranked

If no authority exists:
- system must say so

Never infer law.
Never extrapolate fact patterns.
Never fabricate authority.

---

## Success Criteria

The system succeeds if it can:

- Accurately state legal tests
- Retrieve controlling authority
- Distinguish procedural posture
- Explain reasoning structure
- Output clean citations

Not:
- predict outcomes
- replace lawyers
- draft briefs autonomously