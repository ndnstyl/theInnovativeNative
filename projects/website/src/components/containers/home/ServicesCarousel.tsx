import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/swiper-bundle.css";

const services = [
  {
    number: "01",
    title: "AI System Design",
    items: [
      "Custom AI agents that handle real work, not demos",
      "Lead intake, qualification, and routing that runs without you",
      "Decision-support systems built around how your team actually operates",
      "Human-in-the-loop controls so nothing goes rogue",
      "Architecture that holds up when attention moves elsewhere",
    ],
  },
  {
    number: "02",
    title: "Automation Infrastructure",
    items: [
      "n8n workflow builds connecting your entire stack end to end",
      "CRM and data pipeline automation across Airtable, Supabase, and APIs",
      "Speed-to-lead systems that close the gap between inquiry and response",
      "Content production pipelines from script to publish",
      "Monitoring and fallback logic so things fail gracefully, not silently",
    ],
  },
  {
    number: "03",
    title: "AI Training & Education",
    items: [
      "AI readiness audits that tell you where you actually stand",
      "Hands-on workshops for teams adopting AI tools for the first time",
      "Prompt engineering and workflow design training",
      "Playbooks your team can run without calling you back",
      "Ongoing advisory for teams scaling AI across departments",
    ],
  },
];

const ServicesCarousel = () => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  const handlePrev = () => {
    if (swiperInstance) {
      swiperInstance.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperInstance) {
      swiperInstance.slideNext();
    }
  };

  return (
    <section id="services" className="section service-t">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center mb-5">
            <span className="sub-title">
              SERVICES
              <i className="fa-solid fa-arrow-right"></i>
            </span>
            <h2 className="title title-anim mt-3">What I Build</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="service-t__slider-w">
              <Swiper
                onSwiper={(swiper) => {
                  setSwiperInstance(swiper);
                }}
                slidesPerView={1}
                spaceBetween={30}
                slidesPerGroup={1}
                speed={600}
                loop={false}
                rewind={true}
                initialSlide={0}
                modules={[Autoplay, Navigation]}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                observer={true}
                observeParents={true}
                className="service-t__slider"
                breakpoints={{
                  1200: {
                    slidesPerView: 3,
                  },
                  768: {
                    slidesPerView: 2,
                  },
                }}
              >
                {services.map((service, index) => (
                  <SwiperSlide key={index}>
                    <div className="service-t-single-wrapper">
                      <div className="service-t__slider-single">
                        <div className="intro">
                          <span className="sub-title">
                            {service.number}
                            <i className="fa-solid fa-arrow-right"></i>
                          </span>
                          <h4>{service.title}</h4>
                        </div>
                        <ul>
                          {service.items.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
      <div className="slide-group">
        <button
          aria-label="previous item"
          className="slide-btn prev-service-t"
          onClick={handlePrev}
        >
          <i className="fa-light fa-angle-left"></i>
        </button>
        <button
          aria-label="next item"
          className="slide-btn next-service-t"
          onClick={handleNext}
        >
          <i className="fa-light fa-angle-right"></i>
        </button>
      </div>
    </section>
  );
};

export default ServicesCarousel;
