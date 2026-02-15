#!/usr/bin/env python3
"""
timeline_to_ffmpeg.py — BowTie Bullies Timeline-to-FFMPEG Compiler

Reads a Timeline EDL JSON file and generates the complete FFMPEG command
for video assembly with multi-layer audio mix, Ken Burns, overlays,
ducking, and loudness normalization.

Usage:
  python scripts/timeline_to_ffmpeg.py timeline.json --output render.sh
  python scripts/timeline_to_ffmpeg.py timeline.json --dry-run
"""

import json
import sys
import argparse
import os
from pathlib import Path
from typing import Any


def load_timeline(path: str) -> dict:
    """Load and validate a timeline EDL JSON file."""
    with open(path, 'r') as f:
        data = json.load(f)

    required_keys = ['episode_id', 'fps', 'tracks', 'master_output']
    for key in required_keys:
        if key not in data:
            raise ValueError(f"Timeline missing required key: {key}")

    return data


def build_video_filter(timeline: dict) -> tuple[list[str], str]:
    """Build the video filter graph from timeline video track.

    Returns (input_args, filter_complex_video_part)
    """
    video_track = timeline['tracks'].get('video', [])
    fps = timeline['fps']
    color_grade = timeline['master_output'].get('color_grade', '')
    inputs = []
    filters = []

    for i, clip in enumerate(video_track):
        clip_type = clip.get('type', 'video')

        if clip_type == 'ken_burns':
            # Still image with Ken Burns effect
            source = clip['source']
            kb = clip.get('ken_burns', {})
            zoom_start = kb.get('zoom_start', 1.0)
            zoom_end = kb.get('zoom_end', 1.08)
            duration_s = clip['out'] - clip['in']
            duration_frames = int(duration_s * fps)

            zoom_step = (zoom_end - zoom_start) / duration_frames if duration_frames > 0 else 0

            inputs.append(f"-loop 1 -t {duration_s} -i \"{source}\"")
            filters.append(
                f"[{i}:v]zoompan=z='min(zoom+{zoom_step:.6f},{zoom_end})':"
                f"x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':"
                f"d={duration_frames}:s=1920x1080:fps={fps}[v{i}]"
            )
        elif clip_type == 'remotion_overlay':
            # Pre-rendered Remotion overlay (ProRes with alpha)
            # Remotion overlays must be pre-rendered before timeline assembly.
            # They use 'composition' + 'props' in the EDL but require a 'source'
            # path pointing to the pre-rendered ProRes file.
            source = clip.get('source')
            if not source:
                comp = clip.get('composition', 'Unknown')
                raise ValueError(
                    f"Remotion overlay clip {clip.get('id', '?')} (composition={comp}) "
                    f"missing 'source' path. Pre-render with: "
                    f"npx remotion render {comp} --codec=prores --prores-profile=4444 "
                    f"--pixel-format=yuva444p"
                )
            inputs.append(f"-i \"{source}\"")
            filters.append(f"[{i}:v]null[v{i}]")
        else:
            # Regular video file (intro, outro, video)
            source = clip['source']
            inputs.append(f"-i \"{source}\"")
            filters.append(f"[{i}:v]null[v{i}]")

    # Concatenate video clips with transitions
    if len(video_track) > 1:
        concat_inputs = ''.join(f'[v{i}]' for i in range(len(video_track)))
        filters.append(f"{concat_inputs}concat=n={len(video_track)}:v=1:a=0[vconcat]")

        # Apply color grade
        if color_grade:
            filters.append(f"[vconcat]{color_grade}[vout]")
        else:
            filters.append("[vconcat]null[vout]")
    elif len(video_track) == 1:
        if color_grade:
            filters.append(f"[v0]{color_grade}[vout]")
        else:
            filters.append("[v0]null[vout]")

    return inputs, ';\n'.join(filters)


