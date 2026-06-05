# Risk and Discipline

## Core principle

> "The number one goal is not to make money. The number one goal is to protect your capital. Because if you don't protect your capital, you cannot make money." — video 156

This is the single most important idea WT repeats across 50 videos. Every other rule in this file is a consequence of it. Retail traders blow up not because their setups are wrong but because their risk management is absent. WT himself publicly took $350K, $270K, and $1.5M drawdowns and only survived because of partial profit-taking and position-sizing discipline applied to the *rest* of the book. The discipline is what keeps you in the game long enough for the expectancy to work.

## The pre-trade checklist (Trap Traders Checklist, video 046)

WT's most quoted framework. Before any entry, answer all six:

1. **What is the trend direction?** Is the market trending up, retracing, or in a range? Look at the market first, not the individual stock. Certain stocks behave differently in different market regimes.
2. **Who's playing?** Which sectors are active right now? Financials, tech, energy, defense? Are bulls or bears in control across the market?
3. **What's in the picture frame?** Where is price in relation to support and resistance zones? Top of range, middle, bottom? Don't trade in the middle of a range.
4. **Are the colors matching?** Do all your framework slots agree? If your trend says up but your candles say reversal, the colors don't match — stay out.
5. **What's the pricing?** Is the stock near the 52-week high (expect profit-taking) or 52-week low (expect a bounce)? Is the asset high-quality (Amazon) or low-quality (AMC)?
6. **Where's the prize?** Define entry, profit target, and stop BEFORE you enter. No exceptions.

For Mike's automated scanner, the first five questions are partially pre-answered by the universe filter (quality), the 200-day MA filter (trend direction), and the RSI(2)/IBS math (range position). Question 6 is the critical one: the scanner must output entry, target, and stop as a single atomic decision. If any leg is missing, skip the trade.

## The Trap Trade Commandments (video 136 / -_Za9pTbcQ4)

1. **Check the economic calendar** — CPI, PPI, Fed talk, jobs, housing data. On these days, reduce size or skip new entries. The trend can reverse on unexpected data regardless of your setup.
2. **Before entering, describe what you see** — not what you want to see. Put the honest observation in words before pulling the trigger. "I see higher highs and higher lows with a confirmation candle" is fine. "I feel this is about to break out" is not.
3. **Define profit and loss exits before entry** — both levels, in advance. Pride turns small losses into big losses. Never say "it'll come back" as a justification for holding.
4. **No revenge trading** — if you lose a trade, walk away. Don't immediately flip to the opposite side of the same name to "get it back." Move on to another setup or close the platform.
5. **On earnings, always hedge** — if you have 10 long contracts heading into earnings, buy at least 2 puts for protection. Never go full-size through an earnings announcement.
6. **If you lose 2-3 trades in a row, step back** — ask yourself: Am I forcing it? Am I seeing the game correctly? Am I revenge trading? Don't trade the next setup until you've honestly answered these.
7. **Trader constitution** — "My edge is discipline. My weapon is patience. My shield is risk management. I protect my capital. I protect my mind. I play the long game."

## Position sizing — what WT actually does vs. what he preaches

**What he preaches:** "Some traders risk 1% per trade, some 2%. Never let a single trade be more than 40-50% of your account."

**What he actually does:** His biggest single trade was a $768K NVDA call — approximately 30% of his account at the time. His 25-30 option positions are typically concentrated in tech megacaps. He is NOT risking 1-2% per trade. His real position sizing is closer to "bet big on high conviction plays, take profit at 100%, let the rest run."

**For Mike's $1K account:** stick with 1% equity / 3% crypto. WT's 40-50% cap is a ceiling, not a target. The scanner's existing position limits are already conservative relative to his stated rule and MUCH more conservative than his actual behavior. Don't "upgrade" to WT's style — his style requires a $2M+ account to survive the losses his approach generates.

### Specific risk limits to maintain (already in Mike's system)

- **1% equity risk per trade** — well below WT's "some say 1-2%"
- **3% crypto risk per trade** — accounts for higher volatility
- **10% position cap** — below WT's 40-50% ceiling
- **10% daily loss halt** — reasonable, WT has no analog but would agree with the principle
- **20% weekly loss halt** — reasonable floor
- **50% kill switch** — WT's "10-10-10" rule implies this is the right exit point for a paper experiment

## Stop losses — the nuanced take

WT's stop-loss position is more sophisticated than the typical "always use a stop" advice:

1. **Stop losses don't work for overnight options.** If you hold an options position through an earnings miss, the gap-down hits before your stop can fire. Use partial profit-taking instead.
2. **Stops get "arm-robbed" by the market.** The market routinely pushes through stops just to take liquidity, then reverses. Place stops outside recent swing lows, not at obvious round numbers.
3. **Tight vs. loose stops** — if you're 45+ days from option expiration, you can use loose stops (more room to breathe). Inside the 30-day theta window, tighten stops because time is against you.
4. **Trailing stops are the preferred tool** — raise the stop as the trade moves in your favor. Lock in profits progressively.
5. **The best stop is a small position.** If you size your trade so that a 20% adverse move is still within your loss tolerance, you don't need a tight stop at all. Position sizing is the primary risk control; stops are the secondary safety net.

