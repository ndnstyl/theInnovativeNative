#!/usr/bin/env python3
"""
BowTie Scene Compiler — Local prompt compiler + Airtable deployer.

Replaces the n8n Scene Prep workflow. Reads pipeline JSON, assembles
structured prompts, validates everything, and writes directly to Airtable.

Usage:
    python bowtie_scene_compiler.py validate <pipeline.json>
    python bowtie_scene_compiler.py compile  <pipeline.json> [--dry-run] [--format 9:16]
    python bowtie_scene_compiler.py deploy   <pipeline.json> [--append] [--format 9:16]
"""
import os

import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

# ── Airtable Config (same base/table as bowtie_prompt_reviser.py) ──
BASE_ID = "appTO7OCRB2XbAlak"
TABLE_ID = "tblHsBzmt8Skvq2jX"
API_TOKEN = os.environ["AIRTABLE_API_KEY"]
API_BASE = f"https://api.airtable.com/v0/{BASE_ID}/{TABLE_ID}"

# ── Structured prompt slot constants (ported from n8n Code node JS) ──
MEDIUM = (
    "2D cel-shaded illustration, flat color fills, clean ink outlines, "
    "hand-drawn animation frame, Black/African American figures when people appear"
)
TEXTURE = "35mm film grain 20% opacity, high contrast, shallow depth of field"

# ── Act-keyed palette & lighting ──
ACT_MOOD = {
    "ACT_1": {
        "palette": (
            "Near-black #0D0D0F dominant, ONLY rust-orange #9A4C22 sodium vapor accent. "
            "Cold, isolated, no warmth except single light source"
        ),
        "lighting": (
            "Single rust-orange sodium vapor light source, Roger Deakins cinematography, "
            "dramatic hard shadows"
        ),
    },
    "ACT_2A": {
        "palette": (
            "Dark base #1A1A1C disrupted by NEON — buzzing greens #39FF14, hot pinks #FF1493, "
            "predatory commercial energy. Desaturated except neon"
        ),
        "lighting": (
            "Neon sign color spill as primary light, sodium vapor secondary, harsh urban shadows"
        ),
    },
    "ACT_2B": {
        "palette": (
            "Warm amber #D4A843 and honey EMERGING as dominant, dark steel #1E1E20 receding to edges. "
            "Interior warmth, lived-in spaces"
        ),
        "lighting": (
            "Warm practical light from interior sources — barber lamps, kitchen windows, porch lights. "
            "Softer shadows"
        ),
    },
    "ACT_2C": {
        "palette": (
            "Golden hour #D4A843 DOMINANT. Warm, earned, community light. "
            "Steel #1E1E20 at edges only, no longer oppressive"
        ),
        "lighting": "Golden hour directional light, long warm shadows. Hopeful but grounded",
    },
    "ACT_3A": {
        "palette": (
            "Deep sepia and candlelight #C4873B. No modern light sources. "
            "Historical, intimate, aged paper warmth on near-black"
        ),
        "lighting": "Single candlelight source only, warm amber glow, gentle shadows. Reverent",
    },
    "ACT_3B": {
        "palette": (
            "Dawn expanding — bone white #E7E7E1 highlights growing, warm orange horizon. "
            "Steel #1E1E20 at ground level only. Morning energy"
        ),
        "lighting": (
            "Early morning dawn light, warm and expanding from horizon. "
            "Practical interior lighting where applicable. Confident and clear"
        ),
    },
    "UNKNOWN": {
        "palette": (
            "Dark steel #1E1E20, rust-orange #9A4C22 sodium vapor accent, desaturated earth tones"
        ),
        "lighting": "Single rust-orange sodium vapor light source, dramatic hard shadows",
    },
}

# ── Canonical character asset map ──
CANONICAL_MAP = {
    "P1": "tyroneStanding_armsBySide_transparent.png",
    "P2": "tyrone_Standing_armsCrossed_transparent.png",
    "P3": "tyroneFullBody_frontal_transparent.png",
    "P4": "tyroneFullBody_quarterTurn_transparent.png",
    "P5": "tyrone_flexing_biceps_transparent.png",
    "P6": "tyrone_crouching_transparent.png",
}

