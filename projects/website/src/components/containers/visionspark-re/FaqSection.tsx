import React, { useState } from "react";
import Image from "next/image";
import star from "public/images/star.png";
import { faqItems } from "@/data/visionspark-re";

const FaqSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  return (
    <section className="section vs-faq fade-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 text-center">
            <span className="sub-title fade-top">
              FAQ
              <i className="fa-solid fa-arrow-right"></i>
            </span>
            <h2 className="title title-anim mt-3">
              Common Questions
            </h2>
            <p className="vs-faq__subtitle fade-top">
              Straight answers about the pipeline, compliance, and costs.
            </p>
          </div>
        </div>

        <div className="row justify-content-center mt-5">
          <div className="col-12 col-lg-10">
            <div className="accordion" id="vsFaqAccordion">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className={`accordion-item vs-faq__item fade-top ${activeIndex === index ? "vs-faq__item--active" : ""}`}
                >
                  <h5 className="accordion-header">
                    <button
                      className={`accordion-button ${activeIndex !== index ? "collapsed" : ""}`}
                      onClick={() => toggleFaq(index)}
                      type="button"
                      aria-expanded={activeIndex === index}
                    >
                      {item.question}
                      <span className="faq-icon">
                        <i className={`fa-solid ${activeIndex === index ? "fa-minus" : "fa-plus"}`}></i>
                      </span>
                    </button>
                  </h5>
                  <div className={`accordion-collapse collapse ${activeIndex === index ? "show" : ""}`}>
                    <div className="accordion-body">
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Image src={star} alt="" className="star" aria-hidden="true" />
    </section>
  );
};

export default FaqSection;
