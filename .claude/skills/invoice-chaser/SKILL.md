---
name: invoice-chaser
description: Identifies overdue client invoices and drafts cadenced chase messages (gentle nudge → firm reminder → late-fee notice → final demand). Pulls from Airtable invoices and Stripe; outputs ready-to-send emails and Slack DMs in Mike's voice. Use weekly on Mondays or whenever cash conversion feels slow.
triggers:
  - "chase invoices"
  - "overdue invoices"
  - "who owes me money"
  - "AR aging"
  - "follow up on invoice"
  - "/chase-invoices"
---

# Invoice Chaser

## What this skill does
Surfaces every overdue invoice across Stripe (subscription dunning) and Airtable (services invoices), then drafts cadenced chase messages keyed to how late each invoice is. Hands drafts off — Mike approves before send.

This is NOT Cash's automated Stripe dunning (`workers/cash-stripe` handles that for subscriptions). This skill handles **services invoices** (DEA, law firm RAG, GM RAG buyers, agency partners, one-off engagements) where the chase is human-judged, not automated.

## When to use
- Weekly Monday cash check
- End of month before close
- When bank balance feels lower than the invoice ledger suggests
- After a client goes silent post-deliverable

## Inputs needed
1. **Invoice source** — confirm Airtable table name holding services invoices. If it doesn't exist yet, see "Setup" below.
2. **Today's date** — for aging calculations
3. **Chase mode** — `draft` (return messages for Mike to review) or `send` (push via n8n; requires explicit approval)

## Aging buckets and cadence

| Days past due | Stage | Tone | Channel | Add late fee? |
|---|---|---|---|---|
| 1-7 | Friendly nudge | Casual, assume oversight | Email | No |
| 8-14 | Direct reminder | Clear, factual, restate terms | Email + Slack DM | No |
| 15-30 | Firm escalation | Professional, mention late fee accrual | Email + Slack DM | Yes (1.5%/mo) |
| 31-60 | Pre-collections | Formal, name consequences (work stoppage, collections) | Email (CC counterparty's accounting) | Yes |
| 60+ | Final demand | Lawyer-language, work-stop in effect | Email + certified mail recommended | Yes + threaten collections |

## Process

### 1. Pull AR aging
- Query Airtable invoices table for `Status != Paid` AND `Due Date < today`
- Group by client
- Compute days past due per invoice
- Sort by oldest first

### 2. Cross-reference recent activity
- Has Mike already sent a chase for this invoice in the last 7 days? If yes, skip unless escalation tier changed.
- Has the client paid a DIFFERENT invoice recently? Note it (don't over-chase a paying client over a small overdue).
- Is there an active deliverable in progress? Flag — chase tone changes when work is in flight.

### 3. Draft per-invoice message

Use this template engine. Pull client name, invoice #, amount, due date, days past due, and Mike's voice (direct, no fluff, no em dashes).

#### Template: 1-7 days (friendly nudge)
```
Subject: Quick nudge — invoice #<num>

Hey <name>,

Just a heads-up that invoice #<num> for $<amount> was due <date> and is showing
unpaid on my end. Probably just slipped through. Let me know if you need
me to resend it or if there's anything blocking on your side.

Thanks,
Mike
```

#### Template: 8-14 days (direct reminder)
```
Subject: Invoice #<num> — $<amount> past due

Hey <name>,

Invoice #<num> for $<amount> is now <N> days past due. Original due
date was <date>.

If it's a process issue on your side, point me at the right contact and
I'll resend with the correct PO. If it's something else, let's talk.

Payment link / wire details below.

<payment instructions>

Mike
```

#### Template: 15-30 days (firm + late fee)
```
Subject: Invoice #<num> — late fee now applies

<name>,

Invoice #<num> for $<amount> is <N> days past due. Per our agreement,
a 1.5%/month late fee now applies (current accrued: $<fee>).

To resolve, please remit the full balance ($<total>) by <date + 7>.

If there's a dispute or scope question, let's get on a call this week.
Otherwise I need the payment to land before we continue on <project>.

Mike
```

#### Template: 31-60 days (work stoppage)
```
Subject: Work stoppage on <project> — invoice #<num>

<name>,

I am pausing all work on <project> effective immediately due to invoice
#<num> ($<amount>) being <N> days past due.

Balance with late fees: $<total>.

To resume work, I need full payment of the outstanding balance.
If the invoice is disputed, please send a written objection by <date + 5>;
otherwise the account moves to collections on <date + 30>.

Mike
```

#### Template: 60+ days (final demand)
```
Subject: FINAL NOTICE — invoice #<num>

<name>,

This is a final demand for payment of invoice #<num>, $<amount>,
originally due <date> (<N> days past due). With accrued late fees,
the total owed is $<total>.

If full payment is not received by <date + 10>, this account will be
referred to a collections agency and reported. All work product
delivered remains conditional on payment per our agreement.

Reply to this email to remit or to dispute in writing.

Mike
```

### 4. Output format

Return a markdown report:

```markdown
# AR Aging — <today>

## Headline
- **Total overdue**: $X across N invoices
- **Oldest**: <client> — <N> days past due
- **Largest**: <client> — $<amount>

## Action queue (approve to send)

### <Client A> — invoice #123 — $5,000 — 12 days past due
**Tier**: 8-14 (direct reminder)
**Channel**: Email + Slack DM
**Draft**:
> <full message>

### <Client B> — ...
```

### 5. Send (optional)
If Mike says "send these," route through:
- **Email**: Comms (`workers/comms`) or n8n Gmail node
- **Slack DM**: HTTP node + cred `kEU2b4p4ognbXDRu` (per `reference_n8n_slack_pattern.md`)
- Log every sent chase to Airtable so escalation tier increments correctly next run.

## Setup (if Airtable invoices table doesn't exist)
If Mike has no `Invoices` table in Airtable yet, this is the #1 blocker. Recommend creating one with fields:
- Client (link to Clients/Projects)
- Invoice # (auto)
- Amount
- Issue Date
- Due Date
- Status (Draft / Sent / Paid / Overdue / Disputed / Collections)
- Last Chase Sent (date)
- Last Chase Tier (1-5)
- Notes

Do not invent invoice data. If the table doesn't exist, return the recommendation and stop.

## Output destination
Save the AR aging report to `.specify/memory/ar/aging-<YYYY-MM-DD>.md`. Append to `.specify/memory/ar/index.md` for weekly trend tracking.

## Anti-patterns (NEVER)
- Don't auto-send anything. Mike approves drafts before they go out. Every time.
- Don't include em dashes in any chase message (Mike's brand voice rule).
- Don't chase a client over a small overdue if they just paid a larger invoice this week. Use judgment.
- Don't escalate tier on every run. Only escalate if 7+ days have passed since last chase at the previous tier.
- Don't print bank account numbers or sensitive payment details in the report itself; reference "payment instructions on file."
- Don't send Stripe subscription dunning here. That's Cash's job (automated).