# ── Format configurations (16:9 default, 9:16 for shorts) ──
FORMAT_CONFIGS = {
    "16:9": {
        "format_str": "16:9 widescreen, cinematic composition",
        "aspect_ratio": "16:9",
        "style_lock_format": "16:9 widescreen",
        "composition_default": "cinematic wide framing",
        "filename_suffix": "",
        "shots": {
            "a": None,
            "b": (
                "Same exact scene and location described above. Camera pushes in to "
                "extreme close-up of the most prominent foreground subject or object. "
                "Background elements remain consistent and visible in soft focus. "
                "Same lighting direction and color temperature"
            ),
            "c": (
                "Same exact scene and location described above. Camera pulls back to "
                "wide establishing shot revealing full environment. Every described "
                "element visible in frame. Same lighting direction and color temperature"
            ),
        },
        "char_shots": {
            "bg-a": {
                "desc": "primary-bg-plate",
                "shot": None,
            },
            "bg-b": {
                "desc": "close-up-bg-plate",
                "shot": (
                    "Same exact scene and location described above. Camera pushes in to "
                    "tight framing suitable for close-up character overlay. Background "
                    "details in soft focus. Same lighting direction and color temperature"
                ),
            },
            "bg-c": {
                "desc": "wide-bg-plate",
                "shot": (
                    "Same exact scene and location described above. Camera pulls back to "
                    "wide establishing shot. Leave compositional space in lower-third for "
                    "character overlay — keep visual weight in upper two-thirds. Same "
                    "lighting direction and color temperature"
                ),
            },
        },
    },
    "9:16": {
        "format_str": "9:16 portrait, vertical composition, subject centered in frame",
        "aspect_ratio": "9:16",
        "style_lock_format": "9:16 vertical portrait",
        "composition_default": "vertical depth, foreground subject fills frame height",
        "filename_suffix": "_v",
        "shots": {
            "a": None,
            "b": (
                "Same scene. Camera pushes in to tight vertical close-up, subject fills "
                "top two-thirds of frame. Background in soft focus. Same lighting "
                "direction and color temperature"
            ),
            "c": (
                "Same scene. Camera pulls back, full vertical environment visible, "
                "subject in lower third. Same lighting direction and color temperature"
            ),
        },
        "char_shots": {
            "bg-a": {
                "desc": "primary-bg-plate",
                "shot": None,
            },
            "bg-b": {
                "desc": "close-up-bg-plate",
                "shot": (
                    "Same scene. Camera pushes in to tight vertical framing for close-up "
                    "character overlay. Subject area fills upper two-thirds. Background "
                    "details in soft focus. Same lighting direction and color temperature"
                ),
            },
            "bg-c": {
                "desc": "wide-bg-plate",
                "shot": (
                    "Same scene. Camera pulls back to full vertical environment. Leave "
                    "compositional space in center for character overlay. Same lighting "
                    "direction and color temperature"
                ),
            },
        },
    },
}

# ── Per-Act B-Roll prompts ──
BROLL_LIBRARY = {
    "ACT_1": {
        "mood": "Dark, isolated, survival",
        "prompts": [
            "City skyline at night, distant sodium vapor glow on low clouds, silhouetted buildings",
            "Rain falling on cracked concrete, pooling in uneven surface, sodium vapor light reflecting in puddles",
            "Chain-link fence shadow pattern cast by streetlight on empty sidewalk",
            "Sodium vapor streetlight pool of orange on empty wet asphalt, darkness beyond",
            "Empty urban street at 3am, single working streetlight, abandoned storefronts",
            "Heavy padlock on rusted chain-link gate, peeling paint, night",
            "Cracked concrete wall with water stains, harsh side-lighting",
            "Distant emergency lights glow reflecting off wet street, no vehicles visible",
            "Wet asphalt reflecting sodium vapor orange, shallow puddles, tire tracks",
            "Lone streetlight illuminating empty intersection, deep shadows all around",
            "Abandoned lot with weeds through concrete, chain-link perimeter, night",
            "Rooftop edge silhouette against distant city glow, dark foreground",
        ],
    },
    "ACT_2A": {
        "mood": "Wry, observational",
        "prompts": [
            "Neon check-cashing sign reflected in wet window, urban night",
            "Surveillance camera mounted on brick corner, harsh overhead light",
            "Liquor store neon signs glowing through dirty glass, iron security bars",
            "Sidewalk cracks in extreme close-up, weeds pushing through, sodium light",
            "Empty bus stop bench under flickering fluorescent shelter light",
            "Graffiti wall in deep shadow, single spray-painted tag illuminated by distant light",
            "Bodega awning dripping rain, neon OPEN sign casting red glow on wet sidewalk",
        ],
    },
    "ACT_2B": {
        "mood": "Warm, building",
        "prompts": [
            "Warm kitchen light spilling through window onto dark exterior wall",
            "Barbershop interior details — leather chair, mirror, warm incandescent light",
            "Golden hour light on urban street, long shadows, warm tones breaking through steel",
            "Concrete stoop with single potted plant, warm light from doorway behind",
            "Dog-eared paperback book open on worn wooden surface, warm lamplight",
            "Coffee steam rising in morning light, cup on windowsill, city visible outside",
            "Warm light through curtain, casting soft pattern on interior wall",
        ],
    },
    "ACT_2C": {
        "mood": "Conviction, community",
        "prompts": [
            "Community garden plot with young plants, chain-link fence, early morning light",
            "Railroad tracks converging to vanishing point, dawn light on horizon",
            "Community bulletin board covered in flyers and notices, pin-light illumination",
            "Sunrise over rooftops, warm orange breaking through dark steel sky",
            "Open book pages in warm directional light, text blurred, moody",
            "Single candle flame in dark room, warm glow on surrounding surfaces",
            "Black hands holding open book, close-up, warm light, brown skin, no face visible",
        ],
    },
    "ACT_3A": {
        "mood": "Historical, reverent",
        "prompts": [
            "Old photograph edges curling, sepia tones, on dark wooden surface",
            "Candlelight flickering on brick wall, warm shadows, reverent mood",
            "Worn book pages extreme close-up, yellowed paper, printed text, soft focus",
            "Old brick building facade, historical architecture, overcast light",
            "Church steeple silhouette against dusk sky, muted colors",
            "Archive texture — stacked old documents, leather binding, dust particles in light beam",
        ],
    },
    "ACT_3B": {
        "mood": "Confident, practical",
        "prompts": [
            "Laptop screen glow in dim room, code or course interface visible, modern",
            "Food truck service window at night, warm interior light, menu board",
            "Apartment windows grid pattern at night, various warm lights in each",
            "Online course interface on screen, progress bar, clean modern design",
            "Garden harvest — fresh vegetables in wooden crate, golden hour light",
            "City panorama from elevated position, dawn, possibility and scale",
            "Stack of books beside laptop, warm desk lamp, study setup",
            "Black hand writing in notebook, close-up, warm lamplight, brown skin, no face",
        ],
    },
}

