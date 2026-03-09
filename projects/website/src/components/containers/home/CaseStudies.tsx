import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";
import eleven from "public/images/portfolio/eleven.png";
import twelve from "public/images/portfolio/twelve.png";
import fifteen from "public/images/portfolio/fifteen.png";
import sixteen from "public/images/portfolio/sixteen.png";

const caseStudies = [
  {
    id: 0,
    image: eleven,
    title: "Automated Acquisition Pipeline",
    result: "25-30% cost reduction via AI-optimized spend",
  },
  {
    id: 1,
    image: twelve,
    title: "Signal Extraction System",
    result: "65% fewer vanity KPIs, 22% operational efficiency gain",
  },
  {
    id: 2,
    image: fifteen,
    title: "AI-Powered Revenue Recovery",
    result: "35% incremental volume from automated detection",
  },
  {
    id: 3,
    image: sixteen,
    title: "Workflow Automation Rollout",
    result: "22% efficiency gain in 2 quarters",
  },
];

const CaseStudies = () => {
  const [hover, setHover] = useState(0);

  return (
    <section className="section portfolio pb-0 fade-wrapper position-relative">
      <div className="portfolio__text-slider-w">
        <Swiper
          slidesPerView="auto"
          spaceBetween={40}
          speed={5000}
          loop={true}
          centeredSlides={true}
          modules={[Autoplay]}
          autoplay={{
            delay: 1,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
            reverseDirection: false,
          }}
          className="portfolio__text-slider"
        >
          <SwiperSlide>
            <div className="portfolio__text-slider-single">
              <h2 className="h1">
                <Link href="/portfolio">
                  systems deployed
                  <i className="fa-sharp fa-solid fa-arrow-down-right"></i>
                </Link>
              </h2>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="portfolio__text-slider-single">
              <h2 className="h1 str">
                <Link href="/portfolio">
                  systems deployed
                  <i className="fa-sharp fa-solid fa-arrow-down-right"></i>
                </Link>
              </h2>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="portfolio__text-slider-single">
              <h2 className="h1">
                <Link href="/portfolio">
                  systems deployed
                  <i className="fa-sharp fa-solid fa-arrow-down-right"></i>
                </Link>
              </h2>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="portfolio__text-slider-single">
              <h2 className="h1 str">
                <Link href="/portfolio">
                  systems deployed
                  <i className="fa-sharp fa-solid fa-arrow-down-right"></i>
                </Link>
              </h2>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="portfolio__text-slider-single">
              <h2 className="h1">
                <Link href="/portfolio">
                  systems deployed
                  <i className="fa-sharp fa-solid fa-arrow-down-right"></i>
                </Link>
              </h2>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="portfolio__text-slider-single">
              <h2 className="h1 str">
                <Link href="/portfolio">
                  systems deployed
                  <i className="fa-sharp fa-solid fa-arrow-down-right"></i>
                </Link>
              </h2>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="container-fluid">
        <div className="row gaper justify-content-center">
          {caseStudies.map((study) => (
            <div key={study.id} className="col-12 col-sm-6 col-xl-3">
              <div
                className={
                  "portfolio__single topy-tilt fade-top" +
                  (hover === study.id ? " portfolio__single-active" : " ")
                }
                onMouseEnter={() => setHover(study.id)}
              >
                <Link href="/portfolio">
                  <Image src={study.image} alt={study.title} />
                </Link>
                <div className="portfolio__single-content">
                  <Link href="/portfolio">
                    <i className="fa-sharp fa-solid fa-arrow-up-right"></i>
                  </Link>
                  <h4>
                    <Link href="/portfolio">{study.title}</Link>
                  </h4>
                  <p style={{ color: '#00FFFF', fontSize: '14px', marginTop: '4px' }}>
                    {study.result}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
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

export default CaseStudies;
