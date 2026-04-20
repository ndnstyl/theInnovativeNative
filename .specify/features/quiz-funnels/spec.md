# Feature Spec: Interactive Quiz Funnels — Lead Capture + Qualification + Portfolio Showcase

**Feature ID**: quiz-funnels
**Created**: 2026-04-20
**Status**: Spec Complete — Ready for implementation
**Owner**: Mike

---

## 1. Purpose

Build a library of interactive quiz/assessment funnels that serve three purposes simultaneously:

1. **Lead capture** — collect name, email, phone, company from warm prospects who self-qualify through engagement
2. **Lead scoring** — deterministic branching assigns a heat score (cold/warm/hot) based on answers, triggering different follow-up paths
3. **Portfolio showcase** — each funnel IS the product demo. When Mike sends one to a prospect, they experience exactly what he'd build for them. The funnel sells itself.

**The play**: Drop a link in a DM, email, Facebook group, or LinkedIn comment. Prospect takes a 2-minute quiz. By the time they finish, you have their contact info, you know how warm they are, and they've experienced a taste of what you build. The n8n backend scores them, enriches their data, and routes them into the right email sequence automatically.

---

## 2. Architecture — How It All Connects

```
PROSPECT clicks quiz link (standalone URL or embedded)
    │
    ▼
QUIZ FRONTEND (React component on theinnovativenative.com)
    │ ← 5-8 questions, one per screen, progress bar
    │ ← Branching logic (deterministic, feels dynamic)
    │ ← Final screen: "Get your results" → captures email + name
    │
    ▼
WEBHOOK fires to n8n (NEXT_PUBLIC_LEAD_WEBHOOK_URL)
    │
    ├──► AIRTABLE: Create lead record (name, email, answers, score, quiz source, timestamp)
    │
    ├──► LEAD SCORING: Based on answers → Cold (0-3) / Warm (4-6) / Hot (7-10)
    │
    ├──► ENRICHMENT: Quick scrape (company LinkedIn, website, headcount) — lightweight, no Apify
    │
    ├──► EMAIL SEQUENCE: Route to appropriate drip
    │    ├── Cold → 6-touch value nurture (existing outreach_engine pattern)
    │    ├── Warm → 3-touch accelerated (case study + booking link by Touch 2)
    │    └── Hot → Immediate alert to Mike (Slack + SMS) + personalized email within 1 hour
    │
    └──► RESULTS PAGE: Prospect sees their personalized score/recommendation
         └── CTA: Book a call (Calendly) OR download resource OR view relevant product page
```

### What makes this different from a Typeform

- **Self-hosted** — no monthly SaaS fee, no branding watermark, no data in someone else's database
- **Integrated scoring** — answers directly compute a lead temperature, not just "form data"
- **Automated follow-up** — n8n triggers sequences based on score, not just "new submission"
- **Portfolio piece** — the quiz itself demonstrates what Mike builds. It IS the sales demo.
- **Embeddable** — single `<iframe>` or direct URL. Works in DMs, emails, Facebook groups, LinkedIn

---

## 3. The Quiz Funnels to Build

### Funnel Matrix — Mapped to Verticals + Products

| # | Quiz Name | Vertical | Product It Sells | Estimated Build |
|---|-----------|----------|-----------------|----------------|
| 1 | **AI Automation Readiness Score** | Small Business | Pilot ($2,500) / Build (custom) | MVP |
| 2 | **Law Firm Automation Audit** | Legal | Cerebro RAG ($2,500 pilot + $500/mo) | MVP |
| 3 | **Content Production Efficiency Score** | Creative | TwinGen ($57) / Classroom ($99/mo) | Fast follow |
| 4 | **Listing Marketing Score** | Real Estate | VisionSpark RE ($97-$497) | Fast follow |
| 5 | **How Much Is Manual Work Costing You?** | All verticals | Any product on value ladder | Showcase/universal |

**MVP = Build first (Funnels 1 + 2). These target the highest-ticket products and have the most existing content.**

---

## 4. Quiz Framework — Reusable Component Architecture

Every quiz uses the same React component with different config. No new code per quiz — just a new JSON config file.

### QuizFunnel Component

