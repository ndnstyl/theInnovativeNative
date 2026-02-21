# BowTie Bullies — Premiere Pro Editing SOP

> Polishing AI-generated rough cuts into publish-ready episodes.
> Total hands-on time: **16-21 minutes** per episode (after automation).

---

## Phase 0: Automation (Pipeline -> Timeline -> Asset Prep -> XML)

Run these three commands in order from the repo root. They generate the .cube LUT, organize all media into Premiere-friendly bins, and produce the XMEML import file.

```bash
# 1. Generate the BowTie color grade LUT (only needed once, or after grade changes)
python scripts/shared/hald_to_cube.py \
  --output projects/004-bowtie-bullies/media/grade/BowTie-Grade.cube \
  --size 33 --saturation 0.75 --contrast 1.15 --brightness -0.03

# 2. Prep assets into bin structure (copies media into premiere-prep/)
python scripts/shared/prep_premiere_assets.py \
  projects/004-bowtie-bullies/episodes/EP-001/EP-001-marathon-continues-timeline.json \
  --output premiere-prep/EP-001 \
  --base-path /path/to/repo

# 3. Generate Premiere XML from timeline JSON
python scripts/shared/timeline_to_premiere_xml.py \
  projects/004-bowtie-bullies/episodes/EP-001/EP-001-marathon-continues-timeline.json \
  -o premiere-prep/EP-001/EP-001.xml \
  --base-path /path/to/premiere-prep/EP-001
```

### One-liner (experienced users)

```bash
python scripts/shared/hald_to_cube.py --output projects/004-bowtie-bullies/media/grade/BowTie-Grade.cube --size 33 --saturation 0.75 --contrast 1.15 --brightness -0.03 && python scripts/shared/prep_premiere_assets.py projects/004-bowtie-bullies/episodes/EP-001/EP-001-marathon-continues-timeline.json --output premiere-prep/EP-001 --base-path /path/to/repo && python scripts/shared/timeline_to_premiere_xml.py projects/004-bowtie-bullies/episodes/EP-001/EP-001-marathon-continues-timeline.json -o premiere-prep/EP-001/EP-001.xml --base-path /path/to/premiere-prep/EP-001
```

### What the scripts produce

```
premiere-prep/EP-001/
├── 01-Video/Intro/
├── 01-Video/Outro/
├── 01-Video/Stills/
├── 01-Video/Overlays/
├── 02-VO/
├── 03-SFX/Beds/
├── 03-SFX/Events/
├── 04-Music/
├── 05-Grade/          <-- BowTie-Grade.cube copied here
├── 06-Export/
└── manifest.txt       <-- all files with track assignments
```

The XML maps tracks as:

| Track | Content |
|-------|---------|
| **V1** | Video (stills, intro, outro, overlays) |
| **A1** | Voiceover |
| **A2** | SFX beds (ambient loops) |
| **A3** | SFX events (one-shots) |
| **A4** | Music |
| **A5** | Reserved (empty) |

Ken Burns clips include a zoom hint in the clip name, e.g. `scene-001 [KB->108%]`.

### Useful flags

```bash
# Preview track summary without writing a file
python scripts/shared/timeline_to_premiere_xml.py timeline.json --dry-run

# Validate generated XML structure
python scripts/shared/timeline_to_premiere_xml.py timeline.json --validate

# Use symlinks instead of copies (saves disk space)
python scripts/shared/prep_premiere_assets.py timeline.json --output dir --symlink
```

---

## Phase 1: Import & Verify (2 min)

1. Open Premiere Pro. Create a new project or open an existing one.
2. **Cmd+I** (File > Import) -- select the generated `EP-001.xml`.
3. Premiere creates a sequence from the XML. Double-click it to open in the Timeline panel.
4. Check for offline media:
   - Look for red **Media Offline** frames on V1.
   - If any clips are offline: right-click the clip > **Link Media** > navigate to `premiere-prep/EP-001/`.
5. Verify sequence duration in the Program Monitor or Timeline:
   - Expected: **~635.5 seconds (10:35)**. Confirm it is within a few seconds.
   - If drastically off, re-run Phase 0 -- the timeline JSON may have changed.
6. Scrub through the full timeline at 8x (**Shift+L** x3) to confirm clips are present on all tracks.

---

## Phase 2: Ken Burns Pass (5-8 min)

Apply slow zoom/pan (Ken Burns) motion to all still images on V1. Look for clips with `[KB->xxx%]` in their name -- these need motion keyframes.

### Identify clips

