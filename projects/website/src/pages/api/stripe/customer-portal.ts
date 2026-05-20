import type { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/lib/stripe';

interface CustomerPortalRequest {
  customerId: string;
  returnUrl?: string;
}

interface CustomerPortalResponse {
  url?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CustomerPortalResponse>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { customerId, returnUrl }: CustomerPortalRequest = req.body;

    if (!customerId) {
      return res.status(400).json({ error: 'Customer ID is required' });
    }

    // Validate environment variables
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('Missing STRIPE_SECRET_KEY');
      return res.status(500).json({ error: 'Stripe configuration error' });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Create a billing portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || `${baseUrl}/dashboard`,
    });

    return res.status(200).json({ url: portalSession.url });
  } catch (error) {
    console.error('Error creating customer portal session:', error);

    if (error instanceof Error) {
      // Handle specific Stripe errors
      if (error.message.includes('No such customer')) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      return res.status(500).json({ error: error.message });
    }

    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
}
