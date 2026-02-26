#!/usr/bin/env python3
"""
Qwen3 VO Preview — Local dry-run TTS for BowTie Bullies episode scripts.

Runs every narrated scene through Qwen3-TTS locally (free, unlimited)
so you can listen and polish the script BEFORE spending ElevenLabs credits.

Usage:
    python scripts/qwen3_vo_preview.py <script.json> [--output-dir ./preview]
    python scripts/qwen3_vo_preview.py <script.json> --scene 5      # single scene
    python scripts/qwen3_vo_preview.py <script.json> --stats-only   # credit estimate only

Requirements:
    pip install mlx-audio soundfile numpy

Reference audio:
    projects/004-bowtie-bullies/assets/canonical-characters/tyroneAAVE_originStory.mp3
"""

import argparse
import json
import os
import re
import sys
import time
from pathlib import Path

# ---------------------------------------------------------------------------
# Constants — from tyrone-voice-guide.md
# ---------------------------------------------------------------------------
DEFAULT_MODEL = "mlx-community/Qwen3-TTS-12Hz-1.7B-Base-8bit"
DEFAULT_REF_AUDIO = os.path.join(
    os.path.dirname(__file__), "..",
    "projects/004-bowtie-bullies/assets/canonical-characters/tyroneAAVE_originStory.mp3"
)
# Full transcript of the reference audio for ICL mode
DEFAULT_REF_TEXT = (
    "Sleepin' in a Cutlass Supreme. Not the kind you see in them old-school rap videos, "
    "sittin' on twenties. Nah. This one had a cracked windshield, a tape deck that only "
    "played one side, and enough room in the back seat to almost stretch out. Almost. "
    "I was seventeen. Maybe sixteen. Time gets funny when you ain't got a place to "
    "mark it. Dropped outta school. Not 'cause I was dumb. 'Cause I was hungry. "
    "And not the kind of hungry they talk about in them motivational speeches. "
    "Real hungry. The kind where you learn which gas stations throw out the hot dogs "
    "at closin' time. The kind where you start countin' ceiling tiles at the shelter "
    "just to keep your mind off your stomach. But somewhere between the shelters and "
    "the back seats and the nights that felt like they'd never end, I started readin'. "
    "Not books people recommended. The stuff I wasn't suppose to understan'. Tax codes. "
    "Lien laws. Credit. How money actually moved. Not how they taught it. How it really "
    "worked. And it hit me the same way music hits some folk. Same way some folk hear a "
    "beat and just know. I saw numbers and patterns and doors that nobody told me were "
    "there. Started with one rental. Then another. Ran workshops outta barbershops. "
    "Taught folk how credit work. How to read a lease. How to stop givin' they money "
    "away to systems designed to keep 'em broke. Ain't get a record deal. Ain't get a "
    "scholarship. Got a GED, a library card, and more stubbornness than most folk got sense. "
    "That's The Aftermath. Not the part where everything falls apart. The part that comes "
    "after. When you decide what you're gonna do with what's left. I stayed."
)

# Qwen3-TTS generation params — moderate set from voice guide
GENERATE_PARAMS = {
    "temperature": 0.80,
}

# Pause markers to strip from narration before TTS
PAUSE_MARKERS = [
    (r'\[2 second pause\]', ''),
    (r'\[1\.5 second pause\]', ''),
    (r'\[1 second pause\]', ''),
    (r'\[beat\]', ''),
    (r'\[pause\]', ''),
]


def strip_pause_markers(text: str) -> str:
    """Remove editorial pause markers — these are timeline cues, not spoken words."""
    for pattern, replacement in PAUSE_MARKERS:
        text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)
    return re.sub(r'  +', ' ', text).strip()


def load_script(path: str) -> dict:
    """Load episode script JSON."""
    with open(path) as f:
        return json.load(f)


def get_narrated_scenes(script: dict) -> list:
    """Extract scenes that have narration text."""
    scenes = []
    for scene in script.get("scenes", []):
        text = scene.get("narration_text")
        if text and text.strip():
            scenes.append(scene)
    return scenes


