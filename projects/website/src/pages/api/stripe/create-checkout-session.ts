import type { NextApiRequest, NextApiResponse } from 'next';
import { stripe, createCheckoutSessionConfig } from '@/lib/stripe';

interface CheckoutSessionRequest {
  customerEmail?: string;
  clientReferenceId?: string;
}

interface CheckoutSessionResponse {
  sessionId?: string;
  url?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CheckoutSessionResponse>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { customerEmail, clientReferenceId }: CheckoutSessionRequest = req.body;

    // Validate environment variables
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('Missing STRIPE_SECRET_KEY');
      return res.status(500).json({ error: 'Stripe configuration error' });
    }

    if (!process.env.STRIPE_PILOT_PRICE_ID) {
      console.error('Missing STRIPE_PILOT_PRICE_ID');
      return res.status(500).json({ error: 'Product configuration error' });
    }

    // Create checkout session configuration
    const sessionConfig = createCheckoutSessionConfig({
      customerEmail,
      clientReferenceId,
    });

    // Create the checkout session
    const session = await stripe.checkout.sessions.create(sessionConfig);

    if (!session.url) {
      return res.status(500).json({ error: 'Failed to create checkout session' });
    }

    return res.status(200).json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);

    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
}
