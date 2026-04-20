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

/**
 * A/B flow:
 *  Variant A (default): welcome → capture → questions → results
 *  Variant B (?v=b):    welcome → questions → capture → results
 *
 * Variant B also shows Calendly booking inline on the results page.
 */
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
  const [variant, setVariant] = useState<"a" | "b">("a");
  const [webhookFired, setWebhookFired] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("v") === "b") setVariant("b");
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

  // -- Scoring --
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

  // -- Progress --
  const progressPercent = (): number => {
    if (currentScreen === "welcome") return 0;
    if (currentScreen === "results") return 100;
    if (currentScreen === "capture") {
      // In variant A, capture is step 1 of (questions + 1)
      // In variant B, capture is after all questions
      return variant === "a" ? 0 : Math.round((totalQuestions / (totalQuestions + 1)) * 100);
    }
    const idx = getQuestionIndex(currentScreen);
    if (idx < 0) return 0;
    const total = variant === "a" ? totalQuestions : totalQuestions + 1;
    const step = variant === "a" ? idx + 1 : idx;
    return Math.round((step / total) * 100);
  };

  // -- Webhook --
  const fireWebhook = useCallback(
    (ans: Record<string, AnswerRecord>, info: LeadInfo) => {
      if (webhookFired) return;
      setWebhookFired(true);

      const totalScore = computeTotalScore(ans);
      const maxScore = computeMaxScore();
      const bucket = getResultBucket(totalScore);
      const webhookUrl = process.env.NEXT_PUBLIC_LEAD_WEBHOOK_URL;

      const payload = {
        quizId,
        variant,
        name: info.name,
        email: info.email,
        company: info.company,
        phone: info.phone,
        answers: ans,
        totalScore,
        maxScore,
        heatLevel: bucket.heatLevel,
        resultBucket: bucket.id,
        timestamp: new Date().toISOString(),
        source:
          typeof window !== "undefined"
            ? new URLSearchParams(window.location.search).get("utm_source") || "direct"
            : "direct",
      };

      if (webhookUrl) {
        fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).catch(() => {});
      }
    },
    [webhookFired, quizId, variant]
  );

  // -- Navigation: Variant A (capture first) --
  const handleStartA = () => setCurrentScreen("capture");

  const handleCaptureA = (info: LeadInfo) => {
    setLeadInfo(info);
    setCurrentScreen("question-0");
  };

  const handleAnswerA = (questionIndex: number, optionId: string, score: number) => {
    const q = questions[questionIndex];
    const updated = { ...answers, [q.id]: { optionId, score } };
    setAnswers(updated);

    if (questionIndex + 1 >= totalQuestions) {
      fireWebhook(updated, leadInfo);
      setCurrentScreen("results");
    } else {
      setCurrentScreen(`question-${questionIndex + 1}`);
    }
  };

  const handleBackA = (idx: number) => {
    if (idx === 0) setCurrentScreen("capture");
    else setCurrentScreen(`question-${idx - 1}`);
  };

  // -- Navigation: Variant B (capture last) --
  const handleStartB = () => setCurrentScreen("question-0");

  const handleAnswerB = (questionIndex: number, optionId: string, score: number) => {
    const q = questions[questionIndex];
    const updated = { ...answers, [q.id]: { optionId, score } };
    setAnswers(updated);

    if (questionIndex + 1 >= totalQuestions) {
      // Go to capture (after all questions)
      setCurrentScreen("capture");
    } else {
      setCurrentScreen(`question-${questionIndex + 1}`);
    }
  };

  const handleCaptureB = (info: LeadInfo) => {
    setLeadInfo(info);
    fireWebhook(answers, info);
    setCurrentScreen("results");
  };

  const handleBackB = (idx: number) => {
    if (idx === 0) setCurrentScreen("welcome");
    else setCurrentScreen(`question-${idx - 1}`);
  };

  // -- Computed --
  const totalScore = computeTotalScore(answers);
  const maxScore = computeMaxScore();
  const result = getResultBucket(totalScore);

  // -- Render --
  const renderScreen = () => {
    if (currentScreen === "welcome") {
      return (
        <QuizWelcome
          title={config.title}
          subtitle={config.subtitle}
          heroEmoji={config.heroEmoji}
          onStart={variant === "a" ? handleStartA : handleStartB}
        />
      );
    }

    if (currentScreen === "capture") {
      const captureHeadline = variant === "b"
        ? "You're done — where should we send your score?"
        : config.captureHeadline;
      const captureSubtext = variant === "b"
        ? "Your results are ready. Drop your info and we'll show you the breakdown."
        : config.captureSubtext;

      return (
        <QuizCapture
          headline={captureHeadline}
          subtext={captureSubtext}
          onSubmit={variant === "a" ? handleCaptureA : handleCaptureB}
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
          showBooking={variant === "b"}
        />
      );
    }

    if (currentScreen.startsWith("question-")) {
      const idx = getQuestionIndex(currentScreen);
      const question = questions[idx];
      if (!question) return null;

      const onAnswer = variant === "a" ? handleAnswerA : handleAnswerB;
      const onBack = variant === "a" ? handleBackA : handleBackB;

      return (
        <QuizQuestion
          question={question}
          questionNumber={idx + 1}
          totalQuestions={totalQuestions}
          onAnswer={(optionId, score) => onAnswer(idx, optionId, score)}
          onBack={() => onBack(idx)}
        />
      );
    }

    return null;
  };

  return (
    <div className="quiz">
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