def char_count(text: str) -> int:
    """ElevenLabs character count — every character including spaces and punctuation."""
    return len(text)


def print_credit_report(scenes: list, total_credits: int = 84724):
    """Print ElevenLabs credit usage estimate."""
    total_chars = 0
    scene_stats = []

    for scene in scenes:
        raw_text = scene["narration_text"]
        clean_text = strip_pause_markers(raw_text)
        chars = char_count(clean_text)
        words = len(clean_text.split())
        total_chars += chars
        scene_stats.append({
            "scene": scene["scene_number"],
            "type": scene.get("scene_type", "unknown"),
            "words": words,
            "chars": chars,
        })

    print("\n" + "=" * 60)
    print("ELEVENLABS CREDIT ESTIMATE")
    print("=" * 60)
    print(f"\n{'Scene':>6} {'Type':<20} {'Words':>6} {'Chars':>6}")
    print("-" * 44)
    for s in scene_stats:
        print(f"{s['scene']:>6} {s['type']:<20} {s['words']:>6} {s['chars']:>6}")
    print("-" * 44)
    print(f"{'TOTAL':<27} {sum(s['words'] for s in scene_stats):>6} {total_chars:>6}")
    print()

    retake_30 = int(total_chars * 1.3)
    retake_50 = int(total_chars * 1.5)

    print(f"  Perfect run:         {total_chars:>7} credits")
    print(f"  With 30% retakes:    {retake_30:>7} credits")
    print(f"  With 50% retakes:    {retake_50:>7} credits")
    print()
    print(f"  Your balance:        {total_credits:>7} credits")
    print(f"  After perfect run:   {total_credits - total_chars:>7} remaining")
    print(f"  After 30% retakes:   {total_credits - retake_30:>7} remaining")
    print(f"  After 50% retakes:   {total_credits - retake_50:>7} remaining")
    print(f"  Episodes possible:   ~{total_credits // retake_30} (at 30% retake rate)")
    print("=" * 60 + "\n")

    return total_chars


def generate_preview(script: dict, output_dir: str, scene_filter: int = None,
                     model_id: str = DEFAULT_MODEL, ref_audio: str = DEFAULT_REF_AUDIO,
                     ref_text: str = DEFAULT_REF_TEXT):
    """Generate Qwen3-TTS preview audio for all narrated scenes."""
    try:
        from mlx_audio.tts.generate import generate_audio
        from mlx_audio.tts.utils import load_model
    except ImportError:
        print("ERROR: mlx-audio not installed.")
        print("Install with: pip install mlx-audio")
        print("\nRun with --stats-only to see credit estimates without generating audio.")
        sys.exit(1)

    scenes = get_narrated_scenes(script)
    if scene_filter is not None:
        scenes = [s for s in scenes if s["scene_number"] == scene_filter]
        if not scenes:
            print(f"ERROR: No scene {scene_filter} with narration found.")
            sys.exit(1)

    os.makedirs(output_dir, exist_ok=True)

    # Resolve ref_audio path
    ref_audio = os.path.abspath(ref_audio)
    if not os.path.exists(ref_audio):
        print(f"WARNING: Reference audio not found: {ref_audio}")
        print("Generating without voice clone (default voice).")
        ref_audio = None
        ref_text = None

    print(f"Loading model: {model_id}")
    print("(First run downloads ~3.4GB model weights)\n")
    model = load_model(model_id)

    episode_id = script.get("episode_id", "EP-XXX")
    total_scenes = len(scenes)
    generated_files = []

    for i, scene in enumerate(scenes, 1):
        scene_num = scene["scene_number"]
        scene_type = scene.get("scene_type", "unknown")
        raw_text = scene["narration_text"]
        clean_text = strip_pause_markers(raw_text)
        chars = char_count(clean_text)

        print(f"[{i}/{total_scenes}] Scene {scene_num} ({scene_type}) — {chars} chars")

        outfile = os.path.join(output_dir, f"scene-{scene_num:03d}-preview")
        start = time.time()

        generate_kwargs = {
            "text": clean_text,
            "model": model,
            "file_prefix": outfile,
            "audio_format": "wav",
            "verbose": False,
            **GENERATE_PARAMS,
        }
        if ref_audio:
            generate_kwargs["ref_audio"] = ref_audio
            generate_kwargs["ref_text"] = ref_text

        generate_audio(**generate_kwargs)

        elapsed = time.time() - start
        wav_path = f"{outfile}.wav"
        if not os.path.exists(wav_path):
            # mlx_audio may append _000
            wav_path = f"{outfile}_000.wav"

        if os.path.exists(wav_path):
            generated_files.append(wav_path)
            size_kb = os.path.getsize(wav_path) / 1024
            print(f"         → {os.path.basename(wav_path)} ({size_kb:.0f}KB, {elapsed:.1f}s)")
        else:
            print(f"         → WARNING: output file not found")

    # Concatenate all scenes into a single preview if multiple
    if len(generated_files) > 1:
        try:
            import numpy as np
            import soundfile as sf

            all_audio = []
            sr = None
            # 1 second silence between scenes
            for wav_path in generated_files:
                data, file_sr = sf.read(wav_path)
                if sr is None:
                    sr = file_sr
                all_audio.append(data)
                all_audio.append(np.zeros(int(sr * 1.0)))  # 1s gap

            combined = np.concatenate(all_audio)
            full_path = os.path.join(output_dir, f"{episode_id}-full-preview.wav")
            sf.write(full_path, combined, sr)
            duration = len(combined) / sr
            print(f"\nFull preview: {full_path} ({duration:.0f}s)")
        except ImportError:
            print("\nInstall soundfile + numpy for concatenated preview: pip install soundfile numpy")

    print(f"\nPreview files in: {output_dir}/")
    return generated_files


