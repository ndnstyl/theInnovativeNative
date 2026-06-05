---
source: Ross Cameron / Warrior Trading — 7 strategy videos + warriortrading.com/strategy + 2025-Small-Account-Tool-Kit.pdf
pulled: 2026-04-15, refined 2026-04-16 from PDF
provenance: transcripts at /tmp/ytdl/warrior/ (DO NOT commit — IP); PDF at projects/033-ai-trading-system/ (gitignored); this file = distilled rules only
scope: 034-warrior-gap-and-go-sleeve (bifurcated $12,224 paper sleeve of 033 AI trading system)
complement_to: trading-knowledge/SKILL.md (WT Trapper swing/investor framework — different timescale, different instrument universe)
---

## 2026-04-16 refinements from Small Account Tool Kit PDF

The PDF tightens the original playlist's rules for small-account traders specifically. Net deltas:
- **Price**: $5–$10 (not $1–$20) — no intraday leverage under $5, and small accounts need enough per-share price that 100–500 shares = meaningful position
- **Relative volume**: ≥5× average (not 2×) — hard filter, strongest signal
- **% up today**: ≥10% already up (not 20% gap) — more entries, looser catalyst gate
- **Float** (regime-aware): <20M ideal in hot markets, <10M in cold markets
- **Entry window**: 07:00–11:00 ET (not 09:30–10:30) — covers pre-market + full morning
- **Patterns**: three explicit — Bull Flag, Flat Top, Micro-Pullback on Front Side
- **Exit invalidators**: MACD cross, decreasing volume, Jackknife rejection, VWAP break
- **Risk-per-trade** Cameron's spec: 5–10% of account (ours stays at conservative 2%)
- **Take-profit target** (new): 10% of account per trade = 2:1 R:R per PDF
- **Accuracy aim**: 75% (with winners 2× losers)
- **Kill rule** (tighter): 3 consecutive losers same day = done (added to our existing 3-losing-sessions rule)
- **Pre-trading checklist** (new, daily): market strength 1-10, trader state, obvious stock, hot/cold cycle

# Warrior / Cameron Framework — Low-Float Intraday Momentum

This is a distilled ruleset, not a transcript. Executable logic only, my own paraphrase.

## 1. Universe selection (applies to ALL strategies below)

**Hard filters — stock must pass all to enter the scanner:**
- Exchange: NASDAQ, NYSE, AMEX (explicitly exclude OTC / pink sheets)
- Price: `$1.00 <= close <= $20.00` (sweet spot $2–$10)
- Float: `<30M shares` (ideal `<20M`, elite `<5M`)
- Daily volume (current day by 9:30): `>= 1M` pre-market shares
- Relative volume: `>= 2.0` vs 30-day average (elite signal at `>= 5.0`)
- Catalyst present (see taxonomy §5)

**Reject filters:**
- Stocks `<$1` → manipulation prone
- Float `>100M` → moves too slowly for scalp strategy
- Active S-3 shelf registration + recent price spike → dilution risk
- Prior record of reverse splits + repeat offerings

## 2. Three executable setups

### A. Gap & Go (flagship)

- **Scanner additions:** overnight gap `>= 20%` (target 30%+); top-5 on morning gap list
- **Entry trigger:**
  - Break of pre-market high on 1-min candle with rising volume
  - OR red-to-green reversal that holds VWAP and retests pre-market high
- **Stop:** below opening-range low OR below VWAP, whichever is tighter (typical 1–3¢ risk per share)
- **Target:** scale out into next whole-dollar level; take partial on first $0.20–$0.40 gain; full exit by 10:00 ET or on 3rd pullback, whichever first
- **Time window:** `09:30–10:30 ET`. After 10:30 → degrade to B or exit
- **Invalidation:** close below VWAP, volume drops <50% of pre-market avg, halt fails to resume with continuation

### B. Bull Flag Continuation (paired with A, runs on same universe)

- **Pre-condition:** stock already had a strong ramp (flag pole) + consolidated 3–6 bars on 1-min chart
- **Entry trigger:** first green candle that makes a new high above the consolidation high, on volume ≥ prior consolidation bars
- **Stop:** low of the consolidation (entry bar low fallback)
- **Target:** 1st + 2nd pullback both valid; 3rd pullback = reduce 50%; 4th = exit
- **Time window:** `09:30–11:30 ET`. Noon+ flags unreliable.
- **Invalidation:** reversal doji / gravestone on high volume, move below 9-EMA, VWAP rejection

### C. Secondary-Offering Short (fade setup)

- **Trigger catalyst:** announced secondary offering, private placement, ATM, or direct offering on a stock that had a recent `>= 50%` spike
- **Entry:** short on first close below VWAP after the announcement pop fades
- **Stop:** above post-announcement high (account for reverse-split surprise risk — use 1/2 normal size)
- **Target:** offering price OR last strong support pre-spike, whichever nearer; scale out 50% at first $0.25 gain
- **Time window:** intraday same day as announcement; **never hold overnight** on offering-driven fades
- **Invalidation:** institutional absorption visible on L2 at support; new HOD despite offering news

