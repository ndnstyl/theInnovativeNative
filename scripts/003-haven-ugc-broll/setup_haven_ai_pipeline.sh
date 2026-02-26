#!/usr/bin/env bash
# =============================================================================
# Haven AI Pipeline Setup — ComfyUI + Qwen3-TTS
# =============================================================================
# Sets up local AI content creation tools for A Slice of Haven:
#   1. ComfyUI with Python 3.12 venv + PyTorch MPS
#   2. Qwen3-TTS dependencies for voice generation
#
# Usage:
#   chmod +x scripts/003-haven-ugc-broll/setup_haven_ai_pipeline.sh
#   ./scripts/003-haven-ugc-broll/setup_haven_ai_pipeline.sh
# =============================================================================

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
COMFYUI_DIR="$REPO_ROOT/_comfyUI"
HAVEN_VOICE_DIR="$REPO_ROOT/projects/003-haven-ugc-broll/assets/canonical-voice"

echo "============================================="
echo "  Haven AI Pipeline Setup"
echo "============================================="
echo "Repo root: $REPO_ROOT"
echo ""

# -----------------------------------------------
# Phase 1: ComfyUI Installation
# -----------------------------------------------
echo "--- Phase 1: ComfyUI ---"

if [ -f "$COMFYUI_DIR/main.py" ]; then
    echo "✓ ComfyUI already cloned at $COMFYUI_DIR"
else
    echo "Cloning ComfyUI..."
    mkdir -p "$COMFYUI_DIR"
    git clone https://github.com/comfyanonymous/ComfyUI.git "$COMFYUI_DIR"
fi

# Check for Python 3.12
PYTHON_BIN=""
if command -v python3.12 &>/dev/null; then
    PYTHON_BIN="python3.12"
elif [ -x "/opt/homebrew/bin/python3.12" ]; then
    PYTHON_BIN="/opt/homebrew/bin/python3.12"
else
    echo "ERROR: Python 3.12 not found. Install with: brew install python@3.12"
    exit 1
fi
echo "Using Python: $PYTHON_BIN ($($PYTHON_BIN --version))"

# Create venv
if [ -d "$COMFYUI_DIR/venv" ]; then
    echo "✓ venv already exists"
else
    echo "Creating venv..."
    "$PYTHON_BIN" -m venv "$COMFYUI_DIR/venv"
fi

# Install PyTorch + ComfyUI deps
echo "Installing PyTorch + ComfyUI requirements..."
source "$COMFYUI_DIR/venv/bin/activate"
pip install --quiet --upgrade pip
pip install --quiet torch torchvision torchaudio
pip install --quiet -r "$COMFYUI_DIR/requirements.txt"

# Verify MPS
python -c "import torch; assert torch.backends.mps.is_available(), 'MPS not available!'; print('✓ MPS backend available')"

# Create model directories
mkdir -p "$COMFYUI_DIR/models/checkpoints"
mkdir -p "$COMFYUI_DIR/models/loras"
mkdir -p "$COMFYUI_DIR/models/vae"
mkdir -p "$COMFYUI_DIR/input"
mkdir -p "$COMFYUI_DIR/output"
echo "✓ Model directories created"

deactivate

# -----------------------------------------------
# Phase 2: Qwen3-TTS Dependencies
# -----------------------------------------------
echo ""
echo "--- Phase 2: Qwen3-TTS Dependencies ---"

# System deps
for pkg in portaudio ffmpeg sox; do
    if brew list "$pkg" &>/dev/null; then
        echo "✓ $pkg already installed"
    else
        echo "Installing $pkg..."
        brew install "$pkg"
    fi
done

# Python TTS deps (use ComfyUI venv for convenience)
source "$COMFYUI_DIR/venv/bin/activate"
pip install --quiet mlx-audio soundfile numpy
echo "✓ Qwen3-TTS Python deps installed"
deactivate

# Voice reference directory
mkdir -p "$HAVEN_VOICE_DIR"

# -----------------------------------------------
# Phase 3: Summary + Manual Steps
# -----------------------------------------------
echo ""
echo "============================================="
echo "  Setup Complete!"
echo "============================================="
echo ""
echo "--- Manual Steps Required ---"
echo ""
echo "1. Download models from CivitAI to $COMFYUI_DIR/models/:"
echo ""
echo "   CHECKPOINTS:"
echo "   • Z-Image-Turbo v1.0 (~6GB)"
echo "     → Save as: checkpoints/z-image-turbo_v1.safetensors"
echo ""
echo "   LORAS:"
echo "   • RealFeet for SDXL (~150MB)"
echo "     → Save as: loras/realfeet-sdxl.safetensors"
echo "   • Realistic Snapshot (Z-Image-Turbo) v5 (~180MB)"
echo "     → Save as: loras/realistic-snapshot-zit-v5.safetensors"
echo "   • Feet Pose (realistic) v1.0 (~120MB)"
echo "     → Save as: loras/feet-pose-realistic-v1.safetensors"
echo ""
echo "2. Record Haven voice reference (30-60s):"
echo "   → Save to: $HAVEN_VOICE_DIR/haven_warm_intro.mp3"
echo "   • Female, warm, approachable tone"
echo "   • 120-140 WPM speaking pace"
echo "   • Standard English (no dialect)"
echo ""
echo "--- Launch Commands ---"
echo ""
echo "  ComfyUI:"
echo "    cd $COMFYUI_DIR && source venv/bin/activate && python main.py"
echo "    → Opens at http://127.0.0.1:8188"
echo ""
echo "  Haven VO Preview:"
echo "    source $COMFYUI_DIR/venv/bin/activate"
echo "    python scripts/003-haven-ugc-broll/haven_qwen3_vo.py <script.json>"
echo ""
echo "  Load Workflow:"
echo "    In ComfyUI UI → Load → select:"
echo "    projects/003-haven-ugc-broll/workflows/comfyui/haven-feet-img2img-v1.json"
echo ""
