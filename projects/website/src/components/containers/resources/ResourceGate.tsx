import React, { useState, useEffect } from 'react';

const WEBHOOK_URL = 'https://n8n.srv948776.hstgr.cloud/webhook/cerebro-lead';

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
}

interface FormData {
  firstName: string;
  email: string;
  firmName: string;
  practiceArea: string;
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
  });

  const storageKey = `tin_resource_downloaded_${leadMagnetId}`;

  // Check if already unlocked
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      if (stored === 'true') {
        setUnlocked(true);
      }
    }
  }, [storageKey]);

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
        practiceArea: formData.practiceArea || null,
        leadMagnet: leadMagnetId,
        source: 'resource-page',
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
                        href={downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rg-download-btn"
                        style={{
                          ...goldBtnStyle,
                          textDecoration: 'none',
                        }}
                      >
                        <i className="fa-solid fa-download" />
                        Download Now
                      </a>
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
                          <label htmlFor="rg-firstName" style={labelStyle}>
                            First Name <span style={{ color: colors.error }}>*</span>
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
                          />
                          {fieldErrors.firstName && (
                            <div style={fieldErrorMsgStyle}>{fieldErrors.firstName}</div>
                          )}
                        </div>

                        {/* Email */}
                        <div style={formGroupStyle}>
                          <label htmlFor="rg-email" style={labelStyle}>
                            Email <span style={{ color: colors.error }}>*</span>
                          </label>
                          <input
                            className="rg-input"
                            id="rg-email"
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
