#!/usr/bin/env python3
"""
Cerebro Legal RAG - Supabase Upload Script

Uploads processed documents, chunks, and embeddings to Supabase.

Usage:
    python 04_upload_to_supabase.py --input-dir demo_data

Requirements:
    pip install supabase python-dotenv

Environment Variables:
    SUPABASE_URL - Your Supabase project URL
    SUPABASE_KEY - Your Supabase service role key
"""

import os
import json
import argparse
from typing import List, Dict, Any, Optional
from datetime import datetime
import uuid

try:
    from supabase import create_client, Client
    SUPABASE_AVAILABLE = True
except ImportError:
    SUPABASE_AVAILABLE = False
    print("Warning: supabase-py not installed. Run: pip install supabase")


def get_supabase_client() -> Optional[Client]:
    """Initialize Supabase client from environment variables"""
    if not SUPABASE_AVAILABLE:
        return None

    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")

    if not url or not key:
        print("Error: SUPABASE_URL and SUPABASE_KEY environment variables required")
        print("Set them in your .env file or export them:")
        print("  export SUPABASE_URL='https://your-project.supabase.co'")
        print("  export SUPABASE_KEY='your-service-role-key'")
        return None

    return create_client(url, key)


def upload_documents(
    client: Client,
    input_dir: str,
    practice_area: str,
    batch_size: int = 50,
) -> Dict[str, str]:
    """
    Upload documents to Supabase and return mapping of local ID to DB ID.
    """
    practice_input = os.path.join(input_dir, practice_area)
    doc_files = [f for f in os.listdir(practice_input) if f.endswith('.json') and not f.startswith('chunk')]

    id_mapping = {}  # local filename -> database UUID

    print(f"  Uploading {len(doc_files)} documents...")

    for i in range(0, len(doc_files), batch_size):
        batch_files = doc_files[i:i+batch_size]
        batch_docs = []

        for doc_file in batch_files:
            with open(os.path.join(practice_input, doc_file)) as f:
                doc = json.load(f)

            # Generate UUID for this document
            doc_id = str(uuid.uuid4())
            id_mapping[doc_file] = doc_id

            # Prepare document for insert
            batch_docs.append({
                "id": doc_id,
                "practice_area": doc["practice_area"],
                "authority_level": doc["authority_level"],
                "court_code": doc["court_code"],
                "court_name": doc["court_name"],
                "jurisdiction": doc.get("jurisdiction", "federal"),
                "date_published": doc.get("date_published", "2000-01-01"),
                "docket": doc.get("docket"),
                "citation": doc.get("citation"),
                "title": doc["title"],
                "source_url": doc.get("source_url"),
                "source_sha256": doc["source_sha256"],
                "normalized_sha256": doc["normalized_sha256"],
                "precedential_weight": doc["precedential_weight"],
                "is_binding_default": doc.get("is_binding_default", True),
                "doc_type": doc.get("doc_type", "opinion"),
                "text_body": doc["text_body"],
            })

        # Insert batch
        try:
            client.table("documents").insert(batch_docs).execute()
            print(f"    Inserted batch {i//batch_size + 1}: {len(batch_docs)} documents")
        except Exception as e:
            print(f"    Error inserting documents: {e}")

    return id_mapping


