import React from "react";
import Image from "next/image";
import star from "public/images/star.png";

const features = [
  {
    icon: "fa-brain",
    title: "Institutional Intelligence",
    description: "Ask \"How do we argue this?\" and get answers from your own past work. Your strategy. Your results. Not averages. Not generic doctrine.",
    highlight: true
  },
  {
    icon: "fa-certificate",
    title: "100% Citation Integrity",
    description: "Every citation verified against source documents. No invented cases. No fabricated quotes. Every claim traceable to its origin."
  },
  {
    icon: "fa-lock",
    title: "Your Data Stays Yours",
    description: "Private RAG trained only on your cases, your filings, your outcomes. No shared training. No data leaving your control."
  },
  {
    icon: "fa-timeline",
    title: "Full Audit Trail",
    description: "Every answer shows exactly where it came from. See which documents were consulted, which passages matched, and why."
  },
  {
    icon: "fa-layer-group",
    title: "Deep Practice Coverage",
    description: "Criminal Defense and Bankruptcy. We go deep rather than shallow. Your judge-specific patterns. Your jurisdiction's nuances."
  },
  {
    icon: "fa-arrows-spin",
    title: "Compounding Returns",
    description: "Every case you close makes the system smarter. Your wins compound. Your institutional memory grows. Your strategy never resets."
  }
];

const FeaturesBenefits = () => {
  return (
    <section className="section lfr-features fade-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 text-center">
            <span className="sub-title fade-top">
              WHAT YOU GET
              <i className="fa-solid fa-arrow-right"></i>
            </span>
            <h2 className="title title-anim mt-3">
              Own Your Intelligence. Compound Your Experience.
            </h2>
            <p className="lfr-features__subtitle fade-top">
              If you&apos;re building on someone else&apos;s corpus, you&apos;re renting intelligence.
              If you build on your own, you&apos;re compounding it.
            </p>
          </div>
        </div>

        <div className="row gaper mt-5">
          {features.map((feature, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-4">
              <div className={`lfr-features__card fade-top ${feature.highlight ? 'lfr-features__card--highlight' : ''}`}>
                <div className="lfr-features__card-icon">
                  <i className={`fa-solid ${feature.icon}`}></i>
                </div>
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
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

export default FeaturesBenefits;
