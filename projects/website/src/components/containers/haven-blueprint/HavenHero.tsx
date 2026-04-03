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
              TWINGEN
              <i className="fa-solid fa-arrow-right"></i>
            </span>
            <h1 className="title title-anim mt-4">
              Build Your Own AI Influencer<br />
              From Scratch
            </h1>
            <p className="hb-hero__subtitle fade-top">
              The complete automation system for AI-generated content — from character creation
              to published videos. No coding. No guesswork. See how we built <strong>aSliceOfHaven</strong>.
            </p>

            {/* System Preview */}
            <div className="hb-hero__video fade-top">
              <div className="hb-hero__video-placeholder" style={{
                background: 'linear-gradient(135deg, rgba(0,255,255,0.08) 0%, rgba(0,0,0,0.4) 100%)',
                border: '1px solid rgba(0,255,255,0.2)',
              }}>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <i className="fa-solid fa-robot" style={{ fontSize: '48px', color: '#00FFFF', marginBottom: '16px', display: 'block' }}></i>
                  <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>The TwinGen System</h3>
                  <p style={{ color: '#a0a0a0', fontSize: '14px', maxWidth: '400px', margin: '0 auto' }}>
                    Character creation &rarr; AI image &amp; video generation &rarr; automated assembly &rarr; multi-platform publishing. Built once, runs forever.
                  </p>
                </div>
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