# ── Character leakage patterns (HARD RULE — zero tolerance) ──
CHARACTER_PATTERNS = [
    re.compile(r"Red\s*Nose\s*Pit\s*bull", re.IGNORECASE),
    re.compile(r"\bPitbull\b", re.IGNORECASE),
    re.compile(r"\bTyrone\b", re.IGNORECASE),
    re.compile(r"\(P[1-6][^)]*\)", re.IGNORECASE),
]

# ── Vignette pattern (HARD RULE — zero tolerance) ──
VIGNETTE_PATTERN = re.compile(r"\bvignette\b", re.IGNORECASE)


# ═══════════════════════════════════════════════════════════════════
# Prompt Builders (ported from n8n Code node JS)
# ═══════════════════════════════════════════════════════════════════


def strip_character(text):
    """HARD RULE: Strip ALL character references from text-to-image prompts."""
    if not text:
        return ""
    result = text
    result = re.sub(r"Red Nose Pit\s*bull[^.,]*", "", result, flags=re.IGNORECASE)
    result = re.sub(r"Pitbull[^.,]*", "", result, flags=re.IGNORECASE)
    result = re.sub(r"Tyrone[^.,]*", "", result, flags=re.IGNORECASE)
    result = re.sub(r"\(P[1-6][^)]*\)", "", result, flags=re.IGNORECASE)
    result = re.sub(
        r"\(P[1-6]\s+(?:variant|silhouette|pose)[^)]*\)", "", result, flags=re.IGNORECASE
    )
    # Clean up double commas and leading/trailing punctuation
    result = re.sub(r",\s*,", ",", result)
    result = re.sub(r"^[\s,]+", "", result)
    result = re.sub(r"[\s,]+$", "", result)
    return result.strip()


def clean_scene_prompt(raw):
    """Strip existing style cues from pipeline visual_prompt (they live in slots now)."""
    if not raw:
        return ""
    cleaned = raw
    # Remove style directives that are now assembled from structured slots
    patterns_to_remove = [
        r",?\s*2D cel-shaded style",
        r",?\s*film grain \d+%",
        r",?\s*(?:heavy|medium|light|soft)\s+vignette",
        r",?\s*vignette",
        r",?\s*16:9\.?",
        r",?\s*1920x1080\.?",
        r",?\s*1280x720\.?",
        r",?\s*Dark steel palette[^.]*?\.",
        r",?\s*Dark steel palette",
        r",?\s*Rust[- ]orange and dark steel only",
        r",?\s*Warm golden tones on dark steel base",
        r",?\s*Dark steel palette with[^,.]+",
        r",?\s*cinematic\.?",
    ]
    for pattern in patterns_to_remove:
        cleaned = re.sub(pattern, "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\.\s*$", "", cleaned).strip()
    # HARD RULE: ALWAYS strip character
    cleaned = strip_character(cleaned)
    return cleaned


def build_beat_prompt(beat, act, fmt_config):
    """Build prompt for a visual beat (narrative concept -> styled prompt)."""
    mood = ACT_MOOD.get(act, ACT_MOOD["UNKNOWN"])
    parts = []

    # 1. Story function as context (character-stripped)
    if beat.get("story_function"):
        parts.append("Story: " + strip_character(beat["story_function"]))

    # 2. Visual concept (character-stripped)
    parts.append(strip_character(beat.get("visual_concept", "")))

    # 3. Art style
    parts.append(MEDIUM)

    # 4. Palette as supporting constraint
    parts.append("Color constraint: " + mood["palette"])

    # 5. Texture + format
    parts.append(TEXTURE)
    parts.append(fmt_config["format_str"])

    return ". ".join(p for p in parts if p) + "."


