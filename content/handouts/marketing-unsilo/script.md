# HOW TO UNF*CK YOUR DATA — MARKETING BLUEPRINT
## Long-form YouTube script

> **Target length**: 28-32 minutes
> **Format**: Talking head + Excalidraw screen share + B-roll inserts
> **Voice**: Direct, no-fluff. You've been in the room. You've seen the broken dashboards. You're not selling, you're naming what they already feel.
> **Title on thumbnail**: "HOW TO UNF*CK YOUR DATA — MARKETING BLUEPRINT"
> **Channel positioning**: This is your Marketing Operations cornerstone. Other videos branch off chapters.

---

## PRE-FLIGHT (before you hit record)

- [ ] PDF handout open in second monitor as your teleprompter spine
- [ ] Excalidraw open in browser, blank canvas, dark mode
- [ ] Scene specs from `excalidraw-scenes.md` ready
- [ ] Lower-third graphic for "Mike Soto / The Innovative Native / 20yr Operator" prepped
- [ ] End-card graphic with PDF download link + contact prepped
- [ ] Mic check, lights, no notifications

---

## [0:00 — 0:45]  COLD OPEN — THE 5 QUESTIONS

**Tone**: Direct. No music intro. Camera in tight. You're talking to one CMO who knows their dashboards are lying.

> "I'm going to ask you five questions. If you can't answer any of them in under sixty seconds, I want you to keep watching, because your Data is f*cked.
>
> Question one. What was your blended marketing efficiency ratio last week?
> Question two. What did one paying customer cost you last quarter, fully loaded?
> Question three. Which of your channels has the best contribution margin? Not ROAS. Margin.
> Question four. What's your CAC payback in months, broken out by acquisition source?
> Question five. Of the leads marketing handed to sales last month, what percent closed? And how does that number compare to what sales actually wrote down in the CRM?
>
> If any of those require a meeting, you don't have a measurement problem. You have a plumbing problem. And that plumbing problem is costing you clarity, and without clarity there is no growth.
>
> I'm Mike. I've spent nearly two decades inside marketing organizations cleaning this exact mess up. Today I'm going to help you think through how to unf*ck your data and make more money in a systematic way!"

🎬 **VISUAL**: Hard cut to title card.
🎨 **TITLE CARD**: Black background, cyan text: "HOW TO UNF*CK YOUR DATA — MARKETING BLUEPRINT", small magenta dot under the "T" in NATIVE on the bottom-right corner.

---

## [0:45 — 2:30]  WHY THIS EXISTS — THE IKEA STACK

**Tone**: Shift to grounded. You're explaining the pattern, not selling.

> "Here's what I've watched happen a hundred times.
>
> A department gets a budget bump. They buy a new tool. That tool gets used by one person, generates a report, gets cited in a leadership meeting. Six months later, that tool is still being paid for. Nobody knows who owns it. The data inside it disagrees with two other reports. And the next budget cycle, somebody buys another tool to fix that tool the company is still paying for that nobody uses. That isn't a solution, that's chaos and wasted spend.
>
> Most marketing stacks aren't designed. They're accumulated. Like IKEA furniture, built fast, with screws left over.
>
> The result is a stack where every team has its own version of the truth and every tool has its own definition of a customer. And then the CEO asks a simple question — what's our CAC by channel? — and three people go off and produce three different answers."

📋 **B-ROLL CUE**: Quick montage of CRM, Google Analytics, Stripe dashboard, Meta Ads Manager — sped up, overlapping.

> "This video isn't a vendor pitch. I'm not going to tell you to buy Segment or Snowflake or Triple Whale. I'm going to give you the diagnostic framework. So you can Identify what's actually broken. And the how to fix it. The caveat, every organization is different so I cannot give you exact specifics - but I will give real world examples I have faced.
>
> I'll cover four things.
>
> One — the silo map. How and why your data gets f*cked.
> Two — the nine metrics you cannot trust until you unify the stack.
> Three — the war between revenue operations and marketing that's probably happening in your company right now whether you see it or not.
> Four — the four phase blueprint to collapse all of it into one spine."