For Mike's equity system: GTC stops with Alpaca will fire at market open after a gap. That's not "broken" — it's expected. The real protection is the 10% daily halt and the 1% per-trade risk. Stops are a cleanup tool, not the primary defense.

## The 30/45 day options rule

From video 048 (Rolling an Options Play):

- **45+ days to expiration** — theta decay is slow. You have room for the trade to develop. Use loose stops.
- **30-45 days** — "yellow light" zone. Start actively managing the position. Consider partial profit-taking.
- **Under 30 days** — "red zone." Theta is "on top of you." Any adverse move takes a disproportionate chunk out of your P&L. Either take profit, cut loss, or roll to a later expiration.

Translation to Mike's equity mean-reversion system: RSI(2) / IBS positions typically resolve in 2-5 days. There is no theta decay. The analog rule is: if a position has been open >7 days and hasn't reverted as expected, the thesis is likely broken — exit at breakeven or small loss rather than waiting.

## Revenge trading — the psychology trap

WT spends more time on this than any other single topic. His framing:

- A loss triggers emotional override. You want to "get it back" on the same stock.
- Emotional trades have worse expectancy than planned trades. You're fighting the tape.
- The correct response is to close the platform, walk away, and come back with a fresh chart.
- Alternative: switch to a completely different stock and setup. If you can't let go of the loser, the market will let go of you.

For an automated scanner, this translates to: never manually re-enter a position the scanner has already closed at a loss on the same day. If RSI(2) fires again on the same name, the scanner will catch it. Don't override.

## Earnings management

From videos 136, 156, 085, and scattered throughout:

- WT's rule: never hold a full options position through earnings. Always hedge.
- He does hold equity positions through earnings (Eli Lilly, Nvidia, Meta) because the long-term thesis is intact.
- When NVDA had the Facebook-like post-earnings drop in May 2024, he "added a leg" — rolled to a lower strike at a longer expiry — rather than cutting the loss. This worked for him but relied on his conviction that the thesis was intact.

For Mike's equity system, this is largely not a concern — RSI(2) holding periods are short, and the universe is diversified enough that a single earnings blow-up won't break the portfolio. But if the scanner adds earnings-gating logic, WT's rule ("don't enter new positions in the 48 hours before earnings") is a reasonable default.

## Morning routine (video 156)

WT's pre-market prep:
- Up at 6 AM
- Prayer / quiet time until 7:30
- Game plan the market 7:30-9:00
- Market opens 9:30. If the morning was off, he doesn't trade.

The principle translates: don't enter new trades when your mental state is wrong. Don't trade distracted. Don't trade tired. For Mike's automated scanner, this doesn't matter — it runs on schedule. For any manual overrides, this rule absolutely applies.

## Knowing 20 companies vs. chasing 500

WT's concentrated universe approach:
- He watches 20 companies. Knows their charts, their earnings history, their catalysts.
- He doesn't trade anything outside those 20.
- Mastery > breadth.

Mike's 17-stock universe is already aligned with this principle. Don't let the universe creep past 25-30 names. The incremental edge from one more ticker is outweighed by the loss of familiarity.

## The scaling rule

"Don't get 2 contracts until you've mastered 1 contract. Don't get 3 until you've mastered 2."

Translation to Mike's position sizing: don't bump the per-trade risk from 1% to 2% until the current risk level has shown a full year of positive expectancy. Don't scale the account until the strategy proves. The $1K paper experiment is the correct starting point — resist the urge to scale prematurely.

## Things WT never talks about but should

1. **Kelly criterion** — no mention. His position sizing is vibes-based.
2. **Sharpe ratio** — no mention. He tracks total return, not risk-adjusted return.
3. **Max drawdown limits** — no explicit limit, just "don't blow your account."
4. **Correlation risk** — no mention. His portfolio is 80%+ tech, implicitly correlated.
5. **Tail hedging beyond puts-on-calls** — no VIX call strategies, no variance hedges, no systematic hedges.

These are not dealbreakers for Mike's system, because the scanner already handles most of them implicitly. But if the project expands to larger capital or longer holds, these become important.

## Source videos

- 046 XHqPcxogoCQ — The Ultimate Trading Checklist
- 048 HPnCLtM7HOk — How to Roll an Options Play
- 061 R4sptfFla94 — When to Sell in the Market
- 087 az8wU-iCxYw — Before Your Next Trade (pre-trade checklist deep dive)
- 095 eDTzPakGAjI — Stop Losses Are NOT Enough
- 136 -_Za9pTbcQ4 — Why Most Traders Fail (Trap Trade Commandments)
- 156 Ui-NNSJ7AzI — The Law Every Trader Breaks (morning routine, discipline)