def build_prompt(scene, shot_override, act, fmt_config):
    """Narrative-first prompt: scene identity FIRST, palette as trailing constraint."""
    mood = ACT_MOOD.get(act, ACT_MOOD["UNKNOWN"])
    anchors = scene.get("visual_anchors") or {}
    vp = scene.get("visual_prompt", "")
    if isinstance(vp, str):
        cleaned = clean_scene_prompt(vp)
    else:
        cleaned = clean_scene_prompt(str(vp))
    parts = []

    # 1. Scene identity
    if anchors.get("scene_signature"):
        sig = strip_character(anchors["scene_signature"])
        if sig:
            parts.append(sig)

    # 2. Must-include objects — front-loaded for Gemini attention
    if anchors.get("must_include") and len(anchors["must_include"]) > 0:
        parts.append("Key visible objects: " + ", ".join(anchors["must_include"]))

    # 3. Scene details
    if cleaned:
        parts.append(cleaned)

    # 4. Composition + shot override
    if anchors.get("composition"):
        parts.append(anchors["composition"])
    if shot_override:
        parts.append(shot_override)

    # 5. Lighting
    parts.append(anchors.get("lighting_override") or mood["lighting"])

    # 6. Art style
    parts.append(MEDIUM)

    # 7. Palette as supporting constraint
    parts.append("Color constraint: " + mood["palette"])

    # 8. Texture + format
    parts.append(TEXTURE)
    parts.append(fmt_config["format_str"])

    # 9. Anchor reinforcement
    if anchors.get("must_include") and len(anchors["must_include"]) > 0:
        parts.append(
            "IMPORTANT: These must be clearly visible: "
            + ", ".join(anchors["must_include"])
        )

    return ". ".join(p for p in parts if p) + "."


# ═══════════════════════════════════════════════════════════════════
# Act Normalization
# ═══════════════════════════════════════════════════════════════════


def normalize_act(act_str):
    """Map scene act string to ACT_MOOD key."""
    if not act_str:
        return "UNKNOWN"
    if "ACT 1" in act_str:
        return "ACT_1"
    if "ACT 2A" in act_str:
        return "ACT_2A"
    if "ACT 2B" in act_str:
        return "ACT_2B"
    if "ACT 2C" in act_str:
        return "ACT_2C"
    if "ACT 3A" in act_str:
        return "ACT_3A"
    if "ACT 3B" in act_str:
        return "ACT_3B"
    return "UNKNOWN"


# ═══════════════════════════════════════════════════════════════════
# Anchor Enrichment (absorbed from enrich_pipeline_anchors.py)
# ═══════════════════════════════════════════════════════════════════

OBJECT_PATTERNS = [
    r"foreclosure notice", r"eviction letter", r"court summons",
    r"lease agreement", r"IRS tax form", r"legal document",
    r"handwritten notes", r"library card", r"city permit sticker",
    r"catering contract", r"community service awards",
    r"newspaper clippings", r"county seal", r"photocopied handouts",
    r"rate sheet", r"receipt", r"budget written in pen",
    r"calendar with .{5,30} circled", r"thank-you notes", r"event flyers",
    r"reading '([^']{3,50})'",
    r"'((?:SINCE|ESTABLISHED|OPEN|CHECKS|RENT|AREA|BLACK|COMMUNITY|GOING|WE|PARKING|ROOM)[^']{0,50})'",
    r"SINCE \d{4}", r"ESTABLISHED \d{4}",
    r"child's (?:shoe|drawing|crayon drawing)", r"overturned porch chair",
    r"dead potted plant", r"heavy padlock", r"padlock and new chain",
    r"straight razor", r"talc powder tin", r"polaroids",
    r"community bulletin board", r"basketball hoop",
    r"sandwich board sign", r"folding (?:metal )?chairs", r"whiteboard",
    r"barber (?:station|chair)", r"food trucks?", r"coffee (?:mug|cup)",
    r"cracked laptop screen", r"laptop screen", r"notebook",
    r"sticky notes", r"ashtray", r"welcome mat",
    r"surveillance cameras?", r"neon .{3,25} sign",
    r"(?:iron )?security bars", r"ATM fee notice",
    r"candle on .{5,30}", r"quill pen", r"leather-bound book",
    r"wax seal", r"finger-drawn letters", r"wheat-paste poster",
    r"sunflower", r"raised beds", r"hand-painted mural",
    r"expensive sneaker", r"cash-counting band", r"graffiti tags?",
    r"storage unit", r"'ROOM FOR RENT' sign",
    r"school lunch bag", r"child's crayon drawing",
]


def extract_objects(visual_prompt):
    """Extract identifiable objects from the visual prompt."""
    if not visual_prompt:
        return []
    found = []
    for pattern in OBJECT_PATTERNS:
        matches = re.findall(pattern, visual_prompt, re.IGNORECASE)
        for match in matches:
            clean = match.strip("'\"., ")
            if clean and len(clean) > 2 and clean.lower() not in [o.lower() for o in found]:
                found.append(clean)
    found.sort(key=lambda x: -len(x))
    return found[:5]


