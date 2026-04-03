import React from 'react';
import Head from 'next/head';
import HeaderLanding from '@/components/layout/header/HeaderLanding';
import ScrollProgressBtn from '@/components/layout/ScrollProgressBtn';
import ResourceGate from '@/components/containers/resources/ResourceGate';

const BULLETS = [
  'Executive briefing on US v. Heppner (SDNY, Feb 2026) in one page',
  'Three-tier AI privilege risk framework (HIGH / MEDIUM / LOWER)',
  'Six critical statistics every managing partner needs to see',
  'Monday morning action plan: what to do this week',
  'Compliance quick reference: ABA Opinion 512, state requirements',
];

const HeppnerOnePager = () => {
  return (
    <>
      <Head>
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="shortcut icon" href="/images/favicon.png" type="image/x-icon" />
        <title>US v. Heppner Executive Briefing | Free Download | The Innovative Native</title>
        <meta
          name="description"
          content="One-page executive briefing on the Heppner ruling. Forward to your managing partner and ethics committee. Three-tier AI privilege risk framework included."
        />
        <meta property="og:title" content="US v. Heppner: What Every Managing Partner Needs to Know" />
        <meta
          property="og:description"
          content="One-page executive briefing on the Heppner privilege ruling. Three-tier AI risk framework, compliance requirements, and Monday morning action plan."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://theinnovativenative.com/resources/heppner-one-pager"
        />
      </Head>
      <div className="my-app landing-page">
        <HeaderLanding openCalendly={() => {}} />
        <main>
          <ResourceGate
            title="US v. Heppner: What Every Managing Partner Needs to Know"
            subtitle="A one-page executive briefing on the ruling that changed AI privilege rules. Forward this to your partners and ethics committee."
            bullets={BULLETS}
            leadMagnetId="heppner-one-pager"
            downloadUrl="https://theinnovativenative.com/assets/lead-magnets/heppner-executive-one-pager.pptx"
          />
        </main>
        <ScrollProgressBtn />
      </div>
    </>
  );
};

export default HeppnerOnePager;
