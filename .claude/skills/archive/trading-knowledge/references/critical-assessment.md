# Critical Assessment — Where WT is Wrong, Thin, or Running a Funnel

## Read this file first.

Everything else in this skill is synthesized from WT's content taken somewhat at face value. This file is the correction layer. It is the most important file in the skill because it tells you what to *ignore*, what to *discount*, and where WT's content actively fails Mike's quantitative, systematic approach to the $1K paper experiment.

Verdict at a glance: **medium signal, high funnel.** WT is a real retail trader with a real portfolio, real losses, and an unusually direct communication style. His risk-management psychology and fundamental filter are solid. Everything else is either (a) narrative without mechanism, (b) paywalled behind his course, or (c) marketing.

---

## 1. He does not use a single quantitative indicator

**The evidence:** 50 transcripts, 157,000+ words, zero mentions of RSI, MACD, Bollinger Bands, Stochastics, Williams %R, ADX, ATR, Keltner, VWAP, Donchian, or any other oscillator or statistical indicator. Only 8 mentions of "moving average" total, 3 of "200 day," and 0 of the phrase "standard deviation."

**Why it matters:** Mike's entire scanner is built on RSI(2) and IBS — two simple quantitative indicators. WT's technical framework is qualitative candle-pattern reading at 5 timeframes, which is fundamentally incompatible with automation. There is no signal in WT's technical content that can be folded into `scan-evaluate.js` as a rule. The *filters* (VIX regime, 200-day MA trend gate, candle bottom at support) can be used as confirmation layers, but WT contributes nothing to primary signal generation.

**What to do:** Take his risk management psychology and his fundamental screening. Ignore his technicals as a signal source.

## 2. "Deep swing" is a rebranded LEAP

**The claim:** WT's "deep swing" strategy — 6-9 month options — is his own original framework.

**The reality:** LEAPs (Long-term Equity Anticipation Securities) are 12+ month options. WT calls 6-9 month options "deep swings" because "LEAPs" already has a definition and his 6-9 month horizon sits below it. This isn't an innovation. It's slightly less time premium than a LEAP and slightly more than a traditional swing. The framing as a proprietary system is marketing.

**Why it matters:** The "formula" for picking strike + expiration that he repeatedly teases ("I have a specific formula... check out the Options Master Class") is standard delta targeting — probably ~0.50-0.70 delta at entry, extend the expiration until premium fits the risk budget. This can be derived from any options Greeks table in 10 minutes. It does not require a paid course.

## 3. He contradicts himself on position sizing

**The preaching:** "Some traders risk 1%, some 2%. Never let a single trade be more than 40-50% of your account. Don't get two contracts until you've mastered one."

**The reality:** His biggest single option play was **$768K in a single NVDA call** when his options account was ~$3-4M. That's **20-25% of the options account on one ticker, one strike, one expiration**. Not 1%. Not 2%. Not "mastered one contract first."

His actual behavior is: "bet big on high conviction plays, take half off at 100% gain, let the rest run." That's a different strategy than 1-2% per trade, and it requires a 7-figure account to survive the losses it generates.

**For Mike's $1K account:** emulating WT's actual behavior would blow the account up in days. The rule Mike should follow is WT's *preached* version, not his *actual* behavior. Mike's existing 1% / 3% risk and 10% position cap are correct. Don't scale up just because WT is comfortable with larger bets — his comfort zone is priced by a $4M account.

## 4. "Market goes up 76% of the time" is a rallying cry, not a strategy

**The claim:** The market is up 76% of the time, therefore bullish bias is justified.

**The reality:** The 76% figure refers to rolling *annual* returns — yes, S&P 500 has had positive years ~72-76% of the time historically. On a *daily* basis, markets are up roughly 53% of days. On a *monthly* basis, 60-62%. On a *weekly* basis, 57-58%.

WT wields the 76% number whenever he's down on a short-term trade as post-hoc justification for not cutting. This is confirmation bias. The long-term bullish bias is real, but it doesn't justify holding a *broken* short-term thesis — and it definitely doesn't apply to the 2-5 day mean-reversion holding period Mike's scanner uses.

**What to do:** Take the long-run statistic as background truth, not as a tactical justification. Mean-reversion systems don't care about 76% annual up years — they care about 2-3 day bounce probabilities, which are in the 55-60% range.

## 5. Stock picks are talking his book

