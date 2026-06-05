# Technical Signals

## Important caveat first

**WT does not use RSI, MACD, Bollinger Bands, Stochastics, or any oscillator across 50 videos.** Zero mentions. His entire technical toolkit is:

1. Candlestick pattern recognition
2. Support and resistance (horizontal lines, sometimes trend lines)
3. Multi-timeframe cascade (monthly → weekly → daily → 4h → 1h)
4. Supply and demand zones (the last candle before a major move)
5. Market structure (higher highs/lower lows, break of structure)
6. Volume confirmation (mentioned but rarely specified)
7. 50-day and 200-day moving averages (mentioned in passing, not used for entry)
8. VIX as a regime filter (zone framework — see recession playbook)

This is a purely discretionary price-action approach. It's incompatible with Mike's RSI(2) + IBS mean-reversion scanner as a signal generator — but many of his *confirmation* patterns can be used to filter scanner output. That's the right way to fold this into Mike's system: not as primary signals, but as manual overrides / sanity checks on discretionary calls.

## Candlestick reversal patterns (the usable content)

From videos 090, 138, 098, 100, 104, 085:

### At the top of an uptrend = bearish reversal candidates

- **Gravestone doji** — long upper wick, body at the bottom. Buyers pushed up, sellers slammed it back. Red version is strongest. **Highest probability reversal signal in WT's kit.** At a resistance level, he puts the probability at 80-85% for a reversal over the next few candles.
- **Shooting star** — similar to gravestone but with a small body. Same interpretation. Exit or short.
- **Bearish engulfing / outside bar** — a red candle that engulfs the previous green candle's range. Strong confirmation of trend reversal.

### At the bottom of a downtrend = bullish reversal candidates

- **Hammer** — long lower wick, small body at top. Sellers pushed down, buyers bought back aggressively. At a support level this is a strong bullish reversal.
- **Dragonfly doji** — hammer with essentially no body. Same interpretation, slightly weaker.
- **Long-leg bullish engulfing** — a large green candle that engulfs a previous red candle. Trend flip confirmation.

### Indecision candles (wait, don't act)
- **Standard doji** — open = close, small wicks. Indicates equilibrium. Never trade on the doji itself; wait for the next candle to confirm direction.
- **Spinning top** — small body with wicks on both sides. Same as doji, wait for confirmation.

**Key rule from WT (repeated 10+ times):** Always wait for the confirmation candle after a reversal signal. A doji followed by a green candle that opens above its high = buyers in control. A doji followed by a red candle that opens below its low = sellers in control.

### Mapping these to Mike's RSI(2) signals

RSI(2) < 10 + IBS < 0.2 is an oversold mean-reversion entry. If on that same day the daily candle is a hammer or dragonfly doji at a support level, the signal is confirmed by both systems. Conversely, if RSI(2) < 10 but the candle is still bleeding red with no bottoming pattern, that's a "knife catching" scenario — lower confidence entry. This could be an additional filter in `scan-evaluate.js`: require either oversold + bottoming candle OR oversold + above 200-day MA.

## Multi-timeframe cascade (the process)

From videos 085, 093, 156:

WT's standard process before entering any trade:
1. **Monthly chart** — confirm the long-term trend. If monthly is bearish and you're going long, stop. Don't fight the monthly.
2. **Weekly chart** — confirm intermediate trend. Look for support/resistance zones.
3. **Daily chart** — confirm setup. Primary entry timeframe for swing trades.
4. **4-hour chart** — fine-tune entry zone.
5. **1-hour chart** — final entry confirmation, wait for pattern.

**He explicitly warns against trading on 5-minute, 15-minute, or 1-minute charts unless you're day trading.** Most retail blows up on the lower timeframes because noise drowns out signal.

For Mike's system, this cascade translates to:
- The scanner fires on daily bars (correct)
- The weekly direction should be a filter: don't take RSI(2) longs when the weekly is in a clear downtrend (already implicit in the 200-day MA filter if used)
- The monthly is rarely decisive for a mean-reversion holding period (<5 days), but for longer holds it matters

## Support and resistance as zones

WT never uses a single price line. He uses *zones* — typically defined by:
- The wick of a recent high or low
- A historical price where multiple candles reversed
- A prior "break of structure" level (where the trend changed character)

He draws horizontal lines across these zones and treats the band between them as the support/resistance area. When price enters a support zone with a bullish candle, he buys. When price enters a resistance zone with a bearish candle, he sells or takes profit.

For Mike's scanner: if you wanted to add a support/resistance filter, a simple rolling 20-day high/low band would capture this. RSI(2) + IBS oversold near the lower band = higher-confidence entry. RSI(2) oversold in the middle of a range = standard entry. RSI(2) oversold after breaking through the lower band = "knife catching" — lower confidence.

