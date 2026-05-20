#!/usr/bin/env python3
"""
BowTie Prompt Reviser — QA/QC feedback loop for scene image generation.

Reads rejected records from Airtable, drafts revised prompts incorporating
user rejection notes, and writes back to visual_prompt_revised for approval.

On approval: copies visual_prompt_revised → visual_prompt_full, resets
generation_status, increments batch.

Usage:
    python bowtie_prompt_reviser.py draft            # Draft revised prompts for rejected scenes
    python bowtie_prompt_reviser.py approve          # Apply approved revisions (copy to visual_prompt_full)
    python bowtie_prompt_reviser.py status           # Show QC status summary
    python bowtie_prompt_reviser.py anchor-check     # Legacy: verify anchor objects in generated images
    python bowtie_prompt_reviser.py narrative-check   # NEW: score images against story function + concept type + style
"""

import json
import re
import sys
import time
import urllib.request
import urllib.error

BASE_ID = "appTO7OCRB2XbAlak"
TABLE_ID = "tblHsBzmt8Skvq2jX"
API_TOKEN = os.environ["AIRTABLE_API_KEY"]
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

    # Handle anchor failures: move missing objects to front with explicit positioning
    if "missing narrative anchors:" in notes_lower:
        anchor_match = re.search(
            r"missing narrative anchors:\s*\[?([^\]]+)\]?", rejection_notes, re.IGNORECASE
        )
        if anchor_match:
            missing_objects = [
                o.strip() for o in anchor_match.group(1).split(",") if o.strip()
            ]
            # Prepend missing objects with explicit positioning instructions
            front_matter = "CRITICAL — the following objects MUST be prominently visible: " + ", ".join(
                missing_objects
            )
            revised = f"{front_matter}. {revised}"
            # Also append reinforcement at end
            revised = (
                revised.rstrip(".")
                + f". IMPORTANT: Ensure {', '.join(missing_objects)} are clearly visible and identifiable."
            )

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


def cmd_anchor_check():
    """
    Legacy anchor check — verify specific objects are visible in generated images.
    Use cmd_narrative_check() for the new narrative-alignment scoring.
    """
    import base64
    import os

    GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
    if not GEMINI_API_KEY:
        print("ERROR: Set GEMINI_API_KEY environment variable")
        sys.exit(1)

    GEMINI_VISION_URL = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
    )

    print("Fetching generated records with narrative anchors...")
    records = fetch_records(
        "AND({generation_status}='image_generated', {narrative_anchors}!='')"
    )

    if not records:
        print("No records found with generated images and narrative anchors.")
        return

    print(f"Found {len(records)} records to check.\n")

    checked = 0
    passed = 0
    failed = 0

    for rec in records:
        fields = rec["fields"]
        scene_num = fields.get("scene_number", "?")
        variant = fields.get("variant_id", "?")
        anchors_str = fields.get("narrative_anchors", "")
        image_drive_id = fields.get("image_drive_id", "")

        if not anchors_str or not image_drive_id:
            continue

        anchor_list = [a.strip() for a in anchors_str.split(",") if a.strip()]
        if not anchor_list:
            continue

        print(f"  Scene {scene_num} ({variant}): Checking {len(anchor_list)} anchors...")

        # Download image from Google Drive
        image_url = f"https://drive.google.com/uc?export=download&id={image_drive_id}"
        try:
            img_req = urllib.request.Request(image_url)
            with urllib.request.urlopen(img_req) as resp:
                image_data = resp.read()
            image_b64 = base64.b64encode(image_data).decode("utf-8")
        except Exception as e:
            print(f"    Failed to download image: {e}")
            continue

        # Build Gemini Vision request
        anchor_list_str = json.dumps(anchor_list)
        vision_prompt = (
            f"Look at this illustration carefully. I need to verify which of these "
            f"objects are clearly visible in the image: {anchor_list_str}\n\n"
            f"Return ONLY a JSON object where each key is the object name and the "
            f"value is true if clearly visible, false if not visible or unclear. "
            f"Example: {{\"foreclosure notice\": true, \"child's shoe\": false}}"
        )

        payload = {
            "contents": [
                {
                    "parts": [
                        {"inlineData": {"mimeType": "image/png", "data": image_b64}},
                        {"text": vision_prompt},
                    ]
                }
            ],
            "generationConfig": {"temperature": 0.1},
        }

        try:
            req = urllib.request.Request(
                GEMINI_VISION_URL,
                data=json.dumps(payload).encode(),
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=30) as resp:
                result = json.loads(resp.read().decode())

            # Parse Gemini response
            response_text = result["candidates"][0]["content"]["parts"][0]["text"]
            # Extract JSON from response (may have markdown code fences)
            json_match = re.search(r"\{[^}]+\}", response_text)
            if json_match:
                anchor_results = json.loads(json_match.group(0))
            else:
                print(f"    Could not parse Gemini response: {response_text[:200]}")
                continue

        except Exception as e:
            print(f"    Gemini Vision API error: {e}")
            time.sleep(2)
            continue

        # Calculate score
        objects_found = [k for k, v in anchor_results.items() if v]
        objects_missing = [k for k, v in anchor_results.items() if not v]
        total = len(anchor_results)
        score = len(objects_found) / total if total > 0 else 0

        print(f"    Score: {score:.2f} — Found: {objects_found}, Missing: {objects_missing}")

        # Write results to Airtable
        update_fields = {
            "anchor_score": round(score, 2),
            "anchor_objects_found": ", ".join(objects_found),
            "anchor_objects_missing": ", ".join(objects_missing),
        }

        # Auto-reject if score < 0.6
        if score < 0.6:
            update_fields["qc_status"] = "rejected"
            update_fields["user_rejection_notes"] = (
                f"Missing narrative anchors: [{', '.join(objects_missing)}]"
            )
            print(f"    AUTO-REJECTED (score {score:.2f} < 0.6)")
            failed += 1
        else:
            passed += 1

        update_record(rec["id"], update_fields)
        checked += 1
        time.sleep(1)  # Rate limit Gemini

    print(f"\nAnchor check complete: {checked} checked, {passed} passed, {failed} auto-rejected")