```
Props:
  quizId: string           ← "ai-readiness" | "law-firm-audit" | etc.
  config: QuizConfig       ← loaded from JSON

QuizConfig:
  title: string
  subtitle: string
  questions: QuizQuestion[]
  resultBuckets: ResultBucket[]
  webhookUrl: string
  ctaOptions: CTA[]
  branding: { accentColor, heroImage }

QuizQuestion:
  id: string
  text: string                    ← the question
  subtext?: string                ← optional helper text
  type: "single" | "multiple" | "scale" | "text"
  options?: QuizOption[]          ← for single/multiple
  scaleRange?: { min, max, labels }  ← for scale type
  branchLogic?: BranchRule[]      ← optional: skip/show next questions based on answer
  scoreWeight: number             ← how much this answer affects the total score

QuizOption:
  id: string
  label: string
  score: number                   ← 0-3 points per option
  tags?: string[]                 ← e.g., ["high-volume", "manual-heavy"]

BranchRule:
  ifOptionId: string
  thenSkipTo: string              ← question ID to jump to
  // OR
  thenShow: string                ← question ID that becomes visible

ResultBucket:
  id: string
  minScore: number
  maxScore: number
  label: string                   ← "Needs Work" | "Getting There" | "Ready to Scale"
  emoji: string
  summary: string                 ← personalized result paragraph
  recommendation: string          ← what to do next
  cta: CTA
  heatLevel: "cold" | "warm" | "hot"

CTA:
  label: string
  type: "calendly" | "link" | "download"
  url: string
```

### UI Flow (Every Quiz)

```
Screen 1: WELCOME
  ├── Quiz title + subtitle
  ├── "Takes 2 minutes" badge
  ├── "Start" button
  └── No email required yet — zero friction entry

Screen 2-7: QUESTIONS (one per screen)
  ├── Progress bar (e.g., "3 of 6")
  ├── Question text + subtext
  ├── Answer options (cards, buttons, or slider)
  ├── Auto-advance on selection (no "Next" button needed)
  └── Back button (subtle, top-left)

Screen 8: LEAD CAPTURE
  ├── "Almost done — where should we send your results?"
  ├── Name input
  ├── Email input
  ├── Company/firm input (optional, increases enrichment)
  ├── Phone input (optional)
  ├── "Get My Score" button
  └── Privacy note: "We don't spam. Ever."

Screen 9: RESULTS
  ├── Score visualization (circular gauge or bar)
  ├── Bucket label ("You scored 7/10 — Ready to Scale")
  ├── Personalized summary paragraph (assembled from answer tags)
  ├── "Here's what we recommend" section
  ├── Primary CTA (Book a Call / Download Resource / View Product)
  ├── Secondary CTA (Share this quiz)
  └── "Want the full breakdown? Check your email."

POST-SUBMIT: Email
  ├── Immediate email with full results + recommendations
  ├── Links to relevant content (blog posts, case studies, products)
  └── Soft CTA: "Reply to this email if you have questions"
```

### Design Specs

- **Dark theme** matching TIN site (black bg, cyan accent, Inter font)
- **One question per screen** — full viewport height, centered
- **Progress bar** — thin cyan line at top, percentage-based
- **Answer cards** — large clickable cards (not radio buttons). Hover: cyan border glow
- **Auto-advance** — clicking an answer immediately moves to next question (150ms delay for visual feedback)
- **Mobile-first** — thumb-friendly card sizes, swipe support optional
- **Animations** — slide transitions between questions (GSAP, respects reduced-motion)
- **Embeddable** — works as standalone page AND as `<iframe>` embed (detect via URL param `?embed=true` to hide header/footer)

---

## 5. Quiz #1: AI Automation Readiness Score

**Vertical**: Small Business Operators
**Sells**: Pilot ($2,500) or Build (custom project)
**URL**: `/quiz/ai-readiness`

### Questions

