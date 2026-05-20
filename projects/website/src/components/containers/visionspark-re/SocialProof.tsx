import React from "react";
import Image from "next/image";
import star from "public/images/star.png";

const stats = [
  { value: "Veo 3.1", label: "True Generative Video" },
  { value: "<$10", label: "Cost Per Listing" },
  { value: "15 min", label: "Pipeline Turnaround" },
  { value: "403%", label: "More Inquiries (Video Listings)" },
];

const SocialProof = () => {
  return (
    <section className="section vs-proof fade-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 text-center">
            <span className="sub-title fade-top">
              THE SYSTEM IN ACTION
              <i className="fa-solid fa-arrow-right"></i>
            </span>
            <h2 className="title title-anim mt-3">
              Built From a Production Pipeline —<br />
              Not a Weekend Tutorial
            </h2>
            <p className="vs-proof__subtitle fade-top">
              This system generates AI video content right now. Every workflow, every prompt, every scoring rubric — it&apos;s all included.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="row gaper mt-5">
          {stats.map((stat, index) => (
            <div key={index} className="col-6 col-md-3">
              <div className="vs-proof__stat fade-top">
                <span className="vs-proof__stat-value">{stat.value}</span>
                <span className="vs-proof__stat-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Demo Placeholder */}
        <div className="row justify-content-center mt-5">
          <div className="col-12 col-lg-10">
            <div className="vs-proof__demo fade-top">
              <div className="vs-proof__demo-grid">
                <div className="vs-proof__demo-item">
                  <div className="vs-proof__demo-placeholder">
                    <i className="fa-solid fa-house"></i>
                    <span>AI-Staged Interiors</span>
                  </div>
                </div>
                <div className="vs-proof__demo-item">
                  <div className="vs-proof__demo-placeholder">
                    <i className="fa-solid fa-video"></i>
                    <span>Veo 3.1 Walkthrough</span>
                  </div>
                </div>
                <div className="vs-proof__demo-item">
                  <div className="vs-proof__demo-placeholder">
                    <i className="fa-solid fa-paintbrush"></i>
                    <span>Agent Branding Overlay</span>
                  </div>
                </div>
                <div className="vs-proof__demo-item">
                  <div className="vs-proof__demo-placeholder">
                    <i className="fa-solid fa-film"></i>
                    <span>Branded Listing Reel</span>
                  </div>
                </div>
              </div>
              <p className="vs-proof__demo-caption">Pipeline demonstrations coming soon — real generated property content</p>
            </div>
          </div>
        </div>
      </div>

      <Image src={star} alt="" className="star" aria-hidden="true" />
    </section>
  );
};

export default SocialProof;
