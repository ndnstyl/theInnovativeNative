#!/usr/bin/env python3
"""
Cerebro Legal RAG - Chunking and Embedding Script

Processes downloaded case law documents:
1. Chunks documents into semantic units (tests, holdings, reasoning)
2. Generates embeddings using OpenAI text-embedding-3-large
3. Extracts citations for the citation graph

Based on: 02_corpus_construction_plan.md

Usage:
    python 03_chunk_and_embed.py --input-dir demo_data --output-dir demo_data/processed

Requirements:
    pip install openai tiktoken
"""

import os
import json
import hashlib
import argparse
import re
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass, asdict
import tiktoken

# Optional: OpenAI for embeddings
try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    print("Warning: OpenAI not installed. Embeddings will be skipped.")

# Configuration
EMBEDDING_MODEL = "text-embedding-3-large"
EMBEDDING_DIMS = 3072
MAX_CHUNK_TOKENS = 512
OVERLAP_TOKENS = 50
CHUNK_VERSION = "v1"


@dataclass
class Chunk:
    """Chunk record for database insertion"""
    document_id: str  # Will be set after document insert
    practice_area: str
    chunk_version: str
    chunk_index: int
    heading_path: Optional[str]
    chunk_type: str  # test, holding, reasoning, definition, procedural
    start_char: int
    end_char: int
    chunk_text: str
    chunk_sha256: str


@dataclass
class Embedding:
    """Embedding record for database insertion"""
    chunk_id: str  # Will be set after chunk insert
    practice_area: str
    embedding_version: str
    model_name: str
    dims: int
    embedding: List[float]


@dataclass
class Citation:
    """Citation reference extracted from text"""
    cited_text: str
    cited_court_code: Optional[str]
    cited_citation: Optional[str]
    cited_year: Optional[int]


# Legal citation patterns
CITATION_PATTERNS = [
    # U.S. Reports (Supreme Court)
    r'(\d+)\s+U\.?\s?S\.?\s+(\d+)',
    # Federal Reporter
    r'(\d+)\s+F\.?\s?(2d|3d|4th)?\s+(\d+)',
    # Federal Supplement
    r'(\d+)\s+F\.?\s?Supp\.?\s?(2d|3d)?\s+(\d+)',
    # Bankruptcy Reporter
    r'(\d+)\s+B\.?\s?R\.?\s+(\d+)',
    # U.S. Code
    r'(\d+)\s+U\.?\s?S\.?\s?C\.?\s+[§]?\s*(\d+)',
    # CFR
    r'(\d+)\s+C\.?\s?F\.?\s?R\.?\s+[§]?\s*(\d+)',
]

# Chunk type indicators
CHUNK_TYPE_PATTERNS = {
    'test': [
        r'\btest\b.*\bis\b',
        r'\brequires?\b.*\bshowing\b',
        r'\bstandard\b.*\breview\b',
        r'\belements?\b.*\bare\b',
        r'\bmust\s+prove\b',
        r'\bburden\b.*\bproof\b',
    ],
    'holding': [
        r'\bwe\s+hold\b',
        r'\bholding\b',
        r'\bconclude\b',
        r'\baffirm\b',
        r'\breverse\b',
        r'\bremand\b',
    ],
    'definition': [
        r'\bmeans\b',
        r'\bdefined\s+as\b',
        r'\brefers\s+to\b',
        r'\bconstitutes\b',
    ],
    'procedural': [
        r'\bappeal\b',
        r'\bmotion\b',
        r'\bfiled\b',
        r'\bgranted\b',
        r'\bdenied\b',
        r'\bstandard\s+of\s+review\b',
    ],
}


def get_tokenizer():
    """Get tiktoken tokenizer for token counting"""
    return tiktoken.get_encoding("cl100k_base")


def count_tokens(text: str, tokenizer) -> int:
    """Count tokens in text"""
    return len(tokenizer.encode(text))


def extract_citations(text: str) -> List[Citation]:
    """Extract legal citations from text"""
    citations = []
    seen = set()

    for pattern in CITATION_PATTERNS:
        for match in re.finditer(pattern, text, re.IGNORECASE):
            cited_text = match.group(0)
            if cited_text in seen:
                continue
            seen.add(cited_text)

            # Try to extract year from surrounding context
            year = None
            year_match = re.search(r'\((\d{4})\)', text[max(0, match.start()-50):match.end()+50])
            if year_match:
                year = int(year_match.group(1))

            citations.append(Citation(
                cited_text=cited_text,
                cited_court_code=None,  # Would need more parsing
                cited_citation=cited_text,
                cited_year=year,
            ))

    return citations


def classify_chunk_type(text: str) -> str:
    """Classify chunk type based on content patterns"""
    text_lower = text.lower()

    for chunk_type, patterns in CHUNK_TYPE_PATTERNS.items():
        for pattern in patterns:
            if re.search(pattern, text_lower):
                return chunk_type

    return 'reasoning'  # Default


