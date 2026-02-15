import React from "react";
import Layout from "@/components/layout/Layout";
import HomeOneBanner from "@/components/layout/banner/HomeOneBanner";
import Agency from "@/components/containers/home/Agency";
import CaseStudies from "@/components/containers/home/CaseStudies";
import HomeOffer from "@/components/containers/home/HomeOffer";
import ServicesCarousel from "@/components/containers/home/ServicesCarousel";
import WorkflowShowcase from "@/components/containers/home/WorkflowShowcase";
import Testimonials from "@/components/containers/home/Testimonials";
import Link from "next/link";
import Head from "next/head";

// Workflow demo videos - add your YouTube video IDs and thumbnails here
// To get a YouTube thumbnail: https://img.youtube.com/vi/[VIDEO_ID]/maxresdefault.jpg
interface WorkflowVideo {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  videoId: string;
  tags: string[];
  duration?: string;
}

const workflowVideos: WorkflowVideo[] = [
  // Example structure - uncomment and customize when ready:
  // {
  //   id: 1,
  //   title: "Job Hunter Automation Walkthrough",
  //   description: "End-to-end n8n workflow that discovers jobs, scores them, and generates personalized applications.",
  //   thumbnail: "https://img.youtube.com/vi/YOUR_VIDEO_ID/maxresdefault.jpg",
  //   videoId: "YOUR_VIDEO_ID",
  //   tags: ["n8n", "Automation", "AI"],
  //   duration: "12:34",
  // },
];

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
        <title>AI Automation Consultant | n8n Expert | Michael Soto</title>
        <meta
          name="description"
          content="Build AI-powered workflows that automate your business. Custom n8n development, growth systems diagnosis, and fractional CMO services."
        />
      </Head>
      <Layout header={1} footer={1} video={false}>
        <HomeOneBanner />
        <Agency />
        <CaseStudies />
        <Testimonials />
        {workflowVideos.length > 0 && (
          <WorkflowShowcase videos={workflowVideos} />
        )}
        <HomeOffer />
        <ServicesCarousel />

        {/* About Section */}
        <section className="section">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-lg-8 text-center">
                <span className="sub-title">
                  ABOUT
                  <i className="fa-solid fa-arrow-right"></i>
                </span>
                <h2 className="title title-anim mt-3">
                  About Mike
                </h2>
                <div style={{ color: '#a0a0a0', textAlign: 'left', marginTop: '30px' }}>
                  <p>
                    I&apos;ve spent nearly two decades inside growth systems that look functional
                    on the surface and quietly fail underneath. My career has been defined by
                    pattern recognition—I&apos;m usually brought in when leadership senses something
                    is wrong but cannot articulate why.
                  </p>
                  <p className="mt-3">
                    I&apos;m not interested in cosmetic improvement. I&apos;m interested in whether
                    a system can thrive at scale.
                  </p>
                  <p className="mt-3">
                    I enter systems assuming three things:
                  </p>
                  <ul className="mt-2" style={{ paddingLeft: '1.5rem' }}>
                    <li>Some parts are working for reasons no one fully understands</li>
                    <li>Some parts are being protected because they feel validating, not because they perform</li>
                    <li>Most reporting tells a comforting story instead of a true one</li>
                  </ul>
                  <p className="mt-3">
                    My job is to identify which is which.
                  </p>
                </div>
                <Link href="/professionalExperience" className="btn btn--secondary mt-4">
                  Learn More
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
                  Ready to Find Out What&apos;s Actually Driving Your Results?
                </h2>
                <p style={{ color: '#a0a0a0', marginTop: '20px' }}>
                  Book a diagnostic call to discuss where your system might be lying
                  and what structural corrections could help.
                </p>
                <button onClick={openCalendly} className="btn btn--secondary mt-4">
                  Book Discovery Call
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
