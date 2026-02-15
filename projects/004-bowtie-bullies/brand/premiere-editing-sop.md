# Premiere Pro Editing SOP — BowTie Bullies

> Polishing AI-generated rough cuts into publish-ready episodes.
> Total hands-on time: **16-21 minutes** per episode (after automation).

---

## Phase 0: Automation (CLI Pipeline)

Run these three commands in order from the repo root. They generate the .cube LUT, organize all media into Premiere-friendly bins, and produce the XMEML import file.

```bash
# 1. Generate the BowTie color grade LUT (only needed once, or after grade changes)
python scripts/shared/hald_to_cube.py \
  --output projects/004-bowtie-bullies/media/grade/BowTie-Grade.cube

# 2. Prep assets into bin structure (copies media into premiere-prep/)
python scripts/shared/prep_premiere_assets.py \
  EP-001-marathon-continues-timeline.json \
  --output premiere-prep/EP-001 \
  --base-path /path/to/repo

# 3. Generate Premiere XML from timeline JSON
python scripts/shared/timeline_to_premiere_xml.py \
  EP-001-marathon-continues-timeline.json \
  -o EP-001.xml \
  --base-path /path/to/premiere-prep/EP-001
```

### One-liner (experienced users)

```bash
python scripts/shared/hald_to_cube.py --output projects/004-bowtie-bullies/media/grade/BowTie-Grade.cube && python scripts/shared/prep_premiere_assets.py EP-001-marathon-continues-timeline.json --output premiere-prep/EP-001 --base-path /path/to/repo && python scripts/shared/timeline_to_premiere_xml.py EP-001-marathon-continues-timeline.json -o EP-001.xml --base-path /path/to/premiere-prep/EP-001
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
├── 05-Grade/          ← BowTie-Grade.cube copied here
├── 06-Export/
└── manifest.txt       ← all files with track assignments
```

The XML maps tracks as:
- **V1** — Video (stills, intro, outro)
- **A1** — Voiceover
- **A2** — SFX beds
- **A3** — SFX events
- **A4** — Music
- **A5** — Reserved (empty)

Ken Burns clips include a zoom hint in the clip name, e.g. `scene-001 [KB→108%]`.

---

## Phase 1: Import & Verify (2 min)

1. Open Premiere Pro. Create a new project or open an existing one.
2. **Cmd+I** (File > Import) — select the generated `EP-001.xml`.
3. Premiere creates a sequence from the XML. Open it in the Timeline panel.
4. Check for offline media:
   - Look for red "Media Offline" frames on V1.
   - If any clips are offline: right-click the clip > **Link Media** > navigate to `premiere-prep/EP-001/`.
5. Verify sequence duration in the Program Monitor or Timeline:
   - Expected: **~635.5 seconds** (10:35.5). Confirm it is within a few seconds.
   - If drastically off, re-run Phase 0 — the timeline JSON may have changed.
6. Scrub through the full timeline at 8x (**Shift+L** x3) to confirm clips are present on all tracks.

---

## Phase 2: Ken Burns Pass (5-8 min)

Apply slow zoom/pan (Ken Burns) motion to all still images on V1.

### Setup the first clip

1. Select the first still on **V1**.
2. Open **Effect Controls** panel (**Shift+5**).
3. Position the playhead at the clip's **in point** (**Up Arrow** to jump to edit).
4. Under **Motion**, click the stopwatch icons for both **Position** and **Scale** to enable keyframing.
5. Set starting values:
   - **Scale**: 100%
   - **Position**: centered (960, 540 for 1080p)
6. Move the playhead to the clip's **out point** (**Down Arrow**).
7. Set ending values:
   - **Scale**: value from clip name hint, e.g. 108% for `[KB→108%]`
   - **Position**: shift slightly toward the subject (adjust by 20-40px as needed)
8. Right-click each keyframe > **Ease In / Ease Out** for smooth motion.

### Batch apply to remaining stills

1. Select the clip you just keyframed on V1.
2. **Cmd+C** (Copy).
3. Select all remaining still clips on V1:
   - Click the first remaining still, then **Shift+Click** the last still.
4. **Cmd+Alt+V** (Edit > Paste Attributes).
5. In the dialog, check **only** "Motion" — uncheck everything else.
6. Click OK.
7. Scrub through each clip to verify the motion looks natural. Adjust individual clips where the zoom target is off-center.

> **Tip**: Clips with different `[KB→xxx%]` values need individual Scale adjustments after the batch paste. The batch sets the keyframe structure; you update the end Scale value per clip.

---

## Phase 3: Color Grade (2 min)

### Apply the LUT via Adjustment Layer

1. In the Project panel, click **New Item** (bottom-left icon) > **Adjustment Layer**.
   - Match sequence settings (1920x1080, 23.976fps). Click OK.
2. Drag the Adjustment Layer to **V2**, spanning the entire sequence.
   - Snap to start: hold **Shift** while dragging.
   - Extend to end: drag the right edge to the sequence end.
3. Select the Adjustment Layer on V2.
4. Open **Effect Controls** (**Shift+5**).
5. In the Effects panel (**Shift+7**), search for **Lumetri Color**. Drag it onto the Adjustment Layer.
6. In Effect Controls > Lumetri Color > **Basic Correction** > **Input LUT** dropdown:
   - Click **Browse...** > navigate to `premiere-prep/EP-001/05-Grade/BowTie-Grade.cube`.
   - The LUT applies: `saturation=0.75, contrast=1.15, brightness=-0.03`.

### Manual effects (NOT in the LUT — must apply separately)

These three effects are applied on the same Adjustment Layer on V2:

