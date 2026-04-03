import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';

export default function PrivacyPolicyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy | The Innovative Native LLC</title>
        <meta name="description" content="Privacy Policy for The Innovative Native LLC. Learn how we collect, use, and protect your personal information." />
      </Head>
      <Layout header={1} footer={1} video={false}>
        <section className="section legal-page">
          <div className="container">
            <div className="legal-page__content">
              <nav className="legal-page__breadcrumb">
                <Link href="/">Home</Link>
                <span>/</span>
                <span>Privacy Policy</span>
              </nav>

              <h1 className="legal-page__title">Privacy Policy</h1>
              <p className="legal-page__updated">Effective Date: July 07, 2025</p>

              <div className="legal-page__intro">
                <p>
                  This Privacy Policy describes how The Innovative Native LLC (&quot;TIN,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) collects, uses, discloses, and protects your personal information when you access or use our products, services, and website.
                </p>
              </div>

              <div className="legal-page__section">
                <h2>1. Information Collection</h2>
                <p>
                  We gather the following categories of information:
                </p>
                <ul>
                  <li><strong>Account Data:</strong> Name, email address, and other information you provide when creating an account or purchasing our products.</li>
                  <li><strong>Transactional Information:</strong> Payment details, purchase history, and billing information related to your transactions with us.</li>
                  <li><strong>User-Generated Content:</strong> Any content you submit, upload, or share through our services.</li>
                  <li><strong>Device &amp; Usage Data:</strong> Information collected automatically, including IP address, browser type, operating system, referring URLs, pages visited, and interaction data.</li>
                </ul>
                <p>
                  <strong>Automatic Collection Methods:</strong> We use cookies, web beacons, and similar tracking technologies to collect usage data and enhance your experience.
                </p>
                <p>
                  <strong>Third-Party Data Sources:</strong> We may receive information about you from service providers and social media platforms in connection with our services.
                </p>
              </div>

              <div className="legal-page__section">
                <h2>2. Usage Purposes</h2>
                <p>
                  We use the information we collect for the following purposes:
                </p>
                <ul>
                  <li><strong>Service Provision:</strong> To deliver, maintain, and improve our products and services.</li>
                  <li><strong>Transaction Processing:</strong> To process payments, fulfill orders, and manage your account.</li>
                  <li><strong>Personalization:</strong> To tailor content, recommendations, and experiences to your preferences.</li>
                  <li><strong>Communications:</strong> To send you service-related notices, updates, promotional materials, and respond to your inquiries.</li>
                  <li><strong>Service Improvement:</strong> To analyze usage patterns and improve our offerings.</li>
                  <li><strong>Fraud Prevention:</strong> To detect, prevent, and address fraud, security issues, and technical problems.</li>
                  <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes.</li>
                  <li><strong>Corporate Transactions:</strong> In connection with mergers, acquisitions, or asset sales.</li>
                </ul>
              </div>

              <div className="legal-page__section">
                <h2>2a. Legal Basis for Processing (EU/EEA/UK)</h2>
                <p>Where applicable under the General Data Protection Regulation (GDPR) and UK GDPR, we process your personal data on the following legal bases:</p>
                <ul>
                  <li><strong>Contract Performance:</strong> Processing necessary to fulfill our contractual obligations to you (e.g., delivering purchased products, managing your account).</li>
                  <li><strong>Legitimate Interests:</strong> Processing necessary for our legitimate business interests, such as improving our services, fraud prevention, and marketing, where such interests are not overridden by your data protection rights.</li>
                  <li><strong>Consent:</strong> Where you have given explicit consent for specific processing activities (e.g., marketing communications). You may withdraw consent at any time by contacting us.</li>
                  <li><strong>Legal Obligation:</strong> Processing necessary to comply with applicable laws and regulations.</li>
                </ul>
              </div>

              <div className="legal-page__section">
                <h2>3. Data Sharing</h2>
                <p>
                  We may disclose your information in the following circumstances:
                </p>
                <ul>
                  <li><strong>Corporate Affiliates:</strong> With entities under common ownership or control for business operations.</li>
                  <li><strong>Service Providers:</strong> With third-party vendors who assist us in operating our business, subject to contractual restrictions on data use.</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, reorganization, or sale of assets.</li>
                  <li><strong>Legal &amp; Regulatory Requirements:</strong> When required by law, regulation, legal process, or governmental request.</li>
                  <li><strong>Rights Protection:</strong> To protect the rights, property, or safety of TIN, our users, or others.</li>
                  <li><strong>With Your Consent:</strong> When you have given us explicit permission to share your information.</li>
                </ul>
              </div>

              <div className="legal-page__section">
                <h2>3a. International Data Transfers</h2>
                <p>Your personal information may be transferred to and processed in countries other than your country of residence, including the United States, where our servers and service providers are located. These countries may have data protection laws that differ from the laws of your jurisdiction.</p>
                <p>Where we transfer personal data outside the EU/EEA/UK, we implement appropriate safeguards including Standard Contractual Clauses (SCCs) approved by the European Commission, and we ensure that an adequate level of protection is afforded to your data.</p>
              </div>

              <div className="legal-page__section">
                <h2>4. User Rights by Location</h2>

                <h3>EU/EEA/UK Residents</h3>
                <p>Under applicable data protection laws, you have the right to:</p>
                <ul>
                  <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate or incomplete personal data.</li>
                  <li><strong>Erasure:</strong> Request deletion of your personal data under certain circumstances.</li>
                  <li><strong>Restriction:</strong> Request restriction of processing of your personal data.</li>
                  <li><strong>Portability:</strong> Request transfer of your personal data to another service provider.</li>
                  <li><strong>Objection:</strong> Object to processing of your personal data for certain purposes.</li>
                  <li><strong>Complaint:</strong> Lodge a complaint with your local data protection supervisory authority if you believe your rights have been violated.</li>
                </ul>

                <h3>California Residents</h3>
                <p>Under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA), you have the right to:</p>
                <ul>
                  <li><strong>Know:</strong> Request information about what personal data we collect, use, and disclose.</li>
                  <li><strong>Delete:</strong> Request deletion of your personal data.</li>
                  <li><strong>Correct:</strong> Request correction of inaccurate personal data.</li>
                  <li><strong>Opt-Out:</strong> Opt out of the sale or sharing of your personal data.</li>
                </ul>
                <p>To exercise your rights, including opting out of the sale or sharing of your personal data, contact us at <a href="mailto:info@theinnovativenative.com">info@theinnovativenative.com</a> with the subject line &quot;Privacy Rights Request.&quot;</p>

                <h3>Other US States (Colorado, Connecticut, Florida, Montana, Oregon, Texas, Utah, Virginia)</h3>
                <p>Residents of these states may have the following rights:</p>
                <ul>
                  <li>Confirmation of whether we are processing your personal data.</li>
                  <li>Access to your personal data.</li>
                  <li>Data portability in a readily usable format.</li>
                  <li>Correction of inaccurate personal data.</li>
                  <li>Deletion of your personal data.</li>
                </ul>
              </div>

              <div className="legal-page__section">
                <h2>5. Data Protection</h2>
                <p>
                  We implement administrative, technical, and physical safeguards to protect your personal information. These measures include:
                </p>
                <ul>
                  <li>Encryption of data in transit and at rest.</li>
                  <li>Access controls to limit who can view or modify your data.</li>
                  <li>Regular security assessments and audits.</li>
                </ul>
                <p>
                  While we take reasonable steps to protect your information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security of your data.
                </p>
              </div>

              <div className="legal-page__section">
                <h2>6. Cookies &amp; Tracking Technologies</h2>
                <p>
                  We use cookies and similar tracking technologies to collect information about your browsing activities. You can control cookie preferences through your browser settings. Disabling cookies may limit certain features of our services.
                </p>
              </div>

              <div className="legal-page__section">
                <h2>7. Data Retention</h2>
                <p>We retain your personal information for the following periods:</p>
                <ul>
                  <li><strong>Account Data:</strong> For the duration of your account plus 30 days after deletion request, to allow for account recovery.</li>
                  <li><strong>Transactional Records:</strong> For seven (7) years after the transaction date, as required for tax and financial compliance.</li>
                  <li><strong>Usage &amp; Analytics Data:</strong> For up to twenty-four (24) months from the date of collection.</li>
                  <li><strong>Marketing Communications:</strong> Until you opt out, after which we retain only the minimum data needed to honor your opt-out preference.</li>
                  <li><strong>Legal Hold Data:</strong> As required by applicable law, regulation, or legal proceedings.</li>
                </ul>
                <p>When personal data is no longer needed for the purposes outlined above, we securely delete or anonymize it.</p>
              </div>

              <div className="legal-page__section">
                <h2>8. Children&apos;s Privacy</h2>
                <p>
                  Our services are not directed to children under the age of 13 (or 16 in certain jurisdictions). We do not knowingly collect personal information from children. If we become aware that we have collected information from a child, we will take steps to delete it promptly.
                </p>
              </div>

              <div className="legal-page__section">
                <h2>9. Third-Party Links</h2>
                <p>
                  Our services may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any personal information.
                </p>
              </div>

              <div className="legal-page__section">
                <h2>10. Policy Updates</h2>
                <p>
                  We may update this Privacy Policy from time to time. When we make material changes, we will notify you by posting the updated policy on our website and updating the &quot;Effective Date&quot; at the top of this page. We may also provide additional notification via email or through our services.
                </p>
              </div>

              <div className="legal-page__section">
                <h2>11. Contact</h2>
                <p>
                  If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:
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

          .legal-page__section h3 {
            font-size: 20px;
            font-weight: 600;
            color: var(--white);
            margin-top: 24px;
            margin-bottom: 12px;
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

            .legal-page__section h3 {
              font-size: 18px;
            }
          }
        `}</style>
      </Layout>
    </>
  );
}
