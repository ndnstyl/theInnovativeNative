# ToughLove Review — generational-wealth Spec

**Reviewer**: ToughLove (pre-implementation)
**Date**: 2026-04-20
**Spec reviewed**: `.specify/features/generational-wealth/spec.md`
**Overall Grade**: **B+**

Strong vision, well-organized, content-source mapping is excellent. But there are real issues that will bite during implementation if not addressed now.

---

## CRITICAL (Must fix before implementation)

### C1: Password hash in NEXT_PUBLIC env var defeats the purpose
**Section**: 4 (Password Wall), 10 (Technical Implementation)
**Issue**: `NEXT_PUBLIC_GW_HASH` gets inlined into the client-side JavaScript bundle at build time. Anyone opening browser DevTools → Sources can find the SHA-256 hash, then use rainbow tables or brute force against it. Worse: the password `onlyMyTribe2026!` is a simple dictionary-adjacent string — it would fall to hashcat in seconds.
**Fix**: Accept that client-side gating is security theater (spec already acknowledges this). But don't use an env var for the hash — just inline the hash directly as a constant. The "security" here is the URL being unlisted + noindex, not the password mechanism. Alternatively, if you want slightly better: use a keyed HMAC with a static salt baked into the component, which makes rainbow tables useless. Either way, don't pretend the env var adds security — it just adds deployment friction.
**Impact**: No functional difference (client-side either way), but removes false sense of security and simplifies deployment.

### C2: Pexels API key is hardcoded in the spec
**Section**: 8 (Graphics)
**Issue**: The full Pexels API key `GSL2qhO4...` is written in plaintext in spec.md. This file will likely be committed to git. The key should be referenced by env var name only, never written into specs or docs.
**Fix**: Replace with "Source via Pexels API (key in `.env.local` as `PEXELS_API_KEY`)". Remove the key string from the spec immediately.
**Impact**: Security — API key exposure in version control.

### C3: 15 pages is too many for Phase 1 — scope creep risk is extreme
**Section**: 3 (URL Structure), 7 (Page-by-Page Content)
**Issue**: 15 pages, 16 custom components, 6 SVG diagrams, 5 Remotion videos, 4 YouTube scripts. For a static site with no CMS, every page is hand-coded content. This is realistically 80-120 hours of implementation work. The spec doesn't define phases or an MVP cut.
**Fix**: Define a Phase 1 MVP (6-8 pages max) and a Phase 2 expansion. Recommended MVP:
  - Landing page (dashboard)
  - EQIP (the urgent action item — NRCS application has a timeline)
  - Financing (decision-critical — USDA loan path affects everything)
  - Due Diligence (needed before any property visit)
  - Contacts (reference — needed from Day 1)
  - Glossary (supports all other pages)
  - Timeline (shows the big picture)
Phase 2 adds: Vision, Find Land, Building, Systems, Food, Compound, OK vs TX, Risks.
**Impact**: Without phasing, this will take months and the EQIP info your family needs NOW gets blocked behind the Aquaponics page they don't need yet.

---

## HIGH (Should fix before implementation)

### H1: No content authoring workflow defined
**Section**: 7 (all pages)
**Issue**: The spec maps source docs to pages but doesn't address HOW content gets written for beginners. The foreverHome docs are written in planner/builder voice for Mike. They need complete rewrites — not copy-paste — for total beginners. Who writes that content? The spec treats this as implementation detail but it's actually the hardest part of the entire project. 15 pages of beginner-friendly educational content is a weeks-long writing project.
**Fix**: Add a content authoring section. Options:
  1. Claude writes all content during implementation (define voice, reading level, max paragraph length)
  2. Mike writes drafts, Claude rewrites for audience
  3. Claude drafts, Mike reviews for accuracy + voice
Recommendation: Option 3 with a defined style guide (8th grade reading level, max 3 sentences per paragraph, every paragraph has a "so what" — why this matters to the reader).
**Impact**: Without this, implementation will stall on content creation.

