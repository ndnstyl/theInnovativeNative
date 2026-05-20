# Cerebro Legal RAG - n8n Workflow Customization Spec

**Document**: n8n Workflow Customization Specification
**Author**: Neo (n8n Specialist)
**Date**: 2026-02-06
**Status**: Documentation Only - User Tests Manually

---

## Executive Summary

This document specifies the customizations required to transform the base RAG AI Agent Template V4 (Advanced) into a legal-specific RAG system for Cerebro. The template provides a solid foundation for document ingestion and RAG querying, but requires significant modifications to support:

1. **Authority-aware retrieval** per the rerank algorithm specification
2. **Legal-specific database schema** (Supabase with pgvector)
3. **Citation validation gates** to prevent hallucinated citations
4. **Practice area routing** for bankruptcy, criminal procedure, and administrative law

---

## 1. Database Schema Validation

### 1.1 Schema Comparison: Template vs. Cerebro

| Aspect | Template Schema | Cerebro Schema | Status |
|--------|-----------------|----------------|--------|
| Vector Store Table | `documents_pg` (generic) | `documents`, `chunks`, `embeddings` (3-table design) | **NEEDS CHANGE** |
| Metadata Storage | JSONB `metadata` field | Dedicated columns with constraints | **NEEDS CHANGE** |
| Embedding Model | Google Gemini (768d) | OpenAI text-embedding-3-large (3072d) | **NEEDS CHANGE** |
| Authority Tracking | None | `authority_level`, `precedential_weight` | **NEEDS ADDITION** |
| Citation Graph | None | `citations` table | **NEEDS ADDITION** |
| Audit Trail | None | `retrieval_logs` table | **NEEDS ADDITION** |

### 1.2 Schema Alignment Issues

**ISSUE 1**: Template uses single-table `documents_pg` with n8n's pgvector node.

**RESOLUTION**:
- Cerebro schema (`01_supabase_schema_setup.sql`) correctly implements the 3-table design from `04_sql_schema_documents_embeddings.sql`
- No changes needed to Cerebro schema
- n8n workflow must be modified to query `embeddings` table joined with `chunks` and `documents`

**ISSUE 2**: Template uses 768-dimension embeddings (Gemini).

**RESOLUTION**:
- Cerebro requires 3072-dimension embeddings (OpenAI text-embedding-3-large)
- Replace `Embeddings Google Gemini` nodes with OpenAI embeddings
- Vector indexes already configured for 3072 dimensions in schema

**ISSUE 3**: Missing HNSW index per practice area.

**RESOLUTION**:
- Schema correctly creates practice-area-partitioned indexes
- Verified: `idx_embeddings_vector_bankruptcy`, `idx_embeddings_vector_criminal`, `idx_embeddings_vector_admin`

### 1.3 Schema Improvements Recommended

1. **Add `latency_ms` column** to `retrieval_logs` - already present in schema (line 144)
2. **Consider adding TTL** for retrieval_logs (not in current schema)
3. **Add composite index** on `(practice_area, authority_level, date_published)` for authority-aware queries - already present (line 153-154)

**SCHEMA VERDICT**: `01_supabase_schema_setup.sql` correctly implements the design spec. No changes required.

---

## 2. Node-by-Node Customizations

### 2.1 Nodes to REPLACE

| Original Node | Replacement | Reason |
|--------------|-------------|--------|
| `Google Gemini Chat Model` | `OpenAI Chat Model` (GPT-4o) | Legal accuracy requires higher capability model |
| `Google Gemini Chat Model1` | `OpenAI Chat Model` (GPT-4o-mini) | Semantic chunking assistance |
| `Embeddings Google Gemini` | `OpenAI Embeddings` (text-embedding-3-large) | 3072d for legal semantic precision |
| `Embeddings Google Gemini1` | `OpenAI Embeddings` (text-embedding-3-large) | Consistency across pipeline |
| `Postgres PGVector Store` | **Custom HTTP Request** to Supabase | Authority-aware search function |
| `Postgres PGVector Store1` | **Keep but reconfigure** | Point to Cerebro Supabase |
| `Reranker Cohere` | **Custom Code Node** | Implement authority-aware reweighting |