🎨 **LOWER THIRD**: "Mike Soto — The Innovative Native — 20yr Marketing Operator"

---

## [2:30 — 7:00]  CHAPTER 1 — THE STACK MAP

**Mode**: Screen share, Excalidraw.

> "Let's start with the map. I'm going to keep it simple and jump back in excalidraw and map out what your marketing stack looks like more or less. Not what your org chart says it looks like. The Chaos for what it is."

✏️ **DRAW NOW**: Excalidraw Scene 2 — The Stack Map (see `excalidraw-scenes.md`)

> "In the middle, one customer. One human. One purchase decision.
>
> Around that customer, the stack. Six functional zones.
>
> Paid media platforms. Meta, Google, LinkedIn, TikTok, X, Pinterest, Reddit. Each of them has its own conversion tracking, its own audience IDs, its own attribution window. None of them agree with each other. That's not an accident. They're not designed to agree.
>
> Web analytics. GA4, Mixpanel, Amplitude, Looker Studio. Each with its own event taxonomy, its own user ID system, its own sampling rules.
>
> CRM and marketing automation. HubSpot, Salesforce, Marketo, ActiveCampaign. Where leads live. Where lifecycle stages get defined. Where the handoff to sales happens or doesn't.
>
> Email and SMS. Klaviyo, Mailchimp, Postmark, Attentive. Open rates, click rates, revenue per send. Disconnected from everything else.
>
> Attribution and reporting. Hyros or Triple Whale, Northbeam, Rockerbox. Tools that exist because the platforms above can't be trusted. So you bought a tool to referee. Now you have a fourth opinion.
>
> And then the revenue layer. Stripe. Shopify. The actual money. The source of truth. Usually disconnected from every layer above."

✏️ **HIGHLIGHT**: Circle the customer in cyan. Draw red arrows from each zone pointing into the customer. Label the arrows: "thinks it knows them."

> "If you counted, that's roughly 24 different categories of tool a typical mid-market marketing org touches every week. Each one a silo. Each one telling a slightly different story about the same human in the middle.
>
> When your CMO asks 'how is the customer journey looking,' they are asking a question that requires data from all twenty-four of those boxes. And nothing in your stack connects them by default.
>
> Now you see why the numbers don't reconcile. It's not incompetence. It's architecture."

📋 **B-ROLL CUE**: Quick supercut of marketers tabbing through 10 different tools.

---

## [7:00 — 12:00]  CHAPTER 2 — THE BROKEN MATH

**Mode**: Back to camera, then Excalidraw for math.

> "Now I want to show you what happens to the math when you try to compute the metrics your CFO cares about across that broken architecture.
>
> Nine metrics. Let's start with the most important one. MER. Marketing Efficiency Ratio.
>
> The formula is dead simple. Total revenue divided by total marketing spend. If you spent a hundred grand and you made three hundred grand, your MER is three.
>
> But watch what happens to the inputs."

✏️ **DRAW NOW**: Excalidraw Scene 3 — MER Formula Breakdown

> "Revenue. Where does that number come from? Stripe? Shopify? Both? Are we including refunds? Chargebacks? Trial conversions or first-paid invoice?
>
> Spend. Are we counting just paid media? Or also tools? Or also salaries? Or also agency fees? Because each of those gives you a wildly different MER.
>
> Then there's ROAS by channel. This one's worse."

✏️ **DRAW NOW**: Excalidraw Scene 4 — ROAS Over-attribution

> "Watch this. A customer clicks a Meta ad. Then sees a Google retargeting ad. Then clicks a YouTube ad. Then buys. One conversion. One hundred dollars of revenue.
>
> Meta reports the conversion. They claim the hundred bucks.
> Google reports the conversion. They claim the hundred bucks.
> YouTube reports the conversion. They claim the hundred bucks.
>
> If you add up your channel-reported ROAS, you'll see three hundred dollars of revenue. From one hundred dollars of actual sale.
>
> That's a real thing. Two to three X over-attribution is the normal case. I've audited companies where the platforms collectively claimed credit for more revenue than the company actually made."