| # | Question | Options (label → score) | Weight |
|---|----------|------------------------|--------|
| 1 | How many people are on your team? | Solo (0), 2-5 (1), 6-20 (2), 21-50 (2), 50+ (3) | 1x |
| 2 | How many SaaS tools does your business use daily? | 1-3 (0), 4-7 (1), 8-12 (2), 13+ (3) | 1.5x |
| 3 | How much time per week do you spend on repetitive tasks? | Under 2 hrs (0), 2-5 hrs (1), 5-10 hrs (2), 10+ hrs (3) | 2x |
| 4 | What's your biggest operational bottleneck? | Lead follow-up (2), Content creation (1), Data entry/reporting (2), Client communication (1), Don't know (0) | 1x |
| 5 | Have you tried automating anything before? | No, never (0), Yes, with Zapier/Make (1), Yes, with custom tools (2), Yes, with AI tools (3) | 1x |
| 6 | What's your monthly budget for operational tools? | Under $100 (0), $100-$500 (1), $500-$2,000 (2), $2,000+ (3) | 1.5x |

**Max score**: ~24 (weighted)

### Result Buckets

| Score | Label | Heat | CTA |
|-------|-------|------|-----|
| 0-8 | "Just Getting Started" | Cold | Download: "5 Automations Every Business Should Have" (free PDF) |
| 9-15 | "Ready to Optimize" | Warm | Link: View case studies + book a free audit call |
| 16-24 | "Ready to Scale" | Hot | Calendly: Book a Pilot call (direct to $2,500 offer) |

---

## 6. Quiz #2: Law Firm Automation Audit

**Vertical**: Legal Professionals
**Sells**: Cerebro RAG ($2,500 pilot + $500/mo) + Stan Store Scorecard
**URL**: `/quiz/law-firm-audit`

### Questions

| # | Question | Options (label → score) | Weight |
|---|----------|------------------------|--------|
| 1 | What type of law does your firm primarily practice? | Criminal (1), Bankruptcy (2), Personal Injury (1), Administrative (1), Family (1), Other (0) | 0.5x |
| 2 | How many attorneys are at your firm? | Solo (0), 2-5 (2), 6-15 (3), 16+ (2) | 1x |
| 3 | How do you currently find information from past cases? | Search email/files manually (0), Basic document management (1), We have a system but it's slow (2), We have good search (3) | 2x |
| 4 | How many hours per week does your team spend on document review? | Under 5 (0), 5-15 (1), 15-30 (2), 30+ (3) | 1.5x |
| 5 | Do you use AI tools in your practice today? | No (0), We've experimented (1), Yes for drafting (2), Yes for research + drafting (3) | 1x |
| 6 | What's your biggest time drain? | Client intake (1), Document drafting (2), Case research (3), Billing/admin (1), Court prep (2) | 1.5x |
| 7 | Would your firm invest in a system that cuts research time by 60%? | Not right now (0), Maybe if it's affordable (1), Yes if it works (2), Absolutely — show me (3) | 2x |

**Max score**: ~30 (weighted)

### Result Buckets

| Score | Label | Heat | CTA |
|-------|-------|------|-----|
| 0-10 | "Room to Grow" | Cold | Download: Free Automation Readiness Scorecard (Stan Store lead magnet) |
| 11-20 | "Big Opportunity Here" | Warm | Link: Watch Cerebro demo video + case study |
| 21-30 | "Your Firm Is Losing Money Every Day Without This" | Hot | Calendly: Book Cerebro pilot call |

---

## 7. Quiz #3: Content Production Efficiency Score

**Vertical**: Creative Professionals
**Sells**: TwinGen ($57) / Classroom ($99/mo)
**URL**: `/quiz/content-score`

### Questions

| # | Question | Options | Weight |
|---|----------|---------|--------|
| 1 | How many pieces of content do you publish per week? | 1-2 (0), 3-5 (1), 6-10 (2), 10+ (3) | 1x |
| 2 | How long does it take to create one piece of content? | Under 30 min (3), 30-60 min (2), 1-3 hrs (1), 3+ hrs (0) | 1.5x |
| 3 | What's your biggest content bottleneck? | Ideas (1), Filming/shooting (1), Editing (2), Writing captions/copy (2), Distribution (1) | 1x |
| 4 | Do you repurpose content across platforms? | No (0), Sometimes manually (1), Yes with tools (2), Fully automated (3) | 1.5x |
| 5 | Have you used AI for content creation? | Never (0), Tried ChatGPT (1), Use AI tools regularly (2), Built a pipeline (3) | 1x |
| 6 | What would you pay to cut your content time in half? | Nothing — I like doing it all (0), $50-$100/mo (1), $100-$500/mo (2), Whatever it takes (3) | 1x |