### 2.2 Nodes to ADD

#### A. Practice Area Classifier Node (NEW)
**Position**: After `Edit Fields`, before `RAG AI Agent`
**Type**: `Code` node
**Purpose**: Hard-coded classification per retrieval algorithm Step 0

```javascript
// Practice Area Classification (deterministic, no fuzzy matching)
const query = $json.chatInput.toLowerCase();

let practice_area = null;

// Bankruptcy keywords
if (query.includes('11 u.s.c.') || query.includes('automatic stay') ||
    query.includes('discharge') || query.includes('preference') ||
    query.includes('chapter 7') || query.includes('chapter 11') ||
    query.includes('chapter 13')) {
  practice_area = 'bankruptcy';
}
// Criminal procedure keywords
else if (query.includes('miranda') || query.includes('suppression') ||
         query.includes('fourth amendment') || query.includes('probable cause') ||
         query.includes('sentencing')) {
  practice_area = 'criminal_procedure';
}
// Administrative law keywords
else if (query.includes('bia') || query.includes('removal') ||
         query.includes('asylum') || query.includes('ssa') ||
         query.includes('alj') || query.includes('chevron') ||
         query.includes('apa')) {
  practice_area = 'administrative';
}

if (!practice_area) {
  return [{
    json: {
      error: true,
      message: "Unsupported practice area for this system. This legal research tool supports bankruptcy, criminal procedure, and administrative law queries only.",
      chatInput: $json.chatInput,
      sessionId: $json.sessionId
    }
  }];
}

return [{
  json: {
    practice_area: practice_area,
    chatInput: $json.chatInput,
    sessionId: $json.sessionId
  }
}];
```

#### B. Authority-Aware Vector Search Node (NEW)
**Position**: Replace `Postgres PGVector Store` (retrieve mode)
**Type**: `Postgres` node (Execute Query)
**Purpose**: Call `search_with_authority` function

```sql
SELECT * FROM search_with_authority(
  $1::vector(3072),  -- query embedding
  $2,                 -- practice_area
  150,                -- k=150 per algorithm
  'v1'                -- embedding_version
)
```

**Configuration**:
- Query Replacement: `={{ $json.query_embedding }}, {{ $json.practice_area }}`

#### C. Authority-Aware Reranker Node (NEW)
**Position**: After vector search, before synthesis
**Type**: `Code` node
**Purpose**: Implement Step 3-5 of retrieval algorithm

```javascript
// Authority-Aware Reranking (deterministic, no learning)
const items = $input.all();
const currentYear = new Date().getFullYear();

// Step 3: Compute adjusted_score
const reranked = items.map(item => {
  const vector_score = item.json.vector_score;
  const precedential_weight = item.json.precedential_weight;
  const date_published = new Date(item.json.date_published);
  const years_old = currentYear - date_published.getFullYear();

  // Recency boost
  let recency_boost;
  if (years_old <= 10) recency_boost = 1.00;
  else if (years_old <= 25) recency_boost = 0.90;
  else recency_boost = 0.80;

  // Authority boost (normalized)
  const authority_boost = precedential_weight / 100;

  // Adjusted score per algorithm
  const adjusted_score =
    0.70 * vector_score +
    0.20 * authority_boost +
    0.10 * recency_boost;

  return {
    ...item.json,
    adjusted_score,
    authority_boost,
    recency_boost
  };
});

// Step 4: Take top 60 for rerank candidate set
reranked.sort((a, b) => b.adjusted_score - a.adjusted_score);
const candidates = reranked.slice(0, 60);

// Step 5: Rerank to N=12 (using adjusted_score as proxy until cross-encoder is integrated)
// NOTE: For production, integrate self-hosted cross-encoder reranker
const final_chunks = candidates.slice(0, 12);

return final_chunks.map(chunk => ({ json: chunk }));
```

