---
name: resume-builder
description: Build, tailor, and verify resumes + cover letters against specific job descriptions. Three-phase workflow (extract master CV once → tailor per JD → verify against source). Anti-fabrication enforced via verb discipline + fact-check pass. Supports MD/DOCX/PDF/HTML outputs. Supersedes the older resume-tailor, resume-ats-optimizer, and tech-resume-optimizer skills.
triggers:
  - "tailor my resume"
  - "build a resume"
  - "update my resume"
  - "resume for"
  - "apply to this job"
  - "ats optimize"
  - "cover letter for"
  - "review my resume"
  - "/resume"
  - "/resume-builder"
---

# Resume Builder

## What this skill does
One unified resume + cover letter system, organized as three sequential phases:

1. **Extract** (one-time per user) — Build a verified master CV from real source material: prior resumes, code, deliverables, references, story bank. Structured Q&A surfaces hidden achievements. Stored as the single source of truth.
2. **Tailor** (per job application) — Analyze the JD, compute a transparent match score, and generate a tailored resume + cover letter from the master CV using the CAR framework. No claim appears in the output that isn't in the master.
3. **Verify** (before sending) — 5-persona critique, fact-check against master, ATS formatting validation, AI-fingerprint scan. Returns a before/after report and ships final files.

Skip phases at your own risk. Skipping Extract is the #1 reason resumes hallucinate; skipping Verify is the #1 reason they sound like AI.

## Why this exists (and what it replaces)
This skill supersedes three older internal skills (`resume-tailor`, `resume-ats-optimizer`, `tech-resume-optimizer`) and incorporates the strongest principles from 9 public Claude Code resume skills (see `references/sources.md` for attribution). The old skills are still on disk for reference but should be considered deprecated.

## When to use
- Applying to a specific role and need a tailored resume + cover letter
- First-time setup (no master CV yet)
- Existing resume feels stale or "AI-smelling"
- Need to verify a draft before submitting
- Building application packets in batch (3-5 roles at once)

## File layout convention

```
~/jobHunt/
├── master/
│   ├── master-cv.md              # the single source of truth (verified)
│   ├── story-bank.md             # CAR-formatted stories indexed by skill
│   ├── role-visibility.md        # which roles to show by default vs. variant-specific
│   └── verb-discipline.md        # personal allowed-verb list (extends shared)
├── applications/
│   └── <company>_<role>_<YYYY-MM-DD>/
│       ├── posting.md            # captured JD
│       ├── jd-analysis.md        # gap analysis + match score
│       ├── resume.md             # tailored markdown source
│       ├── resume.docx           # ATS-friendly export
│       ├── resume.pdf            # visual final
│       ├── cover-letter.html     # Mike's convention (HTML, not MD)
│       ├── critique.md           # 5-persona verification output
│       └── applied.md            # date submitted, ATS platform, follow-up dates
└── Resume/                       # legacy folder — read for context, write to applications/
```

Cover letters always end with a `file://` link to the rendered HTML so Mike can open them directly (per his existing convention).

## Phase 1: Extract — Master CV setup

Run this once per user. Skip if `~/jobHunt/master/master-cv.md` exists and is < 90 days old.

### Inputs to collect
1. Prior resumes (any format) → use as starting material, not gospel
2. Letters of recommendation → mine for third-party validated achievements
3. Brand voice file → if present, capture preferred phrasing/tone
4. Story bank → CAR-formatted stories if user maintains one
5. Recent projects / code / deliverables → for quantification

### Structured Q&A (run for each role on the resume)
For each role, ask these in conversation. Do NOT batch-ask; let answers branch new questions.

1. **Scope**: Team size, budget, scope of ownership. Were you IC, lead, manager?
2. **Top 3 outcomes**: What changed because you were there? Numbers required. If user can't quantify, push: "How would you tell your replacement what to maintain?"
3. **Hidden contributions**: Volunteer work, side projects, internal tools you built that weren't in your job description. Branching question: "What did you do that wasn't your job?"
4. **Failure → learning**: What went wrong and what you changed. (For senior roles only.)
5. **Provenance per claim**: For every metric, tag the source — `published`, `internal-only`, `self-reported`, `estimated`. See `references/verb-discipline.md`.

