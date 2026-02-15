import Stripe from 'stripe';
import { loadStripe, Stripe as StripeJS } from '@stripe/stripe-js';

// Server-side Stripe instance
// This should only be used in API routes (server-side)
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
  typescript: true,
});

// Client-side Stripe promise (singleton pattern)
let stripePromise: Promise<StripeJS | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

// Product configuration for Law Firm RAG Pilot
export const PILOT_PRODUCT = {
  name: 'Law Firm RAG - Pilot Access',
  description: 'Full pilot implementation of our AI-powered legal research system. Includes setup, training, and 30 days of support.',
  price: 2500, // $2,500 in dollars
  priceInCents: 250000, // $2,500 in cents for Stripe
  currency: 'usd',
};

// Helper type for checkout session creation
export interface CreateCheckoutSessionParams {
  customerEmail?: string;
  successUrl?: string;
  cancelUrl?: string;
  clientReferenceId?: string;
}

// Helper function to create checkout session configuration
export const createCheckoutSessionConfig = ({
  customerEmail,
  successUrl,
  cancelUrl,
  clientReferenceId,
}: CreateCheckoutSessionParams): Stripe.Checkout.SessionCreateParams => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return {
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price: process.env.STRIPE_PILOT_PRICE_ID,
        quantity: 1,
      },
    ],
    success_url: successUrl || `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl || `${baseUrl}/checkout/cancel`,
    ...(customerEmail && { customer_email: customerEmail }),
    ...(clientReferenceId && { client_reference_id: clientReferenceId }),
    metadata: {
      product: 'law-firm-rag-pilot',
    },
    allow_promotion_codes: true,
    billing_address_collection: 'required',
  };
};

// Helper to format price for display
export const formatPrice = (priceInCents: number, currency: string = 'usd'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(priceInCents / 100);
};
