import React from "react";
import Head from "next/head";
import Layout from "@/components/layout/Layout";
import CmnBanner from "@/components/layout/banner/CmnBanner";
import ErrorMain from "@/components/containers/ErrorMain";

const ErrorPage = () => {
  return (
    <>
      <Head>
        <title>Page Not Found | The Innovative Native</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Layout header={2} footer={5} video={0}>
        <CmnBanner title="Error" navigation="Error" />
        <ErrorMain />
      </Layout>
    </>
  );
};

export default ErrorPage;
