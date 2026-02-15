import React from "react";
import { testimonials, Testimonial } from "@/data/testimonials";

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <div className="testimonial-card fade-top">
      <div className="testimonial-card__quote">
        <span className="quote-mark">"</span>
        <p>{testimonial.quote}</p>
      </div>
      <div className="testimonial-card__author">
        <div className="author-info">
          <h5 className="author-name">— {testimonial.author}</h5>
          {testimonial.role && (
            <p className="author-role">
              {testimonial.role}
              {testimonial.firmSize && `, ${testimonial.firmSize}`}
              {testimonial.firmType && ` ${testimonial.firmType}`}
            </p>
          )}
        </div>
        {testimonial.result && (
          <div className="testimonial-result">
            <span>{testimonial.result}</span>
          </div>
        )}
      </div>
      {testimonial.platform && (
        <div className="testimonial-platform">
          <i className="fa-brands fa-google"></i>
          <span>{testimonial.platform}</span>
        </div>
      )}
    </div>
  );
};

const Testimonials = () => {
  // Only show testimonials if we have at least 1
  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="section testimonials fade-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 text-center mb-5">
            <span className="sub-title">
              CLIENT RESULTS
              <i className="fa-solid fa-arrow-right"></i>
            </span>
            <h2 className="title title-anim mt-3">
              What Clients Say
            </h2>
          </div>
        </div>
        <div className="row gaper">
          {testimonials.slice(0, 4).map((testimonial) => (
            <div key={testimonial.id} className="col-12 col-md-6 col-lg-3">
              <TestimonialCard testimonial={testimonial} />
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

export default Testimonials;