def enrich_scene_anchors(scene):
    """Add visual_anchors to scene if not already present."""
    if scene.get("visual_anchors"):
        return scene  # Already enriched
    if scene.get("visual_backend") != "gemini" or not scene.get("visual_prompt"):
        return scene

    vp = scene["visual_prompt"]
    must_include = extract_objects(vp)
    if must_include:
        scene["visual_anchors"] = {"must_include": must_include}
    return scene


# ═══════════════════════════════════════════════════════════════════
# Record Builders
# ═══════════════════════════════════════════════════════════════════


def build_beat_records(scene, episode_id, fmt_config):
    """Build one Airtable record per visual beat."""
    scene_num = str(scene["scene_number"]).zfill(3)
    act = normalize_act(scene.get("act"))
    anchors = scene.get("visual_anchors") or {}
    scene_signature = anchors.get("scene_signature", "")
    suffix = fmt_config["filename_suffix"]

    records = []
    for beat in scene["visual_beats"]:
        records.append({
            "episode_id": episode_id,
            "scene_number": scene["scene_number"],
            "variant_id": beat["beat_id"],
            "variant_desc": beat.get("concept_type", ""),
            "visual_prompt_full": build_beat_prompt(beat, act, fmt_config),
            "target_filename": f"scene-{scene_num}-beat-{beat['beat_id']}{suffix}.png",
            "generation_status": "ready_for_generation",
            "scene_type": beat.get("concept_type", "literal_scene"),
            "concept_type": beat.get("concept_type", "literal_scene"),
            "act": act,
            "pose_variant": scene.get("pose_variant"),
            "canonical_source": (
                CANONICAL_MAP.get(scene["pose_variant"])
                if scene.get("pose_variant")
                else None
            ),
            "generation_attempts": 0,
            "narrative_anchors": beat.get("story_function", ""),
            "scene_signature": scene_signature,
            "beat_timecode": beat.get("timecode", ""),
            "narration_fragment": beat.get("narration_fragment", ""),
            "format_variant": fmt_config["aspect_ratio"],
        })
    return records


def build_variants(scene, episode_id, fmt_config):
    """Build 3 variant records for legacy scenes (no visual_beats)."""
    is_char = bool(scene.get("pose_variant"))
    scene_num = str(scene["scene_number"]).zfill(3)
    act = normalize_act(scene.get("act"))
    anchors = scene.get("visual_anchors") or {}
    narrative_anchors = ", ".join(anchors.get("must_include", []))
    scene_signature = anchors.get("scene_signature", "")
    suffix = fmt_config["filename_suffix"]

    if is_char:
        # Character scenes: generate bg plate variants for compositing
        canonical_file = CANONICAL_MAP.get(
            scene["pose_variant"], CANONICAL_MAP["P1"]
        )
        bg_prompt_base = scene.get("bg_environment") or clean_scene_prompt(
            scene.get("visual_prompt", "")
        )
        bg_scene = dict(scene)
        bg_scene["visual_prompt"] = (
            bg_prompt_base
            + ". Environment and atmosphere only, empty scene, no characters, no dogs, no animals"
        )

        records = []
        for var_id, config in fmt_config["char_shots"].items():
            records.append({
                "episode_id": episode_id,
                "scene_number": scene["scene_number"],
                "variant_id": var_id,
                "variant_desc": config["desc"],
                "visual_prompt_full": build_prompt(
                    bg_scene, config["shot"], act, fmt_config
                ),
                "target_filename": f"scene-{scene_num}-{var_id}{suffix}.png",
                "generation_status": "ready_for_generation",
                "scene_type": "environment",
                "concept_type": "literal_scene",
                "act": act,
                "pose_variant": scene.get("pose_variant"),
                "canonical_source": canonical_file,
                "generation_attempts": 0,
                "narrative_anchors": narrative_anchors,
                "scene_signature": scene_signature,
                "format_variant": fmt_config["aspect_ratio"],
            })
        return records

    # Non-character scenes: 3 shot variants
    shots = fmt_config["shots"]
    records = []
    for shot_id, shot_override in shots.items():
        desc_map = {"a": "primary", "b": "close-up", "c": "wide"}
        records.append({
            "episode_id": episode_id,
            "scene_number": scene["scene_number"],
            "variant_id": shot_id,
            "variant_desc": desc_map.get(shot_id, shot_id),
            "visual_prompt_full": build_prompt(scene, shot_override, act, fmt_config),
            "target_filename": f"scene-{scene_num}-{shot_id}{suffix}.png",
            "generation_status": "ready_for_generation",
            "scene_type": (
                "environment"
                if scene.get("scene_type") == "narration_stills"
                else "detail"
            ),
            "concept_type": "literal_scene",
            "act": act,
            "pose_variant": None,
            "canonical_source": None,
            "generation_attempts": 0,
            "narrative_anchors": narrative_anchors,
            "scene_signature": scene_signature,
            "format_variant": fmt_config["aspect_ratio"],
        })
    return records


# ═══════════════════════════════════════════════════════════════════
# Compile Pipeline -> Records
# ═══════════════════════════════════════════════════════════════════


