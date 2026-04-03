import { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/common/SEO';
import Link from 'next/link';
import { useToast } from '@/components/common/ToastProvider';
import { logger } from '@/lib/logger';

const WEBHOOK_URL = process.env.NEXT_PUBLIC_LEAD_WEBHOOK_URL || 'https://n8n.srv948776.hstgr.cloud/webhook/cerebro-lead';

export default function AIPrivilegeRiskChecklist() {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [firmName, setFirmName] = useState('');
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState('');
  const submitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !email.trim() || !firmName.trim()) {
      setError('All fields are required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    // Safety net: force-reset loading after 10 seconds
    if (submitTimeoutRef.current) clearTimeout(submitTimeoutRef.current);
    submitTimeoutRef.current = setTimeout(() => {
      setLoading(false);
      showToast('This is taking longer than expected. Please try again.', 'warning');
    }, 10000);

    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          firmName: firmName.trim(),
          ctaSource: 'ai-privilege-risk-checklist',
          capturedAt: new Date().toISOString(),
          step: 1,
        }),
      });
      setUnlocked(true);
      showToast('Checklist unlocked!', 'success');
    } catch (err) {
      logger.error('Checklist', 'submit', err);
      setError('Something went wrong. Please try again.');
      showToast('Something went wrong. Try again.', 'error');
    } finally {
      if (submitTimeoutRef.current) clearTimeout(submitTimeoutRef.current);
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="AI Privilege Risk Checklist for Law Firms | Free Download"
        description="Assess whether your firm's AI tools put attorney-client privilege at risk. Based on the US v. Heppner ruling (SDNY, Feb 2026). Free, takes 5 minutes."
        url="/checklist/ai-privilege-risk"
        keywords={['AI', 'attorney-client privilege', 'Heppner', 'law firm', 'checklist', 'compliance', 'legal AI']}
      />

      <Layout header={1} footer={1} video={false}>
        <section style={{ padding: '120px 0 80px' }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-lg-8">

                {/* Breadcrumb */}
                <nav style={{ marginBottom: '30px', fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>
                  <Link href="/blog" style={{ color: '#00ffff', textDecoration: 'none' }}>Blog</Link>
                  <span style={{ margin: '0 10px' }}>/</span>
                  <Link href="/blog/us-v-heppner-law-firm-ai-privilege" style={{ color: '#00ffff', textDecoration: 'none' }}>Heppner Analysis</Link>
                  <span style={{ margin: '0 10px' }}>/</span>
                  <span>Checklist</span>
                </nav>

                {/* Hero */}
                <div style={{ marginBottom: '48px' }}>
                  <div style={{
                    display: 'inline-block',
                    padding: '6px 14px',
                    background: 'rgba(255, 68, 68, 0.15)',
                    border: '1px solid rgba(255, 68, 68, 0.3)',
                    borderRadius: '4px',
                    fontSize: '13px',
                    color: '#ff6b6b',
                    fontWeight: 600,
                    marginBottom: '20px',
                  }}>
                    BASED ON US v. HEPPNER (SDNY, FEB 2026)
                  </div>

                  <h1 style={{
                    fontSize: 'clamp(28px, 5vw, 42px)',
                    fontWeight: 700,
                    lineHeight: 1.2,
                    color: '#fff',
                    marginBottom: '20px',
                  }}>
                    AI Privilege Risk Checklist
                  </h1>

                  <p style={{
                    fontSize: '1.15em',
                    lineHeight: 1.7,
                    color: 'rgba(255,255,255,0.75)',
                    marginBottom: '12px',
                  }}>
                    A federal judge ruled that documents created through consumer AI are <strong style={{ color: '#fff' }}>not protected by attorney-client privilege</strong>. This checklist helps you assess whether your firm is exposed.
                  </p>

                  <div style={{
                    display: 'flex',
                    gap: '24px',
                    flexWrap: 'wrap',
                    fontSize: '14px',
                    color: 'rgba(255,255,255,0.5)',
                    marginTop: '16px',
                  }}>
                    <span><i className="fa-regular fa-clock" style={{ marginRight: '6px' }}></i>5 minutes to complete</span>
                    <span><i className="fa-regular fa-file-lines" style={{ marginRight: '6px' }}></i>7 audit questions</span>
                    <span><i className="fa-solid fa-scale-balanced" style={{ marginRight: '6px' }}></i>Actionable next steps</span>
                  </div>
                </div>

                {/* What You'll Get (visible to everyone) */}
                <div style={{
                  padding: '28px',
                  background: 'rgba(0,255,255,0.04)',
                  border: '1px solid rgba(0,255,255,0.12)',
                  borderRadius: '12px',
                  marginBottom: '40px',
                }}>
                  <h3 style={{ color: '#00ffff', fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
                    What This Checklist Covers
                  </h3>
                  <ul style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, paddingLeft: '20px', marginBottom: 0 }}>
                    <li><strong style={{ color: '#fff' }}>7 diagnostic questions</strong> to assess your firm&apos;s AI privilege exposure</li>
                    <li><strong style={{ color: '#fff' }}>Risk classification framework</strong> (High / Medium / Lower) based on Heppner reasoning</li>
                    <li><strong style={{ color: '#fff' }}>Tool-by-tool analysis</strong> — which AI tools waive privilege and which don&apos;t</li>
                    <li><strong style={{ color: '#fff' }}>4-step action plan</strong> to implement before your next filing</li>
                    <li><strong style={{ color: '#fff' }}>ABA ethics alignment</strong> — how to satisfy Formal Opinion 512 after Heppner</li>
                    <li><strong style={{ color: '#fff' }}>Template AI policy language</strong> you can adapt for your firm today</li>
                  </ul>
                </div>

                {/* Gate: Form OR Content */}
                {!unlocked ? (
                  <div style={{
                    padding: '40px',
                    background: 'linear-gradient(135deg, rgba(0,255,255,0.06) 0%, rgba(0,80,160,0.06) 100%)',
                    border: '2px solid rgba(0,255,255,0.2)',
                    borderRadius: '16px',
                  }}>
                    <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>
                      Get the Full Checklist
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: '28px', fontSize: '15px' }}>
                      Enter your details below. The checklist appears instantly — no email required to confirm, no spam.
                    </p>

                    {error && (
                      <div style={{
                        background: 'rgba(229,83,75,0.12)',
                        border: '1px solid #e5534b',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        color: '#e5534b',
                        fontSize: '14px',
                        marginBottom: '18px',
                      }}>
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleSubmit}>
                      <div style={{ marginBottom: '16px' }}>
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          disabled={loading}
                          style={{
                            width: '100%',
                            padding: '14px 16px',
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '15px',
                            outline: 'none',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>
                      <div style={{ marginBottom: '16px' }}>
                        <input
                          type="email"
                          placeholder="Work Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={loading}
                          style={{
                            width: '100%',
                            padding: '14px 16px',
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '15px',
                            outline: 'none',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>
                      <div style={{ marginBottom: '24px' }}>
                        <input
                          type="text"
                          placeholder="Firm Name"
                          value={firmName}
                          onChange={(e) => setFirmName(e.target.value)}
                          disabled={loading}
                          style={{
                            width: '100%',
                            padding: '14px 16px',
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '15px',
                            outline: 'none',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        style={{
                          width: '100%',
                          padding: '16px',
                          background: '#00ffff',
                          color: '#000',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '16px',
                          fontWeight: 700,
                          cursor: loading ? 'not-allowed' : 'pointer',
                          opacity: loading ? 0.7 : 1,
                        }}
                      >
                        {loading ? 'Unlocking...' : 'Get the Checklist — Free'}
                      </button>
                      <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '12px', marginBottom: 0 }}>
                        No spam. No sales calls unless you ask. Your data stays private.
                      </p>
                    </form>
                  </div>
                ) : (
                  /* ========== UNLOCKED CHECKLIST CONTENT ========== */
                  <div style={{ animation: 'fadeIn 0.5s ease-out' }}>

                    <div style={{
                      padding: '16px 20px',
                      background: 'rgba(63,185,80,0.1)',
                      border: '1px solid rgba(63,185,80,0.3)',
                      borderRadius: '8px',
                      marginBottom: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}>
                      <i className="fa-solid fa-circle-check" style={{ color: '#3fb950', fontSize: '20px' }}></i>
                      <span style={{ color: '#3fb950', fontWeight: 600 }}>Checklist unlocked. Bookmark this page — it&apos;s yours to keep.</span>
                    </div>

                    {/* ===== SECTION 1: THE 7 QUESTIONS ===== */}
                    <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: 700, marginBottom: '24px' }}>
                      Part 1: The 7 Diagnostic Questions
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: '28px', lineHeight: 1.7 }}>
                      Answer each question honestly. If you answer &quot;Yes&quot; to 3 or more, your firm has significant privilege exposure that needs immediate attention.
                    </p>

                    {[
                      {
                        q: 'Are any attorneys or staff using free/personal AI accounts (ChatGPT, Claude, Gemini, Copilot) for work involving client matters?',
                        why: 'Under Heppner, consumer AI ToS permit data logging, model training, and third-party disclosure. Information submitted through these tools may not maintain the confidentiality required for privilege.',
                        risk: 'HIGH',
                      },
                      {
                        q: 'Has your firm reviewed the Terms of Service and Privacy Policy of every AI tool in use?',
                        why: 'Judge Rakoff\'s analysis centered on whether the ToS "undermined confidentiality." If you haven\'t read the ToS, you can\'t assess whether privilege survives.',
                        risk: 'HIGH',
                      },
                      {
                        q: 'Does your firm have a written AI Acceptable Use Policy that distinguishes between approved and prohibited tools?',
                        why: '43% of firms have no AI policy. Without one, individual attorneys are making privilege-risk decisions without guidance — and your firm bears the liability.',
                        risk: 'HIGH',
                      },
                      {
                        q: 'Are attorneys copy-pasting client facts, case details, or privileged communications into AI tools?',
                        why: 'Every input to a consumer AI tool is a potential privilege waiver. The content doesn\'t need to be a complete document — even partial facts or client identifiers may be sufficient.',
                        risk: 'HIGH',
                      },
                      {
                        q: 'Does your firm use enterprise AI agreements with contractual confidentiality protections?',
                        why: 'Enterprise agreements that contractually prohibit data logging and training reduce (but may not eliminate) Heppner-style risk. The key is whether the vendor\'s obligations align with privilege requirements.',
                        risk: 'MEDIUM',
                      },
                      {
                        q: 'Can your firm produce an audit trail showing what AI tools were used for each matter?',
                        why: 'If opposing counsel challenges your work product on privilege grounds citing Heppner, you need documentation. Courts are increasingly requiring AI usage attestations in filings.',
                        risk: 'MEDIUM',
                      },
                      {
                        q: 'Has your firm conducted AI-specific training within the last 12 months?',
                        why: 'ABA Formal Opinion 512 requires attorneys to "understand how the tool works." Fewer than half of firms provide training on responsible AI use. Ignorance is not a defense.',
                        risk: 'MEDIUM',
                      },
                    ].map((item, i) => (
                      <div key={i} style={{
                        padding: '24px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '10px',
                        marginBottom: '16px',
                      }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                          <div style={{
                            flexShrink: 0,
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'rgba(0,255,255,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#00ffff',
                            fontWeight: 700,
                            fontSize: '14px',
                          }}>
                            {i + 1}
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ color: '#fff', fontWeight: 600, fontSize: '16px', marginBottom: '8px', lineHeight: 1.5 }}>
                              {item.q}
                            </p>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: 1.6, marginBottom: '8px' }}>
                              <strong>Why it matters:</strong> {item.why}
                            </p>
                            <span style={{
                              display: 'inline-block',
                              padding: '3px 10px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: 600,
                              background: item.risk === 'HIGH' ? 'rgba(255,68,68,0.15)' : 'rgba(255,170,0,0.15)',
                              color: item.risk === 'HIGH' ? '#ff6b6b' : '#ffaa00',
                              border: `1px solid ${item.risk === 'HIGH' ? 'rgba(255,68,68,0.3)' : 'rgba(255,170,0,0.3)'}`,
                            }}>
                              {item.risk} RISK
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* ===== SECTION 2: RISK CLASSIFICATION ===== */}
                    <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: 700, marginTop: '48px', marginBottom: '24px' }}>
                      Part 2: Tool Risk Classification
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: '28px', lineHeight: 1.7 }}>
                      Not all AI tools carry the same privilege risk. The Heppner analysis turns on the <strong style={{ color: '#fff' }}>terms of service</strong> — specifically whether the vendor can log, train on, or disclose your data.
                    </p>

                    <div style={{ overflowX: 'auto', marginBottom: '32px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid rgba(0,255,255,0.3)' }}>
                            <th style={{ textAlign: 'left', padding: '14px', color: '#00ffff', fontSize: '14px' }}>Risk</th>
                            <th style={{ textAlign: 'left', padding: '14px', color: '#00ffff', fontSize: '14px' }}>Tool Category</th>
                            <th style={{ textAlign: 'left', padding: '14px', color: '#00ffff', fontSize: '14px' }}>Examples</th>
                            <th style={{ textAlign: 'left', padding: '14px', color: '#00ffff', fontSize: '14px' }}>Heppner Exposure</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            <td style={{ padding: '14px', color: '#ff6b6b', fontWeight: 600 }}>HIGH</td>
                            <td style={{ padding: '14px', color: 'rgba(255,255,255,0.8)' }}>Consumer AI (free/personal)</td>
                            <td style={{ padding: '14px', color: 'rgba(255,255,255,0.6)' }}>ChatGPT Free/Plus, Claude Free, Gemini, Copilot</td>
                            <td style={{ padding: '14px', color: 'rgba(255,255,255,0.6)' }}>ToS permits logging + training + disclosure. Directly within Heppner reasoning.</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            <td style={{ padding: '14px', color: '#ffaa00', fontWeight: 600 }}>MEDIUM</td>
                            <td style={{ padding: '14px', color: 'rgba(255,255,255,0.8)' }}>Enterprise AI (shared cloud)</td>
                            <td style={{ padding: '14px', color: 'rgba(255,255,255,0.6)' }}>Harvey AI, ChatGPT Enterprise, Claude for Business</td>
                            <td style={{ padding: '14px', color: 'rgba(255,255,255,0.6)' }}>Contractual protections reduce risk. Verify no-training clauses. Shared infrastructure remains a factor.</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            <td style={{ padding: '14px', color: '#3fb950', fontWeight: 600 }}>LOWER</td>
                            <td style={{ padding: '14px', color: 'rgba(255,255,255,0.8)' }}>Private, firm-isolated AI</td>
                            <td style={{ padding: '14px', color: 'rgba(255,255,255,0.6)' }}>Self-hosted models, private RAG, on-premise deployments</td>
                            <td style={{ padding: '14px', color: 'rgba(255,255,255,0.6)' }}>No third-party ToS applies. Data never leaves firm control. Heppner analysis does not apply.</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* ===== SECTION 3: ACTION PLAN ===== */}
                    <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: 700, marginTop: '48px', marginBottom: '24px' }}>
                      Part 3: Your 4-Step Action Plan
                    </h2>

                    {[
                      {
                        step: '1',
                        title: 'Audit all AI tools in use at your firm (this week)',
                        detail: 'Survey every attorney, paralegal, and staff member. Ask: What AI tools are you using? Are you inputting client information? Is there an enterprise agreement? Document everything — you need a baseline before you can mitigate.',
                      },
                      {
                        step: '2',
                        title: 'Classify each tool by privilege risk (this week)',
                        detail: 'Use the risk framework above. For each tool, read the Terms of Service and look for: data retention policies, model training clauses, third-party disclosure provisions. If the ToS permits any of these, the tool is HIGH or MEDIUM risk under Heppner.',
                      },
                      {
                        step: '3',
                        title: 'Implement an AI Acceptable Use Policy (within 30 days)',
                        detail: 'At minimum, your policy should include: approved tool list, prohibited inputs (no client PII in consumer AI), verification requirements for AI output, disclosure obligations, and training requirements. The North Carolina Bar Association published an excellent framework.',
                      },
                      {
                        step: '4',
                        title: 'Evaluate privilege-safe infrastructure (within 60 days)',
                        detail: 'For firms that want to use AI for case research without privilege risk: private RAG systems running on firm-isolated databases eliminate the Heppner concern entirely. No third-party ToS, no data training, no privilege waiver. The technology exists today.',
                      },
                    ].map((item) => (
                      <div key={item.step} style={{
                        padding: '24px',
                        background: 'rgba(0,255,255,0.03)',
                        border: '1px solid rgba(0,255,255,0.1)',
                        borderRadius: '10px',
                        marginBottom: '16px',
                        display: 'flex',
                        gap: '20px',
                        alignItems: 'flex-start',
                      }}>
                        <div style={{
                          flexShrink: 0,
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          background: 'rgba(0,255,255,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#00ffff',
                          fontWeight: 700,
                          fontSize: '18px',
                        }}>
                          {item.step}
                        </div>
                        <div>
                          <h4 style={{ color: '#fff', fontWeight: 600, fontSize: '16px', marginBottom: '8px' }}>{item.title}</h4>
                          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '15px', lineHeight: 1.7, marginBottom: 0 }}>{item.detail}</p>
                        </div>
                      </div>
                    ))}

                    {/* ===== SECTION 4: TEMPLATE POLICY LANGUAGE ===== */}
                    <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: 700, marginTop: '48px', marginBottom: '24px' }}>
                      Part 4: Template AI Policy Language
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: '20px', lineHeight: 1.7 }}>
                      Copy and adapt the following for your firm&apos;s AI Acceptable Use Policy:
                    </p>

                    <div style={{
                      padding: '24px',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      marginBottom: '32px',
                      fontFamily: 'Georgia, serif',
                      fontSize: '15px',
                      lineHeight: 1.8,
                      color: 'rgba(255,255,255,0.8)',
                    }}>
                      <p><strong style={{ color: '#fff' }}>Section [X]: Artificial Intelligence Usage</strong></p>
                      <p><strong>1. Approved Tools.</strong> Attorneys and staff may use AI tools for firm work only if the tool appears on the Firm&apos;s Approved AI Tools List, maintained by [Managing Partner / IT]. Consumer-grade AI tools (including free or personal accounts for ChatGPT, Claude, Gemini, Copilot, or similar services) are <u>prohibited</u> for any use involving client information, case strategy, privileged communications, or work product.</p>
                      <p><strong>2. Prohibited Inputs.</strong> Under no circumstances shall any attorney or staff member input the following into any AI tool not on the Approved List: (a) client names or identifying information; (b) case facts, legal theories, or strategy; (c) privileged communications; (d) financial data, settlement figures, or billing information; (e) any document subject to attorney-client privilege or work product protection.</p>
                      <p><strong>3. Verification.</strong> All AI-generated output must be independently verified before inclusion in any filing, correspondence, or client deliverable. Citation of cases, statutes, or regulatory materials must be confirmed through primary sources.</p>
                      <p><strong>4. Disclosure.</strong> Use of AI tools must be disclosed in accordance with applicable court rules and jurisdictional requirements. [Reference applicable local rules.]</p>
                      <p style={{ marginBottom: 0 }}><strong>5. Training.</strong> All attorneys must complete [X] hours of AI competency training annually, consistent with ABA Formal Opinion 512 and [State] Bar requirements.</p>
                    </div>

                    {/* ===== CTA ===== */}
                    <div style={{
                      padding: '40px',
                      background: 'linear-gradient(135deg, rgba(0,255,255,0.1) 0%, rgba(0,80,160,0.1) 100%)',
                      border: '2px solid rgba(0,255,255,0.25)',
                      borderRadius: '16px',
                      textAlign: 'center',
                      marginTop: '48px',
                    }}>
                      <h3 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>
                        Need Help Implementing This?
                      </h3>
                      <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '24px', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
                        We help law firms implement AI governance frameworks and deploy privilege-safe research infrastructure. Free 30-minute assessment.
                      </p>
                      <a
                        href="/law-firm-rag#pricing"
                        style={{
                          display: 'inline-block',
                          padding: '14px 36px',
                          background: '#00ffff',
                          color: '#000',
                          fontWeight: 700,
                          fontSize: '16px',
                          textDecoration: 'none',
                          borderRadius: '8px',
                        }}
                      >
                        Book a Free Assessment
                      </a>
                    </div>

                    {/* Sources */}
                    <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                      <h3 style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', marginBottom: '12px' }}>Sources</h3>
                      <ul style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', lineHeight: 2, paddingLeft: '20px' }}>
                        <li><a href="https://harvardlawreview.org/blog/2026/03/united-states-v-heppner/" target="_blank" rel="noopener noreferrer" style={{ color: '#00ffff' }}>Harvard Law Review — US v. Heppner</a></li>
                        <li><a href="https://www.gibsondunn.com/ai-privilege-waivers-sdny-rules-against-privilege-protection-for-consumer-ai-outputs/" target="_blank" rel="noopener noreferrer" style={{ color: '#00ffff' }}>Gibson Dunn — SDNY Privilege Ruling</a></li>
                        <li><a href="https://hai.stanford.edu/news/ai-trial-legal-models-hallucinate-1-out-6-or-more-benchmarking-queries" target="_blank" rel="noopener noreferrer" style={{ color: '#00ffff' }}>Stanford HAI — Legal AI Hallucination Study</a></li>
                        <li><a href="https://www.lawnext.com/2026/03/ai-adoption-among-legal-professionals-has-more-than-doubled-in-a-year-new-8am-report-finds-but-firms-lag-far-behind-individual-practitioners.html" target="_blank" rel="noopener noreferrer" style={{ color: '#00ffff' }}>8am 2026 Legal Industry Report</a></li>
                      </ul>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </section>

        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
          input:focus {
            border-color: rgba(0,255,255,0.4) !important;
            box-shadow: 0 0 0 2px rgba(0,255,255,0.1);
          }
        `}</style>
      </Layout>
    </>
  );
}
