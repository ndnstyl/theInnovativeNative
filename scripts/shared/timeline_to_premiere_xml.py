#!/usr/bin/env python3
"""
timeline_to_premiere_xml.py — Convert Timeline EDL JSON to Premiere Pro xmeml v4 XML.

Generates an importable XML sequence with multi-track video (V1 primary, V2 b-roll,
V3 overlays) and multi-track audio (A1 VO, A2 SFX beds, A3 SFX events, A4 music,
A5 reserved).

Features:
  - Ken Burns: animated scale + position keyframes from timeline JSON ken_burns data
  - Multi-track video: primary scenes on V1, can be extended with b-roll on V2+
  - Cross Dissolve transitions at act boundaries (fade_to_black scenes)
  - Cross Fade (0dB) transitions on VO track between clips
  - Audio gain via Premiere-native effectid

Usage:
  python scripts/shared/timeline_to_premiere_xml.py timeline.json -o EP-001.xml --base-path premiere-prep/EP-001
  python scripts/shared/timeline_to_premiere_xml.py timeline.json --dry-run
  python scripts/shared/timeline_to_premiere_xml.py timeline.json --validate
"""

import argparse
import os
import random
import sys
import uuid
import xml.etree.ElementTree as ET
from urllib.parse import quote as url_quote

# Import from sibling module
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from timeline_to_ffmpeg import load_timeline

INTRO_DURATION = 3.5  # seconds — intro clip starts at in=-3.5
PREMIERE_GAIN_EFFECTID = "{61756678, 4761696e, 4b657947}"
FILE_RATE_FPS = 30  # Premiere default file rate for stills and audio
STILL_IMAGE_DURATION_FRAMES_30 = 1294705  # Premiere default for stills at 30fps
STILL_IMAGE_DURATION_FRAMES_24 = 1035764  # Premiere default for stills at 24fps (from reference)
MASTERCLIP_COUNTER = 0  # Global counter for masterclip IDs
CLIPITEM_COUNTER = 0  # Global counter for clipitem IDs

# Ken Burns defaults (percentage scale values as used in Premiere)
KB_DEFAULT_SCALE = 120  # base scale for oversized images
KB_ZOOM_IN_START = 105   # zoom in: start small, end larger
KB_ZOOM_IN_END = 120
KB_ZOOM_OUT_START = 130  # zoom out: start larger, end smaller
KB_ZOOM_OUT_END = 115
KB_PAN_MAX = 0.08  # max horizontal pan as fraction of frame

# Cross Dissolve duration in frames at sequence fps
CROSS_DISSOLVE_FRAMES = 15  # ~0.5s at 30fps


def still_image_duration(fps):
    """Return still image duration in frames for the given sequence fps."""
    if fps == 24:
        return STILL_IMAGE_DURATION_FRAMES_24
    elif fps == 30:
        return STILL_IMAGE_DURATION_FRAMES_30
    else:
        return int(STILL_IMAGE_DURATION_FRAMES_30 * fps / 30)


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


def find_repo_root(start_path):
    """Walk up from start_path to find the repo root (directory containing .git)."""
    search = os.path.abspath(start_path)
    for _ in range(10):
        if os.path.isdir(os.path.join(search, ".git")):
            return search
        parent = os.path.dirname(search)
        if parent == search:
            break
        search = parent
    return None


# Known asset subdirectories to search for filename fallback (relative to search roots)
ASSET_SEARCH_DIRS = [
    "assets/EP-001",
    "media/scenes/assets",
    "media/scenes/ep1",
    "media/SFX",
    "media/music",
    "episodes/EP-001/vo-text",
]


def _build_search_roots(base_path):
    """Build list of root directories to search for assets.

    Includes base_path, repo root, and any projects/*/ directories under repo root.
    """
    roots = [base_path]
    repo_root = find_repo_root(base_path)
    if repo_root:
        roots.append(repo_root)
        # Add all project directories (projects/004-bowtie-bullies/, etc.)
        projects_dir = os.path.join(repo_root, "projects")
        if os.path.isdir(projects_dir):
            for entry in os.listdir(projects_dir):
                proj_path = os.path.join(projects_dir, entry)
                if os.path.isdir(proj_path):
                    roots.append(proj_path)
    return roots


def build_pathurl(source, base_path):
    """Build file://localhost/ URL from source path and base.

    Resolution order:
      1. Absolute paths: used as-is (checked for existence)
      2. base_path + source
      3. repo_root + source (walk up from base_path to find .git)
      4. Walk up parents from base_path trying source
      5. Try source relative to each project directory under repo root
      6. Filename fallback: search known asset directories for basename match

    Returns None if the file cannot be found on disk.
    """
    abs_path = None

    if os.path.isabs(source):
        if os.path.exists(source):
            abs_path = source
    else:
        # 1. Try base_path + source
        candidate = os.path.join(base_path, source)
        if os.path.exists(candidate):
            abs_path = candidate

        # 2. Try repo_root + source
        if abs_path is None:
            repo_root = find_repo_root(base_path)
            if repo_root:
                candidate = os.path.join(repo_root, source)
                if os.path.exists(candidate):
                    abs_path = candidate

        # 3. Walk up from base_path
        if abs_path is None:
            search = base_path
            for _ in range(5):
                parent = os.path.dirname(search)
                if parent == search:
                    break
                candidate = os.path.join(parent, source)
                if os.path.exists(candidate):
                    abs_path = candidate
                    break
                search = parent

        # 4. Try source relative to each project directory
        if abs_path is None:
            for root in _build_search_roots(base_path):
                candidate = os.path.join(root, source)
                if os.path.exists(candidate):
                    abs_path = candidate
                    break

        # 5. Filename fallback — search known asset directories across all roots
        if abs_path is None:
            basename = os.path.basename(source)
            for root in _build_search_roots(base_path):
                for subdir in ASSET_SEARCH_DIRS:
                    candidate = os.path.join(root, subdir, basename)
                    if os.path.exists(candidate):
                        abs_path = candidate
                        break
                if abs_path is not None:
                    break

    if abs_path is None:
        return None

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


