#!/usr/bin/env python3
"""
fingerprint.py — Voice fingerprint scorer.

Computes deterministic metrics on a piece of text and scores how closely it matches
Mike's voice baseline. Outputs JSON to stdout.

Metrics:
  - analogy_count + car_analogy_count + car_ratio (target: car_ratio >= 0.9)
  - sentence_avg_words (Mike baseline: 14-22)
  - banlist_hits (target: 0)
  - em_dash_count (target: 0)
  - shibboleth_density (per 1000 words, target: 0.02-0.08)

Skips LLM voice-match scoring by default (deterministic-only). For full LLM
scoring, the humanize.sh orchestrator handles that separately.

Usage:
  python3 fingerprint.py <file>
  cat draft.md | python3 fingerprint.py
"""

import json
import re
import sys
import os
from pathlib import Path

SKILL_DIR = Path(__file__).resolve().parent.parent
BANLIST_PATH = SKILL_DIR / "banlist.json"
SHIBBOLETHS_PATH = SKILL_DIR / "shibboleths.json"

# Car-domain vocabulary for analogy detection
CAR_VOCAB = {
    # Mechanical
    "engine", "engines", "chassis", "frame", "drivetrain", "transmission",
    "suspension", "brake", "brakes", "tire", "tires", "wheel", "wheels",
    "axle", "differential", "clutch", "gearbox", "exhaust", "muffler",
    "turbo", "supercharger", "intercooler", "radiator",
    # Electrical
    "ecu", "pcm", "tcm", "bcm", "wiring", "harness", "sensor", "sensors",
    "dashboard", "gauge", "gauges", "obd", "obd-ii", "alternator",
    # Fuel/charging
    "fuel", "gasoline", "octane", "diesel", "battery", "charging",
    # Software
    "tune", "remap", "chip", "piggyback", "spark plug", "spark plugs",
    "air filter", "ignition", "timing",
    # Maintenance
    "oil change", "coolant", "brake fluid", "tire rotation", "timing belt",
    # Vehicle types
    "race car", "racecar", "drift", "off-road", "overland", "ev", "truck",
    "civic", "corolla", "wrangler", "bronco", "land cruiser", "tesla",
    "rivian", "f-150", "silverado", "s-class", "7-series", "ferrari",
    "lamborghini", "porsche", "bmw", "mercedes", "honda", "ford",
    "toyota", "chevy", "ae86", "gr86", "silvia", "rx7", "240sx",
    # Build philosophy
    "restomod", "stock build", "mild build", "full build", "garage queen",
    "daily driver", "show car", "naturally aspirated", "forced induction",
    # Garage/track
    "garage", "pit crew", "track", "autocross", "drag strip", "rally",
    "racing", "racetrack", "pit stop",
}

# Analogy markers (heuristic — phrases that signal a comparison is being made)
ANALOGY_MARKERS = [
    r"\blike a\b", r"\blike an\b", r"\blike the\b",
    r"\bis a kind of\b", r"\bis basically\b", r"\bis essentially\b",
    r"\bthink of it as\b", r"\bthink of\b.{1,30}\bas\b",
    r"\bit'?s like\b", r"\bit'?s the equivalent of\b",
    r"\bsame as\b", r"\bsimilar to\b",
    r"\bthe \w+ of\b.{1,40}\bis the\b",  # "the X of Y is the Z of W" comparison
    r"\bimagine\b",
    r"\bpicture a\b", r"\bpicture an\b",
    r"\bcompare it to\b",
]


def load_banlist():
    with open(BANLIST_PATH, "r") as f:
        return json.load(f)


def load_shibboleths():
    with open(SHIBBOLETHS_PATH, "r") as f:
        return json.load(f)


def read_input():
    if len(sys.argv) > 1 and sys.argv[1] != "-":
        path = sys.argv[1]
        if not os.path.exists(path):
            sys.stderr.write(f"ERROR: file not found: {path}\n")
            sys.exit(2)
        with open(path, "r") as f:
            return f.read()
    return sys.stdin.read()


def word_count(text):
    return len(re.findall(r"\b\w+\b", text))


def sentence_avg(text):
    # Split on sentence terminators
    sentences = re.split(r"[.!?]+\s+|[.!?]+$", text)
    sentences = [s.strip() for s in sentences if s.strip()]
    if not sentences:
        return 0.0
    word_counts = [word_count(s) for s in sentences]
    return sum(word_counts) / len(word_counts)


def count_em_dashes(text):
    return len(re.findall(r"[—–]|&mdash;|&ndash;| -- ", text))


def find_analogies(text):
    """Return list of analogy contexts (50-char window around each marker match)."""
    contexts = []
    for marker in ANALOGY_MARKERS:
        for m in re.finditer(marker, text, re.IGNORECASE):
            start = max(0, m.start() - 30)
            end = min(len(text), m.end() + 80)
            contexts.append(text[start:end])
    return contexts


def is_car_analogy(context):
    """Check if an analogy context contains car vocabulary."""
    lower = context.lower()
    for term in CAR_VOCAB:
        # Use word boundary for single words, substring for multi-word terms
        if " " in term or "-" in term:
            if term in lower:
                return True
        else:
            if re.search(r"\b" + re.escape(term) + r"\b", lower):
                return True
    return False


def count_banlist_hits(text, banlist):
    total = 0
    hits = {}
    for name, rule in banlist.get("patterns", {}).items():
        regex = rule.get("regex", "")
        if not regex:
            continue
        try:
            n = len(re.findall(regex, text, re.IGNORECASE))
        except re.error:
            n = 0
        if n:
            hits[name] = n
            total += n
    return total, hits


