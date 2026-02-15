#!/usr/bin/env python3
"""
timeline_to_premiere_xml.py — Convert Timeline EDL JSON to Premiere Pro xmeml v4 XML.

Generates an importable XML sequence with 5 audio tracks (A1 VO, A2 SFX beds,
A3 SFX events, A4 music, A5 reserved) and 1 video track (V1).

Audio clips use Premiere-native gain (effectid {61756678, 4761696e, 4b657947})
with raw dB values. Clips at 0 dB omit the filter block entirely.

Usage:
  python scripts/shared/timeline_to_premiere_xml.py timeline.json -o EP-001.xml --base-path premiere-prep/EP-001
  python scripts/shared/timeline_to_premiere_xml.py timeline.json --dry-run
  python scripts/shared/timeline_to_premiere_xml.py timeline.json --validate
"""

import argparse
import os
import sys
import xml.etree.ElementTree as ET
from urllib.parse import quote as url_quote

# Import from sibling module
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from timeline_to_ffmpeg import load_timeline

INTRO_DURATION = 3.5  # seconds — intro clip starts at in=-3.5
PREMIERE_GAIN_EFFECTID = "{61756678, 4761696e, 4b657947}"


def seconds_to_frames(seconds, fps):
    """Convert seconds to frame count."""
    return int(round(seconds * fps))


def build_clip_name(clip):
    """Build clip name with optional Ken Burns hint."""
    clip_id = clip.get("id", "unknown")
    kb = clip.get("ken_burns")
    if kb and kb.get("zoom_end", 1.0) > 1.0:
        zoom_pct = int(kb["zoom_end"] * 100)
        return "%s [KB->%d%%]" % (clip_id, zoom_pct)
    return clip_id


def build_pathurl(source, base_path):
    """Build file://localhost/ URL from source path and base."""
    if os.path.isabs(source):
        abs_path = source
    else:
        abs_path = os.path.join(base_path, source)
    abs_path = os.path.abspath(abs_path)
    # URL-encode the path components but keep /
    parts = abs_path.split("/")
    encoded = "/".join(url_quote(p, safe="") for p in parts)
    return "file://localhost" + encoded


def infer_audio_durations(clips, total_duration):
    """Infer end times for audio clips that lack 'out' field.

    Returns list of (clip, clip_in, clip_out) tuples.
    """
    result = []
    for i, clip in enumerate(clips):
        clip_in = clip.get("in", 0)
        if "out" in clip:
            clip_out = clip["out"]
        elif i + 1 < len(clips):
            clip_out = clips[i + 1]["in"]
        else:
            clip_out = total_duration

        duration = clip_out - clip_in
        if duration < 0.5:
            print("WARNING: %s inferred duration %.2fs (< 0.5s)" % (
                clip.get("id", "unknown"), duration), file=sys.stderr)

        result.append((clip, clip_in, clip_out))
    return result


def add_rate(parent, fps):
    """Add <rate> element with timebase and ntsc."""
    rate = ET.SubElement(parent, "rate")
    ET.SubElement(rate, "timebase").text = str(fps)
    ET.SubElement(rate, "ntsc").text = "TRUE"
    return rate


def add_gain_filter(clipitem, level_db):
    """Add Premiere-native gain filter to a clipitem. Omit if 0 dB."""
    if level_db == 0 or level_db == 0.0:
        return
    filt = ET.SubElement(clipitem, "filter")
    effect = ET.SubElement(filt, "effect")
    ET.SubElement(effect, "name").text = "Gain"
    ET.SubElement(effect, "effectid").text = PREMIERE_GAIN_EFFECTID
    ET.SubElement(effect, "effecttype").text = "filter"
    ET.SubElement(effect, "mediatype").text = "audio"
    param = ET.SubElement(effect, "parameter")
    param.set("authoringApp", "PremierePro")
    ET.SubElement(param, "parameterid").text = "Gain(dB)"
    ET.SubElement(param, "name").text = "Gain(dB)"
    ET.SubElement(param, "valuemin").text = "-96"
    ET.SubElement(param, "valuemax").text = "96"
    ET.SubElement(param, "value").text = str(int(level_db)) if level_db == int(level_db) else str(level_db)


def add_file_element(clipitem, file_id, name, pathurl, is_audio=False):
    """Add <file> element to clipitem."""
    file_el = ET.SubElement(clipitem, "file", id=file_id)
    ET.SubElement(file_el, "name").text = name
    ET.SubElement(file_el, "pathurl").text = pathurl
    media = ET.SubElement(file_el, "media")
    if is_audio:
        audio = ET.SubElement(media, "audio")
        sc = ET.SubElement(audio, "samplecharacteristics")
        ET.SubElement(sc, "depth").text = "16"
        ET.SubElement(sc, "samplerate").text = "48000"
    else:
        video = ET.SubElement(media, "video")
        sc = ET.SubElement(video, "samplecharacteristics")
        ET.SubElement(sc, "width").text = "1920"
        ET.SubElement(sc, "height").text = "1080"
    return file_el


