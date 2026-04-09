import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import HeaderLanding from '@/components/layout/header/HeaderLanding';
import ScrollProgressBtn from '@/components/layout/ScrollProgressBtn';

interface Resource {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  vanitySlug: string;
}

// All 13 resources. Existing 6 + 7 new magnets (6 rolled out during Tier 2/3).
// Tier 1 MVP ships the 6 existing + demand-letter-matrix = 7 active.
const RESOURCES: Resource[] = [
  {
    slug: '442-intake-math',
    title: 'The $442 Math: Where Your PI Leads Actually Go',
    subtitle:
      "See exactly how much your broken intake is costing. Includes an ROI calculator you can fill in with your own numbers.",
    category: 'Intake & Operations',
    vanitySlug: 'math',
  },
  {
    slug: 'demand-letter-matrix',
    title: 'AI Demand Letter Tool Comparison Matrix + ROI Calculator',
    subtitle:
      'Side-by-side scoring of 4 tools. ROI math for your firm. Red flags in every demo. Decision tree by firm size.',
    category: 'AI Tools',
    vanitySlug: 'demand',
  },
  {
    slug: '5-ai-tools-pi',
    title: '5 AI Tools PI Firms Can Use Today Without Risk',
    subtitle:
      'Practical tools with pricing, implementation timelines, and risk levels. No hype. Just what works.',
    category: 'AI Tools',
    vanitySlug: 'tools',
  },
  {
    slug: 'ai-governance-template-pi',
    title: 'AI Governance Policy Template for PI Firms',
    subtitle:
      'Five-section policy based on Heppner, ABA 512, HIPAA, and Texas 705. Implement in one week.',
    category: 'Governance & Compliance',
    vanitySlug: 'policy',
  },
  {
    slug: 'heppner-one-pager',
    title: 'US v. Heppner Executive One-Pager',
    subtitle:
      'The Feb 2026 SDNY ruling explained for PI firm owners. What it means, what changes, what to do first.',
    category: 'Governance & Compliance',
    vanitySlug: 'heppner',
  },
  {
    slug: 'ai-tool-risk-chart',
    title: 'AI Tool Privilege Risk Chart',
    subtitle:
      'Side-by-side risk scoring for the AI tools your team might already be using. Red, yellow, green classification.',
    category: 'Governance & Compliance',
    vanitySlug: 'risk',
  },
  {
    slug: 'insurance-ai-colossus',
    title: 'Colossus and Insurance AI: What PI Firms Need to Know',
    subtitle:
      'How insurance AI tools evaluate your cases and what you can do about it at the settlement negotiation stage.',
    category: 'Strategy',
    vanitySlug: 'colossus',
  },
];

