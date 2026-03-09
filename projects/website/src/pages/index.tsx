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
          content="We build AI infrastructure that replaces your fragmented SaaS stack. Automated workflows, integrated data pipelines, and AI agents for legal, creative, real estate, and small business operators."
        />
      </Head>
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
                <button onClick={openCalendly} className="btn btn--secondary mt-4">
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
