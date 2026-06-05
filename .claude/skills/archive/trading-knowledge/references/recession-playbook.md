# Recession / Drawdown Playbook

## Core principle

**Fear doesn't destroy wealth. It transfers it.** Drawdowns are the moments where positioning changes hands from retail (who sells at the bottom) to smart money (who accumulates). If you are in the wrong emotional state during a drawdown, you will transfer your wealth to someone else. The market-rises-76%-of-the-time statistic exists precisely because most participants are unable to hold through the 24% of the time it doesn't. WT has been repeatedly on the wrong side of this — he publicly lost $355K in 48 hours in March 2024 and $270K in one day in October 2025. Both times, he stayed invested and the positions recovered. The discipline is not to avoid drawdowns, it's to stay in the game.

## The VIX zone framework (useful, fold into regime classifier)

This is the most actionable thing WT teaches on drawdown management. The exact numbers are close enough to standard VIX regime literature to be usable.

| VIX level | Zone | What it means | Action |
|-----------|------|---------------|--------|
| 13-17 | Calm | Markets drifting up. Retail gets complacent, chases runups, forgets about risk. | Take profits. Raise cash. Don't chase. WT took $1.3M off the table on 30 option plays when VIX was at 13. |
| 18-22 | Profit-taking | Sellers entering. Usually news-driven. Not panic — institutions locking in gains. | Don't exit quality names. Mean reversion works here. Tighten stops on speculative positions. |
| 23-30 | Intense selling | Real fear. Retail pulling out. This is the classic 2-3% down day environment. | Scale in gradually. Do NOT go all in. Historically the 2 weeks after a 21% VIX spike in a single day yield a 2-3% gain. |
| 30-50 | Panic | Crash-level fear. Everyone wants out. | Maximum accumulation zone for quality names. Largest WT option wins (AVGO 700% return) came from VIX > 60 buying. |
| 50+ | Pandemic/crisis | Once-a-decade opportunity. | Lifetime cost basis moments. NVDA at $83 in Feb 2025 is the recent example WT points to. |

Fold this into `regime_classifier.py`. The 18-22 zone is where RSI(2) mean reversion should be MOST active (sellers entered, quality names oversold, bounce probable). The 23-30 zone is where you scale back position size but don't stop entering — this is the most important regime distinction for a mean-reversion system.

## What WT actually does during a drawdown

From the PL1 recession series + video 145:

1. **Does not exit core positions.** Buy-and-hold positions in Costco, FICO, Eli Lilly, Nvidia, Meta, Palantir stay through drawdowns. He shows them in every weekly portfolio update.
2. **Does not blindly add to losers.** He distinguishes between adding a leg (same underlying, new strike/expiry matching the current price) and averaging down a broken thesis. If the story changed, he cuts.
3. **Rotates into critical resources.** His drawdown thesis: "smart money rotates out of overbought growth into critical resources." He bought rare-earth miners (USAR, MP), gold ETFs (IAUM, GDX, GDXJ), silver ETFs (SLV, SIVR, SIL, AGQ) during the October 2025 tariff drawdown.
4. **Rolls options outward, not downward.** When an option play is down but the underlying thesis is intact, he rolls to a later expiration to buy time. This "offsets" the loss into a new contract rather than avoiding it. This is a real technique, not avoidance — a loss is still a loss, it's just re-timed.
5. **Partial profit-taking on green days.** On every portfolio update, he sells half of any position up 100%. The other half runs on house money. This mechanically locks in gains ahead of drawdowns.

## The "10-10-10" loss-tolerance rule

> To make $100K you have to be willing to lose $10K. To make $1M you have to be willing to lose $100K. To make $10M you have to lose $1M. — Armor of Wealth (062)

This is just "risk 10% to aim for 100%" wrapped in street language. As a formal rule it's wrong (no competent trader risks 10% per trade), but as a loss-tolerance floor for an annualized drawdown it's roughly right. For Mike's $1K paper account, it maps to: be willing to see the account go to $900 (-10%) without panicking, $800 (-20%) without restructuring, $500 (-50%) before the kill switch trips. That matches Mike's existing halt levels (10% daily, 20% weekly, 50% kill-switch) almost exactly. It's not new information, but it's useful confirmation that the halt levels are in the right zone for an experimental account.