def next_masterclip_id():
    """Return next masterclip ID string."""
    global MASTERCLIP_COUNTER
    MASTERCLIP_COUNTER += 1
    return "masterclip-%d" % MASTERCLIP_COUNTER


def next_clipitem_id():
    """Return next clipitem ID string."""
    global CLIPITEM_COUNTER
    CLIPITEM_COUNTER += 1
    return "clipitem-%d" % CLIPITEM_COUNTER


def add_file_timecode(file_el):
    """Add <timecode> block to a file element (30fps DF, matching reference export)."""
    tc = ET.SubElement(file_el, "timecode")
    rate = ET.SubElement(tc, "rate")
    ET.SubElement(rate, "timebase").text = str(FILE_RATE_FPS)
    ET.SubElement(rate, "ntsc").text = "TRUE"
    ET.SubElement(tc, "string").text = "00;00;00;00"
    ET.SubElement(tc, "frame").text = "0"
    ET.SubElement(tc, "displayformat").text = "DF"


def add_file_element(clipitem, file_id, name, pathurl, is_audio=False,
                     file_duration_frames=None):
    """Add <file> element to clipitem with rate, timecode, and duration."""
    file_el = ET.SubElement(clipitem, "file", id=file_id)
    ET.SubElement(file_el, "name").text = name
    ET.SubElement(file_el, "pathurl").text = pathurl
    # File rate (Premiere uses 30fps for stills and audio source files)
    file_rate = ET.SubElement(file_el, "rate")
    ET.SubElement(file_rate, "timebase").text = str(FILE_RATE_FPS)
    ET.SubElement(file_rate, "ntsc").text = "TRUE"
    # Duration at file rate
    if file_duration_frames:
        ET.SubElement(file_el, "duration").text = str(file_duration_frames)
    # Timecode
    add_file_timecode(file_el)
    # Media
    media = ET.SubElement(file_el, "media")
    if is_audio:
        audio = ET.SubElement(media, "audio")
        sc = ET.SubElement(audio, "samplecharacteristics")
        ET.SubElement(sc, "depth").text = "16"
        ET.SubElement(sc, "samplerate").text = "48000"
        ET.SubElement(audio, "channelcount").text = "2"
    else:
        video = ET.SubElement(media, "video")
        sc = ET.SubElement(video, "samplecharacteristics")
        file_sc_rate = ET.SubElement(sc, "rate")
        ET.SubElement(file_sc_rate, "timebase").text = str(FILE_RATE_FPS)
        ET.SubElement(file_sc_rate, "ntsc").text = "TRUE"
        ET.SubElement(sc, "width").text = "1920"
        ET.SubElement(sc, "height").text = "1080"
        ET.SubElement(sc, "anamorphic").text = "FALSE"
        ET.SubElement(sc, "pixelaspectratio").text = "square"
        ET.SubElement(sc, "fielddominance").text = "none"
    return file_el


