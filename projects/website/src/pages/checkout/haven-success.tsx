import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { HAVEN_BLUEPRINT } from "@/data/haven-blueprint";

const HavenSuccess = () => {
  const router = useRouter();
  const { session_id } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [showUpsell, setShowUpsell] = useState(true);
  const [showDownsell, setShowDownsell] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleDeclineUpsell = () => {
    setShowUpsell(false);
    setShowDownsell(true);
  };

  const handleDeclineDownsell = () => {
    setShowDownsell(false);
  };

  return (
    <>
      <Head>
        <title>Welcome to the Blueprint | {HAVEN_BLUEPRINT.name}</title>
        <meta
          name="description"
          content="Your purchase was successful. Access your AI Influencer Blueprint now."
        />
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div className="checkout-result haven-success">
        <div className="checkout-result__container">
          {isLoading ? (
            <div className="checkout-result__loading">
              <div className="checkout-result__spinner"></div>
              <p>Setting up your blueprint access...</p>
            </div>
          ) : (
            <>
              {/* Success Confirmation */}
              <div className="checkout-result__content">
                <div className="checkout-result__icon checkout-result__icon--success">
                  <i className="fa-solid fa-check"></i>
                </div>

                <h1 className="checkout-result__title">
                  You&apos;re In. Let&apos;s Build.
                </h1>

                <p className="checkout-result__subtitle">
                  Your AI Influencer Blueprint is ready. Here&apos;s how to get
                  started right now.
                </p>

                {/* Delivery Links */}
                <div className="checkout-result__details">
                  <div className="checkout-result__detail-item">
                    <i className="fa-solid fa-book-open"></i>
                    <span>
                      <strong>Notion Workspace</strong> — Check your email for
                      the template duplication link
                    </span>
                  </div>
                  <div className="checkout-result__detail-item">
                    <i className="fa-solid fa-download"></i>
                    <span>
                      <strong>Workflow Files</strong> — n8n JSONs, FFMPEG
                      recipes, and prompt templates are in your inbox
                    </span>
                  </div>
                  <div className="checkout-result__detail-item">
                    <i className="fa-solid fa-play-circle"></i>
                    <span>
                      <strong>Video Walkthroughs</strong> — Module-by-module
                      setup guides linked in the Notion workspace
                    </span>
                  </div>
                </div>

                {/* Quick Start Steps */}
                <div className="checkout-result__next-steps">
                  <h3>Your 48-Hour Quick Start</h3>
                  <ol>
                    <li>
                      <strong>Duplicate the Notion workspace</strong> — Your
                      entire blueprint organized and ready
                    </li>
                    <li>
                      <strong>Run Module 1</strong> — Design your AI character
                      and brand foundation
                    </li>
                    <li>
                      <strong>Import the Airtable base</strong> — Your mission
                      control goes live
                    </li>
                    <li>
                      <strong>Deploy your first workflow</strong> — Generate your
                      first AI content
                    </li>
                  </ol>
                </div>

                {session_id && (
                  <p className="checkout-result__session-id">
                    Order reference: {session_id}
                  </p>
                )}
              </div>

              {/* Upsell 1: Done-For-You Setup */}
              {showUpsell && (
                <div className="haven-success__upsell haven-success__upsell--premium">
                  <div className="haven-success__upsell-badge haven-success__upsell-badge--premium">
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                    <span>ONE-TIME OFFER — ONLY AVAILABLE NOW</span>
                  </div>

                  <h2>Want Us To Build It For You?</h2>
                  <p className="haven-success__upsell-subtitle">
                    Skip the setup entirely. Our team will configure your
                    <strong> entire AI influencer pipeline</strong> — brand
                    system, Airtable base, n8n workflows, and your first
                    content batch — so you can go straight to publishing.
                  </p>

                  <div className="haven-success__upsell-features">
                    <div className="haven-success__upsell-feature">
                      <i className="fa-solid fa-paint-brush"></i>
                      <span>Full brand system configured</span>
                    </div>
                    <div className="haven-success__upsell-feature">
                      <i className="fa-solid fa-database"></i>
                      <span>Airtable base set up &amp; populated</span>
                    </div>
                    <div className="haven-success__upsell-feature">
                      <i className="fa-solid fa-gears"></i>
                      <span>n8n workflows deployed &amp; tested</span>
                    </div>
                    <div className="haven-success__upsell-feature">
                      <i className="fa-solid fa-video"></i>
                      <span>First content batch generated</span>
                    </div>
                  </div>

                  <div className="haven-success__upsell-price">
                    <span className="haven-success__upsell-amount">
                      ${HAVEN_BLUEPRINT.upsells.doneForYou.price}<small> one-time</small>
                    </span>
                    <span className="haven-success__upsell-note">
                      Done in 48 hours. You just show up and publish.
                    </span>
                  </div>

                  <div className="haven-success__upsell-actions">
                    <a
                      href={HAVEN_BLUEPRINT.upsells.doneForYou.stripeLink}
                      className="btn btn--primary btn--large"
                    >
                      Set It Up For Me — ${HAVEN_BLUEPRINT.upsells.doneForYou.price}
                      <i className="fa-solid fa-arrow-right"></i>
                    </a>
                    <button
                      onClick={handleDeclineUpsell}
                      className="haven-success__upsell-skip"
                    >
                      No thanks, I&apos;ll build it myself
                    </button>
                  </div>
                </div>
              )}

              {/* Upsell 2: Inner Circle */}
              {showDownsell && (
                <div className="haven-success__upsell">
                  <div className="haven-success__upsell-badge">
                    <i className="fa-solid fa-users"></i>
                    <span>JOIN THE COMMUNITY</span>
                  </div>

                  <h2>Build Alongside Other Creators</h2>
                  <p className="haven-success__upsell-subtitle">
                    The <strong>Haven Inner Circle</strong> — a private
                    community of AI influencer builders. Monthly live workshops,
                    direct Q&amp;A, pipeline reviews, and first access to every
                    new workflow and template we release.
                  </p>

                  <div className="haven-success__upsell-features">
                    <div className="haven-success__upsell-feature">
                      <i className="fa-solid fa-users"></i>
                      <span>Private builder community</span>
                    </div>
                    <div className="haven-success__upsell-feature">
                      <i className="fa-solid fa-video"></i>
                      <span>Monthly live workshops</span>
                    </div>
                    <div className="haven-success__upsell-feature">
                      <i className="fa-solid fa-comments"></i>
                      <span>Direct Q&amp;A and pipeline reviews</span>
                    </div>
                    <div className="haven-success__upsell-feature">
                      <i className="fa-solid fa-bolt"></i>
                      <span>First access to new workflows</span>
                    </div>
                  </div>

                  <div className="haven-success__upsell-price">
                    <span className="haven-success__upsell-amount">
                      ${HAVEN_BLUEPRINT.upsells.innerCircle.price}<small>/month</small>
                    </span>
                    <span className="haven-success__upsell-note">
                      Cancel anytime. No lock-in.
                    </span>
                  </div>

                  <div className="haven-success__upsell-actions">
                    <a
                      href={HAVEN_BLUEPRINT.upsells.innerCircle.stripeLink}
                      className="btn btn--primary btn--large"
                    >
                      Join the Inner Circle — ${HAVEN_BLUEPRINT.upsells.innerCircle.price}/mo
                      <i className="fa-solid fa-arrow-right"></i>
                    </a>
                    <button
                      onClick={handleDeclineDownsell}
                      className="haven-success__upsell-skip"
                    >
                      No thanks, take me to my blueprint
                    </button>
                  </div>
                </div>
              )}

              {/* Final Thank You (always visible after upsells dismissed) */}
              {!showUpsell && !showDownsell && (
                <div className="haven-success__thankyou">
                  <p>
                    <strong>
                      You&apos;re all set. Check your email for access links.
                    </strong>
                  </p>
                  <p>
                    Build the system once. Let it create for you forever.
                  </p>
                </div>
              )}

              <div className="checkout-result__ctas">
                <Link href="/" className="btn btn--tertiary">
                  Return Home
                </Link>
              </div>

              <div className="checkout-result__support">
                <p>
                  Questions? Email{" "}
                  <a href="mailto:info@theinnovativenative.com">
                    info@theinnovativenative.com
                  </a>
                </p>
              </div>
            </>
          )}
        </div>

        <div className="checkout-result__glow checkout-result__glow--success"></div>
      </div>

      <style jsx>{`
        .haven-success {
          min-height: 100vh;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          background: linear-gradient(
            180deg,
            var(--quaternary-color) 0%,
            var(--black) 100%
          );
          padding: 60px 20px;
          position: relative;
          overflow: hidden;
        }

        .checkout-result__container {
          max-width: 640px;
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
          margin-bottom: 24px;
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
          margin-bottom: 24px;
          padding: 24px;
          background: linear-gradient(
            135deg,
            rgba(0, 255, 255, 0.08) 0%,
            rgba(0, 255, 255, 0.02) 100%
          );
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
          font-family: monospace;
          opacity: 0.7;
        }

        /* Upsell Sections */
        .haven-success__upsell {
          background: rgba(14, 14, 14, 0.9);
          border: 1px solid rgba(212, 149, 106, 0.3);
          border-radius: 16px;
          padding: 40px 32px;
          margin-bottom: 24px;
          text-align: center;
        }

        .haven-success__upsell--downsell {
          border-color: rgba(0, 255, 255, 0.2);
        }

        .haven-success__upsell-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(212, 149, 106, 0.15);
          border: 1px solid rgba(212, 149, 106, 0.3);
          border-radius: 100px;
          padding: 6px 16px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          color: #d4956a;
          margin-bottom: 20px;
        }

        .haven-success__upsell h2 {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--white);
          margin-bottom: 12px;
        }

        .haven-success__upsell-subtitle {
          font-size: 1rem;
          color: var(--secondary-color);
          margin-bottom: 24px;
          line-height: 1.6;
        }

        .haven-success__upsell-features {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 24px;
          text-align: left;
        }

        .haven-success__upsell-feature {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: var(--white);
        }

        .haven-success__upsell-feature i {
          color: #d4956a;
          font-size: 16px;
          min-width: 20px;
        }

        .haven-success__upsell-price {
          margin-bottom: 24px;
        }

        .haven-success__upsell-amount {
          display: block;
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--white);
        }

        .haven-success__upsell-amount small {
          font-size: 1rem;
          font-weight: 400;
          color: var(--secondary-color);
        }

        .haven-success__upsell-note {
          display: block;
          font-size: 13px;
          color: var(--secondary-color);
          margin-top: 4px;
        }

        .haven-success__upsell-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .haven-success__upsell-skip {
          background: none;
          border: none;
          color: var(--secondary-color);
          font-size: 13px;
          cursor: pointer;
          text-decoration: underline;
          padding: 4px;
          transition: color 0.3s;
        }

        .haven-success__upsell-skip:hover {
          color: var(--white);
        }

        /* Thank You */
        .haven-success__thankyou {
          background: rgba(14, 14, 14, 0.8);
          border: 1px solid rgba(0, 255, 255, 0.15);
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 24px;
          text-align: center;
        }

        .haven-success__thankyou p {
          color: var(--secondary-color);
          font-size: 1rem;
          margin-bottom: 8px;
        }

        .haven-success__thankyou p:last-child {
          margin-bottom: 0;
          font-style: italic;
          color: var(--primary-color);
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
          top: 30%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 255, 255, 0.08);
        }

        @media (max-width: 640px) {
          .haven-success {
            padding: 40px 16px;
          }

          .checkout-result__content {
            padding: 32px 20px;
          }

          .checkout-result__title {
            font-size: 1.5rem;
          }

          .checkout-result__icon {
            width: 64px;
            height: 64px;
            font-size: 28px;
          }

          .haven-success__upsell {
            padding: 28px 20px;
          }

          .haven-success__upsell h2 {
            font-size: 1.25rem;
          }

          .haven-success__upsell-features {
            grid-template-columns: 1fr;
          }

          .haven-success__upsell-amount {
            font-size: 2rem;
          }
        }
      `}</style>
    </>
  );
};

export default HavenSuccess;
