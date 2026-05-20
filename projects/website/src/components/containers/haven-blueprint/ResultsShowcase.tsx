import React from "react";
import Image from "next/image";
import star from "public/images/star.png";

const manualSteps = [
  "Research character design manually",
  "Generate images one at a time",
  "Manually check quality of each image",
  "Edit videos frame by frame",
  "Upload and schedule posts individually",
  "Repeat everything for the next video",
];

const pipelineSteps = [
  "Character stays consistent automatically",
  "Batch-generate images with quality scoring",
  "Auto-retry below threshold (7/10)",
  "FFMPEG assembles video in seconds",
  "Pipeline handles the entire flow",
  "You review and approve — that's it",
];

const ResultsShowcase = () => {
  return (
    <section className="section hb-results fade-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 text-center">
            <span className="sub-title fade-top">
              THE DIFFERENCE
              <i className="fa-solid fa-arrow-right"></i>
            </span>
            <h2 className="title title-anim mt-3">
              Manual Content Creation<br />
              vs. The Haven Pipeline
            </h2>
            <p className="hb-results__subtitle fade-top">
              Here&apos;s what changes when you <strong>stop doing everything by hand</strong> and
              let a system handle the heavy lifting.
            </p>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="row gaper mt-5">
          <div className="col-12 col-md-6">
            <div className="hb-results__column hb-results__column--before fade-top">
              <div className="hb-results__column-header">
                <i className="fa-solid fa-xmark"></i>
                <h4>The Manual Way</h4>
              </div>
              <ul>
                {manualSteps.map((step, index) => (
                  <li key={index}>
                    <i className="fa-solid fa-xmark"></i>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
              <div className="hb-results__column-footer">
                <span>8-12 hours per video</span>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="hb-results__column hb-results__column--after fade-top">
              <div className="hb-results__column-header">
                <i className="fa-solid fa-check"></i>
                <h4>The Haven Pipeline</h4>
              </div>
              <ul>
                {pipelineSteps.map((step, index) => (
                  <li key={index}>
                    <i className="fa-solid fa-check"></i>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
              <div className="hb-results__column-footer">
                <span>Under 30 minutes of your time</span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="row justify-content-center mt-5">
          <div className="col-12 col-lg-8 text-center">
            <div className="hb-results__timeline fade-top">
              <i className="fa-solid fa-rocket"></i>
              <p>
                <strong>From zero to first AI-generated video in 48 hours.</strong><br />
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
