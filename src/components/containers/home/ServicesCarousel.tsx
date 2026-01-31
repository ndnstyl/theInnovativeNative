import React, { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/swiper-bundle.css";

const services = [
  {
    number: "01",
    title: "Digital Marketing",
    items: [
      "PPC strategy and execution across Google Ads and Meta",
      "Local Services Ads optimization and dispute management",
      "Funnel and landing page conversion optimization",
      "Creative testing systems for paid media at scale",
      "Attribution and performance analytics tied to revenue",
    ],
  },
  {
    number: "02",
    title: "AI Systems & Automation",
    items: [
      "AI-powered intake, lead qualification, and routing",
      "n8n-based workflow automation across marketing and ops",
      "AI agents for research, content, and decision support",
      "CRM automation with Airtable, Supabase, and custom logic",
      "Human-in-the-loop systems for compliance and control",
    ],
  },
  {
    number: "03",
    title: "AI-First Growth Strategy",
    items: [
      "AI readiness audits and system gap analysis",
      "Growth stack design from traffic to revenue",
      "KPI frameworks aligned to business outcomes",
      "Experimentation systems for compounding gains",
      "Strategic advisory for AI adoption without chaos",
    ],
  },
  {
    number: "04",
    title: "Content & Distribution Systems",
    items: [
      "Short-form and long-form content engines",
      "Viral research and trend intelligence pipelines",
      "AI-assisted scripting and creative ideation",
      "Cross-platform distribution workflows",
      "Performance feedback loops tied to engagement and leads",
    ],
  },
  {
    number: "05",
    title: "Sales & Revenue Operations",
    items: [
      "Lead-to-close workflow design",
      "Speed-to-lead and response automation",
      "Sales pipeline visibility and forecasting",
      "Call tracking and qualification intelligence",
      "Revenue attribution across channels",
    ],
  },
  {
    number: "06",
    title: "Brand & Positioning Systems",
    items: [
      "Brand voice and messaging frameworks",
      "Visual brand system extraction and consistency tools",
      "Thought leadership positioning for founders",
      "Offer architecture and narrative clarity",
      "Trust-first authority building in regulated industries",
    ],
  },
  {
    number: "07",
    title: "Compliance-Aware AI Implementations",
    items: [
      "HIPAA and ABA-adjacent workflow design",
      "Data handling and access control strategies",
      "AI usage guardrails for teams",
      "Documentation-first system builds",
      "Risk-aware automation planning",
    ],
  },
];

const ServicesCarousel = () => {
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    // Ensure autoplay starts after component mounts
    if (swiperRef.current && swiperRef.current.autoplay) {
      swiperRef.current.autoplay.start();
    }
  }, []);

  return (
    <section id="services" className="section service-t">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center mb-5">
            <span className="sub-title">
              SERVICES
              <i className="fa-solid fa-arrow-right"></i>
            </span>
            <h2 className="title title-anim mt-3">What I Offer</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="service-t__slider-w">
              <Swiper
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                slidesPerView={1}
                spaceBetween={30}
                slidesPerGroup={1}
                speed={800}
                loop={true}
                centeredSlides={false}
                initialSlide={0}
                modules={[Autoplay, Navigation]}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                  waitForTransition: true,
                }}
                navigation={{
                  nextEl: ".next-service-t",
                  prevEl: ".prev-service-t",
                }}
                className="service-t__slider"
                breakpoints={{
                  1400: {
                    slidesPerView: 4,
                  },
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
        <button aria-label="previous item" className="slide-btn prev-service-t">
          <i className="fa-light fa-angle-left"></i>
        </button>
        <button aria-label="next item" className="slide-btn next-service-t">
          <i className="fa-light fa-angle-right"></i>
        </button>
      </div>
    </section>
  );
};

export default ServicesCarousel;
