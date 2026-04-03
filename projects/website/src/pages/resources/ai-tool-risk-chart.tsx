import React from 'react';
import Head from 'next/head';
import HeaderLanding from '@/components/layout/header/HeaderLanding';
import ScrollProgressBtn from '@/components/layout/ScrollProgressBtn';
import ResourceGate from '@/components/containers/resources/ResourceGate';

const BULLETS = [
  'Tool-by-tool privilege risk analysis: ChatGPT, Claude, Gemini, Harvey, Westlaw, Lexis+, Cerebro',
  'Three-tier classification: HIGH / MEDIUM / LOWER risk with reasoning',
  'Cost comparison table across all major legal AI platforms',
  'The 5-question Heppner Test to evaluate any AI tool',
  'Decision matrix: match your priorities to the right AI tier',
];

const AiToolRiskChart = () => {
  return (
    <>
      <Head>
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="shortcut icon" href="/images/favicon.png" type="image/x-icon" />
        <title>AI Tool Privilege Risk Comparison Chart | Free Download | The Innovative Native</title>
        <meta
          name="description"
          content="Compare every major legal AI tool against the Heppner privilege standard. Side-by-side analysis of ChatGPT, Harvey, Westlaw, Lexis+, and private RAG systems."
        />
        <meta property="og:title" content="AI Tool Privilege Risk Comparison Chart" />
        <meta
          property="og:description"
          content="Post-Heppner analysis: which AI tools preserve attorney-client privilege? Tool-by-tool comparison with cost analysis and decision framework."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://theinnovativenative.com/resources/ai-tool-risk-chart"
        />
      </Head>
      <div className="my-app landing-page">
        <HeaderLanding openCalendly={() => {}} />
        <main>
          <ResourceGate
            title="AI Tool Privilege Risk Comparison Chart"
            subtitle="Post-Heppner analysis: which AI tools preserve attorney-client privilege? Side-by-side comparison with cost breakdown and decision framework."
            bullets={BULLETS}
            leadMagnetId="ai-tool-risk-chart"
            downloadUrl="https://theinnovativenative.com/assets/lead-magnets/heppner-tool-comparison-chart.pptx"
          />
        </main>
        <ScrollProgressBtn />
      </div>
    </>
  );
};

export default AiToolRiskChart;
