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
      </Head>
      <Layout header={2} footer={5} video={0}>
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