#### D. Citation Validation Gate Node (NEW)
**Position**: After reranker, before synthesis
**Type**: `Postgres` node (Execute Query)
**Purpose**: Validate citations exist in corpus

```sql
SELECT * FROM validate_citations($1::text[])
```

**Configuration**:
- Extract citation strings from top N chunks
- Filter out any citation not found in `documents` table
- Critical: "If a generated citation is not found, it cannot be emitted in the final answer"

#### E. Retrieval Logging Node (NEW)
**Position**: After response generation
**Type**: `Postgres` node (Insert)
**Purpose**: Audit trail per `retrieval_logs` schema

```javascript
// Build retrieval log record
const log_record = {
  request_id: $('Edit Fields').json.sessionId || crypto.randomUUID(),
  user_id: null,  // Anonymous for now
  practice_area: $('Practice Area Classifier').json.practice_area,
  query_text: $('Edit Fields').json.chatInput,
  embedding_version: 'v1',
  rerank_version: 'v1',
  retrieval_k: 150,
  rerank_n: 12,
  retrieved_chunk_ids: $('Authority-Aware Vector Search').all().map(i => i.json.chunk_id),
  retrieved_scores: $('Authority-Aware Vector Search').all().map(i => i.json.vector_score),
  reranked_chunk_ids: $('Authority-Aware Reranker').all().map(i => i.json.chunk_id),
  reranked_scores: $('Authority-Aware Reranker').all().map(i => i.json.adjusted_score),
  generated_citations: $('Citation Validator').all().filter(c => c.json.is_valid).map(c => c.json.citation_text),
  model_used: 'gpt-4o'
};
```

### 2.3 Nodes to MODIFY

#### A. RAG AI Agent - System Prompt Update

**Current**: Generic document assistant
**Required**: Legal research assistant with strict citation requirements

```
REPLACE system prompt with:

You are a legal research assistant for Cerebro. You help attorneys research case law, statutes, and rules across bankruptcy, criminal procedure, and administrative law.

CRITICAL CONSTRAINTS:
1. NEVER invent citations. Every citation must come from retrieved chunks.
2. If no controlling authority exists, state: "No binding authority found in this corpus for the query as phrased."
3. Label persuasive vs. binding authority explicitly.
4. Include "Verification required" disclaimer on every response.

OUTPUT FORMAT:
1. Rule/Test statement
2. Supporting holdings (with citations)
3. Authority hierarchy summary (SCOTUS > Circuit > District > Bankruptcy Court > Agency)
4. Citations list (court + year)
5. "Verification required: This is AI-assisted research. Verify all citations before use."

If the practice area is unsupported, respond only with:
"This legal research tool supports bankruptcy, criminal procedure, and administrative law queries only. Please rephrase your question within these practice areas."
```

#### B. Webhook Endpoint

**Current**: Generic path `bf4dd093-bb02-472c-9454-7ab9af97bd1d`
**Required**: Semantic path for Cerebro

**New Configuration**:
- Path: `cerebro-legal-rag`
- Method: POST
- Response Mode: `responseNode` (keep)
- Add header validation for API key (optional)

#### C. Chat Trigger

**Current**: Public interface
**Required**: Add practice area guidance

Update interface labels/descriptions to clarify supported practice areas.

### 2.4 Nodes to REMOVE

| Node | Reason |
|------|--------|
| `File Created` trigger | Cerebro uses dedicated ingestion pipeline, not Google Drive |
| `File Updated` trigger | Same as above |
| `Google Drive` nodes | Not needed for Cerebro |
| `Check Every 15 Minutes` | Vector store cleanup via dedicated script |
| `Get Trashed Files via API` | Not applicable |
| All cleanup flow nodes | Handle in separate maintenance workflow |
| `Insert Table Rows` | Tabular data not in Cerebro scope |
| `Extract from Excel/CSV` | Not applicable |
| Table setup nodes | One-time setup, run via SQL |

---

## 3. Supabase Connection Configuration

### 3.1 Required Credentials

