#!/usr/bin/env python3
"""
BowTie Prompt Reviser — QA/QC feedback loop for scene image generation.

Reads rejected records from Airtable, drafts revised prompts incorporating
user rejection notes, and writes back to visual_prompt_revised for approval.

On approval: copies visual_prompt_revised → visual_prompt_full, resets
generation_status, increments batch.

Usage:
    python bowtie_prompt_reviser.py draft     # Draft revised prompts for rejected scenes
    python bowtie_prompt_reviser.py approve   # Apply approved revisions (copy to visual_prompt_full)
    python bowtie_prompt_reviser.py status    # Show QC status summary
"""

import json
import sys
import time
import urllib.request
import urllib.error

BASE_ID = "appTO7OCRB2XbAlak"
TABLE_ID = "tblHsBzmt8Skvq2jX"
API_TOKEN = "***REDACTED***"
API_BASE = f"https://api.airtable.com/v0/{BASE_ID}/{TABLE_ID}"


def api_request(url, data=None, method="GET"):
    """Make an Airtable API request with rate limiting."""
    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json",
    }
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        print(f"  HTTP {e.code}: {error_body}")
        return None
    finally:
        time.sleep(0.25)  # Rate limit: 5 req/sec


def fetch_records(formula=None):
    """Fetch records from Scenes table with optional filter."""
    all_records = []
    offset = None
    while True:
        url = API_BASE + "?"
        params = []
        if formula:
            params.append(f"filterByFormula={urllib.parse.quote(formula)}")
        if offset:
            params.append(f"offset={offset}")
        url += "&".join(params)
        result = api_request(url)
        if not result:
            break
        all_records.extend(result.get("records", []))
        offset = result.get("offset")
        if not offset:
            break
    return all_records


def update_record(record_id, fields):
    """Update a single Airtable record."""
    url = f"{API_BASE}/{record_id}"
    return api_request(url, data={"fields": fields}, method="PATCH")


def batch_update(updates):
    """Batch update records (max 10 per request)."""
    for i in range(0, len(updates), 10):
        batch = updates[i : i + 10]
        payload = {"records": batch}
        result = api_request(API_BASE, data=payload, method="PATCH")
        if result:
            print(f"  Updated batch of {len(batch)} records")
        time.sleep(0.25)


# ── Prompt Revision Logic ──


def revise_prompt(original_prompt, rejection_notes):
    """
    Draft a revised prompt incorporating rejection feedback.

    Strategy: Parse the rejection notes for specific complaints and modify
    the original prompt accordingly. Common rejection patterns:
    - "too modern" → add vintage/aged qualifiers
    - "too bright/cheerful" → reinforce dark palette
    - "wrong setting" → replace setting elements
    - "missing [X]" → add the missing element
    - "too generic" → add specific narrative anchors
    """
    revised = original_prompt

    notes_lower = rejection_notes.lower()

    # Common revision patterns
    if "too modern" in notes_lower or "modern" in notes_lower:
        revised = revised.replace("clean ", "aged ")
        revised = revised.replace("new ", "worn ")
        if "vintage" not in revised.lower():
            revised = revised.rstrip(".") + ", aged and weathered, decades of use visible."

    if "too bright" in notes_lower or "cheerful" in notes_lower:
        revised = revised.rstrip(".") + ", darker mood, muted tones, heavy shadow."

    if "too generic" in notes_lower or "generic" in notes_lower:
        # Can't auto-fix this well — flag for human revision
        revised = f"[NEEDS MANUAL REVISION — rejection: '{rejection_notes}'] {revised}"

    if "missing" in notes_lower:
        # Extract what's missing and append
        revised = revised.rstrip(".") + f". [ADD: {rejection_notes}]."

    if "wrong" in notes_lower:
        revised = f"[NEEDS MANUAL REVISION — rejection: '{rejection_notes}'] {revised}"

    return revised


