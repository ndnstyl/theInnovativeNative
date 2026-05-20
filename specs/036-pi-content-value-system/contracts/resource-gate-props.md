# Contract: ResourceGate Component Props

**File**: `projects/website/src/components/containers/resources/ResourceGate.tsx`
**Stability**: STABLE — existing 6 resource pages depend on this interface. Any breaking change requires updating all 6 pages + 7 new pages + contract review.

## Current Prop Signature (before feature 036)

```typescript
interface ResourceGateProps {
  title: string;
  subtitle: string;
  bullets: string[];
  leadMagnetId: string;
  downloadUrl: string;
  heroImage?: string;
}
```

## Prop Signature After Feature 036

**No breaking changes.** The interface is EXTENDED with two optional props to control the newsletter opt-in behavior. All existing pages continue to work without modification.

```typescript
interface ResourceGateProps {
  title: string;
  subtitle: string;
  bullets: string[];
  leadMagnetId: string;
  downloadUrl: string;
  heroImage?: string;

  /**
   * When true, render the newsletter opt-in checkbox in the success state.
   * Defaults to true for all resource pages. Set to false only if a specific
   * page needs to suppress the offer (none in scope for feature 036).
   */
  enableNewsletterOptIn?: boolean;

  /**
   * Optional override for the newsletter opt-in label text.
   * Defaults to "Send me the weekly Legal AI Briefing. No spam, unsubscribe anytime."
   */
  newsletterOptInLabel?: string;
}
```

## Consumer Contract

Every resource landing page (`projects/website/src/pages/resources/<slug>.tsx`) MUST:

1. Import `ResourceGate` from `@/components/containers/resources/ResourceGate`
2. Supply required props: `title`, `subtitle`, `bullets`, `leadMagnetId`, `downloadUrl`
3. NOT supply `enableNewsletterOptIn={false}` unless explicitly required (no case in feature 036)
4. Wrap the component in a `<Head>` + `<HeaderLanding>` + `<main>` + `<ScrollProgressBtn>` layout matching the existing pattern in [442-intake-math.tsx](projects/website/src/pages/resources/442-intake-math.tsx)

## Component Behavior (post-modification)

### Initial render (locked state)
- Shows form with firstName (required), email (required), firmName (optional), practiceArea (optional dropdown).
- Submit button: "Get Free Access" in gold.
- "No spam. Unsubscribe anytime." microcopy under the button.

### Loading state
- Button disabled with spinner.
- Error display if webhook responds non-2xx or throws.

### Success state (unlocked)
- Large green checkmark icon.
- "Your resource is ready." headline.
- "Click below to download your copy." subtitle.
- Gold "Download Now" button linking to `downloadUrl`.
- **NEW**: Newsletter opt-in section (if `enableNewsletterOptIn !== false`):
  - Separator line or subtle divider
  - Single checkbox, unchecked by default
  - Label: `newsletterOptInLabel` prop value OR default
  - When checked + download clicked (or on explicit "Subscribe" click): POST a second payload to `NEXT_PUBLIC_LEAD_WEBHOOK_URL` with `leadMagnet: 'newsletter-signup'`, `source: 'resource-page-newsletter-optin'`, same email/firstName.
  - Visual confirmation after opt-in POST succeeds: "You're in. First briefing arrives tomorrow."

### Returning visitor (already unlocked via localStorage)
- Form is skipped.
- Success state renders directly with the Download button.
- Newsletter opt-in is visible for returning visitors who didn't opt in the first time. Once they opt in, the checkbox is hidden (second localStorage flag).

## localStorage Keys Used

| Key | Purpose | Set by |
|-----|---------|--------|
| `tin_resource_downloaded_<leadMagnetId>` | Remembers the reader completed the gated form for a specific magnet | `ResourceGate` on successful submit |
| `tin_resource_newsletter_optin_<leadMagnetId>` | Remembers the reader already opted into the newsletter from this resource page | `ResourceGate` on successful newsletter POST (NEW) |
| `tin_utm_params` | UTM parameters captured from URL on arrival | `utm.ts::captureUTMParams()` at page load |

## Wire Format (to webhook)

See [lead-form-submission.schema.json](./lead-form-submission.schema.json) for the canonical JSON Schema.

**Initial form submission** (resource download):
```json
{
  "firstName": "Jane",
  "email": "jane@smithlaw.com",
  "firmName": "Smith & Associates",
  "practiceArea": "Personal Injury",
  "leadMagnet": "demand-letter-matrix",
  "source": "resource-page",
  "utm_source": "linkedin",
  "timestamp": "2026-04-16T14:32:18.421Z"
}
```

**Newsletter opt-in secondary POST** (NEW — added in feature 036):
```json
{
  "firstName": "Jane",
  "email": "jane@smithlaw.com",
  "firmName": null,
  "practiceArea": null,
  "leadMagnet": "newsletter-signup",
  "source": "resource-page-newsletter-optin",
  "utm_source": "linkedin",
  "timestamp": "2026-04-16T14:32:24.118Z"
}
```

Both POSTs go to the same endpoint (`NEXT_PUBLIC_LEAD_WEBHOOK_URL`). The n8n workflow uses the `source` and `leadMagnet` fields to route.

## Error Handling Contract

| Scenario | UX Behavior |
|----------|-------------|
| Primary POST fails (network error, 5xx) | Show red error banner, preserve form state, keep user on locked view. |
| Primary POST fails (validation) | Show field-level errors, preserve form state. |
| Primary POST succeeds, newsletter POST fails | Download still works. Log warning to console. Show non-blocking notice: "We couldn't save your newsletter preference. Try again or visit /newsletter." |
| PPTX file missing (404 on download click) | Out of scope for ResourceGate — pre-deploy check prevents this. |
| `NEXT_PUBLIC_LEAD_WEBHOOK_URL` unset | Show error: "Form submission is temporarily unavailable. Please try again later." (existing behavior, unchanged) |

## Test Contract

Minimum `resources.spec.ts` coverage:
1. Form renders on `/resources/442-intake-math` (existing page regression check).
2. Form renders on `/resources/demand-letter-matrix` (new page).
3. Submitting empty form shows errors on firstName and email.
4. `/resources` hub index renders 13 resource cards.
5. Hub index contains a newsletter CTA link to `/newsletter`.
