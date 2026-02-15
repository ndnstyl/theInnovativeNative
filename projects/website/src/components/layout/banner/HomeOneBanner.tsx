import React from "react";
import Image from "next/image";
import banneronethumb from "public/images/banner/banner-one-thumb.png";
import star from "public/images/star.png";

const HomeOneBanner = () => {
  const openCalendly = () => {
    if (typeof window !== 'undefined' && (window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({
        url: 'https://calendly.com/mike-buildmytribe/ai-discovery-call'
      });
    }
  };

  return (
    <>
      <section className="banner">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="banner__content">
                <h1 className="text-uppercase text-start fw-9 mb-0 title-anim">
                  I Build AI
                  <span className="text-stroke">Systems</span>
                  <span className="interval">
                    <i className="icon-arrow-top-right"></i> That Perform
                  </span>
                </h1>
                <div className="banner__content-inner">
                  <p>
                    Two decades diagnosing growth systems that look functional on
                    the surface and quietly fail underneath. I find what&apos;s
                    actually causal—and fix the rest.
                  </p>
                  <div className="cta section__content-cta">
                    <div className="single">
                      <h5 className="fw-7">20</h5>
                      <p className="fw-5">Years in Growth</p>
                    </div>
                    <div className="single">
                      <h5 className="fw-7">$150M+</h5>
                      <p className="fw-5">Campaigns Managed</p>
                    </div>
                    <div className="single">
                      <h5 className="fw-7">110+</h5>
                      <p className="fw-5">Clients Served</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Image
          src={banneronethumb}
          alt="Image"
          className="banner-one-thumb d-none d-sm-block g-ban-one"
        />
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
          <span className="btn btn--secondary">Book Discovery Call</span>
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