1. In the Timeline, look at clip names on V1. Every clip with `[KB->xxx%]` needs keyframes.
2. Clips without the `[KB->]` tag (intro, outro, black transition beats) should be left static.

### Set up the first clip

1. Select the first `[KB->]` clip on **V1**.
2. Open **Effect Controls** panel (**Shift+5**).
3. Position the playhead at the clip's **in point** (**Up Arrow** to jump to previous edit).
4. Under **Motion**, click the stopwatch icons for both **Scale** and **Position** to enable keyframing.
5. Set starting values:
   - **Scale**: 100%
   - **Position**: centered (960, 540 for 1080p)
6. Move the playhead to the clip's **out point** (**Down Arrow** to jump to next edit).
7. Set ending values:
   - **Scale**: value from the clip name hint (e.g. 108% for `[KB->108%]`)
   - **Position**: shift slightly toward the subject (adjust by 20-40px as needed)
8. Right-click each keyframe > **Ease In / Ease Out** for smooth motion.

### Batch apply to similar clips

1. Select the clip you just keyframed on V1.
2. **Cmd+C** (Copy).
3. Select all remaining `[KB->]` clips on V1 that share the same zoom percentage:
   - Click the first target clip, then **Shift+Click** the last in the group.
4. **Cmd+Alt+V** (Edit > Paste Attributes).
5. In the dialog, check **only** "Motion" -- uncheck everything else.
6. Click OK.
7. Repeat steps 1-6 for groups with different `[KB->xxx%]` values, adjusting the end Scale for each group.

### Verify

- Scrub through each clip to confirm the zoom motion looks natural.
- Adjust individual clips where the zoom target is off-center or the subject is not well-framed.

> **Tip**: The batch paste sets the keyframe structure. You only need to update the end Scale value for clips with different zoom targets.

---

## Phase 3: Color Grade (2 min)

### Add Adjustment Layer on V2

1. In the Project panel, click **New Item** (bottom-left icon) > **Adjustment Layer** (or **Cmd+Alt+Y**).
   - Match sequence settings (1920x1080, 23.976fps). Click OK.
2. Drag the Adjustment Layer to **V2**, spanning the entire sequence.
   - Snap to start: hold **Shift** while dragging to the beginning.
   - Extend to end: drag the right edge to the sequence end (or trim with **Shift+O**).

### Load the LUT

1. Select the Adjustment Layer on V2.
2. Open **Effect Controls** (**Shift+5**).
3. In the Effects panel (**Shift+7**), search for **Lumetri Color**. Drag it onto the Adjustment Layer.
4. In Effect Controls > Lumetri Color > **Basic Correction** > **Input LUT** dropdown:
   - Click **Browse...** > navigate to `premiere-prep/EP-001/05-Grade/BowTie-Grade.cube`.
   - The LUT applies the grade: `saturation=0.75, contrast=1.15, brightness=-0.03`.

### Effects NOT in the LUT (apply manually on the Adjustment Layer)

These three effects cannot be baked into a LUT. Apply them on the **same Adjustment Layer** on V2:

**Add Noise:**
1. Effects panel (**Shift+7**) > search "Add Noise" > drag onto the Adjustment Layer.
2. In Effect Controls:
   - **Amount of Noise**: **20%**
   - **Type of Noise**: **Uniform**
   - **Color Noise**: unchecked (monochrome grain)

**Unsharp Mask:**
1. Effects panel > search "Unsharp Mask" > drag onto the Adjustment Layer.
2. In Effect Controls:
   - **Amount**: **50**
   - **Radius**: **5.0**
   - **Threshold**: **0**

**Vignette (via Lumetri Color):**
1. In Effect Controls > Lumetri Color > expand the **Vignette** section:
   - **Amount**: **-1.2**
   - **Midpoint**: **39**
   - Leave Roundness and Feather at defaults.

---

## Phase 4: Audio Mix (3 min)

Open the **Essential Sound** panel: **Window > Essential Sound**.

### Tag A1 as Dialogue

1. Select all clips on **A1** (click first clip, **Cmd+A** with A1 track targeted, or **Shift+Click** to select range).
2. In Essential Sound panel, click **Dialogue**.
3. Optionally enable **Auto Match** to normalize spoken levels.
4. Check VO levels: peaks should read **-6 to -3 dB** on the Audio Meters panel (**Shift+6**).

### Tag A4 as Music

1. Select all clips on **A4**.
2. In Essential Sound panel, click **Music**.

### Enable ducking on Music