def compile_pipeline(pipeline, fmt="16:9"):
    """Compile a pipeline JSON into Airtable-ready records."""
    fmt_config = FORMAT_CONFIGS[fmt]
    scenes = pipeline.get("scenes", [])
    episode_id = pipeline.get("episode_id", "EP-001")
    suffix = fmt_config["filename_suffix"]

    all_records = []
    stats = {
        "character": 0,
        "environment": 0,
        "detail": 0,
        "remotion": 0,
        "transition": 0,
        "broll": 0,
        "beats": 0,
    }

    for scene in scenes:
        # Enrich anchors if missing
        scene = enrich_scene_anchors(scene)

        if not scene.get("visual_prompt") or scene.get("visual_backend") != "gemini":
            if scene.get("visual_backend") == "remotion":
                stats["remotion"] += 1
            elif not scene.get("visual_prompt") and not scene.get("visual_backend"):
                stats["transition"] += 1
            continue

        # Beat-decomposed scenes
        if scene.get("visual_beats") and len(scene["visual_beats"]) > 0:
            beat_records = build_beat_records(scene, episode_id, fmt_config)
            stats["beats"] += len(beat_records)
            all_records.extend(beat_records)
            continue

        # Legacy scenes
        variants = build_variants(scene, episode_id, fmt_config)
        scene_type = variants[0]["scene_type"] if variants else "detail"
        stats[scene_type] = stats.get(scene_type, 0) + len(variants)
        all_records.extend(variants)

    # B-Roll records
    for act, data in BROLL_LIBRARY.items():
        for idx, prompt in enumerate(data["prompts"]):
            broll_num = str(idx + 1).zfill(2)
            act_lower = act.lower().replace("_", "")
            broll_scene = {"visual_prompt": prompt}
            all_records.append({
                "episode_id": episode_id,
                "scene_number": None,
                "variant_id": broll_num,
                "variant_desc": f"broll-{data['mood'].lower().split(',')[0].strip()}",
                "visual_prompt_full": build_prompt(
                    broll_scene, None, act, fmt_config
                ),
                "target_filename": f"broll-{act_lower}-{broll_num}{suffix}.png",
                "generation_status": "ready_for_generation",
                "scene_type": "broll",
                "concept_type": "literal_scene",
                "act": act,
                "pose_variant": None,
                "canonical_source": None,
                "generation_attempts": 0,
                "narrative_anchors": "",
                "scene_signature": "",
                "format_variant": fmt_config["aspect_ratio"],
            })
            stats["broll"] += 1

    # Timeline ordering: scenes by act, b-roll at act boundaries
    scene_recs = [r for r in all_records if r["scene_type"] != "broll"]
    broll_recs = [r for r in all_records if r["scene_type"] == "broll"]
    broll_by_act = {}
    for br in broll_recs:
        broll_by_act.setdefault(br["act"], []).append(br)

    timeline = []
    prev_act = None
    for rec in scene_recs:
        if prev_act and rec["act"] != prev_act and prev_act in broll_by_act:
            timeline.extend(broll_by_act.pop(prev_act))
        timeline.append(rec)
        prev_act = rec["act"]
    # Last act's b-roll
    if prev_act and prev_act in broll_by_act:
        timeline.extend(broll_by_act.pop(prev_act))
    # Orphan b-roll
    for remaining in broll_by_act.values():
        timeline.extend(remaining)

    # Prefix each filename with 4-digit sequence
    for i, rec in enumerate(timeline):
        seq = str(i + 1).zfill(4)
        rec["target_filename"] = f"{seq}-{rec['target_filename']}"
        rec["timeline_sequence"] = i + 1

    return timeline, stats


# ═══════════════════════════════════════════════════════════════════
# Validators
# ═══════════════════════════════════════════════════════════════════


def validate_no_character_leakage(records):
    """Scan every visual_prompt_full for character references. Zero tolerance."""
    errors = []
    for rec in records:
        prompt = rec.get("visual_prompt_full", "")
        for pattern in CHARACTER_PATTERNS:
            match = pattern.search(prompt)
            if match:
                errors.append(
                    f"  LEAKAGE in scene {rec.get('scene_number', '?')} "
                    f"({rec.get('variant_id', '?')}): found '{match.group()}'"
                )
    return errors


def validate_no_vignette(records):
    """Scan every visual_prompt_full for 'vignette'. Zero tolerance."""
    errors = []
    for rec in records:
        prompt = rec.get("visual_prompt_full", "")
        match = VIGNETTE_PATTERN.search(prompt)
        if match:
            errors.append(
                f"  VIGNETTE in scene {rec.get('scene_number', '?')} "
                f"({rec.get('variant_id', '?')}): found '{match.group()}'"
            )
    return errors


def validate_act_coverage(records):
    """Every record must map to a known ACT_MOOD key."""
    errors = []
    for rec in records:
        act = rec.get("act", "")
        if act == "UNKNOWN":
            errors.append(
                f"  UNKNOWN act for scene {rec.get('scene_number', '?')} "
                f"({rec.get('variant_id', '?')})"
            )
    return errors


