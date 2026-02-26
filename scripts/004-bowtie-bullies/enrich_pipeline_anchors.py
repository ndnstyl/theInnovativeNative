#!/usr/bin/env python3
"""
Enrich Pipeline Anchors — Pre-populate visual_anchors for each Gemini scene.

Reads a pipeline JSON and extracts visual_anchors from existing visual_prompt
and narration_text fields. Outputs enriched JSON for human review.

Usage:
    python enrich_pipeline_anchors.py <input.json> [--output <output.json>]
    python enrich_pipeline_anchors.py <input.json> --dry-run    # Preview only
"""

import json
import re
import sys
from pathlib import Path

# ── Object extraction patterns ──
# Concrete nouns/objects that make scenes identifiable
OBJECT_PATTERNS = [
    # Documents and signage
    r"foreclosure notice",
    r"eviction letter",
    r"court summons",
    r"lease agreement",
    r"IRS tax form",
    r"legal document",
    r"handwritten notes",
    r"library card",
    r"city permit sticker",
    r"catering contract",
    r"community service awards",
    r"newspaper clippings",
    r"county seal",
    r"photocopied handouts",
    r"rate sheet",
    r"receipt",
    r"budget written in pen",
    r"calendar with .{5,30} circled",
    r"thank-you notes",
    r"event flyers",
    # Signage — only match text in quotes within visual_prompt (not narration)
    r"reading '([^']{3,50})'",
    r"'((?:SINCE|ESTABLISHED|OPEN|CHECKS|RENT|AREA|BLACK|COMMUNITY|GOING|WE|PARKING|ROOM)[^']{0,50})'",
    r"SINCE \d{4}",
    r"ESTABLISHED \d{4}",
    # Objects
    r"child's (?:shoe|drawing|crayon drawing)",
    r"overturned porch chair",
    r"dead potted plant",
    r"heavy padlock",
    r"padlock and new chain",
    r"straight razor",
    r"talc powder tin",
    r"polaroids",
    r"community bulletin board",
    r"basketball hoop",
    r"sandwich board sign",
    r"folding (?:metal )?chairs",
    r"whiteboard",
    r"barber (?:station|chair)",
    r"food trucks?",
    r"coffee (?:mug|cup)",
    r"cracked laptop screen",
    r"laptop screen",
    r"notebook",
    r"sticky notes",
    r"ashtray",
    r"welcome mat",
    r"surveillance cameras?",
    r"neon .{3,25} sign",
    r"(?:iron )?security bars",
    r"ATM fee notice",
    r"candle on .{5,30}",
    r"quill pen",
    r"leather-bound book",
    r"wax seal",
    r"finger-drawn letters",
    r"wheat-paste poster",
    r"sunflower",
    r"raised beds",
    r"hand-painted mural",
    r"expensive sneaker",
    r"cash-counting band",
    r"graffiti tags?",
    r"storage unit",
    r"'ROOM FOR RENT' sign",
    r"school lunch bag",
    r"child's crayon drawing",
]

# Lighting keywords
LIGHTING_PATTERNS = [
    (r"sodium vapor\b[^.]*", "sodium vapor"),
    (r"candle\s*light\b[^.]*", "candlelight"),
    (r"neon\b[^.]*(?:sign|glow|accent|buzzing)", "neon"),
    (r"golden hour\b[^.]*", "golden hour"),
    (r"dawn\b[^.]*light", "dawn"),
    (r"morning light\b[^.]*", "morning"),
    (r"incandescent\b[^.]*", "incandescent"),
    (r"floodlight\b[^.]*", "floodlight"),
    (r"bone-white glow\b[^.]*", "screen glow"),
    (r"warm (?:amber |golden )?(?:glow|light)\b[^.]*", "warm"),
    (r"porch light\b[^.]*", "porch light"),
    (r"desk lamp\b[^.]*", "desk lamp"),
]

# Composition keywords
COMP_PATTERNS = [
    (r"extreme close-up", "Extreme close-up"),
    (r"close-up", "Close-up"),
    (r"wide establishing", "Wide establishing shot"),
    (r"wide shot", "Wide shot"),
    (r"camera push(?:es)? in", "Push-in"),
    (r"camera pull(?:s)? back", "Pull-back"),
    (r"low angle", "Low angle"),
    (r"silhouette", "Silhouette composition"),
    (r"hold shot", "Static hold"),
    (r"shallow depth of field", "Shallow depth of field"),
    (r"vanishing point", "Vanishing point composition"),
]


