import React, { useEffect, useState } from "react";
import Head from "next/head";
import Layout from "@/components/layout/Layout";
import QuizFunnel from "@/components/quiz/QuizFunnel";

const LawFirmAuditQuiz = () => {
  const [isEmbed, setIsEmbed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setIsEmbed(params.get("embed") === "true");
    }
  }, []);

  const head = (
    <Head>
      <title>Law Firm Automation Audit | The Innovative Native</title>
      <meta name="robots" content="noindex, nofollow" />
      <meta
        name="description"
        content="Find out how much your firm is losing to manual work. 7 questions, 2 minutes, a reality check that costs $0."
      />
    </Head>
  );

  if (isEmbed) {
    return (
      <>
        {head}
        <QuizFunnel quizId="law-firm-audit" />
      </>
    );
  }

  return (
    <>
      {head}
      <Layout header={1} footer={1}>
        <QuizFunnel quizId="law-firm-audit" />
      </Layout>
    </>
  );
};

export default LawFirmAuditQuiz;
