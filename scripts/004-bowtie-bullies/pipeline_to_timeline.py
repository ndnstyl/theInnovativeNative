#!/usr/bin/env python3
"""
pipeline_to_timeline.py — BowTie Bullies Pipeline-to-Timeline Converter

Transforms scene-based pipeline.json into track-based timeline.json (EDL)
for consumption by timeline_to_ffmpeg.py.

Pipeline (stage 1): Scenes with narration, visual, sfx, music, duration
Timeline (stage 2): Tracks — video, voiceover, sfx, music, silence

Usage:
  python scripts/pipeline_to_timeline.py pipeline.json
  python scripts/pipeline_to_timeline.py pipeline.json --output timeline.json
  python scripts/pipeline_to_timeline.py pipeline.json --dry-run
  python scripts/pipeline_to_timeline.py pipeline.json --validate --assets-dir assets/EP-001
"""

import json
import sys
import argparse
import os
import re
from pathlib import Path
from typing import Any, Dict, List, Optional


# ---------------------------------------------------------------------------
# Defaults
# ---------------------------------------------------------------------------

INTRO_DURATION = 3.5       # seconds — pre-rendered intro clip
OUTRO_DURATION = 7.0       # seconds — pre-rendered outro clip
VO_LEVEL_DB = -13          # standard voiceover level
SFX_BED_LEVEL_DB = -24     # default ambient bed level
SFX_EVENT_LEVEL_DB = -28   # default event SFX level (overridden by scene)
SILENCE_MUSIC_LEVEL_DB = -40  # music ducking during silence gaps
KEN_BURNS_ZOOM_START = 1.0
KEN_BURNS_ZOOM_END = 1.08
VO_SPLIT_GAP = 2.0         # seconds gap between split VO files
DEFAULT_FPS = 24


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def parse_duration_ms(value: str) -> float:
    """Parse a duration string like '1500ms' or '2s' into seconds."""
    if value is None:
        return 0.0
    value = str(value).strip().lower()
    if value.endswith("ms"):
        return float(value.replace("ms", "")) / 1000.0
    if value.endswith("s"):
        return float(value.replace("s", ""))
    # Bare number — assume milliseconds
    try:
        return float(value) / 1000.0
    except ValueError:
        return 0.0


def parse_db(value: str) -> float:
    """Parse a level string like '-28dB' into a float."""
    if value is None:
        return 0.0
    value = str(value).strip().lower()
    value = value.replace("db", "")
    try:
        return float(value)
    except ValueError:
        return 0.0


def parse_trigger(value: str) -> float:
    """Parse a trigger offset like '0.0s' or '10.0s' into seconds."""
    if value is None:
        return 0.0
    value = str(value).strip().lower()
    value = value.replace("s", "")
    try:
        return float(value)
    except ValueError:
        return 0.0


def scene_id(num: int) -> str:
    """Format scene number as zero-padded string: 1 -> '001'."""
    return f"{num:03d}"


def resolve_visual_reuse(scene: dict, scenes_by_number: dict) -> int:
    """Resolve visual_reuse reference to a scene number.

    Accepts formats: 'scene_9', 'scene-9', '9', 9
    """
    ref = scene.get("visual_reuse")
    if ref is None:
        return scene["scene_number"]
    ref_str = str(ref).strip().lower()
    # Extract trailing number
    match = re.search(r"(\d+)$", ref_str)
    if match:
        return int(match.group(1))
    return scene["scene_number"]


# ---------------------------------------------------------------------------
# Core conversion
# ---------------------------------------------------------------------------

def load_pipeline(path: str) -> dict:
    """Load and validate a pipeline JSON file."""
    with open(path, "r") as f:
        data = json.load(f)

    if "scenes" not in data:
        raise ValueError("Pipeline JSON missing 'scenes' array")
    if "episode_id" not in data:
        raise ValueError("Pipeline JSON missing 'episode_id'")

    return data


