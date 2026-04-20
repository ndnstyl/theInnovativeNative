import React, { useState } from "react";
import QuizOptionCard from "./QuizOptionCard";
import QuizTooltip from "./QuizTooltip";

type QuizOption = {
  id: string;
  label: string;
  subtitle?: string;
  score: number;
  emoji?: string;
};

type QuizQuestionData = {
  id: string;
  text: string;
  subtext?: string;
  tooltip?: string;
  type: string;
  options: QuizOption[];
  scoreWeight: number;
};

type QuizQuestionProps = {
  question: QuizQuestionData;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (optionId: string, score: number) => void;
  onBack: () => void;
};

const QuizQuestion = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onBack,
}: QuizQuestionProps) => {
  const [flashId, setFlashId] = useState<string | null>(null);

  const handleOptionClick = (optionId: string, score: number) => {
    setFlashId(optionId);
    setTimeout(() => {
      onAnswer(optionId, score);
      setFlashId(null);
    }, 200);
  };

  const useTwoCol = question.options.length >= 4;

  return (
    <div className="quiz__screen quiz__screen--entering">
      <div className="quiz__question">
        <div className="quiz__question-header">
          <button type="button" className="quiz__back" onClick={onBack}>
            &larr; Back
          </button>

          <p className="quiz__question-number">
            Question {questionNumber} of {totalQuestions}
          </p>

          <h2 className="quiz__question-text">{question.text}</h2>

          {question.subtext && (
            <div className="quiz__question-subtext-row">
              <p className="quiz__question-subtext">{question.subtext}</p>
              {question.tooltip && <QuizTooltip text={question.tooltip} />}
            </div>
          )}
        </div>

        <div className={`quiz__options${useTwoCol ? " quiz__options--two-col" : ""}`}>
          {question.options.map((option) => (
            <QuizOptionCard
              key={option.id}
              option={option}
              selected={flashId === option.id}
              onClick={() => handleOptionClick(option.id, option.score)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizQuestion;
