import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';

export default function TemplateTermsPage() {
  return (
    <>
      <Head>
        <title>Terms of Service - n8n Templates | The Innovative Native</title>
        <meta name="description" content="Terms of service for n8n workflow templates from The Innovative Native." />
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <Layout header={1} footer={1} video={false}>
        <section className="section legal-page">
          <div className="container">
            <div className="legal-page__content">
              <nav className="legal-page__breadcrumb">
                <Link href="/templates">Templates</Link>
                <span>/</span>
                <span>Terms of Service</span>
              </nav>

              <h1 className="legal-page__title">Terms of Service</h1>
              <p className="legal-page__updated">Last Updated: February 9, 2026</p>

              <div className="legal-page__intro">
                <p>
                  These Terms of Service govern your purchase and use of n8n workflow templates from The Innovative Native.
                  By purchasing a template, you agree to these terms in full.
                </p>
              </div>

              <div className="legal-page__section">
                <h2>1. License Grant</h2>
                <p>
                  Upon purchase, you receive a <strong>non-exclusive, non-transferable license</strong> to use the workflow template
                  for your own projects or your clients&apos; projects. This license includes:
                </p>
                <ul>
                  <li>Unlimited use in personal and commercial projects</li>
                  <li>Modification and customization for your specific needs</li>
                  <li>Integration into your own automation systems</li>
                  <li>Deployment across multiple n8n instances you control</li>
                </ul>
              </div>

              <div className="legal-page__section">
                <h2>2. Restrictions</h2>
                <p>You may NOT:</p>
                <ul>
                  <li>Resell, redistribute, or sublicense the templates in their original or modified form</li>
                  <li>Claim authorship of the original template design</li>
                  <li>Package the templates as part of a competing template marketplace</li>
                  <li>Share login credentials or template files with unauthorized users</li>
                  <li>Extract and sell individual components as standalone products</li>
                </ul>
              </div>

              <div className="legal-page__section">
                <h2>3. Product Nature</h2>
                <p>
                  These templates are <strong>digital workflow configurations</strong>, not software as a service (SaaS) or managed solutions.
                  You acknowledge that:
                </p>
                <ul>
                  <li>Templates require a self-hosted or cloud-based n8n instance to function</li>
                  <li>You are responsible for configuring API credentials for third-party services</li>
                  <li>Templates may require technical knowledge to implement successfully</li>
                  <li>Compatibility with future n8n versions is not guaranteed</li>
                  <li>Templates interact with third-party APIs that may change without notice</li>
                </ul>
              </div>

              <div className="legal-page__section">
                <h2>4. No Warranty</h2>
                <p>
                  Templates are provided <strong>&quot;as is&quot;</strong> without warranty of any kind, express or implied.
                  The Innovative Native does not warrant that:
                </p>
                <ul>
                  <li>The templates will meet your specific requirements</li>
                  <li>The templates will be error-free or uninterrupted</li>
                  <li>Third-party APIs integrated in templates will remain available</li>
                  <li>The templates will be compatible with all n8n configurations</li>
                </ul>
              </div>

              <div className="legal-page__section">
                <h2>5. Limitation of Liability</h2>
                <p>
                  To the maximum extent permitted by law, The Innovative Native shall not be liable for:
                </p>
                <ul>
                  <li>Data loss or corruption resulting from template use</li>
                  <li>Costs incurred from third-party API usage triggered by templates</li>
                  <li>Business losses resulting from template malfunction</li>
                  <li>Indirect, incidental, or consequential damages</li>
                </ul>
                <p>
                  <strong>Your total liability is limited to the amount you paid for the template.</strong>
                </p>
              </div>

              <div className="legal-page__section">
                <h2>6. Third-Party APIs</h2>
                <p>
                  Templates may integrate with third-party services (e.g., Google, Airtable, Apify). You are responsible for:
                </p>
                <ul>
                  <li>Obtaining and managing your own API keys and credentials</li>
                  <li>Complying with the terms of service of each third-party provider</li>
                  <li>Monitoring API usage and associated costs</li>
                  <li>Updating credentials if third-party authentication methods change</li>
                </ul>
              </div>

              <div className="legal-page__section">
                <h2>7. Support</h2>
                <p>
                  Support is provided on a <strong>best-effort basis</strong> and is limited to:
                </p>
                <ul>
                  <li>Clarification of template documentation</li>
                  <li>Assistance with initial template configuration</li>
                  <li>Bug fixes for demonstrable template defects</li>
                </ul>
                <p>Support does NOT include:</p>
                <ul>
                  <li>Custom development or feature additions</li>
                  <li>Troubleshooting of your n8n installation</li>
                  <li>Debugging of third-party API issues</li>
                  <li>Training on n8n fundamentals</li>
                </ul>
              </div>

              <div className="legal-page__section">
                <h2>8. Updates and Modifications</h2>
                <p>
                  The Innovative Native may release updated versions of templates to address bugs or compatibility issues.
                  However, you are NOT entitled to:
                </p>
                <ul>
                  <li>New features added to templates after your purchase</li>
                  <li>Compatibility updates for n8n versions released more than 12 months after your purchase</li>
                  <li>Refunds or credits if you choose not to update</li>
                </ul>
              </div>

              <div className="legal-page__section">
                <h2>9. Refund Policy</h2>
                <p>
                  Due to the instant-access nature of digital products, all sales are final.
                  See our <Link href="/templates/refund-policy">Refund Policy</Link> for complete details.
                </p>
              </div>

              <div className="legal-page__section">
                <h2>10. Termination</h2>
                <p>
                  The Innovative Native reserves the right to terminate your license if you violate these terms.
                  Upon termination:
                </p>
                <ul>
                  <li>You must cease all use of the templates</li>
                  <li>You must delete all copies of template files</li>
                  <li>No refund will be issued</li>
                </ul>
              </div>

              <div className="legal-page__section">
                <h2>11. Governing Law</h2>
                <p>
                  These terms are governed by the laws of the State of California, United States, without regard to
                  conflict of law principles. Any disputes shall be resolved in the courts of California.
                </p>
              </div>

              <div className="legal-page__section">
                <h2>12. Changes to Terms</h2>
                <p>
                  The Innovative Native reserves the right to modify these terms at any time. Changes will be posted
                  on this page with an updated &quot;Last Updated&quot; date. Continued use of templates after changes constitutes
                  acceptance of the new terms.
                </p>
              </div>

              <div className="legal-page__section">
                <h2>13. Contact</h2>
                <p>
                  Questions about these terms? Contact us at:
                </p>
                <p>
                  <strong>Email:</strong> <a href="mailto:info@theinnovativenative.com">info@theinnovativenative.com</a><br />
                  <strong>Website:</strong> <a href="https://theinnovativenative.com">theinnovativenative.com</a>
                </p>
              </div>

              <div className="legal-page__footer">
                <p>
                  By purchasing a template, you confirm that you have read, understood, and agree to be bound by these Terms of Service.
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

          @media (max-width: 768px) {
            .legal-page {
              padding: 140px 0 60px;
            }

            .legal-page__section h2 {
              font-size: 20px;
            }
          }
        `}</style>
      </Layout>
    </>
  );
}
