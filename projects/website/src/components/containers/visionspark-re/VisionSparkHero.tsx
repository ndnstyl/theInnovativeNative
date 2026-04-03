import React from "react";
import Image from "next/image";
import star from "public/images/star.png";
import { VISIONSPARK_RE, trustBadges } from "@/data/visionspark-re";

interface VisionSparkHeroProps {
  scrollToCheckout: () => void;
}

const VisionSparkHero = ({ scrollToCheckout }: VisionSparkHeroProps) => {
  return (
    <section className="section vs-hero fade-wrapper visionspark-re-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 text-center">
            <span className="sub-title fade-top">
              THE LISTING VIDEO BLUEPRINT
              <i className="fa-solid fa-arrow-right"></i>
            </span>
            <h1 className="title title-anim mt-4">
              AI-Staged Photos + Generative Video<br />
              for Every Listing
            </h1>
            <p className="vs-hero__subtitle fade-top">
              The complete pipeline for <strong>true AI-generated video</strong> — Veo 3.1 property walkthroughs, staged interiors, and branded listing reels. For under $10 per listing.
            </p>

            {/* Video Placeholder - will be replaced with pipeline demo */}
            <div className="vs-hero__video fade-top">
              <div className="vs-hero__video-placeholder">
                <div className="vs-hero__video-icon">
                  <i className="fa-solid fa-play"></i>
                </div>
                <p>Pipeline Demo — Coming Soon</p>
              </div>
            </div>

            {/* CTA */}
            <div className="vs-hero__ctas fade-top">
              <button
                onClick={() => {
                  const el = document.getElementById("vs-pricing");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="btn btn--primary btn--large"
              >
                Get Instant Access — ${VISIONSPARK_RE.price.earlyBird}
                <i className="fa-solid fa-arrow-right"></i>
              </button>
              <p className="vs-hero__scarcity-hint">
                <i className="fa-solid fa-fire"></i>
                First 100 buyers only — price goes to ${VISIONSPARK_RE.price.full} after
              </p>
            </div>

            {/* Trust Strip */}
            <div className="vs-hero__trust fade-top">
              {trustBadges.map((badge, index) => (
                <div key={index} className="vs-hero__trust-item">
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
      <div className="vs-hero__glow"></div>

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

export default VisionSparkHero;
