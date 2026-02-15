-- Cerebro Legal RAG - Supabase Schema Setup
-- Based on: 04_sql_schema_documents_embeddings.sql
-- Run this in Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- ENUMS / TYPES
-- ============================================

-- Practice areas (closed set)
DO $$ BEGIN
    CREATE TYPE practice_area_enum AS ENUM ('bankruptcy', 'criminal_procedure', 'administrative');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Authority levels (descending order of weight)
DO $$ BEGIN
    CREATE TYPE authority_level_enum AS ENUM (
        'scotus',
        'circuit',
        'district',
        'bankruptcy_court',
        'agency',
        'statute',
        'rule'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Document types
DO $$ BEGIN
    CREATE TYPE doc_type_enum AS ENUM ('opinion', 'statute', 'rule');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Chunk types
DO $$ BEGIN
    CREATE TYPE chunk_type_enum AS ENUM ('test', 'holding', 'reasoning', 'definition', 'procedural');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- ============================================
-- TABLES
-- ============================================

-- Documents table: source files with authority metadata
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    practice_area TEXT NOT NULL,
    authority_level TEXT NOT NULL,
    court_code TEXT NOT NULL,           -- e.g., scotus, ca5, txsb, bia
    court_name TEXT NOT NULL,
    jurisdiction TEXT NOT NULL DEFAULT 'federal',
    date_published DATE NOT NULL,
    docket TEXT,
    citation TEXT,
    title TEXT NOT NULL,
    source_url TEXT,
    source_sha256 TEXT NOT NULL,
    normalized_sha256 TEXT NOT NULL,
    precedential_weight INTEGER NOT NULL,  -- deterministic numeric weight
    is_binding_default BOOLEAN NOT NULL DEFAULT true,
    doc_type TEXT NOT NULL DEFAULT 'opinion',
    text_body TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT valid_practice_area CHECK (practice_area IN ('bankruptcy', 'criminal_procedure', 'administrative')),
    CONSTRAINT valid_authority_level CHECK (authority_level IN ('scotus', 'circuit', 'district', 'bankruptcy_court', 'agency', 'statute', 'rule')),
    CONSTRAINT valid_doc_type CHECK (doc_type IN ('opinion', 'statute', 'rule'))
);

-- Chunks table: text segments with semantic type
CREATE TABLE IF NOT EXISTS chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    practice_area TEXT NOT NULL,
    chunk_version TEXT NOT NULL DEFAULT 'v1',
    chunk_index INTEGER NOT NULL,       -- order within document
    heading_path TEXT,                  -- e.g., "III.B. Standard of Review"
    chunk_type TEXT NOT NULL DEFAULT 'reasoning',
    start_char INTEGER NOT NULL,
    end_char INTEGER NOT NULL,
    chunk_text TEXT NOT NULL,
    chunk_sha256 TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT unique_chunk_in_doc UNIQUE (document_id, chunk_version, chunk_index),
    CONSTRAINT valid_chunk_type CHECK (chunk_type IN ('test', 'holding', 'reasoning', 'definition', 'procedural'))
);

-- Embeddings table: pgvector embeddings with versioning
CREATE TABLE IF NOT EXISTS embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chunk_id UUID NOT NULL REFERENCES chunks(id) ON DELETE CASCADE,
    practice_area TEXT NOT NULL,
    embedding_version TEXT NOT NULL DEFAULT 'v1',
    model_name TEXT NOT NULL DEFAULT 'text-embedding-3-large',
    dims INTEGER NOT NULL DEFAULT 3072,
    embedding vector(3072) NOT NULL,    -- OpenAI text-embedding-3-large
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT unique_embedding_version UNIQUE (chunk_id, embedding_version)
);

-- Citations table: extracted citation graph
CREATE TABLE IF NOT EXISTS citations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    from_chunk_id UUID REFERENCES chunks(id) ON DELETE SET NULL,
    cited_text TEXT NOT NULL,
    cited_court_code TEXT,
    cited_citation TEXT,
    cited_year INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Retrieval logs: full audit trail for defensibility
CREATE TABLE IF NOT EXISTS retrieval_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL,
    user_id TEXT,
    practice_area TEXT NOT NULL,
    query_text TEXT NOT NULL,
    embedding_version TEXT NOT NULL DEFAULT 'v1',
    rerank_version TEXT NOT NULL DEFAULT 'v1',
    retrieval_k INTEGER NOT NULL DEFAULT 150,
    rerank_n INTEGER NOT NULL DEFAULT 12,
    retrieved_chunk_ids UUID[] NOT NULL,
    retrieved_scores FLOAT8[] NOT NULL,
    reranked_chunk_ids UUID[] NOT NULL,
    reranked_scores FLOAT8[] NOT NULL,
    generated_citations TEXT[] NOT NULL,
    model_used TEXT NOT NULL,
    latency_ms INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Documents indexes
CREATE INDEX IF NOT EXISTS idx_documents_practice_area
    ON documents(practice_area, authority_level, court_code, date_published);
CREATE INDEX IF NOT EXISTS idx_documents_citation
    ON documents(citation);
CREATE INDEX IF NOT EXISTS idx_documents_docket
    ON documents(docket);

