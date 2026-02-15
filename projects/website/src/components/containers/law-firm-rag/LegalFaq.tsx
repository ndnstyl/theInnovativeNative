import React, { useState } from "react";
import Image from "next/image";
import star from "public/images/star.png";

const faqItems = [
  {
    question: "How is this different from enterprise legal AI?",
    answer: "Enterprise platforms train on public cases and generic doctrine—the same data everyone else uses. Private RAG trains only on your firm's internal documents: your briefs, your motions, your outcomes. Instead of asking 'What does the law say?' you ask 'What works for us?' That's the difference between research and institutional intelligence."
  },
  {
    question: "What data does it train on?",
    answer: "Your past cases. Your filings. Your discovery. Your expert reports. Your judge rulings. Your outcomes. Everything that makes your firm's approach unique. The system learns from your work, not from everyone else's published opinions."
  },
  {
    question: "What happens to my firm's documents?",
    answer: "Your documents are encrypted and used only for your firm's retrieval—never shared, never used for training other models, never leaving your control. For firms requiring maximum security, we offer self-hosted deployment on your own infrastructure."
  },
  {
    question: "Why only two practice areas?",
    answer: "Depth over breadth. We'd rather be excellent in Criminal Defense and Bankruptcy than mediocre across everything. Each practice area gets comprehensive coverage of your specific patterns—your judges, your jurisdiction, your strategies. We're expanding based on pilot program feedback."
  },
  {
    question: "Won't everyone eventually have enterprise AI anyway?",
    answer: "Exactly. That's the point. When everyone has the same enterprise AI, it becomes table stakes—not an advantage. The only durable advantage will be who owns their institutional intelligence. Your briefs are more valuable than their model. Your history is more predictive than their training set."
  },
  {
    question: "How long does implementation take?",
    answer: "Pilot firms are typically operational within 2-3 weeks. This includes document ingestion, index building, and initial training on your specific patterns. Your existing document management system integrates directly—no manual uploads required for firms using standard DMS platforms."
  }
];

const LegalFaq = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  return (
    <section className="section lfr-faq fade-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 text-center">
            <span className="sub-title fade-top">
              FAQ
              <i className="fa-solid fa-arrow-right"></i>
            </span>
            <h2 className="title title-anim mt-3">
              Questions Worth Asking
            </h2>
            <p className="lfr-faq__subtitle fade-top">
              The answers that matter before you decide.
            </p>
          </div>
        </div>

        <div className="row justify-content-center mt-5">
          <div className="col-12 col-lg-10">
            <div className="accordion" id="legalFaqAccordion">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className={`accordion-item lfr-faq__item fade-top ${activeIndex === index ? 'lfr-faq__item--active' : ''}`}
                >
                  <h5 className="accordion-header">
                    <button
                      className={`accordion-button ${activeIndex !== index ? 'collapsed' : ''}`}
                      onClick={() => toggleFaq(index)}
                      type="button"
                      aria-expanded={activeIndex === index}
                    >
                      {item.question}
                      <span className="faq-icon">
                        <i className={`fa-solid ${activeIndex === index ? 'fa-minus' : 'fa-plus'}`}></i>
                      </span>
                    </button>
                  </h5>
                  <div
                    className={`accordion-collapse collapse ${activeIndex === index ? 'show' : ''}`}
                  >
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

export default LegalFaq;
