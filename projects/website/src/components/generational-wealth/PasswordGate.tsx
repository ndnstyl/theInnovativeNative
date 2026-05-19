import React, { useState, useEffect } from "react";

interface PasswordGateProps {
  children: React.ReactNode;
}

const HASH = "4384e878fb7e6bbac4bae94276690b5eb56bf5522cad43c5431f9ff90da26596";
const SALT = "gw-tribe-2026";
const LS_UNLOCKED = "gw_unlocked";
const LS_UNLOCKED_AT = "gw_unlocked_at";
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

async function hashPassword(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(SALT + ":" + input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function isUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  const flag = localStorage.getItem(LS_UNLOCKED);
  const ts = localStorage.getItem(LS_UNLOCKED_AT);
  if (flag !== "true" || !ts) return false;
  return Date.now() - parseInt(ts, 10) < THIRTY_DAYS_MS;
}

const PREVIEW_SECTIONS = [
  { title: "EQIP & Cost-Share Programs", desc: "How the USDA reimburses 75-90% of land clearing, fencing, and pond costs" },
  { title: "Budget & Financing Paths", desc: "The full $272K breakdown and three ways to fund the build" },
  { title: "Due Diligence Checklists", desc: "Every step before signing — printable, trackable, mistake-proof" },
  { title: "Contacts & Resources", desc: "Phone numbers, agencies, foresters, and lenders — all click-to-call" },
  { title: "Quarter-by-Quarter Timeline", desc: "From first land search through Year 5 food production" },
  { title: "Plain-English Glossary", desc: "Every acronym and term defined so nothing feels confusing" },
];

const PREVIEW_PHASE2 = [
  "Barndominium Build Guide",
  "Off-Grid Systems (Solar, Water, Septic)",
  "Food Production & Aquaponics",
  "The Family Compound Plan",
  "Oklahoma vs Texas Comparison",
  "Risk Management & Edge Cases",
  "Legal Structures & Estate Planning",
  "Ag Business & Tax Strategy",
];

const PasswordGate = ({ children }: PasswordGateProps) => {
  const [unlocked, setUnlocked] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isUnlocked()) {
      setUnlocked(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const hashed = await hashPassword(password);

    if (hashed === HASH) {
      localStorage.setItem(LS_UNLOCKED, "true");
      localStorage.setItem(LS_UNLOCKED_AT, String(Date.now()));
      setUnlocked(true);
    } else {
      setError("That’s not it — ask Mike for the password");
      setLoading(false);
    }
  };

  const showContent = mounted && unlocked;
  const showGate = mounted && !unlocked;

  return (
    <>
      {/* Content always in the DOM so Pagefind can index it at build time.
          Hidden via CSS when not unlocked. This exposes content in view-source
          but the existing gate is already a client-side-only check. */}
      <div
        className={`gw-gate-content${showContent ? "" : " gw-gate-content--hidden"}`}
        aria-hidden={!showContent}
      >
        {children}
      </div>

      {showGate && (
        <div className="gw-gate-landing" data-pagefind-ignore>
          {/* Hero Section */}
          <div className="gw-gate-landing__hero">
            <div className="gw-gate-landing__hero-overlay" />
            <div className="gw-gate-landing__hero-content">
              <p className="gw-gate-landing__eyebrow">A Private Family Resource</p>
              <h1 className="gw-gate-landing__headline">
                Claim the Land.<br />Build the Village.
              </h1>
              <p className="gw-gate-landing__subheadline">
                Everything our family needs to buy rural land, clear it with government
                cost-share programs, build a homestead from the ground up, and create
                wealth that outlasts us &mdash; all in one place.
              </p>

              {/* Stats Row */}
              <div className="gw-gate-landing__stats">
                <div className="gw-gate-landing__stat">
                  <span className="gw-gate-landing__stat-value">25 acres</span>
                  <span className="gw-gate-landing__stat-label">Target land</span>
                </div>
                <div className="gw-gate-landing__stat">
                  <span className="gw-gate-landing__stat-value">$275K</span>
                  <span className="gw-gate-landing__stat-label">Total budget</span>
                </div>
                <div className="gw-gate-landing__stat">
                  <span className="gw-gate-landing__stat-value">90% DIY</span>
                  <span className="gw-gate-landing__stat-label">Our hands</span>
                </div>
                <div className="gw-gate-landing__stat">
                  <span className="gw-gate-landing__stat-value">4 years</span>
                  <span className="gw-gate-landing__stat-label">To self-sustaining</span>
                </div>
              </div>
            </div>
          </div>

          {/* What's Inside Preview */}
          <div className="gw-gate-landing__body">
            <div className="gw-gate-landing__container">

              {/* Password Section */}
              <div className="gw-gate-landing__access">
                <div className="gw-gate-landing__access-card">
                  <h2 className="gw-gate-landing__access-heading">This is for the tribe.</h2>
                  <p className="gw-gate-landing__access-sub">
                    This resource is password-protected. If Mike invited you here,
                    enter the password he gave you.
                  </p>
                  <form onSubmit={handleSubmit} className="gw-gate-landing__form">
                    <input
                      type="password"
                      className={`gw-gate-landing__input${error ? " gw-gate-landing__input--error" : ""}`}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="gw-gate-landing__btn"
                      disabled={loading || !password}
                    >
                      {loading ? "Checking…" : "Let me in"}
                    </button>
                  </form>
                  {error && <p className="gw-gate-landing__error">{error}</p>}
                </div>
              </div>

              {/* Section Preview Grid */}
              <div className="gw-gate-landing__preview-section">
                <h2 className="gw-gate-landing__section-title">What&rsquo;s Inside</h2>
                <p className="gw-gate-landing__section-desc">
                  Step-by-step guides, interactive checklists, government program
                  breakdowns, contact directories, and a full timeline &mdash; written
                  in plain English for people who&rsquo;ve never done any of this before.
                </p>

                <div className="gw-gate-landing__preview-grid">
                  {PREVIEW_SECTIONS.map((s) => (
                    <div key={s.title} className="gw-gate-landing__preview-card">
                      <h3 className="gw-gate-landing__preview-card-title">{s.title}</h3>
                      <p className="gw-gate-landing__preview-card-desc">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Phase 2 Coming Soon */}
              <div className="gw-gate-landing__coming-section">
                <h2 className="gw-gate-landing__section-title">Also Coming</h2>
                <p className="gw-gate-landing__section-desc">
                  These guides are being written as we go through the journey.
                  They&rsquo;ll be ready when we need them.
                </p>
                <div className="gw-gate-landing__coming-grid">
                  {PREVIEW_PHASE2.map((title) => (
                    <div key={title} className="gw-gate-landing__coming-tag">{title}</div>
                  ))}
                </div>
              </div>

              {/* Mission / Emotional Close */}
              <div className="gw-gate-landing__mission">
                <blockquote className="gw-gate-landing__quote">
                  &ldquo;We&rsquo;re not just buying property. We&rsquo;re building a
                  foundation that our children and their children can stand on. Every
                  decision in here is made with the next generation in mind.&rdquo;
                </blockquote>
                <p className="gw-gate-landing__quote-attr">&mdash; Mike</p>
              </div>

              {/* Bottom Password Repeat */}
              <div className="gw-gate-landing__access gw-gate-landing__access--bottom">
                <div className="gw-gate-landing__access-card">
                  <h2 className="gw-gate-landing__access-heading">Ready to get started?</h2>
                  <p className="gw-gate-landing__access-sub">
                    Enter the password to unlock the full resource.
                  </p>
                  <form onSubmit={handleSubmit} className="gw-gate-landing__form">
                    <input
                      type="password"
                      className={`gw-gate-landing__input${error ? " gw-gate-landing__input--error" : ""}`}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                    <button
                      type="submit"
                      className="gw-gate-landing__btn"
                      disabled={loading || !password}
                    >
                      {loading ? "Checking…" : "Let me in"}
                    </button>
                  </form>
                  {error && <p className="gw-gate-landing__error">{error}</p>}
                </div>
              </div>

              {/* Legal */}
              <div className="gw-gate-landing__legal">
                <p>
                  This is a private family resource. All content is educational &mdash;
                  not legal, financial, or tax advice. Consult licensed professionals
                  before making decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PasswordGate;