def cmd_narrative_check():
    """
    Narrative alignment QC — scores images against their story function.

    For each generated image, asks Gemini Vision three questions:
    1. Does this image tell the story of [narration_fragment]? (narrative_score 1-10)
    2. Is this a [concept_type] as intended? (concept_match true/false)
    3. Is this 2D cel-shaded illustration? (style_match true/false)

    Auto-rejects if narrative_score < 7 or style_match is false.
    """
    import base64
    import os

    GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
    if not GEMINI_API_KEY:
        print("ERROR: Set GEMINI_API_KEY environment variable")
        sys.exit(1)

    GEMINI_VISION_URL = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
    )

    print("Fetching generated records for narrative check...")
    records = fetch_records(
        "AND({generation_status}='image_generated', {narration_fragment}!='')"
    )

    if not records:
        print("No records found with generated images and narration fragments.")
        # Fall back to records with narrative_anchors (legacy)
        records = fetch_records(
            "AND({generation_status}='image_generated', {narrative_anchors}!='')"
        )
        if not records:
            print("No legacy records either.")
            return

    print(f"Found {len(records)} records to check.\n")

    checked = 0
    passed = 0
    failed = 0

    CONCEPT_DESCRIPTIONS = {
        "literal_scene": "a literal scene showing a real place or moment",
        "visual_metaphor": "a visual metaphor or symbolic/conceptual image",
        "infographic": "an educational infographic or diagram",
        "geographic_reference": "an image with geographic reference (state outlines, maps)",
        "historical_reference": "a historical reference image",
        "character_in_context": "a character shown within their environment",
        "close_up_tactile": "an extreme close-up with tactile detail",
    }

    for rec in records:
        fields = rec["fields"]
        scene_num = fields.get("scene_number", "?")
        variant = fields.get("variant_id", "?")
        narration = fields.get("narration_fragment", "") or fields.get("narrative_anchors", "")
        concept_type = fields.get("concept_type", "literal_scene")
        image_drive_id = fields.get("image_drive_id", "")

        if not image_drive_id:
            continue

        print(f"  Scene {scene_num} ({variant}): Narrative check...")

        # Download image
        image_url = f"https://drive.google.com/uc?export=download&id={image_drive_id}"
        try:
            img_req = urllib.request.Request(image_url)
            with urllib.request.urlopen(img_req) as resp:
                image_data = resp.read()
            image_b64 = base64.b64encode(image_data).decode("utf-8")
        except Exception as e:
            print(f"    Failed to download image: {e}")
            continue

        concept_desc = CONCEPT_DESCRIPTIONS.get(concept_type, "a scene illustration")

        vision_prompt = (
            f"You are a QC reviewer for an animated video series in 2D cel-shaded style "
            f"(Boondocks / Spider-Verse aesthetic).\n\n"
            f"The narration for this image is: \"{narration}\"\n"
            f"The intended concept type is: {concept_desc}\n\n"
            f"Score this image on three criteria. Return ONLY a JSON object:\n"
            f'{{"narrative_score": <1-10>, "concept_match": <true/false>, "style_match": <true/false>, "explanation": "<brief reason>"}}\n\n'
            f"narrative_score: Does this image tell the story of the narration? "
            f"Would a viewer understand the narrative beat without the voiceover? "
            f"10 = perfect match, 1 = completely unrelated.\n"
            f"concept_match: Is this image {concept_desc}?\n"
            f"style_match: Is this 2D cel-shaded illustration with flat colors and visible outlines? "
            f"(false if photorealistic, 3D render, or Pixar/Disney style)"
        )

        payload = {
            "contents": [
                {
                    "parts": [
                        {"inlineData": {"mimeType": "image/png", "data": image_b64}},
                        {"text": vision_prompt},
                    ]
                }
            ],
            "generationConfig": {"temperature": 0.1},
        }

        try:
            req = urllib.request.Request(
                GEMINI_VISION_URL,
                data=json.dumps(payload).encode(),
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=30) as resp:
                result = json.loads(resp.read().decode())

            response_text = result["candidates"][0]["content"]["parts"][0]["text"]
            json_match = re.search(r"\{[^}]+\}", response_text)
            if json_match:
                qc_results = json.loads(json_match.group(0))
            else:
                print(f"    Could not parse response: {response_text[:200]}")
                continue

        except Exception as e:
            print(f"    Gemini Vision API error: {e}")
            time.sleep(2)
            continue

        narrative_score = qc_results.get("narrative_score", 0)
        concept_match = qc_results.get("concept_match", False)
        style_match = qc_results.get("style_match", False)
        explanation = qc_results.get("explanation", "")

        print(f"    Narrative: {narrative_score}/10, Concept: {concept_match}, Style: {style_match}")
        if explanation:
            print(f"    Reason: {explanation}")

        update_fields = {
            "anchor_score": round(narrative_score / 10.0, 2),
            "anchor_objects_found": f"narrative={narrative_score}, concept={concept_match}, style={style_match}",
            "anchor_objects_missing": explanation,
        }

        # Auto-reject if narrative < 7 OR style is wrong
        reject_reasons = []
        if narrative_score < 7:
            reject_reasons.append(f"narrative_score={narrative_score}/10 (min 7)")
        if not style_match:
            reject_reasons.append("wrong visual style (not cel-shaded)")
        if not concept_match:
            reject_reasons.append(f"concept mismatch (expected {concept_type})")

        if reject_reasons:
            update_fields["qc_status"] = "rejected"
            update_fields["user_rejection_notes"] = "; ".join(reject_reasons) + f". {explanation}"
            print(f"    AUTO-REJECTED: {'; '.join(reject_reasons)}")
            failed += 1
        else:
            update_fields["qc_status"] = "approved"
            passed += 1

        update_record(rec["id"], update_fields)
        checked += 1
        time.sleep(1)

    print(f"\nNarrative check complete: {checked} checked, {passed} passed, {failed} auto-rejected")


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
        print("Usage: python bowtie_prompt_reviser.py [draft|approve|status|anchor-check|narrative-check]")
        sys.exit(1)

    cmd = sys.argv[1]
    if cmd == "draft":
        cmd_draft()
    elif cmd == "approve":
        cmd_approve()
    elif cmd == "status":
        cmd_status()
    elif cmd == "anchor-check":
        cmd_anchor_check()
    elif cmd == "narrative-check":
        cmd_narrative_check()
    else:
        print(f"Unknown command: {cmd}")
        print("Usage: python bowtie_prompt_reviser.py [draft|approve|status|anchor-check|narrative-check]")
        sys.exit(1)


if __name__ == "__main__":
    main()
