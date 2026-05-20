# 06_evaluation_harness.md

## Objective
Measure correctness and defensibility of the RAG system without ambiguity.

We evaluate:
1. Retrieval correctness
2. Citation correctness
3. Authority ranking correctness
4. Answer faithfulness to sources

---

## Dataset: Gold Questions (per practice area)
Build a gold set of 200 questions per practice area:

- 100 "test/rule" questions
- 50 "standard of review/procedure" questions
- 50 "edge-case / exceptions" questions

Each gold question includes:
- expected controlling authority (1–3 cases or statutes)
- required elements of the legal test (bullets)
- jurisdiction scope

Store as JSON:
- question_id
- practice_area
- query
- must_cite (array)
- must_include_elements (array)
- must_not_say (array)
- notes

---

## Metrics

### A) Retrieval @K
- Recall@50 for must_cite
- Recall@150 for must_cite
Pass criteria:
- Recall@150 >= 0.90

### B) Rerank quality
- MRR (mean reciprocal rank) for must_cite
- nDCG@12 for relevance labels
Pass criteria:
- MRR >= 0.70

### C) Citation integrity
- % of emitted citations that resolve to a known document
Pass criteria:
- 100% resolve

### D) Authority ordering correctness
For each answer:
- verify the highest-ranked citation is the highest authority available among retrieved docs
Pass criteria:
- >= 0.95

### E) Faithfulness (no hallucination)
Automated check:
- Each sentence in answer must align to at least one supporting chunk via entailment model (or strict lexical overlap baseline)
Pass criteria:
- >= 0.98

Manual audit:
- Sample 30 answers/week
- Attorney review: pass/fail on "materially misleading"
Pass criteria:
- 0 "materially misleading" allowed

---

## Test Runner (Deterministic)
For each gold question:
1. run retrieval (K=150)
2. run rerank (N=12)
3. generate answer
4. compute metrics

Persist:
- retrieved list
- reranked list
- final answer
- citations
- scores

---

## Release Gates (Hard)
Do not ship a model/version unless:
- Citation integrity = 100%
- Faithfulness >= 0.98 automated AND 0 material misleads in human sample
- Recall@150 >= 0.90 for each practice area

---

## Reporting
Generate weekly markdown reports:
- overall metrics
- per practice area metrics
- top failure modes (missing controlling case, wrong authority ordering, etc.)
- remediation actions