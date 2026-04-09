# Data Model: PI Law Firm Content Engine v2

**Feature**: 036-pi-content-value-system
**Date**: 2026-04-09
**Phase**: 1 (Design)

This feature has no database schema changes. All "data" is either (a) content stored as markdown files in the repo, (b) UI state in React components, (c) wire format for the existing n8n webhook, or (d) infrastructure config (the vanity redirect map). The entities below are conceptual — they exist to make contracts concrete and to anchor the task breakdown in `/speckit.tasks`.

---

## Entities

### 1. LeadMagnet

**Represents**: A downloadable deliverable given to readers in exchange for their email. Each magnet exists in three synchronized forms: source markdown, generated PPTX, and a landing page.

**Canonical storage**: `projects/002-stan-store-lawfirm-funnel/content/lead-magnets/<slug>.md`

**Fields (markdown frontmatter)**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `slug` | string | yes | Kebab-case identifier, matches filename and resource page name. Example: `demand-letter-matrix`. |
| `title` | string | yes | Human-readable title shown on the landing page hero. |
| `subtitle` | string | yes | 1-2 sentence description shown under the title. |
| `bullets` | string[] | yes | 4-6 value bullets. Each is a single line describing what the reader gets. |
| `vanity_slug` | string | yes | Short URL path on buildmytribe.ai. Example: `demand`. |
| `pptx_filename` | string | yes | PPTX filename deployed to `public/assets/lead-magnets/`. |
| `source` | string | no | Research source or attribution for factual claims in the magnet. |
| `voice_calibration` | string | yes | Reference to an existing magnet whose voice was used as the style target. Example: `ai-governance-template-pi`. |
| `page_count` | integer | yes | Target slide count for the PPTX. 4-8 for most; 1 for the discovery-ai overview. |
| `status` | enum | yes | `draft` | `review` | `published`. |

**Derived fields**:
- `markdown_path`: `projects/002-stan-store-lawfirm-funnel/content/lead-magnets/<slug>.md`
- `pptx_deploy_path`: `projects/website/public/assets/lead-magnets/<pptx_filename>`
- `landing_page_path`: `projects/website/src/pages/resources/<slug>.tsx`
- `landing_page_url`: `https://theinnovativenative.com/resources/<slug>`
- `vanity_url`: `https://buildmytribe.ai/<vanity_slug>`
- `download_url`: `https://theinnovativenative.com/assets/lead-magnets/<pptx_filename>`

**Relationships**:
- 1:1 with **ResourceLandingPage**
- 1:1 with **VanityRedirect**
- 1:N with **PostRewrite** (one magnet may be referenced by multiple posts across days)

**Lifecycle**:
```
draft → review (after Mike QAs PPTX rendering) → published (after deploy)
```

---

### 2. ResourceLandingPage

**Represents**: A TSX page in the Next.js pages directory that renders the `ResourceGate` component with props specific to one lead magnet.

**Canonical storage**: `projects/website/src/pages/resources/<slug>.tsx`

**Fields (TSX page-level)**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | yes | Passed to ResourceGate `title` prop. Also used in `<Head>` title tag. |
| `subtitle` | string | yes | Passed to ResourceGate `subtitle` prop. Also used in meta description. |
| `bullets` | string[] | yes | 4-6 bullets passed to ResourceGate `bullets` prop. |
| `leadMagnetId` | string | yes | Unique identifier matching the LeadMagnet `slug`. Used as the `leadMagnet` tag in the form submission payload. |
| `downloadUrl` | string (absolute URL) | yes | Full URL to the PPTX file. Matches LeadMagnet `download_url`. |

**SEO meta (required for every page)**:
- `<title>`: `<LeadMagnet.title> | The Innovative Native`
- `<meta name="description">`: LeadMagnet.subtitle
- `<meta property="og:title">`: LeadMagnet.title
- `<meta property="og:description">`: LeadMagnet.subtitle
- `<meta property="og:url">`: LeadMagnet.landing_page_url
- `<meta property="og:type">`: `website`
- `<link rel="canonical">`: LeadMagnet.landing_page_url

**Relationships**:
- 1:1 with **LeadMagnet**
- N:1 with **ResourceHubIndex** (the `/resources` index page lists all ResourceLandingPages)

**Implementation constraint**: MUST reuse existing `ResourceGate` component without forking (per FR-014). The page file is a ~50-line wrapper that supplies props.

---

### 3. LeadSubmission

**Represents**: A form submission from a ResourceGate form, posted as JSON to the n8n cerebro-lead webhook.

