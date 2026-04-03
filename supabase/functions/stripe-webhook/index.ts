// Supabase Edge Function: Stripe Webhook Handler
// Handles checkout.session.completed → creates enrollment record
//
// Deploy: supabase functions deploy stripe-webhook
// Set secrets:
//   supabase secrets set STRIPE_SECRET_KEY=sk_...
//   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
//
// Configure Stripe webhook URL:
//   https://<project-ref>.supabase.co/functions/v1/stripe-webhook

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.95.0';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;

serve(async (req: Request) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new Response(`Webhook Error: ${(err as Error).message}`, { status: 400 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        let userId = session.metadata?.user_id;
        const courseId = session.metadata?.course_id;
        const customerEmail = session.customer_details?.email || session.customer_email;

        // Payment Links don't carry metadata — resolve user by email
        if (!userId && customerEmail) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', customerEmail)
            .maybeSingle();

          if (!profile) {
            // Try auth.users table via admin API
            const { data: users } = await supabase.auth.admin.listUsers();
            const match = users?.users?.find(u => u.email === customerEmail);
            if (match) userId = match.id;
          } else {
            userId = profile.id;
          }

          if (!userId) {
            console.error(`No user found for email: ${customerEmail}`);
            break;
          }
          console.log(`Resolved user by email: ${customerEmail} → ${userId}`);
        }

        // Course purchase → create enrollment (CRIT-1 fix: removed stripe_session_id — column doesn't exist)
        if (userId && courseId) {
          const { error } = await supabase.from('enrollments').upsert(
            {
              user_id: userId,
              course_id: courseId,
              enrolled_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,course_id' }
          );
          if (error) console.error('Failed to create enrollment:', error);
          else console.log(`Enrollment created: user=${userId}, course=${courseId}`);
        }

        // Subscription purchase → create/update subscription
        if (userId && session.mode === 'subscription') {
          const communityId = session.metadata?.community_id || 'a0000000-0000-0000-0000-000000000001';
          const subId = session.subscription as string;

          // Use stripe_subscription_id for upsert (has UNIQUE constraint in DB)
          // CRIT-2 fix: upsert on stripe_subscription_id instead of community_id,user_id
          // HIGH-1 fix: default plan 'monthly' instead of 'pro' (DB CHECK constraint)
          const { error } = await supabase.from('subscriptions').upsert(
            {
              community_id: communityId,
              user_id: userId,
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: subId,
              plan: session.metadata?.plan || 'monthly',
              status: 'active',
            },
            { onConflict: 'stripe_subscription_id' }
          );
          if (error) console.error('Failed to create subscription:', error);
          else console.log(`Subscription created: user=${userId}, sub=${subId}`);

          // Auto-enroll in subscription-included courses only
          // Premium courses (is_premium = true) require separate purchase
          // e.g. Growth Marketing Masterclass ($499) and TwinGen are premium add-ons
          const { data: includedCourses } = await supabase
            .from('courses')
            .select('id')
            .eq('is_free', false)
            .eq('published', true)
            .eq('is_premium', false);

          if (includedCourses && includedCourses.length > 0) {
            const enrollments = includedCourses.map(c => ({
              user_id: userId!,
              course_id: c.id,
              enrolled_at: new Date().toISOString(),
            }));
            const { error: enrollErr } = await supabase
              .from('enrollments')
              .upsert(enrollments, { onConflict: 'user_id,course_id' });
            if (enrollErr) console.error('Failed to auto-enroll:', enrollErr);
            else console.log(`Auto-enrolled in ${includedCourses.length} subscription courses`);
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: sub.status,
            current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
            current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
            cancel_at_period_end: sub.cancel_at_period_end,
          })
          .eq('stripe_subscription_id', sub.id);
        if (error) console.error('Failed to update subscription:', error);
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        await supabase
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('stripe_subscription_id', sub.id);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          await supabase
            .from('subscriptions')
            .update({ status: 'past_due' })
            .eq('stripe_subscription_id', invoice.subscription as string);
        }
        break;
      }

      default:
        console.log(`Unhandled event: ${event.type}`);
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
    return new Response('Internal error', { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
});
