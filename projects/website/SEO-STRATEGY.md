# SEO Strategy: theinnovativenative.com

> Comprehensive SEO playbook for a Next.js 13.4.19 static export site hosted on Hostinger.
> Last updated: 2026-03-09

---

## Table of Contents

1. [Current State Audit](#1-current-state-audit)
2. [Technical SEO Prerequisites](#2-technical-seo-prerequisites)
3. [On-Page SEO](#3-on-page-seo)
4. [Schema Markup (Structured Data)](#4-schema-markup-structured-data)
5. [Page-by-Page SEO Strategy](#5-page-by-page-seo-strategy)
6. [Next.js Static Export SEO Considerations](#6-nextjs-static-export-seo-considerations)
7. [Off-Page SEO](#7-off-page-seo)
8. [Performance / Core Web Vitals](#8-performance--core-web-vitals)
9. [SEO Tools to Configure](#9-seo-tools-to-configure)
10. [Implementation Priority Checklist](#10-implementation-priority-checklist)

---

## 1. Current State Audit

### What Exists

| Item | Status | Notes |
|------|--------|-------|
| SEO component (`src/components/common/SEO.tsx`) | Partial | Used only on blog pages. Product pages use raw `<Head>` tags with inconsistent coverage. |
| Title tags | Partial | Homepage and product pages have titles. Portfolio, Professional Experience, Classroom lack them. |
| Meta descriptions | Partial | Homepage and products have descriptions. Other pages missing. |
| Open Graph tags | Partial | Product pages have OG tags. Homepage, blog index, portfolio, professional experience missing. |
| Twitter Cards | Partial | Product pages only. |
| Canonical URLs | Missing | Only in the SEO.tsx component (unused on most pages). |
| robots.txt | Missing | No file exists in `public/`. |
| sitemap.xml | Missing | No sitemap generation configured. |
| JSON-LD Schema | Partial | Blog posts have BlogPosting schema. Products have Product schema. No Organization, Person, or FAQ schema. |
| noindex on gated pages | Good | Dashboard, checkout, auth callback, classroom all have `noindex`. |
| 404 page | Exists | No Head/meta tags on it. |
| Font loading | Suboptimal | Google Fonts loaded via CSS `@import` in SCSS (render-blocking). Should use `next/font` or `<link rel="preload">`. |
| Image optimization | Disabled | `images: { unoptimized: true }` in next.config.js (required for static export). |
| .htaccess | Missing | No HTTPS enforcement or redirect rules. |
| GA4 | Missing | No analytics tracking configured. |
| Google Search Console | Unknown | Not referenced in codebase. |

### Critical Gaps (Priority Order)

1. No `robots.txt` -- crawlers have no directives
2. No `sitemap.xml` -- Google cannot discover all pages efficiently
3. No canonical URLs on most pages -- risk of duplicate content
4. No Organization or Person schema -- Google cannot build entity graph
5. Homepage lacks OG/Twitter tags -- poor social sharing
6. Font loaded via CSS @import -- render-blocking, hurts LCP
7. No GA4 or Search Console -- zero visibility into search performance
8. No .htaccess -- no HTTPS enforcement or clean URL redirects

---

## 2. Technical SEO Prerequisites

### 2.1 robots.txt

Create `public/robots.txt`:

```
User-agent: *
Allow: /

# Block utility and gated routes
Disallow: /dashboard
Disallow: /classroom/
Disallow: /auth/
Disallow: /checkout/
Disallow: /api/

# Block Next.js internals (but NOT /_next/ — blocking that prevents Googlebot from rendering)
Disallow: /_next/data/

Sitemap: https://theinnovativenative.com/sitemap.xml
```

**Critical:** Do NOT block `/_next/static/` or `/_next/`. Googlebot needs these to render JavaScript-generated content.

### 2.2 sitemap.xml Generation

Install and configure `next-sitemap`:

```bash
npm install --save-dev next-sitemap
```

Create `next-sitemap.config.js` at project root:

```js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://theinnovativenative.com',
  generateRobotsTxt: false, // We maintain robots.txt manually for more control
  generateIndexSitemap: false, // Small site, single sitemap is fine
  outDir: './public', // Output to public/ for static export
  changefreq: 'weekly',
  priority: 0.7,
  exclude: [
    '/dashboard',
    '/classroom/*',
    '/auth/*',
    '/checkout/*',
    '/404',
    '/workflow-demo',
  ],
  transform: async (config, path) => {
    // Custom priority per page type
    const priorities = {
      '/': 1.0,
      '/law-firm-rag': 0.9,
      '/haven-blueprint': 0.9,
      '/visionspark-re': 0.9,
      '/blog': 0.8,
      '/portfolio': 0.7,
      '/professionalExperience': 0.6,
      '/templates': 0.7,
    };

    return {
      loc: path,
      changefreq: path === '/' ? 'weekly' : path.startsWith('/blog') ? 'weekly' : 'monthly',
      priority: priorities[path] || config.priority,
      lastmod: new Date().toISOString(),
    };
  },
};
```

Add to `package.json` scripts:

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "next-sitemap",
    "dev": "next dev",
    "start": "next start",
    "lint": "next lint"
  }
}
```

The sitemap generates into `public/` after build, so it ships with the static export.

### 2.3 Canonical URLs

Every indexable page MUST have a canonical URL. The existing `SEO.tsx` component handles this, but most pages bypass the component and use raw `<Head>` tags.

**Action:** Migrate all pages to use the `SEO.tsx` component, or add canonical link tags to every page:

```tsx
<link rel="canonical" href="https://theinnovativenative.com/law-firm-rag" />
```

Rules:
- Always use the full absolute URL with `https://`
- Always use the preferred URL format (with or without trailing slash -- pick one and be consistent)
- Self-referencing canonicals on every page (a page's canonical points to itself)
- Blog posts: canonical should be the clean slug URL

### 2.4 SSL / HTTPS on Hostinger

Hostinger provides free SSL via Let's Encrypt. Verify it is active in hPanel > SSL.

Create or update `public/.htaccess` for HTTPS enforcement:

```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Force non-www (or www, pick one)
RewriteCond %{HTTP_HOST} ^www\.theinnovativenative\.com [NC]
RewriteRule ^(.*)$ https://theinnovativenative.com/$1 [L,R=301]

# Handle Next.js static export client-side routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /$1.html [L]

# Custom 404
ErrorDocument 404 /404.html
```

### 2.5 Trailing Slashes

Add to `next.config.js`:

```js
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: false, // URLs without trailing slash (e.g., /blog not /blog/)
  images: {
    unoptimized: true,
  },
}
```

**Pick one convention and stick with it.** Without trailing slash is the standard for this type of site. The canonical URL, sitemap, and internal links must all match.

### 2.6 Meta Robots Tags

Pages that should be indexed need no robots meta tag (default is `index, follow`). Pages that should NOT be indexed need:

```tsx
<meta name="robots" content="noindex, nofollow" />
```

| Page | Robots Directive |
|------|-----------------|
| Homepage `/` | index, follow (default) |
| `/law-firm-rag` | index, follow |
| `/haven-blueprint` | index, follow |
| `/visionspark-re` | index, follow |
| `/blog` | index, follow |
| `/blog/[slug]` | index, follow |
| `/portfolio` | index, follow |
| `/professionalExperience` | index, follow |
| `/templates` | index, follow |
| `/templates/[slug]` | index, follow |
| `/dashboard` | noindex, nofollow |
| `/classroom/*` | noindex, nofollow |
| `/checkout/*` | noindex, nofollow |
| `/auth/*` | noindex, nofollow |
| `/workflow-demo` | noindex, nofollow |
| `/templates/download` | noindex, nofollow |
| `/templates/terms` | noindex, nofollow |
| `/templates/refund-policy` | noindex, nofollow |
| `/404` | noindex |

### 2.7 301 Redirects

Since Next.js `redirects` in `next.config.js` do not work with static export, all redirects must be handled in `.htaccess`:

```apache
# Example: if you rename a page
Redirect 301 /old-page https://theinnovativenative.com/new-page

# Redirect /professional-experience to /professionalExperience (if someone types the dashed version)
Redirect 301 /professional-experience https://theinnovativenative.com/professionalExperience
```

### 2.8 404 Page SEO

Update `src/pages/404.tsx` to include proper meta tags:

```tsx
<Head>
  <title>Page Not Found | The Innovative Native</title>
  <meta name="robots" content="noindex" />
</Head>
```

---

## 3. On-Page SEO

### 3.1 Title Tag Best Practices

**Format:** `Primary Keyword - Secondary Keyword | Brand Name`

**Rules:**
- 50-60 characters (Google displays ~60 characters max on desktop)
- Primary keyword as early as possible in the title
- Every page must have a unique title
- Include brand name at the end, separated by `|` or `-`
- Use "trigger words" to drive clicks: How, What, Best, Complete, Guide, System, Blueprint

**Specific titles for each page:**

| Page | Recommended Title | Characters |
|------|-------------------|------------|
| Homepage | `AI Systems for Business - Automation Consulting \| The Innovative Native` | 70 |
| Law Firm RAG | `Legal AI System - Private RAG for Law Firms \| The Innovative Native` | 65 |
| Haven Blueprint | `AI Influencer Blueprint - Create Virtual Content Creators \| TIN` | 63 |
| VisionSpark RE | `AI Listing Videos for Real Estate Agents \| The Innovative Native` | 63 |
| Blog | `AI Automation Blog - Systems, Workflows & Strategy \| TIN` | 56 |
| Portfolio | `AI Projects & Case Studies \| The Innovative Native` | 50 |
| Professional Experience | `Michael Soto - AI Systems Architect & Consultant \| TIN` | 54 |
| Templates | `n8n Workflow Templates - Production-Ready Automations \| TIN` | 58 |

### 3.2 Meta Description Best Practices

**Rules:**
- 140-160 characters (Google truncates at ~160 on desktop, ~120 on mobile)
- Include primary keyword naturally within the first 100 characters
- Include a call-to-action or value proposition
- Each page must have a unique description
- Do not keyword-stuff

**Specific descriptions for each page:**

| Page | Recommended Description |
|------|------------------------|
| Homepage | `We build AI infrastructure that replaces fragmented SaaS stacks. Automated workflows, data pipelines, and AI agents for legal, creative, and real estate businesses. Book a discovery call.` (178 chars -- trim to 155) |
| Law Firm RAG | `Private AI trained on your firm's briefs and case law. Search 10,000+ documents in seconds. SOC 2 ready. Built for solo practitioners to mid-size firms.` (152 chars) |
| Haven Blueprint | `Build your own AI influencer from scratch. The exact system behind aSliceOfHaven -- from image generation to automated video production. No coding required.` (155 chars) |
| VisionSpark RE | `AI-staged photos and generative walkthrough video for real estate listings. True Veo 3.1 property video, branded reels, MLS-ready. Under $10 per listing.` (153 chars) |
| Blog | `AI automation insights, n8n workflow tutorials, and systems architecture strategy. Practical guides from a builder, not a theorist.` (130 chars) |
| Portfolio | `Case studies and completed AI systems: legal RAG, AI influencers, real estate automation, and n8n workflow architecture.` (119 chars) |
| Professional Experience | `Michael Soto -- 18+ years building systems that create leverage. AI strategy, n8n architecture, growth infrastructure.` (118 chars) |

### 3.3 Heading Hierarchy

**Rules:**
- Exactly ONE `<h1>` per page -- this is the page's primary topic signal
- `<h2>` for major sections
- `<h3>` for subsections within an `<h2>`
- Never skip levels (e.g., no `<h1>` directly to `<h3>`)
- Include primary or secondary keywords naturally in headings
- Do not use heading tags for styling -- use CSS classes instead

**Audit current pages:** Several sections use `<h2 className="title">` which is correct. Verify each page has exactly one `<h1>` and that no headings are skipped.

### 3.4 Image Optimization

Since `output: 'export'` disables Next.js image optimization (`images: { unoptimized: true }`), image SEO must be handled manually.

**Alt Text Rules:**
- Every `<img>` must have an `alt` attribute
- Describe the image content specifically and concisely (under 125 characters)
- Include relevant keywords naturally, not forcefully
- Decorative images: use `alt=""` (empty alt, not missing alt)
- Do not start with "Image of" or "Photo of"

**Format and Compression:**
- Convert all PNG/JPG images to WebP format (25-35% smaller files)
- Use tools: `sharp` (already installed), `cwebp`, or Squoosh
- Keep hero images under 200KB, thumbnails under 50KB
- Use descriptive file names: `ai-legal-rag-system-diagram.webp` not `img-001.png`

**Lazy Loading:**
- Add `loading="lazy"` to all images below the fold
- Hero images and LCP images: do NOT lazy load -- use `loading="eager"` or omit the attribute
- For static export without `next/image` optimization, use native HTML:

```tsx
<img
  src="/images/law-firm-rag/hero-library-brain.webp"
  alt="AI-powered legal research system connecting case law documents"
  width={1200}
  height={630}
  loading="lazy"
/>
```

**Image Sitemap:** Include key images in the sitemap by configuring `next-sitemap` or adding them manually.

### 3.5 Internal Linking Strategy

**Architecture (Hub and Spoke Model):**

```
Homepage (hub)
├── /law-firm-rag (product spoke)
├── /haven-blueprint (product spoke)
├── /visionspark-re (product spoke)
├── /blog (content hub)
│   ├── /blog/legal-ai-strategy (spoke → links to /law-firm-rag)
│   ├── /blog/ai-influencer-guide (spoke → links to /haven-blueprint)
│   └── /blog/real-estate-ai-video (spoke → links to /visionspark-re)
├── /portfolio (authority spoke)
├── /professionalExperience (authority spoke)
└── /templates (product spoke)
```

**Rules:**
- Every product page should link to 1-2 related blog posts
- Every blog post should link to 1 product page (contextually, not forced)
- Portfolio should link to relevant product pages
- 3-5 internal links per page
- Use descriptive anchor text, not "click here" or "learn more"
- Navigation should include all primary pages

**Specific Internal Links to Add:**

| From Page | Link To | Anchor Text Example |
|-----------|---------|-------------------|
| Homepage "About" section | `/professionalExperience` | Already linked ("See the Full Background") |
| Homepage case studies | `/portfolio` | "View all case studies" |
| Homepage value ladder | Product pages | "Explore the Legal AI System" |
| Law Firm RAG | `/blog/[relevant-post]` | "Read how AI changes legal research" |
| Law Firm RAG FAQ | `/portfolio` | "See our completed implementations" |
| Haven Blueprint | `/blog/[relevant-post]` | "Step-by-step AI influencer walkthrough" |
| VisionSpark RE | `/blog/[relevant-post]` | "How AI staging works for listings" |
| Blog posts | Relevant product pages | Contextual, keyword-rich anchors |
| Portfolio | Product pages | "Built with our Legal AI System" |
| Professional Experience | Homepage | "Current consulting services" |

### 3.6 URL Structure

Current URLs are generally clean. One issue:

| Current URL | Issue | Recommended |
|-------------|-------|-------------|
| `/professionalExperience` | camelCase is non-standard for URLs | `/professional-experience` |
| `/law-firm-rag` | Good | Keep |
| `/haven-blueprint` | Good | Keep |
| `/visionspark-re` | Good | Keep |
| `/blog/[slug]` | Good | Keep |
| `/templates/[slug]` | Good | Keep |

**If renaming `/professionalExperience`:** Add a 301 redirect in `.htaccess` from the old URL to the new one.

### 3.7 Content Length Recommendations

| Page Type | Recommended Word Count | Rationale |
|-----------|----------------------|-----------|
| Homepage | 800-1,500 words | Enough for Google to understand the business, not so much it dilutes |
| Product landing pages | 1,500-3,000 words | Long-form sales pages rank well for commercial intent keywords |
| Blog posts | 1,500-2,500 words | Comprehensive guides outperform thin content |
| Portfolio | 500-1,000 words per case study | Focus on results and specifics |
| Professional Experience | 800-1,500 words | Authority-building content |

### 3.8 Keyword Density and Placement

**Density:** 1-2% for the primary keyword. If a page has 2,000 words, the primary keyword should appear 20-40 times naturally. Do NOT force it.

**Placement (priority order):**
1. Title tag (first 60 chars)
2. H1 heading
3. First 100 words of body content
4. H2 subheadings (at least 1-2)
5. Image alt text
6. URL slug
7. Meta description
8. Body content (naturally distributed)

---

## 4. Schema Markup (Structured Data)

All schemas use JSON-LD format, injected via `<script type="application/ld+json">` in the `<Head>`.

### 4.1 Organization Schema (Homepage)

Place on every page via `_app.tsx` or the Layout component:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "The Innovative Native",
  "alternateName": "TIN",
  "url": "https://theinnovativenative.com",
  "logo": "https://theinnovativenative.com/images/logo.png",
  "description": "AI systems consulting — automated workflows, data pipelines, and AI agents for legal, creative, and real estate businesses.",
  "founder": {
    "@type": "Person",
    "name": "Michael Soto"
  },
  "foundingDate": "2015",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Sales",
    "url": "https://calendly.com/mike-buildmytribe/ai-discovery-call",
    "availableLanguage": "English"
  },
  "sameAs": [
    "https://github.com/ndnstyl",
    "https://www.linkedin.com/in/YOUR_LINKEDIN_SLUG/"
  ],
  "areaServed": "US",
  "knowsAbout": [
    "Artificial Intelligence",
    "Workflow Automation",
    "n8n",
    "AI Systems Architecture",
    "Legal AI",
    "Real Estate AI",
    "AI Content Creation"
  ]
}
```

### 4.2 Person Schema (Professional Experience Page)

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Michael Soto",
  "alternateName": "Mike Soto",
  "url": "https://theinnovativenative.com/professionalExperience",
  "image": "https://theinnovativenative.com/images/mike-soto-headshot.jpg",
  "jobTitle": "AI Systems Architect & Consultant",
  "worksFor": {
    "@type": "Organization",
    "name": "The Innovative Native",
    "url": "https://theinnovativenative.com"
  },
  "description": "18+ years building systems that create leverage. AI strategy, n8n workflow architecture, growth infrastructure.",
  "knowsAbout": [
    "AI Automation",
    "n8n Workflow Architecture",
    "Growth Strategy",
    "Data Pipeline Architecture",
    "Legal AI Systems",
    "Real Estate AI Marketing"
  ],
  "alumniOf": [],
  "sameAs": [
    "https://github.com/ndnstyl",
    "https://www.linkedin.com/in/YOUR_LINKEDIN_SLUG/"
  ]
}
```

### 4.3 Product Schema (One per Product Page)

**Law Firm RAG:**

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Private Legal RAG System",
  "description": "Private AI trained on your firm's briefs and case law. Search 10,000+ documents in seconds. SOC 2 ready.",
  "url": "https://theinnovativenative.com/law-firm-rag",
  "image": "https://theinnovativenative.com/images/law-firm-rag/hero-library-brain.jpg",
  "brand": {
    "@type": "Organization",
    "name": "The Innovative Native"
  },
  "offers": {
    "@type": "Offer",
    "price": "2500.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "https://theinnovativenative.com/law-firm-rag",
    "priceValidUntil": "2027-12-31"
  },
  "category": "AI Software / Legal Technology",
  "audience": {
    "@type": "Audience",
    "audienceType": "Law Firms, Solo Practitioners, Legal Departments"
  }
}
```

**Haven Blueprint:**

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "The AI Influencer Blueprint",
  "description": "Build your own AI influencer from scratch. The exact system, workflows, prompts, and automation pipeline behind aSliceOfHaven.",
  "url": "https://theinnovativenative.com/haven-blueprint",
  "image": "https://theinnovativenative.com/images/haven-blueprint/og-image.jpg",
  "brand": {
    "@type": "Organization",
    "name": "The Innovative Native"
  },
  "offers": {
    "@type": "Offer",
    "price": "57.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "https://theinnovativenative.com/haven-blueprint",
    "priceValidUntil": "2027-12-31"
  },
  "category": "AI Content Creation / Digital Products"
}
```

**VisionSpark RE:**

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "The Listing Video Blueprint",
  "description": "AI-staged photos and generative walkthrough video for real estate listings. Veo 3.1 property video, branded reels, MLS-ready.",
  "url": "https://theinnovativenative.com/visionspark-re",
  "image": "https://theinnovativenative.com/images/visionspark-re/og-image.jpg",
  "brand": {
    "@type": "Organization",
    "name": "The Innovative Native"
  },
  "offers": {
    "@type": "Offer",
    "price": "97.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "https://theinnovativenative.com/visionspark-re",
    "priceValidUntil": "2027-12-31"
  },
  "category": "AI Real Estate Marketing / Digital Products"
}
```

### 4.4 Course Schema (Classroom -- if you later make a public landing page)

For any public-facing course landing page (not the gated classroom itself):

```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "AI Influencer Pipeline Masterclass",
  "description": "Learn to build an AI influencer from scratch using generative AI, n8n automation, and structured workflows.",
  "provider": {
    "@type": "Organization",
    "name": "The Innovative Native",
    "url": "https://theinnovativenative.com"
  },
  "instructor": {
    "@type": "Person",
    "name": "Michael Soto"
  },
  "educationalLevel": "Intermediate",
  "isAccessibleForFree": false,
  "offers": {
    "@type": "Offer",
    "price": "57.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "Online",
    "courseWorkload": "PT10H"
  }
}
```

### 4.5 FAQ Schema

Add to pages with FAQ sections (Law Firm RAG, Haven Blueprint, VisionSpark RE):

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long does it take to deploy a private legal RAG system?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most firms are operational within 2-4 weeks. The initial document ingestion takes 3-5 business days depending on volume, with the AI training and testing phase following."
      }
    },
    {
      "@type": "Question",
      "name": "Is my firm's data secure?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Your data never leaves your private infrastructure. The system is SOC 2 ready, with end-to-end encryption, role-based access, and full audit logging."
      }
    }
  ]
}
```

**Important:** FAQ schema content MUST match the visible FAQ content on the page exactly. Google will penalize mismatches.

### 4.6 BreadcrumbList Schema

Add to all non-homepage pages:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://theinnovativenative.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Legal AI System",
      "item": "https://theinnovativenative.com/law-firm-rag"
    }
  ]
}
```

For blog posts, extend to three levels:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://theinnovativenative.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": "https://theinnovativenative.com/blog"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "How AI Changes Legal Research",
      "item": "https://theinnovativenative.com/blog/how-ai-changes-legal-research"
    }
  ]
}
```

### 4.7 ProfessionalService Schema (Alternative to LocalBusiness)

Since this is a remote consulting business (not a storefront), use ProfessionalService:

```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "The Innovative Native",
  "url": "https://theinnovativenative.com",
  "description": "AI systems consulting — automated workflows, data pipelines, and AI agents.",
  "priceRange": "$$$",
  "areaServed": {
    "@type": "Country",
    "name": "United States"
  },
  "serviceType": [
    "AI Consulting",
    "Workflow Automation",
    "AI System Architecture"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "AI Systems",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Private Legal RAG System",
          "url": "https://theinnovativenative.com/law-firm-rag"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "AI Influencer Blueprint",
          "url": "https://theinnovativenative.com/haven-blueprint"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Listing Video Blueprint",
          "url": "https://theinnovativenative.com/visionspark-re"
        }
      }
    ]
  }
}
```

### 4.8 Review / AggregateRating Schema

Only add this when you have real, verifiable testimonials. The Testimonials section on the homepage may qualify if testimonials are from real clients with names:

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "The Innovative Native AI Consulting",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "12",
    "bestRating": "5"
  },
  "review": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Client Name"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5"
      },
      "reviewBody": "The exact testimonial text as shown on the page."
    }
  ]
}
```

**Warning:** Do not fabricate reviews or ratings. Google can penalize or de-index pages with fake structured data.

---

## 5. Page-by-Page SEO Strategy

### 5.1 Homepage (`/`)

**Primary Keywords:** `AI systems consulting`, `AI automation consultant`, `business AI infrastructure`

**Secondary Keywords:** `n8n developer`, `workflow automation`, `AI data pipelines`, `SaaS replacement`, `AI for small business`

**Long-Tail Targets:**
- `AI consultant for small business automation`
- `replace SaaS stack with AI`
- `n8n workflow automation consultant`
- `AI systems that run without you`

**Meta Tags:**
```tsx
<title>AI Systems for Business — Automation Consulting | The Innovative Native</title>
<meta name="description" content="We build AI infrastructure that replaces fragmented SaaS stacks. Automated workflows, data pipelines, and AI agents for legal, creative, and real estate operators." />
<link rel="canonical" href="https://theinnovativenative.com" />
<meta property="og:title" content="AI Systems for Business — Automation Consulting" />
<meta property="og:description" content="We build AI infrastructure that replaces fragmented SaaS stacks. Automated workflows, data pipelines, and AI agents." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://theinnovativenative.com" />
<meta property="og:image" content="https://theinnovativenative.com/images/og-default.jpg" />
<meta property="og:site_name" content="The Innovative Native" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="AI Systems for Business — Automation Consulting" />
<meta name="twitter:description" content="We build AI infrastructure that replaces fragmented SaaS stacks." />
<meta name="twitter:image" content="https://theinnovativenative.com/images/og-default.jpg" />
```

**Schema:** Organization + ProfessionalService + WebSite

**H1:** `AI Systems That Run Your Business` (or similar -- must appear once)

### 5.2 Law Firm RAG (`/law-firm-rag`)

**Primary Keywords:** `legal AI system`, `private legal RAG`, `AI for law firms`

**Secondary Keywords:** `law firm AI assistant`, `legal document AI`, `case law AI search`, `legal knowledge management AI`, `AI-powered legal research`

**Long-Tail Targets:**
- `private AI for law firm case research`
- `AI that searches your own case law`
- `legal RAG system for solo practitioners`
- `AI document search for attorneys`
- `how to build a private legal AI`
- `SOC 2 compliant AI for law firms`

**Meta Tags:**
```tsx
<title>Legal AI System — Private RAG for Law Firms | The Innovative Native</title>
<meta name="description" content="Private AI trained on your firm's briefs and case law. Search 10,000+ documents in seconds. SOC 2 ready. Built for solo practitioners to mid-size firms." />
<link rel="canonical" href="https://theinnovativenative.com/law-firm-rag" />
```

**Schema:** Product + FAQPage + BreadcrumbList

### 5.3 Haven Blueprint (`/haven-blueprint`)

**Primary Keywords:** `AI influencer blueprint`, `create AI influencer`, `virtual influencer system`

**Secondary Keywords:** `AI UGC creator`, `AI content automation`, `virtual influencer pipeline`, `AI brand ambassador`, `AI content creator system`, `automated content creation AI`

**Long-Tail Targets:**
- `how to create an AI influencer from scratch`
- `AI influencer automation pipeline no code`
- `build virtual influencer without coding`
- `AI UGC video generator system`
- `create AI content creator step by step`
- `automated AI influencer workflow n8n`

**Meta Tags:**
```tsx
<title>AI Influencer Blueprint — Create Virtual Content Creators | The Innovative Native</title>
<meta name="description" content="Build your own AI influencer from scratch. The exact system behind aSliceOfHaven — image generation to automated video production. No coding required." />
<link rel="canonical" href="https://theinnovativenative.com/haven-blueprint" />
```

**Schema:** Product + FAQPage + BreadcrumbList

### 5.4 VisionSpark RE (`/visionspark-re`)

**Primary Keywords:** `AI listing video`, `AI real estate staging`, `AI property video`

**Secondary Keywords:** `virtual staging video`, `AI real estate marketing`, `generative video real estate`, `MLS listing video AI`, `AI staged photos real estate`, `Veo real estate video`

**Long-Tail Targets:**
- `AI staging for real estate listings under $10`
- `AI-generated property walkthrough video`
- `virtual staging video for real estate agents`
- `how to create AI listing videos`
- `generative AI video for property listings`
- `automated real estate listing content`

**Meta Tags:**
```tsx
<title>AI Listing Videos for Real Estate — Staging & Video Blueprint | The Innovative Native</title>
<meta name="description" content="AI-staged photos and generative walkthrough video for real estate listings. True Veo 3.1 property video, branded reels, MLS-ready. Under $10/listing." />
<link rel="canonical" href="https://theinnovativenative.com/visionspark-re" />
```

**Schema:** Product + FAQPage + BreadcrumbList

### 5.5 Blog (`/blog`)

**Content Strategy -- Topic Clusters:**

**Cluster 1: Legal AI** (supports `/law-firm-rag`)
- "How Private RAG Systems Transform Legal Research"
- "AI vs. Westlaw: Why Your Own Case Law Matters More"
- "5 Signs Your Law Firm Needs AI Document Search"
- "SOC 2 Compliance for Legal AI Systems"

**Cluster 2: AI Content Creation** (supports `/haven-blueprint`)
- "The Complete Guide to AI Influencers in 2026"
- "AI UGC vs. Human UGC: Cost, Speed, and Trust"
- "How to Build an Automated Content Pipeline with n8n"
- "Monetizing AI Influencers: Revenue Models That Work"

**Cluster 3: Real Estate AI** (supports `/visionspark-re`)
- "AI Virtual Staging vs. Traditional Staging: ROI Comparison"
- "How Generative Video is Changing Real Estate Marketing"
- "MLS-Compliant AI Content: What Agents Need to Know"
- "The $10 Listing Video: AI Pipeline for Real Estate"

**Cluster 4: AI Systems / Automation** (supports homepage authority)
- "Why Your SaaS Stack is Costing You More Than AI"
- "n8n vs. Zapier vs. Make: When to Use Each"
- "Building AI Agents That Run Without You"
- "The Business Case for AI Infrastructure Investment"

**Blog Post SEO Checklist:**
- [ ] Unique title tag (50-60 chars) with primary keyword
- [ ] Meta description (140-160 chars) with keyword and CTA
- [ ] Canonical URL set
- [ ] One H1 tag matching the post title
- [ ] H2/H3 subheadings with secondary keywords
- [ ] Internal links to relevant product page(s)
- [ ] Internal links to 1-2 other blog posts
- [ ] At least one image with descriptive alt text
- [ ] BlogPosting JSON-LD schema
- [ ] 1,500-2,500 words of substantive content
- [ ] Published date and author visible on page

### 5.6 Portfolio (`/portfolio`)

**Primary Keywords:** `AI case studies`, `AI automation portfolio`, `AI systems projects`

**Meta Tags:**
```tsx
<title>AI Projects & Case Studies | The Innovative Native</title>
<meta name="description" content="Completed AI systems: legal RAG, AI influencer pipelines, real estate video automation, and n8n workflow architecture. Real results, real metrics." />
<link rel="canonical" href="https://theinnovativenative.com/portfolio" />
```

**Schema:** BreadcrumbList + ItemList (list of creative works)

### 5.7 Professional Experience (`/professionalExperience`)

**Primary Keywords:** `Michael Soto AI consultant`, `AI systems architect`

**Meta Tags:**
```tsx
<title>Michael Soto — AI Systems Architect & Consultant | The Innovative Native</title>
<meta name="description" content="18+ years building systems that create leverage. AI strategy, n8n workflow architecture, growth infrastructure. From $225K to $1.2M/month client portfolios." />
<link rel="canonical" href="https://theinnovativenative.com/professionalExperience" />
```

**Schema:** Person + BreadcrumbList

### 5.8 Community / Classroom (`/classroom/*`)

**All classroom routes: `noindex, nofollow`**

This content is gated behind authentication. Do not let search engines index it -- it creates poor user experience when someone clicks a search result and hits a login wall.

The middleware already redirects unauthenticated users. Adding `noindex` in the Head is a belt-and-suspenders approach.

If you want to attract students via search, create a PUBLIC landing page at `/courses` or `/learn` that describes the courses and links to sign-up. That page gets indexed. The actual `/classroom/*` does not.

---

## 6. Next.js Static Export SEO Considerations

### 6.1 Head Component for Meta Tags

Since this project uses the Pages Router (not App Router), all meta tags go through the `next/head` `<Head>` component.

**Recommended approach:** Expand the existing `SEO.tsx` component to be the single source of truth, then use it on EVERY page:

```tsx
// Enhanced SEO.tsx additions needed:
interface SEOProps {
  title: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article" | "product";
  publishedTime?: string;
  author?: string;
  url?: string;
  noIndex?: boolean;
  // Add these:
  schema?: object | object[];      // Custom JSON-LD schemas
  ogType?: string;                  // Override og:type
  twitterHandle?: string;           // @username
  breadcrumbs?: Array<{name: string; url: string}>;
}
```

### 6.2 Sitemap Generation with next-sitemap

See section 2.2 above. Key points for static export:

- `next-sitemap` runs as a `postbuild` script
- Output goes to `public/` so it ships with the static files
- Blog post slugs must be known at build time (they are, via `getStaticPaths`)
- Template slugs must also be known at build time

### 6.3 Dynamic OG Images

For static export, dynamic OG image generation (using `@vercel/og`) is not available since there is no server. Options:

1. **Pre-generate OG images at build time** using a custom script with `sharp` or `canvas`
2. **Use static OG images** per page (current approach) -- simplest and reliable
3. **Use an external service** like `og-image.vercel.app` or Cloudinary transformations

**Recommended:** Static OG images per page. Create a 1200x630px image for each primary page:

| Page | OG Image Path | Status |
|------|--------------|--------|
| Homepage | `/images/og-default.jpg` | Referenced but may not exist |
| Law Firm RAG | `/images/law-firm-rag/og-image.jpg` | Needs creation |
| Haven Blueprint | `/images/haven-blueprint/og-image.jpg` | Referenced in data file |
| VisionSpark RE | `/images/visionspark-re/og-image.jpg` | Referenced in data file |
| Blog | `/images/og-blog.jpg` | Needs creation |
| Portfolio | `/images/og-portfolio.jpg` | Needs creation |

**OG Image Specs:**
- Dimensions: 1200 x 630 pixels
- Format: JPEG or PNG (not WebP -- some social platforms don't support WebP for OG)
- File size: Under 1MB (ideally under 300KB)
- Content: Brand name, page title, visual that represents the content
- Must use absolute URLs: `https://theinnovativenative.com/images/...`

### 6.4 Pre-rendering and Crawlability

With `output: 'export'`, Next.js pre-renders every page to static HTML at build time. This is excellent for SEO because:

- Googlebot sees fully rendered HTML immediately (no JavaScript rendering needed)
- Content is available to all crawlers, including those that don't execute JS
- Page load is fast (no server-side rendering delay)

**Potential Issue:** Client-side-only content (rendered in `useEffect` or behind auth) will NOT be in the static HTML. Make sure all SEO-critical content is in the initial render, not loaded dynamically.

**GSAP animations**: Elements hidden by GSAP (opacity: 0, y: 100) at mount time ARE in the HTML -- GSAP manipulates them client-side. Googlebot will see the content even if it's visually hidden by animation initial state.

---

## 7. Off-Page SEO

### 7.1 Google Business Profile

Even without a physical storefront, a Google Business Profile helps for branded searches. Set up a profile as a "Service Area Business":

- **Business Name:** The Innovative Native
- **Category:** IT Consultant (primary), Business Consultant (secondary)
- **Service Area:** United States (or specific states)
- **Website:** https://theinnovativenative.com
- **Description:** Include primary keywords naturally
- **Services:** List each product (Legal AI System, AI Influencer Blueprint, Listing Video Blueprint)
- **Photos:** Upload logo, team photo, project screenshots

### 7.2 Google Search Console Setup

1. Go to https://search.google.com/search-console
2. Add property: `https://theinnovativenative.com`
3. Verify via DNS TXT record in Hostinger hPanel:
   - Go to hPanel > Domains > DNS/Nameservers > DNS Records
   - Add TXT record with Google's verification string
   - Host: `@`
   - TTL: 3600
   - Wait 15-30 minutes, then verify in GSC
4. After verification:
   - Submit sitemap: `https://theinnovativenative.com/sitemap.xml`
   - Request indexing for key pages
   - Monitor Coverage, Performance, and Core Web Vitals reports
   - Set up email alerts for indexing issues

### 7.3 Bing Webmaster Tools

1. Go to https://www.bing.com/webmasters
2. Import from Google Search Console (fastest method)
3. Or verify via DNS CNAME record
4. Submit sitemap
5. Bing also powers DuckDuckGo, Yahoo, and some AI assistants

### 7.4 Backlink Strategy Basics

**Tier 1 -- Foundation (do immediately):**
- Google Business Profile (link to site)
- LinkedIn personal profile and company page (link to site)
- GitHub profile (ndnstyl -- link to site)
- Crunchbase profile (if applicable)
- Social profiles (Twitter/X, etc.)

**Tier 2 -- Content-Driven (ongoing):**
- Guest posts on legal tech, real estate tech, and AI blogs
- Write for n8n community blog or forums
- Answer questions on Reddit (`r/n8n`, `r/legaltech`, `r/realestate`)
- Quora answers about AI automation topics
- Product Hunt launch for Haven Blueprint or VisionSpark RE

**Tier 3 -- Partnerships:**
- Get listed on n8n's community creators or integrations page
- Real estate agent directories or MLS tech partner pages
- Legal tech directories (Legaltech Hub, Capterra, G2)
- Case study exchanges with clients (they link to you, you link to them)

**Rules:**
- Never buy links
- Focus on relevance over quantity
- One link from a legal tech blog is worth 50 links from random directories
- Every guest post should link to a specific product page, not just the homepage

### 7.5 Social Signals

While social signals are not a direct ranking factor, they drive traffic, which drives engagement, which Google does measure.

- Share every blog post on LinkedIn, Twitter/X
- Share product launches on relevant subreddits
- Create short-form video content about AI systems (YouTube Shorts, TikTok)
- Engage in n8n community forums with helpful answers (include link in profile)

---

## 8. Performance / Core Web Vitals

### 8.1 LCP Optimization (Target: < 2.5 seconds)

LCP measures when the largest visible content element finishes rendering.

**Actions:**

1. **Preload the LCP element.** For the homepage, identify the largest element (likely the hero image or banner text). Add to the page's Head:
   ```tsx
   <link rel="preload" as="image" href="/images/hero-background.webp" />
   ```

2. **Optimize hero images.** Convert to WebP, compress to under 200KB, serve at correct dimensions (not oversized).

3. **Eliminate render-blocking CSS.** The Google Fonts `@import` in `_variables.scss` is render-blocking. Fix:

   **Option A (Best): Use `next/font`**
   ```tsx
   // In _app.tsx or _document.tsx
   import { Inter } from 'next/font/google';

   const inter = Inter({
     subsets: ['latin'],
     display: 'swap',
     variable: '--inter',
   });

   // Apply to html element
   <Html lang="en" className={inter.variable}>
   ```
   Then remove the `@import url(...)` from `_variables.scss`.

   **Option B: Preload font CSS**
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com" />
   <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
   <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" />
   ```

4. **Reduce CSS bundle size.** The site loads all of Bootstrap CSS. Consider:
   - Import only the Bootstrap modules you use
   - Purge unused CSS with PurgeCSS or a similar tool

5. **Defer non-critical scripts.** Calendly widget CSS is loaded in `_app.tsx` head (render-blocking). Move to lazy load or load only on pages that use it.

### 8.2 INP Optimization (Target: < 200ms)

INP (Interaction to Next Paint) replaced FID in March 2024. It measures responsiveness to ALL user interactions, not just the first one.

**Actions:**

1. **Minimize main-thread JavaScript.** GSAP, ScrollTrigger, and SplitType all execute on the main thread. Optimize:
   - Use `requestAnimationFrame`-based animations (GSAP does this by default)
   - Avoid synchronous DOM queries in scroll handlers
   - Debounce scroll event listeners

2. **Lazy-load GSAP.** Only import GSAP on pages that use it, not globally:
   ```tsx
   // Dynamic import (already done per-page, which is correct)
   import gsap from "gsap";
   ```

3. **Break up long tasks.** Any JavaScript task over 50ms blocks the main thread. Use `setTimeout` or `requestIdleCallback` to yield periodically.

4. **Avoid layout thrashing.** Batch DOM reads and writes. Do not read a layout property (offsetHeight, getBoundingClientRect) and then immediately write (change style), then read again.

### 8.3 CLS Optimization (Target: < 0.1)

CLS measures unexpected visual shifts during page load.

**Actions:**

1. **Set explicit dimensions on all images and videos.** Every `<img>` tag needs `width` and `height` attributes:
   ```tsx
   <img src="/images/hero.webp" alt="..." width={1200} height={630} />
   ```

2. **Reserve space for dynamic content.** If content loads asynchronously (testimonials, blog cards), set a minimum height on the container to prevent reflow.

3. **Font loading CLS.** The `display: swap` in the Google Fonts URL helps, but can still cause CLS if the fallback font has different metrics. Using `next/font` with `adjustFontFallback` eliminates this entirely.

4. **GSAP animation CLS.** Setting `opacity: 0` and `y: 100` via `gsap.set()` in `useEffect` causes a brief visible state before the animation initializes. Fix:
   ```css
   /* Set initial state in CSS, not JS, to prevent flash */
   .fade-top {
     opacity: 0;
     transform: translateY(100px);
   }
   ```
   Then GSAP animates from this CSS-defined state. This prevents the "flash of unstyled content" that causes CLS.

5. **Calendly widget.** External widgets that inject DOM elements can cause CLS. Load Calendly only when the user clicks "Book a Call" (already using popup mode, which is good).

### 8.4 Image Optimization Strategy

Since `next/image` is disabled for static export, implement manual optimization:

| Action | Tool | Target |
|--------|------|--------|
| Convert to WebP | `sharp` (npm, already installed) | All non-icon images |
| Compress | `sharp` or Squoosh | Hero: < 200KB, thumbs: < 50KB |
| Resize | `sharp` | Serve at display size, not larger |
| Lazy load | `loading="lazy"` attribute | All below-fold images |
| Eager load | `loading="eager"` or omit | Hero/LCP images |
| Width/height | HTML attributes | Every `<img>` tag |
| Alt text | Manual | Every `<img>` tag |

**Build script example** (add to `package.json` scripts):

```bash
# Convert all PNGs and JPGs in public/images to WebP
npx sharp-cli --input "public/images/**/*.{png,jpg,jpeg}" --output "{dir}/{name}.webp" --format webp --quality 80
```

### 8.5 Font Loading Strategy

**Current problem:** `@import url("https://fonts.googleapis.com/css2?...")` in SCSS is render-blocking.

**Fix priority:**

1. Remove the `@import` from `src/styles/abstracts/_variables.scss`
2. Add font preconnect and preload to `_document.tsx`:

```tsx
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* Load Inter with display=swap (non-render-blocking) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

