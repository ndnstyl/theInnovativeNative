# 05_retrieval_rerank_algorithm.md

## Objective
Deterministic, high-precision legal retrieval that:
- prioritizes binding authority
- reduces noise via rerank
- never invents citations
- produces traceable outputs

---

## Step 0: Classify practice area (hard rules)
We do not do fuzzy classification.

- If query contains: "11 U.S.C." OR "automatic stay" OR "discharge" OR "preference" OR "Chapter" → bankruptcy
- If query contains: "Miranda" OR "suppression" OR "Fourth Amendment" OR "probable cause" OR "sentencing" → criminal_procedure
- If query contains: "BIA" OR "removal" OR "asylum" OR "SSA" OR "ALJ" OR "Chevron" OR "APA" → administrative

If none match → return: "Unsupported practice area for this system."

---

## Step 1: Build query embedding
- Use embedding model E(v1)
- Normalize text (strip citations to a side-channel for BM25)

---

## Step 2: Vector retrieve (K=150)
Filter constraints:
- practice_area = selected
- embedding_version = v1
- chunk_version = v1

Retrieve top K=150 by cosine similarity (or L2, but pick one and lock it).

---

## Step 3: Authority-aware reweight (deterministic)
Compute adjusted_score:

adjusted_score =
  0.70 * vector_score
+ 0.20 * authority_boost
+ 0.10 * recency_boost

Where:
authority_boost = precedential_weight / 100

recency_boost:
- 1.00 if within last 10 years
- 0.90 if 10–25 years
- 0.80 if older

This is deterministic. No learning.

---

## Step 4: Candidate set for rerank (K' = 60)
Take top 60 by adjusted_score.

---

## Step 5: Rerank (cross-encoder) to N=12
Use reranker R(v1) (self-hosted).
Input: (query, chunk_text)
Output: relevance score

Rerank to top N=12.

---

## Step 6: Citation integrity gate (non-negotiable)
For each of top N chunks:
- Extract citations (regex + learned extractor)
- Validate citations exist in `documents` table OR are present in chunk body

If a generated citation is not found:
- it cannot be emitted in the final answer

---

## Step 7: Answer synthesis
Output format:
1. Rule / Test statement
2. Supporting holdings
3. Hierarchy summary (SCOTUS, circuit, etc.)
4. Citations list (with court + year)
5. "Verification required" line (always)

Hard constraint:
- Every substantive claim must be traceable to at least one retrieved chunk.

---

## Output policy
- If no controlling authority appears in top N:
  - state "No binding authority found in this corpus for the query as phrased."
  - provide best persuasive authority and label it.

No exceptions.