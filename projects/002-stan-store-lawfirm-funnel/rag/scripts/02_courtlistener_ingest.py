#!/usr/bin/env python3
"""
Cerebro Legal RAG - CourtListener Data Ingestion Script

Fetches federal case law from CourtListener API for the three practice areas:
- Bankruptcy (11th Circuit focus, SCOTUS, bankruptcy courts)
- Criminal Procedure (4th/5th/6th Amendment cases)
- Administrative (BIA, EPA, NLRB, SSA cases)

Usage:
    python 02_courtlistener_ingest.py --practice-area bankruptcy --limit 500
    python 02_courtlistener_ingest.py --all --limit 500

Requirements:
    pip install requests python-dotenv supabase openai tiktoken
"""

import os
import json
import hashlib
import argparse
import time
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
import requests
from dataclasses import dataclass, asdict

# Configuration
COURTLISTENER_API_BASE = "https://www.courtlistener.com/api/rest/v3"
COURTLISTENER_API_TOKEN = os.getenv("COURTLISTENER_API_TOKEN", "")  # Optional, increases rate limit

# Court mappings for each practice area
PRACTICE_AREA_COURTS = {
    "bankruptcy": {
        "keywords": ["bankruptcy", "11 U.S.C.", "discharge", "automatic stay", "preference", "debtor"],
        "courts": [
            "scotus",       # Supreme Court
            "ca1", "ca2", "ca3", "ca4", "ca5", "ca6", "ca7", "ca8", "ca9", "ca10", "ca11", "cadc", "cafc",  # Circuits
            # Bankruptcy courts would be fetched via bankruptcy-specific endpoints
        ],
        "statutes": ["11 U.S.C."],
    },
    "criminal_procedure": {
        "keywords": ["Fourth Amendment", "Fifth Amendment", "Miranda", "suppression", "probable cause", "sentencing"],
        "courts": [
            "scotus",
            "ca1", "ca2", "ca3", "ca4", "ca5", "ca6", "ca7", "ca8", "ca9", "ca10", "ca11", "cadc",
        ],
        "statutes": ["18 U.S.C."],
    },
    "administrative": {
        "keywords": ["Chevron", "APA", "arbitrary and capricious", "substantial evidence", "BIA", "removal"],
        "courts": [
            "scotus",
            "ca1", "ca2", "ca3", "ca4", "ca5", "ca6", "ca7", "ca8", "ca9", "ca10", "ca11", "cadc",
            # Agency decisions would be separate
        ],
        "statutes": ["5 U.S.C."],
    },
}

# Authority level mapping for CourtListener courts
COURT_TO_AUTHORITY = {
    "scotus": ("scotus", 100),
    "ca1": ("circuit", 80), "ca2": ("circuit", 80), "ca3": ("circuit", 80),
    "ca4": ("circuit", 80), "ca5": ("circuit", 80), "ca6": ("circuit", 80),
    "ca7": ("circuit", 80), "ca8": ("circuit", 80), "ca9": ("circuit", 80),
    "ca10": ("circuit", 80), "ca11": ("circuit", 80), "cadc": ("circuit", 80),
    "cafc": ("circuit", 80),
}

# Court name mapping
COURT_NAMES = {
    "scotus": "Supreme Court of the United States",
    "ca1": "United States Court of Appeals for the First Circuit",
    "ca2": "United States Court of Appeals for the Second Circuit",
    "ca3": "United States Court of Appeals for the Third Circuit",
    "ca4": "United States Court of Appeals for the Fourth Circuit",
    "ca5": "United States Court of Appeals for the Fifth Circuit",
    "ca6": "United States Court of Appeals for the Sixth Circuit",
    "ca7": "United States Court of Appeals for the Seventh Circuit",
    "ca8": "United States Court of Appeals for the Eighth Circuit",
    "ca9": "United States Court of Appeals for the Ninth Circuit",
    "ca10": "United States Court of Appeals for the Tenth Circuit",
    "ca11": "United States Court of Appeals for the Eleventh Circuit",
    "cadc": "United States Court of Appeals for the District of Columbia Circuit",
    "cafc": "United States Court of Appeals for the Federal Circuit",
}


@dataclass
class Document:
    """Document record for database insertion"""
    practice_area: str
    authority_level: str
    court_code: str
    court_name: str
    jurisdiction: str
    date_published: str  # ISO format
    docket: Optional[str]
    citation: Optional[str]
    title: str
    source_url: Optional[str]
    source_sha256: str
    normalized_sha256: str
    precedential_weight: int
    is_binding_default: bool
    doc_type: str
    text_body: str


