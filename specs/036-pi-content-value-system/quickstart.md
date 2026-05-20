# Quickstart: PI Content Value System

**Feature**: 036-pi-content-value-system
**Audience**: Any developer or agent dropping into this feature cold.
**Time to onboarded**: 10 minutes.

---

## 1. What this feature does (60 seconds)

Weeks 3 and 4 of Mike's PI lawyer content campaign were draining reader attention without delivering any in-post value, AND the delivery infrastructure behind the post CTAs was broken in 6 ways. This feature fixes both. Every post gets a 5-section structure (Hook → Why → Play → Proof → Upgrade) where the Play section gives the reader 3-5 specific actions they can take without clicking any link. Every post CTA points to a working vanity URL on buildmytribe.ai that redirects to a resource landing page with a working form and a working PPTX download. Every download success state offers a newsletter opt-in.

## 2. What's already built (don't rebuild)

- 6 lead magnets (markdown + PPTX) in `projects/002-stan-store-lawfirm-funnel/content/lead-magnets/`
- 6 resource landing pages at `projects/website/src/pages/resources/*.tsx`
- `ResourceGate` component — the stable, reused form/capture/download engine
- `NewsletterSignup` component at `/newsletter`
- n8n `cerebro-lead` webhook (behavior to be documented in Phase 1)
- Airtable Leads table accepting all submissions
- Existing spec `020-branded-url-shortener` (reference only; we use a simpler Worker for this feature)

## 3. What this feature adds (build list)

### Code changes
- **1 component modification**: `ResourceGate.tsx` gains a newsletter opt-in checkbox in the success state
- **7 new resource landing pages** (thin wrappers around ResourceGate)
- **1 new hub index page** at `/resources`
- **1 modification to** `src/data/navigation.ts` to add a Resources nav entry
- **1 new Playwright smoke test** at `projects/website/e2e/resources.spec.ts`

### Content changes
- **7 new lead magnet markdown sources** in `projects/002-stan-store-lawfirm-funnel/content/lead-magnets/`
- **7 new PPTX files** generated via pptx-generator skill, deployed to `projects/website/public/assets/lead-magnets/`
- **6 existing PPTX files copied** from the project folder to the website public folder (currently missing — this is the root cause of the 404s)
- **~126 posts rewritten** in `week-03-apr-15-21.md` and `week-04-apr-22-28.md` using the 5-section structure

### Infrastructure changes
- **1 Cloudflare Worker** at `infrastructure/buildmytribe-shortener/worker.js` + `redirect-map.json` + `DEPLOY.md`
- **Mike manually deploys the Worker** (we do not have DNS/Cloudflare credentials)

## 4. How to add a new resource page (10 minutes)

Given: a new lead magnet markdown source exists at `projects/002-stan-store-lawfirm-funnel/content/lead-magnets/<slug>.md` with the PPTX already generated and deployed to `projects/website/public/assets/lead-magnets/<slug>.pptx`.

### Step 1: Copy the pattern file

```bash
cp projects/website/src/pages/resources/442-intake-math.tsx \
   projects/website/src/pages/resources/<slug>.tsx
```

### Step 2: Replace the component name, title, subtitle, bullets

Open the new file and edit these five things:

```tsx
// 1. Component name (must match the import at the bottom)
const DemandLetterMatrix = () => {
  // ...
};

// 2. Title, subtitle (hero section)
<ResourceGate
  title="AI Demand Letter Tool Comparison Matrix + ROI Calculator"
  subtitle="Side-by-side comparison of 4 AI demand letter tools, with a plug-in ROI calculator for your firm's case volume."
  bullets={BULLETS}
  leadMagnetId="demand-letter-matrix"
  downloadUrl="https://theinnovativenative.com/assets/lead-magnets/demand-letter-matrix.pptx"
/>

// 3. BULLETS constant at top
const BULLETS = [
  '4-tool matrix: EvenUp, Tavrn, Filevine DemandsAI, Supio',
  'Editable ROI calculator: enter your case volume, see first-year savings',
  'Red flags to watch for in every demand letter AI demo',
  'Decision tree: which tool fits your firm size and case mix',
];

// 4. <title>, meta description, OG tags in <Head>
<title>AI Demand Letter Tool Comparison Matrix | The Innovative Native</title>

// 5. Export at bottom matches component name
export default DemandLetterMatrix;
```

### Step 3: Add to the /resources hub index

Open `projects/website/src/pages/resources/index.tsx` and add an entry to the `RESOURCES` array:

