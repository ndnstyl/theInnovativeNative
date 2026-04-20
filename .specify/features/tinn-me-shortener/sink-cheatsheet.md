# Sink Cheat Sheet — tinn.me

**Dashboard**: `https://tinn-me.jolly-glitter-8efd.workers.dev/dashboard`
**Login token**: `TinnMe2026!Secure`
**Custom domain**: `tinn.me` (pending DNS propagation from GoDaddy → Cloudflare)

---

## Creating a Link

1. Click **Create Link** (top right)
2. **URL**: paste full destination URL
3. **UTM button** (top right of URL field): add tracking params (source, medium, campaign) inline — they get appended to the destination automatically
4. **Slug**: your custom short path (e.g., `AIquiz` → `tinn.me/AIquiz`). Two icons generate slugs: dice = random, sparkles = AI-suggested
5. **Comment**: internal notes only you see. Use for context: "Touch 3 law firm outreach" or "LinkedIn bio link"
6. **Expiration**: LEAVE BLANK for permanent links. Only set a date for time-limited offers.
7. **OG Preview** (scroll down): customize the title, description, and image that shows when someone shares the link in DMs, Slack, or social media
8. **Device Routing** (scroll down): send iOS users to App Store, Android to Play Store, desktop to website. Leave blank if same destination for all.
9. Click **Save**

## Dashboard Sections

| Section | What It Does |
|---------|-------------|
| **Links** | All your links — search, edit, delete, see click counts |
| **Analysis** | Click analytics: 3D globe, device breakdown, browsers, countries, referrers, time series |
| **Realtime** | Live feed of clicks as they happen |
| **Settings** | Admin config, site token, preferences |
| **Import/Export** | Bulk import via JSON/CSV, full export for backup |

## Top Bar

- **Create Link** — new link
- **Slug A-Z** — alphabetical index of all links
- **Search links** — find any link instantly

## Key Features

### UTM Tracking
Click the "UTM" button when creating a link. Fill in:
- **Source**: where traffic comes from (linkedin, email, facebook)
- **Medium**: type of traffic (dm, post, cold-email)
- **Campaign**: specific campaign name (april-outreach, law-firm-45day)
- **Content**: variant identifier (touch-3, quiz-a, quiz-b)

These get appended to the destination URL automatically. Your GA4/GTM picks them up on the landing page.

### OG Preview Customization
Control what people see when the link is shared:
- **Title**: "Is Your Business AI-Ready? Take the 2-Min Quiz"
- **Description**: "6 questions. A score. A reality check."
- **Image**: upload a branded preview image

This is HUGE for DM outreach — the preview card is what gets people to click.

### Device Routing
Send users to different destinations based on their device:
- iOS → one URL
- Android → different URL
- Desktop → another URL

Useful for app installs or platform-specific content.

### AI Slug Generation
The sparkle icon generates a slug using AI (Cloudflare Workers AI). It reads the destination URL and suggests a relevant, memorable slug.

### Bulk Import/Export
- **Import**: upload a JSON or CSV file with multiple links at once
- **Export**: download all links + click data for backup or migration

### Analytics
- **By time**: clicks per hour/day/week
- **By device**: mobile vs desktop vs tablet
- **By browser**: Chrome, Safari, Firefox, etc.
- **By country**: with 3D globe visualization
- **By referrer**: where clicks come from (linkedin.com, direct, email)

## Links to Create First

| Slug | Destination | Comment |
|------|------------|---------|
| `AIquiz` | `https://theinnovativenative.com/quiz/ai-readiness` | AI Readiness Quiz - main funnel |
| `AIquiz-b` | `https://theinnovativenative.com/quiz/ai-readiness?v=b` | AI Quiz variant B - capture last |
| `law-quiz` | `https://theinnovativenative.com/quiz/law-firm-audit` | Law Firm Audit Quiz |
| `law-quiz-b` | `https://theinnovativenative.com/quiz/law-firm-audit?v=b` | Law Quiz variant B |
| `call` | Calendly URL | Book a discovery call |
| `cerebro` | `https://theinnovativenative.com/law-firm-rag` | Cerebro product page |
| `classroom` | `https://theinnovativenative.com/classroom` | Course platform |
| `linkedin` | LinkedIn profile URL | LinkedIn profile |

## Custom Domain Setup (Once DNS Propagates)

1. In Cloudflare dashboard: **Workers & Pages** → `tinn-me` worker
2. **Settings** → **Triggers** → **Custom Domains**
3. Add `tinn.me`
4. Cloudflare handles SSL automatically
5. `tinn.me/AIquiz` starts working immediately

## API Access (for n8n integration)

```
POST https://tinn.me/api/link/create
Headers:
  Authorization: Bearer TinnMe2026!Secure
  Content-Type: application/json
Body:
  {
    "url": "https://theinnovativenative.com/quiz/ai-readiness",
    "slug": "AIquiz",
    "comment": "AI Readiness Quiz"
  }
```

## Cloudflare Resources

- **Account ID**: c8de325b8ecf45ab9ec0bef1f0d98aed
- **KV Namespace ID**: 3ce333d0ed7e470c89e25d219d83f2ca
- **Analytics Dataset**: tinnme
- **Worker name**: tinn-me
- **Workers.dev URL**: https://tinn-me.jolly-glitter-8efd.workers.dev