Create n8n credential: **"Supabase Cerebro"** (Postgres type)

| Parameter | Value | Notes |
|-----------|-------|-------|
| Host | `db.<project-ref>.supabase.co` | From Supabase dashboard |
| Database | `postgres` | Default |
| User | `postgres` | Or service role |
| Password | `[SERVICE_ROLE_KEY]` | From Supabase API settings |
| Port | `5432` | Default Postgres port |
| SSL | `require` | Supabase requires SSL |

### 3.2 Connection String Format

```
postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres?sslmode=require
```

### 3.3 Required Extensions

Verify in Supabase SQL Editor:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

---

## 4. Environment Variables

### 4.1 Required Environment Variables

| Variable | Purpose | Source |
|----------|---------|--------|
| `SUPABASE_URL` | Supabase project URL | Supabase Dashboard > Settings > API |
| `SUPABASE_SERVICE_KEY` | Service role key (server-side only) | Supabase Dashboard > Settings > API |
| `OPENAI_API_KEY` | Embeddings and chat completions | OpenAI Dashboard |
| `N8N_WEBHOOK_URL` | Base URL for n8n webhooks | n8n instance URL |

### 4.2 n8n Credential Configuration

Create these n8n credentials:

1. **Supabase (Postgres type)**
   - Name: `Cerebro Supabase`
   - Use connection string from 3.2

2. **OpenAI API**
   - Name: `Cerebro OpenAI`
   - API Key: `$OPENAI_API_KEY`

3. **Header Auth (optional)**
   - For webhook authentication
   - Header Name: `X-Cerebro-API-Key`
   - Header Value: Generate secure key

---

## 5. Workflow Architecture (Post-Customization)

```
                                    ┌─────────────────┐
                                    │   Chat Trigger  │
                                    │   or Webhook    │
                                    └────────┬────────┘
                                             │
                                    ┌────────▼────────┐
                                    │   Edit Fields   │
                                    │ (normalize input)│
                                    └────────┬────────┘
                                             │
                                    ┌────────▼────────┐
                                    │  Practice Area  │
                                    │   Classifier    │◄── NEW
                                    └────────┬────────┘
                                             │
                                    ┌────────▼────────┐
                                    │  OpenAI Embed   │◄── REPLACE
                                    │    (3072d)      │
                                    └────────┬────────┘
                                             │
                                    ┌────────▼────────┐
                                    │ Authority-Aware │
                                    │  Vector Search  │◄── NEW
                                    │   (Supabase)    │
                                    └────────┬────────┘
                                             │
                                    ┌────────▼────────┐
                                    │ Authority-Aware │
                                    │    Reranker     │◄── NEW
                                    │   (Code Node)   │
                                    └────────┬────────┘
                                             │
                                    ┌────────▼────────┐
                                    │   Citation      │
                                    │  Validation     │◄── NEW
                                    │     Gate        │
                                    └────────┬────────┘
                                             │
                                    ┌────────▼────────┐
                                    │   RAG Agent     │◄── MODIFY
                                    │  (GPT-4o +      │
                                    │  Legal Prompt)  │
                                    └────────┬────────┘
                                             │
                          ┌──────────────────┼──────────────────┐
                          │                  │                  │
                 ┌────────▼────────┐ ┌───────▼───────┐ ┌───────▼───────┐
                 │   Respond to    │ │  Retrieval    │ │  Postgres     │
                 │    Webhook      │ │    Logger     │ │ Chat Memory   │
                 └─────────────────┘ └───────────────┘ └───────────────┘
                                            ▲
                                            │
                                            NEW
```

---

## 6. Testing Checklist (User Manual Testing)

### 6.1 Pre-Deployment Validation

- [ ] Supabase schema deployed (`01_supabase_schema_setup.sql`)
- [ ] Test data ingested (at least 10 documents per practice area)
- [ ] n8n credentials configured
- [ ] Environment variables set

### 6.2 Functional Tests