def find_section_boundaries(text: str) -> List[Tuple[int, int, Optional[str]]]:
    """
    Find semantic section boundaries in legal text.
    Returns list of (start, end, heading) tuples.
    """
    boundaries = []

    # Look for section markers
    section_patterns = [
        r'^(I{1,3}V?|V?I{1,3})\.\s+([A-Z][^.\n]+)',  # Roman numerals: I., II., etc.
        r'^([A-D])\.\s+([A-Z][^.\n]+)',  # Letter sections: A., B., etc.
        r'^(\d+)\.\s+([A-Z][^.\n]+)',  # Numbered sections
        r'\n(BACKGROUND|FACTS|ANALYSIS|DISCUSSION|CONCLUSION|STANDARD OF REVIEW)\n',  # Headers
    ]

    # Find all section markers
    markers = []
    for pattern in section_patterns:
        for match in re.finditer(pattern, text, re.MULTILINE):
            markers.append((match.start(), match.group(0).strip()))

    # Sort by position
    markers.sort(key=lambda x: x[0])

    # Create boundaries
    if not markers:
        # No sections found - treat whole text as one section
        return [(0, len(text), None)]

    for i, (start, heading) in enumerate(markers):
        end = markers[i + 1][0] if i + 1 < len(markers) else len(text)
        boundaries.append((start, end, heading))

    return boundaries


def chunk_document(
    document: Dict[str, Any],
    tokenizer,
    max_tokens: int = MAX_CHUNK_TOKENS,
    overlap_tokens: int = OVERLAP_TOKENS,
) -> List[Chunk]:
    """
    Chunk a document into semantic units.

    Strategy:
    1. Find section boundaries
    2. Within each section, split at sentence boundaries
    3. Ensure chunks don't exceed max_tokens
    4. Add overlap for context continuity
    """
    text = document.get('text_body', '')
    if not text:
        return []

    practice_area = document.get('practice_area', 'unknown')
    chunks = []
    chunk_index = 0

    # Find sections
    sections = find_section_boundaries(text)

    for section_start, section_end, heading in sections:
        section_text = text[section_start:section_end]
        if not section_text.strip():
            continue

        # Split into sentences
        sentences = re.split(r'(?<=[.!?])\s+', section_text)

        current_chunk = ""
        current_start = section_start

        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence:
                continue

            # Check if adding this sentence exceeds limit
            test_chunk = current_chunk + " " + sentence if current_chunk else sentence
            if count_tokens(test_chunk, tokenizer) > max_tokens and current_chunk:
                # Save current chunk
                chunk_end = current_start + len(current_chunk)
                chunk_type = classify_chunk_type(current_chunk)

                chunks.append(Chunk(
                    document_id="",  # Set later
                    practice_area=practice_area,
                    chunk_version=CHUNK_VERSION,
                    chunk_index=chunk_index,
                    heading_path=heading,
                    chunk_type=chunk_type,
                    start_char=current_start,
                    end_char=chunk_end,
                    chunk_text=current_chunk.strip(),
                    chunk_sha256=hashlib.sha256(current_chunk.encode()).hexdigest(),
                ))
                chunk_index += 1

                # Start new chunk with overlap
                overlap_text = current_chunk[-overlap_tokens*4:] if overlap_tokens else ""  # Rough char estimate
                current_chunk = overlap_text + " " + sentence if overlap_text else sentence
                current_start = chunk_end - len(overlap_text)
            else:
                current_chunk = test_chunk

        # Save final chunk in section
        if current_chunk.strip():
            chunk_type = classify_chunk_type(current_chunk)
            chunks.append(Chunk(
                document_id="",
                practice_area=practice_area,
                chunk_version=CHUNK_VERSION,
                chunk_index=chunk_index,
                heading_path=heading,
                chunk_type=chunk_type,
                start_char=current_start,
                end_char=section_end,
                chunk_text=current_chunk.strip(),
                chunk_sha256=hashlib.sha256(current_chunk.encode()).hexdigest(),
            ))
            chunk_index += 1

    return chunks


def generate_embeddings(
    chunks: List[Chunk],
    client,
    model: str = EMBEDDING_MODEL,
    batch_size: int = 100,
) -> List[Embedding]:
    """Generate embeddings for chunks using OpenAI API"""
    embeddings = []

    for i in range(0, len(chunks), batch_size):
        batch = chunks[i:i+batch_size]
        texts = [c.chunk_text for c in batch]

        try:
            response = client.embeddings.create(
                model=model,
                input=texts,
                dimensions=EMBEDDING_DIMS,
            )

            for j, chunk in enumerate(batch):
                embeddings.append(Embedding(
                    chunk_id="",  # Set later
                    practice_area=chunk.practice_area,
                    embedding_version=CHUNK_VERSION,
                    model_name=model,
                    dims=EMBEDDING_DIMS,
                    embedding=response.data[j].embedding,
                ))

            print(f"  Embedded batch {i//batch_size + 1}: {len(batch)} chunks")

        except Exception as e:
            print(f"Error generating embeddings: {e}")
            # Create placeholder embeddings
            for chunk in batch:
                embeddings.append(Embedding(
                    chunk_id="",
                    practice_area=chunk.practice_area,
                    embedding_version=CHUNK_VERSION,
                    model_name=model,
                    dims=EMBEDDING_DIMS,
                    embedding=[0.0] * EMBEDDING_DIMS,  # Placeholder
                ))

    return embeddings