**The evidence:** WT publicly holds NVDA, META, GOOGL, AMZN, LLY, COST, FICO, PLTR, and others. Every video that recommends them opens with "I've held this for years" or "this is my biggest position." His recommendations are compromised — not fraudulent, but biased. When he tells you to buy a stock, he's confirming his own thesis and generating upside demand for positions he already holds.

**The counterexample:** The one video where he sold 80% of his NVDA position (video 085) is rare honesty. He lays out the technical reasons, shows the chart, and specifies his re-entry zones at 129, 125, and 120. This is the only video in the set where he clearly demonstrates a real exit decision. Every other video where he discusses a holding is cheerleading.

**What to do:** Assume every "hot pick" video has a bias multiplier. If WT is recommending it enthusiastically, discount the thesis by 30%. If he's explaining why he sold (like 085), weight it higher — that's where the real analysis shows up.

## 6. The highlight reel buries the losses

**The pattern:** In every portfolio update video (PL1 videos 2-4, video 8yJZ6d09OE0, video 7vRjPSXp6zc), WT walks through his positions. Wins get percentages prominently displayed ("up 280%, up 247%, up 230%"). Losses get quick pans: "we down on one, two, three, four plays — that's a good percentage."

He does sometimes disclose total losses (the $355K and $270K numbers are verifiable), but these disclosures are aggregate and framed as teaching moments ("this is part of the game"). The individual bad trades never get the same narrative treatment as the winners.

**Why it matters:** You cannot build a trading system from cherry-picked winners. Survivorship bias is how retail traders trick themselves into thinking a discretionary approach has edge when it doesn't. Mike's systematic backtest (via `backtest` scripts in project 033) is the correct way to measure expectancy. WT's video-based "track record" is not.

## 7. The Patreon / course funnel is the business

Every single video contains at least three sales hooks:
1. Start: "Like, subscribe, share"
2. Middle: Patreon pitch — "My Patreon been eating this up," "Come join the Trappers," "One of my people just hit a million"
3. End: The "Wall Street Trapping Course" and "Options Master Class" + "This is not me in the chat telling you about Bitcoin" (scam disclaimer — ironically, because his own funnel is also a funnel)

Specific funnel patterns worth flagging:
- **"In the course I go deeper"** — deferred-value claim. The free videos give you frameworks; the monetization is the promise of "the rest."
- **"My Patreon members made [X millionaires] last year"** — social proof as conversion lever. These claims are unverifiable.
- **"The formula is in the Options Master Class"** — specific teaching is gated.
- **Trapping Tuesdays live show** — weekly content-as-funnel.
- **Wall Street Looks Like Us Now Network** — cross-promotion with owned properties.

**Why it matters:** The Patreon and courses are the actual revenue source. The trading returns fund the content creation; the content creation drives the course sales. WT is not primarily a trader — he's a creator who trades, and his incentives are aligned with *content that sells courses*, not *content that maximizes your returns*.

This is not inherently evil. Most retail trading educators operate this way. It's worth naming clearly so you can discount the content appropriately.

**What to do:** Take the free content. Skip the Patreon. Skip the course. The Options Master Class in particular — whatever's in it, you can learn for free from a competent options book (McMillan, Cohen) in less time.

## 8. Contradictions across videos

Cataloged during the synthesis:

- **Stops are essential vs. stops get "arm-robbed":** In video 095 he says stop losses don't help you. In video 087 he says "set your stop before you enter." Reality: stops are fine for equities with reasonable placement; they fail for overnight options. He conflates the two.
- **Concentrated positions vs. diversified positions:** Video 027 says "mix all 6 stock types." His actual portfolio is 80%+ tech megacaps. Do as he says, not as he does.
- **"1-2% risk per trade" vs. his actual 20-25% concentration:** Already covered.
- **Long-term hold vs. aggressive rolling:** He preaches buy-and-hold for quality names but actively manages his options book daily. These are two different strategies in one presentation.

These contradictions aren't malicious — they reflect the reality that retail discretionary trading has no single optimal strategy. But they make his content less useful as a system design source.

## 9. The math doesn't scale to a $1K account