| Test Case | Query | Expected Behavior |
|-----------|-------|-------------------|
| Bankruptcy Classification | "What is the automatic stay under 11 USC 362?" | Routes to bankruptcy, returns case law |
| Criminal Procedure | "What are Miranda requirements?" | Routes to criminal_procedure |
| Administrative Law | "How does Chevron deference work?" | Routes to administrative |
| Unsupported Area | "What are contract damages?" | Returns practice area error |
| No Results | "What is the rule for unicorn lawsuits?" | Returns "No binding authority found" |
| Citation Validation | Check response citations | All citations exist in database |

### 6.3 Performance Benchmarks

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Query latency (p50) | < 3 seconds | Check `retrieval_logs.latency_ms` |
| Query latency (p95) | < 8 seconds | Check `retrieval_logs.latency_ms` |
| Retrieval k | 150 | Verify in logs |
| Rerank n | 12 | Verify in logs |

---

## 7. Blockers and Dependencies

### 7.1 Current Blockers

| Blocker | Impact | Resolution |
|---------|--------|------------|
| No demo data | Cannot test workflow | Run ingestion pipeline first |
| Cross-encoder reranker | Using adjusted_score as proxy | Integrate self-hosted reranker (Phase 2) |
| Supabase project TBD | Cannot configure credentials | User must create project |

### 7.2 Dependencies

1. **Supabase Project**: Must be created and schema deployed
2. **OpenAI API Access**: For embeddings and GPT-4o
3. **Ingestion Pipeline**: Scripts in `law_firm_RAG/scripts/` must run first
4. **n8n Instance**: Requires Hostinger n8n with LangChain nodes

---

## 8. Future Enhancements (Out of Scope)

1. **Self-hosted cross-encoder reranker** (replace adjusted_score proxy)
2. **Multi-turn conversation context** (reference prior citations)
3. **Shepardizing integration** (check if cases are still good law)
4. **Document upload endpoint** (add new cases to corpus)
5. **Analytics dashboard** (query patterns, citation frequency)

---

## Appendix A: Original Template Node Map

```
CHAT INTERFACE SECTION:
- When chat message received (Chat Trigger)
- Webhook (POST)
- Edit Fields (normalize chatInput/sessionId)
- RAG AI Agent (LangChain Agent)
- Respond to Webhook

AGENT TOOLS:
- Postgres PGVector Store (RAG lookup)
- Reranker Cohere (rerank results)
- List Documents (document_metadata query)
- Get File Contents (fetch full doc)
- Query Document Rows (SQL for tabular)

MEMORY:
- Postgres Chat Memory

MODELS:
- Google Gemini Chat Model (agent LLM)
- Embeddings Google Gemini (vector embeddings)

DOCUMENT INGESTION:
- File Created/Updated triggers
- Set File ID
- Delete Old Data Rows/Doc Rows
- Insert Document Metadata
- Switch (by file type)
- Extract PDF/Document/Excel/CSV
- LangChain Code (semantic chunking)
- Postgres PGVector Store1 (insert mode)

CLEANUP:
- Check Every 15 Minutes
- Get Trashed Files via API
- Parse/Filter/Delete trashed docs
```

---

## Appendix B: Key File References

| File | Purpose |
|------|---------|
| `/Users/makwa/theinnovativenative/law_firm_RAG/scripts/01_supabase_schema_setup.sql` | Database schema (validated) |
| `/Users/makwa/theinnovativenative/law_firm_RAG/# 04_sql_schema_documents_embeddings.sql` | Schema design spec |
| `/Users/makwa/theinnovativenative/law_firm_RAG/# 05_retrieval_rerank_algorithm.md` | Retrieval algorithm spec |
| `/Users/makwa/theinnovativenative/law_firm_RAG/RAG AI Agent Template V4 (Advanced) (cerebro).json` | Base n8n template |
| `/Users/makwa/theinnovativenative/law_firm_RAG/scripts/README.md` | Pipeline documentation |

---

**Document Version**: 1.0
**Next Review**: After Supabase project creation and initial data ingestion
