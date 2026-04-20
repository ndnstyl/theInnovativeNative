import React from "react";

type QuizOption = {
  id: string;
  label: string;
  subtitle?: string;
  score: number;
  emoji?: string;
};

type QuizOptionCardProps = {
  option: QuizOption;
  selected: boolean;
  onClick: () => void;
};

const QuizOptionCard = ({ option, selected, onClick }: QuizOptionCardProps) => {
  return (
    <button
      type="button"
      className={`quiz__option${selected ? " quiz__option--selected" : ""}`}
      onClick={onClick}
      aria-pressed={selected}
    >
      {option.emoji && (
        <span className="quiz__option-emoji" aria-hidden="true">
          {option.emoji}
        </span>
      )}
      <span className="quiz__option-content">
        <span className="quiz__option-label">{option.label}</span>
        {option.subtitle && (
          <span className="quiz__option-subtitle">{option.subtitle}</span>
        )}
      </span>
    </button>
  );
};

export default QuizOptionCard;