def build_video_track(video_clips, fps, base_path, file_ids):
    """Build V1 video track element."""
    track = ET.Element("track")

    for clip in video_clips:
        clip_in = clip["in"]
        clip_out = clip["out"]
        start_frame = seconds_to_frames(clip_in + INTRO_DURATION, fps)
        end_frame = seconds_to_frames(clip_out + INTRO_DURATION, fps)
        clip_frames = end_frame - start_frame

        clip_id = clip.get("id", "unknown")
        clipitem = ET.SubElement(track, "clipitem", id=clip_id)
        ET.SubElement(clipitem, "name").text = build_clip_name(clip)
        ET.SubElement(clipitem, "enabled").text = "TRUE"
        ET.SubElement(clipitem, "duration").text = str(clip_frames)
        add_rate(clipitem, fps)
        ET.SubElement(clipitem, "start").text = str(start_frame)
        ET.SubElement(clipitem, "end").text = str(end_frame)
        ET.SubElement(clipitem, "in").text = "0"
        ET.SubElement(clipitem, "out").text = str(clip_frames)

        source = clip.get("source", "")
        filename = os.path.basename(source)
        file_id = "file-%s" % clip_id
        pathurl = build_pathurl(source, base_path)
        add_file_element(clipitem, file_id, filename, pathurl, is_audio=False)
        file_ids[source] = file_id

    ET.SubElement(track, "enabled").text = "TRUE"
    ET.SubElement(track, "locked").text = "FALSE"
    return track


def build_audio_track(clips_with_times, fps, base_path, file_ids, track_label):
    """Build an audio track element from clips with inferred durations."""
    track = ET.Element("track")

    for clip, clip_in, clip_out in clips_with_times:
        start_frame = seconds_to_frames(clip_in + INTRO_DURATION, fps)
        end_frame = seconds_to_frames(clip_out + INTRO_DURATION, fps)
        clip_frames = end_frame - start_frame

        clip_id = clip.get("id", "unknown")
        clipitem = ET.SubElement(track, "clipitem", id=clip_id)
        ET.SubElement(clipitem, "name").text = clip_id
        ET.SubElement(clipitem, "enabled").text = "TRUE"
        ET.SubElement(clipitem, "duration").text = str(clip_frames)
        add_rate(clipitem, fps)
        ET.SubElement(clipitem, "start").text = str(start_frame)
        ET.SubElement(clipitem, "end").text = str(end_frame)
        ET.SubElement(clipitem, "in").text = "0"
        ET.SubElement(clipitem, "out").text = str(clip_frames)

        source = clip.get("source", "")
        filename = os.path.basename(source)
        file_id = "file-%s" % clip_id

        # Reuse file element if already defined (same source file)
        if source in file_ids:
            file_el = ET.SubElement(clipitem, "file", id=file_ids[source])
        else:
            pathurl = build_pathurl(source, base_path)
            add_file_element(clipitem, file_id, filename, pathurl, is_audio=True)
            file_ids[source] = file_id

        # Add sourcetrack
        sourcetrack = ET.SubElement(clipitem, "sourcetrack")
        ET.SubElement(sourcetrack, "mediatype").text = "audio"
        ET.SubElement(sourcetrack, "trackindex").text = "1"

        # Add gain filter
        level_db = clip.get("level_db", 0)
        add_gain_filter(clipitem, level_db)

    ET.SubElement(track, "enabled").text = "TRUE"
    ET.SubElement(track, "locked").text = "FALSE"
    return track


def build_empty_track():
    """Build an empty audio track (A5 reserved)."""
    track = ET.Element("track")
    ET.SubElement(track, "enabled").text = "TRUE"
    ET.SubElement(track, "locked").text = "FALSE"
    return track