```tsx
{
  title: 'AI Demand Letter Tool Comparison Matrix',
  subtitle: 'Side-by-side comparison of 4 AI demand letter tools...',
  slug: 'demand-letter-matrix',
  vanitySlug: 'demand',
  category: 'operations',
  downloadUrl: 'https://theinnovativenative.com/assets/lead-magnets/demand-letter-matrix.pptx',
}
```

### Step 4: Add a vanity redirect

Open `infrastructure/buildmytribe-shortener/redirect-map.json` and add:

```json
{
  "slug": "demand",
  "destination": "https://theinnovativenative.com/resources/demand-letter-matrix",
  "status": 301,
  "preserve_query": true
}
```

### Step 5: Build and test

```bash
cd projects/website
npm run build
```

TypeScript errors → fix. Build passes → start dev server and hit `/resources/<slug>` to verify the form renders.

### Step 6: Run the Playwright smoke test

```bash
npx playwright test e2e/resources.spec.ts
```

Test should find the new page and validate form rendering.

### Step 7: Commit

```bash
git add projects/website/src/pages/resources/<slug>.tsx \
        projects/website/src/pages/resources/index.tsx \
        infrastructure/buildmytribe-shortener/redirect-map.json
git commit -m "feat(036): add <slug> resource page and vanity redirect"
```

## 5. How to author a new lead magnet (1-2 hours)

### Step 1: Start from a calibration sample

Read the existing magnet whose voice is closest to the new topic. Options:

| New magnet topic | Voice calibration source |
|------------------|--------------------------|
| Demand letters, intake, operations | `442-intake-math-pi.md` |
| AI tools, vendor comparison | `5-ai-tools-pi-firms.md` |
| Governance, policy, compliance | `ai-governance-template-pi.md` |
| Legal/ruling analysis | `heppner-executive-one-pager.md` |

Copy 2 paragraphs from the calibration source into a temporary notes file. These are your voice anchors.

### Step 2: Draft the markdown

Create `projects/002-stan-store-lawfirm-funnel/content/lead-magnets/<slug>.md`:

```yaml
---
slug: <slug>
title: "<Human-readable title>"
subtitle: "<1-2 sentence description>"
bullets:
  - "Bullet 1"
  - "Bullet 2"
  - "Bullet 3"
  - "Bullet 4"
vanity_slug: <short-slug>
pptx_filename: <slug>.pptx
voice_calibration: <calibration-source-slug>
page_count: 6
status: draft
category: operations
source: "Research attribution if applicable"
created: 2026-04-09
---

# <Title>

## Slide 1 — Title

<Hook stat or tension>

## Slide 2 — The Problem

<1-paragraph context>

## Slide 3 — The Play

<3-5 specific actions>

## Slide 4 — The Proof

<Source data or named tool>

## Slide 5 — The Framework / Matrix / Checklist

<The deliverable's actual value>

## Slide 6 — Next Step

<One specific thing to do this week>
```

### Step 3: Generate the PPTX

Invoke the pptx-generator skill with the markdown file and the `innovative-native` brand:

```
/pptx-generator generate <path-to-markdown.md> --brand innovative-native
```

Output: a PPTX file in the pptx-generator output directory. Move it to `projects/website/public/assets/lead-magnets/<slug>.pptx`.

### Step 4: Visual QA

Open the PPTX in PowerPoint or Keynote. Check:
- Hero slide reads well
- Content slides have the dark background
- No overflowing text, no cut-off images
- Page count matches the frontmatter

If something looks wrong, adjust the markdown and regenerate.

## 6. How to rewrite a post to the new 5-section structure

### Step 1: Read the existing post

Open `projects/002-stan-store-lawfirm-funnel/content/weekly-content/week-<NN>-apr-<range>.md`. Find the day and post you're rewriting.

### Step 2: Apply the 5-section template

For a LinkedIn text post:

```
**Post Body:**

<HOOK — 1-3 sentences with a stat or sharp pain statement>

<WHY — 1-2 sentences explaining the root cause>

Here's the play.

<PLAY — 3-5 specific actions in a bullet list or numbered list. Each action is
something the reader can do this week. Naming tools is OK. Never say "consider"
or "think about" — always a specific, executable action.>

<PROOF — 1-2 sentences citing the metric, source, or tool that makes the play
credible. Include attribution.>

<UPGRADE — 1 sentence offering the free resource, with the vanity URL.
Example: "Free decision matrix: the 4 demand letter tools scored head-to-head.
buildmytribe.ai/demand">

**First Comment:**
<Keep the existing hashtags. Optional: add a second line pointing to the full resource.>
```

### Step 3: Word count check

- LinkedIn text post: 250-350 words total body
- LinkedIn carousel: 7-8 slides with ≥2 Play slides
- Facebook, Instagram: keep the same structure but adjusted to platform norms