def add_basic_motion_filter(clipitem, clip, in_frame, out_frame):
    """Add Basic Motion filter with Ken Burns keyframes.

    Matches the exact xmeml structure from the EP1 Premiere export:
    - Scale keyframes: zoom_start → zoom_end (as percentage, e.g. 120 = 120%)
    - Center keyframes: slow pan left/right over clip duration
    - All other params (rotation, anchor, crop) set to defaults
    """
    kb = clip.get("ken_burns")
    clip_type = clip.get("type", "")

    # Determine scale values
    if kb and kb.get("zoom_end", 1.0) > 1.0:
        # Timeline JSON has zoom_start/zoom_end as multipliers (1.0 = 100%)
        # Premiere uses percentage values where 100 = fit-to-frame
        # For oversized stills, base scale ~120 to fill frame
        zoom_ratio = kb["zoom_end"] / kb.get("zoom_start", 1.0)
        # Alternate between zoom-in and zoom-out for visual variety
        # Use clip index hash for deterministic but varied behavior
        clip_hash = hash(clip.get("id", "")) % 3
        if clip_hash == 0:
            # Zoom out (start big, end smaller) — most common in EP1
            scale_start = int(KB_ZOOM_OUT_START * zoom_ratio)
            scale_end = KB_ZOOM_OUT_END
        elif clip_hash == 1:
            # Zoom in (start smaller, end big)
            scale_start = KB_ZOOM_IN_START
            scale_end = int(KB_ZOOM_IN_END * zoom_ratio)
        else:
            # Static scale with pan only
            scale_start = KB_DEFAULT_SCALE
            scale_end = KB_DEFAULT_SCALE
    elif clip_type == "video":
        # Video clips (intro/outro) — no animation needed
        return
    else:
        # No ken_burns data — static scale
        scale_start = KB_DEFAULT_SCALE
        scale_end = KB_DEFAULT_SCALE

    # Determine pan direction (deterministic from clip id)
    clip_id = clip.get("id", "")
    pan_hash = hash(clip_id + "pan") % 4
    if pan_hash == 0:
        pan_start_h, pan_end_h = 0.0, -KB_PAN_MAX  # pan left
    elif pan_hash == 1:
        pan_start_h, pan_end_h = -KB_PAN_MAX, 0.0  # pan right
    elif pan_hash == 2:
        pan_start_h, pan_end_h = KB_PAN_MAX / 2, -KB_PAN_MAX / 2  # center to left
    else:
        pan_start_h, pan_end_h = 0.0, 0.0  # no pan (zoom only)

    # Build the filter
    filt = ET.SubElement(clipitem, "filter")
    effect = ET.SubElement(filt, "effect")
    ET.SubElement(effect, "name").text = "Basic Motion"
    ET.SubElement(effect, "effectid").text = "basic"
    ET.SubElement(effect, "effectcategory").text = "motion"
    ET.SubElement(effect, "effecttype").text = "motion"
    ET.SubElement(effect, "mediatype").text = "video"
    ET.SubElement(effect, "pproBypass").text = "false"

    # Scale parameter with keyframes
    p_scale = ET.SubElement(effect, "parameter")
    p_scale.set("authoringApp", "PremierePro")
    ET.SubElement(p_scale, "parameterid").text = "scale"
    ET.SubElement(p_scale, "name").text = "Scale"
    ET.SubElement(p_scale, "valuemin").text = "0"
    ET.SubElement(p_scale, "valuemax").text = "1000"
    ET.SubElement(p_scale, "value").text = str(scale_start)
    # Start keyframe
    kf1 = ET.SubElement(p_scale, "keyframe")
    ET.SubElement(kf1, "when").text = str(in_frame)
    ET.SubElement(kf1, "value").text = str(scale_start)
    # End keyframe
    kf2 = ET.SubElement(p_scale, "keyframe")
    ET.SubElement(kf2, "when").text = str(out_frame)
    ET.SubElement(kf2, "value").text = str(scale_end)

    # Rotation parameter (static 0)
    p_rot = ET.SubElement(effect, "parameter")
    p_rot.set("authoringApp", "PremierePro")
    ET.SubElement(p_rot, "parameterid").text = "rotation"
    ET.SubElement(p_rot, "name").text = "Rotation"
    ET.SubElement(p_rot, "valuemin").text = "-8640"
    ET.SubElement(p_rot, "valuemax").text = "8640"
    ET.SubElement(p_rot, "value").text = "0"

    # Center (position) parameter with pan keyframes
    p_center = ET.SubElement(effect, "parameter")
    p_center.set("authoringApp", "PremierePro")
    ET.SubElement(p_center, "parameterid").text = "center"
    ET.SubElement(p_center, "name").text = "Center"
    val = ET.SubElement(p_center, "value")
    ET.SubElement(val, "horiz").text = str(round(pan_start_h, 5))
    ET.SubElement(val, "vert").text = "0"
    # Start keyframe
    ckf1 = ET.SubElement(p_center, "keyframe")
    ET.SubElement(ckf1, "when").text = str(in_frame)
    v1 = ET.SubElement(ckf1, "value")
    ET.SubElement(v1, "horiz").text = str(round(pan_start_h, 5))
    ET.SubElement(v1, "vert").text = "0"
    # End keyframe
    ckf2 = ET.SubElement(p_center, "keyframe")
    ET.SubElement(ckf2, "when").text = str(out_frame)
    v2 = ET.SubElement(ckf2, "value")
    ET.SubElement(v2, "horiz").text = str(round(pan_end_h, 5))
    ET.SubElement(v2, "vert").text = "0"

    # Anchor Point (static center)
    p_anchor = ET.SubElement(effect, "parameter")
    p_anchor.set("authoringApp", "PremierePro")
    ET.SubElement(p_anchor, "parameterid").text = "centerOffset"
    ET.SubElement(p_anchor, "name").text = "Anchor Point"
    av = ET.SubElement(p_anchor, "value")
    ET.SubElement(av, "horiz").text = "0"
    ET.SubElement(av, "vert").text = "0"

    # Anti-flicker Filter (off)
    p_af = ET.SubElement(effect, "parameter")
    p_af.set("authoringApp", "PremierePro")
    ET.SubElement(p_af, "parameterid").text = "antiflicker"
    ET.SubElement(p_af, "name").text = "Anti-flicker Filter"
    ET.SubElement(p_af, "valuemin").text = "0.0"
    ET.SubElement(p_af, "valuemax").text = "1.0"
    ET.SubElement(p_af, "value").text = "0"


