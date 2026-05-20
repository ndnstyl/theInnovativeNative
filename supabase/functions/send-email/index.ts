// Supabase Edge Function: Transactional Email Sender
// Deploy: supabase functions deploy send-email
// Set secrets: supabase secrets set RESEND_API_KEY=re_...
//
// Supports: welcome, enrollment_confirm, payment_receipt, password_reset, event_reminder

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.95.0';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || '';
const FROM_EMAIL = 'The Innovative Native <noreply@theinnovativenative.com>';
const SITE_URL = 'https://theinnovativenative.com';

interface EmailRequest {
  type: string;
  to: string;
  data: Record<string, any>;
}

const TEMPLATES: Record<string, (data: Record<string, any>) => { subject: string; html: string }> = {
  welcome: (data) => ({
    subject: `Welcome to The Innovative Native, ${data.name || 'there'}!`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h1 style="color: #0a0a0a;">Welcome to the community</h1>
        <p>Hey ${data.name || 'there'},</p>
        <p>You're in. Here's what you can do next:</p>
        <ul>
          <li><strong>Complete your profile</strong> — add a photo and bio so people know who you are</li>
          <li><strong>Explore the community</strong> — introduce yourself in the feed</li>
          <li><strong>Check out the classroom</strong> — browse available courses</li>
        </ul>
        <a href="${SITE_URL}/community" style="display:inline-block; padding:12px 24px; background:#0a0a0a; color:#fff; text-decoration:none; border-radius:8px; margin-top:16px;">
          Go to Community
        </a>
        <p style="margin-top:24px; color:#666; font-size:14px;">— The Innovative Native</p>
      </div>
    `,
  }),

  enrollment_confirm: (data) => ({
    subject: `You're enrolled in ${data.course_name}`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h1 style="color: #0a0a0a;">Enrollment confirmed</h1>
        <p>You now have access to <strong>${data.course_name}</strong>.</p>
        <a href="${SITE_URL}/classroom/${data.course_slug}" style="display:inline-block; padding:12px 24px; background:#0a0a0a; color:#fff; text-decoration:none; border-radius:8px; margin-top:16px;">
          Start Learning
        </a>
        <p style="margin-top:24px; color:#666; font-size:14px;">— The Innovative Native</p>
      </div>
    `,
  }),

  payment_receipt: (data) => ({
    subject: `Payment receipt — $${data.amount}`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h1 style="color: #0a0a0a;">Payment received</h1>
        <table style="width:100%; border-collapse:collapse; margin:16px 0;">
          <tr><td style="padding:8px 0; border-bottom:1px solid #eee;">Product</td><td style="padding:8px 0; border-bottom:1px solid #eee; text-align:right;">${data.product_name}</td></tr>
          <tr><td style="padding:8px 0; border-bottom:1px solid #eee;">Amount</td><td style="padding:8px 0; border-bottom:1px solid #eee; text-align:right;">$${data.amount}</td></tr>
          <tr><td style="padding:8px 0;">Date</td><td style="padding:8px 0; text-align:right;">${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</td></tr>
        </table>
        <p style="color:#666; font-size:14px;">If you have questions about this charge, reply to this email.</p>
      </div>
    `,
  }),

  event_reminder: (data) => ({
    subject: `Reminder: ${data.event_title} starts soon`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h1 style="color: #0a0a0a;">${data.event_title}</h1>
        <p>Starts at <strong>${data.start_time}</strong></p>
        ${data.location_url ? `<p><a href="${data.location_url}">Join the event</a></p>` : ''}
        <a href="${SITE_URL}/community/calendar/${data.event_id}" style="display:inline-block; padding:12px 24px; background:#0a0a0a; color:#fff; text-decoration:none; border-radius:8px; margin-top:16px;">
          View Event
        </a>
      </div>
    `,
  }),
};

serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // Verify request is from our own system (service role key in Authorization header)
  const authHeader = req.headers.get('Authorization');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!authHeader || !authHeader.includes(supabaseServiceKey || '')) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { type, to, data }: EmailRequest = await req.json();

  const template = TEMPLATES[type];
  if (!template) {
    return new Response(`Unknown email type: ${type}`, { status: 400 });
  }

  const { subject, html } = template(data);

  if (!RESEND_API_KEY) {
    console.log(`[DRY RUN] Would send "${subject}" to ${to}`);
    return new Response(JSON.stringify({ sent: false, dry_run: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Resend API error:', error);
    return new Response(`Email send failed: ${error}`, { status: 500 });
  }

  return new Response(JSON.stringify({ sent: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
