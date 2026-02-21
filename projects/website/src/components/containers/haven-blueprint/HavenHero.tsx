import React from "react";
import Image from "next/image";
import star from "public/images/star.png";
import { HAVEN_BLUEPRINT, trustBadges } from "@/data/haven-blueprint";

interface HavenHeroProps {
  scrollToCheckout: () => void;
}

const HavenHero = ({ scrollToCheckout }: HavenHeroProps) => {
  return (
    <section className="section hb-hero fade-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 text-center">
            <span className="sub-title fade-top">
              THE AI INFLUENCER BLUEPRINT
              <i className="fa-solid fa-arrow-right"></i>
            </span>
            <h1 className="title title-anim mt-4">
              Build Your Own AI Influencer<br />
              From Scratch
            </h1>
            <p className="hb-hero__subtitle fade-top">
              The exact system behind <strong>aSliceOfHaven</strong> — from AI image generation
              to automated video production. No coding. No guesswork. Just the blueprint.
            </p>

            {/* Video Placeholder - will be replaced with Remotion VSL */}
            <div className="hb-hero__video fade-top">
              <div className="hb-hero__video-placeholder">
                <div className="hb-hero__video-icon">
                  <i className="fa-solid fa-play"></i>
                </div>
                <p>System Overview — Coming Soon</p>
              </div>
            </div>

            {/* CTA */}
            <div className="hb-hero__ctas fade-top">
              <button onClick={scrollToCheckout} className="btn btn--primary btn--large">
                Get Instant Access — ${HAVEN_BLUEPRINT.price.earlyBird}
                <i className="fa-solid fa-arrow-right"></i>
              </button>
              <p className="hb-hero__scarcity-hint">
                <i className="fa-solid fa-fire"></i>
                First 100 buyers only — price goes to ${HAVEN_BLUEPRINT.price.full} after
              </p>
            </div>

            {/* Trust Strip */}
            <div className="hb-hero__trust fade-top">
              {trustBadges.map((badge, index) => (
                <div key={index} className="hb-hero__trust-item">
                  <i className={`fa-solid fa-${badge.icon}`}></i>
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Image src={star} alt="" className="star star-one" aria-hidden="true" />
      <Image src={star} alt="" className="star star-two" aria-hidden="true" />
      <div className="hb-hero__glow"></div>

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

export default HavenHero;
