import React, { useState, useEffect, useCallback } from "react";
import aiReadiness from "@/data/quizzes/ai-readiness.json";
import lawFirmAudit from "@/data/quizzes/law-firm-audit.json";
import QuizWelcome from "./QuizWelcome";
import QuizCapture from "./QuizCapture";
import QuizQuestion from "./QuizQuestion";
import QuizResults from "./QuizResults";

const QUIZ_MAP: Record<string, any> = {
  "ai-readiness": aiReadiness,
  "law-firm-audit": lawFirmAudit,
};

type AnswerRecord = {
  optionId: string;
  score: number;
};

type LeadInfo = {
  name: string;
  email: string;
  company: string;
  phone: string;
};

type ResultBucket = {
  id: string;
  minScore: number;
  maxScore: number;
  label: string;
  emoji: string;
  headline: string;
  summary: string;
  recommendation: string;
  ctaLabel: string;
  ctaType: "calendly" | "link" | "download";
  ctaUrl: string;
  heatLevel: string;
};

type Screen =
  | "welcome"
  | "capture"
  | `question-${number}`
  | "results";

type QuizFunnelProps = {
  quizId: string;
};

const QuizFunnel = ({ quizId }: QuizFunnelProps) => {
  const config = QUIZ_MAP[quizId];

  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome");
  const [answers, setAnswers] = useState<Record<string, AnswerRecord>>({});
  const [leadInfo, setLeadInfo] = useState<LeadInfo>({
    name: "",
    email: "",
    company: "",
    phone: "",
  });
  const [isEmbed, setIsEmbed] = useState(false);
  const [webhookFired, setWebhookFired] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setIsEmbed(params.get("embed") === "true");
    }
  }, []);

  if (!config) {
    return (
      <div className="quiz">
        <p style={{ color: "#888" }}>Quiz not found.</p>
      </div>
    );
  }

  const questions: any[] = config.questions;
  const results: ResultBucket[] = config.results;
  const totalQuestions = questions.length;

  const computeTotalScore = (ans: Record<string, AnswerRecord>) => {
    return questions.reduce((sum, q) => {
      const a = ans[q.id];
      if (!a) return sum;
      return sum + a.score * (q.scoreWeight ?? 1);
    }, 0);
  };

  const computeMaxScore = () => {
    return questions.reduce((sum, q) => {
      const maxOption = Math.max(...q.options.map((o: any) => o.score));
      return sum + maxOption * (q.scoreWeight ?? 1);
    }, 0);
  };

  const getResultBucket = (score: number): ResultBucket => {
    return (
      results.find((r) => score >= r.minScore && score <= r.maxScore) ??
      results[results.length - 1]
    );
  };

  const getQuestionIndex = (screen: Screen): number => {
    if (screen.startsWith("question-")) {
      return parseInt(screen.replace("question-", ""), 10);
    }
    return -1;
  };

  const progressPercent = (): number => {
    if (currentScreen === "welcome" || currentScreen === "capture") return 0;
    if (currentScreen === "results") return 100;
    const idx = getQuestionIndex(currentScreen);
    return Math.round((idx / totalQuestions) * 100);
  };

  const fireWebhook = useCallback(
    (ans: Record<string, AnswerRecord>, info: LeadInfo) => {
      if (webhookFired) return;
      setWebhookFired(true);

      const totalScore = computeTotalScore(ans);
      const maxScore = computeMaxScore();
      const result = getResultBucket(totalScore);
      const webhookUrl = process.env.NEXT_PUBLIC_LEAD_WEBHOOK_URL;

      if (webhookUrl) {
        fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quizId,
            name: info.name,
            email: info.email,
            company: info.company,
            phone: info.phone,
            answers: ans,
            totalScore,
            maxScore,
            heatLevel: result.heatLevel,
            resultBucket: result.id,
            timestamp: new Date().toISOString(),
            source:
              typeof window !== "undefined"
                ? new URLSearchParams(window.location.search).get("utm_source") || "direct"
                : "direct",
          }),
        }).catch(() => {});
      }
    },
    [webhookFired, quizId]
  );

  const handleStart = () => {
    setCurrentScreen("capture");
  };

  const handleCapture = (info: LeadInfo) => {
    setLeadInfo(info);
    setCurrentScreen("question-0");
  };

  const handleAnswer = (questionIndex: number, optionId: string, score: number) => {
    const q = questions[questionIndex];
    const updatedAnswers = {
      ...answers,
      [q.id]: { optionId, score },
    };
    setAnswers(updatedAnswers);

    const nextIndex = questionIndex + 1;
    if (nextIndex >= totalQuestions) {
      fireWebhook(updatedAnswers, leadInfo);
      setCurrentScreen("results");
    } else {
      setCurrentScreen(`question-${nextIndex}`);
    }
  };

  const handleBack = (currentIndex: number) => {
    if (currentIndex === 0) {
      setCurrentScreen("capture");
    } else {
      setCurrentScreen(`question-${currentIndex - 1}`);
    }
  };

  const totalScore = computeTotalScore(answers);
  const maxScore = computeMaxScore();
  const result = getResultBucket(totalScore);

  const renderScreen = () => {
    if (currentScreen === "welcome") {
      return (
        <QuizWelcome
          title={config.title}
          subtitle={config.subtitle}
          heroEmoji={config.heroEmoji}
          onStart={handleStart}
        />
      );
    }

    if (currentScreen === "capture") {
      return (
        <QuizCapture
          headline={config.captureHeadline}
          subtext={config.captureSubtext}
          onSubmit={handleCapture}
        />
      );
    }

    if (currentScreen === "results") {
      return (
        <QuizResults
          result={result}
          score={Math.round(totalScore)}
          maxScore={Math.round(maxScore)}
          quizTitle={config.title}
        />
      );
    }

    if (currentScreen.startsWith("question-")) {
      const idx = getQuestionIndex(currentScreen);
      const question = questions[idx];
      if (!question) return null;
      return (
        <QuizQuestion
          question={question}
          questionNumber={idx + 1}
          totalQuestions={totalQuestions}
          onAnswer={(optionId, score) => handleAnswer(idx, optionId, score)}
          onBack={() => handleBack(idx)}
        />
      );
    }

    return null;
  };

  return (
    <div className={`quiz${isEmbed ? " quiz--embed" : ""}`}>
      <div className="quiz__progress">
        <div
          className="quiz__progress-fill"
          style={{ width: `${progressPercent()}%` }}
          role="progressbar"
          aria-valuenow={progressPercent()}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {renderScreen()}

      <p className="quiz__legal">
        Your information is protected and never shared. Unsubscribe anytime.
      </p>
    </div>
  );
};

export default QuizFunnel;