### Result Buckets

| Score | Label | Heat | CTA |
|-------|-------|------|-----|
| 0-7 | "Manual Mode" | Cold | Link: Blog post "5 AI Tools Every Creator Should Know" |
| 8-14 | "Ready to Automate" | Warm | Link: TwinGen landing page ($57 blueprint) |
| 15-21 | "Pipeline Ready" | Hot | Calendly: Book a custom content system call |

---

## 8. Quiz #4: Listing Marketing Score

**Vertical**: Real Estate
**Sells**: VisionSpark RE ($97 blueprint / $497 DFY)
**URL**: `/quiz/listing-score`

### Questions

| # | Question | Options | Weight |
|---|----------|---------|--------|
| 1 | How many listings do you handle per month? | 1-2 (0), 3-5 (1), 6-10 (2), 10+ (3) | 1x |
| 2 | How do you currently market your listings? | MLS + photos only (0), Photos + social posts (1), Video + social (2), Full multimedia campaigns (3) | 1.5x |
| 3 | Do you use AI-staged photos? | No (0), Tried it (1), Use it on every listing (2) | 1x |
| 4 | How much do you spend on listing marketing per property? | Under $100 (0), $100-$500 (1), $500-$2,000 (2), $2,000+ (3) | 1x |
| 5 | What's your biggest marketing pain point? | Time to create content (2), Cost of video/photo (1), Standing out from competitors (2), Getting offers quickly (1) | 1.5x |
| 6 | Would you use AI-generated listing videos if they looked professional? | No — buyers want real (0), Maybe for some listings (1), Yes for most listings (2), Absolutely (3) | 1.5x |

### Result Buckets

| Score | Label | Heat | CTA |
|-------|-------|------|-----|
| 0-7 | "Your Listings Deserve Better" | Cold | Download: "5 AI Listing Marketing Tricks" free guide |
| 8-14 | "You're Close — One Upgrade Away" | Warm | Link: VisionSpark RE Blueprint ($97) |
| 15-21 | "Ready for AI-Powered Listings" | Hot | Calendly: Book a DFY listing video call ($497) |

---

## 9. Quiz #5: How Much Is Manual Work Costing You?

**Vertical**: Universal (all verticals)
**Sells**: Any product on the value ladder
**URL**: `/quiz/cost-calculator`
**Style**: NerdWallet calculator-style — input numbers, get a dollar cost back

### Questions

| # | Question | Type | Weight |
|---|----------|------|--------|
| 1 | What's your (or your team's) average hourly rate? | Scale: $25-$300 | Input |
| 2 | How many hours per week on repetitive manual tasks? | Scale: 1-40 | Input |
| 3 | How many team members do repetitive work? | Number: 1-50 | Input |
| 4 | What industry are you in? | Single: Legal / Real Estate / Creative / E-commerce / Services / Other | Tag |
| 5 | What's your biggest time waste? | Single: Data entry / Email follow-up / Content creation / Reporting / Client intake | Tag |

### Result (Calculator Output, Not Buckets)

```
Your manual work costs you:
  $X,XXX per week
  $XX,XXX per month
  $XXX,XXX per year

That's [X] hours your team will never get back.

What if you automated 60% of that?
  You'd save $XX,XXX/year and [X] hours/week.
```

CTA: "Let's find the 3 automations that save you the most →" (Calendly)

---

## 10. n8n Automation Backend

### Webhook Flow (applies to ALL quizzes)

**Webhook URL**: Use existing `NEXT_PUBLIC_LEAD_WEBHOOK_URL` pattern

