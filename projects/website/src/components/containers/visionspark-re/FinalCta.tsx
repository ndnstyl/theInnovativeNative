import React from "react";
import Image from "next/image";
import star from "public/images/star.png";
import { VISIONSPARK_RE } from "@/data/visionspark-re";

interface FinalCtaProps {
  scrollToCheckout: () => void;
}

const FinalCta = ({ scrollToCheckout }: FinalCtaProps) => {
  return (
    <section className="section vs-final-cta fade-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 text-center">
            {/* Urgency Notice */}
            <div className="vs-final-cta__urgency fade-top">
              <i className="fa-solid fa-fire"></i>
              <span>Only 100 early bird spots at ${VISIONSPARK_RE.price.earlyBird} — then it&apos;s ${VISIONSPARK_RE.price.full}</span>
            </div>

            <h2 className="title title-anim mt-4">
              Your Listings Deserve Better Than<br />
              Ken Burns Zoom-and-Pan
            </h2>

            <p className="vs-final-cta__subtitle fade-top">
              Physical staging: $800-$2,900. This pipeline: under $10. The math is not close.
            </p>

            {/* Value Recap */}
            <div className="vs-final-cta__recap fade-top">
              <p>
                6 modules. 3 n8n workflows. 50 prompt templates. Airtable base. FFMPEG recipes. Compliance guide. Plus $241 in bonuses.<br />
                <strong>All for ${VISIONSPARK_RE.price.earlyBird}.</strong>
              </p>
            </div>

            {/* CTA */}
            <div className="vs-final-cta__buttons fade-top">
              <button onClick={scrollToCheckout} className="btn btn--primary btn--large">
                Get Instant Access — ${VISIONSPARK_RE.price.earlyBird}
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>

            {/* Trust Reinforcement */}
            <div className="vs-final-cta__trust fade-top">
              <div className="trust-item">
                <i className="fa-solid fa-check-circle"></i>
                <span>30-Day Money-Back Guarantee</span>
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
            <p className="vs-final-cta__tagline fade-top">
              <strong>Stop paying $2,900 for staging. Start generating for $10.</strong>
            </p>
          </div>
        </div>
      </div>

      <Image src={star} alt="" className="star star-one" aria-hidden="true" />
      <Image src={star} alt="" className="star star-two" aria-hidden="true" />
      <div className="vs-final-cta__glow"></div>

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
