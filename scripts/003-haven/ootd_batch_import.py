#!/usr/bin/env python3
"""
OOTD Batch Import: Fetch Pinterest pins → Groq Vision analysis → Airtable

One-time script to populate OOTD records from Pinterest data.

Usage:
    # From existing Apify dataset (already scraped)
    GROQ_API_KEY=gsk_... python3 scripts/003-haven/ootd_batch_import.py

    # From a new Pinterest board (triggers Apify scrape)
    GROQ_API_KEY=gsk_... python3 scripts/003-haven/ootd_batch_import.py --board-url https://www.pinterest.com/user/board/

    # Re-push cached results (skip re-analysis)
    python3 scripts/003-haven/ootd_batch_import.py --from-cache

    # Dry run
    GROQ_API_KEY=gsk_... python3 scripts/003-haven/ootd_batch_import.py --dry-run
"""

import argparse
import base64
import json
import os
import sys
import time
from pathlib import Path
from typing import Dict, List, Optional
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

# ── Config ──────────────────────────────────────────────────────────────────

APIFY_TOKEN = "***REDACTED***"
APIFY_ACTOR = "alexey~pinterest-crawler"

GROQ_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct"
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_SLEEP = 2  # seconds between calls (~30 RPM free tier)

AIRTABLE_BASE = "appWVJhdylvNm07nv"
AIRTABLE_TABLE = "tblUT12noiUZuMBfL"
AIRTABLE_URL = f"https://api.airtable.com/v0/{AIRTABLE_BASE}/{AIRTABLE_TABLE}"

MAX_PINS = 100
CACHE_FILE = Path(__file__).parent / "ootd_cache.json"

OUTFIT_PROMPT = (
    "You are a fashion stylist analyzing outfit photos for an Instagram fashion account.\n\n"
    "Describe this outfit in detail for an AI image generation prompt. Include:\n"
    "1. All clothing items (top, bottom, shoes, accessories)\n"
    "2. Colors and patterns\n"
    "3. Fabric textures (silk, denim, knit, etc.)\n"
    "4. Overall style vibe (casual chic, streetwear, elegant, bohemian, etc.)\n"
    "5. Any notable styling details (tucked shirt, rolled sleeves, layering)\n\n"
    "Format as a single flowing description paragraph, NOT a bulleted list.\n"
    "Start with the overall vibe, then describe from top to bottom.\n"
    "Keep it under 200 words. Do not mention the model/person, only the clothes.\n\n"
    "Example: Effortless casual chic. A cream oversized linen blazer over a fitted white "
    "crop top, paired with high-waisted straight-leg light wash jeans. Brown leather belt "
    "with gold buckle. White leather sneakers. Gold hoop earrings and a delicate layered "
    "necklace. Hair pulled back loosely."
)


# ── Helpers ──────────────────────────────────────────────────────────────────

DEFAULT_HEADERS = {"User-Agent": "ootd-batch/1.0"}


def api_get(url: str, headers: Optional[Dict] = None):
    req = Request(url, headers={**DEFAULT_HEADERS, **(headers or {})})
    with urlopen(req, timeout=30) as resp:
        return json.loads(resp.read())


def api_post(url: str, body: dict, headers: Optional[Dict] = None) -> dict:
    data = json.dumps(body).encode()
    req = Request(url, data=data, headers={**DEFAULT_HEADERS, **(headers or {}), "Content-Type": "application/json"})
    with urlopen(req, timeout=60) as resp:
        return json.loads(resp.read())


def load_airtable_token() -> str:
    """Load Airtable token from env var or MCP config."""
    token = os.environ.get("AIRTABLE_TOKEN")
    if token:
        return token

    mcp_path = Path.home() / ".claude" / ".mcp.json"
    if mcp_path.exists():
        with open(mcp_path) as f:
            mcp = json.load(f)
        for name in ("airtable-mcp", "airtable"):
            env = mcp.get("mcpServers", {}).get(name, {}).get("env", {})
            token = env.get("AIRTABLE_API_KEY") or env.get("AIRTABLE_TOKEN")
            if token:
                return token

    print("ERROR: No Airtable token found. Set AIRTABLE_TOKEN env var or configure MCP.")
    sys.exit(1)


def save_cache(records: List[dict]):
    """Save analyzed records to cache file."""
    existing = []
    if CACHE_FILE.exists():
        with open(CACHE_FILE) as f:
            existing = json.load(f)

    # Dedup by look_name
    seen = {r["look_name"] for r in existing}
    for r in records:
        if r["look_name"] not in seen:
            existing.append(r)
            seen.add(r["look_name"])

    with open(CACHE_FILE, "w") as f:
        json.dump(existing, f, indent=2)
    print(f"  Cached {len(existing)} total records → {CACHE_FILE.name}")


def load_cache() -> List[dict]:
    """Load analyzed records from cache file."""
    if not CACHE_FILE.exists():
        print(f"ERROR: No cache file found at {CACHE_FILE}")
        sys.exit(1)
    with open(CACHE_FILE) as f:
        records = json.load(f)
    print(f"  Loaded {len(records)} records from cache")
    return records