def validate_airtable_schema(expected_fields):
    """Pre-flight: check that all fields we want to write exist in Airtable."""
    url = f"https://api.airtable.com/v0/meta/bases/{BASE_ID}/tables"
    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
    }
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            meta = json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        return [f"  Could not fetch schema: HTTP {e.code} — {e.read().decode()[:200]}"]

    # Find our table
    table = None
    for t in meta.get("tables", []):
        if t["id"] == TABLE_ID:
            table = t
            break
    if not table:
        return [f"  Table {TABLE_ID} not found in base {BASE_ID}"]

    existing_fields = {f["name"] for f in table.get("fields", [])}
    missing = [f for f in expected_fields if f not in existing_fields]
    if missing:
        return [f"  Missing Airtable field: '{f}'" for f in missing]
    return []


def run_all_validations(records):
    """Run all validation gates. Returns (errors, warnings)."""
    errors = []
    warnings = []

    # 1. Character leakage (BLOCKING)
    char_errors = validate_no_character_leakage(records)
    if char_errors:
        errors.append("CHARACTER LEAKAGE DETECTED (deployment blocked):")
        errors.extend(char_errors)

    # 2. Vignette (BLOCKING)
    vig_errors = validate_no_vignette(records)
    if vig_errors:
        errors.append("VIGNETTE DETECTED (deployment blocked):")
        errors.extend(vig_errors)

    # 3. Act coverage (BLOCKING)
    act_errors = validate_act_coverage(records)
    if act_errors:
        errors.append("UNKNOWN ACT MAPPING (deployment blocked):")
        errors.extend(act_errors)

    # 4. Schema pre-flight (BLOCKING)
    expected_fields = [
        "episode_id", "scene_number", "variant_id", "variant_desc",
        "visual_prompt_full", "target_filename", "generation_status",
        "scene_type", "concept_type", "act", "pose_variant",
        "canonical_source", "generation_attempts", "narrative_anchors",
        "scene_signature", "timeline_sequence", "beat_timecode",
        "narration_fragment", "format_variant",
    ]
    schema_errors = validate_airtable_schema(expected_fields)
    if schema_errors:
        errors.append("AIRTABLE SCHEMA ERRORS (deployment blocked):")
        errors.extend(schema_errors)

    return errors, warnings


# ═══════════════════════════════════════════════════════════════════
# Airtable API
# ═══════════════════════════════════════════════════════════════════


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
        time.sleep(0.25)


def clear_episode_records(episode_id, format_variant=None):
    """Delete all existing records for an episode (and optionally a format)."""
    formula = f'{{episode_id}}="{episode_id}"'
    if format_variant:
        formula = f'AND({{episode_id}}="{episode_id}", {{format_variant}}="{format_variant}")'

    label = f"{episode_id}"
    if format_variant:
        label += f" format={format_variant}"
    print(f"  Clearing existing records for {label}...")

    # Fetch all record IDs
    all_ids = []
    offset = None
    while True:
        url = API_BASE + "?"
        params = [f"filterByFormula={urllib.parse.quote(formula)}", "fields%5B%5D=episode_id"]
        if offset:
            params.append(f"offset={offset}")
        url += "&".join(params)
        result = api_request(url)
        if not result:
            break
        all_ids.extend(r["id"] for r in result.get("records", []))
        offset = result.get("offset")
        if not offset:
            break

    if not all_ids:
        print("  No existing records found.")
        return 0

    # Batch delete (10 per request)
    deleted = 0
    for i in range(0, len(all_ids), 10):
        batch = all_ids[i : i + 10]
        params = "&".join(f"records[]={rid}" for rid in batch)
        url = f"{API_BASE}?{params}"
        result = api_request(url, method="DELETE")
        if result:
            deleted += len(batch)
        time.sleep(0.25)

    print(f"  Deleted {deleted} existing records.")
    return deleted


def batch_create_records(records):
    """Create records in Airtable in batches of 10."""
    created = 0
    for i in range(0, len(records), 10):
        batch = records[i : i + 10]
        payload = {
            "records": [{"fields": rec} for rec in batch],
        }
        result = api_request(API_BASE, data=payload, method="POST")
        if result and "records" in result:
            created += len(result["records"])
            print(f"  Created batch {i // 10 + 1}: {len(result['records'])} records")
        else:
            print(f"  FAILED batch {i // 10 + 1}")
        time.sleep(0.25)
    return created


# ═══════════════════════════════════════════════════════════════════
# CLI Commands
# ═══════════════════════════════════════════════════════════════════