### H2: Interactive scorecard (find-land) needs data model
**Section**: 7.2
**Issue**: The parcel evaluation scorecard is spec'd as "user enters scores per factor → auto-calculates" but the scoring weights, factors, and thresholds aren't defined in the spec. They exist in `01-LandAcquisition.md` but that uses a 100-point weighted system with 19 factors — too complex for total beginners staring at their first piece of land.
**Fix**: Define a simplified scorecard for the web version. Recommend: 10 factors max, simple 1-5 scale, no weights, traffic-light output (green >35, yellow 25-35, red <25). Reference the full 19-factor system in an expandable "Advanced" section.
**Impact**: Implementer will guess at the UX without this, producing something either too complex or too simple.

### H3: Mobile sidebar pattern needs more definition
**Section**: 6 (Content Page Template), 12 (Accessibility)
**Issue**: Spec says "Collapses to bottom sheet or hamburger on mobile" but doesn't commit to which. These are very different UX patterns. A bottom sheet for 14 nav items is awkward (too tall). A hamburger hides navigation that beginners need visible.
**Fix**: Use a sticky bottom navigation bar on mobile (4-5 key sections + "More" overflow). This is the pattern beginners are used to from apps. The hamburger is fine for the remaining items. Define the 4-5 priority sections for the bottom bar.
**Impact**: Mobile UX is critical since audience is "likely mobile-first."

### H4: localStorage limits not addressed for checklists
**Section**: 6 (Interactive Checklists), 7.3 (Due Diligence), 7.13 (Timeline)
**Issue**: Multiple pages use localStorage for checklist state, progress tracking, and scorecard data. The spec doesn't define a localStorage key naming convention, doesn't address what happens when localStorage is cleared (user loses all progress), and doesn't address the ~5MB localStorage limit (not a real risk here, but the design should be intentional).
**Fix**: Define:
  - Key prefix: `gw_` (e.g., `gw_checklist_due-diligence`, `gw_progress_visited`)
  - A "Your Progress" section on the dashboard showing what's been tracked
  - A warning banner: "Progress is saved in your browser. Clearing browser data will reset it."
  - Export/import JSON option for power users (optional Phase 2)
**Impact**: Users lose progress unexpectedly → frustration → "this doesn't work."