def add_cross_dissolve(track, start_frame, end_frame, fps):
    """Add a Cross Dissolve transition item to a video track."""
    ti = ET.SubElement(track, "transitionitem")
    ET.SubElement(ti, "start").text = str(start_frame)
    ET.SubElement(ti, "end").text = str(end_frame)
    ET.SubElement(ti, "alignment").text = "end-black"
    ET.SubElement(ti, "cutPointTicks").text = "0"
    add_rate(ti, fps)
    effect = ET.SubElement(ti, "effect")
    ET.SubElement(effect, "name").text = "Cross Dissolve"
    ET.SubElement(effect, "effectid").text = "Cross Dissolve"
    ET.SubElement(effect, "effectcategory").text = "Dissolve"
    ET.SubElement(effect, "effecttype").text = "transition"
    ET.SubElement(effect, "mediatype").text = "video"
    ET.SubElement(effect, "wipecode").text = "0"
    ET.SubElement(effect, "wipeaccuracy").text = "100"
    ET.SubElement(effect, "startratio").text = "0"
    ET.SubElement(effect, "endratio").text = "0"
    ET.SubElement(effect, "reverse").text = "FALSE"


def add_cross_fade(track, start_frame, end_frame, fps, alignment="end-black"):
    """Add a Cross Fade (0dB) transition item to an audio track."""
    ti = ET.SubElement(track, "transitionitem")
    ET.SubElement(ti, "start").text = str(start_frame)
    ET.SubElement(ti, "end").text = str(end_frame)
    ET.SubElement(ti, "alignment").text = alignment
    ET.SubElement(ti, "cutPointTicks").text = "0"
    add_rate(ti, fps)
    effect = ET.SubElement(ti, "effect")
    ET.SubElement(effect, "name").text = "Cross Fade ( 0dB)"
    ET.SubElement(effect, "effectid").text = "KGAudioTransCrossFade0dB"
    ET.SubElement(effect, "effecttype").text = "transition"
    ET.SubElement(effect, "mediatype").text = "audio"
    ET.SubElement(effect, "wipecode").text = "0"
    ET.SubElement(effect, "wipeaccuracy").text = "100"
    ET.SubElement(effect, "startratio").text = "0"
    ET.SubElement(effect, "endratio").text = "1"
    ET.SubElement(effect, "reverse").text = "FALSE"


def is_act_boundary(clip, prev_clip):
    """Check if this clip represents an act boundary (black frame or transition beat)."""
    if not prev_clip:
        return False
    source = clip.get("source", "")
    return "black.png" in source


def build_video_track(video_clips, fps, base_path, file_ids, strict=False,
                      skipped_clips=None):
    """Build V1 video track element with Ken Burns keyframes and transitions.

    Skips clips whose source files don't exist on disk (unless strict=True).
    Appends skipped clip info to skipped_clips list if provided.
    """
    if skipped_clips is None:
        skipped_clips = []
    track = ET.Element("track")
    track.set("TL.SQTrackShy", "0")
    track.set("TL.SQTrackExpandedHeight", "41")
    track.set("TL.SQTrackExpanded", "0")
    track.set("MZ.TrackTargeted", "1")

    prev_clip = None
    for clip in video_clips:
        source = clip.get("source", "")
        clip_id = clip.get("id", "unknown")

        # Check if source file exists (unless already resolved by a prior clip)
        if source and source not in file_ids:
            pathurl = build_pathurl(source, base_path)
            if pathurl is None:
                msg = "[video] %s: %s" % (clip_id, source)
                skipped_clips.append(msg)
                if strict:
                    print("ERROR: missing source file: %s" % msg, file=sys.stderr)
                    sys.exit(1)
                print("WARNING: skipping clip (missing source): %s" % msg, file=sys.stderr)
                prev_clip = clip
                continue

        clip_in = clip["in"]
        clip_out = clip["out"]
        start_frame = seconds_to_frames(clip_in + INTRO_DURATION, fps)
        end_frame = seconds_to_frames(clip_out + INTRO_DURATION, fps)
        clip_frames = end_frame - start_frame

        # Add Cross Dissolve at act boundaries (before black frames)
        if is_act_boundary(clip, prev_clip):
            dissolve_start = start_frame - CROSS_DISSOLVE_FRAMES
            if dissolve_start >= 0:
                add_cross_dissolve(track, dissolve_start, start_frame, fps)

        clipitem_id = next_clipitem_id()
        masterclip_id = next_masterclip_id()
        clipitem = ET.SubElement(track, "clipitem", id=clipitem_id)
        ET.SubElement(clipitem, "masterclipid").text = masterclip_id
        ET.SubElement(clipitem, "name").text = build_clip_name(clip)
        still_dur = still_image_duration(fps)
        ET.SubElement(clipitem, "enabled").text = "TRUE"
        ET.SubElement(clipitem, "duration").text = str(still_dur)
        add_rate(clipitem, fps)
        ET.SubElement(clipitem, "start").text = str(start_frame)
        ET.SubElement(clipitem, "end").text = str(end_frame)

        # For stills, in/out reference the source file timeline (large range)
        # Use a base offset to simulate Premiere's still image handling
        source_in = 107892  # common value from EP1 export
        source_out = source_in + (end_frame - start_frame)
        ET.SubElement(clipitem, "in").text = str(source_in)
        ET.SubElement(clipitem, "out").text = str(source_out)

        ET.SubElement(clipitem, "alphatype").text = "none"
        ET.SubElement(clipitem, "pixelaspectratio").text = "square"
        ET.SubElement(clipitem, "anamorphic").text = "FALSE"

        filename = os.path.basename(source)
        file_id = "file-%s" % clip_id

        # Reuse file element if same source
        if source in file_ids:
            ET.SubElement(clipitem, "file", id=file_ids[source])
        else:
            pathurl = build_pathurl(source, base_path)
            add_file_element(clipitem, file_id, filename, pathurl, is_audio=False,
                             file_duration_frames=still_dur)
            file_ids[source] = file_id

        # Add Ken Burns Basic Motion filter
        add_basic_motion_filter(clipitem, clip, source_in, source_out)

        _add_clipitem_metadata(clipitem)

        prev_clip = clip

    ET.SubElement(track, "enabled").text = "TRUE"
    ET.SubElement(track, "locked").text = "FALSE"
    return track


