import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';

export default function DisclaimerPage() {
  return (
    <>
      <Head>
        <title>Disclaimer | The Innovative Native LLC</title>
        <meta name="description" content="Earnings disclaimer and legal notices for The Innovative Native LLC products and services." />
      </Head>
      <Layout header={1} footer={1} video={false}>
        <section className="section legal-page">
          <div className="container">
            <div className="legal-page__content">
              <nav className="legal-page__breadcrumb">
                <Link href="/">Home</Link>
                <span>/</span>
                <span>Disclaimer</span>
              </nav>

              <h1 className="legal-page__title">Disclaimer</h1>
              <p className="legal-page__updated">Effective Date: July 07, 2025</p>

              <div className="legal-page__intro">
                <p>
                  The following disclaimer applies to all products, services, content, and communications provided by The Innovative Native LLC (&quot;TIN,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). By accessing or using our services, you acknowledge and agree to the terms set forth below.
                </p>
              </div>

              <div className="legal-page__section">
                <h2>1. No Earnings Guarantees</h2>
                <p>
                  The Innovative Native LLC makes no guarantees regarding income, earnings, or financial results from using our products, services, templates, courses, or any other offerings. Any income or earnings statements, examples, or results shared are estimates of what may be possible. There is no assurance you will achieve similar results.
                </p>
                <p>
                  <strong>Past performance is not indicative of future results.</strong> Any results referenced in our materials reflect specific circumstances that may not be replicable. Market conditions, regulatory environments, and competitive landscapes change continuously.
                </p>
              </div>

              <div className="legal-page__section">
                <h2>2. Illustrative Examples Only</h2>
                <p>
                  Any examples of income, revenue, or results displayed on our website, in our marketing materials, or within our products are illustrative only. These examples are not intended to represent or guarantee that everyone will achieve the same or similar results.
                </p>
              </div>

              <div className="legal-page__section">
                <h2>3. Results Vary by Individual</h2>
                <p>
                  Your results will vary based on your individual effort, business experience, expertise, market conditions, and many other factors beyond our control. There is no guarantee that you will earn any money using our products, techniques, ideas, or strategies.
                </p>
              </div>

              <div className="legal-page__section">
                <h2>4. Influencing Factors</h2>
                <p>
                  Success in business and with digital products depends on numerous factors, including but not limited to:
                </p>
                <ul>
                  <li>Your level of effort, commitment, and follow-through.</li>
                  <li>Your prior business experience and knowledge.</li>
                  <li>Your industry, niche, and competitive landscape.</li>
                  <li>Current market conditions and economic factors.</li>
                  <li>Your ability to implement and execute on strategies.</li>
                  <li>Technical proficiency and willingness to learn.</li>
                  <li>Access to capital, resources, and support networks.</li>
                </ul>
              </div>

              <div className="legal-page__section">
                <h2>5. Testimonials &amp; Case Studies</h2>
                <p>
                  Testimonials and case studies presented on our website or in our materials reflect the experiences of specific individuals. These results are not typical and should not be interpreted as a guarantee of future performance. Individual experiences and results will differ.
                </p>
              </div>

              <div className="legal-page__section">
                <h2>6. Affiliate &amp; Third-Party Promotions</h2>
                <p>
                  Our website and content may contain affiliate links or references to third-party products and services. We may receive compensation for referrals or sales generated through these links. The inclusion of any affiliate link or third-party reference does not constitute an endorsement or guarantee of that product or service.
                </p>
              </div>

              <div className="legal-page__section">
                <h2>7. FTC Compliance</h2>
                <p>
                  In accordance with Federal Trade Commission (FTC) guidelines, we disclose that material connections may exist between TIN and the products, services, or brands mentioned on our website or in our content. We are committed to transparency and compliance with all applicable advertising and disclosure requirements.
                </p>
              </div>

              <div className="legal-page__section">
                <h2>8. No Legal, Financial, or Tax Advice</h2>
                <p>
                  Nothing provided by The Innovative Native LLC should be construed as legal, financial, tax, or professional advice. Our products, services, and content are for informational and educational purposes only. You should consult with qualified professionals (attorneys, accountants, financial advisors) before making any business, legal, or financial decisions.
                </p>
              </div>

              <div className="legal-page__section">
                <h2>9. No Affiliation or Endorsement</h2>
                <p>
                  The Innovative Native LLC is not affiliated with, endorsed by, or sponsored by any third-party platform, tool, or service mentioned in our content unless explicitly stated otherwise. All trademarks, service marks, and trade names are the property of their respective owners.
                </p>
              </div>

              <div className="legal-page__section">
                <h2>10. AI Systems &amp; Output Disclaimer</h2>
                <p>The Innovative Native LLC builds and deploys AI-powered systems and automation workflows. While we strive for accuracy and reliability, AI systems may produce outputs that are incomplete, inaccurate, or require human review. You acknowledge that:</p>
                <ul>
                  <li>AI-generated outputs should be reviewed and validated before use in critical business decisions.</li>
                  <li>TIN does not guarantee the accuracy, completeness, or suitability of any AI-generated content or automation output.</li>
                  <li>You are solely responsible for reviewing, validating, and implementing any AI system outputs in your business.</li>
                  <li>AI technology is evolving rapidly, and system behavior may change as underlying models are updated by their providers.</li>
                </ul>
              </div>

              <div className="legal-page__section">
                <h2>11. Platform &amp; Technology Risk</h2>
                <p>Our products and services may rely on third-party platforms, APIs, and technologies (including but not limited to AI model providers, automation platforms, payment processors, and hosting services). These platforms may change their terms of service, pricing, features, or availability without notice. TIN is not responsible for disruptions, changes, or discontinuation of third-party services that may affect the functionality of our products.</p>
              </div>

              <div className="legal-page__section">
                <h2>Contact</h2>
                <p>
                  If you have questions about this Disclaimer, please contact us:
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
                  By using our products and services, you acknowledge that you have read, understood, and agree to this Disclaimer.
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