### H5: Video embed strategy undefined
**Section**: 9 (Video Content Plan)
**Issue**: Spec says "5 Remotion explainer videos embedded on relevant pages" but doesn't say WHERE the video files are hosted or how they're embedded. Options: self-hosted MP4 in `/public/videos/`, YouTube embeds, Vimeo embeds, Cloudflare Stream. Self-hosted MP4s on A2 shared hosting will be slow and eat bandwidth. YouTube embeds are free but add tracking/ads.
**Fix**: Define hosting strategy. Recommendation: Upload to YouTube as unlisted videos (free, fast CDN, no ads on unlisted). Embed via YouTube iframe with `?rel=0&modestbranding=1`. This keeps them private (only accessible via embed or direct link) while leveraging YouTube's CDN.
**Impact**: Self-hosted videos on shared hosting would degrade page load time (success criterion #6: <3s on 4G).

### H6: Compound page has legal liability risk
**Section**: 7.9 (The Compound)
**Issue**: The spec includes "Legal structure (how to co-own property)" which touches on legal advice. Presenting co-ownership structures (TIC, LLC, trust) without a disclaimer could create liability, especially if family members rely on it.
**Fix**: Add a prominent disclaimer: "This is educational information, not legal advice. Consult a real estate attorney licensed in your state before any co-ownership arrangement." Make this a `[WARNING]` callout box at the top of the page. Apply similar disclaimers to financing and EQIP pages.
**Impact**: Legal exposure if someone acts on the information and it's wrong or incomplete.

---

## MEDIUM (Fix during implementation)

### M1: Glossary tooltip implementation could cause performance issues
**Section**: 6 (Tooltip Triggers)
**Issue**: "Any term with a dotted underline → hover/tap reveals definition" across all 14 content pages means scanning page content for glossary matches on every render. If done naively (regex scan of innerHTML), this will be slow and fragile. If done by manually wrapping every term in `<TooltipTerm>`, the content authoring burden is massive.
**Fix**: Use a JSON glossary + a post-render DOM scan that wraps first-occurrence-only of each term per page. Or: author content with `<T>EQIP</T>` shorthand that the component resolves. Define the approach before implementation.

### M2: No error/empty states defined
**Issue**: What does the scorecard show with no data? What does the contacts page show with no search results? What does the timeline show before any milestones are checked?
**Fix**: Define empty states for every interactive component. Recommendation: each gets a friendly message + illustration (can reuse a single "getting started" graphic).

### M3: Print stylesheet missing
**Issue**: Audience is total beginners who may want to print the due diligence checklist, contacts page, or call scripts to bring to property visits. Dark theme with cyan text will print as invisible-on-white.
**Fix**: Add a print stylesheet that inverts to light theme, hides nav/sidebar, and formats checklists as printable documents. Add a "Print this page" button on key pages (due diligence, contacts, timeline).

### M4: No "last updated" timestamp on content
**Issue**: Contact info (phone numbers, office addresses), EQIP deadlines, and loan rates change. Without a visible "last updated" date, users can't judge if the info is current.
**Fix**: Add a "Last verified: [date]" line at the top of every content page. Store dates in the page data files.

### M5: Barndominium TBP PDFs referenced but not integrated
**Section**: 11 (Content Sources)
**Issue**: The `barndominium/*.pdf` folder has 14 PDFs from a barndominium build planner. Spec says "key data extracted into content" but doesn't specify which data or whether PDFs should be downloadable.
**Fix**: Either extract key data points during content authoring and cite the source, or make the PDFs downloadable behind the password wall as supplementary material. Don't do both (redundant).

---

## LOW (Nice to have)

### L1: No search across all pages
A site-wide search for the /generational-wealth section would help beginners find things. Phase 2 candidate.

### L2: No "ask Mike" escape hatch
When beginners get stuck, they'll want to ask Mike. A floating "Text Mike" button (tel: or sms: link) would reduce frustration. Simple to add.

### L3: No reading time estimates
Beginner pages are long. A "~8 min read" at the top helps set expectations.

### L4: GSAP animations should respect prefers-reduced-motion
All GSAP animations should check `window.matchMedia('(prefers-reduced-motion: reduce)')` and skip animations if set.

---

## What's Good (Keep These)

1. **Content source mapping** (Section 11) — This is excellent. Every page has a clear source doc. This will save days during implementation.
2. **Callout box system** (4 types) — Perfect for beginners. The visual hierarchy (cyan/red/green/gold) maps to urgency intuitively.
3. **Password wall simplicity** — Single shared password, no accounts, localStorage expiry. Right level of complexity for the audience.
4. **Non-goals section** — Clearly scoped. No scope creep bait.
5. **Success criteria** — Measurable and specific. Especially #1 ("family members can navigate without calling Mike").
6. **Noindex + unlisted** — Correct approach for private content on a public site.
7. **Click-to-call contacts** — Critical for the audience who will be calling these offices.

---

## Recommended Fix Priority

1. **C3**: Phase the build (MVP first) — do this before anything else
2. **C2**: Remove API key from spec — do this now (security)
3. **H1**: Define content authoring workflow — blocks all page implementation
4. **H5**: Define video hosting strategy — blocks video production
5. **C1**: Simplify password implementation — minor code change
6. **H3**: Define mobile nav pattern — blocks layout implementation
7. **H2**: Simplify scorecard for beginners — blocks find-land page
8. **H4**: Define localStorage convention — blocks all interactive components
9. **H6**: Add legal disclaimers — must be in content from Day 1
10. Everything else during implementation

---

## Grade Justification: B+

**What earns the B+**: Thorough spec with clear audience definition, strong content mapping, well-thought-out component library, and realistic technical approach (no new dependencies, uses existing stack). The video plan is ambitious but well-structured.

**What prevents the A**: No MVP phasing (C3), no content authoring workflow (H1), and several implementation-critical details left undefined (mobile nav, scorecard model, video hosting, localStorage patterns). The spec is strong on WHAT but thin on HOW for the hardest parts (content creation and interactive component data models).

**Path to A-**: Fix C1-C3 + H1-H6. Add MVP phase cut. Define content style guide. Commit to mobile nav pattern. That's ~2 hours of spec revision.
