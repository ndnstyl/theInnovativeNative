import React from "react";
import Image from "next/image";
import star from "public/images/star.png";
import ragFlowImage from "public/images/law-firm-rag/rag-flow-diagram.jpg";

const SolutionOverview = () => {
  return (
    <section className="section lfr-solution fade-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 text-center">
            <span className="sub-title fade-top">
              THE SOLUTION
              <i className="fa-solid fa-arrow-right"></i>
            </span>
            <h2 className="title title-anim mt-3">
              A Second Brain Trained on Your Firm
            </h2>
            <p className="lfr-solution__subtitle fade-top">
              Instead of searching for answers, ask: <strong>&quot;How did we handle this last time?&quot;</strong>
              And get an answer grounded in your own work, your own strategy, your own results.
            </p>
          </div>
        </div>

        {/* RAG Flow Diagram - Image version for desktop */}
        <div className="row justify-content-center mt-5">
          <div className="col-12">
            <div className="lfr-solution__flow-image fade-top d-none d-lg-block">
              <Image
                src={ragFlowImage}
                alt="RAG Flow: Your Briefs, Your Motions, Your Outcomes → Trained Only on Your Cases → Answers Grounded in Your Own Work"
                width={1200}
                height={400}
                style={{ width: '100%', height: 'auto', borderRadius: '12px' }}
              />
            </div>
          </div>
        </div>

        {/* RAG Flow Diagram - Text version for mobile */}
        <div className="row justify-content-center mt-5 d-lg-none">
          <div className="col-12 col-lg-10">
            <div className="lfr-solution__flow fade-top">
              <div className="flow-step">
                <div className="flow-icon">
                  <i className="fa-solid fa-folder-open"></i>
                </div>
                <h5>Your Private Data</h5>
                <p>Past cases, briefs, discovery, expert reports, outcomes</p>
              </div>

              <div className="flow-arrow">
                <i className="fa-solid fa-arrow-right"></i>
              </div>

              <div className="flow-step flow-step--center">
                <div className="flow-icon flow-icon--primary">
                  <i className="fa-solid fa-brain"></i>
                </div>
                <h5>Private RAG Engine</h5>
                <p>Institutional intelligence, not generic doctrine</p>
              </div>

              <div className="flow-arrow">
                <i className="fa-solid fa-arrow-right"></i>
              </div>

              <div className="flow-step">
                <div className="flow-icon">
                  <i className="fa-solid fa-lightbulb"></i>
                </div>
                <h5>What Works for You</h5>
                <p>Answers from your playbook, not everyone else&apos;s</p>
              </div>
            </div>
          </div>
        </div>

        {/* Practice Areas */}
        <div className="row gaper mt-5">
          <div className="col-12 col-md-6">
            <div className="lfr-solution__practice fade-top">
              <div className="practice-icon">
                <i className="fa-solid fa-gavel"></i>
              </div>
              <h4>Criminal Defense</h4>
              <p>
                Your Fourth Amendment arguments. Your Miranda approaches.
                Your sentencing strategies. Your motion success patterns
                with specific judges.
              </p>
              <div className="practice-depth">
                <span>Depth:</span>
                <div className="depth-bar">
                  <div className="depth-fill" style={{ width: '95%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="lfr-solution__practice fade-top">
              <div className="practice-icon">
                <i className="fa-solid fa-building-columns"></i>
              </div>
              <h4>Bankruptcy</h4>
              <p>
                Your Chapter 7, 11, 13 strategies. Your automatic stay arguments.
                Your preference action approaches. Your judge-specific patterns
                in your jurisdiction.
              </p>
              <div className="practice-depth">
                <span>Depth:</span>
                <div className="depth-bar">
                  <div className="depth-fill" style={{ width: '95%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The Difference */}
        <div className="row justify-content-center mt-5">
          <div className="col-12 col-lg-8">
            <div className="lfr-solution__authority fade-top">
              <h4>
                <i className="fa-solid fa-not-equal"></i>
                The Difference
              </h4>
              <div className="authority-hierarchy">
                <div className="authority-level authority-level--compare">
                  <div className="compare-item compare-item--them">
                    <span className="compare-label">Big-Box AI Asks:</span>
                    <span className="compare-question">&quot;What does the law say?&quot;</span>
                  </div>
                  <div className="compare-vs">vs</div>
                  <div className="compare-item compare-item--you">
                    <span className="compare-label">Your RAG Asks:</span>
                    <span className="compare-question">&quot;What actually works for us?&quot;</span>
                  </div>
                </div>
              </div>
              <p className="authority-note">
                That&apos;s the difference between research and institutional intelligence.
                Between using AI and compounding experience. Between speed and strategy.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Image src={star} alt="" className="star" aria-hidden="true" />
    </section>
  );
};

export default SolutionOverview;