def upload_chunks(
    client: Client,
    input_dir: str,
    practice_area: str,
    doc_id_mapping: Dict[str, str],
    batch_size: int = 100,
) -> Dict[int, str]:
    """
    Upload chunks to Supabase and return mapping of chunk index to DB ID.
    """
    chunks_file = os.path.join(input_dir, "processed", practice_area, "chunks.json")
    if not os.path.exists(chunks_file):
        print(f"  No chunks file found: {chunks_file}")
        return {}

    with open(chunks_file) as f:
        chunks = json.load(f)

    chunk_id_mapping = {}  # chunk index -> database UUID

    print(f"  Uploading {len(chunks)} chunks...")

    # Group chunks by document for proper ID mapping
    # For demo, we'll assign document IDs based on chunk practice area
    # In production, you'd track the relationship properly

    # Get first document ID for this practice area (simplified for demo)
    doc_ids = list(doc_id_mapping.values())

    for i in range(0, len(chunks), batch_size):
        batch = chunks[i:i+batch_size]
        batch_records = []

        for j, chunk in enumerate(batch):
            chunk_id = str(uuid.uuid4())
            chunk_index = i + j
            chunk_id_mapping[chunk_index] = chunk_id

            # Assign to a document (simplified - round-robin for demo)
            doc_id = doc_ids[chunk_index % len(doc_ids)] if doc_ids else str(uuid.uuid4())

            batch_records.append({
                "id": chunk_id,
                "document_id": doc_id,
                "practice_area": chunk["practice_area"],
                "chunk_version": chunk.get("chunk_version", "v1"),
                "chunk_index": chunk["chunk_index"],
                "heading_path": chunk.get("heading_path"),
                "chunk_type": chunk.get("chunk_type", "reasoning"),
                "start_char": chunk["start_char"],
                "end_char": chunk["end_char"],
                "chunk_text": chunk["chunk_text"],
                "chunk_sha256": chunk["chunk_sha256"],
            })

        try:
            client.table("chunks").insert(batch_records).execute()
            print(f"    Inserted batch {i//batch_size + 1}: {len(batch_records)} chunks")
        except Exception as e:
            print(f"    Error inserting chunks: {e}")

    return chunk_id_mapping


def upload_embeddings(
    client: Client,
    input_dir: str,
    practice_area: str,
    chunk_id_mapping: Dict[int, str],
    batch_size: int = 50,
) -> int:
    """Upload embeddings to Supabase"""
    embeddings_file = os.path.join(input_dir, "processed", practice_area, "embeddings.json")
    if not os.path.exists(embeddings_file):
        print(f"  No embeddings file found: {embeddings_file}")
        return 0

    with open(embeddings_file) as f:
        embeddings = json.load(f)

    print(f"  Uploading {len(embeddings)} embeddings...")
    uploaded = 0

    for i in range(0, len(embeddings), batch_size):
        batch = embeddings[i:i+batch_size]
        batch_records = []

        for j, emb in enumerate(batch):
            chunk_idx = i + j
            chunk_id = chunk_id_mapping.get(chunk_idx)

            if not chunk_id:
                continue

            # Skip placeholder embeddings (all zeros)
            if all(v == 0.0 for v in emb["embedding"][:10]):
                continue

            batch_records.append({
                "id": str(uuid.uuid4()),
                "chunk_id": chunk_id,
                "practice_area": emb["practice_area"],
                "embedding_version": emb.get("embedding_version", "v1"),
                "model_name": emb.get("model_name", "text-embedding-3-large"),
                "dims": emb.get("dims", 3072),
                "embedding": emb["embedding"],  # Supabase handles vector type
            })

        if batch_records:
            try:
                client.table("embeddings").insert(batch_records).execute()
                uploaded += len(batch_records)
                print(f"    Inserted batch {i//batch_size + 1}: {len(batch_records)} embeddings")
            except Exception as e:
                print(f"    Error inserting embeddings: {e}")

    return uploaded


def upload_citations(
    client: Client,
    input_dir: str,
    practice_area: str,
    doc_id_mapping: Dict[str, str],
    chunk_id_mapping: Dict[int, str],
    batch_size: int = 100,
) -> int:
    """Upload citations to Supabase"""
    citations_file = os.path.join(input_dir, "processed", practice_area, "citations.json")
    if not os.path.exists(citations_file):
        print(f"  No citations file found: {citations_file}")
        return 0

    with open(citations_file) as f:
        citations = json.load(f)

    print(f"  Uploading {len(citations)} citations...")
    uploaded = 0

    # Get first document ID (simplified for demo)
    doc_ids = list(doc_id_mapping.values())
    chunk_ids = list(chunk_id_mapping.values())

    for i in range(0, len(citations), batch_size):
        batch = citations[i:i+batch_size]
        batch_records = []

        for j, cit in enumerate(batch):
            idx = i + j
            doc_id = doc_ids[idx % len(doc_ids)] if doc_ids else None
            chunk_id = chunk_ids[idx % len(chunk_ids)] if chunk_ids else None

            if not doc_id:
                continue

            batch_records.append({
                "id": str(uuid.uuid4()),
                "from_document_id": doc_id,
                "from_chunk_id": chunk_id,
                "cited_text": cit["cited_text"],
                "cited_court_code": cit.get("cited_court_code"),
                "cited_citation": cit.get("cited_citation"),
                "cited_year": cit.get("cited_year"),
            })

        if batch_records:
            try:
                client.table("citations").insert(batch_records).execute()
                uploaded += len(batch_records)
                print(f"    Inserted batch {i//batch_size + 1}: {len(batch_records)} citations")
            except Exception as e:
                print(f"    Error inserting citations: {e}")

    return uploaded