def _add_clipitem_metadata(clipitem):
    """Add logginginfo and colorinfo stubs to a clipitem (required by Premiere)."""
    li = ET.SubElement(clipitem, "logginginfo")
    for tag in ("description", "scene", "shottake", "lognote", "good",
                "originalvideofilename", "originalaudiofilename"):
        ET.SubElement(li, tag)
    ci = ET.SubElement(clipitem, "colorinfo")
    for tag in ("lut", "lut1", "asc_sop", "asc_sat", "lut2"):
        ET.SubElement(ci, tag)


def _set_audio_track_attrs(track):
    """Set standard Premiere audio track attributes on a <track> element."""
    track.set("TL.SQTrackAudioKeyframeStyle", "0")
    track.set("TL.SQTrackShy", "0")
    track.set("TL.SQTrackExpandedHeight", "41")
    track.set("TL.SQTrackExpanded", "0")
    track.set("MZ.TrackTargeted", "1")
    track.set("PannerCurrentValue", "0.5")
    track.set("PannerIsInverted", "true")
    track.set("PannerStartKeyframe", "-91445760000000000,0.5,0,0,0,0,0,0")
    track.set("PannerName", "Balance")
    track.set("currentExplodedTrackIndex", "0")
    track.set("totalExplodedTrackCount", "1")
    track.set("premiereTrackType", "Mono")


def build_audio_track_with_fades(clips_with_times, fps, base_path, file_ids,
                                 track_label, output_channel=1, add_fades=False,
                                 strict=False, skipped_clips=None):
    """Build an audio track element with optional cross-fades between clips.

    Skips clips whose source files don't exist on disk (unless strict=True).
    """
    if skipped_clips is None:
        skipped_clips = []
    track = ET.Element("track")
    _set_audio_track_attrs(track)

    prev_end_frame = None
    for i, (clip, clip_in, clip_out) in enumerate(clips_with_times):
        source = clip.get("source", "")
        clip_id = clip.get("id", "unknown")

        # Check if source file exists (unless already resolved by a prior clip)
        if source and source not in file_ids:
            pathurl = build_pathurl(source, base_path)
            if pathurl is None:
                msg = "[%s] %s: %s" % (track_label, clip_id, source)
                skipped_clips.append(msg)
                if strict:
                    print("ERROR: missing source file: %s" % msg, file=sys.stderr)
                    sys.exit(1)
                print("WARNING: skipping clip (missing source): %s" % msg, file=sys.stderr)
                continue

        start_frame = seconds_to_frames(clip_in + INTRO_DURATION, fps)
        end_frame = seconds_to_frames(clip_out + INTRO_DURATION, fps)
        clip_frames = end_frame - start_frame

        # Add cross-fade between adjacent VO clips
        if add_fades and prev_end_frame is not None:
            gap = start_frame - prev_end_frame
            fade_frames = min(15, max(5, abs(gap)))
            if gap <= fade_frames:
                # Overlapping or adjacent — add fade at boundary
                fade_point = prev_end_frame
                add_cross_fade(track, fade_point - fade_frames, fade_point, fps, "end-black")

        clipitem_id = next_clipitem_id()
        masterclip_id = next_masterclip_id()
        clipitem = ET.SubElement(track, "clipitem", id=clipitem_id)
        clipitem.set("premiereChannelType", "mono")
        ET.SubElement(clipitem, "masterclipid").text = masterclip_id
        ET.SubElement(clipitem, "name").text = clip_id
        ET.SubElement(clipitem, "enabled").text = "TRUE"
        ET.SubElement(clipitem, "duration").text = str(clip_frames)
        add_rate(clipitem, fps)
        ET.SubElement(clipitem, "start").text = str(start_frame)
        ET.SubElement(clipitem, "end").text = str(end_frame)
        ET.SubElement(clipitem, "in").text = "0"
        ET.SubElement(clipitem, "out").text = str(clip_frames)

        filename = os.path.basename(source)
        file_id = "file-%s" % clip_id

        # Compute file duration at file rate (30fps) from clip duration in seconds
        clip_duration_sec = clip_out - clip_in
        file_dur_frames = int(round(clip_duration_sec * FILE_RATE_FPS))

        # Reuse file element if already defined (same source file)
        if source in file_ids:
            ET.SubElement(clipitem, "file", id=file_ids[source])
        else:
            pathurl = build_pathurl(source, base_path)
            add_file_element(clipitem, file_id, filename, pathurl, is_audio=True,
                             file_duration_frames=file_dur_frames)
            file_ids[source] = file_id

        # Add sourcetrack
        sourcetrack = ET.SubElement(clipitem, "sourcetrack")
        ET.SubElement(sourcetrack, "mediatype").text = "audio"
        ET.SubElement(sourcetrack, "trackindex").text = "1"

        # Add gain filter
        level_db = clip.get("level_db", 0)
        add_gain_filter(clipitem, level_db)

        _add_clipitem_metadata(clipitem)

        prev_end_frame = end_frame

    ET.SubElement(track, "enabled").text = "TRUE"
    ET.SubElement(track, "locked").text = "FALSE"
    ET.SubElement(track, "outputchannelindex").text = str(output_channel)
    return track