def cmd_draft():
    """Draft revised prompts for all rejected scenes."""
    print("Fetching rejected records...")
    records = fetch_records("AND({qc_status}='rejected', {user_rejection_notes}!='')")

    if not records:
        print("No rejected records with rejection notes found.")
        return

    print(f"Found {len(records)} rejected records.\n")

    updates = []
    for rec in records:
        fields = rec["fields"]
        scene_num = fields.get("scene_number", "?")
        variant = fields.get("variant_id", "?")
        original = fields.get("visual_prompt_full", "")
        notes = fields.get("user_rejection_notes", "")
        existing_revision = fields.get("visual_prompt_revised", "")

        if existing_revision:
            print(f"  Scene {scene_num} ({variant}): Already has revision staged, skipping")
            continue

        revised = revise_prompt(original, notes)

        print(f"  Scene {scene_num} ({variant}):")
        print(f"    Rejection: {notes}")
        print(f"    Revised prompt staged for approval")

        updates.append(
            {
                "id": rec["id"],
                "fields": {
                    "visual_prompt_revised": revised,
                    "prompt_quality": "needs_work",
                },
            }
        )

    if updates:
        print(f"\nStaging {len(updates)} revised prompts...")
        batch_update(updates)
        print("Done. Review in Airtable 'Needs Review' view, then run 'approve' command.")
    else:
        print("No new revisions to stage.")


def cmd_approve():
    """Apply approved revisions: copy visual_prompt_revised → visual_prompt_full."""
    print("Fetching records with staged revisions...")
    records = fetch_records(
        "AND({visual_prompt_revised}!='', {prompt_quality}='good')"
    )

    if not records:
        print("No approved revisions found. Set prompt_quality='good' in Airtable to approve.")
        return

    print(f"Found {len(records)} approved revisions.\n")

    updates = []
    for rec in records:
        fields = rec["fields"]
        scene_num = fields.get("scene_number", "?")
        variant = fields.get("variant_id", "?")
        revised = fields.get("visual_prompt_revised", "")
        current_batch = fields.get("batch", 1) or 1

        print(f"  Scene {scene_num} ({variant}): Applying revision, batch {current_batch} → {current_batch + 1}")

        updates.append(
            {
                "id": rec["id"],
                "fields": {
                    "visual_prompt_full": revised,
                    "visual_prompt_revised": "",  # Clear staged revision
                    "generation_status": "ready_for_generation",
                    "qc_status": "",  # Reset QC
                    "qc_score": None,
                    "batch": current_batch + 1,
                    "prompt_quality": None,
                    "generation_attempts": 0,
                },
            }
        )

    if updates:
        print(f"\nApplying {len(updates)} revisions...")
        batch_update(updates)
        print("Done. Records reset to ready_for_generation with incremented batch.")
    else:
        print("No revisions to apply.")


def cmd_status():
    """Show QC status summary across all scenes."""
    print("Fetching all scene records...")
    records = fetch_records()

    if not records:
        print("No records found.")
        return

    # Count by status
    qc_counts = {}
    gen_counts = {}
    batch_counts = {}
    variant_counts = {}

    for rec in records:
        fields = rec["fields"]
        qc = fields.get("qc_status", "(not scored)")
        gen = fields.get("generation_status", "(unknown)")
        batch = fields.get("batch", "(untagged)")
        variant = fields.get("variant_id", "(unknown)")

        qc_counts[qc] = qc_counts.get(qc, 0) + 1
        gen_counts[gen] = gen_counts.get(gen, 0) + 1
        batch_counts[batch] = batch_counts.get(batch, 0) + 1
        variant_counts[variant] = variant_counts.get(variant, 0) + 1

    print(f"\nTotal records: {len(records)}\n")

    print("QC Status:")
    for status, count in sorted(qc_counts.items(), key=lambda x: -x[1]):
        print(f"  {status}: {count}")

    print("\nGeneration Status:")
    for status, count in sorted(gen_counts.items(), key=lambda x: -x[1]):
        print(f"  {status}: {count}")

    print("\nBatch:")
    for batch, count in sorted(batch_counts.items()):
        print(f"  {batch}: {count}")

    print("\nVariant IDs:")
    for variant, count in sorted(variant_counts.items()):
        print(f"  {variant}: {count}")


def main():
    import urllib.parse  # Needed for filterByFormula encoding

    if len(sys.argv) < 2:
        print("Usage: python bowtie_prompt_reviser.py [draft|approve|status]")
        sys.exit(1)

    cmd = sys.argv[1]
    if cmd == "draft":
        cmd_draft()
    elif cmd == "approve":
        cmd_approve()
    elif cmd == "status":
        cmd_status()
    else:
        print(f"Unknown command: {cmd}")
        print("Usage: python bowtie_prompt_reviser.py [draft|approve|status]")
        sys.exit(1)


if __name__ == "__main__":
    main()
