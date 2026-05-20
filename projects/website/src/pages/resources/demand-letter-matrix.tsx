import React from 'react';
import Head from 'next/head';
import HeaderLanding from '@/components/layout/header/HeaderLanding';
import ScrollProgressBtn from '@/components/layout/ScrollProgressBtn';
import ResourceGate from '@/components/containers/resources/ResourceGate';

const BULLETS = [
  '4-tool matrix: EvenUp, Tavrn, Filevine DemandsAI, Supio — scored on cost, speed, integrations, privilege risk',
  'ROI calculator worksheet: plug in your case volume, see year-one savings',
  'The 5 red flags to watch for in every demand letter AI demo',
  'Decision tree: which tool fits your firm size (10 / 25 / 50+ attorneys)',
  'Monday morning action list: three things you can do before lunch',
];

const DemandLetterMatrix = () => {
  return (
    <>
      <Head>
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="shortcut icon" href="/images/favicon.png" type="image/x-icon" />
        <title>AI Demand Letter Tool Comparison Matrix + ROI Calculator | The Innovative Native</title>
        <meta
          name="description"
          content="Side-by-side scoring of 4 AI demand letter tools across cost, speed, integrations, and privilege risk. Includes a plug-in ROI calculator for your firm's case volume."
        />
        <meta property="og:title" content="AI Demand Letter Tool Comparison Matrix + ROI Calculator" />
        <meta
          property="og:description"
          content="4 tools scored head to head. ROI math for your firm. Red flags to watch for. Decision tree by firm size."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://theinnovativenative.com/resources/demand-letter-matrix"
        />
        <link
          rel="canonical"
          href="https://theinnovativenative.com/resources/demand-letter-matrix"
        />
      </Head>
      <div className="my-app landing-page">
        <HeaderLanding openCalendly={() => {}} />
        <main>
          <ResourceGate
            title="AI Demand Letter Tool Comparison Matrix + ROI Calculator"
            subtitle="Side-by-side scoring of 4 tools across cost, speed, integrations, and privilege risk. Plus a plug-in ROI calculator for your firm's case volume."
            bullets={BULLETS}
            leadMagnetId="demand-letter-matrix"
            downloadUrl="https://theinnovativenative.com/assets/lead-magnets/demand-letter-matrix.pptx"
          />
        </main>
        <ScrollProgressBtn />
      </div>
    </>
  );
};

export default DemandLetterMatrix;
