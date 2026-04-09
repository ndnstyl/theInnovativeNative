import React, { useState, useEffect, useRef } from 'react';

const WEBHOOK_URL = process.env.NEXT_PUBLIC_LEAD_WEBHOOK_URL || '';

// Minimum time a legit user spends filling the form (milliseconds).
// Below this → silent drop (bot heuristic).
const MIN_FILL_TIME_MS = 2000;

const PRACTICE_AREAS = [
  'Personal Injury',
  'Medical Malpractice',
  'Auto Accident',
  'Workers Compensation',
  'Wrongful Death',
  'Product Liability',
  'Premises Liability',
  'Other',
];

interface ResourceGateProps {
  title: string;
  subtitle: string;
  bullets: string[];
  leadMagnetId: string;
  downloadUrl: string;
  heroImage?: string;
  /**
   * When true, render the newsletter opt-in checkbox in the success state.
   * Defaults to true. Set to false only if a specific page should suppress
   * the offer (no current case — all pages enable it).
   */
  enableNewsletterOptIn?: boolean;
  /**
   * Optional override for the newsletter opt-in label.
   */
  newsletterOptInLabel?: string;
}

interface FormData {
  firstName: string;
  email: string;
  firmName: string;
  practiceArea: string;
  // honeypot — must stay empty; bots typically auto-fill
  website: string;
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

const ResourceGate: React.FC<ResourceGateProps> = ({
  title,
  subtitle,
  bullets,
  leadMagnetId,
  downloadUrl,
  enableNewsletterOptIn = true,
  newsletterOptInLabel = 'Send me the weekly Legal AI Briefing. No spam, unsubscribe anytime.',
}) => {
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    email: '',
    firmName: '',
    practiceArea: '',
    website: '',
  });
  const [newsletterOptIn, setNewsletterOptIn] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState<
    'idle' | 'submitted' | 'error'
  >('idle');

  // Download button ref for focus management after unlock
  const downloadRef = useRef<HTMLAnchorElement>(null);

  // Page load timestamp for bot heuristic
  const pageLoadedAtRef = useRef<number>(
    typeof window !== 'undefined' ? Date.now() : 0
  );

  const storageKey = `tin_resource_downloaded_${leadMagnetId}`;
  const newsletterKey = `tin_resource_newsletter_optin_${leadMagnetId}`;

  // Check if already unlocked and if newsletter opt-in already recorded
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      if (stored === 'true') {
        setUnlocked(true);
      }
      const newsletterStored = localStorage.getItem(newsletterKey);
      if (newsletterStored === 'true') {
        setNewsletterStatus('submitted');
      }
    }
  }, [storageKey, newsletterKey]);

  // Focus the download button when the success state appears (a11y: FR-051)
  useEffect(() => {
    if (unlocked && downloadRef.current) {
      // Slight delay so the DOM is settled and the transition is visible
      const t = window.setTimeout(() => {
        downloadRef.current?.focus();
      }, 100);
      return () => window.clearTimeout(t);
    }
  }, [unlocked]);

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

    if (!WEBHOOK_URL) {
      setError('Form submission is temporarily unavailable. Please try again later.');
      return;
    }

    // Bot heuristic: form filled impossibly fast → silent drop.
    // Mimic success so bots don't iterate, but do NOT POST.
    const elapsed = Date.now() - pageLoadedAtRef.current;
    if (elapsed < MIN_FILL_TIME_MS) {
      // eslint-disable-next-line no-console
      console.warn('[ResourceGate] form submitted too fast, silently dropped');
      localStorage.setItem(storageKey, 'true');
      setUnlocked(true);
      return;
    }

    setLoading(true);

    try {
      // Wire format is snake_case to match the n8n cerebro-lead workflow's
      // field mapping (see specs/036-pi-content-value-system/qa/n8n-cerebro-lead-behavior.md).
      // Prior to 036 this sent camelCase which the workflow dropped silently,
      // producing empty Name/Company/Notes fields in Airtable.
      const payload: Record<string, string | null> = {
        name: formData.firstName.trim(),
        email: formData.email.trim(),
        firm_name: formData.firmName.trim() || null,
        practice_area: formData.practiceArea || null,
        cta_source: leadMagnetId,
        website: formData.website, // honeypot — server silent-drops if non-empty
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

      localStorage.setItem(storageKey, 'true');
      setUnlocked(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Newsletter opt-in submission — fire-and-forget with keepalive so the POST
  // survives page navigation. Silently handled; never blocks the download.
  const handleNewsletterOptIn = async (email: string, firstName: string) => {
    if (!WEBHOOK_URL) return;
    if (newsletterStatus === 'submitted') return;

    try {
      const payload: Record<string, string | null> = {
        name: firstName.trim(),
        email: email.trim(),
        firm_name: formData.firmName.trim() || null,
        practice_area: formData.practiceArea || null,
        cta_source: 'resource-page-newsletter-optin',
        website: '',
        ...getUtmParams(),
        timestamp: new Date().toISOString(),
      };

      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      });

      if (res.ok) {
        localStorage.setItem(newsletterKey, 'true');
        setNewsletterStatus('submitted');
      } else {
        setNewsletterStatus('error');
      }
    } catch {
      setNewsletterStatus('error');
    }
  };

  const onNewsletterCheckboxChange = (checked: boolean) => {
    setNewsletterOptIn(checked);
    if (checked && formData.email && formData.firstName) {
      // Fire the secondary POST immediately so if the user closes the tab
      // right after clicking, the opt-in still persists.
      handleNewsletterOptIn(formData.email, formData.firstName);
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field in fieldErrors) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Inline styles
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

  const goldBtnStyle: React.CSSProperties = {
    width: '100%',
    minHeight: '48px', // a11y: WCAG 2.1 touch target (FR-044)
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
    animation: 'rgSpin 0.6s linear infinite',
  };

  return (
    <>
      <style>{`
        @keyframes rgSpin {
          to { transform: rotate(360deg); }
        }
        .rg-input:focus {
          border-color: ${colors.accent} !important;
          box-shadow: 0 0 0 2px rgba(212, 168, 83, 0.18);
        }
        .rg-gold-btn:hover:not(:disabled) {
          background-color: #c09840 !important;
          transform: translateY(-1px);
        }
        .rg-download-btn:hover {
          background-color: #c09840 !important;
          transform: translateY(-1px);
        }
      `}</style>

      <section className="resource-gate">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="resource-gate__wrapper">
                {/* Left: Value prop */}
                <div className="resource-gate__content">
                  <h1 className="resource-gate__title">{title}</h1>
                  <p className="resource-gate__subtitle">{subtitle}</p>
                  <ul className="resource-gate__bullets">
                    {bullets.map((bullet, idx) => (
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

                {/* Right: Form or Download */}
                <div className="resource-gate__form-panel">
                  {unlocked ? (
                    <div className="resource-gate__unlocked">
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
                        Your resource is ready.
                      </h3>
                      <p
                        style={{
                          color: colors.label,
                          fontSize: '14px',
                          textAlign: 'center',
                          marginBottom: '24px',
                          lineHeight: 1.5,
                        }}
                      >
                        Click below to download your copy.
                      </p>
                      <a
                        ref={downloadRef}
                        href={downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rg-download-btn"
                        style={{
                          ...goldBtnStyle,
                          textDecoration: 'none',
                          minHeight: '44px', // a11y: WCAG touch target (FR-044)
                        }}
                      >
                        <i className="fa-solid fa-download" aria-hidden="true" />
                        Download Now
                      </a>

                      {enableNewsletterOptIn && newsletterStatus !== 'submitted' && (
                        <div
                          style={{
                            marginTop: '28px',
                            paddingTop: '20px',
                            borderTop: `1px solid ${colors.border}`,
                          }}
                        >
                          <label
                            htmlFor="rg-newsletter-optin"
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '10px',
                              cursor: 'pointer',
                              color: colors.text,
                              fontSize: '14px',
                              lineHeight: 1.5,
                              minHeight: '44px', // a11y touch target (FR-044)
                            }}
                          >
                            <input
                              id="rg-newsletter-optin"
                              type="checkbox"
                              checked={newsletterOptIn}
                              onChange={(e) =>
                                onNewsletterCheckboxChange(e.target.checked)
                              }
                              style={{
                                marginTop: '3px',
                                width: '18px',
                                height: '18px',
                                accentColor: colors.accent,
                                cursor: 'pointer',
                                flexShrink: 0,
                              }}
                            />
                            <span>{newsletterOptInLabel}</span>
                          </label>
                          {newsletterStatus === 'error' && (
                            <p
                              role="alert"
                              aria-live="polite"
                              style={{
                                color: colors.error,
                                fontSize: '13px',
                                marginTop: '6px',
                                marginBottom: 0,
                              }}
                            >
                              Couldn&apos;t save your preference. Try{' '}
                              <a
                                href="/newsletter"
                                style={{ color: colors.accent }}
                              >
                                /newsletter
                              </a>{' '}
                              directly.
                            </p>
                          )}
                        </div>
                      )}

                      {enableNewsletterOptIn && newsletterStatus === 'submitted' && (
                        <p
                          style={{
                            marginTop: '20px',
                            paddingTop: '16px',
                            borderTop: `1px solid ${colors.border}`,
                            color: colors.success,
                            fontSize: '13px',
                            textAlign: 'center',
                            marginBottom: 0,
                          }}
                        >
                          <i
                            className="fa-solid fa-check"
                            aria-hidden="true"
                            style={{ marginRight: '6px' }}
                          />
                          You&apos;re on the Legal AI Briefing list. First issue arrives tomorrow morning.
                        </p>
                      )}
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
                        Get instant access
                      </h3>
                      <p
                        style={{
                          color: colors.label,
                          fontSize: '14px',
                          margin: '0 0 20px',
                          lineHeight: 1.5,
                        }}
                      >
                        Enter your details below.
                      </p>

                      <div
                        role="alert"
                        aria-live="polite"
                        aria-atomic="true"
                      >
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
                            <i
                              className="fa-solid fa-exclamation-circle"
                              aria-hidden="true"
                            />
                            <span>{error}</span>
                          </div>
                        )}
                      </div>

                      <form onSubmit={handleSubmit} noValidate>
                        {/* Honeypot — hidden from users, bots autofill.
                            Server-side check in n8n cerebro-lead workflow
                            silently drops submissions with non-empty value. */}
                        <input
                          type="text"
                          name="website"
                          value={formData.website}
                          onChange={(e) => updateField('website', e.target.value)}
                          tabIndex={-1}
                          autoComplete="off"
                          aria-hidden="true"
                          style={{
                            position: 'absolute',
                            left: '-9999px',
                            width: '1px',
                            height: '1px',
                            opacity: 0,
                            pointerEvents: 'none',
                          }}
                        />
                        {/* First Name */}
                        <div style={formGroupStyle}>
                          <label htmlFor="rg-firstName" style={labelStyle}>
                            First Name <span style={{ color: colors.error }} aria-label="required">*</span>
                          </label>
                          <input
                            className="rg-input"
                            id="rg-firstName"
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => updateField('firstName', e.target.value)}
                            placeholder="Jane"
                            style={fieldErrors.firstName ? inputErrorStyle : inputStyle}
                            disabled={loading}
                            autoComplete="given-name"
                            required
                            aria-required="true"
                            aria-invalid={fieldErrors.firstName ? 'true' : 'false'}
                            aria-describedby={
                              fieldErrors.firstName ? 'rg-firstName-error' : undefined
                            }
                          />
                          {fieldErrors.firstName && (
                            <div
                              id="rg-firstName-error"
                              role="alert"
                              aria-live="polite"
                              style={fieldErrorMsgStyle}
                            >
                              {fieldErrors.firstName}
                            </div>
                          )}
                        </div>

                        {/* Email */}
                        <div style={formGroupStyle}>
                          <label htmlFor="rg-email" style={labelStyle}>
                            Email <span style={{ color: colors.error }} aria-label="required">*</span>
                          </label>
                          <input
                            className="rg-input"
                            id="rg-email"
                            type="email"
                            inputMode="email"
                            value={formData.email}
                            onChange={(e) => updateField('email', e.target.value)}
                            placeholder="jane@smithlaw.com"
                            style={fieldErrors.email ? inputErrorStyle : inputStyle}
                            disabled={loading}
                            autoComplete="email"
                            required
                            aria-required="true"
                            aria-invalid={fieldErrors.email ? 'true' : 'false'}
                            aria-describedby={
                              fieldErrors.email ? 'rg-email-error' : undefined
                            }
                          />
                          {fieldErrors.email && (
                            <div
                              id="rg-email-error"
                              role="alert"
                              aria-live="polite"
                              style={fieldErrorMsgStyle}
                            >
                              {fieldErrors.email}
                            </div>
                          )}
                        </div>

                        {/* Firm Name */}
                        <div style={formGroupStyle}>
                          <label htmlFor="rg-firmName" style={labelStyle}>
                            Firm Name
                          </label>
                          <input
                            className="rg-input"
                            id="rg-firmName"
                            type="text"
                            value={formData.firmName}
                            onChange={(e) => updateField('firmName', e.target.value)}
                            placeholder="Smith & Associates"
                            style={inputStyle}
                            disabled={loading}
                            autoComplete="organization"
                          />
                        </div>

                        {/* Practice Area */}
                        <div style={formGroupStyle}>
                          <label htmlFor="rg-practiceArea" style={labelStyle}>
                            Practice Area
                          </label>
                          <select
                            className="rg-input"
                            id="rg-practiceArea"
                            value={formData.practiceArea}
                            onChange={(e) => updateField('practiceArea', e.target.value)}
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

                        {/* Submit */}
                        <button
                          className="rg-gold-btn"
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
                              Get Free Access
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

export default ResourceGate;
