import React from "react";
import Head from "next/head";
import QuizFunnel from "@/components/quiz/QuizFunnel";

const AiReadinessQuiz = () => (
  <>
    <Head>
      <title>AI Readiness Score | The Innovative Native</title>
      <meta name="robots" content="noindex, nofollow" />
      <meta name="description" content="Discover how AI-ready your business is. 6 questions, 2 minutes, a score that might hurt your feelings." />
    </Head>
    <QuizFunnel quizId="ai-readiness" />
  </>
);

export default AiReadinessQuiz;