def build_empty_track(output_channel=1):
    """Build an empty audio track (reserved)."""
    track = ET.Element("track")
    _set_audio_track_attrs(track)
    ET.SubElement(track, "enabled").text = "TRUE"
    ET.SubElement(track, "locked").text = "FALSE"
    ET.SubElement(track, "outputchannelindex").text = str(output_channel)
    return track


def categorize_sfx(sfx_clips):
    """Split SFX into sub-categories for multi-track routing.

    Returns dict: { category_name: [clips...] }
    Categories based on SFX source filename patterns:
      - bass/hum: sub_bass_hum, data_stream_hum, elevator_hum
      - ambient: distant_traffic, building_hallway, wind_chainlink
      - impact: door_slam, police_siren_distant
      - detail: keyboard_typing, notification_ping
    """
    categories = {
        "sfx-bass": [],       # A2: low-end rumbles and hums
        "sfx-ambient": [],    # A3: ambient beds and atmosphere
        "sfx-impact": [],     # A4: impacts, slams, punctuation
        "sfx-detail": [],     # A5: detail SFX (typing, pings)
    }

    for clip in sfx_clips:
        source = clip.get("source", "").lower()
        sfx_id = clip.get("id", "").lower()

        if any(k in source for k in ["bass", "hum", "data_stream"]):
            categories["sfx-bass"].append(clip)
        elif any(k in source for k in ["traffic", "hallway", "wind", "chainlink"]):
            categories["sfx-ambient"].append(clip)
        elif any(k in source for k in ["slam", "siren", "door", "police"]):
            categories["sfx-impact"].append(clip)
        else:
            categories["sfx-detail"].append(clip)

    return categories


