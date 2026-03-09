import React from "react";
import Image from "next/image";
import star from "public/images/offer/star.png";
import { serviceOfferings } from "@/data/homepage";

const HomeOffer = () => {
  const openCalendly = () => {
    if (typeof window !== 'undefined' && (window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({
        url: 'https://calendly.com/mike-buildmytribe/ai-discovery-call'
      });
    }
  };

  return (
    <section className="section offer fade-wrapper light">
      <div className="container">
        <div className="row gaper">
          <div className="col-12 col-lg-5">
            <div className="offer__content section__content">
              <span className="sub-title">
                WHAT WE BUILD
                <i className="fa-solid fa-arrow-right"></i>
              </span>
              <h2 className="title title-anim">
                Here&apos;s How the Systems Get Built
              </h2>
              <div className="paragraph">
                <p>
                  The pattern is the same — replace disconnected tools with
                  integrated AI systems. Here&apos;s what that looks like.
                </p>
              </div>
              <div className="section__content-cta">
                <button onClick={openCalendly} className="btn btn--secondary">
                  Book Discovery Call
                </button>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-7 col-xl-6 offset-xl-1">
            <div className="offer__cta">
              {serviceOfferings.map((offering, index) => (
                <div key={offering.id} className="offer__cta-single fade-top">
                  <span className="sub-title">
                    {String(index + 1).padStart(2, '0')}
                    <i className="fa-solid fa-arrow-right"></i>
                  </span>
                  <h2>
                    <span>
                      {offering.name}
                      <i className="fa-sharp fa-solid fa-arrow-up-right"></i>
                    </span>
                  </h2>
                  <p className="offer-description">
                    {offering.description}
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0 0 0' }}>
                    {offering.capabilities.map((cap, i) => (
                      <li key={i} style={{ color: '#a0a0a0', fontSize: '14px', lineHeight: '1.8', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <i className="fa-solid fa-check" style={{ color: '#00FFFF', fontSize: '10px', marginTop: '6px', flexShrink: 0 }}></i>
                        {cap}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Image src={star} alt="Image" className="star" />
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

export default HomeOffer;
