#!/usr/bin/env python3
"""
check_models.py — BowTie Bullies ComfyUI Model Verification

Validates that all required models for the Boondocks-style cel-shaded
pipeline are installed in the ComfyUI model directories.

Required models (from boondocks-style-comfyui-spec.md):
- Base: Animagine XL 4.0 (SDXL anime checkpoint)
- Inpainting: stable-diffusion-xl-1.0-inpainting
- VAE: sdxl-vae-fp16-fix
- IP-Adapter: IP-Adapter Plus (SDXL)
- ControlNet: Canny SDXL

Usage:
  python scripts/check_models.py [--comfyui-path /path/to/ComfyUI]
"""

import os
import sys
import argparse
from pathlib import Path

# Default ComfyUI path (macOS)
DEFAULT_COMFYUI = os.path.expanduser("~/ComfyUI")

REQUIRED_MODELS = {
    "checkpoints": [
        {
            "name": "Animagine XL 4.0",
            "patterns": ["animagine-xl-4.0*", "animagineXL4*", "animagine*xl*4*"],
            "critical": True,
            "url": "https://huggingface.co/cagliostrolab/animagine-xl-4.0",
        },
        {
            "name": "SDXL Inpainting",
            "patterns": ["sd_xl*inpaint*", "stable-diffusion-xl*inpaint*"],
            "critical": True,
            "url": "https://huggingface.co/diffusers/stable-diffusion-xl-1.0-inpainting-0.1",
        },
    ],
    "vae": [
        {
            "name": "SDXL VAE FP16 Fix",
            "patterns": ["sdxl*vae*fp16*", "sdxl_vae*"],
            "critical": True,
            "url": "https://huggingface.co/madebyollin/sdxl-vae-fp16-fix",
        },
    ],
    "ipadapter": [
        {
            "name": "IP-Adapter Plus SDXL",
            "patterns": ["ip-adapter-plus_sdxl*", "ip_adapter_plus*sdxl*"],
            "critical": True,
            "url": "https://huggingface.co/h94/IP-Adapter",
        },
    ],
    "controlnet": [
        {
            "name": "ControlNet Canny SDXL",
            "patterns": ["control*canny*sdxl*", "diffusers*canny*sdxl*"],
            "critical": True,
            "url": "https://huggingface.co/diffusers/controlnet-canny-sdxl-1.0",
        },
    ],
    "clip_vision": [
        {
            "name": "CLIP Vision (for IP-Adapter)",
            "patterns": ["CLIP-ViT-H*", "clip_vision*", "clip-vit*"],
            "critical": True,
            "url": "https://huggingface.co/h94/IP-Adapter",
        },
    ],
}


def find_model(base_path: Path, subdir: str, patterns: list[str]) -> str | None:
    """Search for a model file matching any of the given patterns."""
    search_dir = base_path / "models" / subdir
    if not search_dir.exists():
        return None

    for pattern in patterns:
        matches = list(search_dir.glob(f"**/{pattern}"))
        if matches:
            return str(matches[0].relative_to(base_path))
    return None


def main():
    parser = argparse.ArgumentParser(description="Check ComfyUI models for BowTie pipeline")
    parser.add_argument("--comfyui-path", default=DEFAULT_COMFYUI, help="Path to ComfyUI installation")
    args = parser.parse_args()

    base = Path(args.comfyui_path)
    if not base.exists():
        print(f"ERROR: ComfyUI not found at {base}")
        print(f"  Use --comfyui-path to specify location")
        sys.exit(1)

    print(f"Checking models in: {base}")
    print("=" * 60)

    missing_critical = []
    missing_optional = []
    found = 0

    for subdir, models in REQUIRED_MODELS.items():
        print(f"\n[{subdir}]")
        for model in models:
            result = find_model(base, subdir, model["patterns"])
            if result:
                print(f"  OK  {model['name']}: {result}")
                found += 1
            else:
                marker = "CRITICAL" if model["critical"] else "optional"
                print(f"  MISSING ({marker})  {model['name']}")
                print(f"    Download: {model['url']}")
                if model["critical"]:
                    missing_critical.append(model["name"])
                else:
                    missing_optional.append(model["name"])

    print("\n" + "=" * 60)
    total = sum(len(models) for models in REQUIRED_MODELS.values())
    print(f"Found: {found}/{total}")

    if missing_critical:
        print(f"\nCRITICAL MISSING ({len(missing_critical)}):")
        for name in missing_critical:
            print(f"  - {name}")
        sys.exit(1)
    elif missing_optional:
        print(f"\nOptional missing ({len(missing_optional)}):")
        for name in missing_optional:
            print(f"  - {name}")
        print("\nAll critical models present. Pipeline can run.")
    else:
        print("\nAll models present. Pipeline ready.")


if __name__ == "__main__":
    main()
