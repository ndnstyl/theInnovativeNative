# WF-006 Haven FFMPEG Assembler — Audit Report

**Date**: 2026-02-09
**Workflow ID**: `7xT9Ezu6wHHZ0Z3S`
**Status**: Active (activated 2026-02-09T16:09:20)
**Version**: 7 (active version `9d2675fa`)

---

## Node Inventory (17 nodes)

| # | Node Name | Type | typeVersion | Credentials |
|---|-----------|------|-------------|-------------|
| 1 | Execute Workflow Trigger | executeWorkflowTrigger | 1.1 | — |
| 2 | Create Temp Directory | code | 2 | — |
| 3 | Download Scene Images | code | 2 | — |
| 4 | Download Music | googleDrive | 3 | `53ssDoT9mG1Dtejj` (Drive) |
| 5 | Save Music to Disk | code | 2 | — |
| 6 | Ken Burns Per Scene | code | 2 | — |
| 7 | Crossfade Chain | code | 2 | — |
| 8 | Text Overlays | code | 2 | — |
| 9 | Music Mix | code | 2 | — |
| 10 | Validate Output | code | 2 | — |
| 11 | Read Final Video | code | 2 | — |
| 12 | Upload to Google Drive | googleDrive | 3 | `53ssDoT9mG1Dtejj` (Drive) |
| 13 | Set Public Permissions | googleDrive | 3 | `53ssDoT9mG1Dtejj` (Drive) |
| 14 | Create Video Record | airtable | 2.1 | `YCWFwTIXwnTpVy2y` (Airtable) |
| 15 | Cleanup Temp Files | code | 2 | — |
| 16 | Return Output | code | 2 | — |
| 17 | Error Trigger + Error Handler | errorTrigger + code | 1 / 2 | — |
| — | Sticky Note | stickyNote | 1 | — |

**Connection chain**: Linear pipeline, all nodes connected sequentially. Error handler is a separate branch (Error Trigger → Error Handler).

---

## Audit Checklist Results

### 1. Execute Workflow Trigger — PASS
Has `executeWorkflowTrigger` v1.1 with explicit input schema:
- `script_record_id` (string)
- `playbook_id` (string)
- `product_name` (string)
- `scenes` (array)
- `music_drive_file_id` (string)
- `music_volume` (number)
- `cta_text` (string)
- `output_filename` (string)

### 2. Scene Input Contract — CONCERN
Each scene object is expected to have:
- `scene.asset_drive_file_id` — used in Download Scene Images
- `scene.number` — used for file naming (scene_1.png, etc.)
- `scene.duration_seconds` — used for Ken Burns frame calc + crossfade offsets
- `scene.ken_burns` — enum: `zoom_in`, `zoom_out`, `pan_left`, `pan_right`
- `scene.text_overlay` — drawtext content
- `scene.text_position` — enum: `center`, `bottom`, `top`, `none`

**Issue**: This contract is not documented anywhere as a formal schema. WF-003 (Script Generator) must produce exactly this structure, but there's no validation node checking the input before processing begins.

### 3. Scene Image Download — CONCERN
Uses raw `curl` against `drive.google.com/uc?export=download` instead of the Google Drive API node. This is brittle:
- Google Drive's `/uc?export=download` endpoint redirects and may serve CAPTCHA/consent pages for larger files
- The `confirm=t` parameter is a hack that doesn't always work
- No OAuth — relies on file being publicly shared or the cookie-less download working

**Why not use the Drive API node?** Likely because the Code node loops over all scenes and the Drive node can't loop natively. But the current approach will fail on any file that's not publicly accessible or that triggers Google's download warning page.

### 4. Music Download — PASS (mostly)
Uses the native Google Drive node (v3) with proper OAuth credential `53ssDoT9mG1Dtejj` to download the music file. Then "Save Music to Disk" writes the binary to disk.

**Minor issue**: Save Music to Disk has a fallback to the same `curl` method if binary data isn't available. This fallback has the same brittleness as the scene download.

### 5. Ken Burns Effect — PASS (with caveats)
Implements 4 motion types:
- `zoom_in`: `z='min(zoom+0.00375,1.15)'` — zooms from 1.0→1.15
- `zoom_out`: `z='if(eq(on,1),1.15,max(zoom-0.00375,1.0))'` — zooms from 1.15→1.0
- `pan_left`: `z='1.1':x='iw/2-(iw/zoom/2)+on*2'`
- `pan_right`: `z='1.1':x='iw/2-(iw/zoom/2)-on*2'`

