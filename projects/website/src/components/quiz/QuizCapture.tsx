import React, { useState } from "react";

type LeadInfo = {
  name: string;
  email: string;
  company: string;
  phone: string;
};

type QuizCaptureProps = {
  headline: string;
  subtext: string;
  onSubmit: (info: LeadInfo) => void;
};

const QuizCapture = ({ headline, subtext, onSubmit }: QuizCaptureProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const validate = () => {
    const next: { name?: string; email?: string } = {};
    if (!name.trim()) next.name = "Name is required";
    if (!email.trim()) {
      next.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "Enter a valid email address";
    }
    return next;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit({ name: name.trim(), email: email.trim(), company: company.trim(), phone: phone.trim() });
  };

  return (
    <div className="quiz__screen quiz__screen--entering">
      <div className="quiz__capture">
        <h2 className="quiz__capture-headline">{headline}</h2>
        <p className="quiz__capture-subtext">{subtext}</p>
        <form className="quiz__capture-form" onSubmit={handleSubmit} noValidate>
          <div className="quiz__capture-field">
            <label className="quiz__capture-label" htmlFor="quiz-name">
              Name <span style={{ color: "#00FFFF" }}>*</span>
            </label>
            <input
              id="quiz-name"
              type="text"
              className="quiz__capture-input"
              placeholder="Your name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              autoComplete="name"
            />
            {errors.name && (
              <span style={{ color: "#ff6b6b", fontSize: "0.78rem" }}>{errors.name}</span>
            )}
          </div>

          <div className="quiz__capture-field">
            <label className="quiz__capture-label" htmlFor="quiz-email">
              Email <span style={{ color: "#00FFFF" }}>*</span>
            </label>
            <input
              id="quiz-email"
              type="email"
              className="quiz__capture-input"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              autoComplete="email"
            />
            {errors.email && (
              <span style={{ color: "#ff6b6b", fontSize: "0.78rem" }}>{errors.email}</span>
            )}
          </div>

          <div className="quiz__capture-field">
            <label className="quiz__capture-label" htmlFor="quiz-company">
              Company
            </label>
            <input
              id="quiz-company"
              type="text"
              className="quiz__capture-input"
              placeholder="Optional — helps us personalize"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              autoComplete="organization"
            />
          </div>

          <div className="quiz__capture-field">
            <label className="quiz__capture-label" htmlFor="quiz-phone">
              Phone
            </label>
            <input
              id="quiz-phone"
              type="tel"
              className="quiz__capture-input"
              placeholder="Optional"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
            />
          </div>

          <button type="submit" className="quiz__capture-submit">
            Get My Score &rarr;
          </button>
        </form>
        <p className="quiz__capture-privacy">
          We will not spam you. We will not sell your data. We will not show up at your
          office with a whiteboard and a pitch deck.<br />
          <span className="quiz__capture-privacy-fine">
            (We already know where your office is. We just choose not to be weird about it.)
          </span>
        </p>
      </div>
    </div>
  );
};

export default QuizCapture;
