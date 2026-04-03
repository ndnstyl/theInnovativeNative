import React from "react";
import Image from "next/image";
import banneronethumb from "public/images/banner/banner-one-thumb.png";
import star from "public/images/star.png";
import { CALENDLY_URL } from "@/lib/constants";

const HomeOneBanner = () => {
  const openCalendly = () => {
    if (typeof window !== 'undefined' && (window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({
        url: CALENDLY_URL
      });
    }
  };

  return (
    <>
      <section className="banner banner--hero-grid">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="banner__content">
                <h1 className="text-uppercase text-start fw-9 mb-0 title-anim">
                  I Build AI
                  <span className="text-stroke">Systems</span>
                  <span className="interval">
                    <i className="icon-arrow-top-right"></i> To Run Business
                  </span>
                </h1>
              </div>
            </div>
          </div>
          <div className="banner__hero-row">
            <div className="banner__hero-text">
              <p>
                Most businesses use ChatGPT and call it AI. We build the actual
                infrastructure — automated workflows, integrated data pipelines,
                and AI agents that replace your fragmented SaaS stack and give
                you back 10-20 hours a week.
              </p>
              <div className="cta section__content-cta">
                <div className="single">
                  <h5 className="fw-7">20</h5>
                  <p className="fw-5">Years Building Systems</p>
                </div>
                <div className="single">
                  <h5 className="fw-7">4</h5>
                  <p className="fw-5">Verticals Served</p>
                </div>
                <div className="single">
                  <h5 className="fw-7">10-20</h5>
                  <p className="fw-5">Hours Returned Weekly</p>
                </div>
              </div>
            </div>
            <div className="banner__hero-image">
              <Image
                src={banneronethumb}
                alt="Michael Soto"
                className="banner__hero-photo"
              />
            </div>
          </div>
        </div>
        <Image src={star} alt="Image" className="star" />
        <div className="banner-left-text banner-social-text d-none d-md-flex">
          <a href="mailto:info@theinnovativenative.com">info@theinnovativenative.com</a>
        </div>
        <div className="banner-right-text banner-social-text d-none d-md-flex">
          <a href="https://www.linkedin.com/in/michael-soto-7134ba158/" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href="https://www.facebook.com/theinnovativenativellc" target="_blank" rel="noopener noreferrer">
            Facebook
          </a>
        </div>
        <div className="video-frame video-btn" onClick={openCalendly} style={{ cursor: 'pointer' }}>
          <span className="btn btn--primary">Book a Discovery Call</span>
        </div>
        <div className="lines d-none d-lg-flex">
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
      </section>
    </>
  );
};

export default HomeOneBanner;
