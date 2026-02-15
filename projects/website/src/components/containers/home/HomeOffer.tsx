import React from "react";
import Image from "next/image";
import star from "public/images/offer/star.png";

const HomeOffer = () => {
  const openCalendly = () => {
    if (typeof window !== 'undefined' && (window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({
        url: 'https://calendly.com/mike-buildmytribe/ai-discovery-call'
      });
    }
  };

  return (
    <section className="section offer fade-wrapper light">
      <div className="container">
        <div className="row gaper">
          <div className="col-12 col-lg-5">
            <div className="offer__content section__content">
              <span className="sub-title">
                HOW I HELP
                <i className="fa-solid fa-arrow-right"></i>
              </span>
              <h2 className="title title-anim">
                Systems That Thrive At Scale
              </h2>
              <div className="paragraph">
                <p>
                  I don&apos;t build automations. I build systems that thrive at scale—systems
                  with clear documentation, predictable failure modes, and logic that any
                  competent operator can maintain. No tribal knowledge required. No single
                  point of failure when the original builder moves on.
                </p>
              </div>
              <div className="section__content-cta">
                <button onClick={openCalendly} className="btn btn--secondary">
                  Book Discovery Call
                </button>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-7 col-xl-6 offset-xl-1">
            <div className="offer__cta">
              <div className="offer__cta-single fade-top">
                <span className="sub-title">
                  01
                  <i className="fa-solid fa-arrow-right"></i>
                </span>
                <h2>
                  <span>
                    Growth System Diagnosis
                    <i className="fa-sharp fa-solid fa-arrow-up-right"></i>
                  </span>
                </h2>
                <p className="offer-description">
                  Find where your system is lying, where reporting is comforting,
                  and where assumptions no longer hold.
                </p>
              </div>
              <div className="offer__cta-single fade-top">
                <span className="sub-title">
                  02
                  <i className="fa-solid fa-arrow-right"></i>
                </span>
                <h2>
                  <span>
                    Automation Orchestration
                    <i className="fa-sharp fa-solid fa-arrow-up-right"></i>
                  </span>
                </h2>
                <p className="offer-description">
                  I treat n8n as a control plane, not a task runner. Every workflow
                  has explicit assumptions, clear contracts, and predictable failure behavior.
                </p>
              </div>
              <div className="offer__cta-single fade-top">
                <span className="sub-title">
                  03
                  <i className="fa-solid fa-arrow-right"></i>
                </span>
                <h2>
                  <span>
                    AI Implementation
                    <i className="fa-sharp fa-solid fa-arrow-up-right"></i>
                  </span>
                </h2>
                <p className="offer-description">
                  AI components as probabilistic services with versioned prompts,
                  validated outputs, and guardrails between AI behavior and business systems.
                </p>
              </div>
              <div className="offer__cta-single fade-top">
                <span className="sub-title">
                  04
                  <i className="fa-solid fa-arrow-right"></i>
                </span>
                <h2>
                  <span>
                    Fractional CMO
                    <i className="fa-sharp fa-solid fa-arrow-up-right"></i>
                  </span>
                </h2>
                <p className="offer-description">
                  Strategic leadership for teams that need structural correction,
                  not incremental optimization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Image src={star} alt="Image" className="star" />
      <div className="lines d-none d-lg-flex">
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
    </section>
  );
};

export default HomeOffer;
