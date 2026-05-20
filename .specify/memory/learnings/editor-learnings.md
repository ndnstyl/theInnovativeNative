# Editor Agent Learnings

Patterns and gotchas from the 006-ai-assisted-editing Premiere XML pipeline.

## Last Updated: 2026-02-14

---

## Premiere XML (xmeml v4) Structure

- Document root: `<xmeml version="4">` wrapping a single `<sequence>`
- Sequence contains `<media>` with `<video>` and `<audio>` children
- Track mapping convention: V1 (video stills), A1 (VO), A2 (SFX beds), A3 (SFX events), A4 (music), A5 (reserved/empty)
- Timecode math: `seconds * fps = frames`, with an intro offset shift (`INTRO_DURATION = 3.5s`) added to all clip start/end positions
- Every `<file>` element needs three sub-blocks: `<rate>`, `<timecode>`, and `<media>` — omitting any causes silent import failures in Premiere
- Still images use a magic duration constant: `STILL_IMAGE_DURATION_FRAMES = 1035764` at 30fps file rate — this is Premiere's internal default for stills
- `<ntsc>TRUE</ntsc>` is required inside every `<rate>` element, even for 24fps sequences — Premiere expects it unconditionally
- File rate (`FILE_RATE_FPS = 30`) is separate from sequence rate (e.g. 24fps) — stills and audio sources always declare 30fps in their `<file>` blocks
- XML must include `<?xml version="1.0" encoding="UTF-8"?>` declaration and `<!DOCTYPE xmeml>` before the root element

---

## Audio Gain in Premiere XML

- Premiere-native gain uses effectid `{61756678, 4761696e, 4b657947}` — this is a hardcoded GUID, not discoverable from docs
- Parameter name is `Gain(dB)` (case-sensitive, parentheses required) with `parameterid` matching `name`
- Value range: `-96` to `96` dB, passed as raw numeric string
- **Critical pattern**: Omit the entire `<filter>` block when gain is 0 dB — do not emit a filter with value 0. Premiere treats "no filter" differently from "filter at 0", and the latter can cause unexpected behavior
- The `authoringApp="PremierePro"` attribute on `<parameter>` is required for Premiere to recognize the effect

---

## Ken Burns Detection for Clip Naming

- Check `zoom_end > 1.0` in the clip's `ken_burns` dictionary field
- Format clip names as `scene-id [KB->108%]` (zoom percentage = `zoom_end * 100`)
- This naming convention helps the human editor immediately identify which clips need motion keyframes in Premiere
- Clips without Ken Burns or with `zoom_end <= 1.0` use plain `scene-id` as the name

---

## LUT Generation (Pure Math Approach)

- BT.601 luma weights: `Y = 0.299*R + 0.587*G + 0.114*B`
- Apply operations in strict order: saturation (mix toward luma), contrast (pivot around 0.5), brightness (additive offset)
- Clamp all output values to `[0.0, 1.0]` after the full chain
- `.cube` format iteration order: B varies fastest (innermost loop), then G, then R (outermost) — getting this wrong produces a completely wrong color transform
- Standard grid size: 33x33x33 = 35,937 entries — this is the industry default; sizes from 2 to 65 are valid
- Each entry is formatted as `%.6f %.6f %.6f` (six decimal places, space-separated)
- Header requires `TITLE "..."` and `LUT_3D_SIZE N` lines before the data block

---

## Audio Duration Inference

- Audio clips in the timeline JSON often lack an explicit `out` field — the script must infer duration
- Inference strategy: use the next clip's `in` value as the current clip's `out`; for the last clip, use `computed_duration_seconds` from the timeline root
- Emit a warning if any inferred duration is less than 0.5 seconds — this usually indicates a data error or overlapping clip definitions
- This pattern applies to all audio tracks (VO, SFX, music) since the timeline EDL format treats audio `out` as optional

---

## Asset Path Gotchas (2026-02-14)

- Timeline JSON may reference pre-reorg paths (e.g. `assets/EP-001/...`) that no longer exist after the repo reorganization to `projects/004-bowtie-bullies/assets/EP-001/...`
- `prep_premiere_assets.py` resolves all source paths relative to `--base-path`, so passing the correct base path is critical — a wrong base path silently generates broken `file://localhost/` URLs in the XML
- `build_pathurl()` converts relative paths to absolute via `os.path.abspath(os.path.join(base_path, source))` then URL-encodes path components — verify the resulting URLs manually before import
- VO wav files do not exist yet — only ElevenLabs MP3s live in `episodes/EP-001/vo-text/`. The Premiere XML will reference wav paths that need to be created (MP3-to-WAV conversion) before import
- File element deduplication: the script tracks `file_ids` (source path -> file ID) to avoid duplicate `<file>` definitions when the same source appears on multiple tracks. If the same audio file appears twice with different paths (pre-reorg vs post-reorg), deduplication breaks and Premiere may show duplicate media entries

---

## Script Architecture Patterns

- `timeline_to_premiere_xml.py` imports `load_timeline` from sibling `timeline_to_ffmpeg.py` via `sys.path.insert` — fragile but avoids package setup overhead
- Global mutable state (`MASTERCLIP_COUNTER`) used for unique masterclip IDs — works for single-run CLI scripts but would break in concurrent/library usage
- `indent_xml()` is a manual pretty-printer for Python 3.9 compatibility (stdlib `ET.indent()` was added in 3.9 but the function handles edge cases the stdlib version does not)
- Both scripts (`hald_to_cube.py`, `timeline_to_premiere_xml.py`) are zero-dependency pure Python — no pip installs needed, which keeps the pipeline portable
