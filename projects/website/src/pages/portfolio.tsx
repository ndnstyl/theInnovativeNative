import React from "react";
import Layout from "@/components/layout/Layout";
import CmnBanner from "@/components/layout/banner/CmnBanner";
import PortfolioMain from "@/components/containers/PortfolioMain";
import Head from "next/head";

const OurPortfolio = () => {
  return (
    <>
      <Head>
        <title>Portfolio | AI Automation & Growth Marketing Projects</title>
        <meta
          name="description"
          content="Case studies and examples of AI automation workflows, growth marketing systems, and technical implementations by Michael Soto."
        />
        <link rel="canonical" href="https://theinnovativenative.com/portfolio" />

        {/* Open Graph */}
        <meta property="og:title" content="Portfolio | AI Automation Projects" />
        <meta property="og:description" content="Case studies of AI automation workflows, growth marketing systems, and technical implementations." />
        <meta property="og:image" content="https://theinnovativenative.com/images/og-default.jpg" />
        <meta property="og:url" content="https://theinnovativenative.com/portfolio" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Portfolio | AI Automation Projects" />
        <meta name="twitter:description" content="Case studies of AI automation workflows, growth marketing systems, and technical implementations." />
        <meta name="twitter:image" content="https://theinnovativenative.com/images/og-default.jpg" />
      </Head>
      <Layout header={1} footer={1} video={false}>
        <CmnBanner
          title="Portfolio"
          navigation="Case Studies & Projects"
        />
        <PortfolioMain />
      </Layout>
    </>
  );
};

export default OurPortfolio;
