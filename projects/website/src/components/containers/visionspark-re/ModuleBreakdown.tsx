import React, { useState } from "react";
import Image from "next/image";
import star from "public/images/star.png";
import { modules } from "@/data/visionspark-re";

const ModuleBreakdown = () => {
  const [activeModule, setActiveModule] = useState(0);

  const toggleModule = (index: number) => {
    setActiveModule(activeModule === index ? -1 : index);
  };

  return (
    <section className="section vs-modules fade-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 text-center">
            <span className="sub-title fade-top">
              WHAT&apos;S INSIDE
              <i className="fa-solid fa-arrow-right"></i>
            </span>
            <h2 className="title title-anim mt-3">
              Six Modules. Zero Guesswork.<br />
              Everything You Need to Build.
            </h2>
            <p className="vs-modules__subtitle fade-top">
              Each module comes with video walkthroughs, downloadable assets,
              and ready-to-deploy templates.
            </p>
          </div>
        </div>

        <div className="row justify-content-center mt-5">
          <div className="col-12 col-lg-10">
            <div className="accordion" id="moduleAccordion">
              {modules.map((module, index) => (
                <div
                  key={module.id}
                  className={`accordion-item vs-modules__item fade-top ${activeModule === index ? "vs-modules__item--active" : ""}`}
                >
                  <h5 className="accordion-header">
                    <button
                      className={`accordion-button ${activeModule !== index ? "collapsed" : ""}`}
                      onClick={() => toggleModule(index)}
                      type="button"
                      aria-expanded={activeModule === index}
                    >
                      <span className="vs-modules__item-number">Module {module.id}</span>
                      <span className="vs-modules__item-title">{module.title}</span>
                      <span className="vs-modules__item-subtitle">{module.subtitle}</span>
                      <span className="faq-icon">
                        <i className={`fa-solid ${activeModule === index ? "fa-minus" : "fa-plus"}`}></i>
                      </span>
                    </button>
                  </h5>
                  <div className={`accordion-collapse collapse ${activeModule === index ? "show" : ""}`}>
                    <div className="accordion-body">
                      <ul className="vs-modules__bullets">
                        {module.bullets.map((bullet, bIndex) => (
                          <li key={bIndex}>
                            <i className="fa-solid fa-check"></i>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="vs-modules__deliverables">
                        <h6>What You Get:</h6>
                        <div className="vs-modules__deliverable-tags">
                          {module.deliverables.map((deliverable, dIndex) => (
                            <span key={dIndex} className="vs-modules__tag">
                              <i className="fa-solid fa-box-open"></i>
                              {deliverable}
                            </span>
                          ))}
                        </div>
                      </div>
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

export default ModuleBreakdown;
