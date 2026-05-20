import React from "react";
import Image from "next/image";
import star from "public/images/star.png";

const stats = [
  { value: "500+", label: "AI Images Generated" },
  { value: "50+", label: "Videos Assembled" },
  { value: "4", label: "Automated Workflows" },
  { value: "9", label: "Linked Airtable Tables" },
];

const SocialProof = () => {
  return (
    <section className="section hb-proof fade-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 text-center">
            <span className="sub-title fade-top">
              THE SYSTEM IN ACTION
              <i className="fa-solid fa-arrow-right"></i>
            </span>
            <h2 className="title title-anim mt-3">
              This Isn&apos;t Theory.<br />
              It&apos;s a Running Production System.
            </h2>
            <p className="hb-proof__subtitle fade-top">
              aSliceOfHaven is built on this exact pipeline. Every workflow, every prompt,
              every Airtable table — it&apos;s all included.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="row gaper mt-5">
          {stats.map((stat, index) => (
            <div key={index} className="col-6 col-md-3">
              <div className="hb-proof__stat fade-top">
                <span className="hb-proof__stat-value">{stat.value}</span>
                <span className="hb-proof__stat-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Video Demo Placeholder */}
        <div className="row justify-content-center mt-5">
          <div className="col-12 col-lg-10">
            <div className="hb-proof__demo fade-top">
              <div className="hb-proof__demo-grid">
                <div className="hb-proof__demo-item">
                  <div className="hb-proof__demo-placeholder">
                    <i className="fa-solid fa-table"></i>
                    <span>Airtable Mission Control</span>
                  </div>
                </div>
                <div className="hb-proof__demo-item">
                  <div className="hb-proof__demo-placeholder">
                    <i className="fa-solid fa-diagram-project"></i>
                    <span>n8n Workflow Execution</span>
                  </div>
                </div>
                <div className="hb-proof__demo-item">
                  <div className="hb-proof__demo-placeholder">
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                    <span>AI Image Generation</span>
                  </div>
                </div>
                <div className="hb-proof__demo-item">
                  <div className="hb-proof__demo-placeholder">
                    <i className="fa-solid fa-film"></i>
                    <span>Final Video Output</span>
                  </div>
                </div>
              </div>
              <p className="hb-proof__demo-caption">Screen recordings coming soon — these will show the actual pipeline in action</p>
            </div>
          </div>
        </div>
      </div>

      <Image src={star} alt="" className="star" aria-hidden="true" />
    </section>
  );
};

export default SocialProof;
