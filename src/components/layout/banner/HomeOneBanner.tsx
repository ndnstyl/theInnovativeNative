import React, { useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import banneronethumb from "public/images/banner/banner-one-thumb.png";
import star from "public/images/star.png";

gsap.registerPlugin(ScrollTrigger);

const HomeOneBanner = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const device_width = window.innerWidth;

      if (
        document.querySelectorAll(".g-ban-one").length > 0 &&
        device_width > 576
      ) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".banner",
            start: "center center",
            end: "+=100%",
            scrub: true,
            pin: false,
          },
        });

        tl.set(".g-ban-one", {
          y: "-10%",
        });

        tl.to(".g-ban-one", {
          opacity: 0,
          scale: 2,
          y: "100%",
          zIndex: -1,
          duration: 2,
        });
      }
    }
  }, []);

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
              <div className="banner__content" style={{ marginTop: '-175px' }}>
                <h1 className="text-uppercase text-start fw-9 mb-0 title-anim" style={{ transform: 'scale(0.9)', transformOrigin: 'left top' }}>
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
                      <h5 className="fw-7">20+</h5>
                      <p className="fw-5">Years in Growth</p>
                    </div>
                    <div className="single">
                      <h5 className="fw-7">$50M+</h5>
                      <p className="fw-5">Media Managed</p>
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
        <button
          className="video-frame video-btn"
          onClick={openCalendly}
          style={{ cursor: 'pointer' }}
        >
          <span className="btn btn--secondary">Book Discovery Call</span>
        </button>
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
