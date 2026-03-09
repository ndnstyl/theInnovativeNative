import React, { useState, useEffect, useCallback } from "react";
import Image, { StaticImageData } from "next/image";
import YoutubeEmbed from "@/components/youtube/YoutubeEmbed";
import eleven from "public/images/portfolio/eleven.png";
import twelve from "public/images/portfolio/twelve.png";
import fifteen from "public/images/portfolio/fifteen.png";
import sixteen from "public/images/portfolio/sixteen.png";

interface CaseStudy {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  result: string;
  image: StaticImageData;
  videoId?: string;
  videoThumbnail?: StaticImageData;
  fullContent: {
    context: string;
    observedSignals: string[];
    whatLeadershipBelieved: string;
    rootCause: string;
    intervention: string[];
    outcome: string[];
  };
}

const caseStudies: CaseStudy[] = [
  {
    id: 1,
    title: "Paid Acquisition at Scale",
    subtitle: "Personal Injury Law",
    category: "Case Study",
    description: "$450-600k/mo spend showing 'stable' performance. Found structural saturation masked by platform optics.",
    result: "Cost per qualified case improved 25-30%",
    image: eleven,
    fullContent: {
      context: "A mature PI acquisition system operating at sustained high six-figure monthly spend, fluctuating between $450k–$600k per month across Google Search and Google LSAs. Activity volume remained high and reporting suggested stability, yet downstream economics were deteriorating.",
      observedSignals: [
        "Impression share on core non-branded queries consistently exceeded 78–85%",
        "Average CPC increased 18–25% year over year despite stable conversion volume",
        "Reported CPL remained flat while intake-qualified case rate declined",
        "Intake teams reported lower case quality despite higher lead counts"
      ],
      whatLeadershipBelieved: "Performance volatility was attributed to execution noise and competitive pressure. The assumed solution was tighter optimization and incremental budget increases to offset rising CPCs.",
      rootCause: "The system had hit structural saturation. Marginal CPA was climbing faster than volume gains — diminishing returns across the board. Branded and familiar segments were being protected out of comfort, not performance, while higher-variance segments with real long-term value kept getting cut. Intake capacity and lead quality weren't in the decision metrics, so the numbers told a comfortable lie.",
      intervention: [
        "Reframed success metrics around intake-qualified cases rather than raw lead volume",
        "Rebuilt search and LSA account structure to expose query-level marginal CPA behavior",
        "Reduced spend approximately 20–25% in emotionally protected segments",
        "Reallocated budget toward underfunded intent clusters previously misread as unstable"
      ],
      outcome: [
        "Spend stabilized at approximately $470k–$500k per month",
        "Cost per intake-qualified case improved by 25–30%",
        "Case acceptance rates recovered to historical baselines",
        "Leadership regained decision clarity grounded in economics rather than platform optics"
      ]
    }
  },
  {
    id: 2,
    title: "System Noise vs Signal",
    subtitle: "Multi-Vertical",
    category: "Case Study",
    description: "120+ tracked KPIs with no correlation to revenue. Teams spent 30-40% capacity responding to noise.",
    result: "Cut KPIs by 60-65%, efficiency improved 18-22%",
    image: twelve,
    fullContent: {
      context: "A multi-channel growth system spanning paid search, paid social, and inbound channels with monthly spend ranging from $180k–$320k, depending on seasonality. The system tracked over 120 reported KPIs and ran weekly optimization cycles.",
      observedSignals: [
        "Fewer than 15% of tracked metrics showed meaningful correlation to revenue or downstream outcomes",
        "Teams spent an estimated 30–40% of weekly capacity responding to metric variance with no causal impact",
        "Optimization velocity increased while outcome predictability declined"
      ],
      whatLeadershipBelieved: "More dashboards, more data, and faster optimization cycles would eventually surface clarity and restore performance.",
      rootCause: "The system rewarded activity and narrative alignment, not causality. Reporting complexity masked true performance drivers. Teams were optimizing to defend past decisions instead of testing what actually moves revenue — constant motion, diminishing returns.",
      intervention: [
        "Removed non-causal metrics, reducing tracked KPIs by approximately 60–65%",
        "Introduced system-level thresholds tied to revenue, retention, and intake quality",
        "Eliminated initiatives consuming roughly 20–25% of team capacity with no measurable economic return"
      ],
      outcome: [
        "Decision velocity improved while optimization frequency decreased",
        "Marketing efficiency improved an estimated 18–22% without increasing spend",
        "The system stopped oscillating based on opinion and became explainable under review"
      ]
    }
  },
  {
    id: 3,
    title: "Finding Disguised Winners",
    subtitle: "Paid Search",
    category: "Case Study",
    description: "High-variance segments being cut due to fear-based optimization and short-term reporting pressure.",
    result: "30-35% incremental qualified volume recovered",
    image: fifteen,
    fullContent: {
      context: "Paid search systems managing $90k–$150k per month in spend with frequent structural and creative changes driven by short-term performance reviews.",
      observedSignals: [
        "Certain segments exhibited ±30–40% week-to-week CPA variance",
        "Over 60–90 day windows, these same segments delivered 1.6–2.1x higher downstream value",
        "Budget reallocation decisions were made on 14–30 day performance windows"
      ],
      whatLeadershipBelieved: "High-variance segments were inherently risky and should be deprioritized in favor of stable performers.",
      rootCause: "Evaluation windows were misaligned with economic reality. High-variance segments were producing outsized long-term value but kept getting cut because short reporting windows made them look unstable. Fear-based optimization was killing the best-performing segments.",
      intervention: [
        "Isolated high-variance segments from core optimization cycles",
        "Protected approximately 15–20% of total spend from short-term suppression",
        "Extended evaluation windows to 90 days for value assessment"
      ],
      outcome: [
        "Previously suppressed segments contributed approximately 30–35% of incremental qualified volume",
        "Blended CPA normalized once evaluation windows aligned with downstream economics",
        "Long-term growth stabilized without increasing total spend"
      ]
    }
  },
  {
    id: 4,
    title: "Organizational Fear",
    subtitle: "System Constraint",
    category: "Case Study",
    description: "Admitting the system was wrong felt riskier than stagnation. Surface-level tweaks replaced the rebuild that was actually needed.",
    result: "Efficiency improved 18-22% in two quarters",
    image: sixteen,
    fullContent: {
      context: "Leadership teams overseeing mature acquisition systems with flat or declining year-over-year growth. Aggregate annual marketing investment exceeded $3M across channels.",
      observedSignals: [
        "Approximately 35–45% of spend allocated to initiatives with declining marginal returns",
        "Structural issues discussed informally but never reflected in decision-making",
        "Optimization activity increased while confidence in outcomes declined"
      ],
      whatLeadershipBelieved: "Admitting the system was wrong would undermine confidence and create organizational risk.",
      rootCause: "Fear of being wrong outweighed fear of stagnation. Surface-level optimization replaced the rebuild that was actually needed. The true constraint was organizational, not technical or tactical.",
      intervention: [
        "Explicitly named organizational fear as a limiting variable in performance discussions",
        "Modeled the cost of inaction versus re-architecture over 6- and 12-month horizons",
        "Phased system changes to preserve leadership credibility while restoring function"
      ],
      outcome: [
        "Structural change approved",
        "Within two quarters, blended acquisition efficiency improved approximately 18–22%",
        "Performance variability decreased materially",
        "Decision-making shifted from narrative defense to economic justification"
      ]
    }
  },
];

