import React from 'react';
import Head from 'next/head';
import HeaderLanding from '@/components/layout/header/HeaderLanding';
import ScrollProgressBtn from '@/components/layout/ScrollProgressBtn';
import ResourceGate from '@/components/containers/resources/ResourceGate';

const BULLETS = [
  'Ready-to-adopt AI usage policy you can implement this week',
  'Heppner compliance checklist (US v. Heppner, SDNY Feb 2026)',
  'HIPAA and medical records handling protocols for AI tools',
  'Staff training requirements and accountability framework',
  'Appendix: approved vs. prohibited AI use cases for PI firms',
];

const AiGovernanceTemplatePi = () => {
  return (
    <>
      <Head>
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="shortcut icon" href="/images/favicon.png" type="image/x-icon" />
        <title>AI Governance Policy Template for PI Firms | The Innovative Native</title>
        <meta
          name="description"
          content="Download a complete, ready-to-adopt AI usage policy for personal injury firms. Covers Heppner compliance, HIPAA, medical records, and staff training."
        />
        <meta property="og:title" content="AI Governance Policy Template for PI Firms" />
        <meta
          property="og:description"
          content="A complete AI usage policy covering Heppner compliance, HIPAA, medical records, and staff training for personal injury firms."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://theinnovativenative.com/resources/ai-governance-template-pi"
        />
      </Head>
      <div className="my-app landing-page">
        <HeaderLanding openCalendly={() => {}} />
        <main>
          <ResourceGate
            title="AI Governance Policy Template for PI Firms"
            subtitle="A complete, ready-to-adopt AI usage policy. Covers Heppner compliance, HIPAA, medical records, and staff training."
            bullets={BULLETS}
            leadMagnetId="ai-governance-template-pi"
            downloadUrl="https://theinnovativenative.com/assets/lead-magnets/ai-governance-template-pi.pptx"
          />
        </main>
        <ScrollProgressBtn />
      </div>
    </>
  );
};

export default AiGovernanceTemplatePi;