🎬 **VISUAL CUT**: Hold on the drawing for emphasis. Beat of silence.

> "Then CAC. Customer acquisition cost. Most companies report this as paid media spend divided by new customers. That's the easy version. The honest version includes salaries, tool costs, agency fees, sales compensation. The number triples. CFOs see one number. Marketing reports another. Both are technically correct. Neither is useful.
>
> LTV. Lifetime value. Requires three numbers from three different systems. ARPA from billing. Gross margin from finance. Average customer lifetime from product or customer success. Marketing rarely sees any of those.
>
> CAC payback. Months until a customer pays back their acquisition cost. This is the number that decides whether you can scale paid spend or whether you'll go broke trying. Three siloed inputs. Any one wrong and the payback is wrong.
>
> Contribution margin per channel. Revenue minus COGS minus variable marketing. Almost no marketing team can compute this honestly and being in marketing, I can tell you we are ALWAYS asked to. It requires unit economics-level revenue joined to channel attribution joined to cost data from other departments that often are never shared.
>
> Cohort retention. The percent of customers still active in month N. Lives in product or billing. Marketing usually only sees aggregate churn.
>
> MQL to SQL to Won. Marketing thinks it's eighteen percent. Sales says it's eleven. Both pulled from the same CRM. Different filters.
>
> And pipeline velocity. The formula that drives forecast accuracy. If your lifecycle stages drift, your forecast can drift by upwards of thirty percent.
>
> Nine metrics. Every one of them requires data that crosses silos. Every one of them is wrong by default until somebody does the plumbing work."

✏️ **CALLOUT TEXT TO PUT ON SCREEN**: "A number you can't reconcile to a billing record is a number you can't bet money on."

---

## [12:00 — 16:00]  CHAPTER 3 — THE KNIFE FIGHT

**Tone**: Personal. This is where you bring your years.

> "Now we get to the part nobody talks about openly. The fight between marketing and revenue operations.
>
> Most data fights in growth-stage companies aren't about tools. They're about definitions. And the two teams that own the most overlapping definitions are marketing and revenue ops. And they don't agree."

✏️ **DRAW NOW**: Excalidraw Scene 5 — The Definitions Knife Fight

> "Take one word. Lead.
>
> Marketing says a lead is anyone who filled out a form. Could be a competitor downloading your white paper. Could be a student. Marketing counts it.
>
> Revenue ops says a lead is anyone with a known company that matches your ideal customer profile. Forms without company data? Not a lead.
>
> Same word. Two different numbers. Both teams report up using that word. Leadership thinks they're hearing the same thing. They're not.
>
> MQL. Marketing says, score above X in HubSpot. Done. RevOps says, score plus fit plus recency, with manual SDR approval. Done. Two different MQL counts. Reported in the same dashboard. Nobody flags the conflict because nobody's looking for it.
>
> SQL. Marketing says, we passed it to sales. RevOps says, sales accepted and worked it. The difference between those two definitions is the gap where every 'why isn't sales working our leads' fight starts."

🎬 **VISUAL CUT**: Hard cut, lean forward, drop the math voice.

> "I've sat in those meetings. Both sides leave thinking the other side lied. They didn't lie. They were using different definitions for the same things."

✏️ **DRAW NOW**: Excalidraw Scene 6 — The 64% Gap

> "Here's what this costs in real money.
>
> Marketing reports twelve hundred MQLs in October. An eighteen percent MQL to SQL conversion rate. That's two hundred sixteen sales-ready leads.
>
> Revenue ops looks at the same October. Counts seventy-eight accepted SQLs. Total.
>
> Two hundred sixteen versus seventy-eight. That's a sixty-four percent gap. Six figures of headcount and spend optimized against the wrong number.
>
> The fix isn't a tool. The fix is a ninety-minute meeting. Marketing, RevOps, and Finance in one room. One signed definition per stage. Published. Linked from every dashboard. Disagreements end when the document does.
>
> If you remember nothing else from this video, remember this. Before you buy another tool, hold the definitions session. Most of the data pain in your org evaporates the day everyone is forced to use the same words."

