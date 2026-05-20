#!/usr/bin/env python3
"""
Queue Character Sheet Views to ComfyUI
=======================================
Sends 6 angle views (front, back, left, right, 3/4 front, 3/4 back) to ComfyUI
using IP-Adapter for identity preservation + Afro_Samurai LoRA for Boondocks style.

Usage:
    python queue_character_sheet.py <reference_image_filename> [--server URL] [--character NAME]

    The reference image must already be in ComfyUI/input/ folder.
    Copy your image there first:
        cp /path/to/frenchie.png /path/to/comfyUI/input/frenchie_reference.png

Examples:
    python queue_character_sheet.py frenchie_reference.png
    python queue_character_sheet.py frenchie_reference.png --character "French Bulldog"
    python queue_character_sheet.py frenchie_reference.png --server http://192.168.1.100:8188
"""

import json
import sys
import time
import argparse
import urllib.request
import urllib.error

# ─── Configuration ───────────────────────────────────────────────────────────

COMFYUI_SERVER = "http://127.0.0.1:8188"

# Models (must match what's in your ComfyUI/models/ directories)
CHECKPOINT = "illustriousXL_v01.safetensors"
LORA = "Afro_Samurai_IL1.0.safetensors"
LORA_STRENGTH = 0.8
IPADAPTER_MODEL = "ip-adapter-plus_sdxl_vit-h.safetensors"
CLIP_VISION_MODEL = "CLIP-ViT-H-14-laion2B-s32B-b79K.safetensors"
UPSCALE_MODEL = "4x-UltraSharp.pth"

# Generation settings
WIDTH = 1024
HEIGHT = 1024
STEPS_STAGE1 = 25
CFG = 7.0
SAMPLER = "dpmpp_2m"
SCHEDULER = "normal"
STEPS_STAGE2 = 10
DENOISE_STAGE2 = 0.35
IPADAPTER_WEIGHT = 0.7
OUTPUT_SIZE = 2048  # long edge after upscale

# ─── Negative prompt (shared across all views) ──────────────────────────────

NEGATIVE_PROMPT = (
    "photorealistic, 3D render, realistic fur texture, soft shading, "
    "gradient background, blurry, low quality, deformed, extra limbs, "
    "watermark, text, logo, signature, multiple dogs, human, person, "
    "neon colors, oversaturated, cute puppy, chibi, simple sketch, "
    "rough lines, messy linework, coloring book, grayscale, monochrome"
)

# ─── Style prefix/suffix (injected into every angle prompt) ─────────────────

def build_prompt(character_desc: str, angle_desc: str) -> str:
    """Build a full prompt with character identity + angle + Boondocks style."""
    return (
        f"character sheet, {character_desc}, "
        f"{angle_desc}, "
        "full body, standing pose, plain white background, "
        "character design turnaround, 2D cel-shaded style, "
        "The Boondocks cartoon style, bold black outlines, "
        "flat color shading, clean linework, anime influenced, "
        "sharp edges, high contrast shadows, "
        "professional character reference sheet"
    )


# ─── Angle definitions ──────────────────────────────────────────────────────

def get_angles(character_desc: str) -> list:
    """Return the 6 standard character sheet views."""
    return [
        {
            "name": "front",
            "prompt": build_prompt(character_desc,
                "front view facing camera directly, symmetrical pose, "
                "arms at sides, feet shoulder width apart"),
            "filename_prefix": "bowtie-bullies/char-sheet/frenchie-front"
        },
        {
            "name": "back",
            "prompt": build_prompt(character_desc,
                "rear view from behind, back facing camera, "
                "looking away, showing back details"),
            "filename_prefix": "bowtie-bullies/char-sheet/frenchie-back"
        },
        {
            "name": "left-side",
            "prompt": build_prompt(character_desc,
                "left side profile view, facing left, "
                "full side silhouette, perpendicular to camera"),
            "filename_prefix": "bowtie-bullies/char-sheet/frenchie-left"
        },
        {
            "name": "right-side",
            "prompt": build_prompt(character_desc,
                "right side profile view, facing right, "
                "full side silhouette, perpendicular to camera"),
            "filename_prefix": "bowtie-bullies/char-sheet/frenchie-right"
        },
        {
            "name": "three-quarter-front",
            "prompt": build_prompt(character_desc,
                "three quarter front view, 45 degree angle, "
                "slightly turned to the right, dynamic character pose"),
            "filename_prefix": "bowtie-bullies/char-sheet/frenchie-3q-front"
        },
        {
            "name": "three-quarter-back",
            "prompt": build_prompt(character_desc,
                "three quarter rear view, 45 degree angle from behind, "
                "looking over shoulder, showing back and partial face"),
            "filename_prefix": "bowtie-bullies/char-sheet/frenchie-3q-back"
        },
    ]


# ─── ComfyUI API workflow builder ───────────────────────────────────────────