def compute_scene_timestamps(scenes: list) -> List[dict]:
    """Walk scenes and compute cumulative start/end times.

    Returns list of dicts with scene data plus 'start', 'end', 'pause_duration'.
    The timeline starts at 0.0 (after the intro, which occupies negative time).
    """
    cursor = 0.0
    result = []

    for scene in scenes:
        duration = float(scene.get("duration_seconds", 0))
        pause = parse_duration_ms(scene.get("pause_after", "0ms"))

        entry = {
            **scene,
            "_start": cursor,
            "_end": cursor + duration,
            "_pause_duration": pause,
        }
        result.append(entry)
        cursor += duration + pause

    return result


def build_video_track(
    timed_scenes: List[dict],
    episode_id: str,
    scenes_by_number: dict,
) -> List[dict]:
    """Build the video track from timed scenes."""
    track = []
    vid_counter = 0

    # Intro clip (occupies negative time: -INTRO_DURATION to 0.0)
    track.append({
        "id": "v-intro",
        "type": "video",
        "source": f"out/bowtie/intro-16x9.mov",
        "in": -INTRO_DURATION,
        "out": 0.0,
    })
    vid_counter += 1

    for ts in timed_scenes:
        num = ts["scene_number"]
        sid = scene_id(num)
        backend = ts.get("visual_backend")
        start = ts["_start"]
        end = ts["_end"]

        if backend == "gemini":
            # Resolve visual_reuse if present
            source_num = resolve_visual_reuse(ts, scenes_by_number)
            source_sid = scene_id(source_num)
            clip = {
                "id": f"v-{sid}",
                "type": "ken_burns",
                "source": f"assets/{episode_id}/scene-{source_sid}.png",
                "in": start,
                "out": end,
                "ken_burns": {
                    "zoom_start": KEN_BURNS_ZOOM_START,
                    "zoom_end": KEN_BURNS_ZOOM_END,
                },
            }
            track.append(clip)
            vid_counter += 1

        elif backend == "remotion":
            clip = {
                "id": f"v-{sid}",
                "type": "remotion_overlay",
                "source": f"out/bowtie/{episode_id}-scene-{sid}.mov",
                "composition": ts.get("remotion_composition", ""),
                "props": ts.get("remotion_props", {}),
                "in": start,
                "out": end,
            }
            track.append(clip)
            vid_counter += 1

        elif backend is None:
            # transition_beat or similar — black gap, still needs a video entry
            # for the FFMPEG concat to stay in sync
            if ts.get("scene_type") == "transition_beat":
                clip = {
                    "id": f"v-{sid}",
                    "type": "ken_burns",
                    "source": "assets/black.png",
                    "in": start,
                    "out": end,
                    "ken_burns": {
                        "zoom_start": 1.0,
                        "zoom_end": 1.0,
                    },
                }
                track.append(clip)
                vid_counter += 1

    # Outro clip (appended after last scene + its pause)
    if timed_scenes:
        last = timed_scenes[-1]
        outro_start = last["_end"] + last["_pause_duration"]
    else:
        outro_start = 0.0

    track.append({
        "id": "v-outro",
        "type": "video",
        "source": f"out/bowtie/outro-16x9.mov",
        "in": outro_start,
        "out": outro_start + OUTRO_DURATION,
    })

    return track


def build_voiceover_track(
    timed_scenes: List[dict],
    episode_id: str,
) -> List[dict]:
    """Build the voiceover track. Only scenes with narration_text."""
    track = []

    for ts in timed_scenes:
        if not ts.get("narration_text"):
            continue

        num = ts["scene_number"]
        sid = scene_id(num)
        start = ts["_start"]

        if ts.get("vo_split"):
            # Split into two VO files with a gap
            track.append({
                "id": f"vo-{sid}-a",
                "source": f"assets/{episode_id}/vo/scene-{sid}-a.wav",
                "in": start,
                "level_db": VO_LEVEL_DB,
            })
            # Second part starts after first part + gap.
            # We estimate the split point at the midpoint of the scene duration.
            # The actual split depends on TTS output length, but we use a
            # reasonable default: half the scene duration for part A, then gap,
            # then part B occupies the rest.
            half = ts.get("duration_seconds", 0) / 2.0
            part_b_start = start + half + VO_SPLIT_GAP
            track.append({
                "id": f"vo-{sid}-b",
                "source": f"assets/{episode_id}/vo/scene-{sid}-b.wav",
                "in": part_b_start,
                "level_db": VO_LEVEL_DB,
            })
        else:
            track.append({
                "id": f"vo-{sid}",
                "source": f"assets/{episode_id}/vo/scene-{sid}.wav",
                "in": start,
                "level_db": VO_LEVEL_DB,
            })

    return track


