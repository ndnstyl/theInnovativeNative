import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';

export default function RefundPolicyPage() {
  return (
    <>
      <Head>
        <title>Refund Policy | The Innovative Native LLC</title>
        <meta name="description" content="Refund policy for The Innovative Native LLC products and services. All sales are final." />
      </Head>
      <Layout header={1} footer={1} video={false}>
        <section className="section legal-page">
          <div className="container">
            <div className="legal-page__content">
              <nav className="legal-page__breadcrumb">
                <Link href="/">Home</Link>
                <span>/</span>
                <span>Refund Policy</span>
              </nav>

              <h1 className="legal-page__title">Refund Policy</h1>
              <p className="legal-page__updated">Effective Date: July 07, 2025</p>

              <div className="legal-page__intro legal-page__intro--warning">
                <div className="legal-page__intro-icon">
                  <i className="fa-solid fa-circle-exclamation"></i>
                </div>
                <div>
                  <h3>All Sales Are Final</h3>
                  <p>
                    Due to the immediate nature of digital products and automation systems, all sales are final. Please review this policy carefully before making a purchase.
                  </p>
                </div>
              </div>

              <div className="legal-page__section">
                <h2>Non-Refundable Policy</h2>
                <p>
                  All purchases from The Innovative Native LLC (&quot;TIN,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) are <strong>non-refundable</strong> once access is granted or materials are delivered. This applies to all digital products, courses, templates, workflows, done-for-you services, and subscription-based offerings.
                </p>
                <p><strong>Definition of &quot;Access Granted&quot;:</strong> Access is considered granted at the earliest of the following: (a) login credentials are issued or activated, (b) a course portal or product dashboard becomes accessible to you, (c) downloadable materials are made available for download, (d) done-for-you service work has commenced, or (e) a confirmation email containing access instructions is delivered to your registered email address.</p>
              </div>

              <div className="legal-page__section">
                <h2>7-Day Free Trial</h2>
                <p>
                  All subscription-based products include a <strong>7-day free trial period</strong>. You may cancel at any time during the trial at no charge. After the 7th day, your subscription will be charged automatically and is non-refundable for the current billing period.
                </p>
                <ul>
                  <li>Free trial begins on the date of initial sign-up.</li>
                  <li>You may receive a reminder before your trial expires; however, it is your responsibility to track your trial period and cancel before it ends if you do not wish to be charged.</li>
                  <li>Cancellation during the trial period results in no charge.</li>
                  <li>Once the trial ends and payment is processed, the no-refund policy applies.</li>
                </ul>
              </div>

              <div className="legal-page__section">
                <h2>Monthly Subscriptions</h2>
                <p>
                  You may cancel your monthly subscription at any time. Cancellation stops future billing but does not entitle you to a refund for the current or prior billing periods.
                </p>
                <ul>
                  <li>Cancellation takes effect at the end of the current billing cycle.</li>
                  <li>You retain access to your subscription benefits until the end of the paid period.</li>
                  <li>No partial refunds are issued for unused portions of a billing period.</li>
                </ul>
                <p><strong>How to Cancel:</strong> You may cancel your subscription at any time by (1) accessing your account settings and selecting &quot;Cancel Subscription,&quot; or (2) emailing <a href="mailto:info@theinnovativenative.com">info@theinnovativenative.com</a> with the subject line &quot;Cancel Subscription&quot; and your account email address. Cancellation requests submitted via email will be processed within two (2) business days.</p>
              </div>

              <div className="legal-page__section">
                <h2>Lifetime Access &amp; Downloadable Purchases</h2>
                <p>
                  All lifetime access purchases and downloadable workflow/template purchases are <strong>final and non-refundable</strong>. Due to the immediate and irrevocable nature of digital delivery, no refunds will be issued for these product types.
                </p>
                <ul>
                  <li>Lifetime access products provide perpetual access upon purchase.</li>
                  <li>Downloadable products are delivered instantly and cannot be &quot;returned.&quot;</li>
                  <li>This includes but is not limited to: n8n workflow templates, automation blueprints, course bundles, and digital toolkits.</li>
                </ul>
                <p><strong>Lifetime Access Defined:</strong> &quot;Lifetime access&quot; means access for the operational lifetime of the product or platform, not in perpetuity. In the event that TIN discontinues a product or ceases operations, we will make commercially reasonable efforts to provide at least ninety (90) days&apos; advance notice and, where feasible, provide downloadable versions of your purchased content before access ends. &quot;Lifetime access&quot; does not guarantee indefinite hosting, maintenance, or updates of the product.</p>
              </div>

              <div className="legal-page__section">
                <h2>Rare Exception Clause</h2>
                <p>
                  A refund may be considered <strong>only</strong> in the following rare circumstances:
                </p>
                <ul>
                  <li>A verifiable, system-wide failure that prevents <strong>all users</strong> from accessing the product.</li>
                  <li>The failure is solely caused by company infrastructure (not third-party services, user configuration, or external factors).</li>
                  <li>The issue is not resolved within <strong>5 business days</strong> of being reported.</li>
                </ul>
                <p>
                  Exception requests must be submitted in writing to <a href="mailto:info@theinnovativenative.com">info@theinnovativenative.com</a> with detailed documentation of the issue. Exceptions are granted at our sole discretion.
                </p>
              </div>

              <div className="legal-page__section">
                <h2>Chargeback &amp; Dispute Policy</h2>
                <p>
                  <strong>Initiating a chargeback or payment dispute without first contacting us is a violation of these terms.</strong> We take chargebacks seriously, as they incur significant fees and undermine trust.
                </p>
                <p>
                  If you have a concern about a charge, please contact us at <a href="mailto:info@theinnovativenative.com">info@theinnovativenative.com</a> first. We are committed to resolving issues fairly and promptly.
                </p>
                <p>If a chargeback is initiated without prior contact:</p>
                <ul>
                  <li>Your account and access to all products and services will be permanently revoked.</li>
                  <li>You may be responsible for all chargeback fees, administrative costs, and collection expenses.</li>
                  <li>TIN reserves the right to pursue legal remedies for fraudulent chargebacks.</li>
                </ul>
              </div>

              <div className="legal-page__section">
                <h2>Contact</h2>
                <p>
                  If you have questions about this Refund Policy or need assistance before making a purchase, please contact us:
                </p>
                <p>
                  <strong>The Innovative Native LLC</strong><br />
                  304 S. Jones Blvd #221<br />
                  Las Vegas, NV 89107<br />
                  <strong>Email:</strong> <a href="mailto:info@theinnovativenative.com">info@theinnovativenative.com</a>
                </p>
              </div>

              <div className="legal-page__footer">
                <p>
                  By purchasing any product or service from The Innovative Native LLC, you acknowledge that you have read, understood, and agree to this Refund Policy.
                </p>
                <p style={{ marginTop: 16 }}>
                  <Link href="/terms-and-conditions">View Terms &amp; Conditions</Link>
                </p>
                <p style={{ marginTop: 16 }}>
                  &copy; 2025 The Innovative Native LLC. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </section>

        <style jsx>{`
          .legal-page {
            padding: 180px 0 80px;
          }

          .legal-page__content {
            max-width: 800px;
            margin: 0 auto;
          }

          .legal-page__breadcrumb {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.5);
            margin-bottom: 30px;
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .legal-page__breadcrumb a {
            color: var(--primary-color);
            text-decoration: none;
            transition: opacity 0.2s;
          }

          .legal-page__breadcrumb a:hover {
            opacity: 0.8;
          }

          .legal-page__title {
            font-size: clamp(32px, 5vw, 48px);
            font-weight: 800;
            color: var(--white);
            margin-bottom: 8px;
            line-height: 1.2;
          }

          .legal-page__updated {
            font-size: 14px;
            color: var(--secondary-color);
            margin-bottom: 32px;
          }

          .legal-page__intro {
            padding: 24px;
            background: rgba(0, 255, 255, 0.05);
            border-left: 4px solid var(--primary-color);
            border-radius: 0 8px 8px 0;
            margin-bottom: 40px;
          }

          .legal-page__intro--warning {
            background: rgba(255, 193, 7, 0.05);
            border-left-color: #ffc107;
            display: flex;
            gap: 20px;
            align-items: flex-start;
          }

          .legal-page__intro-icon {
            font-size: 32px;
            color: #ffc107;
            flex-shrink: 0;
          }

          .legal-page__intro h3 {
            font-size: 18px;
            font-weight: 700;
            color: #ffc107;
            margin: 0 0 12px 0;
          }

          .legal-page__intro p {
            color: rgba(255, 255, 255, 0.9);
            line-height: 1.7;
            margin: 0;
          }

          .legal-page__section {
            margin-bottom: 40px;
          }

          .legal-page__section h2 {
            font-size: 24px;
            font-weight: 700;
            color: var(--white);
            margin-bottom: 16px;
          }

          .legal-page__section p {
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.7;
            margin-bottom: 16px;
          }

          .legal-page__section ul {
            list-style: none;
            padding-left: 0;
            margin-bottom: 16px;
          }

          .legal-page__section li {
            position: relative;
            padding-left: 24px;
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.7;
            margin-bottom: 12px;
          }

          .legal-page__section li::before {
            content: "\u2192";
            position: absolute;
            left: 0;
            color: var(--primary-color);
          }

          .legal-page__section strong {
            color: var(--white);
            font-weight: 600;
          }

          .legal-page__section a {
            color: var(--primary-color);
            text-decoration: none;
            border-bottom: 1px solid rgba(0, 255, 255, 0.3);
            transition: border-color 0.2s;
          }

          .legal-page__section a:hover {
            border-color: var(--primary-color);
          }

          .legal-page__footer {
            margin-top: 60px;
            padding: 24px;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            text-align: center;
          }

          .legal-page__footer p {
            color: rgba(255, 255, 255, 0.9);
            margin: 0;
            font-size: 15px;
            line-height: 1.6;
          }

          .legal-page__footer a {
            color: var(--primary-color);
            text-decoration: none;
            border-bottom: 1px solid rgba(0, 255, 255, 0.3);
            transition: border-color 0.2s;
          }

          .legal-page__footer a:hover {
            border-color: var(--primary-color);
          }

          @media (max-width: 768px) {
            .legal-page {
              padding: 140px 0 60px;
            }

            .legal-page__section h2 {
              font-size: 20px;
            }

            .legal-page__intro--warning {
              flex-direction: column;
              gap: 16px;
            }

            .legal-page__intro-icon {
              font-size: 24px;
            }
          }
        `}</style>
      </Layout>
    </>
  );
}