def build_api_workflow(
    reference_image: str,
    positive_prompt: str,
    filename_prefix: str,
    seed: int = 0
) -> dict:
    """
    Build a ComfyUI API-format workflow for a single character sheet view.

    Pipeline:
      LoadImage → IP-Adapter Advanced ← (IPAdapterModelLoader + CLIPVisionLoader)
      CheckpointLoader → LoraLoader → [model feeds IPAdapter]
      KSampler Stage1 (25 steps) → VAEDecode → VAEEncode →
      KSampler Stage2 (10 steps, 0.35 denoise) → VAEDecode →
      4x UltraSharp Upscale → Resize to 2048 → Save
    """
    return {
        # Checkpoint
        "1": {
            "class_type": "CheckpointLoaderSimple",
            "inputs": {"ckpt_name": CHECKPOINT}
        },
        # LoRA - Afro Samurai (Boondocks cel-shaded style)
        "2": {
            "class_type": "LoraLoader",
            "inputs": {
                "model": ["1", 0],
                "clip": ["1", 1],
                "lora_name": LORA,
                "strength_model": LORA_STRENGTH,
                "strength_clip": LORA_STRENGTH
            }
        },
        # Load reference image
        "3": {
            "class_type": "LoadImage",
            "inputs": {"image": reference_image}
        },
        # IP-Adapter model
        "4": {
            "class_type": "IPAdapterModelLoader",
            "inputs": {"ipadapter_file": IPADAPTER_MODEL}
        },
        # CLIP Vision model
        "5": {
            "class_type": "CLIPVisionLoader",
            "inputs": {"clip_name": CLIP_VISION_MODEL}
        },
        # IP-Adapter Advanced - locks in character identity from reference
        "6": {
            "class_type": "IPAdapterAdvanced",
            "inputs": {
                "model": ["2", 0],
                "ipadapter": ["4", 0],
                "image": ["3", 0],
                "clip_vision": ["5", 0],
                "weight": IPADAPTER_WEIGHT,
                "weight_type": "linear",
                "combine_embeds": "concat",
                "start_at": 0.0,
                "end_at": 1.0,
                "embeds_scaling": "V only"
            }
        },
        # Positive prompt
        "7": {
            "class_type": "CLIPTextEncode",
            "inputs": {
                "clip": ["2", 1],
                "text": positive_prompt
            }
        },
        # Negative prompt
        "8": {
            "class_type": "CLIPTextEncode",
            "inputs": {
                "clip": ["2", 1],
                "text": NEGATIVE_PROMPT
            }
        },
        # Empty latent (1024x1024 square)
        "9": {
            "class_type": "EmptyLatentImage",
            "inputs": {
                "width": WIDTH,
                "height": HEIGHT,
                "batch_size": 1
            }
        },
        # KSampler Stage 1 - initial generation
        "10": {
            "class_type": "KSampler",
            "inputs": {
                "model": ["6", 0],
                "positive": ["7", 0],
                "negative": ["8", 0],
                "latent_image": ["9", 0],
                "seed": seed,
                "steps": STEPS_STAGE1,
                "cfg": CFG,
                "sampler_name": SAMPLER,
                "scheduler": SCHEDULER,
                "denoise": 1.0
            }
        },
        # VAE Decode stage 1
        "11": {
            "class_type": "VAEDecode",
            "inputs": {
                "samples": ["10", 0],
                "vae": ["1", 2]
            }
        },
        # VAE Encode for stage 2 img2img
        "12": {
            "class_type": "VAEEncode",
            "inputs": {
                "pixels": ["11", 0],
                "vae": ["1", 2]
            }
        },
        # KSampler Stage 2 - refinement pass
        "13": {
            "class_type": "KSampler",
            "inputs": {
                "model": ["6", 0],
                "positive": ["7", 0],
                "negative": ["8", 0],
                "latent_image": ["12", 0],
                "seed": seed,
                "steps": STEPS_STAGE2,
                "cfg": CFG,
                "sampler_name": SAMPLER,
                "scheduler": "simple",
                "denoise": DENOISE_STAGE2
            }
        },
        # VAE Decode stage 2
        "14": {
            "class_type": "VAEDecode",
            "inputs": {
                "samples": ["13", 0],
                "vae": ["1", 2]
            }
        },
        # Upscale model loader
        "15": {
            "class_type": "UpscaleModelLoader",
            "inputs": {"model_name": UPSCALE_MODEL}
        },
        # 4x upscale
        "16": {
            "class_type": "ImageUpscaleWithModel",
            "inputs": {
                "upscale_model": ["15", 0],
                "image": ["14", 0]
            }
        },
        # Resize to target (2048px long edge)
        "17": {
            "class_type": "JWImageResizeByLongerSide",
            "inputs": {
                "image": ["16", 0],
                "size": OUTPUT_SIZE,
                "interpolation_mode": "bicubic"
            }
        },
        # Save
        "18": {
            "class_type": "SaveImage",
            "inputs": {
                "images": ["17", 0],
                "filename_prefix": filename_prefix
            }
        }
    }


