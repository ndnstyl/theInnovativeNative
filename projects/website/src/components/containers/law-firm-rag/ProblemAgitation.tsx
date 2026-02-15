import React from "react";
import Image from "next/image";
import star from "public/images/star.png";

interface ProblemAgitationProps {
  openCalendly: () => void;
}

const tradeoffs = [
  {
    icon: "fa-users",
    title: "They Train on Everyone's Law",
    description: "Big-box legal AI is optimized for generic doctrine, published opinions, and mainstream interpretations. That's fine if your goal is to sound like every other firm."
  },
  {
    icon: "fa-eye-slash",
    title: "Your Edge Is Invisible to Them",
    description: "Your motions. Your briefs. Your judge-specific patterns. Your settlement history. Your internal playbooks. None of that exists in enterprise AI."
  },
  {
    icon: "fa-chart-pie",
    title: "90% of Cases Never Go Public",
    description: "Over 90% of civil cases settle. Fewer than 5% produce published opinions. Most legal value happens in pleadings, discovery, motions, and negotiations—not databases."
  },
  {
    icon: "fa-person-walking-arrow-right",
    title: "Your Best Arguments Walk Out the Door",
    description: "Every senior attorney who leaves takes part of your firm's brain with them. Your wins aren't compounding. Your strategy resets every case."
  }
];

const ProblemAgitation = ({ openCalendly }: ProblemAgitationProps) => {
  return (
    <section className="section lfr-problem fade-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 text-center">
            <span className="sub-title fade-top">
              THE TRADE-OFF
              <i className="fa-solid fa-arrow-right"></i>
            </span>
            <h2 className="title title-anim mt-3">
              Legal Research Isn&apos;t Broken.<br />
              But AI Has Changed What &quot;Good&quot; Looks Like.
            </h2>
            <p className="lfr-problem__subtitle fade-top">
              Big-box AI systems can only learn from what&apos;s public.
              Your competitive edge lives in what&apos;s private.
            </p>
          </div>
        </div>

        <div className="row gaper mt-5">
          {tradeoffs.map((point, index) => (
            <div key={index} className="col-12 col-md-6">
              <div className="lfr-problem__card fade-top">
                <div className="lfr-problem__card-icon">
                  <i className={`fa-solid ${point.icon}`}></i>
                </div>
                <h4>{point.title}</h4>
                <p>{point.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="row justify-content-center mt-5">
          <div className="col-12 col-lg-8 text-center">
            <div className="lfr-problem__loss-cta fade-top">
              <p className="loss-question">
                When firms say &quot;We use AI,&quot; what they really mean is:<br />
                <strong>&quot;We use the same AI as everyone else.&quot;</strong>
              </p>
              <button onClick={openCalendly} className="btn btn--secondary">
                See What Ownership Looks Like
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Image src={star} alt="" className="star" aria-hidden="true" />
    </section>
  );
};

export default ProblemAgitation;
