import React from "react";
import Head from "next/head";
import QuizFunnel from "@/components/quiz/QuizFunnel";

const LawFirmAuditQuiz = () => (
  <>
    <Head>
      <title>Law Firm Automation Audit | The Innovative Native</title>
      <meta name="robots" content="noindex, nofollow" />
      <meta name="description" content="Find out how much your firm is losing to manual work. 7 questions, 2 minutes, a reality check that costs $0." />
    </Head>
    <QuizFunnel quizId="law-firm-audit" />
  </>
);

export default LawFirmAuditQuiz;
