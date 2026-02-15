import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

const CheckoutCancel = () => {
  return (
    <>
      <Head>
        <title>Payment Cancelled | Law Firm RAG</title>
        <meta name="description" content="Your payment was cancelled. Complete your purchase to get started with Law Firm RAG." />
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div className="checkout-result">
        <div className="checkout-result__container">
          <div className="checkout-result__content">
            <div className="checkout-result__icon checkout-result__icon--cancel">
              <i className="fa-solid fa-xmark"></i>
            </div>

            <h1 className="checkout-result__title">Payment Cancelled</h1>

            <p className="checkout-result__subtitle">
              Your payment was not completed. No charges have been made.
            </p>

            <div className="checkout-result__message">
              <h3>Still Interested?</h3>
              <p>
                The Law Firm RAG pilot program offers a complete AI-powered legal research
                solution at <strong>$2,500</strong> - a fraction of the cost of traditional
                research tools.
              </p>

              <div className="checkout-result__benefits">
                <div className="benefit-item">
                  <i className="fa-solid fa-check"></i>
                  <span>Practice-area specific AI training</span>
                </div>
                <div className="benefit-item">
                  <i className="fa-solid fa-check"></i>
                  <span>Full implementation and setup</span>
                </div>
                <div className="benefit-item">
                  <i className="fa-solid fa-check"></i>
                  <span>30 days of dedicated support</span>
                </div>
                <div className="benefit-item">
                  <i className="fa-solid fa-check"></i>
                  <span>Secure, confidential processing</span>
                </div>
              </div>
            </div>

            <div className="checkout-result__ctas">
              <Link href="/law-firm-rag#pricing" className="btn btn--primary">
                Complete Purchase
                <i className="fa-solid fa-arrow-right"></i>
              </Link>
              <Link href="/" className="btn btn--secondary">
                Return Home
              </Link>
            </div>

            <div className="checkout-result__help">
              <p>
                <i className="fa-solid fa-question-circle"></i>
                Have questions before purchasing?
              </p>
              <div className="help-options">
                <a href="mailto:sales@theinnovativenative.com" className="help-link">
                  <i className="fa-solid fa-envelope"></i>
                  Email Us
                </a>
                <a href="https://calendly.com/theinnovativenative" target="_blank" rel="noopener noreferrer" className="help-link">
                  <i className="fa-solid fa-calendar"></i>
                  Schedule a Call
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="checkout-result__glow checkout-result__glow--cancel"></div>
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

        .checkout-result__icon--cancel {
          background: rgba(255, 107, 107, 0.15);
          border: 2px solid #ff6b6b;
          color: #ff6b6b;
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

        .checkout-result__message {
          text-align: left;
          margin-bottom: 32px;
          padding: 24px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
        }

        .checkout-result__message h3 {
          font-size: 1rem;
          font-weight: 700;
          color: var(--primary-color);
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .checkout-result__message p {
          font-size: 15px;
          color: var(--white);
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .checkout-result__message p strong {
          color: var(--primary-color);
        }

        .checkout-result__benefits {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          color: var(--white);
        }

        .benefit-item i {
          color: var(--primary-color);
          font-size: 14px;
          min-width: 20px;
        }

        .checkout-result__ctas {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }

        .checkout-result__ctas :global(.btn) {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-width: 180px;
        }

        .checkout-result__help {
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .checkout-result__help > p {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 14px;
          color: var(--secondary-color);
          margin-bottom: 16px;
        }

        .checkout-result__help > p i {
          color: var(--primary-color);
        }

        .help-options {
          display: flex;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .help-link {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: var(--primary-color);
          text-decoration: none;
          transition: opacity 0.3s;
        }

        .help-link:hover {
          opacity: 0.8;
        }

        .help-link i {
          font-size: 16px;
        }

        .checkout-result__glow {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
        }

        .checkout-result__glow--cancel {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(255, 107, 107, 0.08);
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

          .checkout-result__ctas {
            flex-direction: column;
          }

          .checkout-result__ctas :global(.btn) {
            width: 100%;
            justify-content: center;
          }

          .help-options {
            flex-direction: column;
            align-items: center;
            gap: 16px;
          }
        }
      `}</style>
    </>
  );
};

export default CheckoutCancel;
