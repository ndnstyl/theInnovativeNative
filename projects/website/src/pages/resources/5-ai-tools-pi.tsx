import React from 'react';
import Head from 'next/head';
import HeaderLanding from '@/components/layout/header/HeaderLanding';
import ScrollProgressBtn from '@/components/layout/ScrollProgressBtn';
import ResourceGate from '@/components/containers/resources/ResourceGate';

const BULLETS = [
  'AI-powered intake: answer every call in under 3 rings, 24/7',
  'Document assembly: cut demand letter drafting time by 60%',
  'Medical record summarization: hours of review reduced to minutes',
  'Case valuation: data-backed settlement range estimates',
  'Client communication: automated updates that reduce "where is my case" calls by 40%',
];

const FiveAiToolsPi = () => {
  return (
    <>
      <Head>
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="shortcut icon" href="/images/favicon.png" type="image/x-icon" />
        <title>5 AI Tools PI Firms Can Use Today Without Risk | The Innovative Native</title>
        <meta
          name="description"
          content="Practical AI tools with pricing, implementation timelines, and risk levels for personal injury firms. No hype. Just what works."
        />
        <meta property="og:title" content="5 AI Tools PI Firms Can Use Today Without Risk" />
        <meta
          property="og:description"
          content="Practical tools with pricing, implementation timelines, and risk levels. No hype. Just what works."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://theinnovativenative.com/resources/5-ai-tools-pi"
        />
      </Head>
      <div className="my-app landing-page">
        <HeaderLanding openCalendly={() => {}} />
        <main>
          <ResourceGate
            title="5 AI Tools PI Firms Can Use Today Without Risk"
            subtitle="Practical tools with pricing, implementation timelines, and risk levels. No hype. Just what works."
            bullets={BULLETS}
            leadMagnetId="5-ai-tools-pi"
            downloadUrl="https://theinnovativenative.com/assets/lead-magnets/5-ai-tools-pi-firms.pptx"
          />
        </main>
        <ScrollProgressBtn />
      </div>
    </>
  );
};

export default FiveAiToolsPi;