**Note:** Also trim font weights. The current import loads weights 100-900 (9 weights). Most pages only need 300, 400, 500, 600, 700 (5 weights). Each removed weight reduces font payload.

### 8.6 Bundle Size Optimization

| Library | Bundle Impact | Action |
|---------|--------------|--------|
| Bootstrap 5.3.1 | ~200KB CSS | Import only used components or switch to utility CSS |
| GSAP + ScrollTrigger | ~100KB JS | Already dynamically imported per page (good) |
| Spline Runtime | ~500KB+ JS | Lazy load, only on pages that use it |
| SplitType | ~15KB JS | Fine, minimal impact |
| Swiper | ~150KB JS + CSS | Lazy load, only on pages with sliders |
| React Markdown | ~30KB JS | Only on blog pages (good) |

**Key optimizations:**
- Use `next/dynamic` with `ssr: false` for heavy client-only components (Spline)
- Analyze bundle with `@next/bundle-analyzer`
- Consider replacing full Bootstrap import with only grid + utilities

### 8.7 GSAP Animation Impact on Performance

GSAP is well-optimized for performance when used correctly. Current patterns in the codebase that need attention:

**Good patterns (keep):**
- Using `gsap.set()` for initial states
- Using `ScrollTrigger.create()` for scroll-based animations
- Animating `opacity` and `y` (transform) -- GPU-accelerated