### Step 4: Verify the upgrade URL

- The vanity URL (e.g., `buildmytribe.ai/demand`) MUST match an entry in `infrastructure/buildmytribe-shortener/redirect-map.json`.
- If it doesn't, the post cannot be published until the redirect is added.

## 7. Build, deploy, test (Phase 6 — gated behind Mike's approval)

```bash
cd projects/website
npm run build
# Check for TypeScript errors. Fix and rebuild.

npx playwright test e2e/ --reporter=list
# All tests must pass.

# Deploy per projects/website/CLAUDE.md:
rsync -avz --delete \
  -e "ssh -i ~/.ssh/a2hosting_tin -p 7822 -o IdentitiesOnly=yes" \
  --exclude='theinnovativenative-site.zip' \
  --exclude='resumes/' --exclude='videos/' --exclude='n8n-templates/' \
  /Users/makwa/theinnovativenative/projects/website/out/ \
  delikate@75.98.175.76:~/theinnovativenative.com/

# Fix directory index files (required after every deploy):
ssh -i ~/.ssh/a2hosting_tin -p 7822 -o IdentitiesOnly=yes \
    delikate@75.98.175.76 \
  "cd ~/theinnovativenative.com && for name in blog classroom community members messages templates admin checklist checkout auth resources; do [ -f \${name}.html ] && [ -d \${name} ] && cp \${name}.html \${name}/index.html 2>/dev/null; done"
```

## 8. Smoke test on live domain (Phase 6 — after deploy)

1. Visit `https://theinnovativenative.com/resources/demand-letter-matrix`
2. Fill form with a test email (e.g., `qa-036-<timestamp>@theinnovativenative.com`)
3. Submit → verify success state renders
4. Click Download → verify PPTX downloads and opens cleanly
5. Check the newsletter opt-in checkbox
6. Go to Airtable Leads table → verify TWO records exist for the test email (one for `demand-letter-matrix`, one for `newsletter-signup`)
7. Test a vanity URL: `curl -I https://buildmytribe.ai/demand` → expect 301 to the resource page

If any step fails, stop. Do not publish any posts. Investigate and fix.

## 9. Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Resource page 404 on deploy | Page not listed in `navigation.ts` OR build failed to include it | Check `npm run build` output, verify `.html` exists in `out/resources/` |
| Form submit shows "temporarily unavailable" | `NEXT_PUBLIC_LEAD_WEBHOOK_URL` not set in production env | Set env var, redeploy |
| PPTX download 404 | File not copied to `public/assets/lead-magnets/` OR deploy excluded it | Copy the file, check rsync excludes, redeploy |
| Vanity URL returns no redirect | Cloudflare Worker not deployed OR slug missing from map | Mike redeploys the worker with updated map |
| Newsletter checkbox does nothing | Second POST not wired OR checkbox state not tracked | Check ResourceGate component state management |
| Post contains `buildmytribe.ai/resources/...` (old format) | Pre-publish linter was skipped | Run the linter, fix the post, recommit |

## 10. File map reference

```
specs/036-pi-content-value-system/
├── spec.md                      ← what and why
├── plan.md                      ← how and in what order
├── research.md                  ← unknowns resolved
├── data-model.md                ← entities and fields
├── quickstart.md                ← this file
├── contracts/
│   ├── lead-form-submission.schema.json
│   ├── resource-gate-props.md
│   ├── vanity-redirect-map.schema.json
│   └── lead-magnet-frontmatter.schema.json
├── checklists/
│   └── requirements.md
├── qa/
│   └── SUMMARY.md               ← created in toughlove step
└── tasks.md                     ← created in /speckit.tasks
```

## 11. Golden rules

1. **Do NOT fork ResourceGate.** Reuse the component.
2. **Do NOT edit n8n workflows.** Read only. Mike tests all n8n changes.
3. **Do NOT deploy without Mike's approval** (stop before Phase 6).
4. **Do NOT commit dirty 034 branch files.** Use `git add <explicit-file>`, never `git add .`.
5. **Every new magnet MUST have a `voice_calibration` field** pointing to an existing magnet.
6. **Every post upgrade CTA MUST be a buildmytribe.ai vanity URL** that exists in the redirect map.
7. **Every new landing page MUST include SEO meta** (title, description, OG tags, canonical).
8. **PPTX files go in `projects/website/public/assets/lead-magnets/`** (NOT in the project folder after Phase 1).
9. **Day 15 publishes first** — it's the April 15 deadline and reuses existing `5-ai-tools-pi` so it's the least risky.
10. **When in doubt, compare to `442-intake-math.tsx`** — that page is the canonical reference for the resource landing page pattern.
