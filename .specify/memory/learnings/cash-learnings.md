# Cash - Stripe & Billing Operations Learnings

## Last Updated: 2026-02-05

## Official Documentation
- **Stripe Development Portal**: https://docs.stripe.com/development
- **React Stripe.js**: https://docs.stripe.com/stripe-js/react
- **Embedded Checkout (Next.js)**: https://docs.stripe.com/checkout/embedded/quickstart
- **Webhooks**: https://docs.stripe.com/webhooks
- **Accept Payments**: https://docs.stripe.com/payments/accept-a-payment

## Critical Mistakes (NEVER REPEAT)
- [GLOBAL] Never process refunds without explicit CEO approval
- [GLOBAL] Never cancel subscriptions without documented authorization
- [GLOBAL] Never store raw payment credentials anywhere
- [GLOBAL] Never load Stripe.js from npm bundle - always load from `js.stripe.com` for PCI compliance
- [GLOBAL] Never call `loadStripe()` inside component render - causes recreation on every render

## Domain Patterns
- **Reconciliation**: Always cross-reference Stripe with Airtable records
- **Failed Payments**: Handle within 24 hours, follow dunning workflow
- **Revenue Reporting**: Verify all amounts twice before submitting
- **Webhooks**: Return 200 immediately, process asynchronously

## Quick Reference
- MCP Integration: stripe-mcp (or n8n via Neo)
- Reports to: Drew (via project leads), Direct access from Risa
- KPIs: 99%+ reconciliation accuracy, <24hr failed payment response, 100% report accuracy
- Dunning stages: Day 0 (initial), Day 3 (retry), Day 7 (final notice), Day 14 (cancellation)

---

## React/Next.js Stripe Integration

### Installation
```bash
npm install --save @stripe/react-stripe-js @stripe/stripe-js stripe
```

### Environment Variables (.env.local)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Key Components

| Component | Purpose |
|-----------|---------|
| `<Elements>` | Provider for advanced custom integrations |
| `<CheckoutProvider>` | Provider for embedded checkout |
| `<PaymentElement>` | Universal payment form (cards, wallets, etc.) |
| `<ExpressCheckoutElement>` | Apple Pay, Google Pay buttons |
| `<AddressElement>` | Billing/shipping address collection |

### Essential Hooks

| Hook | Returns |
|------|---------|
| `useStripe()` | Stripe instance for confirmPayment |
| `useElements()` | Elements instance for form access |
| `useCheckout()` | Checkout object (embedded mode only) |

### Next.js Implementation Pattern

**1. Server Action (app/actions/stripe.ts)**
```typescript
'use server'
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createCheckoutSession(priceId: string) {
  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    mode: 'payment', // or 'subscription'
    line_items: [{ price: priceId, quantity: 1 }],
    return_url: `${process.env.NEXT_PUBLIC_URL}/return?session_id={CHECKOUT_SESSION_ID}`,
  });
  return session.client_secret;
}
```

**2. Client Component**
```typescript
'use client'
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';

// CRITICAL: Initialize outside component to prevent recreation
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function CheckoutForm({ clientSecret }: { clientSecret: string }) {
  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}
```

**3. Return Page Handler**
```typescript
// app/return/page.tsx
import Stripe from 'stripe';

export default async function ReturnPage({ searchParams }) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const session = await stripe.checkout.sessions.retrieve(searchParams.session_id);

  if (session.status === 'complete') {
    return <div>Payment successful! Email: {session.customer_details?.email}</div>;
  }
  return <div>Payment failed. Please try again.</div>;
}
```

### Webhook Handler (app/api/webhooks/stripe/route.ts)
```typescript
import { headers } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return new Response('Invalid signature', { status: 400 });
  }

  // Return 200 immediately
  switch (event.type) {
    case 'checkout.session.completed':
      // Handle successful checkout
      break;
    case 'invoice.payment_failed':
      // Trigger dunning workflow
      break;
    case 'customer.subscription.deleted':
      // Log churn
      break;
  }

  return new Response('OK', { status: 200 });
}
```

---

## Integration Gotchas

### PCI Compliance
- **Always** load Stripe.js from `js.stripe.com` CDN, not npm bundle
- Payment details never touch your server - Elements handle this
- Use `loadStripe()` from `@stripe/stripe-js` (it loads from CDN)

### Webhook Security
- **Always** verify signature before processing: `stripe.webhooks.constructEvent()`
- Return 200 immediately, process async
- Use raw body (not parsed JSON) for signature verification
- Test locally with: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

### Common Mistakes
- Calling `loadStripe()` inside component (recreates on every render)
- Not handling webhook idempotency (events can be sent multiple times)
- Blocking webhook response with long operations
- Using test keys in production or vice versa

### Subscription Status Checks
- Check `status` field, not just subscription existence
- Valid statuses: `active`, `past_due`, `canceled`, `unpaid`, `trialing`
- `past_due` requires dunning action

---

## Deep-Dive Resources (When Implementation Needed)

| Topic | URL |
|-------|-----|
| Custom Payment Forms | https://docs.stripe.com/payments/payment-element |
| Subscription Integration | https://docs.stripe.com/billing/subscriptions/build-subscriptions |
| Customer Portal | https://docs.stripe.com/customer-management/portal-deep-dive |
| Testing & Test Cards | https://docs.stripe.com/testing |
| Stripe CLI | https://docs.stripe.com/stripe-cli |
| Webhooks Deep Dive | https://docs.stripe.com/webhooks |
| Error Handling | https://docs.stripe.com/error-handling |

### Test Card Numbers
| Scenario | Card Number |
|----------|-------------|
| Successful payment | 4242 4242 4242 4242 |
| Declined (generic) | 4000 0000 0000 0002 |
| Declined (insufficient funds) | 4000 0000 0000 9995 |
| Requires authentication | 4000 0025 0000 3155 |

---

## Successful Approaches
- **Embedded Checkout**: Simplest path for Next.js - minimal code, Stripe handles UI
- **Server Actions**: Clean pattern for session creation in Next.js App Router
- **Webhook-first**: Always rely on webhooks over client-side success, prevents race conditions

## Common Operations
- Get customer status: Fetch customer → subscriptions → invoices → payment methods
- Revenue report: Query period → categorize → reconcile → submit to Risa
- Failed payment: Log → email via Iris → schedule retry → escalate if needed
