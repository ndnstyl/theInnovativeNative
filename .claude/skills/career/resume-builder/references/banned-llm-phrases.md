# AI Fingerprint Avoidance — 12-Item Scan

Adapted from ARPeeketi/claude-resume-kit. Run this scan on any AI-generated resume or cover letter BEFORE submitting. If 3+ items hit, regenerate the affected sections.

## The 12 items

### 1. Banned-phrase list (any hit = flag)
Phrases that scream LLM:
- "leveraged" / "leveraging"
- "spearheaded"
- "results-driven"
- "passionate about"
- "synergize" / "synergies"
- "deep dive" / "dove deep into"
- "in today's fast-paced world"
- "robust" (when used as a buzzword, not technically)
- "seamless" / "seamlessly"
- "cutting-edge" / "state-of-the-art"
- "innovative solutions"
- "best-in-class"
- "thought leader" / "thought leadership"
- "delve into"
- "tapestry of"
- "navigate the complexities of"

### 2. Em dashes
LLMs love em dashes (—). Mike's brand voice forbids them anyway. Replace with periods or parentheses.

### 3. Perfectly parallel bullet structure
LLMs often produce all bullets starting with the same grammatical structure (e.g., every bullet across 5 different roles starts with a past-tense verb + direct object + comma + result clause). Human-written bullets vary. Mix sentence structures across roles.

### 4. Three-item list pattern overuse
"Increased X, Y, and Z." "Built A, B, and C." If 4+ bullets in a row use a three-item list, break the pattern.

### 5. Em-dash-style appositive
"Built the system, a critical infrastructure piece, in 6 weeks." That comma-set-appositive is rare in human-written resumes. Use parenthetical or rewrite.

### 6. Hedging language
"Worked to improve," "Helped facilitate," "Played a role in." If you actually did the thing, say so. If you contributed, use strength-1 verbs from `verb-discipline.md`.

### 7. Adverb stacking
"Successfully implemented," "Effectively managed," "Strategically led." Strip the adverb. The verb + result speaks for itself.

### 8. "Various" / "Multiple" without numbers
"Collaborated with various teams" → "Collaborated with 4 teams (eng, design, sales, support)." Numbers always.

### 9. Symmetric quantification
Suspicious: every bullet has an exact number ending in 0 (50%, 30%, 25%). Real numbers are 47%, 23%, 31%. If every metric is round, you're probably making them up.

### 10. Cover-letter "I am writing to express my interest"
Replace with a specific hook tied to the company or role. Anything that could open any cover letter to any company = generic = LLM-smell.

### 11. Cover-letter "I would welcome the opportunity to discuss"
Replace with concrete forward action: "Happy to send a 10-minute Loom walking through how I'd approach <specific company problem>" or just "Available for a call this week."

### 12. Bullet that just restates the job title
"As Senior Product Manager, managed product roadmap and led cross-functional teams." This says nothing. Every bullet must add new information beyond the title.

## Scoring

For each item, count hits:
- 0-2 hits: ship it
- 3-5 hits: regenerate affected sections
- 6+ hits: regenerate from scratch with explicit "no LLM phrasing" instruction

## Why this matters
Hiring teams (especially at AI companies, agencies, content companies) are increasingly trained to spot LLM-generated content. A resume that smells like AI signals: low effort, generic candidate, possible fabrication. The same résumé without these tells reads as "thoughtful operator."

For Mike specifically (applying to AI Engineer roles): the rate of LLM-detection is higher in this audience. Run this scan twice.