def process_practice_area(
    input_dir: str,
    output_dir: str,
    practice_area: str,
    generate_embeds: bool = True,
) -> Dict[str, Any]:
    """Process all documents for a practice area"""
    practice_input = os.path.join(input_dir, practice_area)
    practice_output = os.path.join(output_dir, practice_area)
    os.makedirs(practice_output, exist_ok=True)

    tokenizer = get_tokenizer()
    openai_client = None
    if generate_embeds and OPENAI_AVAILABLE:
        openai_client = OpenAI()

    print(f"\nProcessing {practice_area}...")

    # Load documents
    doc_files = [f for f in os.listdir(practice_input) if f.endswith('.json')]
    print(f"  Found {len(doc_files)} documents")

    all_chunks = []
    all_embeddings = []
    all_citations = []

    for doc_file in doc_files:
        with open(os.path.join(practice_input, doc_file)) as f:
            document = json.load(f)

        # Chunk document
        chunks = chunk_document(document, tokenizer)
        all_chunks.extend(chunks)

        # Extract citations
        for chunk in chunks:
            citations = extract_citations(chunk.chunk_text)
            all_citations.extend(citations)

    print(f"  Created {len(all_chunks)} chunks")
    print(f"  Extracted {len(all_citations)} citations")

    # Generate embeddings
    if openai_client and all_chunks:
        print("  Generating embeddings...")
        all_embeddings = generate_embeddings(all_chunks, openai_client)
        print(f"  Generated {len(all_embeddings)} embeddings")

    # Save processed data
    chunks_file = os.path.join(practice_output, "chunks.json")
    with open(chunks_file, 'w') as f:
        json.dump([asdict(c) for c in all_chunks], f, indent=2)

    embeddings_file = os.path.join(practice_output, "embeddings.json")
    with open(embeddings_file, 'w') as f:
        # Note: This will be large - consider binary format for production
        json.dump([asdict(e) for e in all_embeddings], f)

    citations_file = os.path.join(practice_output, "citations.json")
    with open(citations_file, 'w') as f:
        json.dump([asdict(c) for c in all_citations], f, indent=2)

    return {
        "practice_area": practice_area,
        "documents": len(doc_files),
        "chunks": len(all_chunks),
        "embeddings": len(all_embeddings),
        "citations": len(all_citations),
    }


def main():
    parser = argparse.ArgumentParser(description="Chunk and embed legal documents")
    parser.add_argument(
        "--input-dir",
        default="demo_data",
        help="Input directory with downloaded documents",
    )
    parser.add_argument(
        "--output-dir",
        default="demo_data/processed",
        help="Output directory for processed data",
    )
    parser.add_argument(
        "--practice-area",
        choices=["bankruptcy", "criminal_procedure", "administrative"],
        help="Process specific practice area (default: all)",
    )
    parser.add_argument(
        "--no-embeddings",
        action="store_true",
        help="Skip embedding generation",
    )

    args = parser.parse_args()

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

        result = process_practice_area(
            input_dir=args.input_dir,
            output_dir=args.output_dir,
            practice_area=pa,
            generate_embeds=not args.no_embeddings,
        )
        results.append(result)

    # Save summary
    summary = {
        "processed_at": __import__('datetime').datetime.now().isoformat(),
        "input_dir": args.input_dir,
        "output_dir": args.output_dir,
        "practice_areas": results,
        "totals": {
            "documents": sum(r["documents"] for r in results),
            "chunks": sum(r["chunks"] for r in results),
            "embeddings": sum(r["embeddings"] for r in results),
            "citations": sum(r["citations"] for r in results),
        }
    }

    summary_file = os.path.join(args.output_dir, "processing_summary.json")
    os.makedirs(args.output_dir, exist_ok=True)
    with open(summary_file, 'w') as f:
        json.dump(summary, f, indent=2)

    print(f"\n{'='*60}")
    print("PROCESSING COMPLETE")
    print(f"{'='*60}")
    print(f"Total documents: {summary['totals']['documents']}")
    print(f"Total chunks: {summary['totals']['chunks']}")
    print(f"Total embeddings: {summary['totals']['embeddings']}")
    print(f"Summary saved to: {summary_file}")
    print("\nNext step: Run 04_upload_to_supabase.py to load into database")


if __name__ == "__main__":
    main()