## Market structure (break of structure)

From videos 085, 093, 095, 104:

- **Uptrend** = sequence of higher highs and higher lows. The highs "step on" the lows to go up — if the lows start falling, the uptrend is breaking.
- **Break of structure (BOS)** = a low breaks below the prior swing low, invalidating the uptrend.
- **Change of character (CHoCH)** = a smaller BOS within a larger trend — often the earliest reversal signal.
- **Downtrend** = lower highs and lower lows. Reverse logic for reversals.

Once structure breaks, expect an "impulse move" in the new direction, followed by a retracement, then the new trend continues. Don't short an uptrend until you see the BOS. Don't buy a downtrend until you see the BOS.

## Supply and demand zones

A "supply zone" is the last bullish candle before a big drop (the zone where supply overwhelmed demand). A "demand zone" is the last bearish candle before a big rally. When price returns to these zones, historical behavior often repeats.

Practical use: WT marks supply zones as red rectangles and demand zones as green rectangles on his charts. He enters long at demand zones after a bullish candle confirms. He takes profit or enters short at supply zones after a bearish candle confirms.

This is fancy language for "buy at support, sell at resistance." The rectangle vs. line distinction doesn't matter mechanically.

## 50-day and 200-day moving averages

WT mentions these in passing but doesn't use them for entries. His one concrete statement (video 044): **"If you can get a stock on its 200-day moving average, that's good."** That's it. No crossover system, no ADX, no trend-following entries.

For Mike's system, the 200-day MA is a well-established long-term filter. Restricting RSI(2) longs to names trading above the 200-day MA is a standard enhancement that's been shown to improve risk-adjusted returns on mean reversion systems (see Larry Connors' original RSI(2) research). WT's passing mention aligns with this.

## Volume

WT says "match that with volume" occasionally but never gives a specific rule. The implied rule: a reversal candle on high volume is more credible than one on low volume. For Mike's scanner, this is already partially captured by the liquidity gates (universe is large-cap).

## Pre-market trading and overnight gaps

From video 095 and his scattered comments:
- Stop losses don't work after-hours for options. For equities, GTC stops DO work at market open, but they fire at the *opening price*, which can be far from the stop level after a gap.
- WT's solution: take partial profits on runups so your position is smaller before overnight risk.
- Don't hold full-size option positions through earnings unless you buy some downside protection (a put against your call, 1 for every 5 calls).

For Mike's equity system, overnight gap risk is real but bounded — the 10% daily halt will catch extreme gaps. The critical design decision is whether to hold mean-reversion entries overnight or close them intraday. RSI(2) systems traditionally hold 2-5 days, which means overnight exposure is inherent. Accept and size accordingly.

## Where WT's technicals are weak for Mike's use case

1. **No backtestable rules.** Every pattern is "wait for confirmation" and "use judgment." Can't automate.
2. **No quantified edge.** Never publishes hit rate on specific candle patterns. Academic research suggests most single-candle patterns are at best marginal edges (50-55% win rate) when backtested rigorously.
3. **Bias toward narrative.** When a pattern "works," it gets highlighted. Failures are memory-holed.
4. **Ignores statistical indicators entirely.** RSI, MACD, BB, VWAP, ATR, ADX — none of it. This is a blind spot, not a style choice.

## What to actually fold into the scanner

1. **Doji/hammer at support as an additional confidence tag.** When RSI(2) + IBS fires, check if the daily candle has a lower wick >50% of the range. Tag as "higher confidence entry."
2. **BOS check.** Before taking a long, verify the weekly hasn't made a lower low within the last 4 weeks. If it has, the weekly trend has broken — skip the mean-reversion entry.
3. **200-day MA filter (already standard).** Only take longs above the 200-day.
4. **VIX regime gate** (from recession playbook, but lives here too) — scale down position size in VIX 18-22, scale back up in VIX 23-30 if the name is in Mike's quality universe.
5. **Economic calendar gate.** Don't take new entries on CPI/PPI/FOMC days. This is WT's explicit rule and it's good — the noise-to-signal ratio on those days is terrible.

## Source videos

- 085 xnaJi1jjgCY — Sold 80% of My Nvidia (multi-timeframe NVDA chart read)
- 090 hi00Rf-4e84 — Candlestick Patterns
- 093 JzrO5wU9nG8 — Market Structure Under 40min (PLTR)
- 095 eDTzPakGAjI — Stop Losses Are NOT Enough (structure + BOS)
- 098 zw2NpWgaLm0 — Chart Trend Shift
- 100 1eZEJy5BUgY — PANW Strike Price Chart Breakdown
- 104 VSRF-iG08ko — You Missed THIS on the Chart (CHoCH)
- 138 zDfxBX38WZc — Reversal Buy/Sell Setup (best single candlestick reference)
