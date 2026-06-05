# Sources & Attribution

This skill consolidates principles from 12 sources (3 internal + 9 external public Claude Code resume skills). Each principle is tagged with its origin so you can dig deeper if needed.

## Internal (now superseded)
- `.claude/skills/career/resume-tailor/` — process + truth-vs-tailoring line
- `.claude/skills/career/resume-ats-optimizer/` — ATS formatting checklist + match scoring
- `.claude/skills/career/tech-resume-optimizer/` — technical bullet formula + GitHub optimization

## External (9 public repos, evaluated 2026-05)

| Repo | Distinctive contribution adopted |
|------|----------------------------------|
| varunr89/resume-tailoring-skill | Confidence-scored content selection; branching interview discovery; checkpoint architecture |
| Paramchoudhary/ResumeSkills | Master resume + variant management; domain-specific tracks |
| ARPeeketi/claude-resume-kit | `/setup-extract` master CV pattern; verb discipline + provenance; AI fingerprint avoidance; 5-persona critique |
| adamenger/claude-resume-builder | YAML theme injection; ATS parseability test; pa11y accessibility check |
| olegvg/resume-tailor-plugin | Transparent ATS scoring formula; role visibility tagging (always/variant/on-request); Excluded Roles Report; gap analysis structure |
| MadeByTokens/resume-helper | Adversarial multi-agent (lite version: 5-persona critique in isolation); 3-strike fact-check escalation |
| proficientlyjobs/proficiently-claude-skills | Stateful job folder pattern; applied.md audit trail |
| jezweb/claude-skills (resume-cover-letter) | CAR framework; regional format ruleset; anti-generic cover letter rule |
| m2ai-portfolio/claude-skills (Career suite) | Cross-platform bio adaptation (not adopted — out of scope) |

## Explicitly rejected
- **Automatic skill routing without explicit user choice** (m2ai-portfolio) — clarity > cleverness
- **Auto-replace corporate jargon** (resume-helper) — hiring managers expect domain terminology; flag don't fix
- **Adversarial multi-agent with file-based message passing** (resume-helper full version) — too slow; replaced with single-pass 5-persona critique reading the same file
- **Locale-specific RU/CIS formatting** (resume-tailor-plugin) — US/UK/AU covers Mike's actual market

## Cross-cutting patterns that appeared in 3+ repos (high signal)
1. Master source material vs. tailored outputs — always extract once, generate many
2. Anti-fabrication enforcement — provenance + verb discipline + fact-check pass
3. Structured JD analysis before tailoring — gap analysis is the unlock
4. Transparent scoring — never black-box the match number
5. Multi-output format support — MD source + DOCX (ATS) + PDF (visual)
