import React, { useState } from 'react';
import { N8nTemplate } from '@/data/templates';

interface TemplateWalkthroughProps {
  template: N8nTemplate;
}

const TemplateWalkthrough = ({ template }: TemplateWalkthroughProps) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="template-walkthrough">
      <section className="template-walkthrough__section">
        <h2 className="template-walkthrough__section-title">Overview</h2>
        <p className="template-walkthrough__section-text">{template.walkthrough.overview}</p>
      </section>

      <section className="template-walkthrough__section">
        <h2 className="template-walkthrough__section-title">Features</h2>
        <ul className="template-walkthrough__features-list">
          {template.walkthrough.features.map((feature, index) => (
            <li key={index}>
              <i className="fa-solid fa-star"></i>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="template-walkthrough__section">
        <h2 className="template-walkthrough__section-title">Setup Steps</h2>
        <div className="template-walkthrough__steps">
          {template.walkthrough.setupSteps.map((step, index) => (
            <div key={index} className="template-walkthrough__step">
              <div className="template-walkthrough__step-number">{index + 1}</div>
              <div className="template-walkthrough__step-content">
                <h3 className="template-walkthrough__step-title">{step.title}</h3>
                <p className="template-walkthrough__step-description">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="template-walkthrough__section">
        <h2 className="template-walkthrough__section-title">Use Cases</h2>
        <div className="template-walkthrough__use-cases">
          {template.walkthrough.useCases.map((useCase, index) => (
            <div key={index} className="template-walkthrough__use-case">
              <h3 className="template-walkthrough__use-case-title">
                <i className="fa-solid fa-lightbulb"></i>
                {useCase.title}
              </h3>
              <p className="template-walkthrough__use-case-description">{useCase.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="template-walkthrough__section">
        <h2 className="template-walkthrough__section-title">Troubleshooting</h2>
        <div className="template-walkthrough__faq">
          {template.walkthrough.troubleshooting.map((faq, index) => (
            <div
              key={index}
              className={`template-walkthrough__faq-item ${
                openFaqIndex === index ? 'template-walkthrough__faq-item--open' : ''
              }`}
            >
              <button
                className="template-walkthrough__faq-question"
                onClick={() => toggleFaq(index)}
              >
                <span>{faq.question}</span>
                <i className={`fa-solid fa-chevron-${openFaqIndex === index ? 'up' : 'down'}`}></i>
              </button>
              {openFaqIndex === index && (
                <div className="template-walkthrough__faq-answer">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TemplateWalkthrough;