-- Chunks indexes
CREATE INDEX IF NOT EXISTS idx_chunks_practice_area
    ON chunks(practice_area, chunk_version);
CREATE INDEX IF NOT EXISTS idx_chunks_document
    ON chunks(document_id);

-- Embeddings indexes
CREATE INDEX IF NOT EXISTS idx_embeddings_practice_area
    ON embeddings(practice_area, embedding_version);

-- Vector similarity indexes (HNSW for fast approximate search)
-- Create separate indexes per practice area for partitioned queries
CREATE INDEX IF NOT EXISTS idx_embeddings_vector_bankruptcy
    ON embeddings USING hnsw (embedding vector_cosine_ops)
    WHERE practice_area = 'bankruptcy';

CREATE INDEX IF NOT EXISTS idx_embeddings_vector_criminal
    ON embeddings USING hnsw (embedding vector_cosine_ops)
    WHERE practice_area = 'criminal_procedure';

CREATE INDEX IF NOT EXISTS idx_embeddings_vector_admin
    ON embeddings USING hnsw (embedding vector_cosine_ops)
    WHERE practice_area = 'administrative';

-- Citations indexes
CREATE INDEX IF NOT EXISTS idx_citations_from_document
    ON citations(from_document_id);
CREATE INDEX IF NOT EXISTS idx_citations_cited
    ON citations(cited_citation);

-- Retrieval logs indexes
CREATE INDEX IF NOT EXISTS idx_retrieval_logs_practice_area_time
    ON retrieval_logs(practice_area, created_at);
CREATE INDEX IF NOT EXISTS idx_retrieval_logs_request
    ON retrieval_logs(request_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to get precedential weight from authority level
CREATE OR REPLACE FUNCTION get_precedential_weight(authority TEXT)
RETURNS INTEGER AS $$
BEGIN
    RETURN CASE authority
        WHEN 'scotus' THEN 100
        WHEN 'statute' THEN 95
        WHEN 'rule' THEN 90
        WHEN 'circuit' THEN 80
        WHEN 'district' THEN 60
        WHEN 'bankruptcy_court' THEN 55
        WHEN 'agency' THEN 50
        ELSE 40
    END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to calculate recency boost
CREATE OR REPLACE FUNCTION get_recency_boost(pub_date DATE)
RETURNS FLOAT AS $$
DECLARE
    years_old INTEGER;
BEGIN
    years_old := EXTRACT(YEAR FROM CURRENT_DATE) - EXTRACT(YEAR FROM pub_date);
    RETURN CASE
        WHEN years_old <= 10 THEN 1.00
        WHEN years_old <= 25 THEN 0.90
        ELSE 0.80
    END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Authority-aware vector search function
CREATE OR REPLACE FUNCTION search_with_authority(
    query_embedding vector(3072),
    target_practice_area TEXT,
    k INTEGER DEFAULT 150,
    embedding_ver TEXT DEFAULT 'v1'
)
RETURNS TABLE (
    chunk_id UUID,
    document_id UUID,
    chunk_text TEXT,
    citation TEXT,
    court_name TEXT,
    authority_level TEXT,
    precedential_weight INTEGER,
    date_published DATE,
    vector_score FLOAT,
    authority_boost FLOAT,
    recency_boost FLOAT,
    adjusted_score FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id AS chunk_id,
        c.document_id,
        c.chunk_text,
        d.citation,
        d.court_name,
        d.authority_level,
        d.precedential_weight,
        d.date_published,
        1 - (e.embedding <=> query_embedding) AS vector_score,
        d.precedential_weight::FLOAT / 100 AS authority_boost,
        get_recency_boost(d.date_published) AS recency_boost,
        (
            0.70 * (1 - (e.embedding <=> query_embedding)) +
            0.20 * (d.precedential_weight::FLOAT / 100) +
            0.10 * get_recency_boost(d.date_published)
        ) AS adjusted_score
    FROM embeddings e
    JOIN chunks c ON e.chunk_id = c.id
    JOIN documents d ON c.document_id = d.id
    WHERE e.practice_area = target_practice_area
      AND e.embedding_version = embedding_ver
      AND c.chunk_version = 'v1'
    ORDER BY adjusted_score DESC
    LIMIT k;
END;
$$ LANGUAGE plpgsql;

-- Validate citations function
CREATE OR REPLACE FUNCTION validate_citations(citation_texts TEXT[])
RETURNS TABLE (
    citation_text TEXT,
    is_valid BOOLEAN,
    document_id UUID
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.citation_text,
        d.id IS NOT NULL AS is_valid,
        d.id AS document_id
    FROM UNNEST(citation_texts) AS c(citation_text)
    LEFT JOIN documents d ON d.citation = c.citation_text;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ROW LEVEL SECURITY (Optional for multi-tenant)
-- ============================================

-- Enable RLS on tables (disabled for MVP, enable for production)
-- ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE chunks ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE embeddings ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE retrieval_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SAMPLE DATA VERIFICATION QUERIES
-- ============================================

-- Uncomment to verify schema after setup:
-- SELECT COUNT(*) as doc_count FROM documents;
-- SELECT COUNT(*) as chunk_count FROM chunks;
-- SELECT COUNT(*) as embedding_count FROM embeddings;
-- SELECT practice_area, COUNT(*) FROM documents GROUP BY practice_area;