**Payload from frontend**:
```json
{
  "quizId": "ai-readiness",
  "name": "John Smith",
  "email": "john@acme.com",
  "company": "Acme Corp",
  "phone": "+14055551234",
  "answers": [
    { "questionId": "q1", "optionId": "2-5", "score": 1, "tags": [] },
    { "questionId": "q2", "optionId": "8-12", "score": 2, "tags": ["tool-heavy"] }
  ],
  "totalScore": 17,
  "maxScore": 24,
  "heatLevel": "hot",
  "resultBucket": "ready-to-scale",
  "timestamp": "2026-04-20T18:30:00Z",
  "source": "linkedin-dm",
  "utmParams": { "utm_source": "linkedin", "utm_medium": "dm", "utm_campaign": "ai-readiness-april" }
}
```

### n8n Workflow: "Quiz Funnel — Lead Router"

```
Webhook Trigger (POST /quiz-lead)
    │
    ├──► Airtable: Create record in Leads table
    │    Fields: Name, Email, Company, Phone, Quiz ID, Score, Heat Level,
    │            Bucket, Answers (JSON), Source, UTM, Timestamp
    │    Table: tblg49y1OCUhyFmlH (existing Contacts) OR new Quiz Leads table
    │
    ├──► IF heatLevel === "hot"
    │    ├──► Slack notification: "#leads — HOT: {name} from {company} scored {score}/{max} on {quizId}"
    │    ├──► SMS to Mike (via Brevo transactional or Twilio)
    │    └──► Email to prospect: personalized results + Calendly link (send within 5 min)
    │
    ├──► IF heatLevel === "warm"
    │    └──► Add to Airtable with Funnel Stage = "Touch 1 - Quiz Result"
    │         (outreach_engine picks them up for 3-touch accelerated sequence)
    │
    ├──► IF heatLevel === "cold"
    │    └──► Add to Airtable with Funnel Stage = "Touch 1 - Icebreaker"
    │         (outreach_engine picks them up for standard 6-touch nurture)
    │
    └──► ENRICHMENT (lightweight, no Apify):
         ├── Google search: "{company name} site:linkedin.com" → extract company page
         ├── Website fetch: extract industry, team size from About page
         └── Append enrichment data to Airtable record
```

### Email Sequences (extends existing outreach_engine.py pattern)

**Hot leads** — personalized, immediate:
```
Touch 1 (within 5 min): "Your {Quiz Name} Results — {Score}/{Max}"
  - Full score breakdown
  - Personalized recommendations based on their answers
  - "I noticed you're in {industry} — here's a case study from a similar {company type}"
  - Calendly link: "Want me to walk you through this? 15 minutes, no pitch."

Touch 2 (Day 2): Case study relevant to their vertical
Touch 3 (Day 5): "Quick question" — one specific insight from their answers
```

**Warm leads** — value-first, 3-touch:
```
Touch 1 (Day 1): Quiz results + relevant blog post
Touch 2 (Day 3): Case study or video
Touch 3 (Day 7): Soft CTA: "Want to explore this for your business?"
```

**Cold leads** — existing 6-touch nurture from outreach_engine:
```
Touches 1-5: Value content (reports, videos, tools)
Touch 6: The ask
```

---

## 11. Technical Implementation

### Stack
- **Frontend**: React components within existing Next.js site (Pages Router, static export)
- **Data**: JSON config files per quiz in `src/data/quizzes/`
- **Styles**: Extend existing SCSS (new `_quiz-funnel.scss`)
- **Backend**: n8n webhook → Airtable + email routing
- **No new dependencies**: Uses existing Bootstrap, GSAP, SCSS

### New Files

```
src/pages/quiz/
  [quizId].tsx               ← Dynamic route: loads quiz config by ID
  // OR static routes:
  ai-readiness.tsx
  law-firm-audit.tsx
  content-score.tsx
  listing-score.tsx
  cost-calculator.tsx

src/components/quiz/
  QuizFunnel.tsx             ← Main component (renders all screens)
  QuizWelcome.tsx            ← Welcome/start screen
  QuizQuestion.tsx           ← Single question screen (handles all types)
  QuizLeadCapture.tsx        ← Email/name/company capture screen
  QuizResults.tsx            ← Score + recommendation + CTA screen
  QuizProgress.tsx           ← Thin progress bar
  QuizOptionCard.tsx         ← Clickable answer card
  QuizScaleInput.tsx         ← Slider/scale input for calculator quiz
  QuizEmbed.tsx              ← Wrapper that strips header/footer for iframe embeds

src/data/quizzes/
  ai-readiness.json
  law-firm-audit.json
  content-score.json
  listing-score.json
  cost-calculator.json

src/styles/sections/
  _quiz-funnel.scss
```