**Wire format**: JSON POST body. See [contracts/lead-form-submission.schema.json](./contracts/lead-form-submission.schema.json) for the full JSON Schema.

**Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `firstName` | string | yes | Min length 1 after trim. |
| `email` | string (email format) | yes | Valid RFC 5322 email. |
| `firmName` | string \| null | no | Trimmed or null if empty. |
| `practiceArea` | string \| null | no | One of the predefined PRACTICE_AREAS enum values, or null. |
| `leadMagnet` | string | yes | The slug identifying the magnet, OR `newsletter-signup` for newsletter-only submissions. |
| `source` | string | yes | `resource-page` for resource downloads, `newsletter-page` for direct newsletter signups, `resource-page-newsletter-optin` for the secondary newsletter POST from the success state. |
| `utm_source` | string | no | Forwarded from URL. |
| `utm_medium` | string | no | Forwarded from URL. |
| `utm_campaign` | string | no | Forwarded from URL. |
| `utm_content` | string | no | Forwarded from URL. |
| `utm_term` | string | no | Forwarded from URL. |
| `fbclid` | string | no | Facebook Click ID. |
| `gclid` | string | no | Google Click ID. |
| `li_fat_id` | string | no | LinkedIn Click ID. |
| `timestamp` | string (ISO 8601) | yes | Client-side timestamp at submission. |

**Validation rules**:
- `firstName` required and non-empty after trim.
- `email` required, matches email regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
- `leadMagnet` must be one of: `<the 13 resource slugs>` OR `newsletter-signup`.
- `source` must match the submitting component.
- UTM fields are optional; absence does not fail validation.

**State transitions**:
```
draft (in React state) → submitting (loading flag) → success (unlocked) OR error (recoverable)
```

**Relationships**:
- N:1 with **ResourceLandingPage** (many submissions per page over time)
- 0:1 with a follow-up "newsletter opt-in" LeadSubmission (when user checks the opt-in box after download)

---

### 4. VanityRedirect

**Represents**: A single entry in the buildmytribe.ai slug → destination map, served by the Cloudflare Worker.

**Canonical storage**: `infrastructure/buildmytribe-shortener/redirect-map.json`

**Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `slug` | string | yes | Short path on buildmytribe.ai (without leading slash). Example: `audit`. |
| `destination` | string (absolute URL) | yes | Full HTTPS URL to redirect to. Example: `https://theinnovativenative.com/resources/5-pattern-audit-workbook`. |
| `status` | integer | yes | HTTP status code for the redirect. Default 301. |
| `preserve_query` | boolean | yes | When true, the Worker appends the incoming query string to the destination. Default true. |

**JSON file format** (see [contracts/vanity-redirect-map.schema.json](./contracts/vanity-redirect-map.schema.json)):

```json
{
  "root": {
    "destination": "https://theinnovativenative.com/resources",
    "status": 301,
    "preserve_query": true
  },
  "redirects": [
    {
      "slug": "audit",
      "destination": "https://theinnovativenative.com/resources/5-pattern-audit-workbook",
      "status": 301,
      "preserve_query": true
    }
  ]
}
```

**Minimum slug set (FR-034)**: 14 entries total — 6 for existing magnets, 7 for new magnets, 1 for root.

**Relationships**:
- 1:1 with **LeadMagnet** (except the root entry, which has no LeadMagnet)
- 1:1 with **ResourceLandingPage** via the destination URL

**Lifecycle**: Static. Changed only when a new lead magnet is added. Version-controlled.

---

### 5. PostRewrite

**Represents**: A single post's content in the new 5-section structure, replacing the existing post in the week-03 or week-04 markdown file.

**Canonical storage**: `projects/002-stan-store-lawfirm-funnel/content/weekly-content/week-<NN>-apr-<range>.md` (not a separate file — posts are inline sections within the weekly file)

**Structure (5 required sections per post)**:
| Section | Role | Length guideline |
|---------|------|------------------|
| **HOOK** | Stat, tension, or specific pain statement | 1-3 sentences |
| **WHY** | Root cause of the problem | 1-2 sentences |
| **PLAY** | 3-5 specific actions the reader can take today | 40-80% of total word count |
| **PROOF** | The metric, source, or tool name that makes the play credible | 1-3 sentences |
| **UPGRADE** | CTA to the vanity short URL | 1 sentence + the URL |

