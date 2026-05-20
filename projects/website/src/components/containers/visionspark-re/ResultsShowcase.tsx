import React from "react";
import Image from "next/image";
import star from "public/images/star.png";

const manualSteps = [
  "Pay $800-$2,900 for physical staging",
  "Wait 3-5 days for staged photos",
  "Use Ken Burns zoom-and-pan as 'video'",
  "Manually add branding in Canva",
  "Google AI disclosure requirements",
  "Repeat for every new listing",
];

const pipelineSteps = [
  "AI staging under $10/listing",
  "15-minute turnaround — pipeline does the work",
  "True Veo 3.1 generative walkthrough video",
  "Agent branding auto-applied to every reel",
  "Disclosure overlay baked in automatically",
  "You review and approve — that's it",
];

const ResultsShowcase = () => {
  return (
    <section className="section vs-results fade-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 text-center">
            <span className="sub-title fade-top">
              THE DIFFERENCE
              <i className="fa-solid fa-arrow-right"></i>
            </span>
            <h2 className="title title-anim mt-3">
              Traditional Listing Marketing<br />
              vs. The Listing Video Pipeline
            </h2>
            <p className="vs-results__subtitle fade-top">
              Here&apos;s what changes when you <strong>stop paying $2,900 for staging</strong> and let a pipeline handle it.
            </p>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="row gaper mt-5">
          <div className="col-12 col-md-6">
            <div className="vs-results__column vs-results__column--before fade-top">
              <div className="vs-results__column-header">
                <i className="fa-solid fa-xmark"></i>
                <h4>The Traditional Way</h4>
              </div>
              <ul>
                {manualSteps.map((step, index) => (
                  <li key={index}>
                    <i className="fa-solid fa-xmark"></i>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
              <div className="vs-results__column-footer">
                <span>$800-$2,900 per listing + days of waiting</span>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="vs-results__column vs-results__column--after fade-top">
              <div className="vs-results__column-header">
                <i className="fa-solid fa-check"></i>
                <h4>The Listing Video Pipeline</h4>
              </div>
              <ul>
                {pipelineSteps.map((step, index) => (
                  <li key={index}>
                    <i className="fa-solid fa-check"></i>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
              <div className="vs-results__column-footer">
                <span>Under $10 per listing + 15 minutes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="row justify-content-center mt-5">
          <div className="col-12 col-lg-8 text-center">
            <div className="vs-results__timeline fade-top">
              <i className="fa-solid fa-rocket"></i>
              <p>
                <strong>From zero to first listing video in 48 hours.</strong><br />
                Full pipeline deployed in 1-2 weeks.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Image src={star} alt="" className="star" aria-hidden="true" />
    </section>
  );
};

export default ResultsShowcase;
