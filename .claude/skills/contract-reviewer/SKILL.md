---
name: contract-reviewer
description: Review SOWs, MSAs, NDAs, and client contracts for red flags before signing. Flags scope creep, payment terms, IP assignment, termination, liability, indemnification, and exclusivity issues against Mike's standard service terms. Use whenever a counterparty sends a contract or before sending one out.
triggers:
  - "review this contract"
  - "review this SOW"
  - "review this MSA"
  - "review this NDA"
  - "check this agreement"
  - "red flag this contract"
  - "contract review"
---

# Contract Reviewer

## What this skill does
Reads a contract (SOW, MSA, NDA, services agreement, consulting agreement) and returns a structured red-flag report keyed to Mike's actual exposure: solo operator running consulting + productized services with clients in regulated verticals (DEA logistics, law firms, financial services).

## When to use
- Counterparty sends an MSA or SOW to sign
- A new client (DEA, law firm, GM RAG buyer, agency partner) sends a services agreement
- Drafting an outbound SOW and want a pre-flight check
- NDA arrives before a discovery call

## Input
Either paste the contract text into chat OR provide a file path (PDF, DOCX, MD). For PDFs, read with the Read tool. For DOCX, convert via `pandoc` first.

## Review checklist (run all 8)

### 1. Scope
- Is the deliverable defined by **specific outputs** (artifacts, demos, milestones) or by **time/effort** (vague "consulting services")?
- Are revision rounds capped? Default: 2 rounds; anything beyond = change order.
- Is "scope creep" explicitly addressed (change-order clause)?
- **Red flag**: "as needed", "ongoing support", "best efforts" without caps.

### 2. Payment terms
- Net terms: 7, 15, 30, 60? Anything over net-30 is a red flag for a solo operator.
- Deposit / upfront required? Default: 50% upfront for new clients.
- Late fees specified? (1.5%/month is industry standard.)
- Kill fee if client terminates? Should be at least 25% of remaining contract.
- **Red flag**: net-60+, no deposit, no late fees, payment contingent on subjective client approval.

### 3. IP assignment
- Who owns the deliverable? Default for Mike: **client owns final deliverables; Mike retains pre-existing IP, methodologies, and tooling.**
- Are background IP / pre-existing materials carved out?
- Can Mike reuse anonymized learnings in case studies, marketing, OB1?
- **Red flag**: "work for hire" with no carve-out for tooling/methodology; clauses that assign Mike's pre-existing IP.

### 4. Termination
- Can either party terminate for convenience? With what notice?
- What happens to in-progress work and unpaid fees on termination?
- Are there termination penalties on Mike?
- **Red flag**: client can terminate immediately without paying for work-in-progress; Mike has unilateral obligations post-termination.

### 5. Liability cap
- Is Mike's liability capped? Default cap: **fees paid in the last 12 months** (or contract value, whichever is lower).
- Are consequential / indirect damages excluded?
- **Red flag**: unlimited liability; cap higher than fees received; missing exclusion of consequential damages.

### 6. Indemnification
- Is indemnification mutual or one-sided?
- Carve-outs for third-party IP claims?
- **Red flag**: Mike indemnifies client for "any and all claims" with no reciprocity; indemnification not capped at fees.

### 7. Exclusivity / non-compete
- Is Mike restricted from working with competitors?
- Geographic / temporal scope of any non-compete?
- Does it survive termination? For how long?
- **Red flag**: any exclusivity for a solo operator; non-competes longer than 6 months post-engagement; vague "competitor" definitions.

### 8. Confidentiality / non-solicitation
- Mutual NDA built in or separate?
- Non-solicit of employees / contractors? Reasonable duration?
- **Red flag**: non-solicit applies to ALL of client's contacts (not just employees Mike actually met); duration over 12 months.

## Output format

Return a markdown report:

```markdown
# Contract Review — <counterparty> <doc type>

## Summary
- **Verdict**: SIGN / NEGOTIATE / WALK
- **Top 3 issues**: <bullets>
- **Estimated negotiation effort**: low / medium / high

## Red Flags
| # | Section | Issue | Suggested Redline |
|---|---------|-------|-------------------|
| 1 | Payment | Net-60 terms | Change to net-15 with 50% deposit |
| ... |

## Acceptable As-Is
- <list of clauses that are fine>

## Missing Clauses (should be added)
- <e.g., kill fee, change-order process, IP carve-out>

## Negotiation Script
> Hi <counterparty>, thanks for sending this over. A few items I'd like to adjust before signing:
> 1. ...
> 2. ...
```

## Mike's standard terms reference
When suggesting redlines, default to:
- Net-15, 50% deposit for new clients
- 2 revision rounds; further work = change order at hourly rate
- Liability cap = fees paid in last 12 months
- Mutual indemnification for IP claims
- No non-compete (Mike will not sign these)
- 14-day termination for convenience by either party; payment for work-in-progress required
- Client owns deliverables; Mike retains tooling, methodology, anonymized learnings

## Output destination
Save the review to `projects/<project-slug>/contracts/review-<counterparty>-<YYYY-MM-DD>.md`. If unsure of project slug, ask before writing.

## Anti-patterns (NEVER)
- Don't tell Mike "consult a lawyer" as the whole answer. He knows. Surface the SPECIFIC clauses that warrant a lawyer's eyes versus those that are routine.
- Don't quote the entire contract back. Quote only the problematic clause text, then explain.
- Don't recommend signing a contract you haven't read fully.