📋 **B-ROLL CUE**: Optional split-screen of two dashboards showing different "MQL" counts.

---

## [16:00 — 19:00]  CHAPTER 4 — PHASE 1 — AUDIT

**Mode**: Excalidraw, then back to camera.

> "OK. So the diagnosis is in. You've got a stack that doesn't agree with itself and two teams that don't agree on words. Now what.
>
> Four phases. We're going to walk through each. Phase one is the audit.
>
> Goal of phase one. Every tool that produces a marketing number is inventoried, owned, and connected to a downstream metric. That's it. Not a CDP. Not a warehouse migration. An inventory."

✏️ **DRAW NOW**: Excalidraw Scene 7 — The 4-Tab Audit

> "One spreadsheet. Could be Google Sheets, Airtable, Notion, doesn't matter. Four tabs.
>
> Tab one. Tools. Every platform across all silos. Name, vendor, owner — by which I mean a human, not a team. Monthly cost. Auth method. Whether it has an API.
>
> Tab two. Flows. For each tool, what does it produce and where does the data go. Where do downstream consumers think it goes versus where it actually goes.
>
> Tab three. This one is the most important. Identifiers."

✏️ **DRAW NOW**: Excalidraw Scene 8 — The Identifier Graph

> "Every system in your stack has a different way of identifying a person. Anonymous web visitor ID. Email address. CRM Contact ID. Stripe Customer ID. App User ID. The Meta CAPI user ID. The Google GCLID.
>
> If you can't translate one to another, you can't compute LTV by channel. You can't tie a paying Stripe customer back to the ad that originally got them in the door. You can't run any of the math.
>
> Most teams skip this audit. Then they spend six months on a CDP migration and still can't compute LTV by channel. The CDP doesn't fix what the identifier audit didn't surface.
>
> Do the identifier audit. Get a real measurement of email-to-CRM-ID match rate. Make sure your CRM Contact has a Stripe Customer ID field. Make sure your anonymous web ID survives login. This is where everything else either works or doesn't.
>
> Tab four. Definitions. Pull every dashboard, every report, every leadership slide from the last ninety days. List every defined metric. Flag where the same word is calculated two different ways. This list becomes the input for phase three."

🎬 **VISUAL CUT**: Back to camera.

> "Time-box phase one to two weeks. Done is better than perfect. You will iterate. The point is to make the invisible visible."

---

## [19:00 — 23:00]  CHAPTER 5 — PHASE 2 — BUILD THE SPINE

**Mode**: Excalidraw heavy.

> "Phase two. Build the spine.
>
> The spine is a single queryable backend with every marketing event, every order, every cost, every customer, joined on identifiers you actually trust. One place every other system reads from.
>
> Five layers. Build them in order."

✏️ **DRAW NOW**: Excalidraw Scene 9 — The 5-Layer Spine

> "Layer one. Capture. Server-side events, with first-party identifiers, sent to every destination. Segment, Rudderstack, server-side Google Tag Manager via Stape. The point is one event taxonomy that fires everywhere. Not one taxonomy in GA4 and a different one in HubSpot and a third one in your data warehouse.
>
> Layer two. Warehouse. The single store every other system reads from. BigQuery, Snowflake, Postgres. Doesn't have to be expensive. If you're under a million events a month, Supabase Postgres is fine. The vendor matters less than the discipline of putting everything there.
>
> Layer three. Ingest. Pull from every silo on a schedule. Fivetran, Airbyte, n8n. Land the data raw. Don't transform on the way in. Just get it into the warehouse and stamped with a timestamp and source.
>
> Layer four. Model. Now you transform. Turn raw rows into modeled tables. This is where dbt lives. Or SQLMesh. Or just SQL views in Postgres if you're starting small.
>
> Layer five. Activate. Push modeled segments back to your ad platforms, your CRM, your email tool. Hightouch and Census do this. Or n8n flows. This is where the warehouse becomes operational. Not just a reporting backwater."

