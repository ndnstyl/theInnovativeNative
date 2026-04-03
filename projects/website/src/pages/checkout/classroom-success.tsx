import React, { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { useTrackEvent } from '@/hooks/useTrackEvent';

const ClassroomSuccess: React.FC = () => {
  const { trackPurchase } = useTrackEvent();

  // Fire purchase event once on mount
  useEffect(() => {
    // Price passed from URL params when available, fallback to 0 (Stripe has the real amount)
    const params = new URLSearchParams(window.location.search);
    const amount = Number(params.get('amount')) || 0;
    trackPurchase('classroom-enrollment', 'Course Enrollment', amount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout header={1} footer={1} video={false}>
      <Head>
        <title>Welcome to BuildMyTribe.AI</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 20px 80px',
      }}>
        <div style={{ textAlign: 'center', maxWidth: 520 }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'rgba(0, 255, 255, 0.1)',
            border: '2px solid rgba(0, 255, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: 28,
            color: '#00FFFF',
          }}>
            <i className="fa-solid fa-check" />
          </div>

          <h1 style={{ color: '#fff', fontSize: 32, marginBottom: 12 }}>
            You&apos;re Enrolled!
          </h1>

          <p style={{ color: '#999', fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>
            Payment confirmed. Your course is ready — dive in and start learning now.
          </p>

          <Link
            href="/classroom"
            className="btn btn--primary"
            style={{ fontSize: 16, padding: '14px 32px' }}
          >
            Start Your Course
            <i className="fa-solid fa-arrow-right" style={{ marginLeft: 8 }} />
          </Link>

          <p style={{ color: '#666', fontSize: 13, marginTop: 24 }}>
            Check your email for enrollment confirmation. Questions?{' '}
            <a href="mailto:info@theinnovativenative.com" style={{ color: '#00FFFF' }}>
              info@theinnovativenative.com
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ClassroomSuccess;
