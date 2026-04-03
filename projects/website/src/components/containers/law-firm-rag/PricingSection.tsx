import React from "react";
import Image from "next/image";
import star from "public/images/star.png";

interface PricingSectionProps {
  openCalendly: () => void;
}

const pilotIncludes = [
  {
    icon: "fa-database",
    title: "Initial Setup & Data Ingestion",
    description: "We import and structure your existing briefs, filings, and case documents"
  },
  {
    icon: "fa-calendar-check",
    title: "3-Month Pilot Period",
    description: "Full access to your private RAG system with dedicated support"
  },
  {
    icon: "fa-user-tie",
    title: "Dedicated Onboarding",
    description: "Hands-on training for your team to maximize adoption and value"
  },
  {
    icon: "fa-sliders",
    title: "Practice Area Customization",
    description: "Tailored to your specific jurisdiction, practice areas, and workflows"
  }
];

const PricingSection = ({ openCalendly }: PricingSectionProps) => {
  return (
    <section className="section lfr-pricing fade-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 text-center">
            <span className="sub-title fade-top">
              PILOT PROGRAM
              <i className="fa-solid fa-arrow-right"></i>
            </span>
            <h2 className="title title-anim mt-3">
              Start Building Your Second Brain
            </h2>
            <p className="lfr-pricing__subtitle fade-top">
              A focused pilot to prove the value before you scale.
              No long-term commitment. Just results.
            </p>
          </div>
        </div>

        <div className="row justify-content-center mt-5">
          <div className="col-12 col-lg-10">
            <div className="lfr-pricing__card fade-top">
              {/* Capacity Notice */}
              <div className="lfr-pricing__badge">
                <i className="fa-solid fa-scale-balanced"></i>
                <span>Up to 5 firms per practice area • Criminal Defense &amp; Bankruptcy</span>
              </div>

              <div className="lfr-pricing__header">
                <div className="lfr-pricing__price-block">
                  <span className="lfr-pricing__price-label">Pilot Access Fee</span>
                  <div className="lfr-pricing__price">
                    <span className="lfr-pricing__currency">$</span>
                    <span className="lfr-pricing__amount">2,500</span>
                  </div>
                  <span className="lfr-pricing__price-note">One-time setup fee</span>
                </div>
              </div>

              <div className="lfr-pricing__includes">
                <h4 className="lfr-pricing__includes-title">
                  <i className="fa-solid fa-check-circle"></i>
                  What&apos;s Included
                </h4>
                <div className="row gaper">
                  {pilotIncludes.map((item, index) => (
                    <div key={index} className="col-12 col-md-6">
                      <div className="lfr-pricing__include-item">
                        <div className="lfr-pricing__include-icon">
                          <i className={`fa-solid ${item.icon}`}></i>
                        </div>
                        <div className="lfr-pricing__include-content">
                          <h5>{item.title}</h5>
                          <p>{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lfr-pricing__ctas">
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/stripe/create-checkout-session', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({}),
                      });
                      const data = await res.json();
                      if (data.url) window.location.href = data.url;
                    } catch (err) {
                      console.error('Checkout error:', err);
                    }
                  }}
                  className="btn btn--primary btn--large"
                >
                  Start Your Pilot
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
                <button onClick={openCalendly} className="btn btn--secondary btn--large">
                  Schedule Discovery Call
                  <i className="fa-solid fa-calendar"></i>
                </button>
              </div>

              <div className="lfr-pricing__guarantee">
                <i className="fa-solid fa-shield-halved"></i>
                <span>If we can&apos;t demonstrate clear value in 30 days, we&apos;ll refund your pilot fee.</span>
              </div>
            </div>
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
  );
};

export default PricingSection;