**Fields (metadata implicit in the markdown heading structure)**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `day` | integer | yes | Day number (15-28 for this feature). |
| `date` | string (YYYY-MM-DD) | yes | Calendar date. |
| `platform` | enum | yes | `linkedin` \| `facebook` \| `instagram`. |
| `format` | enum | yes | `text` \| `carousel` \| `video` \| `image` \| `reel` \| `link_share`. |
| `core_idea` | string | yes | One-sentence topic summary (already present in existing posts). |
| `linked_magnet_slug` | string | yes | Which LeadMagnet this post upgrades to. Must match a real magnet slug. |
| `word_count` | integer | no | Total body word count. Target: 250-350 for LinkedIn text posts. |
| `play_action_count` | integer | yes | Number of specific actions in the PLAY section. Must be 3-5. |

**Validation rules**:
- Every post MUST contain all 5 sections (enforced by pre-publish linter).
- Every post's UPGRADE section MUST contain a valid `buildmytribe.ai/<slug>` URL that maps to an existing VanityRedirect entry.
- LinkedIn text (Post 1) word count MUST be 250-350.
- LinkedIn carousels MUST have 7-8 slides with ≥2 PLAY slides.
- No "link in bio" language remains in any post.

**Relationships**:
- N:1 with **LeadMagnet** (via `linked_magnet_slug`)
- N:1 with parent `week-XX.md` file

**Lifecycle**:
```
draft → rewritten → published (once Mike publishes it to the platform)
```

Publishing state is tracked outside this spec (Airtable Publishing Calendar).

---

### 6. ResourceHubIndex

**Represents**: The `/resources` landing page that lists all 13 resources and provides the newsletter signup CTA.

**Canonical storage**: `projects/website/src/pages/resources/index.tsx`

**Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `resources` | ResourceCard[] | yes | Array of all 13 resources in display order. |
| `newsletter_cta_variant` | enum | yes | `inline-banner` \| `sticky-footer` \| `hero-above-fold`. Display treatment for the newsletter CTA. |

**ResourceCard sub-structure**:
| Field | Type | Required |
|-------|------|----------|
| `title` | string | yes |
| `subtitle` | string | yes |
| `slug` | string | yes (matches a LeadMagnet.slug) |
| `vanity_slug` | string | yes |
| `category` | enum | yes — one of: `intake`, `ai-tools`, `governance`, `discovery`, `operations`, `diagnostics` |
| `download_url` | string | yes |

**Behavior**: Static, client-navigable list. No form or state. Each card is a link to its ResourceLandingPage. Newsletter CTA is a visible element (inline banner recommended) that links to `/newsletter`.

**Relationships**:
- 1:N with **ResourceLandingPage** (lists all 13)

---

## Entity Relationship Summary

```
LeadMagnet (1) ──────────── (1) ResourceLandingPage
    │                             │
    │                             │
    ├──── (1:1) ─── VanityRedirect│
    │                             │
    └──── (1:N) ─── PostRewrite   │
                                  │
                          (N:1)   │
                          ResourceHubIndex
                                  │
                          (1:N)   │
                          LeadSubmission
```

## State Across the System

At any point in time, for a given magnet `demand-letter-matrix`:
1. **Markdown source** at `projects/002-stan-store-lawfirm-funnel/content/lead-magnets/demand-letter-matrix.md`
2. **PPTX artifact** at `projects/website/public/assets/lead-magnets/demand-letter-matrix.pptx`
3. **Landing page TSX** at `projects/website/src/pages/resources/demand-letter-matrix.tsx`
4. **Vanity redirect entry** in `infrastructure/buildmytribe-shortener/redirect-map.json`
5. **Post references** in `week-03-apr-15-21.md` (Day 16 posts) linking to `buildmytribe.ai/demand`
6. **Hub index entry** in `projects/website/src/pages/resources/index.tsx`

All six must be synchronized. The pre-publish linter (Phase 5 implementation task) verifies that every magnet referenced in post files has all 6 artifacts present.

## Validation & Integrity

- **Slug uniqueness**: Every LeadMagnet.slug is unique across the 13 magnets. Enforced by file naming (two files can't have the same name in one folder).
- **Vanity slug uniqueness**: Every VanityRedirect.slug is unique across the 14 redirects. Enforced by the JSON schema (`uniqueItems` on the redirects array).
- **Referential integrity**: Every PostRewrite.linked_magnet_slug must exist as a LeadMagnet.slug. Enforced by the pre-publish linter (Phase 5).
- **File integrity**: Every LeadMagnet.pptx_filename must exist on disk at `public/assets/lead-magnets/` before deploy. Enforced by the pre-deploy check (Phase 6).