def build_sfx_track(
    timed_scenes: List[dict],
) -> List[dict]:
    """Build the SFX track from beds and events."""
    track = []
    sfx_counter = 0

    for ts in timed_scenes:
        num = ts["scene_number"]
        sid = scene_id(num)
        start = ts["_start"]

        # SFX bed (ambient)
        bed = ts.get("sfx_bed", "none")
        if bed and bed.lower() != "none":
            sfx_counter += 1
            track.append({
                "id": f"sfx-{sid}-{bed}",
                "source": f"projects/004-bowtie-bullies/media/SFX/{bed}.wav",
                "in": start,
                "level_db": SFX_BED_LEVEL_DB,
                "type": "bed",
            })

        # SFX events
        for evt in ts.get("sfx_events", []):
            sfx_counter += 1
            sfx_name = evt.get("sfx", "unknown")
            trigger_offset = parse_trigger(evt.get("trigger", "0.0s"))
            level = parse_db(evt.get("level", f"{SFX_EVENT_LEVEL_DB}dB"))

            track.append({
                "id": f"sfx-{sid}-{sfx_name}",
                "source": f"projects/004-bowtie-bullies/media/SFX/{sfx_name}.wav",
                "in": start + trigger_offset,
                "level_db": level,
                "type": "event",
            })

    return track


def build_music_track(
    timed_scenes: List[dict],
) -> List[dict]:
    """Build the music track by grouping consecutive scenes with same mood."""
    track = []

    if not timed_scenes:
        return track

    # Group consecutive scenes by music_mood
    groups = []
    current_mood = None
    current_start = None
    current_level = None

    for ts in timed_scenes:
        mood = ts.get("music_mood")
        if mood is None:
            # No music for this scene — close current group
            if current_mood is not None:
                groups.append({
                    "mood": current_mood,
                    "start": current_start,
                    "end": ts["_start"],  # end at this scene's start
                    "level_db": current_level,
                })
                current_mood = None
            continue

        level = parse_db(ts.get("music_level", "-28dB"))

        if mood == current_mood:
            # Extend current group — use the louder (less negative) level
            if level > current_level:
                current_level = level
        else:
            # Close previous group
            if current_mood is not None:
                groups.append({
                    "mood": current_mood,
                    "start": current_start,
                    "end": ts["_start"],
                    "level_db": current_level,
                })
            # Start new group
            current_mood = mood
            current_start = ts["_start"]
            current_level = level

    # Close final group
    if current_mood is not None:
        last = timed_scenes[-1]
        groups.append({
            "mood": current_mood,
            "start": current_start,
            "end": last["_end"] + last["_pause_duration"],
            "level_db": current_level,
        })

    # Convert groups to track entries
    mus_counter = 0
    for grp in groups:
        mus_counter += 1
        track.append({
            "id": f"mus-{grp['mood']}-{mus_counter:03d}",
            "source": f"projects/004-bowtie-bullies/media/music/{grp['mood']}.wav",
            "in": grp["start"],
            "level_db": grp["level_db"],
        })

    return track


