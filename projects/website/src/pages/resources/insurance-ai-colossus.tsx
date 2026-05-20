import React from 'react';
import Head from 'next/head';
import HeaderLanding from '@/components/layout/header/HeaderLanding';
import ScrollProgressBtn from '@/components/layout/ScrollProgressBtn';
import ResourceGate from '@/components/containers/resources/ResourceGate';

const BULLETS = [
  'How Colossus AI systematically undervalues soft tissue and pain claims',
  'The 15-30% savings insurers extract, and where that money comes from',
  'Three counter-strategies PI firms are using to fight back',
  'Checklist: documentation practices that resist algorithmic devaluation',
];

const InsuranceAiColossus = () => {
  return (
    <>
      <Head>
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="shortcut icon" href="/images/favicon.png" type="image/x-icon" />
        <title>How Insurance AI Works Against You | The Innovative Native</title>
        <meta
          name="description"
          content="Allstate's Colossus AI saves insurers 15-30% on every claim. Learn exactly how it works and what PI firms can do about it."
        />
        <meta property="og:title" content="How Insurance AI Works Against You" />
        <meta
          property="og:description"
          content="Colossus AI saves insurers 15-30% on every claim. Here is exactly how it works and what you can do about it."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://theinnovativenative.com/resources/insurance-ai-colossus"
        />
      </Head>
      <div className="my-app landing-page">
        <HeaderLanding openCalendly={() => {}} />
        <main>
          <ResourceGate
            title="How Insurance AI Works Against You"
            subtitle="Allstate's Colossus AI saves insurers 15-30% on every claim. Here is exactly how it works and what you can do about it."
            bullets={BULLETS}
            leadMagnetId="insurance-ai-colossus"
            downloadUrl="https://theinnovativenative.com/assets/lead-magnets/insurance-ai-colossus-breakdown.pptx"
          />
        </main>
        <ScrollProgressBtn />
      </div>
    </>
  );
};

export default InsuranceAiColossus;
