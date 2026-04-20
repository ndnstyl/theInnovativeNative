import React, { useState } from "react";

type Answer = "yes" | "no" | null;

interface Question {
  id: string;
  text: string;
}

const QUESTIONS: Question[] = [
  { id: "beginning", text: "Have you been farming for less than 10 years?" },
  { id: "disadvantaged", text: "Are you a member of a socially disadvantaged group (racial/ethnic minority)?" },
  { id: "veteran", text: "Are you a military veteran?" },
  { id: "income", text: "Is your adjusted gross income under $900,000?" },
];

const EligibilityChecker = () => {
  const [answers, setAnswers] = useState<Record<string, Answer>>({
    beginning: null,
    disadvantaged: null,
    veteran: null,
    income: null,
  });

  const allAnswered = Object.values(answers).every((a) => a !== null);

  const setAnswer = (id: string, value: Answer) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const hasBoost =
    (answers.beginning === "yes" ||
      answers.disadvantaged === "yes" ||
      answers.veteran === "yes") &&
    answers.income === "yes";

  const rate = hasBoost ? "90%" : "75%";
  const advancePayment = hasBoost;
  const dedicatedPool =
    answers.beginning === "yes" ||
    answers.disadvantaged === "yes" ||
    answers.veteran === "yes";
  const eligible = answers.income === "yes";

  return (
    <div className="gw-eligibility">
      <div className="gw-eligibility__heading">EQIP Eligibility Checker</div>
      <p className="gw-eligibility__subheading">
        Answer 4 questions to see your estimated reimbursement rate.
      </p>

      {QUESTIONS.map((q) => (
        <div key={q.id} className="gw-eligibility__question">
          <span className="gw-eligibility__question-text">{q.text}</span>
          <div className="gw-eligibility__btn-group">
            <button
              type="button"
              className={`gw-eligibility__btn${
                answers[q.id] === "yes" ? " gw-eligibility__btn--yes-active" : ""
              }`}
              onClick={() => setAnswer(q.id, "yes")}
            >
              Yes
            </button>
            <button
              type="button"
              className={`gw-eligibility__btn${
                answers[q.id] === "no" ? " gw-eligibility__btn--no-active" : ""
              }`}
              onClick={() => setAnswer(q.id, "no")}
            >
              No
            </button>
          </div>
        </div>
      ))}

      {allAnswered && (
        <div className="gw-eligibility__result">
          {!eligible ? (
            <>
              <div className="gw-eligibility__rate" style={{ color: "#FF1493" }}>
                Review Required
              </div>
              <div className="gw-eligibility__rate-label">
                Income over $900,000 may affect eligibility. Contact your local NRCS office.
              </div>
            </>
          ) : (
            <>
              <div className="gw-eligibility__rate">{rate}</div>
              <div className="gw-eligibility__rate-label">
                Estimated EQIP reimbursement rate
              </div>
              <div className="gw-eligibility__badges">
                <span
                  className={`gw-eligibility__badge gw-eligibility__badge--${
                    advancePayment ? "active" : "inactive"
                  }`}
                >
                  Advance Payment {advancePayment ? "Available" : "Not Available"}
                </span>
                <span
                  className={`gw-eligibility__badge gw-eligibility__badge--${
                    dedicatedPool ? "active" : "inactive"
                  }`}
                >
                  Dedicated Funding Pool {dedicatedPool ? "Applies" : "Standard Pool"}
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default EligibilityChecker;
