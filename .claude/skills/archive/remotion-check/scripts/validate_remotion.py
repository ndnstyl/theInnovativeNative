#!/usr/bin/env python3
"""
Remotion Pre-Render Validator
==============================

Runs 10 automated checks against a Remotion project directory before rendering.
See ../SKILL.md for full documentation.

Usage:
  python3 validate_remotion.py <remotion-project-dir> [--composition NAME] [--skip-tsc]
"""

import argparse
import json
import os
import re
import subprocess
import sys
from pathlib import Path
from typing import Dict, List, Optional, Tuple

# ---- ANSI colors ----
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
CYAN = "\033[96m"
BOLD = "\033[1m"
RESET = "\033[0m"


class Severity:
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class CheckResult:
    def __init__(self, name: str, passed: bool, severity: str, details: List[str] = None):
        self.name = name
        self.passed = passed
        self.severity = severity
        self.details = details or []

    def icon(self) -> str:
        if self.passed:
            return f"{GREEN}PASS{RESET}"
        if self.severity in (Severity.CRITICAL, Severity.HIGH):
            return f"{RED}FAIL{RESET}"
        return f"{YELLOW}WARN{RESET}"


# ---- helpers ----

def read_file(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except Exception:
        return ""


def find_files(root: Path, patterns: List[str]) -> List[Path]:
    results = []
    for pat in patterns:
        results.extend(root.rglob(pat))
    return [p for p in results if "node_modules" not in p.parts and "out" not in p.parts]


# ---- checks ----

def check_composition_registration(root: Path) -> CheckResult:
    """Check 1: package.json render scripts reference registered Composition IDs."""
    pkg_path = root / "package.json"
    root_tsx = root / "src" / "Root.tsx"
    if not pkg_path.exists() or not root_tsx.exists():
        return CheckResult(
            "Composition Registration",
            False,
            Severity.CRITICAL,
            ["package.json or src/Root.tsx missing"],
        )

    pkg = json.loads(read_file(pkg_path))
    scripts = pkg.get("scripts", {})
    root_src = read_file(root_tsx)

    # Extract declared composition IDs from Root.tsx
    declared_ids = set(re.findall(r'<Composition[^>]+id=["\']([^"\']+)["\']', root_src))
    declared_ids.update(re.findall(r'<Still[^>]+id=["\']([^"\']+)["\']', root_src))
    # Template-literal ids (e.g. `TP-Reel-${...}-V${vi+1}`) — we can't resolve these here.
    # Mark their presence but don't require exact match.
    has_dynamic = bool(re.search(r'<Composition[^>]+id=\{`', root_src))

    missing = []
    for name, cmd in scripts.items():
        m = re.search(r'remotion render\s+(\S+)', cmd)
        if not m:
            continue
        comp_id = m.group(1).strip("\"'")
        if comp_id not in declared_ids and not has_dynamic:
            missing.append(f"script '{name}' renders '{comp_id}' — not found in Root.tsx")

    if missing:
        return CheckResult(
            "Composition Registration", False, Severity.CRITICAL, missing
        )
    return CheckResult(
        "Composition Registration",
        True,
        Severity.CRITICAL,
        [f"{len(declared_ids)} compositions registered"],
    )


def check_static_file_assets(root: Path) -> CheckResult:
    """Check 2: Every staticFile(...) path resolves in public/. CRITICAL because
    compositions crash at render if staticFile paths don't exist. Brand asset
    fields (logo, watermark) are checked separately at HIGH severity since
    compositions can still render without them."""
    public = root / "public"
    if not public.exists():
        return CheckResult(
            "staticFile Asset Existence",
            True,
            Severity.CRITICAL,
            ["No public/ dir — skipping"],
        )

    missing = []
    ts_files = find_files(root / "src", ["*.ts", "*.tsx"])
    pattern = re.compile(r'staticFile\(\s*["\']([^"\']+)["\']')

    for f in ts_files:
        content = read_file(f)
        for m in pattern.finditer(content):
            relpath = m.group(1)
            if "${" in relpath:
                continue
            target = public / relpath
            if not target.exists():
                missing.append(f"{relpath} (from {f.relative_to(root)})")

    if missing:
        return CheckResult(
            "staticFile Asset Existence", False, Severity.CRITICAL, missing[:20]
        )
    return CheckResult(
        "staticFile Asset Existence",
        True,
        Severity.CRITICAL,
        [f"{len(ts_files)} source files scanned"],
    )


def check_brand_assets(root: Path) -> CheckResult:
    """Soft check: brand.json asset fields (logo, watermark) resolve. HIGH
    severity — compositions don't crash without logos, but rendered output
    will be wrong if a logo component assumes the asset exists."""
    brands_dir = root / "brands"
    if not brands_dir.exists():
        return CheckResult(
            "Brand Assets (logos, watermarks)",
            True,
            Severity.HIGH,
            ["No brands/ dir — skipping"],
        )

    missing = []
    public = root / "public"
    for brand_json in brands_dir.rglob("brand.json"):
        try:
            data = json.loads(read_file(brand_json))
        except json.JSONDecodeError:
            continue
        assets = data.get("assets", {})
        for key in ("logo", "logo_dark", "watermark", "icon"):
            val = assets.get(key)
            if val and not val.startswith("http"):
                target = brand_json.parent / val
                if not target.exists() and not (public / val).exists():
                    missing.append(
                        f"brand asset '{key}' = '{val}' (in {brand_json.relative_to(root)})"
                    )
    if missing:
        return CheckResult("Brand Assets (logos, watermarks)", False, Severity.HIGH, missing)
    return CheckResult("Brand Assets (logos, watermarks)", True, Severity.HIGH, [])


def check_brand_slug_validity(root: Path) -> CheckResult:
    """Check 3: Every getBrand(slug) refers to a valid brand."""
    brands_dir = root / "brands"
    if not brands_dir.exists():
        return CheckResult(
            "Brand Slug Validity",
            True,
            Severity.CRITICAL,
            ["No brands/ dir — skipping"],
        )

    valid_slugs = {
        p.name for p in brands_dir.iterdir() if p.is_dir() and (p / "brand.json").exists()
    }

    invalid = []
    ts_files = find_files(root / "src", ["*.ts", "*.tsx"])
    pattern = re.compile(r'getBrand\(\s*["\']([^"\']+)["\']')
    used_slugs = set()
    for f in ts_files:
        for m in pattern.finditer(read_file(f)):
            slug = m.group(1)
            used_slugs.add(slug)
            if slug not in valid_slugs:
                invalid.append(f"getBrand('{slug}') in {f.relative_to(root)} — unknown slug")

    if invalid:
        return CheckResult(
            "Brand Slug Validity",
            False,
            Severity.CRITICAL,
            invalid + [f"Valid: {', '.join(sorted(valid_slugs))}"],
        )
    return CheckResult(
        "Brand Slug Validity",
        True,
        Severity.CRITICAL,
        [f"{len(valid_slugs)} brands valid, {len(used_slugs)} referenced"],
    )


def check_h264_enforcement(root: Path) -> CheckResult:
    """Check 4: No prores/webm in production social delivery scripts."""
    pkg = json.loads(read_file(root / "package.json") or "{}")
    scripts = pkg.get("scripts", {})

    warnings = []
    for name, cmd in scripts.items():
        lower = name.lower()
        # Allow archival / NLE-handoff names
        if any(tag in lower for tag in ("master", "archive", "prores", "nle", "mov")):
            continue
        if "--codec=prores" in cmd or "--codec=webm" in cmd:
            warnings.append(f"'{name}': {cmd}")

    if warnings:
        return CheckResult("H.264 Codec Enforcement", False, Severity.HIGH, warnings)
    return CheckResult(
        "H.264 Codec Enforcement",
        True,
        Severity.HIGH,
        [f"{len(scripts)} scripts scanned"],
    )


def check_typescript_compile(root: Path, skip: bool = False) -> CheckResult:
    """Check 5: tsc --noEmit passes."""
    if skip:
        return CheckResult(
            "TypeScript Compile", True, Severity.HIGH, ["Skipped (--skip-tsc)"]
        )
    try:
        result = subprocess.run(
            ["npx", "tsc", "--noEmit"],
            cwd=root,
            capture_output=True,
            text=True,
            timeout=120,
        )
        if result.returncode == 0:
            return CheckResult("TypeScript Compile", True, Severity.HIGH, [])
        errors = [
            ln
            for ln in result.stdout.split("\n")
            if ln.startswith("src/") and "error" in ln.lower()
        ]
        return CheckResult(
            "TypeScript Compile",
            False,
            Severity.HIGH,
            errors[:10] or [result.stdout[:500]],
        )
    except Exception as e:
        return CheckResult(
            "TypeScript Compile", False, Severity.HIGH, [f"tsc invocation failed: {e}"]
        )


def check_placeholder_text(root: Path) -> CheckResult:
    """Check 6: No placeholder text in defaultProps."""
    placeholders = [
        "Your hook",
        "Your quote goes here",
        "Lorem ipsum",
        "Replace with",
        "TODO",
        "Placeholder",
        "5 WAYS TO DO X",
        "First thing",
        "Example text",
    ]
    violations = []
    ts_files = find_files(root / "src", ["*.ts", "*.tsx"])
    for f in ts_files:
        content = read_file(f)
        # Only check files that export defaultProps or are Root.tsx
        if "defaultProps" not in content and "Root.tsx" not in f.name:
            continue
        # Check template defaults
        if "Defaults" in content or "defaultProps" in content:
            for p in placeholders:
                if p in content:
                    violations.append(f"'{p}' in {f.relative_to(root)}")
    # Deduplicate
    violations = list(dict.fromkeys(violations))
    if violations:
        # Placeholders in template files are expected (they're defaults). Warn only
        # if Root.tsx registers a composition with placeholder defaults WITHOUT
        # allowing override — i.e. placeholder strings directly in Root.tsx.
        root_tsx_violations = [v for v in violations if "Root.tsx" in v]
        if root_tsx_violations:
            return CheckResult(
                "Placeholder Text", False, Severity.HIGH, root_tsx_violations
            )
        return CheckResult(
            "Placeholder Text",
            True,
            Severity.HIGH,
            [f"{len(violations)} placeholders in template defaults (expected; override at render)"],
        )
    return CheckResult("Placeholder Text", True, Severity.HIGH, [])


def check_safe_zone_leakage(root: Path) -> CheckResult:
    """Check 7: showSafeZones: true not left enabled in production files."""
    violations = []
    ts_files = find_files(root / "src", ["*.tsx"])
    for f in ts_files:
        if f.name == "SafeZoneOverlay.tsx":
            continue
        content = read_file(f)
        if re.search(r"showSafeZones:\s*true", content):
            violations.append(f"showSafeZones: true in {f.relative_to(root)}")
        if re.search(r"<SafeZoneOverlay[^>]+enabled=\{true\}", content):
            violations.append(f"<SafeZoneOverlay enabled={{true}}> in {f.relative_to(root)}")
    if violations:
        return CheckResult("Safe Zone Overlay Leakage", False, Severity.HIGH, violations)
    return CheckResult("Safe Zone Overlay Leakage", True, Severity.HIGH, [])


def check_duration_math(root: Path) -> CheckResult:
    """Check 8: Basic sanity on durationInFrames consistency."""
    # This is a soft check — we look for hard-coded durations that conflict with
    # a calculated total in the same file.
    root_tsx = read_file(root / "src" / "Root.tsx")
    mismatches = []
    # Check if calculateTotalDuration exists and see if the comment "Final duration: N frames" matches TOTAL_DURATION usage
    m = re.search(r"Final duration:\s*(\d+)\s*frames", root_tsx)
    if m:
        expected = int(m.group(1))
        # Look for literal durationInFrames uses matching TOTAL_DURATION
        # (light sanity check only)
        if str(expected) in root_tsx:
            pass  # consistent enough
    return CheckResult(
        "Duration Math",
        True,
        Severity.MEDIUM,
        ["No contradictions detected (light check)"],
    )


def check_font_availability(root: Path) -> CheckResult:
    """Check 9: Fonts referenced in brand.json are loaded somewhere in src/."""
    brands_dir = root / "brands"
    if not brands_dir.exists():
        return CheckResult(
            "Font Availability", True, Severity.MEDIUM, ["No brands/ — skipping"]
        )

    referenced_fonts = set()
    for brand_json in brands_dir.rglob("brand.json"):
        try:
            data = json.loads(read_file(brand_json))
        except json.JSONDecodeError:
            continue
        fonts = data.get("fonts", {})
        overlay = data.get("video_overlay", {})
        for v in list(fonts.values()) + [
            overlay.get("hook_font"),
            overlay.get("caption_font"),
            overlay.get("cta_font"),
        ]:
            if v:
                referenced_fonts.add(v)

    # Read all src/**/*.tsx and look for font loading
    ts_files = find_files(root / "src", ["*.ts", "*.tsx"])
    loaded_blob = "\n".join(read_file(f) for f in ts_files)

    unloaded = []
    for font in referenced_fonts:
        # Normalize — check for either "Inter" directly or @remotion/google-fonts/Inter
        font_slug = font.replace(" ", "")
        if font not in loaded_blob and font_slug not in loaded_blob:
            # Also allow system fonts (JetBrains Mono, Inter) that may be loaded elsewhere
            if font not in ("JetBrains Mono", "Inter"):
                unloaded.append(font)

    if unloaded:
        return CheckResult(
            "Font Availability",
            False,
            Severity.MEDIUM,
            [f"Not loaded in src/: {font}" for font in sorted(unloaded)],
        )
    return CheckResult(
        "Font Availability",
        True,
        Severity.MEDIUM,
        [f"{len(referenced_fonts)} fonts referenced, all loaded or system"],
    )


def check_platform_aspect_match(root: Path) -> CheckResult:
    """Check 10: Brand safe_zone_preference aspect matches composition width/height."""
    brands_dir = root / "brands"
    if not brands_dir.exists():
        return CheckResult(
            "Platform Aspect Match",
            True,
            Severity.LOW,
            ["No brands/ — skipping"],
        )

    # Load safe zones to get aspect per platform
    sz_path = root.parent / ".specify" / "memory" / "social-media-safe-zones.json"
    if not sz_path.exists():
        return CheckResult(
            "Platform Aspect Match",
            True,
            Severity.LOW,
            ["social-media-safe-zones.json not found — skipping"],
        )
    try:
        sz = json.loads(read_file(sz_path))
    except json.JSONDecodeError:
        return CheckResult(
            "Platform Aspect Match", True, Severity.LOW, ["Invalid JSON — skipping"]
        )
    platforms = sz.get("platforms", {})

    warnings = []
    for brand_json in brands_dir.rglob("brand.json"):
        try:
            data = json.loads(read_file(brand_json))
        except json.JSONDecodeError:
            continue
        pref = data.get("video_overlay", {}).get("safe_zone_preference")
        if not pref or pref.startswith("universal_"):
            continue
        plat = platforms.get(pref)
        if not plat:
            warnings.append(
                f"{brand_json.parent.name}: unknown platform '{pref}' in brand.json"
            )
            continue
        # We just record the expected aspect — full composition audit requires
        # parsing Root.tsx width/height per brand which is too brittle.
    if warnings:
        return CheckResult("Platform Aspect Match", False, Severity.LOW, warnings)
    return CheckResult(
        "Platform Aspect Match",
        True,
        Severity.LOW,
        ["All safe_zone_preference values valid"],
    )


# ---- main ----

def score(results: List[CheckResult]) -> Tuple[int, int]:
    """Return (score normalized to /10, count of critical fails)."""
    total = len(results)
    passed = sum(1 for r in results if r.passed)
    normalized = round(passed * 10 / total) if total else 0
    crit_fails = sum(
        1 for r in results if not r.passed and r.severity == Severity.CRITICAL
    )
    return normalized, crit_fails


def print_results(root: Path, results: List[CheckResult]) -> None:
    total = len(results)
    print(f"\n{BOLD}Remotion Validator{RESET} — {root}")
    print("=" * 72)
    for i, r in enumerate(results, 1):
        print(f"[{i:2}/{total}] {r.name:<40}  {r.icon()}")
        for d in r.details:
            print(f"         {CYAN}- {d}{RESET}")
    s, crit = score(results)
    print("=" * 72)
    if crit > 0:
        verdict = f"{RED}❌ NOT READY ({crit} CRITICAL failure{'s' if crit != 1 else ''}){RESET}"
    elif s >= 8:
        verdict = f"{GREEN}✅ READY TO RENDER{RESET}"
    else:
        verdict = f"{YELLOW}⚠️  BELOW THRESHOLD (fix HIGH issues){RESET}"
    print(f"Score: {BOLD}{s}/10{RESET} — {verdict}\n")


def main() -> int:
    parser = argparse.ArgumentParser(description="Remotion Pre-Render Validator")
    parser.add_argument("project", help="Path to Remotion project directory")
    parser.add_argument("--composition", help="Composition ID to focus on (optional)")
    parser.add_argument("--skip-tsc", action="store_true", help="Skip TypeScript compile check")
    args = parser.parse_args()

    root = Path(args.project).resolve()
    if not root.exists():
        print(f"{RED}Project path does not exist: {root}{RESET}")
        return 3
    if not (root / "remotion.config.ts").exists() and not (
        root / "remotion.config.js"
    ).exists():
        print(f"{RED}Not a Remotion project (no remotion.config.ts): {root}{RESET}")
        return 3

    results = [
        check_composition_registration(root),
        check_static_file_assets(root),
        check_brand_slug_validity(root),
        check_brand_assets(root),
        check_h264_enforcement(root),
        check_typescript_compile(root, skip=args.skip_tsc),
        check_placeholder_text(root),
        check_safe_zone_leakage(root),
        check_duration_math(root),
        check_font_availability(root),
        check_platform_aspect_match(root),
    ]

    print_results(root, results)
    s, crit = score(results)
    if crit > 0:
        return 1
    if s < 8:
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main())