def cmd_validate(pipeline_path, fmt):
    """Validate only — check schema, character leakage, acts — no writes."""
    with open(pipeline_path) as f:
        pipeline = json.load(f)

    print(f"Compiling {pipeline_path} (format: {fmt})...")
    records, stats = compile_pipeline(pipeline, fmt)
    print(f"  Compiled {len(records)} records")
    print(f"  Stats: {json.dumps(stats)}")

    print("\nRunning validation gates...")
    errors, warnings = run_all_validations(records)

    if warnings:
        print("\nWarnings:")
        for w in warnings:
            print(f"  {w}")

    if errors:
        print("\nERRORS (deployment would be blocked):")
        for e in errors:
            print(f"  {e}")
        return False

    print("\nAll validations passed.")
    return True


def cmd_compile(pipeline_path, fmt, dry_run=True, output_path=None):
    """Compile and preview records (dry-run by default)."""
    with open(pipeline_path) as f:
        pipeline = json.load(f)

    print(f"Compiling {pipeline_path} (format: {fmt})...")
    records, stats = compile_pipeline(pipeline, fmt)

    print(f"\n  Record counts:")
    print(f"    Beat records:    {stats['beats']}")
    print(f"    Environment:     {stats['environment']}")
    print(f"    Character:       {stats['character']}")
    print(f"    Detail:          {stats['detail']}")
    print(f"    B-roll:          {stats['broll']}")
    print(f"    Remotion (skip): {stats['remotion']}")
    print(f"    Transition:      {stats['transition']}")
    print(f"    TOTAL:           {len(records)}")

    # Run validations
    print("\nRunning validation gates...")
    errors, warnings = run_all_validations(records)

    if warnings:
        print("\nWarnings:")
        for w in warnings:
            print(w)

    if errors:
        print("\nERRORS:")
        for e in errors:
            print(e)
        print("\nCompilation has errors. Fix before deploying.")
        return None

    print("\nAll validations passed.")

    if dry_run:
        # Output to stdout or file
        if output_path:
            with open(output_path, "w") as f:
                json.dump(records, f, indent=2, ensure_ascii=False)
            print(f"\nDry-run output written to: {output_path}")
        else:
            print(f"\n--- First 3 records (of {len(records)}) ---")
            for rec in records[:3]:
                print(json.dumps(rec, indent=2))
                print("---")
            print(f"(Use --output <file> to save all {len(records)} records)")

    return records


def cmd_deploy(pipeline_path, fmt, append=False):
    """Deploy: validate, clear old records, write to Airtable."""
    with open(pipeline_path) as f:
        pipeline = json.load(f)

    episode_id = pipeline.get("episode_id", "EP-001")
    print(f"Compiling {pipeline_path} (format: {fmt}, episode: {episode_id})...")
    records, stats = compile_pipeline(pipeline, fmt)

    print(f"\n  TOTAL records to deploy: {len(records)}")
    print(f"  Stats: beats={stats['beats']}, env={stats['environment']}, "
          f"char={stats['character']}, detail={stats['detail']}, broll={stats['broll']}")

    # Run validations
    print("\nRunning validation gates...")
    errors, warnings = run_all_validations(records)

    if warnings:
        print("\nWarnings:")
        for w in warnings:
            print(w)

    if errors:
        print("\nERRORS — DEPLOYMENT BLOCKED:")
        for e in errors:
            print(e)
        sys.exit(1)

    print("\nAll validations passed.")

    # Clear stale records unless --append
    if not append:
        clear_episode_records(episode_id, format_variant=fmt)
    else:
        print("  --append mode: skipping record cleanup")

    # Deploy
    print(f"\nDeploying {len(records)} records to Airtable...")
    created = batch_create_records(records)
    print(f"\nDone. Created {created}/{len(records)} records.")

    if created < len(records):
        print(f"WARNING: {len(records) - created} records failed to create!")
        sys.exit(1)


# ═══════════════════════════════════════════════════════════════════
# Main
# ═══════════════════════════════════════════════════════════════════


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)

    command = sys.argv[1]
    pipeline_path = sys.argv[2]

    if not Path(pipeline_path).exists():
        print(f"File not found: {pipeline_path}")
        sys.exit(1)

    # Parse flags
    fmt = "16:9"
    if "--format" in sys.argv:
        idx = sys.argv.index("--format")
        if idx + 1 < len(sys.argv):
            fmt = sys.argv[idx + 1]
    if fmt not in FORMAT_CONFIGS:
        print(f"Unknown format: {fmt}. Supported: {', '.join(FORMAT_CONFIGS.keys())}")
        sys.exit(1)

    dry_run = "--dry-run" in sys.argv
    append = "--append" in sys.argv
    output_path = None
    if "--output" in sys.argv:
        idx = sys.argv.index("--output")
        if idx + 1 < len(sys.argv):
            output_path = sys.argv[idx + 1]

    if command == "validate":
        success = cmd_validate(pipeline_path, fmt)
        sys.exit(0 if success else 1)
    elif command == "compile":
        cmd_compile(pipeline_path, fmt, dry_run=dry_run, output_path=output_path)
    elif command == "deploy":
        cmd_deploy(pipeline_path, fmt, append=append)
    else:
        print(f"Unknown command: {command}")
        print(__doc__)
        sys.exit(1)


if __name__ == "__main__":
    main()