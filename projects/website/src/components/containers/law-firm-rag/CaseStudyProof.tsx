import React from "react";
import Image from "next/image";
import star from "public/images/star.png";

const stats = [
  {
    stat: "90%+",
    label: "of civil cases settle before trial",
    insight: "Most legal value never becomes public record"
  },
  {
    stat: "<5%",
    label: "of cases produce published opinions",
    insight: "The majority of legal work is invisible to enterprise AI"
  },
  {
    stat: "100%",
    label: "of your firm's history is yours",
    insight: "Your briefs are more valuable than their training set"
  }
];

const CaseStudyProof = () => {
  return (
    <section className="section lfr-proof fade-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 text-center">
            <span className="sub-title fade-top">
              THE MATH
              <i className="fa-solid fa-arrow-right"></i>
            </span>
            <h2 className="title title-anim mt-3">
              Most Legal Value Is Never Public
            </h2>
            <p className="lfr-proof__subtitle fade-top">
              The most valuable data to train your AI is already inside your firm.
              Not in databases. Not in vendors. In your closed cases.
            </p>
          </div>
        </div>

        <div className="row gaper mt-5 justify-content-center">
          {stats.map((item, index) => (
            <div key={index} className="col-12 col-md-4">
              <div className="lfr-proof__card fade-top">
                <div className="lfr-proof__card-stat">
                  <span className="stat-value">{item.stat}</span>
                  <span className="stat-label">{item.label}</span>
                </div>
                <p className="lfr-proof__card-insight">
                  {item.insight}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Value Proposition */}
        <div className="row justify-content-center mt-5">
          <div className="col-12 col-lg-8">
            <div className="lfr-proof__roi fade-top">
              <div className="roi-content">
                <h4>The Uncomfortable Truth</h4>
                <div className="roi-truth">
                  <p>
                    Soon every firm will have enterprise AI. That becomes table stakes.
                  </p>
                  <p className="highlight">
                    The only durable advantage left will be:<br />
                    <strong>Who owns their data brain.</strong>
                  </p>
                  <ul className="truth-list">
                    <li>Your briefs are more valuable than their model</li>
                    <li>Your outcomes are more valuable than their embeddings</li>
                    <li>Your history is more predictive than their training set</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row justify-content-center mt-4">
          <div className="col-12 text-center">
            <p className="lfr-proof__disclaimer fade-top">
              <i className="fa-solid fa-fire"></i>
              Law firms that don&apos;t build their own RAG will look like firms that never built a CRM.
              They&apos;ll still practice law. They&apos;ll just practice it slower.
            </p>
          </div>
        </div>
      </div>

      <Image src={star} alt="" className="star" aria-hidden="true" />
    </section>
  );
};

export default CaseStudyProof;
