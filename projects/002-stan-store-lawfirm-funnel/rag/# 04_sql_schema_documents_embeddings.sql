# 04_sql_schema_documents_embeddings.md

## Database: Postgres (recommended baseline)
This schema supports:
- provenance + audit
- authority ranking
- multi-index partitioning by practice area
- deterministic retrieval + rerank logging

---

## Core Types

### practice_area
- bankruptcy
- criminal_procedure
- administrative

### authority_level (descending)
- scotus
- circuit
- district
- bankruptcy_court
- agency
- statute
- rule

---

## Tables

### documents
- id (uuid, pk)
- practice_area (text, not null)
- authority_level (text, not null)
- court_code (text, not null)          -- e.g., scotus, ca5, txsb, bia
- court_name (text, not null)
- jurisdiction (text, not null)        -- "federal"
- date_published (date, not null)
- docket (text, null)
- citation (text, null)
- title (text, not null)
- source_url (text, null)
- source_sha256 (text, not null)
- normalized_sha256 (text, not null)
- precedential_weight (int, not null)  -- deterministic numeric weight
- is_binding_default (boolean, not null)
- doc_type (text, not null)            -- opinion | statute | rule
- text_body (text, not null)
- created_at (timestamptz, not null default now())

Indexes:
- (practice_area, authority_level, court_code, date_published)
- (citation)
- (docket)

---

### chunks
- id (uuid, pk)
- document_id (uuid, fk documents.id)
- practice_area (text, not null)
- chunk_version (text, not null)       -- v1
- chunk_index (int, not null)          -- order within document
- heading_path (text, null)            -- e.g. "III.B. Standard of Review"
- chunk_type (text, not null)          -- test | holding | reasoning | definition | procedural
- start_char (int, not null)
- end_char (int, not null)
- chunk_text (text, not null)
- chunk_sha256 (text, not null)
- created_at (timestamptz, not null default now())

Unique:
- (document_id, chunk_version, chunk_index)

Indexes:
- (practice_area, chunk_version)
- (document_id)

---

### embeddings
Requires pgvector extension: vector(dim)

- id (uuid, pk)
- chunk_id (uuid, fk chunks.id)
- practice_area (text, not null)
- embedding_version (text, not null)   -- v1
- model_name (text, not null)
- dims (int, not null)
- embedding (vector, not null)
- created_at (timestamptz, not null default now())

Unique:
- (chunk_id, embedding_version)

Indexes:
- ivfflat/hnsw on embedding (per practice_area, embedding_version)
- (practice_area, embedding_version)

---

### citations (optional but recommended)
Stores extracted citations to build a citation graph.

- id (uuid, pk)
- from_document_id (uuid, fk documents.id)
- from_chunk_id (uuid, fk chunks.id)
- cited_text (text, not null)
- cited_court_code (text, null)
- cited_citation (text, null)
- cited_year (int, null)
- created_at (timestamptz, not null default now())

Indexes:
- (from_document_id)
- (cited_citation)

---

### retrieval_logs (must-have for defensibility)
- id (uuid, pk)
- request_id (uuid, not null)
- user_id (text, null)
- practice_area (text, not null)
- query_text (text, not null)
- embedding_version (text, not null)
- rerank_version (text, not null)
- retrieval_k (int, not null)
- rerank_n (int, not null)
- retrieved_chunk_ids (uuid[], not null)
- retrieved_scores (float8[], not null)
- reranked_chunk_ids (uuid[], not null)
- reranked_scores (float8[], not null)
- generated_citations (text[], not null)   -- final citation strings
- model_used (text, not null)
- created_at (timestamptz, not null default now())

Indexes:
- (practice_area, created_at)
- (request_id)

---

## Precedential Weight (deterministic numeric mapping)
Example mapping (you can hardcode):
- scotus: 100
- circuit: 80
- district: 60
- bankruptcy_court: 55
- agency: 50
- statute: 95
- rule: 90

Note:
Statutes/rules outrank lower courts for "statement of governing text" queries.