def extract_objects(visual_prompt, narration_text=""):
    """Extract identifiable objects from the visual prompt only (not narration)."""
    if not visual_prompt:
        return []
    found = []

    for pattern in OBJECT_PATTERNS:
        matches = re.findall(pattern, visual_prompt, re.IGNORECASE)
        for match in matches:
            clean = match.strip("'\"., ")
            if clean and len(clean) > 2 and clean.lower() not in [o.lower() for o in found]:
                found.append(clean)

    # Cap at 5 most relevant (prefer longer/more specific)
    found.sort(key=lambda x: -len(x))
    return found[:5]


def extract_scene_signature(narration_text, visual_prompt):
    """Generate a one-line identity statement from narration + visual."""
    if not narration_text:
        # Fall back to first clause of visual prompt
        if visual_prompt:
            first_clause = visual_prompt.split(",")[0].strip()
            return first_clause
        return None

    # Use first sentence of narration as seed
    first_sentence = narration_text.split(".")[0].strip()

    # Build signature from visual setting + narrative moment
    setting_match = re.match(r"^([^,]+)", visual_prompt or "")
    setting = setting_match.group(1).strip() if setting_match else ""

    if setting and len(setting) < 80:
        return f"{setting} — {first_sentence}"
    return first_sentence


def extract_lighting(visual_prompt):
    """Extract scene-specific lighting from visual prompt — concise form."""
    if not visual_prompt:
        return None

    # Look for lighting-specific sentences/clauses
    # Split on commas and periods, find the clause with lighting keywords
    clauses = re.split(r"[.,]", visual_prompt)
    lighting_clauses = []
    for clause in clauses:
        c = clause.strip()
        if re.search(r"(?:light|glow|lit |lamp|candle|sodium|neon|dawn|sunrise|golden hour)", c, re.IGNORECASE):
            # Skip if it's a full scene description (too long)
            if len(c) < 100 and not c.lower().startswith(("close", "extreme", "wide", "red nose")):
                lighting_clauses.append(c)

    if lighting_clauses:
        # Take up to 2 most relevant lighting clauses
        return ". ".join(lighting_clauses[:2])

    return None


def extract_composition(visual_prompt):
    """Extract composition/framing from visual prompt."""
    if not visual_prompt:
        return None

    for pattern, label in COMP_PATTERNS:
        if re.search(pattern, visual_prompt, re.IGNORECASE):
            return label

    return None


def enrich_beat(beat, scene_narration=""):
    """Extract anchors from a single visual beat."""
    vc = beat.get("visual_concept", "")
    nf = beat.get("narration_fragment", "")

    objects = extract_objects(vc, nf)
    lighting = extract_lighting(vc)
    composition = extract_composition(vc)

    anchors = {}
    if objects:
        anchors["must_include"] = objects
    if beat.get("story_function"):
        anchors["scene_signature"] = beat["story_function"]
    if lighting:
        anchors["lighting_override"] = lighting
    if composition:
        anchors["composition"] = composition

    return anchors


def enrich_scene(scene):
    """Add visual_anchors to a single scene if it's a Gemini scene.

    Supports both legacy single-prompt scenes and new beat-decomposed scenes.
    """
    if scene.get("visual_backend") != "gemini":
        return scene
    if not scene.get("visual_prompt"):
        return scene

    # If scene has visual_beats, enrich each beat individually
    if scene.get("visual_beats"):
        for beat in scene["visual_beats"]:
            beat_anchors = enrich_beat(beat, scene.get("narration_text", ""))
            if beat_anchors:
                beat["visual_anchors"] = beat_anchors
        # Still enrich the scene-level anchors from the legacy visual_prompt
        # (kept for backward compatibility)

    vp = scene["visual_prompt"]
    nt = scene.get("narration_text", "")

    must_include = extract_objects(vp, nt)
    signature = extract_scene_signature(nt, vp)
    lighting = extract_lighting(vp)
    composition = extract_composition(vp)

    if must_include or signature:
        anchors = {}
        if must_include:
            anchors["must_include"] = must_include
        if signature:
            anchors["scene_signature"] = signature
        if lighting:
            anchors["lighting_override"] = lighting
        if composition:
            anchors["composition"] = composition

        scene["visual_anchors"] = anchors

    return scene