✏️ **DRAW NOW**: Excalidraw Scene 10 — Canonical Schema

> "Inside the warehouse, you need five tables. Minimum.
>
> UUID customer. One row per customer. Lifetime revenue, first touch channel, first paid at, current status.
>
> Fact session. Every web session, with the anonymous and customer IDs, source, medium, campaign, landing page.
>
> Fact order. Every purchase. Order ID, customer ID, gross revenue, COGS, channel, campaign. This is the table that joins your marketing world to your money world.
>
> Fact ad spend. Daily rows per platform per campaign. Impressions, clicks, spend, native-reported conversions.
>
> Fact touchpoint. Every marketing touch, attributable or not. Channel, campaign, position in path.
>
> With those five tables, you can compute every metric on the broken math list. Every one. Without them, you can't."

🎬 **VISUAL CUT**: Back to camera.

> "I'm not telling you that you need Snowflake. You probably don't. Most teams I've worked with start in Postgres or BigQuery's free tier and stay there for years. Pick the cheapest thing that has SQL and a backup story. The cost is the discipline, not the license."

---

## [23:00 — 25:30]  CHAPTER 6 — PHASE 3 — ALIGN DEFINITIONS

**Mode**: Camera, light Excalidraw.

> "Phase three. End the knife fight.
>
> The ninety minute meeting. Marketing. RevOps. Finance. One conference room. Phones away.
>
> Ten minutes to frame the cost of disagreement. Use the sixty-four percent gap example I showed you earlier.
>
> Thirty minutes on lifecycle stages. Lead, MQL, SAL, SQL, Opportunity, Customer, Expansion. One sentence per stage. Signed by all three teams in the room.
>
> Fifteen minutes on attribution. Agree on ONE primary model. Last-touch. Position-based. Time-decay. Marketing mix modeling. Doesn't matter which one. Pick one. Note your exceptions but don't multiply them.
>
> Fifteen minutes on source of truth. Revenue equals billing system. Spend equals ad platforms. Leads equal CRM. No exceptions.
>
> Fifteen minutes on cadence. When are these numbers reported. By whom. To whom.
>
> Last five minutes. Write the document. Get sign-off in the room. Do not let anybody leave with 'let me send notes.' The document gets written before anybody leaves the room or it does not get written."

✏️ **DRAW NOW**: Excalidraw Scene 11 — The 8 KPIs

> "Then you publish the eight KPIs. Blended MER. Blended CAC. CAC payback. Ninety-day LTV. MQL to SQL. SQL to won. Pipeline per dollar spent. Contribution by channel.
>
> Eight numbers. Same formula every Monday. Same dashboard for every team. That's the bar. If you can't hit it, you don't have a marketing measurement problem. You have an executive alignment problem."

---

## [25:30 — 27:30]  CHAPTER 7 — PHASE 4 — OPERATE

**Mode**: Camera.

> "Phase four. Operate. Don't let it decay.
>
> Owners. One human is the marketing data owner. End to end. Not a team. One human. Per-silo stewards for the big tools. A definitions council that meets quarterly and has authority to change KPI definitions.
>
> Cadence. Weekly review of the eight KPIs. Monthly cohort and channel deep dives. Quarterly definitions review and tool audit. Always-on alerting when a sync fails.
>
> Kill switch. Every tool gets re-justified by its steward every quarter. If it doesn't write to the warehouse, it doesn't get renewed. If it has fewer than three active users in ninety days, cancel. If two tools do the same job, kill the one with the worse API. Tool sprawl is how silos come back."

✏️ **DRAW NOW**: Excalidraw Scene 12 — The CFO Monday View

