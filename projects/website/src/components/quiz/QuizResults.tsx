import React, { useState } from "react";
import Link from "next/link";
import { CALENDLY_URL } from "@/lib/constants";

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

type QuizResultsProps = {
  result: ResultBucket;
  score: number;
  maxScore: number;
  quizTitle: string;
};

const QuizResults = ({ result, score, maxScore, quizTitle }: QuizResultsProps) => {
  const [copied, setCopied] = useState(false);

  const handleCTA = () => {
    if (result.ctaType === "calendly") {
      if (typeof window !== "undefined" && (window as any).Calendly) {
        (window as any).Calendly.initPopupWidget({ url: CALENDLY_URL });
      }
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      const url = window.location.href.split("?")[0];
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const renderCTA = () => {
    if (result.ctaType === "calendly") {
      return (
        <button type="button" className="quiz__cta" onClick={handleCTA}>
          {result.ctaLabel}
        </button>
      );
    }
    if (result.ctaType === "link" || result.ctaType === "download") {
      return (
        <Link href={result.ctaUrl || "/"} className="quiz__cta">
          {result.ctaLabel}
        </Link>
      );
    }
    return null;
  };

  return (
    <div className="quiz__screen quiz__screen--entering">
      <div className="quiz__results">
        <div className="quiz__score-gauge">
          <span className="quiz__score-gauge-emoji" aria-hidden="true">
            {result.emoji}
          </span>
          <div className="quiz__score-gauge-score">
            <span>
              {score} / {maxScore}
            </span>
          </div>
          <div>
            <span className="quiz__score-gauge-label">{result.label}</span>
          </div>
        </div>

        <h2 className="quiz__results-headline">{result.headline}</h2>
        <p className="quiz__results-summary">{result.summary}</p>
        <p className="quiz__results-recommendation">{result.recommendation}</p>

        {renderCTA()}

        <button
          type="button"
          className={`quiz__share${copied ? " quiz__share--copied" : ""}`}
          onClick={handleShare}
        >
          {copied ? "✓ Link copied!" : "📤 Share this quiz"}
        </button>

        <p className="quiz__results-sent">
          Full breakdown sent to your email ✓
        </p>
      </div>
    </div>
  );
};

export default QuizResults;