class CourtListenerClient:
    """Client for CourtListener API"""

    def __init__(self, api_token: Optional[str] = None):
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "Cerebro-Legal-RAG/1.0 (legal-research-tool)",
        })
        if api_token:
            self.session.headers["Authorization"] = f"Token {api_token}"

        # Rate limiting
        self.last_request_time = 0
        self.min_request_interval = 0.5  # seconds between requests

    def _rate_limit(self):
        """Enforce rate limiting"""
        elapsed = time.time() - self.last_request_time
        if elapsed < self.min_request_interval:
            time.sleep(self.min_request_interval - elapsed)
        self.last_request_time = time.time()

    def search_opinions(
        self,
        query: str,
        court: Optional[str] = None,
        filed_after: Optional[str] = None,
        filed_before: Optional[str] = None,
        page_size: int = 20,
        page: int = 1,
    ) -> Dict[str, Any]:
        """
        Search for opinions using CourtListener API

        Docs: https://www.courtlistener.com/help/api/rest/
        """
        self._rate_limit()

        params = {
            "q": query,
            "type": "o",  # opinions only
            "order_by": "score desc",
            "page_size": min(page_size, 20),
            "page": page,
        }

        if court:
            params["court"] = court
        if filed_after:
            params["filed_after"] = filed_after
        if filed_before:
            params["filed_before"] = filed_before

        try:
            response = self.session.get(
                f"{COURTLISTENER_API_BASE}/search/",
                params=params,
                timeout=30,
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Error searching opinions: {e}")
            return {"count": 0, "results": []}

    def get_opinion(self, opinion_id: int) -> Optional[Dict[str, Any]]:
        """Get full opinion text by ID"""
        self._rate_limit()

        try:
            response = self.session.get(
                f"{COURTLISTENER_API_BASE}/opinions/{opinion_id}/",
                timeout=30,
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Error fetching opinion {opinion_id}: {e}")
            return None

    def get_cluster(self, cluster_id: int) -> Optional[Dict[str, Any]]:
        """Get opinion cluster (case metadata)"""
        self._rate_limit()

        try:
            response = self.session.get(
                f"{COURTLISTENER_API_BASE}/clusters/{cluster_id}/",
                timeout=30,
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Error fetching cluster {cluster_id}: {e}")
            return None


def normalize_text(text: str) -> str:
    """Normalize opinion text for consistent hashing"""
    # Remove excessive whitespace
    import re
    text = re.sub(r'\s+', ' ', text)
    # Remove page numbers and formatting artifacts
    text = re.sub(r'\[\*\d+\]', '', text)
    text = re.sub(r'Page \d+ of \d+', '', text)
    return text.strip()


def compute_sha256(text: str) -> str:
    """Compute SHA256 hash of text"""
    return hashlib.sha256(text.encode('utf-8')).hexdigest()


def extract_citation(result: Dict[str, Any]) -> Optional[str]:
    """Extract best citation from search result"""
    # Try different citation fields
    if result.get("citation"):
        citations = result["citation"]
        if isinstance(citations, list) and citations:
            return citations[0]
        elif isinstance(citations, str):
            return citations

    # Fallback to case name with year
    if result.get("caseName") and result.get("dateFiled"):
        year = result["dateFiled"][:4]
        return f"{result['caseName']} ({year})"

    return None


def fetch_cases_for_practice_area(
    client: CourtListenerClient,
    practice_area: str,
    limit: int = 500,
    output_dir: str = "demo_data",
) -> List[Document]:
    """
    Fetch cases from CourtListener for a given practice area
    """
    config = PRACTICE_AREA_COURTS.get(practice_area)
    if not config:
        raise ValueError(f"Unknown practice area: {practice_area}")

    documents = []
    seen_hashes = set()

    # Create output directory
    practice_dir = os.path.join(output_dir, practice_area)
    os.makedirs(practice_dir, exist_ok=True)

    print(f"\n{'='*60}")
    print(f"Fetching {practice_area} cases (target: {limit})")
    print(f"{'='*60}")

    # Search for each keyword
    for keyword in config["keywords"]:
        if len(documents) >= limit:
            break

        print(f"\nSearching for: {keyword}")
        page = 1

        while len(documents) < limit:
            results = client.search_opinions(
                query=keyword,
                filed_after="2000-01-01",  # Last 25 years for relevance
                page_size=20,
                page=page,
            )

            if not results.get("results"):
                break

            for result in results["results"]:
                if len(documents) >= limit:
                    break

                # Extract court code from result
                court_code = result.get("court_id", "unknown")
                if court_code not in COURT_TO_AUTHORITY:
                    continue  # Skip non-federal courts

                # Get opinion text
                opinion_id = result.get("id")
                if not opinion_id:
                    continue

                # For demo, use snippet as text (full text requires separate API call)
                text_body = result.get("snippet", "")
                if not text_body or len(text_body) < 100:
                    continue

                # Compute hash for deduplication
                source_sha256 = compute_sha256(text_body)
                if source_sha256 in seen_hashes:
                    continue
                seen_hashes.add(source_sha256)

                # Get authority info
                authority_level, precedential_weight = COURT_TO_AUTHORITY[court_code]

                # Create document
                doc = Document(
                    practice_area=practice_area,
                    authority_level=authority_level,
                    court_code=court_code,
                    court_name=COURT_NAMES.get(court_code, court_code),
                    jurisdiction="federal",
                    date_published=result.get("dateFiled", "2000-01-01"),
                    docket=result.get("docketNumber"),
                    citation=extract_citation(result),
                    title=result.get("caseName", "Unknown Case"),
                    source_url=f"https://www.courtlistener.com{result.get('absolute_url', '')}",
                    source_sha256=source_sha256,
                    normalized_sha256=compute_sha256(normalize_text(text_body)),
                    precedential_weight=precedential_weight,
                    is_binding_default=True,
                    doc_type="opinion",
                    text_body=text_body,
                )

                documents.append(doc)

                # Save to file
                doc_file = os.path.join(practice_dir, f"{len(documents):04d}_{court_code}.json")
                with open(doc_file, 'w') as f:
                    json.dump(asdict(doc), f, indent=2)

                if len(documents) % 50 == 0:
                    print(f"  Progress: {len(documents)}/{limit} documents")

            page += 1

            # Check if we've exhausted results for this keyword
            if len(results["results"]) < 20:
                break

    print(f"\nCompleted: {len(documents)} documents for {practice_area}")
    return documents


def main():
    parser = argparse.ArgumentParser(description="Fetch case law from CourtListener")
    parser.add_argument(
        "--practice-area",
        choices=["bankruptcy", "criminal_procedure", "administrative"],
        help="Practice area to fetch",
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Fetch all practice areas",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=500,
        help="Maximum documents per practice area (default: 500)",
    )
    parser.add_argument(
        "--output-dir",
        default="demo_data",
        help="Output directory for downloaded cases",
    )

    args = parser.parse_args()

    if not args.practice_area and not args.all:
        parser.error("Either --practice-area or --all is required")

    # Initialize client
    client = CourtListenerClient(api_token=COURTLISTENER_API_TOKEN)

    # Determine which practice areas to fetch
    practice_areas = (
        list(PRACTICE_AREA_COURTS.keys()) if args.all
        else [args.practice_area]
    )

    # Fetch for each practice area
    all_documents = []
    for practice_area in practice_areas:
        docs = fetch_cases_for_practice_area(
            client=client,
            practice_area=practice_area,
            limit=args.limit,
            output_dir=args.output_dir,
        )
        all_documents.extend(docs)

    # Write summary
    summary = {
        "fetch_date": datetime.now().isoformat(),
        "total_documents": len(all_documents),
        "by_practice_area": {
            pa: len([d for d in all_documents if d.practice_area == pa])
            for pa in practice_areas
        },
        "by_authority_level": {},
    }

    for doc in all_documents:
        level = doc.authority_level
        summary["by_authority_level"][level] = summary["by_authority_level"].get(level, 0) + 1

    summary_file = os.path.join(args.output_dir, "ingest_summary.json")
    with open(summary_file, 'w') as f:
        json.dump(summary, f, indent=2)

    print(f"\n{'='*60}")
    print("INGESTION COMPLETE")
    print(f"{'='*60}")
    print(f"Total documents: {len(all_documents)}")
    print(f"Summary saved to: {summary_file}")
    print("\nNext steps:")
    print("  1. Run 03_chunk_and_embed.py to create chunks and embeddings")
    print("  2. Run 04_upload_to_supabase.py to load into database")


if __name__ == "__main__":
    main()
