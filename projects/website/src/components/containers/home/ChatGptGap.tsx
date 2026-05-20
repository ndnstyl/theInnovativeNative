import React from "react";

const ChatGptGap = () => {
  return (
    <section id="chatgpt-gap" className="section chatgpt-gap fade-wrapper">
      <div className="container">
        <div className="row gaper">
          <div className="col-12">
            <div className="section__content">
              <span className="sub-title">
                THE DIFFERENCE
                <i className="fa-solid fa-arrow-right"></i>
              </span>
              <h2 className="title title-anim">
                There&apos;s a Difference Between Using AI and Having AI Run
                Your Business
              </h2>
              <div className="paragraph">
                <p>
                  Most businesses use ChatGPT for one-off tasks. That&apos;s a
                  tool, not infrastructure. Here&apos;s what changes when AI
                  actually runs your operations.
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="chatgpt-gap__basic fade-top">
              <div className="chatgpt-gap__header">
                <i className="fa-solid fa-comment-dots"></i>
                <h3>Using ChatGPT</h3>
              </div>
              <ul className="chatgpt-gap__list">
                <li>
                  <i className="fa-solid fa-xmark"></i>
                  <span>
                    Ad hoc prompts &mdash; start from scratch every time
                  </span>
                </li>
                <li>
                  <i className="fa-solid fa-xmark"></i>
                  <span>Manual copy-paste between tools</span>
                </li>
                <li>
                  <i className="fa-solid fa-xmark"></i>
                  <span>One task at a time, one person at a time</span>
                </li>
                <li>
                  <i className="fa-solid fa-xmark"></i>
                  <span>Knowledge resets every conversation</span>
                </li>
                <li>
                  <i className="fa-solid fa-xmark"></i>
                  <span>You do the work, AI assists</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="chatgpt-gap__infrastructure fade-top">
              <div className="chatgpt-gap__header">
                <i className="fa-solid fa-diagram-project"></i>
                <h3>AI Infrastructure</h3>
              </div>
              <ul className="chatgpt-gap__list">
                <li>
                  <i className="fa-solid fa-check"></i>
                  <span>Automated workflows that trigger themselves</span>
                </li>
                <li>
                  <i className="fa-solid fa-check"></i>
                  <span>
                    Integrated pipelines connecting all your tools
                  </span>
                </li>
                <li>
                  <i className="fa-solid fa-check"></i>
                  <span>Parallel operations running 24/7</span>
                </li>
                <li>
                  <i className="fa-solid fa-check"></i>
                  <span>
                    Institutional memory that compounds over time
                  </span>
                </li>
                <li>
                  <i className="fa-solid fa-check"></i>
                  <span>The system does the work, you make decisions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatGptGap;
