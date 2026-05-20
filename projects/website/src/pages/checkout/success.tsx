import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

const CheckoutSuccess = () => {
  const router = useRouter();
  const { session_id } = router.query;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Brief loading state for visual feedback
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head>
        <title>Payment Successful | Law Firm RAG</title>
        <meta name="description" content="Your payment was successful. Welcome to the Law Firm RAG pilot program." />
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div className="checkout-result">
        <div className="checkout-result__container">
          {isLoading ? (
            <div className="checkout-result__loading">
              <div className="checkout-result__spinner"></div>
              <p>Processing your payment...</p>
            </div>
          ) : (
            <div className="checkout-result__content">
              <div className="checkout-result__icon checkout-result__icon--success">
                <i className="fa-solid fa-check"></i>
              </div>

              <h1 className="checkout-result__title">Payment Successful!</h1>

              <p className="checkout-result__subtitle">
                Thank you for joining the Law Firm RAG pilot program.
              </p>

              <div className="checkout-result__details">
                <div className="checkout-result__detail-item">
                  <i className="fa-solid fa-envelope"></i>
                  <span>A confirmation email has been sent to your inbox</span>
                </div>
                <div className="checkout-result__detail-item">
                  <i className="fa-solid fa-calendar-check"></i>
                  <span>Our team will reach out within 24 hours to begin onboarding</span>
                </div>
                <div className="checkout-result__detail-item">
                  <i className="fa-solid fa-headset"></i>
                  <span>30 days of dedicated support included</span>
                </div>
              </div>

              <div className="checkout-result__next-steps">
                <h3>What Happens Next?</h3>
                <ol>
                  <li>
                    <strong>Onboarding Call</strong> - We&apos;ll schedule a kickoff call to understand your firm&apos;s specific needs
                  </li>
                  <li>
                    <strong>System Setup</strong> - Our team configures the RAG system for your practice areas
                  </li>
                  <li>
                    <strong>Training Session</strong> - Learn how to get the most out of your new AI research assistant
                  </li>
                  <li>
                    <strong>Go Live</strong> - Start using Law Firm RAG with full support
                  </li>
                </ol>
              </div>

              {session_id && (
                <p className="checkout-result__session-id">
                  Reference: {session_id}
                </p>
              )}

              <div className="checkout-result__ctas">
                <Link href="/" className="btn btn--primary">
                  Return Home
                  <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </div>

              <div className="checkout-result__support">
                <p>
                  Questions? Contact us at{' '}
                  <a href="mailto:info@theinnovativenative.com">
                    info@theinnovativenative.com
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Background Elements */}
        <div className="checkout-result__glow checkout-result__glow--success"></div>
      </div>

      <style jsx>{`
        .checkout-result {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, var(--quaternary-color) 0%, var(--black) 100%);
          padding: 40px 20px;
          position: relative;
          overflow: hidden;
        }

        .checkout-result__container {
          max-width: 600px;
          width: 100%;
          text-align: center;
          position: relative;
          z-index: 2;
        }

        .checkout-result__loading {
          padding: 60px 40px;
        }

        .checkout-result__spinner {
          width: 48px;
          height: 48px;
          border: 3px solid rgba(0, 255, 255, 0.2);
          border-top-color: var(--primary-color);
          border-radius: 50%;
          margin: 0 auto 20px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .checkout-result__loading p {
          color: var(--secondary-color);
          font-size: 16px;
        }

        .checkout-result__content {
          background: rgba(14, 14, 14, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 48px 40px;
          backdrop-filter: blur(10px);
        }

        .checkout-result__icon {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          margin: 0 auto 24px;
          font-size: 36px;
        }

        .checkout-result__icon--success {
          background: rgba(0, 255, 255, 0.15);
          border: 2px solid var(--primary-color);
          color: var(--primary-color);
        }

        .checkout-result__title {
          font-size: 2rem;
          font-weight: 800;
          color: var(--white);
          margin-bottom: 12px;
        }

        .checkout-result__subtitle {
          font-size: 1.125rem;
          color: var(--secondary-color);
          margin-bottom: 32px;
        }

        .checkout-result__details {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 32px;
          padding: 24px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
        }

        .checkout-result__detail-item {
          display: flex;
          align-items: center;
          gap: 12px;
          text-align: left;
          font-size: 15px;
          color: var(--white);
        }

        .checkout-result__detail-item i {
          color: var(--primary-color);
          font-size: 18px;
          min-width: 24px;
        }

        .checkout-result__next-steps {
          text-align: left;
          margin-bottom: 32px;
          padding: 24px;
          background: linear-gradient(135deg, rgba(0, 255, 255, 0.08) 0%, rgba(0, 255, 255, 0.02) 100%);
          border: 1px solid rgba(0, 255, 255, 0.2);
          border-radius: 12px;
        }

        .checkout-result__next-steps h3 {
          font-size: 1rem;
          font-weight: 700;
          color: var(--primary-color);
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .checkout-result__next-steps ol {
          list-style: none;
          padding: 0;
          margin: 0;
          counter-reset: step;
        }

        .checkout-result__next-steps li {
          position: relative;
          padding-left: 40px;
          margin-bottom: 16px;
          font-size: 14px;
          color: var(--white);
          line-height: 1.5;
          counter-increment: step;
        }

        .checkout-result__next-steps li:last-child {
          margin-bottom: 0;
        }

        .checkout-result__next-steps li::before {
          content: counter(step);
          position: absolute;
          left: 0;
          top: 0;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 255, 255, 0.2);
          border-radius: 50%;
          font-size: 12px;
          font-weight: 700;
          color: var(--primary-color);
        }

        .checkout-result__next-steps li strong {
          color: var(--primary-color);
        }

        .checkout-result__session-id {
          font-size: 12px;
          color: var(--secondary-color);
          margin-bottom: 24px;
          font-family: monospace;
          opacity: 0.7;
        }

        .checkout-result__ctas {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .checkout-result__ctas :global(.btn) {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .checkout-result__support {
          font-size: 14px;
          color: var(--secondary-color);
        }

        .checkout-result__support a {
          color: var(--primary-color);
          text-decoration: none;
          transition: opacity 0.3s;
        }

        .checkout-result__support a:hover {
          opacity: 0.8;
        }

        .checkout-result__glow {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
        }

        .checkout-result__glow--success {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 255, 255, 0.1);
        }

        @media (max-width: 640px) {
          .checkout-result__content {
            padding: 32px 24px;
          }

          .checkout-result__title {
            font-size: 1.5rem;
          }

          .checkout-result__icon {
            width: 64px;
            height: 64px;
            font-size: 28px;
          }

          .checkout-result__next-steps li {
            padding-left: 36px;
          }
        }
      `}</style>
    </>
  );
};

export default CheckoutSuccess;