def build_xmeml(timeline, base_path, strict=False, skipped_clips=None):
    """Build complete xmeml v4 document from timeline data."""
    if skipped_clips is None:
        skipped_clips = []
    fps = timeline["fps"]
    total_duration = timeline.get("computed_duration_seconds", 0)
    total_frames = seconds_to_frames(total_duration + INTRO_DURATION, fps)
    tracks = timeline.get("tracks", {})
    episode_id = timeline.get("episode_id", "unknown")
    title = timeline.get("title", episode_id)

    file_ids = {}  # source path -> file id (for deduplication)

    # Root
    root = ET.Element("xmeml", version="4")
    seq = ET.SubElement(root, "sequence", id="sequence-1")
    seq.set("TL.SQAudioVisibleBase", "0")
    seq.set("TL.SQVideoVisibleBase", "0")
    seq.set("TL.SQVisibleBaseTime", "0")
    seq.set("TL.SQAVDividerPosition", "0.5")
    seq.set("TL.SQHideShyTracks", "0")
    seq.set("TL.SQHeaderWidth", "204")
    seq.set("explodedTracks", "true")
    # Premiere-required sequence metadata
    seq.set("MZ.EditLine", "0")
    seq.set("MZ.Sequence.PreviewFrameSizeHeight", "1080")
    seq.set("MZ.Sequence.PreviewFrameSizeWidth", "1920")
    seq.set("MZ.Sequence.AudioTimeDisplayFormat", "200")
    seq.set("MZ.Sequence.PreviewRenderingClassID", "1061109567")
    seq.set("MZ.Sequence.PreviewRenderingPresetCodec", "1634755443")
    seq.set("MZ.Sequence.PreviewRenderingPresetPath",
            "EncoderPresets/SequencePreview/795454d9-d3c2-429d-9474-923ab13b7018/QuickTime.epr")
    seq.set("MZ.Sequence.PreviewUseMaxRenderQuality", "false")
    seq.set("MZ.Sequence.PreviewUseMaxBitDepth", "false")
    seq.set("MZ.Sequence.EditingModeGUID", "795454d9-d3c2-429d-9474-923ab13b7018")
    seq.set("MZ.Sequence.VideoTimeDisplayFormat", "110")
    seq.set("MZ.WorkInPoint", "0")
    seq.set("MZ.WorkOutPoint", str(total_frames * 10060040000))
    seq.set("Monitor.ProgramZoomIn", "0")
    seq.set("Monitor.ProgramZoomOut", str(total_frames * 10060040000))
    seq.set("TL.SQTimePerPixel", "0.0091800890021611747")

    ET.SubElement(seq, "uuid").text = str(uuid.uuid4())
    ET.SubElement(seq, "duration").text = str(total_frames)
    add_rate(seq, fps)
    ET.SubElement(seq, "name").text = title

    # Media
    media = ET.SubElement(seq, "media")

    # === VIDEO ===
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

    # V1 track — all video clips (primary scenes + remotion overlays)
    video_clips = tracks.get("video", [])
    v1_track = build_video_track(video_clips, fps, base_path, file_ids,
                                 strict=strict, skipped_clips=skipped_clips)
    video.append(v1_track)

    # V2 — empty track (for manual b-roll placement in Premiere)
    v2_track = ET.Element("track")
    v2_track.set("TL.SQTrackShy", "0")
    v2_track.set("TL.SQTrackExpandedHeight", "41")
    v2_track.set("TL.SQTrackExpanded", "0")
    v2_track.set("MZ.TrackTargeted", "0")
    ET.SubElement(v2_track, "enabled").text = "TRUE"
    ET.SubElement(v2_track, "locked").text = "FALSE"
    video.append(v2_track)

    # V3 — empty track (for titles/MOGRTs in Premiere)
    v3_track = ET.Element("track")
    v3_track.set("TL.SQTrackShy", "0")
    v3_track.set("TL.SQTrackExpandedHeight", "41")
    v3_track.set("TL.SQTrackExpanded", "0")
    v3_track.set("MZ.TrackTargeted", "0")
    ET.SubElement(v3_track, "enabled").text = "TRUE"
    ET.SubElement(v3_track, "locked").text = "FALSE"
    video.append(v3_track)

    # === AUDIO ===
    audio = ET.SubElement(media, "audio")
    ET.SubElement(audio, "numOutputChannels").text = "1"

    # Audio format
    afmt = ET.SubElement(audio, "format")
    asc = ET.SubElement(afmt, "samplecharacteristics")
    ET.SubElement(asc, "depth").text = "16"
    ET.SubElement(asc, "samplerate").text = "48000"

    # Audio outputs (stereo channel routing)
    outputs = ET.SubElement(audio, "outputs")
    for ch_idx in (1, 2):
        group = ET.SubElement(outputs, "group")
        ET.SubElement(group, "index").text = str(ch_idx)
        ET.SubElement(group, "numchannels").text = "1"
        ET.SubElement(group, "downmix").text = "0"
        channel = ET.SubElement(group, "channel")
        ET.SubElement(channel, "index").text = str(ch_idx)

    # A1: Voiceover (with cross-fades between clips)
    vo_clips = tracks.get("voiceover", [])
    vo_timed = infer_audio_durations(vo_clips, total_duration)
    a1_track = build_audio_track_with_fades(vo_timed, fps, base_path, file_ids,
                                            "VO", add_fades=True,
                                            strict=strict, skipped_clips=skipped_clips)
    audio.append(a1_track)

    # Split SFX into multiple tracks
    sfx_all = tracks.get("sfx", [])
    sfx_cats = categorize_sfx(sfx_all)

    # A2: SFX Bass/Hum
    bass_timed = infer_audio_durations(sfx_cats["sfx-bass"], total_duration)
    a2_track = build_audio_track_with_fades(bass_timed, fps, base_path, file_ids, "SFX-Bass",
                                            strict=strict, skipped_clips=skipped_clips)
    audio.append(a2_track)

    # A3: SFX Ambient
    ambient_timed = infer_audio_durations(sfx_cats["sfx-ambient"], total_duration)
    a3_track = build_audio_track_with_fades(ambient_timed, fps, base_path, file_ids, "SFX-Ambient",
                                            strict=strict, skipped_clips=skipped_clips)
    audio.append(a3_track)

    # A4: SFX Impact
    impact_timed = infer_audio_durations(sfx_cats["sfx-impact"], total_duration)
    a4_track = build_audio_track_with_fades(impact_timed, fps, base_path, file_ids, "SFX-Impact",
                                            strict=strict, skipped_clips=skipped_clips)
    audio.append(a4_track)

    # A5: SFX Detail
    detail_timed = infer_audio_durations(sfx_cats["sfx-detail"], total_duration)
    a5_track = build_audio_track_with_fades(detail_timed, fps, base_path, file_ids, "SFX-Detail",
                                            strict=strict, skipped_clips=skipped_clips)
    audio.append(a5_track)

    # A6: Music
    music_clips = tracks.get("music", [])
    music_timed = infer_audio_durations(music_clips, total_duration)
    a6_track = build_audio_track_with_fades(music_timed, fps, base_path, file_ids, "Music",
                                            strict=strict, skipped_clips=skipped_clips)
    audio.append(a6_track)

    # A7: Empty/Reserved
    a7_track = build_empty_track()
    audio.append(a7_track)

    # Timecode
    tc = ET.SubElement(seq, "timecode")
    add_rate(tc, fps)
    ET.SubElement(tc, "string").text = "00;00;00;00"
    ET.SubElement(tc, "frame").text = "0"
    ET.SubElement(tc, "displayformat").text = "DF"

    # Labels
    labels = ET.SubElement(seq, "labels")
    ET.SubElement(labels, "label2").text = "Forest"

    # Logging info (empty stubs required by Premiere)
    logginginfo = ET.SubElement(seq, "logginginfo")
    for tag in ("description", "scene", "shottake", "lognote", "good",
                "originalvideofilename", "originalaudiofilename"):
        ET.SubElement(logginginfo, tag)

    return root