const PortfolioMain = () => {
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);
  const [videoStudy, setVideoStudy] = useState<CaseStudy | null>(null);

  const closeModal = () => setSelectedStudy(null);
  const closeVideoModal = () => setVideoStudy(null);

  const handleCardClick = (study: CaseStudy) => {
    if (study.videoId) {
      setVideoStudy(study);
    } else {
      setSelectedStudy(study);
    }
  };

  const handleEscapeKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      closeVideoModal();
    }
  }, []);

  useEffect(() => {
    if (videoStudy) {
      document.addEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "";
    };
  }, [videoStudy, handleEscapeKey]);

  return (
    <>
      <section className="section portfolio-m fade-wrapper">
        <div className="container">
          <div className="row gaper">
            {caseStudies.map((study) => (
              <div key={study.id} className="col-12 col-lg-6">
                <div
                  className="portfolio-m__single topy-tilt fade-top"
                  onClick={() => handleCardClick(study)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="thumb" style={{ position: 'relative' }}>
                    <Image src={study.videoThumbnail || study.image} alt={study.title} />
                    {study.videoId && (
                      <div className="video-play-overlay" style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)',
                        opacity: 0.9,
                        transition: 'opacity 0.3s ease',
                      }}>
                        <div style={{
                          width: '70px',
                          height: '70px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#00FFFF',
                          color: '#000',
                          borderRadius: '50%',
                          fontSize: '24px',
                          boxShadow: '0 4px 20px rgba(0, 255, 255, 0.4)',
                        }}>
                          <i className="fa-sharp fa-solid fa-play" style={{ marginLeft: '4px' }}></i>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="content">
                    <span className="category-tag" style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '4px',
                      fontSize: '12px',
                      marginBottom: '8px',
                      color: '#fff'
                    }}>
                      {study.videoId ? 'Video Walkthrough' : study.category}
                    </span>
                    <h3 className="light-title-lg">
                      {study.title}
                    </h3>
                    <p style={{ fontSize: '14px', opacity: 0.8, marginTop: '8px' }}>
                      {study.description}
                    </p>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      marginTop: '8px',
                      color: '#00FFFF'
                    }}>
                      {study.result}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {videoStudy && videoStudy.videoId && (
        <div
          className="video-backdrop video-zoom-in"
          onClick={closeVideoModal}
          role="dialog"
          aria-modal="true"
          aria-label={videoStudy.title}
        >
          <div className="video-inner">
            <div
              className="video-container video-container--responsive aspect-16-9"
              onClick={(e) => e.stopPropagation()}
            >
              <YoutubeEmbed embedId={videoStudy.videoId} title={videoStudy.title} autoplay={true} />
              <button
                aria-label="Close video"
                className="close-video-popup"
                onClick={closeVideoModal}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedStudy && (
        <div
          className="case-study-modal-overlay"
          onClick={closeModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            className="case-study-modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#1a1a1a',
              borderRadius: '16px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '20px',
                zIndex: 10,
              }}
            >
              <i className="fa-light fa-xmark"></i>
            </button>

            {/* Modal Content */}
            <div style={{ padding: '40px' }}>
              {/* Header */}
              <div style={{ marginBottom: '30px' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  background: 'rgba(0, 255, 255, 0.1)',
                  borderRadius: '4px',
                  fontSize: '12px',
                  marginBottom: '12px',
                  color: '#00FFFF',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}>
                  {selectedStudy.subtitle}
                </span>
                <h2 style={{ color: '#fff', fontSize: '2rem', marginBottom: '8px' }}>
                  {selectedStudy.title}
                </h2>
                <p style={{ color: '#00FFFF', fontWeight: 600 }}>
                  Result: {selectedStudy.result}
                </p>
              </div>

              {/* Context */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ color: '#00FFFF', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                  Context
                </h4>
                <p style={{ color: '#d0d0d0', lineHeight: 1.7 }}>
                  {selectedStudy.fullContent.context}
                </p>
              </div>

              {/* What The Data Showed */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ color: '#00FFFF', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                  What The Data Showed
                </h4>
                <ul style={{ color: '#d0d0d0', lineHeight: 1.7, paddingLeft: '20px' }}>
                  {selectedStudy.fullContent.observedSignals.map((signal, idx) => (
                    <li key={idx} style={{ marginBottom: '8px' }}>{signal}</li>
                  ))}
                </ul>
              </div>

              {/* The Assumption */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ color: '#00FFFF', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                  The Assumption
                </h4>
                <p style={{ color: '#d0d0d0', lineHeight: 1.7, fontStyle: 'italic' }}>
                  {selectedStudy.fullContent.whatLeadershipBelieved}
                </p>
              </div>

              {/* Root Cause */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ color: '#00FFFF', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                  What Was Actually Broken
                </h4>
                <p style={{ color: '#d0d0d0', lineHeight: 1.7 }}>
                  {selectedStudy.fullContent.rootCause}
                </p>
              </div>

              {/* What We Built */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ color: '#00FFFF', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                  What We Built
                </h4>
                <ul style={{ color: '#d0d0d0', lineHeight: 1.7, paddingLeft: '20px' }}>
                  {selectedStudy.fullContent.intervention.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: '8px' }}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Outcome */}
              <div style={{
                marginBottom: '24px',
                background: 'rgba(0, 255, 255, 0.05)',
                padding: '20px',
                borderRadius: '8px',
                borderLeft: '3px solid #00FFFF',
              }}>
                <h4 style={{ color: '#00FFFF', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                  Outcome
                </h4>
                <ul style={{ color: '#d0d0d0', lineHeight: 1.7, paddingLeft: '20px' }}>
                  {selectedStudy.fullContent.outcome.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: '8px' }}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Disclaimer */}
              <p style={{
                color: '#888',
                fontSize: '12px',
                fontStyle: 'italic',
                marginTop: '30px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              }}>
                All case studies are anonymized due to NDAs and NCAs. Metrics are presented as ranges or blended figures. No brands, proprietary data, or client-identifying details are included.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PortfolioMain;
