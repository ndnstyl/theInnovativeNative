import React from "react";
import Image from "next/image";
import star from "public/images/star.png";
import { systemSteps } from "@/data/haven-blueprint";

const iconMap: Record<string, string> = {
  palette: "fa-palette",
  database: "fa-database",
  zap: "fa-bolt",
  image: "fa-image",
  film: "fa-film",
};

const SystemReveal = () => {
  return (
    <section className="section hb-system fade-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 text-center">
            <span className="sub-title fade-top">
              HOW IT WORKS
              <i className="fa-solid fa-arrow-right"></i>
            </span>
            <h2 className="title title-anim mt-3">
              Five Steps From Zero<br />
              to AI Content Machine
            </h2>
            <p className="hb-system__subtitle fade-top">
              When you set up your pipeline, every piece connects.
              Here&apos;s the system that makes it happen.
            </p>
          </div>
        </div>

        {/* Pipeline Steps */}
        <div className="hb-system__steps mt-5">
          {systemSteps.map((step, index) => (
            <div key={index} className="hb-system__step fade-top">
              <div className="hb-system__step-number">
                <span>{step.number}</span>
              </div>
              <div className="hb-system__step-icon">
                <i className={`fa-solid ${iconMap[step.icon] || "fa-circle"}`}></i>
              </div>
              <div className="hb-system__step-content">
                <h4>{step.title}</h4>
                <p>{step.description}</p>
                <div className="hb-system__step-deliverable">
                  <i className="fa-solid fa-box-open"></i>
                  <span>{step.deliverable}</span>
                </div>
              </div>
              {index < systemSteps.length - 1 && (
                <div className="hb-system__step-connector">
                  <i className="fa-solid fa-arrow-down"></i>
                </div>
              )}
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

export default SystemReveal;
