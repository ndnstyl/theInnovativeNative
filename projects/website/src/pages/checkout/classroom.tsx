import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useTrackEvent } from '@/hooks/useTrackEvent';

const PAYMENT_LINK = process.env.NEXT_PUBLIC_STRIPE_CLASSROOM_LINK;

const ClassroomCheckout: React.FC = () => {
  const { session, isLoading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { trackBeginCheckout } = useTrackEvent();

  useEffect(() => {
    if (isLoading) return;

    // Must be authenticated to checkout
    if (!session?.user) {
      router.replace('/classroom?auth=required');
      return;
    }

    if (!PAYMENT_LINK) {
      setError('Checkout is not configured yet. Please contact support.');
      return;
    }

    // Track begin_checkout event
    trackBeginCheckout('classroom-membership', 'BuildMyTribe.AI Membership', 99);

    // Redirect to Stripe Payment Link with pre-filled email
    const email = encodeURIComponent(session.user.email || '');
    window.location.href = `${PAYMENT_LINK}?prefilled_email=${email}`;
  }, [session, isLoading, router, trackBeginCheckout]);

  return (
    <Layout header={1} footer={1} video={false}>
      <Head>
        <title>Checkout — BuildMyTribe.AI</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div className="classroom-landing classroom-landing--loading">
        {error ? (
          <div style={{ textAlign: 'center', padding: '120px 20px 80px', color: '#fff' }}>
            <h2 style={{ marginBottom: 16 }}>Checkout Error</h2>
            <p style={{ color: '#999', marginBottom: 24 }}>{error}</p>
            <button
              className="btn btn--primary"
              onClick={() => router.push('/classroom')}
            >
              Back to Classroom
            </button>
          </div>
        ) : (
          <>
            <div className="classroom-loading__spinner" />
            <p style={{ color: '#999', textAlign: 'center', marginTop: 16 }}>
              Redirecting to checkout...
            </p>
          </>
        )}
      </div>
    </Layout>
  );
};

export default ClassroomCheckout;
