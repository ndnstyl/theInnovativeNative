import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';

export default function RefundPolicyPage() {
  return (
    <>
      <Head>
        <title>Refund Policy - n8n Templates | The Innovative Native</title>
        <meta name="description" content="Refund policy for n8n workflow templates from The Innovative Native." />
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <Layout header={1} footer={1} video={false}>
        <section className="section legal-page">
          <div className="container">
            <div className="legal-page__content">
              <nav className="legal-page__breadcrumb">
                <Link href="/templates">Templates</Link>
                <span>/</span>
                <span>Refund Policy</span>
              </nav>

              <h1 className="legal-page__title">Refund Policy</h1>
              <p className="legal-page__updated">Last Updated: February 9, 2026</p>

              <div className="legal-page__intro legal-page__intro--warning">
                <div className="legal-page__intro-icon">
                  <i className="fa-solid fa-circle-exclamation"></i>
                </div>
                <div>
                  <h3>No Refunds Policy</h3>
                  <p>
                    Due to the instant-access nature of digital products, <strong>all sales are final</strong>.
                    No refunds or exchanges will be issued under any circumstances.
                  </p>
                </div>
              </div>

              <div className="legal-page__section">
                <h2>Why No Refunds?</h2>
                <p>
                  n8n workflow templates are digital goods that you receive immediate access to upon purchase.
                  Once you download the template JSON file, you have permanent possession of the product.
                  Unlike physical goods or subscription services, digital templates cannot be &quot;returned&quot; in any meaningful way.
                </p>
                <p>
                  This policy protects against abuse while keeping prices accessible for legitimate users.
                </p>
              </div>

              <div className="legal-page__section">
                <h2>Before You Buy</h2>
                <p>
                  To ensure you make an informed purchase decision, every template page includes:
                </p>
                <ul>
                  <li><strong>Detailed walkthrough:</strong> Step-by-step explanation of how the template works</li>
                  <li><strong>Technical requirements:</strong> Clear list of required APIs, credentials, and n8n version</li>
                  <li><strong>Difficulty rating:</strong> Beginner, Intermediate, or Advanced classification</li>
                  <li><strong>Use case description:</strong> Real-world scenarios where the template applies</li>
                  <li><strong>Prerequisites:</strong> What you need to know before implementing</li>
                </ul>
                <p>
                  <strong>We strongly encourage you to review all documentation before purchasing.</strong>
                  If you have questions, contact us at{' '}
                  <a href="mailto:info@theinnovativenative.com">info@theinnovativenative.com</a> before buying.
                </p>
              </div>

              <div className="legal-page__section">
                <h2>What Is NOT Eligible for Refund</h2>
                <p>The following scenarios do NOT qualify for refunds or credits:</p>
                <ul>
                  <li>
                    <strong>Technical difficulty:</strong> You find the template harder to implement than expected,
                    or you lack the technical knowledge to configure it properly.
                  </li>
                  <li>
                    <strong>Third-party API issues:</strong> APIs integrated in the template change their endpoints,
                    pricing, or availability after your purchase.
                  </li>
                  <li>
                    <strong>n8n version incompatibility:</strong> The template was designed for a specific n8n version,
                    and you are using a different version (check requirements before buying).
                  </li>
                  <li>
                    <strong>Changed requirements:</strong> Your project requirements changed after purchase,
                    and the template no longer fits your needs.
                  </li>
                  <li>
                    <strong>Buyer&apos;s remorse:</strong> You simply changed your mind or purchased by mistake.
                  </li>
                  <li>
                    <strong>Duplicate purchase:</strong> You accidentally purchased the same template twice
                    (verify your purchase history before buying).
                  </li>
                  <li>
                    <strong>External factors:</strong> Hosting issues, internet connectivity, or local configuration
                    problems that prevent the template from working.
                  </li>
                </ul>
              </div>

              <div className="legal-page__section">
                <h2>Technical Support vs. Refunds</h2>
                <p>
                  If you encounter technical difficulties with a template, <strong>contact support first</strong>
                  before concluding the product is defective. We provide assistance with:
                </p>
                <ul>
                  <li>Clarifying unclear documentation</li>
                  <li>Identifying configuration errors in your setup</li>
                  <li>Confirming API credential requirements</li>
                  <li>Fixing demonstrable bugs in the template logic</li>
                </ul>
                <p>
                  <strong>Support is NOT the same as a refund request.</strong> We will help you succeed with your purchase,
                  but we will not issue refunds because you need assistance.
                </p>
              </div>

              <div className="legal-page__section">
                <h2>Exceptions (Rare Cases)</h2>
                <p>
                  While our general policy is no refunds, we may consider exceptions in the following rare cases:
                </p>
                <ul>
                  <li>
                    <strong>Product defect:</strong> The template JSON file is corrupted, unreadable, or completely non-functional
                    due to an error on our end (not configuration issues).
                  </li>
                  <li>
                    <strong>Fraudulent transaction:</strong> Unauthorized purchase made with stolen payment information
                    (requires verification with payment processor).
                  </li>
                  <li>
                    <strong>Misleading description:</strong> The template description contains demonstrably false claims
                    about its functionality (subjective expectations do not qualify).
                  </li>
                </ul>
                <p>
                  Exception requests must be submitted within <strong>7 days of purchase</strong> with clear evidence
                  of the defect or issue. Exceptions are granted at our sole discretion.
                </p>
              </div>

              <div className="legal-page__section">
                <h2>Payment Processing</h2>
                <p>
                  All payments are processed through <strong>Stripe</strong>, a secure third-party payment processor.
                  The Innovative Native does not store your credit card information. If you have payment-related questions
                  (billing errors, duplicate charges), contact us immediately at{' '}
                  <a href="mailto:info@theinnovativenative.com">info@theinnovativenative.com</a>.
                </p>
              </div>

              <div className="legal-page__section">
                <h2>Chargebacks</h2>
                <p>
                  <strong>Filing a chargeback instead of contacting us is considered fraud.</strong> Chargebacks cost us
                  significant processing fees and undermine the trust required to operate a digital marketplace.
                </p>
                <p>If you file a chargeback:</p>
                <ul>
                  <li>Your account will be permanently banned from future purchases</li>
                  <li>Your template license will be immediately revoked</li>
                  <li>We may pursue legal action for fraudulent chargebacks</li>
                </ul>
                <p>
                  If you have a legitimate issue, contact us first. We are reasonable people who want you to succeed
                  with our products.
                </p>
              </div>

              <div className="legal-page__section">
                <h2>Free Updates</h2>
                <p>
                  While we do not offer refunds, we do provide <strong>free updates</strong> to templates you&apos;ve purchased
                  when we make improvements or fix bugs. This includes:
                </p>
                <ul>
                  <li>Bug fixes for template logic errors</li>
                  <li>Compatibility updates for major n8n version changes</li>
                  <li>Documentation improvements</li>
                </ul>
                <p>
                  Updates are provided for <strong>12 months after purchase</strong>. After that period, you may need
                  to repurchase if you want access to major new versions.
                </p>
              </div>

              <div className="legal-page__section">
                <h2>Pay-What-You-Want Pricing</h2>
                <p>
                  Many templates use <strong>pay-what-you-want pricing</strong> with a minimum of $0. This means you can
                  try templates for free before committing to a higher payment. If you choose to pay $0:
                </p>
                <ul>
                  <li>You receive the full template with all functionality</li>
                  <li>You still get access to documentation and basic support</li>
                  <li>You are NOT entitled to priority support or custom modifications</li>
                </ul>
                <p>
                  <strong>If you paid $0, you cannot request a refund for something you got for free.</strong>
                </p>
              </div>

              <div className="legal-page__section">
                <h2>Contact for Questions</h2>
                <p>
                  If you have questions about this refund policy or need clarification before purchasing, contact us at:
                </p>
                <p>
                  <strong>Email:</strong> <a href="mailto:info@theinnovativenative.com">info@theinnovativenative.com</a><br />
                  <strong>Response Time:</strong> Within 24-48 hours on business days
                </p>
                <p>
                  We prefer transparency over conflict. If you&apos;re unsure whether a template is right for you,
                  reach out before buying.
                </p>
              </div>

              <div className="legal-page__footer">
                <p>
                  By purchasing a template, you acknowledge that you have read and agree to this refund policy.
                  All sales are final. No exceptions except as explicitly stated above.
                </p>
                <p style={{ marginTop: 16 }}>
                  <Link href="/templates/terms">View Terms of Service →</Link>
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
            margin-bottom: 16px;
          }

          .legal-page__section li::before {
            content: "→";
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
