import React from "react";
import Image from "next/image";
import star from "public/images/star.png";
import { painPoints } from "@/data/haven-blueprint";

const iconMap: Record<string, string> = {
  eye: "fa-eye",
  video: "fa-video",
  "dollar-sign": "fa-dollar-sign",
  clock: "fa-clock",
};

const ProblemAgitation = () => {
  return (
    <section className="section hb-problem fade-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 text-center">
            <span className="sub-title fade-top">
              THE PROBLEM
              <i className="fa-solid fa-arrow-right"></i>
            </span>
            <h2 className="title title-anim mt-3">
              Everyone Talks About AI Influencers.<br />
              Nobody Shows You How to Build One.
            </h2>
            <p className="hb-problem__subtitle fade-top">
              You&apos;ve seen the results. You just haven&apos;t seen the system behind them.
            </p>
          </div>
        </div>

        <div className="row gaper mt-5">
          {painPoints.map((point, index) => (
            <div key={index} className="col-12 col-md-6">
              <div className="hb-problem__card fade-top">
                <div className="hb-problem__card-icon">
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
            <div className="hb-problem__future-pace fade-top">
              <p>
                <strong>Imagine having a fully automated content pipeline</strong> — where you design
                a character once, set up the workflows, and watch AI-generated videos roll out
                on schedule. That&apos;s not a fantasy. It&apos;s what we built.
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
