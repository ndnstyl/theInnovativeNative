---
name: trading-knowledge
description: Distilled trading knowledge for project 033-ai-trading-system. Use this skill when working on strategy design, picking tickers, refining risk gates, interpreting market regime, or writing a drawdown playbook. Synthesized from 165 Wallstreet Trapper YouTube videos (aggressively filtered to 50), curated for Mike's specific setup — RSI(2) + IBS mean reversion scanner on a 17-stock universe, ORB on BTC/ETH, $1K paper-trading experiment. Mindset/beginner/funnel content is filtered out — this only contains actionable frameworks, rules, and ticker ideas.
---

# Trading Knowledge — Wallstreet Trapper Synthesis

**Source:** 165 YouTube videos across 2 playlists (4 recession series + 161 educational catalog), aggressively filtered to 50 substantive videos. Playlist 1 (all 4 recession videos) + Playlist 2 (46/161 kept). Auto-captions downloaded via yt-dlp android-client extractor. 50/50 caption success.

**Built:** 2026-04-10
**For project:** 033-ai-trading-system
**Mike's profile:** 9-year buy-and-hold investor, $1K paper trading experiment, running RSI(2) + IBS mean reversion scanner on 17 equities (SPY, QQQ, AAPL, MSFT, AMZN, GOOGL, NVDA, META, TSLA, AMD, TSM, XEL, CAT, LMT, RTX, NOC, GD) + ORB on BTC/ETH. Already knows basics — skill contains no beginner material.

## When to invoke this skill

- Designing, refining, or debating a strategy in `scan-evaluate.js`
- Reviewing the watchlist or evaluating whether to add/remove a ticker
- Writing or testing a recession / drawdown playbook
- Tuning risk-management gates (daily halt, weekly halt, kill-switch, position cap)
- Interpreting the current market regime (bull / bear / correction / panic)
- Deciding whether to override the validated strategies on a high-conviction discretionary call
- Understanding sector rotation theses when rebalancing the universe
- Learning what a retail trading educator with a large paid-tier audience actually teaches (and where he's wrong)

## Core knowledge files

| File | What's in it |
|------|--------------|
| `references/recession-playbook.md` | What to do when markets fall — VIX zones, position rotation, loss psychology, the "armor of wealth" framing |
| `references/stock-picking-framework.md` | WT's synthesized framework: competitive advantage, industry structure, sustainability, RULES checklist, 6 stock types taxonomy |
| `references/technical-signals.md` | Candlestick reversals, market structure, supply/demand zones, multi-timeframe cascade — reconciled with Mike's existing RSI(2)/IBS signals |
| `references/risk-and-discipline.md` | Pre-trade checklist, position sizing reality, stop-loss limits, the "Trap Trade Commandments", revenge-trading traps |
| `references/current-picks-and-themes.md` | Specific tickers and sector theses by video — WITH staleness warnings. Do not act on any pick without re-verifying current fundamentals. |
| `references/critical-assessment.md` | Where WT is weak, wrong, or running a funnel. Read this FIRST before taking any picks seriously. |

## TL;DR — 10 things actually worth folding into the system

1. **Add a VIX gate to the regime classifier.** WT's zones (13-17 calm / 18-22 profit-taking / 23-30 intense selling / 30+ panic) roughly match known regime literature. Cross-reference with Mike's existing `regime_classifier.py` — specifically the 23-30 zone, where he scales into mean-reversion (aligns with RSI(2) buy logic on quality names).

2. **"Markets don't fall because of news. They fall because they're looking for a reason."** Useful lens for the post-trade journaling step — when RSI(2) fires after a news-driven drop, the signal is valid *if* the underlying trend hasn't broken.

3. **Economic-calendar gate.** WT scales back on CPI, PPI, Fed talk, jobs, housing data days. Mike's scanner should add a "high-impact data day" flag that either (a) reduces size, or (b) skips new entries entirely. The FOMC ± 1 day risk window is already well-documented.

4. **"2% isn't a correction. 10% is."** Directly useful as a regime threshold. If SPY is down <10% from 52-week high, don't classify it as "bear" — classify as "pullback" and let mean reversion work. Kill-switch only trips at deeper drawdowns.

5. **"Market goes up 76% of the time"** is a real number (roughly — closer to 53% of trading days, 72-76% of rolling years). The important thing: it's the justification for *asymmetric* risk management. Cut losses faster than you cut winners.

6. **Pre-trade checklist (adapted from 046):** Before any discretionary override of the scanner, verify: (1) trend direction of the market, not just the stock; (2) support/resistance frame; (3) position in 52-week range; (4) quality of asset (Mike's 17 universe is pre-filtered for this — good). If you can't answer all 4, don't override the scanner.

7. **Options context for future expansion.** If Mike ever adds an options leg, WT's "deep swing" = 6-9 month expirations, and his risk management is: sell half at 100%, let the rest ride, tighten stop at <30 days. Don't use his "formula" for strike selection — he hides it behind a paywall, and the math is basic delta targeting that's better derived from IV-rank tables.

8. **The 17-stock universe already passes WT's "circle of competence" test.** Every ticker in it has: household name / clear business model / strong balance sheet (except maybe XEL which is a utility defensive play). This matches WT's "6 stock types" taxonomy cleanly — growth (NVDA, AMD, META, TSLA), blue chip (AAPL, MSFT, GOOGL, AMZN), defensive (XEL, LMT, RTX, NOC, GD, CAT), supply chain (TSM). Good mix.

9. **Add copper / rare-earth / silver as future sector candidates.** WT's rare-earth and gold calls (143, 145, 147) and copper theses (131) are thematically sound — they're genuine supply constraints driven by AI/EV demand. If the 17-stock universe gets expanded, miners (FCX, NEM, MP) are the next logical bucket. NOT as active trades now — as watchlist seeds.

10. **Ignore every specific current pick until re-verified.** By the time Mike reads this, the watchlists in videos from late 2025 (130, 137, 145, 147, 150, 158, 160) are stale. The *frameworks* are what to keep. The tickers are what to throw away and regenerate from current data via the scanner.

## What this skill does NOT contain

- Motivational / mindset / "freedom price" content — filtered out
- Beginner basics (what's a stock, how to open a brokerage account, how shareholders get paid) — filtered out
- Brokerage reviews — Mike uses Alpaca, irrelevant
- Child-finance / generational wealth parenting content — filtered out
- Clickbait crash predictions — filtered out
- Anything promoting WT's Patreon, Trapping Tuesdays, Wall Street Trapping Course, Options Master Class, or coaching — filtered out and flagged as funnel in the critical assessment

## Provenance

- Filter decisions: `_workspace/filter-decisions.md` (50 kept of 165, ~70% skip rate)
- Transcript status: `_workspace/transcript-status.md` (all 50 recovered via yt-dlp android client)
- Per-video extractions: `_workspace/extractions.md`
- Raw transcripts: removed after synthesis to save disk. Re-run from `_workspace/urls.txt` if needed.

## Verdict on WT as a source

**Medium signal, high funnel.** He's a real retail trader with a real portfolio and real losses documented. His frameworks (risk management principles, candlestick basics, sector rotation, pre-trade checklist) are solid general retail wisdom — nothing original, but well-communicated. His picks are often talking-his-book and his paid-tier funnel is constant. The critical-assessment file is the most important reference file in this skill. Read it first.

He is NOT a quantitative source and does not use RSI, MACD, Bollinger Bands, or any oscillator across 50 videos. Mike's systematic mean-reversion approach is fundamentally different from WT's discretionary multi-timeframe chart reading. The overlap is in risk management psychology, not signals.