**Patterns to fix:**

1. **Multiple `document.querySelectorAll` calls in useEffect:**
   ```tsx
   // Current: queries DOM on every page mount
   const fadeWrapperRefs = document.querySelectorAll(".fade-wrapper");
   ```
   This is fine for performance but should use refs for React best practices.

2. **No cleanup on unmount:** ScrollTrigger instances should be killed on component unmount:
   ```tsx
   useEffect(() => {
     // ... create animations ...
     return () => {
       ScrollTrigger.getAll().forEach(trigger => trigger.kill());
     };
   }, []);
   ```

3. **Avoid animating layout properties:** Never animate `width`, `height`, `margin`, `padding`, `top`, `left` with GSAP. Always use `x`, `y`, `scale`, `rotation`, and `opacity`.

---

## 9. SEO Tools to Configure

### 9.1 Google Search Console

- **URL:** https://search.google.com/search-console
- **Verification:** DNS TXT record via Hostinger hPanel
- **Actions after setup:**
  - Submit sitemap.xml
  - Request indexing for all key pages
  - Monitor: Performance (clicks, impressions, CTR, position), Coverage (errors, warnings), Core Web Vitals, Mobile Usability
  - Set up email alerts

### 9.2 Google Analytics 4 (GA4)

**Implementation for Pages Router:**