# ─── ComfyUI API client ─────────────────────────────────────────────────────

def queue_prompt(server: str, workflow: dict) -> dict:
    """Send a workflow to ComfyUI's /prompt endpoint."""
    payload = json.dumps({"prompt": workflow}).encode("utf-8")
    req = urllib.request.Request(
        f"{server}/prompt",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.URLError as e:
        print(f"  ERROR: Could not connect to ComfyUI at {server}")
        print(f"  Make sure ComfyUI is running: python main.py --listen")
        print(f"  Details: {e}")
        sys.exit(1)


def check_server(server: str) -> bool:
    """Check if ComfyUI server is reachable."""
    try:
        req = urllib.request.Request(f"{server}/system_stats")
        with urllib.request.urlopen(req, timeout=5) as resp:
            return resp.status == 200
    except Exception:
        return False


# ─── Main ────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Queue 6 character sheet angle views to ComfyUI"
    )
    parser.add_argument(
        "reference_image",
        help="Filename of reference image (must be in ComfyUI/input/ folder)"
    )
    parser.add_argument(
        "--server", default=COMFYUI_SERVER,
        help=f"ComfyUI server URL (default: {COMFYUI_SERVER})"
    )
    parser.add_argument(
        "--character", default=(
            "French Bulldog, stocky compact muscular build, "
            "black coat with tan rust markings on legs chest and underbelly, "
            "large bat ears, short snub nose, wide square jaw, "
            "dark round expressive eyes, short bowed legs, "
            "barrel chest, stub tail"
        ),
        help="Character description (default: French Bulldog with tan markings)"
    )
    parser.add_argument(
        "--ip-weight", type=float, default=IPADAPTER_WEIGHT,
        help=f"IP-Adapter weight 0.0-1.0 (default: {IPADAPTER_WEIGHT})"
    )
    parser.add_argument(
        "--lora-strength", type=float, default=LORA_STRENGTH,
        help=f"Afro_Samurai LoRA strength 0.0-1.0 (default: {LORA_STRENGTH})"
    )
    parser.add_argument(
        "--seed", type=int, default=None,
        help="Fixed seed (default: random per view)"
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Print prompts without queuing"
    )
    parser.add_argument(
        "--views", nargs="+",
        choices=["front", "back", "left-side", "right-side",
                 "three-quarter-front", "three-quarter-back"],
        default=None,
        help="Generate only specific views (default: all 6)"
    )
    args = parser.parse_args()

    # Override globals if CLI args provided
    global IPADAPTER_WEIGHT, LORA_STRENGTH
    IPADAPTER_WEIGHT = args.ip_weight
    LORA_STRENGTH = args.lora_strength

    angles = get_angles(args.character)

    # Filter views if specified
    if args.views:
        angles = [a for a in angles if a["name"] in args.views]

    print("=" * 60)
    print("  CHARACTER SHEET GENERATOR - Boondocks Cel-Shaded Style")
    print("=" * 60)
    print(f"  Reference Image: {args.reference_image}")
    print(f"  Server:          {args.server}")
    print(f"  IP-Adapter:      {IPADAPTER_WEIGHT}")
    print(f"  LoRA Strength:   {LORA_STRENGTH}")
    print(f"  Views:           {len(angles)}")
    print(f"  Output Size:     {OUTPUT_SIZE}px (long edge)")
    print("=" * 60)

    if args.dry_run:
        print("\n  DRY RUN - Prompts only:\n")
        for angle in angles:
            print(f"  [{angle['name']}]")
            print(f"  {angle['prompt'][:120]}...")
            print(f"  Save: {angle['filename_prefix']}")
            print()
        return

    # Check server connectivity
    print("\n  Checking ComfyUI server...")
    if not check_server(args.server):
        print(f"  ERROR: Cannot reach ComfyUI at {args.server}")
        print(f"  Start it with: cd comfyUI && python main.py --listen")
        sys.exit(1)
    print("  Server is running.\n")

    # Queue each angle view
    import random
    for i, angle in enumerate(angles, 1):
        seed = args.seed if args.seed is not None else random.randint(0, 2**53)
        workflow = build_api_workflow(
            reference_image=args.reference_image,
            positive_prompt=angle["prompt"],
            filename_prefix=angle["filename_prefix"],
            seed=seed
        )

        print(f"  [{i}/{len(angles)}] Queuing: {angle['name']} (seed: {seed})")
        result = queue_prompt(args.server, workflow)
        prompt_id = result.get("prompt_id", "unknown")
        print(f"          Queued -> prompt_id: {prompt_id}")

        # Small delay between queues to avoid flooding
        if i < len(angles):
            time.sleep(0.5)

    print(f"\n  All {len(angles)} views queued successfully!")
    print(f"  Output: ComfyUI/output/bowtie-bullies/char-sheet/")
    print(f"\n  Monitor progress in the ComfyUI web UI at {args.server}")


if __name__ == "__main__":
    main()
