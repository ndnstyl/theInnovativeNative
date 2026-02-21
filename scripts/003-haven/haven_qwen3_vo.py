#!/usr/bin/env python3
"""
Haven Qwen3 VO — Local TTS voice pipeline for A Slice of Haven.

Generates warm, approachable female voiceover audio using Qwen3-TTS
with voice cloning from a Haven reference audio sample.

Usage:
    python scripts/003-haven/haven_qwen3_vo.py <script.json> [--output-dir ./preview]
    python scripts/003-haven/haven_qwen3_vo.py <script.json> --scene 3      # single scene
    python scripts/003-haven/haven_qwen3_vo.py <script.json> --stats-only   # word count only

Requirements:
    pip install mlx-audio soundfile numpy

Reference audio:
    projects/003-haven-ugc-broll/assets/canonical-voice/haven_warm_intro.mp3
    (30-60s of Haven brand voice — warm, female, approachable, 120-140 WPM)
"""

import argparse
import json
import os
import re
import sys
import time
from pathlib import Path

# ---------------------------------------------------------------------------
# Constants — Haven voice profile
# ---------------------------------------------------------------------------
DEFAULT_MODEL = "mlx-community/Qwen3-TTS-12Hz-1.7B-Base-8bit"

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
DEFAULT_REF_AUDIO = str(
    REPO_ROOT / "projects" / "003-haven-ugc-broll" / "assets" /
    "canonical-voice" / "haven_warm_intro.mp3"
)

# Full transcript of the reference audio for ICL mode
# UPDATE THIS when you record the actual reference audio
DEFAULT_REF_TEXT = (
    "Hey there. Welcome to A Slice of Haven. I'm so glad you stopped by. "
    "This is a space where we slow down, take a breath, and just enjoy the "
    "little things that make life feel good. Whether it's a quiet morning "
    "with coffee, a walk outside, or just taking a moment for yourself. "
    "We all deserve that. So pull up a chair, get comfortable, and let's "
    "spend some time together. No pressure, no rush. Just you, me, and "
    "whatever feels right today."
)

# Qwen3-TTS generation params — slightly lower temperature for consistent delivery
GENERATE_PARAMS = {
    "temperature": 0.75,
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


def print_stats(scenes: list):
    """Print word and character counts per scene."""
    total_words = 0
    total_chars = 0

    print("\n" + "=" * 55)
    print("HAVEN VO — SCRIPT STATS")
    print("=" * 55)
    print(f"\n{'Scene':>6} {'Type':<20} {'Words':>6} {'Chars':>6}")
    print("-" * 44)

    for scene in scenes:
        raw_text = scene["narration_text"]
        clean_text = strip_pause_markers(raw_text)
        words = len(clean_text.split())
        chars = len(clean_text)
        total_words += words
        total_chars += chars
        scene_num = scene.get("scene_number", "?")
        scene_type = scene.get("scene_type", "unknown")
        print(f"{scene_num:>6} {scene_type:<20} {words:>6} {chars:>6}")

    print("-" * 44)
    print(f"{'TOTAL':<27} {total_words:>6} {total_chars:>6}")

    # Estimate duration at 120-140 WPM
    dur_slow = total_words / 120
    dur_fast = total_words / 140
    print(f"\n  Est. duration: {dur_fast:.0f}–{dur_slow:.0f}s ({dur_fast/60:.1f}–{dur_slow/60:.1f} min)")
    print(f"  (at 120–140 WPM Haven pace)")
    print("=" * 55 + "\n")


def generate_preview(script: dict, output_dir: str, scene_filter: int = None,
                     model_id: str = DEFAULT_MODEL, ref_audio: str = DEFAULT_REF_AUDIO,
                     ref_text: str = DEFAULT_REF_TEXT):
    """Generate Qwen3-TTS preview audio for all narrated scenes."""
    try:
        from mlx_audio.tts.generate import generate_audio
        from mlx_audio.tts.utils import load_model
    except ImportError:
        print("ERROR: mlx-audio not installed.")
        print("Install with: pip install mlx-audio soundfile numpy")
        sys.exit(1)

    scenes = get_narrated_scenes(script)
    if scene_filter is not None:
        scenes = [s for s in scenes if s.get("scene_number") == scene_filter]
        if not scenes:
            print(f"ERROR: No scene {scene_filter} with narration found.")
            sys.exit(1)

    os.makedirs(output_dir, exist_ok=True)

    # Resolve ref_audio path
    ref_audio = os.path.abspath(ref_audio)
    if not os.path.exists(ref_audio):
        print(f"WARNING: Reference audio not found: {ref_audio}")
        print("Generating without voice clone (default voice).")
        print("HINT: Record 30-60s of Haven voice and save to:")
        print(f"  {DEFAULT_REF_AUDIO}")
        ref_audio = None
        ref_text = None

    print(f"Loading model: {model_id}")
    print("(First run downloads ~3.4GB model weights)\n")
    model = load_model(model_id)

    episode_id = script.get("episode_id", "HAVEN-XXX")
    total_scenes = len(scenes)
    generated_files = []

    for i, scene in enumerate(scenes, 1):
        scene_num = scene.get("scene_number", i)
        scene_type = scene.get("scene_type", "unknown")
        raw_text = scene["narration_text"]
        clean_text = strip_pause_markers(raw_text)
        words = len(clean_text.split())

        print(f"[{i}/{total_scenes}] Scene {scene_num} ({scene_type}) — {words} words")

        outfile = os.path.join(output_dir, f"scene-{scene_num:03d}-haven")
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
            wav_path = f"{outfile}_000.wav"

        if os.path.exists(wav_path):
            generated_files.append(wav_path)
            size_kb = os.path.getsize(wav_path) / 1024
            print(f"         → {os.path.basename(wav_path)} ({size_kb:.0f}KB, {elapsed:.1f}s)")
        else:
            print("         → WARNING: output file not found")

    # Concatenate all scenes into a single preview
    if len(generated_files) > 1:
        try:
            import numpy as np
            import soundfile as sf

            all_audio = []
            sr = None
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
        description="Haven Qwen3 VO — Free local TTS for A Slice of Haven voiceovers",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Full episode preview
  python scripts/003-haven/haven_qwen3_vo.py scripts/haven-script.json

  # Just see word counts
  python scripts/003-haven/haven_qwen3_vo.py scripts/haven-script.json --stats-only

  # Preview a single scene
  python scripts/003-haven/haven_qwen3_vo.py scripts/haven-script.json --scene 3

  # Custom output directory
  python scripts/003-haven/haven_qwen3_vo.py scripts/haven-script.json -o ./haven-vo-drafts
        """
    )
    parser.add_argument("script", help="Path to episode script JSON")
    parser.add_argument("-o", "--output-dir", default=None,
                        help="Output directory (default: ./preview/<episode_id>)")
    parser.add_argument("--scene", type=int, default=None,
                        help="Preview a single scene number only")
    parser.add_argument("--stats-only", action="store_true",
                        help="Print word count stats without generating audio")
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

    episode_id = script.get("episode_id", "HAVEN-XXX")
    print(f"\n{episode_id}: {script.get('title', 'Untitled')}")
    print(f"Narrated scenes: {len(scenes)}")

    print_stats(scenes)

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