def build_audio_filter(timeline: dict) -> tuple[list[str], str]:
    """Build the 5-layer audio filter graph.

    Layers: VO, SFX Events, SFX Ambient, Music, Stingers
    Returns (input_args, filter_complex_audio_part)
    """
    inputs = []
    filters = []
    audio_streams = []
    input_offset = len(timeline['tracks'].get('video', []))
    idx = input_offset

    # Layer 1: Voiceover
    vo_track = timeline['tracks'].get('voiceover', [])
    for vo in vo_track:
        inputs.append(f"-i \"{vo['source']}\"")
        level = vo.get('level_db', -13)
        # Convert dB to volume multiplier
        vol_mult = 10 ** (level / 20)
        filters.append(f"[{idx}:a]volume={vol_mult:.4f},adelay={int(vo['in'] * 1000)}|{int(vo['in'] * 1000)}[vo{idx}]")
        audio_streams.append(f"[vo{idx}]")
        idx += 1

    # Layer 2-3: SFX (events + ambient)
    sfx_track = timeline['tracks'].get('sfx', [])
    for sfx in sfx_track:
        inputs.append(f"-i \"{sfx['source']}\"")
        level = sfx.get('level_db', -24)
        vol_mult = 10 ** (level / 20)
        delay_ms = int(sfx['in'] * 1000)
        filters.append(f"[{idx}:a]volume={vol_mult:.4f},adelay={delay_ms}|{delay_ms}[sfx{idx}]")
        audio_streams.append(f"[sfx{idx}]")
        idx += 1

    # Layer 4: Music (with ducking metadata)
    music_track = timeline['tracks'].get('music', [])
    for mus in music_track:
        inputs.append(f"-i \"{mus['source']}\"")
        level = mus.get('level_db', -28)
        vol_mult = 10 ** (level / 20)
        delay_ms = int(mus['in'] * 1000)

        # Build volume envelope for silence ducking
        silence_track = timeline['tracks'].get('silence', [])
        vol_expr_parts = []
        for sil in silence_track:
            sil_start = sil['in']
            sil_end = sil['in'] + sil['duration']
            sil_level = sil.get('music_level_db', -40)
            sil_mult = 10 ** (sil_level / 20)
            vol_expr_parts.append(
                f"if(between(t,{sil_start},{sil_end}),{sil_mult:.6f}"
            )

        if vol_expr_parts:
            # Nest the if statements
            vol_expr = vol_mult
            for part in reversed(vol_expr_parts):
                vol_expr = f"{part},{vol_expr})"
            filters.append(f"[{idx}:a]volume='{vol_expr}':eval=frame,adelay={delay_ms}|{delay_ms}[mus{idx}]")
        else:
            filters.append(f"[{idx}:a]volume={vol_mult:.4f},adelay={delay_ms}|{delay_ms}[mus{idx}]")

        audio_streams.append(f"[mus{idx}]")
        idx += 1

    # Mix all audio streams
    if len(audio_streams) > 1:
        mix_inputs = ''.join(audio_streams)
        normalization = timeline['master_output'].get('normalization', '-14 LUFS')
        lufs = float(normalization.replace(' LUFS', ''))
        tp = float(timeline['master_output'].get('true_peak', '-1 dBTP').replace(' dBTP', ''))

        filters.append(
            f"{mix_inputs}amix=inputs={len(audio_streams)}:duration=longest:normalize=0[amixed]"
        )
        filters.append(f"[amixed]loudnorm=I={lufs}:TP={tp}:LRA=11[aout]")
    elif len(audio_streams) == 1:
        stream_name = audio_streams[0].strip('[]')
        filters.append(f"[{stream_name}]loudnorm=I=-14:TP=-1:LRA=11[aout]")

    return inputs, ';\n'.join(filters)


def compile_ffmpeg(timeline: dict, output_path: str) -> str:
    """Compile the full FFMPEG command from a timeline."""
    video_inputs, video_filters = build_video_filter(timeline)
    audio_inputs, audio_filters = build_audio_filter(timeline)

    master = timeline['master_output']
    codec_v = master.get('codec_video', 'libx264')
    crf = master.get('crf', 18)
    codec_a = master.get('codec_audio', 'aac')
    bitrate_a = master.get('bitrate_audio', '128k')

    all_inputs = video_inputs + audio_inputs
    all_filters = video_filters
    if audio_filters:
        all_filters += ';\n' + audio_filters

    cmd_parts = ['ffmpeg -y']
    cmd_parts.extend(all_inputs)
    cmd_parts.append(f'-filter_complex "\n{all_filters}\n"')
    cmd_parts.append(f'-map "[vout]" -map "[aout]"')
    cmd_parts.append(f'-c:v {codec_v} -crf {crf} -preset medium')
    cmd_parts.append(f'-c:a {codec_a} -b:a {bitrate_a}')
    cmd_parts.append(f'-r {timeline["fps"]}')
    cmd_parts.append(f'"{output_path}"')

    return ' \\\n  '.join(cmd_parts)


def main():
    parser = argparse.ArgumentParser(description="Compile Timeline EDL to FFMPEG command")
    parser.add_argument("timeline", help="Path to timeline EDL JSON file")
    parser.add_argument("--output", "-o", default="render.sh", help="Output script path")
    parser.add_argument("--dry-run", action="store_true", help="Print command without writing")
    parser.add_argument("--video-output", default=None, help="Override output video path")
    args = parser.parse_args()

    timeline = load_timeline(args.timeline)

    episode_id = timeline.get('episode_id', 'episode')
    video_output = args.video_output or f"out/bowtie/{episode_id}-final.mp4"

    ffmpeg_cmd = compile_ffmpeg(timeline, video_output)

    if args.dry_run:
        print("# Generated FFMPEG command:")
        print(ffmpeg_cmd)
    else:
        script_content = f"""#!/bin/bash
# Auto-generated by timeline_to_ffmpeg.py
# Episode: {timeline.get('title', episode_id)}
# Target duration: {timeline.get('target_duration_seconds', 'N/A')}s
# Generated from: {args.timeline}

set -euo pipefail

mkdir -p "$(dirname "{video_output}")"

{ffmpeg_cmd}

echo ""
echo "Render complete: {video_output}"
echo "Verifying loudness..."
ffmpeg -i "{video_output}" -af "loudnorm=I=-14:TP=-1:LRA=11:print_format=json" -f null - 2>&1 | tail -20
"""

        with open(args.output, 'w') as f:
            f.write(script_content)
        os.chmod(args.output, 0o755)
        print(f"Render script written to: {args.output}")
        print(f"Run with: bash {args.output}")


if __name__ == "__main__":
    main()
