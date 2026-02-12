# Boondocks-Style ComfyUI Spec (M4 Pro, 24 GB)

## Goal
Create cel‑shaded 2D stills that preserve a character’s identity and place them into new backgrounds. Output should support Ken Burns pan/zoom and optional parallax. Short animation is optional and lower priority due to stability.

## Platform Constraints
- MacBook Pro (Apple M4 Pro, 24 GB)
- ComfyUI running on MPS
- Prioritize reliability and repeatability over max realism

## Recommended Approach (Primary)
**Stills + Ken Burns**
- Generate clean, stylized stills
- Export separate foreground/background for motion in video editor
- Most reliable on Mac MPS

## Optional Approach (Secondary)
**Short animated clips using AnimateDiff**
- Lower resolution and more artifacts expected
- Use only if stills workflow is stable

---

## Core Model Stack (Stills)
**Base SDXL Anime Checkpoint**
- Animagine XL 4.0 (or another SDXL anime checkpoint)

**SDXL Inpainting Model**
- `stable-diffusion-xl-1.0-inpainting-0.1`

**SDXL VAE (fp16 fix)**
- `sdxl-vae-fp16-fix`

**IP‑Adapter (Identity Preservation)**
- IP‑Adapter Plus (SDXL)

**ControlNet (Structure/pose guidance)**
- Canny SDXL
- OpenPose SDXL (optional)

---

## Custom Nodes (Stills)
- ComfyUI IP‑Adapter Plus
- ComfyUI ControlNet Aux (preprocessors)
- Advanced ControlNet (optional)

## Optional Motion Stack (Short Clips)
- AnimateDiff custom node
- SD1.5 anime checkpoint
- AnimateDiff motion module

---

## File Layout (Expected by ComfyUI)
```
comfyUI/models/checkpoints/
  animagine_xl_4.0.safetensors

comfyUI/models/vae/
  sdxl-vae-fp16-fix.safetensors

comfyUI/models/ipadapter/
  ip-adapter-plus_sdxl_vit-h.safetensors
  ip-adapter-plus-face_sdxl_vit-h.safetensors
  ip-adapter_sdxl_vit-h.safetensors (optional)

comfyUI/models/clip_vision/
  CLIP-ViT-H-14-laion2B-s32B-b79K.safetensors
  CLIP-ViT-bigG-14-laion2B-39B-b160k.safetensors

comfyUI/models/controlnet/
  controlnet-canny-sdxl-1.0.safetensors
  controlnet-openpose-sdxl-1.0.safetensors (optional)
```

---

## Workflow Design (Stills)
**Inputs**
- Character reference image
- Background prompt
- Optional control image (Canny/OpenPose)

**Process**
1. Load reference character image
2. Generate or import mask (keep character, replace background)
3. IP‑Adapter Plus to preserve identity
4. Optional ControlNet Canny/OpenPose for structure
5. SDXL inpainting to replace background
6. Output:
   - Final composite
   - Foreground (character)
   - Background (clean plate)

---

## Workflow Design (Optional AnimateDiff)
**Constraints**
- 24–48 frames at 512–768 px on MPS
- Use SD1.5 anime checkpoint for speed

**Process**
1. Load base image or reference frame
2. ControlNet Canny/OpenPose for structure
3. AnimateDiff nodes for motion
4. Export short clip

---

## Recommended Parameters (Stills)
- Resolution: 1024 px on long side
- Steps: 20–28
- CFG: 4–7
- Denoise: 0.35–0.55
- IP‑Adapter strength: 0.6–0.9
- ControlNet strength: 0.5–0.8

---

## Claude Code Build Tasks
1. Create `workflows/boondocks_stills.json`
   - Nodes: Load Image, Mask, ControlNet Canny, IP‑Adapter Plus, KSampler, VAE Decode, Save Image
2. Create `workflows/boondocks_inpaint.json`
   - SDXL inpaint workflow with mask
3. Create `scripts/run_batch.py`
   - Send prompts/images to ComfyUI API for batch generation
4. Create `scripts/check_models.py`
   - Verify required model files exist
5. Create `docs/boondocks_pipeline.md`
   - Usage instructions and parameter guidance

---

## Acceptance Criteria
- ComfyUI loads without missing model errors
- Character identity preserved in output
- Background replacement is clean
- Foreground/background layers export separately for Ken Burns/parallax
- Batch script runs multiple prompts reliably