# ── Step 1: Fetch pins ───────────────────────────────────────────────────────

def fetch_apify_pins(max_pins: int = MAX_PINS) -> List[dict]:
    """Get pins from the most recent successful Apify run (no new scrape)."""
    print("Step 1: Fetching existing Apify dataset...")

    runs_url = (
        f"https://api.apify.com/v2/acts/{APIFY_ACTOR}/runs"
        f"?token={APIFY_TOKEN}&limit=3&desc=1&status=SUCCEEDED"
    )
    runs = api_get(runs_url)
    items = runs.get("data", {}).get("items", [])
    if not items:
        print("ERROR: No successful Apify runs found.")
        sys.exit(1)

    run = items[0]
    dataset_id = run["defaultDatasetId"]
    print(f"  Using run {run['id']} (started {run.get('startedAt', '?')})")
    print(f"  Dataset: {dataset_id}")

    dataset_url = (
        f"https://api.apify.com/v2/datasets/{dataset_id}/items"
        f"?token={APIFY_TOKEN}&format=json"
    )
    raw_pins = api_get(dataset_url)
    print(f"  Raw items fetched: {len(raw_pins)}")

    return _filter_pins(raw_pins, max_pins)


def scrape_board(board_url: str, max_pins: int = MAX_PINS) -> List[dict]:
    """Trigger a new Apify scrape for a Pinterest board and return pins."""
    print(f"Step 1: Scraping board {board_url} via Apify...")

    run_url = (
        f"https://api.apify.com/v2/acts/{APIFY_ACTOR}/run-sync-get-dataset-items"
        f"?token={APIFY_TOKEN}"
    )
    body = {
        "startUrls": [{"url": board_url}],
        "maxPinsCnt": max_pins,
        "proxyConfig": {"useApifyProxy": True},
    }

    print("  Waiting for scrape to complete (up to 2 min)...")
    req = Request(
        run_url,
        data=json.dumps(body).encode(),
        headers={**DEFAULT_HEADERS, "Content-Type": "application/json"},
    )
    with urlopen(req, timeout=180) as resp:
        raw_pins = json.loads(resp.read())

    print(f"  Raw items fetched: {len(raw_pins)}")
    return _filter_pins(raw_pins, max_pins)


def _filter_pins(raw_pins: list, max_pins: int) -> List[dict]:
    """Filter and deduplicate raw Apify pin data."""
    valid = []
    seen = set()

    for pin in raw_pins:
        image_url = _extract_image_url(pin)
        if not image_url or not image_url.startswith("http"):
            continue

        pin_id = str(pin.get("id") or pin.get("pinId") or pin.get("url") or image_url)
        if pin_id in seen:
            continue
        seen.add(pin_id)

        pin_url = str(
            pin.get("url")
            or pin.get("link")
            or (f"https://www.pinterest.com/pin/{pin['id']}/" if pin.get("id") else "")
        )

        title = str(pin.get("title") or pin.get("name") or "")

        valid.append({
            "pin_id": pin_id,
            "image_url": image_url,
            "title": title,
            "description": str(pin.get("description", "")),
            "pin_url": pin_url,
        })

        if len(valid) >= max_pins:
            break

    print(f"  Valid pins after filtering: {len(valid)}")
    return valid


def _extract_image_url(pin: dict) -> Optional[str]:
    """Extract best image URL from varied Apify crawler output structures."""
    for field in ("imageUrl", "image", "images", "thumbnailUrl"):
        val = pin.get(field)
        if val is None:
            continue
        url = _resolve_url(val)
        if url:
            return url

    media_images = (pin.get("media") or {}).get("images")
    if media_images:
        url = _resolve_url(media_images)
        if url:
            return url

    return None


def _resolve_url(val) -> Optional[str]:
    """Resolve a URL from a string or nested dict structure."""
    if isinstance(val, str):
        return val
    if isinstance(val, dict):
        if val.get("url"):
            return str(val["url"])
        if isinstance(val.get("orig"), dict) and val["orig"].get("url"):
            return str(val["orig"]["url"])
        if isinstance(val.get("orig"), str):
            return val["orig"]
        for key in ("originals", "orig", "1200x", "736x", "474x", "236x"):
            sub = val.get(key)
            if isinstance(sub, dict) and sub.get("url"):
                return str(sub["url"])
            if isinstance(sub, str):
                return sub
    return None


# ── Step 2: Download + Groq Vision analysis ──────────────────────────────────

