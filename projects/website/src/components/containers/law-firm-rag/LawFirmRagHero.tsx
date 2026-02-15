import React, { useState } from "react";
import Image from "next/image";
import star from "public/images/star.png";
import heroImage from "public/images/law-firm-rag/hero-library-brain.jpg";

interface LawFirmRagHeroProps {
  openCalendly: () => void;
}

const LawFirmRagHero = ({ openCalendly }: LawFirmRagHeroProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const videoId = "ZkLx4zC62Xk";

  return (
    <>
      <section className="section lfr-hero fade-wrapper">
        {/* Background Image - hidden on mobile */}
        <div className="lfr-hero__bg-image">
          <Image
            src={heroImage}
            alt=""
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            priority
            aria-hidden="true"
          />
          <div className="lfr-hero__bg-overlay"></div>
        </div>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10 text-center">
              <span className="sub-title fade-top">
                PRIVATE LEGAL RAG
                <i className="fa-solid fa-arrow-right"></i>
              </span>
              <h1 className="title title-anim mt-4">
                Big-Box AI Knows the Law.<br />
                Your Firm Knows What Wins.
              </h1>
              <p className="lfr-hero__subtitle fade-top">
                Enterprise legal AI trains on everyone&apos;s cases. Your advantage lives in <strong>your briefs, your motions, your outcomes</strong>. Build a second brain trained on what actually works for you.
              </p>

              {/* Practice Areas */}
              <div className="lfr-hero__practice-areas fade-top">
                <span className="practice-area">Criminal Defense</span>
                <span className="practice-divider">|</span>
                <span className="practice-area">Bankruptcy</span>
              </div>

              {/* CTAs */}
              <div className="lfr-hero__ctas fade-top">
                <button onClick={openCalendly} className="btn btn--primary">
                  Request Pilot Access
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
                <button onClick={() => setShowVideoModal(true)} className="btn btn--secondary">
                  <i className="fa-solid fa-play" style={{ marginRight: '8px' }}></i>
                  See It In Action
                </button>
              </div>

              {/* Stats Strip */}
              <div className="lfr-hero__stats fade-top">
                <div
                  className="stat-item stat-item--tooltip"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  <span className="stat-value">100%</span>
                  <span className="stat-label">
                    Citation Integrity
                    <i className="fa-solid fa-circle-info tooltip-icon"></i>
                  </span>
                  {showTooltip && (
                    <div className="stat-tooltip">
                      Every citation is verified against source documents before being included—no invented cases, no fabricated quotes.
                    </div>
                  )}
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-value">2</span>
                  <span className="stat-label">Practice Areas</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-value">100+</span>
                  <span className="stat-label">Firms Using AI-First Automation</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <Image src={star} alt="" className="star star-one" aria-hidden="true" />
        <Image src={star} alt="" className="star star-two" aria-hidden="true" />
        <div className="lfr-hero__glow"></div>

        <div className="lines d-none d-lg-flex">
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
      </section>

      {/* Video Modal - outside section to escape stacking context */}
      {showVideoModal && (
        <div
          className="lfr-video-modal"
          onClick={() => setShowVideoModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.92)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <button
            onClick={() => setShowVideoModal(false)}
            aria-label="Close video"
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '32px',
              cursor: 'pointer',
              zIndex: 100000,
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '75vw',
              maxWidth: '1200px',
              aspectRatio: '16/9',
            }}
          >
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
              title="Law Firm RAG Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 0 60px rgba(0, 255, 255, 0.2)',
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default LawFirmRagHero;
