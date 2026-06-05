# Stock-Picking Framework

## Core principle

WT's picking philosophy is fundamentals-first with a technical entry overlay. He only buys companies he understands, with strong balance sheets, a defensible moat, and clear pricing power — and he only enters when the chart confirms the thesis. Nothing in this framework is original to him. It's roughly Warren Buffett's qualitative filter with Peter Lynch's "invest in what you know" and a sprinkle of Philip Fisher's scuttlebutt — all framed in street language for a retail audience. What makes it worth distilling is that it's internally consistent and the filter does screen out most of the garbage that blows up retail accounts.

## The 4 ingredients + 5 rules (from video 044)

WT calls this his core framework. It's the same thing most value investors call a "qualitative checklist."

### Ingredient 1: Circle of competence
- Do you understand **how they make money** at the core business? (Walmart = low price, 10-mile customer radius. Starbucks = subscription-like loyalty + scalability. Costco = paid membership model with 97% retention.)
- Do you understand **who their core customer is**?
- Do you understand **the company's vision** — where they're trying to go?
- Reality check: if you can't answer all three in one sentence each, skip the stock.

### Ingredient 2: Financial stability + scalability
- Assets > liabilities
- Cash > debt (or debt declining quarter over quarter)
- Retained earnings growing (profit after dividends that the company reinvests)
- Positive free cash flow
- Can the company bring new products to market without debt financing? (That's scalability — not just stability.)

### Ingredient 3: The moat
WT lists four types of moat, all borrowed from standard Buffett-Munger canon:
- **Brand power** (Apple, Meta, Nike)
- **High switching cost** (Salesforce, CrowdStrike, ADP, Apple ecosystem)
- **Pricing power** (can raise prices without losing customers — Costco, Netflix, LLY)
- **Network effect** (implied, mentioned but not developed)

Practical moat test: **net margin ≥ 10%.** If a company takes in a dollar and keeps less than ten cents as profit, WT says it doesn't have a real moat. This is a reasonable rough screen — quality compounders typically run 15-30% net margins.

### Ingredient 4: Price
- Wait for a stock to be 10% off its 52-week high before entering — always a decent entry.
- 20% off 52-week high = even better.
- Bouncing off the 200-day moving average = good entry.
- Every few months, re-evaluate your price targets. Don't chase runups past your predetermined buy zone.

### The RULES acronym
- **R**eason — why am I buying this?
- **U**nderstand — can I explain it simply?
- **L**ongevity — will it still be relevant in 5-10 years?
- **E**xpansion — is it growing into new products/markets?
- **S**imple — can I describe the business in one sentence?

## Portfolio construction — the 6 stock types (from video 027)

WT says every portfolio should mix all 6 categories. This is a standard "diversify across profiles, not just sectors" idea, but the taxonomy is clean enough to be directly useful for building out Mike's 17-stock universe.

| Category | Purpose | Examples | Mike's universe match |
|----------|---------|----------|----------------------|
| **Growth** | Capital appreciation, volatile | NVDA, CMG, TSLA | NVDA, AMD, TSLA, META |
| **Dividend** | Income, capital preservation | KO, XOM, IRM | (none — gap) |
| **Cyclical** | Consumer-spending-tied | F, DIS, LUV | CAT (industrials-cyclical) |
| **Blue Chip** | Stable/old-faithful | AAPL, MSFT, COST, WMT | AAPL, MSFT, GOOGL, AMZN |
| **Defensive** | Recession-proof | CLX, LLY, CRWD, XEL | XEL, LMT, RTX, NOC, GD |
| **Speculative** | High risk, small position | SMCI, TSLA, BTC | (TSLA borderline; BTC/ETH via ORB) |

**Key observation for Mike's scanner:** the 17-stock universe has no dedicated dividend/income bucket. If the project expands beyond mean reversion into regime-aware allocation, KO/IRM/XOM or similar should be added as a "safe rotation" bucket for high-VIX regimes. This aligns with WT's "rotate into defensives during drawdowns" thesis.

## Industry structure and ROIC

High ROIC (return on invested capital) industries are where winners compound. WT says look for ROIC > 10% at minimum. The industries he cites as having structurally high ROIC:
1. Technology (software especially)
2. Pharmaceuticals (post-patent markup is huge)
3. Software / SaaS
4. Beverages (Celsius, Coca-Cola — syrup + bottling margin stack)

Mike's universe is heavy in Category 1, fine in Category 3. Missing Category 2 (pharma) and Category 4 (beverages) entirely. Not a gap to fix urgently — his mean reversion works on liquid names, and pharma has binary FDA risk that breaks mean-reversion assumptions.

## Balance sheet specifics (from 030, 158)

WT's balance sheet checklist:
- **Debt-to-equity ratio** — if debt > equity, the company isn't financially scalable
- **Cash-to-debt ratio** — if debt > cash and they're paying a dividend, cut the dividend before investing
- **Retained earnings** — growing means profitable reinvestment
- **Working capital** (current assets − current liabilities) — positive = healthy
- **Book value** (total assets − total liabilities) — the net-worth concept
- **Owner equity** — who gets the residual if the company liquidates

Practical application for the 17-stock universe: all current holdings pass this filter cleanly except TSLA (historically high debt-to-equity until 2023, now improved) and XEL (utilities carry structural debt, but that's industry-normal — judge on coverage ratio not absolute debt).

## The "MOAT + price" quick test

When WT evaluates a specific pick on camera (130, 158, 131), he always asks three questions in order:
1. Does it have a moat? (Brand / switching / pricing)
2. Is the balance sheet clean? (Cash > debt, positive FCF)
3. Is the price reasonable? (10-20% off 52w high, above 200-day MA on long-term weekly)

If all three pass, he enters. If any fail, he skips. It's simple and it works. Use this as a quick sanity check before adding any ticker to the scanner universe.

## Where this overlaps with Mike's existing system

The RSI(2) + IBS mean reversion scanner assumes the underlying is a quality name that will mean-revert. This entire framework — WT's fundamental filter — is the implicit prerequisite. Every ticker in Mike's universe passes WT's filter. That's why the scanner works on SPY, QQQ, AAPL, etc. but would blow up on microcap meme stocks or broken businesses.

**Actionable extension:** if the universe is ever expanded (e.g., to add mid-caps), use WT's 4-ingredient filter as a gating step before backtesting. Specifically:
- Net margin ≥ 10% (moat proxy)
- Cash > debt (balance sheet gate)
- 5-year earnings positive (sustainability gate)
- No single-quarter >30% drawdown in fundamentals (volatility gate)

## Where WT's framework is thin

- **No valuation discipline.** He talks about "price" (52-week high discount) but never mentions P/E, PEG, EV/EBITDA, DCF, or any actual valuation math. Every pick is qualitative + chart-based. For a mean-reversion system this is fine (entries are mechanical) but it's a gap if you want long-term conviction building.
- **No diversification math.** He says "mix all 6 categories" but doesn't say what percentage, doesn't discuss correlation, and his actual portfolio is 80%+ concentrated in tech.
- **Moat assessment is narrative.** He identifies moats by storytelling, not by measurable persistence (e.g., 10-year margin stability). Academic moat definitions require measurable evidence.
- **"Invest in what you understand" is circular.** Useful floor, but doesn't help you discover new industries.

## Source videos

- 008 pdCvzVzAKkQ — Discover Top Stocks: 3 Proven Strategies
- 027 iS-lEs4Q_tM — 6 Types of Stocks in Portfolio
- 030 TMe7J7EGXN8 — Importance of Balance Sheets
- 044 cneoiCz9ZGw — How to Find the Right Stock (4 ingredients, 5 rules)
- 130 IgWH3LtizEQ — 3 Stocks Under $100 Q4 2025 (HSBC, NEM, GLW)
- 158 -TXIGcp7CFY — 2026 Under $100 Picks (TXT, MNST)
