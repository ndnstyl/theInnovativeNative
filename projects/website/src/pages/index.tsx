import React from "react";
import Layout from "@/components/layout/Layout";
import HomeOneBanner from "@/components/layout/banner/HomeOneBanner";
import ChatGptGap from "@/components/containers/home/ChatGptGap";
import ProofSystems from "@/components/containers/home/ProofSystems";
import CaseStudies from "@/components/containers/home/CaseStudies";
import Testimonials from "@/components/containers/home/Testimonials";
import HomeOffer from "@/components/containers/home/HomeOffer";
import ValueLadder from "@/components/containers/home/ValueLadder";
import Link from "next/link";
import Head from "next/head";
import BreadcrumbSchema from "@/components/common/BreadcrumbSchema";

const Home = () => {
  const openCalendly = () => {
    if (typeof window !== 'undefined' && (window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({
        url: 'https://calendly.com/mike-buildmytribe/ai-discovery-call'
      });
    }
  };

  return (
    <>
      <Head>
        <title>AI Systems for Business | The Innovative Native</title>
        <meta
          name="description"
          content="We build AI infrastructure that replaces your fragmented SaaS stack — automated workflows, data pipelines, and AI agents for legal, creative, and real estate."
        />
        <link rel="canonical" href="https://theinnovativenative.com/" />

        {/* Open Graph */}
        <meta property="og:title" content="AI Systems for Business | The Innovative Native" />
        <meta property="og:description" content="AI infrastructure that replaces your fragmented SaaS stack. Automated workflows, data pipelines, and AI agents — 10-20 hours returned weekly." />
        <meta property="og:image" content="https://theinnovativenative.com/images/og-default.jpg" />
        <meta property="og:url" content="https://theinnovativenative.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="The Innovative Native" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Systems for Business | The Innovative Native" />
        <meta name="twitter:description" content="AI infrastructure that replaces your fragmented SaaS stack. 10-20 hours returned weekly." />
        <meta name="twitter:image" content="https://theinnovativenative.com/images/og-default.jpg" />
      </Head>
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://theinnovativenative.com/" },
      ]} />
      <Layout header={1} footer={1} video={false}>
        <HomeOneBanner />
        <ChatGptGap />
        <ProofSystems />
        <CaseStudies />
        <Testimonials />
        <HomeOffer />
        <ValueLadder />

        {/* About Section */}
        <section className="section">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-lg-8 text-center">
                <span className="sub-title">
                  THE BUILDER
                  <i className="fa-solid fa-arrow-right"></i>
                </span>
                <h2 className="title title-anim mt-3">
                  Who Builds This
                </h2>
                <div style={{ color: '#a0a0a0', textAlign: 'left', marginTop: '30px' }}>
                  <p>
                    Nearly two decades of building systems that create leverage. I watched
                    companies drown in disconnected software, manual workflows, and tools
                    that promised efficiency but delivered complexity.
                  </p>
                  <p className="mt-3">
                    When AI matured, I stopped adding tools to the stack and started
                    replacing the stack. AI became the operational layer — automating
                    repetitive work so operators focus on decisions that actually matter.
                  </p>
                  <p className="mt-3">
                    That&apos;s what The Innovative Native builds. AI infrastructure that
                    replaces fragmented SaaS stacks, automates high-value workflows,
                    and gives you back 10-20 hours a week. Every system is documented,
                    maintainable, and designed to run without me.
                  </p>
                </div>
                <Link href="/professionalExperience" className="btn btn--secondary mt-4">
                  See the Full Background
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-lg-8">
                <span className="sub-title text-center d-block">
                  COMMON QUESTIONS
                  <i className="fa-solid fa-arrow-right"></i>
                </span>
                <h2 className="title title-anim text-center mt-3">
                  Frequently Asked Questions
                </h2>
                <div style={{ marginTop: '40px' }}>
                  {[
                    {
                      q: "What is the difference between using ChatGPT and building AI infrastructure?",
                      a: "ChatGPT is a single tool. AI infrastructure is an integrated system — automated workflows, data pipelines, and AI agents that work together to replace manual processes. ChatGPT answers questions. Infrastructure runs operations."
                    },
                    {
                      q: "How long does it take to build an AI system?",
                      a: "Pilot programs take 2-3 weeks. Full custom builds take 4-8 weeks depending on complexity. Self-deploy blueprints can be implemented in a weekend. Every engagement starts with a discovery call to scope the work."
                    },
                    {
                      q: "What verticals do you serve?",
                      a: "Legal professionals, creative agencies, real estate operations, and small business operators. Each vertical has specific proof systems with documented outcomes."
                    },
                    {
                      q: "How much does it cost?",
                      a: "Self-deploy blueprints start at $57. Pilot programs are $2,500. Full custom builds are project-based and scoped during discovery. There is no monthly retainer — you own the system."
                    },
                    {
                      q: "Do I need technical skills to use the systems you build?",
                      a: "No. Every system is documented, maintainable, and designed to run without the builder. If your team can use a spreadsheet, they can operate the system."
                    },
                  ].map((faq, i) => (
                    <div key={i} style={{
                      borderBottom: '1px solid rgba(255,255,255,0.1)',
                      paddingBottom: '24px',
                      marginBottom: '24px',
                    }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>
                        {faq.q}
                      </h3>
                      <p style={{ color: '#a0a0a0', lineHeight: 1.7 }}>
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Schema */}
        <Head>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is the difference between using ChatGPT and building AI infrastructure?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "ChatGPT is a single tool. AI infrastructure is an integrated system — automated workflows, data pipelines, and AI agents that work together to replace manual processes. ChatGPT answers questions. Infrastructure runs operations."
                }
              },
              {
                "@type": "Question",
                "name": "How long does it take to build an AI system?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Pilot programs take 2-3 weeks. Full custom builds take 4-8 weeks depending on complexity. Self-deploy blueprints can be implemented in a weekend."
                }
              },
              {
                "@type": "Question",
                "name": "What verticals do you serve?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Legal professionals, creative agencies, real estate operations, and small business operators. Each vertical has specific proof systems with documented outcomes."
                }
              },
              {
                "@type": "Question",
                "name": "How much does it cost?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Self-deploy blueprints start at $57. Pilot programs are $2,500. Full custom builds are project-based and scoped during discovery. There is no monthly retainer — you own the system."
                }
              },
              {
                "@type": "Question",
                "name": "Do I need technical skills to use the systems you build?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No. Every system is documented, maintainable, and designed to run without the builder. If your team can use a spreadsheet, they can operate the system."
                }
              }
            ]
          })}} />
        </Head>

        {/* CTA Section */}
        <section className="section light">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-lg-8 text-center">
                <h2 className="title title-anim">
                  Let&apos;s Build Your AI System
                </h2>
                <p style={{ color: '#a0a0a0', marginTop: '20px' }}>
                  Whether you need a self-deploy blueprint, a pilot program, or a full
                  custom build — the first step is the same. Let&apos;s talk about what
                  you&apos;re trying to automate.
                </p>
                <button onClick={openCalendly} className="btn btn--primary mt-4">
                  Book a Discovery Call
                </button>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Home;