Output: 1080x1920, 25fps, libx264, yuv420p

**Matches spec**: Zoom range 1.0→1.15 (brand-system.md line 225). Duration per scene comes from input data. FPS is 25 (spec doesn't specify, reasonable for social).

**Caveat**: The zoom increment `0.00375` is hardcoded assuming 4-second scenes at 25fps (100 frames, 0.15/100 = 0.0015... wait, that's 0.375 total over 100 frames = way too much). Let me recalculate:
- At 4s × 25fps = 100 frames
- 0.00375 × 100 = 0.375 zoom total — but range is only 0.15 (1.0→1.15)
- **BUG**: The zoom increment is ~2.5x too large for a 4-second scene. At 100 frames, it would try to zoom to 1.375, but `min(zoom+0.00375, 1.15)` caps it. This means the zoom hits max at frame 40 (1.6 seconds) and stays static for the remaining 2.4 seconds. Looks jerky, not smooth.
- For 3s scenes (75 frames): hits max at frame 40 (~1.6s), static for 1.4s
- For 5s scenes (125 frames): hits max at frame 40 (~1.6s), static for 3.4s

**The correct increment should be**: `0.15 / (duration_seconds * 25)` — dynamically calculated per scene. Currently hardcoded, causing non-smooth Ken Burns on any duration.

### 6. Crossfade Chain — PASS (with offset bug risk)
Uses `xfade=transition=fade:duration=1` between each pair of scenes. Handles 1, 2, and N scenes.

**Approach**: Sequential pairwise merging (scene1+scene2 → merge_1, merge_1+scene3 → merge_2, etc.). This works but causes **generation loss** — each intermediate merge re-encodes with libx264, compounding quality loss across 6-8 scenes.

**Offset calculation**: `cumulativeDuration - 1` for each subsequent merge. This is correct for the simple case but depends on `scene.duration_seconds` matching the actual rendered duration from Ken Burns. If Ken Burns produces a slightly different duration (due to frame rounding), offsets will drift.

**Spec match**: Uses fade transition with 1.0s duration. Spec says crossfade 1.0s — matches. Spec also mentions wipe-right and hard-cut as options, but the workflow only supports fade.

### 7. Text Overlays — PASS (with font issue)
Uses `drawtext` filter with:
- Font: `/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf`
- Size: 52px (spec says 56px in config.json, 44px in brand-system.md)
- Color: white with black shadow (spec says white text, shadow — matches)
- Positions: center, bottom (y=h-th-200), top (y=200)
- CTA text at bottom in last 5 seconds

**Issues**:
1. **Wrong font**: Uses DejaVu Sans Bold, spec requires **Inter Bold**. There's a fallback that strips `fontfile=` entirely if the font isn't found, and a final fallback that skips overlays altogether. This means text will silently degrade or disappear.
2. **Font size mismatch**: 52px vs spec's 56px (config.json) or 44px (brand-system.md). Inconsistent.
3. **Missing brand styling**: Spec calls for `#D4956A @ 85% opacity` background box, 8px 16px padding, border radius. The workflow only has shadow — no background box at all.
4. **No Inter font installed**: The n8n server almost certainly doesn't have Inter Bold. The double-fallback masks this by silently producing videos without text.

### 8. Music Mix — PASS
```
ffmpeg -i overlay.mp4 -i music.mp3 -filter_complex "[1:a]volume=0.4[music]" -map 0:v -map "[music]" -c:v copy -c:a aac -shortest final.mp4
```
- Volume: 0.4 (matches spec and config.json)
- Uses `-shortest` to trim music to video length
- Video stream is copied (no re-encode) — good
- Audio encoded as AAC — matches spec

**No fade-in/fade-out on music**: The audio-optimization.md pattern says fades are pre-baked in the optimized music files, so this is fine IF optimized tracks are always used. If a non-optimized track is passed, music will cut abruptly.

### 9. Validation — PASS
Checks: resolution=1080x1920, codec=h264, duration 10-120s, size <100MB, has audio. All reasonable.

### 10. Drive Upload — PASS
Uploads to folder `1ZcjtI6lwLwxh-kKN8rqzKYRMoroBrK0z` (Videos folder). Correct per schema map.

### 11. Public Permissions — PASS (previously fixed)
Uses `operation: "share"` with `permissionsUi` pattern. This was the fix documented in neo-learnings.md line 191. Now using correct v3 pattern.

### 12. Airtable Video Record — PASS
Creates record in `tblr3X73lfCjul8Br` (Videos table) with correct base `appWVJhdylvNm07nv`. Fields mapped:
- Video Title, Video Type (B-Roll), Status (Assembled), Drive URL, Duration, Resolution, File Size MB, Playbook (linked)
- Uses Airtable v2.1 — correct per neo-learnings.md fixes

### 13. Credential IDs — PASS
- Drive: `53ssDoT9mG1Dtejj` — matches schema map
- Airtable: `YCWFwTIXwnTpVy2y` — matches schema map

### 14. Node typeVersions — PASS
- executeWorkflowTrigger: 1.1 (current)
- code: 2 (current)
- googleDrive: 3 (current)
- airtable: 2.1 (updated per neo-learnings)
- errorTrigger: 1 (only version)

### 15. Error Handling — PASS
Error Trigger + Error Handler cleans up `/tmp/haven-broll-*` directories on failure and returns structured error with message, node, and timestamp.

---

## Summary of Issues

### CRITICAL (will cause visible defects)

| # | Issue | Node | Impact |
|---|-------|------|--------|
| C1 | **Ken Burns zoom increment hardcoded** | Ken Burns Per Scene | Zoom completes at ~1.6s then freezes for remainder of scene. Looks jerky, not smooth ease-in-out as spec requires. |
| C2 | **Wrong font (DejaVu, not Inter Bold)** | Text Overlays | Text styling doesn't match brand. Falls back to system default or no text at all. |
| C3 | **No background box on text** | Text Overlays | Spec requires `#D4956A @ 85%` background with padding. Only shadow is applied. |
| C4 | **Scene images downloaded via curl, not Drive API** | Download Scene Images | Will fail on any non-public file or files triggering Google's download warning page. |

### MODERATE (may cause issues)

| # | Issue | Node | Impact |
|---|-------|------|--------|
| M1 | **Font size inconsistency** | Text Overlays | 52px used, spec says 56px (config) or 44px (brand-system). |
| M2 | **Sequential re-encoding in crossfade chain** | Crossfade Chain | Generation loss compounds across 6-8 scenes. Visual quality degrades. |
| M3 | **Only fade transition supported** | Crossfade Chain | Spec defines wipe-right and hard-cut options but workflow only does fade. |
| M4 | **No input validation node** | (missing) | No check that scenes array has required fields before processing begins. |
| M5 | **Video read into memory as base64** | Read Final Video | For a 30-second 1080x1920 video, this could be 20-50MB loaded entirely into n8n memory as a base64 string (1.33x size). Could cause OOM on constrained servers. |

### LOW (cosmetic / future concern)

| # | Issue | Node | Impact |
|---|-------|------|--------|
| L1 | No `script_record_id` used anywhere | Multiple | Passed through but never written to Airtable. Videos table doesn't link back to Content Pipeline. |
| L2 | Crossfade offset drift risk | Crossfade Chain | If Ken Burns produces slightly different duration than `duration_seconds`, offsets will be wrong. |
| L3 | Music curl fallback in Save Music | Save Music to Disk | Same brittleness as C4 but only triggered if Drive binary handoff fails. |

---

## Verdict

**WF-006 is structurally complete but has 4 critical issues that will produce broken or brand-inconsistent output.**

The workflow architecture is sound — the 16-node linear pipeline covers the full assembly lifecycle from download through upload and tracking. The node versions and credential IDs are correct (fixes from neo-learnings already applied). The Airtable record creation and Drive upload are properly configured.

However, the FFMPEG filtergraph was clearly built without a formal assembly spec:

1. The Ken Burns math is wrong (C1), producing jerky motion instead of smooth pan
2. The text overlay styling is completely wrong — wrong font, wrong size, no background box (C2, C3)
3. The scene download bypasses OAuth entirely (C4), which will fail in production

**Recommendation**: Write a formal FFMPEG Assembly Specification before fixing. The scattered parameters across `brand-system.md` and `config.json` are insufficient — they define *what* the output should look like but not *how* the filtergraph should be constructed. A proper spec should define:
- Exact zoompan expression with dynamic increment calculation
- Font installation requirements (Inter Bold .ttf path on n8n server)
- Complete drawtext filter with box styling parameters
- Whether to use concat demuxer instead of sequential xfade to avoid re-encoding loss
- Scene image download strategy (Drive API with SplitInBatches, or pre-signed URLs)
- Memory management for video binary handoff to Drive upload node

---

*Audit performed against: brand-system.md (lines 222-254), config.json (lines 53-62), audio-optimization.md, airtable-schema-map.md, neo-learnings.md (lines 190-191)*