> "And here's what the CFO actually wants and what THEY would call a "useful report".
>
> What did one customer cost. CAC. From fact ad spend and fact customer.
> How long to make it back. Payback. CAC divided by gross profit per month.
> How much do we earn per dollar spent. MER. Stripe divided by all spend.
> Which channel actually pays. Contribution by channel. Fact order joined to COGS by channel.
>
> Four questions. One dashboard. Four numbers that mean what everyone agrees they mean. If your team can put that in the CFO's inbox before standup on Monday, you've done the work."

---x`

## [27:30 — 28:30]  THE 30-DAY CHECKLIST

**Mode**: Camera, with PDF visible.

> "I put a full thirty-day audit checklist in the PDF that goes with this video. Twenty-four yes-or-no items broken across four weeks. Run it on your own stack this month.
>
> Score yourself out of twenty-four. Under ten means you're flying blind. Ten to seventeen, you have inputs but not insight. Eighteen plus, your marketing engine has a working spine.
>
> Most teams I run this with score around eight on the first pass. They get to fifteen in four weeks. Twenty-plus is a six-month project, not a sprint."

📋 **B-ROLL CUE**: Hold on the PDF page 10 (the checklist) for visual reference.

---

## [28:30 — 30:00]  CTA + OUTRO

**Tone**: Direct. Confident. Slightly slower.

> "Here's what I want you to do.
>
> One. Download the PDF that goes with this video. Link in the description. It has the silo map, the broken math, the audit checklist, and the glossary. Everything I just walked you through, in print.
>
> Two. This week, before next Monday, hold the audit kickoff with your team. Just the tool inventory. Tab one of four. That's it. Time-box it to two hours.
>
> Three. If you want to run the full four-phase blueprint with me — collapse your silos, build the spine, end the knife fight, hand your CFO a Monday dashboard they can actually trust — book a discovery call. Email's info@theinnovativenative.com. Phone's seven-oh-two five-eight-two five-three-three-five. Or hit me up on Instagram at the dot innovative dot native.
>
> Last thing. Most teams don't need more effort. They need less guessing. The work above is the work that turns guessing into knowing. Do it.
>
> See you in the next one."

🎬 **VISUAL**: End card with logo + contact + PDF download CTA + subscribe button overlay.

---

## POST-PRODUCTION NOTES

- **Chapters** to set in YouTube description (drives engagement + searchability):
  - 0:00 — The 5 questions
  - 0:45 — Why this exists
  - 2:30 — Chapter 1: The Stack Map
  - 7:00 — Chapter 2: The Broken Math
  - 12:00 — Chapter 3: The Knife Fight
  - 16:00 — Chapter 4: Audit (Phase 1)
  - 19:00 — Chapter 5: The Spine (Phase 2)
  - 23:00 — Chapter 6: Align Definitions (Phase 3)
  - 25:30 — Chapter 7: Operate (Phase 4)
  - 27:30 — The 30-day Checklist
  - 28:30 — CTA + Outro
- **Description**: Mirror the chapters, link the PDF, link your Calendly, list the 9 metrics by name for SEO.
- **Tags**: marketing operations, marketing analytics, unit economics, MER, ROAS, CAC, LTV, customer data platform, revenue operations, dbt, data warehouse, marketing attribution, MMM, multi-touch attribution, marketing mix modeling.
- **Thumbnail**: black background, you with arms crossed left third, big cyan text right two-thirds: "UNF*CK YOUR DATA", small magenta subhead "Marketing Blueprint".
- **End screen**: this video → audit checklist standalone short → contact card.

---

## STYLE REMINDERS

- No em dashes in any on-screen text or chapter titles.
- Pause for one beat after every "draw now." Let viewers see the build.
- Personal credibility moments are EARNED by the content, not declared. Don't lean on "I've seen this." Show it through specifics.
- Keep numbers concrete. "Two hundred sixteen versus seventy-eight" hits harder than "a big gap."
- The cyan + magenta brand shows up in: title card, lower thirds, callout text, end card. Excalidraw scenes use cyan for primary, magenta for warnings/errors.
