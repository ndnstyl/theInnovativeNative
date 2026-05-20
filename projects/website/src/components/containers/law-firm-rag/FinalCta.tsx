import React from "react";
import Image from "next/image";
import star from "public/images/star.png";

interface FinalCtaProps {
  openCalendly: () => void;
}

const FinalCta = ({ openCalendly }: FinalCtaProps) => {
  return (
    <section className="section lfr-final-cta fade-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 text-center">
            {/* Capacity Notice */}
            <div className="lfr-final-cta__urgency fade-top">
              <i className="fa-solid fa-scale-balanced"></i>
              <span>Currently accepting up to 5 firms per practice area</span>
            </div>
            <p className="lfr-final-cta__disciplines fade-top" style={{ marginTop: '8px', fontSize: '14px', color: '#00FFFF' }}>
              Criminal Defense &amp; Bankruptcy slots available. At capacity? Join the waitlist.
            </p>

            <h2 className="title title-anim mt-4">
              Speed Is Easy to Buy.<br />
              Institutional Intelligence Isn&apos;t.
            </h2>

            <p className="lfr-final-cta__subtitle fade-top">
              The future isn&apos;t AI that knows the law.
              The future is AI that knows your firm.
            </p>

            {/* Core Question */}
            <div className="lfr-final-cta__loss fade-top">
              <p className="loss-question">
                Would it be useful if your firm could ask:<br />
                <strong>&quot;How do we argue this?&quot;</strong><br />
                and get an answer from your own past work?
              </p>
            </div>

            {/* Primary CTA */}
            <div className="lfr-final-cta__buttons fade-top">
              <button onClick={openCalendly} className="btn btn--primary btn--large">
                Yes, Show Me What That Looks Like
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>

            {/* Trust Reinforcement */}
            <div className="lfr-final-cta__trust fade-top">
              <div className="trust-item">
                <i className="fa-solid fa-check-circle"></i>
                <span>No commitment required</span>
              </div>
              <div className="trust-item">
                <i className="fa-solid fa-check-circle"></i>
                <span>See your documents in action</span>
              </div>
              <div className="trust-item">
                <i className="fa-solid fa-check-circle"></i>
                <span>15-minute discovery call</span>
              </div>
            </div>

            {/* Final Hook */}
            <p className="lfr-final-cta__tagline fade-top">
              <strong>Using AI vs. Owning AI.</strong><br />
              That&apos;s the difference.
            </p>
          </div>
        </div>
      </div>

      <Image src={star} alt="" className="star star-one" aria-hidden="true" />
      <Image src={star} alt="" className="star star-two" aria-hidden="true" />
      <div className="lfr-final-cta__glow"></div>

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

export default FinalCta;
