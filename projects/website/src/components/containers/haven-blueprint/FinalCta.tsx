import React from "react";
import Image from "next/image";
import star from "public/images/star.png";
import { HAVEN_BLUEPRINT } from "@/data/haven-blueprint";

interface FinalCtaProps {
  scrollToCheckout: () => void;
}

const FinalCta = ({ scrollToCheckout }: FinalCtaProps) => {
  return (
    <section className="section hb-final-cta fade-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 text-center">
            {/* Urgency Notice */}
            <div className="hb-final-cta__urgency fade-top">
              <i className="fa-solid fa-fire"></i>
              <span>Only 100 early bird spots at ${HAVEN_BLUEPRINT.price.earlyBird} — then it&apos;s ${HAVEN_BLUEPRINT.price.full}</span>
            </div>

            <h2 className="title title-anim mt-4">
              Your AI Influencer Pipeline<br />
              Is One Click Away
            </h2>

            <p className="hb-final-cta__subtitle fade-top">
              You&apos;ve seen the system. You&apos;ve seen what it builds.
              The only question left is whether you&apos;re ready to
              <strong> start building</strong> your own.
            </p>

            {/* Value Recap */}
            <div className="hb-final-cta__recap fade-top">
              <p>
                6 modules. 5 workflow files. 60+ prompts. Airtable base. FFMPEG recipes.
                Content strategy playbook. Plus $171 in bonuses.<br />
                <strong>All for ${HAVEN_BLUEPRINT.price.earlyBird}.</strong>
              </p>
            </div>

            {/* CTA */}
            <div className="hb-final-cta__buttons fade-top">
              <button onClick={scrollToCheckout} className="btn btn--primary btn--large">
                Get Instant Access — ${HAVEN_BLUEPRINT.price.earlyBird}
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>

            {/* Trust Reinforcement */}
            <div className="hb-final-cta__trust fade-top">
              <div className="trust-item">
                <i className="fa-solid fa-check-circle"></i>
                <span>All sales final — real systems, real results</span>
              </div>
              <div className="trust-item">
                <i className="fa-solid fa-check-circle"></i>
                <span>Instant access after purchase</span>
              </div>
              <div className="trust-item">
                <i className="fa-solid fa-check-circle"></i>
                <span>Secure checkout via Stripe</span>
              </div>
            </div>

            {/* Closing Hook */}
            <p className="hb-final-cta__tagline fade-top">
              <strong>Build the system once. Let it create for you forever.</strong>
            </p>
          </div>
        </div>
      </div>

      <Image src={star} alt="" className="star star-one" aria-hidden="true" />
      <Image src={star} alt="" className="star star-two" aria-hidden="true" />
      <div className="hb-final-cta__glow"></div>

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

export default FinalCta;