def build_silence_track(
    timed_scenes: List[dict],
) -> List[dict]:
    """Build silence track from transition_beat scenes and pause_after gaps."""
    track = []
    sil_counter = 0

    for ts in timed_scenes:
        num = ts["scene_number"]
        sid = scene_id(num)

        # Transition beat scenes are full silence gaps
        if ts.get("scene_type") == "transition_beat":
            sil_counter += 1
            track.append({
                "id": f"sil-{sid}",
                "in": ts["_start"],
                "duration": float(ts.get("duration_seconds", 0)),
                "music_level_db": SILENCE_MUSIC_LEVEL_DB,
            })

        # pause_after gaps (inter-scene silence)
        pause = ts["_pause_duration"]
        if pause > 0:
            sil_counter += 1
            pause_start = ts["_end"]
            track.append({
                "id": f"sil-pause-{sid}",
                "in": pause_start,
                "duration": pause,
                "music_level_db": SILENCE_MUSIC_LEVEL_DB,
            })

    return track


# ---------------------------------------------------------------------------
# Main conversion
# ---------------------------------------------------------------------------

def convert_pipeline_to_timeline(
    pipeline: dict,
    assets_dir: Optional[str] = None,
) -> dict:
    """Convert a scene-based pipeline to a track-based timeline EDL."""
    episode_id = pipeline["episode_id"]
    scenes = pipeline["scenes"]

    # Build lookup by scene number
    scenes_by_number = {s["scene_number"]: s for s in scenes}

    # Compute timestamps
    timed_scenes = compute_scene_timestamps(scenes)

    # Compute total duration (last scene end + pause + outro)
    if timed_scenes:
        last = timed_scenes[-1]
        total_content = last["_end"] + last["_pause_duration"]
    else:
        total_content = 0.0
    total_with_bookends = INTRO_DURATION + total_content + OUTRO_DURATION

    # Build all tracks
    video_track = build_video_track(timed_scenes, episode_id, scenes_by_number)
    vo_track = build_voiceover_track(timed_scenes, episode_id)
    sfx_track = build_sfx_track(timed_scenes)
    music_track = build_music_track(timed_scenes)
    silence_track = build_silence_track(timed_scenes)

    timeline = {
        "episode_id": episode_id,
        "title": pipeline.get("title", ""),
        "fps": DEFAULT_FPS,
        "target_duration_seconds": pipeline.get(
            "target_duration_seconds",
            round(total_with_bookends),
        ),
        "computed_duration_seconds": round(total_with_bookends, 2),
        "tracks": {
            "video": video_track,
            "voiceover": vo_track,
            "sfx": sfx_track,
            "music": music_track,
            "silence": silence_track,
        },
        "master_output": {
            "codec_video": "libx264",
            "crf": 18,
            "codec_audio": "aac",
            "bitrate_audio": "128k",
            "normalization": "-14 LUFS",
            "true_peak": "-1 dBTP",
            "color_grade": "eq=saturation=0.75:contrast=1.15:brightness=-0.03",
        },
    }

    return timeline


# ---------------------------------------------------------------------------
# Validation
# ---------------------------------------------------------------------------

def validate_assets(timeline: dict, base_dir: str) -> List[str]:
    """Check that all referenced asset files exist on disk.

    Returns list of missing file paths.
    """
    missing = []
    base = Path(base_dir)

    def check(source: str):
        # Resolve relative to base_dir's parent (project root)
        p = base.parent / source if not os.path.isabs(source) else Path(source)
        # Also try relative to CWD
        if not p.exists():
            p_cwd = Path(source)
            if not p_cwd.exists():
                missing.append(source)

    for clip in timeline["tracks"].get("video", []):
        check(clip.get("source", ""))

    for clip in timeline["tracks"].get("voiceover", []):
        check(clip.get("source", ""))

    for clip in timeline["tracks"].get("sfx", []):
        check(clip.get("source", ""))

    for clip in timeline["tracks"].get("music", []):
        check(clip.get("source", ""))

    return missing


# ---------------------------------------------------------------------------
# Summary stats
# ---------------------------------------------------------------------------

