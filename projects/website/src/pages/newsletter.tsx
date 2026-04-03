import React from 'react';
import Layout from '@/components/layout/Layout';
import Head from 'next/head';
import NewsletterSignup from '@/components/containers/newsletter/NewsletterSignup';

const NewsletterPage = () => {
  return (
    <>
      <Head>
        <title>Legal AI Briefing | The Innovative Native</title>
        <meta
          name="description"
          content="The 5 things every attorney should know about AI. A free daily digest covering court rulings, tool reviews, and practice-area insights."
        />
      </Head>
      <Layout header={1} footer={1} video={false}>
        <NewsletterSignup />
      </Layout>
    </>
  );
};

export default NewsletterPage;
