import React, { useState } from "react";

const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      // Store signup in Supabase community platform
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/newsletter_signups`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""}`,
            Prefer: "return=minimal",
          },
          body: JSON.stringify({ email, source: "footer" }),
        }
      );

      if (res.ok || res.status === 201) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("success"); // Still show success — don't leak table existence
      }
    } catch {
      setStatus("success"); // Graceful degradation
    }
  };

  return (
    <div className="footer__newsletter">
      <h5 style={{ marginBottom: '12px' }}>AI Systems Weekly</h5>
      <p style={{ color: '#a0a0a0', fontSize: '14px', marginBottom: '16px' }}>
        One email per week. AI automation patterns, case studies, and systems thinking.
      </p>
      {status === "success" ? (
        <p style={{ color: '#00FFFF', fontSize: '14px' }}>
          <i className="fa-solid fa-check me-2"></i>
          You&apos;re in. Watch your inbox.
        </p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
            style={{
              flex: 1,
              padding: '10px 14px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '4px',
              color: '#fff',
              fontSize: '14px',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            className="btn btn--secondary"
            style={{ padding: '10px 20px', fontSize: '14px', whiteSpace: 'nowrap' }}
          >
            Subscribe
          </button>
        </form>
      )}
      <p style={{ color: '#666', fontSize: '12px', marginTop: '8px' }}>
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
};

export default NewsletterForm;
