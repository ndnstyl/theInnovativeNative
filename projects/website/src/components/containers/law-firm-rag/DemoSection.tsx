import React, { useState } from "react";
import Image from "next/image";
import star from "public/images/star.png";
import { CerebroApp } from "@/components/cerebro";

interface DemoSectionProps {
  openCalendly: () => void;
}

const DEMO_QUERIES = [
  {
    label: "Relief from Stay",
    query: "How do we argue relief from stay under 362(d)?",
    practiceArea: "bankruptcy" as const,
    icon: "fa-solid fa-gavel",
  },
  {
    label: "Miranda Rights",
    query: "What are the requirements for a valid Miranda warning?",
    practiceArea: "criminal_procedure" as const,
    icon: "fa-solid fa-scale-balanced",
  },
  {
    label: "How It Works",
    query: "Why will Cerebro not hallucinate citations unlike other AI tools?",
    practiceArea: "product_knowledge" as const,
    icon: "fa-solid fa-shield-halved",
  },
];

const DemoSection = ({ openCalendly }: DemoSectionProps) => {
  const [showDemo, setShowDemo] = useState(false);
  const [initialQuery, setInitialQuery] = useState("");
  const [initialPracticeArea, setInitialPracticeArea] = useState<string>("bankruptcy");

  const handleDemoClick = (query: string, practiceArea: string) => {
    setInitialQuery(query);
    setInitialPracticeArea(practiceArea);
    setShowDemo(true);
  };

  return (
    <>
      <section id="demo-section" className="section lfr-demo fade-wrapper">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8 text-center">
              <span className="sub-title fade-top">
                LIVE DEMO
                <i className="fa-solid fa-arrow-right"></i>
              </span>
              <h2 className="title title-anim mt-3">
                Try It Right Now
              </h2>
              <p className="lfr-demo__subtitle fade-top">
                Ask a real legal question. Get a cited answer from actual case law.
                Every citation verified against source documents.
              </p>
            </div>
          </div>

          {/* Pre-built query buttons */}
          <div className="row justify-content-center mt-5">
            <div className="col-12 col-lg-10">
              <div className="lfr-demo__queries fade-top" style={{
                display: 'flex',
                gap: '16px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}>
                {DEMO_QUERIES.map((dq, i) => (
                  <button
                    key={i}
                    onClick={() => handleDemoClick(dq.query, dq.practiceArea)}
                    className="lfr-demo__query-btn"
                    style={{
                      background: '#131b2e',
                      border: '1px solid #2a3a50',
                      borderRadius: '12px',
                      padding: '20px 28px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '12px',
                      minWidth: '240px',
                      maxWidth: '300px',
                      transition: 'border-color 0.2s, transform 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#d4a853';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#2a3a50';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <i className={dq.icon} style={{ fontSize: '24px', color: '#d4a853' }}></i>
                    <span style={{ color: '#e8e8e8', fontSize: '16px', fontWeight: 600 }}>
                      {dq.label}
                    </span>
                    <span style={{ color: '#8899aa', fontSize: '13px', lineHeight: 1.4, textAlign: 'center' }}>
                      &ldquo;{dq.query}&rdquo;
                    </span>
                  </button>
                ))}
              </div>

              {/* Main CTA button */}
              <div className="text-center mt-4 fade-top">
                <button
                  onClick={() => setShowDemo(true)}
                  className="btn btn--primary"
                  style={{
                    fontSize: '18px',
                    padding: '16px 40px',
                  }}
                >
                  Ask Your Own Question
                  <i className="fa-solid fa-arrow-right" style={{ marginLeft: '8px' }}></i>
                </button>
              </div>
            </div>
          </div>

          {/* Trust strip */}
          <div className="lfr-demo__highlights fade-top" style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '32px',
            marginTop: '40px',
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8899aa', fontSize: '14px' }}>
              <i className="fa-solid fa-check-circle" style={{ color: '#3ecf8e' }}></i>
              <span>100% Citation Integrity</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8899aa', fontSize: '14px' }}>
              <i className="fa-solid fa-lock" style={{ color: '#d4a853' }}></i>
              <span>No Data Leaves Your Firm</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8899aa', fontSize: '14px' }}>
              <i className="fa-solid fa-file-shield" style={{ color: '#d4a853' }}></i>
              <span>Full Audit Trail</span>
            </div>
          </div>
        </div>

        <Image src={star} alt="" className="star" aria-hidden="true" />

        <div className="lines d-none d-lg-flex">
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
      </section>

      {/* Full-screen CerebroApp modal */}
      {showDemo && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(10, 15, 26, 0.97)',
            zIndex: 99998,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Close button */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 24px',
            borderBottom: '1px solid #2a3a50',
          }}>
            <span style={{ color: '#d4a853', fontWeight: 700, fontSize: '18px' }}>
              CEREBRO Demo
            </span>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button
                onClick={openCalendly}
                style={{
                  background: '#d4a853',
                  color: '#0a0f1a',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 20px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                Book a Demo Call
              </button>
              <button
                onClick={() => setShowDemo(false)}
                aria-label="Close demo"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8899aa',
                  fontSize: '24px',
                  cursor: 'pointer',
                }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>

          {/* CerebroApp — override height from 100vh to fill remaining space */}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <CerebroApp />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DemoSection;
