import React from "react";
import Image from "next/image";
import star from "public/images/star.png";

const testimonials = [
  {
    quote: "Our best attorney retired last year. We thought we'd lost 30 years of institutional knowledge. Now associates can ask questions and get answers informed by his entire body of work. It's like he never left.",
    role: "Managing Partner",
    firm: "Regional Bankruptcy Firm",
    rating: 5
  },
  {
    quote: "Research that used to take half a day now takes 20 minutes. But the real value isn't speed—it's that I'm finding arguments we actually won with, not just generic doctrine from a database.",
    role: "Senior Associate",
    firm: "Criminal Defense Practice",
    rating: 5
  },
  {
    quote: "Every citation is traceable. Every argument is sourced. For the first time, I can trust AI output enough to build on it. No more hallucinated cases. No more fabricated quotes.",
    role: "Of Counsel",
    firm: "Chapter 11 Specialist Firm",
    rating: 5
  }
];

const TestimonialsSection = () => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i
        key={index}
        className={`fa-solid fa-star ${index < rating ? 'filled' : ''}`}
      ></i>
    ));
  };

  return (
    <section className="section lfr-testimonials fade-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 text-center">
            <span className="sub-title fade-top">
              FROM THE FIELD
              <i className="fa-solid fa-arrow-right"></i>
            </span>
            <h2 className="title title-anim mt-3">
              What Legal Professionals Say
            </h2>
            <p className="lfr-testimonials__subtitle fade-top">
              Real feedback from firms building their institutional intelligence.
            </p>
          </div>
        </div>

        <div className="row gaper mt-5">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="col-12 col-lg-4">
              <div className="lfr-testimonials__card fade-top">
                <div className="lfr-testimonials__card-quote">
                  <i className="fa-solid fa-quote-left"></i>
                </div>
                <div className="lfr-testimonials__card-rating">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="lfr-testimonials__card-text">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="lfr-testimonials__card-author">
                  <div className="lfr-testimonials__card-avatar">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  <div className="lfr-testimonials__card-info">
                    <span className="lfr-testimonials__card-role">{testimonial.role}</span>
                    <span className="lfr-testimonials__card-firm">{testimonial.firm}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Image src={star} alt="" className="star" aria-hidden="true" />

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

export default TestimonialsSection;
