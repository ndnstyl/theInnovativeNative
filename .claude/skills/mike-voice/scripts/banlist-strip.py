#!/usr/bin/env python3
"""
banlist-strip.py — Deterministic regex pass that strips/replaces LLM tells.

Reads draft from argv[1] (file) or stdin. Writes cleaned text to stdout.
Writes a JSON report of changes to stderr (one object per replacement).

Loads patterns from ../banlist.json. ZERO_TOLERANCE and SOFT_REPLACE patterns
get auto-applied. FLAG patterns are noted in the report but NOT auto-modified
(those require LLM judgment in the humanize voice transfer step).
"""

import json
import re
import sys
import os
from pathlib import Path

SKILL_DIR = Path(__file__).resolve().parent.parent
BANLIST_PATH = SKILL_DIR / "banlist.json"


def load_banlist():
    with open(BANLIST_PATH, "r") as f:
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


def em_dash_replace(text):
    # Replace ` — ` / `—` / ` -- ` etc.
    # Heuristic: if surrounded by spaces and at clause boundary, use period; else comma.
    # Simple safe default: replace with ". " when capital follows, else ", "
    def repl(m):
        before = text[max(0, m.start()-1):m.start()]
        after = text[m.end():m.end()+2]
        # If next non-space char is capital → period
        nxt = after.strip()
        if nxt and nxt[0].isupper():
            return ". "
        return ", "
    # Order matters — long forms first
    patterns = [
        r" *—+ *",
        r" *–+ *",
        r" *&mdash; *",
        r" *&ndash; *",
        r" -- ",
    ]
    changes = 0
    for p in patterns:
        new_text, n = re.subn(p, repl, text)
        text = new_text
        changes += n
    return text, changes


def apply_banlist(text, banlist):
    report = []
    total_changes = 0

    # Em dashes (special handling for context-aware replacement)
    text, n = em_dash_replace(text)
    if n:
        report.append({"pattern": "em_dashes", "severity": "ZERO_TOLERANCE", "replacements": n})
        total_changes += n

    for name, rule in banlist.get("patterns", {}).items():
        if name == "em_dashes":
            continue  # handled above
        severity = rule.get("severity", "FLAG")
        regex = rule.get("regex", "")
        if not regex:
            continue

        if severity in ("ZERO_TOLERANCE", "SOFT_REPLACE"):
            # For ZERO_TOLERANCE: strip the matched phrase + optional surrounding space
            # For SOFT_REPLACE: same, but flagged differently in report
            # We don't have a clean replacement string, so we cut the offending phrase
            # and let voice-transfer LLM pass smooth the seams.
            # Special cases: some need word replacement instead of cut.
            new_text, n = strip_or_replace(text, name, regex)
            if n:
                report.append({"pattern": name, "severity": severity, "replacements": n})
                total_changes += n
                text = new_text
        elif severity == "FLAG":
            # Count matches but don't modify
            matches = re.findall(regex, text)
            if matches:
                report.append({"pattern": name, "severity": "FLAG", "matches": len(matches), "samples": matches[:3]})

    # Output report to stderr as JSON
    sys.stderr.write(json.dumps({"total_changes": total_changes, "patterns": report}, indent=2) + "\n")
    return text


# Word-level replacements for SOFT_REPLACE patterns. These have a clean swap.
WORD_REPLACEMENTS = {
    "leverage_as_verb": [(re.compile(r"\bleverage\b", re.IGNORECASE), "use"),
                         (re.compile(r"\bleveraging\b", re.IGNORECASE), "using"),
                         (re.compile(r"\bleveraged\b", re.IGNORECASE), "used")],
    "utilize": [(re.compile(r"\butili[sz]e\b", re.IGNORECASE), "use"),
                (re.compile(r"\butili[sz]es\b", re.IGNORECASE), "uses"),
                (re.compile(r"\butili[sz]ed\b", re.IGNORECASE), "used"),
                (re.compile(r"\butili[sz]ing\b", re.IGNORECASE), "using")],
    "delve": [(re.compile(r"\bdelve into\b", re.IGNORECASE), "dig into"),
              (re.compile(r"\bdelve\b", re.IGNORECASE), "dig into"),
              (re.compile(r"\bdelving into\b", re.IGNORECASE), "digging into"),
              (re.compile(r"\bdelving\b", re.IGNORECASE), "digging into")],
    "seamlessly": [(re.compile(r"\bseamlessly\b", re.IGNORECASE), "")],
    "synergy": [(re.compile(r"\bsynerg(y|ies|istic)\b", re.IGNORECASE), "")],
    "moreover": [(re.compile(r"\bMoreover,?\s*", re.IGNORECASE), "")],
    "in_conclusion": [(re.compile(r"\b(In conclusion|In summary|To summarize|To wrap up),?\s*", re.IGNORECASE), "")],
    "as_an_ai": [(re.compile(r"\bas an? (ai|large language model|assistant)\s*,?\s*", re.IGNORECASE), "")],
    "in_today_fast_paced_world": [(re.compile(r"in (today'?s|this) (fast.?paced|modern|digital|rapidly evolving) (world|landscape|era|environment)\s*,?\s*", re.IGNORECASE), "")],
    "navigate_the_landscape": [(re.compile(r"\bnavigate (the|this|today'?s) (landscape|terrain|complexity|environment)", re.IGNORECASE), "work in")],
    "unleash_potential": [(re.compile(r"\bunleash (the|your|its) (potential|power)", re.IGNORECASE), "use"),
                          (re.compile(r"\bunleash\b", re.IGNORECASE), "use")],
    "harness_the_power": [(re.compile(r"\bharness (the|its) (power|potential)\s*(of\s*)?", re.IGNORECASE), "use ")],
    "robust": [(re.compile(r"\brobust\b", re.IGNORECASE), "")],
}


def strip_or_replace(text, pattern_name, regex):
    """Apply word-level replacement if defined, else strip the pattern."""
    if pattern_name in WORD_REPLACEMENTS:
        total = 0
        for pat, repl in WORD_REPLACEMENTS[pattern_name]:
            new_text, n = pat.subn(repl, text)
            text = new_text
            total += n
        # Clean up double spaces left by removals
        text = re.sub(r" {2,}", " ", text)
        text = re.sub(r" +([.,;:!?])", r"\1", text)
        return text, total
    else:
        # Generic: just count for reporting, don't modify (flag instead)
        matches = re.findall(regex, text, re.IGNORECASE)
        return text, len(matches)


def main():
    banlist = load_banlist()
    text = read_input()
    cleaned = apply_banlist(text, banlist)
    sys.stdout.write(cleaned)


if __name__ == "__main__":
    main()