### Output
Write to `~/jobHunt/master/master-cv.md` with this structure per role:

```markdown
## <Role> — <Company> (<dates>)

**Scope**: <team size, budget, ownership>
**Tag**: `always` | `variant-tech` | `variant-exec` | `on-request` | `reference-only`

### CAR Stories
- **Challenge**: <one sentence>
  **Action**: <what YOU specifically did, not "we">
  **Result**: <quantified outcome>  `[provenance: published|internal|self|estimated]`

### Skills demonstrated (atomic, not phrases)
- <skill> — <evidence ref to CAR above>
```

The `tag` field controls visibility per JD type (see Phase 2). The `provenance` tag is load-bearing for the fact-check in Phase 3.

## Phase 2: Tailor — Per JD

### Step 2a: Capture the JD
Paste or fetch the posting. Save to `~/jobHunt/applications/<company>_<role>_<date>/posting.md`. Preserve the original text — do not summarize at this stage.

### Step 2b: JD analysis (write to `jd-analysis.md`)

```markdown
# JD Analysis — <role> @ <company>

## Required (must-have)
- <keyword/skill> — evidence in master CV: [yes ref / no]

## Nice-to-have
- <keyword/skill> — evidence: [yes / no / partial]

## Gaps (no evidence in master)
- <gap> — strategy: [omit / address in cover letter / acknowledge as growth area]

## Differentiators (master has, JD doesn't ask for, worth mentioning)
- <differentiator> — relevance: [high / medium / low]

## Match score (transparent formula)
```
score = 0.4 × (required_matched / required_total)
      + 0.2 × (nice_matched / nice_total)
      + 0.2 × quantification_rate_of_relevant_bullets
      + 0.1 × section_completeness
      + 0.1 × keyword_distribution_evenness
```
**Score**: __ / 1.00
**Target**: ≥ 0.75 before submitting. Below 0.60 → reconsider applying.

## Excluded Roles Report
Roles from master CV omitted from this tailored resume and WHY (visibility tag mismatch, age, relevance):
- <role>: <reason>
```

See `references/ats-scoring-formula.md` for full coefficient logic.

### Step 2c: Generate tailored resume

Pull only roles tagged `always` + variant-matching the JD type (tech / exec / career-change / etc.). Include `on-request` only if explicitly asked.

For each bullet, use the **CAR framework** (Challenge / Action / Result). See `references/car-framework.md` for templates by domain. One-line bullets for ATS; never wrap.

