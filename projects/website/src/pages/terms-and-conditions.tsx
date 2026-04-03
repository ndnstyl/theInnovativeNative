import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';

export default function TermsAndConditionsPage() {
  return (
    <>
      <Head>
        <title>Terms &amp; Conditions | The Innovative Native LLC</title>
        <meta name="description" content="Terms and Conditions governing access to and use of products and services of The Innovative Native LLC." />
      </Head>
      <Layout header={1} footer={1} video={false}>
        <section className="section legal-page">
          <div className="container">
            <div className="legal-page__content">
              <nav className="legal-page__breadcrumb">
                <Link href="/">Home</Link>
                <span>/</span>
                <span>Terms &amp; Conditions</span>
              </nav>

              <h1 className="legal-page__title">Terms &amp; Conditions</h1>
              <p className="legal-page__updated">Effective Date: July 07, 2025</p>

              <div className="legal-page__intro">
                <p>
                  These Terms &amp; Conditions govern access to and use of products and services of The Innovative Native LLC (&quot;TIN,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). By purchasing, accessing, or using the Service, you agree to be bound by these Terms.
                </p>
              </div>

              <div className="legal-page__section">
                <h2>1. Eligibility</h2>
                <p>You must be at least eighteen (18) years of age to purchase, access, or use our products and services. By using the Service, you represent and warrant that you meet this age requirement and have the legal capacity to enter into a binding agreement.</p>
              </div>

              <div className="legal-page__section">
                <h2>2. Electronic Communications Consent</h2>
                <p>By creating an account or making a purchase, you consent to receive electronic communications from TIN, including but not limited to: transactional emails, account notifications, service updates, and promotional materials. You agree that all agreements, notices, disclosures, and other communications provided electronically satisfy any legal requirement that such communications be in writing.</p>
                <p>You may opt out of promotional communications at any time by following the unsubscribe instructions in any email or by contacting us at <a href="mailto:info@theinnovativenative.com">info@theinnovativenative.com</a>.</p>
              </div>

              <div className="legal-page__section">
                <h2>3. Digital Product &amp; Service Nature</h2>
                <p>
                  All offerings are digital products and/or done-for-you (DFY) services delivered electronically. Once access is granted, <strong>ALL SALES ARE FINAL AND NON-REFUNDABLE.</strong>
                </p>
                <p>
                  You acknowledge that upon purchase, you receive immediate access to digital content and/or services that cannot be &quot;returned&quot; in any traditional sense.
                </p>
              </div>

              <div className="legal-page__section">
                <h2>4. Payment Authorization &amp; Responsibility</h2>
                <ul>
                  <li>By submitting payment, you authorize TIN to charge your selected payment method for the agreed-upon amount.</li>
                  <li>You are responsible for providing accurate and current billing information.</li>
                  <li>For subscription-based products, your payment method will be charged automatically at the start of each renewal period unless you cancel prior to the renewal date.</li>
                  <li><strong>Auto-Renewal Disclosure:</strong> Subscription plans renew automatically at the then-current rate unless you cancel before the renewal date. You will be notified of any price changes before they take effect. By subscribing, you authorize recurring charges until you cancel. You may cancel at any time through your account settings or by contacting <a href="mailto:info@theinnovativenative.com">info@theinnovativenative.com</a>.</li>
                  <li>You are responsible for all charges incurred under your account.</li>
                </ul>
              </div>

              <div className="legal-page__section">
                <h2>5. Dispute Resolution</h2>
                <ul>
                  <li><strong>Mandatory Internal Resolution:</strong> Before initiating any formal dispute, you must first contact us at <a href="mailto:info@theinnovativenative.com">info@theinnovativenative.com</a> to attempt resolution in good faith.</li>
                  <li><strong>Dispute Waiver:</strong> By purchasing our products or services, you acknowledge the no-refund policy and waive the right to dispute charges except in cases of unauthorized transactions.</li>
                  <li><strong>Evidence Provision:</strong> In the event of a dispute, you agree to provide all relevant documentation and cooperate fully in the resolution process.</li>
                  <li><strong>Recovery of Costs:</strong> If a chargeback or payment dispute is initiated without first contacting us, you may be responsible for all associated fees, including but not limited to chargeback fees, administrative costs, and collection fees.</li>
                  <li><strong>Temporary Suspension:</strong> TIN reserves the right to temporarily suspend your access to products or services during the pendency of any payment dispute.</li>
                </ul>
              </div>

              <div className="legal-page__section">
                <h2>6. Intellectual Property</h2>
                <p>
                  All content, materials, templates, workflows, courses, branding, code, documentation, and other intellectual property provided through our services are the exclusive property of The Innovative Native LLC. Unauthorized reproduction, distribution, modification, or resale is strictly prohibited.
                </p>
              </div>

              <div className="legal-page__section">
                <h2>7. User-Generated Content</h2>
                <p>By submitting, posting, or sharing content through our services (including but not limited to community posts, comments, and course discussions), you grant TIN a non-exclusive, royalty-free, worldwide, perpetual, irrevocable license to use, reproduce, modify, display, distribute, and create derivative works from such content in connection with operating and improving our services.</p>
                <p>You represent and warrant that you own or have the necessary rights to the content you submit and that such content does not violate any third-party rights.</p>
              </div>

              <div className="legal-page__section">
                <h2>8. Account Use &amp; Security</h2>
                <ul>
                  <li>Your account credentials are confidential and for your use only.</li>
                  <li>You may not share, transfer, or resell access to your account or any products or services obtained through your account.</li>
                  <li>You are responsible for maintaining the security of your account and for all activities that occur under your account.</li>
                  <li>You must notify us immediately of any unauthorized use of your account.</li>
                </ul>
              </div>

              <div className="legal-page__section">
                <h2>9. Account Termination</h2>
                <p>TIN reserves the right to suspend or terminate your account and access to any or all services, without prior notice or liability, for any reason, including but not limited to:</p>
                <ul>
                  <li>Violation of these Terms or any other TIN policy.</li>
                  <li>Fraudulent, abusive, or unlawful activity.</li>
                  <li>Account sharing or unauthorized access.</li>
                  <li>Initiation of a chargeback or payment dispute in bad faith.</li>
                  <li>Conduct that is harmful to other users, TIN, or third parties.</li>
                </ul>
                <p>Upon termination, your right to access the Service ceases immediately. TIN is not obligated to provide refunds or maintain your data following termination for cause.</p>
              </div>

              <div className="legal-page__section">
                <h2>10. Acceptable Use &amp; Prohibited Conduct</h2>
                <p>You agree not to use our services to:</p>
                <ul>
                  <li>Violate any applicable law, regulation, or third-party rights.</li>
                  <li>Upload, post, or transmit any content that is unlawful, threatening, harassing, defamatory, or otherwise objectionable.</li>
                  <li>Attempt to gain unauthorized access to other accounts, systems, or networks.</li>
                  <li>Interfere with or disrupt the integrity or performance of our services.</li>
                  <li>Reverse-engineer, decompile, or disassemble any aspect of our services.</li>
                  <li>Use our content, templates, or workflows to compete directly with TIN.</li>
                  <li>Scrape, crawl, or use automated tools to access our services without permission.</li>
                </ul>
              </div>

              <div className="legal-page__section">
                <h2>11. Disclaimer of Warranties</h2>
                <p>
                  All products and services are provided <strong>&quot;AS IS&quot;</strong> and <strong>&quot;AS AVAILABLE&quot;</strong> without warranty of any kind, express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
                </p>
                <p>
                  TIN does not warrant that the services will be uninterrupted, error-free, secure, or free of viruses or other harmful components.
                </p>
              </div>

              <div className="legal-page__section">
                <h2>12. Limitation of Liability</h2>
                <p>
                  To the maximum extent permitted by applicable law:
                </p>
                <ul>
                  <li>The cumulative liability of TIN for all claims arising from or related to these Terms or the use of our services shall not exceed the total amount you paid to TIN in the twelve (12) months preceding the claim.</li>
                  <li>In no event shall TIN be liable for any indirect, incidental, special, consequential, punitive, or exemplary damages, including but not limited to loss of profits, data, goodwill, or business opportunities, regardless of the cause of action or theory of liability.</li>
                </ul>
              </div>

              <div className="legal-page__section">
                <h2>13. Indemnification</h2>
                <p>
                  You agree to indemnify, defend, and hold harmless The Innovative Native LLC, its officers, directors, employees, agents, and affiliates from and against any and all claims, liabilities, damages, losses, costs, and expenses (including reasonable attorneys&apos; fees) arising from or related to your use of our services, your violation of these Terms, or your violation of any rights of a third party.
                </p>
              </div>

              <div className="legal-page__section">
                <h2>14. Governing Law &amp; Dispute Resolution</h2>
                <ul>
                  <li><strong>Governing Law:</strong> These Terms shall be governed by and construed in accordance with the laws of the State of Nevada, without regard to its conflict of law provisions.</li>
                  <li><strong>Binding Arbitration:</strong> Any dispute arising from or relating to these Terms shall be resolved by binding arbitration administered by the American Arbitration Association (AAA) in accordance with its Commercial Arbitration Rules.</li>
                  <li><strong>No Class Actions:</strong> You agree that any dispute resolution proceedings will be conducted only on an individual basis and not in a class, consolidated, or representative action.</li>
                  <li><strong>Venue:</strong> Any legal proceedings not subject to arbitration shall be brought exclusively in the state or federal courts located in Clark County, Nevada.</li>
                </ul>
              </div>

              <div className="legal-page__section">
                <h2>15. Changes to These Terms</h2>
                <p>
                  TIN reserves the right to modify these Terms at any time. Changes will be posted on this page with an updated &quot;Effective Date.&quot; Your continued use of our services after any changes constitutes acceptance of the updated Terms.
                </p>
              </div>

              <div className="legal-page__section">
                <h2>16. Severability</h2>
                <p>
                  If any provision of these Terms is held to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect.
                </p>
              </div>

              <div className="legal-page__section">
                <h2>17. Force Majeure</h2>
                <p>TIN shall not be liable for any failure or delay in performance resulting from causes beyond its reasonable control, including but not limited to: acts of God, natural disasters, pandemic, war, terrorism, government actions, power failures, internet or telecommunications failures, cyberattacks, and third-party service provider outages.</p>
              </div>

              <div className="legal-page__section">
                <h2>18. Entire Agreement</h2>
                <p>
                  These Terms, together with our <Link href="/privacy-policy">Privacy Policy</Link>, <Link href="/disclaimer">Disclaimer</Link>, and <Link href="/refund-policy">Refund Policy</Link>, constitute the entire agreement between you and TIN regarding the use of our services and supersede all prior agreements and understandings.
                </p>
              </div>

              <div className="legal-page__section">
                <h2>19. Contact</h2>
                <p>
                  If you have questions about these Terms, please contact us:
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
                  By purchasing, accessing, or using our services, you confirm that you have read, understood, and agree to be bound by these Terms &amp; Conditions.
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
