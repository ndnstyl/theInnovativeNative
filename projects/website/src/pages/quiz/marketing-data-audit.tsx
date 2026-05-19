import React from "react";
import Head from "next/head";
import QuizFunnel from "@/components/quiz/QuizFunnel";

const MarketingDataAuditQuiz = () => (
  <>
    <Head>
      <title>Marketing Data Audit | The Innovative Native</title>
      <meta name="robots" content="noindex, nofollow" />
      <meta
        name="description"
        content="Is your marketing data lying to you? 25 yes/no questions. Find out where your data spine is broken and how to fix it."
      />
    </Head>
    <QuizFunnel quizId="marketing-data-audit" />
  </>
);

export default MarketingDataAuditQuiz;