def print_summary(timeline: dict):
    """Print a human-readable summary of the timeline."""
    tracks = timeline["tracks"]

    print(f"Episode:    {timeline['episode_id']}")
    print(f"Title:      {timeline.get('title', 'N/A')}")
    print(f"FPS:        {timeline['fps']}")
    print(f"Target:     {timeline.get('target_duration_seconds', 'N/A')}s")
    print(f"Computed:   {timeline.get('computed_duration_seconds', 'N/A')}s")
    print()

    video = tracks.get("video", [])
    vo = tracks.get("voiceover", [])
    sfx = tracks.get("sfx", [])
    music = tracks.get("music", [])
    silence = tracks.get("silence", [])

    print(f"Video clips:     {len(video)}")
    kb_count = sum(1 for c in video if c.get("type") == "ken_burns")
    rem_count = sum(1 for c in video if c.get("type") == "remotion_overlay")
    vid_count = sum(1 for c in video if c.get("type") == "video")
    print(f"  Ken Burns:     {kb_count}")
    print(f"  Remotion:      {rem_count}")
    print(f"  Video (intro/outro): {vid_count}")
    print()

    print(f"VO clips:        {len(vo)}")
    print(f"SFX clips:       {len(sfx)}")
    bed_count = sum(1 for s in sfx if s.get("type") == "bed")
    evt_count = sum(1 for s in sfx if s.get("type") == "event")
    print(f"  Beds:          {bed_count}")
    print(f"  Events:        {evt_count}")
    print()

    print(f"Music cues:      {len(music)}")
    for m in music:
        print(f"  {m['id']:24s}  in={m['in']:.1f}s  level={m['level_db']}dB")
    print()

    print(f"Silence gaps:    {len(silence)}")
    total_silence = sum(s.get("duration", 0) for s in silence)
    print(f"  Total silence: {total_silence:.1f}s")

    # Unique source files
    all_sources = set()
    for track_name in ["video", "voiceover", "sfx", "music"]:
        for clip in tracks.get(track_name, []):
            src = clip.get("source")
            if src:
                all_sources.add(src)
    print(f"\nUnique asset files: {len(all_sources)}")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Convert scene-based pipeline.json to track-based timeline.json"
    )
    parser.add_argument(
        "pipeline",
        help="Path to pipeline JSON file",
    )
    parser.add_argument(
        "--output", "-o",
        default=None,
        help="Output timeline JSON path (default: <episode_id>-timeline.json)",
    )
    parser.add_argument(
        "--assets-dir",
        default=None,
        help="Assets directory for validation (e.g. assets/EP-001)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print summary stats without writing output",
    )
    parser.add_argument(
        "--validate",
        action="store_true",
        help="Check for missing asset files on disk",
    )
    parser.add_argument(
        "--pretty",
        action="store_true",
        default=True,
        help="Pretty-print JSON output (default: true)",
    )

    args = parser.parse_args()

    # Load pipeline
    pipeline = load_pipeline(args.pipeline)
    episode_id = pipeline["episode_id"]

    # Convert
    timeline = convert_pipeline_to_timeline(pipeline, args.assets_dir)

    # Determine output path
    output_path = args.output or f"{episode_id}-timeline.json"

    if args.dry_run:
        print("=" * 60)
        print("  PIPELINE -> TIMELINE  (dry run)")
        print("=" * 60)
        print()
        print_summary(timeline)
        print()
        print(f"Would write to: {output_path}")
        print("=" * 60)
    else:
        # Write timeline JSON
        indent = 2 if args.pretty else None
        with open(output_path, "w") as f:
            json.dump(timeline, f, indent=indent, ensure_ascii=False)
        print(f"Timeline written to: {output_path}")
        print()
        print_summary(timeline)

    # Validation
    if args.validate:
        print()
        print("-" * 60)
        print("  ASSET VALIDATION")
        print("-" * 60)

        base = args.assets_dir or f"assets/{episode_id}"
        missing = validate_assets(timeline, base)

        if missing:
            print(f"\nMISSING ({len(missing)} files):")
            for m in missing:
                print(f"  [x] {m}")
            print()
            print("These files must be generated before FFMPEG assembly.")
            if not args.dry_run:
                sys.exit(1)
        else:
            print("\nAll asset files found.")


if __name__ == "__main__":
    main()
