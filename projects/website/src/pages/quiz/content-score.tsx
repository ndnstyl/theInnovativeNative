import React from "react";
import Head from "next/head";
import QuizFunnel from "@/components/quiz/QuizFunnel";

const ContentScoreQuiz = () => (
  <>
    <Head>
      <title>Content Production Score | The Innovative Native</title>
      <meta name="robots" content="noindex, nofollow" />
      <meta name="description" content="Find out if you're a content machine or a content hostage. 6 questions, 2 minutes." />
    </Head>
    <QuizFunnel quizId="content-score" />
  </>
);

export default ContentScoreQuiz;
