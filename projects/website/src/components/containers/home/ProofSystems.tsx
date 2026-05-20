import React from "react";
import Link from "next/link";
import { proofSystems, verticals } from "@/data/homepage";
import { CALENDLY_URL } from "@/lib/constants";

const ProofSystems = () => {
  const openCalendly = () => {
    if (typeof window !== "undefined" && (window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({
        url: CALENDLY_URL,
      });
    }
  };

  const getVertical = (verticalId: string) =>
    verticals.find((v) => v.id === verticalId);

  return (
    <section id="proof-systems" className="section proof-systems fade-wrapper">
      <div className="container">
        <div className="row gaper">
          <div className="col-12">
            <div className="section__content">
              <span className="sub-title">
                PROOF
                <i className="fa-solid fa-arrow-right"></i>
              </span>
              <h2 className="title title-anim">
                Here&apos;s What AI Infrastructure Actually Looks Like
              </h2>
              <div className="paragraph">
                <p>
                  These aren&apos;t concepts. These are real AI systems
                  we&apos;ve built and deployed. Each one replaces fragmented
                  tools with integrated, automated infrastructure.
                </p>
              </div>
            </div>
          </div>
          {proofSystems.map((system) => {
            const vertical = getVertical(system.vertical);
            return (
              <div key={system.id} className="col-12 col-md-6 col-xl-3">
                <div className="proof-systems__card fade-top">
                  <div className="proof-systems__icon">
                    <i
                      className={`fa-solid ${vertical?.icon || "fa-cube"}`}
                    ></i>
                  </div>
                  <span className="proof-systems__vertical">
                    {vertical?.name}
                  </span>
                  <h3>{system.name}</h3>
                  <p>{system.description}</p>
                  <span className="proof-systems__outcome">
                    {system.outcome}
                  </span>
                  <span className="proof-systems__price">{system.price}</span>
                  <Link href={system.href} className="proof-systems__link">
                    See How It Works &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
          <div className="col-12 col-md-6 col-xl-3">
            <div className="proof-systems__card proof-systems__card--cta fade-top">
              <div className="proof-systems__icon">
                <i className="fa-solid fa-rocket"></i>
              </div>
              <span className="proof-systems__vertical">Your Industry</span>
              <h3>Don&apos;t See Your Vertical?</h3>
              <p>
                The pattern is the same &mdash; replace fragmented tools with
                integrated AI systems. If your business runs on manual workflows
                and disconnected SaaS, we can build the infrastructure to fix
                that.
              </p>
              <button
                onClick={openCalendly}
                className="btn btn--secondary"
              >
                Book a Discovery Call
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProofSystems;