def build_xmeml(timeline, base_path):
    """Build complete xmeml v4 document from timeline data."""
    fps = timeline["fps"]
    total_duration = timeline.get("computed_duration_seconds", 0)
    total_frames = seconds_to_frames(total_duration + INTRO_DURATION, fps)
    tracks = timeline.get("tracks", {})
    episode_id = timeline.get("episode_id", "unknown")
    title = timeline.get("title", episode_id)

    file_ids = {}  # source path -> file id (for deduplication)

    # Root
    root = ET.Element("xmeml", version="4")
    seq = ET.SubElement(root, "sequence")
    ET.SubElement(seq, "name").text = title
    ET.SubElement(seq, "duration").text = str(total_frames)
    add_rate(seq, fps)

    # Media
    media = ET.SubElement(seq, "media")

    # Video
    video = ET.SubElement(media, "video")

    # Video format
    fmt = ET.SubElement(video, "format")
    sc = ET.SubElement(fmt, "samplecharacteristics")
    add_rate(sc, fps)
    ET.SubElement(sc, "width").text = "1920"
    ET.SubElement(sc, "height").text = "1080"
    ET.SubElement(sc, "anamorphic").text = "FALSE"
    ET.SubElement(sc, "pixelaspectratio").text = "square"
    ET.SubElement(sc, "fielddominance").text = "none"

    # V1 track
    video_clips = tracks.get("video", [])
    v1_track = build_video_track(video_clips, fps, base_path, file_ids)
    video.append(v1_track)

    # Audio
    audio = ET.SubElement(media, "audio")
    ET.SubElement(audio, "numOutputChannels").text = "2"

    # Audio format
    afmt = ET.SubElement(audio, "format")
    asc = ET.SubElement(afmt, "samplecharacteristics")
    ET.SubElement(asc, "depth").text = "16"
    ET.SubElement(asc, "samplerate").text = "48000"

    # A1: Voiceover
    vo_clips = tracks.get("voiceover", [])
    vo_timed = infer_audio_durations(vo_clips, total_duration)
    a1_track = build_audio_track(vo_timed, fps, base_path, file_ids, "VO")
    audio.append(a1_track)

    # A2: SFX Beds
    sfx_all = tracks.get("sfx", [])
    sfx_beds = [c for c in sfx_all if c.get("type") == "bed"]
    beds_timed = infer_audio_durations(sfx_beds, total_duration)
    a2_track = build_audio_track(beds_timed, fps, base_path, file_ids, "SFX-Beds")
    audio.append(a2_track)

    # A3: SFX Events
    sfx_events = [c for c in sfx_all if c.get("type") != "bed"]
    events_timed = infer_audio_durations(sfx_events, total_duration)
    a3_track = build_audio_track(events_timed, fps, base_path, file_ids, "SFX-Events")
    audio.append(a3_track)

    # A4: Music
    music_clips = tracks.get("music", [])
    music_timed = infer_audio_durations(music_clips, total_duration)
    a4_track = build_audio_track(music_timed, fps, base_path, file_ids, "Music")
    audio.append(a4_track)

    # A5: Empty/Reserved
    a5_track = build_empty_track()
    audio.append(a5_track)

    # Timecode
    tc = ET.SubElement(seq, "timecode")
    add_rate(tc, fps)
    ET.SubElement(tc, "string").text = "00:00:00:00"
    ET.SubElement(tc, "frame").text = "0"
    ET.SubElement(tc, "displayformat").text = "NDF"

    return root


def indent_xml(elem, level=0):
    """Add indentation to XML tree (Python 3.9 compatible)."""
    indent = "\n" + "  " * level
    if len(elem):
        if not elem.text or not elem.text.strip():
            elem.text = indent + "  "
        if not elem.tail or not elem.tail.strip():
            elem.tail = indent
        for child in elem:
            indent_xml(child, level + 1)
        if not child.tail or not child.tail.strip():
            child.tail = indent
    else:
        if level and (not elem.tail or not elem.tail.strip()):
            elem.tail = indent
    if level == 0:
        elem.tail = "\n"


def main():
    parser = argparse.ArgumentParser(
        description="Convert Timeline EDL JSON to Premiere Pro xmeml v4 XML"
    )
    parser.add_argument("timeline", help="Path to Timeline EDL JSON file")
    parser.add_argument("--output", "-o", help="Output XML file path")
    parser.add_argument("--base-path", default=".",
                        help="Base path for resolving source file paths (default: cwd)")
    parser.add_argument("--dry-run", action="store_true",
                        help="Print XML to stdout instead of writing file")
    parser.add_argument("--validate", action="store_true",
                        help="Generate XML and validate it parses correctly")
    args = parser.parse_args()

    if not args.dry_run and not args.validate and not args.output:
        parser.error("--output is required unless using --dry-run or --validate")

    timeline = load_timeline(args.timeline)
    base_path = os.path.abspath(args.base_path)

    print("Episode: %s" % timeline.get("episode_id", "unknown"))
    print("FPS: %s" % timeline["fps"])
    print("Duration: %ss" % timeline.get("computed_duration_seconds", "?"))
    print("Base path: %s" % base_path)

    root = build_xmeml(timeline, base_path)
    indent_xml(root)

    # Count clips per track
    tracks = timeline.get("tracks", {})
    sfx_all = tracks.get("sfx", [])
    print("\nTrack summary:")
    print("  V1 (video):     %d clips" % len(tracks.get("video", [])))
    print("  A1 (VO):        %d clips" % len(tracks.get("voiceover", [])))
    print("  A2 (SFX beds):  %d clips" % len([c for c in sfx_all if c.get("type") == "bed"]))
    print("  A3 (SFX events):%d clips" % len([c for c in sfx_all if c.get("type") != "bed"]))
    print("  A4 (music):     %d clips" % len(tracks.get("music", [])))
    print("  A5 (reserved):  empty")

    xml_declaration = '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE xmeml>\n'
    xml_body = ET.tostring(root, encoding="unicode")
    xml_content = xml_declaration + xml_body

    if args.validate:
        # Parse the generated XML to verify it's valid
        try:
            ET.fromstring(xml_body)
            print("\nValidation: PASS - XML parses without errors")
        except ET.ParseError as e:
            print("\nValidation: FAIL - %s" % e, file=sys.stderr)
            sys.exit(1)

    if args.dry_run:
        print("\n" + xml_content)
    elif args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(xml_content)
        print("\nWrote %s" % args.output)

    if args.validate and not args.dry_run and not args.output:
        print("(use --output or --dry-run to save/view the XML)")


if __name__ == "__main__":
    main()