**Add Noise:**
1. Effects panel (**Shift+7**) > search "Add Noise" > drag onto the Adjustment Layer.
2. In Effect Controls:
   - **Amount of Noise**: 20%
   - **Type of Noise**: Uniform
   - **Color Noise**: unchecked (use monochrome grain)

**Unsharp Mask:**
1. Effects panel > search "Unsharp Mask" > drag onto the Adjustment Layer.
2. In Effect Controls:
   - **Amount**: 50
   - **Radius**: 5.0
   - **Threshold**: 0

**Vignette (via Lumetri Color):**
1. In Effect Controls > Lumetri Color > expand **Vignette** section:
   - **Amount**: -1.2
   - **Midpoint**: 39
   - Leave Roundness, Feather at defaults.

---

## Phase 4: Audio Mix (3 min)

Use the **Essential Sound** panel (**Window > Essential Sound**).

### Tag tracks

1. Solo **A1** (**S** key with A1 header selected). Select all clips on A1.
   - In Essential Sound, click **Dialogue**.
   - Enable **Auto Match** to normalize spoken levels.
2. Select all clips on **A4**.
   - In Essential Sound, click **Music**.

### Enable ducking

1. With A4 clips still selected in Essential Sound > Music section:
   - Check **Ducking**.
   - **Duck Against**: Dialogue
   - **Sensitivity**: default (leave as-is)
   - **Reduce By**: **-8 dB**
   - **Fades**: **500 ms**
   - Click **Generate Keyframes**.
2. Play back a VO-over-music section to verify music dips under dialogue.

### SFX tracks

- **A2** (SFX beds) and **A3** (SFX events): leave at timeline levels set by the XML.
- No Essential Sound tagging needed — levels were set in the pipeline.
- If any SFX clips sound too loud/quiet, adjust clip volume directly: select clip > drag the white volume line on the clip, or type a value in Effect Controls > Volume > Level.

---

## Phase 5: Flow Pass (3-5 min)

Play the full sequence at **2x speed** (**L** pressed twice) and watch for problems.

### What to look for

| Issue | Fix |
|---|---|
| **Jump cut** (two similar stills back-to-back with jarring transition) | Add a **Cross Dissolve** (**Cmd+D**) at the cut point, 8-12 frames |
| **Silence gap too long** (>1.5s dead air between VO segments) | Trim the gap: **Ripple Delete** (**Shift+Delete** on the gap) or shorten |
| **Silence gap too short** (<0.3s between VO) | Extend the gap: **N** (Ripple Trim Next Edit to Playhead) to add breathing room |
| **Audio pop/click** | Zoom in (**=** key), add a 2-frame audio crossfade at the edit: select edit point, **Cmd+Shift+D** |
| **Visual glitch** (black frame, misaligned overlay) | Check clip boundaries, re-link if needed |
| **Ken Burns feels wrong** (zoom into nothing, too fast) | Adjust keyframes in Effect Controls for that clip |
| **Music ends abruptly** | Add a 1-2 second audio fade-out: select clip end, **Cmd+Shift+D** |

### Second watch

Play again at **1x** (**L** once from stop) through any sections you flagged. Confirm fixes hold.

---

## Phase 6: Export (1 min)

1. Set In/Out points for the full sequence:
   - **Home** (go to start) > **I** (mark in).
   - **End** (go to end) > **O** (mark out).
2. **Cmd+M** (File > Export Media).
3. Settings:
   - **Format**: H.264
   - **Preset**: start from "Match Source - High bitrate" then modify:
   - **Video tab**:
     - **Quality**: CRF 18 (constant quality — visually lossless)
   - **Audio tab**:
     - **Audio Codec**: AAC
     - **Bitrate**: 128 kbps
     - **Sample Rate**: 48000 Hz
   - **Effects tab**:
     - **Loudness Normalization**: checked
     - **Target Loudness**: **-14 LUFS**
     - **Loudness Standard**: ITU BS.1770-4
4. **Output Name**: click to set path to `premiere-prep/EP-001/06-Export/EP-001-master.mp4`.
5. Click **Export** (or **Cmd+Enter** to send to Media Encoder queue).

---

## Don't Forget Checklist

Run through every item before marking the episode as complete.

- [ ] **Offline media**: zero red frames in the sequence
- [ ] **Sequence duration**: within 5 seconds of expected (~635.5s for EP-001)
- [ ] **Ken Burns**: every still on V1 has Position+Scale keyframes (no static stills)
- [ ] **LUT applied**: Lumetri Color on V2 Adjustment Layer shows BowTie-Grade.cube loaded
- [ ] **Noise/Sharpen/Vignette**: all three manual effects present on the Adjustment Layer
- [ ] **Noise values**: 20% Uniform
- [ ] **Unsharp Mask values**: Amount 50, Radius 5.0, Threshold 0
- [ ] **Vignette values**: Amount -1.2, Midpoint 39
- [ ] **Dialogue tagged**: A1 clips tagged as Dialogue in Essential Sound
- [ ] **Music tagged**: A4 clips tagged as Music with ducking enabled
- [ ] **Ducking settings**: -8 dB, 500ms fades, keyframes generated
- [ ] **SFX untouched**: A2/A3 at pipeline-set levels (no accidental changes)
- [ ] **No dead air >1.5s**: gaps between VO segments are natural, not empty
- [ ] **No audio pops**: crossfades at all hard VO edits
- [ ] **Export codec**: H.264, CRF 18
- [ ] **Export audio**: AAC 128 kbps
- [ ] **Loudness**: -14 LUFS normalization enabled
- [ ] **Output path**: file lands in `06-Export/` folder
- [ ] **Playback check**: watch first 30 seconds of exported file to confirm no encode errors