def main():
    parser = argparse.ArgumentParser(
        description="Qwen3 VO Preview — Free local TTS dry-run before ElevenLabs",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Full episode preview + credit report
  python scripts/qwen3_vo_preview.py projects/004-bowtie-bullies/episodes/EP-001/EP-001-marathon-continues-pipeline.json

  # Just see how many credits it'll cost
  python scripts/qwen3_vo_preview.py projects/004-bowtie-bullies/episodes/EP-001/EP-001-marathon-continues-pipeline.json --stats-only

  # Preview a single scene you're iterating on
  python scripts/qwen3_vo_preview.py projects/004-bowtie-bullies/episodes/EP-001/EP-001-marathon-continues-pipeline.json --scene 5

  # Custom output directory
  python scripts/qwen3_vo_preview.py projects/004-bowtie-bullies/episodes/EP-001/EP-001-marathon-continues-pipeline.json -o ./vo-drafts
        """
    )
    parser.add_argument("script", help="Path to episode script JSON")
    parser.add_argument("-o", "--output-dir", default=None,
                        help="Output directory (default: ./preview/<episode_id>)")
    parser.add_argument("--scene", type=int, default=None,
                        help="Preview a single scene number only")
    parser.add_argument("--stats-only", action="store_true",
                        help="Print credit estimate without generating audio")
    parser.add_argument("--credits", type=int, default=84724,
                        help="Your ElevenLabs credit balance (default: 84724)")
    parser.add_argument("--model", default=DEFAULT_MODEL,
                        help=f"Qwen3-TTS model ID (default: {DEFAULT_MODEL})")
    parser.add_argument("--ref-audio", default=DEFAULT_REF_AUDIO,
                        help="Reference audio for voice cloning")

    args = parser.parse_args()

    script = load_script(args.script)
    scenes = get_narrated_scenes(script)

    if not scenes:
        print("No narrated scenes found in script.")
        sys.exit(0)

    episode_id = script.get("episode_id", "EP-XXX")
    print(f"\n{episode_id}: {script.get('title', 'Untitled')}")
    print(f"Narrated scenes: {len(scenes)}")

    # Always show credit report
    print_credit_report(scenes, total_credits=args.credits)

    if args.stats_only:
        return

    output_dir = args.output_dir or os.path.join("preview", episode_id)
    generate_preview(
        script, output_dir,
        scene_filter=args.scene,
        model_id=args.model,
        ref_audio=args.ref_audio,
    )


if __name__ == "__main__":
    main()
