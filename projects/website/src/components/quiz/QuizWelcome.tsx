import React from "react";

type QuizWelcomeProps = {
  title: string;
  subtitle: string;
  heroEmoji: string;
  onStart: () => void;
};

const QuizWelcome = ({ title, subtitle, heroEmoji, onStart }: QuizWelcomeProps) => {
  return (
    <div className="quiz__screen quiz__screen--entering">
      <div className="quiz__welcome">
        <span className="quiz__welcome-emoji" aria-hidden="true">
          {heroEmoji}
        </span>
        <h1 className="quiz__welcome-title">{title}</h1>
        <p className="quiz__welcome-subtitle">{subtitle}</p>
        <div className="quiz__welcome-badge">⏱ Takes 2 minutes</div>
        <button type="button" className="quiz__welcome-cta" onClick={onStart}>
          Let&rsquo;s Go &rarr;
        </button>
      </div>
    </div>
  );
};

export default QuizWelcome;