const ResourcesHub = () => {
  return (
    <>
      <Head>
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="shortcut icon" href="/images/favicon.png" type="image/x-icon" />
        <title>Resources for PI Firm Owners | The Innovative Native</title>
        <meta
          name="description"
          content="Free deliverables for Personal Injury firm owners. Tool matrices, ROI calculators, governance templates, and self-audit frameworks. Built by an AI systems operator who works with law firms."
        />
        <meta property="og:title" content="Resources for PI Firm Owners" />
        <meta
          property="og:description"
          content="Free tool matrices, ROI calculators, governance templates, and self-audit frameworks for PI firm owners."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://theinnovativenative.com/resources"
        />
        <link rel="canonical" href="https://theinnovativenative.com/resources" />
      </Head>
      <div className="my-app landing-page">
        <HeaderLanding openCalendly={() => {}} />
        <main>
          <section
            style={{
              backgroundColor: '#0a0f1a',
              color: '#e8e8e8',
              padding: '80px 20px 40px',
              minHeight: '100vh',
            }}
          >
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-10">
                  {/* Hero */}
                  <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <h1
                      style={{
                        fontSize: 'clamp(32px, 5vw, 48px)',
                        fontWeight: 700,
                        color: '#e8e8e8',
                        marginBottom: '16px',
                        lineHeight: 1.15,
                      }}
                    >
                      Resources for PI Firm Owners
                    </h1>
                    <p
                      style={{
                        fontSize: 'clamp(16px, 2vw, 18px)',
                        color: '#8899aa',
                        maxWidth: '640px',
                        margin: '0 auto',
                        lineHeight: 1.6,
                      }}
                    >
                      Free tool matrices, ROI calculators, governance templates, and
                      self-audit frameworks. Built by an AI systems operator who
                      works with Personal Injury law firms. No fluff. No upsell.
                    </p>
                  </div>

                  {/* Newsletter CTA banner */}
                  <div
                    style={{
                      backgroundColor: '#131b2e',
                      border: '1px solid #2a3a50',
                      borderLeft: '4px solid #d4a853',
                      borderRadius: '8px',
                      padding: '20px 24px',
                      marginBottom: '48px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '16px',
                    }}
                  >
                    <div style={{ flex: '1 1 300px' }}>
                      <strong
                        style={{
                          color: '#e8e8e8',
                          fontSize: '16px',
                          display: 'block',
                          marginBottom: '4px',
                        }}
                      >
                        Legal AI Briefing
                      </strong>
                      <span style={{ color: '#8899aa', fontSize: '14px' }}>
                        Weekly email for PI firm owners. 5 things you should know.
                        Real data. Two-minute read.
                      </span>
                    </div>
                    <Link
                      href="/newsletter"
                      style={{
                        backgroundColor: '#d4a853',
                        color: '#0a0f1a',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '15px',
                        textDecoration: 'none',
                        minHeight: '44px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Subscribe free
                    </Link>
                  </div>

                  {/* Resource grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fill, minmax(320px, 1fr))',
                      gap: '20px',
                    }}
                  >
                    {RESOURCES.map((r) => (
                      <Link
                        key={r.slug}
                        href={`/resources/${r.slug}`}
                        style={{
                          textDecoration: 'none',
                          color: 'inherit',
                          display: 'block',
                        }}
                      >
                        <article
                          style={{
                            backgroundColor: '#131b2e',
                            border: '1px solid #2a3a50',
                            borderRadius: '10px',
                            padding: '24px',
                            height: '100%',
                            transition: 'border-color 0.2s, transform 0.15s',
                            cursor: 'pointer',
                          }}
                          className="resource-card"
                        >
                          <span
                            style={{
                              display: 'inline-block',
                              fontSize: '11px',
                              textTransform: 'uppercase',
                              letterSpacing: '1.5px',
                              color: '#d4a853',
                              fontWeight: 700,
                              marginBottom: '12px',
                            }}
                          >
                            {r.category}
                          </span>
                          <h2
                            style={{
                              fontSize: '20px',
                              color: '#e8e8e8',
                              marginBottom: '10px',
                              lineHeight: 1.3,
                              fontWeight: 700,
                            }}
                          >
                            {r.title}
                          </h2>
                          <p
                            style={{
                              fontSize: '14px',
                              color: '#8899aa',
                              lineHeight: 1.55,
                              marginBottom: '16px',
                            }}
                          >
                            {r.subtitle}
                          </p>
                          <span
                            style={{
                              fontSize: '14px',
                              color: '#d4a853',
                              fontWeight: 600,
                            }}
                          >
                            Download free
                            <i
                              className="fa-solid fa-arrow-right"
                              style={{ marginLeft: '6px', fontSize: '12px' }}
                              aria-hidden="true"
                            />
                          </span>
                        </article>
                      </Link>
                    ))}
                  </div>

                  {/* Footer note */}
                  <p
                    style={{
                      color: '#8899aa',
                      fontSize: '13px',
                      textAlign: 'center',
                      marginTop: '48px',
                      lineHeight: 1.5,
                    }}
                  >
                    More resources ship during Week 3 and Week 4 of the April 2026
                    content schedule. Subscribe to the Legal AI Briefing to get
                    notified when new deliverables go live.
                  </p>
                </div>
              </div>
            </div>
          </section>
          <style>{`
            .resource-card:hover {
              border-color: #d4a853 !important;
              transform: translateY(-2px);
            }
          `}</style>
        </main>
        <ScrollProgressBtn />
      </div>
    </>
  );
};

export default ResourcesHub;
