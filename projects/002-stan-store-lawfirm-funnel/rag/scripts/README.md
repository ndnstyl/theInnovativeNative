# Cerebro Legal RAG - Data Pipeline Scripts

This folder contains the data ingestion and processing pipeline for Cerebro Legal RAG.

## Prerequisites

```bash
# Python dependencies
pip install requests python-dotenv supabase openai tiktoken

# Environment variables (create .env file)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
OPENAI_API_KEY=your-openai-api-key
COURTLISTENER_API_TOKEN=your-token  # Optional, increases rate limit
```

## Pipeline Steps

### 1. Set Up Database

Run the SQL schema in your Supabase SQL Editor:

```bash
# Copy contents of this file to Supabase SQL Editor
cat 01_supabase_schema_setup.sql
```

This creates:
- `documents` - Source case law with authority metadata
- `chunks` - Text segments with semantic types
- `embeddings` - pgvector embeddings
- `citations` - Citation graph
- `retrieval_logs` - Audit trail

### 2. Ingest Case Law from CourtListener

```bash
# Fetch 500 cases for all practice areas
python 02_courtlistener_ingest.py --all --limit 500

# Or fetch for specific practice area
python 02_courtlistener_ingest.py --practice-area bankruptcy --limit 500
```

Output: `demo_data/<practice_area>/*.json`

### 3. Chunk and Embed Documents

```bash
# Process all practice areas with embeddings
python 03_chunk_and_embed.py --input-dir demo_data

# Skip embeddings for testing
python 03_chunk_and_embed.py --input-dir demo_data --no-embeddings
```

Output: `demo_data/processed/<practice_area>/`
- `chunks.json` - Document chunks
- `embeddings.json` - Vector embeddings
- `citations.json` - Extracted citations

### 4. Upload to Supabase

```bash
# Dry run to validate
python 04_upload_to_supabase.py --input-dir demo_data --dry-run

# Full upload
python 04_upload_to_supabase.py --input-dir demo_data
```

## Pipeline Summary

```
CourtListener API
       |
       v
02_courtlistener_ingest.py
       |
       v
demo_data/<practice_area>/*.json
       |
       v
03_chunk_and_embed.py
       |
       v
demo_data/processed/
  - chunks.json
  - embeddings.json
  - citations.json
       |
       v
04_upload_to_supabase.py
       |
       v
Supabase (pgvector)
```

## Estimated Times

| Step | Time (500 docs/area) |
|------|---------------------|
| Ingest | ~30 min/area |
| Chunk | ~5 min/area |
| Embed | ~15 min/area |
| Upload | ~10 min/area |

## Notes

- CourtListener has rate limits; the script includes throttling
- OpenAI embeddings cost ~$0.10 per 1000 chunks
- Supabase free tier supports pgvector
- Demo data is not production-quality; use for testing only

### 5. Run Evaluation

```bash
# Validate gold questions offline (no webhook needed)
python 05_run_evaluation.py --practice-area bankruptcy --dry-run

# Run evaluation against live webhook
export CEREBRO_WEBHOOK_URL="https://your-n8n.com/webhook/cerebro"
python 05_run_evaluation.py --all

# Evaluate single question
python 05_run_evaluation.py --question-id bk-001

# Limit number of questions per practice area
python 05_run_evaluation.py --all --limit 10
```

Output: `evaluation_reports/evaluation_<timestamp>.md` and `.json`

## Evaluation Harness

The evaluation harness (`05_run_evaluation.py`) tests against gold questions in `gold_questions/`:

- `bankruptcy_gold_questions.json` - 50 questions
- `criminal_procedure_gold_questions.json` - 50 questions
- `administrative_gold_questions.json` - 50 questions

Each question includes:
- `must_cite` - Required citations (case names, statutes)
- `must_include_elements` - Required legal test elements
- `must_not_say` - Terms that should NOT appear in response

### Release Gates

| Metric | Threshold |
|--------|-----------|
| Citation integrity | 100% |
| Element faithfulness | >= 98% |
| Exclusion compliance | 100% |

See: `../# 06_evaluation_harness.md` for full specification.

## Technical References

- Schema: `../# 04_sql_schema_documents_embeddings.sql`
- Chunking strategy: `../# 02_corpus_construction_plan.md`
- Retrieval algorithm: `../# 05_retrieval_rerank_algorithm.md`
- Evaluation harness: `../# 06_evaluation_harness.md`
- Demo scenarios: `../demo_scenarios.md`
