import React, { useState, useRef, useEffect } from "react";

type QuizTooltipProps = {
  text: string;
};

const QuizTooltip = ({ text }: QuizTooltipProps) => {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setVisible(false);
      }
    };
    if (visible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [visible]);

  return (
    <span className="quiz__tooltip" ref={containerRef}>
      <button
        type="button"
        className="quiz__tooltip-trigger"
        aria-label="More info"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onClick={() => setVisible((v) => !v)}
      >
        💡
      </button>
      {visible && (
        <div className="quiz__tooltip-popover" role="tooltip">
          {text}
        </div>
      )}
    </span>
  );
};

export default QuizTooltip;
