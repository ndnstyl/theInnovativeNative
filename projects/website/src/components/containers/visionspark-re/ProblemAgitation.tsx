import React from "react";
import Image from "next/image";
import star from "public/images/star.png";
import { painPoints } from "@/data/visionspark-re";

const iconMap: Record<string, string> = {
  "triangle-exclamation": "fa-triangle-exclamation",
  "video-slash": "fa-video-slash",
  "layer-group": "fa-layer-group",
  "shield-halved": "fa-shield-halved",
};

const ProblemAgitation = () => {
  return (
    <section className="section vs-problem fade-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 text-center">
            <span className="sub-title fade-top">
              THE PROBLEM
              <i className="fa-solid fa-arrow-right"></i>
            </span>
            <h2 className="title title-anim mt-3">
              You Know AI Is Changing Real Estate Marketing.<br />
              You Just Can&apos;t Find a Tool That Actually Works.
            </h2>
            <p className="vs-problem__subtitle fade-top">
              You&apos;ve tried the tools. The output is either fake-looking or just a slideshow.
            </p>
          </div>
        </div>

        <div className="row gaper mt-5">
          {painPoints.map((point, index) => (
            <div key={index} className="col-12 col-md-6">
              <div className="vs-problem__card fade-top">
                <div className="vs-problem__card-icon">
                  <i className={`fa-solid ${iconMap[point.icon] || "fa-circle"}`}></i>
                </div>
                <h4>{point.title}</h4>
                <p>{point.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="row justify-content-center mt-5">
          <div className="col-12 col-lg-8 text-center">
            <div className="vs-problem__future-pace fade-top">
              <p>
                <strong>Picture yourself 90 days from now</strong> — you submit a property address and receive 8 AI-staged interior photos, a generative walkthrough video, and a branded reel with disclosure overlays baked in — within 15 minutes. Your competitors are still scheduling $2,900 physical staging sessions.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Image src={star} alt="" className="star" aria-hidden="true" />
    </section>
  );
};

export default ProblemAgitation;
