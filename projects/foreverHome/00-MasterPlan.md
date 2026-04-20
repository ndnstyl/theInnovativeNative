# Forever Home — Master Plan

**Version**: Pass 1 (2026-04-15)
**Status**: Active planning, pre-acquisition
**Owner**: Mike

---

## Mission

Build a self-sustaining off-grid homestead for a family of 4 in Oklahoma or Texas within a $250K budget (stretch ceiling $312.5K). Achieve water, food, power, and shelter independence within 4 years. Create a legacy asset for two teenage daughters and extended family who may join later.

---

## Family Profile

| Person | Role |
|--------|------|
| Mike | Lead builder, primary labor, capital allocator |
| Wife | Co-decision, operations, family ops |
| Daughter 1 (teen) | Future labor contributor, needs own room, schooling considerations |
| Daughter 2 (teen) | Future labor contributor, needs own room, schooling considerations |

**Extended family**: Parallel eventual compound option noted in `ZeroPointPlan.md §12`. Not in scope for initial build — but site selection should not preclude future 2–4 family expansion.

---

## Hard Constraints (v2 — updated 2026-04-15 per Mike)

1. **$275K cash reserves = absolute cap**. No debt. No income tapped. Reserves only. If it doesn't fit, it doesn't happen.
2. **2-year phased build**. Business income continues to flow during build but is NOT part of the construction budget. Slower pace allows reserve replenishment naturally without dependency.
3. **90% DIY labor**. Mike executes everything except code-licensed work (well drilling, septic install, closed-cell spray foam, main service tie-in, grid-tie inspection).
4. **Travel trailer already owned** — interim housing handled. Family living costs during build are OUT OF SCOPE for this plan.
5. **Climate zones**: Oklahoma or Texas only.
6. **Minimum spec**: 3BR home (1200 sqft target, 1100 sqft floor), potable water, reliable power, year-round food production, storm shelter.
7. **Timeline**: Land Y0, shell dry-in Y1 Q2, occupancy by Y1 Q4, food systems Y2, optimization Y3+.
8. **Solo build**: Mike is primary labor. Hire crews only where safety or code demands it.
9. **Military installation = UNICORN**: parallel track, not in budget, not on critical path.

## Out-of-Scope (Mike handles separately)