## What to buy when everything is falling

WT's specific suggestions during drawdowns (from videos 075, 145, 147):

- **Gold ETFs as hedge:** IAUM (pure gold tracker, 0.09% expense), GDX (miners), GDXJ (junior miners, higher beta).
- **Silver ETFs for leveraged exposure:** SLV, SIVR, SIL (miners), AGQ (2x leveraged — dangerous, use small).
- **Rare earths during geopolitical escalation:** USAR, MP, LYSDY (rare, earth-only ETFs).
- **"The Armor of Wealth" portfolio bucket:** 80% core quality names + 20% commodities/hedges.

Important: these were specific to the VIX 23-30 tariff-escalation regime of late 2025. They are not evergreen. The *principle* — rotate a small slice of the portfolio into uncorrelated hard assets when volatility spikes — is sound. The *specific tickers* need to be re-verified.

## Bond market as the hidden signal

From video cbfcGSAxOL8:

- Bond market ($53T) > stock market ($46T). Bonds are the real signal.
- When the 10-year yield spikes above 4.5-4.8%, mortgages, car loans, credit cards, and corporate borrowing costs all rise. Growth slows. Markets fall.
- Foreign buyers (Japan, China) selling Treasuries is one of the biggest causes of yield spikes. Watch for Treasury auction demand as an early indicator.
- Trump's 90-day tariff pause in April 2025 was forced by the 10-year hitting 4.6% — serving the $37T debt became unaffordable.

For Mike's system: a rising 10-year yield is a leading indicator of equity pain. The `regime_classifier.py` should consider including 10Y-yield delta as a secondary regime input alongside VIX.

## Things WT says NOT to do in a drawdown

- **Do not rely on stop losses overnight.** Stop orders don't trigger after hours. A position can gap down 15% on an earnings miss, and your stop will fire at the open — after the damage. Use smaller position sizes and partial profit-taking instead of relying on stops. (This applies narrowly to options; for Mike's equity positions with GTC stops on Alpaca, the risk is reduced but not eliminated — overnight gaps still hit at market open.)
- **Do not revenge trade.** Losing a trade and immediately flipping to short the same name to "get it back" is the fastest way to compound losses. Walk away for an hour.
- **Do not blow your account on one trade.** WT's hard rule: no single trade > 40-50% of account. For Mike's $1K account and 1% equity risk rule, this is already far below the ceiling.
- **Do not predict the bottom.** "Only one man in history predicted the bottom." Scale in gradually through a drawdown rather than trying to nail the low.

## When WT got this wrong

In March 2024 he took a $355K two-day loss and *still added contracts* to a NVDA call. That specific trade did work out (NVDA ran to $1000+), but the methodology — adding to a position mid-drawdown without a fresh signal — is selection bias. He only shows this story because it worked. The systematic approach (Mike's scanner firing on RSI(2) oversold after a drawdown) is the correct implementation of the same instinct, without the ego risk.

## Source videos

- 1 c_YBHjXyWK8 — My $350K Loss in 48 Hours
- 2 LSLNygslDok — Options Portfolio Inside
- 3 8yJZ6d09OE0 — Portfolio Update
- 4 7vRjPSXp6zc — Recession Portfolio Update 06.20.24
- 062 sw-p_a_Si_Y — The Armor of Wealth
- 066 4_4hpCDvpOU — Trump Pause / Market Pressure
- 067 cbfcGSAxOL8 — The Silent Market Indicator (VIX + bonds context)
- 075 -Cmgw3k6e0Q — The #1 Overlooked Investment in a Market Meltdown (silver)
- 116 NabrXtiSw6Q — Markets Bleeding S&P (drawdown chart read)
- 145 lzpeL-rQWmM — The Exact Watchlist For This Market (Oct 2025 post-drawdown)
