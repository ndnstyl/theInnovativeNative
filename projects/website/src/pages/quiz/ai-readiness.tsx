import React, { useEffect, useState } from "react";
import Head from "next/head";
import Layout from "@/components/layout/Layout";
import QuizFunnel from "@/components/quiz/QuizFunnel";

const AiReadinessQuiz = () => {
  const [isEmbed, setIsEmbed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setIsEmbed(params.get("embed") === "true");
    }
  }, []);

  const head = (
    <Head>
      <title>AI Readiness Score | The Innovative Native</title>
      <meta name="robots" content="noindex, nofollow" />
      <meta
        name="description"
        content="Discover how AI-ready your business is. 6 questions, 2 minutes, a score that might hurt your feelings."
      />
    </Head>
  );

  if (isEmbed) {
    return (
      <>
        {head}
        <QuizFunnel quizId="ai-readiness" />
      </>
    );
  }

  return (
    <>
      {head}
      <Layout header={1} footer={1}>
        <QuizFunnel quizId="ai-readiness" />
      </Layout>
    </>
  );
};

export default AiReadinessQuiz;
