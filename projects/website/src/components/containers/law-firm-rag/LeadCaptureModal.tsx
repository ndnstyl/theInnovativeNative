import React, { useState, useEffect, useCallback, useRef } from 'react';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (email: string) => void;
  ctaSource: string;
}

type Step = 1 | 2;

interface Step1Data {
  fullName: string;
  email: string;
  firmName: string;
  phone: string;
}

interface Step2Data {
  practiceArea: string;
  firmSize: string;
  state: string;
  currentTools: string[];
  biggestChallenge: string;
}

interface FieldError {
  fullName?: string;
  email?: string;
  firmName?: string;
}

const WEBHOOK_URL = 'https://n8n.srv948776.hstgr.cloud/webhook/cerebro-lead';

const PRACTICE_AREAS = [
  'Bankruptcy',
  'Criminal Defense',
  'Administrative Law',
  'Other',
];

const FIRM_SIZES = ['Solo', '2-10', '11-50', '50+'];

const RESEARCH_TOOLS = ['Westlaw', 'LexisNexis', 'CoCounsel', 'None'];

// -- Shared inline style tokens --
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
  backdrop: 'rgba(6, 10, 20, 0.88)',
};

const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  ctaSource,
}) => {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldError>({});
  const [capturedEmail, setCapturedEmail] = useState('');

  const [step1, setStep1] = useState<Step1Data>({
    fullName: '',
    email: '',
    firmName: '',
    phone: '',
  });

  const [step2, setStep2] = useState<Step2Data>({
    practiceArea: '',
    firmSize: '',
    state: '',
    currentTools: [],
    biggestChallenge: '',
  });

  const modalRef = useRef<HTMLDivElement>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setLoading(false);
      setError(null);
      setFieldErrors({});
      setCapturedEmail('');
      setStep1({ fullName: '', email: '', firmName: '', phone: '' });
      setStep2({
        practiceArea: '',
        firmSize: '',
        state: '',
        currentTools: [],
        biggestChallenge: '',
      });
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;
    const modal = modalRef.current;
    if (!modal) return;

    const focusable = modal.querySelectorAll<HTMLElement>(
      'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', trap);
    first?.focus();
    return () => document.removeEventListener('keydown', trap);
  }, [isOpen, step]);

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // -- Validation --
  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateStep1 = (): boolean => {
    const errors: FieldError = {};
    if (!step1.fullName.trim()) {
      errors.fullName = 'Full name is required.';
    }
    if (!step1.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!validateEmail(step1.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!step1.firmName.trim()) {
      errors.firmName = 'Firm name is required.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // -- Step 1 Submit --
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateStep1()) return;

    setLoading(true);

    try {
      const payload = {
        fullName: step1.fullName.trim(),
        email: step1.email.trim(),
        firmName: step1.firmName.trim(),
        phone: step1.phone.trim() || null,
        ctaSource,
        capturedAt: new Date().toISOString(),
        step: 1,
      };

      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      setCapturedEmail(step1.email.trim());
      setStep(2);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // -- Step 2 Submit --
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        email: capturedEmail,
        practiceArea: step2.practiceArea || null,
        firmSize: step2.firmSize || null,
        state: step2.state.trim() || null,
        currentTools: step2.currentTools.length > 0 ? step2.currentTools : null,
        biggestChallenge: step2.biggestChallenge.trim() || null,
        step: 2,
      };

      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
      // Step 2 is optional — swallow errors silently
    } finally {
      setLoading(false);
      onComplete(capturedEmail);
    }
  };

  const handleSkip = () => {
    onComplete(capturedEmail);
  };

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  const toggleTool = (tool: string) => {
    setStep2((prev) => ({
      ...prev,
      currentTools: prev.currentTools.includes(tool)
        ? prev.currentTools.filter((t) => t !== tool)
        : [...prev.currentTools, tool],
    }));
  };

  if (!isOpen) return null;

  // -- Inline styles --
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: colors.backdrop,
    zIndex: 99999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    animation: 'lcrFadeIn 0.25s ease-out',
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: colors.card,
    borderRadius: '12px',
    border: `1px solid ${colors.border}`,
    maxWidth: '520px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
    padding: '36px 32px 32px',
    boxShadow: '0 24px 80px rgba(0, 0, 0, 0.6), 0 0 40px rgba(212, 168, 83, 0.08)',
    animation: 'lcrSlideUp 0.3s ease-out',
  };

  const closeBtnStyle: React.CSSProperties = {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'none',
    border: 'none',
    color: colors.label,
    fontSize: '20px',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '6px',
    transition: 'color 0.2s, background 0.2s',
    lineHeight: 1,
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '14px',
    color: colors.label,
    marginBottom: '6px',
    fontWeight: 500,
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

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='%238899aa'%3E%3Cpath d='M6 8L0 0h12z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center',
    paddingRight: '36px',
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    resize: 'none' as const,
    minHeight: '56px',
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

  const skipBtnStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: colors.label,
    fontSize: '14px',
    cursor: 'pointer',
    padding: '8px 0',
    textDecoration: 'underline',
    textUnderlineOffset: '3px',
    transition: 'color 0.2s',
    display: 'block',
    margin: '0 auto',
  };

  const fieldErrorStyle: React.CSSProperties = {
    color: colors.error,
    fontSize: '13px',
    marginTop: '4px',
  };

  const formGroupStyle: React.CSSProperties = {
    marginBottom: '18px',
  };

  const progressStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '24px',
  };

  const dotBase: React.CSSProperties = {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    transition: 'background-color 0.3s, transform 0.3s',
  };

  const dotActive: React.CSSProperties = {
    ...dotBase,
    backgroundColor: colors.accent,
    transform: 'scale(1.2)',
  };

  const dotInactive: React.CSSProperties = {
    ...dotBase,
    backgroundColor: colors.border,
  };

  const dotLineStyle: React.CSSProperties = {
    width: '40px',
    height: '2px',
    backgroundColor: step === 2 ? colors.accent : colors.border,
    transition: 'background-color 0.3s',
  };

  const stepLabelStyle: React.CSSProperties = {
    fontSize: '13px',
    color: colors.label,
    textAlign: 'center',
    marginBottom: '4px',
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '24px',
  };

  const titleStyle: React.CSSProperties = {
    color: colors.text,
    fontSize: '22px',
    fontWeight: 700,
    margin: '0 0 6px',
  };

  const subtitleStyle: React.CSSProperties = {
    color: colors.label,
    fontSize: '14px',
    margin: 0,
    lineHeight: 1.5,
  };

  const errorBannerStyle: React.CSSProperties = {
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
  };

  const checkboxGroupStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  };

  const checkboxBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 14px',
    borderRadius: '6px',
    border: `1px solid ${active ? colors.accent : colors.border}`,
    backgroundColor: active ? 'rgba(212, 168, 83, 0.12)' : colors.inputBg,
    color: active ? colors.accent : colors.text,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontWeight: active ? 600 : 400,
  });

  const spinnerStyle: React.CSSProperties = {
    display: 'inline-block',
    width: '18px',
    height: '18px',
    border: '2px solid rgba(10, 15, 26, 0.3)',
    borderTopColor: '#0a0f1a',
    borderRadius: '50%',
    animation: 'lcrSpin 0.6s linear infinite',
  };

  const successIconStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: 'rgba(63, 185, 80, 0.12)',
    border: `2px solid ${colors.success}`,
    margin: '0 auto 12px',
    fontSize: '22px',
    color: colors.success,
  };

  return (
    <>
      {/* Keyframe animations injected once */}
      <style>{`
        @keyframes lcrFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes lcrSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes lcrSpin {
          to { transform: rotate(360deg); }
        }
        .lcr-input:focus {
          border-color: ${colors.accent} !important;
          box-shadow: 0 0 0 2px rgba(212, 168, 83, 0.18);
        }
        .lcr-close:hover {
          color: ${colors.text} !important;
          background: rgba(255,255,255,0.06) !important;
        }
        .lcr-gold-btn:hover:not(:disabled) {
          background-color: #c09840 !important;
          transform: translateY(-1px);
        }
        .lcr-skip-btn:hover {
          color: ${colors.text} !important;
        }
        .lcr-tool-btn:hover {
          border-color: ${colors.accent} !important;
        }
        .lcr-card::-webkit-scrollbar {
          width: 6px;
        }
        .lcr-card::-webkit-scrollbar-track {
          background: transparent;
        }
        .lcr-card::-webkit-scrollbar-thumb {
          background: ${colors.border};
          border-radius: 3px;
        }
        @media (max-width: 575px) {
          .lcr-card {
            padding: 28px 20px 24px !important;
          }
        }
      `}</style>

      <div
        style={overlayStyle}
        onClick={handleBackdropClick}
        aria-hidden="true"
      >
        <div
          ref={modalRef}
          className="lcr-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lcr-title"
          style={cardStyle}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            className="lcr-close"
            style={closeBtnStyle}
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>

          {/* Progress indicator */}
          <div style={stepLabelStyle}>
            Step {step} of 2
          </div>
          <div style={progressStyle}>
            <div style={dotActive} />
            <div style={dotLineStyle} />
            <div style={step === 2 ? dotActive : dotInactive} />
          </div>

          {/* -- STEP 1 -- */}
          {step === 1 && (
            <>
              <div style={headerStyle}>
                <h2 id="lcr-title" style={titleStyle}>
                  Get Pilot Access
                </h2>
                <p style={subtitleStyle}>
                  See Cerebro on your firm&apos;s own documents. No commitment.
                </p>
              </div>

              {error && (
                <div style={errorBannerStyle}>
                  <i className="fa-solid fa-exclamation-circle"></i>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleStep1Submit} noValidate>
                {/* Full Name */}
                <div style={formGroupStyle}>
                  <label htmlFor="lcr-fullName" style={labelStyle}>
                    Full Name <span style={{ color: colors.error }}>*</span>
                  </label>
                  <input
                    className="lcr-input"
                    id="lcr-fullName"
                    type="text"
                    value={step1.fullName}
                    onChange={(e) => {
                      setStep1((p) => ({ ...p, fullName: e.target.value }));
                      if (fieldErrors.fullName) setFieldErrors((p) => ({ ...p, fullName: undefined }));
                    }}
                    placeholder="Jane Smith"
                    style={fieldErrors.fullName ? inputErrorStyle : inputStyle}
                    disabled={loading}
                    autoComplete="name"
                    autoFocus
                  />
                  {fieldErrors.fullName && (
                    <div style={fieldErrorStyle}>{fieldErrors.fullName}</div>
                  )}
                </div>

                {/* Email */}
                <div style={formGroupStyle}>
                  <label htmlFor="lcr-email" style={labelStyle}>
                    Email <span style={{ color: colors.error }}>*</span>
                  </label>
                  <input
                    className="lcr-input"
                    id="lcr-email"
                    type="email"
                    value={step1.email}
                    onChange={(e) => {
                      setStep1((p) => ({ ...p, email: e.target.value }));
                      if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
                    }}
                    placeholder="jane@smithlaw.com"
                    style={fieldErrors.email ? inputErrorStyle : inputStyle}
                    disabled={loading}
                    autoComplete="email"
                  />
                  {fieldErrors.email && (
                    <div style={fieldErrorStyle}>{fieldErrors.email}</div>
                  )}
                </div>

                {/* Firm Name */}
                <div style={formGroupStyle}>
                  <label htmlFor="lcr-firmName" style={labelStyle}>
                    Firm Name <span style={{ color: colors.error }}>*</span>
                  </label>
                  <input
                    className="lcr-input"
                    id="lcr-firmName"
                    type="text"
                    value={step1.firmName}
                    onChange={(e) => {
                      setStep1((p) => ({ ...p, firmName: e.target.value }));
                      if (fieldErrors.firmName) setFieldErrors((p) => ({ ...p, firmName: undefined }));
                    }}
                    placeholder="Smith & Associates"
                    style={fieldErrors.firmName ? inputErrorStyle : inputStyle}
                    disabled={loading}
                    autoComplete="organization"
                  />
                  {fieldErrors.firmName && (
                    <div style={fieldErrorStyle}>{fieldErrors.firmName}</div>
                  )}
                </div>

                {/* Phone (optional) */}
                <div style={formGroupStyle}>
                  <label htmlFor="lcr-phone" style={labelStyle}>
                    Phone <span style={{ color: colors.label, fontWeight: 400 }}>(optional)</span>
                  </label>
                  <input
                    className="lcr-input"
                    id="lcr-phone"
                    type="tel"
                    value={step1.phone}
                    onChange={(e) => setStep1((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="(555) 555-1234"
                    style={inputStyle}
                    disabled={loading}
                    autoComplete="tel"
                  />
                </div>

                {/* Submit */}
                <button
                  className="lcr-gold-btn"
                  type="submit"
                  style={loading ? goldBtnDisabledStyle : goldBtnStyle}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span style={spinnerStyle} />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Get Pilot Access
                      <i className="fa-solid fa-arrow-right"></i>
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
                  No spam. Your data stays private.
                </p>
              </form>
            </>
          )}

          {/* -- STEP 2 -- */}
          {step === 2 && (
            <>
              <div style={headerStyle}>
                <div style={successIconStyle}>
                  <i className="fa-solid fa-check"></i>
                </div>
                <h2 id="lcr-title" style={titleStyle}>
                  You&apos;re In
                </h2>
                <p style={subtitleStyle}>
                  Help us tailor the demo to your firm. All fields optional.
                </p>
              </div>

              {error && (
                <div style={errorBannerStyle}>
                  <i className="fa-solid fa-exclamation-circle"></i>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleStep2Submit} noValidate>
                {/* Practice Area */}
                <div style={formGroupStyle}>
                  <label htmlFor="lcr-practiceArea" style={labelStyle}>
                    Practice Area
                  </label>
                  <select
                    className="lcr-input"
                    id="lcr-practiceArea"
                    value={step2.practiceArea}
                    onChange={(e) => setStep2((p) => ({ ...p, practiceArea: e.target.value }))}
                    style={selectStyle}
                    disabled={loading}
                  >
                    <option value="">Select...</option>
                    {PRACTICE_AREAS.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Firm Size */}
                <div style={formGroupStyle}>
                  <label htmlFor="lcr-firmSize" style={labelStyle}>
                    Firm Size
                  </label>
                  <select
                    className="lcr-input"
                    id="lcr-firmSize"
                    value={step2.firmSize}
                    onChange={(e) => setStep2((p) => ({ ...p, firmSize: e.target.value }))}
                    style={selectStyle}
                    disabled={loading}
                  >
                    <option value="">Select...</option>
                    {FIRM_SIZES.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                {/* State */}
                <div style={formGroupStyle}>
                  <label htmlFor="lcr-state" style={labelStyle}>
                    State
                  </label>
                  <input
                    className="lcr-input"
                    id="lcr-state"
                    type="text"
                    value={step2.state}
                    onChange={(e) => setStep2((p) => ({ ...p, state: e.target.value }))}
                    placeholder="e.g. California"
                    style={inputStyle}
                    disabled={loading}
                  />
                </div>

                {/* Current Research Tools */}
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Current Research Tools</label>
                  <div style={checkboxGroupStyle}>
                    {RESEARCH_TOOLS.map((tool) => {
                      const active = step2.currentTools.includes(tool);
                      return (
                        <button
                          key={tool}
                          type="button"
                          className="lcr-tool-btn"
                          style={checkboxBtnStyle(active)}
                          onClick={() => toggleTool(tool)}
                          disabled={loading}
                          aria-pressed={active}
                        >
                          {active && (
                            <i
                              className="fa-solid fa-check"
                              style={{ marginRight: '5px', fontSize: '12px' }}
                            ></i>
                          )}
                          {tool}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Biggest Challenge */}
                <div style={formGroupStyle}>
                  <label htmlFor="lcr-challenge" style={labelStyle}>
                    Biggest Challenge
                  </label>
                  <textarea
                    className="lcr-input"
                    id="lcr-challenge"
                    value={step2.biggestChallenge}
                    onChange={(e) =>
                      setStep2((p) => ({ ...p, biggestChallenge: e.target.value }))
                    }
                    placeholder="What slows your team down the most in legal research?"
                    style={textareaStyle}
                    rows={2}
                    disabled={loading}
                  />
                </div>

                {/* Submit & Book Call */}
                <button
                  className="lcr-gold-btn"
                  type="submit"
                  style={loading ? goldBtnDisabledStyle : goldBtnStyle}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span style={spinnerStyle} />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit &amp; Book Call
                      <i className="fa-solid fa-calendar-check" style={{ fontSize: '14px' }}></i>
                    </>
                  )}
                </button>

                {/* Skip */}
                <button
                  className="lcr-skip-btn"
                  type="button"
                  style={{ ...skipBtnStyle, marginTop: '12px' }}
                  onClick={handleSkip}
                  disabled={loading}
                >
                  Skip — Book Call Now
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default LeadCaptureModal;
