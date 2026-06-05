# Master CV — Structured Q&A (Phase 1 Setup-Extract)

Adapted from varunr89/resume-tailoring-skill (branching interview discovery) + ARPeeketi/claude-resume-kit (structured extraction).

## Run order
1. **Inventory** — list every role, project, side gig, volunteer activity
2. **Per-role deep dive** — run the role questions below for each entry
3. **Cross-role mining** — questions that surface achievements that span multiple roles
4. **Provenance tagging** — for every metric collected, assign a provenance tag

## Phase 1 Inventory
Ask once, capture as a flat list:

1. List every job you've held in the last 15 years (or career if shorter). Include title, company, dates, employment type (FT/PT/contract).
2. List every side project, freelance gig, or contract you've done that produced an outcome you'd defend in interview.
3. List every volunteer role or board position.
4. List every formal credential — degrees, certifications, licenses, published papers/talks.
5. List every "thing you built" — internal tools, scripts, dashboards, products — even if not officially part of your job.

## Phase 2 Per-Role Q&A
For each role in the inventory, run this sequence. Let answers branch — if the user mentions something interesting, follow the thread.

### Scope
1. What was your title? What was the title you SHOULD have had based on what you actually did?
2. Who did you report to? Who reported to you (direct + indirect)?
3. What was the budget you controlled or directly influenced?
4. What was the team / org size?
5. Geographic scope (one office / multiple / international)?

### Outcomes
6. What are the top 3 things that changed because you were there? (Push for numbers; accept "estimated" provenance if exact unknown.)
7. What would your manager say was your biggest contribution?
8. What would a peer say?
9. What's something quantifiable you can prove with a screenshot / dashboard / artifact?

### Hidden contributions (branching — this is where gold lives)
10. What did you do that wasn't in your job description?
11. What internal tool, process, doc, or system did you create that's still in use?
12. Who did you mentor or onboard? How many?
13. What conflict did you resolve that wasn't your job to resolve?
14. What did you advocate for that the company adopted?
15. What did you say no to that the company is glad you said no to?

### Skills demonstrated
16. What technologies / tools / frameworks did you use most?
17. What soft skills got the most use? (Negotiation, mediation, public speaking, mentoring, written comms.)
18. What was the hardest interpersonal situation? What did you do?

### Provenance
19. For each metric you gave me — is there a published artifact, internal artifact, or just memory?
20. If memory only: how confident? (0-100%) If < 80%, we'll soften the verb.

### Departure
21. Why did you leave? (Captured for cover-letter prep, not the resume.)
22. Who would still vouch for you from this role? (For LOR / references.)

## Phase 3 Cross-Role Mining
Surface patterns that span the whole career:

1. Across all your roles, what's the through-line? What's the same kind of work you keep getting hired to do?
2. What's the biggest scope change between earliest and most recent role? (For "growth trajectory" framing.)
3. What's a recurring strength three different managers have commented on?
4. What credential or experience makes you legitimately rare in your market?
5. What's an unusual combination of skills you have that most people don't?

## Phase 4 Provenance Tagging
For every metric collected in Phases 2-3, assign a tag. See `verb-discipline.md`:

- `published` — public artifact exists
- `internal-with-receipts` — internal artifact you could show in interview
- `internal-only` — happened internally, no specific artifact
- `self-reported` — your memory; nobody else would verify
- `estimated` — inferred from indirect signals
- `team` — team outcome, your individual contribution real but bounded

This tagging IS the anti-fabrication mechanism. Without it, verbs drift upward and metrics get optimistic in tailoring.

## Output format

Write to `~/jobHunt/master/master-cv.md`. Structure:

```markdown
# Master CV — <user name>
Last updated: <date>

## Through-line
<1-2 sentences capturing what kind of work the user keeps getting hired to do>

## Unusual combinations
- <skill combo that makes them rare>

## Roles

### <Title> — <Company> (<dates>) [tag: always | variant-X]

**Scope**: <team, budget, geography>
**Reports**: <to whom, who reported to user>

#### CAR Stories
- **C**: <challenge>
  **A**: <action — YOU specifically>
  **R**: <result with number>  `[provenance: <tag>]`

#### Skills demonstrated
- <skill> (evidence: CAR #N above)

#### Departure context (not for resume)
<why left, who would vouch>

[repeat per role]

## Story bank (cross-cutting CARs)
<stories that span multiple roles, indexed by skill>

## Credentials
<degrees, certs, publications>

## References
<name, title, company, relationship, contact OR "available">
```

## When to re-run
- After every major project or role change
- Every 12 months minimum (skills drift, achievements fade)
- Before any premium job search (FAANG, executive, career pivot)