def verify_upload(client: Client) -> Dict[str, int]:
    """Verify upload by counting records in each table"""
    counts = {}

    for table in ["documents", "chunks", "embeddings", "citations"]:
        try:
            result = client.table(table).select("id", count="exact").execute()
            counts[table] = result.count if hasattr(result, 'count') else len(result.data)
        except Exception as e:
            print(f"Error counting {table}: {e}")
            counts[table] = -1

    return counts


def main():
    parser = argparse.ArgumentParser(description="Upload processed data to Supabase")
    parser.add_argument(
        "--input-dir",
        default="demo_data",
        help="Input directory with processed data",
    )
    parser.add_argument(
        "--practice-area",
        choices=["bankruptcy", "criminal_procedure", "administrative"],
        help="Upload specific practice area (default: all)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Validate data without uploading",
    )

    args = parser.parse_args()

    # Initialize client
    client = get_supabase_client()
    if not client and not args.dry_run:
        print("Cannot proceed without Supabase client")
        return

    # Determine practice areas to process
    if args.practice_area:
        practice_areas = [args.practice_area]
    else:
        practice_areas = ["bankruptcy", "criminal_procedure", "administrative"]

    # Process each practice area
    results = []
    for pa in practice_areas:
        practice_input = os.path.join(args.input_dir, pa)
        if not os.path.exists(practice_input):
            print(f"Skipping {pa}: directory not found")
            continue

        print(f"\n{'='*60}")
        print(f"Processing {pa}")
        print(f"{'='*60}")

        if args.dry_run:
            # Count files without uploading
            doc_files = [f for f in os.listdir(practice_input) if f.endswith('.json')]
            chunks_file = os.path.join(args.input_dir, "processed", pa, "chunks.json")
            chunk_count = 0
            if os.path.exists(chunks_file):
                with open(chunks_file) as f:
                    chunk_count = len(json.load(f))
            print(f"  Would upload: {len(doc_files)} documents, {chunk_count} chunks")
            continue

        # Upload documents
        doc_mapping = upload_documents(client, args.input_dir, pa)

        # Upload chunks
        chunk_mapping = upload_chunks(client, args.input_dir, pa, doc_mapping)

        # Upload embeddings
        embedding_count = upload_embeddings(client, args.input_dir, pa, chunk_mapping)

        # Upload citations
        citation_count = upload_citations(client, args.input_dir, pa, doc_mapping, chunk_mapping)

        results.append({
            "practice_area": pa,
            "documents": len(doc_mapping),
            "chunks": len(chunk_mapping),
            "embeddings": embedding_count,
            "citations": citation_count,
        })

    if not args.dry_run and client:
        # Verify upload
        print(f"\n{'='*60}")
        print("VERIFICATION")
        print(f"{'='*60}")
        counts = verify_upload(client)
        for table, count in counts.items():
            print(f"  {table}: {count} records")

    print(f"\n{'='*60}")
    print("UPLOAD COMPLETE" if not args.dry_run else "DRY RUN COMPLETE")
    print(f"{'='*60}")

    if results:
        print("\nSummary:")
        for r in results:
            print(f"  {r['practice_area']}: {r['documents']} docs, {r['chunks']} chunks, {r['embeddings']} embeddings")


if __name__ == "__main__":
    main()