def warn_missing_bg_environment(scenes):
    """Warn about character scenes (pose_variant) that lack bg_environment.

    When visual_prompt IS the character description, stripping the character
    leaves an empty bg-plate prompt. bg_environment provides the fallback.
    """
    warnings = []
    for scene in scenes:
        if not scene.get("pose_variant"):
            continue
        vp = scene.get("visual_prompt", "")
        if not scene.get("bg_environment") and re.search(
            r"Red Nose Pitbull|Pitbull", vp, re.IGNORECASE
        ):
            warnings.append(
                f"  Scene {scene['scene_number']} (pose {scene['pose_variant']}): "
                f"visual_prompt contains character but no bg_environment defined"
            )
    return warnings


def enrich_pipeline(pipeline):
    """Enrich all scenes in a pipeline JSON."""
    enriched = dict(pipeline)
    scenes = enriched.get("scenes", [])
    enriched_count = 0

    for i, scene in enumerate(scenes):
        scenes[i] = enrich_scene(scene)
        if "visual_anchors" in scenes[i]:
            enriched_count += 1

    # Warn about character scenes missing bg_environment
    bg_warnings = warn_missing_bg_environment(scenes)
    if bg_warnings:
        print(f"\n⚠️  {len(bg_warnings)} character scene(s) missing bg_environment:")
        for w in bg_warnings:
            print(w)
        print("   These scenes will produce empty bg-plate prompts in scene-prep.\n")

    enriched["scenes"] = scenes
    return enriched, enriched_count


def preview_anchors(pipeline):
    """Print a preview of what anchors would be added."""
    import copy

    for scene in pipeline.get("scenes", []):
        if scene.get("visual_backend") != "gemini" or not scene.get("visual_prompt"):
            continue

        enriched = enrich_scene(copy.deepcopy(scene))
        anchors = enriched.get("visual_anchors", {})

        if anchors:
            print(f"\n── Scene {scene['scene_number']} ({scene.get('act', '?')}) ──")
            if anchors.get("scene_signature"):
                print(f"  Signature: {anchors['scene_signature']}")
            if anchors.get("must_include"):
                print(f"  Must include: {', '.join(anchors['must_include'])}")
            if anchors.get("lighting_override"):
                print(f"  Lighting: {anchors['lighting_override']}")
            if anchors.get("composition"):
                print(f"  Composition: {anchors['composition']}")

        # Show beat-level anchors
        if enriched.get("visual_beats"):
            print(f"  Beats: {len(enriched['visual_beats'])}")
            for beat in enriched["visual_beats"]:
                ba = beat.get("visual_anchors", {})
                beat_id = beat.get("beat_id", "?")
                ctype = beat.get("concept_type", "?")
                print(f"    {beat_id} ({ctype}): {ba.get('scene_signature', 'no signature')}")
                if ba.get("must_include"):
                    print(f"      Objects: {', '.join(ba['must_include'])}")


def main():
    if len(sys.argv) < 2:
        print("Usage: python enrich_pipeline_anchors.py <input.json> [--output <out.json>] [--dry-run]")
        sys.exit(1)

    input_path = Path(sys.argv[1])
    if not input_path.exists():
        print(f"File not found: {input_path}")
        sys.exit(1)

    dry_run = "--dry-run" in sys.argv
    output_path = None
    if "--output" in sys.argv:
        idx = sys.argv.index("--output")
        if idx + 1 < len(sys.argv):
            output_path = Path(sys.argv[idx + 1])

    with open(input_path) as f:
        pipeline = json.load(f)

    total_gemini = sum(
        1
        for s in pipeline.get("scenes", [])
        if s.get("visual_backend") == "gemini" and s.get("visual_prompt")
    )

    if dry_run:
        print(f"DRY RUN — {total_gemini} Gemini scenes found\n")
        preview_anchors(pipeline)
        return

    enriched, count = enrich_pipeline(pipeline)
    print(f"Enriched {count}/{total_gemini} Gemini scenes with visual_anchors")

    if not output_path:
        # Default: write to same directory with -enriched suffix
        output_path = input_path.parent / (input_path.stem + "-enriched" + input_path.suffix)

    with open(output_path, "w") as f:
        json.dump(enriched, f, indent=2, ensure_ascii=False)

    print(f"Written to: {output_path}")
    print("\n⚠️  Review the enriched file before replacing the original!")
    print("   Look for scenes with weak/generic must_include lists and improve manually.")


if __name__ == "__main__":
    main()
