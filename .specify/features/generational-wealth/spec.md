# Feature Spec: /generational-wealth — Private Land & Homestead Knowledge Hub

**Feature ID**: generational-wealth
**Created**: 2026-04-20
**Status**: Spec v2 — ToughLove fixes applied, MVP phased, brand voice defined
**Owner**: Mike
**Branch**: TBD (new branch off main)
**ToughLove Grade**: B+ → targeting A- with these fixes

---

## 1. Purpose

Build a private, password-gated section of theinnovativenative.com that serves as a comprehensive, interactive knowledge hub for rural land acquisition, USDA cost-share programs, homestead construction, and generational wealth building. Primary audience: Mike's two trusted family members who are total beginners. Secondary audience: eventually opened to a broader community of people on the same journey.

**This is NOT a blog post or PDF.** It's a full interactive web application within the existing site — modals, tooltips, progress tracking, embedded videos, and a beginner-friendly UI that makes dense government/legal/financial information digestible.

---

## 2. Brand Voice — "Kitchen Table"

This section has its own voice, distinct from the main TIN site. The main site is "direct operator, no-fluff consultant." This section is **family sitting at the kitchen table**.

### Voice Principles

| Attribute | Main TIN Site | /generational-wealth |
|-----------|--------------|---------------------|
| **Tone** | Direct, authoritative, operator-to-client | Warm, encouraging, family-to-family |
| **Posture** | "I build systems that survive contact with reality" | "Let me walk you through this — I already figured out the hard parts" |
| **Reading level** | Professional (grade 12+) | Conversational (grade 8). Short paragraphs. No jargon without a tooltip. |
| **Emotional register** | Confidence, competence | Safety, belonging, "we're in this together" |
| **Pronouns** | "We" (company), "you" (client) | "We" (family/tribe), "I" (Mike personally) |
| **Selling** | Yes — CTAs, value props, urgency | **Never.** Zero sales language. Zero urgency. This is a gift, not a funnel. |

### Writing Rules (Content Authoring Guide)

1. **Max 3 sentences per paragraph.** If a paragraph needs 4, break it up.
2. **Every paragraph answers "so what?"** — why does this matter to the reader personally.
3. **8th grade reading level.** Use Hemingway Editor or equivalent to verify. Target: Grade 7-9.
4. **Explain before you use.** Never drop an acronym without defining it first, even if there's a tooltip. The first mention should read naturally without the tooltip.
5. **Talk like you're explaining to a smart person who's never done this.** Not dumbing down — removing assumed knowledge.
6. **Emotional anchors per page.** Every page should hit at least one:
   - "This is possible for us" (empowerment)
   - "Other people have done this" (social proof / normalization)
   - "Here's exactly what to do next" (clarity kills anxiety)
   - "We're building something that outlasts us" (legacy / purpose)
7. **Never scare.** Risks and warnings exist, but frame them as "here's how we avoid this" not "this could destroy everything."
8. **Use Mike's voice.** Write as if Mike is sitting across the table, laptop open, saying "OK let me show you what I found." Not a textbook. Not a brochure.

### Example Rewrites

**Before** (planner voice from foreverHome docs):
> "Domestic exemption: Household use + livestock + up to 3 acres irrigation = NO permit. Anything above: OWRB permit required."

**After** (kitchen table voice):
> "Here's the good news about water in Oklahoma: if you're using your well for your family, your animals, and a small garden — you don't need any permits. The state calls this the 'domestic exemption,' and it covers up to 3 acres of irrigation. That's more than enough for what we're building. You only need to worry about permits if you're irrigating huge crop fields."

**Before**:
> "EQIP awards are structured as cost-share contracts, where the NRCS will reimburse participating producers for 75 percent of the implemented practice cost."

**After**:
> "Here's how EQIP works in plain English: you do the work on your land — clearing brush, building fences, whatever the plan calls for — and the government pays you back 75 cents on every dollar you spent. If you qualify as a beginning farmer (which we do), that goes up to 90 cents. So on a $10,000 brush clearing job, you'd only pay $1,000 out of pocket."

### Callout Box Voice

| Type | Voice Example |
|------|--------------|
| **[FAMILY NOTE]** (was "Beginner Note") | "If you've never heard of this before, that's normal. Here's what it means..." |
| **[PRO TIP]** | "This is something I wish someone had told me before I started researching..." |
| **[HEADS UP]** (was "Warning") | "Pay attention here — this is where people lose money or get stuck..." |
| **[THE LAW]** (was "Statute/Law") | "This isn't our opinion — it's the actual law. Here's the statute..." |

---