Add to `_app.tsx`:

```tsx
import Script from "next/script";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID; // G-XXXXXXXXXX

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      {/* Google Analytics */}
      {GA_MEASUREMENT_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_title: document.title,
                page_location: window.location.href,
              });
            `}
          </Script>
        </>
      )}
      {/* ... rest of app */}
    </AuthProvider>
  );
}
```

**Track custom events for business KPIs:**
- `calendly_click` -- when someone opens the Calendly widget
- `product_page_view` -- when someone views a product page
- `checkout_initiated` -- when someone starts checkout
- `scroll_depth` -- 25%, 50%, 75%, 100% scroll milestones

**Add to `.env.local`:**
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 9.3 Bing Webmaster Tools

- **URL:** https://www.bing.com/webmasters
- **Verification:** Import from Google Search Console (easiest)
- **Submit sitemap after verification**
- Bing powers searches for DuckDuckGo, Yahoo, and some AI assistants (Copilot)

### 9.4 Schema Validator

- **Google Rich Results Test:** https://search.google.com/test/rich-results
  - Test every page's structured data
  - Verify eligibility for rich snippets
- **Schema.org Validator:** https://validator.schema.org
  - Validate JSON-LD syntax
- **Test after every deployment** of schema changes

### 9.5 PageSpeed Insights

- **URL:** https://pagespeed.web.dev
- **Test all key pages:**
  - Homepage
  - Each product page
  - Blog index
  - A sample blog post
- **Target scores:**
  - Performance: > 90
  - Accessibility: > 90
  - Best Practices: > 90
  - SEO: > 95
- **Run tests in both Mobile and Desktop modes**
- Mobile scores are what Google uses for ranking

### 9.6 Lighthouse (Local Testing)

- Chrome DevTools > Lighthouse tab
- Run before every deployment
- Test in Incognito mode (no extensions interfering)
- Key reports: Performance, Accessibility, Best Practices, SEO
- Address any red or orange flags before deploying

---

## 10. Implementation Priority Checklist

### Phase 1: Critical Foundation (Do First)

- [ ] Create `public/robots.txt` with proper directives
- [ ] Install `next-sitemap` and configure `next-sitemap.config.js`
- [ ] Add `postbuild` script to `package.json`
- [ ] Create `public/.htaccess` with HTTPS enforcement and SPA routing
- [ ] Add canonical URLs to all indexable pages
- [ ] Add `noindex` meta tags to all gated/utility pages that lack them
- [ ] Fix font loading: move from CSS `@import` to `_document.tsx` `<link>` with preconnect
- [ ] Add Organization JSON-LD schema to the Layout or `_document.tsx`
- [ ] Verify SSL is active on Hostinger
- [ ] Set up Google Search Console and submit sitemap

### Phase 2: Meta Tags & OG (High Impact)

- [ ] Add complete OG tags (title, description, image, url, type) to homepage
- [ ] Add Twitter Card tags to homepage
- [ ] Add OG + Twitter tags to portfolio page
- [ ] Add OG + Twitter tags to professional experience page
- [ ] Add OG + Twitter tags to blog index
- [ ] Create OG images (1200x630) for homepage, blog, portfolio
- [ ] Verify all product pages have complete OG tags (they mostly do)
- [ ] Add canonical URL to product pages
- [ ] Ensure all pages use consistent title format

### Phase 3: Structured Data (Medium Impact, High Value)

- [ ] Add Person schema to professional experience page
- [ ] Add FAQ schema to law-firm-rag page
- [ ] Add FAQ schema to haven-blueprint page
- [ ] Add FAQ schema to visionspark-re page
- [ ] Add BreadcrumbList schema to all non-homepage pages
- [ ] Add ProfessionalService schema to homepage
- [ ] Validate all schemas with Google Rich Results Test

### Phase 4: Performance (Core Web Vitals)

- [ ] Convert images to WebP format
- [ ] Add `width` and `height` attributes to all `<img>` tags
- [ ] Add `loading="lazy"` to below-fold images
- [ ] Preload LCP images on key pages
- [ ] Set GSAP initial states in CSS (not just JS) to prevent CLS
- [ ] Add ScrollTrigger cleanup on component unmount
- [ ] Trim Google Fonts weights (remove 100, 200, 800, 900)
- [ ] Audit bundle size with `@next/bundle-analyzer`
- [ ] Lazy-load Calendly CSS (only load on pages with CTAs)
- [ ] Run Lighthouse on all key pages, target > 90 on all metrics

### Phase 5: Analytics & Monitoring

- [ ] Set up GA4 with measurement ID
- [ ] Add GA4 script to `_app.tsx` with `afterInteractive` strategy
- [ ] Configure custom events (calendly_click, product_page_view)
- [ ] Set up Bing Webmaster Tools
- [ ] Create PageSpeed Insights baseline for all key pages
- [ ] Set up monthly SEO audit cadence

### Phase 6: Content & Authority (Ongoing)

- [ ] Publish first blog post per topic cluster (4 posts minimum)
- [ ] Build internal linking between blog posts and product pages
- [ ] Add descriptive anchor text to all internal links
- [ ] Create Google Business Profile
- [ ] Optimize all image alt text across the site
- [ ] Build Tier 1 backlinks (social profiles, GitHub, LinkedIn)
- [ ] Consider renaming `/professionalExperience` to `/professional-experience` with 301 redirect

---

## Sources

- [Next.js Metadata Files: robots.txt](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots)
- [next-sitemap GitHub Repository](https://github.com/iamvishnusankar/next-sitemap)
- [Complete Next.js SEO Guide: From Zero to Hero](https://www.adeelhere.com/blog/2025-12-09-complete-nextjs-seo-guide-from-zero-to-hero)
- [How to Make Your Next.js App SEO-Friendly in 2025](https://medium.com/@ozgevurmaz/how-to-make-your-next-js-app-seo-friendly-in-2025-67b4dc386b66)
- [JSON-LD SEO: Why JSON-LD Schema Is Crucial for SEO](https://ignitevisibility.com/everything-to-know-about-json-ld-for-seo/)
- [JSON-LD Fundamentals and Best Practices 2025](https://www.seo-day.de/wiki/on-page-seo/html-optimierung/strukturierte-daten/json-ld.php?lang=en)
- [Core Web Vitals Optimization Guide 2026](https://skyseodigital.com/core-web-vitals-optimization-complete-guide-for-2026/)
- [Core Web Vitals 2026: INP, LCP & CLS Optimization](https://www.digitalapplied.com/blog/core-web-vitals-2026-inp-lcp-cls-optimization-guide)
- [What Are the Core Web Vitals? LCP, INP & CLS Explained (2026)](https://www.corewebvitals.io/core-web-vitals)
- [Meta Tags & Open Graph: Complete Implementation Guide for Next.js](https://vladimirsiedykh.com/blog/meta-tags-open-graph-complete-implementation-guide-nextjs-react-helmet)
- [Next.js SEO in 2025: Best Practices, Meta Tags, and Performance](https://www.slatebytes.com/articles/next-js-seo-in-2025-best-practices-meta-tags-and-performance-optimization-for-high-google-rankings)
- [How to Write Title Tags and Meta Descriptions for SEO in 2026](https://thesmcollective.com/blog/seo-title-tags-meta-descriptions/)
- [Title Tag & Meta Description Length: Best Practices for Google SERPs 2025](https://destination-digital.co.uk/news-blogs-case-studies/title-meta-description-length-google-serps-2025/)
- [Internal Linking: Best Practices for SEO Growth in 2025](https://www.6thman.digital/articles/internal-linking-best-practices-for-2025)
- [Image SEO 2025: Optimize for Speed & Visibility](https://wellows.com/blog/image-seo/)
- [Alt Text SEO Best Practices](https://alttext.ai/blog/image-alt-text-seo-best-practices)
- [GSAP and Google Core Web Vitals](https://gsap.com/community/forums/topic/24495-gsap-and-google-core-web-vitals/)
- [High-Performance Web Animation: GSAP, WebGL, and the Secret to 60fps](https://dev.to/kolonatalie/high-performance-web-animation-gsap-webgl-and-the-secret-to-60fps-2l1g)
- [How to Force HTTPS using .htaccess (Hostinger)](https://www.hostinger.com/tutorials/force-https-using-htaccess)
- [How to Deploy Next.js on Hostinger Shared Hosting](https://coldfusion-example.blogspot.com/2026/02/how-to-deploy-nextjs-on-hostinger.html)
- [How to Add a Domain to Google Search Console (Hostinger)](https://www.hostinger.com/support/3692620-how-to-add-a-domain-to-google-search-console/)
- [AI SEO For Law Firms: Website Changes For 2026](https://abovethelaw.com/2025/10/ai-seo-for-law-firms-website-changes-for-2026/)
- [Real Estate SEO Automation Using AI](https://www.alliai.com/ai-real-estate-seo-automation)
- [The Definitive Guide to Using GSAP in Next.js](https://www.thinknovus.com/blog/the-definitive-guide-to-using-gsap-in-next-js-for-speed-and-impact)
- [Next.js Font Optimization](https://www.telerik.com/blogs/font-optimization-next-js)
- [Google Analytics 4 Complete Setup Guide](https://www.digitalapplied.com/blog/google-analytics-4-complete-setup-guide)
- [How to Setup Google Analytics 4 in a Next.js Project](https://blog.bolajiayodeji.com/how-to-setup-google-analytics-4-in-a-nextjs-project)
- [Next.js Components: Head](https://nextjs.org/docs/pages/api-reference/components/head)
- [Google Image SEO Best Practices](https://developers.google.com/search/docs/appearance/google-images)
- [Google Search Central: Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)
- [Manage SEO in Next.js with Next SEO](https://blog.logrocket.com/manage-seo-next-js-with-next-seo/)