def count_shibboleths(text, shibboleths):
    """Count shibboleth-pattern occurrences. Signature phrases (substring match) and verdict lines (substring)."""
    total = 0
    hits = {}
    # Signature phrases — substring match
    for phrase in shibboleths.get("signature_phrases", {}).get("patterns", []):
        if phrase.lower() in text.lower():
            hits[f"sig:{phrase[:40]}"] = 1
            total += 1
    # Verdict lines — substring match
    for phrase in shibboleths.get("verdict_lines", {}).get("patterns", []):
        if phrase.lower() in text.lower():
            hits[f"verdict:{phrase[:40]}"] = 1
            total += 1
    # Openers — substring match
    for phrase in shibboleths.get("openers", {}).get("patterns", []):
        # Skip templated ones with {X|Y} syntax
        if "{" in phrase:
            continue
        if phrase.lower() in text.lower():
            hits[f"opener:{phrase[:40]}"] = 1
            total += 1
    return total, hits


def score_overall(metrics):
    """Combine metrics into 0-1 overall score. Weights tunable."""
    car_ratio = metrics["car_ratio"]
    sentence_avg = metrics["sentence_avg_words"]
    em_dashes = metrics["em_dash_count"]
    banlist_hits = metrics["banlist_hits"]
    shibboleth_density = metrics["shibboleth_density_per_1000w"]

    # Car ratio — full points if >=0.9, partial below
    car_score = min(1.0, car_ratio / 0.9) if metrics["analogy_count"] > 0 else 0.7  # neutral if no analogies

    # Sentence avg — 1.0 if 14-22, drop linearly outside
    if 14 <= sentence_avg <= 22:
        sentence_score = 1.0
    elif sentence_avg < 14:
        sentence_score = max(0.0, sentence_avg / 14)
    else:
        sentence_score = max(0.0, 1.0 - (sentence_avg - 22) / 20)

    # Em dashes — ZERO tolerance. Even 1 = heavy penalty.
    em_score = 1.0 if em_dashes == 0 else max(0.0, 1.0 - em_dashes * 0.3)

    # Banlist — each hit = -0.1
    banlist_score = max(0.0, 1.0 - banlist_hits * 0.1)

    # Shibboleth density — target 0.02-0.08 per word (i.e., 20-80 per 1000)
    # Actually target is 2-8 per 1000 (more realistic). Adjust.
    target_min, target_max = 2, 8
    if target_min <= shibboleth_density <= target_max:
        shibboleth_score = 1.0
    elif shibboleth_density < target_min:
        shibboleth_score = shibboleth_density / target_min
    else:
        shibboleth_score = max(0.5, 1.0 - (shibboleth_density - target_max) / 20)

    # Weighted average. Em dashes + car ratio carry the most weight (cornerstone rules).
    weights = {
        "car": 0.30,
        "em": 0.20,
        "banlist": 0.15,
        "sentence": 0.15,
        "shibboleth": 0.20,
    }
    overall = (
        car_score * weights["car"] +
        em_score * weights["em"] +
        banlist_score * weights["banlist"] +
        sentence_score * weights["sentence"] +
        shibboleth_score * weights["shibboleth"]
    )
    return round(overall, 3), {
        "car_score": round(car_score, 3),
        "em_score": round(em_score, 3),
        "banlist_score": round(banlist_score, 3),
        "sentence_score": round(sentence_score, 3),
        "shibboleth_score": round(shibboleth_score, 3),
    }


def main():
    text = read_input()
    banlist = load_banlist()
    shibboleths = load_shibboleths()

    total_words = word_count(text)
    sentence_avg_w = sentence_avg(text)
    em_dashes = count_em_dashes(text)
    analogies = find_analogies(text)
    car_analogies = [c for c in analogies if is_car_analogy(c)]
    car_ratio = (len(car_analogies) / len(analogies)) if analogies else 0.0
    banlist_total, banlist_breakdown = count_banlist_hits(text, banlist)
    shibboleth_count, shibboleth_breakdown = count_shibboleths(text, shibboleths)
    shibboleth_density = (shibboleth_count / total_words * 1000) if total_words else 0.0

    metrics = {
        "total_words": total_words,
        "sentence_avg_words": round(sentence_avg_w, 1),
        "em_dash_count": em_dashes,
        "analogy_count": len(analogies),
        "car_analogy_count": len(car_analogies),
        "car_ratio": round(car_ratio, 3),
        "banlist_hits": banlist_total,
        "banlist_breakdown": banlist_breakdown,
        "shibboleth_count": shibboleth_count,
        "shibboleth_density_per_1000w": round(shibboleth_density, 2),
        "shibboleth_breakdown": shibboleth_breakdown,
    }

    overall, sub_scores = score_overall(metrics)
    verdict = "PASS" if overall >= 0.7 else "FAIL"

    flags = []
    if em_dashes > 0:
        flags.append(f"em_dashes={em_dashes} (ZERO TOLERANCE)")
    if banlist_total > 0:
        flags.append(f"banlist_hits={banlist_total}")
    if total_words > 300 and len(analogies) > 0 and car_ratio < 0.9:
        flags.append(f"car_ratio={car_ratio:.2f} (target >=0.9)")
    if total_words > 300 and len(analogies) == 0:
        flags.append("no analogies in long-form piece — Mike usually has at least one car analogy")
    if shibboleth_density < 2 and total_words > 300:
        flags.append(f"shibboleth_density={shibboleth_density:.2f}/1000w (target >=2)")

    out = {
        "score_overall": overall,
        "verdict": verdict,
        "sub_scores": sub_scores,
        "metrics": metrics,
        "flags": flags,
    }
    print(json.dumps(out, indent=2))


if __name__ == "__main__":
    main()
