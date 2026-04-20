import React from "react";
import Head from "next/head";
import QuizFunnel from "@/components/quiz/QuizFunnel";

const CostCalculatorQuiz = () => (
  <>
    <Head>
      <title>Manual Work Cost Calculator | The Innovative Native</title>
      <meta name="robots" content="noindex, nofollow" />
      <meta name="description" content="How much is manual work costing your business? 5 questions, 90 seconds, a dollar amount you can't unsee." />
    </Head>
    <QuizFunnel quizId="cost-calculator" />
  </>
);

export default CostCalculatorQuiz;