## 3. Position sizing & risk (for a $12,224 bifurcated sleeve)

Sleeve = 25% of Alpaca paper cash on 2026-04-15 ($48,896.80 cash-free; $54,033 in BTC/ETH remains untouched).

| Rule | Cameron-scale ($25K) | Our $12,224 sleeve (×0.49) |
|---|---|---|
| Max risk per trade | $500 (2% of $25K) | **$244 (2%)** |
| Typical stop (¢/share) | 15–20¢ | Same |
| Share size — $5 stock, 15¢ stop | ~3,300 | **~1,600** |
| Share size — $10 stock, 20¢ stop | ~2,500 | **~1,200** |
| Daily loss circuit breaker | Give-back of 15–20% of morning gains | **Daily max loss $1,222 (10%), pause until next session** |
| Max concurrent positions | 1–2 | **1** (sleeve is narrow) |
| Max trades per day | 3–5 | **3** |
| Max notional per trade | ~25% of equity | **$3,056** |
| Give-back rule | Exit if up then down >20% from peak | Same |

Kill-switch gates (workflow halts sleeve trading — manual reset required):
- 3 consecutive losing sessions
- Drawdown `>= 30%` of sleeve (i.e., sleeve equity falls below $8,557)
- 10 trades in a row with <40% hit rate
- Any single trade loss `>= $400` (double the max-risk rule)

Ring-fence: NO open positions from this sleeve may borrow capital from the BTC/ETH long positions. Sleeve reconciles daily via `Trading Account Snapshots` table tagged `strategy_id=warrior_gap_and_go`.

## 4. Entry checklist (used by scanner → signal → order)

Every proposed entry must clear:
1. Universe filters all pass (§1)
2. Setup A/B/C pattern confirmed on 1-min chart
3. Volume on entry bar `> 1.5×` average of preceding 5 bars
4. Stop distance `<= 10¢`
5. Time inside setup's window (§2)
6. Catalyst tag resolved — no "no news" entries

Failing any → skip.

## 5. Catalyst taxonomy (what qualifies as a trade-worthy catalyst)

| Tier | Catalyst types | Typical gap | Reliability for setup A |
|---|---|---|---|
| **S** | FDA approval, clinical trial hit, SEC-approved product launch | 30–80% | Highest |
| **A** | Earnings beat + guidance raise, major contract win, patent issue | 15–40% | High |
| **B** | Sector rotation (macro news driving a theme), index addition | 10–25% | Medium |
| **C** | Bankruptcy emergence, activist filing, CEO change | 10–50% | Variable — high volatility both ways |
| **SHORT** | Secondary offering / private placement / ATM announcement | -10–-40% | Feeds setup C |
| **NOPE** | "No news, pure technicals" | <10% | Skip — low edge |

## 6. Level-2 tape signals (confirmation layer, not standalone)

Use L2 as entry confirmation, not as a primary trigger:
- **Hidden buyer at support:** large sell orders printing at a fixed price with minimal price movement → someone is absorbing. Interpret as institutional accumulation. Adds weight to a long entry on break above that level.
- **Big seller stepping away:** an ask-side wall that keeps refilling, then suddenly thins → break of that level can run fast.
- **Halt-and-resume:** after a 10%-in-5min halt, spreads widen dramatically. Wait for first clean trade at resumed price before sizing in.

## 7. What NOT to trade (explicit exclusions)

- OTC / pink sheet stocks
- Sub-$1 stocks
- Stocks with no catalyst
- Stocks after 12:00 ET for setup A (first-hour strategy)
- Overnight holds on setup C
- Setups where stop distance `> 3%` of entry price
- Any stock after 3 consecutive losing entries on it that day

## 8. Success gates before going live (paper → live graduation)

Bifurcated $250 sleeve stays on paper until ALL:
- `>= 40 trades` completed in paper window
- Win rate `>= 55%`
- Average R-multiple `>= 1.0`
- Sharpe (daily, annualized) `>= 1.0`
- Max drawdown `<= 30%`
- `0` rule violations on the entry checklist (§4)

Promote to live only after two consecutive 30-day windows meet all six.

## 9. Why this works with the PDT change (2026-04-15 SEC ruling)

- Minimum account for instant-settlement margin drops `$25K → $2K` in ~45 days
- Expected retail wave concentrating on exactly this universe (low-float gappers)
- Cameron himself plans to re-run small-account challenges day 1
- Our bifurcated sleeve front-runs detection of that wave — if it backtests well pre-rule, it should amplify post-rule

## Reference files
- Transcripts (local scratch, DO NOT commit): `/tmp/ytdl/warrior/*.txt`
- Public sources: warriortrading.com/strategy, /momentum-day-trading-strategy, /gap-and-go-definition-day-trading-terminology