def analyze_pins(pins: List[dict], groq_key: str) -> List[dict]:
    """Download each pin image and analyze with Groq Vision."""
    print(f"\nStep 2: Analyzing {len(pins)} pins with Groq Vision...")
    results = []
    failed = 0

    for i, pin in enumerate(pins):
        label = f"[{i+1}/{len(pins)}]"
        short_id = pin["pin_id"][-8:] if len(pin["pin_id"]) > 8 else pin["pin_id"]
        print(f"  {label} Analyzing pin {short_id}...", end=" ", flush=True)

        try:
            # Download image
            req = Request(pin["image_url"], headers={"User-Agent": "Mozilla/5.0"})
            with urlopen(req, timeout=15) as resp:
                img_bytes = resp.read()
            img_b64 = base64.b64encode(img_bytes).decode()

            # Call Groq Vision
            body = {
                "model": GROQ_MODEL,
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "image_url",
                                "image_url": {"url": f"data:image/jpeg;base64,{img_b64}"},
                            },
                            {"type": "text", "text": OUTFIT_PROMPT},
                        ],
                    }
                ],
                "max_tokens": 400,
                "temperature": 0.4,
            }
            resp = api_post(
                GROQ_URL,
                body,
                headers={"Authorization": f"Bearer {groq_key}"},
            )
            outfit_prompt = resp["choices"][0]["message"]["content"].strip()

            # Build look name
            look_name = pin["title"].strip()
            if not look_name or len(look_name) < 3:
                look_name = f"Pinterest Import — {short_id}"
            if len(look_name) > 100:
                look_name = look_name[:97] + "..."

            results.append({
                "look_name": look_name,
                "outfit_prompt": outfit_prompt,
                "status": "Pending",
                "categories_done": 0,
            })
            print("OK")

        except (HTTPError, URLError, KeyError, Exception) as e:
            print(f"FAILED ({e})")
            failed += 1

        if i < len(pins) - 1:
            time.sleep(GROQ_SLEEP)

    print(f"  Analysis complete: {len(results)} succeeded, {failed} failed")
    return results


# ── Step 3: Push to Airtable ─────────────────────────────────────────────────

def push_to_airtable(records: List[dict], token: str, dry_run: bool) -> int:
    """Batch-create records in Airtable (10 per request)."""
    print(f"\nStep 3: Pushing {len(records)} records to Airtable...")

    if dry_run:
        print("  --dry-run: Skipping Airtable writes. Preview of first 3 records:")
        for r in records[:3]:
            print(f"    • {r['look_name']}")
            print(f"      Prompt: {r['outfit_prompt'][:120]}...")
        return len(records)

    headers = {
        "Authorization": f"Bearer {token}",
    }
    pushed = 0

    for batch_start in range(0, len(records), 10):
        batch = records[batch_start : batch_start + 10]
        body = {
            "records": [
                {
                    "fields": {
                        "Look Name": r["look_name"],
                        "Outfit Prompt": r["outfit_prompt"],
                        "Status": r["status"],
                        "Categories Done": r["categories_done"],
                    }
                }
                for r in batch
            ]
        }

        try:
            api_post(AIRTABLE_URL, body, headers=headers)
            pushed += len(batch)
            print(f"  Pushed batch {batch_start//10 + 1} ({len(batch)} records)")
        except HTTPError as e:
            error_body = e.read().decode() if hasattr(e, "read") else str(e)
            print(f"  ERROR pushing batch {batch_start//10 + 1}: {e} — {error_body}")

    print(f"  Total pushed: {pushed}")
    return pushed


# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="OOTD Batch Import: Pinterest → Groq → Airtable")
    parser.add_argument("--dry-run", action="store_true", help="Analyze pins but skip Airtable writes")
    parser.add_argument("--limit", type=int, default=MAX_PINS, help=f"Max pins to process (default {MAX_PINS})")
    parser.add_argument("--board-url", type=str, help="Pinterest board URL to scrape (triggers new Apify run)")
    parser.add_argument("--from-cache", action="store_true", help="Push cached results to Airtable (skip fetch + analysis)")
    args = parser.parse_args()

    airtable_token = load_airtable_token()

    # Mode: re-push from cache
    if args.from_cache:
        records = load_cache()
        pushed = push_to_airtable(records, airtable_token, args.dry_run)
        print(f"\n{'='*50}")
        print(f"SUMMARY (from cache)")
        print(f"  Records loaded: {len(records)}")
        print(f"  Pushed to AT:   {pushed}" + (" (dry-run)" if args.dry_run else ""))
        print(f"{'='*50}")
        return

    # Validate Groq key for analysis mode
    groq_key = os.environ.get("GROQ_API_KEY")
    if not groq_key:
        print("ERROR: GROQ_API_KEY env var not set. Get a free key at https://console.groq.com")
        sys.exit(1)

    max_pins = args.limit

    # Fetch pins
    if args.board_url:
        pins = scrape_board(args.board_url, max_pins)
    else:
        pins = fetch_apify_pins(max_pins)

    if not pins:
        print("No valid pins found. Nothing to do.")
        sys.exit(0)

    # Analyze
    records = analyze_pins(pins, groq_key)
    if not records:
        print("No records produced from analysis. Nothing to push.")
        sys.exit(0)

    # Cache results before pushing (so we don't lose work)
    save_cache(records)

    # Push to Airtable
    pushed = push_to_airtable(records, airtable_token, args.dry_run)

    # Summary
    print(f"\n{'='*50}")
    print(f"SUMMARY")
    print(f"  Pins fetched:   {len(pins)}")
    print(f"  Analyzed OK:    {len(records)}")
    print(f"  Failed:         {len(pins) - len(records)}")
    print(f"  Pushed to AT:   {pushed}" + (" (dry-run)" if args.dry_run else ""))
    print(f"{'='*50}")


if __name__ == "__main__":
    main()