- Family living situation during build (travel trailer + Mike's existing arrangements cover this)
- Healthcare + family opex during build (covered by ongoing income, not from the $275K)
- Schooling continuity for teens (Mike's call, not in this plan)
- Hidden costs in `97-HiddenCosts.md` — reference only; out of scope

## What's IN Scope (this plan)

- Land acquisition
- Water (well + cistern + rainwater)
- Septic + utilities
- Shelter (post-frame barndo shell + envelope + finish)
- Power (solar + battery)
- Food systems (aquaponics + agroforestry Y1 start + livestock Y2)
- Tools + equipment for ongoing operation
- Permits, insurance, professional fees for the build itself

---

## System Architecture (Dependencies)

```
       LAND (anchor — water rights, mineral rights, zoning, access)
          │
          ▼
       WATER (well + rainwater + greywater) — no water = no homestead
          │
          ▼
       SHELTER (net-zero envelope, family can't live in tent long)
          │
          ├──► POWER (solar + battery; can phase grid-tied→off)
          │
          ├──► SEPTIC / WASTE
          │
          └──► FOOD SYSTEMS
                 ├── Aquaponics (Y2, year-round protein + veg)
                 ├── Agroforestry (Y1 plant, Y6+ mature)
                 └── Livestock (Y3 sheep/poultry, later cattle)
```

No system works without the one above. Water before shelter. Shelter before food. This order is non-negotiable.

---

## State Decision — OK vs TX

Summary of the analysis in `Agroforestry System Design — Stigler, Ok.md` and research findings:

| Factor | OK | TX | Winner |
|--------|-----|-----|--------|
| Land $/ac (cheapest livable) | $2,260–$2,600 | $2,000–$5,000 (west arid) | OK |
| Rainfall (lean homestead needs 40"+) | 48–55" east | 48–52" east | Tie (east of both) |
| Groundwater rights | Domestic exemption, permit-free well | Rule of capture + GCD maybe | OK (cleaner) |
| Permit-free counties | Many rural | County-variable | OK |
| Ag exemption | Easier entry | Aggressive savings, 5-yr rollback | OK (safer exit) |
| Homestead tax exemption | 1 ac rural | 200 ac rural | TX |
| State income tax | Yes | None | TX |
| Sales tax | 4.5% | 6.25% | OK |
| Tilapia hobby legality | ODAFF license required | Recirc hobby exempt | TX |
| Tornado risk | High east | High north | Tie |
| Distance to Mike's existing network | Unknown (fill in) | Unknown (fill in) | TBD |

### Recommendation

**Primary: Eastern Oklahoma** — Haskell, Latimer, Le Flore, Pushmataha, McCurtain counties.
- Cheapest land with 48"+ rainfall
- Domestic well exempt from permit
- Many counties have zero residential building code enforcement
- Ag exemption straightforward with no rollback trap
- Stigler region already researched in agroforestry doc

**Plan B: East Texas** — Cherokee, Anderson, Wood counties.
- If a specific opportunity surfaces
- Tilapia legality cleaner
- No state income tax offsets higher sales/property burden over time
- Generous 200-acre homestead exemption

**Plan C (unicorn)**: North TX or OK parcel that happens to include or adjoin a decommissioned Atlas F silo. Realistic odds per-year: <5%.

---

## Budget Envelope — v2 DIY ($272K, inside $275K cap)

See `02-CostRollup.md` Scenario **B-Alt-DIY** for full line-item breakdown. Headline structure:

| Bucket | Cost | Notes |
|--------|------|-------|
| Land (25 ac @ $2,300/ac) | $57,500 | Eastern OK pastureland (Latimer / Haskell / Pushmataha) |
| Close + title + survey + permits | $5,200 | |
| Water (well + cistern + rainwater) | $18,000 | Driller contracted; cistern DIY |
| Septic aerobic (contracted) | $12,000 | Licensed required |
| Site prep (DIY w/ tractor + rental skid) | $6,000 | |
| Root cellar / storm shelter (DIY) | $5,500 | Dual-use cold storage |
| Foundation piers (DIY auger) | $3,500 | |
| Post-frame kit materials (1200 sqft) | $50,000 | Delivered only, erect DIY + 1-day crew |
| Truss-day crew | $3,000 | Safety-critical hire |
| Envelope (CCSF contracted + DIY rest) | $15,500 | Spray foam non-negotiable contract |
| Interior rough + finish (DIY) | $25,500 | Electrical, plumbing, HVAC, drywall, flooring, cabinets |
| Solar 6kW + 20kWh battery (DIY install + licensed tie-in) | $16,000 | Cheap with DIY |
| Appliances | $4,500 | |
| Aquaponics Tier 2 (DIY Y2) | $6,000 | |
| Perimeter fence + rotational (DIY) | $9,500 | 25-ac perimeter |
| Trees Y1 batch (DIY plant) | $4,000 | 60 trees + protection |
| Tractor (used 30hp + loader) | $15,000 | |
| Implements + tools | $10,000 | |
| Blower-door + HERS + engineer stamp | $3,000 | |
| Builder's risk insurance 24 mo | $4,000 | |
| Contingency 10% | $25,000 | Inside cap, not external |
| **TOTAL** | **$272,200** | **Inside $275K ✅** |

### What 90% DIY saves vs original Scenario B-Alt

| Category | Contracted cost | DIY cost | Savings |
|----------|----------------|----------|---------|
| Shell erection labor | $28,000 | $3,000 (truss-day only) | $25,000 |
| Foundation (pier DIY) | $6,500 | $3,500 | $3,000 |
| Site prep | $14,000 | $6,000 | $8,000 |
| Electrical | $7,000 | $4,500 | $2,500 |
| Plumbing | $6,000 | $3,500 | $2,500 |
| HVAC install | $9,000 | $5,500 | $3,500 |
| Solar install | $22,000 | $16,000 | $6,000 |
| Drywall + finish | $8,000 | $3,000 | $5,000 |
| Flooring | $5,000 | $3,500 | $1,500 |
| Fence | $13,500 | $9,500 | $4,000 |
| Cabinets | $7,000 | $5,000 | $2,000 |
| Other misc | — | — | $2,000 |
| **Total DIY savings** | — | — | **~$65,000** |

Without this DIY labor commitment, the plan doesn't fit. With it, you have $2.8K headroom inside the cap — contingency at 10% absorbs normal surprises.

### Fallback levers if $275K gets tight during build

If costs spike or an unexpected line hits, these are the agreed cuts — pre-committed so you don't debate under stress:

1. **Defer battery Y2** (keep solar grid-tied Y1; add battery with income replenishment) — saves $8,000
2. **Defer appliance tier** (stock used, upgrade Y3) — saves $2,000
3. **Scale land to 20 ac** (saves $11,500 vs 25 ac baseline)
4. **Cabinets stock-grade vs custom** (already in base at $5,000; can cut to $3,000) — saves $2,000
5. **Defer aquaponics Tier 2 to Y3 income-funded**, start Tier 1 ($3K) Y2 — saves $3,000

### Stretch (if reserves replenish Y1+ via income)

- Attached shop 600 sqft Y2: +$9,000 (DIY kit + erect)
- Second greenhouse / propagation house: +$3,500
- Pond 0.5-ac construction: +$6,500
- 20kWh battery if initially deferred: +$8,000

Funded from business income replenishing reserves over 24 months — not from the $275K pool.

---

## 4-Year Phased Rollout

### Year 0 — Q1–Q2: Land Hunt (6 months)
- County shortlist final (2 in OK, 1 in TX)
- Active MLS + LandWatch + direct-mail owners
- Title search mandatory before offer
- Water rights verify (OWRB or TX GCD)
- Mineral severance check
- Soil + flood plain + well logs from neighbors
- Make 5 offers, close 1

### Year 0 — Q3–Q4: Acquisition & Water (6 months)
- Close land
- Drill well (60–90 day lead time on drillers)
- Install pressure tank, temp power (generator or utility drop if close)
- Move RV or park trailer on pad — temporary base
- Begin clearing homesite + driveway
- Perimeter fence install
- Plant Y1 trees Nov/Dec (dormant season)

### Year 1: Shelter (12 months)
- Q1–Q2: foundation, envelope, rough MEP
- Q3: exterior finish, roof, insulation
- Q4: interior finish, move in by Christmas
- Solar + battery install parallel Q3
- Septic install Q2
- Agroforestry tree establishment continues

### Year 2: Food Systems (12 months)
- Q1: aquaponics greenhouse + system build
- Q2: first fingerlings stocked, plants transplanted
- Q3: first tilapia harvest
- Q3: sheep flock introduction (8–12 hair sheep)
- Q4: rotational grazing system locked in, poultry layer added
- Year 2 end: food self-sufficiency ~40% (fish, eggs, veg, lamb)

### Year 3–5: Optimization
- Scale aquaponics to full production (~200 lbs/yr fish)
- Add secondary greenhouse / propagation
- Cattle possible if 40+ ac
- Persimmon, mulberry, plum fruiting Y3–5
- Early pecan yield Y5–7
- Parallel: silo unicorn track active, not blocking

### Year 5+: Legacy
- Pecan full production Y10+
- Walnut timber Y25+
- Extended family compound expansion possible
- Teens adult; continue or cash out

---

## Known Unknowns (Pass 2 Research Priorities)

1. **Specific parcels** — run active MLS + off-market for 3 months
2. **Well depth / GPM per county** — driller quotes for shortlist counties
3. **Local builder network** — who will help an owner-builder in shortlist county
4. **Insurance** — tornado rider, remote-property fire (some insurers won't write rural OK)
5. **Schools** — nearest HS distance + quality for teens
6. **Internet** — Starlink confirm viable ($120/mo + $599 hardware)
7. **Healthcare** — nearest ER + primary care driving time
8. **Teen social fabric** — homeschool co-op availability, church community, youth activities
9. **Nursery sourcing** — OK Forestry Service sells bare-root pecans cheap; TX AgriLife equivalent
10. **Fingerling vendor** — line up Lakeway or Mineral Springs TN hatchery account

---

## Risk Register (summary — full in `06-EdgeCases.md` Pass 3)

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Tornado direct hit | Low | Catastrophic | Tornado shelter mandatory (root cellar doubles) |
| Ice storm 7+ days | High every 3–5 yrs | Severe | Wood stove backup, propane, battery critical loads |
| Well goes dry | Moderate | Severe | Rainwater backup, cistern sized for 60 days |
| Budget overrun >25% | High | Project-ending | Strict line-item tracking, contingency, phase-gate |
| Teen rejection of lifestyle | Real | Social | Involve early, preserve connectivity, HS + community |
| Medical emergency | Inevitable over 30 yrs | High | Helicopter / air ambulance insurance, first-aid training |
| Agroforestry species fail | Moderate | Medium | Plant multiple species, soil test first, tree tube all |
| Tilapia die-off | High Y1–2 | Medium | Redundant heat, O2, alerts (see tilapia doc) |
| Silo contamination surprise | 100% if bought | High | Phase 1 ESA mandatory, walk-away discipline |
| Divorce / family fracture | Real long term | Catastrophic | Spouse alignment before purchase, document roles |

---

## Decision Tree — Where to Start

```
Have $250K liquid + clean debt? 
  ├── No → pause, build capital first (outside scope)
  └── Yes ↓

Have 6 months runway for land hunt + 12 months for shelter?
  ├── No → phase: buy land, live in RV 2–3 yrs while building
  └── Yes ↓

Spouse fully aligned?
  ├── No → do not proceed until yes
  └── Yes ↓

Teens briefed + on board with rural life?
  ├── No → preserve urban tether (hybrid schooling, strong internet, drive-back-to-friends)
  └── Yes ↓

PROCEED: East OK land hunt phase.
```

---

## Document Index

| # | File | Status |
|---|------|--------|
| 00 | `00-MasterPlan.md` | Pass 1 + Pass 4 updates ✅ |
| — | `Agroforestry System Design — Stigler, Ok.md` | Pass 1 ✅ |
| — | `tilapiaAquaponicsGarden.md` | Pass 1 ✅ (rewritten from broken duplicate) |
| — | `ZeroPointPlan.md` | Pre-existing + Pass 2 addendum (Option E barndo) ✅ |
| — | `Decommissioned Missile Silos & Militar.md` | Pass 1 ✅ (rescoped OK/TX) |
| 01 | `01-LandAcquisition.md` | Pass 2 ✅ |
| 02 | `02-CostRollup.md` | Pass 2 ✅ (adding B-Alt Pass 4) |
| 03 | `03-SkillsMatrix.md` | Pass 2 ✅ |
| 04 | `04-ToolsEquipment.md` | Pass 2 ✅ |
| 08 | `08-BarndominiumOption.md` | Pass 2 addendum ✅ |
| 05 | `05-SystemIntegration.md` | Pass 3 ✅ |
| 06 | `06-EdgeCases.md` | Pass 3 ✅ |
| 07 | `07-PhasedRollout.md` | Pass 3 ✅ |
| 09 | `09-CompoundMVP.md` | Pass 5 ✅ (4-family on 10–14 ac carrying-capacity math) |
| 10 | `10-SasakwaEvaluation.md` | Pass 5 ✅ (13948 SH 56 specific due diligence) |
| 11 | `11-DueDiligenceQuestions.md` | Pass 5 ✅ (call script for Seth + OK vs NV/CA crash course) |
| 12 | `12-VerificationReport.md` | Pass 5 ✅ (high-confidence facts + corrections from deep research) |
| 13 | `13-LoanAcquisition-Playbook.md` | Pass 6 ✅ (USDA single-close + alternatives) |
| 14 | `14-NRCS-CostShare-Playbook.md` | Pass 7 ✅ (EQIP brush mgmt, fencing, ponds — fact-checked for OK/TX) |
| 15 | `15-Trust-LLC-Tax-Playbook.md` | Pass 8 ✅ (Buy personal → revocable trust → LLC operates, tax strategy, attorney/CPA directory) |
| 97 | `97-HiddenCosts.md` | Pass 4 ✅ |
| 98 | `98-RedTeam.md` | Pass 4 ✅ |
| 99 | `99-Checklist.md` | Pass 4 ✅ |
| 06 | `06-EdgeCases.md` | Pass 3 pending |
| 07 | `07-PhasedRollout.md` | Pass 3 pending |
| 99 | `99-Checklist.md` | Pass 4 pending |

---

## Version Log

- **Pass 1 (2026-04-15)**: initial MasterPlan; rewrote tilapia doc from broken duplicate; expanded agroforestry to OK+TX with regional species; rescoped silos to OK/TX unicorn status.
