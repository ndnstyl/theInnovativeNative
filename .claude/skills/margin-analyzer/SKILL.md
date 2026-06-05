---
name: margin-analyzer
description: Per-product and per-client profit/margin analysis across Mike's revenue streams (Stripe courses, services, VisionSpark, GM RAG, outreach clients). Pulls revenue from Stripe, costs from Airtable, time from Time Entries, and produces a ranked margin report. Use monthly, before pricing decisions, or when deciding which product line to kill, scale, or reprice.
triggers:
  - "margin analysis"
  - "which product is most profitable"
  - "per-client margin"
  - "p&l by product"
  - "should I kill this product"
  - "should I raise prices on"
  - "/margin"
---

# Margin Analyzer

## What this skill does
Computes profit margin (revenue minus cost) per product line and per client across Mike's stack so pricing, prioritization, and kill decisions are made on numbers, not vibes.

This is NOT MRR reporting — Cash (`workers/cash-stripe`) already does revenue. This skill subtracts COSTS to get margin.

## When to use
- Monthly P&L close (run on the 1st)
- Before raising prices, killing a SKU, or pitching a new productized service
- When something feels unprofitable but you can't prove it
- Quarterly: rank revenue streams by margin contribution and reallocate time

## Inputs needed
1. **Time period** — default: previous calendar month
2. **Scope** — `all`, `products` (Stripe SKUs), `clients` (services), or specific name
3. **Cost sources** — confirm which Airtable tables hold:
   - Direct costs (Stripe fees, API costs, contractor pay, ad spend)
   - Time entries (Mike's hours @ blended rate, default $250/hr)
   - Allocated overhead (tooling subscriptions, OB1, n8n VPS, hosting)

## Data sources

### Revenue
- **Stripe** (via `workers/cash-stripe` or MCP) — courses, subscriptions, one-time products. Stripe products + IDs catalogued in `memory/stripe_products.md`.
- **Airtable client invoices** — services revenue (DEA, law firm RAG, agency partners). Need to confirm table name; if missing, ASK Mike before guessing.

### Costs (per product line)
- **Stripe processing fees** — 2.9% + $0.30 per Stripe transaction
- **API costs** — OpenAI, Anthropic, ElevenLabs, Apify, Pexels, Cohere (OB1)
- **Ad spend** — Meta Ads `act_884871169097180` (cred in `analytics_dashboard_credentials.md`)
- **Contractor pay** — Airtable Time Entries with `Agent != Mike`
- **Mike's time** — Time Entries × blended rate. Default $250/hr; if Mike has set a different number in `memory/`, use that.
- **Tooling overhead** — allocate monthly tool costs proportionally by revenue contribution (n8n VPS, Hostinger, Vercel, Supabase Pro, GitHub, etc.)

## Calculation

```
gross_margin = revenue - direct_costs
contribution_margin = gross_margin - allocated_time
net_margin = contribution_margin - allocated_overhead
margin_pct = net_margin / revenue
```

For each product/client also compute:
- **Hours invested** (sum of Time Entries linked to that project)
- **$/hour realized** = net_margin / hours_invested
- **Trend** vs prior period (% change in margin)

## Output format

```markdown
# Margin Analysis — <period>

## Headline
- **Total revenue**: $X
- **Total net margin**: $Y (Z%)
- **Most profitable line**: <name> ($/hr realized)
- **Least profitable line**: <name> ($/hr realized)
- **Kill candidates**: <names where margin% < 20% AND hours > N>

## Per-Product
| Product | Revenue | Direct $ | Time hrs | Net Margin | Margin % | $/hr | Trend |
|---------|---------|----------|----------|------------|----------|------|-------|
| ...     |         |          |          |            |          |      |       |

## Per-Client
| Client | Revenue | Direct $ | Time hrs | Net Margin | Margin % | $/hr | Trend |
|--------|---------|----------|----------|------------|----------|------|-------|

## Recommendations
1. **Reprice**: <product> — current $/hr is $X, market is $Y
2. **Kill or fix**: <product> — losing money after time allocation
3. **Scale**: <product> — high margin %, low hours, expand capacity
```

## Output destination
Save to `.specify/memory/margin/margin-<YYYY-MM>.md`. Also write a one-line headline summary to `.specify/memory/margin/index.md` (create if missing) so trends are queryable.

## Operational notes
- If a cost source is missing or ambiguous, ASK before guessing. A wrong margin number is worse than no number.
- Stripe + Airtable + Time Entries are the load-bearing inputs. If any one is stale, flag it in the report header.
- For services clients, if no invoice table exists yet, recommend Mike start one before next run (this is the #1 blocker to clean per-client margin).
- Cross-check the headline number against bank deposits for the period; if delta > 5%, flag.

## Anti-patterns (NEVER)
- Don't compute margin without subtracting Mike's time. Revenue minus Stripe fees is not margin — it's gross billings.
- Don't allocate overhead by guess. Use revenue-weighted allocation, and state the method in the report.
- Don't recommend killing a product based on one month. Require at least 2 consecutive periods of poor margin.
- Don't print API keys or customer payment details in the report.
