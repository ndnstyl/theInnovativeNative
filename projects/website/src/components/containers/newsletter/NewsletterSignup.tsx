import React, { useState } from 'react';

const WEBHOOK_URL = 'https://n8n.srv948776.hstgr.cloud/webhook/cerebro-lead';

interface FormData {
  firstName: string;
  email: string;
  firmName: string;
}

interface FieldErrors {
  firstName?: string;
  email?: string;
}

const colors = {
  bg: '#0a0f1a',
  card: '#131b2e',
  border: '#2a3a50',
  text: '#e8e8e8',
  label: '#8899aa',
  accent: '#d4a853',
  inputBg: '#0d1117',
  error: '#e5534b',
  success: '#3fb950',
};

const BULLETS = [
  'Top legal AI developments, curated daily',
  '2-minute read. No fluff. Real data.',
  'Court rulings, tool reviews, and practice-area insights',
  'Written by an AI systems architect who works with law firms',
];

const NewsletterSignup: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    email: '',
    firmName: '',
  });

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validate = (): boolean => {
    const errors: FieldErrors = {};
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required.';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!validateEmail(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getUtmParams = (): Record<string, string> => {
    if (typeof window === 'undefined') return {};
    try {
      const stored = localStorage.getItem('tin_utm_params');
      if (!stored) return {};
      const data = JSON.parse(stored);
      if (data.expires && Date.now() > data.expires) return {};
      const params: Record<string, string> = {};
      const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
      keys.forEach((key) => {
        if (data[key]) params[key] = data[key];
      });
      return params;
    } catch {
      return {};
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validate()) return;

    setLoading(true);

    try {
      const payload = {
        firstName: formData.firstName.trim(),
        email: formData.email.trim(),
        firmName: formData.firmName.trim() || null,
        leadMagnet: 'newsletter-signup',
        source: 'newsletter-page',
        ...getUtmParams(),
        timestamp: new Date().toISOString(),
      };

      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field in fieldErrors) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    backgroundColor: colors.inputBg,
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    color: colors.text,
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  };

  const inputErrorStyle: React.CSSProperties = {
    ...inputStyle,
    borderColor: colors.error,
  };

  const goldBtnStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 24px',
    backgroundColor: colors.accent,
    color: '#0a0f1a',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'background-color 0.2s, transform 0.15s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  };

  const goldBtnDisabledStyle: React.CSSProperties = {
    ...goldBtnStyle,
    opacity: 0.7,
    cursor: 'not-allowed',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '14px',
    color: colors.label,
    marginBottom: '6px',
    fontWeight: 500,
  };

  const fieldErrorMsgStyle: React.CSSProperties = {
    color: colors.error,
    fontSize: '13px',
    marginTop: '4px',
  };

  const formGroupStyle: React.CSSProperties = {
    marginBottom: '18px',
  };

  const spinnerStyle: React.CSSProperties = {
    display: 'inline-block',
    width: '18px',
    height: '18px',
    border: '2px solid rgba(10, 15, 26, 0.3)',
    borderTopColor: '#0a0f1a',
    borderRadius: '50%',
    animation: 'nlSpin 0.6s linear infinite',
  };

  return (
    <>
      <style>{`
        @keyframes nlSpin {
          to { transform: rotate(360deg); }
        }
        .nl-input:focus {
          border-color: ${colors.accent} !important;
          box-shadow: 0 0 0 2px rgba(212, 168, 83, 0.18);
        }
        .nl-gold-btn:hover:not(:disabled) {
          background-color: #c09840 !important;
          transform: translateY(-1px);
        }
      `}</style>

      <section className="newsletter-signup">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="newsletter-signup__wrapper">
                {/* Left: Value prop */}
                <div className="newsletter-signup__content">
                  <span className="newsletter-signup__badge">Free Daily Digest</span>
                  <h1 className="newsletter-signup__title">Legal AI Briefing</h1>
                  <p className="newsletter-signup__subtitle">
                    The 5 things every attorney should know about AI. Every morning. Free.
                  </p>
                  <h3 className="newsletter-signup__what">What you get:</h3>
                  <ul className="newsletter-signup__bullets">
                    {BULLETS.map((bullet, idx) => (
                      <li key={idx}>
                        <i
                          className="fa-solid fa-check"
                          style={{ color: colors.accent, marginRight: '10px', fontSize: '14px' }}
                        />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right: Form or Confirmation */}
                <div className="newsletter-signup__form-panel">
                  {submitted ? (
                    <div className="newsletter-signup__confirmed">
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '56px',
                          height: '56px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(63, 185, 80, 0.12)',
                          border: `2px solid ${colors.success}`,
                          margin: '0 auto 16px',
                          fontSize: '24px',
                          color: colors.success,
                        }}
                      >
                        <i className="fa-solid fa-check" />
                      </div>
                      <h3
                        style={{
                          color: colors.text,
                          fontSize: '20px',
                          fontWeight: 700,
                          margin: '0 0 8px',
                          textAlign: 'center',
                        }}
                      >
                        You&apos;re in.
                      </h3>
                      <p
                        style={{
                          color: colors.label,
                          fontSize: '15px',
                          textAlign: 'center',
                          marginBottom: 0,
                          lineHeight: 1.6,
                        }}
                      >
                        First briefing arrives tomorrow morning.
                      </p>
                    </div>
                  ) : (
                    <>
                      <h3
                        style={{
                          color: colors.text,
                          fontSize: '18px',
                          fontWeight: 700,
                          margin: '0 0 4px',
                        }}
                      >
                        Subscribe now
                      </h3>
                      <p
                        style={{
                          color: colors.label,
                          fontSize: '14px',
                          margin: '0 0 20px',
                          lineHeight: 1.5,
                        }}
                      >
                        Join attorneys already reading the briefing.
                      </p>

                      {error && (
                        <div
                          style={{
                            backgroundColor: 'rgba(229, 83, 75, 0.12)',
                            border: `1px solid ${colors.error}`,
                            borderRadius: '8px',
                            padding: '10px 14px',
                            color: colors.error,
                            fontSize: '14px',
                            marginBottom: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <i className="fa-solid fa-exclamation-circle" />
                          <span>{error}</span>
                        </div>
                      )}

                      <form onSubmit={handleSubmit} noValidate>
                        {/* First Name */}
                        <div style={formGroupStyle}>
                          <label htmlFor="nl-firstName" style={labelStyle}>
                            First Name <span style={{ color: colors.error }}>*</span>
                          </label>
                          <input
                            className="nl-input"
                            id="nl-firstName"
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => updateField('firstName', e.target.value)}
                            placeholder="Jane"
                            style={fieldErrors.firstName ? inputErrorStyle : inputStyle}
                            disabled={loading}
                            autoComplete="given-name"
                          />
                          {fieldErrors.firstName && (
                            <div style={fieldErrorMsgStyle}>{fieldErrors.firstName}</div>
                          )}
                        </div>

                        {/* Email */}
                        <div style={formGroupStyle}>
                          <label htmlFor="nl-email" style={labelStyle}>
                            Email <span style={{ color: colors.error }}>*</span>
                          </label>
                          <input
                            className="nl-input"
                            id="nl-email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => updateField('email', e.target.value)}
                            placeholder="jane@smithlaw.com"
                            style={fieldErrors.email ? inputErrorStyle : inputStyle}
                            disabled={loading}
                            autoComplete="email"
                          />
                          {fieldErrors.email && (
                            <div style={fieldErrorMsgStyle}>{fieldErrors.email}</div>
                          )}
                        </div>

                        {/* Firm Name (optional) */}
                        <div style={formGroupStyle}>
                          <label htmlFor="nl-firmName" style={labelStyle}>
                            Firm Name <span style={{ color: colors.label, fontWeight: 400 }}>(optional)</span>
                          </label>
                          <input
                            className="nl-input"
                            id="nl-firmName"
                            type="text"
                            value={formData.firmName}
                            onChange={(e) => updateField('firmName', e.target.value)}
                            placeholder="Smith & Associates"
                            style={inputStyle}
                            disabled={loading}
                            autoComplete="organization"
                          />
                        </div>

                        {/* Submit */}
                        <button
                          className="nl-gold-btn"
                          type="submit"
                          style={loading ? goldBtnDisabledStyle : goldBtnStyle}
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span style={spinnerStyle} />
                              Subscribing...
                            </>
                          ) : (
                            <>
                              Subscribe
                              <i className="fa-solid fa-arrow-right" />
                            </>
                          )}
                        </button>

                        <p
                          style={{
                            textAlign: 'center',
                            fontSize: '12px',
                            color: colors.label,
                            marginTop: '14px',
                            marginBottom: 0,
                            lineHeight: 1.5,
                          }}
                        >
                          No spam. Unsubscribe anytime.
                        </p>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NewsletterSignup;
