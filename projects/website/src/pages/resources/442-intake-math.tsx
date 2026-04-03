import React from 'react';
import Head from 'next/head';
import HeaderLanding from '@/components/layout/header/HeaderLanding';
import ScrollProgressBtn from '@/components/layout/ScrollProgressBtn';
import ResourceGate from '@/components/containers/resources/ResourceGate';

const BULLETS = [
  'The real cost of every missed call: $442 per lead, gone in 90 seconds',
  '60% of PI calls go unanswered. Most firms have no idea.',
  'Only 7% of web leads convert without follow-up within 5 minutes',
  'Editable ROI calculator: plug in your own numbers and see the gap',
];

const IntakeMath = () => {
  return (
    <>
      <Head>
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="shortcut icon" href="/images/favicon.png" type="image/x-icon" />
        <title>The $442 Math: Where Your PI Leads Actually Go | The Innovative Native</title>
        <meta
          name="description"
          content="See exactly how much your broken intake is costing. Includes an ROI calculator you can fill in with your own numbers."
        />
        <meta property="og:title" content="The $442 Math: Where Your PI Leads Actually Go" />
        <meta
          property="og:description"
          content="60% of PI calls go unanswered. See the real cost of broken intake and calculate your own ROI gap."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://theinnovativenative.com/resources/442-intake-math"
        />
      </Head>
      <div className="my-app landing-page">
        <HeaderLanding openCalendly={() => {}} />
        <main>
          <ResourceGate
            title="The $442 Math: Where Your PI Leads Actually Go"
            subtitle="See exactly how much your broken intake is costing. Includes an ROI calculator you can fill in with your own numbers."
            bullets={BULLETS}
            leadMagnetId="442-intake-math"
            downloadUrl="https://theinnovativenative.com/assets/lead-magnets/442-intake-math-pi.pptx"
          />
        </main>
        <ScrollProgressBtn />
      </div>
    </>
  );
};

export default IntakeMath;