WT's frameworks assume you have a **brokerage account in the low six figures minimum**. Examples:
- "Deep swing" options at 6-9 month expirations with multiple contracts per position — single-contract minimums for a quality name are $500-3000. A single position would consume half of Mike's account.
- The "take half off at 100%" rule — needs enough contracts to make "half" meaningful. With 1 contract, you either exit or you don't.
- "Never exceed 40-50% of your account" — at a $1K account, 40% is $400, which doesn't buy a single NVDA share let alone a call.
- The VIX scale-in behavior — needs enough positions to meaningfully rebalance.

**For Mike's $1K paper account:** WT's options frameworks are inapplicable. The equity frameworks (fundamental filter, risk limits as a ceiling, candle pattern confirmation) are applicable. Stay on the equity side of his content only.

## 10. No backtesting, no statistical discipline

WT has never published a backtest, a Sharpe ratio, a max drawdown metric, a hit rate by setup, or any quantitative validation of his approach. Every claim is narrative.

**Compare:** Mike's project has:
- Backtest scripts in `projects/033-ai-trading-system/src/` (per the codebase structure)
- Documented kill switch logic
- Quantified risk budgets
- Paper trading before real money

That is the scientific approach to strategy validation. WT's approach is the narrative approach. Both can work — but one is measurable and one is not. If you're building a system, use the measurable one and keep the narrative one only for intuition checks.

## 11. What WT actually gets right (the fair credit section)

Credit where due. These are the legitimate strengths of his content:

1. **Loss psychology is honest.** He admits real losses, including the $1.5M drawdown from the Trump tariff period. This is rarer in retail trading content than you'd think. It's the main reason the content is worth reading at all.
2. **Pre-trade checklist (Trap Traders Checklist) is solid.** Not original, but clearly communicated. The 6-point check in video 046 is reusable.
3. **Economic calendar awareness.** "Don't trade on CPI/PPI/FOMC days" is correct, well-established, and under-applied by retail traders.
4. **Partial profit-taking at 100%.** Mechanical, simple, hard to argue with. "Sell half at double, let the rest run" is a decent default for asymmetric bets.
5. **Concentrated universe (20 stocks he knows deeply).** Aligns with Mike's 17-stock universe philosophy. Mastery > breadth.
6. **VIX regime awareness.** The 3-zone framework (calm / profit-taking / intense selling) maps reasonably well to known regime research.
7. **The "armor of wealth" framing.** The argument that retail traders lose not because they're bad at picking but because they can't *stay in position* is empirically correct. This is the single most valuable insight in the 50 videos.
8. **Fundamental filter (the 4 ingredients / 5 rules / moat test).** Standard Buffett-Munger canon in plain language. Not original but well-communicated.
9. **"Markets don't fall because of news, they fall because they're looking for a reason."** This is a genuinely useful reframe. News is the trigger, not the cause. The cause is positioning.

## 12. How to use this skill responsibly

1. **Start with the critical assessment (this file).** If you skipped it, go back.
2. **Use the risk-and-discipline file as the primary operational reference.** That content is the most directly applicable.
3. **Use the recession playbook when VIX spikes.** Specifically the VIX zone framework.
4. **Use the stock-picking framework as a filter, not a signal.** The RULES checklist is a sanity check before adding new tickers to the scanner universe.
5. **Use the technical signals file only as confirmation.** Primary signals come from RSI(2) + IBS; candle patterns can filter out low-confidence entries.
6. **Use the current picks file as a thematic seed generator, not a buy list.** Everything is stale by the time you read it.

## Source videos (where WT shows his weaknesses most clearly)

- PL1 all 4 — Portfolio updates reveal the actual position sizing (contradicts "1-2% risk")
- 046 XHqPcxogoCQ — Ultimate Trading Checklist (the one framework that's solid)
- 095 eDTzPakGAjI — Stop Losses Are NOT Enough (the contradictions)
- 136 -_Za9pTbcQ4 — Why Most Traders Fail (the psychology is strong, the prescriptions are mixed)
- 156 Ui-NNSJ7AzI — The Law Every Trader Breaks (strong risk psychology)
- 145 lzpeL-rQWmM — The Exact Watchlist (shows the real-time adaptation under pressure)
- 085 xnaJi1jjgCY — Sold 80% Nvidia (rare honest exit analysis)

## Final note

WT's content is worth the filtered 50 videos. It's not worth the other 115, and it's definitely not worth the Patreon or course. Mike's system is already more rigorous than anything WT teaches because it is systematic, backtested, and quantitatively risk-managed. The value of this skill is as a *mental model library* for discretionary overrides and as a filter for the universe — not as a source of new signals.
