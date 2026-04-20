import React from "react";
import Head from "next/head";
import QuizFunnel from "@/components/quiz/QuizFunnel";

const ListingScoreQuiz = () => (
  <>
    <Head>
      <title>Listing Marketing Score | The Innovative Native</title>
      <meta name="robots" content="noindex, nofollow" />
      <meta name="description" content="Find out if your listings are getting seen or getting scrolled past. 6 questions, 2 minutes." />
    </Head>
    <QuizFunnel quizId="listing-score" />
  </>
);

export default ListingScoreQuiz;
