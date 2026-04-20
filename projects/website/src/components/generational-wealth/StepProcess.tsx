import React, { useState } from "react";

interface Step {
  number: number;
  title: string;
  description: string;
  time?: string;
}

interface StepProcessProps {
  steps: Step[];
}

const StepProcess = ({ steps }: StepProcessProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="gw-step-process">
      {steps.map((step, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={step.number} className="gw-step-process__item">
            <div className="gw-step-process__left">
              <div
                className={`gw-step-process__number${isOpen ? " gw-step-process__number--active" : ""}`}
                onClick={() => toggle(index)}
              >
                {step.number}
              </div>
              {index < steps.length - 1 && (
                <div className="gw-step-process__connector" />
              )}
            </div>
            <div className="gw-step-process__body">
              <div
                className="gw-step-process__header"
                onClick={() => toggle(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") toggle(index);
                }}
                aria-expanded={isOpen}
              >
                <span className="gw-step-process__title">{step.title}</span>
                {step.time && (
                  <span className="gw-step-process__time">{step.time}</span>
                )}
              </div>
              <div
                className={`gw-step-process__description${isOpen ? " gw-step-process__description--open" : ""}`}
              >
                {step.description}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StepProcess;