**Hard rules**:
- Every metric in the tailored resume MUST trace to the master CV. If not present, omit or flag.
- Action verbs must come from the approved list (`references/verb-discipline.md`). "Contributed to" ≠ "Developed."
- No em dashes anywhere (Mike's brand voice rule).
- No banned LLM phrases (see `references/banned-llm-phrases.md`). Run the 12-item scan after generation.
- Single-column, standard section headers, no tables/graphics/icons.

Output to `resume.md` (source) → `resume.docx` (via pandoc) → `resume.pdf` (via headless Chrome for visual fidelity OR pandoc for ATS-safe).

### Step 2d: Generate cover letter

Cover letters output as **HTML** (not Markdown) at `~/jobHunt/applications/<company>_<role>_<date>/cover-letter.html` per Mike's existing convention. Always end the response with a `file://` link.

Structure:
1. **Hook** — specific to company/role, not generic. If you could send the same letter to 50 companies, rewrite.
2. **Bridge** — one sentence connecting why YOU specifically map to THIS need (cite a CAR story).
3. **Proof** — 2-3 bullets pulled directly from the tailored resume, not re-invented.
4. **Forward** — one sentence on what you'd do in the first 30/60/90 days at that company.
5. **Close** — direct, no "I look forward to hearing from you" filler.

If there's a gap (career change, employment gap, overqualified, underqualified): address it honestly in 1-2 sentences. Do not hide.

## Phase 3: Verify — Before shipping

### Step 3a: Fact-check against master CV
For each metric, claim, and dated achievement in the tailored resume:
1. Search the master CV for a matching CAR story.
2. If not found → REMOVE the claim and flag in `critique.md`.
3. If found but provenance is `estimated` or `self-reported` → soften the verb ("Drove" → "Contributed to"). See verb-discipline.
4. 3-strike escalation: if 3+ claims fail fact-check in one resume, halt and ask user. Don't quietly delete.

### Step 3b: 5-persona critique (each in isolation — read ONLY the tailored resume + JD, not the master)

For each persona, write a short report in `critique.md`:
1. **ATS Bot** — does it parse cleanly? Missing keywords? Format issues?
2. **Recruiter (60-second skim)** — top 3 takeaways from first 10 seconds?
3. **Hiring Manager (domain expert)** — does the candidate clearly map to the role? Believable scope?
4. **Skeptic** — what claim is hardest to believe? What would you push back on in interview?
5. **Peer in target role** — does this sound like someone who already does this work?

If any persona flags a fatal issue → fix before submit.

### Step 3c: AI-fingerprint scan
Run the 12-item check from `references/banned-llm-phrases.md`. If 3+ hits → regenerate the affected sections. Common offenders: "leveraged," "spearheaded," "passionate," "results-driven," "synergize," em dashes, perfectly parallel bullet structure across all roles.

### Step 3d: Final formats
- `resume.md` — source of truth for this application
- `resume.docx` — submit this to ATS systems
- `resume.pdf` — submit when PDF requested OR for direct human review
- `cover-letter.html` — open in browser; copy/paste into application form OR convert to PDF if required

### Step 3e: Log to applied.md
```markdown
# Application Log

- **Company**: <name>
- **Role**: <title>
- **Posted**: <date>
- **Submitted**: <date>
- **ATS platform**: <Greenhouse / Workday / Lever / direct email / etc.>
- **Match score**: <0.XX>
- **Variant used**: <tech / exec / etc.>
- **Follow-up dates**: +7d, +14d
- **Notes**: <referral name, recruiter contact, anything noteworthy>
```

## Anti-patterns (NEVER)

1. **Don't fabricate metrics.** No number appears in the resume that isn't in the master CV with provenance.
2. **Don't auto-route.** User picks which phase to run (or runs the full pipeline explicitly). No silent guesses.
3. **Don't auto-replace industry jargon.** Hiring managers often expect domain terminology. Flag it, ask the user, don't auto-fix.
4. **Don't keyword-stuff.** Surgical placement only. Repeated keyword in 5 places = ATS penalty, not boost.
5. **Don't use em dashes** in any output (Mike's brand voice).
6. **Don't skip the cover letter `file://` link.** Mike's workflow depends on it.
7. **Don't submit a resume with match score < 0.60.** Recommend skipping the application instead.
8. **Don't write a generic cover letter.** If 90%+ of it could go to a different company, rewrite.

## Mike-specific defaults
- Master CV location: `~/jobHunt/master/master-cv.md`
- Application folder: `~/jobHunt/applications/<company>_<role>_<YYYY-MM-DD>/`
- Cover letter format: HTML, save to application folder AND legacy `~/jobHunt/cover_letters/` for backwards compat
- Brand voice: read `~/jobHunt/brandVoice.md` before any cover letter generation
- Story bank: check `~/jobHunt/spec/story-bank-manual.md` for pre-extracted CAR stories
- Letters of recommendation: `~/jobHunt/LOR/` — mine for third-party validation phrasing
- Active variant for Track A: AI Engineer (tech variant)

## Quick-start invocations

- `tailor my resume to <paste JD>` → runs Phase 2 + 3 (assumes master exists)
- `set up my master CV` → runs Phase 1 only
- `review this resume against this JD: <both>` → runs Phase 3 only on an existing draft
- `apply to this job: <JD or URL>` → runs Phases 2 + 3 + generates cover letter + writes applied.md

## Progressive disclosure
Detail files in `references/`:
- `sources.md` — attribution + which principle came from where
- `ats-scoring-formula.md` — full match-score derivation
- `car-framework.md` — CAR templates by domain (tech, exec, career-change, recent-grad)
- `verb-discipline.md` — approved action verbs by claim strength
- `banned-llm-phrases.md` — 12-item AI fingerprint checklist
- `regional-formats.md` — US (1pg), UK (2pg), AU/NZ (2-3pg + visa)
- `critique-personas.md` — full persona prompts for Phase 3b
- `master-cv-questions.md` — full Q&A branching tree for Phase 1