## 3. Primary Audience

- **Who**: Two family members (total beginners — never bought land, don't know what NRCS/FSA is)
- **Knowledge level**: Zero. Every acronym needs a tooltip. Every process needs a visual. Every decision needs a "why this matters" callout.
- **Device**: Likely mobile-first (phones), with desktop for deep reading sessions
- **Emotional state**: Excited but overwhelmed. Need to feel "I can do this" not "this is impossibly complex"

**Secondary audience** (future): Community members who opt in to Mike's generational wealth journey. The section should be designed to scale to this without redesign.

---

## 4. MVP Phasing

### Phase 1 — "What They Need Now" (7 pages)

Ship these first. They cover the decision-critical and time-sensitive information.

| Page | Why Phase 1 |
|------|------------|
| **Landing (Dashboard)** | Entry point, navigation hub, progress tracking |
| **EQIP** | Time-sensitive — NRCS has ranking periods. Family needs to understand this ASAP if they're acquiring land. |
| **Financing** | Decision-critical — USDA loan path changes the entire strategy. Must be understood before any offers. |
| **Due Diligence** | Needed before the first property visit. Checklists + call scripts. |
| **Contacts & Resources** | Reference from Day 1. Phone numbers, agencies, consultants. |
| **Timeline** | Shows the big picture so they understand the journey arc. |
| **Glossary** | Supports all other pages. Tooltip definitions won't work without it. |

### Phase 2 — "Deep Knowledge" (8 pages)

Ship after Phase 1 is live and tested by family.

| Page | Why Phase 2 |
|------|------------|
| **Vision** | Important but not urgent — Mike can explain verbally for now. |
| **Finding Land** | Useful but Mike is driving this search — family is along for the ride initially. |
| **Building** | Not needed until land is acquired (6+ months away). |
| **Systems** | Same — post-acquisition knowledge. |
| **Food** | Year 2+ content. |
| **Compound** | Year 3+ content. |
| **Oklahoma vs Texas** | Reference — Mike has already narrowed this. |
| **Risks** | Important but can be conveyed verbally until Phase 2 ships. |

### Phase 2 pages still get placeholder cards on the dashboard with "Coming Soon" badges and a brief description of what's coming.

---

## 5. URL Structure & Navigation

**Root**: `/generational-wealth`
**NOT in main nav menu.** Only accessible via direct link shared by Mike.

### Full Page Tree (Phase 1 marked with *)

```
/generational-wealth                    ← Landing page (password wall → dashboard) *
/generational-wealth/vision             ← The Why + Master Plan + Family Profile
/generational-wealth/find-land          ← Where to look, search channels, scorecard
/generational-wealth/due-diligence      ← Checklist, red flags, call scripts *
/generational-wealth/financing          ← Budget breakdown, USDA loans, cash vs debt *
/generational-wealth/eqip              ← NRCS cost-share programs (full EQIP explainer) *
/generational-wealth/building           ← Barndominium, phased build, DIY vs contract
/generational-wealth/systems            ← Water, power, septic, off-grid infrastructure
/generational-wealth/food              ← Aquaponics, agroforestry, livestock, food systems
/generational-wealth/compound           ← Multi-family compound expansion plan
/generational-wealth/oklahoma-vs-texas  ← State comparison, laws, taxes, water rights
/generational-wealth/risks             ← Edge cases, walk-away triggers, hidden costs
/generational-wealth/contacts          ← Full directory: agencies, consultants *
/generational-wealth/timeline          ← Interactive phased rollout (Y0-Y5) *
/generational-wealth/glossary          ← Every term/acronym defined *
```

**15 pages total** (7 in Phase 1, 8 in Phase 2).

---

## 6. Password Wall

### Behavior
- First visit to any `/generational-wealth/*` URL → full-screen password gate
- Password: `onlyMyTribe2026!`
- Hash comparison uses SHA-256 with a static salt baked into the component (see implementation below)
- On correct password → set `localStorage.gw_unlocked = true` + timestamp
- Subsequent visits → check localStorage, skip gate if unlocked
- Session expires after **30 days** (re-prompt)
- Incorrect password → GSAP shake animation + "That's not it — ask Mike for the password" message
- No username, no email, no registration. Single shared password.

### UI
- Full-screen dark overlay, centered card (max-width 400px)
- Black bg, subtle radial gradient (dark gray center), cyan accent border on input
- Heading: **"This is for the tribe."**
- Subheading: "Enter the password Mike gave you."
- Single password input (type=password) + "Let me in" button
- GSAP fade-in animation on load
- No hint, no reset, no "forgot password"

### Security Model
- **Client-side only.** The real security is: unlisted URL + noindex + Mike only shares the link personally.
- Password hash is an inline constant in the component (not an env var — that adds deployment friction without adding security)
- The salt makes rainbow table lookups useless even though the mechanism is client-side
- `<meta name="robots" content="noindex, nofollow">` on all /generational-wealth/* pages

### Implementation

```typescript
// PasswordGate.tsx
const SALT = 'gw-tribe-2026';
const EXPECTED_HASH = '<precomputed sha256 of "gw-tribe-2026:onlyMyTribe2026!">';
const EXPIRY_DAYS = 30;
const LS_KEY = 'gw_unlocked';
const LS_TS_KEY = 'gw_unlocked_at';

async function sha256(str: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function PasswordGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(LS_KEY);
    const ts = localStorage.getItem(LS_TS_KEY);
    if (stored === 'true' && ts) {
      if (Date.now() - parseInt(ts) < EXPIRY_DAYS * 86400000) {
        setUnlocked(true);
      } else {
        localStorage.removeItem(LS_KEY);
        localStorage.removeItem(LS_TS_KEY);
      }
    }
  }, []);

  const handleSubmit = async (password: string) => {
    const hash = await sha256(`${SALT}:${password}`);
    if (hash === EXPECTED_HASH) {
      localStorage.setItem(LS_KEY, 'true');
      localStorage.setItem(LS_TS_KEY, Date.now().toString());
      setUnlocked(true);
    } else {
      setError(true);
      // GSAP shake animation on the card
      setTimeout(() => setError(false), 2000);
    }
  };

  if (!unlocked) return <PasswordScreen onSubmit={handleSubmit} error={error} />;
  return <>{children}</>;
}
```

---

## 7. Landing Page (Dashboard)

After password unlock, the landing page serves as the hub.

### Hero Section
- Full-width background: aerial photo of eastern Oklahoma rolling hills/timber (Pexels stock)
- Overlay: dark gradient (80% opacity)
- Headline: **"Claim the Land. Build the Village."**
- Subheadline: "Everything our family needs to buy land, build a homestead, and create something that lasts — all in one place."
- CTA button: "Where do I start?" → scrolls to section cards

### Journey Progress Bar
- Horizontal stepper: **Learn → Find Land → Due Diligence → Close → Clear → Build → Grow**
- Each step clickable → links to relevant page
- Uses localStorage (`gw_progress_*`) to track which pages the user has visited
- Visited pages get a cyan checkmark
- Current suggested next step pulses with GSAP animation
- Shows "Your Progress: X of Y pages visited"

### Quick Stats Bar (below hero)
- 4 stat cards in a row (2x2 on mobile):
  - "25 acres" — Target property size
  - "$275K" — Total budget
  - "90% DIY" — Labor model
  - "4 years" — To full self-sufficiency

### Section Cards Grid (3 columns desktop, 1 mobile)
Each card links to a child page. Cards have:
- Icon (3D translucent glass style from `3d-icon-forge` Techsy library)
- Title
- 1-line description in kitchen-table voice
- Badge: "Start Here" / "Important" / "Reference" / "Coming Soon"
- Hover: lift + cyan border glow (GSAP)
- Phase 2 cards: slightly dimmed, "Coming Soon" badge, not clickable

| Card | Badge | Phase | Description |
|------|-------|-------|-------------|
| NRCS & EQIP | Start Here | 1 | "How the government helps pay for clearing your land" |
| Money & Financing | Important | 1 | "The budget, loan options, and how to keep your cash" |
| Due Diligence | Important | 1 | "The checklist before you buy anything" |
| Contacts & Resources | Reference | 1 | "Every phone number and website you'll need" |
| Timeline | Reference | 1 | "The full plan, quarter by quarter" |
| Glossary | Reference | 1 | "Every term explained in plain English" |
| The Vision | Coming Soon | 2 | "Why we're doing this and what it looks like" |
| Finding Land | Coming Soon | 2 | "Where to look and how to evaluate a property" |
| Building Your Home | Coming Soon | 2 | "The barndominium — what it is and what it costs" |
| Water, Power & Systems | Coming Soon | 2 | "Wells, solar, septic — the stuff that makes it livable" |
| Food Systems | Coming Soon | 2 | "Growing food, raising animals, feeding the family" |
| The Compound | Coming Soon | 2 | "When we're ready to bring more family in" |
| Oklahoma vs Texas | Coming Soon | 2 | "Which state makes more sense and why" |
| Risks & Pitfalls | Coming Soon | 2 | "What can go wrong and how we avoid it" |

### Legal Disclaimer Footer (on dashboard + all content pages)
> "Everything here is based on our family's research. It's educational — not legal, financial, or tax advice. Before making decisions about land, loans, or government programs, talk to a licensed professional in your state."

---

## 8. Content Page Template (Shared Layout)

### Desktop Layout
- **Sidebar** (left, 240px fixed): all pages listed, current highlighted cyan, "Back to Dashboard" at top
- **Content area**: max-width 800px, centered in remaining space
- **"Last verified" date** at top of every content page (e.g., "Last verified: April 2026")
- **Reading time estimate** below title (e.g., "~8 min read")

### Mobile Layout (< 768px)
- **Sticky bottom navigation bar** with 5 items:
  - EQIP | Money | Checklist | Contacts | More
  - "More" opens a slide-up sheet with all remaining pages
- Sidebar hidden entirely on mobile (replaced by bottom nav)
- Content area full-width with 16px padding

### Print Stylesheet
- Inverts to light background (#fff) with dark text (#111)
- Hides sidebar, bottom nav, password wall, progress bar
- Shows clean content with page URL in footer
- "Print this page" button visible on: Due Diligence, Contacts, Timeline
- Checklist items render as empty squares (printable)

### Reusable UI Components

#### Callout Boxes (4 types — kitchen table voice)
```
[FAMILY NOTE] — Cyan left border, rgba(0,255,255,0.05) bg
  "If you've never heard of this before, that's normal..."

[PRO TIP] — Cyan left border, rgba(0,255,255,0.08) bg
  "This is something I wish someone had told me..."

[HEADS UP] — Magenta left border (#FF1493), rgba(255,20,147,0.05) bg
  "Pay attention here — this is where people lose money..."

[THE LAW] — Gold left border (#FFD700), rgba(255,215,0,0.05) bg
  "This isn't our opinion — it's the actual law..."
```

#### Tooltip Terms
- Implemented via `<T>` wrapper component: `<T>EQIP</T>` → dotted underline, resolves from `gw-glossary.json`
- **First occurrence per page only** (post-render DOM scan matches first instance of each glossary term)
- Desktop: hover with 200ms delay shows popover
- Mobile: tap to reveal, tap elsewhere to dismiss
- Popover includes: definition + "See full glossary" link
- Respects `prefers-reduced-motion` — no animations if set

#### Interactive Checklists
- Checkbox items persist to localStorage under `gw_checklist_{page-slug}_{item-id}`
- Cyan fill animation on check (GSAP, respects prefers-reduced-motion)
- Dashboard shows aggregate: "You've completed X of Y checklist items"
- Clear warning on dashboard: "Your progress is saved in this browser. Clearing browser data will reset it."

#### Expandable Sections (Accordion)
- "Tell me more" / "Show details" trigger text
- Collapsed by default — keeps pages scannable
- GSAP slide-down, chevron rotates
- `aria-expanded` for screen readers

#### Modal Dialogs
- Bootstrap 5 modal base, dark-themed
- Used for: process diagrams, full-size images, mineral rights diagram
- Close on X, backdrop click, or Escape
- GSAP scale-in, respects prefers-reduced-motion

#### Empty States
- Every interactive component has a friendly empty state:
  - Scorecard: "Find a property you like? Score it here."
  - Search (contacts): "No results — try a different search term"
  - Checklist (0 checked): "Ready to start? Check off items as you go."

#### Stat Cards, Comparison Tables, Step Process, Contact Cards, Cost Calculator, Eligibility Checker
- Same as v1 spec (see original Section 6) — no changes needed

---

## 9. Page-by-Page Content Specification

### Phase 1 Pages

#### 9.1 EQIP (`/eqip`) — "How the Government Helps Pay"
**Source**: `14-NRCS-CostShare-Playbook.md`
**Reading time**: ~12 min
**Last verified**: April 2026

**Content** (written in kitchen-table voice):
- What is EQIP — in plain English, 3 paragraphs max
- Who qualifies (eligibility checklist with tooltips for each requirement)
- Cost-share rates table (standard vs beginning farmer vs socially disadvantaged)
- The advance payment option (50% upfront — explain the cash flow benefit)
- Practice codes that apply to us (314 brush, 382 fence, 378 pond, 612 trees) — expandable cards
- The 10-step application process (visual step-by-step)
- How ranking works (what scores higher — written as "how to improve your chances")
- NRCS certification (what they check, how to pass)
- What EQIP does NOT pay for (clear list)
- Timber sale vs EQIP — the two-stream play (this is the "aha" moment)
- Realistic timeline (honest about the 3-6 month wait)
- Consulting forester directory (OK + TX)
- Budget impact table ("here's what this saves us")

**Special UI**:
- "Am I Eligible?" interactive checker — 4 yes/no questions → result
- EQIP savings calculator — enter a dollar amount → see 75% vs 90% reimbursement
- Step-by-step process (animated vertical timeline, numbered nodes)
- Practice code cards (tap to expand full description)

**Disclaimer callout at top**:
> [THE LAW] "EQIP is a federal program with specific rules. What we describe here is based on published USDA guidelines as of April 2026. Rules change. Always verify with your local NRCS office before making decisions."

#### 9.2 Money & Financing (`/financing`) — "The Budget and How to Pay for It"
**Source**: `02-CostRollup.md`, `13-LoanAcquisition-Playbook.md`
**Reading time**: ~10 min

**Content**:
- The $272K budget — visual breakdown (what each dollar goes to)
- Cashflow timeline — quarter by quarter, how reserves deplete
- Three paths: Cash, USDA Single-Close, Owner Financing — comparison table
- USDA loan explainer (what it is, who qualifies, the 0% down play)
- The owner-builder problem (USDA requires a licensed contractor — here's the workaround)
- Verified lender directory with phone numbers
- Decision tree: "Which path fits your situation?"

**Special UI**:
- Budget breakdown — visual bar chart or pie (GSAP animated on scroll)
- Loan comparison table (expandable rows for detail)
- Lender cards (click-to-call on mobile)
- Budget calculator (adjust acreage × price/acre → see total shift)

**Disclaimer**: Same legal disclaimer as EQIP page.

#### 9.3 Due Diligence (`/due-diligence`) — "The Checklist Before You Buy Anything"
**Source**: `11-DueDiligenceQuestions.md`, `01-LandAcquisition.md` §Due Diligence
**Reading time**: ~10 min

**Content**:
- Why due diligence matters (framed as "this protects you from expensive surprises")
- The 3-phase checklist: Pre-Offer → Post-Offer → Pre-Close (interactive, localStorage)
- Call script for the listing agent (expandable, copyable)
- Documents to request (email template, copyable)
- Things to verify YOURSELF — independent research checklist
- Red flags that mean "walk away" (each in a [HEADS UP] callout)
- How to structure your offer (terms, contingencies, negotiation tips)
- "Hire an attorney" section — why it's worth $500

**Special UI**:
- Interactive 3-phase checklist (localStorage, printable)
- Expandable call script with "Copy Script" button
- Email template with "Copy to Clipboard"
- Red flag cards (magenta border, expandable)
- "Print This Checklist" button (triggers print stylesheet)

#### 9.4 Contacts & Resources (`/contacts`) — "Every Number You'll Need"
**Source**: `14-NRCS-CostShare-Playbook.md` §Contact Directory, `11-DueDiligenceQuestions.md`
**Reading time**: ~3 min (reference page)

**Content**:
- Organized by category tabs: **Government | Foresters | Lenders | Legal | Tools**
- Each contact: name, agency, phone (click-to-call), address, website, "what they do" one-liner
- Oklahoma agencies (FSA, NRCS, Forestry Services, OWRB, OCC)
- Texas agencies (FSA, NRCS, TX A&M Forest Service)
- County offices (USDA Service Center Locator link)
- Consulting foresters (OK + TX)
- Verified lenders (from loan playbook)
- Useful websites (LandWatch, FEMA flood maps, SSURGO, etc.)

**Special UI**:
- Category tabs with count badges
- Search bar (filters across all categories)
- Contact cards with: click-to-call, "Copy Info" button, "Visit Website" button
- "Print Contacts" button
- "Last verified: [date]" on each card

#### 9.5 Timeline (`/timeline`) — "The Full Plan, Quarter by Quarter"
**Source**: `07-PhasedRollout.md`, `99-Checklist.md`
**Reading time**: ~8 min

**Content**:
- Y0-Y5 phased rollout in plain English
- Each quarter: what happens, what it costs, what the deliverable is
- Decision gates at each phase boundary (the "check in" points)
- Milestone checkboxes (track progress)

**Special UI**:
- Vertical timeline (not horizontal — better for mobile scroll)
- GSAP scroll-reveal: each quarter fades in as you scroll
- Tap any quarter to expand: activities, budget, deliverables, decision gate
- Cashflow stat: "Reserves remaining: $X" at each phase
- Milestone checkboxes (localStorage)

#### 9.6 Glossary (`/glossary`) — "Every Term in Plain English"
**Content**: 40+ terms defined in kitchen-table voice
**Reading time**: Reference page (scan/search)

**Special UI**:
- Search bar at top (instant filter as you type)
- Alphabet jump-links (A B C D...)
- Each entry: term, plain-English definition, link to page(s) where it's used
- No jargon in definitions. If a definition uses another glossary term, that term is also tooltipped.

### Phase 2 Pages (Spec'd but not built in Phase 1)

Specifications for Phase 2 pages remain as defined in v1 spec Sections 7.1-7.11 (Vision, Find Land, Building, Systems, Food, Compound, OK vs TX, Risks). Content treatment and special UI unchanged. Phase 2 pages will be built after Phase 1 is live and family feedback is collected.

**Additions for Phase 2** (from ToughLove fixes):

- **Find Land — Simplified Scorecard**: 10 factors (not 19), no weights, 1-5 scale per factor, traffic-light result (green >35, yellow 25-35, red <25). Full 19-factor weighted scorecard in an "Advanced" expandable section for Mike's use.
- **Compound — Legal Disclaimer**: [THE LAW] callout at top: "Co-ownership structures (LLC, TIC, trust) are complex legal arrangements. This page gives you the concepts so you can have an informed conversation with an attorney. Do not form any legal entity based on this page alone."
- **Risks — Barndominium TBP PDFs**: Make the 14 barndominium planning PDFs downloadable from the /building page as supplementary material behind the password wall. Do not duplicate their content in page text.

---

## 10. Graphics & Visual Assets

### Stock Photography
Source via Pexels API (key stored in `.env.local` as `PEXELS_API_KEY` — do not hardcode in specs or source).

| Page | Search Query | Usage |
|------|-------------|-------|
| Landing hero | "aerial oklahoma farmland" or "rolling hills timber" | Full-width hero bg |
| EQIP | "tractor clearing brush field" | Section header |
| Financing | "family financial planning" or "savings growth" | Section header |
| Due Diligence | "person inspecting rural property" | Section header |
| Contacts | "office phone desk" | Section header |
| Timeline | "construction phases" or "building progress" | Section header |

Phase 2 page headers sourced when those pages are built.

### 3D Icons (3d-icon-forge Techsy library)
Check `remotion-videos/iconSet/techsy/` for existing assets. Generate new via 3d-icon-forge skill where needed.

**Phase 1 icons needed** (6):
- Government building / handshake (EQIP)
- Vault / dollar (Financing)
- Shield / checklist (Due Diligence)
- Phone / directory (Contacts)
- Calendar / timeline (Timeline)
- Book / dictionary (Glossary)

**Phase 2 icons** (8): generated when Phase 2 pages are built.

### Diagrams (Phase 1)
- EQIP application process (10-step vertical timeline) — SVG
- Budget breakdown (visual bar or treemap) — GSAP animated
- Cashflow depletion chart (timeline page) — GSAP animated

Phase 2 diagrams (system dependency, wall cross-section, aquaponics, mineral rights, risk matrix) built with their respective pages.

---

## 11. Video Content Plan

### Video Hosting Strategy
- **All videos hosted as YouTube Unlisted** — free, fast CDN, no ads on unlisted, no bandwidth cost on A2
- Embedded via YouTube iframe: `?rel=0&modestbranding=1&color=white`
- Fallback: thumbnail image + "Watch on YouTube" link for slow connections
- Videos NOT self-hosted on A2 (shared hosting bandwidth would degrade page load)

### Phase 1 — Remotion Automated Explainers (2 videos)

| # | Title | Length | Embed Page |
|---|-------|--------|------------|
| 1 | "What is EQIP? (In 75 Seconds)" | 75s | /eqip |
| 2 | "The 4-Year Plan" | 90s | /timeline |

Remaining 3 Remotion videos (Timber-to-Pasture, Barndominium 101, Water First) produced in Phase 2 with their respective pages.

### Phase 1 — YouTube Scripts (2 scripts)

| # | Title | Format | Length |
|---|-------|--------|--------|
| 1 | "We're Buying Land — Here's the Full Plan" | Talking head + B-roll | 12-15 min |
| 2 | "How the Government Pays You to Clear Your Land" | Screen share + talking head | 8-10 min |

Remaining 2 YouTube scripts (Rural Land Due Diligence, Barndominium Costs) delivered in Phase 2.

### Script Deliverables (per video)
- Full script (bullet-point style — Mike speaks naturally, not from teleprompter)
- Shot list (talking head segments, B-roll, screen shares)
- Thumbnail concept (title text + visual)
- YouTube description + tags for SEO
- CTA: "Full guide at theinnovativenative.com/generational-wealth" — drives to the hub

---

## 12. Technical Implementation

### Stack (existing — no new runtime dependencies)
- Next.js 13.4.19 (Pages Router, `output: 'export'`)
- TypeScript 5.2.2, React 18.2.0
- SCSS 1.66.1 + Bootstrap 5.3.1 + GSAP 3.12.2
- Static HTML → A2 Hosting (LiteSpeed)

### New Files (Phase 1)

```
src/pages/generational-wealth/
  index.tsx              ← Landing page (password wall + dashboard)
  due-diligence.tsx
  financing.tsx
  eqip.tsx
  contacts.tsx
  timeline.tsx
  glossary.tsx

src/components/generational-wealth/
  PasswordGate.tsx       ← Password wall component
  GWLayout.tsx           ← Shared layout (sidebar/bottom-nav + content + noindex + disclaimer)
  GWSidebar.tsx          ← Desktop sidebar navigation
  GWBottomNav.tsx        ← Mobile sticky bottom navigation (5 items + More sheet)
  JourneyProgress.tsx    ← Progress bar stepper
  CalloutBox.tsx         ← Family Note / Pro Tip / Heads Up / The Law
  TooltipTerm.tsx        ← Glossary-linked tooltip (<T> component)
  InteractiveChecklist.tsx ← localStorage-persisted checklist
  ContactCard.tsx        ← Agency/consultant with click-to-call
  StepProcess.tsx        ← Numbered step visualization
  ExpandableSection.tsx  ← Accordion with GSAP
  StatCard.tsx           ← Highlighted number + label
  ComparisonTable.tsx    ← Responsive styled table
  CostCalculator.tsx     ← EQIP savings + budget calculator
  EligibilityChecker.tsx ← "Am I eligible?" form
  YouTubeEmbed.tsx       ← Responsive YouTube embed with thumbnail fallback
  PrintButton.tsx        ← Triggers window.print() on key pages

src/styles/sections/
  _generational-wealth.scss     ← All GW styles
  _generational-wealth-print.scss ← Print stylesheet (light theme inversion)

src/data/
  gw-glossary.json       ← Term definitions (~40 entries)
  gw-contacts.json       ← Structured contact directory
  gw-checklist.json      ← Checklist items by page/phase
  gw-timeline.json       ← Phased rollout milestones + cashflow

public/images/generational-wealth/
  hero-bg.jpg            ← Landing hero (Pexels, WebP + JPEG, max 200KB)
  [section headers]      ← One per Phase 1 page
  [3d icons]             ← 6 Techsy icons for Phase 1 cards
  [diagrams]             ← SVG exports
```

### localStorage Convention

All keys prefixed with `gw_`:

| Key Pattern | Purpose |
|-------------|---------|
| `gw_unlocked` | Password gate state (boolean) |
| `gw_unlocked_at` | Password gate timestamp (epoch ms) |
| `gw_progress_{page-slug}` | Page visited tracking (boolean) |
| `gw_checklist_{page}_{item-id}` | Individual checklist items (boolean) |
| `gw_scorecard_{parcel-name}` | Parcel scorecard data (JSON, Phase 2) |

Dashboard reads all `gw_progress_*` and `gw_checklist_*` keys to show aggregate stats.

### SEO / Privacy
- All `/generational-wealth/*` pages: `<meta name="robots" content="noindex, nofollow">`
- No sitemap entries
- No internal links from main site navigation
- og:title and og:description set for DM sharing: "Generational Wealth Hub — The Innovative Native"
- og:image: hero background image

### GSAP Accessibility
- All GSAP animations wrapped in `prefers-reduced-motion` check
- If reduced motion preferred: elements appear immediately, no transitions
- Implementation: utility function `shouldAnimate()` checked before every GSAP call

### Deployment
- Existing rsync pipeline to A2 Hosting
- Add `generational-wealth` to directory index fix script

---

## 13. Content Authoring Workflow

### Process (for every page)

1. **Claude drafts content** from the foreverHome source doc, rewriting in kitchen-table voice per Section 2 rules
2. **Content includes**: all callout boxes, tooltip term markers (`<T>`), expandable sections, checklist items
3. **Mike reviews** for accuracy, voice authenticity, and anything that feels "off" for the audience
4. **Claude revises** based on Mike's feedback
5. **Content is embedded directly in the page TSX** (no external CMS — static site)

### Quality Checks (per page)

- [ ] Hemingway Editor score: Grade 8 or below
- [ ] No undefined acronyms (every first use has a natural-language explanation + tooltip)
- [ ] At least 2 callout boxes per page
- [ ] At least 1 emotional anchor per page (see Section 2)
- [ ] All phone numbers formatted as `tel:` links
- [ ] All external links open in new tab with `rel="noopener noreferrer"`
- [ ] "Last verified: [date]" at top
- [ ] Legal disclaimer present (on pages with financial/legal/government content)
- [ ] Reading time estimate present

---

## 14. Content Sources → Page Mapping

| ForeverHome Doc | Maps To Page | Content Treatment |
|-----------------|-------------|-------------------|
| `14-NRCS-CostShare-Playbook.md` | /eqip | Full kitchen-table rewrite |
| `02-CostRollup.md` + `13-LoanAcquisition-Playbook.md` | /financing | Visual budget + loan comparison |
| `11-DueDiligenceQuestions.md` + `01-LandAcquisition.md` | /due-diligence | Interactive checklist + call scripts |
| `14-NRCS-CostShare-Playbook.md` §Contacts + `11-DueDiligenceQuestions.md` | /contacts | Structured contact cards |
| `07-PhasedRollout.md` + `99-Checklist.md` | /timeline | Interactive vertical timeline |
| All docs | /glossary | Term extraction + plain-English definitions |
| `00-MasterPlan.md` | /vision (Phase 2) | Kitchen-table rewrite |
| `01-LandAcquisition.md` | /find-land (Phase 2) | Simplified scorecard + search channels |
| `08-BarndominiumOption.md` + `03-SkillsMatrix.md` | /building (Phase 2) | Cross-section + skills assessment |
| `05-SystemIntegration.md` | /systems (Phase 2) | Dependency diagram + water rights |
| `tilapiaAquaponicsGarden.md` + Agroforestry doc | /food (Phase 2) | Species cards + food calendar |
| `09-CompoundMVP.md` + `ZeroPointPlan.md` | /compound (Phase 2) | Carrying capacity + legal disclaimer |
| `00-MasterPlan.md` §State Decision | /oklahoma-vs-texas (Phase 2) | Interactive comparison |
| `06-EdgeCases.md` + `97-HiddenCosts.md` + `98-RedTeam.md` | /risks (Phase 2) | Risk matrix + walk-away triggers |
| `10-SasakwaEvaluation.md` | **NOT PUBLISHED** | Specific deal — stays private |

---

## 15. Accessibility & Responsive

- **Mobile-first**: All pages work on 375px width (iPhone SE)
- **Touch targets**: All buttons/links minimum 44x44px
- **Tooltips**: Tap-to-reveal on mobile (hover on desktop)
- **Tables**: Horizontal scroll wrapper on mobile
- **Mobile nav**: Sticky bottom bar (not sidebar — see Section 8)
- **Images**: Lazy-loaded, WebP with JPEG fallback, max 200KB per image
- **Font sizes**: Body 16px (mobile 15px), H1 32px, H2 24px, H3 20px
- **Color contrast**: All text meets WCAG AA on dark backgrounds (verified)
- **Reduced motion**: All GSAP animations respect `prefers-reduced-motion`
- **Print**: Light-theme print stylesheet on key pages
- **Screen readers**: `aria-expanded` on accordions, `aria-label` on icon buttons

---

## 16. Non-Goals (Explicitly Out of Scope)

- No user accounts or registration system
- No commenting or social features
- No database (all data is static JSON + localStorage)
- No payment processing
- No CMS or admin panel for content editing
- No analytics beyond existing site analytics
- Sasakwa property evaluation (10-SasakwaEvaluation.md) is NOT published
- No AI chat or interactive Q&A
- No Phase 2 pages in Phase 1 (placeholder cards only)

---

## 17. Success Criteria

### Phase 1
1. Mike's two family members can navigate the 7 pages on their phones without calling Mike for explanations
2. Every acronym has a tooltip definition
3. Every phone number is click-to-call on mobile
4. Every process has a visual step-by-step
5. Password wall prevents Google indexing and casual discovery
6. All 7 pages load in <3 seconds on 4G
7. Interactive checklists persist across sessions
8. Section shareable via single URL + password (no account needed)
9. 2 Remotion explainer videos embedded
10. 2 YouTube scripts delivered with shot lists
11. Content reads at grade 8 level or below (Hemingway verified)
12. Print stylesheet works on Due Diligence and Contacts pages
13. Family feedback collected within 2 weeks of launch → informs Phase 2 priorities

### Phase 2
14. All 15 pages live
15. All 5 Remotion videos embedded
16. All 4 YouTube scripts delivered
17. Interactive scorecard tested on at least 2 real properties
18. Family reports: "I understand enough to participate in conversations about the land search"