### Embed Mode

When URL has `?embed=true`:
- Hide site header/footer/nav
- Quiz takes full viewport
- Add `X-Frame-Options: ALLOW` header (or remove it) for iframe embedding
- Provide embed code: `<iframe src="https://theinnovativenative.com/quiz/ai-readiness?embed=true" width="100%" height="700" frameborder="0"></iframe>`

### URL Tracking

Every quiz link supports UTM params:
```
theinnovativenative.com/quiz/ai-readiness?utm_source=linkedin&utm_medium=dm&utm_campaign=april-outreach
```
These get passed through to the webhook and stored in Airtable for attribution.

---

## 12. Deployment Sequence

### MVP (Build First — 1-2 days)

1. **QuizFunnel component library** (reusable across all quizzes)
2. **Quiz #1: AI Automation Readiness** (universal, highest-ticket product)
3. **Quiz #2: Law Firm Automation Audit** (existing content + outreach infrastructure)
4. **n8n webhook workflow** (Airtable + lead routing)
5. **Deploy + test end-to-end**

### Fast Follow (Day 3-4)

6. Quiz #3: Content Production Score
7. Quiz #4: Listing Marketing Score
8. Quiz #5: Cost Calculator
9. Email sequence templates in outreach_engine
10. Embed mode testing

### Ongoing

11. A/B test question order and option text
12. Track question-level drop-off rates
13. Optimize result page CTAs based on conversion data
14. Add new quizzes for new verticals as needed

---

## 13. What This Looks Like as a Portfolio Piece

When Mike sends a quiz link to a prospect, the prospect thinks: "This is what he'd build for ME." The quiz itself is the sales demo. The conversation after goes:

> "Did you take the quiz I sent?"
> "Yeah, it was really well done."
> "That took me a day to build. Imagine what that does for your lead capture. Want me to build one for your business?"

**Pricing for quiz funnel builds**:
- Template quiz (customize questions/branding): $1,500-$3,000
- Custom quiz with n8n automation backend: $3,000-$7,500
- Full quiz + email sequence + CRM integration: $7,500-$15,000

These are high-margin, fast-to-deliver productized services built on the same component library.

---

## 14. Success Criteria

1. Quiz #1 (AI Readiness) live and shareable within 48 hours
2. Quiz #2 (Law Firm) live within 72 hours
3. End-to-end flow works: quiz → webhook → Airtable record → email sent
4. Mobile-responsive, <3s load, accessible
5. Embed mode works in an iframe
6. At least 1 prospect completes quiz within first week of sharing
7. Hot lead alert fires to Slack + SMS within 5 minutes of submission
8. Mike can create a new quiz by duplicating a JSON config file (no code changes needed)

---

## Sources

- [Heyflow — Quiz Funnel Examples](https://heyflow.com/blog/quiz-funnel-examples/)
- [Stormy AI — Quiz Funnel Playbook 2026 (28% conversion rates)](https://stormy.ai/blog/perspective-quiz-funnel-playbook-2026)
- [Perspective — Quiz Funnel Software 2026](https://www.perspective.co/article/quiz-funnel-software)
- [Dashform — Quiz Funnels vs Static Lead Magnets (10x conversion)](https://getaiform.com/blog/quiz-funnels-vs-static-lead-magnets-interactive-content-conversion-2026)
- [LeadQuizzes — Campaign Conversion Quiz Funnel](https://www.leadquizzes.com/campaign-conversion-quiz-funnel/)
- [Digioh — Lead Generation Quiz Strategy](https://www.digioh.com/blog/lead-generation-quiz)
- [MakeAutomation — Automation Readiness Assessment](https://makeautomation.co/automation-readiness-assessment/)
- [NerdWallet — How Much House Can I Afford Calculator](https://www.nerdwallet.com/mortgages/calculators/how-much-house-can-i-afford)
