# The AI ↔ Car Glossary

**Canonical reference**: every analogy, metaphor, or punchline in TIN content should pull from this. Built with Mike (classic-car guy), iterated 2026-05-25. Living document.

**How to use**: when explaining an AI concept to a client, find its automotive parallel here. Mike already speaks car. Clients respond to it. This is the shared vocabulary.

---

## SECTION 1 — Core component map

### Mechanical / structural layer

| Car | AI | Why |
|-----|-----|-----|
| **Engine** | LLM (Claude, GPT, Gemini) | Generates power. Swappable. Different engines for different jobs. |
| **Chassis / Frame** | Foundation (IDE + base platform) | Holds everything together. Hard to change later. |
| **Drivetrain** | Orchestration (subagents + n8n + tool-using agents) | Translates engine power into useful work at the wheels. |
| **Suspension** | Error handling + retries + circuit breakers | Absorbs shock so the system doesn't break under load. |
| **Brakes** | Hard rules + hooks ("NEVER do X") | Stops bad things from happening. |
| **Tires (contact patch)** | Tools (the AI's interface to the world) | Where rubber meets road. Wrong tires = wrong performance. |
| **Steering** | User intent / directives | Where you point it. |
| **Differential** | Load balancing across subagents | Distributes power left/right based on conditions. |

### Electrical / control layer (the wiring harness fix)

| Car | AI | Why |
|-----|-----|-----|
| **Wiring harness** | Hooks + MCP + tool routing | Communication backbone. Without it, every module is deaf. |
| **ECU** | The agent / orchestrator | Reads sensors, interprets, sends commands. |
| **PCM / PCU** | Top-level orchestrator agent | Manages multiple subagents (engine + trans in concert). |
| **TCM** | Workflow controller (n8n) | When to call what subagent — the gearing logic. |
| **BCM** | UI / surface layer | Doors, locks, lights — user-facing things. |
| **Sensors** | Telemetry + instrumentation | Token budget, skill usage, OB1 access counters. |
| **Dashboard** | Bloat dashboard + monitoring | Speed (throughput), RPM (request rate), oil pressure (system health), engine temp (rate-limit headroom). |
| **OBD-II port + DTCs** | OB1 + outcome logging | Plug in, read codes, find the problem. |
| **Fuse box** | Permission system + circuit breakers | Stops one bad component from frying the whole system. |
| **CAN bus** | Inter-agent message passing | The signal-level protocol everything else rides on. |

### Fuel + maintenance

| Car | AI |
|-----|-----|
| **Fuel (or battery)** | Tokens / API budget |
| **Octane rating** | Model tier (Opus vs Sonnet vs Haiku) |
| **Oil + filter** | Memory cull + hygiene scripts |
| **Coolant** | Rate-limit / quota headroom |
| **Air filter** | Context retrieval quality (RAG cleanliness) |
| **Spark plugs** | Prompts (replace periodically, wrong gap = misfires) |
| **Timing belt** | Cron jobs (the thing that snaps and ruins the engine if neglected) |
| **Brake fluid** | Hook config audit |
| **Transmission fluid** | Workflow lubrication — orchestration health |
| **Wiper fluid** | Logging clarity (small thing, breaks visibility when empty) |

---

## SECTION 2 — Subsystem deep dives

### Cooling system (= rate management & thermal headroom)

| Car part | AI parallel | Failure mode |
|----------|-------------|--------------|
| Radiator | External heat exchange — queue depth + offload | Block radiator = hard rate-limit hit |
| Water pump | Active circulation — the orchestrator's pacing logic | Pump fails = stalls under load |
| Thermostat | Auto-scaling threshold — opens when hot | Stuck closed = overheats fast |
| Fan | Emergency cooling — kill switch / manual throttle | Won't trigger = sustained meltdown |
| Coolant | Token budget itself — the medium being consumed | Low coolant = degraded performance, eventually failure |
| Overflow tank | Buffer / queue / pending work area | Overflow keeps spilling = sustained overcommit |

**Punchline**: An LLM under sustained load without rate management is an engine without a cooling system. Looks fine in short bursts. Melts pistons under real work.

### Ignition system (= prompt engineering)

| Car part | AI parallel | Failure mode |
|----------|-------------|--------------|
| Battery | Persistent state / memory | Dead battery = cold start every session, no context carryover |
| Starter motor | Context priming / OB1 inject hook | Won't engage = session starts from zero |
| Alternator | Continuous regeneration — recursive learning loop | Dead alt = battery dies after one trip, no compounding |
| Spark plugs | Prompts (one per cylinder per cycle) | Wrong gap, wrong heat range = misfires, fouled outputs |
| Distributor / coil | Prompt routing — which subagent fires when | Bad coil = inconsistent ignition, agents skip turns |
| Timing | Prompt scheduling vs data availability | Off-timing = the cylinder fires before fuel is ready |

**Punchline**: Most "the AI isn't working" complaints are actually ignition problems. The engine's fine. The prompts are fouled.

### Fuel delivery (= context + tokens + prompt density)

| Car part | AI parallel | Failure mode |
|----------|-------------|--------------|
| Fuel tank | Monthly token quota | Run dry mid-session = abrupt failure |
| Fuel pump | The API call mechanism | Weak pump = slow throughput |
| Fuel filter | Input sanitization | Clogged = degraded output gradually |
| Fuel injector | How prompts are delivered to the model | Bad spray pattern = inconsistent results |
| Fuel rail | MCP / tool routing manifold | Leak = wasted tokens, dangerous fumes (security risk) |
| Fuel pressure regulator | Rate limiting | Stuck = either lean (starves engine) or rich (floods + wastes) |
| Air-fuel mixture | Context-to-instruction ratio | Too lean = AI guesses, too rich = burning tokens for no payoff |

**Punchline**: The air-fuel ratio IS prompt engineering. Lean is starvation. Rich is waste. The narrow stoichiometric band in the middle is where the engine actually makes power.

### Transmission types (= orchestration patterns)

| Trans type | AI orchestration parallel | Best for |
|-----------|---------------------------|----------|
| **Manual (stick shift)** | Direct user control over every step | Power users, technical workflows, hand-crafted prompts |
| **Automatic (slushbox)** | Traditional automation deciding for you (n8n auto-decisions) | Production at volume, less control |
| **CVT (continuously variable)** | Adaptive AI continuously adjusting | Daily-driver use, balanced load |
| **Dual-clutch (DCT)** | Agentic with pre-staged next-step options | High-performance + responsiveness |
| **Single-speed (EV)** | Direct LLM-to-output, no orchestration | Simplest case, low-latency single tasks |
| **Sequential** | Strict step ordering, no skipping | Compliance-heavy / audit-heavy workflows |

**Punchline**: How much transmission you need depends on the road. Highway cruising? Auto's fine. Track day? Manual or DCT. Stop-and-go traffic? CVT eats it for breakfast.

---

## SECTION 3 — Tuning philosophy (= AI maturity stages)

The progression every business goes through with AI infrastructure.

| Tune state | AI state | Investment level | Risk |
|-----------|----------|-----------------|------|
| **Factory tune** | Stock ChatGPT / Claude with default prompts | $20/seat | Conservative output, never embarrassing, never amazing |
| **Chip / canned tune** | Pre-built skill packs (marketplace skills) | Few hundred $ | Generic to your situation, ceiling lower than custom |
| **Piggyback ECU** | Zapier / no-code AI layer on top of existing system | $50-500/mo | Limited authority, can't override base behavior |
| **Standalone ECU** | Custom AI infrastructure from scratch (Claude Code + hooks + memory) | Real engineering time | Full authority, requires expertise to maintain |
| **Dyno tuning** | Iterative refinement based on measured output (recursive learning loop) | Ongoing | Compounds over time |
| **Race tune vs street tune** | Specialist agent vs general-purpose assistant | Choose one per use case | Race tune = unusable as daily driver |

**Pro tip**: Most owners over-tune the wrong things first. A factory ECU + good fuel + tires beats a half-finished standalone every time. Tune AFTER you've measured what's actually limiting you.

**Anti-pattern**: bolting a $5K turbo on a stock 1.4L economy motor with stock internals. Adding "AI" to a fundamentally broken business workflow gets you the same result.

---

## SECTION 4 — Maintenance schedule (= cron cadence)

| Mileage / interval | Car service | AI parallel |
|--------------------|-------------|-------------|
| Pre-trip walk-around | Visual check, tire pressure | Daily Stop-hook token-budget log |
| Every drive | Dashboard glance | Daily bloat-dashboard digest |
| Every 3,000-5,000 mi | Oil + filter change | Weekly memory cull (`cull-memory.sh`) |
| Every 5,000-7,500 mi | Tire rotation | Weekly skill-usage review |
| Every 15,000 mi | Air filter, brake check | Monthly context-retrieval quality audit |
| Every 30,000 mi | Trans fluid, spark plugs, coolant flush | Quarterly prompt refresh + hook audit |
| Every 60,000 mi | Timing belt, water pump (major service) | Annual full harness audit + cron review |
| 100,000 mi | Engine teardown / honest assessment | Consider model upgrade or stack pivot |
| Annual safety inspection | State-mandated check | Compliance + security review |
| Pre-track-day | Full safety inspection, fluids, brakes | Pre-launch checklist before major automation deploy |

**Pro tip**: Most owners skip the cheap stuff (oil) and pay for the expensive stuff later (engine rebuild). Same with AI — skip memory cull and skill archive, pay for the API overage and the rebuilt context architecture.

---

## SECTION 5 — Racing class analogies (= LLM augmentation strategies)

| Build class | AI parallel | Trade-off |
|-------------|-------------|-----------|
| **NA (naturally aspirated)** | Vanilla LLM, no augmentation | Predictable, honest, performance ceiling is real |
| **Forced induction (turbo)** | RAG — pumps more context per cycle | Way more power, adds heat + complexity |
| **Forced induction (supercharger)** | Always-on context injection | Instant response, no lag, costs fuel constantly |
| **Nitrous oxide** | Expensive parallel tool-use bursts | Massive temporary boost, can blow the engine if abused |
| **Hybrid (gas + electric)** | LLM + deterministic code (Python helpers) | Best of both, extra weight |
| **All-electric** | Newest frontier models needing less scaffolding | Inherently capable, depends on charging (API) network |
| **Spec class** | Standardized AI deployment across team | Predictable, comparable, less room for differentiation |
| **Unlimited class** | Custom-everything AI build | Whatever wins is allowed, weird builds emerge |

**Pro tip**: Class restrictions exist for a reason. Your industry's compliance regime determines what mods are allowed. A healthcare AI can't run nitrous (unbounded tool use). A financial AI can't skip the catalytic converter (auditability).

**Punchline**: People who don't understand class rules show up to autocross in a Hellcat and wonder why they finish dead last. The car's not the problem. They picked the wrong event.

---

## SECTION 6 — Common owner mistakes (= AI anti-patterns)

| Owner mistake | AI parallel | Fix |
|---------------|-------------|-----|
| **Over-tuning a stock motor** | Adding heavy custom prompts/hooks on a basic setup the foundation can't handle | Audit foundation before tuning harder |
| **Wrong octane fuel** | Wrong model tier for the job (Opus on triage, Haiku on reasoning) | Match model to task |
| **Deferred maintenance** | Ignoring memory cull, skill archive, OB1 hygiene | The hygiene scripts in this stack |
| **Mismatched mods** | Bolting on AI tools from incompatible vendors (don't talk to each other) | Unified communication layer (MCP) |
| **Skipping the dyno** | No measurement, just adding more | Instrument before optimizing |
| **Badge engineering** | Relabeling a Camry as a Lexus — slapping "AI-powered" on the same product | Real architectural change, not branding |
| **Not breaking it in** | Launching at full throttle on a fresh build (deploying complex agents before basics) | Heat cycle the build — soft launch, measure, scale |
| **Ignoring the dashboard** | Warning lights ON, driver ignoring them | The token budget alert IS the check-engine light |
| **Overheating** | Sustained high load with no thermal management | Rate limits + queue depth control |
| **Garage queen** | Building elaborate AI you never actually use | The 92% unused skills problem |
| **Aftermarket without integration** | Bolted parts that don't talk to the ECU | Hooks + MCP + tested integration |
| **Cheap parts on critical systems** | Free-tier APIs on production decisions | Spend where reliability matters |

**Punchline**: Most owners think the engine is the problem. It rarely is. The engine is the most expensive, most reliable, most-engineered part of the car. The problems live in cooling, ignition, fuel, and maintenance — the boring parts they ignored.

---

## SECTION 7 — Driving philosophy (= work patterns the AI is built for)

| Driving discipline | AI work pattern | Stack implications |
|--------------------|-----------------|-------------------|
| **Autocross** | Short, intense, high-precision technical sessions | Deep agent dives, complex single problems |
| **Road racing / circuit** | Sustained performance over time | Production AI running daily, durability matters |
| **Drag racing** | Single all-out burst | One-shot use cases, generate-and-go |
| **Rally** | Adapting to unknown terrain | Research, exploratory work, ambiguous inputs |
| **Touring / road trip** | Long-haul reliability | Multi-hour agentic workflows |
| **Off-roading** | Improvised navigation, low-speed/high-traction | Manual oversight + AI assist for messy domains |
| **Daily commute** | Mundane reliable usage | Email triage, calendar, the boring stuff |
| **Cruise night** | AI you show off but barely drive | Demo skills, marketing content |
| **Track day** | Controlled experimentation | Sandbox sessions, new agent configs |
| **Bracket racing** | Consistent output > peak performance | Where reliability beats best-case |
| **Cannonball Run** | Cross-country at max efficiency | Long agentic chains optimizing for total throughput |

**Pro tip**: Pick the discipline before you build the car. A drag car is a terrible daily driver. A daily driver embarrasses itself at the track. Most AI failures are categorical mismatches — building a touring car for a drag application.

---

## SECTION 8 — Vehicle archetypes (= business types)

Each business is a vehicle. The AI harness has to match.

| Vehicle | Business type | Harness implications |
|---------|---------------|---------------------|
| **Race car** (F1 / NASCAR / drag) | Performance-first B2C, speed-to-revenue | Massive parallelization, throughput > breadth, pit crew (specialist support) needed |
| **Off-road / overland** (Wrangler / Bronco / Land Cruiser) | Durable biz, weathers downturns, long-haul | Deterministic + fault-tolerant, batched, slow but rock-solid |
| **Drift car** (Silvia / AE86 / GR86) | Agile mid-market, controlled chaos, pivots fast | RWD bias = action over deliberation, hand brake = manual override gate, wide capability per agent |
| **EV** (Tesla / Rivian / Lucid) | Modern AI-native business, software-defined | Smaller engine + instant torque, regen = recursive learning capture |
| **Economy car** (Civic / Corolla) | SMB / bootstrapped | Cost-per-mile is everything, smaller models, fewer integrations |
| **Luxury** (S-Class / 7-Series) | Enterprise, deep pockets, slow decisions | Comfort layer thick, redundancy heavy, support-staff-heavy |
| **Truck** (F-150 / Sierra) | Operations-heavy, towing + hauling | Bulk batch processing, capacity > elegance |
| **Show car / restomod** | Brand-driven, looks > performance | Content/design AI > operations AI, doesn't actually do much real work |
| **Hot rod (60s muscle restomod)** | Legacy business with modern AI retrofitted | Classic body, modern drivetrain — likely sweet spot for many client engagements |
| **JDM tuner build** | Tight-margin precision business | Lots of small mods compounding, owner is technical |
| **Diesel work truck** | Heavy-duty operations | Massive torque (throughput) over horsepower (latency) |
| **Vintage daily driver** | Old-line business modernizing slowly | Minimum viable hooks, can't tolerate downtime |

### Build-state archetypes (where the business IS today)

| State | Meaning |
|-------|---------|
| **Stock** | AI out-of-the-box — just ChatGPT, no harness |
| **Mild build** | Basic memory + a few hooks |
| **Full build** | Custom everything (our stack) |
| **Restomod** | Legacy biz + modern AI retrofit |
| **Garage queen** | Elaborate AI you never use (92% unused skills) |
| **Daily driver** | Production AI running every day |
| **Trailer queen** | AI used only for demos, never production |
| **Project car** | AI build that's been "almost done" for 18 months |

---

## SECTION 9 — Conversational punchlines (Mike's voice, ready to deploy)

Use these verbatim or as templates. Pure car energy.

- *On bolted-on AI*: "Most businesses bolt AI on the way amateurs bolt aftermarket parts onto a stock car: fast, mismatched, half the threads wrong, and a year later nothing lines up anymore. The engine is fine. The mount is the problem."
- *On hygiene*: "If Layers 1-6 are the car, Layer 7 is the oil change. Skip it and the whole thing seizes in 18 months."
- *On model swaps*: "Engines get swapped every 18 months. The frame is what you build once and refine forever."
- *On overspending*: "You don't fix lap times by buying a bigger engine. You fix them by tuning what's already there."
- *On clients adding tools*: "More mods doesn't mean more power. Usually it means more weight."
- *On metrics*: "The dashboard isn't decoration. The warning lights are there for a reason."
- *On the hygiene loop*: "You wouldn't go 30,000 miles between oil changes. Don't go 30 days between memory culls."
- *On vendor pitches*: "They're selling you nitrous when what you need is new spark plugs."
- *On enterprise complexity*: "A luxury sedan and a race car can't run the same tune. Different jobs, different mods."
- *On AI-native startups*: "EVs don't have spark plugs. They don't have a fuel pump. New engine architecture means new maintenance schedule. Don't apply 1965 logic to a 2026 platform."
- *On client maturity*: "First you learn to drive. Then you learn to maintain. Then you learn to tune. Most owners try to tune before they can maintain."
- *On premature optimization*: "Don't put racing fuel in a Camry. The engine doesn't know what to do with it."
- *On measurement*: "If it doesn't show up on the dashboard, it's not real."
- *On scope creep*: "Stock body, stock motor, stock everything, except the stereo? That's not a build. That's a $40K stereo."

---

## SECTION 10 — Pre-loaded client framings

When sizing up a client engagement, ask: **what kind of car are they building?**

1. **What are you driving today?** (Stock / mild / restomod / project car / garage queen)
2. **What kind of car do you want this to be?** (Race / off-road / drift / EV / economy / luxury / truck)
3. **What's broken right now?** (Engine / cooling / ignition / fuel / electrical / suspension / brakes / drivetrain)
4. **What's the maintenance schedule look like?** (Or is the oil black?)
5. **What's the dashboard telling you?** (Or is half the dash dark?)
6. **Daily driver or weekend toy?** (Production vs experimental)
7. **Stock fuel or premium?** (Model tier matching the workload)
8. **Who's doing the wrench work?** (In-house mechanic vs vendor garage)

The right opening with a client isn't "let's talk about your AI stack." It's "show me what you're driving and tell me where it hurts."

---

## How this updates

This file is canonical. As Mike refines mappings, edit here. The handout's metaphor system, the website copy, the client pitch decks, the LinkedIn carousels — all reference this single source.

Related memory: [[user_classic_cars]], [[user_mike_brand_voice]]