1. With A4 clips still selected, in Essential Sound > Music section:
   - Check **Ducking**.
   - **Duck Against**: Dialogue
   - **Sensitivity**: default (leave as-is)
   - **Reduce By**: **-8 dB**
   - **Fades**: **500 ms**
2. Click **Generate Keyframes**.
3. Play back a VO-over-music section to verify music dips under dialogue.

### SFX tracks

- **A2** (SFX beds) and **A3** (SFX events): leave at timeline levels set by the XML.
- No Essential Sound tagging needed -- levels were baked in the pipeline.
- If any SFX clip sounds too loud or quiet, adjust clip volume directly: select clip > drag the white volume rubber band on the clip, or type a value in Effect Controls > Volume > Level.

---

## Phase 5: Flow Pass (3-5 min)

Play the full sequence at **2x speed** and scan for problems.

### Playback controls

| Action | Shortcut |
|--------|----------|
| Play | **L** |
| 2x speed | **L** pressed twice |
| Reverse | **J** (press multiple times to increase speed) |
| Pause | **K** |
| Shuttle through problem areas | **J/K/L** (hold K+L for slow forward, K+J for slow reverse) |

### What to look for

| Issue | Fix |
|-------|-----|
| **Awkward cut** (two similar stills back-to-back) | Add a **Cross Dissolve** (**Cmd+D**) at the cut point, 8-12 frames |
| **Timing issue** (gap too long, >1.5s dead air between VO) | **Ripple Delete** the gap (**Shift+Delete**) or trim shorter |
| **Timing issue** (gap too short, <0.3s between VO clips) | Extend gap: **N** (Ripple Trim Next Edit to Playhead) to add breathing room |
| **Audio pop/click** at a hard edit | Zoom in (**=** key), add a 2-frame audio crossfade: select edit point, **Cmd+Shift+D** |
| **Missing transition** (abrupt scene change) | Add **Cross Dissolve** (**Cmd+D**), 12-15 frames |
| **Ken Burns feels wrong** (zooming into nothing) | Adjust keyframes in Effect Controls for that specific clip |
| **Music ends abruptly** | Select clip end, add audio fade-out with **Cmd+Shift+D** (1-2 seconds) |

### Second pass

Play again at **1x** (**L** from stop) through any sections you flagged. Confirm fixes hold.

---

## Phase 6: Export (1 min)

1. Set In/Out points for the full sequence:
   - **Home** (go to start) > **I** (mark in).
   - **End** (go to end) > **O** (mark out).
2. **Cmd+M** (File > Export > Media).
3. Configure settings:

**Format**: H.264

**Video tab**:
- **Encoding**: **VBR, 2 Pass**
- **Target Bitrate**: **16 Mbps**
- **Maximum Bitrate**: 20 Mbps
- Resolution: Match Source (1920x1080)
- Frame Rate: Match Source (23.976fps)

**Audio tab**:
- **Audio Codec**: **AAC**
- **Bitrate**: **320 kbps**
- **Sample Rate**: 48000 Hz

**Effects tab**:
- **Loudness Normalization**: checked
- **Target Loudness**: **-14 LUFS**
- **Loudness Standard**: ITU BS.1770-4

4. **Output Name**: click to set path to `premiere-prep/EP-001/06-Export/EP-001-master.mp4`.
5. Click **Export** (or **Cmd+Enter** to send to Media Encoder queue).

---

## Don't Forget Checklist

Run through every item before marking the episode as complete.

- [ ] All Ken Burns applied (no remaining `[KB->]` tags in clip names without motion keyframes)
- [ ] Adjustment layer covers entire sequence on V2
- [ ] Grade + Noise + Sharpening + Vignette all applied on the Adjustment Layer
- [ ] VO audible over music (ducking active, keyframes generated)
- [ ] No "Media Offline" clips (zero red frames in sequence)
- [ ] Sequence duration matches timeline (~10:35 / 635.5s)
- [ ] Export includes audio (not muted -- check A1-A4 are not soloed/muted)
- [ ] File saved before export (**Cmd+S**)

### Detailed value verification

| Setting | Expected Value |
|---------|---------------|
| Add Noise amount | 20% Uniform |
| Unsharp Mask | Amount 50, Radius 5.0, Threshold 0 |
| Vignette | Amount -1.2, Midpoint 39 |
| Ducking | -8 dB, 500ms fades |
| VO peak levels | -6 to -3 dB |
| Export codec | H.264, VBR 2-pass, 16 Mbps target |
| Export audio | AAC, 320 kbps |
| Loudness | -14 LUFS |
| Output folder | `06-Export/` |