def indent_xml(elem, level=0):
    """Add indentation to XML tree (Python 3.9 compatible)."""
    indent = "\n" + "\t" * level
    if len(elem):
        if not elem.text or not elem.text.strip():
            elem.text = indent + "\t"
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


def check_media(timeline, base_path):
    """Pre-flight check: report which clips have source files on disk vs missing."""
    tracks = timeline.get("tracks", {})
    found = []
    missing = []

    def check_clip(clip, track_label):
        source = clip.get("source", "")
        clip_id = clip.get("id", "unknown")
        if not source:
            return
        pathurl = build_pathurl(source, base_path)
        if pathurl is not None:
            found.append("[%s] %s: %s" % (track_label, clip_id, source))
        else:
            missing.append("[%s] %s: %s" % (track_label, clip_id, source))

    for clip in tracks.get("video", []):
        check_clip(clip, "video")
    for clip in tracks.get("voiceover", []):
        check_clip(clip, "VO")
    for clip in tracks.get("sfx", []):
        check_clip(clip, "SFX")
    for clip in tracks.get("music", []):
        check_clip(clip, "music")

    print("\nMedia check results:")
    print("  %d clips: source files found" % len(found))
    print("  %d clips: source files MISSING (will be skipped)" % len(missing))
    if missing:
        print("\nMissing files:")
        for m in missing:
            print("  - %s" % m)
    if found:
        print("\nFound files (%d):" % len(found))
        for f in found:
            print("  + %s" % f)
    return found, missing


def main():
    parser = argparse.ArgumentParser(
        description="Convert Timeline EDL JSON to Premiere Pro xmeml v4 XML"
    )
    parser.add_argument("timeline", help="Path to Timeline EDL JSON file")
    parser.add_argument("--output", "-o", help="Output XML file path")
    parser.add_argument("--base-path", default=".",
                        help="Base path for resolving source file paths (default: cwd)")
    parser.add_argument("--dry-run", action="store_true",
                        help="Print track summary without generating XML")
    parser.add_argument("--validate", action="store_true",
                        help="Generate XML and validate it parses correctly")
    parser.add_argument("--strict", action="store_true",
                        help="Error on missing source files instead of skipping")
    parser.add_argument("--check-media", action="store_true",
                        help="Check source file existence without generating XML")
    args = parser.parse_args()

    if not args.dry_run and not args.validate and not args.output and not args.check_media:
        parser.error("--output is required unless using --dry-run, --validate, or --check-media")

    timeline = load_timeline(args.timeline)
    base_path = os.path.abspath(args.base_path)

    print("Episode: %s" % timeline.get("episode_id", "unknown"))
    print("FPS: %s" % timeline["fps"])
    print("Duration: %ss" % timeline.get("computed_duration_seconds", "?"))
    print("Base path: %s" % base_path)

    # Count clips per track
    tracks = timeline.get("tracks", {})
    sfx_all = tracks.get("sfx", [])
    sfx_cats = categorize_sfx(sfx_all)

    print("\nTrack summary:")
    print("  V1 (video):       %d clips" % len(tracks.get("video", [])))
    print("  V2 (b-roll):      empty (manual placement)")
    print("  V3 (titles):      empty (manual placement)")
    print("  A1 (VO):          %d clips (with cross-fades)" % len(tracks.get("voiceover", [])))
    print("  A2 (SFX bass):    %d clips" % len(sfx_cats["sfx-bass"]))
    print("  A3 (SFX ambient): %d clips" % len(sfx_cats["sfx-ambient"]))
    print("  A4 (SFX impact):  %d clips" % len(sfx_cats["sfx-impact"]))
    print("  A5 (SFX detail):  %d clips" % len(sfx_cats["sfx-detail"]))
    print("  A6 (music):       %d clips" % len(tracks.get("music", [])))
    print("  A7 (reserved):    empty")

    if args.check_media:
        check_media(timeline, base_path)
        return

    if args.dry_run:
        return

    skipped_clips = []
    root = build_xmeml(timeline, base_path, strict=args.strict,
                        skipped_clips=skipped_clips)
    indent_xml(root)

    xml_declaration = '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE xmeml>\n'
    xml_body = ET.tostring(root, encoding="unicode")
    xml_content = xml_declaration + xml_body

    if args.validate:
        try:
            ET.fromstring(xml_body)
            print("\nValidation: PASS - XML parses without errors")
        except ET.ParseError as e:
            print("\nValidation: FAIL - %s" % e, file=sys.stderr)
            sys.exit(1)

    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(xml_content)
        print("\nWrote %s (%d bytes)" % (args.output, len(xml_content)))

    # Print skip summary
    if skipped_clips:
        print("\nSkipped %d clips (missing source files):" % len(skipped_clips))
        for s in skipped_clips:
            print("  - %s" % s)
    else:
        print("\nAll clips resolved — 0 missing source files.")

    if args.validate and not args.output:
        print("(use --output to save the XML)")


if __name__ == "__main__":
    main()
