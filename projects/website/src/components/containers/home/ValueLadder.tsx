import React from "react";
import Link from "next/link";
import { valueLadderTiers } from "@/data/homepage";

const tierButtonClass: Record<string, string> = {
  learn: "btn btn--ghost",
  deploy: "btn btn--outline",
  pilot: "btn btn--secondary",
  build: "btn btn--primary",
};

const isCalendlyLink = (href: string) => href.includes("calendly.com");

const ValueLadder = () => {
  const openCalendly = () => {
    if (typeof window !== "undefined" && (window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({
        url: "https://calendly.com/mike-buildmytribe/ai-discovery-call",
      });
    }
  };

  return (
    <section id="value-ladder" className="section value-ladder fade-wrapper">
      <div className="container">
        <div className="row gaper">
          <div className="col-12">
            <div className="section__content">
              <span className="sub-title">
                HOW TO WORK WITH US
                <i className="fa-solid fa-arrow-right"></i>
              </span>
              <h2 className="title title-anim">
                Start Where You Are. Scale When You&apos;re Ready.
              </h2>
              <div className="paragraph">
                <p>
                  Whether you want to learn, deploy a system yourself, or have
                  us build it &mdash; there&apos;s a clear path forward.
                </p>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="value-ladder__track">
              {valueLadderTiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`value-ladder__tier value-ladder__tier--${tier.id} fade-top`}
                >
                  <h3>{tier.name}</h3>
                  <span className="value-ladder__price">
                    {tier.priceRange}
                  </span>
                  <p>{tier.description}</p>
                  {isCalendlyLink(tier.href) ? (
                    <button
                      onClick={openCalendly}
                      className={tierButtonClass[tier.id] || "btn btn--primary"}
                    >
                      {tier.cta}
                    </button>
                  ) : (
                    <Link
                      href={tier.href}
                      className={tierButtonClass[tier.id] || "btn btn--primary"}
                    >
                      {tier.cta}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueLadder;
